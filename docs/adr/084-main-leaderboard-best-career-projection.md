# ADR-084: Mejor Career por usuario y clave en el leaderboard principal V1

- Estado: Aceptado
- Fecha: 2026-08-07
- Decisiones relacionadas: DR-034, DR-036 y DR-037
- Refina: ADR-016 y ADR-080

## Contexto

ADR-080 exige compatibilidad exacta, pero no decide si un usuario puede ocupar
la tabla principal con todas sus Careers, solo una submission o su mejor run.
La elección afecta fairness visible, farming, replayability, auditabilidad y
privacidad, aunque no cambia el score de ninguna Career.

## Decisión

V1 adopta una proyección `BEST_ELIGIBLE_PER_USER_AND_COMPATIBILITY_KEY`:

1. solo Careers `COMPLETED`, íntegras y elegibles entran al conjunto candidato;
2. se agrupan por `LeaderboardUserKey` y exact
   `LeaderboardCompatibilityKey` de ADR-080;
3. la tabla principal conserva la Career con mayor PC de cada grupo;
4. en empate se usa logical finalization order y luego `careerId` canónico;
5. no se consume RNG y no se usa reloj del sistema como identidad causal;
6. todas las Careers se conservan en profile/audit según privacy/retention;
7. no hay límite de intentos, cooldown ni efecto sobre seed, engine o scoring;
8. claves incompatibles nunca se comparan ni agrupan.

`LeaderboardUserKey` es una identidad pseudónima autoritativa de aplicación,
no un input de gameplay ni un `AnonymousObservationId` de calibración. Su
derivación, guest/account merge, borrado y visibilidad permanecen en DR-030/037.

La policy de materialización se versiona como metadata del leaderboard, no como
sexta versión canónica de Career. Cambiar score, eligibility o compatibility
continúa siguiendo `scoringVersion`/ADR-080; cambiar solo la vista crea otra
policy/materialización y no reescribe snapshots.

## Consecuencias

- reduce duplicados visibles sin castigar replay ni borrar runs;
- requiere index/aggregation autoritativos por user key + compatibility key;
- leaderboard y profile pueden mostrar conjuntos distintos de las mismas
  Careers;
- audit puede reconstruir por qué una Career quedó seleccionada;
- deletion/appeal/account merge deben recomputar la proyección sin mutar score;
- DR-036 queda resuelta para V1; cross-version equivalence no se habilita.

## Alternativas rechazadas

- **todas las Careers en tabla principal:** premia volumen y permite múltiples
  filas del mismo usuario;
- **primera Career:** penaliza replay y no refleja mejor resultado;
- **una submission irreversible por ruleset:** agrega fricción, revoke/appeal y
  decisiones operativas innecesarias para V1;
- **mejor Career cross-version:** viola exact compatibility y comparabilidad.

## Gates

- policy autoritativa de `LeaderboardUserKey` y privacy DR-037;
- guest/account merge y deletion semantics;
- tie/order golden sin system clock;
- rebuild idempotente de materialización;
- audit de elegibilidad e integridad.

## Referencias

- [G3D Product Decisions](../G3D_PRODUCT_DECISIONS.md)
- [Architecture](../ARCHITECTURE.md#122-ranking)
- [DR-036](../DECISIONS_REQUIRED.md#dr-036--comparabilidad-entre-versiones)
- [ADR-016](016-career-lifecycle.md)
- [ADR-080](080-exact-scoring-mathematics.md)
