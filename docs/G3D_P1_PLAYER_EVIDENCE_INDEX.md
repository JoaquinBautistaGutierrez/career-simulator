# G3D-4A Player Evidence Index

Status: `P1_EVIDENCE_ACQUIRED`

Namespace: `EV-P1-{CRE|DEV|ROLE|PERF}-NNN`

Cutoff: `2026-08-07T23:59:59.999Z`

Retrieved: `2026-08-09`

The namespace is independent from immutable `EV-P0-*` records. IDs are never
renumbered or reused. Every row has `validation=REVIEWED_DERIVATION`,
`reviewerRole=PROVENANCE_REVIEWER`, and cutoff class `PRE_CUTOFF_CLOSED` unless
the row says `TIMELESS_DEFINITION`. `consumers` are CalibrationTarget families,
not permission to set EngineParameterSet values. Every source binding also
inherits the exact `usageClass`, `termsState`, raw/derived redistribution rule
and citation requirement from
[G3D_P1_PLAYER_SOURCE_LICENSE_MANIFEST.md](G3D_P1_PLAYER_SOURCE_LICENSE_MANIFEST.md);
there is no record-level license override.

## 1. Creation

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier / license | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-CRE-001` | The strict multileague panel contains 54,113 player-club-season-position observations and 17,547 players after exact GK/CM/ST mapping. | 14 established first tiers, 2012–2025 where covered; observations/players | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B; derived-candidate/license review | HIGH for panel count; `CT-CRE-POS-001`, `CT-CRE-EQUIV-001` |
| `EV-P1-CRE-002` | First covered first-tier appearance at ages 15–23 has median age 20.42 CM, 20.99 GK and 20.39 ST in the multileague panel. | N=2,784/621/2,825; age in years; coverage-limited | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM; left truncation means this is not professional debut; `CT-CRE-POS-001` |
| `EV-P1-CRE-003` | Changing meaningful-exposure sensitivity from 1 minute to 900 and 1,800 minutes shifts multileague medians later: CM 21.39/21.64, GK 21.64/21.92, ST 21.37/21.69. | N=719/353 CM, 254/174 GK, 598/317 ST; age years | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM; `CT-CRE-POS-001`, `CT-MIN-SHARE-001` |
| `EV-P1-CRE-004` | Spain-only first covered first-tier exposure has medians 20.74 CM, 20.96 GK and 21.01 ST. | N=217/37/185; La Liga panel, 2012–2025 | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | LOW for GK due N=37; `CT-CRE-POS-001` |
| `EV-P1-CRE-005` | LPF reports 185 players debuted in Argentina Primera during 2025. | official annual aggregate; players | `SRC-P1-LPF-DEBUTS-2025`; A; manual public fact | HIGH for count, LOW for age/position inference because absent; `CT-CRE-POS-001` |
| `EV-P1-CRE-006` | Observed age, exposure and production constrain latent creation distributions only indirectly; they do not identify hidden capabilities or traits. | methodological boundary; `TIMELESS_DEFINITION` | `SRC-P1-SCHUCKERS-AGE-BIAS-2021` plus G3C specs; C | HIGH boundary, no numeric estimate; `CT-CRE-CAP-001`, `CT-CRE-TRAIT-001`, `CT-CRE-CORR-001` |

## 2. Development and aging

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier / license | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-DEV-001` | Rey et al. provide longitudinal La Liga evidence from 154 players and 14,092 match observations across eight seasons. | 2012/13–2019/20; player-match observations | `SRC-P1-REY-LALIGA-AGING-2022`; B; cited article | HIGH for published design; no GK; `CT-DEV-DELTA-001`, `CT-DEV-PEAK-001` |
| `EV-P1-DEV-002` | García-Calvo et al. analyze 1,037 La Liga players and 36,883 observations across four seasons, excluding GK and appearances under 10 minutes. | 2015/16–2018/19; player-match observations | `SRC-P1-GARCIA-CALVO-LALIGA-2023`; B; CC BY-SA | HIGH; `CT-DEV-DELTA-001`, `CT-PERF-TASK-001` |
| `EV-P1-DEV-003` | The García-Calvo longitudinal analysis reports age-related physical-performance decline and season-phase effects; the effect is not a universal single peak age. | 1,037 La Liga players, 2015/16–2018/19; physical match measures | `SRC-P1-GARCIA-CALVO-LALIGA-2023`; B | HIGH qualitative evidence; `CT-DEV-PEAK-001`, `CT-DEV-FAMILY-001` |
| `EV-P1-DEV-004` | Spain mean minute share rises from early-age bands then differs materially by position; GK opportunity arrives later, while CM/ST show earlier exposure and strong survivor selection at older ages. | 4,335 strict player-season observations; share of team opportunity | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM; cross-sectional only; `CT-DEV-EXPOSURE-001`, `CT-MIN-POS-001` |
| `EV-P1-DEV-005` | Consecutive-season exposure deltas are heterogeneous: multileague age 18–20 mean change is about +0.035 CM/+0.040 GK/+0.035 ST; age 33–35 is −0.057/−0.080/−0.098, with SD about 0.20–0.33. | N=1,926/1,065/1,501 young; 344/575/373 older; share delta | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM; opportunity change is not capability change; `CT-DEV-DELTA-001`, `CT-DEV-TAIL-001` |
| `EV-P1-DEV-006` | Dendir estimates central performance-rating peak regions around age 25–27, with forwards nearer 25; these are provider-rating constructs and exclude a GK-specific estimate. | top four European leagues, 2010/11–2014/15 | `SRC-P1-DENDIR-PEAK-2016`; B; CC BY-NC/reference-only | MEDIUM; `CT-DEV-PEAK-001` |
| `EV-P1-DEV-007` | Opportunity-conditioned observations create survivorship and selection bias; cross-sectional age means cannot be treated as individual development trajectories. | methodological; `TIMELESS_DEFINITION` | `SRC-P1-SCHUCKERS-AGE-BIAS-2021`; C | HIGH boundary; `CT-DEV-CUM-001`, `CT-DEV-DELTA-001` |

