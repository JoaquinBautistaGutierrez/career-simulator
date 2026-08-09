# ADR-075: Matemática de Club, Competitions y World

- Estado: Aceptado — familias y ecuaciones; calibración, data y movilidad pendientes
- Fecha: 2026-07-29
- Decisiones relacionadas: DR-021 (parcial), DR-022
  (`PARTIAL_CALIBRATION`) y DR-065 (abierta)
- Refina: ADR-013, ADR-022, ADR-042, ADR-054, ADR-055, ADR-057, ADR-070,
  ADR-072, ADR-073 y ADR-074
- Especificación:
  [CLUB_COMPETITION_WORLD_MATH_SPEC.md](../CLUB_COMPETITION_WORLD_MATH_SPEC.md)

## Contexto

ADR-022 separó definitions y states, prohibió `ClubOverall` causal, fijó el
support field y dejó abierta la matemática de calendario, outcomes,
correlaciones y evolución multi-década. G3C-3 a G3C-5 ya requieren producers
numéricos concretos para oportunidad, táctica, competencia, contexto de
Performance, congestión, training, calidad médica y desarrollo.

Sin una decisión transversal, una implementación podría:

- usar un overall como causa;
- proteger clubes grandes mediante floors;
- contar fases de copa no alcanzadas;
- sortear liga/copa/continental de forma independiente;
- incluir dos veces al protagonista;
- usar IJL como fuerza dinámica;
- actualizar Club y League en un loop instantáneo;
- alterar Q cerradas para acomodar una progresión;
- aplicar promoción/descenso sin resolver DR-065.

## Decisión

### Estado y evolución

Strengths, prestige, financialPower, stability, qualities, manager, táctica,
competencia posicional y league strength son states acotados `0..10000`. Sus
transiciones usan AR(1) mean-reverting en logit seguro, shocks Normal
jerárquicos y cuantización `ROUND_HALF_EVEN`.

Attack, defense y control evolucionan separadamente. Prestige posee mayor
persistencia que sporting strength en V1. Finance y stability tienen procesos
propios; ninguna dimensión garantiza outcomes ni impone floors por identidad.

### Factores y ciclos

Se adopta:

```text
global -> regional -> league -> club-season
       -> competition-specific -> residual
```

Cada factor se samplea una vez por scope. World cycles son factores continuos
AR(1) para football strength, economía y talento/desarrollo. No existen eras
guionadas ni una máquina discreta de regímenes en V1.

### Manager, táctica y competencia

Manager turnover usa cumulative hazard sobre underperformance relativa,
stability, expectation gap, tenure y contexto. No tiene threshold ni cooldown.
Un cambio genera quality, development influence y TacticalIdentity mediante un
factor model Normal correlacionado.

`TacticalFit` se deriva de PositionSuitability, features del jugador y
mismatch cuadrático ponderado con demandas tácticas. `PositionCompetition`
evoluciona por Position mediante AR(1) en logit y fields agregados, sin
compañeros individuales.

### Calendario agregado

CompetitionDefinition declara un phase graph asignado a Q y exposición en
match equivalents enteros. `TeamMinutesOpportunity` incluye solo fases
garantizadas o alcanzadas antes de esa Q.

Para preservar ADR-013/042, una competición knockout confirma un
`CompetitionProgressionCheckpoint` como suboperación de
`CONSEQUENCES(Qn)`. Ese checkpoint usa contribución ya cerrada, habilita fases
de Q futuras y no emite `CompetitionFinished`. No añade una fase top-level al
cursor. `COMPETITIONS` después de Q4 consolida checkpoints y emite el outcome
sin volver a samplear.

### Outcomes

Liga usa noisy utility con Normal shocks y canonical rank. Copa y continental
usan un field agregado por phase, log-odds de avance y
`BinomialInverseCdfV1(n=1,p)`. `clubSeasonShock` correlaciona competiciones y
el residual específico permite resultados divergentes.

Si el club seguido no gana una copa, la identidad de champion se samplea
mediante stable softmax/categorical sobre un candidate set de IDs reales. Un
field abstracto nunca se publica como champion.

