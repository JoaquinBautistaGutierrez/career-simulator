# ADR-044: Posición efectiva, reconversión y cohortes

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-044
- Alcance: Player, temporadas, estadísticas, premios y rankings
- Enmienda: ADR-011

## Contexto

`primaryPosition` y `secondaryPositions` describen identidad y compatibilidad, pero no qué posición se utilizó realmente en un tramo de juego. Las reconversiones y temporadas mixtas requieren historial sin reescribir estadísticas pasadas.

## Decisión

Se distinguen tres conceptos:

| Campo | Semántica |
|---|---|
| `primaryPosition` | Identidad futbolística principal actual. |
| `secondaryPositions` | Posiciones actualmente compatibles. |
| `effectivePosition` | Posición realmente utilizada en una temporada o ventana. |

Todos utilizan los `PositionCode` de ADR-011.

### Uso efectivo e historial

Cada ventana con minutos confirmados registra una única `effectivePosition` y sus `effectiveMinutes`. Las estadísticas y fórmulas posicionales de esa ventana usan principalmente `effectivePosition`.

- Cambiar luego la primaria no reetiqueta estadísticas históricas.
- Los agregados conservan minutos y producción por posición efectiva.
- Una ventana sin minutos no aporta peso a una cohorte posicional.
- `effectivePosition` debe ser la primaria o una secundaria compatible al comenzar la producción de la ventana.
- Una transición de reconversión debe actualizar compatibilidad antes de usar una posición nueva.

### Reconversión

`primaryPosition` solo cambia mediante un proceso de reconversión confirmado y trazable. Su probabilidad puede derivarse de:

- edad;
- atributos;
- entrenador;
- contexto táctico;
- pérdida o ganancia de capacidades;
- necesidad del club;
- decisiones.

No se cambian posiciones arbitrariamente, por edición narrativa ni para equilibrar rankings.

Una reconversión registra:

- posición anterior y nueva;
- temporada/ventana efectiva;
- causa y hechos autorizados;
- versiones;
- efecto sobre `secondaryPositions`;
- entrada de historial.

Las fórmulas, probabilidades, tiempos y matriz de compatibilidad siguen en DR-008 o en el catálogo versionado que esa especificación determine.

### Posición dominante por scope

Para un scope cerrado —una temporada, un período de premio o toda la carrera—, la posición dominante se deriva del historial de temporadas y minutos por `effectivePosition`.

El cálculo debe:

- usar únicamente ventanas cerradas del scope;
- ponderar uso efectivo, no identidad inicial ni secundarias sin minutos;
- devolver una única `PositionCode` cuando sea necesario asignar cohorte;
- conservar el desglose que explica el resultado;
- quedar ligado a la versión competitiva correspondiente.

La especificación no fija cómo ponderar temporadas frente a minutos ni cómo resolver empates exactos. Esos puntos quedan registrados en DR-049 y no se resuelven por inferencia.

Si el scope no contiene minutos efectivos, no existe posición dominante competitiva. `primaryPosition` puede mostrarse como identidad, pero no crea participación ni elegibilidad posicional.

### Rankings

- Un ranking por posición usa la posición histórica dominante del scope declarado una vez que el cálculo de DR-049 esté cerrado.
- Un ranking por grupo deriva `PositionGroup` de esa posición dominante.
- Una Career no se publica simultáneamente en varias cohortes posicionales para el mismo scope.
- El ranking conserva el scope y la regla/versiones utilizadas.

Para ranking de carrera, el scope inicial es toda la actividad deportiva cerrada. Otros scopes deben declararse explícitamente.

### Premios

Cada premio versionado declara uno de estos contratos:

- `POSITION_SPECIFIC`: compara la posición dominante dentro de su período de elegibilidad con sus posiciones admitidas;
- `POSITION_GROUP`: deriva el grupo de esa posición dominante;
- `POSITION_AGNOSTIC`: no filtra por posición.

`secondaryPositions` por sí solas no otorgan elegibilidad. Una reconversión posterior no modifica premios ya resueltos. Premios de períodos mixtos usan el historial efectivo dentro de ese período, no la posición al final de la carrera. Hasta cerrar DR-049, no se inventa una resolución para scopes empatados.

## Consecuencias

- SeasonState y SeasonResult conservan uso posicional por ventana.
- Player necesita historial de cambios de primaria y secundarias.
- Scoring y rankings reciben una posición dominante derivada, no un campo editable.
- Premios deben declarar tipo de elegibilidad y período.
- La fórmula/desempate de dominancia debe cerrarse antes de rankings o premios posicionales definitivos.
- La expansión posicional del vertical slice debe decidir si admite reconversiones fuera de `GK`, `CM` y `ST`.
- Cambiar reglas de dominancia o atribución altera resultados comparables y exige versiones participantes.

## Alternativas rechazadas

### Usar siempre `primaryPosition`

Rechazada porque ignora el uso real.

### Cambiar estadísticas históricas al reconvertir

Rechazada porque reescribe hechos cerrados.

### Incluir todas las secundarias en premios

Rechazada porque compatibilidad no equivale a participación.

### Permitir múltiples cohortes simultáneas

Rechazada para el mismo scope porque duplica comparación posicional.

### Cambiar posición editorialmente

Rechazada porque la reconversión debe ser causal y probabilística.

## Pruebas requeridas

- Cada ventana con minutos registra exactamente una posición efectiva válida.
- El cálculo futuro usa solo historial efectivo del scope y produce una traza explicable.
- Fixtures futuros cubren empates y ponderación según DR-049.
- Una ventana sin minutos no altera la posición dominante.
- Una reconversión no reetiqueta estadísticas ni premios anteriores.
- `secondaryPositions` sin minutos no otorga elegibilidad.
- Rankings por grupo derivan el grupo correcto de la dominante.
- Premios mixtos usan únicamente su período declarado.
- Una posición nueva no se usa antes de confirmar compatibilidad/reconversión.

## Gate

El modelo posicional y la fuente canónica para cohortes/premios quedan cerrados. Las probabilidades y parámetros de reconversión siguen en DR-008; el alcance fuera de las tres posiciones del slice sigue en DR-048; ponderación y empates de dominancia siguen en DR-049.

## Referencias

- [ADR-011: Taxonomía de posiciones](./011-position-taxonomy.md)
- [ADR-042: Ventanas de temporada](./042-season-health-performance.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-044--posición-efectiva-y-reconversión)
- [DR-008: Fórmulas faltantes](../DECISIONS_REQUIRED.md#dr-008--fórmulas-faltantes-del-simulador)
- [DR-048: Alcance posicional del slice](../DECISIONS_REQUIRED.md#dr-048--reconversiones-fuera-del-alcance-posicional-del-vertical-slice)
- [DR-049: Posición dominante](../DECISIONS_REQUIRED.md#dr-049--ponderación-y-empates-de-posición-dominante)
