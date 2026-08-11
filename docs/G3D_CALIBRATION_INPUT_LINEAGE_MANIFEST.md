# G3D Calibration Input Lineage Manifest

`calibrationInputBundleId`: `CIB-G3D4G-RSNAP-20260807-C1`
`schemaVersion`: `CalibrationInputBundle.v1`
`state`: `VALIDATED_CANDIDATE`
`referenceCutoffDate`: `2026-08-07T23:59:59.999Z`
`referenceSnapshotId`: `RSNAP-G3D3B-2026-08-07-C1`
`createdFromCommit`: `4bf71f3f19dc46a8ab67a3e778f657338d4dd29a`
`canonicalHashAlgorithm`: `SHA-256`
`canonicalization`: `RFC8785+CanonicalDocumentUtf8LfV1`
`bundleRootHash`: `1b647111f0dac846752f0495ab5ee5d00512e8bae5773e7bc11be4633404f25c`

## 1. Purpose and boundary

This manifest identifies the exact documentary/data/evidence inputs available
to a future calibration. It contains no parameter values and is not an
`EngineParameterSet`, `ScoringConfiguration`, `ScoringCalibrationData` or
published `dataVersion`.

`CanonicalDocumentUtf8LfV1` means Unicode NFC, LF and UTF-8 without BOM. The
structured root payload uses RFC 8785 with object keys lexicographically
ordered and arrays ordered by stable `inputId`. The manifest is not
self-hashed; its displayed canonical payload excludes `bundleRootHash`, so the
root is reproducible without recursion or ambiguous concatenation.

## 2. Registries, targets and mathematical contracts

| Bundle field / input | Canonical bytes | SHA-256 |
|---|---:|---|
| `parameterRegistryHash` — `CALIBRATION_PARAMETER_REGISTRY.md` | 124981 | `ca3d65d465eb3c7b59c66d96d681e7d6b66fc12ea6b39d12039cd079bc9974d9` |
| `targetRegistryHash` — `CALIBRATION_TARGET_REGISTRY.md` | 69713 | `c390b8e9b7df0dcab29ae3f4ff09d0eef91be89869b50268240492aa90c6fbd0` |
| `productTargetArtifactHash` — `G3D_PRODUCT_CALIBRATION_TARGETS.md` | 27357 | `19c8d47643dc1111e43333a5eba497ee9438cea8c7de4ee7854186c921ce63de` |
| `datasetRegistryHash` — `CALIBRATION_DATASET_REGISTRY.md` | 61682 | `62851801bd65682f0a18e0d4715f4dceb345b814b496f84e50aa3eee6a2e3ceb` |
| `goldenRegistryHash` — `GOLDEN_VECTOR_REGISTRY.md` | 52663 | `779379e5d75d4d272eeae0fa1d15d150b84af9395c1bb76675da93419421f84d` |
| `mathematicalContractHash` — `MATHEMATICAL_CALIBRATION_CONTRACT.md` | 70505 | `7a3a941ed5ecb376e34a76298746e005eb1ce4c5bb85d2b3ce9d120bfc1c86d7` |
| `engineMathSpecHash` — `MATHEMATICAL_ENGINE_SPEC.md` | 115286 | `08257e12f59d8c4a59b6df4e0f9cb2bb0b7c71f89058aa6055173d46a0753043` |
| `scoringMathSpecHash` — `SCORING_MATH_SPEC.md` | 44994 | `2dee11f174e277835e5cc4067fbc418a610024b55585b490dcefcb808ddee4da` |

Control artifacts included in the root:

| Input ID | Artifact | SHA-256 |
|---|---|---|
| `G3D_INITIAL_CALIBRATION_PLAN` | `G3D_INITIAL_CALIBRATION_PLAN.md` | `73e8412e076acd40526d324b66f40af9a59b3930dfe233c1bb2b5e9272b9ddbc` |
| `G3D_PARAMETER_COUPLING_MAP` | `G3D_PARAMETER_COUPLING_MAP.md` | `72327fb0a5bd182c27df53bb9643eac9187342923b110e65764e34e23337b9d0` |
| `G3D_PARAMETER_IDENTIFIABILITY_MATRIX` | `G3D_PARAMETER_IDENTIFIABILITY_MATRIX.md` | `dd1ed58f6cc9af746b13b97977e4290952259b14b9f42fb1bcab3e09df69b168` |
| `G3D_WEAK_PARAMETER_PRIOR_AND_SENSITIVITY_CONTRACT` | `G3D_WEAK_PARAMETER_PRIOR_AND_SENSITIVITY_CONTRACT.md` | `6f5c33e17da557989790f1c262c37510415bc5a462b98286347154ef23419226` |

