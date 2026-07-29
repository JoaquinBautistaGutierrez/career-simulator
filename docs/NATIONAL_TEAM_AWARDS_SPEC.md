# Especificación de selección nacional y premios

## 1. Estado, alcance y autoridad

- Estado: **G3B — Bloque 8, especificación estructural**.
- Fecha: 2026-07-28.
- Decisiones relacionadas: DR-008, DR-010, DR-018, DR-021, DR-022, DR-048,
  DR-049, DR-055, DR-056, DR-059, DR-060, DR-063 y DR-068.
- ADR:
  [ADR-059](adr/059-national-team-model.md) y
  [ADR-060](adr/060-awards-model.md).
- Fuera de alcance: fórmulas, familias de distribución, coeficientes,
  thresholds de balance, parámetros iniciales, fixtures ejecutables,
  implementación de gameplay, reputación/social, scoring y catálogo real
  definitivo.

Este documento define la estructura causal mínima de National Team y Awards.
Refina:

- [`MATHEMATICAL_ENGINE_SPEC.md`](MATHEMATICAL_ENGINE_SPEC.md);
- [`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md);
- [`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md);
- [`TRANSFER_MARKET_CONTRACT_SPEC.md`](TRANSFER_MARKET_CONTRACT_SPEC.md);
- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md).

La autoridad normativa es:

1. `MASTER_SPEC v0.8 — 27/07/2026`;
2. ADR aceptados;
3. decisiones resueltas de
   [`DECISIONS_REQUIRED.md`](DECISIONS_REQUIRED.md);
4. esta especificación para el alcance estructural de G3B Bloque 8.

Los nombres de facts nacieron como candidatos semánticos. G3B Bloque 10 los
reconcilia con el catálogo de
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md). Nada de este documento
autoriza gameplay mientras la matemática y los demás gates aplicables sigan
abiertos.

## 2. Principios normativos

1. Club y selección poseen estados, contextos, roles, oportunidades, minutos y
   Performance separados.
2. La selección no usa un threshold de overall, rating, MarketValue o
   reputación pública.
3. Elegibilidad es una restricción lógica versionada; convocatoria, rol,
   minutos y resultados son resoluciones posteriores diferentes.
4. La competencia generacional se representa mediante fields agregados por
   país y posición, no mediante una población mundial completa.
5. La convocatoria compara evidencia del jugador con ese field de forma
   probabilística.
6. Una liga o club de menor fuerza puede modificar la evaluación de evidencia,
   pero no crea inelegibilidad deportiva.
7. La historia de selección puede influir probabilísticamente sin garantizar
   permanencia, convocatoria o rol.
8. National Team reutiliza los contratos comunes de Role & Minutes,
   Performance y Competition Outcome con contextos propios; no crea un segundo
   motor incompatible.
9. El protagonista contribuye al resultado de su selección, pero no lo
   determina.
10. Award no es CareerScore, récord, achievement narrativo ni una tirada
    Bernoulli independiente.
11. Cada premio usa una `AwardDefinition` data-driven y versionada.
12. Premios comparativos y estadísticos usan fields diferentes y no thresholds
    universales.
13. Los premios evalúan cada posición con evidencia apropiada; goles y
    asistencias no son la métrica universal.
14. Un mismo jugador puede obtener múltiples premios compatibles en una
    temporada.
15. La anti-duplicación de puntos pertenece exclusivamente a scoring.
16. Awards nunca crea `ScoreLedgerEntry` y engine no depende de scoring.
17. `AWARD_EVENTS` ocurre solo después de confirmar el resultado de `AWARDS`.
18. No existen caps editoriales de convocatorias, premios, nominaciones,
    resultados internacionales o outliers.
19. Todo azar usa streams deterministas, orden canónico y versiones
    participantes.
20. Un field abstracto no se presenta como un futbolista real o un ganador
    identificable inventado.

## 3. Definiciones estáticas y estado de Career

### 3.1 Capa estática de `dataVersion`

La snapshot futbolística inmutable debe poder aportar:

- `NationalTeamDefinition`;
- `InternationalCompetitionDefinition`, reutilizando el contrato general de
  `CompetitionDefinition`;
- `AwardDefinition`;
- países, confederaciones y reglas de catálogo referenciadas;
- procedencia, fecha de corte, licencias y hashes.

Una Career no modifica esas definiciones ni consulta datos reales posteriores.
El futuro ficticio se conserva en los estados de Career.

### 3.2 Capa simulada

La Career puede conservar:

- `NationalTeamState`;
- `NationalTeamHistory`;
- `InternationalCompetitionState`;
- `SelectionCompetitionField` preparado para un contexto;
- `AwardEditionState` o resultado equivalente;
- `AwardCompetitionField`;
- `StatisticalCompetitionField`;
- `AwardHistory`.

Definitions explican qué entidad, competición o premio existe en la snapshot.
States explican qué ocurrió ficticiamente dentro de una Career.

### 3.3 Ownership

| Concepto | Owner |
|---|---|
| Identidad y metadatos de selección/premio | `data-football` / `dataVersion` |
| Estado deportivo y generación de selección | World / Simulation |
| Elegibilidad nacional | boundary de National Team contra reglas versionadas |
| Convocatoria, squad y rol internacional | National Team |
| Oportunidad internacional | International Calendar / Competitions |
| Disponibilidad médica | Health |
| Disponibilidad agregada | frontera autoritativa de DR-064 |
| Minutos internacionales | Role & Minutes con contexto nacional |
| Performance internacional | Performance con contexto nacional |
| Outcome colectivo internacional | Competitions / National Team |
| Definitions, fields y outcomes de premio | Awards |
| Sporting/Public Reputation | Reputation, no Awards |
| Puntos, equivalencias y anti-duplicación | Scoring |

## 4. Modelo de National Team

### 4.1 `NationalTeamDefinition`

El contrato estático mínimo debe poder expresar:

- `nationalTeamId`;
- `countryId`;
- confederación y categoría competitiva cuando corresponda;
- referencias a competiciones autorizadas;
- reglas de catálogo necesarias para elegibilidad;
- metadatos/procedencia;
- `dataVersion`.

No incluye fuerza deportiva futura ni garantiza que el protagonista sea
elegible.

### 4.2 `NationalTeamState`

`NationalTeamState` es un estado deportivo propio de una selección y período.
Debe poder contener conceptualmente:

- `nationalTeamId`;
- `seasonId` o ciclo internacional aplicable;
- fuerza deportiva multidimensional, al menos compatible con ataque, defensa y
  control;
- `NationalTeamManagerContext`;
- `TacticalIdentity`;
- `NationalTeamSupportField`;
- generation context;
- campos de competencia por posición;
- historial agregado de resultados y continuidad;
- `selectionTrust` o incumbency del protagonista cuando exista;
- referencia al último update confirmado;
- versiones y hashes.

No contiene `financialPower`, contrato, `ClubNeed`, `PositionCompetition` de
club ni minutos de club. Puede reutilizar tipos genéricos solo cuando conservan
exactamente la misma semántica.

### 4.3 `NationalTeamContext`

Cada resolución internacional usa un snapshot causal:

```text
NationalTeamContext
  nationalTeamId
  seasonId / internationalCycleId
  selectionWindowId / competitionContextId
  managerContext
  tacticalContext
  teamStrength
  supportField
  opponentOrFieldContext
  competitionStrength
  scheduleDifficulty
  pressureExposure
  internationalMinutesOpportunity
  sourceWorldSnapshot
  versions
```

La lista es semántica, no un schema final. El contexto se congela antes de la
resolución que lo consume y no se reescribe desde su propio outcome.

### 4.4 Fuerza y soporte colectivo

`NationalTeamStrength` no es un overall del protagonista. El resto de la
selección se representa mediante `NationalTeamSupportField`, que lo excluye.

El resultado colectivo sigue la estructura:

```text
NationalTeamSupportField
+ NationalPlayerCompetitiveContribution
+ shared/context factors
+ competition-specific variance
-> NationalTeamCompetitionOutcome
```

El signo `+` expresa composición causal, no una ecuación aprobada. La
contribución del protagonista proviene de minutos y Performance internacionales
confirmados. No es `ContributionCoefficient`, PSN, CareerScore ni un rating
causal.

## 5. `NationalTeamEligibility`

### 5.1 Boundary lógico

La elegibilidad se evalúa antes de toda candidatura:

```text
NationalTeamEligibility
  playerId
  nationalTeamId
  competitionOrWindowScope
  status
  ruleRefs
  biographyRefs
  effectiveFrom
  evaluatedAtCursor
  versions
```

El status debe distinguir como mínimo:

- `ELIGIBLE`;
- `REQUIRES_PRIOR_TRANSITION`;
- `INELIGIBLE_CURRENT_STATE`.

Un dato requerido ausente o una regla no comprendida es un error de
validación/compatibilidad, no un cuarto resultado probabilístico.

Eligibility es determinística respecto del estado biográfico y las reglas
versionadas comprendidas. No tiene probabilidad ni usa log-odds. Solo una vez
confirmado `ELIGIBLE` puede resolverse la comparación probabilística.

### 5.2 Políticas futuras soportadas

El boundary debe poder representar sin implementar todavía toda la normativa:

- nacionalidad y nacionalidad deportiva;
- ascendencia o base biográfica confirmada;
- nacionalización y transición de elegibilidad;
- competiciones con restricción de edad;
- restricciones específicas de torneo;
- cambios de elegibilidad autorizados;
- compromiso, renuncia temporal, retiro internacional y eventual retorno,
  cuando las reglas aprobadas los distingan.

Una transición biográfica o reglamentaria puede ser probabilística o requerir
decisión en su sistema propietario. La evaluación de elegibilidad posterior
sigue siendo lógica.

### 5.3 Gate del vertical slice

DR-018 fija Argentina como país principal, pero no define por sí sola:

- nacionalidad inicial canónica;
- si todo jugador del slice es elegible para Argentina;
- si existe doble elegibilidad;
- cuándo una primera convocatoria compromete nacionalidad deportiva;
- reglas de renuncia, retiro o regreso;
- política mínima de torneos juveniles.

DR-068 debe resolver ese scope. Hasta entonces:

- no se presume elegibilidad argentina por jugar en Argentina;
- España como liga de destino no crea elegibilidad para su selección;
- no se genera una segunda elegibilidad sin base biográfica;
- no se implementa una normativa FIFA simplificada por inferencia.

## 6. `SelectionCompetitionField`

### 6.1 Identidad y scope

El nombre canónico es `SelectionCompetitionField`; sustituye el alias
exploratorio `NationalSelectionField`.

Cada field se identifica por:

- `countryId` / `nationalTeamId`;
- posición canónica y, cuando corresponda, demanda táctica/rol;
- `seasonId`, ventana o ciclo;
- generation/world snapshot;
- nivel/categoría de selección;
- policy/parameter set;
- versiones.

`PositionGroup` puede servir para agregación o calibración, pero la competencia
de selección usa `PositionCode` cuando la posición específica importa.

### 6.2 Contenido conceptual

El field debe poder representar:

- fuerza central de la competencia;
- profundidad efectiva;
- dispersión y colas;
- distribución de evidencia/rendimiento de candidatos;
- composición por roles o demanda táctica;
- presión de incumbencia;
- calidad generacional;
- incertidumbre del field;
- correlación con `NationalTeamStrength` y World sin duplicarla.

No materializa una plantilla completa ni una lista de futbolistas ficticios.
Puede usar componentes jerárquicos, order statistics, mixtures o top rivals
abstractos, pero la familia exacta continúa en DR-059/DR-008.

### 6.3 Generación y evolución

World puede producir un `NationalGenerationField` por país, posición y época.
Ese estado alimenta el field de una ventana y también el support field del
equipo, mediante rutas separadas para evitar doble conteo.

