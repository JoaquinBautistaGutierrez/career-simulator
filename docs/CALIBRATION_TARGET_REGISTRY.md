# Calibration Target Registry

## 1. Propósito

Este registro consolida los invariantes, targets de calibración y diagnostics
definidos por G3C. Cada fila es una métrica canónica; sus segmentaciones son
dimensiones de esa métrica, no targets duplicados. Ningún rango observacional
se asigna en G3D-1.

## 2. Contrato de `CalibrationTargetDefinition`

```text
CalibrationTargetDefinition {
  targetId
  subsystem
  metric
  segmentation[]
  targetType: INVARIANT | CALIBRATION_TARGET | DIAGNOSTIC
  expectedRangeOrToleranceStatus
  requiredDatasetIds[]
  parameterPathPatterns[]
  sampleTier: SMOKE | CALIBRATION | DEEP
  aggregationMethod
  acceptanceRuleStatus
  externalEvidenceRequired
  productDecisionRequired
  currentState
  aliases[]
}
```

Estados de rango/tolerancia:

| Estado | Uso |
|---|---|
| `DESIGN_EXACT` | La regla es un invariante exacto ya normativo. |
| `RANGE_UNASSIGNED` | La métrica está definida, pero falta rango/tolerancia. |
| `EVIDENCE_PENDING` | Falta dataset/transform antes de proponer rango. |
| `PRODUCT_DECISION_PENDING` | Falta una preferencia explícita de producto. |
| `PROVISIONAL_RANGE` | Rango publicado para candidato, no aceptado V1. |
| `ACCEPTED_V1` | Rango/tolerancia congelado en el acceptance bundle V1. |
| `NOT_APPLICABLE` | Diagnostic sin regla de aceptación propia. |

Estados de acceptance rule:

- `SPECIFIED`: aggregation y comparación inequívocas;
- `RULE_PENDING`: falta tolerancia, distancia o decisión;
- `VALIDATED`: regla probada con artefacto real;
- `FROZEN_V1`: regla publicada e inmutable.

Estados generales: `PLANNED`, `MEASURABLE`, `EVIDENCE_READY`, `ACCEPTED`,
`FROZEN_V1`. En G3D-1 los invariantes son `MEASURABLE`; los demás permanecen
`PLANNED` salvo que su spec ya proporcione todos los inputs normativos.

## 3. Métodos de agregación canónicos

| Código | Método |
|---|---|
| `INV_RATE` | tasa de violación; aceptación exacta `0`. |
| `DIST_Q` | media, mediana y quantiles seleccionados; tails P90/P95/P99/P99.9 cuando el tamaño lo permite. |
| `FREQ` | frecuencia binomial con intervalo/tolerancia versionados. |
| `COND_FREQ` | frecuencia condicionada por bins/segmentos predeclarados. |
| `CORR` | correlación declarada (Pearson/Spearman según target); no se intercambian sin revisión. |
| `TRANSITION` | matriz de transición normalizada por estado origen. |
| `SURVIVAL` | Kaplan-Meier/curva de supervivencia con right-censoring declarado. |
| `DISTANCE` | distancia distribucional declarada, por defecto Wasserstein/KS solo cuando la fila lo indique. |
| `EXACT_SET` | igualdad de conjunto/orden/hash/ledger. |
| `TRACE` | comparación de intermediates y consumo RNG exactos. |

## 4. Registry

### 4.1 Cross-runtime, Creation y Development

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-GLOBAL-NUM-001` | no NaN/Infinity/-0 y dominios persistidos | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | todos los state paths | externa no; producto no; `MEASURABLE` |
| `CT-GLOBAL-RNG-001` | misma seed/context/versions → mismos outputs y draw trace | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | stream/sampler/model IDs | no/no/`MEASURABLE` |
| `CT-GLOBAL-HASH-001` | canonical payload permutation → mismo hash; byte semántico distinto → hash distinto | `INVARIANT` | `DESIGN_EXACT`; `EXACT_SET`; SMOKE | — | identity/hash paths | no/no/`MEASURABLE` |
| `CT-GLOBAL-GOLDEN-001` | conformidad de primitives/samplers/rounding | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | structural math profiles | no/no/`MEASURABLE` |
| `CT-CRE-CAP-001` | capability quantiles por GK/CM/ST y family | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PLAYER-CREATION-REFERENCE` | creation capability generator/profiles | sí/no/`PLANNED` |
| `CT-CRE-TRAIT-001` | trait quantiles por context/position | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PLAYER-TRAIT-REFERENCE` | trait generator/factors | sí + diseño/no/`PLANNED` |
| `CT-CRE-CORR-001` | cross-capability y capability-trait correlations | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-PLAYER-CREATION-REFERENCE` | factor loadings/residual sigmas | sí/no/`PLANNED` |
| `CT-CRE-POS-001` | posición inicial por creation context | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `FREQ`; CALIBRATION | `DS-PLAYER-CREATION-REFERENCE` | position utilities | sí/sí/`PLANNED` |
| `CT-CRE-FOOT-001` | RIGHT/LEFT/BOTH prevalence por posición/contexto | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-PLAYER-FOOT-REFERENCE` | foot utilities | sí + diseño/sí para BOTH cost/`PLANNED` |
| `CT-CRE-POWER-001` | CreationPower distribution por position/mode | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-PLAYER-CREATION-REFERENCE` | power surrogate/CDF | parcial/sí/`PLANNED` |
| `CT-CRE-EQUIV-001` | Quick vs Custom mean/median/quantile y Wasserstein/KS | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DISTANCE`; DEEP | `DS-PLAYER-CREATION-REFERENCE` | conditional sampler/power acceptance | no/sí/`PLANNED` |
| `CT-CRE-TAIL-001` | prevalencia de capabilities extremas y combinaciones raras | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-PLAYER-CREATION-REFERENCE` | generator sigmas/mixtures | sí/no/`PLANNED` |
| `CT-CRE-SUIT-001` | PositionSuitability distribution y ordering por GK/CM/ST | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-POSITION-EVALUATION-REFERENCE` | suitability weights/interactions | sí + diseño/no/`PLANNED` |
| `CT-CRE-DOMPOS-001` | dominant position/group por effective-minute histories | `INVARIANT` | `DESIGN_EXACT`; `EXACT_SET`; SMOKE | — | deterministic tie/order profiles | no/no/`MEASURABLE` |
| `CT-DEV-FAMILY-001` | las 20 capabilities pertenecen a una única family | `INVARIANT` | `DESIGN_EXACT`; `EXACT_SET`; SMOKE | — | capabilityFamilyMap | no/no/`MEASURABLE` |
| `CT-DEV-DELTA-001` | seasonal delta distribution por family/age band/position/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-DEVELOPMENT-LONGITUDINAL` | maturation/acquired/wear/shocks | sí/no/`PLANNED` |
| `CT-DEV-SIGN-001` | P(delta<0 young)>0 y P(delta>0 veteran)>0 | `INVARIANT` | `DESIGN_EXACT`; `COND_FREQ`; DEEP | — | shocks + smooth curves | no/no/`MEASURABLE` |
| `CT-DEV-CORR-001` | cross-capability/family delta correlation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-DEVELOPMENT-LONGITUDINAL` | shock hierarchy/loadings | sí/no/`PLANNED` |
| `CT-DEV-CUM-001` | cumulative change multi-season por family/age | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-DEVELOPMENT-LONGITUDINAL` | all development parameters | sí/no/`PLANNED` |
| `CT-DEV-PEAK-001` | observed retrospective peak-age distribution | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-DEVELOPMENT-LONGITUDINAL` | maturation/wear | sí/no/`PLANNED` |
| `CT-DEV-EXPOSURE-001` | minutes/environment sensitivity of expected acquired development | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; CALIBRATION | `DS-DEVELOPMENT-LONGITUDINAL` | experience/environment/acquired | sí/no/`PLANNED` |
| `CT-DEV-ENV-001` | DevelopmentQuality/manager influence sensitivity | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | `DS-CLUB-VERTICAL-SLICE` | environment weights | parcial/no/`PLANNED` |
| `CT-DEV-RETRAIN-001` | opportunity/completion/position-change frequency by age/usage/adaptability | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `COND_FREQ`; DEEP | `DS-POSITION-USAGE-HISTORY` | retraining predictors | sí + diseño/sí/`PLANNED` |
| `CT-DEV-TAIL-001` | resurgence, extreme decline/growth, no personal cap | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-DEVELOPMENT-LONGITUDINAL` | maturation/wear/shocks | sí/no/`PLANNED` |

