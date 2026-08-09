# Health, Injury & Recovery Specification

**Estado:** normativa estructural para G3B — Bloque 5; matemática cerrada por
G3C-5, calibración y catálogo médico pendientes  
**Fecha:** 2026-07-29  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-002 a ADR-005, ADR-012, ADR-013,
ADR-014, ADR-018, ADR-042, ADR-052 a ADR-055, ADR-057 y ADR-074  
**Decisiones afectadas:** DR-008, DR-021, DR-022, DR-042, DR-053 a DR-057,
DR-063 y DR-064  
**Board:** G3B-E01 a G3B-E08 y refinamientos directos de B02, B04, B05,
C04 a C06, D02, D05 a D09, F01, F04 y L02

## 1. Propósito y alcance

Esta especificación fija la estructura causal del estado de salud, la
disponibilidad médica, la carga, las lesiones, la recuperación, la recaída y
las secuelas. La matemática ejecutable quedó fijada en
[`HEALTH_INJURY_RECOVERY_MATH_SPEC.md`](HEALTH_INJURY_RECOVERY_MATH_SPEC.md).
Este documento no elige:

- coeficientes;
- hazards base;
- taxonomía clínica completa;
- valores para las seis lesiones del vertical slice;
- tolerancias/targets;
- parámetros de balance.

No implementa lesiones, entrenamiento diario, calendario, disciplina,
decisiones médicas, retiro ni gameplay. Esos elementos solo reciben o entregan
contratos conceptuales.

DR-057 queda `PARTIAL_CALIBRATION`. Toda cantidad calibrable se carga desde
configuración versionada; esta especificación no autoriza defaults hardcoded.

## 2. Ownership y separación del modelo

La salud no se representa con un único número. El estado verdadero distingue:

| Concepto | Owner | Semántica |
|---|---|---|
| `fitness` | Health | Preparación física contextual y temporal. |
| `fatigue` | Health | Carga fisiológica temporal no recuperada. |
| `LoadState` | Health | Historia reciente y acumulada de exposición/carga realizada. |
| `HealthCondition` | Health | Condición física activa que puede restringir participación. |
| `InjuryEpisode` | Health | Episodio de lesión con identidad causal e historia propia. |
| `RecoveryState` | Health | Progreso de recuperación de una condición o episodio. |
| `HealthHistory` | Health | Episodios, relaciones, resoluciones y secuelas auditables. |
| `injuryFragility` | Player traits | Predisposición persistente que modifica riesgo; no determina lesiones. |
| `recoveryCapacity` | Player traits | Predisposición persistente de recuperación; no es entorno médico. |
| `longevity` | Player traits | Predisposición de mantenimiento/desgaste a largo plazo; no fija retiro. |
| `medicalQuality` | Club/entorno | Calidad contextual de prevención, detección, rehabilitación y seguimiento. |

`fitness` y `fatigue` son `DYNAMIC_STATES`. No son aliases de `pace`,
`stamina`, `strength` ni de ninguna capability. Tampoco mutan capabilities
directamente.

Los traits permanecen separados entre sí y del contexto:

- `injuryFragility` modifica distribuciones de ocurrencia y, cuando el modelo
  aprobado lo permita, recaída o interacción con historial;
- `recoveryCapacity` modifica distribuciones de recuperación;
- `longevity` modifica mantenimiento, desgaste y respuesta a largo plazo;
- `medicalQuality` pertenece al entorno y nunca se fusiona con
  `recoveryCapacity`.

Ninguno funciona como threshold binario, garantía o imposibilidad editorial.

## 3. `HealthState`

El snapshot mecánico de salud de un jugador en un límite confirmado contiene
conceptualmente:

```text
HealthState
  fitness
  fatigue
  loadState
  activeConditions[]
  recoveryStates[]
  persistentConsequences[]
  historySummary
  sourceCheckpoint
```

La forma cuantitativa final del schema pertenece a DR-057 y debe conformarse al
catálogo, identidad y clasificación ya cerrados por DR-063/ADR-010. La
estructura debe preservar estas separaciones:

