# ADR-004: Semántica de oportunidades

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-004
- Alcance: motor de eventos, DSL, contenido y trazabilidad
- Clarificación posterior: ADR-012

## Contexto

La especificación distingue imposibilidades lógicas de situaciones extraordinariamente improbables, pero algunas secciones antiguas trataban requisitos ausentes como exclusiones absolutas. Esa ambigüedad podía introducir probabilidad cero editorial.

## Decisión

Toda evaluación de oportunidad se clasifica en exactamente uno de estos estados:

1. **Posible actualmente:** el resultado puede ocurrir en el estado actual y recibe una probabilidad calculable.
2. **Extremadamente improbable pero posible:** el resultado puede ocurrir; antecedentes débiles reducen su probabilidad sin llevarla a cero.
3. **Requiere transición causal previa:** el resultado final todavía no puede materializarse, pero existen transiciones lógicamente posibles que podrían habilitarlo.
4. **Lógicamente imposible en el estado actual:** una identidad material del estado impide el resultado actual.
5. **Contenido deshabilitado:** una definición mecánica no pertenece al catálogo activo o está deshabilitada por una release/política mecánica versionada.

La ausencia de un antecedente no convierte automáticamente un resultado concebible en probabilidad cero.

Cuando un resultado necesita antecedentes materiales, el sistema debe poder representar y generar las transiciones causales que podrían llevar a ese estado. La oportunidad del resultado final no se ejecuta antes de que la transición lo habilite.

Toda clasificación debe registrar una razón auditable y la versión de reglas/contenido utilizada.

## Consecuencias

- `requirements` y `exclusions` no podrán interpretarse todos como filtros duros.
- El DSL deberá expresar por separado condiciones lógicas, modificadores probabilísticos y transiciones causales.
- Un hecho materialmente irrepetible puede pasar a “lógicamente imposible” después de ocurrir sin constituir un cooldown.
- El contenido mecánico deshabilitado puede producir probabilidad cero únicamente por una causa versionada del catálogo activo.
- Una preferencia narrativa sensible solo elige `narrativePresentation`; no cambia clasificación, probabilidad ni efectos según ADR-012.
- Las herramientas editoriales deberán explicar por qué una oportunidad fue clasificada y qué transiciones podrían habilitarla.
- Los autores de contenido no podrán usar una exclusión para proteger rareza o limitar repeticiones.

## Alternativas rechazadas

### Tratar todos los requisitos como filtros binarios

Rechazada porque convierte antecedentes débiles en imposibilidades y contradice la probabilidad total.

### Dar probabilidad residual al resultado final aunque falte una identidad material

Rechazada porque permitiría violar el estado, como ganar un torneo sin haber llegado a participar. La probabilidad positiva corresponde a las transiciones que pueden habilitar el resultado.

### Cancelar un resultado extraordinario después del sorteo

Rechazada. La posibilidad debe clasificarse antes del sorteo y el resultado válido debe respetarse.

### Usar cooldowns o máximos como clasificación

Rechazada porque son restricciones editoriales, no estados lógicos.

## Pruebas requeridas

- Cada oportunidad obtiene exactamente una clasificación.
- La falta de un antecedente débil no produce cero.
- Una imposibilidad lógica produce cero con una razón auditable.
- Una definición mecánica deshabilitada produce cero sin consumir o alterar streams independientes.
- Cambiar únicamente la preferencia narrativa no cambia la clasificación.
- Un resultado que requiere transición no ocurre directamente, pero sus transiciones habilitantes pueden conservar probabilidad positiva.
- Un evento materialmente irrepetible cambia de clasificación por estado, no por contador editorial.
- Los validadores rechazan cooldowns, cuotas y máximos por carrera.
- Property tests verifican que toda oportunidad posible y habilitada tenga probabilidad positiva.

## Referencias

- [ADR-003: Composición de probabilidades](./003-probability-composition.md)
- [ADR-005: Muestreo de oportunidades](./005-event-opportunity-sampling.md)
- [ADR-012: Contenido sensible y equivalencia](./012-sensitive-content-equivalence.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-004--oportunidad-válida-requisito-exclusión-y-probabilidad-residual)
