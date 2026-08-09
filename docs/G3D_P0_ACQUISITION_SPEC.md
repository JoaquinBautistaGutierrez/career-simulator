# G3D P0 Acquisition Spec

## 1. Propósito y estado

Este documento congela las preguntas, evidence contracts, outputs y stopping
criteria de las nueve investigaciones P0 que G3D-3B ejecutará. G3D-3A no busca
fuentes ni adquiere datos.

P0 identifica y valida el baseline/catálogos mínimos. No calibra
`EngineParameterSet`, no ajusta `ScoringConfiguration`, no publica Data V1 y no
implementa gameplay.

## 2. Research campaign identity

Cada campaña usa:

```text
P0ResearchSnapshot {
  researchSnapshotId
  state: OPEN | EVIDENCE_COMPLETE | REVIEWED | CLOSED | REJECTED
  referenceCutoffDate
  referenceSnapshotPolicyVersion
  researchPlanVersion
  governanceVersion
  ownerApprovalRefs[]
  evidenceManifestHash
  sourceLicenseManifestHash
  artifactManifestHash
  openedAt
  closedAt?
}
```

`researchSnapshotId` es provenance, no parte del `VersionSet` competitivo. Los
manifests son append-only durante research y reciben hash final al cerrar.

## 3. Evidence contract

Ningún fact material puede entrar a un artifact P0 sin:

```text
EvidenceRecord {
  evidenceId
  researchSnapshotId
  researchId
  claimId
  claim
  sourceId
  sourceTier: TIER_A | TIER_B | TIER_C | TIER_D
  observationOrReferencePeriod
  cutoffRelation
  retrievedAt
  publishedAt?
  licensingState
  usageClass
  extractedValueOrFact
  units?
  extractionMethod
  confidence
  validationChecks[]
  conflictState
  reviewerApprovalRefs[]
  downstreamConsumers[]
}
```

`extractedValueOrFact` conserva wording/source semantics y no traduce
automáticamente a un state interno. Facts discretos admiten transcripción manual
revisada; tablas o series requieren un artifact/transform permitido por licencia.

### 3.1 Fuente asociada

Cada `sourceId` resuelve al `SourceReference` de
[G3D Data Governance](G3D_DATA_GOVERNANCE.md), incluidos publisher, URL/ref,
period, license, usage/redistribution, retrieval y fingerprint.

### 3.2 Conflictos

| Estado | Regla |
|---|---|
| `CONSISTENT` | Sources compatibles en definición y período. |
| `RESOLVED_CONFLICT` | Se conserva el conflicto y se elige una interpretación con rationale. |
| `UNRESOLVED_CONFLICT` | Diferencia material abierta; bloquea el field/artifact afectado. |
| `SOURCE_REJECTED` | Source no apta por evidencia, definición, licencia, privacidad o reproducibilidad. |

La resolución prioriza evidence tier, autoridad, definición y período. Nunca se
promedian silenciosamente valores discordantes. Si sources de tier similar
continúan en desacuerdo, el artifact conserva ambas observaciones y escala a los
owners correspondientes.

## 4. Artifacts P0 obligatorios

| Artifact ID | Contenido mínimo | Research producers | Consumers/gate |
|---|---|---|---|
| `REFERENCE_EDITION_MANIFEST` | cutoff; season/edition bindings; closure evidence; exceptions/anomalies | `RS-P0-BASELINE` | todos los datasets/catalogs |
| `COMPETITION_FORMAT_EVIDENCE` | stages, participants policy, format, progression, exposure y mobility refs | `RS-P0-COMP-FORMAT`, baseline | CompetitionDefinitions |
| `CALENDAR_EVIDENCE` | timing real observado, season boundaries, phase→Q evidence, market/registration/international windows | `RS-P0-CALENDAR`, format | CalendarDefinitions; DR-021/066/067 |
| `DETAILED_CLUB_SELECTION_REPORT` | candidates, selection matrix y 8 IDs por ARG/ESP | `RS-P0-CLUB-IDENTITY` | `DS-CLUB-VERTICAL-SLICE` |
| `EXTERNAL_CLUB_SCOPE_MANIFEST` | real identity subset, roles, tier/region/membership y field requirements | `RS-P0-EXTERNAL-POOL` | ADR-081 / DR-065 |
| `NATIONAL_TEAM_REFERENCE_EVIDENCE` | Argentina senior definition, competition/calendar/eligibility/reach refs | `RS-P0-NATIONAL-CATALOG` | DR-068; National definitions |
| `AWARD_CATALOG_EVIDENCE` | candidates y verificación de los cinco slots | `RS-P0-AWARD-CATALOG` | DR-025; AwardDefinitions |
| `MONETARY_REFERENCE_EVIDENCE` | ARS/EUR units, reference dates, candidate series y terms | `RS-P0-MONEY-POLICY-DATA` | ADR-083; `DS-CURRENCY-INFLATION` |
| `SCORING_CATALOG_EVIDENCE` | valores normativos existentes, sources y missing definitions | `RS-P0-SCORING-NORMATIVE` | DR-010/025; Scoring bundle |
| `SOURCE_LICENSE_MANIFEST` | every source, class, license status, storage/redistribution route | las nueve P0 | freeze de todos los artifacts |

