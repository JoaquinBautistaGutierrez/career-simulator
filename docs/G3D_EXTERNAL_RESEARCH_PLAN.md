# G3D External Research Plan

## 1. Estado y reglas

Este backlog especifica y registra investigación. G3D-3A congeló governance,
preguntas y artifacts sin ejecutar búsquedas; G3D-3B ejecutó la campaña P0
`RSNAP-G3D3B-2026-08-07-C1` bajo
[G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md). Sus resultados están en
§12. Una fuente pública no se presume redistribuible.

Jerarquía deseada:

1. fuente oficial/primaria;
2. competición/federación oficial;
3. dataset/proveedor estadístico reproducible;
4. filing financiero o reporting confiable;
5. fuentes secundarias convergentes;
6. fallback sintético/product decision explícito.

Cada task debe documentar disponibilidad, licencia, redistribución, términos de
scraping/API, atribución, reproducibilidad y si solo pueden almacenarse
agregados derivados.

## 2. Contract de research item

```text
ResearchTask {
  researchId
  question
  affectedDatasetIds[]
  desiredEvidenceTier
  sourceHierarchy[]
  fallback
  observationPeriodPolicy
  cutoffCategory
  geographicScope
  requiredFields[]
  validationMethod
  licensingChecks[]
  usageClassPolicy
  privacyClass
  ownerRole
  expectedArtifacts[]
  dependencies[]
  stoppingCondition
  blockers[]
  priority: P0 | P1 | P2 | P3 | P4
  state
}
```

Los estados iniciales fueron `PLANNED`; el overlay actual se registra en §12.

## 3. P0 — bloquea todo downstream

| ID | Pregunta / datasets | Tier / source types | Campos y validación | Fallback / blockers |
|---|---|---|---|---|
| `RS-P0-BASELINE` | cutoff y ediciones completas; todos los catalogs | A; official definitions | start/close, season convention, format validity; triangulación con memberships | ninguna publicación sin Product/Data approval |
| `RS-P0-COMP-FORMAT` | formatos liga/copa/continentales; `DS-COMPETITION-CATALOG` | A; official competition | stages, participants, progression, match equivalents, ties, qualification, mobility | edition anterior solo con cambio documentado |
| `RS-P0-CALENDAR` | stage→Q, ventanas y presión; `DS-CALENDAR-SLICE` | A; official calendars/regulations | stage ranges, guaranteed/conditional exposure, market/international/award windows | no uniform allocation |
| `RS-P0-CLUB-IDENTITY` | elegir 8 clubes por liga; `DS-CLUB-VERTICAL-SLICE` | A identity + B/C coverage | memberships, aliases, region, portfolio coverage, rights constraints | cambiar identity set antes de congelar, no inventar |
| `RS-P0-EXTERNAL-POOL` | real identity pool/mobility; competition/club datasets | A | clubId, tier, memberships, candidate roles, provenance | fields no identificables solo para background |
| `RS-P0-NATIONAL-CATALOG` | Argentina team/competition definitions; `DS-NATIONAL-COMPETITION-CATALOG` | A | association/category, windows, format, reach, eligibility refs | regular-window-only profile si major tournament no aplica |
| `RS-P0-AWARD-CATALOG` | cinco AwardDefinitions; `DS-AWARD-DEFINITION-CATALOG` | A | identity, eligibility, window, field size, signals, tie, ordinal states | usar slot sin publicar identity hasta verificar |
| `RS-P0-MONEY-POLICY-DATA` | ARS/EUR/date/series; `DS-CURRENCY-INFLATION` | A | codes, minor units, FX/inflation series, revisions, base date | no conversion / candidate remains blocked |
| `RS-P0-SCORING-NORMATIVE` | valores/catálogos ya normativos; `DS-SCORING-CATALOG` | A/normative | gameplay refs, IJL edition, points, equivalence, caps, provenance | solo valores existentes; missing = DATA_REQUIRED |

