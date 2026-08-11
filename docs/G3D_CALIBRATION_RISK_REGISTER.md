# G3D Calibration Risk Register

Status: `ACTIVE_BEFORE_G3D_5`

Probability and impact are ordinal design assessments, not measured frequencies. A risk remains
open until its detection artifact and mitigation are referenced by a candidate acceptance report.

| Risk ID | Subsystem | Description | Probability | Impact | Detection method | Mitigation | Owner role | Gate affected | Residual risk |
|---|---|---|---|---|---|---|---|---|---|
| `CR-001` | Registry | Historical prose says 275 templates while canonical tables contain 268. | HIGH | HIGH | mechanical row/path/duplicate check against G3D-1 and HEAD | accept 268 erratum before candidate schema; never synthesize seven paths | CALIBRATION_OWNER + TECHNICAL_VALIDATOR | 1 | LOW after fix |
| `CR-002` | Data | Candidate data changes while a calibration run is in progress. | MEDIUM | CRITICAL | manifest/hash mismatch | immutable dataCandidateId and source/transform hashes per run | DATA_OWNER | 1/7 | LOW |
| `CR-003` | Licensing | Reference-only/commercial sources are treated as redistributable inputs. | MEDIUM | CRITICAL | source-license manifest and repository scan | aggregate-only route, legal review or licensed alternative; block freeze | DATA_OWNER + PROVENANCE_REVIEWER | publication | MEDIUM |
| `CR-004` | Creation | Observable exposure is interpreted as hidden initial capability. | MEDIUM | HIGH | causal review and posterior predictive residuals | latent joint model; never label proxy as truth | CALIBRATION_OWNER | 2/3 | MEDIUM |
| `CR-005` | Development | Cross-sectional age curve is treated as within-player development. | HIGH | HIGH | cohort/within-player comparison and censoring audit | longitudinal likelihood, attrition sensitivity and partial pooling | CALIBRATION_OWNER | 2/5 | MEDIUM |
| `CR-006` | Role | Minutes denominators/calendar opportunities are inconsistent. | MEDIUM | HIGH | exposure conservation targets and fixture trace | bind Calendar candidate; preserve actual/team opportunity separately | DATA_OWNER + CALIBRATION_OWNER | 1/2 | LOW |
| `CR-007` | Performance | Sparse-exposure rate tails dominate count calibration. | HIGH | HIGH | exposure-band diagnostics and raw-count likelihood | count/exposure model, evidence gates, retain sparse tail separately | CALIBRATION_OWNER | 2/4 | MEDIUM |
| `CR-008` | Health | Incompatible injury definitions/rates are pooled. | HIGH | HIGH | definition/origin/denominator stratification | family/origin likelihood and sensitivity; no silent averaging | DATA_OWNER | 2/4 | MEDIUM |
| `CR-009` | Health | Sequela or MedicalQuality parameters appear identified from indirect data. | HIGH | HIGH | class F sensitivity and leave-one-source-out runs | wide regularized prior, provisional flag, P2 evidence backlog | CALIBRATION_OWNER | 3/4 | HIGH |
| `CR-010` | Club | Possession, titles or revenue are copied into Control, Prestige or FinancialPower. | MEDIUM | HIGH | proxy-to-latent mapping review | multivariate latent mapping; preserve proxy semantics and context | CALIBRATION_OWNER | 2/3 | MEDIUM |
| `CR-011` | Market | Transfer completion is used as Interest/Offer denominator. | HIGH | CRITICAL | pipeline observability audit | selected-outcome model, synthetic constraints, explicit weak identification | CALIBRATION_OWNER | 3/5 | HIGH |
| `CR-012` | Money | Fee/salary/currency/date semantics are mixed or binary float becomes source of truth. | MEDIUM | CRITICAL | exact arithmetic goldens and provenance checks | native minor units, rational/decimal transform and existing Money binding | TECHNICAL_VALIDATOR | 1/7 | LOW |
| `CR-013` | National | Selected-only data is used as full call-up denominator. | HIGH | HIGH | candidate-field denominator report | joint field/call-up calibration with proxy coverage sensitivity | CALIBRATION_OWNER | 2/3 | HIGH |
| `CR-014` | Awards | Official nominee count is equated to latent comparative field size. | MEDIUM | HIGH | definition-versus-model boundary check | field-size prior/target separate from official list; sensitivity | CALIBRATION_OWNER | 2/3 | MEDIUM |
| `CR-015` | Reputation | MarketValue/followers become SportingReputation truth. | MEDIUM | CRITICAL | feature lineage and leakage matrix | measurement model, lagged proxy use, forbidden-input tests | CALIBRATION_OWNER | 1/3 | LOW |
| `CR-016` | Social | Cross-platform audiences are summed and heavy tails/churn are distorted. | HIGH | HIGH | platform/era segmented diagnostics | per-platform state, no blind sum, preserve zero/loss/tails | CALIBRATION_OWNER | 2/4 | MEDIUM |
| `CR-017` | Lifecycle | Active/censored players are treated as retired. | HIGH | CRITICAL | survival risk-set and status audit | right censoring, ADR-079 definitions, lower-tier continuity | DATA_OWNER + CALIBRATION_OWNER | 2/5 | LOW |
| `CR-018` | Comeback | Famous comeback anecdotes determine frequency. | HIGH | HIGH | denominator/source-selection audit | Product-constrained fit, wide sensitivity, keep observed cases as route/tail evidence | PRODUCT_OWNER + CALIBRATION_OWNER | 4/5 | MEDIUM |
| `CR-019` | Finalization | Real-life proxy is invented for manual Career finalization. | MEDIUM | HIGH | sourceType check | Product-defined targets only; no auto-close | PRODUCT_OWNER | 2/5 | LOW |
| `CR-020` | Coupling | Downstream parameters compensate for an upstream causal miss. | HIGH | CRITICAL | staged same-seed regression and changed-group manifest | freeze upstream, change few groups, reopen parent candidate explicitly | CALIBRATION_OWNER | 2/3/5 | MEDIUM |
| `CR-021` | Circularity | Same-window Performance/Reputation/Award/Market feedback leaks. | MEDIUM | CRITICAL | event-order trace and forbidden dependency tests | apply coupling-map lags; fail candidate on any invalid edge | TECHNICAL_VALIDATOR | 1/3/7 | LOW |
| `CR-022` | Tails | Caps/cooldowns are introduced to force acceptance. | MEDIUM | CRITICAL | model/diff review and tail diagnostics | correct causal family/parameters/data; preserve legitimate rare events | CALIBRATION_OWNER | 4 | LOW |
| `CR-023` | Scoring | Historical prestige is used to invent scoring points or tune Engine to tiers early. | MEDIUM | CRITICAL | provenance and phase-order audit | separate scoring candidate; normative/Product sources only; G3D-5I after Engine | SCORING_OWNER | 6 | LOW |
| `CR-024` | Goldens | Expected outputs are generated only by the implementation they validate. | HIGH | CRITICAL | derivation-origin metadata | manual/rational worksheet or independent implementation and review | TECHNICAL_VALIDATOR | 7 | LOW |
| `CR-025` | Monte Carlo | Small samples approve Mythical/multiple-comeback/viral tails. | HIGH | HIGH | effective sample/interval check | DEEP tier, binomial/MC precision requirement, no point-estimate pass | CALIBRATION_OWNER | 4/5/6 | LOW |
| `CR-026` | Position fairness | Aggregate acceptance hides GK/CM/ST structural skew. | MEDIUM | CRITICAL | mandatory segmented targets and no averaging | position campaigns/hierarchical effects; fail affected segment | PRODUCT_OWNER + CALIBRATION_OWNER | 2/5/6 | LOW |

