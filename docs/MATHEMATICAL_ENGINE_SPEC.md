# Especificación del modelo matemático del motor

## 1. Estado, alcance y autoridad

- Estado: **base conceptual G3A, refinada estructuralmente por G3B, por el
  contrato transversal G3C-1 y por los cierres matemáticos
  G3C-2/G3C-3/G3C-4/G3C-5/G3C-6/G3C-7/G3C-8/G3C-9/G3C-10/G3C-11;
  familias cerradas, valores/data no publicados, no ejecutable**.
- Fecha: 2026-08-01.
- Objetivo: definir las variables, relaciones causales, familias de modelos y hechos que deben cerrarse para resolver DR-008 y DR-010.
- Fuera de alcance: elegir coeficientes, calibrar distribuciones, implementar gameplay o modificar `packages/engine`, `packages/domain`, `packages/probability` o `packages/scoring`.

**Refinamiento G3B — Bloque 1:** el modelo fundamental del jugador fue cerrado
en ADR-052 y `PLAYER_MODEL_SPEC.md`. Cuando un ejemplo exploratorio de G3A
diverge de ese catálogo o escala, prevalece la resolución posterior.

**Refinamiento G3B — Bloque 2:** ADR-053 y
[`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md) cierran la estructura
por capability y Q, las causas auditables, las familias de maduración y las
fronteras con Health, Club, Role & Minutes y Reconversión. Las funciones,
distribuciones, precisión y parámetros continúan pendientes.

**Refinamiento G3B — Bloque 3:** ADR-054 y
[`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md) separan estado institucional,
expectativa y uso efectivo, y fijan las fronteras de posición, confianza,
competencia, disponibilidad, oportunidad y exposición. Las funciones,
distribuciones, calendarios, precisión y parámetros continúan pendientes.

**Refinamiento G3B — Bloque 4:** ADR-055 y
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md) fijan el pipeline de
Performance, EffectiveCapabilities derivadas, rendimiento multidimensional,
producción mínima `GK`/`CM`/`ST`, evidencia, presión, ownership y agregación.
ADR-073 y
[`PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md`](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
cierran después funciones, distribuciones, precisión, correlaciones, samplers y
streams. Quedan pendientes valores, targets, goldens y producers upstream.

**Refinamiento G3B — Bloque 5:** ADR-057 y
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) fijan estado compuesto,
disponibilidad médica, exposición/carga, episodios, recuperación, recaída,
secuelas y ownership entre Health, Role & Minutes, Performance y Development.
ADR-074 y
[`HEALTH_INJURY_RECOVERY_MATH_SPEC.md`](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)
cierran después funciones, distribuciones, precisión, orden, samplers y
streams. Quedan valores, targets, goldens, producers y catálogo concreto.

