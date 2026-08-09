# G3D-4A Player Creation Observational Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Candidate lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4A-OBS-V1`

## 1. Consumer boundary

This artifact informs the observable constraints around initial player creation.
It does **not** observe `TrueCapabilities`, traits, latent power, suitability or
the factor structure. Those remain `INDIRECTLY_IDENTIFIABLE` or
`JOINT_CALIBRATION_REQUIRED`. SportingRole is not reconstructed from exposure.

## 2. Position mapping and population

The panel accepts only exact source match positions:

| External position | Canonical position |
|---|---|
| `Goalkeeper` | `GK` |
| `Central Midfield` | `CM` |
| `Centre-Forward` | `ST` |

All other descriptions are `POSITION_MAPPING_UNCERTAIN` for this candidate. The
multileague reference covers 14 established first tiers and 54,113 strict
player-club-season-position observations. Spain is direct. Argentina has 418
covered top-flight game identities for 2024–2025 but no appearance/lineup rows
in the acquired panel, so there is no Argentina player-level distribution.

## 3. Covered first-tier emergence

`coveredFirstTierEmergenceAge(k)` is age on the date at which cumulative covered
minutes first reach `k`, restricted to first observed ages 15–23. It is a
source-coverage statistic, not a claim about first professional debut.

### 3.1 One-minute sensitivity

| Context | Position | N | Mean age | Median | P05 | P95 |
|---|---|---:|---:|---:|---:|---:|
| Multileague | CM | 2,784 | — | 20.42 | 17.83 | 22.72 |
| Multileague | GK | 621 | — | 20.99 | 18.18 | 22.82 |
| Multileague | ST | 2,825 | — | 20.39 | 17.71 | 22.72 |
| Spain | CM | 217 | — | 20.74 | 18.48 | 22.79 |
| Spain | GK | 37 | — | 20.96 | 18.86 | 22.43 |
| Spain | ST | 185 | — | 21.01 | 18.27 | 22.74 |

The mean was not retained in the canonical summary and is deliberately not
invented. Spain GK is sparse.

### 3.2 Meaningful-exposure sensitivity

| Position | 900-minute N / median age | 1,800-minute N / median age |
|---|---:|---:|
| CM | 719 / 21.39 | 353 / 21.64 |
| GK | 254 / 21.64 | 174 / 21.92 |
| ST | 598 / 21.37 | 317 / 21.69 |

There is no threshold decision in this artifact. The three views expose how a
future product/statistical definition changes the observable distribution.

## 4. Argentina evidence

The official LPF report states that 185 players debuted in Primera in 2025. It
does not provide age, position, minutes or a denominator, so it validates the
existence of a sizeable debut flow but cannot calibrate Creation distributions.
The official LPF Data matchday report demonstrates compatible player-minute
semantics for a future Argentina panel.

## 5. Bias and tails

- left truncation: a player may have appeared before source coverage;
- right censoring: late emergers may not yet reach a minutes sensitivity level;
- competition selection: multileague evidence is a reference, not an Argentina
  or Spain baseline substitute;
- strict mapping omits hybrid/ambiguous positions rather than assigning them;
- sparse and zero-exposure observations are retained elsewhere in Role/Minutes;
- early and late tails are preserved; no winsorization or age threshold is
  proposed.

## 6. Readiness

| Evidence need | State | Consequence |
|---|---|---|
| position-conditioned emergence shape | `READY_WITH_LIMITATIONS` | initial age/location/scale families may enter later joint estimation |
| Argentina direct age/position emergence | `MORE_EVIDENCE_REQUIRED` | direct player-season source or official aggregate by age/position needed |
| latent capability/trait distributions | `JOINT_CALIBRATION_REQUIRED` | Performance, Development and exposure evidence constrain them jointly |
| preferred foot distribution | `MORE_EVIDENCE_REQUIRED` | no G3D-4A acquisition; registry state unchanged |
| hidden power/correlation structure | `NO_DIRECT_EVIDENCE` | synthetic/factor-model calibration only after observational constraints |

Sources and atomic claims are in
[the P1 Evidence Index](G3D_P1_PLAYER_EVIDENCE_INDEX.md); hashes and transforms
are in [the observational hash manifest](G3D_P1_PLAYER_OBSERVATIONAL_HASH_MANIFEST.md).
