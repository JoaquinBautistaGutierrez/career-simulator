# G3D Initial Calibration Plan

Status: `AUTHORIZED_FOR_SEPARATE_G3D_5A_TASK`

This plan defines G3D-5. It creates no parameter value, ParameterSet candidate, scoring
configuration or executable gameplay artifact.

## 1. Entry decision

G3D-4G closed the three pre-calibration controls. Every G3D-5A run manifest
must preserve their bindings:

1. use the audited **268** canonical parameter-path templates; do not perpetuate the historical
   275-row claim and do not invent seven paths;
2. bind an immutable candidate-data manifest/hash and permitted derived artifacts; Data V1 does
   not need publication before experimentation;
3. declare provisional range, prior and mandatory global sensitivity for every F/G parameter.

The authoritative controls are
[Precalibration Gate Checklist](G3D_PRECALIBRATION_GATE_CHECKLIST.md),
[Calibration Input Lineage Manifest](G3D_CALIBRATION_INPUT_LINEAGE_MANIFEST.md)
and [Weak Parameter Prior and Sensitivity Contract](G3D_WEAK_PARAMETER_PRIOR_AND_SENSITIVITY_CONTRACT.md).

Decision: `CALIBRATION_CAN_USE_CANDIDATE_DATA`. Data V1 freeze is required before
`VALIDATED_CANDIDATE` can become `FROZEN_V1`, not before initial estimation. A candidate cannot
silently refresh a source, cutoff, transform or hash.

## 2. Candidate lifecycle

```text
UNASSIGNED
  -> ESTIMATED_CANDIDATE
  -> JOINT_CALIBRATED_CANDIDATE
  -> INTEGRATED_CANDIDATE
  -> VALIDATED_CANDIDATE
  -> FROZEN_V1
```

- An unsuccessful transition creates a rejected child candidate; it never overwrites its parent.
- Structural-fixed identities remain validated, not tuned.
- `FROZEN_V1` requires all applicable acceptance gates, independent goldens, replay stability,
  data/license freeze and version publication.
- Engine and Scoring candidates have different roots, owners and hashes.

## 3. `EngineParameterSetCandidate` contract

```text
EngineParameterSetCandidate {
  candidateId
  parentCandidateId?
  lifecycleState
  createdAtLogical
  ownerRole
  referenceCutoffDate
  researchSnapshotId
  schemaVersion
  engineVersionCandidate
  contentVersionCandidate
  dataCandidateId
  dataManifestHash
  evidenceManifestHash
  calibrationInputBundleId
  calibrationInputBundleRootHash
  productTargetManifestHash
  calibrationSeedSetId
  parameterRegistryHash
  parameterEntries[] {
    parameterPath
    valueRepresentation
    value
    unit
    sourceType
    identifiabilityClass
    estimationMethodId
    evidenceIds[]
    datasetIds[]
    targetIds[]
    confidence
    provisional
    sensitivityRequired
  }
  changedParameterPaths[]
  rationale
  expectedTargetsAffected[]
  actualAcceptanceReportRefs[]
  compatibilityAssessment
  canonicalization = RFC8785
  candidateSha256
}
```

This contract is prospective: G3D-4F instantiates **no** object and supplies **no** `value`.
Competitive publication requires the existing five-version contract plus ParameterSet identity;
this candidate ID is lineage, not a sixth competitive version.

## 4. Estimation-method policy

| Evidence/problem | Preferred initial method | Required checks |
|---|---|---|
| locations, variances, shares, quantiles | weighted empirical summaries or hierarchical MLE | denominators, exposure gates, bootstrap uncertainty |
| count production/injuries/awards | Poisson/NB2 likelihood matching the closed math family | zero mass, overdispersion, exposure offset, tails |
| binary selection/transition | logistic/Bernoulli likelihood | at-risk denominator, calibration curve, position/context |
| persistence/Form/incumbency | state-space/AR likelihood or transition summaries | stationarity, interval consistency, lag discipline |
| retirement/manager/recovery | survival/competing-risk/censored likelihood | left truncation, right censoring, endpoint definition |
| latent axes/measurement proxies | hierarchical Bayesian or regularized latent model | sign/scale identification and posterior/predictive checks |
| quantile/CDF bindings | deterministic empirical CDF/quantile transform | monotonic knots, exact identity/hash, tail coverage |
| coupled simulator outputs | staged simulated method of moments (SMM) with common random numbers | multiple targets, held-out seeds, global sensitivity |
| sparse/weak/private processes | constrained SMM/ABC-style likelihood-free fit with documented priors | alternative priors, wide sensitivity, no false observation claim |

