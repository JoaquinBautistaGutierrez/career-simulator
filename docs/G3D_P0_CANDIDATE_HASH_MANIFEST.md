# G3D P0 Candidate Hash Manifest

## 1. Identity and algorithm

```yaml
manifestId: G3D3C-P0-CANDIDATE-HASH-MANIFEST-C1
manifestVersion: g3d-3c-candidate-1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
referenceCutoffDate: 2026-08-07T23:59:59.999Z
normalizationSpecVersion: G3D_P0_NORMALIZATION_SPEC.v1
candidateBundleId: G3D3C-P0-CATALOG-CANDIDATE-C1
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
| `G3D_P0_CANONICAL_ID_REGISTRY.md` | 9809 | `c18f5a87580eacc598f0eb2001cdb92767e1d2dc8c0f11b0b326b768d54eeba9` |
| `G3D_P0_REFERENCE_COMPETITION_CATALOG_CANDIDATE.md` | 9923 | `dbb6a24366ce60befbc3fc9173f57483cffdb9e54e15fcf6c1d5984c5a8d4cb6` |
| `G3D_P0_CALENDAR_CANDIDATE.md` | 6459 | `f9aa582a85f4e4487854f5a5910dbbebc029eb91756283fad4ebd798b4644cfa` |
| `G3D_P0_CLUB_IDENTITY_CATALOG_CANDIDATE.md` | 4735 | `710089418106cdbc09f612c19f761f2d3ef30c1d467e6cd5837fa6d1850895a4` |
| `G3D_P0_EXTERNAL_CLUB_CATALOG_CANDIDATE.md` | 3265 | `f64b7d1eb18509677dee0be241e9f5dfa3665f590cb17b8d656822aeba736443` |
| `G3D_P0_NATIONAL_TEAM_CATALOG_CANDIDATE.md` | 2662 | `d6cd3a637f45951da36c3cc0bd4c21f63b78f6e1911007a218c482ec3e45a80f` |
| `G3D_P0_AWARD_CATALOG_CANDIDATE.md` | 4177 | `fdab29a1228add796bed160c2dc2c5a857dd714c4421a76080d46922d6a2a4dd` |
| `G3D_P0_MONEY_BINDINGS_CANDIDATE.md` | 3302 | `e02db7dd819d13fa522be3e82226bb9ca81508d5134a4b960cf743192f7b7a90` |
| `G3D_P0_SCORING_CATALOG_CANDIDATE.md` | 4708 | `80b8c7ea5ec64eb7942a370cadc963f40d6ab726c9978e7a7e9aa0934eaae224` |

## 3. Lineage and dependencies

Every row derives from:

```text
RSNAP-G3D3B-2026-08-07-C1
  -> P0_EVIDENCE_INDEX (EV-P0-001..081)
  -> SOURCE_LICENSE_MANIFEST (46 source identities)
  -> G3D_P0_NORMALIZATION_SPEC.v1
  -> candidate artifact hash above
```

Candidate-specific evidence IDs are declared in each artifact. The source ID
is resolved through the immutable EvidenceRecord. No raw external dataset is a
hash input because none was committed or normalized.

## 4. Verification contract

Technical validation recomputes each hash from a clean checkout and compares
byte count and digest. Any content change invalidates the row and requires a
new candidate ordinal/hash; it never mutates a published `dataVersion`. This
manifest is provenance for a future candidate publication, not one of the five
competitive version identities.
