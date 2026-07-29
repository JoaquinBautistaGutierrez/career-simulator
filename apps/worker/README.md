# @career-simulator/worker

Bootstrap compilable del futuro proceso de jobs.

- Dependencias permitidas: configuración de desarrollo; application y adaptadores cuando sus contratos se aprueben.
- Dependencias prohibidas: reglas duplicadas, azar externo de gameplay y mutaciones fuera de casos de uso.
- Estado actual: no registra jobs, colas, replay ni Monte Carlo.

```bash
pnpm --filter @career-simulator/worker lint
pnpm --filter @career-simulator/worker typecheck
pnpm --filter @career-simulator/worker build
```