1. estado dinámico actual;
2. exposición realizada;
3. condiciones activas;
4. progreso de recuperación;
5. consecuencias confirmadas;
6. historia causal.

`fitness` y `fatigue` deben vivir en dominios finitos y acotados declarados por
la configuración matemática futura. La especificación no fija escala, valor de
referencia ni función de saturación. Una transición válida debe preservar el
dominio; no se permite crecimiento numérico no acotado ni clamp silencioso.

`LoadState` puede acumular historia sin convertirla en un cap de gameplay. Su
representación puede usar acumuladores y ventanas de resumen, siempre que la
evidencia normativa de replay no se pierda.

## 4. Disponibilidad médica y disponibilidad agregada

### 4.1 `MedicalAvailabilityEnvelope`

Health produce una salida médica por jugador, contexto de participación y Q:

```text
MedicalAvailabilityEnvelope
  seasonId
  quarter
  participationContext
  availabilityShare
  knownMedicalUnavailability
  medicalRestrictions[]
  medicalReasonRefs[]
  uncertainty
  sourceHealthSnapshot
  unavailableExposureAllocation
```

La lista expresa semántica, no un schema final.
`unavailableExposureAllocation` fue añadido por ADR-072: ubica la
indisponibilidad médica confirmada sobre ordinales abstractos de oportunidad
por competición/Q. Debe ser consistente con `availabilityShare`; no asigna
minutos ni simula fechas.

`availabilityShare` satisface:

```text
0 <= availabilityShare <= 1
```

Representa la proporción temporal/física de la oportunidad de esa ventana que
es médicamente utilizable. No es un porcentaje de minutos asignados, no es
`minuteShare` y no garantiza participación.

El envelope puede expresar:

- indisponibilidad total;
- disponibilidad parcial;
- disponibilidad completa;
- restricciones de carga, intensidad, retorno o uso físico;
- una o más razones médicas referenciadas;
- incertidumbre de evaluación cuando el dominio la admita.

La incertidumbre no autoriza a cambiar retroactivamente una disponibilidad ya
confirmada. Una estimación médica comunicada al usuario puede diferir del
desenlace real sin convertirse en una segunda verdad mecánica.

Health no asigna `SportingRole`, `expectedMinutes` ni `actualMinutes`.

### 4.2 `AvailabilityEnvelope` agregado

`MedicalAvailabilityEnvelope` no incluye suspensiones ni indisponibilidades no
médicas. El contrato futuro se separa así:

```text
MedicalAvailabilityEnvelope  <- Health
DisciplinaryAvailability     <- Discipline/Competition policy
OtherAvailability            <- owners tipados
                 |
                 v
AvailabilityEnvelope         <- agregación autoritativa
                 |
                 v
Role & Minutes
```

La agregación ocurre en `AVAILABILITY(Qn)` antes de resolver rol y minutos.
ADR-072/DR-064 la cierra como unión exacta de intervalos por competición; el
engine de orquestación es owner de la composición. Shares ambiguos sin
información de overlap producen un error tipado.

No se multiplican, suman o minimizan shares por inferencia. Tampoco se asigna a
Health el ownership de disciplina. Role & Minutes consume el resultado
agregado y conserva:

```text
0 <= actualMinutes
   <= availableTeamMinutes
   <= TeamMinutesOpportunity.teamMinutes
```

La ambigüedad previa que atribuía a Health un envelope con lesión, suspensión y
otras causas queda corregida: Health solo es owner del componente médico.

## 5. Exposición, carga y origen

### 5.1 Familias de exposición

El modelo admite como mínimo:

| `ExposureKind` conceptual | Fuente |
|---|---|
| `COMPETITIVE` | Minutos y uso deportivo confirmados. |
| `TRAINING_BACKGROUND` | Entrenamiento/preparación agregados, sin simular sesiones. |
| `NON_FOOTBALL` | Exposición física no futbolística compatible con el estado. |
| `EXTERNAL_EVENT` | Causa explícita emitida por Events u otro subsistema autorizado. |

