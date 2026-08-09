# Club, Competitions & World Mathematical Specification

**Estado:** especificación matemática normativa de G3C-6; valores de
calibración, catálogo competitivo y política de movilidad pendientes  
**Fecha:** 2026-07-29  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-002 a ADR-007, ADR-013, ADR-015,
ADR-022, ADR-042, ADR-051, ADR-054, ADR-055, ADR-057, ADR-070, ADR-072,
ADR-073, ADR-074 y ADR-075  
**Alcance:** estado matemático de club/liga/mundo, manager y táctica,
competencia por posición, calendario agregado, outcomes colectivos,
contribución del protagonista y evolución de largo plazo; no implementa
Transfers, Selection, Awards, Retirement ni Scoring

---

## 1. Propósito y límites

Este documento cierra las familias matemáticas asignadas a:

- G3B-F05: outcomes colectivos por competición;
- G3B-F06: determinación de candidatos de movilidad y boundary de aplicación;
- G3B-J02: jerarquía de shocks correlacionados;
- G3B-J03: evolución de clubes, ligas y contexto institucional;
- G3B-J04: ciclos deportivos/económicos/de talento de largo plazo.

Después de este cierre ninguna de esas cinco decisiones queda abierta por
falta de ecuación, distribución, sampler, orden o contrato de streams.
Permanecen pendientes:

- valores de `EngineParameterSet.clubWorld` y
  `EngineParameterSet.competitions`;
- targets, tolerancias y expected outputs de goldens;
- definitions, IDs, fuentes, fases y cupos concretos del vertical slice;
- fecha/label visible inicial y extrapolación futura de DR-021;
- pool, identidades, materialización y continuidad fuera del tier de DR-065;
- matemáticas downstream de Transfers, Selection, Awards, Retirement y
  Scoring.

Este documento no autoriza gameplay antes de publicar y validar el
`EngineParameterSet` completo y cerrar los datos/policies que bloquean el
vertical slice.

### 1.1 Prohibiciones

Club/Competitions/World no:

- almacena o usa un `ClubOverall` causal;
- muta `ClubDefinition`, `LeagueDefinition` o `CompetitionDefinition`;
- usa IJL como fuerza de gameplay;
- usa CareerScore, `ContributionCoefficient` o `ScoreLedger`;
- incluye al protagonista dentro de `TeamSupportField`;
- simula una plantilla o fixture completo para resolver un agregado;
- protege una identidad mediante floor, inmunidad o qualification garantizada;
- cuenta exposición futura de una fase todavía no alcanzada;
- inventa una identidad para participante, promovido o champion;
- fuerza una transferencia cuando un club cambia de tier;
- reabre una Q o outcome confirmado;
- aplica caps editoriales a contribución, resultados, eras o movilidad.

## 2. Notación y representación

### 2.1 Primitivas comunes

Se reutilizan sin variantes locales:

```text
center01(x) = 2*x - 1
stableSigmoid
stableLogit
softplus
safeExp
safeLog
stableLog1p
stableExpm1
stableSoftmax
hazardToProbability(H) = -stableExpm1(-H)
ROUND_HALF_EVEN
```

Sus dominios, orden de evaluación y edge cases pertenecen a
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md).

### 2.2 Estado acotado

Las dimensiones persistidas acotadas usan:

```text
StoredUnit = integer in [0, 10000]
unit(stored) = stored / 10000

SignedStoredUnit = integer in [-10000, 10000]
signedUnit(stored) = stored / 10000

quantizeUnit(x) =
  ROUND_HALF_EVEN(10000 * clampLogical(x, 0, 1))

quantizeSignedUnit(x) =
  ROUND_HALF_EVEN(10000 * clampLogical(x, -1, 1))
```

Aplica a:

- strengths deportivas;
- prestige, financialPower y stability;
- developmentQuality y medicalQuality;
- managerQuality y managerDevelopmentInfluence;
- dimensiones de `TacticalIdentity`;
- dimensiones de `PositionCompetition`;
- `leagueCompetitiveStrength`;
- factores continuos acotados de `WorldCycleState`;
- contextos agregados de calendario y Performance.

`SignedStoredUnit` aplica a outcome memories y recent-performance signals cuya
semántica canónica es `[-1,1]`. El bound pertenece al dominio de la señal
normalizada; no limita el outcome que la originó.

El clamp preserva un dominio lógico; no limita títulos, posiciones, goles,
ascensos ni otros outcomes.

### 2.3 Logit seguro

Para toda transición acotada:

```text
xSafe = epsilonState + (1 - 2*epsilonState) * x
latent(x) = stableLogit(xSafe)
```

`epsilonState` pertenece al math profile global. El estado candidato se obtiene
con `stableSigmoid(zNext)` y se cuantiza una vez en el commit atómico. Estados
persistidos `0` y `10000` siguen pudiendo abandonar el extremo; no son estados
absorbentes.

### 2.4 Señales firmadas y magnitudes

```text
SignedSignal = finite binary64
UnitSignal = finite binary64 in [0,1]
Count = non-negative safe integer
SeasonOrdinal = non-negative safe integer
QuarterIndex = 0 | 1 | 2 | 3
```

Los predictores y utilities pueden ser no acotados. No se persisten como
binary64 recurrente salvo que un schema futuro declare cuantización exacta.
NaN, `±Infinity`, unsafe integers y `-0` persistido son errores.

## 3. Definitions inmutables y states simulados

### 3.1 Definitions

`dataVersion` fija:

- `ClubDefinition`;
- `LeagueDefinition`;
- `CompetitionDefinition`;
- memberships iniciales;
- baselines observados;
- phase graphs y reglas declarativas;
- identidades nombrables.

Una Career conserva esas definitions. Un cambio de `dataVersion` no altera una
Career existente.

### 3.2 Estado persistido

```text
ClubState {
  attackStrength: StoredUnit
  defensiveStrength: StoredUnit
  controlStrength: StoredUnit
  prestige: StoredUnit
  financialPower: StoredUnit
  developmentQuality: StoredUnit
  medicalQuality: StoredUnit
  stability: StoredUnit
  managerContext: ManagerContext
  positionCompetition: Map<Position, PositionCompetitionState>
  memberships: CompetitionMembership[]
  recentOutcomeMemory: {
    mean: SignedStoredUnit
    variance: StoredUnit
    recentPerformanceSignal: SignedStoredUnit
  }
}

LeagueState {
  leagueId
  leagueCompetitiveStrength: StoredUnit
  economicContext: StoredUnit
  membershipRevision
  recentInternationalMemory
}

CompetitionState {
  competitionId
  editionId
  seasonId
  participantScope
  reachedPhaseByParticipant
  resolvedProgressionCheckpoints
  eliminatedParticipants
  finalOutcome?
}

WorldState {
  seasonOrdinal
  clubs
  leagues
  competitions
  globalCycles
  regionalCycles
  positionScarcityFields
  parameterSetHash
}
```

El estado persistido no incluye un `ClubOverall`. Una vista de presentación
puede derivarse de las tres strengths y debe declarar pesos y finalidad.

### 3.3 Derived summaries

No son estado causal persistido por defecto:

- `TeamSupportField`;
- `TacticalFit`;
- `TeamMinutesOpportunity`;
- `CompetitionFieldStrength`;
- `PlayerCompetitiveContribution`;
- `scheduleDifficulty`;
- `congestionSignal`;
- `pressureExposure`;
- presentation ratings.

Pueden formar parte de checkpoints o trazas derivadas cuando replay/auditoría
lo requiera.

## 4. Jerarquía estocástica

### 4.1 Factores conservados

La jerarquía normativa es:

```text
global cycle factor
  -> regional cycle factor
    -> league factor
      -> club-season factor
        -> competition-specific factor
          -> entity/dimension-specific residual
```

Cada factor se samplea una vez por su scope y se referencia desde todos sus
consumidores. No se vuelve a sortear una crisis económica o una temporada
extraordinaria para cada módulo.

### 4.2 Factor model

Para un outcome o transición `y`:

```text
innovation[y] =
    lambdaGlobal[y]      * Zglobal
  + lambdaRegional[y]    * Zregional
  + lambdaLeague[y]      * Zleague
  + lambdaClub[y]        * ZclubSeason
  + lambdaCompetition[y] * Zcompetition
  + sigmaSpecific[y]     * Zspecific
```

Todos los `Z` son `StandardNormalInverseCdfV1`. Los loadings y sigmas son
finitos. Factores no causales para un modelo usan loading cero; no consumen un
draw sustituto.

La correlación emerge por factores compartidos. No se declara una matriz
completa sin necesidad. Un `clubSeasonShock` compartido induce correlación
entre liga, copa y continental del mismo club; el shock específico permite
outcomes divergentes.

### 4.3 Regla de una sola causa

Un factor queda identificado por:

```text
FactorRef {
  namespace
  modelId
  scopeId
  seasonOrdinal
  purpose
  occurrence
}
```

`FactorRef` se pasa por referencia. Si Market o Awards consumen posteriormente
un estado afectado por el factor, no deben añadir otra copia del mismo shock.

## 5. World cycles continuos

### 5.1 Factores mínimos

Se conservan únicamente factores con consumers aprobados:

- `footballStrengthCycle`;
- `economicCycle`;
- `talentDevelopmentCycle`.

Existen en scope global y regional. No se crea un catálogo de eras guionadas.
Una “era” es una lectura retrospectiva de factores continuos persistentes.

### 5.2 Transición global

Para factor `k`:

