# @career-simulator/web

Shell compilable de la futura aplicación web.

- Dependencias permitidas: configuración de desarrollo; UI, schemas, api-client o engine solo cuando un caso aprobado lo requiera.
- Dependencias prohibidas: DB directa, scoring duplicado y autoridad competitiva del cliente.
- Estado actual: sin React, Next.js, UX ni lógica de producto.

```bash
pnpm --filter @career-simulator/web lint
pnpm --filter @career-simulator/web typecheck
pnpm --filter @career-simulator/web build
```
