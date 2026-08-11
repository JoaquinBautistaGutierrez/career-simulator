# G3D-4G Weak Parameter Prior and Sensitivity Contract

Status: `VALIDATED_CANDIDATE_CONTRACT`
Contract ID: `G3D4G-WEAK-PRIOR-SENSITIVITY-V1`
Owner: `CALIBRATION_OWNER`
Review: `PRODUCT_OWNER`, `SCORING_OWNER`, `TECHNICAL_VALIDATOR` as applicable
Reference cutoff: `2026-08-07T23:59:59.999Z`

## 1. Scope and non-value boundary

This contract covers exactly the 26 canonical templates classified by
[G3D Parameter Identifiability Matrix](G3D_PARAMETER_IDENTIFIABILITY_MATRIX.md)
as 17 `F_WEAKLY_IDENTIFIED` plus 9 `G_UNIDENTIFIABLE_V1`.

```text
admissibleRange
!= priorDistribution
!= sensitivityScenario
!= candidateValue
!= frozenValue
```

Ranges reject mathematically invalid or numerically unsafe proposals. Priors
regularize a future fit. Sensitivity scenarios are controlled counterfactuals.
None of them populates an `EngineParameterSet`, `ScoringConfiguration` or
`ScoringCalibrationData`; `assignedParameterValues=0` after G3D-4G.

## 2. Provenance and source-type order

A bound is justified in this order: mathematical domain/invariant, direct
evidence, observational summary, Product Target, structural constraint, then a
conservative weak prior. Every row identifies its primary basis using one of:

- `OBSERVATIONAL`;
- `DERIVED`;
- `PRODUCT_CONSTRAINED`;
- `SYNTHETIC_STRUCTURAL`;
- `WEAK_PRIOR`;
- `DEFERRED`.

A synthetic or weak bound is never represented as an empirical estimate.
Priors are provisional, versioned, and owned by the role shown in each table.

## 3. Reusable weak-prior profiles

All coefficient profiles operate in the standardized feature/predictor units
already required by the owning mathematical spec. A parameter with another
native domain uses the suffix-specific profile in section 4. Truncation is a
proposal-validation boundary, not a gameplay cap or threshold.

| Profile | Admissible range/domain | Provisional prior specification | Strength | LOW / REFERENCE / HIGH |
|---|---|---|---|---|
| `WP-SIGNED-4` | finite standardized coefficient in `[-4, 4]` | truncated Student-t, `nu=3`, `location=0`, `scale=1` | weak | prior `P10/P50/P90` |
| `WP-SIGNED-8` | finite linear-predictor intercept in `[-8, 8]` | truncated Student-t, `nu=3`, `location=0`, `scale=2` | weak | prior `P10/P50/P90` |
| `WP-NONNEG-4` | finite magnitude in `[0, 4]` | truncated half-Student-t, `nu=3`, `scale=1` | weak | prior `P10/P50/P90` |
| `WP-POSITIVE-SCALE` | finite positive value in `(0, 16]` native standardized units | truncated log-normal, median `1`, log-scale SD `1` | weak | prior `P10/P50/P90` |
| `WP-POSITIVE-TIME` | finite positive duration/decay scale in the owning spec's native time unit | log-normal centered on the documented observational time scale; hyperparameters remain bundle metadata | weak | prior `P10/P50/P90`; no hard time cutoff |
| `WP-PROBABILITY` | `[0.001, 0.999]` | truncated `Beta(1.25, 1.25)` | weak | prior `P10/P50/P90` |
| `WP-PERSISTENCE-POSITIVE` | `[0, 0.995]` | transformed `Beta(2, 2)` | weak | prior `P10/P50/P90` |
| `WP-PERSISTENCE-SIGNED` | `[-0.95, 0.95]` | symmetric Student-t on Fisher-z, truncated in state domain | weak | prior `P10/P50/P90` |
| `WP-UNIT-SIGNED` | `[-1, 1]` | symmetric truncated Student-t, `nu=3`, `location=0`, `scale=0.35` | weak | prior `P10/P50/P90` |
| `WP-CATALOG-DEFERRED` | exact mathematical/domain contract of the owning Scoring spec | `priorPolicy=DEFERRED`; no numeric prior | none | inactive until activation condition |