## 3. P0 candidate lineage

| Field | Binding |
|---|---|
| candidate data manifest | `G3D3B2-P0-CANDIDATE-HASH-MANIFEST-C2` |
| candidate bundle | `G3D3B2-P0-CATALOG-CANDIDATE-C2` |
| parent bundle | `G3D3C-P0-CATALOG-CANDIDATE-C1` |
| candidate Data ref | `DATA-V1-CANDIDATE-NOT-PUBLISHED` |
| manifest canonical bytes | 2918 |
| `candidateDataManifestHash` | `e0ac43981075ac80f1cfcc3e0a88147014e9561b6dfc5ae8d3e3ea8337eaae0d` |

The manifest resolves the nine P0 candidate artifact hashes, including the
Money source/transform candidate. G3D-4G does not promote or freeze them.

## 4. P1 observational lineage

Each domain is bound individually; “P1 evidence” is not an acceptable vague
input reference.

| Domain / transform identity | Observational manifest | Canonical bytes | SHA-256 |
|---|---|---:|---|
| G3D-4A Player — `G3D4A-OBS-V1` | `G3D_P1_PLAYER_OBSERVATIONAL_HASH_MANIFEST.md` | 2696 | `0c2a650bc0445b8d27824d38a127d572322d56994e843320df288053090a6609` |
| G3D-4B Health — `G3D4B-HEALTH-DOC-V1` | `G3D_P1_HEALTH_OBSERVATIONAL_HASH_MANIFEST.md` | 1796 | `85dbf448d11ce3766cf21e60d164d1ab892148bca4da760e4fdb1f1e98dbad29` |
| G3D-4C Club/Market — `G3D4C-CLUB-MARKET-DOC-V1` | `G3D_P1_CLUB_MARKET_OBSERVATIONAL_HASH_MANIFEST.md` | 1991 | `ab81bb9559ce222a8a5413c005cc2344898362045877d37c419fb50d3916097a` |
| G3D-4D National/Awards — `G3D4D-NATIONAL-AWARDS-DOC-V1` | `G3D_P1_NATIONAL_AWARDS_OBSERVATIONAL_HASH_MANIFEST.md` | 1769 | `d0854b34eeba04ae908c45fdf7693ba882c686c721447e1bb585a6236ad329d9` |
| G3D-4E Reputation/Retirement — `G3D4E-REPUTATION-RETIREMENT-DOC-V1` | `G3D_P1_REPUTATION_RETIREMENT_OBSERVATIONAL_HASH_MANIFEST.md` | 1788 | `e2db56847c92d703a602bac4b078f422f4f7a464a79fdf9950012a7e5789d2e2` |

The Player manifest also binds provider/archive hashes that cannot be
recomputed from repository raw content because that content is restricted or
not committed. Reproduction requires authorized retrieval under its source
manifest; the immutable repository unit is the permitted summary/evidence
artifact and recorded source hash.

## 5. Evidence-record universe

