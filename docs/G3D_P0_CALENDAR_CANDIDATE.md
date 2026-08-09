# G3D P0 Calendar Candidate

## 1. Header

```yaml
artifactId: G3D_P0_CALENDAR_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.CalendarDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-CALENDAR-SLICE@candidate/RSNAP-G3D3B-2026-08-07-C1/003
calendarId: CALENDAR-VS-RSNAP-2026-08-07-C1
state: NORMALIZED_WITH_LIMITATIONS
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

`Q1..Q4` son particiones lógicas por season context, no quarters civiles
universales. `TR-G3D3C-PHASE-Q-V1` usa períodos oficiales adquiridos y conserva
aproximaciones.

## 2. Quarter mapping por context

### 2.1 Argentina annual season

| Q | Real period/stages | Exposure | Boundary / evidence | Confidence |
|---|---|---|---|---|
| Q1 | Jan-Mar; `STAGE-ARG-APERTURA-ZONES` | parte de 16 fechas guaranteed; count Q exacto `PENDING_DATA` | Apertura 25 Jan-26 Apr; `EV-P0-003`,`005` | MEDIUM |
| Q2 | Apr-Jun; cierre zones + R16/QF/SF/final condicional hasta 18 May | remaining zone dates guaranteed; 1 per reached KO round | `EV-P0-004..006` | HIGH por fase; MEDIUM por reparto de zonas |
| Q3 | Jul-Sep; Clausura 2026 parcial al cutoff | `PENDING_DATA` | `EV-P0-007`,`009`; `PRE_CUTOFF_PARTIAL` | LOW/PENDING |
| Q4 | Oct-Dec; annual season close/Clausura completion | `PENDING_DATA` | no fact cerrado al cutoff | PENDING |

`SEASON_CLOSE` ocurre después de la season anual completa, no después de
Apertura. El Apertura cerrado puede inicializar context histórico pero no abre
`MARKET-WINDOW-V1-POST-SEASON-ARG`.

### 2.2 Spain cross-year season

| Q | Real period/stages | Exposure | Boundary / evidence | Confidence |
|---|---|---|---|---|
| Q1 | Aug-Oct; early LaLiga, UCL league and Copa start | LaLiga share exact `PENDING_DATA`; UCL/Copa by stage | `EV-P0-015`,`020`,`025`; calendar sources | MEDIUM |
| Q2 | Nov-Jan; LaLiga continuation, UCL league close, Copa early rounds | UCL league contributes within total 8 | `EV-P0-018..020`,`EV-P0-025..027` | MEDIUM |
| Q3 | Feb-Mar; LaLiga, UCL playoff/R16, Copa late knockout | UEFA/cup conditional on progression | `EV-P0-018..020`,`EV-P0-025..027` | HIGH by stage |
| Q4 | Apr-May; league close, domestic cup final, UCL QF/SF/final | LaLiga total reaches 38; cups conditional | `EV-P0-015..020`,`EV-P0-025..027` | HIGH by close/final |

LaLiga garantiza 38 match-equivalents por club sobre Q1-Q4. No se inventa su
distribución exacta por Q.

### 2.3 Libertadores 2025

| Q | Stage mapping | Exposure semantics | Evidence |
|---|---|---|---|
| Q1 | F1/F2/F3 and group opening | prelim conditional; group exposure starts only on entry | `EV-P0-021..024` |
| Q2 | group completion | six total guaranteed for group entrant | `EV-P0-021..024` |
| Q3 | R16/QF | two matches per reached tie, conditional | `EV-P0-021..024` |
| Q4 | SF/final | two-leg SF + single final, conditional | `EV-P0-021..024` |

### 2.4 Champions League 2025/26

| Q | Stage mapping | Exposure semantics | Evidence |
|---|---|---|---|
| Q1 | league phase opening | within 8 guaranteed for league entrant | `EV-P0-025..027` |
| Q2 | league phase close | total league exposure reaches 8 | `EV-P0-025..027` |
| Q3 | playoff/R16 | conditional on league rank/progression | `EV-P0-025..027` |
| Q4 | QF/SF/final | conditional; two-leg ties then single final | `EV-P0-025..027` |

### 2.5 Domestic cups and national context

| Context | Mapping | Status |
|---|---|---|
| Copa Argentina 2025 | Q allocation follows actual reached-round period; one match equivalent per reached single-match round | `NORMALIZED_WITH_LIMITATIONS`; exact round dates pending |
| Copa del Rey 2025/26 | Q1 preliminary/start, Q2 early rounds, Q3 late knockout, Q4 final | `NORMALIZED_WITH_LIMITATIONS`; detailed late-round schema pending |
| World Cup 2026 | one major international window, Jun-Jul; group guaranteed 3 then conditional R32→final | `VALIDATED_CANDIDATE` |
| Argentina ordinary senior windows | no mapping | `PENDING_DATA` (`GAP-P0-CAL-001`) |

## 3. Guaranteed/conditional exposure table

| Edition / entry state | Guaranteed | Conditional |
|---|---:|---|
| Argentina Apertura participant | 16 | R16/QF/SF/final, one each if reached |
| Copa Argentina participant | `PENDING_DATA` for entry route | one per future reached round |
| LaLiga participant | 38 | `NOT_APPLICABLE` |
| Copa del Rey participant | entry-specific `PENDING_DATA` | every future reached round/tie |
| Libertadores group entrant | 6 | R16 two, QF two, SF two, final one |
| UCL league-phase entrant | 8 | playoff/R16/QF/SF two per reached tie; final one |
| World Cup participant | 3 | one per reached R32/R16/QF/SF/final |

Counts are match equivalents, not fixtures. A two-leg tie contributes two only
after the team reaches it. No future exposure is credited at season start.

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

`midSeasonEnabled: false` is a product policy, not a claim that real mid-season
registration does not exist. Evidence `EV-P0-008`,`009`,`081` provides real
boundary context; V1 intentionally exposes only post-season.

## 5. Consistency and limitations

- all stage IDs resolve to the canonical registry;
- calendar bindings point to the correct closed edition;
- guaranteed and conditional exposure are disjoint;
- market follows full season close;
- no ordinary international date was inferred;
- exact within-stage Q counts remain `PENDING_DATA` where not acquired.

Result: domestic/continental calendar subset is usable as
`NORMALIZED_WITH_LIMITATIONS`; the full Calendar dataset is not
`VALIDATED_CANDIDATE` and is not `FROZEN`.
