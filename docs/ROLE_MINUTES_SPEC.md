# Role and Minutes Specification

**Estado:** Normativa estructural G3B refinada por cierre matemático G3C-3; calibración numérica pendiente  
**Fecha:** 2026-07-29  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-011, ADR-013, ADR-042, ADR-044,
ADR-052, ADR-053, ADR-054, ADR-057, ADR-058 y ADR-072  
**Decisiones del board cubiertas:** G3B-C01 a G3B-C07; dependencias directas
G3B-A06, G3B-B04, G3B-B05, G3B-D01, G3B-E01 y G3B-F01 a G3B-F04

## 1. Propósito y alcance

Este documento define la estructura causal mediante la cual una ventana Q
establece la relación institucional del jugador, su expectativa deportiva y su
participación efectiva. Las ecuaciones y samplers normativos están en
[`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md); este documento no
define valores de calibración, generación de calendario, hazards de salud ni
fórmulas de rendimiento.

Quedan fuera de alcance:

- simular partidos o plantillas completas;
- asignar coeficientes de rol o minutos;
- generar lesiones, suspensiones o tarjetas;
- calcular rendimiento, desarrollo, reputación, scoring o selección;
- decidir reconversiones o posiciones arbitrarias;
- fijar el calendario o los formatos de competición.

Los parámetros pendientes deben provenir de
`EngineParameterSet.roleMinutes`. ADR-072 cierra las familias matemáticas de
DR-054; la implementación oficial continúa bloqueada por calibración, goldens
y contratos upstream.

## 2. Tres conceptos independientes

### 2.1 `SquadStatus`

`SquadStatus` representa la relación institucional vigente con el plantel:

```text
OUT_OF_SQUAD
PROSPECT
SQUAD_PLAYER
FIRST_TEAM
```

No representa calidad, expectativa exacta de minutos ni participación
realizada. En particular, `PROSPECT` puede coexistir con cualquier
`SportingRole`, incluidos `STARTER`, `KEY_PLAYER` y `STAR`. La edad puede
modificar distribuciones o contexto, pero no determina un `SquadStatus` ni un
rol por threshold.

### 2.2 `SportingRole`

`SportingRole` representa la expectativa deportiva principal para un contexto y
una ventana:

```text
BENCH
ROTATION
STARTER
KEY_PLAYER
STAR
```

Es una categoría contextual y probabilística. No es un overall, un porcentaje
fijo de minutos, una garantía de selección ni una banda rígida. Su orden
editorial no autoriza thresholds mecánicos.

### 2.3 `EffectiveUsage`

`EffectiveUsage` representa la participación confirmada en una ventana. Debe
poder contener, como mínimo:

- contexto de participación;
- `actualMinutes`;
- `minuteShare` realizado o la referencia suficiente para derivarlo;
- posición efectiva dominante;
- desglose por posición cuando exista;
- resumen de apariciones y titularidades cuando haya sido derivado;
- referencias a la oportunidad y disponibilidad que limitaron la exposición.

No es un enum. Puede diferir materialmente de `SportingRole`: un `STARTER` puede
terminar con pocos minutos y un `ROTATION` con muchos. La diferencia surge de
disponibilidad, contexto, varianza y hechos confirmados, no de excepciones
editoriales.

Los tres conceptos no se colapsan en un `RoleState` único. Un cambio en uno no
reescribe automáticamente los otros.

## 3. Contexto posicional y táctico

### 3.1 Precondición de posición efectiva

Antes de resolver rol y minutos debe existir una `effectivePosition` válida
para el contexto de la ventana. Role & Minutes la consume; no elige una posición
arbitraria.

La posición puede diferir de `primaryPosition`, pero debe proceder de:

- una `secondaryPosition` compatible; o
- una reconversión válida y ya confirmada conforme a ADR-044.

La asignación previa sirve como posición dominante planificada para la
resolución. `EffectivePositionUsed` solo confirma uso histórico cuando existe
participación efectiva, de acuerdo con ADR-044. Una ventana sin minutos no
aporta peso a la posición histórica dominante.

### 3.2 `tacticalFit`

`tacticalFit` es una derivación contextual entre:

- capabilities verdaderas;
- `effectivePosition`;
- demandas o necesidades tácticas;
- contexto del entrenador y del club.

No es una capability ni reemplaza calidad contextual, rendimiento o
`managerTrust`. Puede ser bajo aunque la calidad del jugador sea alta. La forma
de proyección efectiva común queda delimitada por
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md); sus parámetros y el
contexto de Club/Competitions siguen pendientes.

## 4. Confianza y competencia

### 4.1 `managerTrust`

`managerTrust` es un `DYNAMIC_STATE` distinto de capabilities, forma, calidad,
rendimiento, `tacticalFit` y rol. Es un input probabilístico de las
distribuciones de rol y minutos, nunca una regla binaria.

Role & Minutes puede leer el valor confirmado al inicio de Q. No calcula su
actualización a partir del rendimiento de esa misma ventana. Performance,
eventos u otros sistemas podrán emitir evidencia para una actualización
posterior en `CONSEQUENCES(Qn)`, cuya ecuación pertenece a DR-056.

### 4.2 `PositionCompetition`

La competencia interna se representa mediante un campo agregado por club,
contexto y posición. Debe expresar al menos conceptos equivalentes a:

- `competitionStrength`;
- `competitionDepth`;
- `positionStability` o `entrenchment`, cuando sea relevante.

No requiere competidores individuales ni una plantilla ficticia. Un club fuerte
puede tener competencia más exigente, pero la relación no es universal ni
determinista. Escalas, distribución, correlaciones y evolución pertenecen a
DR-022.

## 5. Tiempo disponible y disponibilidad

### 5.1 `TeamMinutesOpportunity`

Cada contexto y Q recibe una oportunidad finita de minutos competitivos del
equipo:

```text
TeamMinutesOpportunity(
  participationContext,
  seasonId,
  quarter,
  competitionScope,
  teamMinutes
)
```

`teamMinutes` es el total físico de tiempo de juego que un único jugador podría
ocupar en ese equipo/contexto, derivado del calendario agregado y de las
competiciones activas. No es la suma de los once puestos simultáneos ni un cap
editorial por rol. Role & Minutes lo consume como input y no inventa partidos,
fechas o formatos.

`teamMinutes`, `availableTeamMinutes` y `actualMinutes` son conteos canónicos no
negativos. ADR-072 cierra cuantización con `ROUND_HALF_EVEN`;
`expectedMinutes` es una expectativa binary64 derivada.

La forma exacta de `SeasonId`, los splits por competición y el cálculo de
`teamMinutes` siguen pendientes de DR-021 y DR-022.

### 5.2 Disponibilidad médica y aggregate

Health proporciona un `MedicalAvailabilityEnvelope` conforme a
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md#4-disponibilidad-médica-y-disponibilidad-agregada).
Contiene un `availabilityShare ∈ [0,1]`, restricciones, razones médicas,
indisponibilidad conocida e incertidumbre cuando corresponda. No incluye
suspensiones ni otras causas no médicas.

Una agregación autoritativa separada combina:

```text
MedicalAvailabilityEnvelope
DisciplinaryAvailability
OtherAvailability[]
  -> AvailabilityEnvelope
```

Role & Minutes consume el `AvailabilityEnvelope` resultante para derivar
`availableTeamMinutes`, respetando:

```text
0 <= availableTeamMinutes <= TeamMinutesOpportunity.teamMinutes
```

Role & Minutes no genera hazards de lesión, tarjetas ni suspensiones. Health no
es owner de disciplina. ADR-072 compone por unión exacta de intervalos
semiabiertos sobre ordinales abstractos de oportunidad. Shares sin información
suficiente de solapamiento producen
`AVAILABILITY_OVERLAP_UNSPECIFIED`; no se suman, multiplican ni minimizan.

Una reducción confirmada solo afecta la ventana actual o posteriores. Nunca
reescribe minutos de una ventana cerrada.

## 6. Resolución jerárquica

### 6.1 Rol como distribución

`SportingRole` se muestrea de una distribución condicionada, como mínimo, por:

- calidad contextual para `effectivePosition`;
- `tacticalFit`;
- `managerTrust`;
- `PositionCompetition`;
- resumen de rendimiento previo ya confirmado;
- `form` heredada;
- contexto y reputación cuando representen causas distintas;
- `SportingRole` anterior;
- contexto institucional y de temporada;
- azar determinista.

No se usan thresholds rígidos. La edad puede desplazar probabilidades, pero no
asigna el rol. La persistencia del rol anterior es un modificador
probabilístico externalizado: no bloquea cambios, no impone cooldowns y puede
ser superada por un cambio extremo de contexto.

### 6.2 Rendimiento previo

Role & Minutes consume un resumen autorizado de ventanas cerradas. El contrato
debe identificar el período y la evidencia de origen, sin recalcular
Performance ni volver a muestrear la producción.

El resumen puede aportar rendimiento multidimensional, sorpresa respecto de
expectativa, exposición, contexto, presión, fuerza de evidencia e incertidumbre
conforme a
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md#13-performancesummary-y-agregación-de-temporada).
Su escala y parámetros pertenecen a DR-055 y su traducción a `managerTrust`,
form/confidence/morale pertenece a DR-056. El rol de Qn no puede depender del
rendimiento aún no realizado de Qn.

### 6.3 Minutos esperados y realizados

`expectedMinutes` representa una expectativa condicional calculada antes de la
realización. No es una promesa, un cap ni el resultado persistente principal.

La participación se resuelve mediante una proporción:

```text
minuteShare ∈ [0, 1]
```

condicionada por rol, disponibilidad y contexto. La realización produce
`actualMinutes`, con la invariante:

```text
0 <= actualMinutes <= availableTeamMinutes
```

Si `availableTeamMinutes` es cero, `actualMinutes` es cero. Para evitar `0/0`,
un share derivado puede omitirse o representarse según el schema que cierre
DR-054; no se infiere dividiéndolo por cero. La política exacta de operación y
stream para este caso debe quedar fijada junto con esa matemática.

La familia de distribución, la masa en cero, dispersión, correlaciones,
precisión, redondeo y asignación por competición permanecen abiertas. Deben
permitir suficiente varianza para que ningún `SportingRole` determine minutos
exactos.

### 6.4 Apariciones y titularidades

`actualMinutes` es la medida causal principal. `appearances` y `starts` se
derivan posteriormente de:

- minutos confirmados;
- `SportingRole`;
- contexto agregado de calendario;
- parámetros probabilísticos versionados.

Como mínimo:

```text
0 <= starts <= appearances
```

El algoritmo, la granularidad y la coherencia con calendarios agregados siguen
pendientes de DR-021, DR-022 y DR-054. Apariciones y titularidades no se sortean
primero para volver a generar minutos de manera independiente.

## 7. Uso multiposicional y contextos

Cada Q conserva una `effectivePosition` dominante para la resolución. El modelo
puede extenderse con `usageByPosition`, sujeto a:

```text
sum(usageByPosition[position].minutes) = actualMinutes
```

No se duplican minutos. La posición efectiva dominante sigue siendo la clave
canónica requerida por ADR-044. ADR-071 y DR-048/049 cierran reconversión e
historia dominante; el vertical slice usa una posición dominante por Q sin
duplicar minutos.

Club y selección son contextos separados. Pueden reutilizar la misma familia
conceptual, pero tienen oportunidades y hechos distintos:

- `clubMinutes`;
- `nationalTeamMinutes`.

Nunca comparten directamente una `TeamMinutesOpportunity`, y un minuto no puede
pertenecer simultáneamente a ambos contextos.

## 8. Orden causal en Q1–Q4

El orden lógico de cada Q es:

```text
estado confirmado al inicio
-> effectivePosition y contexto elegible
-> MedicalAvailabilityEnvelope
-> AvailabilityEnvelope agregado
-> SportingRole
-> expectedMinutes
-> minuteShare / actualMinutes
-> Performance
-> Health posterior a la producción
-> actualizaciones de estados dinámicos
-> siguiente ventana
```

No se agrega una fase nueva a `SimulationCursor`:

- `ROLE_AND_MINUTES` inicializa priors institucionales y de temporada;
- `AVAILABILITY(Qn)` confirma contexto, disponibilidad, rol esperado y
  expectativa;
- la primera suboperación de `PRODUCTION(Qn)` confirma minutos;
- Performance consume esos minutos;
- `CONSEQUENCES(Qn)` puede actualizar `managerTrust`, forma, confianza, moral y
  señales para la siguiente Q.

Cada suboperación debe poseer una `operationKey` estable para checkpoint y
replay. Reanudar no repite rol, share, minutos ni streams consumidos.

El rendimiento de Qn afecta principalmente Qn+1. No se recalculan
retroactivamente rol o minutos ya confirmados. Cambiar la cadencia visual o
agrupar temporadas no cambia ningún resultado.

## 9. Interfaces con otros subsistemas

### Hacia Performance

Role & Minutes entrega:

- `effectivePosition`;
- `SportingRole`;
- `actualMinutes`;
- disponibilidad y contexto de participación;
- `tacticalFit` o los inputs necesarios para derivarlo;
- contexto de club/competición.

Performance no puede modificar minutos de la misma Q. Devuelve evidencia
cerrada para ventanas posteriores mediante `PerformanceSummary`, sin exponer
capabilities efectivas persistidas ni latentes verdaderos. Production conserva
exactamente los splits de minutos/posición/competición recibidos y atribuye cada
output una sola vez.

### Desde Health

Health entrega el estado confirmado y el `MedicalAvailabilityEnvelope`. Role &
Minutes no interpreta diagnósticos ni genera lesiones. Consume únicamente el
`AvailabilityEnvelope` ya agregado por la frontera autoritativa y no asigna a
Health las causas disciplinarias. Después de producción, Health puede consumir
carga/minutos confirmados para el estado y hazard de ventanas posteriores.

### Desde Club y Competitions

Club/Competitions entrega:

- `ManagerContext` versionado y `TacticalIdentity`;
- `PositionCompetition`, propiedad de Club;
- `TeamMinutesOpportunity`, propiedad de Competitions/Calendar;
- contexto y splits por competición.

Role & Minutes no simula una plantilla, un calendario ni resultados de
competición. ADR-022 y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) fijan que:

- el contexto es un snapshot causal de Q y un cambio de manager no reescribe
  ventanas cerradas;
- `PositionCompetition` expresa fuerza, profundidad y entrenchment sin
  competidores individuales;
- `teamMinutes` es tiempo físicamente ocupable por un jugador;
- la suma de splits de oportunidad y minutos conserva el total;
- `leagueCompetitiveStrength`/prestigio no reemplazan calidad contextual o
  competencia por puesto.

La fórmula/calibración de esos inputs y el calendario permanecen en
DR-021/022. ADR-072/DR-064 ya cierran la composición de disponibilidad.

### Desde Transfers y Contracts

Después de un movimiento efectivo, Role & Minutes recibe el nuevo
`currentSportingClubId`, snapshot de Club/Manager/Tactical context,
`PositionCompetition`, boundary causal y futura `RegistrationEligibility`.

`ContractExpectation = DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE` es una señal
contractual separada. Puede influir probabilísticamente en expectativa,
`managerTrust`, morale o relaciones mediante sus owners, pero nunca se traduce
directamente a `SquadStatus`, `SportingRole`, `expectedMinutes` o
`actualMinutes`.

Una Q cerrada conserva el club y contexto originales. Si una transferencia es
efectiva entre Qs, solo las ventanas posteriores consumen el nuevo contexto.
DR-066 debe cerrar eligibility y DR-067 la ubicación exacta en el cursor.

### Hacia Development y otros consumidores

Solo `actualMinutes` y exposición confirmada alimentan experiencia, carga,
reputación o scoring. `expectedMinutes` y `SportingRole` no se contabilizan como
participación realizada.

Role & Minutes puede emitir evidencia para actualizaciones posteriores de
`managerTrust`, `morale`, `confidence`, experiencia y reputación, pero no
implementa esas ecuaciones.

## 10. Outputs conceptuales de dominio

Los nombres siguientes sustituyen aliases ambiguos de documentos exploratorios.
El schema debe conformar identidad e idempotencia de
`SCORING_FACTS_SPEC.md`:

| Output | Semántica mínima |
|---|---|
| `WindowAvailabilityAssessed` | Oportunidad, aggregate médico/no médico, disponibilidad resultante, causas y contexto de Q. |
| `SportingRoleAssigned` | Rol anterior y asignado, posición/contexto y referencias causales autorizadas. |
| `expectedMinutes` | `INTERNAL_SIGNAL`: expectativa condicionada pre-sample; no participación real ni fact. |
| `MinutesRecorded` | Minutos efectivos, contexto, Q y referencias a oportunidad/disponibilidad. |
| `EffectivePositionUsed` | Posición dominante y minutos efectivos; solo aporta historia cuando hubo uso. |
| `AppearanceSummaryRecorded` | Apariciones/titularidades derivadas y contexto, cuando el contrato esté aprobado. |

`SquadStatusChanged` se emite únicamente cuando cambia el estado institucional,
no como ruido en cada Q. `SeasonWindowClosed` confirma incluso una ventana con
cero participación.

`MedicalAvailabilityCalculated` pertenece a la traza/snapshot de Health y no se
duplica como output de Role & Minutes. El catálogo canónico clasifica ambos.

Un output de rol o minutos nunca crea `ScoreLedgerEntry`; scoring solo consume
los facts allowlisted por ADR-010/`SCORING_FACTS_SPEC.md`.

**Cierre G3B Bloque 10:** `SportingRoleAssigned`, `MinutesRecorded` y
`AppearanceSummaryRecorded` son facts canónicos. `MinutesRecorded` contiene el
uso por posición; `EffectivePositionUsed` es una vista derivada.
`WindowAvailabilityAssessed` es summary y `expectedMinutes`, internal signal.
Requests especializados reutilizan
`DecisionRequested.decisionKind`. Véase
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md).

## 11. Invariantes

1. `SquadStatus`, `SportingRole` y `EffectiveUsage` son conceptos distintos.
2. `PROSPECT` puede coexistir con cualquier `SportingRole`.
3. Ningún rol asigna un porcentaje fijo ni garantiza minutos.
4. `managerTrust` no reemplaza calidad, forma, rendimiento o `tacticalFit`.
5. Role & Minutes recibe una `effectivePosition` válida y no reconvierte.
6. No se simulan competidores individuales para resolver
   `PositionCompetition`.
7. Toda oportunidad del equipo es finita por realidad física, no por un cap
   editorial.
8. Health no es owner de disciplina y el componente médico no asigna minutos.
9. `0 <= actualMinutes <= availableTeamMinutes <= teamMinutes`.
10. Minutos de posiciones, competiciones y contextos no se duplican.
11. Club y selección tienen oportunidades y facts independientes.
12. `starts <= appearances`.
13. Performance de Qn no modifica rol o minutos ya cerrados de Qn.
14. Una actualización de confianza o rol solo afecta operaciones posteriores.
15. No existen thresholds de edad/calidad, cooldowns de rol ni máximos
    artificiales.
16. Replay y reanudación no repiten tiradas ni outputs confirmados.
17. `ContractExpectation` no es role/usage ni asigna minutos.
18. Un movimiento solo cambia el contexto de boundaries futuros y no reabre una
    Q.
19. Afiliación deportiva no sustituye `RegistrationEligibility`.

## 12. Parameter Registry Candidates

Los valores siguientes deben residir en configuración versionada:

- parámetros y priors de la distribución de `SportingRole`;
- `rolePersistence`;
- influencia de `managerTrust`;
- influencia de `tacticalFit`;
- influencia de `PositionCompetition`;
- influencia del resumen de rendimiento previo;
- influencia de reputación y contexto;
- influencia autorizada de `ContractExpectation` sin mapping fijo a role;
- adaptación/inercia de rol después de cambio de club;
- parámetros y familia de distribución de `minuteShare`;
- masa en cero y dispersiones;
- parámetros de minutos específicos por rol, posición y contexto;
- mapping de `MedicalAvailabilityEnvelope` dentro del aggregate;
- composición, precedencia y solapamientos del `AvailabilityEnvelope`;
- mapping del aggregate a `availableTeamMinutes`;
- derivación de apariciones y titularidades;
- parámetros de uso multiposicional;
- correlaciones entre rol, share, disponibilidad y contexto;
- precisión, redondeo y cuantización de expectativas/shares;
- asignación de oportunidad y minutos por competición;
- escalas y distribución de `PositionCompetition`;
- parámetros de `TeamMinutesOpportunity`;
- generación y vigencia de `ManagerContext`/`TacticalIdentity`;
- dificultad, congestión y pressure exposure del calendario agregado;
- contexts de streams, golden fixtures y tolerancias Monte Carlo.

Ningún valor queda asignado por esta especificación.

## 13. Estado de decisiones relacionadas

| DR | Estado después de G3C-3 |
|---|---|
| DR-021 | Parcial: SeasonId ordinal, Q y boundary matemático cerrados; formatos/generación e integración internacional siguen pendientes |
| DR-022 | Escalas/evolución de club, táctica, competencia y competiciones |
| DR-048 | Resuelta por ADR-071 |
| DR-049 | Resuelta por ADR-071 |
| DR-054 | `PARTIAL_CALIBRATION`: ecuaciones/samplers cerrados por ADR-072; faltan valores/targets |
| DR-055 | Estructura aceptada por ADR-055; faltan matemática, escalas, precisión, streams, parámetros y fixtures del summary |
| DR-056 | Actualización de `managerTrust`, forma, confianza y feedback |
| DR-057 | Estructura aceptada por ADR-057; G3C-5 debe producir la asignación médica consumida por ADR-072 |
| DR-064 | Resuelta por ADR-072 |
| DR-058 | Estructura aceptada por ADR-058; `ContractExpectation` queda separada; faltan influencia matemática, parámetros y fixtures |
| DR-066 | Elegibilidad/inscripción competitiva posterior a movimientos |
| DR-067 | Boundary/cursor de movimientos entre Qs |
| DR-063 | Resuelta; clasificación de outputs confirmada por G3C-3 |

Las aperturas upstream/downstream no invalidan el cierre matemático local.
Implementar el subsistema oficial requiere valores, targets, goldens y los
inputs de G3C-5/G3C-6.

## 14. Gates antes de implementar

1. schemas separados para los tres conceptos, sin enum combinado;
2. fixture válido `PROSPECT + STAR`;
3. rol y minutos no contienen bands, thresholds, cooldowns ni caps editoriales;
4. `effectivePosition` es input válido anterior a la resolución;
5. `PositionCompetition` agregado no requiere plantilla completa;
6. oportunidad/disponibilidad/minutos conservan las desigualdades físicas;
7. disponibilidad médica parcial no asigna minutos ni incluye disciplina;
8. fixtures demuestran un mismo rol con resultados de minutos diferentes;
9. fixture con cero oportunidad produce cero minutos sin división por cero;
10. Qn no consume Performance de Qn para resolver sus minutos;
11. Qn+1 sí puede consumir evidencia cerrada de Qn;
12. splits posicionales, de competición y club/selección conservan minutos sin
    duplicación;
13. reanudación no repite outputs ni streams;
14. configuraciones, precisión y parámetros están versionados;
15. golden/property tests y Monte Carlo cumplen targets todavía por aprobar;
16. `EngineParameterSet.roleMinutes` cumple las restricciones de ADR-072;
17. `LogitNormalMeanGaussHermite10V1` tiene goldens cross-runtime;
18. overlaps de availability se expresan o producen error tipado.

## 15. Refinamiento matemático G3C-3

ADR-072 y
[`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md) son normativos para:

- `RoleQualitySignal` derivada de `PositionSuitability`;
- stable softmax de `SportingRole`;
- matriz completa de transición/persistencia;
- `PositionCompetition` normalizada;
- composición exacta de availability;
- modelo Logit-Normal de minute share;
- expectativa GH10;
- apportionment por competición;
- derivación Bernoulli jerárquica de appearances/starts;
- streams, invariantes, ParameterSet, targets y goldens.

Las seis filas asignadas a G3C-3 ya no conservan una familia matemática
abierta. G3B-C04 y F03 están `RESOLVED_MATH`; C02, C03, C05 y C06 están
`PARTIAL_CALIBRATION`.
