# Especificación matemática de Reputation, Public Attention y Social

## 1. Estado, autoridad y alcance

- Estado: **G3C-9 — cierre matemático; calibración/data pendientes**.
- Fecha: 2026-08-01.
- Decisiones G3B cerradas matemáticamente: G3B-K01, G3B-K02 y G3B-K05.
- DR relacionadas: DR-008, DR-010, DR-016, DR-017, DR-056, DR-058,
  DR-059, DR-060, DR-061, DR-062, DR-063 y DR-069.
- ADR: [ADR-061](adr/061-reputation-and-social-model.md),
  [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md),
  [ADR-073](adr/073-performance-production-form-mathematics.md),
  [ADR-076](adr/076-transfer-market-contract-mathematics.md),
  [ADR-077](adr/077-national-team-awards-mathematics.md) y
  [ADR-078](adr/078-reputation-public-attention-social-mathematics.md).

Este documento selecciona ecuaciones, samplers, dominios, orden causal,
streams, invariantes, parámetros y requisitos de calibración para Reputation,
Public Attention y Social. No asigna valores de balance, no implementa
gameplay y no cierra:

- hazard, motivation, retirement, comeback o finalización de DR-062/069;
- PRL, PBR, records, ledger o cualquier matemática de Scoring de DR-010;
- sponsors, contratos comerciales o revenue;
- IDs, reach baselines o topología concreta de mercados aún dependientes de
  DR-025/`dataVersion`;
- valores del `EngineParameterSet`, targets observacionales o hashes de
  golden vectors.

Aplican las primitivas, binary64 atómico, `ROUND_HALF_EVEN`, identidad de
`EngineParameterSet`, random keys y samplers de
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md).
No se introduce una fase top-level ni se modifica el plan de ADR-013/042/043.

## 2. Estados, representaciones y derivados

No existe `FameOverall`. Los estados autoritativos son:

```text
ReputationSocialState
  markets[marketId]
    sportingStandingStored             integer [0,10000]
    sportingEvidenceStored             integer [0,10000]
    sourceEvidenceStored[sourceFamily] integer [0,10000]
    awarenessStored                     integer [0,10000]
    sentimentStored                     integer [-10000,10000]
    attentionComponentStored[decayFamily] integer [0,10000]
  audiencePartitions[partitionId]
    followers                           uint64
    engagementStored                    integer [0,10000]
  lastConsumedFactOrdinalByBoundary
  lastUpdatedAt                         SimulationPoint
  parameterSetHash / VersionSet
```

Son derivados, no estado causal duplicado:

- `PublicAttention` agregado por mercado;
- vistas `home`, `currentFootball` y `global`;
- `FollowerCount` total como suma exacta de particiones no superpuestas;
- engagement global ponderado por followers;
- reach, hype tiers, reputation tiers y cualquier escala de presentación;
- `CommercialOpportunityContext` y `RetirementReputationSummary`.

`PublicReputation` es el par `(awareness, sentiment)`. `PublicAttention` es
rápido; Sporting Reputation y awareness son acumulativos. Followers es tamaño
de audiencia, Engagement es intensidad. Ninguno es capability, trait,
Performance, MarketValue, CareerScore o prestige de club.

### 2.1 Estados unitarios

Para `s ∈ integer[0,10000]`:

```text
unit(s)   = s / 10000
center(s) = 2 * unit(s) - 1

xSafe(x) = epsilonUnit + (1 - 2 * epsilonUnit) * x
latentUnit(s) = logit(xSafe(unit(s)))

quantizeUnit(x) = ROUND_HALF_EVEN(
  10000 * clampLogical(x, 0, 1)
)
```

`epsilonUnit` es la primitiva global del `EngineParameterSet`; no se duplica en
`reputationSocial`.

### 2.2 Sentiment centrado

`sentimentStored` representa `v ∈ [-1,1]`:

```text
v(s) = s / 10000
pSentiment(s) = (v(s) + 1) / 2
zSentiment(s) = logit(xSafe(pSentiment(s)))

sentimentFromLatent(z) = 2 * sigmoid(z) - 1
quantizeSentiment(v) = ROUND_HALF_EVEN(
  10000 * clampLogical(v, -1, 1)
)
```

Esto reutiliza logit/sigmoid y no añade una implementación host de `atanh`.
Awareness alta y sentiment negativo, neutral o positivo son combinaciones
válidas.

### 2.3 Followers exactos

`FollowerCount` se serializa como `uint64` canónico y nunca como `number` ni
float persistido. El cálculo de crecimiento usa
`FollowerLogAdapterV1`:

1. convertir `uint64` a binary64 con round-to-nearest, ties-to-even;
2. aplicar la primitiva canónica `log1p`;
3. resolver una transición atómica en log-space;
4. aplicar `expm1` canónico;
5. cuantizar `ROUND_HALF_EVEN` a entero y validar `uint64`.

Pérdida de representabilidad, NaN o Infinity produce
`FOLLOWER_REPRESENTATION_OVERFLOW`; no se clampa a `UINT64_MAX`. El límite de
representación es técnico, no un máximo de gameplay.

La suma global también debe caber en `uint64`; un overflow de suma rechaza el
commit completo. El `followerDelta` de un fact puede ocupar
`[-UINT64_MAX, UINT64_MAX]` y se serializa como decimal signed canónico
(`0` o `-?[1-9][0-9]*`), porque no cabe necesariamente en `int64`. Nunca se
convierte a binary64 para persistencia o scoring.

### 2.4 Inicialización

Una Career crea el estado desde `InitialReputationContext` cerrado: markets y
audience partitions de `dataVersion`, club/league/national reach inicial,
biografía pública autorizada y facts de evidencia previos que la snapshot
declare. No infiere fama desde hidden traits.

Por mercado:

```text
zSport0[r]
= muInitSport[profile,r]
 + betaInitSportEvidence[r] * center01(initialEvidence[r])
 + lambdaInitSportGlobal[r] * ZinitGlobal
 + lambdaInitSportRegion[r] * ZinitRegion[r]
 + sigmaInitSport[r] * ZinitSport[player,r]

sporting0[r] = quantizeUnit(sigmoid(zSport0[r]))

zAwareness0[r]
= muInitAwareness[profile,r]
 + betaInitAwarenessSport[r] * center(sporting0[r])
 + betaInitAwarenessReach[r] * center01(initialReach[r])
 + shared/specific init factors

zSentiment0[r] = muInitSentiment[profile,r] + init factors
zAttention0[r,f] = muInitAttention[profile,r,f] + init factors
```

