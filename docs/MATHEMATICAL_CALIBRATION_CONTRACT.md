# Contrato matemático, estocástico y de calibración

## 1. Estado, alcance y autoridad

**Estado:** normativo para G3C-1.  
**Fecha:** 2026-07-29.  
**Decisión relacionada:** DR-070.  
**ADR relacionado:** [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md).

Este documento define el lenguaje matemático común que deben usar las
especificaciones ejecutables de G3C. Complementa, sin sustituir:

- [ADR-002](adr/002-probability-representation.md) y
  [ADR-003](adr/003-probability-composition.md);
- [ADR-006](adr/006-deterministic-prng.md),
  [ADR-007](adr/007-canonicalization-and-hashing.md) y
  [ADR-051](adr/051-deterministic-core-byte-contracts.md);
- [ADR-015](adr/015-version-taxonomy.md);
- [`MATHEMATICAL_ENGINE_SPEC.md`](MATHEMATICAL_ENGINE_SPEC.md);
- los specs estructurales G3B;
- [`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md).

Su objetivo es permitir que cada fórmula posterior declare sus dominios,
familia matemática, parámetros, azar, cuantización, tests y targets sin
inventar convenciones locales. No selecciona coeficientes, distribuciones
finales ni targets de balance de ningún subsistema de gameplay.

## 2. Principios normativos

1. Estado persistido, representación de cálculo y presentación son capas
   distintas.
2. Todo valor persistido tiene dominio, unidad y cuantizador explícitos.
3. Todo cálculo estocástico identifica sus draws por contexto estable; el orden
   accidental de ejecución no es una fuente de semántica.
4. Los límites lógicos preservan dominios. No se usan caps editoriales para
   ocultar una distribución mal calibrada.
5. Las colas posibles se calibran; no se recortan.
6. Las correlaciones nacen del grafo causal o de factores compartidos
   declarados, no de reutilizar azar de forma accidental.
7. Un `EngineParameterSet` de gameplay es inmutable, canónico y hasheado.
8. Scoring conserva configuración, aritmética y versionado propios, y nunca
   consume RNG.
9. Golden vectors, properties y Monte Carlo verifican propiedades distintas y
   son gates complementarios.
10. Ningún parámetro provisional se convierte en regla normativa por aparecer
    en un fixture, un ejemplo o una herramienta de calibración.

## 3. Capas de representación numérica

### 3.1 Storage representation

Las capabilities y traits verdaderos se persisten como enteros:

```text
CapabilityStored ∈ {0, 1, ..., 10000}
TraitStored      ∈ {0, 1, ..., 10000}
```

La escala está cerrada por ADR-052. No se persiste un `overall` causal.
Dinero, followers, score y contadores usan enteros exactos según su dominio.
Una especificación posterior puede elegir otra representación entera para un
DynamicState, pero debe declarar:

- mínimo y máximo lógicos, o ausencia de uno de ellos;
- unidad;
- resolución;
- valor neutral o baseline cuando exista;
- cuantizador;
- semántica de valores ausentes.

No se asume que `form`, `confidence`, `fitness`, `fatigue`, `morale`,
`managerTrust`, reputación o engagement usen automáticamente `0..10000`.

### 3.2 Calculation representation

La normalización canónica de capabilities y traits es:

```text
normalized = stored / 10000
```

`normalized` se usa como IEEE-754 binary64 dentro de una operación atómica y
pertenece a `[0, 1]`. No reemplaza el entero persistido.

El retorno a la escala persistida es explícito:

```text
storedNext = quantizeState(normalizedNext × 10000, 0, 10000)
```

La fórmula es ilustrativa de la transformación de escala, no una fórmula de
desarrollo. Se cuantiza una vez al cerrar la transición atómica. No se
cuantizan subexpresiones intermedias salvo que la especificación matemática
declare que la cuantización es parte causal del modelo.

### 3.3 Presentation representation

La UI puede proyectar un valor a `0..100`, bandas textuales, barras, intervalos
de scouting u otra presentación. Esa proyección:

- no se realimenta al motor;
- no aumenta observabilidad de true state;
- no participa en hashes de gameplay;
- puede depender de `PlayerKnowledge`, no solo de true state.

## 4. Perfil IEEE-754 y determinismo

### 4.1 Usos permitidos de `number`

IEEE-754 binary64 puede utilizarse para:

- valores normalizados dentro de fórmulas;
- predictors, utilities y factores latentes;
- parámetros de distribuciones;
- probabilidades, odds y representaciones logarítmicas mediante el Probability
  Core;
- cálculos derivados no persistidos;
- acumulaciones internas de una transición atómica cuando su contrato declare
  el orden.

No se usa como representación persistida de:

- dinero;
- followers;
- score;
- conteos deportivos;
- IDs, índices u ordinales;
- capabilities o traits.

Un campo persistido que excepcionalmente use binary64 debe declarar finitud,
dominio, unidad, precisión canónica, tratamiento de `-0` y evidencia de
replay. La preferencia general para estado recurrente es un entero cuantizado.

### 4.2 Valores prohibidos

`NaN`, `+Infinity` y `-Infinity` son errores de dominio. No pueden:

- entrar en estado;
- entrar en canonical JSON;
- participar en hashes;
- convertirse silenciosamente en un límite;
- activar un fallback de gameplay.

`-0` se normaliza a `+0` en cualquier boundary canónico, coherente con
ADR-007/051. Una división por cero, overflow o dominio inválido debe producir
un error tipado con `formulaId`, operación e inputs sanitizados.

### 4.3 Operaciones inestables

Las fórmulas deben permanecer en log-space cuando la conversión directa pierda
información. Se usan `log1p`, `expm1`, `logSumExp` y formas por ramas en lugar
de expresiones algebraicamente equivalentes pero inestables.

No se permite invocar de forma dispersa funciones trascendentales del host en
modelos normativos. Toda operación trascendental de gameplay atraviesa las
primitivas canónicas del perfil matemático del engine. Antes de implementar
gameplay, cada primitiva debe tener:

- algoritmo y orden de operaciones congelados;
- casos extremos explícitos;
- golden vectors cross-runtime;
- `engineVersion` compatible;
- property tests de dominio y monotonicidad.

Solo un runtime que supere esos vectores es compatible con replay oficial. Si
un runtime cliente no es conforme, puede presentar o solicitar resultados,
pero no producir un replay competitivo autoritativo. Esta política evita
reemplazar todo el motor por fixed-point y evita asumir que dos
implementaciones host de `exp` o `log` son byte-equivalentes.

## 5. Cuantización de estado

### 5.1 Política común

`quantizeState(value, min?, max?)`:

1. rechaza valores no finitos;
2. aplica únicamente límites lógicos declarados;
3. redondea al incremento persistido mediante `ROUND_HALF_EVEN`;
4. normaliza `-0` a `+0`;
5. valida nuevamente el dominio del entero resultante.

`ROUND_HALF_EVEN` se elige para estado recurrente porque evita sesgo sistemático
en empates acumulados. Debe implementarse explícitamente; no depende del
rounding implícito del lenguaje.

Esta política **no** modifica el contrato competitivo de scoring:
`ScoreLedgerEntry.finalPoints` usa `ROUND_HALF_UP` según ADR-010 y
[`SCORING_FACTS_SPEC.md`](SCORING_FACTS_SPEC.md).

### 5.2 Boundary atómico y drift

La operación que transforma `state[t]` en `state[t+1]` conserva binary64 durante
su evaluación, aplica invariantes y cuantiza una vez al commit. El siguiente
paso lee el valor persistido cuantizado. No existe un “shadow state” de mayor
precisión que cambie futuros resultados sin formar parte del hash.

Si una operación produce varios campos correlacionados:

1. calcula todos los candidatos con el mismo snapshot;
2. valida dominios e invariantes cruzadas;
3. cuantiza según sus contratos;
4. aplica todos o ninguno;
5. canonicaliza y genera checkpoint cuando corresponda.

### 5.3 Límites lógicos frente a caps editoriales

Son límites lógicos válidos, entre otros:

- `Probability ∈ [0, 1]`;
- capability/trait persistido `∈ [0, 10000]`;
- `minuteShare ∈ [0, 1]`;
- `actualMinutes <= availableTeamMinutes`;
- `followers >= 0`;
- `starts <= appearances`;
- conteos condicionados por una oportunidad física explícita.

No son límites válidos sin una regla normativa:

- máximo editorial de goles, premios, lesiones o transferencias;
- truncar shocks o temporadas históricas;
- reducir una probabilidad positiva a cero por ser pequeña;
- un máximo de edad o de ciclos de retiro;
- winsorizar estado de gameplay para hacer pasar un target.

Un valor fuera de dominio por error se rechaza; no se “arregla” mediante un
cap silencioso. Una cola excesiva se corrige calibrando parámetros o la familia
causal.

## 6. Catálogo de primitivas canónicas

Las primitivas siguientes son nombres semánticos únicos. Ningún subsistema
mantiene una copia propia con extremos distintos.

| Primitiva | Dominio | Contrato |
|---|---|---|
| `normalizeStored(x, scale)` | entero canónico; `scale > 0` | Devuelve `x / scale`; para capabilities/traits `scale = 10000`. |
| `quantizeState(x, min?, max?)` | binary64 finito | Límite lógico, `ROUND_HALF_EVEN`, entero y `-0 → 0`. |
| `clampLogical(x, min, max)` | finitos; `min <= max` | Solo cuando el dominio normativo exige el intervalo; no es herramienta de balance. |
| `lerp(a, b, t)` | finitos; contrato de `t` declarado | Interpolación con orden de operaciones congelado; no clampa `t` implícitamente. |
| `stableSigmoid(x)` | predictor finito | Forma por ramas que evita overflow. Para probabilidad conserva semántica de log-odds y no convierte una frontera redondeada en imposibilidad/certeza. |
| `stableLogit(p)` | `0 < p < 1` | Devuelve log-odds. `p = 0/1` usa estados semánticos explícitos, no infinitos persistidos. |
| `softplus(x)` | finito | Forma estable `max(x,0) + log1p(exp(-abs(x)))`. |
| `logSumExp(xs)` | vector finito no vacío | Resta el máximo antes de exponentiar; preserva escala logarítmica. |
| `stableSoftmax(us)` | utilities finitas, vector no vacío | Normaliza mediante `logSumExp`; resultado categórico válido y orden canónico de categorías. |
| `safeLog(x)` | `x > 0` | Rechaza cero/negativos; usa forma estable cerca de uno. |
| `stableLog1p(x)` | `x > -1` | Evalúa `log(1+x)` preservando precisión cerca de cero; rechaza dominio inválido. |
| `stableExpm1(x)` | finito y resultado finito | Evalúa `exp(x)-1` preservando precisión cerca de cero. |
| `safeExp(x)` | finito y dominio declarado por caller | No aplica clamp global. Si el resultado desborda, el modelo debe permanecer en log-space o producir error. |
| `log1mExp(x)` | `x <= 0` | Calcula `log(1-exp(x))` por ramas estables. |
| `hazardToProbability(H)` | `H >= 0` finito | `-expm1(-H)` con semántica de posibilidad conservada. |

Los resultados de `stableSoftmax` se asocian a categorías en un orden
declarado y estable; no al orden de propiedades de un objeto accidental.

## 7. Familias probabilísticas comunes

### 7.1 Resultados binarios

La familia preferida para una probabilidad binaria condicionada por señales
aditivas es:

```text
inputs y transforms declarados
→ predictor
→ LogOdds
→ Probability
→ sample determinista
```

El predictor no es universal: cada modelo declara inputs, interacciones y
parámetros. Imposibilidad y certeza son estados semánticos, no predictors
numéricos extremos. Los modificadores de probabilidades existentes siguen la
composición de ADR-003.

### 7.2 Categorías mutuamente excluyentes

Cuando exactamente una categoría debe ocurrir y todas las categorías tienen
utilities comparables, la familia base es:

```text
utility por categoría
→ stableSoftmax
→ categorical sample
```

La lista de categorías y su orden forman parte del contrato. Softmax no se usa
para oportunidades que puedan ocurrir conjuntamente; esas oportunidades
conservan sorteos propios según ADR-005.

### 7.3 Proporciones

No existe una distribución universal para `[0,1]`.

| Familia | Uso apropiado |
|---|---|
| Beta | Proporción continua abierta con media y concentración interpretables; adecuada cuando la dispersión condicional se expresa directamente. |
| Logit-Normal | Proporción construida naturalmente en espacio latente/logit; útil con factores compartidos o estructura jerárquica. |
| Hurdle/zero-one-inflated | Cuando cero o uno poseen masa causal real además de una proporción continua interior. |

Una Beta o Logit-Normal ordinaria no genera fronteras exactas. Si cero o uno
son outcomes reales, se modela su masa; no se obtienen por clipping.

### 7.4 Conteos

| Familia | Criterio |
|---|---|
| Poisson | Solo cuando media y varianza condicional resultan compatibles con el proceso. |
| Negative Binomial | Preferente para conteos overdispersed cuando la calibración confirme varianza adicional. |
| Mixture/hurdle/zero-inflated | Solo ante regímenes o ceros causales diferenciables. |
| Binomial/Beta-Binomial | Para éxitos dentro de un número físico de oportunidades conocido, con o sin heterogeneidad adicional. |

Los conteos se samplean como enteros; nunca se obtienen redondeando un valor
esperado. No tienen caps editoriales. El selector de familia debe justificarse
con variance-to-mean, cola, ceros, condicionamiento y consumers.

### 7.5 Estados temporales con memoria

La familia base a evaluar para un estado con persistencia y reversión es:

```text
x[t+1] = μ[t] + φ · (x[t] - μ[t]) + shock[t]
```

o su equivalente en un espacio latente cuando el dominio sea acotado.

Condiciones:

- `φ` expresa persistencia, no una probabilidad;
- para un proceso estacionario base se exige `|φ| < 1`;
- un régimen no estacionario debe declararse y testearse explícitamente;
- `μ[t]` puede cambiar por contexto, pero no reescribe ventanas cerradas;
- shock y factores compartidos tienen identidades de stream propias;
- saturación o transformación de dominio no puede borrar outliers de la
  variable observable de gameplay.

Esto no cierra las ecuaciones de Form, Fatigue, Reputation ni otros estados.

### 7.6 Hazards

Un proceso dependiente de exposición puede declarar componentes de hazard no
negativos:

```text
h_k = hazard contextual de la oportunidad k
H   = Σ h_k
p(evento en el intervalo) = 1 - exp(-H)
```

La evaluación usa `hazardToProbability(H)` de forma estable. El contrato del
modelo debe declarar:

- unidad de exposición;
- baseline;
- transforms contextuales;
- cómo compiten varios causes;
- identidad y multiplicidad de oportunidades;
- cómo se conserva continuidad entre ventanas;
- semántica de `H = 0`;
- familia de tiempo/estado posterior al evento.

Hazard es toolbox para lesiones, retiro u otros procesos de tiempo/exposición;
no reemplaza automáticamente todo modelo binario.

### 7.7 Standard Normal sampler V1

Los modelos que declaren un shock Normal usan `StandardNormalInverseCdfV1`.
Cada variate consume exactamente un `uint64`; con
`k = nextUint64() >> 11`:

```text
u = (k + 0.5) / 2^53
z = inverseNormalCdfV1(u)
```

`u` pertenece estrictamente a `(0,1)`, por lo que el sampler nunca produce
infinito. No existe cache de un segundo variate ni consumo dependiente del
orden.

`inverseNormalCdfV1` usa la aproximación racional de Acklam sin paso posterior
de refinamiento, con Horner, sin FMA implícito y cortes:

```text
pLow  = 0.02425
pHigh = 0.97575
```

Coeficientes estructurales:

```text
a = [
  -3.969683028665376e+01,
   2.209460984245205e+02,
  -2.759285104469687e+02,
   1.383577518672690e+02,
  -3.066479806614716e+01,
   2.506628277459239e+00
]

b = [
  -5.447609879822406e+01,
   1.615858368580409e+02,
  -1.556989798598866e+02,
   6.680131188771972e+01,
  -1.328068155288572e+01
]

c = [
  -7.784894002430293e-03,
  -3.223964580411365e-01,
  -2.400758277161838e+00,
  -2.549732539343734e+00,
   4.374664141464968e+00,
   2.938163982698783e+00
]

d = [
   7.784695709041462e-03,
   3.224671290700398e-01,
   2.445134137142996e+00,
   3.754408661907416e+00
]
```

Para `u < pLow`, se evalúa el racional `c/d` en
`q = sqrt(-2 safeLog(u))`. Para `u > pHigh`, se usa su opuesto con
`q = sqrt(-2 log1p(-u))`. En el tramo central se usa el racional `a/b` con
`q = u - 0.5`, `r = q²`, multiplicado por `q`. Numerador y denominador se
evalúan exactamente en el orden de Horner listado.

```text
tail(q) =
  (((((c0*q + c1)*q + c2)*q + c3)*q + c4)*q + c5)
  /
  ((((d0*q + d1)*q + d2)*q + d3)*q + 1)

center(q,r) =
  (((((a0*r + a1)*r + a2)*r + a3)*r + a4)*r + a5) * q
  /
  (((((b0*r + b1)*r + b2)*r + b3)*r + b4)*r + 1)
```

El tramo inferior devuelve `tail(q)`, el superior `-tail(q)` y el central
`center(q,r)`.

Los coeficientes pertenecen al math profile, no al `EngineParameterSet`.
Cambiar algoritmo, cortes, coeficientes, consumo u orden requiere
`engineVersion` y golden vectors nuevos.

### 7.8 Logit-Normal mean V1

Cuando un módulo necesite la expectativa determinista de
`sigmoid(mu + sigma*Z)`, con `Z ~ Normal(0,1)`, usa
`LogitNormalMeanGaussHermite10V1`. La media Logit-Normal no tiene una forma
elemental cerrada; esta cuadratura es la aproximación normativa del math
profile:

```text
E[sigmoid(mu + sigma*Z)] =
  (1 / sqrt(pi))
  * sum_j(
      weight[j]
      * stableSigmoid(mu + sqrt(2)*sigma*node[j])
    )
```

Se evalúa en orden de nodo negativo a positivo, sin reordenar sumandos, con:

```text
nodes = [
  -3.436159118837737603327,
  -2.532731674232789796409,
  -1.756683649299881773450,
  -1.036610829789513654178,
  -0.3429013272237046087892,
   0.3429013272237046087892,
   1.036610829789513654178,
   1.756683649299881773450,
   2.532731674232789796409,
   3.436159118837737603327
]

weights = [
  0.00000764043285523262062916,
  0.0013436457467812326922,
  0.0338743944554810631362,
  0.2401386110823146864165,
  0.6108626337353257987836,
  0.6108626337353257987836,
  0.2401386110823146864165,
  0.0338743944554810631362,
  0.0013436457467812326922,
  0.00000764043285523262062916
]
```

`mu` debe ser finito y `sigma >= 0`. Para `sigma=0` se devuelve exactamente
`stableSigmoid(mu)` sin ejecutar la suma. El resultado debe ser finito y estar
en `[0,1]`; cualquier violación es error numérico, no motivo para clipping
editorial.

Nodos, pesos, orden, suma y caso `sigma=0` pertenecen al math profile, no al
ParameterSet. Cambiarlos requiere `engineVersion` y golden vectors nuevos.

### 7.9 Samplers discretos V1

G3C-4 fija cuatro samplers transversales:

- `PoissonInverseCdfV1(lambda)`;
- `NegativeBinomial2InverseCdfV1(mu, kappa)`;
- `BinomialInverseCdfV1(n, p)`;
- `CategoricalCumulativeMidpointV1(probabilities, canonicalOrder)`.

Los tres samplers de conteo:

1. consumen un único uniforme midpoint de 53 bits cuando el outcome no está
   determinado;
2. acumulan la CDF en orden ascendente mediante recurrencias de log-PMF y
   `logSumExp`;
3. devuelven el primer entero cuya log-CDF alcanza `log(u)`;
4. no consumen draws durante las iteraciones;
5. no poseen cap de outcome o iteración de gameplay.

La convención Negative Binomial es NB2:

```text
E[Y] = mu
Var[Y] = mu + mu^2/kappa
mu >= 0
kappa > 0
```

`mu = 0`, `lambda = 0`, `n = 0` y los casos Binomial `p = 0/1` son
determinados y no consumen azar. La especificación exacta de recurrencias,
ordering y guards está en
[PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md).

### 7.10 LogNormal transform V1

Un modelo que declare:

```text
log(X) ~ Normal(mu, sigma^2)
```

usa exactamente:

```text
Z = StandardNormalInverseCdfV1(nextMidpointUniform())
X = safeExp(mu + sigma*Z)
```

con `mu` finito y `sigma >= 0`. Consume un solo draw Normal. Para `sigma=0`,
el resultado es determinado, devuelve `safeExp(mu)` y no consume RNG.

La media, mediana y quantiles derivados son:

```text
median = exp(mu)
mean = exp(mu + 0.5*sigma^2)
quantile(p) = exp(mu + sigma*StandardNormalQuantileV1(p))
```

No existe un segundo sampler LogNormal, Gamma o rejection path. Un overflow o
input no finito es error numérico y no se corrige mediante clipping.

El sampler categórico consume un uniforme midpoint, recorre probabilidades
finitas no negativas en orden canónico y devuelve la primera categoría cuya
CDF sea estrictamente mayor que `u`. La última categoría solo absorbe error
residual dentro de `numericTolerance`; suma inválida, vector vacío o categorías
duplicadas son errores.

NB2 V1 no usa la representación Gamma-Poisson. Por tanto, G3C-4 no introduce
un Gamma sampler ni rejection sampling. Un guard de infraestructura solo puede
devolver `INCONCLUSIVE_GUARD_REACHED`; no puede truncar el count.

Cambiar convención, acumulación, consumo o sampler requiere `engineVersion` y
goldens nuevos.

## 8. Correlación y factores jerárquicos

Para el vertical slice se priorizan factores latentes compartidos y shocks
jerárquicos antes que una matriz/cópula global difícil de auditar:

```text
expectedSignal
+ loadingContext × sharedContextFactor
+ loadingFamily  × sharedFamilyFactor
+ specificShock
→ latentOutcome
→ transform/distribution
→ observedOutcome
```

Cada factor:

- tiene owner, scope temporal y unidad;
- se sortea una vez por identidad causal;
- tiene `RandomDrawKey` propio;
- se comparte por referencia, no repitiendo el draw;
- declara consumidores para evitar doble conteo;
- no sustituye una relación causal explícita.

Se permiten factores de Q, club, competición, temporada, región y era solo
cuando exista un consumer claro. Las cargas, dispersiones y estructura de
covarianza permanecen externalizadas.

## 9. Contrato de randomness

### 9.1 RandomDrawKey

Todo draw futuro declara conceptualmente:

```text
RandomDrawKey {
  namespace
  modelId
  context
  occurrence
  purpose
}
```

- `namespace` separa subsistemas.
- `modelId` identifica la semántica/familia del draw.
- `context` usa una estructura canónica y IDs de dominio estables.
- `occurrence` distingue oportunidades repetibles sin depender de un contador
  global.
- `purpose` separa factor compartido, shock específico, categoría, duración u
  otros draws dentro de la misma oportunidad.

La derivación concreta sigue ADR-006/051. `parameterSetHash` no se incluye en
la key: dos ParameterSets comparados con la misma seed deben recibir los mismos
uniformes para common-random-number calibration. Si cambia la semántica del
draw, cambia `modelId`, `purpose` o `engineVersion`, no el orden accidental.

### 9.2 Streams y sampling

- Un factor compartido usa un stream/contexto propio y publica su valor a los
  consumidores.
- Shocks específicos usan keys independientes.
- Agregar un draw en un modelo no desplaza otro modelo o entidad.
- El algoritmo exacto de cada sampler forma parte del perfil del engine y
  requiere golden vectors.
- Iteraciones sobre entidades, categorías y facts usan orden canónico.
- Un outcome imposible o cierto puede resolverse sin consumir azar; el contrato
  de consumo debe quedar congelado.

### 9.3 Scoring

Scoring no tiene namespace, stream ni sampler. La función es:

```text
DomainFact[]
+ ScoringConfiguration(scoringVersion, configurationHash)
+ ScoringCalibrationData(calibrationDataHash)
→ ScoreLedger → exact integer PC → ScoreSnapshot
```

Mismos facts canónicos y mismos recursos inmutables producen el mismo ledger.
ADR-080 fija racionales exactos y `ROUND_HALF_UP`; Scoring no usa IEEE-754.

## 10. EngineParameterSet

### 10.1 Estructura

El registro de parámetros de gameplay se organiza como un artefacto inmutable:

```text
EngineParameterSet
├── manifest
│   ├── parameterSetId
│   ├── parameterSetHash
│   ├── schemaVersion
│   ├── engineVersion
│   ├── mathProfileId
│   └── compatibility
├── player
├── development
├── roleMinutes
├── performance
├── health
├── clubWorld
├── transfers
├── nationalTeam
├── awards
├── reputationSocial
└── retirementComeback
```

Cada rama puede contener subárboles por fórmula, posición, contexto o release,
pero no parámetros de scoring ni texto/contenido narrativo.

La estructura serializable está gobernada por el `schemaVersion` canónico. La
interpretación y los algoritmos están gobernados por `engineVersion`. El
payload completo, sin su campo de hash autorreferencial, se canonicaliza con
RFC 8785 y se identifica con SHA-256.

### 10.2 Identidad sin sexta versión

Se adopta:

```text
VersionSet de cinco versiones
+ parameterSetId
+ parameterSetHash
```

`parameterSetId` es una referencia legible/opaca; `parameterSetHash` es la
identidad de contenido y participa en replay, checkpoints y compatibilidad
competitiva. Ninguno es una sexta versión canónica.

Para releases oficiales, cualquier cambio de ParameterSet que altere
resultados exige al menos un nuevo patch de `engineVersion`. Una misma
`engineVersion` no puede resolver a dos hashes oficiales distintos.
ParameterSets candidatos de calibración pueden compartir una build experimental
solo fuera de Careers oficiales y se distinguen siempre por hash.

Los parámetros de scoring viven en `ScoringConfiguration` y los cohortes en
`ScoringCalibrationData`, ambos inmutables y gobernados por `scoringVersion`;
no son ramas de `EngineParameterSet`.

### 10.3 Inmutabilidad y lifecycle del artefacto

Publicar un ParameterSet requiere:

1. validar schema y dominios;
2. validar referencias y ausencia de parámetros de scoring/content;
3. canonicalizar;
4. calcular SHA-256;
5. ejecutar goldens/properties aplicables;
6. adjuntar evidencia de calibración;
7. registrar compatibilidad de engine;
8. publicar como contenido direccionado por hash.

Una publicación no se edita. Deprecar cambia metadatos del catálogo, no el
payload. Los artefactos requeridos por una Career se retienen mientras su
replay deba estar soportado. Una Career persiste la referencia exacta; cargar
otro hash es incompatibilidad explícita, no migración silenciosa.

## 11. Registry de parámetros

Cada parámetro debe declarar, directa o heredadamente:

- `parameterId` estable;
- owner/subsistema;
- descripción y unidad;
- dominio y representación;
- default solo si está aprobado;
- fórmula(s) consumidoras;
- segmentación permitida;
- reglas de fallback explícitas;
- fuente/evidencia;
- estado: experimental, calibrated, approved o deprecated;
- tests y targets relacionados.

Los candidatos de G3B se agrupan así:

| Rama | Familias principales |
|---|---|
| `player` | distribuciones iniciales, perfiles latentes, correlaciones, observabilidad y Creation Budget compartido con la rama de creación. |
| `development` | maduración, extremos, experiencia, entorno, wear, longevity y secuelas. |
| `roleMinutes` | utilities de rol, persistencia, fields de competencia, availability mapping, shares y apariciones. |
| `performance` | EffectiveCapabilities, dimensiones, oportunidades, conversión, counts, factores, estados dinámicos y agregación. |
| `health` | exposición, carga, hazards, familias, severidad, recuperación, recaída y secuela. |
| `clubWorld` | strength, managers, calendario, support fields, outcomes, movilidad, evolución y ciclos. |
| `transfers` | percepción, interés, oferta, negociación, contratos, loans y valoración. |
| `nationalTeam` | fields, candidatura, incumbency, rol, minutos, support y outcomes. |
| `awards` | fields, señales, criterios, judging, placement y ties; nunca puntos. |
| `reputationSocial` | memoria, difusión regional, atención, followers, engagement y feedback. |
| `retirementComeback` | motivation, retirement competing risks, comeback, viability, finalization opportunity y post-retirement adapters. |

Creation puede publicarse como subárbol `player.creation` sin añadir otra raíz.
La configuración del DSL de contenido sigue `contentVersion`; definitions de
datos siguen `dataVersion`.

## 12. Artefactos de calibración

### 12.1 CalibrationSeedSet

```text
CalibrationSeedSet {
  seedSetId
  tier
  rootSeeds
  selectionMethod
  seedSetHash
  intendedScopes
}
```

Las root seeds usan el formato canónico de 256 bits. El listado y sus
metadatos se canonicalizan y hashean. El set es determinista, versionado como
artefacto de calibración e independiente de los Golden Seeds normativos.

Tiers:

- `SMOKE`: feedback rápido y detección de roturas grandes;
- `CALIBRATION`: comparación habitual de ParameterSets;
- `DEEP`: colas, segmentos pequeños y eventos raros.

No se fija todavía cantidad por tier. Dos ParameterSets deben evaluarse sobre
el mismo set cuando se comparan, reduciendo ruido mediante common random
numbers. Cambiar el set cambia la evidencia, no el resultado de una Career.

### 12.2 Tipos de verificación

| Tipo | Pregunta |
|---|---|
| Golden vector | ¿Misma seed, inputs, versions y ParameterSet producen exactamente bytes/resultados iguales? |
| Property test | ¿Se preservan dominio, monotonicidad, invariantes y relaciones lógicas para muchos inputs? |
| Monte Carlo calibration | ¿Las distribuciones y relaciones agregadas quedan dentro de targets aprobados? |

Ninguno sustituye a otro. Un Monte Carlo exitoso no autoriza cambiar un golden;
un golden estable no demuestra balance; una property no determina una
distribución realista.

### 12.3 CalibrationTarget

```text
CalibrationTarget {
  targetId
  classification
  metric
  population
  segments
  statistic
  acceptedInterval
  tolerancePolicy
  seedSetTier
  minimumEvidence
  sourceReference
  rationale
  severity
}
```

`statistic` puede expresar:

- rango de mean;
- rango de median;
- rango de quantile;
- frecuencia de evento;
- frecuencia condicional;
- rango de correlación;
- distancia entre distribuciones cuando se apruebe una métrica;
- tasa o duración.

Los targets usan intervalos/tolerancias, no igualdad exacta. Deben declarar
tamaño/precisión de evidencia suficiente para interpretar un fallo.

### 12.4 Invariant, target y diagnostic

| Clasificación | Efecto |
|---|---|
| `INVARIANT` | Regla lógica/matemática que toda ejecución debe satisfacer. Fallar es defecto. |
| `CALIBRATION_TARGET` | Intervalo aprobado para una distribución agregada. Fallar exige investigar modelo/parámetros. |
| `DIAGNOSTIC` | Medida observada para entender causalidad o balance. No bloquea por sí sola. |

Ejemplos:

- `starts <= appearances`: invariant;
- minute share de `STARTER` por segmento: calibration target;
- correlación MarketValue/recent performance: diagnostic hasta que diseño
  apruebe un target.

Un diagnostic no se convierte en cap ni regla implícita.

### 12.5 Segmentación

Los targets declaran únicamente segmentos con hipótesis causal o requisito de
producto. Dimensiones disponibles:

- posición;
- edad/cohorte;
- liga/contexto;
- rol;
- fase de carrera;
- temporada/era cuando corresponda.

El vertical slice prioriza `GK`, `CM`, `ST`, Argentina y España. No se genera el
producto cartesiano completo automáticamente; se añaden cortes cuando existe
muestra y una pregunta de diseño.

### 12.6 Colas y eventos raros

La suite debe observar como mínimo, según tamaño de muestra:

- P90;
- P95;
- P99;
- P99.9;
- frecuencia y tiempo entre eventos raros;
- máximos observados como diagnostic, nunca como límite.

Para eventos muy raros se usa el tier `DEEP`, intervalos de confianza y, si se
aprueba, muestreo de importancia correctamente reponderado solo como herramienta
diagnóstica. No se introduce probability floor ni se cambia la distribución de
gameplay para acelerar un test.

### 12.7 Terminación práctica

Monte Carlo debe medir:

- duración de Career;
- edad de retiro;
- frecuencia de comeback;
- cantidad de ciclos retiro→regreso;
- masa de Careers aún abiertas por horizonte;
- consumo de pasos/CPU;
- riesgo de no terminación patológica.

No existe edad máxima ni retiro forzado. Un `CalibrationExecutionGuard` o
budget de worker es protección de infraestructura, no regla de gameplay:

- no genera `RetirementOccurred` ni `CareerCompleted`;
- no altera state, facts, score o replay;
- devuelve `INCONCLUSIVE_GUARD_REACHED`;
- obliga a reanudar, ampliar presupuesto o investigar;
- nunca se interpreta como resultado calibrado.

G3C-10 especifica además que la observación se registra como **right-censored**
para survival/termination metrics. La `CalibrationAutomationPolicy` que toma
decisiones de retiro/comeback/finalización pertenece a `CalibrationRunConfig`,
no a `EngineParameterSet`, Difficulty o VersionSet competitivo. Sus decisiones
usan las mismas APIs y cualquier RNG de tooling tiene namespace separado; el
guard nunca emite un Domain Fact.

## 13. Evidencia externa y anti-overfitting

Un dataset histórico futuro actúa como distribución de referencia, no como
regla determinista. Debe tener manifest inmutable con:

- versión/hash;
- provenance y licencia;
- fecha/cobertura;
- transformaciones;
- definiciones de métricas;
- sesgos y segmentos faltantes.

La simulación futura continúa siendo ficcional y estocástica; no consulta datos
reales posteriores al `dataVersion` de una Career.

No se calibra cada output de forma aislada. Se corrige primero la causa más
upstream compatible con la evidencia. Por ejemplo, un sesgo simultáneo en
goals, awards y MarketValue se investiga primero en exposición/Performance, no
se compensa con tres coeficientes independientes.

Orden causal normativo de calibración:

1. distribución inicial del jugador;
2. Development/Aging;
3. Role/Minutes;
4. Performance/Production;
5. Health;
6. Club/World;
7. Transfers;
8. National Team/Awards;
9. Reputation/Social;
10. Retirement;
11. Scoring;
12. diagnósticos end-to-end de Career.

Cada fase congela interfaces y distribuciones upstream suficientes; las fases
posteriores pueden revelar la necesidad de recalibrar upstream, pero no deben
ocultar el problema con compensaciones downstream.

## 14. Dominios iniciales de calibración

| Dominio | Familias que deberán recibir targets |
|---|---|
| Player/Development | distribución inicial, correlaciones, growth, decline y patrones de peak. |
| Role/Minutes | roles, minute share, cero minutos, appearances y starts. |
| Performance | producción GK/CM/ST, form, varianza, correlaciones y outliers. |
| Health | frecuencia, multiplicidad, severity, duration, recovery y relapse. |
| Club/World | persistencia, movilidad, titles, outcomes y ciclos. |
| Market | interés, transfer frequency, fees, salary, contract length y loans. |
| National Team | call-ups, roles, minutes y tournament participation. |
| Awards | frecuencia, repeat winners, fields y distribución posicional. |
| Reputation/Social | reach, memoria, difusión, follower trajectories y engagement. |
| Retirement | career length, retirement age, comeback y terminación práctica. |
| Scoring | PC, composición por categoría, caps autorizados y narrative tiers. |

No se aprueba ningún valor target en G3C-1.

## 15. Matriz de cierre de las 63 decisiones `PARTIAL`

Las fases siguientes son owners del cierre matemático. G3C-12 valida el sistema
integrado; no absorbe silenciosamente decisiones incompletas.

### G3C-2 — Player creation, Development & Aging

**Estado al 2026-07-29:** las ocho filas quedan `PARTIAL_CALIBRATION`.
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md) y
ADR-071 cierran todas las familias/fórmulas y samplers requeridos. La columna
de parámetros/targets identifica lo que todavía necesita valores y evidencia;
ya no representa matemática estructural abierta.

| ID | Familia/fórmula requerida | Parámetros requeridos | Upstream | Targets | Fase |
|---|---|---|---|---|---|
| G3B-B02 | Composición por capability de maturation, acquired development, wear y shock. | transforms, efectos, dispersión, covarianza, cuantización. | A01–A06, B01. | delta por capability/edad/Q. | G3C-2 |
| G3B-B03 | Familia de curvas latentes por maturation family sin peak fijo. | timing, velocidad, plateau, sensibilidad. | B02, traits. | patrones de peak y trayectorias. | G3C-2 |
| G3B-B04 | Proceso de wear/decline y longevity no monotónico. | age sensitivity, history, longevity, shocks. | B02–B03, Health contract. | decline, longevity y resurgence. | G3C-2 |
| G3B-B05 | Composición, extremos y efectos diferidos de entorno/salud. | extreme resistance, environment, sequela mapping. | B02–B04. | frontera, reversibilidad y drift. | G3C-2 |
| G3B-B06 | Probabilidad de reconversión y actualización posicional causal. | fit thresholds lógicos, hazards/utilities, contexto. | A capabilities, B02–B05, DR-048/049. | frecuencia y perfiles de reconversión. | G3C-2 |
| G3B-N02 | Función de coste/equivalencia estadística del Creation Budget. | costes, interacciones, tolerancias. | A04–A06, N01, DR-045. | equivalencia de poder inicial. | G3C-2 |
| G3B-N03 | Generador correlacionado/mixture de Carrera rápida. | perfiles, medias, dispersión, correlaciones. | A04, N01–N02. | distribuciones iniciales GK/CM/ST. | G3C-2 |
| G3B-N04 | Coste y distribución de foot/position/ventajas biográficas. | coste BOTH, priors posicionales, interacciones. | N02–N03, ADR-023/044. | equivalencia por pie/posición. | G3C-2 |

### G3C-3 — Role, Minutes, Calendar & Availability

**Estado al 2026-07-29:** G3B-C04 y G3B-F03 quedan `RESOLVED_MATH`;
G3B-C02, C03, C05 y C06 quedan `PARTIAL_CALIBRATION`.
[`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md) y ADR-072 cierran
softmax de role, persistencia, composición de availability, Logit-Normal de
minutos, apportionment y appearances/starts. Ninguna fila conserva pendiente
una familia matemática.