```text
c[k,t] = unit(worldCycleStored[k,t])
z[k,t] = latent(c[k,t])

zGlobal[k,t+1] =
    muGlobal[k]
  + phiGlobal[k] * (z[k,t] - muGlobal[k])
  + lambdaCommon[k] * ZworldCommon[t]
  + sigmaGlobal[k] * ZglobalSpecific[k,t]

cGlobal[k,t+1] = stableSigmoid(zGlobal[k,t+1])
```

### 5.3 Transición regional

```text
zRegion[r,k,t+1] =
    muRegion[r,k]
  + phiRegion[r,k] * (zRegion[r,k,t] - muRegion[r,k])
  + betaGlobal[r,k] * center01(cGlobal[k,t])
  + lambdaRegionalCommon[r,k] * ZregionalCommon[r,t]
  + sigmaRegion[r,k] * ZregionalSpecific[r,k,t]
```

El update usa `cGlobal[k,t]`, no el candidato `t+1`, para evitar un feedback
instantáneo. Todos los candidatos se calculan desde un snapshot previo común y
se confirman atómicamente.

### 5.4 Estabilidad

Un ParameterSet válido exige:

```text
0 <= phiGlobal[k] < 1
0 <= phiRegion[r,k] < 1
finite mu, beta, lambda, sigma
sigma >= 0
```

La sigmoid mantiene el state dentro de su dominio. No limita el soporte Normal
de la innovación ni impone resultados editoriales.

## 6. Evolución de sporting strength

### 6.1 Dimensiones

```text
D_sport = { ATTACK, DEFENSE, CONTROL }
```

Cada dimensión evoluciona por separado. Correlaciones se obtienen mediante
shocks compartidos y loadings, no mediante un overall.

### 6.2 Target contextual

Para club `c`, dimensión `d` y cierre de temporada `t`:

```text
muSport[c,d,t] =
    baseSportMean[region(c), league(c), d]
  + betaWorldFootballMean[d] *
      center01(worldFootballCycle[t])
  + betaRegionalFootballMean[d] *
      center01(regionalFootballCycle[region(c),t])
  + betaLeagueMean[d] *
      center01(leagueCompetitiveStrength[league(c),t])
```

Todos los inputs son del snapshot previo.

### 6.3 Transición

```text
zSport[c,d,t+1] =
    muSport[c,d,t]
  + phiSport[d] * (zSport[c,d,t] - muSport[c,d,t])
  + betaFinanceSport[d] * center01(financialPower[c,t])
  + betaManagerSport[d] * center01(managerQuality[c,t])
  + betaStabilitySport[d] * center01(stability[c,t])
  + betaRecentSport[d] * recentPerformanceSignal[c,d,t]
  + lambdaRegionSport[d] * ZregionalSport[region(c),t]
  + lambdaLeagueSport[d] * ZleagueSport[league(c),t]
  + lambdaClubSport[d] * ZclubSeason[c,t]
  + sigmaSport[d] * ZclubDimension[c,d,t]

strength[c,d,t+1] = stableSigmoid(zSport[c,d,t+1])
```

`recentPerformanceSignal` se define en §16. La transición no contiene floors,
overrides por identidad ni bonus automático por prestige.

### 6.4 Constraints de ParameterSet

```text
0 <= phiSport[d] < 1
betaFinanceSport[d] >= 0
betaManagerSport[d] >= 0
betaStabilitySport[d] >= 0
betaRecentSport[d] >= 0
all sigmas >= 0
```

Los signos son monotonicidades de expectativa. No garantizan un outcome
sampleado superior.

## 7. Prestige, financialPower y stability

### 7.1 Memoria de outcomes

Se usan EWMAs causales sobre outcomes cerrados:

```text
memoryNext =
  rhoMemory * memoryPrevious
  + (1 - rhoMemory) * currentSignal

0 <= rhoMemory < 1
```

`sustainedSuccess`, `sustainedDecline`,
`internationalAchievementSignal` y `financialOutcomeSignal` son memorias
separadas. Un mismo achievement entra una sola vez mediante su causal key.

Para el outcome agregado firmado `x[t] ∈ [-1,1]`:

```text
outcomeMean[t+1] =
  rhoOutcomeMean * outcomeMean[t]
  + (1 - rhoOutcomeMean) * x[t]

outcomeVariance[t+1] =
  rhoOutcomeVariance * outcomeVariance[t]
  + (1 - rhoOutcomeVariance) *
      ((x[t] - outcomeMean[t]) / 2)^2

resultVolatility[t+1] =
  sqrt(outcomeVariance[t+1])

resultStability[t+1] =
  1 - resultVolatility[t+1]

sustainedSuccess[t+1] =
  maxLogical(0, outcomeMean[t+1])

sustainedDecline[t+1] =
  maxLogical(0, -outcomeMean[t+1])
```

`0 <= rhoOutcomeMean,rhoOutcomeVariance < 1`.

### 7.2 Prestige

```text
zPrestige[c,t+1] =
    muPrestige[region(c)]
  + phiPrestige[c] *
      (zPrestige[c,t] - muPrestige[region(c)])
  + betaSustainedSuccess * sustainedSuccess[c,t]
  - betaSustainedDecline * sustainedDecline[c,t]
  + betaInternational * internationalAchievementSignal[c,t]
  + betaLeaguePrestige *
      center01(leagueCompetitiveStrength[league(c),t])
  + betaWorldPrestige *
      center01(worldFootballCycle[t])
  + lambdaPrestigeRegion * ZregionalPrestige[region(c),t]
  + sigmaPrestige * ZclubPrestige[c,t]
```

V1 exige:

```text
max_d(phiSport[d]) < phiPrestige < 1
```

La persistencia mayor es una constraint de ParameterSet, no un floor. Un
ParameterSet futuro que altere esta relación requiere decisión/versionado
explícitos.

### 7.3 FinancialPower

```text
zFinance[c,t+1] =
    muFinance[region(c), league(c)]
  + phiFinance * (zFinance[c,t] - muFinance[region(c),league(c)])
  + betaPrestigeFinance * center01(prestige[c,t])
  + betaSportOutcomeFinance * financialOutcomeSignal[c,t]
  + betaLeagueEconomy *
      center01(leagueEconomicContext[league(c),t])
  + betaWorldEconomy * center01(worldEconomicCycle[t])
  + lambdaRegionFinance * ZregionalEconomy[region(c),t]
  + lambdaLeagueFinance * ZleagueEconomy[league(c),t]
  + sigmaFinance * ZclubFinance[c,t]
```

FinancialPower es contexto abstracto. No es Money, MarketValue, fee, salary o
presupuesto contable. Puede elevar expectativa de strength futura mediante un
coeficiente finito, pero no garantiza resultados.

### 7.4 Stability

```text
managerContinuity =
  -stableExpm1(
    -tenureQuarters / managerContinuityTau
  )

institutionalContinuity =
  1 - institutionalShockBurden

continuitySignal =
  weightedMean(
    managerContinuity,
    institutionalContinuity,
    resultStability
  )

zStability[c,t+1] =
    muStability[region(c)]
  + phiStability * (zStability[c,t] - muStability[region(c)])
  + betaContinuity * center01(continuitySignal[c,t])
  - betaResultVolatility * resultVolatility[c,t]
  + betaFinancialStability * center01(financialPower[c,t])
  - betaInstitutionalShock * institutionalShockBurden[c,t]
  + sigmaStability * ZclubStability[c,t]
```

`managerContinuityTau > 0`. Los pesos de `weightedMean` son no negativos y
suman uno. Stability modifica
manager hazard, context persistence y transitions futuras; nunca impide un
cambio.

## 8. Manager turnover y generación

### 8.1 Señales

La expectativa pre-season usa el mismo model family sin shocks realizados:

```text
expectedLeagueRankSignal =
  signedRankPercentile(
    canonicalRank(expectedLeagueUtility with all Z = 0)
  )

expectedKnockoutDepth =
  sum_phase(
    probabilityReachPhase(
      support snapshot,
      playerContribution = 0,
      all Z = 0
    )
  ) / knockoutPhaseCount

expectedOutcomeSignalAtSeasonStart =
  weightedMean(
    expectedLeagueRankSignal,
    center01(expectedKnockoutDepth),
    weights = managerExpectationCompetitionWeights
  )
```

`signedRankPercentile` mapea primero a `+1`, último a `-1` y usa interpolación
lineal para ranks intermedios; para un único participante válido devuelve cero.
La expectativa es institucional del equipo, no una predicción de CareerScore ni
una garantía.

```text
expectationGap =
  expectedOutcomeSignalAtSeasonStart - realizedOutcomeSignal

underperformance = softplus(
  underperformanceScale * expectationGap
) / underperformanceNormalizer

tenureSignal =
  softplus(
    tenureSlope * (tenureQuarters - tenureReference)
  ) / tenureNormalizer
```

Los normalizers son parámetros positivos. No hay threshold de tenure o
resultado.

### 8.2 Hazard

```text
logManagerRate =
    managerHazardIntercept
  + betaUnderperformance * underperformance
  + betaInstability * (1 - stability)
  + betaExpectationGap * expectationGap
  + betaTenure * tenureSignal
  + dot(betaManagerContext, managerTurnoverContext)

Hmanager = managerEvaluationExposure * safeExp(logManagerRate)
pManagerChange = hazardToProbability(Hmanager)
```

V1 evalúa el hazard ordinario una vez en `WORLD_UPDATE`, usando las cuatro Q
cerradas. El cambio queda vigente desde el siguiente boundary de temporada.
Una causa externa autorizada puede producir `ManagerContextChanged` en otro
boundary ya existente, pero no reutiliza esta occurrence.

