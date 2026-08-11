# G3D-4B Health — Injury Incidence Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Candidate lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4B-HEALTH-OBS-V1`

## 1. Boundary

This artifact preserves the six candidate V1 InjuryDefinitions and maps
external labels into them. It does not alter cumulative hazards, Poisson
multiplicity, severity sampling, relapse structure or interval semantics. Every
rate retains its injury definition, origin and exposure denominator.

Observed incidence is not an EngineParameterSet hazard. Future estimation must
reconcile source definition, family coverage, calendar exposure and selection
before translating an observation into a parameter candidate.

## 2. Injury-definition classes

| Class | Observed meaning | Pooling rule |
|---|---|---|
| `ALL_PHYSICAL_COMPLAINT` | any football-related physical complaint | never pool directly with time-loss incidence |
| `MEDICAL_ATTENTION` | assessed by qualified medical staff | preserve separately; medical-support intensity changes ascertainment |
| `TIME_LOSS` | unable to take full part in future football training or match play | primary V1 observational comparator |
| `TIME_LOSS_GT_1_DAY` | source excludes zero-day or next-day returns | preserve as restricted comparator |
| `MATCH_MISSED` | absence measured by match non-participation | diagnostic only unless match calendar denominator is reconstructed |
| `PUBLICLY_REPORTED` | public/media availability record | complementary evidence; never the primary hazard baseline |

The repository stores `injuryDefinitionClass` with each future normalized row.
An incidence without a compatible exposure denominator is `UNUSABLE_FOR_RATE`,
not silently converted to injuries/player-season.

## 3. Six-family mapping contract

| V1 InjuryDefinition | Admissible source labels | Mapping | Explicit exclusions / ambiguity |
|---|---|---|---|
| `INJ-LOWER-LIMB-MUSCLE` | hamstring, quadriceps, calf, lower-limb muscle/tendon strain/rupture | `FAMILY_MAPPING`; diagnosis-specific rows retained below family | groin/adductor/iliopsoas excluded; “leg pain” is `AMBIGUOUS_MAPPING` |
| `INJ-GROIN-HIP-MUSCLE` | adductor injury/pain with muscular or tendon diagnosis, iliopsoas/hip-flexor muscle injury | `FAMILY_MAPPING` | non-specific groin pain, hernia, pubic/bone or intra-articular hip labels remain `AMBIGUOUS_MAPPING` or `UNMAPPED` |
| `INJ-ANKLE-LIGAMENT` | lateral/medial ankle ligament sprain/rupture, syndesmosis when ligamentous | `FAMILY_MAPPING` | ankle contusion, fracture, synovitis and unspecified ankle injury excluded |
| `INJ-KNEE-LIGAMENT` | ACL, MCL, PCL, LCL sprain/rupture | `FAMILY_MAPPING`; severe ACL tail tagged | meniscus, cartilage, patellar tendon, contusion and unspecified knee injury excluded |
| `INJ-UPPER-LIMB-TRAUMA` | acute traumatic hand/wrist/forearm/shoulder/elbow fracture, dislocation, sprain, contusion or laceration | `FAMILY_MAPPING` | upper-limb overuse/tendinopathy is `UNMAPPED` for this V1 trauma family |
| `INJ-HEAD-CONCUSSION` | clinically diagnosed sport-related concussion | `EXACT_MAPPING` when diagnostic status is explicit | head impact/potential concussion without diagnosis is `AMBIGUOUS_MAPPING`; other head trauma is `UNMAPPED` |
| evidence-only `UNKNOWN_UNSPECIFIED` | “knock”, “muscle problem”, body region absent or diagnosis withheld | `UNMAPPED` | never reassigned to the most frequent family |

Required row fields are `injuryId`, source label, body region, diagnosis
specificity, origin (`MATCH_ORIGIN|TRAINING_ORIGIN|UNKNOWN_ORIGIN`), recurrence
semantics, time-loss endpoint, exposure denominator and mapping state
(`EXACT_MAPPING|FAMILY_MAPPING|AMBIGUOUS_MAPPING|UNMAPPED`).

## 4. Overall incidence evidence

Rates are displayed side-by-side, not pooled.

| Evidence | Population / definition | Exposure | Overall /1,000h | Match /1,000h | Training /1,000h | Interpretation |
|---|---|---:|---:|---:|---:|---|
| professional meta-analysis | professional men; mixed but predominantly time-loss | 44 studies | 8.1 | 36.0 | 3.7 | broad reference; heterogeneity preserved |
| UEFA 18 seasons | elite European male clubs; time-loss | 1,784,281h | 6.6 (95% CI 6.5–6.7) | 23.8 | 3.4 | strongest longitudinal elite reference |
| Argentina direct | six second-division professional clubs; time-loss | source-reported player-hours | 3.67 (95% CI 2.6–4.6) | 26.42 | 1.91 | local context, one season, not top-flight baseline |
| Spain direct | professional Spanish season; source definition | 244,835h | 8.94 | source not acquired for this summary | source not acquired for this summary | local aggregate, older single season |

The match/training contrast is directionally stable; absolute levels are not
interchangeable. Argentina and Spain direct evidence remain segmented from UEFA
and global references.

## 5. Family evidence

