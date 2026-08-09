# Health, Injury, Recovery, Fatigue & Fitness Mathematical Specification

**Estado:** especificación matemática normativa de G3C-5; valores de
calibración y catálogo médico del vertical slice pendientes  
**Fecha:** 2026-07-29  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-002 a ADR-007, ADR-013, ADR-042,
ADR-051, ADR-053, ADR-054, ADR-057, ADR-070, ADR-072, ADR-073 y ADR-074  
**Alcance:** Health, carga, fitness, fatigue, lesión, recuperación, recaída,
retorno y secuela; no implementa Club/World, Retirement ni deltas de
capabilities

---

## 1. Propósito y límites

Este documento cierra las familias matemáticas de:

- G3B-E02: exposición y multiplicidad;
- G3B-E03: hazard dinámico;
- G3B-E05: severidad, duración y recuperación;
- G3B-E06: retorno y recaída;
- G3B-E07: secuelas.

Después de este cierre ninguna de esas decisiones queda abierta por falta de
ecuación, distribución o sampler. Permanecen abiertos:

- valores del `EngineParameterSet.health`;
- targets y tolerancias de calibración;
- seis definiciones mecánicas concretas de lesión del vertical slice;
- producers de calendario, congestión, exposición de entrenamiento y
  `medicalQuality` que pertenecen a G3C-6;
- hazard de retiro, que pertenece a una fase posterior.

Este documento no autoriza gameplay antes de publicar y validar un
`EngineParameterSet` completo.

### 1.1 Prohibiciones

Health no:

- recalcula minutos o Performance;
- modifica capabilities;
- usa `PerformanceRating` como proxy de carga;
- crea un `ScoreLedgerEntry`;
- asigna suspensiones;
- convierte una lesión externa en una segunda tirada deportiva;
- impone cupos, máximos de lesiones, cooldowns o duraciones fijas;
- reabre una Q ya cerrada.

## 2. Notación y dominios

### 2.1 Funciones comunes

Se reutilizan, sin implementaciones alternativas:

```text
center01(x) = 2*x - 1
stableSigmoid
stableLogit
softplus
safeExp
safeLog
stableLog1p
stableExpm1
hazardToProbability(H) = -stableExpm1(-H)
ROUND_HALF_EVEN
```

Las definiciones y comportamiento en extremos pertenecen a
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md).

### 2.2 Representación de estados acotados

Los estados persistidos acotados de Health usan:

```text
StoredUnit = integer in [0, 10000]
unit(stored) = stored / 10000
```

Aplica a:

- `fitness`;
- `fatigue`;
- `acuteLoad`;
- `chronicLoad`;
- burdens acotados;
- restricciones acotadas;
- secuelas acotadas.

El cálculo dentro de una operación atómica usa binary64 finito. Solo se
cuantiza al persistir el checkpoint:

```text
quantizeUnit(x) =
  ROUND_HALF_EVEN(10000 * clampLogical(x, 0, 1))
```

`-0` se normaliza a `+0`. NaN e infinitos son errores explícitos.

### 2.3 Cuantización de un dominio abierto

Severidad y otros valores que representan una magnitud estrictamente interior
usan:

```text
quantizeOpenUnit(x) =
  minLogical(
    9999,
    maxLogical(1, ROUND_HALF_EVEN(10000*x))
  )

where 0 < x < 1
```

Los límites `1` y `9999` preservan la semántica abierta después de cuantizar;
no son caps editoriales. Un cero o uno exacto solo puede proceder de una
categoría lógica separada, nunca de redondear una magnitud interior.

### 2.4 Burden de recuperación

La recuperación usa unidades abstractas de trabajo fisiológico, no días:

```text
RecoveryBurdenStored = integer >= 0
recoveryBurden = RecoveryBurdenStored / recoveryBurdenUnitScale
```

`recoveryBurdenUnitScale` es un entero positivo versionado. No se fija un
valor en esta fase. El valor inicial positivo se preserva así:

```text
quantizePositiveBurden(x) =
  maxLogical(
    1,
    ROUND_HALF_EVEN(recoveryBurdenUnitScale * x)
  )

where x > 0
```

El cero está reservado a recuperación completada. No existe máximo mecánico de
burden ni duración.

La persistencia debe usar un entero exacto. No puede convertir un valor fuera
del safe-integer range a binary64 silenciosamente; el schema futuro deberá usar
un entero canónico exacto o una representación decimal validada compatible con
RFC 8785. Esa elección de schema no autoriza un máximo de gameplay.

### 2.5 Convenciones de variables

```text
q                  quarter Q1..Q4
e                  InjuryEpisode
j                  InjuryFamily
o                  origin MATCH | TRAINING
c                  competition segment
k                  Performance task
xHat               normalized value in [0,1]
z                  unbounded latent value
Z                  Standard Normal draw
```

Todo ID, orden y contexto usa las claves canónicas de ADR-070.

### 2.6 Dominios de inputs

| Input | Dominio |
|---|---|
| `fitness`, `fatigue`, load states | `[0,1]` |
| `injuryFragility`, `recoveryCapacity`, `longevity` normalizados | `[0,1]` |
| `medicalQuality` | `[0,1]` |
| `preparationSignal`, `recoveryOpportunity` | `[0,1]` |
| exposure/intensity/congestion/schedule signals | `[0,1]` |
| context features tipadas | `[-1,1]` |
| `exactAge` | finite `>=0`, años derivados del tiempo ordinal |
| opportunity/minute counts | integer `>=0` |

`exactAge` usa el midpoint ordinal de Q de ADR-072; no consulta reloj ni fecha
real posterior.

## 3. Pipeline matemático por Q

El orden normativo es:

```text
HealthState at Q start
-> MedicalAvailabilityEnvelope(Q)
-> Role/Minutes(Q)
-> Performance(Q)
-> realized exposure and physical-intensity signals
-> load-state update
-> fatigue and fitness update candidates
-> new-injury occurrence and severity
-> recovery progression for pre-existing episodes
-> relapse resolution for eligible pre-existing episodes
-> sequela resolution for episodes completed in Q
-> atomic HealthState(Q+1)
```

Reglas:

1. `MedicalAvailabilityEnvelope(Q)` usa únicamente estado confirmado al inicio
   de Q.
2. `actualMinutes(Q)` y Performance(Q) quedan cerrados antes de Health(Q).
3. La carga de Q puede afectar el hazard resuelto al final de esa Q.
4. Una lesión nueva de Q no progresa recuperación ni recae dentro de la misma
   Q: no existe exposición causal posterior a su onset dentro de la resolución
   agregada.
5. Una lesión detectada en Health(Q) solo afecta disponibilidad, restricciones,
   Performance y desarrollo desde Q+1.
6. El commit es atómico. Un error invalida toda la transición Health(Q).

Este orden refina el orden estructural exploratorio de
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) sin modificar ADR-042.

## 4. Estado canónico de Health

### 4.1 Estado persistido

```text
HealthState {
  fitnessStored
  fatigueStored
  acuteLoadStored
  chronicLoadStored
  activeEpisodes[]
  activeSequelae[]
  historyAccumulators[]
  relatedEpisodeIndex[]
}
```

Cada `InjuryEpisode` conserva, al menos:

```text
episodeId
familyId
origin
onsetCursor
severityStored
initialRecoveryRequirementStored
remainingRecoveryBurdenStored
progressionCount
parentEpisodeId?
relatedEpisodeId?
recoveryState
causalReferences[]
```

La lista es semántica; el schema concreto deberá respetar DR-063.

### 4.2 Valores derivados

No se persisten como fuentes causales independientes:

- `realizedLoad`;
- `competitiveDoseRate`;
- `trainingDoseRate`;
- `loadDeviation`;
- `positiveLoadDeviation`;
- `healthBurden`;
- `episodeAvailability`;
- `physicalRestrictionByTask`;
- `medicalAvailabilityShare`;
- `expectedRecoveryDistribution`;
- `ageSusceptibility`;
- `historyBurden`.

Pueden aparecer en una traza/checkpoint auditable.

### 4.3 Inicialización

Cada estado dinámico tiene su propio draw:

