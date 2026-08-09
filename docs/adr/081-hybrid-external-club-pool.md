# ADR-081: Pool híbrido de clubes externos para el vertical slice

- Estado: Aceptado
- Fecha: 2026-08-07
- Decisión relacionada: DR-065
- Refina: ADR-022, ADR-075 y ADR-076

## Contexto

El slice detalla ocho clubes por liga, pero necesita oponentes, champions,
movilidad, contratos y continuidad fuera del tier. No puede inventar clubes ni
simular todos los tiers con detalle.

## Decisión

Se adopta un modelo híbrido:

1. catálogo versionado de identidades reales autorizadas;
2. fields no identificables para contexto/oponentes sin consumer nominal;
3. materialización determinista y persistente cuando un club interactúa con el
   protagonista, entra/sale del tier o debe figurar en un fact nominal.

Un field abstracto nunca aparece como champion, contratante o club histórico.
La materialización conserva `clubId`, dataVersion, operation key, provenance y
state inicial reproducible. Un club del protagonista que desciende conserva
contrato e identidad y recibe el adapter reducido suficiente para continuar.

## Consecuencias

- DR-065 queda resuelta como policy; el identity pool y sus bindings siguen
  `DATA_REQUIRED`.
- No hay identity floors, transfer automático ni forced retirement.
- Agregar/cambiar identities publicadas requiere nuevo `dataVersion`.
- Cambiar materialization/state semantics requiere `engineVersion` y goldens.
- Fields pueden reducir costo, pero no crear facts nominales.

## Alternativas rechazadas

- tiers completos: exceden el slice;
- pool solo abstracto: rompe historia/contratos/facts nominales;
- materializar identities ficticias: contradice MASTER_SPEC;
- impedir descenso o forzar salida del protagonista: protege identidad y rompe
  causalidad.

## Gates

- catálogo real y licencias;
- deterministic identity/materialization goldens;
- adapters de Calendar, Role, Performance, Market y Scoring;
- mobility/continuity Monte Carlo.

## Referencias

- [Vertical Slice Data Catalog](../VERTICAL_SLICE_DATA_CATALOG_SPEC.md)
- [Club/Competition/World Spec](../CLUB_COMPETITION_WORLD_SPEC.md)
- [DR-065](../DECISIONS_REQUIRED.md#dr-065--scope-competitivo-pools-externos-y-continuidad-fuera-del-tier)

