# G3D P0 Scoring Catalog Candidate

## 1. Header and separation

```yaml
artifactId: G3D_P0_SCORING_CATALOG_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: SCORING_MATH_SPEC.CatalogCandidate.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-SCORING-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/007
state: NORMALIZED_WITH_LIMITATIONS
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
scoringConfigurationRef: SCORING-CONFIGURATION-V1-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
valueSourceType: NORMATIVE
evidenceIds: [EV-P0-071, EV-P0-072, EV-P0-073, EV-P0-074, EV-P0-075, EV-P0-076, EV-P0-077, EV-P0-078]
sourceIds: [SRC-INTERNAL-MASTER-SCORING, SRC-INTERNAL-SCORING-MATH]
```

Gameplay definitions and scoring definitions are different identities. This
artifact binds normative rules to candidate gameplay IDs; it is not a
`ScoringConfiguration` and creates no `ScoreLedger`.

Normative provenance: `MASTER_SPEC.docx` §20.2 and tables 30, 32, 34 and 36;
[Scoring Math Spec](SCORING_MATH_SPEC.md);
[Scoring Facts Spec](SCORING_FACTS_SPEC.md); [ADR-080](adr/080-exact-scoring-mathematics.md).

## 2. Competition scoring definitions

| scoringDefinitionId | gameplay competitionId | Normative champion/base rule | Binding state |
|---|---|---|---|
| `SCORING-COMP-ARG-PRIMERA` | `COMP-ARG-PRIMERA` | `ROUND_HALF_UP(650 * (IJL/100)^1.35)` | identity bound; IJL `DATA_REQUIRED` |
| `SCORING-COMP-ARG-COPA-ARGENTINA` | `COMP-ARG-COPA-ARGENTINA` | `ROUND_HALF_UP(0.55 * domesticLeagueBase)` | identity bound; league IJL `DATA_REQUIRED` |
| `SCORING-COMP-ESP-LALIGA` | `COMP-ESP-LALIGA` | `ROUND_HALF_UP(650 * (IJL/100)^1.35)` | identity bound; IJL `DATA_REQUIRED` |
| `SCORING-COMP-ESP-COPA-DEL-REY` | `COMP-ESP-COPA-DEL-REY` | `ROUND_HALF_UP(0.55 * domesticLeagueBase)` | identity bound; league IJL `DATA_REQUIRED` |
| `SCORING-COMP-CONMEBOL-LIBERTADORES` | `COMP-CONMEBOL-LIBERTADORES` | champion base `2100` | `NORMALIZED` |
| `SCORING-COMP-UEFA-CHAMPIONS-LEAGUE` | `COMP-UEFA-CHAMPIONS-LEAGUE` | champion base `2200` | `NORMALIZED` |
| `SCORING-COMP-FIFA-WORLD-CUP` | `COMP-FIFA-WORLD-CUP` | champion `5000`; runner-up `1/2`; semifinalist `1/4` | `NORMALIZED` |

Collective player points remain `baseAchievementPoints * CC`; this catalog does
not supply CC cohorts or contribution parameters.

## 3. Award scoring definitions

| scoringDefinitionId | awardId | Normative rule | Binding state |
|---|---|---|---|
| `SCORING-AWARD-BALLON-DOR-MEN` | `AWARD-BALLON-DOR-MEN` | `1800` | identity bound; AwardDefinition mechanics pending |
| `SCORING-AWARD-KOPA-TROPHY-MEN` | `AWARD-KOPA-TROPHY-MEN` | `500` | identity bound; AwardDefinition mechanics pending |
| `SCORING-AWARD-YASHIN-TROPHY-MEN` | `AWARD-YASHIN-TROPHY-MEN` | `700` | identity bound; AwardDefinition mechanics pending |
| `SCORING-AWARD-LALIGA-PLAYER-OF-SEASON` | `AWARD-LALIGA-PLAYER-OF-SEASON` | `ROUND_HALF_UP(350 * IJL/100)` | identity bound; IJL and Award fields pending |
| `SCORING-AWARD-LALIGA-TOP-SCORER` | `AWARD-LALIGA-TOP-SCORER` | `ROUND_HALF_UP(220 * IJL/100)` | identity bound; IJL/tie/alias pending |

The anti-duplication equivalence policy is normative, but exact equivalence
groups remain `DATA_REQUIRED`. Positional, youth and statistical awards are not
made equivalent by default.

## 4. Explicit gaps

| Resource | State | Missing |
|---|---|---|
| competition and award identity refs | `CATALOG_BOUND_CANDIDATE` | final dataVersion hashes |
| league IJL table | `DATA_REQUIRED` | approved IJL values/bindings for the slice |
| award equivalence groups | `DATA_REQUIRED` | exact group members and versioned policy data |
| `RecordScoringDefinition` | `DATA_REQUIRED` | exact records, scope and values |
| `CareerMilestoneDefinition` | `DATA_REQUIRED` | exact milestone catalog |
| `HistoricAchievementDefinition` | `DATA_REQUIRED` | exact achievement catalog |
| PRI/exposure transforms | `DATA_REQUIRED` | frozen GK/CM/ST cohorts |
| contribution transforms | `DATA_REQUIRED` | participation/contribution cohorts |
| social/historic transforms | `DATA_REQUIRED` | authorized metrics and product balance |

The existing normative values are transcribed exactly; no web evidence or
prestige proxy changes their magnitude. Examples in MASTER_SPEC do not become
published IJL values under this candidate without the G3D publication gate.

## 5. Validation and status

All 12 scoring IDs resolve to candidate gameplay identities. No scoring row
references a missing Competition/Award ID. The subset is
`NORMALIZED_WITH_LIMITATIONS`; `ScoringConfiguration`,
`ScoringCalibrationData`, `scoringVersion` publication and Gate 6 remain
blocked. No new points were invented.