El resultado usa `BinomialInverseCdfV1(n=1,pManagerChange)`. Si `Hmanager=0`,
no consume draw. No existe cooldown.

### 8.3 Nuevo `ManagerContext`

Condicionado a cambio:

```text
Gmanager ~ Normal(0,1)
Fstyle[a] ~ Normal(0,1)
epsilonManager[k] ~ Normal(0,1)

managerLatent[k] =
    managerMean[k, league, era]
  + betaPrestigeHire[k] * center01(prestige)
  + betaFinanceHire[k] * center01(financialPower)
  + lambdaManagerGeneral[k] * Gmanager
  + sum_a(lambdaManagerStyle[k,a] * Fstyle[a])
  + sigmaManager[k] * epsilonManager[k]
```

Se obtiene por sigmoid:

- `managerQuality`;
- `developmentInfluence`;
- cada dimensión de `TacticalIdentity`.

`managerContextId` se deriva de Career, club, season y change ordinal. No usa
reloj ni UUID aleatorio. `tenureQuarters=0` y `effectiveFrom` es el siguiente
boundary no cerrado.

## 9. TacticalIdentity y TacticalFit

### 9.1 Vector táctico

V1 usa:

```text
TacticalIdentity {
  attackingIntent
  pressingIntensity
  controlPreference
  directness
  defensiveLineHeight
}
```

Todas las dimensiones pertenecen a `[0,1]`. La generación correlacionada usa
el factor model de §8.3. Club no queda atado para siempre a un arquetipo.

### 9.2 Demanda por posición

Para posición `p`:

```text
tacticalDemand[p,k] =
  stableSigmoid(
      demandIntercept[p,k]
    + sum_s(demandTacticalWeight[p,k,s] * center01(tacticalIdentity[s]))
    + demandManagerWeight[p,k] * center01(managerQuality)
  )
```

Los pesos pertenecen al ParameterSet.

### 9.3 Perfil táctico del jugador

```text
playerTacticalFeature[p,k] =
  stableSigmoid(
      playerFeatureIntercept[p,k]
    + sum_i(playerFeatureCapabilityWeight[p,k,i] * capabilityLogitFeature[i])
    + sum_m(playerFeatureInteractionWeight[p,k,m] * interaction[m])
  )
```

Reutiliza capability features y `PositionSuitability` de G3C-2; no calcula un
Overall.

### 9.4 Fit

```text
mismatch[p] =
  sum_k(
    mismatchWeight[p,k] *
    (playerTacticalFeature[p,k] - tacticalDemand[p,k])^2
  )

sum_k mismatchWeight[p,k] = 1
mismatchWeight[p,k] >= 0

tacticalFitLogit[p] =
    tacticalFitIntercept[p]
  + betaSuitabilityFit[p] *
      center01(positionSuitability[p])
  - betaMismatchFit[p] * mismatch[p]
  + dot(betaFitContext[p], fitContext)

tacticalFit[p] = stableSigmoid(tacticalFitLogit[p])
```

El output canónico consumido por Role & Minutes y Performance está en
`(0,1)`. Mayor mismatch no aumenta el fit esperado para un ParameterSet válido.

## 10. PositionCompetition

### 10.1 Estado

Para cada Position habilitada:

```text
PositionCompetitionState {
  competitionStrength: StoredUnit
  competitionDepth: StoredUnit
  entrenchment: StoredUnit
}
```

El field representa competencia abstracta excluyendo al protagonista. No
materializa rivales.

### 10.2 Target contextual

Para dimensión `k`:

```text
muPositionCompetition[c,p,k,t] =
    pcBaseMean[league(c),p,k]
  + betaClubStrengthPC[p,k] *
      center01(clubSportingProjection[c,t])
  + betaScarcityPC[p,k] *
      center01(worldPositionScarcity[p,t])
  + betaFinancePC[p,k] *
      center01(financialPower[c,t])
  + betaTacticalDemandPC[p,k] *
      center01(tacticalDemand[p,kDemand])
  + betaManagerContinuityPC[p,k] *
      center01(managerContinuity[c,t])
```

`clubSportingProjection` es una proyección declarada de attack/defense/control,
no un state overall.

### 10.3 Transición

```text
zPC[c,p,k,t+1] =
    muPositionCompetition[c,p,k,t]
  + phiPC[p,k] *
      (zPC[c,p,k,t] - muPositionCompetition[c,p,k,t])
  + lambdaPCClub[p,k] * ZsquadEvolution[c,t]
  + lambdaPCPosition[p,k] * ZpositionField[league(c),p,t]
  + sigmaPC[p,k] * ZpcSpecific[c,p,k,t]

pc[c,p,k,t+1] = stableSigmoid(zPC[c,p,k,t+1])
```

`0 <= phiPC < 1`. Un club fuerte puede tener competencia débil en una posición
y viceversa.

### 10.4 World position scarcity

El input de scarcity también es state del mundo, no un valor libre:

```text
zScarcity[r,p,t+1] =
    scarcityMean[r,p]
  + phiScarcity[p] *
      (zScarcity[r,p,t] - scarcityMean[r,p])
  + betaTalentScarcity[p] *
      center01(regionalTalentCycle[r,t])
  + lambdaScarcityRegion[p] *
      ZregionalPosition[r,p,t]
  + sigmaScarcity[p] *
      ZpositionScarcity[r,p,t]

worldPositionScarcity[r,p,t+1] =
  stableSigmoid(zScarcity[r,p,t+1])
```

`0 <= phiScarcity < 1`. En G3C-6 solo se calibran `GK`, `CM` y `ST`; las otras
Position siguen soportadas por schema pero no reciben parameters provisionales.

## 11. CompetitionDefinition y phase graph

### 11.1 Contrato mínimo

Cada Definition que participa en el slice declara:

```text
CompetitionDefinition {
  competitionId
  type
  regionOrConfederation
  seasonCadence
  participantPolicyRef
  phaseGraph
  qualificationRules
  mobilityRules?
  pressureFeatureDefinitions
  minuteUnitsPerMatchEquivalent
  scoringMappingRef?
}
```

`scoringMappingRef` no participa en gameplay.

### 11.2 Phase node

```text
CompetitionPhaseDefinition {
  phaseId
  quarterIndex
  phaseKind
  guaranteedMatchEquivalentCount
  conditionalOnPhaseId?
  fieldStrengthProfileRef
  startCapacityPerMatch
  nonStartCapacityPerMatch
  pressureFeatures
}
```

Una cadena condicional no puede exigir dos decisiones secuenciales dentro de
la misma Q. Varias rondas reales pueden agruparse en un stage agregado con
`matchEquivalentCount`; no se inventa precisión de fixture.

Esta constraint preserva el orden ADR-042 sin limitar la cantidad física de
partidos o la cola de resultados.

## 12. TeamMinutesOpportunity

### 12.1 Fases elegibles

Para competition `c` y Q `q`:

```text
eligiblePhase(c,q) =
  phase.quarterIndex = q
  AND (
    phase.conditionalOnPhaseId is absent
    OR predecessor advancement is confirmed before AVAILABILITY(q)
  )
```

Una fase no alcanzada aporta cero oportunidad y no consume un sampler de
minutos.

### 12.2 Match equivalents y minutos

```text
matchEquivalentCount[c,q] =
  sum over eligible phases(
    guaranteedMatchEquivalentCount[phase]
  )

teamMinutes[c,q] =
  matchEquivalentCount[c,q] *
  minuteUnitsPerMatchEquivalent[c]
```

Ambos son enteros exactos. Si una Definition requiere cantidades
fraccionales de exposición agregada, debe expresarlas mediante unidades
enteras más finas declaradas en data; no introduce float persistido.

```text
TeamMinutesOpportunitySegment {
  competitionId
  competitionType
  teamMinutes
  appearanceOpportunityCount = matchEquivalentCount
  maxStartMinutesPerAppearance
  maxNonStartMinutesPerAppearance
  scheduleDifficultyUnit
  congestionUnit
  pressureExposure
  canonicalOrder
}
```

La suma de `teamMinutes` de segmentos es
`TeamMinutesOpportunity.teamMinutes`. Siempre:

```text
teamMinutes >= 0
teamMinutes <=
  appearanceOpportunityCount * maxStartMinutesPerAppearance
```

### 12.3 Progresión entre Q

Una copa/continental puede cerrar un
`CompetitionProgressionCheckpoint(c,q)` dentro de
`CONSEQUENCES(Qn)`, después de que Performance y Health de Qn estén
confirmados. El checkpoint:

1. consume solo contribución y contexto ya cerrados;
2. resuelve la transición hacia una fase futura;
3. afecta `TeamMinutesOpportunity` de Q posteriores;
4. no crea todavía `CompetitionFinished`;
5. no añade un step top-level al `SimulationCursor`;
6. usa un `operationKey` propio bajo `CONSEQUENCES(Qn)`.

`COMPETITIONS` después de Q4 consolida los checkpoints y emite el outcome
canónico. Nunca vuelve a sortear una transición ya confirmada.

## 13. Difficulty, congestion y Health context

### 13.1 Schedule difficulty

Para segmento:

```text
scheduleDifficultyUnit =
  if matchEquivalentCount = 0 then 0
  else weightedMean(
    CompetitionFieldStrength[phase],
    weights = phaseMatchEquivalentCount
  )
```

Performance y Health consumen `[0,1]`. El adapter legacy firmado para
Role & Minutes es:

```text
scheduleDifficultySigned = center01(scheduleDifficultyUnit)
```

### 13.2 Congestion

```text
exposureDensity =
  totalMatchEquivalentCount[q] / congestionReferenceMatches[q]

crossCompetitionLoad =
  activeCompetitionCount[q] / congestionReferenceCompetitions[q]

congestionRate =
  softplus(
      congestionIntercept
    + betaExposureDensity * stableLog1p(exposureDensity)
    + betaCrossCompetition * stableLog1p(crossCompetitionLoad)
    + dot(betaCongestionContext, congestionContext)
  )

congestionUnit = -stableExpm1(-congestionRate)
```

Los denominadores son parámetros positivos. Mayor exposición no reduce
`congestionUnit` manteniendo lo demás fijo. Health consume `[0,1]`; un adapter
firmado para consumers existentes es `center01(congestionUnit)`.

### 13.3 Training, preparation y recovery

Sin simular sesiones:

```text
trainingExposure =
  stableSigmoid(
      trainingExposureIntercept
    - betaCompetitionDisplacement * congestionUnit
    + betaManagerTraining * center01(managerQuality)
    + betaTrainingContext * center01(trainingContext)
  )

trainingIntensitySignal =
  stableSigmoid(
      trainingIntensityIntercept
    + betaTacticalIntensity *
        center01(tacticalIdentity.pressingIntensity)
    + betaPreparationIntensity * center01(preparationContext)
    - betaCongestionIntensity * congestionUnit
  )

preparationSignal =
  stableSigmoid(
      preparationIntercept
    + betaManagerPreparation * center01(managerQuality)
    + betaStabilityPreparation * center01(stability)
    + betaDevelopmentPreparation * center01(developmentQuality)
    - betaCongestionPreparation * congestionUnit
  )

recoveryOpportunity =
  stableSigmoid(
      recoveryOpportunityIntercept
    + betaMedicalRecoveryOpportunity * center01(medicalQuality)
    + betaStabilityRecoveryOpportunity * center01(stability)
    - betaCongestionRecoveryOpportunity * congestionUnit
    - betaTravelRecoveryOpportunity * travelBurden
  )
```

Development recibe:

```text
trainingContextSignal =
    trainingContextExposureWeight * trainingExposure
  + trainingContextIntensityWeight * trainingIntensitySignal
  + trainingContextPreparationWeight * preparationSignal

weights >= 0
sum weights = 1
```

Estos outputs alimentan Health G3C-5. No redefinen load, fatigue, fitness ni
recovery. `trainingContextSignal` alimenta Development G3C-2 sin sustituir
`developmentQuality` o manager development influence.

## 14. Pressure exposure

### 14.1 Intensidad de fase

Cada phase expone features versionadas en `[0,1]`:

- elimination stake;
- title stake;
- qualification stake;
- relegation stake;
- stage importance;
- otros features declarados por Definition.

Para ligas, stakes contextuales se derivan sin tabla match-by-match:

```text
titleStake =
  safeExp(
    -abs(expectedLeagueUtility - titleBoundaryUtility) /
      titleStakeScale
  )

relegationStake =
  safeExp(
    -abs(expectedLeagueUtility - relegationBoundaryUtility) /
      relegationStakeScale
  )
```

Los boundary utilities proceden del participant field pre-Q y las scales son
positivas. En knockout, elimination/title/qualification features proceden del
phase graph. Todos usan el `CompetitionState` disponible al inicio de Q; nunca
un outcome futuro.

```text
pressureLogit[phase] =
    pressureIntercept[competitionType]
  + sum_k(pressureFeatureWeight[k] * pressureFeature[phase,k])
  + betaFieldPressure *
      center01(competitionFieldStrength[phase])

phasePressure[phase] = stableSigmoid(pressureLogit[phase])
```

### 14.2 Agregación por Q

```text
pressureExposure[c,q] =
  if teamMinutes[c,q] = 0 then 0
  else
    sum_phase(
      teamMinutes[phase] * phasePressure[phase]
    ) / teamMinutes[c,q]
```

No se reduce a final/no-final. Performance consume el resultado `[0,1]`.

## 15. TeamSupportField y PerformanceContext

### 15.1 Support field

Para dimensión `d`:

```text
supportLogit[c,competition,d,q] =
    latent(strength[c,d])
  + betaManagerSupport[d] * center01(managerQuality[c])
  + sum_k(
      betaTacticalSupport[d,k] *
      center01(tacticalIdentity[c,k])
    )
  + betaDifficultySupport[d] *
      center01(scheduleDifficultyUnit[c,q])
  + lambdaSupportSeason[d] * ZclubSeason[c,season]
  + sigmaSupportCompetition[d] *
      ZsupportSpecific[c,competition,q,d]

teamSupport[d] = stableSigmoid(supportLogit[d])
```

El support field representa al resto del equipo. En el club del protagonista,
su contribución no está incluida.

### 15.2 Contexto hacia Performance

Primero se proyecta el field rival:

```text
opponentAttackEnvironment =
  stableSigmoid(
      opponentAttackIntercept[competitionType]
    + betaOpponentAttackField *
        center01(competitionFieldStrength)
    + betaOpponentAttackLeague *
        center01(opponentLeagueStrength)
    + sigmaOpponentAttack *
        ZopponentContext[competition,phase,ATTACK]
  )

opponentDefenseEnvironment =
  stableSigmoid(
      opponentDefenseIntercept[competitionType]
    + betaOpponentDefenseField *
        center01(competitionFieldStrength)
    + betaOpponentDefenseLeague *
        center01(opponentLeagueStrength)
    + sigmaOpponentDefense *
        ZopponentContext[competition,phase,DEFENSE]
  )

shotQualityEnvironment =
  stableSigmoid(
      shotQualityIntercept[competitionType]
    + betaShotQualityOpponent *
        center01(opponentAttackEnvironment)
    - betaShotQualityDefense *
        center01(teamSupport[DEFENSE])
    - betaShotQualityControl *
        center01(teamSupport[CONTROL])
    + betaShotQualityPressure *
        center01(pressureExposure)
  )
```

`opponentLeagueStrength` es gameplay context; nunca IJL. Los coefficients de
shot quality son no negativos para preservar las monotonicidades indicadas por
los signos.

El adapter produce:

```text
PerformanceClubContext {
  attackEnvironment = teamSupport[ATTACK]
  defensiveEnvironment = teamSupport[DEFENSE]
  controlEnvironment = teamSupport[CONTROL]
  opponentAttackEnvironment
  opponentDefenseEnvironment
  shotQualityEnvironment
  scheduleDifficulty = scheduleDifficultyUnit
  competitionStrength = CompetitionFieldStrength
  pressureExposure
  tacticalContext
}
```

Todos los units están en `[0,1]`. Opponent/field inputs proceden de Definition,
LeagueState y CompetitionState; no de IJL.

## 16. PlayerCompetitiveContribution

### 16.1 Input autorizado

Performance entrega por club, competition y Q:

```text
PerformanceContributionInput {
  actualMinutes
  teamOpportunityMinutes
  evidenceStrength
  contextualPerformanceSignal
  observedProductionByStat
  expectedProductionByStat
  effectivePosition
}
```

`contextualPerformanceSignal` es una proyección firmada de
`PerformanceSummary`; no es CareerScore, rating de UI ni CC.

### 16.2 Residual de producción

Para stat autorizada `s`:

```text
rawResidual[s] =
  observedProduction[s] - expectedProduction[s]

productionResidual[s] =
  sign(rawResidual[s]) *
  stableLog1p(
    abs(rawResidual[s]) / productionResidualScale[position,s]
  )
```

`productionResidualScale > 0`.

### 16.3 Contribución

```text
exposureShare =
  if teamOpportunityMinutes = 0 then 0
  else actualMinutes / teamOpportunityMinutes

qualitySignal =
    betaPerformanceContribution[position] *
      contextualPerformanceSignal
  + sum_s(
      betaProductionContribution[position,s] *
      productionResidual[s]
    )

playerContribution =
  exposureShare *
  evidenceStrength *
  qualitySignal
```

No se clampa `qualitySignal` ni `playerContribution`. Los counts tienen soporte
no negativo sin cap editorial y pueden producir contribuciones excepcionales.
Una contribución finita no garantiza outcome porque los shocks colectivos
conservan soporte completo.

Si `actualMinutes=0`, la contribución es exactamente cero y no consume RNG.

### 16.4 Agregación

La contribución se suma solo dentro del mismo competition context:

```text
seasonCompetitionContribution =
  sum_q(playerContribution[q])
```

Un transfer conserva segmentos por club/competition. Nunca reasigna stats al
club final ni duplica minutos.

## 17. Outcome de liga

### 17.1 Participantes

Una edición de liga recibe una lista canónica de participantes reales
identificados. Cada participante dispone de:

- `TeamSupportField` o baseline ligero compatible;
- state/context de competición;
- contribution separada si contiene al protagonista.

Un field anónimo puede modelar dificultad, pero no puede ocupar una posición
nombrada ni ser champion.

### 17.2 Utility esperada

Primero se agrega support por exposición:

```text
seasonTeamSupport[i,d] =
  if sum_q(teamMinutes[i,league,q]) = 0
  then preseasonTeamSupport[i,d]
  else
    sum_q(
      teamMinutes[i,league,q] * teamSupport[i,league,d,q]
    ) / sum_q(teamMinutes[i,league,q])
```

`preseasonTeamSupport` se calcula con §15.1 y shocks de season ya identificados;
no es un default oculto.

