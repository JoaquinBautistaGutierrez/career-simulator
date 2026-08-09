# Vertical Slice Data Catalog Specification

## 1. Estado, autoridad y límites

Este documento es la especificación normativa de datos para el vertical slice
V1 de G3D. Define qué entidades, campos, mappings, provenance y validaciones
deben existir antes de adquirir o publicar datos. No contiene observaciones,
ratings, importes, coeficientes ni una temporada elegida.

Autoridades relacionadas:

- `MASTER_SPEC.docx` §34.5 fija el corte funcional;
- ADR-015 gobierna las cinco versiones canónicas;
- ADR-070 gobierna identidad de `EngineParameterSet`;
- ADR-075 gobierna Club/Competitions/World;
- ADR-076 gobierna Money y Market;
- ADR-077 gobierna National Team/Awards;
- ADR-080 gobierna Scoring;
- ADR-081 aprueba la continuidad híbrida de clubes externos;
- ADR-082 aprueba la policy de nacionalidad deportiva del slice.

La adquisición, normalización y publicación pertenecen a fases posteriores. En
G3D-2 todos los artifacts permanecen `PLANNED` o `PROPOSED`; ningún valor se
considera histórico por aparecer en esta spec.

## 2. Scope freeze V1

| Dimensión | Propuesta G3D-2 | Estado |
|---|---|---|
| País inicial | Argentina | `APPROVED` |
| Contextos detallados | Argentina y España | `APPROVED` |
| Ligas detalladas | una liga principal por país | `APPROVED`; edición exacta requiere datos |
| Clubes detallados | exactamente **8 por liga**, 16 en total | `APPROVED`; identidades requieren validación |
| Posiciones | GK, CM y ST | `APPROVED` |
| Competiciones de club | dos ligas, dos copas domésticas, Libertadores y Champions League | `APPROVED`; formatos requieren datos |
| Selección detallada | selección senior de Argentina | `APPROVED`; definitions/ediciones requieren datos |
| Premios | exactamente 5 definitions funcionales | `APPROVED`; IDs/ediciones requieren datos |
| Lesiones | exactamente 6 definitions mecánicas candidatas | `DATA_VALIDATION_REQUIRED` |
| Monedas nativas | ARS y EUR para los dos mercados detallados | `APPROVED`; series/fechas requieren datos |
| Temporada base | latest-complete-edition policy, sin año elegido | `DATA_VALIDATION_REQUIRED` |
| Mercado efectivo | post-season `MARKET` boundary únicamente | `APPROVED` |
| Mundo restante | contextos abstractos y catálogo real externo mínimo | `APPROVED` por ADR-081 |

Otros países pueden aparecer como región, rival field, asociación, identidad
real de participante continental o referencia de evidencia. No adquieren por
ello una liga detallada, un mercado calibrado o una ruta de Career.

## 3. Identidad, ownership y versionado

### 3.1 Reglas de ID

1. IDs son estables, ASCII, case-sensitive y no incluyen sponsor o nombre
   comercial temporal.
2. Un cambio de label crea alias; un cambio de identidad real crea otra
   definition.
3. Una nueva edición/formato crea `formatVersion` o `editionId`, no reutiliza
   bytes bajo el mismo ID.
4. Definition e initial evidence pertenecen a `dataVersion`.
5. Estado simulado pertenece a Career y nunca reescribe la Definition.
6. References scoring pertenecen a `scoringVersion`; no contaminan gameplay.

### 3.2 Envelope común de catálogo

```text
CatalogDefinitionEnvelope {
  definitionId
  definitionType
  schemaVersion
  dataVersion
  canonicalName
  aliases[]
  validFrom
  validTo?
  provenanceRefs[]
  confidence
  publicationStatus
  artifactHash
}
```

`validFrom/validTo` son boundaries de dominio o fechas de la fuente cuando
corresponda; no participan de una identidad estocástica. `artifactHash` se
calcula sobre el payload canónico publicado.

### 3.3 Definition frente a State

