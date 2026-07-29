# @career-simulator/api-client

## Responsabilidad

Contendrá contratos tipados para consumir APIs sin recalcular verdad competitiva.

## Dependencias permitidas

- `@career-simulator/schemas`.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Engine, scoring, DB, UI y reglas de autorización server-side.
- Confianza en score o estadísticas enviados por el cliente.

## Estado actual

Frontera vacía y compilable. No hay transportes ni endpoints.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/api-client lint
pnpm --filter @career-simulator/api-client typecheck
pnpm --filter @career-simulator/api-client build
```
