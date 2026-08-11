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

## 9. Catalog/data blockers G3D-2

Los 139 IDs permanecen `SPECIFIED`. Se añade el siguiente binding heredable:

| Golden group | Required frozen catalogs/data | Puede calcular expected antes de calibración completa | Verification |
|---|---|---|---|
| `GV-MATH-*` | algorithm/profile IDs; sin data observada | Sí, al congelar fixture structural | critical: reference implementation/worksheet |
| `GV-CRE-*`, `GV-DEV-*` | position mapping; candidate parameter values | Solo structural/synthetic fixtures; no publication | standard/critical según row |
| `GV-ROLE-*`, `GV-MIN-*`, `GV-APP-*`, `GV-AVAIL-UNION-*` | calendar/competition/registration fixtures | Sí con synthetic definitions validadas; official requiere hashes V1 | independent evaluator |
| `GV-PERF-*`, `GV-ST-*`, `GV-CM-*`, `GV-GK-*`, `GV-FORM-*` | position/performance context catalogs | Sí para sampler arithmetic; outputs balance dependen del candidate | reference sampler + evaluator |
| `GV-HLT-*`, `GV-INJ-*`, `GV-REC-*`, `GV-RELAPSE-*`, `GV-SEQUELA-*`, `GV-AVAIL-MED-*` | six InjuryDefinitions + calendar | No official expected antes de taxonomy/parameters | independent state evaluator |
| `GV-CLUB-*`, `GV-MGR-*`, `GV-TACTIC-*`, `GV-PCOMP-*`, `GV-WORLD-*` | 16 club definitions/baselines and profiles | Synthetic structural fixtures sí | second evaluator |
| `GV-CALENDAR-*`, `GV-CONGEST-*`, `GV-LEAGUE-*`, `GV-KNOCKOUT-*`, `GV-MOBILITY-*`, `GV-CONTRIB-*` | Competition/Calendar/ExternalPool definitions | Calendar official no; ranking sampler synthetic sí | critical where exact ordering |
| `GV-MKT-*`, `GV-CONTRACT-*`, `GV-MONEY-*` | Market windows, registration, ARS/EUR monetary artifacts, external clubs | Money boundary cases sí; official amounts no | worksheet/reference converter |
| `GV-NT-*` | Argentina NationalTeam/competition/eligibility definitions | Ineligible structural vector sí; official contexts no | critical zero-RNG + evaluator |
| `GV-AWD-*` | five AwardDefinitions and field/tie profiles | ordinal/tie algorithms sí con synthetic IDs | critical field/rank verifier |
| `GV-REP-*`, `GV-SOC-*` | market/reach partitions | Arithmetic/lag synthetic only | independent state evaluator |
| `GV-RET-*`, `GV-CB-*`, `GV-FIN-*` | activity/retirement definitions and product policies | Structural lifecycle vectors sí | critical lifecycle trace |
| `GV-SCR-*` | frozen ScoringConfiguration/CalibrationData and gameplay IDs | Arithmetic/rounding sí; category outputs no | exact rational worksheet/reference implementation |

Un fixture synthetic nunca se renombra como V1. `INPUTS_FROZEN` requiere
`DataArtifactManifest`/ParameterSet/config hashes resolubles. Required catalog
links y expected-output blockers forman parte del future golden manifest.

## 10. Input-dependency classes G3D-3A

Cada golden recibe una clase dominante, aplicando precedencia `D > C > B > A`:

| Clase | Significado |
|---|---|
| `A_MATH_ONLY` | Inputs estructurales/matemáticos normativos; puede calcularse sin dataset ni parámetros calibrados. |
| `B_PARAMETER_REQUIRED` | Requiere valores de un `EngineParameterSet` candidate, pero no un catálogo observado V1. |
| `C_CATALOG_OR_DATA_REQUIRED` | Requiere Definition, mapping, dataset o identity de data; puede requerir además ParameterSet. |
| `D_SCORING_CONFIGURATION_REQUIRED` | Requiere `ScoringConfiguration`/`ScoringCalibrationData`; puede requerir además facts/data. |

