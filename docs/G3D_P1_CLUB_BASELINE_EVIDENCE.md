# G3D-4C P1 Club Baseline Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4C-CLUB-MARKET-OBS-V1`

## 1. Scope and non-rating boundary

The frozen detailed set remains exactly eight clubs in Argentina and eight in
Spain. This document records observed environments and proxies. It does not
assign `attackStrength`, `defensiveStrength`, `controlStrength`, Prestige,
FinancialPower, DevelopmentQuality, MedicalQuality, Stability or any aggregate
club rating.

Observed score, possession, finance, training output and continuity are kept as
separate columns. Any later latent mapping must preserve competition, period,
currency, source and uncertainty.

## 2. Sporting panel

The derived panel uses only domestic-league club-game records dated no later
than the cutoff. Spain's provider season `2025` corresponds to 2025/26. The
Argentina provider season `2025` contains 16 observations per detailed club and
is a partial phase, not a full European-style season.

| Country | Club | N | GF/game | GA/game | GD/game | Win share |
|---|---|---:|---:|---:|---:|---:|
| ARG | Argentinos Juniors | 16 | 1.062 | .812 | .250 | .500 |
| ARG | Boca Juniors | 16 | 1.375 | .562 | .812 | .500 |
| ARG | Estudiantes | 16 | 1.188 | .438 | .750 | .562 |
| ARG | Independiente | 16 | 1.500 | 1.250 | .250 | .375 |
| ARG | Racing | 16 | 1.062 | .938 | .125 | .312 |
| ARG | River Plate | 16 | 1.375 | .750 | .625 | .562 |
| ARG | Rosario Central | 16 | 1.250 | 1.000 | .250 | .500 |
| ARG | Vélez | 16 | 1.125 | .750 | .375 | .438 |
| ESP | Athletic Club | 38 | 1.132 | 1.526 | -.395 | .342 |
| ESP | Atlético de Madrid | 38 | 1.632 | 1.158 | .474 | .553 |
| ESP | Barcelona | 38 | 2.500 | .947 | 1.553 | .816 |
| ESP | Girona | 38 | 1.026 | 1.447 | -.421 | .237 |
| ESP | Real Madrid | 38 | 2.026 | .921 | 1.105 | .711 |
| ESP | Real Sociedad | 38 | 1.553 | 1.605 | -.053 | .289 |
| ESP | Sevilla | 38 | 1.211 | 1.579 | -.368 | .316 |
| ESP | Villarreal | 38 | 1.895 | 1.211 | .684 | .579 |

For 2021–2025, the Spain panel supplies 1,482 club-match observations across 39
club-seasons (GF 1.634, GA 1.123, win share .503). Argentina supplies only 223
club-match observations across 16 provider club-seasons in 2024–2025 (GF
1.274, GA .816, win share .475). These pooled figures document coverage and
shape only; they are not comparable league-strength estimates.

### 2.1 Attack, defense and Control

- GF, GA, goal difference and win share are direct score-environment evidence.
- Shot/chance and opponent-adjusted panels remain `MORE_EVIDENCE_REQUIRED`.
- Spain possession ranges 44.1–68.4% for the eight clubs in the acquired
  secondary table. It is labeled `OBSERVED_PROXY`; possession never becomes
  `LATENT_CLUB_CONTROL` without the future multivariate mapping.
- Competition identity is retained. No Argentina/Spain pooling and no IJL
  substitution is permitted.

## 3. PositionCompetition evidence

Strict mapping uses source sub-positions `Goalkeeper`, `Central Midfield` and
`Centre-Forward` only. For each club-season-position, shares use the total
minutes of strictly mapped players in that position. A meaningful competitor
has at least 10% of that mapped-position total; this is an observational summary
band, not an engine threshold.

| Geography | Position | Club-seasons | Median top share | Median HHI | Median meaningful players | Median mapped players |
|---|---|---:|---:|---:|---:|---:|
| Spain | GK | 39 | .842 | .734 | 2 | 2 |
| Spain | CM | 39 | .423 | .315 | 3 | 4 |
| Spain | ST | 39 | .634 | .508 | 2 | 3 |
| Argentina | GK | 0 usable | — | — | — | — |
| Argentina | CM | 0 usable | — | — | — | — |
| Argentina | ST | 0 usable | — | — | — | — |

Spain supports initial concentration fitting with mapping limitations.
Argentina remains `BLOCKED_BY_MAPPING/COVERAGE`; market records and team scores
cannot replace position minutes.

## 4. Prestige evidence