For `WP-POSITIVE-TIME`, the future candidate must record the evidence-backed
time scale and its bundle hash before evaluating quantiles. This preserves a
weak prior without inventing an age maximum, cooldown or minimum retirement
period. Profile changes create a successor contract version.

## 4. The 17 weakly identified templates

Every row has `provisional=true`, `sensitivityRequired=true` and
`freezeBlocker=SENSITIVITY_BLOCKS_FREEZE`. Multiple suffix profiles mean each
expanded field is validated against its named domain, without creating a new
template identity.

| Matrix row / parameter template | Admissible range and prior profile by suffix | Range basis / evidence | Downstream targets and tail metrics | Coupling / stage | Sensitivity / owner |
|---|---|---|---|---|---|
| 4 — `player.creation.foot.utility.{foot}.{feature}` | utility coefficients `WP-SIGNED-4`; preserve existing relative-utility identification | `WEAK_PRIOR`; `EV-P1-CRE-*`; `DS-PLAYER-FOOT-REFERENCE`; no hidden-capability inference | `CT-CRE-FOOT-*`, `PT-QC-*`, `PT-POS-FAIR-*`; foot mix, position mix, Quick/Custom drift | `CG-CREATION`; `P2_REFINEMENT` | `SENS-F04-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 21 — `development.wear.{family}.{base\|ageReference\|ageScale\|ageWeight\|loadWeight\|healthWeight\|sequelaWeight\|longevityWeight\|inactivityWeight\|contextWeight.{feature}}` | `base/contextWeight` `WP-SIGNED-4`; non-negative causal magnitudes `WP-NONNEG-4`; `ageReference/ageScale` positive native-age profiles (`WP-POSITIVE-TIME`/`WP-POSITIVE-SCALE`) | `WEAK_PRIOR` + longitudinal/censoring evidence `EV-P1-DEV-*`; no age threshold | `CT-DEV-DELTA-*`, `CT-DEV-TAIL-*`, `PT-CAREER-*`, `PT-RET-*`, `PT-SCORE-007`; peak/decline, longevity and position tails | `CG-DEVELOPMENT`; `P2_REFINEMENT` | `SENS-F21-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 95 — `health.burden.{activeEpisodeWeight\|severityWeight\|remainingWeight\|sequelaWeight\|compositionScale}` | causal weights `WP-NONNEG-4`; `compositionScale` `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; `EV-P1-HEALTH-*`; Health non-negativity invariants | Health incidence/availability/recovery targets and `PT-INJ-*`; chronic burden, season-loss and position tails | `CG-HEALTH`; `P2_REFINEMENT` | `SENS-F95-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 104 — `health.relapse.{memoryDecayRate\|remainingWeight\|memoryWeight\|sequelaWeight\|intercept\|betaLoad\|betaFatigue\|betaFragility\|betaHistory\|betaMedical\|contextWeight}.{injuryFamily}.{feature}` | `intercept/contextWeight` `WP-SIGNED-8/4`; risk magnitudes and weights `WP-NONNEG-4`; `memoryDecayRate` positive time/decay domain `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; recurrence evidence `EV-P1-REC-*`; six-family and causal-sign contracts | relapse/recurrence and injury-tail targets; recurrent injury, long absence and Career length | `CG-HEALTH`; `P2_REFINEMENT` | `SENS-F104-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 105 — `health.sequela.{recoveryQualityScale\|recoveryQualityWeight\|occurrenceIntercept\|typeIntercept\|burdenIntercept\|betaSeverity\|betaAge\|betaRecovery\|betaMedical\|betaHistory\|burdenSigma\|temporaryDecayRate}.{injuryFamily}` | intercepts and signed effects `WP-SIGNED-8/4`; declared monotone magnitudes `WP-NONNEG-4`; scale/sigma/decay `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; sparse post-return evidence `EV-P1-REC-*`; no medical diagnosis inference | sequela occurrence/burden, season-loss, Performance-after-return, Career length | `CG-HEALTH`; `P2_REFINEMENT` | `SENS-F105-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 106 — `health.sequelaCapabilityAffinity.{injuryFamily}.{capabilityFamily}` | `WP-UNIT-SIGNED` | `SYNTHETIC_STRUCTURAL` plus injury-family mapping; effects remain mechanical, not diagnoses | sequela capability burden, Performance and position fairness tails | `CG-HEALTH`; `P2_REFINEMENT` | `SENS-F106-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 162 — `transfers.interest.{interceptsByOperationAndPosition\|fitCoefficient\|needCoefficient\|qualityCoefficient\|potentialCoefficient\|performanceCoefficient\|evidenceCoefficient\|reputationCoefficient\|financialCoefficient\|contractCoefficient\|marketHeatCoefficient\|healthRiskCoefficient\|transitionIntercepts\|marketLoading\|regionLoading\|clubLoading\|specificSigma}.{key}` | intercepts `WP-SIGNED-8`; signed predictors/loadings `WP-SIGNED-4`; `specificSigma` `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; selected transaction evidence `EV-P1-MKT-*`; Interest is not Offer | interest frequency, mobility, zero-transfer Career, churn and Quick/Custom transfer metrics | `CG-MARKET`; `P0_CALIBRATION` | `SENS-F162-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 165 — `transfers.offer.{interceptsByOperation\|needCoefficient\|feasibilityCoefficient\|urgencyCoefficient\|bidderCompetitionCoefficient\|contractOpportunityCoefficient\|observableWillingnessCoefficient\|fitCoefficient\|marketLoading\|regionLoading\|clubLoading\|specificSigma}.{key}` | intercepts `WP-SIGNED-8`; signed predictors/loadings `WP-SIGNED-4`; `specificSigma` `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; private-offer observability limitation `EV-P1-MKT-*`; Offer remains separate | offer/no-offer, transfer, fee/salary and market-tail targets | `CG-MARKET`; `P0_CALIBRATION` | `SENS-F165-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 171 — `transfers.contractProposal.{expectationIntercepts\|expectationQualityCoefficients\|expectationPotentialCoefficients\|expectationAgeCoefficients\|expectationNeedCoefficients\|expectationCompetitionCoefficients\|expectationOpportunityCoefficients\|expectationSportingLevelCoefficients\|expectationNegotiationCoefficients}.{key}` | expectation intercepts `WP-SIGNED-8`; all signed expectation predictors `WP-SIGNED-4` | `WEAK_PRIOR`; `EV-P1-CONTRACT-*`; proposal expectations are not observed contract outcomes | proposal expectations, contract acceptance, salary/duration downstream behavior and market tails | `CG-MARKET`; `P0_CALIBRATION` | `SENS-F171-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 178 — `transfers.negotiation.{sellerScale\|feeCommitmentWeight\|salaryCommitmentWeight\|interceptsByOperation\|sellerSurplusCoefficient\|buyerSurplusCoefficient\|playerReservationCoefficient\|feasibilityCoefficient\|bidderCompetitionCoefficient\|frictionCoefficient\|marketLoading\|regionLoading\|sigma}.{key}` | intercepts and signed coefficients/loadings `WP-SIGNED-8/4`; `sellerScale/sigma` `WP-POSITIVE-SCALE`; declared commitment magnitudes `WP-NONNEG-4` | `WEAK_PRIOR`; negotiation privacy and rejected-offer limitations `EV-P1-TRF-*` | accepted/rejected negotiation, fee, salary and transfer tails | `CG-MARKET`; `P0_CALIBRATION` | `SENS-F178-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 199 — `awards.historyReputation.{profile}.{feature}` | `WP-SIGNED-4`; current-award feedback remains forbidden | `WEAK_PRIOR`; award histories `EV-P1-AWD-*`; lagged reputation contract | comparative award incidence/repeats/position tails and `PT-AWD-*` | `CG-NATIONAL-AWARDS`; `P2_REFINEMENT` | `SENS-F199-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 209 — `reputationSocial.sentiment.{dynamics\|impulseProfiles}.{marketProfile}.{parameter}` | intercept/impulse coefficients `WP-SIGNED-4`; persistence `WP-PERSISTENCE-SIGNED`; innovation scales `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; no comparable sentiment construct; public engagement is not sentiment | attention, follower/engagement, viral and PBR balance diagnostics | `CG-REPUTATION-SOCIAL`; `P2_REFINEMENT` | `SENS-F209-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 222 — `retirementComeback.motivation.{intercept\|ambitionWeight\|moraleWeight\|roleWeight\|exposureWeight\|performanceTrendWeight\|playableHealthWeight\|activeHealthBurdenWeight\|sequelaBurdenWeight\|contractContinuityWeight\|marketOpportunityWeight\|teamRelevanceWeight\|sportingRelevanceWeight\|publicAttentionWeight\|unresolvedGoalsWeight\|fulfillmentWeight\|ambitionFulfillmentWeight\|contextWeight.{feature}}` | intercept `WP-SIGNED-8`; signed predictors `WP-SIGNED-4`; any declared monotone magnitude uses `WP-NONNEG-4` | `WEAK_PRIOR`; public statements do not reveal private motivation | retirement cause, Career length, comeback/finalization and non-termination tails | `CG-LIFECYCLE`; `P0_CALIBRATION` | `SENS-F222-LOW/REF/HIGH`; `CALIBRATION_OWNER` + `PRODUCT_OWNER` review |
| 223 — `retirementComeback.fulfillment.{massScale\|achievementImportance.{definition}\|recencyLambda.{definitionFamily}\|goalWeight.{goalType}\|noGoalsNeutral}` | `massScale/achievementImportance/goalWeight` `WP-NONNEG-4`; `recencyLambda` positive `WP-POSITIVE-SCALE`; `noGoalsNeutral` exact boolean structural domain | `PRODUCT_CONSTRAINED` + `WEAK_PRIOR`; no direct latent observation | retirement/comeback/finalization, longevity, score-farming and Product tails | `CG-LIFECYCLE`; `P0_CALIBRATION` | `SENS-F223-LOW/REF/HIGH`; `CALIBRATION_OWNER` + `PRODUCT_OWNER` |
| 231 — `retirementComeback.retirementHazard.{cause}.{intercept\|ageWeight\|declineWeight\|healthWeight\|roleWeight\|contractWeight\|marketWeight\|motivationWeight\|achievementWeight\|contextWeight.{feature}\|sharedLoading\|specificSigma}` | intercepts `WP-SIGNED-8`; signed/declared monotone effects/loadings `WP-SIGNED-4/WP-NONNEG-4`; `specificSigma` `WP-POSITIVE-SCALE` | `WEAK_PRIOR`; censored survival evidence `EV-P1-RET-*`; no threshold/max age | retirement cause/age, Career length, position longevity, non-termination and tier tails | `CG-LIFECYCLE`; `P0_CALIBRATION` | `SENS-F231-LOW/REF/HIGH`; `CALIBRATION_OWNER` |
| 232 — `retirementComeback.comebackMotivation.{intercept\|recentTau\|elapsedTau\|priorLevelWeight\|sportingReputationWeight\|awarenessWeight\|attentionWeight\|motivationWeight\|healthWeight\|marketWeight\|ageWeight\|contextWeight.{feature}}` | intercept `WP-SIGNED-8`; signed effects `WP-SIGNED-4`; positive `recentTau/elapsedTau` `WP-POSITIVE-TIME` | `PRODUCT_CONSTRAINED` + `WEAK_PRIOR`; selected comeback evidence `EV-P1-CBK-*` | `PT-CB-*`, comeback frequency/gaps/cycles, Career length and non-termination | `CG-LIFECYCLE`; `P0_CALIBRATION` | `SENS-F232-LOW/REF/HIGH`; `CALIBRATION_OWNER` + `PRODUCT_OWNER` |
| 234 — `retirementComeback.viability.{referenceYears\|intercept\|healthWeight\|ageWeight\|priorLevelWeight\|marketWeight\|motivationWeight\|contextWeight.{feature}}` | positive `referenceYears` `WP-POSITIVE-TIME`; intercept `WP-SIGNED-8`; signed/declared monotone predictors `WP-SIGNED-4/WP-NONNEG-4` | `PRODUCT_CONSTRAINED` + `WEAK_PRIOR`; elapsed-return chronology; no auto-close threshold | continuation, comeback success, finalization opportunities, non-termination and lifecycle tails | `CG-LIFECYCLE`; `P0_CALIBRATION` | `SENS-F234-LOW/REF/HIGH`; `CALIBRATION_OWNER` + `PRODUCT_OWNER` |

