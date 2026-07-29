# ADR-053: Estructura de desarrollo y envejecimiento

- **Estado:** Aceptado — alcance estructural; interfaz Health aclarada por ADR-057; DR-053 permanece parcialmente abierta
- **Fecha:** 2026-07-27
- **Decisión relacionada:** DR-053
- **Especificación normativa:** [`../DEVELOPMENT_AGING_SPEC.md`](../DEVELOPMENT_AGING_SPEC.md)

## Contexto

ADR-052 definió las capabilities individuales, los traits y la ausencia de un
overall o potencial causal. Faltaba decidir la unidad de cambio, la cadencia, la
relación con Q1–Q4 y las fronteras entre maduración, experiencia, desgaste,
salud y reconversión.

`MASTER_SPEC v0.8` contiene descripciones por etapa vital y ejemplos anuales.
ADR-042 ya exige causalidad por ventanas. Sin un refinamiento, una
implementación podía introducir un delta global, una edad fija de pico, una
aplicación anual duplicada o lesiones que escribieran capacidades de forma
directa.

Las funciones, distribuciones y parámetros de balance todavía no están
aprobados. Este ADR cierra la arquitectura matemática necesaria para que puedan
elegirse después sin cambiar la semántica del estado.

## Decisión

### Evolución por capability y por Q

Desarrollo y declive producen un delta independiente para cada capability
canónica en `Q1`, `Q2`, `Q3` y `Q4`. No existe un delta de overall.

El vector completo se resuelve en una suboperación lógica
`CAPABILITY_EVOLUTION(Qn)` dentro de `CONSEQUENCES(Qn)`, se valida y se aplica
atómicamente. El nuevo estado verdadero participa en las ventanas siguientes.
`SEASON_CLOSE` consolida historia, pero no reaplica deltas.

La suboperación no crea una nueva fase de `SimulationCursor`. Si se representa
mediante una `operationKey`, la reanudación debe quedar después de la operación
sin repetir streams ni efectos.

### Causas distinguibles

La traza debe distinguir contribuciones equivalentes a:

- `maturationComponent`;
- `acquiredDevelopmentComponent`;
- `wearComponent`;
- `stochasticComponent`.

No se decide aún si se combinan de forma aditiva, multiplicativa o jerárquica.
La alternativa elegida deberá conservar auditabilidad y evitar doble conteo.

### Familias de maduración

Las capabilities se asignan inicialmente a:

- `EXPLOSIVE_PHYSICAL`: `acceleration`, `pace`, `agility`;
- `STRUCTURAL_PHYSICAL`: `strength`, `stamina`;
- `TECHNICAL`: `finishing`, `passing`, `ballControl`, `dribbling`, `defending`,
  `goalkeeping`;
- `MENTAL`: `composure`, `vision`, `decisionMaking`, `positioning`, `workRate`;
- `TACTICAL`: `attackingMovement`, `defensiveAwareness`, `pressing`,
  `tacticalIntelligence`.

La familia solo selecciona parametrización. No es una macrocapability, una
clase rígida ni una obligación de compartir signo o curva.

### Maduración, edad y extremos

No existe `peakAge` determinista. Un perfil latente blando parametriza inicio,
velocidad, estabilización y sensibilidad al declive. Edad y perfil modifican
distribuciones, nunca activan automáticamente crecimiento o declive.

No existen ceilings por capability derivados de potencial. La resistencia a
mejorar cerca de `10000` —y el comportamiento análogo cerca de `0`— debe
expresarse mediante una función externalizada. Un valor menor que `10000` no
queda imposibilitado de mejorar por un techo individual editorial.

### Traits y entorno

`naturalTalent` representa predisposición innata a capacidades
extraordinarias; `developmentCapacity`, capacidad de convertir experiencia y
entorno en mejora futura. Son causas distintas y admiten cualquier combinación
del dominio.

Minutos, calidad de desarrollo, entrenador, entrenamiento, rol y contexto
pueden alimentar el componente adquirido. La relación minutos/experiencia será
no lineal y parametrizable. Más minutos no garantizan un delta neto mayor.

`professionalism` modifica probabilísticamente aprovechamiento, regularidad,
recuperación y mantenimiento; no es una condición binaria.

### Wear, salud y longevidad

El desgaste puede depender de edad, carga, salud, historial, `longevity` y
contexto. Sus efectos no son uniformes entre capabilities o familias.
`longevity` modifica probabilidades de mantenimiento y declive, pero no impone
edad máxima ni retiro.

Una lesión no escribe directamente una pérdida permanente rígida. El único
límite causal aceptado es:

```text
health event -> injury state -> recovery -> possible sequela
  -> capability/development consequences
```

Health es propietario del hazard, la recuperación, la recaída y el
`SequelaProfile` conforme a ADR-057. Development consume únicamente carga,
estado o secuelas ya confirmados y conserva ownership de cualquier delta de
capability.