| ID | Familia/fórmula requerida | Parámetros requeridos | Upstream | Targets | Fase |
|---|---|---|---|---|---|
| G3B-C02 | Proceso temporal acotado de managerTrust. | persistencia, señales, regresión, noise. | DynamicState contract, Performance signals. | distribución y cambios de trust. | G3C-3 |
| G3B-C03 | Field agregado de competitionStrength/depth/entrenchment. | distribuciones por club/posición/era. | ClubState, effectivePosition. | competencia por contexto. | G3C-3 |
| G3B-C04 | Composición de Medical/Discipline/Other availability y oportunidad temporal. | mappings, precisión, calendario. | Health envelope, DR-064, F03. | shares de disponibilidad. | G3C-3 |
| G3B-C05 | Softmax de rol + modelo de minuteShare con masa causal en cero. | utilities, persistencia, share family, dispersión. | C02–C04, Performance previa. | rol/minutos/zero minutes. | G3C-3 |
| G3B-C06 | Asignación composicional por competición/posición. | shares, correlaciones, rounding de minutos. | C05, competition contexts. | sumas por contexto y multiposición. | G3C-3 |
| G3B-F03 | Convención de SeasonId, Q y calendario agregado. | epoch, timezone lógica, schedule registry. | DR-021. | invariantes temporales/exposición. | G3C-3 |

