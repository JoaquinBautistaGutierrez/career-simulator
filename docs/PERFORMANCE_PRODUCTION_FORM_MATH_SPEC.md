# Especificación matemática de Performance, Production y Form

## 1. Estado, alcance y autoridad

**Estado:** G3C-4 — familias matemáticas y samplers cerrados; calibración pendiente  
**Fecha:** 2026-07-29  
**Autoridad estructural:** [ADR-055](adr/055-performance-and-production-model.md)  
**Autoridad matemática:** [ADR-073](adr/073-performance-production-form-mathematics.md)  
**Contrato transversal:**
[MATHEMATICAL_CALIBRATION_CONTRACT.md](MATHEMATICAL_CALIBRATION_CONTRACT.md)  
**Decisiones del board:** G3B-D02 a G3B-D09  
**DR relacionadas:** DR-008, DR-010, DR-042, DR-044, DR-054, DR-055,
DR-056, DR-057, DR-059, DR-060, DR-061 y DR-063

Este documento fija ecuaciones, dominios, distribuciones, samplers, claves de
azar, invariantes y contratos de parámetros para el vertical slice `GK`, `CM`
y `ST`.

No asigna valores de balance y no define:

- dinámica de `fitness`, `fatigue`, `confidence`, `morale` o `managerTrust`;
- producción de contextos de club, rival, calendario o presión;
- reglas de Selection, Awards, Market, Reputation o Scoring;
- IJL, percentiles competitivos, PRI, CC o puntos;
- partidos, tiros o acciones individuales.

Los valores cuantitativos pendientes pertenecen al
`EngineParameterSet.performance` inmutable. Este cierre no autoriza gameplay
hasta publicar un ParameterSet calibrado y sus goldens.

## 2. Pipeline y unidad de resolución

### 2.1 Pipeline congelado

```text
TrueCapabilities
→ TaskAbilities contextuales
→ expected UnderlyingPerformance
→ stochastic UnderlyingPerformance
→ opportunity intensities
→ ObservedProduction
→ PerformanceSummary
→ evidence / surprise signals
→ future DynamicState signals
```

`TaskAbilities` es la forma matemática task-specific de
`EffectiveCapabilities`. No existe `EffectiveOverall`, ni un rating derivado
vuelve aguas arriba para generar producción.

Performance:

- consume `actualMinutes` confirmados;
- no recalcula role, posición, availability o minutos;
- no modifica capabilities, traits o Dynamic States;
- no usa CareerScore, IJL, MarketValue o PublicReputation como causas;
- no reabre una Q cerrada.

### 2.2 `PerformanceSegment`

La unidad mínima es:

```text
PerformanceSegmentKey {
  careerId
  playerId
  seasonId
  quarter
  participationContext       // CLUB | NATIONAL_TEAM
  teamId
  competitionId
  effectivePosition
  operationKey
}
```

Cada segmento recibe un número entero `actualMinutes >= 0`. La suma de los
segmentos de una Q es exactamente el total confirmado por Role & Minutes; no se
crean ni duplican minutos.

Un cambio de club, competición o contexto crea otro segmento. Los outputs no
se reasignan al contexto final de la temporada.

### 2.3 Exposición ordinaria y de presión

`pressureExposure = h ∈ [0,1]` es un input agregado de Club/Competitions.
Define exposiciones equivalentes, no minutos con precisión diaria:

```text
mPressure = actualMinutes * h
mOrdinary = actualMinutes - mPressure
```

Ambas son binary64 finitas durante la operación. Solo `actualMinutes` es el
conteo causal persistido. Si `h = 0`, no existe rama de presión ni consume
azar; si `h = 1`, no existe rama ordinaria.

## 3. Dominios numéricos

### 3.1 Convenciones

```text
center01(x) = 2*x - 1                   // x ∈ [0,1] → [-1,1]

signedBounded(y) =
  2 * stableSigmoid(2*y) - 1           // finito → (-1,1)
```

`signedBounded` es una composición de primitivas del math profile; no introduce
clipping.

| Concepto | Dominio de cálculo | Persistencia |
|---|---:|---:|
| capability/trait | entero `0..10000` → `[0,1]` | entero `0..10000` |
| task ability | `(0,1)` | derivada, no estado |
| performance dimension | `(-1,1)` | entero `-10000..10000` en summary |
| evidence / share | `[0,1]` | entero `0..10000` cuando se materializa |
| form | `[0,1]` | entero `0..10000` |
| production count | entero `>= 0` | entero exacto |
| latent predictor | binary64 finito | traza opcional, no estado |

Todo boundary persistido:

1. rechaza `NaN`, `±Infinity`;
2. aplica únicamente el límite lógico del dominio;
3. usa `ROUND_HALF_EVEN`;
4. normaliza `-0` a `+0`.

### 3.2 Adapters de Dynamic State y contexto

Performance requiere estos inputs normalizados:

```text
form, confidence, fitness, fatigue, morale, tacticalFit ∈ [0,1]
pressureResistance, consistency ∈ [0,1]
physicalRestrictionByTask[k] ∈ [0,1]
```

Semántica:

- mayor `fitness` significa mayor preparación física;
- mayor `fatigue` significa mayor fatiga;
- mayor `physicalRestrictionByTask` significa mayor restricción;
- `tacticalFit` es derivado, no capability;
- Health es owner de `fitness`, `fatigue` y restricciones.

Club/Competitions entrega, como mínimo:

```text
attackEnvironment
defensiveEnvironment
controlEnvironment
opponentAttack
opponentDefense
shotQuality
scheduleDifficulty
competitionStrength
pressureExposure
```

Todos pertenecen a `[0,1]`. G3C-6 define sus productores y adapters. El
contrato local puede implementarse contra estos dominios sin inventar cómo se
generan.

`competitionStrength` es contexto dinámico de gameplay. Nunca es IJL.

## 4. Transformación de capabilities

Para cada capability persistida `stored_i`:

```text
x_i =
  stored_i / 10000

xSafe_i =
  epsilonCapability
  + (1 - 2*epsilonCapability) * x_i

z_i =
  stableLogit(xSafe_i)
```

Se reutiliza el mismo `epsilonCapability` normativo de
[CREATION_DEVELOPMENT_MATH_SPEC.md](CREATION_DEVELOPMENT_MATH_SPEC.md); no se
crea otro epsilon de Performance.

Cada task `k` define centros y escalas:

```text
capabilityFeature[k,i] =
  signedBounded(
    (z_i - capabilityCenter[k,i])
    / capabilityScale[k,i]
  )

capabilityScale[k,i] > 0
```

La transformación:

- usa el estado causal completo `0..10000`;
- permanece suave en los extremos;
- no crea ceilings;
- evita que un logit extremo domine numéricamente todas las interacciones;
- no altera `stored_i`.

## 5. Task abilities

### 5.1 Ecuación común

Para cada task `k`:

```text
baseTaskLogit[k] =
  taskIntercept[k]
  + Σ_i (
      capabilityWeight[k,i]
      * capabilityFeature[k,i]
    )
  + Σ_(i,l)∈interactionSet[k] (
      interactionWeight[k,i,l]
      * capabilityFeature[k,i]
      * capabilityFeature[k,l]
    )
```

El contexto dinámico se incorpora una sola vez:

```text
dynamicContext[k] =
    betaForm[k]       * center01(form)
  + betaConfidence[k] * center01(confidence)
  + betaFitness[k]    * center01(fitness)
  - betaFatigue[k]    * center01(fatigue)
  + betaMorale[k]     * center01(morale)
  + betaTactical[k]   * center01(tacticalFit)
  - betaRestriction[k] * physicalRestrictionByTask[k]
```

Los coeficientes de `fitness`, `fatigue` y restricción son no negativos. Otros
signos deben declararse en el ParameterSet; no quedan implícitos.

Los efectos contextuales no duplicados son:

```text
taskContext[k] =
  Σ_c contextWeight[k,c] * center01(context[c])
```

Entonces:

```text
effectiveTaskLogit[k] =
  baseTaskLogit[k]
  + dynamicContext[k]
  + taskContext[k]

taskAbility[k] =
  stableSigmoid(effectiveTaskLogit[k])
```

`SportingRole` no cambia habilidad. Entra después en oportunidad/exposición.
Presión tampoco se incluye aquí: su respuesta se resuelve en Underlying
Performance para que `pressureResistance` solo actúe donde `h > 0`.

### 5.2 Tasks canónicas del vertical slice

