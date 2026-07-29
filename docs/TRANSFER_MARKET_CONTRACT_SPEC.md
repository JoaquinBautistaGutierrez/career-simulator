# Especificación de transferencias, mercado y contratos

## 1. Estado, alcance y autoridad

**Estado:** Normativa estructural para G3B — Bloque 7; matemática ejecutable,
calendario de mercado, elegibilidad y calibración pendientes  
**Fecha:** 2026-07-28  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-003 a ADR-007, ADR-013 a ADR-015,
ADR-022, ADR-043, ADR-052, ADR-054, ADR-055, ADR-057 y
[ADR-058](adr/058-transfer-market-contract-model.md)  
**Decisiones relacionadas:** DR-008, DR-021, DR-022, DR-027, DR-048, DR-049,
DR-058 a DR-060, DR-063, DR-065 a DR-068

Este documento cierra la estructura causal de Transfers, Market & Contracts. No
elige:

- fórmulas de valoración, interés, oferta, negociación o preferencias;
- distribuciones, coeficientes, escalas de percepción o parámetros de balance;
- tasas de cambio, calibración monetaria o targets económicos;
- calendario definitivo de ventanas de mercado;
- reglas de inscripción por competición;
- continuidad deportiva fuera del tier detallado;
- implementación de schemas finales de facts de gameplay.

Los nombres de facts nacieron como candidatos semánticos. G3B Bloque 10 los
reconcilia con `SCORING_FACTS_SPEC.md`. Nada de este documento autoriza
implementación de gameplay mientras los DR matemáticos aplicables sigan
pendientes.

## 2. Principios normativos

1. Interés, oferta, negociación, decisión, movimiento y contrato son conceptos
   diferentes.
2. `MarketValue`, `TransferFee` y `Salary` no son aliases ni se igualan mediante
   una identidad.
3. El mercado consume conocimiento y evidencia observables; no lee
   `TruePlayerState`, traits ocultos ni potencial verdadero.
4. `ClubNeed` pertenece al contexto Club/World; Market lo consume y no simula
   una plantilla completa.
5. Interés deportivo y viabilidad financiera se resuelven por rutas separadas.
6. Una oferta no garantiza acuerdo entre clubes, acuerdo con el jugador,
   inscripción ni movimiento completado.
7. El contrato es una entidad con identidad estable y no asigna minutos.
8. Una promesa contractual no es `SquadStatus`, `SportingRole` ni
   `EffectiveUsage`.
9. Toda cantidad monetaria se representa de forma exacta; no usa floating
   point.
10. Un préstamo conserva por separado club contractual y club deportivo.
11. Un cambio de club no reatribuye estadísticas ni contexto de una Q cerrada.
12. No existen thresholds rígidos de edad/calidad, cupos de transferencias,
    cooldowns ni máximos editoriales.
13. Solo una restricción legal o lógica confirmada puede impedir completar un
    movimiento en un contexto concreto.
14. Replay, reintentos y reanudación no duplican interés, oferta, contrato,
    préstamo ni transferencia.
15. Transfers no crea `ScoreLedgerEntry`; MarketValue, fee y salary no otorgan
    CareerScore por sí mismos.

## 3. Pipeline causal

El pipeline canónico conceptual es:

```text
MarketPerception
-> ClubNeed
-> TransferInterest
-> TransferOffer
-> TransferNegotiation
-> PlayerDecision, cuando corresponda
-> TransferOutcome
-> ContractState / PlayerClubAffiliation
```

Cada etapa consume un resultado confirmado de la anterior. Una etapa puede
terminar sin producir la siguiente:

- puede haber cero, uno o múltiples intereses;
- un interés puede no convertirse en oferta;
- una oferta puede retirarse o caducar;
- una negociación puede fracasar por el club vendedor, el comprador o el
  jugador;
- un acuerdo entre clubes puede no conseguir acuerdo contractual;
- una aceptación del jugador puede no satisfacer el acuerdo entre clubes;
- un acuerdo completo puede esperar una oportunidad legal futura;
- completar un movimiento no implica elegibilidad instantánea en todas las
  competiciones.

No existe una operación monolítica `tryTransfer()` que oculte estas fronteras.
Cada transición conserva sus causas y referencias.

## 4. Percepción de mercado y evidencia

### 4.1 `MarketPerception`

`MarketPerception` es una vista contextual mantenida para un observador
autorizado. Debe poder identificar:

- jugador;
- observador —por ejemplo, club o agente del mundo—;
- punto de simulación reproducible;
- referencias de `PlayerKnowledge` utilizadas;
- percepción de calidad actual;
- percepción de trayectorias/potencial;
- percepción de riesgo y disponibilidad comunicada;
- resumen de evidencia deportiva;
- incertidumbre/confianza;
- contexto de liga, región y mercado;
- estimación de valor asociada cuando corresponda.

Dos clubes pueden mantener percepciones diferentes y simultáneamente válidas
del mismo jugador. Una actualización de percepción no modifica
`TruePlayerState`.

No existe una percepción global omnisciente. Una vista pública de valor, si se
ofrece, debe declarar qué modelo/observador de referencia la produjo y su
versión.

### 4.2 Evidencia desde Performance

Market puede consumir:

- `PerformanceSummary` y/o `SeasonPerformanceSummary` cerrados;
- producción observada;
- `actualMinutes` y otros volúmenes de exposición;
- splits por Q, club, competición y posición;
- contexto competitivo y de presión;
- fuerza de evidencia e incertidumbre;
- trayectoria histórica ya consolidada.

La producción extrema no se censura. Su peso como evidencia puede diferir entre
una muestra escasa y varias temporadas de alta exposición. El mercado no
recalcula Performance ni vuelve a sortear si el jugador “rindió bien”.

