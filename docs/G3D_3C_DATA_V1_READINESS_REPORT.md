# G3D-3C Data V1 Readiness Report

## 1. Decision

```yaml
phase: G3D-3C
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
referenceCutoffDate: 2026-08-07T23:59:59.999Z
candidateBundleId: G3D3C-P0-CATALOG-CANDIDATE-C1
canonicalIdCount: 114
originalEvidenceRecordCount: 81
sourceCount: 46
dataV1State: DATA_V1_NOT_PUBLISHED
overallResult: GO_FOR_G3D_3D_WITH_PARALLEL_P0_GAP_CLOSURE
```

G3D-3C successfully normalizes every P0 subset whose evidence is sufficient.
Atomic `Data V1` remains blocked by incomplete AwardDefinitions, ordinary
international calendar, monetary series and scoring resources. No acceptance
standard was lowered and no missing value was inferred.

## 2. Produced candidate catalogs

| Artifact | Scope | State |
|---|---|---|
| [Normalization Spec](G3D_P0_NORMALIZATION_SPEC.md) | pipeline, statuses, transforms, validation and gaps | normative candidate spec |
| [Canonical ID Registry](G3D_P0_CANONICAL_ID_REGISTRY.md) | 114 IDs and references | `VALIDATED_CANDIDATE` |
| [Reference & Competition Candidate](G3D_P0_REFERENCE_COMPETITION_CATALOG_CANDIDATE.md) | editions, six club competitions and World Cup context | `NORMALIZED_WITH_LIMITATIONS` |
| [Calendar Candidate](G3D_P0_CALENDAR_CANDIDATE.md) | stage→Q, exposure, market/registration | `NORMALIZED_WITH_LIMITATIONS` |
| [Club Identity Candidate](G3D_P0_CLUB_IDENTITY_CATALOG_CANDIDATE.md) | 16 identities/memberships | identity subset `VALIDATED_CANDIDATE` |
| [External Club Candidate](G3D_P0_EXTERNAL_CLUB_CATALOG_CANDIDATE.md) | hybrid class/materialization contract | `VALIDATED_CANDIDATE` |
| [National Team Candidate](G3D_P0_NATIONAL_TEAM_CATALOG_CANDIDATE.md) | Argentina senior + World Cup context | `NORMALIZED_WITH_LIMITATIONS` |
| [Award Candidate](G3D_P0_AWARD_CATALOG_CANDIDATE.md) | five identities/editions and missing mechanics | `NORMALIZED_WITH_LIMITATIONS` |
| [Money Bindings Candidate](G3D_P0_MONEY_BINDINGS_CANDIDATE.md) | ARS/EUR and four source routes | policy subset `VALIDATED_CANDIDATE` |
| [Scoring Candidate](G3D_P0_SCORING_CATALOG_CANDIDATE.md) | 12 identity bindings and normative rules | `NORMALIZED_WITH_LIMITATIONS` |
| [Hash Manifest](G3D_P0_CANDIDATE_HASH_MANIFEST.md) | SHA-256 and parent lineage | `VALIDATED_CANDIDATE_MANIFEST` |

## 3. Canonical identity coverage

| Kind | Count |
|---|---:|
| countries / regions | 2 / 3 |
| seasons | 6 |
| competitions / editions / formats | 7 / 7 / 7 |
| stages | 36 |
| detailed clubs | 16 |
| national teams | 1 |
| awards / award editions | 5 / 5 |
| currencies | 2 |
| calendar / market windows / registration policies | 1 / 2 / 2 |
| scoring definitions | 12 |
| **total** | **114** |

All canonical IDs are unique. Candidate-to-candidate references resolve; no
orphan gameplay/scoring identity was detected. Acquisition labels remain
provenance aliases, not competing canonical IDs.

## 4. Competition and calendar status

### 4.1 Six club CompetitionDefinitions

| Competition | Normalized result | Remaining limitation |
|---|---|---|
| Argentina Apertura 2026 | `VALIDATED_CANDIDATE` core; zones + single-match playoff preserved | annual Clausura/mobility completion is partial at cutoff |
| Copa Argentina 2025 | `NORMALIZED_WITH_LIMITATIONS` | complete per-round tie/qualification bindings |
| LaLiga 2025/26 | `VALIDATED_CANDIDATE` core; 20 clubs/38 matches/bottom-three output | full continental qualification binding |
| Copa del Rey 2025/26 | `NORMALIZED_WITH_LIMITATIONS` | detailed later-round/tie/qualification schema |
| Libertadores 2025 | `VALIDATED_CANDIDATE` aggregate core | no blocking core gap |
| Champions League 2025/26 | `VALIDATED_CANDIDATE` aggregate core | no blocking core gap |

