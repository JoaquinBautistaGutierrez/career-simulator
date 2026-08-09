# G3C-11 — Scoring Mathematical Specification

Status: **NORMATIVE — MATHEMATICAL CLOSURE**  
Scope: competitive scoring, score ledger, score snapshots and narrative tiers  
Package implementation: **out of scope**  
Normative decision: [ADR-080](adr/080-exact-scoring-mathematics.md)

## 1. Purpose and authority

This document closes the mathematical contract for competitive scoring. It is subordinate to approved point values in `MASTER_SPEC.docx` and to the domain, lifecycle and version boundaries already accepted by ADR-009, ADR-010, ADR-015, ADR-016, ADR-050, ADR-051, ADR-070, ADR-073, ADR-075, ADR-077, ADR-078 and ADR-079.

Scoring is a pure deterministic projection:

```text
closed authorized DomainFacts
+ ScoringConfiguration
+ ScoringCalibrationData
-> canonical ScoreLedger
-> category subtotals
-> exact integer PC
-> ScoreSnapshot
```

It never samples randomness, never reads gameplay PRNG streams and never changes facts, gameplay state, awards or achievements. Content cannot create scoring rules or ledger entries.

The canonical score remains:

```text
PC = PRI + PTC_CLUB + PPI + PSN + PRL + PBR
```

No seventh category is authorized.

## 2. Mathematical notation and exact arithmetic

### 2.1 `ScoreRational`

All non-integer scoring intermediates use exact reduced rational arithmetic:

```text
ScoreRational = (numerator: signed arbitrary-precision integer,
                 denominator: positive arbitrary-precision integer)
```

The pair is canonical when `gcd(abs(numerator), denominator) = 1`, the denominator is positive, and zero is serialized only as `0/1`. Decimal configuration literals are parsed as base-10 rationals; binary IEEE-754 values are forbidden in a scoring calculation. Canonical serialization uses decimal strings for numerator and denominator.

Addition, subtraction, multiplication, division, comparison, `min` and `max` operate on reduced rationals with checked denominators. A zero denominator, arithmetic overflow in a bounded implementation, non-canonical value or missing operand invalidates the scoring projection; it must never be repaired by a gameplay cap.

### 2.2 `ROUND_HALF_UP`

Every final ledger amount is an integer. For a non-negative reduced rational `n/d`:

```text
q = floor(n / d)
r = n mod d

ROUND_HALF_UP(n/d) =
  q + 1, when 2r >= d
  q,     otherwise
```

Scoring inputs and entitlements are non-negative. A `REVERSAL` stores a non-negative absolute amount and obtains its sign from `entryKind`; the rounding rule is therefore never applied to an ambiguous negative half.

State quantization remains `ROUND_HALF_EVEN` under ADR-070. It is not reused by scoring.

### 2.3 Logical bounds versus competitive caps

Logical bounds validate a domain, for example `0 <= CC <= 1.10`. Competitive caps are approved scoring rules, for example the PBR limit. Neither constrains gameplay outcomes. There are no undocumented clipping operations.

### 2.4 Exact transforms

Scoring permits only audited exact transform families declared by `ScoringConfiguration`:

1. `IdentityRationalV1`;
2. `FrozenEmpiricalCdfV1`;
3. `MonotoneRationalSplineV1`;
4. affine rational combinations;
5. approved power values precomputed into an immutable table.

`FrozenEmpiricalCdfV1` is a canonical ordered list of integer or rational knots `(x_k, p_k)`, with non-decreasing `x_k` and `p_k in [0,1]`. It uses exact linear interpolation between distinct adjacent knots, returns the endpoint probability outside the knot interval, and defines duplicate observations through a single published mid-rank knot.

`MonotoneRationalSplineV1` is a versioned piecewise cubic Hermite transform on `[0,1]`. Knot positions, values and tangents are exact rationals; each segment is evaluated by exact Horner arithmetic. Validation requires endpoint values `0` and `1`, continuity, non-negative derivative over every segment and an output in `[0,1]`. This is a calibration curve, not arbitrary executable content.

Runtime evaluation of a fractional exponent is forbidden. The approved league-title expression remains normative, but each supported IJL is published as a precomputed integer in `CompetitionScoringDefinition` with source expression and verification fixture.

## 3. Scoring inputs and immutable resources

### 3.1 Authorized facts

The allowlist in [SCORING_FACTS_SPEC](SCORING_FACTS_SPEC.md) is exhaustive. In summary:

| Category | Authorized source families |
|---|---|
| PRI | `MinutesRecorded`, `AppearanceSummaryRecorded`, `ObservedProductionRecorded`, `PerformanceSummaryRecorded`, `SeasonPerformanceSummaryRecorded` |
| PTC_CLUB | closed club `CompetitionFinished`/achievement facts plus competition-scoped participation and performance facts used by CC |
| PPI | `AwardWon` mapped by an immutable award scoring definition |
| PSN | closed national-team `CompetitionFinished`/achievement facts plus national participation and performance facts used by CC; a national-exclusive award only when explicitly mapped |
| PRL | `RecordAchieved`, `CareerMilestoneAchieved` |
| PBR | `PublicReputationUpdated`, `FollowerCountUpdated`, `EngagementUpdated`, `HistoricAchievementConfirmed` |

A fact may be persisted without scoring. Facts not on the allowlist contribute exactly zero and create no ledger entry. Market value, transfer fee, salary, true/hidden capability, injury occurrence, tragedy, narrative content and `CareerScore` are never scoring inputs.

