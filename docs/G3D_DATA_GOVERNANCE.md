# G3D Data Governance

## 1. Propósito y alcance

Este documento define ownership, evidencia, licencias, redistribución,
privacidad y aprobación para investigación y datasets de G3D. Se aplica a raw
sources, extracciones manuales, artifacts normalizados, transforms, catálogos,
cohortes y reportes de aceptación.

No concede derecho de uso sobre ninguna fuente. Una fuente pública no se
presume abierta, redistribuible ni apta para uso comercial.

## 2. Roles

Los roles son responsabilidades, no puestos ni personas obligatoriamente
distintas.

| Rol | Responsabilidad exclusiva o principal | No autoriza por sí solo |
|---|---|---|
| `DATA_OWNER` | Selección y adquisición de sources; provenance; license/use review; schema de observación; normalization approval; dataset manifest; quality issues. | Targets de producto, tuning o puntos de scoring. |
| `PRODUCT_OWNER` | Scope, targets sintéticos, tail preference, tier rarity, Quick/Custom, comeback/finalization y tradeoffs de experiencia. | Presentar una preferencia como observación ni aprobar técnicamente un dataset. |
| `CALIBRATION_OWNER` | ParameterSet candidates, tuning history, sensitivity, Monte Carlo campaigns, orden causal y gates 1–5. | Alterar raw data, relabeling silencioso o publicar scoring. |
| `SCORING_OWNER` | `ScoringConfiguration`, `ScoringCalibrationData`, catalogs de scoring, tier diagnostics y gates 6/compatibilidad. | Mezclar scoring params con `EngineParameterSet` ni inventar valores reales. |
| `TECHNICAL_VALIDATOR` | Schema, hash, units, mappings, IDs, referential integrity, representación numérica y transforms deterministas. | Declarar que la evidencia representa correctamente el fenómeno observado. |
| `PROVENANCE_REVIEWER` | Correspondencia claim→source, evidence tier, license state, period, transform lineage, conflicts y limitations. | Cambiar raw/normalized artifacts ni elegir targets de producto. |

### 2.1 Matriz de aprobación

| Artifact/gate | Prepara | Aprueba | Revisión adicional |
|---|---|---|---|
| Source candidate / license route | `DATA_OWNER` | `DATA_OWNER` | `PROVENANCE_REVIEWER` |
| `EvidenceRecord` material | researcher como `DATA_OWNER` | `DATA_OWNER` | `PROVENANCE_REVIEWER` |
| Dataset `NORMALIZED` | `DATA_OWNER` | `DATA_OWNER` | `TECHNICAL_VALIDATOR` |
| Dataset `VALIDATED` | `DATA_OWNER` | `DATA_OWNER` | ambos reviewers |
| Dataset/catalog `FROZEN` | `DATA_OWNER` | owner del artifact | `TECHNICAL_VALIDATOR` + `PROVENANCE_REVIEWER`; `PRODUCT_OWNER` si contiene policy |
| ParameterSet candidate | `CALIBRATION_OWNER` | `CALIBRATION_OWNER` | Data/Product según targets |
| Scoring bundle candidate | `SCORING_OWNER` | `SCORING_OWNER` | Data/Product + Technical |
| Product numeric tolerance | `PRODUCT_OWNER` | `PRODUCT_OWNER` | Calibration/Scoring informa sensitivity |
| V1 publication | owners aplicables | approvals explícitas por rol | todos los critical gates |

Technical validity y evidence validity son gates distintos. Un hash correcto no
convierte una fuente sesgada en evidencia adecuada; una fuente oficial no excusa
unidades o mappings inválidos.

## 3. Solo-project mode

Una misma persona puede desempeñar todos los roles. Cada aprobación debe indicar
el rol ejercido:

```text
ApprovalRecord {
  artifactId
  role
  decision: APPROVE | REJECT | REQUEST_CHANGES
  rationale
  reviewedHash
  logicalDate
  approverRef
}
```

No se exige firma organizacional ni una segunda persona artificial. Sí se exige
separar los passes: quien actúa como `DATA_OWNER` no reutiliza esa aprobación
como `TECHNICAL_VALIDATOR` o `PRODUCT_OWNER` sin otro `ApprovalRecord`. Para
critical goldens se mantiene además la independencia de método definida en
[Golden Vector Registry](GOLDEN_VECTOR_REGISTRY.md).

**Policy V1 aprobada:** P0 opera en `SOLO_PROJECT_MODE`. El logical role holder
inicial es `PROJECT_MAINTAINER`; no identifica públicamente a una persona y debe
resolverse a un `approverRef` local al firmar cada artifact. Los seis roles se
consideran asignados a ese modo, pero ninguna aprobación se fusiona.

