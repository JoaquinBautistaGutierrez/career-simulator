# Calibration Dataset Registry

## 1. Propósito

Este documento define los datasets y catálogos requeridos por G3D. G3D-1 los
creó como `PLANNED`; la campaña G3D-3B actualiza únicamente los P0 indicados en
§15 hasta `SOURCE_IDENTIFIED` o `ACQUIRED`. Ninguna entrada está todavía
`NORMALIZED`, `VALIDATED` o `FROZEN`.

Un dataset de calibración es evidencia, no una regla determinista de gameplay.
Un catálogo de gameplay/scoring puede ser normativo, pero debe conservar la
misma identidad, provenance, licencia y hash que cualquier otro artefacto de
datos.

## 2. Contrato normativo `DatasetDefinition`

```text
DatasetDefinition {
  datasetId
  datasetVersion
  title
  domain
  status
  observationWindowCategory
  cutoffCompatibilityPolicy[]
  windowDecisionStatus
  anomalyPolicy
  ownership {
    primaryOwnerRole
    researchOwnerRole
    requiredReviewerRoles[]
  }
  governance {
    usageClass
    licenseStatus
    privacyClass
    rawStoragePolicy
  }
  acquisitionArtifactIds[]
  freezePrerequisites[]
  provenance {
    primarySource
    secondarySources[]
    sourceType
    evidenceTier
    license
    useConstraints[]
    retrievalDate
    publicationDate
  }
  observationPeriod
  geographicAndCompetitionScope[]
  positionMappingId?
  competitionMappingId?
  inclusionRules[]
  exclusionRules[]
  sampleSize
  schema { fields[], types[], units[] }
  missingDataPolicy
  transformations[]
  aggregationPolicy
  knownBiases[]
  limitations[]
  artifact { fileRef, mediaType, byteLength, sha256 }
  linkedTargetIds[]
  linkedParameterPaths[]
}
```

No son válidos `unknown`, `web`, una URL mutable o el nombre de un proveedor
sin fecha/licencia como provenance suficiente. Antes de `ACQUIRED`, los campos
desconocidos se marcan `TBD`, nunca se completan por inferencia.

## 3. Estados

| Estado | Gate mínimo |
|---|---|
| `PLANNED` | Contrato, purpose y consumers identificados. |
| `SOURCE_IDENTIFIED` | Fuente, licencia, periodo y método de recuperación revisados. |
| `ACQUIRED` | Evidencia permitida capturada y hasheada según usage/license class. Raw bytes solo cuando su retención esté autorizada. |
| `NORMALIZED` | Transformaciones reproducibles generaron schema canónico. |
| `VALIDATED` | QA de unidades, mappings, missingness, sesgos y samples completado. |
| `FROZEN` | Versión inmutable publicada, resoluble por hash y retenida. |

La publicación no salta estados. Un refresh crea otro `datasetVersion`; no
sobrescribe el artefacto anterior.

`LICENSE_REVIEW_REQUIRED` bloquea `FROZEN`. En `REFERENCE_ONLY` o
`LOCAL_PRIVATE_SOURCE`, `ACQUIRED` puede consistir en source fingerprint,
EvidenceRecords y extracción/aggregate permitidos; no obliga a copiar raw al
repository.

## 4. Evidence tiers

| Tier | Definición | Uso mínimo |
|---|---|---|
| `TIER_A` | Fuente oficial/primaria, granular, reproducible y con licencia compatible. | Facts/catálogos normativos, calendar, resultados, valores de scoring y targets sensibles cuando exista. |
| `TIER_B` | Proveedor estadístico confiable o varias fuentes independientes convergentes, con método reproducible. | Rates/distribuciones de performance, injuries, market y careers. |
| `TIER_C` | Fuente parcial, proxy documentado o estimación con incertidumbre explícita. | Baselines no observables directamente: prestige, developmentQuality, medicalQuality, awareness histórica. |
| `TIER_D` | Construcción sintética o decisión provisional de producto claramente etiquetada. | Targets de diseño sin verdad observacional; nunca se presenta como historia real. |

Requisitos mínimos:

- invariantes: evidencia normativa, no dataset externo;
- targets observacionales centrales: preferir A/B; C solo con sensitivity y
  limitación explícitas;
- proxies institucionales/sociales: C aceptable con triangulación;
- decisiones de producto: D correcta y preferible a falsa precisión externa;
- scoring competitivo: source de puntos A/normativa y cohortes A/B cuando
  existan; todo fallback debe ser explícito.

## 5. Provenance y transformaciones

Cadena obligatoria:

```text
source bytes + license
  -> DatasetDefinition + source sha256
  -> TransformationDefinition + code/version
  -> normalized artifact sha256
  -> estimate/report artifact sha256
  -> ParameterSet candidate or ScoringCalibrationData hash
  -> acceptance report
```

Contrato de transformación:

```text
TransformationDefinition {
  transformId
  transformVersion
  inputDatasetId
  inputDatasetVersion
  inputSha256
  operationGraph[]
  operationParameters
  mappingVersions[]
  outputSchema
  outputSha256
  implementationRef
  implementationVersion
  validationChecks[]
  reviewState
}
```

Una transformación manual solo es válida si produce un patch/worksheet
versionado y revisable. Copiar valores a mano sin artifact/hash está prohibido.

## 6. Mappings comunes

### 6.1 Posiciones

`POSITION_MAPPING_V1` conserva el label original y produce:

```text
sourcePosition
sourcePositionTaxonomy
canonicalPosition: GK | CM | ST | OTHER | AMBIGUOUS
canonicalPositionGroup
mappingRuleId
confidence
reviewReason?
```

Reglas:

- `GK` solo desde goalkeeper explícito;
- `CM` no absorbe automáticamente DM, AM, wide midfielder o “midfielder” sin
  granularidad;
- `ST` no absorbe automáticamente winger/forward genérico;
- registros multi-position conservan pesos/minutos por posición cuando la
  fuente los provee;
- `AMBIGUOUS` no entra a cohorts GK/CM/ST sin una regla revisada;
- el mapping y sus cambios se versionan.

### 6.2 Competiciones

`COMPETITION_MAPPING_V1` separa:

```text
observedCompetitionId
observedEditionId
sourceProviderId
simulationCompetitionDefinitionId?
competitionFamily
countryOrRegion
seasonConvention
formatProfile
mappingConfidence
```

La identidad observada no se sustituye por `CompetitionDefinition`. IJL no es
contexto estadístico de gameplay ni LeagueCompetitiveStrength.

### 6.3 Tiempo/era

Todo registro conserva season nominal y, cuando aplique, fecha/ventana. Una
combinación multi-season declara:

- rules y competition-format changes;
- substitutions/match-count/environment changes;
- pandemia/anomalías y su inclusión/exclusión;
- inflation/currency reference date;
- social platform/measurement era;
- weighting entre temporadas.

No se fija aquí una ventana histórica universal.

## 7. Registry de datasets planificados

Todas las filas tienen `datasetVersion=TBD`, `status=PLANNED`, `sampleSize=TBD`,
`file/hash=TBD` y provenance primaria aún no identificada salvo que se indique
“normativa interna”.

