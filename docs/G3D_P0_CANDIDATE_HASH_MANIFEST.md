# G3D P0 Candidate Hash Manifest

## 1. Identity and algorithm

```yaml
manifestId: G3D3B2-P0-CANDIDATE-HASH-MANIFEST-C2
manifestVersion: g3d-3b2-candidate-2
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
referenceCutoffDate: 2026-08-07T23:59:59.999Z
normalizationSpecVersion: G3D_P0_NORMALIZATION_SPEC.v1
candidateBundleId: G3D3B2-P0-CATALOG-CANDIDATE-C2
parentCandidateBundleId: G3D3C-P0-CATALOG-CANDIDATE-C1
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
hashAlgorithm: SHA-256
canonicalization: CanonicalDocumentUtf8LfV1
state: VALIDATED_CANDIDATE_MANIFEST
```

`CanonicalDocumentUtf8LfV1` aplica Unicode NFC, LF, UTF-8 sin BOM y el
contenido completo exacto del artifact. Las tablas sin orden semántico están
ordenadas por canonical ID. El manifest no se auto-hashea.

## 2. Candidate hashes

| Candidate artifact | Canonical bytes | SHA-256 |
|---|---:|---|
| `G3D_P0_CANONICAL_ID_REGISTRY.md` | 10150 | `ea09fe7a713596b06d502f48f92a1fdc0a2894aaa665cf31f0f8b707ab464fe9` |
| `G3D_P0_REFERENCE_COMPETITION_CATALOG_CANDIDATE.md` | 9923 | `dbb6a24366ce60befbc3fc9173f57483cffdb9e54e15fcf6c1d5984c5a8d4cb6` |
| `G3D_P0_CALENDAR_CANDIDATE.md` | 7835 | `bb0fee3dc4dca6f639daf808439b66407dc23e37349f8176c451ed68421a407c` |
| `G3D_P0_CLUB_IDENTITY_CATALOG_CANDIDATE.md` | 4735 | `710089418106cdbc09f612c19f761f2d3ef30c1d467e6cd5837fa6d1850895a4` |
| `G3D_P0_EXTERNAL_CLUB_CATALOG_CANDIDATE.md` | 3265 | `f64b7d1eb18509677dee0be241e9f5dfa3665f590cb17b8d656822aeba736443` |
| `G3D_P0_NATIONAL_TEAM_CATALOG_CANDIDATE.md` | 2989 | `fb9730d7a5cf207a034c0a5a0612923b7f1523a546f9af5a1cb6be40c72035b4` |
| `G3D_P0_AWARD_CATALOG_CANDIDATE.md` | 5290 | `9bb5d03cf5ece2989245f3dda7626a680ce387bfd7f241250993f4f1d37c974c` |
| `G3D_P0_MONEY_BINDINGS_CANDIDATE.md` | 4536 | `72e5d0034c744c11740a9ef39982897d5bcf85b1184b9fe57785d8c7c2c652c9` |
| `G3D_P0_SCORING_CATALOG_CANDIDATE.md` | 4708 | `80b8c7ea5ec64eb7942a370cadc963f40d6ab726c9978e7a7e9aa0934eaae224` |

## 3. Lineage and dependencies

Every row derives from:

```text
RSNAP-G3D3B-2026-08-07-C1
  -> P0_EVIDENCE_INDEX (immutable EV-P0-001..081 + EV-P0-082..101)
  -> SOURCE_LICENSE_MANIFEST (60 source identities)
  -> G3D_P0_NORMALIZATION_SPEC.v1
  -> candidate artifact hash above
```

Candidate-specific evidence IDs are declared in each artifact. The source ID
is resolved through its EvidenceRecord. Only the five modified candidate rows
received new hashes; the four untouched hashes are preserved from C1. No raw
external dataset is a hash input because none was committed or normalized.

## 4. Verification contract

Technical validation recomputes each hash from a clean checkout and compares
byte count and digest. Any content change invalidates the row and requires a
new candidate ordinal/hash; it never mutates a published `dataVersion`. This
manifest is provenance for a future candidate publication, not one of the five
competitive version identities.
