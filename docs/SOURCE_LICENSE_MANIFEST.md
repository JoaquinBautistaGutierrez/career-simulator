# Source License Manifest

## 1. Artifact header

```yaml
artifactId: SOURCE_LICENSE_MANIFEST
artifactVersion: g3d-3b2-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-BASELINE
  - RS-P0-COMP-FORMAT
  - RS-P0-CALENDAR
  - RS-P0-CLUB-IDENTITY
  - RS-P0-EXTERNAL-POOL
  - RS-P0-NATIONAL-CATALOG
  - RS-P0-AWARD-CATALOG
  - RS-P0-MONEY-POLICY-DATA
  - RS-P0-SCORING-NORMATIVE
state: EVIDENCE_COMPLETE_WITH_NONBLOCKING_LIMITATIONS
retrievedAt: 2026-08-09
rawExternalArtifactsCommitted: false
artifactHashStatus: CANDIDATE_HASHED
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  PROVENANCE_REVIEWER: PROJECT_MAINTAINER_AS_PROVENANCE_REVIEWER
```

## 2. Normative storage interpretation

No external page, PDF, spreadsheet or dump was added to the repository. The
campaign retains atomic public facts, source metadata and URLs. Unless a row
states an explicit open-data route, the conservative classification is:

- `usageClass=MANUAL_PUBLIC_FACT` or `REFERENCE_ONLY`;
- `rawRedistribution=NO`;
- `derivedRedistribution=LICENSE_REVIEW_REQUIRED` before publication of a
  substantial derived dataset;
- ordinary source citation is mandatory;
- P0 facts remain usable for research/provenance, but raw content is not a
  redistributable project asset.

This is a known route, not an assumption that public access grants a license.
`LICENSE_REVIEW_REQUIRED` blocks `FROZEN` datasets, not the retention of an
atomic cited public fact under the governance policy.

## 3. Official football sources

