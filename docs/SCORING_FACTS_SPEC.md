# Scoring, Domain Facts & Structural Closure Specification

## 1. Estado, alcance y autoridad

- **Estado:** estructura aceptada el 2026-07-28; matemática de scoring
  parcialmente pendiente.
- **Fase:** G3B, Bloque 10.
- **Decisiones relacionadas:** DR-009, DR-010, DR-015, DR-016, DR-017,
  DR-035, DR-036, DR-049, DR-060, DR-063 y DR-069.
- **ADR:** [ADR-010](adr/010-scoring-ledger-and-domain-facts.md).
- **Fuentes:** `MASTER_SPEC` v0.8, secciones 20.2, 34.3, 36.7 y 44;
  ADR-007, ADR-009, ADR-015, ADR-016, ADR-017, ADR-050 y ADR-051.

Este documento cierra la estructura de facts, reglas, ledger, idempotencia,
versionado y reconstrucción. No cierra las funciones, cohortes, catálogos o
parámetros que esta especificación marca expresamente como pendientes.

No autoriza gameplay, implementación de scoring ni modificación de packages.

## 2. Taxonomía canónica

Los cuatro conceptos siguientes no son aliases:

| Concepto | Semántica | Persistencia | Puede crear puntos |
|---|---|---|---|
| `InternalEngineSignal` | Valor, innovación o evaluación usada dentro de una resolución. No afirma por sí sola que haya ocurrido un resultado de dominio. | Traza diagnóstica o checkpoint solo cuando sea necesario; no entra al fact ledger. | No |
| `DomainFact` | Hecho confirmado, determinista, identificable y apto para replay, auditoría o consumidores posteriores. | Append-only en el fact ledger de Career. | Solo si su `factType` está allowlisted y una regla versionada lo selecciona |
| `NarrativeEvent` | `EventInstance` data-driven y su presentación. Puede reaccionar a facts o causar comandos/efectos validados, pero no sustituye un hecho deportivo. | Historial de contenido separado, ligado por referencias causales. | No por su mera ocurrencia |
| `ScoreLedgerEntry` | Resultado contable creado exclusivamente por Scoring desde facts allowlisted y reglas versionadas. | Append-only en un ledger separado por `scoringVersion`. | Es la representación auditable de los puntos, no un fact de gameplay |

El término histórico `domainEvent` del DSL describe la identidad mecánica de
un evento de contenido. No convierte automáticamente su `EventInstance` en un
`DomainFact` autorizado para scoring.

## 3. Contrato semántico de `DomainFact`

### 3.1 Envelope obligatorio

Todo fact persistido contiene conceptualmente:

```text
DomainFact
  factId
  factType
  factSchemaVersion
  careerId
  subjectRef
  operationKey
  sequence
  scope
    seasonId?
    window?
    phase
    contextType
    contextId?
  semanticKey
  causalFactIds[]
  payload
  payloadHash
  versionSet
```

Reglas:

1. `factType` pertenece al catálogo cerrado de esta especificación.
2. `subjectRef` identifica el agregado o entidad afectada sin usar texto
   narrativo.
3. `operationKey` identifica el punto exacto del plan de ejecución.
4. `sequence` es el ordinal canónico de Career, no un timestamp.
5. `scope` distingue club, selección, competición, temporada y Q sin inventar
   aliases de tipo.
6. `semanticKey` identifica la ocurrencia dentro de su familia, por ejemplo una
   edición, episodio, contrato, record o movimiento.
7. `causalFactIds` solo referencia facts anteriores y se ordena de forma
   canónica.
8. `payload` es tipado por `factType`; campos desconocidos o semánticamente no
   comprendidos impiden replay oficial conforme a ADR-015.
9. `payloadHash` usa JCS/RFC 8785 y SHA-256 conforme a ADR-007/051.
10. `versionSet` conserva las cinco versiones canónicas. Re-scoring puede usar
    otra `scoringVersion` sin mutar el fact original.

Un tiempo de ingestión o auditoría del servidor puede existir como metadata
externa. No participa en identidad causal, replay o resultados.

### 3.2 Identidad determinista

La identidad conceptual se deriva de:

```text
factIdMaterial =
  domainSeparator
  + careerId
  + operationKey
  + factType
  + semanticKey
  + localCanonicalOrdinal
```

La representación futura debe usar canonicalización JCS y SHA-256. La forma
serializada exacta pertenece al schema, pero debe cumplir:

- mismo replay y misma Career producen el mismo `factId`;
- `advance(1)` repetido y `advance(n)` producen los mismos IDs;
- no se usa reloj, `Math.random`, UUID aleatorio ni orden de consulta;
- facts distintos no comparten identidad aunque tengan payload parecido;
- una corrección es un nuevo fact causal, no edición del original;
- `scoringVersion` no forma parte del material de identidad de un fact de
  simulación, para permitir re-scoring sin reejecutar gameplay.

### 3.3 Orden y atomicidad

Dentro de una operación, los facts se ordenan por el plan canónico del
subsistema y un ordinal local. El lote se valida completo antes de aplicarse.
Persistir solo una parte de un lote atómico es inválido.

Un consumidor procesa cada `factId` como máximo una vez por propósito y
versión. La deduplicación no depende del orden incidental de objetos.

## 4. Catálogo único y clasificación

### 4.1 Significado de las clases

| Clase | Regla |
|---|---|
| `PERSISTED_DOMAIN_FACT` | Forma parte del fact ledger autoritativo. |
| `INTERNAL_SIGNAL` | Solo existe dentro de cálculo/traza; no tiene autoridad de ocurrencia. |
| `DERIVED_SUMMARY` | Proyección o snapshot reconstruible. Puede persistirse como cache/checkpoint, pero no se presenta como otra ocurrencia ni entra a scoring directamente. |
| `NARRATIVE_ONLY` | Pertenece a contenido/presentación y no al fact ledger mecánico. |

