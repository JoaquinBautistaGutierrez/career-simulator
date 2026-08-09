# Especificación matemática de Retirement, Comeback y Career Finalization

## 1. Estado, autoridad y alcance

- Estado: **G3C-10 — cierre matemático; calibración/evidencia pendientes**.
- Fecha: 2026-08-01.
- Decisiones G3B cerradas matemáticamente: G3B-L01, G3B-L02 y G3B-L04.
- DR relacionadas: DR-008, DR-010, DR-016, DR-021, DR-056, DR-057,
  DR-058, DR-061, DR-062, DR-063, DR-065, DR-067 y DR-069.
- ADR: [ADR-016](adr/016-career-lifecycle.md),
  [ADR-062](adr/062-playing-retirement-and-comeback.md),
  [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md),
  [ADR-074](adr/074-health-injury-recovery-mathematics.md),
  [ADR-076](adr/076-transfer-market-contract-mathematics.md),
  [ADR-078](adr/078-reputation-public-attention-social-mathematics.md) y
  [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md).

Este documento fija las ecuaciones, samplers, domains, cursor, transiciones,
streams, parámetros, invariantes, targets, diagnostics y golden vectors de
Retirement, Comeback y finalización. No implementa gameplay, no asigna valores
de balance, no introduce edad máxima y no cierra fórmulas de Scoring.

Aplican binary64 atómico, `ROUND_HALF_EVEN`, `EngineParameterSet`, random keys y
samplers de
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md).
Todas las señales de una ventana son snapshots confirmados al inicio de la
operación lifecycle. `MarketValue`, `CareerScore`, `ScoreLedger` e IJL están
prohibidos como inputs.

## 2. Estados y autoridad

Los estados no representan la misma cosa:

```text
PlayerPlayingStatus = ACTIVE | RETIRED

CareerStatus =
  DRAFT | ACTIVE | WAITING_DECISION | RETIRED |
  COMPLETED | ABANDONED | INVALIDATED
```

- `PlayerPlayingStatus.RETIRED` es retiro deportivo reversible. La Career sigue
  `ACTIVE` o temporalmente `WAITING_DECISION`, el tiempo progresa y puede haber
  comeback.
- `CareerStatus.RETIRED` se conserva como etapa **FINALIZING** irreversible. No
  significa retiro deportivo, no admite seasons, gameplay ni regreso. La UI
  debe presentarlo como “finalizando”, aunque el enum físico no cambie todavía.
- `CareerStatus.COMPLETED` es el único terminal normal potencialmente
  competitivo.
- `ABANDONED` es salida voluntaria sin cierre competitivo normal.
- `INVALIDATED` es terminal por integridad; nunca equivale a `COMPLETED`.

La autoridad se divide así:

```text
RetirementComebackState
  playingStatus
  retirementEpisodes[]
  comebackEpisodes[]
  retirementCount
  comebackCount
  currentRetirementStartedAt?
  lastClosedLifecycleInterval
  declineTrendByFamily
  performanceTrend
  roleTrend
  exposureTrend
  lastOpportunityOrdinalByType
  parameterSetHash / VersionSet

CareerFinalizationState
  careerStatus
  pendingDecision?
  confirmedBoundary?
  closedFactSetHash?
  finalScoreSnapshotRef?
  profileConsolidationRef?
  integrityResult?
```

Los counts son enteros no negativos sin máximo mecánico. Motivation,
fulfillment, decline, market opportunity, continuation viability y hazards son
assessments derivados/trazas, no traits ni estados de poder alternativos.

Inicialización canónica: playing `ACTIVE`, counts cero, episodios vacíos,
trends cero y ningún retirement start. En el primer intervalo sin observación
previa comparable, cada `observedDelta` de trajectory es cero; el hazard no se
evalúa hasta cerrar un intervalo de duración positiva. Esto es ausencia lógica
de evidencia, no un threshold de edad/calidad.

## 3. Matriz normativa de transiciones

| CareerStatus antes | Playing antes | Disparador | Decisión | CareerStatus después | Playing después | RNG de decisión |
|---|---|---|---|---|---|---|
| `DRAFT` | n/a | iniciar Career válida | no | `ACTIVE` | `ACTIVE` | no |
| `ACTIVE` | `ACTIVE` | `RetirementOpportunity` | pendiente | `WAITING_DECISION` | `ACTIVE` | no |
| `WAITING_DECISION` | `ACTIVE` | rechazar retiro | usuario | `ACTIVE` | `ACTIVE` | no |
| `WAITING_DECISION` | `ACTIVE` | aceptar retiro | usuario | `ACTIVE` | `RETIRED` | no |
| `ACTIVE` | `ACTIVE` | `RetirePlayer` manual en boundary seguro | usuario | `ACTIVE` | `RETIRED` | no |
| `ACTIVE` | `RETIRED` | `ComebackOpportunity` | pendiente | `WAITING_DECISION` | `RETIRED` | no |
| `WAITING_DECISION` | `RETIRED` | rechazar comeback | usuario | `ACTIVE` | `RETIRED` | no |
| `WAITING_DECISION` | `RETIRED` | aceptar comeback válido | usuario | `ACTIVE` | `ACTIVE` | no |
| `ACTIVE` | `RETIRED` | `FinalizationOpportunity` | pendiente | `WAITING_DECISION` | `RETIRED` | no |
| `WAITING_DECISION` | `RETIRED` | rechazar finalización | usuario | `ACTIVE` | `RETIRED` | no |
| `ACTIVE`/`WAITING_DECISION` | `RETIRED` | `FinishCareer` confirmado | usuario | `RETIRED` | `RETIRED` | no |
| `RETIRED` | `RETIRED` | pipeline terminal íntegro completado | no | `COMPLETED` | `RETIRED` | no |
| no terminal | cualquiera | abandonar | usuario | `ABANDONED` | sin cambio causal | no |
| no terminal | cualquiera | invalidación autoritativa | sistema | `INVALIDATED` | sin cambio causal | no |

