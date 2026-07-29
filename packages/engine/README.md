# @career-simulator/engine

## Responsabilidad

Orquesta ejecución pura usando dominio, schemas y probabilidad determinista.

## Dependencias permitidas

- `@career-simulator/domain`.
- `@career-simulator/schemas`.
- `@career-simulator/probability`.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Scoring, React, Next.js, HTTP, DB, UI, telemetría y frameworks.
- IO, reloj real, UUID y fuentes externas de azar.
- Gameplay dependiente de DR pendientes.

## Estado actual

Implementa solamente la máquina estructural de G2: SimulationCursor, plan canónico de 38 operaciones, advance(n), interrupción WAITING_DECISION, reanudación, checkpoints y replay estructural. Incluye tests de cadencia, aislamiento arquitectónico y golden replay. No existe motor de gameplay ni se calculan hechos deportivos.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/engine lint
pnpm --filter @career-simulator/engine typecheck
pnpm --filter @career-simulator/engine test
pnpm --filter @career-simulator/engine build
```