Un artifact puede referenciar otro; no duplica EvidenceRecords. Todos declaran
schema/version, producer research IDs, evidence IDs, owner approvals,
limitations, unresolved conflicts y hash.

## 5. P0-1 — Cutoff y ediciones de referencia

**Research ID:** `RS-P0-BASELINE`.

- **Pregunta exacta:** ¿qué fecha única de corte y qué última edición
  completamente cerrada compatible corresponde a cada slot del slice?
- **Fields:** `referenceCutoffDate`; ARG/ESP league/cup; Libertadores;
  Champions; national contexts; cinco award editions; source labels; start/end;
  closure date; cutoff relation; anomaly; exception.
- **Ventana:** `SINGLE_EDITION` por slot, última cerrada; source period
  verificable. El cutoff se congela antes de extraer facts.
- **Geografía:** Argentina, España, competiciones continentales asociadas y
  Argentina senior.
- **Tier aceptable:** A para cierre/formato; B solo como corroboración.
- **Jerarquía:** autoridad/organizador oficial → federación/competition official
  archive → source secundaria convergente.
- **Licencia:** `MANUAL_PUBLIC_FACT` o clase más permisiva aprobada; raw archive
  solo si redistribuible.
- **Artifact:** `REFERENCE_EDITION_MANIFEST` y entradas de
  `SOURCE_LICENSE_MANIFEST`.
- **Validación:** dos EvidenceRecords compatibles para todo cierre no inequívoco;
  no match/output pendiente; IDs y labels canónicos únicos.
- **Dependencias:** Reference Snapshot Policy y owners aprobados.
- **Stopping condition:** todos los slots tienen binding cerrado o bloqueo
  explícito con source viable; no queda `UNRESOLVED_CONFLICT` material.

**Acceptance:** manifest con cutoff único, los ocho grupos de bindings exigidos,
closure evidence y hashes/reviews. No exige elegir una edición durante G3D-3A.

## 6. P0-2 — Formatos de competiciones

**Research ID:** `RS-P0-COMP-FORMAT`.

- **Pregunta exacta:** ¿qué formato y progression reales usó cada edición
  seleccionada y qué facts mínimos permiten una `CompetitionDefinition` sin
  simular fixtures completos?
- **Fields:** stages, participant count/policy, guaranteed/conditional exposure,
  round/ranking rules, ties, advancement/elimination, qualification,
  promotion/relegation request boundary, champion semantics.
- **Ventana:** `SINGLE_EDITION` vinculada al baseline; historical source solo
  para aclarar cambios.
- **Geografía:** dos ligas, dos copas domésticas, Libertadores y Champions.
- **Tier:** A; B solo para control cruzado.
- **Jerarquía:** regulations/official competition definition → official results
  archive → trusted secondary explainer.
- **Licencia:** public facts/derived definition; reglamentos completos no se
  copian si no son redistribuibles.
- **Artifact:** `COMPETITION_FORMAT_EVIDENCE`.
- **Validación:** stage graph conectado; exactly-one champion cuando aplica;
  exposure garantizada/condicional conservada; formato coincide con edition.
- **Dependencias:** baseline binding.
- **Stopping condition:** cada slot permite completar todos los campos
  obligatorios de `CompetitionDefinition` o queda excluido/bloqueado con razón.

## 7. P0-3 — Calendar, windows y registration evidence

**Research ID:** `RS-P0-CALENDAR`.

- **Pregunta exacta:** ¿qué timing y boundaries observados permiten mapear stages
  a Q, oportunidad, congestion/pressure y la única ventana Market post-season?
