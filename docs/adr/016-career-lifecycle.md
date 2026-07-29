# ADR-016: Ciclo de vida de Career

- Estado: Aceptado; aclarado por ADR-062
- Fecha: 2026-07-27
- Decisión relacionada: DR-016
- Alcance: estados, transiciones, operaciones y elegibilidad
- Complementos posteriores: ADR-017 y ADR-062

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
| `RETIRED` | El cierre de la actividad deportiva ya es irreversible para esa Career; faltan consolidación y scoring final. |
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
| `ACTIVE` | — | — | RequestDecision | RetireCareer | — | AbandonCareer | InvalidateCareer |
| `WAITING_DECISION` | — | ResolveDecision | — | ResolveWithRetirement | — | AbandonCareer | InvalidateCareer |
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
- El boundary que vuelve irreversible el retiro deportivo y habilita
  `RetireCareer` se define en DR-069. Hasta resolverlo no se infiere una
  política de cierre.

### Operaciones permitidas por estado

| Estado | Operaciones de dominio permitidas |
|---|---|
| `DRAFT` | Editar configuración válida, validar, iniciar, abandonar, invalidar por integridad. |
| `ACTIVE` | Avanzar según el cursor aplicable, generar transición automática, solicitar decisión, procesar estado deportivo abierto, retirar definitivamente cuando DR-069 lo autorice, abandonar, invalidar. |
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
- La cadencia posretiro, comeback y finalización irreversible queda bloqueada
  por DR-069.

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

## Pruebas requeridas

- Cada transición permitida funciona solo desde su estado de origen.
- Toda celda no permitida de la matriz se rechaza sin mutar.
- `ABANDONED` e `INVALIDATED` no se reabren.
- `COMPLETED -> INVALIDATED` conserva historial y elimina elegibilidad.
- `RETIRED` no permite avanzar temporadas.
- Un retiro deportivo reversible mantiene Career abierta y no ejecuta
  `RetireCareer` por sí solo.
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
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-016--estados-definitivos-de-career)
- [DR-069: Finalización tras retiro](../DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso)