`WAITING_DECISION` conserva el estado estable previo y un `resumeCursor`. Las
transiciones `ACTIVE playing -> RETIRED playing -> ACTIVE playing -> RETIRED
playing` pueden repetirse. No existen `COMPLETED -> ACTIVE`, `RETIRED Career ->
ACTIVE`, `ABANDONED -> ACTIVE` ni `INVALIDATED -> ACTIVE`.

Un `RetirementOccurred` no congela score, no consolida perfil y no habilita
ranking. El boundary irreversible es `CareerFinalizationConfirmed`, que entra
en `CareerStatus.RETIRED`; `CareerCompleted` solo aparece al terminar el
pipeline idempotente de cierre.

## 4. Cursor y orden causal

No se crea una segunda timeline ni una top-level phase. Cada Q reutiliza
ADR-013 e inserta, como primeras suboperaciones estables de `AVAILABILITY(Qn)`:

```text
AVAILABILITY(Qn).lifecycle.retirement
AVAILABILITY(Qn).lifecycle.comeback
AVAILABILITY(Qn).lifecycle.finalization
AVAILABILITY(Qn).medical
...
```

El cursor incluye `seasonId`, `quarter`, `operationKey`, `occurrence` y
`resumeCursor`. Las tres operaciones integran el intervalo canónico terminado
en el boundary, cuya duración `deltaYears(Qn)` proviene de Calendar/Data. No se
usan fechas de reloj ni se resuelve DR-021 por inferencia.

- si playing es `ACTIVE`, solo Retirement evalúa hazard; Comeback y
  Finalization son imposibles lógicos y no consumen RNG;
- si playing es `RETIRED`, Retirement es imposible; Comeback se evalúa antes de
  Finalization;
- una oportunidad que crea `WAITING_DECISION` detiene el cursor antes de la
  siguiente operación;
- al rechazar comeback, resume continúa en `.lifecycle.finalization`, sin
  volver a samplear comeback;
- aceptar retiro/comeback cambia estado para operaciones futuras de la misma Q,
  pero jamás reescribe una Q cerrada;
- acciones manuales se confirman únicamente en uno de estos boundaries seguros.

Mientras playing es `RETIRED` y la Career sigue `ACTIVE`, quarters y seasons
continúan. La tabla condicional es:

| Subsistema | Operación posretiro abierta |
|---|---|
| Role/Minutes | `TeamMinutesOpportunity` del protagonista = 0; no role/minute draw on-field |
| Performance | producción on-field = 0; no production draw |
| Health | recovery, sequela y background context continúan; competitive/training exposure = 0 en V1 |
| Development | maturation/wear/inactivity continúan; experience = 0; environment club/manager/training = 0 |
| Club/World/Competitions | mundo progresa; player contribution = 0 |
| Market | solo adapter `RETIRED_COMEBACK`, no mercado activo normal |
| National Team | call-up/minutes son imposibles lógicos, sin RNG |
| Awards | pueden cerrarse ediciones cuyos evaluation facts ya estaban cerrados |
| Reputation/Social | continúan según G3C-9 |
| Events | solo ventanas compatibles; no contenido que escriba estado lifecycle directamente |

Un comeback aceptado puede dejar al jugador `ACTIVE + UNATTACHED`. Sin
affiliation/registration válida, los minutos siguen siendo cero.

## 5. Transformaciones comunes

Para cualquier stored unitario `s`:

```text
unit(s)   = s / 10000
center(s) = 2 * unit(s) - 1
positivePart(x) = softplus(x)
```

Los outputs unitarios se persisten con:

```text
quantizeUnit(x) = ROUND_HALF_EVEN(10000 * clampLogical(x, 0, 1))
```

Las expresiones `1 - exp(-x)` se evalúan como `-expm1(-x)`. Un
`EngineParameterSet` válido garantiza predictors, hazards y exponentes finitos.
NaN, `Infinity` o `-0` invalidan la operación; no se corrigen con caps.

## 6. Motivation y career fulfillment

Motivation es una assessment derivada en `(0,1)`, no un trait persistente:

```text
etaMotivation =
    motivation.intercept
  + motivation.ambitionWeight             * center(ambition)
  + motivation.moraleWeight                * center(morale)
  + motivation.roleWeight                  * centeredRoleSignal
  + motivation.exposureWeight              * centeredExposureSignal
  + motivation.performanceTrendWeight      * performanceTrend
  + motivation.playableHealthWeight        * centeredPlayableHealth
  - motivation.activeHealthBurdenWeight    * activeHealthBurden
  - motivation.sequelaBurdenWeight         * persistentSequelaBurden
  + motivation.contractContinuityWeight    * contractContinuitySignal
  + motivation.marketOpportunityWeight     * centeredMarketOpportunity
  + motivation.teamRelevanceWeight         * centeredTeamNationalRelevance
  + motivation.sportingRelevanceWeight     * center(sportingReputation)
  + motivation.publicAttentionWeight       * center(publicAttention)
  + motivation.unresolvedGoalsWeight       * centeredUnresolvedGoals
  + motivation.fulfillmentWeight           * centeredCareerFulfillment
  + motivation.ambitionFulfillmentWeight   * center(ambition)
                                             * centeredCareerFulfillment
  + motivation.contextWeights · contextVector

motivationSignal = sigmoid(etaMotivation)
```