| Posición | Task ID | Consumidores directos |
|---|---|---|
| ST | `ST_SCORING_OPPORTUNITY` | intensidad de ocasiones y attacking performance |
| ST | `ST_CONVERSION` | chance conversion y goals |
| ST | `ST_CREATION` | creative opportunity y assists |
| ST | `ST_OFF_BALL_ATTACK` | attacking/off-ball performance y oportunidades |
| ST | `ST_PRESSING_DEFENSE` | pressing/defensive impact |
| CM | `CM_PROGRESSION` | progression impact |
| CM | `CM_CREATION` | creative impact y assists |
| CM | `CM_CONTROL` | control impact |
| CM | `CM_DEFENSIVE_CONTRIBUTION` | defensive impact |
| CM | `CM_ATTACKING_CONTRIBUTION` | attacking opportunity y goals |
| GK | `GK_SHOT_STOPPING` | shot-stopping performance y save probability |
| GK | `GK_COMMAND` | command performance y shots-faced environment |
| GK | `GK_DISTRIBUTION` | distribution performance |

No se crean tasks sin consumer. Extender otra posición exige catálogo,
parámetros, targets y fixtures versionados.

## 6. Underlying Performance

### 6.1 Dimensiones mínimas

| Posición | Dimensiones |
|---|---|
| ST | `attackingExecution`, `creativeExecution`, `offBallImpact`, `pressingDefensiveImpact` |
| CM | `progressionImpact`, `creativeImpact`, `controlImpact`, `defensiveImpact` |
| GK | `shotStoppingPerformance`, `commandPerformance`, `distributionPerformance` |

Estas dimensiones son purpose-neutral dentro de Performance. Awards, Selection,
Market y Scoring reciben proyecciones autorizadas; no leen capabilities
verdaderas.

### 6.2 Centro condicional

Para dimensión `j`:

```text
basePerformanceMean[j] =
  performanceIntercept[j]
  + Σ_k (
      taskLoading[j,k]
      * effectiveTaskLogit[k]
    )
  + Σ_c (
      performanceContextWeight[j,c]
      * center01(context[c])
    )
```

Los loadings principales task→dimensión se declaran no negativos. Una
interacción con signo distinto debe tener ID y justificación propios.

### 6.3 Jerarquía estocástica

Se conservan exactamente:

1. un `Z_common` compartido por jugador, Q y `ParticipationContext`;
2. un `Z_domain` compartido por dominio posicional y Q;
3. un `Z_specific[j]` por dimensión;
4. un `Z_pressure` compartido por las dimensiones de la rama high-pressure.

Todos son `Normal(0,1)` mediante `StandardNormalInverseCdfV1`.

```text
centeredConsistency =
  center01(consistency)

sigmaDomainEffective[j] =
  sigmaDomainBase[j]
  * safeExp(
      -betaConsistencyDomain[j]
      * centeredConsistency
    )

sigmaSpecificEffective[j] =
  sigmaSpecificBase[j]
  * safeExp(
      -betaConsistencySpecific[j]
      * centeredConsistency
    )

sigmaPressureEffective[j] =
  sigmaPressureBase[j]
  * safeExp(
      -betaConsistencyPressure[j]
      * centeredConsistency
    )
```

Todos los `sigmaBase > 0` y todos los `betaConsistency >= 0`. El shock común
de mundo/ventana no se reduce por `consistency`; el trait controla la
volatilidad atribuible al jugador, no el contexto compartido.

Rama ordinaria:

```text
ordinaryLatent[j] =
  basePerformanceMean[j]
  + commonLoading[j] * sigmaCommon * Z_common
  + domainLoading[j] * sigmaDomainEffective[j] * Z_domain
  + sigmaSpecificEffective[j] * Z_specific[j]
```

### 6.4 Presión

```text
centeredPressureResistance =
  center01(pressureResistance)

pressureMeanShift[j] =
  betaPressureResistance[j]
  * centeredPressureResistance

pressureShock[j] =
  pressureLoading[j]
  * sigmaPressureEffective[j]
  * Z_pressure

pressureLatent[j] =
  ordinaryLatent[j]
  + pressureMeanShift[j]
  + pressureShock[j]
```

`betaPressureResistance[j] >= 0`. Mayor resistance no empeora la respuesta
esperada manteniendo todo lo demás fijo, pero el shock y el resto de factores
pueden producir un mal resultado.

Si `h = 0`, `pressureLatent` queda ausente y no se samplea `Z_pressure`.

### 6.5 Expectativa y realización

Definimos:

```text
boundedPerformance(l) =
  2 * stableSigmoid(l) - 1
```

Las desviaciones latentes condicionales son:

```text
sigmaOrdinary[j]^2 =
    (commonLoading[j] * sigmaCommon)^2
  + (domainLoading[j] * sigmaDomainEffective[j])^2
  + sigmaSpecificEffective[j]^2

sigmaPressure[j]^2 =
  sigmaOrdinary[j]^2
  + (pressureLoading[j] * sigmaPressureEffective[j])^2
```

La media aritmética de cada Logit-Normal usa
`LogitNormalMeanGaussHermite10V1`:

```text
expectedOrdinary[j] =
  2 * GH10Mean(
        basePerformanceMean[j],
        sigmaOrdinary[j]
      )
  - 1

expectedPressure[j] =
  2 * GH10Mean(
        basePerformanceMean[j] + pressureMeanShift[j],
        sigmaPressure[j]
      )
  - 1
```

La expectativa y realización agregadas del segmento son:

```text
expectedPerformance[j] =
  (1 - h) * expectedOrdinary[j]
  + h * expectedPressure[j]

realizedOrdinary[j] =
  boundedPerformance(ordinaryLatent[j])

realizedPressure[j] =
  boundedPerformance(pressureLatent[j])

realizedPerformance[j] =
  (1 - h) * realizedOrdinary[j]
  + h * realizedPressure[j]
```

Cuando una rama tiene exposición cero, queda ausente y no aporta un `0`
artificial al promedio.

## 7. Evidencia y sorpresa

### 7.1 Fuerza de evidencia

Para `m = actualMinutes`:

```text
evidenceStrength(m) =
  if m = 0:
    0
  else:
    -expm1(-m / tauEvidence[position, contextKind])
```

`tauEvidence > 0`. La misma forma se aplica a:

```text
pressureEvidence =
  evidenceStrength(mPressure)
```

Propiedades:

- `evidenceStrength(0) = 0`;
- es estrictamente creciente para `m > 0`;
- tiene rendimientos decrecientes;
- tiende a `1` sin alcanzarlo por clipping.

### 7.2 Sorpresa multidimensional

Para cada dimensión:

```text
performanceDifference[j] =
  realizedPerformance[j]
  - expectedPerformance[j]

dimensionSurprise[j] =
  performanceDifference[j]
  / (
      surpriseScale[j]
      + abs(performanceDifference[j])
    )

surpriseScale[j] > 0
```

Los pesos por posición cumplen:

```text
surpriseWeight[j] >= 0
Σ_j surpriseWeight[j] = 1
```

```text
PerformanceSurprise =
  Σ_j (
    surpriseWeight[j]
    * dimensionSurprise[j]
  )

evidenceAdjustedSurprise =
  evidenceStrength
  * PerformanceSurprise
```

`PerformanceSurprise ∈ (-1,1)`. No usa goals/assists como proxy único.

Para presión:

```text
pressureDifference[j] =
  realizedPressure[j]
  - expectedPressure[j]

PressureSurprise =
  Σ_j (
    pressureSurpriseWeight[j]
    * pressureDifference[j]
      / (
          pressureSurpriseScale[j]
          + abs(pressureDifference[j])
        )
  )
```

Si `h = 0`, `PressureSurprise = 0` y `pressureEvidence = 0`.

## 8. Producción ST

La producción se resuelve por `ExposureStratum` (`ORDINARY` o
`HIGH_PRESSURE`) con `m_s > 0`. Las ramas comparten los shocks de rendimiento y
un factor ofensivo de producción, pero goals y assists conservan innovaciones
de conteo propias.

### 8.1 Factor ofensivo compartido

```text
Z_attackProduction ~ Normal(0,1)
```

Se samplea una vez por `PerformanceSegmentKey` y stratum. Su loading entra en
las intensidades de goals y assists, induciendo correlación sin hacer que un
conteo cause el otro.

### 8.2 Intensidad de oportunidades de gol

```text
logGoalOpportunityIntensity =
  safeLog(m_s)
  + stGoalOpportunityIntercept
  + betaScoringOpportunity
      * effectiveTaskLogit[ST_SCORING_OPPORTUNITY]
  + betaOffBallOpportunity
      * performanceLatent[offBallImpact, s]
  + roleOpportunityEffect[SportingRole]
  + betaTacticalOpportunity * center01(tacticalFit)
  + betaTeamAttack * center01(attackEnvironment)
  - betaOpponentDefense * center01(opponentDefense)
  + betaCompetitionOpportunity * center01(competitionStrength)
  + attackProductionLoadingGoal
      * sigmaAttackProduction
      * Z_attackProduction
```

Todos los coeficientes con signo normativo mostrado son no negativos.

