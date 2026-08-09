# Award Catalog Evidence

## 1. Artifact header

```yaml
artifactId: AWARD_CATALOG_EVIDENCE
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-AWARD-CATALOG
state: EVIDENCE_COMPLETE_WITH_LIMITATIONS
slotCount: 5
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  PRODUCT_OWNER: PROJECT_MAINTAINER_AS_PRODUCT_OWNER
  SCORING_OWNER: PROJECT_MAINTAINER_AS_SCORING_OWNER
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

This artifact selects real gameplay award candidates. It does not assign scoring
points; scoring bindings are separately recorded in
[`SCORING_CATALOG_EVIDENCE.md`](SCORING_CATALOG_EVIDENCE.md).

## 2. Recommended five-slot catalog

| Slot | Candidate ID / edition | Family | Eligibility/evaluation | Field/ordinal/tie evidence | Evidence | State |
|---|---|---|---|---|---|---|
| global comparative | `BALLON_DOR_MEN-2025` | `COMPARATIVE_JUDGED` | men's global award evaluating the closed 2024/25 sporting period | 30 nominees; journalist jury; ranked points; first-place then next-place vote tie-break; nomination/placement/winner from one ranking | `EV-P0-032`, `EV-P0-033` | `COMPLETE_WITH_LIMITATIONS` |
| young comparative | `KOPA_TROPHY_MEN-2025` | `COMPARATIVE_JUDGED` | best player under 21 at the edition's 31 July reference | 10 nominees; Ballon d'Or winners vote top three; first-/second-place vote tie-break | `EV-P0-034`, `EV-P0-035` | `COMPLETE_WITH_LIMITATIONS` |
| league player | `LALIGA_POTY-2025-26` | `COMPARATIVE_JUDGED` | LALIGA EA SPORTS season 2025/26 | official existence/winner; complete candidate-field, ballot and tie mechanics not published in acquired pages | `EV-P0-038`, `EV-P0-039` | `RESEARCH_INCOMPLETE` for field/tie |
| league scorer | `LALIGA_TOP_SCORER-2025-26` (`PICHICHI` alias candidate) | `STATISTICAL` | most league goals in closed LALIGA 2025/26 | official leader/goal total; Pichichi name corroborated by winner club; shared/tie policy not verified from organizer rules | `EV-P0-040`, `EV-P0-041` | `RESEARCH_INCOMPLETE` for tie/official alias |
| GK positional | `YASHIN_TROPHY_MEN-2025` | `COMPARATIVE_JUDGED` | best goalkeeper, no league/nationality restriction | 10 nominees; journalist jury; ranked top three; first-/second-place vote tie-break | `EV-P0-036`, `EV-P0-037` | `COMPLETE_WITH_LIMITATIONS` |

The 2025 Ballon/Kopa/Yashin edition identities and winners are primary facts.
The detailed mechanics source is the co-organizer's 2024 rule explainer; G3D-3C
must confirm that the relevant mechanics remained unchanged in 2025 before
freezing those definitions.

## 3. Candidate data contract for G3D-3C

Each normalized `AwardDefinition` must contain:

```text
awardId
editionId
awardFamily: COMPARATIVE_JUDGED | STATISTICAL
organizerId
evaluationWindow
eligibilityRules[]
positionOrCategory
allowedSignals[]
abstractFieldModelRef
fieldSize
ordinalStates[]
tiePolicy
finalizationTiming
sourceEvidenceIds[]
scoringBindingId?
```

Missing field size or tie policy is not supplied by the mathematical default.
The math spec supports policies; data must choose one supported policy.

## 4. Ordinal semantics acquired

- Ballon d'Or has a 30-player field and a single ordered result; nomination,
  shortlist/top-N, placement and winner can derive coherently from that rank.
- Kopa/Yashin have ten-player fields and one ranked winner process.
- LALIGA POTY winner existence is verified, but the acquired page does not
  expose enough voting detail to reconstruct a complete abstract field.
- League scorer is statistical and must not pass through judged utility. Its
  leaderboard/tie policy remains an explicit data field.

## 5. Scoring and reputation boundaries

- No web source selected or changed point values.
- Ballon/Kopa/Yashin/league POTY/scorer map to already approved scoring
  categories only after a separate `AwardScoringDefinition` is published.
- The current award edition cannot consume reputation produced by its own
  outcome.
- Award anti-duplication belongs to scoring, not this catalog.

## 6. Research stopping result

All five slots have concrete candidates and primary identity/existence evidence.
Two candidates lack complete public mechanics. This satisfies acquisition for
candidate selection but not full `AwardDefinition` publication. G3D-3C may
normalize the three global candidates and preserve the two league definitions
as blocked fields; it must not invent their tie/field policy.

## 7. Artifact review declaration

- Evidence selection: `EV-P0-032` through `EV-P0-041`.
- Owner approvals: `DATA_OWNER`, `PRODUCT_OWNER`, `SCORING_OWNER` as declared
  in header.
- Limitations: 2025 comparative-rule continuity and the two LaLiga field/tie
  contracts listed in §2/§6.
- Unresolved material conflicts: none. Unpublished fields and Tier-B
  corroboration are not conflicts and remain insufficient for freeze.
