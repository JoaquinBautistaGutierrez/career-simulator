# ADR-062: Estado deportivo, retiro y regreso

- Estado: Aceptado para estructura; matemática y finalización pendientes
- Fecha: 2026-07-28
- Decisión relacionada: DR-062
- Aclara: ADR-016
- Alcance: estado deportivo, motivación, retiro, comeback y frontera terminal

## Contexto

ADR-016 usaba `CareerStatus.RETIRED` para el período entre actividad y cierre.
Sin embargo, `MASTER_SPEC` contempla regresos del retiro y el Bloque 9 exige
soportar más de un retiro dentro de la misma Career. Permitir
`CareerStatus.RETIRED -> ACTIVE` rompería la matriz aceptada y confundiría el
lifecycle del run con el estado deportivo del jugador.

También faltaba definir si ausencia de club, lesión, edad o baja motivación
forzaban retiro, y cómo representar motivación sin añadir un overall
psicológico.

## Decisión

### Estados ortogonales

Se introduce el concepto de dominio:

```text
PlayerPlayingStatus = ACTIVE | RETIRED
```

Es distinto de:

- `CareerStatus`;
- `ContractStatus`;
- `PlayerClubAffiliation`;
- disponibilidad médica;
- retiro internacional.

Una Career abierta puede tener:

```text
CareerStatus.ACTIVE + PlayerPlayingStatus.RETIRED
```

Si existe una decisión de comeback:

```text
CareerStatus.WAITING_DECISION + PlayerPlayingStatus.RETIRED
```

`CareerStatus.RETIRED` conserva la semántica de etapa irreversible de cierre de
ADR-016. No representa todo `RetirementOccurred` y no admite comeback.

### Proceso de retiro

Retirement posee oportunidades, hazard, decisión y outcome. Consume edad,
trayectoria, Health, rol/minutos, Performance, contrato/Market, contexto,
achievements y un `CareerMotivationAssessment` derivado.

`CareerMotivationAssessment` no es un trait nuevo. Deriva de `ambition`, morale,
historia y contexto; su persistencia proviene de esos inputs.

No existe:

- edad máxima;
- threshold obligatorio;
- retiro automático por falta de club;
- retiro directo escrito por una InjuryEpisode;
- cooldown o cupo de retiro.

Las causas mecánicas iniciales son extensibles y equivalentes a `VOLUNTARY`,
`HEALTH`, `MARKET`, `EXTERNAL` y `OTHER`. En la ruta normal existe reflexión y
decisión. Solo una consecuencia externa o imposibilidad explícita puede omitir
esa reflexión; Retirement sigue siendo owner del cambio de estado.

### Regreso

Mientras la Career siga abierta:

```text
RETIRED playing status
-> ComebackOpportunity
-> optional PendingDecision
-> ComebackOccurred
-> ACTIVE playing status
```

No se garantiza oportunidad ni se fija espera. Regresar no restaura club,
contrato, rol, posición, fitness o elegibilidad. No reabre ventanas cerradas.

Cada retiro y regreso posee identidad causal propia, permitiendo:

```text
ACTIVE -> RETIRED -> ACTIVE -> RETIRED
```

### Finalización

El primer retiro deportivo no completa la Career. `CareerStatus.RETIRED` se
alcanza únicamente cuando una política todavía pendiente declara irreversible
el cierre deportivo. DR-069 debe fijar ese boundary, el cursor posretiro, el
freeze de scoring y la transición terminal.

Hasta entonces no se altera la matriz de ADR-016 ni se implementa el runner
terminal.

## Consecuencias

- Career lifecycle y estado deportivo dejan de ser aliases.
- Comeback no requiere reabrir `CareerStatus.RETIRED`.
- `UNATTACHED` puede coexistir con actividad y no fuerza retiro.
- Retirement/Reputation/Social pueden seguir evolucionando antes del cierre.
- Ranking permanece limitado a Careers `COMPLETED`, íntegras y elegibles.
- DR-062 sigue abierta por hazard, outcomes, precisión, streams, parámetros y
  fixtures; DR-069 bloquea finalización.

## Alternativas rechazadas

### Usar solo `CareerStatus`

Rechazada porque no puede representar un retiro reversible sin romper
ADR-016.

### Permitir `CareerStatus.RETIRED -> ACTIVE`

Rechazada porque convertiría una etapa de cierre en una pausa y alteraría la
matriz vigente.

### Completar al primer retiro

Rechazada porque impide los regresos normativos.

### Añadir `CONSIDERING_RETIREMENT` persistente

Rechazada por innecesaria: `PendingDecision` representa la interrupción.

### Retirar automáticamente al quedar sin club

Rechazada porque ausencia de contrato es un contexto causal, no identidad con
retiro.

### Edad máxima técnica

Rechazada porque sería un hard cap de gameplay. La terminación práctica se
resuelve con política/validación, no con retiro obligatorio.

## Pendiente

- Función/familia de hazard y competing risks.
- Dominio/transformación de motivation.
- Cadencia exacta y `operationKey`.
- Política de decisión frente a cada cause.
- Comeback hazard, contexts y fixtures.
- DR-069: período posretiro, boundary irreversible, scoring final, ranking,
  perfil y terminación práctica.
- DR-063/ADR-010 ya fijan facts, idempotencia y aliases; faltan schemas
  concretos conformes.

## Pruebas y gates

- `CareerStatus` y `PlayerPlayingStatus` varían de forma independiente.
- Primer retiro no completa ni rankea la Career.
- Retiro→regreso→retiro conserva episodios únicos.
- Ausencia de club no fuerza retiro.
- Edad/lesión/low minutes no son thresholds binarios.
- Comeback no reabre una Q ni repite streams.
- No hay cooldown, cupo o edad máxima.
- `CareerStatus.RETIRED` continúa sin admitir advance deportivo o comeback.
- `COMPLETED` exige cierre, scoring y consolidación confirmados.

## Referencias

- [Especificación de Reputation, Social & Retirement](../REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
- [ADR-004: Oportunidades](./004-opportunity-semantics.md)
- [ADR-013: State machine de temporada](./013-season-state-machine.md)
- [ADR-016: Ciclo de vida de Career](./016-career-lifecycle.md)
- [ADR-017: Descubrimientos](./017-discoveries.md)
- [Registro de decisiones — DR-062](../DECISIONS_REQUIRED.md#dr-062--hazard-y-proceso-de-retiro)
- [Registro de decisiones — DR-069](../DECISIONS_REQUIRED.md#dr-069--finalización-tras-retiro-y-ventana-de-regreso)
