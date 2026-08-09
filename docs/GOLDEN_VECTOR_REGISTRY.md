# Golden Vector Registry

## 1. Propósito

Este registro consolida todos los golden requirements de G3C. Describe qué
fixtures y outputs exactos deberán publicarse; G3D-1 no calcula outputs ni
implementa harnesses.

## 2. Contrato `GoldenVectorDefinition`

```text
GoldenVectorDefinition {
  goldenId
  subsystem
  purpose
  inputFixtureStatus
  parameterOrConfigurationIdentity
  requiredDraws[]
  expectedOutputStatus
  arithmeticProfile
  versionDependencies[]
  implementationOwner
  verificationClass
  publicationState
}
```

Estados normativos:

| Estado | Significado |
|---|---|
| `SPECIFIED` | Derivación, inputs requeridos y outputs esperados están descritos, pero no congelados. |
| `INPUTS_FROZEN` | Fixture, versions, params/config y draw keys están hasheados. |
| `EXPECTED_COMPUTED` | Expected outputs e intermediates exactos existen como artefacto. |
| `INDEPENDENTLY_VERIFIED` | Expected fue verificado por una vía independiente. |
| `PUBLISHED_V1` | Fixture/output/hash forma parte del bundle V1 inmutable. |

En G3D-1 todas las filas están `SPECIFIED`; `inputFixtureStatus=DESIGN_ONLY` y
`expectedOutputStatus=NOT_COMPUTED`.

## 3. Reglas comunes

Cada fixture publicado incluye:

- cinco versiones canónicas aplicables;
- `parameterSetId/hash` o `ScoringConfiguration` y
  `ScoringCalibrationData` hashes;
- Data/Content hashes cuando sus definitions/facts intervienen;
- inputs canonical JSON;
- `RandomDrawKey`, midpoint uniforms e índice/occurrence de cada draw, o
  declaración explícita `NO_RNG`;
- binary64 intermediates canonicalizados y estado quantized con
  `ROUND_HALF_EVEN`, o racionales exactos/`ROUND_HALF_UP` en Scoring;
- output y trace digest;
- expected draw consumption, incluidas ramas lógicamente determinadas.

No se acepta como independent verification ejecutar dos veces el mismo código.

## 4. Verification classes

| Clase | Requisito mínimo |
|---|---|
| `V1_CRITICAL` | Cálculo manual/reviewed worksheet o reference implementation independiente, más revisión de dos personas antes de publicar. |
| `V1_STANDARD` | Reference script independiente o segunda implementación y review. |
| `V1_STRUCTURAL` | Derivación por propiedad/trace y review; no necesita reimplementar una fórmula inexistente. |

Goldens de primitives, samplers, money, lifecycle terminal, ledger, hashes y
rounding son `V1_CRITICAL`.

## 5. Registry

Columnas abreviadas:

- **Identity**: `EPS` = `EngineParameterSet` candidate hash; `SC` = hashes de
  Scoring config/calibration; `DATA` = dataVersion/hash; todos están `TBD`.
- **Arithmetic**: `B64-H2E` = binary64 atómico + persistencia
  `ROUND_HALF_EVEN`; `RAT-HUP` = racional exacto + `ROUND_HALF_UP`.
- **Owner** es el módulo futuro responsable, no autorización de implementación.

### 5.1 Runtime matemático

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-MATH-NORMAL-001` | `StandardNormalInverseCdfV1` interior/tails/symmetry | engine math profile | known uniforms | B64 exact profile | schema, engine | probability | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-CATEGORICAL-001` | cumulative midpoint boundaries/order | engine math profile | known uniforms | B64 | schema, engine | probability | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-POISSON-001` | inverse-CDF including mean 0 | engine math profile | known uniforms/zero draw case | B64 + integer | schema, engine | probability | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-BINOMIAL-001` | inverse-CDF edges and deterministic n=0/p endpoints | engine math profile | known uniforms or none | B64 + integer | schema, engine | probability | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-NB2-001` | canonical NB2/Gamma-Poisson path and draw order | engine math profile | fixed normal/uniform sequence | B64 + integer | schema, engine | probability | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-QUANTIZE-001` | H2E positive/negative/half/-0 cases | engine math profile | none | B64-H2E | schema, engine | domain | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-HASH-001` | RFC-8785/SHA-256 permutation and semantic-byte cases | EPS fixture | none | canonical bytes | schema, engine | schemas/testkit | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MATH-STREAM-001` | context/occurrence isolation under unrelated additions | EPS fixture | fixed keyed draws | B64 | engine | probability/testkit | `V1_CRITICAL` | `SPECIFIED` |

