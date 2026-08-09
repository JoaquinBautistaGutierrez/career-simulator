# External Club Scope Manifest

## 1. Artifact header

```yaml
artifactId: EXTERNAL_CLUB_SCOPE_MANIFEST
artifactVersion: g3d-3b-candidate-1
schemaVersion: G3D_P0_ACQUISITION_SPEC.v1
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
producerResearchIds:
  - RS-P0-EXTERNAL-POOL
state: EVIDENCE_COMPLETE
policyAuthority: ADR-081
ownerApprovals:
  DATA_OWNER: PROJECT_MAINTAINER_AS_DATA_OWNER
  PRODUCT_OWNER: PROJECT_MAINTAINER_AS_PRODUCT_OWNER
artifactHashStatus: PENDING_G3D_3C_CANONICALIZATION
candidateArtifactHashRef: P0_EVIDENCE_INDEX.md#7-candidate-artifact-integrity
```

## 2. Frozen scope classes

| Class | V1 contents | Permitted nominal roles | Required evidence/materialization | Exclusions |
|---|---|---|---|---|
| `DETAILED_SLICE` | exactly the 16 clubs in `DETAILED_CLUB_SELECTION_REPORT` | all authorized club-state, contract, competition and history roles | full `ClubDefinition` plus P1 baselines | no identity floors or complete squad simulation |
| `MATERIALIZABLE_REAL` | remaining real clubs in the two domestic reference memberships; all 2025 Libertadores group participants; all 2025/26 UCL league-phase participants; real adjacent promoted/relegated clubs needed by mobility; an on-demand real transfer/comeback counterparty | champion, opponent, contract holder, sporting club, transfer party, named history fact | stable official identity + country/league/region + minimal sporting/prestige/finance/PositionNeed adapter at moment of use | no invented club; no silent fallback to abstract after nominal use |
| `ABSTRACT_FIELD_ONLY` | non-nominal competition, transfer and comeback background where no fact needs an identity | strength/scarcity/competition fields only | versioned distribution/context; no club identity | never champion, contract holder, transfer counterparty, nominal history fact or leaderboard identity |
| `OUT_OF_SCOPE_V1` | identities with no slice consumer | none | none | world-wide database, full squads and exhaustive lower tiers |

Evidence: `EV-P0-059` (36 UCL league-phase teams), `EV-P0-060` (32
Libertadores group teams), `EV-P0-061` (ADR-081 nominal invariant).

## 3. Minimal real universe

G3D-3C needs identity records for:

1. all 30 LPF 2026 clubs, because domestic outcome/mobility facts can name any
   participant;
2. all 20 LaLiga 2025/26 clubs, preserving edition membership;
3. the 32 Libertadores 2025 group-stage clubs;
4. the 36 UCL 2025/26 league-phase clubs;
5. promoted/relegated real identities crossing the adjacent membership boundary
   when a V1 mobility fact is materialized;
6. any transfer/loan/comeback counterparty selected on demand, before the
   transaction can become nominal.

Deduplication is by canonical real identity, not by membership row. The union is
smaller than the sum because some detailed/domestic clubs also appear in
continental fields.

Preliminary-round clubs do not need eager materialization solely for field
strength. They become `MATERIALIZABLE_REAL` if the simulated path names them or
if they become a contract/mobility counterparty. This avoids a world database
without allowing fictional nominal facts.

## 4. Minimal adapter for a materialized non-detailed club

```text
ExternalClubAdapter {
  realClubId
  canonicalName
  countryId
  regionId
  currentLeagueContextId
  membershipEvidenceRefs[]
  sportingStrengthContext
  prestigeContext
  financialPowerContext
  positionNeedCompetitionAbstraction
  uncertainty
  sourceRefs[]
  dataVersion
}
```

The contexts are calibrated later and are not ratings acquired in G3D-3B.
Materialization is deterministic under the published data/parameter identity.

## 5. Consumer mapping

| Consumer | Real identities required | Abstract-only use allowed |
|---|---|---|
| Libertadores/Champions outcome | any named participant/champion | opponent field before a nominal match-up |
| transfers/contracts | buyer, seller, holder, sporting club | market pressure/interest background only |
| promotion/relegation | promoted/relegated club when fact is emitted | non-nominal lower-tier field before resolution |
| comeback | signing club when affiliation changes | opportunity field before club selection |
| club history/scoring facts | every named club | never |

## 6. Publication boundary

This manifest freezes scope, not club baselines. G3D-3C may normalize the real
identity union and materialization rules. P1 still owns institutional/sporting
baseline evidence. No nominal club can be created from an abstract draw without
first resolving to a published/materialized real identity.

## 7. Artifact review declaration

- Evidence selection: `EV-P0-059` through `EV-P0-061` and official membership
  EvidenceRecords referenced by the detailed-club report.
- Owner approvals: `DATA_OWNER`, `PRODUCT_OWNER` as declared in header.
- Limitations: no exhaustive global membership or baseline state was acquired.
- Unresolved material conflicts: none; on-demand materialization is the approved
  ADR-081 boundary, not missing identity inference.
