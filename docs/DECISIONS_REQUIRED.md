# Decisiones requeridas

## 1. Propósito

Este registro contiene contradicciones, ambigüedades y requisitos faltantes detectados en la auditoría completa de `MASTER_SPEC.docx`.

No convierte propuestas en reglas de gameplay. Cada decisión debe cerrarse con responsable, fecha, opción aceptada, secciones afectadas y, cuando corresponda, un ADR o una especificación matemática versionada.

Las decisiones resueltas permanecen en este archivo como registro histórico. Una resolución aceptada solo puede reemplazarse mediante un nuevo ADR que declare la decisión anterior como sustituida.

## 2. Severidad

| Nivel | Significado |
|---|---|
| Bloqueante del núcleo | No se deben implementar schemas definitivos ni lógica de simulación afectada. |
| Antes del vertical slice | Puede prepararse la fundación, pero no cerrar el slice ni sus golden seeds. |
| Antes de servidor/ranking | No bloquea el motor local, pero sí autoridad, sincronización o competencia. |
| Antes de publicación | No bloquea el prototipo interno, pero sí un lanzamiento a usuarios. |
| Documental | Requiere normalización para evitar referencias incompatibles. |

Etiquetas de planificación introducidas por G3A:

| Etiqueta | Significado |
|---|---|
| `BLOCKER_G3` | Debe cerrarse antes de implementar gameplay matemático en G3B. |
| `BALANCE_LATER` | Requiere un valor inicial aprobado para G3B, pero puede recalibrarse después mediante la versión participante. |
| `CONTENT_LATER` | Se concreta en catálogos/releases después de aprobar la regla universal que lo admite. |

## 3. Contradicciones ya resueltas por precedencia

Estos puntos no requieren inventar una decisión nueva; el propio documento define qué regla prevalece.

### RP-001 — Cooldowns, cupos y máximos de ocurrencia

**Conflicto**

- Las secciones 15, 33 y 35 todavía mencionan `cooldown`, `cooldownSeasons`, límites de repetición, máximos por carrera y “rareza protegida”.
- Las secciones 15.5, 16, 35.8, 36, el Anexo B, 37.2, 48.4, 57 y 61 prohíben esos mecanismos.

**Resolución normativa**

La sección 36 y el Anexo B los reemplazan explícitamente. No se implementarán cooldowns obligatorios, máximos por carrera, cupos, compensación de rareza ni exclusiones editoriales. Solo se admite imposibilidad lógica del estado o desactivación explícita de contenido sensible.

### RP-002 — Cantidad de eventos del vertical slice

**Conflicto**

- La sección 34.5 define 30 eventos y 5 cadenas.
- La sección 35.16 recomienda 80 eventos y 12 cadenas.
- La fase F1 de la sección 56 vuelve a definir 30 eventos.

**Resolución de planificación**

El primer vertical slice usa 30 eventos y 5 cadenas. La cifra de 80 corresponde a una ampliación creativa posterior, no a una dependencia para validar el núcleo.

### RP-003 — Cadencia

La cadencia de 1 a 4 temporadas solo cambia agrupación visual. Toda decisión mecánica interrumpe cualquier cadencia. Una automatización, si existe, es una política separada y versionada.

### RP-004 — Orden técnico de temporada

Las listas anteriores del documento maestro no tienen el mismo orden. DR-013 reemplazó la secuencia técnica asumida en la auditoría inicial por una state machine explícita y cursor. DR-042 y DR-043 la enmendaron antes de implementación con Q1–Q4 y ventanas causales de oportunidades. El plan vigente es el de ADR-013, ADR-042 y ADR-043 en conjunto.

### RP-005 — Datos reales frente a activos de marca

Los datos e identidades se versionan por separado de logos, escudos, fotografías y otros activos. La ausencia de licencia de un activo no modifica el modelo de dominio; obliga a usar un provider/fallback autorizado.

### RP-006 — “Variación acotada” frente a colas abiertas

**Conflicto**

- `MASTER_SPEC` §34.1.3 usa la frase “variación acotada” para producción anual.
- §36.6 prohíbe máximos rígidos de coherencia y exige colas abiertas o mixtures
  para temporadas excepcionales.

**Resolución normativa**

La sección posterior y la regla explícita de §36.6 prevalecen. “Acotada” solo
puede significar condicionada por exposición, contexto, parámetros e identidades
lógicas/físicas; no autoriza truncar goles, asistencias, atajadas, ratings o
performance con máximos editoriales. Los topes expresamente aprobados de
scoring limitan puntos, nunca producción.

## 4. Decisiones resueltas

### DR-001 — Versión efectiva y limpieza de la fuente

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-001](adr/001-spec-version.md)

**Decisión aceptada**

La especificación normativa efectiva es `MASTER_SPEC v0.8 — 27/07/2026`. Las referencias v0.6 y v0.7 de propiedades o anexos se consideran metadatos históricos residuales. El DOCX no se modifica en esta resolución.

**Alternativas rechazadas**

- Tratar las propiedades OOXML como autoridad normativa.
- Considerar v0.7 como versión efectiva.
- Mantener ambigüedad hasta editar el DOCX.

**Impacto**

- Unifica la referencia de ADRs, schemas, fixtures y releases.
- Todo cambio normativo posterior debe publicar una versión nueva.
- Separa la identidad normativa del hash físico del archivo.

**Tests y validaciones requeridos**

- La documentación nueva referencia `MASTER_SPEC v0.8 — 27/07/2026`.
- Un futuro check documental detecta referencias normativas nuevas a versiones anteriores fuera de contexto histórico.
- El historial de versiones permanece explícito.

### DR-002 — Representación y precisión de probabilidades

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-002](adr/002-probability-representation.md)

**Decisión aceptada**

Se utilizará IEEE-754 double cuando sea adecuado y representación logarítmica para cálculos y probabilidades extremas. La persistencia de probabilidades mecánicas debe soportar log-probabilidad. No existe un mínimo editorial. Un valor positivo no puede redondearse accidentalmente a cero.

**Alternativas rechazadas**

- Persistencia universal con seis decimales.
- Piso editorial de probabilidad.
- Representación exclusivamente lineal.
- Aritmética decimal arbitraria como requisito universal.

**Impacto**

- Los schemas deben declarar la representación probabilística.
- UI y persistencia mecánica usan valores distintos cuando exista redondeo de presentación.
- Trazas y replay deben conservar valores extremos sin underflow accidental.
- NaN, infinitos inválidos y valores fuera de dominio son errores.

**Tests requeridos**

- Round-trip de probabilidades positivas menores que `10^-12`.
- Productos extensos en log-space sin underflow a cero.
- Conversión entre representaciones dentro de tolerancia documentada.
- Rechazo de NaN, infinitos inválidos y valores fuera de `[0,1]`.
- Formatear para UI no modifica el valor mecánico.

### DR-003 — Semántica matemática de la fórmula probabilística

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-003](adr/003-probability-composition.md)

**Decisión aceptada**

Los modificadores se combinan sobre odds/log-odds:

```text
oddsBase = pBase / (1 - pBase)

logOddsFinal =
logOddsBase + Σ log(modifier_i)

pFinal =
oddsFinal / (1 + oddsFinal)
```

Probabilidad exactamente cero solo ante imposibilidad lógica o contenido explícitamente deshabilitado. Probabilidad exactamente uno solo cuando el estado determina necesariamente el resultado.

**Alternativas rechazadas**

- Multiplicar probabilidad lineal y aplicar clamp.
- Sumar modificadores a la probabilidad.
- Mantener pesos sin conversión canónica.
- Usar modificadores cero como exclusión editorial.

**Impacto**

- Los modificadores de oportunidades posibles deben ser finitos y positivos.
- Los casos cero y uno requieren causa semántica explícita.
- Cambiar la fórmula cambia `engineVersion`.
- Cada modificador aplicado debe quedar disponible para auditoría.

**Tests requeridos**

- Un modificador `1` conserva la probabilidad.
- Modificadores recíprocos restauran odds dentro de tolerancia.
- Oportunidades posibles extremas permanecen positivas.
- Cero y uno solo aparecen con una causa válida.
- Modificadores negativos, cero, NaN o infinitos se rechazan.
- Fixtures iguales producen el mismo resultado en todos los runtimes soportados.

### DR-004 — Oportunidad válida, requisito, exclusión y probabilidad residual

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-004](adr/004-opportunity-semantics.md)

**Decisión aceptada**

Toda oportunidad se clasifica como:

1. posible actualmente;
2. extremadamente improbable pero posible;
3. requiere transición causal previa;
4. lógicamente imposible en el estado actual;
5. contenido deshabilitado.

La ausencia de un antecedente no convierte automáticamente un resultado concebible en probabilidad cero. Cuando existen antecedentes materiales necesarios, el sistema debe poder generar las transiciones causales que podrían habilitar el resultado.

**Alternativas rechazadas**

- Tratar todos los requisitos como filtros duros.
- Permitir el resultado final antes de una transición material necesaria.
- Cancelar resultados extraordinarios después del sorteo.
- Usar cooldowns, cupos o máximos como clasificación.

**Impacto**

- El DSL debe separar condiciones lógicas, modificadores y transiciones.
- Toda clasificación registra una causa auditable.
- Un hecho irrepetible se vuelve imposible por estado, no por cuota.
- Las herramientas editoriales deben explicar la clasificación.

**Tests requeridos**

- Cada oportunidad recibe exactamente una clasificación.
- Un antecedente débil ausente no produce cero.
- Imposibilidad lógica y contenido deshabilitado producen cero con causa.
- Transiciones habilitantes pueden conservar probabilidad positiva.
- Los validadores rechazan cooldowns, cuotas y máximos por carrera.
- Property tests verifican probabilidad positiva para toda oportunidad posible y habilitada.

### DR-005 — Muestreo y concurrencia de oportunidades

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-005](adr/005-event-opportunity-sampling.md)

**Decisión aceptada**

No existe un máximo artificial de eventos por temporada. Las oportunidades se evalúan por ventanas causales y familias mediante sorteos propios; pueden ocurrir cero, uno o múltiples eventos. Después de cada evento se aplican sus consecuencias antes de evaluar oportunidades posteriores, que observan el estado actualizado.

**Alternativas rechazadas**

- Máximo de eventos por temporada o carrera.
- Elegir universalmente un único evento ponderado por ventana.
- Evaluar todas las probabilidades sobre el estado inicial y aplicar efectos al final.
- Compensar temporadas extrañas mediante protección de rareza.

**Impacto**

- El orden de ventanas, familias y oportunidades es estable y versionado.
- Cada oportunidad necesita una clave de stream contextual.
- La aplicación de consecuencias es atómica antes del siguiente sorteo.
- La cantidad y concentración de eventos emerge de probabilidad y estado.

**Tests requeridos**

- Seeds reproducibles con cero, uno y múltiples eventos.
- Ausencia de constantes o schemas que impongan máximos.
- Consecuencias previas modifican oportunidades posteriores.
- Orden canónico estable ante reordenamientos incidentales del catálogo.
- Streams de otras familias no cambian al agregar una oportunidad.
- Monte Carlo cubre frecuencia, coocurrencia y colas.

### DR-006 — PRNG y determinismo multiplataforma

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-006](adr/006-deterministic-prng.md)

**Decisión aceptada**

El PRNG de simulación será xoshiro256** con estado de 256 bits. Cada carrera tendrá una root seed y streams derivados determinísticamente por subsistema y contexto mediante una función hash estable. `Math.random()`, reloj y UUID quedan prohibidos como fuentes de azar de gameplay. Consumir azar en un subsistema no puede modificar streams independientes.

Los vectores normativos fijarán la función estable de derivación, encoding, separación de dominio, endianness, expansión de estado, tratamiento del estado nulo y conversión a uniformes antes de implementar gameplay. SHA-256 queda resuelto en DR-007 para hashes de integridad, no automáticamente para derivación de streams.

**Alternativas rechazadas**

- `Math.random()`.
- Reloj, UUID o entropía del dispositivo.
- Un único stream global.
- PRNG dependiente de librería sin vectores normativos.
- SHA-256 como reemplazo del PRNG para cada número.

**Impacto**

- El contrato PRNG forma parte de `engineVersion`.
- Cada sorteo declara una `StreamKey` estable.
- CLI, servidor y navegador comparten vectores de conformidad.
- La root seed no se usa como secreto de autenticación.

**Tests requeridos**

- Vectores conocidos de xoshiro256**.
- Vectores de root seed y derivación de streams.
- Igual secuencia en todos los runtimes soportados.
- Independencia entre streams.
- Prevención del estado nulo.
- Conversión a uniformes conforme al contrato.
- Check estático que prohíba `Math.random()` en el núcleo.

### DR-007 — Canonicalización, aritmética y hashes

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-007](adr/007-canonicalization-and-hashing.md)

**Decisión aceptada**

Las estructuras que participan en hashes usarán serialización canónica compatible con RFC 8785. Los hashes de integridad utilizarán SHA-256 sobre bytes UTF-8 canónicos.

Se evitan floats cuando el dominio admite enteros:

- dinero en unidades monetarias enteras;
- seguidores enteros;
- score entero;
- contadores enteros.

Probabilidades y cálculos estadísticos pueden usar double/log-space según ADR-002 y ADR-003.

**Alternativas rechazadas**

- `JSON.stringify` sin contrato canónico.
- Snapshots binarios dependientes del runtime.
- Floats para dinero, seguidores, score o contadores.
- Hashes no criptográficos para integridad oficial.
- Ordenar arrays genéricamente sin conocer su semántica.

**Impacto**

- Los objetos se convierten a DTO canónicos explícitos antes de hashear.
- Arrays se ordenan por regla de dominio cuando no poseen orden semántico propio.
- NaN e infinitos son inválidos en material canónico.
- Cambiar un DTO canónico requiere versión o migración explícita.
- SHA-256 detecta manipulación, pero no sustituye autorización server-side.

**Tests requeridos**

- Mismos bytes y SHA-256 en todos los runtimes.
- Reordenar propiedades no cambia el hash.
- Reordenar una secuencia semántica sí cambia el hash.
- Resultados SQL/maps se normalizan antes de formar arrays.
- Rechazo de NaN, infinitos y tipos no JSON.
- Round-trip entero de dinero, seguidores, score y contadores.
- Fixtures RFC 8785 con Unicode, escapes y números de frontera.

### DR-009 — Coeficiente de Contribución

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-009](adr/009-contribution-coefficient.md)

**Decisión aceptada**

El rango canónico es `0.00 <= CC <= 1.10`. `CC` se deriva de participación y rendimiento:

| Intervalo | Interpretación |
|---|---|
| `0.00–0.20` | Contribución residual |
| `0.20–0.50` | Suplente |
| `0.50–0.80` | Rotación |
| `0.80–1.00` | Protagonista |
| `1.00–1.10` | Contribución excepcional |

Los valores superiores a `1.00` solo pueden surgir de rendimiento extraordinario, nunca de una bonificación editorial manual. Los intervalos son explicativos y no crean clases mecánicas.

La fórmula, inputs, precisión y redondeo quedan sujetos a la especificación matemática de DR-008/DR-010.

**Aclaración G3B — Bloque 10 (2026-07-28)**

CC es específico de competición/logro y se aplica a logros colectivos de
`PTC_CLUB` y `PSN`. No se aplica por defecto a `PRI`, `PPI`, `PRL` o `PBR`.
Sus inputs autorizados son participación, disponibilidad, rendimiento y
presión confirmados; `SportingRole` no lo determina. La fórmula sigue
pendiente.

**Alternativas rechazadas**

- Limitar `CC` a `1.00`.
- Aplicar una bonificación manual para superar `1.00`.
- Cerrar una fórmula provisional antes de DR-008/DR-010.
- Convertir los intervalos conceptuales en clases rígidas.

**Impacto**

- Schemas validan el rango, pero no inventan el cálculo.
- Scoring consume un valor derivado y explicable.
- Contenido, UI y cliente no pueden escribir `CC`.
- Cambiar rango o fórmula exige las versiones participantes; un cambio competitivo también exige nueva `scoringVersion`.

**Tests y gates requeridos**

- Fronteras `0.00`, `1.00` y `1.10`, además de rechazo fuera de rango.
- Rechazo de NaN e infinitos.
- Round-trip conforme al contrato numérico.
- Ningún efecto de contenido ni input del cliente fija `CC`.
- Fixtures futuros explican todo valor superior a `1.00` mediante participación/rendimiento.
- Gate: rango cerrado; fórmula y ScoreLedger siguen bloqueados por DR-008 y DR-010.

### DR-011 — Taxonomía canónica de posiciones

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-011](adr/011-position-taxonomy.md)

**Decisión aceptada**

Las posiciones canónicas son:

```text
GK
RB CB LB RWB LWB
CDM CM CAM RM LM
RW LW ST CF
```

Cada jugador tiene `primaryPosition` obligatoria y `secondaryPositions` opcionales. La posición específica es canónica; los grupos se derivan:

| Grupo | Posiciones |
|---|---|
| `GK` | `GK` |
| `DEF` | `RB`, `CB`, `LB`, `RWB`, `LWB` |
| `MID` | `CDM`, `CM`, `CAM`, `RM`, `LM` |
| `FWD` | `RW`, `LW`, `ST`, `CF` |

Rankings y premios deben distinguir contratos por posición específica de contratos por grupo. Los grupos nunca son una segunda verdad editable de Player.

**Alternativas rechazadas**

- Guardar solamente cuatro grupos.
- Guardar posición y grupo como campos editables independientes.
- Inferir posiciones desde textos localizados.
- Incorporar reglas implícitas de reconversión en el enum.

**Impacto**

- Unifica schemas, estadísticas, premios, rankings, UI y datos.
- Los ejemplos que guardan grupos dentro de `eligiblePositions` deben migrarse.
- Cada catálogo declara si la elegibilidad opera por posición o grupo.
- La posición efectiva por ventana, las reconversiones y las cohortes se rigen por ADR-044.

**Tests requeridos**

- Validación y round-trip de los 15 códigos.
- `primaryPosition` obligatoria.
- Secundarias sin duplicados ni repetición de la primaria.
- Cada posición deriva exactamente un grupo.
- Los cuatro grupos cubren todas las posiciones una sola vez.
- Rankings y premios rechazan la mezcla semántica entre posición y grupo.

### DR-012 — Contenido sensible y equivalencia competitiva

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-012](adr/012-sensitive-content-equivalence.md)

**Decisión aceptada**

Las preferencias de contenido sensible modifican solamente `narrativePresentation`. El `domainEvent`, su probabilidad, choices, consecuencias, score, replay y elegibilidad permanecen idénticos.

Una preferencia narrativa no consume azar de gameplay ni puede clasificar una oportunidad como contenido deshabilitado. En carreras competitivas no se elimina un evento mecánico por preferencia narrativa.

`Contenido deshabilitado` de ADR-003/004 queda reservado a una causa mecánica versionada del catálogo/release, no a una preferencia de presentación.

**Alternativas rechazadas**

- Eliminar eventos sensibles según preferencia.
- Sustituirlos por otro evento mecánico supuestamente equivalente.
- Quitar sus consecuencias competitivas.
- Permitir que la variante narrativa cambie choices o efectos.

**Impacto**

- Simulation y Probability no dependen de preferencias narrativas.
- Content separa definiciones mecánicas de textos/recursos por nivel de explicitud.
- El hash mecánico no cambia; artefactos de presentación pueden versionarse/hashearse aparte.
- Una release sensible sin las variantes requeridas se rechaza.
- La política etaria, regional y editorial completa continúa en DR-028.

**Tests y gates requeridos**

- Igual seed/estado/versiones/decisiones y distinta preferencia produce mismo estado, score y hash mecánico.
- Las variantes resuelven al mismo `domainEvent` y `EventInstance`.
- Cambiar presentación no desplaza streams.
- El compilador rechaza diferencias mecánicas entre variantes.
- Gate del motor sensible cerrado; publicación sigue dependiendo de DR-028.

**Refinamiento de interfaz — G3B Bloque 5 (2026-07-28)**

Un evento externo sensible emite el mismo hecho causal de salud con cualquier
`narrativePresentation`. Health procesa esa causa en el siguiente límite causal
válido y no la vuelve a sortear como lesión deportiva. La preferencia narrativa
no cambia episodio, disponibilidad, recuperación, replay ni hash mecánico.

### DR-013 — Interrupciones y atomicidad de temporada

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-013](adr/013-season-state-machine.md)

**Decisión aceptada**

La temporada utiliza `SimulationCursor` explícito. La lista plana inicial de fases fue enmendada por ADR-042 y ADR-043; el plan vigente incorpora Q1–Q4 y ventanas causales de oportunidades.

```text
SEASON_START
PRESEASON
PRESEASON_EVENTS
ROLE_AND_MINUTES

for Q1..Q4:
  AVAILABILITY
  PRODUCTION
  HEALTH
  CONSEQUENCES
  PERFORMANCE_EVENTS
  HEALTH_EVENTS

COMPETITIONS
COMPETITION_EVENTS
MARKET
MARKET_EVENTS
AWARDS
AWARD_EVENTS
WORLD_UPDATE
WORLD_EVENTS
POSTSEASON_EVENTS
SEASON_CLOSE
```

`WAITING_DECISION` es un estado de interrupción, no una fase. Una decisión mecánica obligatoria detiene la ejecución en un límite atómico y devuelve el cursor exacto. Resolverla aplica todos sus efectos o ninguno y continúa después del punto confirmado sin repetir tiradas.

`advance(n)` intenta completar hasta `n` temporadas y puede devolver menos. La cadencia visual no participa de la semántica del motor.

`SimulationCursor`, `AdvanceRequest`, `AdvanceResult`, checkpoints y atomicidad quedan definidos por ADR-013.

**Alternativas rechazadas**

- Guardar solamente la fase.
- Recalcular la temporada al reanudar.
- Tratar `advance(n)` como salto agregado.
- Delegar decisiones por cadencia.
- Aplicar parcialmente una decisión.

**Impacto**

- El orden y la granularidad del cursor forman parte de `engineVersion`.
- Una temporada no se completa antes de `SEASON_CLOSE`.
- Los checkpoints son obligatorios en interrupciones y cierres.
- El orden aceptado reemplaza la secuencia técnica asumida anteriormente.
- ADR-042 y ADR-043 fijan causalidad, pasos y ventanas sin introducir partidos individuales.

**Tests requeridos**

- Interrupción y reanudación en cada paso y ventana.
- Tiradas y efectos confirmados no se repiten.
- `advance(n)` nunca completa más de `n`.
- Una interrupción puede devolver menos temporadas.
- Cadencia visual neutral.
- Reintentos idempotentes.
- Restauración exacta desde checkpoint.

### DR-014 — Orden y atomicidad de efectos del DSL

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-014](adr/014-event-dsl.md)

**Decisión aceptada**

El DSL es declarativo, data-driven y no ejecuta código arbitrario.

Operadores:

```text
eq neq gt gte lt lte in notIn has notHas
```

Combinadores:

```text
all any not
```

Efectos:

```text
add set multiply append remove emit schedule
```

Todos los paths pertenecen a un catálogo tipado derivado del dominio. Una elección valida primero referencias, paths, tipos, operaciones y estado resultante; luego aplica todos sus efectos o ninguno.

`emit` solo produce hechos de dominio autorizados. `schedule` registra efectos tipados para un cursor futuro válido. El contenido no puede crear entradas de ScoreLedger; scoring solo reacciona a hechos autorizados confirmados.

ADR-014 define `EventDefinition`, `ConditionExpression`, `ModifierDefinition`, `ChoiceDefinition`, `EffectDefinition`, validación, errores, orden canónico, referencias y compatibilidad. No implementa el intérprete.

**Alternativas rechazadas**

- JavaScript o expresiones arbitrarias.
- Paths libres.
- Efectos parciales.
- `createScoreEntry` desde contenido.
- Ignorar operadores, efectos o campos semánticos desconocidos.

**Impacto**

- El panel y los archivos de contenido deben compartir validador.
- El catálogo de paths se vuelve frontera explícita de dominio y seguridad.
- Choices/effects preservan orden semántico.
- Un runtime incompatible rechaza la release para replay oficial.

**Tests requeridos**

- Matriz de tipos por operador y efecto.
- Rechazo de paths y referencias desconocidos.
- Atomicidad de decisiones.
- `emit` limitado a hechos autorizados.
- `schedule` sin tiempos pasados y con idempotencia.
- Prohibición de ScoreLedger directo.
- Compilación canónica con hash estable.
- Rechazo completo de releases incompatibles.

### DR-015 — Taxonomía de versiones

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-015](adr/015-version-taxonomy.md)

**Decisión aceptada**

Toda Career persiste exactamente:

```text
schemaVersion
engineVersion
contentVersion
dataVersion
scoringVersion
```

`schemaVersion`, `engineVersion` y `scoringVersion` usan SemVer. `contentVersion` usa release inmutable identificable, por ejemplo `2026.07.27.1`. `dataVersion` usa snapshot inmutable identificable, por ejemplo `2026.07`.

