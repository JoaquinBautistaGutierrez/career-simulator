# ADR-010: Domain Facts y ScoreLedger estructural

- Estado: Aceptado para estructura; matemática de DR-010 pendiente
- Fecha: 2026-07-28
- Decisiones relacionadas: DR-010 y DR-063
- Especificación normativa:
  [`../SCORING_FACTS_SPEC.md`](../SCORING_FACTS_SPEC.md)
- Aclara: ADR-009, ADR-014, ADR-015, ADR-016, ADR-050 y ADR-051

## Contexto

Los bloques anteriores de G3B produjeron nombres candidatos para ocurrencias,
snapshots, trazas y señales. Sin una taxonomía final, una implementación podía:

- persistir cada intermedio como evento;
- duplicar producción, outcomes o awards mediante aliases;
- permitir que Content fabricara un fact puntuable;
- mezclar señales internas con hechos de dominio;
- acoplar engine y scoring;
- puntuar dos veces al reintentar;
- cambiar un ledger histórico al publicar otra `scoringVersion`;
- usar reloj o UUID aleatorio como identidad;
- congelar el score al primer retiro reversible.

`MASTER_SPEC` fija la suma PC, valores iniciales, ledger inmutable,
`ROUND_HALF_UP`, reversals y versionado, pero DR-010 conserva fórmulas
matemáticas abiertas.

## Decisión

### Cuatro conceptos separados

Se distinguen `InternalEngineSignal`, `DomainFact`, `NarrativeEvent` y
`ScoreLedgerEntry`.

Solo un `DomainFact` confirmado puede ser input de Scoring. Estar allowlisted
no otorga puntos: una `ScoringRuleDefinition` de la misma `scoringVersion`
también debe seleccionarlo.

### Fact ledger

Los facts son append-only, tipados, ordenados y deterministas. Su identidad usa
Career, `operationKey`, tipo, semantic key y ordinal canónico; nunca reloj,
UUID aleatorio u orden de persistencia.

El catálogo y las migraciones de aliases se fijan en
`SCORING_FACTS_SPEC.md`. En particular:

- `StatsGenerated` migra a `ObservedProductionRecorded`;
- `PlayerDeveloped` migra a `PlayerCapabilitiesChanged`;
- outcomes de competición se concentran en `CompetitionFinished`;
- contextos internacionales reutilizan facts genéricos;
- `StatisticalAwardWon` migra a `AwardWon`;
- `FollowersChanged` migra a `FollowerCountUpdated`;
- `PlayerRetired` migra a `RetirementOccurred`;
- requests especializados usan `DecisionRequested.decisionKind`.

### Scoring puro

`packages/scoring` consume facts y configuración versionada y produce un ledger
separado. `packages/engine` no importa scoring.

No se permite RNG en Scoring bajo esta decisión. Re-scoring bajo otra
`scoringVersion` produce otro ledger sin ejecutar gameplay ni mutar el
histórico.

### Ledger e idempotencia

Cada entry referencia rule, source facts, category, scope, cálculo,
`scoringVersion`, puntos enteros y hash anterior.

La idempotency key se deriva canónicamente de:

```text
scoringVersion + careerId + ruleId + category + scopeKey
+ canonicalSourceFactIds + applicationKind
```

Las entries publicadas no se editan o eliminan. Una corrección usa una
`REVERSAL` append-only autorizada por `ScoringCorrectionAuthorized` y, si
corresponde, una nueva `POSTING`. Content y el cliente no pueden autorizarla.

### Categorías y números

Las únicas categorías PC son:

```text
PRI + PTC_CLUB + PPI + PSN + PRL + PBR
```

Los puntos finales por entry y PC son enteros. Los intermedios usan decimal
exacto/racional determinista y cada entry termina con `ROUND_HALF_UP`. PC suma
enteros y no aplica otro redondeo.

La nomenclatura normativa conserva:

- `PRL`: records y longevidad;
- `PBR`: popularidad, redes y eventos históricos bounded.

