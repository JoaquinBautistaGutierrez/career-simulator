# P0 Evidence Index

## 1. Campaign identity and record contract

```yaml
researchSnapshotId: RSNAP-G3D3B-2026-08-07-C1
referenceCutoffDate: 2026-08-07
retrievedAt: 2026-08-09
retrievalTimePrecision: UTC_DAY
firstExternalEvidenceCapturedAfterCutoffFreeze: true
captureOrderProof: REFERENCE_EDITION_MANIFEST cutoff header was written before the first external web call
evidenceSchemaVersion: G3D_P0_ACQUISITION_SPEC.EvidenceRecord.v1
defaultReviewerRoles:
  - DATA_OWNER
  - PROVENANCE_REVIEWER
defaultReviewerRefs:
  - PROJECT_MAINTAINER_AS_DATA_OWNER
  - PROJECT_MAINTAINER_AS_PROVENANCE_REVIEWER
rawExternalArtifactsCommitted: false
```

Cada fila es un `EvidenceRecord` atomico. `sourceId` se resuelve a publisher,
URL, licencia y restricciones en
[`SOURCE_LICENSE_MANIFEST.md`](SOURCE_LICENSE_MANIFEST.md). El texto extraido
es el fact conservado; no se conserva el HTML/PDF raw. `A`, `B`, `C` y `D`
significan `TIER_A`..`TIER_D`. `M` es `MANUAL_PUBLIC_FACT`, `R` es
`REFERENCE_ONLY` y `P` es `PRODUCT_DEFINED`. Salvo indicacion contraria,
`licensingState=CLASSIFIED_REFERENCE_ONLY`, `validation=REVIEWED_AGAINST_SOURCE`,
`conflict=CONSISTENT` y los reviewers son los del header.

## 2. Reference editions, formats and calendar