## 4. Clases de uso de datos

Cada source/dataset version declara exactamente una clase primaria:

| Clase | Semántica y almacenamiento permitido |
|---|---|
| `REDISTRIBUTABLE_RAW` | La licencia revisada permite conservar y redistribuir raw bytes bajo las condiciones registradas. |
| `REDISTRIBUTABLE_DERIVED` | Raw no se redistribuye, pero el derivado definido sí puede conservarse/publicarse tras review. |
| `REFERENCE_ONLY` | Puede consultarse y citarse; no se almacena ni redistribuye el dataset completo. Solo EvidenceRecords/derivados permitidos. |
| `LOCAL_PRIVATE_SOURCE` | Raw o working copy permanece fuera del repo/publicación, con acceso y retención controlados. |
| `MANUAL_PUBLIC_FACT` | Hechos públicos discretos transcritos con source, período y revisión; no copia creativa/masiva. |
| `SYNTHETIC` | Artifact generado sin pretensión de observación externa. |
| `PRODUCT_DEFINED` | Valor, regla o catálogo decidido por producto; nunca se etiqueta observado. |

La clase de una `DatasetDefinition` planificada es una postura de adquisición.
Cada source concreta vuelve a declarar su clase; un source no hereda una licencia
favorable de otro source del mismo dataset.

### 4.1 Estados de licencia

```text
NOT_REVIEWED
LICENSE_REVIEW_REQUIRED
APPROVED_WITH_CONDITIONS
APPROVED
REJECTED
```

`NOT_REVIEWED` y `LICENSE_REVIEW_REQUIRED` impiden `FROZEN`. Pueden permitir
research exploratoria local si `DATA_OWNER` lo registra, pero nunca raw
redistribution ni publicación competitiva. `REJECTED` impide adquisición nueva
y obliga a retirar working copies conforme a la política aplicable.

## 5. Política de raw storage

Por defecto, raw external datasets no se incorporan al repositorio. Solo puede
hacerse si existe `APPROVED`/`APPROVED_WITH_CONDITIONS` que permita exactamente
esa retención y redistribución.

Cuando la fuente sea usable pero no redistribuible, el artifact del repo se
limita, si legalmente procede, a:

- source/provenance metadata;
- EvidenceRecords de claims permitidos;
- transformación reproducible sin credenciales;
- aggregate/derivado revisado;
- hashes/fingerprints y validation metadata que no reconstruyan raw;
- instrucciones para adquisición local autorizada.

No se agregan tokens, cookies, credenciales, dumps privados ni URLs firmadas.
Una URL pública tampoco sustituye el hash o la fecha de recuperación.

## 6. Source citation y provenance

Toda fuente registra:

```text
SourceReference {
  sourceId
  sourceName
  publisher
  sourceType
  canonicalReference
  retrievedAt
  publishedAt?
  validPeriod?
  observedAt?
  licenseStatus
  usageClass
  redistributionStatus
  attributionRequirements[]
  accessMethod
  contentFingerprint?
  notes[]
}
```

`canonicalReference` puede ser URL o referencia bibliográfica, pero nunca es el
único campo. Todo valor derivado conserva la cadena:

```text
SourceReference / source hash
  -> EvidenceRecord
  -> TransformationDefinition
  -> normalized artifact hash
  -> estimate/calibration report
  -> parameter/config candidate
  -> acceptance report
```

Copiar un valor manualmente sin `EvidenceRecord` y transform lineage está
prohibido.

## 7. Derived-data policy

Un derivado puede conservarse solo si el manifest declara:

- source y clase de uso;
- `transformId`, inputs y hashes/fingerprints;
- operación, parámetros y output schema;
- nivel de agregación y tamaño de celdas;
- evaluación de reconstrucción/reidentificación;
- license review específico del output;
- output hash y validation;
- limitaciones y consumidores.

Agregar, redondear o anonimizar no elimina automáticamente restricciones. Si la
reconstrucción plausible, los términos o la privacidad siguen siendo materiales,
el output conserva la clase más restrictiva.

## 8. Evidence tiers y requisitos mínimos

Se mantienen `TIER_A` a `TIER_D` del Dataset Registry:

- `TIER_A`: fuente oficial/primaria y reproducible;
- `TIER_B`: proveedor confiable o fuentes convergentes;
- `TIER_C`: proxy/estimación parcial con uncertainty;
- `TIER_D`: construcción sintética o decisión de producto.