La evolución debe permitir:

- generaciones fuertes o débiles;
- competencia extraordinaria en una posición concreta;
- cambios de era;
- persistencia y shocks;
- trayectorias sin destino fijo.

No se simula cada futbolista y ninguna identidad recibe protección.

## 7. Pipeline de selección

El pipeline normativo es:

```text
NationalTeamEligibility
-> CandidateEvaluation
-> CallUp
-> SquadOrTournamentSelection, cuando corresponda
-> InternationalRole
-> InternationalMinutes
-> InternationalPerformance
-> NationalTeamCompetitionOutcome
```

Ninguna etapa es alias de la siguiente:

- ser elegible no implica ser candidato competitivo;
- ser candidato no implica convocatoria;
- una convocatoria no implica squad de torneo;
- entrar al squad no implica rol o minutos;
- un rol no garantiza participación;
- una actuación individual no garantiza resultado colectivo.

Cada etapa usa identidad, estado terminal y referencias causales propios. Una
decisión obligatoria usa `PendingDecision`, checkpoint y reanudación de
ADR-013.

## 8. Candidate evaluation y convocatoria

### 8.1 Evidencia autorizada

La señal de candidatura puede consumir:

- proyección autorizada de `UnderlyingPerformance`;
- `PerformanceSummary` y `SeasonPerformanceSummary`;
- `ObservedProduction`;
- minutos, exposición, fuerza de evidencia e incertidumbre;
- `effectivePosition` y breakdown posicional;
- club, liga, competición y `leagueCompetitiveStrength`;
- contexto de presión;
- `sportingReputation`, cuando exista;
- disponibilidad/estado médico comunicado;
- edad y contexto de elegibilidad;
- historial internacional e incumbency;
- `SelectionCompetitionField`;
- azar determinista.

La proyección de UnderlyingPerformance es purpose-scoped y no concede acceso a
`TrueCapabilities`, `EffectiveCapabilities`, traits ocultos o potencial
verdadero. Cuando el modelo represente lo que conoce un cuerpo técnico, la
evidencia se proyecta mediante `PlayerKnowledge` y su incertidumbre.

No se usa:

- `MarketValue`, fee o salary como mérito;
- `publicReputation` por defecto;
- CareerScore, ScoreLedger o puntos de selección;
- un overall o rating universal;
- producción bruta como única señal;
- el mismo título, contexto o reputación por varios aliases.

### 8.2 Comparación probabilística

La candidatura se compara contra el field. No se usa un corte fijo de calidad.
Si el jugador es lógicamente elegible y la oportunidad está habilitada, una
liga, edad, reputación o incumbency desfavorable puede reducir fuertemente la
probabilidad sin convertirla automáticamente en cero.

Un roster finito definido por una competición es una restricción material del
formato, no un cap editorial. Su tamaño y reglas pertenecen a
`CompetitionDefinition`/datos versionados, no a un número global hardcoded.

### 8.3 League y contexto

Los contadores observados no se reescriben:

```text
15 goals = 15 goals
```

League/club/competition strength puede modificar la evaluación de la evidencia,
su incertidumbre y el field. No convierte a una liga válida en inelegible ni
garantiza convocatoria desde una liga fuerte.

## 9. Convocatoria, squad, rol y confianza

### 9.1 Estados distintos

El modelo distingue:

- `NationalTeamCallUp`: convocatoria emitida;
- aceptación/rechazo/estado de decisión cuando la regla lo requiera;
- `TournamentSquadSelection`: inscripción deportiva en un squad concreto;
- `InternationalRole`: expectativa deportiva;
- `InternationalEffectiveUsage`: participación confirmada.

No se fusionan en un enum.

### 9.2 `InternationalRole`

La taxonomía mínima propia es:

```text
BENCH
ROTATION
STARTER
KEY_PLAYER
```

No se copia automáticamente `SportingRole` del club. Captaincy es una dimensión
separada y no cambia rol o minutos por sí sola.

### 9.3 Incumbency y selection trust

El historial puede alimentar un estado agregado
`NationalTeamSelectionTrust` o `incumbency`. Es distinto de:

- `managerTrust` de club;
- calidad o Performance;
- `sportingReputation`;
- rol internacional;
- garantía de convocatoria.

Puede modificar distribuciones futuras, pero no impone permanencia, cooldown,
convocatoria obligatoria o protección frente a cambios extremos de contexto.

## 10. Oportunidad, disponibilidad y minutos internacionales

### 10.1 `InternationalTeamMinutesOpportunity`

International Calendar/Competitions produce una oportunidad separada:

```text
InternationalTeamMinutesOpportunity
  nationalTeamId
  seasonId / cycleId
  windowOrCompetitionScope
  teamMinutes
  scheduleContext
  pressureExposure
  sourceCompetitionContext
```

No comparte `TeamMinutesOpportunity` del club. La abstracción genérica puede
reutilizarse si el discriminante de contexto evita colisiones.

### 10.2 Disponibilidad

Call-up, squad selection y disponibilidad realizada son estados diferentes.
Health conserva ownership médico. Una frontera autoritativa combina el
componente médico con disciplina y otras causas conforme a DR-064.

Debe ser válido:

```text
called up
-> partially available or unavailable
-> reduced or zero international minutes
```

National Team no genera un segundo hazard de lesión.

### 10.3 Resolución de minutos

La estructura reutiliza Role & Minutes:

```text
InternationalTeamMinutesOpportunity
+ InternationalRole
+ AvailabilityEnvelope
+ NationalTeamContext
+ deterministic variance
-> actualInternationalMinutes
```

La expresión es causal, no una ecuación aprobada. Se conservan:

```text
0 <= actualInternationalMinutes <= availableInternationalTeamMinutes
```

Rol no fija porcentaje ni garantiza minutos. Club e internacional conservan
facts y acumuladores distintos.

## 11. Performance y outcomes internacionales

### 11.1 Reutilización de Performance

Performance usa el mismo pipeline:

```text
TrueCapabilities
-> EffectiveCapabilities
-> UnderlyingPerformance
-> ObservedProduction
-> PerformanceSummary
```

La diferencia está en `PerformanceContext.kind = NATIONAL_TEAM`, el support
field, la táctica, rivales, competición, presión, minutos y parámetros
versionados. No existe una fórmula internacional alternativa incompatible.

Las stats internacionales se persisten con scope propio. No se duplican en los
acumuladores de club.

### 11.2 Competición internacional

La arquitectura soporta:

- ventanas internacionales regulares;
- torneo continental;
- World Cup;
- otras competiciones aprobadas por catálogo.

No obliga a fixtures ni partidos individuales. Puede reutilizar
`CompetitionDefinition`, `CompetitionState`, `TeamSupportField`,
`PlayerCompetitiveContribution` y outcome agregado con discriminantes de
contexto nacional.

### 11.3 Outcome colectivo

El outcome consume:

- fuerza/support field nacional;
- contexto y field rival;
- contribución internacional del protagonista;
- factores compartidos de generación/era;
- variación específica de competición.

Un gran jugador no garantiza título, clasificación o fase. Un resultado
colectivo no reescribe Performance ya cerrada.

## 12. Cadencia internacional y `SimulationCursor`

### 12.1 Conflicto vigente

ADR-013/042/043 contiene:

```text
Q1..Q4
-> COMPETITIONS
-> COMPETITION_EVENTS
-> MARKET
-> AWARDS
```

No contiene una operación explícita para convocatorias, minutos y Performance
de ventanas internacionales intercaladas con las Q de club. Resolver toda la
selección en `COMPETITIONS` post-Q4 perdería interacciones causales con
disponibilidad y carga durante la temporada. Ejecutarla dentro de la producción
de club sin un contexto separado mezclaría minutos y estados.

Por tanto, esta especificación no inventa un orden. DR-059 junto con DR-021
debe decidir y versionar:

- ubicación de ventanas regulares y torneos;
- snapshots de Health/Availability por ventana;
- suboperaciones y `operationKey`;
- relación con Q1–Q4 y `COMPETITIONS`;
- acumulación de carga internacional;
- decisiones de primera convocatoria, torneo, renuncia o capitanía;
- checkpoints, streams y cadence neutrality;
- cualquier enmienda de ADR-013/043.

Cambiar el plan afecta `engineVersion`.

### 12.2 Eventos

Sin modificar el cursor por inferencia:

- hechos de resultado internacional confirmados antes de
  `COMPETITION_EVENTS` pueden habilitar esa ventana;
- un evento que requiere un premio espera `AWARD_EVENTS`;
- una decisión internacional se interrumpe en su boundary mecánico real;
- una ventana de contenido nunca sustituye una fase mecánica faltante.

## 13. `AwardDefinition`

### 13.1 Definición estática

Cada premio usa una definición versionada capaz de expresar:

- `awardId`;
- identidad/revisión de catálogo;
- `category`;
- `scope`;
- `cadence`;
- `evaluationFamily`;
- predicado de elegibilidad;
- período evaluado;
- posiciones/grupos elegibles cuando corresponda;
- competiciones/contextos aplicables;
- evidence policy;
- field model reference;
- política de reputación/percepción;
- outcome/placement policy;
- reglas de empate compartido cuando existan;
- `dataVersion`.

Los criterios son declarativos y validados. No ejecutan código arbitrario ni
quedan dispersos en handlers del engine.

Los puntos, equivalencias y anti-duplicación no forman parte de la decisión de
Awards. `scoringVersion` puede mapear `awardId` a reglas de puntos mediante un
catálogo separado.

### 13.2 Definition frente a edición

`AwardDefinition` describe el premio. `AwardEditionState`/`AwardEditionResult`
describe un período ficticio concreto:

- `awardEditionId`;
- `awardId`;
- período/scope;
- snapshot de elegibilidad y field;
- outcome;
- ganador/placement cuando corresponda;
- referencias causales;
- versiones.

Una corrección de catálogo no reescribe ediciones cerradas.

## 14. Taxonomía y elegibilidad de premios

### 14.1 Ejes ortogonales

La mecánica de evaluación distingue:

```text
AwardEvaluationFamily
  COMPARATIVE_JUDGED
  STATISTICAL
```

El ámbito/categoría distingue:

```text
AwardCategory
  GLOBAL
  LEAGUE
  TOURNAMENT
  POSITIONAL
  YOUTH
  TEAM_SELECTION
  SPECIAL
```

`POSITIONAL` y `SPECIAL` son categorías, no una tercera fórmula universal. Un
premio posicional puede ser comparativo o estadístico y debe declarar ambas
dimensiones. Esta separación evita mezclar “a quién compara” con “cómo decide”.

### 14.2 `AwardEligibility`

La elegibilidad se resuelve desde facts cerrados y reglas de
`AwardDefinition`:

```text
AwardEligibility
  awardEditionId
  playerId
  status
  ruleRefs
  evidencePeriod
  positionScope
  competitionScope
  causalFactRefs
  versions
```

No existe un mínimo universal de minutos, edad, goles o títulos. Si un premio
requiere participación, edad, competición, posición o antecedente concreto, la
Definition lo declara como restricción lógica.

La ausencia de evidencia suficiente puede:

- hacer fallar una regla de elegibilidad explícita;
- reducir fuerza de evidencia;
- requerir una transición causal previa;
- mantener candidatura extremadamente improbable.

No se convierte automáticamente en cero salvo que la regla o el estado lo haga
lógicamente imposible.

### 14.3 Posición

Cada Definition declara uno de:

- `POSITION_SPECIFIC`;
- `POSITION_GROUP`;
- `POSITION_AGNOSTIC`.

Se aplican ADR-011/044:

- posiciones específicas usan `PositionCode`;
- grupos se derivan, no se guardan en `eligiblePositions`;
- las secundarias sin minutos no conceden elegibilidad;
- el período usa posición dominante calculada desde uso efectivo del mismo
  scope;
