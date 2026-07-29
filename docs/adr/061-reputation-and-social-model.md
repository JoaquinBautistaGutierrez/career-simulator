# ADR-061: Modelo estructural de reputación y audiencia social

- Estado: Aceptado para estructura; matemática pendiente
- Fecha: 2026-07-28
- Decisión relacionada: DR-061
- Alcance: reputación deportiva, reputación pública, mercados, atención,
  followers, engagement y frontera con consumidores

## Contexto

`MASTER_SPEC` exige que rendimiento deportivo, popularidad y redes puedan
evolucionar de forma independiente. El modelo previo no fijaba dimensiones,
ownership regional, memoria o una ruta única para transformar hechos en
followers; eso permitía crear un `fameOverall`, duplicar evidencia o dejar que
contenido escribiera contadores directamente.

## Decisión

### Estados separados

Se mantienen:

```text
SportingReputationState
PublicReputationState
PublicAttentionState
AudienceState
```

- Sporting Reputation es percepción deportiva acumulada, no capacidad real.
- Public Reputation separa `awareness` y `sentiment`.
- Reach global es una proyección regional, no un tercer contador causal.
- Public Attention representa exposición reciente y no reemplaza reputación.
- Audience separa `FollowerCount` de `EngagementState`.
- No existe `fameOverall`.

Followers es un entero exacto no negativo y puede crecer o caer. La
representación técnica de rango ampliado, los dominios de reputación/engagement
y la precisión quedan pendientes en DR-061/063.

### Scopes regionales

Los mercados se definen mediante un `ReputationMarketDefinition` ligado a
`dataVersion`. El engine no hardcodea países. El slice debe poder resolver
mercado de origen, mercado futbolístico vigente y vista global; esta última se
deriva sin borrar procedencia.

### Ruta causal

```text
domain facts
-> ReputationSignal / PublicAttentionSignal
-> deduplication by EvidenceKey
-> Reputation/Social owner
-> updated state
```

Los productores no imponen `followersDelta` o `reputationDelta`. Content no
escribe esos estados mediante un efecto arbitrario. Un shock público usa una
identidad causal compartida para correlacionar reputación, followers y
engagement sin hacerlos aliases o sorteos independientes.

Sporting Reputation consume evidencia deportiva observable, no capabilities,
traits ocultos, MarketValue, Public Reputation, CareerScore o prestigio copiado
del club. Una causa entra una sola vez.

### Fronteras

- Reputation/Social no modifica capabilities.
- Market, Selection y Awards consumen proyecciones autorizadas.
- Public Reputation solo entra en Awards cuando la Definition lo permite.
- Sponsors quedan diferidos; solo se expone un contexto futuro.
- Reputation/Social no escribe ScoreLedger. Scoring consume únicamente los
  facts allowlisted por DR-063/ADR-010.

## Consecuencias

- Se pueden representar excelencia poco famosa, fama sin excelencia, fama local
  y sentimiento mixto.
- La atención viral puede ser alta sin crear reputación estable automática.
- El estado global es reproducible desde mercados y parámetros versionados.
- La dinámica puede incluir memoria, decay, churn, regresión y shocks sin floors
  o hard caps editoriales.
- DR-061 sigue bloqueando gameplay por matemática, dominios, precisión,
  streams, parámetros, fixtures y calibración.

## Alternativas rechazadas

### Un único fame overall

Rechazada porque fusiona mérito, visibilidad, sentimiento y audiencia.

### Followers como reputación pública

Rechazada porque un contador de audiencia no expresa valoración ni engagement.

### Países fijos en el engine

Rechazada porque impide ampliar mercados y mezcla dataVersion con lógica.

### Deltas directos desde cada módulo o evento

Rechazada porque duplica causas, rompe ownership y permite bypass de balance.

### Crecimiento monotónico

Rechazado porque contradice caídas, churn, polémicas e inactividad.

## Pendiente

DR-061 debe cerrar:

- dominios, escalas, precisión y serialización;
- ecuaciones de memoria/actualización;
- familia de conteos y cambios de followers;
- regional diffusion/agregación;
- correlaciones y shared shocks;
- parámetros, streams, golden fixtures y targets Monte Carlo;
- mercados concretos del slice junto con DR-025.

## Pruebas y gates

- Sporting/Public Reputation, followers y engagement no son aliases.
- Mismo fact/evidence key no se aplica dos veces.
- Vista global conserva procedencia regional.
- Followers nunca es negativo ni floating point persistido.
- Existen trayectorias crecientes, decrecientes, estables y con outliers.
- Un shock compartido es reproducible y no desplaza otros streams.
- Content no puede escribir seguidores/reputación fuera del contrato.
- Ningún output crea ScoreLedger.

## Referencias

- [Especificación de Reputation, Social & Retirement](../REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
- [ADR-014: DSL de eventos](./014-event-dsl.md)
- [ADR-015: Versionado](./015-version-taxonomy.md)
- [ADR-060: Awards](./060-awards-model.md)
- [Registro de decisiones — DR-061](../DECISIONS_REQUIRED.md#dr-061--reputación-deportiva-reputación-pública-y-seguidores)
