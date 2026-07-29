# ADR-011: Taxonomía canónica de posiciones

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-011
- Alcance: dominio, schemas, estadísticas, premios, rankings y contenido
- Enmienda posterior: ADR-044

## Contexto

La especificación mezclaba posiciones específicas (`LW`, arquero, lateral, etc.) con grupos agregados (`GK`, `DEF`, `MID`, `FWD`). Esa mezcla hacía ambiguos los contratos de Player, premios, estadísticas y rankings.

Se necesita una taxonomía canónica que preserve la posición futbolística específica y permita derivar agrupaciones sin convertirlas en el dato primario.

## Decisión

### Posiciones primarias canónicas

`PositionCode` admite exactamente:

```text
GK
RB
CB
LB
RWB
LWB
CDM
CM
CAM
RM
LM
RW
LW
ST
CF
```

Cada jugador posee:

- `primaryPosition` obligatoria;
- `secondaryPositions` opcionales.

`primaryPosition` y cada elemento de `secondaryPositions` utilizan `PositionCode`. Las posiciones secundarias no pueden contener duplicados ni repetir la primaria.

### Grupos derivados

| `PositionGroup` | Posiciones canónicas |
|---|---|
| `GK` | `GK` |
| `DEF` | `RB`, `CB`, `LB`, `RWB`, `LWB` |
| `MID` | `CDM`, `CM`, `CAM`, `RM`, `LM` |
| `FWD` | `RW`, `LW`, `ST`, `CF` |

La función conceptual `positionGroup(position)` es total y determinística para todo `PositionCode`.

La posición específica es el dato canónico. Los grupos son proyecciones derivadas para:

- rankings agregados;
- categorías agregadas de premios;
- familias estadísticas;
- reglas que explícitamente operen por grupo.

Los grupos no se almacenan como una segunda verdad editable dentro de Player.

### Compatibilidad de rankings y premios

- Un ranking específico utiliza `PositionCode`.
- Un ranking agregado utiliza `PositionGroup`, obtenido a partir de la posición canónica que su contrato declare.
- Una categoría de premio específica declara posiciones canónicas elegibles.
- Una categoría agregada declara grupos elegibles y el compilador expande esos grupos al conjunto canónico correspondiente.
- Un catálogo no puede guardar `GK`, `DEF`, `MID` o `FWD` dentro de un campo llamado `eligiblePositions`; debe distinguir posiciones de grupos.
- La pertenencia de cada premio concreto a una categoría sigue siendo dato versionado del catálogo.

No se asume compatibilidad mecánica implícita entre dos posiciones específicas. ADR-044 define el uso de `effectivePosition`, la historia posicional y las cohortes; la matriz y las probabilidades concretas de reconversión deben declararse y versionarse por separado.

## Consecuencias

- Player conserva precisión posicional sin duplicar grupos.
- Schemas, fixtures y catálogos deben usar códigos exactos y case-sensitive.
- El ejemplo antiguo de Award que guardaba grupos en `eligiblePositions` requiere migración de contrato.
- Estadísticas y scoring pueden agrupar sin perder la posición específica de origen.
- Rankings y premios deben declarar si operan por posición o por grupo.
- La posición efectiva usada por ventana, reconversiones y pertenencia histórica a rankings se rige por ADR-044.

## Alternativas rechazadas

### Guardar solo cuatro grupos

Rechazada porque elimina información necesaria para estadísticas, eventos y compatibilidad posicional.

### Guardar grupo y posición como campos editables independientes

Rechazada porque permite estados contradictorios.

### Inferir posiciones a partir de nombres localizados

Rechazada porque los textos no son identificadores estables.

### Incorporar una matriz de compatibilidad implícita al enum

Rechazada porque la taxonomía no debe inventar reglas de reconversión o desempeño.

## Pruebas requeridas

- Los 15 códigos válidos realizan round-trip sin transformación.
- Cualquier código desconocido o con casing distinto se rechaza.
- `primaryPosition` es obligatoria.
- `secondaryPositions` no contiene duplicados ni la primaria.
- Cada posición deriva exactamente un grupo.
- La unión de los cuatro grupos contiene todas las posiciones una sola vez.
- Rankings y premios rechazan grupos dentro de campos de posiciones específicas.
- Expandir un grupo de premio produce exactamente el conjunto de la tabla normativa.
- Una posición efectiva y su grupo derivado siguen las reglas de ADR-044 sin modificar la taxonomía.

## Referencias

- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-011--taxonomía-canónica-de-posiciones)
- [ADR-044: Posición efectiva y reconversión](./044-effective-position-and-retraining.md)
