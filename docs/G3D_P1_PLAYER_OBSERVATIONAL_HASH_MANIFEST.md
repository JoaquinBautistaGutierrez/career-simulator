# G3D-4A Player Observational Hash Manifest

Status: `CANDIDATE_DERIVED_SUMMARIES_ONLY`

Lineage: `RSNAP-G3D3B-2026-08-07-C1`

Transform version: `G3D4A-OBS-V1`

Hashes use SHA-256 over the retrieved compressed artifact or the canonical JSON
serialization produced outside the repository. They identify research inputs
and derived summaries; they are not `dataVersion` or EngineParameterSet hashes.

## 1. Transfermarkt-derived panel

| Input | Bytes | SHA-256 |
|---|---:|---|
| `appearances.csv.gz` | 42,857,792 | `41d48c65b24ebd3c6c97ff6241ca7ecd9e570cdb535abeba4bce67e3b0425a18` |
| `club_games.csv.gz` | 1,929,556 | `06718906c67ec11c077cc25f91b1b3624cc0cabb98400d733d6be5dc3e01c90f` |
| `competitions.csv.gz` | 2,139 | `226968a488ade41f96ae54b9d2acf5a35a92350c678b9365586d15827e789773` |
| `games.csv.gz` | 4,708,534 | `585f593b2add005ad803fd999355ef70d5de44ef021d37787064fdffcb3ba484` |
| `game_lineups.csv.gz` | 118,531,960 | `6b2fc04ae307390c4d2044659b91c0da314c6a20eefd4a2f13e1468ac06c874b` |
| `players.csv.gz` | 4,160,452 | `1457768f75cb27adb38b2227b9c8facc53174a626cbe1e18f9019b5647fa8d3c` |

`TR-P1-PLAYER-PANEL-V1` performs exact competition selection, exact match-position
mapping (`Goalkeeper→GK`, `Central Midfield→CM`, `Centre-Forward→ST`), canonical
player-club-season grouping, team-opportunity joins and exact summary formulas.
No fuzzy positional mapping is accepted. Canonical derived JSON SHA-256:
`6f9b285eb74e8b677c0b4c21f7f886ea067f4da16560579ec4cc3d1222e7d574`.

## 2. StatsBomb reference event subset

| Input | SHA-256 |
|---|---|
| La Liga 2015/16 `matches.json` | `4e2074c633559f3b88e9593a752d8d15d9d9ba0d6c8a25316a68ec6526b4d14b` |
| canonical 380-event-file manifest | `0914a2d68e5322cb7ec21000512cba84791ec328321ec2aec012530fc1b27a30` |
| `competitions.json` | `e6cd42f5d8956d6aa30fb917ce8d4c3b3df1879a93f02f8feba820930a6971fa` |
| Open Data user agreement PDF | `a5462e69aeb71a39268b760b110c5c2190a2e0cee3015ba976f66bd71f6c2bb4` |

`TR-P1-EVENT-PROXIES-V1` reconstructs player-match exposure and only the
position-compatible observables authorized by the Performance specification.
Exact event-position mapping is `Goalkeeper→GK`, center/left/right center
midfield→CM, and center/left/right center forward→ST. Canonical derived JSON
SHA-256: `1438ad522ce65ec8926df00dbb6ff2e7167ce00763a8a9d4c28bc99b37988d09`.

## 3. Reproduction boundary

The raw paths are intentionally absent. Reproduction requires retrieving the
same source snapshot under its terms, validating the source hashes, then running
the future independent transform implementation. A hash match does not grant
redistribution rights. No output in this manifest is a calibrated value.