### 4.2 Role, Minutes y exposure

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-ROLE-FREQ-001` | SportingRole frequency por GK/CM/ST, Argentina/España, context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE` | role bases/coefficients/status | sí + diseño/no/`PLANNED` |
| `CT-ROLE-TRANS-001` | role transition matrix, persistence, promotion/demotion | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `TRANSITION`; DEEP | `DS-ROLE-MINUTES-REFERENCE` | transition effects | sí + diseño/no/`PLANNED` |
| `CT-ROLE-SENS-001` | response to quality/trust/tactical fit/previous performance | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `COND_FREQ`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE` | role coefficients/adapters | parcial/sí/`PLANNED` |
| `CT-ROLE-COMP-001` | competition increase does not raise expected role opportunity, ceteris paribus | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | competition weights/role coefficients | no/no/`MEASURABLE` |
| `CT-MIN-SHARE-001` | minuteShare distribution by role/position/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE` | minute intercepts/coefficients/sigmas | sí/no/`PLANNED` |
| `CT-MIN-ACTUAL-001` | actualMinutes quantiles y yearly totals | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE`, `DS-CALENDAR-SLICE` | minutes + calendar | sí/no/`PLANNED` |
| `CT-MIN-ZERO-001` | zero/low-minute frequency por role/status | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE` | role/minutes/availability | sí/no/`PLANNED` |
| `CT-MIN-TAIL-001` | BENCH high-share y STAR low-share tails | `DIAGNOSTIC` | `NOT_APPLICABLE`; `COND_FREQ`; DEEP | `DS-ROLE-MINUTES-REFERENCE` | role intercepts/sigmas | sí + diseño/no/`PLANNED` |
| `CT-MIN-SENS-001` | trust/fit/competition sensitivities of expected share | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `COND_FREQ`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE` | minute coefficients | parcial/sí/`PLANNED` |
| `CT-MIN-CORR-001` | role↔minutes y previousPerformance↔next-Q minutes | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | `DS-ROLE-MINUTES-REFERENCE` | role/minutes adapters | sí/no/`PLANNED` |
| `CT-MIN-CONTEXT-001` | CLUB vs NATIONAL_TEAM separation and distributions | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | context adapters/stream keys | no/no/`MEASURABLE` |
| `CT-MIN-POS-001` | position-minute shares sum to actual minutes | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | positionUsage/allocation | no/no/`MEASURABLE` |
| `CT-APP-DIST-001` | appearances distribution by role/position/calendar | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE`, `DS-CALENDAR-SLICE` | appearance model | sí/no/`PLANNED` |
| `CT-START-DIST-001` | starts distribution and starts/appearance ratio | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-ROLE-MINUTES-REFERENCE` | starts model | sí/no/`PLANNED` |
| `CT-APP-INVARIANT-001` | `0<=starts<=appearances<=opportunity`; zero availability→zero minutes/draw policy | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | all exposure structural profiles | no/no/`MEASURABLE` |

### 4.3 Performance, Production y Form

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-PERF-TASK-001` | task ability distribution/ordering by GK/CM/ST | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | task weights/interactions | sí + diseño/no/`PLANNED` |
| `CT-PERF-DIST-001` | realized dimension distributions by position/role/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | underlying means/loadings/sigmas | sí/no/`PLANNED` |
| `CT-PERF-CORR-001` | within/cross-dimension correlations | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-PERFORMANCE-REFERENCE` | common/domain/specific factors | sí/no/`PLANNED` |
| `CT-PERF-CONS-001` | conditional variance by consistency bins | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | consistency effects | parcial/sí/`PLANNED` |
| `CT-PERF-PRESS-001` | pressureExposure↔pressure outcomes by resistance | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; DEEP | `DS-PRESSURE-PERFORMANCE-REFERENCE` | pressure effects | sí + diseño/no/`PLANNED` |
| `CT-PERF-EVID-001` | evidence distribution by minutes/position/context | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | evidence tau | parcial/sí/`PLANNED` |
| `CT-PERF-SURPRISE-001` | expected-vs-realized surprise calibration | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | surprise scales/weights | sí/no/`PLANNED` |
| `CT-PERF-FORM-001` | form autocorrelation, persistence, extreme streaks | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `CORR`; DEEP | `DS-PERFORMANCE-LONGITUDINAL` | form AR parameters | parcial/sí/`PLANNED` |
| `CT-PERF-TAIL-001` | exceptional/terrible Q, long streaks, extreme rates | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-PERFORMANCE-REFERENCE` | sigmas/dispersion/form | sí/no/`PLANNED` |
| `CT-ST-GOAL-001` | goals/90, season totals, zero goals, high tails | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | opportunity/conversion/NB dispersion | sí/no/`PLANNED` |
| `CT-ST-CONV-001` | conversion distribution and opportunity→goal relation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-PERFORMANCE-REFERENCE` | chance quality/conversion | sí/no/`PLANNED` |
| `CT-ST-AST-001` | assists/90, season totals, zero/tails | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | creative/assist/NB | sí/no/`PLANNED` |
| `CT-ST-CORR-001` | goals↔assists correlation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-PERFORMANCE-REFERENCE` | shared attacking factors | sí/no/`PLANNED` |
| `CT-CM-IMPACT-001` | progression/creative/control/defensive impact distributions/correlations | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q` + `CORR`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | CM impact models | sí/no/`PLANNED` |
| `CT-CM-COUNT-001` | CM goals/assists as secondary output | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | CM counts | sí/no/`PLANNED` |
| `CT-GK-SHOTS-001` | shots faced distribution by defensive environment | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | GK shots model | sí/no/`PLANNED` |
| `CT-GK-SAVE-001` | save rate/goals conceded distribution | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | save model | sí/no/`PLANNED` |
| `CT-GK-CS-001` | clean sheets and relation with environment/goals conceded | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-PERFORMANCE-REFERENCE` | clean-sheet model | sí/no/`PLANNED` |
| `CT-PROD-CONTEXT-001` | team context↔production sensitivity; raw stats unchanged by IJL | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-PERFORMANCE-REFERENCE`, `DS-CLUB-VERTICAL-SLICE` | performance context adapters | sí/no/`PLANNED` |
| `CT-PERF-SUM-001` | Q→season, multiclub and national/club aggregation neutrality | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | summary profiles | no/no/`MEASURABLE` |
| `CT-PERF-X-001` | Performance→next Role/Trust/Confidence diagnostics | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | `DS-PERFORMANCE-LONGITUDINAL` | output signal transforms | sí/no/`PLANNED` |

### 4.4 Health, Injury y Recovery

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-HLT-INVARIANT-001` | state/load/hazard domains, no retroactivity, multiple episodes | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | structural health paths | no/no/`MEASURABLE` |
| `CT-HLT-LOAD-001` | realized/acute/chronic load distributions and autocorrelation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-INJURY-EXPOSURE` | load transforms/persistence | sí/no/`PLANNED` |
| `CT-HLT-FAT-001` | fatigue distribution, autocorrelation, congestion response, tails | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-INJURY-EXPOSURE` | fatigue dynamics | parcial/sí/`PLANNED` |
| `CT-HLT-FIT-001` | fitness distribution, inactivity/preparation/recovery response | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-INJURY-EXPOSURE` | fitness dynamics | parcial/sí/`PLANNED` |
| `CT-INJ-FREQ-001` | injuries per window/season/career, zero and multiple injury frequency | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-INJURY-EXPOSURE` | hazards/exposure/load | sí/no/`PLANNED` |
| `CT-INJ-MIX-001` | InjuryFamily/origin mix by position/age/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-INJURY-EXPOSURE` | family hazards/catalog | sí/no/`PLANNED` |
| `CT-INJ-LOAD-001` | load/fatigue/age sensitivity of hazard | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; DEEP | `DS-INJURY-EXPOSURE` | hazard coefficients | sí/no/`PLANNED` |
| `CT-INJ-SEV-001` | severity distribution by family/origin/load | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-INJURY-RECOVERY` | severity model | sí/no/`PLANNED` |
| `CT-INJ-AVAIL-001` | injury burden→availability intervals/minutes lost | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-INJURY-RECOVERY`, `DS-CALENDAR-SLICE` | availability curve/allocation | sí/no/`PLANNED` |
| `CT-INJ-HIST-001` | history burden decay and recurrence relation | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | `DS-INJURY-RECOVERY` | history weights/decay | sí/no/`PLANNED` |
| `CT-REC-DUR-001` | recovery requirement/duration quantiles by severity/family | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-INJURY-RECOVERY` | requirement/work | sí/no/`PLANNED` |
| `CT-REC-SENS-001` | RecoveryCapacity/MedicalQuality effect | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; DEEP | `DS-INJURY-RECOVERY`, `DS-CLUB-VERTICAL-SLICE` | recovery coefficients | sí/no/`PLANNED` |
| `CT-REL-FREQ-001` | relapse frequency by incomplete recovery/load/family | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-INJURY-RECOVERY` | relapse hazard | sí/no/`PLANNED` |
| `CT-REL-DECAY-001` | relapse risk decay over elapsed/recovery | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `SURVIVAL`; DEEP | `DS-INJURY-RECOVERY` | relapse memory/history decay | sí/no/`PLANNED` |
| `CT-SEQ-FREQ-001` | sequela occurrence by severity/age/recovery | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-INJURY-RECOVERY` | sequela occurrence | sí/no/`PLANNED` |
| `CT-SEQ-MIX-001` | temporary/persistent mix | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-INJURY-RECOVERY` | sequela type | sí/no/`PLANNED` |
| `CT-SEQ-BURDEN-001` | sequela burden and downstream relation | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-INJURY-RECOVERY` | burden/affinity | sí/no/`PLANNED` |
| `CT-SEQ-DUR-001` | temporary sequela decay duration | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `SURVIVAL`; DEEP | `DS-INJURY-RECOVERY` | temporary decay | sí/no/`PLANNED` |
| `CT-INJ-TAIL-001` | many injuries, repeats, extreme recovery, unusual severity-duration combos | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-INJURY-EXPOSURE`, `DS-INJURY-RECOVERY` | all health | sí/no/`PLANNED` |

### 4.5 Club, Competitions, Calendar y World

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-CLUB-INVARIANT-001` | bounded states, no identity floors, lagged updates | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | structural club paths | no/no/`MEASURABLE` |
| `CT-CLUB-BASE-001` | baseline uncertainty and fit for detailed clubs | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-CLUB-VERTICAL-SLICE` | initialState transforms | sí/no/`PLANNED` |
| `CT-CLUB-STRENGTH-001` | year-to-year attack/defense/control autocorrelation/distributions | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-CLUB-HISTORICAL-STRENGTH` | sporting AR models | sí/no/`PLANNED` |
| `CT-CLUB-PRESTIGE-001` | prestige persistence and lagged response | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-CLUB-VERTICAL-SLICE` | prestige process | sí + diseño/no/`PLANNED` |
| `CT-CLUB-FIN-001` | financial persistence/context correlation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-CLUB-FINANCIAL-REFERENCE` | finance/economy | sí/no/`PLANNED` |
| `CT-CLUB-STAB-001` | stability distribution/persistence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-CLUB-VERTICAL-SLICE` | stability | sí/no/`PLANNED` |
| `CT-MGR-TURN-001` | manager turnover and tenure distribution | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `SURVIVAL`; CALIBRATION | `DS-MANAGER-TENURE` | turnover hazard | sí/no/`PLANNED` |
| `CT-MGR-QUALITY-001` | manager quality/development influence distribution by club context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-MANAGER-TENURE`, `DS-CLUB-VERTICAL-SLICE` | manager generation | sí + diseño/no/`PLANNED` |
| `CT-TACTIC-001` | TacticalIdentity distribution/correlation and drift | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-CLUB-VERTICAL-SLICE` | tactical factor model | parcial/sí/`PLANNED` |
| `CT-PCOMP-001` | PositionCompetition stability/distribution by club/position | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-SQUAD-COMPETITION-PROXY` | positionCompetition | sí + diseño/no/`PLANNED` |
| `CT-CLUB-DEVQ-001` | DevelopmentQuality distribution/persistence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-CLUB-VERTICAL-SLICE` | institutional development | sí + proxy/no/`PLANNED` |
| `CT-CLUB-MEDQ-001` | MedicalQuality distribution/persistence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-CLUB-VERTICAL-SLICE` | institutional medical | sí + proxy/no/`PLANNED` |
| `CT-CAL-OPP-001` | TeamMinutesOpportunity/match equivalents by Q/competition | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `EXACT_SET` + `DIST_Q`; CALIBRATION | `DS-CALENDAR-SLICE` | definition bindings/calendar | sí/no/`PLANNED` |
| `CT-CAL-CONG-001` | congestion distribution and monotone exposure response | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-CALENDAR-SLICE` | congestion/health adapter | sí + diseño/no/`PLANNED` |
| `CT-CAL-PRESS-001` | pressureExposure by phase/stakes | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-CALENDAR-SLICE`, `DS-COMPETITION-CATALOG` | pressure profiles | parcial/sí/`PLANNED` |
| `CT-COMP-INVARIANT-001` | ranks valid, one champion, no future unearned exposure, eliminated no progress | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | structural competition policies | no/no/`MEASURABLE` |
| `CT-COMP-LEAGUE-001` | title concentration/rank volatility/upsets | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-COMPETITION-HISTORY` | league outcome | sí/no/`PLANNED` |
| `CT-COMP-CUP-001` | round advancement/upset distribution domestic/continental | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; DEEP | `DS-COMPETITION-HISTORY` | knockout/field winner | sí/no/`PLANNED` |
| `CT-COMP-FIELD-001` | CompetitionFieldStrength by definition/phase/era | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-COMPETITION-HISTORY` | field parameters | sí/no/`PLANNED` |
| `CT-COMP-CONTRIB-001` | player contribution sensitivity without absolute control | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `COND_FREQ`; DEEP | `DS-PERFORMANCE-REFERENCE`, `DS-COMPETITION-HISTORY` | contribution/outcome weights | parcial/sí/`PLANNED` |
| `CT-COMP-OUTCOME-001` | league/cup/continental outcome correlation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-COMPETITION-HISTORY` | shared/specific shocks | sí/no/`PLANNED` |
| `CT-WORLD-CYCLE-001` | regional/global cycle persistence | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `CORR`; DEEP | `DS-COMPETITION-HISTORY` | world cycles | parcial/sí/`PLANNED` |
| `CT-WORLD-LEAGUE-001` | LeagueCompetitiveStrength drift and international balance | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-COMPETITION-HISTORY` | leagueStrength | sí/no/`PLANNED` |
| `CT-WORLD-TAIL-001` | dominant eras, giant decline, small-club rise, extreme leagues/churn | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-COMPETITION-HISTORY` | all club/world | sí/no/`PLANNED` |

### 4.6 Transfers, Market y Contracts

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-MKT-VAL-001` | valuation distribution by age/position/context and between-club dispersion | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-TRANSFER-FEES`, `DS-MARKET-VALUATION-PROXY` | perception/valuation/age | sí/no/`PLANNED` |
| `CT-MKT-AGE-001` | smooth age-value response and veteran tails | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-TRANSFER-FEES` | ageValue | sí/no/`PLANNED` |
| `CT-MKT-SCAR-001` | scarcity effect on need/interest/fee/salary | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | `DS-SQUAD-COMPETITION-PROXY`, `DS-TRANSFER-FEES` | scarcity coefficients | sí/no/`PLANNED` |
| `CT-MKT-NEED-001` | ClubNeed distribution/persistence by club/position | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-SQUAD-COMPETITION-PROXY` | clubNeed | parcial/sí/`PLANNED` |
| `CT-MKT-FIT-001` | PlayerClubFit/opportunity sensitivity | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; CALIBRATION | `DS-TRANSFER-HISTORY` | fit/opportunity projection | sí + diseño/no/`PLANNED` |
| `CT-MKT-INT-001` | clubs interested per player, zero-interest, persistence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-TRANSFER-HISTORY` | interest | sí/no/`PLANNED` |
| `CT-MKT-OFFER-001` | interest→offer conversion by quality/need/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; CALIBRATION | `DS-TRANSFER-HISTORY` | offer/feasibility | sí/no/`PLANNED` |
| `CT-MKT-BID-001` | BidderCompetition distribution and impact | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-TRANSFER-HISTORY`, `DS-TRANSFER-FEES` | bidderCompetition | sí/no/`PLANNED` |
| `CT-MKT-FEAS-001` | financial power/terms→feasibility | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | `DS-CLUB-FINANCIAL-REFERENCE`, `DS-TRANSFER-FEES` | feasibility | sí/no/`PLANNED` |
| `CT-MKT-FEE-001` | fee distribution, fee/value ratio, bidding-war effect | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-TRANSFER-FEES`, `DS-CURRENCY-INFLATION` | fee/leverage/bidder factors | sí/no/`PLANNED` |
| `CT-MKT-SAL-001` | salary distribution and salary/value correlation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-SALARY-REFERENCE`, `DS-CURRENCY-INFLATION` | salary | sí/no/`PLANNED` |
| `CT-MKT-MONEY-001` | integer minor units, currency/date, representable-domain safety | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | `DS-CURRENCY-INFLATION` | monetary policies | sí/no/`MEASURABLE` |
| `CT-MKT-SELLER-001` | seller acceptance by offer/reservation context | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `COND_FREQ`; CALIBRATION | `DS-TRANSFER-HISTORY` | seller reservation/response | parcial/sí/`PLANNED` |
| `CT-CONTRACT-DUR-001` | contract duration distribution by age/value/operation | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-CONTRACT-REFERENCE` | duration utilities | sí/no/`PLANNED` |
| `CT-CONTRACT-EXPECT-001` | ContractExpectation distribution and fit | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `FREQ`; CALIBRATION | `DS-CONTRACT-REFERENCE` | expectation utilities | parcial/sí/`PLANNED` |
| `CT-MKT-RENEW-001` | renewal offer frequency | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-CONTRACT-REFERENCE` | renewal | sí/no/`PLANNED` |
| `CT-MKT-LOAN-001` | loan frequency/destination/terms | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-TRANSFER-HISTORY` | operation/loan | sí/no/`PLANNED` |
| `CT-MKT-NEG-001` | failed negotiation rate/repeated failures | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `FREQ`; DEEP | `DS-TRANSFER-HISTORY` | negotiation | parcial/sí/`PLANNED` |
| `CT-MKT-TRANS-001` | transfers per career/season, free/mid-season/level change | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; DEEP | `DS-TRANSFER-HISTORY` | all pipeline + DR-067 | sí/no/`PLANNED` |
| `CT-MKT-DECISION-001` | automatic offer choice/STAY policy | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `FREQ`; DEEP | — | playerUtility | no/sí/`PLANNED` |
| `CT-MKT-TAIL-001` | enormous fees, elite free agents, no offers, bidding wars, long inactivity | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | transfer datasets | all market | sí/no/`PLANNED` |