Major/minor/patch se definen por compatibilidad semántica en ADR-015. Todo cambio que modifique resultados deterministas incrementa al menos una versión participante. Todo cambio competitivo de puntuación incrementa `scoringVersion`.

Replay oficial requiere que el runtime comprenda las cinco versiones y todos los campos semánticos necesarios.

**Alternativas rechazadas**

- Una única versión global.
- Derivar versiones del deploy actual.
- Ignorar campos semánticos desconocidos.
- Editar releases o snapshots publicados.
- Mantener `dataSnapshotVersion` como alias canónico de `dataVersion`.

**Impacto**

- `VersionSet` tiene cinco campos obligatorios.
- APIs, DB, hashes, logs y compartidos oficiales usan los mismos nombres.
- Runtimes y artefactos históricos deben conservarse para replay.
- Los cambios pueden requerir bumps coordinados.

**Tests requeridos**

- Career rechaza un `VersionSet` incompleto.
- Los contratos canónicos no emiten aliases antiguos.
- Matriz de compatibilidad con fixtures aceptados/rechazados.
- Campos semánticos desconocidos bloquean replay oficial.
- Releases y snapshots son inmutables por ID.
- Cada cambio determinista observado tiene un bump participante.
- Golden replay carga exactamente las cinco versiones.

**Aclaración G3B — Bloque 10 (2026-07-28)**

Cada `ScoreLedger` pertenece a una `scoringVersion`. Re-scoring con otra
versión crea otro ledger y no muta el histórico. Los `DomainFact` conservan el
`VersionSet` de la Career; su identidad de simulación no depende de la
`scoringVersion` objetivo usada posteriormente para recalcular puntos.

### DR-016 — Estados definitivos de Career

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-016](adr/016-career-lifecycle.md), aclarado por
  [ADR-062](adr/062-playing-retirement-and-comeback.md)

**Decisión aceptada**

Estados canónicos:

```text
DRAFT
ACTIVE
WAITING_DECISION
RETIRED
COMPLETED
ABANDONED
INVALIDATED
```

Flujo normal:

```text
DRAFT -> ACTIVE <-> WAITING_DECISION -> RETIRED -> COMPLETED
```

`ABANDONED` puede alcanzarse desde `DRAFT`, `ACTIVE`, `WAITING_DECISION` o `RETIRED`, es terminal y no se reabre. `INVALIDATED` conserva toda la evidencia y elimina elegibilidad. `COMPLETED` puede pasar a `INVALIDATED` ante un problema de integridad confirmado.

`RETIRED` significa cierre deportivo ya irreversible para esa Career con
consolidación pendiente. `COMPLETED` significa cierre y scoring final
confirmados. ADR-016 define la matriz completa y las operaciones permitidas.

**Aclaración G3B — Bloque 9 (2026-07-28)**

El retiro deportivo reversible se representa por
`PlayerPlayingStatus = ACTIVE | RETIRED`, no mediante una nueva transición de
`CareerStatus`. Una Career abierta puede estar `ACTIVE` con el jugador
deportivamente `RETIRED`; una decisión de comeback usa
`WAITING_DECISION`. El regreso modifica `PlayerPlayingStatus`, no ejecuta
`CareerStatus.RETIRED -> ACTIVE`.

El primer `RetirementOccurred` no obliga la transición de Career a `RETIRED`.
DR-069 debe decidir el boundary que vuelve irreversible el cierre y habilita
`RetireCareer`. La matriz aceptada de DR-016 no cambia.

**Alternativas rechazadas**

- Unificar `RETIRED` y `COMPLETED`.
- Reabrir `ABANDONED`.
- Borrar carreras invalidadas.
- Impedir `COMPLETED -> INVALIDATED`.
- Permitir `advance` mientras existe una decisión pendiente.
- Reabrir `CareerStatus.RETIRED` para representar comeback.
- Completar la Career al primer retiro deportivo reversible.

**Impacto**

- Abandono deja de ser una pausa.
- Invalidación revoca ranking sin destruir auditoría.
- `WAITING_DECISION` se integra con ADR-013.
- ADR-017 define confirmación, abandono, invalidación competitiva e idempotencia de descubrimientos.
- ADR-062 separa estado deportivo y lifecycle sin añadir transiciones.
- DR-069 bloquea el cursor posretiro y la política de finalización irreversible.

**Tests requeridos**

- Todas las transiciones permitidas y prohibidas de la matriz.
- Terminalidad de `ABANDONED` e `INVALIDATED`.
- `COMPLETED -> INVALIDATED` conserva historial y revoca elegibilidad.
- `RETIRED` no admite temporadas nuevas.
- Un retiro deportivo reversible no cambia Career a `RETIRED` por sí solo.
- Comeback no añade `CareerStatus.RETIRED -> ACTIVE`.
- `COMPLETED` exige cierre y scoring final.
- `WAITING_DECISION` rechaza nuevos avances.
- Idempotencia y auditoría de invalidación.

**Aclaración G3B — Bloque 10 (2026-07-28)**

Solo una Career `COMPLETED`, íntegra y compatible puede producir un
`ScoreSnapshot` final elegible. `PlayerPlayingStatus.RETIRED` y
`CareerStatus.RETIRED` no habilitan ranking definitivo. El primer retiro
deportivo no congela PC; DR-069 conserva el boundary terminal.

### DR-017 — Descubrimientos

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-017](adr/017-discoveries.md)

**Decisión aceptada**

Un descubrimiento se confirma cuando ocurre dentro de una Career y se confirma atómicamente con su `EventInstance`; elegibilidad u observación previa no alcanzan.

Evento base y desenlaces pueden tener IDs separados, por ejemplo:

```text
return_offer
return_offer.accepted
return_offer.rejected
return_successful
```

Claves canónicas:

```text
DiscoveryOccurrenceKey =
careerId + eventInstanceId + discoveryId

ProfileDiscoveryKey =
profileId + discoveryId
```

Los descubrimientos confirmados antes de `ABANDONED` permanecen en el perfil. Una Career `INVALIDATED` no aporta descubrimientos al perfil competitivo público; su historial local/auditable puede conservarse según las políticas posteriores aplicables.

**Aclaración G3B — Bloque 9 (2026-07-28)**

Retiro deportivo, comeback y finalización no cambian el momento de
confirmación. Un `RetirementOccurred` o `ComebackOccurred` puede confirmar su
propio discovery ID si la release lo declara, una sola vez por
`DiscoveryOccurrenceKey`. Volver del retiro no revierte ni reemite
descubrimientos previos; completar la Career tampoco los vuelve a confirmar.

**Aclaración G3B — Bloque 10 (2026-07-28)**

`DiscoveryConfirmed` pertenece al fact ledger de Career, pero no al allowlist
de Scoring. Un discovery, un `EventInstance` o una presentación narrativa no
otorgan puntos por existir.

**Alternativas rechazadas**

- Descubrir contenido al ser elegible.
- Unificar todos los desenlaces bajo un único ID obligatorio.
- Revertir descubrimientos al abandonar.
- Mantener aportes públicos cuya única procedencia es una Career invalidada.
- Borrar evidencia al invalidar.

**Impacto**

- Career conserva ocurrencias y procedencia; UserProfile materializa el estado coleccionable.
- La proyección pública debe poder revocar una procedencia sin borrar otras válidas.
- Los descubrimientos son metaprogreso y no alteran gameplay ni Creation Budget.
- Retención/privacidad siguen en DR-033, DR-037 y DR-028.

**Tests y gates requeridos**

- Elegibilidad sin ocurrencia no descubre.
- IDs base/desenlace se confirman según la release.
- Reintentos no duplican ocurrencia ni perfil.
- Abandono conserva; invalidación excluye la contribución pública.
- Otra procedencia válida mantiene el descubrimiento público.
- Retiro, comeback y completion no duplican discoveries.
- Gate de semántica e idempotencia cerrado; retención legal permanece pendiente.

### DR-018 — Vertical slice

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-018](adr/018-initial-vertical-slice.md)

**Decisión aceptada**

Alcance definitivo inicial:

| Dimensión | Alcance |
|---|---|
| País principal | Argentina |
| Liga europea | España |
| Posiciones del slice | `GK`, `CM`, `ST` |
| Modo | Carrera rápida |
| Contenido | 30 eventos, 5 cadenas narrativas y 6 lesiones |

Debe existir el ciclo completo:

```text
creación -> temporadas -> decisiones -> lesiones -> transferencias
-> títulos/premios mínimos -> retiro -> score -> ranking interno de prueba
```

No incluye Carrera personalizada y no se amplía a 80 eventos antes de validar el slice.

**Alternativas rechazadas**

- Incluir Carrera personalizada en el slice.
- Ampliar primero a 80 eventos.
- Mantener indefinida la liga europea.
- Validar únicamente una temporada parcial.

**Impacto**

- Golden seeds y Monte Carlo se acotan a Argentina, España, `GK`, `CM` y `ST`.
- El ranking es interno de prueba, no leaderboard oficial.
- Catálogos exactos de clubes, competiciones, premios y fuentes siguen en DR-022/025.
- DR-047 y DR-048 registran dos contratos derivados que el conteo y alcance posicional todavía no determinan.

**Refinamiento de scope — G3B Bloque 6 (2026-07-28)**

El modelo competitivo mínimo requiere dos ligas —Argentina y España—, entre
6 y 10 clubes reales detallados por liga, una copa doméstica por contexto,
Libertadores, Champions League y contratos de contexto para los torneos
principales de selección indicados por `MASTER_SPEC` §34.5. No exige fixtures,
plantillas, ligas inferiores completas ni cinco ligas europeas.

Este refinamiento fija clases de abstracción e inventario, no IDs o fuentes.
DR-025 debe elegir entidades/corte/licencias y DR-065 participantes externos,
promotion/relegation y continuidad fuera del tier detallado. DR-018 permanece
resuelta y no autoriza inventar esos datos.

**Refinamiento de scope — G3B Bloque 8 (2026-07-28)**

El inventario de `MASTER_SPEC` §34.5 exige para el slice un premio global, uno
juvenil y tres premios posicionales o de competición, además de contratos para
los torneos principales de selección necesarios. La estructura requiere
`NationalTeamDefinition` real de Argentina, fields para `GK`/`CM`/`ST` y cinco
`AwardDefinition`, sin simular población completa.

Esto no presume que todo jugador sea elegible para Argentina, que jugar en
España habilite su selección, ni qué IDs/nombres concretos corresponden.
DR-025/059/060/068 deben cerrar catálogo, calendario y elegibilidad. DR-018
permanece resuelta sin expandir scope.

**Tests y gates requeridos**

- Carrera completa reproducible por cada posición inicial.
- Seeds con decisión, lesión, transferencia, retiro y cierre.
- Score reconstruible y ranking interno versionado.
- Inventario conforme al contrato de conteo pendiente.
- Ausencia de Carrera personalizada y de expansión prematura.
- Gate de alcance cerrado; gameplay sigue bloqueado por fórmulas/scoring/datos.

### DR-019 — Equivalencia de Carrera rápida y personalizada

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-019](adr/019-creation-budget-equivalence.md)

**Decisión aceptada**

Se define un `Creation Budget` canónico para todo poder inicial. Carrera rápida lo distribuye mediante generación probabilística. Carrera personalizada podrá influir en la distribución, pero no aumentar el presupuesto total ni la distribución de poder esperada; puede conservar variables ocultas aleatorias.

Ambos modos solo compartirán leaderboard después de una validación Monte Carlo versionada que demuestre equivalencia de distribuciones e interacciones, no solo igualdad de un total nominal.

Los valores, costes y tolerancias no se fijan en esta resolución y quedan registrados en DR-045.

**Alternativas rechazadas**

- Presupuestos independientes sin unidad común.
- Más poder total para Carrera personalizada.
- Considerar suficiente el mismo total nominal.
- Exigir ausencia total de azar en personalizada.

**Impacto**

- Toda ventaja inicial debe presupuestarse y validarse de forma autoritativa.
- `DominantFoot.BOTH` consume presupuesto o coste equivalente.
- Carrera personalizada queda fuera del vertical slice.
- Cambios de presupuesto/distribución requieren versión y nueva evidencia.

**Tests y gates requeridos**

- Conservación de presupuesto en toda creación válida.
- Generación rápida reproducible.
- Inputs del cliente no crean poder sin coste.
- Monte Carlo compara distribuciones completas.
- Gate conceptual cerrado; leaderboard compartido bloqueado por DR-045.

### DR-020 — Dificultad y automatización

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-020](adr/020-difficulty-and-automation.md)

**Decisión aceptada**

Presets iniciales:

```text
ASSISTED
STANDARD
EXPERT
```

Solo modifican información presentada. `ASSISTED` muestra más riesgos/consecuencias, `STANDARD` información moderada y `EXPERT` oculta estimaciones/ayudas. Ninguno cambia probabilidades, atributos, Creation Budget, scoring ni resultados.

Las políticas que toman decisiones mecánicas son una dimensión separada, poseen ID/versión y registran procedencia. Su elegibilidad competitiva queda en DR-046.

**Alternativas rechazadas**

- Modificar probabilidades por dificultad.
- Aplicar bonificaciones de atributos o score.
- Incluir automatización dentro de `ASSISTED`.
- Ejecutar políticas automáticas sin versión.

**Impacto**

- El preset queda fuera del hash y de los streams mecánicos.
- UI puede variar explicaciones sin bifurcar el engine.
- Automatización exige catálogo/versionado y decisión competitiva separada.
- Advertencias obligatorias y accesibilidad no pueden ocultarse por preset.

**Tests y gates requeridos**

- Igual estado/seed/versiones/decisiones produce el mismo resultado en los tres presets.
- Cambiar preset no consume azar.
- Solo cambian read models/presentación.
- Toda decisión automática registra política, versión y opción.
- Gate de dificultad cerrado; automatización oficial bloqueada por DR-046.

### DR-023 — Ambidiestro

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-023](adr/023-dominant-foot-both.md)

**Decisión aceptada**

`DominantFoot` admite:

```text
RIGHT
LEFT
BOTH
```

`BOTH` puede seleccionarse en Carrera rápida y, posteriormente, en Carrera personalizada. También puede aparecer por generación aleatoria. No es desbloqueable y consume Creation Budget o coste equivalente.

Si se selecciona en Carrera rápida, el generador distribuye probabilísticamente el presupuesto restante. El coste numérico queda en DR-045.

**Alternativas rechazadas**

- Tratar `BOTH` como desbloqueable.
- Permitirlo solo por generación aleatoria.
- Permitirlo sin coste.
- Inventar un coste antes de calibrar Creation Budget.

**Impacto**

- `DominantFoot` es un value object canónico.
- Selección y generación producen el mismo estado validado.
- Perfil/descubrimientos no controlan disponibilidad.
- La comparabilidad depende del coste versionado y Monte Carlo.

**Tests y gates requeridos**

- Round-trip de los tres valores.
- Selección y generación reproducible de `BOTH`.
- Conservación de Creation Budget.
- Ningún descubrimiento bloquea/habilita el rasgo.
- Gate taxonómico cerrado; balance bloqueado por DR-045.

**Refinamiento G3C-2**

`BOTH` entra en `CreationPowerScore` mediante
`powerFootEffect[position,BOTH]`. Quick/Custom samplean el mismo target de
poder y condicionan el resto del jugador; no se aplica una penalización fija a
ninguna capability. El efecto numérico continúa como
`INITIAL_CALIBRATION_REQUIRED` en DR-045.

### DR-042 — Relación PERFORMANCE / HEALTH / minutos

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-042](adr/042-season-health-performance.md)

**Decisión aceptada**

Antes de producir estadísticas se determinan disponibilidad inicial, estado físico, suspensiones, rol esperado y minutos potenciales.

La temporada se subdivide en ventanas agregadas `Q1`, `Q2`, `Q3` y `Q4`, que no representan partidos. Dentro de cada ventana:

```text
AVAILABILITY -> PRODUCTION -> HEALTH -> CONSEQUENCES
```

Una lesión de Q2 puede afectar Q3/Q4, pero no reescribe Q1/Q2. `ROLE_AND_MINUTES` fija contexto y potencial inicial, no minutos realizados de toda la temporada.

`SimulationCursor` registra temporada, Q opcional, paso, operación y punto de reanudación.

**Alternativas rechazadas**

- Resolver lesiones al final y restar estadísticas.
- Sortear toda la producción con disponibilidad inicial.
- Simular partidos individuales.
- Repetir una ventana al reanudar.

**Impacto**

- ADR-013 queda enmendado antes de implementación.
- SeasonState/SeasonResult agregan evidencia por ventana.
- Cambiar cantidad/orden de ventanas requiere nueva `engineVersion`.
- Fórmulas numéricas siguen en DR-008.

**Tests y gates requeridos**

- Q1–Q4 en orden y totales como suma canónica.
- Lesión Q2 afecta solo ventanas futuras.
- Disponibilidad cero implica minutos/producción participativa cero.
- Interrupción/reanudación por paso sin repetición.
- Gate causal cerrado; fórmulas bloqueadas por DR-008.

**Refinamiento de contrato — G3B Bloque 5 (2026-07-28)**

[ADR-057](adr/057-health-injury-recovery-model.md) no cambia este orden.
`AVAILABILITY(Qn)` contiene dos responsabilidades ordenadas: Health calcula el
componente `MedicalAvailabilityEnvelope` desde estado ya confirmado y una
agregación autoritativa lo combina con disciplina/otras causas antes de Role &
Minutes. `HEALTH(Qn)` consume la exposición realizada y resuelve consecuencias
para Qn+1. Una lesión de Qn nunca reduce retroactivamente Qn y no se inventa una
fecha o partido dentro de la ventana agregada.

**Confirmación G3C-3 (2026-07-29)**

El orden queda matemáticamente congelado como contexto upstream→availability
→role→minutes→appearances/starts→Performance. Solo
`previousPerformanceSignal` de una ventana cerrada puede afectar la siguiente.
Disponibilidad cero determina minutos cero sin consumir draws de participación.

### DR-043 — Ventanas de eventos posteriores

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-043](adr/043-event-opportunity-windows.md)

**Decisión aceptada**

`EVENT_OPPORTUNITIES` deja de ser una fase universal. Ventanas canónicas:

```text
PRESEASON_EVENTS
PERFORMANCE_EVENTS
HEALTH_EVENTS
COMPETITION_EVENTS
MARKET_EVENTS
AWARD_EVENTS
WORLD_EVENTS
POSTSEASON_EVENTS
```

`PERFORMANCE_EVENTS(Qn)` y `HEALTH_EVENTS(Qn)` se ejecutan después de confirmar las consecuencias de Qn y antes de la siguiente Q. Las restantes ventanas siguen a la fase que produce sus hechos. `POSTSEASON_EVENTS` ocurre antes de `SEASON_CLOSE`.

Cada path/fact declara su primer punto de disponibilidad. El compilador rechaza un evento evaluado antes de que existan todos sus hechos requeridos. Cada ventana puede producir cero o múltiples oportunidades sin límites artificiales.

**Alternativas rechazadas**

- Diferir universalmente los hechos a la temporada siguiente.
- Evaluar todo al inicio.
- Añadir una segunda pasada sin identidad.
- Imponer máximos por ventana.

**Impacto**

- ADR-005, ADR-013 y ADR-014 quedan enmendados.
- `OpportunityWindow` y la clave de evaluación participan del replay.
- Un premio puede habilitar contenido después de AWARDS en la misma temporada.
- Orden/puntos de ventana forman parte de `engineVersion`.

**Tests y gates requeridos**

- Hechos de premio nunca se leen antes de `AWARD_EVENTS`.
- El compilador valida disponibilidad.
- Cero/uno/múltiples eventos por ventana.
- Reanudación sin duplicar claves de evaluación.
- Gate de ventanas cerrado; cada catálogo debe declarar requirements.

### DR-044 — Posición efectiva y reconversión

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: No informado en la resolución
- ADR: [ADR-044](adr/044-effective-position-and-retraining.md)

**Decisión aceptada**

Se distinguen:

- `primaryPosition`: identidad futbolística principal actual;
- `secondaryPositions`: posiciones compatibles;
- `effectivePosition`: posición realmente utilizada en una temporada/ventana.

Cada ventana con minutos registra una posición efectiva; estadísticas y fórmulas posicionales usan principalmente esa posición. Una reconversión causal y probabilística puede cambiar la primaria según edad, atributos, entrenador, táctica, capacidades, necesidad del club y decisiones. No existen cambios arbitrarios.

La posición dominante de un scope se deriva del historial de temporadas y minutos por posición efectiva, no de la posición inicial ni de secundarias sin uso. Rankings de carrera usan el scope completo; premios usan su período declarado y contratos `POSITION_SPECIFIC`, `POSITION_GROUP` o `POSITION_AGNOSTIC`.

La ponderación exacta y los empates no están definidos por la decisión recibida y quedan registrados en DR-049, sin inferir una solución.

**Refinamiento de G3B — Bloque 3 (2026-07-27)**

Role & Minutes debe recibir una `effectivePosition` válida antes de resolver la
ventana; no puede inventar una posición ni realizar la reconversión. La
asignación previa sirve como contexto dominante de la Q. Solo
`EffectivePositionUsed` con participación efectiva aporta minutos al historial.
Un futuro `usageByPosition` debe conservar
`sum(positionMinutes) = actualMinutes`.

Este refinamiento no resuelve la matriz/duración de reconversión de DR-048 ni la
ponderación/desempates de DR-049.

**Alternativas rechazadas**

- Usar siempre la primaria actual.
- Reetiquetar estadísticas históricas.
- Dar elegibilidad por secundarias sin minutos.
- Incluir una Career en múltiples cohortes del mismo scope.
- Cambiar posiciones editorialmente.

**Impacto**

- SeasonResult conserva minutos/producción por posición efectiva.
- Player conserva historial de reconversiones.
- Rankings y premios derivan cohortes, no aceptan un campo editable.
- Fórmulas de reconversión siguen en DR-008.
- El uso de posiciones fuera de `GK`/`CM`/`ST` en el slice sigue en DR-048.
- La ponderación y los empates de posición dominante siguen en DR-049.

**Confirmación G3C-3 (2026-07-29)**

Role & Minutes consume una `effectivePosition` por Q y, para el vertical slice,
usa `DOMINANT_ONLY`. `usageByPosition` suma exactamente `actualMinutes`. La
extensión multiposicional deberá asignar shares conjuntamente, nunca samplear
minutos independientes. DR-048/049 ya fueron resueltas por ADR-071; el módulo
no cambia `primaryPosition`.

**Tests y gates requeridos**

- Una posición efectiva dominante por ventana con minutos; todo breakdown
  multiposicional conserva exactamente los minutos totales.
- Cálculo futuro basado solo en historial efectivo, con fixtures de ponderación/empate definidos por DR-049.
- Reconversión sin reescritura histórica.
- Secundarias sin minutos no dan elegibilidad.
- Premios usan el período declarado.
- Gate del modelo posicional cerrado; parámetros dependen de DR-008, alcance del slice de DR-048 y cálculo de dominancia de DR-049.

### DR-052 — Taxonomía matemática, escalas y observabilidad del jugador

- Estado: Resuelta
- Fecha: 2026-07-27
- Responsable: Resolución normativa de G3B — Bloque 1
- ADR: [ADR-052](adr/052-fundamental-player-model.md)
- Especificación: [PLAYER_MODEL_SPEC.md](PLAYER_MODEL_SPEC.md)

**Decisión aceptada**

El estado causal del jugador separa `CAPABILITIES`, `TRAITS` y
`DYNAMIC_STATES`.

Las veinte capabilities canónicas son:

- `TECHNICAL`: `finishing`, `passing`, `ballControl`, `dribbling`, `defending`,
  `goalkeeping`;
- `PHYSICAL`: `acceleration`, `pace`, `strength`, `stamina`, `agility`;
- `MENTAL`: `composure`, `vision`, `decisionMaking`, `positioning`, `workRate`;
- `TACTICAL`: `attackingMovement`, `defensiveAwareness`, `pressing`,
  `tacticalIntelligence`.

Todos los jugadores poseen el catálogo completo y cada capability usa un entero
canónico `0..10000`, inclusive. Valores fraccionarios, no finitos o fuera de
dominio se rechazan sin clamping ni redondeo implícito.

Los traits iniciales son `naturalTalent`, `developmentCapacity`,
`professionalism`, `ambition`, `consistency`, `adaptability`,
`pressureResistance`, `injuryFragility`, `recoveryCapacity` y `longevity`.
También usan `0..10000`; pueden permanecer ocultos.

No existe un `overall` causal ni un `potentialOverall`. Una capacidad efectiva
es derivada y contextual, no estado permanente. El potencial emerge de una
distribución de trayectorias; no se almacena una edad de pico garantizada.