`goalOpportunityIntensity = safeExp(logGoalOpportunityIntensity)` es una
intensidad interna positiva, no un conteo observable ni un cap físico.

### 8.3 Calidad y conversión

```text
chanceQualityLogit =
  stChanceQualityIntercept
  + betaChanceTask
      * effectiveTaskLogit[ST_SCORING_OPPORTUNITY]
  + betaChanceAttack
      * performanceLatent[attackingExecution, s]
  + betaChanceTeamAttack * center01(attackEnvironment)
  - betaChanceOpponentDefense * center01(opponentDefense)

conversionLogit =
  stConversionIntercept
  + betaConversionTask
      * effectiveTaskLogit[ST_CONVERSION]
  + betaConversionExecution
      * performanceLatent[attackingExecution, s]
```

```text
chanceQuality =
  stableSigmoid(chanceQualityLogit)

conversionProbability =
  stableSigmoid(conversionLogit)

muGoals =
  goalOpportunityIntensity
  * chanceQuality
  * conversionProbability
```

La expectativa no se redondea.

### 8.4 Goals

```text
goals_s ~ NegativeBinomial2(
  mean = muGoals,
  dispersion = kappaGoals[positionContext]
)
```

`kappaGoals > 0`. `muGoals = 0` produce exactamente `0` y no consume draw.
No existe máximo editorial.

### 8.5 Assists

```text
logCreativeOpportunityIntensity =
  safeLog(m_s)
  + stCreativeOpportunityIntercept
  + betaCreativeTask
      * effectiveTaskLogit[ST_CREATION]
  + betaCreativeExecution
      * performanceLatent[creativeExecution, s]
  + roleCreativeEffect[SportingRole]
  + betaCreativeTactical * center01(tacticalFit)
  + betaCreativeAttack * center01(attackEnvironment)
  - betaCreativeOpponent * center01(opponentDefense)
  + attackProductionLoadingAssist
      * sigmaAttackProduction
      * Z_attackProduction

assistRealizationLogit =
  stAssistRealizationIntercept
  + betaAssistTask
      * effectiveTaskLogit[ST_CREATION]
  + betaAssistExecution
      * performanceLatent[creativeExecution, s]

muAssists =
  safeExp(logCreativeOpportunityIntensity)
  * stableSigmoid(assistRealizationLogit)

assists_s ~ NegativeBinomial2(
  mean = muAssists,
  dispersion = kappaAssists[positionContext]
)
```

Goals no son input causal de assists. La correlación procede de capabilities,
contexto, performance y `Z_attackProduction`.

## 9. Producción CM

### 9.1 Impactos multidimensionales

Se samplean mediante la jerarquía de la sección 6:

- `progressionImpact`;
- `creativeImpact`;
- `controlImpact`;
- `defensiveImpact`.

En el boundary del summary:

```text
impactStored[j] =
  ROUND_HALF_EVEN(
    10000
    * clampLogical(
        realizedPerformance[j],
        -1,
        1
      )
  )
```

Son componentes de `PerformanceSummaryRecorded`, no stats de box score. No se
simulan pases, tackles o recuperaciones sin consumer.

### 9.2 Factor compartido

```text
Z_midfieldProduction ~ Normal(0,1)
```

Se comparte entre las ramas de goal y assist del mismo stratum y se combina con
`Z_common`/`Z_domain` ya resueltos.

### 9.3 Goals y assists CM

```text
logMuCmGoals =
  safeLog(m_s)
  + cmGoalIntercept
  + betaCmAttackTask
      * effectiveTaskLogit[CM_ATTACKING_CONTRIBUTION]
  + betaCmProgressionForGoal
      * performanceLatent[progressionImpact, s]
  + betaCmAttackEnvironment * center01(attackEnvironment)
  - betaCmOpponentDefense * center01(opponentDefense)
  + midfieldProductionLoadingGoal
      * sigmaMidfieldProduction
      * Z_midfieldProduction

goalsCm_s ~ NegativeBinomial2(
  mean = safeExp(logMuCmGoals),
  dispersion = kappaCmGoals
)
```

```text
logMuCmAssists =
  safeLog(m_s)
  + cmAssistIntercept
  + betaCmCreativeTask
      * effectiveTaskLogit[CM_CREATION]
  + betaCmCreativeImpact
      * performanceLatent[creativeImpact, s]
  + betaCmControlForAssist
      * performanceLatent[controlImpact, s]
  + betaCmAttackEnvironment * center01(attackEnvironment)
  - betaCmOpponentDefenseAssist * center01(opponentDefense)
  + midfieldProductionLoadingAssist
      * sigmaMidfieldProduction
      * Z_midfieldProduction

assistsCm_s ~ NegativeBinomial2(
  mean = safeExp(logMuCmAssists),
  dispersion = kappaCmAssists
)
```

Goals/assists permanecen observables, pero ninguna evaluación purpose-scoped de
CM puede omitir los cuatro impactos.

## 10. Producción GK

### 10.1 Contexto defensivo

Performance recibe:

```text
defensiveEnvironment ∈ [0,1]
opponentAttack ∈ [0,1]
shotQuality ∈ [0,1]
scheduleDifficulty ∈ [0,1]
competitionStrength ∈ [0,1]
```

`shotQuality` es calidad agregada de los tiros al arco equivalentes. No se
simulan tiros individuales.

### 10.2 Shots faced

```text
Z_gkExposure ~ Normal(0,1)
```

Por stratum:

```text
logMuShotsFaced =
  safeLog(m_s)
  + gkShotsFacedIntercept
  - betaGkDefense * center01(defensiveEnvironment)
  + betaGkOpponentAttack * center01(opponentAttack)
  + betaGkScheduleDifficulty * center01(scheduleDifficulty)
  + betaGkCompetition * center01(competitionStrength)
  - betaGkCommand
      * performanceLatent[commandPerformance, s]
  + sigmaGkExposure * Z_gkExposure

shotsFaced_s ~ NegativeBinomial2(
  mean = safeExp(logMuShotsFaced),
  dispersion = kappaShotsFaced
)
```

`shotsFaced` representa tiros al arco equivalentes. Es exposición observada,
no calidad del GK.

### 10.3 Save probability y saves

```text
saveLogit =
  gkSaveIntercept
  + betaGkShotStoppingTask
      * effectiveTaskLogit[GK_SHOT_STOPPING]
  + betaGkRealizedShotStopping
      * performanceLatent[shotStoppingPerformance, s]
  - betaGkShotQuality * center01(shotQuality)

pSave =
  stableSigmoid(saveLogit)

saves_s | shotsFaced_s ~ Binomial(
  n = shotsFaced_s,
  p = pSave
)

goalsConceded_s =
  shotsFaced_s - saves_s
```

Por construcción:

```text
0 <= saves_s <= shotsFaced_s
goalsConceded_s >= 0
```

La heterogeneidad agregada de tiro entra mediante `shotQuality`,
`Z_gkExposure`, el shock de performance y la sobredispersión de
`shotsFaced`; no se añade Beta-Binomial sin evidencia que la exija.

### 10.4 Clean-sheet eligibility

Role/Minutes y Calendar entregan:

```text
cleanSheetEligibleAppearances = E
cleanSheetEligibleMinutes = mEligible

0 <= E <= appearances
0 <= mEligible <= actualMinutes

E = 0 iff mEligible = 0
E > 0 implies 0 < mEligible <= actualMinutes
```

Son unidades agregadas de elegibilidad, no fixtures. La policy de elegibilidad
es upstream y versionada.

### 10.5 Clean sheets correlacionadas con goles concedidos

Clean sheets no tienen un Bernoulli independiente.

Sea:

```text
G = Σ_s goalsConceded_s
M = actualMinutes
```

Casos determinados:

```text
if E = 0:
  cleanSheets = 0

else if G = 0:
  cleanSheets = E
```

Para `E > 0` y `G > 0`, cada gol concedido se asigna a una de `E + 1`
categorías agregadas:

```text
eligibleExposureShare =
  mEligible / M

P(OUTSIDE_ELIGIBLE) =
  1 - eligibleExposureShare

P(ELIGIBLE_BUCKET_e) =
  eligibleExposureShare / E
  para e = 0..E-1
```

Se usa un categorical draw por gol con orden:

```text
OUTSIDE_ELIGIBLE,
ELIGIBLE_BUCKET_0,
...,
ELIGIBLE_BUCKET_(E-1)
```

El draw usa `CategoricalCumulativeMidpointV1` de §12.4. Para cada gol, su
ordinal estable forma parte de `RandomDrawKey`; no se consume un cursor
secuencial compartido.

```text
concededEligibleBuckets =
  countDistinct(
    eligible buckets que recibieron >= 1 gol
  )

cleanSheets =
  E - concededEligibleBuckets
```

Así:

```text
0 <= cleanSheets <= E
```

