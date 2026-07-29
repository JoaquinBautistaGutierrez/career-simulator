# @career-simulator/admin

Shell compilable de la futura aplicación administrativa.

- Dependencias permitidas: configuración de desarrollo; UI, schemas y api-client cuando existan casos aprobados.
- Dependencias prohibidas: acceso directo que evite validación/publicación y reglas de gameplay.
- Estado actual: sin framework, UX, autenticación ni edición de contenido.

```bash
pnpm --filter @career-simulator/admin lint
pnpm --filter @career-simulator/admin typecheck
pnpm --filter @career-simulator/admin build
```