Las nueve rows anteriores están congeladas por contrato. Su pregunta exacta,
fields, reference window, geography, source hierarchy, license route, artifact,
validation, dependencies y stopping condition se definen individualmente en
[G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md) §§5–13. La tabla breve es
un índice; no puede interpretarse como permiso para omitir esos campos.

## 4. P1 — bloquea Initial ParameterSet

| ID | Pregunta / datasets | Tier / source types | Campos y validación | Fallback / blockers |
|---|---|---|---|---|
| `RS-P1-PLAYER-EXPOSURE` | roles/minutos/starts; `DS-ROLE-MINUTES-REFERENCE` | A/B | position, minutes, starts, appearances, opportunity, age, club | proxy role documentado |
| `RS-P1-PERFORMANCE` | GK/CM/ST production; performance datasets | A/B stats | position-specific outputs, minutes, team/opponent context, longitudinal keys | fewer dimensions + uncertainty, never invented stat |
| `RS-P1-DEVELOPMENT` | age trajectories; creation/development datasets | B | cohort/longitudinal age, exposure, position, context, censoring | synthetic prior with explicit Tier D |
| `RS-P1-INJURY-EXPOSURE` | incidence denominator; `DS-INJURY-EXPOSURE` | A/B | hours/match equivalents, origin, label, position, age, congestion | no count-only calibration |
| `RS-P1-INJURY-RECOVERY` | recovery/relapse; `DS-INJURY-RECOVERY` | A/B | episode, duration/burden proxy, recurrence, censoring, return | synthetic profile only with product gate |
| `RS-P1-CLUB-SPORTING` | club baselines/history | B | attack/defense/control evidence, opponents, period, uncertainty | documented transform from coarser outcomes |
| `RS-P1-CLUB-INSTITUTIONAL` | finance/development/medical/stability/reach | B/C | proxy definitions, dates, currency, source agreement | synthetic calibration per dimension |
| `RS-P1-MANAGER-SQUAD` | turnover/tactics/competition; manager/squad datasets | A/B/C | spells, interim flags, position depth/usage, tactical proxy | product-calibrated profiles |
| `RS-P1-TRANSFER-CONTRACT` | movement, terms, fees, salaries | A/B/C | operation, dates, currencies, disclosed status, term units | missing salary can use provisional product target, not fake observation |
| `RS-P1-NATIONAL-HISTORY` | callups/minutes/outcomes | A/B | window, squad, minutes, position, age, edition/outcome | no eligibility inference |
| `RS-P1-AWARD-HISTORY` | placements/stat leaders | A | edition, eligibility, position, placement, ties, stat | definition excluded if history unverifiable |
| `RS-P1-RETIREMENT` | active/retirement/comeback histories | A/B | activity, announcements, lower tier, unattached, comeback, censoring | survival dataset with explicit right censoring |

## 5. P2 — bloquea ScoringConfiguration

| ID | Pregunta / datasets | Tier | Campos/validación | Fallback |
|---|---|---|---|---|
| `RS-P2-PRI` | PRI cohorts GK/CM/ST | A/B | cohort keys, exposure/evidence, task metrics, samples/CDF | broader fallback cohort published |
| `RS-P2-CC` | contribution cohorts | A/B + product | participation, contribution, competition/outcome relation | synthetic monotone transform reviewed |
| `RS-P2-SOCIAL-SCORING` | social/historic cohorts | B/C + product | platform era, authorized metric, sample/CDF | design target; never raw followers→points |
| `RS-P2-RECORDS` | record/milestone/historic definitions | A/normative + product | facts, scope, upgrade, stacking, sensitivity | omit definition until approved |

## 6. P3 — mejora calidad