```text
fatigueStar[0] =
  fatigue.initialMeanLatent[context]
  + fatigue.initialSigma[context] * Z_fatigueInitial

fitnessStar[0] =
  fitness.initialMeanLatent[context]
  + fitness.initialSigma[context] * Z_fitnessInitial

acuteStar[0] =
  load.initialAcuteMeanLatent[context]
  + load.initialAcuteSigma[context] * Z_acuteInitial

chronicStar[0] =
  load.initialChronicMeanLatent[context]
  + load.initialChronicSigma[context] * Z_chronicInitial

fatigue[0] = stableSigmoid(fatigueStar[0])
fitness[0] = stableSigmoid(fitnessStar[0])
acuteLoad[0] = stableSigmoid(acuteStar[0])
chronicLoad[0] = stableSigmoid(chronicStar[0])
```

No se asume que fitness y fatigue sean complementos.

## 5. Exposición y carga realizada

### 5.1 Inputs

Por segmento de participación confirmado:

```text
competitiveExposureShare[c] =
  if teamMinutesOpportunity[c] = 0
  then 0
  else actualMinutes[c] / teamMinutesOpportunity[c]

physicalIntensitySignal[c] in [0,1]
trainingExposure in [0,1]
trainingIntensitySignal in [0,1]
congestionSignal in [0,1]
scheduleDifficulty in [0,1]
```

`physicalIntensitySignal` es un output físico de Performance, no rating,
goles, assists ni outcome competitivo.

### 5.2 Dosis competitiva

Para cada segmento:

```text
etaCompetitive[c] =
    load.competitiveIntercept[position, participationContext]
  + load.betaIntensity
      * center01(physicalIntensitySignal[c])
  + load.betaCongestion
      * center01(congestionSignal[c])
  + load.betaScheduleDifficulty
      * center01(scheduleDifficulty[c])
  + sum_m(
      load.competitiveContextWeight[m]
      * competitiveContextFeature[c,m]
    )

competitiveDoseRate[c] =
  competitiveExposureShare[c] * softplus(etaCompetitive[c])

competitiveDoseRate = sum_c(competitiveDoseRate[c])
```

La dosis puede superar uno. No se trunca porque es una intensidad integrada,
no una proporción.

### 5.3 Dosis de entrenamiento/background

```text
etaTraining =
    load.trainingIntercept[context]
  + load.betaTrainingIntensity
      * center01(trainingIntensitySignal)
  + load.betaTrainingCongestion
      * center01(congestionSignal)
  + sum_m(
      load.trainingContextWeight[m]
      * trainingContextFeature[m]
    )

trainingDoseRate =
  trainingExposure * softplus(etaTraining)
```

Por tanto:

```text
actualMinutes = 0
and trainingExposure > 0
=> trainingDoseRate > 0
```

para parámetros finitos y contenido habilitado.

### 5.4 Carga normalizada

```text
totalDoseRate =
  competitiveDoseRate + trainingDoseRate

realizedLoad =
  -stableExpm1(-totalDoseRate)
```

Propiedades:

```text
totalDoseRate >= 0
0 <= realizedLoad < 1 for finite totalDoseRate
```

La saturación transforma una dosis positiva en estado acotado; no corta la
cola del número de lesiones, cuyo hazard conserva los dose rates sin acotar.

### 5.5 Memoria aguda y crónica

```text
acuteLoadNext =
    rhoAcute * acuteLoad
  + (1-rhoAcute) * realizedLoad

chronicLoadNext =
    rhoChronic * chronicLoad
  + (1-rhoChronic) * realizedLoad
```

Constraint del ParameterSet:

```text
0 <= rhoAcute < rhoChronic < 1
```

Así `acuteLoad` tiene memoria más corta que `chronicLoad`.

### 5.6 Desviación estable de carga

No se usa un ratio crudo:

```text
loadDeviation =
  (acuteLoadNext - chronicLoadNext)
  /
  (
    loadDeviationEpsilon
    + acuteLoadNext
    + chronicLoadNext
  )

positiveLoadDeviation =
  maxLogical(0, loadDeviation)
```

```text
loadDeviationEpsilon > 0
-1 < loadDeviation < 1
0 <= positiveLoadDeviation < 1
```

`maxLogical` expresa la parte positiva de exceso de carga, no un threshold
editorial. El hazard también conserva `realizedLoad` y dosis por origen, por lo
que carga no excesiva no implica riesgo cero.

### 5.7 Señales hacia otros sistemas

```text
developmentLoadSignal =
  -stableExpm1(
    -(
      load.toDevelopmentCurrentWeight * realizedLoad
      + load.toDevelopmentAcuteWeight * acuteLoadNext
      + load.toDevelopmentChronicWeight * chronicLoadNext
      + load.toDevelopmentDeviationWeight * positiveLoadDeviation
    )
  )

inactivitySignal =
  safeExp(
    -(
      load.inactivityCompetitiveWeight * competitiveDoseRate
      + load.inactivityTrainingWeight * trainingDoseRate
    )
  )
```

Todos los weights son no negativos. Ambas señales están en `[0,1]`.

## 6. Burden de condiciones concurrentes

### 6.1 Burden por episodio

Para un episodio activo:

```text
residualFraction[e] =
  remainingRecoveryBurden[e]
  /
  initialRecoveryRequirement[e]

episodeBurdenIntensity[e] =
  residualFraction[e]
  * softplus(
      burden.intercept[family[e]]
      + burden.betaSeverity[family[e]]
          * center01(severity[e])
      + burden.betaHistory[family[e]]
          * historyBurden[family[e]]
      + sum_m(
          burden.contextWeight[family[e],m]
          * conditionContextFeature[e,m]
        )
    )

episodeHealthBurden[e] =
  -stableExpm1(-episodeBurdenIntensity[e])
```

Un episodio resuelto tiene burden cero.

### 6.2 Composición escalar

Para burdens `b_i in [0,1]`:

```text
composeBurden(b[]) =
  if any b_i = 1
  then 1
  else -stableExpm1(
    sum_i(stableLog1p(-b_i))
  )
```

Con el signo correcto equivalente:

```text
composeBurden(b[]) = 1 - product_i(1-b_i)
```

La implementación normativa debe usar una forma estable que produzca esa
identidad exacta dentro de tolerancia. Se aplica a:

- episodios activos;
- restricciones por task;
- secuelas activas cuando corresponda.

```text
healthBurden =
  composeBurden(
    episodeHealthBurden[]
    union sequelaHealthBurden[]
  )
```

No se suman shares.

## 7. Fatigue

### 7.1 Estado latente

Se reconstruye el latente desde el checkpoint:

```text
fatigueSafe =
  epsilonHealthState
  + (1 - 2*epsilonHealthState) * fatigue

fatigueStar = stableLogit(fatigueSafe)
```

### 7.2 Transición

```text
fatigueStarNext =
    fatigue.meanLatent[context]
  + fatigue.persistence[context]
      * (
          fatigueStar
          - fatigue.meanLatent[context]
        )
  + fatigue.betaRealizedLoad
      * center01(realizedLoad)
  + fatigue.betaAcuteLoad
      * center01(acuteLoadNext)
  + fatigue.betaCongestion
      * center01(congestionSignal)
  + fatigue.betaHealthBurden
      * healthBurdenAtQStart
  - fatigue.betaRecoveryOpportunity
      * recoveryOpportunity
  + fatigue.sigma[context] * Z_fatigue

fatigueNext = stableSigmoid(fatigueStarNext)
```

Constraints:

```text
0 <= fatigue.persistence[context] < 1
all displayed beta values >= 0
fatigue.sigma[context] >= 0
```

`healthBurdenAtQStart` evita que una lesión nueva altere retroactivamente el
estado usado para Performance(Q). Las restricciones del episodio nuevo sí
forman parte del estado confirmado para Q+1.

## 8. Fitness

### 8.1 Estado independiente

```text
fitnessSafe =
  epsilonHealthState
  + (1 - 2*epsilonHealthState) * fitness

fitnessStar = stableLogit(fitnessSafe)
```

### 8.2 Transición

```text
fitnessStarNext =
    fitness.meanLatent[context]
  + fitness.persistence[context]
      * (
          fitnessStar
          - fitness.meanLatent[context]
        )
  + fitness.betaPreparation
      * center01(preparationSignal)
  + fitness.betaAdaptiveLoad
      * center01(realizedLoad)
  - fitness.betaInactivity
      * inactivitySignal
  - fitness.betaExcessLoad
      * positiveLoadDeviation
  - fitness.betaHealthBurden
      * healthBurdenAtQStart
  - fitness.betaRecoveryRestriction
      * recoveryRestrictionAtQStart
  + fitness.sigma[context] * Z_fitness

fitnessNext = stableSigmoid(fitnessStarNext)
```