### 5.2 Creation & Development

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-CRE-MATH-001` | safe logit endpoints stored 0/10000 and quantized return | EPS | none | B64-H2E | schema, engine | engine/player | `V1_CRITICAL` | `SPECIFIED` |
| `GV-DEV-EVOL-001` | maturation/acquired/wear/shared/specific terms → deltaZ → capability | EPS | family + capability Z | B64-H2E | schema, engine | engine/development | `V1_STANDARD` | `SPECIFIED` |
| `GV-DEV-SIGN-001` | young negative and veteran positive possible with fixed tails | EPS | chosen Z values | B64-H2E | engine | engine/development | `V1_STANDARD` | `SPECIFIED` |
| `GV-CRE-GEN-001` | latent draws/profile/position → exact 20 capabilities | EPS + DATA | all creation factors/residuals | B64-H2E | schema, engine, data | engine/player | `V1_STANDARD` | `SPECIFIED` |
| `GV-CRE-TRAIT-001` | correlated trait factors → exact 10 traits | EPS + DATA | all trait factors/residuals | B64-H2E | schema, engine, data | engine/player | `V1_STANDARD` | `SPECIFIED` |
| `GV-CRE-POWER-001` | fixed player → exact CreationPower and reference percentile | EPS + DATA | none | B64 | engine, data | engine/player | `V1_STANDARD` | `SPECIFIED` |
| `GV-CRE-CUSTOM-001` | conditional Custom fixture stays in competitive distribution | EPS + DATA | fixed conditional sampler draws | B64-H2E | engine, data | engine/player | `V1_STANDARD` | `SPECIFIED` |
| `GV-CRE-SUIT-001` | fixed capabilities → GK/CM/ST suitability | EPS | none | B64 | engine | domain/player | `V1_STANDARD` | `SPECIFIED` |
| `GV-DEV-RETRAIN-001` | opportunity/completion predictors and categorical outcome | EPS | fixed uniform(s) | B64 | engine | engine/development | `V1_STANDARD` | `SPECIFIED` |
| `GV-DEV-DOMPOS-001` | minute history, group aggregation and deterministic ties | engine structural | none | exact integer | schema, engine | domain/player | `V1_STRUCTURAL` | `SPECIFIED` |

### 5.3 Role & Minutes

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-ROLE-SOFTMAX-001` | fixed inputs → utilities/probabilities/categorical role | EPS | categorical uniform | B64 | engine | engine/roleMinutes | `V1_STANDARD` | `SPECIFIED` |
| `GV-ROLE-PERSIST-001` | previous role → exact transition-adjusted utilities | EPS | none | B64 | engine | engine/roleMinutes | `V1_STANDARD` | `SPECIFIED` |
| `GV-AVAIL-UNION-001` | overlapping medical/disciplinary/other intervals → exact share | DATA/structural | none | rational/integer intervals | schema, engine, data | domain/engine | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MIN-SHARE-001` | latent predictor + shared/specific Z → share and minutes | EPS + DATA | two Z | B64-H2E | engine, data | engine/roleMinutes | `V1_STANDARD` | `SPECIFIED` |
| `GV-MIN-ZERO-001` | zero availability → zero minutes and exact no-draw trace | EPS + DATA | none | integer | engine, data | engine/roleMinutes | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MIN-ALLOC-001` | competition opportunity apportionment preserves totals | EPS + DATA | fixed allocation draws if configured | B64-H2E | engine, data | engine/roleMinutes | `V1_STANDARD` | `SPECIFIED` |
| `GV-APP-START-001` | minutes/role/calendar → exact appearances/starts | EPS + DATA | count/start uniforms | B64 + integer | engine, data | engine/roleMinutes | `V1_STANDARD` | `SPECIFIED` |
| `GV-MIN-CONTEXT-001` | same player CLUB vs NATIONAL_TEAM uses distinct adapters/keys | EPS + DATA | fixed per-context draws | B64-H2E | engine, data | engine/roleMinutes | `V1_STRUCTURAL` | `SPECIFIED` |
| `GV-MIN-EXPECTED-001` | Logit-Normal analytic/GH10 expectation | EPS | none | B64 | engine | engine/roleMinutes | `V1_CRITICAL` | `SPECIFIED` |

