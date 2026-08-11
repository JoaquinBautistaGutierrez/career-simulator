# G3D-4A — P1 Player, Development, Role & Performance Report

Status: `COMPLETE_WITH_LIMITATIONS`

Result: `GO_FOR_G3D_4B_WITH_PLAYER_EVIDENCE_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4A-OBS-V1`

## 1. Outcome

G3D-4A acquired calibration-ready observational shapes for Spain and a
multileague reference panel, documented official but incomplete Argentina
coverage, and preserved position-specific GK/CM/ST evidence. It created no
EngineParameterSet value, product target, scoring value, gameplay rule or Data
V1 publication.

| Subsystem | Readiness | Main usable evidence | Material limitation |
|---|---|---|---|
| Creation | `READY_WITH_LIMITATIONS` | covered first-tier emergence sensitivity by GK/CM/ST; LPF debut aggregate | not true professional debut; no Argentina age/position panel; hidden capabilities remain latent |
| Development | `READY_WITH_LIMITATIONS` | longitudinal La Liga research, age×exposure and within-player change heterogeneity | survivorship/censoring; GK longitudinal performance missing; exposure ≠ capability |
| Role/Minutes | `READY_FOR_INITIAL_ESTIMATION` for Spain/reference; global `READY_WITH_LIMITATIONS` | share/zero/bands, appearance/start availability and same-club/change persistence | Argentina player panel missing; SportingRole latent |
| Performance | `READY_WITH_LIMITATIONS` | Spain ST/CM count shapes; GK/CM/ST event proxies; temporal-block diagnostics | event reference noncommercial/small-N; Argentina distributions missing; Form jointly identified |

## 2. Acquisition inventory

- **30** EvidenceRecords: `EV-P1-CRE-001..006`, `EV-P1-DEV-001..007`,
  `EV-P1-ROLE-001..007`, `EV-P1-PERF-001..010`.
- **10** sources: two official Argentina artifacts, a public panel and its
  metadata, three peer-reviewed football studies, one methodological preprint,
  and StatsBomb source/license artifacts.
- Evidence tiers by record: **A=3, B=25, C=2, D=0**.
- Two deterministic aggregate transforms with canonical SHA-256 outputs.
- Six canonical DatasetDefinitions advanced only to candidate states; none is
  `FROZEN`.

## 3. Coverage

### 3.1 Geography

| Class | Coverage |
|---|---|
| `SPAIN_DIRECT` | 5,320 games, 47,004 strict appearances, 4,335 player-club-season-position observations; La Liga 2015/16 event reference |
| `ARGENTINA_DIRECT` | official annual count of 185 Primera debuts and one official matchday with minutes/performance metric semantics |
| `ARGENTINA_DIRECT_LIMITED` | no acquired player-season/longitudinal panel; no distribution can be treated as calibrated |
| `MULTI_LEAGUE_REFERENCE` | 14 established first tiers, 54,113 strict season observations and 17,547 players |
| `GLOBAL_REFERENCE` | methodological selection-bias evidence only; no numeric football target |

### 3.2 Position

- `GK`: direct Spain exposure/persistence plus small event save/concede/clean-
  sheet reference; longitudinal aging evidence remains insufficient.
- `CM`: direct Spain exposure/count evidence and small task-proxy reference;
  never reduced to goals/assists.
- `ST`: direct Spain exposure/goals/assists distributions and event opportunity/
  conversion reference.

Only exact position mappings enter strict summaries. Ambiguous observations are
`POSITION_MAPPING_UNCERTAIN`, not assigned to a broader group.

### 3.3 Time

- panel: seasons 2012–2025 where covered, with source snapshot before cutoff;
- longitudinal studies: 2012/13–2019/20 and 2015/16–2018/19;
- event reference: closed La Liga 2015/16 edition;
- Argentina official facts: 2025;
- period types: `MULTI_SEASON`, `LONGITUDINAL` and `SINGLE_EDITION` remain
  explicit and are never pooled without context.

## 4. Principal empirical summaries

1. Spain minute-share median: CM .080, GK .026, ST .096; zero shares .127,
   .433 and .099 respectively.
2. Same-club Spain year-to-year minute-share correlation: CM .606, GK .726,
   ST .651; after club change .300, .210 and .394.
3. Spain ST ≥900 minutes: goals/90 mean .408, P95 .808, P99 1.045; assists/90
   mean .134 and zero share .156.
4. Spain CM season goals mean/variance .574/1.425 and assists .719/2.140,
   preserving empirical overdispersion.