## 3. Role and minutes

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier / license | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-ROLE-001` | Spain has 47,004 strict appearance rows and 4,335 player-club-season-position observations across 5,320 games. | La Liga, seasons 2012–2025; rows/observations | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH for snapshot; `CT-MIN-ACTUAL-001`, `CT-APP-DIST-001` |
| `EV-P1-ROLE-002` | Spain minute-share mean/median is .176/.080 CM, .255/.026 GK and .208/.096 ST. | N=1,766/998/1,571; realized minutes/team opportunity | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH for derived panel; `CT-MIN-SHARE-001` |
| `EV-P1-ROLE-003` | Spain zero-minute share is .127 CM, .433 GK and .099 ST; distributions retain low, central and upper-exposure bands without dropping zero observations. | N=1,766/998/1,571; proportion | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH; `CT-MIN-ZERO-001`, `CT-ROLE-FREQ-001` |
| `EV-P1-ROLE-004` | The source exposes appearances, lineup status and reconstructed starts/substitute participation separately from minutes, permitting non-duplicated diagnostics. | multileague and Spain panels | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM due provider semantics; `CT-APP-DIST-001`, `CT-START-DIST-001` |
| `EV-P1-ROLE-005` | Spain same-club year-to-year minute-share Pearson correlation is .606 CM, .726 GK and .651 ST. | N=778/469/560 pairs; season-to-season share | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH as empirical association, not AR parameter; `CT-ROLE-TRANS-001`, `CT-MIN-CORR-001` |
| `EV-P1-ROLE-006` | After a club change, Spain year-to-year minute-share correlation falls to .300 CM, .210 GK and .394 ST. | N=161/83/217 pairs | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM, especially GK; `CT-ROLE-TRANS-001`, `CT-MIN-CORR-001` |
| `EV-P1-ROLE-007` | Official LPF Data publishes lineups and minutes at player/match level, demonstrating Argentina-compatible semantics, but the acquired report covers only one matchday. | Argentina LPF 2025 Fecha 5; minutes/lineup | `SRC-P1-LPF-DATA-FECHA5-2025`; A; reference-only | HIGH semantics, LOW distribution coverage; `CT-MIN-ACTUAL-001` |

## 4. Performance, production and temporal variability

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier / license | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-PERF-001` | Spain ST with ≥900 minutes have goals/90 mean .408, median .374, SD .211, P95 .808 and P99 1.045; assists/90 mean .134, median .110, zero share .156. | N=500 ST seasons; La Liga 2012–2025 | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH; `CT-ST-GOAL-001`, `CT-ST-AST-001`, `CT-PERF-DIST-001` |
| `EV-P1-PERF-002` | Spain CM season goal counts have mean .574 and variance 1.425; assists mean .719 and variance 2.140, showing empirical overdispersion. | N=1,766 CM seasons; raw season counts | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH for count shape; `CT-CM-COUNT-001`, `CT-PERF-DIST-001` |
| `EV-P1-PERF-003` | The La Liga 2015/16 event reference contains 380 matches and 2,929 strict GK/CM/ST player-match rows after position reconstruction. | 2015/16; matches/player-match rows | `SRC-P1-STATSBOMB-OPEN-DATA-2015-16`; B; noncommercial reference-only | HIGH coverage, license-limited; `CT-PERF-TASK-001` |
| `EV-P1-PERF-004` | Event-reference ST seasons with ≥900 minutes show shots/90 mean 2.570, goals/90 .451, xG/90 .419 and assists/90 .135. | N=38 ST seasons; La Liga 2015/16 | `SRC-P1-STATSBOMB-OPEN-DATA-2015-16`; B | MEDIUM; single season/small N; `CT-PERF-TASK-001`, `CT-ST-CONV-001` |
| `EV-P1-PERF-005` | Strict CM event proxies with ≥900 minutes show completed passes/90 49.76, progressive-completed-pass proxy 13.54, key-pass proxy 1.33, pressures 19.87, interceptions 1.30, recoveries 5.66 and tackles won 1.42. | N=12 CM seasons; La Liga 2015/16 | `SRC-P1-STATSBOMB-OPEN-DATA-2015-16`; B | LOW-to-MEDIUM due N=12 and proxy definitions; `CT-CM-IMPACT-001`, `CT-PERF-TASK-001` |
| `EV-P1-PERF-006` | GK event-reference seasons with ≥900 minutes show saves/90 mean 2.962, goals conceded/90 1.277, shots-on-target-faced proxy 4.238 and full-match clean-sheet proxy .284. | N=23 GK seasons; La Liga 2015/16 | `SRC-P1-STATSBOMB-OPEN-DATA-2015-16`; B | MEDIUM; `CT-GK-SHOTS-001`, `CT-GK-SAVE-001`, `CT-GK-CS-001` |
| `EV-P1-PERF-007` | Event-reference quarter-like adjacent-block correlations are .727 for CM progressive-pass proxy, .099 key-pass, .314 GK shots-faced proxy, .449 ST goals and .471 ST shots. | qualifying adjacent blocks N=34 CM, 57 GK, 88 ST | `SRC-P1-STATSBOMB-OPEN-DATA-2015-16`; B | LOW-to-MEDIUM; mixes opportunity, ability, context and count noise; `CT-PERF-FORM-001`, `CT-PERF-CONS-001` |
| `EV-P1-PERF-008` | Panel calendar-quarter adjacent-block correlations are .158/.129 for Spain CM goals/assists and .237/.115 for Spain ST goals/assists; multileague values remain low-positive. | Spain N=1,035 CM and 1,068 ST qualifying pairs; ≥180 minutes/block | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | MEDIUM; cannot identify latent Form AR alone; `CT-PERF-FORM-001` |
| `EV-P1-PERF-009` | Official LPF Data exposes assists/xA, pass-production and GK-save/clean-sheet semantics compatible with existing Performance dimensions, but one round cannot provide population targets. | Argentina LPF 2025 Fecha 5 | `SRC-P1-LPF-DATA-FECHA5-2025`; A | HIGH semantics, LOW calibration coverage; `CT-CM-IMPACT-001`, `CT-GK-SAVE-001` |
| `EV-P1-PERF-010` | Rate summaries change materially with exposure gating; raw counts and minutes are therefore preserved conceptually and ≥900-minute rates are never substituted for the zero/sparse-exposure population. | Spain player-season panel | `SRC-P1-TRANSFERMARKT-DATASETS-20260805`; B | HIGH; `CT-PERF-EVID-001`, `CT-PERF-DIST-001` |

## 5. Counts and conflicts

- EvidenceRecords: **30** (`CRE=6`, `DEV=7`, `ROLE=7`, `PERF=10`).
- Evidence tier distribution: **A=3, B=25, C=2, D=0**.
- New sources: **10**.
- There are no numeric source conflicts requiring averaging. Apparent differences
  are definition/population differences and are preserved: first appearance vs
  900/1,800-minute emergence; cross-sectional age exposure vs within-player
  change; provider counts vs event proxies.
- `POSITION_MAPPING_UNCERTAIN` rows were excluded from strict-position summaries
  but not silently relabeled. This is a mapping exclusion, not tail winsorization.
- No EvidenceRecord supersedes or mutates `EV-P0-001..EV-P0-081`.
