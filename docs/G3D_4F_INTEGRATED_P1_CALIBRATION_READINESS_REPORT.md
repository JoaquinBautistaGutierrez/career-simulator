# G3D-4F Integrated P1 Evidence Audit & Calibration Readiness Report

Status: `COMPLETE_WITH_PRECALIBRATION_FIXES`

Result: **`GO_FOR_G3D_5_WITH_PRECALIBRATION_FIXES`**

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4F-INTEGRATED-AUDIT-V1`

## 1. Decision

P0 and P1 evidence is sufficient to begin staged, provisional G3D-5 EngineParameterSet
calibration after three pre-calibration controls: accept the audited 268-template cardinality,
bind immutable candidate-data hashes, and declare provisional priors/ranges plus sensitivity for
weakly identified parameters. G3D-4F assigns no value and does not publish Data V1,
EngineParameterSet, ScoringConfiguration, expected goldens or Monte Carlo results.

Scoring catalog/cohort gaps remain material for Gate 6 and V1 publication, but are downstream of
the initial Engine anchors. No mathematical, schema or determinism RED exists.

## 2. Integrated evidence inventory

| Acquisition block | EvidenceRecords | Source routes | Evidence tier A/B/C/D | Main domains |
|---|---:|---:|---|---|
| G3D-4A | 30 | 10 | 3 / 25 / 2 / 0 | Creation, Development, Role/Minutes, Performance |
| G3D-4B | 43 | 20 | 6 / 36 / 1 / 0 | Health, Injury, Recovery |
| G3D-4C | 40 | 20 | 11 / 11 / 18 / 0 | Clubs, Managers, Market, Contracts |
| G3D-4D | 38 | 21 (14 new, 7 reused) | 29 / 0 / 9 / 0 | National Team, Awards |
| G3D-4E | 50 | 29 | 20 / 29 / 1 / 0 | Reputation, Social, Retirement, Comeback |
| **P1 total** | **201** | **100 route uses; 93 newly introduced routes** | **69 / 101 / 31 / 0** | all planned P1 domains |

Raw restricted datasets remain outside Git. EvidenceRecords, permitted aggregates, source
manifests and observational hashes preserve provenance. P1 source counts are route identities,
not a claim that publisher coverage is independent; correlated provider/official observations
remain explicit in each phase manifest.

## 3. Registry cardinality audit

| Registry | Claimed entering G3D-4F | Mechanical result | Duplicate IDs | Resolution |
|---|---:|---:|---:|---|
| Parameter templates | 275 | **268** | 0 | historical G3D-1 prose error; all actual canonical rows classified; no seven paths invented |
| Calibration Targets | 186 | **186** | 0 | exact |
| DatasetDefinitions | 40 | **40** | 0 | exact |
| Golden Vectors | 139 | **139** | 0 | exact |
| Product Targets | 77 | **77 exact numeric IDs** | 0 | exact; wildcard overlay rows excluded from count |

The parameter discrepancy is not data missingness. Git history proves commit `2564527` already
had 268 canonical rows while reporting 275. The G3C parameter contracts do not identify seven
missing normative paths. The safe correction is to use 268 in future candidate manifests and
validators. Adding placeholder parameters would violate the no-invention rule.

## 4. Parameter identifiability

The exhaustive 268-row source of truth is
[G3D Parameter Identifiability Matrix](G3D_PARAMETER_IDENTIFIABILITY_MATRIX.md).

| Primary class | Templates | Calibration meaning |
|---|---:|---|
| `A_DIRECT_ESTIMATION_CANDIDATE` | 20 | observational component may be estimated with declared likelihood/transform |
| `B_DERIVED_FROM_OBSERVATIONAL_SUMMARY` | 22 | deterministic derivation or catalog/data binding |
| `C_JOINT_CALIBRATION_REQUIRED` | 146 | staged latent/cross-system fit |
| `D_PRODUCT_CONSTRAINED_CALIBRATION` | 2 | frozen Product Targets are the primary constraint |
| `E_SYNTHETIC_STRUCTURAL` | 48 | exact normative identity/algorithm; validate, do not tune |
| `F_WEAKLY_IDENTIFIED` | 17 | regularized provisional strategy and global sensitivity mandatory |
| `G_UNIDENTIFIABLE_V1` | 9 | scoring resources/gaps excluded from initial Engine fit; close before Gate 6 |
| `H_NOT_REQUIRED_FOR_INITIAL_SLICE` | 4 | explicit non-expansion/tooling/future path; no silent default |

Every existing path has one class, coupling group, evidence/dataset/target/golden mapping,
segmentation, method, priority, confidence and blocker strategy. Critical orphan paths: **0**.
No parameter receives a value.

## 5. Dataset and target readiness

Dataset audit totals:

- `READY_FOR_CALIBRATION_USE`: 5;
- `READY_WITH_LIMITATIONS`: 25;
- `REFERENCE_ONLY`: 1;
- `BLOCKED_BY_COVERAGE`: 5;
- `SOURCE_IDENTIFIED_ONLY`: 4 scoring datasets.

Target audit totals:

- `READY_FOR_CALIBRATION`: 13;
- `READY_WITH_LIMITATIONS`: 91;
- `PRODUCT_DEFINED`: 6;
- `INVARIANT_ONLY`: 28;
- `DIAGNOSTIC_ONLY`: 29;
- `BLOCKED_BY_DATA`: 10;
- `BLOCKED_BY_IDENTIFIABILITY`: 9.

The complete 40- and 186-row audits are in
[Calibration Readiness Scorecard](G3D_CALIBRATION_READINESS_SCORECARD.md). Blocked target rows
are scoring/P2 refinements or have an explicit Product/sensitivity route; none is silently
accepted. Critical target orphans: **0**.

## 6. Golden readiness

All 139 requirements remain `SPECIFIED`; expected outputs computed: **0**.

| Readiness | Count | Earliest derivation |
|---|---:|---|
| `STRUCTURAL_ONLY` | 16 | before calibration with exact/manual reference |
| `READY_FOR_EXPECTED_OUTPUT_DERIVATION` | 3 | during anchor/data-binding work |
| `READY_AFTER_PARAMETERSET` | 101 | after a candidate supplies exact inputs |
| `BLOCKED_BY_DATA` | 19 | after scoring configuration/cohorts/catalog gaps close |

Critical outputs require a manual/rational worksheet or independent reference implementation;
the implementation under test cannot be their only source.

## 7. Conflicts and compatibility

No hidden material conflict is accepted. The following observations are intentionally not pooled:

| Topic | State | Resolution |
|---|---|---|
| injury incidence across time-loss/medical-attention definitions | `RESOLVED_CONFLICT` | segment by definition/origin/exposure; no averaging |
| manager changes versus adjudicated dismissals | `RESOLVED_CONFLICT` | provider changes remain `UNKNOWN`; event-cause model later |
| fee zero codes versus undisclosed/free transfers | `UNRESOLVED_CONFLICT_NONBLOCKING` | zero remains unresolved; exclude from exact fee class until adjudicated |
| selected National Team players versus plausible candidate denominator | `NOT_COMPARABLE` | joint field model and sensitivity; no observed call-up rate invented |
| official award nominees versus latent simulator field | `NOT_COMPARABLE` | separate real definition from simulator comparison field |
| search, mentions, followers and engagement | `NOT_COMPARABLE` | platform/measurement model; no awareness/sentiment pooling |
| retirement announcement, last appearance and registration end | `RESOLVED_CONFLICT` | interval-censored lifecycle definition under ADR-079 |

None requires changing a G3C family.

## 8. Product versus observational tensions

| Area | Classification | Audit conclusion |
|---|---|---|
| comeback 3–8% and multiple-comeback tails | `NOT_COMPARABLE` | no representative denominator; Product Targets remain normative and observed cases constrain routes/gaps only |
| retirement/career-duration shapes | `CONSISTENT` | observed smooth survival/tails support no hard age, while exact frequencies remain calibrated later |
| follower/viral heavy tails versus PBR cap/share | `NOT_COMPARABLE` | audience evidence informs social dynamics; PBR is a Product/scoring guardrail |
| GK/CM/ST high-tier fairness versus historical award bias | `PLAUSIBLE_TENSION` | fairness target is Product; historical award position bias is contextual evidence, not a mandate |
| injury incidence versus no-near-zero/no-universal-chronic guardrails | `CONSISTENT` | evidence supports nonzero incidence and heterogeneous tails; exact target rates remain observational |
| transfer mobility versus zero/multiple-club Product guardrails | `PLAUSIBLE_TENSION` | selected event data lacks at-risk denominator; evaluate in integrated careers |
| manual finalization targets versus real life | `NOT_COMPARABLE` | finalization remains Product-defined with no empirical proxy |

No frozen Product Target changes.

## 9. Consolidated blockers

### `BLOCKS_INITIAL_PARAMETERSET`

1. Candidate/tooling manifests must adopt the audited 268-template cardinality.
2. The first run must bind immutable candidate data/evidence/transform hashes.
3. F/G rows must declare provisional range/prior and `sensitivityRequired=true` before use.

These are targeted pre-calibration controls, not requests for new broad evidence acquisition.

### `BLOCKS_VALIDATION_ONLY`

- Data V1 and license freeze;
- full expected golden outputs and independent verification;
- complete scoring IJL/equivalence/record/milestone/historic catalogs;
- PRI/CC/social scoring cohorts;
- freeze-quality dynamic-source snapshots;
- integrated Monte Carlo and replay campaigns.

### `NONBLOCKING_LIMITATION`

- Argentina player/strict-position/finance depth;
- GK aging and exact CM/ST injury differences;
- private Interest/Offer/negotiation and salary/renewal observability;
- non-selected National Team denominator and private award judging;
- representative social churn and comeback cohorts.

### `P2_IMPROVEMENT`

- preferred foot, retraining, pressure-performance, richer tactical/medical/sequela evidence;
- cross-era award equivalence and regional social diffusion;
- local longitudinal loan/contract/retirement panels.

### `PRODUCT_DEFINED_NOT_DATA_BLOCKER`

- Quick/Custom tolerances, tier rarity, position fairness, comeback/finalization frequency,
  social/PBR balance, outlier policy and best-run projection.

## 10. Coupling, order and leakage

[Parameter Coupling Map](G3D_PARAMETER_COUPLING_MAP.md) defines 13 groups, including all required
CG-CREATION through CG-LIFECYCLE plus separate CG-SCORING. It closes the six named potential
loops with lag/order rules. Invalid inputs include CareerScore/PC into gameplay, MarketValue into
Performance/Selection/Awards and current-period outcome feedback.

Calibration order is upstream-first: Creation → Development/Role/Performance → Health →
Club/Market → National/Awards → Reputation/Social → Lifecycle → integrated Engine → Scoring.
Downstream compensation for an upstream miss is prohibited.

## 11. Calibration and Monte Carlo readiness

[Initial Calibration Plan](G3D_INITIAL_CALIBRATION_PLAN.md) selects empirical/MLE/hierarchical,
survival, NB2, logistic, AR, quantile and staged SMM methods by evidence family. Eight future MC
campaigns are defined: SMOKE, CENTRAL, POSITION, MODE, TAIL, LIFECYCLE, SOCIAL and SCORING.
None is executed here.

The data decision is `CALIBRATION_CAN_USE_CANDIDATE_DATA`; competitive freeze still requires
published, resolvable Data V1 and all applicable license gates.

## 12. Scoring boundary

IJL, equivalence groups, records, milestones, historic achievements and PRI/CC/social cohort
transforms remain downstream gaps. They are `BLOCKS_SCORING_VALIDATION` or `P2_SCORING_DATA`,
not reasons to invent points and not reasons to tune Engine outputs toward tiers before causal
acceptance. Scoring thresholds/formulas remain unchanged.

## 13. DR-008 after G3D-4F

| Scope | State |
|---|---|
| Mathematics | `CLOSED` |
| Product numeric targets | `CLOSED` (77 exact IDs) |
| P0 data | `READY_WITH_NONBLOCKING_LIMITATIONS` |
| P1 evidence | `ACQUIRED_WITH_LIMITATIONS` (201 records) |
| Parameter audit | `COMPLETE_WITH_268_TEMPLATE_ERRATUM` |
| EngineParameterSet | `UNPUBLISHED` |
| Parameter values | `UNASSIGNED` |
| Integrated calibration | `NOT_STARTED` |
| Golden outputs | `NOT_DERIVED` |
| Monte Carlo acceptance | `NOT_EXECUTED` |

DR-008 is not a formula decision. It remains `PARTIAL_CALIBRATION` until candidates, integrated
acceptance, goldens and publication finish.

## 14. Risk and Go/No-Go

[Calibration Risk Register](G3D_CALIBRATION_RISK_REGISTER.md) records 26 risks with detection,
mitigation, owner and gate. Highest residual risks are selected-outcome Market processes,
National Team candidate denominator, Health sequela/MedicalQuality, and comeback frequency.
Each has a provisional/sensitivity strategy; none is hidden as observed truth.

Go criteria:

- RED mathematics/schema/determinism: **0**;
- P0 parameter strategies missing: **0**;
- P0 target consumers missing: **0**;
- unresolved critical causal loops: **0**;
- parameter values assigned by G3D-4F: **0**.

Final result: **`GO_FOR_G3D_5_WITH_PRECALIBRATION_FIXES`**.

G3D-5 must not start automatically from this commit; it requires a separate task and must begin
with the three controls in section 9.