### 7.1 Player, Creation, Development y uso

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-PLAYER-CREATION-REFERENCE` | Distribución inicial de jugadores | age, position, context, capability-family proxies, cohort weights | `POSITION_MAPPING_V1`; capabilities internas no son directamente observables | `CT-CRE-CAP/POWER/CORR`; creation generator/surrogate | B/C triangulado; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-PLAYER-TRAIT-REFERENCE` | Proxies de traits | trait proxy, definition, reliability, age/context | alto measurement error; no inferir hidden trait como fact | `CT-CRE-TRAIT`; trait generator | C + product design; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-PLAYER-FOOT-REFERENCE` | Dominant foot prevalence | foot, position, country/league, player count | BOTH definitions varían; conservar source semantics | `CT-CRE-FOOT`; foot utilities | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-POSITION-EVALUATION-REFERENCE` | Señales por posición | position, task/stat dimensions, minutes, context | no usar rating único; GK/CM/ST separados | `CT-CRE-SUIT`; suitability profiles | B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-DEVELOPMENT-LONGITUDINAL` | Trayectorias por edad | player-season, age, minutes, position, contextual performance/task proxies | survivor/selection bias, transfers/context changes | `CT-DEV-*`; maturation/acquired/wear | B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-POSITION-USAGE-HISTORY` | Minutos efectivos por posición | player-window, total minutes, position minutes, manager/context | fuentes con posiciones genéricas/duplicadas | `CT-DEV-RETRAIN`, `CT-CRE-DOMPOS`; retraining | B; `NICE_TO_HAVE` antes de retraining V1 |
| `DS-ROLE-MINUTES-REFERENCE` | Role/exposure observado | appearances, starts, minutes, match opportunities, squad/role proxy, position, league | SportingRole interno requiere mapping de proxy; lineup coverage | `CT-ROLE-*`, `CT-MIN-*`, `CT-APP-*`; roleMinutes | A/B; `BLOCKS_INITIAL_PARAMETERSET` |

### 7.2 Performance y Health

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-PERFORMANCE-REFERENCE` | Producción y dimensiones por 90/exposure | player-match/window, minutes, goals, assists, GK shots/saves, CM task proxies, team/opponent context | proveedor/métrica cambia por era; missing task dimensions | `CT-PERF-*`, `CT-ST-*`, `CT-CM-*`, `CT-GK-*`; performance | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-PERFORMANCE-LONGITUDINAL` | Persistencia Q/season de performance | ordered windows, exposure, contextual dimensions, form proxies | form es latent; calendario/transfer segmentation | form/autocorrelation/cross-system diagnostics | B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-PRESSURE-PERFORMANCE-REFERENCE` | Contextos de presión | phase/stakes, player exposure, position-specific performance | pressure definition es product/data binding; small samples | `CT-PERF-PRESS`; pressure coefficients | B/C; `NICE_TO_HAVE` con provisional product target |
| `DS-INJURY-EXPOSURE` | Incidencia con denominador | player exposure hours/match equivalents, training vs match, injury definition, position, age, congestion | no comparar counts sin exposure; underreporting/training gaps | `CT-HLT-LOAD/FAT/FIT`, `CT-INJ-FREQ/MIX/LOAD`; hazards | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-INJURY-RECOVERY` | Severity, recovery, recurrence, sequela | episode, family, origin, severity definition, start/end/censoring, recurrence relation, return-to-play, position | censored episodes; “return” no equivale full fitness; privacy | `CT-INJ-SEV/AVAIL`, `CT-REC-*`, `CT-REL-*`, `CT-SEQ-*` | A/B; `BLOCKS_INITIAL_PARAMETERSET` |

### 7.3 Club, Competition, Calendar y World

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-CLUB-VERTICAL-SLICE` | exactamente 8 clubes detallados por Argentina/España | immutable identity, membership baseline, attack/defense/control inputs, prestige, finance proxy, development/medical/stability proxies, reach, source period, uncertainty | proxies no equivalen estados internos; licensing/coverage | club baselines/qualities/reach and many club targets | A for identity; B/C for proxies; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-CLUB-HISTORICAL-STRENGTH` | Trayectorias de fuerza de club | club-season, context-adjusted attack/defense/control evidence, outcomes | format/league changes; promoted/relegated sample selection | `CT-CLUB-STRENGTH`, world evolution | B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-CLUB-FINANCIAL-REFERENCE` | Proxies económicos | club-season, revenue/wage/spend proxies, currency/date/confidence | private salaries/accounts, currency/inflation | `CT-CLUB-FIN`, `CT-MKT-FEAS`; finance | B/C; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-MANAGER-TENURE` | Tenure/turnover | club, manager spell, start/end, dismissal/other, expectation proxy | interim managers and ownership events | `CT-MGR-TURN/QUALITY`; manager hazard/generation | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-SQUAD-COMPETITION-PROXY` | Position scarcity/competition proxy | club-window-position, depth, minutes concentration, age/profile, tactical demand proxy | no individual squad simulation; position mapping ambiguity | `CT-PCOMP`, `CT-MKT-NEED/SCAR` | B/C; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-COMPETITION-CATALOG` | Gameplay CompetitionDefinitions | IDs, country/region, format, phases, participants policy, match equivalents, progression, pressure profile refs | normative data; observed identity mapping separate | `CT-CAL-*`, `CT-COMP-*`; definition bindings | A/normative; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-NATIONAL-COMPETITION-CATALOG` | NationalCompetitionDefinitions | IDs, editions, call-up/squad policy, phases, field, timing, eligibility refs | DR-021/025/068 dependencies | National targets/outcomes | A/normative; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-AWARD-DEFINITION-CATALOG` | AwardDefinitions gameplay | award/edition IDs, type, eligibility, evaluation window, fields/size, profiles, ordinal cutoffs, tie/timing | no scoring points/equivalence in this artifact | Awards targets/parameters | A/normative; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-CALENDAR-SLICE` | Calendar/quarter allocation | definition/edition, guaranteed/conditional match equivalents, phase→Q, congestion/pressure, international/market windows | no fechas falsas; DR-021/067 remain policies | `CT-CAL-*`, Role/Health/National exposure | A/normative; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-COMPETITION-HISTORY` | Club competition outcomes | edition, competition, team, rank/phase/title, format, country/region | format changes and participant coverage | `CT-COMP-*`, `CT-WORLD-*` | A; `BLOCKS_INITIAL_PARAMETERSET` |

### 7.4 Market, Money y Contracts

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-TRANSFER-HISTORY` | Movimientos/loans/free transfers | player, source/destination, operation, agreement/effective date, contract status, failure visibility where available | failed interests/offers rarely public; selection bias | interest/offers/transfers/loans/negotiation targets | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-TRANSFER-FEES` | Fees observados | amount, currencyCode, nominal date, disclosed/estimated flag, operation, clubs, player context | undisclosed/add-ons; nominal vs guaranteed | `CT-MKT-VAL/AGE/FEE/TAIL`; fee/valuation | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-MARKET-VALUATION-PROXY` | Reference valuations | provider estimate, date, currency, player/context, methodology/version if known | not truth; circularity/provider black box | valuation dispersion diagnostics | B/C; `NICE_TO_HAVE` |
| `DS-SALARY-REFERENCE` | Salary/wage evidence | amount, currency, gross/net, period unit, bonuses inclusion, date, league/club/player class | severe missingness/incomparability | `CT-MKT-SAL`; salary | B/C; `BLOCKS_INITIAL_PARAMETERSET` or product provisional |
| `DS-CONTRACT-REFERENCE` | Contract duration/renewal/expectation proxies | start/end, option handling, renewal, player age/context, operation | expectation not observed directly; options ambiguity | contract duration/renewal/expectation targets | A/B for terms; C/design for expectation | `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-CURRENCY-INFLATION` | Currency/FX/inflation reference | currency pair/base, rate, effective date, source, inflation/index series, convention | DR-027 base/conversion policy pending; historical revisions | money invariants and normalization | A; `BLOCKS_INITIAL_PARAMETERSET` |

Reglas monetarias adicionales:

- ningún amount existe sin `currencyCode`, unidad (minor/major), fecha y source;
- gross/net, annual/weekly/monthly y guaranteed/add-ons son campos explícitos;
- conversion conserva source rate, timestamp/date, direction y rounding;
- una unidad base de calibración puede definirse por DR-027, pero G3D-1 no la
  elige;
- Money persistido en gameplay sigue integer minor units; datasets pueden
  conservar decimal source exacto antes de normalizar.

### 7.5 National Team, Awards, Reputation y Social

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-NATIONAL-SELECTION-HISTORY` | Call-ups/squads/minutes | player, eligibility basis where known, national team, window, callup, squad, minutes, role proxy, position, age | eligibility histories incomplete; calendar/roster changes | `CT-NT-CALL/FIELD/INC/SQUAD/MIN/GEN` | A/B; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-NATIONAL-COMPETITION-HISTORY` | Outcomes internacionales | definition/edition, phase/rank/title, team, format, field context | format/qualification changes | `CT-NT-STRENGTH/OUTCOME` | A; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-AWARD-HISTORY` | Nominations/placements/winners/stat leaders | AwardDefinition mapping, edition, player, placement/status, position, tie, eligibility context | nomination lists/ties change by award/era | `CT-AWD-*`; award fields/profiles | A; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-REPUTATION-REFERENCE` | Sporting reputation proxy | surveys/rankings/media or documented composite, date, market/region, method | latent/construct validity; must not use CareerScore/MarketValue as truth | `CT-REP-SPORT/CORR` | C + product design; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-SOCIAL-AUDIENCE-REFERENCE` | Followers/audience snapshots | platform, account, date, followers, region coverage if available, account age | cross-platform duplicates, bots, unavailable history, platform era | `CT-REP-AWARE/REG`, `CT-SOC-FOLLOW` | B/C; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-SOCIAL-ENGAGEMENT-REFERENCE` | Engagement observations | platform, date/window, denominator, unique people vs interactions, content type, followers | definitions incomparable across platforms; API changes | `CT-REP-SENT`, `CT-SOC-ENG` | B/C; `BLOCKS_INITIAL_PARAMETERSET` |
| `DS-PUBLIC-ATTENTION-REFERENCE` | Attention/event response | event type, timestamp/window, search/media/social proxy, regions, baseline | news/platform bias; causal attribution; short histories | `CT-REP-ATTN`; impulse/decay profiles | B/C + product design; `NICE_TO_HAVE` for provisional V1 |

Social datasets nunca agregan plataformas sin declarar duplicate-audience
policy, denominator, account age, platform era y measurement definition.

### 7.6 Career, Retirement y Comeback

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-CAREER-RETIREMENT-HISTORY` | Career/retirement/comeback longitudinal | player, active definition, last competitive activity, declared retirement, comeback, lower-tier continuation, unattached intervals, national-only retirement, position, age, health/market context where known | left/right censoring, lower-tier missingness, announcement≠effective status | `CT-RET-*`, `CT-CB-*`; retirementComeback | A/B; `BLOCKS_INITIAL_PARAMETERSET` |