| sourceId | Publisher / source type | Exact reference | Research tasks | Usage class; terms/license | Raw / derived redistribution | Access/archive notes | Final usability |
|---|---|---|---|---|---|---|---|
| `SRC-AFA-LPF-REG-2026` | AFA / official regulation PDF | [Reglamento Torneos LPF Primera 2026](https://assets1.afa.com.ar/2026/BOLETINES/Boletin-Resoluciones-6818---Complementario-01---Reglamento-Torneos-LPF-Primera-2026.pdf) | baseline, format, calendar, clubs | `REFERENCE_ONLY`; copyright/terms not independently licensed | no raw; atomic facts with citation; derived publication review | stable PDF; record title/date and future hash if acquired in G3D-3C | usable P0 reference |
| `SRC-AFA-LPF-FINAL-2026` | AFA / organizer news | [Belgrano won Apertura 2026](https://www.afa.com.ar/6589/posts/river-plate-y-belgrano-de-cordoba-jugaran-la-gran-final-del-torneo-apertura-2026) | baseline | `MANUAL_PUBLIC_FACT`; terms not reviewed for redistribution | no raw; cited facts only | dynamic page; archive snapshot recommended | usable P0 reference |
| `SRC-AFA-LPF-CLAUSURA-2026` | AFA / organizer schedule | [First Clausura 2026 dates](https://www.afa.com.ar/primera/posts/agenda-de-las-primeras-tres-fechas-del-torneo-clausura-mercado-libre-de-la-lpf) | baseline/calendar | `MANUAL_PUBLIC_FACT`; terms not reviewed | no raw; cited facts only | live page | usable to establish partial state |
| `SRC-AFA-COPA-ARG-FINAL-2025` | AFA / organizer news | [Independiente Rivadavia champion](https://www.afa.com.ar/A/posts/independiente-rivadavia-se-corono-campeon-de-la-copa-argentina) | baseline | `MANUAL_PUBLIC_FACT`; terms not reviewed | no raw; cited facts only | archive recommended | usable P0 reference |
| `SRC-AFA-COPA-ARG-REG-2025` | AFA / official regulation PDF | [Reglamento Copa Argentina 2025](https://assets1.afa.com.ar/media/DANI/ENE-25/Boletin-Especial-6614-x-Reglamento-Copa-Argentina-2025.pdf) | format | `REFERENCE_ONLY`; terms not reviewed | no raw; derived publication review | stable PDF | usable P0 reference |
| `SRC-COPA-ARG-CURRENT-2026` | Copa Argentina / organizer schedule | [R16 schedule, July 2026](https://www.copaargentina.org/es/news/11917_Este-domingo-retornaran-los-16avos-de-Final.html) | baseline | `MANUAL_PUBLIC_FACT`; terms not reviewed | no raw; cited facts only | dynamic page | usable to establish partial edition |
| `SRC-LALIGA-CALENDAR-2025-26` | LALIGA / organizer calendar | [Full 2025/26 calendar](https://www.laliga.com/noticias/consulta-el-calendario-completo-de-laliga-ea-sports-2025-26) | baseline/calendar | `MANUAL_PUBLIC_FACT`; copyrighted site | no raw; cited facts only | live page; archive recommended | usable P0 reference |
| `SRC-LALIGA-STANDINGS-2025-26` | LALIGA / official standings | [Final 2025/26 standings](https://www.laliga.com/en-US/laliga-easports/standing) | baseline/clubs | `REFERENCE_ONLY`; live dataset terms not reviewed | no raw; selected cited facts; derived review | live page may roll season; archive/versioned capture required in G3D-3C | usable with reproducibility limitation |
| `SRC-LALIGA-RELEGATION-2025-26` | LALIGA / organizer report | [2025/26 relegated teams and rule](https://www.laliga.com/noticias/equipos-que-bajan-a-segunda) | format/mobility | `MANUAL_PUBLIC_FACT`; copyrighted site | no raw; cited facts only | stable dated page | usable P0 reference |
| `SRC-LALIGA-SUMMER-WINDOW-2026` | LALIGA / organizer transfer-window page | [Summer transfer period 2026](https://www.laliga.com/fichajes/laliga-easports?page=1) | calendar/registration | `REFERENCE_ONLY`; live page terms not reviewed | no raw; cited dates only | live page; archive/version binding required | usable with reproducibility limitation |
| `SRC-RFEF-PRIMERA-J38-2025-26` | RFEF / official results | [Primera Division matchday 38](https://rfef.es/es/competiciones/primera-division) | baseline/format | `MANUAL_PUBLIC_FACT`; RFEF copyright notice | no raw; cited facts only | live page | usable P0 reference |
| `SRC-RFEF-COPA-SORTEO-2025-26` | RFEF / official circular PDF | [Copa first-round draw circular](https://rfef.es/sites/default/files/pdf/circulares/CIRCULAR_No_30__-_SORTEO_PRIMERA_ELIMINATORIA_-_COPA_DE_S.M._EL_REY_2025-2026.pdf) | format | `REFERENCE_ONLY`; RFEF copyright | no raw; facts only | stable PDF | usable P0 reference |
| `SRC-RFEF-COPA-REFORM-2025-26` | RFEF / official announcement | [Competition-bases reform](https://rfef.es/es/noticias/la-rfef-optimiza-varios-de-sus-principales-torneos-con-la-reforma-de-sus-bases-de) | format | `MANUAL_PUBLIC_FACT`; RFEF copyright | no raw; facts only | archive recommended | usable P0 reference |
| `SRC-RFEF-COPA-FINAL-2025-26` | RFEF / official final report | [Real Sociedad wins Copa del Rey](https://rfef.es/es/noticias/la-real-sociedad-amplia-su-palmares-copero) | baseline | `MANUAL_PUBLIC_FACT`; RFEF copyright | no raw; facts only | stable dated page | usable P0 reference |
| `SRC-RFEF-SEASON-CALENDAR-2025-26` | RFEF / official calendar PDF | [Men's competitions calendar 2025/26](https://rfef.es/sites/default/files/2025-06/Calendario_Masculino_25-26.pdf) | calendar | `REFERENCE_ONLY`; RFEF copyright | no raw; facts only | stable PDF | usable P0 reference |
| `SRC-CONMEBOL-LIB-MANUAL-2025` | CONMEBOL / club manual PDF | [Libertadores 2025 manual](https://cdn.conmebol.com/wp-content/uploads/2024/12/Manual-de-Clubes-CL-2025-Digital-ESP.pdf) | format/calendar | `REFERENCE_ONLY`; terms not reviewed | no raw; facts only | stable PDF; hash in G3D-3C if retained legally | usable P0 reference |
| `SRC-CONMEBOL-LIB-FINAL-2025` | CONMEBOL / official tender PDF | [2025 final venue/date](https://cdn.conmebol.com/wp-content/uploads/2025/05/Pliego-de-bases-y-condiciones-Overlay-Finales-CONMEBOL-Libertadores-y-CONMEBOL-Sudamericana-2025.pdf) | baseline/calendar | `REFERENCE_ONLY`; terms not reviewed | no raw; facts only | stable PDF | usable P0 reference |
| `SRC-CONMEBOL-LIB-CHAMPIONS` | CONMEBOL / organizer article | [Libertadores champions going for another crown](https://gol.conmebol.com/libertadores/es/news/los-campeones-de-la-conmebol-libertadores-que-iran-por-una-nueva-corona) | baseline | `MANUAL_PUBLIC_FACT`; terms not reviewed | no raw; facts only | page published after edition but claim is pre-cutoff | usable post-publication/pre-cutoff-fact exception |
| `SRC-CONMEBOL-LIB-GROUPS-2025` | CONMEBOL / official fixture PDF | [Libertadores 2025 group fixture](https://cdn.conmebol.com/wp-content/uploads/2025/03/Fixture_Fase-de-Grupos_CONMEBOL-Libertadores-2025_19.3.2025.pdf) | external pool | `REFERENCE_ONLY`; terms not reviewed | no raw; identity facts only | stable PDF | usable P0 reference |
| `SRC-UEFA-UCL-FORMAT-2025-26` | UEFA / organizer explainer | [UCL 2025/26 format and dates](https://www.uefa.com/uefachampionsleague/news/0296-1d21e9bdf7e4-808a7511165c-1000--2025-26-champions-league-format-dates-draws-final/) | baseline/format/calendar | `MANUAL_PUBLIC_FACT`; UEFA copyright | no raw; facts only | stable dated page | usable P0 reference |
| `SRC-UEFA-UCL-RESULTS-2025-26` | UEFA / official results | [All UCL 2025/26 fixtures and results](https://www.uefa.com/uefachampionsleague/news/029c-1e9a2f63fe2d-ebf9ad643892-1000--2025-26-champions-league-all-the-fixture-and-results/) | baseline | `MANUAL_PUBLIC_FACT`; UEFA copyright | no raw; facts only | dated page | usable P0 reference |
| `SRC-UEFA-UCL-TEAMS-2025-26` | UEFA / official participant list | [Meet the 36 league-phase teams](https://www.uefa.com/uefachampionsleague/news/029d-1ea2e7e3e5d8-c5227ee0ab3c-1000--meet-the-2025-26-champions-league-league-phase-teams/) | external pool | `MANUAL_PUBLIC_FACT`; UEFA copyright | no raw; identities only | archive recommended | usable P0 reference |
| `SRC-FIFA-WC-FORMAT-2026` | FIFA / organizer announcement | [World Cup 2026 format and final date](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/date-set-for-2026-world-cup-final-canada-mexico-usa) | national | `MANUAL_PUBLIC_FACT`; FIFA terms/copyright | no raw; facts only | dated page | usable P0 reference |
| `SRC-FIFA-WC-RESULTS-2026` | FIFA / official results | [World Cup 2026 schedule and results](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums) | national/calendar | `REFERENCE_ONLY`; FIFA terms/copyright | no raw; selected facts only | dynamic; archive required for freeze | usable with reproducibility limitation |
| `SRC-FIFA-WC-FINAL-2026` | FIFA / official match report | [Spain-Argentina final report](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/spain-argentina-final-report-highlights) | national | `MANUAL_PUBLIC_FACT`; FIFA terms/copyright | no raw; facts only | dated page | usable P0 reference |
| `SRC-FIFA-MENS-IMC-2025-2030` | FIFA / official international match calendar | [Council-approved men's IMC 2025-2030](https://inside.fifa.com/organisation/fifa-council/media-releases/fifa-council-approves-international-match-calendars); [published calendar periods](https://www.fifa.com/en/articles/international-match-calendars) | calendar/national | `MANUAL_PUBLIC_FACT`; FIFA terms/copyright | no raw; atomic dates/maxima only | official calendar rule; 2026 dates verified before cutoff | usable primary ordinary-window evidence |
| `SRC-FIFA-ELIGIBILITY` | FIFA / official legal explainer | [Eligibility to play for representative teams](https://inside.fifa.com/en/legal/media-releases/fifa-publishes-explainer-on-eligibility-to-play-for-representative-teams) | national eligibility | `MANUAL_PUBLIC_FACT`; FIFA terms/copyright | no raw; governing reference only | timeless definition; current rule text must be bound in G3D-3C | usable reference, not player eligibility inference |
| `SRC-AFA-OFFICIAL` | AFA / official association site | [AFA official site](https://www.afa.com.ar/) | national identity | `MANUAL_PUBLIC_FACT`; terms not reviewed | no raw; identity only | live page | usable P0 identity |

## 4. Award sources

| sourceId | Publisher / source type | Exact reference | Tasks | Usage/license | Raw / derived | Notes | Final usability |
|---|---|---|---|---|---|---|---|
| `SRC-UEFA-BALLON-WINNERS-2025` | UEFA/Groupe Amaury / co-organizer release | [2025 Ballon d'Or awards](https://www.uefa.com/news-media/news/029d-1ec9af5d0295-419f208aca97-1000--aitana-bonmati-and-ousmane-dembele-win-2025-ballon-d-or-a/) | awards | `MANUAL_PUBLIC_FACT`; copyright | no raw; facts only | primary for edition/existence/winners | usable P0 reference |
| `SRC-UEFA-BALLON-RULES` | UEFA/Groupe Amaury / co-organizer rules explainer | [How winners are decided](https://www.uefa.com/ballondor/news/0292-1c2705cb8fd5-8f2dcb111a8a-1000--ballon-d-or-how-are-the-winners-decided/) | awards | `MANUAL_PUBLIC_FACT`; copyright | no raw; facts only | published for 2024; 2025 continuity requires validation | usable with limitation |
| `SRC-UEFA-BALLON-NOMINEES-2025` | UEFA/Groupe Amaury / co-organizer release | [2025 nominees and jury PDF](https://editorial.uefa.com/resources/029c-1e6a605dcdda-850bf4467b58-1000/uefa_pr_ballondor_2025_eng.pdf) | awards | `REFERENCE_ONLY`; copyright | no raw; atomic facts only | stable PDF published 7 Aug 2025; archive/hash recommended | usable primary 2025 field/electorate |
| `SRC-UEFA-BALLON-VOTING-2025` | UEFA/Groupe Amaury / co-organizer results | [Official 2025 voting rankings](https://www.uefa.com/uefachampionsleague/news/029e-1eeae3a29e5c-64e217276491-1000--2025-ballon-d-or-voting-results-official-rankings/) | awards | `MANUAL_PUBLIC_FACT`; copyright | no raw; facts only | post-edition publication describes pre-cutoff closed award | usable primary 2025 ordinal/ballot evidence |
| `SRC-LALIGA-AWARDS-2025-26` | LALIGA / organizer release | [2025/26 award winners](https://www.laliga.com/es-US/noticias/laliga-anuncia-los-ganadores-de-los-premios-de-laliga-ea-sports-2025-26) | awards | `MANUAL_PUBLIC_FACT`; copyright | no raw; facts only | page omits field/tie mechanics | usable identity, incomplete definition |
| `SRC-LALIGA-POTY-2025-26` | LALIGA / organizer winner release | [Lamine Yamal, 2025/26 Player of the Season](https://www.laliga.com/noticias/lamine-yamal-mejor-jugador-de-laliga-ea-sports-2025-2026) | awards | `MANUAL_PUBLIC_FACT`; copyright | no raw; facts only | identity/window/winner; ballot mechanics not published | usable primary; non-public mechanics explicit |
| `SRC-LALIGA-TOPSCORER-2025-26` | LALIGA / organizer statistics | [LALIGA official site/search](https://www.laliga.com/es-US?btag=479540_l130835) | awards | `REFERENCE_ONLY`; live stats terms not reviewed | no raw; cited leader fact only | dynamic URL; archive/version binding required | usable with reproducibility limitation |
| `SRC-LALIGA-PICHICHI-BINDING` | LALIGA / organizer editorial | [LALIGA individual categories](https://www.laliga.com/en-US/news/robert-lewandowski-joan-garcia-and-lamine-yamal-stand-out-in-the-laliga-ea-sports-individual-categories) | awards | `MANUAL_PUBLIC_FACT`; copyright | no raw; atomic identity fact | explicitly describes Pichichi as the top-scorer prize | usable primary alias/semantics |
| `SRC-MARCA-PICHICHI-DEFINITION` | MARCA / award publisher historical explainer | [90 years of LaLiga: Pichichi](https://especiales.marca.com/futbol/90-aniversario-laliga/abecedario.html) | awards | `MANUAL_PUBLIC_FACT`; publisher copyright | no raw; atomic facts only | primary for MARCA's named award | usable for external-award ownership/definition |
| `SRC-REALMADRID-PICHICHI-2025-26` | Real Madrid CF / winner-club report | [Mbappe wins Pichichi 2025/26](https://www.realmadrid.com/en-US/news/football/first-team/latest-news/mbappe-gana-el-trofeo-pichichi-2025-26-23-05-2026) | awards | `MANUAL_PUBLIC_FACT`; club copyright | no raw; corroboration only | Tier B; cannot supply organizer tie rules | usable corroboration only |

## 5. Monetary/statistical sources

| sourceId | Publisher / source type | Exact reference | Tasks | Usage/license | Raw / derived | Revision/access notes | Final usability |
|---|---|---|---|---|---|---|---|
| `SRC-ISO-4217` | ISO / international standard | [ISO 4217:2015](https://www.iso.org/standard/64758.html) | money | `REFERENCE_ONLY`; copyrighted standard | no raw; standards facts only | current maintenance must be checked at publication | usable reference |
| `SRC-ARG-DECREE-2128-1991` | Argentina.gob.ar / official law | [Decree 2128/1991](https://www.argentina.gob.ar/normativa/nacional/decreto-2128-1991-7384/texto) | money | `MANUAL_PUBLIC_FACT`; official legal text | no raw copy; cited legal fact | stable legal reference | usable P0 reference |
| `SRC-EU-EURO-UNITS` | European Union / official terminology | [Spelling of “euro” and “cent”](https://european-union.europa.eu/system/files/2020-08/publication6336_en.pdf) | money | `REFERENCE_ONLY`; EU reuse terms need review | no raw; cited fact | stable PDF | usable P0 reference |
| `SRC-BCRA-A3500` | BCRA / central-bank series | [A 3500 and TCNPM historical series](https://www.bcra.gob.ar/tipo-cambio-referencia-comunicacion-a-3500-tcnpm/) | money | `REDISTRIBUTABLE_DERIVED`; attribution/context required | no repository raw; fingerprint and transform permitted | official series route; revisions/methodology retained | acquired source binding |
| `SRC-BCRA-MONETARY-API-V4` | BCRA / official statistics API | [API catalog](https://www.bcra.gob.ar/apis-banco-central/); [series 5 cutoff query](https://api.bcra.gob.ar/estadisticas/v4.0/monetarias/5?desde=2025-01-01&hasta=2026-08-07&limit=3000) | money | `REDISTRIBUTABLE_DERIVED`; public-information reuse | no raw mirror; query fingerprint/derived transform | series ID 5, exact unit/frequency/coverage | acquired reproducible route |
| `SRC-BCRA-A8359` | BCRA / official communication | [Communication A8359](https://www.bcra.gob.ar/archivos/Pdfs/comytexord/A8359.pdf) | money | `REFERENCE_ONLY`; official regulation | no raw; cited methodology facts | effective 2 Jan 2026 | usable current methodology |
| `SRC-BCRA-REUSE` | BCRA / public-information policy | [Access to public information](https://web2.bcra.gob.ar/Institucional/Acceso_Informacion.asp) | money/license | `REDISTRIBUTABLE_DERIVED`; source context retained | project does not exercise raw bulk redistribution | permits copy/analyze/reprocess/reuse/redistribution of public information | clears derived-binding review |
| `SRC-INDEC-IPC` | INDEC / official statistics | [National CPI series and methodology](https://www.indec.gob.ar/indec/web/Nivel4-Tema-3-5-31); [official CSV](https://www.indec.gob.ar/ftp/cuadros/economia/serie_ipc_aperturas.csv) | money | `REDISTRIBUTABLE_DERIVED`; attribution required | no repository raw; acquired fingerprint retained | national Dec-2016 base; monthly revisions retained | acquired source binding |
| `SRC-INDEC-REUSE` | INDEC / official reuse notice | [INDEC reuse terms](https://sitioanterior.indec.gob.ar/economico2005/inc_ingresos2.asp) | money/license | `REDISTRIBUTABLE_DERIVED`; attribution/share-alike notice | no raw committed | official reuse route; publication attribution required | clears derived-binding review |
| `SRC-ECB-EXR` | ECB / central-bank dataset | [USD/EUR series](https://data.ecb.europa.eu/data/datasets/EXR/EXR.D.USD.EUR.SP00.A); [cutoff CSV query](https://data-api.ecb.europa.eu/service/data/EXR/D.USD.EUR.SP00.A?startPeriod=2025-01-01&endPeriod=2026-08-07&format=csvdata) | money | `REDISTRIBUTABLE_DERIVED`; attribution/change disclosure | no repository raw; query fingerprint retained | exact series `EXR.D.USD.EUR.SP00.A` | acquired source binding |
| `SRC-ECB-REUSE` | ECB / statistical data usage policy | [Usage policy](https://www.ecb.europa.eu/stats/ecb_statistics/governance_and_quality_framework/html/usage_policy.en.html) | money/license | `REDISTRIBUTABLE_DERIVED`; source attribution | no raw committed | modifications must be disclosed | clears derived-binding review |
| `SRC-ECB-REFERENCE-METHOD` | ECB / reference-rate methodology | [Euro reference exchange rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) | money | `MANUAL_PUBLIC_FACT`; ECB reuse terms | no raw; method facts | TARGET working days; informational reference | usable interpretation |
| `SRC-EUROSTAT-HICP` | Eurostat / official statistics | [HICP data information](https://ec.europa.eu/eurostat/web/hicp/information-data); [cutoff query](https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/prc_hicp_minr?lang=en&geo=ES&coicop18=TOTAL&unit=I25&sinceTimePeriod=2025-01&untilTimePeriod=2026-06) | money | `REDISTRIBUTABLE_DERIVED`; attribution/change disclosure | no repository raw; query fingerprint retained | ECOICOP v2/reference 2025 and revisions retained | acquired source binding |
| `SRC-EUROSTAT-REUSE` | Eurostat / official copyright notice | [Eurostat copyright and reuse](https://ec.europa.eu/eurostat/help/copyright-notice) | money/license | `REDISTRIBUTABLE_DERIVED`; attribution/change disclosure | no raw committed | statistical data/metadata reusable | clears derived-binding review |
| `SRC-WORLDBANK-ICP` | World Bank ICP / multilateral methodology | [ICP methodology](https://www.worldbank.org/en/programs/icp/methodology) | money | `REFERENCE_ONLY` pending dataset-license/coverage review | no raw; methodology only | actual series/coverage not acquired | viable secondary candidate, not selected |

## 6. Internal normative sources

| sourceId | Reference | Usage class | Tasks / usability |
|---|---|---|---|
| `SRC-INTERNAL-VERTICAL-SLICE` | [`VERTICAL_SLICE_DATA_CATALOG_SPEC.md`](VERTICAL_SLICE_DATA_CATALOG_SPEC.md) | `PRODUCT_DEFINED` | club portfolio and scope; fully usable internally |
| `SRC-INTERNAL-ADR-081` | [`ADR-081`](adr/081-hybrid-external-club-pool.md) | `PRODUCT_DEFINED` | hybrid external club invariant |
| `SRC-INTERNAL-ADR-082` | [`ADR-082`](adr/082-vertical-slice-sporting-nationality.md) | `PRODUCT_DEFINED` | Argentina-only eligibility policy |
| `SRC-INTERNAL-PRODUCT-DECISIONS` | [`G3D_PRODUCT_DECISIONS.md`](G3D_PRODUCT_DECISIONS.md) | `PRODUCT_DEFINED` | post-season market and approved direction |
| `SRC-INTERNAL-MASTER-SCORING` | [`MASTER_SPEC.docx`](MASTER_SPEC.docx) | `PRODUCT_DEFINED` | internal normative source type; primary scoring values/formulas; not an external dataset |
| `SRC-INTERNAL-SCORING-MATH` | [`SCORING_MATH_SPEC.md`](SCORING_MATH_SPEC.md) | `PRODUCT_DEFINED` | internal normative source type; exact scoring arithmetic and blockers |
| `SRC-INTERNAL-AWARD-MATH` | [`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](NATIONAL_TEAM_AWARDS_MATH_SPEC.md) | `PRODUCT_DEFINED` | comparative/statistical separation and explicit canonical tie-policy framework; no claim about unpublished human ballots |

## 7. Rejected or deliberately unused sources

| Candidate | State | Reason |
|---|---|---|
| Wikipedia pages for editions/currency | `SOURCE_REJECTED` | orientation only; an official source was available |
| SEO sports aggregators and unsourced format summaries | `SOURCE_REJECTED` | lower source tier and unstable provenance |
| current 2026 Libertadores participant pages | `SOURCE_REJECTED` | wrong edition for the 2025 baseline |
| post-cutoff 2026/27 competition outcomes | `SOURCE_REJECTED` | post-cutoff fact, not a correction or timeless definition |
| informal/parallel Argentine FX quotes | `SOURCE_REJECTED` | undefined market/observation semantics; not reproducible official policy |
| unsourced Pichichi summaries/SEO pages | `SOURCE_REJECTED` | official LALIGA and award-publisher sources became available |

## 8. Licensing blockers

- There is no raw-redistribution authorization for the football organizer
  sources; therefore raw content remains out of repository.
- G3D-3C must review whether its normalized catalogs contain only uncopyrightable
  public facts/IDs or a protectable substantial extract. This is a publication
  review, not permission to copy source tables.
- Monetary source bindings may progress to `ACQUIRED`: exact routes, query
  periods, fingerprints and derived-reuse terms are recorded. Raw mirrors remain
  outside the repository and normalized series publication remains a later gate.
- The live LALIGA standings/top-scorer pages require an archive or permitted
  versioned derived record for reproducibility.

No licensing ambiguity was converted into `REDISTRIBUTABLE_RAW` or
`REDISTRIBUTABLE_DERIVED`.

## 9. Artifact review declaration

- Evidence selection: all source identities used by `EV-P0-001` through
  `EV-P0-101` in [P0 Evidence Index](P0_EVIDENCE_INDEX.md).
- Limitations: conservative source-level classification; cited public facts do
  not imply raw or substantial-derived redistribution rights.
- Unresolved material conflicts: none. No raw external artifact was committed;
  substantial raw redistribution remains outside the approved consumer scope.
