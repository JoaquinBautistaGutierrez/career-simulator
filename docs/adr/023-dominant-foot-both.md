# ADR-023: Pie dominante y ambidestreza

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-023
- Alcance: creación de jugador, generación y balance

## Contexto

La especificación no cerraba si la ambidestreza era seleccionable, aleatoria o desbloqueable. Como puede otorgar una ventaja inicial, también debe integrarse al balance de creación.

## Decisión

`DominantFoot` admite exactamente:

```text
RIGHT
LEFT
BOTH
```

`BOTH`:

- puede seleccionarse en Carrera rápida;
- podrá seleccionarse en Carrera personalizada cuando ese modo exista;
- puede aparecer mediante generación aleatoria;
- no es un desbloqueable;
- consume parte del Creation Budget o un coste equivalente.

Cuando se selecciona `BOTH` en Carrera rápida, el generador distribuye probabilísticamente el presupuesto restante. La selección no aumenta el presupuesto total.

El coste numérico y su interacción con otros componentes quedan pendientes del balance versionado de Creation Budget. No se asigna un valor provisional.

La disponibilidad de `BOTH` no depende de descubrimientos de perfil.

## Consecuencias

- `DominantFoot` es un value object canónico y case-sensitive.
- Schemas y catálogos aceptan los tres valores.
- Generación rápida puede producir `BOTH` mediante un stream contextual estable.
- Selección y generación convergen en el mismo estado de dominio y presupuesto validado.
- El perfil o la colección no pueden bloquear `BOTH`.
- Compartir ranking entre modos exige la evidencia de DR-019 y DR-045.

## Alternativas rechazadas

### Tratar `BOTH` como desbloqueable

Rechazada porque condicionaría poder inicial al metaprogreso.

### Permitirlo solo por generación aleatoria

Rechazada porque la decisión aceptada permite selección.

### Permitirlo sin coste

Rechazada porque alteraría la distribución de poder inicial.

### Fijar un coste numérico en este ADR

Rechazada porque todavía no existe la calibración de Creation Budget.

## Pruebas requeridas

- Los tres valores realizan round-trip; cualquier otro valor se rechaza.
- Carrera rápida acepta selección de `BOTH`.
- Generación aleatoria puede producir `BOTH` de forma reproducible.
- Seleccionar `BOTH` no aumenta el Creation Budget total.
- El mismo estado final valida igual tanto si provino de selección como de generación.
- Ningún estado de descubrimiento bloquea o habilita `BOTH`.
- No se publica elegibilidad compartida sin coste versionado y Monte Carlo.

## Gate

La taxonomía y disponibilidad quedan cerradas. El coste numérico depende de DR-045 y no debe implementarse con un placeholder.

## Referencias

- [ADR-019: Creation Budget](./019-creation-budget-equivalence.md)
- [ADR-017: Descubrimientos](./017-discoveries.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-023--ambidiestro)
- [DR-045: Parámetros de Creation Budget](../DECISIONS_REQUIRED.md#dr-045--parámetros-y-validación-del-creation-budget)
