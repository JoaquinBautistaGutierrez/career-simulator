# Especificación matemática de Transfers, Market & Contracts

## 1. Estado, alcance y autoridad

**Estado:** cierre matemático normativo de G3C-7; valores y calibración
pendientes.  
**Fecha:** 2026-07-29.  
**Decisiones G3B asignadas:** G3B-G01, G3B-G02, G3B-G03, G3B-G04 y
G3B-G07.  
**ADR principal:** [ADR-076](adr/076-transfer-market-contract-mathematics.md).  
**Refina:** [ADR-058](adr/058-transfer-market-contract-model.md),
[ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md) y
[ADR-075](adr/075-club-competition-world-mathematics.md).

Este documento selecciona ecuaciones, distribuciones, samplers, orden causal,
streams, invariantes y contratos de calibración para transferencias, mercado y
contratos. Complementa:

- [`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md);
- [`TRANSFER_MARKET_CONTRACT_SPEC.md`](TRANSFER_MARKET_CONTRACT_SPEC.md);
- [`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md);
- [`PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md`](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md);
- [`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md);
- [`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md).

No fija:

- coeficientes, intercepts, sigmas, utilities o tolerancias numéricas;
- moneda de referencia, catálogo de monedas, rates o fuente de conversión de
  DR-027;
- participantes externos, pool o continuidad fuera del tier de DR-065;
- reglas de inscripción de DR-066;
- ubicación de mercado mid-season de DR-067;
- matemática de Reputation, Selection, Awards, Retirement o Scoring;
- valores de calendario, políticas contractuales o datos reales;
- schemas TypeScript/Zod ni gameplay implementado.

Las fórmulas quedan cerradas aunque sus valores sigan en
`PARTIAL_CALIBRATION`. No se autoriza implementación oficial hasta publicar un
`EngineParameterSet` válido y resolver las policies aplicables.

## 2. Principios matemáticos

1. `MarketValueEstimate`, `TransferFee` y `SalaryTerms` son variables
   diferentes.
2. Market consume conocimiento autorizado, no `TruePlayerState`.
3. `ClubCandidateField`, `ClubNeed`, interés, oferta, respuesta, negociación,
   decisión y outcome conservan identidad y resolución separadas.
4. Todos los predictors probabilísticos son finitos y aditivos en espacio
   latente.
5. Todo outcome binario usa logistic más `BinomialInverseCdfV1(1,p)`.
6. Toda categoría excluyente usa `stableSoftmax` más
   `CategoricalCumulativeMidpointV1`.
7. Toda magnitud monetaria positiva se construye en log-space y se persiste
   como unidades menores enteras.
8. Dinero fuera del rango de representación produce error explícito; nunca
   saturación.
9. No existen thresholds de edad, calidad, prestigio, fee o salario.
10. No existen caps de intereses, ofertas, transferencias, fees o salarios.
11. La elección explícita del usuario no consume RNG.
12. Reanudar una decisión no vuelve a resolver percepción, terms, respuestas o
    negociación.
13. Market nunca consume CareerScore, IJL o `ScoreLedger`.
14. `ContractExpectation` no asigna `SportingRole`, minutos ni uso.
15. Scoring no participa en ninguna ecuación de este documento.

## 3. Pipeline matemático congelado

El pipeline de una oportunidad de mercado es:

```text
MarketWindowContext + snapshots autorizados
→ MarketPerception
→ ClubNeed
→ ClubCandidateField
→ PlayerClubFit
→ TransferInterest
→ BidderCompetitionField
→ OfferPropensity
→ TransferOffer
→ seller/holding-club response, cuando corresponda
→ ContractProposal
→ aggregate Negotiation
→ PlayerDecision, cuando corresponda
→ TransferOutcome
→ ContractState / LoanAgreement / PlayerClubAffiliation
→ RegistrationEligibility separada
```

Semántica:

- `TransferInterest` no contiene una oferta implícita;
- `TransferOffer` es la propuesta económica/de movimiento del comprador;
- `ContractProposal` es un objeto separado y queda ligado a la oferta;
- el fact `TransferOfferCreated` puede existir antes de la respuesta del
  vendedor, pero cualquier `PendingDecision` solo expone términos finales
  completos y congelados;
- free transfer omite respuesta del vendedor y fee stochastic;
- renewal omite vendedor, fee y cambio de club;
- loan conserva contrato y club contractual;
- una ruta lógicamente inexistente no consume draws.

La separación `TransferOffer`/`ContractProposal` refina el payload conceptual
de ADR-058. No crea un nuevo fact canónico: la evolución posterior de términos
usa `NegotiationUpdated`.

## 4. Dominios y adapters canónicos

### 4.1 Valores acotados

Se reutiliza:

```text
StoredUnit = integer [0, 10000]
unit(s) = s / 10000
center01(x) = 2*x - 1
```

Los inputs normalizados usan:

| Input | Dominio de cálculo | Owner |
|---|---:|---|
| perceivedQuality | `[0,1]` | PlayerKnowledge/MarketPerception |
| perceivedPotential | `[0,1]` | PlayerKnowledge/MarketPerception |
| perceptionConfidence | `[0,1]` | PlayerKnowledge |
| perceptionUncertainty | `[0,1]` | PlayerKnowledge |
| recentPerformance | `[-1,1]` | Performance projection |
| performanceEvidence | `[0,1]` | Performance |
| healthRiskCommunicated | `[0,1]` | Health knowledge projection |
| sportingReputation | `[0,1]` | Reputation |
| publicReputation | `[0,1]` | Reputation; solo consumers autorizados |
| positionScarcity | `[0,1]` | World |
| marketHeat | `[0,1]` | World |
| wageEnvironment | `[0,1]` más contexto monetario | World/Data |
| financialPower | `[0,1]` | Club |
| prestige | `[0,1]` | Club |
| sportingStrength dimensions | `[0,1]` | Club |
| PositionCompetition dimensions | `[0,1]` | Club |
| TacticalFit | `(0,1)` | Club/Player adapter |
| expectedOpportunity | `[0,1]` | Role & Minutes forecast adapter |

`perceivedPotential` es una estimación de upside/trayectoria, no un
`potentialOverall` verdadero. `healthRiskCommunicated` nunca revela
`injuryFragility`, `recoveryCapacity` o episodios no autorizados.

### 4.2 Señal de Performance para Market

Para un summary cerrado `s`:

```text
marketPerformanceSignal_s =
  performanceEvidence_s
  * recentPerformance_s
```

Por varios summaries en el horizonte de Market:

```text
w_s =
  recencyWeight_s
  * performanceEvidence_s
  * exposureWeight_s

recentPerformanceMarket =
  if sum_s(w_s) = 0:
    0
  else:
    sum_s(w_s * recentPerformance_s) / sum_s(w_s)

marketEvidence =
  if any_s(performanceEvidence_s = 1):
    1
  else:
    -expm1(
      sum_s(
        stableLog1p(-performanceEvidence_s)
      )
    )
```

`recencyWeight_s` y `exposureWeight_s` son inputs derivados parametrizados. Se
evalúan en orden canónico de `PerformanceSegment`. Production observable se
conserva como vector purpose-scoped; no se reduce a goals para todas las
posiciones. El branch exacto para evidencia unitaria evita evaluar
`stableLog1p(-1)`; con una colección vacía, `marketEvidence = 0`.

### 4.3 Edad de dominio

Market consume:

```text
ageSeasons >= 0
```

derivado por Calendar desde tiempo de dominio. No lee fecha del reloj. La
fórmula no depende de que el label visible sea un año calendario real.

### 4.4 Adaptador monetario

Cada resolución económica recibe:

```text
MonetaryContext {
  monetaryContextId
  calculationCurrencyCode
  minorUnitsPerMajorUnit
  schemaExactIntegerMax
  valuationScaleRef
  wageScaleRef
  conversionSnapshotRef?
  dataVersion
}
```

`calculationCurrencyCode` no se infiere. Si dos inputs usan monedas diferentes,
solo pueden combinarse después de una conversión exacta autorizada por un
`CurrencyConversionSnapshot`. Sin snapshot, la operación es
`MONETARY_CONTEXT_INCOMPARABLE`; no se asume paridad.

## 5. MarketPerception

### 5.1 Snapshot por observador

Para jugador `p`, observador `o` y contexto `m`:

```text
MarketPerception {
  perceptionId
  playerId
  observerId
  marketWindowContextId
  perceivedQuality
  perceivedPotential
  recentPerformanceMarket
  marketEvidence
  observedProductionProjection
  healthRiskCommunicated
  sportingReputation
  uncertainty
  sourceKnowledgeRefs
  factorRefs
}
```

La proyección es inmutable dentro de la oportunidad de Market. Un cambio
posterior crea otro `perceptionId`; no muta la anterior.

### 5.2 Dispersión por incertidumbre

La dispersión efectiva de evaluación es:

```text
sigmaPerception[o] =
  softplus(
    sigmaPerceptionBase[observerClass(o)]
    + betaPerceptionUncertainty
      * perceptionUncertainty[o]
  )
```

Constraint:

```text
betaPerceptionUncertainty >= 0
```

Mayor incertidumbre no reduce la varianza de valoración, manteniendo los demás
inputs fijos. No altera por sí sola la media.

## 6. AgeValueSignal

Para posición `p`:

```text
upsideSignal(age,p) =
  stableSigmoid(
    (ageUpsideCenter[p] - ageSeasons)
    / ageUpsideScale[p]
  )

horizonSignal(age,p) =
  stableSigmoid(
    (ageHorizonCenter[p] - ageSeasons)
    / ageHorizonScale[p]
  )

ageValueSignal(age,p) =
    ageUpsideWeight[p] * upsideSignal(age,p)
  + (1 - ageUpsideWeight[p]) * horizonSignal(age,p)
```

Constraints:

```text
ageUpsideScale[p] > 0
ageHorizonScale[p] > 0
0 <= ageUpsideWeight[p] <= 1
```

La señal pertenece estrictamente a `(0,1)` para edad finita. Puede caer
suavemente sin llegar a cero por una edad determinada. Contextos/posiciones
pueden tener parámetros diferentes.

Age no modifica directamente perceived quality ni Performance. Expresa
upside/resale/horizon esperado de mercado.

## 7. Contract leverage

### 7.1 Inputs

Contract produce:

```text
remainingContractUnits >= 0
contractTotalUnits > 0
contractTimingSignal ∈ [0,1]
currentSalaryLogMinor? finite
contractExpectation?
```

El significado exacto de la unidad temporal y el punto de evaluación continúa
en DR-021/067. Las ecuaciones solo requieren orden y diferencia válidos.

