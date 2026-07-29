# ADR-054: Estructura de rol y minutos

- **Estado:** Aceptado — alcance estructural; aclarado por ADR-057; DR-054 permanece parcialmente abierta
- **Fecha:** 2026-07-27
- **Decisión relacionada:** DR-054
- **Especificación normativa:** [`../ROLE_MINUTES_SPEC.md`](../ROLE_MINUTES_SPEC.md)

## Contexto

La especificación utilizaba OUT_OF_SQUAD, PROSPECT, BENCH, ROTATION, STARTER,
KEY_PLAYER y STAR como si pertenecieran a un único vocabulario. Eso mezclaba
relación institucional, expectativa deportiva y participación realizada.

También faltaban fronteras entre posición efectiva, confianza del entrenador,
competencia abstracta, disponibilidad, oportunidad de calendario y rendimiento.
Sin ellas, una implementación podía convertir roles en porcentajes fijos,
simular una plantilla completa, introducir circularidad dentro de Q o duplicar
minutos entre posiciones y contextos.

ADR-042 fija el orden temporal Q1–Q4 y ADR-044 la posición efectiva. Este ADR
refina sus contratos sin elegir fórmulas, distribuciones ni coeficientes.

## Decisión

### Separación del estado

Se definen tres conceptos:

- `SquadStatus`: `OUT_OF_SQUAD`, `PROSPECT`, `SQUAD_PLAYER`, `FIRST_TEAM`;
- `SportingRole`: `BENCH`, `ROTATION`, `STARTER`, `KEY_PLAYER`, `STAR`;
- `EffectiveUsage`: participación realmente confirmada, no un enum.

`SquadStatus` expresa relación institucional; `SportingRole`, expectativa
principal de la ventana; `EffectiveUsage`, resultado. No se almacenan en un
único `RoleState`. `PROSPECT` puede coexistir con cualquier `SportingRole`.

### Posición y ajuste táctico

Role & Minutes consume una `effectivePosition` válida antes de resolver rol y
minutos. No decide reconversiones ni posiciones arbitrarias. Una asignación sin
minutos no aporta historia de uso; `EffectivePositionUsed` solo confirma
participación conforme a ADR-044.

`tacticalFit` es una derivación contextual de capabilities, posición, demandas
tácticas y entrenador/club. No es capability, overall, rendimiento ni
`managerTrust`.

### Confianza y competencia

`managerTrust` permanece como `DYNAMIC_STATE` separado. Modifica
probabilísticamente rol/minutos, nunca mediante thresholds. Su actualización
posterior pertenece a DR-056.

La competencia se representa mediante `PositionCompetition`, un field agregado
por posición/contexto con conceptos de fuerza, profundidad y
estabilidad/entrenchment. No se simulan competidores individuales.

### Oportunidad, disponibilidad y minutos

`TeamMinutesOpportunity` representa la cantidad finita de tiempo de juego que
un único jugador podría ocupar en un equipo/contexto y Q, derivada externamente
del calendario agregado; no suma los once puestos simultáneos.
Health produce un `MedicalAvailabilityEnvelope`. Una agregación autoritativa
separada lo combina con disciplina y otras fuentes tipadas para producir el
`AvailabilityEnvelope` que reduce la oportunidad a `availableTeamMinutes`.
Health no es owner de suspensiones. Función, precedencia y solapamientos siguen
pendientes en DR-054/DR-064.

Se cumple:

```text
0 <= actualMinutes <= availableTeamMinutes
  <= TeamMinutesOpportunity.teamMinutes
```

El límite es físico, no editorial. `expectedMinutes` es una expectativa
condicional. `actualMinutes` se realiza mediante un `minuteShare` en `[0,1]`
condicionado por rol, disponibilidad y contexto. No se elige aún Beta,
logit-normal u otra familia.

SportingRole se obtiene de una distribución condicionada por calidad
contextual, posición, `tacticalFit`, `managerTrust`, competencia, rendimiento
previo, forma, contexto, estado anterior y azar determinista. No existen
thresholds, porcentajes fijos, garantías, cooldowns ni bands rígidas.

### Causalidad por Q

El orden lógico es:

```text
estado inicial
-> posición/contexto
-> disponibilidad
-> rol y expectativa
-> minutos
-> rendimiento
-> salud posterior
-> estados para Qn+1
```

`ROLE_AND_MINUTES` solo inicializa priors de temporada.
`AVAILABILITY(Qn)` confirma disponibilidad, rol y expectativa; la primera
suboperación de `PRODUCTION(Qn)` confirma minutos antes de Performance.
Rendimiento de Qn puede afectar Qn+1, no minutos ya cerrados.

No se agregan fases al cursor. Las suboperaciones usan `operationKey` estable y
la reanudación no repite tiradas.

### Exposición, posiciones y contextos

Minutos son la medida causal principal. Apariciones y titularidades se derivan
después, con `starts <= appearances`.

Cada Q conserva una posición efectiva dominante. Un futuro `usageByPosition`
debe sumar exactamente `actualMinutes`. Club y selección poseen
`TeamMinutesOpportunity` y facts independientes; no comparten ni duplican
minutos.

### Outputs y parámetros

La semántica mínima usa:

- `WindowAvailabilityAssessed`;
- `SportingRoleAssigned`;
- `expectedMinutes` como `INTERNAL_SIGNAL`;
- `MinutesRecorded`;
- `EffectivePositionUsed`;
- `AppearanceSummaryRecorded`;
- `SquadStatusChanged` solo cuando corresponde.