Constraints:

```text
0 <= fitness.persistence[context] < 1
all displayed beta values >= 0
fitness.sigma[context] >= 0
```

`betaAdaptiveLoad` y `betaExcessLoad` permiten que carga razonable y sobrecarga
tengan efectos distintos. Fitness no es `1-fatigue`.

### 8.3 Consumo por Performance

Performance(Q+1) recibe:

```text
fitnessForPerformance = fitnessNext
fatigueForPerformance = fatigueNext
physicalRestrictionByTask[k]
```

todos derivados del checkpoint confirmado de Q. No se modifica la matemática
de G3C-4.

## 9. Historia de lesión

### 9.1 Masa histórica

Para cada target family `j`:

```text
rawHistoryMass[j,t] =
  sum over prior episodes i (
    severity[i]
    * history.relationWeight[family[i], j]
    * safeExp(
        -history.decayRate[j]
        * elapsedQuarters(i,t)
      )
  )

historyBurden[j,t] =
  -stableExpm1(-rawHistoryMass[j,t])
```

Constraints:

```text
history.relationWeight >= 0
history.decayRate > 0
0 <= historyBurden < 1 for finite rawHistoryMass
```

### 9.2 Resumen eficiente y auditoría

Puede persistirse un acumulador por target family:

```text
rawHistoryMassNext[j] =
    safeExp(-history.decayRate[j] * deltaQ)
      * rawHistoryMass[j]
  + sum over onset episodes i not previously incorporated (
      severity[i]
      * history.relationWeight[family[i],j]
    )
```

El log inmutable de episodios/facts sigue siendo la evidencia normativa. El
acumulador es una optimización reproducible y verificable contra ese log.

La asignación de un parent de recaída usa un índice por episodio, no solo el
aggregate.

## 10. Hazard de lesión deportiva nueva

### 10.1 Señales

```text
fitnessDeficit = 1 - fitnessNext

ageSusceptibility[j] =
  softplus(
    (
      exactAge - hazard.ageCenter[j]
    )
    / hazard.ageScale[j]
    - hazard.longevityAgeProtection[j]
        * center01(longevity)
  )
```

Constraints:

```text
hazard.ageScale[j] > 0
hazard.longevityAgeProtection[j] >= 0
```

No existe threshold de edad. `longevity` solo modula sensibilidad física
relacionada con edad; no otorga inmunidad ni sustituye Development.

### 10.2 Intensidad por family y origin

Para `o in {MATCH, TRAINING}`:

```text
originExposureRate[MATCH] = competitiveDoseRate
originExposureRate[TRAINING] = trainingDoseRate

logRate[j,o] =
    hazard.intercept[j,o,position,context]
  + hazard.betaRealizedLoad[j,o] * realizedLoad
  + hazard.betaLoadDeviation[j,o] * positiveLoadDeviation
  + hazard.betaFatigue[j,o] * fatigueNext
  + hazard.betaFitnessDeficit[j,o] * fitnessDeficit
  + hazard.betaFragility[j,o] * center01(injuryFragility)
  + hazard.betaAge[j,o] * ageSusceptibility[j]
  + hazard.betaHistory[j,o] * historyBurden[j]
  - hazard.betaMedicalQuality[j,o] * center01(medicalQuality)
  + hazard.betaConcurrentBurden[j,o] * healthBurdenAtQStart
  + sum_m(
      hazard.contextWeight[j,o,m]
      * hazardContextFeature[m]
    )

H[j,o] =
  if family j is logically disabled for origin o
  then 0
  else originExposureRate[o] * safeExp(logRate[j,o])

H[j] = sum_o(H[j,o])
H_total = sum_j(H[j])
```

Todos los betas mostrados con signo positivo o negativo son no negativos.
Parameter validation rechaza un predictor no finito; no lo clipea.

Para familia/origen habilitado y exposición positiva:

```text
H[j,o] > 0
```

Calidad médica alta nunca reduce por sí sola el hazard a cero.

### 10.3 Probabilidad y conteo

La probabilidad de al menos una lesión deportiva nueva es:

```text
P(N_new >= 1) =
  hazardToProbability(H_total)
  = 1 - exp(-H_total)
```

El conteo usa:

```text
N_new ~ Poisson(H_total)
```

con `PoissonInverseCdfV1` de G3C-4.

Si:

```text
H_total = 0
```

entonces `N_new=0` por necesidad lógica y no se consume draw de count.

No existe máximo. Una Q puede producir cero, una o múltiples lesiones.

### 10.4 Asignación de family y origin

Para cada occurrence ordinal `r in [0, N_new)`:

```text
P(family=j | occurrence) = H[j] / H_total

P(origin=o | family=j, occurrence) =
  H[j,o] / H[j]
```

Ambas selecciones usan `CategoricalCumulativeMidpointV1` y orden canónico:

1. `InjuryFamilyId` por UTF-8 byte order;
2. `MATCH`;
3. `TRAINING`.

Una misma family puede ser elegida más de una vez. Cada occurrence crea un
`episodeId` distinto.

### 10.5 Semántica agregada

`N_new` y sus marks forman una única oportunidad compound-Poisson de la Q. El
hazard snapshot se congela antes del draw para evitar inventar cronología
partido-a-partido. Dentro del resultado:

- cada occurrence se materializa por ordinal;
- su episodio existe antes de resolver severidad del ordinal siguiente;
- la severidad puede consumir `concurrentBurdenBeforeOccurrence`;
- el conteo ya confirmado no se vuelve a sortear.

Los nuevos episodios cambian hazards de Q futuras. No progresan ni recaen en la
misma Q.

## 11. Orígenes no deportivos

### 11.1 `NON_FOOTBALL`

Un producer autorizado puede entregar:

```text
NonFootballHealthOpportunity {
  causalRef
  exposureMeasure
  allowedFamilies
  contextFeatures
}
```

Solo entonces se evalúa un hazard separado con model ID y parámetros propios.
No se deduce de cero minutos ni del hazard `MATCH/TRAINING`.

### 11.2 `EXTERNAL_EVENT`

```text
ExternalHealthCause
-> HealthConsequenceResolver
```

La ocurrencia ya está confirmada por Events. Health no vuelve a sortear si
ocurrió. Puede reutilizar:

- family validation;
- severity;
- recovery requirement;
- recovery progression;
- sequela machinery;

si la causa especifica que esas familias son aplicables. La presentación
sensible no cambia ningún resultado conforme a ADR-012.

## 12. Severidad

### 12.1 Modelo

Por occurrence:

```text
severityMeanStar =
    severity.intercept[family,origin]
  + severity.betaLoad[family] * realizedLoad
  + severity.betaLoadDeviation[family] * positiveLoadDeviation
  + severity.betaFragility[family]
      * center01(injuryFragility)
  + severity.betaHistory[family]
      * historyBurden[family]
  + severity.betaConcurrentBurden[family]
      * concurrentBurdenBeforeOccurrence
  + sum_m(
      severity.contextWeight[family,m]
      * severityContextFeature[m]
    )

severityStar =
  severityMeanStar
  + severity.sigma[family] * Z_severity

severity = stableSigmoid(severityStar)
severityStored = quantizeOpenUnit(severity)
```

`severity.sigma >= 0`. Para predictor finito:

```text
0 < severity < 1
```

Family, origin y severity permanecen dimensiones distintas. Una family no fija
duración.

## 13. Recovery requirement

### 13.1 Distribución LogNormal

```text
logRecoveryLocation[e] =
    recovery.requirementIntercept[family[e]]
  + recovery.betaSeverity[family[e]]
      * severity[e]
  - recovery.betaRecoveryCapacity[family[e]]
      * center01(recoveryCapacity)
  - recovery.betaMedicalQuality[family[e]]
      * center01(medicalQuality)
  + recovery.betaAge[family[e]]
      * ageSusceptibility[family[e]]
  + recovery.betaHistory[family[e]]
      * historyBurden[family[e]]
  + recovery.betaConcurrentBurden[family[e]]
      * concurrentBurdenBeforeOccurrence
  + sum_m(
      recovery.contextWeight[family[e],m]
      * recoveryContextFeature[m]
    )

logRecoveryRequirement[e] =
  logRecoveryLocation[e]
  + recovery.requirementSigma[family[e]] * Z_requirement

recoveryRequirement[e] =
  safeExp(logRecoveryRequirement[e])
```