```text
expectedLeagueUtility[i] =
    leagueUtilityIntercept[competitionId]
  + sum_d(
      leagueSupportWeight[competitionId,d] *
      center01(seasonTeamSupport[i,d])
    )
  + betaStabilityLeague *
      center01(stability[i])
  + betaPlayerLeague *
      playerSeasonContribution[i,competitionId]
  + dot(betaLeagueContext, leagueOutcomeContext[i])
```

Para clubes sin protagonista, el baseline ya representa a todo el equipo y
`playerSeasonContribution=0`. Para el club del protagonista, el support field
lo excluye y la contribución se añade una vez.

### 17.3 Score y ranking

```text
leagueScore[i] =
    expectedLeagueUtility[i]
  + lambdaClubSeasonLeague * ZclubSeason[i,season]
  + sigmaLeagueOutcome * ZleagueOutcome[i,competition,season]

ranking =
  canonicalSort(
    participants,
    descending leagueScore,
    then ascending participantId UTF-8
  )
```

El champion es el primer participante cuando la Definition exige exactamente
uno. La igualdad binary64 se resuelve por ID; no consume draw.

Se elige noisy utility y canonical rank, no Plackett-Luce, porque el slice
requiere ranking agregado, factores compartidos y un sampler Normal ya
normativo.

### 17.4 Puntos y marcadores

V1 no genera puntos, goals for o goals against como facts de liga. No tienen un
consumer causal aprobado en el slice. Persisten:

- rank/standing;
- champion;
- qualification outcomes;
- mobility candidates;
- contribution/context requerido por facts posteriores.

Si UI o data futura necesita puntos, requiere una Definition y una familia
matemática versionada; no se derivan ad hoc del rank.

## 18. Copa y competiciones continentales

### 18.1 Field por fase

```text
competitionFieldStrength[c,phase,t] =
  stableSigmoid(
      fieldIntercept[c,phase]
    + betaLeagueField *
        center01(leagueCompetitiveStrength[sourceLeague,t])
    + betaWorldField *
        center01(regionalFootballCycle[region,t])
    + lambdaFieldSeason * ZcompetitionField[c,phase,t]
  )
```

El field no crea un club identificable.

### 18.2 Probabilidad de avance

Para un participant y phase elegible:

```text
phasePlayerContribution =
  if teamMinutes[competition,q] = 0
  then 0
  else
    playerContribution[competition,q] *
    teamMinutes[phase] / teamMinutes[competition,q]
```

La asignación conserva la contribución de Q y no inventa performance por
fixture.

```text
teamKnockoutUtility =
    knockoutUtilityIntercept[c,phase]
  + sum_d(
      knockoutSupportWeight[c,phase,d] *
      center01(teamSupport[d])
    )
  + betaPlayerKnockout * phasePlayerContribution
  + betaPressureContext * center01(phasePressure)
  + lambdaClubSeasonKnockout * ZclubSeason
  + sigmaKnockoutPhase * ZknockoutSpecific

advanceLogOdds =
    teamKnockoutUtility
  - betaFieldKnockout *
      center01(competitionFieldStrength[c,phase])

pAdvance = stableSigmoid(advanceLogOdds)
```

Se samplea con `BinomialInverseCdfV1(n=1,pAdvance)`. Para predictores finitos:

```text
0 < pAdvance < 1
```

No hay strength que garantice clasificación o eliminación.

### 18.3 Exposición condicional

Un advance confirmado habilita únicamente nodes futuros del phase graph. Una
eliminación impide progresión salvo que la Definition declare explícitamente
otro path (por ejemplo, descenso de competición). No se agregan rounds
hipotéticos a Q previas.

### 18.4 Continental

Domestic Cup, Libertadores y Champions usan el mismo resolver con distintos:

- phase graph;
- field profiles;
- calendar allocation;
- participant policy;
- pressure features;
- parámetros de utility/variance.

No se inventan puntos de Scoring. Scoring usa su propio mapping versionado.

### 18.5 Champion cuando el club seguido no gana

El path por phase resuelve la trayectoria del club del protagonista. Si ese
club no es champion y la Definition exige una identidad de champion, se usa un
`NamedWinnerCandidateSet` compuesto exclusivamente por IDs reales de
`dataVersion`:

```text
fieldWinnerUtility[i] =
    fieldWinnerIntercept[competition]
  + sum_d(
      fieldWinnerStrengthWeight[competition,d] *
      center01(candidateSportingState[i,d])
    )
  + lambdaFieldWinnerSeason *
      ZclubSeason[i,season]
  + sigmaFieldWinner *
      ZfieldWinnerSpecific[i,competition,edition]

pFieldWinner =
  stableSoftmax(fieldWinnerUtility in canonical candidate order)

fieldChampion =
  CategoricalCumulativeMidpointV1(pFieldWinner, draw)
```

Si el club seguido ganó la final, es champion y esta rama no consume draws. El
candidate set debe contener al menos una identidad elegible cuando se entra en
la rama; si no existe, la Definition/data es inválida. Un field abstracto nunca
se publica como champion.

## 19. Correlación entre competiciones

Para club `c`:

```text
outcomeInnovation[c,competition] =
    lambdaClubSeason[competition] *
      ZclubSeason[c,season]
  + sigmaCompetition[competition] *
      ZcompetitionSpecific[c,competition,phase]
```

Un ParameterSet válido para competiciones del slice exige loadings compartidos
no negativos cuando se desea correlación deportiva positiva. El residual
específico conserva:

- gran copa con mala liga;
- gran liga con eliminación temprana;
- dominio largo;
- temporada aislada muy mala.

Agregar una competición con otro `competitionId` no cambia draws existentes.

## 20. Resultados hacia state futuro

### 20.1 Outcome signal

Cada CompetitionDefinition declara una proyección firmada:

```text
competitionOutcomeSignal =
    outcomeRankWeight * rankPercentileSignal
  + titleWeight * titleIndicator
  + qualificationWeight * qualificationSignal
  + phaseWeight * reachedPhaseSignal
```

`rankPercentileSignal`, `qualificationSignal` y `reachedPhaseSignal` pertenecen
a `[-1,1]`; `titleIndicator ∈ {0,1}`. Los weights son no negativos y suman
uno, por lo que el resultado permanece en `[-1,1]`. Features no disponibles
usan cero con semántica explícita.

### 20.2 Recent performance

```text
currentClubOutcome =
  weightedMean(
    competitionOutcomeSignal,
    weights = competitionExposureWeight
  )

recentPerformanceSignal[t+1] =
    rhoRecentOutcome * recentPerformanceSignal[t]
  + (1 - rhoRecentOutcome) * currentClubOutcome[t]
```

`0 <= rhoRecentOutcome < 1`. El signal solo alimenta transitions futuras de
ClubState. No reescribe la competición que lo produjo.

## 21. LeagueCompetitiveStrength

### 21.1 Aggregate previo

```text
clubSportingUnit[i] =
    weightAttackLeague * attackStrength[i]
  + weightDefenseLeague * defensiveStrength[i]
  + weightControlLeague * controlStrength[i]

weights >= 0
sum weights = 1

leagueClubSignal =
  weightedMean(
    clubSportingUnit[i],
    membershipWeight[i]
  )
```

Los membership weights son positivos y versionados.

### 21.2 Transición

```text
zLeague[l,t+1] =
    muLeague[l]
  + phiLeague[l] * (zLeague[l,t] - muLeague[l])
  + betaClubAggregate *
      center01(leagueClubSignal[l,t])
  + betaInternationalResults *
      internationalClubOutcomeMemory[l,t]
  + betaRegionalFootball *
      center01(regionalFootballCycle[region(l),t])
  + lambdaLeagueRegional *
      ZregionalLeague[region(l),t]
  + sigmaLeagueStrength *
      ZleagueStrength[l,t]

leagueCompetitiveStrength[l,t+1] =
  stableSigmoid(zLeague[l,t+1])
```

Usa ClubState previo y facts cerrados. Nunca usa IJL. IJL no aparece en
`EngineParameterSet.clubWorld` ni `competitions`.

### 21.3 League economic context

```text
zLeagueEconomy[l,t+1] =
    muLeagueEconomy[l]
  + phiLeagueEconomy[l] *
      (zLeagueEconomy[l,t] - muLeagueEconomy[l])
  + betaWorldLeagueEconomy *
      center01(worldEconomicCycle[t])
  + betaRegionLeagueEconomy *
      center01(regionalEconomicCycle[region(l),t])
  + lambdaLeagueEconomy *
      ZregionalEconomy[region(l),t]
  + sigmaLeagueEconomy *
      ZleagueEconomySpecific[l,t]

leagueEconomicContext[l,t+1] =
  stableSigmoid(zLeagueEconomy[l,t+1])
```

Es un índice abstracto `[0,1]`, no Money ni exchange rate.

## 22. DevelopmentQuality y MedicalQuality

### 22.1 DevelopmentQuality

```text
zDevelopmentQuality[c,t+1] =
    muDevelopmentQuality[region(c)]
  + phiDevelopmentQuality *
      (zDevelopmentQuality[c,t] - muDevelopmentQuality[region(c)])
  + betaFinanceDevelopment * center01(financialPower[c,t])
  + betaStabilityDevelopment * center01(stability[c,t])
  + betaManagerDevelopment *
      center01(managerDevelopmentInfluence[c,t])
  + betaTalentCycleDevelopment *
      center01(regionalTalentCycle[region(c),t])
  + sigmaDevelopmentQuality *
      ZdevelopmentInstitution[c,t]
```

