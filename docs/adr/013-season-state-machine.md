# ADR-013: State machine de temporada

- Estado: Aceptado; enmendado por ADR-042 y ADR-043
- Fecha: 2026-07-27
- Decisión relacionada: DR-013
- Alcance: avance, interrupciones, reanudación y checkpoints

## Contexto

La cadencia visual permite solicitar hasta cuatro temporadas, pero toda decisión mecánica obligatoria debe interrumpir la ejecución. Sin un cursor persistible, reanudar podría repetir tiradas, efectos o fases ya completadas.

La simulación necesita distinguir “intentar completar temporadas” de “saltar tiempo”.

## Decisión

### Plan de ejecución

La enumeración plana inicial de fases queda enmendada antes de implementación:

- ADR-042 subdivide producción y salud en Q1–Q4 con pasos causales;
- ADR-043 reemplaza `EVENT_OPPORTUNITIES` por ocho ventanas asociadas a hechos disponibles.

El plan canónico resultante es:

```text
SEASON_START
PRESEASON
PRESEASON_EVENTS
ROLE_AND_MINUTES

for Q1, Q2, Q3, Q4:
  AVAILABILITY(Qn)
  PRODUCTION(Qn)
  HEALTH(Qn)
  CONSEQUENCES(Qn)
  PERFORMANCE_EVENTS(Qn)
  HEALTH_EVENTS(Qn)

COMPETITIONS
COMPETITION_EVENTS
MARKET
MARKET_EVENTS
AWARDS
AWARD_EVENTS
WORLD_UPDATE
WORLD_EVENTS
POSTSEASON_EVENTS
SEASON_CLOSE
```

El plan, sus ventanas y su orden forman parte de `engineVersion`.

`WAITING_DECISION` no es una fase: es un estado interruptivo de Career.

### SimulationCursor

`SimulationCursor` es persistible, canónico y suficiente para identificar el próximo trabajo no ejecutado. Contiene conceptualmente:

| Campo | Propósito |
|---|---|
| `seasonId` | Temporada actualmente abierta. |
| `step` | Paso actual del plan canónico. |
| `seasonWindow` | `Q1`–`Q4` cuando el paso pertenece a una ventana agregada. |
| `opportunityWindow` | Ventana de oportunidades actual, cuando corresponde. |
| `operationKey` | Suboperación estable dentro del paso/ventana. |
| `operationIndex` | Posición dentro del plan canónico de la fase. |
| `resumeAfterOperationKey` | Primer punto que puede ejecutarse después de resolver una interrupción. |
| `randomProgress` | Evidencia necesaria para no volver a consumir tiradas ya resueltas dentro de la operación. |

Los campos no aplicables se omiten de manera canónica. El cursor nunca depende de un índice derivado del orden incidental de un array o consulta.

La representación estructural de G2 materializa `seasonId`, una `position` discriminada, `operationKey` y `operationIndex`. El cursor siempre señala la próxima operación no ejecutada. Mientras las operaciones estén vacías y sean atómicas, `PendingDecision.afterOperationKey` junto con `resumeCursor` representa `resumeAfterOperationKey`; no existe todavía `randomProgress` porque G2 no consume azar dentro del runner. Antes de introducir sorteos intraoperación, el schema deberá incorporar el progreso necesario y participar en `engineVersion`.

### AdvanceRequest

`AdvanceRequest` declara:

- carrera y revisión esperada;
- `seasonsToComplete`, entero positivo;
- idempotency key de la operación;
- checkpoint previo esperado cuando corresponda.

La cadencia visual no forma parte de la semántica del request del motor.

`advance(n)` significa **intentar completar hasta `n` temporadas**, no saltarlas ni resumir su cálculo.

### AdvanceResult

`AdvanceResult` declara:

- temporadas efectivamente completadas, entre cero y `n`;
- estado resultante de Career;
- cursor del siguiente trabajo;
- motivo de detención;
- decisión pendiente opcional;
- checkpoint canónico;
- hechos de dominio producidos.

Motivos de detención iniciales:

