# @career-simulator/ui

## Responsabilidad

Contendrá componentes y tokens visuales compartidos.

## Dependencias permitidas

- `@career-simulator/schemas` solo cuando exista un contrato real de presentación.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Engine, scoring, DB y reglas de dominio.
- Cálculo de resultados, estadísticas o puntos.

## Estado actual

Frontera vacía y compilable. No se instalaron React ni frameworks de UI.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/ui lint
pnpm --filter @career-simulator/ui typecheck
pnpm --filter @career-simulator/ui build
```
