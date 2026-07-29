# ADR-007: Canonicalización, aritmética y hashes

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-007
- Alcance: integridad, replay, snapshots, ledger y catálogos

## Contexto

Los hashes de integridad solo son reproducibles si todas las plataformas producen exactamente la misma secuencia de bytes. El orden incidental de propiedades, resultados SQL o maps no puede formar parte de la verdad de la simulación.

El dominio también debe evitar floating point en cantidades naturalmente enteras.

## Decisión

- Las estructuras JSON que participan en hashes se serializan de forma canónica compatible con RFC 8785.
- SHA-256 es el algoritmo de hash de integridad.
- El hash se calcula sobre los bytes UTF-8 de la representación canónica.
- Todo dato hasheado debe ser compatible con el dominio JSON canónico; NaN e infinitos son inválidos.
- El orden semántico de arrays debe definirse por dominio antes de canonicalizar. La canonicalización de propiedades no corrige arrays en orden no determinista.
- Se evitan números floating point cuando el dominio permite enteros:
  - dinero en unidades monetarias enteras;
  - seguidores enteros;
  - score entero;
  - contadores enteros.
- Probabilidades y cálculos estadísticos pueden utilizar double y log-space conforme a ADR-002 y ADR-003.
- Cada clase de hash utiliza separación de dominio o un envelope tipado/versionado para impedir que bytes equivalentes de objetos distintos se interpreten como el mismo artefacto.

## Artefactos que requieren canonicalización

- estado y checkpoints de Career;
- decisiones ordenadas;
- `SeasonResult`;
- entradas y snapshots de ScoreLedger;
- releases de contenido;
- snapshots de datos;
- configuración y `VersionSet`;
- payloads de replay;
- modelos verificables de compartido cuando incluyan integridad oficial.

## Consecuencias

- Los objetos del dominio deben convertirse a DTO canónicos explícitos antes de hashear.
- Timestamps, IDs de infraestructura, locale y campos de presentación no se incluyen salvo que el contrato del artefacto los declare.
- Consultas DB, maps y catálogos deben ordenarse por claves estables antes de formar arrays.
- El formato de dinero no utiliza float binario.
- El score visible se deriva de enteros del ledger.
- Cambiar el DTO canónico o su versión cambia el hash y debe gestionarse mediante versión/migración explícita.
- SHA-256 detecta corrupción o manipulación; no sustituye autorización ni validación server-side.

## Alternativas rechazadas

### `JSON.stringify` sin contrato canónico

Rechazada porque el resultado puede depender de construcción y orden incidental.

### Hashear snapshots binarios específicos del runtime

Rechazado por falta de portabilidad y auditabilidad.

### Usar floats para dinero, seguidores o score

Rechazado por errores de redondeo innecesarios en dominios enteros.

### Usar hashes no criptográficos para integridad oficial

Rechazado porque no ofrecen las propiedades esperadas para detección de manipulación.

### Ordenar arrays genéricamente durante la canonicalización

Rechazado porque algunos arrays tienen orden semántico, como decisiones o ledger. El dominio debe definir el orden correcto.

## Pruebas requeridas

- Fixtures canónicos producen exactamente los mismos bytes y SHA-256 en todos los runtimes soportados.
- Reordenar propiedades de objetos no cambia el hash.
- Reordenar una secuencia semántica sí cambia el hash.
- Resultados SQL o maps en distinto orden incidental se normalizan antes de formar arrays.
- NaN, infinitos y tipos no JSON se rechazan.
- Dinero, seguidores, score y contadores realizan round-trip como enteros.
- Cambiar una decisión, versión, entrada de ledger o dato relevante cambia el hash.
- Fixtures cubren Unicode, escapes, números de frontera y objetos anidados conforme a RFC 8785.

## Referencias

- [ADR-002: Representación de probabilidades](./002-probability-representation.md)
- [ADR-006: PRNG determinista](./006-deterministic-prng.md)
- [ADR-051: Contratos binarios del núcleo determinista](./051-deterministic-core-byte-contracts.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-007--canonicalización-aritmética-y-hashes)