Evidence total/por family se obtiene aplicando §5.2 desde cero sobre los facts
iniciales; si no existen, queda exactamente cero. Por partition:

```text
ellFollowers0[a]
= maxLogical(
     0,
     muInitFollowers[profile,a]
     + betaInitFollowersAwareness[a] * center(awareness0[a])
     + betaInitFollowersReach[a] * center01(initialReach[a])
     + init factors
   )

followers0[a]
= checkedUint64(ROUND_HALF_EVEN(expm1(ellFollowers0[a])))

zEngagement0[a]
= muInitEngagement[profile,a]
 - betaInitEngagementScale[a]
   * (log1p(followers0[a]) / followerLogReference[a])
 + init factors
```

Engagement vuelve por sigmoid/`quantizeUnit`; sentiment, por su adapter signed.
Todos los init factors tienen purposes propios. Los perfiles y coefficients son
parámetros; Quick/Custom no selecciona hidden reputation variables.

## 3. Mercados, particiones y reach

### 3.1 Mercados data-driven

`ReputationMarketDefinition` pertenece a `dataVersion` y declara:

```text
marketId
relatedMarketIds
viewWeight
diffusionWeightsByTarget
audiencePartitionIds
reachAdapters
dataVersion
```

El engine no enumera países. Para el slice, datos deben identificar mercados
que permitan resolver origen y contexto futbolístico de Argentina/España; la
vista global se deriva. Si home y current coinciden, existe un solo `marketId`
y la causa no se duplica.

### 3.2 Particiones de audiencia

Followers se persisten por `AudienceMarketPartition` no superpuesta. Cada
partición referencia un mercado de reputación, pero dos particiones no pueden
contar a la misma persona conceptual en el total V1:

```text
followersTotal = sumExact(partition.followers)
```

Los mercados de reputación sí pueden solaparse como scopes de percepción. Las
vistas home/current/global no son particiones adicionales. Añadir una
partición exige `dataVersion`, no cambia streams de particiones existentes y
no redistribuye followers históricos por sí solo.

### 3.3 Reach de productores

Club/World/Data entrega, por mercado:

```text
ClubReach
LeagueReach
CompetitionReach
NationalTeamReach
PublicEnvironmentContext
```

Cada reach está en `[0,1]`, posee procedencia y vigencia. Prestige no lo
sustituye. Cuando varios canales autorizados aplican a una señal, se combinan:

```text
combinedReach = 1 - product_k(1 - omegaReach[k] * reach[k])
```

con `0 <= omegaReach[k] <= 1`. La operación usa orden canónico de channel ID.
El bound `[0,1]` es lógico; no es un cap de popularidad.

### 3.4 Difusión regional con lag

Para un vector de impulso directo `I_direct[source]`, el impulso recibido por
el mercado `r` es:

```text
I_diffused[r]
= I_direct[r]
 + betaDiffusion
   * sum_source(diffusionWeight[source,r] * I_direct[source])
```

La matriz es finita, no negativa, canónicamente ordenada y validada con suma
entrante `<= 1` por target. Solo se realiza un paso de difusión por boundary;
no existe recursión `r -> s -> r` dentro de la misma operación. Un estado
regional anterior también puede aportar:

```text
neighborCentered[r]
= sum_source(diffusionWeight[source,r] * center(statePrev[source]))
```

con coeficiente propio. Así la difusión es gradual y estable, sin hardcodear
mercados ni obligar alcance global.

### 3.5 Vistas globales

Con `viewWeight[r] >= 0` y suma positiva:

```text
globalSporting = weightedMean(unit(sporting[r]), viewWeight[r])
globalAwareness = weightedMean(unit(awareness[r]), viewWeight[r])
globalAttention = weightedMean(attention[r], viewWeight[r])

sentimentWeight[r] = viewWeight[r] * unit(awareness[r])
globalSentiment =
  weightedMean(sentiment[r], sentimentWeight[r])
  if sum(sentimentWeight) > 0
  else 0
```

Engagement global es follower-weighted; si `followersTotal = 0`, usa la media
ponderada de los estados de engagement por `viewWeight`. Ninguna vista global
se persiste ni recibe shocks propios.

## 4. Facts, señales, deduplicación e impulsos

### 4.1 Inputs autorizados

Reputation/Social consume snapshots y Domain Facts cerrados:

- Performance contextual por posición, production, evidence, pressure y
  surprise públicamente relevante;
- achievements y outcomes de club/competición con strength/context y
  contribución;
- call-up, debut, Performance y achievements de selección;
- nominations/awards con Definition e importancia de gameplay;
- interest/transfer/affiliation y transición de reach autorizados;
- public events y decisiones expresamente publicables;
- historia deportiva confirmada.

Nunca consume como causa directa:

- TrueCapabilities, hidden traits o potential;
- CareerScore, ScoreLedger, scoring values o IJL;
- MarketValue, fee o salary;
- Followers/Public sentiment como mérito deportivo;
- raw goals como evaluación universal de todas las posiciones.

### 4.2 `ReputationEvidenceSignal`

El adapter de facts produce una señal tipada, no deltas libres:

```text
ReputationEvidenceSignal
  signalId
  evidenceKey
  causalSignalId
  sourceFactId
  sourceFamily
  impulseProfileId
  marketExposure[marketId]        unit
  evidenceStrength               unit
  sourceReliability              unit
  sportingFeatures[]             finite normalized features
  publicFeatures[]               finite normalized features
  attentionPotential             unit
  sentimentValence               [-1,1]
  decayFamilyId
  simulationPoint
  VersionSet / parameterSetHash
```

El catálogo allowlisted fija qué feature puede emitir cada fact/profile.
Content puede seleccionar un `PublicEventProfile` autorizado y entregar
contexto tipado; no elige coeficientes, persistence, follower deltas o state
deltas.

### 4.3 Deduplicación

`EvidenceKey = (sourceFactId, semanticFacet, purpose)` identifica una única
aportación. Aliases del mismo hecho no crean otra key. Una misma causa puede
tener facets distintas —por ejemplo mérito deportivo y visibilidad— solo si el
perfil las declara explícitamente.

Antes de calcular:

1. rechazar keys ya aplicadas según el fact ledger/watermark;
2. rechazar duplicados del batch;
3. ordenar por `(marketId, evidenceKey, signalId, componentId)`;
4. reducir mediante `CanonicalPairwiseSumV1`, árbol binario balanceado y
   ordenado;
5. guardar causal refs de las señales aceptadas en el fact de update.

`CanonicalPairwiseSumV1` es local a esta especificación. Evita que el orden de
consulta cambie binary64. No se toma máximo, no se conserva solo el mayor
evento y no existe cuota de impulsos.

Por cada `causalSignalId = c` aceptado se samplea una sola
`Zcausal[c] ~ Normal(0,1)`. Para componente `y`:

```text
causalTerm[y,r]
= canonicalSum_e(
     gate[e,r]
     * lambdaCause[y, impulseProfileId[e]]
     * Zcausal[causalSignalId[e]]
   )

eventDose[r]
= canonicalSum_e(
     marketExposure[e,r] * attentionPotential[e]
   )

eventActivity[r] = -expm1(-eventDose[r])
```

`eventActivity ∈ [0,1]`. El mismo `Zcausal[c]`, con loadings distintos, induce
la correlación autorizada entre reputation, attention, acquisition/churn y
engagement sin convertir sus outcomes en aliases.

### 4.4 Transformación de impulsos

Para señal `e`, perfil `p` y mercado `r`:

```text
gate[e,r]
= marketExposure[e,r]
 * evidenceStrength[e]
 * sourceReliability[e]

etaSport[e]
= bSport[p]
 + sum_k(betaSport[p,k] * sportingFeature[e,k])
 + sum_(a,b)(gammaSport[p,a,b]
             * sportingFeature[e,a] * sportingFeature[e,b])

directSportImpulse[e,r] = gate[e,r] * etaSport[e]

etaAwareness[e]
= bAwareness[p]
 + sum_k(betaAwareness[p,k] * publicFeature[e,k])

directAwarenessImpulse[e,r] = gate[e,r] * etaAwareness[e]

etaSentiment[e]
= bSentiment[p]
 + betaValence[p] * sentimentValence[e]
 + sum_k(betaSentiment[p,k] * publicFeature[e,k])

directSentimentImpulse[e,r] = gate[e,r] * etaSentiment[e]

directAttentionImpulse[e,r]
= marketExposure[e,r]
 * attentionPotential[e]
 * softplus(
     bAttention[p]
     + sum_k(betaAttention[p,k] * publicFeature[e,k])
   )
```

Sporting/awareness/sentiment impulses son signed; attention es salience no
negativa. El state acotado usa sigmoid, pero no se clipean impulsos/outliers.
Facts sensibles no crean señales por ser adversos: requieren profile y
publicación autorizados conforme a ADR-012.

## 5. Sporting Reputation

### 5.1 Transición por mercado

Para mercado `r` y boundary `t -> t+1`:

```text
zSPrev[r] = latentUnit(sportingStandingStored[r,t])

zSNext[r]
= muSport[r]
 + phiSport[r] * (zSPrev[r] - muSport[r])
 + betaSportNeighbor[r] * neighborSportPrev[r]
 + canonicalSum(diffusedSportImpulses[r])
 + lambdaSportGlobal[r] * ZpublicGlobal[t]
 + lambdaSportRegion[r] * ZpublicRegion[r,t]
 + causalTerm[sporting,r]
 + sigmaSport[r] * ZsportSpecific[player,r,t]

sportingStandingStored[r,t+1]
= quantizeUnit(sigmoid(zSNext[r]))
```

ParameterSet válido exige `0 <= phiSport[r] < 1`. No existe floor por premio,
club, selección o identity. Con cero facts, el estado conserva memoria y
regresa gradualmente hacia `muSport`; un shock o impulso negativo puede
reducirlo.

### 5.2 Evidence strength y memoria por fuente

La evidence no se suma sin límite. Para dosis no negativa:

```text
dose[r]
= canonicalSum_e(
     marketExposure[e,r]
     * evidenceStrength[e]
     * sourceReliability[e]
     * evidenceDoseScale[sourceFamily[e]]
   )

ePrev = unit(sportingEvidenceStored[r,t])
eNext = 1 - (1 - phiEvidence[r] * ePrev) * exp(-dose[r])
sportingEvidenceStored[r,t+1] = quantizeUnit(eNext)
```

Por `sourceFamily` se aplica la misma ecuación usando solo su dosis y
`phiSourceEvidence[family]`. Esto conserva suficiente memoria agregada para
evidence/reporting sin persistir valores redundantes de cada fact. La
deduplicación autoritativa permanece en el fact ledger/watermark; los facts
conservan auditabilidad completa.

### 5.3 Significado causal

`NaturalTalent`, capabilities y Performance latent no entran. Longevity de
carrera solo puede influir mediante una feature histórica autorizada y
observable. Awards usan importancia/contexto de `AwardDefinition`, nunca sus
puntos de Scoring. Achievements usan competition strength de gameplay, no IJL.

## 6. Public awareness y sentiment

### 6.1 Awareness

Todos los estados del lado derecho son snapshots `t`, nunca candidates
`t+1`:

```text
zAPrev[r] = latentUnit(awarenessStored[r,t])

zANext[r]
= muAwareness[r]
 + phiAwareness[r] * (zAPrev[r] - muAwareness[r])
 + betaAwarenessSport[r] * center(sportingStandingStored[r,t])
 + betaAwarenessAttention[r] * center01(attentionAggregate[r,t])
 + betaAwarenessReach[r] * center01(combinedReach[r,t])
 + betaAwarenessNeighbor[r] * neighborAwarenessPrev[r]
 + canonicalSum(diffusedAwarenessImpulses[r])
 + lambdaAwarenessGlobal[r] * ZpublicGlobal[t]
 + lambdaAwarenessRegion[r] * ZpublicRegion[r,t]
 + causalTerm[awareness,r]
 + sigmaAwareness[r] * ZawarenessSpecific[player,r,t]

awarenessStored[r,t+1] = quantizeUnit(sigmoid(zANext[r]))
```

`0 <= phiAwareness < 1`. Followers no aparece en la ecuación. Sporting
Reputation y Attention operan con lag; un mismo award puede aportar un impulso
directo de awareness una vez, pero su attention nueva no vuelve a amplificarlo
en el mismo boundary.

### 6.2 Sentiment