Por definición:

```text
log(R) ~ Normal(logRecoveryLocation, sigma^2)
R > 0
```

La unidad es trabajo de recuperación agregado. No son días.

### 13.2 Distribución esperada

Sin consumir RNG:

```text
median(R) = exp(logRecoveryLocation)

mean(R) =
  exp(
    logRecoveryLocation
    + 0.5 * requirementSigma^2
  )

quantile_p(R) =
  exp(
    logRecoveryLocation
    + requirementSigma * StandardNormalQuantileV1(p)
  )
```

La UI/PlayerKnowledge puede proyectar quantiles aprobados. El valor realizado
permanece oculto por defecto.

### 13.3 Persistencia

En onset:

```text
initialRecoveryRequirementStored =
  quantizePositiveBurden(recoveryRequirement)

remainingRecoveryBurdenStored =
  initialRecoveryRequirementStored
```

No existe `injuredUntil`.

## 14. Progreso de recuperación

### 14.1 Episodios elegibles

Solo progresan episodios presentes al inicio de Health(Q). Un episodio creado
en la misma Q empieza con `progressionCount=0`.

### 14.2 Trabajo realizado

Si:

```text
recoveryOpportunity = 0
```

entonces `realizedRecoveryWork=0` y no se consume draw.

Si es positiva:

```text
recoveryWorkStar[e] =
    recovery.workIntercept[family[e]]
  + recovery.betaWorkRecoveryCapacity[family[e]]
      * center01(recoveryCapacity)
  + recovery.betaWorkMedicalQuality[family[e]]
      * center01(medicalQuality)
  + recovery.betaWorkOpportunity[family[e]]
      * center01(recoveryOpportunity)
  - recovery.betaWorkExcessLoad[family[e]]
      * positiveLoadDeviation
  - recovery.betaWorkFatigue[family[e]]
      * fatigueNext
  - recovery.betaWorkConcurrentBurden[family[e]]
      * concurrentHealthBurden
  + sum_m(
      recovery.workContextWeight[family[e],m]
      * recoveryWorkContextFeature[m]
    )
  + recovery.workSigma[family[e]] * Z_recoveryWork

realizedRecoveryWork[e] =
  recoveryOpportunity * softplus(recoveryWorkStar[e])
```

```text
workStored =
  if realizedRecoveryWork = 0
  then 0
  else maxLogical(
    1,
    ROUND_HALF_EVEN(
      recoveryBurdenUnitScale * realizedRecoveryWork
    )
  )

remainingNextStored =
  maxLogical(
    0,
    remainingStored - workStored
  )
```

El mínimo representable de un trabajo positivo evita que una recuperación
matemáticamente positiva se convierta accidentalmente en cero. No fija una
duración máxima ni mínima en Q.

### 14.3 Completion

```text
completion[e] =
  1
  - remainingRecoveryBurdenStored[e]
    / initialRecoveryRequirementStored[e]
```

Por construcción:

```text
0 <= completion <= 1
```

## 15. Readiness y restricciones

### 15.1 Disponibilidad continua por episodio

```text
residualFraction[e] = 1 - completion[e]

availabilityRestrictionIntensity[e] =
  residualFraction[e]
  * softplus(
      availability.intercept[family[e]]
      + availability.betaSeverity[family[e]]
          * center01(severity[e])
      + availability.betaHistory[family[e]]
          * historyBurden[family[e]]
      + availability.betaRelapseCount[family[e]]
          * stableLog1p(relapseCount[e])
      + sum_m(
          availability.contextWeight[family[e],m]
          * availabilityContextFeature[e,m]
        )
    )

episodeAvailability[e] =
  safeExp(-availabilityRestrictionIntensity[e])
```

Si `remaining=0`, la intensity es cero y `episodeAvailability=1`.

### 15.2 Restricción física por task

```text
taskRestrictionIntensity[e,k] =
  residualFraction[e]
  * softplus(
      restriction.intercept[family[e],k]
      + restriction.betaSeverity[family[e],k]
          * center01(severity[e])
      + restriction.betaHistory[family[e],k]
          * historyBurden[family[e]]
    )

episodeTaskRestriction[e,k] =
  -stableExpm1(-taskRestrictionIntensity[e,k])

physicalRestrictionByTask[k] =
  composeBurden(
    episodeTaskRestriction[:,k]
    union sequelaTaskRestriction[:,k]
  )
```

Performance consume el resultado `[0,1]`.

### 15.3 Estados derivados de recuperación

Los labels no controlan la matemática:

```text
INJURED
  if progressionCount = 0 and remaining > 0

REHABILITATION
  if progressionCount > 0
  and remaining > 0
  and no positive medical opportunity remains

LIMITED_RETURN
  if remaining > 0
  and positive medical opportunity remains

FULLY_AVAILABLE
  if remaining = 0
  and episode restrictions = 0
```

“Positive medical opportunity” se resuelve sobre la asignación ordinal de
§16, no mediante un threshold de severity.

## 16. `MedicalAvailabilityEnvelope`

### 16.1 Intervalos ordinales

Para cada competition segment con oportunidad `T_c`:

```text
T_c = integer >= 0

unavailableUnits[e,c] =
  minLogical(
    T_c,
    ROUND_HALF_EVEN(
      T_c * (1 - episodeAvailability[e])
    )
  )

episodeMedicalInterval[e,c] =
  if unavailableUnits[e,c] = 0
  then empty
  else [0, unavailableUnits[e,c])
```

El prefijo es una convención ordinal canónica: una condición conocida al
inicio de Q restringe primero la oportunidad agregada y puede permitir retorno
limitado posterior. No representa fechas ni partidos.

Si una causa médica autorizada ya posee timing ordinal explícito, Health usa
sus intervalos validados y no los desplaza por inferencia.

### 16.2 Condiciones múltiples

Por competition:

```text
medicalUnavailableIntervals[c] =
  exactUnion(
    episodeMedicalIntervals[:,c]
    union explicitMedicalIntervals[:,c]
  )

medicalUnavailableMinutes[c] =
  cardinality(medicalUnavailableIntervals[c])

medicalAvailableMinutes[c] =
  T_c - medicalUnavailableMinutes[c]
```

Aggregate:

```text
T = sum_c(T_c)
medicalAvailableMinutes = sum_c(medicalAvailableMinutes[c])

medicalAvailabilityShare =
  if T = 0
  then 0
  else medicalAvailableMinutes / T
```

No se suman, multiplican ni minimizan shares. ADR-072 compone después estos
intervalos con disciplina y otras fuentes.

### 16.3 Momento causal

`MedicalAvailabilityEnvelope(Q)` se calcula con el checkpoint de Q. Las
lesiones, recaídas y secuelas confirmadas al final de Q se reflejan recién en
el envelope de Q+1.

### 16.4 Incertidumbre

La asignación mecánica verdadera es exacta. Estimaciones e incertidumbre
pertenecen a `PlayerKnowledge`/presentación y nunca sustituyen esos intervalos.

## 17. Recaída

### 17.1 Riesgo residual por episodio

Para episodio previo `e`:

```text
elapsedSinceResolution[e] >= 0

decayedEpisodeMemory[e] =
  severity[e]
  * safeExp(
      -relapse.memoryDecayRate[family[e]]
      * elapsedSinceResolution[e]
    )

residualRiskIntensity[e] =
    relapse.remainingWeight[family[e]]
      * residualFraction[e]
  + relapse.memoryWeight[family[e]]
      * decayedEpisodeMemory[e]
  + relapse.sequelaWeight[family[e]]
      * relatedSequelaBurden[e]

residualRisk[e] =
  -stableExpm1(-residualRiskIntensity[e])
```

No existe ventana fija de recaída. El peso decrece suavemente.

### 17.2 Hazard relacionado

Para cada episodio candidato `e`, child family `j` y origin `o`:

```text
logRelapseRate[e,j,o] =
    relapse.intercept[family[e],j,o]
  + relapse.betaResidual[family[e],j,o]
      * residualRisk[e]
  + relapse.betaLoad[family[e],j,o]
      * realizedLoad
  + relapse.betaLoadDeviation[family[e],j,o]
      * positiveLoadDeviation
  + relapse.betaFatigue[family[e],j,o]
      * fatigueNext
  + relapse.betaFragility[family[e],j,o]
      * center01(injuryFragility)
  + relapse.betaHistory[family[e],j,o]
      * historyBurden[j]
  - relapse.betaMedicalQuality[family[e],j,o]
      * center01(medicalQuality)
  + sum_m(
      relapse.contextWeight[family[e],j,o,m]
      * relapseContextFeature[m]
    )

H_relapse[e,j,o] =
  if relation family[e] -> j is logically disabled
  then 0
  else
    originExposureRate[o]
    * residualRisk[e]
    * safeExp(logRelapseRate[e,j,o])

H_relapse_total =
  sum_e(sum_j(sum_o(H_relapse[e,j,o])))
```

