# Reputation, Social & Retirement — especificación estructural

- Estado: **estructura normativa; Reputation/Social refinado en G3C-9 y Retirement/Comeback/Finalization en G3C-10**
- Fecha: 2026-07-28
- Alcance: reputación deportiva, reputación pública, audiencia social, retiro
  deportivo, regreso y frontera de finalización
- No autoriza: implementación de gameplay, valores de parámetros, scoring,
  sponsors ni cierre automático de una Career
- Decisiones relacionadas: DR-008, DR-010, DR-016, DR-017, DR-061, DR-062,
  DR-063 y DR-069
- ADR: [ADR-061](adr/061-reputation-and-social-model.md),
  [ADR-062](adr/062-playing-retirement-and-comeback.md),
  [ADR-078](adr/078-reputation-public-attention-social-mathematics.md) y
  [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md)

## 1. Propósito

Este documento cierra la estructura que debe soportar el motor para:

- mantener mérito deportivo percibido y notoriedad pública como estados
  diferentes;
- representar reconocimiento local, contextual y global sin convertir países
  concretos en campos hardcoded;
- actualizar una audiencia entera que puede crecer o caer;
- separar audiencia, engagement y atención reciente;
- resolver retiro mediante oportunidades y hazards causales sin edad máxima;
- permitir más de un retiro y un regreso dentro de una misma Career;
- mantener separado el retiro deportivo del lifecycle terminal del run.

La estructura de Reputation/Social queda refinada por
[`REPUTATION_SOCIAL_MATH_SPEC.md`](REPUTATION_SOCIAL_MATH_SPEC.md), que selecciona
ecuaciones, samplers, escalas, precisión y ParameterSet sin asignar values.
Retirement/Comeback conserva calibración pendiente; su matemática, cursor y
finalización quedan cerrados por G3C-10/ADR-079. DR-069 está resuelta.

## 2. Fuentes y precedencia

Se aplican:

- `MASTER_SPEC` v0.8, en especial §§14, 16.3, 19, 20, 21, 34.1, 34.5, 36,
  38 y los catálogos de eventos;
- ADR-003/004 para probabilidad positiva, imposibilidad y transiciones causales;
- ADR-005/043 para oportunidades, cantidad no limitada y ventanas causales;
- ADR-006/007 para streams, canonicalización e identidad determinista;
- ADR-013 para interrupción, cursor, checkpoints y reanudación;
- ADR-016 para el lifecycle de Career, aclarado por ADR-062;
- ADR-017 para descubrimientos y procedencia;
- ADR-061/062 para las fronteras estructurales de este bloque.

Existe una tensión normativa real:

- `MASTER_SPEC` §19.4 dice que el MVP termina con retiro y resumen;
- `MASTER_SPEC` §16.3 y su catálogo mítico permiten regresar del retiro;
- ADR-016 usa `RETIRED` dentro de `CareerStatus` y no admite
  `RETIRED -> ACTIVE`;
- el Bloque 9 exige que un retiro deportivo pueda revertirse mientras la
  Career siga abierta.

La separación de estados se resuelve aquí. El momento que vuelve irreversible
la carrera deportiva y habilita finalización queda en
[DR-069](DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso).

## 3. Principios e invariantes

1. `SportingReputation`, `PublicReputation`, `FollowerCount` y `Engagement` no
   son aliases.
2. Ninguno es capability, trait, Performance, MarketValue, CareerScore ni
   `ClubState.prestige`.
3. La reputación describe percepción acumulada; no sustituye el estado verdadero
   del jugador.
4. `PublicAttention` describe exposición reciente; no es reputación estable.
5. Los estados pueden subir o bajar. Un logro no crea un floor permanente.
6. El estado global es una proyección de estados regionales identificados; no
   borra procedencia.
7. Followers se persiste como entero exacto no negativo. No usa floating point.
8. Un mismo hecho causal entra una sola vez por una `EvidenceKey` estable.
9. Un módulo productor emite un fact deportivo, público o narrativo autorizado;
   no escribe directamente reputación ni followers.
10. Content no puede aplicar `followers += X` ni `reputation += X` como atajo
    arbitrario. Debe emitir un hecho o señal autorizada que el owner evalúe.
11. Social no modifica capabilities. Cualquier efecto en presión, mercado,
    eventos o sponsors usa un contrato explícito posterior.
12. No existe edad máxima, threshold de retiro, cooldown, cupo de retiros o
    espera fija para regresar.
13. No tener club no equivale a retiro.
14. Una lesión no cambia por sí sola el estado deportivo a `RETIRED`.
15. El retiro deportivo no crea puntos ni completa automáticamente la Career.
16. La misma Career puede contener varios episodios retiro→regreso.
17. Solo una Career `COMPLETED`, íntegra y competitivamente elegible puede
    habilitar ranking oficial.

## 4. Ownership

