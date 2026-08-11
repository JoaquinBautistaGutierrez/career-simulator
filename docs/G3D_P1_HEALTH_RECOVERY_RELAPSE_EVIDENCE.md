# G3D-4B Health — Recovery, Relapse and Sequela Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Candidate lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4B-HEALTH-OBS-V1`

## 1. Observed endpoints and engine adapter

| Observed endpoint | Meaning | Health consumer |
|---|---|---|
| `RETURN_FULL_TEAM_TRAINING_AND_MATCH_SELECTION` | consensus end of time loss | closest evidence for medical-availability interval end |
| `RETURN_TO_TRAINING` | resumed training, not necessarily selectable or performing | recovery progress diagnostic |
| `RETURN_TO_PLAY` | first competitive appearance after injury | downstream availability/selection diagnostic |
| `RETURN_TO_PERFORMANCE` | regained a defined pre-injury participation/performance level | indirect sequela diagnostic |
| `MATCHES_MISSED` | calendar-dependent absence count | diagnostic only; cannot replace exact time interval |

These endpoints are never silently merged. G3C recovery requirement remains a
positive abstract burden sampled in log space; observed days constrain its
eventual mapping jointly with recovery work, quarter cadence and calendar.

## 2. Duration shape

The 16-year professional cohort contains 22,942 injuries across 494 team-
seasons. Published diagnosis distributions have positive support, mean often
above median and large upper tails. This is compatible with, but does not fit,
the normative LogNormal requirement.

| Evidence slice | N | Central shape | Tail evidence | Interpretation |
|---|---:|---|---|---|
| 31 common diagnoses | 15,269 | 42% mild; 56% moderate | 2% severe-diagnosis group | common time loss is mostly ≤28 days, but burden cannot ignore rare severe cases |
| structural hamstring | 2,379 | mean 18.0d; median 13d | P90 36d | right-skewed lower-limb muscle evidence |
| groin adductor | 1,754 | mean 13.5d; median 8d | P90 27d | broad diagnostic vocabulary remains a mapping issue |
| lateral ankle ligament | 1,260 | mean 14.9d; median 8d | P90 32d | meta-analysis confirms substantial between-study heterogeneity |
| knee MCL | 760 | mean 24.6d; median 16d | P90 56d | mixed moderate/long tail |
| ACL rupture | 183 | median 205d | 25 cases >270d | rare severe component within V1 knee-ligament family |
| concussion | 235 | mean 8.7d; median 5d | P90 14d | protocol/reporting era limits biological interpretation |
| hand/wrist/forearm | 238 | mean 19d; median 10d | 20% severe | GK-sensitive right tail |

No median is used as a deterministic minimum and no long observation is capped.
Fit diagnostics for future estimation must compare log-duration quantiles,
censoring-aware likelihood and family mixtures rather than only a mean.

## 3. Censoring and missingness

Future normalized observations must retain:

- right-censored episode at study or season end;
- ongoing recovery at source publication;
- retirement or career exit after injury;
- transfer/club exit before confirmed return;
- return date uncertainty;
- endpoint used by the source;
- missing training exposure and missing diagnosis specificity.

The 2006 consensus permits clinician-estimated completion for study exits; such
estimates must be tagged `CLINICIAN_ESTIMATED`, never treated as directly
observed. A career-ending injury is terminal/censored evidence, not an enormous
completed duration.

## 4. Relapse semantics

| Evidence term | Contractual treatment |
|---|---|
| `RECURRENCE` | same type and same anatomical site after return to full participation |
| `REINJURY` | source-specific; accepted as recurrence only if site/type/return definition match |
| `RELAPSE` | engine causal event; evidence adapter must show relationship to parent episode |
| `NEW_INJURY_SAME_SITE` | new episode unless source confirms recurrence definition |
| `SECOND_ACL_INJURY_CONTRALATERAL` | new knee-ligament injury with prior-history context, not same-site relapse |

The consensus early/late/delayed bands (`≤2m`, `2–12m`, `>12m`) are source
classification bins. They support a decaying post-return hazard but do not
replace G3C's continuous exponential relapse memory.

## 5. Recurrence observations

| Family/subset | Observation | Use |
|---|---|---|
| hamstring | 18% recurrence; 69% of recurrences within two months after RTP | strong baseline/decay-shape evidence |
| groin adductor | 17.7% reinjury in the diagnosis table | family baseline with definition review |
| lateral ankle | 13.7% table rate; meta-analysis 17.11% (95% CI 13.31–20.92) | directly estimable aggregate component, heterogeneous |
| knee MCL | 10.3% reinjury in diagnosis table | aggregated knee baseline component |
| ACL | 17.8% second injury after reconstruction/return to training; 9.3% ipsilateral, 8.5% contralateral | separates relapse from prior-history/new-side event |
| all injuries, older UEFA cohort | 12% reinjuries; mean absence 24d vs 18d non-reinjury | broad consistency check |