La dependencia con habilidad y entorno ya llega a través de `G`; los goles
pueden concentrarse en una misma appearance-equivalent sin simular partidos.
No se crea precisión diaria ni un contador editorial.

### 10.6 Métricas GK diferidas

- `distributionPerformance` queda como dimensión de Underlying Performance y
  summary; no se inventa un conteo de pases.
- Errors y penalties no son necesarios para el vertical slice actual y quedan
  `CONTENT_LATER`/scope posterior.
- Añadirlos exige consumer, grafo causal, distribución, fact payload, targets y
  fixtures. No se derivan de goals conceded.

## 11. Distribuciones de conteo

### 11.1 Poisson

```text
Y ~ Poisson(lambda)

lambda >= 0
E[Y] = lambda
Var[Y] = lambda
```

Solo se usa cuando calibración justifica igualdad condicional media-varianza.

### 11.2 Negative Binomial canónica NB2

La única convención de Performance es:

```text
Y ~ NegativeBinomial2(mu, kappa)

mu >= 0
kappa > 0
E[Y] = mu
Var[Y] = mu + mu^2 / kappa
```

Menor `kappa` significa mayor sobredispersión. No se persiste `p/r` como otra
parametrización. `kappa = Infinity` no es un valor válido: si el proceso es
Poisson se declara Poisson.

### 11.3 Binomial

```text
Y ~ Binomial(n, p)

n ∈ integer >= 0
p ∈ [0,1]
E[Y] = n*p
Var[Y] = n*p*(1-p)
```

Se usa cuando existe un número físico confirmado de oportunidades, como
`shotsFaced`.

## 12. Samplers normativos

Todos los samplers reciben el uniforme midpoint de ADR-051:

```text
k = nextUint64() >> 11
u = (k + 0.5) / 2^53
u ∈ (0,1)
```

No usan `Math.random`, reloj, UUID, cache de draws ni orden incidental.

### 12.1 `PoissonInverseCdfV1`

Caso determinado:

```text
lambda = 0 → 0, sin draw
```

Para `lambda > 0`:

```text
logU = safeLog(u)
logP = -lambda               // log P(Y=0)
logCdf = logP
n = 0

while logCdf < logU:
  n = n + 1
  logP =
    logP
    + safeLog(lambda)
    - safeLog(n)
  logCdf =
    min(
      0,
      logSumExp([logCdf, logP])
    )

return n
```

La suma es ascendente `0,1,2,...`. `min(0, ...)` preserva el límite lógico de
una log-CDF; no recorta outcomes.

### 12.2 `NegativeBinomial2InverseCdfV1`

Caso determinado:

```text
mu = 0 → 0, sin draw
```

Para `mu > 0`, `kappa > 0`:

```text
logU = safeLog(u)

logOneMinusQ =
  -log1p(mu / kappa)

logQ =
  safeLog(mu)
  - safeLog(kappa + mu)

logP =
  kappa * logOneMinusQ       // log P(Y=0)

logCdf = logP
y = 0

while logCdf < logU:
  logP =
    logP
    + safeLog(y + kappa)
    - safeLog(y + 1)
    + logQ
  y = y + 1
  logCdf =
    min(
      0,
      logSumExp([logCdf, logP])
    )

return y
```

Consume exactamente un `uint64`; las iteraciones no consumen azar.

Se rechaza Gamma-Poisson para G3C-4: requeriría otro sampler/rejection contract
sin aportar semántica adicional. Por ello Performance no requiere Gamma.

### 12.3 `BinomialInverseCdfV1`

Casos determinados:

```text
n = 0 → 0, sin draw
p = 0 → 0, sin draw
p = 1 → n, sin draw
```

Para `n > 0`, `0 < p < 1`:

```text
logU = safeLog(u)
logP =
  n * log1p(-p)              // log P(Y=0)
logCdf = logP
y = 0

while logCdf < logU:
  logP =
    logP
    + safeLog(n - y)
    - safeLog(y + 1)
    + safeLog(p)
    - safeLog(1 - p)
  y = y + 1
  logCdf =
    min(
      0,
      logSumExp([logCdf, logP])
    )

return y
```

Consume exactamente un `uint64`.

### 12.4 `CategoricalCumulativeMidpointV1`

Para probabilidades finitas no negativas en orden canónico:

```text
Σ_i p_i = 1 dentro de numericTolerance
u = midpointUniform53()
cumulative = 0

for i in canonical order:
  cumulative = cumulative + p_i
  if u < cumulative:
    return category_i

return lastCategory
```

La última categoría solo absorbe el error residual permitido por
`numericTolerance`; no recibe masa editorial adicional. El validator rechaza
pesos negativos, suma inválida, vector vacío o categoría duplicada. Consume un
único `uint64`.

### 12.5 Terminación técnica

Los tres inverse-CDF no poseen iteration cap de gameplay. Un worker/test guard
puede devolver `INCONCLUSIVE_GUARD_REACHED` conforme ADR-070:

- no produce count;
- no cambia state/facts;
- no cuenta como muestra;
- no fuerza un máximo estadístico.

Los parámetros oficiales deben superar properties de terminación y performance
en los dominios publicados.

## 13. Producción con cero minutos

Si `actualMinutes = 0`:

- `UnderlyingPerformance` on-field queda `ABSENT_NOT_OBSERVED`;
- `evidenceStrength = 0`;
- goals, assists, shots faced, saves, goals conceded y clean sheets son `0`;
- no se samplean performance, opportunity, count o clean-sheet draws;
- puede persistirse una traza de no participación, no un fact de producción
  ficticio;
- Form puede ejecutar su transición temporal propia, pero recibe señal de
  performance igual a `0`.

Esto representa imposibilidad lógica y no un probability floor.

## 14. Performance signals y Form

### 14.1 Señales hacia otros owners

Performance emite:

```text
physicalIntensitySignal[segment] ∈ [0,1]

confidencePerformanceSignal =
  signedBounded(
      betaConfidenceSurprise
      * quarterEvidenceAdjustedSurprise
    + betaConfidencePressure
      * quarterPressureEvidence
      * quarterPressureSurprise
  )

managerTrustPerformanceSignal =
  signedBounded(
      betaTrustSurprise
      * quarterEvidenceAdjustedSurprise
    + betaTrustPressure
      * quarterPressureEvidence
      * quarterPressureSurprise
  )

moralePerformanceSignal =
  signedBounded(
      betaMoraleSurprise
      * quarterEvidenceAdjustedSurprise
    + betaMoralePressure
      * quarterPressureEvidence
      * quarterPressureSurprise
  )
```

`physicalIntensitySignal` resume demanda física realizada del segmento a
partir de su exposición y contexto tipados. No es `performanceRating`, goals,
assists ni sorpresa. Con cero minutos vale cero y no consume RNG. G3C-5 lo
combina con `actualMinutes` para resolver dose/load; Health no reabre su
producer.

Los `beta >= 0`. Las señales pertenecen a `[-1,1]`, no son updates.

- Confidence owner combina además señales no deportivas autorizadas.
- ManagerTrust owner combina contexto de manager/relación.
- Morale owner combina rol, resultados, contrato, relaciones y eventos.
- No se emite una `ReputationSignal` directa: Reputation consume facts
  observables y evita duplicación por `EvidenceKey`.

### 14.2 Agregación de señal de Q

Una Q puede contener múltiples segmentos. Para cada segmento `s`:

```text
quarterWeight_s =
  actualMinutes_s * evidenceStrength_s

Wq = Σ_s quarterWeight_s

quarterPerformanceSurprise =
  if Wq = 0:
    0
  else:
    Σ_s (
      quarterWeight_s * PerformanceSurprise_s
    ) / Wq
```

La evidencia conjunta usa la unión estable de evidencias:

```text
quarterEvidence =
  if Wq = 0:
    0
  else:
    -expm1(
      Σ_s stableLog1p(-evidenceStrength_s)
    )

quarterEvidenceAdjustedSurprise =
  quarterEvidence * quarterPerformanceSurprise
```

Para presión:

```text
quarterPressureWeight_s =
  mPressure_s * pressureEvidence_s

Wqp = Σ_s quarterPressureWeight_s

quarterPressureSurprise =
  if Wqp = 0:
    0
  else:
    Σ_s (
      quarterPressureWeight_s * PressureSurprise_s
    ) / Wqp

quarterPressureEvidence =
  if Wqp = 0:
    0
  else:
    -expm1(
      Σ_s stableLog1p(-pressureEvidence_s)
    )
```

La agregación se realiza con binary64 de la operación atómica antes de
cuantizar los facts de Q. Cada evidencia de segmento finita pertenece a
`[0,1)`; no se reabre desde un valor de presentación. El
`previousPerformanceSignal` consumido por Role & Minutes en Q siguiente es
exactamente `quarterEvidenceAdjustedSurprise`.

### 14.3 Dominio de Form