```text
ClubDefinition (dataVersion, inmutable)
  -> InitialStateTransform (EngineParameterSet)
  -> ClubState[career, season] (simulado)
```

La evidencia inicial condiciona el state; no establece floors ni verdad
eterna. El mismo patrón aplica a League, Competition, NationalTeam y World.

## 4. Temporada base y referencia temporal

### 4.1 `VerticalSliceBaselineManifest`

```text
VerticalSliceBaselineManifest {
  baselineManifestId
  referenceCutoffDate
  countrySeasonBindings[] {
    countryId
    baselineSeasonId
    startDate
    closeDate
    seasonConvention: CALENDAR_YEAR | CROSS_YEAR
    competitionFormatVersionRefs[]
  }
  observationWindowRefs[]
  formatChangeNotes[]
  sourceRefs[]
  approvalState
}
```

### 4.2 Policy de selección

Para cada jurisdicción se elegirá la última edición **completamente cerrada**
anterior al `referenceCutoffDate` común que tenga cobertura reproducible de
formatos, calendario, clubes y métricas mínimas. Argentina y España no deben
compartir artificialmente el mismo season label: cada binding conserva su
convención y ambos se alinean mediante el cutoff.

Antes de adquirir datos deben decidirse y registrarse:

- el cutoff lógico;
- la edición completa por jurisdicción;
- si la observación usa una o varias temporadas anteriores;
- tratamiento de format changes;
- anomalías/exclusiones;
- reglas de refresh y retención.

No se acepta una temporada en curso solo por ser más reciente.

## 5. Clubes detallados

### 5.1 Policy de cantidad

V1 usa exactamente **8 clubes reales por liga detallada**. Ocho permite cubrir
diversidad deportiva e institucional sin convertir el slice en simulación de
planteles/ligas completas. Cambiar el número requiere revisar scope,
cardinalidad de ParameterSet, targets, goldens y `dataVersion`.

### 5.2 Portfolio de selección

El conjunto de cada liga debe cubrir, como constraints de portfolio y no como
scores individuales:

| Cobertura | Requisito |
|---|---|
| Fuerza deportiva | al menos contextos alto, medio y bajo dentro de la edición |
| Prestige/reach | diversidad regional/global; popularidad no decide sola |
| Finanzas | diversidad de capacidad/proxy y uncertainty |
| Development | al menos contextos contrastantes con evidencia utilizable |
| Medical environment | evidencia o proxy revisable; no inferir de injury count bruto |
| Stability | contextos institucionales estables y volátiles |
| Táctica | suficiente variedad para probar TacticalFit |
| Carrera | rutas plausibles de debut, consolidación y salto entre mercados |
| Evidencia | identidad/formatos Tier A y baselines B/C utilizables |

Obligatorios: identidad/licencia, pertenencia a la edición, cobertura de
strength, finanzas, development, stability, reach y disponibilidad de
evidencia mínima. Medical y tactical proxies pueden ser sintéticos si quedan
marcados Tier C/D, con uncertainty y aceptación de producto.

Los nombres no se seleccionan en G3D-2.

## 6. `ClubDefinition`

```text
ClubDefinition {
  clubId
  canonicalName
  shortName?
  countryId
  regionId
  cityOrAreaId?
  baselineMemberships[] {
    competitionId
    editionId
    membershipRole
  }
  identityAliases[]
  presentationMetadataRef?
  sourceRefs[]
  validFrom
  validTo?
  confidence
  dataVersion
}
```

Founding date, stadium, colors, crest o rivalries solo se incorporan con un
consumer autorizado y revisión separada de derechos. Un crest nunca es
requisito de identidad.

## 7. Evidencia base de club

### 7.1 Artifact

```text
ClubBaselineEvidence {
  clubId
  baselineSeasonId
  dimensionEvidence[] {
    dimension
    rawObservationRefs[]
    observationPeriod
    rawUnits
    transformStatus
    estimateStatus: OBSERVED | DERIVED_ESTIMATE | PRODUCT_CALIBRATED
    confidence
    uncertaintyStatus
    limitations[]
  }
  provenanceGraphRef
}
```

