# Calendar Evidence

## 1. Artifact header

```yaml
artifactId: CALENDAR_EVIDENCE
artifactVersion: g3d-3b2-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-CALENDAR
state: EVIDENCE_COMPLETE_WITH_NONBLOCKING_LIMITATIONS
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  TECHNICAL_VALIDATOR: PROJECT_MAINTAINER_AS_TECHNICAL_VALIDATOR
artifactHashStatus: CANDIDATE_HASHED
candidateArtifactHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

Evidence is recorded at period/stage granularity. It does not create fixtures.
The candidate maps facts to canonical Qs without treating Q as a civil quarter.

## 2. Stage timing and exposure evidence

| Edition/context | Real period | Guaranteed/conditional exposure evidence | Overlap/progression boundary | Evidence | State |
|---|---|---|---|---|---|
| Argentina Apertura 2026 | zone dates 25 Jan-26 Apr; knockout slots in May; final completed 18 May | 16 zone dates per club; knockout rounds only after qualification | domestic cup overlaps; Libertadores group stage overlaps for qualifiers | `EV-P0-003`..`EV-P0-006` | `COMPLETE` |
| Argentina Clausura 2026 | began Jul 2026; not closed at cutoff | 16-date zone structure known, but future knockout exposure is conditional and post-cutoff | no post-season market between Apertura and Clausura | `EV-P0-007`, `EV-P0-009`, `EV-P0-010`, `EV-P0-079` | `COMPLETE_WITH_LIMITATIONS` |
| Copa Argentina 2025 | final closed 5 Nov 2025 | one match for each reached round; later rounds conditional | irregular dates overlap LPF; candidate assigns by actual stage period | `EV-P0-012`, `EV-P0-013` | `COMPLETE_WITH_LIMITATIONS` |
| LaLiga 2025/26 | 16-17 Aug 2025 through 23-24 May 2026 | 38 league matchdays for each club | domestic/European overlap; last round is close boundary | `EV-P0-015`..`EV-P0-017` | `COMPLETE` |
| Copa del Rey 2025/26 | preliminary began 27 Sep 2025; final 18 Apr 2026 | exposure per reached round; preliminary route is not assigned to a top-flight protagonist by default | later rounds overlap LaLiga/UCL | `EV-P0-018`..`EV-P0-020` | `COMPLETE_WITH_LIMITATIONS` |
| Libertadores 2025 | preliminary Feb; group stage through first half; final 29 Nov 2025 | qualified group club has six group matches; later two-leg rounds and final conditional | domestic calendar overlap retained | `EV-P0-021`..`EV-P0-024` | `COMPLETE` |
| Champions 2025/26 | qualifiers from 8 Jul 2025; league phase Sep-Jan; play-off Feb; R16 Mar; QF Apr; SF Apr/May; final 30 May | league-phase club has eight matches; all later exposure conditional | spans cross-year Spain season | `EV-P0-025`..`EV-P0-027` | `COMPLETE` |
| World Cup 2026 | 11 Jun-19 Jul 2026 | three group matches for a selected field member; knockout conditional | closed before cutoff; mandatory release begins 25 May subject to the published final-club-match exception | `EV-P0-028`..`EV-P0-030`, `EV-P0-092` | `COMPLETE` |

## 3. Ordinary Argentina senior calendar

FIFA's 2025-2030 men's international match calendar supplies the only ordinary
global windows V1 needs around the 2026 baseline. It does not imply that
Argentina plays the maximum number of matches.

| Window ID | Official 2026 period | Maximum opportunity | Candidate Q mapping | Semantics | Evidence/state |
|---|---|---:|---|---|---|
| `INTL-WINDOW-MEN-2026-MAR` | 23-31 Mar 2026 | 2 | Argentina Q1 | ordinary national-team selection/exposure opportunity | `EV-P0-091`; `VERIFIED` |
| `INTL-WINDOW-MEN-2026-JUN` | 1-9 Jun 2026 | 2 | Argentina Q2 | World Cup preparation opportunity; separate from tournament exposure | `EV-P0-091`, `EV-P0-092`; `VERIFIED` |
| `INTL-WINDOW-MEN-2026-SEP-OCT` | 21 Sep-6 Oct 2026 | 4 | selection checkpoint in Q3; realized exposure assigned to Q3/Q4 by actual occurrence | one compound FIFA window crossing the logical boundary; never duplicated | `EV-P0-091`; `VERIFIED` |
| `INTL-WINDOW-MEN-2026-NOV` | 9-17 Nov 2026 | 2 | Argentina Q4 | ordinary national-team selection/exposure opportunity | `EV-P0-091`; `VERIFIED` |

The calendar publishes opportunity, not guaranteed fixtures. `actualMatchEquivalentCount`
is zero through the window maximum and comes from a future scheduled/closed
national context. Tournament progression remains a separate conditional source.
Club and international minutes remain separate.

## 4. Quarter-mapping input contract

For every phase/window the candidate publishes:

```text
editionIdOrWindowId
phaseId?
realStartDateInclusive
realEndDateInclusive
maximumOrGuaranteedMatchEquivalentCount
conditionalMatchEquivalentCountByProgression?
overlapCompetitionIds[]
progressionOrScheduleFactRequired
selectionCheckpoint
closeBoundary
sourceEvidenceIds[]
```

No round not reached and no unscheduled ordinary opportunity contributes
`TeamMinutesOpportunity`. Approximate periods locate a phase/window; match
equivalents come from actual format/schedule facts, not elapsed days.

## 5. Transfer and registration boundaries

### Argentina

- Apertura general registration close: 27 Jan 2026 17:00.
- A narrowly defined replacement route remained to 10 Mar after qualifying
  outbound transfers.
- Clausura evidence is separate and includes a limited route extending to 2 Sep.
- Real mid-year rules do not alter `POST_SEASON_ONLY`: V1 gameplay has one
  market at the full annual-season boundary.

Evidence: `EV-P0-008`, `EV-P0-009`, `EV-P0-079`.

### Spain

The closed 2025/26 season ends 24 May 2026. Official LALIGA evidence identifies
the next summer window as 1 Jul-1 Sep 2026. V1 binds post-season market to that
transition and excludes the winter window from gameplay.

Evidence: `EV-P0-081`. Detailed jurisdiction validation remains a registration
catalog concern, not a missing calendar consumer.

## 6. Pressure and congestion evidence boundary

The evidence supports phase/window, overlap and maximum/conditional exposure,
not calibrated pressure or congestion values. Numeric `pressureExposure` and
`congestionSignal` remain ParameterSet outputs. A final/semifinal label never
becomes a hardcoded binary gameplay effect.

## 7. Limitations

- Copa Argentina dates are irregular and exact per-round allocation remains a
  later catalog-quality refinement.
- Argentina's season close lies after the full annual sequence, while Apertura
  is the closed reference edition; both identities remain explicit.
- The Sep-Oct FIFA period crosses Q3/Q4. The candidate fixes one selection
  checkpoint and requires actual-date allocation instead of inventing a split.
- No fixtures, call-up probabilities or international minutes were inferred.

These limitations are nonblocking for the aggregate V1 consumers: competition
stage mapping, ordinary international opportunities, selection checkpoints,
exposure/congestion input and post-season market ordering are all defined.

## 8. Artifact review declaration

- Evidence selection: existing inline records plus `EV-P0-091` and
  `EV-P0-092`.
- Owner approvals: `DATA_OWNER`, `TECHNICAL_VALIDATOR` as declared in header.
- Unresolved material conflicts: none. Partial real schedules remain explicit
  opportunity limitations and are never promoted to fixtures.
