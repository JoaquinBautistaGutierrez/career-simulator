# @career-simulator/schemas

## Responsabilidad

Define schemas Zod y tipos inferidos para contratos serializables compartidos.

## Dependencias permitidas

- Zod.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Domain, engine, scoring, UI, HTTP, DB y frameworks.
- Reglas o fórmulas de gameplay.

## Estado actual

Contiene Position, PositionGroup, DominantFoot, CareerStatus y VersionSet, más los contratos estructurales aprobados de G2: RootSeed, posiciones del pipeline Q1–Q4 y SimulationCursor. No contiene agregados ni reglas de gameplay.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/schemas lint
pnpm --filter @career-simulator/schemas typecheck
pnpm --filter @career-simulator/schemas test
pnpm --filter @career-simulator/schemas build
```