- **Fields:** season boundaries; stage ranges; actual/guaranteed/conditional
  match equivalents; phase order; international windows; market opening/close;
  registration effective boundary; award evaluation/resolution timing.
- **Ventana:** `SINGLE_EDITION`; source dates se conservan aunque el engine use Q.
- **Geografía:** Argentina, España, continentales y Argentina senior.
- **Tier:** A.
- **Jerarquía:** official calendars/regulations/registration notices → official
  competition pages → corroboración secundaria.
- **Licencia:** public facts; raw calendar no se redistribuye sin permiso.
- **Artifacts:** `CALENDAR_EVIDENCE` y links a
  `COMPETITION_FORMAT_EVIDENCE`.
- **Validación:** no overlapping impossible phases; no future exposure de ronda
  no alcanzada; post-season Market está después de closed sporting scope y antes
  de next-season registration; no fechas falsas.
- **Dependencias:** P0-1 y P0-2.
- **Stopping condition:** evidencia suficiente para publicar candidates de
  Calendar/Registration/MarketWindow; cualquier granularidad real no modelada
  queda limitación, no regla inventada.

## 8. P0-4 — Clubes detallados

**Research ID:** `RS-P0-CLUB-IDENTITY`.

- **Pregunta exacta:** ¿qué ocho clubes reales por liga maximizan el portfolio
  aprobado de strength, finance, development, stability, reach, tactical
  diversity y evidence coverage?
- **Fields:** immutable identity, aliases, baseline membership, country/region,
  historical/current portfolio evidence, proxy coverage/confidence, rights/name
  constraints y source availability.
- **Ventana:** identity `TIMELESS_DEFINITION`; membership `SNAPSHOT` al cutoff;
  portfolio evidence puede ser `MULTI_SEASON` documentado.
- **Geografía:** exactamente Argentina y España.
- **Tier:** A para identity/membership; B/C triangulado para portfolio.
- **Jerarquía:** clubs/leagues/federations → official/public reports → reliable
  statistical/financial sources → convergent proxies.
- **Licencia:** IDs/facts manuales; raw metrics según source review.
- **Artifact:** `DETAILED_CLUB_SELECTION_REPORT`.
- **Validación:** scoring matrix predeclarada, ocho IDs únicos por liga, cobertura
  de dimensiones y sensitivity a candidatos alternativos. No se elige solo por
  tabla actual o popularidad.
- **Dependencias:** P0-1, selected memberships y G3D Product Decisions 001/002.
- **Stopping condition:** portfolio aprobado y todas las identities tienen ruta
  de evidencia/licencia viable; valores de estado continúan P1.

## 9. P0-5 — Universo externo híbrido

**Research ID:** `RS-P0-EXTERNAL-POOL`.

- **Pregunta exacta:** ¿qué identidades reales y contextos mínimos necesita el
  pool híbrido para transfers, continentales, mobility y comeback sin baseline
  mundial completo?
- **Fields:** `clubId`, aliases, region/country, tier/context, competition
  membership/role, candidate operation roles, materialization eligibility,
  minimum sporting/prestige/finance/need adapter fields y provenance.
- **Ventana:** identity + `SNAPSHOT` membership al cutoff; historical mobility
  solo si el consumer lo requiere.
- **Geografía:** slice y contraparte mínima real de sus continentales/mercado;
  no mundo exhaustivo.
- **Tier:** A para nominal identities/membership; B/C para context proxies.
- **Jerarquía:** competition participant lists/federations → club official →
  reliable reference sources.
- **Licencia:** manual public facts/derived aggregate; fields abstractos son
  `SYNTHETIC` y nunca identities.
- **Artifact:** `EXTERNAL_CLUB_SCOPE_MANIFEST`.
- **Validación:** cada nominal fact resuelve a real ID; abstract field no puede
  ser contractual counterparty/champion; stream/materialization keys posibles.
- **Dependencias:** P0-1/2/4, ADR-081, DR-065.
- **Stopping condition:** conjunto mínimo y expansion rule documentados para los
  cuatro consumers; no se exige baseline completo de cada club mundial.

## 10. P0-6 — Argentina senior y contexto internacional

**Research ID:** `RS-P0-NATIONAL-CATALOG`.

- **Pregunta exacta:** ¿qué definitions, calendar contexts y evidence refs
  mínimos necesita Argentina senior bajo la eligibility V1 aprobada?