Form persiste como:

```text
FormStored ∈ integer [0,10000]
form = FormStored / 10000
```

Su espacio latente usa:

```text
formSafe =
  epsilonForm
  + (1 - 2*epsilonForm) * form

fStar =
  stableLogit(formSafe)
```

```text
0 < epsilonForm <= 1/(2*10000)
```

### 14.4 Inicialización

```text
Z_formInitial ~ Normal(0,1)

fStarInitial =
  muForm
  + sigmaFormInitial * Z_formInitial

FormStoredInitial =
  ROUND_HALF_EVEN(
    10000 * stableSigmoid(fStarInitial)
  )
```

`sigmaFormInitial >= 0`.

### 14.5 Transición Q→Q+1

Se agrega primero una señal única de Performance de todos los segmentos
cerrados de la Q; no se actualiza Form una vez por club o competición.

```text
sigmaFormEffective =
  sigmaForm
  * safeExp(
      -betaConsistencyForm
      * centeredConsistency
    )

Z_form ~ Normal(0,1)

fStarNext =
  muForm
  + phiForm * (fStar - muForm)
  + betaFormSurprise
      * quarterEvidenceAdjustedSurprise
  + betaFormPressure
      * quarterPressureEvidence
      * quarterPressureSurprise
  + sigmaFormEffective * Z_form

formNext =
  stableSigmoid(fStarNext)

FormStoredNext =
  ROUND_HALF_EVEN(
    10000
    * clampLogical(formNext, 0, 1)
  )
```

Restricciones:

```text
0 <= phiForm < 1
sigmaForm >= 0
betaConsistencyForm >= 0
```

No hay reset estacional. Con cero exposición, los términos de sorpresa son
cero, pero persisten reversión y shock temporal. El owner de Form emite
`PlayerDynamicStateChanged(stateKind = FORM)` después del cierre de
Performance; Performance no escribe el estado.

## 15. Summary de Q y temporada

### 15.1 Quantization de segmento/Q

Para dimensión `j`:

```text
expectedStored[j] =
  ROUND_HALF_EVEN(
    10000 * clampLogical(
      expectedPerformance[j], -1, 1
    )
  )

realizedStored[j] =
  ROUND_HALF_EVEN(
    10000 * clampLogical(
      realizedPerformance[j], -1, 1
    )
  )

evidenceStored =
  ROUND_HALF_EVEN(
    10000 * evidenceStrength
  )
```

La traza conserva los componentes latentes y shocks necesarios para goldens;
los facts usan valores cuantizados y referencias causales.

### 15.2 Agregación de segmentos

Para un scope de summary `S` y segmento `s`:

```text
segmentWeight_s =
  actualMinutes_s
  * evidenceStrength_s

W =
  Σ_s segmentWeight_s
```

Si `W > 0`:

```text
seasonExpected[j] =
  Σ_s (
    segmentWeight_s
    * expectedPerformance_s[j]
  ) / W

seasonRealized[j] =
  Σ_s (
    segmentWeight_s
    * realizedPerformance_s[j]
  ) / W
```

No es un promedio aritmético de ratings. Combina exposición y fuerza de
evidencia.

```text
totalMinutes =
  Σ_s actualMinutes_s

seasonEvidence =
  if totalMinutes = 0:
    0
  else:
    -expm1(
      -totalMinutes / tauSeasonEvidence[scope]
    )

evidenceUncertainty =
  1 - seasonEvidence
```

La dispersión contextual se conserva:

```text
betweenSegmentDispersion[j] =
  if W = 0:
    0
  else:
    sqrt(
      Σ_s (
        segmentWeight_s
        * (
            realizedPerformance_s[j]
            - seasonRealized[j]
          )^2
      ) / W
    )
```

Esto es diagnóstico/evidencia, no ruido re-sampleado.

### 15.3 Producción y presión

Los conteos se suman exactamente por stat y scope:

```text
seasonCount[stat] =
  Σ_s observedCount_s[stat]
```

No se normalizan ni reescriben por fuerza de competición.

Para presión:

```text
pressureWeight_s =
  mPressure_s
  * pressureEvidence_s

Wp =
  Σ_s pressureWeight_s
```

Si `Wp > 0`, `pressurePerformance[j]` se agrega con esos pesos. El summary
conserva:

- exposición equivalente high-pressure;
- performance esperada/realizada;
- `PressureSurprise`;
- evidencia;
- producción de la rama high-pressure;
- referencia al contexto competitivo que produjo `h`.

No se emite `PressurePerformanceRecorded` separado.

### 15.4 Splits obligatorios

El acumulador conserva:

- Q;
- `CLUB` frente a `NATIONAL_TEAM`;
- team/club;
- competition;
- effectivePosition;
- stratum de presión;
- `currentSportingClubId` causal;
- production counts;
- minutos y evidence.

Los summaries club y selección no se mezclan. Puede existir una vista de carrera
derivada, pero no sustituye sus scopes.

## 16. Derived evaluations

Una finalidad autorizada `purpose` puede definir:

```text
derivedPerformance[purpose] =
  Σ_j (
    purposeWeight[purpose, position, j]
    * seasonRealized[j]
  )

purposeWeight >= 0
Σ_j purposeWeight = 1
```

Dominio: `[-1,1]`.

Es `DERIVED_SUMMARY`:

- no genera production;
- no muta capabilities o Dynamic States;
- no es Overall;
- no permite usar pesos ST para CM/GK;
- no sustituye fields de Awards/Selection ni fórmulas de Scoring.

La evaluación contextual puede usar un shift explícito:

```text
evaluationUnit[j] =
  epsilonEvaluation
  + (1 - 2*epsilonEvaluation)
    * ((seasonRealized[j] + 1) / 2)

performanceEvaluationLogit[j] =
  stableLogit(evaluationUnit[j])

contextualEvaluationLatent[j] =
  performanceEvaluationLogit[j]
  + Σ_c evaluationContextWeight[j,c]
      * center01(context[c])

contextualEvaluation[j] =
  2 * stableSigmoid(contextualEvaluationLatent[j]) - 1
```

```text
0 < epsilonEvaluation <= 1/(2*10000)
```

Raw production permanece intacta. IJL no entra. `epsilonEvaluation` y todos los
`evaluationContextWeight` pertenecen al ParameterSet; no hay un fallback
implícito.

### 16.1 Proyección autorizada para Market

G3C-7 consume únicamente summaries/facts cerrados:

```text
MarketPerformanceProjection {
  performanceContextId
  position
  recentPerformance: signed [-1,1]
  evidenceStrength: [0,1]
  exposure
  observedProductionProjection
  pressureBreakdown
  uncertainty
  segmentRefs
}
```

La proyección:

- usa `derivedPerformance[purpose=MARKET]` y pesos parametrizados;
- conserva producción por posición y contextos club/competición;
- no expone task abilities, EffectiveCapabilities o UnderlyingPerformance;
- no combina toda posición mediante goals/assists;
- no usa MarketValue, fee, salary, CareerScore o reputación como inputs;
- no reabre ni resamplea Performance;
- mantiene splits multiclub y sparse-evidence.

Market aplica su recency/evidence transform sobre esta proyección; Performance
no calcula valoración, interés ni oferta.

## 17. Facts, señales y ownership

| Output | Clase canónica | Contenido |
|---|---|---|
| `EffectiveCapabilitiesResolved` | `INTERNAL_SIGNAL` | task logits/abilities y componentes |
| `UnderlyingPerformanceRecorded` | `INTERNAL_SIGNAL` | expected/realized dimensions, shocks y pressure branch |
| `ObservedProductionRecorded` | `PERSISTED_DOMAIN_FACT` | counts, exposición, position/context y strata |
| `PerformanceSummaryRecorded` | `PERSISTED_DOMAIN_FACT` | dimensiones cuantizadas, evidence, uncertainty y pressure breakdown |
| `SeasonPerformanceSummaryRecorded` | `PERSISTED_DOMAIN_FACT` | agregación y splits |
| `physicalIntensitySignal` | `INTERNAL_SIGNAL` | demanda física realizada `[0,1]` hacia Health |
| señales de confidence/trust/morale | `INTERNAL_SIGNAL` | valores signed y evidence refs |
| cambio de Form | `PlayerDynamicStateChanged` | lo emite Form owner |

No se crean aliases. Content no puede producir estos facts ni ScoreLedger.

## 18. Random streams

Namespace principal: `performance`.

