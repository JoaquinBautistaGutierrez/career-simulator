# G3D P0 External Club Catalog Candidate

## 1. Header

```yaml
artifactId: G3D_P0_EXTERNAL_CLUB_CATALOG_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.ExternalClubContext.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
state: VALIDATED_CANDIDATE
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
evidenceIds: [EV-P0-059, EV-P0-060, EV-P0-061, EV-P0-079, EV-P0-080]
sourceIds: [SRC-UEFA-UCL-TEAMS-2025-26, SRC-CONMEBOL-LIB-GROUPS-2025, SRC-INTERNAL-ADR-081, SRC-INTERNAL-PRODUCT-DECISIONS, SRC-LALIGA-RELEGATION-2025-26]
```

## 2. Classification

| Class | V1 universe | Permitted nominal use | Catalog state |
|---|---|---|---|
| `DETAILED_SLICE` | 16 ClubDefinitions del slice | all supported gameplay affiliations/outcomes | identities validated; baselines P1 |
| `MATERIALIZABLE_REAL` | real clubs required on demand from baseline leagues, Libertadores/UCL fields, adjacent mobility, transfer/comeback counterparties | champion, contract holder, counterparty, affiliation or named fact only after materialization | universe contract validated; exhaustive IDs `PENDING_DATA` |
| `ABSTRACT_FIELD_ONLY` | non-nominal competitive/market field beyond materialized identities | aggregate strength/opportunity only | validated boundary |
| `OUT_OF_SCOPE_V1` | entities with no slice consumer | none | `NOT_IN_SCOPE` |

The minimum materializable universe is role-based, not a world database:

- 30 Argentina top-flight participants of the baseline format;
- 20 LaLiga baseline participants;
- 32 Libertadores group-stage and 36 UCL league-phase participants when a
  nominal outcome or relationship requires identity;
- real adjacent promotion/relegation counterparties;
- a real club selected as transfer/comeback counterparty before committing a
  nominal fact.

Membership overlaps do not create duplicate ClubDefinitions. A club is
materialized once under one stable identity and then referenced by editions.

## 3. Materialization contract

```text
MaterializationRequest
  { requiredRole, country/region, edition/context, evidenceRefs }
-> resolve existing canonical real identity OR create candidate identity
-> validate source, membership/context and licensing
-> emit MaterializedClubDefinitionCandidate
-> only then permit nominal Domain Fact
```

Minimum fields: `clubId`, canonical/short name, country/region, source
membership/context, aliases, evidence, valid period, confidence and candidate
hash. Causal baselines are separate and may remain abstract if the consumer
only requires a market/competition adapter.

## 4. Hard invariant

`ABSTRACT_FIELD_ONLY` cannot be nominal champion, transfer counterparty,
contract holder, career affiliation or named fact actor. A resolver needing any
of those roles must first materialize a real identity. Promotion/relegation
outputs are requests/facts; they do not auto-move the protagonist.

## 5. Limitations

The class contract is `VALIDATED_CANDIDATE`. The complete list of all
materializable IDs is intentionally not acquired and remains open by demand.
This does not block current competition field simulation contracts, but it
blocks any future nominal fact until the referenced club is materialized.
