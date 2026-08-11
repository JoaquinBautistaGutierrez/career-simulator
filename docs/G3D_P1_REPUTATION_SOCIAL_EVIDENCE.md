# G3D-4E P1 Reputation and Social Observational Evidence

Status: `NORMALIZED_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Evidence namespace: `EV-P1-REP-*`, `EV-P1-SOC-*`

This artifact supplies observational constraints only. `SportingReputation`,
`Awareness`, `Sentiment` and `PublicAttention` remain distinct latent/state
variables governed by G3C-9. Followers remain exact per-platform `uint64`
partitions. No MarketValue, CareerScore, parameter value or Product Target is
introduced.

## 1. Observation contract

Every future social observation must carry:

```text
platform
publicAccountOrEntity
observedAt or closed observation window
metricDefinition
geography, if actually exposed
sourceId
cutoffClassification
licenseState
```

Cross-platform totals are prohibited unless a later transform declares
duplicate-audience semantics. Missing accounts, inactive accounts and ambiguous
verification remain observed states; they are not zero followers. Engagement
retains its numerator, denominator and window.

## 2. Reputation and attention evidence

| Evidence area | Acquired constraint | What it can inform later | What remains unidentified |
|---|---|---|---|
| sustained sport/context | goals and successful-club context associate with public following in the Eredivisie Twitter reference | allowed sign/context diagnostics for typed sport impulses | causal SportingReputation state, impulse weight, persistence |
| event response | World Cup player/team growth and event-search rise/decline | event-study fixture shape: baseline, peak, decay, repeated shocks | universal decay profile; attribution among performance, titles and media |
| awareness proxy | Google Trends supplies normalized search interest with frozen query/geography/period | public-attention relative trajectory | absolute awareness or recognition probability |
| long-lived recognition | official event cases and retired-athlete reference show attention need not disappear immediately | persistence/tail diagnostics | separation of durable SportingReputation from lingering PublicAttention |
| regional reach | Argentina/Spain team-account audience-outside-home aggregates | regional/global diffusion diagnostic | player-level one-step diffusion coefficient and duplicate audience |

The evidence supports the mathematical separation of achievement impulses and
public-attention shocks. It does not support a single `FameOverall`, a direct
followers-to-reputation mapping or same-window feedback.

## 3. Empirical social summaries

### 3.1 Cross-sectional follower shape

| Reference population | N/coverage | Platform/window | Published summary | Use and bias |
|---|---:|---|---|---|
| public women footballer accounts | 1,386 mapped players | Instagram, several days in June 2021 | mean 36,312; median 4,000; SD 273,228 | strong right skew; sex/league/account-selection reference, not male V1 baseline |
| same reference | 1,386 analyzed public accounts (1,605 identifiable accounts from 1,712 rostered players) | Instagram, June 2021 | four above 1m; about 93% below 100k | preserves low/ordinary mass and superstar tail |
| selected World Cup accounts | selected tournament stars | Instagram, 2022-11-14–12-18 | roughly 12.1m–518.8m | extreme-tail/event sample only |

The mean/median gap and extreme range support a heavy-tailed observation
distribution. No winsorization, social tier or follower cap follows from these
summaries.

### 3.2 Growth and viral episodes

| Entity/context | Baseline/period | Published change | Classification |
|---|---|---:|---|
| Lionel Messi, World Cup 2022 | already global-scale account; event window | +6.73% | large absolute scale, moderate proportional change |
| Enzo Fernández, World Cup 2022 | breakout event window | +383.47% | major event impulse |
| Cho Gue-sung, World Cup 2022 | breakout event window | +9,349.75% | extreme viral tail |
| Tim Payne, World Cup 2026 | about 5,000 to >5m in roughly three weeks | >1,000× order of magnitude | official extreme tail; single case |

An observational viral episode is a growth discontinuity assessed relative to
the account's own pre-event baseline, within an explicit interval and with a
documented event/platform. “Many new followers” without baseline or interval is
not sufficient. These episodes validate tail accessibility but do not replace
the G3D-3D viral-frequency Product Targets or identify Bernoulli/magnitude
parameters.

### 3.3 Engagement

| Reference | Audience/growth | Engagement observation | Constraint |
|---|---|---|---|
| Messi, World Cup window | +6.73% from huge base | 4.30% | large audience is not maximum engagement |
| Enzo Fernández | +383.47% | 51.88% | breakout and engagement may co-move |
| Cho Gue-sung | +9,349.75% | 224.36% under provider definition | provider denominator can exceed 100%; definition must be retained |
| women-football Instagram sample | median followers 4,000 | median likes 504; comments 16 | interactions remain separate metrics |

Platform documentation confirms separate likes, comments, shares, views and
subscriber gain/loss fields. The acquired data cannot supply a cross-platform
universal “engagement rate”. `Engagement` persistence therefore remains joint.

### 3.4 Decline and churn

YouTube's official metric contract proves subscriber loss is an observable and
therefore supports non-monotone audience evolution. The research did not find a
freeze-quality, representative male-football longitudinal panel separating
organic loss, account inactivity, bot enforcement and cross-platform migration.
Consequently:

- decline is preserved as a valid tail and acquisition consumer;
- no observed churn rate is published;
- `PT-SOC-DECLINE-001` and all other 77 Product Targets remain unchanged;
- `followers.churn` is `JOINT_CALIBRATION_REQUIRED`, not directly estimable.

## 4. Platform, era and regional limitations

- Twitter-era Eredivisie findings are not assumed to transfer unchanged to
  Instagram/TikTok/YouTube in 2026.
- TikTok and YouTube API schemas verify metric semantics, not representative
  football-player distributions.
- Instagram event data overrepresent selected stars, tournament participants
  and public accounts.
- National-team account geography is an aggregate regional proxy, not an
  individual player's audience transition.
- Platform adoption, account age, verification and metric changes must be
  covariates or segmentation facts in later calibration.
- Argentina player-level longitudinal coverage is absent; Spain has only a
  women-football cross-sectional league reference.

## 5. Cross-system evidence boundaries

| Link | Observational support | Calibration boundary |
|---|---|---|
| Performance → Reputation/attention | performance and club context associate with public following; tournament breakouts show shocks | no causal coefficient; G3D-4A remains upstream |
| Awards/titles → attention | event studies can be centered on documented achievements | Award points never become attention impulses |
| Transfers → social | event-study design may reuse G3D-4C dated transfer facts | no duplicate evidence or immediate global diffusion assumption |
| Retirement → social | post-career attention can persist; follower loss is possible | attention is not forced to zero and no scoring/PBR change follows |

All Market/Selection/Award interfaces consume lagged prior snapshots exactly as
specified. No current-window feedback is introduced.

## 6. Identifiability and calibration readiness

| Family | State | Evidence basis | Remaining gate |
|---|---|---|---|
| Sporting Reputation | `JOINT_CALIBRATION_REQUIRED` | sport/club/public associations and event chronology | latent separation, persistence and typed impulse fit |
| Awareness | `JOINT_CALIBRATION_REQUIRED` | search, followers, mentions and reach proxies | proxy measurement model and regional mapping |
| Sentiment | `WEAKLY_IDENTIFIED` | engagement is not sentiment; no comparable public sentiment panel | construct-valid observation or synthetic/product constraint |
| Public Attention | `READY_WITH_LIMITATIONS` | normalized search/event-window shapes | footballer panel and query identity freeze |
| attention decay | `READY_WITH_LIMITATIONS` | event rise/decline reference | player-specific repeated events and exact interval fit |
| follower cross-section | `READY_WITH_LIMITATIONS` | heavy-tail public-account summaries | representative male Argentina/Spain panel |
| acquisition/churn | `JOINT_CALIBRATION_REQUIRED` | event growth plus official gain/loss semantics | longitudinal at-risk panel and platform decomposition |
| viral frequency/magnitude | `JOINT_CALIBRATION_REQUIRED` | multiple official/published extreme magnitudes | representative episode denominator; Product Target constraints |
| Engagement | `READY_WITH_LIMITATIONS` | platform definitions and published distributions | compatible denominator and longitudinal persistence panel |
| regional diffusion | `WEAKLY_IDENTIFIED` | team-account outside-home shares | player geography, duplicate audiences and transfer event panels |

No family is assigned a value. “Ready” means a future estimator has an
observational component, not that a causal engine parameter is identified.

## 7. Dataset and target consequences

- `DS-REPUTATION-REFERENCE`, `DS-SOCIAL-AUDIENCE-REFERENCE`,
  `DS-SOCIAL-ENGAGEMENT-REFERENCE` and `DS-PUBLIC-ATTENTION-REFERENCE` advance
  only to `NORMALIZED_WITH_LIMITATIONS`.
- `CT-REP-ATTN-001`, `CT-SOC-FOLLOW-001`, `CT-SOC-ENG-001` and
  `CT-SOC-TAIL-001` gain observational summaries.
- `CT-REP-SPORT-001`, `CT-REP-AWARE-001`, `CT-REP-REG-001` and
  `CT-REP-CORR-001` gain indirect evidence.
- `CT-REP-SENT-001` remains weakly identified; `CT-SOC-STABILITY-001` remains a
  mathematical/Monte Carlo diagnostic.

Sources, licensing and atomic provenance are in the
[source manifest](G3D_P1_REPUTATION_RETIREMENT_SOURCE_LICENSE_MANIFEST.md) and
[Evidence Index](G3D_P1_REPUTATION_RETIREMENT_EVIDENCE_INDEX.md).