### G3C-4 — Performance, Form & Production

**Estado al 2026-07-29:** las ocho filas quedan `PARTIAL_CALIBRATION`; ninguna
conserva una familia matemática o sampler abierto.

| ID | Familia/fórmula cerrada | Parámetros aún requeridos | Upstream restante | Targets | Estado |
|---|---|---|---|---|---|
| G3B-D02 | Task logits desde capabilities en logit seguro; expectativa/realización multidimensional. | weights, interactions, dynamic/context sensitivities. | DynamicStates, Health adapters y Club context. | dimensiones por posición/contexto. | `PARTIAL_CALIBRATION` |
| G3B-D03 | Normal common/domain/specific/pressure; consistency exponencial; NB2/Binomial inverse-CDF. | loadings, sigmas, kappas. | RandomDrawKey cerrado; contexts upstream. | correlaciones, varianza y quantiles. | `PARTIAL_CALIBRATION` |
| G3B-D04 | Form AR(1) en logit y señales exactas de surprise/evidence. | persistence, response, noise y signal weights. | Owners de confidence/trust/morale. | rachas, reversión y volatilidad. | `PARTIAL_CALIBRATION` |
| G3B-D05 | Shots NB2 → saves Binomial → conceded → clean sheets derivadas. | rates, dispersion, save/context weights. | defense/opponent y eligibility G3C-6. | producción y colas GK. | `PARTIAL_CALIBRATION` |
| G3B-D06 | Cuatro impactos CM Normal + goals/assists NB2 correlacionados. | task weights, rates, dispersion y loadings. | control/attack context G3C-6. | producción e impactos CM. | `PARTIAL_CALIBRATION` |
| G3B-D07 | Oportunidad→chance quality/conversion; goals/assists NB2 con factor ofensivo. | rates, conversion, dispersion y loadings. | attack/opponent context G3C-6. | goals/assists y colas ST. | `PARTIAL_CALIBRATION` |
| G3B-D08 | Split ordinary/high-pressure, response y shock compartido. | pressure effects, sigmas y weights. | pressureExposure G3C-6. | response y producción bajo presión. | `PARTIAL_CALIBRATION` |
| G3B-D09 | Evidence `-expm1`, pesos minutes×evidence, sums y splits exactos. | taus, purpose weights y payload precision. | scopes/context IDs upstream. | summaries y sparse samples. | `PARTIAL_CALIBRATION` |