### 7.2 Expiry y duración

```text
remainingShare =
  remainingContractUnits / contractTotalUnits

expiryProximity =
  safeExp(
    -contractExpiryRate
    * remainingContractUnits
  )
```

El input debe satisfacer
`0 <= remainingContractUnits <= contractTotalUnits`; violarlo es un error de
contrato y no se corrige mediante clipping. `contractExpiryRate > 0`. No existe
un año contractual con descuento fijo.

Para `UNATTACHED` sin contrato activo no se exige `contractTotalUnits`:

```text
remainingShare = 0
expiryProximity = 1
sellerLeverage = NOT_APPLICABLE
```

`playerLeverage` sí se resuelve con `I(affiliationStatus=UNATTACHED)`. No se
crea seller ni se consume un draw de seller response.

### 7.3 Seller y player leverage

```text
etaSellerLeverage =
    sellerLeverageIntercept
  + betaSellerRemainingShare * center01(remainingShare)
  - betaSellerExpiry * center01(expiryProximity)
  + betaSellerCurrentClubNeed * center01(currentClubNeedForPlayer)
  + betaSellerReplacementDifficulty * center01(replacementDifficulty)
  - betaSellerFinancialNeed * center01(sellerFinancialNeed)

sellerLeverage =
  stableSigmoid(etaSellerLeverage)

etaPlayerLeverage =
    playerLeverageIntercept
  + betaPlayerExpiry * center01(expiryProximity)
  + betaPlayerBidCompetition * center01(bidderCompetition)
  + betaPlayerReputation * center01(sportingReputation)
  + betaPlayerUnattached * I(affiliationStatus = UNATTACHED)

playerLeverage =
  stableSigmoid(etaPlayerLeverage)
```

Los betas con semántica monotónica declarada son no negativos. Leverage modifica
distribuciones de términos; no es un threshold de aceptación.

## 8. PositionScarcity

World entrega:

```text
PositionScarcityContext {
  regionId
  position
  marketWindowContextId
  scarcity: StoredUnit
  evidence/field refs
}
```

La transformación canónica es:

```text
scarcitySignal = center01(unit(scarcity))
```

No se usa `1/(1-scarcity)` ni otra forma singular. La misma señal puede tener
coeficientes distintos para valuation, need, interest, fee y salary.

## 9. ClubNeed

### 9.1 Ownership

Club/World conserva ownership del contexto causal. G3C-7 define el resolver
matemático market-purpose que produce `ClubNeedAssessment`; no crea plantilla
ni modifica `PositionCompetition`.

### 9.2 Desired quality gap

```text
desiredQualityGap[c,p] =
  stableSigmoid(
    needGapSlope[p]
    * (
        desiredQualityTarget[clubStrategyClass(c),p]
        - competitionStrength[c,p]
      )
  )
```

`desiredQualityTarget[clubStrategyClass,p] ∈ [0,1]` pertenece al ParameterSet y
`needGapSlope[p] > 0`. Manteniendo lo demás fijo, mayor competencia reduce este
gap y un target más exigente lo aumenta. El valor `0.5` representa target y
competencia iguales; no es un threshold.

### 9.3 Predictor

```text
etaNeed[c,p,t] =
    needIntercept[clubStrategyClass(c),p]
  + betaNeedQualityGap[p]
      * center01(desiredQualityGap[c,p])
  + betaNeedDepth[p]
      * (1 - competitionDepth[c,p])
  + betaNeedEntrenchment[p]
      * (1 - entrenchment[c,p])
  + betaNeedTacticalDemand[p]
      * center01(tacticalDemand[c,p])
  + betaNeedStrategy[p]
      * center01(positionStrategyPriority[c,p])
  + betaNeedFinance[p]
      * center01(financialPower[c])
  + betaNeedScarcity[p]
      * scarcitySignal[p,region]
  + betaNeedPersistence[p]
      * center01(previousNeed[c,p])
  + lambdaNeedMarket[p] * ZmarketWindow[t]
  + lambdaNeedRegion[p] * ZmarketRegion[region,t]
  + lambdaNeedClub[p] * ZclubStrategy[c,t]
  + sigmaNeed[p] * ZneedSpecific[c,p,t]

clubNeed[c,p,t] =
  stableSigmoid(etaNeed[c,p,t])
```

Constraints:

```text
needGapSlope > 0
betaNeedQualityGap >= 0
betaNeedDepth >= 0
betaNeedEntrenchment >= 0
betaNeedTacticalDemand >= 0
betaNeedFinance finite
betaNeedScarcity >= 0
0 <= betaNeedPersistence
sigmaNeed >= 0
```

`previousNeed` es el último assessment cerrado compatible, no un cooldown.
Aunque la necesidad anterior sea baja, la probabilidad de interés posterior
permanece positiva.

## 10. MarketOpportunityProjection

Market no samplea un `SportingRole` futuro. Solicita a Role & Minutes una
proyección determinista:

```text
MarketOpportunityProjection {
  candidateClubId
  effectivePosition
  expectedRoleProbabilities
  expectedMinuteShare
  evidence/assumption refs
}
```

El adapter:

1. usa las utilities de role y share de ADR-072;
2. sustituye el previous state por el prior market-purpose parametrizado;
3. no consume categorical ni Normal draws;
4. calcula esperanza por `stableSoftmax` y
   `LogitNormalMeanGaussHermite10V1`;
5. no emite `SportingRoleAssigned`, `MinutesRecorded` ni facts;
6. no garantiza la oportunidad que recibirá el jugador.

La señal consumida es:

```text
expectedOpportunity ∈ [0,1]
```

## 11. PlayerClubFit

### 11.1 Level match suave

```text
levelDifference =
  candidateClubSportingLevel
  - perceivedQuality

levelMatch =
  safeExp(
    -playerClubLevelMatchRate
    * levelDifference^2
  )
```

`playerClubLevelMatchRate > 0`. Ningún nivel vuelve el fit exactamente cero.

### 11.2 Predictor

```text
etaPlayerClubFit[c] =
    playerClubFitIntercept[position]
  + betaFitPositionSuitability[position]
      * center01(perceivedPositionSuitability[c])
  + betaFitTactical[position]
      * center01(tacticalFit[c])
  + betaFitNeed[position]
      * center01(clubNeed[c,position])
  + betaFitOpportunity[position]
      * center01(expectedOpportunity[c])
  + betaFitLevel[position]
      * center01(levelMatch[c])
  + betaFitAdaptation[position]
      * center01(perceivedAdaptationFit[c])
  + betaFitProject[position]
      * center01(sportingProjectSignal[c])
  + fitInteractionSuitabilityTactical[position]
      * center01(perceivedPositionSuitability[c])
      * center01(tacticalFit[c])
  + fitInteractionNeedOpportunity[position]
      * center01(clubNeed[c,position])
      * center01(expectedOpportunity[c])

playerClubFit[c] =
  stableSigmoid(etaPlayerClubFit[c])
```

Todos los inputs son percibidos/autorizados. `prestige` no sustituye fit.

## 12. ClubCandidateField

### 12.1 Política elegida

V1 adopta **enumeración determinista del scope autorizado**, no un sampler de
cantidad de candidatos:

```text
authorized club identities
→ logical operation eligibility
→ required context completeness
→ canonical sort by clubId UTF-8
→ ClubCandidateField
```

Solo se excluyen:

- club sin identidad autorizada;
- operación no permitida por `MarketWindowContext`;
- incompatibilidad contractual/legal ya confirmada;
- ausencia de un adapter obligatorio;
- current club cuando el tipo de operación exige destino diferente;
- contenido deshabilitado por data/policy.

No se excluye por edad, calidad, prestige, league, need, fit o affordability.
Esas variables afectan probabilidades posteriores.

### 12.2 Candidatos fuera del tier

Un club externo solo entra si DR-065 entrega una identidad y el adapter mínimo
de §27. La ausencia del pool no significa `P(interest)=0`: significa
`MARKET_SCOPE_UNAVAILABLE` para ese scope todavía no implementable.

### 12.3 Multiplicidad

Cada candidato se evalúa con una key independiente. Cero, uno o múltiples
intereses emergen de los Bernoulli de §13. No existe:

- field-size cap;
- ranking que solo conserve top-N;
- cuota por liga;
- límite de ofertas por temporada.

## 13. TransferInterest

### 13.1 Persistencia elegida

Se adopta una transición binaria de primer orden. El estado anterior añade un
intercept, pero nunca obliga a persistir:

```text
interestPersistenceTerm =
  interestTransitionIntercept[
    previousInterestState
  ]

previousInterestState ∈ {
  NONE,
  ACTIVE
}
```

Ambos intercepts deben ser finitos. Por tanto, con predictor finito:

```text
0 < P(activeNext) < 1
```

No existe cooldown ni duración mínima.

### 13.2 Predictor

```text
etaInterest[c] =
    interestIntercept[operationClass,position]
  + betaInterestFit
      * center01(playerClubFit[c])
  + betaInterestNeed
      * center01(clubNeed[c,position])
  + betaInterestQuality
      * center01(perceivedQuality[c])
  + betaInterestPotential
      * center01(perceivedPotential[c])
  + betaInterestPerformance
      * recentPerformanceMarket
  + betaInterestEvidence
      * center01(marketEvidence)
  + betaInterestReputation
      * center01(sportingReputation)
  + betaInterestFinancial
      * center01(preOfferFinancialFeasibility[c])
  + betaInterestContract
      * contractInterestSignal
  + betaInterestMarketHeat
      * center01(marketHeat)
  - betaInterestHealthRisk
      * healthRiskCommunicated
  + interestPersistenceTerm
  + lambdaInterestMarket * ZmarketWindow
  + lambdaInterestRegion * ZmarketRegion
  + lambdaInterestClub * ZclubStrategy[c]
  + sigmaInterestClub * ZinterestSpecific[c,player,window]

pInterest[c] =
  stableSigmoid(etaInterest[c])

interestActiveNext[c] =
  BinomialInverseCdfV1(
    n = 1,
    p = pInterest[c]
  )
```

El draw Bernoulli usa una key propia. Los Normal factors del predictor se
referencian, no se resamplean.

Constraints monotónicas:

```text
betaInterestFit >= 0
betaInterestNeed >= 0
betaInterestQuality >= 0
betaInterestPotential >= 0
betaInterestPerformance >= 0
betaInterestEvidence may be signed only with documented calibration rationale
betaInterestFinancial >= 0
betaInterestHealthRisk >= 0
sigmaInterestClub >= 0
```

Un `ACTIVE → ACTIVE` actualiza la entidad causal; no emite otro
`TransferInterestGenerated` para la misma occurrence.

