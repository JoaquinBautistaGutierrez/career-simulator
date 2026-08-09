# G3D P0 Calendar Candidate

## 1. Header

```yaml
artifactId: G3D_P0_CALENDAR_CANDIDATE
artifactVersion: g3d-3b2-candidate-2
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.CalendarDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-CALENDAR-SLICE@candidate/RSNAP-G3D3B-2026-08-07-C1/003-r2
parentCandidateId: DS-CALENDAR-SLICE@candidate/RSNAP-G3D3B-2026-08-07-C1/003
calendarId: CALENDAR-VS-RSNAP-2026-08-07-C1
state: VALIDATED_CANDIDATE
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

`Q1..Q4` are logical partitions by season context, not universal civil
quarters. `TR-G3D3C-PHASE-Q-V1` uses acquired official periods and preserves
every approximation.

## 2. Quarter mapping by context

### 2.1 Argentina annual season

| Q | Real period/stages | Exposure | Boundary / evidence | Confidence |
|---|---|---|---|---|
| Q1 | Jan-Mar; `STAGE-ARG-APERTURA-ZONES` | part of 16 guaranteed dates; exact Q count `PENDING_DATA` | Apertura 25 Jan-26 Apr; `EV-P0-003`,`005` | MEDIUM |
| Q2 | Apr-Jun; zone close plus conditional R16/QF/SF/final through 18 May | remaining zone dates guaranteed; one per reached KO round | `EV-P0-004..006` | HIGH by phase; MEDIUM by zone split |
| Q3 | Jul-Sep; Clausura 2026 partial at cutoff | only closed/scheduled facts may become realized exposure | `EV-P0-007`,`009`; `PRE_CUTOFF_PARTIAL` | LOW/PENDING |
| Q4 | Oct-Dec; annual season close/Clausura completion | future at cutoff; never initialized as a closed fact | no closed cutoff fact | PENDING |

`SEASON_CLOSE` occurs after the full annual sequence, not after Apertura. The
closed Apertura can initialize historical context but does not open
`MARKET-WINDOW-V1-POST-SEASON-ARG`.

### 2.2 Spain cross-year season

| Q | Real period/stages | Exposure | Boundary / evidence | Confidence |
|---|---|---|---|---|
| Q1 | Aug-Oct; early LaLiga, UCL league and Copa start | LaLiga share exact `PENDING_DATA`; UCL/Copa by stage | `EV-P0-015`,`020`,`025` | MEDIUM |
| Q2 | Nov-Jan; LaLiga continuation, UCL league close, Copa early rounds | UCL league contributes within total 8 | `EV-P0-018..020`,`EV-P0-025..027` | MEDIUM |
| Q3 | Feb-Mar; LaLiga, UCL playoff/R16, Copa late knockout | UEFA/cup conditional on progression | `EV-P0-018..020`,`EV-P0-025..027` | HIGH by stage |
| Q4 | Apr-May; league close, domestic cup final, UCL QF/SF/final | LaLiga total reaches 38; cups conditional | `EV-P0-015..020`,`EV-P0-025..027` | HIGH by close/final |

LaLiga guarantees 38 match equivalents per club over Q1-Q4. The candidate does
not invent their exact split by Q.

### 2.3 Libertadores 2025

| Q | Stage mapping | Exposure semantics | Evidence |
|---|---|---|---|
| Q1 | F1/F2/F3 and group opening | prelim conditional; group exposure starts only on entry | `EV-P0-021..024` |
| Q2 | group completion | six total guaranteed for group entrant | `EV-P0-021..024` |
| Q3 | R16/QF | two matches per reached tie, conditional | `EV-P0-021..024` |
| Q4 | SF/final | two-leg SF plus single final, conditional | `EV-P0-021..024` |

### 2.4 Champions League 2025/26

| Q | Stage mapping | Exposure semantics | Evidence |
|---|---|---|---|
| Q1 | league phase opening | within 8 guaranteed for league entrant | `EV-P0-025..027` |
| Q2 | league phase close | total league exposure reaches 8 | `EV-P0-025..027` |
| Q3 | playoff/R16 | conditional on league rank/progression | `EV-P0-025..027` |
| Q4 | QF/SF/final | conditional; two-leg ties then single final | `EV-P0-025..027` |

### 2.5 Domestic cups and national tournament

| Context | Mapping | Status |
|---|---|---|
| Copa Argentina 2025 | Q allocation follows actual reached-round period; one match equivalent per reached single-match round | `NORMALIZED_WITH_LIMITATIONS`; exact round dates are a refinement |
| Copa del Rey 2025/26 | Q1 preliminary/start, Q2 early rounds, Q3 late knockout, Q4 final | `NORMALIZED_WITH_LIMITATIONS`; detailed per-round allocation is a refinement |
| World Cup 2026 | Jun-Jul; group guaranteed 3 then conditional R32 through final | `VALIDATED_CANDIDATE` |

### 2.6 Argentina ordinary senior windows

| windowId | Official period | Maximum match-equivalent opportunity | Q/checkpoint | Evidence |
|---|---|---:|---|---|
| `INTL-WINDOW-MEN-2026-MAR` | 23-31 Mar 2026 | 2 | Q1 | `EV-P0-091` |
| `INTL-WINDOW-MEN-2026-JUN` | 1-9 Jun 2026 | 2 | Q2; World Cup preparation context separate from tournament exposure | `EV-P0-091`,`092` |
| `INTL-WINDOW-MEN-2026-SEP-OCT` | 21 Sep-6 Oct 2026 | 4 | one selection checkpoint in Q3; realized dates allocate exposure to Q3/Q4 | `EV-P0-091` |
| `INTL-WINDOW-MEN-2026-NOV` | 9-17 Nov 2026 | 2 | Q4 | `EV-P0-091` |

Maximum opportunity is not guaranteed exposure. A future Argentina schedule
fact supplies `actualMatchEquivalentCount` in `[0, maximum]`. The compound
Sep-Oct window is one context token and cannot be double-counted. Club and
international opportunities/minutes remain disjoint.

## 3. Guaranteed/conditional exposure

| Edition / entry state | Guaranteed | Conditional |
|---|---:|---|
| Argentina Apertura participant | 16 | R16/QF/SF/final, one each if reached |
| Copa Argentina participant | entry-route fact required | one per future reached round |
| LaLiga participant | 38 | `NOT_APPLICABLE` |
| Copa del Rey participant | entry-route fact required | every future reached round/tie |
| Libertadores group entrant | 6 | R16 two, QF two, SF two, final one |
| UCL league-phase entrant | 8 | playoff/R16/QF/SF two per reached tie; final one |
| World Cup participant | 3 | one per reached R32/R16/QF/SF/final |
| Argentina ordinary Mar/Jun/Nov window | 0 before schedule fact | up to 2 actual scheduled matches |
| Argentina ordinary Sep-Oct window | 0 before schedule fact | up to 4 actual scheduled matches across one compound window |

Counts are match equivalents, not fixtures. No future exposure is credited at
season start.

## 4. Market and registration

```yaml
marketWindows:
  - marketWindowId: MARKET-WINDOW-V1-POST-SEASON-ARG
    jurisdictionId: COUNTRY-ARG
    opensAfter: SEASON-ARG-2026.SEASON_CLOSE
    midSeasonEnabled: false
    state: VALIDATED_CANDIDATE
  - marketWindowId: MARKET-WINDOW-V1-POST-SEASON-ESP
    jurisdictionId: COUNTRY-ESP
    opensAfter: SEASON-ESP-2025-26.SEASON_CLOSE
    midSeasonEnabled: false
    observedSummerEvidence: EV-P0-081
    state: VALIDATED_CANDIDATE