La clase marca cuándo puede congelarse el expected oficial, no impide crear un
fixture sintético no publicable.

### 10.1 Asignación exhaustiva

| Golden IDs | Clase dominante | Motivo |
|---|---|---|
| `GV-MATH-*`, `GV-CRE-MATH-001`, `GV-DEV-DOMPOS-001`, `GV-AVAIL-UNION-001`, `GV-SOC-OVERFLOW-001`, `GV-FIN-NOREOPEN-001` | `A_MATH_ONLY` | algoritmo/boundary estructural cerrado; no balance/data real |
| `GV-DEV-EVOL-001`, `GV-DEV-SIGN-001`, `GV-CRE-SUIT-001`, `GV-DEV-RETRAIN-001`, `GV-ROLE-SOFTMAX-001`, `GV-ROLE-PERSIST-001`, `GV-MIN-EXPECTED-001` | `B_PARAMETER_REQUIRED` | ecuaciones exactas con fixture parameters |
| `GV-PERF-TASK-001`, `GV-PERF-FACTORS-001`, `GV-PERF-CONS-001`, `GV-PERF-EVID-001`, `GV-FORM-UPDATE-001` | `B_PARAMETER_REQUIRED` | aritmética Performance/Form sin catalog identity obligatoria |
| `GV-HLT-FAT-001`, `GV-HLT-FIT-001`, `GV-REC-PROGRESS-001` | `B_PARAMETER_REQUIRED` | state transition parametrizada con contexto sintético suficiente |
| `GV-MKT-AGE-001`, `GV-RET-AUTO-001` | `B_PARAMETER_REQUIRED` | age curve/tooling policy candidate, sin source observed necesaria |
| restantes IDs de §§5.2–5.10, excepto `GV-FIN-COMPLETE-001` | `C_CATALOG_OR_DATA_REQUIRED` | usan position/calendar/injury/club/competition/money/national/award/reach/lifecycle Definitions o facts |
| `GV-FIN-COMPLETE-001` y todos `GV-SCR-*` | `D_SCORING_CONFIGURATION_REQUIRED` | final score/snapshot o arithmetic/config de Scoring |

La regla “restantes §§5.2–5.10” es cerrada sobre los IDs listados en este
registry; un ID futuro debe declarar clase explícita y no hereda un default.
Los 139 goldens actuales quedan cubiertos una vez, por precedencia.

### 10.2 Readiness por clase

- A puede pasar a `INPUTS_FROZEN` cuando el profile/schema normativo esté
  versionado; no espera G3D-3B.
- B espera un candidate con hash; no exige que sea `FROZEN_V1` para calcular un
  expected candidate, pero sí para publicar V1.
- C espera los catalog/dataset candidates aplicables en `FROZEN` y todos sus
  mappings/hashes.
- D espera el par inmutable `ScoringConfiguration` +
  `ScoringCalibrationData` y los gameplay facts/IDs que consume.

Ningún output cambia de `SPECIFIED` en G3D-3A. Conteo: **139**.

## 11. Referencias G3D-3A

- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)

## 12. Catalog-input readiness G3D-3C

All 139 goldens remain `SPECIFIED`; no expected output was computed. G3D-3C
identified 50 concrete catalog-dependent goldens in the club/competition (13),
National Team/Awards (17), Money (1) and Scoring (19) groups.

| Binding group | Golden count | Catalog input state | Still missing |
|---|---:|---|---|
| Club/Competition/Calendar | 13 | identities/stages/editions available; partial calendar | EngineParameterSet, club baselines, exact calendar fixtures/params |
| National Team | 9 | Argentina identity, policy and World Cup context available | parameters, ordinary calendar and fixed fixtures |
| Awards | 8 | five award identities available | complete AwardDefinitions, parameters and fields/ties |
| Money representation | 1 | ARS/EUR identity/minor unit available | representable bounds and fixed fixture/config |
| Scoring | 19 | 12 scoring/gameplay refs and normative subset available | ScoringConfiguration/Data, IJL/catalog/cohorts |