| Claim/target | Mínimo |
|---|---|
| Competition/Calendar/Award identities y reglas | `TIER_A`; conflicto material bloquea freeze. |
| Money unit/rate/inflation series | `TIER_A` o source oficial equivalente. |
| Performance/exposure/injury central | `TIER_A/B`; denominator compatible obligatorio. |
| Institutional/reputation proxies | `TIER_B/C` con triangulación y sensitivity. |
| Product preferences | `TIER_D/PRODUCT_DEFINED`; no exige A. |
| Scoring points existentes | fuente normativa interna/MASTER_SPEC; real-world evidence no puede inventarlos. |

## 9. Clases de privacidad

Cada dataset version declara una clase:

| Clase | Uso |
|---|---|
| `NO_PERSON_DATA` | Definiciones, calendarios, moneda o aggregates sin persona. |
| `PUBLIC_ENTITY_IDENTIFIED` | Clubes, competiciones, awards o public historical facts que necesitan identidad pública. |
| `PUBLIC_FIGURE_METRIC` | Métrica pública de figura/cuenta pública, con fecha/plataforma/semántica. |
| `ANONYMIZED_OBSERVATION` | Observación de jugador/career donde identidad no tiene consumer. |
| `AGGREGATED_NON_IDENTIFYING` | Solo cohortes/aggregates sin row-level identity. |
| `IDENTITY_RESTRICTED_LOCAL` | Identidad necesaria para join/normalization, retenida fuera del artifact publicado. |

Se aplica minimización: performance, Development, injuries y retirement usan
`ANONYMIZED_OBSERVATION` o `AGGREGATED_NON_IDENTIFYING` por defecto. Identidad
se retiene solo para club definitions, award/competition facts públicos o joins
longitudinales imposibles de realizar de otra manera.

### 9.1 `AnonymousObservationId`

Contrato futuro:

- opaco y estable dentro de una `datasetVersion`;
- producido por un perfil de pseudonimización one-way con key/salt privado y
  versionado, no por hash simple del nombre;
- no reversible desde artifacts publicados;
- mapping de identidad, si es necesario, queda `LOCAL_PRIVATE_SOURCE`;
- no se convierte en `PlayerDefinition`, no entra a gameplay y no se expone en
  UI;
- un refresh puede conservar linkage solo mediante proceso aprobado; no se
  asume estabilidad cross-dataset.

No se define aquí implementación ni secreto. Nunca se hardcodea la key en repo.

## 10. Salud e injuries

Solo se adquiere información deportiva públicamente documentada y necesaria:
definición del episodio, exposure, origin deportivo declarado, recovery/return
observado y censoring. Queda prohibido:

- obtener o conservar historias clínicas privadas;
- inferir diagnósticos no publicados;
- combinar datos para deducir condiciones sensibles;
- interpretar rumor como fact médico;
- usar identidad si una observation anónima satisface el target.

La falta de diagnosis granular se registra como missing/ambiguous; no se rellena.

## 11. Social

Followers/engagement de figuras públicas pueden ser public observations, pero
cada record declara plataforma, cuenta pública, fecha, source, definición de la
métrica, denominator y known bot/duplicate/era bias. No se recopilan usuarios,
audiencias individuales, contactos ni información privada.

Cross-platform deduplication no se infiere. Un aggregate de audience no puede
identificar personas ni conservar handles innecesarios.

## 12. Quality, conflictos y cambios

Un issue de fuente o calidad se registra append-only. Corregir raw mapping,
units, cutoff relation o privacy class crea nuevo dataset candidate/version; no
sobrescribe el artifact usado por un report.

Un dataset no llega a `VALIDATED` si falta:

- license/use y privacy review;
- source/evidence/transform lineage;
- units, IDs, mappings, missingness y censoring;
- bias/limitations;
- technical validation;
- conflicts materiales resueltos o aislados.

## 13. Gate de G3D-3B

G3D-3B puede investigar fuentes y adquirir solo después de que:

- esta governance esté aprobada;
- roles estén asignados mediante approvals, incluso en solo-project mode;
- `referenceCutoffDate` se congele en el snapshot header;
- cada source candidate tenga license route y privacy class;
- el `EvidenceRecord` de [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)
  sea obligatorio.

G3D-3B no calibra, no publica `dataVersion` y no convierte research en gameplay.

## 14. Referencias

- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)
- [Calibration Dataset Registry](CALIBRATION_DATASET_REGISTRY.md)
- [Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md)
- [Calibration Target Registry](CALIBRATION_TARGET_REGISTRY.md)
- [ADR-015](adr/015-version-taxonomy.md)
