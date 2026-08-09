# ADR-058: Estructura de transferencias, mercado y contratos

- **Estado:** Aceptado — alcance estructural; matemática refinada por ADR-076
- **Fecha:** 2026-07-28
- **Decisión relacionada:** DR-058
- **Especificación normativa:**
  [`../TRANSFER_MARKET_CONTRACT_SPEC.md`](../TRANSFER_MARKET_CONTRACT_SPEC.md)
- **Aclara:** ADR-013, ADR-022, ADR-043, ADR-052, ADR-054 y ADR-055
- **Refinado por:**
  [ADR-076](./076-transfer-market-contract-mathematics.md)

## Contexto

La especificación original enumeraba ofertas, contratos y movimientos, pero no
separaba interés, oferta, acuerdos, decisión, transferencia y estado
contractual. `Contract.role` también quedó ambiguo después de distinguir
`SquadStatus`, `SportingRole` y `EffectiveUsage`.

Sin una frontera explícita, una implementación podía:

- convertir todo interés en oferta o toda oferta en transferencia;
- usar capacidades/potencial verdaderos como conocimiento omnisciente;
- igualar valor de mercado, fee y salario;
- usar floating point o una moneda global implícita;
- asignar minutos desde una promesa contractual;
- sobrescribir el club contractual durante un préstamo;
- duplicar operaciones al reanudar;
- reatribuir una temporada completa al club final;
- asumir elegibilidad inmediata en toda competición;
- crear score desde cantidades financieras.

Este ADR fijó la estructura sin inventar fórmulas. ADR-076 cerró posteriormente
familias, ecuaciones, samplers y streams; calendario, elegibilidad, valores y
calibración continúan pendientes.

## Decisión

### Pipeline separado

El flujo conceptual es:

```text
MarketPerception
-> ClubNeed
-> TransferInterest
-> TransferOffer
-> SellerResponse, cuando corresponda
-> ContractProposal
-> TransferNegotiation
-> PlayerDecision, cuando corresponda
-> TransferOutcome
-> ContractState / PlayerClubAffiliation
```

Cada etapa conserva identidad, causalidad y estado propios. Cero, uno o
múltiples intereses/ofertas son posibles; no hay caps editoriales.

### Percepción y evidencia

Market consume `PlayerKnowledge`, Performance cerrado, producción, exposición,
contexto y fuerza de evidencia. No lee capabilities verdaderas,
`EffectiveCapabilities`, `UnderlyingPerformance` oculto, traits latentes o un
potencial verdadero.

La percepción pertenece a un observador. Clubes diferentes pueden sobrevalorar
o subvalorar al mismo jugador.

### Need, fit y viabilidad

Club/World es owner de `ClubNeed`, `PositionScarcity` y contexto económico.
`PlayerClubFit` es una derivación contextual, no capability.

Interés deportivo y viabilidad financiera son rutas independientes.
`financialPower`, budgets agregados y shocks no garantizan oferta o acuerdo.

### Magnitudes monetarias

`MarketValueEstimate`, `TransferFee` y `SalaryTerms` son conceptos distintos.
Todos usan `Money` exacto con unidades monetarias menores enteras y
`currencyCode` versionado. No existe conversión ni moneda global implícita.

La persistencia usa enteros JSON dentro del rango exacto interoperable aprobado
por schema. Presentación, moneda de referencia, conversión y calibración
continúan en DR-027.

### Contrato y expectativa

`Contract` es una entidad con `contractId`, jugador, club, período, salary,
expectativa contractual, cláusulas tipadas, estado y referencias causales.

La taxonomía contractual es:

```text
DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE
```

Se denomina `ContractExpectation`; no es `SquadStatus`, `SportingRole` ni
`EffectiveUsage`, y no asigna minutos.

El ciclo mínimo distingue `PENDING_START`, `ACTIVE`, `EXPIRING`, `EXPIRED`,
`SUPERSEDED` y `TERMINATED`. Una renovación crea un contrato sucesor con nueva
identidad y conserva el predecesor.

### Oferta, acuerdos y decisión

Una oferta congela comprador, vendedor cuando corresponde, movimiento, fee,
ventana, validez y referencias. ADR-076 separa la posterior
`ContractProposal`/`LoanProposal`, generada una sola vez después de la respuesta
compatible del seller/holding club. Nada se vuelve a sortear al mostrar o
reanudar.

`TransferNegotiation` distingue acuerdo entre clubes de acuerdo con el jugador.
Una operación puede fallar después de cualquiera de los dos.

Una decisión mecánica obligatoria usa `PendingDecision`, checkpoint y
`resumeCursor` de ADR-013. La resolución es atómica e idempotente.

### Operaciones y afiliación

El núcleo soporta:

```text
PERMANENT_TRANSFER | LOAN | FREE_TRANSFER
```

Renovación y terminación son operaciones contractuales; `LOAN_RETURN` es el
cierre de un préstamo.

`PlayerClubAffiliation` separa `contractHoldingClubId` de
`currentSportingClubId`. Un `LoanAgreement` conserva contrato de origen, club
deportivo temporal, período e identidad.

### Tiempo, historia y elegibilidad

Contrato y movimiento usan boundaries de tiempo de dominio compatibles con
`seasonId`/cursor, sin calendario diario.

La historia se segmenta por Q, club, competición, posición y contrato/préstamo.
Un cambio no reatribuye ventanas cerradas.

Afiliación y `RegistrationEligibility` son estados distintos. DR-066 debe
cerrar las reglas de inscripción.

ADR-013/043 no contienen Market entre Qs. DR-067 debe decidir la ubicación
canónica de un movimiento mid-season antes de modificar el runner.

### Scoring

Transfers no crea `ScoreLedgerEntry`. Valor, fee y salary no puntúan por sí
mismos. Solo facts allowlisted por DR-010/063 pueden ser consumidos por scoring;
engine no depende de scoring.

## Alternativas rechazadas

1. **Interés→transferencia en una operación:** elimina fallos y acuerdos
   independientes.
2. **Omnisciencia del mercado:** contradice `PlayerKnowledge`.
3. **Thresholds rígidos de edad/calidad:** impiden resultados posibles.
4. **Valor=fee=salario:** confunde estimación, precio y compensación.
5. **Floating point monetario:** pierde exactitud.
6. **Moneda global implícita:** cierra DR-027 por inferencia.
7. **`Contract.role` como SportingRole:** convierte promesa en minutos.
8. **Renovación editando el contrato anterior:** destruye auditoría.
9. **Un único club en Player:** no representa préstamos.
10. **Un único club por temporada:** reatribuye historia.
11. **Transferencia=inscripción automática:** mezcla afiliación y reglas de
    competición.
12. **Auto-transfer al descender:** contradice ADR-022/DR-065.
13. **Máximo de ofertas/rondas como regla editorial:** introduce caps.
14. **Mercado creando score:** rompe la frontera engine/scoring.
15. **Parámetros provisionales hardcoded:** convierte balance pendiente en
    regla.

## Consecuencias

### Positivas

- se resuelve semánticamente el conflicto `Contract.role`;
- contratos, ofertas, negociaciones, loans y movimientos son auditables;
- percepción imperfecta no filtra estado verdadero;
- préstamos y temporadas multiclub no pierden historia;
- Money es exacto sin imponer moneda global;
- las interrupciones conservan términos y streams;
- Club, Performance, Reputation, Calendar y scoring mantienen ownership.

### Costes y restricciones

- DR-008/058 deben aprobar valores, expected goldens y calibración;
- DR-021/067 deben cerrar tiempo y cadencia mid-season;
- DR-027 debe cerrar fuente, conversión, calibración y presentación;
- DR-063/ADR-010 ya aprueban facts y semántica; faltan schemas concretos;
- DR-065 debe cerrar mercado/continuidad fuera del tier;
- DR-066 debe cerrar inscripción;
- no puede implementarse gameplay de mercado mientras esos gates aplicables
  sigan abiertos.

## Impacto en el Design Board

- G3B-G05 y G3B-G06 quedan resueltas estructuralmente.
- G3B-G01, G02, G03, G04 y G07 quedan estructuralmente restringidas; ADR-076
  las lleva a `PARTIAL_CALIBRATION`.
- G3B-G08 queda confirmada como calibración externalizada.
- DR-058 pasa a `PARTIAL_CALIBRATION`; no queda cerrada por values/policies.
- DR-027 queda parcialmente resuelta solo en representación exacta.
- DR-066 y DR-067 registran elegibilidad y cursor mid-season.

## Gates y tests requeridos

Antes de implementar:

1. schemas separados para cada etapa;
2. interés sin oferta y oferta sin transferencia;
3. mercado sin acceso a estado verdadero;
4. percepción distinta por observador;
5. evidencia sparse/high exposure diferenciada;
6. Money exacto y rechazo de overflow;
7. cero conversión implícita entre monedas;
8. MarketValue, fee y salary no son aliases;
9. free transfer con fee cero;
10. acuerdos de clubes/jugador independientes;
11. decisión/reanudación sin resorteo;
12. renovación con contrato sucesor;
13. expectativa contractual sin asignar minutos;
14. loan con holding/sporting club separados;
15. movimiento atómico e idempotente;
16. agregación multiclub sin duplicación;
17. elegibilidad separada;
18. continuidad sin auto-transfer;
19. facts/streams/precision/versiones aprobados;
20. cero ScoreLedger desde Transfers.