| `modelId` | Scope/context | Purpose |
|---|---|---|
| `performance-underlying-common-v1` | player, season, Q, context kind | `common-window` |
| `performance-underlying-domain-v1` | player, season, Q, context kind, position/domain | `domain-shared` |
| `performance-underlying-specific-v1` | segment, dimension | `dimension-specific` |
| `performance-pressure-v1` | segment | `pressure-shared` |
| `performance-st-attack-production-v1` | segment, stratum | `attack-production-shared` |
| `performance-st-goals-nb2-v1` | segment, stratum | `goals-count` |
| `performance-st-assists-nb2-v1` | segment, stratum | `assists-count` |
| `performance-cm-production-v1` | segment, stratum | `midfield-production-shared` |
| `performance-cm-goals-nb2-v1` | segment, stratum | `goals-count` |
| `performance-cm-assists-nb2-v1` | segment, stratum | `assists-count` |
| `performance-gk-exposure-v1` | segment, stratum | `shots-exposure-shared` |
| `performance-gk-shots-nb2-v1` | segment, stratum | `shots-count` |
| `performance-gk-saves-binomial-v1` | segment, stratum | `saves-count` |
| `performance-gk-clean-sheet-allocation-v1` | segment, conceded-goal ordinal | `goal-bucket` |

Form usa namespace separado `form`:

| `modelId` | Context | Purpose |
|---|---|---|
| `form-initial-v1` | career, player | `initial-state` |
| `form-transition-v1` | career, player, season, Q | `quarter-shock` |

Reglas:

- club y selección incluyen `ParticipationContext` en la key;
- un factor compartido se samplea una vez y se pasa por referencia;
- `occurrence` de un count es la identidad de stat/stratum, no un contador
  global;
- el ordinal de goal allocation pertenece al count ya resuelto;
- añadir otra stat no desplaza draws existentes;
- ramas determinadas no consumen azar;
- `parameterSetHash` no entra en la key, conforme ADR-070.

## 19. `EngineParameterSet.performance`

### 19.1 Estructura normativa

```text
performance {
  taskAbilities {
    tasks[]
    capabilityCenters[task][capability]
    capabilityScales[task][capability]
    intercepts[task]
    capabilityWeights[task][capability]
    interactions[task][pair]
    dynamicCoefficients[task]
    contextCoefficients[task]
  }

  underlying {
    dimensionsByPosition
    intercepts[dimension]
    taskLoadings[dimension][task]
    contextWeights[dimension][context]
    commonLoadings[dimension]
    domainLoadings[dimension]
    pressureLoadings[dimension]
    sigmaCommon
    sigmaDomainBase[dimension]
    sigmaSpecificBase[dimension]
    sigmaPressureBase[dimension]
    consistencyDomainEffects[dimension]
    consistencySpecificEffects[dimension]
    consistencyPressureEffects[dimension]
    pressureResistanceEffects[dimension]
  }

  evidence {
    tauByPositionAndContext
    seasonTauByScope
    surpriseScales[dimension]
    surpriseWeights[position][dimension]
    pressureSurpriseScales[dimension]
    pressureSurpriseWeights[position][dimension]
  }

  stProduction {
    goalOpportunity
    chanceQuality
    conversion
    creativeOpportunity
    assistRealization
    roleEffects
    contextEffects
    sharedFactorLoadings
    sharedFactorSigma
    kappaGoals
    kappaAssists
  }

  cmProduction {
    goalModel
    assistModel
    contextEffects
    sharedFactorLoadings
    sharedFactorSigma
    kappaGoals
    kappaAssists
  }

  gkProduction {
    shotsFacedModel
    saveModel
    contextEffects
    exposureSigma
    kappaShotsFaced
    cleanSheetEligibilityPolicyRef
  }

  form {
    epsilon
    mean
    persistence
    initialSigma
    transitionSigma
    consistencyEffect
    surpriseEffect
    pressureEffect
  }

  signals {
    confidenceSurprise
    confidencePressure
    managerTrustSurprise
    managerTrustPressure
    moraleSurprise
    moralePressure
  }

  summaries {
    purposeWeights
    evaluationContextWeights
    epsilonEvaluation
    quantizationScales
  }

  streamModelIds {
    // exact IDs de §18
  }
}
```

### 19.2 Cobertura exhaustiva de símbolos

La estructura anterior no habilita defaults ocultos. Cada símbolo de las
ecuaciones tiene el siguiente path normativo; una entrada ausente invalida el
ParameterSet.

| Símbolos de ecuación | Path normativo |
|---|---|
| `capabilityCenter`, `capabilityScale`, `taskIntercept`, `capabilityWeight`, `interactionWeight` | `performance.taskAbilities.{capabilityCenters, capabilityScales, intercepts, capabilityWeights, interactions}` |
| `betaForm`, `betaConfidence`, `betaFitness`, `betaFatigue`, `betaMorale`, `betaTactical`, `betaRestriction` | `performance.taskAbilities.dynamicCoefficients[task].*` |
| `contextWeight` de task | `performance.taskAbilities.contextCoefficients[task][contextKey]` |
| `performanceIntercept`, `taskLoading`, `performanceContextWeight` | `performance.underlying.{intercepts, taskLoadings, contextWeights}` |
| `commonLoading`, `domainLoading`, `pressureLoading` | `performance.underlying.{commonLoadings, domainLoadings, pressureLoadings}` |
| `sigmaCommon`, `sigmaDomainBase`, `sigmaSpecificBase`, `sigmaPressureBase` | `performance.underlying.*` con el mismo nombre |
| `betaConsistencyDomain`, `betaConsistencySpecific`, `betaConsistencyPressure` | `performance.underlying.{consistencyDomainEffects, consistencySpecificEffects, consistencyPressureEffects}` |
| `betaPressureResistance` | `performance.underlying.pressureResistanceEffects[dimension]` |
| `tauEvidence`, `tauSeasonEvidence` | `performance.evidence.{tauByPositionAndContext, seasonTauByScope}` |
| `surpriseScale`, `surpriseWeight`, `pressureSurpriseScale`, `pressureSurpriseWeight` | `performance.evidence.{surpriseScales, surpriseWeights, pressureSurpriseScales, pressureSurpriseWeights}` |
| todos los intercepts y `beta*` de §§8.2–8.5 | `performance.stProduction.{goalOpportunity, chanceQuality, conversion, creativeOpportunity, assistRealization}` |
| `roleOpportunityEffect`, `roleCreativeEffect` | `performance.stProduction.roleEffects[branch][SportingRole]` |
| `attackProductionLoadingGoal`, `attackProductionLoadingAssist`, `sigmaAttackProduction` | `performance.stProduction.{sharedFactorLoadings, sharedFactorSigma}` |
| `kappaGoals`, `kappaAssists` de ST | `performance.stProduction.{kappaGoals, kappaAssists}[positionContext]` |
| todos los intercepts y `beta*` de §9.3 | `performance.cmProduction.{goalModel, assistModel}` |
| `midfieldProductionLoadingGoal`, `midfieldProductionLoadingAssist`, `sigmaMidfieldProduction` | `performance.cmProduction.{sharedFactorLoadings, sharedFactorSigma}` |
| `kappaCmGoals`, `kappaCmAssists` | `performance.cmProduction.{kappaGoals, kappaAssists}` |
| `gkShotsFacedIntercept`, todos los `betaGk*` de §§10.2–10.3 | `performance.gkProduction.{shotsFacedModel, saveModel}` |
| `sigmaGkExposure`, `kappaShotsFaced` | `performance.gkProduction.{exposureSigma, kappaShotsFaced}` |
| eligibility de clean sheet | `performance.gkProduction.cleanSheetEligibilityPolicyRef` |
| `epsilonForm`, `muForm`, `phiForm`, `sigmaFormInitial`, `sigmaForm`, `betaConsistencyForm`, `betaFormSurprise`, `betaFormPressure` | `performance.form.{epsilon, mean, persistence, initialSigma, transitionSigma, consistencyEffect, surpriseEffect, pressureEffect}` |
| los seis `beta*` de señales | `performance.signals.*` con el nombre semántico correspondiente |
| `purposeWeight`, `evaluationContextWeight`, `epsilonEvaluation` | `performance.summaries.{purposeWeights, evaluationContextWeights, epsilonEvaluation}` |
| escalas de quantization | `performance.summaries.quantizationScales` |
| IDs de §18 | `performance.streamModelIds` |

Los factores `2`, la base natural de `exp/log`, `10000`, la convención NB2,
el orden de las CDF y los nodos/pesos de
`LogitNormalMeanGaussHermite10V1` son constantes del math profile
`STRUCTURAL_FIXED`, no parámetros de balance. `epsilonCapability` se referencia
desde `EngineParameterSet.creationDevelopment.capabilitySpace`; no se duplica.

Los mapas se publican sobre catálogos canónicos ordenados. Un coeficiente
estructuralmente nulo se publica como `0`; omitirlo no significa cero.

### 19.3 Clasificación