**Refinamiento G3B — Bloque 6:** ADR-022 y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) separan
definitions reales de states ficticios y fijan `ClubState`, `LeagueState`,
`CompetitionState`, `WorldState`, táctica/manager, calendario agregado,
contribución/soporte colectivo, outcomes correlacionados, shocks jerárquicos,
movilidad e IJL separado de fuerza dinámica. ADR-075 y
[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
cierran después ecuaciones, distribuciones, samplers, orden y streams. Quedan
values, data, targets/goldens y la policy de DR-065.

**Refinamiento G3B — Bloque 7:** ADR-058 y
[`TRANSFER_MARKET_CONTRACT_SPEC.md`](TRANSFER_MARKET_CONTRACT_SPEC.md) separan
percepción, necesidad, interés, oferta, negociación, decisión, outcome y
contrato; fijan Money exacto, expectativa contractual, acuerdos separados,
afiliación dual, loans, free transfers e historia multiclub. ADR-076 y
[`TRANSFER_MARKET_CONTRACT_MATH_SPEC.md`](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
cierran después ecuaciones, distribuciones, samplers, orden causal y streams.
Quedan valores, data/policies, targets/goldens y DR-027/065/066/067.

**Refinamiento G3B — Bloque 8:** ADR-059, ADR-060 y
[`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md) separan estado,
eligibility, field, convocatoria, rol, minutos, Performance y outcome de
National Team; y Definition, eligibility, field comparativo/estadístico,
candidate signal, outcome ordinal y facts de Awards. Matemática, calendario
internacional, nacionalidad deportiva, posición dominante, métricas GK,
streams, parámetros, catálogo y fixtures quedaron entonces pendientes.
ADR-077 y
[`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
cierran después ecuaciones, distributions, samplers, ordinal process, ties y
streams. Quedan values, Definitions/data, calendar/eligibility, targets y
goldens.

**Refinamiento G3C-9:** ADR-078 y
[`REPUTATION_SOCIAL_MATH_SPEC.md`](REPUTATION_SOCIAL_MATH_SPEC.md) fijan estados
y escalas de Sporting/Public Reputation, Public Attention, followers y
engagement; AR(1), evidence/memoria, difusión regional, acquisition/churn,
viral tails, lag, quantization y streams. K01/K02/K05 pasan a
`PARTIAL_CALIBRATION`; quedan values, market/reach data, evidencia, goldens y
targets. Retirement queda cerrado en G3C-10; Scoring permanece fuera.

**Refinamientos G3B — Bloques 9 y 10:** ADR-061/062 y
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
cierran fronteras de Reputation/Social/Retirement; ADR-010 y
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md) cierran facts, allowlist,
ledger y redondeo de scoring. ADR-079 y
[`RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md`](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
cierran después Retirement/Comeback, cursor y DR-069. ADR-080 y
`SCORING_MATH_SPEC.md` cierran posteriormente la matemática de Scoring.

**Refinamiento G3C-1:**
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md)
y ADR-070 fijan representación numérica, toolbox, quantization, randomness,
ParameterSets y calibración. Todas las 63 decisiones G3B `PARTIAL` tienen una
fase G3C owner, pero conservan ese estado hasta que su fórmula sea cerrada.

**Refinamiento G3C-2:**
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md) y
ADR-071 fijan las ecuaciones y samplers de creación, evolución por capability,
maduración, desarrollo adquirido, wear, shocks, Creation Budget,
`PositionSuitability`, reconversión y posición histórica dominante. B02–B06 y
N02–N04 pasan a `PARTIAL_CALIBRATION`: ya no falta familia matemática, pero sí
un ParameterSet inicial aprobado, targets cuantitativos, evidencia y golden
vectors completos.

**Refinamiento G3C-3:**
[`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md) y ADR-072 fijan
softmax de role, matriz de persistencia, señal de competencia, composición de
availability, Logit-Normal de minutos, expectativa GH10, apportionment,
appearances/starts y streams. C04/F03 quedan `RESOLVED_MATH`; C02/C03/C05/C06,
`PARTIAL_CALIBRATION`.

La autoridad normativa se aplica en este orden:

1. `MASTER_SPEC v0.8 — 27/07/2026`;
2. ADR aceptados, que refinan o reemplazan contradicciones de la fuente;
3. decisiones resueltas de `DECISIONS_REQUIRED.md`;
4. esta especificación, una vez aprobada y convertida en decisiones/ADR ejecutables.

ADR-080 cierra `RESOLVED_MATH` para DR-010 y todas las familias G3C asignadas.
DR-008 conserva calibración/data/goldens/schemas. Los esqueletos históricos de
este documento no sustituyen las ecuaciones normativas de cada `*_MATH_SPEC`.

Referencias normativas principales:

- [ADR-002: representación de probabilidades](adr/002-probability-representation.md);
- [ADR-003: composición mediante log-odds](adr/003-probability-composition.md);
- [ADR-004: semántica de oportunidades](adr/004-opportunity-semantics.md);
- [ADR-005: muestreo de oportunidades](adr/005-event-opportunity-sampling.md);
- [ADR-006: PRNG determinista](adr/006-deterministic-prng.md);
- [ADR-009: Coeficiente de Contribución](adr/009-contribution-coefficient.md);
- [ADR-011: taxonomía de posiciones](adr/011-position-taxonomy.md);
- [ADR-013: state machine de temporada](adr/013-season-state-machine.md);
- [ADR-015: taxonomía de versiones](adr/015-version-taxonomy.md);
- [ADR-042: causalidad PERFORMANCE/HEALTH](adr/042-season-health-performance.md);
- [ADR-043: ventanas de eventos](adr/043-event-opportunity-windows.md);
- [ADR-044: posición efectiva y reconversión](adr/044-effective-position-and-retraining.md);
- [ADR-052: modelo fundamental del jugador](adr/052-fundamental-player-model.md);
- [ADR-053: estructura de desarrollo y envejecimiento](adr/053-development-and-aging-model.md);
- [ADR-054: estructura de rol y minutos](adr/054-role-and-minutes-model.md);
- [ADR-055: estructura de Performance y producción](adr/055-performance-and-production-model.md);
- [ADR-057: estructura de salud, lesiones y recuperación](adr/057-health-injury-recovery-model.md);
- [ADR-058: estructura de transferencias, mercado y contratos](adr/058-transfer-market-contract-model.md);
- [ADR-059: estructura de selección nacional](adr/059-national-team-model.md);
- [ADR-060: estructura de premios](adr/060-awards-model.md);
- [ADR-061: reputación y social](adr/061-reputation-and-social-model.md);
- [ADR-062: estado deportivo, retiro y regreso](adr/062-playing-retirement-and-comeback.md);
- [ADR-070: runtime matemático y ParameterSets](adr/070-mathematical-runtime-and-parameter-sets.md);
- [ADR-071: matemáticas de creación, desarrollo y envejecimiento](adr/071-creation-development-mathematics.md);
- [ADR-072: matemáticas de rol, minutos y availability](adr/072-role-minutes-and-availability-mathematics.md);
- [ADR-073: matemáticas de Performance, Production y Form](adr/073-performance-production-form-mathematics.md);
- [ADR-074: matemáticas de Health, Injury y Recovery](adr/074-health-injury-recovery-mathematics.md);
- [ADR-075: matemáticas de Club, Competitions y World](adr/075-club-competition-world-mathematics.md);
- [ADR-076: matemáticas de Transfers, Market y Contracts](adr/076-transfer-market-contract-mathematics.md);
- [ADR-077: matemáticas de National Team y Awards](adr/077-national-team-awards-mathematics.md);
- [ADR-078: matemáticas de Reputation, Public Attention y Social](adr/078-reputation-public-attention-social-mathematics.md);
- [ADR-079: matemáticas de Retirement, Comeback y Finalization](adr/079-retirement-comeback-finalization-mathematics.md);
- [ADR-080: matemática exacta de Scoring](adr/080-exact-scoring-mathematics.md);
- [PLAYER_MODEL_SPEC.md](PLAYER_MODEL_SPEC.md);
- [DEVELOPMENT_AGING_SPEC.md](DEVELOPMENT_AGING_SPEC.md);
- [ROLE_MINUTES_SPEC.md](ROLE_MINUTES_SPEC.md);
- [PERFORMANCE_MODEL_SPEC.md](PERFORMANCE_MODEL_SPEC.md);
- [HEALTH_INJURY_SPEC.md](HEALTH_INJURY_SPEC.md);
- [CLUB_COMPETITION_WORLD_SPEC.md](CLUB_COMPETITION_WORLD_SPEC.md);
- [TRANSFER_MARKET_CONTRACT_SPEC.md](TRANSFER_MARKET_CONTRACT_SPEC.md);
- [SCORING_MATH_SPEC.md](SCORING_MATH_SPEC.md);
- [NATIONAL_TEAM_AWARDS_SPEC.md](NATIONAL_TEAM_AWARDS_SPEC.md);
- [RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md);
- [REPUTATION_SOCIAL_RETIREMENT_SPEC.md](REPUTATION_SOCIAL_RETIREMENT_SPEC.md);
- [SCORING_FACTS_SPEC.md](SCORING_FACTS_SPEC.md);
- [MATHEMATICAL_CALIBRATION_CONTRACT.md](MATHEMATICAL_CALIBRATION_CONTRACT.md);
- [CREATION_DEVELOPMENT_MATH_SPEC.md](CREATION_DEVELOPMENT_MATH_SPEC.md).
- [ROLE_MINUTES_MATH_SPEC.md](ROLE_MINUTES_MATH_SPEC.md);
- [PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md);
- [HEALTH_INJURY_RECOVERY_MATH_SPEC.md](HEALTH_INJURY_RECOVERY_MATH_SPEC.md).
- [CLUB_COMPETITION_WORLD_MATH_SPEC.md](CLUB_COMPETITION_WORLD_MATH_SPEC.md).
- [TRANSFER_MARKET_CONTRACT_MATH_SPEC.md](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md).

## 2. Principios matemáticos no negociables

1. El modelo representa una trayectoria multivariable; nunca reduce al jugador a un único `overall`.
2. Capacidad, calidad efectiva, rendimiento realizado y percepción son conceptos distintos.
3. Toda variable aleatoria recibe un `RandomStream` determinista y contextual. No existe azar implícito.
4. Las oportunidades usan probabilidad/log-probabilidad y composición por log-odds conforme a ADR-002/003.
5. Un resultado concebible y habilitado conserva probabilidad positiva. Cero solo expresa imposibilidad lógica o contenido mecánicamente deshabilitado.
6. No existen caps estadísticos editoriales, cooldowns, cupos, correcciones de rareza ni máximos artificiales de eventos.
7. Sí se respetan identidades físicas y contables: no hay minutos negativos, los minutos no superan el tiempo realmente disponible y un conteo condicionado no supera el número de oportunidades que lo originó.
8. Las distribuciones deben permitir colas suficientemente abiertas para temporadas extraordinarias, sin convertir una anomalía válida en un error.
9. Los hechos ya cerrados no se reescriben. Una lesión resuelta después de la producción de Q2 no cambia estadísticas de Q2.
10. Las correlaciones se expresan mediante causas compartidas y dependencias temporales, no mediante sorteos independientes duplicados.
11. Los estados ocultos no se filtran a subsistemas que solo pueden usar percepción o información pública.
12. `scoring` consume hechos deportivos autorizados; no controla el motor ni crea resultados deportivos.

## 3. Capas temporales, visibilidad y unidades

### 3.1 Cadencias conceptuales

| Cadencia | Semántica | Ejemplos |
|---|---|---|
| Inmutable | No cambia dentro de una Career. | Identidad, nacionalidad inicial, root seed, versiones. |
| Persistente lenta | Puede cambiar, pero conserva continuidad entre temporadas. | Capacidades, personality, fragilidad, reputación deportiva. |
| Por temporada | Se abre y se cierra una vez por temporada. | Contrato, contexto de club, objetivos, competencia agregada. |
| Por Q | Puede cambiar entre Q1, Q2, Q3 y Q4. | Disponibilidad, forma, confianza, rol esperado, minutos, condición. |
| Por oportunidad | Existe durante una evaluación causal concreta. | Interés de transferencia, lesión, candidatura a premio. |
| Derivada | Se calcula desde hechos; no se edita como segunda verdad. | Grupo posicional, calidad efectiva, percentil, CC, valor estimado. |

Una variable que cambia lentamente puede recibir un delta en cada Q sin dejar de ser persistente. “Lenta” describe su dinámica, no impone un máximo de cambio.

### 3.2 Clases de observabilidad

| Clase conceptual | Uso |
|---|---|
| Hecho público | El usuario puede observar el valor exacto ya ocurrido: minutos, goles, club, lesión comunicada. |
| Estimación visible | La UI muestra una banda, categoría o estimación ruidosa: forma percibida, valor de mercado, potencial percibido. |
| Estado mecánico oculto | El motor lo conoce, pero el usuario no: talento natural, fragilidad exacta, volatilidad. |
| Latente derivado | Se calcula para una operación y no necesita persistirse como verdad: calidad efectiva contextual, intensidad de hazard. |
| Evidencia auditable interna | Explica un resultado o replay sin convertirse en información de usuario. |

La política exacta de revelación depende también de `ASSISTED`, `STANDARD` y `EXPERT`, pero esos presets solo cambian presentación conforme a ADR-020.

### 3.3 Dominios numéricos

- Dinero, seguidores, score y conteos confirmados se persisten como enteros.
- Probabilidades y estadística interna pueden usar `double` y log-space conforme a ADR-002.
- Las tasas, índices y estados continuos necesitan unidad, dominio, precisión, redondeo y semántica de frontera explícitos antes de ser implementados.
- ADR-052 fija `CapabilityValue` y `TraitValue` como enteros canónicos
  `0..10000`, inclusive. Una escala 0–100 solo puede ser una proyección de
  presentación o conocimiento.
- Los dominios de `form`, `confidence`, `fitness`, `fatigue`, `morale` y
  `managerTrust` siguen pendientes en sus bloques matemáticos.
- Toda conversión de capabilities/traits usa `normalized = stored / 10000`.
  Estado recurrente se cuantiza una vez por transición atómica mediante
  `ROUND_HALF_EVEN`; scoring conserva `ROUND_HALF_UP`.
- NaN, infinitos y `-0` están prohibidos en estado canónico. Las primitivas
  trascendentales atraviesan el perfil matemático conforme a ADR-070.

## 4. Contrato requerido para toda fórmula futura

Cada fórmula o distribución aprobada para G3B debe documentar:

| Campo | Contenido obligatorio |
|---|---|
| `formulaId` | Identificador estable y versionado. |
| `parameterSetRef` | `parameterSetId` y hash canónico del artefacto que aporta parámetros. |
| `mathProfile` | Primitivas y algoritmo/sampler canónicos requeridos. |
| Output | Nombre semántico, unidad, soporte y granularidad. |
| Inputs | Variables permitidas, visibilidad y momento causal en que existen. |
| Ecuación | Transformación completa, orden de operaciones y constantes. |
| Distribución | Familia, parametrización y procedimiento de muestreo exacto. |
| Dependencias | Variables compartidas, covarianzas o shocks jerárquicos. |
| Random context | Namespace y contexto canónico del stream. |
| Fronteras | Cuándo son válidos cero, uno, mínimos físicos o identidades contables. |
| Precisión | Representación, redondeo y momento de cuantización. |
| Estado | Qué se persiste, qué se deriva y qué se emite como hecho. |
| Invariantes | Propiedades que jamás deben violarse. |
| Calibración | Datos/objetivos, población, tolerancia y tamaño de muestra. |
| Pruebas | Unitarias, property-based, golden y Monte Carlo. |
| Versionado | Versión que cambia si se modifica la semántica o el resultado. |

No se admite una constante “temporal” en código si falta cualquiera de estos campos.

## 5. Modelo conceptual del jugador

Esta sección queda refinada por
[`PLAYER_MODEL_SPEC.md`](PLAYER_MODEL_SPEC.md). Su catálogo es normativo y
reemplaza listas candidatas anteriores de G3A.

### 5.1 Identidad y contexto biográfico

Son datos persistentes, mayormente observables y no forman un `overall`: identidad, edad/fecha conceptual, nacionalidad, altura o morfología si el modelo la necesita, `DominantFoot`, `primaryPosition`, `secondaryPositions` e historial posicional.

La inclusión de una variable biográfica solo se justifica si condiciona una mecánica aprobada o una presentación. No se agregan atributos decorativos al estado autoritativo.

### 5.2 Capacidades técnicas

`finishing`, `passing`, `ballControl`, `dribbling`, `defending` y
`goalkeeping`.

Todos los jugadores poseen las seis. Los modelos posicionales posteriores
derivan tareas o producción sin crear un catálogo causal diferente por posición.

### 5.3 Capacidades físicas

`acceleration`, `pace`, `strength`, `stamina` y `agility`.

`fitness` y `fatigue` son estados dinámicos. `injuryFragility` y
`recoveryCapacity` son traits. Ninguno se confunde con una capability física.

### 5.4 Capacidades mentales

`composure`, `vision`, `decisionMaking`, `positioning` y `workRate`.

No sustituyen traits como `ambition`, `consistency` o `pressureResistance`.

### 5.5 Capacidades tácticas

`attackingMovement`, `defensiveAwareness`, `pressing` y
`tacticalIntelligence`.

La compatibilidad contextual y la posición efectiva participan en funciones
derivadas posteriores. No se persiste un `tacticalOverall`.

### 5.6 Rasgos y personality

Los traits iniciales son `naturalTalent`, `developmentCapacity`,
`professionalism`, `ambition`, `consistency`, `adaptability`,
`pressureResistance`, `injuryFragility`, `recoveryCapacity` y `longevity`.

Son persistentes o lentamente mutables, usan `TraitValue 0..10000` y pueden
permanecer ocultos. Otros conceptos narrativos no se convierten en traits
causales sin una decisión posterior.

### 5.7 Estados dinámicos

El modelo fundamental admite `form`, `confidence`, `fitness`, `fatigue`,
`morale` y `managerTrust`. Sus dominios y dinámicas no se fijan en DR-052.

Rol, disponibilidad, recuperación, reputaciones y seguidores pertenecen a
estados o agregados de sus subsistemas; no amplían por sí solos el catálogo
fundamental de `DYNAMIC_STATES`.

### 5.8 Variables latentes

Los traits anteriores constituyen las predisposiciones latentes iniciales. El
jugador puede contener además parámetros latentes de timing de maduración cuya
forma exacta resolverá DR-053.

La generación usa un perfil latente y una distribución conjunta correlacionada.
Los arquetipos son componentes blandos de mezcla, no clases. `PlayerKnowledge`
mantiene la incertidumbre propia de cada observador fuera de
`TruePlayerState`.

## 6. Potencial como distribución de trayectorias

El potencial no es un `overall` futuro, un ceiling por capability ni un máximo
garantizado. Es una distribución condicional sobre trayectorias posibles por
capability:

```text
P(trayectoria de capacidades |
  talento,
  capacidad de desarrollo,
  perfil latente de maduración,
  longevidad,
  historial,
  entorno,
  decisiones)
```

Conceptos separados:

- **Talento natural:** predisposición innata a poseer o desarrollar capacidades extraordinarias.
- **Development capacity:** capacidad de convertir exposición, entrenamiento, entorno y aprendizaje en mejora posterior; no es un techo duro.
- **Perfil de maduración:** parámetros latentes blandos de inicio, velocidad, estabilización y sensibilidad al declive.
- **Longevity:** persistencia de capacidades y recuperación frente a envejecimiento, carga y lesiones.
- **Curva de desarrollo:** trayectoria emergente; puede ser temprana, tardía, gradual, irregular o con más de un máximo local.
- **Incertidumbre:** dos jugadores con información visible equivalente pueden tener futuros diferentes.
- **Entorno:** minutos adecuados, club, entrenador, desarrollo, salud, decisiones y contexto modifican la distribución realizada.

No existe una edad universal de pico. Las capabilities y familias pueden tener
timings distintos, un declive no impide un resurgimiento posterior y todo valor
menor que `10000` carece de un hard cap individual. Los picos son
retrospectivos y pueden ser de capability, físicos, de performance o de carrera.
La estimación visible de potencial es una creencia ruidosa y actualizable;
mercado, clubes y selección no acceden al potencial verdadero.

## 7. Club agregado mínimo

El club no requiere una plantilla completa. Necesita un estado agregado versionado y suficiente para las fórmulas:

| Variable | Función |
|---|---|
| Fortaleza ofensiva | Generación de oportunidades y contexto para producción ofensiva. |
| Fortaleza defensiva | Supresión de oportunidades rivales y contexto GK/defensivo. |
| Control/creación | Reparto de posesión y oportunidades para mediocampo/ataque. |
| Fortaleza global derivada | Resumen para comparación; no reemplaza los componentes. |
| Prestigio | Atracción, presión, reputación y contexto de premios/mercado. |
| Poder financiero | Capacidad de contratos y ofertas, no garantía de éxito. |
| Calidad del entrenador | Decisiones de rol, táctica y desarrollo. |
| Calidad de desarrollo | Entorno de aprendizaje. |
| Calidad médica | Prevención, diagnóstico, recuperación y recaída. |
| Competencia de plantel por posición | Campo abstracto contra el que se disputa rol/minutos. |
| Estabilidad | Persistencia del proyecto, entrenador y confianza. |
| Contexto táctico | Demanda por posiciones, roles y compatibilidades. |
| Presión institucional/mediática | Modula rendimiento, percepción y decisiones. |

`overallStrength` debe ser una proyección derivada y explicable; ninguna fórmula debe usar simultáneamente el global y todos sus componentes sin declarar cómo evita doble conteo.

La competencia de plantel se expresa mediante `PositionCompetition`, un field
agregado por posición/contexto con fuerza, profundidad y estabilidad, no una
lista ficticia exhaustiva. DR-022 debe fijar escalas, distribución, relación con
calendarios/competiciones y evolución.

ADR-022 y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) cierran la
estructura posterior de este modelo:

- Definitions de club/liga/competición pertenecen a `dataVersion`;
- States simulados pertenecen a `WorldState`;
- `ManagerContext` y `TacticalIdentity` tienen vigencia causal;
- Club es owner de `PositionCompetition`;
- Competitions/Calendar es owner de `TeamMinutesOpportunity`;
- fuerza deportiva, prestigio y finanzas no son aliases;
- `TeamSupportField` excluye `PlayerCompetitiveContribution`;
- ningún club recibe protección por identidad.

Escalas, dinámica, calendario y matemática de outcomes continúan en
DR-008/021/022.

## 8. Rol y minutos

ADR-054 y [`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md) reemplazan el
vocabulario plano exploratorio de G3A.

### 8.1 Estado institucional, expectativa y resultado

`SquadStatus` expresa la relación institucional:

```text
OUT_OF_SQUAD
PROSPECT
SQUAD_PLAYER
FIRST_TEAM
```

`SportingRole` expresa la expectativa deportiva principal de Q:

```text
BENCH
ROTATION
STARTER
KEY_PLAYER
STAR
```

`EffectiveUsage` expresa la participación confirmada y no es un enum. Los tres
conceptos son independientes: `PROSPECT` puede coexistir con `STAR`, y un rol no
garantiza ni fija una banda de minutos.

### 8.2 Proceso causal requerido

1. `ROLE_AND_MINUTES` abre la temporada con priors institucionales y
   deportivos, sin cerrar los cuatro Q.
2. Una `effectivePosition` válida existe antes de resolver la ventana; el módulo
   no reconvierte.
3. Club/Competitions entrega `PositionCompetition`, contexto táctico y una
   `TeamMinutesOpportunity` finita.
4. Health entrega `MedicalAvailabilityEnvelope`; disciplina y otras fuentes
   entregan componentes separados.
5. Una agregación autoritativa produce `AvailabilityEnvelope` y
   `availableTeamMinutes`.
6. Se obtiene `SportingRole` desde una distribución contextual y se calcula
   `expectedMinutes`.
7. Un `minuteShare ∈ [0,1]` condicionado produce `actualMinutes` en la primera
   suboperación de `PRODUCTION(Qn)`.
8. Performance consume minutos confirmados.
9. Los resultados de Qn pueden aportar evidencia para Qn+1, nunca reescribir el
   sorteo ya cerrado de Qn.

### 8.3 Variables explicativas

- capacidad efectiva para la posición/rol;
- `effectivePosition` y `tacticalFit`;
- `managerTrust`;
- `PositionCompetition`;
- rol previo y resumen de rendimiento ya confirmado;
- forma y estados heredados;
- disponibilidad y `TeamMinutesOpportunity`;
- contexto de club, competición y reputación cuando sea una causa distinta;
- azar determinista.

La resolución es jerárquica y preserva:

```text
0 <= actualMinutes <= availableTeamMinutes
  <= TeamMinutesOpportunity.teamMinutes
```

El límite es físico, no un cap editorial. ADR-072 cierra softmax de role,
Logit-Normal de share, precisión, redondeo, correlaciones, streams y
composición de availability. Sus valores quedan en DR-054 como calibración.
La generación de oportunidad/splits permanece en DR-021/022.

### 8.4 Apariciones, posiciones y contextos

Minutos son la exposición causal principal. Apariciones y titularidades se
derivan después, con `starts <= appearances`; no vuelven a generar minutos de
forma independiente.

Cada Q conserva una `effectivePosition` dominante. Un `usageByPosition`
opcional debe sumar exactamente `actualMinutes`. Club y selección poseen
oportunidades y facts separados y nunca duplican exposición.

### 8.5 Persistencia y feedback

`managerTrust` es distinto de calidad, forma, rendimiento y `tacticalFit`. El
rol previo puede modificar la siguiente distribución mediante
`rolePersistence`, pero sin locks ni cooldowns. Performance de Qn afecta
principalmente rol/minutos de Qn+1.

## 9. Calidad y rendimiento

ADR-055 fija cinco capas:

```text
TrueCapabilities
-> EffectiveCapabilities
-> UnderlyingPerformance
-> ObservedProduction
-> PerformanceSummary
```

`EffectiveCapabilities` se resuelve mediante un único contrato contextual desde
capabilities, Dynamic States, posición, rol, presión y táctica. No se persiste ni
muta el estado verdadero.

`UnderlyingPerformance` es multidimensional y admite componentes equivalentes a
ejecución técnica, calidad de decisión, impacto sin balón, impacto defensivo,
contribución ofensiva y respuesta a presión. No existe un rating causal.

Una forma estructural válida debe relacionar:

```text
UnderlyingPerformance(Qn) =
  proceso(
    EffectiveCapabilities,
    actualMinutes,
    SportingRole,
    PerformanceContext,
    shocks compartidos e idiosincráticos
  )
```

La fórmula exacta sigue abierta. El proceso exige:

- `actualMinutes` como exposición ya confirmada;
- varianza y colas aun con igual calidad/contexto;
- correlación entre rendimiento, oportunidades y estadísticas;
- `consistency` principalmente sobre dispersión/volatilidad;
- separación de oportunidad, calidad y conversión;
- raw production separada de evaluación contextual;
- fuerza de evidencia e incertidumbre separadas del conteo observado;
- una traza interna que no revele latentes a consumidores no autorizados.

Un rating derivado puede existir por finalidad y versión, pero nunca genera
producción. La especificación normativa completa está en
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md).