`TruePlayerState` contiene la verdad mecánica. `PlayerKnowledge` contiene
estimaciones, incertidumbre/confianza, punto reproducible y contexto de
observación propios de cada observador.

La generación inicial usa perfiles latentes y distribuciones conjuntas
correlacionadas. Los arquetipos son mezclas estadísticas blandas, no clases
rígidas, y todo perfil compatible conserva probabilidad positiva.

`Creation Budget` se define como poder inicial esperado y equivalencia
estadística, no como suma de atributos. Sus valores y parámetros continúan en
DR-045.

La primera implementación nace directamente con la escala canónica; no existe
persistencia oficial previa de atributos 0–100. Cambios posteriores de catálogo,
dominio o significado revisan `schemaVersion` y toda versión participante del
replay; una proyección de UI no es una migración.

**Alternativas rechazadas**

- 0–100 como escala interna canónica.
- Floating-point 0–1 como persistencia principal.
- Overall o potential overall como fuente causal.
- Catálogos distintos que eliminen capabilities por posición.
- Edad de pico individual garantizada.
- Estado verdadero expuesto automáticamente al usuario.
- Generación uniforme e independiente.
- Arquetipos rígidos.
- Creation Budget como suma trivial de atributos.

**Impacto**

- Cierra el schema conceptual fundamental de `Player`.
- Sustituye el uso previo de `AttributeValue 0–100` como representación
  canónica.
- Separa verdad, conocimiento y presentación.
- Obliga a que desarrollo/declive sean la vía de mutación lenta y que los
  estados dinámicos no escriban capabilities directamente.
- Permite diseñar scouting, potencial percibido y ratings sin duplicar verdad.
- Restringe DR-045, DR-053, DR-055, DR-056 y DR-057, que continúan abiertas en
  sus fórmulas, distribuciones y parámetros.
- Todo cambio futuro de catálogo, dominio o significado debe revisar
  `schemaVersion` y las versiones participantes del replay.

**Parámetros externalizados**

- distribuciones, medias, dispersiones y correlaciones iniciales;
- perfiles latentes, arquetipos y pesos de mezcla;
- precisión e incertidumbre inicial de `PlayerKnowledge`;
- parámetros de maduración;
- función y valor de `Creation Budget`;
- costes de ventajas, incluido `DominantFoot.BOTH`;
- protocolo, métricas y tolerancias Monte Carlo.

**Tests y gates requeridos**

- Validación exacta de enteros `0..10000`.
- Catálogo exacto de veinte capabilities y diez traits iniciales.
- Catálogo completo para todas las posiciones.
- Ausencia de `overall`/`potentialOverall` causales.
- Contratos separados para `TruePlayerState` y `PlayerKnowledge`.
- Estados dinámicos sin escritura directa de capabilities.
- Capacidad efectiva derivada, no persistida.
- Generación correlacionada desde configuración versionada.
- Equivalencia de creación validada por Monte Carlo antes de leaderboard
  compartido.
- Ningún parámetro de balance pendiente hardcoded.

**Refinamiento G3C-2**

La estructura queda realizada matemáticamente mediante generación conjunta por
mixture de factores Normal, sigmoid y `ROUND_HALF_EVEN`. NaturalTalent y
DevelopmentCapacity conservan rutas diferentes. El perfil de maduración es
latente por familia y no contiene peakAge. DR-052 permanece resuelta; los
valores viven en DR-045/053.

### DR-070 — Identidad y versionado del EngineParameterSet

- Estado: Resuelta
- Fecha: 2026-07-29
- Responsable: G3C-1 — Numerical, Stochastic & Calibration Contract
- ADR: [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- Especificación:
  [MATHEMATICAL_CALIBRATION_CONTRACT.md](MATHEMATICAL_CALIBRATION_CONTRACT.md)

**Problema**

G3B externalizó parámetros de gameplay en todos los subsistemas, pero una
Career no tenía un contrato para identificar exactamente los bytes usados. Era
necesario preservar replay e inmutabilidad sin introducir una sexta versión
canónica ni mezclar parámetros de gameplay con scoring, content o data.

También faltaba una política común para runtime matemático, cuantización de
estado y conformidad cross-runtime.

**Decisión aceptada**

Toda Career conserva:

```text
VersionSet
+ parameterSetId
+ parameterSetHash
```

`parameterSetHash` es SHA-256 del payload RFC-8785 canónico e inmutable del
`EngineParameterSet`. Es identidad de contenido, no una sexta versión.
`schemaVersion` gobierna la estructura y `engineVersion` la semántica y los
algoritmos.

En releases oficiales, cualquier cambio del ParameterSet que altere resultados
requiere al menos un patch de `engineVersion`; una misma `engineVersion` no
puede resolver a dos hashes oficiales. Los candidatos de calibración pueden
usar hashes distintos únicamente fuera de Careers oficiales.

Gameplay usa IEEE-754 binary64 dentro de operaciones atómicas. Estado
recurrente se cuantiza una vez al persistir mediante `ROUND_HALF_EVEN`, límites
lógicos explícitos y normalización `-0 → +0`. NaN e infinitos se rechazan.
Scoring conserva `ROUND_HALF_UP` y aritmética decimal/racional exacta.

Las operaciones trascendentales de gameplay atraviesan primitivas canónicas y
golden vectors. Solo runtimes conformes pueden producir replay oficial. Un
guard de worker/calibración puede devolver `INCONCLUSIVE_GUARD_REACHED`, pero
no altera gameplay, lifecycle, facts ni score.

**Alternativas rechazadas**

- Implicar los bytes de parámetros únicamente mediante `engineVersion`.
- Crear una sexta `parameterVersion`.
- Reutilizar `contentVersion` o `dataVersion`.
- Permitir varios hashes oficiales bajo la misma `engineVersion`.
- Persistir doubles recurrentes sin cuantización.
- Usar caps, edad máxima o retiro forzado como protección técnica.

**Impacto**

- Las cinco versiones canónicas de ADR-015 se preservan.
- Replay, checkpoints y compatibilidad competitiva incorporan
  `parameterSetHash`.
- Un ParameterSet publicado es content-addressed, inmutable y retenido mientras
  una Career soportada lo referencie.
- Los parámetros de scoring permanecen bajo `scoringVersion` y fuera de
  `EngineParameterSet`.
- G3C puede comparar ParameterSets con las mismas seeds sin cambiar streams.
- Cambiar parámetros causales oficiales exige revisar `engineVersion`.

**Tests y gates requeridos**

- Canonicalización y hash estables ante distinto orden de propiedades.
- Hash distinto ante cualquier cambio semántico de payload.
- Rechazo de mismatch entre Career, hash, schema y engine compatibility.
- Reapertura exacta del ParameterSet histórico.
- Vectores de `ROUND_HALF_EVEN`, `-0`, NaN e infinitos.
- Golden vectors de primitivas matemáticas en runtimes soportados.
- Prueba de que scoring no carga gameplay parameters ni RNG.
- Prueba de que un execution guard no modifica state/facts/ledger/lifecycle.

## 5. Decisiones bloqueantes pendientes del núcleo

### DR-008 — Fórmulas faltantes del simulador

**Estado:** Parcialmente resuelta — `BLOCKER_G3`; estructura aceptada el
2026-07-28, matemática ejecutable pendiente.

**Problema**

La forma general está documentada, pero no existen fórmulas ejecutables completas para:

- minutos y rol;
- producción por posición;
- desarrollo y declive;
- lesiones, recaídas y recuperación;
- competiciones agregadas;
- mercado y transferencias;
- selección nacional;
- premios;
- valor de mercado;
- reputación y seguidores;
- evolución del mundo;
- retiro.

**Decisión requerida**

Crear una especificación matemática versionada con parámetros, distribuciones, correlaciones, orden, redondeos e invariantes. No programar valores temporales como si fueran reglas finales.

**Resultado de G3A**

[`MATHEMATICAL_ENGINE_SPEC.md`](MATHEMATICAL_ENGINE_SPEC.md) define la superficie conceptual, el grafo causal, los outputs y el contrato que deberá cumplir cada fórmula. Para cerrar DR-008 todavía deben resolverse DR-053 a DR-069, junto con las partes aplicables de DR-021, DR-022, DR-027, DR-048 y DR-049. DR-052 ya está resuelta.

**Avance G3B — Bloque 1 (2026-07-27)**

DR-052 quedó resuelta mediante ADR-052 y
[`PLAYER_MODEL_SPEC.md`](PLAYER_MODEL_SPEC.md): catálogo, escala, separación
temporal, traits, verdad/conocimiento, potencial emergente y generación
correlacionada ya no son preguntas abiertas. DR-008 sigue pendiente porque no se
han definido las ecuaciones ni distribuciones de los subsistemas de gameplay.
La lista bloqueante efectiva pasa a DR-053–DR-064, además de las decisiones
aplicables ya indicadas.

**Avance G3B — Bloque 2 (2026-07-27)**

ADR-053 y
[`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md) cierran para
Development & Aging la unidad por capability, la cadencia Q, la descomposición
causal auditable, las familias de maduración, la ausencia de ceilings y las
fronteras con Health, Club, Role & Minutes y Reconversión. DR-008 sigue
pendiente: no se seleccionaron funciones, distribuciones, covarianza, precisión,
streams, parámetros ni fixtures.

**Avance G3B — Bloque 3 (2026-07-27)**

[ADR-054](adr/054-role-and-minutes-model.md) y
[`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md) separan `SquadStatus`,
`SportingRole` y `EffectiveUsage`; fijan posición efectiva como precondición,
competencia agregada, oportunidad/disponibilidad finitas, resolución jerárquica
rol→share→minutos y causalidad Qn→Qn+1. DR-008 sigue pendiente: no se eligieron
funciones, familias de distribución, precisión, streams, parámetros ni fixtures
de Role & Minutes, y permanecen sus dependencias en DR-021, DR-022 y
DR-055–DR-057.

**Avance G3B — Bloque 4 (2026-07-28)**

[ADR-055](adr/055-performance-and-production-model.md) y
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md) fijan el pipeline
`TrueCapabilities → EffectiveCapabilities → UnderlyingPerformance →
ObservedProduction → PerformanceSummary`, la proyección efectiva única, el
rendimiento multidimensional, los grafos mínimos `GK`/`CM`/`ST`, las señales de
Dynamic States y la agregación Q→temporada. DR-008 sigue pendiente: no se
eligieron funciones, familias de distribución, escalas, precisión,
correlaciones, streams, parámetros, calendario/contexto ni fixtures aprobados.

**Avance G3B — Bloque 5 (2026-07-28)**

[ADR-057](adr/057-health-injury-recovery-model.md) y
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) fijan el estado de salud
compuesto, la disponibilidad médica parcial, exposición/carga, identidad de
episodios, recuperación agregada, recaída relacionada, condiciones
concurrentes y frontera de secuelas con Development. Confirman el orden de
ADR-042 y separan disponibilidad médica de disciplina/otras causas.

DR-008 sigue pendiente: no se eligieron hazard→probabilidad, proceso de
oportunidades, distribuciones, escalas, precisión, correlaciones, orden de
familias, streams, parámetros, catálogo de seis lesiones ni fixtures. DR-064
añade la composición de disponibilidad no médica como dependencia explícita.

**Avance G3B — Bloque 6 (2026-07-28)**

[ADR-022](adr/022-club-competition-world-model.md) y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) fijan
definitions inmutables, `ClubState`, `LeagueState`, `CompetitionState`,
`WorldState`, calendario agregado por Q, contribución del protagonista,
`TeamSupportField`, outcomes correlacionados, shocks jerárquicos, separación
IJL/fuerza dinámica y movilidad de tier.

DR-008 sigue pendiente: no se eligieron dominios, funciones de transición,
familias de outcome/ciclos, cargas de correlación, precisión, streams,
parámetros, catálogo ni fixtures. DR-021 conserva tiempo/calendario y DR-065
añade scope, pools externos y continuidad del protagonista.

**Avance G3B — Bloque 7 (2026-07-28)**

[ADR-058](adr/058-transfer-market-contract-model.md) y
[`TRANSFER_MARKET_CONTRACT_SPEC.md`](TRANSFER_MARKET_CONTRACT_SPEC.md) fijan el
pipeline percepción→necesidad→interés→oferta→negociación→decisión→resultado→
contrato, percepción observer-specific, `ClubNeed`, acuerdos separados,
contrato/expectativa, afiliación dual, Money exacto, loans, free transfers e
historia multiclub.

DR-008 sigue pendiente: no se eligieron funciones/distribuciones de valoración,
interés, oferta, negociación, fee, salary, renewal o preferencias; tampoco
correlaciones, precisión, streams, parámetros ni fixtures. DR-066 añade
inscripción y DR-067 la ubicación mid-season en el cursor.

**Avance G3B — Bloque 8 (2026-07-28)**

[ADR-059](adr/059-national-team-model.md),
[ADR-060](adr/060-awards-model.md) y
[`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md) fijan estados y
contextos propios de selección, Eligibility lógica, field generacional,
pipeline CallUp→Role→Minutes→Performance→Outcome, reutilización de resolvers y
support field. Para Awards separan Definition/Edition, elegibilidad declarativa,
fields comparativos/estadísticos, signal por evidence keys, evaluación
posicional, outcome ordinal y timing `AWARDS → AWARD_EVENTS`.

DR-008 sigue pendiente: no se eligieron funciones/distribuciones de fields,
candidatura, role/minutes internacionales, outcomes, candidate signals,
judging/placement/empates ni correlaciones; tampoco precisión, streams,
parámetros, calendario, fixtures o targets. DR-068 añade nacionalidad deportiva
y elegibilidad del slice como dependencia explícita.

**Avance G3B — Bloque 9 (2026-07-28)**

[ADR-061](adr/061-reputation-and-social-model.md),
[ADR-062](adr/062-playing-retirement-and-comeback.md) y
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
separan Sporting/Public Reputation, awareness/sentiment, Public Attention,
followers, engagement, mercados regionales, estado deportivo y lifecycle.
También fijan evidence keys, shocks causales compartidos, motivation derivada,
causas de retiro y comeback mediante episodios identificados.

DR-008 sigue pendiente: no se eligieron dominios/precisión, ecuaciones de
memoria, distribución de followers, difusión/correlaciones, hazard/competing
risks de retiro o comeback, streams, parámetros, fixtures ni targets. DR-069
añade el cursor posretiro y la finalización irreversible como dependencia
explícita.

**Avance G3B — Bloque 10 (2026-07-28)**

[ADR-010](adr/010-scoring-ledger-and-domain-facts.md) y
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md) cierran la taxonomía,
identidad, catálogo, allowlist y frontera fact→scoring de DR-063. No seleccionan
ninguna fórmula de gameplay ni alteran las matemáticas pendientes de DR-008.

El cierre matemático puede ahora referenciar facts canónicos sin inventar
aliases. DR-008 sigue `BLOCKER_G3` por las funciones, distribuciones,
correlaciones, streams, parámetros y fixtures enumerados en los bloques
anteriores.

**Avance G3C-1 (2026-07-29)**

[ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md) y
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md)
cierran el lenguaje transversal: representación storage/cálculo/presentación,
IEEE-754 controlado, primitivas estables, cuantización de estado,
familias probabilísticas, hazards, factores jerárquicos, `RandomDrawKey`,
`EngineParameterSet`, seed sets y CalibrationTargets.

Las 63 decisiones `PARTIAL` de G3B están asignadas individualmente a
G3C-2–G3C-11. DR-008 permanece abierta: G3C-1 no eligió las fórmulas,
samplers, parámetros ni targets específicos de esos modelos.

**Avance G3C-2 (2026-07-29)**

[ADR-071](adr/071-creation-development-mathematics.md) y
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md)
cierran las familias y ecuaciones de G3B-B02–B06/N02–N04: espacio logit,
maduración logística derivada, acquired/wear con softplus, shocks Normal,
mixture de factores, CreationPower, retraining y dominancia posicional.

Esas ocho filas pasan a `PARTIAL_CALIBRATION`; ya no falta matemática de
familia, pero sí valores del ParameterSet y targets. DR-008 continúa abierta
por G3C-3–G3C-11 y por calibración integrada.

**Avance G3C-3 (2026-07-29)**

[ADR-072](adr/072-role-minutes-and-availability-mathematics.md) y
[`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md) cierran las seis
familias asignadas: stable softmax de role, matriz de persistencia,
PositionCompetition normalizada, unión exacta de availability, Logit-Normal de
minute share, GH10 para expectativa, apportionment y modelo jerárquico de
appearances/starts.

G3B-C04/F03 quedan `RESOLVED_MATH`; C02/C03/C05/C06 quedan
`PARTIAL_CALIBRATION`. DR-064 queda resuelta y DR-054 pasa a calibración.
DR-021 queda parcial únicamente respecto de formatos/generación/integración
temporal. DR-008 sigue abierta por G3C-4–G3C-11, valores de ParameterSet y
calibración integrada.

El cierre debe publicar:

- ecuaciones y orden de evaluación;
- familias de distribución y parametrización exacta;
- escalas, unidades, precisión y redondeo;
- estructura de correlación y contextos de streams;
- parámetros iniciales aprobados para el vertical slice;
- invariantes, golden fixtures y targets/tolerancias Monte Carlo;
- versión participante para cada cambio de resultado.

**Puede avanzarse mientras tanto**

Interfaces, tipos, fixtures declarados como ejemplos y harness de pruebas, siempre que no congelen reglas inventadas.

**Gate**

No se implementan atributos, producción, desarrollo, salud, mercado, selección, premios, mundo o retiro hasta cerrar las decisiones matemáticas que los afectan.

### DR-010 — Scoring incompleto

**Estado:** Parcialmente resuelta — `BLOCKER_G3`; estructura aceptada el
2026-07-28, matemática ejecutable pendiente.

**Problema**

Existen tablas y fórmula agregada, pero faltan decisiones ejecutables:

- percentiles y cohortes por posición;
- fórmula exacta de cada componente de rendimiento;
- PSN sin duplicación;
- valores dentro de rangos de récords/regionales;
- orden de aplicación de topes;
- equivalence groups concretos y casos de más de dos premios;
- tratamiento de temporadas con múltiples ligas;
- IJL definitivo del catálogo;
- definición exacta de “puntaje deportivo previo” para el cap PBR;
- fixtures completos y parámetros iniciales.

**Decisión requerida**

Publicar `scoringVersion` con fórmulas y fixtures de cálculo antes de implementar ScoreLedger definitivo.

**Resultado de G3A**

La sección 22 de [`MATHEMATICAL_ENGINE_SPEC.md`](MATHEMATICAL_ENGINE_SPEC.md) enumera los contratos `SC-01` a `SC-13`: suma final, CC, logros de clubes/selección, premios, rendimiento, récords, bonos bounded, temporadas mixtas, posición dominante, redondeos, anti-duplicación y etiquetas.

El cierre de DR-010 requiere resolver todos esos contratos, consumir el
allowlist ya fijado por DR-063/ADR-010, cerrar DR-049 y publicar fixtures
completos ligados a una `scoringVersion`.

**Avance G3B — Bloque 4 (2026-07-28)**

Performance entrega conceptualmente `ObservedProductionRecorded`,
`PerformanceSummaryRecorded` y `SeasonPerformanceSummaryRecorded`, con
exposición, posición, contexto, presión, splits e incertidumbre. Effective
Capabilities, latentes y traza interna no ingresan al allowlist por defecto.
Esto delimita inputs de SC-02 y SC-07, pero no decide CC, componentes,
percentiles, cohortes, factores ni puntos. DR-010 permanece pendiente; los
facts fueron aprobados posteriormente por DR-063/ADR-010 y el redondeo por
`MASTER_SPEC`.

**Avance G3B — Bloque 6 (2026-07-28)**

Club/Competitions produce outcomes canónicos por competición, títulos,
qualification y participación/contribución autorizada. `leagueCompetitiveStrength`
es contexto deportivo dinámico y no modifica el IJL fijo de
`dataVersion`/`scoringVersion`. `PlayerCompetitiveContribution` no es el
`ContributionCoefficient` de scoring.

Esto delimita inputs de SC-02 a SC-06/SC-08, pero no decide valores, CC,
anti-duplicación, ponderación multi-competición, IJL ni orden de caps. DR-010
permanece pendiente; DR-063 y el redondeo se resolvieron posteriormente.

**Avance G3B — Bloque 7 (2026-07-28)**

MarketValue, `TransferFee` y `SalaryTerms` no crean puntos. Transfers no escribe
`ScoreLedgerEntry` ni depende de scoring. Los movimientos no están en la
allowlist aprobada por DR-010/063, y los segmentos multiclub deben evitar
duplicación por club/competición/Q. Esto no decide SC-10, valores, cohortes,
caps ni anti-duplicación; DR-010 permanece pendiente.

**Avance G3B — Bloque 8 (2026-07-28)**

National Team y Awards producen outcomes deportivos propios y no leen ni
calculan CareerScore. Minutos/Performance internacionales usan contexts
separados; Awards puede emitir múltiples `AwardWon` compatibles y no aplica la
regla de equivalencia 100 %/60 %. DR-063/ADR-010 allowlistan `AwardWon`,
outcomes internacionales y sus referencias bajo rules compatibles.

Esto delimita SC-05/SC-06 y la frontera PSN/PPI, pero no decide puntos,
ContributionCoefficient, equivalencias, posición dominante, cohorts,
anti-duplicación, orden de redondeo o idempotencia. DR-010 permanece pendiente.

**Avance G3B — Bloque 9 (2026-07-28)**

Reputation/Social/Retirement no importan Scoring ni crean `ScoreLedgerEntry`.
Los updates autorizados de Public Reputation, followers y engagement pueden
alimentar PBR mediante DR-010; retiro y comeback no puntúan directamente. Un
Audience milestone no crea puntos; más de un retiro no duplica longevidad ni
score; el scoring final no se congela al primer retiro reversible.

Esto delimita SC-08/SC-09/M14 y la frontera de finalización, pero no decide PBR,
bonos, records, anti-duplicación, freeze u orden de caps. Facts, redondeo e
idempotencia se cerraron posteriormente. DR-010 permanece pendiente y DR-069
debe fijar el boundary terminal.

**Avance G3B — Bloque 10 (2026-07-28)**

[ADR-010](adr/010-scoring-ledger-and-domain-facts.md) y
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md) fijan:

- catálogo/identidad de facts y allowlist por categoría;
- `ScoringRuleDefinition` declarativa y versionada;
- ledger append-only, idempotencia, reversals y hash chain;
- PC como suma de seis subtotales enteros;
- decimal exacto/racional, `ROUND_HALF_UP` por entry y ausencia de otro
  redondeo final;
- valores y fórmulas ya presentes en `MASTER_SPEC`;
- `PRL = records/longevidad` y `PBR = popularidad/redes/achievements
  históricos bounded`;
- re-scoring puro sin RNG ni reejecución de gameplay;
- `ScoreSnapshot` y elegibilidad mínima, sujeta a DR-036/069.

Estado de contratos: SC-01, SC-12 y SC-13 quedan resueltos. SC-02 a SC-11
quedan parciales por fórmulas, cohortes, catálogos, atribución, posición
dominante u orden de caps. DR-063 deja de ser blocker estructural; DR-010
permanece `BLOCKER_G3` hasta cerrar esas diez filas y publicar registry,
fixtures y `scoringVersion` inicial.

**Avance G3C-1 (2026-07-29)**

El contrato transversal confirma que Scoring no tiene streams, sampling ni
acceso a `EngineParameterSet`. Sus parámetros permanecen en un
`ScoringRuleSet` inmutable gobernado por `scoringVersion`; su redondeo
`ROUND_HALF_UP` no se mezcla con la cuantización `ROUND_HALF_EVEN` del estado
de gameplay.

G3B-M02–M11, M15, M17 y M18 quedan asignadas a G3C-11, con calibración
integrada en G3C-12. Esto no cierra ninguna fórmula de SC-02–SC-11 y DR-010
permanece `BLOCKER_G3`.

**Restricción**

Los topes de puntos no deben convertirse en límites de eventos o estadísticas.

**Gate**

No se implementa scoring real ni se crean `ScoreLedgerEntry` de gameplay hasta
aprobar fórmulas, parámetros, orden de equivalence/stacking/caps y fixtures.

### DR-053 — Potencial, desarrollo, declive, pico y longevidad

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** `PARTIAL_CALIBRATION`; estructura y familias
matemáticas aceptadas, ParameterSet inicial pendiente.

**Origen**

El potencial debe ser una distribución de trayectorias, no un valor futuro garantizado. Faltan las reglas ejecutables de `developmentDelta` y decline.

**Decisión requerida**

Definir:

- representación de talento y development capacity;
- familias de curvas y distribución de peak timing/longevidad;
- ecuación de delta por capacidad y Q;
- efecto de edad, minutos, club, entrenador, personality, salud y decisiones;
- covarianza de innovaciones;
- semántica de ausencia de techo duro;
- precisión, persistencia, calibración y tests.

