# G3D-4B Health Evidence Index

Status: `P1_EVIDENCE_ACQUIRED`

Namespace: `EV-P1-{INJ|REC|REL|SEQ|LOAD}-NNN`

Cutoff: `2026-08-07T23:59:59.999Z`

Retrieved: `2026-08-10`

The namespace is independent from immutable `EV-P0-*` and G3D-4A Player
records. IDs are never renumbered or reused. All records have
`validation=REVIEWED_DERIVATION`, `reviewerRole=PROVENANCE_REVIEWER`, and cutoff
class `PRE_CUTOFF_CLOSED` unless marked `TIMELESS_DEFINITION`. Licensing is
inherited from [the Health source manifest](G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST.md).

## 1. Incidence, taxonomy and context

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-INJ-001` | A football injury may be recorded as any physical complaint, medical-attention injury or time-loss injury; these definition classes are not interchangeable. | `TIMELESS_DEFINITION` | `SRC-P1-HLT-FULLER-CONSENSUS-2006`; A | HIGH; all Health targets |
| `EV-P1-INJ-002` | Match and training exposure have separate consensus definitions and incidence should normally be reported per 1,000 player-hours with both origins shown separately. | `TIMELESS_DEFINITION` | same; A | HIGH; `CT-INJ-FREQ-001`, `CT-INJ-LOAD-001` |
| `EV-P1-INJ-003` | Consensus time-loss bins are slight 0 days, minimal 1–3, mild 4–7, moderate 8–28 and severe >28 days, plus career-ending; they are observed bins, not engine severity thresholds. | `TIMELESS_DEFINITION` | same; A | HIGH; `CT-INJ-SEV-001`, `CT-REC-DUR-001` |
| `EV-P1-INJ-004` | A 44-study professional-male meta-analysis reports pooled overall incidence 8.1/1,000h, match 36/1,000h and training 3.7/1,000h. | professional men; pooled studies; injuries/1,000h | `SRC-P1-HLT-META-2020`; B | HIGH for broad reference, heterogeneous definitions; `CT-INJ-FREQ-001` |
| `EV-P1-INJ-005` | The same meta-analysis reports lower-extremity incidence 6.8/1,000h and muscle/tendon incidence 4.6/1,000h; minor 1–3-day injuries were most common. | pooled professional men | same; B | HIGH broad family shape; `CT-INJ-MIX-001`, `CT-INJ-SEV-001` |
| `EV-P1-INJ-006` | UEFA 18-season surveillance recorded 11,820 injuries in 1,784,281h: overall 6.6/1,000h (95% CI 6.5–6.7), match 23.8 and training 3.4. | 49 teams, 265 team-seasons | `SRC-P1-HLT-UEFA-18Y-2021`; B | HIGH; `CT-INJ-FREQ-001`, `CT-INJ-LOAD-001` |
| `EV-P1-INJ-007` | In that UEFA cohort, 6,785 injuries occurred in matches and 5,035 in training; muscle and ligament injuries together comprised 57% of all injuries. | same cohort; counts/share | same; B | HIGH; `CT-INJ-MIX-001` |
| `EV-P1-INJ-008` | Argentina-direct prospective evidence reports 3.67 injuries/1,000h overall (95% CI 2.6–4.6), 26.42 in matches and 1.91 in training. | 195 players, six second-division clubs, 2022 | `SRC-P1-HLT-ARGENTINA-2025`; B | MEDIUM-HIGH; second division and one season; `CT-INJ-FREQ-001` |
| `EV-P1-INJ-009` | The Argentina cohort identifies hamstring, adductor and lateral ankle ligament injuries as the common types and ACL as the greatest time-loss burden. | same cohort; qualitative rank/burden | same; B | MEDIUM; `CT-INJ-MIX-001`, `CT-INJ-TAIL-001` |
| `EV-P1-INJ-010` | Spain-direct one-season surveillance reports 2,184 injuries over 244,835h, incidence 8.94/1,000h. | Spanish professional football, one season | `SRC-P1-HLT-SPAIN-SEASON-2012`; B | MEDIUM; older aggregate without reusable position panel; `CT-INJ-FREQ-001` |
| `EV-P1-INJ-011` | UEFA hamstring surveillance recorded 2,636 injuries in 2,131,561h; match incidence 4.99/1,000h versus training 0.52 (RR 9.67, 95% CI 8.93–10.47). | 54 teams, 21 seasons | `SRC-P1-HLT-HAMSTRING-2023`; B | HIGH lower-limb muscle subset; `CT-INJ-MIX-001`, `CT-INJ-LOAD-001` |
| `EV-P1-INJ-012` | Hip/groin UEFA surveillance reports total incidence 1.1/1,000h, match 3.5 and training 0.6; adductor (n=399) and iliopsoas (n=52) were the leading diagnostic entities. | 23 clubs, 88 club-seasons, 2001/02–2007/08 | `SRC-P1-HLT-GROIN-2009`; B | HIGH family evidence; diagnoses require family mapping; `CT-INJ-MIX-001` |
| `EV-P1-INJ-013` | For 1,754 index groin-adductor cases, mean absence was 13.5 days, median 8, IQR 4–15, P10–P90 2–27 and reported reinjury rate 17.7%. | professional male cohorts, 2001–2017 | `SRC-P1-HLT-RTP-2020`; B | HIGH; `CT-INJ-SEV-001`, `CT-REC-DUR-001`, `CT-REL-FREQ-001` |
| `EV-P1-INJ-014` | For 1,260 index lateral ankle ligament injuries, mean absence was 14.9 days, median 8, IQR 4–18, P10–P90 2–32 and reported reinjury rate 13.7%. | same | same; B | HIGH; same target families |
| `EV-P1-INJ-015` | Lateral ankle meta-analysis estimates recurrence 17.11% (95% CI 13.31–20.92) and descriptive time loss around 15 days, with high time-loss heterogeneity (`I²=93%`). | 13 recurrence and 12 time-loss studies | `SRC-P1-HLT-ANKLE-META-2022`; B | HIGH recurrence, MEDIUM duration transferability; `CT-REL-FREQ-001`, `CT-REC-DUR-001` |
| `EV-P1-INJ-016` | For 760 index knee MCL injuries, mean absence was 24.6 days, median 16, IQR 7–35.5, P10–P90 3–56 and reinjury rate 10.3%. | professional male cohorts, 2001–2017 | `SRC-P1-HLT-RTP-2020`; B | HIGH aggregated knee-ligament evidence; `CT-INJ-SEV-001`, `CT-REC-DUR-001` |
| `EV-P1-INJ-017` | ACL rupture is a rare severe tail: median absence 205 days (95% CI 198–218), while 25/183 cases exceeded 270 days in the return-to-play cohort. | professional male cohorts | same; B | HIGH tail evidence; `CT-INJ-TAIL-001`, `CT-REC-DUR-001` |
| `EV-P1-INJ-018` | Hand/wrist/forearm time-loss injuries were 238/25,462 (0.9%), incidence 0.065/1,000h; 98.7% were acute traumatic and 58.8% fractures. | 6,754 players, 558 team-seasons, 2001–2019 | `SRC-P1-HLT-UPPER-2021`; B | HIGH for mapped upper-limb subset; `CT-INJ-MIX-001` |
| `EV-P1-INJ-019` | Goalkeeper incidence for hand/wrist/forearm was 0.265/1,000h versus 0.038 for outfield players (RR 7.0, 95% CI 5.4–9.0); mean layoff was 23 versus 15 days. | same cohort | same; B | HIGH GK contrast; `CT-INJ-MIX-001`, `CT-REC-DUR-001` |
| `EV-P1-INJ-020` | Professional goalkeeper surveillance also found lower overall/training and lower-limb rates than field players but higher upper-body incidence; it does not separate CM from ST. | Qatar first division, 527 players/49 GK, 2008–2011 | `SRC-P1-HLT-GK-QATAR-2013`; B | MEDIUM-HIGH; `POSITION_MAPPING_LIMITATION`; `CT-INJ-MIX-001` |
| `EV-P1-INJ-021` | In the return-to-play cohort, 235 concussions had mean absence 8.7 days, median 5, IQR 4–8 and P10–P90 2–14; observed time loss may reflect detection/protocol era rather than biological recovery alone. | professional male cohorts, 2001–2017 | `SRC-P1-HLT-RTP-2020`; B | MEDIUM; `CT-INJ-SEV-001`, `CT-REC-DUR-001` |
| `EV-P1-INJ-022` | Prospective medical-staff surveillance in Norwegian male professional football was estimated to underreport time-loss injuries by at least one fifth. | professional male football | `SRC-P1-HLT-REPORTING-2010`; B | HIGH reporting-bias warning; all incidence consumers |
| `EV-P1-INJ-023` | Older-than-cohort-mean players had higher calf-muscle injury rate (HR 1.93, 95% CI 1.38–2.71), while no age association appeared in the other three muscle groups; this does not support a universal linear or threshold age effect. | 2,123 professional lower-extremity muscle injuries | `SRC-P1-HLT-MUSCLE-RISK-2013`; B | HIGH association, MEDIUM transferability; `CT-INJ-LOAD-001`, age-context diagnostics |
| `EV-P1-INJ-024` | Goalkeepers had lower rates in adductor, hamstring, quadriceps and calf groups in the muscle-risk cohort; the publication does not identify CM versus ST coefficients. | professional European male football | same; B | HIGH GK direction, `POSITION_MAPPING_LIMITATION`; `CT-INJ-MIX-001` |
| `EV-P1-INJ-025` | English professional surveillance recorded 327 diagnosed concussions; they represented 2% of men's domestic and 3% of men's international injuries and were more likely in matches than training in the reported strata. | domestic 2013–2022; international 2012–2022 | `SRC-P1-HLT-CONCUSSION-2025`; B | MEDIUM-HIGH; detection/protocol dependent; `CT-INJ-MIX-001`, `CT-INJ-SEV-001` |

## 2. Recovery and availability

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-REC-001` | The 16-year RTP study covers 22,942 injuries across 494 team-seasons; the 31 most common diagnoses account for 78% of reported injuries. | professional male cohorts, 2001–2017 | `SRC-P1-HLT-RTP-2020`; B | HIGH; `CT-REC-DUR-001`, `CT-INJ-AVAIL-001` |
| `EV-P1-REC-002` | Within those common diagnoses, 42% of cases were mild (median ≤7 days), 56% moderate (7–28 days), and 2% severe (>28-day median diagnosis). | 15,269 common-diagnosis cases | same; B | HIGH for observed bin mix; `CT-INJ-SEV-001` |
| `EV-P1-REC-003` | Structural hamstring injuries (n=2,379) had mean 18.0 days, median 13, IQR 7–22 and P10–P90 4–36; mean materially exceeds median, preserving a right tail. | same | same; B | HIGH; `CT-REC-DUR-001`, `CT-INJ-TAIL-001` |
| `EV-P1-REC-004` | Mean absence after reinjury was significantly longer than index absence for Achilles, calf, groin-adductor, functional/structural hamstring and structural quadriceps diagnoses. | same | same; B | HIGH; `CT-REC-DUR-001`, `CT-INJ-HIST-001` |
| `EV-P1-REC-005` | After ACL reconstruction, a matched cohort reports mean RTP 216±109 days and 26±18 games; participation/performance was lower for two seasons before generally recovering by season three, except attackers in that sample. | 51 injured elite players, 1999–2019 | `SRC-P1-HLT-ACL-RTP-2021`; B | MEDIUM; public-record design and position grouping; `CT-SEQ-BURDEN-001`, `CT-INJ-AVAIL-001` |
| `EV-P1-REC-006` | Upper-limb distributions are right-skewed: hand/wrist/forearm median layoff 10 days versus mean 19, and one fifth were severe (>28 days). | 238 injuries, 2001–2019 | `SRC-P1-HLT-UPPER-2021`; B | HIGH for mapped subset; `CT-REC-DUR-001`, `CT-INJ-TAIL-001` |
| `EV-P1-REC-007` | Consensus severity ends at full team training and availability for match selection; return to training, return to play and return to prior performance are different observational endpoints. | `TIMELESS_DEFINITION` plus cohorts | `SRC-P1-HLT-FULLER-CONSENSUS-2006`; A | HIGH boundary; `CT-INJ-AVAIL-001`, `CT-REC-SENS-001` |
| `EV-P1-REC-008` | Ongoing injuries, study-end exits and career-ending cases require explicit censoring/terminal handling; treating them as completed durations biases the recovery tail. | `TIMELESS_DEFINITION` | same; A | HIGH; `CT-REC-DUR-001`, `CT-INJ-TAIL-001` |

