# @career-simulator/domain

## Responsabilidad

Contiene invariantes y funciones puras del dominio, sin infraestructura ni frameworks.

## Dependencias permitidas

- `@career-simulator/schemas`.
- Biblioteca estándar sin efectos externos.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- UI, React, Next.js, HTTP, DB, telemetría y variables de entorno.
- Reloj real, UUID o fuentes de azar.
- Fórmulas de gameplay no aprobadas.

## Estado actual

Implementa `getPositionGroup` y la matriz completa de lifecycle de ADR-016 mediante `canTransitionCareer` y una transición segura. No contiene agregados deportivos ni gameplay.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/domain lint
pnpm --filter @career-simulator/domain typecheck
pnpm --filter @career-simulator/domain test
pnpm --filter @career-simulator/domain build
```
