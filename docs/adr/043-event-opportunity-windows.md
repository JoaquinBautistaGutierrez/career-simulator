# ADR-043: Ventanas causales de oportunidades

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-043
- Alcance: eventos, pipeline, facts disponibles y replay
- Enmienda: ADR-005, ADR-013 y ADR-014

## Contexto

Una fase universal `EVENT_OPPORTUNITIES` anterior a mercado, premios y actualización del mundo no puede evaluar correctamente contenido que depende de hechos producidos después. Las oportunidades deben ejecutarse solo cuando sus inputs de dominio ya existen.

## Decisión

`EVENT_OPPORTUNITIES` deja de ser una fase universal. Se definen estas ventanas canónicas:

```text
PRESEASON_EVENTS
PERFORMANCE_EVENTS
HEALTH_EVENTS
COMPETITION_EVENTS
MARKET_EVENTS
AWARD_EVENTS
WORLD_EVENTS
POSTSEASON_EVENTS
```

### Puntos de ejecución

El plan inicial de temporada es:

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

Las ventanas Q1–Q4 son agregadas y no representan partidos.

`PERFORMANCE_EVENTS(Qn)` y `HEALTH_EVENTS(Qn)` se ejecutan después de confirmar las consecuencias mecánicas de Qn y antes de Qn+1. Ambas observan los hechos ya confirmados de Qn; el orden canónico entre ellas es el mostrado. Sus consecuencias se aplican secuencialmente antes de avanzar.

`POSTSEASON_EVENTS` ocurre después de `WORLD_EVENTS` y antes de cerrar la temporada, por lo que puede observar todos los hechos confirmados de esa temporada.

### Disponibilidad de hechos

Cada path/fact del catálogo tipado declara el primer punto del pipeline en el que está disponible. Cada `EventDefinition` declara las ventanas donde puede evaluarse y los hechos requeridos.

El compilador rechaza:

- una ventana anterior a cualquiera de sus hechos requeridos;
- un path cuyo momento de disponibilidad desconoce;
- dependencias futuras o circulares;
- una oportunidad sin identidad contextual estable.

Un valor opcional ausente después de su punto de producción es distinto de un hecho todavía no producido.

Ejemplo: una condición que requiere `AwardWon` solo puede evaluarse en `AWARD_EVENTS`, `WORLD_EVENTS` o `POSTSEASON_EVENTS`, según el contrato concreto; nunca antes de `AWARDS`.

### Cantidad y orden

- Cada ventana puede producir cero, una o múltiples oportunidades.
- No existe un máximo por ventana, temporada o carrera.
- Familias y oportunidades se evalúan en orden canónico versionado.
- Después de cada evento se aplican consecuencias antes de la siguiente oportunidad.
- Habilitar varias ventanas no implica un cupo compartido.

### Idempotencia de evaluación

Cada intento de oportunidad usa una clave conceptual:

```text
OpportunityEvaluationKey =
careerId + seasonId + opportunityWindow + seasonWindow? +
eventDefinitionId + contextId
```

La clave identifica un punto de evaluación, no limita ocurrencias futuras. Una misma definición solo se reevalúa en otra ventana o contexto si el contenido compilado lo declara explícitamente.

El checkpoint conserva la ventana, Q opcional, familia, oportunidad y próximo `operationKey`. Reanudar no vuelve a evaluar una clave confirmada.

## Consecuencias

- `OpportunityWindow` forma parte del contrato del contenido y de `engineVersion`.
- `SimulationCursor` debe representar ventanas de oportunidad además de pasos de salud/rendimiento.
- ADR-013 conserva sus reglas de interrupción y atomicidad, pero su lista plana de fases queda sustituida por este plan junto con ADR-042.
- El DSL necesita metadatos de disponibilidad de paths/facts.
- Un premio puede habilitar contenido de la misma temporada sin evaluación retroactiva.

## Alternativas rechazadas

### Mantener una única fase y diferir todo al año siguiente

Rechazada porque impide contenido causal de postemporada ya solicitado.

### Evaluar todas las oportunidades al inicio

Rechazada porque algunos hechos todavía no existen.

### Ejecutar una segunda pasada universal sin identidad

Rechazada porque puede duplicar oportunidades.

### Limitar eventos por ventana

Rechazada porque introduce una restricción artificial.

## Pruebas requeridas

- Un evento dependiente de premio nunca se evalúa antes de `AWARD_EVENTS`.
- Cada path requerido está disponible en la ventana aceptada.
- El compilador rechaza dependencias futuras y paths sin disponibilidad.
- Existen seeds con cero, uno y múltiples eventos por ventana.
- Consecuencias de una oportunidad modifican las posteriores.
- Interrupción y reanudación no duplican `OpportunityEvaluationKey`.
- Las ventanas Q1–Q4 se distinguen sin simular partidos.
- Cambiar orden o punto de una ventana requiere nueva `engineVersion` y actualiza golden replays.

## Gate

Las ventanas y su orden quedan cerrados. El catálogo concreto de eventos todavía debe declarar sus hechos requeridos y pasar validación antes de publicarse.

## Referencias

- [ADR-005: Muestreo de oportunidades](./005-event-opportunity-sampling.md)
- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-014: DSL de eventos](./014-event-dsl.md)
- [ADR-042: Salud y rendimiento](./042-season-health-performance.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-043--ventanas-de-eventos-posteriores)