### 22.2 MedicalQuality

```text
zMedicalQuality[c,t+1] =
    muMedicalQuality[region(c)]
  + phiMedicalQuality *
      (zMedicalQuality[c,t] - muMedicalQuality[region(c)])
  + betaFinanceMedical * center01(financialPower[c,t])
  + betaStabilityMedical * center01(stability[c,t])
  + betaEconomicMedical *
      center01(regionalEconomicCycle[region(c),t])
  + sigmaMedicalQuality *
      ZmedicalInstitution[c,t]
```

Ambas son slow states con `0 <= phi < 1`. Ninguna garantiza Development o
Recovery positivos; los subsistemas correspondientes conservan sus ecuaciones.

## 23. Orden causal y atomicidad

### 23.1 Dentro de una temporada

```text
pre-Q Club/Competition snapshot
-> TeamMinutesOpportunity + contexts
-> Availability
-> Role/Minutes
-> Performance
-> PlayerCompetitiveContribution
-> Health
-> CONSEQUENCES:
     competition progression checkpoint for future Q
-> next Q

after Q4:
  COMPETITIONS consolidates outcomes
  -> MARKET / AWARDS consume closed outcomes
  -> WORLD_UPDATE computes all next-state candidates from prior snapshot
  -> atomic commit
```

No se introduce una fase nueva. El sub-operation key de progresión queda
ligado a `CONSEQUENCES(Qn)`.

### 23.2 World update sin feedback instantáneo

En `WORLD_UPDATE`:

1. congelar `WorldState[t]`, facts y memorias cerradas;
2. resolver factors/shocks de la transición;
3. calcular candidatos de world cycles, leagues y clubs usando solo el
   snapshot congelado;
4. validar domains/invariants;
5. cuantizar;
6. confirmar todos los candidates atómicamente.

`LeagueState[t+1]` no vuelve a alimentar `ClubState[t+1]` en la misma
operación. El efecto aparece en la transición posterior.

## 24. Promotion, relegation y DR-065

### 24.1 Determinación matemática

Si una Definition declara slots:

```text
relegationCandidates =
  bottomK(canonicalLeagueRanking, relegationSlotCount)

promotionCandidateRequests =
  mobilityPolicyInput.promotionCandidates
```

El rank determina candidatos sin sorteo adicional. No existe immunity por
identidad.

### 24.2 Boundary

```text
LeagueOutcome
  -> MobilityTransitionRequest
  -> MobilityPolicy (DR-065)
  -> PromotionOccurred / RelegationOccurred
  -> membership update
```

`MobilityTransitionRequest` contiene:

- source/destination tier IDs;
- competition/rule reference;
- candidate club ID cuando es conocido;
- rank/qualification evidence;
- season/effective boundary;
- requested transition kind.

No actualiza membership por sí mismo.

### 24.3 Política G3D-2 y data pendiente

ADR-081 adopta un pool híbrido: identidades reales versionadas, fields no
identificables y materialización determinista cuando se necesita un sujeto
nominal. Permanecen `DATA_REQUIRED`:

- source de clubes promovidos;
- existencia y contenido de `ExternalClubPool`;
- materialización/desmaterialización de state;
- champion externo nombrable;
- continuidad del protagonista fuera del tier;
- calendario/Performance/Market/Awards/Scoring externos;
- retorno a tier detallado.

Si el club del protagonista sale del tier, conserva club, contrato e identidad.
No se mueve automáticamente al jugador.

### 24.4 Contexto mínimo fuera del tier

La continuidad abstracta autorizada por ADR-081 debe producir como mínimo:

```text
ExternalTierParticipationContext {
  tierId
  leagueCompetitiveStrength
  TeamMinutesOpportunity
  PerformanceClubContext
  PositionCompetition
  developmentQuality
  medicalQuality
  financialContext
  marketEligibilityContext
  scoringEligibilityContext
}
```

Este documento define el boundary, no el producer ni la policy.

### 24.5 Reconciliación Market G3C-7