**No asumido**

No existe edad universal de pico, `potentialOverall`, crecimiento garantizado ni declive obligatorio de todas las dimensiones al mismo tiempo.

**Resolución parcial de G3B — Bloque 1 (2026-07-27)**

ADR-052 fija `naturalTalent`, `developmentCapacity` y `longevity` como traits,
elimina `potentialOverall` y cualquier edad de pico garantizada, y permite
latentes de timing de maduración. El pico observado emerge de la trayectoria.
Continúan pendientes la familia de proceso, ecuaciones por capability, timing,
covarianza, declive, precisión y calibración. DR-053 no queda cerrada.

**Resolución parcial de G3B — Bloque 2 (2026-07-27)**

- Responsable: Mathematical Design Board — Development & Aging.
- ADR: [ADR-053](adr/053-development-and-aging-model.md).
- Especificación:
  [`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md).

**Decisión estructural aceptada**

- desarrollo y declive actúan sobre capabilities individuales en cada Q;
- el vector completo se valida y aplica una sola vez dentro de
  `CONSEQUENCES(Qn)`;
- se distinguen causas equivalentes a maduración, desarrollo adquirido, wear e
  innovación estocástica;
- las familias iniciales son `EXPLOSIVE_PHYSICAL`, `STRUCTURAL_PHYSICAL`,
  `TECHNICAL`, `MENTAL` y `TACTICAL`;
- un perfil latente blando parametriza inicio, velocidad, estabilización y
  sensibilidad al declive, sin `peakAge` garantizada;
- no existen ceilings individuales derivados de potencial;
- edad, `naturalTalent`, `developmentCapacity`, `professionalism`, minutos,
  entorno, salud y `longevity` modifican distribuciones, no garantizan signos;
- una lesión solo puede afectar permanentemente después de recuperación y
  posible secuela confirmada;
- se admiten curvas no monotónicas y picos retrospectivos diferentes;
- la reconversión consume el perfil evolucionado, pero no puede provocar
  cambios artificiales de capabilities.

**Alternativas rechazadas**

`overallDelta`, aplicación anual o duplicada, curva universal por edad,
`peakAge` determinista, potential ceilings, mejora garantizada por minutos o
club, lesión que resta capabilities al ocurrir, declive absorbente y
reconversión que ajuste atributos para justificar el resultado.

**Impacto**

G3B-B01 queda resuelta. G3B-B02 a B06 quedan restringidas por una estructura
normativa, pero siguen parciales por matemática o dependencias. La mitad de
potencial de G3B-A06 queda cerrada; calidad efectiva depende de DR-055.

**Tests/gates requeridos**

- vector completo por capability y Q, aplicado atómicamente una sola vez;
- signos diferentes por capability dentro del mismo Q;
- Qn+1 consume el estado confirmado de Qn;
- causas distinguibles y streams reanudables sin repetición;
- joven con delta negativo, veterano con delta positivo y trayectoria con
  resurgimiento;
- fronteras `0..10000` sin clamp ni redondeo implícito;
- lesión sin escritura directa y efecto solo tras secuela confirmada;
- configuración versionada, golden fixtures y Monte Carlo aprobados.

**Pendiente identificado al cerrar G3B**

G3B dejó abiertas forma funcional, distribuciones, covarianza, perfil,
precisión, streams, parámetros, targets y fixtures. G3C-2 cierra a continuación
las partes matemáticas; parámetros y evidencia continúan pendientes.

**Cierre matemático G3C-2 (2026-07-29)**

[ADR-071](adr/071-creation-development-mathematics.md) y
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md)
reemplazan la lista anterior de matemática pendiente:

- capability evolution en logit seguro y `ROUND_HALF_EVEN`;
- suma auditable maturation + acquired − wear + dos shocks;
- maturation mediante derivada logística normalizada y profile jerárquico;
- acquired/wear mediante predictors aditivos y softplus;
- experience saturante y DevelopmentEnvironment convexo;
- Normal inversa canónica por familia/capability;
- soporte de ambos signos a cualquier edad;
- ausencia de mean reversion, peakAge y ceilings.

DR-053 pasa a `PARTIAL_CALIBRATION`: faltan valores de todos los parámetros
`INITIAL_CALIBRATION_REQUIRED`, targets y evidencia. Ya no falta seleccionar
familia, ecuación, cuantización o sampler.

**Refinamiento de interfaz — G3B Bloque 3 (2026-07-27)**

Development y wear consumen `actualMinutes` y carga confirmados, nunca
`expectedMinutes` ni `SportingRole` como si fueran exposición realizada. Role &
Minutes no aplica deltas de capability. G3C-2 fija la curva de experiencia; sus
valores y las señales cuantitativas de carga/Health siguen pendientes de
DR-053/DR-057.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

Development puede consumir señales cerradas de experiencia/rendimiento y
exposición desde `PerformanceSummary`, pero `ObservedProduction` no puede ser la
única causa de un delta. Performance no muta capabilities ni aplica desarrollo.
La versión inicial de G3C-2 no usa `ObservedProduction` como predictor directo;
habilitar otra evidencia exige causa no duplicada y parámetros versionados.

**Refinamiento de interfaz — G3B Bloque 5 (2026-07-28)**

Health entrega `LoadState`, inactividad, condición y `SequelaProfile`
confirmados. Development puede usarlos en `wearComponent` o desarrollo
adquirido sin tomar una lesión como delta directo. `NONE`, `TEMPORARY` y
`PERSISTENT` describen persistencia de la consecuencia de salud; la traducción
a los predictors de wear/desarrollo pertenece a Development; faltan sus
coeficientes y el contrato cuantitativo upstream de Health, no la familia de
ecuación.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Club entrega `developmentQuality`, `managerQuality`, influencia de desarrollo,
estabilidad y `managerContextId/contextVersion` desde el snapshot causal de la
ventana. Development consume estos inputs y no los genera. Un cambio de club o
manager solo afecta ventanas posteriores y ningún entorno garantiza delta
positivo. Dominios, efectos y correlaciones permanecen en DR-053/022.

**Impacto y gate**

Desarrollo por Q, reconversión, calidad percibida, mercado y retiro. Los
refinamientos G3B anteriores se conservan como historia; donde dicen “fórmula
pendiente”, prevalece el cierre G3C-2. La implementación oficial sigue
bloqueada únicamente por ParameterSet/targets/goldens y por las señales
upstream que aún deben cerrar G3C-3/G3C-5/G3C-6.

### DR-054 — Rol, competencia de plantel y distribución de minutos

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** `PARTIAL_CALIBRATION`; estructura aceptada el
2026-07-27 y familias matemáticas aceptadas el 2026-07-29; ParameterSet,
evidencia y targets iniciales pendientes.

**Origen**

Los estados de rol están identificados, pero faltan el modelo conjunto de rol/minutos y su relación con `ROLE_AND_MINUTES` y `AVAILABILITY(Qn)`.

**Decisión requerida**

Definir:

- semántica cuantitativa/parametrización de cada `SportingRole` dentro de su
  distribución;
- representación de competencia abstracta por puesto;
- función/distribución de rol y transiciones;
- distribución conjunta de apariciones, titularidades y minutos;
- tiempo disponible por competición;
- efectos de salud, entrenador, táctica, rol previo y rendimiento;
- precisión, redondeo, correlaciones y streams;
- fixtures de cero minutos, cambios de rol y temporadas multi-competición.

**Dependencias**

DR-021 y DR-022 para calendario, competiciones y máximos físicos de exposición.

**No asumido**

Los roles no crean bandas rígidas de minutos, thresholds de calidad ni garantías de participación.

**Interfaz fijada por G3B — Bloque 2 (2026-07-27)**

Development consumirá minutos y exposición ya confirmados mediante una curva de
experiencia no lineal, parametrizable y con rendimientos decrecientes. Más
minutos no garantiza un delta neto superior. DR-054 continúa abierta para
generar rol, disponibilidad y minutos, y para fijar la exposición exacta que
entrega a Development.

**Resolución parcial de G3B — Bloque 3 (2026-07-27)**

- Responsable: Mathematical Design Board — Role + Minutes.
- ADR: [ADR-054](adr/054-role-and-minutes-model.md).
- Especificación:
  [`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md).

**Decisión estructural aceptada**

- `SquadStatus` (`OUT_OF_SQUAD`, `PROSPECT`, `SQUAD_PLAYER`, `FIRST_TEAM`),
  `SportingRole` (`BENCH`, `ROTATION`, `STARTER`, `KEY_PLAYER`, `STAR`) y
  `EffectiveUsage` son conceptos distintos;
- `PROSPECT` puede coexistir con cualquier rol deportivo;
- Role & Minutes consume una `effectivePosition` válida y un `tacticalFit`
  derivado; no reconvierte ni persiste fit como capability;
- `managerTrust` es un estado dinámico separado y un modificador probabilístico,
  no un threshold;
- `PositionCompetition` representa fuerza, profundidad y estabilidad agregadas
  por posición/contexto sin simular competidores;
- `TeamMinutesOpportunity` es un input finito de calendario y
  `AvailabilityEnvelope` lo reduce a `availableTeamMinutes`;
- el rol surge de una distribución contextual y los minutos de un
  `minuteShare ∈ [0,1]`, conservando
  `0 <= actualMinutes <= availableTeamMinutes <= teamMinutes`;
- rol, edad, calidad o confianza no asignan bandas fijas ni garantizan minutos;
- el orden es estado→posición/disponibilidad→rol/expectativa→minutos→Performance
  →actualizaciones para Qn+1, sin recalcular Qn;
- minutos son la exposición causal principal; appearances/starts se derivan
  después y cumplen `starts <= appearances`;
- uso multiposicional conserva minutos y club/selección tienen oportunidades y
  facts separados;
- outputs mínimos conceptuales son `WindowAvailabilityAssessed`,
  `SportingRoleAssigned`, `expectedMinutes` como signal, `MinutesRecorded`,
  `EffectivePositionUsed` y `AppearanceSummaryRecorded`.

**Alternativas rechazadas**

Enum único de siete roles, `PROSPECT = pocos minutos`, porcentajes fijos por
rol, thresholds, cooldowns, `managerTrust` como calidad, `tacticalFit` como
capability, plantilla ficticia completa, rol/minutos independientes, feedback
instantáneo de Performance, y duplicación de minutos entre posiciones,
competiciones o selección.

**Impacto**

G3B-C01 queda resuelta. G3B-C02 a C06 quedan estructuralmente restringidas pero
parciales por fórmulas/dependencias. G3B-C07 queda como calibración externalizada.
Performance recibe posición/rol/minutos confirmados; Health produce
disponibilidad médica y una frontera separada compone disponibilidad agregada;
Club/Competitions produce competencia, táctica y oportunidad;
Development consume solo exposición realizada.

**Tests/gates requeridos**

- schemas separados y fixture `PROSPECT + STAR`;
- ningún rol contiene porcentajes, thresholds, cooldowns o caps editoriales;
- posición válida anterior a la resolución y no reconversión interna;
- competencia agregada sin plantilla completa;
- invariantes de oportunidad, disponibilidad y minutos;
- mismo rol con realizaciones diferentes y cero oportunidad sin `NaN`;
- `starts <= appearances`;
- conservación de minutos por posición/competición/contexto;
- Performance de Qn no altera minutos de Qn;
- reanudación sin repetir rol, minutos o streams;
- parámetros/versiones, golden fixtures y Monte Carlo aprobados.

**Pendiente histórico antes de G3C-3**

Forma funcional y familias de distribución de rol/share, escalas, precisión,
redondeo, correlaciones, contexts de streams, parámetros iniciales, mapping de
disponibilidad, derivación de appearances/starts, splits por competición,
targets y fixtures. También deben cerrarse las interfaces ejecutables de
DR-021, DR-022, DR-055, DR-056 y DR-057. G3C-3 cierra más abajo las familias
locales; valores, targets y producers upstream siguen sin autorizar gameplay.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

La evidencia previa que Role & Minutes puede leer queda delimitada a summaries
cerrados con rendimiento, sorpresa, exposición, contexto e incertidumbre.
Performance no recalcula rol/minutos y la misma Q no consume su propio
resultado. Los splits de producción preservan exactamente los minutos y
posiciones recibidos. Distribuciones de rol/share, efecto de evidencia y
asignación multi-contexto continúan abiertas en DR-054/056/021/022.

**Refinamiento de interfaz — G3B Bloque 5 (2026-07-28)**

Health produce exclusivamente `MedicalAvailabilityEnvelope` con
`availabilityShare ∈ [0,1]`, restricciones, razones médicas e incertidumbre.
Una agregación separada lo combina con fuentes disciplinarias y otras para
producir `AvailabilityEnvelope`. Role & Minutes consume el aggregate y conserva
ownership de `actualMinutes`.

El texto anterior que atribuía a Health un envelope con lesión, suspensión y
otras causas queda reemplazado. La fórmula de composición, solapamientos,
precedencia y owner de disciplina siguen en DR-054/DR-064. DR-054 permanece
`BLOCKER_G3`.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Club es owner de `PositionCompetition` y `ManagerContext`; Competitions/Calendar
es owner de `TeamMinutesOpportunity`. La oportunidad incluye `seasonId`, Q,
scope y breakdown por competición y representa tiempo físicamente ocupable por
un jugador. Role & Minutes no simula calendario, rivales ni plantilla.

La suma de splits de oportunidad/minutos debe conservar totales. Construcción,
precisión, distribución y calendario siguen en DR-021/022/054; la composición
de disponibilidad permanece en DR-064.

**Cierre matemático G3C-3 (2026-07-29)**

- Responsable: G3C-3 — Role & Minutes Mathematical Closure.
- ADR:
  [ADR-072](adr/072-role-minutes-and-availability-mathematics.md).
- Especificación:
  [`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md).

**Decisión matemática aceptada**

- `RoleQualitySignal` deriva de `PositionSuitability`, sin Overall;
- `SportingRole` usa stable softmax sobre utilities parametrizadas;
- la persistencia usa una matriz completa de role anterior→candidato y nunca
  bloquea transiciones;
- `PositionCompetition` es una combinación convexa de strength, depth y
  entrenchment, con efecto monótono negativo sobre oportunidad;
- availability se compone por unión exacta de asignaciones de indisponibilidad
  sobre oportunidad agregada;
- condicionado al role, minute share usa Logit-Normal con shocks compartido y
  específico;
- `expectedMinutes` es expectativa pre-sample mediante GH10 y permanece
  `INTERNAL_SIGNAL`;
- minutos persistidos usan `ROUND_HALF_EVEN`;
- la asignación por competición usa softmax conjunto y apportionment con caps
  físicos;
- appearances/starts usan Bernoulli jerárquicos condicionados por minutos y
  capacidad agregada;
- club/selección usan adapters y scopes separados;
- los draws usan namespace `role-minutes` y keys estables de ADR-070.

**Alternativas rechazadas**

Thresholds de role, porcentajes fijos, bonus único de persistencia, Beta
universal, roles/minutos independientes, suma/min/producto de availability,
división simple por 90, fixtures inventados y streams compartidos con
Performance/Health.

**Impacto**

G3B-C04 y F03 quedan `RESOLVED_MATH`; C02, C03, C05 y C06 quedan
`PARTIAL_CALIBRATION`. DR-064 queda resuelta. Las interfaces upstream de
managerTrust, Performance, Health y Club/Calendar no reabren la familia
matemática local.

**Parámetros aún requeridos**

Utilities, transition matrix, quality normalization, competition weights,
minute intercepts/coefs/sigmas, allocation, appearances/starts y adapters.
Todos residen en `EngineParameterSet.roleMinutes`.

**Tests/gates G3C-3**

- goldens de softmax, persistence, GH10, Logit-Normal y half-even;
- unión de overlaps y errores de contrato;
- cero availability con consumo RNG exacto;
- sums/caps por competición/posición;
- appearances/starts e invariantes de capacidad;
- contexts club/selección y aislamiento de streams;
- properties de monotonicidad de expectativa;
- Monte Carlo `RM-C01–C12`.

### DR-055 — Calidad efectiva, rendimiento y producción por posición

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** Parcialmente resuelta; estructura aceptada el
2026-07-28, matemática ejecutable pendiente.

**Origen**

G3A distingue capacidad, calidad efectiva, rendimiento y percepción y propone el mínimo estadístico para `GK`, `CM` y `ST`, pero faltan definiciones y distribuciones ejecutables.

**Decisión requerida**

Definir:

- proyección de capacidades a calidad efectiva por posición/rol;
- estadísticas mínimas y sus identidades;
- generación jerárquica de exposición, oportunidades, conversiones e índices;
- familias de distribución, sobredispersión y colas;
- shocks compartidos y matriz de correlación;
- ajuste por club, liga, competición, físico, minutos y contexto;
- agregación Q → temporada;
- precisión, redondeo, streams y tests por posición.

**No asumido**

No se sortearán estadísticas relacionadas de forma independiente, no se compararán posiciones mediante goles universales y no se fijarán caps editoriales.

**Resolución parcial de G3B — Bloque 1 (2026-07-27)**

ADR-052 elimina el overall causal y establece que la capacidad efectiva se
deriva de capabilities verdaderas, estados dinámicos y contexto sin persistirse
como atributo. También separa calidad, rendimiento y conocimiento observable.
Continúan pendientes la función de proyección, el objeto de rendimiento y todas
las distribuciones de producción. DR-055 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

Performance consumirá `effectivePosition`, `SportingRole`, `actualMinutes`,
disponibilidad y contexto ya confirmados. No puede recalcular minutos de Qn.
Debe producir un resumen de evidencia de una ventana cerrada para que Role &
Minutes lo consuma en Qn+1 sin duplicar el cálculo. La estructura, escala,
distribución y precisión de esa evidencia siguen pendientes; DR-055 no queda
cerrada.

**Resolución parcial de G3B — Bloque 4 (2026-07-28)**

- Responsable: Mathematical Design Board — Performance, Form y producción.
- ADR: [ADR-055](adr/055-performance-and-production-model.md).
- Especificación:
  [`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md).

**Decisión estructural aceptada**

- el pipeline normativo es `TrueCapabilities → EffectiveCapabilities →
  UnderlyingPerformance → ObservedProduction → PerformanceSummary`;
- existe una única proyección contextual de `EffectiveCapabilities`, derivada y
  no persistida, que no muta capabilities;
- UnderlyingPerformance es multidimensional y no un rating causal;
- `actualMinutes` es exposición cerrada y Performance no la recalcula;
- sparse exposure conserva producción extrema y separa fuerza de evidencia;
- conteos se resuelven mediante procesos discretos correlacionados, nunca
  redondeando expectativas;
- `consistency` afecta principalmente dispersión/volatilidad;
- raw production no se reescribe por competition strength;
- `ST` persiste al menos goles/asistencias y separa oportunidades, chance
  quality y conversión/creación;
- `CM` persiste goles/asistencias y evidencia de progresión, creación, defensa y
  control;
- `GK` persiste al menos atajadas, goles concedidos y vallas invictas con
  exposición auditable, separando aporte individual y entorno defensivo;
- presión se conserva como breakdown de exposición, rendimiento, producción y
  evidencia; no es bonus editorial;
- Q1–Q4 consolidan un `SeasonPerformanceSummary` sin nuevo sorteo ni promedio
  simple;
- no existen caps editoriales ni eventos especiales que fuercen records;
- Performance emite señales para owners de Dynamic States y no escribe sus
  estados.

**Alternativas rechazadas**

Overall o rating causal, EffectiveCapabilities persistidas, producción como
proxy de capacidad, stats independientes, expectativas redondeadas, goles como
métrica universal, goles concedidos como calidad GK, feedback instantáneo sobre
minutos, caps de outliers, records forzados y parámetros provisionales
hardcoded.

**Impacto**

G3B-A06 y G3B-D01 quedan resueltas estructuralmente. G3B-D02 a D09 quedan
restringidas por una estructura normativa y siguen parciales por matemática o
dependencias. G3B-D10 queda como calibración externalizada. Market, Selection,
Awards, Reputation y Scoring reciben contratos observacionales sin acceso a
latentes verdaderos.

**Tests/gates requeridos**

- proyección efectiva pura y única, sin mutación ni segunda verdad;
- cero minutos produce cero producción participativa;
- conteos discretos correlacionados y reproducibles;
- fixtures `GK` validan exposición, atajadas y vallas invictas;
- sparse/high exposure preservan raw production y distinta incertidumbre;
- fuerza de competición no reescribe contadores;
- Qn no reabre rol/minutos de Qn;
- Dynamic States solo cambian mediante su owner;
- Q→temporada conserva splits y no vuelve a sortear;
- outliers no se truncan ni se fuerzan;
- schemas concretos conformes a facts/allowlist de DR-063/ADR-010;
- parámetros, precisión, streams, golden fixtures y Monte Carlo versionados.

**Pendiente para cerrar DR-055**

Forma funcional de EffectiveCapabilities y UnderlyingPerformance; dominios,
escalas y precisión; familias exactas de conteo/conversión; sobredispersión,
matriz/cópula de correlación y jerarquía de shocks; definiciones ejecutables de
oportunidades; parámetros posicionales; agregación y evidence strength;
contexts de streams; parámetros iniciales; targets, tolerancias y fixtures.
También deben cerrarse los inputs de DR-021/022 y DR-057; los facts ya están
cerrados por DR-063/ADR-010.
DR-055 conserva estado `BLOCKER_G3`; ADR-055 no autoriza implementar gameplay.

**Alcance adicional detectado**

`MASTER_SPEC` también enumera disciplina y, para GK, errores, penales y
distribución. Los mínimos de ADR-055 no los eliminan, pero todavía no está
decidido cuáles deben persistirse en el vertical slice, cuál es su owner y qué
consumidor justifica cada contador. Esta decisión permanece dentro de
DR-055/DR-063; no se completa por inferencia.

**Refinamiento de interfaz — G3B Bloque 5 (2026-07-28)**

Performance consume fitness, fatigue y restricciones médicas confirmadas al
inicio de Q. Entrega exposición/minutos e intensidad física contextual
realizados a Health después de cerrar producción. Un rating, la producción
observada o una mala actuación no son proxies automáticos de carga y no generan
lesión. La función que traduce estas señales sigue en DR-055/DR-057.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

`PerformanceContext` recibe attack/defensive/control environment, rival/field,
dificultad, `leagueCompetitiveStrength`, presión y táctica desde el snapshot de
Q. Performance puede proyectarse a `PlayerCompetitiveContribution` por
competición; esa vista no es CC, score ni rating causal. `TeamSupportField`
excluye al protagonista. Fórmulas, dominios y correlaciones permanecen en
DR-055/022.

**Refinamiento de interfaz — G3B Bloque 8 (2026-07-28)**

National Team reutiliza el pipeline común con
`PerformanceContext.kind = NATIONAL_TEAM`, minutos y acumuladores propios.
Selection/Awards pueden consumir una proyección purpose-scoped de
`UnderlyingPerformance`, summaries, producción, presión, exposición y evidencia
sin acceder a capabilities verdaderas. Cuando la semántica es conocimiento de
un observador, la proyección pasa por `PlayerKnowledge`.

ST, CM y GK conservan señales propias. Errores, penales y métricas adicionales
de distribución GK siguen pendientes de DR-055/063; no se crean para llenar un
premio. Fórmulas, escalas, precisión y facts continúan abiertos.

### DR-056 — Dinámica de forma, confianza y feedback temporal

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** Parcialmente resuelta; ownership y dinámica
conceptual aceptados el 2026-07-28, matemática ejecutable pendiente.

**Origen**

Forma y confianza deben persistir parcialmente, reaccionar a rendimiento y evitar feedback loops, pero faltan escala y dinámica.

**Decisión requerida**

Definir:

- si forma y confianza son estados persistidos separados;
- escalas, niveles de referencia y visibilidad;
- persistencia/reversión;
- residual de rendimiento utilizado como evidencia;
- función de saturación de influencia;
- shocks, correlación y efecto de eventos;
- orden Qn → Qn+1 y tests de estabilidad.

**No asumido**

No se resetean automáticamente por temporada ni se deja que el rendimiento de Qn modifique circularmente el sorteo ya cerrado de Qn.

**Resolución parcial de G3B — Bloque 1 (2026-07-27)**

`form`, `confidence`, `morale` y `managerTrust` quedan identificados como
`DYNAMIC_STATES` separados de capabilities, traits, rol y conocimiento. Una
fluctuación temporal no puede mutar directamente una capability. Siguen
pendientes dominios, persistencia, evidencia, reversión, saturación, shocks y
orden de actualización. DR-056 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

`managerTrust` puede modificar probabilísticamente rol/minutos usando solo el
estado confirmado al inicio de Q. La evidencia de Performance en Qn puede
actualizarlo en `CONSEQUENCES(Qn)` para Qn+1, no circularmente para Qn. No
reemplaza calidad, rol, forma o `tacticalFit`. Dominio, evidencia autorizada,
persistencia, reversión, shocks y función de actualización continúan pendientes.