`actualMinutes` es la señal principal de exposición competitiva del vertical
slice, pero no la única fuente conceptualmente posible. Cero minutos no implica
automáticamente hazard total cero.

Performance puede entregar señales de intensidad/contexto realizadas. Un
rating, una mala actuación o la producción observada no se usan como proxy de
carga sin una señal física explícita.

### 5.2 `LoadState`

`LoadState` distingue al menos:

- carga reciente;
- carga acumulada;
- fuente/tipo de exposición;
- contexto de participación;
- referencia a la evidencia realizada.

Minutos y carga no son sinónimos. La transformación futura puede considerar
intensidad, preparación, calendario y restricciones, pero no se fija aquí.

### 5.3 Origen mecánico de lesión

`InjuryOrigin` debe ser compatible al menos con:

```text
MATCH
TRAINING
NON_FOOTBALL
EXTERNAL_EVENT
```

`origin` identifica la causa mecánica inmediata; no reemplaza `InjuryFamily`,
severidad ni presentación narrativa.

Un evento externo sensible no entra al hazard deportivo normal. Events emite
un hecho causal externo autorizado y Health procesa después sus consecuencias
físicas. La presentación explícita o reducida conserva exactamente el mismo
hecho, probabilidad, efectos y replay conforme a ADR-012.

## 6. Oportunidades y hazard de lesión

La lesión se resuelve mediante hazard contextual por oportunidad, no mediante
un porcentaje fijo almacenado en el jugador.

El contrato del hazard debe poder consumir:

- exposición competitiva, de entrenamiento, no futbolística o externa;
- carga reciente y acumulada;
- `fatigue`;
- `fitness`;
- edad/contexto;
- `injuryFragility`;
- historial por familia, severidad y recencia;
- condiciones activas y recuperación;
- `medicalQuality`;
- posición y contexto físico;
- origen;
- azar determinista.

La forma funcional, integración hazard→probabilidad, riesgos competitivos,
distribución de conteo y orden total de oportunidades permanecen en DR-057.

La estructura sí exige:

1. oportunidades tipadas e identificables;
2. namespace/contexto de stream explícito y versionado;
3. orden canónico definido por la configuración/engine, no por arrays
   incidentales;
4. aplicación de consecuencias confirmadas antes de oportunidades posteriores
   que dependan de ellas;
5. soporte para cero, una o múltiples ocurrencias;
6. traza de covariables, modificadores y resultado.

No existen:

- máximo de lesiones por Q, temporada o carrera;
- cuota de lesiones graves;
- cooldown posterior a una lesión;
- inmunidad editorial de recaída;
- máximo editorial de condiciones simultáneas.

Probabilidad exactamente cero solo corresponde a imposibilidad lógica o
contenido mecánicamente deshabilitado. La rareza, un historial vacío o una
recuperación previa no convierten por sí solos un resultado concebible en cero.

## 7. Condiciones, episodios y taxonomía

### 7.1 `HealthCondition`

`HealthCondition` es el concepto persistente general para una condición física
activa. Puede representar una lesión u otra condición médica futura sin
obligar a que todo estado sea un `InjuryEpisode`.

El estado admite una colección de condiciones activas. Más de una puede
coexistir cuando sea lógicamente compatible. Las interacciones entre
condiciones se parametrizan; no se colapsan en `currentInjury`.

### 7.2 `InjuryEpisode`

Un episodio de lesión mantiene identidad causal:

```text
InjuryEpisode
  episodeId
  family
  severity
  origin
  onset
  recoveryState
  restrictions[]
  parentEpisodeId?
  relatedEpisodeRefs[]
  status
  sourceCauseRef
```

La lista expresa el mínimo semántico. `episodeId` debe derivarse de contexto
canónico y ordinal determinista; no usa reloj, UUID aleatorio ni fuente externa.