Three structural vectors now have all catalog identity inputs needed to freeze
their future fixture shape: `GV-MOBILITY-BOUNDARY-001`,
`GV-NT-INELIGIBLE-001` and `GV-MONEY-ERROR-001`. This does not mean their
expected outputs are computed or independently verified.

All other 47 catalog-dependent vectors are `CATALOG_INPUTS_PARTIAL`. In
particular, Award tie/eligibility vectors remain blocked by definition fields,
and `GV-CALENDAR-001` remains blocked by the partial Q/calendar candidate.
No golden advances to `INPUTS_FROZEN` in this phase.

## 13. Acceptance-use overlay G3D-3D

Los 139 golden IDs permanecen `SPECIFIED`; no se calcula expected output. Cada
ID recibe un `acceptanceUse` mediante precedencia cerrada:

1. `SCORING_REGRESSION`;
2. `INVARIANT_ACCEPTANCE`;
3. `DISTRIBUTIONAL_REGRESSION`;
4. `CALIBRATION_ACCEPTANCE` para cualquier ID actual no capturado antes.

| Acceptance use | Golden IDs / closed pattern | Uso futuro |
|---|---|---|
| `SCORING_REGRESSION` | todos `GV-SCR-*` y `GV-FIN-COMPLETE-001` | aritmética exacta, ledger, snapshot, tiers y final score |
| `INVARIANT_ACCEPTANCE` | todos `GV-MATH-*`; `GV-CRE-MATH-001`; `GV-DEV-DOMPOS-001`; `GV-AVAIL-UNION-001`; `GV-MIN-ZERO-001`; `GV-MIN-ALLOC-001`; `GV-MIN-CONTEXT-001`; `GV-HLT-CADENCE-001`; `GV-MOBILITY-BOUNDARY-001`; `GV-MONEY-ERROR-001`; `GV-NT-INELIGIBLE-001`; `GV-AWD-INELIGIBLE-001`; `GV-REP-LAG-001`; `GV-SOC-OVERFLOW-001`; `GV-RET-CURSOR-001`; `GV-FIN-NOREOPEN-001` | dominios, no-draw, identidad, orden, bounds y replay estructural |
| `DISTRIBUTIONAL_REGRESSION` | `GV-CRE-GEN/TRAIT/POWER/CUSTOM-*`; `GV-ROLE-SOFTMAX-*`; `GV-MIN-SHARE-*`; `GV-APP-START-*`; `GV-PERF-FACTORS-*`; `GV-ST-*`; `GV-GK-PROD-*`; `GV-INJ-COUNT/SEVERITY-*`; `GV-REC-REQ-*`; `GV-RELAPSE-*`; `GV-SEQUELA-*`; `GV-CLUB-EVOL-*`; `GV-MGR-TURN/GEN-*`; `GV-TACTIC-*`; `GV-PCOMP-*`; `GV-LEAGUE-RANK-*`; `GV-KNOCKOUT-*`; `GV-WORLD-EVOL-*`; `GV-MKT-INTEREST/OFFER/FEE/SELLER/SALARY/RENEW/LOAN/NEG-*`; `GV-CONTRACT-EXPECT/DUR-*`; `GV-NT-FIELD/CALL/SQUAD/INC/MIN/OUTCOME-*`; `GV-AWD-CFIELD/PLACE/STAT/TIE/MULTI-*`; `GV-REP-SPORT/AWARE/SENT/ATTN/REGION-*`; `GV-SOC-FOLLOW-UP/FOLLOW-DOWN/ENG-*`; `GV-RET-HAZARD/DECISION/AUTO-*`; `GV-CB-*`; `GV-FIN-OPP-*` | exact draw→outcome fixtures que protegen distribución/sampler al cambiar candidates |
| `CALIBRATION_ACCEPTANCE` | todos los restantes IDs existentes de §§5.2–5.10 | transiciones, predictors, summaries y adapters con candidate parameters/data |