### 4.3 Datos que Market no puede leer

Por defecto Market no accede directamente a:

- capabilities verdaderas;
- `EffectiveCapabilities`;
- `UnderlyingPerformance` oculto;
- traits latentes, incluidos `naturalTalent`, `developmentCapacity`,
  `injuryFragility` o `longevity`;
- una cifra verdadera de potencial;
- estados médicos no comunicables.

Un dato solo puede entrar si existe una proyección de conocimiento autorizada y
versionada. La UI tampoco convierte un preset de dificultad en conocimiento
mecánico distinto.

## 5. `ClubNeed`, escasez y encaje

### 5.1 Ownership

Club/World es owner de `ClubNeed`, `PositionScarcity` y del contexto económico
de mercado. Transfers los consume; no los genera para justificar una oferta.

### 5.2 `ClubNeed`

Por club, ventana y contexto, el field agregado debe poder expresar al menos:

- posición o conjunto compatible de posiciones;
- urgencia;
- perfil deseado;
- necesidad de calidad/contexto;
- preferencia etaria probabilística;
- `PositionCompetition`;
- expectativa de oportunidad;
- contexto táctico;
- contexto financiero;
- horizonte de la necesidad;
- identidad/versionado de la causa.

No representa un futbolista competidor concreto ni una vacante garantizada.
Puede coexistir más de una necesidad y ninguna obliga al club a interesarse u
ofertar.

### 5.3 `PositionScarcity`

`PositionScarcity` es un field agregado por mercado, región, posición y período.
Puede modular necesidad, valoración y competencia entre compradores sin
simular la población completa. No convierte una posición en garantía de oferta
ni bloquea por definición las restantes.

### 5.4 `PlayerClubFit`

`PlayerClubFit` es una derivación contextual entre:

- perfil/capabilities percibidos;
- `primaryPosition`, posiciones compatibles y uso histórico;
- `TacticalIdentity`;
- `ClubNeed`;
- fuerza deportiva y proyecto del club;
- `PositionCompetition`;
- expectativa de oportunidad;
- adaptación/contexto autorizado.

No es capability, trait ni estado permanente. Un club deportivo más fuerte
puede tener peor fit. El contrato de fit es compartible por Market y por una
futura política de recomendación, pero sus finalidades deben evitar doble
conteo.

## 6. Interés y campo de candidatos

### 6.1 `ClubCandidateField`

El campo de candidatos se construye desde identidades de club autorizadas,
`ClubState`, `ClubNeed`, league/world context y scope de datos vigente. Puede
usar una jerarquía liga→club→necesidad o una representación equivalente, pero
debe:

- conservar identidad real cuando el club se nombra;
- admitir clubes detallados y futuros participantes autorizados por DR-065;
- explicar por qué un club fue candidato;
- excluir solo imposibilidades lógicas o contenido deshabilitado;
- no imponer un número máximo editorial de candidatos, intereses u ofertas;
- usar orden y streams deterministas.

La familia estadística y los parámetros siguen abiertos.

### 6.2 `TransferInterest`

`TransferInterest` es una entidad o estado causal identificado, separado de
`TransferOffer`. Contiene conceptualmente:

- `interestId`;
- jugador;
- club interesado;
- `marketWindowContextId`;
- necesidad/fit que lo originó;
- tipos de operación contemplados;
- percepción/evidencia referenciada;
- estado del interés;
- punto de creación y expiración lógica;
- claves de causalidad e idempotencia.

Su probabilidad puede depender de calidad y potencial percibidos, evidencia
reciente, edad, posición, necesidad, fit, liga, reputaciones, contrato, contexto
de nacionalidad/pasaporte autorizado, finanzas, mercado y azar. Ningún factor
usa un threshold rígido. La función, composición, correlaciones y streams quedan
en DR-008/058.

## 7. Viabilidad financiera

El interés deportivo y la viabilidad financiera son evaluaciones diferentes.
El contexto del club puede aportar:

- `financialPower`;
- `transferBudgetContext`;
- `salaryBudgetContext`;
- estabilidad y estrategia;
- restricciones económicas confirmadas;
- contexto regional y de mercado.

No se implementa contabilidad completa. Estos inputs no garantizan oferta ni
éxito; tampoco se sustituyen por prestigio o fuerza deportiva.

`FinancialFeasibilityAssessment` debe poder distinguir:

- fee viable/no viable o grado de viabilidad;
- compensación contractual viable/no viable;
- combinación de términos viable/no viable;
- incertidumbre o shocks económicos;
- causa y snapshot utilizados.

La evaluación no cambia retroactivamente el `financialPower` de entrada. Los
efectos económicos futuros, si se modelan, pertenecen a World/Club update.

## 8. Dinero y magnitudes económicas

### 8.1 `Money`

Toda magnitud monetaria mecánica utiliza:

```text
Money {
  amountMinor: exact non-negative integer
  currencyCode: CurrencyCode
}
```

Reglas:

- `amountMinor` representa unidades monetarias menores y nunca floating point;
- la representación serializada debe ser un entero JSON exacto dentro del
  rango interoperable aprobado por schema;
- valores fuera del rango exacto se rechazan, no se redondean ni saturan;
- `currencyCode` pertenece a un catálogo versionado;
- la cantidad de unidades menores por unidad visible pertenece al catálogo de
  moneda, no a lógica dispersa;
- no se suman, ordenan ni comparan monedas diferentes sin un contexto de
  conversión versionado;
- no existe moneda global implícita;
- formato, símbolo, abreviación y conversión visible pertenecen a read models.

Esta decisión resuelve la representación exacta, no la moneda de referencia,
fuente, tipo de cambio, calibración o presentación de DR-027.

### 8.2 Tres conceptos independientes

