# ADR-003: Composición canónica de probabilidades

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-003
- Alcance: evaluación de probabilidades y modificadores
- Clarificación posterior: ADR-012

## Contexto

La especificación presentaba fórmulas parcialmente distintas para combinar una probabilidad base con modificadores. Se necesita una semántica única que sea estable para probabilidades extremas y preserve límites válidos.

## Decisión

Los modificadores se combinan sobre odds y, numéricamente, sobre log-odds.

Para una probabilidad base estrictamente comprendida entre cero y uno:

```text
oddsBase = pBase / (1 - pBase)

logOddsFinal =
logOddsBase + Σ log(modifier_i)

oddsFinal =
exp(logOddsFinal)

pFinal =
oddsFinal / (1 + oddsFinal)
```

La implementación numérica debe evaluar la transformación logística de manera estable y no necesita materializar `oddsFinal` cuando eso pueda causar overflow.

Reglas de dominio:

- los modificadores de una oportunidad posible son finitos y estrictamente positivos;
- probabilidad exactamente cero solo se permite por imposibilidad lógica o contenido mecánico explícitamente deshabilitado;
- probabilidad exactamente uno solo se permite cuando el estado determina necesariamente el resultado;
- cero y uno son estados semánticos explícitos, no resultados accidentales de underflow, overflow o redondeo;
- un modificador no puede usar cero como atajo editorial para suprimir una posibilidad;
- una preferencia de presentación sensible nunca deshabilita contenido mecánico ni produce cero;
- la composición y cada modificador aplicado deben quedar disponibles para traza de depuración.

## Consecuencias

- La probabilidad base del contenido debe declarar semántica de probabilidad, no de peso ambiguo.
- La validación debe rechazar modificadores negativos, cero, NaN o infinitos.
- Los casos `pBase = 0` y `pBase = 1` se resuelven por su causa de dominio antes de aplicar la fórmula general.
- La persistencia y las trazas deben ser compatibles con log-probabilidad/log-odds según ADR-002.
- Cambiar la fórmula requiere una nueva `engineVersion` y puede requerir una nueva versión de contenido o scoring si altera resultados comparables.

## Alternativas rechazadas

### Multiplicar probabilidades directamente y aplicar clamp

Rechazada porque puede perder estabilidad, convertir valores positivos en cero y distorsionar el efecto de modificadores cerca de los extremos.

### Sumar modificadores a la probabilidad lineal

Rechazada porque no preserva una interpretación multiplicativa consistente y exige clamps editoriales.

### Usar pesos sin conversión normativa

Rechazada porque deja indefinida la relación entre el contenido y la probabilidad final.

### Permitir modificadores cero para incompatibilidades

Rechazada. Las imposibilidades y deshabilitaciones se clasifican explícitamente mediante ADR-004.

## Pruebas requeridas

- Un modificador `1` conserva la probabilidad.
- Modificadores recíprocos aplicados en secuencia restauran la odds dentro de la tolerancia acordada.
- El orden matemático de los multiplicadores no cambia el resultado más allá de la tolerancia numérica documentada.
- Probabilidades extremas permanecen positivas y finitas cuando el resultado es posible.
- Casos semánticos de cero y uno solo aparecen con su causa válida.
- Modificadores inválidos se rechazan antes del sorteo.
- Fixtures verifican la misma salida en CLI, servidor y navegador soportado.

## Referencias

- [ADR-002: Representación de probabilidades](./002-probability-representation.md)
- [ADR-004: Semántica de oportunidades](./004-opportunity-semantics.md)
- [ADR-012: Contenido sensible y equivalencia](./012-sensitive-content-equivalence.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-003--semántica-matemática-de-la-fórmula-probabilística)