## 14. BidderCompetitionField

### 14.1 Intensidad derivada

Para cada interés activo `c`:

```text
logBidIntensity[c] =
    bidderIntensityIntercept
  + betaBidIntensityNeed
      * center01(clubNeed[c])
  + betaBidIntensityFit
      * center01(playerClubFit[c])
  + betaBidIntensityPrestige
      * center01(prestige[c])
  + betaBidIntensityFinance
      * center01(financialPower[c])

bidIntensity[c] =
  safeExp(logBidIntensity[c])
```

El dominio válido del ParameterSet garantiza finitud de cada intensidad.

### 14.2 Field

```text
rawBidCompetition =
  stableLog1p(
    sum_c(
      I(interestActive[c])
      * bidIntensity[c]
    )
  )

etaBidCompetition =
    bidderCompetitionIntercept
  + betaBidCountIntensity * rawBidCompetition
  + betaBidPlayerReputation
      * center01(sportingReputation)
  + betaBidScarcity * scarcitySignal
  + betaBidMarketHeat * center01(marketHeat)

bidderCompetition =
  stableSigmoid(etaBidCompetition)
```

Se acumula en orden canónico de `clubId`. No usa RNG propio. El field puede ser
bajo aun con varios intereses débiles o alto con pocos intereses intensos.

## 15. Financial feasibility

### 15.1 Capacidades monetarias agregadas

Sin implementar contabilidad:

```text
logTransferCapacity[c] =
    transferCapacityCurrencyIntercept[context]
  + betaTransferCapacityFinance
      * center01(financialPower[c])
  + betaTransferCapacityMarket
      * center01(marketHeat)
  + betaTransferCapacityStrategy
      * center01(spendingStrategy[c])

logSalaryCapacity[c] =
    salaryCapacityCurrencyIntercept[context]
  + betaSalaryCapacityFinance
      * center01(financialPower[c])
  + betaSalaryCapacityWage
      * center01(wageEnvironment)
  + betaSalaryCapacityStrategy
      * center01(wageStrategy[c])
```

Estos son contextos de capacidad, no budgets contables ni Money persistido.

### 15.2 Pre-offer medians

Antes de samplear terms se usan las medianas deterministas:

```text
medianFeeLog =
  feeLocationWithoutSpecificShock

medianSalaryLog =
  salaryLocationWithoutSpecificShock
```

No se consume RNG para decidir si puede existir una oferta.

### 15.3 Predictor

```text
feePressure =
  softplus(
    medianFeeLog
    - logTransferCapacity[c]
  )

salaryPressure =
  softplus(
    medianSalaryLog
    - logSalaryCapacity[c]
  )

etaFinancialFeasibility[c] =
    financialFeasibilityIntercept
  - betaFeasibilityFeePressure * feePressure
  - betaFeasibilitySalaryPressure * salaryPressure
  + betaFeasibilityFinance
      * center01(financialPower[c])
  + betaFeasibilityPlayerLeverage
      * center01(playerLeverage)

financialFeasibility[c] =
  stableSigmoid(etaFinancialFeasibility[c])
```

Para free transfer, `feePressure=0` por inexistencia lógica del fee. Para loan
V1 sin loan fee, también es `0`; salary capacity solo se usa si la policy exige
un nuevo compromiso monetario autorizado.

## 16. Offer propensity

Condicionado a `interestActive[c]`:

```text
etaOffer[c] =
    offerIntercept[operationClass]
  + betaOfferNeed
      * center01(clubNeed[c])
  + betaOfferFeasibility
      * center01(financialFeasibility[c])
  + betaOfferUrgency
      * center01(marketUrgency)
  + betaOfferBidCompetition
      * center01(bidderCompetition)
  + betaOfferContractOpportunity
      * contractOfferSignal
  + betaOfferObservableWillingness
      * observableWillingnessSignal
  + betaOfferFit
      * center01(playerClubFit[c])
  + lambdaOfferMarket * ZmarketWindow
  + lambdaOfferRegion * ZmarketRegion
  + lambdaOfferClub * ZclubStrategy[c]
  + sigmaOfferSpecific * ZofferSpecific[c,player,window]

pOffer[c | interest] =
  stableSigmoid(etaOffer[c])

offerCreated[c] =
  BinomialInverseCdfV1(
    1,
    pOffer[c | interest]
  )
```

Si no existe interés activo:

- `offerCreated=false`;
- no se evalúa el predictor;
- no se consume Normal específico ni Bernoulli de offer;
- no se samplean terms.

`observableWillingnessSignal=0` es neutral cuando no existe una preferencia
comunicada autorizada. No lee la futura elección del usuario.

## 17. Operation pathway

Para una oferta creada, se filtran únicamente tipos lógicamente permitidos:

```text
PERMANENT_TRANSFER
LOAN
FREE_TRANSFER
```

Reglas:

- contrato activo con seller: permanent y/o loan según policy;
- jugador unattached: free transfer;
- una categoría imposible se elimina antes de softmax;
- renewal se evalúa por §23, fuera de este categorical.

Para categoría válida `k`:

```text
uOperation[k] =
    operationIntercept[k]
  + betaOperationAge[k] * center01(ageValueSignal)
  + betaOperationOpportunity[k] * center01(expectedOpportunity)
  + betaOperationNeed[k] * center01(clubNeed)
  + betaOperationContract[k] * contractOperationSignal
  + betaOperationDevelopment[k] * developmentOpportunitySignal
  + betaOperationPreference[k] * observableWillingnessSignal

P(operation=k) =
  stableSoftmax(uOperation)[k]
```

El resultado usa `CategoricalCumulativeMidpointV1` en el orden canónico
anterior restringido a categorías válidas.

## 18. Valuation

### 18.1 Valoración latente por club

```text
etaValue[c] =
    valuationIntercept[position,marketContext]
  + betaValueQuality[position]
      * center01(perceivedQuality[c])
  + betaValuePotential[position]
      * center01(perceivedPotential[c])
  + betaValuePerformance[position]
      * recentPerformanceMarket
  + betaValueEvidence[position]
      * center01(marketEvidence)
  + betaValueAge[position]
      * center01(ageValueSignal)
  + betaValueScarcity[position]
      * scarcitySignal
  + betaValueReputation[position]
      * center01(sportingReputation)
  + betaValueContract[position]
      * contractValueSignal
  + betaValueMarket[position]
      * center01(marketHeat)
  - betaValueHealthRisk[position]
      * healthRiskCommunicated
  + valueInteractionQualityPotential[position]
      * center01(perceivedQuality[c])
      * center01(perceivedPotential[c])
  + valueInteractionPerformanceEvidence[position]
      * recentPerformanceMarket
      * center01(marketEvidence)
  + lambdaValueMarket[position] * ZmarketWindow
  + lambdaValueRegion[position] * ZmarketRegion
  + lambdaValueClub[position] * ZclubEvaluation[c]
  + sigmaPerception[c] * ZvaluationSpecific[c,player,window]
```

`ZclubEvaluation` puede compartirse con evaluaciones del mismo club en esa
ventana; `ZvaluationSpecific` pertenece al par club-jugador.

### 18.2 Transform monetario

```text
logClubReferenceValueMinor[c] =
    logValuationCurrencyScale[monetaryContext]
  + etaValue[c]

clubReferenceValue[c] =
  positiveMoneyQuantizeV1(
    logClubReferenceValueMinor[c],
    monetaryContext
  )
```

No existe multiplicación directa de Money por un double persistido.

### 18.3 MarketReferenceValue

Se conserva porque tiene consumers de UI/narrativa, fee anchor y auditoría,
pero no es verdad objetiva.

Un `ReferenceValuationPanel` data-driven, independiente de los intereses
realizados, contiene observadores de referencia y pesos positivos. Para cada
miembro `j` se calcula `logClubReferenceValueMinor[j]` con la misma fórmula.

```text
logMarketReferenceValue =
  weightedMedianCanonical(
    {
      logClubReferenceValueMinor[j],
      referencePanelWeight[j],
      referenceObserverId[j]
    }
  )

MarketReferenceValue =
  positiveMoneyQuantizeV1(
    logMarketReferenceValue,
    monetaryContext
  )
```

`weightedMedianCanonical`:

1. valida pesos finitos y estrictamente positivos;
2. ordena por log-value ascendente y luego `referenceObserverId` UTF-8;
3. normaliza pesos por suma total;
4. devuelve el primer valor cuya CDF de peso alcanza `0.5`;
5. no usa RNG.

El panel y sus pesos pertenecen a data/ParameterSet versionados. No se usa el
promedio de ofertas ni de interesados, evitando circularidad.

## 19. Cuantización monetaria y seguridad

### 19.1 `positiveMoneyQuantizeV1`

Para `logAmountMinor` finito:

```text
rawAmountMinor =
  safeExp(logAmountMinor)

roundedAmountMinor =
  ROUND_HALF_EVEN(rawAmountMinor)

amountMinor =
  maxLogical(
    1,
    roundedAmountMinor
  )
```

El mínimo `1` es el dominio lógico de una cantidad declarada positiva, no un
floor económico de balance. Aplica a MarketValue y salary.

### 19.2 `nonNegativeMoneyQuantizeV1`

Para fees que semánticamente admiten cero:

```text
amountMinor =
  maxLogical(
    0,
    ROUND_HALF_EVEN(
      safeExp(logAmountMinor)
    )
  )
```

Una transferencia permanente con contrato activo usa el modelo positivo del
§20. Free transfer usa exactamente cero sin llamar a `safeExp`.

### 19.3 Overflow y rango técnico

Antes de `safeExp`:

```text
logAmountMinor <=
  safeLog(schemaExactIntegerMax)
```

Después de cuantizar:

```text
amountMinor <= schemaExactIntegerMax
```

Una violación produce `MoneyRepresentationOverflow` con `formulaId`,
monetaryContext y log-amount sanitizado. No:

- clampa al máximo;
- reintenta otro draw;
- cambia la moneda;
- convierte el evento en free transfer;
- crea un cap de gameplay.

La distribución matemática sigue teniendo cola derecha. DR-027 debe aprobar el
rango interoperable. Los ParameterSets se rechazan si su riesgo de overflow en
los CalibrationSeedSets/targets excede la tolerancia operacional publicada;
esa validación no transforma outcomes.

### 19.4 Underflow

`safeExp` subnormal/cero antes de la cuantización es error de conformidad del
perfil, salvo que la fórmula declare una cantidad lógicamente cero. Para
cantidades positivas no se convierte silenciosamente en cero.

## 20. TransferFee y seller response

### 20.1 Anchor

Para permanent transfer con seller:

```text
logFeeAnchor =
    feeAnchorBuyerWeight
      * logClubReferenceValueMinor[buyer]
  + feeAnchorSellerWeight
      * logClubReferenceValueMinor[seller]
  + feeAnchorMarketWeight
      * logMarketReferenceValue
```

Constraints:

```text
each feeAnchorWeight >= 0
sum(feeAnchorWeights) = 1
```

### 20.2 Fee proposal

```text
logFeeProposal =
    logFeeAnchor
  + betaFeeSellerLeverage
      * center01(sellerLeverage)
  + betaFeeBuyerUrgency
      * center01(marketUrgency)
  + betaFeeBidCompetition
      * center01(bidderCompetition)
  + betaFeeMarketHeat
      * center01(marketHeat)
  + betaFeeScarcity
      * scarcitySignal
  + betaFeeProposalAggressiveness
      * center01(buyerProposalAggressiveness)
  + lambdaFeeMarket * ZmarketWindow
  + lambdaFeeRegion * ZmarketRegion
  + sigmaFee * ZfeeSpecific[offerId]

TransferFee =
  positiveMoneyQuantizeV1(
    logFeeProposal,
    monetaryContext
  )
```

`ZfeeSpecific` usa `StandardNormalInverseCdfV1`. No existe fee cap.
La negociación ocurre después de congelar esta propuesta: V1 no añade un
`negotiationEffect` retrospectivo ni vuelve a samplear el fee. El efecto de
negociación vive en la probabilidad de acuerdo sobre términos ya propuestos.
Una futura revisión de términos requeriría otro proceso versionado y no está
habilitada en V1.

### 20.3 Free transfer y loan

```text
if operation = FREE_TRANSFER:
  TransferFee.amountMinor = 0
  no fee draw

if operation = LOAN and V1 loan fee is not enabled:
  no TransferFee
  no fee draw
```

V1 no modela loan fee ni wage split porque no tienen consumer aprobado.

### 20.4 Seller reservation

```text
logSellerReservation =
    logClubReferenceValueMinor[seller]
  + betaReservationCurrentNeed
      * center01(currentClubNeedForPlayer)
  + betaReservationContract
      * center01(sellerLeverage)
  + betaReservationReplacement
      * center01(replacementDifficulty)
  - betaReservationFinancialNeed
      * center01(sellerFinancialNeed)
  + betaReservationWindowUrgency
      * center01(sellerWindowUrgency)
  + sigmaReservation
      * ZsellerReservation[offerId]
```

Reservation es latente y no se presenta como MarketValue.

### 20.5 Seller response

```text
relativeOfferSignal =
  (
    logFeeProposal
    - logSellerReservation
  )
  / sellerResponseScale

etaSellerResponse =
    sellerResponseIntercept
  + betaSellerRelativeOffer
      * relativeOfferSignal
  + betaSellerFinancialNeedResponse
      * center01(sellerFinancialNeed)
  - betaSellerReplacementResponse
      * center01(replacementDifficulty)
  + betaSellerPlayerWillingness
      * observableWillingnessSignal
  + betaSellerWindowUrgency
      * center01(sellerWindowUrgency)
  + sigmaSellerResponse
      * ZsellerResponseSpecific[offerId]

pSellerProceed =
  stableSigmoid(etaSellerResponse)

sellerProceed =
  BinomialInverseCdfV1(
    1,
    pSellerProceed
  )
```

`sellerProceed` autoriza generar la propuesta contractual y continuar a la
negociación; no es todavía el acuerdo final entre clubes. Esto mantiene
separados response y negotiation sin volver a samplear el fee.

`sellerResponseScale > 0`. Para free transfer/renewal:

```text
sellerResponseRequirement = NOT_REQUIRED
no seller response draw
```

## 21. ContractProposal

### 21.1 Orden de resolución

Después de una respuesta de seller compatible:

```text
ContractExpectation
→ contract duration
→ salary
→ immutable ContractProposal
```

Para loan:

```text
loan duration
→ temporary ContractExpectation
→ LoanProposal
```

No se genera salary nueva ni wage split en V1 loan.

### 21.2 ContractExpectation

Orden canónico:

```text
DEVELOPMENT
SQUAD
IMPORTANT
MARQUEE
```

Para expectativa `e`:

```text
uExpectation[e] =
    expectationIntercept[e]
  + betaExpectationQuality[e]
      * center01(perceivedQuality)
  + betaExpectationPotential[e]
      * center01(perceivedPotential)
  + betaExpectationAge[e]
      * center01(ageValueSignal)
  + betaExpectationNeed[e]
      * center01(clubNeed)
  - betaExpectationCompetition[e]
      * center01(competitionStrength)
  + betaExpectationOpportunity[e]
      * center01(expectedOpportunity)
  + betaExpectationSportingLevel[e]
      * center01(candidateClubSportingLevel)
  + betaExpectationNegotiation[e]
      * center01(playerLeverage)

P(expectation=e) =
  stableSoftmax(uExpectation)[e]
```

Se samplea mediante `CategoricalCumulativeMidpointV1`. No existe mapping a
SportingRole.

### 21.3 Contract duration

`ContractPolicy`/Data entrega un vector no vacío:

```text
allowedContractTerms =
  canonicalSort(
    positive DomainDuration options
  )
```

No se hardcodea un catálogo de años dentro del engine.

Para opción `d`:

```text
uContractDuration[d] =
    durationIntercept[d,operationClass]
  + betaDurationAge[d]
      * center01(ageValueSignal)
  + betaDurationValue[d]
      * centeredLogMarketReferenceValue
  + betaDurationExpectation[d,expectation]
  + betaDurationClubFinance[d]
      * center01(financialPower)
  + betaDurationPlayerLeverage[d]
      * center01(playerLeverage)
  + betaDurationMarket[d]
      * center01(marketHeat)

P(duration=d) =
  stableSoftmax(uContractDuration)[d]
```

El categorical usa orden ascendente de duración y tie-break por term ID.

### 21.4 Salary

```text
salaryAgeSignal =
  salaryAgeIntercept[position]
  + salaryAgeWeight[position]
    * center01(ageValueSignal)

logSalaryProposal =
    logSalaryCurrencyScale[monetaryContext]
  + salaryIntercept[position]
  + betaSalaryQuality[position]
      * center01(perceivedQuality)
  + betaSalaryReputation[position]
      * center01(sportingReputation)
  + betaSalaryExpectation[position,expectation]
  + betaSalaryFinance[position]
      * center01(financialPower)
  + betaSalaryWageEnvironment[position]
      * center01(wageEnvironment)
  + betaSalaryBidCompetition[position]
      * center01(bidderCompetition)
  + salaryAgeSignal
  + betaSalaryPlayerLeverage[position]
      * center01(playerLeverage)
  + lambdaSalaryMarket * ZmarketWindow
  + lambdaSalaryRegion * ZmarketRegion
  + lambdaSalaryClub * ZclubWagePolicy[buyer]
  + sigmaSalary[position] * ZsalarySpecific[offerId]

SalaryTerms.amount =
  positiveMoneyQuantizeV1(
    logSalaryProposal,
    monetaryContext
  )
```

La base temporal V1 es por temporada contractual, según ADR-058. Salary no se
deriva de fee.

### 21.5 Clauses

V1 no incluye cláusulas avanzadas. `clauseRefs=[]` es válido. Añadir release
clause, option-to-buy, bonuses o wage split exige Definition/schema/versionado
propio; este math spec no inventa sus distributions.

## 22. Player offer utility

### 22.1 Señales monetarias

```text
salaryUtility =
  center01(
    stableSigmoid(
      (
        logSalaryProposal
        - logPlayerReferenceSalary
      )
      / playerSalaryUtilityScale
    )
  )
```

`playerSalaryUtilityScale > 0`.

### 22.2 Utility de oferta

```text
UplayerOffer[o] =
    playerOfferIntercept[operationClass]
  + betaPlayerSalary * salaryUtility[o]
  + betaPlayerPrestige
      * center01(prestige[o.club])
  + betaPlayerSportingProject
      * center01(sportingProjectSignal[o.club])
  + betaPlayerOpportunity
      * center01(expectedOpportunity[o.club])
  + betaPlayerExpectation[o.contractExpectation]
  + betaPlayerLeague
      * center01(playerLeaguePreferenceFit[o.club])
  + betaPlayerMorale
      * center01(moraleContext)
  + betaPlayerAdaptation
      * center01(perceivedAdaptationFit[o.club])
  + betaPlayerAmbitionPrestige
      * center01(ambition)
      * center01(prestige[o.club])
  + betaPlayerAmbitionSporting
      * center01(ambition)
      * center01(candidateClubSportingLevel[o.club])
  + preferenceInteractionTerms[o]
```

`ambition` puede ser usado por la política del propio jugador; no es revelado a
los clubes como true trait.

### 22.3 STAY

```text
Ustay =
    stayIntercept
  + betaStayCurrentRoleContext
      * center01(currentRoleSatisfaction)
  + betaStayMorale
      * center01(moraleContext)
  + betaStayContract
      * center01(currentContractSatisfaction)
  + betaStayClubAttachment
      * center01(clubAttachmentContext)
```

STAY solo aparece cuando es una opción lógica en el checkpoint.

### 22.4 Política de decisión

Si el usuario controla la decisión:

- las utilities pueden alimentar explicación/recomendación;
- no se normalizan para elegir automáticamente;
- no se consume RNG;
- la opción validada del usuario determina `playerAgreement`.

Si una futura policy versionada habilita automatización:

```text
P(choice=o) =
  stableSoftmax(
    automaticChoiceScale
    * U[o]
  )
```

y usa `CategoricalCumulativeMidpointV1` en orden canónico de option ID. Esta
fórmula no habilita por sí sola la policy; ADR-020 sigue gobernando
automatización y Difficulty no cambia probabilidades.

## 23. Renewal

### 23.1 Oportunidad

Calendar/Contract policy declara si existe una oportunidad de renovación. Si
no existe:

- no se evalúa propensity;
- no se consume RNG;
- no se interpreta como rechazo.

### 23.2 Predictor

```text
etaRenewalOffer =
    renewalIntercept
  + betaRenewalFutureNeed
      * center01(futureClubNeed)
  + betaRenewalPerformance
      * recentPerformanceMarket
  + betaRenewalEvidence
      * center01(marketEvidence)
  + betaRenewalValue
      * centeredLogMarketReferenceValue
  + betaRenewalAge
      * center01(ageValueSignal)
  + betaRenewalFinance
      * center01(financialPower[currentClub])
  + betaRenewalExpectationFit
      * center01(contractExpectationFulfilment)
  + betaRenewalTiming
      * center01(expiryProximity)
  + betaRenewalOpportunity
      * center01(currentExpectedOpportunity)
  + lambdaRenewalClub * ZclubStrategy[currentClub]
  + sigmaRenewal * ZrenewalSpecific[contractId,window]

pRenewalOffer =
  stableSigmoid(etaRenewalOffer)

renewalOffered =
  BinomialInverseCdfV1(1,pRenewalOffer)
```

