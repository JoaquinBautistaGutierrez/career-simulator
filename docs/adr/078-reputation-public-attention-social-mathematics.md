# ADR-078: Matemática de Reputation, Public Attention y Social

- **Estado:** Aceptado — familias y ecuaciones; calibración/data pendientes
- **Fecha:** 2026-08-01
- **Decisiones relacionadas:** DR-008, DR-010, DR-016, DR-017, DR-056,
  DR-058, DR-059, DR-060, DR-061, DR-062, DR-063 y DR-069
- **Refina:** ADR-013, ADR-043, ADR-061, ADR-070, ADR-073, ADR-076 y ADR-077
- **Refinado posteriormente por:** ADR-079 para adapters de Retirement/finalization
- **Especificación:**
  [REPUTATION_SOCIAL_MATH_SPEC.md](../REPUTATION_SOCIAL_MATH_SPEC.md)

## Contexto

ADR-061 separó Sporting Reputation, awareness, sentiment, Public Attention,
followers y engagement, pero dejó abiertas sus escalas, memoria, difusión,
ecuaciones, precisión, shocks, streams y calibración. G3C-9 debe cerrar las tres
decisiones G3B-K01/K02/K05 sin inventar Retirement, Scoring, Sponsors o datos
de mercados.

Sin una decisión normativa, una implementación podría:

- crear un `FameOverall` causal;
- usar Followers, MarketValue o CareerScore como mérito deportivo;
- aplicar el mismo fact varias veces mediante aliases;
- dejar que Content escriba followers/reputation directamente;
- forzar correlación positiva entre awareness y sentiment;
- convertir followers en un count monotónico o float persistido;
- producir feedback instantáneo Award→Reputation→Award;
- hardcodear países, aplicar caps de audiencia o desplazar streams al añadir
  un mercado.

## Decisión

### Estados y escalas

Sporting standing, sporting evidence, awareness, attention components y
engagement persisten como enteros `0..10000`. Sentiment persiste como entero
centrado `-10000..10000`. Followers persiste como `uint64` exacto por
partición de audiencia no superpuesta; el total es una suma derivada.

Los estados acotados evolucionan en espacio logit y vuelven mediante
`ROUND_HALF_EVEN`. Sentiment mapea `[-1,1]` a probabilidad auxiliar antes del
logit. Followers evoluciona en log-space mediante un adapter binary64
versionado y falla tipadamente si el resultado no es representable; nunca se
clampa al rango técnico.

No existe `FameOverall`. Las vistas home/current/global y la attention agregada
son derivadas.

La inicialización usa snapshot/data/reach/facts autorizados y priors
parametrizados con streams propios; nunca hidden traits o wall clock.

### Evidence, memoria y difusión

Domain Facts autorizados se transforman en señales tipadas. `EvidenceKey`
deduplica `(sourceFact, semanticFacet, purpose)`. Impulsos se reducen con orden
canónico y `CanonicalPairwiseSumV1`; ningún input order, alias o query order
cambia el resultado.

Sporting Reputation usa AR(1) mean-reverting en logit con impulsos deportivos,
evidence gating y factores Normal global/regional/específico. Evidence total y
por source family usa memoria saturante exponencial. No consume hidden state,
Public Reputation, Followers, MarketValue, CareerScore, scoring values o IJL.

Mercados pertenecen a `dataVersion`. La difusión realiza un único paso por
boundary sobre un grafo versionado y estados lagged; no existe solve recursivo
regional. Global es una proyección ponderada y no otro state.

### Public Reputation y Attention

Awareness y sentiment tienen AR(1) separados. Awareness puede consumir
Sporting/Attention/reach lagged; Followers nunca es causa same-window.
Sentiment solo responde a señales públicas explícitas y puede ser positivo,
neutral, divisivo o negativo con cualquier awareness.

Public Attention persiste componentes por decay family con AR(1) más rápido
que Sporting/Awareness. El aggregate usa la unión complementaria de componentes.
No hay cooldown, max events o timer diario falso.

### Followers y engagement

Followers usa adquisición y churn `softplus` separados dentro de una
transición neta en `log1p(followers)`. Awareness, attention, reach, sentiment,
actividad, escala y factores jerárquicos son inputs. Una mixture Bernoulli más
magnitud positiva genera la cola viral; no tiene cuota ni cap.

