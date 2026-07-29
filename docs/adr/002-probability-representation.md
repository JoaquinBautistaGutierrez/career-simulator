# ADR-002: Representación de probabilidades

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-002
- Alcance: núcleo numérico, schemas, persistencia y trazas

## Contexto

La especificación combina probabilidades ordinarias con eventos extremadamente improbables. Persistir siempre seis decimales convertiría valores positivos pequeños en cero y violaría el principio de probabilidad total.

El dominio también necesita evitar inestabilidad y underflow al multiplicar numerosos modificadores.

## Decisión

- Se utiliza IEEE-754 double cuando su rango y precisión sean adecuados.
- Los cálculos que combinan probabilidades extremas se realizan en representación logarítmica.
- La persistencia de probabilidades mecánicas debe soportar log-probabilidad.
- No existe un mínimo editorial de probabilidad.
- Un valor positivo no puede redondearse accidentalmente a cero.
- El valor cero queda reservado a imposibilidad lógica o contenido explícitamente deshabilitado, según ADR-003 y ADR-004.
- Los valores destinados exclusivamente a presentación pueden redondearse sin modificar ni reemplazar el valor mecánico.

La representación persistida debe identificar inequívocamente si un valor está expresado como probabilidad, odds, log-probabilidad o log-odds. No se aceptan números sin semántica de representación.

## Consecuencias

- Los schemas deberán distinguir valores mecánicos de valores mostrados.
- Las trazas conservarán suficiente información para reconstruir el cálculo sin usar el porcentaje redondeado de UI.
- Las operaciones con productos de muchos factores deberán evitar conversiones repetidas innecesarias fuera del espacio logarítmico.
- Los catálogos no podrán usar un valor redondeado a cero para representar “muy raro”.
- NaN, infinitos no semánticos y valores fuera del dominio serán errores de validación.
- El runtime podrá usar double para estadísticas, siempre sujeto a canonicalización y pruebas multiplataforma del ADR-007.

## Alternativas rechazadas

### Persistir todas las probabilidades con seis decimales

Rechazada porque destruye probabilidades extremas positivas.

### Aplicar una probabilidad mínima de diseño

Rechazada porque introduciría un piso editorial y deformaría las rarezas.

### Usar únicamente probabilidad lineal

Rechazada por underflow y pérdida de estabilidad en productos extensos.

### Usar exclusivamente aritmética decimal arbitraria

Rechazada como requisito universal: añade complejidad innecesaria donde double es suficiente. Podrá reevaluarse para un caso concreto mediante otro ADR.

## Pruebas requeridas

- Valores positivos menores que `10^-12` sobreviven serialización, persistencia y restauración sin convertirse en cero.
- Productos extensos calculados en log-space no producen underflow accidental.
- Conversión entre representaciones mantiene el error dentro de la tolerancia numérica documentada.
- Cero solo se acepta acompañado por una causa de dominio válida.
- NaN, infinitos inválidos y probabilidades fuera de `[0,1]` se rechazan.
- El valor mecánico no cambia al formatearlo para UI.
- Fixtures de frontera cubren probabilidades cercanas a cero y a uno.

## Referencias

- [ADR-003: Composición de probabilidades](./003-probability-composition.md)
- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-002--representación-y-precisión-de-probabilidades)

