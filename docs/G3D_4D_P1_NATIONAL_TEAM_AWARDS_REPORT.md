# G3D-4D P1 National Team & Awards Closure Report

Status: `GO_FOR_G3D_4E_WITH_NATIONAL_AWARD_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4D-NATIONAL-AWARDS-OBS-V1`

## 1. Closure result

G3D-4D acquired observational evidence for Argentina senior selection,
international exposure, incumbency, team outcomes and the five frozen V1 Award
slots. It created 38 atomic EvidenceRecords from 21 source routes, promoted
three existing datasets to `NORMALIZED_WITH_LIMITATIONS`, and mapped evidence
to National Team/Awards targets, parameter families and goldens.

No mathematical family, policy, catalog identity, Product Target, parameter
value, scoring point, expected golden output or executable artifact changed.
Argentina remains the sole initial sporting nationality for V1; Data V1 remains
unpublished.

## 2. Evidence inventory

| Dimension | Result |
|---|---|
| EvidenceRecords | 38 (`NT=20`, `AWD=18`) |
| Source routes | 21 (`new=14`, `lineage reuse=7`) |
| Evidence tiers | A=29, B=0, C=9, D=0 |
| Source tiers | A=18, B=0, C=3, D=0 |
| Raw external artifacts committed | 0 |
| New parameter values | 0 |
| Changed Product Targets | 0 of 77 |
| Expected golden outputs | 0 of 139 |

Primary AFA/FIFA/UEFA/LALIGA sources close nominal squads, tournament fields,
winner histories and official statistical facts. Tier C sources are confined to
reproducible result/lineup/candidate proxies and retain their license/coverage
limitations.

## 3. National Team coverage

### Candidate field and squad stages

- Official 2022, 2024 and 2026 Argentina final squads provide direct selected
  observations.
- A 29-player 2024 preparation group and a larger 2026 preliminary list show
  the stage boundary before 26-player final squads.
- The provider proxy adds scale context for strict GK/CM/ST, but incomplete club
  coverage and eligibility semantics make the absolute call-up denominator
  unobservable.
- Candidate core/elite mixture and call-up intercept remain
  `JOINT_CALIBRATION_REQUIRED`.

### Position competition, Role/Minutes and incumbency

The strict World Cup 2022 transform covers 690 team minutes:

- GK: one player received all 690 nominal minutes; two selected GK received 0.
- CM: six strictly mapped players span 47 to 603 nominal minutes.
- ST: two strictly mapped players received 466 and 239 nominal minutes.
- FIFA reports 17 of the 2026 final 26 were retained from the 2022 final squad,
  providing persistent but non-absorbing incumbency evidence.
- A documented first call-up at age 28 establishes a late tail; it does not
  replace the missing multi-window first-call-up age distribution.

### Strength, generation and outcomes

The 111-match Argentina panel retains competition context and has 79 wins, 19
draws and 13 losses. Official FIFA endpoints verify the 2022 title and 2026
final appearance. Ranking is retained only as one relative-strength proxy.
Attack/defense/control, current form and generation strength remain separate;
opponent adjustment and persistent generation identification are future joint
calibration requirements.

## 4. Award coverage

| Slot | Observational advance | Residual limitation |
|---|---|---|
| Ballon d'Or | 30-name 2025 field; seven awarded editions, five unique winners, repeat concentration and position diagnostics | selected extreme tail; full ranks/nominees and judging weights |
| Kopa | 10-name 2025 field; seven editions, six unique winners; observed repeat | cross-award overlap and broader strict-position mapping |
| Yashin | 10-name 2025 field; six editions, four unique winners; two repeat-winner patterns | small-N/cross-era procedure context |
| LALIGA POTY | five-name 2023/24 field/mechanism; official 2025/26 winner and production | 2025/26 human ballot details remain `NOT_PUBLICLY_DOCUMENTED`, nonblocking |
| LALIGA Top Scorer | 2023/24 and 2025/26 winner/runner-up goal tails; Pichichi alias boundary | full multi-season field, minutes/exposure, dispersion and tie incidence |

Comparative and statistical Award evidence remain separate. Official nominee
count does not become latent field size, historical winner frequency does not
become a simulator probability, and no observed prestige becomes scoring
points.

## 5. Parameter identifiability

### Direct observational components for later estimation

