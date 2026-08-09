# ADR-016: Ciclo de vida de Career

- Estado: Aceptado; aclarado por ADR-062 y ADR-079
- Fecha: 2026-07-27
- Decisión relacionada: DR-016
- Alcance: estados, transiciones, operaciones y elegibilidad
- Complementos posteriores: ADR-017, ADR-062 y ADR-079

## Contexto

La especificación distinguía borrador, actividad, decisiones, retiro y finalización, pero no formalizaba abandono e invalidación. También era ambiguo si `RETIRED` y `COMPLETED` representaban el mismo momento.

G3B Bloque 9 detectó una segunda ambigüedad: `MASTER_SPEC` contempla regresos
del retiro, mientras esta máquina no permite `RETIRED -> ACTIVE`. ADR-062 aclara
que el estado deportivo del jugador es ortogonal al lifecycle de Career. Esta
aclaración no añade una transición a la matriz.

## Decisión

### Estados canónicos

| Estado | Semántica |
|---|---|
| `DRAFT` | Configuración todavía no iniciada como carrera activa. |
| `ACTIVE` | Career abierta y ejecutable, sin decisión mecánica pendiente. El estado deportivo del jugador se representa por separado. |
| `WAITING_DECISION` | Ejecución interrumpida por una decisión mecánica obligatoria. |
| `RETIRED` | Etapa irreversible **FINALIZING**: el fact frontier ya está cerrado y faltan consolidación, scoring final e integrity/compatibility. No representa retiro deportivo. |
| `COMPLETED` | Carrera completamente cerrada y sin gameplay pendiente. |
| `ABANDONED` | Carrera terminada por abandono; no se reabre ni entra a ranking oficial. |
| `INVALIDATED` | Carrera preservada para auditoría, pero sin elegibilidad competitiva. |

### Flujo normal

```text
DRAFT
  -> ACTIVE
  <-> WAITING_DECISION
  -> RETIRED
  -> COMPLETED
```

### Matriz de transiciones

`—` significa transición no permitida.

| Desde \ Hacia | DRAFT | ACTIVE | WAITING_DECISION | RETIRED | COMPLETED | ABANDONED | INVALIDATED |
|---|---:|---:|---:|---:|---:|---:|---:|
| `DRAFT` | — | StartCareer | — | — | — | AbandonCareer | InvalidateCareer |
| `ACTIVE` | — | — | RequestDecision | ConfirmCareerFinalization | — | AbandonCareer | InvalidateCareer |
| `WAITING_DECISION` | — | ResolveDecision | — | ResolveWithFinalization | — | AbandonCareer | InvalidateCareer |
| `RETIRED` | — | — | — | — | CompleteCareer | AbandonCareer | InvalidateCareer |
| `COMPLETED` | — | — | — | — | — | — | InvalidateCareer |
| `ABANDONED` | — | — | — | — | — | — | — |
| `INVALIDATED` | — | — | — | — | — | — | — |

Reglas:

- `ABANDONED` puede alcanzarse desde `DRAFT`, `ACTIVE`, `WAITING_DECISION` o `RETIRED`.
- Una carrera abandonada es terminal y no se reabre.
- `INVALIDATED` es terminal.
- Una carrera `COMPLETED` puede pasar a `INVALIDATED` por un problema de integridad confirmado.
- Invalidar no borra estado, decisiones, resultados, ledger ni evidencias.
- La invalidación elimina elegibilidad competitiva y debe revocar cualquier proyección de ranking.
- `RETIRED` no permite nuevas temporadas deportivas.
- `COMPLETED` solo se alcanza después de consolidar cierre y scoring final.
- Un `RetirementOccurred` deportivo no produce por sí mismo la transición de
  Career a `RETIRED`.
- `PlayerPlayingStatus` se rige por ADR-062. Puede ser `RETIRED` mientras
  `CareerStatus` permanece `ACTIVE` o `WAITING_DECISION`.
- Un comeback cambia `PlayerPlayingStatus`, no ejecuta
  `CareerStatus.RETIRED -> ACTIVE`.
- ADR-079 resuelve el boundary: `CareerFinalizationConfirmed`, confirmado en un
  lifecycle-safe boundary con playing `RETIRED`, cierra el fact frontier y
  habilita la transición a `CareerStatus.RETIRED`/FINALIZING.
- `CareerStatus.RETIRED` debe presentarse como “finalizando”; no es alias de
  `PlayerPlayingStatus.RETIRED`.

### Operaciones permitidas por estado

