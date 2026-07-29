# ADR-005: Muestreo de oportunidades de eventos

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-005
- Alcance: evaluación de eventos y aplicación secuencial de consecuencias
- Enmienda posterior: ADR-043

## Contexto

La simulación debe permitir cero, uno o múltiples eventos por temporada, incluso concentraciones extraordinarias. Un algoritmo de “elegir un ganador” o un cupo fijo introduciría un máximo artificial.

Al mismo tiempo, las consecuencias de un evento pueden cambiar el estado y, con ello, las probabilidades de oportunidades posteriores.

## Decisión

- No existe un máximo artificial de eventos por temporada.
- Las oportunidades se evalúan por ventanas causales y familias mediante sorteos propios.
- Una ventana o familia puede producir cero, uno o múltiples eventos.
- Cada oportunidad creada dentro de su fase/familia se resuelve con un stream determinístico asociado a su contexto.
- Después de cada evento ocurrido se aplican completamente sus consecuencias antes de continuar evaluando oportunidades posteriores.
- Las oportunidades posteriores observan el estado actualizado y recalculan clasificación, modificadores y probabilidad cuando corresponda.
- El orden de ventanas, familias y oportunidades debe ser explícito, estable y versionado.
- El muestreo no utiliza cooldowns, cupos, protección de rareza ni compensación por eventos anteriores.

Las ventanas y sus puntos de ejecución se definen en ADR-043. La evaluación secuencial no convierte el catálogo en un único sorteo mutuamente excluyente. La exclusión solo puede surgir del estado actualizado, de una imposibilidad lógica o de contenido mecánico deshabilitado.

## Consecuencias

- El orden de evaluación forma parte del contrato determinista y de `engineVersion`.
- Cada oportunidad necesita un identificador contextual estable.
- Cada evaluación queda ligada a una `OpportunityWindow` y, cuando corresponda, a Q1–Q4.
- Aplicar consecuencias debe ser atómico antes de la próxima evaluación.
- Una consecuencia puede volver posible, improbable o imposible una oportunidad posterior.
- La cantidad observada de eventos emerge de probabilidades y estado, no de una cuota.
- La UI puede agrupar ocurrencias para presentación sin cambiar el resultado interno.
- Las simulaciones masivas deberán medir tanto frecuencias individuales como concentraciones y correlaciones.

## Alternativas rechazadas

### Máximo de eventos por temporada

Rechazada porque contradice la especificación normativa.

### Elegir un único evento ponderado por fase

Rechazada como regla universal porque impide múltiples ocurrencias compatibles.

### Evaluar todas las probabilidades sobre un snapshot inicial y aplicar efectos al final

Rechazada porque ignora que cada consecuencia modifica oportunidades futuras.

### Aumentar o reducir probabilidades para compensar temporadas extrañas

Rechazada porque constituye protección artificial de rareza.

## Pruebas requeridas

- Existen seeds reproducibles con cero, uno y múltiples eventos en una temporada.
- No hay una constante, schema o validador que imponga máximo por temporada o carrera.
- Las consecuencias de un evento modifican correctamente la evaluación de oportunidades posteriores.
- Cambiar el orden del catálogo sin cambiar el orden canónico no altera resultados.
- Cambiar deliberadamente el orden normativo exige nueva `engineVersion` y actualiza golden fixtures.
- Streams independientes no cambian al agregar una oportunidad a otra familia.
- Monte Carlo compara frecuencias, coocurrencias y colas con las probabilidades calculadas.
- Repetir la misma entrada produce la misma secuencia y los mismos hashes.

## Referencias

- [ADR-004: Semántica de oportunidades](./004-opportunity-semantics.md)
- [ADR-006: PRNG determinista](./006-deterministic-prng.md)
- [ADR-043: Ventanas causales de oportunidades](./043-event-opportunity-windows.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-005--muestreo-y-concurrencia-de-oportunidades)