### 3.2 `ScoringConfiguration`

`ScoringConfiguration` is immutable, hash-addressed and separate from `EngineParameterSet`:

```text
ScoringConfiguration
  identity
    scoringVersion
    configurationId
    configurationHash
    schemaCompatibility
  arithmetic
    rationalFormat
    ROUND_HALF_UP policy
    canonical ordering
  pri
  contributionCoefficient
  clubAchievementCatalog
  nationalAchievementCatalog
  awardScoringCatalog
  recordAndLongevityCatalog
  popularityAndHistoricRules
  equivalenceAndStacking
  competitiveCaps
  cohortReferences
  narrativeTiers
  compatibilityPolicy
```

Point values, rules, weights, curves, equivalence groups, outcome multipliers, cap groups and cohort references are configuration—not gameplay parameters and not Event DSL.

### 3.3 `ScoringCalibrationData`

Empirical cohorts and transforms are a separate immutable resource identified by `calibrationDataHash`. It records provenance, observation window, inclusion/exclusion policy, cohort keys, parent hierarchy, sample counts, rational knots, published transforms and verification hashes. It is not mutated by a Career.

One `scoringVersion` resolves to exactly one configuration hash, one calibration-data hash, one IJL/catalog bundle hash and one golden-fixture bundle hash. A point-affecting change requires a new `scoringVersion`; no sixth canonical version is introduced.

## 4. Canonical cohorts and contextual percentiles

### 4.1 Cohort key

```text
CohortKey = {
  scoringVersion,
  scoringComponentOrProfile,
  dominantPositionGroup,
  dominantPosition?,
  participationContext,
  competitionClass,
  eraBand,
  evidenceBand?
}
```

The dominant historical group and position use effective exposure under DR-049: accumulated minutes by canonical Position, aggregated by PositionGroup, with deterministic exposure-signature tie-breaks. Initial position, retirement position and unweighted season count are forbidden cohort selectors. A zero-minute scope has no playing cohort and its exposure-dependent PRI/CC outputs are zero.

### 4.2 Hierarchical shrinkage

Sparse child cohorts use deterministic empirical-Bayes shrinkage toward a declared parent:

```text
F_shrunk(x) =
  [n_child * F_child(x) + lambda_child * F_parent(x)]
  / [n_child + lambda_child]
```

`n_child` is the published eligible sample count and `lambda_child > 0` is a rational configuration value. Parent traversal follows a frozen hierarchy, such as position -> position group -> participation context -> global profile. A scorer never falls across `scoringVersion`. Missing all authorized parents is `SCORING_CALIBRATION_DATA_MISSING`, not a silent default.

### 4.3 Tie and percentile policy

Empirical ties use published mid-ranks. All observations and eligibility filters are frozen before a version is released. A Career result never changes its cohort. Public leaderboard percentiles governed by DR-035 are separate from these frozen scoring cohorts.

## 5. PRI — individual performance

### 5.1 Components and maxima

The season PRI maximum before contextual reduction is exactly 1000:

| Component | Maximum |
|---|---:|
| contextual impact / relative performance | 450 |
| availability / minutes | 120 |
| position-specific production | 230 |
| high-pressure performance | 120 |
| leadership / regularity | 80 |

The maxima are immutable approved values. Internal coefficients and calibration curves are versioned in `ScoringConfiguration.pri`.

### 5.2 Segment model

A `PRISegment` is the smallest closed combination of season, participation context (`CLUB` or `NATIONAL_TEAM`), club/national side, competition and scoring context whose production and exposure are not reassigned later. A transfer never moves historical statistics to the destination club.

For feature `f` in segment `s`:

```text
p[f,s] = FrozenEmpiricalCdfV1(cohort[f,s], observedFeature[f,s])
v[f,s] = evidenceGate[f,s] * p[f,s]
```

`evidenceGate in [0,1]` is an exact rational derived from the persisted evidence strength through a declared exact transform. Missing or unobserved on-field evidence contributes zero; it is not imputed as average.

For component `k`:

```text
raw[k,s] =
  sum_f(weight[k,f,s] * v[f,s])
  / sum_f(weight[k,f,s])

quality[k,s] = MonotoneRationalSplineV1_k(raw[k,s])
```

Weights are non-negative rationals, at least one weight is positive for every supported profile, and only fields authorized by the segment's persisted summaries may be used.

The contextual factor is exact:

```text
leagueCompetitiveFactor(IJL) = (2500 + 75 * IJL) / 10000
```

with `IJL` the immutable scoring hierarchy value in `[1,100]`. Dynamic `LeagueCompetitiveStrength` never enters scoring. International and national competition factors are explicit rationals in `CompetitionScoringDefinition`; absent values are publication blockers, never inferred from gameplay strength.

For impact, production and regularity:

```text
mass[k,s] = actualMinutes[s] * evidenceGate[k,s]

PRIExact[k] = maxPoints[k] *
  sum_s(mass[k,s] * quality[k,s] * competitiveFactor[s])
  / sum_s(mass[k,s])
```

If the denominator is zero, the exact component is zero.

Availability is calculated once over the season:

```text
coverage = sum_s(actualMinutes[s]) / sum_s(teamMinutesOpportunity[s])
availabilityQuality = T_availability(coverage)

availabilityContextFactor =
  sum_s(actualMinutes[s] * competitiveFactor[s])
  / sum_s(actualMinutes[s])

PRIExact[availability] = 120 * availabilityQuality * availabilityContextFactor
```

