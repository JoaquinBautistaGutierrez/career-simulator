# G3D P0 Reference & Competition Catalog Candidate

## 1. Artifact header

```yaml
artifactId: G3D_P0_REFERENCE_COMPETITION_CATALOG_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.CompetitionDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateIds:
  - DS-COMPETITION-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/001
  - DS-NATIONAL-COMPETITION-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/002
state: NORMALIZED_WITH_LIMITATIONS
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
usageClass: MANUAL_PUBLIC_FACT
```

El organizer/format fact procede de páginas oficiales Tier A. Solo se retienen
facts manuales atómicos y sus IDs; no se redistribuye raw externo.

## 2. Reference edition bindings

| editionId | seasonId | competitionId | formatVersionId | Period / cutoff | Evidence / sources | Status |
|---|---|---|---|---|---|---|
| `EDITION-ARG-PRIMERA-APERTURA-2026` | `SEASON-ARG-2026` | `COMP-ARG-PRIMERA` | `FORMAT-ARG-PRIMERA-APERTURA-2026-V1` | 2026-01-25..2026-05-18; `PRE_CUTOFF_CLOSED` | `EV-P0-001..007`; `SRC-AFA-LPF-REG-2026`,`SRC-AFA-LPF-FINAL-2026` | `VALIDATED_CANDIDATE` |
| `EDITION-ARG-COPA-ARGENTINA-2025` | `SEASON-ARG-2025` | `COMP-ARG-COPA-ARGENTINA` | `FORMAT-ARG-COPA-ARGENTINA-2025-V1` | final 2025-11-05; `PRE_CUTOFF_CLOSED` | `EV-P0-012..014`; `SRC-AFA-COPA-ARG-FINAL-2025`,`SRC-AFA-COPA-ARG-REG-2025` | `NORMALIZED_WITH_LIMITATIONS` |
| `EDITION-ESP-LALIGA-2025-26` | `SEASON-ESP-2025-26` | `COMP-ESP-LALIGA` | `FORMAT-ESP-LALIGA-2025-26-V1` | 2025-08-16..2026-05-24; `PRE_CUTOFF_CLOSED` | `EV-P0-015..017`; `SRC-LALIGA-CALENDAR-2025-26`,`SRC-LALIGA-STANDINGS-2025-26` | `VALIDATED_CANDIDATE` |
| `EDITION-ESP-COPA-DEL-REY-2025-26` | `SEASON-ESP-2025-26` | `COMP-ESP-COPA-DEL-REY` | `FORMAT-ESP-COPA-DEL-REY-2025-26-V1` | 2025-09-27..2026-04-18; `PRE_CUTOFF_CLOSED` | `EV-P0-018..020`; `SRC-RFEF-COPA-SORTEO-2025-26`,`SRC-RFEF-COPA-REFORM-2025-26`,`SRC-RFEF-COPA-FINAL-2025-26` | `NORMALIZED_WITH_LIMITATIONS` |
| `EDITION-CONMEBOL-LIBERTADORES-2025` | `SEASON-CONMEBOL-2025` | `COMP-CONMEBOL-LIBERTADORES` | `FORMAT-CONMEBOL-LIBERTADORES-2025-V1` | Feb..2025-11-29; `PRE_CUTOFF_CLOSED` | `EV-P0-021..024`; `SRC-CONMEBOL-LIB-MANUAL-2025`,`SRC-CONMEBOL-LIB-FINAL-2025` | `VALIDATED_CANDIDATE` |
| `EDITION-UEFA-CHAMPIONS-LEAGUE-2025-26` | `SEASON-UEFA-2025-26` | `COMP-UEFA-CHAMPIONS-LEAGUE` | `FORMAT-UEFA-CHAMPIONS-LEAGUE-2025-26-V1` | 2025-07-08..2026-05-30; `PRE_CUTOFF_CLOSED` | `EV-P0-025..027`; `SRC-UEFA-UCL-FORMAT-2025-26`,`SRC-UEFA-UCL-RESULTS-2025-26` | `VALIDATED_CANDIDATE` |
| `EDITION-FIFA-WORLD-CUP-2026` | `SEASON-FIFA-2026` | `COMP-FIFA-WORLD-CUP` | `FORMAT-FIFA-WORLD-CUP-2026-V1` | 2026-06-11..2026-07-19; `PRE_CUTOFF_CLOSED` | `EV-P0-028..030`; `SRC-FIFA-WC-FORMAT-2026`,`SRC-FIFA-WC-RESULTS-2026` | `VALIDATED_CANDIDATE` |

