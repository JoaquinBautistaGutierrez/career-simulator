# G3D-4A Performance, Production and Form Observational Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Candidate lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4A-OBS-V1`

## 1. Scope and legality

The panel source supplies exposure, goals and assists. The StatsBomb Open Data
reference supplies position-task event proxies for La Liga 2015/16 under a
noncommercial/reference-only boundary. StatsBomb attribution:

![StatsBomb logo](https://raw.githubusercontent.com/hudl/open-data/master/img/SB%20-%20Icon%20Lockup%20-%20Colour%20positive.png)

No event rows, player identities or reusable derived player tables are stored.
The event summaries below are research diagnostics and cannot enter published
competitive Data V1 without permission/license review.

## 2. ST production

Spain player-season counts remain the primary distribution-shape evidence.
Rate summaries use an explicit ≥900-minute subset and never replace raw counts.

| Metric | Population | N | Mean | Median | SD | P05 | P95 | P99 | Zero share |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| goals/90 | Spain ST ≥900m | 500 | .408 | .374 | .211 | .131 | .808 | 1.045 | .004 |
| assists/90 | Spain ST ≥900m | 500 | .134 | .110 | .116 | .000 | .358 | .542 | .156 |
| season goals | all Spain ST | 1,571 | 3.107 | — | — | — | — | — | .451 |
| season assists | all Spain ST | 1,571 | 1.052 | — | — | — | — | — | .584 |

Season goal variance is 23.796 versus mean 3.107; assist variance is 3.459
versus mean 1.052. This is observational support for overdispersion already
anticipated by the normative count family, not permission to change that family.

The event-reference subset (N=38 seasons ≥900 minutes) gives shots/90 2.570,
goals/90 .451, xG/90 .419 and assists/90 .135. It informs opportunity/conversion
separation but remains single-season and license-limited.

## 3. CM dimensions

Panel count evidence (N=1,766 Spain CM seasons):

| Metric | Mean | Variance | ≥900m rate mean | ≥900m median | P95 |
|---|---:|---:|---:|---:|---:|
| goals | .574 | 1.425 | .087/90 | .067/90 | .287/90 |
| assists | .719 | 2.140 | .112/90 | .085/90 | .298/90 |

Goals/assists are not a complete CM signal. Strict event proxies for N=12 CM
seasons ≥900 minutes add these descriptive dimensions:

| Proxy | Mean per 90 |
|---|---:|
| completed passes | 49.76 |
| progressive completed passes | 13.54 |
| key passes | 1.33 |
| pressures | 19.87 |
| interceptions | 1.30 |
| recoveries | 5.66 |
| tackles won | 1.42 |

The exact proxy definitions belong to `TR-P1-EVENT-PROXIES-V1`. The very small
strict-CM sample is not calibration-ready for causal task weights.

## 4. GK dimensions

Only outputs already authorized by the Performance specification are used:
shots faced, saves, goals conceded and clean sheets. The event-reference subset
has N=23 GK seasons ≥900 reconstructed minutes:

| Metric | Mean/90 | Median/90 | P05 | P95 |
|---|---:|---:|---:|---:|
| saves | 2.962 | 2.873 | 2.344 | 3.590 |
| goals conceded | 1.277 | 1.302 | .641 | 1.745 |
| shots on target faced proxy (`saved+conceded`) | 4.238 | 4.412 | 3.261 | 5.092 |
| full-match clean-sheet proxy | .284 | .283 | .131 | .469 |

No errors, penalty outcomes or new GK gameplay statistics were invented.
Command/distribution remain latent dimensions constrained only indirectly.

## 5. Temporal blocks and observed variability

Calendar-quarter-like blocks are adjacent blocks with at least 180 minutes.
They are diagnostics of observed production, not direct observations of latent
`Form`.

| Source/context | Position | Pair N | Metric | Adjacent-block correlation |
|---|---|---:|---|---:|
| event reference, Spain 2015/16 | CM | 34 | progressive-pass proxy | .726 |
| same | CM | 34 | key-pass proxy | .099 |
| same | GK | 57 | shots-faced proxy | .314 |
| same | ST | 88 | goals | .449 |
| same | ST | 88 | shots | .471 |
| panel, Spain | CM | 1,035 | goals / assists | .158 / .129 |
| panel, Spain | ST | 1,068 | goals / assists | .237 / .115 |

Count noise, ability, minutes, opponent/context and seasonal factors all enter
these correlations. The Form AR family therefore remains
`JOINT_CALIBRATION_REQUIRED`.

## 6. Geography and missingness

- Spain direct: usable exposure and ST/CM count distributions; one-season event
  task reference.
- Argentina direct: official metric semantics only; no acquired player-season
  distribution. This is a material P1 limitation.
- Multileague: useful distribution/tail/persistence reference, always segmented
  from the vertical-slice baselines.
- Missing event fields are not imputed in committed summaries.
- Sparse exposure is retained in raw-count populations; rate subsets declare
  their denominator gate.

## 7. Readiness

| Family | Identifiability | State |
|---|---|---|
| ST goals/assists count location and dispersion | `DIRECTLY_ESTIMABLE` after source/license approval | `READY_FOR_INITIAL_ESTIMATION` |
| CM goals/assists count shape | `DIRECTLY_ESTIMABLE` | `READY_FOR_INITIAL_ESTIMATION` |
| CM task weights/factors | `JOINT_CALIBRATION_REQUIRED` | `READY_WITH_LIMITATIONS`; event N/license block freeze |
| GK opportunity/save/concede shape | `INDIRECTLY_IDENTIFIABLE` | `READY_WITH_LIMITATIONS`; N=23/reference-only |
| task-factor correlations | `JOINT_CALIBRATION_REQUIRED` | `MORE_EVIDENCE_REQUIRED` |
| latent Form persistence/noise | `JOINT_CALIBRATION_REQUIRED` | temporal diagnostics available, not separately identified |
| Argentina position distributions | `MORE_EVIDENCE_REQUIRED` | official longitudinal/player-season source needed |

No coefficient, intercept, sigma, dispersion or correlation parameter is
published in this artifact.
