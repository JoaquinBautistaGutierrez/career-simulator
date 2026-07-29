# ADR-019: Creation Budget y equivalencia entre modos

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-019
- Alcance: creación de jugador, balance y elegibilidad competitiva

## Contexto

Carrera rápida y Carrera personalizada solo pueden compartir un ranking si ninguna obtiene más poder inicial esperado. Permitir selección libre sin una restricción común haría incomparables las carreras.

Los valores numéricos todavía requieren especificación y validación estadística.

## Decisión

Se define `Creation Budget` como el presupuesto canónico de poder inicial. Toda ventaja inicial con efecto mecánico consume presupuesto o tiene un coste equivalente dentro de la misma función versionada.

### Carrera rápida

Distribuye el Creation Budget mediante generación probabilística. La seed, versiones y opciones de creación determinan la distribución reproducible.

### Carrera personalizada

Puede permitir que el usuario influya en la distribución, pero:

- no aumenta el presupuesto total;
- no agrega poder fuera de los componentes presupuestados;
- no cambia la distribución de poder esperada respecto del modo rápido;
- puede conservar componentes ocultos aleatorios para evitar configuraciones deterministas dominantes.

### Comparabilidad

Los modos solo pueden compartir un leaderboard cuando una validación Monte Carlo versionada demuestre equivalencia de la distribución de poder inicial y ausencia de una ventaja sistemática material según criterios previamente publicados.

Que dos configuraciones consuman el mismo total nominal es necesario, pero no suficiente: interacciones, correlaciones y opciones dominantes también deben evaluarse.

No se fijan aquí:

- total numérico;
- costes por atributo o rasgo;
- distribuciones;
- tolerancias estadísticas;
- tamaño de muestra;
- criterio de equivalencia.

Esos parámetros permanecen como decisión derivada antes de habilitar Carrera personalizada competitiva.

## Consecuencias

- `CreationBudget` es un contrato versionado, no un saldo de UI.
- El servidor o runtime autoritativo valida el presupuesto completo.
- Rasgos como `DominantFoot.BOTH` deben participar de la misma contabilidad.
- Carrera personalizada queda fuera del vertical slice inicial.
- Dos modos pueden usar interfaces distintas sin cambiar el espacio competitivo permitido.
- Un cambio de presupuesto o distribución que altere resultados requiere bump de una versión participante y nueva validación.

## Alternativas rechazadas

### Separar el balance por límites independientes sin presupuesto común

Rechazada porque permite combinaciones cuyo poder conjunto no está controlado.

### Permitir más puntos a Carrera personalizada

Rechazada porque impide compartir ranking.

### Considerar suficiente el mismo total nominal

Rechazada porque distintas distribuciones pueden tener diferente poder esperado.

### Eliminar todo azar de Carrera personalizada

Rechazada como requisito universal; variables ocultas pueden conservar aleatoriedad para equivalencia.

## Pruebas y evidencia requeridas

- Toda creación válida conserva el presupuesto total definido por su versión.
- Inputs del cliente no pueden crear componentes de poder sin coste.
- La generación rápida es reproducible por seed y versiones.
- La creación personalizada no supera el presupuesto bajo combinaciones de frontera.
- Monte Carlo compara distribuciones completas, no solo promedios.
- No se comparte leaderboard sin informe de equivalencia aprobado.
- Cambiar solo la interfaz de creación no modifica el presupuesto mecánico.

## Gate

Este ADR cierra el principio de equivalencia. DR-045 debe cerrar valores, costes, tolerancias y protocolo Monte Carlo antes de Carrera personalizada competitiva o leaderboard compartido.

## Referencias

- [ADR-018: Vertical slice inicial](./018-initial-vertical-slice.md)
- [ADR-023: DominantFoot.BOTH](./023-dominant-foot-both.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-019--equivalencia-de-carrera-rápida-y-personalizada)
- [DR-045: Parámetros de Creation Budget](../DECISIONS_REQUIRED.md#dr-045--parámetros-y-validación-del-creation-budget)