| Family | Empirical evidence available | Readiness | Limitation |
|---|---|---|---|
| lower-limb muscle | pooled muscle/tendon 4.6/1,000h; UEFA hamstring match 4.99 vs training .52; diagnosis-specific duration and recurrence | `READY_FOR_INITIAL_ESTIMATION` | V1 aggregates hamstring/quadriceps/calf; era trend and exact family composition require joint fit |
| groin/hip muscle | UEFA hip/groin total 1.1, match 3.5, training .6; adductor and iliopsoas labels; time-loss distribution | `READY_WITH_LIMITATIONS` | groin diagnostic vocabulary is heterogeneous; non-muscular groin pain must be excluded |
| ankle ligament | large lateral-ankle index cohort plus recurrence meta-analysis | `READY_FOR_INITIAL_ESTIMATION` | lateral evidence dominates; medial/syndesmosis tails less precise |
| knee ligament | MCL distribution and ACL severe tail/second-injury evidence | `READY_WITH_LIMITATIONS` | aggregated V1 family combines frequent moderate MCL with rare extreme ACL; mixture is jointly estimated |
| upper-limb trauma | 238 hand/wrist/forearm cases over 3.69m hours; acute-trauma and GK contrast | `READY_WITH_LIMITATIONS` | shoulder/elbow evidence and non-European positional replication remain sparse |
| head concussion | professional diagnosed-concussion cohorts and duration evidence | `READY_WITH_LIMITATIONS` | detection, protocol and reporting era materially affect incidence/time loss |

### 5.1 Selected family summaries

| Diagnosis subset | N | Mean absence | Median | IQR | P10–P90 | Reinjury/recurrence observation |
|---|---:|---:|---:|---:|---:|---:|
| structural hamstring | 2,379 | 18.0d | 13d | 7–22d | 4–36d | 17.5% in RTP table; 18% in 21-season cohort |
| groin adductor pain | 1,754 | 13.5d | 8d | 4–15d | 2–27d | 17.7% |
| lateral ankle ligament | 1,260 | 14.9d | 8d | 4–18d | 2–32d | 13.7%; meta-analysis 17.11% (95% CI 13.31–20.92) |
| knee MCL | 760 | 24.6d | 16d | 7–35.5d | 3–56d | 10.3% |
| ACL rupture | 183 in RTP table | — | 205d | source table retained | 25 cases >270d | second ACL studied separately |
| concussion | 235 | 8.7d | 5d | 4–8d | 2–14d | observed return reflects protocol/detection era |
| hand/wrist/forearm trauma | 238 | 19d overall | 10d | source-specific | long severe tail | only five reinjuries in the cohort |

Means, medians and tails are intentionally all retained. No observation is
winsorized and no median becomes a minimum recovery duration.

## 6. Match/training origin

- UEFA and Argentina cohorts directly support distinct `MATCH_ORIGIN` and
  `TRAINING_ORIGIN` rates.
- Hamstring match incidence is about ten times training in the 21-season study,
  but that ratio is diagnosis-, era- and exposure-specific.
- Upper-limb hand/wrist injuries occurred frequently in goalkeeper training,
  while the overall family still had greater match incidence than training.
- A source without origin remains `UNKNOWN_ORIGIN`; it cannot inherit the
  overall match/training split.
- G3D-4A `teamOpportunityMinutes` may inform future match exposure. Training
  hours remain a separate missing denominator and cannot be reconstructed from
  match minutes alone.

## 7. Position and age coverage

| Segment | Coverage | State |
|---|---|---|
| GK | direct professional upper-limb incidence and layoff; direct lower muscle/lower-limb contrast | `OBSERVATIONAL_SUMMARY_AVAILABLE` |
| CM | sources generally publish “midfielder”; no exact CM family rate acquired | `POSITION_MAPPING_LIMITATION` |
| ST | sources generally publish “forward/attacker”; no exact ST family rate acquired | `POSITION_MAPPING_LIMITATION` |
| age | older-than-mean associated with higher calf rate but not other studied muscle groups | `READY_WITH_LIMITATIONS`; no universal linear effect |

No all-midfielder row is relabeled CM and no all-forward row is relabeled ST.
The GK contrast supports position context; it does not supply the final position
coefficient.

## 8. Congestion and load

Professional UEFA data associate ≤4 versus ≥6 recovery days with total-injury
RR 1.09 and muscle-injury RR 1.32. Systematic review evidence supports a
possible short-congestion effect but finds GPS/ACWR associations inconsistent.
The ACWR literature has causal and ratio-method concerns.

Consequences:

1. empirical load and congestion belong in joint calibration;
2. no external ACWR “safe zone” becomes a threshold;
3. G3C acute/chronic EWMA mathematics is unchanged;
4. Role/Minutes exposure evidence is reused, not duplicated;
5. training load, fitness and fatigue latent states remain only indirectly
   identified.

## 9. Reporting and geographic limitations

- medical-staff prospective reporting can still under-ascertain injuries;
- public injury databases are not used as the hazard source;
- the Argentina study is direct but second-division and one-season;
- the Spain direct estimate is older and aggregate-only;
- UEFA evidence dominates sample size and may not reproduce Argentina medical,
  travel or training context;
- time-loss definitions omit symptoms that do not prevent full participation;
- diagnosis specificity and protocol era especially affect concussion and groin
  mapping.

Atomic claims and provenance are in
[G3D_P1_HEALTH_EVIDENCE_INDEX.md](G3D_P1_HEALTH_EVIDENCE_INDEX.md).