`recentRoleSignal`, `actualMinutes/exposure` y Performance usan summaries
lagged; ningún resultado de la Q en curso se retroalimenta. Contract es estado,
no salario/value como proxy. Sporting/Public relevance usa snapshots
confirmados de G3C-9.

Career fulfillment se conserva porque aporta una causa distinta de Ambition:

```text
achievementMass = sum over unique EvidenceKey e of (
    achievementImportance[e.definitionId]
  * contribution[e]
  * evidence[e]
  * exp(-fulfillment.recencyLambda[e.definitionFamily] * elapsedYears[e])
)

careerFulfillmentSignal =
  -expm1(-achievementMass / fulfillment.massScale)

unresolvedGoalsSignal = weightedMean(
  versioned personal-goal progress deficits,
  fulfillment.goalWeights
)
```

`achievementImportance` pertenece a gameplay definitions, nunca a scoring
points ni IJL. `fulfillmentWeight` y su interacción con Ambition son signed:
una trayectoria cumplida puede reducir o aumentar Motivation según el perfil,
pero jamás obliga retiro. Sin goals configurados, `unresolvedGoalsSignal` usa el
neutral definido en ParameterSet, no un valor oculto.

## 7. Edad, trayectoria y decline

No existe `retirementAge`, threshold o hard maximum. Por position family:

```text
ageSignal = sigmoid(
  (chronologicalAgeYears - age.location[positionFamily])
  / age.scale[positionFamily]
)

age.scale[positionFamily] > 0
```

Para edad finita, el signal queda estrictamente entre cero y uno; cualquier edad
puede producir o no oportunidad.

Las tendencias se actualizan solo con intervalos cerrados:

```text
capabilityTrendNext[f] =
    decline.capabilityRho[f] * capabilityTrendPrev[f]
  + (1 - decline.capabilityRho[f]) * latentCapabilityDelta[f]

performanceTrendNext =
    decline.performanceRho * performanceTrendPrev
  + (1 - decline.performanceRho)
    * evidenceStrength * contextualPerformanceDelta

roleTrendNext =
    decline.roleRho * roleTrendPrev
  + (1 - decline.roleRho) * ordinalRoleDelta

exposureTrendNext =
    decline.exposureRho * exposureTrendPrev
  + (1 - decline.exposureRho) * normalizedExposureDelta

declineIntensity = softplus(
    decline.intercept
  + sum_f decline.capabilityWeights[f] * (-capabilityTrendNext[f])
  + decline.performanceWeight * (-performanceTrendNext)
  + decline.roleWeight * (-roleTrendNext)
  + decline.exposureWeight * (-exposureTrendNext)
)

declineSignal = -expm1(-declineIntensity)
```

Los `rho` están en `[0,1)`; ninguna mala Q equivale por sí sola a decline. Las
familias provienen de G3C-2, no existe Overall y los `EvidenceKey` impiden contar
dos aliases del mismo cambio.

## 8. Adapters de Health, Role/Minutes y Market

Health entrega, sin decidir retiro:

```text
playableHealth =
  healthAdapter.availabilityWeight * medicalAvailabilitySummary
  + healthAdapter.fitnessWeight     * fitness
  + healthAdapter.recoveryWeight    * recoveryReadiness

healthBurden = 1 - product_k(
  1 - healthAdapter.burdenWeight[k] * burden[k]
)
```

Los pesos son no negativos y las combinaciones quedan en `[0,1]` por validación
del ParameterSet. `burden[k]` incluye active burden, history y persistent
sequela, sin sumar porcentajes solapados. Ninguna severity implica medical
impossibility. V1 no habilita un fact de imposibilidad médica irreversible.

Role/Minutes entrega `lowRoleSignal = 1 - roleContinuationSignal` y
`lowExposureSignal = 1 - exposureContinuationSignal`, derivados de summaries
lagged. Ninguno es causa suficiente.

Market entrega rutas `r` confirmadas y lagged:

```text
routeOpportunity[r] =
  marketAdapter.routeReliability[r]
  * marketAdapter.routeViability[r]

marketOpportunitySignal =
  1 - product_r(1 - routeOpportunity[r])
```

Las rutas pueden incluir interés activo, oferta viable, free-agent opportunity
y expected sporting opportunity. La ausencia en una ventana produce un signal,
no retiro lógico; MarketValue no participa.

## 9. Retirement hazard como competing risks

El set normal de causas es `VOLUNTARY`, `HEALTH`, `MARKET`, `OTHER`.
`EXTERNAL` solo llega mediante un fact/policy explícito allowlisted y no se
samplea con el hazard normal.

Para causa `j` e intervalo cerrado de duración `deltaYears > 0`:

```text
etaRetirement[j] =
    retirementHazard.intercept[j]
  + retirementHazard.ageWeight[j]              * ageSignal
  + retirementHazard.declineWeight[j]          * declineSignal
  + retirementHazard.healthBurdenWeight[j]     * healthBurden
  + retirementHazard.lowRoleWeight[j]          * lowRoleSignal
  + retirementHazard.lowExposureWeight[j]      * lowExposureSignal
  + retirementHazard.contractWeight[j]         * contractSignal
  + retirementHazard.lowMarketWeight[j]        * (1 - marketOpportunitySignal)
  + retirementHazard.lowMoraleWeight[j]        * (1 - unit(morale))
  + retirementHazard.lowMotivationWeight[j]    * (1 - motivationSignal)
  + retirementHazard.fulfillmentWeight[j]      * careerFulfillmentSignal
  + retirementHazard.historyWeight[j]
      * log1p(retirementCount)
  + retirementHazard.contextWeights[j] · contextVector
  + retirementHazard.sharedLoading[j] * ZretirementShared
  + retirementHazard.sigmaSpecific[j] * ZretirementCause[j]

hRetirement[j] = exp(etaRetirement[j])
HRetirement[j] = deltaYears * hRetirement[j]
HTotal = sum_j HRetirement[j]
pRetirementOpportunity = -expm1(-HTotal)
```

