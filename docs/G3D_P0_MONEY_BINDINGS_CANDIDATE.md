# G3D P0 Money Bindings Candidate

## 1. Header

```yaml
artifactId: G3D_P0_MONEY_BINDINGS_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.Money.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-CURRENCY-INFLATION@candidate/RSNAP-G3D3B-2026-08-07-C1/006
policyState: VALIDATED_CANDIDATE
datasetState: SOURCE_IDENTIFIED
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

## 2. Currency definitions

| currencyId | ISO code | Major/minor semantics | Persisted representation | Evidence / state |
|---|---|---|---|---|
| `CURRENCY-ARS` | `ARS` | Argentine peso; centavo; 100 minor units per peso | `{ amountMinorUnits: integer>=0, currencyCode: ARS, nominalDate }` | `EV-P0-064`; `VALIDATED_CANDIDATE` |
| `CURRENCY-EUR` | `EUR` | euro; cent; 100 minor units per euro | `{ amountMinorUnits: integer>=0, currencyCode: EUR, nominalDate }` | `EV-P0-065`; `VALIDATED_CANDIDATE` |

Checked integer overflow is invalid-state protection, never a gameplay cap.
Native money remains native in persisted contracts; normalization is a
calibration artifact, not mutation of the nominal fact.

## 3. Source bindings

| bindingId | Purpose | `sourceId` / units | Acquisition / license | Required transform |
|---|---|---|---|---|
| `MONEY-SOURCE-INDEC-IPC-ARG` | ARS inflation | `SRC-INDEC-IPC`; dated monthly CPI index | `SOURCE_IDENTIFIED`; terms/derived redistribution review pending | vintage pin, base-date transform, revision policy |
| `MONEY-SOURCE-EUROSTAT-HICP-ESP` | Spain/EUR inflation context | `SRC-EUROSTAT-HICP`; monthly/annual HICP index | `SOURCE_IDENTIFIED`; reuse review pending | series ID, base/reference change, vintage pin |
| `MONEY-SOURCE-BCRA-A3500` | ARS/USD official FX leg | `SRC-BCRA-A3500`; dated rate | `SOURCE_IDENTIFIED`; download/reuse review pending | business-day and revision policy |
| `MONEY-SOURCE-ECB-EXR` | EUR/USD bridge leg | `SRC-ECB-EXR`; euro reference rate | `SOURCE_IDENTIFIED`; reuse review pending | pair orientation, same-date join, missing-day policy |

Evidence: `EV-P0-066..069`; source IDs are resolved in the Source License
Manifest. World Bank ICP/PPP (`EV-P0-070`) remains a secondary
`PENDING_ACQUISITION` candidate, not a selected transform binding.

## 4. Future transform boundary

The intended reproducible bridge is:

```text
dated BCRA ARS/USD observation
+ same-reference-date ECB USD/EUR observation
+ explicit pair orientation
+ defined missing-business-day rule
-> derived ARS/EUR calibration observation
-> monetary quantization only at declared output boundary
```

No observation, average rate, inflation adjustment, real EUR/ARS, PPP value or
output hash exists yet. Required fields remain `PENDING_DATA`:

```text
seriesId and downloadable artifact hash
cutoff-compatible revision vintage
normalizationBaseDate
missingBusinessDayPolicy
input/output units and exact formula
ROUND_HALF_EVEN boundary
terms/derived-publication approval
```

## 5. Status

Currency definitions and source-routing policy are `VALIDATED_CANDIDATE`.
`DS-CURRENCY-INFLATION` remains `SOURCE_IDENTIFIED`; it is not `ACQUIRED`,
`NORMALIZED`, `VALIDATED` or `FROZEN`. This artifact assigns no monetary value
and calibrates no fee or salary.
