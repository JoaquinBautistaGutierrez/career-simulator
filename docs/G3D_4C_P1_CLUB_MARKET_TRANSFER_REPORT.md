# G3D-4C — P1 Clubs, Managers, Market & Transfers Report

Status: `COMPLETE_WITH_LIMITATIONS`

Result: `GO_FOR_G3D_4D_WITH_CLUB_MARKET_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4C-CLUB-MARKET-OBS-V1`

## 1. Outcome

G3D-4C acquired traceable club, manager, mobility, fee, employment and loan
evidence and mapped it to existing datasets, targets, parameters and goldens. It
preserves all 16 detailed clubs, ExternalClubPool classes, POST_SEASON_ONLY,
Money semantics and G3C-6/G3C-7 mathematics. It assigns no club rating,
coefficient, intercept, sigma, persistence, hazard, fee multiplier, salary
coefficient or probability. Data V1 remains unpublished.

## 2. Inventory

- **40** new EvidenceRecords: `EV-P1-CLUB-001..015`,
  `EV-P1-MGR-001..006`, `EV-P1-MKT-001..010` and
  `EV-P1-CONTRACT-001..009`.
- **20** new sources.
- Evidence tier distribution: **A=11, B=11, C=18, D=0**.
- Seven temporary provider tables were fingerprinted outside the repository;
  raw external data was not committed.
- **10** existing DatasetDefinitions receive P1 states; none is `FROZEN`.
- **35** existing Club/World/Market/Contract targets receive observational
  readiness metadata; no target ID or `PT-*` value changes.
- **25** existing goldens gain empirical fixture/distribution basis metadata;
  all 139 remain `SPECIFIED` with no expected output.

## 3. Club coverage

The detailed set remains:

- Argentina: River Plate, Boca Juniors, Racing, Independiente, Estudiantes,
  Vélez, Argentinos Juniors and Rosario Central.
- Spain: Real Madrid, Barcelona, Atlético de Madrid, Athletic Club, Real
  Sociedad, Villarreal, Sevilla and Girona.

All 16 have canonical P0 identity plus provider score/manager/tactical/market
coverage. Spain has 39 usable 2021–2025 domestic club-seasons and strict
GK/CM/ST appearance coverage. Argentina has only 16 provider club-seasons over
2024–2025 and no usable eight-club strict-position appearance panel.

No materializable external club is promoted to detailed. No abstract club is
made a nominal champion, contract holder or transfer counterparty.

## 4. Club baselines and latent-state boundaries

| Area | Evidence | Readiness | Limitation |
|---|---|---|---|
| sporting baseline | GF/GA/GD/wins for 16; deeper Spain history | `READY_FOR_INITIAL_ESTIMATION` Spain; `READY_WITH_LIMITATIONS` Argentina | Argentina phase incomplete; shots/opponent adjustment absent |
| Attack/Defense | score environments | `JOINT_CALIBRATION_REQUIRED` | latent mapping and competition-strength separation |
| Control | Spain possession + formation proxy | `JOINT_CALIBRATION_REQUIRED` | possession is not Control; Argentina proxy absent |
| Prestige | history/participation/recent context kept separate | `JOINT_CALIBRATION_REQUIRED` | reach and transform not yet acquired/fitted |
| FinancialPower | official LALIGA/club accounts and cost limits | `READY_WITH_LIMITATIONS` Spain; `MORE_EVIDENCE_REQUIRED` Argentina | mixed accounting concepts; no comparable 16-club panel |
| DevelopmentQuality | CIES training-output methodology | `JOINT_CALIBRATION_REQUIRED` | output and environment confounded |
| MedicalQuality | candidate proxies only | `WEAKLY_IDENTIFIED` | no exposure/case-mix-adjusted club panel |
| Stability | manager, squad/contract and volatility proxies | `JOINT_CALIBRATION_REQUIRED` | board/finance and event-cause joins incomplete |

Prestige is not a title count; FinancialPower is not nominal revenue; academy
graduates are not DevelopmentQuality; and fewer public injuries are not
MedicalQuality.

## 5. Manager and tactical evidence