Con `HTotal = 0`, el resultado es imposible y no consume RNG. En otro caso:

1. `BinomialInverseCdfV1(n=1, p=pRetirementOpportunity, Uoccur)` resuelve si
   existe oportunidad;
2. si no ocurre, no hay draw de causa;
3. si ocurre, `CategoricalCumulativeMidpointV1` samplea causa con
   `P(j | opportunity) = HRetirement[j] / HTotal`;
4. el contexto narrativo se deriva de causa y componentes; no existe un tercer
   draw implícito.

No hay thresholds, caps ni cooldowns. Los weights con monotonicidad normativa
se validan no negativos; factores signed solo se permiten donde el schema los
identifica explícitamente.

## 10. RetirementOpportunity y decisión

Una oportunidad es un snapshot inmutable:

```text
RetirementOpportunity
  opportunityId / operationKey / occurrence
  evaluatedInterval
  causeCandidate
  motivationAssessment
  hazardComponents / HTotal / probability
  healthRoleMarketContextRefs
  causalFactRefs / VersionSet / parameterSetHash
  narrativeReasonCode
  resumeCursor
```

Se persiste antes de `WAITING_DECISION`. Resume carga el payload congelado y no
consume RNG. La elección del usuario produce `RetirementOccurred` o
`RetirementOpportunityDeclined`; no se samplea y no crea cooldown.

`RetirePlayer` manual está permitido cuando Career está `ACTIVE`, playing está
`ACTIVE`, no existe otra decisión y el cursor alcanzó un boundary lifecycle
seguro. Construye una oportunidad `VOLUNTARY/MANUAL` determinista y pasa por la
misma confirmación. No puede reescribir la Q actual.

No existe retiro automático del protagonista en gameplay V1. Entidades
abstractas futuras requieren policy propia. La automatización de calibración se
define fuera de EngineParameterSet y no equivale a Difficulty.

Al aceptar:

- se crea un `RetirementEpisode` estable y `retirementCount += 1`;
- `PlayerPlayingStatus` pasa a `RETIRED`;
- contrato y affiliations no se borran ni mutan: Market/Contracts resuelve las
  consecuencias mediante sus reglas;
- quedan inhabilitados minutos/call-up/producción on-field hasta comeback y
  registro válidos;
- historia, capabilities, Reputation/Social y ScoreLedger provisional se
  conservan.

## 11. Comeback eligibility y Motivation adapter

Eligibility es lógica y se evalúa antes del hazard:

```text
eligibleComeback :=
     CareerStatus == ACTIVE
  && PlayerPlayingStatus == RETIRED
  && pendingDecision == none
  && confirmedFinalizationBoundary == none
  && comebackPolicy.allows(context)
  && explicitIrreversiblePlayabilityFact == none
```

Si es falsa, `P(comeback)=0` sin RNG. V1 no crea una imposibilidad irreversible
desde severity o edad.

Para `quartersRetired >= 0`:

```text
recentRetirementSignal =
  exp(-quartersRetired / comebackMotivation.recentTau)

elapsedRetirementSignal =
  -expm1(-quartersRetired / comebackMotivation.elapsedTau)

etaComebackMotivation =
    comebackMotivation.intercept
  + comebackMotivation.ambitionWeight       * center(ambition)
  + comebackMotivation.moraleWeight         * center(morale)
  + comebackMotivation.playableHealthWeight * centeredPlayableHealth
  + comebackMotivation.marketWeight         * centeredMarketOpportunity
  + comebackMotivation.sportingWeight       * center(sportingReputation)
  + comebackMotivation.attentionWeight      * center(publicAttention)
  + comebackMotivation.previousLevelWeight  * centeredPriorSportingLevel
  + comebackMotivation.unresolvedGoalsWeight* centeredUnresolvedGoals
  + comebackMotivation.recentWeight          * recentRetirementSignal
  + comebackMotivation.elapsedWeight         * elapsedRetirementSignal
  + comebackMotivation.contextWeights · contextVector

comebackMotivationSignal = sigmoid(etaComebackMotivation)
```

Followers no participa como quality proxy.

## 12. Comeback hazard y rutas de Market

Para el intervalo canónico:

```text
etaComeback =
    comebackHazard.intercept
  - comebackHazard.ageWeight          * ageSignal
  + comebackHazard.playableWeight     * playableHealth
  + comebackHazard.motivationWeight   * comebackMotivationSignal
  + comebackHazard.marketWeight       * marketOpportunitySignal
  + comebackHazard.sportingRepWeight  * unit(sportingReputation)
  + comebackHazard.attentionWeight    * unit(publicAttention)
  + comebackHazard.previousLevelWeight* priorSportingLevel
  + comebackHazard.recentWeight       * recentRetirementSignal
  + comebackHazard.elapsedWeight      * elapsedRetirementSignal
  + comebackHazard.historyWeight      * log1p(comebackCount)
  + comebackHazard.contextWeights · contextVector
  + comebackHazard.sharedLoading * ZcomebackShared
  + comebackHazard.sigmaSpecific * Zcomeback

HComeback = deltaYears * exp(etaComeback)
pComebackOpportunity = -expm1(-HComeback)
```