When total opportunity or actual minutes is zero, availability PRI is zero. Medical state does not subtract points directly; its consequence is already represented by realized availability/minutes.

Pressure is exposure-specific:

```text
pressureMass[s] = pressureMinutes[s] * pressureEvidence[s]

PRIExact[pressure] = 120 *
  sum_s(pressureMass[s] * T_pressure(pressurePercentile[s])
        * competitiveFactor[s])
  / sum_s(pressureMass[s])
```

No pressure exposure yields zero pressure points. `leadership/regularity` initially uses only authorized realized regularity and role-continuity summaries. A leadership facet is disabled until a typed fact and definition are published; hidden leadership traits cannot be read by Scoring.

Each of the five components creates one season-scoped logical ledger calculation, carrying segment line items. It is rounded exactly once:

```text
PRI[k] = ROUND_HALF_UP(PRIExact[k])
PRI_season = sum_k PRI[k]
PRI_career = sum_closed_seasons PRI_season
```

The component construction and factors ensure `0 <= PRI_season <= 1000`. There is no career PRI cap.

### 5.3 Position-specific profiles

Profiles reuse G3C-4 summaries and do not create new performance statistics:

| Position profile | Authorized performance/production dimensions |
|---|---|
| ST | contextual attacking impact, scoring opportunity/conversion production, creative production, off-ball contribution and authorized pressing contribution |
| CM | progression, creativity, control, defensive contribution and contextual attacking contribution; goals/assists cannot dominate by construction |
| GK | shot-stopping, command and distribution performance plus contextualized authorized goalkeeper production |

Weights differ by profile and component but use the same exact computation family. The interface supports all canonical positions through data-defined profiles.

### 5.4 Club and national performance

On-field club and national-team performance both enter PRI as separate segments. This is not duplication with PSN: PRI scores individual performance; PSN scores national achievements. National performance may also affect a national achievement's CC because that is contribution attribution, not a second direct performance award.

### 5.5 Multiclub and partial seasons

Every segment retains its own IJL/competition factor and exposure. A season never selects the final club's factor for all statistics, and production totals are not copied between segments. A legitimately finalized partial season is scored from its closed facts with the same equations and no minimum-season threshold.

## 6. CC — contribution coefficient

### 6.1 Scope and inputs

CC is specific to one player, competition edition and scored achievement/outcome. It is not a player state, role mapping or season-global coefficient.

If the player has no authorized participation eligibility for that competition or has zero competition minutes, `CC = 0` by logical definition. Otherwise define exact inputs in `[0,1]`:

```text
minutesShare     = actualCompetitionMinutes / eligibleTeamMinutesOpportunity
appearanceShare = appearances / eligibleMatchOpportunity
startShare      = starts / eligibleMatchOpportunity

participation =
  wMin * T_min(minutesShare)
  + wApp * T_app(appearanceShare)
  + wStart * T_start(startShare)

qualityEvidence =
  wPerf * evidence * performancePercentile
  + wProd * productionEvidence * productionPercentile
  + wPressure * pressureEvidence * pressurePercentile

ccSignal = wParticipation * participation + qualityEvidence
```

All displayed weights are non-negative rationals and the weights in each normalized sum total exactly `1`. `wParticipation > 0`. Evidence-weighted missing quality is zero, never average. Each transform is a declared monotone exact transform.

```text
ccExact = (11/10) * T_CC(ccSignal)
ccUnits = ROUND_HALF_UP(10000 * ccExact)
CC = ccUnits / 10000
```

`T_CC` maps `[0,1]` monotonically to `[0,1]`. Validation enforces `0 <= ccUnits <= 11000`; those are logical bounds. Values above `1.00` arise continuously from the upper tail of the calibrated transform, not from a special role, title or threshold. The approved descriptive labels in ADR-009 remain presentation guidance only.

### 6.2 Monotonicity and evidence

Holding all other inputs fixed, increasing authorized participation, evidence-weighted performance, production or pressure cannot lower expected CC. SportingRole is not an input. A role can influence realized minutes upstream, but it never assigns CC.

### 6.3 Incomplete attribution

Competition registration, loan eligibility, transfer timing and participation ownership are fact-producer responsibilities. While DR-066/067 or a CompetitionDefinition leaves the required fact unresolved, official scoring returns `SCORING_INPUT_INCOMPLETE`; it does not infer eligibility and does not silently assign zero.

## 7. PTC_CLUB — club achievements

### 7.1 General equation

For an authorized club competition outcome:

```text
outcomeBaseExact = championBasePoints * outcomeMultiplier
PTCEntry = ROUND_HALF_UP(outcomeBaseExact * ccUnits / 10000)
```

`championBasePoints` is an integer and `outcomeMultiplier` an exact rational in `CompetitionScoringDefinition`. The highest terminal outcome of one competition edition is scored once. Contained rounds do not stack unless the definition explicitly declares independent phase scoring. Independent competitions may stack.

### 7.2 Approved league formula

The normative source expression is:

```text
leagueChampionBase = round[650 * (IJL / 100)^1.35]
```

Runtime never evaluates the fractional power. Publication tooling verifies and stores the integer result for each supported IJL using the approved `ROUND_HALF_UP` interpretation. Known examples in `MASTER_SPEC.docx` remain unchanged. An unsupported IJL is `SCORING_DEFINITION_MISSING`.

### 7.3 Domestic and international catalogs

