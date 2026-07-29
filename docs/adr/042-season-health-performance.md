# ADR-042: Causalidad entre disponibilidad, rendimiento y salud

- Estado: Aceptado; contrato de Health aclarado por ADR-057
- Fecha: 2026-07-27
- Decisión relacionada: DR-042
- Alcance: pipeline de temporada, estadísticas, salud y SimulationCursor
- Enmienda: ADR-013

## Contexto

El pipeline plano de ADR-013 ubicaba `PERFORMANCE` antes de `HEALTH`, mientras que lesiones, recaídas, suspensiones y disponibilidad deben afectar minutos y producción futura sin reescribir estadísticas ya cerradas.

Se necesita causalidad temporal agregada sin simular partidos individuales.

## Decisión

La temporada puede subdividirse internamente en cuatro ventanas agregadas:

```text
Q1
Q2
Q3
Q4
```

No representan partidos, jornadas ni fechas reales. Son unidades técnicas ordenadas para resolver causalidad dentro de una temporada.

### Preparación anterior a producción

Antes de la primera producción estadística se determinan:

1. disponibilidad inicial;
2. estado físico;
3. suspensiones vigentes;
4. rol esperado;
5. minutos potenciales.

`ROLE_AND_MINUTES` fija el contexto inicial y el potencial de temporada. No confirma por anticipado minutos ni estadísticas de Q1–Q4.

### Orden de cada ventana

Para cada ventana, en orden Q1 a Q4:

1. `AVAILABILITY`: calcula disponibilidad efectiva de la ventana a partir del estado confirmado.
2. `PRODUCTION`: resuelve minutos efectivos y producción agregada de la ventana.
3. `HEALTH`: evalúa salud, lesiones, recuperación y recaídas correspondientes a la ventana.
4. `CONSEQUENCES`: aplica atómicamente sus consecuencias antes de la siguiente ventana.

Las fórmulas y distribuciones exactas siguen en DR-008.

### Regla temporal

- Una lesión ocurrida en Q2 no modifica minutos ni estadísticas ya confirmados de Q1 o Q2.
- Sus consecuencias pueden reducir disponibilidad, minutos y producción de Q3 y Q4.
- Una condición preexistente al inicio de una ventana sí participa de `AVAILABILITY` para esa ventana.
- Ninguna consolidación de fin de temporada reescribe producción cerrada.
- Minutos y estadísticas de temporada se agregan desde los resultados confirmados de sus cuatro ventanas.

La antigua secuencia conceptual `PERFORMANCE -> HEALTH` queda reemplazada por la secuencia por ventana. No existe una tirada global de lesión al final con efecto retroactivo.

### SimulationCursor

El cursor identifica como mínimo:

- `seasonId`;
- `seasonWindow`: `Q1`, `Q2`, `Q3`, `Q4` o ausencia fuera del ciclo;
- `step`: `AVAILABILITY`, `PRODUCTION`, `HEALTH` o `CONSEQUENCES`, además de los pasos externos;
- `operationKey` estable;
- `operationIndex`;
- `resumeAfterOperationKey`;
- progreso de streams necesario.

Un `operationKey` incluye ventana, paso, subsistema y entidad/oportunidad relevante. No se deriva de la posición incidental de un array.

Una decisión obligatoria puede interrumpir cualquier paso. El checkpoint conserva acumuladores cerrados y el próximo trabajo; reanudar no recalcula una ventana ni vuelve a consumir tiradas confirmadas.

### Atomicidad

- Cada operación del paso se confirma completa o no se confirma.
- `PRODUCTION(Qn)` se cierra antes de evaluar `HEALTH(Qn)`.
- `CONSEQUENCES(Qn)` debe confirmarse antes de `AVAILABILITY(Qn+1)`.
- Una temporada sigue abierta hasta `SEASON_CLOSE`.

## Consecuencias

- `SeasonState` necesita acumuladores por ventana y totales derivados.
- `SeasonResult` conserva totales y evidencia suficiente de ventanas para replay.
- Agregar o quitar ventanas, o cambiar su orden, modifica resultados y requiere nueva `engineVersion`.
- Los eventos de oportunidad se insertan en puntos definidos por ADR-043 sin romper el orden interno de cada ventana.
- El modelo mantiene simulación agregada y no introduce partidos individuales.

## Alternativas rechazadas

### Resolver todas las lesiones al final y restar estadísticas

Rechazada porque modifica retroactivamente hechos cerrados.

### Sortear la temporada completa sobre disponibilidad inicial

Rechazada porque una lesión intermedia no podría afectar tramos posteriores.

### Simular partidos individuales

Rechazada porque excede el nivel agregado aceptado.

### Repetir una ventana después de una decisión

Rechazada porque duplica azar y efectos.

## Pruebas requeridas

- Q1 a Q4 siempre se procesan en orden.
- Una lesión en Q2 puede afectar Q3/Q4, nunca Q1/Q2 cerrados.
- Una lesión o suspensión preexistente reduce la disponibilidad de la primera ventana aplicable.
- Cero disponibilidad implica cero minutos y producción participativa en esa ventana.
- Totales de temporada equivalen a la suma canónica de ventanas.
- Interrupción y reanudación en cada paso no repiten tiradas ni efectos.
- No existe una operación de fin de temporada que reescriba estadísticas cerradas.
- Cambiar la cadencia visual no cambia ventanas, cursor ni resultados.

## Gate

La causalidad y el pipeline quedan cerrados. Las fórmulas de disponibilidad, minutos, producción, lesión, recuperación y recaída siguen bloqueadas por DR-008.

## Referencias

- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-043: Ventanas de oportunidades](./043-event-opportunity-windows.md)
- [ADR-057: Salud, lesiones y recuperación](./057-health-injury-recovery-model.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-042--relación-performance--health--minutos)
- [DR-008: Fórmulas faltantes](../DECISIONS_REQUIRED.md#dr-008--fórmulas-faltantes-del-simulador)