- final/preparation squad sizes for observed editions;
- strict international minutes-share distributions;
- selected-player position/age summaries after snapshot validation;
- incumbency transition summaries, not AR persistence itself;
- context-tagged international outcome likelihood;
- official Award field sizes and repeat-winner summaries;
- top-scorer upper-tail observations after extending the full field.

### Joint calibration families

- `nationalTeam.candidate.*`, `selectionField.*`, `callUp.*` and `squad.*`;
- incumbency AR dynamics and international Role adapter;
- attack/defense/control, support, generation and protagonist contribution;
- comparative Award field, position mappings and judging utility;
- statistical NB2 location/dispersion;
- Award Performance/achievement correlations.

### Weakly identified families

- total plausible non-selected Argentina candidate field;
- private selector/manager preferences;
- exact comparative human judging weights/noise;
- lagged reputation effect in comparative voting;
- cross-era Award equivalence.

No family receives a numeric value in this phase.

## 6. Registry and golden changes

- `DS-NATIONAL-SELECTION-HISTORY`, `DS-NATIONAL-COMPETITION-HISTORY` and
  `DS-AWARD-HISTORY` advance to `NORMALIZED_WITH_LIMITATIONS`.
- 19 National Team/Award targets receive observational state metadata; no ID,
  target range, denominator or Product Target changes.
- All 275 parameter templates remain `UNASSIGNED`; only evidence and
  identifiability metadata is added.
- All 17 `GV-NT-*`/`GV-AWD-*` requirements gain
  `empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS`; all remain `SPECIFIED`
  without expected outputs.

## 7. DR reconciliation

- `DR-059` and `DR-060` remain mathematically resolved and advance only in P1
  calibration readiness.
- `DR-025` remains `RESOLVED_DATA_V1_CANDIDATE`; no Award identity or Definition
  changes.
- `DR-048`, `DR-049`, `DR-056` and `DR-068` remain resolved in their prior
  scope. Strict mapping and Argentina-only eligibility are preserved.
- `DR-080`, ADR-077 and ADR-082 are not reopened.

## 8. Bias, licensing and blockers

Material limitations carried forward:

1. selected-only National Team observations and no complete plausible
   non-selected denominator;
2. incomplete longitudinal first-call-up age and ordinary-window exact-minute
   panels;
3. opponent-adjusted control/strength and generation-versus-form separation;
4. dynamic FIFA/LALIGA pages need permitted versioned snapshots before freeze;
5. full multi-edition nominee/rank and scorer fields are incomplete;
6. comparative judging and lagged reputation effects remain weak/joint;
7. provider upstream provenance remains license-review constrained.

These are calibration/freeze limitations, not reasons to invent probabilities
or reopen closed mathematics.

## 9. Readiness matrix

| Area | Result |
|---|---|
| Candidate field | `JOINT_CALIBRATION_REQUIRED` |
| Call-up | `JOINT_CALIBRATION_REQUIRED` |
| Squad selection | `READY_WITH_LIMITATIONS` |
| Incumbency | `READY_WITH_LIMITATIONS` |
| International Role/Minutes | `READY_FOR_INITIAL_ESTIMATION` |
| GK competition | `READY_FOR_INITIAL_ESTIMATION` |
| CM competition | `READY_FOR_INITIAL_ESTIMATION` |
| ST competition | `READY_FOR_INITIAL_ESTIMATION` |
| Age/experience | `MORE_EVIDENCE_REQUIRED` |
| Team strength | `READY_WITH_LIMITATIONS` |
| Generation strength | `JOINT_CALIBRATION_REQUIRED` |
| International outcomes | `READY_FOR_INITIAL_ESTIMATION` |
| Global comparative Award | `READY_WITH_LIMITATIONS` |
| Young Award | `READY_WITH_LIMITATIONS` |
| GK Award | `READY_FOR_INITIAL_ESTIMATION` |
| League POTY | `JOINT_CALIBRATION_REQUIRED` |
| Statistical scorer Award | `READY_WITH_LIMITATIONS` |
| Award repeatability | `READY_FOR_INITIAL_ESTIMATION` |
| Award position effects | `JOINT_CALIBRATION_REQUIRED` |

## 10. Next-phase boundary

Result: **`GO_FOR_G3D_4E_WITH_NATIONAL_AWARD_LIMITATIONS`**.

G3D-4E may acquire Reputation, Social and Retirement observational evidence
under a separate authorization. It must not treat the Award histories here as
Sporting/Public Reputation values. After G3D-4E, the plan requires consolidated
P1 readiness before any ParameterSet value is assigned. This report does not
start either phase.
