# @career-simulator/config

## Responsabilidad

Centraliza configuración compartida de TypeScript, ESLint, Prettier y Vitest.

## Dependencias permitidas

- Tooling raíz del workspace.
- Biblioteca estándar de Node únicamente dentro de archivos de configuración cuando sea necesaria.

## Dependencias prohibidas

- Cualquier package de dominio o aplicación.
- Lógica de gameplay, contratos de negocio y acceso a datos.

## Estado actual

Configuración base de G1. `src/index.ts` mantiene una frontera compilable sin exponer una API ficticia.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/config lint
pnpm --filter @career-simulator/config typecheck
pnpm --filter @career-simulator/config build
```
