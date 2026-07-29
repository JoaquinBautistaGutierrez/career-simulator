# ADR-020: Dificultad informativa y automatización separada

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-020
- Alcance: presentación, decisiones, competencia y versionado

## Contexto

La dificultad podía interpretarse como una modificación del motor o como una cantidad de información mostrada. También se mezclaba con políticas que toman decisiones por el usuario.

## Decisión

El ranking competitivo oficial utiliza el mismo motor probabilístico para todos los presets de dificultad.

Los presets iniciales son:

| Preset | Información presentada |
|---|---|
| `ASSISTED` | Más información sobre riesgos, estimaciones y consecuencias. |
| `STANDARD` | Información moderada. |
| `EXPERT` | Oculta estimaciones y ayudas. |

Ningún preset cambia:

- probabilidades;
- atributos;
- Creation Budget;
- decisiones disponibles;
- efectos;
- estadísticas;
- scoring;
- resultado mecánico.

El preset es una preferencia de presentación. No participa de la seed, los streams ni el hash mecánico.

### Automatización

Una política que selecciona decisiones mecánicas por el usuario es una dimensión distinta de dificultad.

- Cada política posee ID y versión estables.
- La decisión elegida se registra igual que una decisión manual, con procedencia de automatización.
- La política no recibe autoridad para modificar probabilidades o efectos.
- Su elegibilidad competitiva se define independientemente.
- Una política desconocida no se ejecuta en una carrera oficial.

Este ADR no aprueba ninguna política automática ni su elegibilidad.

## Consecuencias

- UI puede cambiar el nivel de explicación sin bifurcar el engine.
- Carreras manuales con distintos presets pueden compararse mecánicamente.
- Los tests de equivalencia deben ignorar diferencias puramente visuales.
- Automatización requiere catálogo/versionado y una decisión competitiva posterior.
- Ocultar información no debe ocultar consentimientos, advertencias obligatorias ni accesibilidad.

## Alternativas rechazadas

### Modificar probabilidades por dificultad

Rechazada porque crea motores competitivos distintos.

### Dar bonificaciones de atributos o score

Rechazada porque rompe equivalencia.

### Tratar automatización como parte de `ASSISTED`

Rechazada porque presentar información y tomar decisiones son efectos mecánicamente distintos.

### No versionar políticas automáticas

Rechazada porque una modificación de la estrategia puede cambiar resultados.

## Pruebas requeridas

- Igual seed, estado, versiones y decisiones produce el mismo resultado con `ASSISTED`, `STANDARD` y `EXPERT`.
- Cambiar preset no consume azar ni modifica el hash mecánico.
- Los tres presets solo afectan read models o presentación.
- Toda decisión automática registra política, versión y opción elegida.
- Una política desconocida se rechaza en contexto oficial.
- Ningún preset habilita una decisión mecánica distinta.

## Gate

Los presets quedan cerrados. DR-046 debe definir políticas de automatización y elegibilidad antes de permitir decisiones automáticas en competencia oficial.

## Referencias

- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-015: Taxonomía de versiones](./015-version-taxonomy.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-020--dificultad-y-automatización)
- [DR-046: Elegibilidad de automatizaciones](../DECISIONS_REQUIRED.md#dr-046--políticas-de-automatización-y-elegibilidad-competitiva)