FIFA World Cup 2026 is a seventh, national competition context candidate and is
`VALIDATED_CANDIDATE` for the acquired format/calendar subset.

### 4.2 Calendar/Q

Q mapping exists for Argentina annual, Spain cross-year, Libertadores, UCL,
domestic cups and World Cup. It is stage-aligned, not uniform. Guaranteed and
conditional exposure are separate. Exact within-stage counts stay pending when
the evidence only supports season totals. Argentina ordinary international
windows remain `PENDING_DATA`.

The market boundary is `POST_SEASON_ONLY` after full season close. There is no
V1 market between Apertura and Clausura. Next-season registration is a partial
candidate and no missing eligibility is assumed.

## 5. Club and external-club status

The 16 normalized detailed ClubDefinitions are:

- Argentina: River Plate, Boca Juniors, Racing, Independiente, Estudiantes de
  La Plata, Vélez Sarsfield, Argentinos Juniors and Rosario Central.
- Spain: Real Madrid, FC Barcelona, Atlético de Madrid, Athletic Club, Real
  Sociedad, Villarreal, Sevilla and Girona.

Identity, aliases, country and baseline membership are validated. Attack,
defense, control, prestige, finance, development quality, medical quality,
stability and reach remain `PENDING_DATA`; no baseline rating exists.

The external scope validates four classes: `DETAILED_SLICE`,
`MATERIALIZABLE_REAL`, `ABSTRACT_FIELD_ONLY` and `OUT_OF_SCOPE_V1`. The
materializable universe covers nominal competition, transfer, mobility and
comeback needs on demand. An abstract field can never become a named champion,
contract holder, counterparty, affiliation or fact actor.

## 6. National Team and Awards

Argentina senior identity, Argentina-only ADR-082 policy and World Cup 2026
context are normalized. Selection field, role/minutes parameters and ordinary
calendar are not calibrated/acquired.

Award states:

| Slot | Candidate | State | Exact blocker |
|---|---|---|---|
| global comparative | Ballon d'Or men 2025 | `NORMALIZED_WITH_LIMITATIONS` | 2025 continuity of field/ballot/tie |
| young comparative | Kopa Trophy men 2025 | `NORMALIZED_WITH_LIMITATIONS` | 2025 eligibility/rule continuity |
| league player | LaLiga Player of the Season 2025/26 | `NORMALIZED_WITH_LIMITATIONS` | field, ballot and tie |
| league scorer | LaLiga Top Scorer 2025/26 | `NORMALIZED_WITH_LIMITATIONS` | official Pichichi binding and tie |
| GK positional | Yashin Trophy men 2025 | `NORMALIZED_WITH_LIMITATIONS` | 2025 field/ballot/tie continuity |

No Pichichi alias was canonicalized and no tie/voting mechanism was invented.

## 7. Money and scoring

ARS and EUR definitions, centavo/cent minor-unit semantics and native-money
policy are `VALIDATED_CANDIDATE`. INDEC IPC, Eurostat HICP, BCRA A3500 and ECB
EXR are source bindings only. No series, rate, base date, inflation adjustment,
PPP or normalized amount was acquired or calculated. The dataset therefore
remains `SOURCE_IDENTIFIED`.

Scoring coverage binds seven Competition and five Award identities. Normative
rules transcribed without modification include domestic league/cup formulas,
Libertadores `2100`, Champions `2200`, World Cup `5000` plus placements,
Ballon `1800`, Kopa `500`, Yashin `700`, league POTY and scorer formulas.
Still absent: IJL publication, equivalence groups, records, milestones,
historic achievements and PRI/contribution/social cohorts. No scoring point was
inferred and no `ScoringConfiguration` was published.

## 8. Dataset promotions

| Dataset | G3D-3C state |
|---|---|
| `DS-COMPETITION-CATALOG` | `NORMALIZED_WITH_LIMITATIONS`; four core subdefinitions validated |
| `DS-NATIONAL-COMPETITION-CATALOG` | `NORMALIZED_WITH_LIMITATIONS`; identity/World Cup subset validated |
| `DS-CALENDAR-SLICE` | `NORMALIZED_WITH_LIMITATIONS` |
| `DS-AWARD-DEFINITION-CATALOG` | `NORMALIZED_WITH_LIMITATIONS` |
| `DS-SCORING-CATALOG` | `NORMALIZED_WITH_LIMITATIONS` |
| `DS-CLUB-VERTICAL-SLICE` | remains `SOURCE_IDENTIFIED`; identity subartifact validated |
| `DS-CURRENCY-INFLATION` | remains `SOURCE_IDENTIFIED`; policy/bindings subartifact validated |