| ID | Pregunta | Datasets | Validación/fallback |
|---|---|---|---|
| `RS-P3-PRESSURE` | pressure performance contexts | `DS-PRESSURE-PERFORMANCE-REFERENCE` | phase/stakes samples; provisional product profile |
| `RS-P3-MARKET-VALUATION` | dispersion de valuations | `DS-MARKET-VALUATION-PROXY` | methodology/version audit; diagnostic only |
| `RS-P3-REPUTATION` | sporting/public proxy | reputation/social datasets | construct validity y regional/platform bias |
| `RS-P3-ATTENTION` | impulse/decay around events | `DS-PUBLIC-ATTENTION-REFERENCE` | event windows/control baselines; product fallback |
| `RS-P3-POSITION-HISTORY` | multiposition/retraining | `DS-POSITION-USAGE-HISTORY` | minute conservation y mapping review |

## 7. P4 — post-slice

- más ligas, países, monedas y posiciones;
- catálogos exhaustivos de injuries, awards, records y milestones;
- salarios/finanzas granulares donde licencias lo permitan;
- eligibility internacional multi-asociación;
- mercado mid-season y reglas completas de registration;
- lower tiers detallados y full squads.

## 8. Licensing acceptance

Antes de `SOURCE_IDENTIFIED` cada research item responde:

- ¿puede accederse legalmente y reproducirse?
- ¿raw bytes pueden retenerse y redistribuirse?
- ¿la licencia permite derivados y uso comercial?
- ¿existen rate/scraping/API restrictions?
- ¿qué atribución y fecha son obligatorias?
- ¿el repository guardará raw, normalized o solo aggregate?
- ¿cómo se retiene la fuente para replay sin violar licencia?

Una respuesta negativa puede cambiar artifact storage, no autoriza copiar
datos manualmente.

Aplican las usage classes `REDISTRIBUTABLE_RAW`, `REDISTRIBUTABLE_DERIVED`,
`REFERENCE_ONLY`, `LOCAL_PRIVATE_SOURCE`, `MANUAL_PUBLIC_FACT`, `SYNTHETIC` y
`PRODUCT_DEFINED`. `LICENSE_REVIEW_REQUIRED` impide `FROZEN`; la política
completa y privacy classes están en
[G3D Data Governance](G3D_DATA_GOVERNANCE.md).

## 9. Gate hacia adquisición P0

G3D-3A aprueba:

1. `referenceCutoffDate` policy y regla de ediciones;
2. roles/reviewers, solo-project mode y storage/licensing policy;
3. 16 club-selection slots y candidate method;
4. `EvidenceRecord`, source-identification template y hash retention;
5. scopes ARS/EUR y monetary dates;
6. mappings Position/Competition/Injury;
7. raw-data privacy/anonymization policy para player observations.

Al abrir G3D-3B todavía deben registrarse `approverRef`, congelarse el valor
concreto de `referenceCutoffDate` y revisarse cada source antes de captura. Se
declara `GO_CONDITIONAL`: esos controles son first steps de la campaña, no
blockers matemáticos. No se requiere elegir parámetros de gameplay.

## 10. Artifacts y stopping

P0 produce, como mínimo:

- `REFERENCE_EDITION_MANIFEST`;
- `COMPETITION_FORMAT_EVIDENCE`;
- `CALENDAR_EVIDENCE`;
- `DETAILED_CLUB_SELECTION_REPORT`;
- `EXTERNAL_CLUB_SCOPE_MANIFEST`;
- `NATIONAL_TEAM_REFERENCE_EVIDENCE`;
- `AWARD_CATALOG_EVIDENCE`;
- `MONETARY_REFERENCE_EVIDENCE`;
- `SCORING_CATALOG_EVIDENCE`;
- `SOURCE_LICENSE_MANIFEST`.

Un task termina cuando sus required fields tienen evidence suficiente o
missing explícito, la ruta de licencia está identificada, los conflictos
materiales están resueltos/aislados y el artifact cumple acceptance. No se busca
indefinidamente una fuente perfecta.

## 11. Referencias

- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)
- [Calibration Dataset Registry](CALIBRATION_DATASET_REGISTRY.md)

## 12. Resultado de la campaña G3D-3B