### 4.7 National Team y Awards

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-NT-CALL-001` | call-up/debut frequency by age/position/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-NATIONAL-SELECTION-HISTORY` | candidate/field/callUp | sí/no/`PLANNED` |
| `CT-NT-FIELD-001` | selection field location/scale/tail by generation/position | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-NATIONAL-SELECTION-HISTORY` | selectionField | sí/no/`PLANNED` |
| `CT-NT-INC-001` | incumbency persistence and omission after prior exposure | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `TRANSITION`; DEEP | `DS-NATIONAL-SELECTION-HISTORY` | incumbency | sí/no/`PLANNED` |
| `CT-NT-SQUAD-001` | callup→squad conversion where definition requires | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; CALIBRATION | `DS-NATIONAL-SELECTION-HISTORY`, `DS-COMPETITION-CATALOG` | squad model | sí/no/`PLANNED` |
| `CT-NT-MIN-001` | international minutes by role/position/window | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-NATIONAL-SELECTION-HISTORY`, `DS-CALENDAR-SLICE` | roleMinutes adapter | sí/no/`PLANNED` |
| `CT-NT-GEN-001` | generation-cycle persistence/rise/collapse | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-NATIONAL-SELECTION-HISTORY` | generation process | sí + diseño/no/`PLANNED` |
| `CT-NT-STRENGTH-001` | national attack/defense/control persistence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-NATIONAL-COMPETITION-HISTORY` | teamStrength | sí/no/`PLANNED` |
| `CT-NT-OUTCOME-001` | tournament success/progression/upsets | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; DEEP | `DS-NATIONAL-COMPETITION-HISTORY` | support/competition outcome | sí/no/`PLANNED` |
| `CT-NT-CONTRIB-001` | player contribution sensitivity without absolute outcome control | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | national/performance datasets | contribution adapter | sí/no/`PLANNED` |
| `CT-NT-TAIL-001` | young/old call-up, elite omission, breakout, long career | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-NATIONAL-SELECTION-HISTORY` | all National Team | sí/no/`PLANNED` |
| `CT-AWD-WIN-001` | nominations/placements/wins by award/age/position/era | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-AWARD-HISTORY` | candidate profiles/fields | sí/no/`PLANNED` |
| `CT-AWD-REPEAT-001` | repeat winners/concentration/droughts | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-AWARD-HISTORY` | field/history profiles | sí/no/`PLANNED` |
| `CT-AWD-POS-001` | GK/CM/ST representation by award family | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; DEEP | `DS-AWARD-HISTORY` | position mappings/profile weights | sí + diseño/sí para balance/`PLANNED` |
| `CT-AWD-PERF-001` | performance/achievement correlation for judged awards | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; DEEP | `DS-AWARD-HISTORY`, `DS-PERFORMANCE-REFERENCE` | feature transforms/weights | sí/no/`PLANNED` |
| `CT-AWD-STAT-001` | statistical leader distributions by competition/stat | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-AWARD-HISTORY`, `DS-PERFORMANCE-REFERENCE` | statistical field | sí/no/`PLANNED` |
| `CT-AWD-FIELD-001` | comparative field strength/outsider wins | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-AWARD-HISTORY` | comparative field | sí + diseño/no/`PLANNED` |
| `CT-AWD-MULTI-001` | compatible multiple-award seasons | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; DEEP | `DS-AWARD-HISTORY` | independent award profiles | sí/no/`PLANNED` |
| `CT-AWD-INVARIANT-001` | eligibility, ordinal coherence, tie policy, no anti-duplication | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | AwardDefinition bindings/algorithms | no/no/`MEASURABLE` |
| `CT-AWD-TAIL-001` | outsider/GK global/multiple majors/elite no award/statistical loss | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-AWARD-HISTORY` | all Awards | sí/no/`PLANNED` |

