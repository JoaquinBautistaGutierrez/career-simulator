# G3D-4B Health Evidence — Source and License Manifest

Status: `P1_ACQUISITION_COMPLETE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieval date: `2026-08-10`

Owner/reviewer roles: `DATA_OWNER` / `PROVENANCE_REVIEWER` (solo-project mode)

This manifest covers only professional-football Health, Injury and Recovery
evidence acquired in G3D-4B. No source row, player identity, clinical record or
private medical datum is stored in the repository. Published aggregate facts
are observational constraints, not EngineParameterSet values.

## 1. Sources

| Source ID | Publisher / artifact | Tier | Usage and terms | Raw / derived redistribution | Scope and limitation |
|---|---|---:|---|---|---|
| `SRC-P1-HLT-FULLER-CONSENSUS-2006` | Fuller et al., [football injury surveillance consensus](https://pmc.ncbi.nlm.nih.gov/articles/PMC2491990/) | A | official FIFA-hosted expert consensus; `REFERENCE_ONLY` | no raw dataset; atomic definitions may be cited | normative observational definitions for injury, exposure, recurrence and severity; not a gameplay rule |
| `SRC-P1-HLT-META-2020` | López-Valenciano et al., [professional-football systematic review/meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC9929604/) | B | BMJ article; `REFERENCE_ONLY`, copyright/terms apply | no study-level rows retained; published pooled aggregates only | 44 studies; heterogeneous definitions and populations remain material |
| `SRC-P1-HLT-UEFA-18Y-2021` | Ekstrand et al., [18-season UEFA Elite Club Injury Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC8458074/) | B | peer-reviewed open article; `REFERENCE_ONLY` pending freeze review | published aggregates only | elite European male clubs; prospective exposure and time-loss surveillance |
| `SRC-P1-HLT-UEFA-PATTERNS-2011` | Ekstrand et al., [UEFA injury incidence and patterns](https://pubmed.ncbi.nlm.nih.gov/19553225/) | B | peer-reviewed abstract/article; `REFERENCE_ONLY` | no raw data | seven-season baseline and reinjury burden; older period |
| `SRC-P1-HLT-ARGENTINA-2025` | Baldjian et al., [six Argentinian professional second-division clubs](https://www.tandfonline.com/doi/abs/10.1080/00913847.2025.2568379) | B | peer-reviewed article; `REFERENCE_ONLY`, `LICENSE_REVIEW_REQUIRED_FOR_FREEZE` | no row-level data; cited aggregates only | Argentina-direct, 2022 season, six clubs; second division rather than slice top flight |
| `SRC-P1-HLT-SPAIN-SEASON-2012` | Noya Salces et al., [Spanish professional football one-season incidence](https://www.sciencedirect.com/science/article/abs/pii/S1886658111000533) | B | peer-reviewed article; `REFERENCE_ONLY`, `LICENSE_REVIEW_REQUIRED_FOR_FREEZE` | no raw data | Spain-direct aggregate; older single season and no reusable player-level panel |
| `SRC-P1-HLT-HAMSTRING-2023` | Ekstrand et al., [21-season hamstring study](https://bjsm.bmj.com/content/57/5/292) | B | peer-reviewed BMJ article; `REFERENCE_ONLY` | published aggregates only | detailed lower-limb muscle incidence, time loss and recurrence; hamstring is a subset of V1 lower-limb muscle |
| `SRC-P1-HLT-MUSCLE-RISK-2013` | Hägglund et al., [lower-extremity muscle injury risk factors](https://pubmed.ncbi.nlm.nih.gov/23263293/) | B | peer-reviewed article; `REFERENCE_ONLY` | no raw data | prior injury, age and broad positional associations; study cut-points are not engine thresholds |
| `SRC-P1-HLT-GROIN-2009` | Werner et al., [seven-season hip/groin UEFA study](https://pubmed.ncbi.nlm.nih.gov/19945984/) | B | peer-reviewed article; `REFERENCE_ONLY` | no raw data | family-level incidence; diagnostic entities do not map one-to-one to V1 groin/hip muscle |
| `SRC-P1-HLT-RTP-2020` | Krutsch et al., [16-year return-to-play study](https://pmc.ncbi.nlm.nih.gov/articles/PMC7146935/) | B | `CC BY-NC 4.0`; `REFERENCE_ONLY_NON_COMMERCIAL` | article findings may be cited noncommercially; no case rows retained | 22,942 injuries/494 team-seasons; time-loss definition, skew and diagnosis-specific tails |
| `SRC-P1-HLT-ANKLE-META-2022` | Flore et al., [lateral ankle time-loss and recurrence meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC9804772/) | B | open peer-reviewed article; `REFERENCE_ONLY` pending exact reuse review | published aggregates only | heterogeneous time-loss studies; high `I²` prevents false precision |
| `SRC-P1-HLT-ACL-2021` | Della Villa et al., [second ACL injuries after reconstruction](https://pubmed.ncbi.nlm.nih.gov/33846157/) | B | `CC BY-NC`; `REFERENCE_ONLY_NON_COMMERCIAL` | no participant rows | prospective professional cohort; ipsilateral and contralateral second injuries must remain distinct |
| `SRC-P1-HLT-ACL-RTP-2021` | Forsythe et al., [ACL return-to-play matched cohort](https://pubmed.ncbi.nlm.nih.gov/34104662/) | B | peer-reviewed article; `REFERENCE_ONLY`, terms review pending | published aggregates only | public-record matched cohort; participation/performance evidence is indirect for sequela burden |
| `SRC-P1-HLT-UPPER-2021` | Andersson et al., [hand/wrist/forearm prospective cohort](https://journals.sagepub.com/doi/10.1177/2325967120977091) | B | `CC BY-NC-ND 4.0`; `REFERENCE_ONLY_NON_COMMERCIAL` | article may be shared unaltered with attribution; only cited aggregates retained | 558 team-seasons; strong GK contrast but not all upper-limb diagnoses |
| `SRC-P1-HLT-GK-QATAR-2013` | Alentorn-Geli et al., [goalkeeper vs field-player injury patterns](https://pubmed.ncbi.nlm.nih.gov/23770326/) | B | peer-reviewed article; `REFERENCE_ONLY` | no raw data | 3-season Qatar first division; supports profile differences, not separate CM/ST rates |
| `SRC-P1-HLT-CONCUSSION-2025` | Jones et al., [English professional football concussion incidence/burden](https://pubmed.ncbi.nlm.nih.gov/40557254/) | B | peer-reviewed article; `REFERENCE_ONLY`, terms review pending | published aggregates only | diagnosis/reporting depends on medical detection and era; no private records |
| `SRC-P1-HLT-CONGESTION-2013` | Bengtsson et al., [fixture congestion and injury rates](https://bjsm.bmj.com/content/47/12/743) | B | peer-reviewed BMJ article; `REFERENCE_ONLY` | no raw sequence data | observational association; cannot identify the engine load coefficient alone |
| `SRC-P1-HLT-LOAD-REVIEW-2022` | Jiang et al., [professional male soccer workload systematic review](https://pmc.ncbi.nlm.nih.gov/articles/PMC9602492/) | B | `CC BY 4.0`; `REDISTRIBUTABLE_DERIVED` with attribution | no study-level data retained | reports inconsistent GPS/ACWR results and no defensible universal low-risk threshold |
| `SRC-P1-HLT-ACWR-CRITIQUE-2020` | Impellizzeri et al., [ACWR conceptual issues](https://pubmed.ncbi.nlm.nih.gov/32502973/) | C | peer-reviewed methodological commentary; `REFERENCE_ONLY` | no raw data | methodological caution only; supplies no football rate target |
| `SRC-P1-HLT-REPORTING-2010` | Bjørneboe et al., [medical-staff reporting completeness](https://pubmed.ncbi.nlm.nih.gov/20459470/) | B | peer-reviewed article; `REFERENCE_ONLY` | no raw data | indicates under-ascertainment even in prospective surveillance |

## 2. Usage boundary

- Every source is a public sports-health publication; no private diagnosis,
  treatment record or inferred medical fact was collected.
- `REFERENCE_ONLY` permits citation and documented aggregate use for research;
  it does not authorize redistribution of the underlying study data.
- `CC BY-NC`, `CC BY-NC-ND` and unresolved journal terms prevent promotion of
  those observations into a commercial/redistributable Data V1 artifact without
  a new legal review or a separately licensed source.
- No raw PDF, HTML dump, table export or player-level dataset was committed.
- Source URLs, periods, definitions and extracted aggregates are sufficient to
  reproduce the documentary review; they are not a substitute for future
  source-vintage retention where a frozen dataset requires it.

## 3. Privacy

The committed artifacts contain only aggregate cohorts. No player name,
external player ID, `AnonymousObservationId`, diagnosis date or club medical
record is retained. A future row-level acquisition must use deterministic
dataset-scoped anonymous IDs and may contain only publicly documented sporting
health observations allowed by its license.

## 4. Freeze consequences

Both Health DatasetDefinitions can support initial estimation from published
aggregates, but neither is `FROZEN`. Freeze still requires a reproducible,
licensed observation artifact or a documented aggregate-only publication
policy, formal six-family transforms, and validation of censoring and source
definition compatibility.