| Concepto | Owner | Restricción |
|---|---|---|
| `SportingReputationState` | Reputation | Consume evidencia cerrada; no calcula Performance |
| `PublicReputationState` | Reputation | No es una copia de sporting reputation |
| `PublicAttentionState` | Reputation/Social | Ventana reciente y shocks; no historial deportivo |
| `AudienceState` | Social | Followers y engagement; no capability |
| `ReputationMarketDefinition` | data-football / `dataVersion` | Definición estática, no estado de Career |
| estado regional de reputación/audiencia | Career / Reputation-Social | Futuro ficticio versionado |
| señales de atención | módulos productores | No contienen deltas mecánicos finales |
| `PlayerPlayingStatus` | Retirement | Separado de Career y contratos |
| hazard, decisión y outcome de retiro | Retirement | Health/Market solo entregan inputs |
| `CareerStatus` y finalización | Career/Application | Se rige por ADR-016 y DR-069 |
| ScoreLedger y PBR | Scoring | No son escritos por este bloque |

`domain` posee estructuras, estados, facts e invariantes. `engine` orquesta
resoluciones puras contra parámetros y streams versionados. `scoring` consume
después únicamente facts incluidos en el allowlist de
ADR-010/`SCORING_FACTS_SPEC.md`.

## 5. Modelo de reputación

### 5.1 `ReputationState`

El estado conceptual del jugador contiene:

```text
ReputationState
  sporting: SportingReputationState
  public: PublicReputationState
  attention: PublicAttentionState
```

No existe `fameOverall`. Cada componente conserva:

- scopes regionales/mercados identificados;
- punto de simulación de vigencia;
- referencias a señales/evidence keys aplicadas;
- memoria mínima necesaria para la dinámica elegida;
- parameter set y versiones participantes.

G3C-9 fija standing/evidence `0..10000`, memoria exponencial por source family,
watermark/fact ledger para deduplicación y cuantización `ROUND_HALF_EVEN`.

### 5.2 `SportingReputationState`

`SportingReputation` es la percepción acumulada de relevancia y standing
deportivo del jugador. No es su calidad verdadera.

Cada scope regional debe poder representar al menos:

- `standing`: estimación acumulada de reputación deportiva;
- `evidenceStrength`: fuerza/volumen de la evidencia que sostiene esa
  estimación;
- `sourceMemory`: suficientes estadísticos por familia de fuente para aplicar
  memoria sin duplicación;
- `lastUpdatedAt`: punto de tiempo de dominio, nunca reloj de sistema.

Familias de señal permitidas conceptualmente:

- Performance y producción cerradas, con exposición/evidencia;
- contexto de club, liga y competición;
- outcomes, títulos y qualification;
- Performance y logros de selección;
- premios;
- historia deportiva ya confirmada.

No son inputs directos:

- `TrueCapabilities`, traits ocultos o potential;
- `PublicReputation` como mérito;
- `FollowerCount`;
- MarketValue, fee o salary;
- CareerScore o ScoreLedger;
- prestigio del club copiado al jugador.

Una señal colectiva o individual se referencia una vez. Si un título ya entró
como logro, no vuelve a entrar mediante un rating, summary y reputación que sean
aliases del mismo hecho.

### 5.3 Memoria deportiva

La actualización futura seguirá:

```text
authorized sporting facts
-> purpose-scoped ReputationSignal
-> deduplication by EvidenceKey
-> memory/update model
-> SportingReputationState
```

La estructura debe soportar persistencia, recencia, regresión y shocks, pero no
selecciona la ecuación. El owner confirma una sola transición por boundary.

La reputación puede decaer. Un premio, título, selección o club previo queda en
la historia, pero no crea un mínimo perpetuo para el estado actual.

### 5.4 `PublicReputationState`

`PublicReputation` representa percepción mediática/pública. Se compone
estructuralmente de:

- `awareness`: notoriedad establecida dentro de un mercado;
- `sentiment`: valoración pública, capaz de distinguir favorable, neutral,
  dividida o desfavorable sin reducirse a una etiqueta binaria.

`reach` es una proyección del patrón de awareness entre mercados y de la
audiencia observable; no se persiste como un tercer estado causal duplicado.
`salience` o hype reciente pertenece a `PublicAttentionState`.

Esto permite:

- gran reputación deportiva con awareness baja;
- awareness alta con standing deportivo modesto;
- audiencia grande con sentimiento mixto o adverso;
- fama local fuerte y alcance global bajo;
- atención viral alta con reputación acumulada todavía baja.

Awareness persiste en `0..10000`; sentiment, en `-10000..10000`. Ambas usan
estado logit separado y `ROUND_HALF_EVEN`. Las categorías visibles siguen
siendo proyecciones, no el estado canónico.

### 5.5 Inputs públicos

Public Reputation puede consumir señales de:

- Sporting Reputation, como una ruta explícita y no obligatoria;
- alcance/prestigio del club y contexto mundial;
- selección y torneos;
- premios;
- transferencias confirmadas;
- facts de Performance públicamente relevantes;
- eventos y decisiones públicas;
- atención mediática/social.

No consume capabilities ni convierte goles en fama mediante un mapping directo.
Una misma causa pública comparte `causalSignalId` con sus efectos sociales para
evitar sortear y contabilizar shocks incompatibles.

