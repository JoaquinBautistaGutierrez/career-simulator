# Especificación de clubes, competiciones y mundo agregado

## 1. Estado, alcance y autoridad

- Estado: **G3B — Bloque 6, especificación estructural**.
- Fecha: 2026-07-28.
- Decisión relacionada: DR-022, parcialmente resuelta.
- ADR: [ADR-022](adr/022-club-competition-world-model.md).
- Fuera de alcance: fórmulas, familias de distribución, coeficientes,
  calibración, implementación de gameplay, plantillas completas, fixtures,
  matemática de mercado/contratos, selección, premios y scoring.

Este documento define el contrato mínimo que Club, Competitions y World deben
cumplir antes de elegir su matemática. Refina
[`MATHEMATICAL_ENGINE_SPEC.md`](MATHEMATICAL_ENGINE_SPEC.md),
[`ROLE_MINUTES_SPEC.md`](ROLE_MINUTES_SPEC.md),
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md),
[`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) y
[`DEVELOPMENT_AGING_SPEC.md`](DEVELOPMENT_AGING_SPEC.md). La interfaz de Market
queda refinada por
[`TRANSFER_MARKET_CONTRACT_SPEC.md`](TRANSFER_MARKET_CONTRACT_SPEC.md) y
[ADR-058](adr/058-transfer-market-contract-model.md). Las interfaces de
National Team y Awards quedan refinadas por
[`NATIONAL_TEAM_AWARDS_SPEC.md`](NATIONAL_TEAM_AWARDS_SPEC.md), [ADR-059](adr/059-national-team-model.md)
y [ADR-060](adr/060-awards-model.md).

La autoridad normativa es:

1. `MASTER_SPEC v0.8 — 27/07/2026`;
2. ADR aceptados;
3. decisiones resueltas de
   [`DECISIONS_REQUIRED.md`](DECISIONS_REQUIRED.md);
4. esta especificación para el alcance estructural de G3B Bloque 6.

Los nombres de facts de este documento nacieron como candidatos semánticos.
G3B Bloque 10 los reconcilia con el catálogo de
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md), que fija clasificación,
identidad, payload mínimo y allowlist.

## 2. Principios normativos

1. Las definiciones reales y el estado futuro simulado son objetos diferentes.
2. `dataVersion` selecciona una snapshot real inmutable durante toda la Career.
3. El futuro de la carrera vive en `WorldState`; no modifica la snapshot.
4. Club no se reduce a un `ClubOverall` causal.
5. Fuerza deportiva, prestigio y poder financiero son dimensiones diferentes.
6. No se simulan plantillas completas ni partidos individuales.
7. El protagonista contribuye al resultado colectivo, pero no lo determina.
8. El resto del equipo se representa como un field agregado que excluye al
   protagonista.
9. Resultados por competición comparten causas y conservan shocks
   específicos; no son sorteos totalmente independientes.
10. Ningún club recibe pisos de fuerza, inmunidad al descenso, clasificación
    garantizada o protección por identidad.
11. `leagueCompetitiveStrength` es estado deportivo ficticio; `IJL` es una
    jerarquía fija de scoring versionada.
12. Los cambios confirmados solo afectan ventanas o temporadas futuras.
13. Ascenso y descenso deben ser representables; su política concreta no se
    inventa.
14. No se teletransporta ni transfiere automáticamente al jugador si su club
    cambia de tier.
15. Toda entidad futbolística identificable del catálogo es real y
    data-versioned; un field abstracto no se presenta como una identidad real.
16. No hay caps editoriales de resultados, títulos, shocks o movilidad.
17. Todo azar usa streams deterministas y contexto canónico.
18. Ningún output de este bloque crea `ScoreLedgerEntry`.

## 3. Definición estática y estado simulado

### 3.1 Capas

```text
DataSnapshot(dataVersion)
  ├─ ClubDefinition
  ├─ LeagueDefinition
  ├─ CompetitionDefinition
  ├─ NationalTeamDefinition
  ├─ AwardDefinition
  └─ source/provenance metadata

Career
  └─ WorldState
       ├─ ClubState
       ├─ LeagueState
       ├─ CompetitionState
       ├─ NationalTeamState
       ├─ SelectionCompetitionField
       ├─ Award/StatisticalCompetitionField
       ├─ RegionalContext
       └─ WorldCycleState
```

La capa `Definition` responde qué entidad o regla fue publicada en la snapshot.
La capa `State` responde qué ocurrió ficticiamente dentro de una Career.

### 3.2 Inmutabilidad

- Una `Definition` publicada no se edita.
- Un cambio real de nombre, estructura, liga o existencia exige otra
  `dataVersion` o migración explícita.
- Una Career conserva el `dataVersion` original y sus hashes.
- Replay nunca consulta datos reales posteriores.
- Una corrección crítica no se aplica silenciosamente a carreras existentes.
- Los cambios futuros simulados referencian la identidad del catálogo, pero no
  reescriben su definición histórica.

### 3.3 Identidad

Los IDs de club, liga y competición son estables dentro del snapshot. Un estado
simulado usa esos IDs como referencias. Un participante abstracto puede formar
parte de un field estadístico, pero no puede aparecer como club, campeón o
clasificado con un nombre inventado.

## 4. `ClubDefinition` y `ClubState`

### 4.1 `ClubDefinition`

El contrato estático mínimo debe poder contener:

- `clubId`;
- nombre oficial, nombre corto y aliases;
- país y ciudad/región;
- referencia de liga/división base;
- referencias de elegibilidad competitiva conocidas;
- metadatos editoriales y de procedencia;
- `sourceSnapshotId`;
- flags de disponibilidad de datos o assets, sin confundirlos con mecánica.

La definición puede contener seeds o priors publicados para inicializar el
estado, pero no contiene la evolución ficticia de una Career.

### 4.2 `ClubState`

El estado simulado mínimo contiene dimensiones causales separadas:

| Dimensión | Semántica |
|---|---|
| `attackStrength` | Capacidad agregada actual de crear y concretar contexto ofensivo. |
| `defensiveStrength` | Capacidad agregada actual de limitar producción rival. |
| `controlStrength` | Capacidad agregada de controlar/progresar y sostener dominio. |
| `prestige` | Peso histórico/institucional y percepción acumulada. |
| `financialPower` | Capacidad económica abstracta para mercado, contratos e infraestructura. |
| `developmentQuality` | Calidad contextual de formación y aprendizaje. |
| `medicalQuality` | Calidad contextual de prevención, detección, rehabilitación y seguimiento. |
| `stability` | Persistencia/coherencia institucional y deportiva. |
| `managerContext` | Contexto vigente del entrenador y su versión temporal. |
| `positionCompetition` | Fields agregados por posición/contexto. |
| `clubNeeds` | Necesidades agregadas por posición/perfil/horizonte; no vacantes garantizadas. |
| `financialFeasibilityContext` | Contextos agregados de transfer/salary budget; no contabilidad completa. |
| `currentMembership` | Liga/tier y elegibilidades simuladas vigentes. |

Puede existir un `overallStrength` de presentación o comparación, siempre
derivado y con finalidad/versionado explícitos. No puede:

- reemplazar `attackStrength`, `defensiveStrength` y `controlStrength`;
- entrar junto con sus componentes sin una regla anti-doble-conteo;
- actuar como causa universal de rol, rendimiento, títulos o mercado.

### 4.3 Dominios y escalas

Este bloque no fija la escala numérica de las dimensiones de club. Deben:

- tener dominio tipado, finito y validado;
- declarar unidad, precisión y cuantización;
- vivir en configuración/versionado participante;
- rechazar valores no representables en vez de clampearlos implícitamente;
- admitir comparación y transición sin reutilizar por defecto la escala de
  capabilities `0..10000`.

La elección de dominio pertenece a DR-008/022 y al Parameter Registry.

### 4.4 Fuerza deportiva, prestigio y finanzas

La fuerza deportiva puede cambiar relativamente rápido. Prestigio tiene memoria
institucional y una dinámica distinta, normalmente más inercial. Poder
financiero es una tercera dimensión.

El modelo debe permitir:

- club históricamente grande con fuerza deportiva baja;
- club emergente fuerte con prestigio todavía menor;
- club rico con resultados pobres;
- club con recursos limitados y rendimiento extraordinario.

Prestigio o finanzas pueden modificar distribuciones futuras, pero no garantizan
éxito ni crean pisos deportivos.

## 5. `ManagerContext` y `TacticalIdentity`

### 5.1 `ManagerContext`

No se requiere simular una persona completa. El contexto agregado mínimo debe
poder expresar:

- `managerContextId`;
- `contextVersion` o revisión estable;
- `managerQuality`;
- `tacticalIdentity`;
- influencia de desarrollo;
- estabilidad/tenure contextual;
- punto causal `effectiveFrom` y, si aplica, `effectiveUntil`;
- referencia de origen del cambio.

`managerQuality`, influencia de desarrollo y `stability` del club no son
aliases. Un manager nuevo crea otro contexto o versión; no reetiqueta ventanas
cerradas.

### 5.2 `TacticalIdentity`

El contrato mínimo usa un vector compacto de demandas, con dimensiones
equivalentes a:

- intención ofensiva;
- intensidad de pressing;
- preferencia de posesión/control;
- directness;
- altura de línea defensiva.

Estas dimensiones describen demandas del contexto, no clases rígidas. Sus
dominios, pesos, correlaciones y distribución se externalizan.

`TacticalFit` sigue siendo una derivación jugador-contexto:

```text
capabilities
+ effectivePosition
+ TacticalIdentity / demandas
+ ManagerContext
+ contexto competitivo
-> TacticalFit
```

Club produce el contexto; Role & Minutes o el resolver compartido calcula la
vista derivada. Cambiar manager/táctica afecta solo resoluciones posteriores.

## 6. `PositionCompetition`

Club es owner de `PositionCompetition`.

Por club, ventana/contexto y posición canónica, el field debe expresar al menos:

- `competitionStrength`;
- `competitionDepth`;
- `entrenchment` o estabilidad del puesto;
- identidad temporal del snapshot/contexto;
- procedencia y versión de parámetros.

No contiene una lista de compañeros ficticios. Puede evolucionar entre ventanas
o temporadas por cambios de club, contexto, manager, mercado o mundo, pero una
actualización no modifica el rol/minutos ya confirmados.

La fortaleza general del club puede correlacionarse con una competencia más
dura; no la determina universalmente. El vertical slice resuelve gameplay solo
para `GK`, `CM` y `ST`, sujeto a DR-048. La estructura sigue usando la taxonomía
canónica de ADR-011 para no crear un segundo modelo incompatible.

Club también es owner de `ClubNeed` por ventana/contexto. El field puede
referenciar posición, urgencia, perfil deseado, necesidad de calidad,
preferencia etaria, competencia, táctica y finanzas. No materializa una
plantilla ni obliga a generar interés/oferta. World puede producir
`PositionScarcity` por región/mercado/posición.

## 7. Calendario agregado y `TeamMinutesOpportunity`

### 7.1 Owner y granularidad

Competitions/Calendar es owner de la oportunidad temporal. El calendario es
agregado por Q y no materializa partidos, jornadas o fechas diarias.

Cada Q debe poder representar:

- cantidad/exposición de competición;
- minutos o equivalentes físicamente disponibles;
- dificultad de agenda;
- congestión;
- exposición high-pressure;
- desglose por competición activa.

Q1–Q4 son ventanas técnicas, no trimestres de calendario.

### 7.2 Contrato

`TeamMinutesOpportunity` identifica:

- `seasonId = { careerId, seasonOrdinal }`;
- Q ordinal `0..3`;
- `participationContext = CLUB`;
- `clubId`;
- scope y breakdown de competiciones;
- `teamMinutes`, tiempo máximo que un único jugador podría ocupar;
- referencias al contexto de calendario;
- versión y procedencia.

ADR-072 refina cada entrada con:

- `appearanceOpportunityCount`;
- capacidad máxima agregada de una titularidad;
- capacidad máxima agregada de una aparición no titular;
- orden canónico del segmento.

Cada entrada de breakdown puede identificar:

- `competitionId`;
- `competitionType`;
- oportunidad de minutos;
- dificultad/scope;
- congestión asociada;
- exposición high-pressure.

Se preserva:

```text
sum(competitionOpportunityMinutes) = teamMinutes
0 <= actualMinutes <= availableTeamMinutes <= teamMinutes
sum(actualMinutesByCompetition) = actualMinutes
```

`teamMinutes` no suma los once puestos del equipo y no es un cap editorial por
rol. Es un límite físico derivado del calendario.

G3C-3 cierra unidad, precisión y `SeasonId` ordinal. La fórmula que genera la
oportunidad, la fecha/label visible, formatos y extrapolación siguen en DR-021.
Role & Minutes no los inventa.

### 7.3 Contexto de agenda

`ScheduleContext` es una vista agregada y auditable. Congestión y dificultad
pueden afectar minutos, Performance y Health por rutas distintas; no se aplica
un bonus universal repetido.

No se infieren sesiones de entrenamiento diarias. Training/background exposure
puede existir como señal agregada separada para Health.

## 8. `CompetitionDefinition` y `CompetitionState`

### 8.1 `CompetitionDefinition`

La definición estática mínima contiene:

- `competitionId`;
- nombre y aliases;
- país, región o confederación;
- `competitionType`;
- frecuencia/periodicidad;
- `formatKind` conceptual;
- reglas o referencia versionada de elegibilidad;
- prestigio/contexto publicado;
- jerarquías de datos/scoring cuando correspondan, sin fusionarlas;
- `sourceSnapshotId`.

La arquitectura admite al menos:

```text
LEAGUE
DOMESTIC_CUP
CONTINENTAL
SUPERCUP
INTERNATIONAL_CLUB
```

`formatKind` puede distinguir, como contrato estructural, tabla, eliminación o
formato híbrido. El grafo de fases, cupos, desempates y reglas futuras siguen en
DR-021/022.

### 8.2 `CompetitionState`

El estado de una edición/temporada debe poder conservar:

- `competitionId` y `seasonId`;
- participantes detallados y/o referencia a un field autorizado;
- progreso agregado;
- contexto por Q;
- estado de participación del club;
- posición o fase alcanzada;
- eliminación cuando corresponda;
- campeón;
- clasificación/qualification;
- cierre e identidad del outcome.

No genera fixtures ni marcadores por defecto. Un resultado que nombra un club
debe referenciar una identidad real presente en el catálogo.

### 8.3 Resultados mínimos

La resolución agregada debe poder producir:

- posición final de liga;
- título;
- subcampeonato/fase alcanzada cuando tenga consumidor;
- eliminación;
- qualification;
- champion;
- participación atribuible del protagonista.

No se persiste producción agregada del equipo si ningún consumidor la requiere.
Los resultados se resuelven por competición; un total universal no reemplaza
los outcomes individuales.

## 9. Contribución del jugador y soporte del equipo

### 9.1 `PlayerCompetitiveContribution`

Después de Performance, una proyección interna y auditable puede producir una
contribución por Q/competición desde:

- `actualMinutes` y splits confirmados;
- `UnderlyingPerformance` autorizado dentro del engine;
- `ObservedProduction`;
- `effectivePosition`;
- contexto competitivo y táctico;
- fuerza de evidencia.

Este objeto:

- no es CareerScore;
- no es `ContributionCoefficient`;
- no crea puntos;
- no vuelve a sortear rendimiento;
- no accede a ratings de presentación como causa;
- no determina por sí solo el resultado colectivo.

Los consumidores externos reciben facts/resultados autorizados, no el estado
latente salvo que DR-063 lo permita expresamente.

### 9.2 `TeamSupportField`

El resto del equipo se representa mediante un field agregado por club,
competición y período. Debe:

- derivarse de fuerza deportiva y contexto;
- excluir la contribución del protagonista para evitar doble conteo;
- representar baseline y dispersión del soporte colectivo;
- ser correlacionable entre Q y competiciones;
- no inventar compañeros identificables.

### 9.3 Resolución causal

La estructura conceptual es:

```text
ClubState / CompetitionContext
+ TeamSupportField
+ PlayerCompetitiveContribution
+ shared latent factors
+ competition-specific stochastic component
-> CompetitionOutcome
```

No se aprueba suma, producto, peso ni distribución mediante este esquema.

## 10. Resultados correlacionados por competición

Liga, copa y competición continental se resuelven separadamente, pero comparten:

- `ClubState`;
- `ManagerContext`;
- contexto de temporada;
- shocks globales/regionales/de liga/club ya confirmados;
- soporte agregado.

Cada competición conserva además un componente específico. El modelo debe
permitir:

- gran copa y mala liga;
- gran liga y eliminación temprana;
- temporadas coherentes a través de una causa común;
- outliers sin eventos especiales ni caps editoriales.

La jerarquía evita sortear una crisis regional, un bajón de club y su impacto
económico como causas independientes duplicadas. Familia estadística,
covarianza, cargas y streams quedan externalizados.

## 11. `LeagueDefinition`, `LeagueState` e IJL

### 11.1 `LeagueDefinition`

La definición estática identifica país, división/tier, formato o regla
versionada, calendario abstracto, fuentes y snapshot. No contiene el futuro
realizado de la Career.

### 11.2 `LeagueState`

El estado simulado mínimo debe poder contener:

- `leagueId`, `seasonId` y tier;
- membresía vigente o referencia a field;
- `leagueCompetitiveStrength`;
- profundidad competitiva agregada;
- contexto económico/regional relevante;
- referencias de competiciones domésticas;
- resultados y transitions pendientes/confirmadas;
- snapshot anterior y causalidad de actualización.

`leagueCompetitiveStrength` describe dificultad deportiva dinámica dentro de la
Career. Puede cambiar por evolución de clubes, resultados internacionales,
contexto regional/económico y shocks.

### 11.3 Separación de IJL

```text
leagueCompetitiveStrength
  = estado ficticio dinámico del engine

IJL
  = jerarquía competitiva fija de scoringVersion + dataVersion
```

Cambiar la fuerza ficticia no reescribe IJL. Scoring puede consumir ambos solo
si DR-010 define finalidades distintas y anti-doble-conteo. Los contadores
observados tampoco se reescriben por ninguno.

## 12. `WorldState`, ciclos y evolución

### 12.1 Estado mínimo

`WorldState` es el agregado de carrera que referencia:

- `dataVersion` y hashes del snapshot inicial;
- `ClubState` relevantes;
- `LeagueState` relevantes;
- `CompetitionState` de la temporada;
- `NationalTeamState` relevantes y contexto generacional internacional;
- contextos globales y regionales;
- `WorldCycleState`;
- `SelectionCompetitionField`, `AwardCompetitionField` y
  `StatisticalCompetitionField` identificados por scope/edición;
- contexto económico/deportivo, incluido transfer market heat, wage
  environment, flujos regionales y demanda posicional cuando corresponda;
- ordinal/season del último update confirmado.

No necesita representar todas las plantillas o todos los clubes con la misma
granularidad. Las identidades detalladas, los fields agregados y el scope deben
ser explícitos.

### 12.2 Shocks jerárquicos

El diseño admite factores compartidos:

```text
global
-> regional
-> league
-> club
-> competition-specific / idiosyncratic
```

Cada factor se resuelve una vez en su scope y se referencia desde los
consumidores. No se vuelve a muestrear para “confirmar” el mismo shock en
mercado, fuerza y resultados.

La jerarquía es estructural. Distribuciones, cargas, correlaciones,
persistencia, orden de streams y parámetros siguen abiertos.

### 12.3 `WorldCycleState`

El mundo/región puede mantener estados agregados equivalentes a:

- ciclo deportivo;
- ciclo económico;
- contexto de desarrollo/talento;
- contexto competitivo.

Los ciclos modifican distribuciones futuras; no guionan historias ni garantizan
eras. Deben soportar persistencia, regresión y shocks sin crecimiento explosivo
o colapso numérico.

Los estabilizadores pertenecen a la dinámica de estado y a sus dominios
físicos, no son caps editoriales de eventos, títulos o resultados.

### 12.4 Actualización estacional

La transición futura de Club/League/World puede consumir:

- estado anterior;
- resultados recientes confirmados;
- finanzas, prestigio y estabilidad;
- ManagerContext;
- contexto de liga/región/mundo;
- shocks compartidos e idiosincráticos.

Debe permitir persistencia, reversión, cambio de régimen y shocks. No se aprueba
una fórmula.

Prestigio evoluciona por una ruta más inercial que fuerza deportiva. Poder
financiero evoluciona agregadamente y no requiere contabilidad completa.
LeagueState puede responder a clubes, resultados internacionales y contexto sin
recalcular temporadas cerradas.

## 13. Ascenso, descenso y `ExternalClubPool`

### 13.1 Soporte obligatorio

La arquitectura no asume membresía perpetua. Debe poder representar:

- `PromotionOccurred`;
- `RelegationOccurred`;
- transición de membresía/tier;
- entrada o salida del conjunto detallado;
- efectos futuros en calendario, fuerza, prestigio y contexto.

La transición se apoya en outcomes y reglas versionadas; no surge de identidad
o prestigio.

### 13.2 `ExternalClubPool`

Un pool externo agregado es compatible como opción arquitectónica si:

- sus identidades nombradas provienen del catálogo real;
- conserva procedencia/dataVersion;
- representa solo el estado mínimo necesario;
- no otorga protección a clubes detallados;
- permite promover/descender sin inventar identidades;
- un club que entra al tier detallado puede materializar un `ClubState`
  reproducible.

G3D-2 acepta esta opción como política del vertical slice mediante
[ADR-081](adr/081-hybrid-external-club-pool.md): el pool es híbrido. Las
identidades nominales provienen de un catálogo real versionado y los campos
agregados no identificables cubren contexto competitivo. Cuando el protagonista
o un fact nominal necesita un club concreto, la materialización es determinista
y trazable. Un field abstracto nunca puede ser champion, club contractual ni
owner de un fact nominal.

### 13.3 Club del protagonista fuera del tier detallado

Si el club del jugador desciende:

- el jugador conserva su club y contrato;
- no se genera una transferencia automática;
- no se teletransporta a otra liga;
- la carrera no puede reescribir el outcome;
- cualquier continuación necesita oportunidad, competición, Performance,
  mercado y scoring coherentes con ese tier.

La política de continuidad queda cerrada estructuralmente por ADR-081: el
jugador puede continuar en un club materializado fuera del tier detallado con
los adapters mínimos de competición, Performance, Market y contrato. La
ejecución permanece `DATA_REQUIRED` hasta publicar el catálogo real, los fields,
las reglas de movilidad y sus goldens; no queda abierta una alternativa
arquitectónica de DR-065.

## 14. Scope exacto del vertical slice

DR-018 fija Argentina, España, `GK`/`CM`/`ST`, Carrera rápida, 30 eventos, cinco
cadenas y seis lesiones. `MASTER_SPEC` §34.5 agrega el inventario competitivo
mínimo. Para completar el ciclo end-to-end, el bloque Club/Competitions/World
necesita:

1. una `LeagueDefinition` principal de Argentina;
2. una `LeagueDefinition` de España;
3. entre 6 y 10 `ClubDefinition` detalladas por liga, con IDs reales;
4. una competición doméstica de copa por cada contexto;
5. Libertadores como competición continental del contexto argentino;
6. Champions League como competición continental del contexto español;
7. contratos de contexto para los torneos principales de selección que
   resolverá el bloque National Team;
8. `ClubState`, `LeagueState` y `CompetitionState` para la temporada activa;
9. fields agregados y/o pool real suficiente para oponentes, clasificación,
   champion, qualification y movilidad;
10. `TeamMinutesOpportunity`, `PositionCompetition`, `PerformanceContext`,
    `TeamSupportField` y `PlayerCompetitiveContribution`;
11. actualización determinista del mundo entre temporadas;
12. al menos una ruta verificable de título colectivo por contexto.
13. una `NationalTeamDefinition` argentina y fields internacionales mínimos;
    para V1 la nacionalidad deportiva inicial y única del protagonista es
    Argentina conforme a [ADR-082](adr/082-vertical-slice-sporting-nationality.md);
14. exactamente un premio global, uno juvenil y tres premios posicionales o de
    competición para el slice, con `AwardDefinition` versionada.

No son obligatorios para este slice:

- simular fixtures o marcadores;
- plantillas completas;
- todas las ligas inferiores;
- todos los tipos de competición soportados por la arquitectura;
- cinco ligas europeas;
- economía contable;
- expansión automática del catálogo.

Permanecen pendientes:

- IDs exactos, fuentes, fecha de corte y licencias: DR-025;
- forma final de temporada/calendario/formato: DR-021;
- catálogo real, fields y reglas versionadas de participantes externos,
  promoción/descenso y continuidad bajo ADR-081: DR-025/065;
- catálogo concreto de premios/selección: DR-025/059/060;
- fuente de nacionalidad deportiva y manifest de eligibility Argentina-only
  bajo ADR-082: DR-025/068;
- reglas matemáticas/calibración: DR-008/022;
- moneda y presentación de valor: DR-027.

## 15. Pipeline causal y `SimulationCursor`

Este bloque no agrega fases ni cambia las 38 operaciones de ADR-042.

### 15.1 Inicio de temporada

En `SEASON_START` se congela un `WorldSeasonSnapshot` con:

- Club/League/Competition state aplicable;
- Manager/Tactical context vigente;
- calendario agregado y reglas comprendidas;
- versiones y parámetros participantes.

PRESEASON y eventos autorizados pueden confirmar cambios futuros. Cada cambio
declara desde qué cursor es efectivo.

### 15.2 Por Q

Antes de Role & Minutes se prepara el contexto de Q:

```text
ClubState + LeagueState + CompetitionState + ScheduleContext
-> PositionCompetition
-> TacticalContext
-> TeamMinutesOpportunity
-> PerformanceContext / Medical context
```

El pipeline posterior se conserva:

```text
pre-window context
-> Role & Minutes
-> Performance
-> PlayerCompetitiveContribution accumulator
-> Health
-> Consequences for next Q
```

El outcome de una Q no modifica su propio contexto pre-window.

### 15.3 Cierre competitivo y mundo futuro

Después de Q4:

```text
COMPETITIONS
  -> CompetitionOutcome por competición
  -> títulos/fases/qualification

WORLD_UPDATE
  -> ClubState/LeagueState/WorldState futuros
```

Market, Awards y sus ventanas conservan el orden de ADR-013/043. Una
actualización en `WORLD_UPDATE` afecta temporadas posteriores; no reabre Q ni
COMPETITIONS ya cerrados.

Una decisión obligatoria puede interrumpir una operación. Checkpoint, cursor,
streams y facts ya confirmados impiden repetir contexto, contribución u outcome.

## 16. Interfaces

### 16.1 Hacia Role & Minutes

| Input | Owner | Restricción |
|---|---|---|
| `PositionCompetition` | Club | Field por posición/contexto; no plantilla. |
| `TacticalContext` | Club/Manager | `TacticalFit` se deriva; no se entrega como capability. |
| `TeamMinutesOpportunity` | Competitions/Calendar | Tiempo físico por Q y splits; Role no inventa calendario. |

### 16.2 Hacia Performance

`PerformanceContext` recibe:

- attack/defensive/control environment;
- opponent/field strength;
- schedule difficulty;
- `leagueCompetitiveStrength` y competition context;
- pressure exposure;
- TacticalContext;
- IDs de club, liga, competición, Q y snapshot.

Performance no genera ni actualiza esos valores. Raw production permanece raw.

### 16.3 Hacia Health

Health recibe:

- `medicalQuality`;
- schedule/congestion;
- exposición competitiva disponible/realizada;
- contexto institucional autorizado.

Club no genera lesiones. `medicalQuality` no elimina hazard y no se fusiona con
`recoveryCapacity`.

### 16.4 Hacia Development

Development recibe:

- `developmentQuality`;
- `managerQuality` e influencia de desarrollo;
- contexto deportivo/entrenamiento agregado;
- estabilidad/contextVersion cuando sea causalmente relevante.

El club no escribe capabilities ni garantiza delta positivo.

### 16.5 Hacia Transfers y Contracts

El futuro bloque puede consumir:

- fuerza deportiva multidimensional;
- prestigio;
- poder financiero;
- necesidad/competencia posicional;
- Manager/Tactical context;
- liga y mundo.

`Contract.role` o una promesa contractual no son `SquadStatus`,
`SportingRole` ni `EffectiveUsage`. ADR-058 reemplaza el alias por
`ContractExpectation = DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE`, que no
asigna minutos.

Transfers consume:

- `ClubNeed` y `PositionScarcity`;
- fuerza deportiva/proyecto y `PositionCompetition`;
- `TacticalIdentity` para derivar `PlayerClubFit`;
- prestigio;
- `financialPower`, transfer/salary budget context;
- liga, mundo y ciclos de mercado.

Ninguno garantiza interés/oferta. Transfers devuelve movimientos confirmados y
posibles señales económicas futuras; Club/World aplica cualquier cambio solo en
su fase propietaria y no reabre estados cerrados.

### 16.6 Hacia Awards, Selection y Scoring

Se entregan únicamente hechos/contextos autorizados:

- outcomes por competición;
- title, phase, qualification y participation;
- competition/league strength contextual;
- pressure exposure;
- performance/contribution confirmadas mediante sus propios facts.

World entrega a Selection `NationalTeamState`, generation context,
`SelectionCompetitionField`, calendario/contexto internacional y strength/
support field. Entrega a Awards fields identificados por Definition/edición,
era, strength, dispersion y contexto, además de outcomes confirmados. No
calcula candidate signals, convocatoria, eligibility o ganadores.

Scoring usa IJL y facts allowlisted según DR-010/063; no consume `WorldState`
oculto de forma libre. Awards y Selection tampoco usan fields como facts
deportivos del protagonista.

## 17. Outputs conceptuales

| Concepto | Semántica |
|---|---|
| `CompetitionContextPrepared` | Snapshot causal de competición/contexto disponible para una Q. |
| `TeamMinutesOpportunityPrepared` | Oportunidad física y splits de Q. |
| `PositionCompetitionPrepared` | Field de competencia por posición/contexto. |
| `ClubNeedPrepared` | Snapshot de necesidad agregada por club/ventana; no oferta. |
| `MarketContextPrepared` | Ciclo/escasez/finanzas disponibles para Market; no valoración del jugador. |
| `PlayerCompetitiveContributionRecorded` | Proyección interna por competición desde evidencia ya realizada. |
| `CompetitionFinished` | Cierre agregado de una edición/temporada. |
| `CompetitionWon` | Título confirmado con identidad y elegibilidad. |
| `RoundReached` | Fase confirmada cuando tiene semántica downstream. |
| `QualificationAchieved` | Clasificación futura confirmada. |
| `ClubStateUpdated` | Transición de estado de club con snapshot anterior/posterior. |
| `LeagueStateUpdated` | Transición de liga, membresía/contexto y causalidad. |
| `ManagerContextChanged` | Nuevo contexto efectivo desde cursor explícito. |
| `PromotionOccurred` | Cambio de tier confirmado según reglas. |
| `RelegationOccurred` | Cambio de tier confirmado según reglas. |
| `WorldCycleUpdated` | Cambio de contexto agregado con scope y causas. |

Por defecto, `CompetitionContextPrepared`, `PositionCompetitionPrepared`,
`TeamMinutesOpportunityPrepared`, `ClubNeedPrepared` y
`MarketContextPrepared` pueden ser snapshots/trazas, no necesariamente facts de
dominio. `PlayerCompetitiveContributionRecorded` es evidencia interna y no es
CC. La clasificación final se declara en `SCORING_FACTS_SPEC.md`.

`CompetitionWon` no debe duplicarse con `CompetitionFinished` o
`CompetitionAchievement`. Un único outcome canónico puede proyectar vistas
específicas.

**Cierre G3B Bloque 10:** `CompetitionFinished` es el único fact de outcome
colectivo y contiene title/round/qualification. `CompetitionWon`,
`RoundReached`, `QualificationAchieved` y
`NationalTeamCompetitionAchievement` son vistas, no ocurrencias adicionales.
Los contexts preparados y `PlayerCompetitiveContributionRecorded` son
summaries internos. Scoring consume el outcome y una definición congelada; no
consume `leagueCompetitiveStrength` como IJL.

## 18. Determinismo, versionado y auditoría

Toda transición debe poder reconstruir:

```text
dataVersion / definitions
-> world snapshot
-> pre-window competition context
-> opportunity / role / minutes
-> performance / player contribution
-> competition outcome
-> club / league / world next state
```

Se conservan:

- IDs de Career, season, Q/fase y `operationKey`;
- versiones participantes;
- hashes de snapshot/parámetros;
- references causales;
- contextos de stream y ordinales;
- estado anterior/posterior cuando sea necesario;
- separación entre fact, snapshot y traza.

Cambiar estructura, orden, fórmula, parámetros o datos que modifiquen replay
requiere bump de una versión participante según ADR-015. Una carrera no carga
datos reales nuevos durante replay.

## 19. Parameter Registry Candidates

Ninguno de estos valores queda aprobado ni hardcoded:

- dominios, escalas, precisión y cuantización de estados de club/liga/mundo;
- priors de `attackStrength`, `defensiveStrength` y `controlStrength`;
- persistencia, reversión y shocks de fuerza deportiva;
- dinámica e inercia de prestigio;
- dinámica de poder financiero;
- dinámica de estabilidad;
- manager quality, turnover, tenure y cambio de contexto;
- distribuciones y evolución de TacticalIdentity;
- función de `TacticalFit`;
- generación/evolución de `PositionCompetition`;
- calendario agregado y `TeamMinutesOpportunity`;
- dificultad, congestión y high-pressure exposure;
- formatos, fases, cupos y reglas de qualification;
- `TeamSupportField`;
- proyección `PlayerCompetitiveContribution`;
- efecto de contribución en outcome;
- familia y dispersión de outcomes por competición;
- correlaciones entre liga/copa/continental y entre Q;
- `leagueCompetitiveStrength`;
- evolución de ClubState y LeagueState;
- jerarquía/cargas de shocks globales, regionales, liga, club y competición;
- ciclos, regímenes, persistencia y estabilizadores del mundo;
- dinámica económica/regional;
- generación/evolución de `ClubNeed`;
- `PositionScarcity`;
- transfer/salary budget context;
- transfer market heat, wage environment y regional money flow;
- evolución generacional de selecciones y `NationalTeamSupportField`;
- priors/evolución mundial de `SelectionCompetitionField`;
- priors/evolución por edición de `AwardCompetitionField` y
  `StatisticalCompetitionField`;
- promotion/relegation;
- external club pool y materialización;
- precisión y cuantización de outcomes;
- namespaces/contextos de streams;
- estados iniciales de Argentina/España;
- parámetros de las competiciones del slice;
- targets Monte Carlo de fuerza, títulos, movilidad, outliers y estabilidad
  multi-década;
- golden fixtures de snapshot, contexto, outcome y world update.

## 20. Resolución del Design Board

| ID | Estado de Bloque 6 | Cierre estructural | Pendiente |
|---|---|---|---|
| G3B-F01 | Resuelta estructuralmente | `ClubState` multidimensional; fuerza/prestigio/finanzas separados; overall solo derivado. | Dominios, dinámica y calibración. |
| G3B-F02 | Resuelta estructuralmente | `ManagerContext`, `TacticalIdentity` vectorial y `TacticalFit` derivado. | Función, escalas y parámetros. |
| G3B-F03 | `RESOLVED_MATH` en G3C-3 | SeasonId ordinal, Q, unidad y contrato de oportunidad cerrados. | Fecha/label, generación, formatos y extrapolación en DR-021. |
| G3B-F04 | Resuelta estructuralmente | Definition/State, tipos, calendario Q y contrato de outcome agregados. | Reglas/formato exactos y matemática. |
| G3B-F05 | `PARTIAL_CALIBRATION` en G3C-6 | Noisy utility/rank para liga; logistic advance por phase; contribución, soporte y correlación cerrados. | Valores, definitions, targets/goldens y CC/scoring. |
| G3B-F06 | `PARTIAL_CALIBRATION` con policy blocker | Ranking y slots producen `MobilityTransitionRequest`; no auto-transfer. | Pool/scope/materialización/continuidad en DR-065. |
| G3B-F08 | Calibración externalizada | Snapshot y parámetros no son reglas hardcoded. | Valores y catálogo. |
| G3B-J01 | Resuelta estructuralmente | `WorldState` híbrido de estados identificados y fields agregados. | Scope concreto de datos. |
| G3B-J02 | `PARTIAL_CALIBRATION` en G3C-6 | Factor model Normal global/regional/league/club/competition/residual. | Loadings, sigmas y targets. |
| G3B-J03 | `PARTIAL_CALIBRATION` en G3C-6 | AR(1) en logit por state, snapshot previo y commit atómico. | Means, persistence, coefficients y targets. |
| G3B-J04 | `PARTIAL_CALIBRATION` en G3C-6 | Ciclos continuos jerárquicos AR(1), sin regímenes guionados. | Persistence, amplitudes y targets. |
| G3B-J05 | Calibración externalizada | Snapshot y targets quedan versionados. | Valores, matrices y fixtures. |

G3B-F07 permanece diferible después del vertical slice: este bloque no elige
política de formatos más allá del horizonte aprobado.

## 21. Decisiones todavía abiertas

Antes de implementar gameplay de este bloque deben cerrarse:

- DR-008: G3C-6 cierra estas cinco familias; permanece abierta por G3C-7 a
  G3C-11, ParameterSets y calibración integrada;
- DR-021: fecha, `SeasonId`, calendario y evolución de formatos;
- DR-022: `PARTIAL_CALIBRATION`; faltan valores, data, schemas, targets,
  goldens y DR-065;
- DR-025: catálogo real, fuentes, corte y licencias;
- DR-063: resuelta; schemas futuros deben conformar su catálogo;
- DR-064: resuelta por ADR-072; Calendar debe producir el dominio de oportunidad compatible;
- DR-065: scope de participantes, pool externo, movilidad y continuidad del
  protagonista;
- DR-066: elegibilidad/inscripción posterior a movimientos;
- DR-067: cadencia de Market y movimientos entre Qs;
- DR-068: nacionalidad deportiva y eligibility internacional del slice;
- interfaces matemáticas posteriores de DR-058 a DR-060 y DR-010.

DR-027 no define el pool ni la fuerza financiera: continúa limitado a valor de
mercado, moneda y presentación. `financialPower` es estado económico abstracto
de club y no una tasación del jugador.

## 22. Gates y evidencia requerida

Antes de implementar:

1. schemas separan Definition de State y rechazan mutación de snapshot;
2. `ClubState` no contiene overall causal;
3. fuerza, prestigio y finanzas evolucionan por rutas separadas;
4. cambio de manager afecta solo cursores posteriores;
5. `PositionCompetition` no materializa plantilla;
6. oportunidad y splits conservan minutos;
7. cero minutos impide contribución participativa, no world update;
8. outcomes por competición comparten shocks sin quedar idénticos;
9. el protagonista no determina solo el outcome;
10. `TeamSupportField` excluye su contribución;
11. raw production no se reescribe por fuerza de liga;
12. IJL permanece fijo aunque `leagueCompetitiveStrength` cambie;
13. no hay pisos, inmunidad ni clasificaciones garantizadas;
14. ascenso/descenso conserva identidad y no auto-transfiere;
15. replay no consulta datos reales nuevos;
16. cada output tiene causal references y operación estable;
17. parámetros, streams y precisión están versionados;
18. golden/property tests y Monte Carlo cumplen targets aprobados;
19. el inventario del slice coincide con DR-018/025/065;
20. no se implementa gameplay hasta cerrar los bloqueos de parámetros, datos,
    policy y calibración.

## 23. Cierre matemático G3C-6

La especificación normativa es
[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md) y
la decisión transversal es
[ADR-075](adr/075-club-competition-world-mathematics.md).

G3C-6 fija:

- states acotados y AR(1) mean-reverting en logit para Club/League/World;
- processes separados de sporting strength, prestige, finance, stability y
  qualities institucionales;
- manager turnover por cumulative hazard y generación correlacionada;
- `TacticalIdentity`, `TacticalFit` y `PositionCompetition` ejecutables;
- phase graphs por Q, match equivalents y `TeamMinutesOpportunity`;
- checkpoint de progression knockout dentro de `CONSEQUENCES(Qn)`;
- contextos exactos de difficulty, congestion, pressure, training y recovery;
- `TeamSupportField` sin protagonista y proyección de
  `PlayerCompetitiveContribution`;
- noisy utility/canonical rank para league y logistic/Bernoulli para
  cup/continental;
- jerarquía Normal de shocks y ciclos continuos AR(1);
- `leagueCompetitiveStrength` dinámica y separada de IJL;
- boundary rank→`MobilityTransitionRequest` sin resolver DR-065.

Las cinco filas F05/F06/J02/J03/J04 pasan a `PARTIAL_CALIBRATION`. DR-065
permanece abierta por scope/data/policy, no por falta de función local.

## 24. Referencias matemáticas

- [Mathematical Calibration Contract](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Club/Competition/World Math](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)

## 25. Consumo de Scoring tras G3C-11

ADR-080 puntúa outcomes ya cerrados por competition edition y attribution
facts autorizados. `leagueCompetitiveStrength` nunca reemplaza IJL; gameplay
fields/utilities no contienen puntos. DR-066/067 siguen siendo upstream para
registration/eligibility y no se infieren dentro de Scoring.
