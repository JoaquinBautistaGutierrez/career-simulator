# ADR-070: Runtime matemático y ParameterSets inmutables

- Estado: Aceptado
- Fecha: 2026-07-29
- Decisión relacionada: DR-070
- Alcance: matemática transversal de gameplay, determinismo cross-runtime,
  cuantización e identidad de parámetros

## Contexto

ADR-002/003 permite IEEE-754 double y log-space; ADR-006/051 congela PRNG,
uniformes y streams; ADR-015 exige cinco versiones canónicas. G3B dejó
parámetros externalizables en todos los subsistemas, pero no había definido:

- cómo una Career identifica el conjunto exacto utilizado;
- cómo se evita que una publicación modifique replays existentes;
- si los parámetros requieren una sexta versión;
- qué boundary controla operaciones trascendentales cross-runtime;
- cuándo se cuantiza estado recurrente.

`engineVersion` por sí sola describe semántica, pero no demuestra qué bytes de
configuración fueron cargados. Una `parameterVersion` adicional rompería la
taxonomía de cinco versiones sin necesidad.

## Decisión

### Perfil matemático

Gameplay usa IEEE-754 binary64 dentro de operaciones atómicas. No se adopta
fixed-point universal.

Las funciones trascendentales y transformaciones numéricamente sensibles se
consumen mediante primitivas canónicas versionadas por el engine. No se
dispersan invocaciones host con edge cases propios. Cada primitiva debe tener
algoritmo, orden de operaciones, dominios, errores y golden vectors.

Un runtime solo puede producir replay oficial si supera el perfil de
conformidad matemática. Un runtime no conforme puede actuar como cliente, pero
no como autoridad competitiva.

### Cuantización

El cálculo conserva binary64 durante una transición atómica. Al persistir
estado:

- se rechazan NaN e infinitos;
- solo se aplican límites lógicos;
- se cuantiza una vez con `ROUND_HALF_EVEN`;
- `-0` se normaliza a `+0`;
- el siguiente paso consume el valor persistido.

Scoring no usa este rounding: conserva `ROUND_HALF_UP`, decimal/racional exacto
y puntos enteros según ADR-010.

### Identidad del ParameterSet

Se elige:

```text
VersionSet
+ parameterSetId
+ parameterSetHash
```

`parameterSetHash` es SHA-256 del payload RFC-8785 canónico del
`EngineParameterSet`; el campo de hash no se incluye de forma
autorreferencial. `parameterSetId` es una referencia de catálogo, no autoridad
de contenido.

El hash:

- se persiste en la cabecera de Career;
- participa en checkpoints, replay y compatibilidad competitiva;
- no es una sexta versión canónica;
- no sustituye `engineVersion`.

La estructura del artefacto se rige por `schemaVersion`; sus algoritmos y
semántica, por `engineVersion`. En producción, cambiar parámetros de gameplay
que alteren resultados requiere al menos un patch de `engineVersion`. Una misma
`engineVersion` no puede resolver a dos hashes oficiales diferentes.

Los candidatos de calibración pueden tener hashes distintos dentro de una
build experimental, pero no crean Careers oficiales ni comparten identidad
competitiva.

### Separación de scoring y contenido

`EngineParameterSet` contiene parámetros de gameplay. No contiene:

- reglas o valores de score;
- texto narrativo;
- payloads de eventos;
- snapshots de datos futbolísticos.

Scoring se gobierna por `scoringVersion` y un rule/config set inmutable.
Contenido y datos se gobiernan por `contentVersion` y `dataVersion`.

### Publicación y retención

Un ParameterSet publicado es content-addressed e inmutable. Publicar exige
schema válido, canonicalización, hash, compatibilidad de engine, goldens,
properties y evidencia de calibración. Deprecación solo cambia metadatos de
catálogo.

Los artefactos necesarios para replay se retienen mientras una Career soportada
los referencie. Ausencia o mismatch de hash impide replay oficial; no existe
fallback a la release “más cercana”.

### Guards de calibración

Un budget de worker/test puede detener una ejecución patológica devolviendo
`INCONCLUSIVE_GUARD_REACHED`. Es infraestructura:

- no cambia gameplay;
- no fuerza retiro ni finalización;
- no produce facts, score o resultado competitivo;
- no se interpreta como muestra válida.

## Alternativas rechazadas

### A. Parámetros implicados únicamente por `engineVersion`

Rechazada porque no prueba los bytes efectivamente cargados y debilita auditoría
y replay.

### B. Nueva `parameterVersion` canónica

Rechazada porque crea una sexta versión y duplica la responsabilidad de
`engineVersion`. Identidad de contenido y versión semántica son problemas
distintos.

### C. Reutilizar `contentVersion` o `dataVersion`

Rechazada porque mezclaría configuración causal del engine con narrativa o
snapshot futbolístico.

### D. Permitir varios hashes oficiales bajo la misma `engineVersion`

Rechazada porque una versión semántica dejaría de identificar resultados de
forma inequívoca.

### E. Persistir doubles recurrentes sin cuantización

Rechazada porque facilita drift y hace depender replay de diferencias
sub-ULP no observables.

### F. Aplicar un cap o edad máxima ante simulaciones largas

Rechazada porque transformaría una protección operacional en regla de
gameplay.

## Consecuencias

- Las cinco versiones canónicas se preservan.
- Replay identifica algoritmo y bytes de parámetros.
- Los cambios de balance causal requieren `engineVersion` nuevo en releases
  oficiales.
- Scoring permanece separado y determinista.
- Los runtimes deben superar un perfil matemático, no solo tests del PRNG.
- La implementación futura necesita un loader content-addressed y fixtures de
  conformidad, pero G3C-1 no implementa esos componentes.

## Pruebas y gates

- Mismo payload, distinto orden de propiedades → mismo hash.
- Cualquier byte semánticamente distinto → hash distinto.
- Mismatch `engineVersion`/compatibility/hash se rechaza.
- Una Career siempre reabre el mismo ParameterSet.
- NaN, infinitos y `-0` no entran en estado canónico.
- `ROUND_HALF_EVEN` tiene vectores positivos, negativos y de empate.
- Las primitivas sensibles tienen golden vectors en todos los runtimes
  soportados.
- Scoring no carga `EngineParameterSet` ni consume RNG.
- Un execution guard no cambia state, facts, ledger o lifecycle.

## Referencias

- [Contrato matemático y de calibración](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [ADR-002: Representación de probabilidades](./002-probability-representation.md)
- [ADR-006: PRNG determinista](./006-deterministic-prng.md)
- [ADR-007: Canonicalización y hashes](./007-canonicalization-and-hashing.md)
- [ADR-010: Facts y ScoreLedger](./010-scoring-ledger-and-domain-facts.md)
- [ADR-015: Taxonomía de versiones](./015-version-taxonomy.md)
- [ADR-051: Contratos binarios](./051-deterministic-core-byte-contracts.md)
- [DR-070](../DECISIONS_REQUIRED.md#dr-070--identidad-y-versionado-del-engineparameterset)
