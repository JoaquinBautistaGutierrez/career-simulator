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