Current derived detailed-club panels show mean .500 observed within-season
manager-name changes over 16 Argentina club-seasons and .385 over 39 Spain
club-seasons. Historical peer-reviewed Argentina evidence covers 420
within-season terminations over 20 seasons. The period/definition difference is
preserved.

The observational taxonomy is `DISMISSED|RESIGNED|CONTRACT_END|
INTERIM_REPLACEMENT|MUTUAL_TERMINATION|UNKNOWN`. Provider changes are `UNKNOWN`
until adjudicated; no change is silently classified as firing. Formation-string
diversity constrains potential tactical persistence but does not define a
gameplay formation or ManagerContext loading.

Manager spell distributions become directly estimable after cause adjudication.
Turnover hazard, underperformance effect, tactical latent factors and aggregate
Stability remain joint/weak.

## 6. PositionCompetition

Spain has 39 strict club-season observations for each GK/CM/ST. Median leading
mapped-minute shares are .842/.423/.634 and median meaningful-player counts are
2/3/2. Argentina has no usable strict appearance panel. Therefore Spain can
support initial observation-model fitting; the vertical-slice position family
as a whole remains limited.

## 7. Transfers, fees and mobility

The provider panel records 1,382 Argentina-club and 1,195 Spain-club movements
from 2021 to cutoff, with median ages 24.27 and 24.21. Strict position records
cover 159 GK, 263 CM and 451 ST. These are event observations, not player-at-risk
transfer probabilities.

The 577 positive fee fields preserve a heavy tail (P50 EUR-proxy 3m, P90
21.14m, P99 70.156m, maximum 127m). The 1,652 zero-coded fields remain
`ZERO_CODE_UNRESOLVED`; undisclosed is never zero. Provider EUR is not exact
native Money and cannot skip the existing date/currency transform lineage.

FIFA supplies primary international scope/type context, but domestic mobility,
zero-transfer careers and local type frequencies need a longitudinal official
or licensed cohort.

## 8. Salary, contracts, renewal and loans

FIFPRO provides broad historical global contract/salary shape, including mean
contract duration near 22 months and entry-mode differences. LALIGA/club
sources provide official financial and squad-cost environments, not individual
wages. Local player salary remains weak and fee remains a separate process.

Renewal is not estimable from renewal announcements: all contracts entering an
expiry-risk window are the required denominator. Current-expiry snapshots lack
validated start dates. CIES supplies global loan incidence/age/destination
shape, but not local duration, return or conversion.

## 9. ClubNeed, Interest, Offer and SellerResponse

Position depth, departures, age/contracts and documented tactics are future
ClubNeed proxies; no ClubNeed score is computed. Completed moves observe the end
of a selected pipeline and cannot identify Interest, Offer, rejected bid,
SellerResponse or negotiation probability. Rumor lists were rejected as a core
candidate-field source.

## 10. Dataset promotions

