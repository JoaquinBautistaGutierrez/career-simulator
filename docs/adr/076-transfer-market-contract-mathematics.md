# ADR-076: Matemática de Transfers, Market & Contracts

- **Estado:** Aceptado — familias y ecuaciones; calibración/policies pendientes
- **Fecha:** 2026-07-29
- **Decisiones relacionadas:** DR-008, DR-021, DR-022, DR-027, DR-048, DR-049,
  DR-058, DR-061, DR-063 y DR-065 a DR-067
- **Refina:** ADR-058, ADR-070 y ADR-075
- **Especificación:**
  [TRANSFER_MARKET_CONTRACT_MATH_SPEC.md](../TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)

## Contexto

ADR-058 cerró la estructura causal de mercado, pero dejó abiertas las cinco
decisiones matemáticas G3B-G01–G04/G07: campo de candidatos, necesidad,
interés, oferta, negociación y valor monetario. La implementación no puede
elegir por su cuenta:

- cómo generar ClubNeed o interés sin thresholds;
- cómo separar valuation, fee y salary;
- qué distribución y cuantización monetaria usar;
- cómo correlacionar el mercado sin compartir draws accidentalmente;
- cuántas rondas de negociación existen;
- qué se congela antes de `WAITING_DECISION`;
- cómo se evita resamplear al reanudar.

DR-027, DR-065, DR-066 y DR-067 conservan decisiones de data/policy. Este ADR
no las cierra.

## Decisión

### Candidate field, need y fit

`ClubCandidateField` enumera en orden canónico todas las identidades autorizadas
que cumplen restricciones lógicas. No samplea un top-N ni aplica caps.

`ClubNeed` usa un predictor logistic-Normal condicionado por
`PositionCompetition`, gap de calidad contextual, demanda táctica, estrategia,
finanzas, escasez, persistencia y factores market/region/club. `PlayerClubFit`
usa posición, TacticalFit, need, oportunidad esperada, level match y
adaptación; no usa prestige como sustituto.

### Interest y offer

Interest usa una transición Bernoulli logistic de primer orden por candidato.
Offer usa otro Bernoulli logistic condicionado a interés, necesidad,
feasibility, urgencia, competencia entre bidders, contrato y fit. Los uniforms
y shocks específicos son independientes.

`BidderCompetitionField` se deriva de la intensidad de todos los intereses
activos; no simula compradores adicionales ni limita su cantidad.

### Percepción y valuation

Market consume `PlayerKnowledge`, summaries/production observables, evidence,
edad, posición, riesgo comunicado, sporting reputation y contrato. Nunca lee
TrueCapabilities, traits ocultos, potencial verdadero o CareerScore.

Cada club obtiene una valoración en log-space:

```text
log(clubReferenceValueMinor)
= currency/context scale
+ perceived player/context predictor
+ hierarchical Normal factors
```

`MarketReferenceValue` es la mediana ponderada canónica en log-space de un
panel versionado independiente de los intereses realizados. Es una estimación,
no una verdad.

### Money, fee y salary

Money persiste:

```text
integer amountMinor + currencyCode
```

MarketValue y salary son positivos. Fee de permanent transfer activo es
positivo; free transfer usa exactamente cero y no consume draw de fee.

Fee y salary se samplean en log-space con `StandardNormalInverseCdfV1` y se
cuantizan mediante `ROUND_HALF_EVEN`. Overflow, underflow inválido o contexto
monetario incomparable producen error tipado; nunca clipping, conversión
implícita o cap editorial.

Fee usa valuation, seller leverage, urgencia, bidder competition, market y
escasez. Salary usa quality/reputation percibidos, ContractExpectation,
financialPower, wage environment, bidder competition, edad y player leverage.
Salary no se deriva de fee.

### ContractProposal

La propuesta resuelve:

```text
ContractExpectation softmax
→ duration softmax sobre catálogo policy/data
→ salary log-space
```

`ContractExpectation` conserva:

```text
DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE
```

y nunca determina SportingRole o minutos.

V1 no incorpora clauses avanzadas, loan fee, wage split u option-to-buy.

### Seller, negotiation y player decision

Seller reservation es una valoración latente separada de MarketValue. La
respuesta usa logistic sobre fee relativo, leverage, replacement, finanzas y
urgencia.

V1 usa una sola resolución agregada de negociación. No existen rondas,
revisions o loops dentro de una occurrence. El único stage es estructura
finita, no un cap sobre oportunidades futuras.

La negociación usa buyer, seller y player-reservation surplus más feasibility,
bidder field, friction y un shock específico. Si el usuario controla la
elección:

- la proposal completa está congelada;
- no se samplea player choice;
- resolver el `PendingDecision` consume cero RNG;
- reanudar no vuelve a resolver ninguna etapa anterior.

Una policy automática futura puede usar softmax sobre ofertas + STAY bajo
ADR-020.

### Renewals, loans y affiliations

Renewal propensity usa logistic y crea un contrato sucesor; no muta el
predecesor.

