# Especificación matemática de selección nacional y premios

## 1. Estado, autoridad y alcance

- Estado: **G3C-8 — cierre matemático; calibración/data/policies pendientes**.
- Fecha: 2026-08-01.
- Decisiones G3B cerradas matemáticamente: G3B-H01–H04 y G3B-I02–I04.
- DR relacionadas: DR-008, DR-010, DR-021, DR-025, DR-049, DR-055,
  DR-056, DR-059, DR-060, DR-061, DR-063 y DR-068.
- ADR: [ADR-059](adr/059-national-team-model.md),
  [ADR-060](adr/060-awards-model.md),
  [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md),
  [ADR-072](adr/072-role-minutes-and-availability-mathematics.md),
  [ADR-073](adr/073-performance-production-form-mathematics.md),
  [ADR-075](adr/075-club-competition-world-mathematics.md) y
  [ADR-077](adr/077-national-team-awards-mathematics.md).

Este documento elige ecuaciones, distribuciones, samplers, orden causal,
streams, invariantes y requisitos de calibración para National Team y Awards.
No asigna valores de balance, no implementa gameplay y no cierra:

- nacionalidad deportiva o transitions de elegibilidad de DR-068;
- catálogo/IDs/formats/sources todavía abiertos en DR-025;
- fechas/cursor internacionales pendientes en DR-021;
- reputación, retiro o scoring;
- valores de `EngineParameterSet`, targets observacionales o hashes de goldens.

Aplican sin excepción las primitivas, binary64 atómico, cuantización
`ROUND_HALF_EVEN`, claves de azar y samplers de
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md).
Awards no lee scoring ni usa azar de scoring.

## 2. Convenciones comunes

Para un estado unitario persistido `s ∈ integer[0,10000]`:

```text
unit(s)   = s / 10000
center(s) = 2 * unit(s) - 1
center01(x) = 2 * x - 1       // para x ∈ [0,1]
latent(s) = logitSafe(unit(s))
```

Los predictores latentes son `binary64` finitos. `sigmoid`, `softplus`,
`stableSoftmax`, `safeLog`, `safeExp` y `logitSafe` son las versiones
normativas de ADR-070. Un valor persistido vuelve por:

```text
quantizeUnit(x) = ROUND_HALF_EVEN(10000 * clampLogical(x, 0, 1))
```

El clipping solo preserva dominios lógicos. Overflow, `NaN`, `Infinity`, `-0`
canónico o ParameterSet inválido producen error tipado; no se reemplazan por
un outcome editorial.

Factores Standard Normal usan `StandardNormalInverseCdfV1`. Bernoulli usa
`BinomialInverseCdfV1(1,p)`. Categorías usan
`CategoricalCumulativeMidpointV1`. Conteos NB2 usan exactamente
`NegativeBinomial2InverseCdfV1` con la parametrización de G3C-4:

```text
E[Y]   = mu
Var[Y] = mu + mu^2 / kappa
mu >= 0; kappa > 0
```

Casos lógicamente determinados no consumen RNG.

# Parte A — National Team Mathematics

## 3. Pipeline y estados propietarios

El orden normativo es:

```text
NationalTeamEligibility
→ CandidateSnapshot
→ SelectionCompetitionField
→ CallUp
→ TournamentSquad (solo si Definition lo exige)
→ InternationalRole
→ InternationalMinutes
→ InternationalPerformance
→ NationalPlayerCompetitiveContribution
→ NationalCompetitionOutcome
→ future NationalTeamState / Incumbency
```

No hay dependencia desde InternationalPerformance de una ventana hacia su
propia convocatoria, rol o minutos. Los inputs dinámicos son snapshots
cerrados anteriores al resolver.

Estado persistido mínimo:

- `NationalTeamState`: attack/defensive/control strength;
- `NationalGenerationStrength` por `PositionCode` o perfil declarado;
- `NationalTeamIncumbency` del protagonista por selección/contexto;
- historial de call-ups, squads, role, minutos, Performance y achievements;
- progression state de competiciones internacionales.

`SelectionCompetitionField`, candidate signal, support field, relative signal,
team utility y player contribution son derivados/snapshots auditables, no
traits del jugador.

## 4. Elegibilidad internacional

`NationalTeamEligibility` es resuelta por el owner de DR-068 y entrega:

```text
eligibilityStatus:
  ELIGIBLE | REQUIRES_PRIOR_TRANSITION | INELIGIBLE_CURRENT_STATE
nationalTeamId
positionEligibility
ruleVersion / evidenceRefs
```

Solo `ELIGIBLE` permite continuar. En otro estado:

```text
P(callUp) = 0
callUp = false
```

No se construye field para ese jugador, no se samplea call-up/squad y no se
consume RNG. La ausencia o ambigüedad de datos no se convierte en
inelegibilidad inferida: produce error/pending policy tipado. Esta matemática
no decide nacionalidad deportiva argentina ni cambios de elegibilidad.

## 5. CandidateSnapshot y señal de mérito

### 5.1 Inputs autorizados

El resolver recibe un snapshot purpose-scoped:

- `perceivedSportingQuality ∈ [-1,1]` y `knowledgeReliability ∈ [0,1]`;
- `selectionPerformanceSignal ∈ [-1,1]` de PerformanceSummary cerrado;
- `evidenceStrength ∈ [0,1]`;
- `contextualProductionResidual ∈ [-1,1]`, position-specific;
- club usage/minutes y effective/dominant position del período;
- gameplay competition/club/league context, nunca IJL;
- `SportingReputation ∈ [0,1]` del snapshot anterior autorizado;
- age/context mediante bases suaves;
- health `availabilityShare ∈ [0,1]`;
- positional need e incumbency, consumidas después por call-up.

No lee MarketValue, TransferFee, Salary, CareerScore, PublicReputation por
defecto, hidden TrueCapabilities o traits no observables. `PlayerKnowledge`
debe autorizar cualquier estimate de calidad/potencial.

