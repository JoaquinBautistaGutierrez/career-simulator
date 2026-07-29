# @career-simulator/probability

## Responsabilidad

Es propietario de las APIs deterministas de probabilidad, PRNG, canonicalización y hash compartidas por el núcleo.

## Dependencias permitidas

- `@career-simulator/schemas`.
- `@noble/hashes`, encapsulada exclusivamente para SHA-256 y utilidades de bytes.
- `@career-simulator/config` como tooling de desarrollo.

## Dependencias prohibidas

- Domain, engine, scoring, UI, HTTP, DB y frameworks.
- `Math.random()`, reloj, UUID y entropía externa.

## Estado actual

Implementa RootSeed, xoshiro256**, derivación aislada de streams, uniformes de 53 bits, Probability/LogProbability/Odds/LogOdds, composición por log-odds, sampling, canonicalización RFC 8785 y SHA-256. Incluye golden vectors y property tests. No contiene distribuciones ni fórmulas de gameplay.

## Comandos aplicables

```bash
pnpm --filter @career-simulator/probability lint
pnpm --filter @career-simulator/probability typecheck
pnpm --filter @career-simulator/probability test
pnpm --filter @career-simulator/probability build
```
