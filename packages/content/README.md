# @career-simulator/content

## Responsabilidad

Validará y compilará contenido declarativo versionado.

## Dependencias permitidas

- `@career-simulator/schemas`.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Domain mutable, engine, scoring, DB y código arbitrario de contenido.
- Creación directa de ScoreLedger.
- Cooldowns, cupos o máximos artificiales.

## Estado actual

Frontera vacía y compilable. No existe intérprete ni catálogo de gameplay.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/content lint
pnpm --filter @career-simulator/content typecheck
pnpm --filter @career-simulator/content build
```