Domestic derivative families remain exactly those approved by the master specification: principal cup `55%` of league, league cup `35%`, supercup `18%`, second division `45%` of the corresponding first tier, third/lower divisions up to the approved `20%` range, and regional competitions within the approved `8–25%` range. A range is not a value: each competition needs a published exact rational before implementation.

Approved club international champion bases are preserved:

| Competition family | Champion base |
|---|---:|
| long-cycle Club World Cup | 2600 |
| annual Intercontinental | 1500 |
| UEFA Champions League | 2200 |
| Copa Libertadores | 2100 |
| AFC Champions League Elite | 1200 |
| CAF Champions League | 1150 |
| Concacaf Champions competition | 1050 |
| OFC Champions League | 450 |
| UEFA Europa League | 1000 |
| Copa Sudamericana | 950 |
| UEFA Conference League | 650 |

Continental supercups remain within the approved `300–400` range and therefore require a competition-specific published value. Approved generic outcome multipliers are champion `1`, runner-up `45/100`, semifinal `20/100`, quarterfinal `8/100`; earlier-round `0–4%` values apply only where a main competition definition publishes one. Missing definitions are data blockers, not invitations to invent values.

## 8. PSN — national-team achievements

The same outcome and CC equation is used with a national competition definition. Approved champion bases are:

| Competition family | Champion base |
|---|---:|
| World Cup | 5000 |
| Euro / Copa América | 2400 |
| AFCON / Asian Cup / Gold Cup | 1600 |
| OFC Nations | 800 |
| Nations-League-like | 700 |
| Finalissima | 500 |
| Olympics | 500 |
| youth competition | exact published value in approved 150–350 range |

World Cup runner-up and semifinal multipliers are `1/2` and `1/4`. Other outcome multipliers require their competition definition. Youth ranges cannot be evaluated until a definition publishes a value.

An individual national award remains PPI unless an immutable mapping assigns it exclusively to PSN. The same `AwardWon` cannot enter both categories.

## 9. PPI — individual awards

### 9.1 Base values and league formulas

Only `AwardWon` facts whose `AwardScoringDefinition` supplies an exact mapping score. Approved fixed bases include:

| Award family | Base |
|---|---:|
| Ballon d'Or | 1800 |
| The Best | 1400 |
| continental player | 900 |
| World Cup Golden Ball | 900 |
| global goalkeeper/Yashin | 700 |
| European Golden Shoe | 650 |
| World Cup Golden Boot | 700 |
| continental national-tournament MVP | 600 |
| Kopa / Golden Boy | 500 |

League awards use exact IJL formulas:

```text
league POTY       = ROUND_HALF_UP(350 * IJL / 100)
scorer/assist/GK  = ROUND_HALF_UP(220 * IJL / 100)
team of season    = ROUND_HALF_UP(100 * IJL / 100)
monthly/match     = 0
```

The IJL is the edition's immutable scoring hierarchy value, never dynamic gameplay strength.

### 9.2 Equivalence groups

`AwardScoringEquivalenceGroup` is data-driven. For the approved same-season global-equivalent policy, eligible awards are sorted by descending base and then canonical `awardDefinitionId`. Exact rank multipliers are:

```text
rank 1 -> 1
rank 2 -> 3/5
rank 3+ -> 0
```

The group is one logical ledger calculation containing every award line, source fact and pre/post-equivalence amount; its exact sum is rounded once. Distinct positional, youth and statistical awards keep full value unless their definitions place them in another group. Anti-duplication changes points only, never Award history.

An unpublished membership or ambiguous equivalence is `SCORING_DEFINITION_MISSING`; pairs are never hardcoded by engine code.

## 10. PRL — records and longevity

### 10.1 Record entitlements

Only a `RecordAchieved` mapped by `RecordScoringDefinition` may score. Approved ranges remain: club record `100–600`, league/competition record `300–1000`, world/national record `500–1500`. Each actual record needs an exact value before publication.

For a record family/scope, the entitlement is the greatest authorized value reached by closed facts:

```text
recordEntitlement = max(authorizedRecordValuesReached)
newPosting = recordEntitlement - alreadyPostedEntitlement
```

The new posting is non-negative. Repeating the same mark posts zero. A later higher entitlement posts only the delta. Overlapping aliases or scopes from one performance use the definition's equivalence group; default policy is maximum-only. Independent definitions may stack only when explicitly declared. A shared-record policy belongs to the definition.

### 10.2 Career milestones

Approved longevity entitlements are:

```text
15 meaningful professional seasons -> total entitlement 300
20 meaningful professional seasons -> total entitlement 700
one-club career                    -> entitlement 500
```

Reaching 20 after 15 posts a delta of `400`, not another `700`. Meaningful-season and one-club minimum-participation criteria must be published as data/fact-production policy. Scoring consumes the authoritative `CareerMilestoneAchieved`; it never counts retired inactivity, infers a maximum age or reads club affiliation without participation evidence.

PRL has no aggregate cap in the approved rules.

## 11. PBR — popularity and rare/historic bonuses

### 11.1 Two subfamilies

PBR contains:

```text
socialPopularityExact <= 1000
rareHistoricExact     <= 1000
```

The first is derived at finalization from authorized social-state facts. The second is an entitlement over authorized `HistoricAchievementConfirmed` definitions. Negative/adverse events, injuries, death, accidents or tragedy never score merely because they occurred.

### 11.2 Popularity transform

The finalization frontier produces canonical season-close social observations. For metric `m` (follower count, awareness, engagement and authorized reach view):