### G3C-5 — Health, Injuries & Recovery

**Estado al 2026-07-29:** las cinco filas quedan `PARTIAL_CALIBRATION`;
[`HEALTH_INJURY_RECOVERY_MATH_SPEC.md`](HEALTH_INJURY_RECOVERY_MATH_SPEC.md) y
ADR-074 cierran ecuaciones, samplers, orden y streams.

| ID | Familia/fórmula cerrada | Parámetros aún requeridos | Upstream restante | Targets | Estado |
|---|---|---|---|---|---|
| G3B-E02 | dose rates MATCH/TRAINING + compound Poisson por Q | load/exposure coefficients y rhos | calendar/training producers G3C-6 | oportunidades por origin/Q | `PARTIAL_CALIBRATION` |
| G3B-E03 | competing cumulative hazards `exposure*exp(logRate)` | intercepts, covariates y family params | medical/context producers G3C-6 | injury/conditional rates | `PARTIAL_CALIBRATION` |
| G3B-E05 | severity logistic-Normal + requirement LogNormal + progress softplus | severity/recovery/work values | six family definitions | severity/recovery distributions | `PARTIAL_CALIBRATION` |
| G3B-E06 | readiness continuo + interval allocation + relapse Poisson | availability/relapse values | calendar opportunity | return/relapse timing | `PARTIAL_CALIBRATION` |
| G3B-E07 | logistic occurrence/type + logistic-Normal burden + exponential decay | sequela values/affinities | six family definitions + Development consumer | frequency/effect | `PARTIAL_CALIBRATION` |