La campaña `RSNAP-G3D3B-2026-08-07-C1` congeló
`referenceCutoffDate=2026-08-07` antes del primer `EvidenceRecord`. La evidencia
atómica está en [P0 Evidence Index](P0_EVIDENCE_INDEX.md) y la clasificación de
uso/licencia en [Source License Manifest](SOURCE_LICENSE_MANIFEST.md). No se
retuvieron raw externos, no se normalizó ningún dataset y no se asignaron
parámetros.

### 12.1 P0 completeness matrix

| Research task | Required-field coverage | Strongest tier | License route | Material conflicts | Artifact | State |
|---|---|---|---|---|---|---|
| `RS-P0-BASELINE` | cutoff y ediciones baseline identificados; la fase anual argentina permanece parcial al cutoff | A | manual public facts/reference-only | none | `REFERENCE_EDITION_MANIFEST` | `COMPLETE_WITH_LIMITATIONS` |
| `RS-P0-COMP-FORMAT` | formatos, participantes, progresión y outputs principales cubiertos; algunos bindings de qualification quedan para data publication | A | manual public facts/reference-only | none | `COMPETITION_FORMAT_EVIDENCE` | `COMPLETE_WITH_LIMITATIONS` |
| `RS-P0-CALENDAR` | periods, exposure y solapamientos cubiertos; mapping Q, ventanas internacionales ordinarias y cierre anual ARG aún no publicados | A | manual public facts/reference-only | none | `CALENDAR_EVIDENCE` | `COMPLETE_WITH_LIMITATIONS` |
| `RS-P0-CLUB-IDENTITY` | 8 ARG + 8 ESP, membresía, alias y rationale de cobertura | A + D product selection | manual public facts/product-defined | none | `DETAILED_CLUB_SELECTION_REPORT` | `COMPLETE` |
| `RS-P0-EXTERNAL-POOL` | universo mínimo y límites nominales por clase | A + D policy | manual public facts/product-defined | none | `EXTERNAL_CLUB_SCOPE_MANIFEST` | `COMPLETE` |
| `RS-P0-NATIONAL-CATALOG` | Argentina senior, FIFA eligibility y World Cup baseline; regular-window calendar/reach remain acquisition gaps | A + D policy | manual public facts/product-defined | none | `NATIONAL_TEAM_REFERENCE_EVIDENCE` | `COMPLETE_WITH_LIMITATIONS` |
| `RS-P0-AWARD-CATALOG` | cinco candidates concretos; LaLiga POTY field/ballot/tie y scorer tie/official alias no verificables en las fuentes primarias adquiridas; continuidad 2025 de reglas UEFA requiere validación | A/B | manual public facts/reference-only | none; fields missing, not contradicted | `AWARD_CATALOG_EVIDENCE` | `RESEARCH_INCOMPLETE` |
| `RS-P0-MONEY-POLICY-DATA` | minor units y rutas oficiales CPI/HICP/FX/PPP identificadas; values/series no adquiridos | A | reference-only; terms review before derived publication | none | `MONETARY_REFERENCE_EVIDENCE` | `COMPLETE_WITH_LIMITATIONS` |
| `RS-P0-SCORING-NORMATIVE` | normativa existente inventariada y gaps separados sin inferir puntos | A normative | product-defined/internal normative | none | `SCORING_CATALOG_EVIDENCE` | `COMPLETE_WITH_GAPS` |

### 12.2 Artifact status

