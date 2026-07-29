# Reglas para agentes

## Fuente normativa

- `docs/MASTER_SPEC.docx`, `docs/*.md` y `docs/adr/*.md` son la fuente normativa del proyecto.
- No introducir reglas de gameplay que no estén especificadas.
- No cerrar ni completar DR pendientes por inferencia.
- Todo cambio arquitectónico relevante requiere un ADR.

## Límites de dependencias

- `packages/domain` no depende de UI, HTTP, base de datos ni frameworks.
- `packages/engine` no depende de React, Next.js, HTTP, base de datos ni `packages/scoring`.
- Las dependencias entre packages deben respetar `docs/adr/050-foundation-package-boundaries.md`.
- No introducir dependencias circulares.

## Determinismo y gameplay

- Nunca usar `Math.random()`, `Date.now()`, reloj del sistema, UUID ni otras fuentes externas como azar de gameplay.
- Todo azar futuro entra mediante APIs deterministas explícitas.
- Los eventos de contenido no pueden crear ScoreLedger directamente.
- No introducir caps, cooldowns, cuotas ni máximos artificiales de eventos.
- No implementar gameplay que dependa de DR pendientes.

## Código

- TypeScript strict es obligatorio.
- Evitar `any`; si fuera inevitable, documentar y justificar el límite.
- Preferir funciones puras en `domain`, `probability`, `engine` y `scoring`.
- Preservar, donde corresponda, las cinco versiones canónicas:
  - `schemaVersion`;
  - `engineVersion`;
  - `contentVersion`;
  - `dataVersion`;
  - `scoringVersion`.
- Validar inputs en los bordes autoritativos. No confiar en datos del cliente.
- No hardcodear secretos, tokens ni credenciales.

## Definition of Done

Antes de considerar terminada una tarea de código:

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm check:deps
```

Además:

- corregir todos los errores;
- inspeccionar el grafo de dependencias;
- confirmar que no se agregó gameplay no autorizado;
- confirmar que no se introdujeron fuentes de azar prohibidas;
- informar cualquier check no ejecutado o bloqueo real.