Se usa `BinomialInverseCdfV1(n=1, p, U)`. No hay draw cuando eligibility es
falsa o `H=0`. No hay age threshold ni cooldown.

Se adopta la ruta **C — ambas rutas**, sin inventar club ni contrato:

1. `PLAYER_WILLINGNESS`: el hazard crea una oportunidad sin club. Aceptar pone
   `ACTIVE + UNATTACHED` y habilita el mercado normal; no garantiza oferta.
2. `MARKET_OFFER`: una oferta comeback válida, congelada por Market, crea una
   oportunidad material sin volver a samplear el hazard. Aceptar sigue la
   negociación/contract/affiliation de G3C-7 y activa al jugador solo cuando la
   policy del proposal lo autoriza.

El payload contiene route, initiating club/proposal refs si existen, expected
opportunity, eligibility/health snapshots, causal facts, probability/draw refs,
VersionSet, parameterSetHash y resumeCursor. User choice no consume RNG. Un
`ComebackOccurred` crea episodio, incrementa `comebackCount` y cambia playing a
`ACTIVE`; affiliation/registration válida sigue siendo precondición de minutos.
DR-065/066/067 no se resuelven aquí.

## 13. Continuation viability

Viability no es un threshold oculto. Primero se calcula una probabilidad
prospectiva determinista usando el predictor de comeback sin shocks:

```text
expectedComebackPotential =
  -expm1(-viability.referenceYears * exp(etaComebackDeterministic))

etaContinuation =
    viability.intercept
  + viability.motivationWeight    * comebackMotivationSignal
  + viability.playableWeight      * playableHealth
  + viability.marketWeight        * marketOpportunitySignal
  + viability.comebackWeight      * expectedComebackPotential
  + viability.sportingWeight      * unit(sportingReputation)
  + viability.unresolvedGoalsWeight * unresolvedGoalsSignal
  - viability.elapsedWeight       * elapsedRetirementSignal
  + viability.contextWeights · contextVector

continuationViability = sigmoid(etaContinuation)
```

Se expone para narrativa y FinalizationOpportunity; nunca completa Career por
comparación contra un threshold.

## 14. FinalizationOpportunity y manual finalization

Solo se evalúa con playing `RETIRED` y Career `ACTIVE`:

```text
etaFinalization =
    finalizationOpportunity.intercept
  + finalizationOpportunity.lowViabilityWeight
      * (1 - continuationViability)
  + finalizationOpportunity.elapsedWeight * elapsedRetirementSignal
  + finalizationOpportunity.lowMotivationWeight
      * (1 - comebackMotivationSignal)
  + finalizationOpportunity.noMarketWeight
      * (1 - marketOpportunitySignal)
  + finalizationOpportunity.unplayableWeight * (1 - playableHealth)
  + finalizationOpportunity.cycleWeight * log1p(retirementCount)
  + finalizationOpportunity.contextWeights · contextVector
  + finalizationOpportunity.sharedLoading * ZfinalizationShared
  + finalizationOpportunity.sigmaSpecific * Zfinalization

HFinalization = deltaYears * exp(etaFinalization)
pFinalizationOpportunity = -expm1(-HFinalization)
```

`BinomialInverseCdfV1(n=1,p,U)` decide si aparece. La oportunidad queda
congelada antes de `WAITING_DECISION`; aceptar/rechazar no usa RNG y rechazar no
crea cooldown.

`FinishCareer` manual está disponible en cualquier boundary lifecycle seguro
con Career `ACTIVE`, playing `RETIRED` y sin decisión pendiente. No requiere
oportunidad previa, no consume RNG y es irreversible. Si playing está `ACTIVE`,
la salida anticipada es `AbandonCareer`, no finalización competitiva normal.

## 15. Boundary irreversible de DR-069

La confirmación de `FinishCareer` ejecuta atómicamente:

1. valida precondiciones y resuelve/cancela de forma explícita cualquier
   decisión compatible; nunca descarta una decisión silenciosamente;
2. emite `CareerFinalizationConfirmed` con el último ordinal de gameplay
   cerrado, causal refs, terminal cursor, VersionSet y `parameterSetHash`;
3. calcula `closedFactSetHash` incluyendo ese fact terminal;
4. cambia `CareerStatus` de `ACTIVE/WAITING_DECISION` a `RETIRED` (semántica
   FINALIZING);
5. prohíbe nuevos gameplay facts, comeback y score-affecting facts para esa
   Career identity.

En `CareerStatus.RETIRED`, un pipeline retryable e idempotente:

```text
closed Domain Facts + scoringVersion
  -> final ScoreLedger projection
  -> final ScoreSnapshot
  -> integrity / compatibility result
  -> discoveries + profile consolidation
  -> CareerCompleted
```

Cada subartefacto se keyed por `careerId + closedFactSetHash + VersionSet` y se
puede reintentar sin duplicar facts/ledger. Solo el commit autoritativo final
cambia a `COMPLETED`. `COMPLETED` no se reabre bajo la misma Career identity.

Ranking requiere simultáneamente `COMPLETED`, integrity válida, compatibility
aceptada y final ScoreSnapshot. `ABANDONED` e `INVALIDATED` nunca se convierten
en completion competitiva. Un external fact futuro no puede saltar estas
reglas; una causa sensible no se inventa. Integridad inválida usa
`INVALIDATED`, no `COMPLETED`.

V1 no habilita ninguna causa no voluntaria que complete normalmente una Career
sin user choice. Una futura imposibilidad externa irreversible requerirá ADR y
policy allowlisted: podrá solicitar finalización o invalidación según su
semántica, pero no convertir abandono/integrity failure en completion.

