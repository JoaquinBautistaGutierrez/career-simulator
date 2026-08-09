# ADR-080: Matemática exacta de Scoring y cierre de G3C

- **Estado:** Aceptado — matemática cerrada; calibración y data de publicación pendientes
- **Fecha:** 2026-08-01
- **Decisiones relacionadas:** DR-008, DR-009, DR-010, DR-015, DR-016,
  DR-017, DR-035, DR-036, DR-049, DR-060, DR-061, DR-063, DR-065,
  DR-066, DR-067 y DR-069
- **Aclara:** ADR-009, ADR-010, ADR-015 y ADR-016
- **Refina:** ADR-051, ADR-070, ADR-073, ADR-075, ADR-077, ADR-078 y ADR-079
- **Especificación:** [SCORING_MATH_SPEC.md](../SCORING_MATH_SPEC.md)

## Contexto

G3B cerró la taxonomía de facts, las seis categorías de PC, el ledger y los
límites de ownership, pero dejó parciales las matemáticas de PRI, CC,
equivalencias, PRL/PBR, exactitud, rounding, caps y recomputación. El uso de
`number`, redondeos locales o cohortes mutables produciría divergencia entre
replay, ledger incremental, recalculation y leaderboard. También faltaba
separar formalmente parámetros de gameplay de configuración competitiva.

## Decisión

### Aritmética y operación

Scoring es una proyección pura y sin RNG. Usa racionales exactos canónicos para
todo intermedio y `ROUND_HALF_UP` una sola vez por cálculo lógico de ledger. Un
grupo de equivalencia/cap es un único cálculo lógico. Los puntos finales y PC
son enteros exactos. IEEE-754, streams de azar y transforms ejecutables desde
Content están prohibidos.

El orden es: validar frontier/facts; resolver scopes, definitions y cohortes;
calcular bases/transforms; cuantizar CC; aplicar outcomes/equivalencias/stacking;
aplicar caps; congelar categorías deportivas; calcular PBR; redondear; ordenar,
hashear, sumar y producir snapshot.

### PRI, CC y categorías

PRI conserva los máximos aprobados `450+120+230+120+80=1000`. Usa cohortes
congeladas por posición/contexto, evidencia, segmentos reales y el factor
competitivo por segmento. ST, CM y GK consumen summaries propios. Club y
selección son segmentos separados; un traspaso no reasigna estadísticas.

CC es específico por jugador/competición/edición/logro. Surge de participación
y contribución contextual con transforms racionales monótonos, se cuantiza en
unidades de 1/10000 y permanece en `[0,1.10]`. Role no asigna CC. Cero minutos o
inelegibilidad lógica producen cero; attribution desconocida bloquea scoring.

PTC/PSN aplican base exacta por outcome y CC. PPI usa definitions y grupos de
equivalencia data-driven; el grupo global aprobado aplica `100%`, `60%`, luego
`0%`. PRL usa entitlement máximo y postings delta. PBR define
`priorSportingPoints = PRI+PTC_CLUB+PPI+PSN`, subcaps `1000+1000`, cap agregado
`2000` y cap `5%`, antes de su único redondeo.

### Configuración, cohorts y lifecycle

`ScoringConfiguration` y `ScoringCalibrationData` son recursos inmutables
hash-addressed separados de `EngineParameterSet`. `scoringVersion` fija
exactamente sus hashes, catálogos e IJL; no se agrega una sexta versión.

Las cohortes usan CDF empírica congelada, mid-ranks e hierarchical shrinkage
racional. Publicación requiere provenance, samples, knots y goldens.

El ledger es append-only, idempotente y explicable. Correcciones producen
reversal explícito y posting corregido. Recompute completo e incremental deben
ser equivalentes. El primer retiro deportivo no congela score: solo el frontier
irreversible de ADR-079 habilita ledger/snapshot final y potencial ranking.

La política competitiva inicial compara únicamente snapshots con una clave de
compatibilidad exacta que incluye las cinco versiones, hashes de ParameterSet,
configuración/calibración de Scoring y reglas de modo. DR-036 conserva cualquier
futura equivalencia entre claves diferentes.

## Consecuencias

- DR-010 queda `RESOLVED_MATH`; publicar el primer scoring versionado todavía
  exige valores calibrados, data, catálogos y golden outputs.
- Las trece decisiones M de G3C-11 ya no carecen de ecuación o algoritmo; se
  clasifican como `RESOLVED_MATH`, `PARTIAL_CALIBRATION` o `DATA_REQUIRED`.
- Un cambio que altere puntos, cohortes, transforms, rounding, equivalencias o
  caps requiere nueva `scoringVersion`.
- Scoring puede implementarse como funciones puras y re-ejecutarse desde facts
  sin re-simular gameplay, siempre que el frontier sea completo.
- No se autoriza implementación hasta publicar el bundle inicial completo.

## Alternativas rechazadas

1. Usar IEEE-754 y redondear solo el total: rompe goldens y auditabilidad.
2. Usar fixed-point único para toda la simulación: excede el scope y contradice
   ADR-051/070; la exactitud se limita a Scoring.
3. Calcular el exponente `1.35` en runtime: introduce dependencia de runtime;
   se publica una tabla de enteros verificada.
4. Usar `leagueCompetitiveStrength` dinámico en lugar de IJL: mezcla gameplay
   con jerarquía competitiva congelada.
5. Asignar CC por SportingRole o thresholds: contradice participación real y
   conserva discontinuidades no aprobadas.
6. Mutar ledger histórico al corregir facts: elimina trazabilidad.
7. Permitir equivalencia cross-version por inferencia: DR-036 sigue abierta.

## Validación requerida

- goldens de racionales, rounding, PRI, CC, achievements, equivalencias, PRL,
  PBR, idempotencia, reversals, recomputation, snapshot y tiers;
- properties de exactitud, ownership, caps y lifecycle;
- Monte Carlo sobre facts para composición de PC, cohortes y tails, sin RNG de
  Scoring;
- verificación de todos los valores conocidos de `MASTER_SPEC.docx` y rechazo
  de definitions/catalog data faltante.
