# G3D-4C P1 Contract, Salary & Loan Evidence

Status: `OBSERVATIONAL_EVIDENCE_ACQUIRED_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

## 1. Salary and wage environments

The acquired evidence is deliberately layered:

1. LALIGA league financial aggregates;
2. official club accounts/routes for Real Madrid, Barcelona and Atlético;
3. LALIGA Squad Cost Limit definitions;
4. historical global FIFPRO player survey distributions.

Squad Cost Limit combines salary, social charges, bonuses, acquisition costs,
agent commissions and amortisation, and may not be fully used. It cannot be
treated as a wage bill or divided by squad size into player salary.

FIFPRO's global survey reports a highly dispersed employment environment:
median net monthly pay USD 1,000–2,000, more than 45% below USD 1,000 and 2% at
or above USD 720,000 annual take-home. These historical global nominal USD
observations document tail/inequality shape; they are not Argentina/Spain V1
salary targets and are not normalized in this phase.

No salary rumor site is admitted as core evidence. Individual wages remain
`MORE_EVIDENCE_REQUIRED/BLOCKED_BY_LICENSE_OR_DISCLOSURE`.

## 2. Contract duration

FIFPRO's roughly 14,000-player survey reports global average duration 22.6
months, or 22.1 after excluding reported contracts over six years. Entry-mode
associations are:

| Entry mode | Reported mean duration |
|---|---:|
| free agent | 19.5 months |
| renewal | 19.7 months |
| transfer with fee | 25.4 months |
| academy promotion | 30.1 months |

This supports an initial duration-shape reference, not a V1 engine parameter.
Period, country, selection and survey reporting make local calibration joint.
FIFA RSTP supplies legal semantics only, not observed durations.

The provider player snapshot exposes current expiry dates, but no validated
contract-start history. Subtracting an assumed start date would invent initial
duration. Long contracts remain in the evidence tail; none is capped.

## 3. Renewal denominator

Renewal estimation requires:

```text
all contracts entering an expiry-risk window
vs
renewals completed before expiry
vs
expiry/free-agent/transfer/censoring outcomes
```

Counting announced renewals alone is selected on the outcome. Neither the
provider snapshot nor official reports acquired here supply this denominator,
so renewal frequency is `MORE_EVIDENCE_REQUIRED`. FIFPRO's renewal duration
observation is useful but is not a renewal probability.

## 4. Free agents

FIFA distinguishes out-of-contract international moves from permanent
agreements and loans. Transfer without reported fee is not automatically an
uncontracted move; a player can move on loan, at undisclosed consideration or
after expiry. Unsigned time must be observed separately from a free transfer.

The provider zero-coded fee field cannot resolve these states and is never used
as free-agent evidence.

## 5. Loans

CIES reports 3,178 loaned players across 75 leagues/57 associations, 9.5% of
players in the cross-section. Less than 30% were age 21 or younger, almost half
were at least 24, and 63.5% moved to a lower sporting-level club than their
contract holder.

These findings preserve three V1 boundaries:

- loan is not synonymous with a weak player;
- contract holder and sporting club remain distinct;
- age/profile and destination context affect observation but do not define a
  deterministic loan rule.

Loan duration, return, permanent conversion and Argentina/Spain local
incidence remain `MORE_EVIDENCE_REQUIRED`.

## 6. Privacy and provenance

No private contract, wage, offer or negotiation document is retained. Official
accounts are club/league aggregates. Survey evidence is already aggregate. Any
future row-level contract candidate must use dataset-scoped anonymous IDs,
preserve currency/date and exclude unverifiable rumor values.

## 7. Identifiability

| Family | Classification | Reason |
|---|---|---|
| broad contract-duration shape | `DIRECTLY_ESTIMABLE_WITH_LIMITATIONS` | global survey mean and entry-mode association; local panel absent |
| local contract duration | `MORE_EVIDENCE_REQUIRED` | no start/end longitudinal cohort |
| renewal probability | `WEAKLY_IDENTIFIED` | no all-at-risk denominator |
| loan broad incidence/age | `READY_WITH_LIMITATIONS` | CIES cross-section; local mapping required |
| loan duration/conversion | `MORE_EVIDENCE_REQUIRED` | no outcome panel |
| club wage environment | `INDIRECTLY_IDENTIFIABLE` Spain | official costs/limits; mixed salary/non-salary content |
| player salary model | `JOINT_CALIBRATION_REQUIRED` | sparse local disclosure and selection |
| salary–fee relationship | `JOINT_CALIBRATION_REQUIRED` | distinct processes; no direct mapping permitted |
| contract proposal/expectation | `WEAKLY_IDENTIFIED` | private offer terms not observed |

## 8. Provenance

Atomic claims: `EV-P1-CONTRACT-001..009`. No salary coefficient, contract
duration distribution parameter, renewal rate or loan probability is assigned.
