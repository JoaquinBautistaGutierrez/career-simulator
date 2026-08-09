# Award Catalog Evidence

## 1. Artifact header

```yaml
artifactId: AWARD_CATALOG_EVIDENCE
artifactVersion: g3d-3b2-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-AWARD-CATALOG
state: EVIDENCE_COMPLETE_WITH_NONBLOCKING_LIMITATIONS
slotCount: 5
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  PRODUCT_OWNER: PROJECT_MAINTAINER_AS_PRODUCT_OWNER
  SCORING_OWNER: PROJECT_MAINTAINER_AS_SCORING_OWNER
artifactHashStatus: CANDIDATE_HASHED
candidateArtifactHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

This artifact selects real gameplay award candidates. It does not assign scoring
points; scoring bindings remain separate in
[`SCORING_CATALOG_EVIDENCE.md`](SCORING_CATALOG_EVIDENCE.md).

## 2. Recommended five-slot catalog

| Slot | Candidate ID / edition | Family | Eligibility/evaluation | Field/ordinal/tie evidence | Evidence | State |
|---|---|---|---|---|---|---|
| global comparative | `BALLON_DOR_MEN-2025` | `COMPARATIVE_JUDGED` | men's global award evaluating the closed 2024/25 sporting period | 30 nominees and top-100-country journalist electorate verified for 2025; top-ten ballot and ordered tie-break verified by continuity from the unchanged 2024 procedure | `EV-P0-032`, `EV-P0-033`, `EV-P0-082`, `EV-P0-083` | `VALIDATED_CANDIDATE` |
| young comparative | `KOPA_TROPHY_MEN-2025` | `COMPARATIVE_JUDGED` | best young men's player; under-21/31 July reference rule verified by continuity | 10 nominees and former men's Ballon d'Or winners as electorate verified for 2025; top-three ballot/tie order verified by continuity | `EV-P0-034`, `EV-P0-035`, `EV-P0-084`, `EV-P0-085` | `VALIDATED_CANDIDATE` |
| league player | `LALIGA_POTY-2025-26` | `COMPARATIVE_JUDGED` | official LALIGA EA SPORTS season 2025/26 award | identity, organizer context, evaluation edition and unique observed winner verified; real candidate-field, electorate, ballot split and tie procedure are `NOT_PUBLICLY_DOCUMENTED` and are not causal V1 fields | `EV-P0-038`, `EV-P0-039`, `EV-P0-088` | `VALIDATED_CANDIDATE_WITH_NONBLOCKING_LIMITATION` |
| league scorer | `LALIGA_TOP_SCORER-2025-26`; presentation/external alias `PICHICHI` | `STATISTICAL` | most league goals in closed LALIGA 2025/26 | LALIGA recognizes Pichichi as the top-scorer prize while MARCA awards the named trophy; real tie procedure is `NOT_PUBLICLY_DOCUMENTED`, and the simulation explicitly selects `SHARED` | `EV-P0-040`, `EV-P0-041`, `EV-P0-089`, `EV-P0-090` | `VALIDATED_CANDIDATE_WITH_NONBLOCKING_LIMITATION` |
| GK positional | `YASHIN_TROPHY_MEN-2025` | `COMPARATIVE_JUDGED` | men's goalkeeper award | 10 nominees and the men's Ballon d'Or jury verified for 2025; top-three ballot and ordered tie-break verified by continuity | `EV-P0-036`, `EV-P0-037`, `EV-P0-086`, `EV-P0-087` | `VALIDATED_CANDIDATE` |

The 2025 nominee release and final voting publication establish the edition's
field/electorate and ordered result. Where the 2025 publication does not repeat
the full ballot algorithm, the co-organizer's 2024 procedure is retained as
`VERIFIED_BY_CONTINUITY`, never promoted to an independently published 2025
rule. No contrary 2025 rule was found under the stopping policy.

## 3. Candidate data contract

Each normalized `AwardDefinition` contains:

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
fieldSizeOrProfile
ordinalStates[]
tiePolicy
finalizationTiming
sourceEvidenceIds[]
scoringBindingId?
```

