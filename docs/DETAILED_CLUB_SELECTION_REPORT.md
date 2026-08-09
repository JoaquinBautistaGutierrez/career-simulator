# Detailed Club Selection Report

## 1. Artifact header

```yaml
artifactId: DETAILED_CLUB_SELECTION_REPORT
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-CLUB-IDENTITY
state: EVIDENCE_COMPLETE
selectionCount:
  Argentina: 8
  Spain: 8
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  PRODUCT_OWNER: PROJECT_MAINTAINER_AS_PRODUCT_OWNER
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

Selection is a portfolio decision, not a rating. `coverageRole` explains why a
slot is useful for calibration scenarios; it does not initialize attack,
defence, control, prestige, finance, development, medical quality or stability.

## 2. Frozen selection

### Argentina — `ARG-LPF-APERTURA-2026`

| Candidate ID | Canonical name | Short/identity aliases | Baseline membership evidence | Coverage role and inclusion rationale |
|---|---|---|---|---|
| `ARG-RIVER-PLATE` | Club Atletico River Plate | River Plate; River | `EV-P0-042` | global/regional anchor; elite-pressure and continental route |
| `ARG-BOCA-JUNIORS` | Club Atletico Boca Juniors | Boca Juniors; Boca | `EV-P0-043` | high-reach anchor with contrasting sporting path |
| `ARG-RACING-CLUB` | Racing Club | Racing | `EV-P0-044` | large-club bridge; domestic/continental scenario coverage |
| `ARG-INDEPENDIENTE` | Club Atletico Independiente | Independiente | `EV-P0-045` | historic large-club trajectory contrast; recovery/volatility scenarios |
| `ARG-ESTUDIANTES-LP` | Club Estudiantes de La Plata | Estudiantes; Estudiantes LP | `EV-P0-046` | institutional/development-route contrast and continental relevance |
| `ARG-VELEZ-SARSFIELD` | Club Atletico Velez Sarsfield | Velez; Velez Sarsfield | `EV-P0-047` | development and medium/high sporting bridge |
| `ARG-ARGENTINOS-JUNIORS` | Asociacion Atletica Argentinos Juniors | Argentinos Juniors; Argentinos | `EV-P0-048` | development pathway and smaller-reach contrast |
| `ARG-ROSARIO-CENTRAL` | Club Atletico Rosario Central | Rosario Central; Central | `EV-P0-049` | non-Buenos-Aires regional reach and institutional-context diversity |

### Spain — `ESP-LALIGA-2025-26`

| Candidate ID | Canonical name | Short/identity aliases | Baseline membership evidence | Coverage role and inclusion rationale |
|---|---|---|---|---|
| `ESP-REAL-MADRID` | Real Madrid CF | Real Madrid | `EV-P0-050` | global anchor; maximum-reach/pressure scenario |
| `ESP-FC-BARCELONA` | FC Barcelona | Barcelona; Barca | `EV-P0-051` | global anchor with contrasting tactical/development route |
| `ESP-ATLETICO-MADRID` | Club Atletico de Madrid | Atletico de Madrid; Atletico | `EV-P0-052` | high-level third anchor and tactical contrast |
| `ESP-ATHLETIC-CLUB` | Athletic Club | Athletic; Athletic Bilbao (non-canonical alias only) | `EV-P0-053` | regional/institutional identity contrast and constrained pathway scenarios |
| `ESP-REAL-SOCIEDAD` | Real Sociedad de Futbol | Real Sociedad | `EV-P0-054` | development/regional route and cup relevance |
| `ESP-VILLARREAL` | Villarreal CF | Villarreal | `EV-P0-055` | medium-market/continental bridge |
| `ESP-SEVILLA` | Sevilla FC | Sevilla | `EV-P0-056` | historic continental route with volatility scenario usefulness |
| `ESP-GIRONA` | Girona FC | Girona | `EV-P0-057` | smaller-context/mobility case; baseline membership is retained even though the closed edition produced relegation |

## 3. Portfolio coverage matrix

The matrix is categorical selection rationale (`PRODUCT_DEFINED` under
`EV-P0-058`), never an observed score. `P1` means a baseline source still must
be acquired before that dimension can initialize gameplay.

| Club | Sporting coverage | Scale/reach coverage | Development route | Financial/institutional contrast | Continental/mobility usefulness | Evidence availability now |
|---|---|---|---|---|---|---|
| River | anchor | global/regional | P1 | P1 | Libertadores | Tier A identity/format |
| Boca | anchor | global/regional | P1 | P1 | Libertadores/market | Tier A identity/format |
| Racing | high bridge | large | P1 | P1 | continental | Tier A identity/format |
| Independiente | trajectory contrast | large | P1 | P1 | recovery path | Tier A identity/format |
| Estudiantes LP | bridge | regional | explicit P1 priority | P1 | cup/continental | Tier A identity/format |
| Velez | bridge | medium | explicit P1 priority | P1 | market path | Tier A identity/format |
| Argentinos | smaller bridge | medium | explicit P1 priority | P1 | debut/sale path | Tier A identity/format |
| Rosario Central | regional bridge | regional | P1 | P1 | geographic diversity | Tier A identity/format |
| Real Madrid | anchor | global | P1 | P1 | UCL | Tier A identity/format |
| Barcelona | anchor | global | explicit P1 priority | P1 | UCL | Tier A identity/format |
| Atletico Madrid | high bridge | global/regional | P1 | P1 | UCL | Tier A identity/format |
| Athletic Club | regional high/mid | regional | explicit P1 priority | P1 | policy/path contrast | Tier A identity/format |
| Real Sociedad | bridge | regional | explicit P1 priority | P1 | cup/continental | Tier A identity/format |
| Villarreal | bridge | medium | P1 | P1 | UCL/continental | Tier A identity/format |
| Sevilla | trajectory contrast | large/regional | P1 | P1 | continental history | Tier A identity/format |
| Girona | mobility/smaller | regional | P1 | P1 | relegation/materialization | Tier A identity/format |

## 4. Explicit exclusions

No club was excluded because a gameplay rating was too low. Candidates outside
the 16 remain real, materializable identities under the external-pool policy.
The following selection approaches were rejected:

- top eight of the current/final table only;
- popularity-only selection;
- financial ranking without date/provenance;
- assuming development or medical quality from reputation;
- protecting large identities from decline or relegation.

Girona is intentionally retained because it belonged to the closed reference
edition (`EV-P0-057`) and supplies a real mobility case (`EV-P0-080`). G3D-3C
must keep edition membership distinct from the next-edition league membership.

## 5. P1 evidence still required

For all 16, `DS-CLUB-VERTICAL-SLICE` remains incomplete beyond identity. P1 must
acquire dated/provenanced evidence or proxies for attack/defence/control,
prestige, financial power, development quality, medical quality, stability and
reach. This report authorizes no numerical or ordinal gameplay baseline.

## 6. Artifact review declaration

- Evidence selection: membership/identity rows `EV-P0-042` through
  `EV-P0-058` plus product-policy records referenced inline.
- Owner approvals: `DATA_OWNER`, `PRODUCT_OWNER` as declared in header.
- Limitations: this is an identity/portfolio selection, not acquisition of the
  eight gameplay baseline dimensions.
- Unresolved material conflicts: none. Excluded candidates remain eligible for
  the materializable pool and were not assigned negative factual ratings.
