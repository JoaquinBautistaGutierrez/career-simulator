# ADR-050: Límites iniciales de packages

- Estado: Aceptado
- Fecha: 2026-07-27
- Alcance: monorepo, dependencias internas y enforcement de arquitectura

## Contexto

La fundación ejecutable necesita un grafo mínimo sin dependencias circulares. La arquitectura inicial también permitía conceptualmente que `engine` conociera `scoring`, pero G1 establece que ambos permanezcan separados salvo una decisión normativa posterior.

## Decisión

Los packages usan el namespace `@career-simulator/*` y respetan inicialmente:

```text
schemas

domain -> schemas
probability -> schemas
engine -> domain + schemas + probability
scoring -> domain + schemas
content -> schemas
data-football -> schemas
db -> domain + schemas
api-client -> schemas
ui
telemetry
testkit -> domain + schemas
config
```

Las referencias a `config` son dependencias de desarrollo y no forman parte del grafo de runtime.

ADR-051 autoriza a `probability` a depender de `@noble/hashes` como implementación externa encapsulada de SHA-256. Esta dependencia no altera la dirección entre packages internos. Los consumidores usan exclusivamente la API de `probability`.

`engine` no depende de `scoring`. ADR-010 fija el contrato explícito por el que
scoring consume `DomainFact` confirmados sin convertir al engine en propietario
del `ScoreLedger`.

Los packages vacíos exportan solamente su frontera de módulo. No se crean APIs ficticias para anticipar DR pendientes.

El enforcement inicial combina:

- manifests con dependencias explícitas;
- script que valida allowlists y ciclos;
- test de imports prohibidos dentro de `packages/engine`;
- TypeScript strict y resolución por package exports.

## Consecuencias

- Agregar una dependencia interna exige actualizar el ADR o demostrar que ya está permitida.
- `ui` y `telemetry` no dependen de schemas hasta que tengan un contrato real que lo requiera.
- Los shells de apps no introducen dependencias de runtime en G1.
- Scoring queda reemplazable y testeable sin intervenir en el orden de simulación.
- El grafo se puede inspeccionar sin instalar una herramienta adicional.

## Alternativas rechazadas

### Acoplar engine y scoring desde la fundación

Rechazada porque no existe todavía una fórmula aprobada ni un contrato que requiera ese acoplamiento.

### Permitir cualquier dependencia mientras los packages estén vacíos

Rechazada porque consolidaría direcciones incorrectas antes del dominio.

### Instalar una herramienta externa de arquitectura

Rechazada en G1: un script pequeño con Node cubre el grafo actual sin sumar una dependencia.

## Pruebas requeridas

- El grafo declarado no contiene ciclos.
- Cada dependencia interna está en la allowlist del package.
- `engine` no importa React, Next.js, HTTP, DB ni scoring.
- Los cuatro comandos raíz completan correctamente.

## Referencias

- [Arquitectura](../ARCHITECTURE.md#5-regla-de-dependencias)
- [Plan de implementación](../IMPLEMENTATION_PLAN.md#p2--fundación-del-repositorio)
- [ADR-051: Contratos binarios del núcleo determinista](./051-deterministic-core-byte-contracts.md)
- [ADR-010: Domain Facts y ScoreLedger estructural](./010-scoring-ledger-and-domain-facts.md)