Los slash patterns representan la lista explícita de sufijos indicada, no una
regla para IDs futuros. Un golden nuevo debe declarar `acceptanceUse` y no
hereda el catch-all. Distributional regression no reemplaza Monte Carlo: fija
draws e intermediates exactos, mientras los 77 `PT-*` evalúan frecuencias y
distancias agregadas.

## 14. Catalog-input readiness G3D-3B2

All 139 goldens remain `SPECIFIED`; none advances to `INPUTS_FROZEN` and no
expected output was computed. The focused candidates remove these input gaps:

| Golden group | Newly ready catalog input | Still missing before expected output |
|---|---|---|
| `GV-AWD-*` (8) | five AwardDefinition families/categories/tie policies; Pichichi alias semantics | EngineParameterSet award values, numeric abstract-field profile and fixture draws |
| `GV-NT-*` (9) | ordinary FIFA/Argentina window IDs, Q checkpoints and opportunity maxima | nationalTeam parameters and fixed scheduled/realized fixture inputs |
| `GV-CALENDAR-001`, `GV-CONGEST-001` | ordinary-window mapping plus existing stage/market candidates | exact fixture candidate, ParameterSet adapters and future freeze hash |
| `GV-MKT-VAL/FEE/SALARY-*`, `GV-MONEY-ERROR-001` | four monetary source bindings and exact `TR-MONEY-NORMALIZE-V1` arithmetic | calibrated monetary inputs, representable bound fixture and ParameterSet values |

These are readiness changes only. Catalog hashes are candidate provenance, not
published data/scoring versions, and no golden arithmetic result is asserted.

## 15. Empirical-input readiness G3D-4A

All 139 golden IDs remain `SPECIFIED`. No expected output, draw or parameter
fixture is computed. The following existing groups gain only a future empirical
fixture/distribution basis:

| Golden group | G3D-4A readiness improvement | Still missing |
|---|---|---|
| `GV-CRE-*` | emergence-age sensitivity and strict position-mapping basis | latent creation parameters, Argentina player panel and frozen fixture |
| `GV-DEV-*` | longitudinal aging/exposure heterogeneity and bias documentation | Development candidate values, censoring treatment and GK evidence |
| `GV-ROLE-*`, `GV-MIN-*`, `GV-APP-START-001` | minute-share shapes, zero mass, exposure bands and observed persistence | role/minutes parameters, frozen TeamMinutesOpportunity fixture and Argentina baseline |
| `GV-ST-*`, `GV-CM-IMPACT-001`, `GV-GK-PROD-001` | count/rate/event-proxy distribution basis by position | candidate parameters; event-source license or alternative; exact draws |
| `GV-PERF-*` | temporal-block association and task-proxy basis | factor/Form candidate, source-cleared fixture and independent expected output |

Acceptance uses from G3D-3D are unchanged. These vectors have
`empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS`; none has
`parameterDependencyCleared=TRUE`, `INPUTS_FROZEN` or a computed result.

## 16. Health empirical-input readiness G3D-4B

All 139 golden IDs remain `SPECIFIED`; no expected output, parameter fixture or
draw is computed.

| Golden group | G3D-4B readiness improvement | Acceptance use | Still missing |
|---|---|---|---|
| `GV-HLT-LOAD-001`, `GV-HLT-FAT-001`, `GV-HLT-FIT-001` | exposure/congestion evidence and ACWR methodological boundary | `CALIBRATION_ACCEPTANCE` | Load/Fatigue/Fitness candidate values and fixed contexts |
| `GV-INJ-HAZARD-001`, `GV-INJ-COUNT-001` | six family IDs, match/training origins and player-hour empirical basis | hazard invariant/distributional regression | candidate hazard values, fixed exposure and deterministic draws |
| `GV-INJ-SEVERITY-001` | observed severity bins, family duration shapes and tails | `DISTRIBUTIONAL_REGRESSION` | latent-bin fixture, candidate coefficients/sigma and exact draw |
| `GV-REC-REQ-001`, `GV-REC-PROGRESS-001`, `GV-AVAIL-MED-001` | right-skewed duration and return-endpoint/censoring basis | distributional/calibration acceptance | requirement/work/availability candidates and calendar interval fixture |
| `GV-RELAPSE-001` | recurrence definitions, family frequencies and early-time concentration | `DISTRIBUTIONAL_REGRESSION` | continuous memory candidate, parent episode and draw |
| `GV-SEQUELA-001` | indirect post-return evidence and explicit weak-identification status | `DISTRIBUTIONAL_REGRESSION` | synthetic/joint candidate values and independent acceptance basis |
| `GV-HLT-CADENCE-001` | observational endpoint adapter confirms cadence boundary remains necessary | `INVARIANT_ACCEPTANCE` | frozen Q fixture; no empirical value required |