### 4.2 Lifecycle, decisiones y perfil

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `CareerStarted` | `PERSISTED_DOMAIN_FACT` | configuración aprobada, root seed ref, `VersionSet` | No |
| `SeasonStarted` | `PERSISTED_DOMAIN_FACT` | `seasonId`, contexto inicial y cursor | No |
| `SeasonWindowClosed` | `PERSISTED_DOMAIN_FACT` | `seasonId`, Q, outputs cerrados hash y siguiente cursor | No |
| `SeasonCompleted` | `PERSISTED_DOMAIN_FACT` | `seasonId`, cierre Q1–Q4, contexts y hash | PRL solo mediante una regla de milestone distinta |
| `DecisionRequested` | `PERSISTED_DOMAIN_FACT` | `decisionId`, `decisionKind`, opciones congeladas, resume cursor | No |
| `DecisionResolved` | `PERSISTED_DOMAIN_FACT` | `decisionId`, choice, efectos validados y resume cursor | No |
| `CareerAbandoned` | `PERSISTED_DOMAIN_FACT` | causa, estado previo y policy ref | No |
| `CareerInvalidated` | `PERSISTED_DOMAIN_FACT` | causa, evidencia, actor autorizado y estado previo | No |
| `CareerCompleted` | `PERSISTED_DOMAIN_FACT` | boundary terminal, cierre confirmado y referencias de consolidación | No; habilita finalización, no puntos |
| `DiscoveryConfirmed` | `PERSISTED_DOMAIN_FACT` | `discoveryId`, `EventInstance`/outcome y procedencia | No |
| `ScoringCorrectionAuthorized` | `PERSISTED_DOMAIN_FACT` | correction ID, actor/policy autorizante, motivo, entry/facts afectados y evidencia | No; puede autorizar una `REVERSAL`, nunca un posting |
| `CareerFinalizationRequested` | `INTERNAL_SIGNAL` | solicitud y precondiciones | No; su semántica final depende de DR-069 |

Los nombres especializados `PlayerTransferDecisionRequested`,
`RetirementDecisionRequested` y `ComebackDecisionRequested` son proyecciones
por `decisionKind`, no tipos paralelos.

### 4.3 Player, Development, Role & Minutes

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `PlayerCapabilitiesChanged` | `PERSISTED_DOMAIN_FACT` | deltas por capability, snapshots/hash previo y posterior, componentes causales, Q | No |
| `PlayerDynamicStateChanged` | `PERSISTED_DOMAIN_FACT` | `stateKind`, valor previo/posterior, Q y causas | No |
| `PrimaryPositionChanged` | `PERSISTED_DOMAIN_FACT` | posición previa/nueva, proceso de reconversión y vigencia | No |
| `SquadStatusChanged` | `PERSISTED_DOMAIN_FACT` | status previo/nuevo, club/contexto y vigencia | No |
| `SportingRoleAssigned` | `PERSISTED_DOMAIN_FACT` | rol previo/asignado, position/context y Q | No |
| `MinutesRecorded` | `PERSISTED_DOMAIN_FACT` | minutos enteros, oportunidad, availability, contexto, competición y uso por posición | Sí |
| `AppearanceSummaryRecorded` | `PERSISTED_DOMAIN_FACT` | appearances, starts, minutos y calendario/contexto | Sí |
| `WindowAvailabilityAssessed` | `DERIVED_SUMMARY` | componentes médicos/no médicos, share y oportunidad | No |
| `expectedMinutes` | `INTERNAL_SIGNAL` | expectativa, distribución y parámetros | No |
| `EffectivePositionUsed` | `DERIVED_SUMMARY` | proyección desde `MinutesRecorded.usageByPosition` | No como fact separado |

`DevelopmentApplied` y `PlayerDeveloped` migran a
`PlayerCapabilitiesChanged`. `FitnessUpdated`, `FatigueUpdated`, `FormUpdated`
y `ConfidenceUpdated` usan `PlayerDynamicStateChanged.stateKind`.

### 4.4 Performance y Health

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `ObservedProductionRecorded` | `PERSISTED_DOMAIN_FACT` | stats tipadas, enteros, exposición, posición y contexto | Sí |
| `PerformanceSummaryRecorded` | `PERSISTED_DOMAIN_FACT` | dimensiones cerradas de Q, presión, evidencia e incertidumbre | Sí, solo por reglas de grano Q |
| `SeasonPerformanceSummaryRecorded` | `PERSISTED_DOMAIN_FACT` | agregación Q, splits por club/competición/posición y evidencia | Sí |
| `InjuryOccurred` | `PERSISTED_DOMAIN_FACT` | episodio, family, severity, origin, onset Q y causas | No |
| `HealthConditionTransitioned` | `PERSISTED_DOMAIN_FACT` | episodio, estado previo/nuevo, transition kind, restricciones y Q | No |
| `RelapseOccurred` | `PERSISTED_DOMAIN_FACT` | nuevo episodio, episodio padre, carga/contexto y Q | No |
| `SequelaRecorded` | `PERSISTED_DOMAIN_FACT` | episodio causal, `NONE`/`TEMPORARY`/`PERSISTENT` y perfil | No |
| `EffectiveCapabilitiesResolved` | `INTERNAL_SIGNAL` | proyección contextual | No |
| `UnderlyingPerformanceRecorded` | `INTERNAL_SIGNAL` | realización multidimensional y shocks | No |
| `LoadRecorded` | `INTERNAL_SIGNAL` | carga e intensidad realizadas | No; puede quedar en traza/checkpoint |
| `MedicalAvailabilityCalculated` | `DERIVED_SUMMARY` | componente médico anterior a la agregación | No |
| `PressurePerformanceRecorded` | `DERIVED_SUMMARY` | vista de `pressureBreakdown` del summary | No se emite por defecto |

