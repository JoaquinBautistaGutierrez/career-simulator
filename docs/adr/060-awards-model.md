# ADR-060: Estructura de premios

- **Estado:** Aceptado — alcance estructural; DR-060 permanece parcialmente
  abierta
- **Fecha:** 2026-07-28
- **Decisión relacionada:** DR-060
- **Especificación normativa:**
  [`../NATIONAL_TEAM_AWARDS_SPEC.md`](../NATIONAL_TEAM_AWARDS_SPEC.md)
- **Aclara:** ADR-011, ADR-014, ADR-018, ADR-022, ADR-043, ADR-044 y ADR-055

## Contexto

Los premios necesitan comparar al protagonista contra competencia no simulada
individualmente. También deben distinguir premios juzgados, estadísticos,
posicionales y juveniles, preservar posiciones `GK`/`CM`/`ST`, permitir
múltiples premios y entregar facts a Scoring sin calcular puntos.

Sin una frontera explícita, una implementación podía:

- usar CareerScore o un threshold fijo;
- sortear cada premio como Bernoulli aislado;
- tratar goles/asistencias como señal universal;
- confundir categoría posicional con fórmula estadística;
- fijar thresholds juveniles o de minutos dentro del engine;
- duplicar títulos mediante reputación;
- aplicar anti-duplicación de puntos en Awards;
- confundir awards con records;
- evaluar contenido antes de `AWARD_EVENTS`;
- inventar candidatos o ganadores identificables.

Las fórmulas, fields, empates, catálogo y parámetros siguen pendientes. Este ADR
fija únicamente la estructura.

## Decisión

### Definition y edición

`AwardDefinition` es data-driven, inmutable y versionada. Declara identidad,
categoría, scope, cadence, evaluation family, eligibility, período,
posición/grupo, contexto, evidence policy, field y outcome policy.

`AwardEditionState`/`AwardEditionResult` conserva la resolución ficticia de un
período. Los puntos y equivalencias viven en Scoring, no en Awards.

### Taxonomía

La evaluación distingue:

```text
COMPARATIVE_JUDGED | STATISTICAL
```

La categoría distingue:

```text
GLOBAL | LEAGUE | TOURNAMENT | POSITIONAL | YOUTH |
TEAM_SELECTION | SPECIAL
```

Así un premio posicional puede ser comparativo o estadístico sin crear una
tercera fórmula ambigua.

### Elegibilidad

`AwardEligibility` se evalúa desde facts cerrados y predicados declarativos. No
existe un mínimo global de minutos, edad, producción o títulos.

La Definition declara restricciones reales. Youth thresholds pertenecen a
datos versionados. Posición sigue ADR-011/044; DR-049 debe cerrar dominancia y
empates.

### Fields

`AwardCompetitionField` representa competencia de premios comparativos:
effective field size, fuerza, distribución conjunta, dispersión, era,
correlaciones y judging context.

`StatisticalCompetitionField` representa distribución de producción y order
statistics. Un total fijo puede ganar o perder según la edición.

Ninguno materializa una población mundial completa ni un ganador real
inventado.

### Candidate signal

Puede consumir Performance/production, exposición/evidencia, presión, outcomes
de club/selección, contexto, sporting reputation y contribución posicional.
Public reputation solo participa si la Definition lo autoriza.

No consume CareerScore, MarketValue, fee, salary, capabilities verdaderas o un
rating universal. Cada evidence key evita volver a contar el mismo título,
momento o señal por aliases.

### Posiciones

ST usa producción y contribución ofensiva; CM usa progresión, creación, defensa
y control; GK usa shot stopping, command, distribution, exposición y outputs
contextualizados. Goles/asistencias no son universales.

DR-055/063 debe cerrar si se persisten métricas GK adicionales.

### Outcome y timing

El outcome puede representar nomination, shortlist, placement y winner. Un
premio juzgado usa ruido agregado, no votantes individuales. La política de
empate pertenece a la Definition.

Múltiples premios compatibles pueden ocurrir. Awards no aplica la
anti-duplicación de DR-010.

`AWARDS` ocurre después de contar con todos los inputs cerrados y
`AWARD_EVENTS` solo después del outcome. Awards no reescribe sus causas.

### Facts

`AwardWon` es el fact canónico de victoria. Un premio estadístico usa el mismo
fact con su family; no se duplica como `StatisticalAwardWon`. Eligibility y
candidate evaluation son trazas por defecto. DR-063/ADR-010 fijan
`AwardNominated` y `AwardPlacementRecorded` como facts, y
`AwardEditionResolved` como summary derivado.