### 17.3 Conteo y parent assignment

```text
N_relapse ~ Poisson(H_relapse_total)
```

con `PoissonInverseCdfV1`. Si el hazard total es cero, el outcome es cero sin
draw.

Por occurrence:

```text
P(parent=e, childFamily=j, origin=o) =
  H_relapse[e,j,o] / H_relapse_total
```

Se usa un solo categorical canónico sobre cells ordenadas por:

1. `episodeId` UTF-8;
2. child `InjuryFamilyId` UTF-8;
3. origin.

Cada recaída crea un episodio child nuevo con `parentEpisodeId=e`. Una misma
occurrence nunca es a la vez lesión nueva y recaída. El parent puede recibir
más de una occurrence si el proceso la produce; no hay cap.

### 17.4 Elegibilidad causal

Solo episodios existentes al inicio de Health(Q) son candidates. Un episodio
nuevo de Q no puede recaer en esa misma Q porque no existe exposición posterior
a su onset dentro de la resolución agregada.

Una candidate con `residualRisk > 0` no se poda por elapsed time ni por
redondeo: eso convertiría una probabilidad positiva en cero. Un índice auxiliar
puede comprimir únicamente con una transformación algebraicamente exacta que
preserve weights y parent selection. El episodio y sus facts nunca se borran.

## 18. Secuela

### 18.1 Momento de evaluación

La secuela se evalúa una sola vez cuando un episodio:

1. llega a `remainingRecoveryBurden=0`;
2. no fue reactivado por una recaída de la misma transición;
3. todavía no posee outcome de secuela registrado.

La clave idempotente incluye `episodeId` y transition ordinal.

### 18.2 Calidad de recuperación

Al completar:

```text
recoveryQualityStar[e] =
    sequela.recoveryQualityIntercept[family[e]]
  + sequela.betaQualityRecoveryCapacity[family[e]]
      * center01(recoveryCapacity)
  + sequela.betaQualityMedicalQuality[family[e]]
      * center01(medicalQuality)
  + sequela.betaQualityOpportunity[family[e]]
      * center01(meanRecoveryOpportunity[e])
  - sequela.betaQualityExcessLoad[family[e]]
      * meanPositiveLoadDeviationDuringRecovery[e]
  - sequela.betaQualityRelapses[family[e]]
      * stableLog1p(relapseCount[e])

recoveryQuality[e] =
  stableSigmoid(recoveryQualityStar[e])
```

Es una summary derivada de la trayectoria; no reemplaza el requirement
realizado.

Con `K[e] = progressionCount[e] > 0` al completar:

```text
meanRecoveryOpportunity[e] =
  sum over progression checkpoints q (
    recoveryOpportunity[e,q]
  ) / K[e]

meanPositiveLoadDeviationDuringRecovery[e] =
  sum over progression checkpoints q (
    positiveLoadDeviation[e,q]
  ) / K[e]
```

Un episodio estándar no puede completarse con `K=0`: el requirement inicial
es positivo y solo recovery work puede reducirlo. Una causa externa que no
requiera recuperación no crea un `InjuryEpisode` artificial.

### 18.3 Probabilidad de existencia

```text
logitPSequela[e] =
    sequela.occurrenceIntercept[family[e]]
  + sequela.betaSeverity[family[e]] * severity[e]
  + sequela.betaAge[family[e]]
      * ageSusceptibility[family[e]]
  + sequela.betaHistory[family[e]]
      * historyBurden[family[e]]
  - sequela.betaRecoveryQuality[family[e]]
      * recoveryQuality[e]
  - sequela.betaMedicalQuality[family[e]]
      * center01(medicalQuality)
  - sequela.betaRecoveryCapacity[family[e]]
      * center01(recoveryCapacity)

pSequela[e] = stableSigmoid(logitPSequela[e])
```

Se samplea con `BinomialInverseCdfV1(n=1,p)`.

Para predictor finito:

```text
0 < pSequela < 1
```

Una lesión grave no garantiza secuela.

### 18.4 Tipo

Si no ocurre, el outcome interno es `NONE` y no se consume draw de tipo.

Si ocurre:

```text
logitPPersistent[e] =
    sequela.typeIntercept[family[e]]
  + sequela.betaTypeSeverity[family[e]] * severity[e]
  + sequela.betaTypeHistory[family[e]]
      * historyBurden[family[e]]
  - sequela.betaTypeRecoveryQuality[family[e]]
      * recoveryQuality[e]
  + sum_m(
      sequela.typeContextWeight[family[e],m]
      * sequelaContextFeature[m]
    )

pPersistent[e] = stableSigmoid(logitPPersistent[e])

type =
  PERSISTENT if Bernoulli(pPersistent)=1
  else TEMPORARY
```

El Bernoulli reutiliza `BinomialInverseCdfV1(n=1,p)`.

### 18.5 Magnitud

```text
sequelaBurdenStar[e] =
    sequela.burdenIntercept[family[e],type]
  + sequela.betaBurdenSeverity[family[e],type]
      * severity[e]
  + sequela.betaBurdenHistory[family[e],type]
      * historyBurden[family[e]]
  - sequela.betaBurdenRecoveryQuality[family[e],type]
      * recoveryQuality[e]
  + sequela.burdenSigma[family[e],type]
      * Z_sequelaBurden

sequelaBurden[e] = stableSigmoid(sequelaBurdenStar[e])
```

Se persiste con `quantizeOpenUnit`.

### 18.6 Alcance sobre capability families

Cada `InjuryFamilyDefinition` versionada declara:

```text
sequelaCapabilityAffinity[
  injuryFamily,
  capabilityFamily
] in [0,1]
```

Para capability `i`:

```text
sequelaBurdenForCapability[i] =
  composeBurden(
    for each active sequela s:
      sequelaBurden[s]
      * sequelaCapabilityAffinity[
          family[s],
          capabilityFamily[i]
        ]
  )
```

Development consume esa señal. Health no aplica ningún `deltaZ`.

### 18.7 Secuela temporal

```text
temporaryBurdenNext =
  temporaryBurden
  * safeExp(
      -sequela.temporaryDecayRate[family]
      * recoveryOpportunity
    )
```

Se cuantiza una vez con `quantizeUnit`. Cuando el entero resultante es cero, la
consecuencia mecánica deja de estar activa. No existe duración fija ni
cooldown; el fact histórico permanece.

### 18.8 Secuela persistente

Una secuela persistente conserva:

- `sequelaId`;
- episodio causal;
- family;
- burden;
- affinity por capability family;
- restricciones físicas;
- version context.

No decae automáticamente. Solo una transición de Health explícitamente
autorizada puede cambiarla. Development decide sus consecuencias permanentes.

## 19. Salidas hacia otros módulos

### 19.1 Role & Minutes

```text
MedicalAvailabilityEnvelope {
  allocationByCompetition
  availabilityShare
  physicalRestrictions
  reasonEpisodeIds
  sourceHealthCheckpoint
}
```

La asignación usa exactamente §16. Role & Minutes no necesita conocer traits
ocultos.

### 19.2 Performance

```text
fitness in [0,1]
fatigue in [0,1]
physicalRestrictionByTask[k] in [0,1]
```

Todos son del checkpoint anterior a Performance.

Performance devuelve:

```text
actualMinutesByCompetition
physicalIntensitySignalByCompetition in [0,1]
```

No devuelve un diagnóstico.

### 19.3 Development

```text
developmentLoadSignal in [0,1]
inactivitySignal in [0,1]
healthBurden in [0,1]
sequelaBurdenForCapability[i] in [0,1]
recoveryContextSummary
```

La ecuación G3C-2 consume estas señales; no se reabre su ownership.

### 19.4 Retirement

Health expone después:

```text
activeHealthBurden
historyBurdenByFamily
persistentSequelaBurden
recoveryStatusSummary
```

No resuelve hazard de retiro ni impone retiro.