```text
zVPrev[r] = zSentiment(sentimentStored[r,t])

zVNext[r]
= muSentiment[r]
 + phiSentiment[r] * (zVPrev[r] - muSentiment[r])
 + betaSentimentNeighbor[r] * neighborSentimentPrev[r]
 + canonicalSum(diffusedSentimentImpulses[r])
 + lambdaSentimentGlobal[r] * ZpublicGlobal[t]
 + lambdaSentimentRegion[r] * ZpublicRegion[r,t]
 + causalTerm[sentiment,r]
 + sigmaSentiment[r] * ZsentimentSpecific[player,r,t]

sentimentStored[r,t+1]
= quantizeSentiment(sentimentFromLatent(zVNext[r]))
```

Sporting performance no genera sentiment positivo/negativo automáticamente.
Solo una fact/profile explícita puede aportar `sentimentImpulse`. Awareness y
sentiment no comparten state ni signo obligatorio; los shared factors inducen
correlación calibrable, no equivalencia.

## 7. Public Attention / Hype

### 7.1 Componentes por decay family

Para conservar duraciones distintas sin timers diarios, `PublicAttentionState`
persiste un componente por `AttentionDecayFamily` data-driven:

```text
zHPrev[r,f] = latentUnit(attentionComponentStored[r,f,t])

zHNext[r,f]
= muAttention[r,f]
 + phiAttention[r,f] * (zHPrev[r,f] - muAttention[r,f])
 + betaAttentionNeighbor[r,f] * neighborAttentionPrev[r,f]
 + canonicalSum(attentionImpulses[r,f])
 + lambdaAttentionGlobal[r,f] * ZpublicGlobal[t]
 + lambdaAttentionRegion[r,f] * ZpublicRegion[r,t]
 + causalTerm[attentionDecayFamily=f,r]
 + sigmaAttention[r,f] * ZattentionSpecific[player,r,f,t]

attentionComponentStored[r,f,t+1]
= quantizeUnit(sigmoid(zHNext[r,f]))
```

Los impulses se asignan a una sola decay family por signal. No hay cooldown ni
duración fija en Q.

### 7.2 Attention agregada

```text
h[r,f] = unit(attentionComponentStored[r,f])

attentionAggregate[r]
= 1 - product_f(1 - h[r,f])
```

El producto usa orden canónico de `decayFamilyId` y una forma estable con
`log1p` cuando ningún componente es uno. Si un componente es uno, el resultado
uno es lógico. No se persiste otro contador agregado.

ParameterSet válido exige:

```text
0 <= phiAttention[r,f]
   < min(phiSport[r], phiAwareness[r])
   < 1
```

por mercado/perfil, salvo una Definition explícita de una familia que no sea
hype rápido. V1 no declara tal override. Attention puede alcanzar extremos,
pero revierte más rápido que reputación acumulada.

## 8. Followers

### 8.1 Modelo elegido

V1 usa crecimiento neto realizado en log-space, descompuesto en tasas latentes
de adquisición y churn. No samplea identidades ni persiste conteos artificiales
de nuevos/perdidos que no tienen consumidor.

Para partición `a`:

```text
ellPrev[a] = log1p(followers[a,t])
scale[a] = ellPrev[a] / followerLogReference[a]

vPositive[a] = maxLogical(sentiment[a,t+1], 0)
vNegative[a] = maxLogical(-sentiment[a,t+1], 0)
```

Los `maxLogical` solo separan signo.

### 8.2 Adquisición

```text
etaAcquire[a]
= bAcquire[a]
 + betaAcquireAwareness[a] * center(awareness[a,t+1])
 + betaAcquireAttention[a] * center01(attention[a,t+1])
 + betaAcquireReach[a] * center01(combinedReach[a,t])
 + betaAcquireSportVisibility[a] * center(sporting[a,t+1])
 + betaAcquirePositiveSentiment[a] * vPositive[a]
 + betaAcquireNegativeNotoriety[a] * vNegative[a]
 + betaAcquireEventActivity[a] * eventActivity[a,t]
 - betaAcquireScale[a] * scale[a]
 + lambdaAcquireGlobal[a] * ZpublicGlobal[t]
 + lambdaAcquireRegion[a] * ZpublicRegion[a,t]
 + causalTerm[acquisition,a]
 + sigmaAcquire[a] * ZacquireSpecific[player,a,t]

acquisitionRate[a] = softplus(etaAcquire[a])
```

El coeficiente de notoriedad negativa permite adquisición por controversia,
sin obligar a que el efecto neto sea positivo.

### 8.3 Churn

```text
etaChurn[a]
= bChurn[a]
 + betaChurnInactivity[a] * (1 - eventActivity[a,t])
 + betaChurnNegativeSentiment[a] * vNegative[a]
 - betaRetentionPositiveSentiment[a] * vPositive[a]
 - betaRetentionAttention[a] * center01(attention[a,t+1])
 + betaChurnScale[a] * scale[a]
 + lambdaChurnGlobal[a] * ZpublicGlobal[t]
 + lambdaChurnRegion[a] * ZpublicRegion[a,t]
 + causalTerm[churn,a]
 + sigmaChurn[a] * ZchurnSpecific[player,a,t]

churnRate[a] = softplus(etaChurn[a])
```

Los signos normativos son los mostrados para scale y retention. El resto se
valida por profile; no se exige monotonicidad de un outcome sampleado.

### 8.4 Cola viral

```text
etaViral[a]
= bViral[a]
 + betaViralAttention[a] * center01(attention[a,t+1])
 + betaViralReach[a] * center01(combinedReach[a,t])
 + betaViralEventActivity[a] * eventActivity[a,t]

pViral[a] = sigmoid(etaViral[a])
viral[a] ~ BinomialInverseCdfV1(n=1, p=pViral[a])

if viral[a] = 1:
  viralMagnitude[a]
  = softplus(muViral[a] + sigmaViral[a] * ZviralMagnitude[player,a,t])
else:
  viralMagnitude[a] = 0
  // no magnitude draw
```

No existe probability floor, cuota, máximo viral o cooldown.

### 8.5 Transición exacta

```text
ellCandidate[a]
= ellPrev[a]
 + acquisitionRate[a]
 - churnRate[a]
 + viral[a] * viralMagnitude[a]

ellNext[a] = maxLogical(0, ellCandidate[a])

followers[a,t+1]
= checkedUint64(
     ROUND_HALF_EVEN(expm1(ellNext[a]))
   )
```

