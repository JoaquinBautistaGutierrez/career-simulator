# G3D-4B Health Observational Hash Manifest

Status: `CANDIDATE_DERIVED_SUMMARIES_ONLY`

Reference cutoff: `2026-08-07T23:59:59.999Z`

Lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4B-HEALTH-OBS-V1`

Transform version: `G3D4B-HEALTH-DOC-V1`

These SHA-256 values identify the canonical UTF-8, no-BOM, LF serialization of
the documentary evidence acquired in G3D-4B. They are not hashes of external
raw datasets, a `dataVersion`, an
EngineParameterSet or calibrated values. Raw publications and medical/player
rows remain outside the repository under their source terms.

## 1. Candidate artifacts

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `G3D_P1_HEALTH_SOURCE_LICENSE_MANIFEST.md` | 8,614 | `fddea8ae4f2fa454d4b57e12bb23836764440ab9419cd37ef87ab1982c5aa3f3` |
| `G3D_P1_HEALTH_EVIDENCE_INDEX.md` | 15,293 | `0311947c0afe434ff750968cffbfff1681e3708fb5dad74125a808e0af52d9e2` |
| `G3D_P1_HEALTH_INJURY_INCIDENCE_EVIDENCE.md` | 10,123 | `2772c22f2dfb94c1b4fa3fbd4831485b0ed23df0cabcfd47e056cc1a8669df7e` |
| `G3D_P1_HEALTH_RECOVERY_RELAPSE_EVIDENCE.md` | 9,470 | `3591a963168d61e658af1fd16c2a09e10ce096e3e896cf7892f358db6375c60c` |

## 2. Reproduction and mutation boundary

A future reproduction retrieves each publication through the source manifest,
checks the cited edition/period and terms, extracts only the atomic published
aggregates, and validates those claims against the Evidence Index. Any change
to one of the four artifacts creates a successor transform identity and new
hash; the manifest must never be edited to conceal changed evidence.

The closure report and registries are consumers and are intentionally excluded
from this content-addressed evidence set. A hash match proves documentary
identity only; it grants no redistribution right and does not validate causal
parameters.