## 6. Regiones, mercados y vista global

### 6.1 `ReputationMarketDefinition`

Los mercados se definen en datos versionados, no en enums del engine:

```text
ReputationMarketDefinition
  marketId
  parentMarketIds / relatedMarketIds
  geographicOrAudienceScope
  diffusionMetadata
  dataVersion
```

La topología debe admitir países, regiones deportivas, mercados mediáticos o
agregados futuros. Los pesos y reglas de difusión son parámetros/datos
versionados.

### 6.2 Scopes requeridos por el slice

Para el vertical slice debe poder resolverse:

- `homeMarketId`, derivado de la biografía aprobada;
- `currentFootballMarketId`, derivado del contexto vigente de club/liga;
- una vista `GLOBAL`, derivada de los mercados persistidos.

Argentina y España requieren definiciones de mercado en el catálogo del slice,
pero el motor no hardcodea exactamente tres regiones. Si home y current market
coinciden, la evidencia no se duplica.

Los IDs, jerarquía, fuentes y pesos concretos pertenecen a DR-025/061 y
`dataVersion`.

### 6.3 Proyección global

La vista global:

- se deriva de estados regionales y del grafo versionado;
- conserva las contribuciones y procedencias regionales;
- no es un contador independiente actualizado en paralelo;
- no garantiza que una señal local se difunda;
- no impone que un mercado pequeño sea irrelevante.

G3C-9 fija difusión lagged de un paso y proyecciones globales ponderadas. La
topología, los pesos concretos y reach baselines permanecen externalizados en
`dataVersion`/ParameterSet.

## 7. Attention, Social y audiencia

### 7.1 `PublicAttentionSignal`

Los módulos anteriores emiten facts. Reputation/Social los convierte primero en
señales tipadas:

```text
PublicAttentionSignal
  signalId
  sourceFactId
  causeFamily
  markets
  polarity/context
  simulationPoint
  causalSignalId
  versions
```

No contiene `followersDelta` ni `reputationDelta` impuesto por el productor.
El mismo `causalSignalId` permite que reputación pública, followers y engagement
compartan un shock sin convertirse en sorteos independientes.

### 7.2 `PublicAttentionState`

Es un estado o suficiente estadístico de horizonte corto que representa:

- exposición reciente;
- recencia/intensidad;
- mercados alcanzados;
- polaridad/contexto;
- shocks activos identificados.

Tiene regresión/persistencia propia y puede caer aunque Public Reputation se
mantenga. No sustituye la historia acumulada.

### 7.3 `AudienceState`

```text
AudienceState
  followers: FollowerCount
  engagement: EngagementState
  regionalBreakdown?: AudienceByMarket
  lastUpdatedAt
```

`FollowerCount` es un `uint64` exacto no negativo por partición de audiencia no
superpuesta. El total es suma exacta derivada; binary64 solo se usa dentro del
adapter log-space atómico. Overflow produce error tipado, nunca clipping.

`EngagementState` describe intensidad/actividad en `0..10000` y es distinto del
tamaño. Una audiencia pequeña puede tener gran engagement y una audiencia
masiva, engagement bajo.

El breakdown regional de audiencia es autoritativo mediante partitions no
superpuestas; la vista global se reconstruye:

```text
sum(followersByMarket) = total followers
```

o debe existir una política explícita para audiencias superpuestas; no se elige
por inferencia.

### 7.4 Dinámica de followers

La resolución matemática separa:

- adquisición orgánica;
- pérdida/churn;
- shocks positivos o negativos;
- difusión entre mercados;
- corrección/regresión posterior a un pico.

Adquisición y churn se resuelven como tasas realizadas `softplus` con shocks
Normal en `log1p(followers)`; una mixture Bernoulli añade la cola viral. El
entero se cuantiza solo después de la transición estocástica realizada y nunca
se clampa un outlier por criterio editorial.

Debe poder ocurrir:

- crecimiento;
- pérdida;
- cambio neto cero;
- salto viral;
- pérdida fuerte;
- larga estabilidad.

La familia, correlaciones, samplers y streams quedan cerrados por ADR-078; sus
values y targets permanecen en calibración.

### 7.5 Control de feedback

El orden lógico es:

```text
facts confirmados
-> PublicAttentionSignal
-> actualización de PublicAttention
-> actualización de PublicReputation y Audience
-> signals futuros autorizados
```

Una actualización no se realimenta a sí misma dentro del mismo boundary.
Reputation states usan snapshots previos entre sí; Social consume los
candidates nuevos y no vuelve a ejecutar Reputation. Persistence, regression,
scale effects y shocks se parametrizan. No existe hard cap editorial.

## 8. Sponsors y vida comercial

Este bloque solo define una salida futura:

```text
CommercialOpportunityContext
  public reputation
  engagement
  reach by market
  sporting relevance
  club/world context
  evidence and uncertainty
```

No existe sponsor automático por followers ni contrato comercial implementado.
G3B-K07 queda diferida. Cualquier subsistema futuro requiere decisión/ADR y no
puede modificar capabilities, probabilidades deportivas o ScoreLedger sin un
contrato normativo explícito.