Definiciones mínimas antes de adquisición:

- `sportingRetirement`: deja actividad como jugador; no se confunde con retiro
  de selección;
- `temporaryInactivity`: ausencia sin evidencia suficiente de retiro;
- `unattached`: sin club, pero activo cuando existe evidencia;
- `comeback`: retorno a actividad deportiva después de sporting retirement;
- continuidad en lower tier cuenta como actividad, aunque quede fuera del tier
  detallado;
- registros sin observación terminal son right-censored, no “retired”.

### 7.7 Scoring

| Dataset ID | Título / domain | Scope, schema y unidades mínimas | Mapping / sesgos y limitaciones | Targets / parámetros | Tier requerido / prioridad |
|---|---|---|---|---|---|
| `DS-SCORING-PRI-COHORTS` | Cohortes PRI GK/CM/ST | cohort keys, position, context/era, exposure/evidence bands, task/performance metrics, sample counts, empirical CDF knots | must preserve segment/multiclub semantics | `CT-SCR-PRI-*`; PRI transforms | A/B; `BLOCKS_SCORING_CONFIG` |
| `DS-SCORING-CONTRIBUTION-COHORTS` | Cohortes CC | competition/profile, participation/exposure, contribution dimensions, achievement relation | SportingRole alone forbidden; missing eligibility | `CT-SCR-CC-*`; CC transforms | A/B + product design; `BLOCKS_SCORING_CONFIG` |
| `DS-SCORING-CATALOG` | Catálogo competitivo | IJL by definition/edition, club/national point values, award values/equivalence, record/longevity definitions, stacking/caps refs | separate from gameplay definitions; MASTER_SPEC authority | `CT-SCR-ACH/NAT/AWD/REC/PBR`; ScoringConfiguration | A/normative; `BLOCKS_SCORING_CONFIG` |
| `DS-SCORING-SOCIAL-COHORTS` | Cohortes social/historic para PRL/PBR | authorized metric, cohort/context, rational CDF/transform, sample count, provenance | platform-era bias; avoid double-count sporting facts | `CT-SCR-POP/PC`; socialHistoric transforms | B/C + product design; `BLOCKS_SCORING_CONFIG` |

`ScoringCalibrationData` se construye exclusivamente desde versiones `FROZEN`
de estos datasets y sus transforms. Contiene PRI cohort transforms,
exposure/evidence bands, IJL, catalog mappings y social/historic transforms;
queda ligado a un único `scoringVersion`/hash y separado del
`EngineParameterSet`.

## 8. Award y competition catalogs de DR-025

La publicación de DR-025 requiere al menos:

| Catálogo | Gameplay fields | Scoring fields | Version owner |
|---|---|---|---|
| Competition | ID, edition, country/region, phases, format, calendar/exposure, field profiles, eligibility/participants | IJL, achievement values/multipliers/CC/stacking cuando puntúa | gameplay `dataVersion`; scoring fields en `scoringVersion` |
| National competition | ID, edition, call-up/squad policy, phases, pressure, eligibility ref | national points/outcomes/CC | igual separación |
| Award | ID, edition, eligibility, evaluation window, type, field size/profile, ordinal cutoffs, timing, tie policy | points, equivalence group, IJL policy, stacking/caps | igual separación |

No se permite un único objeto mutable compartido entre gameplay y Scoring.
Pueden referenciar el mismo ID semántico, pero cada recurso conserva owner y
hash propios.

## 9. External-research backlog

No se ejecutó esta investigación. El orden es contractual:

### `BLOCKS_INITIAL_PARAMETERSET`

1. Player/role/minutes/performance distributions GK/CM/ST en Argentina/España.
2. Injury incidence con exposure y recovery/recurrence definitions compatibles.
3. Club baselines, calendars y CompetitionDefinitions del slice.
4. Transfer/contract/money datasets con currency/date.
5. National selection/outcome y Award history/catalog definitions.
6. Career retirement/comeback histories con censoring/lower-tier policy.
7. Social audience/engagement reference o product-approved provisional design.

### `BLOCKS_SCORING_CONFIG`

1. PRI cohorts y exposure/evidence bands.
2. CC cohorts y eligibility/contribution facts.
3. Complete IJL/competition/award/record/longevity catalog from normative source.
4. Social/historic scoring cohorts and product balance targets.

### `NICE_TO_HAVE`

- richer pressure-performance samples;
- historical PublicAttention event response;
- detailed position retraining histories;
- provider valuation panel beyond observed fees;
- better institutional-quality proxies.

### `POST_SLICE`

- additional countries/leagues/positions;
- cross-platform audience deduplication at global scale;
- full squad/fixture/player population datasets;
- commercial/sponsor datasets;
- competitions/awards outside the approved slice.

## 10. Dataset acceptance

A dataset no puede pasar a `VALIDATED` si falta cualquiera de:

- license/use review;
- source and normalized hashes;
- units and schema validation;
- mappings and ambiguous-row disposition;
- missingness/censoring policy;
- bias/limitations statement;
- linked target/parameter coverage;
- reproducible transformation manifest.

`FROZEN` además exige retention, immutable catalog entry y acceptance report.

## 11. Referencias

- [Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md)
- [Calibration Target Registry](CALIBRATION_TARGET_REGISTRY.md)
- [Golden Vector Registry](GOLDEN_VECTOR_REGISTRY.md)
- [Scoring Math](SCORING_MATH_SPEC.md)
- [ADR-015](adr/015-version-taxonomy.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-080](adr/080-exact-scoring-mathematics.md)

## 12. Binding contractual G3D-2

Las 40 entradas conservan su `datasetId`; no fue necesario dividirlas. Todas
quedan `CONTRACT_DEFINED + PLANNED`. Los campos de §2 se complementan con los
schemas y mappings de
[`VERTICAL_SLICE_DATA_CATALOG_SPEC.md`](VERTICAL_SLICE_DATA_CATALOG_SPEC.md).

Perfiles contractuales:

| Perfil | Campos adicionales obligatorios |
|---|---|
| `PLAYER_OBSERVATION` | anonymous/source identity, season/competition, position mapping, exposure, age/context, quality flags |
| `LONGITUDINAL_OBSERVATION` | ordered periods, transfers/context changes, left/right censoring y cohort bias |
| `CLUB_EVIDENCE` | club/season/dimension, raw evidence, units, transform, confidence, uncertainty, limitations |
| `CATALOG_DEFINITION` | stable IDs, aliases, valid period, rule/profile refs, provenance, dataVersion |
| `MONEY_OBSERVATION` | amount/unit, currency, date, disclosed status, normalization refs y confidence |
| `EVENT_HISTORY` | definition/edition mapping, occurrence/outcome, timing, eligibility y source completeness |
| `SCORING_RESOURCE` | scoringVersion, gameplay refs, exact values/transforms, provenance y publication status |

| Dataset ID | Perfil / scope V1 | Tier / research | Dependencias | Publication gate |
|---|---|---|---|---|
| `DS-PLAYER-CREATION-REFERENCE` | `PLAYER_OBSERVATION`; GK/CM/ST, ARG/ESP reference cohorts | B/C; P1 | baseline, position mapping | normalized cohorts + bias review |
| `DS-PLAYER-TRAIT-REFERENCE` | `PLAYER_OBSERVATION`; proxy definitions only | C/D; P1 | product construct policy | uncertainty + no hidden-trait claims |
| `DS-PLAYER-FOOT-REFERENCE` | `PLAYER_OBSERVATION`; RIGHT/LEFT/BOTH | A/B; P1 | position mapping | source semantics and denominator validated |
| `DS-POSITION-EVALUATION-REFERENCE` | `PLAYER_OBSERVATION`; task signals GK/CM/ST | B; P1 | performance mapping | position-specific transforms reviewed |
| `DS-DEVELOPMENT-LONGITUDINAL` | `LONGITUDINAL_OBSERVATION`; age/exposure/performance | B; P1 | player exposure, context mapping | censoring/survivorship report |
| `DS-POSITION-USAGE-HISTORY` | `LONGITUDINAL_OBSERVATION`; minute-conserving position use | B; P3 | position mapping | ambiguous labels excluded/reviewed |
| `DS-ROLE-MINUTES-REFERENCE` | `PLAYER_OBSERVATION`; opportunity/minutes/starts/role proxy | A/B; P1 | calendar, memberships | opportunity-aligned exposure validated |
| `DS-PERFORMANCE-REFERENCE` | `PLAYER_OBSERVATION`; position-specific production/context | A/B; P1 | exposure, club/competition mapping | units/denominators and GK/CM/ST coverage |
| `DS-PERFORMANCE-LONGITUDINAL` | `LONGITUDINAL_OBSERVATION`; ordered Q/season summaries | B; P1 | calendar, transfers | no same-window leakage |
| `DS-PRESSURE-PERFORMANCE-REFERENCE` | `EVENT_HISTORY`; phase/stakes/performance | B/C; P3 | pressure profiles/calendar | sample/selection-bias review |
| `DS-INJURY-EXPOSURE` | `PLAYER_OBSERVATION`; injury incidence with denominator | A/B; P1 | injury mapping, calendar | origin/exposure compatible |
| `DS-INJURY-RECOVERY` | `LONGITUDINAL_OBSERVATION`; episodes/recovery/relapse/censoring | A/B; P1 | six-family mapping | overlapping/censoring QA |
| `DS-CLUB-VERTICAL-SLICE` | `CLUB_EVIDENCE`; exactly 8 clubs per ARG/ESP league | A identity, B/C proxy; P0 | baseline, portfolio decision | 16 identities + every required dimension |
| `DS-CLUB-HISTORICAL-STRENGTH` | `CLUB_EVIDENCE`; multi-edition attack/defense/control | B; P1 | competition history | format/context transformations validated |
| `DS-CLUB-FINANCIAL-REFERENCE` | `CLUB_EVIDENCE` + `MONEY_OBSERVATION` | B/C; P1 | monetary artifact | date/currency/proxy comparability |
| `DS-MANAGER-TENURE` | `EVENT_HISTORY`; manager spells/turnover | A/B; P1 | club IDs/calendar | interim/reason policy validated |
| `DS-SQUAD-COMPETITION-PROXY` | `PLAYER_OBSERVATION`; club-window-position concentration | B/C; P1 | exposure/position mapping | depth proxy limitations documented |
| `DS-COMPETITION-CATALOG` | `CATALOG_DEFINITION`; six club competition slots | A; P0 | baseline/format sources | IDs, stages, exposure, tie/mobility complete |
| `DS-NATIONAL-COMPETITION-CATALOG` | `CATALOG_DEFINITION`; ARG senior contexts | A; P0 | ADR-082/calendar | eligibility/timing/format refs complete |
| `DS-AWARD-DEFINITION-CATALOG` | `CATALOG_DEFINITION`; exactly five V1 slots | A; P0 | baseline/award history | eligibility/window/field/tie complete |
| `DS-CALENDAR-SLICE` | `CATALOG_DEFINITION`; phase→Q/windows/boundaries | A; P0 | competition catalogs/baseline | no gaps, invalid overlaps or future exposure |
| `DS-COMPETITION-HISTORY` | `EVENT_HISTORY`; ARG/ESP/continental editions | A; P1 | competition mapping | participant/outcome/format alignment |
| `DS-TRANSFER-HISTORY` | `EVENT_HISTORY`; permanent/free/loan/renewal | A/B; P1 | club IDs, market windows | operation/timing/context completeness |
| `DS-TRANSFER-FEES` | `MONEY_OBSERVATION`; nominal fee evidence | A/B; P1 | monetary artifact | disclosed/add-ons and date/currency QA |
| `DS-MARKET-VALUATION-PROXY` | `MONEY_OBSERVATION`; provider estimates, diagnostic | B/C; P3 | methodology/version | no objective-value claim |
| `DS-SALARY-REFERENCE` | `MONEY_OBSERVATION`; gross/net/period explicit | B/C; P1 | monetary artifact | comparable units or explicit exclusion |
| `DS-CONTRACT-REFERENCE` | `EVENT_HISTORY`; terms/duration/renewal | A/B/C; P1 | transaction mapping | option/expectation ambiguity documented |
| `DS-CURRENCY-INFLATION` | `CATALOG_DEFINITION`; ARS/EUR series/transforms | A; P0 | baseline/base-date policy | formula, revisions, rounding and hashes |
| `DS-NATIONAL-SELECTION-HISTORY` | `EVENT_HISTORY`; ARG callups/squads/minutes | A/B; P1 | ADR-082, national calendar | no eligibility inference |
| `DS-NATIONAL-COMPETITION-HISTORY` | `EVENT_HISTORY`; national outcomes | A; P1 | national definitions | format/edition mapping complete |
| `DS-AWARD-HISTORY` | `EVENT_HISTORY`; five V1 slots and reference fields | A; P1 | AwardDefinitions | nomination/tie/status semantics validated |
| `DS-REPUTATION-REFERENCE` | `PLAYER_OBSERVATION`; construct/proxy by market | C/D; P3 | reach/region mapping | construct validity review |
| `DS-SOCIAL-AUDIENCE-REFERENCE` | `PLAYER_OBSERVATION`; platform/date partitions | B/C; P3 | market partitions | duplicate audience/platform-era policy |
| `DS-SOCIAL-ENGAGEMENT-REFERENCE` | `PLAYER_OBSERVATION`; denominator/content type | B/C; P3 | audience dataset | engagement definition compatible |
| `DS-PUBLIC-ATTENTION-REFERENCE` | `EVENT_HISTORY`; event windows/regions/baseline | B/C; P3 | public signal mapping | causal-attribution limitations |
| `DS-CAREER-RETIREMENT-HISTORY` | `LONGITUDINAL_OBSERVATION`; activity/retirement/comeback | A/B; P1 | external-tier activity definition | censoring and comeback rules validated |
| `DS-SCORING-PRI-COHORTS` | `SCORING_RESOURCE`; GK/CM/ST/context/evidence | A/B; P2 | performance/exposure | frozen samples/CDF/fallback hierarchy |
| `DS-SCORING-CONTRIBUTION-COHORTS` | `SCORING_RESOURCE`; participation/contribution | A/B + product; P2 | eligibility/competition facts | monotonic transform + provenance |
| `DS-SCORING-CATALOG` | `SCORING_RESOURCE`; competitions/awards/records/milestones | A/normative; P0/P2 | MASTER_SPEC, gameplay IDs | no missing value inferred; exact hashes |
| `DS-SCORING-SOCIAL-COHORTS` | `SCORING_RESOURCE`; authorized social/historic metrics | B/C + product; P2 | social datasets/PD-G3D-010 | no sporting double count |

