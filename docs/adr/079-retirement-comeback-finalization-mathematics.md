# ADR-079: Matemática de Retirement, Comeback y Career Finalization

- **Estado:** Aceptado — familias, cursor y lifecycle; calibración pendiente
- **Fecha:** 2026-08-01
- **Decisiones relacionadas:** DR-008, DR-010, DR-016, DR-021, DR-056,
  DR-057, DR-058, DR-061, DR-062, DR-063, DR-065, DR-067 y DR-069
- **Aclara:** ADR-013, ADR-016, ADR-043 y ADR-062
- **Refina:** ADR-070, ADR-074, ADR-076 y ADR-078
- **Especificación:**
  [RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md](../RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)

## Contexto

ADR-062 separó `PlayerPlayingStatus` del lifecycle de Career, pero dejó abiertos
el hazard, comeback, cursor posretiro y boundary irreversible. En particular,
`CareerStatus.RETIRED` podía confundirse con un retiro deportivo reversible y
DR-069 no fijaba cuándo se cerraban los facts, score, perfil y ranking.

Sin una decisión normativa, una implementación podría completar al primer
retiro, reabrir una Career finalizada, forzar retiro por edad o falta de club,
re-samplear decisiones al resume, ejecutar módulos on-field retirado o usar un
watchdog técnico como regla competitiva.

## Decisión

### Estados ortogonales y finalización

`PlayerPlayingStatus.ACTIVE|RETIRED` representa exclusivamente actividad
deportiva y permite ciclos. `CareerStatus.RETIRED` se conserva exclusivamente
como etapa irreversible **FINALIZING** entre una Career abierta y `COMPLETED`.
No representa `RetirementOccurred`, no admite gameplay/comeback y se presenta
como “finalizando”. No se añade `CareerStatus.RETIRED -> ACTIVE`.

`CareerFinalizationConfirmed` fija el terminal cursor y el closed fact frontier,
después de una confirmación explícita en un lifecycle-safe boundary. Desde ese
fact no pueden aparecer gameplay facts ni score-affecting facts. Un pipeline
idempotente calcula ledger/snapshot final, integridad, compatibilidad y perfil;
su commit produce `CareerCompleted` y `CareerStatus.COMPLETED`.

Ranking solo considera `COMPLETED` con integridad/compatibilidad y final
`ScoreSnapshot`. `ABANDONED` e `INVALIDATED` siguen terminales no competitivos.

### Cursor posretiro

No se crea otra timeline. Se insertan al inicio de `AVAILABILITY(Qn)` las
suboperaciones estables `.lifecycle.retirement`, `.lifecycle.comeback` y
`.lifecycle.finalization`. Quarters/seasons siguen mientras la Career está
abierta y playing está `RETIRED`.

Role/Minutes, on-field Performance, National Team y player contribution quedan
lógicamente en cero sin consumir RNG. Health recovery/sequela, chronological
Development con inactivity, World, Market comeback adapter, Awards ya causados,
Reputation/Social y Events compatibles continúan. Ninguna operación reescribe
una Q cerrada.

### Retirement y Comeback

Motivation es assessment derivada. Retirement usa competing risks
`VOLUNTARY|HEALTH|MARKET|OTHER` con hazards log-lineales integrados:

```text
H[j] = deltaYears * exp(eta[j])
p(any) = -expm1(-sum_j H[j])
P(cause=j | any) = H[j] / sum_j H[j]
```

Occurrence usa `BinomialInverseCdfV1(1,p)` y cause el categorical canónico.
`EXTERNAL` solo proviene de un fact/policy allowlisted. No hay edad máxima,
threshold, cap ni cooldown. Una oportunidad no cambia status y se congela antes
de `WAITING_DECISION`; user choice no consume RNG.