Dimensiones requeridas: attack, defense, control, sporting context, prestige,
financialPower proxy, developmentQuality proxy, medicalQuality proxy,
stability y public reach.

### 7.2 Sporting strength

La evidencia puede incluir resultados, producción ofensiva/defensiva,
posesión/control, métricas ajustadas por rival y contexto competitivo. Cada
observación declara denominador, unidad, edición y cobertura. La tabla de
posiciones no se transforma directamente en attack/defense/control: requiere
`TransformationDefinition` y uncertainty.

### 7.3 Prestige

Prestige representa relevancia institucional acumulada, no fuerza actual,
followers ni total de títulos. Puede combinar continuidad histórica, logros,
reconocimiento y reach mediante estimación documentada. Su fuente primaria
puede ser `DERIVED_ESTIMATE` o `PRODUCT_DECISION`, nunca una identidad popular
presentada como hecho.

### 7.4 FinancialPower

Proxies admisibles: ingresos, wage spend, transfer spend, squad-value proxy,
presupuesto publicado y contexto económico. Cada uno conserva moneda, fecha,
gross/net, disclosed/estimated y comparabilidad. No se promedian monedas o
fechas sin transformación monetaria publicada.

### 7.5 Development y Medical Quality

Development puede observar producción juvenil, minutos jóvenes,
infraestructura/formación y transición al primer equipo. Medical puede usar
availability, recurrencia, recovery o infraestructura solo con denominador,
reporting bias y exposición. Baja incidencia no prueba alta MedicalQuality.
Cuando no haya evidencia suficiente, se usa synthetic calibration declarada,
no cero ni un rating oculto.

### 7.6 Stability

Puede consumir continuidad de manager, resultados relativos, volatilidad
institucional/financiera y cambios estructurales. Manager tenure no sustituye
todo el constructo.

### 7.7 Public reach

Se publican por separado `ClubReach`, `LeagueReach`, `NationalTeamReach`,
`RegionalReach` y `GlobalReach`. Cada fuente social declara plataforma, fecha,
cuenta, duplicación estimada y definición. Followers de una plataforma no
equivalen al reach total.

## 8. Competition catalog

### 8.1 `CompetitionDefinition`

```text
CompetitionDefinition {
  competitionId
  canonicalName
  aliases[]
  competitionType: LEAGUE | DOMESTIC_CUP | CONTINENTAL
  countryOrRegionId
  participantPolicyRef
  formatVersions[] {
    formatVersionId
    validPeriod
    stages[]
    progressionEdges[]
    guaranteedExposureRules[]
    conditionalExposureRules[]
    matchEquivalentRules[]
    pressureProfileRefs[]
    tiePolicyRef
    qualificationOutputs[]
    mobilityOutputs[]
    calendarAllocationRef
  }
  gameplayFieldProfileRef
  reachProfileRef
  scoringCompetitionRef?
  provenanceRefs[]
  dataVersion
}
```

El `scoringCompetitionRef` es un link, no incluye puntos, IJL o CC.

### 8.2 Scope mínimo de club

| Slot de catálogo | Scope | Estado |
|---|---|---|
| `ARG_PRIMARY_LEAGUE` | liga principal argentina | identity/format por investigar |
| `ARG_DOMESTIC_CUP` | copa doméstica argentina | identity/format por investigar |
| `CONMEBOL_LIBERTADORES` | continental del contexto argentino | identity estable; edición/formato por investigar |
| `ESP_PRIMARY_LEAGUE` | liga principal española | identity/format por investigar |
| `ESP_DOMESTIC_CUP` | copa doméstica española | identity/format por investigar |
| `UEFA_CHAMPIONS_LEAGUE` | continental del contexto español | identity estable; edición/formato por investigar |

Los labels de slot no son necesariamente los IDs finales publicados.

League definitions no comparten número de participantes, match equivalents,
season boundary, relegation, cup path o qualification. Domestic/continental
cups declaran graph de stages y solo habilitan exposure condicional después de
un progression checkpoint cerrado. No se requieren brackets completos.

