# Fundamental Player Model Specification

**Estado:** Normativa estructural; matemática de Creation/Development refinada
por G3C-2  
**Fecha:** 2026-07-29  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-011, ADR-019, ADR-020, ADR-023,
ADR-044, ADR-052, ADR-053, ADR-054, ADR-055 y ADR-057  
**Decisiones del board cubiertas:** G3B-A01 a G3B-A06; dependencias directas G3B-B03, G3B-B04, G3B-C02, G3B-D01, G3B-E01 y G3B-N01 a G3B-N06

## 1. Propósito y alcance

Este documento define el modelo fundamental y causal del jugador sobre el cual se construirán posteriormente desarrollo, minutos, rendimiento, salud, mercado y scoring.

Quedan fuera de alcance de este documento estructural:

- fórmulas de rendimiento, minutos o lesiones;
- coeficientes de balance;
- scouting completo;
- calibración de creación;
- fórmulas de posición efectiva, premios o scoring.

Ante una discrepancia con ejemplos exploratorios anteriores de
`MATHEMATICAL_ENGINE_SPEC.md`, prevalecen ADR-052 y este documento. En
particular, la escala canónica interna de capacidades ya no es 0–100.
La estructura de desarrollo y envejecimiento que refina este modelo se define
en [`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md).
Las ecuaciones de generación, maduración, Creation Budget y reconversión se
definen en
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md).
La semántica contextual de estado institucional, rol y participación se define
en [`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md).

## 2. Partición canónica del estado

El modelo separa tres clases de variables mecánicas:

| Clase | Semántica | Cadencia esperada | Regla de mutación |
|---|---|---|---|
| `CAPABILITIES` | Capacidades causales específicas del jugador | Lenta, mediante desarrollo o declive | No cambian por una fluctuación temporal de rendimiento |
| `TRAITS` | Predisposiciones persistentes o lentamente mutables | Persistente o lenta | Solo cambian mediante procesos explícitos y autorizados |
| `DYNAMIC_STATES` | Estados transitorios sensibles a ventana, temporada y contexto | Q1–Q4 o temporada | Evolucionan mediante sus sistemas específicos |

Una misma magnitud no debe aparecer simultáneamente como capacidad permanente y
estado dinámico. En particular, `fitness` no sustituye ni modifica directamente
capacidades físicas permanentes.

## 3. Capability model

### 3.1 Dominio

`CapabilityValue` es un entero inclusivo en el intervalo `0..10000`.

La validación rechaza valores fraccionarios, no finitos o fuera del dominio. No
existe clamping ni redondeo implícito al ingresar estado canónico.

La escala 0–10000 es la representación canónica mecánica. Una interfaz puede
proyectarla a 0–100, categorías textuales, estrellas u otra presentación, pero
esa proyección:

- es derivada;
- no reemplaza el valor canónico;
- no concede al usuario conocimiento exacto del valor real;
- no se utiliza como fuente causal por el motor.

Una proyección visible no puede convertirse de vuelta en estado verdadero salvo
mediante un mapper explícito autorizado para una operación de creación. El
redondeo de presentación no modifica hashes ni replay mecánico.

### 3.2 Catálogo inicial

Todos los jugadores poseen las veinte capacidades, independientemente de su
posición:

| Familia | Capacidades |
|---|---|
| `TECHNICAL` | `finishing`, `passing`, `ballControl`, `dribbling`, `defending`, `goalkeeping` |
| `PHYSICAL` | `acceleration`, `pace`, `strength`, `stamina`, `agility` |
| `MENTAL` | `composure`, `vision`, `decisionMaking`, `positioning`, `workRate` |
| `TACTICAL` | `attackingMovement`, `defensiveAwareness`, `pressing`, `tacticalIntelligence` |

Una capacidad poco relevante para una posición conserva un valor válido. La
relevancia pertenece a los modelos posicionales posteriores y no al esquema del
jugador.

### 3.3 Ausencia de Overall causal

No existe un `overall` canónico almacenado que alimente el rendimiento. Tampoco
existe un `potentialOverall` verdadero.

Podrán existir posteriormente agregados derivados como:

- `perceivedOverall`;
- rating de presentación;
- estimación de scouting;
- agregados de comparación o selección.