`InjuryOccurred` registra la ocurrencia. No sustituye al episodio persistente.
Progresión, retorno, recaída, secuela y resolución actualizan o relacionan
estado mediante operaciones propias; no se reescribe el hecho original.

Un nuevo episodio relacionado debe prevenir duplicación accidental mediante
identidad e idempotencia causal.

### 7.3 `InjuryFamily` y severidad

`InjuryFamily` es una taxonomía mecánica extensible. Core no contiene cientos
de diagnósticos narrativos. Una familia puede seleccionar parámetros y mapearse
a contenido médico/narrativo versionado.

Familia y severidad son dimensiones distintas. Severidad puede modificar
probabilísticamente:

- disponibilidad;
- duración;
- trayectoria de recuperación;
- recaída;
- complicaciones;
- secuelas.

No existe una duración rígida única por familia o severidad. Las seis lesiones
del vertical slice siguen siendo contenido/calibración de G3B-E04 y ADR-018; no
se inventan en esta fase.

## 8. Recuperación, retorno, recaída y secuela

### 8.1 Recuperación

La recuperación es probabilística y contextual. Puede depender de familia,
severidad, `recoveryCapacity`, `medicalQuality`, edad, historial,
complicaciones, estado y azar.

Se distinguen:

- recuperación esperada: estimación o distribución comunicable;
- recuperación realizada: trayectoria mecánica confirmada.

La estimación no fija una fecha real ni consume el mismo rol semántico que el
estado verdadero.

La recuperación no se reduce a `injuredUntil`. Sin simular días, el modelo debe
representar fases equivalentes a:

```text
INJURED
-> REHABILITATION
-> LIMITED_RETURN
-> FULLY_AVAILABLE
```

Las transiciones pueden saltar, retroceder o permanecer cuando la matemática
aprobada lo permita; no son un cronómetro determinista. Los nombres finales de
wire/schema pertenecen a DR-063, pero estas cuatro semánticas son obligatorias.

`LIMITED_RETURN` puede producir disponibilidad parcial y restricciones.
`FULLY_AVAILABLE` indica ausencia de restricción actual por el episodio; la
resolución definitiva del episodio se confirma por separado cuando corresponde.

### 8.2 Recaída y agravamiento

Una recaída o reinjury requiere referencia causal a un episodio anterior.
Puede depender de:

- recencia;
- completitud de recuperación;
- carga y exposición;
- `fatigue`;
- `injuryFragility`;
- historial;
- condiciones concurrentes;
- azar.

Una recaída no está garantizada ni prohibida por cooldown. Crea una nueva
ocurrencia relacionada o una transición causal explícita, preservando
`parentEpisodeId`/referencias equivalentes y el episodio previo.

El catálogo final debe distinguir, cuando la mecánica lo necesite, recaída,
agravamiento y nueva lesión de la misma familia sin deducirlos solo por igualdad
de texto.

### 8.3 Secuela

Health puede confirmar un `SequelaProfile` con semántica:

```text
NONE
TEMPORARY
PERSISTENT
```

Una secuela describe consecuencia física/salud posterior, alcance, persistencia
y episodio causal. No escribe un delta rígido en capabilities.

- Health es owner de la existencia y perfil de la secuela.
- Development & Aging es owner de cualquier consecuencia permanente sobre
  capabilities mediante `CAPABILITY_EVOLUTION(Qn)`.
- Performance puede consumir restricciones y estados ya confirmados.
- Retirement puede consumir historia y carga persistente, pero decide su propio
  hazard.

La misma familia/severidad puede terminar sin secuela, con consecuencia
temporal o con consecuencia persistente.

## 9. Fitness y fatigue

### 9.1 `fatigue`

`fatigue` se actualiza desde carga, recuperación, fitness, calendario/contexto y
condiciones de salud. Persiste parcialmente entre Q y admite recuperación.

Debe permanecer en un dominio acotado. La función de persistencia, recuperación
y saturación se externaliza. Acotar el estado evita inestabilidad numérica; no
impone un cap editorial a lesiones, minutos u outcomes.

### 9.2 `fitness`