### 8.3 Continental y national contexts

Libertadores y Champions usan el mismo contrato matemático pero definitions,
fields, stages, reach y presión distintos. InternationalCompetitionDefinition
usa envelope equivalente con association/age category, call-up/squad policy,
format y eligibility reference. G3D-2 no inventa un torneo de selección: el
catálogo V1 requiere al menos un `REGULAR_SENIOR_WINDOW` y, si la temporada
base lo contiene, un `SENIOR_MAJOR_TOURNAMENT`; identidad/edición son
`DATA_VALIDATION_REQUIRED`.

## 9. Calendar, quarters y cursor

### 9.1 `CalendarDefinition`

```text
CalendarDefinition {
  calendarId
  baselineManifestId
  seasonBindings[]
  quarters[4] {
    quarterIndex
    orderedStageRefs[]
    guaranteedMatchEquivalents
    conditionalMatchEquivalentRules[]
    pressureWindowRefs[]
    internationalWindowRefs[]
  }
  marketWindowRefs[]
  awardResolutionWindowRefs[]
  registrationBoundaryRefs[]
  seasonCloseBoundary
  congestionInputs
  provenanceRefs[]
  dataVersion
}
```

### 9.2 Asignación Q1–Q4

El mapping se construye desde orden y densidad observados, no por división
uniforme. Debe preservar:

- inicio/cierre y orden de stages;
- progression antes de exposure condicional;
- international windows y Health snapshot aplicable;
- award evaluation/resolution timing;
- `SEASON_CLOSE` y `MARKET`;
- effective affiliation solo en un boundary futuro;
- pressure y congestion derivados de la asignación.

Cada stage se asigna a una o más Q mediante una regla versionada y un
allocation de match equivalents. Una revisión de formato publica otra
`CompetitionFormatVersion` y `CalendarDefinition`.

### 9.3 Plan exacto de cierre DR-021

Faltan: baseline cutoff, edition IDs, stage dates/ranges, match counts,
guaranteed/conditional classification, international windows, award timing y
season close de cada jurisdicción. Producto debe aprobar el cutoff y el manejo
de anomalías. DR-021 cierra cuando `DS-COMPETITION-CATALOG`,
`DS-NATIONAL-COMPETITION-CATALOG` y `DS-CALENDAR-SLICE` estén `VALIDATED`, sus
stage→Q mappings no tengan huecos/solapes inválidos y los goldens de calendar
usen sus hashes.

## 10. Market windows y registration

### 10.1 `MarketWindowDefinition`

```text
MarketWindowDefinition {
  windowId
  jurisdictionId
  leagueOrCompetitionRefs[]
  logicalOpenBoundary
  logicalCloseBoundary
  quarterMapping
  permittedTransactionTypes[]
  registrationBoundaryRef
  sourceRefs[]
  formatVersionId
  dataVersion
}
```

V1 registra ventanas observadas para provenance, pero solo permite resolver y
hacer efectivo un movimiento en el `MARKET` post-season ya existente. No
añade fases o boundaries entre Q. Interest narrativo fuera de ese context no
se convierte en oferta efectiva.

### 10.2 `RegistrationEligibility`

```text
RegistrationEligibility {
  registrationEligibilityId
  playerId
  contractHoldingClubId
  currentSportingClubId
  competitionId
  editionId
  effectiveBoundary
  status: ELIGIBLE | INELIGIBLE | PENDING_DATA
  ruleRefs[]
  transactionRef?
  reasonCodes[]
  dataVersion
}
```

Subset V1:

1. solo movimientos completados en `MARKET` post-season;
2. registro efectivo en el `SEASON_START` siguiente;
3. validación de afiliación, holder/sporting club, membership, transaction
   type, window y CompetitionDefinition;
4. loan conserva holder y cambia sporting club;
5. no se modelan cup-tied, squad quotas, replacement exceptions o listas
   mid-season salvo que una Definition V1 los declare imprescindibles;
