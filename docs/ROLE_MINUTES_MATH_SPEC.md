# Especificación matemática de Role & Minutes

## 1. Estado, alcance y autoridad

**Estado:** cierre matemático G3C-3; ecuaciones y samplers normativos,
calibración numérica pendiente.  
**Fecha:** 2026-07-29.  
**Decisiones cubiertas:** G3B-C02–C06 y G3B-F03.  
**DR relacionadas:** DR-008, DR-021, DR-042, DR-044, DR-054, DR-057,
DR-063, DR-064 y DR-067.  
**ADR:** [ADR-072](adr/072-role-minutes-and-availability-mathematics.md).

Este documento selecciona las ecuaciones, samplers, contratos de streams,
invariantes y requerimientos de calibración para resolver rol y participación
agregada. No implementa gameplay ni define la generación del calendario,
Performance, Health, disciplina o contexto del club.

Ante una discrepancia, prevalecen:

1. `MASTER_SPEC v0.8`;
2. ADR aceptados;
3. [`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md);
4. este documento para el scope G3C-3;
5. los specs estructurales G3B.

## 2. Ownership y orden causal

El resolver consume estado y contexto ya preparados. No recalcula inputs de
otros owners.

```text
Club/Selection context + Calendar opportunity
Health + Discipline + Other availability sources
Player state + previous closed-window evidence
                         |
                         v
                 AvailabilityAggregator
                         |
                         v
                  SportingRole resolver
                         |
                         v
                 minute-share resolver
                         |
                         v
           competition/position apportionment
                         |
                         v
              appearances/starts resolver
                         |
                         v
                 Role/Minutes facts
                         |
                         v
                    Performance(Q)
```

`Performance(Q)` nunca alimenta los minutos de esa misma Q. Solo un resumen de
una ventana ya cerrada puede entrar como `previousPerformanceSignal`.

Owners:

| Concepto | Owner | Role & Minutes |
|---|---|---|
| `PositionSuitability` | Player/Creation | consume |
| `effectivePosition` | posición efectiva/retraining | consume y registra uso |
| `TacticalFit` | Club/context adapter | consume |
| `managerTrust` | estado dinámico/manager context | consume |
| `PositionCompetition` | Club/National Team context | consume |
| `MedicalAvailabilityEnvelope` | Health | consume |
| disciplina | Discipline/Competition policy | consume |
| `TeamMinutesOpportunity` | Calendar/Competitions | consume |
| `SportingRole`, minutos, appearances/starts | Role & Minutes | produce |
| Performance | Performance | no recalcula |

## 3. Tiempo y contextos canónicos

### 3.1 SeasonId y Q

El identificador temporal mecánico mínimo es:

```text
SeasonId = {
  careerId,
  seasonOrdinal
}

seasonOrdinal ∈ integer, seasonOrdinal >= 0
quarterIndex ∈ {0,1,2,3}
```

`Q1..Q4` son ventanas agregadas ordenadas, no trimestres civiles ni partidos.
Una coordenada temporal derivada puede usar:

```text
windowStartYear = seasonOrdinal + quarterIndex / 4
windowMidpointYear = seasonOrdinal + (quarterIndex + 0.5) / 4
```

No se persiste una fecha del reloj real. El año visible, etiquetas y formatos
de calendario continúan bajo DR-021.

### 3.2 ParticipationContext

```text
ParticipationContext =
  CLUB {
    teamId,
    managerContextId,
    clubTrustSignal
  }
  |
  NATIONAL_TEAM {
    nationalTeamId,
    selectionContextId,
    incumbencySignal
  }
```

El mismo núcleo matemático puede reutilizarse mediante adapters, pero no
fusiona estados. `clubTrustSignal` no es `incumbencySignal`; club minutes e
international minutes se persisten en scopes distintos.

## 4. Inputs canónicos

Para una resolución `(careerId, SeasonId, Q, ParticipationContext, playerId)`:

| Input | Dominio | Owner |
|---|---|---|
| `positionSuitability` | `(0,1)` | Player/Creation |
| `effectivePosition` | `Position` | Position system |
| `tacticalFit` | `[0,1]` | Context adapter |
| `trustSignal` | `[-1,1]` | Context-specific state |
| `positionCompetition` | tres componentes `[0,1]` | Club/Selection |
| `previousRole` | role o `NONE` | historial cerrado |
| `previousPerformance` | resumen normalizado | Performance |
| `formSignal` | `[-1,1]` | Performance/Dynamic state |
| `contextFeatures` | map tipado de `[-1,1]` | owners autorizados |
| `squadStatus` | `SquadStatus` | Club/Selection adapter |
| availability envelopes | asignaciones agregadas | owners respectivos |
| `teamMinutesOpportunity` | contrato de §10 | Calendar/Competitions |

Todo número debe ser binary64 finito. El resolver rechaza NaN, infinitos,
`-0` canónico, features desconocidas, dominios inválidos y contextos que no
coincidan.

## 5. Señales normalizadas

### 5.1 RoleQualitySignal

No existe Overall. Se reutiliza la `PositionSuitability` de G3C-2:

```text
rawSuitability = PositionSuitability(player, effectivePosition)

qualitySignal =
  tanh(
    (stableLogit(rawSuitability) - qualityCenter[contextKind, position])
    / qualityScale[contextKind, position]
  )
```

Dominio:

```text
qualitySignal ∈ (-1,1)
qualityScale[contextKind, position] > 0
```

La transformación es monótona en `rawSuitability`. `qualityCenter` y
`qualityScale` normalizan contexto/posición sin crear una capability nueva.

### 5.2 TacticalFit

El contrato upstream es:

```text
tacticalFit ∈ [0,1]
fitSignal = 2 * tacticalFit - 1
fitSignal ∈ [-1,1]
```

TacticalFit sigue siendo derivado de jugador, posición y contexto táctico. No
se persiste como capability. G3C-6 debe cerrar su predictor upstream; este
contrato basta para implementar su consumo.

### 5.3 ManagerTrust / incumbency

Cada adapter entrega:

```text
trustSignal ∈ [-1,1]
```

La transformación desde el estado persistido pertenece al owner y queda
versionada en el mismo `EngineParameterSet`. Role & Minutes no actualiza
managerTrust ni incumbency.

### 5.4 PreviousPerformanceSignal

Performance entrega:

```text
previousPerformance = {
  relativeSignal ∈ [-1,1],
  evidenceStrength ∈ [0,1],
  sourceWindowId
}

previousPerformanceSignal =
  relativeSignal * evidenceStrength
```

Sin evidencia previa, o con `evidenceStrength=0`, la señal es `0`. No se
consumen raw goals/assists ni se recalcula Performance.

### 5.5 Form y contexto

```text
formSignal ∈ [-1,1]
contextFeatures[k] ∈ [-1,1]
```

El catálogo de `contextFeatures` es tipado, allowlisted y versionado. Una
señal de reputación solo puede incluirse cuando el adapter y el parámetro la
autoricen. Un path desconocido es error, no valor cero implícito.

## 6. PositionCompetition

Input agregado:

```text
PositionCompetition = {
  competitionStrength ∈ [0,1],
  competitionDepth ∈ [0,1],
  entrenchment ∈ [0,1]
}
```

Transformación:

```text
wStrength >= 0
wDepth >= 0
wEntrenchment >= 0
wStrength + wDepth + wEntrenchment = 1

competitionRaw =
    wStrength * competitionStrength
  + wDepth * competitionDepth
  + wEntrenchment * entrenchment

competitionSignal = 2 * competitionRaw - 1
```

`competitionSignal ∈ [-1,1]`. Los coeficientes que lo consumen entran con
signo negativo y son no negativos. Manteniendo lo demás fijo, aumentar
cualquiera de sus componentes no aumenta la oportunidad esperada. Una
interacción que rompa esta monotonicidad requeriría una revisión del ADR y no
puede introducirse como parámetro libre.

## 7. SportingRole

### 7.1 Catálogo y orden

Orden canónico:

```text
BENCH < ROTATION < STARTER < KEY_PLAYER < STAR
```

Para cada candidato `r`:

```text
u_r =
    roleBase[contextKind, position, r]
  + betaQuality[r] * qualitySignal
  + betaFit[r] * fitSignal
  + betaTrust[r] * trustSignal
  - betaCompetition[r] * competitionSignal
  + betaPreviousPerformance[r] * previousPerformanceSignal
  + betaForm[r] * formSignal
  + squadStatusEffect[squadStatus, r]
  + transitionEffect[previousRole, r]
  + sum_k(betaContext[r,k] * contextFeatures[k])

P(role=r) = stableSoftmax(u)_r
```

Todos los coeficientes y utilities deben ser finitos. Para señales cuya
interpretación es “más favorece mayor rol”:

```text
betaX[BENCH] <= betaX[ROTATION] <= ... <= betaX[STAR]
```

Para identificación, la columna `BENCH` de cada familia de efectos
relativos es `0`; no es un valor de balance oculto sino una parametrización de
referencia. Sumar una constante a todas las utilities no cambia el resultado.

### 7.2 Persistencia

Se adopta una matriz completa:

```text
transitionEffect[previousRole, candidateRole]
```

en lugar de un único bonus diagonal. Reglas:

- cada fila es finita;
- la columna `BENCH` es la referencia `0`;
- el elemento diagonal es el máximo de su fila;
- la fila `NONE` contiene ceros;
- ninguna celda usa `-Infinity`;
- ninguna transición recibe probabilidad exactamente cero.

La matriz permite calibrar continuidad y cambios graduales sin impedir saltos
extremos. No existe cooldown ni permanencia mínima.

### 7.3 SquadStatus

`SquadStatus` entra mediante `squadStatusEffect`; no determina el role.

No se declara ningún par `SquadStatus`/`SportingRole` lógicamente
incompatible en el modelo actual. En particular, `PROSPECT` puede coexistir
con `STARTER`, `KEY_PLAYER` o `STAR`. Registro de competición y disponibilidad
son restricciones separadas.

### 7.4 Sampler categórico

Se consume un uniforme `u ∈ [0,1)` y se selecciona el primer role, en orden
canónico, cuya probabilidad acumulada sea estrictamente mayor que `u`. La
última categoría absorbe únicamente error residual de suma dentro de la
tolerancia numérica; no altera sus probabilidades.

Con utilities finitas, todas las categorías conservan probabilidad positiva.

## 8. Composición de Availability

### 8.1 Unidad causal

Calendar/Competitions representa cada oportunidad de Q/competición como un
intervalo canónico de **ordinales abstractos de minuto de jugador**:

```text
[0, teamMinutesOpportunity)
```

No son timestamps, partidos ni minutos reales de reloj. Solo preservan medida
y solapamiento dentro de la oportunidad agregada.

Cada source produce una unión finita y canónica de intervalos semiabiertos:

```text
UnavailableExposureAllocation = {
  sourceId,
  sourceKind: MEDICAL | DISCIPLINARY | OTHER,
  competitionId,
  intervals: sorted disjoint [start, end)
}

0 <= start < end <= teamMinutesOpportunityByCompetition
```

Owners:

- Health produce la asignación `MEDICAL`;
- Discipline/Competition policy produce `DISCIPLINARY`;
- cada causa `OTHER` conserva owner e identidad tipados;
- `AvailabilityAggregator`, en la orquestación del engine, compone.

### 8.2 Unión exacta

Por competición `c`:

```text
U_c = union over all sources of their intervals
unavailableMinutes_c = cardinality(U_c)
availableMinutes_c =
  teamMinutesOpportunity_c - unavailableMinutes_c
```

Para la ventana:

```text
teamMinutesOpportunity = sum_c(teamMinutesOpportunity_c)
availableMinutes = sum_c(availableMinutes_c)

availabilityShare =
  if teamMinutesOpportunity = 0
  then 0
  else availableMinutes / teamMinutesOpportunity
```

La unión evita doble contabilizar causas solapadas. No se usa suma de shares,
mínimo ni producto de disponibilidades.

Si más de una fuente solo entrega shares sin asignación capaz de expresar
solapamiento, la composición falla con:

```text
AVAILABILITY_OVERLAP_UNSPECIFIED
```

No se inventa independencia ni precedencia. La asignación médica y el
`availabilityShare` comunicado por Health deben coincidir exactamente tras
cuantización o se rechazan con `MEDICAL_AVAILABILITY_INCONSISTENT`.

Restricciones físicas que no eliminan oportunidad temporal permanecen en
`physicalRestrictions`; no se convierten automáticamente en minutos perdidos.

### 8.3 Cuantización

`teamMinutesOpportunity_c`, interval endpoints, `availableMinutes_c` y
`availableMinutes` son enteros no negativos. La forma normativa equivalente:

```text
availableMinutes =
  ROUND_HALF_EVEN(teamMinutesOpportunity * availabilityShare)
```

produce el entero exacto ya obtenido por la unión. Se valida:

```text
0 <= availableMinutes <= teamMinutesOpportunity
```

La composición no consume RNG.

## 9. Modelo Logit-Normal de minute share

### 9.1 Predictor

Condicionado al role sampleado:

```text
muMinutes =
    minuteIntercept[contextKind, position, role]
  + gammaQuality * qualitySignal
  + gammaFit * fitSignal
  + gammaTrust * trustSignal
  - gammaCompetition * competitionSignal
  + gammaPreviousPerformance * previousPerformanceSignal
  + gammaForm * formSignal
  + sum_k(gammaContext[k] * contextFeatures[k])

zMinutes =
    muMinutes
  + sigmaTeam[contextKind, position] * Z_team
  + sigmaPlayer[contextKind, position] * Z_player

minuteShare = stableSigmoid(zMinutes)

actualMinutes =
  ROUND_HALF_EVEN(availableMinutes * minuteShare)
```

`Z_team` y `Z_player` son normales estándar independientes obtenidas mediante
`StandardNormalInverseCdfV1`.

Restricciones del ParameterSet:

```text
gammaQuality, gammaFit, gammaTrust,
gammaCompetition, gammaPreviousPerformance, gammaForm >= 0

sigmaTeam >= 0
sigmaPlayer > 0

minuteIntercept[BENCH]
  < minuteIntercept[ROTATION]
  < minuteIntercept[STARTER]
  < minuteIntercept[KEY_PLAYER]
  < minuteIntercept[STAR]
```

Los coeficientes de contexto declaran signo y semántica. Para garantizar el
orden esperado por role, los demás coeficientes y sigmas son comunes entre
roles dentro de un mismo contexto/posición.

Esto garantiza:

```text
E[minuteShare | BENCH] < ... < E[minuteShare | STAR]
```

manteniendo iguales los demás inputs. No garantiza orden entre dos outcomes
sampleados: un BENCH puede superar a un STAR concreto y viceversa.

### 9.2 ExpectedMinutes

`expectedMinutes` es la expectativa pre-sample de la distribución
Logit-Normal, condicionada al role ya sampleado y a los inputs conocidos. Como
la media Logit-Normal no tiene forma elemental cerrada, el valor normativo es
su aproximación numérica determinista GH10:

```text
sigmaTotal = sqrt(sigmaTeam^2 + sigmaPlayer^2)

expectedShare =
  LogitNormalMeanGaussHermite10V1(muMinutes, sigmaTotal)

expectedMinutes = availableMinutes * expectedShare
```

Se conserva como binary64 derivado para auditoría/narrativa. Una proyección
entera usa `ROUND_HALF_EVEN`, pero no reemplaza `actualMinutes`.
`expectedMinutes` es `INTERNAL_SIGNAL`, no `PERSISTED_DOMAIN_FACT`.

### 9.3 Disponibilidad cero

Si `availableMinutes=0`:

- SportingRole se resuelve normalmente, porque sigue representando
  expectativa institucional/deportiva;
- `expectedMinutes=0`;
- `actualMinutes=0`;
- no se consumen draws `Z_team`, `Z_player`, allocation, appearance o start;
- solo se consume el draw categórico de role, salvo que otra regla lógica
  externa haya determinado el role sin azar.

No consumir draws para un resultado físicamente determinado forma parte del
contrato de stream.

## 10. TeamMinutesOpportunity

Contrato mínimo:

```text
TeamMinutesOpportunity = {
  seasonId,
  quarter,
  participationContext,
  segments: CompetitionMinutesOpportunity[]
}

CompetitionMinutesOpportunity = {
  competitionId,
  competitionType,
  teamMinutes: integer >= 0,
  appearanceOpportunityCount: integer >= 0,
  maxStartMinutesPerAppearance: integer > 0,
  maxNonStartMinutesPerAppearance: integer >= 0,
  scheduleDifficulty ∈ [-1,1],
  congestionSignal ∈ [-1,1],
  pressureExposure ∈ [0,1],
  canonicalOrder
}
```

Invariantes por segmento:

```text
0 <= maxNonStartMinutesPerAppearance
   < maxStartMinutesPerAppearance

teamMinutes
  <= appearanceOpportunityCount * maxStartMinutesPerAppearance
```

Unidad: minutos/equivalentes agregados físicamente utilizables por un jugador
en esa competición y Q. No exige fixtures ni precisión diaria. G3C-6 debe
cerrar cómo se generan estos valores; G3C-3 cierra cómo se consumen.

## 11. Asignación por competición

Los minutos se resuelven una vez y luego se distribuyen, sin duplicarlos.
Para cada segmento con `availableMinutes_c>0`:

```text
allocationUtility_c =
    log(availableMinutes_c)
  + allocationIntercept[contextKind, competitionType, role]
  + sum_j(allocationContextWeight[j] * competitionFeature[c,j])
  + allocationSigma * Z_allocation,c

rawWeight_c = stableSoftmax(allocationUtility)_c
```

Se aplica `CappedSoftmaxApportionmentV1`:

1. obtiene el target continuo proporcional;
2. redistribuye iterativamente masa de categorías que alcanzarían
   `availableMinutes_c`;
3. toma floors enteros;
4. asigna los restos por mayor parte fraccionaria;
5. desempata por `canonicalOrder`/`competitionId`;
6. nunca excede un cap y conserva suma exacta.

```text
sum_c(actualMinutes_c) = actualMinutes
0 <= actualMinutes_c <= availableMinutes_c
```

No se samplea cada competición como un proceso independiente de minutos.

## 12. EffectivePosition y multiposición

Para el vertical slice se adopta:

```text
positionUsageMode = DOMINANT_ONLY
usageByPosition = {
  effectivePosition: actualMinutes
}
```

Cada Q tiene una `effectivePosition` dominante ya resuelta upstream. Role &
Minutes no cambia `primaryPosition`, no ejecuta retraining y no inventa una
posición.

La extensión `MULTI_POSITION` puede usar utilities y softmax conjunto sobre
posiciones elegibles, seguido del mismo apportionment entero:

```text
sum_p(positionMinuteShares_p) = 1
sum_p(positionMinutes_p) = actualMinutes
```

No se habilita en el slice hasta contar con ParameterSet, tests y consumidores
que lo requieran. Las posiciones nunca se samplean independientemente.

## 13. Appearances y starts

Se resuelven por segmento de competición después de los minutos.

Notación por segmento:

```text
A = actualMinutes_c
M = appearanceOpportunityCount
dS = maxStartMinutesPerAppearance
dN = maxNonStartMinutesPerAppearance
```

Si `A=0`, entonces `appearances=starts=0` y no se consumen draws.

### 13.1 Appearances

Mínimo lógico necesario para alojar los minutos:

```text
minAppearances = ceil(A / dS)
maxAppearances = min(M, A)
```

`A` es un conteo entero de minutos y toda aparición registrada contiene al
menos una unidad de minuto; por eso `appearances <= A` cuando `A>0`. Esta es una
restricción lógica de la unidad, no un parámetro editorial.

Probabilidad de ocupar oportunidades adicionales:

```text
minuteDensity =
  if teamMinutes_c = 0
  then -1
  else 2 * (A / teamMinutes_c) - 1

logitPExtraAppearance =
    appearanceIntercept[contextKind, competitionType, role]
  + appearanceMinuteDensityWeight * minuteDensity
  + sum_j(appearanceContextWeight[j] * feature[c,j])

pExtraAppearance = stableSigmoid(logitPExtraAppearance)

extraAppearances =
  BernoulliSumV1(
    maxAppearances - minAppearances,
    pExtraAppearance,
    explicitOccurrenceKeys
  )

appearances = minAppearances + extraAppearances
```

`BernoulliSumV1(n,p)` realiza `n` Bernoulli explícitos en orden de occurrence;
con `n=0` no consume RNG. No crea fixtures ni identidades de partidos.

### 13.2 Starts

El mínimo lógico de starts requerido por capacidad de minutos:

```text
minStarts =
  max(
    0,
    ceil((A - appearances * dN) / (dS - dN))
  )
```

Para `appearances>0`:

```text
startConcentration = 2 * (A / (appearances * dS)) - 1

logitPAdditionalStart =
    startIntercept[contextKind, competitionType, role]
  + startConcentrationWeight * startConcentration
  + sum_j(startContextWeight[j] * feature[c,j])

pAdditionalStart = stableSigmoid(logitPAdditionalStart)

additionalStarts =
  BernoulliSumV1(
    appearances - minStarts,
    pAdditionalStart,
    explicitOccurrenceKeys
  )

starts = minStarts + additionalStarts
```

Invariantes:

```text
0 <= starts <= appearances <= min(M,A)
A <= starts*dS + (appearances-starts)*dN
```

El modelo no divide ingenuamente por 90, admite una aparición con pocos
minutos y conserva varianza agregada.

## 14. EffectiveUsage

`EffectiveUsage` queda como `DERIVED_SUMMARY`:

```text
EffectiveUsage = {
  actualMinutes,
  availableMinutes,
  minuteShareRealized,
  appearances,
  starts,
  byCompetition,
  usageByPosition
}
```

No se define un enum mecánico ni thresholds de gameplay. Una presentación
futura puede clasificar el resumen mediante configuración de UI. No es input
causal de la misma Q.

## 15. Random streams

Todos los draws usan ADR-070 y namespace:

```text
namespace = "role-minutes"
```

| Modelo | Purpose | Context estable | Occurrence |
|---|---|---|---|
| role | `category` | Career, SeasonId, Q, context, team, player, position | `0` |
| minute share shared | `team-shared` | Career, SeasonId, Q, context, team, scope | `0` |
| minute share specific | `player-specific` | anterior + player | `0` |
| competition allocation | `competition-allocation` | anterior + player + competition | `0` |
| appearance | `appearance` | anterior + player + competition | índice Bernoulli |
| start | `start` | anterior + player + competition | índice Bernoulli |
| future position allocation | `position-allocation` | anterior + player + position | `0` |

`model` identifica la revisión, por ejemplo `sporting-role-v1`,
`minute-share-v1` o `appearance-summary-v1`.

Reglas:

- el shock `team-shared` omite `playerId` intencionalmente;
- shocks específicos incluyen `playerId`;
- competition/position IDs usan orden canónico;
- role/minutes nunca reutiliza streams de Performance, Health o Calendar;
- una rama determinada no consume draws omitidos;
- añadir una competición o posición no cambia keys de las demás;
- el `parameterSetHash` no participa en la key, conforme ADR-070.

## 16. Invariantes y properties

### 16.1 Invariantes

- `SportingRole` pertenece al enum válido.
- Las probabilidades de role son finitas, no negativas y suman `1` dentro de
  la tolerancia del math profile.
- `0 <= availabilityShare <= 1`.
- `0 <= minuteShare <= 1`.
- `0 <= actualMinutes <= availableMinutes <= teamMinutesOpportunity`.
- `sum(actualMinutesByCompetition) = actualMinutes`.
- `sum(usageByPosition) = actualMinutes`.
- `0 <= starts <= appearances <= appearanceOpportunityCount`.
- No existen conteos negativos, NaN, infinitos ni `-0` persistido.
- La misma seed, key, inputs, versiones y ParameterSet produce el mismo
  outcome.
- Disponibilidad cero produce cero minutos y el consumo de RNG definido en
  §9.3.
- Performance de Q no altera minutos ya cerrados de Q.
- Minutos de club y selección no se agregan en el mismo scope.

### 16.2 Monotonicidad de expectativa

Manteniendo todo lo demás fijo y usando un ParameterSet válido:

- mayor `managerTrust` no reduce el `expectedMinuteShare`;
- mayor competition no aumenta el `expectedMinuteShare`;
- mayor quality/fit no reduce el `expectedMinuteShare`;
- el orden de expectativa por role es estricto;
- mayor `availableMinutes` no reduce `expectedMinutes`;
- aumentar un cap de competición no reduce el conjunto factible de
  asignaciones.

Estas properties aplican a expectativas, no a outcomes sampleados.

### 16.3 Soporte de colas

Con sigmas oficiales positivas y utilities finitas:

- un BENCH conserva probabilidad positiva de minute share
  extraordinariamente alta;
- un STAR conserva probabilidad positiva de minute share muy baja;
- todo role conserva probabilidad positiva;
- no hay count caps editoriales;
- los únicos límites son oportunidad, disponibilidad y capacidad agregada.

## 17. Facts, signals y summaries

| Output | Clasificación | Contenido mínimo |
|---|---|---|
| role utilities/probabilities | `INTERNAL_SIGNAL` | breakdown auditable |
| `expectedMinutes` | `INTERNAL_SIGNAL` | expectativa pre-sample |
| `WindowAvailabilityAssessed` | `DERIVED_SUMMARY` | sources, unión, share, availableMinutes |
| `SportingRoleAssigned` | `PERSISTED_DOMAIN_FACT` | context, role, effectivePosition |
| `MinutesRecorded` | `PERSISTED_DOMAIN_FACT` | total, por competición/posición |
| `AppearanceSummaryRecorded` | `PERSISTED_DOMAIN_FACT` | appearances/starts por scope |
| `EffectivePositionUsed` | `DERIVED_SUMMARY` | se deriva de MinutesRecorded |
| `EffectiveUsage` | `DERIVED_SUMMARY` | vista agregada de participación |

Los facts usan IDs deterministas y causal references conforme
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md). Ningún output escribe
`ScoreLedger`.

## 18. EngineParameterSet.roleMinutes

No puede existir ninguna constante de balance fuera de esta sección.

| Ruta | Dominio/restricción | Clase |
|---|---|---|
| `quality.center[context][position]` | finito | `INITIAL_CALIBRATION_REQUIRED` |
| `quality.scale[context][position]` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `competition.weights.*` | `>=0`, suman `1` | `INITIAL_CALIBRATION_REQUIRED` |
| `role.base[context][position][role]` | finito | `INITIAL_CALIBRATION_REQUIRED` |
| `role.betaQuality[role]` | ordenado/no negativo relativo | `INITIAL_CALIBRATION_REQUIRED` |
| `role.betaFit[role]` | ordenado/no negativo relativo | `INITIAL_CALIBRATION_REQUIRED` |
| `role.betaTrust[role]` | ordenado/no negativo relativo | `INITIAL_CALIBRATION_REQUIRED` |
| `role.betaCompetition[role]` | ordenado/no negativo relativo | `INITIAL_CALIBRATION_REQUIRED` |
| `role.betaPreviousPerformance[role]` | ordenado/no negativo relativo | `INITIAL_CALIBRATION_REQUIRED` |
| `role.betaForm[role]` | ordenado/no negativo relativo | `INITIAL_CALIBRATION_REQUIRED` |
| `role.statusEffect[status][role]` | finito, BENCH referencia | `INITIAL_CALIBRATION_REQUIRED` |
| `role.transitionEffect[previous][role]` | §7.2 | `INITIAL_CALIBRATION_REQUIRED` |
| `role.contextWeights[role][feature]` | finito + signo declarado | `TUNABLE_LATER` |
| `role.canonicalOrder` | §7.1 | `STRUCTURAL_FIXED` |
| `minutes.intercept[context][position][role]` | estrictamente ordenado | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.gammaQuality` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.gammaFit` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.gammaTrust` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.gammaCompetition` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.gammaPreviousPerformance` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.gammaForm` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.contextWeights[feature]` | finito + signo declarado | `TUNABLE_LATER` |
| `minutes.sigmaTeam[context][position]` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `minutes.sigmaPlayer[context][position]` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `allocation.intercept[context][competitionType][role]` | finito | `INITIAL_CALIBRATION_REQUIRED` |
| `allocation.contextWeights[feature]` | finito | `TUNABLE_LATER` |
| `allocation.sigma` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `positionUsage.mode` | `DOMINANT_ONLY` slice | `STRUCTURAL_FIXED` |
| `positionUsage.futureWeights` | finito | `TUNABLE_LATER` |
| `appearances.intercept[context][competitionType][role]` | finito | `INITIAL_CALIBRATION_REQUIRED` |
| `appearances.minuteDensityWeight` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `appearances.contextWeights[feature]` | finito | `TUNABLE_LATER` |
| `starts.intercept[context][competitionType][role]` | finito | `INITIAL_CALIBRATION_REQUIRED` |
| `starts.concentrationWeight` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `starts.contextWeights[feature]` | finito | `TUNABLE_LATER` |
| `appearances.minimumRecordedMinutes` | `1` (unidad entera) | `STRUCTURAL_FIXED` |
| `adapters.club.*` | domains/signs tipados | `INITIAL_CALIBRATION_REQUIRED` |
| `adapters.nationalTeam.*` | domains/signs tipados | `INITIAL_CALIBRATION_REQUIRED` |
| `contextFeatureCatalog` | allowlist tipada | `STRUCTURAL_FIXED` |
| `mathProfile.logitNormalMean` | `GaussHermite10V1` | `STRUCTURAL_FIXED` |
| `quantization.state` | `ROUND_HALF_EVEN` | `STRUCTURAL_FIXED` |

Los valores de `teamMinutesOpportunity`, límites de appearances y TacticalFit
son inputs upstream, no parámetros ocultos de este resolver.

## 19. Calibration targets

Segmentos mínimos:

- role;
- posición `GK`, `CM`, `ST`;
- contexto `Argentina`, `España`;
- `CLUB` y, cuando exista calendario aprobado, `NATIONAL_TEAM`;
- age band solo como diagnóstico condicionado: edad no es predictor directo
  de Role & Minutes.

### 19.1 INVARIANT

| ID | Métrica |
|---|---|
| RM-I01 | Probabilidades de role válidas y suma unitaria. |
| RM-I02 | Bounds y sumas exactas de availability/minutes. |
| RM-I03 | `starts <= appearances <= opportunity`. |
| RM-I04 | Capacidad de minutos por starts/appearances suficiente. |
| RM-I05 | Separación club/selección y scopes de facts. |
| RM-I06 | Reproducibilidad y draw-consumption contract. |
| RM-I07 | Monotonicidades de expectativa de §16.2. |
| RM-I08 | Sin retroalimentación Performance(Q)→Minutes(Q). |

### 19.2 CALIBRATION_TARGET

| ID | Target | Segmentación | Evidencia |
|---|---|---|---|
| RM-C01 | Frecuencia de cada role. | posición/contexto | diseño + externa |
| RM-C02 | Matriz de transición de roles. | role/contexto | externa |
| RM-C03 | Persistencia/promoción/democión. | role/posición | externa |
| RM-C04 | Distribución de minute share por role. | role/posición/contexto | externa |
| RM-C05 | Cuantiles de actualMinutes. | role/posición/contexto | externa |
| RM-C06 | Frecuencia cero/baja exposición. | role/contexto | externa |
| RM-C07 | P95/P99 de alta exposición. | role/contexto | externa |
| RM-C08 | Distribución de appearances/starts. | competición/role | externa |
| RM-C09 | Ratio starts/appearance. | role/posición | externa |
| RM-C10 | Sensibilidad a competition/trust/fit. | contexto | diseño + externa |
| RM-C11 | Asignación entre competiciones. | tipo/role | externa |
| RM-C12 | Outliers BENCH altos y STAR bajos. | role/contexto | diseño + externa |

Los intervalos numéricos no se inventan aquí. `RM-C01–C12` requieren valores
antes de publicar un ParameterSet oficial.

### 19.3 DIAGNOSTIC

| ID | Diagnóstico |
|---|---|
| RM-D01 | Correlación role↔minutes. |
| RM-D02 | PreviousPerformance(Q-1)↔minutes(Q), condicionada por evidence. |
| RM-D03 | Quality/trust/competition↔expected y actual minutes. |
| RM-D04 | Minutos de experiencia consumidos por Development. |
| RM-D05 | Efecto marginal de availability source y solapamientos. |
| RM-D06 | Diferencias por edad no explicadas por inputs causales. |
| RM-D07 | Distribución de residuos por posición/contexto. |
| RM-D08 | Frecuencia de errores por asignación incompleta. |

## 20. Golden vectors requeridos

Todos los fixtures fijan math profile, ParameterSet, versiones y draw keys.

### 20.1 Role softmax

```text
utilities = [0,0,0,0,0]
probabilities = [0.2,0.2,0.2,0.2,0.2]
u = 0.61
expected role = KEY_PLAYER
```

### 20.2 Persistence

Fixture con `previousRole=STARTER`, todos los demás términos cero y una fila
explícita de `transitionEffect`; debe producir exactamente esa fila como
utilities ajustadas y su stable softmax.

### 20.3 Availability union

```text
teamMinutesOpportunity = 1000
medical       = [0,200)
disciplinary  = [150,250)
other         = [800,900)

union cardinality = 350
availableMinutes = 650
availabilityShare = 0.65
```

Un fixture adicional con dos shares sin intervalos espera
`AVAILABILITY_OVERLAP_UNSPECIFIED`.

### 20.4 Minute share

```text
muMinutes = 0
sigmaTeam * Z_team = 0
sigmaPlayer * Z_player = 0
availableMinutes = 601

zMinutes = 0
minuteShare = 0.5
actualMinutes = ROUND_HALF_EVEN(300.5) = 300
```

### 20.5 Disponibilidad cero

Espera role resuelto, `expectedMinutes=actualMinutes=0`, un draw de role y cero
draws de minutes/allocation/appearances/starts.

### 20.6 Competition apportionment

```text
available caps = [500,100]
actualMinutes = 300
equal non-cap utility, zero shocks
expected allocation = [250,50]
```

### 20.7 Appearances/starts

```text
A=180, M=4, dS=90, dN=30
minAppearances=2
pExtraAppearance=0.5
extra draws=[0.1,0.9] -> extraAppearances=1
appearances=3
minStarts=2
pAdditionalStart=0.5
remaining draw=[0.8] -> additionalStarts=0
starts=2
```

### 20.8 Context separation

El mismo player/input base bajo adapters `CLUB` y `NATIONAL_TEAM`, con
trust/incumbency y ParameterSet distintos, debe producir utilities/expected
minutes distintos y keys de stream no colisionantes.

### 20.9 ExpectedMinutes

Fixtures de `LogitNormalMeanGaussHermite10V1` cubren:

- `mu=0` y cualquier sigma finito: expectativa `0.5` dentro de la tolerancia
  del math profile;
- `sigma=0`: resultado `sigmoid(mu)`;
- pares `mu` y `-mu`: medias que suman `1` dentro de tolerancia;
- orden monótono en `mu`.

## 21. Monte Carlo

### SMOKE

Orden de magnitud: `10²–10³` ventanas efectivas.

- invariantes;
- branch/draw consumption;
- determinismo;
- zero/sparse/full opportunity;
- composición de overlaps;
- contexts separados.

### CALIBRATION

Orden de magnitud: `10⁴–10⁵`.

- `RM-C01–C12`;
- transición de roles;
- minuteShare/actualMinutes;
- appearances/starts;
- correlación con quality/trust/competition;
- asignación por competición;
- outliers por role.

### DEEP

Orden de magnitud: `10⁶+` observaciones efectivas cuando tails/segmentos lo
requieran.

- P99/P99.9;
- BENCH con uso extremo y STAR con uso mínimo;
- secuencias largas de transición;
- ventanas con múltiples causas solapadas;
- estabilidad cross-runtime y entre revisiones de ParameterSet.

Cada suite usa manifests y `CalibrationSeedSet` inmutables del contrato G3C-1.

## 22. Estado de cierre

| ID | Estado G3C-3 | Cierre matemático | Pendiente |
|---|---|---|---|
| G3B-C02 | `PARTIAL_CALIBRATION` | Dominio/consumo de trust, utilities y monotonicidad cerrados. | Valores y dinámica upstream. |
| G3B-C03 | `PARTIAL_CALIBRATION` | Transformación convexa de strength/depth/entrenchment cerrada. | Pesos y generación G3C-6. |
| G3B-C04 | `RESOLVED_MATH` | Unión de intervalos, oportunidad disponible y error de overlap cerrados. | Producers upstream, no matemática local. |
| G3B-C05 | `PARTIAL_CALIBRATION` | Softmax de role, Logit-Normal de minutos y expectativa cerrados. | Coeficientes/targets. |
| G3B-C06 | `PARTIAL_CALIBRATION` | Apportionment por competición, scope club/selección y uso posicional cerrados. | Pesos/targets y calendario upstream. |
| G3B-F03 | `RESOLVED_MATH` | SeasonId ordinal, Q, unidad de oportunidad y contrato agregado cerrados. | Generación/formato completo bajo DR-021/G3C-6. |

Ninguna de las seis conserva pendiente una familia matemática. Cuatro quedan
`PARTIAL_CALIBRATION`; dos quedan `RESOLVED_MATH`.

DR-054 pasa a `PARTIAL_CALIBRATION`. DR-064 queda resuelta por la composición
de §8. DR-021 queda parcialmente resuelta: identidad ordinal y boundary
matemático sí; formatos, calendario generado e integración internacional no.
DR-042/044 se preservan. DR-057, DR-063 y DR-067 no se cierran fuera de su
scope.

## 23. Gates

Antes de implementar Role & Minutes oficial:

- publicar valores de todos los parámetros
  `INITIAL_CALIBRATION_REQUIRED`;
- aprobar los goldens de §20 y el primitive GH10;
- Health debe producir asignación médica compatible, no solo share;
- G3C-6 debe producir TeamMinutesOpportunity, PositionCompetition y
  TacticalFit;
- cerrar el catálogo/formatos pendientes de DR-021;
- aprobar targets mínimos `RM-C01–C12` para `GK/CM/ST`, Argentina/España;
- preservar `DOMINANT_ONLY` en el vertical slice salvo nueva decisión
  versionada.

No existe blocker estructural para comenzar G3C-4. Performance puede consumir
`actualMinutes`, el breakdown por competición/posición, role, context y
evidence contracts sin esperar los valores finales de calibración.

## 24. Referencias

- [Contrato matemático y de calibración](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Role & Minutes estructural](ROLE_MINUTES_SPEC.md)
- [Player Model](PLAYER_MODEL_SPEC.md)
- [Creation & Development matemático](CREATION_DEVELOPMENT_MATH_SPEC.md)
- [Health & Injury](HEALTH_INJURY_SPEC.md)
- [Performance Model](PERFORMANCE_MODEL_SPEC.md)
- [Club, Competition & World](CLUB_COMPETITION_WORLD_SPEC.md)
- [Catálogo de facts y scoring](SCORING_FACTS_SPEC.md)
- [G3B Design Board](G3B_DESIGN_BOARD.md)
- [Registro de decisiones](DECISIONS_REQUIRED.md)
- [ADR-054](adr/054-role-and-minutes-model.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-071](adr/071-creation-development-mathematics.md)
- [ADR-072](adr/072-role-minutes-and-availability-mathematics.md)
