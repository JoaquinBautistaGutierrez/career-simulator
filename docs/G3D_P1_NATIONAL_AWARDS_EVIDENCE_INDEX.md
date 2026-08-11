# G3D-4D National Team and Awards Evidence Index

Status: `P1_EVIDENCE_ACQUIRED`

Namespaces: `EV-P1-NT-NNN`, `EV-P1-AWD-NNN`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieved: `2026-08-11`

Every record is an atomic, cutoff-compatible claim with
`validation=REVIEWED_DERIVATION`, reviewer role `PROVENANCE_REVIEWER`, and
licensing inherited from the
[source manifest](G3D_P1_NATIONAL_AWARDS_SOURCE_LICENSE_MANIFEST.md). These IDs
do not replace immutable P0 or earlier P1 records.

## 1. Argentina candidate field, squads and call-ups

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-NT-001` | Argentina's official Qatar 2022 final squad contains 26 players and preserves DOB, broad position, club and pre-tournament cap fields. | Argentina senior, World Cup 2022, players | `SRC-P1-NA-FIFA-SQUAD-2022`; A | HIGH; `CT-NT-SQUAD-001`, `CT-NT-CALL-001`, age diagnostics |
| `EV-P1-NT-002` | AFA documented 29 players in the June 2024 preparation group and 26 in the closed Copa America tournament squad. | Argentina senior, preparation-to-tournament selection | `SRC-P1-NA-AFA-COPA-2024`; A | HIGH; `CT-NT-SQUAD-001`, selection-stage diagnostics |
| `EV-P1-NT-003` | AFA published a larger preliminary World Cup 2026 list before FIFA's official 26-player final squad; preselection and final-squad membership are distinct observed stages. | Argentina senior, World Cup 2026 | `SRC-P1-NA-AFA-PRELIST-2026`, `SRC-P1-NA-FIFA-SQUAD-2026`; A | HIGH stage semantics; `CT-NT-SQUAD-001` |
| `EV-P1-NT-004` | FIFA's 2026 final-squad account states that 17 of the 26 selected players were retained from the 2022 champion squad and nine were new to that final-squad comparison. | final squad to final squad, four-year transition | `SRC-P1-NA-FIFA-SQUAD-2026`; A | HIGH; `CT-NT-INC-001`, `CT-NT-GEN-001` |
| `EV-P1-NT-005` | A March 2026 Argentina call-up included two first-time senior call-ups; Gabriel Rojas received the opportunity at age 28, establishing a documented late first-call-up tail. | ordinary window, first-call-up event | `SRC-P1-NA-FIFA-FIRSTCALL-2026`; A | HIGH event, LOW distribution; `CT-NT-CALL-001`, `CT-NT-TAIL-001` |
| `EV-P1-NT-006` | Strict G3C mapping of the official 2022 final squad identifies 3 GK, 6 CM and 2 ST; broad FIFA `MF`/`FW` entries outside those strict definitions remain unassigned rather than coerced. | 26 selected players; strict GK/CM/ST groups | FIFA squad + mapping contract; A | HIGH mapping for named roles, explicit coverage limitation; position targets |
| `EV-P1-NT-007` | In a reproducible provider panel at last season 2025, 1,099 Argentina-citizenship rows appear in covered clubs; strict mapping yields 95 GK, 95 CM and 149 ST. | provider-covered active-player proxy, count | `SRC-P1-CM-TM-DATASET`; C | MEDIUM proxy, LOW denominator completeness; `CT-NT-FIELD-001` |
| `EV-P1-NT-008` | Within that strict provider proxy, 35 GK, 28 CM and 39 ST have a nonzero senior-international-cap field. | same provider panel; players | same; C | MEDIUM selected-history proxy; `CT-NT-FIELD-001`, `CT-NT-CALL-001` |
| `EV-P1-NT-009` | The provider universe excludes uncovered clubs and citizenship is not the simulator eligibility resolver; neither 1,099 nor 339 strict-position rows is a valid denominator for absolute `P(call-up)`. | observability boundary | same; C | HIGH limitation; call-up intercept and field mixture remain joint calibration |
| `EV-P1-NT-010` | FIFA calendar windows define opportunities to convene a squad; they do not guarantee a fixture, a call-up, final-squad membership, Role or minutes. | men's IMC 2025-2030 | `SRC-FIFA-MENS-IMC-2025-2030`; A | HIGH; calendar adapter and lag invariants |

## 2. International Role, minutes, position competition and incumbency

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-NT-011` | Argentina's seven Qatar 2022 matches provide 690 nominal team minutes after retaining both extra-time matches; lineup/substitution derivation gives player starts, appearances and nominal minutes without stoppage-time inflation. | World Cup 2022, seven matches | `SRC-P1-NA-OPENWC22`; C | MEDIUM-HIGH shape; `CT-NT-MIN-001`, position competition |
| `EV-P1-NT-012` | Emiliano Martinez recorded 7 starts, 7 appearances and all 690 nominal minutes; the other two selected GK recorded zero, showing concentrated realized GK opportunity. | strict GK, World Cup 2022 | same; C, official roster cross-check | HIGH concentration, single tournament; GK competition diagnostics |
| `EV-P1-NT-013` | Strict CM totals were De Paul 7/7/603, Mac Allister 6/6/554, Fernandez 5/7/563, Paredes 2/5/223, Guido Rodriguez 1/1/57 and Palacios 0/3/47 (starts/appearances/nominal minutes). | strict CM, World Cup 2022 | same; C | MEDIUM-HIGH; CM Role/Minutes distribution diagnostics |
| `EV-P1-NT-014` | Strict ST totals were Julian Alvarez 5/7/466 and Lautaro Martinez 2/6/239 (starts/appearances/nominal minutes). | strict ST, World Cup 2022 | same; C | MEDIUM-HIGH; ST competition/Role diagnostics |
| `EV-P1-NT-015` | The 17-of-26 final-squad retention across 2022 to 2026 and the World Cup 2022 start/minute concentration jointly demonstrate selection and exposure persistence, but do not identify the incumbency logit-AR(1) coefficient. | cross-cycle squad plus tournament exposure | official FIFA + derived lineup panel; A/C | HIGH boundary; `CT-NT-INC-001` |
| `EV-P1-NT-016` | FIFA's 2026 official statistics expose exact player-minute routes and show high tournament exposure for recurring core players; dynamic statistics require an edition snapshot before freeze. | World Cup 2026 | `SRC-P1-NA-FIFA-STATS-2026`; A | HIGH source route, MEDIUM frozen reproducibility; `CT-NT-MIN-001` |