`StatsGenerated` y `StatisticRecorded` migran a
`ObservedProductionRecorded`. `InjuryProgressed`, `RecoveryUpdated`,
`ReturnToPlayReached` y `HealthConditionResolved` se expresan mediante
`HealthConditionTransitioned.transitionKind`; no coexisten como aliases de la
misma transición.

### 4.5 Club, Competitions & World

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `CompetitionFinished` | `PERSISTED_DOMAIN_FACT` | edition/scope, outcome, title/round/qualification, participants, eligibility y contribution refs | Sí |
| `ClubStateUpdated` | `PERSISTED_DOMAIN_FACT` | estado previo/posterior, season y causas | No |
| `LeagueStateUpdated` | `PERSISTED_DOMAIN_FACT` | estado/membresía previa y posterior, season y causas | No |
| `ManagerContextChanged` | `PERSISTED_DOMAIN_FACT` | context anterior/nuevo y cursor de vigencia | No |
| `PromotionOccurred` | `PERSISTED_DOMAIN_FACT` | club, tier origen/destino, competition edition | No directo |
| `RelegationOccurred` | `PERSISTED_DOMAIN_FACT` | club, tier origen/destino, competition edition | No directo |
| `WorldCycleUpdated` | `PERSISTED_DOMAIN_FACT` | scope, estado previo/posterior y shocks causales | No |
| `CompetitionContextPrepared` | `DERIVED_SUMMARY` | context pre-Q | No |
| `TeamMinutesOpportunityPrepared` | `DERIVED_SUMMARY` | oportunidad y splits | No |
| `PositionCompetitionPrepared` | `DERIVED_SUMMARY` | field por position/context | No |
| `PlayerCompetitiveContributionRecorded` | `DERIVED_SUMMARY` | proyección de contribución deportiva para outcome | No; no es `CC` |
| `CompetitionWon` | `DERIVED_SUMMARY` | vista de `CompetitionFinished` con outcome campeón | No como fact separado |
| `RoundReached` | `DERIVED_SUMMARY` | vista de fase desde `CompetitionFinished` | No como fact separado |
| `QualificationAchieved` | `DERIVED_SUMMARY` | vista de qualification desde `CompetitionFinished` | No como fact separado |

`leagueCompetitiveStrength` nunca sustituye IJL. Scoring consume el
`CompetitionFinished` canónico y la definición congelada de scoring.

### 4.6 Transfers, Market & Contracts

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `TransferInterestGenerated` | `PERSISTED_DOMAIN_FACT` | interest ID, club, scope, evidence refs y vigencia | No |
| `TransferOfferCreated` | `PERSISTED_DOMAIN_FACT` | offer ID, clubes, terms congelados y vigencia | No |
| `TransferOfferWithdrawn` | `PERSISTED_DOMAIN_FACT` | offer ID y causa | No |
| `RenewalOffered` | `PERSISTED_DOMAIN_FACT` | offer ID, contract ref y terms | No |
| `NegotiationStarted` | `PERSISTED_DOMAIN_FACT` | negotiation ID y proposal refs | No |
| `NegotiationUpdated` | `PERSISTED_DOMAIN_FACT` | negotiation ID y estado previo/posterior | No |
| `NegotiationFailed` | `PERSISTED_DOMAIN_FACT` | negotiation ID, outcome y causa | No |
| `ContractAgreed` | `PERSISTED_DOMAIN_FACT` | contract ID, partes, terms y vigencia | No |
| `ContractRenewed` | `PERSISTED_DOMAIN_FACT` | contract previo/sucesor y vigencia | No |
| `ContractExpired` | `PERSISTED_DOMAIN_FACT` | contract ID y boundary | No |
| `ContractTerminated` | `PERSISTED_DOMAIN_FACT` | contract ID, causa y boundary | No |
| `TransferCompleted` | `PERSISTED_DOMAIN_FACT` | movement ID/type, afiliaciones previa/posterior, fee y vigencia | No |
| `LoanStarted` | `PERSISTED_DOMAIN_FACT` | loan ID, afiliaciones, terms y vigencia | No |
| `LoanEnded` | `PERSISTED_DOMAIN_FACT` | loan ID, outcome y afiliación posterior | No |
| `MarketValuationUpdated` | `DERIVED_SUMMARY` | observer, estimate, uncertainty y evidence refs | No |
| `ClubNeedGenerated` | `DERIVED_SUMMARY` | club/position need y vigencia | No |

`FreeTransferCompleted` es una vista de
`TransferCompleted.movementType = FREE_TRANSFER`; no se emite como duplicado.
Dinero, fee, salario o valor de mercado nunca crean puntos.