The other 33 datasets are unchanged. No dataset is `FROZEN`.

## 9. Goldens, targets and parameters

- 139 goldens remain `SPECIFIED`; zero expected outputs were computed.
- 50 catalog-dependent goldens now have explicit candidate bindings.
- `GV-MOBILITY-BOUNDARY-001`, `GV-NT-INELIGIBLE-001` and
  `GV-MONEY-ERROR-001` have complete catalog identity inputs for future fixture
  freeze, but are not `INPUTS_FROZEN`.
- 186 targets retain their types/tolerance gates; catalog dependencies changed,
  not values or tolerances.
- 275 parameter templates retain their paths and unassigned values.
- Candidate cardinalities are now explicit for 16 clubs, six club competitions,
  seven total competition contexts, seven editions/formats, one national team,
  five awards, two currencies, four money routes and 12 scoring identities.

## 10. Domain readiness classification

| Domain | Readiness | Reason |
|---|---|---|
| canonical identity registry | `READY_FOR_FREEZE` as candidate subset | unique/referentially valid; awaits atomic bundle |
| competition core | `READY_WITH_NONBLOCKING_LIMITATIONS` | six normalized, two partial detail sets |
| domestic/continental calendar | `READY_WITH_NONBLOCKING_LIMITATIONS` | stage/Q usable; exact within-stage counts partial |
| club identity | `READY_FOR_FREEZE` as subartifact | causal baselines are separate P1 data |
| external-club classification | `READY_FOR_FREEZE` as policy catalog | per-identity materialization remains demand-driven |
| national identity/major context | `READY_WITH_NONBLOCKING_LIMITATIONS` | ordinary windows pending |
| AwardDefinitions | `BLOCKED_BY_DATA` | three focused award gaps |
| monetary series artifact | `BLOCKED_BY_DATA` and `BLOCKED_BY_LICENSE` | no series/vintage/terms/transform |
| scoring complete catalog/config | `BLOCKED_BY_DATA` and `BLOCKED_BY_PRODUCT` | IJL/catalog/cohorts/product decisions |
| gameplay calibration | `BLOCKED_BY_DATA` | P1 evidence and product targets absent |

## 11. Surviving gaps

1. `GAP-P0-AWD-001`: 2025 comparative-rule continuity.
2. `GAP-P0-AWD-002`: LaLiga POTY field/ballot/tie.
3. `GAP-P0-AWD-003`: scorer/Pichichi official binding and tie.
4. `GAP-P0-CAL-001`: ordinary Argentina senior windows.
5. `GAP-P0-MON-001`: series/vintages and terms for four primary routes.
6. `GAP-P0-MON-002`: base date, missing-day/revision and exact transform.
7. `GAP-P0-SCR-001`: IJL/final scoring bindings.
8. `GAP-P0-SCR-002`: equivalence, records, milestones and historic catalog.
9. `GAP-P0-SCR-003`: PRI/contribution/social cohort transforms.

Only gaps 1-6 belong to a focused G3D-3B2. Gaps 7-9 belong to G3D-3D/P2 and
scoring calibration.

## 12. Next-phase readiness

- **G3D-3D:** GO. Product numeric targets can be decided without fabricating
  P0 evidence; G3D-3B2 should run in parallel.
- **G3D-3B2:** required for complete Award/Calendar/Money P0 closure, narrowly
  scoped to gaps above.
- **P1:** conditional readiness only. Independent player/performance/club
  research may be planned against stable candidate IDs after technical review,
  but P1 does not start in this phase and money/award/calendar-dependent joins
  must wait for their gaps.
- **Data V1:** `DATA_V1_NOT_PUBLISHED`; atomic freeze is prohibited while any
  blocking domain remains incomplete.

## 13. Compliance declaration

Cutoff and all 81 EvidenceRecords were preserved. Provenance and usage classes
propagate. No raw restricted data, parameter value, target tolerance, expected
golden, scoring config, gameplay rule or code implementation was added. Closed
ADR policies were not reopened.

> **Cardinality correction (G3D-4F/4G):** the 275-template count reported at
> the time was subsequently audited as a prose/counting error. The canonical
> registry contains 268 unique normative parameter templates; no seven paths
> are missing.

