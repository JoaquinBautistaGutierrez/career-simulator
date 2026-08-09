# Especificación matemática de Creation, Development & Aging

## 1. Estado, alcance y autoridad

**Estado:** cierre matemático G3C-2; ecuaciones y samplers normativos,
calibración numérica pendiente.  
**Fecha:** 2026-07-29.  
**Decisiones cubiertas:** G3B-B02–B06 y G3B-N02–N04.  
**DR relacionadas:** DR-008, DR-023, DR-045, DR-048, DR-049, DR-052 y
DR-053.  
**ADR:** [ADR-071](adr/071-creation-development-mathematics.md).

Este documento selecciona las familias matemáticas, ecuaciones, samplers,
invariantes y contratos de parámetros de Creation, Development, Aging,
PositionSuitability, retraining e historial posicional.

No fija coeficientes de balance ni implementa gameplay. Role & Minutes,
Performance y Health continúan siendo owners de sus outputs; aquí solo se
definen los inputs numéricos que deberán entregar.

Ante una discrepancia, prevalecen:

1. `MASTER_SPEC v0.8`;
2. ADR aceptados;
3. [`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md);
4. este documento para el scope G3C-2;
5. los specs estructurales G3B.

## 2. Notación y dominios

| Símbolo | Dominio | Semántica |
|---|---|---|
| `S` | `10000` | Escala persistida de capabilities/traits. |
| `i` | catálogo de 20 capabilities | Capability individual. |
| `f(i)` | cinco familias | Familia única de `i`. |
| `q` | `Q1..Q4` | Ventana de evolución. |
| `Δt_q` | real positivo | Fracción de año de dominio cubierta por Q. |
| `a_q` | real finito | Edad de dominio en años al punto medio de Q. |
| `x_i` | `[0,1]` | Capability normalizada `stored_i / S`. |
| `n,d,p,l` | `[0,1]` | NaturalTalent, DevelopmentCapacity, Professionalism y Longevity normalizados. |
| `L_q,H_q,Q_q` | `[0,1]` | Load, health burden y sequela burden confirmados. |
| `E_q` | `[0,1)` | Experience signal. |
| `Env_q` | `[0,1]` | Development environment. |

`a_q` y `Δt_q` proceden del calendario de dominio; no usan reloj real. G3C-3
debe cerrar su derivación exacta. Hasta entonces son inputs requeridos, no
constantes locales.

Todo cálculo usa binary64 finito dentro de una transición atómica. NaN,
infinitos y `-0` persistido son inválidos.

## 3. Capability calculation space

### 3.1 Transformación canónica

Para un capability persistido `c_i ∈ {0,...,10000}`:

```text
x_i     = c_i / S
xSafe_i = ε + (1 - 2ε) * x_i
z_i     = stableLogit(xSafe_i)
```

Después de resolver el delta latente:

```text
z'_i = z_i + deltaZ_i
x'_i = stableSigmoid(z'_i)

