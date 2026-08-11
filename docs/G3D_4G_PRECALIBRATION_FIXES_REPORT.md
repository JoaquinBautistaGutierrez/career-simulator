# G3D-4G Precalibration Fixes Report

Phase: `G3D-4G — Precalibration Integrity, Lineage & Prior Bounds Closure`
Result: `GO_FOR_G3D_5A_OBSERVABLE_ANCHORS`
Reference cutoff: `2026-08-07T23:59:59.999Z`
Source snapshot: `RSNAP-G3D3B-2026-08-07-C1`
Data state: `DATA_V1_NOT_PUBLISHED`

## 1. Closure outcome

The three blockers reported by G3D-4F are closed without assigning a parameter
value, fitting a model, changing mathematics or publishing data:

1. the canonical registry contains exactly **268** unique templates;
2. future runs bind an immutable `CalibrationInputBundleCandidate` and root
   SHA-256;
3. all 17 F and 9 G templates have explicit range/prior/deferral and
   sensitivity policies.

All six gates in [Precalibration Gate Checklist](G3D_PRECALIBRATION_GATE_CHECKLIST.md)
are `PASS`. G3D-5A may start only under a separate authorization.

## 2. Cardinality audit and erratum

The authoritative rows in sections 6–7 of
[Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md) were
recounted independently of the G3D-4F prose.

| Check | Result |
|---|---:|
| physical registry rows | 268 |
| unique row IDs | 268 |
| unique normative paths | 268 |
| aliases counted as parameters | 0 |
| duplicate templates | 0 |
| missing matrix rows | 0 |
| extra matrix rows | 0 |
| orphan parameters | 0 |

The identifiability partition is
`20+22+146+2+48+17+9+4=268`; the priority partition is
`203+30+31+4=268`. Both cover the same registry universe.

The repository audit found 33 textual references to `275` across 15 Markdown
files before G3D-4G. They were classified as:

- current normative: Parameter Registry context, Mathematical Engine Spec and
  current Implementation Plan/DR summaries — corrected or superseded by an
  explicit current statement;
- historical reports: preserved and annotated with a cardinality erratum;
- correction/audit references: retained because they describe the error.

The historical count was a documentation/cardinality mistake. The original
registry already contained 268 identities; **there are no seven missing
normative paths**, and G3D-4G creates none.

## 3. Immutable input lineage

Normative artifact:
[G3D Calibration Input Lineage Manifest](G3D_CALIBRATION_INPUT_LINEAGE_MANIFEST.md).

| Field | Value |
|---|---|
| bundle candidate | `CIB-G3D4G-RSNAP-20260807-C1` |
| schema | `CalibrationInputBundle.v1` |
| state | `VALIDATED_CANDIDATE` |
| root hash | `1b647111f0dac846752f0495ab5ee5d00512e8bae5773e7bc11be4633404f25c` |
| canonical structured serialization | RFC 8785 |
| document normalization | `CanonicalDocumentUtf8LfV1` |
| cryptographic hash | SHA-256 |
| base commit | `4bf71f3f19dc46a8ab67a3e778f657338d4dd29a` |

The bundle individually binds P0 plus the five P1 observational manifests,
the registries, Product Targets, mathematical contracts, evidence/source
indexes and relevant transforms. Reference-only dynamic pages are not copied
into the repository: permitted EvidenceRecords, derived summaries, retrieval
metadata and transform contracts are the immutable unit. Hash identity proves
lineage, not redistribution rights.

Any input change creates a successor bundle ID and root hash. A future
ParameterSet must store both; identical coefficient values under different
bundles do not have identical calibration lineage.

## 4. Weak and deferred policies

Normative artifact:
[Weak Parameter Prior and Sensitivity Contract](G3D_WEAK_PARAMETER_PRIOR_AND_SENSITIVITY_CONTRACT.md).

| Class | Templates | Policy | Initial Engine fit |
|---|---:|---|---|
| F weakly identified | 17 | broad transparent domain-specific weak priors; LOW/REFERENCE/HIGH; freeze blocked by material sensitivity | inactive in G3D-5A; later staged activation only |
| G unidentifiable V1 | 9 | `DEFERRED_UNTIL_SCORING_DATA`; normative domain only; no fake numeric prior | excluded from G3D-5A..5H |

Prior profiles cover signed coefficients, intercepts, non-negative magnitudes,
positive scales/time, probabilities, positive/signed persistence and bounded
affinities. All 26 templates have named sensitivity scenarios; `REFERENCE` is
a prior median/structural case, never a calibrated value.

High-impact weak families are Health relapse/sequela burden, transfer
Interest/Offer/contract/negotiation, comparative Award history, social
sentiment and lifecycle motivation/hazards/viability. Plausible changes that
materially move a P0 Acceptance Target trigger `SENSITIVITY_BLOCKS_FREEZE`.

## 5. Exact G3D-5A scope

[G3D Initial Calibration Plan](G3D_INITIAL_CALIBRATION_PLAN.md) now contains the
normative 69-row `G3D-5A_ACTIVE_PARAMETER_TEMPLATES` list:

| Component | Active templates |
|---|---:|
| class A Engine anchors | 20 |
| class B Engine observational bindings | 16 |
| class E Engine structural identities/validators | 33 |
| **Total** | **69** |

Inactive/deferred for G3D-5A: 146 C, 2 D, 17 F, 4 H and 30 Scoring-owned
B/E/G templates. This does not remove them from the 268-template registry.
Scoring G rows activate only in G3D-5I.

## 6. Registry and decision integrity

| Artifact/universe | Result |
|---|---|
| parameter templates | 268; 0 assigned values |
| calibration targets | 186; values/tolerances unchanged |
| exact Product Targets | 77; unchanged |
| datasets | 40; lifecycle unchanged; bundle lineage added |
| goldens | 139; all remain `SPECIFIED`; expected outputs unchanged |
| EngineParameterSet | `UNPUBLISHED` |
| ScoringConfiguration | not populated/published |
| Data V1 | `DATA_V1_NOT_PUBLISHED` |
| Monte Carlo | not executed |

DR-008 now records mathematics and Product Targets closed, P0 ready with
non-blocking limitations, P1 acquired with limitations, cardinality
`268_CANONICAL`, identifiability audited, input lineage `BOUND_CANDIDATE`, F/G
policy defined, values unassigned, EngineParameterSet unpublished, initial
calibration ready, goldens pending and Monte Carlo not executed.

## 7. Remaining non-blocking limitations

G3D-4G does not eliminate the observational limitations catalogued by G3D-4F:
Argentina/Spain longitudinal coverage, selected/private market fields, weak
social/lifecycle constructs, source-license limits and scoring cohort/catalog
gaps remain. They are routed to later joint/sensitivity or scoring phases and
do not make the first observable/structural Engine anchors ambiguous.

There is no remaining blocker from the three G3D-4F precalibration fixes.

## 8. Gate result

| Gate | Result |
|---|---|
| PC-1 Registry Integrity | `PASS` |
| PC-2 Lineage Integrity | `PASS` |
| PC-3 Weak Parameter Safety | `PASS` |
| PC-4 Unidentifiable Policy | `PASS` |
| PC-5 No Values | `PASS` |
| PC-6 Calibration Scope | `PASS` |

Final result: **`GO_FOR_G3D_5A_OBSERVABLE_ANCHORS`**.

No G3D-5A estimation is performed by this report.