- una reconversión posterior no reescribe el premio.

DR-049 sigue bloqueando ponderación, scopes sin minutos y empates. DR-048 sigue
bloqueando premios fuera de `GK`/`CM`/`ST` en el slice.

### 14.4 Youth

Las condiciones juveniles pertenecen a `AwardDefinition` y `dataVersion`. No
existe un threshold de edad global hardcoded dentro del engine.

## 15. Fields de premios

### 15.1 `AwardCompetitionField`

Para `COMPARATIVE_JUDGED`, el field se identifica por:

- `awardEditionId`;
- categoría/scope/período;
- posición/cohorte cuando aplique;
- world/competition snapshot;
- policy/parameter set;
- versiones.

Debe poder representar:

- effective field size;
- field strength;
- distribución conjunta de candidate signals;
- dispersión y colas;
- calidad de era/generación;
- correlaciones entre rendimiento, producción, títulos, presión y reputación;
- judging/perception context;
- incertidumbre residual.

No materializa todos los candidatos. Un rival abstracto no se presenta como
persona real.

### 15.2 `StatisticalCompetitionField`

Para `STATISTICAL`, el field representa la distribución competitiva del
contador o métrica autorizada:

- población/scope elegible;
- distribución de producción real;
- order statistics relevantes;
- dispersión y colas;
- contexto de temporada/competición;
- política de empates;
- versiones.

Un total fijo no garantiza ganar. La misma cantidad de goles, asistencias,
atajadas u otra métrica puede ganar o perder según el field de esa edición.

El field no inventa contadores de rivales individuales si una distribución
agregada satisface los consumidores.

## 16. Candidate signal de premios

### 16.1 Inputs autorizados

Según `AwardDefinition`, la señal puede consumir:

- `SeasonPerformanceSummary`;
- proyección purpose-scoped de `UnderlyingPerformance`;
- `ObservedProduction`;
- exposición, evidencia e incertidumbre;
- `pressureBreakdown`;
- outcomes, títulos, fases y qualification de club;
- outcomes y Performance internacionales;
- rol y contexto;
- `sportingReputation`;
- `publicReputation` solo cuando la semántica de votación lo autorice;
- contribución posicional apropiada;
- field/world/era context;
- azar determinista de evaluación.

No consume:

- CareerScore, ScoreLedger o puntos del premio;
- MarketValue, fee o salary como mérito;
- capabilities verdaderas o potencial verdadero;
- un rating universal;
- un título dos veces mediante outcome y reputación sin rutas separadas.

### 16.2 Evidencia y anti-doble-conteo

Cada componente de señal declara:

- evidence key;
- source facts;
- finalidad;
- período;
- transformación;
- ruta de contexto;
- incertidumbre;
- versión.

Un título puede influir como logro confirmado y sporting reputation puede
aportar memoria previa, pero el mismo título no vuelve a sumarse mediante ambos
aliases. Un momento importante usa `pressureBreakdown` o un fact específico
autorizado; nunca un bonus editorial.

### 16.3 Títulos y contexto

Un título puede aumentar la señal, pero:

- no garantiza un premio;
- no es requisito salvo que la Definition lo declare;
- no modifica producción cruda;
- no vuelve al pasado para cambiar Performance.

La fuerza competitiva contextual puede influir evaluación sin reemplazar IJL ni
reescribir contadores.

## 17. Evaluación posicional

### 17.1 ST

La señal puede usar:

- contribución ofensiva subyacente;
- goles y asistencias;
- oportunidades, chance quality y conversión/creación autorizadas;
- exposición, presión y contexto;
- outcomes colectivos sin duplicación.

### 17.2 CM

No se reduce a goles/asistencias. Debe poder usar:

- `progressionImpact`;
- `creativeImpact`;
- `defensiveContribution`;
- `controlImpact`;
- goles/asistencias cuando correspondan;
- exposición, presión y contexto.

### 17.3 GK

Debe poder usar:

- `shotStoppingPerformance`;
- `commandPerformance`;
- `distributionPerformance`;
- atajadas, goles concedidos contextualizados y vallas invictas;
- exposición/oportunidades enfrentadas;
- presión y contexto defensivo.

Goles concedidos no son proxy de calidad. DR-055/063 todavía debe decidir si
errores, penales y contadores adicionales de distribución se persisten para el
slice y qué premios los consumen.

### 17.4 Sparse exposure

Una producción extraordinaria con pocos minutos no se censura. La comparación
conserva por separado:

- producción observada;
- volumen;
- fuerza de evidencia;
- incertidumbre.

La elegibilidad solo exige un mínimo si la Definition lo declara; la evaluación
no finge que muestras pequeñas y grandes tienen igual evidencia.

## 18. Outcome comparativo, ruido y múltiples premios

### 18.1 `AwardComparativeOutcome`

El resultado puede representar:

- `NOT_SELECTED`;
- `NOMINATED`;
- `SHORTLISTED`;
- `PLACED`;
- `WINNER`.

La lista expresa capacidad conceptual; cada Definition declara qué niveles son
aplicables y persistibles. No es obligatorio materializar todos los puestos.

La comparación debe ser conjunta o de orden estadístico. No se reemplaza por
varios Bernoulli independientes.

### 18.2 Judging noise

Un premio juzgado puede usar:

- variación de jurado agregada;
- efecto de reputación permitido;
- contexto regional permitido;
- incertidumbre residual.

No simula votantes individuales. El ruido no borra evidencia deportiva ni
convierte PublicReputation en causa universal.

### 18.3 Empates

La política de empate pertenece a `AwardDefinition` y su familia:

- ganador único;
- ganador compartido cuando el premio real lo admita;
- desempate determinista/probabilístico versionado;
- placement compartido.

No se elige una política global por inferencia.

### 18.4 Múltiples premios y scoring

Un jugador puede obtener múltiples premios compatibles en una temporada. Awards
no reduce, descuenta ni fusiona resultados por equivalencia de scoring.