### 4.8 Reputation, Attention y Social

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-REP-INVARIANT-001` | distinct states, no CareerScore/capability writes, no same-window loop | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | structural reputation paths | no/no/`MEASURABLE` |
| `CT-REP-SPORT-001` | SportingReputation distribution/persistence/rise/decline by career phase | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; DEEP | `DS-REPUTATION-REFERENCE` | sporting dynamics/impulses | parcial/sí/`PLANNED` |
| `CT-REP-AWARE-001` | regional/global awareness distribution, lag and persistence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-SOCIAL-AUDIENCE-REFERENCE`, `DS-CLUB-VERTICAL-SLICE` | awareness/reach | sí + diseño/no/`PLANNED` |
| `CT-REP-SENT-001` | sentiment distribution/persistence and awareness joint distribution | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; DEEP | `DS-SOCIAL-ENGAGEMENT-REFERENCE` | sentiment | parcial/sí/`PLANNED` |
| `CT-REP-ATTN-001` | impulse size/decay/stacking/viral tails | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; CALIBRATION | `DS-PUBLIC-ATTENTION-REFERENCE` | attention/impulse profiles | parcial/sí/`PLANNED` |
| `CT-REP-REG-001` | home/current/global diffusion and transitions | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; DEEP | `DS-SOCIAL-AUDIENCE-REFERENCE` | regional/reach | parcial/sí/`PLANNED` |
| `CT-REP-CORR-001` | sporting↔awareness/sentiment/attention lagged correlations | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | reputation/social datasets | dynamics/shocks | sí/no/`PLANNED` |
| `CT-SOC-FOLLOW-001` | follower distribution, growth/decline, career trajectories | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-SOCIAL-AUDIENCE-REFERENCE` | acquisition/churn/viral | sí + diseño/no/`PLANNED` |
| `CT-SOC-ENG-001` | engagement rate persistence, audience-size/attention/sentiment effects | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; CALIBRATION | `DS-SOCIAL-ENGAGEMENT-REFERENCE` | engagement | sí + diseño/no/`PLANNED` |
| `CT-SOC-TAIL-001` | superstar/cult/negative famous/viral/loss/growth/scale extremes | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | social datasets | all reputationSocial | sí/no/`PLANNED` |
| `CT-SOC-STABILITY-001` | runaway growth, saturation, zero collapse, oscillation, overflow risk | `DIAGNOSTIC` | `NOT_APPLICABLE`; `TRACE` + `DIST_Q`; DEEP | — | all dynamics/numerical domains | no/sí outlier acceptance/`PLANNED` |

### 4.9 Retirement, Comeback y Finalization

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-RET-INVARIANT-001` | lifecycle transitions, no reopening, zero on-field retired, decision RNG=0 | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | structural lifecycle profiles | no/no/`MEASURABLE` |
| `CT-RET-MOT-001` | Motivation distribution/sensitivity | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; CALIBRATION | `DS-CAREER-RETIREMENT-HISTORY` | motivation/fulfillment | sí + diseño/no/`PLANNED` |
| `CT-RET-AGE-001` | retirement age and career duration by position/phase/context | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `SURVIVAL`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | age/hazard | sí/no/`PLANNED` |
| `CT-RET-CAUSE-001` | cause mix voluntary/health/market/other | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `FREQ`; CALIBRATION | `DS-CAREER-RETIREMENT-HISTORY` | cause hazards | sí + diseño/no/`PLANNED` |
| `CT-RET-SENS-001` | role/minutes/decline/health/free-agent sensitivity | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | motivation/decline/hazards | sí/no/`PLANNED` |
| `CT-RET-HEALTH-001` | health burden/history→retirement | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | retirement + injury datasets | health adapter/hazards | sí/no/`PLANNED` |
| `CT-RET-MARKET-001` | market opportunity→continuation | `DIAGNOSTIC` | `NOT_APPLICABLE`; `CORR`; DEEP | retirement + transfer datasets | market adapter/hazards | sí/no/`PLANNED` |
| `CT-CB-FREQ-001` | comeback frequency/age/retired duration/cycle count | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `SURVIVAL`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | comeback motivation/hazard | sí + diseño/sí/`PLANNED` |
| `CT-CB-ROUTE-001` | return opportunity/club level by route/prior level | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `COND_FREQ`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | market adapter/route hazards | sí + diseño/no/`PLANNED` |
| `CT-CB-SUCCESS-001` | post-return exposure/success/re-retirement | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | viability/comeback | sí + diseño/no/`PLANNED` |
| `CT-CB-CYCLE-001` | multiple retirement/comeback cycles | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | history/hazards | sí/no/`PLANNED` |
| `CT-FIN-TIME-001` | first retirement→finalization duration/opportunities/immediate and long tails | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `SURVIVAL`; DEEP | — | finalization opportunity/automation policy | no/sí/`PLANNED` |
| `CT-RET-TAIL-001` | very early/extreme career, late/immediate comeback, open retirement/nontermination | `DIAGNOSTIC` | `NOT_APPLICABLE`; `SURVIVAL`; DEEP | `DS-CAREER-RETIREMENT-HISTORY` | all retirement | sí + diseño/no/`PLANNED` |

