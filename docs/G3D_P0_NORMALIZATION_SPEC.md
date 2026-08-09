# G3D P0 Normalization Spec

## 1. Propósito, autoridad y boundary

Este documento gobierna G3D-3C. Transforma la evidencia adquirida bajo
`RSNAP-G3D3B-2026-08-07-C1` en catálogos documentales candidatos. No publica
`Data V1`, no calibra `EngineParameterSet`, no fija tolerancias, no publica
`ScoringConfiguration` y no autoriza gameplay.

El cutoff del lineage es inmutable:

```yaml
referenceCutoffDate: 2026-08-07T23:59:59.999Z
referenceTimezone: UTC
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
normalizationSpecVersion: G3D_P0_NORMALIZATION_SPEC.v1
candidateBundleId: G3D3C-P0-CATALOG-CANDIDATE-C1
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
```

Son fuente de facts los 81 `EvidenceRecord` inmutables de
[P0 Evidence Index](P0_EVIDENCE_INDEX.md), con sus 46 sources resueltas en
[Source License Manifest](SOURCE_LICENSE_MANIFEST.md). La forma objetivo deriva
de [Vertical Slice Data Catalog Spec](VERTICAL_SLICE_DATA_CATALOG_SPEC.md).

## 2. Pipeline normativo

```text
EvidenceRecord inmutable
  -> CanonicalFactSelection
  -> CanonicalIdMapping / unit / temporal transform
  -> NormalizedCandidate
  -> schema + provenance + cross-catalog validation
  -> PublicationCandidate
```

Las capas no son intercambiables:

| Capa | Semántica | Puede mutar el origen |
|---|---|---|
| `RAW_OR_REFERENCE_EVIDENCE` | claim atómico, source y cutoff adquiridos | no |
| `NORMALIZED` | mismo fact con ID, enum, unidad y tiempo canónicos | no |
| `DERIVED` | resultado reproducible de una transformación declarada | no; agrega lineage |
| `PUBLISHED_DEFINITION` | artifact aprobado dentro de un `dataVersion` | no existe en G3D-3C |

Si aparece una corrección, se agrega un EvidenceRecord con
`supersedesEvidenceId`; nunca se modifica el record original. La selección
canónica registra ambos IDs y la razón. G3D-3C no necesitó correcciones.

## 3. Estados y missingness

Estados de normalización, en orden no necesariamente automático:

| Estado | Significado |
|---|---|
| `UNMAPPED` | evidence sin mapping canónico |
| `MAPPED` | identity/unit/temporal mapping definido, aún no emitido |
| `NORMALIZED` | artifact conforme al schema, aún sin validación completa |
| `NORMALIZED_WITH_LIMITATIONS` | subset usable con campos faltantes explícitos |
| `PENDING_DATA` | evidencia necesaria no adquirida |
| `CONFLICT` | fuentes materiales incompatibles sin resolución |
| `VALIDATED_CANDIDATE` | subset pasa validaciones de G3D-3C; no es release |
| `FROZEN` | solo permitido en una publicación posterior de `dataVersion` |

Missingness usa exactamente `PENDING_DATA`, `UNKNOWN`, `NOT_APPLICABLE` o
`NOT_IN_SCOPE`. `0`, `false` y `""` solo son valores si la evidencia afirma ese
valor; nunca reemplazan ausencia.

## 4. Provenance y transforms

Cada valor o fila candidata conserva:

```text
candidateArtifactId
canonicalId
evidenceIds[]
sourceIds[]
referencePeriod
cutoffClass
evidenceTier
usageClass
transformId
normalizationStatus
limitationRefs[]
```

Transforms utilizados:

| transformId | Operación exacta |
|---|---|
| `TR-G3D3C-ID-ASCII-V1` | normaliza el identificador a ASCII mayúsculo, tokens separados por `-`; preserva el nombre humano Unicode |
| `TR-G3D3C-SEASON-EDITION-SPLIT-V1` | separa `seasonId` de `competitionEditionId`; Argentina 2026 es season anual y Apertura es edición cerrada dentro de ella |
| `TR-G3D3C-TEMPORAL-ISO-V1` | fechas completas a ISO-8601; períodos incompletos conservan granularidad y no inventan día |
| `TR-G3D3C-PHASE-Q-V1` | asigna fases a Q por períodos adquiridos; un reparto exacto no evidenciado queda `PENDING_DATA` |
| `TR-G3D3C-EXPOSURE-V1` | separa `GUARANTEED` de `CONDITIONAL_ON_PROGRESSION` |
| `TR-G3D3C-ALIAS-V1` | clasifica alias como `CANONICAL_ALIAS`, `NON_CANONICAL_ALIAS` o `CANDIDATE_ALIAS` |
| `TR-G3D3C-MONEY-BINDING-V1` | normaliza moneda/minor unit y source route; no descarga ni transforma series |
| `TR-G3D3C-SCORING-NORMATIVE-V1` | transcribe fórmula/entero exacto aprobado con source `NORMATIVE`; no completa gaps |