Una renewal ofrecida genera `ContractProposal` mediante §21 y negociación
mediante §25. Si se acuerda, crea contrato sucesor; no muta el anterior.

## 24. Loan

### 24.1 Propensity

```text
etaLoanPath =
    loanIntercept
  + betaLoanPotential
      * center01(perceivedPotential)
  - betaLoanCurrentOpportunity
      * center01(currentExpectedOpportunity)
  + betaLoanCompetition
      * center01(currentPositionCompetitionStrength)
  + betaLoanDevelopmentNeed
      * center01(developmentOpportunityNeed)
  + betaLoanContractRemaining
      * center01(remainingShare)
  + betaLoanClubPreference
      * center01(holdingClubLoanPreference)
  + betaLoanPlayerPreference
      * observableWillingnessSignal
  + betaLoanMarketAvailability
      * center01(loanMarketAvailability)
  + sigmaLoan * ZloanPathSpecific[player,window]

pLoanPath =
  stableSigmoid(etaLoanPath)

loanPathOpen =
  BinomialInverseCdfV1(1,pLoanPath)
```

No hay threshold de edad.

### 24.2 Receptor

Si `loanPathOpen=true`, clubes receptores recorren el mismo:

```text
ClubCandidateField
→ ClubNeed
→ PlayerClubFit
→ Interest
→ Offer
```

con `operationClass=LOAN` y parameters específicos. No se elige receptor por
ranking determinista.

### 24.3 Economía V1

V1 conserva:

```text
contractHoldingClubId = origin
currentSportingClubId = receiver
activeContractId = origin contract
```

No modela:

- loan fee;
- wage split;
- option/obligation to buy;
- bonuses.

`LoanProposal` contiene duration, receiver, expectation, effective boundary y
consent. La ausencia de esos términos económicos no equivale a valor cero ni
crea un fact monetario.

## 25. Negotiation

### 25.1 Política elegida

V1 usa **una única resolución agregada**. No existen:

- rondas recursivas;
- revisiones de proposal dentro de la misma occurrence;
- loop hasta aceptación;
- número de rondas configurable.

`negotiationStageCount=1` es estructura del algoritmo, no cap editorial de
transferencias. Una oportunidad futura puede crear otro interest/offer con
otra identidad causal.

### 25.2 Surpluses

```text
sellerSurplus =
  if sellerResponseRequirement = NOT_REQUIRED:
    0
  else:
    (
      logFeeProposal
      - logSellerReservation
    ) / negotiationSellerScale

buyerCommitmentPressure =
    feeCommitmentWeight
      * softplus(
          logFeeProposal
          - logTransferCapacity[buyer]
        )
  + salaryCommitmentWeight
      * softplus(
          logSalaryProposal
          - logSalaryCapacity[buyer]
        )

buyerSurplus =
    buyerProjectValueSignal
  - buyerCommitmentPressure

playerReservationSurplus =
    UplayerOffer
  - UplayerReservation
```

Scales son estrictamente positivas; commitment weights son no negativos.

`UplayerReservation` usa preferencias autorizadas para determinar si existe
una propuesta materialmente presentable. No selecciona la opción final del
usuario.

### 25.3 Predictor y outcome

```text
etaNegotiation =
    negotiationIntercept[operationClass]
  + betaNegotiationSeller * sellerSurplus
  + betaNegotiationBuyer * buyerSurplus
  + betaNegotiationPlayerReservation
      * playerReservationSurplus
  + betaNegotiationFeasibility
      * center01(financialFeasibility)
  + betaNegotiationBidCompetition
      * center01(bidderCompetition)
  - betaNegotiationFriction
      * center01(transactionFriction)
  + lambdaNegotiationMarket * ZmarketWindow
  + lambdaNegotiationRegion * ZmarketRegion
  + sigmaNegotiation * ZnegotiationSpecific[negotiationId]

pNegotiationSuccess =
  stableSigmoid(etaNegotiation)

negotiationSucceeded =
  BinomialInverseCdfV1(
    1,
    pNegotiationSuccess
  )
```

Si seller requerido no autorizó proceder:

- negotiation termina `FAILED`;
- no se genera ContractProposal;
- no se consume draw de negotiation;
- no se solicita PlayerDecision.

Si negotiation falla, conserva proposal y causa. No revisa terms.

## 26. WAITING_DECISION

### 26.1 Estado congelado

Antes de `WAITING_DECISION` deben estar persistidos o checkpointed:

- `marketWindowContextId` y boundary;
- `MarketPerception` refs;
- `ClubNeed`/fit refs;
- interests activos;
- `BidderCompetitionField`;
- offer IDs y operation types;
- fee exacto o ausencia lógica;
- seller response;
- ContractProposal/LoanProposal completo;
- salary, duration y ContractExpectation;
- financial feasibility;
- negotiation result;
- options canónicas;
- state/revision/hash esperado;
- `resumeCursor`;
- draw keys consumidas y próxima operation key.

### 26.2 Reanudación

Resolver:

```text
PendingDecision
+ validated DecisionRecord
→ playerAgreement
→ TransferOutcome evaluation
```

No se vuelve a:

- crear candidates;
- actualizar perception;
- samplear interest/offer;
- recalcular fee/salary/duration/expectation;
- samplear seller response;
- samplear negotiation;
- reordenar opciones.

La elección explícita no consume draw. Reintentar el mismo decision ID devuelve
el outcome confirmado o rechaza por revisión/idempotencia.

## 27. TransferOutcome y boundaries

### 27.1 Condiciones

Un movimiento solo puede completar si:

```text
windowAllowsOperation
AND affiliationEffectiveBoundaryAuthorized
AND requiredSellerResponseSatisfied
AND negotiationSucceeded
AND playerAgreementSatisfied
AND financialFeasibilityConfirmed
AND contract/loan invariants valid
AND atomicAffiliationTransitionValid
```

`RegistrationEligibility` no se asume universal. DR-066 gobierna desde cuándo
el jugador puede participar en cada competición.

### 27.2 Permanent transfer

Atómicamente:

- supersede/terminate el contrato anterior según policy autorizada;
- crea el contrato nuevo;
- actualiza `contractHoldingClubId`;
- actualiza `currentSportingClubId`;
- conserva splits históricos;
- emite `TransferCompleted` una vez.

### 27.3 Free transfer

Requiere:

- estado contractual compatible;
- no seller;
- fee exactamente cero;
- contrato nuevo acordado;
- player agreement;
- boundary autorizado.

### 27.4 Loan

Atómicamente:

- conserva `contractHoldingClubId`;
- conserva contrato activo de origen;
- crea `LoanAgreement`;
- cambia `currentSportingClubId`;
- agenda retorno según boundary autorizado;
- no reatribuye ventanas previas.

### 27.5 Mid-season y DR-067

Las ecuaciones son compatibles con un movimiento entre Qs porque toda
afiliación contiene `effectiveFromBoundary`. Este documento no elige dicho
boundary.

Mientras DR-067 siga abierta:

- el cursor vigente solo permite resolución efectiva post-season en `MARKET`;
- no se inserta Market entre Qs;
- una proposal mid-season no puede hacerse efectiva por inferencia;
- los tests de mid-season permanecen bloqueados;
- la matemática puede operar sobre un boundary futuro provisto, pero no
  producirlo.

### 27.6 Registration y DR-066

`TransferCompleted` confirma afiliación/contrato. Calendar/Competition policy
debe producir después:

```text
RegistrationEligibility {
  playerId
  currentSportingClubId
  competitionId
  seasonId
  effectiveBoundary
  status
  ruleRef
}
```

Este spec no decide cup-tied, listas, plazos ni excepciones.

## 28. External-tier Market adapter

Si DR-065 habilita un club fuera del tier detallado, Market requiere:

```text
ExternalMarketClubContext {
  clubId
  leagueId
  regionId
  sportingStrength {
    attack
    defense
    control
  }
  prestige
  financialPower
  TacticalIdentity
  PositionCompetition[position]
  positionScarcity
  clubStrategyContext
  transferCapacityContext
  salaryCapacityContext
  marketWindowEligibility
  data/policy refs
}
```

Debe permitir derivar `ClubNeed`, fit, opportunity projection, feasibility y
terms con las mismas ecuaciones. No se inventan:

- identidad;
- Money;
- calendario;
- strength;
- candidate;
- eligibility.

ADR-081 confirma que estos adapters existen mediante pool híbrido. Su catálogo,
field, materialización y values siguen `DATA_REQUIRED`; ninguna ecuación de
Market inventa la identidad o completa un campo ausente.

## 29. Correlaciones

### 29.1 Jerarquía

Se adoptan:

```text
ZmarketWindow[marketWindowContextId]
ZmarketRegion[regionId,marketWindowContextId]
ZclubStrategy[clubId,marketWindowContextId]
ZclubEvaluation[clubId,marketWindowContextId]
ZclubWagePolicy[clubId,marketWindowContextId]
ZplayerMarket[playerId,marketWindowContextId]
Zspecific[entity/purpose]
```

Todos son Standard Normal V1.

### 29.2 Consumers

| Factor | Consumers permitidos |
|---|---|
| marketWindow | valuation, need, interest, offer, fee, salary, negotiation |
| marketRegion | valuation, need, interest, offer, fee, salary, negotiation |
| clubStrategy | need, interest, offer, renewal |
| clubEvaluation | valuation del club; no salary automática |
| clubWagePolicy | salary |
| playerMarket | perception/upside market-purpose cuando se declare |
| specific | una sola fórmula/entidad/purpose |

Una causa se samplea una vez y se comparte por `FactorRef`. Reusar
`ZmarketWindow` no autoriza sumar dos loadings equivalentes en la misma
ecuación.

### 29.3 Independencias

- interest Bernoulli de clubes distintos usa keys distintas;
- offer Bernoulli no reutiliza el uniform de interest;
- fee y salary tienen Normals específicos distintos;
- seller response y negotiation tienen Bernoulli distintos;
- duration y expectation usan categoricals distintos;
- user decision no tiene stream;
- agregar un candidato no desplaza draws de otro.

## 30. Random stream contract

Cada draw usa:

```text
RandomDrawKey {
  namespace
  modelId
  context
  occurrence
  purpose
}
```