These vectors now have
`empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS`; the family/catalog dependency
is cleared at candidate-definition level only. No vector reaches
`INPUTS_FROZEN`, `EXPECTED_COMPUTED` or `PUBLISHED_V1`.

## 17. Club/Market empirical-input readiness G3D-4C

All **139** goldens remain `SPECIFIED`; no inputs are frozen and no expected
output is computed. G3D-4C adds empirical fixture/distribution basis only.

| Golden IDs | Empirical basis after G3D-4C | Still required |
|---|---|---|
| `GV-CLUB-EVOL-001`, `GV-CLUB-SLOW-001` | score/finance/history/proxy contexts for 16 clubs | synthetic fixture, calibrated latent maps and independent arithmetic |
| `GV-MGR-TURN-001`, `GV-MGR-GEN-001` | turnover/spell evidence and departure-cause limitation | parameter candidate, adjudicated fixture and factor draws |
| `GV-TACTIC-001`, `GV-PCOMP-001` | formation persistence plus Spain GK/CM/ST concentration/depth | latent adapter, Argentina panel, parameters and draws |
| `GV-WORLD-EVOL-001`, `GV-MOBILITY-BOUNDARY-001` | competition/participation and movement source context | world/league candidate values; boundary remains normative |
| `GV-MKT-VAL-001`, `GV-MKT-AGE-001`, `GV-MKT-LEVERAGE-001`, `GV-MKT-NEED-001`, `GV-MKT-FIT-001` | dated valuation/age/club/contract proxy basis | causal parameters and exact fixture values |
| `GV-MKT-INTEREST-001`, `GV-MKT-OFFER-001`, `GV-MKT-SELLER-001`, `GV-MKT-NEG-001`, `GV-MKT-WAIT-001` | selected-outcome/private-observability boundary | synthetic fixture plus joint-calibrated probabilities |
| `GV-MKT-FEE-001`, `GV-MKT-SALARY-001`, `GV-MONEY-ERROR-001` | fee tail, official cost/salary context and unchanged Money bindings | native exact amounts, parameter candidate and checked arithmetic |
| `GV-CONTRACT-EXPECT-001`, `GV-CONTRACT-DUR-001`, `GV-MKT-RENEW-001`, `GV-MKT-LOAN-001` | duration/loan evidence and renewal-denominator limitation | local terms, parameters and independent derivation |

This improves empirical readiness for **25** existing golden requirements (8
club/manager/position/world-boundary and 17 market/contract/money). Publication
state is unchanged.

## 18. National Team/Awards empirical-input readiness G3D-4D

All **139** golden IDs remain `SPECIFIED`; no fixture is frozen and no expected
output is computed. G3D-4D adds empirical basis only.