`fitness` representa preparación física contextual. Puede cambiar por:

- lesión o condición activa;
- recuperación;
- inactividad;
- carga;
- preparación;
- restricciones confirmadas.

Performance consume el snapshot confirmado al inicio de su operación. Fitness
no es una capability ni una copia inversa de fatigue.

## 10. Pipeline causal Q1–Q4

Este bloque no cambia las 38 operaciones canónicas de ADR-013/042/043 ni agrega
una fase a `SimulationCursor`.

### 10.1 Estado al entrar en Qn

Qn recibe el checkpoint confirmado posterior a `CONSEQUENCES(Qn-1)` —o el
estado inicial de temporada para Q1— con:

- `HealthState`;
- condiciones activas y recuperación;
- fitness/fatigue;
- carga reciente/acumulada;
- secuelas vigentes;
- historia necesaria;
- contexto médico y de calendario disponible;
- causas externas ya confirmadas/programadas.

### 10.2 `AVAILABILITY(Qn)`

1. Health evalúa el estado médico ya confirmado al inicio de Qn.
2. Health emite/calcula `MedicalAvailabilityEnvelope`.
3. La agregación autoritativa combina el componente médico con disciplina y
   otras fuentes tipadas.
4. Role & Minutes consume el `AvailabilityEnvelope` agregado.
5. Se confirman `SportingRole` y `expectedMinutes`.

No se generan lesiones nuevas desde minutos que todavía no ocurrieron.

### 10.3 `PRODUCTION(Qn)`

1. Role & Minutes confirma `actualMinutes` y uso.
2. Performance consume minutos, fitness, fatigue, restricciones y contexto.
3. Performance confirma producción/summaries.
4. Se registran señales físicas realizadas de exposición e intensidad para
   Health.

Health no recalcula minutos ni Performance infiere una lesión desde el rating.

### 10.4 `HEALTH(Qn)`

Health consume estado inicial más exposición/carga realizada. Dentro de esta
operación el orden matemático fijado por ADR-074 es:

1. registrar exposición realizada;
2. actualizar la representación de carga;
3. resolver candidates post-window de fatigue y fitness;
4. generar y resolver lesiones nuevas mediante compound Poisson;
5. progresar recuperación de episodios preexistentes;
6. resolver recaídas de episodios preexistentes elegibles;
7. resolver secuelas de episodios completados;
8. producir el checkpoint Health para Qn+1.

Un episodio nuevo no progresa ni recae en la misma resolución agregada. El
hazard snapshot del compound Poisson se congela antes del count para no
inventar cronología match-by-match. Cada occurrence se materializa por ordinal
y su estado queda aplicado antes de cualquier operación posterior que lo
consuma. Ningún orden se deriva de una colección incidental.

### 10.5 `CONSEQUENCES(Qn)`

La operación aplica atómicamente:

- altas/progresiones/resoluciones de condiciones;
- estado de recuperación;
- fitness/fatigue post-health;
- restricciones futuras;
- secuelas confirmadas;
- señales de inactividad, carga y salud para Development;
- estado que consumirá `AVAILABILITY(Qn+1)`.

Development puede consumir salud y secuelas confirmadas dentro de su
suboperación de evolución, pero Health no aplica deltas de capabilities.

Después se evalúan `PERFORMANCE_EVENTS(Qn)` y `HEALTH_EVENTS(Qn)` según ADR-043.
Una causa externa emitida allí no reabre Qn: se programa/aplica en el siguiente
límite causal válido.

### 10.6 Lesión dentro de una Q agregada

ADR-042 ya fija la convención:

- una lesión resuelta en `HEALTH(Qn)` ocurre después de cerrar minutos y
  producción de Qn;
- no reduce retroactivamente Qn;
- sus consecuencias participan de Qn+1;
- no se inventa fecha o partido exacto dentro de Qn.

Por tanto, no existe un conflicto temporal abierto. Permitir que una lesión
reduzca minutos de la misma Q exigiría subdividir la ventana mediante un ADR y
nueva `engineVersion`; no puede simularse implícitamente.