Namespaces/model IDs mínimos:

| Namespace/modelId | Contexto | Purpose |
|---|---|---|
| `transfers.market-factor-v1` | window | market-wide Normal |
| `transfers.region-factor-v1` | region + window | regional Normal |
| `transfers.club-strategy-v1` | club + window | strategy Normal |
| `transfers.club-evaluation-v1` | club + window | valuation Normal |
| `transfers.club-wage-policy-v1` | club + window | salary policy Normal |
| `transfers.perception-v1` | player + observer + window | perception-specific Normal |
| `transfers.need-v1` | player + club + position + window | need-specific Normal |
| `transfers.interest-v1` | interest occurrence | predictor-specific Normal / Bernoulli |
| `transfers.offer-v1` | offer occurrence | predictor-specific Normal / Bernoulli |
| `transfers.operation-v1` | offer | categorical operation |
| `transfers.fee-v1` | offer | fee Normal |
| `transfers.reservation-v1` | offer + seller | reservation Normal |
| `transfers.seller-response-v1` | offer | response Normal / Bernoulli |
| `transfers.expectation-v1` | proposal | categorical expectation |
| `transfers.duration-v1` | proposal | categorical duration |
| `transfers.salary-v1` | proposal | salary Normal |
| `transfers.renewal-v1` | contract + window | renewal Normal / Bernoulli |
| `transfers.loan-v1` | player + holding club + window | loan Normal / Bernoulli |
| `transfers.negotiation-v1` | negotiation | negotiation Normal / Bernoulli |
| `transfers.auto-decision-v1` | decision | categorical; policy futura |

Un predictor con `sigma=0` no consume el Normal específico. Un outcome
imposible/cierto por policy no consume Bernoulli. Los shared factors se
resuelven al preparar el MarketWindowContext y no por cada club.

## 31. Estado, facts y ownership

### 31.1 Persisted Domain Facts

Se preserva el catálogo de `SCORING_FACTS_SPEC.md`:

- `TransferInterestGenerated`;
- `TransferOfferCreated`;
- `TransferOfferWithdrawn`;
- `RenewalOffered`;
- `NegotiationStarted`;
- `NegotiationUpdated`;
- `NegotiationFailed`;
- `DecisionRequested` con `decisionKind=PLAYER_TRANSFER`;
- `ContractAgreed`;
- `ContractRenewed`;
- `ContractExpired`;
- `ContractTerminated`;
- `TransferCompleted`;
- `LoanStarted`;
- `LoanEnded`.

No se crea `FreeTransferCompleted` paralelo: es
`TransferCompleted.movementType=FREE_TRANSFER`.

### 31.2 Derived/Internal

Son summaries/traces:

- MarketPerception;
- `MarketValueEstimate`/`MarketReferenceValue`;
- ClubNeedAssessment;
- PlayerClubFit;
- FinancialFeasibilityAssessment;
- BidderCompetitionField;
- seller reservation;
- utilities/probabilities/draw breakdown;
- PlayerOfferUtility;
- registration proposal antes de policy.

### 31.3 Scoring

Ningún output financiero o de movimiento está allowlisted para score. Market no
crea ScoreLedger y no consume `scoringVersion`.

## 32. EngineParameterSet

La rama normativa continúa siendo `EngineParameterSet.transfers`; no se crea
una nueva raíz `transfersMarket`. Su estructura mínima es:

```text
transfers {
  perception {
    sigmaPerceptionBaseByObserverClass
    uncertaintyCoefficient
    authorizedProjectionWeights
    performanceRecencyWeights
    performanceExposureWeights
    healthRiskProjectionConfig
  }

  ageValue {
    upsideCenterByPosition
    upsideScaleByPosition
    horizonCenterByPosition
    horizonScaleByPosition
    upsideWeightByPosition
  }

  contractLeverage {
    expiryRate
    sellerIntercept
    sellerRemainingShareCoefficient
    sellerExpiryCoefficient
    sellerCurrentNeedCoefficient
    sellerReplacementCoefficient
    sellerFinancialNeedCoefficient
    playerIntercept
    playerExpiryCoefficient
    playerBidCompetitionCoefficient
    playerReputationCoefficient
    playerUnattachedCoefficient
  }

  scarcity {
    valuationCoefficientByPosition
    needCoefficientByPosition
    interestCoefficientByPosition
    feeCoefficientByPosition
    salaryCoefficientByPosition
  }

  clubNeed {
    interceptsByStrategyAndPosition
    desiredQualityTargetByStrategyAndPosition
    gapSlopeByPosition
    qualityGapCoefficients
    depthCoefficients
    entrenchmentCoefficients
    tacticalDemandCoefficients
    strategyCoefficients
    financeCoefficients
    scarcityCoefficients
    persistenceCoefficients
    marketLoadings
    regionLoadings
    clubLoadings
    specificSigmas
  }

  opportunityProjection {
    marketPriorRoleUtilities
    marketPriorStateAdapters
    contextAdapterCoefficients
    uncertaintyConfig
  }

  playerClubFit {
    interceptsByPosition
    levelMatchRate
    suitabilityCoefficients
    tacticalCoefficients
    needCoefficients
    opportunityCoefficients
    levelCoefficients
    adaptationCoefficients
    projectCoefficients
    suitabilityTacticalInteractions
    needOpportunityInteractions
  }

  candidateField {
    allowedOperationPolicies
    logicalEligibilityPolicies
    requiredContextFields
    canonicalOrderPolicy
  }

  interest {
    interceptsByOperationAndPosition
    fitCoefficient
    needCoefficient
    qualityCoefficient
    potentialCoefficient
    performanceCoefficient
    evidenceCoefficient
    reputationCoefficient
    financialCoefficient
    contractCoefficient
    marketHeatCoefficient
    healthRiskCoefficient
    transitionIntercepts
    marketLoading
    regionLoading
    clubLoading
    specificSigma
  }

  bidderCompetition {
    intensityIntercept
    intensityNeedCoefficient
    intensityFitCoefficient
    intensityPrestigeCoefficient
    intensityFinanceCoefficient
    fieldIntercept
    rawIntensityCoefficient
    reputationCoefficient
    scarcityCoefficient
    marketHeatCoefficient
  }

  financialFeasibility {
    transferCapacityCurrencyIntercepts
    salaryCapacityCurrencyIntercepts
    transferFinanceCoefficient
    transferMarketCoefficient
    transferStrategyCoefficient
    salaryFinanceCoefficient
    salaryWageCoefficient
    salaryStrategyCoefficient
    feasibilityIntercept
    feePressureCoefficient
    salaryPressureCoefficient
    feasibilityFinanceCoefficient
    playerLeverageCoefficient
  }

  offer {
    interceptsByOperation
    needCoefficient
    feasibilityCoefficient
    urgencyCoefficient
    bidderCompetitionCoefficient
    contractOpportunityCoefficient
    observableWillingnessCoefficient
    fitCoefficient
    marketLoading
    regionLoading
    clubLoading
    specificSigma
  }

  operation {
    interceptsByOperation
    ageCoefficients
    opportunityCoefficients
    needCoefficients
    contractCoefficients
    developmentCoefficients
    preferenceCoefficients
  }

  valuation {
    currencyScaleByMonetaryContext
    interceptsByPositionAndContext
    qualityCoefficients
    potentialCoefficients
    performanceCoefficients
    evidenceCoefficients
    ageCoefficients
    scarcityCoefficients
    reputationCoefficients
    contractCoefficients
    marketCoefficients
    healthRiskCoefficients
    qualityPotentialInteractions
    performanceEvidenceInteractions
    marketLoadings
    regionLoadings
    clubLoadings
    referencePanelWeights
  }

  fee {
    anchorBuyerWeight
    anchorSellerWeight
    anchorMarketWeight
    sellerLeverageCoefficient
    buyerUrgencyCoefficient
    bidderCompetitionCoefficient
    marketHeatCoefficient
    scarcityCoefficient
    proposalAggressivenessCoefficient
    marketLoading
    regionLoading
    sigma
  }

  seller {
    reservationCurrentNeedCoefficient
    reservationContractCoefficient
    reservationReplacementCoefficient
    reservationFinancialNeedCoefficient
    reservationUrgencyCoefficient
    reservationSigma
    responseScale
    responseIntercept
    relativeOfferCoefficient
    financialNeedCoefficient
    replacementCoefficient
    playerWillingnessCoefficient
    urgencyCoefficient
    responseSigma
  }

  contractProposal {
    expectationIntercepts
    expectationQualityCoefficients
    expectationPotentialCoefficients
    expectationAgeCoefficients
    expectationNeedCoefficients
    expectationCompetitionCoefficients
    expectationOpportunityCoefficients
    expectationSportingLevelCoefficients
    expectationNegotiationCoefficients
    durationInterceptsByTermAndOperation
    durationAgeCoefficients
    durationValueCoefficients
    durationExpectationCoefficients
    durationFinanceCoefficients
    durationPlayerLeverageCoefficients
    durationMarketCoefficients
  }

  salary {
    currencyScaleByMonetaryContext
    interceptsByPosition
    qualityCoefficients
    reputationCoefficients
    expectationCoefficients
    financeCoefficients
    wageEnvironmentCoefficients
    bidderCompetitionCoefficients
    ageIntercepts
    ageWeights
    playerLeverageCoefficients
    marketLoading
    regionLoading
    clubLoading
    sigmasByPosition
  }

  playerUtility {
    salaryUtilityScale
    offerIntercepts
    salaryCoefficient
    prestigeCoefficient
    sportingProjectCoefficient
    opportunityCoefficient
    expectationCoefficients
    leagueCoefficient
    moraleCoefficient
    adaptationCoefficient
    ambitionPrestigeInteraction
    ambitionSportingInteraction
    preferenceInteractions
    stayIntercept
    stayRoleCoefficient
    stayMoraleCoefficient
    stayContractCoefficient
    stayAttachmentCoefficient
    automaticChoiceScale
  }

  renewal {
    intercept
    futureNeedCoefficient
    performanceCoefficient
    evidenceCoefficient
    valueCoefficient
    ageCoefficient
    financeCoefficient
    expectationFitCoefficient
    timingCoefficient
    opportunityCoefficient
    clubLoading
    sigma
  }

  loan {
    intercept
    potentialCoefficient
    currentOpportunityCoefficient
    competitionCoefficient
    developmentNeedCoefficient
    contractRemainingCoefficient
    clubPreferenceCoefficient
    playerPreferenceCoefficient
    marketAvailabilityCoefficient
    sigma
    durationUtilitiesByAllowedTerm
    expectationUtilities
  }

  negotiation {
    sellerScale
    feeCommitmentWeight
    salaryCommitmentWeight
    interceptsByOperation
    sellerSurplusCoefficient
    buyerSurplusCoefficient
    playerReservationCoefficient
    feasibilityCoefficient
    bidderCompetitionCoefficient
    frictionCoefficient
    marketLoading
    regionLoading
    sigma
  }

  monetary {
    quantizerId
    schemaRangePolicy
    positiveDomainPolicy
    conversionPolicyRefs
    referenceCurrencyContextRefs
    overflowValidationConfig
  }

  factors {
    marketWindowLoadings
    regionLoadings
    clubStrategyLoadings
    clubEvaluationLoadings
    clubWageLoadings
    specificSigmas
  }
}
```