Negative sentiment puede elevar notoriedad/adquisición y churn a la vez. El
outcome neto puede crecer, caer o permanecer igual. Engagement es otro AR(1)
logit con attention, sentiment, actividad y efecto suave de escala; no es
audience size.

### Timing

No se agrega una fase al plan de ADR-013/043. Dos suboperaciones versionadas
ejecutan batches atómicos:

1. `CONSEQUENCES(Qn).reputationSocial`, con facts cerrados hasta Health de Qn;
2. `SEASON_CLOSE.reputationSocial`, con el remanente posterior, después de
   Awards/Award Events/Postseason Events y antes del commit de temporada.

Todos los Reputation candidates usan states previos entre sí. Social consume
los candidates resultantes, pero no retroalimenta Reputation en ese batch.
Market/Selection/Awards consumen snapshots confirmados lagged. Un award,
transfer o follower change actual no puede modificar la resolución que lo
causó.

### Randomness

Shocks Standard Normal se separan por global, región, causa y componente.
Viral eligibility usa `BinomialInverseCdfV1(1,p)` y su magnitude solo consume
draw si ocurre. Context keys incluyen player, operation, market/partition,
source/decay family y occurrence. Añadir un mercado no desplaza otros streams.

## Alternativas rechazadas

1. Un state o rating único de fama.
2. Public Reputation = Followers.
3. Awareness y sentiment como un único eje.
4. Sporting Reputation alimentada por MarketValue, CareerScore o Followers.
5. Deltas numéricos libres desde Content o productores.
6. Suma dependiente del orden o “solo el evento mayor”.
7. Difusión regional iterativa same-boundary.
8. Awareness alimentada por Followers de la misma operación.
9. Followers monotónicos o `followers += fixedEventValue`.
10. Conteos auxiliares de acquisition/churn sin consumer.
11. Hard cap de followers o saturación al límite técnico.
12. Un único shock social para todos los mercados/componentes.
13. Reputation actualizada antes de cerrar el fact causal.
14. Nueva fase top-level de temporada.
15. Scoring, Sponsors o Retirement dentro de este resolver.

## Consecuencias

- G3B-K01/K02/K05 pasan a `PARTIAL_CALIBRATION`; no queda matemática o
  sampler abierto.
- DR-061 pasa a `PARTIAL_CALIBRATION` por values, data, evidence, targets y
  goldens.
- DR-056/058/059/060 reciben adapters lagged sin reabrir su matemática.
- DR-010 permanece en G3C-11; Reputation/Social no escribe ScoreLedger.
- ADR-079 cierra posteriormente Retirement/Comeback/finalización; las
  ecuaciones Reputation/Social y su lag no cambian.
- DR-025 debe publicar mercados, partitions y reach del slice.
- Cambiar ecuaciones, aggregation, storage range, timing, sampler,
  quantization o stream contract requiere revisar este ADR, cambiar
  `engineVersion` y publicar nuevos goldens.

## Gates

1. `EngineParameterSet.reputationSocial` completo y hash publicado;
2. Definitions de mercados/reach/public profiles versionadas;
3. payloads de facts y schemas conformes a DR-063;
4. goldens cross-runtime de states, lag, regions y followers exactos;
5. Monte Carlo SMOKE/CALIBRATION/DEEP, incluidas colas y runaway diagnostics;
6. invariantes de deduplicación, no-score, no-capability y stream isolation;
7. ninguna implementación antes de superar los gates aplicables.

## Referencias

- [Especificación matemática](../REPUTATION_SOCIAL_MATH_SPEC.md)
- [Especificación estructural](../REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
- [Contrato matemático](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Facts y Scoring](../SCORING_FACTS_SPEC.md)
- [ADR-061](./061-reputation-and-social-model.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [ADR-073](./073-performance-production-form-mathematics.md)
- [ADR-076](./076-transfer-market-contract-mathematics.md)
- [ADR-077](./077-national-team-awards-mathematics.md)
- [ADR-079](./079-retirement-comeback-finalization-mathematics.md)
- [DR-061](../DECISIONS_REQUIRED.md#dr-061--reputación-deportiva-reputación-pública-y-seguidores)
- [DR-069](../DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso)