```text
percentile[m,t] = FrozenEmpiricalCdfV1(cohort[m,t], observation[m,t])

metricSummary[m] =
  wFinal[m] * finalPercentile[m]
  + wSustained[m] * exposureWeightedMean_t(percentile[m,t])
  + wPeak[m] * max_t(percentile[m,t])

socialSignal = sum_m(wMetric[m] * metricSummary[m]) / sum_m(wMetric[m])
socialPopularityExact = 1000 * T_social(socialSignal)
```

All weights are non-negative exact rationals and each summary weight set totals `1`. `wFinal + wSustained > 0`, so a momentary peak cannot be the sole determinant. Raw followers are not mapped linearly to points. SportingReputation and sentiment are excluded unless a later scoring version explicitly authorizes a non-duplicative metric.

### 11.3 Historic entitlements and total PBR

Historic definitions use the same max/delta/equivalence mechanics as records and remain capped at `1000`. At finalization:

```text
priorSportingPoints = PRI + PTC_CLUB + PPI + PSN

PBRExact = min(
  socialPopularityExact + rareHistoricExact,
  2000,
  priorSportingPoints / 20
)

PBR = ROUND_HALF_UP(PBRExact)
```

`PRL` is intentionally excluded from `priorSportingPoints`: the master specification's pure sporting subtotal is PRI+PTC+PPI+PSN, and excluding PRL prevents longevity/records from recursively expanding the bonus cap. The full PBR is one career-scoped logical calculation rounded once after both subcaps and the cross-category cap.

## 12. Canonical calculation order

For a scoring version, the order is normative:

1. validate finalization frontier, fact versions, integrity and provenance;
2. canonicalize fact order and scoring scopes;
3. resolve frozen cohorts and scoring definitions;
4. evaluate eligibility and semantic de-duplication;
5. calculate exact base values and component transforms;
6. calculate and quantize competition-specific CC;
7. apply outcome, equivalence and stacking policies;
8. apply rule/group caps and category-local caps;
9. freeze exact PRI/PTC/PPI/PSN/PRL subtotals;
10. compute `priorSportingPoints` and apply PBR subcaps/cross-cap;
11. apply `ROUND_HALF_UP` once per logical ledger calculation;
12. canonical-sort and hash ledger entries;
13. sum exact signed integer entries by category and total PC;
14. derive tier and produce ScoreSnapshot.

An equivalence or cap group is one logical calculation. This prevents accidental per-line rounding from changing a group result.

## 13. ScoreLedger

### 13.1 Entry contract

`ScoreLedger` is append-only within its official scoring projection. Every entry contains at minimum:

```text
ScoreLedgerEntry
  entryId
  idempotencyKey
  entryKind: POSTING | REVERSAL
  scoringVersion
  scoringConfigurationHash
  scoringCalibrationDataHash
  ruleId
  ruleRevision
  category
  scopeKey
  sourceFactIds[]
  sourceFactDigest
  calculation
    calculationFamily
    exactBase
    lineItems[]
    transforms[]
    outcomeMultiplier?
    ccUnits?
    equivalenceMultiplier?
    capGroup?
    exactPreRound
    discardedByCap?
    roundingPolicy: ROUND_HALF_UP
  finalPointsAbsolute
```

`finalPointsAbsolute` is a non-negative exact integer. Signed contribution is positive for `POSTING`, negative for `REVERSAL`. There are no negative scoring penalties in the approved rules.

### 13.2 Idempotency

The canonical idempotency key is:

```text
Hash(
  scoringVersion,
  scoringConfigurationHash,
  ruleId,
  ruleRevision,
  category,
  scopeKey,
  applicationOrdinal,
  canonicalSortedSourceFactIds,
  sourceFactDigest
)
```

Reapplying the same rule to the same canonical fact set under the same version returns the existing logical entry. A different scoring version creates a separate ledger projection.

### 13.3 Corrections and reversals

Facts are immutable. A valid correction fact may cause a `REVERSAL` of the exact outstanding posting and a new corrected posting. The reversal references the target entry and correction fact. Entitlement upgrades such as a later record or 20-season milestone use a non-negative delta posting, not a reversal.

Silent mutation, deletion or replacement of an official entry is forbidden.

### 13.4 Incremental versus full recomputation

Rules post only after their logical scope closes: season PRI components after season summary closure, competition achievements after the edition closes, award equivalence after the award window closes, and career PBR after finalization. A pure full recomputation over the same canonical fact frontier must yield byte-equivalent canonical entries and totals to the incremental projection.

Interim score views are derived provisional projections. They may be rebuilt and are marked `PROVISIONAL`; they are never the final leaderboard score.

## 14. Exact PC, snapshots and presentation

### 14.1 Integer sum

```text
categorySubtotal[c] =
  sum(entrySignedPoints for entries where category = c)

PC = PRI + PTC_CLUB + PPI + PSN + PRL + PBR
```

All operands are exact integers. A mismatch between the ledger sum, subtotals or PC is an integrity failure.

### 14.2 Narrative tiers

Tiers are derived presentation only:

| Inclusive PC range | Tier |
|---|---|
| 0–4999 | professional |
| 5000–14999 | notable |
| 15000–24999 | international elite |
| 25000–39999 | world-class |
| 40000–54999 | legend |
| 55000–69999 | historic legend |
| 70000+ | mythical |

They do not affect gameplay, scoring eligibility or future points.

### 14.3 `ScoreSnapshot`

A final snapshot contains:

```text
ScoreSnapshot
  snapshotId
  careerId
  status: PROVISIONAL | FINAL
  factFrontierId
  finalizedAtMetadata?
  schemaVersion
  engineVersion
  contentVersion
  dataVersion
  scoringVersion
  parameterSetHash
  scoringConfigurationHash
  scoringCalibrationDataHash
  competitiveCompatibilityKey
  ledgerDigest
  categorySubtotals { PRI, PTC_CLUB, PPI, PSN, PRL, PBR }
  priorSportingPoints
  totalPC
  narrativeTier
  integrityStatus
```

`snapshotId` is derived from canonical content, not wall-clock time. A server completion timestamp may be attached as non-causal ranking metadata for the approved final tie-break; it is not a fact identity or replay input.

## 15. Versioning, replay and compatibility

### 15.1 Official and analytic recalculation

The Career retains the configuration/calibration resources that produced its official ledger. Publishing a new scoring version never mutates that ledger. Analytic re-scoring under another version creates a separately identified non-official projection unless an explicit migration policy later authorizes otherwise.

### 15.2 Conservative compatibility key

The initial competitive policy permits direct comparison only when this exact canonical tuple matches:

```text
CompetitiveCompatibilityKey = Hash(
  compatibilityPolicyId,
  schemaVersion,
  engineVersion,
  contentVersion,
  dataVersion,
  scoringVersion,
  parameterSetHash,
  scoringConfigurationHash,
  scoringCalibrationDataHash,
  competitivePresetId,
  creationBudgetCompatibilityClass,
  automationPolicyId,
  modeRulesetId
)
```

This is a conservative V1 rule, not a declaration that different versions can never be equivalent. DR-036 remains open for broader cross-version/Hall-of-Fame policy.

### 15.3 Finalization and leaderboard eligibility

Under ADR-079:

```text
CareerFinalizationConfirmed
-> closed fact frontier
-> canonical final ledger
-> integrity validation
-> FINAL ScoreSnapshot
-> CareerStatus.COMPLETED
-> potential leaderboard eligibility
```

The first sporting retirement does not freeze PC. A comeback-capable Career continues to accept authorized facts. `ABANDONED` is excluded from the main ranking; `INVALIDATED` is competitively excluded; provisional sporting retirement is not final. Main ranking retains the approved best eligible Career per account policy. Tie-break order remains: pure sporting subtotal, PPI, PSN, season efficiency, then earlier verified completion metadata.

## 16. Parameter and data registry

Scoring has no entry in `EngineParameterSet` and no random streams. Its complete registry is:

| Registry area | Contents | Classification |
|---|---|---|
| arithmetic | rational format, canonical reduction/order, `ROUND_HALF_UP` | STRUCTURAL_FIXED |
| PRI structure | component maxima, segment semantics, authorized feature matrices | STRUCTURAL_FIXED |
| PRI transforms | evidence gates, feature weights, exact splines | INITIAL_CALIBRATION_REQUIRED |
| competitive factors | league exact formula/table; competition-specific exact factors | DATA_REQUIRED where unpublished |
| CC | weights, exact transforms, quantization scale, calibration cohort refs | INITIAL_CALIBRATION_REQUIRED except structural domain |
| club/national catalogs | point bases, outcome multipliers, stacking scopes | DATA_REQUIRED where master only supplies ranges |
| award catalog | bases, IJL formulas, equivalence membership/rank multipliers | DATA_REQUIRED for complete membership/catalog |
| records/longevity | exact record definitions, milestone evidence/minima, equivalence | DATA_REQUIRED where unpublished |
| popularity/historic | metrics, cohort refs, weights, transforms, historic definitions | INITIAL_CALIBRATION_REQUIRED / DATA_REQUIRED |
| caps | approved PBR subcaps/cross-cap and category application order | STRUCTURAL_FIXED |
| cohorts | hierarchy, sample policy, shrinkage, CDF knots, provenance | DATA_REQUIRED |
| tiers | approved PC presentation ranges | STRUCTURAL_FIXED |
| compatibility | exact key policy and manifest fields | STRUCTURAL_FIXED |
| goldens | inputs, exact intermediates, expected integer ledger/snapshot hashes | INITIAL_CALIBRATION_REQUIRED until configuration publication |

`TUNABLE_LATER` values may change only by publishing a new `scoringVersion`; the label means calibratable, not mutable in an existing version.

## 17. Invariants and properties

### 17.1 Exactness and ownership

- scoring uses no RNG and owns no random stream;
- same facts + same immutable scoring resources produce the same canonical ledger and snapshot;
- all final points, category subtotals and PC are exact integers;
- no IEEE-754 intermediate enters an official calculation;
- every entry traces to a rule and authorized fact set;
- Content/Event DSL cannot write `ScoreLedger` or scoring configuration;
- gameplay state, performance, awards and facts are never changed by scoring;
- dynamic `LeagueCompetitiveStrength` never substitutes for IJL;
- no tragedy/adverse-event bonus exists;
- approved caps constrain score only, never gameplay tails.

### 17.2 PRI and CC

- `0 <= PRI_season <= 1000`;
- each PRI component is within its approved maximum;
- segment statistics are neither duplicated nor reassigned;
- GK/CM/ST profiles consume position-appropriate signals;
- `0 <= CC <= 1.10` and `CC = 0` for logically ineligible/zero-minute participation;
- holding other inputs fixed, higher authorized participation or contribution evidence cannot lower exact CC;
- SportingRole alone cannot assign either minutes or CC.

### 17.3 Categories, caps and lifecycle

