# Performance Model Specification

**Estado:** Normativa estructural; matemática G3C-4 cerrada por
[ADR-073](adr/073-performance-production-form-mathematics.md); calibración
pendiente  
**Fecha:** 2026-07-29  
**Decisión principal:** DR-055, `PARTIAL_CALIBRATION` por
[ADR-055](adr/055-performance-and-production-model.md) y
[ADR-073](adr/073-performance-production-form-mathematics.md)  
**Decisiones relacionadas:** DR-008, DR-010, DR-053, DR-054, DR-056, DR-057, DR-058 a DR-061, DR-063, DR-064 y DR-066 a DR-068  
**Decisiones del board cubiertas:** G3B-A06, G3B-D01 a G3B-D10 y contratos directos con G3B-B02/B05, C02/C05/C06, E01, F01/F04, G02/G07, H02/H03, I01/I03, K01/K02 y M02/M07/M14/M15

## 1. Propósito y límites

Este documento define la estructura causal de Performance para el vertical
slice `GK`/`CM`/`ST`. Separa capacidad verdadera, proyección contextual,
rendimiento realizado, producción observable y evidencia consolidada. Su
matemática ejecutable está en
[`PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md`](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md).

Este documento estructural no repite:

- ecuaciones y samplers ya congelados por ADR-073;
- valores de balance, correlaciones o priors del ParameterSet;
- calendario, resultados colectivos o fuerza de clubes;
- hazards de salud, desarrollo, transferencias, selección, premios o scoring;
- schemas implementables definitivos de facts, que deben conformar
  `SCORING_FACTS_SPEC.md`.

No se simulan partidos individuales. Una Q es una ventana agregada conforme a
[ADR-042](adr/042-season-health-performance.md).

## 2. Pipeline normativo

El pipeline de una ventana es:

```text
TrueCapabilities
-> EffectiveCapabilities
-> UnderlyingPerformance
-> ObservedProduction
-> PerformanceSummary
```

Las cinco capas tienen semánticas distintas:

| Capa | Significado | Persistencia |
|---|---|---|
| `TrueCapabilities` | Las veinte capabilities causales del jugador al inicio de Q. | Parte de `TruePlayerState`; solo Development & Aging puede mutarlas. |
| `EffectiveCapabilities` | Proyección contextual usada por la operación de Performance. | Derivada; no es una segunda verdad permanente. |
| `UnderlyingPerformance` | Realización multidimensional de cómo rindió el jugador en la Q. | Evidencia mecánica interna auditable; no es un overall. |
| `ObservedProduction` | Conteos y resultados deportivos observables producidos con la exposición confirmada. | Hecho deportivo persistible; no sustituye capacidad ni rendimiento subyacente. |
| `PerformanceSummary` | Evidencia consolidada de rendimiento, volumen, contexto, presión e incertidumbre. | Snapshot/fact de ventana y base de agregación de temporada. |

La distribución condicional y sus expectativas forman parte de la resolución de
cada capa, pero no agregan una sexta verdad persistida. La traza debe distinguir
expectativa, realización y evidencia observada.

Una estadística observada nunca se usa como sustituto directo de una capability
verdadera. Un rating derivado nunca vuelve aguas arriba para generar producción.

## 3. Contrato de entrada por Q

Performance recibe únicamente estado ya confirmado:

- `seasonId`, Q, `operationKey` y versiones participantes;
- `effectivePosition` válida y `usageByPosition` cuando exista;
- `SportingRole`;
- `actualMinutes` y contexto de participación;
- las veinte `TrueCapabilities` del snapshot vigente;
- `form`, `confidence`, `fitness`, `fatigue`, restricciones médicas y `morale`
  al inicio de Q;
- traits relevantes, incluidos `consistency` y `pressureResistance`;
- `tacticalFit` o sus inputs causales, sin duplicarlos;
- contexto de club, competición, rival y presión definido en la sección 9;
- referencias deterministas a parámetros y streams.

Performance no:

- calcula ni modifica `actualMinutes`;
- decide una posición o reconversión;
- genera disponibilidad, lesión, títulos, premios, convocatorias o ofertas;
- cambia capabilities, traits o Dynamic States;
- consulta UI, HTTP, DB, reloj o fuentes de azar externas.