## 10. Producción mínima por posición para el vertical slice

### 10.1 Estadísticas compartidas

Todas las posiciones necesitan, por competición y Q:

- minutos, apariciones y titularidades si el modelo agregado las representa;
- minutos por `effectivePosition`;
- disponibilidad y suspensiones confirmadas;
- goles y asistencias cuando sean lógicamente posibles, con relevancia
  posicional pero sin imposibilidad artificial;
- disciplina relevante;
- `pressureBreakdown` agregado sin simular partidos completos;
- evidencia de rendimiento posicional, volumen e incertidumbre;
- contexto de club, liga y competición.

### 10.2 GK

Mínimo necesario:

- atajadas;
- goles concedidos;
- vallas invictas;
- exposición de atajada o equivalente para auditar identidades;
- evidencia agregada de shot stopping, command y distribution.

Relaciones obligatorias:

- carga rival y fortaleza defensiva del club afectan oportunidades enfrentadas;
- atajadas y goles concedidos se condicionan a esa exposición, no se sortean independientemente;
- vallas invictas se correlacionan con minutos/apariciones, goles concedidos y contexto defensivo;
- la contribución GK puede ser extraordinaria sin depender de goles/asistencias.
- goles concedidos no son proxy directo de calidad GK.

Penales, errores y contadores de distribución pueden añadirse cuando un
consumidor normativo justifique su persistencia; no se simulan para completar un
box score.

### 10.3 CM

Mínimo necesario:

- goles y asistencias;
- evidencia agregada de `progressionImpact`;
- evidencia agregada de `creativeImpact`;
- evidencia agregada de `defensiveContribution`;
- evidencia agregada de `controlImpact`;
- exposición, presión e incertidumbre.

Los cuatro componentes viven en `PerformanceSummary`; no obligan a simular cada
acción ni son macrocapabilities. La mezcla depende de rol y táctica. Un CM
creador, mixto o defensivo no debe ser penalizado por una plantilla estadística
única.

### 10.4 ST

Mínimo necesario:

- goles;
- asistencias;
- trazas distinguibles de scoring/creative opportunities, chance quality y
  conversión/creación;
- evidencia de movimiento, contribución ofensiva y presión no capturada por
  conteos.

Los goles se condicionan a oportunidades y calidad de definición. Una temporada goleadora extrema debe seguir siendo posible mediante oportunidad, conversión y shocks correlacionados compatibles.

### 10.5 Familias probabilísticas requeridas

Sin elegir todavía una familia definitiva:

- minutos: distribución conjunta con masa posible en cero y soporte físico finito;
- oportunidades/acciones: conteos discretos sobredispersables con cola abierta;
- conversiones: resultados condicionados al número de oportunidades;
- índices continuos: distribuciones con varianza contextual y colas controladas;
- clean sheets y otros hechos de aparición: condicionados a exposición, no Bernoulli aislados;
- rendimiento anual: agregación de cuatro ventanas, nunca un nuevo sorteo independiente que contradiga los Q.

ADR-073 selecciona NB2 para producción overdispersed, Binomial para éxitos
dentro de oportunidades confirmadas y Poisson solo cuando la calibración
justifique igualdad media-varianza. No se redondea una expectativa ni se
truncan outliers. Antes de implementar faltan valores, targets, goldens y
producers upstream.

## 11. Pipeline matemático Q1–Q4

### 11.1 Estado que entra a cada Q

Cada ventana recibe:

- capacidades y variables latentes persistentes;
- creencias/percepciones vigentes;
- club, contrato, entrenador, competencia y contexto mundial;
- `primaryPosition`, secundarias y posición efectiva elegible;
- forma, confianza, condición, fatiga y motivación heredadas;
- lesiones activas, recuperación, secuelas y suspensiones;
- rol previo y confianza del entrenador;
- acumuladores de temporada ya cerrados;
- consecuencias/eventos programados;
- cursor y progreso determinista.

### 11.2 Operaciones y salidas

| Paso | Resuelve | Estado/facts disponibles al terminar |
|---|---|---|
| `AVAILABILITY(Qn)` | Posición/oportunidad, estado médico confirmado, `MedicalAvailabilityEnvelope`, componentes disciplinarios/otros, aggregate, rol y expectativa. | `AvailabilityEnvelope`, `SportingRole` y `expectedMinutes` confirmados para Qn. |
| `PRODUCTION(Qn)` | Primero `minuteShare`/`actualMinutes`; después EffectiveCapabilities, UnderlyingPerformance, ObservedProduction, PerformanceSummary y señales físicas. | `EffectiveUsage`, producción, summary y exposición/intensidad realizadas cerrados. |
| `HEALTH(Qn)` | Exposición/carga realizada, progreso de condiciones/recuperación, recaídas/agravamientos y nuevas oportunidades de lesión. | Resultados y señales de salud posteriores a producción, con episodios causales. |
| `CONSEQUENCES(Qn)` | Fitness/fatigue, condiciones, recuperación, restricciones, secuelas, `CAPABILITY_EVOLUTION(Qn)` y otros estados. | Estado inicial mecánico de Qn+1 y capabilities actualizadas por su owner. |
| `PERFORMANCE_EVENTS(Qn)` | Oportunidades cuyos hechos de rendimiento ya existen. | Cero o múltiples efectos secuenciales. |
| `HEALTH_EVENTS(Qn)` | Oportunidades cuyos hechos de salud ya existen. | Cero o múltiples efectos secuenciales. |

`ROLE_AND_MINUTES` no cierra de antemano los minutos de los cuatro Q: inicializa
el estado institucional y los priors de temporada. Cada Q confirma su posición
elegible, oportunidad, disponibilidad, rol esperado y minutos realizados. Estas
suboperaciones usan `operationKey` estable y no crean nuevas fases del cursor.

La granularidad agregada implica que una lesión generada en `HEALTH(Q2)` no reduce retroactivamente la producción de Q2. Sus consecuencias sí afectan Q3/Q4. Si se desea causalidad dentro de una misma Q, deberá aprobarse una subdivisión adicional mediante ADR; no se puede simular implícitamente.

ADR-057 no agrega fases ni modifica las 38 operaciones. Health produce solo el
componente médico en `AVAILABILITY`; el aggregate se construye antes de Role &
Minutes. Una causa externa resuelta después de `CONSEQUENCES(Qn)` se procesa en
el siguiente límite causal válido y no reabre Qn.

`CAPABILITY_EVOLUTION(Qn)` es una suboperación lógica, no una nueva fase del
cursor. Consume exclusivamente inputs confirmados, resuelve el vector completo
contra el snapshot previo, lo valida y lo aplica una vez. `SEASON_CLOSE` puede
materializar agregados retrospectivos, pero no reaplica desarrollo o declive.

### 11.3 Estado que pasa entre ventanas

- acumuladores inmutables de minutos, ObservedProduction y PerformanceSummary;
- forma/confianza actualizadas;
- capacidades con `developmentDelta` aplicado;
- condición, fatiga, lesión, recuperación y secuelas;
- `SquadStatus`, rol anterior, `EffectiveUsage` y `managerTrust` como evidencia
  separada para la próxima evaluación;
- percepción de calidad y reputación actualizadas solo por hechos ya disponibles;
- eventos programados y decisiones resueltas;
- cursor en la siguiente operación no ejecutada.

## 12. Desarrollo y declive

ADR-053 fija que `developmentDelta` es un vector firmado por capability, no por
familia y nunca un incremento de `overall`. Las familias solo seleccionan
parametrización.

La descomposición causal normativa es:

```text
delta_capability(d, Qn) = combine(
  maturationComponent(d, Qn),
  acquiredDevelopmentComponent(d, Qn),
  wearComponent(d, Qn),
  stochasticComponent(d, Qn)
)
```

`combine` no implica suma: la forma aditiva, multiplicativa o jerárquica sigue
pendiente. Las cuatro causas deben permanecer distinguibles y auditables.

Las familias primarias son:

| Familia | Capabilities |
|---|---|
| `EXPLOSIVE_PHYSICAL` | `acceleration`, `pace`, `agility` |
| `STRUCTURAL_PHYSICAL` | `strength`, `stamina` |
| `TECHNICAL` | `finishing`, `passing`, `ballControl`, `dribbling`, `defending`, `goalkeeping` |
| `MENTAL` | `composure`, `vision`, `decisionMaking`, `positioning`, `workRate` |
| `TACTICAL` | `attackingMovement`, `defensiveAwareness`, `pressing`, `tacticalIntelligence` |

Requisitos adicionales:

- desarrollo y declive pueden coexistir en dimensiones distintas;
- edad desplaza probabilidades, no activa una edad universal de caída;
- `naturalTalent` y `developmentCapacity` son causas distintas y no crean un techo determinista;
- minutos alimentan una curva de experiencia no lineal con rendimientos
  decrecientes; no garantizan un delta neto mayor;
- club y manager modifican distribuciones, sin garantizar mejora;
- la resistencia a extremos es parametrizable y no crea ceilings menores que
  `10000`;
- una lesión solo puede afectar capabilities mediante estado de recuperación o
  secuela confirmados;
- personalidad y decisiones influyen solo mediante rutas causales declaradas;
- las innovaciones se correlacionan por familias y períodos;
- toda evolución físicamente/conceptualmente posible conserva probabilidad positiva;
- el proceso admite plateau, declive y resurgimiento;
- el historial no se reescribe al cambiar posición.

