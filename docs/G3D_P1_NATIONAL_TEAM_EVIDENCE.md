# G3D-4D P1 National Team Observational Evidence

Status: `NORMALIZED_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Scope: Argentina senior, with external reference data used only where explicitly
labelled. V1 sporting nationality remains Argentina-only. This document
contains observational constraints, not call-up probabilities, latent team
ratings or EngineParameterSet values.

## 1. Contracts preserved

- Eligibility is resolved before selection and consumes no RNG when false.
- `SelectionCompetitionField` remains the G3C core/elite Gaussian mixture.
- Call-up and tournament squad are distinct Bernoulli decisions where the
  competition definition requires both.
- Incumbency remains a logit-space AR(1); empirical transition rates do not set
  its persistence parameter.
- International Role/Minutes reuses the common adapter and remains separate
  from club Role/Minutes.
- `NationalTeamState` retains separate attack, defense and control coordinates;
  no `NationalTeamOverall` is introduced.

## 2. Acquisition populations

| Panel | Coverage | Geography class | Consumer role | Principal limitation |
|---|---|---|---|---|
| FIFA/AFA nominal squads | 2022 World Cup, 2024 Copa preparation/final, 2026 prelist/final | `ARGENTINA_DIRECT` | squad stages, age, strict position, continuity | selected players only |
| World Cup 2022 lineups | seven matches, starts/substitutions | `ARGENTINA_DIRECT` | international exposure and position competition | nominal minutes derived from substitution clock |
| World Cup 2026 official stats | closed tournament | `ARGENTINA_DIRECT` | exact exposure route and current context | live page requires freeze snapshot |
| Argentina result panel | 111 matches, 2018-cutoff | `ARGENTINA_DIRECT` | outcome/context shape | Tier C provider, opponent normalization deferred |
| Argentina-citizenship player proxy | provider last season 2025 | `MULTI_LEAGUE_REFERENCE` | plausible-field scale/tails | incomplete clubs; not eligibility or at-risk denominator |
| FIFA ranking | dated official snapshots | `TOP_NATIONAL_TEAMS_REFERENCE` | relative-strength diagnostic | rank alone is not latent strength |

## 3. Candidate-field evidence and denominator

The observable pipeline is not a single population:

```text
Argentina-eligible footballers (not fully observed)
-> professionally exposed reference population
-> plausible selector field (latent)
-> preparation/preliminary call-up
-> final squad
-> match role and minutes
```

AFA directly observes a 29-player preparation group reduced to a 26-player
Copa America 2024 final squad. The 2026 prelist similarly precedes FIFA's
26-player final squad. These facts support separate call-up and squad stages.
They do not identify the number of players considered privately.

The provider candidate proxy contains 1,099 Argentina-citizenship player rows
in covered clubs. Strict source positions yield 95 GK, 95 CM and 149 ST; 35,
28 and 39 respectively have nonzero international caps. This is useful for
relative scale and tails, but invalid as an absolute call-up denominator because
coverage, citizenship and simulator eligibility differ. Therefore:

| Family | Identifiability |
|---|---|
| Selected-player age/position distribution | `DIRECTLY_ESTIMABLE` after snapshot validation |
| Preparation-to-final squad reduction | `DIRECTLY_ESTIMABLE` for observed editions |
| Plausible field location/scale by position | `INDIRECTLY_IDENTIFIABLE` |
| Core/elite mixture weights and sigmas | `JOINT_CALIBRATION_REQUIRED` |
| Absolute call-up intercept | `JOINT_CALIBRATION_REQUIRED` |
| Private selector considerations | `WEAKLY_IDENTIFIED` |

No empirical number in this section is copied into those parameters.

## 4. Strict GK / CM / ST exposure panel

The World Cup 2022 lineup transform uses the official 26-player roster and the
openfootball lineup/substitution file. Names are Unicode-normalized for the
temporary join. Each normal-time match contributes 90 nominal team minutes and
each extra-time match 120, for 690 total. A starter receives the substitution
minute or match duration; a substitute receives duration minus entry minute.
Stoppage-time annotations are bounded to the regulation period. The output is a
calibration summary, not an official exact-minute ledger.

| Position | Player | Starts | Appearances | Nominal minutes | Share of 690 |
|---|---|---:|---:|---:|---:|
| GK | Emiliano Martinez | 7 | 7 | 690 | 1.000 |
| GK | Franco Armani | 0 | 0 | 0 | 0.000 |
| GK | Geronimo Rulli | 0 | 0 | 0 | 0.000 |
| CM | Rodrigo De Paul | 7 | 7 | 603 | 0.874 |
| CM | Enzo Fernandez | 5 | 7 | 563 | 0.816 |
| CM | Alexis Mac Allister | 6 | 6 | 554 | 0.803 |
| CM | Leandro Paredes | 2 | 5 | 223 | 0.323 |
| CM | Guido Rodriguez | 1 | 1 | 57 | 0.083 |
| CM | Exequiel Palacios | 0 | 3 | 47 | 0.068 |
| ST | Julian Alvarez | 5 | 7 | 466 | 0.675 |
| ST | Lautaro Martinez | 2 | 6 | 239 | 0.346 |

Interpretation:

- GK has three squad slots but fully concentrated realized opportunity in this
  tournament. Slot count is not call-up probability or minutes share.
- CM displays simultaneous core persistence and rotational depth.
- ST displays role turnover with both strictly mapped players receiving
  substantial exposure.
- A single successful tournament cannot identify role intercepts, variance or
  incumbent persistence. It supplies shape and tail constraints.

FIFA's closed 2026 statistics provide the future exact-minute source route; a
versioned snapshot is required before the corresponding dataset can be frozen.

## 5. Incumbency and age evidence

FIFA reports that 17 members of Argentina's 2026 final 26 also belonged to the
2022 champion squad. Combined with the concentrated 2022 exposure panel, this
supports persistent but non-absorbing incumbency. Nine final-squad positions
changed across the same comparison, so incumbency cannot guarantee selection.

The March 2026 ordinary-window squad contained two first-time call-ups, including
a documented opportunity at age 28. This establishes a late tail. It does not
provide a first-call-up age distribution. A reproducible multi-window debut
history with DOB joins remains required before age effects are
`READY_FOR_INITIAL_ESTIMATION`.

## 6. Team strength and outcomes

The cutoff-compatible result panel has:

| Context | Matches | Wins | Draws | Losses | Goals for | Goals against |
|---|---:|---:|---:|---:|---:|---:|
| Friendly | 35 | 29 | 4 | 2 | 100 | 18 |
| World Cup qualification | 35 | 23 | 8 | 4 | 58 | 18 |
| World Cup | 19 | 12 | 3 | 4 | 40 | 25 |
| Copa America | 19 | 13 | 4 | 2 | 28 | 10 |
| Superclasico | 2 | 1 | 0 | 1 | 1 | 1 |
| CONMEBOL-UEFA Cup | 1 | 1 | 0 | 0 | 3 | 0 |
| **Total** | **111** | **79** | **19** | **13** | **230** | **72** |

Official FIFA endpoints validate the World Cup 2022 championship and 2026
final appearance. The aggregate panel preserves competition labels; subsequent
estimation must add opponent/context rather than treating friendlies,
qualifiers and knockout matches as exchangeable.

The following observables are retained separately:

- attacking environment: goals and production by opponent/context;
- defensive environment: goals allowed and outcome by opponent/context;
- control proxies: possession/territorial evidence when a licensed panel is
  acquired, not inferred from win rate;
- relative strength: official ranking as one dated diagnostic;
- generation: squad age/depth/turnover and multi-cycle competitiveness;
- current form: short-window results, never relabelled as generation strength.

No latent attack/defense/control or generation value is assigned.

## 7. Bias, missingness and calibration readiness

- `SELECTION_ON_DEPENDENT_VARIABLE`: official squads and minutes condition on
  already being selected.
- `POSITION_MAPPING_LIMITATION`: broad midfielder is not automatically CM and
  broad forward is not automatically ST.
- `SURVIVORSHIP`: repeated squad observations favor long successful careers.
- `WINDOW_CONTEXT`: tournament, qualifier, friendly and ordinary windows must
  retain distinct opportunity semantics.
- `GENERATION_FORM_CONFOUNDING`: a strong result window alone cannot identify a
  persistent talent cycle.

| Area | Readiness | Reason |
|---|---|---|
| Candidate field | `JOINT_CALIBRATION_REQUIRED` | incomplete non-selected denominator |
| Call-up | `JOINT_CALIBRATION_REQUIRED` | selected histories plus biased proxy only |
| Squad selection | `READY_WITH_LIMITATIONS` | observed preparation/prelist-to-final stages |
| Incumbency | `READY_WITH_LIMITATIONS` | cross-cycle retention and exposure concentration |
| International Role/Minutes | `READY_FOR_INITIAL_ESTIMATION` | strict-position tournament shares; ordinary windows still limited |
| GK competition | `READY_FOR_INITIAL_ESTIMATION` | direct slots and concentrated minutes |
| CM competition | `READY_FOR_INITIAL_ESTIMATION` | strict six-player exposure panel |
| ST competition | `READY_FOR_INITIAL_ESTIMATION` | strict two-player exposure panel |
| Age/experience | `MORE_EVIDENCE_REQUIRED` | late tail observed; debut distribution absent |
| Team strength | `READY_WITH_LIMITATIONS` | results/context available; control/opponent adjustment pending |
| Generation strength | `JOINT_CALIBRATION_REQUIRED` | age/depth/turnover must separate current form |
| International outcomes | `READY_FOR_INITIAL_ESTIMATION` | context-tagged match panel and official major endpoints |

Detailed atomic provenance is in
[G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX.md](G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX.md).