ABC is a fallback when no tractable likelihood exists, not the default. Multi-objective loss
retains target identities and warning/fail bands; no scalar average may hide a failed critical
segment.

## 5. Calibration sequence

| Phase | Scope | Inputs | Outputs | Gate / stop condition |
|---|---|---|---|---|
| `G3D-5A` | anchors, identities and observation transforms | audited registries, candidate data, structural goldens | structural/binding candidate; no causal tuning beyond anchors | cardinality/hash/domain checks; no orphan P0 item |
| `G3D-5B` | Creation, Development, Role/Minutes, Performance | 4A evidence, Product mode/position targets | player/exposure/production child candidates | direct targets and GK/CM/ST/ARG/ESP sensitivity |
| `G3D-5C` | Health | 4B evidence + accepted Role exposure | incidence/recovery/relapse candidate | family/origin denominators, availability and tails |
| `G3D-5D` | Club/World/Market | 4C evidence + accepted player/performance/health | club state, manager and market child candidate | no MarketValue circularity; Money/offer semantics |
| `G3D-5E` | National Team/Awards | 4D evidence + closed upstream windows | selection/outcome/award candidate | eligibility/RNG, comparative/statistical separation |
| `G3D-5F` | Reputation/Social | 4E evidence + completed sporting facts | lagged reputation/audience candidate | platform/era, no same-step feedback, PBR guards |
| `G3D-5G` | Lifecycle | 4E survival evidence + upstream Health/Role/Market | retirement/comeback/finalization-opportunity candidate | no hard cap/cooldown; Product frequency/tail bands |
| `G3D-5H` | integrated engine | all accepted child candidates | `INTEGRATED_CANDIDATE` | cross-system and tail campaigns; reopen upstream causes |
| `G3D-5I` | Scoring/tier validation | immutable career facts, scoring catalogs/cohorts | separate scoring candidates/diagnostics | close scoring data gaps; tier/category/PBR acceptance |
| `G3D-5J` | goldens and full acceptance | integrated candidates, independent worksheets, code version when authorized | acceptance bundle proposal | Gates 1–7, replay, independent verification |

No phase starts automatically. Every phase follows work → checks → selective stage → commit →
push → confirmation.

## 6. Monte Carlo campaign plan

| Campaign | Purpose | Earliest executable dependency | Principal metrics |
|---|---|---|---|
| `MC-SMOKE` | invariants, finite state, deterministic draw trace, gross distributions | normative primitives + candidate loader/harness | zero violations, replay/hash, impossible states |
| `MC-CENTRAL` | medians/common quantiles and subsystem targets | G3D-5B/C candidates | age, minutes, production, injury central mass |
| `MC-POSITION` | GK/CM/ST fairness and shape | G3D-5B through 5E | high-tier opportunity proxies, position outputs |
| `MC-MODE` | Quick/Custom distributional equivalence | G3D-5B integrated creation path | mean/median/quantiles/W1/KS/tier gaps |
| `MC-TAIL` | rare coherent outcomes without caps | integrated 5H candidate, DEEP seeds | P99/P99.9, extreme injury/award/social/longevity |
| `MC-LIFECYCLE` | retirement/comeback/finalization tails | 5G candidate | survival, comeback counts/gaps, nontermination diagnostic |
| `MC-SOCIAL` | attention/follower/viral/PBR balance | 5F plus scoring diagnostic bindings | growth/loss, viral episodes, cap saturation, PBR share |
| `MC-SCORING` | category/tier composition | 5I scoring candidates | PRI/PTC/PPI/PSN/PRL/PBR, tier frequencies |