La especificación completa está en
[`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md). DR-053 debe cerrar
todavía funciones, distribuciones, covarianza, precisión, cuantización, streams,
parámetros y calibración.

## 13. Forma y confianza

Son estados distintos:

- **Forma:** estado deportivo de corto plazo que altera la distribución de rendimiento.
- **Confianza:** estado psicológico/contextual que responde a resultados, rol y decisiones y puede afectar ejecución o riesgo.

Ambos tienen memoria parcial y reversión hacia un nivel individual/contextual.
`morale` y `managerTrust` permanecen como estados distintos; `fitness` y
`fatigue` pertenecen a Health. Performance consume snapshots confirmados y
emite señales, no escribe esos estados.

Un esqueleto admisible es:

```text
estado(Qn+1) =
  nivel de referencia
  + persistencia × desviación previa
  + respuesta acotada al residual de rendimiento
  + efectos causales confirmados
  + innovación
```

“Respuesta acotada” limita la influencia de una observación sobre el estado, no limita eventos ni estadísticas. Evita que una buena ventana se autoamplifique indefinidamente.

Reglas:

- el input de actualización es el rendimiento contra expectativa junto con
  fuerza de evidencia, no el volumen bruto que ya contiene minutos;
- forma de Qn solo influye en Qn+1 una vez cerrada producción, salvo la forma heredada al inicio;
- el shock mantiene varianza aun tras largas rachas;
- rol y forma no se resuelven simultáneamente con dependencia circular;
- no se resetean automáticamente al inicio de temporada;
- lesión, regreso, transferencia y decisiones pueden cambiar nivel de referencia o innovación mediante hechos explícitos.

DR-056 debe decidir dominios, escalas, reference levels, persistencia, función de
saturación, shocks compartidos, precisión, streams y visibilidad. La estructura
completa está en
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md#11-dynamic-states-y-ownership).

## 14. Salud y lesiones

ADR-057 y
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) reemplazan la exploración
anterior de esta sección.

### 14.1 Estado y ownership

Health separa:

- `fitness` y `fatigue`, como Dynamic States acotados;
- `LoadState` reciente/acumulado;
- colección de `HealthCondition`;
- `InjuryEpisode` con identidad causal;
- `RecoveryState`;
- secuelas y burden persistente;
- historia y resumen auditable.

`injuryFragility`, `recoveryCapacity` y `longevity` son traits diferentes.
`medicalQuality` pertenece al club/entorno. Ningún concepto sustituye a otro,
forma un health score universal o modifica capabilities directamente.

### 14.2 Disponibilidad

Health produce `MedicalAvailabilityEnvelope` por contexto/Q:

- `availabilityShare ∈ [0,1]`;
- indisponibilidad médica conocida;
- restricciones;
- razones médicas;
- incertidumbre;
- referencia al snapshot causal.

No asigna minutos ni contiene disciplina. Una agregación separada combina el
componente médico con `DisciplinaryAvailability` y otras fuentes para producir
el `AvailabilityEnvelope` consumido por Role & Minutes. ADR-072/DR-064 cierran
owner/composición; ADR-074 cierra la asignación médica mediante prefijos
ordinales y exact union.

### 14.3 Exposición, hazard y multiplicidad

Las exposiciones mínimas son competitiva, entrenamiento/background,
no futbolística y evento externo. `actualMinutes` es la señal competitiva
principal, pero cero minutos no implica hazard total cero.

El hazard contextual puede depender de exposición, carga, fatigue, fitness,
edad, fragilidad, historial, recuperación, `medicalQuality`, posición, origen y
azar determinista. ADR-074 lo cierra como competing cumulative hazards
`exposure×exp(logRate)` y count Poisson por Q.

Las oportunidades son tipadas, ordenables y auditables. Deben admitir cero, una
o múltiples lesiones y aplicar consecuencias antes de oportunidades posteriores
dependientes. No existen caps, cuotas, cooldowns, inmunidad editorial ni un
único `currentInjury`.

### 14.4 Episodio, recuperación y secuela

`InjuryFamily`, severidad y origen (`MATCH`, `TRAINING`, `NON_FOOTBALL`,
`EXTERNAL_EVENT`) son dimensiones separadas. `InjuryOccurred` registra una
ocurrencia; `InjuryEpisode` conserva familia, severidad, origen, onset agregado,
recuperación, restricciones y relaciones con otros episodios.

Recuperación esperada y realizada son distintas. El proceso agregado admite
estados equivalentes a:

```text
INJURED -> REHABILITATION -> LIMITED_RETURN -> FULLY_AVAILABLE
```

Una recaída/agravamiento referencia un episodio previo. Una secuela se clasifica
como `NONE`, `TEMPORARY` o `PERSISTENT`. Health confirma su perfil; Development
es owner de cualquier consecuencia permanente en capabilities.

ADR-074 fija severity logistic-Normal, requirement LogNormal, recovery work
positivo, relapse Poisson relacionado y secuela logistic-Normal con decay
temporal exponencial.

Múltiples condiciones pueden coexistir cuando sean lógicamente compatibles.
Identidad e idempotencia evitan duplicar episodios.

### 14.5 Eventos externos y tiempo agregado

Un evento externo emite una causa autorizada y Health procesa la consecuencia;
no se vuelve a sortear como lesión deportiva. Su presentación cumple ADR-012.

Una lesión de `HEALTH(Qn)` afecta Qn+1 y no reescribe Qn. No se inventa fecha o
partido individual. Cambiar esta convención requeriría subdivisión explícita,
ADR y nueva `engineVersion`.

Las seis lesiones concretas de ADR-018 siguen en `CONTENT_LATER`/calibración.
Core solo requiere la taxonomía mecánica extensible.

## 15. Transferencias

ADR-058 amplía el proceso exploratorio de cuatro etapas. El pipeline estructural
es:

```text
MarketPerception
→ ClubNeed
→ TransferInterest
→ TransferOffer
→ SellerResponse, cuando corresponda
→ ContractProposal
→ TransferNegotiation
→ PlayerDecision, cuando corresponda
→ TransferOutcome
→ ContractState / PlayerClubAffiliation
```

Una etapa puede terminar sin producir la siguiente. Interés no es oferta;
acuerdo de clubes no es acuerdo del jugador; acuerdo completo no es
elegibilidad competitiva.

### 15.1 Percepción, evidencia y need

Usa:

- rendimiento reciente y trayectoria;
- calidad y potencial **percibidos**, no latentes verdaderos;
- edad;
- posición/compatibilidad;
- liga y club actual;
- reputación deportiva autorizada;
- contrato y disponibilidad;
- valor de mercado estimado;
- necesidad táctica/posicional del club interesado;
- poder económico y prestigio;
- preferencias del jugador;
- contexto mundial y azar.

El rendimiento llega como summary/evidencia cerrada con exposición,
producción, contexto e incertidumbre. Market no accede a EffectiveCapabilities,
UnderlyingPerformance oculto ni capabilities verdaderas.

`MarketPerception` pertenece a un observador y puede sobre/subvalorar. Club/World
es owner de `ClubNeed`, `PositionScarcity` y ciclos. `PlayerClubFit` es una
derivación contextual, no capability. El mundo puede producir un campo de
clubes candidatos sin simular plantillas completas. Puede haber cero o
múltiples intereses; no existe un máximo editorial.

### 15.2 Interés, oferta y viabilidad

`TransferInterest` tiene identidad propia. Una oferta está condicionada al
interés, capacidad económica, contrato, necesidad y voluntad del club. Interés
no garantiza oferta.

Interés deportivo y `FinancialFeasibilityAssessment` son rutas separadas. Una
oferta firme congela comprador, vendedor cuando corresponde, tipo de
movimiento, fee, ventana, vigencia y causalidad. La respuesta del seller ocurre
antes del `ContractProposal`; salary, duración y expectativa contractual se
congelan una sola vez cuando la operación puede continuar. Mostrar o reanudar
no vuelve a sortear ninguna etapa ya resuelta.

### 15.3 Contrato

`Contract` tiene identidad estable, club, período de tiempo de dominio,
`SalaryTerms`, cláusulas tipadas, status y links predecesor/sucesor.

`ContractExpectation = DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE` reemplaza el
campo ambiguo `Contract.role`. No es `SquadStatus`, `SportingRole` ni
`EffectiveUsage`, y no asigna minutos.

Una renovación crea un contrato sucesor y conserva el anterior. El período no
requiere fechas diarias; DR-021/067 deben fijar boundaries definitivos.

### 15.4 Negociación y decisión

`TransferNegotiation` separa acuerdo entre clubes de acuerdo con el jugador.
V1 usa exactamente una resolución agregada sobre términos congelados, sin
revisiones ni loop. Esa cardinalidad es estructura finita del proceso, no un
cap editorial sobre oportunidades futuras de mercado.

Si exige una decisión mecánica, se crea `PendingDecision` y se interrumpe en
`MARKET`/`MARKET_EVENTS` conforme al cursor. Las opciones ya generadas no se
vuelven a sortear al reanudar.

### 15.5 Resultado, préstamos e historia

El núcleo soporta `PERMANENT_TRANSFER`, `LOAN` y `FREE_TRANSFER`. Renovación y
terminación son operaciones contractuales; `LOAN_RETURN` cierra un
`LoanAgreement`.

`PlayerClubAffiliation` distingue `contractHoldingClubId` de
`currentSportingClubId`. El resultado aplica atómicamente contrato/préstamo,
afiliación y contexto futuro. Rechazar o fallar una negociación no equivale a
“no hubo interés”.

Una temporada puede contener segmentos de múltiples clubes. Ninguna Q cerrada
se reatribuye. `RegistrationEligibility` permanece separada y pendiente en
DR-066.

### 15.6 Tiempo y gates

Calendar produce `MarketWindowContext`; Market no inventa fechas o ventanas.
ADR-013/043 solo contienen `MARKET` post-competiciones. DR-067 debe decidir cómo
ubicar movimientos entre Qs antes de modificar el cursor.

DR-058 queda `PARTIAL_CALIBRATION`: ADR-076 cierra matemática, samplers,
streams e invariantes. La implementación permanece bloqueada por values/data/
targets, DR-027 moneda/conversión/rango, DR-065 scope externo, DR-066
registration y DR-067 cursor/boundary.

## 16. Selección nacional

ADR-059 y
[`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md#4-modelo-de-national-team)
fijan la estructura:

```text
Eligibility
→ Candidate Evaluation contra SelectionCompetitionField
→ CallUp
→ Squad/Tournament Selection
→ InternationalRole
→ InternationalMinutes
→ InternationalPerformance
→ TeamOutcome
```

`NationalTeamDefinition` pertenece a `dataVersion`;
`NationalTeamState`/`NationalTeamContext`, el support field, la competencia
generacional, incumbency y la historia pertenecen a Career. Selección no
reutiliza el estado de club, no usa un threshold de `overall` y no simula una
población mundial.

`SelectionCompetitionField` es el nombre canónico del campo abstracto por
equipo/país, posición específica, contexto y generación. Candidate Evaluation
consume evidencia deportiva purpose-scoped, exposición, contexto, reputación
deportiva autorizada, disponibilidad e historia; no usa `MarketValue`,
`CareerScore`, latentes verdaderos o Public Reputation por defecto.

Club e internacional mantienen rol, oportunidad, minutos, Performance y
outcomes separados. Los resolvers comunes pueden reutilizarse únicamente con
`NationalTeamContext` y discriminantes de dominio explícitos. El support field
colectivo excluye al protagonista y evita que su calidad garantice títulos.

La estructura queda aceptada, pero DR-059 conserva matemática, streams,
parámetros, calendario/cursor y fixtures; DR-068 conserva nacionalidad
deportiva/eligibility del slice; DR-063/ADR-010 ya fijan facts. ADR-013/043 no ubican
ventanas internacionales regulares entre Qs, por lo que no se agrega una fase
por inferencia.

## 17. Premios y `AwardCompetitionField`

ADR-060 y
[`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md#13-awarddefinition)
fijan dos capas: `AwardDefinition` estática/versionada y
`AwardEditionState`/resultado simulado. Cada Definition declara categoría,
scope, cadence, eligibility, posición/grupo cuando aplique, evaluation family,
evidence policy, field y outcome policy. No existe un mínimo universal de edad,
minutos, producción o títulos.

Las familias de evaluación son:

- `COMPARATIVE_JUDGED`, contra `AwardCompetitionField`;
- `STATISTICAL`, contra `StatisticalCompetitionField`.

La categoría es un eje distinto: global, league, tournament, positional, youth,
team-selection o special. El protagonista compite contra una distribución
abstracta por edición, era y contexto, no contra un threshold ni contra
futbolistas materializados. El outcome puede conservar nomination, shortlist,
placement y winner; judging noise es agregado.

Candidate signal consume evidencia autorizada de Performance, producción,
exposición, presión, outcomes de club/selección y reputación solo cuando la
Definition lo permita. No usa `CareerScore`. ST, CM y GK requieren señales
propias; las métricas GK adicionales continúan en DR-055/063. Títulos modifican
la candidatura sin garantizar un premio.

Pueden coexistir múltiples premios. Awards no detecta records, no aplica
anti-duplicación de score y nunca escribe `ScoreLedger`. `AwardWon` es el fact
canónico también para premios estadísticos. `AWARD_EVENTS` se evalúa únicamente
después del outcome de `AWARDS`.

DR-060 conserva distribuciones, comparación, precisión, streams, parámetros y
fixtures; DR-049 conserva posición histórica dominante; DR-063/ADR-010 ya
fijan facts.

## 18. Mundo agregado

El estado global mínimo debe evolucionar durante décadas sin plantillas
completas. ADR-022 define:

- `ClubState` multidimensional;
- `LeagueState` con `leagueCompetitiveStrength`;
- `CompetitionState` por edición/temporada;
- `WorldState` como agregado de estados identificados y fields;
- `WorldCycleState` global/regional;
- `NationalTeamState`, generation context, `SelectionCompetitionField` y
  fields de premios por edición sin población completa;
- definitions estáticas inmutables seleccionadas por `dataVersion`.

La jerarquía estructural de shocks es:

```text
global -> regional -> league -> club -> competition-specific/idiosyncratic
```

Esto preserva correlación: una crisis regional puede afectar economía, clubes y mercado sin sortear tres crisis independientes. Deben existir tendencia, reversión y cambio de régimen posibles, pero ninguna institución tiene garantizada mejora o decadencia.

`leagueCompetitiveStrength` evoluciona dentro de la Career; IJL permanece fijo
para scoring según `dataVersion`/`scoringVersion`. Clubes pueden ascender,
descender, emerger o caer sin pisos ni inmunidades. El club del protagonista no
dispara transferencia automática.

DR-022 queda parcialmente resuelta en estructura. DR-021 conserva tiempo y
calendario; DR-065 debe decidir participantes externos, pool y continuidad
fuera del tier. G3A/G3B no seleccionan aquí ecuaciones ni parámetros.

## 19. Valor de mercado

`MarketValueEstimate` es una **estimación simulada y observer-specific del mundo
del juego**, no una tasación real ni un estado omnisciente.

Inputs:

- edad;
- calidad y potencial percibidos;
- rendimiento reciente y trayectoria;
- posición y demanda;
- liga/club;
- contrato y tiempo restante;
- reputación deportiva/pública;
- contexto económico;
- escasez/necesidad de mercado;
- incertidumbre.

Se separa de:

- `TransferFee`: precio concreto de una operación, incluido cero;
- `SalaryTerms`: compensación contractual.

Las tres magnitudes usan `Money` exacto con unidades menores enteras y
`currencyCode`. No existe floating point, moneda global o conversión implícita.
La dinámica interna debe operar en una representación adecuada para valores
positivos/asimétricos y cuantizar de manera explícita al valor persistido.

Un cambio de valor no es una oferta; una oferta/fee no redefine
retroactivamente el valor. DR-058 decide las funciones y relación causal.
DR-027 continúa decidiendo fuente, moneda de referencia, conversión,
calibración, presentación y fixtures.

## 20. Reputación y seguidores

La estructura normativa completa está en
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
y [ADR-061](adr/061-reputation-and-social-model.md).

Se mantienen cuatro estados ortogonales:

### 20.1 `sportingReputation`

Creencia acumulada sobre relevancia deportiva. Cada mercado conserva standing,
fuerza de evidencia, memoria suficiente y vigencia. La vista global es
derivada. Facts observables se transforman en signals y se deduplican por
`EvidenceKey`; no entran capabilities, MarketValue, CareerScore, followers ni
prestigio copiado del club.

### 20.2 `publicReputation`

Percepción pública no equivalente a calidad. Separa `awareness` y `sentiment`.
Reach se deriva del patrón regional y la audiencia. La atención/hype reciente
es `PublicAttentionState`, no una tercera reputación persistida como alias.

### 20.3 `PublicAttention` y `AudienceState`

`PublicAttentionSignal` referencia el fact fuente y un `causalSignalId`. El
estado de attention conserva exposición reciente y puede correlacionar
reputación, followers y engagement sin que los productores impongan deltas.

`FollowerCount` es `uint64` exacto por audience partition y puede subir o
bajar. `EngagementState` es intensidad `0..10000` y no equivale al contador.
ADR-078 separa adquisición/churn realizados en log-space, shocks y viralidad;
cuantiza después del transition estocástico y no impone hard caps editoriales.

### 20.4 Mercados

`ReputationMarketDefinition` pertenece a `dataVersion`. El slice resuelve
mercado de origen, mercado futbolístico vigente y una vista global derivada;
Argentina/España no son enums del engine. Si scopes coinciden, la evidencia no
se duplica.

El modelo debe permitir:

- excelente y poco famoso;
- mediocre y muy famoso;
- fama local sin alcance global;
- fama global con reputación pública mixta.

Los estados no se suman en un “fame overall”. Sponsors son consumidores
posteriores; este bloque solo expone un contexto de oportunidad futura.
Reputation/Social no modifica capabilities ni crea ScoreLedger.

ADR-078 y `REPUTATION_SOCIAL_MATH_SPEC.md` cierran dominios, escalas,
ecuaciones, decay, difusión, precisión, samplers, streams y fixture
requirements. DR-061 queda `PARTIAL_CALIBRATION` por values, market/reach data,
evidencia, targets y golden outputs. Facts, aliases e idempotencia permanecen
fijados por ADR-010/`SCORING_FACTS_SPEC.md`.

## 21. Retiro

La estructura normativa completa está en
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
y [ADR-062](adr/062-playing-retirement-and-comeback.md).

Se separan:

```text
CareerStatus
PlayerPlayingStatus = ACTIVE | RETIRED
```

Un retiro deportivo cambia `PlayerPlayingStatus`. Mientras Career siga abierta
puede aparecer `ComebackOpportunity`, una decisión y
`ComebackOccurred -> ACTIVE`. Cada retiro/regreso es un episodio causal
identificado. No existe `CareerStatus.RETIRED -> ACTIVE`.

El retiro usa un hazard dinámico y recurrente por causes auditables, no una edad
máxima:

- edad;
- capacidades actuales y trayectoria de declive;
- lesiones, secuelas y recuperación;
- minutos/rol y oportunidades contractuales;
- motivación;
- contexto personal y decisiones;
- éxito/objetivos;
- entorno de club/selección;
- azar.

Requisitos:

- el hazard puede ser positivo a edades inusuales si existe una causa concebible;
- una edad avanzada aumenta o modifica riesgo solo según fórmula aprobada;
- no existe `forceRetireAtAge`;
- una lesión no escribe retiro; Health solo aporta burden/restricciones;
- estar sin club es `UNATTACHED`, no retiro;
- el proceso puede producir decisión del jugador cuando corresponda;
- la ruta normal incluye reflexión; una causa externa explícita puede omitirla;
- `CareerMotivationAssessment` es derivada de ambition, morale, historia y
  contexto, no un trait/overall nuevo;
- un primer `RetirementOccurred` no completa ni rankea la Career;
- pueden ocurrir retiro→regreso→retiro sin cooldown o cupo;
- un evento instantáneo sensible solo evita la reflexión cuando el hecho mecánico lo exige.

ADR-079/G3C-10 fija Motivation sigmoid, competing risks de retirement,
comeback/finalization hazards, streams y fixtures requeridos. No añade fase
top-level: las suboperaciones lifecycle abren `AVAILABILITY(Qn)` y quarters
continúan durante retiro abierto. `CareerFinalizationConfirmed` entra en
`CareerStatus.RETIRED`/FINALIZING y cierra el fact frontier; `COMPLETED` sigue
al pipeline idempotente terminal. DR-069 queda resuelta sin hard cap.

## 22. Scoring: contrato cerrado por ADR-080

`scoring` recibe hechos cerrados y genera un `ScoreLedger` separado. No existe dependencia `engine → scoring`.

La estructura normativa completa de facts, rules, ledger y valores aprobados
está en [`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md) y
[ADR-010](adr/010-scoring-ledger-and-domain-facts.md). La matemática completa
está en [`SCORING_MATH_SPEC.md`](SCORING_MATH_SPEC.md) y ADR-080; esta sección
resume su superficie.

### 22.1 Inputs autorizados

- minutos, titularidades, disponibilidad y posición efectiva por scope;
- `ObservedProduction` y `SeasonPerformanceSummary` posicionales confirmados,
  con exposición, contexto, presión e incertidumbre;
- participación en fases/contextos de importancia;
- logros de clubes y selección;
- premios individuales;
- récords confirmados;
- duración y continuidad de carrera;
- reputación/seguidores solo para bonificaciones expresamente limitadas;
- catálogos de jerarquía, competición y premio;
- `VersionSet`, posición dominante del scope y facts con identidad estable.

Contenido no puede crear ni modificar estas evidencias con un efecto de ScoreLedger directo.
EffectiveCapabilities, traits/latentes, UnderlyingPerformance oculto y ratings
de presentación no forman parte del allowlist por defecto.

### 22.2 Estado de SC-01 a SC-13

Todas las familias están cerradas. SC-01/11/12/13 son `RESOLVED_MATH`;
SC-02/07/09 son `PARTIAL_CALIBRATION`; SC-03/04/05/06/08/10 son
`DATA_REQUIRED`. La tabla detallada vive en `SCORING_FACTS_SPEC.md`.

Los valores explícitos de `MASTER_SPEC` son normativos y se registran en la
especificación de scoring. Los rangos y huecos no se completan por inferencia.

### 22.3 Anti-duplicación

Cada entrada futura necesita una clave conceptual única:

```text
(
  scoringVersion,
  careerId,
  sourceFactId,
  ruleId,
  scoreCategory,
  scopeId
)
```

La forma serializada final es decisión de schema, pero debe garantizar:

- replay idempotente;
- una marca no puntúa dos veces;
- premios equivalentes aplican la política versionada;
- una temporada multi-club no duplica rendimiento;
- reversals son entradas nuevas, no edición;
- el total se deriva del ledger.

ADR-010 concreta la clave con `scopeKey`, source facts canónicos y
`applicationKind`; re-scoring bajo otra `scoringVersion` produce otro ledger.

### 22.4 Coeficiente de Contribución

ADR-009 fija semántica/rango y ADR-080 cierra scope, inputs, combinación,
transform, exceptional tail y quantization. Faltan únicamente weights, splines,
cohortes, targets y expected goldens del bundle inicial.

El CC debe calcularse en `scoring` desde hechos autorizados o desde una proyección pura compartida aprobada. No debe ser un campo editable emitido por contenido.

### 22.5 Topes permitidos

Los topes expresamente aprobados para **puntos** o bonos bounded no limitan estadísticas, oportunidades ni eventos. Alcanzar un máximo de PBR solo impide sumar puntos adicionales en esa categoría; los hechos siguen ocurriendo y registrándose.

La nomenclatura canónica es `PRL = records/longevidad` y
`PBR = popularidad/redes/achievements históricos bounded`. PBR conserva
subcaps de 1.000/1.000 y cap agregado
`min(2000, 5 % × puntaje deportivo previo)`. ADR-080 define exactamente
`priorSportingPoints = PRI + PTC_CLUB + PPI + PSN`, aplica subcaps y cap antes
del único `ROUND_HALF_UP`, y deja transforms/cohortes como calibración.

## 23. Grafo causal y correlaciones

```mermaid
flowchart TD
    Latent["Traits y perfil de maduración"] --> Evolution["Evolución por capability Qn"]
    Age["Edad e historial"] --> Evolution
    Club["Club, entrenador y táctica"] --> TacticalFit["Tactical fit derivado"]
    EffectivePosition["Effective position válida"] --> TacticalFit
    Capability --> TacticalFit
    TacticalFit --> Role["Sporting role Qn"]
    ManagerTrust["Manager trust heredado"] --> Role
    Competition["Position competition"] --> Role
    PriorEvidence["Rendimiento cerrado anterior"] --> Role
    HealthPrev["Salud heredada"] --> MedicalAvailability["Medical availability Qn"]
    Discipline["Disciplina / otras causas"] --> Availability["Availability aggregate Qn"]
    MedicalAvailability --> Availability
    Calendar["Team minutes opportunity"] --> Availability
    Role --> Minutes["Minutos Qn"]
    Availability --> Minutes
    EffectivePosition --> Minutes
    Capability --> EffectiveQuality["EffectiveCapabilities Qn"]
    Club --> EffectiveQuality
    HealthPrev --> EffectiveQuality
    FormPrev["Forma/confianza heredadas"] --> EffectiveQuality
    EffectiveQuality --> Performance["UnderlyingPerformance Qn"]
    Minutes --> Performance
    Performance --> Opportunities["Oportunidades/acciones Qn"]
    Minutes --> Opportunities
    Opportunities --> Stats["ObservedProduction Qn"]
    Performance --> Summary["PerformanceSummary Qn"]
    Stats --> Summary
    Summary --> PlayerContribution["PlayerCompetitiveContribution por competición"]
    TeamSupport["TeamSupportField sin protagonista"] --> CompetitionOutcome["CompetitionOutcome"]
    PlayerContribution --> CompetitionOutcome
    Club --> TeamSupport
    CompetitionContext["Competition/League context"] --> TeamSupport
    CompetitionContext --> Role
    CompetitionContext --> EffectiveQuality
    CompetitionOutcome --> ClubNext["Club/League state futuro"]
    CompetitionOutcome --> WorldNext["WorldState futuro"]
    Minutes --> Load["Carga realizada Qn"]
    Performance --> Load
    Load --> InjuryHazard["Hazard de salud posterior"]
    HealthPrev --> InjuryHazard
    InjuryHazard --> HealthNext["Salud Qn+1"]
    Minutes --> Evolution
    Club --> Evolution
    HealthNext --> Evolution
    Capability["Capacidades verdaderas Qn"] --> Evolution
    Evolution --> CapabilityNext["Capacidades verdaderas Qn+1"]
    CapabilityNext --> EffectiveQualityNext["Calidad efectiva Qn+1"]
    Summary --> Evidence["Evidencia percibida"]
    Evidence --> FormNext["Forma/confianza Qn+1"]
    Evidence --> TrustNext["Manager trust Qn+1"]
    TrustNext --> RoleNext["Rol Qn+1"]
    Evidence --> MarketPerception["MarketPerception"]
    MarketPerception --> TransferNeed["ClubNeed / fit"]
    TransferNeed --> TransferInterest["TransferInterest"]
    TransferInterest --> TransferOffer["TransferOffer"]
    TransferOffer --> SellerResponse["Seller response"]
    SellerResponse --> ContractProposal["Contract proposal"]
    ContractProposal --> TransferNegotiation["Negotiation / decision"]
    TransferNegotiation --> TransferOutcome["TransferOutcome"]
    TransferOutcome --> ContractState["Contract / affiliation futura"]
    Evidence --> Selection["Selección"]
    Evidence --> Awards["Premios"]
    Achievements["Logros"] --> Awards
    Evidence --> SportingReputation["Sporting Reputation"]
    PublicFacts["Facts públicos autorizados"] --> PublicAttention["Public Attention"]
    SportingReputation --> PublicReputation["Public Reputation"]
    PublicAttention --> PublicReputation
    PublicAttention --> Audience["Followers / engagement"]
    PublicReputation --> Audience
    HealthNext --> Retirement["Hazard de retiro"]
    Evidence --> Retirement
    ContractState --> Retirement
    SportingReputation --> Retirement
    Retirement --> PlayingStatus["PlayerPlayingStatus"]
    PlayingStatus --> Comeback["Comeback opportunity"]
    Comeback --> PlayingStatus
    World["Mundo agregado"] --> Club
    World --> CompetitionContext
    WorldNext --> ClubNext
    World --> TransferNeed
    World --> MarketPerception
    World --> Selection
    World --> Awards
```

### 23.1 Dependencias que no pueden sortearse por separado

| Relación | Regla para evitar doble conteo/ciclos |
|---|---|
| Estatus ↔ rol ↔ uso | `SquadStatus`, `SportingRole` y `EffectiveUsage` permanecen separados; ninguno reescribe automáticamente los otros. |
| Rol ↔ minutos | Rol de Qn condiciona el share de Qn; minutos/rendimiento actualizan evidencia solo para rol Qn+1. |
| Oportunidad ↔ disponibilidad ↔ minutos | Calendario produce oportunidad, Health produce el componente médico, una agregación combina causas no médicas y Role & Minutes realiza una fracción; no se duplican descuentos. |
| Calidad ↔ tactical fit ↔ manager trust | Son causas distintas. Fit es compatibilidad contextual y trust es estado relacional; ninguno sustituye capacidad efectiva. |
| Minutos ↔ rendimiento | Minutos son exposición confirmada; UnderlyingPerformance es realización y producción es observación. Sparse exposure conserva el conteo y expresa menor evidencia. |
| Exposición/carga ↔ lesión | Minutos e intensidad producen carga explícita; carga/otras exposiciones alimentan hazard posterior y la lesión resultante afecta Qn+1. |
| Rendimiento ↔ forma | Forma heredada afecta rendimiento; residual de rendimiento actualiza forma futura con reversión/saturación. |
| Rendimiento ↔ transferencia | Transferencia consume evidencia ya derivada; no vuelve a sortear “buen rendimiento”. |
| Evidencia ↔ reputación | Un fact se transforma en una signal con `EvidenceKey`; no vuelve a entrar mediante producción, rating, título y reputación como aliases. |
| Attention ↔ reputación pública ↔ followers | Comparten `causalSignalId` cuando corresponde, pero cada owner actualiza su estado una vez y no se realimenta dentro del mismo boundary. |
| Sporting ↔ Public Reputation | La reputación deportiva puede ser una señal pública, nunca equivalencia ni copia automática. |
| Retiro ↔ Career lifecycle | `RetirementOccurred` cambia `PlayerPlayingStatus`; ADR-079 fija `CareerFinalizationConfirmed` como boundary irreversible hacia FINALIZING. |
| Retiro ↔ comeback | Cada oportunidad/episodio tiene identidad y stream propios; regresar no reabre períodos cerrados ni garantiza otro club/rol. |
| Percepción ↔ valor/interés | Cada observador proyecta conocimiento e incertidumbre; MarketValue no sustituye estado verdadero ni se vuelve a ingresar como calidad objetiva. |
| Need/fit ↔ interés | Need y fit condicionan el interés; no son oferta, vacante ni obligación de fichar. |
| Interés ↔ oferta ↔ movimiento | Cada etapa tiene identidad y puede terminar sin la siguiente; no se reutiliza el mismo sorteo como tres éxitos. |
| MarketValue ↔ fee ↔ salary | Estimación, precio y compensación siguen modelos distintos; ninguno se deriva por igualdad ni vuelve a entrar mediante aliases. |
| Contrato ↔ rol/minutos | `ContractExpectation` es señal contractual futura; no asigna `SportingRole` ni minutos y su cumplimiento se evalúa después. |
| Transferencia ↔ elegibilidad | Afiliación y registro competitivo son estados separados; un outcome no crea participación sin eligibility. |
| Rendimiento ↔ selección | Selección usa evidencia y un campo de competencia, no threshold ni duplicación de reputación. |
| Títulos ↔ premios | El logro es un input explícito del campo; no se suma otra copia oculta mediante reputación. |
| Club ↔ estadísticas | Club afecta oportunidades/contexto una vez; competition strength no reescribe raw production ni vuelve a multiplicarse sin una interpretación distinta. |
| Rendimiento ↔ presión | Pressure context condiciona la realización; el mismo breakdown no vuelve a entrar como bonus editorial o fact duplicado. |
| Reputación ↔ valor | El valor puede usar reputación como señal; la misma fama no entra por varios aliases correlacionados. |
| Fama ↔ seguidores/sponsors | Un shock de exposición común genera efectos relacionados; sponsors no se sortean como validación independiente del mismo hecho. |
| Minutos/entorno/salud ↔ desarrollo | Son inputs confirmados de componentes distintos; el cambio se aplica por capability una vez en `CONSEQUENCES(Qn)`. |
| Lesión ↔ capability | Una lesión no escribe la capability: recuperación y posible secuela generan el estado que Development puede consumir. |

### 23.2 Shocks jerárquicos

Cada Q puede necesitar innovaciones a varios niveles:

- carrera/jugador;
- temporada;
- Q;
- club/competición;
- subsistema;
- oportunidad.

La matriz de correlaciones y el contexto de streams deben versionarse. Compartir causa no significa compartir el estado mutable de un PRNG: cada stream permanece independiente y los shocks compartidos se derivan explícitamente como variables de dominio/cálculo.

## 24. Outputs y hechos de dominio

Las tablas 24.1–24.2 conservan el inventario conceptual generado por G3A. El
catálogo canónico, clasificación, payload mínimo, identidad, aliases y
allowlist quedaron reconciliados por
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md). Ante diferencias de nombre o
clasificación, prevalece ese documento.