### 5.4 Performance, Production & Form

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-PERF-TASK-001` | capabilities/dynamics/context → exact task logit/ability | EPS | none | B64 | engine | engine/performance | `V1_STANDARD` | `SPECIFIED` |
| `GV-PERF-FACTORS-001` | common/domain/specific Z → realized dimensions | EPS | known Z hierarchy | B64 | engine | engine/performance | `V1_STANDARD` | `SPECIFIED` |
| `GV-PERF-CONS-001` | same mean, distinct consistency → exact sigma transform | EPS | none | B64 | engine | engine/performance | `V1_STANDARD` | `SPECIFIED` |
| `GV-PERF-EVID-001` | fixed minutes → exact evidence and zero-minutes branch | EPS | none | B64 | engine | engine/performance | `V1_STANDARD` | `SPECIFIED` |
| `GV-ST-GOAL-001` | opportunity/chance/conversion/NB2 draws → goals | EPS + DATA | factor + NB2 sequence | B64 + integer | engine, data | engine/performance | `V1_CRITICAL` | `SPECIFIED` |
| `GV-ST-AST-001` | shared creative factor/NB2 draws → assists correlation trace | EPS + DATA | factor + NB2 sequence | B64 + integer | engine, data | engine/performance | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CM-IMPACT-001` | fixed tasks/context/factors → multidimensional CM output | EPS + DATA | known factors | B64 | engine, data | engine/performance | `V1_STANDARD` | `SPECIFIED` |
| `GV-GK-PROD-001` | environment → shots, saves, conceded, clean sheets | EPS + DATA | count/binomial draws | B64 + integer | engine, data | engine/performance | `V1_CRITICAL` | `SPECIFIED` |
| `GV-FORM-UPDATE-001` | prior form/surprise/Z → next latent/quantized form | EPS | form Z | B64-H2E | engine | engine/performance | `V1_STANDARD` | `SPECIFIED` |
| `GV-PERF-SUM-001` | fixed Q/multiclub records → exact summaries and totals | EPS + DATA | none | B64/rational + integer | schema, engine, data | engine/performance | `V1_CRITICAL` | `SPECIFIED` |