[`TRANSFER_MARKET_CONTRACT_MATH_SPEC.md`](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
consume sin reabrir Club/World:

- `attackStrength`, `defensiveStrength` y `controlStrength`;
- prestige y financialPower separados;
- `TacticalIdentity`;
- `PositionCompetition` por posición;
- world/region economic y market factors;
- `positionScarcity`;
- identities/data refs autorizados.

El adapter mínimo de un club externo se amplía con:

```text
ExternalMarketClubContext {
  clubId
  leagueId
  regionId
  sportingStrength
  prestige
  financialPower
  TacticalIdentity
  PositionCompetition
  positionScarcity
  clubStrategyContext
  transferCapacityContext
  salaryCapacityContext
  marketWindowEligibility
  data/policy refs
}
```

G3C-7 define ClubNeed market-purpose, fit y financial feasibility. Club/World
continúa siendo owner de los states/contextos fuente. `financialPower` no se
convierte en Money y este adapter no autoriza candidates externos antes de
DR-065.

## 25. Initial world generation

### 25.1 Baseline

Para cada state acotado con baseline de data:

```text
zInitial =
    latent(dataBaseline)
  + deterministicInitialOffset[entity,dimension]
  + lambdaInitialGlobal * ZinitialGlobal
  + lambdaInitialRegional * ZinitialRegional
  + sigmaInitialEntity * ZinitialEntity

initialUnit = stableSigmoid(zInitial)
initialStored = quantizeUnit(initialUnit)
```

Una perturbación puede deshabilitarse con sigmas cero. Si data no aporta
baseline, la Definition debe referenciar un profile versionado; no se usa un
default oculto.

### 25.2 Definitions intactas

La perturbación crea únicamente `WorldState[0]`. Nunca modifica la snapshot ni
finge que el baseline perturbado fue un dato real.

## 26. Vertical slice

El contrato matemático cubre:

| Contexto | Competición mínima | Resolver |
|---|---|---|
| Argentina | liga principal | noisy utility + canonical rank |
| Argentina | copa doméstica | phase field + logistic advancement |
| CONMEBOL | Libertadores | phase field + logistic advancement |
| España | liga principal | noisy utility + canonical rank |
| España | copa doméstica | phase field + logistic advancement |
| UEFA | Champions League | phase field + logistic advancement |

El state detallado inicial mantiene **ocho clubes reales por liga** conforme al
scope freeze G3D-2. Completar participantes, champions nombrables,
promoted clubs o tiers externos no se infiere: pertenece a DR-025/065.
El protagonista del slice sigue limitado a `GK`, `CM` y `ST`; las equations de
club no amplían el scope posicional.

Antes de implementación, cada `CompetitionDefinition` debe publicar:

- ID real y source;
- participant policy;
- phase graph compatible con Q;
- match-equivalent allocation;
- field profiles;
- qualification/mobility rules;
- pressure features;
- parameter profile references;
- named participant/champion policy.

No se amplía a otras ligas o competiciones por esta especificación.

## 27. Facts, signals y auditabilidad

### 27.1 Clasificación canónica

Según `SCORING_FACTS_SPEC.md`:

- `CompetitionFinished`: `PERSISTED_DOMAIN_FACT`;
- `ManagerContextChanged`: `PERSISTED_DOMAIN_FACT`;
- `ClubStateUpdated`: `PERSISTED_DOMAIN_FACT`;
- `LeagueStateUpdated`: `PERSISTED_DOMAIN_FACT`;
- `PromotionOccurred` / `RelegationOccurred`: facts solo tras policy aplicada;
- `WorldCycleUpdated`: `PERSISTED_DOMAIN_FACT`;
- `CompetitionProgressionCheckpoint`: internal/derived state;
- `TeamMinutesOpportunityPrepared`: `DERIVED_SUMMARY`;
- `PositionCompetitionPrepared`: `DERIVED_SUMMARY`;
- `PlayerCompetitiveContributionRecorded`: `DERIVED_SUMMARY`.

Win, round, qualification y title son views de `CompetitionFinished`, no facts
duplicados.

### 27.2 Traza mínima

Cada cálculo conserva:

- input state/fact IDs;
- `parameterSetHash`;
- model/parameter profile IDs;
- factor references;
- expected utility/hazard;
- sampler ID y occurrence;
- output previo a cuantización;
- output persistido;
- operation key.

No se usa timestamp del reloj.

## 28. Random streams

### 28.1 Namespace

Namespace raíz:

```text
club-world
```

Model IDs mínimos:

```text
world-cycle-global-v1
world-cycle-regional-v1
league-cycle-v1
club-strength-evolution-v1
club-prestige-evolution-v1
club-finance-evolution-v1
club-stability-evolution-v1
manager-turnover-v1
manager-generation-v1
tactical-identity-v1
position-competition-v1
position-scarcity-v1
team-support-field-v1
competition-performance-context-v1
competition-field-v1
competition-field-winner-v1
league-outcome-v1
knockout-advance-v1
league-strength-evolution-v1
league-economic-context-v1
development-quality-evolution-v1
medical-quality-evolution-v1
initial-world-v1
```

### 28.2 Context keys

Ejemplos normativos:

```text
world/{season}/global/{factor}
world/{season}/region/{regionId}/{factor}
league/{leagueId}/{season}/evolution/{factor}
club/{clubId}/{season}/sport/{dimension}
club/{clubId}/{season}/manager/turnover
club/{clubId}/{season}/manager/generation/{dimension}
club/{clubId}/{season}/position/{position}/{dimension}
competition/{competitionId}/{editionId}/participant/{clubId}/league-score
competition/{competitionId}/{editionId}/phase/{phaseId}/club/{clubId}/advance
```

`occurrence` es cero para un singleton y ordinal canónico para múltiples
transiciones. Los IDs se ordenan por UTF-8 o por Definition order explícito.

### 28.3 Aislamiento

- agregar otra competition no desplaza league/cup existentes;
- cambiar el orden de clubs no cambia sus draws;
- manager turnover y manager generation usan purposes distintos;
- `clubSeasonShock` se samplea una vez y se referencia;
- scoring no tiene stream;
- una rama lógicamente determinada no consume draw.

## 29. Samplers normativos

Esta especificación reutiliza:

- `StandardNormalInverseCdfV1`;
- `BinomialInverseCdfV1(n=1,p)` para manager/advance;
- `CategoricalCumulativeMidpointV1` cuando una policy futura elija entre
  alternativas mutuamente excluyentes;
- canonical sort para league ranking.

No usa rejection sampling. No introduce otro Normal, Bernoulli o categorical.

## 30. `EngineParameterSet`

### 30.1 `clubWorld`

```text
clubWorld: {
  stateMath: {
    epsilonState
    quantizationProfile
  }
  worldCycles: {
    factors
    globalMeans
    regionalMeans
    globalPersistence
    regionalPersistence
    globalToRegionalCoefficients
    commonLoadings
    specificSigmas
  }
  sportingStrength: {
    baseMeansByContextAndDimension
    persistenceByDimension
    financeCoefficients
    managerCoefficients
    stabilityCoefficients
    recentOutcomeCoefficients
    worldLeagueCoefficients
    factorLoadings
    specificSigmas
  }
  prestige: {
    means
    persistence
    outcomeMeanPersistence
    outcomeVariancePersistence
    sustainedSuccessCoefficients
    declineCoefficients
    internationalCoefficients
    worldLeagueCoefficients
    shockLoadings
    sigmas
  }
  finance: {
    means
    persistence
    prestigeCoefficients
    outcomeCoefficients
    leagueWorldEconomicCoefficients
    shockLoadings
    sigmas
  }
  stability: {
    means
    persistence
    continuityWeights
    managerContinuityTau
    resultVolatilityCoefficient
    financeCoefficient
    institutionalShockCoefficient
    sigma
  }
  manager: {
    hazardIntercepts
    hazardCoefficients
    evaluationExposure
    expectationCompetitionWeights
    tenureTransform
    underperformanceTransform
    generationMeans
    prestigeFinanceHireCoefficients
    generationFactorLoadings
    generationSigmas
  }
  tactics: {
    tacticalDimensions
    demandIntercepts
    demandWeights
    playerFeatureIntercepts
    playerFeatureWeights
    playerFeatureInteractions
    mismatchWeights
    fitIntercepts
    fitCoefficients
  }
  positionCompetition: {
    meansByContextPositionDimension
    persistence
    clubStrengthCoefficients
    scarcityCoefficients
    financeCoefficients
    tacticalDemandCoefficients
    continuityCoefficients
    factorLoadings
    sigmas
    scarcityMeans
    scarcityPersistence
    scarcityTalentCoefficients
    scarcityFactorLoadings
    scarcitySigmas
  }
  institutionalQuality: {
    developmentMeans
    developmentPersistence
    developmentCoefficients
    developmentSigma
    medicalMeans
    medicalPersistence
    medicalCoefficients
    medicalSigma
  }
  leagueStrength: {
    sportingProjectionWeights
    membershipWeights
    means
    persistence
    clubAggregateCoefficient
    internationalOutcomeCoefficient
    regionalCycleCoefficient
    factorLoadings
    sigmas
  }
  leagueEconomy: {
    means
    persistence
    worldCoefficients
    regionalCoefficients
    factorLoadings
    sigmas
  }
  initialState: {
    deterministicOffsets
    factorLoadings
    entitySigmas
    fallbackProfileRefs
  }
  streams
  calibration
}
```

### 30.2 `competitions`

```text
competitions: {
  calendar: {
    minuteUnitsPerMatchEquivalentByDefinition
    congestionReferenceMatches
    congestionReferenceCompetitions
    congestionIntercepts
    congestionCoefficients
    trainingExposureCoefficients
    trainingIntensityCoefficients
    preparationCoefficients
    recoveryOpportunityCoefficients
    trainingContextWeights
  }
  supportField: {
    managerCoefficients
    tacticalCoefficients
    difficultyCoefficients
    seasonLoadings
    competitionSigmas
  }
  performanceContext: {
    opponentAttackIntercepts
    opponentDefenseIntercepts
    opponentFieldCoefficients
    opponentLeagueCoefficients
    opponentContextSigmas
    shotQualityIntercepts
    shotQualityCoefficients
  }
  playerContribution: {
    performanceCoefficientsByPosition
    productionCoefficientsByPositionStat
    productionResidualScales
    competitionAggregationRules
  }
  leagueOutcome: {
    intercepts
    supportWeights
    stabilityCoefficient
    playerContributionCoefficient
    contextCoefficients
    clubSeasonLoading
    outcomeSigma
    canonicalTieBreakProfile
  }
  knockoutOutcome: {
    utilityInterceptsByCompetitionPhase
    supportWeights
    playerContributionCoefficient
    fieldCoefficient
    pressureCoefficient
    clubSeasonLoading
    phaseSigmas
  }
  fieldWinner: {
    intercepts
    sportingStrengthWeights
    clubSeasonLoadings
    specificSigmas
  }
  fields: {
    interceptsByCompetitionPhase
    leagueCoefficients
    worldCoefficients
    factorLoadings
  }
  pressure: {
    interceptsByCompetitionType
    featureWeights
    fieldCoefficient
    titleStakeScales
    relegationStakeScales
  }
  recentOutcome: {
    definitionProjectionWeights
    exposureWeights
    persistence
  }
  phaseGraphProfiles
  definitionParameterBindings
  streams
  calibration
}
```

### 30.3 Clasificación

| Grupo | Clasificación |
|---|---|
| nombres de dimensiones, equations, transform/sampler IDs, ordering, state domains, canonical tie-break | `STRUCTURAL_FIXED` |
| means, persistence, loadings, sigmas, utility/hazard coefficients, calendar profiles del slice | `INITIAL_CALIBRATION_REQUIRED` |
| tolerancias adicionales, diagnostics, profiles de competiciones futuras no habilitadas | `TUNABLE_LATER` |

No existe constante cuantitativa oculta fuera del ParameterSet, salvo
identidades matemáticas (`0`, `1`, `2`) y el número de Q fijado por ADR-042.

## 31. Invariantes

### 31.1 Estado

- toda dimensión acotada persiste como integer `0..10000`;
- no persisten NaN, Infinity o `-0`;
- no existe `ClubOverall` causal;
- strength, prestige y financialPower son states distintos;
- Definitions permanecen byte-equivalent.

### 31.2 Calendario

- `TeamMinutesOpportunity >= 0`;
- splits suman exactamente el total;
- una fase no alcanzada aporta cero exposición;
- una fase eliminada no progresa salvo path explícito;
- no se materializa fixture o fecha diaria;
- progression checkpoint no reabre Q.

### 31.3 Outcomes

- league ranking contiene cada participante exactamente una vez;
- existe exactamente un champion cuando la Definition lo exige;
- toda identidad nombrada procede de dataVersion;
- contribución positiva no reduce expected team utility;
- contribución finita no garantiza outcome;
- player contribution no usa score/CC;
- raw production no se reescribe;
- IJL no modifica world/gameplay.

### 31.4 Evolución

- `0 <= phi < 1` para todos los AR(1);
- prestige es más persistente que sporting strength en V1;
- financialPower no garantiza outcome;
- no hay identity floors;
- cualquier club puede subir o bajar en strength;
- updates consumen snapshot previo y facts cerrados;
- un outcome no se recalcula por state futuro.

### 31.5 Determinismo

- misma seed/context/parameters/data produce mismo WorldState y facts;
- factores compartidos se resuelven una vez;
- agregar una competition no desplaza otra;
- canonical order no depende de arrays/DB;
- ramas determinadas no consumen RNG.

## 32. Calibration targets

Toda fila declara `INVARIANT`, `CALIBRATION_TARGET` o `DIAGNOSTIC`.

### 32.1 Club

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| autocorrelación interanual attack/defense/control | CALIBRATION_TARGET | país, liga, dimensión | externa |
| correlación attack-defense-control | CALIBRATION_TARGET | liga/era | externa + diseño |
| persistencia relativa prestige vs strength | INVARIANT + TARGET | contexto | diseño |
| persistencia de financialPower | CALIBRATION_TARGET | país/era | externa |
| manager turnover | CALIBRATION_TARGET | prestige/result gap/tenure | externa |
| estabilidad de PositionCompetition | CALIBRATION_TARGET | GK/CM/ST, club tier | diseño + externa |
| sensibilidad de strength a finance/manager/stability | DIAGNOSTIC | dimensión | causal |

### 32.2 Competitions

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| concentración de títulos | CALIBRATION_TARGET | liga/era | externa |
| volatilidad de rank | CALIBRATION_TARGET | liga/club tier | externa |
| upset frequency | CALIBRATION_TARGET | competition/phase gap | externa |
| advancement por fase | CALIBRATION_TARGET | copa/continental | externa |
| correlación liga-copa-continental | CALIBRATION_TARGET | club/season | externa |
| sensibilidad a player contribution | DIAGNOSTIC | position/exposure | diseño |
| champion único e identidades válidas | INVARIANT | edition | normativa |

### 32.3 Calendar

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| match equivalents por Q | CALIBRATION_TARGET | competition/country | data externa |
| TeamMinutesOpportunity | CALIBRATION_TARGET | competition/Q | data externa |
| congestion distribution | CALIBRATION_TARGET | club/Q | externa |
| pressureExposure | CALIBRATION_TARGET | phase/type | diseño + externa |
| training/recovery context sensitivity | DIAGNOSTIC | congestion/medical | causal |

### 32.4 World

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| drift de league strength | CALIBRATION_TARGET | Argentina/España | externa |
| persistencia de ciclos regionales | CALIBRATION_TARGET | factor/region | diseño + externa |
| ascenso de club emergente | DIAGNOSTIC | horizonte | diseño |
| caída de club fuerte | DIAGNOSTIC | horizonte | diseño |
| balance continental | CALIBRATION_TARGET | confederación/era | externa |
| state finito en carreras largas | INVARIANT | DEEP | normativa |

### 32.5 Cross-system

| Relación | Clase |
|---|---|
| attackEnvironment -> ST opportunities | DIAGNOSTIC |
| defensiveEnvironment -> GK shots/opponents | DIAGNOSTIC |
| congestion -> Health load/fatigue | DIAGNOSTIC |
| developmentQuality -> acquired development | DIAGNOSTIC |
| medicalQuality -> recovery/hazard | DIAGNOSTIC |
| player contribution -> team expected utility | INVARIANT + DIAGNOSTIC |

No se aprueban valores observacionales en G3C-6.

## 33. Tail diagnostics

Se miden, sin caps:

- P90/P95/P99/P99.9 de eras dominantes;
- décadas de declive de clubes prestigiosos;
- crecimiento sostenido de clubes inicialmente débiles;
- upset streaks y eliminaciones tempranas repetidas;
- leagues extremadamente fuertes o débiles;
- manager churn y tenures excepcionalmente largos;
- seasons de congestión extrema;
- contribuciones excepcionales con fracaso colectivo;
- títulos con contribución individual baja;
- movilidad repetida cuando DR-065 la habilite.

Un tail se corrige mediante parámetros/distribución, nunca protegiendo IDs.

## 34. Golden vectors requeridos

Cada fixture incluye `engineVersion`, `parameterSetHash`, data IDs, state
inicial, draws midpoint o Z conocidos y orden de operaciones.

### 34.1 Club evolution

```text
fixed ClubState + context + outcome memories + factor draws
-> muSport by dimension
-> each latent candidate
-> attack/defense/control
-> prestige/finance/stability
-> quantized next state
```

### 34.2 Manager

```text
fixed expectation/result/stability/tenure
-> log rate -> H -> probability
-> known uniform -> change/no change
-> known latent draws -> exact ManagerContext
```

### 34.3 Tactics y competition

```text
fixed manager latent draws
-> exact TacticalIdentity

fixed player profile + tactical context
-> exact TacticalFit

fixed club/position state + draws
-> exact PositionCompetition
```

### 34.4 Calendar

```text
fixed phase graph + confirmed progression
-> eligible phases
-> exact matchEquivalentCount/teamMinutes
-> exact scheduleDifficulty/congestion/pressure
```

Debe incluir una fase no alcanzada que aporte cero.

### 34.5 Player contribution

```text
fixed PerformanceContributionInput
-> exposureShare
-> each production residual
-> exact contribution
-> exact expected team utility shift
```

### 34.6 League

```text
fixed participants/support/contributions/Z draws
-> expected utilities
-> scores
-> exact canonical ranking/champion
```

Incluye empate exacto resuelto por participant ID.

### 34.7 Knockout

```text
fixed support/field/contribution/context/Z
-> advance logOdds/probability
-> known uniform
-> advance/eliminate
-> next-Q phase eligibility

fixed real winner candidate set + utilities/draw
-> exact field champion when tracked club is not champion
```

### 34.8 League/world evolution

```text
fixed prior World/League states + closed outcomes + draws
-> exact cycle candidates
-> league strength candidate
-> development/medical quality candidates
-> quantized atomic next state
```

### 34.9 Mobility boundary

```text
fixed ranking + mobility rule
-> exact MobilityTransitionRequest
-> no membership/fact before policy response
```

No golden de pool/aplicación puede aprobarse antes de DR-065.

## 35. Monte Carlo

### 35.1 SMOKE

Orden de magnitud: decenas a pocos cientos de seeds por profile.

Recolecta:

- bounds e invariantes;
- ranks/champions válidos;
- TeamMinutesOpportunity;
- progression sin rounds fantasma;
- manager change;
- stream isolation;
- no identity floors.

### 35.2 CALIBRATION

Orden de magnitud: miles a decenas de miles de seasons/careers por segmento.

Recolecta:

- strength autocorrelation;
- title concentration/rank volatility;
- advancement/upsets;
- cross-competition correlation;
- manager turnover;
- congestion/pressure;
- league/world drift;
- player-contribution sensitivity.

### 35.3 DEEP

Orden de magnitud: cientos de miles o el tier aprobado por seed set.

Recolecta:

- P99/P99.9;
- carreras multi-década;
- dominant eras, collapses y emergent rises;
- extremes de league strength;
- manager churn/tenure tails;
- movilidad una vez cerrada DR-065;
- estabilidad numérica y replay.

Los counts concretos viven en `CalibrationSeedSet`; no son regla de gameplay.

## 36. Cierre de decisiones G3C-6

| ID | Estado | Familia cerrada | Calibración/policy pendiente |
|---|---|---|---|
| G3B-F05 | `PARTIAL_CALIBRATION` | noisy utility rank para liga; logistic/Bernoulli por phase; support/contribution y shocks compartidos | valores, definitions, targets/goldens |
| G3B-F06 | `PARTIAL_CALIBRATION` | rank -> candidate -> `MobilityTransitionRequest` determinista | DR-065: pool, identidad, aplicación y continuidad |
| G3B-J02 | `PARTIAL_CALIBRATION` | factor hierarchy Normal global/regional/league/club/competition/specific | loadings, sigmas y targets |
| G3B-J03 | `PARTIAL_CALIBRATION` | AR(1) en logit para club/league/institutional states | means, persistence, coefficients y targets |
| G3B-J04 | `PARTIAL_CALIBRATION` | ciclos continuos jerárquicos AR(1), sin régimen guionado | persistence, amplitudes, correlaciones y evidence targets |

No queda una familia matemática o sampler abierto en estas cinco filas.
G3B-F06 conserva un blocker de policy/data, no de matemática local.

## 37. Blockers después de G3C-7

- G3C-7 consume financialPower, position/club context y world cycles mediante
  snapshots/adapters, sin reabrir estas ecuaciones;
- DR-065 debe resolverse antes de implementar movilidad/continuidad del slice;
- DR-025 debe suministrar identidades y sources;
- DR-021 debe cerrar label/fecha inicial, extrapolación e international/market
  calendar boundaries;
- los parameter values y targets de esta especificación requieren aprobación;
- Selection/Awards/Scoring conservan sus matemáticas propias.

### Adapter G3C-8 — selección nacional y fields

World expone `worldTalentCycle`, gameplay competition context y factors de era
al producer nacional. National Team mantiene attack/defense/control y
generation strength propios mediante los AR(1) de ADR-077; no reutiliza
`ClubState` ni crea `NationalTeamOverall`.

Los group/league-style outcomes reutilizan noisy utility + canonical rank. Los
knockouts reutilizan logistic advancement + `BinomialInverseCdfV1`. El support
field excluye al protagonista y `NationalPlayerCompetitiveContribution` solo
usa Performance/minutos internacionales. `SelectionCompetitionField` y los
fields de Awards reciben world factors por snapshot/reference, no por draws
incidentales compartidos.

Este adapter no decide Definitions, participants, dates o sporting nationality
pendientes en DR-021/025/068. Véase
[`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](NATIONAL_TEAM_AWARDS_MATH_SPEC.md).

## 38. Referencias

- [Mathematical Calibration Contract](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Club, Competition & World structural spec](CLUB_COMPETITION_WORLD_SPEC.md)
- [Role & Minutes Math](ROLE_MINUTES_MATH_SPEC.md)
- [Performance Math](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
- [Health Math](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)
- [Transfers, Market & Contracts Math](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
- [Facts & Scoring](SCORING_FACTS_SPEC.md)
- [ADR-022](adr/022-club-competition-world-model.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-072](adr/072-role-minutes-and-availability-mathematics.md)
- [ADR-073](adr/073-performance-production-form-mathematics.md)
- [ADR-074](adr/074-health-injury-recovery-mathematics.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)
- [DR-021](DECISIONS_REQUIRED.md#dr-021--calendario-fecha-inicial-y-evolución-de-formatos)
- [DR-022](DECISIONS_REQUIRED.md#dr-022--modelo-agregado-de-competiciones-y-mundo)
- [DR-065](DECISIONS_REQUIRED.md#dr-065--scope-competitivo-pools-externos-y-continuidad-fuera-del-tier)

## 47. Adapter de Scoring cerrado por G3C-11

Scoring consume outcomes cerrados y attribution facts por competition edition.
PTC/PSN usan definitions de Scoring, no `LeagueCompetitiveStrength`, team
utility ni gameplay field strength. `IJL` permanece congelado en el contexto
competitivo. DR-066/067 siguen siendo el owner de registration/eligibility;
ante ausencia del fact requerido Scoring bloquea el cálculo oficial y nunca lo
infiere. No se modifica el outcome model.