| Concepto | Semántica | Restricción |
|---|---|---|
| `MarketValueEstimate` | Estimación monetaria percibida por un observador/modelo y momento. | No es verdad objetiva ni oferta. |
| `TransferFee` | Precio concreto acordado para una operación. | Puede ser cero; no se deriva por igualdad de MarketValue. |
| `SalaryTerms` | Compensación base del contrato y su base temporal explícita. | No es fee ni MarketValue. |

`MarketValueEstimate` conserva:

- `Money`;
- observador/modelo;
- punto de valoración;
- evidencia;
- incertidumbre/confianza;
- `valuationModelVersion`;
- contexto económico.

`SalaryTerms` conserva `Money` y una base temporal de dominio. El vertical slice
debe admitir una base por temporada contractual; bases adicionales requieren
schema/versionado. No se infiere una frecuencia mensual o diaria.

Bonificaciones, incentivos y cláusulas económicas no se fusionan con salary.
Solo se incorporan mediante términos tipados cuando un caso aprobado los
requiera.

## 9. `Contract`

### 9.1 Identidad y núcleo

`Contract` es una entidad independiente con identidad estable:

```text
Contract {
  contractId
  playerId
  clubId
  period
  salaryTerms
  contractExpectation
  clauseRefs[]
  status
  predecessorContractId?
  successorContractId?
  agreedFromOfferId?
  createdAtCursor
  effectiveAtBoundary
}
```

La lista es semántica, no un schema final. `period` usa tiempo de dominio
ordenable, compatible con `seasonId` y límites de `SimulationCursor`; no exige
fechas diarias. DR-021 y DR-067 deben cerrar la representación temporal exacta.

`clauseRefs` es una colección tipada y versionada. No admite JSON arbitrario.
El núcleo no requiere cláusulas avanzadas ni opción de compra en G3B Bloque 7.

Representante, interés de terceros y relación con dirigencia son estados
relacionados, no campos que pierdan su ownership dentro de `Contract`.

### 9.2 `ContractExpectation`

El antiguo `Contract.role` se reemplaza por:

```text
ContractExpectation =
  DEVELOPMENT
  | SQUAD
  | IMPORTANT
  | MARQUEE
```

Representa una expectativa/promesa contractual compacta. No es:

- `SquadStatus`;
- `SportingRole`;
- `EffectiveUsage`;
- un porcentaje de minutos;
- una garantía de titularidad;
- una capability o reputación.

Una expectativa puede influir probabilísticamente en aceptación, renovación,
`managerTrust`, morale, relaciones o evaluación de incumplimiento mediante sus
sistemas propietarios. No escribe esos estados directamente y nunca asigna
minutos.

Los valores se nombran de forma distinta de `PROSPECT` y `STAR` para evitar
aliases accidentales con las taxonomías institucional y deportiva.

### 9.3 Ciclo de vida contractual

El modelo debe distinguir como mínimo:

| Estado | Semántica |
|---|---|
| `PENDING_START` | Contrato acordado cuya frontera de vigencia aún no llegó. |
| `ACTIVE` | Contrato vigente. |
| `EXPIRING` | Contrato todavía vigente dentro del horizonte versionado de vencimiento. |
| `EXPIRED` | La vigencia terminó sin continuación que lo sustituya. |
| `SUPERSEDED` | Un contrato sucesor, incluida renovación, reemplazó este acuerdo. |
| `TERMINATED` | Finalizó antes del límite previsto mediante causa válida. |

`EXPIRED` es la finalización normal del período; no se añade un alias
`COMPLETED` con la misma semántica. `SUPERSEDED` registra el estado del contrato
anterior cuando fue renovado; el hecho `ContractRenewed` enlaza el sucesor.

`EXPIRING` no significa salida garantizada. Un acuerdo sucesor puede entrar en
vigor en el mismo límite causal, sin período de agente libre.

Una renovación:

1. produce una `RenewalOffer`;
2. sigue la separación oferta→negociación→acuerdo;
3. crea un nuevo `contractId`;
4. enlaza predecesor y sucesor;
5. lleva el contrato anterior a `SUPERSEDED` en la frontera efectiva;
6. conserva ambos contratos para auditoría.

No se reescribe en sitio un contrato histórico como si siempre hubiera tenido
los términos renovados.

### 9.4 Incompatibilidades

Un jugador no puede tener simultáneamente contratos incompatibles. La
compatibilidad de contratos futuros, préstamos y vigencias se valida antes de
aplicar efectos. Una operación contractual se confirma toda o ninguna.

El cierre exacto de compatibilidades legales por competición o jurisdicción no
se inventa aquí.

## 10. Ofertas

### 10.1 `TransferOffer`

Una oferta firme debe congelar al menos:

- `offerId`;
- `interestId` o causa equivalente;
- jugador;
- comprador;
- vendedor cuando corresponde;
- tipo de operación;
- propuesta de fee cuando corresponde;
- propuesta contractual completa;
- propuesta de préstamo cuando corresponde;
- `marketWindowContextId`;
- punto de creación y validez;
- referencias de percepción, necesidad y viabilidad;
- estado;
- idempotency/causal key.

Los términos se generan una sola vez. Abrir, mostrar o reanudar la decisión no
los vuelve a sortear.

### 10.2 Relación interés→oferta

Un interés puede no producir oferta por estrategia, viabilidad, vendedor,
preferencia del jugador, contexto o azar. La función y distribución permanecen
externalizadas.

Una oferta rara o desproporcionada conserva probabilidad positiva, pero debe
referenciar el contexto institucional/narrativo que modificó su oportunidad;
no aparece como excepción sin causa ni se bloquea por un rango editorial.

No existe un cap de ofertas por temporada. Si varios clubes producen ofertas
válidas, se conservan identidades independientes y el usuario puede recibir una
decisión comparativa cuando la política lo requiera.