registrationPolicies:
  - registrationPolicyId: REGISTRATION-POLICY-V1-NEXT-SEASON-ARG
    effect: accepted move eligible only at authorized next-season boundary
    detailedRules: PENDING_DATA
  - registrationPolicyId: REGISTRATION-POLICY-V1-NEXT-SEASON-ESP
    effect: accepted move eligible only at authorized next-season boundary
    detailedRules: PENDING_DATA
```

`midSeasonEnabled: false` is product policy, not a claim that real mid-season
registration does not exist.

## 5. Consistency and limitations

- all stage/window IDs resolve to the canonical registry or are candidate IDs
  introduced by this revision;
- calendar bindings point to the correct closed edition/context;
- guaranteed, maximum-opportunity and progression-conditional exposure are
  distinct;
- market follows full season close;
- ordinary international dates come from FIFA; no Argentina fixture was
  inferred;
- Sep-Oct has one Q3 selection checkpoint and actual-date Q3/Q4 allocation;
- exact club within-stage counts remain `PENDING_DATA` where not acquired, but
  no aggregate V1 consumer requires them to close `GAP-P0-CAL-001`.

Result: the calendar is `VALIDATED_CANDIDATE` for V1 consumers: stage-to-Q
ordering, guaranteed/conditional exposure, ordinary international opportunities,
selection checkpoints and post-season market are complete. It is not `FROZEN`;
fixtures and non-causal allocation refinements remain out of scope.