5. Event-reference GK: saves/90 2.962, goals conceded/90 1.277 and clean-sheet
   proxy .284 across N=23 qualified seasons.
6. Cross-sectional and within-player age evidence supports position-specific,
   heterogeneous smooth trajectories, not a universal peak or hard threshold.
7. Adjacent-block performance correlations are positive but metric-dependent;
   latent Form persistence cannot be isolated without joint calibration.

Full N, periods, quantiles, zero masses and caveats are in the four evidence
artifacts. Tails and sparse exposure were retained; no automatic winsorization
or silent exclusion was applied.

## 5. Licensing, privacy and provenance

- raw external data is outside the repository;
- committed artifacts contain aggregates only and no player identity;
- the panel dataset declares CC0, but its Transfermarkt origin remains
  `LICENSE_REVIEW_REQUIRED_FOR_FREEZE`;
- StatsBomb and Dendir references are noncommercial/reference-only and cannot
  be promoted into competitive/commercial Data V1 without permission/review;
- LPF sources are official atomic facts/semantics, not a redistributable player
  dataset;
- every number maps to an EvidenceRecord, source and transform/hash.

## 6. Registry reconciliation

- Dataset Registry: six related candidates advance to
  `NORMALIZED_WITH_LIMITATIONS`; four related datasets remain unchanged.
- Target Registry: **48** target IDs gain acquired/summary/calibration-ready
  evidence metadata; **5** remain explicitly `STILL_BLOCKED`; the 186-ID and
  77-`PT-*` sets are unchanged.
- Parameter Registry: affected branches gain source/dataset/identifiability
  metadata; all **275** templates remain value-free and `UNASSIGNED`.
- Golden Registry: Creation, Development, Role/Minutes, ST/CM/GK and Performance
  groups gain `empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS`; all **139**
  remain `SPECIFIED` with no expected outputs.

## 7. Identifiability

### Directly estimable observational components

- Role/Minutes share shape, zero mass and position distributions;
- ST goal/assist count location/dispersion after context/exposure gating;
- CM goal/assist count shape;
- observed same-club/club-change persistence associations (not causal AR values).

### Joint calibration required

- latent creation capabilities, traits, power and factor correlations;
- Development age curves, player offsets and noise after selection/censoring;
- SportingRole utilities/transitions and TeamMinutesOpportunity adapters;
- CM task factors/weights and GK support/opportunity separation;
- latent Form, shared factors and repeated-performance correlations.

### No direct evidence in G3D-4A

- preferred-foot distribution;
- Development retraining/environment effects;
- pressure/surprise Performance targets;
- Argentina player-season distributions;
- freeze-quality commercially usable event-task source.

## 8. Bias and required future controls

Development and aging estimates must explicitly handle left truncation, right
censoring, professional survivorship, lower-tier disappearance, minutes-based
selection and club-change opportunity. Cross-sectional curves cannot stand in
for individual development. Sparse-exposure observations remain in population
summaries; rate subsets declare gates and retain raw-count denominators.

## 9. Gates and next phase

G3D-4B may begin because the evidence contract, namespace and registry overlays
are coherent and no Health research was consumed. Initial integrated
calibration is **not** ready for publication: Argentina direct coverage, GK
aging, event-source licensing, latent joint identification, all other P1
subsystems, Data V1 freeze and expected goldens remain outstanding.

No work from G3D-4B, G3D-4C, G3D-4D, G3D-4E or parameter calibration is included
in this closure.

## 10. Normative references

- [P1 Evidence Index](G3D_P1_PLAYER_EVIDENCE_INDEX.md)
- [Source and License Manifest](G3D_P1_PLAYER_SOURCE_LICENSE_MANIFEST.md)
- [Observational Hash Manifest](G3D_P1_PLAYER_OBSERVATIONAL_HASH_MANIFEST.md)
- [Creation Evidence](G3D_P1_PLAYER_CREATION_EVIDENCE.md)
- [Development/Aging Evidence](G3D_P1_DEVELOPMENT_AGING_EVIDENCE.md)
- [Role/Minutes Evidence](G3D_P1_ROLE_MINUTES_EVIDENCE.md)
- [Performance/Production Evidence](G3D_P1_PERFORMANCE_PRODUCTION_EVIDENCE.md)

> **Cardinality correction (G3D-4F/4G):** the 275-template count reported at
> the time was subsequently audited as a prose/counting error. The canonical
> registry contains 268 unique normative parameter templates; no seven paths
> are missing.
