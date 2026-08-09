# G3D P0 Award Catalog Candidate

## 1. Header

```yaml
artifactId: G3D_P0_AWARD_CATALOG_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.AwardDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-AWARD-DEFINITION-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/005
datasetState: NORMALIZED_WITH_LIMITATIONS
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
sourceIds: [SRC-UEFA-BALLON-WINNERS-2025, SRC-UEFA-BALLON-RULES, SRC-LALIGA-AWARDS-2025-26, SRC-LALIGA-TOPSCORER-2025-26, SRC-REALMADRID-PICHICHI-2025-26]
```

No AwardDefinition de este artifact está `FROZEN`. Los cinco slots tienen
identity/edition; el estado individual depende de sus mechanics verificadas.

## 2. Candidate matrix

| awardId / editionId | Family/category | Organizer/context | Known mechanics | Explicit pending | Evidence | State |
|---|---|---|---|---|---|---|
| `AWARD-BALLON-DOR-MEN` / `AWARD-EDITION-BALLON-DOR-MEN-2025` | `COMPARATIVE_JUDGED`; global men | France Football / co-organizer publication | 30-nominee comparative ranked field and winner/ordinal semantics documented for prior rules | verify 2025 continuity of field, ballot and tie | `EV-P0-032`,`033` | `NORMALIZED_WITH_LIMITATIONS` |
| `AWARD-KOPA-TROPHY-MEN` / `AWARD-EDITION-KOPA-TROPHY-MEN-2025` | `COMPARATIVE_JUDGED`; young men | Ballon d'Or family | under-21 reference, 10 nominees and ranked voting documented for prior rules | verify 2025 cutoff date/continuity and tie | `EV-P0-034`,`035` | `NORMALIZED_WITH_LIMITATIONS` |
| `AWARD-LALIGA-PLAYER-OF-SEASON` / `AWARD-EDITION-LALIGA-PLAYER-OF-SEASON-2025-26` | `COMPARATIVE_JUDGED`; LaLiga | LALIGA | existence, evaluation season and winner | candidate field, ballot weights/mechanism, tie policy | `EV-P0-038`,`039` | `NORMALIZED_WITH_LIMITATIONS` |
| `AWARD-LALIGA-TOP-SCORER` / `AWARD-EDITION-LALIGA-TOP-SCORER-2025-26` | `STATISTICAL`; league scorer | LALIGA statistical leaderboard | official leader and 25-goal result | tie policy; official binding to `Pichichi` | `EV-P0-040`,`041` | `NORMALIZED_WITH_LIMITATIONS` |
| `AWARD-YASHIN-TROPHY-MEN` / `AWARD-EDITION-YASHIN-TROPHY-MEN-2025` | `COMPARATIVE_JUDGED`; goalkeeper men | Ballon d'Or family | GK-only, 10 nominees and ranked voting documented for prior rules | verify 2025 continuity of field, ballot and tie | `EV-P0-036`,`037` | `NORMALIZED_WITH_LIMITATIONS` |

## 3. Normalized candidate details

### 3.1 Ballon d'Or, Kopa and Yashin

Identity, organizer family, edition, comparative/statistical family, category,
observed winner and source period are normalized. Mechanics from
`SRC-UEFA-BALLON-RULES` are retained as `REFERENCE_RULE_CANDIDATE`, not as
2025 facts, until `GAP-P0-AWD-001` closes. This preserves the evidence without
silently copying a prior edition.

### 3.2 LaLiga Player of the Season

```yaml
eligibility: participation in referenced LaLiga season; exact minimum evidence PENDING_DATA
evaluationWindow: SEASON-ESP-2025-26
fieldSize: PENDING_DATA
ballotModel: PENDING_DATA
tiePolicy: PENDING_DATA
ordinalOutcomes: winner observed; nomination/shortlist semantics PENDING_DATA
```

The absence is documented by Tier A `EV-P0-039`, not a conflict.

### 3.3 LaLiga Top Scorer

```yaml
statisticalMetric: leagueGoals
evaluationWindow: SEASON-ESP-2025-26
observedLeaderValue: 25 goals
canonicalLabel: LaLiga Top Scorer
alias:
  value: Pichichi
  state: CANDIDATE_ALIAS
tiePolicy: PENDING_DATA
```

The Tier B club source corroborates `Pichichi` but does not canonicalize an
organizer definition. No random or product tie policy is invented.

## 4. Scoring boundary

Award identity and Award scoring identity are separate. This artifact contains
zero scoring points. `AwardScoringDefinition` candidates reference these IDs
from the scoring catalog and cannot upgrade an incomplete AwardDefinition.

## 5. Gap closure and publication

`GAP-P0-AWD-001..003` block complete Award catalog validation. The identity
subset is mapped/normalized, but the dataset is not `VALIDATED_CANDIDATE` as a
whole. All five remain independently usable for focused research joins by ID.