### 4.10 Scoring y end-to-end

| Target ID | Métrica / segmentación | Tipo | Estado rango; método; tier | Dataset(s) | Parámetros principales | Evidencia / producto / estado |
|---|---|---|---|---|---|---|
| `CT-SCR-ARITH-001` | rational reduction, half cases, grouping equivalence | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | scoring arithmetic | no/no/`MEASURABLE` |
| `CT-SCR-PRI-001` | component bounds and total <=1000 | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | PRI maxima/policies | no/no/`MEASURABLE` |
| `CT-SCR-PRI-002` | PRI component/season/career distributions by GK/CM/ST/context/era | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-SCORING-PRI-COHORTS` | PRI transforms/cohorts | sí + diseño/no/`PLANNED` |
| `CT-SCR-PRI-003` | rank correlation PRI with contextual performance/evidence | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `CORR`; CALIBRATION | `DS-SCORING-PRI-COHORTS` | PRI profiles | sí/no/`PLANNED` |
| `CT-SCR-CC-001` | CC domain/zero behavior/monotonic expectation | `INVARIANT` | `DESIGN_EXACT`; `INV_RATE`; SMOKE | — | CC structural paths | no/no/`MEASURABLE` |
| `CT-SCR-CC-002` | CC distribution by participation/performance/competition; frequency >1 | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-SCORING-CONTRIBUTION-COHORTS` | CC transforms/cohorts | sí + diseño/no/`PLANNED` |
| `CT-SCR-ACH-001` | master examples, IJL separation and known values unchanged | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | `DS-SCORING-CATALOG` | achievements/IJL | sí/no/`MEASURABLE` |
| `CT-SCR-NAT-001` | national achievement mapping/composition | `CALIBRATION_TARGET` | `EVIDENCE_PENDING`; `DIST_Q`; DEEP | `DS-SCORING-CATALOG` | national catalog | sí + data/no/`PLANNED` |
| `CT-SCR-AWD-001` | equivalence reduction, league formulas, stacking | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | `DS-SCORING-CATALOG` | award catalog/equivalence | sí/no/`MEASURABLE` |
| `CT-SCR-REC-001` | record repeat/upgrade/shared and longevity semantics | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | `DS-SCORING-CATALOG` | record/longevity catalog | sí/no/`MEASURABLE` |
| `CT-SCR-POP-001` | social-signal→PBR relation/distribution/persistence | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; DEEP | `DS-SCORING-SOCIAL-COHORTS`, `DS-SOCIAL-AUDIENCE-REFERENCE` | popularity transforms | sí/sí/`PLANNED` |
| `CT-SCR-PBR-001` | subcaps and 5% cross-cap exact | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | PBR caps/order | no/no/`MEASURABLE` |
| `CT-SCR-PC-001` | total PC/category composition over Careers | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; DEEP | all gameplay + scoring datasets | all Scoring + upstream | parcial/sí/`PLANNED` |
| `CT-SCR-TIER-001` | narrative tier distribution/frequencies | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `FREQ`; DEEP | — | tier boundaries + all scoring | no/sí/`PLANNED` |
| `CT-SCR-COMPAT-001` | compatibility mismatch rejects direct comparison | `INVARIANT` | `DESIGN_EXACT`; `EXACT_SET`; SMOKE | — | compatibility policy | no/no/`MEASURABLE` |
| `CT-SCR-REPLAY-001` | incremental/full recomputation byte-equal ledger/digest | `INVARIANT` | `DESIGN_EXACT`; `TRACE`; SMOKE | — | scoring identities/rules | no/no/`MEASURABLE` |
| `CT-E2E-CAREER-001` | complete career distributions and cross-system stability | `CALIBRATION_TARGET` | `PRODUCT_DECISION_PENDING`; `DIST_Q`; DEEP | all accepted datasets | all gameplay parameters | sí/sí/`PLANNED` |
| `CT-E2E-TAIL-001` | P99/P99.9 and rare coherent career paths without caps | `DIAGNOSTIC` | `NOT_APPLICABLE`; `DIST_Q`; DEEP | all accepted datasets | all parameters | sí/sí outlier acceptance/`PLANNED` |
| `CT-E2E-TERM-001` | pathological nontermination/right-censoring and guard separation | `DIAGNOSTIC` | `NOT_APPLICABLE`; `SURVIVAL`; DEEP | — | retirement + automation tooling | no/sí/`PLANNED` |

## 5. Deduplicaciones y aliases

| Alias/origen | Target canónico | Razón |
|---|---|---|
| “performance goals per 90”, “market production correlation” y “scoring ST production context” | `CT-ST-GOAL-001` como distribución upstream; Market/Scoring conservan `CT-MKT-VAL-001`/`CT-SCR-PRI-003` como relaciones downstream distintas. | Misma métrica base, distintos acceptance questions; no se fusionan correlations causales. |
| “minutes/year” y “actualMinutes quantiles” | `CT-MIN-ACTUAL-001` | Una distribución con agregaciones Q/season. |
| “role persistence” y “role transition matrix” | `CT-ROLE-TRANS-001` | La persistencia es diagonal de la misma matriz. |
| “injuries/season” e “injuries/career” | `CT-INJ-FREQ-001` | Una rate family con distintos aggregation scopes. |
| “retirement age” y “career duration” | `CT-RET-AGE-001` | Misma survival cohort, se reportan ambas variables. |
| “award concentration”, “repeat winners”, “award droughts” | `CT-AWD-REPEAT-001` | Mismo proceso longitudinal; no duplica winners. |
| “PC distribution” y “category composition” | `CT-SCR-PC-001` | Mismo ledger projection, dos outputs obligatorios. |

## 6. Reglas de aceptación

1. `INVARIANT`: cero violaciones; una sola violación bloquea Gate 1/7.
2. `CALIBRATION_TARGET`: cada segmento obligatorio debe caer en su intervalo o
   tolerancia publicada; faltantes no se promedian con segmentos que pasan.
3. `DIAGNOSTIC`: no bloquea por sí mismo, pero un patrón patológico documentado
   puede abrir un gate issue; nunca se convierte silenciosamente en target.
4. Comparaciones de candidatos usan el mismo `CalibrationSeedSet`.
5. Un target no puede alcanzar `ACCEPTED` sin hashes de dataset/run/report.
6. Si un target necesita evidencia y producto, ambos se registran; uno no
   sustituye al otro.

## 7. Referencias