### 19.5 Club/World

Inputs upstream todavía pendientes de G3C-6:

```text
medicalQuality
trainingExposure
trainingIntensitySignal
preparationSignal
recoveryOpportunity
congestionSignal
scheduleDifficulty
context feature catalogs
```

Sus dominios ya están fijados aquí; sus producer equations no.

## 20. Facts, signals y auditabilidad

La clasificación DR-063 se conserva:

| Concepto | Clasificación |
|---|---|
| `InjuryOccurred` | `PERSISTED_DOMAIN_FACT` |
| `RelapseOccurred` | `PERSISTED_DOMAIN_FACT` |
| `SequelaRecorded` | `PERSISTED_DOMAIN_FACT` |
| `HealthConditionTransitioned` | fact de transición autorizado según `transitionKind` |
| `PlayerDynamicStateChanged` | cambio de fitness/fatigue según `stateKind` |
| `MedicalAvailabilityCalculated` | `DERIVED_SUMMARY` |
| `LoadRecorded` | `INTERNAL_SIGNAL` auditable |
| hazard predictors/draws | trace/checkpoint, no fact por defecto |

### 20.1 IDs deterministas

Conceptualmente:

```text
episodeId =
  SHA256(canonical(
    careerId,
    playerId,
    seasonId,
    quarter,
    modelId,
    occurrenceOrdinal,
    eventKind,
    parentEpisodeId?
  ))
```

No se usa reloj, UUID ni orden de array incidental.

### 20.2 Traza mínima

Debe reconstruir:

```text
opportunity
-> medical availability
-> actual minutes
-> physical intensity
-> dose rates
-> load states
-> fitness/fatigue candidates
-> hazards
-> count/marks
-> severity
-> recovery requirement/progress
-> relapse
-> sequela
-> next checkpoint
```

## 21. Random streams

Todos usan namespace `health` y claves ADR-070. Model IDs mínimos:

| `modelId` | Purpose | Context mínimo | Draw contract |
|---|---|---|---|
| `health-state-initial-fatigue-v1` | fatigue inicial | career/player/start | Normal |
| `health-state-initial-fitness-v1` | fitness inicial | career/player/start | Normal |
| `health-state-initial-acute-load-v1` | acute inicial | career/player/start | Normal |
| `health-state-initial-chronic-load-v1` | chronic inicial | career/player/start | Normal |
| `health-fatigue-transition-v1` | shock fatigue | career/player/season/Q | Normal |
| `health-fitness-transition-v1` | shock fitness | career/player/season/Q | Normal |
| `health-new-injury-count-v1` | count | career/player/season/Q | Poisson |
| `health-new-injury-family-v1` | family mark | same + occurrence | categorical |
| `health-new-injury-origin-v1` | origin mark | same + occurrence | categorical |
| `health-injury-severity-v1` | severity | same + episode | Normal |
| `health-recovery-requirement-v1` | realized requirement | episode | Normal |
| `health-recovery-progress-v1` | recovery work | episode/season/Q | Normal |
| `health-relapse-count-v1` | relapse count | career/player/season/Q | Poisson |
| `health-relapse-cell-v1` | parent/family/origin | same + occurrence | categorical |
| `health-relapse-severity-v1` | relapse severity | same + child episode | Normal |
| `health-sequela-occurrence-v1` | occurrence | episode/resolution ordinal | Bernoulli |
| `health-sequela-type-v1` | type | episode/resolution ordinal | Bernoulli |
| `health-sequela-burden-v1` | burden | episode/resolution ordinal | Normal |

Reglas:

- load, burden composition y medical interval allocation son deterministas y
  no consumen RNG;
- un resultado lógico no consume draw;
- count, mark, severity y requirement nunca comparten purpose;
- añadir un draw a recovery no cambia injury count;
- el orden de una colección no forma parte de la key;
- el occurrence ordinal pertenece a su purpose local.

## 22. Samplers normativos

Se reutilizan:

| Distribución | Sampler |
|---|---|
| Normal | `StandardNormalInverseCdfV1` |
| LogNormal | `exp(mu + sigma * StandardNormalInverseCdfV1(u))` |
| Poisson | `PoissonInverseCdfV1` |
| Bernoulli | `BinomialInverseCdfV1(n=1,p)` |
| Categorical | `CategoricalCumulativeMidpointV1` |

La LogNormal consume exactamente un Standard Normal midpoint draw. No existe
un segundo sampler Normal o Poisson en Health.

Los algorithms inverse-CDF y su orden de draws son los fijados por G3C-4/
ADR-073. Rejection sampling no está autorizado por esta especificación.

## 23. `EngineParameterSet.health`

No puede existir constante causal fuera de este árbol.

### 23.1 Math profile y load

| Path | Dominio/constraint | Clase |
|---|---|---|
| `health.math.epsilonHealthState` | `(0,0.5)` | `STRUCTURAL_FIXED` |
| `health.math.recoveryBurdenUnitScale` | integer `>0` | `STRUCTURAL_FIXED` |
| `health.load.competitiveIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.betaIntensity` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.betaCongestion` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.betaScheduleDifficulty` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.competitiveContextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.trainingIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.betaTrainingIntensity` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.betaTrainingCongestion` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.trainingContextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.rhoAcute` | `[0,1)` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.rhoChronic` | `(rhoAcute,1)` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.loadDeviationEpsilon` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.initial*MeanLatent` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.initial*Sigma` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.toDevelopment*Weight` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.load.inactivity*Weight` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |

### 23.2 Fatigue y fitness

| Path | Dominio/constraint | Clase |
|---|---|---|
| `health.fatigue.meanLatent.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fatigue.persistence.*` | `[0,1)` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fatigue.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fatigue.sigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fatigue.initialMeanLatent.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fatigue.initialSigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fitness.meanLatent.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fitness.persistence.*` | `[0,1)` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fitness.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fitness.sigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fitness.initialMeanLatent.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.fitness.initialSigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |

### 23.3 Burden, hazard y severity

| Path | Dominio/constraint | Clase |
|---|---|---|
| `health.burden.*` | typed finite; betas `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.hazard.intercept.*` | finite por family/origin/context | `INITIAL_CALIBRATION_REQUIRED` |
| `health.hazard.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.hazard.contextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.hazard.ageCenter.*` | finite age unit | `INITIAL_CALIBRATION_REQUIRED` |
| `health.hazard.ageScale.*` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.hazard.longevityAgeProtection.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.severity.intercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.severity.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.severity.contextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.severity.sigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |

### 23.4 Recovery y availability

| Path | Dominio/constraint | Clase |
|---|---|---|
| `health.recovery.requirementIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.recovery.requirementSigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.recovery.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.recovery.contextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.recovery.workIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.recovery.workSigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.recovery.workContextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.availability.intercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.availability.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.availability.contextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.restriction.intercept.*` | finite por family/task | `INITIAL_CALIBRATION_REQUIRED` |
| `health.restriction.beta*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.availability.intervalAllocation` | `RECOVERY_PREFIX_V1` | `STRUCTURAL_FIXED` |

### 23.5 History, relapse y sequela

