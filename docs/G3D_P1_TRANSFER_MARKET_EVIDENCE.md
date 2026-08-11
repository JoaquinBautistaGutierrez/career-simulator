# G3D-4C P1 Transfer Market Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

## 1. Observation boundary

FIFA TMS is the primary international-transfer reference and preserves
completion/date/type semantics. The reproducible provider panel widens the view
to movements involving the 16 detailed clubs, but cannot be treated as an
official registration or complete candidate/interest/offer ledger.

```text
completed move observations
!= all players at risk
!= Interest opportunities
!= Offers
!= accepted/rejected negotiations
```

## 2. Mobility panel

| Slice involvement | Records 2021–cutoff | Age N | Median age | Positive fee fields | Zero-coded fee fields |
|---|---:|---:|---:|---:|---:|
| Argentina detailed clubs | 1,382 | 1,382 | 24.27 | 322 | 867 |
| Spain detailed clubs | 1,195 | 1,195 | 24.21 | 260 | 785 |

A record can involve two detailed clubs and therefore is not added across rows
to form a unique-move total. These are movement records, not transfer rates.
Zero-transfer careers require a longitudinal player-at-risk cohort; selecting
only event rows would exclude them by construction.

Strict source mapping gives:

| Position | Movement records | Median age | Positive fee fields |
|---|---:|---:|---:|
| GK | 159 | 26.92 | 24 |
| CM | 263 | 23.87 | 65 |
| ST | 451 | 24.17 | 112 |

All other positions remain outside the vertical-slice positional summary. `all
midfielders` is not CM and `all forwards` is not ST.

## 3. Fee evidence

For 577 strictly positive provider fee fields on slice-involved movements, the
EUR-provider-proxy distribution is:

| Statistic | EUR proxy |
|---|---:|
| P25 | 1,460,000 |
| P50 | 3,000,000 |
| P75 | 9,750,000 |
| P90 | 21,140,000 |
| P95 | 35,000,000 |
| P99 | 70,156,000 |
| Maximum | 127,000,000 |

The full positive tail is retained. These are not exact native-currency Money
facts: the provider supplies normalized EUR fields, not original contractual
currency/minor units. They can constrain distribution shape only after license,
definition and source-quality review.

The 1,649 unique zero-coded fields are `ZERO_CODE_UNRESOLVED`. Without a reliable type
column they may include free, loan, undisclosed, unknown or true zero cases; no
case is imputed and undisclosed never equals zero.

## 4. Transfer type and loans

FIFA reports that international permanent transfers involving an agreement are
typically under 20%, the majority are out-of-contract moves and the remainder
loans. This supplies broad international type shape, not a domestic Argentina or
Spain target. CIES loan evidence is analyzed separately in the contract
artifact.

The provider transfer table acquired here does not supply a freeze-quality
permanent/free/loan discriminator. `DS-TRANSFER-HISTORY` therefore remains
normalized only with limitations.

## 5. MarketValue boundary

Provider dated `market_value_in_eur` may support a future association study with
age, minutes, performance and context. It is:

- an external editorial/provider observation;
- not transaction consideration;
- not salary;
- not hidden capability;
- never a Performance input or proxy;
- not a value that can overwrite gameplay sporting facts.

The valuation model remains joint calibration. No coefficient is estimated.

## 6. ClubNeed and candidate field

Observable future ClubNeed proxies include strict position-minute
concentration, departures, age/contract structure and documented tactical
context. Injury can enter only through an authorized availability fact. No
ClubNeed score is computed.

Rumor/link lists were rejected as a candidate-field source because they do not
provide a reproducible denominator or distinguish agent/media narratives from
club interest.

## 7. Interest, Offer and SellerResponse

TMS observes completed international movements; the provider panel observes
public transfer outcomes. Neither observes the full sets:

- players considered;
- interest not converted to offer;
- offers not accepted;
- rejected/withdrawn bids;
- asking prices;
- private negotiation rounds.

Consequently Interest, Offer, SellerResponse, PlayerClubFit and negotiation
structure are `JOINT_CALIBRATION_REQUIRED` or `WEAKLY_IDENTIFIED`. A completed
transfer cannot serve as a Bernoulli success sample for Interest or Offer
without selection correction.

## 8. Money and timing

All exact future transaction observations must retain native currency, integer
minor units, transaction date, source and `TR-MONEY-NORMALIZE-V1` lineage. The
G3D-3B2 transform is unchanged. No binary floating-point number from the
research panel becomes competitive Money.

V1 remains `POST_SEASON_ONLY`. Observed mid-season transfers are research facts
only and do not reopen the gameplay market window.

## 9. Readiness

| Family | State | Limitation |
|---|---|---|
| movement/age shape | `READY_FOR_INITIAL_ESTIMATION` | at-risk denominator and movement-type validation needed |
| transfer frequency | `READY_WITH_LIMITATIONS` | zero-transfer cohort and domestic official registrations needed |
| fee positive-tail shape | `READY_WITH_LIMITATIONS` | provider EUR proxy, positive-only selection and undisclosed semantics |
| MarketValue association | `JOINT_CALIBRATION_REQUIRED` | editorial proxy and causal confounding |
| market scarcity | `JOINT_CALIBRATION_REQUIRED` | candidate field unobserved |
| ClubNeed / fit | `JOINT_CALIBRATION_REQUIRED` | latent from multiple club/player contexts |
| Interest / Offer | `WEAKLY_IDENTIFIED` | private/selected observations |
| SellerResponse / negotiation | `WEAKLY_IDENTIFIED` | asking/rejected offer data sparse and rumor-prone |

## 10. Provenance

Atomic claims: `EV-P1-MKT-001..010`. All tails and missing semantics are
preserved; no transfer probability, valuation coefficient, fee multiplier or
negotiation parameter is assigned.