- [Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md)
- [Calibration Dataset Registry](CALIBRATION_DATASET_REGISTRY.md)
- [Golden Vector Registry](GOLDEN_VECTOR_REGISTRY.md)
- [Contrato matemático y de calibración](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- Todos los documentos `*_MATH_SPEC.md` de G3C.

## 8. Evidence y product bindings G3D-2

Las 186 rows conservan ID. Los patterns siguientes actualizan sus dependencies
sin duplicarlas:

| Target patterns | Evidence/data binding | Product decision | Acceptance status G3D-2 |
|---|---|---|---|
| `CT-CRE-*`, `CT-DEV-*` | player creation/trait/foot/position/development datasets | `PD-G3D-008` para equivalence | observable mixto; ranges pending |
| `CT-ROLE-*`, `CT-MIN-*`, `CT-APP-*`, `CT-START-*` | role/minutes + calendar + registration | `PD-G3D-005/006` | evidence pending |
| `CT-PERF-*`, `CT-ST-*`, `CT-CM-*`, `CT-GK-*`, `CT-PROD-*` | performance/exposure/pressure + club context | tail policy `PD-G3D-013` | evidence pending |
| `CT-HLT-*`, `CT-INJ-*`, `CT-REC-*`, `CT-REL-*`, `CT-SEQ-*` | injury exposure/recovery + taxonomy/calendar | injury scope validation | evidence pending |
| `CT-CLUB-*`, `CT-MGR-*`, `CT-TACTIC-*`, `CT-PCOMP-*` | club bundle/history/finance/manager/squad | `PD-G3D-001/002/003` | evidence pending |
| `CT-CAL-*`, `CT-COMP-*`, `CT-WORLD-*` | competition/calendar/history catalogs | `PD-G3D-003/005/006` | catalog data pending |
| `CT-MKT-*`, `CT-CONTRACT-*` | transfer/money/contract/external pool | `PD-G3D-003/004/005/006` | evidence pending |
| `CT-NT-*` | national definitions/history/calendar | `PD-G3D-007` | data pending; policy resolved |
| `CT-AWD-*` | five AwardDefinitions + award/performance history | award scope freeze | evidence pending |
| `CT-REP-*`, `CT-SOC-*` | reach/social/reputation/attention datasets | `PD-G3D-010/013` | observable + product ranges |
| `CT-RET-*`, `CT-CB-*`, `CT-FIN-*` | retirement history + health/market adapters | `PD-G3D-011/012/013` | evidence/product ranges pending |
| `CT-SCR-*` | scoring catalogs/cohorts | `PD-G3D-009/010/015` | Gate 6 data/product pending |
| `CT-E2E-*` | all accepted artifacts | all scope/tail decisions | last causal gate |

Evidence tier mínimo es el definido por cada DatasetDefinition. Invariants
siguen normativos y no se convierten en observacionales. Targets sin verdad
externa suficiente se etiquetan `SYNTHETIC` o `PRODUCT`, nunca
`EXTERNAL_OBSERVATION`.

### 8.1 Segmentation freeze

Los segmentos obligatorios del slice son GK/CM/ST, ARG/ESP y los contextos de
competición/edad/role definidos por cada row. Club segmentation usa `clubId`
solo para 16 detailed/materialized identities; fields abstractos se agregan por
region/tier y no aparecen como clubs observados. Season/edition siempre se
vincula al baseline manifest.

### 8.2 Product-dependent acceptance

`CT-CRE-EQUIV-001`, `CT-SCR-TIER-001`, `CT-SCR-POP-001`,
`CT-CB-FREQ-001`, `CT-FIN-TIME-001` y tail diagnostics quedan
`RULE_PENDING` hasta publicar tolerancias/rangos. Su métrica y aggregation ya
están cerradas por `G3D_PRODUCT_DECISIONS.md`.

## 9. Tolerance-source gate G3D-3A

Cada una de las 186 rows obtiene `toleranceSourceGate` mediante su `targetType`
y las columnas External/Product ya registradas. No se asignan rangos.

| Gate | Regla |
|---|---|
| `NORMATIVE_INVARIANT` | `INVARIANT`: aceptación proviene de matemática/spec; no espera evidencia observada ni product range. |
| `OBSERVED_EVIDENCE_REQUIRED` | `CALIBRATION_TARGET` con external evidence `sí` y product decision `no`. |
| `PRODUCT_NUMERIC_DECISION_REQUIRED` | `CALIBRATION_TARGET` con external `no` y product `sí`. |
| `EVIDENCE_AND_PRODUCT_REQUIRED` | `CALIBRATION_TARGET` con ambos `sí`; evidencia informa, producto elige tradeoff/tolerance. |
| `DIAGNOSTIC_NO_ACCEPTANCE_RANGE` | `DIAGNOSTIC`: se recolecta/reportan métricas, pero no falla un candidate salvo promoción/versionada a target. |

Si una row declara evidence/product `conditional`, el gate conserva la
condición en vez de promoverla silenciosamente. Cambiar el gate requiere update
del registry y rationale.

### 9.1 Binding por familias

| Target patterns | Tolerance source gate dominante | Prerequisite |
|---|---|---|
| `CT-CRE-CAP/TRAIT/FOOT/CORR/POWER/SUIT-*`, `CT-DEV-*` observacionales | `OBSERVED_EVIDENCE_REQUIRED` | player/development datasets normalizados; window statistical validation |
| `CT-CRE-EQUIV-*` | `EVIDENCE_AND_PRODUCT_REQUIRED` | cohort baseline + `PD-G3D-008` tolerances en G3D-3D |
| `CT-ROLE-*`, `CT-MIN-*`, `CT-APP-*`, `CT-START-*` | `OBSERVED_EVIDENCE_REQUIRED` salvo design constraints | Calendar/Competition + exposure datasets |
| `CT-PERF-*`, `CT-ST-*`, `CT-CM-*`, `CT-GK-*`, `CT-PROD-*` | `OBSERVED_EVIDENCE_REQUIRED`; tails son diagnostics hasta rango aprobado | position/context/exposure evidence |
| `CT-HLT-*`, `CT-INJ-*`, `CT-REC-*`, `CT-REL-*`, `CT-SEQ-*` | `OBSERVED_EVIDENCE_REQUIRED`; taxonomy scope puede requerir Product | exposure/recovery datasets + six definitions |
| `CT-CLUB-*`, `CT-MGR-*`, `CT-TACTIC-*`, `CT-PCOMP-*` | `EVIDENCE_AND_PRODUCT_REQUIRED` para proxies; observed para outcomes | club portfolio/definitions + proxy construct approval |
| `CT-CAL-*`, `CT-COMP-*`, `CT-WORLD-*` | facts/invariants `NORMATIVE_INVARIANT`; distributions `OBSERVED_EVIDENCE_REQUIRED` | P0 formats/calendar then histories |
| `CT-MKT-*`, `CT-CONTRACT-*` | `OBSERVED_EVIDENCE_REQUIRED`; unpublished terms may use explicit Product fallback | P0 money/windows + P1 transaction datasets |
| `CT-NT-*`, `CT-AWD-*` | `OBSERVED_EVIDENCE_REQUIRED`; scope/tail targets may be `EVIDENCE_AND_PRODUCT_REQUIRED` | P0 definitions, P1 histories |
| `CT-REP-*`, `CT-SOC-*` | `EVIDENCE_AND_PRODUCT_REQUIRED` | platform/construct evidence + product balance |
| `CT-RET-*` | `OBSERVED_EVIDENCE_REQUIRED` | longitudinal retirement dataset |
| `CT-CB-*`, `CT-FIN-*` frequency/timing | `EVIDENCE_AND_PRODUCT_REQUIRED` | observed careers + `PD-G3D-011/012` numeric targets |
| `CT-SCR-PRI/CC/ACH/NAT/AWD/REC-*` | `OBSERVED_EVIDENCE_REQUIRED` o normative catalog según row | frozen scoring datasets/catalog |
| `CT-SCR-TIER/POP/PC-*` | `EVIDENCE_AND_PRODUCT_REQUIRED` | end-to-end evidence + `PD-G3D-009/010` |
| `CT-E2E-*` | combinación heredada; acceptance solo tras upstream gates | todos los artifacts aceptados |

### 9.2 Product numeric blockers

Continúan sin tolerance:

- Quick/Custom equivalence (`PD-G3D-008`);
- high-tier rarity profile (`PD-G3D-009`, `BALANCED` recomendado);
- social contribution balance (`PD-G3D-010`);
- comeback/finalization frequencies (`PD-G3D-011/012`);
- sample/privacy ranges para claims públicos (`PD-G3D-014`, DR-035).

`PRODUCT_OWNER` aprueba esos números en G3D-3D, informado por sensitivity de
`CALIBRATION_OWNER`/`SCORING_OWNER`. Ninguno se presenta como external fact.

Conteo después de G3D-3A: **186 target IDs**, sin aliases nuevos ni tolerancias
inventadas.

## 10. Referencias G3D-3A

- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D Product Decisions](G3D_PRODUCT_DECISIONS.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)

## 11. Catalog dependency overlay G3D-3C

Los 186 target IDs y sus tolerance gates permanecen invariantes. Ningún rango,
tolerance ni observed value fue asignado.

| Target families | Catalog state after G3D-3C | Remaining prerequisite |
|---|---|---|
| `CT-CAL-*`, `CT-COMP-*` | `CATALOG_BOUND_WITH_LIMITATIONS` | exact partial cup/Argentina annual/calendar fields plus P1 histories |
| `CT-CLUB-*`, `CT-MGR-*`, `CT-TACTIC-*`, `CT-PCOMP-*` | `IDENTITY_CATALOG_BOUND` | all causal club baselines and longitudinal evidence |
| `CT-ROLE-*`, `CT-MIN-*`, `CT-APP-*`, `CT-START-*` | `CALENDAR_CANDIDATE_BOUND` | exact opportunity evidence and P1 role/minutes observations |
| `CT-PERF-*`, `CT-ST-*`, `CT-CM-*`, `CT-GK-*` | `CONTEXT_IDENTITY_BOUND` | performance/exposure and club-environment evidence |
| `CT-MKT-*`, `CT-CONTRACT-*` | `CURRENCY_AND_MARKET_BOUND_WITH_LIMITATIONS` | monetary series, external materialization and P1 transactions |
| `CT-NT-*` | `NT_IDENTITY_AND_MAJOR_CONTEXT_BOUND` | ordinary windows, histories and observed selection evidence |
| `CT-AWD-*` | `FIVE_IDENTITIES_BOUND_DEFINITIONS_PARTIAL` | `GAP-P0-AWD-001..003` plus histories |
| `CT-SCR-*` | `SCORING_IDENTITY_SUBSET_BOUND` | IJL/config/catalog gaps and scoring cohorts |
| other target families | `UNCHANGED` | their G3D-3A/P1/P2/P3 dependencies |

`CATALOG_BOUND` only resolves join identity. It does not satisfy
`OBSERVED_EVIDENCE_REQUIRED`, `PRODUCT_NUMERIC_DECISION_REQUIRED` or
`EVIDENCE_AND_PRODUCT_REQUIRED`. G3D-3D remains owner of numeric product
tolerances.