### G3C-6 — Club, Competitions & World

**Estado al 2026-07-29:** las cinco filas quedan `PARTIAL_CALIBRATION`;
[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md) y
ADR-075 cierran ecuaciones, samplers, orden, streams y boundary de movilidad.
F06 conserva DR-065 como blocker de data/policy.

| ID | Familia/fórmula cerrada | Parámetros aún requeridos | Upstream restante | Targets | Estado |
|---|---|---|---|---|---|
| G3B-F05 | noisy utility/canonical rank para league; logistic/Bernoulli por knockout phase; support/contribution y shocks compartidos | utility weights, field profiles, contribution weights, sigmas | CompetitionDefinitions y data DR-025/065 | standings/titles/rounds | `PARTIAL_CALIBRATION` |
| G3B-F06 | canonical rank/slots → `MobilityTransitionRequest` | rule bindings, materialization profiles | DR-065 para pool/aplicación/continuidad | movilidad y permanencia | `PARTIAL_CALIBRATION` |
| G3B-J02 | factor hierarchy Normal global/regional/league/club/competition/residual | loadings, persistence, dispersion | parameter values | cross-context correlations | `PARTIAL_CALIBRATION` |
| G3B-J03 | AR(1) mean-reverting en logit por Club/League/institutional state | means, persistence, outcome/context coefficients | parameter values/data baselines | strength/prestige/finance mobility | `PARTIAL_CALIBRATION` |
| G3B-J04 | ciclos continuos jerárquicos AR(1), sin regime machine guionada | means, persistence, amplitudes, loadings | parameter values | eras, estabilidad y tails | `PARTIAL_CALIBRATION` |