El redondeo ocurre después de shocks y del state transition realizado; no se
redondea una expectativa de count. El bound `ell >= 0` expresa
`followers >= 0`. El modelo admite crecimiento, caída, estabilidad por
cuantización, viralidad y colapso sin caps editoriales.

## 9. Engagement

Engagement es rate persistido por partición, independiente del count:

```text
zEPrev[a] = latentUnit(engagementStored[a,t])
sizeNext[a] = log1p(followers[a,t+1]) / followerLogReference[a]

zENext[a]
= muEngagement[a]
 + phiEngagement[a] * (zEPrev[a] - muEngagement[a])
 + betaEngagementAwareness[a] * center(awareness[a,t+1])
 + betaEngagementAttention[a] * center01(attention[a,t+1])
 + betaEngagementPositiveSentiment[a] * vPositive[a]
 + betaEngagementNegativeSentiment[a] * vNegative[a]
 + betaEngagementEventActivity[a] * eventActivity[a,t]
 - betaEngagementScale[a] * sizeNext[a]
 + lambdaEngagementGlobal[a] * ZpublicGlobal[t]
 + lambdaEngagementRegion[a] * ZpublicRegion[a,t]
 + causalTerm[engagement,a]
 + sigmaEngagement[a] * ZengagementSpecific[player,a,t]

engagementStored[a,t+1] = quantizeUnit(sigmoid(zENext[a]))
```

`0 <= phiEngagement < 1` y `betaEngagementScale >= 0` para un ParameterSet
válido. El efecto de escala es suave y no garantiza engagement bajo en cada
audiencia grande.

No se persiste `engagedAudience` en V1 porque no existe consumer ni semántica
cerrada de personas únicas frente a interacciones. Si se autoriza más adelante
como personas únicas:

```text
engagedAudience = ROUND_HALF_EVEN(followers * engagementRate)
```

y deberá cumplir `0 <= engagedAudience <= followers`; no es un fact nuevo por
este documento.

## 10. Orden causal y control de feedback

### 10.1 Batch atómico

Cada `ReputationSocialUpdateBatch` ejecuta:

```text
closed Domain Facts since previous watermark
-> typed signal adapters
-> EvidenceKey deduplication
-> canonical impulse aggregation
-> shared/specific draws
-> Sporting / Awareness / Sentiment / Attention candidates
   (todos usan states previos entre sí)
-> Followers / Engagement candidates
   (usan reputation/attention candidates, nunca a la inversa)
-> validation + ROUND_HALF_EVEN
-> atomic state/facts/watermark commit
```

No existe un solve simultáneo ni una iteración hasta convergencia.

### 10.2 Boundaries sin nueva fase

Se registran suboperaciones dentro del plan vigente:

1. `CONSEQUENCES(Qn).reputationSocial` consume facts cerrados hasta
   `HEALTH(Qn)` que no fueron consumidos por un batch anterior;
2. `SEASON_CLOSE.reputationSocial` consume el remanente posterior, incluidos
   facts de event windows, competitions, market, awards y world ya cerrados.

La segunda ocurre después de `AWARD_EVENTS` y `POSTSEASON_EVENTS`, antes del
commit final de `SEASON_CLOSE`. No se añade una operación top-level. Q4
Performance puede influir en Market/Awards mediante el batch de
`CONSEQUENCES(Q4)`; un outcome de Competition, Market o Award produce estado
para la temporada siguiente, nunca para su propia resolución.

### 10.3 Lag de consumidores

- Market consume el último snapshot confirmado al iniciar su occurrence. Fee,
  salary y MarketValue actuales no vuelven a Reputation.
- Selection/Awards consumen snapshot confirmado anterior a candidate/edition.
  Un `AwardWon` actual solo entra al batch posterior.
- Followers de un batch nunca son input de awareness del mismo batch.
- Attention nueva sí alimenta Social después de confirmarse el candidate de
  Reputation; Social no vuelve a ejecutar Reputation.
- Retirement recibirá snapshots confirmados, pero G3C-10 decidirá hazard.

Un retry/resume del mismo `operationKey` usa el watermark/checkpoint y no
resamplea.

## 11. Public events y fronteras

### 11.1 `PublicEventSignal`

```text
PublicEventSignal
  signalId / causalSignalId
  sourceFactId / evidenceKey
  publicEventProfileId
  attentionPotential
  sentimentValence
  marketExposure
  decayFamilyId
  publicContextFeatures
  simulationPoint
  VersionSet
```

El profile está allowlisted y versionado. Content no puede escribir ecuaciones,
coeficientes, ReputationState, followers o Engagement. `duration/decay` elige
una familia parametrizada, no un timer arbitrario.

`attentionPotential` y `sentimentValence` son outputs del adapter autoritativo,
no números libres del DSL. Content declara profile y features enumeradas/
acotadas permitidas; `publicEventProfiles.transforms` produce los valores. Un
producer externo solo puede aportar una medición normalizada si su schema y
policy de provenance están allowlisted.

### 11.2 Performance, Awards, National Team y Transfers

- Performance entrega summaries posicionales, evidence, pressure y surprise;
  Reputation decide su impulso.
- Awards entrega outcome, Definition y visibility/importance de gameplay; no
  entrega puntos.
- National Team entrega call-up/debut/Performance/achievement y reach.
- Transfers entrega interest/completion y transición de reach; fee no es
  reputación.

No se recalculan los modelos upstream.

### 11.3 Sponsors, Retirement y Scoring

`CommercialOpportunityContext` puede exponer reach, engagement, sentiment y
sporting relevance, pero G3B-K07 continúa diferida. No hay propensity, contrato
o threshold comercial.

G3C-10 recibe el vector de estados actuales e historia autorizada; reputación
alta no vuelve imposible el retiro.

Scoring puede consumir únicamente facts allowlisted por
`SCORING_FACTS_SPEC.md`. Esta especificación no define PRL/PBR, no asigna puntos
y no escribe ScoreLedger.

## 12. Observabilidad y Domain Facts

Sporting/Public Reputation, followers y engagement son estados públicos del
engine, no PlayerKnowledge de capabilities. Presentation puede mostrar vistas,
bandas o estimaciones regionales sin cambiar el estado canónico.

Facts persistidos existentes:

| Fact | Payload matemático mínimo |
|---|---|
| `SportingReputationUpdated` | mercados before/after, evidence before/after, accepted EvidenceKeys, impulse aggregate, parameter hash y causal refs |
| `PublicReputationUpdated` | awareness/sentiment before/after por mercado, impulse aggregate y causal refs |
| `PublicAttentionGenerated` | source fact, profile, mercados, decay family y causal signal; no state delta impuesto |
| `FollowerCountUpdated` | breakdown/total `uint64` before-after, delta signed decimal canónico y causal refs |
| `EngagementUpdated` | rate before/after por partition y causal refs |

`ReputationSignalAccepted` es internal signal. `RegionalReputationUpdated` es
derived summary y no alias. `AudienceMilestoneReached` no se emite sin consumer.
No se añaden facts por cada shock interno.

## 13. Random streams y samplers

Se reutiliza `StandardNormalInverseCdfV1` para todos los factores Normal y
`BinomialInverseCdfV1(1,p)` para viral eligibility. No hay otro sampler en V1.
Un factor se samplea una vez y se pasa por referencia.

Namespaces/purposes mínimos:

```text
reputation.initialization.global
reputation.initialization.region
reputation.initialization.player_market
reputation.initialization.player_partition
reputation.sporting.global
reputation.sporting.region
reputation.sporting.player_market
reputation.public.awareness.player_market
reputation.public.sentiment.player_market
social.attention.player_market_decay_family
social.followers.acquire.player_partition
social.followers.churn.player_partition
social.followers.viral_eligibility.player_partition
social.followers.viral_magnitude.player_partition
social.engagement.player_partition
social.public_cause.causal_signal
```

Context keys incluyen `careerId`, `operationKey`, `playerId`, market/partition,
decay/source family y `occurrence` cuando aplique. `causalSignalId` comparte un
factor solo mediante loadings declarados. Shocks específicos son independientes.
Agregar un market/profile/partition no desplaza draws existentes.

Si un sigma/loading es estructuralmente cero, el término no consume draw. Si
`pViral` es lógicamente 0 o 1 por un caso definido —no por clipping— el outcome
no consume Bernoulli; en el caso 0 tampoco consume magnitude.

## 14. `EngineParameterSet.reputationSocial`

Todo valor causal aparece bajo:

```text
reputationSocial
  modelIds
  initialization
  sporting
  evidence
  awareness
  sentiment
  attention
  regional
  reach
  followers
  engagement
  publicEventProfiles
  shocks
  numerical
```

### 14.1 Parámetros estructurales

| Path/familia | Dominio/semántica | Clase |
|---|---|---|
| `modelIds.{canonicalPairwiseSum,followerLogAdapter,regionalDiffusion,globalProjection,followerGrowth}` | IDs exactos V1 | `STRUCTURAL_FIXED` |
| `numerical.stateScale` | `10000` | `STRUCTURAL_FIXED` |
| `numerical.sentimentScale` | `10000` signed | `STRUCTURAL_FIXED` |
| `numerical.followerStorage` | `uint64`, overflow typed | `STRUCTURAL_FIXED` |
| `numerical.quantization` | `ROUND_HALF_EVEN` | `STRUCTURAL_FIXED` |
| `regional.diffusionPassesPerBoundary` | exactamente uno | `STRUCTURAL_FIXED` |
| `followers.viralSampler` | `BinomialInverseCdfV1` | `STRUCTURAL_FIXED` |
| `shocks.normalSampler` | `StandardNormalInverseCdfV1` | `STRUCTURAL_FIXED` |

### 14.2 Parámetros que requieren calibración inicial

| Path/familia | Contenido completo | Clase |
|---|---|---|
| `sporting.baseMeanByMarketProfile` | `muSport` | `INITIAL_CALIBRATION_REQUIRED` |
| `initialization.statePriors` | todos los means, evidence/reach/scale coefficients y profile selectors de §2.4 | `INITIAL_CALIBRATION_REQUIRED` |
| `initialization.factorLoadingsAndSigmas` | init global/regional/player/partition por state | `INITIAL_CALIBRATION_REQUIRED` |
| `sporting.persistenceByMarketProfile` | `phiSport` | `INITIAL_CALIBRATION_REQUIRED` |
| `sporting.impulseProfiles` | intercepts, feature weights, interactions, reliabilities | `INITIAL_CALIBRATION_REQUIRED` |
| `sporting.neighborCoefficients` | difusión lagged | `INITIAL_CALIBRATION_REQUIRED` |
| `evidence.persistence` | `phiEvidence`, `phiSourceEvidence` | `INITIAL_CALIBRATION_REQUIRED` |
| `evidence.doseScales` | scale por source family | `INITIAL_CALIBRATION_REQUIRED` |
| `awareness.dynamics` | means, persistence, sporting/attention/reach/neighbor coefficients | `INITIAL_CALIBRATION_REQUIRED` |
| `awareness.impulseProfiles` | intercepts, features, interactions | `INITIAL_CALIBRATION_REQUIRED` |
| `sentiment.dynamics` | means, persistence, neighbor coefficients | `INITIAL_CALIBRATION_REQUIRED` |
| `sentiment.impulseProfiles` | valence y feature transforms | `INITIAL_CALIBRATION_REQUIRED` |
| `attention.decayFamilies` | means, persistence, neighbor coefficients | `INITIAL_CALIBRATION_REQUIRED` |
| `attention.impulseProfiles` | intercepts y feature transforms | `INITIAL_CALIBRATION_REQUIRED` |
| `regional.diffusionCoefficients` | beta por state/source profile | `INITIAL_CALIBRATION_REQUIRED` |
| `reach.channelWeights` | `omegaReach` por channel/context | `INITIAL_CALIBRATION_REQUIRED` |
| `followers.followerLogReference` | scale positiva por partition profile | `INITIAL_CALIBRATION_REQUIRED` |
| `followers.acquisition` | intercepts y todos los betas/loadings/sigmas de §8.2 | `INITIAL_CALIBRATION_REQUIRED` |
| `followers.churn` | intercepts y todos los betas/loadings/sigmas de §8.3 | `INITIAL_CALIBRATION_REQUIRED` |
| `followers.viral` | intercept, betas, `muViral`, `sigmaViral` | `INITIAL_CALIBRATION_REQUIRED` |
| `engagement.dynamics` | mean, persistence, betas/loadings/sigma | `INITIAL_CALIBRATION_REQUIRED` |
| `shocks.loadingsAndSigmas` | global, regional, causal y específicos por equation | `INITIAL_CALIBRATION_REQUIRED` |
| `publicEventProfiles.transforms` | feature allowlist, reliability, decay family y impulse profile | `INITIAL_CALIBRATION_REQUIRED` |