| evidenceId | researchId | Claim and extracted fact/value | Units | sourceId / type / tier | Period; cutoff class | Usage/license | Confidence; validation/conflict | Downstream consumers |
|---|---|---|---|---|---|---|---|---|
| `EV-P0-001` | `RS-P0-BASELINE` | LPF 2026 has 30 named First Division participants. | clubs | `SRC-AFA-LPF-REG-2026` / official regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | Competition/Club catalogs |
| `EV-P0-002` | `RS-P0-COMP-FORMAT` | Apertura 2026 zone phase is two zones of 15, one round plus interzonal play. | structure | `SRC-AFA-LPF-REG-2026` / official regulation / A | 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-003` | `RS-P0-COMP-FORMAT` | Apertura zone phase has 16 dates. | match dates | `SRC-AFA-LPF-REG-2026` / official regulation / A | Jan-Apr 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | MatchEquivalent/Calendar |
| `EV-P0-004` | `RS-P0-COMP-FORMAT` | Top eight per zone enter R16; R16/QF/SF/final are single-match and tied matches use extra time then penalties. | progression rule | `SRC-AFA-LPF-REG-2026` / official regulation / A | 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-005` | `RS-P0-CALENDAR` | Official Apertura dates allocate 16 zone dates Jan 25-Apr 26 and four knockout dates in May. | dates | `SRC-AFA-LPF-REG-2026` / official regulation / A | Jan-May 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CalendarEvidence |
| `EV-P0-006` | `RS-P0-BASELINE` | Belgrano defeated River 3-2 and became Apertura 2026 champion on 18 May 2026. | champion/date | `SRC-AFA-LPF-FINAL-2026` / organizer news / A | 2026-05-18; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Edition manifest |
| `EV-P0-007` | `RS-P0-BASELINE` | Clausura 2026 began in July and was not closed at cutoff, so it is excluded as baseline edition. | edition state | `SRC-AFA-LPF-CLAUSURA-2026` / organizer schedule / A | Jul 2026; `PRE_CUTOFF_PARTIAL` | M/R | HIGH | Edition manifest |
| `EV-P0-008` | `RS-P0-CALENDAR` | Apertura registration/transfer register general close was 27 Jan 2026 at 17:00; limited replacement route ran to 10 Mar. | timestamp/rule | `SRC-AFA-LPF-REG-2026` / official regulation / A | 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Registration evidence |
| `EV-P0-009` | `RS-P0-CALENDAR` | Clausura list deadline was 22 Jul 2026; limited replacement registration could run to 2 Sep only after qualifying outbound transfers. | timestamp/rule | `SRC-AFA-LPF-REG-2026` / official regulation / A | Jul-Sep 2026; `PRE_CUTOFF_PARTIAL` | M/R | HIGH; post-cutoff portion excluded from baseline initialization | Registration evidence |
| `EV-P0-010` | `RS-P0-COMP-FORMAT` | Annual table sums Apertura and Clausura zone-phase points; first place is Liga champion. | annual rule | `SRC-AFA-LPF-REG-2026` / official regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | Argentina season adapter |
| `EV-P0-011` | `RS-P0-COMP-FORMAT` | Relegation positions can arise by averages or annual general table; ties use playoff matches under AFA rules. | mobility output | `SRC-AFA-LPF-REG-2026` / official regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | DR-021/065 boundary |
| `EV-P0-012` | `RS-P0-BASELINE` | Independiente Rivadavia won Copa Argentina 2025 on penalties after 2-2 final against Argentinos Juniors. | champion/result | `SRC-AFA-COPA-ARG-FINAL-2025` / organizer news / A | 2025-11-05; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Edition manifest |
| `EV-P0-013` | `RS-P0-COMP-FORMAT` | Copa Argentina final phase has 64 participants and single-match R32 through final. | structure | `SRC-AFA-COPA-ARG-REG-2025` / official regulation / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-014` | `RS-P0-BASELINE` | Copa Argentina 2026 was still in R16 scheduling in July 2026 and therefore was partial at cutoff. | edition state | `SRC-COPA-ARG-CURRENT-2026` / organizer schedule / A | Jul 2026; `PRE_CUTOFF_PARTIAL` | M/R | HIGH | Edition manifest |
| `EV-P0-015` | `RS-P0-CALENDAR` | LaLiga 2025/26 ran 38 matchdays from 16-17 Aug 2025 to 23-24 May 2026. | matchdays/dates | `SRC-LALIGA-CALENDAR-2025-26` / organizer calendar / A | Aug 2025-May 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Calendar/Competition |
| `EV-P0-016` | `RS-P0-BASELINE` | Final LaLiga standings contain 20 clubs and Barcelona as champion with all 38 rounds complete. | clubs/champion | `SRC-LALIGA-STANDINGS-2025-26` / organizer standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Edition/Club catalogs |
| `EV-P0-017` | `RS-P0-COMP-FORMAT` | LaLiga baseline is a league table; final round evidence exists for all ten fixtures on 23-24 May 2026. | completion | `SRC-RFEF-PRIMERA-J38-2025-26` / federation results / A | May 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Completion gate |
| `EV-P0-018` | `RS-P0-COMP-FORMAT` | Copa del Rey 2025/26 involved 116 main-draw clubs plus 20 territorial teams in the preliminary route; first two proper rounds remained single-match, preliminary became two-leg. | participants/format | `SRC-RFEF-COPA-SORTEO-2025-26` + `SRC-RFEF-COPA-REFORM-2025-26` / federation / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-019` | `RS-P0-BASELINE` | Real Sociedad won Copa del Rey 2025/26 after extra time and penalties against Atletico de Madrid; final closed 18 Apr 2026. | champion/date | `SRC-RFEF-COPA-FINAL-2025-26` / federation / A | 2026-04-18/19; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Edition manifest |
| `EV-P0-020` | `RS-P0-CALENDAR` | Official season calendar places Copa rounds from Sep 2025 through final in Apr 2026. | dates | `SRC-RFEF-SEASON-CALENDAR-2025-26` / federation calendar / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CalendarEvidence |
| `EV-P0-021` | `RS-P0-COMP-FORMAT` | Libertadores 2025 used preliminary F1/F2/F3 followed by a 32-club group stage. | structure/clubs | `SRC-CONMEBOL-LIB-MANUAL-2025` / organizer manual / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-022` | `RS-P0-COMP-FORMAT` | Group stage was eight groups of four over six matchdays. | structure/exposure | `SRC-CONMEBOL-LIB-MANUAL-2025` / organizer manual / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Exposure/Calendar |
| `EV-P0-023` | `RS-P0-COMP-FORMAT` | R16, QF and SF were two-leg ties; final was a single match. | progression | `SRC-CONMEBOL-LIB-MANUAL-2025` / organizer manual / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-024` | `RS-P0-BASELINE` | Flamengo won Libertadores 2025; final was scheduled in Lima on 29 Nov 2025. | champion/date | `SRC-CONMEBOL-LIB-CHAMPIONS` + `SRC-CONMEBOL-LIB-FINAL-2025` / organizer / A | 2025-11-29; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Edition manifest |
| `EV-P0-025` | `RS-P0-COMP-FORMAT` | UCL 2025/26 league phase had 36 teams and eight matches per club. | clubs/exposure | `SRC-UEFA-UCL-FORMAT-2025-26` / organizer / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-026` | `RS-P0-COMP-FORMAT` | Top eight advanced to R16; places 9-24 entered knockout play-offs; lower places were eliminated. | progression | `SRC-UEFA-UCL-FORMAT-2025-26` / organizer / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | CompetitionDefinition |
| `EV-P0-027` | `RS-P0-BASELINE` | UCL 2025/26 closed on 30 May 2026 with Paris Saint-Germain defeating Arsenal on penalties. | champion/date | `SRC-UEFA-UCL-RESULTS-2025-26` / organizer / A | 2026-05-30; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Edition manifest |
| `EV-P0-028` | `RS-P0-NATIONAL-CATALOG` | FIFA World Cup 2026 used 48 teams, 12 groups of four and a round of 32. | teams/format | `SRC-FIFA-WC-FORMAT-2026` / organizer / A | 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | NationalCompetitionDefinition |
| `EV-P0-029` | `RS-P0-NATIONAL-CATALOG` | Tournament ran 11 Jun-19 Jul 2026 and all result slots closed before cutoff. | dates | `SRC-FIFA-WC-RESULTS-2026` / organizer / A | Jun-Jul 2026; `PRE_CUTOFF_CLOSED` | M/R | HIGH | National calendar |
| `EV-P0-030` | `RS-P0-NATIONAL-CATALOG` | Spain beat Argentina 1-0 in the World Cup 2026 final; Argentina was runner-up. | result | `SRC-FIFA-WC-FINAL-2026` / organizer / A | 2026-07-19; `PRE_CUTOFF_CLOSED` | M/R | HIGH | Argentina baseline context |
| `EV-P0-031` | `RS-P0-NATIONAL-CATALOG` | FIFA's eligibility framework is the governing external reference; V1 still binds eligibility to Argentina only by ADR-082, not by inference from the source. | governing reference | `SRC-FIFA-ELIGIBILITY` / governing body / A | current before cutoff; `TIMELESS_DEFINITION` | M/R | HIGH | Eligibility catalog |

## 3. Award candidates

| evidenceId | researchId | Claim and extracted fact/value | Units | sourceId / type / tier | Period; cutoff class | Usage/license | Confidence; validation/conflict | Downstream consumers |
|---|---|---|---|---|---|---|---|---|
| `EV-P0-032` | `RS-P0-AWARD-CATALOG` | 2025 Men's Ballon d'Or existed and was awarded to Ousmane Dembele on 22 Sep 2025. | edition/winner | `SRC-UEFA-BALLON-WINNERS-2025` / co-organizer / A | 2024/25 evaluation; `PRE_CUTOFF_CLOSED` | M/R | HIGH | global comparative slot |
| `EV-P0-033` | `RS-P0-AWARD-CATALOG` | Ballon d'Or uses 30 nominees, an international journalist jury, ranked ballots and first-/next-place vote tie-breaks. | field/tie rule | `SRC-UEFA-BALLON-RULES` / co-organizer / A | rule published 2024; `TIMELESS_DEFINITION` | M/R | MEDIUM; rule continuity to 2025 must be revalidated at normalization | AwardDefinition |
| `EV-P0-034` | `RS-P0-AWARD-CATALOG` | 2025 Men's Kopa Trophy existed; Lamine Yamal won. | edition/winner | `SRC-UEFA-BALLON-WINNERS-2025` / co-organizer / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | young comparative slot |
| `EV-P0-035` | `RS-P0-AWARD-CATALOG` | Kopa is under-21 at 31 July, ten nominees, voted by Ballon d'Or winners, with ranked-vote tie-break. | eligibility/field/tie | `SRC-UEFA-BALLON-RULES` / co-organizer / A | published 2024; `TIMELESS_DEFINITION` | M/R | MEDIUM; year parameter requires 2025 validation | AwardDefinition |
| `EV-P0-036` | `RS-P0-AWARD-CATALOG` | 2025 Men's Yashin Trophy existed; Gianluigi Donnarumma won. | edition/winner | `SRC-UEFA-BALLON-WINNERS-2025` / co-organizer / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | GK positional slot |
| `EV-P0-037` | `RS-P0-AWARD-CATALOG` | Yashin is goalkeeper-only, ten nominees, journalist jury and ranked-vote tie-break. | eligibility/field/tie | `SRC-UEFA-BALLON-RULES` / co-organizer / A | published 2024; `TIMELESS_DEFINITION` | M/R | MEDIUM; 2025 continuity review | AwardDefinition |
| `EV-P0-038` | `RS-P0-AWARD-CATALOG` | LALIGA Player of the Season 2025/26 existed and Lamine Yamal won after the league closed. | edition/winner | `SRC-LALIGA-AWARDS-2025-26` / organizer / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | league player slot |
| `EV-P0-039` | `RS-P0-AWARD-CATALOG` | The official LALIGA winner pages found do not state candidate field size, ballot weights or tie policy for the season award. | documented missing fields | `SRC-LALIGA-AWARDS-2025-26` / organizer / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH; `UNRESOLVED_CONFLICT` is false, fields are simply unpublished | G3D-3C blocker |
| `EV-P0-040` | `RS-P0-AWARD-CATALOG` | Official LALIGA statistics identify Kylian Mbappe as 2025/26 leading scorer with 25 league goals. | goals/leader | `SRC-LALIGA-TOPSCORER-2025-26` / organizer statistics / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | league scorer slot |
| `EV-P0-041` | `RS-P0-AWARD-CATALOG` | Real Madrid identifies that distinction as the 2025/26 Pichichi Trophy; this is corroboration from the winner's club, not organizer rules. | award identity | `SRC-REALMADRID-PICHICHI-2025-26` / club / B | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | MEDIUM; organizer tie/award rules remain missing | AwardDefinition candidate |

## 4. Detailed clubs and external-club scope

| evidenceId | researchId | Claim and extracted fact/value | Units | sourceId / type / tier | Period; cutoff class | Usage/license | Confidence; validation/conflict | Downstream consumers |
|---|---|---|---|---|---|---|---|---|
| `EV-P0-042` | `RS-P0-CLUB-IDENTITY` | Club Atletico River Plate is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | detailed club slot ARG-1 |
| `EV-P0-043` | `RS-P0-CLUB-IDENTITY` | Club Atletico Boca Juniors is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-2 |
| `EV-P0-044` | `RS-P0-CLUB-IDENTITY` | Racing Club is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-3 |
| `EV-P0-045` | `RS-P0-CLUB-IDENTITY` | Club Atletico Independiente is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-4 |
| `EV-P0-046` | `RS-P0-CLUB-IDENTITY` | Club Estudiantes de La Plata is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-5 |
| `EV-P0-047` | `RS-P0-CLUB-IDENTITY` | Club Atletico Velez Sarsfield is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-6 |
| `EV-P0-048` | `RS-P0-CLUB-IDENTITY` | Asociacion Atletica Argentinos Juniors is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-7 |
| `EV-P0-049` | `RS-P0-CLUB-IDENTITY` | Club Atletico Rosario Central is an LPF 2026 participant. | identity/membership | `SRC-AFA-LPF-REG-2026` / regulation / A | 2026; `TIMELESS_DEFINITION` | M/R | HIGH | ARG-8 |
| `EV-P0-050` | `RS-P0-CLUB-IDENTITY` | Real Madrid CF appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-1 |
| `EV-P0-051` | `RS-P0-CLUB-IDENTITY` | FC Barcelona appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-2 |
| `EV-P0-052` | `RS-P0-CLUB-IDENTITY` | Club Atletico de Madrid appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-3 |
| `EV-P0-053` | `RS-P0-CLUB-IDENTITY` | Athletic Club appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-4 |
| `EV-P0-054` | `RS-P0-CLUB-IDENTITY` | Real Sociedad de Futbol appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-5 |
| `EV-P0-055` | `RS-P0-CLUB-IDENTITY` | Villarreal CF appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-6 |
| `EV-P0-056` | `RS-P0-CLUB-IDENTITY` | Sevilla FC appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-7 |
| `EV-P0-057` | `RS-P0-CLUB-IDENTITY` | Girona FC appears in final LaLiga 2025/26 membership. | identity/membership | `SRC-LALIGA-STANDINGS-2025-26` / standings / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | ESP-8 |
| `EV-P0-058` | `RS-P0-CLUB-IDENTITY` | The 8+8 portfolio is selected for diversity rather than table rank: anchors, institutional/development models, regional reach and contrasting trajectories. | product selection rationale | `SRC-INTERNAL-VERTICAL-SLICE` / approved product contract / D | V1; `TIMELESS_DEFINITION` | P | HIGH; `PRODUCT_DEFINED` | DetailedClubSelectionReport |
| `EV-P0-059` | `RS-P0-EXTERNAL-POOL` | UEFA publishes the 36 real league-phase identities for UCL 2025/26. | club identities | `SRC-UEFA-UCL-TEAMS-2025-26` / organizer / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | materializable European pool |
| `EV-P0-060` | `RS-P0-EXTERNAL-POOL` | CONMEBOL fixture evidence publishes the 32 real group-stage identities for Libertadores 2025. | club identities | `SRC-CONMEBOL-LIB-GROUPS-2025` / organizer / A | 2025; `PRE_CUTOFF_CLOSED` | M/R | HIGH | materializable South American pool |
| `EV-P0-061` | `RS-P0-EXTERNAL-POOL` | Hybrid-pool invariant: abstract fields cannot be nominal champion, contract holder, transfer counterparty or nominal history source. | policy | `SRC-INTERNAL-ADR-081` / internal normative / D | V1; `TIMELESS_DEFINITION` | P | HIGH | ExternalClubScope |

## 5. National team, money and scoring provenance

| evidenceId | researchId | Claim and extracted fact/value | Units | sourceId / type / tier | Period; cutoff class | Usage/license | Confidence; validation/conflict | Downstream consumers |
|---|---|---|---|---|---|---|---|---|
| `EV-P0-062` | `RS-P0-NATIONAL-CATALOG` | Asociacion del Futbol Argentino is the official association identity for the Argentina senior context. | entity identity | `SRC-AFA-OFFICIAL` / association site / A | current; `TIMELESS_DEFINITION` | M/R | HIGH | NationalTeamDefinition |
| `EV-P0-063` | `RS-P0-NATIONAL-CATALOG` | V1 sporting nationality/eligibility is Argentina-only; Spain and association changes are out of scope. | product policy | `SRC-INTERNAL-ADR-082` / internal normative / D | V1; `TIMELESS_DEFINITION` | P | HIGH | eligibility binding |
| `EV-P0-064` | `RS-P0-MONEY-POLICY-DATA` | Current Argentine peso is ARS; its centesimal minor unit is the centavo, so persisted minor-unit scale is 100. | code/minor-unit scale | `SRC-ARG-DECREE-2128-1991` + `SRC-ISO-4217` / law+standard / A | timeless/current | M/R | HIGH | Money schema |
| `EV-P0-065` | `RS-P0-MONEY-POLICY-DATA` | Euro code is EUR and one euro has 100 cents, so persisted minor-unit scale is 100. | code/minor-unit scale | `SRC-EU-EURO-UNITS` + `SRC-ISO-4217` / EU+standard / A | timeless/current | M/R | HIGH | Money schema |
| `EV-P0-066` | `RS-P0-MONEY-POLICY-DATA` | BCRA publishes a historical Communication A 3500 reference exchange-rate series and monthly nominal average in a processable file. | series availability | `SRC-BCRA-A3500` / central bank / A | historical-current; `MONETARY_SERIES` | R | HIGH | FX candidate route |
| `EV-P0-067` | `RS-P0-MONEY-POLICY-DATA` | INDEC publishes national CPI series from Dec 2016, methodology and revisions/metadata. | series availability | `SRC-INDEC-IPC` / statistical authority / A | Dec 2016-current; `MONETARY_SERIES` | R | HIGH | ARS inflation route |
| `EV-P0-068` | `RS-P0-MONEY-POLICY-DATA` | ECB publishes reproducible daily/monthly euro reference rates, with stated informational-purpose methodology and historical downloads. | series availability | `SRC-ECB-EXR` / central bank / A | 1999-current; `MONETARY_SERIES` | R | HIGH | EUR/USD bridge route |
| `EV-P0-069` | `RS-P0-MONEY-POLICY-DATA` | Eurostat HICP supplies harmonised monthly/annual indices and revision metadata for Spain/euro-area comparison. | series availability | `SRC-EUROSTAT-HICP` / statistical authority / A | 1996-current; `MONETARY_SERIES` | R | HIGH | EUR inflation route |
| `EV-P0-070` | `RS-P0-MONEY-POLICY-DATA` | World Bank ICP defines PPP as a purchasing-power-equalising conversion and publishes a reproducible methodology; it is a candidate, not yet selected data series. | methodology availability | `SRC-WORLDBANK-ICP` / multilateral primary / A | methodological; `TIMELESS_DEFINITION` | R | MEDIUM; actual Argentina/Spain series coverage remains G3D-3C/P1 validation | PPP route |
| `EV-P0-071` | `RS-P0-SCORING-NORMATIVE` | Career points formula and component separation are already normative in internal scoring docs; no external source may invent weights. | formula identity | `SRC-INTERNAL-SCORING-MATH` / internal normative / A | V1 candidate; timeless | P | HIGH | Scoring catalog |
| `EV-P0-072` | `RS-P0-SCORING-NORMATIVE` | Domestic league base uses `ROUND_HALF_UP[650*(IJL/100)^1.35]`; domestic cup is 55% subject to exact published definition. | formula | `SRC-INTERNAL-MASTER-SCORING` + `SRC-INTERNAL-SCORING-MATH` / normative / A | V1 candidate; timeless | P | HIGH | CompetitionScoringDefinition |
| `EV-P0-073` | `RS-P0-SCORING-NORMATIVE` | UCL champion base is 2200 and Libertadores champion base is 2100. | integer points | `SRC-INTERNAL-MASTER-SCORING` + `SRC-INTERNAL-SCORING-MATH` / normative / A | V1 candidate; timeless | P | HIGH | competition scoring |
| `EV-P0-074` | `RS-P0-SCORING-NORMATIVE` | FIFA World Cup champion base is 5000; runner-up 50% and semifinalist 25%. | integer/rational points | `SRC-INTERNAL-MASTER-SCORING` + `SRC-INTERNAL-SCORING-MATH` / normative / A | V1 candidate; timeless | P | HIGH | national scoring |
| `EV-P0-075` | `RS-P0-SCORING-NORMATIVE` | Ballon d'Or=1800, Yashin/global GK=700, Kopa/global young=500; league POTY and league scorer use exact IJL formulas. | points/formulas | `SRC-INTERNAL-MASTER-SCORING` + `SRC-INTERNAL-SCORING-MATH` / normative / A | V1 candidate; timeless | P | HIGH | AwardScoringDefinition |
| `EV-P0-076` | `RS-P0-SCORING-NORMATIVE` | Global-equivalent award anti-duplication and category/equivalence membership require exact catalog bindings; web prestige is irrelevant. | catalog policy | `SRC-INTERNAL-SCORING-MATH` / internal normative / A | V1; timeless | P | HIGH | equivalence groups |
| `EV-P0-077` | `RS-P0-SCORING-NORMATIVE` | MASTER_SPEC IJL examples are initial balance examples; no G3D-3B evidence publishes final Argentina/Spain IJL bindings. | documented gap | `SRC-INTERNAL-MASTER-SCORING` + `SRC-INTERNAL-SCORING-MATH` / normative / A | V1 candidate | P | HIGH | scoring blocker |
| `EV-P0-078` | `RS-P0-SCORING-NORMATIVE` | Record ranges exist, but each `RecordScoringDefinition`, career milestone and historic-achievement identity/value remains catalog data required. | documented gap | `SRC-INTERNAL-SCORING-MATH` / internal normative / A | V1 candidate | P | HIGH | scoring blocker |
| `EV-P0-079` | `RS-P0-CALENDAR` | V1 market is post-season only; observed mid-year registration facts do not reopen or expand that product policy. | policy boundary | `SRC-INTERNAL-PRODUCT-DECISIONS` / internal normative / D | V1 | P | HIGH | DR-067/CalendarDefinition |
| `EV-P0-080` | `RS-P0-COMP-FORMAT` | LaLiga positions 18-20 descend; the 2025/26 closed edition relegated Real Oviedo, Girona and Mallorca. | mobility output | `SRC-LALIGA-RELEGATION-2025-26` / organizer / A | 2025/26; `PRE_CUTOFF_CLOSED` | M/R | HIGH | mobility request boundary |
| `EV-P0-081` | `RS-P0-CALENDAR` | LALIGA's next summer transfer period after the closed 2025/26 edition is 1 Jul-1 Sep 2026; the winter period is observed but excluded from V1 gameplay by product policy. | dates/policy boundary | `SRC-LALIGA-SUMMER-WINDOW-2026` / organizer / A | Jul-Sep 2026; `PRE_CUTOFF_PARTIAL` | M/R | HIGH | market/registration mapping |

## 6. Evidence counts and conflicts

| Tier | Count | Interpretation |
|---|---:|---|
| `TIER_A` | 76 | official/federation/organizer/statistical-authority or internal normative primary facts |
| `TIER_B` | 1 | winner-club corroboration for the Pichichi label |
| `TIER_C` | 0 | no proxy was used to close P0 identity/format claims |
| `TIER_D` | 4 | explicitly approved product/policy facts, never represented as observation |
| **Total** | **81** | atomic EvidenceRecords |

No contradictory result or edition claim remained material. Two limitations are
preserved rather than hidden:

1. Ballon d'Or/Kopa/Yashin voting mechanics are documented by the co-organizer
   for the 2024 rule edition; continuity to 2025 must be checked when G3D-3C
   freezes the AwardDefinitions.
2. LALIGA's public winner/stat pages do not expose complete field/tie mechanics
   for the league POTY or scorer award. This is `RESEARCH_INCOMPLETE` for those
   fields, not a conflicting source.

Rejected/unused orientation sources and reasons are in
[`SOURCE_LICENSE_MANIFEST.md`](SOURCE_LICENSE_MANIFEST.md). No record was
silently averaged or promoted in tier.

## 7. Candidate artifact integrity

These SHA-256 values fingerprint the ten G3D-3B documentary artifacts exactly
as acquired. They are candidate provenance hashes, not `dataVersion` hashes and
not evidence that an artifact is `NORMALIZED`, `VALIDATED` or `FROZEN`.

| Artifact file | SHA-256 | Bytes |
|---|---|---:|
| `REFERENCE_EDITION_MANIFEST.md` | `0c3d6763cd28a0a49053f2e1c5a560690f7d6627215bb40d6592ded8a186e12c` | 5433 |
| `COMPETITION_FORMAT_EVIDENCE.md` | `bbd1cf8ebe42691aeaacf5085b0b702f51f612f32f646e7cdd835bd7e51de86b` | 5206 |
| `CALENDAR_EVIDENCE.md` | `e1ae0cb01dc400d0d6dd57729eb4a5f6f7cb87ab3cbfa472f4e3eb404380cd54` | 5812 |
| `DETAILED_CLUB_SELECTION_REPORT.md` | `4879bb339724c68954bdc4ce05e6947de1d92fee64fb8ca40516a0e14be2eedf` | 7112 |
| `EXTERNAL_CLUB_SCOPE_MANIFEST.md` | `687f380e86da15ec38b0362a7833e51df00473eafaee4461958d61fd543d7d50` | 4997 |
| `NATIONAL_TEAM_REFERENCE_EVIDENCE.md` | `039c04de42a43639c99b788d9049089bffa65f37c5e33aad4470189410e2f254` | 4254 |
| `AWARD_CATALOG_EVIDENCE.md` | `19bd80e9d9398d85d905d46e1cb4488d40396882bcc15d167c4d5bae18f74e85` | 5017 |
| `MONETARY_REFERENCE_EVIDENCE.md` | `326154e6c35c726841bce1754169b7e05d234979fe6db8f3db87827c3fd2a466` | 4805 |
| `SCORING_CATALOG_EVIDENCE.md` | `129badf940af6356d8de3e440c5c524b97aeac4c5ba2e2976eb8684065b51967` | 7103 |
| `SOURCE_LICENSE_MANIFEST.md` | `29ee39f051c032fc917707ccbbd4a485381d3a7d8b1e155cf86469985d8b44ed` | 18839 |