- one source fact cannot score in two aliases or two categories unless an explicit, non-overlapping rule authorizes distinct semantics;
- winner history is unaffected by PPI equivalence;
- `PBR <= 1000 + 1000`, `PBR <= 5%` of prior sporting points, after approved rounding;
- `priorSportingPoints = PRI + PTC_CLUB + PPI + PSN` exactly;
- a first retirement does not finalize or freeze score;
- only a valid `COMPLETED` frontier can yield an official final snapshot;
- full recomputation equals incremental scoring for the same closed frontier.

## 18. Calibration and validation targets

Targets are versioned intervals, never guessed values. Mandatory suites classify each item:

| Area | Measurement | Class | Evidence source |
|---|---|---|---|
| arithmetic | rational reduction, half cases, group-rounding equivalence | INVARIANT | design |
| PRI | component bounds and total <=1000 | INVARIANT | design |
| PRI | component/season/career distributions by GK/CM/ST, context and era | CALIBRATION_TARGET | external historical dataset + design |
| PRI | rank correlation with contextual performance and evidence | CALIBRATION_TARGET | external evidence |
| PRI | multiclub aggregation neutrality and no duplicated production | INVARIANT | design |
| CC | domain, zero participation behavior, monotonic expectation | INVARIANT | design |
| CC | distribution by participation, performance, role diagnostic and competition | CALIBRATION_TARGET | external evidence + design |
| CC | frequency and context of `CC > 1` | CALIBRATION_TARGET | design |
| achievements | known master examples and point values unchanged | INVARIANT | master specification |
| awards | equivalence reduction and league formula results | INVARIANT | design/master |
| records | repeat/upgrade/shared-record behavior | INVARIANT | design/data definitions |
| PRL | record and longevity composition distribution | DIAGNOSTIC | end-to-end careers |
| popularity | social-signal/points relation, persistence and peak sensitivity | CALIBRATION_TARGET | external/social reference data + design |
| PBR | both subcaps and `5%` cross-cap | INVARIANT | master specification |
| PC | total and category composition | CALIBRATION_TARGET | design + end-to-end simulation |
| tiers | distribution across narrative tiers | CALIBRATION_TARGET | product design |
| compatibility | unequal required field rejects direct comparison | INVARIANT | design |
| replay | incremental/full recomputation byte equivalence | INVARIANT | design |

Tail diagnostics must record P90/P95/P99/P99.9 when sample size permits, maximum observed PRI/CC/PBR/PC, category concentration, extreme title/award accumulation, record-heavy careers, social-heavy careers and very long Careers. Approved score caps are tested; no new cap is introduced to shape a tail.

Calibration order is causal: upstream G3C gameplay models and their facts first; frozen scoring cohorts next; PRI and CC; catalog mappings/equivalence; PRL/PBR; PC composition and tiers; final end-to-end compatibility diagnostics.

## 19. Golden vectors

The first published scoring version must provide exact expected outputs for:

1. rational normalization and every `<`, `=`, `>` half rounding case;
2. league factor for boundary and representative IJL values;
3. precomputed league-title table verification, including every master example;
4. empirical CDF tie/mid-rank, interpolation and parent shrinkage;
5. ST, CM and GK PRI segments with exact feature percentiles, evidence, factor, component amount and rounding;
6. a multiclub season proving segment-specific factors and no duplicated production;
7. club plus national PRI segmentation;
8. CC zero participation, ordinary contribution and `CC > 1` cases;
9. club and national outcomes with outcome multiplier and CC;
10. global award equivalence `100%/60%/0%`, a distinct award stack and league formulas;
11. record repeat, upgrade delta, shared/equivalent scope and longevity `300 -> +400`;
12. social popularity transform, historic subcap and exact PBR cross-cap half cases;
13. canonical idempotency under permuted input facts;
14. correction fact producing exact reversal/reposting;
15. incremental versus full recomputation with byte-equal ledger digest;
16. provisional versus final snapshot and compatibility-key mismatch;
17. every narrative-tier boundary.

Fixtures specify canonical facts, configuration/calibration hashes, every exact rational intermediate, expected entries, subtotals, PC, tier and digest. No expected value is left to the implementation.

Monte Carlo uses no scoring draws; it projects facts produced by `CalibrationSeedSet` SMOKE/CALIBRATION/DEEP runs and measures the targets above.

## 20. G3C-11 closure matrix

Every assigned decision now has a complete equation/algorithm. Remaining statuses describe publication inputs, not missing mathematical families.

