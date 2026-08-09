# ADR-074: Matemática de Health, Injury, Recovery, Fatigue y Fitness

- Estado: Aceptado — familias y ecuaciones; calibración y catálogo pendientes
- Fecha: 2026-07-29
- Decisión relacionada: DR-057
- Refina: ADR-042, ADR-053, ADR-054, ADR-057, ADR-070, ADR-072 y ADR-073
- Especificación:
  [HEALTH_INJURY_RECOVERY_MATH_SPEC.md](../HEALTH_INJURY_RECOVERY_MATH_SPEC.md)

## Contexto

ADR-057 separó estado médico, carga, fitness, fatigue, episodios, recuperación,
recaída y secuelas, pero dejó abiertas todas sus familias matemáticas. ADR-042
ya prohíbe que una lesión resuelta al final de una Q reescriba minutos o
Performance de esa Q. ADR-072 exige que Health entregue intervalos ordinales
médicos para que disponibilidad pueda componerse exactamente con disciplina y
otras causas.

Dejar estas decisiones a implementación local permitiría:

- confundir minutos con carga;
- modelar fitness como complemento de fatigue;
- usar un porcentaje fijo o threshold de lesión;
- perder múltiples ocurrencias;
- usar family como duración rígida;
- convertir recuperación en `injuredUntil`;
- introducir cooldowns de recaída;
- sumar shares de condiciones concurrentes;
- permitir que Health edite capabilities;
- desplazar streams por el orden accidental de episodios.

## Decisión

### Carga, fatigue y fitness

La exposición competitiva y la de entrenamiento producen dose rates positivas
mediante predictores `softplus`. La carga acotada es:

```text
realizedLoad = -expm1(-(competitiveDoseRate + trainingDoseRate))
```

Acute y chronic load usan dos filtros exponenciales con:

```text
0 <= rhoAcute < rhoChronic < 1
```

La desviación de carga usa diferencia normalizada estable, no ratio crudo.

Fitness y fatigue son dos AR(1) distintos en espacio logit. Ambos son estados
persistidos `0..10000`, usan `ROUND_HALF_EVEN` y reciben shocks Normal
independientes. Fitness nunca se define como `1-fatigue`.

### Lesiones nuevas

Cada `InjuryFamily × origin` habilitada posee cumulative hazard:

```text
H[j,o] = originExposureRate[o] * exp(logRate[j,o])
```

El count agregado usa:

```text
N_new ~ Poisson(sum(H[j,o]))
```

Family y origin se asignan mediante categoricals ponderados por hazard. Se
reutilizan `PoissonInverseCdfV1` y `CategoricalCumulativeMidpointV1`. No existe
máximo de occurrences.

El compound-Poisson es una oportunidad atómica agregada de Q. Congela su
hazard snapshot antes del count para no inventar cronología match-by-match;
cada occurrence materializa sus consecuencias por ordinal y modifica Q
futuras.

### Severidad y recuperación

Severity es una variable logística-Normal interior `(0,1)`. El requirement de
recuperación usa LogNormal condicionada por severity, RecoveryCapacity,
MedicalQuality, edad/contexto e historia. Se persiste como burden entero en
unidades abstractas de trabajo fisiológico, no días.

El progreso por Q es positivo:

```text
recoveryWork =
  recoveryOpportunity * softplus(predictor + sigma*Z)

remainingNext = maxLogical(0, remaining - recoveryWork)
```

La distribución esperada y el requirement realizado permanecen separados. El
realizado no se expone al usuario por defecto.

### Disponibilidad y condiciones concurrentes

El residual burden se transforma suavemente en:

- episode availability;
- task restrictions;
- scalar health burden.

Cada episodio activo al inicio de Q asigna un prefijo canónico sobre ordinales
abstractos de oportunidad. Health combina condiciones por unión exacta de
intervalos. No suma, multiplica ni minimiza shares. ADR-072 combina después el
componente médico con otras fuentes.

Un episodio nuevo de Health(Q) no altera Q y no progresa dentro de esa misma
resolución.

### Recaída

Relapse usa un cumulative hazard separado sobre episodios previos. El riesgo
residual combina burden pendiente, memoria exponencial y secuela relacionada.
El count usa Poisson y la selección `parent × child family × origin` usa un
categorical canónico. No existe cooldown ni ventana fija.