Aliases/deprecations G3D-2: ninguno. `DS-CLUB-VERTICAL-SLICE` conserva tanto
identidad como evidence por ser un único publication bundle; sus raw sources
pueden ser múltiples artifacts sin crear otro datasetId.

## 13. Governance y reference-window bindings G3D-3A

Las siguientes 40 bindings son metadata heredable; no cambian IDs ni estado
`PLANNED`.

Leyenda compacta:

- cutoff: `CLOSED` = `PRE_CUTOFF_CLOSED`; `PARTIAL` = snapshot
  `PRE_CUTOFF_PARTIAL` autorizado; `TIMELESS+CLOSED` separa definition estable
  de edition binding;
- window decision: `ER`, `PD`, `SV`, `ER+SV`, `NA` corresponden a
  `EXTERNAL_RESEARCH`, `PRODUCT_DECISION`, `STATISTICAL_VALIDATION`,
  `EXTERNAL_RESEARCH_AND_STATISTICAL_VALIDATION`, `NOT_APPLICABLE`;
- owners: primary owner / research owner; `DATA` = `DATA_OWNER` y `SCORING` =
  `SCORING_OWNER`. Todo freeze añade `TECHNICAL_VALIDATOR` y
  `PROVENANCE_REVIEWER`;
- usage es postura inicial conservadora. Cada source concreta requiere review;
  `REFERENCE_ONLY` no puede elevarse sin aprobación;
- privacy usa las clases de
  [G3D Data Governance](G3D_DATA_GOVERNANCE.md).

| Dataset ID | Observation category / cutoff / window | Owner / privacy | Initial usage class | Research / acquisition artifact | Freeze prerequisites |
|---|---|---|---|---|---|
| `DS-PLAYER-CREATION-REFERENCE` | `SNAPSHOT`; `CLOSED|PARTIAL`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 player exposure/development; dataset candidate manifest | cutoff, position mapping, license/privacy, cohort/bias validation |
| `DS-PLAYER-TRAIT-REFERENCE` | `SNAPSHOT`; `CLOSED|PARTIAL`; `ER` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 development + product construct artifact | proxy semantics, uncertainty, no identity/hidden-trait claim |
| `DS-PLAYER-FOOT-REFERENCE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 player exposure | foot definition, denominator, mapping, license |
| `DS-POSITION-EVALUATION-REFERENCE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 performance | GK/CM/ST mapping and task comparability |
| `DS-DEVELOPMENT-LONGITUDINAL` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `LOCAL_PRIVATE_SOURCE` | P1 development | pseudonymization, censoring/survivorship, comparable periods |
| `DS-POSITION-USAGE-HISTORY` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P3 position history | minute conservation and ambiguous-label review |
| `DS-ROLE-MINUTES-REFERENCE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 player exposure | calendar opportunity, denominator and membership mapping |
| `DS-PERFORMANCE-REFERENCE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 performance | source methodology/units, exposure, GK/CM/ST coverage |
| `DS-PERFORMANCE-LONGITUDINAL` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `LOCAL_PRIVATE_SOURCE` | P1 performance | pseudonymization, ordered periods, no same-window leakage |
| `DS-PRESSURE-PERFORMANCE-REFERENCE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P3 pressure | pressure definition, sample/bias review, source coverage |
| `DS-INJURY-EXPOSURE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `LOCAL_PRIVATE_SOURCE` | P1 injury exposure | public sports-only, compatible denominator/origin/taxonomy |
| `DS-INJURY-RECOVERY` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `LOCAL_PRIVATE_SOURCE` | P1 injury recovery | public sports-only, censoring/relapse, six-family mapping |
| `DS-CLUB-VERTICAL-SLICE` | `SNAPSHOT`; `PARTIAL` + identity `TIMELESS`; `ER` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `MANUAL_PUBLIC_FACT` | P0 club identity; `DETAILED_CLUB_SELECTION_REPORT` | cutoff membership, 16 IDs, portfolio evidence, rights/license |
| `DS-CLUB-HISTORICAL-STRENGTH` | `HISTORICAL`; `CLOSED`; `ER+SV` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `REFERENCE_ONLY` | P1 club sporting | format/context transforms, complete IDs, drift review |
| `DS-CLUB-FINANCIAL-REFERENCE` | `MONETARY_SERIES`; `CLOSED|PARTIAL`; `ER+SV` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `REFERENCE_ONLY` | P1 club institutional | currency/date/proxy definition, license, normalization refs |
| `DS-MANAGER-TENURE` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `MANUAL_PUBLIC_FACT` | P1 manager/squad | spell/interim/reason policy, cutoff and completeness |
| `DS-SQUAD-COMPETITION-PROXY` | `SNAPSHOT`; `PARTIAL`; `ER+SV` | DATA/DATA; `AGGREGATED_NON_IDENTIFYING` | `REDISTRIBUTABLE_DERIVED` pending review | P1 manager/squad | source license, position mapping, aggregation/privacy review |
| `DS-COMPETITION-CATALOG` | `SINGLE_EDITION`; `TIMELESS+CLOSED`; `ER` | DATA/DATA; `NO_PERSON_DATA` | `MANUAL_PUBLIC_FACT` | P0 baseline/format; `REFERENCE_EDITION_MANIFEST` + `COMPETITION_FORMAT_EVIDENCE` | official IDs/format/stages/exposure, license manifest, no conflicts |
| `DS-NATIONAL-COMPETITION-CATALOG` | `SINGLE_EDITION`; `TIMELESS+CLOSED`; `ER` | DATA/DATA; `NO_PERSON_DATA` | `MANUAL_PUBLIC_FACT` | P0 national; `NATIONAL_TEAM_REFERENCE_EVIDENCE` | definition/calendar/eligibility sources and ADR-082 binding |
| `DS-AWARD-DEFINITION-CATALOG` | `SINGLE_EDITION`; `TIMELESS+CLOSED`; `ER` | DATA/DATA; `NO_PERSON_DATA` | `MANUAL_PUBLIC_FACT` | P0 awards; `AWARD_CATALOG_EVIDENCE` | exactly five verified definitions, timing/field/tie, license |
| `DS-CALENDAR-SLICE` | `SINGLE_EDITION`; `CLOSED`; `ER` | DATA/DATA; `NO_PERSON_DATA` | `MANUAL_PUBLIC_FACT` | P0 calendar; `CALENDAR_EVIDENCE` | cutoff/format bindings, phase→Q, market/registration windows |
| `DS-COMPETITION-HISTORY` | `HISTORICAL`; `CLOSED`; `ER+SV` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `MANUAL_PUBLIC_FACT` | P1 competition history | format/participant/outcome mapping and anomaly policy |
| `DS-TRANSFER-HISTORY` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 transfer/contract | operation/effective date, club IDs, selection bias and license |
| `DS-TRANSFER-FEES` | `MONETARY_SERIES`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 transfer/contract | disclosed/add-ons semantics, currency/date, money evidence |
| `DS-MARKET-VALUATION-PROXY` | `SNAPSHOT`; `PARTIAL`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P3 market valuation | methodology/version/license; diagnostic-only claim |
| `DS-SALARY-REFERENCE` | `MONETARY_SERIES`; `CLOSED|PARTIAL`; `ER+SV` | DATA/DATA; `AGGREGATED_NON_IDENTIFYING` | `REFERENCE_ONLY` | P1 transfer/contract | gross/net/unit/date comparability and privacy/license |
| `DS-CONTRACT-REFERENCE` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 transfer/contract | option/term semantics, operation mapping, license |
| `DS-CURRENCY-INFLATION` | `MONETARY_SERIES`; `CLOSED|PARTIAL`; `ER` | DATA/DATA; `NO_PERSON_DATA` | `REFERENCE_ONLY` | P0 money; `MONETARY_REFERENCE_EVIDENCE` | official units/series/date/revisions, source license, transform spec |
| `DS-NATIONAL-SELECTION-HISTORY` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `REFERENCE_ONLY` | P1 national history | calendar/roster/position coverage; no eligibility inference |
| `DS-NATIONAL-COMPETITION-HISTORY` | `HISTORICAL`; `CLOSED`; `ER+SV` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `MANUAL_PUBLIC_FACT` | P1 national history | National definitions, edition/format/outcome mapping |
| `DS-AWARD-HISTORY` | `HISTORICAL`; `CLOSED`; `ER+SV` | DATA/DATA; `PUBLIC_ENTITY_IDENTIFIED` | `MANUAL_PUBLIC_FACT` | P1 award history | five-definition mapping, nomination/tie completeness |
| `DS-REPUTATION-REFERENCE` | `SNAPSHOT`; `PARTIAL`; `ER` | DATA/DATA; `AGGREGATED_NON_IDENTIFYING` | `REFERENCE_ONLY` | P3 reputation | construct validity, region/reach and product interpretation |
| `DS-SOCIAL-AUDIENCE-REFERENCE` | `SOCIAL_SNAPSHOT`; `PARTIAL`; `ER+SV` | DATA/DATA; `PUBLIC_FIGURE_METRIC` | `REFERENCE_ONLY` | P3 reputation/social | platform/date/account age/metric/license/privacy |
| `DS-SOCIAL-ENGAGEMENT-REFERENCE` | `SOCIAL_SNAPSHOT`; `PARTIAL`; `ER+SV` | DATA/DATA; `PUBLIC_FIGURE_METRIC` | `REFERENCE_ONLY` | P3 reputation/social | denominator/platform era, no audience identities |
| `DS-PUBLIC-ATTENTION-REFERENCE` | `MULTI_SEASON`; `CLOSED|PARTIAL`; `ER+SV` | DATA/DATA; `AGGREGATED_NON_IDENTIFYING` | `REFERENCE_ONLY` | P3 attention | event window/baseline/region and causal limitation |
| `DS-CAREER-RETIREMENT-HISTORY` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | DATA/DATA; `ANONYMIZED_OBSERVATION` | `LOCAL_PRIVATE_SOURCE` | P1 retirement | pseudonymization, activity/comeback definitions, censoring/lower-tier |
| `DS-SCORING-PRI-COHORTS` | `MULTI_SEASON`; `CLOSED`; `ER+SV` | SCORING/DATA; `AGGREGATED_NON_IDENTIFYING` | `REDISTRIBUTABLE_DERIVED` pending review | P2 PRI | frozen upstream performance/exposure cohorts and provenance |
| `DS-SCORING-CONTRIBUTION-COHORTS` | `LONGITUDINAL`; `CLOSED`; `ER+SV` | SCORING/DATA; `AGGREGATED_NON_IDENTIFYING` | `REDISTRIBUTABLE_DERIVED` pending review | P2 CC | contribution/eligibility facts, product transform review |
| `DS-SCORING-CATALOG` | `HISTORICAL`; `TIMELESS+CLOSED`; `ER` | SCORING/SCORING; `NO_PERSON_DATA` | `PRODUCT_DEFINED` | P0 scoring; `SCORING_CATALOG_EVIDENCE` | MASTER/ADR provenance, public identity refs, exact missing/data states |
| `DS-SCORING-SOCIAL-COHORTS` | `SOCIAL_SNAPSHOT`; `PARTIAL`; `ER+SV` | SCORING/DATA; `AGGREGATED_NON_IDENTIFYING` | `REDISTRIBUTABLE_DERIVED` pending review | P2 social scoring | social source/license, authorized metric, product balance, no double count |