**Resolución parcial de G3B — Bloque 4 (2026-07-28)**

`form`, `confidence`, `morale` y `managerTrust` permanecen separados.
Performance consume sus snapshots y emite señales de sorpresa, exposición,
evidencia, presión y contexto; los owners aplican los cambios después de cerrar
Q. Form debe admitir persistencia, regresión/saturación, respuesta al residual y
ruido sin impedir rachas extraordinarias. Confidence no es form y morale no es
una copia del resultado deportivo. Fitness/fatigue pertenecen a Health.

Continúan pendientes dominios, reference levels, persistencia, función de
regresión/saturación, residual normalizado por evidencia, shocks, correlaciones,
eventos, precisión, streams, parámetros, fixtures y visibilidad. DR-056 no queda
cerrada.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Un cambio de `ManagerContext` tiene punto causal de vigencia y nunca reescribe
`managerTrust` o rol de ventanas cerradas. Puede aportar señal para el owner de
`managerTrust` en una transición posterior; no lo resetea ni lo determina por
threshold. La dinámica sigue abierta en DR-056.

**Refinamiento de interfaz — G3B Bloque 8 (2026-07-28)**

`NationalTeamSelectionTrust`/incumbency es un estado internacional separado de
`managerTrust` de club, form, confidence y sporting reputation. Puede consumir
historia confirmada y modificar distribuciones futuras, pero no garantiza
convocatoria o rol. Su dominio, persistencia, interacción y parámetros quedan
en DR-056/059.

**Refinamiento de frontera — G3B Bloque 9 (2026-07-28)**

Sporting/Public Reputation, Public Attention, Engagement y
`PlayerPlayingStatus` no se agregan como aliases al vector de Dynamic States.
`CareerMotivationAssessment` es derivada de `ambition`, morale, historia y
contexto; no añade otro trait/estado con dinámica duplicada. DR-056 conserva
dominios y ecuaciones de morale, mientras DR-061/062 poseen reputación y
motivation/retirement.

### DR-057 — Hazard de salud, lesión, recuperación y recaída

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** Parcialmente resuelta; estructura aceptada el
2026-07-28, matemática ejecutable y catálogo pendientes.

**Origen**

ADR-042 fija el orden causal, pero no el hazard ni las distribuciones de lesión.

**Decisión requerida**

Definir:

- exposiciones que generan oportunidades;
- hazard por familia y relación hazard → probabilidad;
- procedimiento que admite múltiples ocurrencias sin cupos;
- catálogo mecánico de familia/severidad;
- duración y curva de recuperación;
- recaída, retorno y secuelas;
- efectos de edad, carga, condición, historial, fragilidad, posición y calidad médica;
- separación respecto de lesiones extradeportivas de contenido;
- streams, precisión, calibración y fixtures.

**No asumido**

No habrá una lesión máxima por Q/temporada, cooldown ni regla automática “cero minutos = cero riesgo total”.

**Resolución parcial de G3B — Bloque 1 (2026-07-27)**

`fitness` y `fatigue` quedan como `DYNAMIC_STATES` separados de las capabilities
físicas; `injuryFragility` y `recoveryCapacity` quedan como traits persistentes.
Siguen pendientes condición, carga, disponibilidad, exposiciones, hazards,
familias, severidad, recuperación, recaída y secuelas. DR-057 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 2 (2026-07-27)**

Carga, fitness y salud confirmadas pueden alimentar desarrollo o wear, pero no
escriben capabilities directamente. Una lesión debe recorrer `health event ->
injury state -> recovery -> possible sequela`; solo el estado o una secuela
confirmada puede producir consecuencias posteriores de capability/desarrollo.
La misma lesión puede terminar en recuperaciones diferentes.

Quedan abiertos todos los hazards, catálogos, curvas de recuperación, recaída,
probabilidad/persistencia de secuelas y magnitudes. DR-057 conserva estado
`BLOCKER_G3`.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27; corregido por Bloque 5)**

La intención de limitar `TeamMinutesOpportunity` sin reescribir ventanas
cerradas se conserva. La atribución del envelope agregado a Health se reemplaza
por el contrato de Bloque 5: Health solo produce el componente médico.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

Performance consume `fitness` y `fatigue` confirmados y puede resolver efectos
diferentes por capability family. Al cerrar la Q entrega carga/minutos e
intensidad contextual a Health. No infiere lesión, recuperación o recaída desde
un rating o una mala actuación. La representación de intensidad, actualización
de fitness/fatigue y hazard permanecen en DR-057.

**Resolución parcial de G3B — Bloque 5 (2026-07-28)**

- Responsable: Mathematical Design Board — Health, Injuries & Recovery.
- ADR: [ADR-057](adr/057-health-injury-recovery-model.md).
- Especificación:
  [`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md).

**Decisión estructural aceptada**

- Health separa `fitness`, `fatigue`, `LoadState`, condiciones activas,
  `InjuryEpisode`, recuperación, secuelas e historia;
- `injuryFragility`, `recoveryCapacity` y `longevity` son traits distintos y
  `medicalQuality` pertenece al entorno;
- Health produce `MedicalAvailabilityEnvelope` parcial, no rol ni minutos;
- disciplina y otras causas se combinan en un `AvailabilityEnvelope` agregado
  fuera de Health;
- exposición admite competición, entrenamiento/background, non-football y
  causas externas; cero minutos no implica riesgo total cero;
- el hazard es contextual, trazable y por oportunidad, sin thresholds, caps,
  cuotas, cooldowns ni máximo editorial de condiciones;
- `InjuryOccurred` se separa del `InjuryEpisode` persistente con identidad,
  familia, severidad, origen y relaciones causales;
- se permiten condiciones concurrentes cuando son lógicamente compatibles;
- recuperación esperada y realizada son distintas y existen estados
  equivalentes a `INJURED`, `REHABILITATION`, `LIMITED_RETURN` y
  `FULLY_AVAILABLE`;
- recaída/agravamiento referencia un episodio previo;
- una secuela confirmada es `NONE`, `TEMPORARY` o `PERSISTENT`; Health no
  escribe capabilities y Development posee la consecuencia permanente;
- el pipeline de 38 operaciones no cambia: lesión de `HEALTH(Qn)` afecta Qn+1;
- una causa externa autorizada no se vuelve a sortear como hazard deportivo y
  conserva equivalencia narrativa de ADR-012.

**Alternativas rechazadas**

Health score único, disponibilidad binaria, Health como owner de suspensiones,
porcentaje fijo de lesión, minutos como única exposición, `currentInjury`
único, duración fija, `injuredUntil`, recaída sin vínculo, lesión que resta
capabilities, evento externo duplicado y retroactividad dentro de Q.

**Impacto**

G3B-E01 queda resuelta estructuralmente. G3B-E02 a E07 quedan restringidas y
parciales por matemática/contenido. G3B-E08 queda externalizada. Se refinan
B02/B04/B05, C04–C06, D02/D05–D09, F01/F04, L02/L04 y DR-063.

**Tests/gates requeridos**

- shares médicos 0, parciales y 1;
- aggregate sin atribuir disciplina a Health;
- múltiples condiciones compatibles e identidad idempotente;
- cero/una/múltiples ocurrencias sin caps;
- recuperación estimada distinta de la realizada;
- recaída con episodio padre;
- secuela sin escritura directa de capabilities;
- lesión Q2 con efecto solo Q3/Q4;
- evento externo sin doble sorteo;
- replay sin repetir oportunidades, episodios ni facts;
- parámetros, precisión, orden y streams versionados;
- golden/property tests y Monte Carlo contra targets aprobados.

**Pendiente para cerrar DR-057**

Forma funcional del hazard y su conversión a probabilidad; proceso exacto de
oportunidades; familias/distribuciones de severidad, duración, recuperación,
recaída y secuela; dominios/transiciones de fitness/fatigue; composición médica
de condiciones; precisión/cuantización; orden canónico y contextos de streams;
taxonomía/seis lesiones; parámetros iniciales; targets, tolerancias y fixtures.
DR-057 conserva estado `BLOCKER_G3`; ADR-057 no autoriza gameplay.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Club/Competitions entrega `medicalQuality`, schedule difficulty, congestión y
exposición contextual desde el snapshot de Q. Health consume esos inputs sin
generarlos; `medicalQuality` sigue separado de `recoveryCapacity` y nunca
elimina riesgo. La traducción cuantitativa continúa en DR-057/022.

**Refinamiento de interfaz — G3C-3 (2026-07-29)**

Para integrarse con la composición resuelta por DR-064/ADR-072, G3C-5 deberá
entregar, por competición/Q, una asignación médica de intervalos sobre
ordinales de oportunidad además de share/restrictions. Health sigue sin asignar
minutos ni poseer disciplina. La asignación debe ser consistente con el
`MedicalAvailabilityEnvelope`; su generación matemática permanece en DR-057.

### DR-058 — Interés, ofertas, transferencias y valor de mercado

**Estado:** Parcialmente resuelta — estructura aceptada el 2026-07-28;
matemática, tiempo, moneda/calibración, elegibilidad y fixtures pendientes.  
**Clasificación:** `BLOCKER_G3` para el flujo del slice; calibración monetaria
vinculada a DR-027.

**Origen**

La especificación enumera factores, pero no separa matemáticamente interés, oferta, negociación, movimiento y estimación de valor.

**Decisión requerida**

Definir:

- modelo de clubes candidatos y necesidad posicional;
- probabilidad y multiplicidad de intereses/ofertas;
- uso exclusivo de calidad/potencial percibidos;
- contrato de oferta y negociación;
- interrupción/continuación exacta en `MARKET`;
- resultado y actualización de contexto;
- modelo de valor simulado, incertidumbre y relación no circular con ofertas;
- streams, precisión, datos/calibración y tests.

**Dependencias**

DR-022 para mundo/clubes y DR-027 para moneda, unidad y calibración monetaria.

**No asumido**

Interés no implica oferta; valor no implica precio de transferencia; no se accede al potencial verdadero.

**Conflicto revelado por G3B — Bloque 3 (2026-07-27)**

La separación de ADR-054 vuelve ambiguo el campo exploratorio `Contract.role`.
DR-058/G3B-G06 debe decidir si representa una promesa contractual separada,
qué estados admite y cómo puede influir en rol, `managerTrust`, moral o
negociación. No se lo identifica por inferencia con `SquadStatus` ni con el
`SportingRole` realizado en cada Q.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

Market recibe rendimiento reciente, exposición, producción, contexto,
`pressureBreakdown` e incertidumbre observables/perceptibles. No accede a
EffectiveCapabilities, UnderlyingPerformance oculto, capabilities verdaderas o
potencial verdadero. La función de interés, oferta, transferencia y valor sigue
abierta; este contrato no cierra DR-058 ni DR-027.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Market puede consumir fuerza deportiva, prestigio, `financialPower`,
PositionCompetition/necesidades y contexto league/world del club. Ninguno
garantiza interés u oferta. `financialPower` no es `marketValue` y
`Contract.role` continúa separado de `SquadStatus`, `SportingRole` y
`EffectiveUsage`. Este refinamiento fue sustituido por la resolución parcial
del Bloque 7: DR-058/027 ya tienen estructura/representación aceptadas, pero
siguen abiertas en matemática y calibración.

**Resolución parcial de G3B — Bloque 7 (2026-07-28)**

- Responsable: Mathematical Design Board — Transfers, Market & Contracts.
- ADR: [ADR-058](adr/058-transfer-market-contract-model.md).
- Especificación:
  [`TRANSFER_MARKET_CONTRACT_SPEC.md`](TRANSFER_MARKET_CONTRACT_SPEC.md).

**Decisión estructural aceptada**

- el pipeline canónico es
  `MarketPerception → ClubNeed → TransferInterest → TransferOffer →
  TransferNegotiation → PlayerDecision → TransferOutcome → ContractState`;
- percepción/valor son observer-specific, compatibles con `PlayerKnowledge` y
  usan Performance, exposición, contexto e incertidumbre, no latentes
  verdaderos;
- Club/World es owner de `ClubNeed`, `PositionScarcity` y ciclos de mercado;
- `PlayerClubFit` es derivado y contextual;
- interés deportivo y viabilidad financiera permanecen separados;
- `MarketValueEstimate`, `TransferFee` y `SalaryTerms` son conceptos distintos;
- Money usa unidades menores enteras exactas y `currencyCode`, sin moneda o
  conversión implícita;
- `Contract` es entidad identificada con período de dominio, salary, cláusulas
  tipadas, status y links predecesor/sucesor;
- `ContractExpectation = DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE` reemplaza
  `Contract.role` y no asigna rol/minutos;
- renovación crea contrato sucesor y conserva el anterior;
- acuerdo de clubes y acuerdo del jugador son estados diferentes;
- `PendingDecision` congela términos y reanuda sin resorteo;
- se soportan `PERMANENT_TRANSFER`, `LOAN` y `FREE_TRANSFER`;
- préstamo distingue club contractual de club deportivo y conserva historia;
- una temporada puede contener segmentos de múltiples clubes sin reatribución;
- afiliación y elegibilidad competitiva son estados separados;
- Transfers no escribe ScoreLedger ni puntúa cantidades financieras.

**Alternativas rechazadas**

Interés=oferta=transferencia, mercado omnisciente, thresholds rígidos, valor=fee=
salary, floating point monetario, moneda global implícita, `Contract.role`
igual a SportingRole, renovación in-place, club único en Player, auto-transfer
por descenso, inscripción universal instantánea, caps/cooldowns y parámetros
provisionales hardcoded.

**Impacto**

G3B-G05 y G06 quedan resueltas estructuralmente. G01–G04 y G07 quedan
parcialmente resueltas; G08 queda externalizada. Se desbloquean contratos,
loans, free transfers, afiliación dual y payloads conceptuales, pero no el
gameplay matemático.

**Tests/gates requeridos**

- schemas separados por etapa;
- percepción distinta por observador y sin acceso a estado verdadero;
- sparse/high exposure diferenciado;
- interés sin oferta, oferta sin acuerdo y acuerdo de clubes sin acuerdo del
  jugador;
- Money exacto y cero conversión implícita;
- MarketValue/fee/salary no aliases; free transfer con fee cero;
- renovación conserva predecesor/sucesor;
- `ContractExpectation` nunca asigna minutos;
- loan conserva holding/sporting club;
- movimiento atómico e idempotente;
- reanudación no repite términos;
- temporada multiclub sin duplicación;
- elegibilidad separada;
- cero ScoreLedger desde Transfers;
- parameters/streams/precision/golden/property/Monte Carlo aprobados.

**Refinamiento de interfaz — G3B Bloque 9 (2026-07-28)**

`PlayerClubAffiliation` debe admitir `ATTACHED`/`UNATTACHED`. Estar sin club
puede coexistir con `PlayerPlayingStatus.ACTIVE`, no fuerza retiro y no garantiza
interés/oferta. Market entrega contrato, afiliación y oportunidades confirmadas
a Retirement; no calcula motivation/hazard. Un comeback no restaura club,
contrato o `RegistrationEligibility`.

Transfers produce facts públicos/deportivos autorizados. Reputation/Social los
convierte en `PublicAttentionSignal`/updates mediante evidence keys; un fee,
traslado o fracaso no impone directamente followers/reputation.

**Pendiente para cerrar DR-058**

Funciones/distribuciones de percepción, need/fit, candidatos, interés, oferta,
viabilidad, valoración, fee, salary, renovación, negociación y preferencias;
correlaciones; precisión/cuantización; streams; parámetros y targets; fixtures;
tiempo/calendario de DR-021/067; moneda/conversión/calibración de DR-027; facts
de DR-063; continuidad de DR-065; elegibilidad de DR-066.

DR-058 conserva estado `BLOCKER_G3`; ADR-058 no autoriza gameplay.

### DR-059 — Campo de competencia de selección nacional

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** Parcialmente resuelta; estructura aceptada el
2026-07-28, matemática, elegibilidad y calendario/cursor pendientes.

**Origen**

No existe una plantilla mundial completa ni puede usarse un threshold de `overall`.

**Decisión requerida**

Definir:

- `NationalSelectionField` por posición/generación;
- elegibilidad y calendario;
- comparación desde rendimiento, calidad percibida, liga, reputación, salud y contexto;
- convocatoria, rol, minutos y producción internacionales;
- ubicación exacta en el pipeline;
- correlaciones, streams, persistencia y calibración.

**Dependencias**

DR-021, DR-022, DR-044, DR-048 y DR-049.

**No asumido**

Convocatoria no se decide por un valor único ni la producción internacional se mezcla con minutos de club.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

Selection puede consumir `PerformanceSummary`/`SeasonPerformanceSummary`,
producción, contexto competitivo, presión y fuerza de evidencia. Debe recibir una
vista autorizada compatible con conocimiento imperfecto, no latentes verdaderos.
La convocatoria, field, rol y producción internacional continúan abiertos y
mantienen minutos/facts separados de club. DR-059 no queda cerrada.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

`WorldState` puede alojar contextos/fields agregados de selección y
CompetitionDefinition puede aportar contratos reutilizables, pero el
`NationalSelectionField`, calendario internacional, fuerza y torneos siguen
siendo propiedad de DR-059. No se reutiliza directamente
`TeamMinutesOpportunity` de club.

**Resolución parcial de G3B — Bloque 8 (2026-07-28)**

- Responsable: Mathematical Design Board — National Team & Awards.
- ADR: [ADR-059](adr/059-national-team-model.md).
- Especificación:
  [`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md).

**Decisión estructural aceptada**

- `NationalTeamDefinition` pertenece a `dataVersion`;
- `NationalTeamState`, `NationalTeamContext` e historia viven en Career y no
  reutilizan estado de club;
- `NationalTeamEligibility` es lógico y anterior a la candidatura;
- el nombre canónico es `SelectionCompetitionField`, por país, posición,
  contexto y generación;
- el pipeline separa Eligibility, Candidate Evaluation, CallUp, squad, role,
  minutes, Performance y TeamOutcome;
- candidate signal usa evidencia deportiva purpose-scoped y field, no overall,
  MarketValue, CareerScore o Public Reputation por defecto;
- `InternationalRole` usa `BENCH`, `ROTATION`, `STARTER`, `KEY_PLAYER`;
- incumbency/selection trust es distinto de managerTrust y no garantiza nada;
- Role & Minutes/Performance se reutilizan con contexto nacional y exposición
  separada;
- Health no se duplica;
- `NationalTeamSupportField` excluye al protagonista;
- el protagonista no determina el outcome;
- un field abstracto no materializa futbolistas reales.

**Alternativas rechazadas**

Overall/threshold, liga débil como inelegibilidad, elegibilidad=convocatoria,
rol de club copiado, segundo motor internacional, minutos compartidos, plantilla
mundial completa, protagonista determinante, nacionalidad inferida desde liga,
ventanas post-Q4 por defecto, fase nueva implícita y parámetros hardcoded.

**Impacto**

G3B-H01 a H04 quedan estructuralmente restringidas y parciales. H05 queda como
calibración externalizada. World, Performance, Health, Awards y Scoring reciben
interfaces con ownership explícito.

**Conflicto temporal confirmado**

ADR-013/043 no ubica ventanas internacionales regulares entre Qs. Resolver todo
en `COMPETITIONS` post-Q4 rompe causalidad de disponibilidad/carga; ejecutarlo
dentro de club sin discriminante mezcla contextos. DR-059/021 debe elegir
suboperaciones, cursor y boundaries y versionar cualquier cambio.

**Tests/gates requeridos**

- Eligibility lógica separada y fixtures de transición previa;
- field por país/posición/generación sin población;
- convocatoria probabilística sin threshold;
- context strength no crea inelegibilidad;
- etapas del pipeline no se colapsan;
- role/minutes club e internacional separados;
- call-up con cero disponibilidad/minutos;
- Performance común con context nacional;
- support field excluye al protagonista;
- outcome no determinado por el jugador;
- incumbency no garantiza convocatoria;
- cursor/reanudación/streams sin repetición;
- golden/property tests y Monte Carlo;
- DR-021/063/068 cerradas para el slice.

**Pendiente para cerrar DR-059**

Funciones/distribuciones de field, candidate signal, call-up, squad, role,
minute share, support/contribution y outcome; dominios, precisión,
correlaciones, stream contexts, parámetros, fixtures y targets; calendario,
torneos y cursor de DR-021; schemas conformes a facts DR-063/ADR-010;
eligibility DR-068 y catálogo real DR-025.

DR-059 conserva estado `BLOCKER_G3`; ADR-059 no autoriza gameplay.

### DR-060 — `AwardCompetitionField` y resolución de premios

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** Parcialmente resuelta; estructura aceptada el
2026-07-28, matemática, posición, catálogo y fixtures pendientes.

**Origen**

Los premios requieren comparación contra competencia mundial abstracta usando
hechos confirmados antes de `AWARDS`, sin simular todos los jugadores.

**Decisión requerida**

Definir:

- schema de `AwardCompetitionField`;
- elegibilidad y antecedentes materiales;
- tamaño/nivel efectivo del campo;
- distribución conjunta de rendimiento, producción, títulos, reputación y momentos importantes;
- comparación, incertidumbre residual y empates;
- categorías posicionales y período conforme a ADR-044/DR-049;
- streams, calibración, hechos emitidos y fixtures.

**No asumido**

Un premio no es un Bernoulli independiente ni un threshold de rendimiento. Un candidato elegible conserva probabilidad positiva.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

Awards recibe `SeasonPerformanceSummary`, producción observada,
`pressureBreakdown` y logros externos. No usa EffectiveCapabilities o traits
verdaderos como omnisciencia. Un momento importante requiere evidencia
high-pressure autorizada y no es un bonus editorial. Field, elegibilidad,
comparación, ruido, empate y ganador siguen abiertos en DR-060.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Awards puede consumir outcomes canónicos por competición, title/phase/
qualification, `leagueCompetitiveStrength`, presión y contexto. IJL no se
confunde con fuerza ficticia y un mismo outcome no entra otra vez por aliases.
`AwardCompetitionField`, elegibilidad, comparación y empate siguen en DR-060.

**Resolución parcial de G3B — Bloque 8 (2026-07-28)**