## 9. Estado deportivo y lifecycle de Career

### 9.1 Estados ortogonales

Se separan:

```text
CareerStatus
  DRAFT | ACTIVE | WAITING_DECISION | RETIRED |
  COMPLETED | ABANDONED | INVALIDATED

PlayerPlayingStatus
  ACTIVE | RETIRED
```

No se añade un estado persistente `CONSIDERING_RETIREMENT`: una consideración
que exige decisión se representa con `PendingDecision`. `UNATTACHED` pertenece
a afiliación/contrato, no a `PlayerPlayingStatus`.

Combinaciones estructuralmente relevantes:

| `CareerStatus` | `PlayerPlayingStatus` | Semántica |
|---|---|---|
| `ACTIVE` | `ACTIVE` | Carrera abierta y jugador en actividad |
| `ACTIVE` | `RETIRED` | Carrera abierta durante un período posretiro donde puede existir regreso |
| `WAITING_DECISION` | `ACTIVE` | Decisión mecánica durante actividad |
| `WAITING_DECISION` | `RETIRED` | Decisión posretiro, incluida una oportunidad de regreso |
| `RETIRED` | `RETIRED` | Actividad ya declarada irreversiblemente cerrada para esa Career; falta consolidación |
| `COMPLETED` | `RETIRED` | Career cerrada, score final y proyecciones terminales confirmados |

`CareerStatus.RETIRED` no significa “primer retiro deportivo”. Es
exclusivamente la etapa **FINALIZING** pre-`COMPLETED` de ADR-016 y no admite
comeback. ADR-079 fija `CareerFinalizationConfirmed` como el boundary
irreversible que cierra el fact frontier.

### 9.2 `PlayerClubAffiliation`

Un jugador `ACTIVE` puede no tener club:

```text
PlayerClubAffiliation
  ATTACHED
  UNATTACHED
```

`UNATTACHED` significa ausencia de club/contrato deportivo vigente en el
boundary aplicable. No fuerza retiro, transferencia o contrato. Market puede
producir oportunidades futuras si el scope/dataVersion lo permite.

La representación contractual exacta sigue en DR-058/063 y la continuidad fuera
del tier en DR-065.

## 10. Motivación

### 10.1 `CareerMotivationAssessment`

No se crea un segundo trait llamado motivation. Retirement obtiene una
evaluación derivada y contextual:

```text
CareerMotivationAssessment
  playerId
  simulationPoint
  continuationSignal
  evidence/components
  uncertainty
  parameterSet
```

Puede consumir:

- `ambition` como trait persistente;
- morale;
- rol, minutos y Performance recientes;
- éxito, hitos y objetivos pendientes;
- salud y carga;
- estado contractual/mercado;
- contexto personal y hechos narrativos autorizados;
- Reputation/Public Attention como contexto, nunca como destino obligatorio.

La persistencia surge de sus inputs persistentes, historia y estados dinámicos.
El assessment es una snapshot derivada; no se mantiene un duplicado psicológico
con dinámica propia.

No es binario, no garantiza continuidad/retiro y no reemplaza `ambition`.
G3C-10 fija dominio `(0,1)` y predictor logístico parametrizado en
`RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md`.

## 11. Hazard y proceso de retiro

### 11.1 Inputs

Retirement puede consumir snapshots confirmados de:

- edad y punto de carrera;
- capabilities actuales y trayectoria de desarrollo/declive;
- Health burden, episodios, secuelas e historia;
- rol, minutos y oportunidad;
- Performance y evidencia;
- afiliación, contrato y oportunidades de Market;
- `CareerMotivationAssessment`;
- sporting/public reputation;
- achievements y contexto;
- hechos personales/externos autorizados;
- azar determinista.

No consume `CareerScore` para decidir gameplay.

### 11.2 Risks por causa

El modelo debe soportar hazards o componentes distinguibles por causa:

```text
RetirementCause
  VOLUNTARY
  HEALTH
  MARKET
  EXTERNAL
  OTHER
```

La taxonomía es extensible/versionada. No obliga a habilitar todas las causas en
el slice. Cada outcome conserva causa, inputs, oportunidad y referencias.

G3C-10 adopta competing risks log-lineales integrados por intervalo para
`VOLUNTARY|HEALTH|MARKET|OTHER`. `EXTERNAL` solo procede de un fact/policy
allowlisted. Los componentes son auditables y no duplican antecedentes.

### 11.3 Transiciones causales

Estas reglas son normativas:

- edad, bajo rendimiento o pocos minutos modifican distribuciones; nunca fuerzan
  retiro por threshold;
- `UNATTACHED` habilita continuidad sin club y nuevas oportunidades de Market;
- una InjuryEpisode solo aporta burden/restricciones;
- un retiro por salud requiere una resolución propia de Retirement;
- ausencia de oferta no convierte automáticamente una oportunidad concebible en
  probabilidad cero;
- antecedentes materiales pueden generar consideración, decisión, espera,
  cambio de contexto o retiro;