| Clase | Parámetros |
|---|---|
| `STRUCTURAL_FIXED` | catálogos/orden de tasks y dimensiones; `center01`; capability transform family; Normal hierarchy shape; NB2 convention; inverse-CDF/categorical algorithms; zero-draw branches; summary equations; quantization scales; stream key fields |
| `INITIAL_CALIBRATION_REQUIRED` | todos los intercepts, weights, interactions, loadings, sigmas, consistency/pressure effects, taus, surprise scales/weights, opportunity/conversion coefficients, NB dispersions, form coefficients y signal coefficients |
| `TUNABLE_LATER` | purpose-specific derived evaluation weights, overrides contextuales aprobados y tolerancias diagnósticas que no sean gate inicial |

Un valor `TUNABLE_LATER` publicado sigue siendo causal: cambiarlo en una release
oficial cambia `parameterSetHash` y al menos patch de `engineVersion`.

No hay constantes numéricas de balance fuera de esta estructura.

## 20. Invariantes y properties

### 20.1 Invariantes duras

1. `actualMinutes = 0` implica cero production y ausencia de draws on-field.
2. Todos los counts son enteros `>= 0`.
3. `0 <= saves <= shotsFaced`.
4. `goalsConceded = shotsFaced - saves`.
5. `0 <= cleanSheets <= cleanSheetEligibleAppearances`.
6. Task abilities pertenecen a `(0,1)`.
7. Performance dimensions pertenecen a `[-1,1]` al persistirse.
8. Evidence pertenece a `[0,1]`.
9. No existen `NaN`, infinitos o `-0` persistidos.
10. Mismos inputs/seed/versions/ParameterSet producen bytes y facts iguales.
11. Performance no modifica capabilities, role, minutes o Health state.
12. Raw production no depende de IJL ni de Scoring.
13. Stats de un segmento se agregan exactamente una vez.
14. No existen caps editoriales de goals, assists, saves o performance.

### 20.2 Monotonicidad de expectativa

Manteniendo otros inputs constantes y un ParameterSet válido:

- mayor `ST_CONVERSION` no reduce `conversionProbability`;
- mayor `ST_SCORING_OPPORTUNITY` no reduce
  `goalOpportunityIntensity`;
- mayor `GK_SHOT_STOPPING` no reduce `pSave`;
- mayor `consistency` no aumenta la varianza condicional atribuible al jugador;
- mayor `pressureResistance` no empeora el response esperado con `h > 0`;
- mayor `fitness` no empeora una task cuyo coeficiente fitness sea positivo;
- mayor `fatigue` no mejora una task cuyo coeficiente fatigue sea positivo.

No se exige monotonicidad de outcomes sampleados.

### 20.3 ParameterSet validation

El validator rechaza:

- escalas, taus, kappas o sigmas fuera de sus dominios;
- pesos de surprise/purpose que no sumen `1` dentro de tolerancia del math
  profile;
- loadings principales con signo contrario al declarado;
- `phiForm` fuera de `[0,1)`;
- combinación oficial capaz de desbordar `safeExp` en los dominios publicados,
  incluido el soporte finito de `StandardNormalInverseCdfV1` inducido por el
  uniforme midpoint de 53 bits;
- categorías/tasks/dimensiones duplicadas o sin orden canónico;
- stream IDs ausentes o reutilizados con otra semántica.

No corrige parámetros inválidos mediante clipping.

## 21. Calibration targets

### 21.1 Segmentación mínima

- Position: `GK`, `CM`, `ST`.
- Contexto: Argentina, España.
- SportingRole cuando afecte exposición/oportunidad.
- `CLUB` y `NATIONAL_TEAM` por separado.
- Age solo como diagnóstico si upstream produce sensibilidad; Performance no
  introduce efecto de edad directo.

### 21.2 `INVARIANT`

| ID | Métrica |
|---|---|
| PERF-I01 | cero minutos → cero production y cero draws on-field |
| PERF-I02 | counts enteros no negativos |
| PERF-I03 | saves/goals-conceded identity |
| PERF-I04 | clean sheets dentro de eligibility |
| PERF-I05 | conservación de minutos/counts por splits |
| PERF-I06 | raw production independiente de IJL/scoringVersion |
| PERF-I07 | determinismo por seed/context/parameters |
| PERF-I08 | bounds y ausencia de valores no finitos |
| PERF-I09 | monotonicidades de expectativa declaradas |
| PERF-I10 | no mutación de capabilities/minutes |

### 21.3 `CALIBRATION_TARGET`

| Familia | Targets | Evidencia |
|---|---|---|
| General | distribución de realized performance por dimensión; variance por consistency; evidence; autocorrelación Q; extremos positivos/negativos | referencia histórica + criterio de diseño |
| Form | autocorrelación Q, persistencia de rachas, reversión y frecuencia de extremos | criterio de diseño; contraste observacional indirecto |
| ST | goals/90, assists/90, zero-goal frequency, quantiles de temporada, correlación goal/assist y colas | datos externos versionados |
| CM | goals/assists, distribución de cuatro impactos y correlaciones entre impactos | datos externos para counts; targets de impacto requieren definición/calibración interna |
| GK | shots faced, save rate, goals conceded, clean sheets y sensibilidad al entorno defensivo | datos externos versionados |
| Pressure | distribución de exposure, response y diferencia por pressureResistance | definición upstream + evidencia externa cuando exista |
| Context | sensibilidad a attack/defense/opponent/competition sin reescribir raw counts | datos/context models G3C-6 |

Las bandas numéricas faltan antes de publicar el ParameterSet inicial. No se
inventan en G3C-4.

### 21.4 `DIAGNOSTIC`

- role ↔ performance y role ↔ production;
- performance Qn ↔ role/minutes Qn+1;
- task ability ↔ realized performance;
- production ↔ Underlying Performance;
- team context ↔ production;
- pressure exposure ↔ pressure outcomes;
- evidence ↔ estabilidad de evaluación;
- consistency ↔ conditional variance;
- efecto de Jensen de la transformación acotada por nivel de consistency;
- Form ↔ Q-to-Q performance;
- multiclub aggregation conservation.

Un diagnostic no se convierte automáticamente en constraint.

## 22. Tail calibration

Las suites reportan por segmento y agregado:

- P90, P95, P99 y P99.9 cuando el tamaño lo permita;
- temporadas de goals excepcionalmente altas;
- conversion rates extremas condicionadas por exposure;
- save rates extremas con su sample size;
- Q extraordinarias/terribles por dimensión;
- streak length de Form;
- zero-heavy y high-count tails;
- tiempo/iteraciones de inverse-CDF.

No se corrigen colas mediante caps. Se ajustan tasas, dispersiones, factores y
contexto causal.

## 23. Golden vectors requeridos

Cada fixture incluye `VersionSet`, `parameterSetHash`, root seed,
`PerformanceSegmentKey`, parámetros sintéticos explícitos y orden de draws.

### 23.1 Task ability

```text
20 capabilities
+ dynamic states
+ context
+ centers/scales/weights/interactions
→ capabilityFeature
→ baseTaskLogit
→ effectiveTaskLogit
→ exact taskAbility
```

Debe incluir capabilities `0`, `10000` y un valor intermedio.

### 23.2 Underlying Performance

```text
task logits
+ fixed Z_common/Z_domain/Z_specific/Z_pressure
+ loadings/sigmas
→ ordinaryLatent
→ pressureLatent
→ expectedPerformance
→ realizedPerformance
```

### 23.3 Consistency

Mismo centro y draws, `consistency = 0` frente a `1`:

```text
sigmaHighConsistency / sigmaLowConsistency =
  exp(-2 * betaConsistency)
```

para cada componente afectado.

### 23.4 Evidence

Debe fijar:

```text
m = 0 → evidence = 0
m > 0 → -expm1(-m/tau)
```

con expected binary64 y quantization.

### 23.5 ST

Inputs y draws conocidos:

```text
exposure
→ opportunity log-rate
→ chance quality
→ conversion/assist realization
→ mu
→ NB2 log-CDF steps
→ goals/assists exactos
```

Goals y assists prueban factor compartido y keys específicas.

### 23.6 CM

```text
tasks + factors
→ cuatro impactos exactos
→ quantization
→ goal/assist means
→ NB2 counts
```

### 23.7 GK

```text
environment + performance
→ muShots
→ NB2 shotsFaced
→ pSave
→ Binomial saves
→ goalsConceded
→ goal-bucket allocations
→ cleanSheets
```

Incluye:

- cero shots;
- `pSave` interior producido por predictor finito; los casos lógicos
  Binomial `p=0/1` se prueban por separado en §23.10;
- goles concentrados en un bucket;
- goals concedidos fuera de exposure elegible.

### 23.8 Form

```text
fixed segment surprises/evidence
→ quarterPerformanceSurprise
→ quarterEvidenceAdjustedSurprise

prior FormStored
+ evidence/surprise/pressure
+ fixed Zform
+ parameters
→ fStarNext
→ sigmoid
→ ROUND_HALF_EVEN
→ exact FormStoredNext
```

