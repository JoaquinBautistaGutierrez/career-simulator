# G3D P0 National Team Catalog Candidate

## 1. Header

```yaml
artifactId: G3D_P0_NATIONAL_TEAM_CATALOG_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.NationalTeamDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-NATIONAL-COMPETITION-CATALOG@candidate/RSNAP-G3D3B-2026-08-07-C1/002
state: NORMALIZED_WITH_LIMITATIONS
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

## 2. `NT-ARG-SENIOR-MEN`

```yaml
nationalTeamId: NT-ARG-SENIOR-MEN
canonicalName: Argentina senior men's national football team
countryId: COUNTRY-ARG
associationContext: Asociación del Fútbol Argentino
category: SENIOR_MEN
sportingNationalityPolicyRef: ADR-082
eligibilityInputContract:
  resolverOutput: { isEligible: boolean, policyVersion: string, evidenceRefs: string[] }
  v1PermittedSportingNationality: ARGENTINA_ONLY
  inferenceFromResidenceOrClub: prohibited
relevantCompetitionEditionIds:
  - EDITION-FIFA-WORLD-CUP-2026
referencePeriod: 2026-06-11..2026-07-19
cutoffClass: PRE_CUTOFF_CLOSED
evidenceIds: [EV-P0-028, EV-P0-029, EV-P0-030, EV-P0-031, EV-P0-062, EV-P0-063]
sourceIds: [SRC-FIFA-WC-FORMAT-2026, SRC-FIFA-WC-RESULTS-2026, SRC-FIFA-ELIGIBILITY]
```

La identity, eligibility binding y major-tournament context son
`VALIDATED_CANDIDATE`. No se crean otras selecciones, roster, call-up field,
reach rating, generation strength ni selection coefficients.

## 3. World Cup context adapter

```yaml
competitionId: COMP-FIFA-WORLD-CUP
editionId: EDITION-FIFA-WORLD-CUP-2026
formatVersionId: FORMAT-FIFA-WORLD-CUP-2026-V1
participantCount: 48
groupCount: 12
groupSize: 4
guaranteedMatchEquivalents: 3
conditionalStages: [STAGE-WC-R32, STAGE-WC-R16, STAGE-WC-QF, STAGE-WC-SF, STAGE-WC-FINAL]
pressureProfileRef: PENDING_DATA
ordinaryInternationalWindowsRef: PENDING_DATA
```

El resultado adquirido Argentina runner-up es un fact histórico de edición, no
un baseline causal de fuerza ni una protección de identidad.

## 4. Status y blockers

| Subset | State | Missing |
|---|---|---|
| NationalTeam identity | `VALIDATED_CANDIDATE` | none |
| Argentina-only policy ref | `VALIDATED_CANDIDATE` | none; policy closed by ADR-082 |
| World Cup 2026 format/calendar context | `VALIDATED_CANDIDATE` | pressure adapter values remain later data |
| ordinary senior calendar | `PENDING_DATA` | `GAP-P0-CAL-001` |
| reach/visibility and selection field history | `PENDING_DATA` | P1 calibration evidence |

The dataset candidate remains `NORMALIZED_WITH_LIMITATIONS`; no field was
replaced with zero and no selection math was calibrated.