`fieldSizeOrProfile` may be a published real field size or a versioned abstract
simulation-field profile when the real process is not public. A simulation tie
policy is always explicit and is not represented as a claim about an unpublished
human ballot.

## 4. Ordinal semantics acquired

- Ballon d'Or has a 30-player field and a single ordered result; nomination,
  shortlist/top-N, placement and winner derive coherently from that rank.
- Kopa and Yashin each have a ten-player field and one ranked winner process.
- LALIGA POTY winner existence is verified. The official pages do not publish
  candidate-field, electorate, weighting or tie details; those are
  `NOT_PUBLICLY_DOCUMENTED`, useful for provenance/calibration but not required
  by the approved abstract comparative field.
- League scorer is statistical and never passes through judged utility. The
  canonical identity is the LALIGA top-scorer fact; `Pichichi` is an external
  MARCA award/presentation alias acknowledged by LALIGA, not an organizer-owned
  canonical gameplay ID.

## 5. Real-rule versus simulation-field classification

| Field | Status | V1 consumer class | Candidate treatment |
|---|---|---|---|
| identity, edition, organizer context, family, eligibility/category, evaluation window | `VERIFIED` or `VERIFIED_BY_CONTINUITY` | A — canonical Definition | required and bound to EvidenceRecords |
| published real field/electorate/ballot/tie | `VERIFIED` or `VERIFIED_BY_CONTINUITY` | B/C — calibration/provenance unless separately consumed | retained as observed metadata |
| unpublished LALIGA POTY field/electorate/ballot/tie | `NOT_PUBLICLY_DOCUMENTED` | C/D — provenance only / not required by V1 | abstract field and `UNIQUE_CANONICAL` simulation tie policy remain explicit |
| scorer metric | `VERIFIED` | A — canonical statistical Definition | `leagueGoals` |
| real scorer tie procedure | `NOT_PUBLICLY_DOCUMENTED` | C — provenance only | never inferred as a real rule |
| simulation scorer tie policy | `PRODUCT_DEFINED` | A — canonical statistical Definition | `SHARED`; equal factual rank, no RNG |
| literal voter-by-voter reproduction | `NOT_APPLICABLE` | D — no V1 consumer | excluded |

`REAL_AWARD_RULE` and `SIMULATION_AWARD_MODEL` are separate namespaces. The
second follows `NATIONAL_TEAM_AWARDS_MATH_SPEC.md`; it does not pretend to copy
the first vote by vote.

## 6. Scoring and reputation boundaries

- No web source selected or changed point values.
- Award identities map to approved scoring categories only after a separate
  `AwardScoringDefinition` is published.
- The current award edition cannot consume reputation produced by its outcome.
- Award anti-duplication belongs to scoring, not this catalog.

## 7. Research stopping result

All five slots have concrete, consumer-complete candidates. The LALIGA POTY
real ballot remains non-public, but no V1 causal field requires literal ballot
reproduction. That limitation is preserved and does not block the abstract
`AwardDefinition`. No rule was invented and no scoring point was assigned.

## 8. Artifact review declaration

- Evidence selection: `EV-P0-032` through `EV-P0-041` plus
  `EV-P0-082` through `EV-P0-090`.
- Owner approvals: `DATA_OWNER`, `PRODUCT_OWNER`, `SCORING_OWNER` as declared
  in the header.
- Limitations: 2025 ballot/tie details marked `VERIFIED_BY_CONTINUITY` and
  LALIGA POTY human procedure marked `NOT_PUBLICLY_DOCUMENTED`.
- Unresolved material conflicts: none. The Pichichi distinction is modeled as
  canonical statistical identity plus external/presentation alias, not as two
  conflicting awards.
