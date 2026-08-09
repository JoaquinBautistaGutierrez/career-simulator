# ADR-077: Matemática de National Team y Awards

- **Estado:** Aceptado — familias y ecuaciones; calibración/data/policies pendientes
- **Fecha:** 2026-08-01
- **Decisiones relacionadas:** DR-008, DR-010, DR-021, DR-025, DR-049,
  DR-055, DR-056, DR-059, DR-060, DR-061, DR-063 y DR-068
- **Refina:** ADR-059, ADR-060, ADR-070, ADR-072, ADR-073 y ADR-075
- **Especificación:**
  [NATIONAL_TEAM_AWARDS_MATH_SPEC.md](../NATIONAL_TEAM_AWARDS_MATH_SPEC.md)

## Contexto

ADR-059/060 cerraron estructura y ownership, pero dejaron siete decisiones sin
familia matemática: G3B-H01–H04 e I02–I04. La implementación no puede elegir
por su cuenta cómo construir fields, convocar, mantener incumbency, reutilizar
role/minutes, resolver torneos, comparar premios o desempatar.

DR-021, DR-025 y DR-068 conservan calendar/data/eligibility policy. Este ADR no
las cierra.

## Decisión

1. Eligibility lógica precede a Selection/Awards; un caso imposible consume
   cero RNG.
2. La candidatura nacional es un predictor latente purpose-scoped y se compara
   con un `SelectionCompetitionField` Gaussian mixture core/elite.
3. Call-up y squad son Bernoulli logistic separados; incumbency usa AR(1) en
   espacio logit y solo afecta contextos futuros.
4. InternationalRole/Minutes reutiliza ADR-072 con roles propios, incumbency en
   lugar de managerTrust y estado/streams nacionales separados.
5. National strengths/generations usan AR(1) logit; group y knockout reutilizan
   los outcomes agregados de ADR-075 sin squads completos.
6. Comparative awards generan utilities Normal de competitors abstractos y un
   único rank deriva nomination/shortlist/placement/winner.
7. Statistical awards V1 comparan el count observado contra un field NB2; el
   count del jugador no se resamplea.
8. Tie policies son `UNIQUE_CANONICAL`, `SHARED` o
   `STATISTICAL_SECONDARY_KEYS`; ninguna consume RNG.
9. Awards no usa MarketValue/CareerScore, no aplica anti-duplication y no puede
   consumir reputación generada por el mismo award.
10. Todos los valores pertenecen a `EngineParameterSet.nationalTeam/awards` o
    a Definitions data-driven según su semántica.

## Alternativas rechazadas

- threshold de calidad o MarketValue para convocar;
- planteles/candidatos completos simulados;
- call-up que garantice minutos;
- club managerTrust reutilizado como incumbency;
- protagonista que determine el resultado nacional;
- Bernoulli independiente por nomination/shortlist/winner;
- un field único para premios comparativos y estadísticos;
- goals/assists como evaluación universal;
- CareerScore/IJL como gameplay;
- RNG para ties;
- anti-duplication dentro de Awards;
- inferir sporting nationality, catálogo o calendar.

## Consecuencias

Las siete decisiones pasan a `PARTIAL_CALIBRATION`: ya no falta ecuación,
distribución, sampler, orden o stream. Quedan valores, Definitions, evidencia,
targets, goldens y DR-021/025/068. DR-059/060 pasan a
`PARTIAL_CALIBRATION`; DR-061 continúa hasta G3C-9 y DR-010 permanece en
Scoring.

## Gates

1. ParameterSet completo y validado;
2. DR-068 y Definitions de DR-025 aprobadas;
3. calendar/cursor internacional aprobado;
4. goldens con hashes cross-runtime;
5. Monte Carlo SMOKE/CALIBRATION/DEEP;
6. invariantes de cero RNG, ordinal coherence, context separation y no-score;
7. ninguna implementación antes de superar esos gates.

## Referencias

- [Especificación matemática](../NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
- [Especificación estructural](../NATIONAL_TEAM_AWARDS_SPEC.md)
- [Contrato matemático](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [ADR-059](./059-national-team-model.md)
- [ADR-060](./060-awards-model.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [ADR-072](./072-role-minutes-and-availability-mathematics.md)
- [ADR-073](./073-performance-production-form-mathematics.md)
- [ADR-075](./075-club-competition-world-mathematics.md)
- [DR-025](../DECISIONS_REQUIRED.md#dr-025--mercados-y-fuentes-del-mvp)
- [DR-059](../DECISIONS_REQUIRED.md#dr-059--campo-de-competencia-de-selección-nacional)
- [DR-060](../DECISIONS_REQUIRED.md#dr-060--premios-deportivos-y-fields-competitivos)
- [DR-068](../DECISIONS_REQUIRED.md#dr-068--nacionalidad-deportiva-y-elegibilidad-internacional-del-vertical-slice)