### 32.1 Clasificación

| Familia | Clasificación |
|---|---|
| pipeline, enum/order canónico, family logistic/softmax/log-space | `STRUCTURAL_FIXED` |
| StandardNormal/Binomial/Categorical samplers | `STRUCTURAL_FIXED` |
| `ROUND_HALF_EVEN`, positive/nonnegative Money boundaries | `STRUCTURAL_FIXED` |
| negociación aggregate single-stage | `STRUCTURAL_FIXED` |
| ausencia de loan fee/wage split/advanced clauses en V1 | `STRUCTURAL_FIXED` del scope V1 |
| todos los intercepts, coefficients, scales, loadings y sigmas | `INITIAL_CALIBRATION_REQUIRED` |
| reference panel, allowed terms y context maps | `INITIAL_CALIBRATION_REQUIRED` + Data/Policy |
| interactions opcionales presentes en schema | `TUNABLE_LATER`, pero nunca constants implícitas |
| tolerancias y targets | `INITIAL_CALIBRATION_REQUIRED` |

No existe default numérico implícito. Un coeficiente omitido no significa cero
salvo que el schema de esa versión lo declare explícitamente.

## 33. Invariantes

### 33.1 Numéricas

- todo predictor es finito;
- no persisten NaN, Infinity o `-0`;
- Money usa integer `amountMinor >= 0`;
- MarketValue y salary positivos usan `amountMinor >= 1`;
- free transfer tiene fee exactamente cero;
- fee de permanent transfer activo es positivo;
- moneda y unidad están presentes;
- no hay comparación cross-currency implícita;
- overflow/underflow monetario se rechaza, no se clampa;
- probabilidades están en `[0,1]`;
- softmax suma uno dentro de `numericTolerance`.

### 33.2 Causales

- MarketValue no es TransferFee ni Salary;
- Interest no implica Offer;
- Offer no implica seller acceptance;
- seller acceptance no implica negotiation success;
- negotiation success no implica player agreement;
- player agreement aislado no implica TransferCompleted;
- ContractExpectation no determina SportingRole;
- CareerScore nunca entra en Market;
- TrueCapabilities/hidden traits no entran sin knowledge projection;
- Performance cerrada no se recalcula;
- previous Q/season conserva club histórico;
- permanent transfer actualiza holding y sporting club;
- loan conserva holding club y cambia sporting club;
- renewal crea successor contract;
- free transfer no tiene seller;
- Market no concede RegistrationEligibility universal;
- no se mueve automáticamente al protagonista fuera del tier.

### 33.3 Monotonicidades esperadas

Manteniendo demás inputs:

- mayor perceived quality no reduce expected valuation;
- mayor perceived potential no reduce expected valuation;
- mayor ClubNeed no reduce expected interest;
- mayor fit no reduce expected interest;
- mayor financial feasibility no reduce offer propensity;
- mayor bidder competition no reduce expected fee/salary cuando sus
  coefficients normativos son positivos;
- mayor relative offer no reduce seller acceptance;
- mayor salary utility no reduce automatic player utility;
- mayor remaining contract/seller leverage no reduce expected fee;
- mayor scarcity no reduce valuation/interest cuando el ParameterSet declara
  efectos positivos.

No se exige monotonicidad de outcomes sampleados.

### 33.4 Determinismo

- misma seed/context/ParameterSet produce outputs byte-equivalent;
- cada factor se samplea una vez;
- agregar club no cambia draws de otros;
- user choice consume cero RNG;
- free fee consume cero RNG;
- seller `NOT_REQUIRED` consume cero response RNG;
- resume consume cero RNG de terms ya congelados;
- iteration usa club/offer/option IDs en orden canónico.

### 33.5 Sin caps editoriales

No existe máximo de:

- candidatos;
- intereses;
- ofertas;
- transferencias;
- fee;
- salary;
- temporadas sin movimiento;
- negociaciones fallidas en distintas opportunities.

El single-stage de cada negociación define un proceso finito; no limita cuántas
opportunities puede producir la simulación.

## 34. Calibration targets

Cada fila se registra como `CalibrationTarget` de
`MATHEMATICAL_CALIBRATION_CONTRACT.md`.

### 34.1 Valuation

| Métrica | Clase | Segmentos mínimos | Evidencia |
|---|---|---|---|
| distribución de MarketReferenceValue | CALIBRATION_TARGET | GK/CM/ST, age band, Argentina/España | externa |
| distribución de club valuations | CALIBRATION_TARGET | club/league/position | externa |
| dispersión entre observers | CALIBRATION_TARGET | evidence/uncertainty | diseño + externa |
| correlación value-quality perceived | DIAGNOSTIC | position/context | causal |
| correlación value-Performance | CALIBRATION_TARGET | evidence band | externa |
| efecto de evidence sobre dispersión | CALIBRATION_TARGET | sparse/full | diseño |
| veteran value tails | CALIBRATION_TARGET | position/age | externa |
| overflow/underflow | INVARIANT | todos | cero outcomes aceptados |

### 34.2 Interest y offers

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| clubes interesados por jugador/window | CALIBRATION_TARGET | quality/need/position/league | externa + diseño |
| frecuencia de cero intereses | CALIBRATION_TARGET | quality/contract/context | externa |
| interest→offer conversion | CALIBRATION_TARGET | operation/feasibility | externa |
| persistencia de interest | CALIBRATION_TARGET | previous state/window | diseño + externa |
| fit/need sensitivity | DIAGNOSTIC | deciles | causal |
| offer multiplicity | CALIBRATION_TARGET | reputation/scarcity | externa |
| offer sin completion | CALIBRATION_TARGET | cause | diseño + externa |

### 34.3 Transfers

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| transfers por season/career | CALIBRATION_TARGET | position/age/context | externa |
| destination level delta | CALIBRATION_TARGET | operation/age | externa |
| free-transfer frequency | CALIBRATION_TARGET | contract state | externa |
| loan frequency | CALIBRATION_TARGET | age/upside/opportunity | externa |
| failed negotiation rate | CALIBRATION_TARGET | seller/feasibility | externa + diseño |
| mid-season frequency | CALIBRATION_TARGET bloqueado | DR-067 | externa/policy |
| no-transfer career spans | DIAGNOSTIC | career phase | diseño |

### 34.4 Money

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| fee distribution | CALIBRATION_TARGET | age/position/league/operation | externa |
| fee/reference value ratio | CALIBRATION_TARGET | leverage/competition | externa |
| salary distribution | CALIBRATION_TARGET | position/league/expectation | externa |
| salary/value correlation | CALIBRATION_TARGET | age/position | externa |
| bidder competition effect | CALIBRATION_TARGET | bidder field quantiles | externa + diseño |
| fee/salary right tails | CALIBRATION_TARGET | context | externa |
| exact currency/round-trip | INVARIANT | currency catalog | normativa |

### 34.5 Contracts

| Métrica | Clase | Segmentos | Evidencia |
|---|---|---|---|
| duration distribution | CALIBRATION_TARGET | age/operation/expectation | externa |
| ContractExpectation distribution | CALIBRATION_TARGET | age/quality/need | diseño |
| renewal frequency | CALIBRATION_TARGET | expiry/performance/need | externa |
| successor/predecessor integrity | INVARIANT | renewal | normativa |
| loan duration | CALIBRATION_TARGET | age/context | externa |

### 34.6 Cross-system

| Métrica | Clase | Propósito |
|---|---|---|
| PositionCompetition→ClubNeed | DIAGNOSTIC | validar dirección causal |
| Performance/evidence→valuation | CALIBRATION_TARGET | evitar overreaction sparse |
| sporting reputation→interest/value | DIAGNOSTIC | evitar duplicar Performance |
| finance→feasibility | CALIBRATION_TARGET | validar capacidad agregada |
| scarcity→interest/fee | CALIBRATION_TARGET | validar field |
| transfer→next Role/Minutes | DIAGNOSTIC | verificar adapter futuro |
| market outcome→Reputation signal | DIAGNOSTIC | preparar G3C-9 sin causal loop |
| affiliation→Retirement inputs | DIAGNOSTIC | preparar G3C-10 |

No se asignan cifras reales. Los targets externos requieren dataset versionado
con provenance; los targets de ContractExpectation, failure mix y experiencia
de usuario pueden ser decisiones de diseño.

## 35. Tail diagnostics

SMOKE/CALIBRATION/DEEP deben reportar:

- fees extraordinariamente grandes;
- salaries extraordinariamente altas/bajas;
- elite free transfers;
- veteran record fees;
- jugador de value bajo con interés elite;
- superstar sin ofertas adecuadas;
- bidding wars;
- muchos intereses sin offers;
- offers repetidamente rechazadas;
- negociación repetidamente fallida entre opportunities;
- períodos largos sin transferencia;
- múltiples loans;
- grandes diferencias de valuation entre observers;
- sparse evidence con valuation extrema;
- Money representation errors.

No se corrigen mediante caps, thresholds de club o recorte de Normals.

## 36. Golden vectors requeridos

### 36.1 Valuation

```text
fixed MarketPerception
+ age/contract/scarcity/context
+ fixed ParameterSet
+ known market/region/club/specific Z
→ every etaValue term
→ logClubReferenceValueMinor
→ exact Money
```

Incluye panel:

```text
fixed log valuations + weights + IDs
→ exact weighted median
→ MarketReferenceValue
```

### 36.2 Age y leverage

```text
fixed ages + position params
→ upsideSignal
→ horizonSignal
→ ageValueSignal

fixed contract duration/timing
→ remainingShare
→ expiryProximity
→ seller/player leverage
```

### 36.3 ClubNeed y fit

```text
fixed PositionCompetition
+ tactic/strategy/finance/scarcity
+ known Z factors
→ desiredQualityGap
→ etaNeed
→ need

fixed player/candidate/opportunity
→ levelMatch
→ etaPlayerClubFit
→ fit
```

### 36.4 Interest y offer

