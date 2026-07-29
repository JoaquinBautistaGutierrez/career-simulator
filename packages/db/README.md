# @career-simulator/db

## Responsabilidad

Implementará adaptadores de persistencia y migraciones fuera del núcleo puro.

## Dependencias permitidas

- `@career-simulator/domain`.
- `@career-simulator/schemas`.
- `@career-simulator/config` como tooling de desarrollo.
- Un driver/ORM futuro aprobado explícitamente.

## Dependencias prohibidas

- UI y reglas duplicadas de engine o scoring.
- Mutaciones que eviten invariantes del dominio.

## Estado actual

Frontera vacía y compilable. No hay tablas, queries, migraciones ni conexión.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/db lint
pnpm --filter @career-simulator/db typecheck
pnpm --filter @career-simulator/db build
```
