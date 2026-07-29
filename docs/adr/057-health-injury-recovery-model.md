# ADR-057: Estructura de salud, lesiones y recuperación

- **Estado:** Aceptado — alcance estructural; DR-057 permanece parcialmente abierta
- **Fecha:** 2026-07-28
- **Decisión relacionada:** DR-057
- **Especificación normativa:** [`../HEALTH_INJURY_SPEC.md`](../HEALTH_INJURY_SPEC.md)
- **Aclara:** ADR-042, ADR-053, ADR-054 y ADR-055

## Contexto

ADR-042 fijó el orden `AVAILABILITY → PRODUCTION → HEALTH → CONSEQUENCES` por
Q, pero no separó los componentes del estado de salud ni definió el contrato
entre Health y Role & Minutes. La documentación posterior atribuía a Health un
`AvailabilityEnvelope` que mezclaba lesiones, suspensiones y otras causas,
aunque Health no es owner de disciplina.

También faltaba distinguir una ocurrencia de lesión de su estado persistente,
permitir recuperación parcial y condiciones concurrentes, y preservar la
frontera por la cual una secuela puede llegar a Development sin que Health
edite capabilities.

Las fórmulas, distribuciones, escalas, precisión y parámetros todavía no están
aprobados. Este ADR fija la estructura sin inventarlos.

## Decisión

### Estado de salud compuesto

Health separa:

- `fitness`;
- `fatigue`;
- `LoadState`;
- condiciones activas;
- `InjuryEpisode`;
- estado de recuperación;
- secuelas;
- historia/resumen causal.

`fitness` y `fatigue` son Dynamic States acotados, no capabilities. Los traits
`injuryFragility`, `recoveryCapacity` y `longevity` permanecen separados entre
sí y de `medicalQuality`, que pertenece al entorno.

### Disponibilidad

Health produce `MedicalAvailabilityEnvelope` por contexto/Q con:

- `availabilityShare` en `[0,1]`;
- indisponibilidad médica conocida;
- restricciones;
- razones médicas;
- incertidumbre cuando corresponda;
- referencia al estado causal.

No asigna rol ni minutos. Suspensiones y otras causas no médicas no pertenecen
a este envelope.

Una agregación autoritativa posterior construye `AvailabilityEnvelope` desde el
componente médico y otras fuentes tipadas. Role & Minutes consume el aggregate.
El owner de disciplina y la función de composición permanecen en DR-064 y
DR-054; no se resuelven por inferencia.

### Exposición, carga y hazard

El modelo admite exposición competitiva, entrenamiento/background,
no futbolística y causas externas. `actualMinutes` es la señal competitiva
principal, pero no toda la exposición posible.

La ocurrencia se modela mediante hazard contextual que puede depender de carga,
fatigue, fitness, edad, fragilidad, historial, contexto médico, posición,
origen y azar determinista. Las oportunidades son tipadas, ordenables y
auditables.

No existen máximos de lesiones, cuotas, cooldowns, inmunidad de recaída ni un
único `currentInjury`. Cero minutos no fuerza hazard total cero.

### Episodio y taxonomía

`InjuryOccurred` es un hecho de ocurrencia. `InjuryEpisode` mantiene identidad
causal persistente con familia, severidad, origen, onset agregado, recuperación,
restricciones y relaciones con episodios previos.

`InjuryFamily`, severidad y origen son dimensiones separadas. La taxonomía
mecánica es extensible y se mapea a contenido; las seis lesiones concretas del
slice siguen pendientes.

Se permiten múltiples condiciones simultáneas cuando sean lógicamente
compatibles. Identidad e idempotencia evitan duplicar un episodio.

### Recuperación, recaída y secuela

Recuperación esperada y realizada son conceptos diferentes. El proceso agregado
debe representar estados equivalentes a:

```text
INJURED -> REHABILITATION -> LIMITED_RETURN -> FULLY_AVAILABLE
```

Una recaída/agravamiento conserva una relación causal con el episodio previo y
no depende de cooldown editorial.

Health confirma secuelas `NONE`, `TEMPORARY` o `PERSISTENT`. No escribe
capabilities. Development & Aging es el único owner de consecuencias
permanentes sobre capabilities, mediante su operación de evolución por Q.

### Causalidad Q

Este ADR no modifica las 38 operaciones canónicas:

1. `AVAILABILITY(Qn)`: Health produce disponibilidad médica desde el estado ya
   confirmado; el aggregate se construye y Role & Minutes resuelve expectativa.
2. `PRODUCTION(Qn)`: se confirman minutos y Performance; se producen señales de
   carga/intensidad.
3. `HEALTH(Qn)`: Health consume exposición realizada y resuelve carga,
   recuperación, recaída y nuevas lesiones.