### 4.7 National Team & Awards

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `NationalTeamCallUpIssued` | `PERSISTED_DOMAIN_FACT` | call-up ID, team, context y vigencia | No por convocatoria |
| `TournamentSquadSelected` | `PERSISTED_DOMAIN_FACT` | squad/competition edition y role context | No por inclusión |
| `InternationalRoleAssigned` | `PERSISTED_DOMAIN_FACT` | role, team, context y vigencia | No |
| `AwardNominated` | `PERSISTED_DOMAIN_FACT` | edition, award, nomination scope | No, salvo futura regla explícita |
| `AwardPlacementRecorded` | `PERSISTED_DOMAIN_FACT` | edition, award, placement no ganador | No, salvo futura regla explícita |
| `AwardWon` | `PERSISTED_DOMAIN_FACT` | award/edition, family, scope, position y evidence refs | Sí |
| `NationalTeamEligibilityEvaluated` | `INTERNAL_SIGNAL` | policy, biography inputs y logical result | No |
| `NationalTeamCandidateEvaluated` | `INTERNAL_SIGNAL` | signal, field y uncertainty | No |
| `AwardEligibilityEvaluated` | `INTERNAL_SIGNAL` | predicate result y evidence | No |
| `AwardCandidateEvaluated` | `INTERNAL_SIGNAL` | signal, field y judging context | No |
| `AwardEditionResolved` | `DERIVED_SUMMARY` | outcome ordinal completo de la edición | No como fact separado |
| `NationalTeamCompetitionAchievement` | `DERIVED_SUMMARY` | vista nacional de `CompetitionFinished` | No como fact separado |

Minutos, apariciones, producción, Performance y `CompetitionFinished` de
selección reutilizan los tipos genéricos con `contextType = NATIONAL_TEAM`.
`InternationalMinutesRecorded`, `InternationalPerformanceRecorded` y
`StatisticalAwardWon` no existen como aliases.

Un `AwardWon` puede mapear a `PPI` o `PSN` según la
`ScoringRuleDefinition`, pero nunca a ambas rutas para la misma evidence key.

### 4.8 Reputation, Social & Retirement

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `PublicAttentionGenerated` | `PERSISTED_DOMAIN_FACT` | source fact, causal signal, markets, intensity/context | No directo |
| `SportingReputationUpdated` | `PERSISTED_DOMAIN_FACT` | markets, estado previo/posterior y evidence keys | No directo |
| `PublicReputationUpdated` | `PERSISTED_DOMAIN_FACT` | markets, awareness/sentiment previo/posterior y causes | Candidato PBR |
| `FollowerCountUpdated` | `PERSISTED_DOMAIN_FACT` | total previo, delta entero, total posterior, market y cause | Candidato PBR |
| `EngagementUpdated` | `PERSISTED_DOMAIN_FACT` | estado previo/posterior, market y cause | Candidato PBR |
| `RetirementOccurred` | `PERSISTED_DOMAIN_FACT` | episode, cause, playing status previo/posterior y decision ref | No directo |
| `ComebackOccurred` | `PERSISTED_DOMAIN_FACT` | episode, retirement ref, playing status previo/posterior | No directo |
| `ReputationSignalAccepted` | `INTERNAL_SIGNAL` | evidence key y purpose | No |
| `RetirementHazardEvaluated` | `INTERNAL_SIGNAL` | causes, probability y stream refs | No |
| `ComebackOpportunityGenerated` | `INTERNAL_SIGNAL` | opportunity, context y stream refs | No por sí solo |
| `AudienceMilestoneReached` | `DERIVED_SUMMARY` | milestone y state refs | No automático |
| `RegionalReputationUpdated` | `DERIVED_SUMMARY` | vista de updates con breakdown regional | No alias |

`FollowersChanged` migra a `FollowerCountUpdated`; `PlayerRetired` migra a
`RetirementOccurred`. Un retiro, comeback, lesión, accidente o catástrofe no
genera puntos por ocurrir.

### 4.9 Records, achievements y contenido

| Nombre canónico | Clase | Payload semántico mínimo | Scoring |
|---|---|---|---|
| `RecordAchieved` | `PERSISTED_DOMAIN_FACT` | record definition, scope, value, previous mark/evidence y holder context | Sí, PRL |
| `CareerMilestoneAchieved` | `PERSISTED_DOMAIN_FACT` | milestone definition, scope y evidence refs | Sí, PRL |
| `HistoricAchievementConfirmed` | `PERSISTED_DOMAIN_FACT` | achievement definition, causal facts y eligibility proof | Sí, PBR |
| `NarrativeEventOccurred` | `NARRATIVE_ONLY` | `EventInstance`, definition/outcome y presentation refs | No |
| `NarrativePresentationRendered` | `NARRATIVE_ONLY` | locale, sensitivity y template refs | No |

`RecordAchieved`, `CareerMilestoneAchieved` y
`HistoricAchievementConfirmed` solo pueden ser emitidos por detectores
autoritativos contra definiciones versionadas y facts previos. El DSL de
contenido no puede emitir esos tipos, crear una regla ni asignar puntos.

## 5. Allowlist de scoring

Estar en la allowlist significa “puede ser input de una regla compatible”; no
significa que el fact otorgue puntos automáticamente.

| Categoría PC | Fact types permitidos | Uso |
|---|---|---|
| `PRI` | `MinutesRecorded`, `AppearanceSummaryRecorded`, `ObservedProductionRecorded`, `PerformanceSummaryRecorded`, `SeasonPerformanceSummaryRecorded` | Componentes de performance y factor por contexto, sin duplicar granularidades |
| `PTC_CLUB` | `CompetitionFinished` con context de club; facts de participación/performance anteriores para calcular CC | Logros colectivos de club |
| `PPI` | `AwardWon` mapeado a premio individual no exclusivo de selección | Premio y equivalencia |
| `PSN` | `CompetitionFinished` nacional; `AwardWon` exclusivo de selección; facts nacionales de participación/performance para CC | Logros y distinciones internacionales sin duplicación |
| `PRL` | `RecordAchieved`, `CareerMilestoneAchieved` | Records y longevidad |
| `PBR` | `PublicReputationUpdated`, `FollowerCountUpdated`, `EngagementUpdated`, `HistoricAchievementConfirmed` | Popularidad, redes y logros históricos bounded |