### 10.3 Fee y contrato

La propuesta de fee pertenece al acuerdo entre clubes. La propuesta contractual
pertenece al acuerdo club-jugador. Pueden existir en el mismo payload sin
convertirse en una sola aprobación.

- transferencia permanente con contrato activo: normalmente requiere fee y
  ambos acuerdos;
- préstamo: puede contener términos entre clubes y propuesta/consentimiento del
  jugador;
- free transfer: no tiene club vendedor y `TransferFee` es exactamente cero;
- renovación: no es un movimiento entre clubes y no tiene fee.

## 11. `TransferNegotiation`

### 11.1 Entidad

```text
TransferNegotiation {
  negotiationId
  offerId
  playerId
  buyerClubId
  sellerClubId?
  clubAgreement
  playerAgreement
  currentFeeProposal?
  currentContractProposal
  currentLoanProposal?
  status
  causalReferences[]
  pendingDecisionId?
  resumeCursor?
}
```

### 11.2 Acuerdos separados

`clubAgreement` y `playerAgreement` poseen estado propio. Un modelo equivalente
debe distinguir al menos:

```text
ClubAgreementState =
  NOT_REQUIRED | PENDING | AGREED | REJECTED | WITHDRAWN

PlayerAgreementState =
  PENDING | AGREED | REJECTED | WITHDRAWN
```

La negociación agregada puede estar:

```text
OPEN | WAITING_DECISION | AGREED | FAILED | WITHDRAWN | EXPIRED
```

Una operación solo queda `AGREED` cuando todos los acuerdos materialmente
requeridos están confirmados. `TransferOutcome=COMPLETED` exige además una
frontera legal de ejecución y validación atómica.

Con contrato activo, el vendedor puede aceptar, rechazar o proponer términos
alternativos conforme al modelo futuro. El jugador no mueve unilateralmente el
contrato. La aceptación del jugador tampoco obliga a comprador/vendedor.

### 11.3 Resolución agregada

No se simulan rondas ilimitadas. Cada operación de negociación:

- consume una propuesta confirmada;
- produce un nuevo estado o un resultado terminal;
- usa una `operationKey` estable;
- no vuelve a consumir tiradas anteriores;
- puede crear como máximo una decisión pendiente activa por Career, conforme a
  ADR-013;
- no usa un número máximo editorial de rondas como cooldown encubierto.

El catálogo de acciones permitidas puede incluir aceptar, rechazar, presentar
términos alternativos, retirarse o esperar cuando exista una oportunidad
posterior válida. La política cuantitativa y los tipos de contraoferta siguen
pendientes.

## 12. Decisión del jugador y `WAITING_DECISION`

Una elección mecánicamente significativa se materializa como
`PendingDecision`. Puede contener:

- permanecer;
- aceptar una oferta;
- rechazar;
- negociar, cuando la operación lo soporte;
- elegir entre ofertas;
- aceptar/rechazar renovación;
- aceptar/rechazar préstamo.

Las opciones, propuestas y consecuencias conocidas quedan congeladas en el
checkpoint. Al resolver:

1. se valida Career, revisión, cursor e idempotency key;
2. se valida que la opción pertenecía al checkpoint;
3. se aplican efectos atómicamente;
4. se registra `DecisionRecord`;
5. se reanuda desde el punto posterior exacto;
6. no se repiten percepciones, intereses, términos ni acuerdos ya confirmados.

Preferencias simuladas no anulan una elección explícita válida del usuario. Una
política futura de automatización se versiona por separado conforme a ADR-020.

## 13. Preferencias del jugador

`PlayerTransferPreferenceContext` es una proyección para IA, narrativa,
recomendación o automatización futura. Puede consumir:

- `ambition`;
- prestigio y proyecto deportivo;
- liga, región y adaptación;
- salary;
- expectativa contractual;
- oportunidad esperada;
- `SportingRole` y morale actuales;
- relaciones;
- contexto personal autorizado.

No es una capability única ni un mandato determinista. No puede leer traits
ocultos para una finalidad que el modelo de conocimiento no autorice.

Los pesos, interacciones, conocimiento del jugador y relación con elecciones
explícitas quedan parametrizados y versionados.

## 14. Tipos de operación y afiliación

### 14.1 Tipos mínimos

La arquitectura soporta:

```text
PERMANENT_TRANSFER
LOAN
FREE_TRANSFER
```

Renovación y terminación son operaciones contractuales, no subtipos de
transferencia. `LOAN_RETURN` es el cierre de un `LoanAgreement`. “Regreso a un
club anterior” y “oferta de rival” son contextos/tags sobre una operación, no
tipos mecánicos diferentes.

Cláusulas de compra, obligación de compra y otras variantes pueden añadirse con
schema/versionado posterior; no pertenecen al núcleo inicial.

### 14.2 `PlayerClubAffiliation`

El estado del jugador distingue:

```text
PlayerClubAffiliation {
  affiliationStatus: ATTACHED | UNATTACHED
  contractHoldingClubId?
  currentSportingClubId?
  activeContractId?
  activeLoanAgreementId?
  effectiveFromBoundary
}
```

`UNATTACHED` expresa que el jugador no posee club deportivo vigente en el
boundary. Puede coexistir con `PlayerPlayingStatus.ACTIVE`; no equivale a
retiro, no crea contrato y no garantiza una oferta. La representación exacta y
sus facts permanecen en DR-058/063.

- en una transferencia permanente normalmente ambos clubes coinciden;
- en un préstamo, `contractHoldingClubId` conserva el club de origen y
  `currentSportingClubId` identifica el club donde compite;
- como agente libre, no existe contrato activo ni club contractual;
- una afiliación futura no reescribe temporadas o Q anteriores.

