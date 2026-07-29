# @career-simulator/telemetry

## Responsabilidad

Contendrá adaptadores sanitizados de métricas, logs y trazas.

## Dependencias permitidas

- `@career-simulator/schemas` solo cuando exista un contrato real.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Decidir resultados, probabilidades o scoring.
- Ser llamada desde funciones puras del núcleo para modificar comportamiento.
- PII o secretos sin política aprobada.

## Estado actual

Frontera vacía y compilable. No hay provider ni eventos analíticos.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/telemetry lint
pnpm --filter @career-simulator/telemetry typecheck
pnpm --filter @career-simulator/telemetry build
```