Reglas negativas:

- call-up, squad o rol sin participación no puntúan;
- MarketValue, fee, salary y transferencias no puntúan;
- Sporting Reputation no se usa como sustituto de rendimiento;
- `PublicAttentionGenerated` no se suma junto con sus updates sociales;
- injury/health/retirement/tragedy no puntúan por ocurrir;
- `NarrativeEventOccurred` y `DiscoveryConfirmed` no puntúan;
- un derived summary no entra si sus facts fuente ya son la unidad de scoring
  de la misma regla;
- Content no puede emitir un fact allowlisted.

## 6. `ScoringRuleDefinition`

Las reglas son declarativas, inmutables y propias de una `scoringVersion`:

```text
ScoringRuleDefinition
  ruleId
  scoringVersion
  category
  eligibleFactTypes[]
  producerPolicy
  scopePolicy
  eligibility
  calculationFamily
  valueRef / parameters
  contributionPolicy
  equivalenceGroup?
  stackingPolicy
  capGroup?
  roundingPolicy
  canonicalOrder
```

`calculationFamily` referencia una función implementada y auditada. La
configuración no ejecuta código arbitrario.

`producerPolicy` impide que un fact con origen no autoritativo use un tipo
allowlisted. `scopePolicy` declara la unidad de puntuación: temporada,
competition edition, award edition, record scope, milestone o período.

Content/Event DSL no puede:

- crear o modificar `ScoringRuleDefinition`;
- crear `ScoreLedgerEntry`;
- seleccionar `ruleId`;
- asignar base points, multiplier, cap o category;
- emitir `RecordAchieved`, `CareerMilestoneAchieved` o
  `HistoricAchievementConfirmed`.

## 7. `ScoreLedger`

### 7.1 Estructura

Cada ledger pertenece a una Career y una `scoringVersion`:

```text
ScoreLedger
  ledgerId
  careerId
  scoringVersion
  sourceFactSetHash
  scoringRuleSetHash
  entries[]
  categorySubtotals
  careerPoints
  headHash
```

`categorySubtotals`, `careerPoints` y `headHash` son resultados verificables,
no totales editables. Sus entradas son append-only y están ordenadas
canónicamente:

```text
ScoreLedgerEntry
  ledgerEntryId
  careerId
  scoringVersion
  entryKind            POSTING | REVERSAL
  category             PRI | PTC_CLUB | PPI | PSN | PRL | PBR
  ruleId
  scopeKey
  sourceFactIds[]
  idempotencyKey
  calculation
  finalPoints
  reversesEntryId?
  sequence
  previousHash
  entryHash
```

`calculation` conserva como mínimo:

- calculation family;
- valores de configuración;
- base points o componentes;
- CC cuando corresponda;
- equivalence/stacking decision;
- cap aplicado y saldo descartado, si existe;
- valor decimal previo al redondeo;
- modo/punto de redondeo;
- puntos enteros finales.

Una entrada `POSTING` conserva `finalPoints >= 0`. Una `REVERSAL` conserva el
importe absoluto no negativo y referencia una entrada anterior; su contribución
firmada se deriva de `entryKind`. Así se preserva la corrección append-only sin
introducir reglas deportivas de score negativo.

### 7.2 Idempotencia

La clave conceptual es:

```text
JCS + SHA-256 (
  scoringVersion,
  careerId,
  ruleId,
  category,
  scopeKey,
  canonicalSourceFactIds,
  applicationKind
)
```

`sourceFactIds` se deduplica y ordena de manera canónica. Reaplicar las mismas
reglas a los mismos facts bajo la misma versión produce las mismas entries,
orden, hashes y total.

Una `REVERSAL` usa una clave distinta derivada de:

```text
scoringVersion + reversedEntryId + correctionFactId + ruleId
```

`correctionFactId` referencia un `ScoringCorrectionAuthorized` anterior. Una
corrección no puede usar Content ni una orden del cliente como autoridad. La
suma de reversals sobre una entry no puede exceder sus puntos posteados.

Re-scoring bajo otra `scoringVersion` produce otro ledger. No edita ni
reinterpreta el histórico.

### 7.3 Hash y total

`entryHash` usa SHA-256 sobre la entrada canónica y `previousHash`. El total se
deriva de la suma firmada de las entradas, nunca de un campo editable:

```text
categorySubtotal =
  sum(POSTING.finalPoints)
  - sum(REVERSAL.finalPoints)

PC =
  PRI
  + PTC_CLUB
  + PPI
  + PSN
  + PRL
  + PBR
```

No existe multiplicador final de suerte, modo, velocidad o narrativa.

## 8. Contrato numérico y redondeo

### 8.1 Representación

- `finalPoints`, subtotales y PC son enteros exactos.
- La aritmética intermedia de scoring usa decimal exacto o racional
  determinista; no depende del comportamiento accidental de binary floating
  point.
- Los multiplicadores persistidos respetan la precisión declarada por la
  `scoringVersion`; `MASTER_SPEC` v0.8 establece cuatro decimales para
  multiplicadores de score.
- No se redondea un fact deportivo para adaptarlo al score.

### 8.2 Política única

La política normativa es `ROUND_HALF_UP` al entero en el boundary final de cada
regla/entry. Después, PC suma enteros y no vuelve a redondearse.

Si una fórmula publicada incluye `round[...]`, ese `round` usa
`ROUND_HALF_UP`. No se usan `floor`, bankers rounding o `Math.round` sin un
contrato equivalente probado.

El orden fino entre stacking, equivalence, CC y caps todavía debe declararse
por familia en DR-010. No puede variar accidentalmente entre implementaciones.

## 9. Categorías y valores normativos existentes