Estos valores pertenecen a una vista derivada o a `PlayerKnowledge`; nunca
reemplazan las capacidades específicas como estado causal.

## 4. Trait model

### 4.1 Catálogo inicial

El modelo fundamental define diez traits:

| Trait | Significado conceptual |
|---|---|
| `naturalTalent` | Predisposición para adquirir o expresar capacidad |
| `developmentCapacity` | Capacidad de responder al desarrollo |
| `professionalism` | Predisposición hacia hábitos y trabajo sostenido |
| `ambition` | Predisposición hacia objetivos y oportunidades exigentes |
| `consistency` | Predisposición a menor variación idiosincrática |
| `adaptability` | Predisposición a responder a cambios de entorno |
| `pressureResistance` | Predisposición a sostener respuesta bajo presión |
| `injuryFragility` | Predisposición latente relacionada con riesgo físico |
| `recoveryCapacity` | Predisposición latente relacionada con recuperación |
| `longevity` | Predisposición latente relacionada con duración de capacidades |

`TraitValue` usa inicialmente el mismo dominio entero inclusivo `0..10000`. No
se define todavía ninguna distribución, media, correlación ni interpretación
lineal de esa escala.

Los traits pueden permanecer completamente ocultos. Que un trait tenga valor
canónico no obliga a exponerlo ni a exponer una proyección exacta.

### 4.2 Maduración y pico

El jugador puede contener o derivar un perfil latente blando que parametrice,
como mínimo, inicio, velocidad, tendencia a estabilización y sensibilidad al
declive. Su dominio y distribución permanecen externalizados.

No se almacena una edad de pico como destino garantizado. Picos de capability,
físico, performance y carrera son propiedades retrospectivas distintas y
pueden ocurrir en momentos diferentes.