### 14.3 `LoanAgreement`

Un préstamo posee identidad estable y conserva:

- `loanAgreementId`;
- jugador;
- contrato principal;
- club contractual;
- club deportivo temporal;
- período agregado;
- términos tipados mínimos;
- estado;
- referencias a oferta/negociación/transferencia;
- boundary de inicio y retorno.

El contrato de origen no se sobrescribe. Al cerrar el préstamo, el club
deportivo vuelve al club contractual solo si ningún movimiento válido posterior
determinó otra afiliación.

### 14.4 Aplicación atómica

Un movimiento completado confirma conjuntamente:

- resultado de negociación;
- cierre/supersesión contractual que corresponda;
- creación/activación de contrato o préstamo;
- afiliación contractual y deportiva;
- contexto efectivo futuro;
- referencias históricas;
- facts de resultado.

Si alguna invariante falla, no se aplica ninguna parte.

## 15. Transfer fee, salary, vencimiento y renovación

### 15.1 `TransferFee`

El fee puede depender de valoración, contrato restante, leverage del vendedor,
necesidad del comprador, competencia entre compradores, voluntad del jugador,
finanzas, mercado y azar. No se fija fórmula.

Invariantes:

- es `Money`;
- puede ser exactamente cero;
- un free transfer usa cero;
- no se fuerza igual a MarketValue;
- no se suma a salary;
- su presentación no altera el acuerdo persistido.

### 15.2 `Salary`

Salary se resuelve de forma separada. Puede depender de percepción deportiva,
valor, reputaciones, finanzas, expectativa contractual, competencia por la
firma, liga y mundo.

No se infiere mediante un porcentaje fijo de fee o MarketValue. La base
temporal es explícita y el monto exacto no usa floating point.

### 15.3 Vencimiento y leverage

El tiempo contractual restante puede modificar probabilísticamente:

- leverage del vendedor;
- presión sobre fee;
- posibilidad de renovación;
- posibilidad de free transfer;
- leverage del jugador.

No existe descuento fijo hardcoded. `EXPIRING` no garantiza oferta, salida o
renovación.

### 15.4 `RenewalOffer`

Una renovación puede consumir Performance, valor, edad, contexto, relación,
finanzas, estrategia y necesidad futura. No está garantizada por rol ni
impedida por suplencia.

La renovación sigue el mismo principio de percepción→oferta→negociación→acuerdo
contractual, pero no cambia de club y no produce `TransferCompleted`.

## 16. Tiempo, ventanas de mercado y cursor

### 16.1 `MarketWindowContext`

Calendar/Competitions produce un contexto de oportunidad legal con:

- `marketWindowContextId`;
- `seasonId`;
- límite de inicio y cierre en tiempo de dominio;
- jurisdicción/scope;
- tipos de operación admitidos;
- clubes/mercados aplicables;
- referencias de reglas;
- boundary de efectividad;
- versión.

No representa fechas diarias. Que una ventana no permita una operación es una
imposibilidad legal/contextual, no un cooldown editorial.

DR-021 debe cerrar calendario, `SeasonId`, reglas futuras y granularidad. Market
no inventa ventanas.

### 16.2 Cadencia post-season vigente

ADR-013/043 sitúan:

```text
COMPETITIONS
-> COMPETITION_EVENTS
-> MARKET
-> MARKET_EVENTS
-> AWARDS
```

Dentro de ese plan, una decisión puede interrumpir en una operación atómica de
`MARKET` o `MARKET_EVENTS`, fijar `resumeCursor` y continuar sin repetir
tiradas.

### 16.3 Movimiento entre Qs

El dominio debe soportar que una afiliación cambie entre Qs:

- Q cerradas conservan club, liga, contrato y contexto originales;
- Q futuras usan la afiliación efectiva desde el boundary;
- los summaries de temporada agregan segmentos sin reatribución;
- el movimiento no modifica minutos, producción ni logros ya confirmados.

El plan vigente no contiene una operación Market entre Qs. Elegir si:

1. se añaden ventanas Market entre Qs;
2. una negociación se resuelve en otra fase pero su efecto se agenda para el
   próximo boundary legal;
3. el vertical slice limita movimientos a la fase post-season;

requiere DR-067, posible enmienda de ADR-013/043 y `engineVersion`. Este
documento no selecciona la alternativa.

## 17. Segmentación estadística y elegibilidad

### 17.1 Temporada multiclub

`SeasonPerformanceSummary` y la historia deben conservar segmentos por:

- `seasonId`;
- Q;
- `currentSportingClubId`;
- contrato/préstamo causal cuando sea relevante;
- competición;
- posición efectiva;
- minutos y producción.

La agregación:

- suma cada output una sola vez;
- conserva el desglose de clubes;
- no asigna todo al club de cierre de temporada;
- permite consumidores con reglas de scope diferentes;
- no vuelve a sortear Performance.

### 17.2 `RegistrationEligibility`

Afiliación deportiva y elegibilidad competitiva son estados separados.
`TransferCompleted` no concede por sí solo elegibilidad universal.

Un futuro `RegistrationEligibility` debe poder identificar:

- jugador y club deportivo;
- competición/temporada;
- boundary de vigencia;
- estado y razón;
- fuente/regla versionada;
- relación con transferencia, préstamo o inscripción excepcional.

DR-066 debe decidir ownership, reglas del vertical slice y relación con
calendario/CompetitionState. Hasta entonces no se inventan restricciones
cup-tied, listas, plazos ni excepciones.

## 18. Continuidad fuera del tier detallado

Si el club del jugador sale del tier detallado:

- `clubId`, contrato, préstamo, afiliación e historial persisten;
- no se dispara transferencia, rescisión o retiro automático;
- Market puede conservar interfaces de contrato y necesidad solo cuando el
  scope/pool provea inputs autorizados;