- un outcome externo instantáneo solo puede omitir reflexión si el hecho
  mecánico explícito lo exige y la política sensible conserva equivalencia.

En la ruta normal:

```text
RetirementOpportunity
-> CareerMotivationAssessment / causal inputs
-> RetirementHazardAssessment
-> RetirementDecisionRequested, cuando corresponda
-> WAITING_DECISION
-> RetirementOccurred
-> PlayerPlayingStatus.RETIRED
```

No toda evaluación se persiste como fact. `SCORING_FACTS_SPEC.md` fija qué
queda como fact, summary o internal signal.

### 11.4 Cadencia cerrada por G3C-10

ADR-079 no añade fase top-level. Al inicio de `AVAILABILITY(Qn)` se ejecutan,
en orden, `.lifecycle.retirement`, `.lifecycle.comeback` y
`.lifecycle.finalization`. Cada operación integra el intervalo canónico ya
cerrado; una oportunidad congela payload/resume cursor antes de
`WAITING_DECISION`. Playing `RETIRED` mantiene quarters/seasons, con módulos
on-field lógicamente disabled y sin RNG. G3B-L01 queda `RESOLVED_MATH`.

## 12. Regreso

### 12.1 Modelo

Mientras la Career continúe abierta:

```text
PlayerPlayingStatus.RETIRED
-> ComebackOpportunity
-> eligibility/causal assessment
-> ComebackDecisionRequested, cuando corresponda
-> CareerStatus.WAITING_DECISION
-> decision outcome
-> ComebackOccurred
-> PlayerPlayingStatus.ACTIVE
```

No hay garantía, cooldown ni plazo fijo. Contexto posretiro, edad, Health,
capabilities residuales, reputación, afiliación/Market, motivación, necesidad
de club y hechos externos pueden modificar la oportunidad.

Un comeback:

- no reabre Q o temporadas cerradas;
- no restaura automáticamente club, contrato, rol, posición, fitness o
  RegistrationEligibility;
- requiere antecedentes materiales y contexto deportivo válido;
- no repite decisiones, streams o facts confirmados;
- puede terminar en otra retirada posterior.

### 12.2 Episodios e historia

```text
RetirementEpisode
  retirementEpisodeId
  occurredAt
  cause
  sourceOpportunityId
  decisionId?
  status
  versions

ComebackEpisode
  comebackEpisodeId
  relatedRetirementEpisodeId
  opportunityId
  decisionId?
  occurredAt
  versions
```

Los IDs se derivan de identidad contextual/ordinal determinista, no reloj ni
UUID aleatorio. Cada episodio produce a lo sumo un fact de ocurrencia.

La historia soporta:

```text
ACTIVE -> RETIRED -> ACTIVE -> RETIRED
```

sin duplicar temporada, descubrimiento o ScoreLedger.

## 13. Finalización, ranking y perfil

### 13.1 Lo cerrado

- el primer `RetirementOccurred` no implica `CareerStatus.COMPLETED`;
- `CareerStatus.RETIRED` continúa siendo la etapa irreversible de cierre de
  ADR-016, no cada episodio deportivo;
- una Career abierta puede mantener Reputation/Social mientras el jugador está
  retirado;
- comeback solo es posible antes de `CareerStatus.RETIRED`;
- `COMPLETED` no tiene gameplay pendiente;
- ranking oficial requiere `COMPLETED`, integridad y versión compatible;
- `ABANDONED` e `INVALIDATED` siguen sin ranking;
- Retirement/Reputation/Social nunca escriben ScoreLedger.

### 13.2 Cierre de DR-069

ADR-079 resuelve:

- quarters/seasons continúan mientras Career está abierta y playing retirado;
- comeback deja de ser elegible al confirmar finalización irreversible;
- `FinishCareer` se confirma en un lifecycle-safe boundary;
- `CareerFinalizationConfirmed` cierra facts y entra en
  `CareerStatus.RETIRED`/FINALIZING;
- scoring/consolidación son idempotentes sobre el closed fact set;
- `COMPLETED` solo se confirma al completar artefactos, integridad y
  compatibilidad;
- ranking, best Career, final tier y share card terminal se habilitan después;
- calibration automation y technical guards quedan fuera del gameplay.

No existe edad máxima, forced finalization ni reopening.

### 13.3 Descubrimientos

ADR-017 sigue vigente:

- un descubrimiento se confirma al ocurrir, no al retirarse o completarse;
- un retiro o comeback no revierte discoveries confirmados;
- un episodio nuevo puede confirmar su propio discovery ID una sola vez;
- abandonar conserva descubrimientos previos;
- invalidar revoca su contribución competitiva pública con procedencia.

La consolidación terminal no vuelve a emitir descubrimientos.

## 14. Timing y causalidad

El orden entre módulos permanece:

```text
facts deportivos/públicos cerrados
-> señales Reputation/PublicAttention
-> actualización Reputation/Social
-> inputs futuros de Market/Selection/Awards/Events

estado cerrado del intervalo anterior
-> AVAILABILITY(Qn).lifecycle.retirement/comeback/finalization
-> decisión/interrupción
-> cambio de PlayerPlayingStatus
-> eventual comeback o finalización
```

