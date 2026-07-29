# ADR-052: Modelo fundamental del jugador

- **Estado:** Aceptado
- **Fecha:** 2026-07-27
- **Decisión relacionada:** DR-052
- **Especificación normativa:** [`../PLAYER_MODEL_SPEC.md`](../PLAYER_MODEL_SPEC.md)

## Contexto

G3A identificó que el motor matemático no podía diseñarse sobre un `overall`
causal ni sobre una lista abierta de atributos. También era necesario separar
estado real, percepción de observadores, predisposiciones persistentes y estados
transitorios.

`MASTER_SPEC v0.8` contiene ejemplos previos con escala 0–100 y referencias
genéricas a potencial. Esta decisión los refina para evitar pérdida de precisión,
conocimiento omnisciente y acoplamiento accidental entre rendimiento temporal y
desarrollo permanente.

## Decisión

### Escala y catálogo de capacidades

Las capacidades usan internamente enteros entre 0 y 10000, inclusive. La UI
puede proyectarlas a otras escalas sin convertir la proyección en estado causal
ni revelar necesariamente el valor verdadero.

Valores fraccionarios, no finitos o fuera del dominio se rechazan; no se
clampan ni redondean implícitamente. El redondeo de presentación no vuelve al
estado verdadero ni participa de su hash.

Todos los jugadores poseen estas veinte capacidades:

- `TECHNICAL`: `finishing`, `passing`, `ballControl`, `dribbling`, `defending`,
  `goalkeeping`;
- `PHYSICAL`: `acceleration`, `pace`, `strength`, `stamina`, `agility`;
- `MENTAL`: `composure`, `vision`, `decisionMaking`, `positioning`, `workRate`;
- `TACTICAL`: `attackingMovement`, `defensiveAwareness`, `pressing`,
  `tacticalIntelligence`.

No se almacena un `overall` causal. Los ratings, overalls percibidos y agregados
de presentación son derivados.

### Clases de variables

El estado mecánico separa:

- `CAPABILITIES`: cambian lentamente mediante desarrollo o declive;
- `TRAITS`: predisposiciones persistentes o lentamente mutables;
- `DYNAMIC_STATES`: responden a ventanas, temporadas y contexto.

Una fluctuación de rendimiento no modifica directamente una capacidad
permanente.

Los traits iniciales son `naturalTalent`, `developmentCapacity`,
`professionalism`, `ambition`, `consistency`, `adaptability`,
`pressureResistance`, `injuryFragility`, `recoveryCapacity` y `longevity`.
Usan enteros `0..10000`; sus distribuciones no se fijan en este ADR.

Los estados dinámicos deberán admitir al menos `form`, `confidence`, `fitness`,
`fatigue`, `morale` y `managerTrust`. Sus dominios y dinámicas pertenecen a
decisiones posteriores. `fitness` permanece separado de las capacidades físicas.

### Potencial, maduración y capacidad efectiva

No existe un `potentialOverall` verdadero. El potencial emerge de capacidades,
traits, maduración, longevidad, entorno, oportunidades, decisiones, salud y azar
determinista.

No se persiste una edad de pico garantizada. Variables latentes de maduración
podrán parametrizar una distribución; el pico observado surge de la simulación.

La capacidad efectiva usada en un contexto se deriva de capacidad verdadera,
estado dinámico y contexto. No se almacena como atributo permanente.

### Estado verdadero y conocimiento

`TruePlayerState` contiene el estado mecánico real.

`PlayerKnowledge` contiene estimaciones propias de un observador, su
incertidumbre o confianza, el punto de simulación y el contexto de observación.
Distintos observadores pueden evaluar de manera diferente al mismo jugador. El
usuario no obtiene acceso implícito a capacidades o traits verdaderos.

### Generación y creación

La generación inicial usa un perfil latente y distribuciones conjuntas
correlacionadas para producir capabilities y traits. Los arquetipos son perfiles
estadísticos o componentes de mezcla, no clases rígidas. Todo perfil compatible
con el dominio conserva probabilidad positiva.

`Creation Budget` expresa poder inicial esperado y equivalencia estadística, no
una suma trivial de atributos. Valores, costes, correlaciones y protocolo Monte
Carlo quedan en configuración versionada y no se fijan aquí.

### Versionado

La primera implementación del Player Model comienza en `0..10000`; no existe
persistencia oficial anterior de atributos 0–100 que requiera migración. Todo
cambio futuro de catálogo, dominio o significado revisa `schemaVersion` y las
versiones participantes del replay según ADR-015. La compatibilidad requiere un
mapper semántico explícito; una proyección de UI no cuenta como migración.

## Alternativas rechazadas

1. **Escala canónica 0–100:** pierde resolución interna y confunde presentación
   con estado mecánico.
2. **Escala continua 0–1 como persistencia principal:** introduce
   representaciones floating-point innecesarias para un dominio discreto.
3. **Overall causal almacenado:** oculta causalidad, duplica fuentes de verdad y
   convierte el potencial en destino.
4. **Atributos diferentes según posición:** impide reconversiones coherentes y
   vuelve incomparables estados del mismo dominio.
5. **Potential overall o edad de pico garantizada:** transforma una trayectoria
   probabilística en una promesa determinista.
6. **Conocimiento del usuario idéntico al estado verdadero:** elimina
   incertidumbre y no admite observadores con información diferente.
7. **Generación uniforme e independiente:** destruye perfiles coherentes y
   correlaciones necesarias.
8. **Arquetipos rígidos:** introduce combinaciones imposibles por criterio
   editorial.
9. **Creation Budget como suma de atributos:** ignora relevancia, interacciones y
   ventajas ocultas.

## Consecuencias

### Positivas

- existe un único catálogo causal y preciso;
- posición, percepción y presentación quedan desacopladas;
- desarrollo y estados transitorios no compiten por la misma fuente de verdad;
- scouting y conocimiento imperfecto pueden incorporarse sin migrar el estado
  verdadero;
- creación rápida y personalizada pueden compararse por poder esperado.

### Costes y restricciones

- los modelos posteriores deberán derivar agregados en vez de consumir un
  `overall`;
- la generación necesitará distribuciones correlacionadas versionadas;
- cambios futuros al catálogo o significado de capabilities/traits requieren
  revisar `schemaVersion` y las versiones participantes del replay;
- ninguna fórmula o distribución se considera resuelta por este ADR.

## Impacto en decisiones pendientes

DR-052 queda resuelta. DR-045, DR-053, DR-055, DR-056 y DR-057 reciben
restricciones estructurales, pero continúan abiertas hasta definir sus respectivas
funciones, distribuciones y parámetros.

## Gates y tests requeridos

Antes de implementar el modelo:

1. schemas rechazan valores no enteros o fuera de `0..10000`;
2. el catálogo contiene exactamente veinte capabilities y diez traits iniciales;
3. todos los jugadores conservan el catálogo completo sin depender de posición;
4. no existe `overall` ni `potentialOverall` como campo causal;
5. `TruePlayerState` y `PlayerKnowledge` son contratos diferentes;
6. estados dinámicos no pueden escribir capabilities directamente;
7. una capacidad efectiva se calcula y no se persiste como estado permanente;
8. generación correlacionada y `Creation Budget` consumen configuración
   versionada;
9. tests Monte Carlo verifican equivalencia antes de compartir leaderboard;
10. ningún valor de balance pendiente queda hardcoded en el modelo.
