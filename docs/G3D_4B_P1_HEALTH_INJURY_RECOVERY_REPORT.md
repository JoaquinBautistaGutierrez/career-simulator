# G3D-4B — P1 Health, Injury & Recovery Report

Status: `COMPLETE_WITH_LIMITATIONS`

Result: `GO_FOR_G3D_4C_WITH_HEALTH_EVIDENCE_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4B-HEALTH-OBS-V1`

## 1. Outcome

G3D-4B acquired exposure-compatible professional-football injury evidence,
mapped it to the six V1 InjuryDefinitions, separated match/training origin and
return endpoints, and classified Health parameter identifiability. It assigned
no hazard, coefficient, sigma, persistence, duration or recurrence parameter;
changed no G3C mathematics or G3D-3D product target; and published no Data V1.

| Area | Readiness | Usable evidence | Material limitation |
|---|---|---|---|
| injury incidence | `READY_FOR_INITIAL_ESTIMATION` | overall/match/training player-hour cohorts, including Argentina/Spain direct | heterogeneous definitions/eras; local sources limited |
| six families | `READY_WITH_LIMITATIONS` | all six have empirical family or diagnosis evidence | knee mixture, shoulder/elbow, concussion and exact CM/ST are incomplete |
| severity | `READY_FOR_INITIAL_ESTIMATION` | consensus bins plus diagnosis-specific distributions | observed bins require a latent-continuous adapter |
| recovery | `READY_FOR_INITIAL_ESTIMATION` | means, medians, quantiles and long tails | endpoint and censoring differences; abstract recovery work remains joint |
| relapse | `READY_WITH_LIMITATIONS` | muscle, groin, ankle, MCL and ACL history evidence | recurrence definitions and decay require joint fit |
| sequelae | `WEAKLY_IDENTIFIED` | indirect post-return participation/performance | no direct occurrence/type/burden/decay estimates |
| load/fatigue | `JOINT_CALIBRATION_REQUIRED` | congestion association and workload review | causal uncertainty; no ACWR threshold accepted |
| age/position | `READY_WITH_LIMITATIONS` | calf-age association and direct GK profile | no universal age form; exact CM/ST family rates absent |
| MedicalQuality | `WEAKLY_IDENTIFIED` | candidate observables identified | no club rating or case-mix-adjusted estimate |

## 2. Acquisition inventory

- **43** EvidenceRecords: `EV-P1-INJ-001..025`, `EV-P1-REC-001..008`,
  `EV-P1-REL-001..005`, `EV-P1-SEQ-001..002`, `EV-P1-LOAD-001..003`.
- **20** new sources: consensus, systematic reviews, professional prospective
  cohorts, family/RTP studies and one methodological critique.
- Evidence tier distribution: **A=6, B=36, C=1, D=0**.
- **2** existing canonical datasets promoted to
  `NORMALIZED_WITH_LIMITATIONS`; none is `FROZEN`.
- **19** Health target IDs reconciled: 4 calibration-ready, 6 with summaries,
  8 with acquired indirect evidence, 1 invariant unchanged and no new target.
- **12** existing Health golden vectors gain empirical fixture basis; no
  expected output is computed.

## 3. Coverage

### 3.1 Geography

| Class | Coverage |
|---|---|
| `ARGENTINA_DIRECT_LIMITED` | prospective time-loss incidence from 195 players/six professional second-division clubs in 2022; total/match/training rates and family ordering |
| `SPAIN_DIRECT_LIMITED` | 2,184 injuries/244,835 exposure hours from one professional season; no reusable player/family panel |
| `MULTI_LEAGUE_REFERENCE` | UEFA elite-club cohorts up to 21 seasons, return-to-play cohorts and family-specific surveillance |
| `GLOBAL_REFERENCE` | professional-male meta-analysis and methodology only; never local baseline by default |

### 3.2 Position

- `GK`: direct professional exposure shows substantially higher upper-limb
  trauma and lower lower-limb/muscle incidence than outfield players.
- `CM`: published “midfielder” categories are not mapped to CM; exact family
  incidence remains `POSITION_MAPPING_LIMITATION`.
- `ST`: published “forward/attacker” categories are not mapped to ST; exact
  family incidence remains `POSITION_MAPPING_LIMITATION`.

All three positions are represented in the readiness report, but only GK has a
direct position-specific empirical family contrast suitable for initial fit.

## 4. Taxonomy and definitions

The six V1 candidates remain unchanged:

1. lower-limb muscle;
2. groin/hip muscle;
3. ankle ligament;
4. knee ligament;
5. upper-limb trauma;
6. head concussion.

Source labels use `EXACT_MAPPING`, `FAMILY_MAPPING`, `AMBIGUOUS_MAPPING` or
`UNMAPPED`. `UNKNOWN_UNSPECIFIED` is retained and never reassigned. Medical-
attention, time-loss, >1-day, match-missed and public-report definitions remain
separate. Match and training rates always retain their own player-hour
denominators.

## 5. Principal empirical summaries

1. Broad professional reference: 8.1 injuries/1,000h overall, 36 match and 3.7
   training; UEFA 18-season surveillance: 6.6, 23.8 and 3.4 respectively.
2. Argentina direct: 3.67 overall, 26.42 match and 1.91 training per 1,000h;
   hamstring/adductor/lateral ankle common, ACL greatest time-loss burden.
3. Hamstring: match 4.99 versus training .52/1,000h; structural cases median
   13 days and P90 36.