c'_i =
  quantizeState(
    S * clampLogical(x'_i, 0, 1),
    0,
    S
  )
```

`quantizeState` usa `ROUND_HALF_EVEN`. El vector completo `c'` se valida y se
aplica atómicamente.

### 3.2 Dominio de epsilon

```text
0 < ε <= 1 / (2S)
```

Este límite garantiza que `deltaZ = 0` conserva también los endpoints bajo
`ROUND_HALF_EVEN`:

```text
c = 0     → xSafe = ε       → c' = 0
c = 10000 → xSafe = 1 - ε   → c' = 10000
```

Para `c=0`, un delta positivo suficientemente grande puede producir `c'>0`;
un delta negativo puede permanecer en `0` por la frontera lógica. Para
`c=10000`, un delta negativo suficientemente grande puede reducir el valor; un
delta positivo puede permanecer en `10000`.

`ε` evita logit infinito. No es un potential cap, un floor editorial ni una
probabilidad mínima. El logit hace que un mismo `deltaZ` produzca cambios
menores en la escala almacenada cerca de los extremos, preservando soporte sin
un ceiling personal.

## 4. Descomposición causal de Development

Para capability `i` y ventana `q`:

```text
deltaZ[i,q] =
    maturation[i,q]
  + acquiredDevelopment[i,q]
  - wear[i,q]
  + sharedShock[f(i),q]
  + specificShock[i,q]
```

No existe otro término implícito. Una futura causa nueva requiere decisión
normativa y una versión participante.

Antes de sumar se conserva una `CapabilityEvolutionTrace` interna con:

- capability/familia;
- snapshot previo;
- cada uno de los cinco términos;
- inputs y parámetros usados;
- `RandomDrawKey` de ambos shocks;
- `deltaZ`;
- valor candidato y valor cuantizado;
- referencias causales a minutos, club y Health;
- `parameterSetHash`.

La traza no es un overall ni exige persistir cada intermedio como Domain Fact.
El fact canónico sigue siendo `PlayerCapabilitiesChanged`.

## 5. Capability families

El mapping es total, disjunto e inmutable dentro de esta versión:

| Familia | Capabilities |
|---|---|
| `EXPLOSIVE_PHYSICAL` | `acceleration`, `pace`, `agility` |
| `STRUCTURAL_PHYSICAL` | `strength`, `stamina` |
| `TECHNICAL` | `finishing`, `passing`, `ballControl`, `dribbling`, `defending`, `goalkeeping` |
| `MENTAL` | `composure`, `vision`, `decisionMaking`, `positioning`, `workRate` |
| `TACTICAL` | `attackingMovement`, `defensiveAwareness`, `pressing`, `tacticalIntelligence` |

Ninguna capability pertenece a más de una familia. `goalkeeping` y
`defending` permanecen `TECHNICAL`; su especificidad se expresa mediante
offsets y parámetros por capability, no creando una sexta familia.

## 6. PlayerMaturationProfile

### 6.1 Estado latente

Por familia `f`, el perfil verdadero conserva:

```text
maturationShiftYears[f] ∈ (-shiftScale[f], +shiftScale[f])
maturationTempo[f]      ∈ (0, +∞)
declineSensitivity[f]   ∈ (0, +∞)
```

No contiene `peakAge`, ceiling ni etapa rígida.

### 6.2 Generación conjunta

Después de generar traits, se normalizan:

```text
t = [2*naturalTalent - 1, 2*longevity - 1]
```

Se sortean:

```text
ξGlobal ∼ N(0, I3)
ξFamily[f] ∼ N(0, I3), independientes por familia
```

Para cada familia:

```text
r[f] =
    profileMean[f]
  + profileTraitLoadings[f] * t
  + profileGlobalLoadings[f] * ξGlobal
  + profileFamilyCholesky[f] * ξFamily[f]

maturationShiftYears[f] = shiftScale[f] * tanh(r[f,shift])
maturationTempo[f]      = safeExp(r[f,tempo])
declineSensitivity[f]   = safeExp(r[f,decline])
```

Las matrices y medias son parámetros. Las diagonales de
`profileFamilyCholesky` son estrictamente positivas para conservar variación.

`NaturalTalent` puede desplazar timing/tempo. `Longevity` puede reducir
expected decline sensitivity mediante el signo calibrado de su loading.
`DevelopmentCapacity` no entra directamente: hacerlo duplicaría su ruta
posterior en acquired development. Puede quedar correlacionado con el perfil
mediante los factores compartidos de generación inicial.

El perfil se genera una vez y permanece oculto. El pico observado se deriva de
historia cerrada.

## 7. Maturation component

### 7.1 Ventana suave de maduración

Para familia `f`:

```text
u[f,q] =
  maturationTempo[f]
  * (a_q - maturationCenterAge[f] - maturationShiftYears[f])
  / maturationWidthYears[f]

s[f,q] = stableSigmoid(u[f,q])
maturationWindow[f,q] = 4 * s[f,q] * (1 - s[f,q])
```

Con parámetros finitos y `maturationWidthYears[f] > 0`, la ventana:

- es suave;
- pertenece a `(0,1]` para toda edad finita;
- no posee threshold;
- permite timing/anchura individual;
- describe intensidad esperada de maduración, no el peak observado de carrera.

### 7.2 Rate por capability

```text
maturationPredictor[i,q] =
    maturationBaseLogRate[f(i)]
  + maturationCapabilityOffset[i]
  + maturationNaturalTalentWeight[f(i)] * n

maturationRate[i,q] =
  softplus(maturationPredictor[i,q])

maturation[i,q] =
  Δt_q
  * maturationWindow[f(i),q]
  * maturationRate[i,q]
```

`maturationNaturalTalentWeight[f] >= 0`. `DevelopmentCapacity` no participa en
esta ecuación. La función es positiva para inputs finitos, pero puede ser
arbitrariamente pequeña; no garantiza delta neto positivo.

El máximo de la ventana matemática no se almacena ni determina el máximo de la
capability, Performance o Career.

## 8. Experience y DevelopmentEnvironment

### 8.1 Experience

Role & Minutes entrega `actualMinutes[q] >= 0`. Se define:

```text
mEquivalent[q] =
  actualMinutes[q] / experienceMinuteUnit[f]

E[f,q] =
  -expm1(
    -experienceSaturationRate[f] * mEquivalent[q]
  )
```

con:

```text
experienceMinuteUnit[f] > 0
experienceSaturationRate[f] > 0
```

Propiedades:

- `E(0)=0`;
- `E` es estrictamente creciente;
- `E → 1` al crecer minutos;
- la derivada decrece;
- cero minutos no fuerza acquired development total a cero.

No se usan `expectedMinutes`, `SportingRole`, goals ni rating como reemplazo de
experiencia.

### 8.2 DevelopmentEnvironment

Los owners externos entregan tres señales normalizadas:

```text
clubDevelopmentQuality       ∈ [0,1]
managerDevelopmentInfluence  ∈ [0,1]
trainingContextSignal        ∈ [0,1]
```

La combinación es:

```text
Env[q] =
    environmentWeightClub    * clubDevelopmentQuality
  + environmentWeightManager * managerDevelopmentInfluence
  + environmentWeightTraining * trainingContextSignal
```

con pesos no negativos que suman exactamente uno. Prestige, financial power y
ClubOverall no son aliases válidos.

Si el vertical slice no dispone de un canal, su peso debe ser explícitamente
cero en el ParameterSet y los otros pesos deben seguir sumando uno. No existe
fallback oculto.

## 9. Acquired Development

Para `d=developmentCapacity/S` y `p=professionalism/S`:

```text
acquiredPredictor[i,q] =
    acquiredBaseLogRate[f(i)]
  + acquiredCapabilityLearnability[i]
  + acquiredDevelopmentCapacityWeight[f(i)] * d
  + acquiredProfessionalismWeight[f(i)] * p
  + acquiredExperienceWeight[f(i)] * E[f(i),q]
  + acquiredEnvironmentWeight[f(i)] * Env[q]
  + acquiredDevelopmentEnvironmentInteraction[f(i)] * d * Env[q]
  + acquiredProfessionalismEnvironmentInteraction[f(i)] * p * Env[q]

acquiredDevelopment[i,q] =
  Δt_q * softplus(acquiredPredictor[i,q])
```

Todos los weights de señales e interacciones son no negativos. Interceptos y
learnability offsets pueden tener cualquier signo.

La construcción aditiva en el predictor evita el colapso a cero de un producto
crudo. Mayor DevelopmentCapacity, Professionalism, experiencia o entorno no
reduce el **valor esperado del componente adquirido** manteniendo lo demás
fijo. No garantiza un outcome neto mayor porque wear y shocks continúan
separados.

`NaturalTalent` no aparece aquí. Su ruta está en generación inicial,
maturation profile y maturation rate.

## 10. Wear y Longevity

Health entrega por Q:

```text
loadSignal[q]       = developmentLoadSignal[q] ∈ [0,1]
healthBurden[q]     = composed active-condition burden ∈ [0,1]
sequelaBurden[i,q]  = composed affinity-weighted burden ∈ [0,1]
inactivitySignal[q] = confirmed inactivity exposure ∈ [0,1]
```

ADR-074/
[`HEALTH_INJURY_RECOVERY_MATH_SPEC.md`](HEALTH_INJURY_RECOVERY_MATH_SPEC.md)
fija las tres derivaciones. `sequelaBurden[i,q]` combina, mediante
`1-product(1-burden*affinity)`, secuelas activas y el affinity de su
`InjuryFamily` hacia la family de capability `i`. Health nunca aplica este
wear; Development no infiere Health desde minutos o Performance.

Para familia `f`:

```text
ageWearFeature[f,q] =
  (a_q - wearAgeReference[f]) / wearAgeScaleYears[f]

wearPredictor[i,q] =
    wearBaseLogRate[f]
  + wearCapabilityOffset[i]
  + wearAgeWeight[f] * ageWearFeature[f,q]
  + wearLoadWeight[f] * loadSignal[q]
  + wearHealthBurdenWeight[f] * healthBurden[q]
  + wearSequelaWeight[i] * sequelaBurden[i,q]
  + wearInactivityWeight[f] * inactivitySignal[q]
  + wearDeclineSensitivityWeight[f]
      * safeLog(declineSensitivity[f])
  - wearLongevityWeight[f] * l
  - wearProfessionalismMaintenanceWeight[f] * p

wear[i,q] =
  Δt_q * softplus(wearPredictor[i,q])
```

Restricciones:

```text
wearAgeScaleYears[f] > 0
todos los wear*Weight anteriores >= 0
```

Edad modifica suavemente el predictor; no existe `age >= X`. Wear es
no negativo, pero no determina el signo neto. Longevity solo reduce expected
wear/decline; no aumenta maturation o acquired development y no impone edad
máxima.

Una secuela solo entra cuando Health la confirmó. Su magnitud no se deriva
directamente de `InjuryOccurred`.

## 11. Stochastic hierarchy

Por jugador, Q y familia:

```text
ZFamily[f,q] ∼ StandardNormalInverseCdfV1
sharedShock[f,q] =
  sqrt(Δt_q) * developmentFamilySigma[f] * ZFamily[f,q]
```

Por jugador, Q y capability:

```text
ZSpecific[i,q] ∼ StandardNormalInverseCdfV1
specificShock[i,q] =
  sqrt(Δt_q) * developmentCapabilitySigma[i] * ZSpecific[i,q]
```

Todos los sigmas del ParameterSet oficial son estrictamente positivos.

Random keys:

```text
namespace: "development"
modelId:   "capability-evolution-v1"
context: {
  playerId,
  seasonId,
  quarter,
  family
}
occurrence: 0
purpose: "family-shock"
```

```text
namespace: "development"
modelId:   "capability-evolution-v1"
context: {
  playerId,
  seasonId,
  quarter,
  capability
}
occurrence: 0
purpose: "capability-specific-shock"
```

Los shocks de familia son independientes entre familias. Los específicos son
independientes entre sí y respecto de los compartidos. Para dos capabilities
de una misma familia, la covarianza estocástica inducida es
`Δt_q * sigmaFamily²`; no comparten todo su shock.

No existe un único shock para las veinte capabilities.

## 12. Soporte, extremos y trayectoria

Con sigmas positivos y Normal de soporte real:

```text
P(deltaZ[i,q] > 0) > 0
P(deltaZ[i,q] < 0) > 0
```

para toda edad y contexto finitos. Por tanto:

- un veterano conserva probabilidad positiva de mejora latente;
- un joven conserva probabilidad positiva de empeoramiento latente;
- plateau, decline y resurgence pueden emerger sin estados guionados.

En la escala persistida, una mejora sobre `10000` o un empeoramiento bajo `0`
son lógicamente imposibles. Deltas pequeños pueden cuantizar a cero. Fuera de
esas fronteras, ninguna edad, arquetipo o supuesto potencial elimina un signo.

No existe fuerza hacia `5000`, media poblacional o media posicional.

## 13. Initial player generation

### 13.1 Orden canónico

El generador base:

1. toma o samplea `primaryPosition`;
2. toma o samplea `DominantFoot`;
3. samplea un componente de mixture compatible con la posición;
4. samplea factores compartidos;
5. genera conjuntamente traits y capabilities;
6. genera `PlayerMaturationProfile` condicionado por traits;
7. calcula `PositionSuitability` y `CreationPowerScore`;
8. aplica el boundary de Creation Budget;
9. confirma el primer candidato aceptado.

Órdenes canónicos:

- Position: orden de ADR-011;
- DominantFoot: `RIGHT`, `LEFT`, `BOTH`;
- mixture components: `profileId` ascendente;
- capabilities y traits: orden del catálogo normativo.

### 13.2 Posición, pie y mixture

Si posición o pie están fijados por una opción autorizada, no se realiza su
draw. En otro caso:

```text
P(primaryPosition=p) =
  stableSoftmax(positionUtility[p])

P(dominantFoot=d | p) =
  stableSoftmax(footUtility[p,d])

P(profile=k | p,a) =
  stableSoftmax(
    profileBaseUtility[p,k]
    + profileAgeUtility[p,k] * creationAgeFeature
  )
```

Todas las utilities habilitadas son finitas; por tanto conservan masa positiva.

```text
creationAgeFeature =
  tanh(
    (initialAge - generationAgeReference)
    / generationAgeScaleYears
  )
```

`generationAgeScaleYears > 0`.

### 13.3 Factores compartidos

Se samplean estándar Normal independientes:

```text
G                 general player factor
F[f]              factor por capability family
T                 talent-expression factor
P                  within-profile factor
D                 drive factor
R                 resilience factor
H                 durability factor
εCapability[i]    residual específico
εTrait[t]         residual específico
```

Todos usan `StandardNormalInverseCdfV1`, un `uint64` por variate y keys de
namespace `creation`, `modelId="initial-player-factor-v1"`, `context` con
`creationId`, `candidateOrdinal`, posición, `profileId` y nombre del factor,
`occurrence=0`.

### 13.4 Capabilities

Para capability `i`:

```text
capabilityMean[i] =
    capabilityBaseMean[position,profile,i]
  + capabilityAgeLinear[position,profile,i] * creationAgeFeature
  + capabilityAgeQuadratic[position,profile,i] * creationAgeFeature²

zCapability[i] =
    capabilityMean[i]
  + capabilityGeneralLoading[i] * G
  + capabilityFamilyLoading[i] * F[f(i)]
  + capabilityTalentLoading[i] * T
  + capabilityProfileLoading[position,profile,i] * P
  + capabilityResidualSigma[i] * εCapability[i]

initialCapability[i] =
  quantizeState(
    S * stableSigmoid(zCapability[i]),
    0,
    S
  )
```

`capabilityResidualSigma[i] > 0` para todo `i`.

### 13.5 Traits

Para trait `t`:

```text
traitMean[t] =
    traitBaseMean[position,profile,t]
  + traitAgeLinear[position,profile,t] * creationAgeFeature

zTrait[t] =
    traitMean[t]
  + traitGeneralLoading[t] * G
  + traitTalentLoading[t] * T
  + traitDriveLoading[t] * D
  + traitResilienceLoading[t] * R
  + traitDurabilityLoading[t] * H
  + traitProfileLoading[position,profile,t] * P
  + traitResidualSigma[t] * εTrait[t]

initialTrait[t] =
  quantizeState(
    S * stableSigmoid(zTrait[t]),
    0,
    S
  )
```

`traitResidualSigma[t] > 0`. Los signos de loadings capturan correlaciones; por
ejemplo, InjuryFragility puede cargar negativamente sobre Durability sin
convertirse en su complemento exacto.

Capabilities y traits quedan correlacionados mediante `G`, `T`, `P` y el
mixture component. No se usa una matriz de correlación independiente que pueda
contradecir esos factores.

### 13.6 Soporte de profiles

Un profile modifica utilities, medias y loadings. Nunca:

- impone mínimo/máximo a una capability;
- fija un trait;
- elimina un residual;
- deshabilita una combinación compatible.

Con mixture weights positivas y residual sigmas positivas, todo vector
cuantizado compatible conserva probabilidad positiva, aunque combinaciones
extremas puedan ser extraordinariamente improbables.

El catálogo de `profileId` y sus parámetros pertenece al ParameterSet. G3C-2
no inventa nombres editoriales de arquetipos.

## 14. CreationPowerScore

### 14.1 Surrogate

Sea:

```text
v = concat(normalizedCapabilities[20], normalizedTraits[10])
y = v - 0.5

agePowerFeature =
  tanh(
    (initialAge - creationPowerAgeReference)
    / creationPowerAgeScaleYears
  )
```

Para posición `p` y pie `d`:

```text
CreationPowerScore =
    powerIntercept[p]
  + powerFootEffect[p,d]
  + powerAgeLinear[p] * agePowerFeature
  + powerAgeQuadratic[p] * agePowerFeature²
  + powerLinear[p]ᵀ * y
  + yᵀ * powerInteraction[p] * y
```

`powerInteraction[p]` es simétrica y versionada. Para identificación:

```text
powerFootEffect[p,RIGHT] = 0
```

Los efectos de `LEFT` y `BOTH` se calibran; no se presupone igualdad ni valor.

El score es un real finito y derivado. No entra en Performance, Development,
Scoring, UI rating ni PlayerState. Solo:

- define/valida Creation Budget;
- compara Quick/Custom;
- detecta combinaciones dominantes.

Incluye todos los traits ocultos porque pueden modificar poder esperado a lo
largo de la carrera. Es un surrogate versionado; sus coeficientes deberán
calibrarse contra un label estandarizado aprobado, sin simular una carrera
completa durante creación.

### 14.2 Distribución de presupuesto

El ParameterSet contiene una CDF de referencia monotónica de
CreationPowerScore mediante knots:

```text
creationPowerQuantileKnots = [(u0,b0),...,(un,bn)]
```

con `u0=0`, `un=1`, `u` estrictamente creciente y `b` no decreciente. La
inversa usa interpolación lineal entre knots.

Cada creación samplea una sola vez:

```text
uBudget ∈ [0,1)
targetPower = inverseReferenceCdf(uBudget)
```

La key del draw es:

```text
namespace: "creation"
modelId: "creation-budget-v1"
context: { creationId }
occurrence: 0
purpose: "target-power-quantile"
```

Un candidato es aceptable si:

```text
abs(CreationPowerScore(candidate) - targetPower)
  <= creationPowerAcceptanceBand
```

La banda es un parámetro positivo requerido. Es una regla autorizada de
creación, no un cap de gameplay.

## 15. Quick y Custom creation

### 15.1 Sampler condicionado común

Quick y Custom usan la misma distribución base y el mismo target de poder.
Para un conjunto de condiciones visibles `C`:

```text
P(candidate | C, targetPower)
∝
  Pbase(candidate)
  * I(candidate satisfies C)
  * I(abs(CPS(candidate)-targetPower) <= acceptanceBand)
```

Se implementa conceptualmente mediante rejection sampling exacto:

1. `uBudget` fija `targetPower`;
2. para `occurrence = 0,1,2,...`, se deriva un candidato independiente con key
   estable;
3. se acepta el primer candidato que cumple condiciones y banda.

No existe máximo semántico de intentos ni fallback que relaje poder, traits o
constraints. Un guard técnico puede devolver
`INCONCLUSIVE_GUARD_REACHED` sin crear jugador.

Una condición sin soporte se rechaza como configuración inválida antes de
crear una Career.

### 15.2 Quick

Quick puede:

- samplear posición/pie;
- condicionar una selección permitida de posición o pie;
- dejar el resto al sampler.

Seleccionar `BOTH` no añade presupuesto. Su `powerFootEffect` consume parte del
target de poder y el sampler distribuye condicionalmente el resto; no resta una
cantidad fija a una capability concreta.

### 15.3 Custom

Custom, cuando se habilite, solo puede condicionar dimensiones visibles
allowlisted como posición, pie o bandas de capabilities visibles. No puede
elegir valores exactos de:

- NaturalTalent;
- DevelopmentCapacity;
- Professionalism;
- Consistency;
- Adaptability;
- InjuryFragility;
- RecoveryCapacity;
- Longevity;
- maturation profile;
- factores latentes.

Esas variables se samplean de la distribución condicional. La UX no forma parte
de este contrato.

### 15.4 Equivalencia estadística

Para cada segmento competitivo aprobado se comparan Quick y Custom sobre el
mismo `CalibrationSeedSet`.

Métricas obligatorias sobre `CreationPowerScore`:

```text
standardizedMeanDifference
normalizedMedianDifference
normalizedQuantileDifference(q) for q = 0.05, 0.25, 0.75, 0.95
normalizedWasserstein1
twoSampleKS
```

Las normalizaciones usan el IQR de Quick del segmento; un IQR cero invalida el
target, no autoriza división por cero.

También se comparan marginales y correlaciones de capabilities/traits para
detectar compensaciones ocultas. La equivalencia requiere que el intervalo de
confianza determinista/bootstrap de **cada** métrica quede dentro de su
tolerancia versionada. No se aprueba por un p-value de no significancia.

Carrera rápida y personalizada no comparten leaderboard hasta superar todos
los targets.

## 16. PositionSuitability

Para cada posición `p`, con vector de capabilities normalizadas `x`:

```text
suitabilityPredictor[p] =
    suitabilityIntercept[p]
  + Σ_i suitabilityMainWeight[p,i] * x_i
  + Σ_(i,j in suitabilityInteractions[p])
      suitabilityInteractionWeight[p,i,j] * x_i * x_j

PositionSuitability[p] =
  stableSigmoid(suitabilityPredictor[p])
```

Dominio:

```text
PositionSuitability[p] ∈ (0,1)
```

Todos los main/interaction weights son no negativos; una capability mayor no
reduce suitability manteniendo el resto fijo. Un weight puede ser cero.

El ParameterSet del vertical slice debe incluir:

- 20 main weights para `GK`, `CM` y `ST`;
- los siguientes interaction keys, con valores calibrados:

```text
GK:
  goalkeeping × positioning
  goalkeeping × agility
  passing × decisionMaking

CM:
  passing × vision
  ballControl × decisionMaking
  stamina × workRate
  defending × defensiveAwareness

ST:
  finishing × composure
  attackingMovement × positioning
  pace × acceleration
  strength × ballControl
```

La misma interfaz admite las quince posiciones. Una posición no puede
habilitarse para gameplay hasta publicar sus 20 weights e interaction set.

Suitability es derivada, posicional y no causal universal. No es un Overall.

## 17. Retraining

### 17.1 Scope del vertical slice

El vertical slice habilita exactamente:

```text
enabledPlayablePositions = { GK, CM, ST }
```

Primary, secondary y effective positions del protagonista permanecen en ese
set. Las otras doce posiciones son `CONTENT_DISABLED` para el slice, no
lógicamente imposibles en el modelo general. Una release futura puede
habilitarlas únicamente con PositionSuitability, Performance, Selection,
Awards, Market y calibration coverage completos.

### 17.2 Features

Para current position `c` y candidata `p` habilitada:

```text
suitabilityGap[p] =
  PositionSuitability[p] - PositionSuitability[c]

recentUsageShare[p] =
  minutesInPosition[p,currentScope]
  / totalMinutes[currentScope]
```

Si el denominador es cero, `recentUsageShare=0`.

```text
historyExposure[p] =
  -expm1(
    -careerEffectiveMinutes[p]
    / retrainingHistoryMinuteScale
  )

retrainingAgeFeature =
  tanh(
    (age - retrainingAgeReference)
    / retrainingAgeScaleYears
  )
```

`tacticalFitCandidate[p] ∈ [0,1]` es input de Club/Manager.
`adaptability = TraitValue/S`.

### 17.3 Candidate y opportunity

```text
candidateUtility[c,p] =
    retrainingPairIntercept[c,p]
  + retrainingSuitabilityGapWeight * suitabilityGap[p]
  + retrainingRecentUsageWeight * recentUsageShare[p]
  + retrainingHistoryWeight * historyExposure[p]
  + retrainingTacticalFitWeight * tacticalFitCandidate[p]
  + retrainingAdaptabilityWeight * adaptability
  + retrainingAgeWeight[c,p] * retrainingAgeFeature
```

Todos los weights salvo `retrainingAgeWeight` y los interceptos son no
negativos.

Para `K` candidatas:

```text
candidateAggregate =
  logSumExp(candidateUtilities) - safeLog(K)

retrainingOpportunityLogOdds =
    retrainingOpportunityIntercept[c]
  + retrainingAggregateWeight * candidateAggregate
```

`retrainingAggregateWeight > 0`. Se samplea con `sampleLogOdds` del Probability
Core y namespace/contexto:

```text
namespace: "development"
modelId: "retraining-v1"
context: { playerId, seasonId, quarter, currentPosition }
occurrence: retrainingEpisodeOrdinal
purpose: "opportunity"
```

Si ocurre, la candidata se samplea mediante stable softmax sobre utilities en
orden ADR-011, con purpose `"candidate"`. Esto produce una
`RetrainingOpportunity`; no cambia todavía la primaria.

### 17.4 Completion

Una oportunidad aceptada crea un proceso identificable. En cada Q posterior
elegible:

```text
completionLogOdds =
    retrainingCompletionIntercept[c,p]
  + retrainingCompletionSuitabilityWeight * suitabilityGap[p]
  + retrainingCompletionUsageWeight * recentUsageShare[p]
  + retrainingCompletionHistoryWeight * historyExposure[p]
  + retrainingCompletionTacticalWeight * tacticalFitCandidate[p]
  + retrainingCompletionAdaptabilityWeight * adaptability
  + retrainingDecisionCommitmentWeight * decisionCommitment
```

`decisionCommitment ∈ [0,1]` es efecto mecánico tipado de la choice; no texto.
Los weights son no negativos.

Se samplea con el mismo episode ordinal y purpose `"completion"` más el
`evaluationOrdinal`. No hay cooldown ni duración fija. Failure mantiene el
proceso según su estado; no garantiza fracaso futuro.

Al completar atómicamente:

- candidate pasa a `primaryPosition`;
- previous primary se añade a secondary;
- candidate se elimina de secondary si estaba;
- history conserva el cambio;
- capabilities no cambian;
- ventanas anteriores no se reetiquetan.

No se puede completar más de una primary transition en una misma operación
porque `primaryPosition` es singular; esto es una invariante de estado, no un
cap de oportunidades.

## 18. Effective position history y DR-049

### 18.1 Acumulación

Para cada scope cerrado:

```text
effectiveMinutes[position] =
  Σ MinutesRecorded.usageByPosition[position]
```

Si un fact no posee breakdown, todos sus `actualMinutes` pertenecen a su
`effectivePosition`. Si posee breakdown:

```text
Σ positionMinutes = actualMinutes
```

y no se suma nuevamente la posición dominante de la Q.

Club e internacional permanecen segmentos separados en facts. El
`PositionDominanceScope` declara cuáles incluye.

### 18.2 DominantPositionGroup

```text
groupMinutes[g] =
  Σ_(positionGroup(p)=g) effectiveMinutes[p]
```

Si el total es cero, no existe posición/grupo dominante competitivo.

Se elige el grupo por esta clave lexicográfica descendente:

1. `groupMinutes`;
2. mayor `effectiveMinutes` de una posición dentro del grupo;
3. vector de minutos de sus posiciones, ordenado descendentemente y completado
   con ceros hasta longitud cinco;
4. orden canónico de grupos `GK`, `DEF`, `MID`, `FWD`, ascendente.

### 18.3 DominantSpecificPosition

Dentro del grupo elegido:

1. mayor `effectiveMinutes[position]`;
2. en empate exacto, orden canónico de Position de ADR-011, ascendente.

El resultado contiene:

```text
dominantPositionGroup
dominantSpecificPosition
scope
effectiveMinutes
tieBreakTrace
```

Rankings agregados usan el grupo. Premios/rankings `POSITION_SPECIFIC` usan la
posición específica secundaria dentro del mismo grupo. Nunca se usan posición
inicial, final, reciente, cantidad de temporadas ni secondary positions sin
minutos.

## 19. Invariantes y properties

### 19.1 Capability evolution

1. Toda capability persistida es entero `0..10000`.
2. No se persisten NaN, infinitos ni `-0`.
3. Mismos inputs, seed, context, versions y ParameterSet producen mismo vector.
4. El vector se valida/aplica una sola vez y atómicamente.
5. Cada componente causal es auditable antes de la suma.
6. Performance no modifica capability fuera de esta operación.
7. No existe Overall, potential cap o peakAge causal.
8. Edad no activa ramas de growth/decline.
9. Joven con delta latente negativo y veterano con delta positivo conservan
   probabilidad positiva.
10. Para `c<S`, una mejora persistida conserva soporte positivo; para `c>0`,
    un empeoramiento persistido conserva soporte positivo.
11. Mayor DevelopmentCapacity, Professionalism, experiencia o environment no
    reduce expected acquired development, ceteris paribus.
12. Mayor Longevity no aumenta expected wear, ceteris paribus.
13. Una secuela ausente no crea burden.
14. `deltaZ=0` conserva exactamente endpoints e interiores bajo el fixture de
    epsilon válido.

La monotonicidad se exige a la expectativa/componente, no a un outcome
sampleado individual.

### 19.2 Creation

1. Catálogos completos de 20 capabilities y 10 traits.
2. Residual sigma positivo para cada variable.
3. Mixture weights positivas para componentes habilitados.
4. Archetype/profile no impone límites.
5. Quick y Custom usan base, target y CPS comunes.
6. Hidden variables no son editables por Custom.
7. `BOTH` participa en CPS y no altera una capability por regla fija.
8. Ningún candidato fuera de banda se confirma.
9. Un execution guard no crea Player.

### 19.3 Position

1. Suitability está en `(0,1)` y es derivada.
2. Retraining nunca modifica capabilities.
3. No hay threshold, cooldown ni cambio editorial.
4. Slice no emite posiciones fuera de `GK/CM/ST`.
5. Minutos no se duplican.
6. Dominance usa solo minutos efectivos cerrados.
7. Scope sin minutos no obtiene cohorte.
8. Tie-break es total, estable y sin RNG.

## 20. Calibration targets

### 20.1 Segmentación

Posiciones mínimas:

```text
GK, CM, ST
```

Contextos cuando el target consume entorno:

```text
Argentina, España
```

Bandas de edad diagnósticas:

```text
U18   := age < 18
18–21 := 18 <= age < 22
22–25 := 22 <= age < 26
26–29 := 26 <= age < 30
30–33 := 30 <= age < 34
34–37 := 34 <= age < 38
38+   := age >= 38
```

Son segmentos de observación; no participan en ninguna ecuación ni crean
thresholds de decline.

### 20.2 Tabla normativa

| ID | Clase | Métrica | Segmentos | Estado de valor |
|---|---|---|---|---|
| `CD-I01` | INVARIANT | capabilities/traits enteros `0..10000` | todos | Cerrado |
| `CD-I02` | INVARIANT | soporte de ambos signos en deltaZ | family × age band | Cerrado |
| `CD-I03` | INVARIANT | sum usageByPosition = actualMinutes | scope | Cerrado |
| `CD-I04` | INVARIANT | replay exacto | fixture/seed | Cerrado |
| `CD-C01` | CALIBRATION_TARGET | quantiles P05/P25/P50/P75/P95 de capability | position × family | INITIAL_CALIBRATION_REQUIRED |
| `CD-C02` | CALIBRATION_TARGET | quantiles de traits | position/profile | INITIAL_CALIBRATION_REQUIRED |
| `CD-C03` | CALIBRATION_TARGET | correlaciones capability/capability y trait/trait seleccionadas | position | INITIAL_CALIBRATION_REQUIRED |
| `CD-C04` | CALIBRATION_TARGET | distribución de CreationPowerScore | position/foot | INITIAL_CALIBRATION_REQUIRED |
| `CD-C05` | CALIBRATION_TARGET | SMD, median, quantiles, W1 y KS Quick/Custom | position/foot | Requerido antes de leaderboard compartido |
| `CD-C06` | CALIBRATION_TARGET | delta estacional por family | age band × context | INITIAL_CALIBRATION_REQUIRED |
| `CD-C07` | CALIBRATION_TARGET | frecuencia delta persistido positivo/negativo | family × age band | INITIAL_CALIBRATION_REQUIRED |
| `CD-C08` | CALIBRATION_TARGET | cambio acumulado a 3/5/10 temporadas | initial cohort × family | INITIAL_CALIBRATION_REQUIRED |
| `CD-C09` | CALIBRATION_TARGET | observed capability-peak age | family × position | Rango provisional, evidencia externa requerida |
| `CD-C10` | CALIBRATION_TARGET | resurgence tras decline | family × age band | Rango provisional |
| `CD-C11` | CALIBRATION_TARGET | prevalencia de capabilities extremas | position × age band | INITIAL_CALIBRATION_REQUIRED |
| `CD-D01` | DIAGNOSTIC | prevalence y CPS marginal de BOTH | position | Sin gate aislado |
| `CD-D02` | DIAGNOSTIC | cross-family delta correlation | age band | Informa sigmas/loadings |
| `CD-D03` | DIAGNOSTIC | aceptación/intentos del sampler condicionado | constraint set | Operacional, no gameplay |
| `CD-D04` | DIAGNOSTIC | diferencia Development Argentina/España | position × age band | No target hasta evidencia |
| `CD-D05` | DIAGNOSTIC | capability mass en 0/10000 | capability × age | Detecta mala calibración, no cap |

Necesitan evidencia externa/histórica o criterios expertos: `CD-C01–C03`,
`CD-C06–C11` y la calibración del surrogate CPS. `CD-C05` se obtiene
internamente comparando modos y no requiere datos reales, pero sí tolerancias
aprobadas. `CD-D01–D05` no se convierten en restricciones automáticamente.

## 21. EngineParameterSet

### 21.1 Estructura

```text
EngineParameterSet
├── player
│   ├── capabilityEvolution
│   │   ├── boundaryEpsilon
│   │   └── positionSuitability
│   └── creation
│       ├── position
│       ├── foot
│       ├── profiles
│       ├── factors
│       ├── capabilityGenerator
│       ├── traitGenerator
│       ├── powerSurrogate
│       └── conditionalSampler
└── development
    ├── maturationProfile
    ├── maturation
    ├── experience
    ├── environment
    ├── acquired
    ├── wear
    ├── shocks
    └── retraining
```

No hay defaults implícitos. Todo array/matriz se valida contra catálogos y
dimensiones canónicas.

### 21.2 Parámetros estructurales fijos

| Parámetro/contrato | Valor |
|---|---|
| `capabilityScale` | `10000` |
| `capabilityEvolutionSpace` | `LOGIT_SAFE_V1` |
| `stateRounding` | `ROUND_HALF_EVEN` |
| `standardNormalSampler` | `StandardNormalInverseCdfV1` |
| `developmentComposition` | `maturation + acquired - wear + familyShock + specificShock` |
| `maturationWindowMultiplier` | `4` |
| `capabilityFamilyMap` | Tabla de §5 |
| `positionOrder` | ADR-011 |
| `positionGroupOrder` | `GK, DEF, MID, FWD` |
| `footOrder` | `RIGHT, LEFT, BOTH` |
| `verticalSliceEnabledPositions` | `GK, CM, ST` |

### 21.3 Initial calibration required

| Grupo | Parámetros completos |
|---|---|
| Boundary | `boundaryEpsilon` |
| Maturation profile | `profileMean[f,3]`, `profileTraitLoadings[f,3,2]`, `profileGlobalLoadings[f,3,3]`, `profileFamilyCholesky[f,3,3]`, `shiftScale[f]` |
| Maturation | `maturationCenterAge[f]`, `maturationWidthYears[f]`, `maturationBaseLogRate[f]`, `maturationCapabilityOffset[i]`, `maturationNaturalTalentWeight[f]` |
| Experience | `experienceMinuteUnit[f]`, `experienceSaturationRate[f]` |
| Environment | tres environment weights simplex |
| Acquired | base/offsets y seis weights/interacciones de §9 por familia |
| Wear | age reference/scale, base/offsets y ocho weights de §10, incluido `wearInactivityWeight[f]` |
| Shocks | `developmentFamilySigma[f]`, `developmentCapabilitySigma[i]` |
| Position/foot | utilities por position y foot |
| Profiles | component IDs, utilities base/age |
| Capability generator | means base/age, cuatro loadings y residual sigma por capability |
| Trait generator | means base/age, seis loadings y residual sigma por trait |
| Maturation generation | matrices ya enumeradas y keys de streams |
| CPS | interceptos, foot effects, age params, linear vectors, matrices simétricas, reference CDF knots y acceptance band |
| Suitability | intercept, 20 main weights y interaction weights por posición habilitada |
| Retraining opportunity | pair/current intercepts, siete feature weights, history minute scale, age reference/scale |
| Retraining completion | pair intercepts y seis feature/decision weights |

Cada valor es obligatorio en el primer ParameterSet aprobado. Ninguno recibe
un número en esta especificación.

### 21.4 Tunable later

Los mismos coeficientes pueden recalibrarse solo publicando nuevo hash y
`engineVersion`. Además viven fuera del ParameterSet de gameplay:

- tolerancias de SMD/median/quantiles/W1/KS;
- intervalos de targets `CD-Cxx`;
- sample counts por tier;
- bootstrap confidence level/replicates;
- alertas operacionales del rejection sampler;
- diagnostics y reporting thresholds.

No afectan una Career ya iniciada.

## 22. Golden vectors requeridos

### 22.1 Math profile

- `StandardNormalInverseCdfV1` para palabras `uint64` de borde, centro y ambos
  tails;
- consumo exactamente de una palabra por variate;
- Horner exacto y ausencia de cache;
- stable sigmoid/logit y `ROUND_HALF_EVEN` en endpoints.

### 22.2 Capability evolution

Fixture manual:

```text
initialStored = 5000
ε = cualquier valor válido
maturation = 0.020
acquired = 0.010
wear = 0.015
sharedShock = 0.005
specificShock = -0.002
```

Derivación:

```text
z = 0
deltaZ = 0.018
stableSigmoid(0.018) = 0.5044998785039364
stored' = 5045
```

También:

- `stored=0`, `deltaZ=0` → `0`;
- `stored=10000`, `deltaZ=0` → `10000`;
- vector de veinte capabilities con signos mixtos;
- mismo vector reanudado después de commit no consume draws.

### 22.3 Creation

Fixture algebraico:

```text
all latent draws = 0
all means = 0
all loadings finite
selected profile fixed
selected position fixed
```

Resultado antes del boundary CPS:

```text
20 capabilities = 5000
10 traits = 5000
```

Se requieren además fixtures no triviales con:

- draws, means y matrices explícitos;
- expected 20 capabilities, 10 traits, profile y CPS;
- posición/pie sampleados;
- `BOTH` condicionado;
- primer candidato rechazado y segundo aceptado por CPS;
- mismo target budget con Quick y Custom.

Los expected completos se congelan al existir la implementación de referencia;
no se inventan manualmente aquí.

### 22.4 PositionSuitability

Fixture:

```text
suitabilityIntercept = 0
all main weights = 0
interaction set empty
```

produce exactamente `0.5` para cualquier perfil.

El golden no trivial debe fijar los 20 inputs y todos los weights de
`GK/CM/ST`, con outputs binary64 esperados.

### 22.5 Retraining

Fixtures:

- opportunity log-odds `0` y draw conocido;
- dos candidates con utilities iguales y orden canónico;
- proceso aceptado que falla y luego completa con occurrence distinto;
- high suitability sin garantía;
- outside-slice candidate clasificada `CONTENT_DISABLED`;
- completion no modifica capabilities.

### 22.6 Dominant position

Fixture de desempate:

```text
GK = 400
CM = 900
ST = 900
rest = 0
```

`MID` y `FWD` empatan en group/leading/signature; el orden canónico elige:

```text
dominantPositionGroup = MID
dominantSpecificPosition = CM
```

Otros fixtures cubren breakdown multiposicional, cero minutos, scopes
club/international y empate `CM/CAM`.

## 23. Monte Carlo

### SMOKE

Orden de magnitud: `10²–10³` Careers/candidatos efectivos por suite.

Recolecta:

- schema/invariantes;
- determinismo;
- endpoints;
- sign support observado;
- sampler acceptance diagnostics;
- ausencia de duplicación posicional.

### CALIBRATION

Orden de magnitud: `10⁴–10⁵`.

Recolecta:

- targets `CD-C01–C08` y `CD-C11`;
- matrices de correlación;
- Quick/Custom equivalence completa;
- BOTH/position marginals;
- delta por family/age/context;
- mass en extremos.

### DEEP

Orden de magnitud: `10⁶+` observaciones efectivas cuando tails/segmentos lo
requieran.

Recolecta:

- P99/P99.9;
- combinations extremas;
- peak/resurgence;
- trayectorias 10+ temporadas;
- acceptance tails de Custom;
- probabilidades muy pequeñas de reconversión;
- estabilidad cross-runtime.

El manifest fija cantidad exacta y usa el mismo `CalibrationSeedSet` para
comparar ParameterSets.

## 24. Estado de cierre

| ID | Estado G3C-2 | Cierre matemático | Pendiente |
|---|---|---|---|
| G3B-B02 | `PARTIAL_CALIBRATION` | Espacio logit, suma causal, softplus, wear y shocks cerrados. | Coeficientes/targets. |
| G3B-B03 | `PARTIAL_CALIBRATION` | Ventana derivada de logística y profile jerárquico cerrados. | Timing/dispersiones. |
| G3B-B04 | `PARTIAL_CALIBRATION` | Wear softplus, edad suave, decline sensitivity y Longevity cerrados. | Coeficientes/Health signals. |
| G3B-B05 | `PARTIAL_CALIBRATION` | Boundary de health/sequela y composición atómica cerrados. | Mapping numérico de G3C-5. |
| G3B-B06 | `PARTIAL_CALIBRATION` | Logistic/softmax retraining, scope del slice e historia cerrados. | Coeficientes/targets. |
| G3B-N02 | `PARTIAL_CALIBRATION` | CPS cuadrático, target quantile y acceptance rule cerrados. | Surrogate coefficients/CDF/band. |
| G3B-N03 | `PARTIAL_CALIBRATION` | Mixture factor model y conditional rejection sampler cerrados. | Means/loadings/mixture weights. |
| G3B-N04 | `PARTIAL_CALIBRATION` | Posición/pie y BOTH integrados en CPS/sampler. | Foot effects/priors. |

Ninguna conserva pendiente una familia matemática. Permanecen
`PARTIAL_CALIBRATION` porque el ParameterSet oficial aún no tiene valores.

DR-048 y DR-049 quedan resueltas en su pregunta normativa. DR-045 y DR-053
pasan a `PARTIAL_CALIBRATION`. DR-023/052 permanecen resueltas. DR-008 sigue
abierta para los demás módulos y para calibración integrada.

## 25. Gates

Antes de implementar G3C-2:

- publicar todos los parámetros `INITIAL_CALIBRATION_REQUIRED`;
- aprobar math-profile goldens;
- cerrar inputs temporales de G3C-3;
- proporcionar interfaces normalizadas de Club y Health;
- aprobar targets mínimos del vertical slice;
- conservar PositionScope `GK/CM/ST`;
- no usar ParameterSet de prueba en Careers oficiales.

No hay blocker estructural para comenzar G3C-3. G3C-3 debe entregar
`actualMinutes`, oportunidad/calendario y breakdown posicional sin cambiar las
ecuaciones aquí definidas.

**Reconciliación G3C-6 (2026-07-29):** Club/World produce
`developmentQuality`, `managerDevelopmentInfluence`, `trainingContextSignal`,
calendar/load context y `TacticalFit` mediante
[`CLUB_COMPETITION_WORLD_MATH_SPEC.md`](CLUB_COMPETITION_WORLD_MATH_SPEC.md).
Development los consume en los dominios ya declarados y no recalcula state de
club, manager o mundo.

## 26. Adapter G3C-10 — Development durante retiro abierto

Con playing `RETIRED` y Career abierta, Development no se congela:

```text
actualMinutes = 0
experienceSignal = 0
developmentEnvironment.club = 0
developmentEnvironment.manager = 0
developmentEnvironment.training = 0
inactivitySignal = 1
```

Maturation cronológica, wear, shocks y cuantización continúan. Acquired
development conserva su baseline positivo suave: cero minutos no lo vuelve
lógicamente cero. El nuevo término
`wearInactivityWeight[f] * inactivitySignal` hace explícita la inactividad sin
duplicar load/Health; es `INITIAL_CALIBRATION_REQUIRED` y no introduce threshold
ni forced decline. Comeback vuelve a entregar los inputs contextuales reales en
la siguiente Q habilitada. Finalization impide nuevas evoluciones, pero no borra
capabilities.

## 27. Referencias

- [Contrato matemático y de calibración](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Player Model](PLAYER_MODEL_SPEC.md)
- [Development & Aging estructural](DEVELOPMENT_AGING_SPEC.md)
- [G3B Design Board](G3B_DESIGN_BOARD.md)
- [Registro de decisiones](DECISIONS_REQUIRED.md)
- [ADR-052](adr/052-fundamental-player-model.md)
- [ADR-053](adr/053-development-and-aging-model.md)
- [ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md)
- [ADR-071](adr/071-creation-development-mathematics.md)
- [ADR-075](adr/075-club-competition-world-mathematics.md)
- [Club/Competition/World Math](CLUB_COMPETITION_WORLD_MATH_SPEC.md)
- [Retirement/Comeback/Finalization Math](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
- [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md)