Cada recaída crea un child episode con `parentEpisodeId`. Una occurrence nunca
es simultáneamente lesión nueva y recaída.

### Secuelas

Al resolver un episodio:

1. existencia usa logistic/Bernoulli;
2. `TEMPORARY` frente a `PERSISTENT` usa logistic/Bernoulli;
3. burden usa logistic-Normal;
4. secuela temporal decae exponencialmente;
5. secuela persistente no decae automáticamente.

Health emite `SequelaProfile` y signals por capability family. Development
conserva ownership exclusivo de cualquier cambio de capability.

### Randomness y precisión

Normal, LogNormal, Poisson, Bernoulli y categorical reutilizan los samplers
normativos de ADR-070/073. Cada purpose posee model ID y context key propios.
Resultados lógicamente determinados no consumen RNG.

Estados acotados usan `ROUND_HALF_EVEN`; magnitudes interiores positivas
preservan un quantum representable. NaN, infinidades y `-0` persistido son
errores.

## Orden causal

Por Q:

```text
start Health
-> medical availability
-> minutes/performance
-> load
-> fatigue/fitness candidates
-> new injuries
-> recovery of pre-existing episodes
-> relapse of eligible pre-existing episodes
-> sequela
-> atomic next Health
```

Este orden refina ADR-057. No modifica la garantía de ADR-042: un outcome de
Health(Q) solo afecta Q+1.

## Alternativas rechazadas

1. Minutos como única carga.
2. Fitness igual a `1-fatigue`.
3. Ratio acute/chronic con división inestable.
4. Una tirada Bernoulli por temporada.
5. Count limitado por Q o season.
6. Family con severity/duration fija.
7. Recovery determinista o fecha exacta.
8. Estado binario available/injured.
9. Suma de shares de condiciones concurrentes.
10. Cooldown o inmunidad después de lesión.
11. Relapse sin parent.
12. Secuela que escribe capabilities.
13. Normal/Poisson alternativos o rejection sampler local.
14. Usar eventos externos dentro del hazard deportivo.

## Consecuencias

- G3B-E02, E03 y E05–E07 dejan de estar abiertas por matemática y pasan a
  `PARTIAL_CALIBRATION`.
- DR-057 pasa a `PARTIAL_CALIBRATION`: aún faltan valores, targets, goldens,
  seis definitions y producers upstream.
- DR-042, DR-053, DR-054, DR-055 y DR-063 conservan ownership y causalidad.
- G3C-6 debe producir inputs contextuales, pero no puede redefinir las
  ecuaciones locales.
- El catálogo de seis lesiones sigue siendo data/content; este ADR no inventa
  nombres ni diagnósticos.

## Tests y gates

- goldens de load, fatigue, fitness, hazards, counts y marks;
- LogNormal requirement/progress exactos;
- unión de medical intervals compatible con ADR-072;
- múltiples episodios y occurrences sin caps;
- relapse con parent y sin cooldown;
- sequela sin capability write;
- injury Qn con efecto solo Qn+1;
- external cause sin segundo hazard;
- stream isolation por purpose;
- monotonicidades de expectativa;
- Monte Carlo de incidence, severity, recovery, relapse, sequela y tails;
- replay/cadencia exactos con `engineVersion + parameterSetHash`.

Cambiar una ecuación, orden, sampler, quantization, allocation convention o
stream contract requiere revisar este ADR, cambiar `engineVersion` y publicar
nuevos golden vectors.

## Referencias

- [Contrato matemático transversal](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Health estructural](../HEALTH_INJURY_SPEC.md)
- [Performance matemática](../PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
- [Role & Minutes matemática](../ROLE_MINUTES_MATH_SPEC.md)
- [ADR-042](./042-season-health-performance.md)
- [ADR-057](./057-health-injury-recovery-model.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [ADR-072](./072-role-minutes-and-availability-mathematics.md)
- [ADR-073](./073-performance-production-form-mathematics.md)
- [DR-057](../DECISIONS_REQUIRED.md#dr-057--hazard-de-salud-lesión-recuperación-y-recaída)