### 5.5 Health

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-HLT-LOAD-001` | minutes/intensity/context → realized/acute/chronic load | EPS + DATA | none | B64-H2E | engine, data | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-HLT-FAT-001` | prior fatigue/load/Z → next fatigue | EPS | fatigue Z | B64-H2E | engine | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-HLT-FIT-001` | prior fitness/preparation/load/injury/Z → next fitness | EPS | fitness Z | B64-H2E | engine | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-INJ-HAZARD-001` | state/exposure → every Hj/Htotal/probability | EPS + DATA | none | B64 | engine, data | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-INJ-COUNT-001` | fixed hazards/uniforms → count and family assignment; H=0 no RNG | EPS + DATA | Poisson + categoricals | B64 + integer | engine, data | engine/health | `V1_CRITICAL` | `SPECIFIED` |
| `GV-INJ-SEVERITY-001` | occurrence/context/Z → severity | EPS + DATA | severity Z | B64-H2E | engine, data | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-REC-REQ-001` | severity/traits/context/Z → requirement | EPS + DATA | recovery Z | B64 | engine, data | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-REC-PROGRESS-001` | active burden/recovery work/Z → next remaining burden | EPS | recovery-work Z | B64-H2E | engine | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-AVAIL-MED-001` | multiple episodes/progress → exact future medical intervals | EPS + DATA | none | interval exact + B64 | schema, engine, data | engine/health | `V1_CRITICAL` | `SPECIFIED` |
| `GV-RELAPSE-001` | episode/history/load → competing assignment and outcome | EPS + DATA | hazard occurrence/categorical | B64 | engine, data | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-SEQUELA-001` | resolved episode/draws → NONE/TEMP/PERSIST and burden | EPS + DATA | occurrence/type/burden draws | B64-H2E | engine, data | engine/health | `V1_STANDARD` | `SPECIFIED` |
| `GV-HLT-CADENCE-001` | injury resolved in Qn cannot rewrite Qn minutes/performance | EPS + DATA | fixed complete trace | exact state/facts | engine, data | engine/testkit | `V1_CRITICAL` | `SPECIFIED` |

### 5.6 Club, Competitions & World

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-CLUB-EVOL-001` | prior state/context/Z → attack/defense/control next | EPS + DATA | world/league/club Z | B64-H2E | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-CLUB-SLOW-001` | prestige/finance/stability exact updates | EPS + DATA | declared shocks | B64-H2E | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-MGR-TURN-001` | hazard/uniform → turnover/no turnover | EPS + DATA | fixed uniform or H=0 none | B64 | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-MGR-GEN-001` | conditioned latent draws → ManagerContext | EPS + DATA | factor/specific Z | B64-H2E | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-TACTIC-001` | latent factors → TacticalIdentity vector/TacticalFit | EPS + DATA | fixed Z | B64-H2E | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-PCOMP-001` | club/context/draws → competition strength/depth/entrenchment | EPS + DATA | factor/specific Z | B64-H2E | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-CALENDAR-001` | definitions/progression → Q match equivalents/opportunity | EPS + DATA | none | exact integer/H2E | engine, data | engine/competitions | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CONGEST-001` | exposure/calendar → congestion and Health adapters | EPS + DATA | none | B64-H2E | engine, data | engine/competitions | `V1_STANDARD` | `SPECIFIED` |
| `GV-CONTRIB-001` | Performance summary → player contribution/team utility delta | EPS + DATA | none | B64 | engine, data | engine/competitions | `V1_STANDARD` | `SPECIFIED` |
| `GV-LEAGUE-RANK-001` | utilities/Z → canonical ranking/champion | EPS + DATA | season/team Z | B64 + canonical sort | engine, data | engine/competitions | `V1_CRITICAL` | `SPECIFIED` |
| `GV-KNOCKOUT-001` | team/field/phase/uniform → advance/eliminate | EPS + DATA | fixed uniform | B64 | engine, data | engine/competitions | `V1_STANDARD` | `SPECIFIED` |
| `GV-WORLD-EVOL-001` | prior world/league/results/Z → next cycles/league strength | EPS + DATA | global/regional/league Z | B64-H2E | engine, data | engine/clubWorld | `V1_STANDARD` | `SPECIFIED` |
| `GV-MOBILITY-BOUNDARY-001` | relegation outcome emits request without inferred external move | EPS + DATA | none | exact facts | schema, engine, data | engine/competitions | `V1_STRUCTURAL` | `SPECIFIED` |

### 5.7 Transfers, Market & Contracts

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-MKT-VAL-001` | perceived player/context/Z → exact log/reference Money | EPS + DATA | valuation Z factors | B64 + Money | engine, data | engine/transfers | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MKT-AGE-001` | fixed ages/position → age signals | EPS | none | B64 | engine | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-LEVERAGE-001` | contract states → seller/player leverage | EPS + DATA | none | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-NEED-001` | PositionCompetition/strategy/Z → ClubNeed | EPS + DATA | factor/specific Z | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-FIT-001` | player/club inputs → exact PlayerClubFit | EPS + DATA | none | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-INTEREST-001` | predictor/uniform → Interest with persistence | EPS + DATA | fixed Bernoulli uniform | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-OFFER-001` | Interest/feasibility/context/uniform → Offer | EPS + DATA | fixed Bernoulli uniform | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-FEE-001` | anchors/context/Z → exact integer fee; FREE_TRANSFER zero/no draw | EPS + DATA | fee Z or none | B64 + Money | schema, engine, data | engine/transfers | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MKT-SELLER-001` | offer/reservation/draw → seller response | EPS + DATA | reservation Z + uniform | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-SALARY-001` | proposal/context/Z → exact salary Money | EPS + DATA | salary Z | B64 + Money | schema, engine, data | engine/transfers | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CONTRACT-EXPECT-001` | utilities/uniform → ContractExpectation | EPS + DATA | categorical uniform | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-CONTRACT-DUR-001` | allowed terms/utilities/uniform → duration | EPS + DATA | categorical uniform | B64 + date/term | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-RENEW-001` | fixed contract/player/club/draw → renewal | EPS + DATA | uniform | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-LOAN-001` | fixed context/draws → loan pathway/terms | EPS + DATA | propensity/categories | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-NEG-001` | frozen terms/context/draw → aggregate success/failure | EPS + DATA | uniform/factors | B64 | engine, data | engine/transfers | `V1_STANDARD` | `SPECIFIED` |
| `GV-MKT-WAIT-001` | checkpoint/resume preserves exact proposal and consumes no new RNG | EPS + DATA | pre-checkpoint only | exact state/hash | schema, engine, data | engine/testkit | `V1_CRITICAL` | `SPECIFIED` |
| `GV-MONEY-ERROR-001` | overflow/nonrepresentable Money rejects without editorial cap | EPS + DATA | none | checked Money | schema, engine, data | domain/engine | `V1_CRITICAL` | `SPECIFIED` |