| Input ID | Index | Canonical bytes | SHA-256 |
|---|---|---:|---|
| `G3D_P0_EVIDENCE_INDEX` | `P0_EVIDENCE_INDEX.md` | 35731 | `8c10e24d3cd1f77ce71e9a4dd387bdb20ba60d5f7cbcc69441c2e4757438ac5b` |
| `G3D_P1_CLUB_MARKET_EVIDENCE_INDEX` | `G3D_P1_CLUB_MARKET_EVIDENCE_INDEX.md` | 14736 | `90a9891822171a3b9eb7c41737f76f7269694057d8d40a3a710558d54ba8e266` |
| `G3D_P1_HEALTH_EVIDENCE_INDEX` | `G3D_P1_HEALTH_EVIDENCE_INDEX.md` | 15293 | `0311947c0afe434ff750968cffbfff1681e3708fb5dad74125a808e0af52d9e2` |
| `G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX` | `G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX.md` | 14059 | `077eff55843575211885b014cf69fca2dbe1b0e9f9e9e5277ad374f871a09ef8` |
| `G3D_P1_PLAYER_EVIDENCE_INDEX` | `G3D_P1_PLAYER_EVIDENCE_INDEX.md` | 12084 | `fc8b3fc3f6f76e77b7aaa93e4450cde2962ba8f2b2a0d6e78ebfa818d6f4b97e` |
| `G3D_P1_REPUTATION_RETIREMENT_EVIDENCE_INDEX` | `G3D_P1_REPUTATION_RETIREMENT_EVIDENCE_INDEX.md` | 17940 | `9cac7ded17b052f06a87732bbb809695e0ada4425909a8cb894ccdea07a58ee2` |

These indexes resolve the 81 P0 EvidenceRecords and 201 P1 EvidenceRecords by
ID, atomic claim, source, period, unit, licensing and consumer. The bundle does
not renumber or mutate them.

## 6. Source and license manifests

| Input ID | Manifest | SHA-256 |
|---|---|---|
| `G3D_P0_SOURCE_LICENSE_MANIFEST` | `SOURCE_LICENSE_MANIFEST.md` | `30f6da6acd959d91f993d19434d532bb4bd82d2f2722abe00418b715e58787cd` |
| `G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST` | `G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST.md` | `4d7012a94568ad07e2e0d471ae17346b09b17a2d8d3c3bfad91ac36138b1dca2` |
| `G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST` | `G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST.md` | `fddea8ae4f2fa454d4b57e12bb23836764440ab9419cd37ef87ab1982c5aa3f3` |
| `G3D_P1_NATIONAL_AWARDS_SOURCE_LICENSE_MANIFEST` | `G3D_P1_NATIONAL_AWARDS_SOURCE_LICENSE_MANIFEST.md` | `06b478488b6ba5ceac2f1ac4e7d7aa7b88e7ea0d854c44c982f06cceeee86cca` |
| `G3D_P1_PLAYER_SOURCE_LICENSE_MANIFEST` | `G3D_P1_PLAYER_SOURCE_LICENSE_MANIFEST.md` | `fff31febf34d43b860a60700131c61c62e967d8c9dd8a3577b8d8e9148fe1fe3` |
| `G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST` | `G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST.md` | `85ba16be3b1cf896c8ee04388890426a1f1f2ed60e955f1a342a42a4f10b6310` |

Hash binding does not change usage class or grant redistribution. A source
marked `DYNAMIC_REFERENCE_ONLY`, `REFERENCE_ONLY` or license-limited remains
so. The immutable calibration input is the allowed EvidenceRecord, aggregate,
retrieval metadata and transform—not the prohibited raw payload.

## 7. Transform identity and audit