DR-063/ADR-010 fijan clasificación, identidad e idempotencia; los schemas
concretos deben conformarse a `SCORING_FACTS_SPEC.md`. Ningún output crea
ScoreLedger.

Toda función, prior, coeficiente, persistencia, dispersión, mapping de
disponibilidad, precisión, redondeo, stream, fixture y target Monte Carlo se
carga desde configuración versionada.

## Alternativas rechazadas

1. **Un enum único de rol:** mezcla institución, expectativa y resultado.
2. **PROSPECT como sinónimo de pocos minutos:** impide titulares jóvenes sin
   fundamento mecánico.
3. **Rol como banda fija de minutos:** convierte una expectativa en garantía.
4. **Thresholds de calidad, edad o confianza:** eliminan soporte probabilístico
   y transiciones contextuales.
5. **Cooldown de cambios de rol:** introduce una restricción artificial.
6. **`managerTrust` como calidad o rendimiento:** duplica evidencia.
7. **`tacticalFit` persistido como capability:** confunde contexto con jugador.
8. **Plantilla completa ficticia:** excede el alcance agregado aprobado.
9. **Rol y minutos sorteados independientemente:** permite estados
   contradictorios.
10. **Performance de Qn recalculando minutos de Qn:** crea circularidad y
    reescritura retroactiva.
11. **Minutos duplicados por posición, competición o selección:** viola
    conservación de exposición.
12. **Coeficientes provisionales hardcoded:** convierte balance pendiente en
    regla normativa.

## Consecuencias

### Positivas

- el dominio distingue institución, expectativa y uso;
- rol conserva varianza y no determina exposición;
- calendario, salud y club pueden evolucionar detrás de interfaces explícitas;
- Performance recibe minutos cerrados y no puede reescribirlos;
- Development y Health consumen exposición confirmada;
- el modelo admite uso multiposicional sin duplicación;
- no hace falta simular partidos o plantillas completas.

### Costes y restricciones

- DR-021 y DR-022 deben producir oportunidad y contexto de competición;
- DR-055 debe definir calidad contextual y evidencia previa;
- DR-056 debe definir actualización de confianza;
- ADR-057 define el componente médico; DR-057 debe producirlo
  matemáticamente;
- DR-064 debe definir disciplina, otras causas y composición del aggregate;
- DR-048/049 deben cerrar alcance y dominancia posicional;
- DR-058 debe aclarar si una promesa contractual de rol/estatus es un concepto
  separado;
- DR-063/ADR-010 ya fijan contratos semánticos de facts;
- no puede implementarse gameplay mientras DR-054 carezca de matemática,
  precisión, streams, parámetros y fixtures.

## Impacto en decisiones pendientes

- G3B-C01 queda resuelta.
- G3B-C02 a G3B-C06 quedan estructuralmente restringidas y parcialmente
  abiertas por sus fórmulas o dependencias.
- G3B-C07 queda confirmado como calibración externalizada.
- G3B-A06 entrega calidad contextual como input, pero su fórmula sigue en
  DR-055.
- G3B-B04/B05 consumen carga y minutos confirmados sin mutaciones directas.
- G3B-D01 recibe rol, posición y minutos; no queda resuelta su matemática.
- G3B-E01 produce `MedicalAvailabilityEnvelope`; el aggregate pertenece a la
  frontera de DR-064.
- G3B-F01–F04 deben producir táctica, competencia, oportunidad y calendario.

DR-054 no se marca resuelta: faltan funciones/distribuciones, escalas,
precisión, redondeo, correlaciones, streams, parámetros, fixtures y validación
Monte Carlo.

## Gates y tests requeridos

Antes de implementar Role & Minutes:

1. schemas separados y fixture `PROSPECT + STAR`;
2. ninguna regla fija porcentajes por rol;
3. posición efectiva válida anterior a la resolución;
4. competencia agregada sin plantilla completa;
5. invariantes de oportunidad, disponibilidad y minutos;
6. mismo rol con resultados de minutos distintos;
7. cero oportunidad produce cero minutos sin `NaN`;
8. `starts <= appearances`;
9. conservación de minutos en splits posicionales y de competición;
10. separación de oportunidades club/selección;
11. Qn no consume su propio rendimiento para minutos;
12. Qn+1 puede consumir evidencia cerrada de Qn;
13. reanudación no repite rol, minutos ni streams;
14. parámetros y precisión versionados;
15. golden/property tests y Monte Carlo dentro de targets aprobados.

## Refinamiento G3C-3

**Fecha:** 2026-07-29  
**ADR que refina:** [ADR-072](072-role-minutes-and-availability-mathematics.md)

ADR-072 cierra las familias matemáticas que este ADR dejó abiertas:

- stable softmax y matriz de persistencia para `SportingRole`;
- combinación normalizada de `PositionCompetition`;
- unión exacta de availability;
- Logit-Normal para minute share y GH10 para su expectativa;
- apportionment por competición;
- Bernoulli jerárquico para appearances/starts;
- precisión, cuantización, streams, ParameterSet, invariantes y goldens.

G3B-C04/F03 pasan a `RESOLVED_MATH`; C02/C03/C05/C06 quedan
`PARTIAL_CALIBRATION`. DR-054 pasa a `PARTIAL_CALIBRATION`: ya no falta elegir
una ecuación o sampler, pero sí publicar valores, targets y evidencia.
