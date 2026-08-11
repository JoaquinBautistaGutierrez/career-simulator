# G3D-4E Reputation, Social and Retirement Evidence Index

Status: `P1_EVIDENCE_ACQUIRED`

Namespaces: `EV-P1-REP-NNN`, `EV-P1-SOC-NNN`, `EV-P1-RET-NNN`,
`EV-P1-CBK-NNN`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieved: `2026-08-11`

Every record is an atomic, cutoff-compatible claim with
`validation=REVIEWED_DERIVATION`, reviewer role `PROVENANCE_REVIEWER`, and
licensing inherited from the
[source manifest](G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST.md).
No ID replaces immutable P0 or earlier P1 evidence. Social records include a
platform and observation window; records without a player-level platform are
explicitly event/search references.

## 1. Sporting Reputation and Public Attention

| Evidence ID | Atomic claim / extracted observation | Population, period, platform/unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-REP-001` | SportingReputation is not directly observed by any acquired source; performance, awards, national status, club context and public attention are typed proxies, never interchangeable measurements. | construct-validity boundary; timeless | G3C-9 contract + acquired routes; A | HIGH boundary; `CT-REP-SPORT-001` |
| `EV-P1-REP-002` | In a complete Eredivisie player frame (497 players; 148 Twitter users), goals and playing for a successful club were associated with follower counts, while exposure to the platform and source era constrain interpretation. | Eredivisie, Twitter/followers; published 2019, `observedAt=NOT_PUBLICLY_DOCUMENTED` | `SRC-P1-RS-EREDIVISIE-X`; B | MEDIUM association only; not temporal calibration |
| `EV-P1-REP-003` | World Cup 2022 Instagram observations show major sporting-event exposure can coincide with large, heterogeneous follower changes for players and national teams. | 2022-11-14 through 2022-12-18, Instagram | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM, selected-event sample; `CT-REP-ATTN-001`, `CT-REP-CORR-001` |
| `EV-P1-REP-004` | Event-search evidence exhibits a pre-event baseline, sharp event-period rise and post-event decline, supporting event-study acquisition for attention without identifying a universal player decay parameter. | Olympic event window, Google search index | `SRC-P1-RS-OLYMPIC-SEARCH`; B | MEDIUM reference; `CT-REP-ATTN-001` |
| `EV-P1-REP-005` | Google Trends values are normalized within query, period and geography to 0–100 from a sample; they are not absolute search volumes or a scientific awareness poll. | public search, Google Trends/index | `SRC-P1-RS-GT-FAQ`; A | HIGH semantics; awareness/attention transform |
| `EV-P1-REP-006` | Google Trends `term` and `topic` queries have different identity semantics; any longitudinal footballer query must freeze which one is used. | public search, Google Trends/query identity | `SRC-P1-RS-GT-TOPICS`; A | HIGH; reproducibility gate |
| `EV-P1-REP-007` | A reproducible attention observation requires query identity, platform, geography, period and retrieval date; exported CSV is a route, not a frozen source by itself. | Google Trends, transform contract | `SRC-P1-RS-GT-EXPORT`; A | HIGH; `DS-PUBLIC-ATTENTION-REFERENCE` |
| `EV-P1-REP-008` | No acquired evidence identifies long-lived SportingReputation separately from short-lived attention; its persistence and typed achievement impulses remain joint calibration, and neither followers nor MarketValue is ground truth. | identifiability boundary | sources above; C | HIGH limitation; `CT-REP-SPORT-001`, `CT-REP-CORR-001` |

## 2. Followers, engagement, viral tails and regional reach

| Evidence ID | Atomic claim / extracted observation | Population, period, platform/unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-SOC-001` | YouTube reports `subscribersGained` and `subscribersLost` separately and exposes views, likes, comments and shares as distinct metrics; audience evolution is not normatively monotone. | authorized channel/video windows, YouTube/counts | `SRC-P1-RS-YT-METRICS`; A | HIGH semantics; `CT-SOC-FOLLOW-001`, `CT-SOC-ENG-001` |
| `EV-P1-SOC-002` | TikTok Research API fields separately represent view, like, comment and share counts; they cannot be pooled into an unspecified engagement rate. | authorized public-video queries, TikTok/counts | `SRC-P1-RS-TT-API`; A | HIGH semantics; `CT-SOC-ENG-001` |
| `EV-P1-SOC-003` | A public women-football Instagram sample reports 1,386 mapped players, mean followers 36,312, median 4,000 and standard deviation 273,228, showing a strongly right-skewed cross-section. | June 2021, Instagram/followers | `SRC-P1-RS-WOMEN-IG`; B | MEDIUM shape, not male baseline; `CT-SOC-FOLLOW-001` |
| `EV-P1-SOC-004` | In that reference sample, four accounts exceeded one million followers and about 93% were below 100,000; the extreme tail must be retained rather than winsorized. | June 2021, Instagram/accounts | `SRC-P1-RS-WOMEN-IG-ABSTRACT`; B | MEDIUM tail; `CT-SOC-TAIL-001` |
| `EV-P1-SOC-005` | Reported league medians differ materially (England 11,282; Spain 4,293; France 3,180; Italy 3,004; Germany 2,502), demonstrating league/platform-context heterogeneity. | June 2021, Instagram/followers | `SRC-P1-RS-WOMEN-IG-ABSTRACT`; B | MEDIUM; regional/context segmentation |
| `EV-P1-SOC-006` | The same sample reports likes and comments as separate outcomes (means 2,481 and 34.76; medians 504 and 16), so audience size and engagement cannot share one observed variable. | June 2021; last 12 posts/account, Instagram/interactions | `SRC-P1-RS-WOMEN-IG`; B | MEDIUM; `CT-SOC-ENG-001` |
| `EV-P1-SOC-007` | Nielsen's selected World Cup player accounts ranged from roughly 12.1 million to 518.8 million Instagram followers, documenting a very heavy selected-star tail but not ordinary professionals. | World Cup 2022 selected accounts, Instagram/followers | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM tail; `CT-SOC-TAIL-001` |
| `EV-P1-SOC-008` | Enzo Fernández's published World Cup-window follower growth was 383.47%, while the same source reports a distinct engagement metric of 51.88%. | 2022-11-14 through 2022-12-18, Instagram/% | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM event tail; viral magnitude diagnostics |
| `EV-P1-SOC-009` | Cho Gue-sung's published follower growth was 9,349.75% with engagement 224.36% in that event window, an extreme selected breakout rather than a typical growth draw. | same window, Instagram/% | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM extreme tail; `CT-SOC-TAIL-001` |
| `EV-P1-SOC-010` | Lionel Messi combined a far larger baseline with 6.73% follower growth and 4.30% engagement, showing that proportional growth, absolute scale and engagement rank accounts differently. | same window, Instagram/% | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM; acquisition/engagement separation |
| `EV-P1-SOC-011` | Argentina's national-team account was reported at 10.6 million followers, 34.5% event-window growth, 8.27% engagement and 54.19% fans outside the home country. | World Cup 2022 window, Instagram/% | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM aggregate regional proxy; `CT-REP-REG-001` |
| `EV-P1-SOC-012` | Spain's national-team account was reported at 4.7 million followers, 11.56% growth, 3.01% engagement and 75.83% fans outside the home country in the same methodology. | same window, Instagram/% | `SRC-P1-RS-NIELSEN-WC22`; B | MEDIUM comparison; regional proxy, not player diffusion coefficient |
| `EV-P1-SOC-013` | FIFA documented Tim Payne rising from about 5,000 to more than five million Instagram followers in roughly three weeks during World Cup 2026. | pre-cutoff World Cup 2026, Instagram/followers | `SRC-P1-RS-FIFA-PAYNE`; A | HIGH event facts, single case; viral tail |
| `EV-P1-SOC-014` | FIFA reported roughly six million new followers for Club World Cup digital accounts from tournament start; this is organizer/event cross-platform growth and cannot initialize player acquisition. | Club World Cup 2025, organizer platforms/followers | `SRC-P1-RS-FIFA-CWC25`; A | HIGH fact/LOW player transferability |
| `EV-P1-SOC-015` | NWSL research uses player mentions as attention and finds performance, content and team/personal context contribute differently; mentions are not follower counts or latent sentiment. | source-defined panel, Twitter/mentions; exact `observedAt` not retained in this summary | `SRC-P1-RS-NWSL-ATTENTION`; B | MEDIUM association only; not temporal calibration |
| `EV-P1-SOC-016` | Athlete event-study evidence indicates pre-existing network exposure and baseline audience influence follower/tagging growth around a major event, warning against treating event response as independent of prior scale. | source-defined Laver Cup window, social accounts/growth | `SRC-P1-RS-LAVER-CUP`; B | MEDIUM cross-sport; source window required before temporal use |
| `EV-P1-SOC-017` | Small post-career athlete evidence shows engagement can remain heterogeneous after retirement and can be higher for smaller audiences; retirement does not imply zero public attention. | 16 retired NFL athletes, Instagram/posts; exact `observedAt` not retained in this summary | `SRC-P1-RS-RETIRED-NFL-IG`; B | LOW-MEDIUM association only; not temporal calibration |
| `EV-P1-SOC-018` | No acquired representative male-football longitudinal panel jointly identifies cross-platform follower acquisition, genuine churn, duplicate audiences and platform-era effects. These remain joint/weak, while the product decline target stays unchanged. | observability boundary, all platforms | acquired sources; A | HIGH limitation; `CT-SOC-FOLLOW-001`, regional diffusion |