6. ausencia de regla requerida produce `PENDING_DATA`, nunca elegibilidad
   inferida;
7. facts cerrados retienen club/competition originales.

Este subset resuelve la policy de DR-066; sus bindings permanecen
`DATA_REQUIRED` hasta publicar las Definitions.

## 11. External Club Pool híbrido

ADR-081 aprueba:

```text
real identity catalog
  + non-identifiable context fields
  + deterministic materialization on interaction
```

### 11.1 `ExternalClubContext`

```text
ExternalClubContext {
  clubId
  materializationRef?
  countryId
  regionId
  leagueId
  tierId
  sportingSummary { attack, defense, control }
  prestige
  financialPower
  positionNeedOrCompetition
  tacticalContextRef?
  publicReach
  marketAndRegistrationContextRefs[]
  baselineEvidenceRef
  generationIdentity
}
```

No exige ManagerContext, todas las qualities ni PositionCompetition completo
mientras el club no interactúe causalmente con el protagonista.

### 11.2 Materialización

Se materializa un club cuando:

- contrata, presta, registra o mantiene al protagonista;
- entra o sale de un tier detallado;
- debe aparecer nombrado en un fact de champion/qualification/mobility;
- una decision/pending payload necesita identidad persistente.

La clave es determinista sobre `careerId + dataVersion + clubId +
firstMaterializationOperationKey`. El `clubId` siempre proviene del catálogo
real. El state inicial se deriva de evidence/profile y draws con context keys
propios; se persiste para replay y nunca se regenera.

Fields no identificables pueden resolver dificultad/opponent distributions,
pero no pueden aparecer como club, champion, contratante o titular de un fact.

### 11.3 Mobility y continuidad

`MobilityTransitionRequest` selecciona solo identities elegibles del pool real,
en orden canónico. Al aplicar transición se materializa el club si hace falta y
se emite el fact. Si el club del protagonista desciende, contrato e identidad
continúan y el adapter reducido produce calendario, opportunity, context,
Market y scoring attribution del tier. No se fuerza transferencia o retiro.

## 12. Money data contract

### 12.1 Observation

```text
MoneyObservation {
  observationId
  amount
  amountUnit: MAJOR | MINOR
  currencyCode
  minorUnitScale
  monetaryDate
  transactionOrMarketType
  disclosedStatus
  grossNetStatus?
  recurringPeriod?
  inflationContextRef?
  exchangeRateRef?
  sourceRef
  confidence
}
```

### 12.2 Policy de calibración

Se adopta opción C:

- gameplay/persistencia conserva `Money { amountMinor, currencyCode }`;
- observaciones conservan moneda y fecha nativas;
- calibración puede derivar un `NormalizedMonetaryContext` de poder adquisitivo
  relativo con base date y transform versionados;
- el valor normalizado no se presenta como dinero ni reemplaza el original;
- la conversión a display es una proyección, no una mutación histórica.

ARS y EUR son las monedas obligatorias de los mercados detallados. Una moneda
adicional solo entra si una identidad externa interactiva queda en scope y su
artifact monetario supera el mismo gate.

### 12.3 `MonetaryNormalizationArtifact`

La policy dual de esta sección queda aceptada por
[ADR-083](adr/083-native-money-and-calibration-normalization.md).

Debe declarar source series, base date, formula, rounding, gaps, discontinued
currencies, revisions y tratamiento de alta inflación. Argentina no usa una
tasa puntual como proxy de toda una temporada. No se publican importes sin
integer-range validation y goldens de conversión.

DR-027 cierra cuando moneda/fechas del baseline, source hierarchy, series,
formula, rounding, display policy, integer range y fixtures estén validados.
La policy está cerrada; los datos no.

## 13. Position mapping y observaciones de jugador

### 13.1 `PositionMappingDefinition`

```text
PositionMappingDefinition {
  mappingId
  sourceTaxonomy
  sourceLabel
  canonicalPosition: GK | CM | ST | OTHER | AMBIGUOUS
  positionGroup
  inclusionRule
  exclusionRule
  effectivePositionRule?
  reviewRequired
  confidence
}
```