## Alternativas rechazadas

1. **CareerScore como señal:** crea ciclo engine/scoring.
2. **Threshold fijo:** ignora field y era.
3. **Bernoulli aislado:** rompe competencia y correlaciones.
4. **Goles universales:** penaliza CM/GK.
5. **Premio posicional como fórmula única:** mezcla categoría y evaluación.
6. **Mínimos hardcoded:** dispersa reglas de catálogo.
7. **Título como garantía:** elimina incertidumbre comparativa.
8. **Reputación pública universal:** confunde fama y mérito.
9. **Awards aplicando 100 %/60 %:** invade Scoring.
10. **Award=Record:** duplica hechos.
11. **Ganadores ficticios nombrados desde un field:** inventa identidad.
12. **Evento anterior a AWARDS:** viola ADR-043.
13. **Un premio máximo por temporada:** cap editorial.
14. **Parámetros provisionales hardcoded:** convierte balance en regla.

## Consecuencias

### Positivas

- definitions, fields, evidence y outcomes tienen ownership explícito;
- comparativos y estadísticos se modelan sin población completa;
- categorías posicionales no dependen de goles;
- múltiples premios y history quedan soportados;
- scoring recibe facts sin controlar Awards;
- el timing de eventos queda causal.

### Costes y restricciones

- ADR-077 cierra matemática, fields y empate; DR-060 sigue bloqueando values,
  data, evidence y calibración;
- DR-049 ya cierra dominancia por exposición efectiva mediante ADR-071;
- DR-055/063 debe cerrar métricas/facts;
- DR-025 debe cerrar catálogo real;
- DR-010 debe cerrar puntos y anti-duplicación;
- no puede implementarse gameplay de Awards todavía.

## Impacto en el Design Board

- G3B-I01 queda resuelta estructuralmente.
- G3B-I02–I04 quedan estructuralmente restringidas y parciales.
- G3B-I05 queda como contenido/calibración externalizados.
- El scope del slice conserva un premio global, uno juvenil y tres
  posicionales o de competición sin inventar IDs.

## Refinamiento matemático G3C-8

[ADR-077](./077-national-team-awards-mathematics.md) y
[`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](../NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
cierran comparative Normal field, statistical NB2 field, candidate utility,
judging residual, rank ordinal único y tie policies sin RNG. G3B-I02–I04 y
DR-060 pasan a `PARTIAL_CALIBRATION`.

Este ADR conserva su autoridad estructural. DR-025, values por Definition,
evidence mappings, targets y goldens siguen pendientes. Awards no aplica score
o anti-duplicación.

## Gates y tests requeridos

Antes de implementar:

1. Definition y EditionState separados;
2. predicates declarativos y versionados;
3. cero thresholds universales;
4. fields comparativo/estadístico separados;
5. mismo total estadístico puede ganar o perder según field;
6. señales de ST/CM/GK propias;
7. sparse exposure conserva producción e incertidumbre;
8. títulos no garantizan ni se duplican;
9. public reputation solo por Definition;
10. outcome no es Bernoulli independiente;
11. nomination/placement/win tienen orden coherente;
12. múltiples premios compatibles pueden ocurrir;
13. Awards no aplica anti-duplicación;
14. Award y Record son facts distintos;
15. `AwardWon` único por edición;
16. `AWARD_EVENTS` nunca precede outcome;
17. schemas concretos conformes a los facts DR-063/ADR-010 aprobados;
18. streams independientes y contextos canónicos;
19. golden/property tests y Monte Carlo aprobados;
20. catálogo del slice aprobado por DR-025/060.

## Referencias

- [Especificación de selección y premios](../NATIONAL_TEAM_AWARDS_SPEC.md)
- [Especificación matemática](../NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
- [ADR-077: matemática de Selection/Awards](./077-national-team-awards-mathematics.md)
- [ADR-011: Posiciones](./011-position-taxonomy.md)
- [ADR-014: DSL](./014-event-dsl.md)
- [ADR-018: Vertical slice](./018-initial-vertical-slice.md)
- [ADR-043: Ventanas de eventos](./043-event-opportunity-windows.md)
- [ADR-044: Posición efectiva](./044-effective-position-and-retraining.md)
- [ADR-055: Performance](./055-performance-and-production-model.md)
- [Registro DR-060](../DECISIONS_REQUIRED.md#dr-060--awardcompetitionfield-y-resolución-de-premios)