### 13.1 Global freeze prerequisites

Además de la última columna, toda row exige:

1. `referenceCutoffDate` y cutoff classification resolubles;
2. `SourceReference`, `EvidenceRecord` y `SOURCE_LICENSE_MANIFEST`;
3. usage/license/privacy class revisadas;
4. source/transform/output hashes o fingerprint permitido;
5. units, mappings, missingness/censoring y anomaly disposition;
6. owner y reviewer approvals por rol.

No se crearon DatasetDefinitions nuevas. Conteo después de G3D-3A: **40**.

## 14. Referencias G3D-3A

- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)
- [G3D External Research Plan](G3D_EXTERNAL_RESEARCH_PLAN.md)

## 15. Acquisition overlay G3D-3B

La campaña `RSNAP-G3D3B-2026-08-07-C1` actualiza únicamente estados de
acquisition/provenance. No crea `datasetVersion`, no normaliza y no supera
`ACQUIRED`. Los hashes corresponden a artifacts documentales de facts, no a raw
externo (que no fue almacenado).

| Dataset ID | State after G3D-3B | Acquired/source artifact | Remaining gate |
|---|---|---|---|
| `DS-COMPETITION-CATALOG` | `ACQUIRED` | `REFERENCE_EDITION_MANIFEST`, `COMPETITION_FORMAT_EVIDENCE`, EvidenceRecords | canonical IDs/schema, exact bindings, validation and freeze |
| `DS-NATIONAL-COMPETITION-CATALOG` | `ACQUIRED` | `NATIONAL_TEAM_REFERENCE_EVIDENCE`, FIFA evidence | ordinary-window scope if published, normalization and validation |
| `DS-CALENDAR-SLICE` | `ACQUIRED` | `CALENDAR_EVIDENCE` | phase→Q transform, Argentina annual boundary, ordinary international windows and overlap validation |
| `DS-CLUB-VERTICAL-SLICE` | `SOURCE_IDENTIFIED` | `DETAILED_CLUB_SELECTION_REPORT` identifies the 16 clubs | P1 evidence for every required state dimension; identity subset alone does not complete the bundle |
| `DS-AWARD-DEFINITION-CATALOG` | `SOURCE_IDENTIFIED` | `AWARD_CATALOG_EVIDENCE` identifies five candidates | LaLiga field/tie facts and 2025 UEFA-rule continuity before all five can be acquired |
| `DS-CURRENCY-INFLATION` | `SOURCE_IDENTIFIED` | `MONETARY_REFERENCE_EVIDENCE` identifies official routes | retrieve versioned observations, decide exact base dates, terms review and transform spec |
| `DS-SCORING-CATALOG` | `ACQUIRED` | internal normative extraction in `SCORING_CATALOG_EVIDENCE` | normalize exact defined values and keep every enumerated gap unresolved; no points inferred |

The other 33 entries retain their G3D-3A state. Incidental source discovery did
not promote P1/P2/P3 datasets. `SOURCE_IDENTIFIED` and `ACQUIRED` here never mean
`NORMALIZED`, `VALIDATED` or `FROZEN`.

Primary provenance:

- [P0 Evidence Index](P0_EVIDENCE_INDEX.md);
- [Source License Manifest](SOURCE_LICENSE_MANIFEST.md);
- [G3D External Research Plan §12](G3D_EXTERNAL_RESEARCH_PLAN.md#12-resultado-de-la-campaña-g3d-3b).

## 16. Normalization overlay G3D-3C

G3D-3C conserva los 40 `datasetId` y no crea `dataVersion`. Los estados de
subset evitan promover un bundle con campos críticos pendientes.

| Dataset ID | Candidate ID / dataset state | Normalized coverage | Remaining gate |
|---|---|---|---|
| `DS-COMPETITION-CATALOG` | `.../001`; `NORMALIZED_WITH_LIMITATIONS` | six identities/editions/formats; four core formats `VALIDATED_CANDIDATE` | Copa Argentina/Copa del Rey detailed tie/qualification fields; atomic freeze |
| `DS-NATIONAL-COMPETITION-CATALOG` | `.../002`; `NORMALIZED_WITH_LIMITATIONS` | Argentina identity/policy and World Cup 2026 context `VALIDATED_CANDIDATE` | ordinary international calendar and P1 histories |
| `DS-CALENDAR-SLICE` | `.../003`; `NORMALIZED_WITH_LIMITATIONS` | stage→Q, guaranteed/conditional exposure and post-season market candidate | ordinary international windows, exact within-stage allocations and registration detail |
| `DS-CLUB-VERTICAL-SLICE` | `.../004`; `SOURCE_IDENTIFIED` | 16-identity/membership subartifact `VALIDATED_CANDIDATE` | attack/defense/control, prestige, finance, development, medical, stability and reach P1 evidence |
| `DS-AWARD-DEFINITION-CATALOG` | `.../005`; `NORMALIZED_WITH_LIMITATIONS` | five identity/edition candidates | `GAP-P0-AWD-001..003`; no full definition validated |
| `DS-CURRENCY-INFLATION` | `.../006`; `SOURCE_IDENTIFIED` | ARS/EUR currency and source-routing policy `VALIDATED_CANDIDATE` | actual series/vintages, terms, base date and transform |
| `DS-SCORING-CATALOG` | `.../007`; `NORMALIZED_WITH_LIMITATIONS` | 12 gameplay↔scoring IDs and normative subset | IJL, equivalence, records/milestones/historic and cohort resources |

Elipsis en candidate IDs significa el prefijo normativo
`@candidate/RSNAP-G3D3B-2026-08-07-C1`. Los otros 33 datasets conservan su
estado anterior. No hay datasets `FROZEN`; no se adquirió raw externo ni se
asignó un valor de calibración.

Artifacts canónicos:

- [Normalization Spec](G3D_P0_NORMALIZATION_SPEC.md);
- [Candidate Hash Manifest](G3D_P0_CANDIDATE_HASH_MANIFEST.md);
- [Data V1 Readiness](G3D_3C_DATA_V1_READINESS_REPORT.md).

## 17. Focused P0 gap-closure overlay G3D-3B2

G3D-3B2 preserves all 40 `datasetId` values and the G3D-3C parent candidates.
Only the three authorized subsets advance:

| Dataset ID | Revised candidate / dataset state | Newly available | Remaining gate |
|---|---|---|---|
| `DS-AWARD-DEFINITION-CATALOG` | `.../005-r2`; `VALIDATED_CANDIDATE` | five consumer-complete Definitions; real non-public voting fields classified; Pichichi alias/tie resolved | numeric abstract-field profiles, P1 history and atomic Data V1 freeze |
| `DS-CALENDAR-SLICE` | `.../003-r2`; `VALIDATED_CANDIDATE` | ordinary Argentina/FIFA windows, selection checkpoints and maximum-opportunity semantics | exact fixtures are deliberately absent; catalog freeze/registration detail later |
| `DS-CURRENCY-INFLATION` | `.../006-r2`; dataset `ACQUIRED`, binding/transform subset `VALIDATED_CANDIDATE` | four official series routes/units/hashes/terms plus exact rational normalization | normalized retained series artifact, extended periods and atomic freeze |

The abbreviated prefix remains
`@candidate/RSNAP-G3D3B-2026-08-07-C1`. The other 37 datasets retain their
prior state. No dataset is `FROZEN`; no P1 acquisition, parameter value or raw
external artifact entered the repository.

## 18. P1 player-evidence overlay G3D-4A

G3D-4A retains all 40 canonical `datasetId` values. Only aggregate derived
summaries are stored; raw external observations and real-player identifiers are
outside the repository. `NORMALIZED_WITH_LIMITATIONS` is a candidate-subset
state, never `FROZEN` or a published `dataVersion`.

| Dataset ID | G3D-4A state | Acquired coverage | Limitation / next gate |
|---|---|---|---|
| `DS-PLAYER-CREATION-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | strict GK/CM/ST covered-first-tier emergence sensitivity; Spain and multileague summaries; official Argentina debut aggregate | no Argentina age/position panel; source coverage is not professional debut; latent capabilities not observed |
| `DS-POSITION-EVALUATION-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | strict position-task reference for CM/ST/GK from La Liga 2015/16 event data | StatsBomb is noncommercial/reference-only; strict CM N is small; needs permission or alternative source before freeze |
| `DS-DEVELOPMENT-LONGITUDINAL` | `NORMALIZED_WITH_LIMITATIONS` | peer-reviewed La Liga longitudinal findings plus multileague within-player exposure-change summaries | survivorship/censoring; exposure is not capability; direct GK longitudinal performance missing |
| `DS-ROLE-MINUTES-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | Spain/multileague minute share, zero mass, exposure bands, starts/appearances availability and year-to-year persistence | no Argentina player-season panel; SportingRole remains latent |
| `DS-PERFORMANCE-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | Spain ST/CM counts/rates, strict GK/CM/ST event proxies and distribution shapes | Argentina has only official metric semantics; event subset license/small-N limitations |
| `DS-PERFORMANCE-LONGITUDINAL` | `NORMALIZED_WITH_LIMITATIONS` | adjacent quarter-like block correlations and repeated-season production/exposure associations | observed persistence does not separately identify latent Form or capability persistence |

The following related datasets do **not** advance: `DS-PLAYER-TRAIT-REFERENCE`,
`DS-PLAYER-FOOT-REFERENCE`, `DS-POSITION-USAGE-HISTORY` and
`DS-PRESSURE-PERFORMANCE-REFERENCE`. G3D-4A found no evidence sufficient to
promote them. Source and transform hashes are in
[G3D_P1_PLAYER_OBSERVATIONAL_HASH_MANIFEST.md](G3D_P1_PLAYER_OBSERVATIONAL_HASH_MANIFEST.md).

## 19. P1 Health evidence overlay G3D-4B

G3D-4B retains all 40 canonical `datasetId` values and advances only the two
existing Health definitions. Published aggregates are committed; no raw study
data, player identity or private medical observation enters the repository.

| Dataset ID | G3D-4B state | Acquired coverage | Limitation / next gate |
|---|---|---|---|
| `DS-INJURY-EXPOSURE` | `NORMALIZED_WITH_LIMITATIONS` | total/match/training incidence with player-hour denominators; all six V1 families; Argentina/Spain direct and UEFA/global reference; congestion, age and GK context | source definition/era heterogeneity; Argentina second division/one season; Spain older aggregate; exact CM/ST and training-load panels absent; aggregate-only license route |
| `DS-INJURY-RECOVERY` | `NORMALIZED_WITH_LIMITATIONS` | diagnosis/family duration means, medians and tails; censoring contract; recurrence semantics/frequencies; indirect post-return/sequela evidence | endpoint heterogeneity; no row-level censoring artifact; sequelae and MedicalQuality weakly identified; no frozen transform or licensed longitudinal mirror |

Both datasets use `ANONYMIZED_OBSERVATION` for any future row-level candidate,
`TIME_LOSS` as the primary comparable definition, explicit
`injuryDefinitionClass`, and the mapping states
`EXACT_MAPPING|FAMILY_MAPPING|AMBIGUOUS_MAPPING|UNMAPPED`. `UNKNOWN_UNSPECIFIED`
is preserved. Neither dataset is `VALIDATED`, `FROZEN` or part of a published
`dataVersion`.

Canonical evidence:

- [Health Evidence Index](G3D_P1_HEALTH_EVIDENCE_INDEX.md);
- [Health Source and License Manifest](G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST.md);
- [Injury Incidence Evidence](G3D_P1_HEALTH_INJURY_INCIDENCE_EVIDENCE.md);
- [Recovery/Relapse Evidence](G3D_P1_HEALTH_RECOVERY_RELAPSE_EVIDENCE.md);
- [Health Observational Hash Manifest](G3D_P1_HEALTH_OBSERVATIONAL_HASH_MANIFEST.md).

## 20. P1 Club/Market evidence overlay G3D-4C

G3D-4C retains all 40 canonical `datasetId` values. It advances only existing
Club/Manager/Market/Contract definitions, commits aggregate documentary
evidence and keeps raw provider/player/contract data outside the repository.

| Dataset ID | G3D-4C state | Acquired/normalized coverage | Limitation / next gate |
|---|---|---|---|
| `DS-CLUB-VERTICAL-SLICE` | `NORMALIZED_WITH_LIMITATIONS` | all frozen 16 identities; score, manager, formation, participation and market context; official finance routes for three Spain clubs | no final ratings; Argentina player/control/finance depth, medical/reach and reusable-license panel incomplete |
| `DS-CLUB-HISTORICAL-STRENGTH` | `NORMALIZED_WITH_LIMITATIONS` | 39 Spain club-seasons and 16 partial Argentina provider club-seasons; GF/GA/GD/win summaries | Argentina depth/format coverage and opponent-adjusted shots/chances absent |
| `DS-CLUB-FINANCIAL-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | LALIGA aggregate/cost-limit semantics, three official Spain club accounts, AFA institutional route | no comparable 16-club accounts; nominal ARS/EUR never pooled; player wages absent |
| `DS-MANAGER-TENURE` | `NORMALIZED_WITH_LIMITATIONS` | detailed-club match-name spells, historical Argentina termination study and global tenure context | current events lack appointment/departure dates and cause-taxonomy adjudication |
| `DS-SQUAD-COMPETITION-PROXY` | `NORMALIZED_WITH_LIMITATIONS` | strict GK/CM/ST minutes concentration for 39 Spain club-seasons | no usable Argentina strict-position panel; provider/license review |
| `DS-TRANSFER-HISTORY` | `NORMALIZED_WITH_LIMITATIONS` | 2021–cutoff slice movement/age/position aggregates plus FIFA international type context | no complete at-risk cohort; provider type/free/loan/undisclosed fields insufficient |
| `DS-TRANSFER-FEES` | `NORMALIZED_WITH_LIMITATIONS` | strictly positive provider-fee distribution/tails and explicit zero-code class | provider EUR proxy lacks original currency/minor-unit/add-on/disclosure semantics |
| `DS-MARKET-VALUATION-PROXY` | `ACQUIRED` | dated provider valuation schema/source route | methodology/license review; diagnostic only; never Performance truth |
| `DS-SALARY-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | official league/club cost environments and FIFPRO global distribution shape | no contemporary local verified wage panel; gross/net/bonus comparability |
| `DS-CONTRACT-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | broad duration/entry-mode and loan evidence; current expiry schema | no local start/end cohort, expiry-risk renewal denominator or loan outcomes |

All future row-level player observations use `ANONYMIZED_OBSERVATION`; public
club/manager identities may remain identified only where required by their
consumer. Candidate states never imply `FROZEN` or Data V1 publication.

Canonical evidence and licensing:
[G3D_P1_CLUB_MARKET_EVIDENCE_INDEX.md](G3D_P1_CLUB_MARKET_EVIDENCE_INDEX.md),
[G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST.md](G3D_P1_CLUB_MARKET_SOURCE_LICENSE_MANIFEST.md)
and
[G3D_P1_CLUB_MARKET_OBSERVATIONAL_HASH_MANIFEST.md](G3D_P1_CLUB_MARKET_OBSERVATIONAL_HASH_MANIFEST.md).

## 21. P1 National Team/Awards evidence overlay G3D-4D

G3D-4D retains all 40 canonical `datasetId` values and advances only the three
existing National Team/Awards observational datasets. Public nominal facts and
derived summaries are committed; provider rows remain outside the repository.

| Dataset ID | G3D-4D state | Acquired/normalized coverage | Limitation / next gate |
|---|---|---|---|
| `DS-NATIONAL-SELECTION-HISTORY` | `NORMALIZED_WITH_LIMITATIONS` | Argentina 2022/2024/2026 final/preparation/preliminary squads; strict GK/CM/ST World Cup 2022 starts/appearances/minutes; cross-cycle retention; one ordinary-window first-call-up tail | selected-only bias; incomplete plausible non-selected denominator; debut-age and ordinary-window exact-minute panels incomplete |
| `DS-NATIONAL-COMPETITION-HISTORY` | `NORMALIZED_WITH_LIMITATIONS` | 111 cutoff-compatible Argentina results segmented by competition context; official World Cup endpoints; ranking and squad-cycle proxy routes | Tier C full result panel; opponent/control normalization and generation-vs-form separation remain joint |
| `DS-AWARD-HISTORY` | `NORMALIZED_WITH_LIMITATIONS` | five frozen slots; official 2025 fields; Ballon/Kopa/Yashin winner histories; LALIGA POTY and scorer upper-tail observations | nominees/winners are selected tails; POTY human procedure incomplete; full multi-season scorer/nominee panels and cross-era adapters pending |

All three candidates use the existing `MULTI_SEASON`/`LONGITUDINAL` window
contracts and are not `FROZEN`. Strict position mapping preserves unmapped broad
roles. `DS-AWARD-DEFINITION-CATALOG` is unchanged: G3D-4D supplies calibration
history, not new definitions or scoring values.

Canonical evidence:

- [National Team Evidence](G3D_P1_NATIONAL_TEAM_EVIDENCE.md);
- [Awards Calibration Evidence](G3D_P1_AWARDS_CALIBRATION_EVIDENCE.md);
- [National/Awards Evidence Index](G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX.md);
- [National/Awards Source Manifest](G3D_P1_NATIONAL_AWARDS_SOURCE_LICENSE_MANIFEST.md);
- [National/Awards Observational Hash Manifest](G3D_P1_NATIONAL_AWARDS_OBSERVATIONAL_HASH_MANIFEST.md).

## 22. P1 Reputation/Social/Retirement evidence overlay G3D-4E

G3D-4E retains all 40 canonical `datasetId` values and advances only the five
existing Reputation/Social/Retirement definitions. Public aggregate metrics and
career-event facts are committed; raw platform rows, audience identities,
private reasons and player-level provider histories remain outside the
repository.

| Dataset ID | G3D-4E state | Acquired/normalized coverage | Limitation / next gate |
|---|---|---|---|
| `DS-REPUTATION-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | sport/club/public association, typed event chronology and construct boundary | SportingReputation remains latent; persistence/impulse separation and Argentina/Spain player panel are joint |
| `DS-SOCIAL-AUDIENCE-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | dated Instagram cross-section/event tails plus official platform gain/loss semantics | selected/women/platform bias; no representative male longitudinal or duplicate-audience panel |
| `DS-SOCIAL-ENGAGEMENT-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | separate interaction definitions and published audience/engagement heterogeneity | incompatible platform denominators and no longitudinal football persistence panel |
| `DS-PUBLIC-ATTENTION-REFERENCE` | `NORMALIZED_WITH_LIMITATIONS` | reproducible search-query contract and event baseline/peak/decline references | query/player attribution, repeated events and freeze-quality snapshots |
| `DS-CAREER-RETIREMENT-HISTORY` | `NORMALIZED_WITH_LIMITATIONS` | censored career-duration/retirement summaries, public chronology and verified competitive returns | no representative Argentina/Spain cohort, strict CM/ST survival or comeback denominator |

Future row-level candidate histories use `AnonymousObservationId`; public
player identity is retained only for a nominal official retirement/comeback
fact. None of these datasets is `VALIDATED`, `FROZEN` or part of a published
`dataVersion`.

Canonical evidence:

- [Reputation/Social Evidence](G3D_P1_REPUTATION_SOCIAL_EVIDENCE.md);
- [Retirement/Comeback Evidence](G3D_P1_RETIREMENT_COMEBACK_EVIDENCE.md);
- [Reputation/Retirement Evidence Index](G3D_P1_REPUTATION_RETIREMENT_EVIDENCE_INDEX.md);
- [Reputation/Retirement Source Manifest](G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST.md);
- [Reputation/Retirement Observational Hash Manifest](G3D_P1_REPUTATION_RETIREMENT_OBSERVATIONAL_HASH_MANIFEST.md).