CC se aplica a logros colectivos de club/selección, no por defecto a PRI, PPI,
PRL o PBR.

Los caps aprobados limitan puntos, nunca ocurrencias, stats o eventos.

### Lifecycle y ranking

Un snapshot competitivo final requiere Career `COMPLETED`, integridad válida,
ledger verificado y contexto compatible. El primer `RetirementOccurred` no
congela scoring ni habilita ranking. DR-069 conserva el boundary terminal.

Igualdad de `scoringVersion` es condición necesaria, no suficiente, para
compartir leaderboard. DR-036 debe cerrar la compatibility key completa.

## Consecuencias

### Positivas

- DR-063 queda cerrada estructuralmente;
- schemas de facts/ledger pueden diseñarse sin inventar gameplay;
- replay, re-scoring y auditoría tienen identidad estable;
- Content no puede saltar la frontera competitiva;
- outcomes y stats dejan de duplicarse mediante aliases;
- ScoreLedger explica exactamente el total.

### Restricciones

- DR-010 sigue bloqueando implementación de scoring real;
- SC-02 a SC-11 conservan matemática parcial según la matriz normativa;
- DR-049, DR-066/067 y DR-069 siguen bloqueando scopes/finalización;
- cambiar catálogo/allowlist puede exigir bump de schema/engine/scoring;
- no existe `engine -> scoring`.

## Alternativas rechazadas

### Persistir todo intermedio como DomainFact

Rechazada porque infla el log, duplica verdad y vuelve scoring dependiente de
detalles de implementación.

### Puntuar `EventInstance` directamente

Rechazada porque Content podría crear puntos arbitrarios y mezclar narrativa
con mérito deportivo.

### Ledger mutable o total como única fuente

Rechazados porque impiden reconstrucción, reversals y auditoría.

### Idempotencia basada solo en source entity

Rechazada porque no distingue rule, scope, categoría o versión.

### Recalcular el ledger histórico in-place

Rechazado porque una nueva versión no debe reinterpretar carreras publicadas.

### Usar RNG en Scoring

Rechazado porque los facts ya contienen los outcomes; el score debe ser una
función pura de facts y versión.

### Adoptar “PRL = popularity”

Rechazado porque contradice la tabla canónica de `MASTER_SPEC`:
popularidad/redes/eventos pertenecen a PBR.

## Gates y pruebas requeridos

Antes de implementar scoring:

1. schemas reflejan el catálogo sin aliases;
2. golden fact IDs son independientes de cadencia;
3. allowlist valida tipo y productor;
4. Content no emite facts puntuables;
5. idempotencia y hash chain tienen fixtures;
6. ledger se reconstruye byte a byte;
7. reversals no mutan entries;
8. suma PC coincide con las seis categorías;
9. valores de `MASTER_SPEC` tienen fixtures;
10. SC-02 a SC-11 pendientes están resueltas o parametrizadas con valores
    iniciales aprobados;
11. DR-049/066/067/069 están cerradas para sus scopes;
12. toda modificación competitiva cambia `scoringVersion`.

## Referencias

- [Especificación de facts y scoring](../SCORING_FACTS_SPEC.md)
- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [ADR-009: Coeficiente de Contribución](./009-contribution-coefficient.md)
- [ADR-014: DSL de eventos](./014-event-dsl.md)
- [ADR-015: Versionado](./015-version-taxonomy.md)
- [ADR-016: Career lifecycle](./016-career-lifecycle.md)
- [ADR-050: Package boundaries](./050-foundation-package-boundaries.md)
- [ADR-051: Contratos deterministas](./051-deterministic-core-byte-contracts.md)
- [DR-010](../DECISIONS_REQUIRED.md#dr-010--scoring-incompleto)
- [DR-063](../DECISIONS_REQUIRED.md#dr-063--catálogo-de-hechos-matemáticos-y-allowlist-de-scoring)
- [DR-069](../DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso)