| Transform ID / version | Input → output schema | Deterministic rule, rounding and missing policy | Hash-bound artifact | Consumers |
|---|---|---|---|---|
| `G3D-P0-NORMALIZATION-V1` | EvidenceRecords/catalog claims → typed P0 candidate definitions | canonical IDs/order; exact enum/unit mapping; absent causal fields stay missing/limited, never defaulted; no floating-point gameplay value | `G3D_P0_NORMALIZATION_SPEC.md` — `b45b76366abbcd5e3a207debb89e9590310951de747880f1dfcab31fb195833a` | P0 definitions, calendars, clubs, NT, awards, scoring subset |
| `TR-POSITION-MAP-V1` within `G3D4A-OBS-V1` | source position labels → GK/CM/ST plus mapping quality | exact approved adapters; ambiguous records flagged/excluded from strict segment; no rounding | G3D-4A manifest hash | Creation, Role, Performance and downstream segments |
| `TR-MINUTES-EXPOSURE-V1` within `G3D4A-OBS-V1` | counts/minutes/team opportunity → exposure shares/bands | preserve numerator/denominator; rational operation before declared summary rounding; missing denominator cannot produce a rate | G3D-4A manifest hash | Role/Minutes, Health exposure, production rates |
| `TR-RATE-SUMMARY-V1` within `G3D4A-OBS-V1` | counts + exposure → per-90/distribution summaries | deterministic grouping/filtering; sparse exposure retained and labelled; documented summary precision only | G3D-4A manifest hash | Performance anchors and tails |
| `TR-INJURY-TAXONOMY-V1` within `G3D4B-HEALTH-DOC-V1` | reported injury labels → six V1 families or UNKNOWN | EXACT/FAMILY/AMBIGUOUS/UNMAPPED mapping; no inferred diagnosis; published precision retained | G3D-4B manifest hash | Health incidence/recovery/relapse targets |
| `G3D4C-CLUB-MARKET-DOC-V1` | public club/manager/market facts → contextual permitted summaries | currency/date/denominator preserved; undisclosed fee is not zero; no MarketValue→Performance transform | G3D-4C manifest hash | Club/World/Market candidates |
| `TR-NT-MAP-V1` within `G3D4D-NATIONAL-AWARDS-DOC-V1` | public squads/minutes/windows → Argentina selection/exposure summaries | selected and at-risk fields remain distinct; strict position mappings; missing candidate denominator stays limited | G3D-4D manifest hash | National Team anchors |
| `TR-AWARD-MAP-V1` within `G3D4D-NATIONAL-AWARDS-DOC-V1` | official results/fields → five-slot comparative/statistical summaries | official nominee field stays distinct from latent field; ties/ranks preserved; no scoring values | G3D-4D manifest hash | Award anchors and tails |
| `TR-RETIREMENT-CENSORING-V1` within `G3D4E-REPUTATION-RETIREMENT-DOC-V1` | career dates/status → intervals/right-censored summaries | active players right-censored; free agency/NT retirement not sporting retirement; no max-age or auto-finalization | G3D-4E manifest hash | Lifecycle anchors |
| `TR-SOCIAL-PLATFORM-V1` within `G3D4E-REPUTATION-RETIREMENT-DOC-V1` | dated platform observations → separate audience/engagement/event summaries | platforms never blindly summed; growth/loss/tails retained; missing geography stays missing | G3D-4E manifest hash | Reputation/Social anchors |
| `TR-MONEY-NORMALIZE-V1` | native integer minor units + dated IPC/HICP/FX observations → exact calibration purchasing-power context | rational inflation then approved FX direction/date; deterministic missing-business-day policy; one declared final rounding point; no binary-float source of truth | `G3D_P0_MONEY_BINDINGS_CANDIDATE.md` — `72e5d0034c744c11740a9ef39982897d5bcf85b1184b9fe57785d8c7c2c652c9` | Club/Market monetary calibration |

The observational manifest hashes in section 4 are also the transform-manifest
hashes for their domain. A manual spreadsheet not represented by one of these
contracts is not a valid bundle input.

## 8. Dataset definition versus candidate content

The 40 DatasetDefinitions and their lifecycle are identified by
`datasetRegistryHash`. Candidate content is separately identified by the P0
candidate manifest or a P1 domain observational manifest. For a run, each
consumed row must record:

```text
datasetId
datasetCandidateId or observationalManifestId
schema/spec version
content/manifest hash
EvidenceRecord index hash
transformId/version/hash
current status
```

Candidate use is allowed under `CALIBRATION_CAN_USE_CANDIDATE_DATA`; none is
silently `FROZEN`, and `DATA_V1_NOT_PUBLISHED` remains true.

## 9. Canonical root payload

The following is the exact 4749-byte RFC 8785 JSON payload hashed by SHA-256.
It excludes only `bundleRootHash` and this manifest's self-hash.