No se modifica retroactivamente una Q, Performance, premio, transferencia o
audiencia ya cerrados. Si un resultado de premio genera atención, el fact se
confirma en `AWARDS` y la oportunidad narrativa puede evaluarse desde
`AWARD_EVENTS`; la actualización mecánica de reputación/social debe ubicarse en
una suboperación causal aprobada, no dentro del evento por atajo.

ADR-078 ubica batches como suboperaciones versionadas de
`CONSEQUENCES(Qn).reputationSocial` y `SEASON_CLOSE.reputationSocial`. No añade
una fase top-level: el primer batch consume facts cerrados hasta Health de la
Q; el segundo, el remanente posterior a Awards/Events antes del commit de
temporada.

## 15. Interfaces

### 15.1 Reputation consume

| Proveedor | Inputs | Restricción |
|---|---|---|
| Performance | summaries, producción, exposición, presión y evidencia observable | No capabilities/latent true state |
| Club/Competitions | contexto, outcomes, fuerza competitiva, prestigio/reach | No copiar prestigio al jugador |
| Transfers | interés/movimiento confirmado y cambio de contexto | Fee/valor no equivalen a mérito |
| National Team | call-ups, Performance y outcomes internacionales | No duplicar evidencia de club |
| Awards | edition outcomes y `AwardWon` | No usar puntos del premio |
| Events | facts públicos autorizados | No deltas directos |
| History | evidence keys ya aplicadas y suficiente memoria | No volver a contar |

### 15.2 Social consume

- `PublicReputationState`;
- `PublicAttentionSignal/State`;
- reach/prestige del club y world markets;
- selección, awards, transfers y hechos públicos;
- audience state previo;
- parámetros y streams versionados.

### 15.3 Retirement consume

- Player/Development/Aging;
- Health e historia;
- Role & Minutes;
- Performance;
- Contract/Market/Affiliation;
- Reputation/Public Attention;
- Events y decisiones;
- World/club context cuando exista una oportunidad de regreso.

### 15.4 Salidas

Reputation/Social entrega:

- estados regionales y vista global;
- sporting/public reputation autorizada para Market/Selection/Awards;
- Audience/Engagement para Events y futuros Sponsors;
- facts/señales autorizados para Scoring, sin puntos.

Retirement entrega:

- `PlayerPlayingStatus`;
- historia de retiro/regreso;
- facts hacia Events, Market/Contracts, Profile y Scoring;
- solicitud de finalización, no score ni ranking.

### 15.5 Reconciliación Market G3C-7

Market consume únicamente un snapshot purpose-scoped de
`SportingReputationState` normalizado `[0,1]`, con scope/market/evidence refs.
`PublicReputation` no entra por defecto en valuation o sporting interest; solo
puede hacerlo una futura regla explícita para un consumer público/comercial.

Transfers produce facts de interest, offer, negotiation, contract, loan y
movement. Reputation/Social puede transformarlos posteriormente mediante
`EvidenceKey`/`causalSignalId`; fee, salary, MarketValue o prestige no escriben
reputation/followers directamente. G3C-7 no cierra las ecuaciones de DR-061.

## 16. Outputs y clasificación preliminar

G3B Bloque 10 cerró nombres, identidad, clasificación y payload mínimo en
`SCORING_FACTS_SPEC.md`; el schema futuro debe conformarlo.

| Concepto | Clasificación por defecto | Semántica |
|---|---|---|
| `ReputationSignalAccepted` | Traza interna | Evidence key aceptada una vez |
| `SportingReputationUpdated` | Cambio de estado candidato | Reputación deportiva regional/global proyectable |
| `PublicReputationUpdated` | Cambio de estado candidato | Awareness/sentiment actualizados |
| `RegionalReputationUpdated` | No alias por defecto | Solo si tiene consumidor distinto del state update |
| `PublicAttentionGenerated` | Fact/señal candidata | Shock público referenciado a facts fuente |
| `FollowerCountUpdated` | Cambio de estado/fact candidato | Breakdown/total `uint64` anterior-posterior, delta signed decimal canónico y causas |
| `EngagementUpdated` | Cambio de estado candidato | Intensidad de audiencia, no followers |
| `AudienceMilestoneReached` | Fact opcional | Solo si existe consumidor real; nunca score automático |
| `RetirementHazardEvaluated` | Traza por defecto | Inputs, components y stream; no outcome |
| `RetirementDecisionRequested` | Proyección de `DecisionRequested` | Payload frozen y `PendingDecision` cuando corresponde |
| `RetirementOccurred` | Fact canónico | Cambia `PlayerPlayingStatus` una vez por episodio |
| `ComebackOpportunityGenerated` | Traza interna | Oportunidad identificada; se materializa en `DecisionRequested` si requiere choice |
| `ComebackDecisionRequested` | Proyección de `DecisionRequested` | Crea `PendingDecision` con payload frozen |
| `ComebackOccurred` | Fact canónico | Cambia `PlayerPlayingStatus` a `ACTIVE` |
| `CareerFinalizationRequested` | Comando/internal signal | Solicita boundary; no es fact de ocurrencia |
| `CareerFinalizationConfirmed` | Fact canónico de Career | Cierra terminal cursor/fact frontier y entra en FINALIZING |
| `CareerCompleted` | Fact de Career | Solo tras artefactos/integridad del boundary ADR-079 |