4. Groin/adductor and lateral ankle index cases both have median 8 days but
   distinct IQR/tails; ankle recurrence meta-analysis is 17.11% with substantial
   duration heterogeneity.
5. Knee MCL median is 16 days with P90 56, while ACL median is 205 days and a
   visible >270-day tail; aggregation must preserve this mixture.
6. Hand/wrist/forearm incidence is low overall but seven times higher for GK
   than outfield players, with mean layoff 23 versus 15 days.
7. Concussion time loss is detection/protocol dependent and cannot be treated as
   pure biological recovery.
8. Mean duration commonly exceeds median; tails are retained without caps or
   winsorization.

## 6. Relapse, sequelae and load

- Recurrence remains same type/site after full return; consensus time bands are
  evidence bins, not a fixed engine relapse window.
- Hamstring evidence shows 18% recurrence and 69% of recurrences within two
  months; ankle, groin and MCL provide family comparisons.
- Contralateral second ACL injuries are new injuries with history context, not
  same-site relapse.
- Post-return ACL and upper-limb studies support temporary/persistent effects as
  plausible tails but do not identify V1 sequela probabilities or burdens.
- Congestion evidence supports a smooth association; systematic review and ACWR
  critique prohibit importing a universal safe band, cooldown or threshold.

## 7. Licensing, privacy and provenance

- raw external data and PDFs remain outside the repository;
- only cited published aggregates are committed;
- no player identity or private medical information is stored;
- source terms are mostly `REFERENCE_ONLY`; several are noncommercial or
  require freeze-specific legal review;
- evidence can support initial estimation, but a commercial/redistributable
  frozen input still needs an approved aggregate-only policy, permission or an
  alternative licensed source;
- every material number maps to an atomic EvidenceRecord and source ID.

## 8. Source incompatibilities and bias

The main incompatibilities are injury definition, zero-day inclusion, return
endpoint, origin denominator, competition level, era/protocol, diagnostic
specificity and recurrence definition. They are segmentation dimensions, not
noise to average away. Prospective medical reporting itself may undercount time-
loss injuries; public injury sites were therefore not used as the hazard source.

Censoring includes ongoing injury, end of study/season, transfer, retirement and
loss to follow-up. Career-ending cases are terminal observations, not enormous
completed durations.

## 9. Registry reconciliation

- Dataset Registry: `DS-INJURY-EXPOSURE` and `DS-INJURY-RECOVERY` advance to
  `NORMALIZED_WITH_LIMITATIONS`.
- Target Registry: the 19 Health targets gain evidence/readiness metadata; the
  186 IDs and 77 `PT-*` product targets remain unchanged.
- Parameter Registry: Health branches gain evidence and identifiability only;
  all **275** templates remain `UNASSIGNED` and value-free.
- Golden Registry: all 12 Health goldens gain
  `empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS`; all **139** remain
  `SPECIFIED` without expected outputs.

## 10. Parameter identifiability

### Directly estimable observational components

- family/origin baseline incidence and exposure component;
- severity-bin/continuous-latent observation adapter;
- family recovery-duration location/dispersion under censoring;
- diagnosis/family recurrence baselines as observations.

### Joint calibration required

- load, fatigue and fitness effects;
- smooth age and exact position effects;
- prior-history and continuous relapse memory;
- recovery work, medical availability and restriction adapters;
- MedicalQuality and RecoveryCapacity effects;
- family mixtures, especially knee ligament;
- overall burden and cross-system availability consequences.

### Weakly identified / synthetic

- sequela occurrence, temporary/persistent mix, burden and decay;
- sequela-to-capability affinity (Development adapter only);
- club MedicalQuality;
- exact CM/ST family modifiers and rare shoulder/elbow/concussion tails.

## 11. Remaining blockers

1. freeze-quality licensed row-level or approved aggregate-only Health artifact;
2. Argentina top-flight multi-season exposure and Spain contemporary family
   panel;
3. exact CM/ST position mapping and broader GK replication;
4. standardized training exposure/load histories;
5. censored episode-level recovery/recurrence data;
6. post-return longitudinal data for sequela decomposition;
7. club baseline evidence before MedicalQuality can be modeled;
8. future parameter candidate, sensitivity analysis, Monte Carlo and expected
   golden outputs.

These are calibration/freeze limitations, not blockers for beginning G3D-4C.

## 12. Gates and next phase

G3D-4C may begin because Health evidence, definitions, denominators, mapping,
privacy and license limitations are explicit. Initial integrated calibration is
not publication-ready: all later P1 domains, parameter values, Data V1 freeze,
independent goldens and acceptance runs remain pending.

No G3D-4C research or calibration work is included here.

## 13. Canonical references

- [Health Evidence Index](G3D_P1_HEALTH_EVIDENCE_INDEX.md)
- [Health Source and License Manifest](G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST.md)
- [Injury Incidence Evidence](G3D_P1_HEALTH_INJURY_INCIDENCE_EVIDENCE.md)
- [Recovery, Relapse and Sequela Evidence](G3D_P1_HEALTH_RECOVERY_RELAPSE_EVIDENCE.md)
- [Health Observational Hash Manifest](G3D_P1_HEALTH_OBSERVATIONAL_HASH_MANIFEST.md)
- [Health Injury Recovery Math Spec](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)

> **Cardinality correction (G3D-4F/4G):** the 275-template count reported at
> the time was subsequently audited as a prose/counting error. The canonical
> registry contains 268 unique normative parameter templates; no seven paths
> are missing.