## 5. Identity y referential integrity

El registry autoritativo de este candidate es
[G3D P0 Canonical ID Registry](G3D_P0_CANONICAL_ID_REGISTRY.md). Los IDs son
case-sensitive, estables, no dependen de sponsor y no contienen labels de
temporada en una identity atemporal.

Relaciones obligatorias:

- `CompetitionEdition.competitionId` y `.formatVersionId` deben resolver;
- `ClubDefinition.baselineMembershipEditionId` debe resolver;
- `AwardEdition.awardId` debe resolver;
- `AwardScoringDefinition.awardId` y
  `ScoringCompetitionDefinition.competitionId` deben resolver;
- `CalendarStageBinding.stageId` debe resolver;
- un `ABSTRACT_FIELD_ONLY` nunca puede ocupar una referencia nominal.

No se permiten free strings donde el contrato exige un ID. La validación se
realiza sobre el conjunto ordenado, no sobre el orden del filesystem.

## 6. Temporal y cutoff normalization

Cada fila declara una de:

- `PRE_CUTOFF_CLOSED`;
- `PRE_CUTOFF_PARTIAL`;
- `POST_CUTOFF_CORRECTION`;
- `TIMELESS_DEFINITION`.

`retrievedAt` nunca se convierte en fecha simulada. Una Definition atemporal y
su Edition cerrada son records distintos. LaLiga 2025/26 y Argentina 2026
comparten cutoff, no `seasonId`. El Apertura no cierra la season anual ni abre
el mercado V1.

## 7. Competition y aggregate adapter

El candidato de competiciones está en
[Reference & Competition Catalog Candidate](G3D_P0_REFERENCE_COMPETITION_CATALOG_CANDIDATE.md).
`RealCompetitionFormat` conserva participant/stage/progression/champion facts.
`SimulationAggregateContract` solo proyecta:

```text
real stages
  -> guaranteedMatchEquivalents
  -> conditionalMatchEquivalentsByReachedStage
  -> CompetitionFieldStrength input boundary
  -> progression/title facts
```

No crea fixtures, resultados ni exposición de rondas no alcanzadas. El
candidate argentino conserva zonas y playoff; no se fuerza a round-robin.

## 8. Calendar, market y registration

El [Calendar Candidate](G3D_P0_CALENDAR_CANDIDATE.md) usa stage-aligned Qs. La
asignación puede ser exacta por fase y aproximada dentro de una fase; cada
aproximación declara confidence. Los counts solo se publican cuando están
adquiridos. El calendario internacional ordinario queda `PENDING_DATA`.

La única market policy V1 es `POST_SEASON_ONLY` después del cierre lógico de la
season completa. No existe mercado entre Apertura y Clausura. Registration se
limita al subset next-season respaldado; toda elegibilidad adicional queda
`PENDING_DATA`.

## 9. Identity catalogs y data ausente

- [Club Identity Catalog Candidate](G3D_P0_CLUB_IDENTITY_CATALOG_CANDIDATE.md)
  publica identidad, alias y membership de 16 clubes; todos los baselines
  causales permanecen ausentes.
- [External Club Catalog Candidate](G3D_P0_EXTERNAL_CLUB_CATALOG_CANDIDATE.md)
  publica clases y materialization contract, no una world database.
- [National Team Catalog Candidate](G3D_P0_NATIONAL_TEAM_CATALOG_CANDIDATE.md)
  publica Argentina senior y World Cup context, no selection calibration.
- [Award Catalog Candidate](G3D_P0_AWARD_CATALOG_CANDIDATE.md) conserva estado
  individual; missing field/ballot/tie/alias no se infiere.
- [Money Bindings Candidate](G3D_P0_MONEY_BINDINGS_CANDIDATE.md) valida ARS/EUR
  y rutas, pero ninguna serie.
- [Scoring Catalog Candidate](G3D_P0_SCORING_CATALOG_CANDIDATE.md) separa
  identities de gameplay y scoring; transcribe solo normativa aprobada.

## 10. Licensing y publication boundary

