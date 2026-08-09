# G3D-4A Player Evidence — Source and License Manifest

Status: `P1_ACQUISITION_COMPLETE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieval date: `2026-08-09`

Owner/reviewer roles: `DATA_OWNER` / `PROVENANCE_REVIEWER` (solo-project mode)

This manifest covers only Creation, Development/Aging, Role/Minutes and
Performance/Form evidence acquired in G3D-4A. Raw external data remains outside
the repository. Derived summaries are not gameplay ratings or model parameters.

## 1. Sources

| Source ID | Publisher / artifact | Tier | Access and usage class | Raw / derived redistribution | Status and limitations |
|---|---|---:|---|---|---|
| `SRC-P1-TRANSFERMARKT-DATASETS-20260805` | dcaribou, [Transfermarkt datasets](https://github.com/dcaribou/transfermarkt-datasets) | B | public files; repository declares `CC0-1.0`; `REDISTRIBUTABLE_DERIVED_CANDIDATE` | raw not retained; aggregate-only in this repo | `LICENSE_REVIEW_REQUIRED_FOR_FREEZE`: the published dataset license is explicit, but the upstream observations originate from Transfermarkt; suitable as candidate evidence, not yet a frozen competitive source |
| `SRC-P1-KAGGLE-METADATA-PLAYER-SCORES` | Kaggle dataset metadata, `davidcariboo/player-scores` | B | public API metadata; declared `CC0` | metadata may be cited; raw not retained | supports snapshot title, license, update timestamp and size; it is not an independent observation source |
| `SRC-P1-STATSBOMB-OPEN-DATA-2015-16` | Hudl/StatsBomb, [Open Data](https://github.com/hudl/open-data) | B | public research access; `REFERENCE_ONLY_NON_COMMERCIAL` | raw no; derived numeric analysis is not a redistributable competitive input without permission | La Liga 2015/16 reference subset; attribution is mandatory; candidate use is limited to method/shape diagnostics |
| `SRC-P1-STATSBOMB-USER-AGREEMENT-2023` | StatsBomb Open Data user agreement | B | bundled PDF in the public repository | no raw redistribution; no commercial exploitation of data or derived analysis | controls the preceding source; publication of analysis requires StatsBomb attribution/logo |
| `SRC-P1-REY-LALIGA-AGING-2022` | Rey et al., [Journal of Science and Medicine in Sport](https://www.sciencedirect.com/science/article/pii/S1440244022000469) | B | peer-reviewed open-access article | findings may be cited; no row-level data acquired | 154 La Liga players, 14,092 match observations, 2012/13–2019/20; central midfield and forward evidence, no GK |
| `SRC-P1-GARCIA-CALVO-LALIGA-2023` | García-Calvo et al., [Biology of Sport](https://www.termedia.pl/Does-player-age-influence-match-physical-performance-A-longitudinal-four-season-analysis-in-Spanish-Soccer-LaLiga%2C78%2C50093%2C1%2C1.html) | B | peer-reviewed `CC BY-SA 4.0` article | article findings redistributable with attribution; no row-level data acquired | 1,037 La Liga players and 36,883 observations; GK and <10-minute appearances excluded |
| `SRC-P1-DENDIR-PEAK-2016` | Dendir, [Journal of Sports Analytics](https://pdfs.semanticscholar.org/4f59/d0356d58920adf54b53043c30ff50f0590e5.pdf) | B | peer-reviewed `CC BY-NC 4.0`; `REFERENCE_ONLY_NON_COMMERCIAL` | findings may be cited noncommercially | European-league rating study; provider-rating construct and selection bias; no GK-specific estimate |
| `SRC-P1-SCHUCKERS-AGE-BIAS-2021` | Schuckers et al., [arXiv:2110.14017](https://arxiv.org/abs/2110.14017) | C | public methodological preprint | findings may be cited | non-football methodology used only to document opportunity/selection bias, never as a numeric football target |
| `SRC-P1-LPF-DEBUTS-2025` | Liga Profesional de Fútbol, [2025 objectives/results](https://www.ligaprofesional.ar/notas/institucional/2025/10/16/temporada-2025-objetivos-y-resultados/) | A | official public fact; `MANUAL_PUBLIC_FACT` | atomic fact/citation only | reports 185 Primera debuts in 2025; no age, position or denominator distribution |
| `SRC-P1-LPF-DATA-FECHA5-2025` | Liga Profesional de Fútbol, [LPF Data Fecha 5 PDF](https://www.ligaprofesional.ar/wp-content/uploads/2025/08/LPF-Data-Datos-Oficiales-Fecha-5.pdf) | A | official public report; `REFERENCE_ONLY` | report not copied; metric semantics and atomic facts may be cited | one matchday only; demonstrates Argentina minutes/lineup/assist/pass/GK-save observability but cannot calibrate distributions |

### 1.1 Source type and valid period

| Source ID | Source type | Published / valid period | Retrieved at | Terms state |
|---|---|---|---|---|
| `SRC-P1-TRANSFERMARKT-DATASETS-20260805` | reproducible public dataset snapshot | snapshot last modified `2026-08-05T07:15Z`; seasons through 2025 used | `2026-08-09` | declared CC0; upstream provenance review pending |
| `SRC-P1-KAGGLE-METADATA-PLAYER-SCORES` | provider metadata/API record | metadata update `2026-08-05` | `2026-08-09` | declared CC0; metadata only |
| `SRC-P1-STATSBOMB-OPEN-DATA-2015-16` | public event-data repository | La Liga `2015/16`, closed edition | `2026-08-09` | user agreement applies; noncommercial reference-only |
| `SRC-P1-STATSBOMB-USER-AGREEMENT-2023` | source terms PDF | repository agreement retrieved for this acquisition | `2026-08-09` | authoritative terms artifact for this source use |
| `SRC-P1-REY-LALIGA-AGING-2022` | peer-reviewed research | published 2022; observations `2012/13–2019/20` | `2026-08-09` | open-access article citation |
| `SRC-P1-GARCIA-CALVO-LALIGA-2023` | peer-reviewed research | published 2023; observations `2015/16–2018/19` | `2026-08-09` | `CC BY-SA 4.0` article |
| `SRC-P1-DENDIR-PEAK-2016` | peer-reviewed research | published 2016; observations `2010/11–2014/15` | `2026-08-09` | `CC BY-NC 4.0`; noncommercial reference |
| `SRC-P1-SCHUCKERS-AGE-BIAS-2021` | methodological preprint | first published 2021; timeless methodological use | `2026-08-09` | public preprint; citation required |
| `SRC-P1-LPF-DEBUTS-2025` | official annual public fact | published 2025; season 2025 | `2026-08-09` | citation/manual public fact |
| `SRC-P1-LPF-DATA-FECHA5-2025` | official statistics report | published 2025; Clausura 2025 Fecha 5 | `2026-08-09` | reference-only unless redistribution is separately cleared |

## 2. StatsBomb attribution and use boundary

![StatsBomb logo](https://raw.githubusercontent.com/hudl/open-data/master/img/SB%20-%20Icon%20Lockup%20-%20Colour%20positive.png)

StatsBomb data is used only as a research reference under its Open Data user
agreement. No raw event file, player identity or reusable event-level derived
table is stored here. The numeric summaries in the Performance evidence artifact
are noncommercial reference diagnostics and **must not** be copied into a
published competitive dataset or commercial build without a new permission and
license review.

## 3. Privacy and retention

- only aggregate position/season/block summaries are committed;
- no real-player name, external player ID or `AnonymousObservationId` is needed
  in the committed artifacts;
- temporary join keys were used outside the repository and are not gameplay
  identities or `PlayerDefinition` inputs;
- all source snapshots and event rows remain outside the repository and are
  disposable acquisition material, not a published dataset.

## 4. Freeze consequences

`SRC-P1-TRANSFERMARKT-DATASETS-20260805` can support initial estimation only
with the explicit upstream-license caveat. StatsBomb and Dendir sources are
reference-only/noncommercial. A commercially redistributable event source or
permission is still needed before position-task summaries can become a frozen
Data V1 input. The official LPF artifacts give Argentina semantics and aggregate
coverage, but not a player-season panel.