`PlayerRetired` debe migrarse o declararse alias de `RetirementOccurred`; ambos
no pueden representar la misma ocurrencia. `FollowersChanged` requiere la misma
reconciliación con `FollowerCountUpdated`.

**Cierre G3B Bloque 10:** `SportingReputationUpdated`,
`PublicReputationUpdated`, `FollowerCountUpdated`, `EngagementUpdated`,
`RetirementOccurred` y `ComebackOccurred` son facts canónicos.
`PublicAttentionGenerated` es fact causal pero no puntúa directamente.
Signals/hazards/oportunidades son internal signals y milestones, summaries.
Solo los updates públicos/sociales expresamente allowlisted pueden alimentar
PBR; retirement/comeback nunca puntúan por ocurrir.

## 17. Determinismo e identidad

Cada resolución usa:

- root seed y `VersionSet`;
- `seasonId`/punto de simulación;
- subsystem namespace;
- player, market, signal/opportunity y episode IDs;
- ordinal canónico;
- parameter set/hash.

Namespaces conceptuales separados:

```text
reputation.sporting
reputation.public
social.attention
social.followers
social.engagement
retirement.hazard
retirement.comeback
```

Los nombres finales pertenecen a DR-061/062/063. Consumir una tirada social no
desplaza Health, Performance, Market, Awards o Retirement. Consumir un hazard de
retiro no desplaza comeback.

## 18. Parameter Registry

### 18.1 Reputation — cerrado como schema de parámetros en G3C-9

- dominios, escalas, precisión y cuantización de standing, awareness,
  sentiment y evidence strength;
- proyección visible/categorías;
- pesos por familia de señal;
- memory kernels, persistence, recency, regression y decay;
- surprise/update transforms;
- regional diffusion y agregación global;
- title, award, international, transfer, club/league y prestige effects;
- shared-shock loading y correlaciones;
- source-memory compaction;
- stream namespaces/contexts;
- golden fixtures y targets Monte Carlo.

### 18.2 Social — cerrado como schema de parámetros en G3C-9

- representación exacta y rango de `FollowerCount`;
- dominio/precisión de engagement y attention;
- adquisición orgánica, churn y distribución de delta;
- overdispersion, tails y mixtures;
- attention conversion;
- persistence, regression y saturation dinámica;
- club/international reach;
- regional diffusion y audiencia superpuesta;
- viral/event shocks y correlaciones compartidas;
- precision/quantization;
- stream namespaces/contexts;
- golden fixtures y targets de audiencia/engagement.

### 18.3 Retirement y comeback — schema cerrado por G3C-10

- dominio/precisión de `CareerMotivationAssessment`;
- base hazard y competing-risk family;
- age effects sin threshold;
- capability/performance/decline effects;
- Health burden e injury-history effects;
- role/minutes y opportunity effects;
- contract, affiliation y Market effects;
- morale/ambition/motivation effects;
- achievement/reputation/context effects;
- causes y outcome/decision policy parametrizable;
- comeback hazard/distribution;
- post-retirement state dynamics;
- orden y stream namespaces/contexts;
- golden fixtures y targets Monte Carlo de retiro temprano, longevidad,
  carreras extremas, comeback y retiros múltiples;
- criterios de terminación práctica y right-censoring de automation/tooling.

Reputation/Social queda en `EngineParameterSet.reputationSocial`; Retirement y
Comeback quedan en `EngineParameterSet.retirementComeback`. No se aprueba ningún
valor por este documento.

## 19. Resolución del Design Board

| ID | Estado tras Bloque 9 | Cierre estructural | Pendiente |
|---|---|---|---|
| G3B-K01 | `PARTIAL_CALIBRATION` | AR(1) logit regional, impulses/evidence, Normal hierarchy, dominio y precisión cerrados. | Values, market data, targets y goldens aprobados. |
| G3B-K02 | `PARTIAL_CALIBRATION` | Deduplicación/suma canónica, memory kernel, difusión lagged y global derivado cerrados. | Persistence/diffusion values, source profiles y evidencia. |
| G3B-K03 | Resuelta estructuralmente | Public Reputation separa awareness/sentiment; reach es derivado y attention es estado reciente distinto. | Dominios, precisión y dinámica en DR-061. |
| G3B-K04 | Resuelta estructuralmente | Grafo data-driven de mercados; home/current se resuelven y global es derivado. | IDs, fuentes, difusión y pesos del slice. |
| G3B-K05 | `PARTIAL_CALIBRATION` | `uint64`, acquisition/churn log-space, viral Bernoulli, engagement AR(1), correlations y streams cerrados. | Rates/sigmas, reach/audience data, targets y goldens. |
| G3B-K06 | Calibración externalizada | Registry y targets obligatorios. | Valores aprobados. |
| G3B-K07 | Diferida | Solo se define `CommercialOpportunityContext`. | Política/subsistema futuro de sponsors. |
| G3B-L01 | `RESOLVED_MATH` | Cursor Q, post-retirement operations, WAITING_DECISION y finalization boundary fijados. | Implementación. |
| G3B-L02 | `PARTIAL_CALIBRATION` | Competing-risks hazard, Motivation, decline, samplers, streams y properties cerrados. | Coefficients, targets y expected goldens. |
| G3B-L03 | Resuelta estructuralmente | Motivation es assessment derivado de trait/estados/contexto; no nuevo trait. | Dominio, transformación y parámetros. |
| G3B-L04 | `PARTIAL_CALIBRATION` | Retirement/manual decision, comeback routes/hazard, viability, multiple cycles y finalization cerrados. | Coefficients, targets y automation fixtures. |
| G3B-L05 | Calibración externalizada | Registry y targets obligatorios. | Valores aprobados. |

