# Monetary Reference Evidence

## 1. Artifact header

```yaml
artifactId: MONETARY_REFERENCE_EVIDENCE
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-MONEY-POLICY-DATA
state: SOURCE_ROUTES_IDENTIFIED
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  TECHNICAL_VALIDATOR: PROJECT_MAINTAINER_AS_TECHNICAL_VALIDATOR
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

No rate, index value, transfer fee or salary was copied or normalized. This
artifact identifies reproducible routes only.

## 2. Native money units

| Currency | Canonical code | Minor unit | Persisted interpretation | Evidence |
|---|---|---|---|---|
| Argentine peso | `ARS` | centavo; 100 per peso | integer minor units, `currencyCode=ARS` | `EV-P0-064` |
| euro | `EUR` | cent; 100 per euro | integer minor units, `currencyCode=EUR` | `EV-P0-065` |

The technical integer range remains a schema validation decision. It is not a
gameplay fee/salary cap.

## 3. Recommended source policy

### Native inflation

- **Argentina:** INDEC national CPI, using dated monthly index observations,
  base/methodology metadata and revision history (`EV-P0-067`). Do not bridge
  the 2007-2015 disputed/discontinued period silently; any historical join needs
  its own reviewed transform.
- **Spain/euro context:** Eurostat HICP for Spain, preserving the 2026
  ECOICOP/reference-base change and revision metadata (`EV-P0-069`).

### Exchange-rate bridge

Recommended reproducible route for a common nominal date:

```text
ARS per USD from BCRA Communication A 3500
USD per EUR from ECB euro reference rates
same reference date / defined missing-business-day policy
-> derived ARS per EUR candidate
```

Evidence: `EV-P0-066`, `EV-P0-068`.

This route is chosen for official status and reproducibility, not as a claim
that an official wholesale rate represents every Argentine market. Parallel,
informal or unlabeled rates are excluded unless a future product decision
introduces a separately named economic context.

### Purchasing-power context

World Bank ICP/PPP is a candidate methodology (`EV-P0-070`). G3D-3C must verify
Argentina/Spain coverage, observation year, interpolation policy, revisions and
license before selecting it. It is not yet the published purchasing-power
artifact.

## 4. Required observation identity

Every monetary observation/transform must declare:

```text
currencyCode
minorUnitScale
nominalAmountDate
seriesId
seriesObservationDate
publicationDate
retrievedAt
revisionVintage
sourceDatasetHash
normalizationBaseDate
missingBusinessDayPolicy
roundingMode
transformId
```

No average exchange rate is substituted for an end-of-period rate without an
explicit transform. No post-cutoff rate initializes a pre-cutoff nominal value.

## 5. Source comparison

| Route | Official/reproducible | Historical coverage | Revision behavior | Cross-country use | License status | Recommendation |
|---|---|---|---|---|---|---|
| BCRA A3500 | yes | historical series advertised | capture vintage | ARS/USD bridge | review download/reuse terms | primary FX leg |
| ECB EXR | yes | 1999-current metadata | dataset updates | EUR/USD bridge | review ECB reuse terms | primary FX leg |
| INDEC IPC national | yes | Dec 2016-current; earlier series separated | revisions/methodology available | native ARS inflation | review dataset terms | primary Argentina inflation |
| Eurostat HICP | yes | monthly/annual historical | revisions governed and 2026 base change | harmonised Spain/EU | review reuse terms | primary Spain inflation |
| World Bank ICP/PPP | methodology yes | periodic benchmarks | revisions/interpolation to verify | cross-country purchasing power | review dataset license | secondary candidate only |

## 6. G3D-3C blockers

- exact source-download terms and permitted derived publication for all series;
- versioned series IDs, cutoff-compatible vintages and file hashes;
- common base date and missing-business-day policy;
- PPP coverage/interpolation selection;
- integer representation-range validation and monetary golden inputs.

`DS-CURRENCY-INFLATION` advances only to `SOURCE_IDENTIFIED`. No monetary
dataset has been acquired, normalized, validated or frozen.

## 7. Artifact review declaration

- Evidence selection: `EV-P0-064` through `EV-P0-070`.
- Owner approvals: `DATA_OWNER`, `TECHNICAL_VALIDATOR` as declared in header.
- Limitations: source routes only; no rate/index observation, conversion or
  purchasing-power artifact was acquired.
- Unresolved material conflicts: none; Argentina exchange-rate plurality is
  handled by choosing the defined official BCRA route, not by averaging quotes.
