# @career-simulator/scoring

## Responsabilidad

Será propietario del scoring versionado y ScoreLedger cuando DR-010 esté cerrado.

## Dependencias permitidas

- `@career-simulator/domain`.
- `@career-simulator/schemas`.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Engine, UI, HTTP, DB, narrativa y autenticación.
- Entradas de score creadas directamente por contenido.
- Fórmulas provisionales.

## Estado actual

Frontera vacía y compilable. No calcula puntos ni crea ledger.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/scoring lint
pnpm --filter @career-simulator/scoring typecheck
pnpm --filter @career-simulator/scoring build
```
