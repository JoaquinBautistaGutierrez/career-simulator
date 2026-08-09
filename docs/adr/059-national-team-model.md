# ADR-059: Estructura de selección nacional

- **Estado:** Aceptado — alcance estructural; DR-059 permanece parcialmente
  abierta
- **Fecha:** 2026-07-28
- **Decisión relacionada:** DR-059
- **Especificación normativa:**
  [`../NATIONAL_TEAM_AWARDS_SPEC.md`](../NATIONAL_TEAM_AWARDS_SPEC.md)
- **Aclara:** ADR-013, ADR-022, ADR-042, ADR-043, ADR-044, ADR-054 y ADR-055

## Contexto

El motor necesita convocatorias, roles, minutos, Performance y resultados
internacionales sin simular una población mundial completa. El modelo existente
separaba club y selección de forma conceptual, pero no definía estado,
competencia generacional, elegibilidad ni cómo reutilizar los resolvers comunes.

Sin una frontera explícita, una implementación podía:

- usar overall o un threshold de calidad;
- tratar liga pequeña como inelegibilidad;
- convertir elegibilidad en convocatoria;
- copiar el rol de club;
- mezclar minutos internacionales con minutos de club;
- duplicar Performance o Health;
- hacer que el protagonista determine títulos;
- inventar nacionalidades o reglas de elegibilidad;
- resolver ventanas regulares en un punto causal incorrecto.

Las fórmulas, distribuciones, calendario, elegibilidad del slice y parámetros
siguen pendientes. Este ADR fija únicamente la arquitectura matemática.

## Decisión

### Estado y contexto propios

`dataVersion` aporta `NationalTeamDefinition`. La Career conserva
`NationalTeamState`, `NationalTeamContext`, historia y estados de competición
internacional separados del club.

`NationalTeamState` admite fuerza deportiva multidimensional, manager/táctica,
support field, contexto generacional, fields posicionales, resultados e
incumbency del protagonista. No contiene finanzas, contratos ni competencia del
plantel de club.

### Elegibilidad separada

`NationalTeamEligibility` es una evaluación lógica y versionada anterior a la
candidatura. Distingue `ELIGIBLE`, `REQUIRES_PRIOR_TRANSITION` e
`INELIGIBLE_CURRENT_STATE`. No usa probabilidad.

DR-068 debe cerrar nacionalidad deportiva, bases biográficas, transiciones y
scope del vertical slice. Jugar en un país no crea elegibilidad para su
selección.

### Field de competencia

El nombre canónico es `SelectionCompetitionField`, por país, posición,
contexto, ventana/ciclo y generación. Representa fuerza, profundidad,
dispersión, colas, demanda táctica e incumbency sin materializar candidatos.

World puede producir `NationalGenerationField` y contexto de era. Un field
abstracto no se presenta como persona real.

### Pipeline

La secuencia es:

```text
Eligibility
-> CandidateEvaluation
-> CallUp
-> SquadSelection
-> InternationalRole
-> InternationalMinutes
-> InternationalPerformance
-> NationalTeamCompetitionOutcome
```

Cada etapa conserva identidad y puede terminar sin producir la siguiente.
Convocatoria no garantiza squad, rol, minutos o título.

### Evidencia

Candidate Evaluation puede consumir una proyección purpose-scoped de
UnderlyingPerformance, summaries, producción, exposición, evidencia, posición,
club/liga/competición, presión, sporting reputation, salud, edad, history,
field y azar determinista.

No consume overall, MarketValue, CareerScore, capacidades verdaderas o public
reputation por defecto. Cuando representa conocimiento de un cuerpo técnico,
usa `PlayerKnowledge` e incertidumbre.

### Rol, minutos y Performance

`InternationalRole` usa:

```text
BENCH | ROTATION | STARTER | KEY_PLAYER
```

Captaincy es otra dimensión. Incumbency/selection trust no garantiza
convocatoria ni rol.

Role & Minutes y Performance se reutilizan mediante contextos nacionales:
`InternationalTeamMinutesOpportunity`, Availability, role y
`PerformanceContext.kind = NATIONAL_TEAM`. Club y selección conservan minutos,
producción y accumulators separados. Health no se duplica.

### Resultado colectivo

`NationalTeamSupportField` excluye al protagonista. Outcome compone baseline,
contribución internacional, contexto y varianza. La contribución no es CC, PSN
ni score.

### Tiempo

ADR-013/043 no ubica ventanas internacionales regulares entre Qs. DR-059 y
DR-021 deben elegir suboperaciones, boundaries, cursor y relación con
COMPETITIONS antes de implementar. Una ventana de eventos no sustituye una fase
mecánica.

