# G3D Initial Calibration Plan

Status: `AUTHORIZED_AFTER_PRECALIBRATION_FIXES`

This plan defines G3D-5. It creates no parameter value, ParameterSet candidate, scoring
configuration or executable gameplay artifact.

## 1. Entry decision

G3D-5 may begin after three pre-calibration controls are recorded in its first run manifest:

1. use the audited **268** canonical parameter-path templates; do not perpetuate the historical
   275-row claim and do not invent seven paths;
2. bind an immutable candidate-data manifest/hash and permitted derived artifacts; Data V1 does
   not need publication before experimentation;
3. declare provisional range, prior and mandatory global sensitivity for every F/G parameter.

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

G3D-5A may prepare exact transforms, candidate schemas/manifests, independent worksheets and
anchor estimates from classes A/B/E. It must not publish, freeze or use G/F values without the
declared provisional/sensitivity contract. Gameplay implementation remains separately blocked.

Result after this audit: **`GO_FOR_G3D_5_WITH_PRECALIBRATION_FIXES`**.
