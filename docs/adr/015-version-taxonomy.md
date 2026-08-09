# ADR-015: Taxonomía canónica de versiones

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-015
- Alcance: persistencia, replay, compatibilidad y releases

## Contexto

La especificación utilizaba nombres parcialmente superpuestos para schemas, motor, contenido, datos y scoring. El replay oficial requiere conocer exactamente qué semántica produjo una carrera.

## Decisión

Toda Career persiste exactamente estas cinco versiones canónicas:

```text
schemaVersion
engineVersion
contentVersion
dataVersion
scoringVersion
```

No se utilizan `dataSnapshotVersion` ni `entityVersion` como sustitutos de estas cinco referencias en la cabecera canónica de Career. Una entidad interna puede conservar una revisión propia, pero no reemplaza `VersionSet`.

Las cinco versiones y los hashes de releases/snapshots correspondientes participan del material de replay e integridad.

### schemaVersion

Usa SemVer.

| Cambio | Nivel |
|---|---|
| Campo requerido nuevo, eliminación, cambio de tipo o reinterpretación incompatible | Major |
| Campo opcional aditivo y semánticamente compatible | Minor |
| Corrección documental o de validación que no reinterpreta datos válidos | Patch |

Un cambio de validación que vuelve inválidos estados previamente válidos no se considera automáticamente patch; debe clasificarse por compatibilidad real.

### engineVersion

Usa SemVer.

| Cambio | Nivel mínimo |
|---|---|
| Cambio incompatible de state machine, PRNG, cursor, DSL o contrato de replay | Major |
| Capacidad aditiva que preserva resultados de inputs anteriores y requiere opt-in versionado | Minor |
| Corrección compatible de implementación | Patch |

Cualquier cambio que modifique resultados deterministas debe incrementar `engineVersion` o alguna otra versión participante que identifique inequívocamente la causa. Un bugfix que cambia resultados incrementa como mínimo patch y exige conservar el runtime anterior para replay de carreras existentes.

### scoringVersion

Usa SemVer.

| Cambio | Nivel mínimo |
|---|---|
| Fórmula, categoría o interpretación incompatible | Major |
| Capacidad de scoring aditiva y compatible para nuevos contextos | Minor |
| Corrección compatible o bugfix acotado | Patch |

Todo cambio que altere puntuación competitiva incrementa `scoringVersion`, aunque también cambie `engineVersion`.

### contentVersion

Usa un ID de release inmutable e identificable:

```text
2026.07.27.1
```

La forma representa fecha de publicación y secuencia de release del día. Una release publicada no se edita. Texto, condiciones, modificadores, efectos y referencias forman parte de la release; cualquier cambio publica otro `contentVersion`.

### dataVersion

Usa un ID de snapshot inmutable e identificable, por ejemplo:

```text
2026.07
```

El ID identifica un snapshot concreto de clubes, ligas, competiciones, premios y jerarquías. No se reutiliza para bytes o semántica distintos. Si la cadencia exige más de un snapshot en el mismo período, cada snapshot recibe un ID único documentado sin reinterpretar uno ya publicado.

### Compatibilidad y replay

- El runtime mantiene una matriz explícita de versiones comprendidas.
- Replay oficial requiere comprender semánticamente las cinco versiones y todos los campos necesarios.
- Un campo desconocido solo puede ignorarse si `schemaVersion` lo declara opcional y no semántico.
- Un operador, efecto, enum o campo requerido desconocido impide replay oficial.
- No se migra silenciosamente una carrera a versiones nuevas.
- Las migraciones explícitas conservan origen, destino, motivo, transformación y hash.
- Los runtimes, releases y snapshots históricos necesarios se retienen o se preserva un mecanismo verificable equivalente para replay.

### Reglas de bump coordinado

| Cambio | Versiones que deben cambiar |
|---|---|
| Algoritmo o orden de simulación | `engineVersion` |
| Contrato serializado incompatible | `schemaVersion`; también `engineVersion` si cambia replay |
| Evento, cadena o efecto de contenido | `contentVersion`; además otras si cambia su semántica |
| Snapshot de entidades o jerarquías | `dataVersion` |
| Fórmula o valor competitivo de scoring | `scoringVersion` |

Más de una versión puede cambiar en la misma release.

## Consecuencias

- `VersionSet` tiene cinco campos obligatorios y no admite alias.
- APIs, DB, hashes, share cards oficiales y logs usan los mismos nombres.
- El runtime debe resolver artefactos históricos exactos.
- La comparación competitiva puede filtrar por `scoringVersion` y demás versiones relevantes.
- Los cambios deterministas nunca quedan ocultos detrás de un deploy sin bump.
- Los formatos de content/data no usan SemVer como requisito, pero sus IDs son únicos e inmutables.

## Alternativas rechazadas

### Una única versión global

Rechazada porque impide distinguir motor, contenido, datos y scoring.

### Versiones no persistidas y derivadas del deploy actual

Rechazadas porque rompen replay histórico.

### Ignorar campos semánticos desconocidos

Rechazado porque produce replays falsamente válidos.

### Editar una release o snapshot publicado

Rechazado porque cambia carreras sin cambiar su referencia.

### Usar `dataSnapshotVersion` y `dataVersion` como sinónimos

Rechazado para la cabecera canónica: el nombre único es `dataVersion`.

## Aclaración G3C-11

`ScoringConfiguration` y `ScoringCalibrationData` son recursos inmutables
hash-addressed gobernados por `scoringVersion`; no son versiones canónicas
adicionales. Una `scoringVersion` oficial resuelve a un único par de hashes.
La compatibility key V1 de ADR-080 incluye las cinco versiones y esos hashes.

## Pruebas requeridas

- Career no valida si falta una de las cinco versiones.
- Alias antiguos no se emiten en contratos canónicos.
- Matriz de compatibilidad acepta y rechaza fixtures conocidos.
- Un campo semántico desconocido bloquea replay oficial.
- Campos opcionales no semánticos siguen la política de `schemaVersion`.
- Releases y snapshots son inmutables por ID.
- Cada cambio de resultado observado corresponde a un bump participante.
- Golden replays cargan exactamente engine, content, data y scoring declarados.
- Migraciones registran origen/destino y producen hashes reproducibles.

## Referencias

- [ADR-006: PRNG determinista](./006-deterministic-prng.md)
- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [ADR-014: DSL de eventos](./014-event-dsl.md)
- [ADR-010: Domain Facts y ScoreLedger estructural](./010-scoring-ledger-and-domain-facts.md)
- [ADR-080: Matemática exacta de Scoring](./080-exact-scoring-mathematics.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-015--taxonomía-de-versiones)