Previous identical injury is associated with elevated later muscle-injury rate,
but published hazard ratios are observational associations. They are not copied
into `health.history.*` or `health.relapse.*` coefficients.

## 6. Sequela and return-to-performance

Evidence supports the existence of post-return effects, not their direct latent
decomposition:

- an ACL matched cohort showed fewer games/minutes and lower performance for up
  to two seasons, with broad recovery by season three and an attacker-specific
  limitation in that sample;
- professional upper-limb studies describe rare persistent functional problems
  important to goalkeepers, but follow-up and diagnosis counts are sparse;
- reinjury, reduced minutes and delayed return-to-performance combine health,
  sporting opportunity, role and selection effects.

Therefore:

| Sequela family | Identifiability | Readiness |
|---|---|---|
| occurrence | `WEAKLY_IDENTIFIED` | qualitative tail exists; no defensible direct probability |
| temporary vs persistent type | `WEAKLY_IDENTIFIED` | endpoint heterogeneity and follow-up loss |
| burden magnitude | `JOINT_CALIBRATION_REQUIRED` | minutes/performance adapters needed; Health cannot write capabilities |
| temporary decay | `JOINT_CALIBRATION_REQUIRED` | repeated post-return observations are sparse |
| capability affinity | `PRODUCT/SYNTHETIC` plus joint validation | no medical observation maps directly to capability deltas |

No MarketValue observation is used as a health or sequela outcome.

## 7. Medical quality and recovery uncertainty

No `MedicalQuality` rating is inferred for any of the 16 detailed clubs.
Potential future observables are return endpoint, recurrence, censored duration,
availability and post-return participation, all adjusted for family/severity,
age and competition context. Club medical quality remains jointly identified
with case mix, player selection, diagnosis and rehabilitation practice.

Published between-club or between-source differences cannot be assigned to
medical quality without that adjustment.

## 8. Load/fatigue relationship

Fixture congestion and acute/chronic workload publications provide association
evidence only. G3D-4B preserves:

- exact recovery-day comparison and rate ratio from the congestion cohort;
- uncertainty across short- and long-congestion studies;
- disagreement and statistical criticism around ACWR;
- G3D-4A match-minute exposure as an upstream denominator source.

`health.load.*`, `health.fatigue.*`, `health.fitness.*` and injury interaction
coefficients therefore require joint calibration. There is no empirical basis
for a cooldown, protected band or deterministic threshold.

## 9. Readiness matrix

| Area | Readiness | Reason |
|---|---|---|
| Injury incidence | `READY_FOR_INITIAL_ESTIMATION` | multiple exposure-compatible professional cohorts; Argentina/Spain segmented |
| Injury families | `READY_WITH_LIMITATIONS` | all six covered; upper limb/concussion and aggregated knee mixtures need care |
| Severity | `READY_FOR_INITIAL_ESTIMATION` | bins and diagnosis-specific duration distributions available; latent mapping pending |
| Recovery | `READY_FOR_INITIAL_ESTIMATION` | right-skewed family durations and tails; endpoint/censoring adapter required |
| Relapse | `READY_WITH_LIMITATIONS` | strong muscle/ankle evidence; definitions and continuous decay jointly fitted |
| Sequelae | `WEAKLY_IDENTIFIED` | indirect participation/performance evidence only |
| Load/Fatigue | `JOINT_CALIBRATION_REQUIRED` | observational associations and methodological disagreement |
| Age effects | `READY_WITH_LIMITATIONS` | calf-specific association; no universal functional form |
| Position effects | `READY_WITH_LIMITATIONS` | direct GK evidence; exact CM/ST family rates absent |
| Medical quality | `WEAKLY_IDENTIFIED` | no club rating; case-mix-adjusted observables needed |

## 10. Calibration diagnostics unlocked

Future campaigns can compare injuries/player-season only after exposure
reconstruction, and must always collect:

- injuries per 1,000 total, match and training hours;
- family composition and `UNKNOWN_UNSPECIFIED` share;
- severity/time-loss bins, medians, means and upper quantiles;
- availability interval length and censored share;
- recurrence by family and time since return;
- long-injury/season-loss tail;
- GK versus outfield and, where data permits, exact CM/ST segments;
- age/context sensitivity;
- congestion/load sensitivity without hard thresholds.

Atomic claims and sources are indexed in
[G3D_P1_HEALTH_EVIDENCE_INDEX.md](G3D_P1_HEALTH_EVIDENCE_INDEX.md).