Si `actualMinutes` es cero, la producción participativa es cero. La operación
puede conservar una evaluación de contexto o una traza de no participación, pero
no crea goles, asistencias, atajadas, vallas invictas ni otros hechos que exijan
participación.

## 4. EffectiveCapabilities y cierre estructural de G3B-A06

`EffectiveCapabilities` es un vector contextual derivado desde el catálogo
canónico de capabilities. No es un `overall`, no es una capability adicional y
no se persiste en `TruePlayerState`.

La única proyección conceptual autorizada es:

```text
resolveEffectiveCapabilities(
  trueCapabilities,
  dynamicStateSnapshot,
  effectivePosition,
  sportingRole,
  tacticalContext,
  pressureContext
) -> EffectiveCapabilities + CalculationTrace
```

El nombre expresa un único contrato, no una API de código aprobada. Todos los
modelos posicionales deben consumir esta proyección o una vista tipada de ella;
no pueden duplicar transformaciones propias de `form`, `fitness` o contexto.

La transformación puede depender de:

- capabilities verdaderas;
- `form`;
- `confidence`;
- `fitness`;
- `fatigue`;
- `morale`;
- contexto de presión;
- demandas tácticas y demás modificadores contextuales autorizados.

Puede aplicar sensibilidades diferentes por capability o familia. Por ejemplo,
fatiga puede afectar más una tarea explosiva que una tarea táctica. La función,
el dominio, las interacciones y el orden quedan fijados por ADR-073; sus
coeficientes permanecen externalizados.

Cada influencia declara su ruta. Si una parte de forma, presión, fitness o
contexto ya se incorporó a EffectiveCapabilities, no se vuelve a multiplicar
como alias en UnderlyingPerformance. Un mismo contexto sí puede tener efectos
distintos —por ejemplo generar oportunidades y modificar ejecución— cuando la
traza identifica esas rutas por separado.

Invariantes:

1. la resolución no muta `TrueCapabilities`;
2. el resultado está ligado a una Q, contexto y snapshot concretos;
3. no existe un valor único universal de calidad efectiva;
4. los consumidores no persisten la proyección como segunda fuente de verdad;
5. una proyección de UI o scouting pertenece a `PlayerKnowledge`, no a este
   resultado mecánico.

Con este contrato G3B-A06 queda resuelta estructuralmente. El potencial continúa
siendo una distribución emergente de trayectorias conforme a
[`PLAYER_MODEL_SPEC.md`](PLAYER_MODEL_SPEC.md); la función y los parámetros de
proyección están definidos en el math spec y siguen pendientes de calibración.

## 5. UnderlyingPerformance

`UnderlyingPerformance` representa la realización deportiva de una Q antes de
reducirla a conteos observables. Es multidimensional y debe admitir, como mínimo,
componentes equivalentes a:

- `technicalExecution`;
- `decisionQuality`;
- `offBallImpact`;
- `defensiveImpact`;
- `attackingContribution`;
- `pressurePerformance`.

Las dimensiones son componentes de rendimiento, no capabilities nuevas. Una
posición puede dar distinto peso o evidencia a cada una, pero el contrato común
evita crear tres definiciones incompatibles de “rendimiento”.

Cada componente debe poder conservar:

- distribución/expectativa condicional;
- realización de la Q;
- exposición relevante;
- contexto;
- evidencia disponible;
- incertidumbre o fuerza de evidencia;
- referencias a shocks compartidos e idiosincráticos.

No existe un `performanceOverall` causal. Puede calcularse un rating derivado
para una finalidad declarada —UI, narrativa, evaluación, premios o scoring—,
pero:

- es una proyección de facts cerrados;
- declara finalidad, versión y scope;
- no genera goles, asistencias, atajadas u oportunidades;
- no reemplaza el vector de Performance;
- no se reutiliza silenciosamente entre consumidores con semánticas distintas.

ADR-073 fija la proyección purpose-scoped como combinación convexa de
dimensiones. Sus pesos y cualquier escala de presentación siguen en parámetros.

## 6. Exposición, volumen y evidencia

`actualMinutes` es la exposición causal principal y ya está cerrado al entrar a
Performance. La producción se condiciona a esa exposición; Performance no
normaliza minutos para volver a sortear participación.

El modelo debe distinguir:

- volumen observado;
- tasa o intensidad estimada;
- fuerza de evidencia;
- incertidumbre por muestra.

Una producción extrema con pocos minutos no se censura ni se corrige. Se
conserva el conteo real, mientras `PerformanceSummary` puede expresar menor
evidencia para inferir una tasa estable o calidad futura. Cuarenta minutos no
aportan la misma fuerza de evidencia que mil quinientos, aunque ambos puedan
contener hechos extraordinarios.

Los conteos observados permanecen enteros. Tasas, expectativas, índices,
evidencia e incertidumbre pueden usar representación numérica aprobada por
DR-055/DR-063.

## 7. Generación conjunta, varianza y colas

Las estadísticas relacionadas no se sortean independientemente. Cada Q debe
poder usar latentes comunes y ruido específico para correlacionar:

```text
contexto + exposición
-> shocks compartidos de Q
-> UnderlyingPerformance
-> oportunidades correlacionadas
-> resultados/conversiones
-> ObservedProduction
```

La traza distingue como mínimo:

- shock de rendimiento compartido;
- variación de oportunidades/contexto;
- variación de ejecución/conversión;
- ruido idiosincrático de un output, si corresponde.

Compartir una causa no implica compartir estado mutable de PRNG. Cada variable
se deriva de streams/contextos deterministas explícitos.

`consistency` modifica principalmente dispersión, persistencia o volatilidad.
Debe ser posible que dos jugadores con media condicional similar tengan
varianzas distintas. No se lo trata como un multiplicador automático de calidad
media.

Los conteos se generan con distribuciones discretas, no redondeando una
expectativa. ADR-073 fija `NegativeBinomial2` para producción overdispersed,
Binomial para éxitos dentro de oportunidades confirmadas y los samplers
inverse-CDF en log-space. Poisson queda disponible solo cuando la calibración
demuestre media-varianza compatible. Los valores de dispersión, correlaciones y
targets permanecen en el ParameterSet.

No se imponen máximos editoriales a estadísticas o ratings. Solo rigen
identidades lógicas y físicas derivadas de hechos ya generados, como una atajada
que requiere una oportunidad correspondiente.