## 5. The 9 unidentifiable V1 Scoring templates

All nine have:

```text
priorPolicy=DEFERRED_UNTIL_SCORING_DATA
activeInitialEngineFit=false
initialEnginePolicy=EXCLUDED_FROM_INITIAL_ENGINE_FIT
sensitivityRequiredBeforeScoringValidation=true
freezeBlocker=SCORING_DATA_AND_SENSITIVITY_REQUIRED
```

Their admissible domain is the exact domain already defined by
[Scoring Math Spec](SCORING_MATH_SPEC.md); G3D-4G invents neither points nor a
numeric prior. Activation requires the named catalog/cohort data candidate,
separate `ScoringConfiguration`/`ScoringCalibrationData` identity and approval
by `SCORING_OWNER`.

| Matrix row / template | Policy and admissible domain | Activation condition | Sensitivity scenarios / downstream metrics |
|---|---|---|---|
| 243 — `scoringConfiguration.pri.featureProfile.{position}.{component}.{feature}.{weight\|direction\|transformRef\|evidenceGateRef}` | `DEFERRED`; finite rational weights, enumerated direction and resolvable refs per Scoring spec | PRI cohorts/transforms and GK/CM/ST distributions available | `SENS-G243-LOW/REF/HIGH`; PRI composition, position fairness, tiers |
| 245 — `scoringConfiguration.contributionCoefficient.{feature}.{weight\|transformRef}` | `DEFERRED`; finite rational weights and resolvable transform refs | contribution cohort/evidence bands available | `SENS-G245-LOW/REF/HIGH`; CC distribution, title/award contribution, tiers |
| 247 — `scoringConfiguration.clubAchievementCatalog.{competitionDefinition}.{outcome}.{baseValue\|multiplier\|ccUsage\|stackingPolicy}` | `DEFERRED`; non-negative exact rational/integer scoring domain and enumerated policies | complete club Competition scoring catalog approved | `SENS-G247-LOW/REF/HIGH`; PTC_CLUB, title farming, tiers |
| 249 — `scoringConfiguration.nationalAchievementCatalog.{competitionDefinition}.{outcome}.{baseValue\|multiplier\|ccUsage\|stackingPolicy}` | `DEFERRED`; non-negative exact scoring domain and enumerated policies | NationalCompetition scoring catalog approved | `SENS-G249-LOW/REF/HIGH`; PSN, national-outcome composition, tiers |
| 250 — `scoringConfiguration.awardScoringCatalog.{awardDefinition}.{baseValue\|ijlPolicy\|equivalenceGroup\|stackingPolicy\|capGroup}` | `DEFERRED`; exact scoring domain plus resolvable definition/policy IDs | Award scoring values/equivalence groups approved | `SENS-G250-LOW/REF/HIGH`; PPI/PSN, repeat awards, tiers |
| 253 — `scoringConfiguration.recordAndLongevityCatalog.{definition}.{baseValue\|upgradePolicy\|sharedScope\|equivalenceGroup\|minima}` | `DEFERRED`; exact scoring domain and enumerated policies | record/longevity definitions and values approved | `SENS-G253-LOW/REF/HIGH`; PRL, record farming, longevity tiers |
| 254 — `scoringConfiguration.popularityAndHistoric.{feature}.{weight\|transformRef\|cohortRef}` | `DEFERRED`; exact rational domain and resolvable cohort/transform refs | social/historic cohorts and transforms available | `SENS-G254-LOW/REF/HIGH`; PBR share/cap saturation, social farming, tiers |
| 257 — `scoringConfiguration.cohortReference.{purpose}.{cohortId\|fallbackHierarchy\|shrinkageProfile}` | `DEFERRED`; resolvable immutable IDs and enumerated shrinkage profile | cohort artifacts published as scoring candidates | `SENS-G257-LOW/REF/HIGH`; PRI shrinkage, position fairness, replay |
| 266 — `scoringCalibrationData.ijl.{competitionDefinition}.{edition}.{value\|sourceRef}` | `DEFERRED`; IJL value domain from Scoring spec plus immutable source reference | IJL table candidate with provenance and scoringVersion binding | `SENS-G266-LOW/REF/HIGH`; competitive factors, PTC/PPI/PSN and tiers |

