# G3D-4C Club/Market Evidence Index

Status: `P1_EVIDENCE_ACQUIRED`

Namespace: `EV-P1-{CLUB|MGR|MKT|CONTRACT}-NNN`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieved: `2026-08-10`

The namespace is independent from immutable P0, G3D-4A and G3D-4B records.
Every record has `validation=REVIEWED_DERIVATION`, reviewer role
`PROVENANCE_REVIEWER` and licensing inherited from the
[source manifest](G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST.md). Provider
panels are filtered to facts dated no later than the reference cutoff.

## 1. Club baselines, finance, development and stability

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-CLUB-001` | The reproducible provider snapshot exposes club, game, club-game, appearance, player, valuation and transfer tables with stable external IDs; those IDs remain source IDs and never become canonical game IDs. | downloaded 2026-08-10; observations through cutoff | `SRC-P1-CM-TM-DATASET`; C | MEDIUM; all club/market datasets |
| `EV-P1-CLUB-002` | For the eight Spain clubs in provider season 2025, each has 38 league observations; goals-for/game range 1.026–2.500, goals-against/game .921–1.605 and win share .237–.816. | 304 club-match observations, LaLiga 2025/26 | same; C | MEDIUM-HIGH shape, provider validation required; `CT-CLUB-STRENGTH-001` |
| `EV-P1-CLUB-003` | For the eight Argentina clubs in provider season 2025, each has 16 captured league observations; goals-for/game range 1.062–1.500, goals-against/game .438–1.250 and win share .312–.562. | 128 club-match observations, Argentina 2025 partial phase | same; C | MEDIUM-LOW because edition coverage is partial; `CT-CLUB-STRENGTH-001` |
| `EV-P1-CLUB-004` | Secondary 2025/26 possession observations for the eight Spain clubs range from 44.1% to 68.4%; the metric is `OBSERVED_PROXY`, not `LATENT_CLUB_CONTROL`. | eight LaLiga clubs, percentage possession | `SRC-P1-CM-AS-POSSESSION-2025-26`; C | MEDIUM; `CT-CLUB-STRENGTH-001`, `CT-TACTIC-001` |
| `EV-P1-CLUB-005` | Provider competition records preserve distinct domestic, cup and continental contexts for all 16 clubs; Spain has deeper 2021–2025 coverage while Argentina is concentrated in 2024–2025 plus Club World Cup facts. | 16 detailed clubs, match-record counts | `SRC-P1-CM-TM-DATASET`; C | MEDIUM; `CT-CLUB-PRESTIGE-001`, `CT-WORLD-LEAGUE-001` |
| `EV-P1-CLUB-006` | LALIGA 2024/25 reports league aggregate Net Turnover EUR 3,987.1m, registrable sporting-staff expense EUR 1,826.6m, transfer selling price EUR 711.1m and transfer result EUR 502.4m. | LaLiga aggregate, FY/season 2024/25, EUR | `SRC-P1-CM-LALIGA-FIN-2024-25`; A | HIGH league environment, not club allocation; `CT-CLUB-FIN-001`, `CT-MKT-SAL-001`, `CT-MKT-FEE-001` |
| `EV-P1-CLUB-007` | LALIGA Squad Cost Limit includes fixed/variable pay, social security, bonuses, acquisition costs, agent commissions and amortisation; it is an approved maximum and need not equal actual utilization. | 2025/26 official definition | `SRC-P1-CM-LALIGA-SCL`; A | HIGH semantic boundary; `CT-CLUB-FIN-001`, `CT-MKT-SAL-001` |
| `EV-P1-CLUB-008` | Real Madrid publishes audited 2024/25 annual accounts and management reports through its transparency portal. | club official FY 2024/25 | `SRC-P1-CM-RM-FIN-2024-25`; A | HIGH source route; `CT-CLUB-FIN-001` |
| `EV-P1-CLUB-009` | FC Barcelona publishes 2024/25 annual reports covering sporting, social, institutional and audited economic activity. | club official FY 2024/25 | `SRC-P1-CM-FCB-FIN-2024-25`; A | HIGH source route; `CT-CLUB-FIN-001` |
| `EV-P1-CLUB-010` | Atlético publishes 2024/25 accounts, audit, debt, aggregated player-transfer/loan amounts and squad-cost information. | club official FY 2024/25 | `SRC-P1-CM-ATM-FIN-2024-25`; A | HIGH source route; `CT-CLUB-FIN-001`, market context |
| `EV-P1-CLUB-011` | AFA's 2025 club report provides association-level institutional and planning context for first-division clubs but not a finance panel directly comparable to audited Spanish statements. | Argentina first division, 2025 | `SRC-P1-CM-AFA-CLUBS-2025`; A | HIGH scope, LOW comparability; `CT-CLUB-BASE-001`, `CT-CLUB-FIN-001` |
| `EV-P1-CLUB-012` | AFA Boletín 6732 reports official multi-season sporting averages including all eight detailed Argentina clubs; the observation is recent sporting context, not Prestige or a causal club state. | Argentina official average table through 2024 | `SRC-P1-CM-AFA-AVERAGES-2025`; A | HIGH; `CT-CLUB-STRENGTH-001`, `CT-CLUB-PRESTIGE-001` |
| `EV-P1-CLUB-013` | CIES training-club evidence counts players trained by a club and active in covered leagues through a published training index; it measures output/placement, not latent DevelopmentQuality. | 49-league 2025 reference | `SRC-P1-CM-CIES-TRAINING-2025`; B | MEDIUM-HIGH proxy; `CT-CLUB-DEVQ-001` |
| `EV-P1-CLUB-014` | CIES sustainable-squad evidence combines age, length of stay and remaining contract duration and identifies Athletic Club and Real Sociedad as strong examples; the construct is a stability proxy, not the engine Stability state. | big-five clubs, 2021 | `SRC-P1-CM-CIES-SQUAD-2021`; B | MEDIUM; `CT-CLUB-STAB-001`, `CT-PCOMP-001` |
| `EV-P1-CLUB-015` | Provider formation strings cover all 16 clubs (23–27 captured matches per Argentina club; 178–325 per Spain club), with 3–17 distinct strings and modal shares .259–.870; strings are tactical proxies only. | 2021–cutoff provider records | `SRC-P1-CM-TM-DATASET`; C | MEDIUM; `CT-TACTIC-001` |

## 2. Managers and turnover

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-MGR-001` | A peer-reviewed Argentina study assembled 420 within-season top-flight manager terminations over 1986/87–2005/06, an average 21 per season, and modelled about 7,000 matches. | Argentina top division, 20 seasons | `SRC-P1-CM-ARG-MANAGER-2012`; B | HIGH historical incidence, MEDIUM current transferability; `CT-MGR-TURN-001` |
| `EV-P1-MGR-002` | In the provider panel for the eight Argentina clubs, 16 club-seasons in 2024–2025 have mean .500 observed within-season manager-name changes and 75.0% have zero changes. | club-season; consecutive named manager spells | `SRC-P1-CM-TM-DATASET`; C | MEDIUM-LOW limited coverage; `CT-MGR-TURN-001` |
| `EV-P1-MGR-003` | In the provider panel for the eight Spain clubs, 39 club-seasons in 2021–2025 have mean .385 observed within-season manager-name changes and 76.9% have zero changes. | club-season; consecutive named manager spells | same; C | MEDIUM; `CT-MGR-TURN-001` |
| `EV-P1-MGR-004` | The provider panel identifies manager names by match but does not encode `DISMISSED`, `RESIGNED`, `CONTRACT_END`, `INTERIM_REPLACEMENT`, `MUTUAL_TERMINATION` or `UNKNOWN`; it cannot estimate firing hazard without event adjudication. | schema limitation | same; C | HIGH limitation; `CT-MGR-TURN-001` |
| `EV-P1-MGR-005` | CIES reports 65.2% of teams across 55 leagues changed head coach at least once in the year ending 4 May 2026, with large league variation. | cross-sectional 55-league reference | `SRC-P1-CM-CIES-COACH-2026`; B | MEDIUM global context; `CT-MGR-TURN-001` |
| `EV-P1-MGR-006` | Formation-string diversity and modal share vary materially across the 16-club panel; the observation can constrain tactical persistence but does not identify correlated latent factor loadings. | 16 clubs, 2021–cutoff | `SRC-P1-CM-TM-DATASET`; C | MEDIUM; `CT-TACTIC-001`, `CT-MGR-QUALITY-001` |