### 24.1 Resultado obligatorio de cada Q

| Hecho conceptual | Payload mínimo |
|---|---|
| `MedicalAvailabilityCalculated` | Traza/snapshot del componente médico: Q/contexto, share, restricciones, razones, incertidumbre y estado causal. |
| `WindowAvailabilityAssessed` | Aggregate: `TeamMinutesOpportunity`, componentes médicos/no médicos, disponibilidad resultante y referencias causales. |
| `SportingRoleAssigned` | `SquadStatus`, rol anterior/asignado, club, posición elegible, contexto y referencias causales autorizadas. |
| `expectedMinutes` | `INTERNAL_SIGNAL`: expectativa condicional pre-sample; no prueba participación. |
| `EffectivePositionUsed` | Posición dominante y minutos efectivos; solo aporta historia cuando hubo uso. |
| `MinutesRecorded` | `actualMinutes`, oportunidad/disponibilidad, club, selección/competición y Q. |
| `AppearanceSummaryRecorded` | Apariciones/titularidades derivadas y contexto cuando DR-054 apruebe su contrato. |
| `EffectiveCapabilitiesResolved` | Traza de cálculo contextual; no estado persistente ni fact competitivo por defecto. |
| `UnderlyingPerformanceRecorded` | Evidencia interna multidimensional, expectativa/realización, exposición, contexto y referencias de shocks. |
| `ObservedProductionRecorded` | Stats tipadas, valores enteros/derivados, posición, competición, exposición y referencias causales. |
| `PerformanceSummaryRecorded` | Rendimiento, producción, volumen, presión, contexto, fuerza de evidencia e incertidumbre de Q. |
| `LoadRecorded` | Exposición/minutos e intensidad realizados, carga derivada, Q/contexto y referencias sin duplicar `MinutesRecorded`. |
| `FitnessUpdated` / `FatigueUpdated` | Estado anterior/nuevo, causas, restricciones y Q. |
| `InjuryOccurred` | `episodeId`, familia, severidad, origen, Q, causa/exposición y estado inicial. Uno por ocurrencia. |
| `InjuryProgressed` / `RecoveryUpdated` | Episodio/condición, estado anterior/nuevo, estimación separada del resultado y restricciones futuras. |
| `ReturnToPlayReached` | Episodio, fase de retorno, restricciones y disponibilidad médica; no asigna minutos. |
| `RelapseOccurred` | Nuevo episodio/transición con referencia causal al episodio previo y exposición. |
| `SequelaRecorded` | Perfil `NONE`/`TEMPORARY`/`PERSISTENT`, episodio causal y alcance; no aplica capabilities. |
| `HealthConditionResolved` | Condición/episodio cerrado sin borrar historia o relaciones causales. |
| `DevelopmentApplied` / `PlayerDeveloped` | Snapshot previo/posterior, delta por capability, familia, contribuciones causales distinguibles, Q, referencias de inputs/streams, precisión y versiones. |
| `FormUpdated` | Estado anterior/nuevo y evidencia causal autorizada. |
| `ConfidenceUpdated` | Estado anterior/nuevo y evidencia causal autorizada. |
| `SeasonWindowClosed` | Hash/resumen canónico de outputs cerrados y siguiente cursor. |