4. `CONSEQUENCES(Qn)`: se aplican estados, restricciones y secuelas para la
   ventana siguiente.

Una lesión de `HEALTH(Qn)` no modifica Qn. Empieza a afectar Qn+1. No se
inventa precisión diaria ni un partido dentro de Q.

Un evento externo emite una causa autorizada; Health procesa la consecuencia
en el siguiente límite causal válido. No se duplica dentro del hazard deportivo
y su presentación cumple ADR-012.

## Alternativas rechazadas

1. **Un único health/readiness score:** oculta carga, condición, recuperación y
   causa.
2. **Health como owner de suspensiones:** mezcla medicina con disciplina.
3. **Disponibilidad binaria:** impide retorno limitado y ausencias parciales.
4. **Porcentaje fijo de lesión en Player:** ignora exposición y estado.
5. **Minutos como única exposición:** elimina entrenamiento y causas externas.
6. **Una lesión por temporada o cooldown:** introduce límites editoriales.
7. **`currentInjury` único:** impide condiciones concurrentes.
8. **Duración fija por familia:** elimina incertidumbre y contexto.
9. **`injuredUntil` como recuperación completa:** no modela rehabilitación ni
   retorno limitado.
10. **Recaída sin episodio padre:** pierde causalidad y auditabilidad.
11. **Lesión que resta capabilities al ocurrir:** invade Development y omite
    recuperación/secuela.
12. **Evento catastrófico dentro del hazard deportivo:** duplica la causa y
    rompe equivalencia narrativa.
13. **Lesión de Qn reduciendo retrospectivamente Qn:** contradice ADR-042.
14. **Coeficientes provisionales hardcoded:** transforma balance pendiente en
    regla normativa.

## Consecuencias

### Positivas

- G3B-E01 queda estructuralmente resuelta;
- E02 a E07 poseen fronteras y semánticas ejecutables sin fijar matemática;
- Health, Role & Minutes, Performance y Development tienen ownership explícito;
- disponibilidad parcial, múltiples condiciones y recaídas quedan soportadas;
- replay puede reconstruir oportunidad, exposición, episodio y consecuencias;
- los eventos sensibles conservan equivalencia competitiva.

### Costes y restricciones

- DR-064 debe cerrar disciplina y composición de disponibilidad;
- DR-021/022 deben entregar calendario, exposición y `medicalQuality`;
- DR-063/ADR-010 ya fijan facts, identidad e idempotencia; faltan schemas
  concretos conformes;
- el engine necesitará orden de oportunidades y streams versionados;
- el catálogo de seis lesiones requiere contenido y calibración médica;
- DR-057 sigue bloqueando gameplay hasta aprobar matemática y fixtures.

## Impacto en decisiones pendientes

- DR-042 no se reabre: su orden temporal queda confirmado.
- DR-053 consume carga, inactividad y secuelas confirmadas sin permitir
  escrituras directas de Health.
- DR-054 recibe un aggregate cuya composición continúa abierta.
- DR-055 consume fitness/fatigue/restricciones y entrega señales físicas, no
  ratings como carga.
- DR-057 permanece `BLOCKER_G3` por fórmulas, distribuciones, precisión,
  parámetros, streams, taxonomía concreta y fixtures.
- DR-063/ADR-010 ya deciden qué conceptos son facts, summaries o señales.

## Gates y tests requeridos

Antes de implementar:

1. schemas separan todos los componentes del estado;
2. `MedicalAvailabilityEnvelope` admite shares 0, parciales y 1;
3. Health no contiene suspensión/discipline como estado propio;
4. aggregate conserva invariantes de minutos;
5. cero/una/múltiples lesiones son posibles sin caps;
6. condiciones concurrentes e identidad causal son válidas;
7. recuperación esperada no determina la realizada;
8. recaída referencia episodio previo;
9. secuela no muta capabilities directamente;
10. lesión Q2 afecta Q3/Q4 y nunca reescribe Q1/Q2;
11. causa externa no se duplica como hazard deportivo;
12. replay/reanudación no repiten oportunidades, episodios ni facts;
13. parámetros, precisión, streams y orden están versionados;
14. golden/property tests y Monte Carlo cumplen targets aprobados.

## Interfaz refinada por G3C-3

**Fecha:** 2026-07-29  
**ADR relacionado:** [ADR-072](072-role-minutes-and-availability-mathematics.md)

Además del share y las restricciones, la futura resolución matemática de Health
debe producir una asignación médica agregada sobre los ordinales de oportunidad
definidos por ADR-072. Esa asignación permite componer overlaps con disciplina
y otras causas sin doble descuento. Health no asigna minutos ni se convierte
en owner de esas fuentes. La ecuación que genera la asignación médica permanece
en DR-057/G3C-5.