ADR-053 agrupa las capabilities en familias de maduración para seleccionar
parámetros, sin convertirlas en macrocapacidades o clases rígidas. La
especificación y asignación completa están en
[`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md#5-familias-de-maduración).

## 5. DynamicState model

El esquema deberá admitir, como mínimo, estos candidatos estructurales:

- `form`;
- `confidence`;
- `fitness`;
- `fatigue`;
- `morale`;
- `managerTrust`.

Sus escalas, persistencia, ecuaciones, correlaciones y condiciones iniciales
permanecen abiertas para los bloques correspondientes. Esta lista define
separación semántica, no coeficientes ni fórmulas.

ADR-054 refina `managerTrust`: es distinto de calidad, rendimiento, forma,
`tacticalFit` y `SportingRole`. Role & Minutes puede leer el valor confirmado
al inicio de Q como modificador probabilístico; su actualización desde evidencia
de Qn ocurre después y solo puede afectar operaciones posteriores.

ADR-055 refina el ownership: Performance consume `form`, `confidence`,
`fitness`, `fatigue`, `morale` y `managerTrust` ya confirmados y emite señales
de una Q cerrada. No escribe ninguno directamente. Form/confidence/managerTrust/
morale se actualizan por sus owners en consecuencias posteriores; Health posee
fitness/fatigue.

ADR-057 refina Health: fitness y fatigue permanecen separados de `LoadState`,
condiciones, `InjuryEpisode`, recuperación, secuelas e historia. Ambos deben
usar dominios acotados todavía por definir. Health produce disponibilidad
médica, no minutos ni suspensiones. La especificación completa está en
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md).

ADR-061/062 aclaran que Sporting/Public Reputation, Public Attention, followers,
engagement y `PlayerPlayingStatus` no se añaden a este vector de Dynamic States:
son estados de subsistemas con ownership propio. `CareerMotivationAssessment`
es una snapshot derivada de `ambition`, morale, historia y contexto; no un trait
ni DynamicState psicológico duplicado. La especificación completa está en
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md).

Una variación de `form`, `confidence` o cualquier otro estado dinámico no puede
reescribir directamente una capacidad o trait. Toda modificación permanente
debe pasar por un proceso explícito de desarrollo, declive u otra transición
normativa.

## 6. TruePlayerState

`TruePlayerState` representa el estado mecánico real del jugador. Conceptualmente
contiene:

- identidad y posición canónica;
- las veinte capacidades;
- los diez traits iniciales;
- variables latentes autorizadas, incluido el perfil de maduración;
- estados dinámicos vigentes;
- estado de salud compuesto mediante referencias/objetos normativos, sin
  colapsarlo en fitness o fatigue;
- estado y referencias de dominio necesarios para su trayectoria.

No contiene como fuentes causales:

- `overall`;
- `potentialOverall`;
- una edad de pico garantizada;
- `effectiveCapability` persistida;
- estimaciones propias de observadores.

Las capacidades efectivas utilizadas por Performance se resuelven mediante un
único contrato conceptual común a posiciones. Son funciones derivadas de
capacidad verdadera, estado dinámico y contexto, incluida una
`effectivePosition` válida. `tacticalFit`, presión y `managerTrust` son causas
contextuales distintas de la capability verdadera. Ninguno se almacena como
capability permanente ni muta `TruePlayerState`.

[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md#4-effectivecapabilities-y-cierre-estructural-de-g3b-a06)
cierra esta estructura y G3B-A06. Dominio intermedio, transformación,
interacciones, precisión y parámetros continúan en DR-055.

## 7. PlayerKnowledge

`PlayerKnowledge` representa conocimiento imperfecto de un observador sobre un
jugador. Está separado de `TruePlayerState` y puede variar entre observadores.

Una observación o estimación debe poder registrar:

- sujeto y observador;
- variable o agregado estimado;
- estimación;
- incertidumbre o confianza;
- punto de simulación en que se obtuvo;
- contexto o procedencia de la observación.

El punto de observación debe expresarse mediante tiempo de dominio reproducible,
por ejemplo temporada, ventana o cursor; no mediante el reloj del sistema como
fuente mecánica.

Dos observadores pueden mantener estimaciones diferentes y válidas sobre el
mismo jugador. El usuario no tiene derecho implícito a leer capacidades, traits
o variables latentes verdaderas.

Este contrato prepara scouting, percepción de clubes y presentaciones futuras,
pero no implementa sus políticas ni su actualización.

## 8. Potencial emergente

El potencial no es un overall futuro, una promesa de valor máximo ni un catálogo
de ceilings. Es la distribución condicional de trayectorias futuras por
capability y emerge de la interacción entre:

- capacidades actuales;
- `naturalTalent`;
- `developmentCapacity`;
- trayectoria de maduración;
- `longevity` y otros traits;
- entorno y oportunidades;
- decisiones;
- salud;
- azar determinista.

`naturalTalent` y `developmentCapacity` conservan semánticas diferentes: el
primero representa predisposición innata a capacidades extraordinarias; el
segundo, capacidad de convertir experiencia y entorno en mejora futura. Ninguna
combinación válida de ambos se excluye.

Todo valor menor que `10000` puede mejorar: la cercanía al extremo puede hacer
el cambio progresivamente menos probable, pero no activa un techo individual de
potencial. G3C-2 fija esa resistencia mediante evolución en espacio logit; solo
sus parámetros y calibración permanecen externalizados.

Una estimación de potencial puede existir para UI u observadores del mundo, pero
pertenece a `PlayerKnowledge`, contiene incertidumbre y puede resultar errónea.

## 9. Generación inicial correlacionada

La generación inicial debe admitir este flujo conceptual:

`latent player profile → distribución conjunta correlacionada → capabilities + traits`

Las capacidades y traits no se generan como variables uniformes independientes.
Los arquetipos pueden actuar como perfiles estadísticos o componentes de una
mezcla, pero:

- no son clases rígidas;
- no bloquean combinaciones compatibles con el dominio;
- no convierten un perfil extraordinario concebible en imposibilidad lógica;
- preservan probabilidad positiva para todo perfil compatible.

G3C-2 fija una mezcla categórica de perfiles y un modelo jerárquico de factores
Normal con residuos idiosincráticos positivos. Loadings, medias, dispersiones,
utilities y catálogo del slice permanecen externalizados; no existe una matriz
o combinación hardcoded fuera del `EngineParameterSet`.

## 10. Creation Budget

`Creation Budget` representa poder inicial esperado y equivalencia estadística.
No es una suma trivial de capacidades.

El presupuesto debe contabilizar el efecto esperado de toda elección sistemática
de creación, incluidas posición, ambidestreza y cualquier ventaja visible u
oculta que modifique la distribución inicial. La Carrera rápida genera una
distribución compatible con el presupuesto; una futura Carrera personalizada
podrá influir en su asignación sin aumentar el poder esperado.

La equivalencia entre modos requiere validación Monte Carlo antes de compartir
leaderboard. G3C-2 fija el surrogate `CreationPowerScore`, un target común por
cuantil y tests de media, mediana, cuantiles, Wasserstein-1 y
Kolmogorov–Smirnov; los umbrales continúan siendo parámetros de calibración.

Permanecen abiertos y externalizados:

- coeficientes e interacciones del `CreationPowerScore`;
- CDF de referencia y banda de aceptación;
- distribución de perfiles y condicionamientos autorizados;
- efecto calibrado de `DominantFoot.BOTH`;
- tolerancias y evidencia del protocolo de equivalencia.

## 11. Invariantes

1. Toda capacidad y todo trait inicial tiene un valor entero canónico entre 0 y 10000, inclusive.
2. Todos los jugadores poseen las veinte capacidades, cualquiera sea su posición.
3. No existe `overall` ni `potentialOverall` como fuente causal almacenada.
4. `CAPABILITIES`, `TRAITS` y `DYNAMIC_STATES` mantienen responsabilidades y vías de mutación separadas.
5. El rendimiento transitorio no modifica capacidades permanentes de forma directa.
6. `fitness` y `fatigue` son estados dinámicos, no capacidades físicas.
7. Una capacidad efectiva es derivada y contextual; no es estado permanente.
8. `TruePlayerState` y `PlayerKnowledge` no se confunden ni comparten autoridad.
9. Las estimaciones de un observador no sobrescriben el estado verdadero.
10. La generación inicial admite correlaciones y conserva soporte positivo para perfiles compatibles.
11. Los arquetipos no imponen clases rígidas ni imposibilidades editoriales.
12. `Creation Budget` mide equivalencia esperada, no una suma de atributos.
13. Ningún parámetro de balance pendiente debe quedar hardcoded en la estructura del modelo.
14. Desarrollo y declive mutan capabilities individuales; no existe un delta de overall.
15. No existe ceiling individual derivado de potencial ni `peakAge` causal.
16. Edad y traits modifican distribuciones; no determinan el signo de un delta.
17. Los picos observados son retrospectivos y no constituyen estado causal.
18. `managerTrust`, `tacticalFit`, `SportingRole` y calidad contextual no son
    aliases de una misma variable.
19. `SquadStatus`, `SportingRole` y `EffectiveUsage` pertenecen al contexto de
    carrera/ventana y no sustituyen capabilities o traits del jugador.
20. Reputation, followers, engagement y playing status no son capabilities,
    traits o un overall.
21. Motivation para retiro es derivada; no duplica `ambition` ni `morale`.

## 12. Versionado y migración

La primera implementación ejecutable del Player Model nace con escala
`0..10000`; no existe una persistencia oficial previa de atributos 0–100 que
deba migrarse.

Un cambio futuro en catálogo, dominio, interpretación o propiedad del estado
debe:

- revisar `schemaVersion` conforme a ADR-015;
- cambiar además toda versión participante del replay cuyo resultado se vea
  afectado;
- publicar un mapper explícito cuando la compatibilidad sea semánticamente
  posible;
- rechazar replay oficial si el runtime no comprende el significado requerido.

Una proyección de UI no constituye migración ni compatibilidad de schema.

El fact canónico que confirma una evolución es
`PlayerCapabilitiesChanged`, definido en
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md). No se emite
`PlayerDeveloped` ni un delta de Overall como alias.

## 13. Parameter Registry candidates

Los siguientes valores deben vivir posteriormente en configuración versionada,
con propietario de versión y validación explícitos:

### Generación

- distribuciones iniciales de capabilities y traits;
- medias, dispersiones, asimetrías y colas;
- matrices o modelos de correlación;
- perfiles latentes y pesos de mezcla;
- parámetros de arquetipos;
- correlaciones condicionadas por posición y contexto;
- parámetros de soporte para perfiles extraordinarios.

### Conocimiento

- precisión inicial por observador;
- incertidumbre inicial;
- modelos de actualización y deterioro de conocimiento;
- proyecciones de presentación;
- parámetros de estimación de potencial y calidad percibida.

### Estados dinámicos

- dominio y valor de referencia de cada estado;
- distribución e inicialización;
- persistencia, reversión y shocks;
- correlaciones entre estados;
- reglas de observabilidad y proyección;
- parámetros de `managerTrust`, incluida influencia, persistencia, reversión y
  shocks.

### Desarrollo y maduración

- curvas por familia, sensibilidad a edad y resistencia a extremos;
- distribución y parámetros del perfil de maduración;
- curva minutos/experiencia;
- efectos de talento, capacidad de desarrollo, profesionalismo, club y manager;
- dispersión, covarianza, wear y longevidad;
- efectos de recuperación y secuelas;
- precisión intermedia, acumulación y cuantización.

El registro exhaustivo de Development & Aging está en
[`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md#14-parameter-registry-candidates).

### Derivaciones contextuales

- relevancias por posición y tarea;
- parámetros de proyección de capability efectiva;
- sensibilidad a estado dinámico y contexto;
- demandas tácticas y proyección de `tacticalFit`;
- reglas de cuantización exclusivamente editoriales.

El registro exhaustivo de rol y minutos está en
[`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md#12-parameter-registry-candidates).

El registro exhaustivo de Performance está en
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md#17-parameter-registry-candidates).

El registro exhaustivo de Health está en
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md#15-parameter-registry-candidates).

### Creación

- coeficientes e interacciones del `CreationPowerScore`;
- CDF de referencia y banda de aceptación;
- costes/equivalencias de elecciones y ventajas;
- efecto calibrado de `DominantFoot.BOTH`;
- parámetros de distribución de Carrera rápida;
- restricciones de influencia de Carrera personalizada;
- tamaño de muestra y tolerancias Monte Carlo.

## 14. Decisiones todavía pendientes

La estructura fundamental queda cerrada. G3C-2 cerró las familias matemáticas
de Creation/Development; permanecen parámetros y sistemas posteriores:

| DR | Pendiente |
|---|---|
| DR-045 | `PARTIAL_CALIBRATION`: CPS, sampler y métricas cerrados; faltan coeficientes, CDF, tolerancias y evidencia |
| DR-053 | `PARTIAL_CALIBRATION`: ecuaciones/samplers cerrados; faltan ParameterSet inicial, targets y goldens |
| DR-054 | Estructura aceptada por ADR-054; faltan funciones/distribuciones, disponibilidad, precisión, streams, parámetros y fixtures |
| DR-055 | Estructura aceptada por ADR-055; faltan funciones, distribuciones, escalas, correlaciones, precisión, streams, parámetros y fixtures |
| DR-056 | Ownership y dinámica conceptual aceptados; faltan dominios, funciones, shocks, precisión, streams, parámetros y fixtures |
| DR-057 | Estructura aceptada por ADR-057; faltan funciones, distribuciones, dominios, precisión, streams, parámetros, catálogo y fixtures |
| DR-064 | Resuelta por ADR-072; su composición no modifica el modelo verdadero del jugador |

Estas decisiones no invalidan el esquema fundamental. Sus parámetros pueden
externalizarse, pero sus estructuras y fórmulas deben resolverse en los bloques
G3C correspondientes antes de implementar cada sistema.

## 15. Refinamiento matemático G3C-2

- initial capabilities/traits usan mixture de factores Normal, sigmoid y
  `ROUND_HALF_EVEN`;
- residual sigmas positivos preservan soporte y los profiles no crean caps;
- NaturalTalent participa en generación/maturation, DevelopmentCapacity en
  acquired development;
- `CreationPowerScore` es surrogate de validación, no Overall;
- Quick/Custom usan el mismo target de poder y distribución condicionada;
- `BOTH` se contabiliza mediante CPS sin penalización fija de capability;
- `PositionSuitability` es derivada por posición;
- el slice habilita `GK/CM/ST`; el resto queda `CONTENT_DISABLED`;
- dominancia histórica usa minutos efectivos y desempate determinista.

Todos los parámetros aparecen en
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md#21-engineparameterset).