## 3. Retirement age, duration and context

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-RET-001` | A systematic review included 17 studies and more than 2,200 retired professional footballers; retirement definitions, samples and confounder control varied. | international retired professionals, studies/players | `SRC-P1-RC-SYSTEMATIC-REVIEW`; B | HIGH review scope; `CT-RET-AGE-001`, `CT-RET-CAUSE-001` |
| `EV-P1-RET-002` | The review found involuntary transitions were common and frequently linked to decline or injury, but heterogeneous samples cannot identify one universal competing-hazard coefficient. | same review, qualitative/share synthesis | same; B | MEDIUM; retirement context only |
| `EV-P1-RET-003` | The English career-longevity cohort contains 4,117 male professionals from 1992–2023 and uses survival analysis, preserving right censoring rather than treating active age as retirement age. | English professional system, players/career survival | `SRC-P1-RC-LONGEVITY-ENG`; B | HIGH method; `CT-RET-AGE-001`, duration |
| `EV-P1-RET-004` | Estimated normal career longevity was 11.6 years for outfield players and 12.4 for goalkeepers. | same cohort, years | same; B | HIGH overall/GK reference; position longevity |
| `EV-P1-RET-005` | Career level strongly stratified duration: players with Premier League plus international exposure were estimated at 14.8 years versus 6.2 for League Two. | same cohort, years | same; B | HIGH association; market/role/context joint calibration |
| `EV-P1-RET-006` | A selected Portuguese retired-player sample reports mean retirement age 32.70 years (SD 4.27) and 17.51 professional years (SD 4.89). | retired Portuguese professionals, age/years | `SRC-P1-RC-LAST-WHISTLE`; B | MEDIUM selected sample; age/duration shape |
| `EV-P1-RET-007` | A German retired-player sample (N=78) reports professional career duration 11.8 years (SD 4.4; range 2–20), preserving short and long tails. | retired German professionals, years | `SRC-P1-RC-GERMAN-CAREERS`; B | MEDIUM small elite-skewed sample; duration tails |
| `EV-P1-RET-008` | A former-professional survey (N=116) reports mean career-end age 32.2 years (SD 4.2). | retired professional soccer players, age | `SRC-P1-RC-INJURY-RETIREMENT`; B | MEDIUM selected survey; `CT-RET-AGE-001` |
| `EV-P1-RET-009` | In that survey, 62.9% cited injury (38.8% acute, 24.1% chronic), while nonmedical responses included age 26.7%, another occupation 6.9% and personal reasons 3.4%; these are survey labels, not adjudicated single causes. | N=116, respondent-reported reasons/% | same; B | MEDIUM; `CT-RET-CAUSE-001`, health adapter |
| `EV-P1-RET-010` | FIFPRO reports 53% of surveyed former players described a forced transition involving injury, contract end or health; voluntary respondents could select post-career-wish reasons, so categories are not mutually exclusive hazards. | multi-country survey, former-player subset/% | `SRC-P1-RC-FIFPRO-GAP`; B | MEDIUM; cause/context boundary |
| `EV-P1-RET-011` | Retirement observation must preserve last competitive appearance, last professional registration and announcement as distinct facts; an announcement alone is not an engine state transition. | observational contract | official cases + ADR-079; A | HIGH; lifecycle invariant |
| `EV-P1-RET-012` | Players still active at the reference cutoff are right-censored; temporary inactivity, free agency, national-team retirement and lower-tier continuation are not sporting retirement. | cohort contract at cutoff | longevity method + ADR-079; B | HIGH; dataset transformation |
| `EV-P1-RET-013` | Real Madrid announced Kroos's intended retirement before his final competition period, directly illustrating announcement date versus effective last appearance. | 2024 public career event | `SRC-P1-RC-RM-KROOS`; A | HIGH single case; date semantics |
| `EV-P1-RET-014` | Barcelona's Agüero account separates his last match, retirement announcement and publicly stated health context; no additional diagnosis or private motivation is inferred. | 2021 public career event | `SRC-P1-RC-FCB-AGUERO`; A | HIGH single case; health/context semantics |
| `EV-P1-RET-015` | AFA describes Higuaín's professional career as 17.5 years, providing an Argentina public long-career case but not a local distribution. | Argentina player, public career chronology | `SRC-P1-RC-AFA-HIGUAIN`; A | HIGH fact/LOW distribution; Argentina direct tail |
| `EV-P1-RET-016` | Direct GK longevity support exists in the English cohort; strict CM and ST retirement-duration estimates are not separately available, so broad midfield/forward labels cannot be silently promoted. | position-coverage boundary | retirement sources; B | HIGH limitation; CM/ST remain `POSITION_MAPPING_LIMITATION` |

## 4. Competitive comebacks and post-retirement observability

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-CBK-001` | A V1 comeback requires a retired professional to return to registered competitive football; testimonial, charity, legends, coaching and training appearances are excluded. | observational definition | official return cases + ADR-079; A | HIGH; `CT-CB-FREQ-001`, `CT-CB-SUCCESS-001` |
| `EV-P1-CBK-002` | UEFA documented Paul Scholes returning from retirement to Manchester United in January 2012. | one professional return, date/event | `SRC-P1-CBK-UEFA-SCHOLES`; A | HIGH case; comeback route/gap tail |
| `EV-P1-CBK-003` | UEFA subsequently documented a further playing-contract extension, establishing meaningful continuation rather than a nominal one-match appearance. | same comeback, contract continuation | same; A | HIGH quality case; `CT-CB-SUCCESS-001` |
| `EV-P1-CBK-004` | UEFA's Robben chronology records retirement in 2019, competitive return with Groningen in summer 2020 and re-retirement in 2021. | one retired-active-retired cycle | `SRC-P1-CBK-UEFA-ROBBEN`; A | HIGH case; gap/cycle tail |
| `EV-P1-CBK-005` | Barcelona signed Szczęsny after retirement in October 2024 and documented his competitive debut in January 2025. | goalkeeper comeback, contract and appearance | `SRC-P1-CBK-FCB-SZCZESNY`; A | HIGH; GK comeback route |
| `EV-P1-CBK-006` | Barcelona later reported 30 appearances and 14 clean sheets in 2024/25 and extended the contract to 2027, establishing a meaningful-role return. | same comeback, appearances/season | same; A | HIGH quality case; `CT-CB-SUCCESS-001` |
| `EV-P1-CBK-007` | UEFA documented Arsenal signing 41-year-old goalkeeper Jens Lehmann out of retirement during a goalkeeper injury crisis, evidencing a market/club-need route without identifying its coefficient. | emergency goalkeeper return | `SRC-P1-CBK-UEFA-LEHMANN`; A | HIGH case; Market/ContinuationViability linkage |
| `EV-P1-CBK-008` | No acquired source supplies a representative retired-player denominator for at least one, two or three competitive comebacks. Frequency, multiple cycles and the elapsed-time viability curve remain weak/joint; manual finalization has no real-life observed counterpart. | observability boundary | review and official cases; B | HIGH limitation; `CT-CB-FREQ-001`, `CT-CB-CYCLE-001`, `CT-FIN-TIME-001` |

## 5. Counts, coverage and conflicts

- New EvidenceRecords: **50** (`REP=8`, `SOC=18`, `RET=16`, `CBK=8`).
- Evidence-tier distribution: **A=20, B=29, C=1, D=0**.
- Geographic tags: `ARGENTINA_DIRECT` for one retirement tail and team-account
  reach; `SPAIN_DIRECT` for a club-announced health retirement and the women
  league follower median; otherwise `MULTI_LEAGUE_REFERENCE` or
  `GLOBAL_REFERENCE`.
- Position coverage: GK has direct longevity and comeback-quality evidence;
  CM/ST have only broad outfield/midfield/forward reference and remain mapping
  limited.
- Conflicts: `CONSISTENT_WITH_LIMITATIONS`. Differences arise from population,
  platform, time window, retirement definition and censoring. No material
  observation was averaged across incompatible definitions.
- No observational frequency overwrites a `PT-*` product target. Potential
  tension between anecdotal comebacks and the product frequency targets is
  classified `OBSERVATIONAL_REFERENCE_VS_PRODUCT_TARGET`, with insufficient
  denominator to quantify direction.
