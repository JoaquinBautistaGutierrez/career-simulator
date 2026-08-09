# G3D P0 Money Bindings Candidate

## 1. Header

```yaml
artifactId: G3D_P0_MONEY_BINDINGS_CANDIDATE
artifactVersion: g3d-3b2-candidate-2
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.Money.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-CURRENCY-INFLATION@candidate/RSNAP-G3D3B-2026-08-07-C1/006-r2
parentCandidateId: DS-CURRENCY-INFLATION@candidate/RSNAP-G3D3B-2026-08-07-C1/006
policyState: VALIDATED_CANDIDATE
sourceBindingState: VALIDATED_CANDIDATE
transformState: VALIDATED_CANDIDATE
datasetState: ACQUIRED
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

## 2. Currency definitions

| currencyId | ISO code | Major/minor semantics | Persisted representation | Evidence / state |
|---|---|---|---|---|
| `CURRENCY-ARS` | `ARS` | Argentine peso; centavo; 100 minor units per peso | `{ amountMinorUnits: integer>=0, currencyCode: ARS, nominalDate }` | `EV-P0-064`; `VALIDATED_CANDIDATE` |
| `CURRENCY-EUR` | `EUR` | euro; cent; 100 minor units per euro | `{ amountMinorUnits: integer>=0, currencyCode: EUR, nominalDate }` | `EV-P0-065`; `VALIDATED_CANDIDATE` |

Native money remains nominal and native in persisted contracts. Normalization
is a calibration artifact, not mutation of the fact. Overflow is an invalid
state, never a fee/salary cap.

## 3. Source bindings

| bindingId | Series identity / unit | Acquisition fingerprint | License/reuse | State |
|---|---|---|---|---|
| `MONEY-SOURCE-INDEC-IPC-ARG` | INDEC national total CPI; Dec-2016=100; monthly | official CSV SHA-256 `3f9ef54bf117c47d5e2967b6b2129644fa028a6abd66463b043183f6ddef563c` | derived reuse with attribution; no raw commit | `VALIDATED_CANDIDATE` |
| `MONEY-SOURCE-EUROSTAT-HICP-ESP` | `prc_hicp_minr/ES/TOTAL/I25`; 2025=100; monthly | filtered JSON-stat SHA-256 `d2cf56765523d1de3790eaf6b2415605ab7780ca35544d3e3e05677471d516b8` | reuse with attribution/change disclosure; no raw commit | `VALIDATED_CANDIDATE` |
| `MONEY-SOURCE-BCRA-A3500` | BCRA API series `5`; ARS per USD; daily business day | filtered API SHA-256 `8e2b903ef1062fba328bb0a2dc11768f8431bcdc2f09f542f6266b7c1b19a1e5` | public-information derived reuse; no raw bulk mirror | `VALIDATED_CANDIDATE` |
| `MONEY-SOURCE-ECB-EXR` | `EXR.D.USD.EUR.SP00.A`; USD per EUR; daily TARGET day | CSV SHA-256 `d4794b1d62168f5c2c7712d98da864bd83fb81f40cfdfe664e6961597f0e056d` | reuse with attribution/change disclosure; no raw commit | `VALIDATED_CANDIDATE` |

Evidence: `EV-P0-093..101`. World Bank ICP/PPP remains a secondary diagnostic
candidate, not a selected conversion.

## 4. Exact transform binding

```yaml
transformId: TR-MONEY-NORMALIZE-V1
normalizationBasePricePeriod: 2026-06
requestedFxReferenceDate: 2026-08-07
targetCalibrationCurrency: EUR
sourceNumberRepresentation: EXACT_DECIMAL_RATIONAL
roundingMode: ROUND_HALF_EVEN
missingMonthlyIndexPolicy: ERROR
missingFxDatePolicy: PREVIOUS_COMMON_PUBLISHED_OBSERVATION
interpolation: FORBIDDEN
```

For nominal minor units `A_C(d)`:

```text
realNativeMinor_C = A_C(d) * I_C(2026-06) / I_C(month(d))

rARSEUR(f*) = rARSUSD_BCRA(f*) * rUSDEUR_ECB(f*)
realEURMinor = realARSMinor / rARSEUR(f*)
realARSMinor = realEURMinor * rARSEUR(f*)

f* = greatest date <= 2026-08-07 with both official FX observations
```

Inflation adjustment occurs before cross-currency conversion. Every decimal is
parsed as integer over `10^scale`; checked arbitrary-precision rationals carry
the intermediate value. Quantization occurs once, at target minor units, using
`ROUND_HALF_EVEN`. Missing monthly data or absence of a joint previous FX date
is an error. No next observation and no interpolation are allowed.

## 5. Reproducibility and revision

Every future transform input records series ID, requested period, retrieval
timestamp, provider update/vintage, byte length, SHA-256 and this transform
version. A provider revision creates new candidate lineage. BCRA methodology
A8359 applies to cutoff observations; prior observations retain their applicable
method. INDEC pre-Dec-2016 joins and Eurostat classification/base transitions
require separate continuity validation before use.

## 6. Status

Currency definitions, four bindings and `TR-MONEY-NORMALIZE-V1` are
`VALIDATED_CANDIDATE`. `DS-CURRENCY-INFLATION` is `ACQUIRED`, because permitted
official extracts were retrieved/fingerprinted outside the repository. It is
not `NORMALIZED`, `VALIDATED` or `FROZEN`; no normalized series artifact is
published. No monetary gameplay value or coefficient is assigned.