### 9.1 PRI

Cada temporada tiene un máximo de 1.000 puntos antes del factor competitivo:

| Componente | Rango |
|---|---:|
| Impacto/valoración relativa | `0..450` |
| Disponibilidad/minutos útiles | `0..120` |
| Producción específica de posición | `0..230` |
| Presión | `0..120` |
| Rol, liderazgo y regularidad | `0..80` |

```text
competitiveFactor = 0.25 + 0.75 * (IJL / 100)
```

IJL es entero `1..100` congelado por `dataVersion`/`scoringVersion`. No es
`leagueCompetitiveStrength`.

La transformación interna de cada componente, cohortes, percentiles y
ponderación multicontexto siguen pendientes.

### 9.2 PTC_CLUB

Liga principal:

```text
ROUND_HALF_UP[650 * (IJL / 100)^1.35]
```

Relaciones normativas ya existentes:

| Logro | Regla base |
|---|---|
| Copa nacional principal | 55 % del valor de liga |
| Copa de liga | 35 % del valor de liga |
| Supercopa nacional | 18 % del valor de liga |
| Segunda división | 45 % del equivalente de primera |
| Tercera o inferior | 20 % o menos; definición versionada pendiente |
| Regional/estadual | 8 % a 25 %; definición versionada pendiente |

Competiciones internacionales de club:

| Competición | Campeón |
|---|---:|
| Mundial de Clubes FIFA de ciclo largo | 2.600 |
| Copa Intercontinental FIFA anual | 1.500 |
| UEFA Champions League | 2.200 |
| CONMEBOL Libertadores | 2.100 |
| AFC Champions League Elite | 1.200 |
| CAF Champions League | 1.150 |
| Concacaf Champions Cup | 1.050 |
| OFC Champions League | 450 |
| UEFA Europa League | 1.000 |
| CONMEBOL Sudamericana | 950 |
| UEFA Conference League | 650 |
| Supercopa/recopa continental | 300–400; valor exacto por definición |

| Resultado | Porcentaje del campeón |
|---|---:|
| Campeón | 100 % |
| Subcampeón | 45 % |
| Semifinal | 20 % |
| Cuartos | 8 % |
| Fase anterior destacada | 0–4 %, solo por definición aprobada |

Los logros colectivos elegibles usan:

```text
playerPoints = baseAchievementPoints * CC
```

y se cierran con `ROUND_HALF_UP`. Elegibilidad, cambios de club, loans,
registro y participación parcial siguen en DR-066/067 y DR-010.

### 9.3 PSN

| Logro | Campeón |
|---|---:|
| Copa Mundial | 5.000 |
| Eurocopa / Copa América | 2.400 |
| AFCON / Copa Asiática / Gold Cup | 1.600 |
| OFC Nations | 800 |
| Nations League u homólogo | 700 |
| Finalissima u oficial intercontinental equivalente | 500 |
| Juegos Olímpicos | 500 |
| Juveniles | 150–350 por definición versionada |

Para el Mundial están definidos además subcampeón 50 % y semifinalista 25 %.
No se extrapolan porcentajes a torneos que no los definan.

PSN puede usar CC para logros colectivos. Convocatoria, squad o minutos sin
achievement no crean puntos por sí mismos. La separación exacta entre
performance internacional, achievement y premio exclusivo sigue pendiente.

### 9.4 PPI

| Premio | Puntos/regla |
|---|---:|
| Ballon d'Or | 1.800 |
| The Best | 1.400 |
| Mejor jugador continental del año | 900 |
| Golden Ball de World Cup | 900 |
| Yashin / mejor GK global equivalente | 700 |
| European Golden Shoe | 650 |
| World Cup Golden Boot | 700 |
| MVP continental de selección | 600 |
| Kopa / Golden Boy | 500 |
| League POTY | `ROUND_HALF_UP[350 * IJL / 100]` |
| Scorer/assist/GK league award | `ROUND_HALF_UP[220 * IJL / 100]` |
| Team of season | `ROUND_HALF_UP[100 * IJL / 100]` |
| Premio mensual o de partido | 0 |

`AwardScoringEquivalenceGroup` es data-driven. Para dos premios globales
equivalentes de la misma temporada:

- mayor valor: 100 %;
- segundo: 60 %.

La política para más de dos premios equivalentes, empates y orden exacto con
otros caps permanece pendiente. Awards conserva todos los hechos históricos;
Scoring solo ajusta sus entries.

### 9.5 CC

```text
0.00 <= CC <= 1.10
```

CC se calcula por competición/logro desde participación y rendimiento
confirmados. No es SportingRole ni un campo editable.

Se aplica a logros colectivos de `PTC_CLUB` y `PSN`. No se aplica por defecto a
`PRI`, `PPI`, `PRL` o `PBR`. El tramo `1.00..1.10` solo surge de performance
extraordinaria versionada.

Su fórmula, scope de evidencia, precisión previa al score y cohortes siguen
pendientes.

### 9.6 PRL y PBR

La nomenclatura canónica de `MASTER_SPEC` es:

```text
PRL = records + longevity
PBR = bounded popularity + social + historic events
```

Por tanto, “PRL/popularity” es una etiqueta legacy/ambigua y no se adopta.

Valores existentes de PRL:

| Concepto | Puntos |
|---|---:|
| Record de club | 100–600 |
| Record de liga/competición | 300–1.000 |
| Record mundial/selección | 500–1.500 |
| Carrera completa en un club | 500, con mínimos aún pendientes |
| 15 temporadas profesionales | 300 una vez |
| 20 temporadas profesionales | 700 total; reemplaza la de 15 |

PBR conserva dos subgrupos:

```text
popularityAndSocial <= 1000
rareAndHistoric <= 1000
PBR <= min(2000, 5% * priorSportingPoints)
```

`MASTER_SPEC` no define expresamente `priorSportingPoints`. El subtotal usado
por su primer desempate es una opción razonable:

```text
candidatePriorSportingPoints = PRI + PTC_CLUB + PPI + PSN
```

No se adopta esa igualdad por inferencia. DR-010 debe cerrar la base exacta
además de la transformación de reputación/followers/engagement, eligibility de
achievements históricos y cuantización del límite de 5 %. Los caps limitan
puntos, nunca facts, eventos, followers o estadísticas.

### 9.7 Etiquetas narrativas

| PC | Código de presentación |
|---|---|
| `0..4999` | `PROFESSIONAL` |
| `5000..14999` | `NOTABLE` |
| `15000..24999` | `INTERNATIONAL_ELITE` |
| `25000..39999` | `WORLD_CLASS` |
| `40000..54999` | `LEGEND` |
| `55000..69999` | `HISTORIC_LEGEND` |
| `70000+` | `MYTHICAL` |

Son read models de presentación. No modifican score, gameplay o elegibilidad.

## 10. Temporadas multicontexto

Los facts conservan su scope original:

- Q y season;
- club o national team;
- competition edition;
- league/IJL scoring context;
- effective position y minutos;
- contrato/loan/movement boundary.

No se reescriben estadísticas al club final ni se usa un IJL único por
temporada. Cada regla declara su unidad de agregación. La ponderación exacta de
PRI por exposición, el CC en cambios de club y la dominancia posicional siguen
pendientes en SC-10/SC-11, DR-049, DR-066 y DR-067.

## 11. Reconstrucción y re-scoring

Pipeline puro:

```text
closed DomainFact set
+ immutable scoring registry
+ scoringVersion
-> validate allowlist/provenance
-> select facts by canonical scope
-> apply rules in canonical order
-> equivalence/stacking/caps
-> ROUND_HALF_UP per entry
-> append-only ScoreLedger
-> category subtotals
-> PC
```

Scoring no usa RNG. Si una futura regla pretendiera usar azar, requiere una
decisión normativa y ADR antes de aceptarse.

Siempre que el fact set contenga los payloads de esta especificación, otra
`scoringVersion` puede calcular un ledger separado sin reejecutar gameplay.
Cambiar una regla, valor, equivalencia, cap, rounding point o resultado
competitivo exige bump de `scoringVersion`.

## 12. `ScoreSnapshot` y ranking

Un snapshot final contiene conceptualmente:

```text
ScoreSnapshot
  scoreSnapshotId
  careerId
  scoringVersion
  domainFactSetHash
  ledgerHeadHash
  categorySubtotals
  careerPoints
  leaderboardCompatibilityKey
  finalizationFactRef
  integrityStatus
```

`LeaderboardCompatibilityKey` debe incluir como mínimo `scoringVersion`.
Igualdad de `scoringVersion` es necesaria, pero no se declara suficiente:
DR-036 debe decidir presets, automatización, Creation Budget, engine/data y
otras dimensiones comparables. DR-035 sigue tratando tamaños de muestra,
percentiles y frecuencia pública.

Elegibilidad mínima:

| Estado | Ranking principal |
|---|---|
| `COMPLETED` + integridad válida + policy compatible | Potencialmente elegible |
| `ABANDONED` | No |
| `INVALIDATED` | No |
| `PlayerPlayingStatus.RETIRED` con Career abierta | No final |
| `CareerStatus.RETIRED` en consolidación | No hasta `COMPLETED` |

El primer retiro deportivo no congela PC. DR-069 debe fijar el boundary
irreversible, la atomicidad de scoring final y la referencia que llena
`finalizationFactRef`.

## 13. Estado de SC-01 a SC-13

