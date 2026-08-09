# National Team Reference Evidence

## 1. Artifact header

```yaml
artifactId: NATIONAL_TEAM_REFERENCE_EVIDENCE
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-NATIONAL-CATALOG
state: EVIDENCE_COMPLETE_WITH_LIMITATIONS
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  PRODUCT_OWNER: PROJECT_MAINTAINER_AS_PRODUCT_OWNER
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

## 2. Identity and eligibility boundary

| Field | Acquired fact | Evidence | Publication interpretation |
|---|---|---|---|
| association/team | Asociacion del Futbol Argentino / Argentina senior men's team context | `EV-P0-062` | publish stable national association/team IDs; no player identities required |
| sporting nationality V1 | Argentina is the protagonist's only initial sporting eligibility | `EV-P0-063` | product policy from ADR-082; Spain does not grant eligibility |
| governing rule reference | FIFA eligibility framework | `EV-P0-031` | reference for catalog/schema; does not infer an individual eligibility fact |
| eligibility resolver output | boolean/typed `InternationalEligibilityResult` upstream of selection | internal G3C contract | ineligible implies zero call-up probability and no RNG consumption |

Naturalization, second nationality, association changes and youth cap-tie logic
remain out of V1. This artifact does not reopen ADR-082.

## 3. Baseline international context

The latest closed senior major competition compatible with the cutoff is:

| Canonical edition ID | seasonId | Format | Period | Argentina outcome | Evidence |
|---|---|---|---|---|---|
| `FIFA-WORLD-CUP-2026` | `INT-WC-2026` | 48 teams; 12 groups of four; top two plus eight best thirds to R32; knockout thereafter | 11 Jun-19 Jul 2026 | runner-up after Spain 1-0 Argentina final | `EV-P0-028`..`EV-P0-030` |

This supplies major-tournament phases, international pressure context and a
closed national achievement fact. It does not initialize call-up probabilities,
selection fields or NationalTeam strengths.

## 4. Calendar/reference inputs available for normalization

```text
NationalCompetitionEvidence {
  nationalTeamId: ARG_SENIOR_MEN
  editionId: FIFA-WORLD-CUP-2026
  startDate: 2026-06-11
  endDate: 2026-07-19
  groupMatchOpportunity: 3
  laterExposure: CONDITIONAL_BY_PROGRESSION
  phaseIds: GROUP | ROUND_OF_32 | ROUND_OF_16 | QUARTER_FINAL |
            SEMI_FINAL | THIRD_PLACE | FINAL
  pressureProfileRef: PENDING_PARAMETER_CALIBRATION
  evidenceIds: EV-P0-028..EV-P0-030
}
```

No complete regular-window calendar was acquired. G3D-3C may publish the major
competition definition and a generic `REGULAR_SENIOR_WINDOW` structural slot,
but must not publish dated regular windows without further official calendar
evidence.

## 5. Reach and selection-field availability

P0 verified official identity, major context and rule authority only. These
remain P1/P3 evidence requirements:

- historical Argentina call-ups, squad lists and international minutes;
- position-specific selection competition fields;
- generation-strength histories;
- national/public reach and visibility measures;
- regular senior-window timing and match opportunity outside the major edition.

No MarketValue, CareerScore or hidden TrueCapabilities were acquired or
authorized as selection inputs.

## 6. State and blockers

`RS-P0-NATIONAL-CATALOG` is `COMPLETE_WITH_LIMITATIONS`: enough evidence exists
for Argentina identity, Argentina-only eligibility binding and the closed major
edition. Full NationalTeam/Calendar publication remains partial until regular
senior windows and a versioned current FIFA rule reference are normalized.

## 7. Artifact review declaration

- Evidence selection: `EV-P0-028` through `EV-P0-031` and `EV-P0-062` through
  `EV-P0-063`.
- Owner approvals: `DATA_OWNER`, `PRODUCT_OWNER` as declared in header.
- Limitations: ordinary senior windows, reach and selection-field history are
  not acquired.
- Unresolved material conflicts: none. Argentina-only eligibility is product
  policy under ADR-082, not an empirical claim about an individual.