`SquadStatusChanged` solo se emite si cambia el estado institucional. Si no
ocurrió una lesión o cambio de estado no se inventa un fact de ocurrencia.
`SeasonWindowClosed` sí confirma que la ventana fue evaluada, incluso con
producción cero.

`PressurePerformanceRecorded` no se emite separado por defecto:
`pressureBreakdown` pertenece a `PerformanceSummaryRecorded`. Las señales para
form/confidence/managerTrust/morale no prueban un cambio; el owner correspondiente
emite el eventual estado confirmado.

### 24.2 Hechos posteriores a Q4 y de temporada

| Fase | Hechos conceptuales |
|---|---|
| `COMPETITIONS` | Outcome canónico por competición, participación/contribución autorizada, fase, qualification y título sin duplicar el mismo resultado. |
| `MARKET` | Valuation/need según clasificación DR-063; interés, oferta/withdrawal, renewal, negociación, decisión, acuerdo contractual, movimiento permanente/loan/free transfer y expiración/fallo, todos con identidad independiente. |
| Selección | Eligibility/candidate evaluation como trazas por defecto; convocatoria y squad como facts distintos; role/minutos/Performance con discriminante nacional; outcome internacional canónico y achievement sin duplicación, ubicados por DR-059/021. |
| `AWARDS` | Eligibility/candidate evaluation como trazas por defecto; `AwardEditionResolved` como outcome ordinal; nomination/placement solo con consumidor y `AwardWon` como victoria canónica, también estadística. |
| Reputación/social | Sporting/Public Reputation actualizadas por mercado, Public Attention referenciada y followers/engagement exactos, sin aliases ni score. |
| Valor | Estimación observer-specific actualizada con Money exacto; no follower, reputación o score financiero. |
| `WORLD_UPDATE` | Club/league/world/field/economic state futuro actualizado, con definitions intactas y shocks causales identificables. |
| Retiro | Assessment como traza; decisión cuando aplique; `RetirementOccurred`/`ComebackOccurred`, causa y episodios, sin completar Career por sí mismos. |
| `SEASON_CLOSE` | `SeasonPerformanceSummaryRecorded`, resumen segmentado por Q/club/competición/posición/contrato-préstamo sin duplicación, acumuladores, versiones, hash y `SeasonCompleted`. |

### 24.3 Identidad, orden e idempotencia

Todo hecho necesita:

- Career, temporada, Q/fase y `operationKey`;
- tipo y schema versionados;
- ordinal determinista cuando hay múltiples hechos del mismo tipo;
- referencia a hechos causales relevantes;
- `VersionSet`;
- payload canónico;
- identidad estable derivable sin reloj ni UUID aleatorio.

Un `sourceFactId` no cambia por cadencia `advance(n)`. Los facts se ordenan por plan canónico y operación, nunca por orden incidental de objetos o consultas.

### 24.4 Hechos autorizados para scoring

Antes de G3B debe publicarse un allowlist tipado. Como mínimo puede incluir participación, producción, performance, logros, selección, premios, récords y estados finales cerrados. No incluye:

- elegibilidad sin ocurrencia;
- probabilidades internas;
- latentes verdaderos;
- presentación narrativa;
- telemetría;
- efectos editoriales directos;
- un `ScoreLedgerEntry` originado por contenido.

Tampoco incluye por defecto EffectiveCapabilities, UnderlyingPerformance
oculto, traits/latentes o ratings de presentación. `StatisticRecorded`,
`StatsGenerated` y `ObservedProductionRecorded` deben reconciliarse para que una
misma producción no exista como facts duplicados.

### 24.5 Cierre estructural de DR-063

DR-063 queda resuelta estructuralmente:

- `PlayerCapabilitiesChanged` reemplaza `DevelopmentApplied`/
  `PlayerDeveloped`;
- `ObservedProductionRecorded` reemplaza `StatsGenerated`/
  `StatisticRecorded`;
- `PlayerDynamicStateChanged.stateKind` concentra updates dinámicos;
- `HealthConditionTransitioned.transitionKind` concentra progreso,
  recuperación, retorno y resolución;
- `CompetitionFinished` es el outcome colectivo fact; win/round/qualification
  son vistas;
- contextos nacionales reutilizan facts genéricos;
- free transfer es un `TransferCompleted.movementType`;
- `AwardWon`, `FollowerCountUpdated` y `RetirementOccurred` son canónicos;
- requests especializados reutilizan `DecisionRequested.decisionKind`;
- records/milestones/achievements puntuables solo proceden de detectores
  autoritativos.

Internal signals, derived summaries y Narrative Events no se presentan como
Domain Facts. Content no emite facts allowlisted y Scoring no usa RNG.

## 25. Estrategia de validación y calibración

### 25.1 Unitarias y de propiedades

- dominios, unidades, redondeo y ausencia de NaN/Infinity;
- minutos/participación/estadísticas cumplen identidades;
- ninguna probabilidad positiva se serializa como cero;
- cero y certeza tienen motivo semántico;
- cambios de cadencia preservan facts, estado y hash;
- producción cerrada no cambia por salud posterior;
- evolución aplica una vez por Q, conserva signos independientes por capability y no se repite en `SEASON_CLOSE`;
- jugador joven puede tener delta negativo y veterano delta positivo;
- una trayectoria puede declinar y luego resurgir;
- una lesión no escribe capabilities antes de una secuela confirmada;
- cambios de posición no reetiquetan historia;
- scoring es reconstruible e idempotente.

### 25.2 Golden/replay

Fixtures por:

- posición `GK`, `CM`, `ST`;
- cero minutos;
- cuatro ventanas completas;
- lesión Q2 con efecto Q3/Q4;
- transferencia con interrupción;
- jugador de desarrollo temprano/tardío;
- temporada extrema positiva/negativa;
- selección y premio contra campo abstracto;
- retiro temprano y carrera longeva;
- multi-club/multi-posición cuando su scope sea aprobado.

Actualizar un golden exige cambio versionado y justificación.

### 25.3 Monte Carlo

La aprobación de parámetros requiere objetivos y tolerancias para:

- minutos/roles por posición, edad, salud y nivel;
- estadísticas por 90 y por temporada;
- dispersión, asimetría y colas;
- edades/trayectorias de desarrollo y retiro;
- incidencias, severidades, duración y recaídas;
- transferencias, convocatorias y premios;
- valor, reputación y seguidores;
- distribución de score y CC;
- sensibilidad a cada input;
- comparabilidad de Creation Budget.

Una salida extrema no se rechaza por rareza. Se investiga solo si viola una invariante o revela una calibración incompatible con objetivos documentados.

### 25.4 Validación causal

Además de histogramas, se requieren intervenciones controladas:

- mejorar `medicalQuality` manteniendo lo demás fijo;
- cambiar competencia por puesto;
- alterar minutos manteniendo capacidad;
- alterar capacidad manteniendo minutos;
- cambiar liga/club sin modificar jugador;
- ocultar/mostrar información sin cambiar resultados;
- agregar consumo a un stream independiente.

Esto detecta signos invertidos, doble conteo y dependencia accidental entre streams.

## 26. Decisiones pendientes agrupadas — snapshot G3B

Esta sección conserva el inventario que justificó G3C. Para Creation,
Development y Aging, el estado vigente es el cierre de §29: DR-048/049 están
resueltas y DR-045/053 quedan `PARTIAL_CALIBRATION`.

### 26.1 `BLOCKER_G3`

No debe comenzar gameplay de G3B hasta resolver:

| Decisión | Cierre requerido |
|---|---|
| DR-053 | Ecuaciones y samplers aceptados por ADR-071; faltan valores del ParameterSet, targets, evidencia y goldens completos. |
| DR-054 | `PARTIAL_CALIBRATION`: ADR-072 cierra funciones/samplers/precisión/streams/mappings; faltan valores, targets y evidencia. |
| DR-055 | `PARTIAL_CALIBRATION`: ADR-073 cierra funciones, distribuciones, samplers, escalas, correlaciones y streams; faltan valores, targets, goldens y producers upstream. |
| DR-056 | Form y señales desde Performance quedan `PARTIAL_CALIBRATION`; faltan dinámicas completas/calibración de confidence, morale, managerTrust e incumbency. |
| DR-057 | `PARTIAL_CALIBRATION`: ADR-074 cierra ecuaciones, samplers, dominios, orden, precisión y streams; faltan valores, targets, goldens, producers y seis definitions. |
| DR-058 | `PARTIAL_CALIBRATION`: ADR-076 cierra funciones/distribuciones, samplers, precisión, correlaciones y streams; faltan values, data/policies, targets, goldens y DR-027/065/066/067. |
| DR-059 | `PARTIAL_CALIBRATION`: ADR-077 cierra fields, call-up/squad, incumbency, role/minutes adapters, outcomes y streams; faltan values, data/eligibility/calendar, targets y goldens. |
| DR-060 | `PARTIAL_CALIBRATION`: ADR-077 cierra fields comparativo/estadístico, utility, rank ordinal, ties y streams; faltan values, catálogo, evidencia, targets y goldens. |
| DR-061 | `PARTIAL_CALIBRATION`: ADR-078 cierra dominios, equations, memory/diffusion, follower/engagement models, precisión y streams; faltan values, market/reach data, evidencia, targets y goldens. |
| DR-062 | Estructura aceptada por ADR-062; faltan hazard/competing risks, outcomes, comeback, precisión, streams, parámetros y fixtures. |
| DR-064 | Resuelta por ADR-072: owners preservados y unión exacta de asignaciones agregadas. |
| DR-065 | Scope competitivo, pools externos, promotion/relegation y continuidad fuera del tier. |
| DR-066 | `RegistrationEligibility`, owner, scope y reglas posteriores a movimientos. |
| DR-067 | Cadencia/cursor de Market y movimientos efectivos entre Qs. |
| DR-068 | Nacionalidad deportiva, antecedentes y transiciones de elegibilidad internacional del slice. |
| DR-069 | Resuelta por ADR-079: cursor posretiro, boundary irreversible, ranking/profile gate y terminación tooling sin edad máxima. |
| DR-008 | Integrar las decisiones anteriores en una especificación matemática versionada con parámetros iniciales. |
| DR-010 | Publicar todas las fórmulas `SC-01`–`SC-13`, fixtures y `scoringVersion`. |
| DR-021/022 | Calendario/tiempo y matemática/escala del modelo estructural de club, competiciones y mundo aceptado por ADR-022. |

DR-052 quedó resuelta el 2026-07-27 mediante ADR-052 y
`PLAYER_MODEL_SPEC.md`. Su catálogo, escala y fronteras de observabilidad dejan
de pertenecer a esta lista; las fórmulas que consumen el Player Model siguen
bloqueadas por las decisiones indicadas.

DR-063 quedó resuelta estructuralmente el 2026-07-28 mediante ADR-010 y
`SCORING_FACTS_SPEC.md`. Ya no pertenece a la lista de blockers; los schemas y
la implementación futura deben cumplir el catálogo sin reabrir su semántica.

ADR-053 cerró la unidad por capability, cadencia Q, descomposición causal,
familias, ausencia de ceilings y fronteras de Development & Aging. ADR-071 y
G3C-2 cierran después sus ecuaciones, samplers, precisión y streams.
DR-053 queda `PARTIAL_CALIBRATION` por valores, targets, evidencia y goldens,
además de las señales cuantitativas todavía abiertas de DR-022, DR-054 y
DR-057.

ADR-054 cerró la separación `SquadStatus`/`SportingRole`/`EffectiveUsage`.
ADR-072 cierra posteriormente su matemática, precisión, streams, composición y
fixtures requeridos. DR-054 queda `PARTIAL_CALIBRATION` por valores/targets y
por producers upstream de DR-021/022/055–057. DR-064 queda resuelta.

ADR-055 cerró el pipeline de Performance, la proyección efectiva única, el
objeto multidimensional, los grafos y outputs mínimos de `GK`/`CM`/`ST`, la
separación raw production/evaluación, las señales de Dynamic States y la
agregación Q→temporada. ADR-073 cierra posteriormente la matemática, samplers,
precisión y streams; DR-055 queda `PARTIAL_CALIBRATION` por valores, targets,
goldens y producers de DR-021/022/057. Los facts ya quedaron cerrados por
DR-063/ADR-010.

ADR-057 cerró la separación del estado de salud, disponibilidad médica,
exposición/carga, episodio persistente, recuperación agregada, relación de
recaída, condiciones concurrentes y frontera de secuelas con Development.
ADR-074 cierra después hazard, distribuciones, dominios, precisión, orden,
streams y asignación médica. DR-057 queda `PARTIAL_CALIBRATION` por valores,
targets, goldens, producers y catálogo de seis definitions.

ADR-022 cerró definitions frente a state, Club/League/Competition/World State,
owners de táctica/competencia/calendario, contribución frente a support field,
correlación de outcomes, jerarquía de shocks e IJL separado. DR-022 permanece
`PARTIAL_CALIBRATION`: ADR-075 cierra matemática, escalas, precisión, streams y
samplers; faltan values/data/targets/goldens. DR-021 conserva calendario y
DR-065 scope/movilidad.

ADR-058 cerró el pipeline de mercado, percepción observer-specific, need/fit,
Money exacto, contrato/expectativa, acuerdos separados, afiliación dual, loans,
free transfers e historia multiclub. ADR-076 cierra posteriormente valoración,
need/fit, interest/offer, dinero, seller, contrato, renewal/loan, negociación,
samplers, precisión y streams. DR-058 queda `PARTIAL_CALIBRATION` por values,
data, targets y goldens. DR-027 conserva moneda/calibración; DR-065 scope
externo; DR-066 elegibilidad; DR-067 cursor mid-season.