## 3. Transfer market, fees and valuation proxy

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-MKT-001` | FIFA transfer reports cover international professional 11-a-side moves recorded in TMS and use calendar-year completion/ITC semantics; they exclude domestic moves and are not a full player-at-risk denominator. | official methodology | `SRC-P1-CM-FIFA-TMS-METHOD`; A | HIGH; `CT-MKT-TRANS-001`, `CT-MKT-DECISION-001` |
| `EV-P1-MKT-002` | FIFA reports 86,158 international transfers across professional/amateur men's/women's football in 2025 and USD 13.08bn transfer-fee spending in men's professional football. | calendar 2025; global | `SRC-P1-CM-FIFA-GTR-2025`; A | HIGH environment, not slice probability; `CT-MKT-TRANS-001`, `CT-MKT-FEE-001` |
| `EV-P1-MKT-003` | FIFA's transfer-report taxonomy says permanent transfers involving a transfer agreement are typically under 20% of international moves; the majority are out-of-contract, with the remainder loans. | international professional transfer reports | `SRC-P1-CM-FIFA-TRANSFER-REPORTS`; A | HIGH broad move-type shape; `CT-MKT-TRANS-001`, `CT-MKT-LOAN-001` |
| `EV-P1-MKT-004` | Provider records contain 1,382 moves to/from the eight Argentina clubs dated 2021–cutoff; median observed age is 24.27, 322 fees are positive and 867 fee fields are zero-coded. | provider transfer records | `SRC-P1-CM-TM-DATASET`; C | MEDIUM counts/age, LOW type/zero semantics; `CT-MKT-TRANS-001`, `CT-MKT-AGE-001` |
| `EV-P1-MKT-005` | Provider records contain 1,195 moves to/from the eight Spain clubs dated 2021–cutoff; median observed age is 24.21, 260 fees are positive and 785 fee fields are zero-coded. | provider transfer records | same; C | MEDIUM counts/age, LOW type/zero semantics; same targets |
| `EV-P1-MKT-006` | Strict source-position mapping yields 159 GK, 263 CM and 451 ST movement records; median ages are 26.92, 23.87 and 24.17 respectively. | 2021–cutoff, strict `Goalkeeper`/`Central Midfield`/`Centre-Forward` | same; C | MEDIUM; `CT-MKT-AGE-001`, position diagnostics |
| `EV-P1-MKT-007` | Among 577 strictly positive provider fee fields for slice-involved moves, EUR-proxy P25/P50/P75/P90/P95/P99/max are 1.46m/3.00m/9.75m/21.14m/35.00m/70.156m/127m; no tail is winsorized. | provider-normalized EUR proxy, 2021–cutoff | same; C | MEDIUM shape, LOW Money provenance; `CT-MKT-FEE-001`, `CT-MKT-TAIL-001` |
| `EV-P1-MKT-008` | Provider fee `0` is not accompanied by a reliable free/loan/undisclosed discriminator in the acquired table, so 1,649 unique slice-involved zero codes remain `ZERO_CODE_UNRESOLVED`, never fee=0. | schema/quality fact | same; C | HIGH limitation; `CT-MKT-FEE-001`, `CT-MKT-TRANS-001` |
| `EV-P1-MKT-009` | Provider `market_value_in_eur` is an external dated valuation proxy. It is not observed consideration, salary, hidden capability or Performance truth. | provider valuation schema | same; C | HIGH boundary, LOW causal identifiability; `CT-MKT-VAL-001` |
| `EV-P1-MKT-010` | Completed-transfer/TMS and provider records observe selected outcomes, not all Interest, Offers, rejected bids or candidate players; Interest and Offer probabilities remain selection-biased and jointly identified. | observability assessment | FIFA methodology + provider schema; C | HIGH limitation; `CT-MKT-INT-001`, `CT-MKT-OFFER-001`, `CT-MKT-BID-001`, `CT-MKT-SELLER-001` |

## 4. Salary, contracts, renewals and loans

| Evidence ID | Atomic claim / extracted observation | Population, period, unit | Source / tier | Confidence; consumers |
|---|---|---|---|---|
| `EV-P1-CONTRACT-001` | FIFPRO's employment study surveyed about 14,000 professional players across 54 countries and 87 leagues; it is a broad employment reference rather than an elite Argentina/Spain panel. | survey collected for 2016 report | `SRC-P1-CM-FIFPRO-EMPLOYMENT-2016`; B | HIGH scope, MEDIUM transferability; contract/salary targets |
| `EV-P1-CONTRACT-002` | Excluding reported contracts over six years, the global average reported contract length was 22.1 months (22.6 months before that exclusion rule). | professional-player survey; months | same; B | MEDIUM; `CT-CONTRACT-DUR-001` |
| `EV-P1-CONTRACT-003` | Reported average duration differed by entry: free agent 19.5 months, renewal 19.7, transfer fee 25.4 and academy promotion 30.1. | global survey; observed association | same; B | MEDIUM; `CT-CONTRACT-DUR-001`, `CT-MKT-RENEW-001` |
| `EV-P1-CONTRACT-004` | FIFPRO reports median net monthly pay between USD 1,000–2,000, more than 45% below USD 1,000 and 2% at or above USD 720,000 annual take-home. | global survey, historical nominal USD | same; B | MEDIUM shape, LOW slice-local use; `CT-MKT-SAL-001`, `CT-MKT-TAIL-001` |
| `EV-P1-CONTRACT-005` | LALIGA Squad Cost Limit combines salary and non-salary costs and is a maximum rather than actual spending; it cannot be treated as a player wage distribution. | official 2025/26 definition | `SRC-P1-CM-LALIGA-SCL`; A | HIGH boundary; `CT-MKT-SAL-001`, `CT-CLUB-FIN-001` |
| `EV-P1-CONTRACT-006` | CIES observes 3,178 loaned players in 75 leagues/57 associations, equal to 9.5% of players in its cross-section. | 1 March reference cross-section | `SRC-P1-CM-CIES-LOANS-2023`; B | MEDIUM-HIGH global loan incidence; `CT-MKT-LOAN-001` |
| `EV-P1-CONTRACT-007` | Less than 30% of those loaned players were age 21 or younger and almost half were at least 24; loan is not synonymous with weak/youth player. | same | same; B | MEDIUM-HIGH; `CT-MKT-LOAN-001` |
| `EV-P1-CONTRACT-008` | In 63.5% of CIES cases the loan destination had lower sporting level than the contract-holder club. | same | same; B | MEDIUM, external strength methodology applies; `CT-MKT-LOAN-001`, `CT-MKT-FIT-001` |
| `EV-P1-CONTRACT-009` | The player snapshot exposes current contract-expiry date, but not a validated initial-duration history or denominator of all contracts approaching expiry; renewals and free-agent spells cannot be directly estimated from it. | provider schema | `SRC-P1-CM-TM-DATASET`; C | HIGH limitation; `CT-MKT-RENEW-001`, `CT-CONTRACT-DUR-001` |

## 5. Counts, coverage and conflicts

- EvidenceRecords: **40** (`CLUB=15`, `MGR=6`, `MKT=10`, `CONTRACT=9`).
- Evidence tier distribution: **A=11, B=11, C=18, D=0**.
- New sources: **20**.
- Club identity coverage: all frozen 8 Argentina + 8 Spain clubs appear in the
  provider panel; official finance routes cover three Spain clubs directly,
  while Argentina has official institutional/sporting context but no comparable
  audited club-finance panel.
- PositionCompetition: strict Spain appearance coverage exists for GK/CM/ST;
  Argentina's acquired appearance table is not usable as an eight-club panel.
- Apparent conflicts are preserved as differences in scope, period, source
  definition and selection. Official FIFA is international-only; provider
  movements mix domestic/international and unresolved types.
- No EvidenceRecord overwrites P0 or earlier P1 evidence. No observed number is
  copied into an EngineParameterSet value.
