# Especificación de desarrollo y envejecimiento

**Estado:** Normativa estructural G3B; ecuaciones/samplers refinados por G3C-2,
balance pendiente  
**Fecha:** 2026-07-29  
**Autoridad:** `MASTER_SPEC v0.8`, ADR-004, ADR-013, ADR-042, ADR-043,
ADR-044, ADR-052, ADR-053, ADR-054, ADR-055 y ADR-057  
**Decisiones del board cubiertas:** G3B-B01 a G3B-B07; refinamientos de
G3B-A06, G3B-B04, G3B-B05, G3B-C05, G3B-E01, G3B-E07 y G3B-F01

## 1. Alcance

Este documento define la estructura causal y temporal mediante la que cambian
las capacidades del jugador. Las funciones, distribuciones, precisión y
samplers fueron cerrados posteriormente en
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md); sus
coeficientes continúan en calibración.

Quedan fuera de alcance:

- rendimiento, producción deportiva y forma;
- generación de rol, disponibilidad y minutos;
- hazards, familias y recuperación de lesiones;
- reglas de reconversión posicional;
- retiro;
- implementación de gameplay.

Si un ejemplo anterior describe un delta global, una edad fija de pico, un
techo derivado de potencial o una única curva monotónica, prevalecen
[ADR-053](adr/053-development-and-aging-model.md) y esta especificación.

## 2. Unidad de evolución

### 2.1 Vector por capacidad

El desarrollo y el declive actúan sobre cada una de las veinte capabilities
canónicas de ADR-052. No existe `overallDelta`, `developmentOverall`,
`declineOverall` ni un equivalente causal.

Una misma ventana puede producir signos distintos por capacidad. Por ejemplo,
es válido que `pace` disminuya, `strength` no cambie, `passing` aumente y
`tacticalIntelligence` aumente. La correlación entre cambios no obliga a que
tengan el mismo signo o magnitud.

Para una ventana `Qn`, el resultado estructural es un vector completo:

```text
CapabilityEvolution(Qn) =
  capability -> signed integer delta
```

El estado canónico aplicado continúa siendo entero `0..10000`. G3C-2 fija
cálculo atómico en binary64 finito, evolución en espacio logit seguro y una
única cuantización `ROUND_HALF_EVEN` al persistir el resultado de la ventana.
No se permite redondeo, clamp de inputs ni acumulación fraccional implícitos.

### 2.2 Fronteras del dominio

`0` y `10000` son fronteras del dominio representable, no techos editoriales de
potencial. Para todo valor menor que `10000`, mejorar no queda bloqueado por
haber alcanzado un supuesto potencial individual. Para todo valor mayor que
`0`, empeorar tampoco queda bloqueado por una fase editorial de carrera.

La imposibilidad de salir del dominio sí es una restricción lógica. El
procedimiento normativo usa la geometría del logit y cuantización explícita,
incluido el tratamiento exacto de `0` y `10000`, según
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md#3-espacio-de-cálculo-de-capabilities).
El `clampLogical` final solo protege el dominio de `sigmoid`; no es un cap
editorial ni una corrección silenciosa de una fórmula descalibrada.

## 3. Cadencia y orden causal

### 3.1 Evaluación por Q

La evolución de capabilities se evalúa en `Q1`, `Q2`, `Q3` y `Q4`. Cada ventana
produce su propio vector, lo aplica una vez y deja el nuevo
`TruePlayerState.capabilities` disponible para las ventanas posteriores.

No existe una segunda aplicación anual de esos mismos deltas. `SEASON_CLOSE`
puede consolidar historia, agregados y picos observados, pero no vuelve a
calcular el desarrollo ya consumido.

### 3.2 Ubicación en el pipeline

`CAPABILITY_EVOLUTION(Qn)` es una suboperación lógica de
`CONSEQUENCES(Qn)` en el pipeline de ADR-042. No agrega una fase de temporada ni
una ventana de eventos.

Para cada Q:

1. se fija el snapshot de capabilities anterior al cambio;
2. se consumen únicamente hechos y estados ya confirmados para esa ventana,
   incluidos minutos, entorno y estado de salud autorizados;