| ID | Closure status | Normative mathematical decision | Remaining work/blocker |
|---|---|---|---|
| G3B-M02 | PARTIAL_CALIBRATION | CC uses exact evidence-weighted participation/contribution signal, monotone rational transform and 1/10000 quantization in `[0,1.10]` | fit weights/splines/cohorts and publish goldens |
| G3B-M03 | DATA_REQUIRED | domestic points derive through exact approved ratios and competition definitions | exact values for approved ranges and DR-066 participation facts |
| G3B-M04 | DATA_REQUIRED | club international outcomes use exact bases, multipliers and competition-scoped CC | complete edition/catalog definitions and earlier-round values |
| G3B-M05 | DATA_REQUIRED | national outcomes use the same exact achievement equation | youth values and missing outcome mappings |
| G3B-M06 | DATA_REQUIRED | awards use exact data-driven equivalence rank multipliers and one group rounding | complete award catalog and group membership |
| G3B-M07 | PARTIAL_CALIBRATION | PRI has five exact component equations, task-specific cohorts, exposure segmentation and competitive factors | cohort data, transforms, weights and external targets |
| G3B-M08 | DATA_REQUIRED | records/longevity use max entitlement and delta postings | exact record catalog and meaningful-season/one-club criteria |
| G3B-M09 | PARTIAL_CALIBRATION | social popularity uses frozen cohort percentiles, final/sustained/peak aggregation and exact PBR cross-cap | social cohorts, weights/transforms and targets |
| G3B-M10 | DATA_REQUIRED | competition attribution is per edition and consumes authoritative participation/eligibility facts | DR-066/067/data producer policy; never inferred by Scoring |
| G3B-M11 | RESOLVED_MATH | cohort scope is effective-minute dominant PositionGroup plus canonical specific-position secondary key | no mathematical gap |
| G3B-M15 | DATA_REQUIRED | frozen versioned empirical cohorts use exact mid-rank CDF and hierarchical rational shrinkage | dataset provenance, samples, hierarchy values and knots |
| G3B-M17 | RESOLVED_MATH | exact operation order, logical grouping, cap order and one-round-per-entry policy frozen | no mathematical gap |
| G3B-M18 | PARTIAL_CALIBRATION | deterministic golden architecture and required fixture coverage frozen | publish calibrated expected vectors/hashes; broader DR-036 policy remains |

### 20.1 SC-01 to SC-13 disposition

| SC | Status | Closed contract | Publication dependency |
|---|---|---|---|
| SC-01 | RESOLVED_MATH | exact sum of six integer categories | arithmetic goldens |
| SC-02 | PARTIAL_CALIBRATION | competition-specific CC equation/domain | weights, splines, cohorts |
| SC-03 | DATA_REQUIRED | domestic base/outcome/CC equation | exact ranged values and attribution facts |
| SC-04 | DATA_REQUIRED | international terminal outcome/CC equation | complete competition definitions |
| SC-05 | DATA_REQUIRED | national outcome/CC and category exclusivity | youth/outcome mappings |
| SC-06 | DATA_REQUIRED | award equivalence and group rounding | catalog/group membership |
| SC-07 | PARTIAL_CALIBRATION | five-component positional/segment PRI | cohorts/transforms/targets |
| SC-08 | DATA_REQUIRED | record/longevity entitlement/delta | catalog and milestone criteria |
| SC-09 | PARTIAL_CALIBRATION | popularity transform family and exact PBR cap | social cohorts/transforms |
| SC-10 | DATA_REQUIRED | multicontext segment/edition attribution | DR-066/067 facts |
| SC-11 | RESOLVED_MATH | effective-minute dominance from DR-049 | dominance goldens |
| SC-12 | RESOLVED_MATH | exact rational arithmetic/round/cap order/reversals | arithmetic goldens |
| SC-13 | RESOLVED_MATH | approved inclusive narrative tiers | boundary goldens |

## 21. DR disposition

### 21.1 DR-010

DR-010 is **RESOLVED_MATH** by this specification and ADR-080. The six categories, exact PRI/CC/PBR equations, rational intermediate representation, `ROUND_HALF_UP`, cap order, ledger idempotency, reversals, snapshots and deterministic recalculation no longer lack a mathematical family. Publication still requires the data/calibration artifacts listed in the closure matrix.

### 21.2 DR-008

All G3C mathematical families assigned through G3C-11 are closed. DR-008 remains an implementation gate only for:

- initial calibrated numeric values and accepted target intervals;
- frozen cohort/reference datasets with provenance;
- complete scoring/competition/award/record catalogs;
- computed golden expected outputs and hashes;
- end-to-end Monte Carlo acceptance;
- schemas and package implementation after authorization.

It must no longer be described as blocked by an unspecified scoring formula.

### 21.3 Other unresolved policies

- DR-035 still owns public sample-size/percentile presentation; it does not block frozen scoring cohorts.
- DR-036 still owns broader cross-version and Hall-of-Fame equivalence. Exact-key compatibility is the conservative initial policy.
- DR-065 still owns the external club pool/mobility policy; Scoring consumes only closed facts.
- DR-066/067 still own competition participation/registration and timing facts required by attribution.
- Missing exact catalog values inside approved ranges are `DATA_REQUIRED`, not new formulas.

## 22. Implementation gate

G3C mathematical design is closed, but scoring is not implementation-ready until an initial `ScoringConfiguration`, `ScoringCalibrationData`, complete vertical-slice catalogs, golden expected outputs and accepted target ranges are published. No gameplay or scoring package implementation is authorized by this document.

## 23. G3D-1 identity clarification

The canonical Scoring registry paths are under `scoringConfiguration.*` and
`scoringCalibrationData.*`; they never appear under `EngineParameterSet`.
G3D-1 assigns no missing catalog values or cohort knots.

An official `scoringVersion` resolves to exactly:

```text
ScoringConfigurationId + ScoringConfigurationHash
+ ScoringCalibrationDataId + ScoringCalibrationDataHash
```

Both payloads are immutable and content-addressed. Candidate hashes may change
before publication. After publication, any point-changing config or calibration
change requires a new `scoringVersion`; it is never replaced under the old
version. Source datasets and transformation manifests remain traceable through
[`CALIBRATION_DATASET_REGISTRY.md`](CALIBRATION_DATASET_REGISTRY.md), and the
required exact fixtures through
[`GOLDEN_VECTOR_REGISTRY.md`](GOLDEN_VECTOR_REGISTRY.md).