La regla de MASTER_SPEC para premios globales equivalentes —100 % y 60 %— y
cualquier otra anti-duplicación pertenecen a DR-010/scoring. Awards emite cada
resultado deportivo real una sola vez.

### 18.5 Awards, records y achievements

`AwardWon`, `RecordBroken` y `CompetitionAchievement` son facts distintos.
Awards no detecta records salvo que una Definition sea realmente un premio
basado en esa estadística; incluso entonces el récord histórico permanece un
hecho separado.

## 19. Timing, eventos e historia

### 19.1 Timing de `AWARDS`

Se conserva el plan de ADR-013/043:

```text
COMPETITIONS
-> COMPETITION_EVENTS
-> MARKET
-> MARKET_EVENTS
-> AWARDS
-> AWARD_EVENTS
```

`AWARDS` consume snapshots cerrados del período. Si Market cambió el club antes
de Awards, el premio sigue evaluando segmentos históricos de la temporada y no
el contexto actual como sustituto.

Un outcome de premio no modifica Performance, títulos o selección que lo
causaron.

### 19.2 `AWARD_EVENTS`

Un evento que requiere `AwardWon` solo se evalúa después de confirmar ese fact.
Puede hacerlo en `AWARD_EVENTS`, `WORLD_EVENTS` o `POSTSEASON_EVENTS` si su
Definition lo permite. Nunca se evalúa retroactivamente.

Cada ventana admite cero o múltiples oportunidades y no comparte cupo con otra.

### 19.3 Historia mínima

`NationalTeamHistory` debe poder conservar:

- evaluaciones/transiciones de elegibilidad relevantes;
- convocatorias y decisiones;
- squads de torneo;
- roles, minutos, apariciones y titularidades internacionales;
- Performance/producción por selección y competición;
- logros/títulos;
- captaincy cuando exista;
- renuncia/retiro/regreso internacional;
- causal references y versiones.

`AwardHistory` debe poder conservar:

- edición y Definition;
- elegibilidad/candidatura solo cuando tenga consumidor;
- nominación/shortlist/placement cuando se persistan;
- `AwardWon`;
- resultados del protagonista;
- outcome de field cuando el protagonista no ganó;
- causal references y versiones.

Si gana el field abstracto, el resultado puede usar una referencia estable
`ABSTRACT_FIELD_WINNER`; no se inventa nombre o identidad real. Un futuro
sistema de rivales puede materializar actores mediante otra decisión.

## 20. Interfaces

### 20.1 National Team consume

| Proveedor | Contrato | Restricción |
|---|---|---|
| Player/Biography | posición, edad y bases biográficas de elegibilidad | No inventa nacionalidad/ascendencia |
| Performance | summary, production, exposición, presión y evidencia purpose-scoped | No overall ni capabilities verdaderas |
| Club/League/Competition | contexto, fuerza y outcomes cerrados | No reescribe contadores |
| Health/Availability | estado médico comunicado y aggregate aplicable | No duplica hazard |
| World | NationalTeamState, generation/selection fields y calendario | No población completa |
| Reputation | sporting reputation | Public reputation no es default |
| Events/Decisions | transiciones causales autorizadas | No código arbitrario ni score |

### 20.2 National Team produce

- call-up/squad/role facts;
- minutos y Performance internacionales con contexto propio;
- outcomes/logros colectivos internacionales;
- historia y facts hacia Reputation/Social, que los transforma mediante
  `EvidenceKey`/`PublicAttentionSignal` sin deltas directos;
- facts autorizables para Awards y Scoring;
- elegibilidad causal para `COMPETITION_EVENTS` y eventos posteriores.

### 20.3 Awards consume

- Performance y producción cerradas;
- outcomes de club e internacionales;
- World fields;
- posición/cohorte del período;
- sporting reputation y, si la Definition lo permite, public reputation;
- AwardDefinition y evidence policy versionadas.

### 20.4 Awards produce

- resultado de edición;
- nominación/placement cuando tengan consumidor;
- `AwardWon`;
- historial;
- facts hacia Reputation/Social; `AwardWon` puede originar una señal deportiva
  y otra pública con la misma causa, sin aplicar dos veces el premio;
- facts candidatos para Scoring;
- facts disponibles para `AWARD_EVENTS`.

`PlayerPlayingStatus.RETIRED` no equivale a retiro internacional ni modifica
`NationalTeamEligibility` por sí solo. Una futura política de regreso o retiro
internacional continúa en DR-068; no se infiere desde el retiro de clubes.

### 20.5 Frontera con Transfers

Selection/Awards pueden consumir club, liga, competencia y segmentos multiclub
confirmados. Un movimiento:

- no crea elegibilidad nacional;
- no concede convocatoria;
- no recalcula Performance;
- no otorga premio;
- no convierte MarketValue, fee o salary en mérito.

El club vigente al resolver un premio no reemplaza los contextos históricos del
período evaluado.

### 20.6 Frontera con Scoring

- National Team/Awards no importan `packages/scoring`;
- PSN, PPI, CC, puntos base y equivalencias no participan en outcomes;
- Awards no aplica anti-duplicación;
- scoring consume únicamente facts allowlisted por DR-063;
- Content no puede fabricar call-ups, títulos o awards con el fin de crear una
  entrada de score.

## 21. Outputs, estado y traza

### 21.1 National Team

| Concepto | Clasificación por defecto | Semántica |
|---|---|---|
| `NationalTeamEligibilityEvaluated` | Traza/snapshot | Resultado lógico, reglas y biografía |
| `NationalTeamCandidateEvaluated` | Traza interna | Señal, field, evidencia e incertidumbre |
| `NationalTeamCallUpIssued` | Fact candidato | Convocatoria identificada; no prueba minutos |
| `TournamentSquadSelected` | Fact candidato | Inclusión en squad/competición |
| `InternationalRoleAssigned` | Snapshot/fact candidato | Rol propio, contexto e incumbency |
| `MinutesRecorded` con contexto nacional | Fact deportivo candidato | Minutos internacionales; no se duplica con otro nombre |
| `ObservedProductionRecorded` con contexto nacional | Fact deportivo candidato | Stats internacionales |
| `PerformanceSummaryRecorded` con contexto nacional | Fact/snapshot candidato | Performance internacional |
| `CompetitionFinished` con contexto nacional | Outcome canónico | Resultado colectivo internacional |
| `NationalTeamCompetitionAchievement` | Proyección/fact candidato | Logro si tiene consumidor, sin duplicar outcome |