| Dataset ID | G3D-4C state | Principal residual gate |
|---|---|---|
| `DS-CLUB-VERTICAL-SLICE` | `NORMALIZED_WITH_LIMITATIONS` | all-dimension comparable 16-club panel and license freeze |
| `DS-CLUB-HISTORICAL-STRENGTH` | `NORMALIZED_WITH_LIMITATIONS` | Argentina depth, shots/opponent/format transform |
| `DS-CLUB-FINANCIAL-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | Argentina/comparable club accounts and Money normalization |
| `DS-MANAGER-TENURE` | `NORMALIZED_WITH_LIMITATIONS` | event cause, interim and appointment-date adjudication |
| `DS-SQUAD-COMPETITION-PROXY` | `NORMALIZED_WITH_LIMITATIONS` | Argentina GK/CM/ST appearance panel |
| `DS-TRANSFER-HISTORY` | `NORMALIZED_WITH_LIMITATIONS` | type, player-at-risk denominator and official/approved reuse |
| `DS-TRANSFER-FEES` | `NORMALIZED_WITH_LIMITATIONS` | native currency/date and undisclosed/add-on semantics |
| `DS-MARKET-VALUATION-PROXY` | `ACQUIRED` | provider method/license and diagnostic transform |
| `DS-SALARY-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | local verified player/club wage panel |
| `DS-CONTRACT-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | start/end/renewal/loan longitudinal denominator |

No dataset advances to `FROZEN` or publishes Data V1.

## 11. Parameter identifiability

### Directly estimable observational components

- score-environment club baselines under competition/format controls;
- manager spell/tenure and turnover occurrence once event causes are reviewed;
- Spain position-minute concentration/depth distributions;
- movement and age-at-move distributions with a proper at-risk cohort;
- positive/disclosed fee distribution shape;
- broad contract-duration and loan incidence/age components.

### Joint calibration required

- Attack/Defense/Control latent mappings;
- Prestige, FinancialPower, DevelopmentQuality and Stability;
- PositionCompetition context/entrenchment;
- ClubNeed, scarcity and PlayerClubFit;
- MarketValue/valuation, fee and salary causal coefficients;
- transfer frequency, contract duration, renewal and loans in local context;
- Interest and Offer after selection correction.

### Weakly identified

- MedicalQuality;
- manager departure-cause/board-pressure effects in the current panel;
- private Interest, Offers and rejected bids;
- asking price, SellerResponse and negotiation structure;
- exact individual salary and contract expectations;
- tactical correlated latent factors.

## 12. Registry reconciliation

- Dataset Registry: only the ten canonical datasets above change readiness.
- Target Registry: 35 relevant targets gain evidence state; all 186 IDs and 77
  product targets remain unchanged.
- Parameter Registry: `clubWorld.*` and `transfersMarket.*` gain evidence,
  dataset and identifiability metadata only. All **275** templates remain
  `UNASSIGNED` and value-free.
- Golden Registry: eight club/manager/position/world boundary and 17 market/
  contract/money goldens gain empirical-basis metadata; all **139** remain
  `SPECIFIED` without outputs.
- DR-065, DR-066, DR-067 and DR-027 retain their resolved policies; only
  empirical publication dependencies are updated.

## 13. Licensing and bias

- Primary official sources are cited rather than copied.
- Raw provider files remain temporary and outside Git.
- Transfermarkt-derived summaries stay `LICENSE_REVIEW_REQUIRED` for freeze
  despite the dataset repository's CC0 declaration.
- Official accounts are not cross-club standardized automatically.
- Player salary/contract/offer privacy and non-disclosure are not converted to
  zero values.
- Provider score, manager, formation, fee and valuation coverage can be
  incomplete or editorial; source tier remains C.

## 14. Remaining blockers

1. contemporary Argentina strict GK/CM/ST minutes/squad panel;
2. comparable audited/proxy finance for all 16 clubs, especially Argentina;
3. opponent-adjusted shots/chance/control panel;
4. club-level homegrown/academy transition evidence;
5. manager appointment/departure cause and at-risk calendar spells;
6. official/licensed longitudinal transfer history including zero-move players;
7. explicit permanent/free/loan/undisclosed/add-on fee semantics in native Money;
8. local verified salary and start/end/renewal contract cohort;
9. observable Interest/Offer/rejection/negotiation data or synthetic joint-fit
   policy;
10. future Data V1/legal freeze, parameter candidates, sensitivity, Monte Carlo
    acceptance and golden outputs.

These limit initial calibration but do not block G3D-4D evidence acquisition.

## 15. Next gate

G3D-4D may acquire National Team and Awards observational evidence. It must not
interpret this report as authorization to publish Data V1, calibrate club/market
parameters, alter scoring, reopen market policies or implement gameplay.

## 16. Canonical artifacts

- [Club Baseline Evidence](G3D_P1_CLUB_BASELINE_EVIDENCE.md)
- [Manager & Stability Evidence](G3D_P1_MANAGER_STABILITY_EVIDENCE.md)
- [Transfer Market Evidence](G3D_P1_TRANSFER_MARKET_EVIDENCE.md)
- [Contract, Salary & Loan Evidence](G3D_P1_CONTRACT_SALARY_EVIDENCE.md)
- [Evidence Index](G3D_P1_CLUB_MARKET_EVIDENCE_INDEX.md)
- [Source and License Manifest](G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST.md)
- [Observational Hash Manifest](G3D_P1_CLUB_MARKET_OBSERVATIONAL_HASH_MANIFEST.md)
