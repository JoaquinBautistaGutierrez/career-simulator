# ADR-051: Contratos binarios del núcleo determinista

- Estado: Aceptado
- Fecha: 2026-07-27
- Alcance: RootSeed, xoshiro256**, streams, uniformes, canonicalización, hashes y golden vectors de G2

## Contexto

ADR-006 fija xoshiro256**, root seed y streams aislados, pero deja expresamente para los vectores normativos el contrato binario, endianness, separación de dominio y conversión a uniformes. ADR-007 fija RFC 8785 y SHA-256, pero la implementación necesita un único comportamiento explícito ante valores no representables.

Estas elecciones cambian replay aunque no cambie ninguna regla de gameplay. Deben quedar congeladas antes de que el motor consuma azar.

## Decisión

### RootSeed y estado inicial

- La representación externa de `RootSeed` contiene exactamente 64 caracteres `[0-9a-f]`.
- No se aceptan prefijos, mayúsculas, whitespace ni coerciones.
- No existe una normalización permisiva: parsear valida la forma canónica y serializar bytes siempre produce lowercase.
- El valor de 32 bytes se interpreta como cuatro palabras `uint64` consecutivas en big-endian.
- La seed que codifica cuatro palabras cero se rechaza porque es el estado nulo prohibido de xoshiro256**.

### xoshiro256** y uniformes

- Se implementa xoshiro256** 1.0 con operaciones exactas módulo `2^64`.
- `nextUint64()` devuelve el output `rotl(s[1] * 5, 7) * 9` antes de aplicar la transición de estado.
- `nextFloat01()` toma los 53 bits superiores del siguiente `uint64`:

```text
uniform = Number(nextUint64() >> 11) / 2^53
```

- El rango resultante es `[0, 1)`.
- Cada llamada a `nextFloat01()` consume exactamente una salida `uint64`.
- Imposibilidad y certeza explícitas pueden resolverse sin consumir una salida.

### Derivación de streams

Cada stream se deriva con:

```text
SHA-256(
  UTF8("career-simulator/xoshiro256-star-star/stream/v1\0")
  || rootSeedBytes
  || UTF8(JCS({ "context": context, "namespace": namespace }))
)
```

El digest de 32 bytes se interpreta como cuatro `uint64` big-endian. El namespace es explícito, no vacío, sin whitespace exterior ni NUL. `context` debe ser representable por la API canónica JSON.

Un digest completamente cero se rechaza explícitamente. No se introduce fallback silencioso, otra función ni entropía externa.

### Canonicalización y SHA-256

- Existe una sola API interna compatible con RFC 8785.
- Objetos se ordenan recursivamente por unidades UTF-16; arrays preservan su orden.
- Números usan serialización ECMAScript de double; `-0` se serializa como `0`.
- Strings preservan Unicode sin normalización y rechazan surrogates no emparejados.
- Se rechazan NaN, infinitos, bigint, undefined, symbol, funciones, objetos no planos, accessors, propiedades no enumerables, arrays sparse/custom y ciclos.
- SHA-256 se calcula sobre bytes UTF-8 canónicos.
- `@noble/hashes` queda encapsulado dentro de `packages/probability`; ningún consumidor depende directamente de esa implementación.

### Golden vectors

Los fixtures con sufijo `V1` son contrato para:

- xoshiro256** `uint64`;
- uniformes double;
- seed derivada y outputs de streams;
- conversiones de probabilidad;
- canonicalización y SHA-256;
- lifecycle;
- orden de `SimulationCursor`;
- checkpoints y replay estructural.

Cambiar un vector exige justificar compatibilidad y modificar `engineVersion` u otra versión participante cuando cambie replay.

## Consecuencias

- Root seed, contexto y versión bastan para reconstruir streams sin reloj ni estado global.
- El orden de propiedades del contexto no cambia el stream; el namespace sí.
- Agregar consumos a un stream no desplaza otro.
- Los estados probabilísticos extremos permanecen en log-space cuando convertirlos a double produciría accidentalmente cero o uno.
- La dependencia criptográfica es reemplazable detrás de los mismos golden vectors.
- `fast-check` se usa solo como dependencia de desarrollo para propiedades; no participa en runtime ni replay.

## Alternativas rechazadas

### Usar little-endian o endianness del host

Rechazada porque produciría contratos distintos o implícitos entre runtimes.

### Usar todos los 64 bits para dividir por `2^64`

Rechazada porque la conversión intermedia a double no representa exactamente 64 bits. El contrato de 53 bits coincide con la precisión del significando.

### Concatenar strings de contexto sin canonicalización ni dominio

Rechazada por ambigüedad, colisiones de representación y dependencia del orden incidental.

### Corregir automáticamente seeds o namespaces

Rechazada porque ocultaría inputs ambiguos y dificultaría replay/auditoría.

### Usar la API criptográfica de una plataforma concreta

Rechazada para el núcleo compartido porque obligaría a una API asíncrona o específica de Node. La dependencia elegida es pequeña, portable y queda encapsulada.

## Pruebas requeridas

- Vectores exactos de `uint64` y uniformes.
- Round-trip RootSeed ↔ 32 bytes.
- Rechazo de seed nula y formatos ambiguos.
- Misma seed/contexto produce la misma seed derivada y secuencia.
- Namespaces distintos producen streams distintos.
- Consumir o agregar tiradas en un stream no cambia otro.
- Fixtures RFC 8785 y SHA-256 conocidos.
- Rechazo explícito de todo valor no canónico.
- Conversiones y composición no generan NaN ni fronteras accidentales.
- Golden replay y checkpoints estables.

## Referencias

- [ADR-002: Representación de probabilidades](./002-probability-representation.md)
- [ADR-003: Composición de probabilidades](./003-probability-composition.md)
- [ADR-006: PRNG determinista](./006-deterministic-prng.md)
- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-050: Límites de packages](./050-foundation-package-boundaries.md)
