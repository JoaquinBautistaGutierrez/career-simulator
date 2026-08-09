# ADR-055: Estructura de Performance y producción por posición

- **Estado:** Aceptado — alcance estructural; matemática refinada por ADR-073;
  DR-055 en `PARTIAL_CALIBRATION`
- **Fecha:** 2026-07-28
- **Decisión relacionada:** DR-055
- **Especificación normativa:** [`../PERFORMANCE_MODEL_SPEC.md`](../PERFORMANCE_MODEL_SPEC.md)

## Contexto

ADR-052 separó capabilities, traits y estados dinámicos; ADR-054 confirmó que
Performance recibe posición, rol y minutos ya resueltos. Faltaba decidir qué
significa rendimiento, cómo se relaciona con estadísticas observadas y qué
contratos mínimos necesitan `GK`, `CM` y `ST`.

Sin una frontera explícita, una implementación podía:

- reintroducir un overall causal;
- tratar goles o atajadas como capacidad verdadera;
- duplicar transformaciones de forma/salud en cada posición;
- sortear estadísticas relacionadas de forma independiente;
- recalcular minutos desde rendimiento;
- truncar outliers mediante caps editoriales;
- filtrar latentes verdaderos a premios, mercado o scoring.

Este ADR fijó la arquitectura estructural. ADR-073 selecciona posteriormente
las familias y ecuaciones; coeficientes y calibración permanecen pendientes.

## Decisión

### Pipeline

Performance sigue cinco capas:

```text
TrueCapabilities
-> EffectiveCapabilities
-> UnderlyingPerformance
-> ObservedProduction
-> PerformanceSummary
```

Las capas no son aliases. Capacidad es estado causal; capacidad efectiva es una
proyección contextual; rendimiento subyacente es una realización
multidimensional; producción son resultados observables; summary es evidencia
consolidada con volumen, contexto e incertidumbre.

### Proyección efectiva única

Existe un único contrato conceptual para resolver `EffectiveCapabilities` desde
capabilities verdaderas, estados dinámicos, posición, rol, presión y contexto
táctico. Todos los modelos posicionales consumen esa proyección y no vuelven a
implementar modificadores de forma, fitness o fatiga.

La proyección no muta capabilities ni se persiste como segunda verdad. No existe
un valor universal de overall o calidad efectiva.

### Rendimiento multidimensional

`UnderlyingPerformance` admite componentes equivalentes a ejecución técnica,
decisión, impacto sin balón, impacto defensivo, contribución ofensiva y
rendimiento bajo presión. Un rating puede derivarse para una finalidad
versionada, pero nunca genera producción ni sustituye esos componentes.

`actualMinutes` es exposición confirmada. Performance no lo recalcula. La fuerza
de evidencia se separa de producción cruda para no tratar muestras escasas como
si tuvieran el mismo volumen.

### Producción conjunta y posicional

Los conteos se generan mediante distribuciones discretas condicionadas, no por
redondeo de expectativas. Shocks compartidos correlacionan rendimiento,
oportunidades y outputs; `consistency` modifica principalmente dispersión.

Para el vertical slice:

- `ST` persiste al menos goles y asistencias, generados desde oportunidades,
  calidad de ocasión y conversión/creación distinguibles;
- `CM` persiste goles/asistencias y evidencia agregada de progresión, creación,
  defensa y control sin simular acciones inútiles;
- `GK` persiste al menos atajadas, goles concedidos y vallas invictas, junto con
  exposición auditable; rendimiento de atajada, mando y distribución permanecen
  separados del contexto defensivo.

No existen máximos editoriales. Solo rigen identidades derivadas de exposición y
oportunidades confirmadas.

### Contexto, presión y evaluación

Performance consume contexto de club/competición: ataque, defensa,
posesión/control, rival, dificultad, fuerza de competición, táctica y exposición
high-pressure. No lo genera.

La producción cruda no se reescribe por evaluación contextual. La presión se
conserva como breakdown de exposición, rendimiento, producción y evidencia. Un
momento importante no es una bonificación editorial.

### Dynamic States y temporalidad

`form`, `confidence`, `morale`, `fitness`, `fatigue` y `managerTrust` tienen
ownership separado. Performance lee el snapshot inicial —incluidas
restricciones médicas confirmadas— y produce señales para actualizaciones
posteriores; no escribe esos estados directamente. Performance entrega a Health
exposición e intensidad físicas realizadas, no ratings como proxy de carga.

Forma debe admitir persistencia, regresión/saturación, respuesta a sorpresa de
rendimiento y ruido sin impedir rachas extremas. La ecuación sigue en DR-056.

El orden de Q es:

```text
posición/rol/minutos confirmados
-> EffectiveCapabilities
-> UnderlyingPerformance
-> ObservedProduction
-> PerformanceSummary
-> señales
-> Health y Consequences posteriores
```

No hay feedback dentro de la misma Q que reabra minutos o producción.

### Facts y scoring

Por defecto:

- `EffectiveCapabilitiesResolved` es traza;
- `UnderlyingPerformanceRecorded` es evidencia interna auditable;
- `ObservedProductionRecorded` y `PerformanceSummaryRecorded` son facts
  candidatos;