No se crea `InternationalMinutesRecorded` o
`InternationalPerformanceRecorded` como duplicate aliases si los contracts
genéricos ya contienen un discriminante nacional.

### 21.2 Awards

| Concepto | Clasificación por defecto | Semántica |
|---|---|---|
| `AwardEligibilityEvaluated` | Traza/snapshot | Resultado del predicado de Definition |
| `AwardCandidateEvaluated` | Traza interna | Signal y comparación con field |
| `AwardNominated` | Fact opcional | Solo si nomination es un resultado persistible |
| `AwardPlacementRecorded` | Fact opcional | Solo placements con consumidor |
| `AwardEditionResolved` | Snapshot/outcome | Resolución completa de la edición |
| `AwardWon` | Fact canónico | Premio ganado una vez por `awardEditionId` |

`StatisticalAwardWon` no se emite como tipo paralelo: `AwardWon` declara
`evaluationFamily = STATISTICAL`. Así se evita duplicar el mismo premio.

**Cierre G3B Bloque 10:** `NationalTeamCallUpIssued`,
`TournamentSquadSelected`, `InternationalRoleAssigned` y `AwardWon` son facts
canónicos. Minutos/producción/Performance/Competition reutilizan los tipos
genéricos con `contextType = NATIONAL_TEAM`. Eligibility y candidate
evaluations son internal signals; `AwardEditionResolved`, summary.
`AwardNominated`/`AwardPlacementRecorded` solo se emiten para outcomes no
ganadores con consumidor. Scoring aplica equivalencias; Awards conserva facts.

### 21.3 Cierre de DR-063

DR-063 queda resuelta estructuralmente por
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md): allí se fijan nombres,
clasificación, payload mínimo, causal references, orden, identidad, aliases y
allowlist. Los schemas implementables deben conformar ese contrato.

Elegibilidad o candidatura sin outcome no crea score ni descubrimiento por sí
sola.

## 22. Determinismo, correlación y versionado

Toda resolución debe poder reconstruir:

```text
definitions/dataVersion
-> world/national snapshot
-> eligibility
-> candidate field and evidence
-> call-up/squad/role/minutes/performance
-> international outcome
-> award definitions/fields/evidence
-> award outcomes
```

Se conservan:

- Career, season/cycle, phase/window y `operationKey`;
- policy/parameter set hashes;
- evidence keys y causal facts;
- contextos de stream y ordinales;
- snapshots del field;
- outcomes y estados anteriores/posteriores cuando corresponda;
- `VersionSet`.

Namespaces conceptuales mínimos separados:

```text
selection.eligibility_transition
selection.field
selection.callup
selection.role
selection.minutes
selection.performance
selection.outcome
awards.field
awards.candidate
awards.judging
awards.statistical
awards.placement
```

Los nombres finales y contextos canónicos continúan pendientes. Consumir azar
de Awards no desplaza streams de Selection, Performance, Health o World.

Cambiar definitions usa `dataVersion`; cambiar matemática o plan causal usa
`engineVersion`; cambiar parámetros que participan en replay usa la versión
participante apropiada; cambiar puntos o anti-duplicación usa
`scoringVersion`.

## 23. Scope del vertical slice

El scope aprobado conserva:

- Argentina como país principal;
- España como liga europea de destino;
- `GK`, `CM` y `ST`;
- Carrera rápida;
- torneos principales de selección necesarios;
- un premio global;
- un premio juvenil;
- tres premios posicionales o de competición.

La estructura mínima requiere:

1. `NationalTeamDefinition` real de Argentina y su contexto agregado;
2. un `NationalTeamState`/support field suficiente para resolver una trayectoria
   elegible sin simular plantilla;
3. `SelectionCompetitionField` para `GK`, `CM` y `ST`;
4. calendario/CompetitionDefinition suficiente para las competiciones
   internacionales aprobadas;
5. pipeline completo de convocatoria a outcome;
6. cinco `AwardDefinition` conforme al conteo de MASTER_SPEC §34.5;
7. fields comparativos/estadísticos según la familia de cada Definition;
8. al menos un outcome de premio validable por cada familia habilitada;
9. historia, replay y facts candidatos.

Este alcance no decide:

- que todo jugador sea elegible para Argentina;
- una segunda selección por jugar en España;
- IDs/nombres concretos de torneos o premios;
- cómo se distribuyen los tres premios posicionales/de competición;
- si se habilitan premios fuera de `GK`/`CM`/`ST`;
- calendario exacto, reglamentos o roster sizes;
- puntos o equivalencias.

Esos gates pertenecen a DR-021/025/048/049/059/060/068 y DR-010.

## 24. Parameter Registry Candidates

### 24.1 Selection

- candidate-signal transforms y pesos;
- `SelectionCompetitionField` family;
- field strength, depth, dispersion y tails;
- distributions por país/posición/generación;
- generación/evolución de `NationalGenerationField`;
- relación generation field/support field/selection field;
- league, club y competition context evaluation;
- evidence strength/uncertainty weighting;
- age/context effects;
- sporting reputation effect;
- incumbency y `NationalTeamSelectionTrust`;
- call-up, squad y role distributions;
- role persistence;
- international minute-share distributions;
- opportunity/calendar mapping;
- availability mapping;
- NationalTeamStrength y support field;
- player contribution effect;
- outcome variance/correlations;
- pressure exposure/effect;
- generation evolution;
- precision/quantization;
- namespaces y stream contexts;
- golden fixtures;
- Monte Carlo targets por país, posición, era, rol y torneo.