Loan propensity usa logistic. El receptor atraviesa candidate→need→fit→
interest→offer. El loan conserva `contractHoldingClubId` y cambia
`currentSportingClubId`. V1 no modela loan fee ni wage split.

### Correlaciones y streams

Se usan factores Standard Normal jerárquicos:

```text
market window
→ region
→ club strategy/evaluation/wage policy
→ entity-specific
```

Cada factor posee `RandomDrawKey` y se comparte por referencia. Interest,
offer, fee, salary, seller response, duration, expectation, negotiation,
renewal y loan tienen purposes independientes.

### Timing y policies abiertas

Las ecuaciones aceptan un `MarketWindowContext` y un boundary autorizado. No
crean calendario.

- DR-065 conserva pool/continuidad fuera del tier.
- DR-066 conserva RegistrationEligibility.
- DR-067 conserva cualquier Market/movement mid-season.
- El cursor vigente solo permite Market post-season.

## Alternativas rechazadas

1. **Samplear top-N clubs:** introduce cap y dependencia de orden.
2. **Threshold de quality/age/need:** elimina tails válidas.
3. **Interest=Offer:** borra una etapa causal.
4. **Valor objetivo único:** contradice PlayerKnowledge.
5. **MarketValue=fee=salary:** fusiona semánticas distintas.
6. **Promedio de offers como MarketValue:** crea circularidad.
7. **Fee/salary en floating point persistido:** pierde exactitud.
8. **Clipping monetario al rango técnico:** convierte representación en cap.
9. **Moneda/conversión implícita:** cierra DR-027 por inferencia.
10. **Salary como porcentaje de fee:** crea causalidad no aprobada.
11. **ContractExpectation→SportingRole:** convierte promesa en minutos.
12. **Loan sobrescribiendo club contractual:** pierde afiliación dual.
13. **Negociación iterativa/rejection loop:** complica replay y consumo.
14. **Máximo editorial de ofertas/transferencias:** contradice la política de
    eventos.
15. **Samplear la elección explícita del usuario:** contradice autoridad y
    replay.
16. **Recrear proposal al resume:** rompe idempotencia.
17. **Auto-transfer/auto-registration:** cierra DR-065/066 por inferencia.

## Consecuencias

### Positivas

- las cinco decisiones asignadas tienen familia, ecuación y sampler;
- valuation, fee y salary permanecen separados y explicables;
- el mercado puede sobre/subvalorar mediante conocimiento imperfecto;
- múltiples intereses/ofertas emergen sin caps;
- Money es exacto;
- negotiation y checkpoints tienen consumo RNG finito;
- renewals/loans preservan historia contractual;
- Market no accede a score ni estado verdadero.

### Costes y restricciones

- todos los coefficients/sigmas/scales requieren calibración;
- DR-027 debe publicar currency/range/conversion policy;
- DR-065/066/067 siguen bloqueando rutas aplicables;
- el panel de referencia y terms permitidos requieren data/policy;
- el rango entero técnico puede producir un error de representación, nunca un
  outcome saturado;
- implementación oficial exige goldens y evidencia Monte Carlo.

## Impacto en Design Board y DR

- G3B-G01, G02, G03, G04 y G07 pasan a `PARTIAL_CALIBRATION`.
- DR-058 pasa a `PARTIAL_CALIBRATION`.
- DR-027 sigue parcialmente resuelta.
- DR-065, DR-066 y DR-067 permanecen abiertas.
- DR-008 continúa por G3C-8–G3C-11, valores y calibración integrada.

## Gates y tests

1. mismo contexto/seed/parameters produce outputs exactos;
2. agregar candidato no desplaza streams;
3. interest puede existir sin offer;
4. offer puede fallar en seller, negotiation o player;
5. free transfer produce fee cero sin draw;
6. Money rechaza overflow y monedas incomparables;
7. MarketValue/fee/salary nunca son aliases;
8. ContractExpectation no altera role/minutes;
9. loan conserva holding/sporting clubs;
10. renewal crea successor;
11. user choice consume cero RNG;
12. resume conserva proposal byte-equivalent;
13. Market no usa CareerScore;
14. no hay caps/thresholds;
15. goldens y Monte Carlo aprobados.

## Referencias

- [Especificación matemática](../TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
- [Especificación estructural](../TRANSFER_MARKET_CONTRACT_SPEC.md)
- [Contrato matemático](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [ADR-058](./058-transfer-market-contract-model.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [ADR-075](./075-club-competition-world-mathematics.md)
- [DR-027](../DECISIONS_REQUIRED.md#dr-027--valor-de-mercado-y-monedas)
- [DR-058](../DECISIONS_REQUIRED.md#dr-058--interés-ofertas-transferencias-y-valor-de-mercado)
- [DR-065](../DECISIONS_REQUIRED.md#dr-065--scope-competitivo-pools-externos-y-continuidad-fuera-del-tier)
- [DR-066](../DECISIONS_REQUIRED.md#dr-066--elegibilidad-e-inscripción-después-de-movimientos)
- [DR-067](../DECISIONS_REQUIRED.md#dr-067--cadencia-de-mercado-y-movimientos-entre-qs)
