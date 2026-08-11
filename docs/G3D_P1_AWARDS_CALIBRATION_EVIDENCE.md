# G3D-4D P1 Awards Calibration Evidence

Status: `NORMALIZED_WITH_LIMITATIONS`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Scope: the five frozen V1 slots only. Real award observations constrain future
calibration; they do not replace the G3C comparative/statistical models, create
ScoringConfiguration points or modify tier thresholds.

## 1. Real rule versus simulation model

| Evidence concept | Real-world observation | V1 simulation consumer |
|---|---|---|
| Official nominees | published shortlist/candidate count | field-scale evidence; not necessarily latent field size |
| Human ballot | organizer procedure when public | provenance/calibration context; not reproduced vote by vote |
| Comparative winner | ordinal closed-edition fact | comparative field/output validation |
| Statistical leader | goals and rank | player observed statistic versus NB2 abstract field |
| Tie handling | real rule when public | catalog provenance; V1 tie policy remains definition-driven |
| Award points | none inferred | belongs only to ScoringConfiguration |

The official nomination field and the abstract `AwardCompetitionField` are
deliberately separate. The former can be directly observed; the latter includes
the unobserved comparison population required by the mathematical model.

## 2. Frozen slot evidence

| Slot | 2025/26 field evidence | Longitudinal evidence | Readiness |
|---|---|---|---|
| Ballon d'Or men | 30 official nominees in 2025 | seven awarded editions 2018-2025, five unique winners | `READY_WITH_LIMITATIONS` |
| Kopa men | 10 official nominees in 2025 | seven awarded editions, six unique winners | `READY_WITH_LIMITATIONS` |
| LALIGA Player of the Season | official 2025/26 winner; procedure not fully public | five-name 2023/24 field and mixed electorate | `JOINT_CALIBRATION_REQUIRED` |
| LALIGA Top Scorer | closed-edition top two and statistical identity | 2023/24 and 2025/26 upper-tail observations | `READY_FOR_INITIAL_ESTIMATION` |
| Yashin | 10 official nominees in 2025 | six awarded editions, four unique winners | `READY_FOR_INITIAL_ESTIMATION` |

`NOT_PUBLICLY_DOCUMENTED` 2025/26 POTY ballot details remain nonblocking: V1
does not reproduce the human ballot. Identity, evaluation window, comparative
family and winner fact are sufficient for the catalog; comparative weights are
calibration parameters and remain unassigned.

## 3. Comparative winner concentration

### Ballon d'Or

The awarded editions 2018-2025, excluding the cancelled 2020 edition, contain
seven winners and five unique players. Messi won three of the seven. This is
direct evidence that repeat wins are possible and that universal independent
winner sampling would be a poor empirical assumption. It is a small, selected
tail and cannot become a direct repeat probability.

Contextual position mapping for those winners gives:

| Mapping | Award observations | Limitation |
|---|---:|---|
| GK | 0 | does not imply impossibility |
| CM-like | 2 | Modric and Rodri are compatible with CM-like evaluation |
| Forward/ST-like | 5 | role labels include non-strict wide/forward cases |

The mapping is a representation diagnostic, not a fairness target and not an
engine weight.

### Kopa

Seven awarded editions produced six unique winners; Lamine Yamal repeated in
2024 and 2025. Winner positions span defender, CM-like and forward categories.
This supports a comparative young-player field with repeat tails and prohibits
hard anti-duplication, while leaving cross-position transforms jointly
calibrated.

### Yashin

Six awarded editions produced four unique winners. Emiliano Martinez repeated
in 2023-2024; Donnarumma won in 2021 and 2025. The GK-specific path therefore
has both repeatability and turnover. Its 10-name 2025 official field supports a
direct catalog input but not the latent field's stochastic scale.

## 4. LALIGA Player of the Season

The 2023/24 organizer publication exposed five candidates and a choice spanning
fans, club captains and experts. The 2025/26 organizer publication verifies
Lamine Yamal as winner and reports 16 goals and 12 assists. The earlier mechanism
is not silently projected onto the later edition. It demonstrates that a small
published comparative field and multiple signal families can coexist; it does
not identify 2025/26 ballot weights.