`TR-G3D3C-SEASON-EDITION-SPLIT-V1` reemplaza los acquisition labels como
identity canónica. En Argentina, `SEASON-ARG-2026` contiene más que la edición
cerrada Apertura; el Clausura permanece `PRE_CUTOFF_PARTIAL` y no se incorpora
como baseline cerrado.

## 3. Six club CompetitionDefinitions

### 3.1 `COMP-ARG-PRIMERA`

```yaml
organizer: Asociación del Fútbol Argentino / Liga Profesional
jurisdictionId: COUNTRY-ARG
competitionType: LEAGUE_WITH_ZONES_AND_KNOCKOUT
participantSemantics: 30 clubs; two zones of 15
stages:
  - { stageId: STAGE-ARG-APERTURA-ZONES, structure: ONE_ROUND_PLUS_INTERZONAL, scheduledDatesPerClub: 16, exposure: GUARANTEED }
  - { stageId: STAGE-ARG-APERTURA-R16, structure: SINGLE_MATCH, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-ARG-APERTURA-QF, structure: SINGLE_MATCH, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-ARG-APERTURA-SF, structure: SINGLE_MATCH, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-ARG-APERTURA-FINAL, structure: SINGLE_MATCH, exposure: CONDITIONAL_ON_PROGRESSION }
progression: top 8 of each zone enter R16
tieSemantics: knockout tie -> extra time -> penalties
championSemantics: final winner is Apertura champion
annualQualificationAndMobility: NORMALIZED_WITH_LIMITATIONS
```

La tabla anual suma fases de zonas de Apertura y Clausura y produce un campeón
de Liga; descenso puede surgir de promedios o tabla anual (`EV-P0-010`,`011`).
Ese adapter anual es real pero el Clausura no estaba cerrado: sus outputs
iniciales quedan `PENDING_DATA`. No se representa como double round-robin.

### 3.2 `COMP-ARG-COPA-ARGENTINA`

```yaml
organizer: Asociación del Fútbol Argentino / Copa Argentina
jurisdictionId: COUNTRY-ARG
competitionType: DOMESTIC_CUP
participantSemantics: 64-club final phase
stages: [R64, R32, R16, QF, SF, FINAL]
stageStructure: SINGLE_MATCH
championSemantics: final winner
tieSemantics: PENDING_DATA for a complete per-round canonical rule
qualificationOutputs: PENDING_DATA
```

La estructura R64→final está respaldada por `EV-P0-013`; tie/qualification
completos no se extrapolan del resultado de la final.

### 3.3 `COMP-ESP-LALIGA`

```yaml
organizer: LALIGA / RFEF jurisdiction
jurisdictionId: COUNTRY-ESP
competitionType: LEAGUE
participantSemantics: 20 clubs
stages:
  - { stageId: STAGE-LALIGA-LEAGUE, structure: 38_MATCHDAY_LEAGUE_TABLE, matchEquivalentsPerClub: 38, exposure: GUARANTEED }
championSemantics: highest final league-table position
relegationOutputs: bottom 3
continentalQualificationOutputs: PENDING_DATA for full V1 binding
```

Core format y final standings están cerrados por `EV-P0-015..017`. El
qualification binding completo no es necesario para el aggregate core y queda
tipado como pending.

### 3.4 `COMP-ESP-COPA-DEL-REY`

```yaml
organizer: Real Federación Española de Fútbol
jurisdictionId: COUNTRY-ESP
competitionType: DOMESTIC_CUP
participantSemantics: 116 main-draw clubs plus 20 territorial preliminary teams
stages:
  - { stageId: STAGE-COPA-REY-PRELIMINARY, structure: TWO_LEG, exposure: CONDITIONAL_ON_ENTRY_AND_PROGRESSION }
  - { stageId: STAGE-COPA-REY-EARLY-ROUNDS, structure: SINGLE_MATCH_FIRST_TWO_PROPER_ROUNDS, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-COPA-REY-LATE-KNOCKOUT, structure: PENDING_DATA, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-COPA-REY-FINAL, structure: SINGLE_FINAL, exposure: CONDITIONAL_ON_PROGRESSION }
championSemantics: final winner
tieSemantics: NORMALIZED_WITH_LIMITATIONS
qualificationOutputs: PENDING_DATA
```

