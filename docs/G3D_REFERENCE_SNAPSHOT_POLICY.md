# G3D Reference Snapshot Policy

## 1. Propósito y autoridad

Este documento es la política normativa de G3D para seleccionar el corte y las
ediciones de referencia de Data V1. Evita mezclar estados, temporadas, formatos,
monedas y métricas sociales observados en momentos incompatibles.

La política queda aprobada en G3D-3A. El valor calendario concreto se congela al
iniciar G3D-3B dentro de `REFERENCE_EDITION_MANIFEST`, antes de extraer el
primer hecho de una fuente. Elegir ese valor y las ediciones requiere aprobación
explícita con rol `DATA_OWNER` y `PRODUCT_OWNER`; no se deducen por conocimiento
informal.

Esta policy no publica `dataVersion`, no adquiere datos y no calibra parámetros.

## 2. Corte común

`referenceCutoffDate` es una única fecha ISO 8601 `YYYY-MM-DD` compartida por
todos los artifacts observados V1. Se interpreta como límite inclusivo del día
calendario en UTC. Cuando una fuente solo publica fecha local, el
`EvidenceRecord` conserva zona/jurisdicción y la normalización utilizada; una
ambigüedad material queda `REVIEW_REQUIRED`.

Reglas:

1. el valor se escribe una sola vez en el header del `researchSnapshotId`;
2. `retrievedAt` puede ser posterior, pero el hecho extraído debe describir un
   estado, período o definición compatible con el cutoff;
3. ninguna fecha de publicación posterior convierte por sí sola un hecho
   post-cutoff en pre-cutoff: deben verificarse `validPeriod` y contenido;
4. el mismo cutoff gobierna Argentina, España, continentales, selección,
   awards, dinero y social;
5. común significa mismo límite temporal, no mismo label de temporada.

### 2.1 Relación obligatoria con el cutoff

| Clase | Semántica | Uso V1 |
|---|---|---|
| `PRE_CUTOFF_CLOSED` | El período/edición terminó íntegramente en o antes del cutoff y no tiene outputs pendientes. | Permitido para baselines, resultados, cohorts y catálogos de edición. |
| `PRE_CUTOFF_PARTIAL` | Observación válida en o antes del cutoff, pero su período contenedor no estaba cerrado. | Solo snapshots/contexto expresamente declarados; no puede aportar champion, tabla final, award final ni total de edición. |
| `POST_CUTOFF` | El hecho ocurrió, cambió o se volvió efectivo después del cutoff. | Excluido de Data V1; puede conservarse como evidencia rechazada/para un candidate posterior. |
| `TIMELESS_DEFINITION` | Identidad o regla estable no dependiente de una edición concreta. | Permitido si se versiona la fuente y se separa de todo binding de edición mutable. |

Un mismo source puede producir records de clases distintas. La clasificación se
aplica al record/claim, no a la URL completa. Ante duda entre `PRE_CUTOFF_PARTIAL`
y `POST_CUTOFF`, se usa la clase más restrictiva hasta resolver el conflicto.

## 3. Regla de edición completamente cerrada

Salvo contrato explícito distinto, cada slot de competición, selección o award
usa la **última edición completamente cerrada antes del cutoff común**.

Una edición es `completely closed` solo si existe evidencia suficiente de que:

- la autoridad correspondiente la declaró terminada;
- tabla, resultados o placement finales están disponibles;
- no quedan partidos, rondas, apelaciones ordinarias o fixtures pendientes que
  puedan alterar los outputs requeridos por el artifact;
- los awards vinculados ya están resueltos cuando el dataset los necesita;
- formato, stages, participants policy y reglas efectivamente aplicadas son
  identificables;
- start, end/closure y source period son verificables;
- cualquier corrección posterior conocida está incorporada o documentada.

Una edición suspendida, anulada o aún litigada no es cerrada por el mero paso del
tiempo. Si una edición no satisface todos los puntos se considera partial y se
retrocede a la edición cerrada inmediatamente anterior o se bloquea el slot; la
elección queda en el manifest, nunca silenciosa.

## 4. Identidad de temporada y edición

`seasonId` es un identificador canónico de data, no un número universal:

```text
<CONTEXT>-<START_YEAR>[-<END_YEAR_TWO_OR_FOUR_DIGITS>]
```

Ejemplos de forma, no bindings reales: `ARG-2025`, `ESP-2025-26`. Un calendario
de año civil usa un año; una temporada cross-year conserva ambos. El
`CompetitionEditionId` añade el `competitionDefinitionId` y no se infiere solo
del `seasonId`.

Todo binding declara:

```text
SeasonEditionBinding {
  seasonId
  competitionDefinitionId
  observedEditionId
  sourceSeasonLabel
  startDateOrPeriod
  closedDate
  cutoffRelation
  closureEvidenceIds[]
}
```

Argentina y España pueden tener labels distintos. No se fuerza que una copa,
liga o continental use el mismo string si sus convenciones difieren.

## 5. Alineación de competiciones, selección y awards

`REFERENCE_EDITION_MANIFEST` debe resolver separadamente:

- liga argentina;
- copa doméstica argentina;
- liga española;
- copa doméstica española;
- Libertadores;
- Champions;
- cada contexto internacional necesario para Argentina senior;
- cada uno de los cinco slots de `AwardDefinition`.

Para cada slot se aplica la regla de última edición cerrada. Una excepción solo
es válida si el `DatasetDefinition` exige expresamente otro período, por ejemplo
una serie longitudinal o un catálogo histórico. La excepción declara:

```text
ReferenceEditionException {
  slotId
  requiredObservationCategory
  selectedPeriod
  reason
  evidenceIds[]
  dataOwnerApproval
  productOwnerApproval?
}
```