## 20. Gates restantes

Antes de implementar este bloque:

1. DR-061 queda `PARTIAL_CALIBRATION`: debe aprobar values, mercados/reach,
   targets y golden outputs; no falta matemática ni sampler.
2. DR-062 queda `PARTIAL_CALIBRATION`; debe aprobar values, targets y expected
   golden outputs, sin matemática pendiente.
3. los schemas deben conformar catálogo, identity, classification,
   idempotencia y allowlist cerrados por ADR-010.
4. DR-069 está resuelta por ADR-079; falta implementación posterior a G3C-11.
5. DR-025 debe aportar mercados/regiones del slice.
6. DR-058/065 debe soportar `UNATTACHED` y oportunidades con identidades
   autorizadas.
7. DR-010 debe decidir PBR, longevity/records, anti-duplicación y scoring final.
8. Deben aprobarse golden fixtures y tolerancias Monte Carlo.

Hasta superar los gates no se implementa gameplay de Reputation, Social,
Retirement, Comeback, finalización competitiva ni scoring.

## 21. Interfaz downstream confirmada por G3C-8

Selection puede consumir únicamente el snapshot lagged de
`SportingReputation` autorizado. Awards puede consumir Sporting/Public
Reputation solo si su `AwardDefinition` declara ese feature. Ninguna edición
usa reputación producida por su propio outcome.

`NationalTeamCallUpIssued`, achievements internacionales y `AwardWon` son
causas downstream potenciales de Reputation/PublicAttention. G3C-9 fija su
transformación mediante profiles/impulses y consume el outcome solo en un batch
posterior; G3C-8 no actualiza reputation, followers o engagement.

## 22. Refinamiento matemático G3C-9

La especificación normativa completa está en
[`REPUTATION_SOCIAL_MATH_SPEC.md`](REPUTATION_SOCIAL_MATH_SPEC.md). En caso de
tensión con lenguaje previo que dejaba matemática pendiente, prevalece el
refinamiento G3C-9 para Reputation/Social. Retirement, Comeback y finalización
no son alcanzados por esa precedencia y continúan en DR-062/069.

G3C-9 confirma además:

- no `FameOverall`, no CareerScore/MarketValue y no writes desde Content;
- awareness/sentiment y followers/engagement separados;
- markets data-driven, audience partitions no superpuestas y global derivado;
- lag estricto hacia Market/Selection/Awards;
- no PRL/PBR, Sponsors o Retirement math;
- G3B-K01/K02/K05 en `PARTIAL_CALIBRATION`.

## 23. Refinamiento matemático G3C-10

La especificación normativa completa está en
[`RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md`](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md).
En caso de tensión con lenguaje previo que dejaba Retirement/Comeback/DR-069
pendientes, prevalece G3C-10 y ADR-079.

G3C-10 confirma:

- Motivation sigmoid derivada y fulfillment causal sin CareerScore;
- age sigmoid suave, decline EWMA y competing-risks retirement hazard;
- user/manual retirement sin RNG, caps, cooldown o forced retirement;
- comeback hazard con rutas willingness y Market Offer, sin inventar club;
- cursor Q posretiro con zero on-field exposure y evolución compatible;
- continuation viability y FinalizationOpportunity sin thresholds;
- `CareerStatus.RETIRED` reservado a FINALIZING;
- `CareerFinalizationConfirmed` como freeze del fact frontier;
- calibration automation/right-censoring fuera de gameplay;
- DR-069 resuelta, G3B-L01 `RESOLVED_MATH` y L02/L04
  `PARTIAL_CALIBRATION`.

## 24. Consumo de Scoring tras G3C-11

ADR-080 consume snapshots sociales allowlisted para PBR mediante cohortes
versionadas, sin permitir writes directos desde Content o Social al ledger.
Retirement/Comeback no puntúan ni congelan PC; solo
`CareerFinalizationConfirmed` habilita el snapshot final. PRL/PBR ya tienen
matemática cerrada, pero sus data/calibration bundles siguen pendientes.