Interim score/profile snapshots son derivados revocables. Best Career,
discoveries definitivos, final tier, share-card terminal y submission a ranking
se consolidan después del boundary; el primer retiro no los toca.
Consolidation referencia discoveries ya confirmados y nunca los reemite.

## 16. Post-retirement adapters downstream

### 16.1 Reputation/Social

Consume el mismo cursor Q/season-close de G3C-9. Sporting Reputation,
awareness, sentiment, attention, followers y engagement pueden persistir,
crecer o caer. Retirement no crea impulse automático.

### 16.2 Health

```text
postRetirementExposure.competitiveDose = 0
postRetirementExposure.trainingDose    = 0   // V1 sin contexto autorizado
```

Recovery, sequela decay, history burden, fitness y background context siguen.
Health nunca completa la Career.

### 16.3 Development

```text
experienceMinutes = 0
developmentEnvironment.club = 0
developmentEnvironment.manager = 0
developmentEnvironment.training = 0
inactivitySignal = 1
```

Maturation cronológica y stochastic tails continúan. Acquired development usa
su baseline normativo y puede ser pequeño pero no se fuerza a cero. Wear agrega:

```text
wearPredictor[f] += wear.inactivityWeight[f] * inactivitySignal
```

Development sigue siendo el único owner de capabilities; no se borran ni
congelan.

### 16.4 Market, Selection y Competitions

Market recibe `playingStatus=RETIRED` y `marketPath=RETIRED_COMEBACK`; solo
evalúa routes habilitadas. National Team call-up/minutes y player on-field
contribution son imposibles hasta comeback/registro. World y competitions
continúan sin contribución del protagonista.

### 16.5 Scoring

Retirement/Comeback/Finalization no escriben ScoreLedger. Antes del boundary,
facts posteriores autorizados pueden ser consumidos por Scoring. Después de
`CareerFinalizationConfirmed` no puede aparecer un fact score-affecting. La
matemática de PRI/PRL/PBR/CC/rounding permanece en G3C-11/DR-010.

## 17. Terminación práctica y automatización

Las reglas de gameplay no tienen edad máxima, carrera máxima, forced retirement
ni forced finalization. Una Career controlada puede permanecer abierta si el
usuario continúa rechazando oportunidades.

Monte Carlo y tests usan:

```text
CalibrationRunConfig
  automation.retirementDecisionPolicyId
  automation.comebackDecisionPolicyId
  automation.finalizationDecisionPolicyId
  automation.policyVersion
  automation.policyParameterHash
  executionBudget
```

No forma parte de `EngineParameterSet`, VersionSet competitivo ni Difficulty.
La policy entrega decisiones por las mismas APIs; cualquier azar de tooling usa
namespace `calibration-policy`, nunca streams de gameplay. Un execution budget
agotado devuelve `INCONCLUSIVE_GUARD_REACHED`, marca la observación como
right-censored y no emite facts, no cambia status, no congela score y no fuerza
retiro/finalización. `DEEP` amplía budget; no cambia probabilities.

Diagnostics obligatorios:

- edad/duración extrema activa;
- décadas en retiro abierto;
- número y duración de ciclos;
- ausencia de FinalizationOpportunity;
- hazards subnormales o numéricamente indistinguibles de cero;
- ejecución automatizada no terminal/right-censored;
- oportunidades patológicamente repetidas;
- followers o estados downstream fuera de representabilidad durante paths
  largos.

## 18. Random streams

| Namespace | Purpose | Stable context | Occurrence |
|---|---|---|---|
| `lifecycle.retirement.shared` | shock compartido de causas | career/season/Q/interval | 0 |
| `lifecycle.retirement.cause` | shock específico por causa | + cause | 0 |
| `lifecycle.retirement.occurrence` | Bernoulli de oportunidad | + operationKey | 0 |
| `lifecycle.retirement.assignment` | causa competing-risk | + opportunityId | 0 |
| `lifecycle.comeback.shared` | factor compartido lifecycle | career/season/Q/interval | 0 |
| `lifecycle.comeback.occurrence` | oportunidad de comeback | + retirementEpisodeId | 0 |
| `lifecycle.finalization.shared` | factor compartido de viabilidad | career/season/Q/interval | 0 |
| `lifecycle.finalization.occurrence` | oportunidad de finalización | + retirementEpisodeId | 0 |
| `calibration-policy.*` | decisiones tooling, nunca gameplay | seedSet/run/policy/decisionId | policy-defined |

Context/opportunity payload no requiere un draw adicional; si una Definition
futura lo requiere, debe declarar purpose propio. User choice jamás consume RNG.
Agregar un episode o market route no cambia occurrences de otro namespace.

## 19. `EngineParameterSet.retirementComeback`

No hay constantes de balance ocultas. El schema normativo es:

```text
retirementComeback
  motivation
    intercept
    ambitionWeight, moraleWeight, roleWeight, exposureWeight
    performanceTrendWeight, playableHealthWeight
    activeHealthBurdenWeight, sequelaBurdenWeight
    contractContinuityWeight, marketOpportunityWeight
    teamRelevanceWeight, sportingRelevanceWeight, publicAttentionWeight
    unresolvedGoalsWeight, fulfillmentWeight, ambitionFulfillmentWeight
    contextWeights
  fulfillment
    massScale, achievementImportanceByDefinition
    recencyLambdaByDefinitionFamily, goalWeights, noGoalsNeutral
  age
    locationByPositionFamily, scaleByPositionFamily
  decline
    capabilityRhoByFamily, performanceRho, roleRho, exposureRho
    intercept, capabilityWeightsByFamily
    performanceWeight, roleWeight, exposureWeight
  healthAdapter
    availabilityWeight, fitnessWeight, recoveryWeight, burdenWeights
  roleMinutesAdapter
    roleContinuationMap, exposureTransform
  marketAdapter
    routeReliabilityByType, routeViabilityTransforms
  retirementHazard
    causes, interceptByCause, every coefficient shown in section 9
    sharedLoadingByCause, sigmaSpecificByCause
  comebackMotivation
    intercept, recentTau, elapsedTau, every coefficient shown in section 11
  comebackHazard
    intercept, every coefficient shown in section 12
    sharedLoading, sigmaSpecific
  viability
    referenceYears, intercept, every coefficient shown in section 13
  finalizationOpportunity
    intercept, every coefficient shown in section 14
    sharedLoading, sigmaSpecific
  history
    episodeSummaryTransforms, priorLevelTransform
  postRetirement
    developmentEnvironmentAdapter, exposureAdapter
  numericalDomains
    hazardValidationBounds, finitePredictorPolicy, stateQuantization
```

| Clase | Parámetros |
|---|---|
| `STRUCTURAL_FIXED` | equations, state/cause enums, competing-risk normalization, logical eligibility, cursor order, quantization/samplers, zero-exposure adapters, terminal boundary, absence of cooldown/caps |
| `INITIAL_CALIBRATION_REQUIRED` | intercepts, age curve, all causal weights, `rho`, sigmas/loadings, taus, importance transforms, route reliability, hazard/viability/finalization coefficients |
| `TUNABLE_LATER` | context interactions, history/cycle sensitivities, narrative reason mapping, provisional segment adapters whose family is already fixed |

`CalibrationRunConfig.automation.*` queda fuera de este árbol y se versiona
como tooling. Definitions/dataVersion conserva context/cause labels; Scoring
config conserva scoringVersion.

Validación del ParameterSet exige: scales/taus/massScale/referenceYears
positivos; `rho in [0,1)`; sigmas no negativas; hazards finitos; weights de
monotonicidad normativa no negativos; adapters unitarios válidos; ningún
parámetro de CareerScore/MarketValue/IJL.

## 20. Invariants y properties

### 20.1 Lifecycle

- `PlayerPlayingStatus.RETIRED` no implica `CareerStatus.COMPLETED` ni
  `CareerStatus.RETIRED`.
- primer retiro no congela score, ranking o perfil final.
- `CareerStatus.RETIRED` es FINALIZING irreversible; `COMPLETED` no reabre.
- retired playing recibe cero minutos/production/call-up hasta reactivación y
  afiliación/registro válidos.
- no club, lesión, edad, MarketValue o CareerScore nunca fuerzan retiro.
- múltiples retirement/comeback cycles son válidos.
- no hay edad máxima, cooldown ni cap de episodios/oportunidades.
- Health no modifica CareerStatus; Development conserva authority de capability.
- user decision consume cero RNG y resume no resamplea payloads.
- mismos seed/context/ParameterSet/decisiones producen el mismo lifecycle.

### 20.2 Matemáticas

- signals unitarios permanecen en `[0,1]`; hazards son finitos y `>= 0`.
- aumentar ageSignal, decline, health burden o low-market no reduce el hazard
  esperado de las causas donde su weight es normativamente no negativo.
- aumentar playableHealth o Motivation no reduce comeback hazard donde los
  weights son no negativos.
- la property se aplica a expectations, no a outcomes sampleados.
- ningún outlier se elimina por clipping editorial.
- no se persisten NaN, Infinity o `-0`.

### 20.3 Finalización

- solo `CareerFinalizationConfirmed` establece el fact frontier irreversible.
- final ScoreSnapshot requiere ese boundary y Career `COMPLETED` para ranking.
- `ABANDONED`/`INVALIDATED` no son completion competitiva.
- automation/guard de calibración no cambia facts ni mechanics competitivas.

## 21. Calibration targets y evidencia

| Clase | Métrica | Segmentos mínimos | Fuente requerida |
|---|---|---|---|
| `INVARIANT` | transición, no reopening, zero on-field retired, no RNG en decisiones, terminal frontier | todos | diseño/goldens |
| `CALIBRATION_TARGET` | retirement age y career duration distributions | GK/CM/ST, career phase, Argentina/España si aplica | evidencia externa + diseño |
| `CALIBRATION_TARGET` | cause mix voluntary/health/market/other | age, health, role, contract state | diseño + evidencia |
| `CALIBRATION_TARGET` | early retirement y extreme long-career tails | position/health | evidencia externa |
| `CALIBRATION_TARGET` | sensitivity a role/minutes, decline, injury y free-agent periods | causal bins | evidencia externa |
| `CALIBRATION_TARGET` | comeback frequency, age, retired duration y cycle counts | cause/position/prior level | evidencia externa + diseño |
| `CALIBRATION_TARGET` | returning opportunity/club level y post-return exposure | route/prior level | evidencia externa |
| `CALIBRATION_TARGET` | post-return success/failure y repeated retirement | route/age/prior level | evidencia externa + diseño |
| `CALIBRATION_TARGET` | first retirement -> finalization duration y opportunity count | automation policy / user model | diseño de producto |
| `CALIBRATION_TARGET` | immediate finalization y long open-retirement tails | cause/context | diseño de producto |
| `CALIBRATION_TARGET` | automated terminal vs right-censored rate | tier/policy | tooling design |
| `DIAGNOSTIC` | Motivation -> retirement | ambition/morale/context | Monte Carlo |
| `DIAGNOSTIC` | Health -> retirement; Market -> continuation/comeback | burden/opportunity bins | Monte Carlo |
| `DIAGNOSTIC` | Reputation/Attention -> comeback | reputation segments | Monte Carlo |
| `DIAGNOSTIC` | inactivity -> Development/Health | retired duration | Monte Carlo |
| `DIAGNOSTIC` | finalization -> exact fact/score freeze | all terminal paths | goldens/property |