- **Fields:** association/category, team identity, competition/window bindings,
  roster/selection-field evidence availability, match equivalents, pressure,
  reach/context y fuentes de eligibility definition.
- **Ventana:** baseline `SNAPSHOT` + `SINGLE_EDITION`/window compatible.
- **Geografía:** Argentina senior; opponents solo como field/context.
- **Tier:** A para definition/calendar/eligibility; B para field evidence.
- **Jerarquía:** association/competition official → official roster/results →
  trusted statistical source.
- **Licencia:** public facts/derived aggregates; no identity rows innecesarias en
  cohorts.
- **Artifact:** `NATIONAL_TEAM_REFERENCE_EVIDENCE`.
- **Validación:** Argentina-only policy vinculada sin inferir elegibilidad;
  call-up/squad/window semantics separadas; reach con source/period.
- **Dependencias:** P0-1/2/3 y ADR-082.
- **Stopping condition:** inputs mínimos de `NationalTeamDefinition`, calendar y
  eligibility tienen evidence viable; call-up coefficients no se calibran.

## 11. P0-7 — Catálogo de cinco awards

**Research ID:** `RS-P0-AWARD-CATALOG`.

- **Pregunta exacta:** ¿qué awards reales verificables llenan los cinco slots
  aprobados sin inventar field, timing o tie semantics?
- **Fields:** identity, edition, publisher, existence, eligibility, category,
  `COMPARATIVE_JUDGED|STATISTICAL`, evaluation window, field/nomination semantics,
  ordinal states, timing, tie policy y source/history availability.
- **Ventana:** `SINGLE_EDITION` cerrada + historical availability diagnostic.
- **Geografía:** global/juvenil y tres slots posicionales/de competición del
  slice, según policy ya aprobada.
- **Tier:** A.
- **Jerarquía:** award organizer/regulations/result archive → competition
  official → corroboración secundaria.
- **Licencia:** manual public facts; no copiar creative presentation/assets.
- **Artifact:** `AWARD_CATALOG_EVIDENCE`.
- **Validación:** exactamente cinco candidates publicables; family correcta;
  winner/shortlist/tie coherentes; scoring fields quedan fuera.
- **Dependencias:** P0-1 y G3D Product Decisions.
- **Stopping condition:** cada slot tiene una definición candidata con source
  viable o se marca `DATA_REQUIRED`; un slot no se rellena por semejanza.

## 12. P0-8 — Referencia monetaria

**Research ID:** `RS-P0-MONEY-POLICY-DATA`.

- **Pregunta exacta:** ¿qué semantics y series candidatas permiten conservar
  ARS/EUR nativos y construir contexto normalizado versionado?
- **Fields:** ISO currency code, minor-unit semantics/effective period, nominal
  date, inflation/index source, FX source/pair/direction, revisions, candidate
  purchasing-power convention, availability/licensing.
- **Ventana:** `MONETARY_SERIES`, con dates explícitas respecto del cutoff.
- **Geografía:** Argentina/ARS y España/EUR; base externa solo si el transform
  requiere una y se aprueba después.
- **Tier:** A.
- **Jerarquía:** monetary/statistical authority → central bank/official series →
  regulated/reproducible provider.
- **Licencia:** source-specific; raw series no se redistribuye por presunción.
- **Artifact:** `MONETARY_REFERENCE_EVIDENCE`.
- **Validación:** units/date/revision/currency complete; series coverage y gaps;
  no conversion aún; no float Money.
- **Dependencias:** cutoff, ADR-083, DR-027.
- **Stopping condition:** al menos una ruta viable por unit/inflation/FX purpose
  o bloqueo documentado; no se calcula normalization ni parameter values.

## 13. P0-9 — Catálogo normativo de scoring

**Research ID:** `RS-P0-SCORING-NORMATIVE`.

- **Pregunta exacta:** ¿qué scoring values/rules ya están establecidos por
  `MASTER_SPEC`, ADR y specs, y qué Competition/Award/record definitions siguen
  `DATA_REQUIRED`?
- **Fields:** normative source location, rule ID, category, exact value/formula,
  competition/award reference, equivalence, stacking/caps, version owner,
  unresolved status.
- **Ventana:** `HISTORICAL`/`TIMELESS_DEFINITION` para la regla; edition binding
  usa P0-1.