- la presión vive en el summary para evitar un fact duplicado;
- los cambios de Dynamic State los emite su sistema propietario.

DR-063/ADR-010 cierran nombres, clasificación, identidad, idempotencia y
allowlist; los schemas concretos deben conformarse a
`SCORING_FACTS_SPEC.md`. Scoring solo consume facts allowlisted; engine no
depende de scoring y Performance no crea `ScoreLedgerEntry`.

## Alternativas rechazadas

1. **Overall causal:** elimina capacidades específicas y confunde calidad con
   resultado.
2. **EffectiveCapabilities persistidas:** crea una segunda verdad dependiente de
   contexto.
3. **Un rating único como rendimiento:** pierde contribuciones posicionales y
   vuelve causal una proyección.
4. **Producción como proxy de capacidad:** confunde exposición, contexto y azar
   con estado verdadero.
5. **Estadísticas independientes:** rompe identidades y correlaciones.
6. **Expectativa redondeada:** elimina varianza y colas de conteos.
7. **Goles/asistencias como métrica universal:** penaliza roles y posiciones.
8. **Goles concedidos como calidad GK:** ignora entorno defensivo y rival.
9. **Feedback instantáneo a minutos:** reescribe hechos cerrados.
10. **Caps de estadísticas o ratings:** contradice las colas abiertas normativas.
11. **Evento especial para forzar un récord:** reemplaza producción probabilística
    por una excepción editorial.
12. **Performance escribiendo estados ajenos:** introduce ciclos y doble conteo.
13. **Coeficientes provisionales hardcoded:** convierte balance pendiente en
    regla normativa.

## Consecuencias

### Positivas

- G3B-A06 queda estructuralmente cerrada;
- las posiciones comparten un pipeline sin compartir una métrica universal;
- raw production, evaluación e incertidumbre permanecen separadas;
- outliers surgen del proceso normal;
- Awards, Market, Selection y Scoring reciben contratos explícitos sin acceder a
  latentes verdaderos;
- Health, Development y Role & Minutes conservan ownership y orden causal.

### Costes y restricciones

- el engine necesitará modelos correlacionados y trazas auditables;
- la agregación debe conservar suficientes estadísticos, no solo ratings;
- DR-021/022 debe producir contexto agregado coherente;
- DR-056/057 debe cerrar estados dinámicos y salud;
- DR-063/ADR-010 ya reconciliaron nombres de facts existentes;
- no puede implementarse gameplay hasta elegir matemática, parámetros, streams,
  precisión y fixtures.

## Impacto en decisiones pendientes

- G3B-A06 y G3B-D01 quedan resueltas estructuralmente.
- G3B-D02 a D09 quedan estructuralmente restringidas y parcialmente abiertas por
  matemática o dependencias.
- G3B-D10 queda como calibración externalizada.
- ADR-073 lleva DR-055 a `PARTIAL_CALIBRATION`: funciones, distribuciones,
  samplers, precisión, correlaciones y streams están cerrados; faltan valores,
  targets, goldens y producers upstream.
- DR-056 permanece abierta por dinámica de forma/confianza/managerTrust/morale.
- DR-010 permanece abierta: este ADR define evidencia, no percentiles, CC ni
  puntos.
- DR-055 debe decidir si el vertical slice necesita métricas GK adicionales
  —errores, penales y distribución— sin inventar counters; disciplina
  permanece fuera de Performance; ADR-072/DR-064 ya cierran el aggregate de
  availability. El catálogo DR-063 ya define el envelope de producción.

## Refinamiento G3C-4

[ADR-073](./073-performance-production-form-mathematics.md) y
[`PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md`](../PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
fijan:

- task abilities en logit seguro;
- Underlying Performance Normal multidimensional;
- NB2/Binomial e inverse-CDF log-space;
- grafos ST/CM/GK;
- pressure/evidence/surprise;
- Form AR(1);
- agregación Q/season.

Las decisiones G3B-D02–D09 quedan `PARTIAL_CALIBRATION`; este ADR deja de ser
la última autoridad matemática, pero conserva la arquitectura causal.

## Gates y tests requeridos

Antes de implementar:

1. una proyección efectiva única y pura, sin mutar capabilities;
2. UnderlyingPerformance multidimensional y sin overall causal;
3. cero minutos produce cero producción participativa;
4. conteos discretos con colas aprobadas, nunca expectativas redondeadas;
5. correlaciones explícitas y streams independientes;
6. fixtures sparse/high exposure conservan producción e incertidumbre;
7. identidades `GK` y clean sheets validadas;
8. raw production no cambia por fuerza de competición;
9. Performance de Qn no modifica rol/minutos de Qn;
10. Dynamic States solo cambian mediante su owner;
11. outliers no se recortan ni se fuerzan con eventos;
12. agregación Q→temporada conserva splits y no vuelve a sortear;
13. schemas concretos conformes a los facts y allowlist ya aprobados por
    DR-063/ADR-010;
14. valores de parámetros publicados y streams versionados;
15. golden/property tests y Monte Carlo cumplen targets aprobados.
