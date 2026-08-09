# G3D-4A Role and Minutes Observational Evidence

Status: `OBSERVATIONAL_SUMMARY_AVAILABLE_WITH_LIMITATIONS`

Candidate lineage: `RSNAP-G3D3B-2026-08-07-C1/G3D4A-OBS-V1`

## 1. Observable contract

`teamOpportunityMinutes` is reconstructed from club match participation and the
covered competition calendar. `minuteShare = realizedMinutes /
teamOpportunityMinutes`; it is kept distinct from raw minutes, appearances and
starts. The zero share is valid. Observed exposure does not assign a
`SportingRole`; role frequencies/transitions remain latent-model quantities.

## 2. Coverage

| Geography | Games | Strict appearances | Player-club-season-position observations | State |
|---|---:|---:|---:|---|
| Spain direct | 5,320 | 47,004 | 4,335 | `OBSERVATIONAL_SUMMARY_AVAILABLE` |
| Argentina direct | 418 game identities | 0 | 0 | `STILL_BLOCKED_PLAYER_PANEL` |
| Multileague reference | covered panel | 467,470 | 54,113 | `REFERENCE_SUMMARY_AVAILABLE` |

LPF Data confirms Argentina minutes/lineup semantics for a future source, but
one round is not treated as a distribution.

## 3. Spain minute-share distributions

| Position | N | Mean | Median | SD | P05 | P25 | P75 | P95 | P99 | Zero share |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CM | 1,766 | .176 | .080 | .205 | .000 | .018 | .288 | .623 | .751 | .127 |
| GK | 998 | .255 | .026 | .352 | .000 | .000 | .483 | .961 | 1.000 | .433 |
| ST | 1,571 | .208 | .096 | .239 | .000 | .021 | .348 | .716 | .874 | .099 |

### 3.1 Exposure bands

Bands are descriptive only: `ZERO`; `(0,.10)`; `[.10,.40)`; `[.40,.70)`;
`[.70,1]`. They do not become SportingRole thresholds.

| Position | ZERO | LOW | .10–.40 | .40–.70 | ≥.70 |
|---|---:|---:|---:|---:|---:|
| CM | 224 (.127) | 717 (.406) | 531 (.301) | 250 (.142) | 44 (.025) |
| GK | 432 (.433) | 148 (.148) | 144 (.144) | 79 (.079) | 195 (.195) |
| ST | 155 (.099) | 639 (.407) | 450 (.286) | 235 (.150) | 92 (.059) |

The GK mixture is materially different: many zero/low contexts and a visible
high-share mass. It must not be forced into the same role frequency as CM/ST.

## 4. Exposure persistence

| Context | Position | Pair N | Pearson | Spearman | Mean absolute change |
|---|---|---:|---:|---:|---:|
| Spain, same club | CM | 778 | .606 | .597 | .143 |
| Spain, same club | GK | 469 | .726 | .741 | .166 |
| Spain, same club | ST | 560 | .651 | .646 | .159 |
| Spain, club change | CM | 161 | .300 | .319 | .161 |
| Spain, club change | GK | 83 | .210 | .256 | .316 |
| Spain, club change | ST | 217 | .394 | .353 | .203 |
| Multileague, same club | CM | 7,613 | .539 | .565 | .144 |
| Multileague, same club | GK | 4,927 | .711 | .710 | .174 |
| Multileague, same club | ST | 6,140 | .586 | .581 | .162 |
| Multileague, club change | CM | 2,199 | .226 | .268 | .170 |
| Multileague, club change | GK | 1,088 | .188 | .244 | .327 |
| Multileague, club change | ST | 2,429 | .286 | .307 | .210 |

These are observed correlations, not AR coefficients. Club changes and missing
competitions alter the denominator and must enter later joint estimation.

## 5. Starts and appearances

The acquired panel retains appearances, lineup type and minute totals. This is
enough to produce future `CT-APP-DIST-001` and `CT-START-DIST-001` summaries,
but the current candidate does not add a new Role consumer: minutes remain the
causal exposure contract, with starts/appearances as diagnostics.

## 6. Sparse exposure and outliers

- zero and low-share observations remain in the population;
- rate-oriented performance subsets use explicit minute gates without deleting
  the corresponding role observations;
- share above 1 would be an invalid denominator/join state; none is silently
  clipped;
- exact ambiguous positions remain `POSITION_MAPPING_UNCERTAIN`;
- transfer-season club splits remain separate player-club-season observations.

## 7. Readiness

`roleMinutes` is `READY_FOR_INITIAL_ESTIMATION` for Spain/multileague minute
share, zero mass, position shape and observed persistence. It is
`READY_WITH_LIMITATIONS` globally because Argentina lacks a longitudinal
player-season panel and SportingRole is latent. Role intercepts, transition
utilities and opportunity adapters require joint calibration; no direct value is
assigned.