The published winner production is associated evidence only. Comparative
utility may consume authorized contextual Performance/Production and
achievements, but no coefficient is estimated here and MarketValue/CareerScore
remain excluded.

## 5. LALIGA Top Scorer statistical field

Two closed-edition upper-tail observations are retained:

| Edition | Winner goals | Runner-up goals | Gap | Source semantics |
|---|---:|---:|---:|---|
| 2023/24 | 24 | 23 | 1 | LALIGA organizer account |
| 2025/26 | 25 | 23 | 2 | official scorer-table capture |

These observations support the upper-tail scale and close-race diagnostics for
the NB2 statistical competition field. They are not enough alone to estimate
NB2 mean/dispersion or tie frequency. A versioned multi-season full scorer table
with minutes/exposure remains required for direct distribution fitting.

`Pichichi` is preserved as the external MARCA award/presentation alias. The
canonical simulator statistical fact remains LALIGA top scorer, preventing a
popular label from replacing the verified competition identity.

## 6. Cross-award correlations and bias

- Ballon/Kopa/Yashin/POTY nominees and winners are extreme-tail samples; they
  cannot identify the all-player Performance distribution.
- Repeated nominations/wins favor long successful careers and produce
  survivorship bias.
- Club and national titles can be associated with judged outcomes without
  setting causal utility coefficients.
- Reputation association is lagged and authorized only by AwardDefinition; it
  remains for G3D-4E and joint calibration.
- Kopa/Ballon overlap can constrain correlated field strength only after a
  versioned nominee panel is acquired; no anti-duplication is added.
- Statistical leader counts are observed facts. The engine does not resample
  the protagonist's production when ranking a statistical award.

## 7. Parameter identifiability

| Family | Classification | Evidence basis / remaining need |
|---|---|---|
| Official field sizes | `DIRECTLY_ESTIMABLE` | 30/10/10 official 2025 fields; definition data, not universal parameters |
| Repeat nomination/win summaries | `DIRECTLY_ESTIMABLE` | official longitudinal histories; nominee panel still partial |
| Yashin position field | `DIRECTLY_ESTIMABLE` | GK-only identity and repeat series |
| Top-scorer upper tail | `DIRECTLY_ESTIMABLE` with more editions | two direct closed-edition observations now; full table needed |
| Statistical NB2 location/dispersion | `JOINT_CALIBRATION_REQUIRED` | requires multi-season full fields plus G3D-4A production |
| Comparative field location/scale/tails | `JOINT_CALIBRATION_REQUIRED` | nominees are selected tail; latent field larger/different |
| Judging Performance/achievement weights | `JOINT_CALIBRATION_REQUIRED` | observational association and product behavior both apply |
| Reputation/history effect | `WEAKLY_IDENTIFIED` | lagged public/sporting reputation evidence deferred to G3D-4E |
| Cross-era award equivalence | `WEAKLY_IDENTIFIED` | rule/field changes and missing 2020 edition |
| Position transforms | `JOINT_CALIBRATION_REQUIRED` | strict GK/CM/ST and broader award roles do not align one-to-one |

## 8. Calibration readiness matrix

| Area | Readiness |
|---|---|
| Global comparative award | `READY_WITH_LIMITATIONS` |
| Young comparative award | `READY_WITH_LIMITATIONS` |
| GK positional award | `READY_FOR_INITIAL_ESTIMATION` |
| League POTY | `JOINT_CALIBRATION_REQUIRED` |
| Statistical scorer award | `READY_WITH_LIMITATIONS` |
| Award repeatability | `READY_FOR_INITIAL_ESTIMATION` |
| Award position effects | `JOINT_CALIBRATION_REQUIRED` |
| Comparative judging weights | `WEAKLY_IDENTIFIED` |

No observed history changes award points, PPI/PSN, PC, tier thresholds or
ScoringConfiguration. Atomic provenance is in
[G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX.md](G3D_P1_NATIONAL_AWARDS_EVIDENCE_INDEX.md).
