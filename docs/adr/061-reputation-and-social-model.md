# ADR-061: Modelo estructural de reputación y audiencia social

- Estado: Aceptado; matemática cerrada por ADR-078, calibración/data pendientes
- Fecha: 2026-07-28
- Decisión relacionada: DR-061
- Refinado por: ADR-078
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

Followers es un entero exacto no negativo y puede crecer o caer. ADR-078 fija
`uint64` por partición no superpuesta, total derivado, estados acotados
cuantizados y error tipado —nunca clipping— ante overflow técnico.

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
- DR-061 queda `PARTIAL_CALIBRATION`: ADR-078 cierra matemática, dominios,
  precisión, streams y fixtures requeridos; todavía faltan values, definitions,
  evidence, goldens computados y calibración aprobada.

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

## Refinamiento matemático de G3C-9

[ADR-078](./078-reputation-public-attention-social-mathematics.md) y
[REPUTATION_SOCIAL_MATH_SPEC.md](../REPUTATION_SOCIAL_MATH_SPEC.md) fijan:

- AR(1) logit separado para Sporting, awareness, sentiment, attention y
  engagement;
- evidence memory exponencial, deduplicación y suma canónica;
- difusión regional lagged de un paso y vistas globales derivadas;
- acquisition/churn en log-space con mixture viral Bernoulli;
- `uint64`, `ROUND_HALF_EVEN`, overflow tipado y streams jerárquicos;
- batches en `CONSEQUENCES(Qn)` y `SEASON_CLOSE` sin nueva fase;
- targets, tail diagnostics y golden-vector requirements.

Permanecen pendientes values del ParameterSet, Definitions de mercados/reach,
evidencia externa, tolerancias y goldens computados. DR-025 conserva los datos
concretos del slice; DR-010 conserva Scoring. ADR-079 cierra la matemática de
Retirement/finalization y deja DR-062 en `PARTIAL_CALIBRATION` y DR-069
resuelta.

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
- [ADR-078: matemática de Reputation/Social](./078-reputation-public-attention-social-mathematics.md)
- [ADR-079: Retirement/Comeback/Finalization](./079-retirement-comeback-finalization-mathematics.md)
- [Especificación matemática](../REPUTATION_SOCIAL_MATH_SPEC.md)
- [Registro de decisiones — DR-061](../DECISIONS_REQUIRED.md#dr-061--reputación-deportiva-reputación-pública-y-seguidores)
