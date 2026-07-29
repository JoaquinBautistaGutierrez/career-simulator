# ADR-012: Contenido sensible y equivalencia competitiva

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-012
- Alcance: dominio, contenido, presentación, replay y competencia

## Contexto

Una preferencia de contenido sensible no puede cambiar probabilidades, lesiones, ausencias, contratos, reputación, score ni cualquier otra consecuencia competitiva. Suprimir el evento mecánico produciría carreras distintas según una preferencia narrativa.

Es necesario separar el hecho mecánico de la forma en que se presenta.

## Decisión

Las preferencias de contenido sensible modifican únicamente la presentación narrativa. El evento mecánico, su probabilidad, sus decisiones y sus consecuencias permanecen idénticos.

El contenido distingue:

- `domainEvent`: identidad mecánica, clasificación, probabilidad, hechos y efectos;
- `narrativePresentation`: texto, recursos y nivel de explicitud con el que se representa el mismo hecho.

Ejemplo:

```text
domainEvent: serious_off_field_incident

explicit:
"El jugador sufrió un accidente de tránsito."

reduced:
"Un incidente grave fuera del fútbol lo mantendrá alejado durante varios meses."
```

Ambas presentaciones corresponden al mismo `domainEvent`, al mismo `EventInstance` y a los mismos efectos.

### Reglas de equivalencia

- La preferencia narrativa no participa de la clasificación ni del cálculo probabilístico.
- Elegir una presentación no consume azar de gameplay.
- La presentación no puede agregar, eliminar ni modificar choices o efectos mecánicos.
- Los IDs de decisiones y descubrimientos mecánicos no cambian entre presentaciones.
- El estado, ScoreLedger, replay, elegibilidad y hash mecánico son idénticos.
- Un render o hash de presentación puede variar de forma separada.
- Una carrera competitiva nunca elimina un evento mecánico por la preferencia narrativa.

### Relación con “contenido deshabilitado”

Este ADR aclara ADR-003 y ADR-004: una preferencia narrativa del usuario no es `contenido deshabilitado` y no habilita probabilidad cero.

La clasificación `contenido deshabilitado` queda reservada a una definición mecánica que no pertenece al catálogo activo o fue deshabilitada por una release/política mecánica versionada. Esa deshabilitación no puede usarse para crear variantes competitivas encubiertas por preferencia de presentación.

### Validación editorial

Cada `domainEvent` sensible publicado debe tener una presentación compatible con cada nivel narrativo soportado. Si falta una variante requerida, la release se rechaza; el runtime no elimina el evento como fallback.

La relación entre `domainEvent` y sus presentaciones es versionada e inmutable dentro de `contentVersion`.

## Consecuencias

- Simulation y Probability no dependen de preferencias narrativas.
- Content compila por separado contratos mecánicos y presentaciones.
- UI selecciona la variante permitida después de recibir el mismo hecho mecánico.
- Replay oficial puede reconstruir el estado sin cargar textos o recursos narrativos.
- Políticas legales, etarias y regionales todavía pueden impedir publicar una release, pero no alterar silenciosamente una carrera ya comparable.
- La política editorial completa permanece en DR-028.

## Alternativas rechazadas

### Eliminar eventos sensibles según preferencia

Rechazada porque cambia la distribución competitiva.

### Sustituirlos por otro evento mecánico “equivalente”

Rechazada porque la equivalencia de probabilidades y consecuencias sería difícil de garantizar y auditar.

### Dejar eventos sensibles sin consecuencias

Rechazada porque crea dos mecánicas para el mismo contenido.

### Permitir que la presentación cambie choices

Rechazada porque una choice es una decisión mecánica, no un detalle narrativo.

## Pruebas requeridas

- Dos carreras con igual estado, seed, versiones y decisiones, pero distinta preferencia narrativa, producen el mismo estado, hechos, score y hash mecánico.
- Las variantes explícita y reducida resuelven al mismo `domainEvent` y `EventInstance`.
- Cambiar la presentación no consume ni desplaza streams de gameplay.
- El compilador rechaza variantes que cambian choices o efectos.
- El compilador rechaza un evento sensible sin las presentaciones requeridas.
- Una preferencia narrativa nunca clasifica una oportunidad como contenido deshabilitado.
- Los snapshots públicos no exponen una variante incompatible con la preferencia efectiva.

## Gate

Con este ADR, la equivalencia mecánica de contenido sensible queda cerrada para el motor. DR-028 sigue siendo necesaria para catálogo permitido, edad, advertencias, regiones y proceso editorial.

## Referencias

- [ADR-003: Composición de probabilidades](./003-probability-composition.md)
- [ADR-004: Semántica de oportunidades](./004-opportunity-semantics.md)
- [ADR-014: DSL de eventos](./014-event-dsl.md)
- [ADR-057: Salud, lesiones y recuperación](./057-health-injury-recovery-model.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-012--contenido-sensible-y-equivalencia-competitiva)
- [DR-028: Política de contenido sensible y edad](../DECISIONS_REQUIRED.md#dr-028--política-de-contenido-sensible-y-edad)