No se asignan cifras observacionales. Retirement/career/comeback distributions
requieren dataset histórico versionado con provenance; finalization de una
Career interactiva y policy de calibración son decisiones de diseño, no hechos
históricos.

Tail diagnostics registran P90/P95/P99/P99.9 cuando el tamaño lo permite y:
retiro extremadamente joven, carrera a edad extrema, comeback inmediato o muy
tardío, múltiples cycles, figura famosa sin comeback, comeback inesperado de
bajo perfil, retiro abierto prolongado, path automatizado no terminal y
oportunidades repetidas. Ninguna cola se corrige con caps.

## 22. Golden vectors obligatorios

Cada fixture declara VersionSet, `parameterSetHash`, stable random keys, binary64
intermediates y quantized outputs:

1. **Motivation:** traits/state/context fijos -> cada término, eta y signal.
2. **Fulfillment/decline:** facts únicos y trajectories -> mass, EWMA e outputs.
3. **Retirement hazard:** inputs + Z/U -> `H[j]`, total, probability, occurrence
   y cause exactos; incluir `H=0` sin RNG.
4. **Retirement decision:** payload congelado + accept/decline -> status/fact y
   cero RNG; resume conserva opportunityId.
5. **Post-retirement cursor:** state fijo -> operations exactas enabled/disabled
   y zero-exposure adapters.
6. **Comeback hazard:** eligibility, state y draws -> eta/H/p/outcome; incluir
   inelegible sin RNG.
7. **Comeback routes:** willingness y market-offer + user choice -> transición,
   affiliation intacta o contractual, y minutos aún bloqueados sin registro.
8. **Multiple cycles:** history fija -> episode IDs/counters/durations exactos.
9. **Viability:** retired context -> deterministic potential y viability.
10. **FinalizationOpportunity:** inputs/draw -> exact opportunity/payload.
11. **Finalization:** user confirmation -> `CareerFinalizationConfirmed`,
    closedFactSetHash, `CareerStatus.RETIRED`, final artefacts y `COMPLETED`.
12. **No reopening:** command tras `COMPLETED` -> rechazo determinista sin RNG.
13. **Calibration automation:** misma Career/policy -> mismas decisiones,
    ordinary lifecycle facts y terminal result; la policy no altera equations
    ni facts deportivos ya cerrados. Guard agotado ->
    `INCONCLUSIVE_GUARD_REACHED` sin facts.

Los expected values se incorporan cuando exista runtime/ParameterSet fixture;
la derivación ya no admite elección de fórmula o sampler.

## 23. Monte Carlo suites

| Tier | Propósito | Métricas |
|---|---|---|
| `SMOKE` | invariants, determinismo, state paths y RNG consumption | statuses, zero minutes, episodes, opportunities, reopening, fact frontier |
| `CALIBRATION` | ajuste de distributions y causal sensitivities | ages, duration, causes, comeback, retired time, cycles, finalization timing, correlations health/role/market/reputation |
| `DEEP` | tails, survival y estabilidad end-to-end | extreme ages/durations, repeated cycles, open retirement, right censoring, subnormal hazards, repeated opportunities |

Se reutilizan `CalibrationSeedSet` estables. Survival curves tratan executions
guarded como right-censored; no se imputan como retiro o finalización. Cada
reporte identifica automation policy/version/hash además del ParameterSet.

## 24. Cierre G3C-10

| ID | Estado | Matemática cerrada | Pendiente real |
|---|---|---|---|
| G3B-L01 | `RESOLVED_MATH` | cadence Q, operation keys, post-retirement cursor, WAITING_DECISION y terminal boundary | implementación |
| G3B-L02 | `PARTIAL_CALIBRATION` | Motivation, decline, competing-risks retirement hazard, samplers, streams y properties | coefficients, targets y golden outputs |
| G3B-L04 | `PARTIAL_CALIBRATION` | user/manual retirement, causes, comeback routes/hazard, viability, finalization y multiple cycles | coefficients, product-calibrated automation fixtures y targets |

DR-069 queda **RESUELTA** por ADR-079: no conserva policy de producto vaga.
CareerStatus.RETIRED es exclusivamente FINALIZING, el cursor posretiro reutiliza
quarters, `CareerFinalizationConfirmed` congela el fact frontier, y
`COMPLETED` es el terminal normal rankeable tras artefactos/integridad.

Bloqueos antes de G3C-11:

- `ScoringConfiguration`, `ScoringCalibrationData`, catálogos y expected
  goldens de ADR-080; fórmulas, rounding, caps y equivalencias están cerrados;
- ParameterSet values, CalibrationTargets numéricos y expected golden outputs;
- DR-021/065/066/067 para calendar/tiers/registration/mid-season donde afecten
  una ruta real de comeback, sin bloquear la matemática lifecycle;
- dataVersion de achievement importance/personal goals y mappings contextuales;
- implementación de schemas/runner/checkpoints, que queda fuera de G3C-10.

## 38. Integración final con Scoring G3C-11

ADR-080 consume el `CareerFinalizationConfirmed` y closed fact frontier de este
documento para proyectar ledger/snapshot exactos. `RetirementOccurred` y
`ComebackOccurred` no puntúan ni congelan PC. Solo el snapshot final íntegro
precede `CareerCompleted`; una proyección provisional no habilita ranking.
Scoring no reabre el lifecycle ni reejecuta gameplay.