La frase “variación acotada” de `MASTER_SPEC` §34.1.3 se interpreta conforme a
§36.6: condicionamiento por exposición/contexto e identidades, nunca truncamiento
editorial de las colas. Esta precedencia queda registrada como RP-006 en
[`DECISIONS_REQUIRED.md`](DECISIONS_REQUIRED.md#rp-006--variación-acotada-frente-a-colas-abiertas).

## 8. Producción por posición

### 8.1 Contrato común

Toda producción queda ligada a:

- Q y contexto club/selección;
- competición;
- `effectivePosition`;
- `actualMinutes`;
- `SportingRole`;
- snapshot de contexto y versiones;
- realización de UnderlyingPerformance;
- oportunidad causal y referencias de stream.

Goles y asistencias permanecen disponibles para cualquier posición cuando sean
lógicamente posibles. Su relevancia evaluativa es posicional; no se convierten
en métrica universal.

### 8.2 ST

Outputs observables mínimos:

- `goals`;
- `assists`.

El grafo debe distinguir al menos:

```text
actualMinutes + rol + posición + contexto ofensivo/rival
-> scoringOpportunities + creativeOpportunities
-> chanceQuality
-> conversion/creation outcomes
-> goals + assists
```

La generación de oportunidades puede usar `attackingMovement`, `positioning`,
perfil físico, rol, `tacticalFit`, entorno ofensivo y rival. La conversión puede
usar `finishing`, `composure`, `ballControl`, estados dinámicos, presión y azar
determinista. Esta enumeración separa causas; no fija pesos ni obliga una forma
lineal.

Oportunidades, calidad de ocasión y conversión permanecen distinguibles en la
traza. No se fuerza una temporada histórica mediante un evento ni existe cap de
goles.

### 8.3 CM

Outputs de conteo observables mínimos:

- `goals`;
- `assists`.

La contribución de mediocampo no se evalúa solo con esos conteos.
`PerformanceSummary` debe persistir evidencia agregada equivalente a:

- `progressionImpact`;
- `creativeImpact`;
- `defensiveContribution`;
- `controlImpact`.

Estas dimensiones son componentes de evidencia posicional, no macrocapabilities
ni obligación de simular cada pase, recuperación o duelo. Pueden permanecer
ocultas en UI, pero deben conservarse de forma auditable para premios, selección,
mercado y scoring posicional.

ADR-073 genera los cuatro componentes mediante factores Normal correlacionados
y goals/assists mediante NB2. Contadores adicionales solo se añaden cuando un
consumer normativo justifique su uso.

### 8.4 GK

UnderlyingPerformance debe representar al menos:

- `shotStoppingPerformance`;
- `commandPerformance`;
- `distributionPerformance`.

Outputs observables mínimos:

- `saves`;
- `goalsConceded`;
- `cleanSheets`.

También se conserva una medida auditable de oportunidades de atajada o exposición
equivalente para validar los conteos. El grafo conceptual es:

```text
actualMinutes + entorno defensivo + rival
-> shot-stopping exposure / clean-sheet opportunities
-> shotStoppingPerformance + context
-> saves + goalsConceded
-> cleanSheets condicionadas
```

Reglas:

- `saves` no puede superar las oportunidades en las que una atajada era
  posible;
- `goalsConceded` y `cleanSheets` dependen del entorno defensivo y rival, no
  solo del arquero;
- `cleanSheets` no se sortea ignorando goles concedidos, exposición y
  apariciones elegibles;
- cero goles concedidos solo puede producir una valla invicta cuando existe la
  participación mínima que defina el calendario agregado;
- goles concedidos no son un proxy directo de capability o calidad GK;
- penales, errores y evidencia de distribución pueden añadirse mediante el
  catálogo versionado cuando exista un uso downstream aprobado, sin alterar
  estos mínimos.

ADR-073 define el contrato matemático
`cleanSheetEligibleAppearances/cleanSheetEligibleMinutes` y deriva clean sheets
asignando goals conceded a unidades agregadas elegibles. La producción de esas
unidades continúa upstream en DR-021/DR-022/DR-054; no se inventan partidos.

## 9. Contrato desde Club & Competitions

Performance consume, no genera, un `PerformanceContext` conceptual con:

- `attackEnvironment`;
- `defensiveEnvironment`;
- `possessionControlContext`;
- fuerza agregada del rival o campo rival;
- `scheduleDifficulty`;
- `competitionStrength`;
- contexto táctico;
- exposición agregada a situaciones de alta presión;
- identificadores de club, competición, scope, temporada y Q.

DR-021 y DR-022 deben fijar schemas, escalas, evolución y construcción. Hasta
entonces estos campos son dimensiones semánticas, no números hardcoded.

ADR-022 y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) fijan el
owner y la temporalidad de estas dimensiones:

- `ClubState` produce attack/defensive/control environment;
- `ManagerContext`/`TacticalIdentity` producen demandas vigentes;
- `LeagueState` produce `leagueCompetitiveStrength`, separado de IJL;
- CompetitionState/Calendar produce rival/field, dificultad, congestión y
  high-pressure exposure;
- todo pertenece al snapshot causal de Q y no se reescribe desde el outcome de
  esa misma ventana.

La producción cruda no se reescribe por fuerza de competición:

```text
15 goals = 15 goals
```

La fuerza de competición puede influir en oportunidades y contexto antes de la
realización, y luego en la evaluación contextual para mercado, selección,
premios o scoring. No cambia retrospectivamente el contador observado.

Después de cerrar Performance, el engine puede derivar una
`PlayerCompetitiveContribution` por competición desde minutos, rendimiento,
producción, posición y contexto. Performance no resuelve el outcome. Esa
proyección no es `ContributionCoefficient`, CareerScore ni rating causal y no
puede volver a sortear rendimiento. `TeamSupportField` excluye al protagonista.

## 10. Presión

`PressureContext` distingue exposición ordinaria de exposición agregada de alta
presión sin crear partidos individuales.

`pressureResistance` modifica probabilísticamente la respuesta al contexto. No
garantiza éxito ni fracaso y no se usa como threshold.

Su efecto se aplica una sola vez en la ruta aprobada de respuesta a presión; el
`pressureBreakdown` registra la evidencia resultante y no agrega otro bonus.

`PerformanceSummary` conserva un `pressureBreakdown` con:

- exposición relevante;
- rendimiento subyacente asociado;
- producción observada asociada;
- fuerza de evidencia;
- referencia al contexto competitivo que calificó la presión.

Un “momento importante” no es una bonificación editorial. Si Club &
Competitions define oportunidades discretas de alta relevancia, sus resultados
pueden persistirse como facts referenciados. Si solo existe exposición agregada,
el `pressureBreakdown` es la evidencia canónica y no se inventa un evento
separado.

ADR-073 fija el consumo matemático de `pressureExposure`; su productor y las
oportunidades calificadas siguen en DR-021/DR-022. G3B-D08 queda
`PARTIAL_CALIBRATION`, no abierta por fórmula local.

## 11. Dynamic States y ownership

### 11.1 Form

`form` es un Dynamic State de corto plazo. La transición conceptual admite:

```text
nextForm =
  referenceLevel
  + persistence(previousForm)
  + boundedResponse(performanceSurprise, evidenceStrength)
  + stochasticVariation
  + confirmedContextEffects
```

ADR-073 concreta esta familia como AR(1) mean-reverting en espacio logit,
cuantizado a `0..10000`. Conserva:

- persistencia parcial;
- regresión o saturación de la influencia;
- respuesta a rendimiento relativo a expectativa, no solo a producción bruta;
- varianza residual;
- posibilidad de rachas extraordinarias;
- ausencia de reset automático por temporada.

La saturación limita feedback de estado, no producción ni outliers.

### 11.2 Confidence y morale

`confidence` permanece separado de `form`. Representa seguridad
psicológica/contextual y puede interactuar con presión y ejecución sin estar
perfectamente correlacionado con el rendimiento reciente.

`morale` representa un estado contextual más amplio. Puede recibir señales de
rol, resultados, relaciones, contrato y eventos. Performance consume el valor
confirmado; no es propietario de su dinámica completa.

### 11.3 Fitness y fatigue