La usage class heredada es un límite superior. Normalizar una source
`REFERENCE_ONLY` no la convierte en `REDISTRIBUTABLE_RAW`. Los artifacts de
este repo contienen facts manuales atómicos, mappings y normativa propia; no
incluyen dumps externos. Cualquier derived series futura necesita terms review,
transform, input/output hashes y aprobación.

`VALIDATED_CANDIDATE` significa usable internamente para composición y review;
no significa redistributable raw ni `FROZEN`. La publicación competitiva sigue
siendo atómica y requiere un `dataVersion` posterior.

## 11. Candidate identity y hashes

Cada artifact declara `sourceSnapshotId`, schema/spec, evidence dependency y
`candidateHashRef`. Los hashes publicados en
[Candidate Hash Manifest](G3D_P0_CANDIDATE_HASH_MANIFEST.md) usan
`CanonicalDocumentUtf8LfV1`:

1. contenido Markdown candidato completo;
2. Unicode NFC;
3. finales de línea LF;
4. UTF-8 sin BOM;
5. tablas ordenadas por canonical ID cuando el orden no es semántico;
6. SHA-256 lowercase hexadecimal.

El manifest no se incluye a sí mismo en su hash. Cambiar contenido, evidence
selection o schema genera nuevo hash y lineage; no se sobrescribe un candidate
publicado.

## 12. Validación G3D-3C

Un subset alcanza `VALIDATED_CANDIDATE` solo si pasa:

1. schema, enum, ID y missingness;
2. unicidad e integridad referencial;
3. edition/format/calendar temporal contra cutoff;
4. stage/progression/exposure consistency;
5. membership contra edición baseline;
6. usage/license propagation;
7. evidence/source resolution;
8. hash reproducible.

La validación no exige completar campos fuera del subset declarado. Sí impide
promover un artifact completo cuando un campo crítico del mismo está pending.

## 13. Gaps enfocados posteriores

| Gap ID | Campo exacto | Artifact afectado | Nivel | Owner/fase | Tipo requerido |
|---|---|---|---|---|---|
| `GAP-P0-AWD-001` | continuidad 2025 de field/ballot/tie Ballon/Kopa/Yashin | Award catalog | bloquea freeze de 3 definitions | DATA_OWNER / G3D-3B2 | web primaria |
| `GAP-P0-AWD-002` | POTY field, ballot y tie | Award catalog | bloquea definition | DATA_OWNER / G3D-3B2 | web primaria o policy explícita |
| `GAP-P0-AWD-003` | binding oficial `LaLiga Top Scorer`↔`Pichichi` y tie | Award catalog | bloquea canonical alias/tie | DATA_OWNER / G3D-3B2 | web primaria |
| `GAP-P0-CAL-001` | ventanas ordinarias Argentina senior | Calendar/NT | bloquea calendar internacional completo | DATA_OWNER / G3D-3B2 | web primaria |
| `GAP-P0-MON-001` | series/vintages INDEC, Eurostat, BCRA y ECB | Money | bloquea dataset monetario | DATA_OWNER / G3D-3B2 | adquisición/licencia |
| `GAP-P0-MON-002` | base date, missing-business-day, revisions y transform hash | Money | bloquea normalización | DATA+TECHNICAL / G3D-3B2/3C2 | data + transform review |
| `GAP-P0-SCR-001` | IJL y final gameplay bindings | Scoring | bloquea ScoringConfiguration | SCORING_OWNER / G3D-3D/P2 | producto + data |
| `GAP-P0-SCR-002` | equivalence groups, records, milestones, historic definitions | Scoring | bloquea catálogo completo | SCORING_OWNER / G3D-3D/P2 | producto/normativa |
| `GAP-P0-SCR-003` | PRI, contribution y social cohort transforms | ScoringCalibrationData | bloquea Gate 6 | SCORING+CALIBRATION / P2 | datasets/calibración |

Esta lista sustituye un nuevo P0 general. G3D-3B2, si se abre, se limita a
`GAP-P0-AWD-*`, `GAP-P0-CAL-001` y `GAP-P0-MON-*`.

## 14. Readiness boundary

G3D-3D (numeric product targets) puede avanzar en paralelo porque sus decisiones
no dependen de inventar los campos P0 anteriores. P1 solo debe abrir tracks
independientes cuyos joins ya resuelvan a los IDs candidatos; no se inicia en
esta fase. El estado global se detalla en
[G3D-3C Data V1 Readiness Report](G3D_3C_DATA_V1_READINESS_REPORT.md).

