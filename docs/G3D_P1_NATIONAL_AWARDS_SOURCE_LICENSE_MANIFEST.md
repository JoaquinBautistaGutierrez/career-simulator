# G3D-4D National Team and Awards Source and License Manifest

Status: `P1_ACQUISITION_COMPLETE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieval date: `2026-08-11`

Owner/reviewer roles: `DATA_OWNER` / `PROVENANCE_REVIEWER` (solo-project mode)

This manifest covers only G3D-4D Argentina-senior and five-slot Award evidence.
Official identities and public player names are retained only where required to
verify nominal squads, results and awards. Provider rows were inspected outside
the repository. No external raw dataset, gameplay definition, parameter value,
ScoringConfiguration value or Data V1 artifact is published here.

## 1. National Team sources

| Source ID | Publisher / artifact | Tier | Usage / terms state | Repository retention | Scope and limitation |
|---|---|---:|---|---|---|
| `SRC-P1-NA-FIFA-SQUAD-2022` | FIFA, [Qatar 2022 squad lists](https://fdp.fifa.org/assetspublic/ce44/pdf/SquadLists-English.pdf) and [Argentina 26-player overview](https://www.fifa.com/ar/articles/argentina-nationa-team-numbers-in-world-cup-2022-ar) | A | `REFERENCE_ONLY`; FIFA copyright/terms | atomic squad, DOB, position and cap facts only | official tournament field; broad `MF`/`FW` labels still require strict local mapping |
| `SRC-P1-NA-AFA-COPA-2024` | AFA, [29-player preparation group](https://www.afa.com.ar/seleccion/posts/se-completo-el-plantel-que-se-prepara-para-la-copa-america-y-los-amistosos-previos-en-estados-unidos) and [26-player Copa America squad](https://www.afa.com.ar/tfa/posts/nomina-de-futbolistas-convocados-para-disputar-la-copa-america-2026-en-estados-unidos) | A | `MANUAL_PUBLIC_FACT`; official association pages | cited roster counts/facts only | directly observes preparation group to tournament-squad reduction; not the full eligible field |
| `SRC-P1-NA-AFA-PRELIST-2026` | AFA, [official World Cup 2026 preliminary list](https://www.afa.com.ar/Sitio/posts/seleccion-mayor-prelista-de-convocados) | A | `MANUAL_PUBLIC_FACT`; official association page | cited names/counts only | preselection evidence; publication label and edition are bound to the dated page |
| `SRC-P1-NA-FIFA-SQUAD-2026` | FIFA, [Argentina final squad](https://www.fifa.com/en/articles/argentina-squad-announced) and [all final squads](https://www.fifa.com/en/articles/fifa-world-cup-2026-squads-confirmed) | A | `MANUAL_PUBLIC_FACT`; FIFA copyright/terms | cited roster/retention facts only | official 26-player final field and cross-cycle continuity |
| `SRC-P1-NA-FIFA-FIRSTCALL-2026` | FIFA, [Argentina squad for Guatemala](https://www.fifa.com/en/articles/argentina-lionel-scaloni-squad-guatemala) | A | `MANUAL_PUBLIC_FACT`; FIFA copyright/terms | cited first-call-up facts only | ordinary-window breakout/late-tail evidence, not a first-call-up distribution |
| `SRC-P1-NA-FIFA-STATS-2026` | FIFA, [World Cup 2026 statistics](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/statistics) | A | `REFERENCE_ONLY`; live official statistics | selected cited aggregates only | official tournament exposure route; dynamic-page snapshot required before freeze |
| `SRC-P1-NA-FIFA-OUTCOMES` | FIFA, [Argentina 2022 champion](https://www.fifa.com/es/tournaments/mens/worldcup/qatar2022/articles/argentina-le-gano-por-penales-a-francia-y-se-consagro-campeon-del-mundo), [2026 final standings](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/final-tournament-standings), and `SRC-FIFA-WC-FINAL-2026` lineage | A | `MANUAL_PUBLIC_FACT`; FIFA copyright/terms | cited result/progression facts only | validates major-outcome endpoints; not a team-strength rating |
| `SRC-P1-NA-FIFA-RANKING` | FIFA, [September ranking update](https://www.fifa.com/en/world-rankings/articles/mens-ranking-september-update-argentina-stay-top) | A | `MANUAL_PUBLIC_FACT`; live official ranking | cited rank/context only | relative-strength proxy only; never the sole `NationalTeamStrength` input |
| `SRC-FIFA-MENS-IMC-2025-2030` | FIFA, [official men's international calendar](https://inside.fifa.com/organisation/fifa-council/media-releases/fifa-council-approves-international-match-calendars) | A | P0 source reused; `MANUAL_PUBLIC_FACT` | cited window semantics only | call-up opportunity timing; an opportunity is not a guaranteed match or selection |
| `SRC-P1-NA-OPENRESULTS` | martj42, [International football results](https://github.com/martj42/international_results) | C | repository declares CC0; upstream match provenance reviewed only to aggregate level | retrieval hash and derived Argentina aggregates; no raw CSV | 111-match cutoff-compatible panel; provider facts are checked against official major outcomes |
| `SRC-P1-NA-OPENWC22` | openfootball, [worldcup.more](https://github.com/openfootball/worldcup.more) | C | repository declares CC0 | retrieval hash and derived lineup/minute aggregates; no raw file | lineup/substitution-derived nominal minutes, not official exact clock accounting |
| `SRC-P1-CM-TM-DATASET` | dcaribou, [Transfermarkt Datasets](https://github.com/dcaribou/transfermarkt-datasets) | C | G3D-4C source reused; dataset build CC0, upstream provenance remains `LICENSE_REVIEW_REQUIRED` | derived citizenship/position/cap aggregates only | candidate-field proxy; incomplete club universe and no complete eligible denominator |

## 2. Award sources

| Source ID | Publisher / artifact | Tier | Usage / terms state | Repository retention | Scope and limitation |
|---|---|---:|---|---|---|
| `SRC-UEFA-BALLON-NOMINEES-2025` | UEFA/Groupe Amaury, [2025 nominees](https://www.uefa.com/ballondor/news/029c-1e6c4428b07e-0926bc6b3468-1000--2025-ballon-d-or-awards-nominees-revealed/) and [official release PDF](https://editorial.uefa.com/resources/029c-1e6a605dcdda-850bf4467b58-1000/uefa_pr_ballondor_2025_eng.pdf) | A | P0 source reused; `REFERENCE_ONLY` | atomic field/identity facts only | official fields of 30/10/10; nominee count is not automatically the latent simulator field size |
| `SRC-P1-AWD-UEFA-BALLON-HISTORY` | UEFA, [all Ballon d'Or winners](https://www.uefa.com/ballondor/news/0287-195e642735da-0594342b9554-1000--history-of-the-ballon-d-or-all-the-winners/) | A | `MANUAL_PUBLIC_FACT`; UEFA copyright | cited edition/winner facts only | longitudinal winner series; 2020 cancellation retained as missing edition, never a zero outcome |
| `SRC-P1-AWD-UEFA-LAUREATES` | UEFA, [category laureates](https://www.uefa.com/ballondor/news/0292-1c27056169a7-bc88d1fdba43-1000--ballon-d-or-laureates-who-has-won-football-s-most-prestig/) | A | `MANUAL_PUBLIC_FACT`; UEFA copyright | cited Kopa/Yashin winner facts only | longitudinal repeatability; cross-era procedure changes remain explicit |
| `SRC-UEFA-BALLON-RULES` | UEFA/Groupe Amaury, [how winners are decided](https://www.uefa.com/ballondor/news/0292-1c2705cb8fd5-8f2dcb111a8a-1000--ballon-d-or-how-are-the-winners-decided/) | A | P0 source reused; `MANUAL_PUBLIC_FACT` | cited rule facts only | real-award provenance; simulation keeps its G3C comparative abstraction |
| `SRC-P1-AWD-LALIGA-POTY-2023-24` | LALIGA, [2023/24 end-of-season award field](https://www.laliga.com/en-ES/news/the-laliga-season-nears-its-end-real-madrid-run-out-champions-breakout-campaigns-from-girona-fc-and-athletic-club-and-all-to-play-for-in-the-promotion-race) | A | `MANUAL_PUBLIC_FACT`; LALIGA copyright | cited five-nominee/mechanism facts only | historical field/mechanism evidence; not assumed to govern 2025/26 |
| `SRC-LALIGA-POTY-2025-26` | LALIGA, [Lamine Yamal Player of the Season 2025/26](https://www.laliga.com/en-GB/news/lamine-yamal-ea-sports-laliga-player-of-the-season-2025-2026) | A | P0 source reused; `MANUAL_PUBLIC_FACT` | cited winner/production facts only | identity and winner verified; human ballot details remain non-public and nonblocking |
| `SRC-LALIGA-TOPSCORER-2025-26` | LALIGA, [official scorer table](https://www.laliga.com/en-US/stats/laliga-easports/scorers) | A | P0 source reused; `REFERENCE_ONLY`; dynamic page | cited leader/ranking facts only | edition snapshot required before freeze; goals are statistical facts, not scoring points |
| `SRC-P1-AWD-LALIGA-SCORER-2023-24` | LALIGA, [Sorloth/Dovbyk scoring race](https://www.laliga.com/en-US/news/alexander-sorloth-a-clinical-striker-for-atletico-de-madrid) | A | `MANUAL_PUBLIC_FACT`; LALIGA copyright | cited first/second counts only | one closed-edition upper-tail observation |
| `SRC-LALIGA-PICHICHI-BINDING` | LALIGA, [Pichichi publisher/identity explanation](https://www.laliga.com/en-US/news/five-things-you-may-not-know-about-athletic-club) | A | P0 lineage reused; `MANUAL_PUBLIC_FACT` | cited alias/ownership fact only | Pichichi remains an external MARCA award/presentation alias, not LALIGA's canonical statistical fact ID |

## 3. Counts and lineage

- Sources used by G3D-4D: **21** (`National Team=12`, `Awards=9`).
- Newly registered source routes: **14**; reused lineage sources: **7**.
- Tier distribution by source: **A=18, B=0, C=3, D=0**.
- No source is promoted to Tier A because it cites an official source; only the
  official publisher/organizer artifacts themselves receive Tier A.

## 4. Temporary acquisition identities

The following files were inspected under
`%TEMP%/career-simulator-g3d4d-20260811` and were not committed:

| Artifact | Bytes / identity | SHA-256 | Retained output |
|---|---:|---|---|
| `international_results.csv` | 3,727,835 bytes | `100afa17b2258ffcc0e9ef9612e374c5349e2b9390ec450b72147d4643c42070` | Argentina aggregate result/context summaries |
| `worldcup.more/worldcup/2022_worldcup.txt` | repository file | `205b6ffde81364d1f55020f1115144f08c284a93dfa3decb4ff33f30a24619ff` | strict-position starts/appearances/nominal-minute summaries |
| G3D-4C `players.csv.gz` | lineage hash in G3D-4C manifest | `1457768f75cb27adb38b2227b9c8facc53174a626cbe1e18f9019b5647fa8d3c` | Argentina-citizenship candidate-field proxy |

## 5. Privacy, redistribution and freeze boundary

- Public squad and award identities are nominal historical facts with explicit
  consumers; provider player identities are not committed.
- No raw roster, provider table, match event file or live statistics dump is in
  the repository. Only atomic facts, transformations, hashes and permitted
  aggregates are retained.
- `REFERENCE_ONLY` and dynamic official pages require a permitted archived
  snapshot or independently reproducible extraction before a dataset can be
  `FROZEN`.
- G3D-4D provides observational constraints. It does not license source data for
  redistribution and does not publish Data V1.
