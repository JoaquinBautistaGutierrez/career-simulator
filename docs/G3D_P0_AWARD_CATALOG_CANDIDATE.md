# G3D P0 Award Catalog Candidate

## 1. Header

```yaml
artifactId: G3D_P0_AWARD_CATALOG_CANDIDATE
artifactVersion: g3d-3b2-candidate-2
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.AwardDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-AWARD-DEFINITION-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/005-r2
parentCandidateId: DS-AWARD-DEFINITION-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/005
datasetState: VALIDATED_CANDIDATE
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

No `AwardDefinition` is `FROZEN`. The five slots have consumer-complete
candidate semantics; non-public real voting details remain explicit provenance
limitations.

## 2. Candidate matrix

| awardId / editionId | Family/category | Canonical simulation fields | Real-rule status | Evidence | State |
|---|---|---|---|---|---|
| `AWARD-BALLON-DOR-MEN` / `AWARD-EDITION-BALLON-DOR-MEN-2025` | `COMPARATIVE_JUDGED`; global men | `fieldSizeOrProfile=30`; evaluation 2024/25; ordinal ranking; `tiePolicy=UNIQUE_CANONICAL` | 2025 field/electorate verified; ballot/tie sequence `VERIFIED_BY_CONTINUITY` | `EV-P0-032`,`033`,`082`,`083` | `VALIDATED_CANDIDATE` |
| `AWARD-KOPA-TROPHY-MEN` / `AWARD-EDITION-KOPA-TROPHY-MEN-2025` | `COMPARATIVE_JUDGED`; young men | `fieldSizeOrProfile=10`; under-21/31-Jul rule; ordinal ranking; `tiePolicy=UNIQUE_CANONICAL` | 2025 field/electorate verified; age-date/ballot/tie `VERIFIED_BY_CONTINUITY` | `EV-P0-034`,`035`,`084`,`085` | `VALIDATED_CANDIDATE` |
| `AWARD-LALIGA-PLAYER-OF-SEASON` / `AWARD-EDITION-LALIGA-PLAYER-OF-SEASON-2025-26` | `COMPARATIVE_JUDGED`; LaLiga | `fieldSizeOrProfile=AWARD-FIELD-PROFILE-LALIGA-POTY-V1`; evaluation season; winner ordinal; `tiePolicy=UNIQUE_CANONICAL` | identity/window verified; human field/electorate/ballot/tie `NOT_PUBLICLY_DOCUMENTED` and non-causal | `EV-P0-038`,`039`,`088` | `VALIDATED_CANDIDATE_WITH_NONBLOCKING_LIMITATION` |
| `AWARD-LALIGA-TOP-SCORER` / `AWARD-EDITION-LALIGA-TOP-SCORER-2025-26` | `STATISTICAL`; league scorer | metric `leagueGoals`; full competition field; `tiePolicy=SHARED` | LaLiga top-scorer/Pichichi relation verified; real tie procedure `NOT_PUBLICLY_DOCUMENTED`; simulation tie policy explicit | `EV-P0-040`,`041`,`089`,`090` | `VALIDATED_CANDIDATE_WITH_NONBLOCKING_LIMITATION` |
| `AWARD-YASHIN-TROPHY-MEN` / `AWARD-EDITION-YASHIN-TROPHY-MEN-2025` | `COMPARATIVE_JUDGED`; goalkeeper men | `fieldSizeOrProfile=10`; GK category; ordinal ranking; `tiePolicy=UNIQUE_CANONICAL` | 2025 field/jury verified; ballot/tie sequence `VERIFIED_BY_CONTINUITY` | `EV-P0-036`,`037`,`086`,`087` | `VALIDATED_CANDIDATE` |

## 3. Field semantics

### 3.1 Ballon d'Or, Kopa and Yashin

The nominee count/electorate and 2025 ordered results are edition evidence.
Detailed ballot/tie mechanics remain observed metadata verified by continuity.
The simulator does not reproduce human ballots: it uses the normative abstract
field sampler and derives all ordinal states from one placement.

### 3.2 LaLiga Player of the Season

```yaml
eligibility: participation/evidence rules are supplied by the versioned simulation profile
evaluationWindow: SEASON-ESP-2025-26
fieldSizeOrProfile: AWARD-FIELD-PROFILE-LALIGA-POTY-V1
fieldModel: ABSTRACT_COMPARATIVE_FIELD
tiePolicy: UNIQUE_CANONICAL
realCandidateField: NOT_PUBLICLY_DOCUMENTED
realElectorate: NOT_PUBLICLY_DOCUMENTED
realBallotModel: NOT_PUBLICLY_DOCUMENTED
realTieProcedure: NOT_PUBLICLY_DOCUMENTED
```

The profile's later numeric calibration is not P0 data and is not assigned here.
`UNIQUE_CANONICAL` is a simulator policy required to yield the award's unique
winner, not a claim about LALIGA's unpublished ballot.

### 3.3 LaLiga Top Scorer / Pichichi

```yaml
statisticalMetric: leagueGoals
evaluationWindow: SEASON-ESP-2025-26
observedLeaderValue: 25 goals
canonicalGameplayLabel: LaLiga Top Scorer
aliases:
  - value: Pichichi
    type: EXTERNAL_AWARD_AND_PRESENTATION_ALIAS
    organizer: MARCA
tiePolicy: SHARED
```

LALIGA acknowledges Pichichi as the prize for its top scorer, while MARCA is
the named trophy's awarding publisher. Therefore `PICHICHI` is not promoted to
an official-LALIGA canonical ID. No public 2025/26 real tie procedure was found;
`SHARED` is the explicit statistical simulation policy required to preserve
equal leaderboard facts without RNG, not a claim about the human award.

## 4. Consumer classification

| Real-world field | V1 class | Publication consequence |
|---|---|---|
| identity, edition, family, category, evaluation period, statistical metric | A required | present and evidence-bound |
| real field/electorate/ballot/tie | B/C calibration/provenance | retained where public; non-public does not block abstract model |
| voter-level replication | D not required | excluded |
| simulation field profile/tie policy | A required simulator data | explicit; does not impersonate real rules |

## 5. Scoring boundary and status

This artifact contains zero scoring points. `AwardScoringDefinition` references
these IDs only after separate publication. The five candidate Definitions are
validated for the V1 abstraction but remain unfrozen. Numeric field calibration,
P1 award histories and atomic Data V1 publication remain later gates.