The nine rows are inactive in G3D-5A through G3D-5H. They activate only in the
separate G3D-5I Scoring/tier phase and never enter `EngineParameterSet`.

## 6. Sensitivity execution contract

Each F/G row has three named scenarios. `REFERENCE` means the declared prior
median or structural reference case, never a calibrated value. Skewed/positive
families use distribution quantiles rather than symmetric plus/minus offsets.
Future candidate artifacts must record the evaluated expanded fields, scenario
IDs, bundle root hash and common `CalibrationSeedSet`.

Active Engine families use a staged plan:

1. constrained LOW/REFERENCE/HIGH sweeps with common random numbers;
2. Morris screening or Latin Hypercube over coupled groups;
3. Sobol/Saltelli or another variance-based method for material survivors when
   computationally feasible;
4. focused tail and Quick/Custom regression on the same seed set.

Scoring G rows use the same principle only after activation in G3D-5I.

Metrics include Career length, position minutes, Performance, injury incidence
and long absence, transfer/contract behavior, national call-up, Award
incidence, follower/PBR tail, retirement/comeback/finalization, tier
probabilities and Quick/Custom divergence as applicable to the row.

## 7. Dominance and freeze rule

A weak or deferred template cannot reach V1 freeze when a plausible sensitivity
move causes a P0 Acceptance Target to leave its warning band, reverses a
monotonicity/invariant, creates material position/mode skew, or lets one weak
family dominate multiple downstream systems. The state is
`SENSITIVITY_BLOCKS_FREEZE` until the owner either:

- improves evidence and creates a successor prior;
- narrows the mathematical model under a separately approved normative change;
- demonstrates robustness with the required campaign; or
- keeps the inactive Scoring row deferred.

No downstream coefficient may compensate for a failed upstream weak-family
sensitivity.

## 8. Contract integrity

| Check | Required result |
|---|---:|
| F templates with complete policy | 17/17 |
| G templates with explicit deferral policy | 9/9 |
| templates with named sensitivity scenarios | 26/26 |
| G templates active in initial Engine fit | 0/9 |
| assigned parameter values | 0 |

This contract is an immutable input of the G3D-4G
`CalibrationInputBundleCandidate`. Any policy change requires a new contract
version and bundle root hash.