### 14.3 Extensiones posteriores

Overrides de mercado/profile, nuevas source/decay families, nuevos channels de
reach y tolerancias de calibración son `TUNABLE_LATER` solo después de existir
un ParameterSet base aprobado. Market definitions, partition mapping, reach
baselines y profiles de contenido pertenecen a `dataVersion`/`contentVersion`,
no al ParameterSet. Ninguna constante de ecuación queda implícita en prosa.

Validación de ParameterSet exige predictores finitos, sigmas no negativas,
persistencias en sus dominios, ordering de attention, matrices finitas y
normalizadas, scale coefficients con signo normativo no negativo, references
positivas y conversión follower representable en los goldens de publicación.

## 15. Invariantes y properties

1. Sporting Reputation, awareness, sentiment, attention, followers y
   engagement permanecen separados.
2. Persisted unit states están en integer `[0,10000]`; sentiment, en integer
   `[-10000,10000]`; followers, en exact `uint64`.
3. No se persisten NaN, Infinity o `-0`.
4. Followers puede aumentar, disminuir o no cambiar.
5. Engagement permanece en `[0,1]` y no equivale a audience size.
6. La misma seed/context/parameters/facts produce el mismo state y facts.
7. Una `EvidenceKey` se aplica a lo sumo una vez por purpose.
8. Input order no cambia impulses por `CanonicalPairwiseSumV1`.
9. Sporting Reputation nunca consume CareerScore, MarketValue, Followers,
   sentiment o hidden capabilities.
10. Content no escribe reputation/followers/engagement directamente.
11. Public/Social states no modifican capabilities ni sporting facts.
12. Awareness alta no implica sentiment positivo.
13. Attention decae más rápido que Sporting/Awareness en ParameterSet válido.
14. No existen floors permanentes, cooldowns, cuotas o caps editoriales.
15. Retiro o bajo rendimiento no borra automáticamente la reputación previa.
16. Un award no consume la reputación generada por su propio outcome.
17. Market/Selection/Awards solo consumen snapshots confirmados lagged.
18. PublicAttention/Social no escribe ScoreLedger.
19. Añadir un mercado no desplaza streams de otro.
20. Overflow de followers falla tipadamente; nunca satura el outcome.
21. Initial state usa solo snapshot/facts autorizados y streams de init; no
    hidden traits ni wall clock.

Monotonicidades de expectativa, no de outcomes sampleados:

- mayor evidence positiva no reduce el impulso sporting esperado con profile
  monotónico válido;
- mayor awareness/attention no reduce acquisition esperada cuando los demás
  inputs permanecen fijos y el profile lo declara;
- mayor scale no aumenta acquisition ni engagement esperado bajo los signos
  normativos;
- mayor sentiment negativo no reduce churn esperado bajo profile válido;
- ninguna propiedad obliga a que una persona concreta gane followers o mejore
  sentiment.

## 16. Calibration targets y diagnostics

Targets se segmentan solo donde aporta causalmente por career phase, market,
home/current/global view, club/league reach, Argentina/España y source family.
No se crea el producto cartesiano completo.

### 16.1 Invariants

| ID | Métrica |
|---|---|
| `REP-INV-01` | dominios, integer storage y no NaN/Infinity/-0 |
| `REP-INV-02` | idempotencia de EvidenceKey y batch/watermark |
| `REP-INV-03` | atención con persistencia menor que reputación acumulada |
| `REP-INV-04` | no current-award/market/social feedback |
| `REP-INV-05` | total followers = suma exacta de partitions |
| `REP-INV-06` | global views derivables sin state duplicado |
| `REP-INV-07` | stream isolation por market/partition/cause |
| `REP-INV-08` | ninguna ruta hacia capabilities o ScoreLedger |

### 16.2 Calibration targets

| Familia | Targets | Fuente necesaria |
|---|---|---|
| Sporting | distribución por career phase/market; autocorrelación; ascenso tras Performance elite; descenso tras inactividad/poor evidence; relación con títulos, awards y selección | evidencia histórica + decisión de diseño |
| Sporting memory | evidence accumulation/decay; source-family persistence; long post-peak relevance | evidencia histórica |
| Awareness | distribución regional/global; crecimiento por club/national reach; lag tras breakout; persistencia | datos de reach/medios versionados |
| Sentiment | distribución, autocorrelación, colas positiva/negativa y correlación débil/no forzada con awareness | datos públicos con provenance + diseño sensible |
| Attention | impulse sizes, decay por family, stacking, duración, viral tails | evidencia de ventanas/eventos + diseño |
| Followers | distribución, growth/decline rates, trayectorias, relación con awareness/attention, transiciones regionales y colas | datasets sociales versionados |
| Engagement | rate, persistence, scale effect, sensibilidad a attention/sentiment | datasets sociales versionados |
| Cross-system | Performance→Sporting, Awards→awareness, Transfers→attention, National Team→reach y lag hacia Market/Selection/Awards | simulación integrada + evidencia |

No se aprueban cifras en G3C-9. Los targets observacionales requieren fuente,
fecha, cobertura, normalization y provenance. El efecto de facts sensibles y
los límites de profiles de Content son decisiones de diseño/producto, no una
regresión automática sobre datos históricos.

### 16.3 Diagnostics

- joint distribution awareness/sentiment;
- autocorrelación y half-life observada de cada state;
- fraction de cambio social explicada por causal/shared/specific factors;
- correlación Sporting↔Followers sin tratarla como invariant;
- cult players, elite-low-awareness y famous-negative-sentiment;
- state de Reputation/Social durante retirement, sin cerrar hazard;
- Social summaries frente a futura PRL/PBR, sin convertirlos en target causal;
- sensibilidad a nuevas partitions/markets;
- drift por cuantización y exactitud de vistas globales.

## 17. Tail y estabilidad

SMOKE/CALIBRATION/DEEP registran P90/P95/P99/P99.9 cuando el tamaño lo permite:

- global superstar reach;
- cult player con sporting modesto;
- elite con awareness baja;
- awareness alta y sentiment negativo/divisivo;
- attention viral breve;
- pérdida rápida o crecimiento enorme de followers;
- relevancia larga post-peak;
- engagement alto con audiencia pequeña y bajo con audiencia masiva;
- retired/low-performance player que conserva reputación.

Diagnostics de runaway feedback:

- crecimiento log-social explosivo;
- saturación permanente de unit states;
- colapso masivo a cero;
- oscilaciones alternantes de awareness/attention/followers;
- spectral amplification regional;
- followers fuera del rango representable.

La corrección se realiza sobre persistence, loadings, scales, mixtures y
profiles; nunca mediante max followers, max impulses, floors o clipping de
outliers.

## 18. Golden vectors requeridos

Cada fixture fija `VersionSet`, `parameterSetHash`, prior state, definitions,
facts, canonical order, draw words/uniforms/Z y expected intermediate values.

### 18.1 Inicialización

`InitialReputationContext` + profiles + initial facts + draws conocidos →
Sporting/evidence, awareness, sentiment, attention components, follower
partitions y engagement exactos. Incluir contexto sin initial evidence y otro
con home=current para probar cero duplicación.

### 18.2 Sporting Reputation

Prior stored state + dos facts de familias distintas + duplicate alias +
market exposures + Normal draws → accepted EvidenceKeys, direct/diffused
impulses, `zSNext`, evidence/source memories y quantized next state exactos.

### 18.3 Awareness y sentiment

Prior regional states + lagged Sporting/Attention + reach + impulses signed +
draws → predictors, awareness y sentiment exactos. Incluir awareness alta con
sentiment negativo.

### 18.4 Attention

Tres impulses en distinto input order, dos decay families y un causal factor →
misma suma canónica, componentes next y aggregate exactos. Otro fixture sin
impulses demuestra decay más rápido.

### 18.5 Followers

Prior `uint64` + new public states + reach + acquisition/churn draws + viral
Bernoulli/magnitude → rates, `ellCandidate`, `ellNext` y exact integer.
Fixtures separados:

- crecimiento sin viral;
- decline exacto;
- net change que redondea a cero;
- viral true/false y consumo de magnitude;
- zero followers;
- overflow → error tipado sin state/fact commit.

### 18.6 Engagement

Prior rate + exact followers next + public states + size + draws → `zENext` y
stored rate. Comparar misma audiencia con diferente attention y misma attention
con diferente scale.

### 18.7 Lag y regional

- same-award edition usa snapshot previo; su fact aparece solo en next batch;
- followers next no cambia awareness candidate del mismo batch;
- home=current no duplica evidence;
- fixed graph/weights produce exact markets/global views;
- añadir market no relacionado conserva todos los draw keys previos.

## 19. Monte Carlo suites

Se reutilizan `CalibrationSeedSet.SMOKE/CALIBRATION/DEEP` y sample counts
configurados por G3C-1.

| Suite | Propósito | Métricas mínimas |
|---|---|---|
| SMOKE | dominio/determinismo | invariants, idempotencia, domain errors, stream isolation, lag y integer followers |
| CALIBRATION | ajuste principal | distribuciones, autocorrelaciones, impulses/decay, follower paths, engagement, regional reach y cross-system correlations |
| DEEP | colas/estabilidad | P99/P99.9, viralidad, long relevance, feedback runaway, saturation/collapse/oscillation y overflow incidence |

Common random numbers comparan ParameterSets. Una ejecución con guard técnico
es `INCONCLUSIVE_GUARD_REACHED`, no una trayectoria válida.

## 20. Cierre de las tres decisiones

| ID | Estado G3C-9 | Matemática cerrada | Pendiente |
|---|---|---|---|
| G3B-K01 | `PARTIAL_CALIBRATION` | AR(1) logit regional, feature impulses, evidence gating, Normal hierarchy, domains/quantization | coefficients, market data, evidence targets y goldens aprobados |
| G3B-K02 | `PARTIAL_CALIBRATION` | canonical dedupe/sum, evidence memory, lagged one-pass diffusion, global projection y batch timing | persistence/diffusion values, source profiles y calibration evidence |
| G3B-K05 | `PARTIAL_CALIBRATION` | log-space acquisition/churn, Bernoulli viral mixture, uint64 conversion, engagement AR(1), correlations/streams | rates, sigmas, reach/audience data, social targets y goldens |

Ninguna conserva equation, distribution, sampler, quantization, ordering o
stream family abierta. El acumulado G3C pasa a **2 `RESOLVED_MATH`, 45
`PARTIAL_CALIBRATION` y 16 `PARTIAL`** asignadas a G3C-10/11.

## 21. Gates y blockers antes de G3C-10

G3C-10 puede especificarse sin reabrir estas ecuaciones. Permanecen bloqueos
para implementación:

1. valores completos y hash publicado de `reputationSocial`;
2. Definitions de mercados, partitions, reach y public profiles del slice
   (DR-025/data/content);
3. golden vectors cross-runtime y Monte Carlo aprobados;
4. schemas/fact payloads conformes a DR-063;
5. DR-062 queda `PARTIAL_CALIBRATION` tras G3C-10; faltan values/targets/goldens;
6. DR-069 queda resuelta por ADR-079;
7. ADR-080 ya cierra PRL/PBR/Scoring sin usar estas ecuaciones como score
   implícito; faltan cohorts/weights/goldens de publicación.

No se autoriza implementación.

## 22. Adapter G3C-10 — Retirement abierto y finalización

Con `PlayerPlayingStatus.RETIRED` y Career abierta, los batches de este
documento continúan sin cambio de ecuación. `RetirementOccurred` no genera un
impulse implícito: solo facts deportivos/públicos allowlisted posteriores pueden
actualizar states. `RetirementReputationSummary` entrega snapshots confirmados
de Sporting Reputation, awareness, attention y career relevance al predictor
de G3C-10; Followers nunca se usa como quality proxy.

`CareerFinalizationConfirmed` cierra el fact frontier. El batch anterior a ese
fact puede confirmarse normalmente; después no se generan nuevos gameplay
impulses. La consolidación terminal proyecta el último state confirmado sin
recalcular su historia. ADR-079 preserva el lag y evita cualquier loop
Retirement/Market/Reputation same-window.

## 44. Adapter de Scoring cerrado por G3C-11

PBR consume únicamente snapshots/facts sociales allowlisted ya cerrados. Usa
CDFs congeladas y una combinación exacta de final, sustained y peak; no copia
las ecuaciones de Reputation/Social, no usa impulses internos y no mapea
followers linealmente. `priorSportingPoints` excluye PRL y el cap se aplica en
Scoring. Reputation/Social nunca escribe ledger ni recibe puntos como feedback.
