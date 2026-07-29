# Career Simulator

Fundación ejecutable del simulador de carrera. G2 agrega el núcleo determinista y la máquina estructural de avance sobre el tooling y los límites de G1. Todavía no contiene gameplay ni fórmulas futbolísticas.

## Requisitos

- Node.js 24 o superior.
- pnpm 11.5.2.

## Comandos

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:deps
```

`pnpm format` aplica Prettier a los archivos bajo su alcance. La documentación normativa existente está excluida del formateo automático.

## Estructura

- `apps/`: shells compilables; todavía no contienen UX, endpoints ni jobs reales.
- `packages/`: límites modulares y contratos compartidos.
- `content/`: releases declarativas futuras.
- `data/`: snapshots futbolísticos futuros.
- `scripts/`: controles del workspace.
- `docs/`: especificación y ADR normativos.

## Estado técnico G2

- TypeScript 6.0.3 se fija porque es la versión estable más nueva compatible con el rango declarado por `typescript-eslint` 8.65.
- ESLint usa flat config compartida desde `packages/config`.
- Vitest usa una configuración compartida y solo corre suites con valor actual.
- Los shells de `web`, `api`, `worker` y `admin` permanecen sin frameworks de runtime en G1. Esto evita instalar React, Next.js, Fastify o drivers de datos antes de que exista comportamiento para ejecutar; no sustituye las decisiones de stack documentadas.
- El control `scripts/check-workspace-dependencies.mjs` valida el grafo declarado y sus ciclos.
- `packages/probability` implementa RootSeed, xoshiro256**, streams derivados, probabilidad segura, RFC 8785 y SHA-256.
- `packages/domain` implementa el lifecycle aprobado de Career.
- `packages/engine` implementa cursor, advance, WAITING_DECISION y replay exclusivamente estructurales.
- Los golden vectors V1 y 205 tests fijan los contratos técnicos sin introducir hechos deportivos.

## Regla principal

Antes de cambiar contratos o dependencias, revisar [AGENTS.md](./AGENTS.md) y [la arquitectura](./docs/ARCHITECTURE.md).
