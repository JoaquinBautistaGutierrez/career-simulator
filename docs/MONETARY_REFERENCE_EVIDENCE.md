# Monetary Reference Evidence

## 1. Artifact header

```yaml
artifactId: MONETARY_REFERENCE_EVIDENCE
artifactVersion: g3d-3b2-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-MONEY-POLICY-DATA
state: SOURCE_SERIES_ACQUIRED_TRANSFORM_VALIDATED_CANDIDATE
datasetState: ACQUIRED
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  TECHNICAL_VALIDATOR: PROJECT_MAINTAINER_AS_TECHNICAL_VALIDATOR
rawExternalArtifactsCommitted: false
artifactHashStatus: CANDIDATE_HASHED
candidateArtifactHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

This artifact records official series identities, cutoff-compatible retrieval
fingerprints, reuse policy and an exact normalization transform. It assigns no
fee, salary, coefficient or gameplay value.

## 2. Native money units

| Currency | Canonical code | Minor unit | Persisted interpretation | Evidence |
|---|---|---|---|---|
| Argentine peso | `ARS` | centavo; 100 per peso | integer minor units, `currencyCode=ARS`, nominal date | `EV-P0-064` |
| euro | `EUR` | cent; 100 per euro | integer minor units, `currencyCode=EUR`, nominal date | `EV-P0-065` |

Checked integer overflow is invalid-state protection, never a gameplay cap.

## 3. Acquired official source bindings

| Binding | Exact series / semantics | Frequency and date semantics | Acquired fingerprint | Evidence / state |
|---|---|---|---|---|
| `MONEY-SOURCE-INDEC-IPC-ARG` | INDEC national total CPI; index base Dec 2016=100 | monthly; observation is calendar month; publication/revision metadata retained | official `serie_ipc_aperturas.csv`, 2,440,299 bytes, SHA-256 `3f9ef54bf117c47d5e2967b6b2129644fa028a6abd66463b043183f6ddef563c`; cutoff-compatible through 2026-06 | `EV-P0-093`, `EV-P0-094`; `ACQUIRED` |
| `MONEY-SOURCE-EUROSTAT-HICP-ESP` | `prc_hicp_minr`, `geo=ES`, `coicop18=TOTAL`, `unit=I25` (2025=100), ECOICOP v2 | monthly; revision-capable; selected API extract 2025-01..2026-06 | JSON-stat extract, 5,176 bytes, SHA-256 `d2cf56765523d1de3790eaf6b2415605ab7780ca35544d3e3e05677471d516b8` | `EV-P0-095`, `EV-P0-096`; `ACQUIRED` |
| `MONEY-SOURCE-BCRA-A3500` | BCRA monetary series ID `5`, reference wholesale exchange rate; `ARS per USD` | daily business-day observation; API coverage begins 2002-03-04; current methodology A8359 applies from 2026-01-02 | filtered official API extract 2025-01-01..2026-08-07, 18,598 bytes, SHA-256 `8e2b903ef1062fba328bb0a2dc11768f8431bcdc2f09f542f6266b7c1b19a1e5` | `EV-P0-097`..`EV-P0-099`; `ACQUIRED` |
| `MONEY-SOURCE-ECB-EXR` | `EXR.D.USD.EUR.SP00.A`; USD per EUR, spot, average | daily TARGET working days; reference observation published around 16:00 CET from the reference procedure | CSV extract 2025-01-01..2026-08-07, 85,146 bytes, SHA-256 `d4794b1d62168f5c2c7712d98da864bd83fb81f40cfdfe664e6961597f0e056d` | `EV-P0-100`, `EV-P0-101`; `ACQUIRED` |

The bytes were acquired into a temporary research workspace and were not added
to the repository. The source routes, query periods and hashes are sufficient
to detect a later source-vintage change. A future normalized series artifact
must have its own retained bytes/hash or permitted deterministic retrieval.

## 4. Exact transform `TR-MONEY-NORMALIZE-V1`

### 4.1 Identities

```text
normalizationBasePricePeriod = 2026-06
requestedFxReferenceDate = 2026-08-07
targetCalibrationCurrency = EUR
roundingMode = ROUND_HALF_EVEN
numericSourceOfTruth = exact decimal parsed as rational integer / 10^scale
```

June 2026 is the latest common closed monthly price period available from both
selected inflation series before the cutoff. The FX date is the cutoff's last
jointly available official observation date. These identities belong to this
candidate transform; changing them creates new candidate lineage.

### 4.2 Inflation within native currency

For nominal minor units `A_C(d)` in currency `C`, and exact monthly index
`I_C(m)`:

```text
realNativeMinor_C(basePeriod)
  = A_C(d) * I_C(basePeriod) / I_C(month(d))
