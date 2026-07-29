# ADR-014: DSL declarativo de eventos

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-014
- Alcance: contratos de contenido, validación y efectos

## Contexto

Los eventos deben poder ampliarse sin editar el motor y sin ejecutar JavaScript u otro código arbitrario proveniente del contenido. Las condiciones y efectos necesitan tipos, paths autorizados, orden estable y atomicidad.

El contenido tampoco puede crear puntos directamente: scoring reacciona únicamente a hechos de dominio autorizados.

## Decisión

### Principio

El DSL es declarativo, versionado y cerrado por whitelist. Una definición desconocida o semánticamente no comprendida no se ejecuta.

### EventDefinition

`EventDefinition` contiene conceptualmente:

- ID estable y versión de contenido;
- `domainEventId` mecánico;
- referencias a `narrativePresentation` separadas;
- familia, sensibilidad, tags y claves de texto;
- ventanas de oportunidad donde puede evaluarse;
- hechos requeridos y su disponibilidad mínima;
- condición de oportunidad;
- probabilidad base;
- modificadores;
- elecciones o efectos automáticos;
- referencias tipadas;
- hechos o efectos programados permitidos.

No contiene funciones, scripts, expresiones evaluables, cooldowns, cupos ni máximos por carrera.

Las presentaciones narrativas no contienen choices ni effects y se rigen por ADR-012.

### ConditionExpression

Operadores iniciales:

```text
eq
neq
gt
gte
lt
lte
in
notIn
has
notHas
```

Combinadores:

```text
all
any
not
```

Una condición hoja contiene un path tipado, un operador y, cuando corresponde, un valor compatible. Los combinadores contienen expresiones hijas. Las condiciones son puras y no consumen azar.

### ModifierDefinition

Un modificador contiene:

- ID estable;
- condición;
- multiplicador finito y estrictamente positivo;
- etiqueta de traza.

Los modificadores se componen según ADR-003. Un multiplicador cero no reemplaza una clasificación lógica o de contenido deshabilitado.

### ChoiceDefinition

Una elección contiene:

- ID estable dentro del evento;
- claves de presentación;
- condición de disponibilidad opcional;
- lista ordenada de efectos;
- referencias tipadas necesarias.

Las opciones visibles quedan fijadas en el checkpoint de la decisión.

### EffectDefinition

Efectos iniciales:

| Operación | Semántica |
|---|---|
| `add` | Suma a un valor numérico cuyo path admite suma. |
| `set` | Reemplaza un valor cuyo path admite asignación. |
| `multiply` | Multiplica un valor numérico cuyo path admite multiplicación. |
| `append` | Agrega un elemento tipado a una colección. |
| `remove` | Elimina por identidad/criterio tipado dentro de una colección autorizada. |
| `emit` | Produce un hecho de dominio de un catálogo autorizado. |
| `schedule` | Registra efectos tipados para un punto futuro válido. |

Todos los paths pertenecen a un `DomainPathCatalog` derivado del modelo de dominio. Cada entrada declara:

- tipo leído/escrito;
- operaciones permitidas;
- límites o invariantes de dominio;
- mutabilidad;
- versión desde la que existe.
- primer punto del pipeline donde el dato está disponible.

Un evento no puede leer o escribir un path desconocido.

### Atomicidad

Antes de aplicar una elección:

1. se resuelven referencias;
2. se validan paths, tipos y operaciones;
3. se validan todos los efectos contra el mismo estado de entrada;
4. se comprueba el estado resultante y sus invariantes;
5. se aplican todos los efectos o ninguno;
6. se emiten hechos solo si la mutación completa se confirma.

### emit

`emit` solo puede producir un tipo incluido en `AuthorizedDomainFactCatalog`, con payload validado. No ejecuta handlers de contenido ni analytics arbitrarios.

El scoring puede reaccionar a hechos autorizados después de su confirmación. El contenido no puede emitir `ScoreLedgerEntry`, puntajes crudos ni un hecho diseñado únicamente para evitar las reglas de scoring.

### schedule

`schedule` crea un `ScheduledEffect` tipado con:

- ID estable;
- origen;
- temporada relativa no negativa;
- fase de ejecución;
- efectos anidados validados;
- política de identidad/idempotencia.