### 23.9 Season summary

Cuatro Q, dos clubes y dos competiciones:

```text
segment weights
→ aggregate expected/realized
→ exact count sums
→ evidence/uncertainty
→ pressure breakdown
→ splits
```

### 23.10 Samplers

Goldens separados cubren:

- Poisson `lambda = 0`, pequeño y cola;
- NB2 `mu = 0`, varios `kappa` y cola;
- Binomial `n = 0`, `p = 0`, `p = 1` e interior;
- Categorical de clean sheet con masa outside `0`, interior y cercana a `1`;
- primer `n/y` cuyo log-CDF cruza `logU`;
- mismo `uint64` en runtimes soportados;
- guard inconclusive sin output de gameplay.

## 24. Monte Carlo

### SMOKE

- todas las invariantes;
- branches cero y determinadas;
- soporte de counts y performance;
- separación de streams;
- conservación de splits;
- no valores no finitos.

### CALIBRATION

- distribución por position/role/context;
- production por minuto;
- correlaciones internas;
- variance por consistency;
- pressure response;
- Form persistence;
- zero/low/high exposure;
- context sensitivities;
- targets Argentina/España.

### DEEP

- P99/P99.9 y rare counts;
- temporadas largas y multiclub;
- streaks extremos;
- sparse-exposure outliers;
- sensibilidad global de parámetros;
- estabilidad de inverse-CDF;
- cross-system diagnostics con Role/Minutes y Club context.

Las tres suites reutilizan `CalibrationSeedSet` y common random numbers.

## 25. Estado de cierre G3C-4

| ID | Estado | Matemática cerrada | Pendiente |
|---|---|---|---|
| G3B-D02 | `PARTIAL_CALIBRATION` | task logits, dynamic/context transform y expected/realized multidimensional | valores, adapters G3C-5/6 y targets |
| G3B-D03 | `PARTIAL_CALIBRATION` | cuatro shocks Normal, consistency transform, NB2/Binomial e inverse-CDF | loadings, sigmas, kappas y evidencia |
| G3B-D04 | `PARTIAL_CALIBRATION` | Form AR(1) latente y señales exactas hacia confidence/trust/morale | parámetros y dinámicas completas de owners no Performance |
| G3B-D05 | `PARTIAL_CALIBRATION` | shots NB2 → saves Binomial → conceded → clean sheets derivadas | valores, eligibility/calendar upstream y targets GK |
| G3B-D06 | `PARTIAL_CALIBRATION` | cuatro impactos CM + goals/assists NB2 correlacionados | valores y targets |
| G3B-D07 | `PARTIAL_CALIBRATION` | opportunity/chance/conversion ST + goals/assists NB2 correlacionados | valores y targets |
| G3B-D08 | `PARTIAL_CALIBRATION` | split de exposure, response de presión y pressure breakdown | productor high-pressure G3C-6, valores y targets |
| G3B-D09 | `PARTIAL_CALIBRATION` | agregación exposure×evidence, counts, uncertainty y splits | taus, weights, payload schema y targets |

Las ocho decisiones tienen familia matemática y sampler cerrados. Ninguna
permanece `PARTIAL` por falta de ecuación.

DR-055 pasa a `PARTIAL_CALIBRATION`. DR-056 queda parcialmente abierta: G3C-4
cierra Form y las señales desde Performance, no la dinámica completa de
confidence/morale/managerTrust. DR-057, DR-059, DR-060, DR-061 y DR-010
conservan sus matemáticas propias.

### Reconciliación de contexto G3C-6

[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
produce los adapters numéricos que esta especificación consume:

- attack/defensive/control environment en `[0,1]`;
- opponent attack/defense y shot-quality environment en `[0,1]`;
- schedule difficulty, competition strength y pressure exposure en `[0,1]`;
- `TacticalFit ∈ (0,1)`;
- splits de `TeamMinutesOpportunity` por competition y Q.

Estos valores proceden de strengths multidimensionales, support/field y phase
context; nunca de `ClubOverall` o IJL. Performance entrega después un
`PerformanceContributionInput` segmentado. G3C-6 proyecta ese summary a
`PlayerCompetitiveContribution` sin recalcular task abilities, producción,
evidence o surprise.

## 26. Gates antes de implementación

1. Publicar todos los valores `INITIAL_CALIBRATION_REQUIRED`.
2. Aprobar targets externos para ST/CM/GK.
3. G3C-5 fija los adapters de fitness/fatigue/restricciones; faltan valores y
   goldens conjuntos.
4. G3C-6 publicar contextos, pressure exposure y clean-sheet eligibility.
5. Congelar payload schemas compatibles con DR-063.
6. Calcular y aprobar todos los goldens.
7. Superar properties y Monte Carlo `SMOKE`, `CALIBRATION`, `DEEP`.
8. Verificar replay cross-runtime y hashes.
9. Mantener `engineVersion + parameterSetHash` de ADR-070.
10. No implementar Awards/Selection/Scoring usando valores provisionales.

No existe blocker de familia matemática para comenzar la especificación
G3C-5. Sí existen blockers de calibración para implementar Performance oficial.

### Adapter G3C-8 — Selection y Awards

- Selection recibe `selectionPerformanceSignal` purpose-scoped,
  `evidenceStrength`, `contextualProductionResidual` y splits de club/nacional;
- Awards recibe matrices GK/CM/ST sobre las dimensiones ya existentes, nunca
  TrueCapabilities, un EffectiveOverall o stats nuevos inventados;
- ST usa attacking/creative/off-ball/pressing y producción contextual; CM usa
  progression/creative/control/defensive; GK usa shot-stopping/command/
  distribution;
- errores/penalties GK siguen fuera mientras no exista un consumer/Definition
  autorizada; distribution puede evaluarse como UnderlyingPerformance;
- InternationalPerformance usa `participationContext=NATIONAL_TEAM` y no se
  agrega al summary de club por accidente.

Las transforms finales de candidatura y premios pertenecen a
[`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](NATIONAL_TEAM_AWARDS_MATH_SPEC.md).

### Adapter G3C-9 — Reputation/Public Attention

Performance no actualiza Reputation ni Social. Por cada summary cerrado puede
exponer un `ReputationPerformanceEvidence` purpose-scoped con:

- `sourceFactId`/`EvidenceKey` estable;
- performance contextual posicional, evidence y exposure;
- pressure breakdown y `PerformanceSurprise` contextual;
- public relevance/context, cuando exista producer autorizado;
- splits CLUB/NATIONAL_TEAM, team, competition, Q y position.

G3C-9 transforma esas features mediante profiles propios. No recibe
TrueCapabilities, task logits ocultos, un EffectiveOverall ni raw goals como
señal universal. El summary de una Q entra una vez y nunca modifica
Performance, Form o Minutes de esa Q. Public Attention solo consume surprise
cuando la causa es publicable; un mal partido no crea sentiment negativo por
defecto.

## 27. Referencias

- [MASTER_SPEC v0.8](MASTER_SPEC.docx)
- [Contrato matemático](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Performance estructural](PERFORMANCE_MODEL_SPEC.md)
- [Role & Minutes matemático](ROLE_MINUTES_MATH_SPEC.md)
- [Creation & Development matemático](CREATION_DEVELOPMENT_MATH_SPEC.md)
- [Health estructural](HEALTH_INJURY_SPEC.md)
- [Health matemática](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)
- [Club/World estructural](CLUB_COMPETITION_WORLD_SPEC.md)
- [National Team/Awards](NATIONAL_TEAM_AWARDS_SPEC.md)
- [Facts y Scoring](SCORING_FACTS_SPEC.md)
- [ADR-042](adr/042-season-health-performance.md)
- [ADR-044](adr/044-effective-position-and-retraining.md)
- [ADR-051](adr/051-deterministic-core-byte-contracts.md)
- [ADR-054](adr/054-role-and-minutes-model.md)
- [ADR-055](adr/055-performance-and-production-model.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-071](adr/071-creation-development-mathematics.md)
- [ADR-072](adr/072-role-minutes-and-availability-mathematics.md)
- [ADR-073](adr/073-performance-production-form-mathematics.md)
- [ADR-074](adr/074-health-injury-recovery-mathematics.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)
- [Club/World matemático](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [Reputation/Social matemático](REPUTATION_SOCIAL_MATH_SPEC.md)

## 46. Adapter de Scoring cerrado por G3C-11

Scoring consume únicamente `PerformanceSummaryRecorded` y
`SeasonPerformanceSummaryRecorded`, más production/exposure facts allowlisted.
ADR-080 transforma sus dimensiones task-specific, evidence, pressure y splits
mediante cohortes congeladas; no lee task latents, hidden capabilities ni
`performanceRating`. Club y selección conservan segmentos distintos y una
transferencia no reasigna stats. Este adapter no cambia ninguna ecuación de
Performance.
