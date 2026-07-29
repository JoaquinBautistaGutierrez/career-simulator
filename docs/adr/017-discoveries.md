# ADR-017: Confirmación y procedencia de descubrimientos

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-017
- Alcance: Career, perfil, colección, abandono e invalidación

## Contexto

La especificación no distinguía con precisión elegibilidad, ocurrencia y descubrimiento. También debía definirse qué sucede con descubrimientos confirmados antes de abandonar o invalidar una carrera.

## Decisión

Un descubrimiento se confirma cuando el hecho correspondiente ocurre dentro de una Career y se confirma atómicamente con su `EventInstance`. La mera elegibilidad, la evaluación de una oportunidad o la visualización de una opción no descubren contenido.

### IDs de descubrimiento

El evento base y sus desenlaces relevantes pueden declarar IDs separados, por ejemplo:

```text
return_offer
return_offer.accepted
return_offer.rejected
return_successful
```

La release de contenido declara explícitamente qué `discoveryId` emite cada ocurrencia o desenlace. No se infieren IDs a partir de textos localizados.

Cuando una ocurrencia confirma tanto el evento base como un desenlace, ambos IDs se registran si la definición versionada así lo declara.

### Registros e idempotencia

Se distinguen:

```text
DiscoveryOccurrenceKey =
careerId + eventInstanceId + discoveryId

ProfileDiscoveryKey =
profileId + discoveryId
```

- `DiscoveryOccurrenceKey` hace idempotente el hecho dentro de Career y conserva su procedencia.
- `ProfileDiscoveryKey` hace idempotente el estado “descubierto” del perfil aunque el mismo contenido ocurra en varias carreras.
- La proyección de perfil conserva las ocurrencias fuente necesarias para recalcular elegibilidad pública.
- Un reintento no crea una segunda ocurrencia ni incrementa contadores de desbloqueo.

La confirmación del `EventInstance`, sus `DiscoveryConfirmed` y el checkpoint
se realiza toda o ninguna. La proyección de perfil puede ser asíncrona, pero
consume hechos idempotentes confirmados.

### Abandono

Los descubrimientos confirmados antes de `ABANDONED` permanecen descubiertos en el perfil. Abandonar no revierte hechos ya ocurridos.

### Invalidación

Una Career `INVALIDATED` no aporta descubrimientos al perfil competitivo público.

- Cada contribución pública mantiene procedencia por Career.
- Al invalidar, se recalcula o revoca esa contribución.
- Si el mismo `discoveryId` también fue confirmado por otra Career elegible, permanece público.
- La ocurrencia de la carrera invalidada puede conservarse en historial local y auditoría.
- Retención, visibilidad legal y borrado del historial local se rigen por las políticas posteriores aplicables; no se resuelven por este ADR.

Los descubrimientos son metaprogreso. No cambian probabilidades, Creation Budget, atributos ni reglas de una Career.

## Consecuencias

- Career registra ocurrencias; UserProfile materializa el estado coleccionable.
- El catálogo necesita IDs estables para evento base y desenlaces.
- Una invalidación no puede resolverse con un booleano global sin procedencia.
- Abandono e invalidación tienen semánticas distintas para descubrimientos públicos.
- La colección no puede usarse como fuente de verdad del motor.

## Alternativas rechazadas

### Descubrir al ser elegible

Rechazada porque revela contenido que no ocurrió.

### Usar un único ID para todos los desenlaces

Rechazada porque impide coleccionar resultados narrativamente distintos.

### Revertir descubrimientos al abandonar

Rechazada porque los hechos ocurrieron antes del abandono.

### Mantener públicamente aportes de una carrera invalidada

Rechazada porque la invalidación elimina elegibilidad competitiva.

### Borrar evidencia al invalidar

Rechazada porque impide auditoría.

## Pruebas requeridas

- Una oportunidad elegible pero no ocurrida no crea descubrimientos.
- Una ocurrencia confirma exactamente los IDs declarados.
- Evento base y desenlaces separados pueden descubrirse independientemente.
- Reintentos con la misma `DiscoveryOccurrenceKey` no duplican registros.
- Varias carreras con el mismo `ProfileDiscoveryKey` conservan un único desbloqueo y varias procedencias.
- Abandonar conserva descubrimientos ya confirmados.
- Invalidar elimina solo las contribuciones públicas cuya única procedencia elegible era esa Career.
- El historial auditable conserva la relación con Career, EventInstance y contentVersion.

## Gate

Este ADR cierra el momento de confirmación, abandono, invalidación competitiva e idempotencia. Las políticas de retención, privacidad y retirada legal siguen en DR-033, DR-037 y DR-028.

## Referencias

- [ADR-016: Ciclo de vida de Career](./016-career-lifecycle.md)
- [ADR-010: Domain Facts y ScoreLedger estructural](./010-scoring-ledger-and-domain-facts.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-017--descubrimientos)
- [DR-033: Persistencia y retención](../DECISIONS_REQUIRED.md#dr-033--persistencia-checkpoints-y-retención)
- [DR-037: Privacidad pública](../DECISIONS_REQUIRED.md#dr-037--privacidad-pública)