### Trayectorias, picos y reconversión

El proceso debe admitir deltas positivos, nulos y negativos a cualquier edad
compatible y trayectorias no monotónicas, incluso resurgimientos posteriores a
un declive.

Los picos de capability, físico, performance y carrera son propiedades
retrospectivas derivadas y pueden ocurrir en momentos diferentes. No existe un
pico universal causal.

Development no altera artificialmente capacidades para justificar una
reconversión. La evolución del perfil puede cambiar su probabilidad, pero
matriz, evidencia, duración y alcance siguen bajo ADR-044, DR-048 y G3B-B06.

### Parámetros y versionado

Curvas, distribuciones, coeficientes, resistencias, dispersiones, interacciones,
correlaciones, precisión, cuantización y calibración se cargan desde
configuración versionada. Ninguno queda fijado por este ADR.

Todo cambio que altere resultados deterministas debe actualizar
`engineVersion` u otra versión participante del replay conforme a ADR-015.

## Alternativas rechazadas

1. **Delta global de overall:** elimina trayectorias diferenciadas y reintroduce
   un overall causal.
2. **Aplicación anual única o duplicada:** impide causalidad entre Q o cuenta
   dos veces la exposición.
3. **Curva universal por edad:** convierte maduración y declive en destinos.
4. **Peak age individual garantizada:** confunde parámetro latente con resultado.
5. **Ceilings derivados de potencial:** vuelve imposible una mejora que el
   dominio considera posible.
6. **Capabilities agrupadas como única unidad de cambio:** impide que miembros
   de una familia evolucionen en sentidos distintos.
7. **Más minutos implica siempre más desarrollo:** ignora rendimientos
   decrecientes, carga, salud y desgaste.
8. **Lesión que escribe una pérdida permanente directa:** omite recuperación y
   desenlaces diferentes.
9. **Declive como estado absorbente:** impide plateaus y resurgimientos.
10. **Ajustar capacidades para forzar una reconversión:** invierte la causalidad
    de ADR-044.
11. **Valores provisionales hardcoded:** convertiría balance pendiente en regla
    normativa accidental.

## Consecuencias

### Positivas

- desarrollo, maduración y declive comparten una unidad causal precisa;
- Q1–Q4 conserva causalidad y replay sin reescrituras;
- los cambios son auditables por capability y causa;
- el modelo admite perfiles tempranos, tardíos y no monotónicos;
- Health, Role & Minutes, Club y Reconversión conservan fronteras claras;
- la calibración puede evolucionar sin migrar el modelo fundamental.

### Costes y restricciones

- la configuración deberá cubrir familias, perfil latente y componentes;
- el motor necesitará una política explícita de precisión y cuantización antes
  de implementar gameplay;
- los tests deberán verificar vectores completos, causalidad temporal,
  independencia de streams y ausencia de doble aplicación;
- no puede implementarse la fórmula hasta resolver las partes matemáticas
  restantes de DR-053 y sus dependencias.

## Impacto en decisiones pendientes

- G3B-B01 queda resuelta.
- G3B-B02 a G3B-B06 quedan estructuralmente restringidas pero parcialmente
  abiertas en fórmulas o dependencias externas.
- G3B-A06 queda cerrada respecto del potencial como trayectoria por capability;
  su proyección de calidad efectiva depende de Performance.
- DR-054 debe producir minutos/exposición confirmados.
- DR-057 debe producir salud, recuperación y secuelas confirmadas.
- DR-022 debe definir escalas de `developmentQuality` y `managerQuality`.
- DR-048 conserva matriz y alcance de reconversión.
- DR-063/ADR-010 ya conservan el nombre `PlayerCapabilitiesChanged`, su
  identidad y payload semántico mínimo; el schema concreto debe conformarse a
  ese contrato.

DR-053 no se marca resuelta: todavía requiere funciones, distribuciones,
covarianza, precisión, parámetros, streams y fixtures aprobados.

## Gates y tests requeridos

Antes de implementar Development & Aging:

1. existe un vector por las veinte capabilities para cada Q;
2. el vector se aplica una sola vez y de forma atómica;
3. Qn+1 consume el estado confirmado de Qn;
4. las cuatro causas son distinguibles en la traza;
5. la asignación de familias es total y no duplica capabilities;
6. no existen `overallDelta`, ceilings de potencial ni `peakAge` causal;
7. tests cubren deltas con signos diferentes dentro de una ventana;
8. tests cubren jugador joven con delta negativo y veterano con delta positivo;
9. tests cubren plateau, declive y resurgimiento;
10. lesiones solo afectan permanentemente tras una secuela confirmada;
11. la reanudación no repite evolución ni consumo de streams;
12. fronteras `0..10000` se conservan sin clamp o redondeo implícito;
13. parámetros, precisión y streams están versionados;
14. property tests y Monte Carlo cumplen soporte, estabilidad y tolerancias
    aprobadas.