All comparisons use the same applicable CalibrationSeedSet. Confidence intervals use binomial
intervals for frequencies, bootstrap for quantiles/distances and Monte Carlo standard error for
means/correlations. SMOKE never approves rare-event frequency.

## 7. Acceptance hierarchy and reports

1. Gate 1 — math, schema, domains, invariants.
2. Gate 2 — subsystem targets.
3. Gate 3 — cross-system causality and lag acceptance.
4. Gate 4 — tail coherence.
5. Gate 5 — end-to-end career distributions.
6. Gate 6 — scoring/category/tier acceptance.
7. Gate 7 — replay and golden stability.

Each candidate iteration records parent, changed groups, rationale, expected targets, actual
metrics/intervals, same-seed comparison, sensitivity, accepted/rejected state and artifact hashes.
Only a few coherent parameter groups change per iteration. Downstream compensation for an
upstream miss is rejected.

## 8. Scoring gaps and boundary

| Gap | Classification | Effect |
|---|---|---|
| IJL complete table | `BLOCKS_SCORING_VALIDATION` | does not block Engine causal calibration |
| competition/award equivalence groups | `BLOCKS_SCORING_VALIDATION` | blocks PPI/PSN comparison and tier acceptance |
| RecordScoringDefinition | `P2_SCORING_DATA` until included in V1 scope | no invented points |
| CareerMilestoneDefinition | `P2_SCORING_DATA` | PRL validation incomplete |
| HistoricAchievementDefinition | `P2_SCORING_DATA` | historic PBR component incomplete |
| PRI GK/CM/ST cohort transforms | `BLOCKS_SCORING_VALIDATION` | gameplay Performance may still calibrate |
| CC/exposure/evidence cohorts | `BLOCKS_SCORING_VALIDATION` | scoring contribution validation pending |
| social/historic cohorts | `BLOCKS_SCORING_VALIDATION` | PBR distribution/cap diagnostics pending |

No web evidence may decide point values. Normative/Product provenance remains mandatory.

## 9. First authorized work in G3D-5A

G3D-5A may prepare exact transforms, candidate schemas/manifests, independent
worksheets and observable/structural anchors only from the list below. Every
run binds `CIB-G3D4G-RSNAP-20260807-C1` and its root hash. It must not publish,
freeze, activate F/G values or implement gameplay.

### 9.1 `G3D-5A_ACTIVE_PARAMETER_TEMPLATES`

This is the normative, exhaustive active list. Matrix row number plus canonical
path jointly identify membership; wildcard expansion does not create another
template identity.