- **Geografía:** únicamente slice y definitions autorizadas.
- **Tier:** normativa interna primaria; external A solo para identificar entidad
  o contexto real, nunca para crear puntos.
- **Jerarquía:** `MASTER_SPEC` → approved ADR → current normative specs → external
  official identity evidence.
- **Licencia:** internal normative + manual public facts para identity refs.
- **Artifact:** `SCORING_CATALOG_EVIDENCE`.
- **Validación:** no contradicción, duplicate aliases reconciliados, gameplay y
  scoring ownership separados, missing remains `DATA_REQUIRED`.
- **Dependencias:** P0-1/2/7 y Scoring Math.
- **Stopping condition:** todo valor conocido tiene source exacta y todo valor no
  conocido está explícitamente ausente; cero puntos inventados.

## 14. Source/license review P0

`SOURCE_LICENSE_MANIFEST` cubre toda fuente candidata de los nueve tasks y debe
responder:

- si acceso y reproducción están permitidos;
- retention de raw bytes;
- redistribución raw/derived y uso comercial;
- attribution, rate/API/scraping restrictions;
- repository/local-private storage route;
- privacy class;
- reviewer y rationale.

No comienza P1 para una dependencia crítica hasta que P0 tenga al menos una
ruta `APPROVED` o `APPROVED_WITH_CONDITIONS`. `LICENSE_REVIEW_REQUIRED` puede
mantener research abierta, nunca congelar artifact.

## 15. Dataset candidate identity y estados

Una adquisición usa:

```text
datasetCandidateId = <datasetId>@candidate/<researchSnapshotId>/<ordinal>
```

El ordinal es estable dentro del snapshot. El manifest registra parent,
source/evidence hashes y state:

```text
PLANNED -> SOURCE_IDENTIFIED -> ACQUIRED -> NORMALIZED -> VALIDATED -> FROZEN
```

`ACQUIRED` significa que la evidencia permitida fue capturada y hasheada según
su usage class; no exige copiar raw bytes cuando la licencia lo prohíbe.
`FROZEN` no equivale aún a `dataVersion`: el publication manifest decide qué
candidates congelados integra.

## 16. Stopping rule general

Un research task termina cuando:

1. todos los required fields tienen evidencia suficiente o missing explícito;
2. existe una ruta de licensing/storage;
3. conflicts materiales están resueltos, aislados o bloquean de forma explícita;
4. validation y owner/reviewer approvals cumplen el artifact contract;
5. sus acceptance criteria se cumplen.

No se busca indefinidamente una fuente perfecta. Una ruta viable y bien limitada
es preferible a mezclar sources incompatibles; un blocker explícito es preferible
a inventar un valor.

## 17. Go/No-Go para G3D-3B

Checklist:

- [x] Reference Snapshot Policy aprobada.
- [x] Source/license/derived-data policy aprobada.
- [x] Privacy/anonymization policy aprobada.
- [x] Roles y solo-project mode definidos.
- [x] `EvidenceRecord` y conflict states definidos.
- [x] Nueve P0 con fields, tiers, artifacts y stopping conditions.
- [x] Product decisions no esenciales separadas de adquisición.
- [x] Solo-project mode V1 aceptado; cada artifact registrará su `approverRef` por rol.
- [ ] Al abrir G3D-3B: congelar `referenceCutoffDate` en el snapshot header.
- [ ] Antes de cada descarga/extracción: completar source license route.

**Decisión:** `GO` para iniciar G3D-3B. Las dos casillas abiertas son controles
obligatorios dentro de la campaña, no blockers para abrirla. Sin la primera no
se capturan facts; sin la segunda no se descarga ni extrae la source afectada.

## 18. Boundary de ejecución

G3D-3B sí puede investigar web, identificar sources, extraer facts con
EvidenceRecords, descargar cuando la licencia lo permita y producir manifests.

G3D-3B no puede calibrar parámetros, ajustar fórmulas, implementar gameplay,
publicar Data V1, `EngineParameterSet` o `ScoringConfiguration`. Los product
numeric targets permanecen en su track propio.

## 19. Referencias

- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D External Research Plan](G3D_EXTERNAL_RESEARCH_PLAN.md)
- [Vertical Slice Data Catalog](VERTICAL_SLICE_DATA_CATALOG_SPEC.md)
- [Calibration Dataset Registry](CALIBRATION_DATASET_REGISTRY.md)
- [G3D Product Decisions](G3D_PRODUCT_DECISIONS.md)