| Contractual artifact | State | Blocks |
|---|---|---|
| `REFERENCE_EDITION_MANIFEST` | `EVIDENCE_COMPLETE_WITH_LIMITATIONS` | annual Argentina snapshot remains partial by policy |
| `COMPETITION_FORMAT_EVIDENCE` | `EVIDENCE_COMPLETE_WITH_LIMITATIONS` | final data bindings/normalization |
| `CALENDAR_EVIDENCE` | `EVIDENCE_COMPLETE_WITH_LIMITATIONS` | canonical Q mapping and ordinary international windows |
| `DETAILED_CLUB_SELECTION_REPORT` | `EVIDENCE_COMPLETE` | no P0 identity blocker |
| `EXTERNAL_CLUB_SCOPE_MANIFEST` | `EVIDENCE_COMPLETE` | per-identity materialization occurs in G3D-3C/P1 |
| `NATIONAL_TEAM_REFERENCE_EVIDENCE` | `EVIDENCE_COMPLETE_WITH_LIMITATIONS` | ordinary senior windows/reach source |
| `AWARD_CATALOG_EVIDENCE` | `EVIDENCE_COMPLETE_WITH_LIMITATIONS` + `RESEARCH_INCOMPLETE` fields | two LaLiga definitions and UEFA rule-edition continuity cannot freeze |
| `MONETARY_REFERENCE_EVIDENCE` | `SOURCE_ROUTES_IDENTIFIED` | series acquisition/normalization and terms review |
| `SCORING_CATALOG_EVIDENCE` | `EVIDENCE_COMPLETE_WITH_GAPS` | IJL/catalog/product data listed in artifact |
| `SOURCE_LICENSE_MANIFEST` | `EVIDENCE_COMPLETE_WITH_LIMITATIONS` | substantial derived redistribution remains review-required |

### 12.3 Material gaps by priority

| Priority | Gap | Effect |
|---|---|---|
| `BLOCKS_G3D_3C` | primary rules or approved product/data policy for `LALIGA_POTY-2025-26` field/ballot/tie | cannot publish that `AwardDefinition` |
| `BLOCKS_G3D_3C` | official tie/alias semantics for `LALIGA_TOP_SCORER-2025-26` | cannot publish its final tie policy/identity |
| `BLOCKS_G3D_3C` | verify that acquired Ballon/Kopa/Yashin mechanics apply to the 2025 edition | comparative award definitions remain candidate-only |
| `BLOCKS_G3D_3C` | ordinary Argentina senior windows if the V1 `CalendarDefinition` publishes them beyond World Cup context | national calendar can only publish the closed major-tournament subset |
| `BLOCKS_PARAMETER_CALIBRATION` | P1 player, exposure, performance, injury, club and market observations | no EngineParameterSet tuning |
| `BLOCKS_SCORING` | IJL binding, complete definition catalogs, records/milestones/historic definitions and cohort transforms | no ScoringConfiguration/Data publication |
| `NON_BLOCKING` | raw redistribution permission for official pages | atomic citations remain usable; raw was not stored |

### 12.4 Readiness decision

Resultado: **`CONDITIONAL_GO` para G3D-3C**.

G3D-3C puede normalizar y validar el cutoff, competitions, closed-stage calendar,
16 club identities, external-club scope, national major-tournament subset,
monetary source routes y scoring gap catalog. No puede marcar como `FROZEN` ni
publicar como Data V1 las AwardDefinitions incompletas, el calendario nacional
ordinario no adquirido ni los monetary series todavía no normalizados. Si la
fase siguiente exige publicar el bundle V1 completo de forma atómica, este
resultado se interpreta como `NO_GO` hasta cerrar esos gaps; no se reduce ningún
acceptance standard.

## 13. Focused P0 gap closure after normalization

G3D-3C replaces a general P0 repeat with an optional, bounded
`G3D-3B2 — Focused P0 Gap Closure`:

| Gap IDs | Exact scope | Stopping condition |
|---|---|---|
| `GAP-P0-AWD-001` | verify Ballon/Kopa/Yashin 2025 rule continuity | edition-applicable primary rule or explicit unresolved result |
| `GAP-P0-AWD-002` | LaLiga POTY field/ballot/tie | primary rules or documented policy route for every field |
| `GAP-P0-AWD-003` | official scorer/Pichichi alias and tie | organizer-level binding/tie or explicit unresolved state |
| `GAP-P0-CAL-001` | ordinary Argentina senior windows | stage/Q-ready primary calendar facts |
| `GAP-P0-MON-001` | acquire versioned INDEC/Eurostat/BCRA/ECB series | hashes, vintages, terms and units captured |
| `GAP-P0-MON-002` | base date, missing-day/revision transform | reviewed deterministic transform specification |

