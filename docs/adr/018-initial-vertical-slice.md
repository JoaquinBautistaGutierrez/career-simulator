# ADR-018: Alcance del vertical slice inicial

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-018
- Alcance: planificación, contenido, datos y validación end-to-end

## Contexto

La especificación proponía distintos tamaños de contenido y dejaba abierta la liga europea y la inclusión de Carrera personalizada. Se necesita un alcance pequeño que pruebe el ciclo completo antes de escalar catálogos.

## Decisión

El vertical slice inicial queda limitado a:

| Dimensión | Alcance |
|---|---|
| País principal | Argentina |
| Liga europea | España |
| Posiciones del slice | `GK`, `CM`, `ST` |
| Modo | Carrera rápida |
| Eventos | 30 |
| Cadenas narrativas | 5 |
| Lesiones | 6 |

Debe demostrar el ciclo completo:

```text
creación
-> temporadas
-> decisiones
-> lesiones
-> transferencias
-> títulos/premios mínimos
-> retiro
-> score
-> ranking interno de prueba
```

No incluye Carrera personalizada. Tampoco se amplía a 80 eventos antes de validar este slice.

“Ranking interno de prueba” es un artefacto de validación y no un leaderboard oficial publicado.

Los clubes, competiciones, premios, arquetipos y finales exactos siguen sujetos a sus decisiones de catálogo y datos. Esta restricción no autoriza inventarlos.

## Consecuencias

- P8 y sus golden seeds se limitan a Argentina, España, `GK`, `CM` y `ST`, sujeto a resolver el alcance de reconversiones de DR-048.
- El modo rápido debe cubrir creación y cierre completos.
- Las seis lesiones forman parte del catálogo mínimo validado.
- Los 30 eventos y cinco cadenas deben pasar compilación, replay y Monte Carlo antes de cualquier expansión.
- Carrera personalizada se planifica después de cerrar y validar Creation Budget.
- El slice debe consumir el mismo engine y scoring destinados al producto, no mocks con reglas alternativas.

## Alternativas rechazadas

### Incluir Carrera personalizada

Rechazada para el slice inicial porque agrega una dimensión de balance todavía no calibrada.

### Ampliar primero a 80 eventos

Rechazada porque aumenta superficie creativa antes de validar determinismo, causalidad y distribución.

### Elegir una liga europea más adelante

Rechazada: España queda fijada como destino europeo del slice.

### Probar solo una temporada parcial

Rechazada porque no valida retiro, score ni ranking interno.

## Pruebas y evidencia requeridas

- Al menos una carrera reproducible completa por cada posición inicial.
- Seeds con decisiones, lesión, transferencia y cierre.
- Títulos y premios mínimos producen hechos y score conforme a versiones aprobadas.
- El ranking interno se reconstruye desde carreras cerradas y ScoreLedger.
- Golden replay conserva las cinco versiones canónicas.
- Monte Carlo cubre las tres posiciones y los dos contextos nacionales.
- El inventario publicado coincide con el contrato de conteo pendiente sin superar el alcance.
- No existe ruta de Carrera personalizada en el slice.

## Gate

El alcance está cerrado. El vertical slice no comienza gameplay hasta cerrar fórmulas, scoring y los contratos pendientes de datos/conteo identificados en `DECISIONS_REQUIRED.md`.

## Referencias

- [ADR-011: Taxonomía de posiciones](./011-position-taxonomy.md)
- [ADR-015: Taxonomía de versiones](./015-version-taxonomy.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-018--vertical-slice)
- [DR-047: Contrato de conteo de contenido](../DECISIONS_REQUIRED.md#dr-047--contrato-de-conteo-del-contenido-del-vertical-slice)
- [DR-048: Alcance posicional del slice](../DECISIONS_REQUIRED.md#dr-048--reconversiones-fuera-del-alcance-posicional-del-vertical-slice)
- [DR-049: Posición dominante](../DECISIONS_REQUIRED.md#dr-049--ponderación-y-empates-de-posición-dominante)