Un schedule no puede apuntar a un instante anterior al cursor actual. Si su fase ya pasó en la temporada actual, debe apuntar a una temporada posterior válida. Al vencer, su grupo de efectos se valida y aplica atómicamente.

### Referencias

- Los IDs son estables y no usan nombres localizados.
- Toda referencia se resuelve al compilar la release.
- No se publican referencias colgantes.
- Las referencias cruzadas declaran catálogo y versión.
- Un ciclo solo es válido si el schema de esa relación lo permite expresamente; no se asume que todo ciclo es ejecutable.

### Orden canónico

- El catálogo se compila en orden estable por ID.
- El orden de choices y effects es semántico y se preserva.
- El orden de hijos de `all`/`any` se preserva para traza, aunque las condiciones sean puras.
- Los modifiers se trazan en orden estable por ID.
- Los objetos serializados para hash siguen ADR-007.

### Validación y errores

La validación ocurre en capas:

1. estructura/schema;
2. operadores y efectos conocidos;
3. paths y tipos;
4. referencias;
5. invariantes semánticas;
6. compatibilidad de versiones;
7. compilación canónica.

Categorías iniciales de error:

- schema inválido;
- operador desconocido;
- efecto desconocido;
- path desconocido;
- tipo incompatible;
- operación no permitida;
- referencia ausente;
- ciclo no permitido;
- schedule inválido;
- hecho no autorizado;
- escritura de scoring prohibida;
- versión no comprendida.

### Compatibilidad

- Un runtime no ejecuta una release con operador, efecto, path o campo semántico requerido que no comprenda.
- Metadatos opcionales solo pueden ignorarse si el schema los declara no semánticos.
- Cambiar la semántica del DSL requiere versionar schema, engine o contenido según ADR-015.
- El compilador rechaza un evento asignado a una ventana anterior a cualquiera de sus hechos requeridos según ADR-043.

## Consecuencias

- El panel admin y los archivos usan el mismo validador.
- Los eventos pueden ampliarse sin `if/else` dispersos.
- No existe escape para código arbitrario.
- El catálogo de paths se convierte en una frontera explícita de seguridad y dominio.
- Los hechos autorizados desacoplan contenido de scoring.
- Este ADR define contratos; no implementa todavía el intérprete.

## Alternativas rechazadas

### JavaScript o expresiones arbitrarias en contenido

Rechazados por seguridad, auditabilidad y determinismo.

### Paths libres como strings

Rechazados porque permiten escrituras desconocidas y errores silenciosos.

### Aplicación parcial de efectos

Rechazada porque puede corromper Career.

### `createScoreEntry` como efecto

Rechazado porque permitiría que el contenido evite scoring.

### Ignorar operadores o efectos desconocidos

Rechazado porque altera semántica y replay.

## Pruebas requeridas

- Cada operador acepta y rechaza tipos según contrato.
- Cada operación de efecto respeta el `DomainPathCatalog`.
- Paths desconocidos se rechazan antes de publicar.
- Una elección con un efecto inválido no aplica ningún efecto.
- `emit` rechaza hechos no autorizados.
- `schedule` rechaza tiempos pasados y conserva idempotencia.
- Referencias colgantes y ciclos no permitidos se rechazan.
- El contenido no puede crear entradas de ScoreLedger.
- La compilación produce el mismo orden y hash con entradas equivalentes.
- Un runtime incompatible rechaza la release completa para replay oficial.
- Una oportunidad no puede leer un hecho antes de su punto de disponibilidad.

## Referencias

- [ADR-003: Composición de probabilidades](./003-probability-composition.md)
- [ADR-004: Semántica de oportunidades](./004-opportunity-semantics.md)
- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-012: Contenido sensible y equivalencia](./012-sensitive-content-equivalence.md)
- [ADR-015: Taxonomía de versiones](./015-version-taxonomy.md)
- [ADR-010: Domain Facts y ScoreLedger estructural](./010-scoring-ledger-and-domain-facts.md)
- [ADR-043: Ventanas causales de oportunidades](./043-event-opportunity-windows.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-014--orden-y-atomicidad-de-efectos-del-dsl)
