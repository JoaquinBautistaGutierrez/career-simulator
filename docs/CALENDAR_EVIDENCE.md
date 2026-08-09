# Calendar Evidence

## 1. Artifact header

```yaml
artifactId: CALENDAR_EVIDENCE
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-CALENDAR
state: EVIDENCE_COMPLETE_WITH_LIMITATIONS
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  TECHNICAL_VALIDATOR: PROJECT_MAINTAINER_AS_TECHNICAL_VALIDATOR
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

Evidence is recorded at period/stage granularity. It does not create fixtures or
publish a `CalendarDefinition`; G3D-3C maps these facts to canonical Qs.

## 2. Stage timing and exposure evidence

| Edition | Real period | Guaranteed/conditional exposure evidence | Overlap/progression boundary | Evidence | State |
|---|---|---|---|---|---|
| Argentina Apertura 2026 | zone dates 25 Jan-26 Apr; knockout slots in May; final completed 18 May | 16 zone dates per club; knockout rounds only after qualification | domestic cup overlaps; Libertadores group stage overlaps for qualifiers | `EV-P0-003`..`EV-P0-006` | `COMPLETE` |
| Argentina Clausura 2026 | began Jul 2026; not closed at cutoff | 16-date zone structure known, but future knockout exposure is conditional and post-cutoff | no post-season market between Apertura and Clausura | `EV-P0-007`, `EV-P0-009`, `EV-P0-010`, `EV-P0-079` | `COMPLETE_WITH_LIMITATIONS` |
| Copa Argentina 2025 | final closed 5 Nov 2025 | one match for each reached round; later rounds conditional | irregular dates overlap LPF; G3D-3C assigns by actual stage period | `EV-P0-012`, `EV-P0-013` | `COMPLETE_WITH_LIMITATIONS` |
| LaLiga 2025/26 | 16-17 Aug 2025 through 23-24 May 2026 | 38 league matchdays for each club | domestic/European overlap; last round is close boundary | `EV-P0-015`..`EV-P0-017` | `COMPLETE` |
| Copa del Rey 2025/26 | preliminary began 27 Sep 2025; final 18 Apr 2026 | exposure per reached round; preliminary two-leg route is not assigned to top-flight protagonist by default | later rounds overlap LaLiga/UCL | `EV-P0-018`..`EV-P0-020` | `COMPLETE_WITH_LIMITATIONS` |
| Libertadores 2025 | preliminary Feb; group stage through first half; final 29 Nov 2025 | qualified group club has six group matches; later two-leg rounds and final conditional | domestic calendar overlap retained | `EV-P0-021`..`EV-P0-024` | `COMPLETE` |
| Champions 2025/26 | qualifiers from 8 Jul 2025; league phase Sep-Jan; play-off Feb; R16 Mar; QF Apr; SF Apr/May; final 30 May | league-phase club has eight matches; all later exposure conditional | spans cross-year Spain season | `EV-P0-025`..`EV-P0-027` | `COMPLETE` |
| World Cup 2026 | 11 Jun-19 Jul 2026 | three group matches for a selected finalist field member; knockout conditional | closed before cutoff; pressure increases by published phase adapter later | `EV-P0-028`..`EV-P0-030` | `COMPLETE` |

## 3. Quarter-mapping input contract

For every phase G3D-3C must publish:

```text
editionId
phaseId
realStartDateInclusive
realEndDateInclusive
guaranteedMatchEquivalentCount
conditionalMatchEquivalentCountByProgression
overlapCompetitionIds[]
progressionFactRequired
closeBoundary
sourceEvidenceIds[]
```

No round not reached contributes `TeamMinutesOpportunity`. An approximate
period may locate a phase in Q, but match equivalents come from actual format,
not day count.

## 4. Transfer and registration boundaries

### Argentina

- Apertura general registration close: 27 Jan 2026 17:00.
- A narrowly defined replacement route remained to 10 Mar after qualifying
  outbound transfers.
- Clausura list/registration evidence is separate and includes a limited route
  extending to 2 Sep.
- These observed mid-year rules do not alter the product policy: V1 gameplay
  has a single post-season market at the annual-season boundary.

Evidence: `EV-P0-008`, `EV-P0-009`, `EV-P0-079`.

### Spain

The closed 2025/26 season ends 24 May 2026. Official LALIGA evidence identifies
the next summer window as 1 Jul-1 Sep 2026.
G3D-3C must bind the V1 post-season market to that summer transition and ignore
the winter window for V1 gameplay.

Evidence: `EV-P0-081`. This is a
calendar-route fact; exact effective registration validation still belongs to
the normalized `RegistrationEligibility` catalog.

## 5. Pressure and congestion evidence boundary

The evidence supports phase and overlap, not calibrated numerical pressure or
congestion values. G3D-3C may publish structural phase labels and match
equivalents; numeric `pressureExposure` and `congestionSignal` remain parameter
calibration outputs. Final/semifinal labels alone cannot become hardcoded binary
gameplay effects.

## 6. Limitations

- Copa Argentina dates are irregular; a complete edition schedule extraction is
  needed before Q allocation is `VALIDATED`.
- Argentina's post-season boundary lies after the full annual sequence, while
  the reference edition slot is the closed Apertura. Both identities must be
  represented.
- International friendly/regular senior windows were not exhaustively acquired;
  only the closed World Cup context is P0-complete. This does not block the club
  catalogs but blocks a full national calendar publication.

Result: enough evidence exists to normalize the six club competitions and the
major Argentina senior context, with a partial national-window calendar and
explicit Argentina annual-boundary caveat.

## 7. Artifact review declaration

- Evidence selection: inline `EV-P0-*` references, indexed in
  [P0 Evidence Index](P0_EVIDENCE_INDEX.md).
- Owner approvals: `DATA_OWNER`, `TECHNICAL_VALIDATOR` as declared in header.
- Unresolved material conflicts: none. Partial Argentina/national periods are
  coverage limitations, not silently resolved conflicts.
