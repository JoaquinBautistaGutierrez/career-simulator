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

