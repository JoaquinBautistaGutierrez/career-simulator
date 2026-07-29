# @career-simulator/data-football

## Responsabilidad

Normalizará snapshots versionados de entidades y datos futbolísticos.

## Dependencias permitidas

- `@career-simulator/schemas`.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Engine, scoring, UI, HTTP y mutaciones de DB.
- Datos o reglas inventados antes de cerrar las decisiones aplicables.

## Estado actual

Frontera vacía y compilable. No contiene clubes, competiciones ni fórmulas.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/data-football lint
pnpm --filter @career-simulator/data-football typecheck
pnpm --filter @career-simulator/data-football build
```