No se alinea una edición por similitud de nombre. Awards con ventana de
evaluación propia se vinculan a esa ventana y a los facts cerrados que realmente
consumen.

## 6. Categorías de ventana de observación

Cada `DatasetDefinition` declara exactamente una categoría primaria:

| Categoría | Uso |
|---|---|
| `SNAPSHOT` | Estado observado cerca del cutoff, con `observedAt`. |
| `SINGLE_EDITION` | Una edición completamente cerrada. |
| `MULTI_SEASON` | Varias temporadas/ediciones comparables para estimar una distribución. |
| `LONGITUDINAL` | Trayectorias ordenadas de jugador, club o Career con censoring explícito. |
| `HISTORICAL` | Historia de logros, records, fuerza, prestige u outcomes con horizonte largo. |
| `SOCIAL_SNAPSHOT` | Métrica de plataforma en fecha y semántica determinadas. |
| `MONETARY_SERIES` | Amounts/índices/rates con moneda y fechas explícitas. |

La categoría no elimina la obligación de clasificar cada record respecto del
cutoff. Un `SNAPSHOT` puede ser `PRE_CUTOFF_PARTIAL`; un `MULTI_SEASON` debe
estar formado por períodos `PRE_CUTOFF_CLOSED` salvo excepción revisada.

## 7. Ventanas multi-season y longitudinales

G3D-3A no fija un número universal de temporadas. Cada dataset declara
`windowDecisionStatus`:

| Estado | Significado |
|---|---|
| `EXTERNAL_RESEARCH` | La cobertura y comparabilidad disponibles determinan candidatos de ventana. |
| `PRODUCT_DECISION` | La ventana expresa una intención de producto no deducible de datos. |
| `STATISTICAL_VALIDATION` | La longitud se elige mediante estabilidad, potencia, sesgo y sensitivity. |
| `EXTERNAL_RESEARCH_AND_STATISTICAL_VALIDATION` | Primero se identifica cobertura; luego se valida la ventana. |
| `NOT_APPLICABLE` | La categoría no requiere longitud multi-period. |

Development, injuries, retirement, managerial turnover, awards, market y
production requieren como mínimo revisión estadística; no se fija `N` para
completar una tabla. El candidate debe comparar ventanas alternativas sobre las
mismas definiciones y documentar drift, missingness y censoring.

## 8. Ediciones anómalas

Toda anomalía estructural se conserva y recibe uno de estos estados:

| Estado | Regla |
|---|---|
| `INCLUDED` | Se usa en el mismo contexto porque la definición sigue siendo comparable. |
| `EXCLUDED` | Se omite con rationale, evidence y análisis del sesgo introducido. |
| `SEPARATE_CONTEXT` | Se conserva, pero no se mezcla; produce segmento/diagnostic propio. |
| `REVIEW_REQUIRED` | La materialidad o comparabilidad aún no está resuelta. |

Formato extraordinario, pandemia, suspensión, cambio extremo de calendario o
reglamento transitorio nunca se elimina silenciosamente. `REVIEW_REQUIRED`
bloquea `VALIDATED` para todo target material afectado.

## 9. Snapshot social y monetario

- Social exige `platform`, `metricDefinition`, `observedAt`, account age cuando
  exista y cutoff relation. Followers medidos después no reconstruyen el valor
  del cutoff.
- Dinero exige `currencyCode`, unidad, nominal/effective date, source series y
  revisión de revisiones. Un rate posterior no se aplica retrospectivamente sin
  un artifact de serie temporal aprobado.
- Prestige o reach históricos no se actualizan con hechos post-cutoff para
  mejorar artificialmente el baseline.

## 10. Inmutabilidad y lineage

Antes de adquisición, G3D-3B crea un `researchSnapshotId` con:

```text
researchSnapshotId
referenceCutoffDate
referencePolicyVersion
researchPlanVersion
evidenceManifestHash
sourceManifestHash
```

Los dos hashes pueden iniciar como hashes de manifests vacíos y cambian mediante
candidate lineage append-only; el snapshot final conserva sus hashes cerrados.
Este ID es provenance de construcción, no una sexta versión competitiva.

Una adquisición se identifica como `datasetCandidateId`; no es `dataVersion`.
Debe atravesar `ACQUIRED -> NORMALIZED -> VALIDATED -> FROZEN`. Solo un artifact
`FROZEN`, revisado y hasheado puede incorporarse a un `dataVersion`.

Después de usar el cutoff para Data V1 no puede modificarse. Un cutoff posterior
crea nuevos candidates, lineage y `dataVersion`; las Careers anteriores retienen
sus referencias.

## 11. Gate de aceptación

La policy está aprobada cuando:

- existe un único campo/date y comparación inequívoca;
- `completely closed` se puede probar con EvidenceRecords;
- cross-year seasons no se fuerzan a un label común;
- cada slot tiene regla y exception contract;
- las 40 DatasetDefinitions tienen categoría primaria;
- anomaly y multi-season policies están declaradas;
- la fecha concreta se congela antes de cualquier extracción G3D-3B.

La fecha y ediciones concretas siguen siendo outputs de G3D-3B. Esa dependencia
es `DATA_REQUIRED`, no matemática abierta.

## 12. Referencias

- [Vertical Slice Data Catalog](VERTICAL_SLICE_DATA_CATALOG_SPEC.md)
- [Calibration Dataset Registry](CALIBRATION_DATASET_REGISTRY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)
- [ADR-015](adr/015-version-taxonomy.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-080](adr/080-exact-scoring-mathematics.md)
