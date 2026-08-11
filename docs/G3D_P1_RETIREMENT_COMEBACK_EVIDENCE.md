# G3D-4E P1 Retirement and Comeback Observational Evidence

Status: `NORMALIZED_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Evidence namespace: `EV-P1-RET-*`, `EV-P1-CBK-*`

This artifact applies ADR-079 exactly. Sporting retirement changes
`PlayerPlayingStatus` from `ACTIVE` to `RETIRED` while the Career can remain
open. It is not national-team retirement, temporary inactivity, free agency,
injury, contract end or finalization. No age maximum, retirement threshold,
comeback cooldown, minimum retired duration or automatic finalization is added.

## 1. Observation and censoring contract

The longitudinal observation schema keeps these facts separate:

```text
firstSeniorAppearance
firstMeaningfulSeniorExposure
firstProfessionalRegistration
lastCompetitiveAppearance
lastProfessionalRegistrationOrSeason
retirementAnnouncement
competitiveComebackRegistration
competitiveComebackAppearance
lastObservedAt
censoringState
positionMapping
publicContextCodes[]
```

`careerDurationDefinition` must bind one start fact and one end/censoring rule;
different definitions are never pooled silently. An active player at the cutoff
is `RIGHT_CENSORED`. Uncertain effective retirement between last appearance and
announcement is `INTERVAL_CENSORED`. Lower-tier continuation must be checked
before assigning sporting retirement.

## 2. Retirement age and career duration

| Evidence cohort | N/period | Position coverage | Published result | Primary limitation |
|---|---:|---|---|---|
| English professional survival cohort | 4,117; 1992–2023 | GK vs outfield | normal longevity 12.4y GK, 11.6y outfield | English system; duration is survival estimate, not retirement age |
| same cohort by achieved level | same | all | 14.8y EPL+international vs 6.2y League Two | selection/ability/context association |
| Portuguese retired cohort | selected complete histories | mixed | retirement age 32.70±4.27; 17.51±4.89 professional years | complete-history/survivorship selection |
| German retired cohort | 78 | GK 5, midfield 23, striker 15 plus other roles | career 11.8±4.4y, range 2–20 | small positional cells and elite skew |
| injury-retirement survey | 116 | mixed | career-end age 32.2±4.2y | self-report/recruited cohort |

These summaries preserve ultra-short, standard, long and extreme tails. They
are observational references, not Product Target replacements and not hard
age limits. Direct evidence supports a different GK longevity shape; strict CM
and ST estimates remain insufficient because broad midfield/forward categories
cannot be silently remapped.

## 3. Retirement context taxonomy

Future observation maps public statements or validated cohort labels to:

```text
AGE_DECLINE
HEALTH_INJURY
LOW_ROLE_LOW_EXPOSURE
CONTRACT_MARKET
PERSONAL_MOTIVATION
ACHIEVEMENT_FULFILLMENT
OTHER
UNKNOWN
```

Multiple context codes are allowed. This taxonomy does not claim one true
private cause and does not replace the engine's competing-risk decision. Timing
alone never supplies `PERSONAL_MOTIVATION` or `FULFILLMENT`.

| Source | Published context | Interpretation |
|---|---|---|
| systematic review | involuntary transitions often linked to decline/injury | heterogeneous directional evidence |
| former-player survey N=116 | 62.9% injury; 26.7% age; smaller job/personal shares | respondent labels; acute/chronic kept separate; no universal hazard |
| FIFPRO | 53% of former-player respondents reported forced transition involving injury, contract end or health | multiple answers and mixed contexts; not mutually exclusive cause shares |
| Agüero official case | last match, announcement and public health context | verifies chronology/context only; no private diagnosis inference |

Health evidence can later join G3D-4B; role/market context joins G3D-4A/4C.
None of those links identifies a retirement coefficient in isolation.

## 4. Competitive comeback evidence

A counted comeback requires `RETIRED → ACTIVE` registered competitive
football. Contract signature plus no competitive return is a route failure;
testimonial, legends, charity, coaching and training activity are excluded.

| Case | Gap/context | Competitive-quality evidence | Use |
|---|---|---|---|
| Paul Scholes | returned in January 2012 | later playing-contract extension | verified meaningful return and continuation |
| Arjen Robben | retired 2019, Groningen return summer 2020 | competitive season then re-retirement 2021 | retired-active-retired cycle and gap tail |
| Wojciech Szczęsny | signed from retirement October 2024; debuted January 2025 | 30 appearances, 14 clean sheets, extension to 2027 | GK contract/minutes/meaningful-role route |
| Jens Lehmann | age 41 return during Arsenal GK injury crisis | registered competitive emergency cover | market need/position route tail |

These official cases establish logical accessibility, different routes and
meaningful return quality. They are selected stories with no retired-player
at-risk denominator. They cannot estimate `P(comeback)`, `P(2+)`, `P(3+)` or a
comeback-hazard intercept. The frozen G3D-3D targets (including 3–8%,
0.05–0.30% and 0.001–0.020% bands) are therefore untouched.

## 5. Comeback gap, quality and repeated cycles

- Observed cases establish gaps ranging from months to around one year and show
  that a return can occur at advanced playing age.
- `signed contract`, `competitive appearance`, `minutes`, `meaningful role` and
  `return duration` remain separate quality indicators.
- Scholes/Szczęsny demonstrate sustained competitive return; Robben supplies a
  subsequent re-retirement. None establishes two distinct comebacks by the same
  player.
- Multiple comebacks remain `WEAKLY_IDENTIFIED`; anecdotal lists are rejected as
  a frequency denominator.
- A future cohort must include every retired player observed over a declared
  follow-up window, including no-return observations and right censoring.

## 6. Continuation and finalization boundary

Elapsed time since last competitive appearance and later return/no-return can
inform `ContinuationViability` smoothly. The acquired evidence does not justify
a quarter threshold after which return is impossible.

Real life has no exact observable equivalent to `CareerFinalizationConfirmed`
or manual `FinishCareer`. Therefore:

- finalization opportunity/manual action remains `PRODUCT_DEFINED`;
- an explicit “definitive” announcement is provenance, not automatic Career
  closure;
- non-return through the cutoff is censored evidence, not proof of impossible
  future return;
- non-termination acceptance remains a harness/Product Target diagnostic;
- no auto-finalization or causal hard cap is inferred.

## 7. Position and geography coverage

| Segment | Coverage | State |
|---|---|---|
| GK | English longevity estimate plus Szczęsny/Lehmann comeback cases | `READY_WITH_LIMITATIONS` |
| CM | German broad-midfield cell and outfield longevity; Scholes/Kroos cases | `POSITION_MAPPING_LIMITATION` |
| ST | German striker cell, outfield longevity, Higuaín/Agüero cases | `READY_WITH_LIMITATIONS` but no survival estimate |
| Argentina | Higuaín direct career duration and Agüero national identity context | `ARGENTINA_DIRECT_LIMITED` |
| Spain | Barcelona/Real Madrid official event chronology; no representative cohort | `SPAIN_DIRECT_LIMITED` |
| multileague | English, Portuguese, German and systematic-review evidence | `MULTI_LEAGUE_REFERENCE` |

## 8. Identifiability and calibration readiness

| Family | State | Evidence basis | Remaining gate |
|---|---|---|---|
| retirement-age distribution | `READY_WITH_LIMITATIONS` | several cohorts and preserved censoring | Argentina/Spain representative position panel |
| career-duration distribution | `READY_FOR_INITIAL_ESTIMATION` | survival estimate plus independent cohort summaries | harmonized start definition and geography adapter |
| retirement context | `READY_WITH_LIMITATIONS` | review/surveys/official cases | multi-cause observation model; private causes remain unknown |
| retirement hazard coefficients | `JOINT_CALIBRATION_REQUIRED` | age, level, health and market associations | upstream Development/Health/Role/Market joint likelihood |
| motivation/fulfillment | `WEAKLY_IDENTIFIED` | selected public statements only | Product/synthetic constraints and sensitivity |
| comeback frequency | `MORE_EVIDENCE_REQUIRED` | verified cases but no denominator | representative retired-player cohort |
| comeback gaps/quality | `READY_WITH_LIMITATIONS` | dated official return cases | cohort distribution and right censoring |
| multiple comebacks | `WEAKLY_IDENTIFIED` | no population panel | deep Product Target calibration |
| ContinuationViability | `JOINT_CALIBRATION_REQUIRED` | elapsed-time/no-return concept | censored return cohort plus product tail |
| finalization behavior | `PRODUCT_DEFINED` | no real-world equivalent | frozen G3D-3D manual-finalization targets |

## 9. Dataset and target consequences

`DS-CAREER-RETIREMENT-HISTORY` advances only to
`NORMALIZED_WITH_LIMITATIONS`. Published cohort summaries and public chronology
are retained; no row-level identity dataset or private reason data enters the
repository.

- `CT-RET-AGE-001`, `CT-RET-CAUSE-001` and `CT-RET-TAIL-001` gain summaries.
- `CT-RET-HEALTH-001`, `CT-RET-MARKET-001`, `CT-RET-MOT-001` and
  `CT-RET-SENS-001` gain indirect evidence only.
- `CT-CB-ROUTE-001` and `CT-CB-SUCCESS-001` gain verified event evidence.
- `CT-CB-FREQ-001`, `CT-CB-CYCLE-001` and `CT-FIN-TIME-001` remain blocked from
  observational frequency estimation; their Product Target consumers are
  unchanged.
- All lifecycle invariants and `GV-RET-*`, `GV-CB-*`, `GV-FIN-*` expected
  outputs remain mathematical/parameter dependent and uncomputed.

Sources, licensing and atomic provenance are in the
[source manifest](G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST.md) and
[Evidence Index](G3D_P1_REPUTATION_RETIREMENT_EVIDENCE_INDEX.md).
