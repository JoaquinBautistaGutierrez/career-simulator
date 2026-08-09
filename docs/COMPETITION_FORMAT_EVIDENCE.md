# Competition Format Evidence

## 1. Artifact header

```yaml
artifactId: COMPETITION_FORMAT_EVIDENCE
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-COMP-FORMAT
state: EVIDENCE_COMPLETE_WITH_LIMITATIONS
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  TECHNICAL_VALIDATOR: PROJECT_MAINTAINER_AS_TECHNICAL_VALIDATOR
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

Este documento conserva hechos de formato. No es una
`CompetitionDefinition`, no cuantiza match equivalents y no modela resultados.

## 2. Format matrix

| Edition | Organizer / participants | Structure and champion | Qualification/mobility outputs needed by V1 | Evidence | State |
|---|---|---|---|---|---|
| `ARG-LPF-APERTURA-2026` | AFA/LPF; 30 clubs | two zones of 15; 16-date phase; top 8 per zone; single-match R16/QF/SF/final; extra time then penalties; final winner is champion | Apertura champion feeds annual/continental facts; annual table combines both semester phases; relegation may be by average or annual table and is emitted as a mobility request | `EV-P0-001`..`EV-P0-006`, `EV-P0-010`, `EV-P0-011` | `COMPLETE_WITH_LIMITATIONS` |
| `ARG-COPA-ARGENTINA-2025` | AFA; 64 final-phase clubs | single-match R32, R16, R8, QF, SF and final; final winner champion | champion has continental qualification consequence; exact next-edition binding belongs to published data | `EV-P0-012`, `EV-P0-013` | `COMPLETE` |
| `ESP-LALIGA-2025-26` | LALIGA/RFEF; 20 clubs | 38-matchday league table; one champion | bottom three emit relegation outputs; continental qualification slots remain definition data | `EV-P0-015`..`EV-P0-017`, `EV-P0-080` | `COMPLETE` |
| `ESP-COPA-DEL-REY-2025-26` | RFEF; 20 territorial preliminary teams and 116 main-draw clubs | preliminary route changed to two legs; first two proper rounds single-match; later knockout culminates in one final; official calendar/report closes edition | winner/runner-up facts; Supercopa/continental effects are definition bindings, not inferred here | `EV-P0-018`..`EV-P0-020` | `COMPLETE_WITH_LIMITATIONS` |
| `CONMEBOL-LIBERTADORES-2025` | CONMEBOL; preliminary field then 32 group clubs | F1/F2/F3; 8 groups of 4 and 6 group matchdays; R16/QF/SF two legs; single final | round reached, champion, conditional exposure; no unplayed future round is counted | `EV-P0-021`..`EV-P0-024` | `COMPLETE` |
| `UEFA-CHAMPIONS-LEAGUE-2025-26` | UEFA; 36 league-phase clubs | each club 8 league-phase matches; top 8 to R16, 9-24 to play-off, remaining eliminated; two-leg knockout rounds and single final under the edition calendar | league-phase rank, round reached, champion and conditional exposure | `EV-P0-025`..`EV-P0-027` | `COMPLETE` |
| `FIFA-WORLD-CUP-2026` | FIFA; 48 national teams | 12 groups of 4; top two plus eight best third-placed teams to R32; knockout through final | group/progression facts, runner-up/champion and pressure phases | `EV-P0-028`..`EV-P0-030` | `COMPLETE` |

## 3. Argentina-specific interpretation

The edition cannot use a European-season adapter:

```text
Apertura closed
  + Clausura partial at cutoff
  + annual table based on both zone phases
  + annual Trofeo de Campeones / mobility outputs
```

`ARG-LPF-APERTURA-2026` is the last closed competition edition, but not the end
of the Argentine annual club season. Therefore:

- a post-season market must not be placed between Apertura and Clausura;
- Apertura evidence may initialize the closed competition slot, while annual
  mobility and post-season registration wait for the annual boundary;
- G3D-3C must publish separate edition/season aggregate identities rather than
  flattening them into `ESP-2025-26` semantics.

## 4. Tie and progression facts

- Argentina Apertura single-match knockout ties use extra time and penalties.
- Copa Argentina is single-elimination; exact edition tie procedure must be
  copied from its regulation during normalization, not from Apertura by analogy.
- Copa del Rey format changes are edition-specific; no later 2026/27 rule may
  overwrite the 2025/26 baseline.
- Libertadores and Champions preserve guaranteed versus conditional exposure.
- Tournament fields may be abstract for team-strength comparisons, but a
  nominal champion must resolve to a materializable real identity under ADR-081.

## 5. Limitations and normalization requirements

1. Copa del Rey evidence is sufficient for identity, participants, broad stages
   and completion; G3D-3C must extract the complete round-by-round tie schema
   from the applicable RFEF bases before marking its definition `VALIDATED`.
2. Argentina relegation is an output of the annual season, not Apertura alone;
   publication requires the article 93/statistical average adapter and mobility
   policy binding without simulating an external league database.
3. Continental qualification mappings are observed facts but remain catalog
   fields. They are not scoring values and cannot be inferred from prestige.

No format conflict is unresolved. No post-cutoff format initializes the V1
baseline.
