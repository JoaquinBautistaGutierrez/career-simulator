# ADR-009: Rango canónico del Coeficiente de Contribución

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-009
- Alcance: dominio, producción estadística, scoring y balance

## Contexto

La especificación asignaba al Coeficiente de Contribución (`CC`) dos límites superiores incompatibles: `1.00` y `1.10`. También era necesario distinguir una contribución excepcional derivada del rendimiento de una bonificación editorial.

La fórmula matemática completa todavía depende de DR-008 y DR-010. Este ADR fija el dominio y la semántica del valor sin inventar esa fórmula.

## Decisión

El rango canónico es:

```text
0.00 <= CC <= 1.10
```

`CC` se deriva de participación y rendimiento confirmados. No es un input editable, una rareza narrativa ni una bonificación asignada manualmente.

La interpretación conceptual es:

| Intervalo | Interpretación |
|---|---|
| `0.00–0.20` | Contribución residual |
| `0.20–0.50` | Suplente |
| `0.50–0.80` | Rotación |
| `0.80–1.00` | Protagonista |
| `1.00–1.10` | Contribución excepcional |

Los nombres de los intervalos son explicativos. No crean categorías discretas, saltos en la fórmula ni bonificaciones automáticas.

Un valor superior a `1.00` solo puede surgir de los componentes matemáticos versionados de participación y rendimiento extraordinario. El contenido, la UI, el panel editorial y una decisión narrativa no pueden establecerlo ni incrementarlo directamente.

La especificación matemática de DR-008/DR-010 deberá fijar:

- inputs exactos;
- normalización por posición y contexto;
- fórmula;
- redondeo;
- precisión persistida;
- tratamiento de fases decisivas;
- relación con ScoreLedger.

Hasta entonces no se asignan pesos ni umbrales mecánicos adicionales.

## Consecuencias

- Los schemas pueden validar el rango `[0.00, 1.10]`, pero no calcular el valor.
- El motor debe conservar evidencia de participación y rendimiento que permita explicar el `CC`.
- Conforme a ADR-010, Scoring deriva `CC` por logro desde facts autorizados o
  desde una proyección pura compartida que DR-010 apruebe; `CC` no es un campo
  editable ni un fact puntuable emitido por Content.
- El tramo excepcional no constituye protección de rareza ni compensación editorial.
- Cambiar el rango o la fórmula requiere la versión participante correspondiente; si altera puntuación competitiva, también requiere nueva `scoringVersion`.

## Alternativas rechazadas

### Limitar `CC` a `1.00`

Rechazada porque elimina el tramo excepcional aceptado por la especificación.

### Aplicar una bonificación manual para superar `1.00`

Rechazada porque desvincula el coeficiente de participación y rendimiento.

### Cerrar una fórmula provisional

Rechazada porque DR-008 y DR-010 todavía no definen todos los inputs y normalizaciones.

### Convertir los intervalos conceptuales en clases rígidas

Rechazada porque los rótulos son explicativos y no una regla adicional de gameplay.

## Pruebas requeridas

- Se aceptan exactamente los valores del rango cerrado `[0.00, 1.10]`.
- Valores negativos, mayores que `1.10`, NaN e infinitos se rechazan.
- Los límites `0.00`, `1.00` y `1.10` realizan round-trip según el contrato numérico.
- Ningún efecto de contenido puede escribir `CC`.
- Ningún input del cliente oficial puede fijar `CC`.
- Fixtures futuros demuestran que todo valor superior a `1.00` se explica por participación y rendimiento extraordinarios.
- Los intervalos de presentación no alteran el valor mecánico.

## Gate

Este ADR cierra el rango y la semántica de DR-009. No habilita implementar la fórmula ni el ScoreLedger definitivo hasta cerrar DR-008 y DR-010.

## Referencias

- [ADR-007: Canonicalización y hashing](./007-canonicalization-and-hashing.md)
- [ADR-010: Domain Facts y ScoreLedger estructural](./010-scoring-ledger-and-domain-facts.md)
- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-009--coeficiente-de-contribución)
- [DR-008: Fórmulas faltantes](../DECISIONS_REQUIRED.md#dr-008--fórmulas-faltantes-del-simulador)
- [DR-010: Scoring incompleto](../DECISIONS_REQUIRED.md#dr-010--scoring-incompleto)