| Path | Dominio/constraint | Clase |
|---|---|---|
| `health.history.relationWeight.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.history.decayRate.*` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.memoryDecayRate.*` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.remainingWeight.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.memoryWeight.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.sequelaWeight.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.intercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.relapse.contextWeight.*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.recoveryQuality*` | typed finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.occurrenceIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.typeIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.burdenIntercept.*` | finite | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.beta*` | `>=0` según signo | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.burdenSigma.*` | `>=0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequela.temporaryDecayRate.*` | `>0` | `INITIAL_CALIBRATION_REQUIRED` |
| `health.sequelaCapabilityAffinity.*` | `[0,1]` | `INITIAL_CALIBRATION_REQUIRED` |

### 23.6 Catálogos, streams y calibración

| Path | Dominio/constraint | Clase |
|---|---|---|
| `health.familyCatalogRef` | immutable content/data ref | `INITIAL_CALIBRATION_REQUIRED` |
| `health.contextFeatureCatalog` | allowlist tipada | `STRUCTURAL_FIXED` |
| `health.traitTransform` | `CENTER01_V1` | `STRUCTURAL_FIXED` |
| `health.nonFootball.opportunityModel.*` | typed finite; habilitación explícita | `INITIAL_CALIBRATION_REQUIRED` |
| `health.externalCause.adapterCatalogRef` | immutable typed ref | `INITIAL_CALIBRATION_REQUIRED` |
| `health.samplerIds.*` | IDs de §22 | `STRUCTURAL_FIXED` |
| `health.modelIds.*` | IDs de §21 | `STRUCTURAL_FIXED` |
| `health.quantization.state` | `ROUND_HALF_EVEN` | `STRUCTURAL_FIXED` |
| `health.calibrationTargetSetRef` | immutable ref | `INITIAL_CALIBRATION_REQUIRED` |
| `health.goldenFixtureSetRef` | immutable ref | `INITIAL_CALIBRATION_REQUIRED` |
| `health.diagnosticThresholds.*` | solo QA, no gameplay | `TUNABLE_LATER` |

No hay defaults causales implícitos.

## 24. Catálogo de InjuryFamily del slice

G3C-5 fija el contrato de cada definición, no inventa las seis lesiones:

```text
InjuryFamilyDefinition {
  familyId
  enabled
  compatibleOrigins
  compatiblePositions
  hazardParameterRef
  severityParameterRef
  recoveryParameterRef
  relapseRelations
  sequelaParameterRef
  availabilityParameterRef
  taskRestrictionParameterRef
  sequelaCapabilityAffinity
  narrativeContentRef
}
```

Reglas:

- `familyId` es mecánico y no texto narrativo;
- severity y duration no son campos fijos de family;
- `enabled=false` representa contenido mecánicamente deshabilitado y produce
  hazard exactamente cero;
- la definición debe contener todos los parameters requeridos por §23;
- una familia habilitada no puede depender de un default oculto.

Las seis definiciones concretas siguen siendo una decisión data/content de
G3B-E04/DR-057. No se crean nombres clínicos por inferencia.

## 25. Invariantes

### 25.1 Estado y causalidad

1. Fitness, fatigue, acute load y chronic load pertenecen a `[0,1]`.
2. Fitness no es `1-fatigue`.
3. Loads nunca son negativos.
4. No se persisten NaN, infinidades ni `-0`.
5. Health(Q) no cambia minutos ni Performance(Q).
6. Health no modifica capabilities.
7. Una lesión nueva de Q solo afecta Q+1.
8. Conditions concurrentes lógicamente compatibles están permitidas.
9. No existe cap, cuota ni cooldown.

### 25.2 Hazard y outcomes

1. `H[j,o] >= 0` y `H_total >= 0`.
2. Counts son enteros no negativos.
3. `H_total=0` implica count cero sin draw.
4. Family/origin probabilities suman uno dentro de tolerancia.
5. Severity está en `(0,1)` antes de persistir.
6. Recovery requirement es estrictamente positivo.
7. Remaining burden es entero no negativo.
8. Relapse siempre referencia un episodio anterior.
9. Una occurrence no es simultáneamente nueva y relapse.
10. Sequela no modifica capabilities directamente.

### 25.3 Disponibilidad

1. Interval endpoints son enteros y pertenecen a `[0,T_c]`.
2. Intervalos persistidos son sorted, disjoint y semiabiertos.
3. Medical availability pertenece a `[0,1]`.
4. Multiple conditions se combinan por exact union, no suma de shares.
5. Health no compone disciplina.

### 25.4 Determinismo

Mismos:

```text
rootSeed
versions
parameterSetHash
inputs
cursor
decision history
```

producen los mismos draws, estados, facts, canonical bytes y hashes.

### 25.5 Monotonicidad de expectativa

Manteniendo todo lo demás fijo y un ParameterSet válido:

- mayor `injuryFragility` no reduce expected injury hazard;
- mayor load/dose no reduce el componente de hazard inducido por carga;
- mayor `recoveryCapacity` no reduce expected recovery work;
- mayor `recoveryCapacity` no aumenta expected recovery requirement;
- mayor `medicalQuality` no empeora expected recovery;
- mayor `medicalQuality` no aumenta hazard donde su efecto está habilitado;
- mayor severity no reduce expected recovery requirement;
- mayor residual burden no reduce relapse hazard.

No se exige monotonicidad de outcomes sampleados individuales.

## 26. Calibration targets

Los targets no tienen valores inventados. Cada target se versiona con
provenance.

### 26.1 Invariants

| ID | Métrica | Segmentación |
|---|---|---|
| `HI-I01` | dominios y finitud | global |
| `HI-I02` | lesión Qn no cambia Qn | pipeline/Q |
| `HI-I03` | exact union de intervals | competition/Q |
| `HI-I04` | parent válido de relapse | family |
| `HI-I05` | no capability write | global |
| `HI-I06` | replay exacto | seed/ParameterSet |
| `HI-I07` | no RNG en outcome lógico | purpose |
| `HI-I08` | no caps/cooldowns | global |

### 26.2 Targets de Fatigue/Fitness

| ID | Target | Segmentación | Evidencia |
|---|---|---|---|
| `HI-C01` | distribución de fatigue | position, age, context | externa + diseño |
| `HI-C02` | distribución de fitness | position, age, context | externa + diseño |
| `HI-C03` | autocorrelación Q→Q | state/context | externa |
| `HI-C04` | recuperación tras baja carga | load band | externa |
| `HI-C05` | respuesta a congestión | context | externa |
| `HI-C06` | tails P95/P99 | state/context | externa |

### 26.3 Targets de lesión

| ID | Target | Segmentación | Evidencia |
|---|---|---|---|
| `HI-C07` | lesiones por temporada/carrera | position, age, context | externa |
| `HI-C08` | frecuencia de cero lesiones | position, age | externa |
| `HI-C09` | ventanas/carreras múltiples | family/context | externa |
| `HI-C10` | mix de family | family/origin | externa |
| `HI-C11` | severity quantiles | family/origin | externa |
| `HI-C12` | sensibilidad a edad | family/age | externa |
| `HI-C13` | sensibilidad a load | family/load band | externa |
| `HI-C14` | MATCH/TRAINING mix | position/context | externa |

### 26.4 Targets de recuperación

| ID | Target | Segmentación | Evidencia |
|---|---|---|---|
| `HI-C15` | requirement/duration quantiles | family/severity | externa |
| `HI-C16` | variance by severity | family | externa |
| `HI-C17` | efecto RecoveryCapacity | trait band | diseño + MC |
| `HI-C18` | efecto MedicalQuality | context band | externa + MC |
| `HI-C19` | partial-return frequency | family/severity | externa |
| `HI-C20` | availability lost | family/context | externa |

### 26.5 Targets de relapse/sequela

| ID | Target | Segmentación | Evidencia |
|---|---|---|---|
| `HI-C21` | relapse frequency | family/severity | externa |
| `HI-C22` | decay with elapsed Q | family | externa |
| `HI-C23` | relapse vs incomplete recovery/load | family/load | externa |
| `HI-C24` | sequela frequency | family/severity | externa |
| `HI-C25` | temporary/persistent mix | family | externa |
| `HI-C26` | burden distribution | type/family | externa + diseño |

### 26.6 Diagnostics cross-system

| ID | Diagnostic | No se convierte automáticamente en regla |
|---|---|---|
| `HI-D01` | minutes/dose → fatigue | sí |
| `HI-D02` | load/fatigue → injury | sí |
| `HI-D03` | injury → next-Q availability | sí |
| `HI-D04` | health burden → Development delta | sí |
| `HI-D05` | health burden → retirement posterior | sí |
| `HI-D06` | medicalQuality → availability lost | sí |
| `HI-D07` | correlation fitness/fatigue | sí |
| `HI-D08` | family concentration | sí |

Segmentos prioritarios:

```text
Position: GK | CM | ST
Context: Argentina | España
Age: versioned health calibration bands
Exposure: zero | low | typical | high | extreme
Family: six approved slice families when available
```

Las age bands no entran en ecuaciones como thresholds.

## 27. Tail diagnostics

Las suites deben reportar, cuando el tamaño de muestra lo permita:

- P90, P95, P99 y P99.9 de injuries/career;
- temporadas con muchas lesiones;
- múltiples lesiones de la misma family/Q;
- recaídas repetidas;
- requirements de recuperación extremos;
- carreras casi sin lesiones;
- fatigue muy alta sin lesión;
- lesión severa con recuperación rápida;
- lesión menor con recuperación larga;
- múltiples condiciones concurrentes;
- secuelas persistentes múltiples.

Una cola indeseada se corrige calibrando hazards, dispersiones y covariables.
Nunca mediante count caps, cooldowns o truncamiento de recovery.

## 28. Golden vectors requeridos

Los manifests deben incluir `engineVersion`, `parameterSetHash`, sampler IDs,
math profile y expected canonical bytes/hash.

### 28.1 Load

Inputs:

```text
competitiveExposureShare = 0.5
trainingExposure = 0.25
all eta coefficients = 0
```

Expected symbolic derivation:

```text
competitiveDoseRate = 0.5 * softplus(0)
trainingDoseRate = 0.25 * softplus(0)
realizedLoad =
  -expm1(
    -0.75 * softplus(0)
  )