ADR-059 cerró estado/contexto propios de National Team, eligibility separada,
`SelectionCompetitionField`, pipeline, evidence boundary, rol/minutos/
Performance internacionales separados y support field colectivo. DR-059
permanece `BLOCKER_G3` por matemática, precisión, streams, parámetros, fixtures
y calendario/cursor. DR-068 conserva nacionalidad deportiva y transiciones de
eligibility.

ADR-060 cerró Definition frente a edición, familias de evaluación, fields
comparativo/estadístico, evidence policy, evaluación posicional, outcome
ordinal, judging agregado, múltiples premios y frontera con Scoring/Records.
DR-060 permanece `BLOCKER_G3` por matemática, precisión, streams, parámetros,
catálogo y fixtures. DR-049 ya fija posición dominante; DR-055/063 conservan
las métricas/facts GK.

ADR-061 cerró separación Sporting/Public Reputation, awareness/sentiment,
Public Attention, followers/engagement, mercados data-driven, evidence keys y
shocks compartidos. ADR-078 cierra dominios, matemática, precisión,
correlaciones, streams y fixtures requeridos. DR-061 queda
`PARTIAL_CALIBRATION` por values, market/reach data, evidencia, goldens y
targets.

ADR-062 cerró `PlayerPlayingStatus` separado de `CareerStatus`, motivation
derivada, causes de retiro, ausencia de thresholds, episodios y comeback.
ADR-079 cierra hazard/outcomes, cursor, streams y finalización. DR-062 queda
`PARTIAL_CALIBRATION` por values/targets/goldens y DR-069 queda resuelta.

Para cada distribución se debe elegir familia, parametrización, correlación, stream, precisión y parámetros iniciales; no basta con aprobar el nombre de una variable.

### 26.2 `BALANCE_LATER`

Pueden recalibrarse después de tener una primera versión ejecutable, siempre mediante la versión participante y sin cambiar silenciosamente carreras:

- valores de coeficientes y dispersiones;
- priors por edad/posición/rol;
- velocidades de reversión y persistencia;
- targets de minutos y producción;
- frecuencias/severidades, recuperación, recaída, secuela, fitness/fatigue y
  carga de Health;
- intensidades de mercado, selección, premios y retiro;
- elasticidades de reputación/seguidores;
- curvas y bandas de valor;
- pesos, IJL, percentiles y etiquetas narrativas de scoring;
- tolerancias Monte Carlo y alertas de balance.

G3B todavía necesita un conjunto inicial aprobado. “Balance later” significa que esos valores son recalibrables, no que pueden quedar ausentes o hardcodearse sin decisión.

### 26.3 `CONTENT_LATER`

Pertenecen a catálogos/releases y no a fórmulas universales:

- definiciones concretas de las seis lesiones del slice;
- taxonomía editorial de roles tácticos y compatibilidad posicional;
- clubes, ligas, competiciones, premios y fuentes;
- necesidades tácticas/posicionales por club;
- textos visibles y bandas de estimación;
- eventos que alteran motivación, personalidad, salud, mercado o retiro;
- definiciones regionales para reputación;
- cadenas narrativas y presentaciones sensibles;
- valores de premios/jerarquías que correspondan a `dataVersion`/`scoringVersion`.

El contenido puede parametrizar una regla aprobada, pero no ejecutar código arbitrario ni crear ScoreLedger.

## 27. Gate histórico de entrada a G3B

G3A queda documentalmente completa cuando:

1. esta especificación está aprobada;
2. DR-052 está resuelta y DR-053 a DR-069 tienen resolución o se reasignan
   formalmente sin dejar huecos;
3. DR-008 integra ecuaciones, distribuciones, parámetros iniciales, streams, precisión e invariantes;
4. DR-010 integra las diez filas `PARTIAL`, registry inicial, caps y fixtures;
5. DR-021/022/065/066/067/068/069, DR-048/049, DR-025 y los puntos de DR-027 necesarios para el slice están cerrados;
6. el catálogo canónico de facts está aprobado y las estadísticas `GK`, `CM`
   y `ST` necesarias para SC-07 están matemáticamente cerradas;
7. diseñadores aprueban targets/tolerancias de Monte Carlo;
8. cada regla que modifica resultados identifica `engineVersion`, `dataVersion`, `contentVersion` o `scoringVersion`;
9. se autoriza explícitamente G3B.

Hasta entonces solo pueden prepararse contratos no semánticos, harnesses y fixtures declarados como no normativos. No se implementa gameplay futbolístico.

## 28. Transición normativa a G3C

G3B cerró la estructura con 26 decisiones `RESOLVED`, 63 `PARTIAL`, catorce
registries calibrables y tres decisiones diferibles. G3C-1 establece las reglas
comunes sin seleccionar fórmulas de gameplay.

### 28.1 Contratos ya cerrados

- capabilities/traits persisten como enteros `0..10000`;
- cálculo interno puede usar binary64 finito;
- normalización `stored / 10000`;
- cuantización de estado `ROUND_HALF_EVEN` en el boundary atómico;
- scoring separado con `ROUND_HALF_UP` y sin RNG;
- primitivas matemáticas únicas y conformance cross-runtime;
- logistic/log-odds, stable softmax, Beta/Logit-Normal,
  Poisson/Negative-Binomial, procesos mean-reverting y hazards como toolbox;
- correlación mediante factores declarados y draws estables;
- `EngineParameterSet` inmutable identificado por RFC-8785/SHA-256;
- `engineVersion + parameterSetHash` sin sexta versión;
- Golden/Property/Monte Carlo como gates diferentes;
- targets segmentables, tail calibration y termination diagnostics sin caps.

### 28.2 Trabajo pendiente

La matriz completa de
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md)
asigna:

- G3C-2: B02–B06 y N02–N04;
- G3C-3: C02–C06 y F03;
- G3C-4: D02–D09;
- G3C-5: E02, E03 y E05–E07;
- G3C-6: F05, F06 y J02–J04;
- G3C-7: G01–G04 y G07;
- G3C-8: H01–H04 e I02–I04;
- G3C-9: K01, K02 y K05;
- G3C-10: L01, L02 y L04;
- G3C-11: M02–M11, M15, M17 y M18.

G3C-12 calibra el sistema integrado. Ninguna fórmula, sampler, coeficiente o
target específico se considera aprobado por esta asignación.

## 29. Cierre matemático G3C-2

G3C-2 fija, sin implementar gameplay:

1. evolución de capabilities en logit seguro y cuantización
   `ROUND_HALF_EVEN`;
2. descomposición auditable
   `maturation + acquired - wear + familyShock + specificShock`;
3. maduración suave jerárquica por familia, sin `peakAge`;
4. acquired development por predictor aditivo y `softplus`, con experiencia
   saturante y entorno normalizado;
5. wear por predictor aditivo y `softplus`, con edad continua, carga, salud,
   secuela y `longevity`;
6. shocks Normal por familia y capability con contexts estables;
7. generación inicial mediante mixture y factores Normal correlacionados;
8. `CreationPowerScore`, target común de poder y tests distributivos
   Quick/Custom;
9. `PositionSuitability` derivada y reconversión logistic/softmax;
10. posición histórica dominante por minutos efectivos y desempate canónico.

Las ocho decisiones asignadas, G3B-B02–B06 y G3B-N02–N04, quedan
`PARTIAL_CALIBRATION`. No queda abierta su familia matemática. Faltan aprobar
valores del `EngineParameterSet`, CDF de Creation, tolerancias, targets con
evidencia y expected outputs completos de goldens.

DR-048 y DR-049 quedan resueltas. DR-045 y DR-053 quedan
`PARTIAL_CALIBRATION`. DR-008 continúa abierta hasta integrar las matemáticas
de G3C-3–G3C-11 y un ParameterSet calibrado. Este cierre no autoriza
implementar Creation/Development mientras falten sus parámetros iniciales y
los contratos cuantitativos upstream que consumen.

## 30. Cierre matemático G3C-3

G3C-3 fija, sin implementar gameplay:

1. `RoleQualitySignal` derivada de `PositionSuitability`, sin Overall;
2. `PositionCompetition` como combinación convexa normalizada;
3. stable softmax de `SportingRole`;
4. persistencia mediante matriz role anterior→candidato;
5. availability por unión exacta de intervalos agregados;
6. minute share Logit-Normal con shocks team-shared/player-specific;
7. `expectedMinutes` mediante
   `LogitNormalMeanGaussHermite10V1`;
8. minutos persistidos con `ROUND_HALF_EVEN`;
9. asignación por competición con softmax/apportionment entero;
10. posición dominante única por Q en el vertical slice;
11. appearances/starts mediante conteos Bernoulli jerárquicos;
12. SeasonId ordinal, Q y `TeamMinutesOpportunity` como boundary agregado;
13. adapters/streams separados para club y selección.

G3B-C04/F03 quedan `RESOLVED_MATH`. G3B-C02/C03/C05/C06 quedan
`PARTIAL_CALIBRATION`; no conservan una familia matemática abierta. DR-064
queda resuelta; DR-054 pasa a `PARTIAL_CALIBRATION`; DR-021 conserva formato y
generación/integración del calendario.

En el snapshot posterior a G3C-3, DR-008 continuaba abierta por cuarenta y nueve
decisiones de G3C-4–G3C-11, valores de ParameterSet y calibración. G3C-4 cierra
ocho en la sección siguiente. Este
cierre no autoriza implementar Role & Minutes hasta aprobar sus parámetros,
targets, goldens y los producers upstream de G3C-5/G3C-6.

## 31. Cierre matemático G3C-4