## 11. Interfaces

### 11.1 Entradas

| Proveedor | Entrada a Health | Restricción |
|---|---|---|
| Role & Minutes | `actualMinutes`, uso/splits y exposición competitiva confirmados. | No entrega `expectedMinutes` como carga realizada. |
| Performance | Intensidad y señales físicas/contextuales realizadas. | Rating/producción no son proxy automático de carga. |
| Club & Competitions | `medicalQuality`, calendario, schedule/context y exposición relevante. | Health consume; no genera estas dimensiones. |
| Events | Causas externas autorizadas y tipadas. | No se duplican en el hazard deportivo normal. |
| Player | Edad/contexto y traits verdaderos autorizados. | Traits no se exponen a consumidores no autorizados. |

ADR-022 y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) fijan que
`medicalQuality` pertenece a `ClubState` y que schedule difficulty, congestión y
exposición provienen del snapshot Competitions/Calendar de Q. Un cambio de club,
manager o contexto solo afecta resoluciones posteriores. Health no infiere
estos inputs desde prestigio, `ClubOverall` o resultados de la misma Q.

### 11.2 Salidas

| Consumidor | Salida de Health | Restricción |
|---|---|---|
| Role & Minutes | `MedicalAvailabilityEnvelope`. | El aggregate incluye otras causas fuera de Health. |
| Performance | fitness, fatigue y restricciones confirmados. | Solo snapshots anteriores a producción de Qn. |
| Development | estado de salud, carga/inactividad y `SequelaProfile` confirmado. | Development posee cambios permanentes de capability. |
| Retirement | historia de lesiones, carga persistente y burden confirmado. | No obliga retiro ni define edad máxima. |
| Market/Selection | hechos autorizados de disponibilidad/estado comunicado. | No filtra `injuryFragility`, `recoveryCapacity` u otros latentes verdaderos. |
| Content/UI | referencia mecánica y proyección de conocimiento/estimación. | Narrativa no cambia mecánica; estimación no revela estado verdadero obligatorio. |

## 12. Hechos, estado y traza

Los nombres son candidatos semánticos; DR-063 fija schemas, identidad,
idempotencia, migración y allowlist:

| Concepto | Clasificación por defecto | Semántica |
|---|---|---|
| `MedicalAvailabilityCalculated` | Traza/snapshot candidato | Componente médico, razones y restricciones antes del aggregate. |
| `WindowAvailabilityAssessed` | Fact/snapshot agregado candidato | Disponibilidad final consumida por Role & Minutes; no pertenece solo a Health. |
| `LoadRecorded` | Evidencia interna auditable | Exposición y carga realizada, sin duplicar `MinutesRecorded`. |
| `FatigueUpdated` | Cambio de estado candidato | Snapshot anterior/posterior y causa. |
| `FitnessUpdated` | Cambio de estado candidato | Snapshot anterior/posterior y causa. |
| `InjuryOccurred` | Fact de dominio | Nueva ocurrencia con `episodeId`, origen y causa. |
| `InjuryProgressed` | Cambio de estado candidato | Transición de episodio/condición. |
| `RecoveryUpdated` | Cambio de estado candidato | Progreso, estimación y estado realizado separados. |
| `ReturnToPlayReached` | Fact candidato | Alcance de retorno/restricciones; no asigna minutos. |
| `RelapseOccurred` | Fact de dominio | Nueva ocurrencia relacionada con episodio previo. |
| `SequelaRecorded` | Fact de dominio candidato | Perfil temporal/persistente y causa. |
| `HealthConditionResolved` | Fact de dominio | Cierre de condición sin borrar historia. |

No todo valor intermedio se convierte en fact. La traza de hazard y los
snapshots pueden vivir en checkpoints auditables sin duplicar ocurrencias.

Ningún output de Health crea `ScoreLedgerEntry`. La salud puede afectar
participación o hechos deportivos posteriores, pero no otorga puntos por sí
sola salvo que DR-010/DR-063 autoricen un logro deportivo distinto y
anti-duplicado.