## Escalation policy

- `CRITICAL` impact plus unmitigated probability `MEDIUM/HIGH` blocks the affected gate.
- F/G parameters cannot reduce residual risk below `MEDIUM` without a sensitivity artifact.
- License risks may permit local exploratory calibration but always block competitive freeze.
- A rare but coherent sporting tail is not a risk event; only excessive frequency, invariant
  violation or causal leakage is.

## G3D-4G control overlay

| Risk | G3D-4G control | State after control |
|---|---|---|
| `CR-001` cardinality ambiguity | physical 268-row/path recount, explicit normative erratum, no synthetic paths | `CLOSED` |
| calibration input drift | immutable `CalibrationInputBundleCandidate`, RFC 8785 root hash, successor-on-change rule | `LOW`; bundle mismatch blocks run acceptance |
| F weak-family dominance | 17/17 broad priors, named scenarios and `SENSITIVITY_BLOCKS_FREEZE` | `MEDIUM` until executed; no longer a start blocker |
| G false identification | 9/9 `DEFERRED_UNTIL_SCORING_DATA`, excluded through G3D-5H | `LOW` for Engine anchors; remains Gate 6 risk |
| accidental all-parameter fit | exact 69-template G3D-5A active list | `LOW` |

No risk is mitigated by assigning a value. Residual F sensitivity remains an
acceptance/freeze obligation in the future calibration phase.
