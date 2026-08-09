# Scoring Catalog Evidence

## 1. Artifact header

```yaml
artifactId: SCORING_CATALOG_EVIDENCE
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-SCORING-NORMATIVE
state: EVIDENCE_COMPLETE_WITH_GAPS
ownerApprovals:
  SCORING_OWNER: PROJECT_MAINTAINER_AS_SCORING_OWNER
  PROVENANCE_REVIEWER: PROJECT_MAINTAINER_AS_PROVENANCE_REVIEWER
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

This artifact inventories existing normative scoring facts and gaps. It is not a
`ScoringConfiguration`, `ScoringCalibrationData` or `scoringVersion`
publication. External prestige did not determine points.

## 2. Classification rule

| State | Meaning |
|---|---|
| `NORMATIVE_ALREADY_DEFINED` | exact value/equation already exists in `MASTER_SPEC.docx` and/or `SCORING_MATH_SPEC.md` |
| `DATA_REQUIRED` | mathematical consumer exists, but edition/catalog binding is absent |
| `PRODUCT_REQUIRED` | no normative numeric choice exists; product/scoring owner must decide |
| `EXTERNAL_IDENTITY_REQUIRED` | real entity/edition must be verified, but the web cannot choose points |

## 3. Normative facts found

| Catalog area | Normative fact | Evidence | State |
|---|---|---|---|
| score composition | career score remains the exact sum of PRI, club team achievements, individual prizes, national, reputation/social and records/historic components under the math spec | `EV-P0-071` | `NORMATIVE_ALREADY_DEFINED` |
| domestic league | `ROUND_HALF_UP[650*(IJL/100)^1.35]`, precomputed per supported IJL | `EV-P0-072` | formula defined; exact edition IJL `DATA_REQUIRED` |
| domestic cup | 55% of the exact league base under the approved rounding/publication contract | `EV-P0-072` | formula defined; exact edition binding `DATA_REQUIRED` |
| Champions League | champion base `2200` | `EV-P0-073` | `NORMATIVE_ALREADY_DEFINED`; bind real edition ID |
| Libertadores | champion base `2100` | `EV-P0-073` | `NORMATIVE_ALREADY_DEFINED`; bind real edition ID |
| World Cup | champion `5000`, runner-up `1/2`, semifinalist `1/4` | `EV-P0-074` | `NORMATIVE_ALREADY_DEFINED`; bind `FIFA-WORLD-CUP-2026` |
| Ballon d'Or | `1800` | `EV-P0-075` | `NORMATIVE_ALREADY_DEFINED`; bind `BALLON_DOR_MEN` |
| Yashin/global GK | `700` | `EV-P0-075` | `NORMATIVE_ALREADY_DEFINED`; bind `YASHIN_TROPHY_MEN` |
| Kopa/global young | `500` | `EV-P0-075` | `NORMATIVE_ALREADY_DEFINED`; bind `KOPA_TROPHY_MEN` |
| league POTY | `ROUND_HALF_UP[350*IJL/100]` | `EV-P0-075` | formula defined; exact LALIGA IJL/binding required |
| league scorer/assist/GK | `ROUND_HALF_UP[220*IJL/100]` | `EV-P0-075` | formula defined; exact LALIGA IJL/binding required |
| equivalence/anti-duplication | global-equivalent awards require explicit equivalence membership/order; no inferred prestige ordering | `EV-P0-076` | policy defined; membership catalog required |

## 4. Exact catalog gaps

| Definition family | Gap | Classification | Unblocked by |
|---|---|---|---|
| `CompetitionScoringDefinition` | canonical gameplay IDs/edition aliases for the six club competitions | `EXTERNAL_IDENTITY_REQUIRED` | G3D-3C normalized competition catalog |
| `CompetitionScoringDefinition` | final V1 IJL values for Argentina and Spain and verified precomputed domestic bases | `DATA_REQUIRED` + `SCORING_OWNER` publication | scoring catalog candidate and independent arithmetic golden |
| `CompetitionScoringDefinition` | exact outcome multipliers for all runner-up/round-reached states not already listed in the normative table | `PRODUCT_REQUIRED` where absent | scoring owner decision; not web research |
| `NationalCompetitionScoringDefinition` | binding of `FIFA-WORLD-CUP-2026` to existing World Cup values | `EXTERNAL_IDENTITY_REQUIRED` | national catalog normalization |
| `NationalCompetitionScoringDefinition` | any regular-window/friendly scoring behavior | `PRODUCT_REQUIRED` or explicit zero definition | scoring owner; not inferred from FIFA |
| `AwardScoringDefinition` | binding five selected award IDs to Ballon/Kopa/Yashin/league POTY/scorer categories | `EXTERNAL_IDENTITY_REQUIRED` | award catalog normalization and rule-field completion |
| `AwardScoringDefinition` | LALIGA scorer official alias/tie handling | `DATA_REQUIRED` | organizer rule evidence or explicit supported statistical policy |
| equivalence groups | exact global-equivalence group membership and ordering beyond known category policy | `DATA_REQUIRED`/`PRODUCT_REQUIRED` | approved catalog; no prestige inference |
| `RecordScoringDefinition` | each record identity, eligibility, scope, exact value and upgrade/stacking rule | `DATA_REQUIRED`/`PRODUCT_REQUIRED` | P2 records research and scoring approval |
| `CareerMilestoneDefinition` | milestone identities and exact values | `PRODUCT_REQUIRED` | product/scoring catalog decision |
| `HistoricAchievementDefinition` | authorized historic identities, exact values and factual detectors | `DATA_REQUIRED`/`PRODUCT_REQUIRED` | P2 facts plus scoring approval |
| IJL table | frozen edition-independent league entries, provenance and hash | `DATA_REQUIRED` | `ScoringConfiguration` candidate; MASTER examples alone are not a published bundle |
| PRI cohort transforms | GK/CM/ST cohort distributions and evidence bands | `DATA_REQUIRED` | P2 PRI datasets; not P0 |
| social/historic transforms | cohort transforms and tier diagnostics | `DATA_REQUIRED` + product targets | P2 plus numeric product freeze |

## 5. Important non-findings

- The web was not used to choose points or IJL values.
- `MASTER_SPEC.docx` labels the league/IJL table as initial balance examples;
  G3D-3B does not promote those examples to a frozen scoring bundle
  (`EV-P0-077`).
- Record ranges are not enough to publish exact record definitions
  (`EV-P0-078`).
- Competition strength, financial power, prestige, follower counts and
  MarketValue do not substitute for scoring definitions.
- AwardDefinition gameplay rules and AwardScoringDefinition values remain
  separate artifacts and versions.

## 6. Publication gate

`DS-SCORING-CATALOG` can advance to `ACQUIRED` for the internal normative
extraction. It cannot advance to `NORMALIZED`, `VALIDATED` or `FROZEN` until:

1. real competition/award IDs are normalized;
2. IJL and all exact missing values are approved;
3. equivalence/record/milestone/historic catalogs are complete;
4. `ScoringCalibrationData` and independent goldens exist;
5. the resulting configuration has a scoring identity/hash and passes Gates 6
   and 7.

## 7. Artifact review declaration

- Evidence selection: `EV-P0-071` through `EV-P0-078`, with external identity
  EvidenceRecords referenced only for catalog identity.
- Owner approvals: `SCORING_OWNER`, `PROVENANCE_REVIEWER` as declared in header.
- Limitations: exact gaps in §4 remain `DATA_REQUIRED` or `PRODUCT_REQUIRED`.
- Unresolved material conflicts: none; provisional examples and normative
  values are kept in distinct classifications rather than reconciled by choice.