**Cierre G3B Bloque 10:** `InjuryOccurred`, `RelapseOccurred` y
`SequelaRecorded` son facts canónicos. Progreso, recovery, return-to-play y
resolution usan `HealthConditionTransitioned.transitionKind`, sin aliases.
Fitness/fatigue usan `PlayerDynamicStateChanged.stateKind`.
`MedicalAvailabilityCalculated` es summary y `LoadRecorded`, internal signal.
Ningún fact de Health está allowlisted para puntos directos.

## 13. Historia, concurrencia y auditabilidad

La auditoría debe reconstruir:

```text
TeamMinutesOpportunity
-> MedicalAvailabilityEnvelope
-> AvailabilityEnvelope
-> sporting opportunity
-> actualMinutes
-> realized exposure/load
-> health opportunity
-> health outcome
-> consequences for next Q
```

Para ello se conservan referencias a:

- temporada/Q/contexto;
- checkpoint de entrada;
- condiciones y episodios causales;
- exposición/carga realizada;
- stream/contexto y ordinal de oportunidad;
- transición anterior/posterior;
- facts externos cuando existan;
- versiones participantes.

La historia completa puede conservarse como log/checkpoints y derivar un
`HealthHistorySummary` eficiente con, al menos:

- familia;
- severidad;
- recencia;
- episodios relacionados;
- recaídas/agravamientos;
- secuelas;
- burden persistente.

Un resumen no puede destruir la evidencia necesaria para replay, auditoría o
recalcular un riesgo autorizado. La colección activa admite condiciones
concurrentes; la identidad causal impide crear dos veces el mismo episodio.

## 14. Invariantes

1. Salud no es un único número.
2. Fitness, fatigue, carga, condiciones y recuperación son conceptos distintos.
3. Traits del jugador y `medicalQuality` del entorno no se fusionan.
4. Fitness/fatigue no mutan capabilities directamente.
5. Health produce disponibilidad médica, no disponibilidad disciplinaria.
6. `availabilityShare` permanece en `[0,1]`.
7. Health no asigna rol ni minutos.
8. `actualMinutes` nunca se sustituye por `expectedMinutes` como exposición
   realizada.
9. Cero minutos no implica automáticamente cero hazard total.
10. `InjuryOccurred` y `InjuryEpisode` no son el mismo objeto.
11. Familia, severidad y origen son dimensiones separadas.
12. Puede existir más de una condición activa compatible.
13. No hay caps, cuotas, cooldowns ni inmunidad editorial.
14. Recuperación esperada no fija recuperación realizada.
15. Recaída/agravamiento conserva relación causal con otro episodio.
16. Una secuela no escribe capabilities; Development aplica consecuencias
    permanentes.
17. Lesión de Qn no reescribe minutos o producción de Qn.
18. Causas externas no se duplican en el hazard deportivo.
19. Fatigue/fitness permanecen en dominios acotados sin clamp silencioso.
20. Historia, streams, orden y versiones permiten replay determinista.
21. Ningún fact de Health crea puntos directamente.

## 15. Parameter Registry Candidates

Todos estos valores deben vivir en configuración versionada:

- dominios, precisión y cuantización de fitness/fatigue;
- hazards base;
- transforms de exposición;
- exposición de entrenamiento/background;
- exposición no futbolística;
- transforms de carga;
- memoria de carga reciente y acumulada;
- persistencia y recuperación de fatigue;
- dinámica de fitness;
- pesos de `InjuryFamily`;
- taxonomía y parámetros de familia;
- distribuciones de severidad;
- distribuciones de duración de recuperación;
- curvas/transiciones de recuperación;
- incertidumbre de estimaciones médicas;
- hazard de recaída/agravamiento;
- probabilidades y perfiles de secuela;
- sensibilidad a edad;
- efecto de `injuryFragility`;
- efecto de `recoveryCapacity`;
- efecto de `medicalQuality`;
- mapping de schedule difficulty/congestión/contexto del mundo a exposición y
  carga, sin duplicar minutos;
