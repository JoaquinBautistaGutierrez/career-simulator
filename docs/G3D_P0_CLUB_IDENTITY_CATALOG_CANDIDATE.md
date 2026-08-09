# G3D P0 Club Identity Catalog Candidate

## 1. Header

```yaml
artifactId: G3D_P0_CLUB_IDENTITY_CATALOG_CANDIDATE
artifactVersion: g3d-3c-candidate-1
schemaVersion: VERTICAL_SLICE_DATA_CATALOG_SPEC.ClubDefinition.v1
sourceSnapshotId: RSNAP-G3D3B-2026-08-07-C1
datasetCandidateId: DS-CLUB-VERTICAL-SLICE@candidate/RSNAP-G3D3B-2026-08-07-C1/004
subartifactState: VALIDATED_CANDIDATE
datasetState: SOURCE_IDENTIFIED
candidateDataVersionRef: DATA-V1-CANDIDATE-NOT-PUBLISHED
candidateHashRef: G3D_P0_CANDIDATE_HASH_MANIFEST.md
```

El subartifact normaliza identidad y membership. `DS-CLUB-VERTICAL-SLICE` no
se promueve como bundle porque faltan sus ocho dimensiones causales P1.

Source inheritance: Argentina rows use `SRC-AFA-LPF-REG-2026` (Tier A,
`MANUAL_PUBLIC_FACT`/`REFERENCE_ONLY`); Spain rows use
`SRC-LALIGA-STANDINGS-2025-26` with the same usage boundary. The portfolio
selection rationale uses `SRC-INTERNAL-VERTICAL-SLICE` (`PRODUCT_DEFINED`).
Club identity is `TIMELESS_DEFINITION`; baseline membership is valid only for
the referenced closed edition (Argentina 2026-01-25..2026-05-18; Spain
2025-08-16..2026-05-24). Retrieval timestamps remain in the EvidenceRecords and
are not gameplay dates.

## 2. Argentina detailed slice

| clubId | canonicalName | Accepted aliases | Country / baseline edition | Evidence | Status |
|---|---|---|---|---|---|
| `CLUB-ARG-RIVER-PLATE` | Club Atlético River Plate | River Plate; River | `COUNTRY-ARG`; `EDITION-ARG-PRIMERA-APERTURA-2026` | `EV-P0-042` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-BOCA-JUNIORS` | Club Atlético Boca Juniors | Boca Juniors; Boca | `COUNTRY-ARG`; same edition | `EV-P0-043` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-RACING` | Racing Club | Racing | `COUNTRY-ARG`; same edition | `EV-P0-044` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-INDEPENDIENTE` | Club Atlético Independiente | Independiente | `COUNTRY-ARG`; same edition | `EV-P0-045` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-ESTUDIANTES-LP` | Club Estudiantes de La Plata | Estudiantes; Estudiantes LP | `COUNTRY-ARG`; same edition | `EV-P0-046` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-VELEZ-SARSFIELD` | Club Atlético Vélez Sarsfield | Vélez; Velez; Vélez Sarsfield | `COUNTRY-ARG`; same edition | `EV-P0-047` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-ARGENTINOS-JUNIORS` | Asociación Atlética Argentinos Juniors | Argentinos Juniors; Argentinos | `COUNTRY-ARG`; same edition | `EV-P0-048` | `VALIDATED_CANDIDATE` |
| `CLUB-ARG-ROSARIO-CENTRAL` | Club Atlético Rosario Central | Rosario Central; Central | `COUNTRY-ARG`; same edition | `EV-P0-049` | `VALIDATED_CANDIDATE` |

## 3. Spain detailed slice

| clubId | canonicalName | Accepted aliases | Country / baseline edition | Evidence | Status |
|---|---|---|---|---|---|
| `CLUB-ESP-REAL-MADRID` | Real Madrid CF | Real Madrid | `COUNTRY-ESP`; `EDITION-ESP-LALIGA-2025-26` | `EV-P0-050` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-BARCELONA` | FC Barcelona | Barcelona; Barça; Barca | `COUNTRY-ESP`; same edition | `EV-P0-051` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-ATLETICO-MADRID` | Club Atlético de Madrid | Atlético de Madrid; Atletico de Madrid; Atlético | `COUNTRY-ESP`; same edition | `EV-P0-052` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-ATHLETIC-CLUB` | Athletic Club | Athletic; Athletic Bilbao (`NON_CANONICAL_ALIAS`) | `COUNTRY-ESP`; same edition | `EV-P0-053` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-REAL-SOCIEDAD` | Real Sociedad de Fútbol | Real Sociedad | `COUNTRY-ESP`; same edition | `EV-P0-054` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-VILLARREAL` | Villarreal CF | Villarreal | `COUNTRY-ESP`; same edition | `EV-P0-055` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-SEVILLA` | Sevilla FC | Sevilla | `COUNTRY-ESP`; same edition | `EV-P0-056` | `VALIDATED_CANDIDATE` |
| `CLUB-ESP-GIRONA` | Girona FC | Girona | `COUNTRY-ESP`; same edition | `EV-P0-057` | `VALIDATED_CANDIDATE` |

Girona conserva membership de la edición cerrada incluso si el resultado de
esa edición cambia la membership siguiente (`EV-P0-080`). No se reescribe la
historia con la afiliación posterior.

## 4. Explicit non-values

Para los 16, los campos siguientes son `PENDING_DATA`, no cero ni default:

```text
attackStrength
defensiveStrength
controlStrength
prestige
financialPower
developmentQuality
medicalQuality
stability
publicReach (si el bundle lo exige)
```

La rationale cualitativa `EV-P0-058` es `PRODUCT_DEFINED` para portfolio
coverage; no es rating. Ningún club recibe identity floor ni protección.

## 5. Validation

- 16/16 `clubId` únicos;
- 8/8 por país y baseline edition;
- country y membership refs resuelven;
- alias no ambiguos dentro del slice;
- acquisition IDs `ARG-*`/`ESP-*` preservados solo como provenance aliases;
- no causal baseline publicado.