```

- ARS uses `MONEY-SOURCE-INDEC-IPC-ARG`; Spain/EUR uses
  `MONEY-SOURCE-EUROSTAT-HICP-ESP`.
- The nominal date maps to its exact calendar month. There is no interpolation.
- Missing month, non-positive index or incompatible methodology segment is an
  explicit transform error; it is never silently bridged.
- No rounding occurs at this stage. The result remains an exact rational.

### 4.3 Cross-currency bridge

At the canonical common FX date `f*`:

```text
rARSUSD(f*) = ARS per USD from BCRA
rUSDEUR(f*) = USD per EUR from ECB
rARSEUR(f*) = rARSUSD(f*) * rUSDEUR(f*)

realEURMinor = realARSMinor / rARSEUR(f*)
realARSMinor = realEURMinor * rARSEUR(f*)
```

ARS and EUR both use 100 minor units per major unit, so the scale cancels. If a
future pair has different minor scales, the transform includes their explicit
ratio. Inflation adjustment precedes the FX bridge. This yields a reproducible
calibration comparison, not a historical transaction or purchasing-power-parity
claim.

### 4.4 Missing dates and quantization

```text
f* = greatest date <= requestedFxReferenceDate
     for which both BCRA and ECB publish an observation
```

No next-observation substitution and no interpolation are allowed. Absence of a
joint prior observation is an error. Source decimals are parsed exactly,
products/quotients use checked arbitrary-precision integer rationals, and the
only monetary rounding is `ROUND_HALF_EVEN` when producing target minor units.
An unrepresentable target integer is an invalid calibration artifact, not a
gameplay cap.

## 5. Revision and reproducibility policy

- Every acquisition records series ID, query period, retrieval date, byte count,
  SHA-256, publication/update metadata and transform version.
- A provider revision creates a new source-vintage fingerprint and candidate;
  it never silently replaces the observations above.
- INDEC methodology gaps before the national Dec-2016 base remain outside this
  transform unless a separately reviewed bridge is published.
- Eurostat base/classification changes remain metadata and require a compatible
  continuous-series validation before extending the period.
- BCRA A8359 is the current methodology for cutoff observations; older dates
  preserve their applicable published methodology.
- ECB rates are reference rates for information purposes, not transaction rates.

## 6. Reuse and storage

| Provider | Access / reuse result | Repository policy |
|---|---|---|
| INDEC | official downloadable statistics; reproduction/reuse with source attribution | `REDISTRIBUTABLE_DERIVED`; raw not committed by default |
| Eurostat | statistical data/metadata reusable with attribution; modifications disclosed | `REDISTRIBUTABLE_DERIVED`; raw not committed by default |
| BCRA | official API/public-information reuse route permits reuse/redistribution with source context | `REDISTRIBUTABLE_DERIVED`; raw bulk redistribution not exercised |
| ECB | statistical data reusable with source attribution and modification disclosure | `REDISTRIBUTABLE_DERIVED`; raw not committed by default |

No `LICENSE_REVIEW_REQUIRED` remains for retaining the atomic bindings,
fingerprints and derived transform contract. Publication of any substantial raw
mirror still requires a separate review and consumer justification.

## 7. PPP boundary

World Bank ICP/PPP remains a secondary calibration diagnostic. It is not the
canonical Money conversion, is not part of `TR-MONEY-NORMALIZE-V1`, and no PPP
observation was acquired in this focused phase.

## 8. Status and limitations

`DS-CURRENCY-INFLATION` advances to `ACQUIRED`: permitted source observations
were retrieved and fingerprinted, but no repository series artifact is
`NORMALIZED`, `VALIDATED` or `FROZEN`. The source-binding and transform subset is
`VALIDATED_CANDIDATE`. Extending historical coverage and producing a normalized
series file belongs to later data preparation, not P0 gap research.

## 9. Artifact review declaration

- Evidence selection: `EV-P0-064` through `EV-P0-070` plus
  `EV-P0-093` through `EV-P0-101`.
- Owner approvals: `DATA_OWNER`, `TECHNICAL_VALIDATOR` as declared in header.
- Raw external artifacts committed: none.
- Unresolved material conflicts: none. Parallel informal Argentine exchange
  rates remain deliberately excluded by the approved source policy.