- objetivo de temporadas alcanzado;
- decisión obligatoria pendiente;
- estado terminal o no avanzable;
- rechazo antes de mutar por revisión/contrato inválido.

### Interrupción y reanudación

- Una decisión mecánica obligatoria puede surgir en cualquier paso o ventana de oportunidades.
- La ejecución se detiene en un límite atómico de operación.
- La creación de la decisión pendiente, el cambio a `WAITING_DECISION` y el cursor de reanudación se confirman juntos.
- Las opciones y su contexto quedan fijados en el checkpoint; no se vuelven a sortear al reabrir.
- Resolver la decisión valida primero todos sus efectos, los aplica atómicamente y continúa desde `resumeAfterOperationKey`.
- Ninguna tirada o efecto confirmado antes de la interrupción se repite.
- Solo puede existir una decisión mecánica pendiente activa por Career.

### Checkpoints

Un checkpoint incluye, como mínimo:

- snapshot canónico de Career;
- `SimulationCursor`;
- las cinco versiones canónicas;
- revisión y secuencia de decisiones;
- decisión pendiente, si existe;
- progreso de streams necesario para replay;
- hash previo y hash del checkpoint.

Son obligatorios en:

- inicio de Career activa;
- cada interrupción;
- cierre de temporada;
- retiro;
- finalización.

La infraestructura puede persistir checkpoints adicionales sin modificar el resultado.

### Atomicidad

- Una operación de un paso se confirma completa o no se confirma.
- Los efectos de una decisión se aplican todos o ninguno.
- `SeasonResult` solo se emite al completar `SEASON_CLOSE`.
- Si se detiene antes de `SEASON_CLOSE`, la temporada permanece abierta y no aparece como completada en `AdvanceResult`.
- Un reintento con la misma idempotency key devuelve el resultado previamente confirmado o evita duplicar la operación.

## Consecuencias

- Un `advance(4)` puede devolver cero a cuatro temporadas completas.
- Cambiar la cadencia visual no cambia request, cursor, streams, eventos, estadísticas ni score.
- Web, API y CLI pueden presentar progreso distinto sin alterar la ejecución.
- La granularidad de `operationKey` queda ligada al plan versionado de ADR-042/043.
- El plan enmendado reemplaza como contrato técnico tanto la secuencia asumida inicialmente como la lista plana original de este ADR.
- Q1–Q4 no representan partidos individuales.

## Alternativas rechazadas

### Guardar solo la fase o el paso

Rechazada porque no identifica el punto exacto dentro de una fase.

### Recalcular la temporada al reanudar

Rechazada porque puede repetir tiradas y efectos.

### Tratar `advance(n)` como un salto agregado

Rechazada porque viola la simulación temporada por temporada.

### Delegar decisiones según cadencia

Rechazada porque la cadencia es exclusivamente visual.

### Aplicar parcialmente una decisión

Rechazada porque permite estados corruptos.

## Pruebas requeridas

- Interrupción y reanudación en cada paso y ventana.
- Ninguna tirada consumida se repite después de reanudar.
- `advance(n)` nunca completa más de `n` temporadas.
- Una interrupción puede devolver menos temporadas que las solicitadas.
- `SeasonResult` no existe antes de `SEASON_CLOSE`.
- Mismo estado, versiones, request y decisiones producen mismo cursor, resultados y hashes.
- Cambiar solo la cadencia visual no modifica el resultado.
- Reintentos idempotentes no duplican efectos.
- Checkpoints restaurados continúan exactamente desde `resumeAfterOperationKey`.
- Lesiones intermedias no reescriben ventanas cerradas.
- Oportunidades dependientes de hechos posteriores no se evalúan antes de que existan.

## Referencias

- [ADR-005: Muestreo de oportunidades](./005-event-opportunity-sampling.md)
- [ADR-016: Ciclo de vida de Career](./016-career-lifecycle.md)
- [ADR-042: Salud, performance y minutos](./042-season-health-performance.md)
- [ADR-043: Ventanas causales de oportunidades](./043-event-opportunity-windows.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-013--interrupciones-y-atomicidad-de-temporada)