## Alternativas rechazadas

1. **Overall/threshold:** elimina competencia probabilística.
2. **Liga débil como inelegibilidad:** confunde evaluación con regla lógica.
3. **Elegibilidad=convocatoria:** colapsa etapas.
4. **Rol de club reutilizado como estado:** mezcla contextos.
5. **Motor internacional separado:** duplica fórmulas y diverge.
6. **Minutos compartidos:** viola conservación.
7. **Plantilla mundial completa:** excede el modelo agregado.
8. **Protagonista como determinante absoluto:** elimina support field.
9. **Nacionalidad inferida desde liga:** inventa biografía.
10. **Todas las ventanas post-Q4:** rompe causalidad de carga/disponibilidad.
11. **Fase nueva por inferencia:** contradice ADR-013/043.
12. **Parámetros provisionales hardcoded:** convierte balance en regla.

## Consecuencias

### Positivas

- selección posee estado y lenguaje propios;
- eligibility, candidatura, call-up, squad, rol, minutos y outcome quedan
  separados;
- competencia generacional no requiere población completa;
- se reutilizan resolvers sin mezclar contextos;
- Health, Performance, World, Awards y Scoring conservan ownership;
- el timing pendiente queda explícito y versionable.

### Costes y restricciones

- ADR-077 cierra la matemática; DR-059 sigue bloqueando values, data,
  eligibility y cursor;
- DR-021 debe cerrar calendario;
- DR-022 debe cerrar fields/support/world;
- DR-068 debe cerrar elegibilidad;
- DR-063/ADR-010 ya cierran facts, aliases y allowlist;
- DR-008 debe integrar fórmulas, streams, precisión y fixtures;
- no puede implementarse gameplay de selección todavía.

## Impacto en el Design Board

- G3B-H01 a H04 quedan estructuralmente restringidas y parcialmente abiertas.
- G3B-H05 queda como calibración externalizada.
- G3B-H02 conserva dependencia explícita de DR-068.
- G3B-H03/H04 conservan dependencia temporal de DR-059/021.

## Refinamiento matemático G3C-8

[ADR-077](./077-national-team-awards-mathematics.md) y
[`NATIONAL_TEAM_AWARDS_MATH_SPEC.md`](../NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
cierran field Gaussian core/elite, candidate merit, call-up/squad logistic,
incumbency AR(1), adapter internacional de Role/Minutes, strength/generation y
outcomes agregados. G3B-H01–H04 y DR-059 pasan a `PARTIAL_CALIBRATION`.

Este ADR conserva su autoridad estructural. DR-021/025/068, values, evidence,
targets y goldens siguen pendientes; no se infiere nacionalidad o calendario.

## Gates y tests requeridos

Antes de implementar:

1. eligibility lógica separada de probabilidad;
2. no se infiere nacionalidad desde club/liga;
3. field por país/posición/generación sin población completa;
4. convocatoria sin threshold u overall;
5. misma evidencia puede producir convocado/no convocado según stream;
6. contexto de liga no crea inelegibilidad;
7. call-up, squad, role, minutes y outcome son entidades distintas;
8. role internacional no copia role de club;
9. club/international minutes no se duplican;
10. called-up unavailable puede producir cero minutos;
11. Performance usa el resolver común;
12. support field excluye al protagonista;
13. outcome no queda determinado por el protagonista;
14. incumbency no garantiza permanencia;
15. cursor y reanudación no repiten operaciones;
16. streams independientes y contextos canónicos;
17. schemas concretos conformes a los facts DR-063/ADR-010 aprobados;
18. golden/property tests y Monte Carlo aprobados;
19. DR-021/059/068 cerradas para el slice.

## Referencias

- [Especificación de selección y premios](../NATIONAL_TEAM_AWARDS_SPEC.md)
- [Especificación matemática](../NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
- [ADR-077: matemática de Selection/Awards](./077-national-team-awards-mathematics.md)
- [ADR-013: State machine](./013-season-state-machine.md)
- [ADR-022: Mundo agregado](./022-club-competition-world-model.md)
- [ADR-043: Ventanas de eventos](./043-event-opportunity-windows.md)
- [ADR-044: Posición efectiva](./044-effective-position-and-retraining.md)
- [ADR-054: Rol y minutos](./054-role-and-minutes-model.md)
- [ADR-055: Performance](./055-performance-and-production-model.md)
- [Registro DR-059](../DECISIONS_REQUIRED.md#dr-059--campo-de-competencia-de-selección-nacional)
- [Registro DR-068](../DECISIONS_REQUIRED.md#dr-068--nacionalidad-deportiva-y-elegibilidad-internacional-del-vertical-slice)