- no se simula Performance ni oportunidad fuera del tier por inferencia;
- un movimiento futuro requiere identidad y contexto válidos.

DR-065 debe cerrar representación del club externo, calendario, Performance,
Market y retorno a tier detallado. La estructura contractual no depende de que
el club permanezca detallado.

## 19. Ciclos de mercado y reputación

### 19.1 Contexto de World

World puede producir estados equivalentes a:

- `transferMarketHeat`;
- `wageEnvironment`;
- `regionalMoneyFlow`;
- `positionDemand`;
- shocks económicos;
- régimen/ciclo de mercado.

Transfers consume el snapshot vigente. No genera el ciclo para justificar un
resultado. Un shock compartido se sortea una vez y referencia sus efectos para
evitar doble conteo.

### 19.2 Reputaciones separadas

Market puede consumir `sportingReputation` y `publicReputation` como señales
diferentes. No reemplazan Performance ni una a la otra.

Debe ser posible:

- jugador excelente con fama pública baja;
- jugador muy famoso con evaluación deportiva inferior;
- fama regional con poco alcance global;
- alta percepción de riesgo pese a gran producción.

Reputation conserva ownership y decide sus propios estados en G3B-K. Transfers
solo consume snapshots/facts autorizados.

### 19.3 Edad

Edad modifica distribuciones, leverage y horizonte percibido. No existe edad
que fuerce MarketValue a cero o vuelva lógicamente imposible todo interés. Un
veterano excepcional puede recibir una operación con probabilidad positiva si
el estado la permite.

## 20. Interfaces

### 20.1 Entradas

| Origen | Inputs | Restricciones |
|---|---|---|
| Player/Knowledge | Perfil percibido, potencial percibido, edad, posición y datos visibles autorizados. | No latentes verdaderos. |
| Performance | Resúmenes, producción, exposición, contexto, presión, evidencia e incertidumbre. | No recalcula rendimiento. |
| Club/World | `ClubNeed`, fuerza, competencia, táctica, prestigio, finanzas, escasez y ciclos. | No garantiza interés/oferta. |
| Reputation | Sporting/public reputation por scope. | No sustituye evidencia deportiva. |
| Calendar/Competitions | `MarketWindowContext` y futura elegibilidad. | No se inventan fechas o reglas. |
| Contract/Affiliation | Vigencia, leverage, club contractual/deportivo y restricciones. | No se identifica con rol realizado. |
| Events | Causas tipadas autorizadas, por ejemplo oferta excepcional. | No ejecuta código ni crea score. |

### 20.2 Salidas hacia Role & Minutes

Después de un movimiento efectivo, Role & Minutes recibe:

- nuevo `currentSportingClubId`;
- nuevo snapshot de `ClubState`/manager/táctica;
- `PositionCompetition`;
- `ContractExpectation` como señal contractual separada;
- `RegistrationEligibility` cuando exista;
- boundary causal.

`ContractExpectation` no se convierte directamente en `SportingRole`,
`expectedMinutes` o `actualMinutes`.

### 20.3 Salidas hacia Performance

Performance recibe segmentos y contexto del club deportivo efectivo. No recibe
fee/salary como capacidad ni reabre producción previa.

### 20.4 Salidas hacia Development y Health

Un cambio efectivo puede cambiar development/medical context futuro. No
reescribe deltas, lesiones o recuperaciones ya confirmados.

### 20.5 Salidas hacia Selection y Awards

Selection puede consumir club, liga, competición, contexto efectivo y segmentos
de Performance confirmados; no usa `MarketValue`, fee o salary como mérito y
una transferencia no garantiza convocatoria. La afiliación de club no modifica
por sí sola `NationalTeamEligibility`: nacionalidad deportiva y sus
transiciones pertenecen a DR-068.

Awards consume cada segmento con su club/competición/posición y período
históricos. Un movimiento no reatribuye Performance previa, no altera un
outcome cerrado y no asigna premios. `MarketValue`, fee, salary y prestigio del
movimiento no sustituyen evidencia deportiva.

### 20.6 Salidas hacia Reputation/Social

Reputation puede consumir facts autorizados de movimiento, club, prestigio,
fee público o fracaso. Una cifra privada no se filtra sin una proyección
autorizada. El movimiento produce facts; Reputation/Social decide
`PublicAttentionSignal`, reputación y audience mediante sus evidence keys. No
se impone `followersDelta`.

### 20.7 Salidas hacia Retirement

Retirement puede consumir afiliación `ATTACHED`/`UNATTACHED`, vigencia de
contrato, oportunidades de Market y resultados cerrados. Market no calcula
motivation/hazard y estar `UNATTACHED` no fuerza retiro. Un comeback no restaura
contrato, afiliación o RegistrationEligibility.

### 20.8 Salidas hacia World

World puede consumir efectos financieros/de membresía confirmados si su modelo
los aprueba. Transfers no muta directamente fuerza, prestigio o ciclos mediante
un bonus implícito.

### 20.9 Frontera con Scoring

- Transfers no depende de `packages/scoring`;
- MarketValue, fee y salary no crean score;
- un fact de transferencia solo será scoring input si DR-010/063 lo allowlist;
- Content no puede emitir una entrada de score ni una “transferencia” falsa para
  puntuar.

## 21. Identidad, idempotencia y auditoría

### 21.1 Identidades causales

Como mínimo existen identidades independientes para:

- `marketPerceptionId` o snapshot key;
- `clubNeedId`;
- `interestId`;
- `offerId`;
- `negotiationId`;
- `contractId`;
- `transferId`;
- `loanAgreementId`;
- `marketWindowContextId`;
- `decisionId`;
- futura `registrationEligibilityId`.