```json
{"calibrationControlArtifactHashes":[{"inputId":"G3D_INITIAL_CALIBRATION_PLAN","sha256":"73e8412e076acd40526d324b66f40af9a59b3930dfe233c1bb2b5e9272b9ddbc"},{"inputId":"G3D_PARAMETER_COUPLING_MAP","sha256":"72327fb0a5bd182c27df53bb9643eac9187342923b110e65764e34e23337b9d0"},{"inputId":"G3D_PARAMETER_IDENTIFIABILITY_MATRIX","sha256":"dd1ed58f6cc9af746b13b97977e4290952259b14b9f42fb1bcab3e09df69b168"},{"inputId":"G3D_WEAK_PARAMETER_PRIOR_AND_SENSITIVITY_CONTRACT","sha256":"6f5c33e17da557989790f1c262c37510415bc5a462b98286347154ef23419226"}],"calibrationInputBundleId":"CIB-G3D4G-RSNAP-20260807-C1","candidateDataManifestHash":"e0ac43981075ac80f1cfcc3e0a88147014e9561b6dfc5ae8d3e3ea8337eaae0d","canonicalHashAlgorithm":"SHA-256","canonicalization":"RFC8785+CanonicalDocumentUtf8LfV1","createdFromCommit":"4bf71f3f19dc46a8ab67a3e778f657338d4dd29a","datasetRegistryHash":"62851801bd65682f0a18e0d4715f4dceb345b814b496f84e50aa3eee6a2e3ceb","engineMathSpecHash":"08257e12f59d8c4a59b6df4e0f9cb2bb0b7c71f89058aa6055173d46a0753043","evidenceManifestHashes":[{"inputId":"G3D_P0_EVIDENCE_INDEX","sha256":"8c10e24d3cd1f77ce71e9a4dd387bdb20ba60d5f7cbcc69441c2e4757438ac5b"},{"inputId":"G3D_P1_CLUB_MARKET_EVIDENCE_INDEX","sha256":"90a9891822171a3b9eb7c41737f76f7269694057d8d40a3a710558d54ba8e266"},{"inputId":"G3D_P1_HEALTH_EVIDENCE_INDEX","sha256":"0311947c0afe434ff750968cffbfff1681e3708fb5dad74125a808e0af52d9e2"},{"inputId":"G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX","sha256":"077eff55843575211885b014cf69fca2dbe1b0e9f9e9e5277ad374f871a09ef8"},{"inputId":"G3D_P1_PLAYER_EVIDENCE_INDEX","sha256":"fc8b3fc3f6f76e77b7aaa93e4450cde2962ba8f2b2a0d6e78ebfa818d6f4b97e"},{"inputId":"G3D_P1_REPUTATION_RETIREMENT_EVIDENCE_INDEX","sha256":"9cac7ded17b052f06a87732bbb809695e0ada4425909a8cb894ccdea07a58ee2"}],"goldenRegistryHash":"779379e5d75d4d272eeae0fa1d15d150b84af9395c1bb76675da93419421f84d","mathematicalContractHash":"7a3a941ed5ecb376e34a76298746e005eb1ce4c5bb85d2b3ce9d120bfc1c86d7","observationalManifestHashes":[{"inputId":"G3D4A-OBS-V1","sha256":"0c2a650bc0445b8d27824d38a127d572322d56994e843320df288053090a6609"},{"inputId":"G3D4B-HEALTH-DOC-V1","sha256":"85dbf448d11ce3766cf21e60d164d1ab892148bca4da760e4fdb1f1e98dbad29"},{"inputId":"G3D4C-CLUB-MARKET-DOC-V1","sha256":"ab81bb9559ce222a8a5413c005cc2344898362045877d37c419fb50d3916097a"},{"inputId":"G3D4D-NATIONAL-AWARDS-DOC-V1","sha256":"d0854b34eeba04ae908c45fdf7693ba882c686c721447e1bb585a6236ad329d9"},{"inputId":"G3D4E-REPUTATION-RETIREMENT-DOC-V1","sha256":"e2db56847c92d703a602bac4b078f422f4f7a464a79fdf9950012a7e5789d2e2"}],"parameterRegistryHash":"ca3d65d465eb3c7b59c66d96d681e7d6b66fc12ea6b39d12039cd079bc9974d9","productTargetArtifactHash":"19c8d47643dc1111e43333a5eba497ee9438cea8c7de4ee7854186c921ce63de","referenceCutoffDate":"2026-08-07T23:59:59.999Z","referenceSnapshotId":"RSNAP-G3D3B-2026-08-07-C1","schemaVersion":"CalibrationInputBundle.v1","scoringMathSpecHash":"2dee11f174e277835e5cc4067fbc418a610024b55585b490dcefcb808ddee4da","sourceManifestHashes":[{"inputId":"G3D_P0_SOURCE_LICENSE_MANIFEST","sha256":"30f6da6acd959d91f993d19434d532bb4bd82d2f2722abe00418b715e58787cd"},{"inputId":"G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST","sha256":"4d7012a94568ad07e2e0d471ae17346b09b17a2d8d3c3bfad91ac36138b1dca2"},{"inputId":"G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST","sha256":"fddea8ae4f2fa454d4b57e12bb23836764440ab9419cd37ef87ab1982c5aa3f3"},{"inputId":"G3D_P1_NATIONAL_AWARDS_SOURCE_LICENSE_MANIFEST","sha256":"06b478488b6ba5ceac2f1ac4e7d7aa7b88e7ea0d854c44c982f06cceeee86cca"},{"inputId":"G3D_P1_PLAYER_SOURCE_LICENSE_MANIFEST","sha256":"fff31febf34d43b860a60700131c61c62e967d8c9dd8a3577b8d8e9148fe1fe3"},{"inputId":"G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST","sha256":"85ba16be3b1cf896c8ee04388890426a1f1f2ed60e955f1a342a42a4f10b6310"}],"state":"VALIDATED_CANDIDATE","targetRegistryHash":"c390b8e9b7df0dcab29ae3f4ff09d0eef91be89869b50268240492aa90c6fbd0","transformManifestHashes":[{"inputId":"G3D-P0-NORMALIZATION-V1","sha256":"b45b76366abbcd5e3a207debb89e9590310951de747880f1dfcab31fb195833a"},{"inputId":"G3D4A-OBS-V1","sha256":"0c2a650bc0445b8d27824d38a127d572322d56994e843320df288053090a6609"},{"inputId":"G3D4B-HEALTH-DOC-V1","sha256":"85dbf448d11ce3766cf21e60d164d1ab892148bca4da760e4fdb1f1e98dbad29"},{"inputId":"G3D4C-CLUB-MARKET-DOC-V1","sha256":"ab81bb9559ce222a8a5413c005cc2344898362045877d37c419fb50d3916097a"},{"inputId":"G3D4D-NATIONAL-AWARDS-DOC-V1","sha256":"d0854b34eeba04ae908c45fdf7693ba882c686c721447e1bb585a6236ad329d9"},{"inputId":"G3D4E-REPUTATION-RETIREMENT-DOC-V1","sha256":"e2db56847c92d703a602bac4b078f422f4f7a464a79fdf9950012a7e5789d2e2"},{"inputId":"TR-MONEY-NORMALIZE-V1","sha256":"72e5d0034c744c11740a9ef39982897d5bcf85b1184b9fe57785d8c7c2c652c9"}]}
```

Reproduction: hash exactly the UTF-8 bytes of that single JSON line. Expected:

```text
SHA256 = 1b647111f0dac846752f0495ab5ee5d00512e8bae5773e7bc11be4633404f25c
```

## 10. Mutation and compatibility rule

Once referenced by a run, this candidate is immutable. A change to any hash,
EvidenceRecord universe, dataset candidate, transform, registry, target,
Product Target or mathematical contract produces a successor bundle ID/root.
Corrections are lineage events, never silent edits.

A future ParameterSet must persist both `calibrationInputBundleId` and
`bundleRootHash`. Equal parameter values under different roots are not the same
calibration lineage. A root mismatch fails run validation before estimation or
RNG consumption.

## 11. Candidate status

All bound repository-contained document hashes were independently recomputed
with `CanonicalDocumentUtf8LfV1`. P0 candidate artifact hashes also match their
existing manifest. Raw/provider artifacts intentionally absent under license
policy remain reproducible only through authorized retrieval and recorded
hashes; that limitation is explicit and non-blocking for candidate use.

Status: **`VALIDATED_CANDIDATE`**. It is not `FROZEN_V1`.