### 5.2 Transformaciones

```text
qualityEvidence = perceivedSportingQuality * knowledgeReliability
usageEvidence   = -expm1(-clubActualMinutes / tauSelectionUsage[position])
performanceEvidence = evidenceStrength * selectionPerformanceSignal
productionEvidence  = evidenceStrength * contextualProductionResidual
```

`tauSelectionUsage[position] > 0`. La edad usa un vector de bases suaves
versionado, por ejemplo sigmoid/RBF finite bases, no thresholds:

```text
ageBasis_k(age, position) = sigmoid((age - knot[k,position]) / scale[k,position])
scale[k,position] > 0
```

### 5.3 Ecuación

Para profile de selección `p` y posición efectiva `x`:

```text
candidateMerit = b[p,x]
  + betaQuality[p,x]     * qualityEvidence
  + betaPerformance[p,x] * performanceEvidence
  + betaProduction[p,x]  * productionEvidence
  + betaUsage[p,x]       * center01(usageEvidence)
  + betaContext[p,x]     · contextFeatures
  + betaSportRep[p,x]    * center01(sportingReputation)
  + betaAge[p,x]         · ageBasis(age,x)
  + betaInteraction[p,x] · authorizedInteractions
```

`candidateMerit ∈ R` es centrado/no acotado. Todos los feature IDs, weights e
interactions forman parte del ParameterSet. Cada feature lleva `evidenceKey`;
el validador rechaza dos rutas que representan el mismo hecho (por ejemplo,
un título como achievement y reputación generada por ese mismo título dentro
del mismo snapshot).

Availability, positional need e incumbency no se incluyen en `candidateMerit`:
entran una sola vez en call-up para evitar doble contabilización.

## 6. SelectionCompetitionField

### 6.1 Distribución concreta

El field por `nationalTeamId × position × selectionContext × edition` es una
mezcla gaussiana de dos componentes:

```text
Core  ~ Normal(location, scale^2)
Elite ~ Normal(location + tailUplift * scale,
               (tailScale * scale)^2)

tailWeight = sigmoid(tailWeightPredictor)
scale       = softplus(logScalePredictor) + epsilonField
tailUplift  = softplus(tailUpliftRaw)
tailScale   = safeExp(logTailScale)
```

Los cuatro predictores son inequívocos:

```text
logScalePredictor = baseLogScale[country,position,context]
  + gammaScaleGeneration * center01(generationStrength)
  + gammaScaleWorld * center01(worldTalentCycle)
  + gammaScaleTactical · tacticalDemand

tailWeightPredictor = baseTailLogit[country,position,context]
  + gammaTailGeneration * center01(generationStrength)
  + gammaTailWorld * center01(worldTalentCycle)

tailUpliftRaw = baseTailUpliftRaw[position,context]
  + gammaUpliftWorld * center01(worldTalentCycle)

logTailScale = baseLogTailScale[position,context]
  + gammaTailScaleWorld * center01(worldTalentCycle)
```

`epsilonField > 0` es global/versionado. Los predictores consumen:

```text
location = baseLocation[country,position,context]
  + betaGeneration * center01(generationStrength)
  + betaWorld * center01(worldTalentCycle)
  + betaTactical · tacticalDemand
  + lambdaGenerationShared * Z_generationShared
  + sigmaField * Z_field
```

Scale y tail pueden usar los mismos contextos con sus propios coeficientes.
El field no materializa jugadores.

La media y varianza exactas son:

```text
mCore = location
mTail = location + tailUplift * scale

fieldMean = (1-w) * mCore + w * mTail
fieldVariance =
    (1-w) * (scale^2 + (mCore-fieldMean)^2)
  + w * ((tailScale*scale)^2 + (mTail-fieldMean)^2)
```

con `w = tailWeight` y `fieldVariance > 0`.

### 6.2 Profundidad y comparación

`effectiveDepth` y `availableSlots` son enteros positivos provistos por
Definition/context; deben cumplir `0 < availableSlots < effectiveDepth` para
un proceso competitivo. No se inventa tamaño si DR-025/021 no lo aporta.

```text
relativeCandidateSignal =
  (candidateMerit - fieldMean) / sqrt(fieldVariance)

capacityLogOdds = log(availableSlots / (effectiveDepth - availableSlots))
```

El field puede cambiar por país, posición, contexto, generación y edición. No
existe threshold de calidad ni una liga que produzca inelegibilidad.

## 7. Convocatoria y squad

### 7.1 Call-up

```text
etaCallUp = alphaCallUp[context,position]
  + betaRelative    * relativeCandidateSignal
  + betaNeed        * center01(positionalNeed)
  + betaIncumbency  * center01(incumbency)
  + betaImportance  * center01(windowImportance)
  + betaAvailability* center01(availabilityShare)
  + betaEvidence    * center01(evidenceStrength)
  + betaCapacity    * capacityLogOdds
  + betaCallContext · callContext

pCallUp = sigmoid(etaCallUp)
callUp  = BinomialInverseCdfV1(1, pCallUp, U_callup)
```

Para ParameterSet válido, `betaRelative`, `betaNeed`, `betaIncumbency`,
`betaAvailability`, `betaEvidence` y `betaCapacity` son no negativos. El
outcome sampleado no es monotónico. Excelencia no garantiza convocatoria y
availability cero no equivale necesariamente a inelegibilidad: la Definition
puede permitir convocatoria médica sin minutos.

### 7.2 Tournament squad

`SelectionMode` pertenece a CompetitionDefinition/Data:

```text
CALL_UP_ONLY | CALL_UP_THEN_SQUAD
```

En `CALL_UP_ONLY`, squad no existe y no consume RNG. En
`CALL_UP_THEN_SQUAD`, solo un convocado se evalúa:

```text
etaSquad = alphaSquad
  + gammaRelative * relativeCandidateSignal
  + gammaFit * tournamentTacticalFit
  + gammaNeed * center01(tournamentPositionNeed)
  + gammaIncumbency * center01(incumbency)
  + gammaAvailability * center01(availabilityShare)
  + gammaImportance * center01(tournamentImportance)
  + gammaCapacity * tournamentCapacityLogOdds

pSquad = sigmoid(etaSquad)
squad  = BinomialInverseCdfV1(1, pSquad, U_squad)
```

El CandidateSnapshot y field quedan congelados; no se recalculan entre pasos.

## 8. Incumbency

`NationalTeamIncumbency` pertenece a Selection, se persiste en `[0,10000]` y
evoluciona después de cerrar la oportunidad internacional:

```text
iSafe = epsilonState + (1-2*epsilonState) * unit(incumbencyStored)
iStar = logit(iSafe)

iStarNext = muIncumbency
  + phiIncumbency * (iStar - muIncumbency)
  + betaCalled * I(callUp)
  - betaOmitted * I(eligibleOpportunity and not callUp)
  + betaMinutes * internationalMinutesEvidence
  + betaPerformance * internationalPerformanceEvidence
  + betaContinuity * selectorContinuitySignal
  + sigmaIncumbency * Z_incumbency

incumbencyNext = quantizeUnit(sigmoid(iStarNext))
```

```text
internationalMinutesEvidence =
  -expm1(-actualInternationalMinutes / tauIncumbencyMinutes)

internationalPerformanceEvidence =
  evidenceStrengthInternational * nationalPerformanceSurprise
```

Constraints: `0 <= phiIncumbency < 1`, `tauIncumbencyMinutes > 0`, betas de
called/minutes/performance/continuity no negativas y `sigmaIncumbency >= 0`.
No hay cooldown, garantía de convocatoria o persistencia obligatoria. Una
omisión solo se aplica ante una oportunidad elegible realmente cerrada.

## 9. InternationalRole y minutos

### 9.1 Adapter del resolver común