| Estado | Operaciones de dominio permitidas |
|---|---|
| `DRAFT` | Editar configuración válida, validar, iniciar, abandonar, invalidar por integridad. |
| `ACTIVE` | Avanzar según el cursor aplicable, generar transición automática, solicitar decisión, procesar estado deportivo abierto, confirmar finalización según ADR-079, abandonar, invalidar. |
| `WAITING_DECISION` | Leer, resolver la decisión pendiente exacta, abandonar, invalidar. No iniciar otro advance. |
| `RETIRED` | Calcular/cerrar resultados finales, consolidar, completar, abandonar, invalidar. |
| `COMPLETED` | Consultar y producir proyecciones; invalidar mediante operación autorizada. No mutar gameplay. |
| `ABANDONED` | Consultar/auditar según retención. No reabrir, avanzar, completar ni rankear. |
| `INVALIDATED` | Consultar/auditar y ejecutar proyecciones de revocación. No reabrir ni rankear. |

Las operaciones de infraestructura como borrar por política de retención no son transiciones de gameplay y quedan fuera de esta state machine.

### Autorización e idempotencia

- Cada transición valida el estado de origen.
- Repetir una operación idempotente no duplica efectos.
- `InvalidateCareer` requiere causa, actor autorizado, evidencia y registro de auditoría.
- La UI no puede forzar estados; solicita comandos a la capa autoritativa correspondiente.

## Consecuencias

- Retiro y finalización son momentos distintos.
- Retiro deportivo reversible y `CareerStatus.RETIRED` son momentos distintos.
- El scoring final y las consolidaciones ocurren antes de `COMPLETED`.
- Abandono no puede utilizarse como pausa reanudable.
- Una carrera completada sigue auditable y puede perder elegibilidad sin ser borrada.
- `WAITING_DECISION` se integra con el cursor y checkpoints de ADR-013.
- Los efectos sobre descubrimientos y perfil de una carrera abandonada o invalidada se rigen por ADR-017.
- La cadencia posretiro, comeback y finalización irreversible queda fijada por
  ADR-079; coefficients y calibración permanecen pendientes.

## Alternativas rechazadas

### Tratar `RETIRED` y `COMPLETED` como sinónimos

Rechazada porque el cierre requiere consolidación y scoring final.

### Permitir reabrir `ABANDONED`

Rechazada porque contradice su terminalidad.

### Borrar una carrera invalidada

Rechazada porque elimina evidencia de auditoría.

### Impedir invalidar una carrera completada

Rechazada porque pueden confirmarse problemas de integridad posteriores.

### Permitir `advance` en `WAITING_DECISION`

Rechazada porque omitiría una decisión mecánica obligatoria.

### Permitir `CareerStatus.RETIRED -> ACTIVE` para un comeback

Rechazada porque convertiría una etapa irreversible de cierre en una pausa. El
comeback ocurre en `PlayerPlayingStatus` mientras la Career sigue abierta.

## Aclaración G3C-11

ADR-080 confirma que el primer retiro deportivo no congela PC. Solo el closed
fact frontier de ADR-079 permite proyectar el ledger exacto y `FINAL
ScoreSnapshot`; `COMPLETED` exige que ambos estén confirmados e íntegros.

## Pruebas requeridas

- Cada transición permitida funciona solo desde su estado de origen.
- Toda celda no permitida de la matriz se rechaza sin mutar.
- `ABANDONED` e `INVALIDATED` no se reabren.
- `COMPLETED -> INVALIDATED` conserva historial y elimina elegibilidad.
- `RETIRED` no permite avanzar temporadas.
- Un retiro deportivo reversible mantiene Career abierta y no ejecuta
  `ConfirmCareerFinalization` por sí solo.
- Comeback no modifica la matriz de `CareerStatus`.
- `COMPLETED` exige cierre y scoring final confirmados.
- `WAITING_DECISION` solo acepta la decisión pendiente y no otro advance.
- Reintentos idempotentes no duplican transición, score ni proyecciones.
- Invalidación registra causa, evidencia, actor y auditoría.
- Abandono e invalidación proyectan descubrimientos según su procedencia sin borrar evidencia.

## Referencias

- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-017: Confirmación de descubrimientos](./017-discoveries.md)
- [ADR-010: Domain Facts y ScoreLedger estructural](./010-scoring-ledger-and-domain-facts.md)
- [ADR-062: Estado deportivo, retiro y regreso](./062-playing-retirement-and-comeback.md)
- [ADR-079: Matemática de Retirement, Comeback y finalización](./079-retirement-comeback-finalization-mathematics.md)
- [ADR-080: Matemática exacta de Scoring](./080-exact-scoring-mathematics.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-016--estados-definitivos-de-career)
- [DR-069: Finalización tras retiro](../DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso) — resuelta por ADR-079