Reglas V1:

- goalkeeper explícito → GK;
- central midfielder explícito → CM;
- defensive/attacking/wide/generic midfielder → `OTHER` o `AMBIGUOUS` salvo
  evidencia de minutos centrales;
- center forward/striker explícito → ST;
- winger/generic forward → `OTHER` o `AMBIGUOUS`;
- registros multiposición conservan minutes/weights y no se duplican;
- effective position se deriva de uso observado, no reemplaza primaryPosition.

### 13.2 Exposure y performance

`PlayerExposureObservation` requiere anonymous/player source ID, season,
competition, position mapping, minutes, appearances, starts, team opportunity,
age, club, source y quality flags.

Performance conserva por separado:

- GK: shots-on-target equivalents faced, saves, goals conceded, clean-sheet
  eligibility/outcome y dimensions soportadas;
- CM: progression, creative, control y defensive proxies, más counts
  secundarios existentes;
- ST: goals, assists y attacking opportunity/context;
- observed production, inferred task/performance transforms y targets son
  artifacts distintos.

Longitudinal Development conserva age, exposure, role, context, transfers,
position, censoring y cohort bias. Diferencias cross-sectional no se presentan
como trayectorias individuales.

## 14. Injury taxonomy V1

### 14.1 Contract

```text
InjuryDefinition {
  injuryId
  injuryFamilyId
  compatibleOrigins[]
  affectedAreaType
  hazardProfileRef
  severityProfileRef
  recoveryProfileRef
  relapseRelationRefs[]
  sequelaCompatibility
  sourceMappingRef
  presentationSafetyRef
  status
}
```

### 14.2 Seis candidates

| Candidate injuryId | Mecánica cubierta | Origins | Estado |
|---|---|---|---|
| `INJ_LOWER_LIMB_MUSCLE` | lesión muscular de miembro inferior | MATCH, TRAINING | `PROPOSED` |
| `INJ_GROIN_HIP_MUSCLE` | aductor/ingle/cadera muscular | MATCH, TRAINING | `PROPOSED` |
| `INJ_ANKLE_LIGAMENT` | articulación/ligamento de tobillo | MATCH, TRAINING | `PROPOSED` |
| `INJ_KNEE_LIGAMENT` | ligamento/estructura de rodilla | MATCH, TRAINING | `PROPOSED` |
| `INJ_UPPER_LIMB_TRAUMA` | hombro/brazo/mano, relevante especialmente para GK | MATCH, TRAINING, NON_FOOTBALL | `PROPOSED` |
| `INJ_HEAD_CONCUSSION` | trauma craneal/concussion con safety metadata | MATCH, TRAINING, EXTERNAL_EVENT | `PROPOSED` |

La lista cubre frecuencia, impacto, recurrencia, perfiles de recovery,
miembros inferiores/superiores y seguridad. No asigna hazard, severity o
duration. Pasa a `APPROVED` solo después de validar source mappings y cobertura;
labels clínicos de presentación permanecen en content.

### 14.3 Mapping externo

El mapping conserva label original, code/source taxonomy, origin, dates,
absence, recurrence, exposure, censoring y overlaps. Usa reglas revisadas, no
substring matching. Labels insuficientes van a `UNKNOWN_UNMAPPED`; no se
fuerzan dentro de las seis. Episodios solapados conservan identities y no suman
availability shares.

## 15. National Team y sporting nationality

### 15.1 `NationalTeamDefinition`

```text
NationalTeamDefinition {
  nationalTeamId
  countryOrAssociationId
  category: SENIOR | YOUTH | OLYMPIC
  reachProfileRef
  competitionMemberships[]
  generationProfileRef
  eligibilityPolicyRef
  validPeriod
  provenanceRefs[]
  dataVersion
}
```

V1 detalla solo Argentina senior. Oponentes usan definitions reales o fields
no identificables; un field no se publica como selección ganadora.

### 15.2 Policy V1 de elegibilidad

ADR-082 fija para Quick y Custom del vertical slice:

- `birthCountryId=ARG` y Argentina como única sporting eligibility inicial;
- no se genera segunda nacionalidad, ascendencia o naturalización;
- jugar/residir en España no crea eligibility;
- no hay eligibility transition durante V1;
- youth/olympic contexts pueden existir como Definitions, pero no crean lock-in
  ni segunda asociación;
- una futura ampliación multi-eligibility requiere biografía explícita,
  rule/data refs, user choice, facts y nueva versión; nunca se infiere.

Esto cierra DR-068 para V1 sin afirmar una simplificación universal de reglas
internacionales.

## 16. Award catalog V1

### 16.1 `AwardDefinition`

```text
AwardDefinition {
  awardId
  canonicalName
  awardFamily
  evaluationFamily: COMPARATIVE_JUDGED | STATISTICAL
  categoryOrPositionScope
  eligibilityPredicateRef
  evaluationWindowRef
  fieldModelRef
  fieldSize
  allowedSignalRefs[]
  tiePolicy
  ordinalStatuses[]
  reputationPermission
  scoringAwardRef?
  validPeriod
  provenanceRefs[]
  dataVersion
}
```

### 16.2 Cinco definitions funcionales

| Slot | Caso probado | Family | Estado |
|---|---|---|---|
| `AWD_GLOBAL_COMPARATIVE` | premio global position-agnostic | comparative | exact identity por validar |
| `AWD_YOUNG_COMPARATIVE` | premio juvenil | comparative | exact identity/eligibility por validar |
| `AWD_LEAGUE_PLAYER` | premio de jugador de liga | comparative | una definition por contexto mediante edition binding |
| `AWD_LEAGUE_SCORER` | líder goleador de liga | statistical | stat/tie policy por validar |
| `AWD_GK_GLOBAL_OR_LEAGUE` | caso GK posicional | comparative o statistical según Definition real | identity/family por validar |

Estos cinco cumplen el conteo de `MASTER_SPEC`: uno global, uno juvenil y tres
posicionales/de competición. CM puede competir por global/young/league; ST por
esos y scorer; GK por esos y el slot GK. Un award de torneo nacional queda
fuera del mínimo salvo que la edición baseline lo haga necesario.

Anti-duplicación, points y equivalence groups no viven aquí.

## 17. Scoring catalogs separados

### 17.1 `ScoringCompetitionDefinition`

```text
ScoringCompetitionDefinition {
  scoringCompetitionId
  gameplayCompetitionId
  basePoints?
  ijlRef?
  outcomeMultiplierRefs[]
  ccApplicability
  scoringVersion
  provenanceSourceType
  publicationStatus
}
```

### 17.2 `AwardScoringDefinition`

Incluye award reference, base points si ya son normativos, equivalence group,
stacking multiplier sequence, season scope, scoringVersion, provenance y
status. No se copian puntos al `AwardDefinition`.

### 17.3 Records, milestones e historic achievements

`RecordScoringDefinition` declara scope, entitlement/transform, upgrade,
stacking, cap group, source fact y status. `CareerMilestoneDefinition` requiere
criterio deportivo medible y nunca puntúa edad o Career abierta por sí solas.
`HistoricAchievementDefinition` exige fact allowlisted, rationale, sensitivity
review, transform, stacking, cap group, scoringVersion y approval.

### 17.4 PRI cohorts

Cohort keys incluyen GK/CM/ST, competition context, exposure/evidence bands,
reference period y fallback hierarchy. Minimum sample requirements y knots se
publican después; no existen percentiles en G3D-2.

## 18. Future data artifact structure

La estructura propuesta, sin crearla en esta fase, es:

```text
data/
  definitions/       # PUBLISHED_DEFINITION
  observations/raw/  # RAW_REFERENCE cuando licencia permita
  observations/normalized/
  mappings/
  calibration/
  scoring/
  provenance/
  manifests/
```

Ownership:

- Football Catalog/Data: definitions, mappings y snapshots;
- Calibration: observations, transforms, estimates y target artifacts;
- Scoring: definitions/config/cohorts ligados a scoringVersion;
- Content: labels narrativos/assets, nunca mechanics o points;
- Engine: consume hashes; no edita data.

### 18.1 Manifest

```text
DataArtifactManifest {
  artifactId
  artifactKind
  version
  schemaVersion
  dataVersion?
  scoringVersion?
  sha256
  sourceAndProvenanceRefs[]
  generatedFrom[]
  dependencyHashes[]
  validPeriod
  publicationStatus
}
```

### 18.2 Artifact stages

`RAW_REFERENCE -> NORMALIZED -> DERIVED_ESTIMATE -> CALIBRATION_INPUT` o
`PUBLISHED_DEFINITION`. Derived artifacts son regenerables y no se editan a
mano. Un cambio crea nuevo artifact/hash.

## 19. Missingness, confidence y uncertainty

Missing policy enum:

- `EXCLUDE_WITH_REASON`;
- `EXPLICIT_UNKNOWN`;
- `MODEL_IMPUTED`;
- `SYNTHETIC_PROVISIONAL`;
- `PRODUCT_DEFINED_DEFAULT`.

Cero nunca significa missing. Imputation declara model/version, uncertainty y
sensitivity.

```text
EvidenceConfidence {
  evidenceTier
  confidenceStatus
  uncertaintyRangeStatus
  evidenceCount
  sourceAgreement
  knownBiases[]
}
```

Confidence sirve para QA/calibración; no se convierte automáticamente en RNG o
modificador de gameplay.

## 20. Validation lifecycle

```text
SCHEMA_VALID
-> SEMANTIC_VALID
-> PROVENANCE_VALID
-> CROSS_DATASET_VALID
-> CALIBRATION_READY
-> PUBLISHED
```

Checks cross-dataset futuros:

- IDs y aliases únicos;
- membership y edition alignment;
- calendar stage/quarter completo;
- no exposure de stages no alcanzadas;
- currency/date compatible;
- mappings de posición y minutes totals;
- injury origin/recovery/censoring coherente;
- award IDs/tie/evaluation windows válidos;
- gameplay↔scoring references resolubles;
- no orphan definitions ni duplicate identities.

Plausibility diagnostics incluyen impossible minutes, negative money,
overlapping windows inválidas, progression imposible, recovery inconsistente,
duplicate awards y scoring facts sin Definition. Son diagnostics revisables,
no thresholds de gameplay.

## 21. DR y publication gates

| DR | Policy G3D-2 | Datos aún requeridos | Closure |
|---|---|---|---|
| DR-021 | latest-complete policy y mapping contract aprobados | baseline, stages, windows, Q allocation | tres calendar/catalog datasets validados |
| DR-025 | scope/campos/ownership aprobados | identities, sources, licenses, editions | catálogos publicados y hasheados |
| DR-027 | dual native+normalized policy aprobada | series, dates, currencies, transforms | monetary artifact validado |
| DR-035 | no claims públicos sin cohort/sample policy | cohorts y product approval | public-stat policy separada |
| DR-036 | exact compatibility only V1 | future cross-version evidence/policy | no equivalence inferred |
| DR-065 | hybrid pool aprobado por ADR-081 | real identity pool y adapters | policy resolved; data gate remains |
| DR-066 | next-season subset aprobado | competition bindings | definitions/registration goldens |
| DR-067 | post-season only V1 | observed windows for provenance | policy resolved; data gate remains |
| DR-068 | Argentina-only V1 por ADR-082 | Argentina Definition/rules provenance | policy resolved; data gate remains |

## 22. Readiness

Los contratos habilitan investigación y normalización sin rediscutir schemas.
No habilitan gameplay ni scoring competitivo. G3D-3 debería dividirse en:

1. **Track Data:** investigación, licencia, adquisición, mappings y catálogos;
2. **Track Calibration:** tolerancias/targets sintéticos y candidates no
   oficiales que no dependan de datos externos.

Ambos tracks convergen solo después de `CALIBRATION_READY` y nunca publican V1
por separado.