3. se resuelven las contribuciones causales y el vector completo;
4. se valida el resultado completo;
5. se aplica el vector atómicamente;
6. se registra evidencia auditable y el estado actualizado;
7. las ventanas de eventos posteriores y el siguiente Q observan el nuevo
   estado.

Ningún cálculo puede leer resultados de una ventana futura ni reescribir una
capability usada por una ventana ya cerrada. Si la futura implementación hace
la suboperación direccionable mediante `operationKey`, debe reanudarse después
de ella sin consumir de nuevo sus streams.

## 4. Descomposición causal auditable

Cada cambio por capability debe conservar, como mínimo, causas distinguibles
equivalentes a:

- `maturationComponent`: deriva asociada al perfil de maduración y a la edad;
- `acquiredDevelopmentComponent`: conversión de experiencia, entrenamiento y
  entorno en aprendizaje;
- `wearComponent`: mantenimiento negativo o desgaste acumulado;
- `stochasticComponent`: innovación aleatoria determinista no explicada por
  las tres anteriores.

G3C-2 decide la combinación aditiva en espacio logit:

```text
deltaZ = maturation + acquired - wear + familyShock + specificShock
```

Se conservan estas condiciones:

- las cuatro causas no se mezclen de manera irreversible antes de la auditoría;
- una variable no se cuente dos veces a través de proxies;
- el resultado por capability pueda explicarse desde inputs, parámetros,
  streams y contribuciones;
- el vector completo se valide y aplique de forma atómica.

`developmentDelta` es el resultado neto firmado por capability, no un quinto
mecanismo causal ni un overall.

## 5. Familias de maduración

Cada capability tiene una familia primaria para seleccionar parámetros de
maduración. La asignación inicial es:

| Familia | Capabilities |
|---|---|
| `EXPLOSIVE_PHYSICAL` | `acceleration`, `pace`, `agility` |
| `STRUCTURAL_PHYSICAL` | `strength`, `stamina` |
| `TECHNICAL` | `finishing`, `passing`, `ballControl`, `dribbling`, `defending`, `goalkeeping` |
| `MENTAL` | `composure`, `vision`, `decisionMaking`, `positioning`, `workRate` |
| `TACTICAL` | `attackingMovement`, `defensiveAwareness`, `pressing`, `tacticalIntelligence` |

La familia es una clave de parametrización, no una macrocapability, una clase de
jugador ni una obligación de trayectoria común. Los factores compartidos,
correlaciones, sensibilidad individual y contexto pueden producir excepciones
dentro de cada familia. La familia no reemplaza el valor ni el delta de cada
capability.

Cambiar la asignación o su semántica afecta resultados deterministas y requiere
versionar la configuración participante del replay.

## 6. Perfil latente de maduración

El estado verdadero puede contener o derivar un perfil latente blando que
parametrice, como mínimo:

- inicio o desplazamiento temporal;
- velocidad de maduración;
- tendencia a estabilización;
- sensibilidad al declive.

No se almacena una `peakAge` garantizada. El perfil puede depender de traits y
parámetros generados, pero no constituye un arquetipo rígido ni impide
trayectorias compatibles con el dominio.

Edad y perfil modifican distribuciones; no disparan reglas deterministas como
`age >= X => decline`. En cualquier edad compatible, un delta por capability
puede ser positivo, cero o negativo según estado, contexto y azar. G3C-2 fija
un perfil jerárquico Normal con `shiftYears`, `tempo` y
`declineSensitivity`, y una ventana suave
`4*sigmoid(u)*(1-sigmoid(u))`; quedan pendientes sus valores calibrados, no la
familia matemática.

## 7. Potencial sin hard cap

El potencial es la distribución condicional de trayectorias futuras por
capability dadas las capacidades actuales, traits, perfil de maduración,
entorno, oportunidades, decisiones, salud y azar. No es un campo causal ni un
destino.

En particular:

- no existe `finishingPotential`, otro ceiling individual ni
  `potentialOverall`;
- `naturalTalent` cambia la predisposición a poseer o desarrollar capacidades
  extraordinarias;
- `developmentCapacity` cambia la conversión futura de experiencia y entorno
  en mejora;