Health posee `fitness`, `fatigue`, `LoadState`, condiciones y su evolución
conforme a [`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) y ADR-074.
Performance solo consume el snapshot y las restricciones confirmadas antes de
producción. Sus efectos varían por task mediante predictores aditivos de
ADR-073; los values/goldens conjuntos permanecen pendientes de calibración.

Después de cerrar producción, Performance entrega exposición/minutos e
intensidad física/contextual realizados. No entrega el rating, goles u otra
producción como proxy de carga. Health decide cómo esas señales actualizan carga
y hazard.

### 11.4 Señales posteriores

Performance no escribe directamente `form`, `confidence`, `managerTrust`,
`morale` o reputación. Produce señales/evidencia cerrada para que sus sistemas
propietarios las apliquen en `CONSEQUENCES(Qn)` o fases posteriores.

Como mínimo debe poder entregar:

- sorpresa de rendimiento respecto de expectativa;
- fuerza de evidencia y exposición;
- breakdown posicional/contextual;
- evidencia de presión;
- carga/intensidad deportiva ya realizada;
- referencias a producción y hechos causales.

La función de actualización de cada estado pertenece a DR-056, DR-057 o DR-061.

## 12. Orden temporal y atomicidad

Dentro de `PRODUCTION(Qn)`:

```text
estado inicial confirmado
-> rol/posición/minutos ya cerrados
-> EffectiveCapabilities
-> UnderlyingPerformance
-> ObservedProduction
-> PerformanceSummary
-> señales de actualización
```

La operación confirma el resultado completo o ninguno. Al reanudar desde una
decisión no repite streams ni producción ya cerrada.

Después:

```text
PerformanceSummary cerrado
-> PERFORMANCE_EVENTS(Qn), cuando corresponda
-> HEALTH(Qn)
-> CONSEQUENCES(Qn)
-> estados confirmados para Qn+1
```

Los minutos, la posición y la producción de Qn no se recalculan por rendimiento
o salud posterior de la misma Q.

## 13. PerformanceSummary y agregación de temporada

### 13.1 Resumen de ventana

`PerformanceSummary` conserva, por scope:

- `actualMinutes` y uso posicional;
- vector de UnderlyingPerformance o evidencia suficiente de sus componentes;
- `ObservedProduction`;
- contexto de club, rival, competición y táctica;
- `pressureBreakdown`;
- expectativa y sorpresa de rendimiento;
- fuerza de evidencia e incertidumbre;
- versiones, parámetros, streams y referencias causales.

No es un promedio simple ni un rating universal.

### 13.2 `SeasonPerformanceSummary`

La temporada se deriva de Q1–Q4 y preserva splits por:

- `currentSportingClubId`/selección;
- contrato/préstamo causal cuando el scope lo requiera;
- competición;
- `effectivePosition`;
- contexto de presión;
- ventana.

Reglas:

- conteos observados se suman sin reescribirlos;
- minutos y exposiciones se conservan;
- componentes de rendimiento se agregan mediante suficientes estadísticos y
  pesos de exposición aprobados, no promediando ratings sin contexto;
- incertidumbre se combina desde evidencia, no se borra;
- la temporada no vuelve a sortear rendimiento;
- una Q posterior no modifica una Q cerrada.
- un movimiento entre Qs no reatribuye outputs al club de cierre;
- la suma de segmentos multiclub conserva cada minuto y contador una sola vez.

El resumen debe ser suficiente para Awards, Market, Selection y Scoring, pero
cada consumidor aplica su propia comparación o conocimiento. La fórmula de
agregación, precisión y tratamiento multi-contexto siguen externalizados.

## 14. Interfaces salientes

| Consumidor | Contrato desde Performance | Restricción |
|---|---|---|
| Role & Minutes | Resumen de rendimiento previo, sorpresa, exposición y evidencia de ventanas cerradas. | Solo puede afectar Q futuras; no recalcula Performance. |
| Development | Experiencia/rendimiento y exposición confirmados, separados de producción cruda. | `ObservedProduction` no es la única causa de desarrollo. |
| Health | Minutos/exposición e intensidad física/contextual confirmados. | No usa rating o producción como proxy automático; Health resuelve carga y hazard. |
| Market | Rendimiento reciente, volumen, producción, contexto, splits multiclub e incertidumbre observables/perceptibles. | Usa `PlayerKnowledge`/evidencia; no accede a capabilities, UnderlyingPerformance oculto o latentes verdaderos. |
| Selection | Proyección purpose-scoped de rendimiento, producción, contexto, presión, exposición y fuerza de evidencia. | No usa threshold de overall, `MarketValue` o `CareerScore`; no mezcla minutos de club/selección. |
| Awards | Proyección purpose-scoped de `SeasonPerformanceSummary`, producción, presión, exposición y logros externos. | Performance no decide eligibility, candidatos, field, placement o ganador. |
| Reputation | Hechos deportivos observables, exposición/evidencia y contexto, transformables en una `ReputationSignal`. | Una misma `EvidenceKey` no entra otra vez mediante producción, rating, logro o reputación como aliases; no entrega capabilities/latentes. |
| Retirement | Resumen cerrado de Performance, trayectoria y evidencia. | Performance no calcula motivation, hazard, retiro o comeback y no usa CareerScore. |
| Scoring | Facts allowlisted de participación, producción y resumen cerrado. | No accede a latentes ni hace que engine dependa de scoring. |

Un consumidor que requiera conocimiento imperfecto recibe una proyección
autorizada de `PlayerKnowledge`/evidencia, no el UnderlyingPerformance interno
como omnisciencia.

National Team reutiliza este mismo pipeline mediante
`PerformanceContext.kind = NATIONAL_TEAM` o discriminante semánticamente
equivalente. Role, oportunidad, minutos, producción, summaries y outcomes
internacionales conservan scope separado de club; reutilizar el resolver no
autoriza aliases duplicados de facts.

Selection y Awards pueden recibir dimensiones autorizadas de
`UnderlyingPerformance` únicamente a través de una proyección purpose-scoped
definida por su política de evidencia. Cuando el consumidor representa
conocimiento de un observador, esa proyección pasa además por
`PlayerKnowledge`; nunca habilita acceso general a TrueCapabilities,
EffectiveCapabilities o traits ocultos.

## 15. Hechos, estado y traza

Este bloque originó la clasificación conceptual siguiente; G3B Bloque 10 fija
nombres y clasificación final en `SCORING_FACTS_SPEC.md`:

| Concepto | Clasificación por defecto | Motivo |
|---|---|---|
| `EffectiveCapabilitiesResolved` | Traza de cálculo | Es derivado y efímero; no debe convertirse en segunda verdad. |
| `UnderlyingPerformanceRecorded` | Evidencia interna auditable | Explica la realización, pero no es observable ni input directo de scoring por defecto. |
| `ObservedProductionRecorded` | Fact deportivo candidato | Contiene resultados observados y enteros por scope. |
| `PerformanceSummaryRecorded` | Fact/snapshot candidato | Consolida evidencia de Q sin reescribir producción. |
| `SeasonPerformanceSummaryRecorded` | Fact/snapshot de cierre candidato | Agrega Q y conserva splits para consumidores. |
| `PressurePerformanceRecorded` | No se emite separado por defecto | `pressureBreakdown` vive en el summary; un fact separado debe referenciar la misma evidencia sin duplicarla. |
| Señales de Dynamic State | Señales de cálculo | Sus sistemas propietarios emiten el eventual cambio de estado confirmado. |

`StatisticRecorded` y `StatsGenerated` deben migrar a
`ObservedProductionRecorded` o a un catálogo de stats tipado, no coexistir como
dos ocurrencias semánticamente iguales.

Los facts de producción o Performance nunca crean `ScoreLedgerEntry`. Scoring
solo puede consumir el allowlist cerrado por DR-063/ADR-010.

**Cierre G3B Bloque 10:** `ObservedProductionRecorded`,
`PerformanceSummaryRecorded` y `SeasonPerformanceSummaryRecorded` son facts
canónicos allowlistables. `StatsGenerated`/`StatisticRecorded` migran al
primero. `EffectiveCapabilitiesResolved` y `UnderlyingPerformanceRecorded` son
internal signals; `PressurePerformanceRecorded` no se emite como alias del
breakdown. El allowlist y la granularidad se definen en
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md).

## 16. Invariantes

1. `TrueCapabilities` no se modifican dentro de Performance.
2. `EffectiveCapabilities` es contextual, derivado y no persistido como estado.
3. UnderlyingPerformance es multidimensional; ningún rating lo sustituye.
4. `ObservedProduction` no se usa como capability ni como rendimiento completo.
5. Performance consume `actualMinutes` y no los recalcula.
6. Cero minutos implica cero producción participativa.
7. Conteos se muestrean discretamente; no son expectativas redondeadas.
8. Estadísticas correlacionadas comparten causas explícitas.
9. `consistency` modifica principalmente dispersión y no añade un predictor
   directo de calidad media.
10. `pressureResistance` no garantiza éxito o fracaso.
11. Producción cruda no se reescribe por fuerza de competición.
12. Sparse exposure conserva outliers y expresa menor fuerza de evidencia.
13. No hay caps editoriales de goles, asistencias, atajadas, ratings o
    performance.
14. Records se detectan después desde producción real; no se fuerzan.
15. Performance de Qn no cambia rol/minutos ya cerrados de Qn.
16. Performance emite señales; otros sistemas aplican sus estados.
17. Una estadística pertenece una sola vez a cada scope y split.
18. Ningún output de Performance crea puntos directamente.
19. Una causa compartida no entra dos veces mediante aliases de capacidad,
    contexto, rating o reputación.
20. Un cambio de club entre Qs afecta solo Performance futura.
21. El club de cierre no reemplaza el `currentSportingClubId` histórico.

## 17. Parameter Registry Candidates

Todo valor siguiente vive en configuración versionada:

- transforms de `EffectiveCapabilities`;
- dominio, precisión y cuantización de valores efectivos;
- sensibilidades de `form`, `confidence`, `fitness`, `fatigue` y `morale`;
- pesos e interacciones por capability family;
- dimensiones y escalas de UnderlyingPerformance;
- pesos posicionales de rendimiento;
- parámetros de generación de oportunidades;
- parámetros de calidad de ocasión y conversión;
- familias y parámetros de conteos;
- sobredispersión y mixtures;
- correlaciones y jerarquía de shocks;
- efecto de `consistency`;
- efecto de presión y `pressureResistance`;
- persistencia, regresión, saturación y ruido de `form`;
- influencia y dinámica de `confidence`;
- influencia de `morale`;
- efectos de fitness/fatigue;
- transformación de contexto/competition strength para evaluación;
- construcción/versionado del contexto de club/rival/competición;
- proyección `PlayerCompetitiveContribution`, separada de scoring;
- parámetros y escalas de ratings derivados;
- agregación Q→temporada;
- fuerza de evidencia e incertidumbre por exposición;
- definiciones de exposición GK y clean-sheet opportunity;
- parámetros de producción `GK`, `CM` y `ST`;
- parámetros de uso multiposicional y multi-competición;
- agregación y evidencia de temporadas multiclub;
- contextos de streams y correlaciones compartidas;
- precisión, redondeo y serialización;
- golden fixtures y targets/tolerancias Monte Carlo.

No se asignan valores en este documento.

## 18. Estado de decisiones

### Resueltas estructuralmente

- G3B-A06: calidad efectiva y potencial quedan separados; la proyección única
  de EffectiveCapabilities está definida conceptualmente.
- G3B-D01: objeto de Performance y las cinco capas quedan separados.

### Cierre matemático G3C-4

G3B-D02 a D09 quedan `PARTIAL_CALIBRATION`:

- D02: task logits y expectativa/realización multidimensional cerrados;
- D03: factores Normal, consistency, NB2/Binomial e inverse-CDF cerrados;
- D04: Form AR(1) en logit y señales de performance cerrados;
- D05: grafo GK `shots→saves→conceded→clean sheets` cerrado;
- D06: cuatro impactos CM y counts correlacionados cerrados;
- D07: opportunity/chance/conversion ST y counts correlacionados cerrados;
- D08: exposición/response high-pressure cerrados;
- D09: evidence, agregación y splits cerrados.

No queda una familia matemática o sampler abierto. Faltan valores, targets,
goldens y producers upstream detallados en la especificación matemática.

### Calibrable

- G3B-D10: confirmado como registro de parámetros; no bloquea contratos
  parametrizados, pero sí el gate de aceptación de gameplay.

DR-055 pasa a `PARTIAL_CALIBRATION`. DR-056 conserva abiertas las dinámicas
completas de confidence/morale/managerTrust; Form y las señales desde
Performance están cerrados. DR-008 y DR-010 no se cierran.

### Alcance estadístico todavía pendiente

`MASTER_SPEC` también menciona disciplina y, para GK, errors, penalties y
distribution. ADR-073 conserva `distributionPerformance` como dimensión
subyacente y difiere errors/penalties por falta de consumer del slice. Añadir
un contador requiere scope, grafo, distribución, facts, targets y fixtures; no
se infiere desde goals conceded ni se crea por completitud.

## 19. Gates antes de implementar

Antes de implementar Performance:

1. publicar valores calibrados de `EngineParameterSet.performance`;
2. aprobar goldens y targets de ADR-073;
3. DR-021/DR-022 fijan producers de calendario y `PerformanceContext`;
4. ADR-074 fija matemática, precisión, streams y adapters de
   fitness/fatigue/restricciones; faltan ParameterSet y fixtures aprobados;
5. G3C-6 entrega pressure exposure, contexts y clean-sheet eligibility;
6. DR-056 completa owners de confidence/morale/managerTrust cuando corresponda;
7. DR-063 ya publica facts/allowlist; faltan schemas concretos;
8. cada posición posee golden fixtures de cero, sparse y alta exposición;
9. fixtures prueban conteos correlacionados y las identidades GK;
10. property tests prueban ausencia de producción con cero minutos;
11. fixtures prueban que raw production no cambia por evaluación contextual;
12. Monte Carlo valida medias, dispersiones, colas y correlaciones;
13. outliers no son truncados ni convertidos en eventos especiales;
14. replay y cadencia producen facts y hashes idénticos;
15. fixtures mid-season conservan splits por club sin duplicación;
16. DR-066/067 cierran elegibilidad y boundary antes de producir Performance
    para el nuevo club.

Hasta cumplir esos gates no se implementa gameplay de Performance.

## 36. Consumo de Scoring tras G3C-11

ADR-080 consume summaries y facts de exposición/producción cerrados mediante
profiles posicionales y cohortes congeladas. No lee hidden capabilities,
latentes o presentation ratings. El cierre de Scoring no modifica Performance;
solo formaliza el adapter facts→PRI/CC.
