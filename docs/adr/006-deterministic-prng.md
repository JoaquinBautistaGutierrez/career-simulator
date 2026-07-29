# ADR-006: PRNG determinista y streams derivados

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-006
- Alcance: toda aleatoriedad de gameplay

## Contexto

La carrera debe reproducirse exactamente con la misma semilla, versiones y decisiones. Un generador global secuencial haría que agregar una tirada en un subsistema desplazara todos los resultados posteriores.

También se necesita un algoritmo explícito y portable entre CLI, servidor y navegador.

## Decisión

- El PRNG de simulación es `xoshiro256**` con estado de 256 bits.
- Cada carrera tiene una root seed canónica.
- Los streams se derivan determinísticamente por subsistema y contexto mediante una función hash estable con separación de dominio.
- Agregar o consumir azar en un subsistema no modifica streams independientes.
- `Math.random()`, reloj del sistema, zona horaria y UUID están prohibidos como fuentes de azar de gameplay.
- Los IDs no deterministas de infraestructura no participan como entropía del motor.
- Se publican vectores de prueba normativos para el PRNG y la derivación de streams antes de implementar gameplay.

El contrato binario de root seed, la función estable de derivación, la separación de dominio, el endianness, el tratamiento del estado nulo y la conversión de salida a uniformes quedan fijados por ADR-051 y sus vectores. Cambiar cualquiera de esos elementos cambia `engineVersion`.

SHA-256 queda fijado por ADR-007 para hashes de integridad. Este ADR no extiende automáticamente esa decisión a la derivación de streams; la función concreta de derivación quedará identificada por el contrato y sus vectores normativos.

## Consecuencias

- `engineVersion` identifica también la versión del contrato PRNG.
- Cada sorteo debe declarar una `StreamKey` contextual estable.
- Los catálogos y entidades se recorren en orden canónico antes de construir las claves.
- Un replay no necesita reloj ni estado global externo.
- Cliente y servidor pueden compartir los mismos vectores de conformidad.
- La root seed no debe confundirse con secretos de autenticación o tokens competitivos.
- La función estable de derivación construye streams; xoshiro256** produce sus secuencias de simulación. Sus responsabilidades no se mezclan con los hashes de integridad.

## Alternativas rechazadas

### `Math.random()`

Rechazada por falta de seed y contrato reproducible.

### Reloj, UUID o entropía del dispositivo

Rechazados porque impiden replay exacto.

### Un único stream global

Rechazado porque una tirada nueva desplazaría subsistemas no relacionados.

### Usar SHA-256 directamente como generador para cada número

Rechazado como PRNG principal: la decisión adoptada usa xoshiro256** y reserva SHA-256 para derivación e integridad.

### PRNG dependiente de una librería sin vectores propios

Rechazado porque una actualización de dependencia podría cambiar resultados sin control.

## Pruebas requeridas

- Vectores conocidos del algoritmo xoshiro256** desde estados fijados.
- Vectores de root seed a estado inicial y de contexto a stream derivado.
- Misma secuencia en CLI, servidor y navegador soportado.
- Streams distintos para contextos distintos y estables para el mismo contexto.
- Consumir valores adicionales en un stream no cambia otro.
- Agregar una oportunidad en una familia no modifica streams de otras familias.
- El estado de 256 bits nunca queda en el estado nulo prohibido.
- Conversión a uniformes respeta el contrato de bits y fronteras.
- Búsqueda estática impide `Math.random()` dentro de packages del núcleo.

## Referencias

- [ADR-005: Muestreo de oportunidades](./005-event-opportunity-sampling.md)
- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [ADR-051: Contratos binarios del núcleo determinista](./051-deterministic-core-byte-contracts.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-006--prng-y-determinismo-multiplataforma)