- Responsable: Mathematical Design Board — National Team & Awards.
- ADR: [ADR-060](adr/060-awards-model.md).
- Especificación:
  [`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md).

**Decisión estructural aceptada**

- `AwardDefinition` estática/versionada se separa de
  `AwardEditionState`/result;
- la Definition declara category, scope, cadence, evaluation family,
  eligibility, período, posición/grupo, evidence, field y outcome policy;
- no existe mínimo universal de minutos, edad, producción o títulos;
- evaluation family distingue `COMPARATIVE_JUDGED` y `STATISTICAL`;
- category distingue global, league, tournament, positional, youth,
  team-selection y special;
- `AwardCompetitionField` y `StatisticalCompetitionField` son contratos
  diferentes;
- CandidateSignal usa Performance/production/evidence/pressure/outcomes y
  reputación permitida mediante evidence keys sin doble conteo;
- títulos no garantizan premios;
- ST, CM y GK usan señales posicionales propias;
- outcome puede conservar nomination, shortlist, placement y winner;
- judging noise es agregado, no votantes individuales;
- múltiples premios compatibles son válidos;
- Awards no detecta records ni aplica anti-duplicación de score;
- `AwardWon` es canónico; un premio estadístico no crea un alias duplicado;
- `AWARD_EVENTS` solo ocurre después del outcome.

**Alternativas rechazadas**

CareerScore, threshold fijo, Bernoulli aislado, goles universales, category y
evaluation family fusionadas, mínimos hardcoded, title guarantee, Public
Reputation universal, Awards aplicando 100 %/60 %, Award=Record, ganador real
inventado, evento anterior a AWARDS, un premio máximo por temporada y
parámetros hardcoded.

**Impacto**

G3B-I01 queda resuelta estructuralmente. I02 a I04 quedan parciales por
matemática/posición y I05 como contenido/calibración externalizados. El slice
conserva un premio global, uno juvenil y tres posicionales o de competición sin
inventar IDs.

**Tests/gates requeridos**

- Definition/Edition separados;
- predicates declarativos y versionados;
- no threshold universal;
- fields comparativo/estadístico separados;
- misma producción puede ganar o perder según edición;
- evaluación propia de ST/CM/GK;
- sparse exposure conserva evidencia/incertidumbre;
- títulos no garantizan ni se duplican;
- outcome ordinal coherente;
- múltiples premios compatibles;
- Awards no aplica anti-duplicación;
- Award y Record separados;
- `AwardWon` único por edición;
- timing `AWARDS → AWARD_EVENTS`;
- facts/streams/precisión versionados;
- golden/property tests y Monte Carlo.

**Refinamiento de frontera — G3B Bloque 10 (2026-07-28)**

`AwardWon` queda como único fact puntuable de Awards. `AwardEditionResolved` es
summary; nomination/placement solo son facts cuando tienen consumidor y no
representan otra vez la victoria. El 100 %/60 % se aplica en Scoring mediante
`AwardScoringEquivalenceGroup`, sin alterar el historial. DR-063 ya no bloquea
DR-060; permanecen field, matemática, posición, catálogo y fixtures.

**Pendiente para cerrar DR-060**

Distribuciones de fields, candidate signal, judging, placement y empate;
parámetros por Definition; posición dominante DR-049; scope DR-048; métricas GK
DR-055; catálogo real DR-025; schemas conformes a facts DR-063/ADR-010;
precisión, stream contexts, fixtures y targets.

DR-060 conserva estado `BLOCKER_G3`; ADR-060 no autoriza gameplay.

### DR-061 — Reputación deportiva, reputación pública y seguidores

**Clasificación:** `BLOCKER_G3` para estados/fórmulas; regiones y textos pueden ser `CONTENT_LATER`.
**Estado de resolución:** Parcialmente resuelta; estructura aceptada el
2026-07-28, matemática ejecutable pendiente.

**Origen**

Los tres sistemas deben ser separables y permitir fama local/global independiente de calidad.

**Decisión requerida**

Definir:

- dimensiones y escalas de `sportingReputation` y `publicReputation`;
- si reputación pública separa alcance y sentimiento;
- estados regionales y agregación global;
- dinámica de seguidores enteros;
- memoria/decay y shocks de exposición;
- efectos de rendimiento, club, selección, eventos y personality;
- correlación con valor/sponsors sin doble conteo;
- streams, precisión, calibración y tests.

**No asumido**

No se crea un `fameOverall` ni se hace que seguidores equivalgan a reputación o calidad.

**Resolución parcial G3B — Bloque 9 (2026-07-28)**

[ADR-061](adr/061-reputation-and-social-model.md) y
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
aceptan:

- `SportingReputationState`, `PublicReputationState`,
  `PublicAttentionState` y `AudienceState` separados;
- Sporting Reputation por mercado con standing, fuerza de evidencia, memoria y
  vista global derivada;
- Public Reputation con awareness/sentiment; reach derivado y hype/attention
  separado;
- `FollowerCount` entero exacto no negativo y distinto de engagement;
- mercados data-driven; home/current/global sin países hardcoded en engine;
- fact→signal→deduplicación por `EvidenceKey`→owner→estado;
- `causalSignalId` compartido para correlacionar shocks;
- followers no monotónicos y Content sin deltas directos;
- boundary de sponsors diferido y ausencia de score.

G3B-K03/K04 quedan resueltas estructuralmente. G3B-K01/K02/K05 quedan
parciales; K06 es calibración externalizada y K07 diferida.

**Refinamiento de frontera — G3B Bloque 10 (2026-07-28)**

Solo `PublicReputationUpdated`, `FollowerCountUpdated` y `EngagementUpdated`
son candidatos allowlisted para PBR; `SportingReputationUpdated`,
`PublicAttentionGenerated` y `AudienceMilestoneReached` no puntúan
directamente. Una misma causa usa evidence/causal keys y no entra por attention
y update a la vez. La transformación matemática de PBR continúa en DR-010/061.

**Refinamiento de interfaz — G3B Bloque 4 (2026-07-28)**

Reputation consume hechos deportivos observables y contexto desde summaries
cerrados. No consume UnderlyingPerformance oculto y debe evitar que la misma
evidencia entre otra vez mediante producción, rating y reputación como aliases.
Escalas, memoria, regiones, followers, shocks y fórmulas permanecen en DR-061.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Sporting reputation puede consumir outcomes/contexto de Club/Competitions y
world cycles, pero prestigio del club no se copia como reputación del jugador.
Una misma señal colectiva se referencia una vez. Fórmulas y estados regionales
siguen en DR-061.

**Pendiente para cerrar DR-061**

- dominios, escalas, precisión, cuantización y serialización;
- ecuaciones de memoria/decay/actualización;
- familia de cambios enteros de followers, churn, overdispersion y colas;
- dinámica de Public Attention/Engagement;
- regional diffusion, agregación y audiencias superpuestas;
- correlaciones y shared-shock loadings;
- contexts de streams, parámetros iniciales, golden fixtures y targets;
- mercados concretos, fuentes y topología del slice junto con DR-025;
- schemas concretos conformes a facts, aliases e idempotencia de
  DR-063/ADR-010.

**Tests/gates requeridos**

- sistemas y dimensiones no son aliases;
- una `EvidenceKey` se aplica una sola vez;
- vista global conserva procedencia regional;
- followers es entero, no negativo y puede caer;
- existen outliers sin hard cap editorial;
- shocks compartidos son reproducibles y no desplazan otros streams;
- contenido no escribe followers/reputation por bypass;
- ningún output crea ScoreLedger.

DR-061 conserva estado `BLOCKER_G3`; ADR-061 no autoriza gameplay.

### DR-062 — Hazard y proceso de retiro

**Clasificación:** `BLOCKER_G3`.
**Estado de resolución:** Parcialmente resuelta; estructura aceptada el
2026-07-28, matemática, cursor y finalización pendientes.

**Origen**

El retiro debe ser probabilístico y causal sin edad máxima obligatoria.

**Decisión requerida**

Definir:

- cadencia y fase exacta de evaluación;
- hazard por edad, capacidad, declive, lesiones, minutos, contratos, motivación, contexto y éxito;
- qué resultados requieren decisión y cuáles son consecuencias mecánicas;
- relación con ausencia de ofertas y eventos;
- transición a `RETIRED` y cierre posterior;
- streams, parámetros, colas, calibración y fixtures de retiro temprano/longevo.

**No asumido**

No existe `forceRetireAtAge`, cooldown de retiro ni retiro automático solo por cruzar un threshold.

**Resolución parcial G3B — Bloque 9 (2026-07-28)**

[ADR-062](adr/062-playing-retirement-and-comeback.md) y
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
aceptan:

- `PlayerPlayingStatus = ACTIVE | RETIRED` separado de `CareerStatus`,
  contratos, afiliación y retiro internacional;
- Career abierta con jugador retirado y `WAITING_DECISION` para comeback;
- `CareerMotivationAssessment` derivada de ambition, morale, historia y
  contexto, sin trait/overall nuevo;
- causes extensibles `VOLUNTARY`, `HEALTH`, `MARKET`, `EXTERNAL`, `OTHER`;
- edad, falta de club, lesión, pocos minutos o falta de oferta como inputs, no
  thresholds;
- ruta normal con reflexión/decisión y outcome instantáneo solo ante causa
  mecánica explícita;
- múltiples episodios retiro→regreso con identidad causal;
- comeback sin garantía, cooldown o restauración automática de club/rol/salud;
- primer retiro deportivo sin scoring final, ranking o Career completion
  automáticos.

La matriz de DR-016 se conserva: comeback no agrega
`CareerStatus.RETIRED -> ACTIVE`. `CareerStatus.RETIRED` queda reservado para
el boundary irreversible de cierre.

**Refinamiento parcial de G3B — Bloque 5 (2026-07-28)**

Retirement puede consumir historia de episodios por familia/severidad/recencia,
relaciones de recaída, secuelas y burden persistente confirmados. No accede a
traits ocultos salvo contrato autoritativo ni transforma una lesión en retiro
automático. Health no calcula el hazard de retiro. Cadencia, motivación,
contratos, función, streams y fixtures permanecen en DR-062.

**Conflicto y dependencia nueva**

ADR-013/043 no contiene una fase mecánica Retirement, mientras `MASTER_SPEC`
permite comeback pero también declara que el MVP termina con retiro/resumen.
DR-069 debe decidir cursor posretiro, boundary irreversible, freeze de scoring,
ranking, perfil y terminación práctica sin edad máxima.

**Pendiente para cerrar DR-062**

- forma/familia de hazard o competing risks;
- dominio y transformación de motivation;
- outcome/decision policy cuantitativa por cause;
- cadencia y punto exacto, coordinados con DR-069;
- comeback hazard y dinámica posretiro;
- correlaciones, precisión, streams, parámetros iniciales, fixtures y targets;
- schemas concretos conformes a facts e idempotencia de DR-063/ADR-010.

**Tests/gates requeridos**

- lifecycle del run y estado deportivo son ortogonales;
- primer retiro no completa/rankea;
- retiro→regreso→retiro produce episodios únicos;
- no club, edad o lesión no fuerzan retiro;
- no edad máxima, cooldown o cupo;
- comeback no reabre Q ni repite streams;
- `CareerStatus.RETIRED` sigue irreversible;
- parámetros/golden fixtures/Monte Carlo aprobados.

DR-062 conserva estado `BLOCKER_G3`; ADR-062 no autoriza gameplay.

### DR-063 — Catálogo de hechos matemáticos y allowlist de scoring

**Estado:** Resuelta estructuralmente — 2026-07-28.

**Clasificación histórica:** `BLOCKER_G3` hasta G3B Bloque 10.

**ADR y especificación:** [ADR-010](adr/010-scoring-ledger-and-domain-facts.md)
y [`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md).

**Decisión aceptada**

Se adopta:

- taxonomía separada de `InternalEngineSignal`, `DomainFact`,
  `NarrativeEvent` y `ScoreLedgerEntry`;
- fact ledger append-only con identidad determinista basada en Career,
  `operationKey`, `factType`, semantic key y ordinal canónico;
- envelope con scope, causal references, payload tipado, hash y `VersionSet`;
- catálogo único clasificado como `PERSISTED_DOMAIN_FACT`,
  `INTERNAL_SIGNAL`, `DERIVED_SUMMARY` o `NARRATIVE_ONLY`;
- `CompetitionFinished` como outcome colectivo canónico;
- facts genéricos con `contextType` para club/selección;
- catálogo de aliases a migrar;
- allowlist por las seis categorías de PC;
- provenance policy que impide a Content emitir facts puntuables;
- idempotencia fact→rule→entry y re-scoring sin mutar facts.

**Alternativas rechazadas**

- Persistir todo intermedio como fact.
- Usar timestamps, UUID aleatorio u orden de DB como identidad.
- Mantener aliases duplicados por contexto o subsistema.
- Puntuar directamente un `EventInstance`, discovery o narrativa.
- Permitir que Content emita records/achievements puntuables.
- Hacer que engine cree `ScoreLedgerEntry`.

**Impacto**

- Pueden definirse schemas de facts, rules y ledger sin reabrir semántica.
- `engine` sigue sin depender de `scoring`.
- Cambiar catálogo, identidad o allowlist exige revisar
  `schemaVersion`/`engineVersion`; si cambia points, también
  `scoringVersion`.
- La resolución de DR-063 no cierra las fórmulas de DR-008/010.

**Tests y gates requeridos**