### 24.2 Awards

- award candidate weights;
- award-specific declarative criteria;
- title/context effects;
- pressure effects;
- sporting/public reputation effects por Definition;
- judging variance;
- regional/context judging effects;
- `AwardCompetitionField` distributions;
- `StatisticalCompetitionField` distributions;
- effective field size, strength, dispersion y tails;
- position-specific evaluation;
- evidence/uncertainty weighting;
- placement/order-statistic model;
- nomination/shortlist policy;
- tie model;
- sparse exposure handling;
- precision/quantization;
- namespaces y stream contexts;
- golden fixtures;
- Monte Carlo targets por award, position, category, era y competition.

Ningún valor queda aprobado ni hardcoded por este documento.

## 25. Resolución del Design Board

| ID | Estado tras Bloque 8 | Cierre estructural | Pendiente |
|---|---|---|---|
| G3B-H01 | Parcial | `SelectionCompetitionField` canónico por país/posición/generación y field mundial agregado. | Familia de distribución, parámetros, streams y calibración. |
| G3B-H02 | Parcial | Eligibility lógica separada, evidence contract y comparación probabilística sin threshold. | Fórmula, DR-068 y timing de DR-059/021. |
| G3B-H03 | Parcial | Rol/minutos/Performance reutilizan resolvers comunes con contexto nacional propio. | Distribuciones, parámetros, calendario/cursor y facts finales. |
| G3B-H04 | Parcial | Estado/contexto/tournament abstractions y outcome colectivo quedan definidos sin fixtures. | Competencias/formatos, calendario y suboperaciones exactos. |
| G3B-H05 | Calibración externalizada | Registry y targets obligatorios. | Valores y fixtures aprobados. |
| G3B-I01 | Resuelta estructuralmente | `AwardDefinition` data-driven posee eligibility, período, scope y evidence policy; no hay mínimo universal. | Catálogo concreto, DR-049 y schemas DR-063. |
| G3B-I02 | Parcial | Fields comparativo y estadístico quedan separados y ligados a edición/era/contexto. | Distribuciones, parámetros, streams y calibración. |
| G3B-I03 | Parcial | Signal, evidence keys, outcome ordinal y judging noise quedan estructurados. | Fórmula, empate cuantitativo, precisión y fixtures. |
| G3B-I04 | Parcial | Definition declara position/group/agnostic y usa historia efectiva del período. | Función de dominancia DR-049 y alcance DR-048. |
| G3B-I05 | Calibración/contenido externalizado | Catálogo y matemática viven en releases/versiones. | IDs reales, cinco Definitions, criterios y valores aprobados. |

## 26. Decisiones todavía abiertas

### DR-059

Permanece `BLOCKER_G3` por:

- fórmula/distribución del field y candidate signal;
- ubicación exacta de ventanas internacionales en el cursor;
- calendario, roster/squad y torneos;
- role/minute/performance parameters;
- streams, precisión, fixtures y Monte Carlo;
- schemas concretos conformes a facts DR-063/ADR-010;
- elegibilidad DR-068.

### DR-060

Permanece `BLOCKER_G3` por:

- distribuciones de fields;
- fórmula de candidate signal y comparación;
- judging noise, placement y empates;
- parámetros por Definition;
- posición dominante DR-049;
- métricas GK adicionales DR-055/063;
- catálogo real DR-025;
- facts, streams, precisión, fixtures y Monte Carlo.

### Otros gates

- DR-008 integra matemática ejecutable;
- DR-010 cierra PSN/PPI, equivalencias y anti-duplicación;
- DR-021 cierra calendario/tiempo;
- DR-022 cierra matemática de mundo, selection fields y support fields;
- DR-025 cierra identidades, fuentes y licencias;
- DR-048/049 cierran scope y dominancia posicional;
- DR-055/056 cierran Performance/evidencia/dynamic states;
- DR-063 cierra facts;
- ADR-072/DR-064 ya cierran disponibilidad no médica; Selection consume el
  aggregate;
- DR-068 cierra nacionalidad y elegibilidad del slice.

## 27. Gates y evidencia requerida

Antes de implementar:

1. Definition y State de selección/premio permanecen separados;
2. Eligibility no consume azar y distingue transición previa de imposibilidad;
3. el slice no presume elegibilidad por país de liga;
4. convocatoria no usa overall, MarketValue o threshold;
5. field es específico por país/posición/generación y no población completa;
6. candidatos válidos conservan probabilidad positiva;
7. roles/minutos de club y selección no se mezclan;
8. `InternationalRole` no copia SportingRole;
9. call-up, squad, rol, minutos y outcome son etapas distintas;
10. Health no se duplica y disponibilidad puede producir cero minutos tras
    convocatoria;
11. Performance internacional usa el pipeline común con contexto propio;
12. support field excluye al protagonista;
13. el protagonista no garantiza resultado colectivo;
14. DR-059/021 cierra cursor antes de ejecutar ventanas regulares;
15. AwardDefinition es declarativa y versionada;
16. comparative y statistical fields no se confunden;
17. no existe threshold universal de premio;
18. ST, CM y GK usan evidencia apropiada;
19. sparse exposure no se censura;
20. títulos no garantizan premio ni se duplican mediante reputación;
21. judging noise no reemplaza mérito;
22. múltiples premios compatibles pueden ocurrir;
23. Awards no aplica anti-duplicación de score;
24. Award no se confunde con record;
25. `AWARD_EVENTS` solo observa outcomes confirmados;
26. facts genéricos con contexto no se duplican con aliases internacionales;
27. `AwardWon` es único por edición y `StatisticalAwardWon` no lo duplica;
28. streams de Selection/Awards son independientes;
29. parámetros, precisión y versiones están aprobados;
30. golden/property tests y Monte Carlo cumplen targets;
31. catálogo del slice contiene exactamente el alcance aprobado;
32. no se implementa gameplay hasta cerrar los blockers aplicables.
