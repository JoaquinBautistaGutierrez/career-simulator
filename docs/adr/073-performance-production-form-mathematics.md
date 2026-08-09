# ADR-073: Matemática de Performance, Production y Form

- Estado: Aceptado — familias y ecuaciones; calibración pendiente
- Fecha: 2026-07-29
- Decisiones relacionadas: DR-055 y DR-056
- Refina: ADR-042, ADR-044, ADR-051, ADR-054, ADR-055, ADR-070, ADR-071 y
  ADR-072
- Especificación:
  [PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md](../PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)

## Contexto

ADR-055 separó capabilities, rendimiento subyacente, producción y summaries,
pero dejó abiertas sus ecuaciones, distribuciones, shocks, samplers y dinámica
de Form. G3C-4 debe cerrar esas familias sin inventar valores, contexto de
Club/World, Health, Awards o Scoring.

Una implementación dejada a criterio local podría:

- reintroducir un overall causal;
- redondear expectativas para obtener goles;
- usar parametrizaciones incompatibles de Negative Binomial;
- samplear clean sheets independientemente de goles concedidos;
- consumir azar según el orden accidental de estadísticas;
- convertir `consistency` en calidad media;
- actualizar minutos o capabilities desde Performance;
- truncar outliers mediante caps.

## Decisión

### Capacidades por tarea

Capabilities `0..10000` se transforman con el logit seguro de ADR-071 y una
proyección acotada por task. Cada task obtiene un predictor aditivo con
interacciones, Dynamic States y contexto explícitos. El resultado es una
`taskAbility ∈ (0,1)`.

El vertical slice usa:

- ST: oportunidad de gol, conversión, creación, off-ball y pressing;
- CM: progresión, creación, control, defensa y contribución ofensiva;
- GK: shot stopping, command y distribution.

No existe `EffectiveOverall`.

### Rendimiento subyacente

Cada posición posee dimensiones propias. Su realización usa factores Normal:

1. común de jugador/ventana;
2. compartido de dominio posicional;
3. específico por dimensión;
4. compartido de presión cuando existe exposición high-pressure.

`consistency` reduce exponencialmente dispersiones atribuibles al jugador, sin
añadir un shift directo al predictor medio. La transformación acotada puede
producir el efecto de Jensen propio de cambiar varianza; ese efecto se mide y
calibra, no se presenta como bonus de calidad. `pressureResistance` desplaza la
respuesta esperada solo donde existe exposición de presión y no garantiza el
outcome.

### Producción

- ST y los conteos ofensivos de CM usan intensidades causales y
  `NegativeBinomial2(mean, dispersion)`.
- CM conserva además impactos de progresión, creación, control y defensa.
- GK usa NB2 para `shotsFaced`, Binomial condicionada para `saves`,
  `goalsConceded = shotsFaced - saves` y clean sheets derivadas asignando los
  goles concedidos a unidades agregadas elegibles.
- Goals, assists, saves y clean sheets nunca nacen del redondeo de una
  expectativa.
- No existen caps editoriales.

La convención NB2 es:

```text
E[Y] = mu
Var[Y] = mu + mu^2/kappa
```

### Samplers

Poisson, NB2 y Binomial usan inverse-CDF ascendente en log-space con un único
uniforme midpoint. La CDF se acumula mediante `logSumExp`. La asignación
categórica de clean sheets usa acumulación canónica y el mismo uniforme
midpoint. Los casos determinados no consumen draws.

NB2 no usa Gamma-Poisson en esta versión, por lo que no requiere Gamma ni
rejection sampling. Un guard operacional puede devolver
`INCONCLUSIVE_GUARD_REACHED`, pero nunca un count truncado.

### Evidence, sorpresa y Form

```text
evidence(m) = -expm1(-m/tau)
```

Performance surprise es una diferencia multidimensional acotada entre
realización y expectativa, ponderada por evidencia antes de alimentar estados
futuros.

Form persiste en `0..10000` y evoluciona en espacio logit mediante AR(1)
mean-reverting con sorpresa, presión y shock Normal. El owner de Form aplica la
transición una vez por Q; Performance solo entrega señales. Confidence,
managerTrust y morale reciben señales exactas, pero conservan ownership y
dinámica propios.

### Summaries

Los summaries agregan dimensiones con peso
`actualMinutes × evidenceStrength`, suman production exacta y preservan splits
por Q, club/selección, team, competición, posición y presión. Raw production no
se reescribe por competition strength y nunca usa IJL.

### Randomness

Performance y Form usan namespaces separados, context keys estables y stream
IDs versionados. Los factores compartidos se samplean una vez y se pasan por
referencia. Añadir una estadística no desplaza streams existentes.

## Alternativas rechazadas

1. Overall/effective rating causal.
2. Una estadística independiente por draw sin factores compartidos.
3. Expectativas redondeadas como counts.
4. Poisson universal sin validar overdispersion.
5. Convenciones NB ambiguas o mezcladas.
6. Gamma/rejection sampler no especificado.
7. Clean sheet Bernoulli independiente.
8. Goals conceded como proxy de calidad GK.
9. CM evaluado solo con goals/assists.
10. `consistency` como bonus de media.
11. Pressure bonus editorial.
12. Feedback Performance(Q)→Minutes(Q).
13. Form sin reversión o con reset estacional.
14. Caps de producción para corregir colas.

## Consecuencias

- G3B-D02 a D09 dejan de estar abiertas por familia matemática.
- Las ocho quedan `PARTIAL_CALIBRATION` por valores, targets y productores
  upstream.
- DR-055 pasa a `PARTIAL_CALIBRATION`.
- La parte de Form de DR-056 queda matemáticamente cerrada; las dinámicas
  completas de confidence, morale y managerTrust siguen fuera de Performance.
- ADR-074 cierra las Health interfaces; G3C-6 debe producir context interfaces.
  Ninguna reabre las ecuaciones locales.
- Awards, Selection y Scoring consumen facts/summaries y conservan sus propias
  decisiones.

## Tests y gates

- goldens de task abilities y factores;
- inverse-CDF Poisson/NB2/Binomial y categorical cross-runtime;
- cero exposición sin draws;
- identities de GK y clean sheets;
- counts ST/CM correlacionados mediante factores declarados;
- monotonicidad de expectativas, no outcomes;
- Form estable con `0 <= phi < 1`;
- agregación multiclub/contexto sin duplicación;
- ausencia de IJL/scoring en producción;
- Monte Carlo de medias, dispersiones, correlaciones y colas;
- `engineVersion + parameterSetHash` conformes a ADR-070.

Cambiar una ecuación, convención de distribución, sampler, orden de CDF,
quantization o stream contract requiere revisar este ADR, cambiar
`engineVersion` y publicar nuevos golden vectors.

## Referencias

- [Contrato matemático transversal](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Performance estructural](../PERFORMANCE_MODEL_SPEC.md)
- [Role & Minutes matemático](../ROLE_MINUTES_MATH_SPEC.md)
- [Facts y scoring](../SCORING_FACTS_SPEC.md)
- [ADR-055](./055-performance-and-production-model.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
- [DR-055](../DECISIONS_REQUIRED.md#dr-055--calidad-efectiva-rendimiento-y-producción-por-posición)
- [DR-056](../DECISIONS_REQUIRED.md#dr-056--dinámica-de-forma-confianza-y-feedback-temporal)