## 12. Product numeric target overlay G3D-3D

Fuente normativa:
[G3D Product Calibration Targets](G3D_PRODUCT_CALIBRATION_TARGETS.md).
Los 186 target IDs permanecen canónicos; `PT-*` son subtargets de producto y no
duplican `CalibrationTargetDefinition`.

### 12.1 Clasificación exhaustiva

Se aplica una sola clase G3D-3D por target, con esta precedencia:

1. `INVARIANT` → `INVARIANT_ONLY`;
2. `DIAGNOSTIC` → `DIAGNOSTIC_DEFINED`, incluso si G3D-3D añade review bands;
3. IDs de §12.2 → `PRODUCT_NUMERIC_DEFINED`;
4. `CALIBRATION_TARGET` con `EVIDENCE_PENDING` restante →
   `OBSERVATIONAL_PENDING`;
5. `CALIBRATION_TARGET` con `PRODUCT_DECISION_PENDING` restante →
   `CALIBRATION_PENDING_DATA`.

| Clase G3D-3D | Count | Semántica actual |
|---|---:|---|
| `INVARIANT_ONLY` | 28 | exacto por spec; cero violaciones |
| `DIAGNOSTIC_DEFINED` | 29 | métrica y review semantics definidas; no acceptance observado inventado |
| `PRODUCT_NUMERIC_DEFINED` | 18 | consume uno o más `PT-*`; ejecución/calibración pendiente |
| `OBSERVATIONAL_PENDING` | 89 | necesita P1/P2 evidence/transform antes de rango observado |
| `CALIBRATION_PENDING_DATA` | 22 | direction/shape existe, pero un número aislado sin evidence/sensitivity sería falso |
| **Total** | **186** | cero IDs nuevos o duplicados |

### 12.2 Targets con números de producto

```text
CT-CRE-EQUIV-001
CT-MKT-OFFER-001
CT-MKT-TRANS-001
CT-NT-CALL-001
CT-NT-MIN-001
CT-AWD-WIN-001
CT-AWD-REPEAT-001
CT-AWD-MULTI-001
CT-REP-ATTN-001
CT-SOC-FOLLOW-001
CT-RET-AGE-001
CT-CB-FREQ-001
CT-CB-SUCCESS-001
CT-FIN-TIME-001
CT-SCR-POP-001
CT-SCR-PC-001
CT-SCR-TIER-001
CT-E2E-CAREER-001
```

Sus métricas, denominadores, PASS/warning/failure bands, sample tier, owners y
parameter-family consumers están en las filas `PT-*`. Si además requieren
evidence, `PRODUCT_NUMERIC_DEFINED` no implica `EVIDENCE_READY`, `ACCEPTED` ni
`FROZEN_V1` del CalibrationTarget.

### 12.3 Mixed targets sin número aislado

Los 22 siguientes dejan de significar “Producto debe inventar una cifra”. Se
clasifican `CALIBRATION_PENDING_DATA`: P1 y sensitivity deben establecer una
escala interpretable antes de que Product acepte una banda.

```text
CT-CRE-POS-001
CT-CRE-POWER-001
CT-DEV-RETRAIN-001
CT-ROLE-SENS-001
CT-MIN-SENS-001
CT-PERF-CONS-001
CT-PERF-EVID-001
CT-PERF-FORM-001
CT-HLT-FAT-001
CT-HLT-FIT-001
CT-TACTIC-001
CT-CAL-PRESS-001
CT-COMP-CONTRIB-001
CT-WORLD-CYCLE-001
CT-MKT-NEED-001
CT-MKT-SELLER-001
CT-CONTRACT-EXPECT-001
CT-MKT-NEG-001
CT-MKT-DECISION-001
CT-REP-SPORT-001
CT-REP-SENT-001
CT-REP-REG-001
```

No son product gaps de G3D-3D: su gate correcto es data/sensitivity. Un futuro
rango conserva source classification y no puede presentarse como observado si
es finalmente sintético.

### 12.4 Alias corregido

La descripción histórica “social-signal→PRL” de `CT-SCR-POP-001` era un alias
semántico incorrecto. La identidad canónica no cambia; la métrica correcta es
social-signal→`PBR`, conforme a ADR-080 y `SCORING_MATH_SPEC.md`. No se crea
otro target.

### 12.5 Acceptance state

- product ranges: `NUMERIC_TARGET_DEFINED`, no `ACCEPTED_V1`;
- invariants: `MEASURABLE`, pendientes de ejecución;
- observed targets: permanecen pendientes de datasets;
- ningún target alcanza `VALIDATED`, `ACCEPTED` o `FROZEN_V1` sin run/report
  hashes;
- `PASS|PASS_WITH_WARNING|FAIL` y uncertainty policy se heredan del target set.

## 13. Definition/data-readiness overlay G3D-3B2

No target ID, product value, tolerance or status count changes. The 186 targets
retain the exhaustive G3D-3D classification. Only dependency metadata advances:

| Target families | Readiness metadata | Still required |
|---|---|---|
| `CT-AWD-*` | `DEFINITION_AVAILABLE=TRUE`; five AwardDefinition candidates consumer-complete | P1 award histories, calibrated field profiles/parameters and Monte Carlo |
| `CT-CAL-*`, `CT-NT-*` that consume ordinary windows | `DEFINITION_AVAILABLE=TRUE`; `OBSERVATIONAL_DEPENDENCY_CLEARED=P0_CALENDAR` | P1 national histories and calibrated exposure/pressure values |
| money-dependent `CT-MKT-*` | `DATA_AVAILABLE=P0_SOURCE_SERIES_ACQUIRED`; exact transform available | P1 fee/salary observations and normalized monetary artifact |

`DATA_AVAILABLE` never supplies an observed target range. Product numeric
targets from G3D-3D are immutable in this phase.

## 14. P1 observational-readiness overlay G3D-4A

No target ID, type, product number or acceptance tolerance changes. The 186
targets and all 77 `PT-*` values remain intact. This overlay adds only the
allowed P1 evidence state.

| Evidence state | Target IDs | Meaning after G3D-4A |
|---|---|---|
| `CALIBRATION_READY` | `CT-MIN-ACTUAL-001`, `CT-MIN-SHARE-001`, `CT-MIN-ZERO-001`, `CT-APP-DIST-001`, `CT-START-DIST-001`, `CT-ST-GOAL-001`, `CT-ST-AST-001`, `CT-CM-COUNT-001` | directly summarized for Spain/multileague; later estimation must preserve context/license and cannot set acceptance from this row alone |
| `OBSERVATIONAL_SUMMARY_AVAILABLE` | `CT-CRE-DOMPOS-001`, `CT-CRE-POS-001`, `CT-CRE-TAIL-001`, `CT-DEV-CUM-001`, `CT-DEV-DELTA-001`, `CT-DEV-EXPOSURE-001`, `CT-DEV-PEAK-001`, `CT-DEV-TAIL-001`, `CT-ROLE-COMP-001`, `CT-ROLE-FREQ-001`, `CT-ROLE-TRANS-001`, `CT-MIN-CORR-001`, `CT-MIN-POS-001`, `CT-MIN-TAIL-001`, `CT-PERF-CONS-001`, `CT-PERF-CORR-001`, `CT-PERF-DIST-001`, `CT-PERF-EVID-001`, `CT-PERF-FORM-001`, `CT-PERF-SUM-001`, `CT-PERF-TAIL-001`, `CT-PERF-TASK-001`, `CT-ST-CONV-001`, `CT-ST-CORR-001`, `CT-CM-IMPACT-001`, `CT-GK-CS-001`, `CT-GK-SAVE-001`, `CT-GK-SHOTS-001` | empirical proxy/shape/association exists, but latent or task-factor separation remains joint and Argentina/direct-license gaps apply |
| `OBSERVATIONAL_EVIDENCE_ACQUIRED` | `CT-CRE-CAP-001`, `CT-CRE-CORR-001`, `CT-CRE-POWER-001`, `CT-CRE-SUIT-001`, `CT-CRE-TRAIT-001`, `CT-DEV-CORR-001`, `CT-DEV-FAMILY-001`, `CT-DEV-SIGN-001`, `CT-ROLE-SENS-001`, `CT-MIN-CONTEXT-001`, `CT-MIN-SENS-001`, `CT-PERF-X-001` | evidence constrains the family indirectly; no direct observed target or parameter value is available |
| `STILL_BLOCKED` | `CT-CRE-FOOT-001`, `CT-DEV-ENV-001`, `CT-DEV-RETRAIN-001`, `CT-PERF-PRESS-001`, `CT-PERF-SURPRISE-001` | no adequate G3D-4A source/summary; state does not imply mathematical incompleteness |

`CT-CRE-EQUIV-001` and `CT-APP-INVARIANT-001` retain their G3D-3D product/
invariant classifications. P1 evidence may become their fixtures later, but does
not modify their numeric product contract. Geographic metadata is
`SPAIN_DIRECT`, `ARGENTINA_DIRECT_LIMITED`, and `MULTI_LEAGUE_REFERENCE`; the
aggregate must never hide the Argentina gap.

