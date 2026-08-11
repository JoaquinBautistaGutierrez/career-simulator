# G3D-4C Club/Market Source and License Manifest

Status: `P1_ACQUISITION_COMPLETE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieval date: `2026-08-10`

Owner/reviewer roles: `DATA_OWNER` / `PROVENANCE_REVIEWER` (solo-project mode)

This manifest covers only G3D-4C club, manager, transfer, contract and salary
evidence. Raw external tables were inspected in a temporary local directory and
were not committed. Public observations remain evidence; they are not club
ratings, EngineParameterSet values, gameplay definitions or Data V1.

## 1. Sources

| Source ID | Publisher / artifact | Tier | Usage / terms state | Repository retention | Scope and limitation |
|---|---|---:|---|---|---|
| `SRC-P1-CM-TM-DATASET` | dcaribou, [Transfermarkt Datasets](https://github.com/dcaribou/transfermarkt-datasets) | C | repository declares CC0; upstream site provenance and freeze reuse remain `LICENSE_REVIEW_REQUIRED` | schema, retrieval hashes and derived aggregates only; no raw tables | reproducible games, appearances, club-games, players, valuations and transfers; provider fields are observations/proxies, not official registrations |
| `SRC-P1-CM-LALIGA-STANDINGS` | LALIGA, [official standings](https://www.laliga.com/en-US/laliga-easports/standing) | A | `MANUAL_PUBLIC_FACT`; attribution required; dynamic page | citation only | official goals-for/against and table route; live page needs edition snapshot before freeze |
| `SRC-P1-CM-LALIGA-FIN-2024-25` | LALIGA, [Financial Report 2024/25](https://assets.laliga.com/assets/2026/04/13/originals/dd7aec50d2ee10d78a8f409e609c34a5.pdf) | A | `REFERENCE_ONLY`; official published report | cited aggregates only | league aggregate revenue, squad expense and transfer environment; not a club rating or player salary panel |
| `SRC-P1-CM-LALIGA-SCL` | LALIGA, [Squad Cost Limit](https://www.laliga.com/en-ES/transparency/economic-management/squad-cost-limit) | A | `MANUAL_PUBLIC_FACT`; official transparency page | definition/citation only | maximum approved eligible spending, not necessarily actual utilization or wage bill |
| `SRC-P1-CM-RM-FIN-2024-25` | Real Madrid CF, [annual accounts and audit 2024/25](https://www.realmadrid.com/en-US/about-real-madrid/the-club/transparency/annual-accounts) | A | `REFERENCE_ONLY`; official club publication | source route and cited facts only | audited club finance route; no cross-club normalization in G3D-4C |
| `SRC-P1-CM-FCB-FIN-2024-25` | FC Barcelona, [annual reports](https://www.fcbarcelona.com/en/club/organisation-and-strategic-plan/commissions-and-bodies/annual-reports) | A | `REFERENCE_ONLY`; official club publication | source route and cited facts only | audited annual-report route, activities and accounts; no player salary extraction |
| `SRC-P1-CM-ATM-FIN-2024-25` | Atlético de Madrid, [economic and financial information](https://www.atleticodemadrid.com/atm/informacion-economica-financiera) | A | `REFERENCE_ONLY`; official club publication | source route and cited facts only | audited accounts, debt, aggregated transfer and squad-cost disclosures |
| `SRC-P1-CM-AFA-CLUBS-2025` | AFA, [Informe de clubes 2025](https://www.afa.com.ar/3027/posts/informe-de-clubes-afa-2025) | A | `MANUAL_PUBLIC_FACT`; official association report | citation and permitted aggregates only | institutional/context evidence for Argentina clubs; not a comparable audited financial panel |
| `SRC-P1-CM-AFA-AVERAGES-2025` | AFA, [Boletín 6732](https://assets1.afa.com.ar/NewFolder-1/Boletin-Resoluciones-6732-%2824-07-2025%29-x-Eleccion-Asambleistas-2025-2026.pdf) | A | `MANUAL_PUBLIC_FACT`; official bulletin | cited table facts only | official multi-season sporting average context; not latent strength or Prestige |
| `SRC-P1-CM-CIES-TRAINING-2025` | CIES Football Observatory, [training-club methodology/ranking](https://football-observatory.com/IMG/sites/b5wp/2025/wp518/en/) | B | `REFERENCE_ONLY`; publisher copyright/terms apply | methodology and published aggregate observations only | academy-output proxy based on trained players active in covered leagues; output is not DevelopmentQuality |
| `SRC-P1-CM-CIES-SQUAD-2021` | CIES Football Observatory, [sustainable squad management](https://football-observatory.com/IMG/sites/mr/mr63/en/) | B | `REFERENCE_ONLY` | cited methodology/aggregates only | age, club tenure and contract duration as stability proxies; big-five scope |
| `SRC-P1-CM-CIES-LOANS-2023` | CIES Football Observatory, [global analysis of player loans](https://football-observatory.com/Global-analysis-of-player-loans) | B | `REFERENCE_ONLY` | cited aggregates only | 75-league cross-section; loan incidence/age/destination context, not Argentina/Spain baseline alone |
| `SRC-P1-CM-CIES-COACH-2026` | CIES Football Observatory, [coach-tenure comparison](https://football-observatory.com/IMG/sites/b5wp/2025/wp545/en/) | B | `REFERENCE_ONLY` | cited aggregate only | current 55-league turnover context; no departure-cause taxonomy |
| `SRC-P1-CM-ARG-MANAGER-2012` | European Journal of Operational Research, [manager dismissals in Argentina](https://www.sciencedirect.com/science/article/pii/S0377221712002421) | B | `REFERENCE_ONLY`; publisher terms apply | published aggregate claims only | 1986/87–2005/06 top-flight dismissals and match context; historical, not current hazard value |
| `SRC-P1-CM-FIFA-TMS-METHOD` | FIFA, [transfer-report methodology](https://inside.fifa.com/transfer-system/transfer-reports/methodology) | A | `MANUAL_PUBLIC_FACT`; official methodology | citation/definitions only | international professional 11-a-side scope and TMS completion/date semantics; excludes domestic transfers |
| `SRC-P1-CM-FIFA-GTR-2025` | FIFA, [Global Transfer Report 2025 release](https://inside.fifa.com/transfer-system/media-releases/international-transfers-reach-historic-high-2025) | A | `MANUAL_PUBLIC_FACT`; official report/release | cited aggregates only | international mobility and fee environment through calendar 2025; not a player-at-risk domestic panel |
| `SRC-P1-CM-FIFA-TRANSFER-REPORTS` | FIFA, [transfer reports and interactive data](https://inside.fifa.com/en/transfer-system/transfer-reports) | A | `REFERENCE_ONLY`; download/API terms require freeze review | cited aggregate/definition only | distinguishes permanent-with-agreement, out-of-contract and loan international moves |
| `SRC-P1-CM-FIFA-RSTP-2025` | FIFA, [Legal Handbook 2025 / RSTP](https://legal.fifa.com/legal/news/legal-handbook-2025-edition-published) | A | `REFERENCE_ONLY`; official regulations | semantic references only | contract/loan/registration rules; regulatory semantics are not observed duration/frequency distributions |
| `SRC-P1-CM-FIFPRO-EMPLOYMENT-2016` | FIFPRO, [Global Employment Report](https://www.fifpro.org/en/articles/2019/11/mens-football-global-report-2016) | B | `REFERENCE_ONLY`; survey/report terms apply | published aggregates only | 14,000-player global survey; salary/contract evidence is broad and historical, not slice-local |
| `SRC-P1-CM-AS-POSSESSION-2025-26` | AS, [LaLiga possession ranking 2025/26](https://as.com/resultados/futbol/primera/2025_2026/ranking/equipos/porcentaje-de-posesion/) | C | `REFERENCE_ONLY`; publisher copyright | cited club aggregates only | secondary possession proxy for eight Spain clubs; possession is not latent Control |

## 2. Temporary acquisition identity

The following gzip files were downloaded from `SRC-P1-CM-TM-DATASET` into
`%TEMP%/career-simulator-g3d4c-20260810` and remained outside the repository:

| File | Bytes | SHA-256 |
|---|---:|---|
| `clubs.csv.gz` | 48,683 | `a6736d4fd85a1e30a86c70fc6ec88b7dbd2d13eefcc486ab8264409f6b2e27c8` |
| `games.csv.gz` | 4,708,534 | `585f593b2add005ad803fd999355ef70d5de44ef021d37787064fdffcb3ba484` |
| `club_games.csv.gz` | 1,929,556 | `06718906c67ec11c077cc25f91b1b3624cc0cabb98400d733d6be5dc3e01c90f` |
| `transfers.csv.gz` | 5,433,917 | `f295f35af12fe1b7d46ed4f78f66c016c89036b66b16a42be2e11302a4ff7559` |
| `players.csv.gz` | 4,160,452 | `1457768f75cb27adb38b2227b9c8facc53174a626cbe1e18f9019b5647fa8d3c` |
| `player_valuations.csv.gz` | 6,869,624 | `d70ed2e3ab7ff52cf7e4815f370cb4510edc4ef02bb5dcc7300aa00c747839ae` |
| `appearances.csv.gz` | 42,857,792 | `41d48c65b24ebd3c6c97ff6241ca7ecd9e570cdb535abeba4bce67e3b0425a18` |

The upstream repository exposes a CC0 dataset build, but raw freeze or
redistribution remains blocked until provenance and upstream-site terms are
reviewed for the intended product. This conservative classification overrides
convenience.

## 3. Usage and privacy boundary

- No raw table, HTML/PDF dump, player name, salary rumor, private offer,
  negotiation message or contract document is committed.
- Player rows were joined only in temporary analysis. Committed artifacts use
  club/country/position aggregates and no gameplay `PlayerDefinition`.
- Transfer fee `0` in the reference dataset is retained as
  `ZERO_CODE_UNRESOLVED`; it is never rewritten as free, loan or undisclosed.
- Provider `market_value_in_eur` is `OBSERVED_PROXY`; it never calibrates
  Performance and is not a fee or salary.
- Official club accounts and LALIGA limits can support FinancialPower mapping,
  but no club rating or individual wage is inferred.

## 4. Freeze consequences

The evidence supports initial observational estimation with limitations. Freeze
still requires a legally approved reusable panel (or aggregate-only policy), a
contemporary Argentina player/contract panel, explicit movement types and
undisclosed-fee semantics, and comparable club finance transforms preserving
native currency/date lineage. `REFERENCE_ONLY` is not `FROZEN`.