- un jugador adelantado de joven puede progresar poco después;
- un jugador inicialmente menos destacado puede desarrollar de forma
  excepcional;
- una estimación de potencial pertenece a `PlayerKnowledge`, no al estado
  verdadero.

La cercanía a un extremo reduce de forma progresiva el cambio visible mediante
la geometría de `sigmoid` aplicada al delta latente. No existe una función de
ceiling personal: todo valor persistido menor que `10000` conserva una región
de draws con mejora representable.

## 8. Desarrollo adquirido

El componente adquirido debe admitir como inputs separados:

- `actualMinutes` y experiencia confirmados;
- `developmentQuality` del club;
- `managerQuality`;
- contexto de entrenamiento futuro;
- rol y contexto deportivo;
- `developmentCapacity`;
- `professionalism`;
- otros hechos causales autorizados.

La relación entre minutos y experiencia es no lineal y parametrizable. Debe
representar menor oportunidad por falta de exposición, beneficio de experiencia
y rendimientos decrecientes. No implica que más minutos siempre produzcan un
delta neto mayor: carga, fatiga, salud y desgaste pueden operar por otras rutas.

El bloque Role & Minutes debe producir exposición confirmada conforme a
[ADR-054](adr/054-role-and-minutes-model.md); este bloque no genera minutos.
`expectedMinutes` y `SportingRole` no equivalen a experiencia realizada. El
modelo de club debe producir `developmentQuality` y `managerQuality`; este
bloque no define sus escalas. Ningún club, entrenador, rol o cantidad de minutos
garantiza una mejora positiva.

ADR-022 y
[`CLUB_COMPETITION_WORLD_SPEC.md`](CLUB_COMPETITION_WORLD_SPEC.md) fijan que
esos inputs pertenecen a `ClubState`/`ManagerContext`, junto con identidad de
contexto y vigencia causal. Development consume el snapshot confirmado de Q;
un cambio de manager o club no modifica deltas ya aplicados. Prestigio,
`financialPower` y overall derivado no sustituyen automáticamente calidad de
desarrollo.

Performance puede entregar señales de experiencia/rendimiento, exposición,
contexto y fuerza de evidencia conforme a
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md#14-interfaces-salientes).
Development no usa `ObservedProduction` como causa única ni modifica
capabilities desde el módulo Performance. La ecuación inicial de G3C-2 consume
minutos confirmados mediante la señal de experiencia y no incorpora
`ObservedProduction` como predictor directo; habilitar otra señal de
Performance exige una causa no duplicada y parámetros versionados.

`professionalism` es un modificador probabilístico de aprovechamiento,
regularidad, recuperación y mantenimiento. No determina éxito o fracaso de
forma binaria.

## 9. Desgaste, salud y longevidad

`wearComponent` debe admitir edad, carga acumulada, salud, historial,
`longevity` y contexto. No existe un declive global ni uniforme: cada
capability y familia puede seguir una trayectoria diferente.

Cuando la carga se derive de participación, solo puede usar `actualMinutes` y
exposición ya confirmados. La oportunidad, expectativa o etiqueta de rol no
constituyen carga física. Health es propietario de la transformación exacta
entre exposición, fatiga y riesgo.

`longevity` modifica probabilísticamente mantenimiento, desgaste, velocidad de
declive y respuesta a edades avanzadas. No define edad máxima, retiro ni una
fecha de inicio obligatoria del declive.

Una lesión no escribe directamente un cambio permanente rígido sobre una
capability. La única secuencia permitida es:

```text
health event
  -> injury state
  -> recovery
  -> possible sequela
  -> capability/development consequences
```

El sistema de Health determina lesión, recuperación, recaída y secuela conforme
a [`HEALTH_INJURY_SPEC.md`](HEALTH_INJURY_SPEC.md) y su cierre matemático
[`HEALTH_INJURY_RECOVERY_MATH_SPEC.md`](HEALTH_INJURY_RECOVERY_MATH_SPEC.md).
Development recibe:

- `LoadState` y exposición realizada;
- inactividad/recuperación confirmadas;
- estado físico autorizado;
- un `SequelaProfile` `NONE`, `TEMPORARY` o `PERSISTENT`;
- referencia al episodio causal.

Solo una secuela o estado de salud confirmado puede entrar como causa de
evolución. Una misma lesión puede tener desenlaces diferentes. Health no crea
el vector de deltas ni el aplica a capabilities; Development conserva ese
ownership dentro de `CAPABILITY_EVOLUTION(Qn)`.

G3C-5 fija `sequelaBurden[i,q]` como composición acotada de burden activo y
affinity versionado entre `InjuryFamily` y capability family. Ese signal entra
en el término de wear ya definido por G3C-2; no es un delta de capability.

G3C-10 y
[`RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md`](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
fijan la policy durante retiro deportivo con Career abierta: maturation,
wear y shocks continúan; experience y DevelopmentEnvironment de
club/manager/training son cero; `inactivitySignal=1` entra en wear mediante
`wearInactivityWeight[f]`. No se congelan ni borran capabilities y no existe
forced decline. Al volver, se usan inputs reales desde el siguiente boundary
habilitado. `CareerFinalizationConfirmed` sí detiene futuras operaciones de
Development para esa Career.

Una consecuencia `TEMPORARY` puede afectar contexto/wear mientras permanezca
vigente; `PERSISTENT` no implica automáticamente un delta ni una magnitud fija.
El catálogo, hazard, mapping matemático y magnitudes permanecen en DR-053/057.

## 10. Trayectorias y picos observados

El proceso debe admitir trayectorias no monotónicas, entre ellas:

```text
development -> plateau -> decline -> resurgence
```

Declinar en una ventana no crea un estado absorbente ni hace imposible una
mejora posterior.

Los picos son retrospectivos y derivados:

- `capability peak`: máximo observado de una capability en la historia cerrada;
- `physical peak`: máximo de un agregado físico derivado aún por definir;
- `performance peak`: máximo según el modelo de Performance pendiente;
- `career peak`: máximo según una evaluación histórica pendiente.

Pueden ocurrir en ventanas o temporadas diferentes. No se persiste un único
`peak` causal. Una implementación puede materializar un índice derivado para
consulta, siempre reconstruible desde facts/snapshots compatibles y sin
convertirlo en input causal.

## 11. Reconversión posicional

Development & Aging no altera capacidades con el objetivo editorial de
justificar una posición. La evolución real del perfil puede cambiar la
probabilidad de una reconversión, pero la reconversión debe considerar además
contexto, decisiones y uso efectivo conforme a ADR-044.

G3C-2 define logistic/softmax para opportunity/candidate/completion y limita el
vertical slice a `GK`, `CM` y `ST`. Las demás posiciones quedan
`CONTENT_DISABLED`; DR-048 queda resuelta. Coeficientes y targets de
retraining permanecen en calibración.

## 12. Estado, auditoría y hechos

El contrato futuro debe distinguir:

- snapshot previo de capabilities;
- inputs confirmados y referencias causales;
- familia y perfil aplicables;
- contribuciones causales por capability;
- delta neto validado por capability;
- snapshot posterior;
- identidad determinista de temporada, Q y operación;
- versiones y parámetros participantes;
- referencias de streams consumidos.

No todo valor intermedio tiene que convertirse en un hecho de dominio. El
nombre, payload definitivo, idempotencia y relación entre traza de cálculo,
snapshot y `PlayerDeveloped` pertenecen a DR-063.

**Cierre G3B Bloque 10:** DR-063 adopta
`PlayerCapabilitiesChanged` como fact canónico. Conserva deltas por capability,
snapshots/hash previo/posterior, componentes causales, Q, references y
versiones. `PlayerDeveloped`/`DevelopmentApplied` son aliases legacy y no se
emiten. La descomposición intermedia permanece como `InternalEngineSignal`.

Las señales recibidas de Performance referencian un summary cerrado; no se
copian como segunda producción ni se transforman en development facts por sí
solas.

## 13. Invariantes

1. Solo el sistema de evolución autorizado muta capabilities.
2. Cada mutación es por capability, por Q, trazable y atómica.
3. Una ventana posterior ve los cambios confirmados de las anteriores.
4. No se reaplica en `SEASON_CLOSE` un delta ya aplicado.
5. Un estado dinámico no escribe capabilities sin pasar por evolución.
6. No existen overall delta, potential overall, ceiling individual ni peak age
   causal.
7. Edad, traits, minutos, entorno y salud modifican distribuciones; no
   garantizan el signo del delta.
8. Las familias seleccionan parámetros, pero no sustituyen capabilities.
9. Una lesión solo puede afectar permanentemente tras el pipeline de
   recuperación y posible secuela.
10. No hay estado absorbente de declive ni edad universal de inicio.
11. Las fronteras `0..10000` se respetan sin clamp o redondeo implícito.
12. Todo azar usa streams deterministas versionados.

## 14. Parameter Registry Candidates

Los siguientes valores deben vivir en configuración versionada y no quedar
hardcoded:

- curvas de maduración por familia;
- sensibilidad a edad;
- resistencia a extremos superior e inferior;
- dispersión estocástica;
- curva minutos/experiencia y sus rendimientos decrecientes;
- efecto de `developmentQuality`;
- efecto de `managerQuality`;
- influencia de desarrollo, estabilidad y transición de `ManagerContext`;
- efecto de `professionalism`;
- efecto de `developmentCapacity`;
- efecto de `naturalTalent`;
- curva de desgaste;
- efecto de `longevity`;
- efectos de recuperación y secuelas sobre desarrollo;
- mapping de `LoadState`, inactividad y `SequelaProfile` a componentes de
  evolución, sin doble contar minutos;
- diferencias y correlaciones entre familias;
- parámetros y distribución conjunta del perfil de maduración;
- correlación de innovaciones compartidas e idiosincráticas;
- interacciones entre componentes causales;
- precisión intermedia, acumulación y cuantización explícita;
- parámetros de contexto de entrenamiento, rol y entorno;
- calibración de soporte, colas y trayectorias no monotónicas.
- mapping de señales de Performance a experiencia/desarrollo, sin doble
  contabilización de minutos y producción.

## 15. Decisiones todavía abiertas

El contrato matemático está cerrado y DR-053 pasa a `PARTIAL_CALIBRATION`.
Permanecen:

- valores del ParameterSet inicial;
- rangos/targets Monte Carlo;
- expected outputs completos de golden vectors;
- evidence/provenance de calibración;
- señales cuantitativas de módulos upstream.

Dependencias externas aún abiertas:

- G3B-C05/DR-054: estructura fijada por ADR-054; faltan generación matemática,
  precisión, streams, parámetros y fixtures de rol/minutos;
- G3B-E01 y G3B-E07/DR-057: estructura aceptada por ADR-057; faltan dinámica,
  hazard, distribuciones, mapping de secuelas, precisión, streams y fixtures;
- G3B-F01/DR-022: representación, dominios y equations del entorno cerrados
  por ADR-075; faltan values, targets, data y goldens;
- G3B-B06: coeficientes/targets de reconversión; DR-048 está resuelta;
- G3B-D01/D02/DR-055: A06 y la interfaz estructural de Performance quedaron
  cerradas por ADR-055; faltan funciones, escalas, parámetros y evidencia
  ejecutable para Development;
- DR-063: facts y traza ejecutable de evolución.

Ninguna de estas aperturas autoriza valores provisionales hardcoded.

## 16. Cierre matemático G3C-2

La especificación ejecutable normativa adopta:

- logit seguro con `0 < ε <= 1/(2*10000)`;
- ventana de maduración `4*sigmoid(u)*(1-sigmoid(u))`;
- `PlayerMaturationProfile` jerárquico por familia;
- acquired y wear mediante predictors aditivos + softplus;
- experience `-expm1(-k*m)`;
- DevelopmentEnvironment convexo;
- shocks Normal compartidos por familia y específicos por capability;
- cuantización `ROUND_HALF_EVEN` una vez por transición;
- soporte de ambos signos a toda edad finita;
- ausencia de mean reversion, peakAge y personal ceilings.

La tabla exhaustiva de parámetros, targets y fixtures está en
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md).
