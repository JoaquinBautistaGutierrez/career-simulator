# G3D Parameter Coupling Map

Status: `AUDITED`

Reference cutoff: `2026-08-07T23:59:59.999Z`

## 1. Purpose

This document defines calibration ownership, causal order and leakage controls. A coupling
group is an optimization boundary, not a new runtime object and not permission to merge
subsystem state. Parameter membership remains authoritative in
[the identifiability matrix](G3D_PARAMETER_IDENTIFIABILITY_MATRIX.md).

## 2. Coupling groups

| Group | Principal parameter branches | Upstream anchors | Direct outputs/targets | Recommended fit | Freeze condition |
|---|---|---|---|---|---|
| `CG-CREATION` | `player.creation.*`, suitability | Product mode contract, position mapping | created capability/trait/power distributions, Quick/Custom | hierarchical likelihood, then constrained SMM | position segments and Quick/Custom pass without using career score as an input |
| `CG-DEVELOPMENT` | `development.*` | Creation, Role exposure, Health load, Club qualities | age/delta/cumulative trajectories | censored hierarchical smooth curves + staged SMM | longitudinal sensitivity and no hard peak/ceiling |
| `CG-ROLE` | `roleMinutes.*` | suitability, club competition, lagged performance, availability, calendar | Role, minute share, appearances, starts | logit-normal/ordinal likelihood + SMM | club/NT separation and exact exposure conservation |
| `CG-PERFORMANCE` | `performance.*` | task abilities, Role/minutes, club/competition, Health | position-specific production/Form | NB2/logistic/hierarchical likelihood | GK/CM/ST and evidence bands accepted before downstream Market/Awards |
| `CG-HEALTH` | `health.*` | Role/minutes, calendar, age, history | incidence, severity, recovery, relapse, availability | exposure likelihood + censored survival + SMM | match/training denominators and six-family tails accepted |
| `CG-CLUB` | `clubWorld.*`, `competitions.*` | P0 definitions, historical/finance/manager observations | club states, manager turnover, competition fields | hierarchical latent state + survival/outcome likelihood | 16-club identities fixed; no ID-based floor |
| `CG-MARKET` | `transfersMarket.*` | lagged Performance/Reputation, ClubNeed, contracts, Money bindings | Interest, Offer, fee, salary, contract, transfer | selected-outcome likelihood + constrained SMM | Interest != Offer; undisclosed != zero; native Money exact |
| `CG-NATIONAL` | `nationalTeam.*` plus Role adapter | eligibility, lagged Performance/Reputation, calendar | call-up, squad, incumbency, minutes, outcomes | hierarchical logistic/AR/outcome SMM | ineligible consumes no RNG; Argentina-only V1 policy intact |
| `CG-AWARDS` | `awards.*` | completed-period Performance/achievements, lagged Reputation, definitions | comparative/statistical placement | ordinal field likelihood + NB2 + SMM | real rules separated from simulator model; no current-award feedback |
| `CG-REPUTATION` | sporting/awareness/attention/sentiment | completed sporting facts | lagged reputation and attention states | measurement model + AR/event study | MarketValue/followers remain proxies, not SportingReputation |
| `CG-SOCIAL` | followers/viral/engagement/reach | lagged reputation/attention, dated platform context | per-platform audience and engagement | hierarchical count/change model + constrained SMM | uint64 exact, loss allowed, no cross-platform blind sum |
| `CG-LIFECYCLE` | `retirementComeback.*` | Development, Health, Role, Market, achievements | retirement, comeback, viability, finalization opportunity | competing risks + survival + Product-constrained SMM | no age cap, cooldown, auto-finalization or reversible finalization |
| `CG-SCORING` | ScoringConfiguration/Data | accepted gameplay facts and cohorts | ledger, PC, tiers | exact transforms then distributional validation | separate scoringVersion/hash; no engine feedback |

## 3. Directed dependency graph

