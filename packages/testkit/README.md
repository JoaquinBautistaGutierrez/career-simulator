# @career-simulator/testkit

## Responsabilidad

Proveerá builders, fixtures y comparadores compartidos sin crear reglas exclusivas de tests.

## Dependencias permitidas

- `@career-simulator/domain`.
- `@career-simulator/schemas`.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- UI, HTTP, DB y reglas de gameplay inexistentes en producción.
- Seeds o resultados “correctos” inventados antes de aprobar fórmulas.

## Estado actual

Contiene RootSeed y VersionSet técnicos de test, y un builder de PendingDecision sintética para probar interrupciones del runner sin depender de engine. No contiene fixtures ni resultados de gameplay.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/testkit lint
pnpm --filter @career-simulator/testkit typecheck
pnpm --filter @career-simulator/testkit build
```
