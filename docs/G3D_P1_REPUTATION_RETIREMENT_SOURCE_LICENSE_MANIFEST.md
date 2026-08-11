# G3D-4E Reputation, Social and Retirement Source and License Manifest

Status: `P1_ACQUISITION_COMPLETE_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Retrieval date: `2026-08-11`

Owner/reviewer roles: `DATA_OWNER` / `PROVENANCE_REVIEWER` (solo-project mode)

This manifest covers only G3D-4E public-attention, public social metrics and
professional playing-retirement/comeback evidence. No private audience data,
raw social scrape, private health or motivation data, gameplay definition,
parameter value, Product Target, ScoringConfiguration value or Data V1 artifact
is retained.

## 1. Reputation, attention and social sources

| Source ID | Publisher / artifact | Tier | Usage / terms state | Repository retention | Scope and limitation |
|---|---|---:|---|---|---|
| `SRC-P1-RS-GT-FAQ` | Google, [Google Trends FAQ](https://support.google.com/trends/answer/4365533?hl=en-GB) | A | `MANUAL_PUBLIC_FACT`; Google terms | cited metric semantics only | sampled, normalized 0–100 search interest; not a poll or absolute awareness measure |
| `SRC-P1-RS-GT-TOPICS` | Google, [terms and topics](https://support.google.com/trends/answer/17309543) | A | `MANUAL_PUBLIC_FACT`; Google terms | cited query semantics only | topic and term are not interchangeable; geography and language affect identity |
| `SRC-P1-RS-GT-EXPORT` | Google, [export, embed and citation guidance](https://support.google.com/trends/answer/4365538?hl=en) | A | `MANUAL_PUBLIC_FACT`; attribution required | transform/retrieval route only | CSV route is reproducible only with query, geography, period and retrieval date |
| `SRC-P1-RS-YT-METRICS` | Google/YouTube, [YouTube Analytics metrics](https://developers.google.com/youtube/analytics/metrics) | A | `MANUAL_PUBLIC_FACT`; API/Google terms | field semantics only | distinguishes views/interactions and subscriber gains/losses; authorized channel scope is required |
| `SRC-P1-RS-TT-API` | TikTok, [Research API video-query specification](https://developers.tiktok.com/doc/research-api-specs-query-videos/) | A | `REFERENCE_ONLY`; approved Research API access and platform terms | field semantics only; no API rows | separate views/likes/comments/shares; access and coverage do not imply full audience history |
| `SRC-P1-RS-NIELSEN-WC22` | Nielsen, [FIFA World Cup 2022 data hub](https://www.nielsen.com/insights/2022/fifa-world-cup-2022-data-hub/) | B | `REFERENCE_ONLY`; proprietary InfluenceScope methodology | cited published aggregates only | selected tournament participants/teams, Instagram-centric and extreme-tail biased |
| `SRC-P1-RS-FIFA-PAYNE` | FIFA, [Tim Payne viral fame](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/tim-payne-new-zealand-viral-fame) | A | `MANUAL_PUBLIC_FACT`; FIFA copyright | cited before/after follower facts only | one documented World Cup 2026 extreme-tail episode, not a rate |
| `SRC-P1-RS-FIFA-CWC25` | FIFA, [Club World Cup digital-platform growth](https://vod.fifa.com/organisation/news/club-world-cup-digital-platform-growth-stats-social-media-web-views) | A | `MANUAL_PUBLIC_FACT`; FIFA copyright | cited aggregate event fact only | organizer accounts and cross-platform reach; not a player-level follower panel |
| `SRC-P1-RS-EREDIVISIE-X` | International Journal of Sport Communication, [football-player Twitter popularity study](https://doi.org/10.1123/ijsc.2018-0171) | B | `REFERENCE_ONLY`; publisher copyright | published sample/model summaries only | published 2019; exact trace-collection date is `NOT_PUBLICLY_DOCUMENTED` in the accessible record, so association-only, never temporal calibration |
| `SRC-P1-RS-WOMEN-IG` | Sport Management Review, [women footballers' Instagram popularity](https://ideas.repec.org/a/taf/rsmrxx/v28y2025i3p523-548.html) | B | `REFERENCE_ONLY`; publisher copyright | published aggregates only | Instagram rows collected over several days in June 2021; women-football public-account cross-section, not V1 male baseline |
| `SRC-P1-RS-WOMEN-IG-ABSTRACT` | Ghent University, [conference abstract and descriptive results](https://backoffice.biblio.ugent.be/download/8766976/8766981) | B | `REDISTRIBUTABLE_DERIVED` subject to citation; institutional repository | cited aggregate counts/quantiles only | league and position composition are incomplete for direct GK/CM/ST inference |
| `SRC-P1-RS-LAVER-CUP` | International Journal of Sport Communication, [athlete social growth around a major event](https://openurl.ebsco.com/contentitem/gcd%3A173778721) | B | `REFERENCE_ONLY`; publisher/database terms | qualitative/published model findings only | tennis event reference; informs event-study design, not football parameters |
| `SRC-P1-RS-NWSL-ATTENTION` | Marketing Science, [competition for attention in the NWSL](https://pubsonline.informs.org/doi/abs/10.1287/mksc.2021.1303) | B | `REFERENCE_ONLY`; publisher copyright | abstract-level findings only | tweets mentioning players measure attention, not followers or latent reputation |
| `SRC-P1-RS-OLYMPIC-SEARCH` | PLOS ONE, [event search-attention dynamics](https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0336136) | B | `REDISTRIBUTABLE_DERIVED`; CC BY | cited event-shape summaries only | sport-event search interest, not individual footballers |
| `SRC-P1-RS-OLYMPIC-IG` | arXiv, [longitudinal Instagram study of Olympic champions](https://arxiv.org/abs/2108.07138) | C | `REFERENCE_ONLY`; preprint | methodological finding only | non-football selected champions; not freeze-quality baseline evidence |
| `SRC-P1-RS-RETIRED-NFL-IG` | International Journal of Sport Communication, [retired-athlete Instagram engagement study](https://openurl.ebsco.com/contentitem/gcd%3A177924614) | B | `REFERENCE_ONLY`; publisher/database terms | published aggregate findings only | 16 retired NFL athletes; post-career attention reference, not football calibration baseline |

## 2. Retirement, longevity and comeback sources

| Source ID | Publisher / artifact | Tier | Usage / terms state | Repository retention | Scope and limitation |
|---|---|---:|---|---|---|
| `SRC-P1-RC-SYSTEMATIC-REVIEW` | PubMed-indexed systematic review, [transition out of professional football](https://pubmed.ncbi.nlm.nih.gov/33295256/) | B | `REFERENCE_ONLY`; publisher copyright | abstract/review findings only | 17 heterogeneous studies and more than 2,200 retired players; source definitions and representativeness vary |
| `SRC-P1-RC-LONGEVITY-ENG` | Journal of Experimental Orthopaedics, [normal career longevity in professional football](https://esskajournals.onlinelibrary.wiley.com/doi/10.1002/ksa.12722) | B | `REFERENCE_ONLY`; publisher copyright | published Kaplan–Meier summaries only | 4,117 English male professionals, 1992–2023; league system is reference, not Argentina/Spain baseline |
| `SRC-P1-RC-LAST-WHISTLE` | PubMed, [The Last Whistle study](https://pubmed.ncbi.nlm.nih.gov/40837503/) | B | `REFERENCE_ONLY`; publisher copyright | published descriptive summaries only | Portuguese retired-player selected cohort; complete-history inclusion creates survivorship bias |
| `SRC-P1-RC-GERMAN-CAREERS` | MDPI, [career development and retirement in German professional football](https://www.mdpi.com/1911-8074/15/12/609) | B | `REDISTRIBUTABLE_DERIVED`; CC BY | cited aggregate summaries only | N=78 elite-skewed retired sample; small positional cells |
| `SRC-P1-RC-INJURY-RETIREMENT` | PMC, [injury as a reason for retirement in professional soccer](https://pmc.ncbi.nlm.nih.gov/articles/PMC8514381/) | B | `REDISTRIBUTABLE_DERIVED`; open article terms | cited aggregate survey results only | N=116 former players; self-report and recruited-sample limitations |
| `SRC-P1-RC-FIFPRO-GAP` | FIFPRO, [Mind the Gap report](https://media.fifpro.org/media/dvgd2hgx/fifpro-mind-the-gap-report-2021.pdf) and [survey overview](https://www.fifpro.org/es/articulos/2021/09/encuesta-mind-the-gap-que-debes-saber) | B | `MANUAL_PUBLIC_FACT`; FIFPRO copyright | cited published aggregates only | multi-country survey, multiple-answer questions and active/former mix; no causal single-reason inference |
| `SRC-P1-RC-AFA-HIGUAIN` | AFA, [Gonzalo Higuaín retirement announcement](https://www.afa.com.ar/i/posts/gonzalo-higuain-emblema-de-la-seleccion-argentina-anuncio-su-retiro-del-futbol) | A | `MANUAL_PUBLIC_FACT`; AFA copyright | cited public career/announcement facts only | Argentina identity context; one case, not a distribution |
| `SRC-P1-RC-RM-KROOS` | Real Madrid, [Toni Kroos retirement announcement](https://www.realmadrid.com/en-US/news/club/announcements/comunicado-oficial-toni-kroos-21-05-2024) | A | `MANUAL_PUBLIC_FACT`; club copyright | cited announcement/effective-period facts only | demonstrates announcement and final competitive appearance are distinct |
| `SRC-P1-RC-FCB-AGUERO` | FC Barcelona, [Sergio Agüero retirement](https://www.fcbarcelona.com/en/football/first-team/news/2416373/) | A | `MANUAL_PUBLIC_FACT`; club copyright | cited public career/health-context facts only | public sporting-health context only; no private diagnosis inference |
| `SRC-P1-CBK-UEFA-SCHOLES` | UEFA, [Scholes returns from retirement](https://www.uefa.com/uefaeuropaleague/news/0254-0d7dc0945674-d1ffa068c24e-1000--scholes-out-of-retirement-for-manchester-united/) and [subsequent extension](https://www.uefa.com/news-media/news/01fd-0e7e46a58b09-40099b57dbe1-1000--scholes-signs-on-for-another-year-at-united/) | A | `MANUAL_PUBLIC_FACT`; UEFA copyright | cited return/contract facts only | verified competitive comeback and continuation; no population denominator |
| `SRC-P1-CBK-UEFA-ROBBEN` | UEFA, [Arjen Robben career and comeback chronology](https://de.uefa.com/news/0253-0e96fd13065b-3a96ba62f71e-1000--geniale-fussballer-arjen-robben/) | A | `MANUAL_PUBLIC_FACT`; UEFA copyright | cited chronology only | retirement, one-season-gap return and re-retirement tail case |
| `SRC-P1-CBK-FCB-SZCZESNY` | FC Barcelona, [Szczęsny signing](https://www.fcbarcelona.com/en/football/first-team/news/4138532/fc-barcelona-sign-wojciech-szczesny/featured), [debut](https://www.fcbarcelona.com/en/news/4194123/fc-barcelona-debuts-for-szczsny-and-toni-fernandez/amp) and [extension](https://www.fcbarcelona.com/en/football/first-team/news/4305495/wojciech-szczsny-contract-extension-until-2027) | A | `MANUAL_PUBLIC_FACT`; club copyright | cited return/exposure facts only | verified contract, competitive minutes and meaningful-role comeback; selected case |
| `SRC-P1-CBK-UEFA-LEHMANN` | UEFA, [Arsenal brings Jens Lehmann back](https://www.uefa.com/news-media/news/01ef-0e77919ff1cb-efbba2cef714-1000--arsenal-bring-lehmann-back-on-board/) | A | `MANUAL_PUBLIC_FACT`; UEFA copyright | cited return context only | emergency goalkeeper-market route; one case, not a hazard estimate |

## 3. Counts and evidence quality

- Source routes: **29** (`Reputation/Social=16`, `Retirement/Comeback=13`).
- Source-tier distribution: **A=14, B=14, C=1, D=0**.
- All social observations are public aggregate/account metrics with an explicit
  platform and date/window. When an accessible publication omits the precise
  collection date, `observedAt=NOT_PUBLICLY_DOCUMENTED` is explicit and blocks
  temporal calibration. No audience-member identity or inferred sensitive
  demographic is retained.
- Official public facts validate event definitions and tails. They do not gain
  a population denominator by being Tier A.

## 4. Rejected or non-canonical routes

| Candidate route | State | Reason |
|---|---|---|
| follower-history/salary-style SEO aggregators | `SOURCE_REJECTED` | opaque collection and adjustment methodology; no reproducible platform contract |
| live account counters without dated archive | `SOURCE_REJECTED` | no stable `observedAt`, definition or correction history |
| post-cutoff platform-bot-purge reporting | `SOURCE_REJECTED` | confounds genuine churn with platform enforcement and is not a pre-cutoff baseline fact |
| Wikipedia retirement/comeback lists | `SOURCE_REJECTED` for quantitative closure | orientation only; selected anecdotes and no at-risk denominator |
| speculative retirement-reason reporting | `SOURCE_REJECTED` | cannot support private motivation or a competing-risk label |

## 5. Privacy, redistribution and freeze boundary

- Raw platform/API rows, scraped histories and audience identities remain
  outside the repository. `REFERENCE_ONLY` sources retain citations, metric
  semantics and permitted aggregates only.
- Public player identity is retained only for an official retirement/comeback
  fact whose chronology is the consumer. A future row-level longevity artifact
  must use `AnonymousObservationId` and preserve the private join outside the
  published artifact.
- No source route is `FROZEN`. Dynamic pages need a permitted archived snapshot
  or independently reproducible extraction, and all derived redistribution
  remains subject to the cited source terms.
- Evidence acquisition never assigns a causal parameter, Product Target,
  scoring value or dataVersion.
