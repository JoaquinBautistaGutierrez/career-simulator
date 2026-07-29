# ADR-071: Matemática de Creation, Development y Aging

- Estado: Aceptado — familias y ecuaciones; calibración pendiente
- Fecha: 2026-07-29
- Decisiones relacionadas: DR-045, DR-048, DR-049 y DR-053
- Refina: ADR-019, ADR-023, ADR-044, ADR-052, ADR-053 y ADR-070
- Especificación:
  [CREATION_DEVELOPMENT_MATH_SPEC.md](../CREATION_DEVELOPMENT_MATH_SPEC.md)

## Contexto

G3B cerró el modelo causal, pero dejó abiertas las familias matemáticas de
creación, desarrollo, desgaste, reconversión y posición dominante. G3C-1 fijó
runtime, quantization y ParameterSets. La implementación no puede elegir por su
cuenta una curva de edad, un generador correlacionado, una función de budget ni
un sampler.

## Decisión

### Evolución de capabilities

Capabilities evolucionan en espacio logit seguro:

```text
xSafe = ε + (1 - 2ε) * stored/10000
z = logit(xSafe)
z' = z + deltaZ
stored' = ROUND_HALF_EVEN(10000 * sigmoid(z'))
```

con `0 < ε <= 1/(2*10000)`.

```text
deltaZ =
  maturation
  + acquiredDevelopment
  - wear
  + familySharedNormalShock
  + capabilitySpecificNormalShock
```

El vector completo se aplica atómicamente por Q.

### Maduración, acquired y wear

- Maturation usa la derivada normalizada de una logística, desplazada y
  escalada por un `PlayerMaturationProfile` jerárquico.
- No se almacena peakAge.
- Acquired development usa un predictor aditivo transformado por softplus con
  DevelopmentCapacity, Professionalism, experiencia saturante y environment.
- Experience usa `-expm1(-k*m)`.
- Environment es combinación convexa explícita de club, manager y training
  context.
- Wear usa softplus sobre edad continua, load, health, sequela,
  declineSensitivity, Longevity y maintenance de Professionalism.
- No existe mean reversion poblacional, threshold de edad ni potential cap.

### Randomness

Los shocks usan `StandardNormalInverseCdfV1`, un `uint64` por variate, con un
factor compartido por familia y uno específico por capability. Contextos de
stream identifican jugador, temporada, Q, familia/capability y purpose.

### Creación

Initial generation usa una mixture de factores normales:

- componente de profile no rígido;
- factor general;
- factor de familia;
- factores Talent/Drive/Resilience/Durability;
- factor within-profile;
- residual positivo por cada capability y trait.

Mixture weights y residual sigmas positivos conservan soporte. No hay reglas
del tipo archetype→cap.

`CreationPowerScore` es un surrogate cuadrático versionado sobre capabilities,
traits, posición, pie y edad. No es Overall ni input de gameplay. Quick y
Custom comparten un target sampleado de la CDF de poder y un sampler
condicionado; equivalencia usa SMD, median/quantiles, Wasserstein-1 y KS con
tolerancias publicadas.

`BOTH` entra mediante su efecto calibrado en el surrogate; no aplica una
penalización fija a capabilities.

### Posición y reconversión

`PositionSuitability` es sigmoid de main effects e interacciones no negativas
por posición.

Retraining usa:

- logistic/log-odds para opportunity y completion;
- stable softmax para candidata;
- suitability, uso, táctica, edad suave, Adaptability e historia;
- proceso causal y decisión sin threshold/cooldown.

El vertical slice habilita solo `GK`, `CM` y `ST`. Las otras posiciones son
`CONTENT_DISABLED`, no imposibles en la arquitectura.

### Dominancia histórica

Minutos efectivos se acumulan sin duplicación por posición. Se elige primero el
PositionGroup con mayor exposición y luego la posición específica dentro de
ese grupo. Los empates usan firmas de exposición y, al final, órdenes canónicos
versionados. Scope sin minutos no tiene cohorte.

## Consecuencias

- G3B-B02–B06 y N02–N04 dejan de estar abiertas por familia matemática.
- Permanecen `PARTIAL_CALIBRATION` hasta publicar valores.
- DR-048 queda resuelta para el vertical slice.
- DR-049 queda resuelta.
- DR-045 y DR-053 pasan a `PARTIAL_CALIBRATION`.
- DR-023/052 permanecen resueltas.
- La implementación todavía necesita ParameterSet aprobado y goldens.

## Alternativas rechazadas

- evolución lineal directa en `0..10000`;
- peakAge, decline threshold o potential ceilings;
- acquired development como producto crudo;
- mean reversion a `5000`;
- un único shock para todas las capabilities;
- uniformes independientes o archetypes rígidos;
- Creation Budget como suma de atributos;
- penalización fija de capability por `BOTH`;
- reconversión por threshold o cambio editorial;
- posición inicial/final o temporadas sin minutos para cohortes;
- habilitar posiciones sin Performance/Selection/Awards calibrados.

## Tests y gates

- vectores exactos de transformación, componentes y quantization;
- support de ambos signos por edad;
- monotonicidad de expected acquired/wear según señales declaradas;
- generación conjunta y residual support;
- equivalencia Quick/Custom por todas las métricas;
- BOTH sin aumento sistemático de poder;
- retraining reproducible, probabilístico y sin mutar capabilities;
- acumulación de minutos y tie-break exactos;
- ParameterSet/hash/engineVersion conformes a ADR-070;
- Monte Carlo `SMOKE`, `CALIBRATION` y `DEEP`.

## Referencias

- [Contrato matemático transversal](../MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Player Model](../PLAYER_MODEL_SPEC.md)
- [Development estructural](../DEVELOPMENT_AGING_SPEC.md)
- [ADR-019](./019-creation-budget-equivalence.md)
- [ADR-023](./023-dominant-foot-both.md)
- [ADR-044](./044-effective-position-and-retraining.md)
- [ADR-052](./052-fundamental-player-model.md)
- [ADR-053](./053-development-and-aging-model.md)
- [ADR-070](./070-mathematical-runtime-and-parameter-sets.md)