- golden fact IDs y equivalencia de cadencia;
- rechazo de aliases/tipos/producers desconocidos;
- causal references canónicas, anteriores y acíclicas;
- misma Career/replay produce fact ledger byte-equivalent;
- Content no emite facts allowlisted;
- fact set + scoringVersion produce ledger idempotente;
- migraciones preservan procedencia y no duplican ocurrencias;
- los tests detallados de
  [`SCORING_FACTS_SPEC.md`, §16](SCORING_FACTS_SPEC.md#16-tests-y-evidencia-requerida).

**Origen**

El dominio enumera hechos ilustrativos (`PlayerDeveloped`, `StatsGenerated`, etc.), pero G3B necesita payloads, granularidad, identidad y orden definitivos para Q/temporada y para el límite engine/scoring.

**Requisito que quedó resuelto**

Publicar:

- nombres y schemas canónicos;
- payload mínimo, unidades y precisión;
- fase/Q en que cada hecho existe;
- diferencia entre fact de dominio, estado agregado y traza de cálculo;
- identidad/ordinal determinista sin reloj ni UUID aleatorio;
- causal references y orden canónico;
- allowlist que puede consumir scoring;
- idempotencia, compatibilidad y versionado;
- mapeo/migración desde los nombres actuales de `DOMAIN_MODEL.md`.

**No asumido**

No todo valor intermedio se convierte en evento, y ningún contenido puede emitir un hecho autorizado para crear puntos de forma directa.

**Documento asociado**

[`MATHEMATICAL_ENGINE_SPEC.md`, sección 24](MATHEMATICAL_ENGINE_SPEC.md#24-outputs-y-hechos-de-dominio).

**Refinamiento parcial de G3B — Bloque 2 (2026-07-27)**

El futuro fact de evolución debe poder identificar temporada/Q, snapshot
anterior/posterior, delta por capability, familia, contribuciones causales,
inputs, streams, precisión y versiones. No todo intermedio se vuelve fact: la
separación entre traza, snapshot y evento, junto con nombres, schemas,
idempotencia y allowlist, quedó pendiente en ese bloque. La resolución final
del Bloque 10 más abajo sustituye esa clasificación provisional.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

La semántica mínima de Role & Minutes distingue
`WindowAvailabilityAssessed`, `SportingRoleAssigned`,
`expectedMinutes`, `MinutesRecorded`, `EffectivePositionUsed` y
`AppearanceSummaryRecorded`; `SquadStatusChanged` solo existe si cambia el
estado institucional. `expectedMinutes` es un internal signal y no prueba participación;
ninguno de estos outputs crea ScoreLedger directamente.

En ese punto DR-063 todavía debía decidir cuáles eran facts persistidos frente
a trazas/proyecciones, sus nombres finales, payloads, identidad, idempotencia,
orden y allowlist. La resolución final del Bloque 10 sustituye esta lista
provisional; la precisión cuantitativa sigue en la DR propietaria.

**Refinamiento parcial de G3B — Bloque 4 (2026-07-28)**

La clasificación conceptual de Performance es:

- `EffectiveCapabilitiesResolved`: traza, no estado/fact competitivo por
  defecto;
- `UnderlyingPerformanceRecorded`: evidencia interna auditable;
- `ObservedProductionRecorded`: fact deportivo candidato;
- `PerformanceSummaryRecorded`: fact/snapshot de Q candidato;
- `SeasonPerformanceSummaryRecorded`: fact/snapshot de cierre candidato;
- `PressurePerformanceRecorded`: no se emite separado por defecto porque el
  pressure breakdown pertenece al summary;
- señales de form/confidence/managerTrust/morale: inputs de cálculo; el owner
  emite el eventual cambio confirmado.

`StatisticRecorded` y `StatsGenerated` no deben coexistir con
`ObservedProductionRecorded` como ocurrencias duplicadas. Esta revisión dejó a
DR-063 la migración/nombre final, payloads, identidad, idempotencia y allowlist;
la resolución final del Bloque 10 ya los cierra. EffectiveCapabilities,
traits/latentes y ratings de presentación quedan fuera del allowlist. La
precisión cuantitativa sigue en DR-055.

**Refinamiento parcial de G3B — Bloque 5 (2026-07-28)**

La clasificación conceptual de Health es:

- `MedicalAvailabilityCalculated`: traza/snapshot del componente médico;
- `WindowAvailabilityAssessed`: fact/snapshot agregado compartido con Role &
  Minutes, no fact exclusivo de Health;
- `LoadRecorded`: evidencia física auditable que referencia minutos sin
  duplicarlos;
- `FatigueUpdated` y `FitnessUpdated`: cambios de estado candidatos;
- `InjuryOccurred`, `RelapseOccurred`, `SequelaRecorded` y
  `HealthConditionResolved`: facts de dominio candidatos;
- `InjuryProgressed`, `RecoveryUpdated` y `ReturnToPlayReached`: cambios/facts
  candidatos cuya persistencia exacta debe decidirse.

Todo episodio usa identidad/ordinal determinista y causal references; no reloj
ni UUID aleatorio. Ningún fact de Health crea `ScoreLedgerEntry`. La
clasificación, nombres, aliases, identidad, idempotencia y allowlist quedaron
cerrados posteriormente por DR-063/ADR-010; precisión y schema cuantitativo
siguen en DR-057.

**Refinamiento parcial de G3B — Bloque 6 (2026-07-28)**

La clasificación conceptual de Club/Competitions/World es:

- `CompetitionContextPrepared`, `PositionCompetitionPrepared` y
  `TeamMinutesOpportunityPrepared`: snapshots/trazas por defecto;
- `PlayerCompetitiveContributionRecorded`: evidencia interna, nunca CC/score;
- `CompetitionFinished` como outcome canónico;
- `CompetitionWon`, `RoundReached` y `QualificationAchieved`: facts/proyecciones
  candidatas sin duplicar el mismo outcome;
- `ClubStateUpdated`, `LeagueStateUpdated`, `ManagerContextChanged`,
  `PromotionOccurred`, `RelegationOccurred` y `WorldCycleUpdated`: cambios/facts
  candidatos.

DR-063/ADR-010 ya deciden persistencia, nombres, causal references,
idempotencia, aliases y allowlist. Un fact colectivo no crea
`ScoreLedgerEntry` directamente; los schemas cuantitativos siguen en DR-022.

**Refinamiento parcial de G3B — Bloque 7 (2026-07-28)**

Transfers/Market distingue como candidatos:

- `MarketValuationUpdated` y `ClubNeedGenerated`;
- `TransferInterestGenerated`;
- `TransferOfferCreated`/`TransferOfferWithdrawn` y `RenewalOffered`;
- `NegotiationStarted`/`NegotiationUpdated`/`NegotiationFailed`;
- `PlayerTransferDecisionRequested`;
- `ContractAgreed`/`ContractRenewed`/`ContractExpired`/
  `ContractTerminated`;
- `TransferCompleted`, `LoanStarted`, `LoanEnded` y
  `FreeTransferCompleted`.

Percepciones, assessments y propuestas intermedias pueden ser snapshots/trazas,
no facts. Cada interés, oferta, negociación, contrato, transferencia y préstamo
tiene identidad causal independiente; no usa reloj o UUID aleatorio.
La resolución final rechaza `TransferOutcomeRecorded` como envelope paralelo y
mantiene los facts específicos sin duplicación. DR-063/ADR-010 ya deciden
clasificación, nombres, referencias, orden, idempotencia, aliases y allowlist.
Ningún fact financiero crea `ScoreLedgerEntry` por sí mismo.

**Refinamiento parcial de G3B — Bloque 8 (2026-07-28)**

La clasificación conceptual de National Team y Awards es:

- eligibility y candidate evaluations son trazas/snapshots por defecto;
- convocatoria y selección de squad son facts distintos;
- `InternationalRoleAssigned` es un fact/snapshot de contexto nacional, nunca
  un alias del rol de club;
- minutos, producción y summaries internacionales deben reutilizar los facts
  genéricos autorizados con un discriminante de contexto nacional, no crear
  aliases que dupliquen la misma ocurrencia;
- `CompetitionFinished` conserva el outcome internacional canónico y
  `NationalTeamCompetitionAchievement` puede ser una proyección autorizada sin
  duplicarlo;
- eligibility y candidate evaluations de premios son trazas por defecto;
- `AwardEditionResolved` conserva el outcome ordinal de la edición;
- `AwardNominated` y `AwardPlacementRecorded` solo son facts si tienen
  consumidores aprobados;
- `AwardWon` es el fact canónico de victoria, también para premios
  estadísticos; no coexiste un alias `StatisticalAwardWon` para la misma
  ocurrencia.

Todos los facts requieren identity/ordinal deterministas, edition/context IDs,
causal references y versiones. Awards no emite `ScoreLedgerEntry`; Scoring
consume únicamente facts allowlisted. DR-063/ADR-010 ya cierran nombres,
persistencia, idempotencia, aliases y allowlist; los schemas cuantitativos
permanecen en DR-059/060.

**Refinamiento parcial de G3B — Bloque 9 (2026-07-28)**

La clasificación conceptual de Reputation/Social/Retirement es:

- `ReputationSignalAccepted` y `RetirementHazardEvaluated`: trazas internas por
  defecto;
- `SportingReputationUpdated`, `PublicReputationUpdated`,
  `FollowerCountUpdated` y `EngagementUpdated`: cambios de estado candidatos;
- `PublicAttentionGenerated`: fact/señal candidata con `sourceFactId` y
  `causalSignalId`;
- `RegionalReputationUpdated` no se emite como alias si el update canónico ya
  incluye breakdown;
- `AudienceMilestoneReached` solo es fact si tiene consumidor real;
- `RetirementDecisionRequested` y `ComebackDecisionRequested` identifican el
  boundary de `PendingDecision`;
- `RetirementOccurred` y `ComebackOccurred` son facts canónicos por episodio;
- `ComebackOpportunityGenerated` es traza/fact según consumidor;
- `CareerFinalizationRequested` no es `CareerCompleted`;
- `CareerCompleted` sigue siendo fact del agregado Career.

`FollowersChanged`/`FollowerCountUpdated` y
`PlayerRetired`/`RetirementOccurred` deben reconciliarse: no pueden coexistir
como aliases de la misma ocurrencia. Todos usan identidad/ordinal determinista,
evidence/causal references y versiones. Ninguno crea ScoreLedger.
DR-063/ADR-010 ya cierran nombres, clasificación, idempotencia, aliases y
allowlist; precisión y schemas cuantitativos permanecen en DR-061/062.

**Resolución final G3B — Bloque 10 (2026-07-28)**

El catálogo provisional anterior queda reconciliado por
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md). Sus reglas principales son:

- `PlayerCapabilitiesChanged` reemplaza `PlayerDeveloped`;
- `ObservedProductionRecorded` reemplaza `StatsGenerated`/
  `StatisticRecorded`;
- `PlayerDynamicStateChanged.stateKind` concentra updates dinámicos;
- `HealthConditionTransitioned.transitionKind` concentra progress/recovery/
  return/resolution sin borrar episodios;
- `CompetitionFinished` es el único outcome colectivo fact; win/round/
  qualification son proyecciones;
- contextos nacionales reutilizan facts genéricos;
- `TransferCompleted.movementType` cubre free transfer;
- `AwardWon` cubre premios estadísticos;
- requests especializados usan `DecisionRequested.decisionKind`;
- `FollowerCountUpdated` y `RetirementOccurred` son nombres canónicos;
- records, milestones y achievements históricos solo los emiten detectores
  autoritativos.

Esta resolución cierra DR-063. El schema TypeScript/Zod y la implementación
pertenecen a una fase posterior y deberán satisfacer esta semántica.

### DR-064 — Disponibilidad no médica y agregación autoritativa

**Estado:** Resuelta — 2026-07-29.  
**Clasificación histórica:** `BLOCKER_G3` para Role & Minutes.  
**ADR:** [ADR-072](adr/072-role-minutes-and-availability-mathematics.md).

**Origen**

ADR-054 y la documentación del Bloque 3 usaban un único
`AvailabilityEnvelope` “proveniente de Health y otros sistemas” con causas
`INJURY`, `SUSPENSION` y `OTHER`. Eso mezclaba el componente médico con
disciplina y dejaba sin owner la agregación.

G3B Bloque 5 resuelve únicamente la frontera normativa:

- Health produce `MedicalAvailabilityEnvelope`;
- Health no es owner de suspensiones ni disciplina;
- una agregación posterior produce `AvailabilityEnvelope`;
- Role & Minutes consume el resultado y asigna minutos.

**Decisión requerida**

Definir:

- owner autoritativo de suspensiones y disciplina;
- fuentes tipadas de otras indisponibilidades;
- orden, precedencia y solapamiento entre componentes;
- función que combina shares/restricciones sin doble descuento;
- momento de confirmación dentro de `AVAILABILITY(Qn)`;
- facts, schemas, identidad e idempotencia;
- relación con calendario/competiciones y decisiones;
- precisión, parámetros, streams —si existe azar— y fixtures.

**No asumido**

No se multiplica, suma ni toma el mínimo de shares por inferencia. No se modelan
tarjetas, sanciones o reglas disciplinarias en Health. Una causa no puede
descontar dos veces la misma indisponibilidad.

**Impacto y gate**

DR-054 y DR-021/022 deben incorporar este contrato; DR-063/ADR-010 ya lo
clasifican dentro de los facts/summaries aprobados. Role & Minutes no
puede cerrar su mapping ejecutable de disponibilidad hasta resolver DR-064. El
schema y la matemática interna de Health pueden avanzar contra
`MedicalAvailabilityEnvelope` sin inventar disciplina.

**Refinamiento de interfaz — G3B Bloque 6 (2026-07-28)**

Competitions/Calendar debe ubicar cada componente disciplinario u otra
indisponibilidad dentro de `seasonId`, Q y scope competitivo. Esto no convierte
a Club/Competitions en owner automático de disciplina ni decide la composición.
DR-064 debe elegir owner, precedencia y solapamientos.

**Resolución G3C-3**

Cada provider conserva ownership:

- Health: `MEDICAL`;
- Discipline/Competition policy: `DISCIPLINARY`;
- otros providers tipados: `OTHER`;
- `AvailabilityAggregator` de la orquestación: composición.

Cada causa entrega intervalos semiabiertos ordenados sobre ordinales abstractos
de oportunidad de minuto por competición/Q. El aggregate es la unión exacta de
todos los intervalos; un overlap se descuenta una sola vez. Restricciones
médicas no temporales pasan separadas.

Cuando varias fuentes solo entregan shares y no describen solapamiento, la
operación falla con `AVAILABILITY_OVERLAP_UNSPECIFIED`. La composición no
consume RNG. `WindowAvailabilityAssessed` permanece `DERIVED_SUMMARY`; los
facts causales de disciplina/salud conservan su propio catálogo.

**Alternativas rechazadas**

- sumar shares;
- tomar el mínimo;
- multiplicar asumiendo independencia;
- precedencia editorial implícita;
- convertir Health en owner de disciplina;
- inventar timestamps o partidos para expresar overlaps.

**Impacto**

DR-054 puede consumir `availableMinutes` sin ambigüedad. G3C-5 debe producir la
asignación médica compatible; G3C-6 produce el dominio de oportunidad. Esto no
implementa tarjetas ni disciplina y no cierra DR-021/057.

**Tests y gates**

- unión disjunta, solapada, anidada y por múltiples competiciones;
- invariantes `0 <= available <= opportunity`;
- mismo overlap descontado una vez;
- rechazo de share-only ambiguo;
- validación de consistencia del envelope médico;
- orden canónico, idempotencia y cero consumo RNG.

## 6. Decisiones antes del vertical slice

### DR-021 — Calendario, fecha inicial y evolución de formatos

**Estado:** Parcialmente resuelta — `BLOCKER_G3` para generación/formato del
calendario e integración temporal restante.

**Problema**

El año inicial y el tratamiento de ligas/torneos que cambian de formato durante décadas simuladas no están definidos.

**Decisión requerida**

Definir fecha inicial, `seasonId`, calendario abstracto, reglas futuras versionadas y límites de extrapolación histórica sin inventar entidades.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

Role & Minutes requiere por contexto y Q una `TeamMinutesOpportunity` finita,
identificada por `seasonId`, ventana y scope de competición. Q1–Q4 no son
partidos ni fechas reales. El calendario agregado es propietario del total y
los splits; el módulo de minutos no los inventa.

Fecha inicial, schema definitivo de `SeasonId`, formatos, evolución y cálculo
de oportunidad permanecen abiertos. DR-021 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 4 (2026-07-28)**

El calendario agregado debe producir para Performance splits de exposición,
scope competitivo, dificultad de agenda y oportunidades high-pressure
auditables. También debe definir cuándo una aparición es elegible para una valla
invicta sin materializar partidos. Estos requisitos no deciden el calendario,
la fórmula de oportunidad ni los formatos; DR-021 sigue abierta.

**Refinamiento parcial de G3B — Bloque 5 (2026-07-28)**

El calendario agregado debe entregar a Health scope/Q, exposición competitiva,
schedule/context y señales suficientes para distinguir minutos de carga. Debe
permitir exposición de entrenamiento/background sin inventar sesiones diarias.
También debe ubicar suspensiones/otras indisponibilidades en Q, pero su owner y
composición quedan en DR-064. Fecha inicial, formatos, oportunidad, precisión y
splits continúan abiertos.

**Refinamiento parcial de G3B — Bloque 6 (2026-07-28)**

Competitions/Calendar es owner de un calendario agregado por Q con oportunidad,
scope, difficulty, congestion, high-pressure exposure y splits por competición.
`TeamMinutesOpportunity.teamMinutes` representa tiempo físicamente ocupable por
un jugador y la suma de sus splits debe conservar el total. Q no es
fecha/partido y una Career nunca consulta calendarios reales posteriores.

Continúan abiertos fecha inicial, schema definitivo de `SeasonId`, mapping de
temporada visible, cálculo/precisión de oportunidad, formatos/fases/cupos,
reglas de qualification y política más allá del horizonte. ADR-022 no resuelve
DR-021.

**Refinamiento parcial de G3B — Bloque 7 (2026-07-28)**

Calendar/Competitions debe producir un `MarketWindowContext` identificado,
versionado y ordenable con `seasonId`, límites de dominio, scope, operaciones
admitidas y boundary de efectividad. Contratos usan time points de dominio
compatibles con `seasonId`/cursor, no fechas diarias.

ADR-013/043 solo sitúan `MARKET` después de `COMPETITIONS`; no existe una
operación Market entre Qs. DR-067 registra la decisión necesaria para soportar
movimientos mid-season sin alterar implícitamente el cursor. Fecha, time schema,
ventanas, validez y efectividad siguen abiertas; DR-021 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 8 (2026-07-28)**

International Calendar debe producir contextos identificados para ventanas
regulares y torneos, `InternationalTeamMinutesOpportunity`, dificultad,
pressure exposure y boundaries de disponibilidad/carga. Club e internacional
no comparten oportunidad ni minutos.

ADR-013/043 no ubica call-up, role, minutes y Performance internacionales entre
Qs. Ejecutar todo post-Q4 o mezclarlo con producción de club rompería causalidad.
DR-059 junto con DR-021 debe decidir suboperaciones, cursor, health snapshots,
calendar cycles y relación con `COMPETITIONS`. No se agrega una fase por
inferencia; DR-021 permanece abierta.

**Resolución parcial G3C-3 (2026-07-29)**

ADR-072 cierra para cálculo agregado:

```text
SeasonId = { careerId, seasonOrdinal >= 0 }
quarterIndex ∈ {0,1,2,3}
windowMidpointYear = seasonOrdinal + (quarterIndex + 0.5) / 4
```

Q sigue siendo ordinal de dominio, no trimestre civil. Cada
`TeamMinutesOpportunity` contiene segmentos de competición con minutos
enteros, opportunity count, capacidades agregadas de start/non-start y señales
de contexto. No requiere fixtures.

**Alternativas rechazadas:** reloj del sistema, timestamps reales como identidad,
fechas diarias ficticias y Q como calendario civil.

**Impacto:** G3B-F03 queda `RESOLVED_MATH`; Role & Minutes puede implementarse
contra un input. DR-021 permanece parcial por fecha/label visible inicial,
generación de oportunidad, formatos/fases/cupos, extrapolación futura,
calendario internacional y boundaries de Market/DR-067.

### DR-022 — Modelo agregado de competiciones y mundo

**Estado:** Parcialmente resuelta — estructura aceptada el 2026-07-28;
matemática, calendario, datos, scope y fixtures pendientes.

**Problema**

No se simulan partidos ni plantillas completas, pero se necesitan participantes, minutos posibles, títulos, ascensos, descensos y evolución institucional.

**Decisión requerida**

Especificar el nivel mínimo de representación agregada para:

- calendario y fases;
- clasificación;
- dificultad rival;
- plantel ficticio abstracto;
- competencia por puesto;
- ascenso/descenso;
- premios;
- continuidad futura.

**Refinamiento de G3A**

La resolución también debe fijar:

- vectores mínimos de club: ataque, defensa, control/creación, prestigio, finanzas, entrenador, desarrollo, medicina, estabilidad y táctica;
- si `overallStrength` es únicamente una proyección derivada;
- `PositionCompetition` por posición/contexto (alias exploratorio anterior:
  `SquadCompetitionField`);
- `NationalSelectionField` y campos generacionales en coordinación con DR-059;
- inputs mundiales para `AwardCompetitionField` de DR-060;
- shocks globales, regionales, de liga, club y selección sin doble conteo;
- tendencias, reversión y cambios de régimen durante décadas;
- relación entre evolución ficticia, `dataVersion` y jerarquías competitivas fijas de scoring.

**Documento asociado**

[`MATHEMATICAL_ENGINE_SPEC.md`, secciones 7 y 18](MATHEMATICAL_ENGINE_SPEC.md#7-club-agregado-mínimo).

**Refinamiento parcial de G3B — Bloque 2 (2026-07-27)**

`developmentQuality` y `managerQuality` serán inputs distintos de desarrollo
adquirido. Ninguno se reemplaza automáticamente por prestigio ni garantiza un
delta positivo. Sus escalas, dinámica y relación con el resto de `ClubState`
continúan pendientes; DR-022 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

Club/Competitions debe producir:

- `PositionCompetition` por posición/contexto, con fuerza, profundidad y
  estabilidad/entrenchment agregadas;
- contexto de manager y demandas tácticas para derivar `tacticalFit`;
- `TeamMinutesOpportunity` y futuros splits por competición.

No se simulan plantillas ni partidos completos. Strength del club puede
correlacionarse con competencia, pero no la determina universalmente. Escalas,
representación táctica, calendario, evolución y distribuciones siguen
pendientes; DR-022 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 4 (2026-07-28)**

Club/Competitions debe entregar a Performance un contexto con dimensiones
equivalentes a `attackEnvironment`, `defensiveEnvironment`,
`possessionControlContext`, fuerza rival, `scheduleDifficulty`,
`competitionStrength`, demandas tácticas y `highPressureExposure`. Performance
las consume, no las genera. Competition strength puede participar de evaluación
contextual sin reescribir contadores observados. Escalas, construcción,
correlaciones y evolución continúan pendientes; DR-022 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 5 (2026-07-28)**

Club/Competitions debe entregar a Health `medicalQuality`, contexto de
calendario/exposición y restricciones institucionales autorizadas. La calidad
médica puede influir prevención, detección, recuperación, rehabilitación, load
management y secuelas, pero no elimina riesgo. Health consume estos valores y
no los genera. Escalas, dinámica, correlaciones y evolución de
`medicalQuality` continúan abiertas en DR-022.

**Resolución parcial de G3B — Bloque 6 (2026-07-28)**

- Responsable: Mathematical Design Board — Club, Competitions & World.
- ADR: [ADR-022](adr/022-club-competition-world-model.md).
- Especificación:
  [`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md).

**Decisión estructural aceptada**

- `ClubDefinition`, `LeagueDefinition` y `CompetitionDefinition` pertenecen a
  la snapshot inmutable de `dataVersion`;
- `ClubState`, `LeagueState`, `CompetitionState` y `WorldState` contienen el
  futuro ficticio de una Career y no mutan esa snapshot;
- `ClubState` separa attack/defensive/control strength, prestigio,
  `financialPower`, desarrollo, medicina, estabilidad, manager, competencia y
  membresía;
- `overallStrength` solo puede ser una vista derivada y explicable;
- fuerza deportiva, prestigio y finanzas tienen dinámicas diferentes;
- `ManagerContext` posee identidad/revisión y punto causal de vigencia;
- `TacticalIdentity` es vector de demandas y `TacticalFit` una derivación;
- Club es owner de `PositionCompetition`; Competitions/Calendar, de
  `TeamMinutesOpportunity`;
- Definition y State de competición quedan separados y la arquitectura admite
  liga, copa doméstica, continental, supercopa e internacional de clubes sin
  fixtures obligatorios;
- `PlayerCompetitiveContribution` no es score/CC y
  `TeamSupportField` excluye al protagonista;
- outcomes se resuelven por competición, con factores compartidos y específicos;
- `leagueCompetitiveStrength` es dinámico y no reescribe IJL;
- shocks tienen jerarquía global→regional→league→club→idiosincrático y una
  causa se sortea una vez;
- Club/League/World updates solo afectan futuro;
- no existen pisos deportivos, inmunidad o qualification garantizada por
  identidad;
- ascenso/descenso es representable y no dispara transferencia automática.

**Alternativas rechazadas**

Snapshot mutable, `ClubOverall` causal, prestigio/finanzas como fuerza,
plantillas/fixtures completos, títulos independientes, protagonista como
determinante absoluto, baseline con contribución duplicada, IJL dinámico,
protección de clubes grandes, clubes identificables inventados, transferencia
automática y parámetros provisionales hardcoded.

**Impacto**

G3B-F01, F02, F04 y J01 quedan resueltas estructuralmente. F03, F05, F06 y
J02–J04 quedan parciales por calendario, matemática o scope. Role & Minutes,
Performance, Health y Development reciben inputs con owner explícito.

**Tests/gates requeridos**

- definitions inmutables y replay sin datos posteriores;
- no overall causal ni doble conteo;
- cambio de manager solo hacia futuro;
- `PositionCompetition` sin plantilla;
- conservación de oportunidad/minutos/splits;
- support field excluye al protagonista;
- outcomes correlacionados y reproducibles;
- IJL fijo frente a fuerza dinámica;
- cero protección por identidad;
- movilidad sin auto-transferencia;
- identidad real para todo participante/champion nombrado;
- parameters/streams/precision versionados;
- golden/property tests y Monte Carlo aprobados.

**Pendiente para cerrar DR-022**

Dominios y escalas; calendario/formato final de DR-021; funciones de fuerza,
outcomes, movilidad y world update; familias de distribución/correlación;
precisión/cuantización; namespaces y orden de streams; parámetros y targets;
fixtures; catálogo real de DR-025; schemas conformes a facts DR-063/ADR-010;
scope/pool/continuidad de DR-065; interfaces matemáticas de
Selection/Awards/Market.

DR-022 conserva estado `BLOCKER_G3`; ADR-022 no autoriza gameplay.

**Refinamiento de interfaz — G3B Bloque 7 (2026-07-28)**

Club/World es owner de `ClubNeed`, `PositionScarcity`, `financialPower`,
transfer/salary budget context y ciclos de mercado. Estos estados alimentan
candidate field, fit y viabilidad sin garantizar interés u oferta. Transfers
devuelve movimientos confirmados y posibles efectos económicos futuros; no
muta fuerza/prestigio/ciclos mediante bonuses implícitos. La matemática,
dinámica, escalas, streams y fixtures permanecen en DR-022/058.

**Refinamiento de interfaz — G3B Bloque 8 (2026-07-28)**

`WorldState` incorpora `NationalTeamState`, contextos generacionales y sources
para `SelectionCompetitionField`, `AwardCompetitionField` y
`StatisticalCompetitionField`. `NationalTeamDefinition` y `AwardDefinition`
pertenecen a `dataVersion`; el futuro de sus ediciones vive en Career.

`NationalGenerationField` puede alimentar competencia posicional y
`NationalTeamSupportField`, pero ambas rutas deben evitar doble conteo. Un field
abstracto no se presenta como futbolista o ganador real. Fórmulas, escalas,
distribuciones, correlaciones, streams y fixtures continúan en DR-022/059/060.

### DR-065 — Scope competitivo, pools externos y continuidad fuera del tier

**Clasificación:** `BLOCKER_G3` para Club/Competitions del vertical slice.

**Origen**

DR-018 y `MASTER_SPEC` §34.5 fijan dos ligas, 6–10 clubes reales detallados por
liga, dos copas domésticas, Libertadores y Champions. Eso no alcanza por sí
solo para nombrar todos los participantes/champions, aplicar
promotion/relegation ni continuar una Career si el club del protagonista sale
del tier detallado.

ADR-022 admite una abstracción `ExternalClubPool`, pero no la acepta como
política. `MASTER_SPEC` prohíbe inventar clubes para completar vacíos.

**Decisión requerida**

Definir:

- IDs/roles exactos de las competiciones del slice;
- qué participantes se modelan como `ClubState` detallado;
- si existe `ExternalClubPool` y qué identidades/estado mínimo contiene;
- fuentes/dataVersion para clubes externos y tiers de entrada/salida;
- reglas y fields de promotion/relegation;
- cómo se materializa un club promovido al tier detallado;
- cómo se representa champion/qualification de un club externo;
- si el protagonista puede continuar en un tier abstracto;
- qué calendario, oportunidad, Performance, Market, Awards y Scoring se
  preservan fuera del tier;
- transición de vuelta a un tier detallado;
- precisión, streams, parámetros, fixtures y validación Monte Carlo.

**No asumido**

- No se simula automáticamente una liga inferior completa.
- No se aprueba `ExternalClubPool` por inferencia.
- No se inventan identidades.
- No se impide el descenso del club del protagonista.
- No se fuerza transferencia, rescisión, retiro ni fin de Career.
- No se protege a un club por prestigio.

**Opciones a decidir**

1. tiers inferiores detallados con catálogo real suficiente;
2. pool externo real y competición abstracta con contrato reducido;
3. modelo híbrido con participantes reales mínimos y fields no identificables,
   siempre que nunca se publiquen como clubes/champions inventados;
4. otra representación compatible con continuidad y replay.

**Dependencias**

DR-021 para calendario/formato; DR-025 para IDs, fuentes y licencias; DR-022
para estados/outcomes; DR-058 para contrato/mercado; DR-063 para facts; DR-010
para elegibilidad de scoring.

DR-027 no decide este scope: su única interacción es que cualquier estado
económico/valor presentado debe respetar la futura política monetaria. Un
`financialPower` abstracto no autoriza una cifra de mercado.

**Impacto y gate**

Bloquea G3B-F06, fixtures de movilidad, carreras multi-década del slice y golden
seeds donde el club cambia de tier. El engine genérico puede conservar el tipo
de transición, pero no implementar la política ni un fallback automático.

**Refinamiento de interfaz — G3B Bloque 7 (2026-07-28)**

Contrato, `PlayerClubAffiliation`, club identity y movimientos históricos
persisten aunque el club salga del tier detallado. No se fuerza transferencia,
rescisión, agente libre ni retiro. Market solo puede generar need, candidatos,
interés u oferta para ese contexto si el scope/pool aporta identidades,
finanzas, calendario y conocimiento autorizados. No se resuelve Performance o
mercado fuera del tier por inferencia. DR-065 permanece abierta.

### DR-066 — Elegibilidad e inscripción después de movimientos

**Clasificación:** `BLOCKER_G3` para movimientos mid-season y participación
posterior; no bloquea el contrato/afiliación aislados.

**Origen**

G3B Bloque 7 separa `PlayerClubAffiliation` de
`RegistrationEligibility`. Una transferencia o préstamo completado identifica
el club deportivo, pero no define automáticamente si el jugador puede competir
en cada liga/copa/torneo ni desde qué boundary.

**Decisión requerida**

Definir para el vertical slice:

- owner autoritativo de registro/inscripción;
- identidad y schema de `RegistrationEligibility`;
- scope por club, competición, temporada y boundary;
- cuándo comienza elegibilidad tras transferencia, préstamo, retorno o free
  transfer;
- relación con `MarketWindowContext`, CompetitionState y calendario;
- si existen y cómo se abstraen restricciones cup-tied/listas/plazos;
- tratamiento de movimientos excepcionales y antecedentes materiales;
- hechos, idempotencia, versiones y migración;
- parámetros, fixtures y casos de replay.

**No asumido**

- `TransferCompleted` no concede elegibilidad universal.
- No se inventan reglamentos diarios o reales sin `dataVersion`.
- No se prohíbe toda participación por ausencia de detalle.
- No se teletransportan estadísticas entre clubes/competiciones.
- No se usa elegibilidad como cooldown editorial.

**Dependencias**

DR-021 para tiempo/calendario; DR-022 para CompetitionState; DR-025 para datos y
fuentes; DR-058 para movimiento/afiliación; DR-063 para facts; DR-067 para
cadencia mid-season.

**Impacto y gate**

Bloquea oportunidad/minutos/Performance posteriores a un movimiento dentro de
temporada, agregación competitiva, awards/selection/scoring por scope y golden
fixtures de loans/transfers. El engine puede modelar la frontera, pero no
conceder o denegar inscripción por inferencia.

### DR-067 — Cadencia de mercado y movimientos entre Qs

**Clasificación:** `BLOCKER_G3` para transferencias mid-season.

**Origen**

ADR-013/043 fijan una única fase `MARKET`/`MARKET_EVENTS` después de
`COMPETITIONS`. G3B Bloque 7 exige que el dominio soporte cambio de club entre
Qs sin reatribuir ventanas cerradas. El cursor vigente no contiene un punto
Market entre Qs.

**Decisión requerida**

Elegir y documentar:

- si se añaden operaciones/ventanas Market entre Qs;
- si ofertas/negociaciones surgidas antes se resuelven en otra fase pero se
  aplican mediante `schedule` en el próximo boundary legal;
- o si el vertical slice limita movimientos efectivos a post-season;
- ubicación exacta de `MarketWindowContext`, interés, oferta, decisión y
  efectividad;
- relación con `PERFORMANCE_EVENTS`/`HEALTH_EVENTS` sin usarlas como escape;
- cursor, operation keys, checkpoints y random progress;
- efectos sobre `advance(n)`, cadence neutrality y replay;
- compatibilidad/versionado y enmiendas a ADR-013/043;
- fixtures de interrupción antes/después del boundary.

**No asumido**

- No se inserta una fase nueva por inferencia.
- `MARKET_EVENTS` no se reutiliza como mercado mid-season sin decisión.
- No se modifica retroactivamente Q cerrada.
- No se hace efectiva una transferencia fuera de oportunidad legal.
- No se reemplaza el conflicto con una fecha diaria ficticia.

**Dependencias**

DR-013/ADR-013, DR-021, ADR-043, DR-058, DR-063 y DR-066.

**Impacto y gate**

Puede modificar el plan canónico y por tanto `engineVersion`. Bloquea el runner
de mercado mid-season, checkpoints/golden replay y el momento exacto en que el
nuevo club alimenta Role & Minutes, Performance, Health y Development.

**Confirmación G3C-3 (2026-07-29)**

El adapter de Role & Minutes consume únicamente el club/manager/competición
vigente al inicio de la Q. Un cambio posterior no reabre minutos cerrados.
G3C-3 no introduce un boundary de mercado ni resuelve DR-067; cualquier
movimiento mid-season sigue requiriendo la decisión de cursor aquí registrada.

### DR-068 — Nacionalidad deportiva y elegibilidad internacional del vertical slice

**Clasificación:** `BLOCKER_G3` para la selección nacional del vertical slice.

**Origen**

MASTER_SPEC §13 exige elegibilidad derivada de nacionalidad inicial,
ascendencia, naturalización y datos configurados, y prohíbe inventar una segunda
elegibilidad. DR-018 fija Argentina como país principal, pero no determina la
nacionalidad deportiva del protagonista ni las transiciones que pueden
habilitar otra selección.

**Decisión requerida**

Definir y versionar:

- perfil biográfico/nacional mínimo y su fuente autoritativa;
- nacionalidad deportiva inicial del vertical slice;
- representación de una o varias elegibilidades lógicas;
- antecedentes materiales para ascendencia, residencia/naturalización y cambio
  de elegibilidad;
- efecto vinculante de convocatoria, cap, torneo o decisión;
- relación entre renuncia, retiro internacional, retorno y elegibilidad;
- alcance de reglas por edad/tipo de torneo;
- decisiones mecánicas, cursor e idempotencia de transiciones;
- ownership entre `dataVersion`, `contentVersion`, schema y Career state;
- facts mínimos y política de conocimiento/presentación.

**No asumido**

- Elegir Argentina como país principal no asigna automáticamente nacionalidad
  deportiva.
- Jugar en España no crea elegibilidad española.
- No se inventan ascendencia, residencia, segunda nacionalidad o cambio de
  asociación.
- No se implementa normativa FIFA completa ni una simplificación incompatible
  sin una decisión explícita.
- Una transferencia no altera por sí sola la elegibilidad.

**Dependencias**

DR-013, DR-014, DR-018, DR-021, DR-025, DR-059 y DR-063.

**Impacto y gate**

Bloquea el fixture mínimo de `NationalTeamEligibility`, las decisiones
internacionales del slice, la convocatoria autoritativa, replay/cursor y facts
de cambio de elegibilidad. La estructura de `NationalTeamState`,
`SelectionCompetitionField` y Awards puede diseñarse sin resolverlo; no puede
implementarse una carrera internacional end-to-end por inferencia.

### DR-069 — Finalización tras retiro y ventana de regreso

**Clasificación:** `BLOCKER_G3` para Retirement, cursor terminal, scoring final
y vertical slice end-to-end.

**Origen**

G3B Bloque 9 separa `PlayerPlayingStatus` de `CareerStatus` para permitir
retiro→regreso sin reabrir `CareerStatus.RETIRED`. Queda una contradicción no
resuelta:

- `MASTER_SPEC` §19.4 declara que el MVP termina con retiro y resumen;
- `MASTER_SPEC` §16.3 y el catálogo de eventos contemplan regreso del retiro;
- ADR-016 define `ACTIVE -> RETIRED -> COMPLETED`, declara
  `CareerStatus.RETIRED` no avanzable y no permite retorno;
- ADR-013/043 no contiene una fase mecánica de retiro, post-retiro o comeback;
- no existe edad máxima y por tanto la terminación práctica no puede imponerse
  mediante un cap de gameplay.

ADR-062 aclara que un retiro deportivo reversible cambia
`PlayerPlayingStatus`, no `CareerStatus`. No decide cuándo la Career cruza el
boundary irreversible.

**Decisión requerida**

Definir y versionar:

- qué mantiene abierta una Career con `PlayerPlayingStatus.RETIRED`;
- cuándo y en qué boundaries se evalúan oportunidades de comeback;
- cómo representa `SimulationCursor` el tiempo posretiro;
- si `advance(n)` puede procesar períodos posretiro y qué significa “temporada”
  en ese estado;
- el punto/operación que confirma que ya no habrá comeback;
- el comando y precondiciones para `CareerStatus.ACTIVE -> RETIRED`;
- relación con `WAITING_DECISION`, checkpoints, streams e idempotencia;
- cuándo se congela el ScoreLedger final y se consolida el resumen;
- atomicidad y orden entre scoring final, `RETIRED` y `COMPLETED`;
- momento de habilitar ranking, mejor carrera, récords de perfil y tarjeta
  final;
- tratamiento de discoveries ya confirmados, sin reemitirlos;
- política del vertical slice ante comeback mítico frente a cierre normal;
- estrategia para demostrar terminación práctica en simulaciones/Monte Carlo
  sin edad máxima, hazard forzado o probabilidad truncada;
- compatibilidad, migración y bump de `engineVersion`/schema si cambia el plan.

**No asumido**

- El primer `RetirementOccurred` no completa ni rankea la Career.
- No se añade `CareerStatus.RETIRED -> ACTIVE`.
- No se usa `POSTSEASON_EVENTS` como fase mecánica por inferencia.
- No se usa una edad máxima, deadline fijo o cooldown de comeback.
- No se mantiene una Career abierta indefinidamente por decisión implícita.
- No se congela score al primer retiro reversible.
- No se vuelven a emitir discoveries o ScoreLedger entries tras comeback.

**Refinamiento G3B — Bloque 10 (2026-07-28)**

El scoring acumulado puede reconstruirse durante una Career abierta, pero no
constituye `ScoreSnapshot` final ni habilita leaderboard. El primer
`RetirementOccurred` no congela PC. La finalización deberá producir una
referencia terminal verificable que vincule:

```text
closed DomainFact set
-> final ScoreLedger
-> final ScoreSnapshot
-> CareerCompleted
```

Sin decidir el orden atómico exacto, queda fijado que:

- `PlayerPlayingStatus.RETIRED` no es boundary competitivo;
- `CareerStatus.RETIRED` tampoco es ranking final;
- solo `COMPLETED` íntegra y compatible puede ser elegible;
- un comeback agrega nuevos facts con IDs propios y no reemite entries
  existentes;
- el ledger final referencia la `scoringVersion` y el fact set cerrado.

DR-069 continúa pendiente por cursor posretiro, confirmación irreversible,
atomicidad exacta, terminación práctica y policy del slice.

**Dependencias**

ADR-013, ADR-016, ADR-017, ADR-043, ADR-062; DR-008, DR-010, DR-021, DR-062,
DR-063 y las reglas de scoring/profile/ranking aplicables.

**Impacto y gate**

Bloquea G3B-L01/L04, runner posretiro, comeback end-to-end, transición
irreversible, scoring final, `CareerCompleted`, tarjeta final, ranking y golden
fixtures terminales. La estructura de Reputation/Social, hazard y episodios
puede especificarse sin resolverla; no se implementa finalización por
inferencia.

**Tests/evidencia requeridos**

- retiro reversible no completa ni rankea;
- comeback reanuda desde cursor exacto sin reabrir Q cerradas;
- retiro→regreso→retiro conserva identidad e idempotencia;
- misma seed/decisiones produce mismo punto terminal y hashes;
- scoring final se congela exactamente una vez;
- `COMPLETED` no conserva gameplay u oportunidad pendiente;
- discoveries y perfil respetan ADR-017;
- `advance(n)` y cadence neutrality se preservan;
- Monte Carlo demuestra terminación práctica según targets aprobados, sin hard
  cap de edad o tiempo;
- golden fixtures cubren cierre normal, comeback, segundo retiro, abandono e
  invalidación.

### DR-045 — Parámetros y validación del Creation Budget

**Estado:** `PARTIAL_CALIBRATION` — surrogate y protocolo cerrados;
valores/tolerancias pendientes.  
**Fecha de cierre matemático:** 2026-07-29.  
**ADR:** [ADR-071](adr/071-creation-development-mathematics.md).

**Origen**

DR-019 fija un presupuesto común y exige equivalencia Monte Carlo, pero deja intencionalmente sin resolver:

- total numérico;
- componentes presupuestados;
- costes, incluido `DominantFoot.BOTH`;
- distribuciones de Carrera rápida;
- grados de libertad y azar oculto de Carrera personalizada;
- tolerancias, métricas y tamaño de muestra;
- umbral de aprobación para leaderboard compartido.

**Decisión requerida**

Publicar una especificación de creación versionada con esos parámetros y un protocolo Monte Carlo reproducible.

**No asumido**

No se asignarán costes provisionales ni se declarará equivalencia por compartir únicamente el mismo total nominal.

**Resolución parcial de G3B — Bloque 1 (2026-07-27)**

ADR-052 y `PLAYER_MODEL_SPEC.md` fijan que `Creation Budget` representa poder
inicial esperado de la configuración completa, no suma de atributos. Toda
ventaja sistemática —incluidos traits ocultos, posición y
`DominantFoot.BOTH`— participa en la equivalencia, que debe verificarse por
Monte Carlo. Continúan pendientes función cuantitativa, total, costes,
distribuciones, métricas, tolerancias y tamaño de muestra. DR-045 no queda
cerrada.

**Cierre matemático G3C-2**

Se adopta `CreationPowerScore`, surrogate cuadrático versionado sobre las 20
capabilities, 10 traits, posición, pie y edad. No es Overall ni input de
gameplay. Quick y Custom:

1. samplean el mismo quantile de una CDF de poder;
2. usan la misma distribución base por mixture de factores;
3. aceptan el primer candidato condicionado dentro de una banda de CPS;
4. comparan distribuciones mediante SMD, median/quantiles, Wasserstein-1 y KS,
   con intervalos/tolerancias versionados.

`BOTH` participa como efecto calibrado en CPS y no resta una capability fija.
Custom no elige hidden variables exactas.

DR-045 pasa a `PARTIAL_CALIBRATION`: faltan coeficientes del surrogate,
mixture, CDF, banda, tolerancias y manifests de evidencia. No falta una función
o criterio estadístico.

**Impacto**

Creación rápida, futura creación personalizada, DR-023, schemas de configuración, balance y comparabilidad competitiva.

### DR-047 — Contrato de conteo del contenido del vertical slice

**Origen**

DR-018 fija 30 eventos, 5 cadenas narrativas y 6 lesiones, pero no define si:

- los nodos/desenlaces de las cadenas forman parte de los 30 eventos;
- una lesión que también se presenta mediante EventDefinition cuenta en ambos catálogos;
- variantes narrativas de DR-012 cuentan como contenido independiente;
- el conteo se realiza por definición, discovery ID, oportunidad o presentación.

**Decisión requerida**

Definir una unidad de inventario y reglas de conteo verificables para la release del slice.

**No asumido**

No se duplicarán ni descontarán definiciones por inferencia para alcanzar las cifras.

**Impacto**

Plan editorial, contentVersion, validación de alcance, fixtures y criterio de salida de P6/P8.

### DR-048 — Reconversiones fuera del alcance posicional del vertical slice

**Estado:** Resuelta.  
**Fecha:** 2026-07-29.  
**ADR:** [ADR-071](adr/071-creation-development-mathematics.md).

**Origen**

DR-018 limita las posiciones del slice a `GK`, `CM` y `ST`, mientras DR-044 permite `effectivePosition` y reconversiones entre los 15 códigos canónicos.

**Decisión requerida**

Definir para el vertical slice:

- si primaria, secundarias y posición efectiva deben permanecer en `GK`/`CM`/`ST`;
- si una reconversión puede salir de ese conjunto;
- qué catálogos, fórmulas, premios y cohortes deben existir si se permite;
- cómo se prueba cobertura sin ampliar silenciosamente el alcance.

**No asumido**

No se habilitarán ni prohibirán reconversiones fuera del slice desde la implementación.

**Refinamiento parcial de G3B — Bloque 2 (2026-07-27)**

Development no cambia capabilities con el objetivo de justificar una nueva
posición. La evolución real del perfil puede cambiar probabilidades de
reconversión; contexto, decisiones y uso efectivo siguen siendo causas
separadas. No se garantiza compatibilidad.

La matriz, evidencia, duración y salida o no del conjunto `GK`/`CM`/`ST`
continúan sin resolver. DR-048 no queda cerrada.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

Role & Minutes recibe una `effectivePosition` ya validada y no ejecuta la
reconversión. Puede registrar un breakdown futuro `usageByPosition`, pero debe
conservar exactamente `actualMinutes` y una posición dominante por Q. El
alcance fuera de `GK`/`CM`/`ST`, la matriz y la duración siguen sin resolverse.

**Refinamiento de frontera — G3B Bloque 6 (2026-07-28)**

`PositionCompetition` usa la taxonomía canónica de ADR-011 para evitar un
segundo modelo de club, pero el gameplay del slice continúa limitado a
`GK`/`CM`/`ST`. Esto no habilita reconversiones fuera del slice ni obliga a
calibrar las otras posiciones. DR-048 permanece abierta.

**Refinamiento de frontera — G3B Bloque 7 (2026-07-28)**

`ClubNeed`, `PositionScarcity` y `PlayerClubFit` usan la taxonomía posicional
canónica, pero una transferencia no cambia `primaryPosition`, compatibilidad o
`effectivePosition` por sí sola. El nuevo contexto puede modificar
probabilidades futuras de uso/reconversión mediante sus owners. Esto no decide
el alcance fuera de `GK`/`CM`/`ST`; DR-048 permanece abierta.

**Refinamiento de frontera — G3B Bloque 8 (2026-07-28)**

`SelectionCompetitionField` usa `PositionCode` específico y cada
`AwardDefinition` declara posición, grupo o scope agnóstico. Esta arquitectura
no habilita campos, métricas o premios fuera de `GK`/`CM`/`ST` en el slice. Si
una reconversión sale del conjunto, DR-048 debe exigir cobertura de Selection y
Awards antes de autorizarla.

**Resolución G3C-2**

El vertical slice habilita exactamente `GK`, `CM` y `ST` para primary,
secondary y effective position del protagonista. Las otras doce posiciones son
`CONTENT_DISABLED` para esa release, no lógicamente imposibles en la
arquitectura.

El contrato genérico de PositionSuitability/retraining admite los quince
códigos, pero una posición futura solo puede habilitarse con parameters y
coverage completa de Performance, Role, Market, Selection, Awards y
calibración. No se genera producción genérica provisional.

Dentro del slice, retraining puede comparar las tres posiciones mediante
logistic/softmax, sin threshold ni cambio de capabilities. Los coeficientes
permanecen en DR-053 como calibración; el scope preguntado por DR-048 queda
cerrado.

**Impacto**

DR-008, datos, contenido, golden seeds, premios, rankings y alcance real del vertical slice.

### DR-049 — Ponderación y empates de posición dominante

**Estado:** Resuelta.  
**Fecha:** 2026-07-29.  
**ADR:** [ADR-071](adr/071-creation-development-mathematics.md).

**Origen**

DR-044 exige una posición histórica dominante calculada a partir de temporadas/minutos efectivos, pero no fija:

- si basta sumar minutos o si las temporadas tienen ponderación propia;
- el scope temporal exacto de cada ranking no basado en carrera completa;
- el desempate entre posiciones con igual resultado;
- el tratamiento de scopes sin minutos suficientes;
- la versión que gobierna el cálculo cuando scoring cambia.

**Decisión requerida**

Publicar la función determinista de dominancia, sus scopes, desempates, precisión y fixtures para rankings y premios posicionales.

**No asumido**

No se usará por defecto la posición inicial, la posición final, la más reciente ni una asignación múltiple para resolver empates.

**Refinamiento parcial de G3B — Bloque 3 (2026-07-27)**

Los únicos inputs posicionales nuevos permitidos son minutos confirmados por
`effectivePosition` y, si se habilita, un `usageByPosition` conservativo por Q.
Una asignación sin minutos no aporta peso. La función, scopes, ponderación,
empates y precisión permanecen abiertos; DR-049 no queda cerrada.

**Refinamiento de frontera — G3B Bloque 6 (2026-07-28)**

Outcomes y contribución competitiva conservan minutos/posición efectiva por
competición, pero no eligen cohorte histórica. `PlayerCompetitiveContribution`
no puede sustituir la función de posición dominante. DR-049 permanece abierta.

**Refinamiento de frontera — G3B Bloque 7 (2026-07-28)**

Una temporada multiclub conserva minutos por Q, club, competición y
`effectivePosition`. Market puede consumir ese breakdown, pero el club final,
fee o expectativa contractual no aportan peso posicional. Transfers no elige
cohorte ni desempate; DR-049 permanece abierta.

**Refinamiento de frontera — G3B Bloque 8 (2026-07-28)**

Selection usa posición específica del contexto; Awards usa la posición
dominante del período declarado por la Definition. Secundarias sin minutos no
dan elegibilidad y una reconversión posterior no reabre una edición. El Bloque
8 no elige ponderación, scope sin minutos ni empate: DR-049 permanece abierta y
bloquea premios posicionales ejecutables.

**Refinamiento de frontera — G3B Bloque 10 (2026-07-28)**

Scoring consume exclusivamente minutos confirmados por `effectivePosition`
desde `MinutesRecorded.usageByPosition`. No usa primary inicial/final,
SportingRole, club, fee o award como peso. Cada rule declara el scope de
dominancia y recibe una sola posición. Función, ponderación, empate y cero
minutos siguen abiertos; DR-049 continúa bloqueando SC-11 y cohortes.

**Resolución G3C-2**

Para todo scope cerrado:

1. sumar minutos confirmados por Position sin duplicar breakdown;
2. agregar por PositionGroup;
3. elegir grupo por minutos, leading-position minutes, firma de exposición
   ordenada/padded y orden `GK,DEF,MID,FWD`;
4. elegir posición específica dentro del grupo por minutos y orden ADR-011.

Un scope sin minutos no tiene cohorte competitiva. Rankings agregados usan el
grupo; awards/rankings específicos usan la posición secundaria resultante
dentro del grupo. El scope declara contextos incluidos. No se ponderan
temporadas, recency, posición inicial/final ni secondary positions sin minutos.

Esta función es determinista, no usa RNG y queda ligada a la versión
participante. DR-049 deja de bloquear SC-11 por la función posicional; Scoring
conserva sus propios parámetros/cohortes en DR-010.

**Impacto**

DR-010, premios, scoring, cohortes, ranking interno, leaderboard y golden seeds.

## 7. Decisiones sobre datos, legal y contenido

### DR-024 — Categorías de fútbol

Definir si el MVP incluye fútbol masculino, femenino o ambos; catálogos, reglas, premios, textos y rankings compartidos o separados.

### DR-025 — Mercados y fuentes del MVP

Definir ligas, países, clubes, snapshot inicial, fuentes, fecha de corte, licencias y responsable de revisión.

### DR-026 — Assets y denominaciones protegidas

Definir qué nombres, logos, escudos, trofeos, fotografías y marcas pueden usarse; política de fallback; proceso de retirada y auditoría.

### DR-027 — Valor de mercado y monedas

**Estado:** Parcialmente resuelta — representación exacta aceptada el
2026-07-28; fuente, moneda de referencia, conversión, calibración, presentación
y fixtures pendientes.

Definir:

- valor abstracto o cifra monetaria;
- fuente/calibración;
- moneda interna;
- conversión y presentación;
- aclaración de que no es tasación real.

**Refinamiento de frontera — G3B Bloque 6 (2026-07-28)**

`ClubState.financialPower` y los ciclos económicos de `WorldState` son contexto
abstracto; no son `marketValue`, precio de transferencia ni moneda. Pueden ser
inputs futuros del mercado solo mediante DR-058. Un `ExternalClubPool` tampoco
autoriza valores monetarios inventados. DR-027 permanece abierta para unidad,
moneda, calibración y presentación.

**Resolución parcial de representación — G3B Bloque 7 (2026-07-28)**

- `MarketValueEstimate` es una estimación monetaria observer-specific, no una
  tasación objetiva;
- `TransferFee` es el precio concreto de una operación y puede ser cero;
- `SalaryTerms` es compensación contractual;
- los tres usan `Money` con unidades menores enteras exactas y
  `currencyCode`;
- no se usa floating point ni se asume moneda/conversión global;
- storage canónico y presentación están separados;
- comparar monedas requiere un contexto de conversión versionado todavía no
  aprobado.

Se rechazan índice abstracto como única representación del valor, floating
point, valor=fee=salary, `financialPower` como valor y moneda global por
inferencia.

**Pendiente para cerrar DR-027**

Catálogo/fuente de monedas, rango interoperable del schema, moneda de referencia
por contexto, unidades menores definitivas, rates/snapshot de conversión,
calibración, presentación, disclaimer y fixtures. DR-027 queda parcialmente
resuelta, no cerrada.

**Tests/gates requeridos**

- Money rechaza floating point, negativos y overflow;
- canonicalización/hash conservan el entero exacto y currency;
- monedas distintas no se comparan/suman sin contexto versionado;
- MarketValue, fee y salary no son aliases;
- free transfer admite fee cero;
- presentación/conversión no mutan el valor persistido;
- fixtures y calibración se ligan a versiones participantes.

### DR-028 — Política de contenido sensible y edad

Definir catálogo permitido, categorías, advertencias, valor por defecto, clasificación etaria, revisión editorial, regiones y proceso de retirada.

### DR-029 — Nombres creados y abuso

Definir moderación de nombres ofensivos, suplantación de personas reales, alias públicos, reportes y tratamiento en share cards.

## 8. Decisiones antes de servidor y ranking

### DR-030 — Cuentas, autenticación y modo invitado

Definir si el MVP exige cuenta, proveedor de autenticación, vínculo entre perfil local y remoto, recuperación y borrado.

### DR-031 — Autoridad: calcular o verificar

**Problema**

El servidor puede “calcular el siguiente estado o verificar el resultado determinístico recibido”.

**Decisión requerida**

Definir por modo:

- cálculo server-side;
- verificación/replay;
- muestreo de replays;
- comportamiento ante divergencia;
- versiones de cliente admitidas.

**Propuesta técnica**

Usar el mismo package de engine en cliente, CLI y servidor; el servidor produce o reproduce la verdad oficial.

### DR-032 — Sincronización offline

**Problema**

Se menciona una cola “firmable” y estado pendiente, pero no existe protocolo.

**Decisión requerida**

Definir:

- qué se firma y con qué clave;
- cuánto puede avanzar offline una carrera oficial;
- reconciliación de decisiones;
- conflictos;
- expiración;
- downgrade a local/no oficial.

### DR-033 — Persistencia, checkpoints y retención

Definir:

- frecuencia de snapshots;
- payload canónico;
- compacción;
- retención de logs y catálogos;
- recuperación ante corrupción;
- backup/restore;
- migraciones de partidas activas;
- política de PII.

### DR-034 — Intentos por seed y desafíos

**Problema**

Se sugieren límites de intentos puntuables, pero la política está abierta.

**Decisión requerida**

Definir intentos, ventanas, visibilidad de cantidad de intentos y desempate.

**Aclaración**

Una limitación competitiva de envíos no debe alterar el motor, la semilla ni las probabilidades de la carrera.

### DR-035 — Percentiles y frecuencias públicas

Definir tamaños mínimos de muestra, cohortes, intervalo de confianza, actualización, privacidad y texto cuando no hay datos suficientes.

**Refinamiento G3B — Bloque 10 (2026-07-28)**

Las bandas narrativas iniciales de PC no usan percentiles: aplican los rangos
absolutos de `MASTER_SPEC`. DR-035 sigue pendiente para percentiles deportivos,
frecuencias públicas, cohortes y sample-size policy; no bloquea SC-13 inicial.

### DR-036 — Comparabilidad entre versiones

Definir cuándo dos `scoringVersion` o presets pueden compartir tabla, cómo funciona el Salón de la Fama y qué ocurre con correcciones críticas.

**Refinamiento G3B — Bloque 10 (2026-07-28)**

`LeaderboardCompatibilityKey` debe incluir al menos `scoringVersion`.
Coincidencia de esa versión es necesaria, pero no se declara suficiente.
Presets, automatización, Creation Budget, engine/data y correcciones siguen
pendientes de la policy de DR-036. No se mezclan tablas por inferencia.

### DR-037 — Privacidad pública

Definir alias, país opcional, visibilidad, expiración de enlaces, borrado, retención de share cards y efecto de borrar la cuenta sobre rankings históricos.

### DR-046 — Políticas de automatización y elegibilidad competitiva

**Origen**

DR-020 separa automatización de dificultad y exige versionarla, pero no aprueba políticas concretas ni su elegibilidad.

**Decisión requerida**

Definir:

- políticas automáticas admitidas;
- inputs que pueden observar;
- estrategia y versión;
- cuándo intervienen;
- trazabilidad y posibilidad de override;
- elegibilidad para ranking oficial;
- cohortes o tablas separadas si corresponde.

**No asumido**

Ninguna automatización toma decisiones mecánicas en una carrera oficial hasta cerrar esta política.

**Impacto**

Application, replay, DecisionRecord, competencia, UX y versionado.

## 9. Decisiones antes de publicación

### DR-038 — Telemetría y consentimiento

Definir eventos, campos, anonimización, consentimiento, retención, acceso interno, opt-out y uso de datos de carreras sensibles.

### DR-039 — Modelo comercial

Definir gratuito, publicidad, premium o combinación, preservando no pay-to-win y sin alterar probabilidades o score.

### DR-040 — SLO y capacidad

Los SLO de la sección 49 son “sugeridos”. Confirmar cuáles serán objetivos contractuales del lanzamiento y con qué carga de referencia.

### DR-041 — Política operativa de anomalías

Definir umbrales de replay, congelamiento temporal, revisión manual, apelación y revocación de ranking. Una carrera no puede sancionarse únicamente por ser muy afortunada.

## 10. Matriz de cierre

| Gate | Decisiones necesarias | Estado actual |
|---|---|---|
| Schemas estructurales del núcleo | DR-001 a DR-007, DR-011 a DR-016, DR-044, DR-052, DR-058, DR-061, DR-062, DR-063 y DR-070 | Base G1/G2, estructuras G3B, facts/ledger e identidad del ParameterSet resueltos; schemas pueden diseñarse. Dominios específicos y gameplay siguen bloqueados por DR-058/061/062/069 y decisiones matemáticas. |
| G3C — gameplay matemático | DR-008, DR-010, DR-021, DR-022, DR-027, DR-048, DR-049 y DR-053 a DR-070 | G3C-1 cerró el contrato transversal; G3C-2/3 cerraron catorce familias: 2 `RESOLVED_MATH`, 12 `PARTIAL_CALIBRATION` y 49 `PARTIAL` para G3C-4–G3C-11. DR-048/049/064 están resueltas; DR-021/045/053/054 conservan pendientes explícitos. |
| Motor de temporada | DR-002 a DR-008, DR-012 a DR-016, DR-042 a DR-044 y DR-053 a DR-069 según subsistema | Infraestructura determinista, estructuras Q y matemática de Role/Minutes están cerradas; faltan ParameterSet/targets, producers upstream, continuidad, inscripción y cursor mid-season/internacional/posretiro. |
| Scoring/ledger | DR-007, DR-009, DR-010, DR-011, DR-015, DR-044, DR-049 y DR-063 | DR-049/063, SC-01, SC-12 y SC-13 están resueltos estructuralmente; faltan SC-02 a SC-11, scopes/atribución, caps y fixtures de DR-010. |
| Contenido del vertical slice | DR-012, DR-014, DR-018, DR-022, DR-043, DR-047, DR-065 y decisiones de datos aplicables | DR-012, DR-014, DR-018 y DR-043 resueltas; DR-022 tiene estructura aceptada; faltan matemática, conteo, catálogo y scope/movilidad. |
| Vertical slice completo | DR-008 a DR-023, DR-042 a DR-045, DR-047 a DR-049, DR-053 a DR-069 y decisiones previas aplicables | DR-048/049/064 están resueltas. Faltan DR-008, DR-010, DR-021, matemática de DR-022, calibración DR-045/053/054, DR-047 y las partes ejecutables restantes de DR-055 a DR-069. |
| Servidor/ranking | DR-019, DR-020, DR-030 a DR-037, DR-045, DR-046 y DR-049 | DR-019, DR-020 y DR-049 resueltas; faltan DR-030 a DR-037, calibración DR-045 y DR-046. |
| Publicación | DR-024 a DR-029 y DR-038 a DR-041 | Pendiente. |

## 11. Plantilla de resolución

Cada decisión cerrada deberá registrar:

```text
ID:
Estado:
Fecha:
Responsable:
Opción aceptada:
Alternativas rechazadas:
Motivo:
Secciones de MASTER_SPEC afectadas:
Impacto en schemaVersion/engineVersion/contentVersion/dataVersion/scoringVersion:
Tests o evidencia requeridos:
ADR o documento asociado:
```