No se inventa el schema exacto de todas las rondas intermedias no adquirido.

### 3.5 `COMP-CONMEBOL-LIBERTADORES`

```yaml
organizer: CONMEBOL
jurisdictionId: REGION-SOUTH-AMERICA
competitionType: CONTINENTAL
participantSemantics: preliminary F1/F2/F3; 32-club group stage
stages:
  - { stageId: STAGE-LIB-F1, structure: PRELIMINARY, exposure: CONDITIONAL_ON_ENTRY }
  - { stageId: STAGE-LIB-F2, structure: PRELIMINARY, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-LIB-F3, structure: PRELIMINARY, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-LIB-GROUP, structure: 8_GROUPS_OF_4, matchEquivalentsPerClub: 6, exposure: GUARANTEED_FOR_GROUP_ENTRANT }
  - { stageId: STAGE-LIB-R16, structure: TWO_LEG, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-LIB-QF, structure: TWO_LEG, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-LIB-SF, structure: TWO_LEG, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-LIB-FINAL, structure: SINGLE_MATCH, exposure: CONDITIONAL_ON_PROGRESSION }
championSemantics: final winner
```

`GUARANTEED_FOR_GROUP_ENTRANT` no convierte preliminares o knockout en
guaranteed exposure.

### 3.6 `COMP-UEFA-CHAMPIONS-LEAGUE`

```yaml
organizer: UEFA
jurisdictionId: REGION-EUROPE
competitionType: CONTINENTAL
participantSemantics: 36-club league phase
stages:
  - { stageId: STAGE-UCL-LEAGUE, structure: SINGLE_TABLE, matchEquivalentsPerClub: 8, exposure: GUARANTEED_FOR_LEAGUE_PHASE_ENTRANT }
  - { stageId: STAGE-UCL-PLAYOFF, structure: TWO_LEG, exposure: CONDITIONAL_FOR_PLACES_9_TO_24 }
  - { stageId: STAGE-UCL-R16, structure: TWO_LEG, exposure: CONDITIONAL_ON_RANK_OR_PROGRESSION }
  - { stageId: STAGE-UCL-QF, structure: TWO_LEG, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-UCL-SF, structure: TWO_LEG, exposure: CONDITIONAL_ON_PROGRESSION }
  - { stageId: STAGE-UCL-FINAL, structure: SINGLE_MATCH, exposure: CONDITIONAL_ON_PROGRESSION }
progression: top 8 to R16; places 9-24 to playoff; lower eliminated
championSemantics: final winner
```

## 4. National competition context

`COMP-FIFA-WORLD-CUP` es un `NationalCompetitionDefinition` candidate:

```yaml
organizer: FIFA
jurisdictionId: REGION-GLOBAL
participantSemantics: 48 national teams
groupStructure: 12 groups of 4
progression: top 2 per group plus 8 best third-place teams to R32
guaranteedMatchEquivalents: 3 for tournament participant
conditionalStages: [R32, R16, QF, SF, FINAL]
championSemantics: final winner
state: VALIDATED_CANDIDATE
```

No materializa las otras 47 selecciones como `NationalTeamDefinition`.

## 5. Aggregate adapter y validation

| Input real | Aggregate output | Invariant |
|---|---|---|
| scheduled stage entered | guaranteed equivalents | no stage not entered contributes |
| reached knockout stage | conditional equivalents realized | eliminated club gets zero future rounds |
| field composition | field-strength input ref | no fabricated opponent identity required |
| final/progression result | immutable Domain Fact | exactly one champion where format requires |
| qualification/mobility output | request/fact for downstream policy | no auto-materialization or movement |

Validation result: six club competition IDs, six editions and six formats are
unique and resolve. The World Cup context also resolves. Four club competition
cores are `VALIDATED_CANDIDATE`; Copa Argentina and Copa del Rey remain
`NORMALIZED_WITH_LIMITATIONS`. No `FROZEN` definition exists.