`TeamSupportField` excluye al protagonista.
`PlayerCompetitiveContribution` se deriva de exposure, evidence, Performance
contextual y residuals de producción; no usa score/CC y entra una sola vez.
Una contribución finita no determina el outcome.

### Mundo, LeagueCompetitiveStrength e IJL

Club, League y World candidates se calculan desde un snapshot previo común y se
confirman atómicamente. No existe feedback `Club[t+1] -> League[t+1] ->
Club[t+1]`.

`leagueCompetitiveStrength` usa aggregate previo de clubs, resultados
internacionales cerrados y ciclo regional. IJL no participa en gameplay y
permanece gobernado por data/scoring versions.

### Movilidad

El ranking y reglas declarativas determinan
`MobilityTransitionRequest`. Aplicar membresía, materializar promoted clubs y
continuar fuera del tier pertenecen a DR-065. No se aprueba
`ExternalClubPool`, no se inventan identidades y no se mueve al protagonista.

## Alternativas rechazadas

1. ClubOverall causal.
2. Sporting strength, prestige y finance como un único state.
3. Identity floors o immunity.
4. Fixtures completos como requisito.
5. Contar exposición condicional antes de advance.
6. Añadir una fase nueva al cursor para cada ronda.
7. Resolver toda la copa después de Q4 ignorando exposición.
8. Títulos Bernoulli independientes.
9. Baseline que ya contiene al protagonista.
10. Plackett-Luce en V1 sin necesidad frente a noisy utility.
11. World regimes guionados.
12. Feedback simultáneo Club/League/World.
13. IJL dinámico.
14. Aplicar movilidad por inferencia.

## Consecuencias

- G3B-F05/F06/J02/J03/J04 dejan de estar abiertas por familia matemática y
  pasan a `PARTIAL_CALIBRATION`.
- DR-022 pasa a `PARTIAL_CALIBRATION`: quedan values, targets, data, schemas,
  goldens y policy DR-065.
- DR-021 queda parcialmente resuelta para calendario club agregado y
  progresión Q; conserva fecha/label, extrapolación, international calendar y
  Market boundaries.
- DR-065 permanece `BLOCKER_G3`.
- Role, Performance, Health y Development reciben producers matemáticos sin
  reabrir sus ecuaciones.
- G3C-7 puede consumir financial/world context, pero no cerrar Transfers aquí.

## Tests y gates

- goldens de evolución de club/world y manager;
- TeamMinutesOpportunity exacta y cero exposure de fases no alcanzadas;
- checkpoint Q sin replay de outcomes;
- ranking/champion canónicos;
- knockout con field y sampler normativo;
- support field sin protagonista;
- correlación entre competiciones y stream isolation;
- IJL ausente de gameplay;
- no floors por identidad;
- mobility request sin aplicación antes de DR-065;
- Monte Carlo de persistencia, títulos, upsets, ciclos y tails;
- `engineVersion + parameterSetHash` conforme a ADR-070.

Cambiar equation, ordering, phase checkpoint semantics, sampler,
quantization o stream contract requiere revisar este ADR, cambiar
`engineVersion` y publicar nuevos goldens.

## Referencias

- [Mathematical Calibration Contract](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Club/Competition/World structural spec](../CLUB_COMPETITION_WORLD_SPEC.md)
- [Club/Competition/World Math](../CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [ADR-013](./013-season-state-machine.md)
- [ADR-022](./022-club-competition-world-model.md)
- [ADR-042](./042-season-health-performance.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [ADR-072](./072-role-minutes-and-availability-mathematics.md)
- [ADR-073](./073-performance-production-form-mathematics.md)
- [ADR-074](./074-health-injury-recovery-mathematics.md)
- [DR-021](../DECISIONS_REQUIRED.md#dr-021--calendario-fecha-inicial-y-evolución-de-formatos)
- [DR-022](../DECISIONS_REQUIRED.md#dr-022--modelo-agregado-de-competiciones-y-mundo)
- [DR-065](../DECISIONS_REQUIRED.md#dr-065--scope-competitivo-pools-externos-y-continuidad-fuera-del-tier)