No se derivan de UUID aleatorio, reloj del sistema o orden incidental. Se
construyen desde contexto canónico estable o secuencia autoritativa
determinista.

### 21.2 Referencias

La cadena auditable debe permitir:

```text
evidence/knowledge
-> club need / perception
-> interest
-> offer
-> negotiation
-> agreements / decision
-> transfer outcome
-> contract / loan / affiliation
-> future club context
```

Un resultado terminal conserva el motivo aunque no haya movimiento.

### 21.3 Atomicidad e idempotencia

- la misma `operationKey` no crea dos intereses;
- la misma oferta no inicia dos negociaciones activas incompatibles;
- una decisión resuelta no se aplica otra vez;
- un `TransferCompleted` no crea dos contratos o afiliaciones;
- `LoanEnded` no restaura dos veces;
- `ContractRenewed` no sobrescribe ni duplica el sucesor;
- reintentar devuelve el resultado confirmado o rechaza antes de mutar;
- hashes y orden canónico siguen ADR-007.

## 22. Outputs semánticos

| Candidato | Semántica |
|---|---|
| `MarketValuationUpdated` | Nueva estimación identificada por observador, modelo, evidencia y contexto. |
| `ClubNeedGenerated` | Necesidad agregada confirmada para una ventana. |
| `TransferInterestGenerated` | Interés identificado; no implica oferta. |
| `TransferOfferCreated` | Propuesta firme y congelada. |
| `TransferOfferWithdrawn` | Oferta retirada con causa. |
| `RenewalOffered` | Propuesta de continuidad contractual. |
| `NegotiationStarted` | Proceso agregado identificado. |
| `NegotiationUpdated` | Cambio de propuesta/acuerdos sin outcome final. |
| `NegotiationFailed` | Resultado terminal sin movimiento. |
| `PlayerTransferDecisionRequested` | Interrupción mecánica con opciones congeladas. |
| `ContractAgreed` | Acuerdo contractual validado; puede estar pendiente de vigencia. |
| `ContractRenewed` | Sucesor contractual enlazado al predecesor. |
| `ContractExpired` | Fin de vigencia sin sobrescribir historia. |
| `ContractTerminated` | Cierre anticipado por causa válida. |
| `TransferCompleted` | Movimiento permanente confirmado atómicamente. |
| `LoanStarted` | Afiliación deportiva temporal iniciada. |
| `LoanEnded` | Préstamo cerrado y afiliación posterior confirmada. |
| `FreeTransferCompleted` | Movimiento sin vendedor y fee cero. |

`TransferOutcomeRecorded` puede actuar como envelope común si DR-063 evita
duplicar los facts específicos. `MarketPerception`, assessments y propuestas
intermedias pueden ser snapshots/trazas en lugar de domain facts. La
clasificación final se declara en `SCORING_FACTS_SPEC.md`.

**Cierre G3B Bloque 10:** los candidatos terminales/interaccionales de la tabla
son facts salvo `MarketValuationUpdated` y `ClubNeedGenerated`, que son
summaries. `PlayerTransferDecisionRequested` reutiliza
`DecisionRequested.decisionKind`. `FreeTransferCompleted` es una vista de
`TransferCompleted.movementType = FREE_TRANSFER` y no se emite como alias.
Ningún fact financiero o de movimiento está allowlisted para score.

## 23. Invariantes

1. `MarketValue`, `TransferFee` y `SalaryTerms` son conceptos distintos.
2. `Money.amountMinor` es entero exacto y no negativo.
3. No hay comparación implícita entre monedas diferentes.
4. `TransferFee=0` es válido y obligatorio en free transfer.
5. Interés no implica oferta; oferta no implica negociación exitosa.
6. Acuerdo entre clubes y acuerdo del jugador son independientes.
7. Solo una validación completa produce movimiento.
8. `ContractExpectation` nunca asigna rol o minutos.
9. Un contrato renovado conserva predecesor y sucesor con IDs diferentes.
10. No existen contratos activos incompatibles.
11. Un préstamo conserva club contractual y club deportivo por separado.
12. Una Q cerrada conserva el club y contexto con que se resolvió.
13. Los summaries multiclub no duplican producción.
14. Transferencia no implica elegibilidad universal.
15. La edad no fuerza valor cero ni ausencia total de interés.
16. No existen caps, cuotas ni cooldowns de transferencias/ofertas.
17. Ninguna identidad de mercado usa azar externo o reloj real.
18. Replay/reanudación no repiten términos ni movimientos.
19. Transfers no escribe ScoreLedger.
20. Club fuera del tier conserva identidad, contrato e historia sin
    auto-transfer.
21. `UNATTACHED` puede coexistir con actividad y no implica retiro.
22. Comeback no restaura afiliación, contrato o elegibilidad.

## 24. Parameter Registry Candidates

### Percepción y valoración

- modelo de actualización de `MarketPerception`;
- ponderación de evidencia y exposición;
- incertidumbre por observador;
- peso de potencial percibido;
- percepción de riesgo;
- función/familia de `MarketValueEstimate`;
- sensibilidad a edad, posición, demanda, contrato y contexto;
- persistencia, reversión y shocks de valoración;
- precisión/cuantización.

### Need, fit e interés

- generación/evolución de `ClubNeed`;
- urgencia y horizonte;
- perfiles deseados;
- `PositionScarcity`;
- función de `PlayerClubFit`;
- generación de `ClubCandidateField`;
- intensidad/probabilidad de interés;
- multiplicidad y correlaciones entre clubes;
- influencia de reputaciones;
- contextos/namespaces de streams.

### Oferta y viabilidad