```

El fixture fija además acute/chronic previos y rhos para obtener sus dos
checkpoints exactos.

### 28.2 Fatigue

Debe fijar:

- previous stored fatigue;
- mean/persistence;
- load, congestion, burden, recovery opportunity;
- known Normal midpoint draw;

y esperar:

- latent previo;
- cada término;
- latent final;
- valor binary64;
- `ROUND_HALF_EVEN` exacto.

### 28.3 Fitness

Misma estructura, demostrando que el resultado no es `1-fatigue`.

### 28.4 Injury hazard/count/family

Debe fijar dos families y dos origins:

```text
H[j,o]
H[j]
H_total
pAtLeastOne
```

Un draw conocido de `PoissonInverseCdfV1` produce count exacto. Draws
categorical conocidos producen family/origin exactos por occurrence.

Un fixture `H_total=0` espera count cero y ausencia de RNG.

### 28.5 Severity y recovery requirement

Debe fijar predictor, sigma y Normal draw para producir:

```text
severityStar
severity
severityStored
logRecoveryLocation
logRecoveryRequirement
requirement
requirementStored
```

### 28.6 Recovery progression

Debe fijar:

- requirement/remaining;
- RecoveryCapacity;
- MedicalQuality;
- opportunity;
- load/fatigue;
- Normal draw;

y esperar `work`, `workStored`, `remainingNext` y estado derivado.

### 28.7 Medical availability

Fixture mínimo:

```text
T = 1000
episode A unavailableUnits = 200 -> [0,200)
episode B unavailableUnits = 350 -> [0,350)

union = [0,350)
medicalAvailableMinutes = 650
medicalAvailabilityShare = 0.65
```

Un fixture multi-competition debe conservar intervals por segment.

### 28.8 Relapse

Debe fijar episodes candidates, residual risks y cell hazards, luego:

```text
H_relapse_total
N_relapse
parent/family/origin cell
childEpisodeId
```

Un episodio creado en la misma Q debe quedar fuera de candidates.

### 28.9 Sequela

Debe fijar:

- completed episode;
- recovery quality inputs;
- occurrence draw;
- type draw;
- burden draw;

y esperar exactamente:

```text
NONE
or TEMPORARY/PERSISTENT
burdenStored
capability-family signal
```

### 28.10 Replay/cadencia

Una carrera sintética con lesión en Q2 debe demostrar:

- Q2 minutes/performance intactos;
- intervalos y restrictions desde Q3;
- `advance(1)` repetido y batch equivalentes;
- mismos facts/episodes/hashes.

## 29. Monte Carlo

### 29.1 SMOKE

Recolecta:

- dominios/invariantes;
- injuries/window;
- count cero/uno/múltiple;
- progression/relapse/sequela;
- availability;
- replay de CalibrationSeedSet SMOKE.

Falla ante cualquier invariante.

### 29.2 CALIBRATION

Recolecta todos `HI-Cxx`, segmentados por:

- GK/CM/ST;
- Argentina/España;
- age/exposure bands;
- family/origin.

Compara ParameterSets sobre el mismo `CalibrationSeedSet`.

### 29.3 DEEP

Añade:

- tails P99/P99.9;
- carreras multidecenales;
- multiple conditions;
- repeated relapse;
- long recovery;
- downstream availability;
- sensitivities y correlations;
- diagnostics hacia Development/Retirement.

No se fija aquí un sample count único. El manifest del seed tier lo versiona.

## 30. Cierre de decisiones G3C-5

| ID | Estado | Familia matemática cerrada | Pendiente |
|---|---|---|---|
| G3B-E02 | `PARTIAL_CALIBRATION` | dose-rate + compound Poisson por Q; MATCH/TRAINING separados | valores, producers y targets |
| G3B-E03 | `PARTIAL_CALIBRATION` | cumulative competing hazards en log-rate | intercepts/betas/family catalog |
| G3B-E05 | `PARTIAL_CALIBRATION` | logistic-Normal severity + LogNormal requirement + positive softplus progress | parámetros médicos/targets |
| G3B-E06 | `PARTIAL_CALIBRATION` | continuous readiness + exact intervals + relapse competing Poisson hazard | valores/targets |
| G3B-E07 | `PARTIAL_CALIBRATION` | logistic occurrence/type + logistic-Normal burden + exponential temporary decay | affinities/values/targets |

No queda `PARTIAL` por falta de familia matemática o sampler.

## 31. Blockers posteriores

Antes de implementar Health deben existir:

1. valores completos y validados de `EngineParameterSet.health`;
2. seis `InjuryFamilyDefinition` del slice con provenance;
3. `medicalQuality`, training exposure, preparation, recovery opportunity y
   calendar/context producers de G3C-6;
4. expected outputs y hashes de goldens;
5. CalibrationTargets con tolerancias;
6. schemas concretos compatibles con DR-063;
7. pruebas cross-runtime de inverse-CDF, exp/log y quantization.

G3C-6 puede comenzar su especificación porque los dominios de entrada ya están
cerrados. Esto no autoriza implementación de gameplay.

### Reconciliación de producers G3C-6

[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
cierra los producers agregados de:

- `medicalQuality`;
- `trainingExposure`;
- `trainingIntensitySignal`;
- `preparationSignal`;
- `recoveryOpportunity`;
- `congestionSignal`;
- `scheduleDifficulty`;
- exposure/match-equivalent context por Q.

Todos llegan en `[0,1]` y se calculan sin sesiones o fechas diarias. Health
continúa siendo el único owner de load, fitness, fatigue, hazard, recovery,
relapse y sequela. Un progression checkpoint de competición confirmado en
`CONSEQUENCES(Qn)` solo cambia contextos de Q futura; no modifica Health,
minutos o Performance ya cerrados.

## 32. Adapter G3C-10 — Health posretiro

Con Career abierta y `PlayerPlayingStatus.RETIRED`:

```text
postRetirementExposure.competitiveDose = 0
postRetirementExposure.trainingDose    = 0
```

La segunda igualdad es policy V1: no existe entrenamiento detallado autorizado
durante retiro. Recovery progression, relapse residual, sequela decay,
history burden, fitness/fatigue y background health context continúan con las
ecuaciones existentes. Los resultados actualizados alimentan una posible Q
futura de comeback; no reescriben estado on-field cerrado.

Health expone `playableHealth`, `activeHealthBurden`,
`persistentSequelaBurden`, `recoveryStatusSummary` e `inactivitySignal` a
G3C-10. Ninguna severity infiere medical impossibility y Health nunca cambia
`PlayerPlayingStatus` o `CareerStatus`. Finalization detiene futuras operaciones
de gameplay; no fuerza una resolución médica artificial.

## 33. Referencias

- [MASTER_SPEC v0.8](MASTER_SPEC.docx)
- [Contrato matemático](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Health estructural](HEALTH_INJURY_SPEC.md)
- [Performance matemática](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
- [Role & Minutes matemática](ROLE_MINUTES_MATH_SPEC.md)
- [Creation & Development matemática](CREATION_DEVELOPMENT_MATH_SPEC.md)
- [Development estructural](DEVELOPMENT_AGING_SPEC.md)
- [Club/Competitions/World](CLUB_COMPETITION_WORLD_SPEC.md)
- [Design Board](G3B_DESIGN_BOARD.md)
- [ADR-042](adr/042-season-health-performance.md)
- [ADR-053](adr/053-development-and-aging-model.md)
- [ADR-054](adr/054-role-and-minutes-model.md)
- [ADR-057](adr/057-health-injury-recovery-model.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-072](adr/072-role-minutes-and-availability-mathematics.md)
- [ADR-073](adr/073-performance-production-form-mathematics.md)
- [ADR-074](adr/074-health-injury-recovery-mathematics.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)
- [Club/Competition/World matemática](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [Retirement/Comeback/Finalization matemática](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
- [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md)