| Matrix row | Canonical parameter template | Class |
|---:|---|---|
| 10 | `player.creation.powerSurrogate.referenceCdf.{position}.{knot}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 12 | `player.creation.mathProfile.{capabilityScale\|stateRounding\|standardNormalSampler\|positionOrder\|positionGroupOrder\|footOrder}` | `E_SYNTHETIC_STRUCTURAL` |
| 13 | `development.capabilityFamilyMap.{capability}` | `E_SYNTHETIC_STRUCTURAL` |
| 14 | `development.mathProfile.{capabilityEvolutionSpace\|developmentComposition\|maturationWindowMultiplier\|verticalSliceEnabledPositions}` | `E_SYNTHETIC_STRUCTURAL` |
| 34 | `roleMinutes.minutes.intercept.{context}.{position}.{role}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 38 | `roleMinutes.minutes.sigmaPlayer.{context}.{position}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 42 | `roleMinutes.appearances.intercept.{context}.{competitionType}.{role}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 44 | `roleMinutes.starts.intercept.{context}.{competitionType}.{role}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 46 | `roleMinutes.appearances.minimumRecordedMinutes` | `E_SYNTHETIC_STRUCTURAL` |
| 48 | `roleMinutes.contextFeatureCatalog` | `E_SYNTHETIC_STRUCTURAL` |
| 49 | `roleMinutes.role.canonicalOrder` | `E_SYNTHETIC_STRUCTURAL` |
| 50 | `roleMinutes.mathProfile.logitNormalMean` | `E_SYNTHETIC_STRUCTURAL` |
| 51 | `roleMinutes.quantization.state` | `E_SYNTHETIC_STRUCTURAL` |
| 52 | `performance.taskAbilities.tasks.{position}.{task}` | `E_SYNTHETIC_STRUCTURAL` |
| 57 | `performance.underlying.dimensionsByPosition.{position}` | `E_SYNTHETIC_STRUCTURAL` |
| 72 | `performance.stProduction.{kappaGoals\|kappaAssists}.{positionContext}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 73 | `performance.cmProduction.{goalModel\|assistModel}.{parameter}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 76 | `performance.cmProduction.{kappaGoals\|kappaAssists}.{context}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 77 | `performance.gkProduction.shotsFacedModel.{parameter}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 78 | `performance.gkProduction.saveModel.{parameter}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 80 | `performance.gkProduction.{exposureSigma\|kappaShotsFaced}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 81 | `performance.gkProduction.cleanSheetEligibilityPolicyRef` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 85 | `performance.streamModelIds.{purpose}` | `E_SYNTHETIC_STRUCTURAL` |
| 86 | `health.math.{epsilonHealthState\|recoveryBurdenUnitScale}` | `E_SYNTHETIC_STRUCTURAL` |
| 98 | `health.recovery.{requirementIntercept\|requirementSigma\|betaSeverity\|betaRecoveryCapacity\|betaMedical\|betaAge\|betaHistory\|contextWeight}.{injuryFamily}.{contextKey}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 102 | `health.availability.intervalAllocation` | `E_SYNTHETIC_STRUCTURAL` |
| 107 | `health.familyCatalogRef` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 108 | `health.contextFeatureCatalog` | `E_SYNTHETIC_STRUCTURAL` |
| 109 | `health.traitTransform` | `E_SYNTHETIC_STRUCTURAL` |
| 111 | `health.externalCause.adapterCatalogRef` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 112 | `health.samplerIds.{purpose}` | `E_SYNTHETIC_STRUCTURAL` |
| 113 | `health.modelIds.{purpose}` | `E_SYNTHETIC_STRUCTURAL` |
| 114 | `health.quantization.state` | `E_SYNTHETIC_STRUCTURAL` |
| 115 | `health.{calibrationTargetSetRef\|goldenFixtureSetRef}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 117 | `clubWorld.stateMath.{epsilonState\|quantizationProfile}` | `E_SYNTHETIC_STRUCTURAL` |
| 125 | `clubWorld.tactics.tacticalDimensions.{dimension}` | `E_SYNTHETIC_STRUCTURAL` |
| 127 | `clubWorld.positionCompetition.{meansByContextPositionDimension\|persistence\|clubStrengthCoefficients\|scarcityCoefficients\|financeCoefficients\|tacticalDemandCoefficients\|continuityCoefficients\|factorLoadings\|sigmas}.{key}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 128 | `clubWorld.positionCompetition.{scarcityMeans\|scarcityPersistence\|scarcityTalentCoefficients\|scarcityFactorLoadings\|scarcitySigmas}.{key}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 133 | `clubWorld.initialState.{deterministicOffsets\|factorLoadings\|entitySigmas\|fallbackProfileRefs}.{key}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 134 | `clubWorld.streams.{purpose}.modelId` | `E_SYNTHETIC_STRUCTURAL` |
| 136 | `competitions.calendar.minuteUnitsPerMatchEquivalentByDefinition.{competitionDefinition}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 142 | `competitions.playerContribution.competitionAggregationRules.{competitionType}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 144 | `competitions.leagueOutcome.canonicalTieBreakProfile` | `E_SYNTHETIC_STRUCTURAL` |
| 150 | `competitions.phaseGraphProfiles.{competitionDefinition}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 151 | `competitions.definitionParameterBindings.{competitionDefinition}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 152 | `competitions.streams.{purpose}.modelId` | `E_SYNTHETIC_STRUCTURAL` |
| 161 | `transfers.candidateField.{allowedOperationPolicies\|logicalEligibilityPolicies\|requiredContextFields\|canonicalOrderPolicy}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 179 | `transfers.monetary.{quantizerId\|schemaRangePolicy\|positiveDomainPolicy\|conversionPolicyRefs\|referenceCurrencyContextRefs\|overflowValidationConfig}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 181 | `transfers.streams.{purpose}.modelId` | `E_SYNTHETIC_STRUCTURAL` |
| 187 | `nationalTeam.roleMinutesProfileRef` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 189 | `nationalTeam.teamStrength.{epsilonState\|mu\|phi\|betaGeneration\|betaRecent\|lambdaWorld\|lambdaSeason\|sigmaDimension}.{key}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 191 | `nationalTeam.contributionProfileRef.{position}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 192 | `nationalTeam.competition.{utilityIntercept\|supportWeight\|betaContribution\|betaContext\|lambdaTournament\|sigmaTeam\|knockoutContextCoefficients}.{key}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 193 | `nationalTeam.streams.{purpose}.modelId` | `E_SYNTHETIC_STRUCTURAL` |
| 196 | `awards.positionTaskMappings.{profile}.{position}.{featureId}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 198 | `awards.statisticalField.{profile}.{baseLogMean\|betaCompetition\|betaEra\|betaFieldQuality\|sigmaEdition\|logKappa\|epsilonDispersion\|sigmaCompetitorHeterogeneity}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 200 | `awards.{normalSamplerId\|negativeBinomialSamplerId\|tieAlgorithmVersion}` | `E_SYNTHETIC_STRUCTURAL` |
| 201 | `awards.streamModelIds.{awardDefinition}.{purpose}` | `E_SYNTHETIC_STRUCTURAL` |
| 202 | `reputationSocial.numerical.{stateScale\|sentimentScale\|followerStorage\|quantization}` | `E_SYNTHETIC_STRUCTURAL` |
| 210 | `reputationSocial.attention.{decayFamilies\|impulseProfiles}.{profile}.{parameter}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 212 | `reputationSocial.regional.diffusionPassesPerBoundary` | `E_SYNTHETIC_STRUCTURAL` |
| 216 | `reputationSocial.followers.viralSampler` | `E_SYNTHETIC_STRUCTURAL` |
| 217 | `reputationSocial.engagement.dynamics.{marketProfile}.{parameter}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 218 | `reputationSocial.publicEventProfiles.transforms.{signalProfile}.{parameter}` | `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` |
| 220 | `reputationSocial.shocks.normalSampler` | `E_SYNTHETIC_STRUCTURAL` |
| 221 | `reputationSocial.modelIds.{canonicalPairwiseSum\|followerLogAdapter\|regionalDiffusion\|globalProjection\|followerGrowth}` | `E_SYNTHETIC_STRUCTURAL` |
| 224 | `retirementComeback.age.{positionFamily}.{location\|scale}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 236 | `retirementComeback.history.{episodeSummaryTransform\|priorLevelTransform}` | `A_DIRECT_ESTIMATION_CANDIDATE` |
| 238 | `retirementComeback.numericalDomains.{hazardValidationBounds\|finitePredictorPolicy\|stateQuantization}` | `E_SYNTHETIC_STRUCTURAL` |

Count: 20 class A + 16 Engine-owned class B + 33 Engine-owned class E = **69**.

### 9.2 Explicit exclusions

G3D-5A excludes all 146 C joint templates, 2 D Product-constrained templates,
17 F weak templates and 4 H non-slice templates. It also excludes 30
Scoring-owned templates (6 B, 15 E and 9 G). All remain canonical and
value-free. The G rows activate only in G3D-5I under the weak/deferred contract.

Result after G3D-4G: **`GO_FOR_G3D_5A_OBSERVABLE_ANCHORS`**.