## 3. Team strength, generation and outcomes

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-NT-017` | The cutoff-filtered open result panel contains 111 Argentina matches from 2018-01-01 through the cutoff: 79 wins, 19 draws, 13 losses, 230 goals for and 72 against. | Argentina senior, match results | `SRC-P1-NA-OPENRESULTS`; C | MEDIUM-HIGH aggregate; `CT-NT-STRENGTH-001`, `CT-NT-OUTCOME-001` |
| `EV-P1-NT-018` | Context split is Friendly 35 (29-4-2), World Cup qualifying 35 (23-8-4), World Cup 19 (12-3-4), Copa America 19 (13-4-2), Superclasico 2 (1-0-1) and CONMEBOL-UEFA Cup 1 (1-0-0). | matches by source tournament label | same; C | MEDIUM; context must remain segmented, not pooled as equivalent |
| `EV-P1-NT-019` | Official endpoints confirm Argentina won World Cup 2022 and reached the World Cup 2026 final; these progression facts validate major outcome tails without assigning a title probability or PSN value. | major tournaments | `SRC-P1-NA-FIFA-OUTCOMES`; A | HIGH; `CT-NT-OUTCOME-001`, `CT-NT-TAIL-001` |
| `EV-P1-NT-020` | Ranking, results, goals, opponent/context, squad turnover and age composition are complementary proxies. No single rank or current-form window identifies attack/defense/control or persistent generation strength. | identifiability assessment | official/routable sources above; A/C | HIGH boundary; `CT-NT-STRENGTH-001`, `CT-NT-GEN-001` |

## 4. Comparative awards

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-AWD-001` | The frozen five slots remain Ballon d'Or men, Kopa men, LALIGA Player of the Season, LALIGA Top Scorer and Yashin; no new award identity is introduced. | V1 award catalog | P0 candidates/sources; A | HIGH invariant; Award definitions and goldens |
| `EV-P1-AWD-002` | Official 2025 nomination fields contain 30 Ballon d'Or men candidates, 10 Kopa candidates and 10 Yashin candidates. | 2025 closed editions, nominees | `SRC-UEFA-BALLON-NOMINEES-2025`; A | HIGH; `CT-AWD-FIELD-001` |
| `EV-P1-AWD-003` | Across awarded Ballon d'Or editions 2018-2025, excluding the cancelled 2020 edition, seven awards produced five unique winners; Messi won three. | seven awarded editions; winner concentration | `SRC-P1-AWD-UEFA-BALLON-HISTORY`; A | HIGH facts, SMALL-N calibration; `CT-AWD-REPEAT-001`, `CT-AWD-WIN-001` |
| `EV-P1-AWD-004` | Strict/contextual mapping of those seven winners yields no GK winner, two CM-like winners (Modric, Rodri) and five forward/ST-like winners; ambiguous forward roles remain `POSITION_MAPPING_LIMITATION`, not strict ST truth. | winner-position diagnostic | same; A | MEDIUM mapping; `CT-AWD-POS-001` |
| `EV-P1-AWD-005` | Kopa editions 2018-2025 excluding 2020 produced seven awards and six unique winners; Lamine Yamal won in 2024 and 2025. | young comparative award, seven editions | `SRC-P1-AWD-UEFA-LAUREATES`; A | HIGH; `CT-AWD-REPEAT-001`, young-field tail |
| `EV-P1-AWD-006` | Kopa winners span defender, CM-like and forward roles; strict GK/CM/ST calibration cannot coerce every historical role into one of the three slice positions. | seven winners | same; A | MEDIUM mapping; `CT-AWD-POS-001` |
| `EV-P1-AWD-007` | Yashin editions 2019-2025 excluding 2020 produced six awards and four unique winners; Emiliano Martinez repeated in 2023-2024 and Donnarumma won in 2021 and 2025. | GK positional award, six editions | same; A | HIGH; GK path and repeatability diagnostics |
| `EV-P1-AWD-008` | LALIGA's 2023/24 POTY publication named five candidates and described a combined fan, club-captain and expert choice. | league comparative award, 2023/24 | `SRC-P1-AWD-LALIGA-POTY-2023-24`; A | HIGH for edition, not continuity; `CT-AWD-FIELD-001` |
| `EV-P1-AWD-009` | Lamine Yamal is the official 2025/26 LALIGA Player of the Season; LALIGA reports 16 league goals and 12 assists in the winner account. | league comparative winner, 2025/26 | `SRC-LALIGA-POTY-2025-26`; A | HIGH; `CT-AWD-PERF-001` |
| `EV-P1-AWD-010` | The public 2025/26 POTY source does not publish a complete candidate ballot/tie mechanism. This is `NOT_PUBLICLY_DOCUMENTED` and nonblocking because V1 consumes identity, eligibility window and the comparative simulation model, not literal human ballots. | procedure availability | same + P0 closure; A | HIGH limitation; comparative weights remain joint calibration |