```text
CG-CREATION
  -> CG-DEVELOPMENT
  -> CG-ROLE -> CG-PERFORMANCE
                  |       |
                  v       v (lagged)
               CG-HEALTH  CG-MARKET
                  |       |
                  +--> CG-LIFECYCLE

CG-CLUB -> CG-ROLE / CG-PERFORMANCE / CG-MARKET / CG-NATIONAL
CG-PERFORMANCE -(completed window)-> CG-NATIONAL / CG-AWARDS / CG-REPUTATION
CG-NATIONAL / CG-AWARDS -(completed facts)-> CG-REPUTATION
CG-REPUTATION -(lagged)-> CG-MARKET / CG-NATIONAL / CG-AWARDS / CG-SOCIAL
CG-SOCIAL -(authorized lag only)-> Market diagnostics; never sporting truth
all completed authorized facts -> CG-SCORING (terminal consumer; no return edge)
```

Calibration freezes upstream anchors before fitting a downstream group. Later integrated passes
may reopen a group only by creating a child candidate and rerunning every affected regression
target on the same CalibrationSeedSet.

## 4. Circularity and leakage audit

| Potential loop | State | Required order / invalid use |
|---|---|---|
| Performance ↔ MarketValue | `LAG_REQUIRED` | completed Performance may affect next market state; MarketValue never becomes Performance evidence or hidden quality |
| Reputation ↔ Followers | `LAG_REQUIRED` | prior reputation/attention may affect audience; followers are only dated awareness evidence, never same-step SportingReputation |
| Prestige ↔ Performance | `LAG_REQUIRED` | prior ClubPrestige may contextualize opportunity; player output cannot rewrite same-period Prestige |
| National Team ↔ Reputation | `LAG_REQUIRED` | completed selection/outcome facts create later impulses; current reputation may only enter selection through approved lagged interface |
| Awards ↔ Reputation | `LAG_REQUIRED` | prior reputation may inform judged utility; current award result updates only future state |
| Health ↔ Role | `LAG_REQUIRED` | current availability constrains minutes; realized load/minutes update later Health, never retroactively |
| Scoring → gameplay | `INVALID` | PC, CareerScore, ledger category or tier may not enter any gameplay predictor |
| MarketValue → Selection/Awards | `INVALID` | neither selection nor award utility consumes MarketValue |
| current-Q Performance → same call-up/award | `INVALID` | only closed evidence windows may be consumed |
| abstract external field → nominal fact | `INVALID` | abstract clubs/competitors cannot be champion, employer or counterparty |

## 5. Segmentation and partial pooling

| Dimension | Shared by default | Segment only when | Pooling rule |
|---|---|---|---|
| Position | structural algorithm and transform family | GK/CM/ST mechanics or evidence differ | hierarchical position effects; broad midfielder/forward data cannot become CM/ST direct evidence |
| Region/country | math family | ARG/ESP baselines, finance, platform or calendar context differs | shared global prior + country effect; no raw cross-country pooling |
| Competition | sampler/equation | format, strength, exposure or award definition differs | definition/edition intercept with shrinkage; IJL never substitutes gameplay strength |
| Club | state process family | 16 detailed identities have evidence | hierarchical club effects; no identity floor and no detailed promotion by calibration |
| Injury family/origin | hazard/recovery families | six definitions and match/training evidence require it | family/origin partial pooling; unknown remains unknown |
| Platform/era | social state family | metric semantics or platform maturity changes | platform-era measurement layer; audiences not summed without policy |

Segmentation is added only when the likelihood/targets can identify it or Product explicitly
requires it. Unsupported cells use declared hierarchical shrinkage, not copied neighbor values or
silent defaults.

## 6. Cross-group acceptance

1. Every group passes its direct targets before downstream tuning.
2. A downstream mismatch never authorizes compensating an upstream error.
3. F/G parameters require global sensitivity and alternative plausible priors.
4. Cross-system targets run after each reopened upstream group.
5. Tail correction changes causal calibration or data interpretation, never adds caps.
6. Scoring runs only on immutable fact outputs and remains outside EngineParameterSet.