Scoring gaps `GAP-P0-SCR-001..003` belong to product/P2 calibration, not web
P0 repetition. G3D-3B2 may run in parallel with G3D-3D; it does not calibrate,
normalize a full Data V1 or broaden P1 research.

## 14. G3D-3B2 focused closure result

Campaign lineage remains `RSNAP-G3D3B-2026-08-07-C1` with immutable
`EV-P0-001..081`. G3D-3B2 adds `EV-P0-082..101` and no P1 scope.

| Gap IDs | Result | Residual limitation | State |
|---|---|---|---|
| `GAP-P0-AWD-001` | 2025 fields/electorates/results acquired; detailed prior procedure explicitly `VERIFIED_BY_CONTINUITY` | no independently published complete 2025 rules document | `CLOSED_WITH_NONBLOCKING_LIMITATION` |
| `GAP-P0-AWD-002` | LALIGA POTY identity/window/winner verified; unpublished human mechanics classified; abstract model consumer complete | real electorate/ballot/tie remain `NOT_PUBLICLY_DOCUMENTED` | `CLOSED_WITH_NONBLOCKING_LIMITATION` |
| `GAP-P0-AWD-003` | neutral top-scorer canonical identity and MARCA/Pichichi alias bound; real tie procedure classified non-public; simulation `SHARED` explicit | live 2025/26 stat archive remains a later freeze-quality concern | `CLOSED_WITH_NONBLOCKING_LIMITATION` |
| `GAP-P0-CAL-001` | FIFA ordinary 2026 windows, Q/checkpoints and maximum opportunities acquired | no Argentina fixture inferred; Sep-Oct realized allocation awaits schedule fact | `CLOSED` |
| `GAP-P0-MON-001` | four official source extracts/routes, units, periods, SHA-256 and reuse terms acquired | normalized retained series artifact not yet published | `CLOSED_FOR_SOURCE_BINDING` |
| `GAP-P0-MON-002` | base price period, common FX date, missing-date, exact rational and rounding contract fixed | golden/example output not computed | `CLOSED` |

Result: **`P0_DATA_READY_WITH_NONBLOCKING_LIMITATIONS`**. Award, Calendar and
Money candidates can enter a future atomic freeze review; Data V1 remains
unpublished. P1 observational acquisition is ready but was not started.

## 15. G3D-4A P1 player-evidence result

Scope was limited to Creation, Development/Aging, Role/Minutes and
Performance/Form. It produced 30 atomic `EV-P1-*` records from ten sources,
without modifying the immutable P0 namespace.

| Research area | Evidence state | Coverage | Residual research gap |
|---|---|---|---|
| Creation | `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS` | strict GK/CM/ST emergence sensitivity; Spain/multileague; LPF debut aggregate | Argentina age/position panel; foot; no direct latent capabilities |
| Development | `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS` | peer-reviewed La Liga longitudinal findings and panel exposure changes | GK longitudinal performance; survivorship/censoring treatment |
| Role/Minutes | `CALIBRATION_READY_WITH_LIMITATIONS` | Spain/multileague share, zero mass and persistence | Argentina player-season panel; SportingRole remains latent |
| Performance/Form | `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS` | Spain counts/rates/task proxies and temporal diagnostics | Argentina distributions; event license/CM-GK sample; latent Form separation |

Source hierarchy prioritized official LPF facts, peer-reviewed research and
reproducible public datasets. Transfermarkt-derived aggregates require upstream
license review before freeze; StatsBomb/Dendir are reference-only/noncommercial.
No raw data or player identities entered the repository. Result:
`GO_FOR_G3D_4B_WITH_PLAYER_EVIDENCE_LIMITATIONS`; G3D-4B was not started.
