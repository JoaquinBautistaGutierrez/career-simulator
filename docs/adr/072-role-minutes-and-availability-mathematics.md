# ADR-072 — Matemática de Role, Minutes y Availability

**Estado:** Aceptada  
**Fecha:** 2026-07-29  
**Decisiones relacionadas:** DR-021 (parcial), DR-054
(`PARTIAL_CALIBRATION`), DR-064 (resuelta)  
**Refina:** ADR-042, ADR-044, ADR-054, ADR-057, ADR-070 y ADR-071

## Contexto

ADR-054 separó `SquadStatus`, `SportingRole` y participación efectiva, pero
dejó abiertas la distribución de role, los minutos y la composición de
availability. G3C-3 necesita cerrar familias matemáticas implementables sin
inventar calendario, Health, Performance ni valores de balance.

La disponibilidad médica, disciplinaria y de otras causas puede solaparse
dentro de una Q. Sumar shares, tomar el mínimo o multiplicarlos produciría
resultados distintos sin conocer el solapamiento causal.

## Decisión

1. `SportingRole` usa stable softmax sobre utilities finitas y parametrizadas
   para `BENCH`, `ROTATION`, `STARTER`, `KEY_PLAYER` y `STAR`.
2. La persistencia usa una matriz
   `transitionEffect[previousRole,candidateRole]`; todas las transiciones
   conservan probabilidad positiva.
3. La participación usa un modelo Logit-Normal en espacio latente. El role
   modifica intercepts estrictamente ordenados, pero no fija porcentajes.
4. `expectedMinutes` es la expectativa pre-sample, calculada mediante
   `LogitNormalMeanGaussHermite10V1`; queda como señal derivada.
5. La availability agregada se compone por unión exacta de intervalos
   semiabiertos sobre ordinales abstractos de oportunidad de minuto. El engine
   de orquestación es owner de la composición; cada source conserva ownership
   de su causa.
6. Si varias causas solo entregan shares y no se puede determinar su
   solapamiento, se devuelve un error tipado; no se infiere independencia ni
   precedencia.
7. `TeamMinutesOpportunity` usa minutos/equivalentes enteros agregados por
   competición y Q. No implica fixtures ni precisión diaria.
8. Los minutos por competición se obtienen mediante softmax conjunto y
   apportionment entero con caps físicos. El slice usa una sola
   `effectivePosition` dominante por Q.
9. `appearances` y `starts` se derivan jerárquicamente mediante conteos de
   Bernoulli condicionados por minutos y capacidad agregada, preservando
   `starts <= appearances`.
10. Los draws usan namespace `role-minutes`, context keys estables y samplers
    normativos de ADR-070. Una rama determinada no consume draws innecesarios.
11. Todos los coeficientes permanecen en `EngineParameterSet.roleMinutes`.
    Scoring no interviene.

La especificación completa es
[`ROLE_MINUTES_MATH_SPEC.md`](../ROLE_MINUTES_MATH_SPEC.md).

## Alternativas rechazadas

- thresholds deterministas de role;
- porcentajes fijos de minutos por role;
- un único bonus diagonal de persistencia;
- Beta universal para minute share;
- sumar, minimizar o multiplicar availability shares sin solapamiento;
- dividir minutos por 90 y redondear para appearances;
- samplear competiciones o posiciones como conteos independientes;
- reutilizar streams de Performance/Health;
- unificar trust de club con incumbency de selección;
- simular fixtures únicamente para resolver agregados.

## Consecuencias

- Las seis decisiones estructurales asignadas a G3C-3 tienen familia
  matemática cerrada.
- DR-064 queda resuelta.
- DR-054 pasa a calibración: faltan valores, no ecuaciones.
- DR-021 queda parcialmente resuelta respecto de SeasonId ordinal, Q y
  boundary de oportunidad; formatos/generación del calendario siguen abiertos.
- Health deberá entregar una asignación médica agregada compatible además de
  su envelope.
- Club/World deberá producir `PositionCompetition`, `TacticalFit` y
  `TeamMinutesOpportunity`.
- No se introducen cooldowns, caps editoriales ni dependencia instantánea de
  Performance.

## Tests requeridos

- golden de utilities, stable softmax y categorical sampler;
- matriz completa de transición/persistencia;
- unión de intervalos con causas solapadas y errores de contrato;
- Logit-Normal, GH10, cuantización half-even y disponibilidad cero;
- apportionment por competición con suma/caps exactos;
- derivación jerárquica de appearances/starts;
- separación de contexts `CLUB`/`NATIONAL_TEAM`;
- aislamiento y consumo esperado de streams;
- properties de bounds, monotonicidad de expectativas y reproducibilidad;
- Monte Carlo de roles, minutos, colas y transiciones.

Cambiar ecuaciones, ordering, composición de availability, samplers o consumo
de streams requiere revisar este ADR y la versión participante del replay.