## 5. Statistical award and cross-award behavior

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-AWD-011` | The official 2025/26 LALIGA scorer table records Mbappe first with 25 and Muriqi second with 23 in the closed-edition capture used by P0. | top two, league goals | `SRC-LALIGA-TOPSCORER-2025-26`; A | HIGH facts, dynamic-page archive limitation; `CT-AWD-STAT-001` |
| `EV-P1-AWD-012` | LALIGA reports the 2023/24 race ended with Dovbyk on 24 and Sorloth on 23, adding a second closed-edition upper-tail observation. | top two, league goals | `SRC-P1-AWD-LALIGA-SCORER-2023-24`; A | HIGH; `CT-AWD-STAT-001` |
| `EV-P1-AWD-013` | LALIGA identifies Pichichi as MARCA's named top-scorer award. The simulator's canonical fact remains LALIGA top scorer; `Pichichi` is an external-award/presentation alias, never an unsupported canonical identity rewrite. | identity/alias semantics | `SRC-LALIGA-PICHICHI-BINDING`; A | HIGH; Award catalog invariant |
| `EV-P1-AWD-014` | Ballon/Kopa/Yashin/POTY are comparative extreme-tail observations; top scorer is an observed-statistical field. The two families cannot share an empirical likelihood model or be pooled for dispersion estimation. | model/evidence boundary | official sources above; A | HIGH; `CT-AWD-STAT-001`, comparative targets |
| `EV-P1-AWD-015` | Repeated Ballon, Kopa and Yashin wins are observed in the short longitudinal panel, so universal winner independence or anti-repeat logic would contradict evidence. Frequencies constrain tails but do not become direct simulator probabilities. | comparative award history | official winner histories; A | HIGH; `CT-AWD-REPEAT-001`, `CT-AWD-TAIL-001` |
| `EV-P1-AWD-016` | Official nominee count and latent simulator comparison-field size have different semantics. The former is direct evidence; the latter remains a joint-calibration parameter under G3C-8. | field semantics | official nominees + math contract; A | HIGH; `CT-AWD-FIELD-001` |
| `EV-P1-AWD-017` | Nominees and winners are selected extreme-tail samples and cannot estimate the all-footballer Performance distribution; G3D-4A remains the upstream distribution evidence. | selection-bias boundary | evidence design review; A | HIGH; all Award parameter families |
| `EV-P1-AWD-018` | Award history can constrain nomination/winner concentration, position representation and production association, but it assigns no PPI/PSN points, CareerScore weight or ScoringConfiguration value. | scoring boundary | `SCORING_MATH_SPEC` + official award facts | A | HIGH invariant; DR-080 remains closed |

## 6. Counts, coverage and unresolved conflicts

- EvidenceRecords: **38** (`NT=20`, `AWD=18`).
- Evidence tier distribution: **A=29, B=0, C=9, D=0**.
- Sources used: **21**; newly registered routes: **14**.
- Argentina direct coverage: final squads (2022, 2024, 2026), a preparation
  group, a preliminary list, an ordinary-window first-call-up observation,
  tournament exposure and 111 context-tagged results.
- Position coverage: GK/CM/ST have strict squad/exposure observations. Broad
  FIFA/provider position labels are never silently mapped.
- Material conflicts: none hidden. The 29-to-26 2024 reduction and larger
  2026 prelist describe different selection stages, not inconsistent squad
  sizes. Dynamic LALIGA/FIFA pages require snapshots before freeze.
- Blocking limitations for direct estimation remain: complete non-selected
  Argentina candidate denominator, first-call-up age distribution, ordinary
  multi-window exact minutes, comparative human judging weights and cross-era
  Award equivalence.
