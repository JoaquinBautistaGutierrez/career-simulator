# G3D-4G Precalibration Gate Checklist

Checklist ID: `G3D4G-PC-GATES-C1`
State: `PASS`
Scope: readiness for `G3D-5A — Observable Anchor Estimation & Candidate Population`
Reference cutoff: `2026-08-07T23:59:59.999Z`

This checklist exists because the six controls are cross-document release gates
and must be reviewable without inferring them from a closure narrative. It is
not an `EngineParameterSet`, a calibration run or a data publication.

## PC-1 — Registry Integrity

| Check | Evidence | Result |
|---|---|---|
| canonical templates | mechanical recount of sections 6–7 of [Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md) | `268` |
| unique row IDs | same recount | `268` |
| unique normative paths | same recount; aliases excluded | `268` |
| duplicate paths | same recount | `0` |
| orphan paths | [Identifiability Matrix](G3D_PARAMETER_IDENTIFIABILITY_MATRIX.md) registry set equality | `0` |
| identifiability partition | `20+22+146+2+48+17+9+4` | `268` |
| priority partition | `203+30+31+4` | `268` |

Status: **`PASS`**. The historical 275 count was a prose/cardinality error; no
seven normative paths are missing and none were synthesized.

## PC-2 — Lineage Integrity

| Check | Evidence | Result |
|---|---|---|
| bundle candidate | [Calibration Input Lineage Manifest](G3D_CALIBRATION_INPUT_LINEAGE_MANIFEST.md) | `VALIDATED_CANDIDATE` |
| P0 binding | `G3D3B2-P0-CANDIDATE-HASH-MANIFEST-C2` | bound |
| P1 domain bindings | G3D-4A, 4B, 4C, 4D and 4E observational manifests | 5/5 bound |
| registry/spec bindings | SHA-256 inventory in bundle | bound |
| transform identities | normalized transform inventory in bundle | versioned/bound |
| root identity | RFC 8785 canonical payload and SHA-256 | reproducible |
| restricted raw content | governance review and Git diff | none introduced |

Status: **`PASS`**.

## PC-3 — Weak Parameter Safety

| Check | Result |
|---|---:|
| F templates in matrix | 17 |
| F templates with admissible range/domain | 17/17 |
| F templates with provisional prior | 17/17 |
| F templates with LOW/REFERENCE/HIGH IDs | 17/17 |
| F templates with freeze blocker | 17/17 |

Normative source: [Weak Parameter Prior and Sensitivity Contract](G3D_WEAK_PARAMETER_PRIOR_AND_SENSITIVITY_CONTRACT.md).

Status: **`PASS`**.

## PC-4 — Unidentifiable Policy

| Check | Result |
|---|---:|
| G templates in matrix | 9 |
| explicit `DEFERRED_UNTIL_SCORING_DATA` policy | 9/9 |
| `EXCLUDED_FROM_INITIAL_ENGINE_FIT` | 9/9 |
| activation condition | 9/9 |
| sensitivity before scoring validation | 9/9 |

Status: **`PASS`**. Scoring data gaps block G3D-5I/Gate 6, not Engine anchors.

## PC-5 — No Values

| Check | Result |
|---|---:|
| `assignedParameterValues` | 0 |
| value-bearing `EngineParameterSetCandidate` | none |
| published `EngineParameterSet` | none |
| published Data V1 | no (`DATA_V1_NOT_PUBLISHED`) |
| computed calibration-dependent golden outputs | 0 |

Status: **`PASS`**.

## PC-6 — Calibration Scope

The normative list in [G3D Initial Calibration Plan](G3D_INITIAL_CALIBRATION_PLAN.md)
contains exactly 69 active Engine anchor templates:

- 20 class A direct-estimation candidates;
- 16 Engine-owned class B observational bindings/derivations;
- 33 Engine-owned class E structural identities/validators.

Excluded from G3D-5A are all 146 C, 2 D, 17 F, 4 H and all 30
Scoring-owned B/E/G templates. An excluded template remains canonical; it is
not deleted or assigned a placeholder.

Status: **`PASS`**.

## Gate conclusion

| Gate | Status |
|---|---|
| `PC-1` Registry Integrity | `PASS` |
| `PC-2` Lineage Integrity | `PASS` |
| `PC-3` Weak Parameter Safety | `PASS` |
| `PC-4` Unidentifiable Policy | `PASS` |
| `PC-5` No Values | `PASS` |
| `PC-6` Calibration Scope | `PASS` |

Result: **`PRECALIBRATION_FIXES_CLOSED`**. This authorizes a separately
requested G3D-5A task; it does not start estimation.