| Golden IDs | Empirical basis after G3D-4D | Still required |
|---|---|---|
| `GV-NT-CAND-001`, `GV-NT-FIELD-001` | selected/preselected stages, strict position counts and incomplete candidate proxy | synthetic/frozen candidate fixture and calibrated mixture values |
| `GV-NT-CALL-001`, `GV-NT-INELIGIBLE-001`, `GV-NT-SQUAD-001` | opportunity/call-up/squad-stage evidence; Argentina-only eligibility unchanged | call-up/squad parameter candidate and exact draws; ineligible vector remains invariant-derived |
| `GV-NT-INC-001`, `GV-NT-MIN-001` | cross-cycle retention and strict GK/CM/ST exposure shares | incumbency/Role-Minutes candidates, ordinary-window fixture and draws |
| `GV-NT-OUTCOME-001`, `GV-NT-CONTEXT-001` | 111 context-tagged results plus official major endpoints | team/field/contribution candidates and fixed opponent/context draws |
| `GV-AWD-UTILITY-001`, `GV-AWD-CFIELD-001`, `GV-AWD-PLACE-001` | comparative field sizes, winner concentration, repeat/position histories | candidate utility/field values, exact abstract draws and independent expected output |
| `GV-AWD-STAT-001` | LALIGA scorer upper-tail and rank semantics | full-field NB2 candidate, fixed production/exposure and draws |
| `GV-AWD-TIE-001` | real/catalog tie provenance remains available; observed tie-frequency panel incomplete | exact definition fixture and independent arithmetic |
| `GV-AWD-INELIGIBLE-001`, `GV-AWD-POS-001`, `GV-AWD-MULTI-001` | eligibility/catalog, position representation and compatible-repeat evidence | parameter fixtures; ineligible no-draw behavior remains invariant-derived |

These **17** existing requirements gain
`empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS`. Publication status remains
`SPECIFIED`; no ID reaches `INPUTS_FROZEN`, `EXPECTED_COMPUTED` or
`PUBLISHED_V1`.

## 19. Reputation/Social/Retirement empirical-input readiness G3D-4E

All **139** golden IDs remain `SPECIFIED`; no fixture is frozen and no expected
output is computed. G3D-4E adds empirical or Product-boundary basis only.

| Golden IDs | Basis after G3D-4E | Acceptance use | Still required |
|---|---|---|---|
| `GV-REP-SPORT-001`, `GV-REP-AWARE-001`, `GV-REP-ATTN-001`, `GV-REP-LAG-001`, `GV-REP-REGION-001` | typed event chronology, normalized attention and regional-proxy limitations | calibration/distributional regression plus lag invariants | candidate persistence/impulse/diffusion values and frozen dated fixtures |
| `GV-REP-SENT-001` | explicit sentiment-versus-engagement observability boundary | invariant/weak-identification review | Product/synthetic candidate or construct-valid source |
| `GV-SOC-FOLLOW-UP-001`, `GV-SOC-FOLLOW-DOWN-001`, `GV-SOC-ENG-001` | heavy-tail growth, official gain/loss semantics and engagement definitions | `DISTRIBUTIONAL_REGRESSION` | candidate dynamics, platform fixture and exact draws |
| `GV-SOC-OVERFLOW-001` | preserved million-scale/extreme-growth observations | `INVARIANT_ACCEPTANCE` | exact uint64 boundary fixture; no empirical cap |
| `GV-RET-MOT-001`, `GV-RET-DECLINE-001`, `GV-RET-HAZARD-001`, `GV-RET-DECISION-001`, `GV-RET-CURSOR-001` | censored career duration and multi-context retirement evidence | calibration plus lifecycle invariants | joint hazard candidate, upstream adapters and exact draws |
| `GV-CB-HAZARD-001`, `GV-CB-ROUTE-001`, `GV-CB-CYCLES-001`, `GV-CB-VIABILITY-001` | verified return routes/gaps/quality and explicit denominator limitation | tail/distributional regression | Product-constrained candidate, representative denominator and fixed histories |
| `GV-FIN-OPP-001`, `GV-FIN-COMPLETE-001`, `GV-FIN-NOREOPEN-001`, `GV-RET-AUTO-001` | manual-finalization/non-auto-close boundary remains Product/invariant-derived | `INVARIANT_ACCEPTANCE` | Product fixture and independent arithmetic; no observational value required |

These existing requirements gain
`empiricalFixtureBasis=AVAILABLE_WITH_LIMITATIONS` or
`productBoundaryBasis=AVAILABLE`. Publication state remains `SPECIFIED`; no
parameter dependency is cleared and no output is asserted.