## 3. Relapse and prior-injury history

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-REL-001` | Consensus recurrence means same type and same site after return to full participation; early ≤2 months, late 2–12 months and delayed >12 months are recording classes, not an engine fixed window. | `TIMELESS_DEFINITION` | `SRC-P1-HLT-FULLER-CONSENSUS-2006`; A | HIGH; `CT-REL-FREQ-001`, `CT-REL-DECAY-001` |
| `EV-P1-REL-002` | In 21-season hamstring surveillance, 475/2,636 (18%) were recurrences and 325/475 (69%) occurred within two months after return to play. | elite professional male football | `SRC-P1-HLT-HAMSTRING-2023`; B | HIGH; `CT-REL-FREQ-001`, `CT-REL-DECAY-001` |
| `EV-P1-REL-003` | Previous identical injury in the prior season was associated with higher rates for adductor (HR 1.40), hamstring (1.40), quadriceps (3.10) and calf (2.33) injury. | 2,123 lower-extremity muscle injuries | `SRC-P1-HLT-MUSCLE-RISK-2013`; B | HIGH association, not causal coefficient; `CT-INJ-HIST-001` |
| `EV-P1-REL-004` | After ACL reconstruction, 21/118 players (17.8%) sustained a second ACL injury: 11 ipsilateral and 10 contralateral; a contralateral event cannot be relabeled same-site relapse. | median follow-up 4.3 years | `SRC-P1-HLT-ACL-2021`; B | HIGH; `CT-REL-FREQ-001`, `CT-INJ-HIST-001` |
| `EV-P1-REL-005` | Across the seven-season UEFA pattern study, reinjuries were 12% of injuries and caused longer mean absence than non-reinjuries (24 vs 18 days). | 4,483 injuries/566,000h | `SRC-P1-HLT-UEFA-PATTERNS-2011`; B | HIGH broad reference; `CT-REL-FREQ-001`, `CT-REC-DUR-001` |

## 4. Sequela and return-to-performance evidence

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-SEQ-001` | ACL cohorts show prolonged participation/performance effects after medical RTP but substantial eventual recovery; the observable cannot identify a universal permanent capability loss. | elite professional male players | `SRC-P1-HLT-ACL-RTP-2021`; B | MEDIUM; `CT-SEQ-FREQ-001`, `CT-SEQ-BURDEN-001`, `CT-SEQ-DUR-001` |
| `EV-P1-SEQ-002` | Professional upper-limb surveillance documents possible persistent functional complications, but rare diagnoses and no standardized post-return follow-up prevent estimating V1 sequela occurrence/type/burden directly. | 238 injuries; long prospective coverage | `SRC-P1-HLT-UPPER-2021`; B | MEDIUM qualitative; all `CT-SEQ-*` remain weakly identified |

