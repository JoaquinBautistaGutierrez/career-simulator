# G3D-4C P1 Manager & Stability Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

## 1. Observational event taxonomy

Every future manager transition must resolve to one of:

```text
DISMISSED
RESIGNED
CONTRACT_END
INTERIM_REPLACEMENT
MUTUAL_TERMINATION
UNKNOWN
```

The source match panel only identifies changes in the named manager. Those
changes are `UNKNOWN` until a primary appointment/departure source adjudicates
cause. A manager-name change is not automatically a dismissal.

## 2. Derived detailed-club panel

Consecutive non-empty manager names in domestic league matches form observed
spells. `Changes` is the sum of within-season boundaries; it excludes
cross-season appointment changes. Match count is not calendar tenure.

| Country | Club | Covered seasons | Observed changes | Changes/season | Median spell matches |
|---|---|---:|---:|---:|---:|
| ARG | Argentinos Juniors | 2 | 0 | .00 | 13.5 |
| ARG | Boca Juniors | 2 | 1 | .50 | 11.0 |
| ARG | Estudiantes | 2 | 1 | .50 | 10.0 |
| ARG | Independiente | 2 | 0 | .00 | 13.5 |
| ARG | Racing | 2 | 0 | .00 | 14.0 |
| ARG | River Plate | 2 | 2 | 1.00 | 7.5 |
| ARG | Rosario Central | 2 | 0 | .00 | 14.5 |
| ARG | Vélez | 2 | 4 | 2.00 | 2.5 |
| ESP | Athletic Club | 5 | 0 | .00 | 38.0 |
| ESP | Atlético de Madrid | 5 | 0 | .00 | 38.0 |
| ESP | Barcelona | 5 | 2 | .40 | 38.0 |
| ESP | Girona | 4 | 0 | .00 | 38.0 |
| ESP | Real Madrid | 5 | 1 | .20 | 38.0 |
| ESP | Real Sociedad | 5 | 2 | .40 | 38.0 |
| ESP | Sevilla | 5 | 6 | 1.20 | 12.0 |
| ESP | Villarreal | 5 | 4 | .80 | 25.0 |

Country summaries are .500 observed changes/club-season across 16 Argentina
club-seasons and .385 across 39 Spain club-seasons. Zero-change shares are .750
and .769. These are provider coverage diagnostics, not manager-turnover hazard
parameters.

Historical Argentina evidence is materially different: 420 within-season
terminations across 20 top-flight seasons (1986/87–2005/06), about 21 per season.
The contrast is preserved as period/definition/coverage difference; it is never
averaged with the current detailed-club panel. CIES's 55-league 2026 snapshot
adds global context but not local cause labels.

## 3. Underperformance context

A future hazard estimator requires, at minimum:

1. actual results/exposure before the event;
2. competition/opponent context;
3. a club expectation/reference observable frozen before those results;
4. manager tenure and event cause;
5. institutional/financial context where available.

League position alone is not expectation. Prestige alone is not expectation.
The Argentina academic study supports underperformance/pressure as relevant
observational context but does not authorize copying a causal coefficient.

## 4. Tactical observation

Provider formation strings are retained as source labels only. Across the 16
clubs, captured formation N ranges 23–27 for Argentina and 178–325 for Spain;
distinct strings range 3–9 and 7–17 respectively. Modal shares range .259–.870.

These observations can constrain:

- style persistence;
- manager-change discontinuity;
- attack/defense/control proxy correlations;
- stable/variable tactical contexts.

They do not create gameplay formations, TacticalIdentity values or correlated
normal loadings. Formation availability and provider labeling are themselves
selection/error processes.

## 5. Stability composition

Manager turnover is one input to Stability, not its definition. A future joint
fit must retain separate manager, squad, board, finance and sporting-volatility
signals. Long manager tenure can coexist with financial instability; high squad
turnover can coexist with the same manager.

## 6. Identifiability

| Family | Classification | Evidence / limitation |
|---|---|---|
| manager spell/tenure distribution | `DIRECTLY_ESTIMABLE` after event adjudication | dates/names available; current cause taxonomy absent |
| overall turnover occurrence | `READY_WITH_LIMITATIONS` | historical Argentina and current detailed-club panels differ in period/scope |
| dismissal hazard intercept | `JOINT_CALIBRATION_REQUIRED` | termination cause and at-risk exposure needed |
| underperformance coefficient | `JOINT_CALIBRATION_REQUIRED` | expectation is latent/contextual and must be pre-event |
| board/pressure/finance effects | `WEAKLY_IDENTIFIED` | sparse standardized evidence |
| tactical persistence | `INDIRECTLY_IDENTIFIABLE` | formation/style proxies exist; provider noise |
| correlated ManagerContext loadings | `WEAKLY_IDENTIFIED` | no common validated multivariate panel |
| aggregate Stability | `JOINT_CALIBRATION_REQUIRED` | manager evidence alone is insufficient |

## 7. Provenance

Atomic claims: `EV-P1-MGR-001..006`. No appointment/departure event is assigned
a causal label beyond available evidence, and no AR(1), hazard, correlation or
turnover parameter receives a value.