## 15. P1 Health observational-readiness overlay G3D-4B

No target ID, type, product number, acceptance tolerance or denominator changes.
The registry remains 186 targets and all 77 `PT-*` values remain byte-for-byte
outside this Health overlay.

| Evidence state | Target IDs | Meaning after G3D-4B |
|---|---|---|
| `CALIBRATION_READY` | `CT-INJ-FREQ-001`, `CT-INJ-MIX-001`, `CT-INJ-SEV-001`, `CT-REC-DUR-001` | multiple professional player-hour cohorts and family/duration shapes support initial observational estimation; definition, context, licensing and mixture controls remain mandatory |
| `OBSERVATIONAL_SUMMARY_AVAILABLE` | `CT-INJ-LOAD-001`, `CT-INJ-AVAIL-001`, `CT-INJ-HIST-001`, `CT-REL-FREQ-001`, `CT-REL-DECAY-001`, `CT-INJ-TAIL-001` | empirical associations, return endpoints, history/recurrence and tails exist; latent separation or continuous-decay fit remains joint |
| `OBSERVATIONAL_EVIDENCE_ACQUIRED` | `CT-HLT-LOAD-001`, `CT-HLT-FAT-001`, `CT-HLT-FIT-001`, `CT-REC-SENS-001`, `CT-SEQ-FREQ-001`, `CT-SEQ-MIX-001`, `CT-SEQ-BURDEN-001`, `CT-SEQ-DUR-001` | evidence constrains direction/diagnostics only; no direct observed target or causal parameter is identified |
| unchanged invariant | `CT-HLT-INVARIANT-001` | mathematical/invariant acceptance remains spec-derived and does not require an observed range |

Source quality is `TIER_A` for definition contracts and predominantly `TIER_B`
for observational summaries, with one `TIER_C` methodological caution. Geography
is `ARGENTINA_DIRECT_LIMITED`, `SPAIN_DIRECT_LIMITED` and
`MULTI_LEAGUE_REFERENCE`. GK has direct position evidence; CM/ST retain
`POSITION_MAPPING_LIMITATION`. Epidemiological rates do not replace the G3D-3D
product guardrails.

## 16. P1 Club/Market observational-readiness overlay G3D-4C

No target ID, type, product number, denominator or acceptance tolerance changes.
The registry remains **186 targets** and all **77 `PT-*`** values are unchanged.

| Evidence state | Target IDs | Meaning after G3D-4C |
|---|---|---|
| `CALIBRATION_READY` | `CT-MKT-AGE-001` | strict GK/CM/ST movement-age summaries support an initial observation model; transfer selection/context remains joint |
| `OBSERVATIONAL_SUMMARY_AVAILABLE` | `CT-CLUB-STRENGTH-001`, `CT-MGR-TURN-001`, `CT-TACTIC-001`, `CT-PCOMP-001`, `CT-MKT-VAL-001`, `CT-MKT-FEE-001`, `CT-MKT-TRANS-001`, `CT-MKT-TAIL-001`, `CT-CONTRACT-DUR-001`, `CT-MKT-LOAN-001` | direct summaries/tails exist, but geography, source definition, at-risk denominator, latent mapping or licensing prevents blind copying |
| `OBSERVATIONAL_EVIDENCE_ACQUIRED` | `CT-CLUB-BASE-001`, `CT-CLUB-PRESTIGE-001`, `CT-CLUB-FIN-001`, `CT-CLUB-STAB-001`, `CT-MGR-QUALITY-001`, `CT-CLUB-DEVQ-001`, `CT-CLUB-MEDQ-001`, `CT-WORLD-LEAGUE-001`, `CT-WORLD-TAIL-001`, `CT-MKT-SCAR-001`, `CT-MKT-NEED-001`, `CT-MKT-FIT-001`, `CT-MKT-FEAS-001`, `CT-MKT-SAL-001`, `CT-MKT-MONEY-001`, `CT-CONTRACT-EXPECT-001` | evidence constrains inputs/diagnostics; causal latent separation remains joint/weak |
| `OBSERVATIONAL_SOURCE_IDENTIFIED` | `CT-MKT-INT-001`, `CT-MKT-OFFER-001`, `CT-MKT-BID-001`, `CT-MKT-SELLER-001`, `CT-MKT-RENEW-001`, `CT-MKT-NEG-001`, `CT-MKT-DECISION-001` | source routes demonstrate observability limits; candidate/offer/rejection/expiry-risk denominators are absent |
| unchanged invariant/structural | `CT-CLUB-INVARIANT-001` | mathematical/structural acceptance remains spec-derived; `CT-MKT-MONEY-001` above remains the Market Money invariant |

The 35 IDs above are the complete G3D-4C overlay. A zero-coded fee is not a
free move, Squad Cost Limit is not wages, and Spain position evidence cannot
claim Argentina coverage.

## 17. P1 National Team/Awards observational-readiness overlay G3D-4D

No target ID, type, product number, denominator or acceptance tolerance changes.
The registry remains **186 targets** and all **77 `PT-*`** values are unchanged.

| Evidence state | Target IDs | Meaning after G3D-4D |
|---|---|---|
| `CALIBRATION_READY` | `CT-NT-MIN-001`, `CT-NT-OUTCOME-001`, `CT-AWD-REPEAT-001` | strict-position international exposure, context-tagged outcome history and official repeat-winner series support an initial observational component; candidate parameters remain unpublished |
| `OBSERVATIONAL_SUMMARY_AVAILABLE` | `CT-NT-CALL-001`, `CT-NT-INC-001`, `CT-NT-SQUAD-001`, `CT-NT-STRENGTH-001`, `CT-NT-GEN-001`, `CT-NT-TAIL-001`, `CT-AWD-WIN-001`, `CT-AWD-POS-001`, `CT-AWD-PERF-001`, `CT-AWD-STAT-001`, `CT-AWD-FIELD-001`, `CT-AWD-TAIL-001` | direct summaries/tails exist, but selected-only bias, context, latent mapping, small-N or source freeze limits prevent blind copying |
| `OBSERVATIONAL_EVIDENCE_ACQUIRED` | `CT-NT-FIELD-001`, `CT-NT-CONTRIB-001`, `CT-AWD-MULTI-001` | field scale, contribution and compatible-award association are constrained indirectly; joint upstream Performance/Reputation calibration remains required |
| unchanged structural/invariant | `CT-AWD-INVARIANT-001` | eligibility, family separation and ordinal coherence remain spec-derived; no observed range is needed |

The call-up target does **not** gain an absolute observed probability: the
plausible non-selected field is incomplete. Award histories never modify PPI,
PSN or any `PT-*` target. `CT-AWD-STAT-001` retains a full-field/multi-season
data gate despite two direct upper-tail editions.

## 18. P1 Reputation/Social/Retirement observational-readiness overlay G3D-4E

No target ID, type, product number, denominator or acceptance tolerance changes.
The registry remains **186 targets** and all **77 `PT-*`** values are unchanged.

| Evidence state | Target IDs | Meaning after G3D-4E |
|---|---|---|
| `CALIBRATION_READY` | `CT-RET-AGE-001` | censored multi-cohort age/duration shapes support an initial observational component; geography, start definition and position adapters remain mandatory |
| `OBSERVATIONAL_SUMMARY_AVAILABLE` | `CT-REP-ATTN-001`, `CT-SOC-FOLLOW-001`, `CT-SOC-ENG-001`, `CT-SOC-TAIL-001`, `CT-RET-CAUSE-001`, `CT-RET-TAIL-001`, `CT-CB-ROUTE-001`, `CT-CB-SUCCESS-001` | dated platform/event and career/return summaries exist, but selected samples, incompatible definitions or missing denominators prevent blind copying |
| `OBSERVATIONAL_EVIDENCE_ACQUIRED` | `CT-REP-SPORT-001`, `CT-REP-AWARE-001`, `CT-REP-REG-001`, `CT-REP-CORR-001`, `CT-RET-MOT-001`, `CT-RET-SENS-001`, `CT-RET-HEALTH-001`, `CT-RET-MARKET-001` | proxy directions/context are observed; latent and causal separation remains joint or weak |
| `STILL_BLOCKED` | `CT-REP-SENT-001`, `CT-CB-FREQ-001`, `CT-CB-CYCLE-001`, `CT-FIN-TIME-001` | no comparable sentiment construct, representative comeback/multiple-cycle denominator or real-world manual-finalization event exists |
| unchanged invariant/diagnostic | `CT-REP-INVARIANT-001`, `CT-SOC-STABILITY-001`, `CT-RET-INVARIANT-001` | mathematics/replay/overflow/lifecycle acceptance remains spec-derived; no observed range is required |

`OBSERVATIONAL_REFERENCE_VS_PRODUCT_TARGET` is recorded where real-world
evidence could later disagree with comeback, social-decline or finalization
preferences. It never overwrites a `PT-*` value. `CT-FIN-TIME-001` remains
Product Defined even though elapsed time without a return may inform
ContinuationViability.
