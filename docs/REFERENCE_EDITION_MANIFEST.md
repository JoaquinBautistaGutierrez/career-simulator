# Reference Edition Manifest

## 1. Artifact header

```yaml
artifactId: REFERENCE_EDITION_MANIFEST
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-BASELINE
state: EVIDENCE_COMPLETE_WITH_LIMITATIONS
referenceCutoffDate: 2026-08-07
referenceCutoffInterpretation: inclusive_through_2026-08-07T23:59:59.999Z
referenceTimezone: UTC
referenceSnapshotPolicyVersion: G3D_REFERENCE_SNAPSHOT_POLICY.v1
researchPlanVersion: G3D_EXTERNAL_RESEARCH_PLAN.v1
governanceVersion: G3D_DATA_GOVERNANCE.v1
openedAt: 2026-08-09T19:37:15.489Z
cutoffFrozenAt: 2026-08-09T19:37:15.489Z
cutoffFrozenBy:
  - role: DATA_OWNER
    approverRef: PROJECT_MAINTAINER_AS_DATA_OWNER
  - role: PRODUCT_OWNER
    approverRef: PROJECT_MAINTAINER_AS_PRODUCT_OWNER
evidenceManifestHash: PENDING_G3D_3C_CANONICALIZATION
sourceLicenseManifestHash: PENDING_G3D_3C_CANONICALIZATION
artifactManifestHash: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

## 2. Cutoff freeze

`referenceCutoffDate` queda congelada en **2026-08-07** antes de crear el primer
`EvidenceRecord` externo de esta campana. Se interpreta como el ultimo instante
inclusivo del dia civil en UTC. `retrievedAt` registra por separado cuando se
consulto cada fuente; una publicacion posterior solo puede respaldar un hecho
pre-cutoff, una correccion trazable de ese hecho o una definicion atemporal.

La fecha coincide con la apertura logica declarada para G3D-3B, permite aplicar
una regla uniforme a ligas de ano calendario y temporadas partidas, y evita
seleccionar retrospectivamente un cutoff favorable a una fuente o edicion. No
se autoriza ninguna excepcion post-cutoff por este freeze.

El freeze se produjo localmente como acto documental bajo
[`G3D_REFERENCE_SNAPSHOT_POLICY.md`](G3D_REFERENCE_SNAPSHOT_POLICY.md), antes de
abrir fuentes externas. El timestamp procede del reloj UTC de la estacion de
trabajo y no es una fuente de azar ni un input de gameplay.

## 3. Edition bindings

Los bindings siguientes son resultados de adquisicion P0. No son todavia
`CompetitionDefinition`, `CalendarDefinition` ni Data V1: G3D-3C debe
normalizar IDs, validar integridad referencial y publicar los artifacts
versionados.

| Slot | Canonical edition ID | seasonId | Period | Cutoff relation | Evidence | State |
|---|---|---|---|---|---|---|
| Argentina top flight | `ARG-LPF-APERTURA-2026` | `ARG-2026-APERTURA` | 2026-01-25 to 2026-05-18 | `PRE_CUTOFF_CLOSED` | `EV-P0-001`..`EV-P0-007` | `COMPLETE_WITH_LIMITATIONS` |
| Argentina domestic cup | `ARG-COPA-ARGENTINA-2025` | `ARG-CUP-2025` | 2025 edition; final 2025-11-05 | `PRE_CUTOFF_CLOSED` | `EV-P0-012`..`EV-P0-014` | `COMPLETE` |
| Spain top flight | `ESP-LALIGA-2025-26` | `ESP-2025-26` | 2025-08-16 to 2026-05-24 | `PRE_CUTOFF_CLOSED` | `EV-P0-015`..`EV-P0-017` | `COMPLETE` |
| Copa del Rey | `ESP-COPA-DEL-REY-2025-26` | `ESP-CUP-2025-26` | 2025-09-27 to 2026-04-18 | `PRE_CUTOFF_CLOSED` | `EV-P0-018`..`EV-P0-020` | `COMPLETE` |
| Copa Libertadores | `CONMEBOL-LIBERTADORES-2025` | `CONMEBOL-LIB-2025` | 2025-02 to 2025-11-29 | `PRE_CUTOFF_CLOSED` | `EV-P0-021`..`EV-P0-024` | `COMPLETE` |
| UEFA Champions League | `UEFA-CHAMPIONS-LEAGUE-2025-26` | `UEFA-UCL-2025-26` | 2025-07-08 to 2026-05-30 | `PRE_CUTOFF_CLOSED` | `EV-P0-025`..`EV-P0-027` | `COMPLETE` |
| Argentina senior major context | `FIFA-WORLD-CUP-2026` | `INT-WC-2026` | 2026-06-11 to 2026-07-19 | `PRE_CUTOFF_CLOSED` | `EV-P0-028`..`EV-P0-031` | `COMPLETE` |
| Five award slots | `BALLON_DOR_MEN-2025`; `KOPA_TROPHY_MEN-2025`; `LALIGA_POTY-2025-26`; `LALIGA_TOP_SCORER-2025-26`; `YASHIN_TROPHY_MEN-2025` | mixed single-year/cross-year | evaluation periods closed before cutoff | `PRE_CUTOFF_CLOSED` | `EV-P0-032`..`EV-P0-041` | `COMPLETE_WITH_LIMITATIONS` |

Argentina 2026 es una temporada anual con Apertura y Clausura independientes,
tabla general anual y Trofeo de Campeones. El Apertura es la ultima edicion
cerrada del slot al cutoff; el Clausura estaba abierto. G3D-3C no debe tratar el
Apertura como si fuera una liga europea de agosto a mayo ni ubicar el mercado
post-season entre ambos torneos. La ventana V1 permanece ligada al cierre de la
temporada anual, no al cierre semestral del Apertura.

Los cinco award candidates tienen identidad y edicion verificadas. La
metodologia publica de Ballon d'Or/Kopa/Yashin es suficiente; LALIGA no publica
en las paginas halladas todos los campos de field/tie para POTY y top scorer.
Esos campos se conservan como limitacion de normalizacion, no se infieren.

## 4. Boundary

Este manifest identifica evidencia candidata. No normaliza facts, no publica
definitions, no asigna ratings, coeficientes, tolerancias, puntos de scoring ni
valores de `EngineParameterSet` o `ScoringConfiguration`.

## 5. Artifact review declaration

- Evidence selection: all `EV-P0-*` IDs referenced in §3, resolvable through
  [P0 Evidence Index](P0_EVIDENCE_INDEX.md).
- Owner approvals: `DATA_OWNER`, `PRODUCT_OWNER`; technical/hash review remains
  candidate-level until G3D-3C canonicalization.
- Limitations: Argentina annual competition remains
  `PRE_CUTOFF_PARTIAL`; award-edition limitations are inherited from
  `AWARD_CATALOG_EVIDENCE`.
- Unresolved material conflicts: none. Missing fields are explicit blockers and
  were not treated as contradictory evidence.