- propensión interés→oferta;
- `FinancialFeasibilityAssessment`;
- transfer/salary budget context;
- distribución de términos;
- contract leverage;
- seller/buyer leverage;
- competencia entre compradores;
- fee model y dispersión;
- salary model y dispersión;
- renewal model.

### Negociación y preferencias

- transiciones probabilísticas de negociación;
- varianza y tipos de contraoferta;
- pesos de preferencias del jugador;
- influencia de `ContractExpectation`;
- willingness de comprador/vendedor/jugador;
- retirada/caducidad;
- política de automatización futura.

### Operaciones y mercado mundial

- loan propensity;
- duración contractual y de préstamo;
- market cycles;
- transfer market heat;
- wage environment;
- regional money flow;
- position demand;
- currency catalog y unidades menores;
- conversión monetaria y fuentes cuando se aprueben;
- calendar/window parameters de DR-021/067;
- registration parameters de DR-066;
- external-tier market parameters de DR-065.

### Validación

- golden fixtures;
- targets/tolerancias Monte Carlo;
- tasas por edad/posición/liga/club;
- distribución de fees, salary y valuations;
- tasas de interés→oferta→acuerdo→movimiento;
- tasas de renovación, free transfer y loan;
- carreras multiclub y continuity fixtures.

No se asigna ningún valor en este bloque.

## 25. Resolución del Design Board

| ID | Estado de Bloque 7 | Cierre estructural | Pendiente |
|---|---|---|---|
| G3B-G01 | Parcial | `ClubCandidateField` consume identidades, `ClubNeed`, fit, estado y mundo sin plantilla/cap. | Familia de generación, distribución, scope DR-065 y parámetros. |
| G3B-G02 | Parcial | `TransferInterest` es entidad separada, probabilística, múltiple y basada en percepción/evidencia. | Fórmula, correlación, precisión, streams y calibración. |
| G3B-G03 | Parcial | Oferta firme congelada separa fee, contrato, préstamo y viabilidad. | Función interés→oferta y distribución cuantitativa de términos. |
| G3B-G04 | Parcial | `TransferNegotiation`, acuerdos separados, `PendingDecision`, atomicidad e idempotencia quedan definidos. | Matemática y ubicación de movimientos entre Qs en DR-067. |
| G3B-G05 | Resuelta estructuralmente | Permanente, loan y free transfer; afiliación dual; cambio atómico; historia multiclub. | Elegibilidad DR-066, continuidad DR-065 y parámetros. |
| G3B-G06 | Resuelta estructuralmente | Entidad `Contract`, lifecycle, renovación por sucesor y `ContractExpectation` propio. | Schema temporal final DR-021/067 y balance contractual. |
| G3B-G07 | Parcial | MarketValue es estimación monetaria observer-specific y queda separado de fee/salary; `Money` es exacto. | Fórmula, moneda/conversión, calibración y presentación DR-027/058. |
| G3B-G08 | Calibración externalizada | Registry versionado obligatorio. | Todos los valores y targets. |

## 26. Decisiones todavía abiertas

### Dependencias DR-008 / DR-058

- funciones y distribuciones de percepción, valoración, interés, oferta,
  viabilidad, negociación, fee, salary, renewal y preferencias;
- correlaciones, orden de evaluación y composición probabilística;
- escalas, precisión, cuantización y redondeo;
- namespaces/contextos de streams;
- parámetros iniciales y fixtures;
- targets/tolerancias Monte Carlo.

### Dependencias DR-021 / DR-067

- `SeasonId` y time points contractuales definitivos;
- calendario de ventanas de mercado;
- ubicación de movimientos entre Qs en el cursor;
- validez/caducidad agregada de ofertas;
- política de efectividad post-season y mid-season.

### Dependencia DR-027

- catálogo/fuente monetaria;
- moneda de referencia por contexto;
- conversión y snapshot de rates;
- calibración;
- presentación y disclaimer final.

### Dependencias DR-063 / DR-066

- clasificación final facts/snapshots/trazas;
- payloads, identidad e idempotencia definitivos;
- owner y reglas de `RegistrationEligibility`;
- allowlist de scoring.

### Dependencia DR-065

- clubes/pools candidatos fuera del tier;
- inputs mínimos de mercado para club abstracto;
- oportunidad y Performance fuera del tier;
- continuidad y retorno.

### Dependencias DR-048 / DR-049

Una transferencia no cambia `primaryPosition`, `effectivePosition` ni posición
dominante por sí misma. Reconversión y cohortes mantienen sus DR pendientes.

## 27. Gates antes de implementar

1. schemas distinguen percepción, interés, oferta, negociación, outcome y
   contrato;
2. fixtures demuestran interés sin oferta y oferta sin movimiento;
3. Market no lee latentes verdaderos;
4. sparse/high exposure produce evidencia diferente sin censurar outliers;
5. `ClubNeed`/fit no materializa plantillas ni garantiza oferta;
6. Money es exacto y no mezcla monedas implícitamente;
7. MarketValue, fee y salary nunca se igualan por alias;
8. free transfer confirma fee cero;
9. acuerdos de clubes y jugador fallan independientemente;
10. reanudación no vuelve a sortear términos;
11. renovación crea sucesor y conserva el contrato anterior;
12. `ContractExpectation` no asigna `SportingRole` ni minutos;
13. loan conserva holding/sporting club e historial;
14. movement atomicity impide afiliación o contrato parcial;
15. temporada multiclub conserva splits sin duplicación;
16. DR-067 cierra el cursor para movimientos entre Qs;
17. DR-066 cierra elegibilidad del slice;
18. DR-065 cierra continuidad fuera del tier;
19. DR-063 aprueba facts e idempotencia;
20. parámetros, streams, precisión, golden fixtures y Monte Carlo están
    versionados y aprobados;
21. Transfers no escribe ScoreLedger ni crea dependencia engine→scoring.