## 5. Load, congestion, age and position

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-LOAD-001` | League matches with ≤4 recovery days had higher total injury rate than ≥6 days (RR 1.09, 95% CI 1.00–1.18) and higher muscle injury rate (RR 1.32, 95% CI 1.15–1.51). | 27 teams, 11 seasons | `SRC-P1-HLT-CONGESTION-2013`; B | HIGH association; `CT-INJ-LOAD-001`, `CT-HLT-FAT-001` |
| `EV-P1-LOAD-002` | A professional-male systematic review finds short congestion may increase match injury incidence, but GPS associations are inconclusive and no universal minimum-risk ACWR threshold is supported. | reviewed professional studies | `SRC-P1-HLT-LOAD-REVIEW-2022`; B | HIGH methodological synthesis; `CT-HLT-LOAD-001`, `CT-INJ-LOAD-001` |
| `EV-P1-LOAD-003` | ACWR has unresolved causal and ratio-statistic problems; observed ACWR bands must not be copied into deterministic thresholds or engine coefficients. | `TIMELESS_DEFINITION`; methodological | `SRC-P1-HLT-ACWR-CRITIQUE-2020`; C | HIGH caution; load/fatigue families remain joint calibration |

## 6. Counts, coverage and conflicts

- EvidenceRecords: **43** (`INJ=25`, `REC=8`, `REL=5`, `SEQ=2`, `LOAD=3`).
- Evidence tier distribution: **A=6, B=36, C=1, D=0**.
- New sources: **20**.
- Geography: `ARGENTINA_DIRECT` has one prospective second-division season;
  `SPAIN_DIRECT` has an older one-season aggregate; UEFA/multileague evidence is
  the primary calibration reference and never silently becomes local baseline.
- Position: GK has direct upper-limb and lower-limb contrast. Published field-
  player groupings do not identify CM vs ST; those claims remain
  `POSITION_MAPPING_LIMITATION` rather than being relabeled.
- Apparent rate conflicts are preserved as population/period/definition
  differences. No rates were averaged across sources.
- No EvidenceRecord modifies `EV-P0-001..101` or G3D-4A evidence.