Prestige inputs remain a vector of evidence rather than a title formula:

- official AFA multi-season averages and competition membership;
- domestic/cup/continental participation by edition;
- historical competition facts already normalized in P0;
- recent score context from the panel;
- public reach only when separately acquired by the Reputation track.

Provider records retain 2021–cutoff domestic/cup/continental participation for
all 16 clubs. Spain depth ranges 178–325 match records per club; Argentina
coverage is 27–31 and includes Club World Cup records for Boca/River. These
counts are exposure evidence, not Prestige points. Historical and recent
windows remain separate so short-run sporting decline cannot erase long-memory
relevance by construction.

## 5. FinancialPower evidence

### Spain

- LALIGA's 2024/25 aggregate provides a consistent league environment for
  revenue, registrable sporting staff expense and transfer activity.
- Real Madrid, Barcelona and Atlético provide official audited/reporting routes.
- Squad Cost Limit is an approved maximum covering salary, social security,
  bonuses, acquisition costs, commissions and amortisation. It is not actual
  spending or an individual wage bill.
- Five remaining Spain clubs have official identity and sporting coverage, but
  comparable audited extraction remains `SOURCE_IDENTIFIED`, not acquired.

### Argentina

AFA provides institutional and sporting context for all eight clubs, but no
uniform audited club-finance panel was acquired. Nominal ARS observations cannot
be compared with EUR or normalized informally. FinancialPower is therefore
`READY_WITH_LIMITATIONS` for Spain and `MORE_EVIDENCE_REQUIRED` for Argentina.

## 6. DevelopmentQuality evidence

CIES training-club methodology supplies an academy-output proxy: trained
players active in covered professional leagues. Future extraction may also use
homegrown first-team minutes, youth-to-senior transitions and longitudinal
placement. None alone is DevelopmentQuality:

- buying a young player is not development output;
- output depends on first-team congestion and external demand;
- low current youth minutes can coexist with a strong academy environment;
- transfer proceeds from graduates preserve market and opportunity confounding.

The family is `JOINT_CALIBRATION_REQUIRED`, with output evidence available but
no 16-club comparable panel yet frozen.

## 7. MedicalQuality evidence

No case-mix-adjusted club medical panel was found. Disclosed infrastructure,
availability, recurrence and recovery may become proxies only after controlling
exposure, age, injury mix, reporting and squad composition. Fewer public
injuries is not evidence of better MedicalQuality. Status remains
`WEAKLY_IDENTIFIED`, consistent with G3D-4B.

## 8. Stability evidence

Stability consumes multiple observed dimensions:

- manager turnover and cause taxonomy;
- squad/player tenure and recruitment share;
- contract horizon;
- sporting volatility;
- board/institutional and finance events when verified.

CIES uses age, club stay and contract duration as sustainability proxies and
identifies Athletic Club/Real Sociedad as examples. The provider manager panel
adds a separate turnover signal. Neither is a complete engine Stability state.

## 9. Readiness

| Family | State | Next gate |
|---|---|---|
| sporting score baselines | `READY_FOR_INITIAL_ESTIMATION` Spain; `READY_WITH_LIMITATIONS` Argentina | opponent/format adjustment and licensed freeze panel |
| Attack/Defense latent mapping | `JOINT_CALIBRATION_REQUIRED` | shots/chances, opposition and competition strength |
| Control | `JOINT_CALIBRATION_REQUIRED` | multivariate proxy panel beyond possession |
| Prestige | `JOINT_CALIBRATION_REQUIRED` | explicit historical/recent/reach transform |
| FinancialPower | `READY_WITH_LIMITATIONS` Spain; `MORE_EVIDENCE_REQUIRED` Argentina | comparable accounts/proxies with Money lineage |
| DevelopmentQuality | `JOINT_CALIBRATION_REQUIRED` | club-level homegrown/transition panel |
| MedicalQuality | `WEAKLY_IDENTIFIED` | exposure/case-mix-adjusted health outcomes |
| Stability | `JOINT_CALIBRATION_REQUIRED` | manager cause, board/finance and squad continuity joins |
| PositionCompetition | `READY_FOR_INITIAL_ESTIMATION` Spain; `BLOCKED_BY_MAPPING` Argentina | Argentina strict minutes panel |

## 10. Provenance

Atomic claims: `EV-P1-CLUB-001..015` in
[the Evidence Index](G3D_P1_CLUB_MARKET_EVIDENCE_INDEX.md). Source identities,
terms and temporary-file hashes are in
[the Source Manifest](G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST.md).