- efecto del historial y recencia;
- distribuciones de origen;
- interacciones entre condiciones concurrentes;
- mapping de estado/restricciones a `MedicalAvailabilityEnvelope`;
- composición médica interna cuando existan varias condiciones;
- precisión y cuantización de `availabilityShare`;
- parámetros de LIMITED_RETURN;
- orden canónico de oportunidades por familia/origen;
- namespaces/contextos de streams;
- correlaciones entre ocurrencia, severidad, recuperación, recaída y secuela;
- fixtures de calibración;
- targets/tolerancias Monte Carlo de incidencia, duración, ausencia, recaída,
  secuela y carga.

ADR-072/DR-064 cierran la composición del `AvailabilityEnvelope` agregado.
ADR-074/G3C-5 cierra la asignación médica mediante intervalos prefix ordinales
y exact union, sin absorber disciplina.

## 16. Resolución del Design Board

| ID | Estado tras G3C-5 | Cierre matemático | Pendiente |
|---|---|---|---|
| G3B-E01 | Resuelta estructuralmente | HealthState separado, ownership, MedicalAvailability y frontera aggregate. | Valores del ParameterSet. |
| G3B-E02 | `PARTIAL_CALIBRATION` | Dose rates competitiva/training y compound Poisson sin caps. | Valores, producers y targets. |
| G3B-E03 | `PARTIAL_CALIBRATION` | Competing cumulative hazards por family/origin en log-rate. | Intercepts, betas y catálogo. |
| G3B-E04 | Parcial/calibrable | Familia mecánica separada de severidad y narrativa. | Taxonomía completa y seis lesiones del slice. |
| G3B-E05 | `PARTIAL_CALIBRATION` | Severity logistic-Normal, requirement LogNormal y progreso softplus. | Valores/targets médicos. |
| G3B-E06 | `PARTIAL_CALIBRATION` | Readiness continuo, intervalos exactos y relapse Poisson relacionado. | Valores/targets. |
| G3B-E07 | `PARTIAL_CALIBRATION` | Logistic occurrence/type, burden logistic-Normal y decay temporal. | Affinities, valores y targets. |
| G3B-E08 | Calibración externalizada | Registro de parámetros y targets definido. | Valores y targets aprobados. |

No queda una decisión G3C-5 abierta por falta de familia matemática o sampler.
La publicación de schemas/engine de gameplay sigue bloqueada por valores,
catálogo, goldens y calibration gates.

## 17. Decisiones y gates pendientes

DR-057 pasa a `PARTIAL_CALIBRATION`. Antes de implementar deben aprobarse:

- valores completos de `EngineParameterSet.health`;
- seis `InjuryFamilyDefinition` del slice;
- producers upstream de G3C-6;
- schemas conformes a DR-063;
- expected outputs y hashes de golden fixtures;
- targets/tolerancias y suites Monte Carlo;
- replay cross-runtime de samplers, exp/log y quantization.

DR-064 permanece resuelta por ADR-072. G3C-5 ya cierra
`unavailableExposureAllocation` sin absorber disciplina.

Antes de implementar Health se requieren tests/gates para:

1. disponibilidad médica parcial, total y nula;
2. aggregate sin atribuir disciplina a Health;
3. múltiples condiciones activas compatibles;
4. cero/una/múltiples lesiones sin caps;
5. misma seed/contexto produce los mismos episodios;
6. streams independientes no se desplazan;
7. lesión Q2 afecta Q3/Q4, nunca Q1/Q2;
8. recovery esperado y realizado pueden diferir;
9. recaída conserva episodio padre;
10. secuela no muta capabilities fuera de Development;
11. evento externo no se sortea de nuevo como lesión deportiva;
12. replay reconstruye la cadena completa y no duplica facts;
13. fixtures extremos preservan probabilidad positiva cuando corresponde;
14. golden/property tests y Monte Carlo cumplen targets todavía por aprobar.