### 5.8 National Team & Awards

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-NT-CAND-001` | fixed player/context → transforms/evidence/candidate signal | EPS + DATA | none | B64 | engine, data | engine/nationalTeam | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-FIELD-001` | params/Z → location/scale/tail/moments/relative signal | EPS + DATA | field Z | B64 | engine, data | engine/nationalTeam | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-CALL-001` | probability/uniform → call-up | EPS + DATA | uniform | B64 | engine, data | engine/nationalTeam | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-INELIGIBLE-001` | eligibility false → P=0 and no RNG | DATA | none | exact boolean | engine, data | engine/nationalTeam | `V1_CRITICAL` | `SPECIFIED` |
| `GV-NT-SQUAD-001` | CALL_UP_ONLY vs CALL_UP_THEN_SQUAD draw/outcome | EPS + DATA | conditional uniform | B64 | engine, data | engine/nationalTeam | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-INC-001` | prior history/facts/Z → incumbency | EPS + DATA | incumbency Z | B64-H2E | engine, data | engine/nationalTeam | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-MIN-001` | international adapter → role/share/minutes/appearances | EPS + DATA | role/minutes/count draws | B64-H2E | engine, data | engine/roleMinutes | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-OUTCOME-001` | team/support/contribution/field/draw → rank/advance | EPS + DATA | tournament/round draws | B64 | engine, data | engine/nationalTeam | `V1_STANDARD` | `SPECIFIED` |
| `GV-NT-CONTEXT-001` | club/national states and keys remain distinct | EPS + DATA | fixed contexts | exact trace | engine, data | engine/testkit | `V1_STRUCTURAL` | `SPECIFIED` |
| `GV-AWD-UTILITY-001` | fixed facts/context → judged merit/utility | EPS + DATA | player judging Z if profile uses it | B64 | engine, data | engine/awards | `V1_STANDARD` | `SPECIFIED` |
| `GV-AWD-CFIELD-001` | N and `2N+1` draws → exact abstract utilities | EPS + DATA | edition + competitor draws | B64 | engine, data | engine/awards | `V1_CRITICAL` | `SPECIFIED` |
| `GV-AWD-PLACE-001` | player/competitors → placement and all ordinal states | EPS + DATA | none after field | canonical sort | engine, data | engine/awards | `V1_CRITICAL` | `SPECIFIED` |
| `GV-AWD-STAT-001` | player stat + statistical NB2 field → rank/winner | EPS + DATA | field Z/NB2 draws | B64 + integer | engine, data | engine/awards | `V1_CRITICAL` | `SPECIFIED` |
| `GV-AWD-TIE-001` | each tie policy → exact shared/unique result; no tie RNG | DATA | none | exact order | engine, data | engine/awards | `V1_CRITICAL` | `SPECIFIED` |
| `GV-AWD-INELIGIBLE-001` | ineligible → absent outcome/no RNG | DATA | none | exact | engine, data | engine/awards | `V1_CRITICAL` | `SPECIFIED` |
| `GV-AWD-POS-001` | GK/CM/ST profiles use exact distinct transforms | EPS + DATA | fixed profile draws | B64 | engine, data | engine/awards | `V1_STANDARD` | `SPECIFIED` |
| `GV-AWD-MULTI-001` | compatible awards resolve independently without anti-duplication | EPS + DATA | per-award isolated draws | exact trace | engine, data | engine/awards | `V1_STRUCTURAL` | `SPECIFIED` |

### 5.9 Reputation & Social

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-REP-INIT-001` | context/factors → initial regional/social states | EPS + DATA | shared/specific Z | B64-H2E | engine, data | engine/reputation | `V1_STANDARD` | `SPECIFIED` |
| `GV-REP-SPORT-001` | prior state + deduped facts + Z → sporting reputation | EPS + DATA | sporting Z | B64-H2E | engine, data | engine/reputation | `V1_STANDARD` | `SPECIFIED` |
| `GV-REP-AWARE-001` | reach/reputation/attention/context/Z → awareness | EPS + DATA | awareness Z | B64-H2E | engine, data | engine/reputation | `V1_STANDARD` | `SPECIFIED` |
| `GV-REP-SENT-001` | prior + positive/negative impulses/Z → sentiment | EPS + DATA | sentiment Z | B64-H2E | engine, data | engine/reputation | `V1_STANDARD` | `SPECIFIED` |
| `GV-REP-ATTN-001` | multiple unordered impulses → canonical aggregate/decay | EPS + DATA | attention Z | B64-H2E | engine, data | engine/reputation | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SOC-FOLLOW-UP-001` | prior followers/growth/Z → exact higher integer | EPS + DATA | follower/viral draws | B64 + checked integer | schema, engine, data | engine/social | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SOC-FOLLOW-DOWN-001` | negative net growth/churn → exact lower integer | EPS + DATA | churn draw | B64 + checked integer | schema, engine, data | engine/social | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SOC-ENG-001` | followers/prior/context/Z → engagement and observable | EPS + DATA | engagement Z | B64-H2E + integer | engine, data | engine/social | `V1_STANDARD` | `SPECIFIED` |
| `GV-REP-LAG-001` | current award cannot affect its own utility; next window exact input | EPS + DATA | fixed two-window trace | exact facts/state | engine, data | engine/testkit | `V1_CRITICAL` | `SPECIFIED` |
| `GV-REP-REGION-001` | home/current/global signals → exact diffusion/projection | EPS + DATA | regional factors | B64-H2E | engine, data | engine/reputation | `V1_STANDARD` | `SPECIFIED` |
| `GV-SOC-OVERFLOW-001` | nonrepresentable follower result rejects/invalidate path, no cap | EPS | fixed extreme input | checked integer | schema, engine | domain/engine | `V1_CRITICAL` | `SPECIFIED` |

### 5.10 Retirement, Comeback & Finalization

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-RET-MOT-001` | fixed traits/state/context → terms/eta/motivation | EPS + DATA | none | B64-H2E | engine, data | engine/retirement | `V1_STANDARD` | `SPECIFIED` |
| `GV-RET-DECLINE-001` | facts/trajectories → fulfillment mass/EWMA/decline | EPS + DATA | none | B64-H2E | engine, data | engine/retirement | `V1_STANDARD` | `SPECIFIED` |
| `GV-RET-HAZARD-001` | cause H, total, probability, occurrence/cause; H=0 no RNG | EPS + DATA | shared/specific Z + uniform/categorical | B64 | engine, data | engine/retirement | `V1_CRITICAL` | `SPECIFIED` |
| `GV-RET-DECISION-001` | frozen payload + user choice → status/fact/no RNG | EPS + DATA | none | exact state/facts | schema, engine, data | engine/retirement | `V1_CRITICAL` | `SPECIFIED` |
| `GV-RET-CURSOR-001` | post-retirement cursor enabled/disabled operations/zero exposure | EPS + DATA | none | exact state | schema, engine, data | engine/retirement | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CB-HAZARD-001` | eligibility/state/draws → route hazard/outcome; ineligible no RNG | EPS + DATA | hazard draws or none | B64 | engine, data | engine/retirement | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CB-ROUTE-001` | willingness/market offer/user choice → exact transition/affiliation | EPS + DATA | opportunity draws; user choice none | exact state/facts | schema, engine, data | engine/retirement | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CB-CYCLES-001` | history → episode IDs/counters/durations | EPS + DATA | fixed multi-cycle trace | exact identifiers | schema, engine, data | domain/engine | `V1_CRITICAL` | `SPECIFIED` |
| `GV-CB-VIABILITY-001` | retired context → deterministic viability | EPS + DATA | none | B64-H2E | engine, data | engine/retirement | `V1_STANDARD` | `SPECIFIED` |
| `GV-FIN-OPP-001` | context/draw → finalization opportunity/payload | EPS + DATA | hazard draws | B64 + exact payload | engine, data | engine/retirement | `V1_STANDARD` | `SPECIFIED` |
| `GV-FIN-COMPLETE-001` | confirmation → frontier hash, FINALIZING, artifacts, COMPLETED | EPS + SC + DATA | none | exact hashes/state | all five + hashes | engine/scoring/application | `V1_CRITICAL` | `SPECIFIED` |
| `GV-FIN-NOREOPEN-001` | command after COMPLETED → deterministic rejection/no RNG | structural | none | exact error/state | schema, engine | domain/application | `V1_CRITICAL` | `SPECIFIED` |
| `GV-RET-AUTO-001` | calibration automation reproducibility and guard inconclusive | EPS + tooling policy | deterministic policy keys | exact trace | engine | testkit | `V1_STRUCTURAL` | `SPECIFIED` |

### 5.11 Scoring

| Golden ID | Purpose | Identity | Draws | Arithmetic | Versions | Owner | Verification | Estado |
|---|---|---|---|---|---|---|---|---|
| `GV-SCR-ROUND-001` | rational normalization and all half cases | SC | none | RAT-HUP | schema, scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-LEAGUE-FACTOR-001` | boundary/representative IJL factors | SC | none | RAT-HUP | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-LEAGUE-TITLE-001` | precomputed table/master examples | SC | none | RAT-HUP | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-CDF-001` | empirical CDF ties/mid-rank/interpolation/shrinkage | SC | none | exact rational | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-PRI-ST-001` | ST segment features/evidence/factor/components | SC + canonical facts | none | RAT-HUP | all five + SC hashes | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-PRI-CM-001` | CM segment exact calculation | SC + facts | none | RAT-HUP | all five + hashes | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-PRI-GK-001` | GK segment exact calculation | SC + facts | none | RAT-HUP | all five + hashes | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-MULTICLUB-001` | segment-specific factors/no duplicated production | SC + facts | none | RAT-HUP | all five + hashes | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-CLUB-NT-001` | club/national PRI separation | SC + facts | none | RAT-HUP | all five + hashes | scoring | `V1_STANDARD` | `SPECIFIED` |
| `GV-SCR-CC-001` | zero/ordinary/>1 contribution cases | SC + facts | none | RAT-HUP | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-ACH-001` | club/national outcome, multiplier and CC | SC + facts | none | RAT-HUP | scoring, data | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-AWD-001` | 100/60/0 equivalence, distinct stack, league formulas | SC + facts | none | RAT-HUP | scoring, data | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-RECORD-001` | repeat/upgrade/shared/equivalent/longevity | SC + facts | none | RAT-HUP | scoring, data | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-PBR-001` | popularity, historic subcap and 5% half cases | SC + facts | none | RAT-HUP | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-IDEMP-001` | permuted facts → same canonical ledger | SC + facts | none | exact ledger/hash | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-CORRECTION-001` | correction fact → exact reversal/reposting | SC + facts | none | RAT-HUP | scoring | scoring | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-RECOMPUTE-001` | incremental vs full byte-equal ledger digest | SC + facts | none | exact ledger/hash | all five + hashes | scoring/testkit | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-SNAPSHOT-001` | provisional/final snapshot and compatibility mismatch | SC + facts | none | exact snapshot/hash | all five + hashes | scoring/application | `V1_CRITICAL` | `SPECIFIED` |
| `GV-SCR-TIER-001` | every narrative-tier boundary | SC | none | exact integer | scoring | scoring | `V1_STANDARD` | `SPECIFIED` |

## 6. Política de verificación independiente

1. El equipo que implementa el runtime puede preparar fixtures de input, pero
   no es la única fuente de expected outputs críticos.
2. Primitives, distributions y scoring usan una reference implementation o
   worksheet exacta independiente del production code.
3. Procesos stateful pueden verificarse con un segundo evaluator pequeño que
   consuma draws explícitos, sin PRNG ni orchestration compartidos.
4. Hash/canonicalization se coteja con vectores RFC/implementación externa
   autorizada y bytes publicados.
5. Cálculos manuales deben conservar worksheet, reviewer, fórmula, precisión y
   hash; no basta una cifra en Markdown.
6. Todo mismatch se resuelve corrigiendo spec, fixture o implementación con
   rationale; nunca se edita expected para “hacer pasar” el test sin review.

## 7. Publication gate

Un golden alcanza `PUBLISHED_V1` solo si:

- inputs y parameter/config/data identities están congelados;
- expected outputs, intermediates y draw trace están completos;
- verificación independiente requerida pasó;
- artefactos y hashes son resolubles;
- el runtime candidato reproduce exactamente el vector;
- cambios posteriores publican nueva identidad/version, no sobrescritura.

## 8. Referencias

- [Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md)
- [Calibration Target Registry](CALIBRATION_TARGET_REGISTRY.md)
- [Calibration Dataset Registry](CALIBRATION_DATASET_REGISTRY.md)
- [Mathematical Calibration Contract](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- Todos los documentos `*_MATH_SPEC.md` de G3C.