La especificación normativa es
[`PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md`](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
y su decisión transversal es
[ADR-073](adr/073-performance-production-form-mathematics.md).

G3C-4 fija:

1. capabilities transformadas mediante logit seguro y features task-specific;
2. trece task abilities para `ST`, `CM` y `GK`, sin Overall;
3. Underlying Performance multidimensional en espacio latente;
4. shocks Normal common/domain/specific/pressure;
5. consistency como control exponencial de dispersión;
6. pressure response condicionado por exposición;
7. evidence `-expm1(-minutes/tau)` y surprise multidimensional;
8. producción ST mediante opportunity/chance/conversion y NB2;
9. producción CM mediante cuatro impactos y counts NB2;
10. producción GK mediante shots NB2, saves Binomial, goals conceded por
    identidad y clean sheets derivadas;
11. samplers Poisson/NB2/Binomial inverse-CDF en log-space;
12. Form AR(1) mean-reverting en logit;
13. señales exactas hacia confidence/managerTrust/morale;
14. summaries por peso `minutes×evidence`, sums exactos y splits;
15. streams separados para Performance y Form.

G3B-D02–D09 quedan `PARTIAL_CALIBRATION`; ninguna conserva ecuación, familia de
distribución o sampler abierto. En el snapshot posterior a G3C-4 se acumulan veinte filas
`PARTIAL_CALIBRATION`, dos `RESOLVED_MATH` y cuarenta y una `PARTIAL` asignadas
a G3C-5–G3C-11.

DR-055 pasa a `PARTIAL_CALIBRATION`. La parte de Form de DR-056 queda
matemáticamente cerrada; confidence, morale, managerTrust e incumbency
conservan ownership y dinámica propia. DR-057/059/060/061 y DR-010 no se
cierran.

DR-008 continúa abierta por G3C-5–G3C-11, valores del ParameterSet, targets,
goldens y calibración integrada. No se autoriza implementar Performance oficial
hasta recibir adapters de Health G3C-5, context producers G3C-6 y aprobar
`EngineParameterSet.performance`.

## 32. Cierre matemático G3C-5

La especificación normativa es
[`HEALTH_INJURY_RECOVERY_MATH_SPEC.md`](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)
y su decisión transversal es
[ADR-074](adr/074-health-injury-recovery-mathematics.md).

G3C-5 fija:

1. dose rates separadas para exposición competitiva y training;
2. load acotada con memorias EWMA acute/chronic;
3. desviación de carga estable sin ratio crudo;
4. fatigue y fitness como dos AR(1) independientes en logit;
5. composición de burden por complemento multiplicativo;
6. competing cumulative hazards por `InjuryFamily × origin`;
7. counts Poisson y marks categóricos sin caps;
8. severity logistic-Normal;
9. recovery requirement LogNormal en unidades de trabajo;
10. progress positivo por `recoveryOpportunity×softplus(predictor+shock)`;
11. readiness continuo e intervalos médicos prefix por competition;
12. relapse Poisson con parent causal y memoria exponencial;
13. sequela logistic/Bernoulli, burden logistic-Normal y decay temporal;
14. signals acotadas hacia Performance, Development y Retirement;
15. streams/model IDs y orden causal independientes.

G3B-E02/E03/E05–E07 quedan `PARTIAL_CALIBRATION`; ninguna conserva ecuación,
familia o sampler abierto. G3C acumula ahora veinticinco filas
`PARTIAL_CALIBRATION`, dos `RESOLVED_MATH` y treinta y seis `PARTIAL`
asignadas a G3C-6–G3C-11.

DR-057 pasa a `PARTIAL_CALIBRATION`. DR-042, DR-053, DR-054, DR-055 y DR-063
conservan orden y ownership. DR-062 solo recibe summaries; su hazard no se
cierra. G3B-E04 conserva las seis definitions como decisión data/content.

DR-008 continúa abierta por G3C-6–G3C-11, valores del ParameterSet, targets,
goldens y calibración integrada. No se autoriza implementar Health hasta
publicar `EngineParameterSet.health`, el catálogo del slice, producers G3C-6,
schemas DR-063 y evidencia de calibración.

## 33. Cierre matemático G3C-6

La especificación normativa es
[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
y su decisión transversal es
[ADR-075](adr/075-club-competition-world-mathematics.md).

G3C-6 fija:

1. state units `0..10000`, logit seguro y `ROUND_HALF_EVEN`;
2. AR(1) separados para attack/defense/control, prestige, finance, stability,
   institutional qualities y league strength;
3. hierarchy Normal global/regional/league/club-season/competition/residual;
4. world cycles continuos AR(1) para football, economy y talent/development;
5. manager turnover por cumulative hazard y generación correlacionada;
6. TacticalIdentity, TacticalFit y PositionCompetition ejecutables;
7. phase graph por Q, match equivalents y TeamMinutesOpportunity enteros;
8. progression checkpoints knockout dentro de `CONSEQUENCES(Qn)`;
9. schedule difficulty, congestion, pressure, training y recovery contexts;
10. TeamSupportField sin protagonista y PlayerCompetitiveContribution
    segmentada;
11. league noisy utility/canonical rank;
12. cup/continental logistic advancement con Bernoulli normativo;
13. outcome memory y world update atómico desde snapshot previo;
14. LeagueCompetitiveStrength dinámica y separada de IJL;
15. rank→MobilityTransitionRequest sin aplicar la policy de DR-065.

G3B-F05/F06/J02–J04 quedan `PARTIAL_CALIBRATION`; ninguna conserva ecuación,
familia o sampler abierto. G3C acumula treinta filas
`PARTIAL_CALIBRATION`, dos `RESOLVED_MATH` y treinta y una `PARTIAL`
asignadas a G3C-7–G3C-11.

DR-022 pasa a `PARTIAL_CALIBRATION`. DR-021 queda parcialmente resuelta para
club calendar/progression, pero conserva fecha/label, extrapolación,
international calendar y Market boundaries. DR-065 sigue `BLOCKER_G3`: no se
acepta pool, materialización o continuidad por inferencia.

DR-008 continúa abierta por G3C-7–G3C-11, values de ParameterSet, data/policies,
targets, goldens y calibración integrada. No se autoriza implementar
Club/Competitions/World oficial hasta cerrar esos gates.

## 34. Cierre matemático G3C-7

La especificación normativa es
[`TRANSFER_MARKET_CONTRACT_MATH_SPEC.md`](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
y su decisión transversal es
[ADR-076](adr/076-transfer-market-contract-mathematics.md).

G3C-7 fija:

1. field de candidatos por enumeración canónica del scope autorizado;
2. `ClubNeed` logistic-Normal y `PlayerClubFit` derivado;
3. proyección determinista de expected opportunity desde Role/Minutes;
4. transición persistente de Interest y Offer con logistic/Bernoulli;
5. `BidderCompetitionField` agregado y financial feasibility suave;
6. age value/contract leverage/scarcity sin thresholds;
7. valuation observer-specific, `MarketReferenceValue` robusta y money
   quantization exacta;
8. fee/salary positivos y separados en log-space, con free-transfer fee cero;
9. seller reservation/response y proposal contractual posterior;
10. stable softmax para operation, ContractExpectation y duration;
11. renewal y loan sin perder contract holder;
12. negociación agregada single-stage y decisión controlada sin RNG;
13. checkpoint `WAITING_DECISION` con términos y random-progress congelados;
14. factores/streams market/region/club/specific sin dependencia de orden;
15. invariantes, golden vectors, targets y suites Monte Carlo.

G3B-G01–G04/G07 quedan `PARTIAL_CALIBRATION`; ninguna conserva ecuación,
familia o sampler abierto. G3C acumula treinta y cinco filas
`PARTIAL_CALIBRATION`, dos `RESOLVED_MATH` y veintiséis `PARTIAL` asignadas a
G3C-8–G3C-11.

DR-058 pasa a `PARTIAL_CALIBRATION`. DR-027 conserva currency/conversion/range;
DR-065, scope y continuidad externos; DR-066, registration; y DR-067, cursor y
boundary mid-season. No se cerró ninguna por inferencia.

DR-008 continúa abierta por G3C-8–G3C-11, values de ParameterSet, data/policies,
targets, goldens y calibración integrada. No se autoriza implementar
Transfers/Market/Contracts oficial hasta cerrar esos gates.

## 35. Cierre matemático G3C-8

La especificación normativa es
[`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](NATIONAL_TEAM_AWARDS_MATH_SPEC.md) y su
decisión transversal es
[ADR-077](adr/077-national-team-awards-mathematics.md).

G3C-8 fija:

1. eligibility lógica anterior a todo draw;
2. candidate merit purpose-scoped sin MarketValue/CareerScore;
3. `SelectionCompetitionField` Gaussian core/elite con moments exactos;
4. logistic/Bernoulli de call-up y squad;
5. incumbency AR(1) logit con memoria no garantizada;
6. adapter internacional de softmax/Logit-Normal/GH10 de ADR-072;
7. state/generation nacional AR(1) y support field sin protagonista;
8. group noisy rank y knockout logistic/Bernoulli reutilizados;
9. comparative award field Normal con abstract competitors indexed;
10. statistical count field NB2 sin resamplear la producción del jugador;
11. candidate utility por profile/posición y judging Normal;
12. un único rank ordinal para nomination/shortlist/placement/winner;
13. tie policies canónicas sin RNG;
14. streams separados National Team/Awards y facts canónicos sin aliases;
15. invariantes, golden vectors, targets y suites Monte Carlo.

G3B-H01–H04/I02–I04 quedan `PARTIAL_CALIBRATION`; ninguna conserva ecuación,
familia, sampler o tie algorithm abierto. G3C acumula cuarenta y dos filas
`PARTIAL_CALIBRATION`, dos `RESOLVED_MATH` y diecinueve `PARTIAL` asignadas a
G3C-9–G3C-11.

DR-059/060 pasan a `PARTIAL_CALIBRATION`. DR-021 conserva calendar/cursor;
DR-025, Definitions/data; DR-068, nationality/eligibility. DR-049 está
resuelta y DR-055 conserva solo métricas GK opcionales. DR-061, reputación
downstream; DR-010, scoring/anti-duplication. Ninguna se cerró por inferencia.

DR-008 continúa abierta por G3C-9–G3C-11, values del ParameterSet,
Definitions/evidencia, targets, goldens y calibración integrada. No se autoriza
implementar National Team/Awards oficial hasta cerrar esos gates.

## 36. Cierre matemático G3C-9

La especificación normativa es
[`REPUTATION_SOCIAL_MATH_SPEC.md`](REPUTATION_SOCIAL_MATH_SPEC.md) y su decisión
es [ADR-078](adr/078-reputation-public-attention-social-mathematics.md).

G3C-9 fija:

1. Sporting standing/evidence y awareness/attention/engagement en `0..10000`;
2. sentiment signed `-10000..10000` y followers exactos `uint64`;
3. AR(1) logit separado para estados acumulativos/públicos;
4. impulses feature-based con evidence gating y profiles autorizados;
5. deduplicación por `EvidenceKey`, watermark y suma pairwise canónica;
6. evidence memory exponencial total/por source family;
7. difusión regional lagged de un paso y global derivado;
8. attention components por decay family con persistencia menor;
9. acquisition/churn `softplus` en log-space y viral Bernoulli+magnitude;
10. engagement separado con scale effect suave;
11. batches atómicos en `CONSEQUENCES(Qn)` y `SEASON_CLOSE` sin fase nueva;
12. snapshot lagged para Market/Selection/Awards y cero feedback actual;
13. StandardNormal/Binomial samplers y stream hierarchy aislada;
14. ParameterSet completo, invariants, targets, tails, goldens y Monte Carlo.

G3B-K01/K02/K05 quedan `PARTIAL_CALIBRATION`; ninguna conserva ecuación,
sampler, quantization, ordering o stream abierto. G3C acumula cuarenta y cinco
filas `PARTIAL_CALIBRATION`, dos `RESOLVED_MATH` y dieciséis `PARTIAL`
asignadas a G3C-10/G3C-11.

DR-061 pasa a `PARTIAL_CALIBRATION`. DR-025 conserva mercados/reach/data;
DR-062/069 conservan Retirement/Comeback/finalization y DR-010 la matemática
de Scoring. DR-008 continúa abierta por G3C-10/G3C-11, values, Definitions,
evidencia, targets, goldens y calibración integrada. No se autoriza implementar
Reputation/Social oficial hasta cerrar esos gates.

## 37. Cierre matemático G3C-10

La especificación normativa es
[`RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md`](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
y su decisión transversal es
[ADR-079](adr/079-retirement-comeback-finalization-mathematics.md).

G3C-10 fija:

1. `PlayerPlayingStatus.RETIRED` reversible separado de Career lifecycle;
2. `CareerStatus.RETIRED` reservado a FINALIZING irreversible;
3. suboperaciones Q retirement→comeback→finalization y post-retirement cursor;
4. Motivation sigmoid, fulfillment, age sigmoid suave y decline EWMA;
5. retirement competing risks con hazard integrado, Bernoulli y categorical;
6. opportunities congeladas, WAITING_DECISION y user choice sin RNG;
7. manual retirement sin forced retirement, threshold, edad máxima o cooldown;
8. comeback eligibility/hazard y rutas willingness/Market Offer;
9. multiple cycles, counters/episodes y affiliation/registration separados;
10. continuation viability y FinalizationOpportunity sin threshold;
11. `CareerFinalizationConfirmed` como closed fact frontier;
12. pipeline final idempotente hacia ScoreSnapshot/integrity/profile/COMPLETED;
13. automation policy/right-censoring fuera de mechanics competitivas;
14. ParameterSet, streams, invariants, targets, tails, goldens y Monte Carlo.

G3B-L01 queda `RESOLVED_MATH`; L02/L04 quedan `PARTIAL_CALIBRATION`. G3C
acumula tres `RESOLVED_MATH`, cuarenta y siete `PARTIAL_CALIBRATION` y trece
`PARTIAL` asignadas a G3C-11. DR-062 pasa a `PARTIAL_CALIBRATION`; DR-069 queda
resuelta. DR-008 continúa por Scoring, values, Definitions, evidencia, goldens
y calibración integrada. No se autoriza implementar Retirement/Finalization
antes de G3C-11 y los gates aplicables.

## 38. Cierre matemático G3C-11

La especificación normativa es
[`SCORING_MATH_SPEC.md`](SCORING_MATH_SPEC.md) y la decisión transversal es
[ADR-080](adr/080-exact-scoring-mathematics.md).

G3C-11 fija:

1. Scoring puro y sin RNG sobre facts cerrados;
2. racionales exactos canónicos y `ROUND_HALF_UP` una vez por cálculo lógico;
3. transforms exactos auditados y tablas verificadas para potencias aprobadas;
4. `ScoringConfiguration`/`ScoringCalibrationData` inmutables, fuera del
   `EngineParameterSet` y fijados por `scoringVersion`;
5. cohortes CDF mid-rank con shrinkage jerárquico racional;
6. PRI `450/120/230/120/80` por profiles GK/CM/ST y segmentos reales;
7. factor de liga `(2500+75*IJL)/10000`, con IJL separado de gameplay;
8. CC por competition edition, evidence-weighted y cuantizado `[0,1.10]`;
9. PTC/PSN por base × outcome × CC y PPI por equivalence groups;
10. PRL por entitlement/delta y PBR por social/historic subcaps;
11. `priorSportingPoints=PRI+PTC_CLUB+PPI+PSN` y orden exacto de caps;
12. ledger append-only/idempotente, corrections/reversals y recompute exacto;
13. ScoreSnapshot final, compatibility key conservadora y tiers derivados;
14. invariants, calibration targets, tails y golden-vector requirements.

Las 63 decisiones asignadas a G3C quedan: cinco `RESOLVED_MATH`, cincuenta y
una `PARTIAL_CALIBRATION`, siete `DATA_REQUIRED` y cero sin familia
matemática. DR-010 queda `RESOLVED_MATH`; DR-008 conserva values, data,
Definitions, expected goldens, Monte Carlo, schemas e implementación.

No se autoriza implementar Scoring hasta publicar el bundle inicial completo.

## 39. G3D-1 — Calibration Registry & Dataset Contracts

G3D-1 transforma los manifests matemáticos de G3C en cuatro registros
normativos, sin asignar valores ni implementar modelos:

| Registro | Cobertura G3D-1 |
|---|---:|
| [Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md) | 268 parameter-path templates canónicos, sin duplicados |
| [Target Registry](CALIBRATION_TARGET_REGISTRY.md) | 186 métricas canónicas |
| [Dataset Registry](CALIBRATION_DATASET_REGISTRY.md) | 40 datasets/catálogos planificados |
| [Golden Registry](GOLDEN_VECTOR_REGISTRY.md) | 139 golden requirements `SPECIFIED` |

Los paths parametrizados se expanden sobre catálogos versionados; ninguna
ausencia equivale a cero. Las filas calibrables permanecen `UNASSIGNED`. Las
identidades matemáticas ya aprobadas quedan `PROVISIONAL_DESIGN`, no
`FROZEN_V1`.

**Corrección de cardinalidad G3D-4F/4G:** la cifra histórica 275 fue un error de
prosa/recuento. El registry normativo contiene exactamente 268 templates
únicos; no faltan siete parameter paths y no se crea ninguno para cuadrar la
cifra.

### 39.1 Runtime y publicación

El runtime futuro recibe un `EngineParameterSet` completo y validado. No lee el
Parameter Registry durante una resolución de gameplay ni obtiene valores desde
datasets en caliente. El publication pipeline produce el payload inmutable:

```text
registries + datasets/transforms + candidates + acceptance report
  -> EngineParameterSet bytes
  -> RFC-8785
  -> SHA-256 parameterSetHash
  -> catalog binding to one engineVersion
```

Scoring usa otro pipeline y otro loader:

```text
Scoring catalogs/cohorts + acceptance report
  -> ScoringConfiguration hash
  + ScoringCalibrationData hash
  -> one scoringVersion
```

No se agrega `parameterVersion`; no se permite una misma `engineVersion`
oficial con dos hashes ni una misma `scoringVersion` con dos bundles.

### 39.2 Dependencias y tuning

La calibración sigue el orden causal Creation→Development→Role/Minutes→
Performance→Health→Club/World→Market→National/Awards→Reputation/Social→
Retirement→Scoring→end-to-end. Un parámetro downstream no compensa un error
upstream. Los candidatos son append-only, declaran paths cambiados/rationale y
se comparan con el mismo `CalibrationSeedSet`.

### 39.3 Gates

La publicación V1 exige siete gates: mathematical validity, subsystem targets,
cross-system, tails, end-to-end Careers, scoring/tiers y replay/goldens. Un
dataset no es válido sin license/provenance/hash/mappings; un golden esperado
no es válido si solo lo calculó la misma implementación que valida.

### 39.4 Boundary de implementación

Schemas, primitives, samplers normativos, canonicalization/hash, registry
validators, golden harness y un skeleton Monte Carlo pueden implementarse en
una fase futura con autorización explícita. Gameplay con valores no publicados,
Scoring competitivo, outcomes del slice y leaderboard permanecen bloqueados.

## 40. G3D-2 — Catálogo del vertical slice y data bindings

G3D-2 no modifica el motor matemático. Fija qué artifacts deben resolver los
inputs de sus ecuaciones antes de asignar valores:

- baseline manifest de Argentina/España y ocho clubes reales detallados por
  liga;
- Competition/Calendar/MarketWindow/Registration catalogs;
- club baselines, external hybrid pool y world fields;
- native monetary observations más purchasing-power context derivado;
- position, injury, national-team y award catalogs;
- gameplay/scoring catalog separation y hashes.

Un resolver futuro nunca consulta fuentes externas. Consume únicamente una
release `dataVersion` validada y los hashes incluidos en Career. Si falta una
Definition o policy requerida, falla con `PENDING_DATA`/error tipado antes de
consumir RNG; no inserta defaults.

ADR-081 cierra el pool híbrido y ADR-082 la nacionalidad deportiva Argentina
V1. DR-066/067 fijan para el slice registration y movimientos efectivos en la
fase `MARKET` post-season; mid-season no forma parte de V1. Todas estas policies
continúan bloqueadas en ejecución hasta publicar contenido real, parameters y
goldens.