| SC ID | Status | Decisión normativa | Matemática restante | Facts requeridos | Parámetros requeridos | Blocking DR |
|---|---|---|---|---|---|---|
| SC-01 | `RESOLVED` | PC suma los seis subtotales enteros; no hay multiplicador ni redondeo final adicional. | Ninguna propia; depende de cerrar categorías. | Entries posteadas/reversals | Ninguno propio | DR-010 por componentes |
| SC-02 | `PARTIAL` | CC es por logro, `[0,1.10]`, deriva de participación/performance y solo modula logros colectivos. | Fórmula, scope, cohortes, exceptional tail. | Minutes, appearances, performance, competition outcome | Pesos, transforms, precisión | DR-008, DR-010, DR-049 |
| SC-03 | `PARTIAL` | Fórmula de liga y porcentajes domésticos se conservan; outcome × CC. | Valores dentro de rangos, atribución y caps menores. | CompetitionFinished + participation facts | IJL catalog, competition definitions | DR-010, DR-066, DR-067 |
| SC-04 | `PARTIAL` | Tabla internacional y porcentajes de fase se conservan; outcome × CC. | Valores ranged/missing, stacking de fases y atribución. | CompetitionFinished + participation facts | CompetitionScoringDefinition | DR-010, DR-066, DR-067 |
| SC-05 | `PARTIAL` | Tabla nacional se conserva; PSN no duplica PPI/PRI y usa contexto nacional. | Componentes, resultados no definidos, CC y exclusividad. | National CompetitionFinished, AwardWon, performance facts | Mapping/CC/stacking | DR-010, DR-059, DR-068 |
| SC-06 | `PARTIAL` | Valores de premios y 100 %/60 % se conservan mediante grupos data-driven. | Más de dos equivalentes, empates, orden con caps. | AwardWon | Equivalence groups y stacking | DR-010, DR-049, DR-060 |
| SC-07 | `PARTIAL` | PRI usa componentes `450/120/230/120/80`, máximo 1000 pre-factor e IJL fijo. | Transforms, cohortes, percentiles, GK/CM/ST y multicontexto. | Minutes, production, performance summaries | Cohortes, weights, normalization | DR-008, DR-010, DR-049, DR-055 |
| SC-08 | `PARTIAL` | Records/milestones son facts distintos; 20 seasons reemplaza 15. | Catálogo, rangos exactos, mínimos one-club y record replacement. | RecordAchieved, CareerMilestoneAchieved | Record definitions y values | DR-010, DR-069 |
| SC-09 | `PARTIAL` | PRL/PBR quedan reconciliados; subcaps 1000/1000 y cap agregado `min(2000,5% del puntaje deportivo previo)`. | Base exacta del puntaje previo, popularity transform, historic eligibility y quantization del cap. | Public/social updates, HistoricAchievementConfirmed | Transforms, base y cap order | DR-010, DR-061 |
| SC-10 | `PARTIAL` | Cada fact conserva su contexto; no hay IJL único ni duplicación. | Ponderación por exposición y reglas de movimientos. | Scoped minutes/performance/outcomes | Exposure weighting | DR-010, DR-021, DR-066, DR-067 |
| SC-11 | `PARTIAL` | Scoring consumirá una única dominancia por scope, nunca posición inicial/final arbitraria. | Función, scopes, empates y cero minutos. | MinutesRecorded.usageByPosition | Dominance policy | DR-049 |
| SC-12 | `RESOLVED` | Decimal/racional exacto, `ROUND_HALF_UP` por entry, PC entero y reversals append-only. | Orden de caps pertenece a SC-03–09/M17. | Fact IDs y correction facts | Precisión declarada por rule | DR-010 por orden de familias |
| SC-13 | `RESOLVED` | Bandas fijas de `MASTER_SPEC`; son presentación derivada. | Solo futuras recalibraciones de presentación versionadas. | PC final | Narrative tier mapping | Ninguno para score |

Resultado: **3 `RESOLVED`; 10 `PARTIAL`**.

## 14. Parameter Registry Candidates

Nunca deben quedar dispersos o hardcoded:

- registry de IJL por `dataVersion`/`scoringVersion`;
- `CompetitionScoringDefinition`;
- `AwardScoringDefinition` y `AwardScoringEquivalenceGroup`;
- valores exactos dentro de rangos domésticos, juveniles, records y recopa;
- transforms de los cinco componentes de PRI;
- cohortes, percentiles, shrinkage y evidencia mínima;
- factor/ponderación de contextos internacionales;
- fórmula y precisión de CC;
- weighting multiclub/multileague/multiposition;
- catálogo y replacement policy de records/longevidad;
- popularity/social transform;
- achievements históricos elegibles;
- definición exacta de `priorSportingPoints`;
- cap groups, stacking y orden;
- parámetros de rounding point aunque el modo sea `ROUND_HALF_UP`;
- precisión decimal/racional y serialización;
- rule order y manifests/hashes;
- golden fixtures fact→entry, ledger y Career completa;
- targets Monte Carlo de distribución de PC y categorías.

No se registra namespace de RNG para scoring: el contrato actual no usa azar.

## 15. Decisiones y gates pendientes

La estructura permite diseñar schemas de `DomainFact`,
`ScoringRuleDefinition`, `ScoreLedgerEntry`, `ScoreLedger` y `ScoreSnapshot`.
No permite todavía implementar scoring real.

Bloqueos:

1. DR-010: fórmulas/parameters de SC-02 a SC-11 donde figuran `PARTIAL`,
   orden de caps y fixtures.
2. DR-049: posición dominante.
3. DR-055: métricas/cohortes ejecutables, especialmente GK.
4. DR-059/060: outcomes/fields ejecutables de selección y premios.
5. DR-061: matemática de reputación/social usada por PBR.
6. DR-066/067: eligibility y atribución tras movimientos.
7. DR-069: finalización, freeze, ranking y terminación.
8. DR-025/035/036: catálogos, muestras y compatibilidad competitiva.

DR-063 queda cerrada estructuralmente por este documento. Cualquier cambio al
catálogo, identidad, clasificación o allowlist requiere revisar
`schemaVersion`/`engineVersion` y, si altera puntos, `scoringVersion`.

## 16. Tests y evidencia requerida

- golden IDs de facts y estabilidad `advance(1)` vs `advance(n)`;
- rechazo de alias y fact type desconocido;
- causal refs anteriores, acíclicas y canónicas;
- un `EventInstance` no crea un fact allowlisted;
- mismo fact set + misma scoringVersion produce ledger byte-equivalent;
- otra scoringVersion no muta facts o ledger histórico;
- una idempotency key produce una sola entry;
- reversal no edita ni elimina la entry original;
- hash chain detecta alteración;
- suma de entries coincide exactamente con subtotales y PC;
- fixtures de cada valor normativo de `MASTER_SPEC`;
- `leagueCompetitiveStrength` no afecta IJL;
- multicontexto no duplica minutos, producción, award u outcome;
- dos premios equivalentes aplican 100 %/60 % en el fixture aprobado;
- 20 seasons reemplaza, no suma, el milestone de 15;
- PBR limita puntos y no la ocurrencia de facts/eventos;
- accidente, lesión, retiro y tragedia no generan puntos directos;
- Content, engine, UI y cliente no crean `ScoreLedgerEntry`;
- scoring no usa RNG;
- `COMPLETED`/integridad/versiones gobiernan elegibilidad;
- golden `ScoreSnapshot` incluye hashes, scoringVersion y compatibility key.