Comeback usa eligibility lógica y un hazard acumulativo distinto. Se aceptan
dos rutas: willingness sin club, que puede dejar `ACTIVE+UNATTACHED`, y oferta
válida producida por Market. Ninguna crea club/contrato ni habilita minutos sin
affiliation/registration válida. Los episodios/counters permiten múltiples
ciclos y nunca actúan como blocker.

### FinalizationOpportunity y manual finish

Continuation viability es una sigmoid derivada de Motivation, playability,
Market, comeback potential, sporting relevance, goals y elapsed time. Alimenta
un hazard de `FinalizationOpportunity`, no un threshold. Rechazar no crea
cooldown.

El usuario puede confirmar `FinishCareer` en cualquier lifecycle-safe boundary
con Career abierta y playing `RETIRED`, aun sin oportunidad. Con playing
`ACTIVE`, terminar anticipadamente es abandono, no completion competitiva.

### Terminación práctica

No hay hard age/career cap. Monte Carlo puede usar una
`CalibrationAutomationPolicy` versionada fuera del `EngineParameterSet` y
Difficulty. Un execution guard devuelve `INCONCLUSIVE_GUARD_REACHED` y right
censoring sin facts ni mutación; no fuerza retiro/finalización.

## Alternativas rechazadas

1. Eliminar `CareerStatus.RETIRED` sin migración de ADR-016.
2. Usarlo como sinónimo de `PlayerPlayingStatus.RETIRED`.
3. Permitir `CareerStatus.RETIRED -> ACTIVE`.
4. Completar o congelar score al primer retiro deportivo.
5. Nueva timeline o fase top-level posretiro.
6. Edad máxima, forced retirement, cooldown o cap de cycles.
7. Retirement por ausencia de club o lesión severa inferida.
8. Threshold de continuation viability para completar automáticamente.
9. Crear club/contrato al aceptar comeback.
10. RNG en una decisión del usuario o resampling al resume.
11. Usar automation/watchdog de calibración como gameplay.

## Consecuencias

- DR-069 queda resuelta y deja de bloquear cursor, freeze y ranking boundary.
- G3B-L01 pasa a `RESOLVED_MATH`; L02/L04 a `PARTIAL_CALIBRATION`.
- DR-062 pasa a `PARTIAL_CALIBRATION`: no queda fórmula/sampler/transición
  abierta, pero faltan coefficients, targets y expected goldens.
- `CareerFinalizationConfirmed` se incorpora al catálogo de Domain Facts.
- `CareerStatus.RETIRED` no admite seasons; una Career deportivamente retirada
  permanece `ACTIVE` hasta confirmar finalización.
- Scoring sigue determinista y fuera de Retirement; G3C-11 define sus fórmulas.
- DR-065/066/067 siguen abiertas para clubs externos, registration y timing,
  sin bloquear la ruta abstracta de comeback.
- Cambiar equations, cursor order, state semantics, terminal fact, samplers,
  quantization o streams exige revisar este ADR y `engineVersion`.

## Gates

1. `EngineParameterSet.retirementComeback` completo y hash publicado;
2. schemas de opportunities/episodes/finalization conformes a DR-063;
3. adapter Market/registration compatible con DR-065/066/067;
4. golden vectors cross-runtime y tests de RNG consumption/resume;
5. Monte Carlo SMOKE/CALIBRATION/DEEP, survival y right-censor diagnostics;
6. Scoring final/freeze implementado después de G3C-11;
7. ninguna implementación antes de superar gates aplicables.

## Referencias

- [Especificación matemática](../RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
- [Especificación estructural](../REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
- [Contrato matemático](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Facts y Scoring](../SCORING_FACTS_SPEC.md)
- [ADR-016](./016-career-lifecycle.md)
- [ADR-062](./062-playing-retirement-and-comeback.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [ADR-078](./078-reputation-public-attention-social-mathematics.md)
- [DR-062](../DECISIONS_REQUIRED.md#dr-062--hazard-y-proceso-de-retiro)
- [DR-069](../DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso)