```text
fixed prior interest + predictor inputs + known Z/u
→ etaInterest
→ pInterest
→ exact ACTIVE/NONE

fixed active interest + feasibility + known Z/u
→ etaOffer
→ pOffer
→ exact offer outcome
```

Incluye `interest=false` con cero consumo de offer RNG.

### 36.5 Fee y seller

```text
fixed buyer/seller/reference log values
+ leverage/context + known Zfee
→ logFeeAnchor
→ logFeeProposal
→ exact feeMinorUnits

fixed seller inputs + known Z/u
→ reservation
→ response probability
→ exact response
```

Incluye free transfer:

```text
fee=0
fee draw count=0
seller draw count=0
```

### 36.6 ContractProposal

```text
fixed expectation utilities + known u
→ exact ContractExpectation

fixed allowed terms/utilities + known u
→ exact duration

fixed salary inputs + known Z
→ exact salaryMinorUnits
```

### 36.7 Renewal y loan

```text
fixed renewal inputs + known Z/u
→ exact offer/no offer

fixed loan inputs + known Z/u
→ exact path state
→ receiver field evaluation
```

### 36.8 Negotiation

```text
fixed fee/reservation/capacity/player reservation
+ known Z/u
→ each surplus
→ etaNegotiation
→ success/failure
```

Incluye seller rejection con cero negotiation/contract-proposal draws.

### 36.9 WAITING_DECISION

```text
run to frozen proposal
→ canonical checkpoint bytes/hash
→ resume with fixed DecisionRecord
→ same frozen proposal bytes/hash
→ zero repeated draws
→ exact outcome
```

### 36.10 Money errors

Fixtures cubren:

- HALF_EVEN ties;
- positive amount que cuantiza a un minor unit;
- free fee cero;
- cross-currency sin snapshot rechazado;
- overflow rechazado sin saturación;
- moneda/scale inválidos.

## 37. Monte Carlo suites

### 37.1 SMOKE

Recolecta:

- domains/invariants;
- stage conversion counts;
- zero/multiple interests;
- offer/no-offer;
- free/loan/permanent paths;
- Money exacto;
- stream isolation;
- checkpoint equality.

### 37.2 CALIBRATION

Segmenta al menos por:

- GK/CM/ST;
- bandas de edad;
- Argentina/España;
- club/league context;
- contract state;
- evidence band;
- operation type.

Recolecta todas las métricas de §34, quantiles P50/P90/P95/P99 y correlations.

### 37.3 DEEP

Añade:

- careers multiclub y multi-decade;
- P99.9 cuando el sample size lo permita;
- long no-transfer periods;
- repeated loans/failed negotiations;
- bidder wars;
- value/fee/salary extreme tails;
- common-random-number comparison entre ParameterSets;
- overflow risk diagnostics;
- DR-065/066/067 scenarios solo después de resolver sus policies.

Los sample counts viven en `CalibrationSeedSet`; no son reglas de gameplay.

## 38. Estado de las cinco decisiones

| ID | Estado G3C-7 | Familia matemática cerrada | Pendiente |
|---|---|---|---|
| G3B-G01 | `PARTIAL_CALIBRATION` | enumeración canónica del scope autorizado + ClubNeed logistic-Normal + fit derivado | valores, data y DR-065 |
| G3B-G02 | `PARTIAL_CALIBRATION` | transición Bernoulli logistic por candidato con factores market/region/club | coefficients, sigmas y targets |
| G3B-G03 | `PARTIAL_CALIBRATION` | offer logistic; operation/expectation/duration softmax; fee/salary log-space | valores, catálogo monetario/contractual y targets |
| G3B-G04 | `PARTIAL_CALIBRATION` | seller logistic + negociación aggregate single-stage + checkpoint sin resampling | valores y policy/timing DR-066/067 |
| G3B-G07 | `PARTIAL_CALIBRATION` | valuation observer-specific en log-space + reference weighted median | valores, moneda/conversión y DR-027 |

Ninguna queda abierta por falta de ecuación, distribución, sampler, orden o
stream.

## 39. DR y blockers

### 39.1 DR-058

Pasa a `PARTIAL_CALIBRATION`: se cerraron matemáticamente:

- perception/valuation;
- ClubNeed/fit/candidates;
- interest/offer;
- financial feasibility;
- fee/salary;
- expectation/duration;
- seller/negotiation;
- renewal/loan;
- user/automatic decision boundary;
- streams y Money quantization.

Faltan valores, policies DR-027/065/066/067, data, schemas, goldens y
calibración.

### 39.2 DR-027

Permanece parcial. Este documento cierra log-space y cuantización exacta, pero
no elige:

- currency catalog;
- base/reference currency;
- conversion source/snapshot;
- exact schema max;
- regional monetary scales;
- presentation/disclaimer;
- evidence/calibration values.

### 39.3 DR-065

Permanece `BLOCKER_G3`. Se cerró el adapter mínimo, no el pool, identidad,
materialización, calendario o continuity policy.

### 39.4 DR-066

Permanece `BLOCKER_G3`. Transfer outcome conserva registration como estado
separado; no inventa reglas.

### 39.5 DR-067

Permanece `BLOCKER_G3` para mid-season. V1 math es boundary-agnostic; el cursor
actual solo autoriza `MARKET` post-season.

### 39.6 Otras DR

- DR-008 sigue abierta por G3C-8–G3C-11, values y calibración integrada.
- DR-021 conserva calendar/time/policy de Market.
- DR-022 entrega producers sin reabrirse.
- DR-048/049 conservan PositionSuitability y uso histórico; Market no cambia
  posiciones.
- DR-061 queda `PARTIAL_CALIBRATION`: Market consume el snapshot sporting
  purpose-scoped confirmado por G3C-9, nunca awareness/followers por defecto.
- DR-063 mantiene facts/allowlist; no se crean aliases.

## 40. Gates antes de implementar

1. Publicar valores completos de `EngineParameterSet.transfers`.
2. Aprobar `MonetaryContext`, currency catalog y schema range de DR-027.
3. Aprobar contract term catalogs y time units de DR-021.
4. Resolver DR-065 para candidates/continuidad externa.
5. Resolver DR-066 para RegistrationEligibility.
6. Resolver DR-067 antes de cualquier movimiento mid-season.
7. Calcular expected outputs/hashes de todos los goldens.
8. Aprobar CalibrationTargets con provenance.
9. Superar SMOKE/CALIBRATION/DEEP.
10. Validar Money overflow/underflow y cross-currency.
11. Validar stream isolation y replay cross-runtime.
12. Congelar schemas conformes a DR-063.
13. Demostrar que user decision consume cero RNG.
14. Demostrar que resume no resamplea.
15. Demostrar que CareerScore no aparece en Market.

No existe blocker matemático para **especificar** G3C-8. Sigue bloqueada la
implementación oficial de Market.

### Adapter G3C-9 — lag de Reputation/Social

Antes de enumerar candidates, cada occurrence congela:

```text
MarketReputationSnapshot
  sportingByAuthorizedMarket       unit
  evidenceByAuthorizedMarket       unit
  snapshotSimulationPoint
  sourceStateHash / evidenceRefs
```

El snapshot debe preceder a la occurrence. Interest, Offer, fee, salary,
MarketValue y TransferOutcome del mismo proceso no pueden actualizarlo ni
reabrir valuation. `PublicReputation`/followers/engagement quedan fuera del
predictor deportivo/comercial V1 salvo futura policy explícita.

Market produce facts/signals tipados de interest y movement para el siguiente
`ReputationSocialUpdateBatch`. No produce deltas. TransferFee, Salary y
MarketValue no son impulses universales; una transferencia puede aportar
attention mediante context/visibility y cambio de club/league reach. El batch
post-Market ocurre en `SEASON_CLOSE`, por lo que no existe ciclo
`reputation -> fee -> reputation` dentro de la negociación.

## 41. Adapter G3C-10 — Market de comeback

Market recibe un `MarketParticipationContext` explícito:

```text
marketPath = ACTIVE_NORMAL | RETIRED_COMEBACK
playingStatus
retirementEpisodeId?
comebackEligibility
```

`RETIRED_COMEBACK` no ejecuta el pathway normal como si el jugador estuviera
activo. Reutiliza perception autorizada, ClubNeed, fit, Interest, Offer,
financial feasibility y negotiation con intercepts/adapters parametrizados
propios. `MarketOpportunityProjection` agrega active interest, viable offers,
free-agent opportunity y expected sporting opportunity mediante la unión
complementaria definida por G3C-10; no usa MarketValue como causa de retiro.

Una oferta válida puede originar `ComebackOpportunity(route=MARKET_OFFER)` y
queda congelada antes de `WAITING_DECISION`. Aceptarla no inventa club,
contrato, registration ni minutos: rigen los outcomes de este documento y
DR-065/066/067. La ruta `PLAYER_WILLINGNESS` puede reactivar
`ACTIVE+UNATTACHED` y luego entrar al mercado normal. Resume conserva proposal,
terms y draw refs exactos.

## 42. Referencias

- [Contrato matemático transversal](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Spec estructural de Transfers](TRANSFER_MARKET_CONTRACT_SPEC.md)
- [Club/Competitions/World math](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [Performance math](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
- [Role & Minutes math](ROLE_MINUTES_MATH_SPEC.md)
- [Reputation/Social math](REPUTATION_SOCIAL_MATH_SPEC.md)
- [Facts y Scoring](SCORING_FACTS_SPEC.md)
- [Retirement/Comeback/Finalization math](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
- [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md)
- [DR-027](DECISIONS_REQUIRED.md#dr-027--valor-de-mercado-y-monedas)
- [ADR-058](adr/058-transfer-market-contract-model.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)
- [ADR-076](adr/076-transfer-market-contract-mathematics.md)
- [DR-058](DECISIONS_REQUIRED.md#dr-058--interés-ofertas-transferencias-y-valor-de-mercado)
- [DR-065](DECISIONS_REQUIRED.md#dr-065--scope-competitivo-pools-externos-y-continuidad-fuera-del-tier)
- [DR-066](DECISIONS_REQUIRED.md#dr-066--elegibilidad-e-inscripción-después-de-movimientos)
- [DR-067](DECISIONS_REQUIRED.md#dr-067--cadencia-de-mercado-y-movimientos-entre-qs)

## 51. Adapter de Scoring G3C-11

MarketValue, fee, salary, Interest, Offer y TransferOutcome no puntúan. Los
movimientos solo preservan scopes históricos y permiten que productores
autorizados emitan registration/eligibility/attribution facts. Mientras
DR-066/067 no publique esos facts para un caso, Scoring no infiere ownership
ni participación. Una reanudación no modifica facts ya puntuados.