### G3C-7 — Transfers, Market & Contracts

[`TRANSFER_MARKET_CONTRACT_MATH_SPEC.md`](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
y [ADR-076](adr/076-transfer-market-contract-mathematics.md) cierran ecuaciones,
samplers, orden y streams.

| ID | Familia/fórmula cerrada | Parámetros aún requeridos | Upstream restante | Targets | Estado |
|---|---|---|---|---|---|
| G3B-G01 | enumeración canónica del scope + ClubNeed logistic-Normal + fit derivado | coefficients, loadings y values | data/DR-065 | candidates/need/fit | `PARTIAL_CALIBRATION` |
| G3B-G02 | transición Bernoulli logistic por club con factors jerárquicos | coefficients, sigmas y persistence values | Reputation snapshot G3C-9 para integración final | interest frequency/segments | `PARTIAL_CALIBRATION` |
| G3B-G03 | Offer logistic; operation/expectation/duration softmax; fee/salary log-space | economic/contract values | DR-027 y policy catalogs | fees/salary/contracts | `PARTIAL_CALIBRATION` |
| G3B-G04 | seller logistic + single-stage negotiation + frozen decision checkpoint | surplus/utility values | DR-066/067 | acceptance, failures, timing | `PARTIAL_CALIBRATION` |
| G3B-G07 | valuation observer-specific log-space + reference weighted median | valuation values, monetary scales | DR-027 | value distributions/trajectories | `PARTIAL_CALIBRATION` |

**Estado al 2026-07-29:** las cinco filas están `PARTIAL_CALIBRATION`; no
conservan ecuación, distribución o sampler abierto. El acumulado es dos
`RESOLVED_MATH`, treinta y cinco `PARTIAL_CALIBRATION` y veintiséis `PARTIAL`
asignadas a G3C-8–G3C-11.

### G3C-8 — National Team & Awards

| ID | Familia/fórmula requerida | Parámetros requeridos | Upstream | Targets | Fase |
|---|---|---|---|---|---|
| G3B-H01 | SelectionCompetitionField jerárquico por país/posición/era. | field distributions, generation factors. | WorldState, position taxonomy. | field strength/variance. | G3C-8 |
| G3B-H02 | Candidatura probabilística contra field tras eligibility lógica. | signal, evidence, incumbency, context. | H01, Performance, DR-068. | call-up frequency. | G3C-8 |
| G3B-H03 | Rol softmax, share internacional y Performance reutilizado. | role/minute params, support field. | H02, calendar, Health. | role/minutes/production. | G3C-8 |
| G3B-H04 | Calendario/outcomes internacionales agregados. | windows, baseline, contribution, variance. | DR-021, H03, World. | tournament participation/outcomes. | G3C-8 |
| G3B-I02 | Award/StatisticalCompetitionField por definition/edition. | field strength, dispersion, era/context. | World, AwardDefinition. | fields y winner baselines. | G3C-8 |
| G3B-I03 | Candidate comparison ordinal, judging noise y ties. | weights, variance, placement/tie policy. | I02, Performance, achievements. | winners, placements, repeats. | G3C-8 |
| G3B-I04 | Evaluación posicional y posición dominante por scope. | position weights, scopes, tie policy. | D05–D09, DR-049. | distribución GK/CM/ST. | G3C-8 |

### G3C-9 — Reputation & Social

| ID | Familia/fórmula requerida | Parámetros requeridos | Upstream | Targets | Fase |
|---|---|---|---|---|---|
| G3B-K01 | Transform de evidencia a SportingReputation regional. | signal weights, context, precision. | Performance, outcomes, awards/history. | reputación por trayectoria. | G3C-9 |
| G3B-K02 | Proceso de memoria, recency, decay y difusión. | persistence, regression, shocks. | K01, temporal contract. | memoria y movilidad reputacional. | G3C-9 |
| G3B-K05 | PublicAttention→followers/engagement con shocks compartidos. | growth/decay, saturation, diffusion, integer quantization. | PublicReputation, major facts. | follower/engagement trajectories. | G3C-9 |

### G3C-10 — Retirement, Comeback & Finalization

**Estado al 2026-08-01:** G3B-L01 queda `RESOLVED_MATH`; G3B-L02 y L04 quedan
`PARTIAL_CALIBRATION`. ADR-079 y
[`RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md`](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
cierran todas las ecuaciones, samplers, cursor y transiciones. DR-069 está
resuelta; faltan coefficients, evidencia, targets y expected goldens.

| ID | Familia/fórmula requerida | Parámetros requeridos | Upstream | Targets | Fase |
|---|---|---|---|---|---|
| G3B-L01 | Q cursor con retirement→comeback→finalization y no-ops posretiro. | ninguno de balance; operation keys son estructurales. | ADR-013/043/079. | RNG consumption/replay invariants. | `RESOLVED_MATH` |
| G3B-L02 | Motivation sigmoid + decline EWMA + competing-risks retirement/comeback hazards. | age/health/role/market/motivation rates, loadings y sigmas. | todos los snapshots deportivos upstream. | age, duration, comeback y tails. | `PARTIAL_CALIBRATION` |
| G3B-L04 | user/manual decisions, two comeback routes, viability, finalization hazard y irreversible fact frontier. | cause/context weights, automation fixtures y finalization targets. | L01–L02, ADR-079. | cycles, finalization y nontermination diagnostics. | `PARTIAL_CALIBRATION` |

### G3C-11 — Scoring

**Estado al 2026-08-01:** todas las familias matemáticas están cerradas por
[ADR-080](adr/080-exact-scoring-mathematics.md) y
[`SCORING_MATH_SPEC.md`](SCORING_MATH_SPEC.md).

| ID | Familia/fórmula requerida | Parámetros requeridos | Upstream | Targets | Fase |
|---|---|---|---|---|---|
| G3B-M02 | CC exacto por competición. | weights/splines/cohorts. | exposure/performance facts. | CC distribution/range. | `PARTIAL_CALIBRATION` |
| G3B-M03 | base doméstica × outcome × CC. | exactos dentro de rangos. | Competition facts, DR-066/067. | PTC composition. | `DATA_REQUIRED` |
| G3B-M04 | outcome internacional terminal × CC. | definitions/fases. | competition data. | PTC by competition. | `DATA_REQUIRED` |
| G3B-M05 | PSN outcome × CC, categorías exclusivas. | youth/outcome mappings. | National facts. | PSN composition. | `DATA_REQUIRED` |
| G3B-M06 | equivalencia `1`, `3/5`, `0...` y group rounding. | catalog/group membership. | Award facts. | PPI/dedup. | `DATA_REQUIRED` |
| G3B-M07 | PRI 5-component/cohort/segment math. | cohorts/transforms/weights. | SeasonPerformance facts. | PRI distribution. | `PARTIAL_CALIBRATION` |
| G3B-M08 | record/longevity entitlement/delta. | record/milestone catalog. | authorized facts. | PRL composition. | `DATA_REQUIRED` |
| G3B-M09 | cohort popularity + exact PBR caps. | social cohorts/transforms. | social/historic facts. | PBR composition. | `PARTIAL_CALIBRATION` |
| G3B-M10 | segment/edition attribution. | registration facts. | DR-066/067. | no duplication. | `DATA_REQUIRED` |
| G3B-M11 | DR-049 effective-minute dominance. | ninguno. | usageByPosition. | cohort assignment. | `RESOLVED_MATH` |
| G3B-M15 | exact frozen CDF + shrinkage. | datasets/provenance/knots. | scoring calibration data. | percentile stability. | `DATA_REQUIRED` |
| G3B-M17 | canonical equivalence/cap/round order. | ninguno. | M03–M11. | ledger fixtures. | `RESOLVED_MATH` |
| G3B-M18 | exact recompute/goldens/compatibility. | expected vectors/hashes. | M02–M17, DR-036/069. | byte identity. | `PARTIAL_CALIBRATION` |

**Reconciliación histórica:**
`8 + 6 + 8 + 5 + 5 + 5 + 7 + 3 + 3 + 13 = 63`.
Después de G3C-11: 51 filas están `PARTIAL_CALIBRATION`, cinco
`RESOLVED_MATH`, siete `DATA_REQUIRED` y ninguna `PARTIAL` por matemática.

### G3C-12 — Calibración integrada

G3C-12 no elige reglas faltantes. Ejecuta:

- Monte Carlo end-to-end sobre ParameterSets ya completos;
- composición de targets entre módulos;
- análisis de colas y rare events;
- equivalencia de Creation Budget;
- termination diagnostics;
- distribución de PC y narrative tiers;
- validación causal y anti-overfitting;
- aprobación o rechazo del ParameterSet del vertical slice.

## 16. Gates

### Gate histórico para redactar G3C-2

Cumplido por este contrato:

- toolbox común aprobado;
- domains persistidos separados de cálculo/presentación;
- política de cuantización establecida;
- randomness y factores compartidos identificables;
- arquitectura de ParameterSet y calibración establecida;
- 63 decisiones `PARTIAL` asignadas.

G3C-2 puede diseñar fórmulas de Player/Development/Creation. No puede
implementar gameplay.

G3C-2 cerró la función/protocolo de Creation Budget y resolvió DR-048/049.
DR-045/053 quedan `PARTIAL_CALIBRATION`; no se autorizaron valores
provisionales.

### Gate hacia G3C-3

No queda un blocker matemático de Creation/Development para **especificar**
G3C-3. Las interfaces de minutos, disponibilidad y calendario continúan siendo
responsabilidad de G3C-3, por lo que G3C-2 no inventó sus señales. Implementar
Creation/Development sigue bloqueado hasta publicar el ParameterSet inicial,
aprobar targets/evidencia y completar los goldens normativos.

### Gate hacia G3C-4

G3C-3 cerró las seis familias matemáticas asignadas. Performance puede
especificarse usando `SportingRole`, `actualMinutes`, breakdown por
competición/posición, context features y evidence contracts.

No existe blocker estructural para redactar G3C-4. La implementación oficial
de Role & Minutes sigue bloqueada hasta:

- publicar valores de `EngineParameterSet.roleMinutes`;
- aprobar goldens de ADR-072 y `LogitNormalMeanGaussHermite10V1`;
- recibir la asignación médica de G3C-5;
- recibir TacticalFit, PositionCompetition y TeamMinutesOpportunity de G3C-6;
- completar formatos/generación de calendario pendientes en DR-021.

### Gate hacia G3C-5

G3C-4 cerró las ocho familias matemáticas asignadas:

- task abilities sin Overall;
- Underlying Performance Normal multidimensional y correlacionado;
- consistency, presión, evidence y surprise;
- counts NB2/Binomial con inverse-CDF determinista;
- grafos ST/CM/GK;
- Form AR(1) en logit;
- agregación Q/season/multicontexto.

No existe blocker de familia matemática para **especificar** G3C-5. Health
recibe minutos/intensidad ya realizados y debe producir sus propios estados,
hazards y adapters sin reabrir Performance.

Implementar Performance oficial sigue bloqueado hasta:

- publicar valores de `EngineParameterSet.performance`;
- aprobar targets externos y goldens de ADR-073;
- recibir fitness/fatigue/restricciones de G3C-5;
- recibir contextos, pressure exposure y eligibility de G3C-6;
- congelar payload schemas compatibles con DR-063.

### Gate hacia G3C-6

G3C-5 cerró:

- dose/load, acute/chronic memory;
- AR(1) independientes de fitness/fatigue;
- competing cumulative hazards y counts Poisson;
- severity logistic-Normal;
- recovery LogNormal y progreso positivo;
- medical interval allocation;
- relapse relacionado;
- secuela temporal/persistente.

Club/World puede especificar sus producers usando los dominios cerrados de
`medicalQuality`, training exposure, preparation, recovery opportunity,
congestion y schedule difficulty. No puede reabrir ecuaciones Health.

Implementar Health oficial sigue bloqueado hasta publicar:

- valores de `EngineParameterSet.health`;
- seis `InjuryFamilyDefinition`;
- producers G3C-6;
- goldens y targets de ADR-074;
- schemas compatibles con DR-063.

### Gate hacia G3C-7

G3C-6 cerró:

- AR(1) en logit para Club/League/World states;
- factors Normal jerárquicos y ciclos continuos;
- manager hazard/generation, TacticalFit y PositionCompetition;
- TeamMinutesOpportunity y progression checkpoints causales;
- noisy utility de league y logistic advancement de knockout;
- TeamSupportField y PlayerCompetitiveContribution;
- context producers de Performance/Health/Development;
- boundary matemático de mobility request.

Transfers puede especificar candidate fields, value, interest y offers usando
financialPower, prestige, sporting strength, position context y world cycles.
No puede aplicar un fallback fuera del tier. ADR-081 cierra la arquitectura
híbrida, pero el catálogo/field/materialización deben estar publicados.

Implementar Club/World oficial continúa bloqueado hasta:

- publicar valores de `EngineParameterSet.clubWorld/competitions`;
- aprobar CompetitionDefinitions, participants y sources;
- publicar DR-065/ADR-081 para movilidad/continuidad;
- aprobar goldens/targets de ADR-075;
- congelar schemas compatibles con DR-063.

### Gate hacia G3C-8

G3C-7 cerró:

- MarketPerception y valuation observer-specific en log-space;
- ClubNeed, candidate field y PlayerClubFit;
- Interest y Offer mediante Bernoulli logistic separados;
- BidderCompetitionField y financial feasibility;
- fee/salary Money exacto;
- ContractExpectation/duration por stable softmax;
- seller response y negociación agregada single-stage;
- renewal/loan pathways;
- PlayerDecision explícita sin RNG;
- WAITING_DECISION sin resampling.

National Team/Awards puede consumir Performance/World y sporting reputation
sin usar MarketValue, fee o salary como mérito. G3C-8 no depende de cerrar
DR-027/065/066/067 para elegir sus familias matemáticas, pero no puede inventar
calendar, eligibility o external participants.

Implementar Market oficial continúa bloqueado hasta:

- publicar valores de `EngineParameterSet.transfers`;
- publicar native Money, purchasing-power context y schema range de DR-027;
- publicar DR-065/ADR-081 para candidates/continuidad externa;
- publicar DR-066 para registration post-season;
- publicar DR-067 para la ventana post-season; mid-season queda fuera de V1;
- aprobar goldens/targets de ADR-076;
- congelar schemas compatibles con DR-063.

### Gate antes de implementar matemática

Sigue bloqueado hasta:

- especificar algoritmos exactos y goldens del perfil trascendental;
- cerrar las fórmulas y samplers de cada fase G3C;
- aprobar dominios de DynamicStates usados;
- publicar un `EngineParameterSet` validado y hasheado;
- aprobar CalibrationTargets y resultados del vertical slice;
- resolver DR de scope/timing/data que afecten ejecución;
- materializar ADR-079 junto con Scoring una vez publicados los artefactos;
- publicar ScoringConfiguration/CalibrationData/catálogos/goldens de ADR-080;
- ejecutar y aceptar calibración integrada antes de gameplay real.

## 17. G3D-1 — registries, campañas y publicación

G3D-1 no cambia ninguna ecuación G3C. Introduce los contratos de control que
permiten asignar valores y publicar artefactos sin perder causalidad,
determinismo ni provenance.

### 17.1 Registros normativos

Son obligatorios y forman una unidad:

- [`CALIBRATION_PARAMETER_REGISTRY.md`](CALIBRATION_PARAMETER_REGISTRY.md):
  identidad y metadata de cada parameter-path de gameplay y Scoring;
- [`CALIBRATION_TARGET_REGISTRY.md`](CALIBRATION_TARGET_REGISTRY.md): targets,
  invariantes y diagnostics canónicos;
- [`CALIBRATION_DATASET_REGISTRY.md`](CALIBRATION_DATASET_REGISTRY.md):
  datasets, catálogos, mappings, transformations y provenance;
- [`GOLDEN_VECTOR_REGISTRY.md`](GOLDEN_VECTOR_REGISTRY.md): fixtures exactos,
  verificación independiente y estado de publicación.

Un path parametrizado se expande únicamente sobre claves de catálogos
versionados. La ausencia de una expansión requerida no significa cero ni
default. Aliases son de migración/documentación y nunca aparecen junto con el
path canónico en un payload publicado.

### 17.2 Publication states y fuentes

Los estados canónicos son:

```text
UNASSIGNED
-> PROVISIONAL_DESIGN | ESTIMATED_FROM_DATA
-> CALIBRATED
-> VALIDATED
-> FROZEN_V1
```

`TEMPORARY_PROVISIONAL` puede existir en candidatos, pero no llegar a
`FROZEN_V1`. Cada valor declara exactamente un origen primario:
`NORMATIVE`, `EXTERNAL_OBSERVATION`, `DERIVED_ESTIMATE`,
`SYNTHETIC_CALIBRATION`, `PRODUCT_DECISION` o `TEMPORARY_PROVISIONAL`.

### 17.3 `ParameterSetCandidateManifest`

```text
ParameterSetCandidateManifest {
  candidateId
  parentCandidateId?
  engineVersionCandidate
  parameterSetId
  parameterSetHash
  schemaVersion
  changedParameterPaths[]
  changeRationale
  expectedTargetIds[]
  sourceAndEstimateRefs[]
  createdBy
  logicalCreatedAt
  resultRunIds[]
  outcome: PENDING | ACCEPTED | REJECTED
  outcomeRationale?
}
```

`logicalCreatedAt` es metadata administrativa, no input causal ni identidad de
gameplay. Los candidatos son append-only. Se comparan con el mismo
`CalibrationSeedSet`; no se sobrescribe el parent.

### 17.4 `MonteCarloRunManifest`

```text
MonteCarloRunManifest {
  runId
  parameterSetCandidateId
  parameterSetHash
  scoringConfigurationHash?
  scoringCalibrationDataHash?
  datasetVersionsAndHashes[]
  calibrationSeedSetId
  calibrationSeedSetHash
  sampleTier: SMOKE | CALIBRATION | DEEP
  scenarioId
  scenarioParametersHash
  futureCodeVersion
  outputMetricTargetIds[]
  resultArtifactHash
  acceptanceReportId?
  status: PLANNED | RUNNING | COMPLETED | INCONCLUSIVE_GUARD_REACHED | FAILED
}
```

`INCONCLUSIVE_GUARD_REACHED` no cuenta como sample válido y no crea facts.
Scoring no recibe streams ni draws: cuando participa en un run, proyecta de
forma determinista los facts ya producidos.

### 17.5 `CalibrationAcceptanceReport`

```text
CalibrationAcceptanceReport {
  reportId
  candidateOrScoringBundleIdentity
  runIds[]
  datasetAndTransformHashes[]
  targetResults[]
  invariantFailures[]
  tailDiagnostics[]
  goldenResults[]
  gateResults[]
  knownLimitations[]
  productDecisionRefs[]
  reviewerRefs[]
  decision: ACCEPT | REJECT | MORE_EVIDENCE_REQUIRED
  artifactHash
}
```

### 17.6 Acceptance hierarchy

Los gates se evalúan en orden; un gate crítico fallido bloquea publicación:

1. **GATE 1 — mathematical validity:** domains, finitud, invariantes y sampler
   conformance.
2. **GATE 2 — subsystem targets:** cada bloque upstream cumple sus rangos por
   segmento requerido.
3. **GATE 3 — cross-system:** adapters y correlaciones causales no compensan
   errores upstream.
4. **GATE 4 — tails:** P90/P95/P99/P99.9, rare-event frequencies y ausencia de
   caps editoriales correctivos.
5. **GATE 5 — end-to-end Careers:** trayectorias, estabilidad, right-censoring
   y termination diagnostics.
6. **GATE 6 — scoring/tier:** ledger/category/PC/tier distributions con bundle
   de Scoring separado.
7. **GATE 7 — replay/golden stability:** expected outputs verificados,
   deterministic replay, hashes e incremental/full recomputation.

### 17.7 Política de tuning

1. Calibrar Creation/Development antes de exposure; exposure antes de
   Production; Production/Health/World antes de consumers downstream.
2. No corregir una rate de goals alterando Awards, Market o Scoring.
3. Cambiar pocos grupos causales por candidato y declarar targets esperados.
4. Usar common random numbers mediante el mismo `CalibrationSeedSet`.
5. Ejecutar regression targets completos, no solo el target buscado.
6. No usar clipping, caps ni thresholds para ocultar tails.
7. No overfit a una season, liga, proveedor o segmentación.
8. Registrar candidatos rechazados y rationale.

### 17.8 Bundle de publicación

`EngineParameterSet V1` conserva ADR-070:

```text
VersionSet + parameterSetId + parameterSetHash
```

No existe `parameterVersion`. Un candidato no oficial puede cambiar solo de
hash. Una publicación causal oficial requiere `engineVersion` nuevo como
mínimo y una misma `engineVersion` resuelve a un único hash.

Scoring conserva ADR-080:

```text
scoringVersion
+ ScoringConfigurationHash
+ ScoringCalibrationDataHash
```

Una misma `scoringVersion` oficial resuelve a un único par de hashes. Los
parámetros de gameplay y Scoring no comparten root, loader ni publication
bundle.

### 17.9 Implementación permitida antes de calibración completa

Una fase posterior puede implementar, sin valores de gameplay publicados:

- primitives numéricas y samplers ya normativos;
- schemas/canonicalization/hash validators;
- loaders y validators de registries/artefactos;
- golden harness;
- skeleton de Monte Carlo que no contiene valores ni reglas adicionales.

Siguen bloqueados: modelos de gameplay con valores no publicados, Scoring
competitivo, outcomes del vertical slice y leaderboard. G3D-1 no implementa
ninguno de estos elementos.

## 18. G3D-2 — binding de catálogos y policies

G3D-2 no cambia ecuaciones, distribuciones, samplers ni cuantización. Añade una
regla transversal de aceptación: un candidate no puede asignar o validar un
parámetro que dependa de data/catalog mientras la `DatasetDefinition` requerida
no tenga artifact, transformación, schema y hash resolubles en el estado mínimo
de publicación exigido por su target.

La cadena normativa es:

```text
licensed/provenanced source artifact
-> reproducible transform manifest
-> normalized dataset/catalog candidate
-> validation report
-> frozen dataset/catalog hash
-> parameter/scoring candidate binding
-> acceptance report
```

`UNASSIGNED`, `PENDING_DATA` o missing Definition nunca se sustituyen por cero,
media, club genérico, moneda implícita, elegibilidad permisiva o regla editorial.
Los 40 DatasetDefinitions existentes conservan identidad y siguen `PLANNED` al
cerrar esta tarea; G3D-2 solo fija scope, schemas, mappings, priorities y policy.

Las decisiones producto se identifican como `PRODUCT_DECISION` y no adquieren
evidence tier. Las tolerancias sin valor impiden `VALIDATED/FROZEN_V1`, pero no
autorizan provisional defaults dentro de una Career competitiva.

Referencias G3D-2:

- [`VERTICAL_SLICE_DATA_CATALOG_SPEC.md`](VERTICAL_SLICE_DATA_CATALOG_SPEC.md);
- [`G3D_PRODUCT_DECISIONS.md`](G3D_PRODUCT_DECISIONS.md);
- [`G3D_EXTERNAL_RESEARCH_PLAN.md`](G3D_EXTERNAL_RESEARCH_PLAN.md);
- [ADR-081](adr/081-hybrid-external-club-pool.md);
- [ADR-082](adr/082-vertical-slice-sporting-nationality.md).
- [ADR-083](adr/083-native-money-and-calibration-normalization.md).

## 19. Referencias

- [G3B Mathematical Design Board](G3B_DESIGN_BOARD.md)
- [Especificación matemática del motor](MATHEMATICAL_ENGINE_SPEC.md)
- [Facts y scoring](SCORING_FACTS_SPEC.md)
- [Registro de decisiones](DECISIONS_REQUIRED.md)
- [Arquitectura](ARCHITECTURE.md)
- [Plan de implementación](IMPLEMENTATION_PLAN.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-071](adr/071-creation-development-mathematics.md)
- [ADR-072](adr/072-role-minutes-and-availability-mathematics.md)
- [ADR-073](adr/073-performance-production-form-mathematics.md)
- [ADR-074](adr/074-health-injury-recovery-mathematics.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)
- [ADR-076](adr/076-transfer-market-contract-mathematics.md)
- [ADR-077](adr/077-national-team-awards-mathematics.md)
- [ADR-078](adr/078-reputation-public-attention-social-mathematics.md)
- [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md)
- [ADR-080](adr/080-exact-scoring-mathematics.md)
- [Creation & Development Math](CREATION_DEVELOPMENT_MATH_SPEC.md)
- [Role & Minutes Math](ROLE_MINUTES_MATH_SPEC.md)
- [Performance, Production & Form Math](PERFORMANCE_PRODUCTION_FORM_MATH_SPEC.md)
- [Transfers, Market & Contracts Math](TRANSFER_MARKET_CONTRACT_MATH_SPEC.md)
- [Health, Injury & Recovery Math](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)
- [Club, Competitions & World Math](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [National Team & Awards Math](NATIONAL_TEAM_AWARDS_MATH_SPEC.md)
- [Reputation & Social Math](REPUTATION_SOCIAL_MATH_SPEC.md)
- [Retirement, Comeback & Finalization Math](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
- [Scoring Math](SCORING_MATH_SPEC.md)