Se reutiliza exactamente el resolver de
[`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md) mediante
`ParticipationContext = NATIONAL_TEAM`:

- roles ordenados: `BENCH < ROTATION < STARTER < KEY_PLAYER`;
- quality signal: proyección autorizada del CandidateSnapshot;
- trust signal: incumbency/selector trust, nunca club managerTrust;
- competition signal: adapter del SelectionCompetitionField por posición;
- previous performance: solo summary internacional cerrado;
- TacticalFit: selección/selector/tournament context;
- previous role/minutes: historial internacional;
- availability: unión exacta de intervalos del contexto internacional;
- opportunity: `InternationalTeamMinutesOpportunity`.

El softmax de role, matriz de transición completa, Logit-Normal de minuteShare,
expectation Gauss-Hermite, appearances/starts y cuantización half-even son los
de ADR-072. `roleMinutes.adapters.nationalTeam` contiene intercepts/coefficients
propios; `nationalTeam.roleMinutesProfileRef` referencia ese profile y no
duplica constantes.

### 9.2 Separación de contexto

```text
clubActualMinutes            != actualInternationalMinutes
club SportingRole            != InternationalRole
club managerTrust            != national incumbency
club TeamMinutesOpportunity  != InternationalTeamMinutesOpportunity
```

El resolver usa streams `role-minutes` con `participationContext=NATIONAL_TEAM`.
Performance usa streams `performance` con el mismo discriminante. Ningún draw
se comparte con club por coincidencia de season/window.

El calendario aporta match-equivalent opportunity, phase, pressure y schedule
context. G3C-8 no decide su fecha/cursor; si faltan, la resolución queda
bloqueada por DR-021, no se asume un valor.

## 10. NationalTeamState y generaciones

### 10.1 Generation strength

Por posición/profile:

```text
gStarNext = muGeneration[country,position]
  + phiGeneration[position]
      * (gStar - muGeneration[country,position])
  + betaWorldTalent[position] * center01(worldTalentCycle)
  + lambdaCountry[position] * Z_countryGeneration
  + sigmaPosition[position] * Z_positionGeneration

generationStrengthNext = quantizeUnit(sigmoid(gStarNext))
```

`0 <= phiGeneration < 1`. La identidad puede cambiar location, nunca crear un
floor. El state de Q/season previo alimenta el field futuro.

### 10.2 Team strengths

Attack, defense y control se mantienen separados. Para `d`:

```text
zNext[d] = muNational[d,country,worldContext]
  + phiNational[d] * (z[d] - muNational[d,country,worldContext])
  + betaGeneration[d] * center01(generationAggregate[d])
  + betaRecent[d] * recentNationalOutcomeSignal[d]
  + lambdaWorld[d] * Z_worldFootballCycle
  + lambdaSeason[d] * Z_nationalSeason
  + sigmaDimension[d] * Z_nationalDimension[d]

nationalStrengthNext[d] = quantizeUnit(sigmoid(zNext[d]))
```

`0 <= phiNational[d] < 1`. No existe `NationalTeamOverall` causal.

## 11. Support field, contribution y outcomes

`NationalTeamSupportField` excluye al protagonista. Para dimensión `d`:

```text
nationalSupportLogit[d] = latent(nationalStrength[d])
  + betaSelectorSupport[d] * center01(selectorQuality)
  + sum_k(betaTacticalSupport[d,k] * center01(tacticalIdentity[k]))
  + betaGenerationSupport[d] * center01(generationAggregate[d])
  + betaDifficultySupport[d] * center01(scheduleDifficulty)
  + lambdaTournamentSupport[d] * Z_tournamentShared
  + sigmaSupportSpecific[d] * Z_nationalSupport[d]

nationalSupport[d] = sigmoid(nationalSupportLogit[d])
```

`NationalPlayerCompetitiveContribution` reutiliza el adapter de G3C-6 pero
solo con:

- international minutes/team opportunity;
- InternationalPerformance contextual/evidence;
- effectivePosition internacional;
- production residual internacional;
- competition/phase context.

No usa club contribution, MarketValue o CareerScore.

Para group/league-style formats:

```text
expectedUtility[n] = nationalUtilityIntercept[competitionProfile]
  + sum_d(nationalSupportWeight[competitionProfile,d]
          * center01(nationalSupport[n,d]))
  + betaContribution[competitionProfile] * playerContribution[n]
  + betaContext[competitionProfile] · competitionContext[n]

realizedUtility[n] = expectedUtility[n]
  + lambdaTournament * Z_tournamentShared
  + sigmaTeam * Z_team[n]

ranking = canonicalSortDescending(realizedUtility, nationalTeamId)
```

Para knockout se reutiliza sin cambios el proceso G3C-6:

```text
etaAdvance = teamUtility
  + betaContribution * playerContribution
  - opponentFieldStrength
  + betaPhase · phaseContext

pAdvance = sigmoid(etaAdvance)
advance  = BinomialInverseCdfV1(1, pAdvance, U_round)
```

El factor de torneo se comparte por referencia; el outcome de ronda tiene draw
específico. Contribución positiva aumenta la expectativa cuando su beta es no
negativa, pero nunca determina el outcome. No se simulan squads completos ni
fixtures si la Definition no los necesita.

## 12. Streams de National Team

Root namespace: `national-team`.

| Purpose | Contexto estable | Distribución |
|---|---|---|
| `generation.country` | career/country/season | Normal V1 |
| `generation.position` | career/country/position/season | Normal V1 |
| `selection-field.shared` | career/team/context/edition | Normal V1 |
| `selection-field.specific` | career/team/position/context/edition | Normal V1 |
| `call-up` | career/player/team/window/occurrence | Bernoulli V1 |
| `tournament-squad` | career/player/team/competition/edition | Bernoulli V1 |
| `incumbency-update` | career/player/team/window | Normal V1 |
| `national-state.season` | career/team/season | Normal V1 |
| `national-state.dimension` | career/team/dimension/season | Normal V1 |
| `tournament.shared` | career/competition/edition | Normal V1 |
| `group-team` | career/competition/edition/team | Normal V1 |
| `knockout-round` | career/competition/edition/team/round | Bernoulli V1 |

Role/Minutes y Performance conservan sus namespaces originales con adapter
NATIONAL_TEAM. Agregar un premio, posición o competición no cambia keys no
relacionadas.

# Parte B — Awards Mathematics

## 13. AwardDefinition matemática

Cada `AwardDefinition` versionada declara:

```text
awardId
evaluationFamily: COMPARATIVE_JUDGED | STATISTICAL
evaluationWindow / timingPolicy
eligibilityPredicateRef
positionScope: POSITION_SPECIFIC | POSITION_GROUP | POSITION_AGNOSTIC
allowedFeatureIds + evidenceKeyPolicy
evaluationProfileRef
fieldModelRef
fieldSize
ordinalCutoffs
tiePolicy
statisticFactType (solo STATISTICAL)
reputation/history permissions
```

El catálogo pertenece a data/content versionada, no al ParameterSet. DR-025
permanece abierta donde falten Definitions, IDs, scope o sources. Un profile
referenciado debe existir en `EngineParameterSet.awards`.

## 14. Eligibility y timing

Eligibility se evalúa sobre facts cerrados antes de cualquier field/draw. Si
falla:

```text
eligible = false
placement = absent
```

No se samplea player judging, field o estadísticas. No existe un mínimo global
de edad, minutos, production o títulos; cualquier requisito real vive en la
Definition.

La edición solo se resuelve cuando `evaluationWindow` y los facts requeridos
están cerrados. El snapshot de reputación es anterior a la edición. `AwardWon`
de la edición actual no puede regresar a su propia utility.

## 15. Comparative judged utility

### 15.1 Features

El `AwardCandidateSnapshot` puede incluir, cuando la Definition lo autoriza:

- dimensiones de UnderlyingPerformance/summary purpose-scoped por posición;
- production residual contextual, no raw goals universales;
- evidence/exposure;
- pressure performance;
- club/international achievement signals de facts cerrados;
- gameplay competition context, no IJL/scoring values;
- Sporting/PublicReputation lagged y solo para awards que lo declaran;
- prior award history solo para profiles que lo declaran.

GK usa shotStopping/command/distribution; CM progression/creative/control/
defensive impact; ST attacking/creative/off-ball/pressing plus production
relevante. No se crean stats nuevos para Awards. Errors/penalties GK no pueden
ser features mientras DR-055/Data no los autoricen; distribution puede ser
UnderlyingPerformance comparativa sin stat observable.

### 15.2 Ecuación

Para profile `p` y scope posicional `x`:

```text
awardMerit = intercept[p,x]
  + sum_f weight[p,x,f] * feature[f]
  + sum_h interaction[p,x,h] * interactionFeature[h]

playerJudgedUtility = awardMerit
  + sigmaPlayerJudging[p] * Z_playerJudging
```

Features se normalizan a `[-1,1]` mediante transforms versionados. Los signs
esperados de performance/evidence/achievement son no negativos para profiles
que los permiten. Un `evidenceKey` puede entrar una sola vez. MarketValue y
CareerScore están prohibidos.

## 16. Comparative AwardCompetitionField

La Definition aporta `N = fieldSize`, entero `N >= 1`. El field de edición:

```text
fieldLocation = baseLocation[fieldProfile]
  + betaWorld * center01(worldTalentField)
  + betaEra * eraFeatures
  + betaCompetition * competitionContext
  + betaPosition * positionContext
  + sigmaEdition * Z_fieldEdition

fieldScale = softplus(
    baseLogScale[fieldProfile]
  + gammaWorld * center01(worldTalentField)
  + gammaContext · fieldContext
) + epsilonField
```

Para cada abstract competitor `i = 0..N-1`:

```text
competitorMerit[i] = fieldLocation
  + fieldScale * Z_competitorMerit[i]

competitorUtility[i] = competitorMerit[i]
  + sigmaCompetitorJudging[fieldProfile] * Z_competitorJudging[i]
```

Se consumen exactamente `2N` Normal draws, además del draw opcional de edición
y el del jugador según profile. Competidores no tienen identidad, historia ni
facts propios.

## 17. Proceso ordinal único

El jugador y los `N` competitors se ordenan una sola vez por utility
descendente. `playerPlacement` es 1-based dentro de `N+1` candidatos. La
Definition valida:

```text
1 <= placementCutoff <= shortlistCutoff <= nominationCutoff <= N+1
```

Los estados se derivan, nunca se samplean por separado:

```text
winner      := playerPlacement == 1 (según tiePolicy)
placed      := playerPlacement <= placementCutoff
shortlisted := playerPlacement <= shortlistCutoff
nominated   := playerPlacement <= nominationCutoff
```

Así, winner implica placement/shortlist/nomination cuando la Definition los
expone. La ausencia de una fase visible no altera el rank subyacente.

## 18. Tie policy

Taxonomía mínima:

```text
UNIQUE_CANONICAL
SHARED
STATISTICAL_SECONDARY_KEYS
```

- `UNIQUE_CANONICAL`: utilities iguales según representación canónica se
  ordenan por `SHA-256("award-tie-v1" || awardEditionId || candidateKey)`
  ascendente. Para abstract competitors, `candidateKey = abstract:{index}`.
- `SHARED`: iguales comparten dense rank; puede haber multiple winners si el
  rank uno es compartido.
- `STATISTICAL_SECONDARY_KEYS`: se comparan métricas reales, orden y dirección
  declarados por la Definition; si continúa el empate, usa canonical hash.

No hay RNG de desempate. Tie policy es data/version, no un threshold de
balance.

## 19. Statistical awards

V1 cierra `COUNT_NB2` para premios basados en un count observable autorizado.
El count real del protagonista no se resamplea.

```text
logFieldMean = baseLogMean[statisticalProfile]
  + betaCompetition * competitionContext
  + betaEra * eraFeatures
  + betaFieldQuality * center01(fieldQuality)
  + sigmaEdition * Z_statEdition

fieldKappa = softplus(logKappa[statisticalProfile]) + epsilonDispersion
```

Para `i = 0..N-1`:

```text
logMu[i] = logFieldMean
  + sigmaCompetitorHeterogeneity * Z_statHeterogeneity[i]
mu[i] = safeExp(logMu[i])

competitorCount[i] ~ NB2(mu[i], fieldKappa)
```

Cada competitor usa una Normal de heterogeneidad y un uniform NB2, con index
estable. El rank compara `playerObservedCount` contra los abstract counts y
aplica la tie policy de la Definition.

Top scorer/top assist y cualquier GK award realmente estadístico usan este
profile solo si su fact type existe. Un award de distribución/shot-stopping es
comparativo salvo que una Definition publique otra estadística autorizada. Un
rate, composite o mixed award futuro requiere nuevo calculation profile
versionado; no se infiere desde `COUNT_NB2`.

## 20. Múltiples premios, historia y facts

Cada award edition usa context/streams propios. Un jugador puede ganar
múltiples premios compatibles. Awards no aplica equivalence, anti-duplication,
caps ni puntos; eso pertenece a Scoring.

Facts canónicos:

- `AwardNominated` cuando la Definition expone nomination;
- `AwardPlacementRecorded` cuando placement tiene consumer;
- `AwardWon` para cualquier family;
- `NationalTeamCallUpIssued`, `TournamentSquadSelected` e
  `InternationalRoleAssigned` para Selection;
- minutos, Performance y Competition facts reutilizan los genéricos con
  `contextType=NATIONAL_TEAM`.

Eligibility, candidate signal, field draws y `AwardEditionResolved` son
internal signal/derived summary según
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md). No se crean aliases como
`StatisticalAwardWon`, `InternationalMinutesRecorded` o
`InternationalPerformanceRecorded`.

## 21. Streams de Awards

Root namespace: `awards`.

| Purpose | Contexto estable | Distribución |
|---|---|---|
| `comparative.field-edition` | career/award/edition/profile | Normal V1 |
| `comparative.player-judging` | career/player/award/edition | Normal V1 |
| `comparative.competitor-merit` | career/award/edition/index | Normal V1 |
| `comparative.competitor-judging` | career/award/edition/index | Normal V1 |
| `statistical.field-edition` | career/award/edition/profile | Normal V1 |
| `statistical.heterogeneity` | career/award/edition/index | Normal V1 |
| `statistical.competitor-count` | career/award/edition/index | NB2 V1 |

Ranking y tie-break consumen cero RNG. Agregar otra award edition no desplaza
draws. Si dos awards comparten un world factor, ambos lo referencian mediante
su fact/context key; no comparten incidentalmente sus shocks específicos.

# Parte C — ParameterSet, invariantes y validación

## 22. `EngineParameterSet.nationalTeam`

Todo parámetro usado arriba debe aparecer en el manifest:

| Grupo | Contenido | Clasificación |
|---|---|---|
| `candidate.transforms` | taus, feature transforms, age knots/scales | INITIAL_CALIBRATION_REQUIRED |
| `candidate.coefficients` | intercepts, weights e interactions por profile/position | INITIAL_CALIBRATION_REQUIRED |
| `selectionField.location` | baselines y world/generation/tactical loadings | INITIAL_CALIBRATION_REQUIRED |
| `selectionField.scaleTail` | scales, tail weights/uplift/scale, epsilon | INITIAL_CALIBRATION_REQUIRED; epsilon STRUCTURAL_FIXED |
| `selectionField.depthProfiles` | refs/default constraints, no calendar data | INITIAL_CALIBRATION_REQUIRED |
| `callUp` | intercepts, coefficients y context profiles | INITIAL_CALIBRATION_REQUIRED |
| `squad` | coefficients y tournament profiles | INITIAL_CALIBRATION_REQUIRED |
| `incumbency` | mu, phi, betas, tau y sigma | INITIAL_CALIBRATION_REQUIRED |
| `roleMinutesProfileRef` | adapter/ref a roleMinutes | STRUCTURAL_FIXED ref; values INITIAL_CALIBRATION_REQUIRED |
| `generation` | mu, phi, world loadings y sigmas | INITIAL_CALIBRATION_REQUIRED |
| `teamStrength` | mu, phi, generation/recent/world loadings y sigmas | INITIAL_CALIBRATION_REQUIRED |
| `supportField` | vector transforms/loadings | INITIAL_CALIBRATION_REQUIRED |
| `contribution` | international adapter coefficients | INITIAL_CALIBRATION_REQUIRED |
| `competition` | group/knockout adapters y shock sigmas | INITIAL_CALIBRATION_REQUIRED |
| `streams` | namespace/purpose schema | STRUCTURAL_FIXED |

Signs/constraints de monotonicidad, enum ordering, formulas y sampler IDs son
`STRUCTURAL_FIXED`; valores de balance son `INITIAL_CALIBRATION_REQUIRED`.
Sensitivities no esenciales después del baseline pueden marcarse
`TUNABLE_LATER`, pero no quedar ausentes.

Manifest exhaustivo mínimo:

```text
nationalTeam {
  candidate {
    tauSelectionUsage[position]
    ageKnots[position,k]
    ageScales[position,k]
    intercept[profile,position]
    betaQuality / betaPerformance / betaProduction / betaUsage
    betaContext[feature] / betaSportRep / betaAge[k]
    betaInteraction[interaction]
  }
  selectionField {
    baseLocation[country,position,context]
    betaGeneration / betaWorld / betaTactical[feature]
    lambdaGenerationShared / sigmaField
    baseLogScale[country,position,context]
    gammaScaleGeneration / gammaScaleWorld / gammaScaleTactical[feature]
    baseTailLogit[country,position,context]
    gammaTailGeneration / gammaTailWorld
    baseTailUpliftRaw[position,context] / gammaUpliftWorld
    baseLogTailScale[position,context] / gammaTailScaleWorld
    epsilonField
  }
  callUp {
    alpha[context,position]
    betaRelative / betaNeed / betaIncumbency / betaImportance
    betaAvailability / betaEvidence / betaCapacity
    betaContext[feature]
  }
  squad {
    alpha / gammaRelative / gammaFit / gammaNeed / gammaIncumbency
    gammaAvailability / gammaImportance / gammaCapacity
  }
  incumbency {
    epsilonState / mu / phi / betaCalled / betaOmitted
    betaMinutes / betaPerformance / betaContinuity
    tauMinutes / sigma
  }
  roleMinutesProfileRef
  generation {
    epsilonState / mu[country,position] / phi[position]
    betaWorldTalent[position] / lambdaCountry[position]
    sigmaPosition[position]
  }
  teamStrength {
    epsilonState / mu[dimension,country,context] / phi[dimension]
    betaGeneration[dimension] / betaRecent[dimension]
    lambdaWorld[dimension] / lambdaSeason[dimension]
    sigmaDimension[dimension]
  }
  support {
    betaSelector[dimension]
    betaTactical[dimension,feature]
    betaGeneration[dimension] / betaDifficulty[dimension]
    lambdaTournament[dimension] / sigmaSpecific[dimension]
  }
  contributionProfileRef
  competition {
    utilityIntercept[profile]
    supportWeight[profile,dimension]
    betaContribution[profile]
    betaContext[profile,feature]
    lambdaTournament / sigmaTeam
    knockoutContextCoefficients[profile,feature]
  }
  streamModelIds
}
```

## 23. `EngineParameterSet.awards`

| Grupo | Contenido | Clasificación |
|---|---|---|
| `featureTransforms` | normalización purpose/position-specific | INITIAL_CALIBRATION_REQUIRED |
| `candidateProfiles` | intercepts, weights, interactions, evidence keys | INITIAL_CALIBRATION_REQUIRED |
| `positionProfiles` | GK/CM/ST matrices y task mappings | INITIAL_CALIBRATION_REQUIRED |
| `comparativeField` | location/scale/context/world coefficients y epsilon | INITIAL_CALIBRATION_REQUIRED; epsilon STRUCTURAL_FIXED |
| `judging` | player/competitor sigmas por profile | INITIAL_CALIBRATION_REQUIRED |
| `statisticalField` | log means, context coefficients, kappa, heterogeneity | INITIAL_CALIBRATION_REQUIRED |
| `historyReputation` | coefficients solo para profiles autorizados | TUNABLE_LATER / INITIAL según catálogo |
| `streams` | namespace/purpose/index schema | STRUCTURAL_FIXED |
| `samplers` | Normal/NB2 IDs y tie algorithm version | STRUCTURAL_FIXED |

Field size, ordinal cutoffs, allowed features, tie policy, eligibility y award
catalog values pertenecen a `AwardDefinition`/dataVersion, no al ParameterSet.
Los puntos pertenecen exclusivamente a scoringVersion/config.

Manifest exhaustivo mínimo:

```text
awards {
  featureTransforms[featureId] {
    transformFamily / location / scale / signedDirection
  }
  candidateProfiles[profile,positionScope] {
    intercept
    weight[featureId]
    interaction[interactionId]
    allowedEvidenceKeyPolicy
    sigmaPlayerJudging
  }
  positionTaskMappings[profile,GK|CM|ST]
  comparativeField[fieldProfile] {
    baseLocation
    betaWorld / betaEra[feature] / betaCompetition[feature]
    betaPosition[feature] / sigmaEdition
    baseLogScale / gammaWorld / gammaContext[feature]
    epsilonField / sigmaCompetitorJudging
  }
  statisticalField[profile] {
    baseLogMean
    betaCompetition[feature] / betaEra[feature] / betaFieldQuality
    sigmaEdition / logKappa / epsilonDispersion
    sigmaCompetitorHeterogeneity
  }
  historyReputation[profile,feature]
  streamModelIds
  normalSamplerId
  negativeBinomialSamplerId
  tieAlgorithmVersion
}
```

## 24. Invariantes de National Team

1. Un jugador no elegible no puede ser convocado y consume cero RNG.
2. Call-up no implica squad, role ni minutos.
3. Club y selección no comparten role, trust, opportunity, minutes o stats.
4. MarketValue y CareerScore nunca entran en Selection.
5. No se accede a hidden TrueCapabilities sin conocimiento autorizado.
6. No existe threshold de calidad ni inferencia de nacionalidad.
7. Probabilidades son finitas y pertenecen a `[0,1]`.
8. Mayor relative signal/need/incumbency/availability no reduce la probabilidad
   esperada de call-up con inputs fijos y ParameterSet válido.
9. Incumbency no garantiza futuras convocatorias.
10. Player contribution no determina absolutamente un torneo.
11. Performance internacional actual no altera su propia selección/minutos.
12. Mismo seed/context/params/data produce exactamente el mismo resultado.

Las monotonicidades son de expectativa, no del outcome sampleado.

## 25. Invariantes de Awards

1. Un jugador inelegible no tiene placement y consume cero RNG.
2. Comparative y Statistical usan procesos separados.
3. Un único rank produce nomination/shortlist/placement/winner coherentes.
4. Placement del protagonista es único por award edition, salvo semántica de
   rank compartido declarada.
5. Winner implica estados ordinales anteriores expuestos por Definition.
6. Múltiples awards compatibles están permitidos.
7. Awards no aplica anti-duplication, puntos o caps de scoring.
8. MarketValue y CareerScore nunca entran en utility.
9. GK/CM/ST usan matrices/performance dimensions propias.
10. El award actual no consume reputación creada por su propio outcome.
11. El count estadístico real no se resamplea ni reescribe.
12. Tie-break canónico consume cero RNG.
13. Mismo seed/context/params/data produce exactamente el mismo outcome.

## 26. CalibrationTargets — National Team

| Clase | Métrica | Segmentación mínima | Fuente/estado |
|---|---|---|---|
| INVARIANT | ineligible call-up rate = 0 | rule status | diseño |
| INVARIANT | club/national minutes separation | context | diseño |
| CALIBRATION_TARGET | call-up/debut frequency | country, position, age band, context | evidencia externa |
| CALIBRATION_TARGET | incumbent persistence/omission | position, window importance | evidencia + diseño |
| CALIBRATION_TARGET | InternationalRole/minuteShare | role, position, competition | evidencia externa |
| CALIBRATION_TARGET | field location/scale/tail/depth | country, position, era | evidencia externa |
| CALIBRATION_TARGET | generation autocorrelation | country, position, era | evidencia + diseño |
| CALIBRATION_TARGET | tournament success/upsets | competition, era | evidencia externa |
| DIAGNOSTIC | club Performance→call-up | performance/evidence quantile | causal |
| DIAGNOSTIC | need→call-up sensitivity | position field | causal |
| DIAGNOSTIC | national Performance→future incumbency | exposure/evidence | causal |
| DIAGNOSTIC | contribution→national outcome | phase/context | causal |
| DIAGNOSTIC | elite omission / breakout call-up | tails | filosofía de diseño |

Observar P90/P95/P99/P99.9 cuando el sample size lo permita: muy joven/viejo,
superstar omitido, low-profile breakout, career internacional larga y
generation collapse/rise. Se calibran probabilidades, no se cortan colas.

## 27. CalibrationTargets — Awards

| Clase | Métrica | Segmentación mínima | Fuente/estado |
|---|---|---|---|
| INVARIANT | ineligible placement rate = 0 | award/profile | diseño |
| INVARIANT | ordinal coherence | award/tie policy | diseño |
| CALIBRATION_TARGET | nominations/placements/wins | award, position, age, era | evidencia externa |
| CALIBRATION_TARGET | repeat winners/concentration/droughts | award family, era | evidencia externa |
| CALIBRATION_TARGET | position representation | global/positional, GK/CM/ST | evidencia + diseño |
| CALIBRATION_TARGET | club/league/context representation | award profile | evidencia externa |
| CALIBRATION_TARGET | performance/achievement correlation | judged profile | evidencia + diseño |
| CALIBRATION_TARGET | statistical leader distribution | competition/stat type | evidencia externa |
| CALIBRATION_TARGET | outsider/upset wins | award/era | diseño + evidencia |
| CALIBRATION_TARGET | multiple-award seasons | compatible definitions | evidencia externa |
| DIAGNOSTIC | judged vs statistical correlation | competition/position | causal |
| DIAGNOSTIC | elite performance without award | field strength quantile | tails |
| DIAGNOSTIC | GK/CM global judged wins | era/field | tails |

Se observan winners históricos repetidos, outsider winners, múltiples majors,
statistical extreme sin judged win y award droughts. Ningún cap corrige esas
colas.

## 28. Golden vectors requeridos

### 28.1 National Team

1. **Candidate signal:** features/params fijos → transforms, cada término,
   evidence keys y mérito exacto.
2. **Field:** params y Z conocidos → location/scale/tail, mean, variance y
   relative signal exactos.
3. **Call-up:** predictor, probability y uniform conocidos → outcome exacto.
4. **Eligibility impossible:** cero call-up y trace confirma cero draws.
5. **Squad:** Definition CALL_UP_ONLY vs CALL_UP_THEN_SQUAD → consumo/outcome.
6. **Incumbency:** prior, facts, params y Z → latent/quantized next state.
7. **International role/minutes:** adapter, inputs y draws → utilities,
   probabilities, role, share/minutes/appearances exactos.
8. **National outcome:** strengths/support/contribution/field/draw → rank o
   advance exacto.
9. **Context separation:** mismo player en CLUB/NATIONAL_TEAM → keys y outputs
   distintos.

### 28.2 Awards

1. **Judged utility:** fixed performance/achievement/context → merit y utility.
2. **Comparative field:** `N`, params y `2N+1` draws → utilities exactas.
3. **Placement:** player/competitor utilities → rank y ordinal states exactos.
4. **Statistical field:** fixed player count, params, Z/uniforms → counts/rank.
5. **Tie:** un fixture por policy → winner/shared rank exacto, cero tie RNG.
6. **Eligibility impossible:** absent outcome y cero draws.
7. **Position profiles:** GK/CM/ST equivalentes → transforms propios exactos.
8. **Multiple awards:** mismas facts, editions independientes → outcomes sin
   anti-duplication.

Cada fixture debe guardar versiones, ParameterSet hash, Data hash,
`RandomDrawKey`, raw midpoint uniforms, intermediate binary64 canonicalizados,
quantized state/facts, expected trace y hash.

## 29. Monte Carlo suites

- **SMOKE:** invariantes, determined-case RNG, field/rank/tie coherence,
  context separation y tails básicas sobre CalibrationSeedSet SMOKE.
- **CALIBRATION:** call-ups, debuts, incumbency, roles/minutos, fields,
  generation, outcomes, nominations, placements, winners, repeat winners,
  position distribution, statistical leaders y correlations segmentadas.
- **DEEP:** carreras/eras completas, P99/P99.9, generation rise/collapse,
  superstar omissions, outsider awards, droughts, multiple awards y stream
  isolation ante cambios de catálogo.

Los sample counts pertenecen al manifest de cada tier. Dos ParameterSets se
comparan con el mismo CalibrationSeedSet.

## 30. Cierre de las siete decisiones

| ID | Estado G3C-8 | Matemática cerrada | Pendiente real |
|---|---|---|---|
| G3B-H01 | `PARTIAL_CALIBRATION` | Gaussian core/elite mixture, moments, relative signal, depth y streams | values, world/data fields, targets y goldens |
| G3B-H02 | `PARTIAL_CALIBRATION` | candidate merit, logistic call-up/squad e incumbency AR(1) | values, DR-068, DR-021, evidence y goldens |
| G3B-H03 | `PARTIAL_CALIBRATION` | adapter softmax/Logit-Normal/GH10 y national Performance context | adapter values, calendar/opportunity y joint targets |
| G3B-H04 | `PARTIAL_CALIBRATION` | national strength/generation AR(1), support, rank/knockout outcomes | Definitions, cursor/calendar, values y targets |
| G3B-I02 | `PARTIAL_CALIBRATION` | comparative Normal field y statistical NB2 field | AwardDefinitions/field sizes, values y evidence |
| G3B-I03 | `PARTIAL_CALIBRATION` | utility, judging noise, one-rank ordinal process y tie policies | profile weights/sigmas, catalog y goldens |
| G3B-I04 | `PARTIAL_CALIBRATION` | position-specific matrices y DR-049 period exposure scope | weights, catalog/data y optional GK metrics |

Ninguna conserva fórmula, distribución, sampler, tie algorithm o stream
abierto. Permanecen `PARTIAL_CALIBRATION` porque una implementación competitiva
todavía requiere valores, Definitions, evidencia, targets y goldens.

## 31. Blockers y gates

Antes de implementar este bloque se requiere:

1. resolver DR-068 para eligibility real del slice;
2. publicar DR-025/Data definitions de selecciones, competitions y awards;
3. cerrar cursor/calendar internacional de DR-021;
4. publicar valores completos de `nationalTeam` y `awards`;
5. aprobar evidence mappings y feature allowlists por AwardDefinition;
6. calcular expected outputs/hashes de goldens;
7. aprobar targets externos versionados para Argentina/España, GK/CM/ST;
8. superar SMOKE/CALIBRATION/DEEP y replay cross-runtime;
9. cerrar DR-061 en G3C-9 para reputación consumida con lag;
10. mantener DR-010/scoring fuera de Awards.

G3C-8 deja el proyecto listo para **especificar G3C-9**, no para implementar
gameplay.

## 32. Adapter de reputación confirmado por G3C-9

Selection y Awards congelan el snapshot autorizado antes de construir
candidate utility:

```text
LaggedReputationInput
  sportingByMarket       unit
  awarenessByMarket?     unit, solo AwardDefinition autorizada
  sentimentByMarket?     signed unit, solo AwardDefinition autorizada
  evidence / simulationPoint / stateHash
```

Call-up/award editions no consumen followers, MarketValue o CareerScore. Un
outcome actual (`NationalTeamCallUpIssued`, debut, achievement, nomination o
`AwardWon`) solo produce evidence/public signals para el batch posterior. Ese
batch no reabre candidate signal, field, placement o tie de la edición. En
particular, la reputación nacida de `AwardWon(a,edition)` no puede entrar en la
utility de `a,edition`; sí queda disponible para occurrences futuras después
del commit de G3C-9.

La transformación fact→reputation/attention pertenece exclusivamente a
[`REPUTATION_SOCIAL_MATH_SPEC.md`](REPUTATION_SOCIAL_MATH_SPEC.md); G3C-8 no
duplica sus weights ni shocks.

## 29. Adapter de Scoring cerrado por G3C-11

Performance internacional puede formar segmentos PRI; achievements nacionales
entran en PSN mediante outcome × CC. `AwardWon` entra en PPI salvo mapping
exclusivo a PSN. Awards registra todos los outcomes y jamás aplica equivalence:
ADR-080 la resuelve después mediante grupos data-driven `100%/60%/0%` sin
alterar history. Candidate utility, abstract fields, MarketValue y CareerScore
no son inputs de Scoring.
