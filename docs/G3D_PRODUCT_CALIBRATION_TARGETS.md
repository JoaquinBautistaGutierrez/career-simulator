# G3D Product Calibration Targets

## 1. Estado, autoridad y alcance

```yaml
phase: G3D-3D
status: NORMATIVE_PRODUCT_TARGETS
profile: BALANCED
sourceType: PRODUCT_DECISION
dataV1State: DATA_V1_NOT_PUBLISHED
engineParameterSetState: UNPUBLISHED
scoringConfigurationState: UNPUBLISHED
```

Este documento es la fuente normativa V1 para objetivos numéricos de producto,
tolerancias de aceptación, equivalencia Quick/Custom y límites diagnósticos de
colas. No contiene valores de `EngineParameterSet`, `ScoringConfiguration` ni
`ScoringCalibrationData`; tampoco convierte una preferencia en observación del
mundo real.

La relación normativa es:

```text
ProductTargetSet
    != EngineParameterSet
    != ScoringConfiguration
    != ScoringCalibrationData
    != ObservationalDataset
```

La calibración futura puede ajustar parámetros para intentar satisfacer este
documento. Ningún target indica qué coeficiente cambiar ni autoriza compensar
un error upstream mediante un parámetro downstream.

## 2. Contrato de identidad y metadata

Cada fila `PT-*` es un `ProductTargetDefinition` y hereda:

```text
ProductTargetDefinition {
  productTargetId
  canonicalCalibrationTargetIds[]
  metric
  denominator
  segmentation[]
  productTargetClass
  targetRange
  warningBand
  failureBand
  sampleTier
  sourceType = PRODUCT_DECISION
  ownerRole
  rationale
  downstreamParameterFamilies[]
  versionImpact
  approvalStatus
}
```

Salvo override de fila:

- `ownerRole = PRODUCT_OWNER`; los targets de Scoring requieren además
  `SCORING_OWNER` y Quick/Custom informa `CALIBRATION_OWNER`;
- `approvalStatus = NUMERIC_TARGET_DEFINED`;
- los cambios dentro de un candidate no publicado cambian el hash de
  `ProductTargetSet`; después de V1 exigen una nueva revisión de producto y del
  acceptance bundle afectado;
- `sourceType` nunca cambia a `EXTERNAL_OBSERVATION` por coincidir con un dato;
- `downstreamParameterFamilies` identifica dependencias, no orden de tuning.

### 2.1 Clases

| Clase | Semántica |
|---|---|
| `PRODUCT_NORMATIVE` | Dirección y rango elegidos por producto; bloquea el gate indicado. |
| `PRODUCT_PREFERENCE` | Banda deseada; puede coexistir con referencia observacional. |
| `ACCEPTANCE_TOLERANCE` | Distancia máxima para comparar candidates o modos. |
| `DIAGNOSTIC_BOUNDARY` | Activa revisión; por sí sola no inventa una verdad observada. |
| `SAFETY_INVARIANT` | Debe cumplirse exactamente; cualquier violación falla. |
| `OBSERVATIONAL_REFERENCE_REQUIRED` | Requiere P1/P2; no recibe número en G3D-3D. |

### 2.2 Prioridad

- `P0_ACCEPTANCE`: bloquea `EngineParameterSet V1` o el bundle competitivo.
- `P1_ACCEPTANCE`: bloquea el subsistema/bundle que lo consume, no matemática
  independiente ya válida.
- `DIAGNOSTIC_ONLY`: obliga a medir y explicar, pero no falla aisladamente.

La prioridad no equivale a los tracks de investigación P0/P1.

### 2.3 Asignación exhaustiva de clase

Cada uno de los 77 IDs pertenece a exactamente una clase:

| Clase | IDs cerrados | Count |
|---|---|---:|
| `PRODUCT_NORMATIVE` | `PT-TIER-*`; `PT-CB-001..004`; `PT-AWARD-*`; `PT-NT-*` | 17 |
| `PRODUCT_PREFERENCE` | `PT-CAREER-*`; `PT-RET-*`; `PT-CB-005..006`; `PT-FIN-001..005`; `PT-PBR-*`; `PT-VIRAL-*`; `PT-TROPHY-*`; `PT-MKT-*` | 26 |
| `ACCEPTANCE_TOLERANCE` | `PT-POS-FAIR-*`; `PT-QC-*`; `PT-SCORE-*`; `PT-MC-*` | 28 |
| `DIAGNOSTIC_BOUNDARY` | `PT-FIN-006`; `PT-HLT-*`; `PT-BESTRUN-*` | 6 |
| **Total** | sin overlap | **77** |

`SAFETY_INVARIANT` permanece en los `CT-*` normativos y sus goldens; no se
duplica como target numérico. `OBSERVATIONAL_REFERENCE_REQUIRED` identifica
los pendientes de §15 y, por definición, no crea una fila `PT-*` con número.

Si una fila no muestra prioridad propia, `PRODUCT_NORMATIVE` y
`ACCEPTANCE_TOLERANCE` heredan `P0_ACCEPTANCE`, `PRODUCT_PREFERENCE` hereda
`P1_ACCEPTANCE` y `DIAGNOSTIC_BOUNDARY` hereda `DIAGNOSTIC_ONLY`. Un override
explícito en la tabla prevalece. El texto de cada sección fija denominador,
segmentación y rationale; §16 fija sus parameter-family consumers.

## 3. Reglas de medida, incertidumbre y aceptación

### 3.1 Denominadores

- `Completed Careers`: todas las Careers `COMPLETED`, íntegras y elegibles bajo
  una única exact compatibility key. Es el denominador oficial de rareza. No se
  aplica la proyección best-run de ADR-084.
- `Competitive Careers`: vista diagnóstica condicionada al evidence band
  `PROFESSIONAL_SIGNIFICANT` publicado. Nunca reemplaza ni oculta la vista
  oficial.
- Una frecuencia condicionada declara primero la condición. Oportunidad,
  eligibility y outcome no se intercambian.
- Runs `INCONCLUSIVE_GUARD_REACHED` son right-censored y no entran como
  finalizaciones, retiros ni failures deportivos.

### 3.2 PASS, PASS_WITH_WARNING y FAIL

Para una banda objetivo `[L,U]` y advertencia `[WL,WU]`:

- `PASS`: estimación puntual dentro de `[L,U]`, intervalo de confianza al 95 %
  no sale de `[WL,WU]` y se cumple la precisión mínima del tier;
- `PASS_WITH_WARNING`: no hay violación/incompatibilidad y la estimación o su
  intervalo toca la warning band sin demostrar salida material de ella;
- `FAIL`: con precisión suficiente, la estimación queda fuera de la warning
  band, o falla una regla compuesta obligatoria;
- precisión insuficiente produce `PASS_WITH_WARNING / MORE_SAMPLES_REQUIRED`,
  nunca un pass silencioso.

Para tolerancias con ideal cero, se evalúa el límite superior del intervalo al
95 %. En invariantes el único valor aceptable es cero violaciones.

Proporciones usan Wilson; medias usan Monte Carlo standard error; quantiles y
W1 usan bootstrap determinista predeclarado; KS usa su statistic e intervalo
bootstrap. Comparaciones Quick/Custom usan common random numbers sobre el mismo
`CalibrationSeedSet`, sin exigir carreras individuales iguales.

## 4. Tier rarity V1 — perfil `BALANCED`

Los thresholds de PC no cambian. Las siguientes frecuencias usan `Completed
Careers` y deben sumar exactamente 100 % en cada compatibility key.

| Target | CT | Tier / rango PC | PASS | WARNING | FAIL | Suite / prioridad |
|---|---|---|---:|---:|---:|---|
| `PT-TIER-001` | `CT-SCR-TIER-001` | Professional, 0–4,999 | 58–64 % | 54–68 % | fuera de warning | DEEP / P0 |
| `PT-TIER-002` | `CT-SCR-TIER-001` | Notable, 5,000–14,999 | 25–29 % | 22–32 % | fuera de warning | DEEP / P0 |
| `PT-TIER-003` | `CT-SCR-TIER-001` | International Elite, 15,000–24,999 | 8–10 % | 6.5–11.5 % | fuera de warning | DEEP / P0 |
| `PT-TIER-004` | `CT-SCR-TIER-001` | World-Class, 25,000–39,999 | 1.8–2.8 % | 1.2–3.6 % | fuera de warning | DEEP / P0 |
| `PT-TIER-005` | `CT-SCR-TIER-001` | Legend, 40,000–54,999 | 0.35–0.75 % | 0.20–1.05 % | fuera de warning | DEEP / P0 |
| `PT-TIER-006` | `CT-SCR-TIER-001` | Historic Legend, 55,000–69,999 | 0.07–0.20 % | 0.03–0.30 % | fuera de warning | DEEP / P0 |
| `PT-TIER-007` | `CT-SCR-TIER-001` | Mythical, 70,000+ | 0.005–0.040 % | 0.001–0.080 % | fuera de warning | DEEP / P0 |

Mythical debe permanecer matemáticamente accesible. No observarlo en una
campaña que todavía no alcanza precisión es `MORE_SAMPLES_REQUIRED`; no
observarlo cuando el límite superior Wilson ya queda por debajo de 0.005 % es
`FAIL`. No existe score cap por debajo de 70k ni probability floor causal.

### 4.1 Position fairness

Se comparan tasas por GK/CM/ST sobre Completed Careers y, como diagnóstico,
sobre Competitive Careers. Deben cumplirse simultáneamente gap absoluto y
ratio shrinkage-adjusted. Para una posición con `k` éxitos entre `n` Careers,
la tasa del ratio es la media Jeffreys `(k + 0.5) / (n + 1)`; el gap absoluto
usa `k / n`. El ratio canónico es `max(rateJeffreys) / min(rateJeffreys)` entre
GK/CM/ST. Así se evita dividir por cero sin ocultar la incertidumbre, que sigue
evaluándose mediante intervalos binomiales.

| Target | Métrica | PASS | WARNING | FAIL | Suite / prioridad |
|---|---|---|---|---|---|
| `PT-POS-FAIR-001` | World-Class+ max gap / max:min | <=1.0 pp y <=1.50 | <=1.5 pp y <=2.00 | supera warning con precisión | DEEP / P0 |
| `PT-POS-FAIR-002` | Legend+ max gap / max:min | <=0.35 pp y <=1.75 | <=0.60 pp y <=2.50 | supera warning con precisión | DEEP / P0 |
| `PT-POS-FAIR-003` | Mythical max gap / max:min | <=0.03 pp y <=3.0 | <=0.06 pp y <=5.0 | ratio >5 o upper CI de una posición queda bajo el lower target pooled | DEEP / P0 |

No se exige igualdad entre posiciones. Un sampled outcome no debe ser
monótono; se evita únicamente un bloqueo estructural.

## 5. Quick / Custom distributional equivalence

### 5.1 Variables y segmentos

La suite obligatoria compara:

- `CreationPowerScore` y capabilities/traits allowlisted;
- final PC, duración, edad de retiro, injuries, transfers, trophies, awards y
  national-team involvement;
- `log1p(followers)`, PublicAttention máxima y tier;
- outputs posicionales: GK save/clean-sheet summaries, CM impact dimensions y
  ST goals/assists/conversion summaries;
- GK/CM/ST, Argentina-start, Spain-context aplicable y broad success groups
  `Professional|Notable|InternationalElitePlus` solo como vista secundaria.

La normalización usa el IQR Quick del segmento conforme a G3C-2. IQR cero no
autoriza división: se usa diferencia absoluta en la unidad declarada o se marca
el cell `UNDEFINED_SCALE` y falla el gate de preparación.

Quantiles canónicos: P05, P25, P50, P75, P95 y P99.

| Target | CT | Métrica | PASS | WARNING | FAIL | Prioridad |
|---|---|---|---:|---:|---:|---|
| `PT-QC-001` | `CT-CRE-EQUIV-001` | `abs(SMD mean)` | <=0.10 | <=0.15 | >0.15 | P0 |
| `PT-QC-002` | `CT-CRE-EQUIV-001` | median diff / Quick IQR | <=0.10 | <=0.15 | >0.15 | P0 |
| `PT-QC-003` | `CT-CRE-EQUIV-001` | P25/P50/P75 diff / IQR | <=0.10 cada una | <=0.15 | >0.15 | P0 |
| `PT-QC-004` | `CT-CRE-EQUIV-001` | P05/P95 diff / IQR | <=0.15 | <=0.25 | >0.25 | P0 |
| `PT-QC-005` | `CT-CRE-EQUIV-001` | P99 diff / IQR | <=0.25 | <=0.40 | >0.40 | P0 |
| `PT-QC-006` | `CT-CRE-EQUIV-001` | normalized W1 | <=0.10 | <=0.15 | >0.15 | P0 |
| `PT-QC-007` | `CT-CRE-EQUIV-001` | two-sample KS | <=0.08 | <=0.12 | >0.12 | P0 |
| `PT-QC-008` | `CT-CRE-EQUIV-001` | tier probability gap, Professional/Notable/International Elite | <=2.0 pp | <=3.0 pp | >3.0 pp | P0 |
| `PT-QC-009` | `CT-CRE-EQUIV-001` | World-Class+ / Legend+ / Mythical gaps | <=0.50 / 0.15 / 0.02 pp | <=0.80 / 0.25 / 0.04 pp | supera warning | P0 |
| `PT-QC-010` | `CT-CRE-EQUIV-001` | warning-cell share | 0 % | >0 y <=10 % | cualquier FAIL o >10 % warning | P0 |

`PASS` global exige que todos los cells obligatorios pasen. `PASS_WITH_WARNING`
exige cero FAIL y como máximo 10 % de cells en warning. Un aggregate total no
puede ocultar un FAIL de posición o contexto.

## 6. Career duration y retirement

Las bandas siguientes son bins de aceptación, no thresholds del hazard ni edad
máxima. La duración se mide desde la primera temporada con actividad
profesional hasta el primer retiro deportivo; cycles posteriores se reportan
aparte.

| Target | CT | Distribución PASS | WARNING | FAIL | Suite / prioridad |
|---|---|---|---|---|---|
| `PT-CAREER-001` | `CT-E2E-CAREER-001` | 0–2 seasons 3–10 %; 3–7: 12–25 %; 8–17: 55–72 %; 18–23: 8–18 %; 24+: 0.2–2 % | 1–15; 8–30; 45–80; 4–25; 0.05–4 % | cualquier bin fuera de warning | DEEP / P0 |
| `PT-RET-001` | `CT-RET-AGE-001` | age <=27: 2–8 %; 28–37: 72–86 %; 38–42: 10–20 %; 43+: 0.5–3 % | 1–12; 65–90; 6–25; 0.1–5 % | fuera de warning | DEEP / P1 |

La referencia observacional P1 se conserva separada y puede abrir revisión de
estos rangos; nunca se etiqueta a estos números como distribución histórica.

## 7. Comeback y finalization

Un comeback efectivo requiere transición real a `PlayerPlayingStatus.ACTIVE`.
Una opportunity rechazada o una oferta sin retorno no cuenta.

| Target | CT | Denominador / métrica | PASS | WARNING | FAIL | Prioridad |
|---|---|---|---:|---:|---:|---|
| `PT-CB-001` | `CT-CB-FREQ-001` | >=1 comeback entre Careers retiradas abiertas y elegibles >=1 Q | 3–8 % | 1.5–12 % | fuera de warning | P0 |
| `PT-CB-002` | `CT-CB-FREQ-001` | >=2 comebacks, mismo denominador | 0.05–0.30 % | 0.01–0.60 % | fuera | P1 |
| `PT-CB-003` | `CT-CB-CYCLE-001` | P(>=2 \| >=1 comeback) | 1–5 % | 0.3–8 % | fuera | diagnostic |
| `PT-CB-004` | `CT-CB-CYCLE-001` | >=3 comebacks, mismo denominador base | 0.001–0.020 % | 0–0.050 % | >0.050 %; cero requiere precision review | diagnostic |
| `PT-CB-005` | `CT-CB-SUCCESS-001` | median Q entre retiro y comeback efectivo | 1–4 Q | 0–8 Q | fuera | P1 |
| `PT-CB-006` | `CT-CB-SUCCESS-001` | P90 del gap | 4–12 Q | 2–20 Q | fuera | P1 |

Se diagnostican además contrato/affiliation, minutos en cuatro Q, meaningful
role y ausencia de mercado viable. No se promueven a target numérico hasta que
P1 defina denominadores compatibles.

### 7.1 FinalizationOpportunity

La elección manual del usuario es `OBSERVATIONAL_REFERENCE_REQUIRED`; no tiene
probabilidad sintética V1. Los targets siguientes miden oportunidades bajo una
`CalibrationAutomationPolicy` identificada y no autorizan auto-close.

| Target | CT | Métrica | PASS | WARNING | FAIL | Prioridad |
|---|---|---|---:|---:|---:|---|
| `PT-FIN-001` | `CT-FIN-TIME-001` | primera opportunity dentro de 4 Q del retiro | 30–60 % | 20–70 % | fuera | P0 |
| `PT-FIN-002` | `CT-FIN-TIME-001` | primera opportunity dentro de 12 Q | 65–90 % | 50–95 % | fuera | P0 |
| `PT-FIN-003` | `CT-FIN-TIME-001` | >=2 opportunities entre Careers aún abiertas | 20–60 % | 10–75 % | fuera | P1 |
| `PT-FIN-004` | `CT-FIN-TIME-001` | median time a primera opportunity | 2–6 Q | 1–10 Q | fuera | P1 |
| `PT-FIN-005` | `CT-FIN-TIME-001` | P90 time a primera opportunity | 4–16 Q | 2–24 Q | fuera | P1 |
| `PT-FIN-006` | `CT-E2E-TERM-001` | retirada y abierta tras 8 / 12 seasons | <=1.0 / <=0.2 % | <=3.0 / <=1.0 % | supera warning; el run individual sigue right-censored | P0 |

Tiempo por sí solo nunca vuelve `INVALID` una Career. `INCONCLUSIVE_GUARD_REACHED`
permanece right-censored y no emite facts.

## 8. Social, PBR y viral tails

`priorSportingPoints = PRI + PTC_CLUB + PPI + PSN`; PBR conserva subcaps 1000,
cap agregado 2000 y cross-cap 5 %. Estos targets no cambian esa fórmula.

| Target | CT | Métrica | PASS | WARNING | FAIL | Prioridad |
|---|---|---|---:|---:|---:|---|
| `PT-PBR-001` | `CT-SCR-POP-001` | median `PBR/PC` | 0.2–1.0 % | 0–1.5 % | >1.5 % | P0 |
| `PT-PBR-002` | `CT-SCR-POP-001` | P90 `PBR/PC` | 1.5–3.0 % | 1.0–3.8 % | fuera | P0 |
| `PT-PBR-003` | `CT-SCR-POP-001` | P95 `PBR/PC` | 2.0–3.8 % | 1.5–4.5 % | fuera | P0 |
| `PT-PBR-004` | `CT-SCR-POP-001` | median `PBR/priorSportingPoints` | 0.2–1.2 % | 0–1.8 % | >1.8 % | P0 |
| `PT-PBR-005` | `CT-SCR-POP-001` | P90 / P95 del ratio anterior | 1.5–3.2 / 2.2–4.2 % | <=4.0 / <=4.7 % | supera warning | P0 |
| `PT-PBR-006` | `CT-SCR-PBR-001` | cross-cap saturation | 0.1–1.5 % | 0.02–3.0 % | fuera; invariant del cap siempre exacto | P1 |
| `PT-PBR-007` | `CT-SCR-POP-001` | `PBR/priorSportingPoints >4%` | 0.5–3.0 % | 0.1–5.0 % | fuera | P1 |
| `PT-VIRAL-001` | `CT-SOC-TAIL-001` | ninguna major viral episode por Career | 85–95 % | 80–98 % | fuera | diagnostic |
| `PT-VIRAL-002` | `CT-SOC-TAIL-001` | exactamente una | 4.5–14 % | 2–18 % | fuera | diagnostic |
| `PT-VIRAL-003` | `CT-SOC-TAIL-001` | dos o más | 0.2–2.0 % | 0.05–4.0 % | fuera | diagnostic |
| `PT-VIRAL-004` | `CT-SOC-TAIL-001` | sustained follower explosion | 0.05–0.50 % | 0.01–1.0 % | fuera | diagnostic |
| `PT-VIRAL-005` | `CT-SOC-FOLLOW-001` | >=1 season con follower decline, Careers con >=5 observed seasons | 15–40 % | 8–55 % | fuera | P1 |

Awareness alta y sentiment negativo siguen válidos. Viralidad no es un bonus
de tragedia ni autoriza Content→Followers.

## 9. Scoring composition y farming diagnostics

| Target | CT | Métrica | PASS | WARNING | FAIL | Prioridad |
|---|---|---|---:|---:|---:|---|
| `PT-SCORE-001` | `CT-SCR-PC-001` | PRI es mayor categoría individual | 60–80 % Careers | 50–88 % | fuera | P0 |
| `PT-SCORE-002` | `CT-SCR-PC-001` | median `PRI/priorSportingPoints` | 45–70 % | 35–78 % | fuera | P0 |
| `PT-SCORE-003` | `CT-SCR-PC-001` | PTC_CLUB o PPI mayor categoría en Legend+ | 20–60 % | 10–75 % | fuera | P1 |
| `PT-SCORE-004` | `CT-SCR-PC-001` | median / P95 `PRL/PC` | <=8 / <=20 % | <=12 / <=28 % | supera warning | P0 |
| `PT-SCORE-005` | `CT-SCR-PC-001` | median category HHI | <=0.55 | <=0.70 | >0.70 | P1 |
| `PT-SCORE-006` | `CT-SCR-PC-001` | low-contribution trophy-heavy Career supera elite-performance peer comparable | <=2 % | <=5 % | >5 % | P0 |
| `PT-SCORE-007` | `CT-E2E-CAREER-001` | residual Spearman PC↔active career length dentro de PRI/achievement bins | abs(rho)<=0.20 | <=0.35 | >0.35 | P0 |
| `PT-SCORE-008` | `CT-SCR-PC-001` | `PRL/PC>20%` en bottom PRI half | <=2 % | <=5 % | >5 % | P0 |
| `PT-SCORE-009` | `CT-AWD-REPEAT-001` | >50 % de PPI desde repeticiones de una award family | <=10 % award winners | <=20 % | >20 % | P1 |
| `PT-SCORE-010` | `CT-SCR-PC-001` | >60 % PTC desde outcomes del menor value band en top-PC decile | <=5 % | <=10 % | >10 % | P1 |
| `PT-SCORE-011` | `CT-CB-CYCLE-001` | residual Spearman comeback-cycle count↔PC | abs(rho)<=0.10 | <=0.20 | >0.20 | diagnostic |

No se modifican CC, IJL, equivalencias, values, caps ni tiers. Un hallazgo abre
análisis causal; no autoriza restar puntos ad hoc.

## 10. Trophies, Awards y National Team

### 10.1 Trophy guardrails

| Target | CT | Métrica, Completed Competitive Careers | PASS | WARNING | FAIL |
|---|---|---|---:|---:|---:|
| `PT-TROPHY-001` | `CT-E2E-CAREER-001` | zero trophies / >=10 / >=25 | 20–45 / 1–8 / 0.05–1 % | 10–55 / 0.5–12 / 0.01–2 % | cualquier componente fuera |

Es una guardrail de producto, no una estimación histórica. Producción por
competición y contexto continúa `OBSERVATIONAL_REFERENCE_REQUIRED`.

### 10.2 Award rarity

El denominador es Careers completadas con al menos una edición elegible; el
outcome es haber ganado al menos una vez la familia.

| Target | CT | Familia | PASS | WARNING | FAIL |
|---|---|---|---:|---:|---:|
| `PT-AWARD-001` | `CT-AWD-WIN-001` | global comparative | 0.02–0.10 % | 0.005–0.20 % | fuera |
| `PT-AWARD-002` | `CT-AWD-WIN-001` | young comparative | 0.05–0.25 % | 0.01–0.50 % | fuera |
| `PT-AWARD-003` | `CT-AWD-WIN-001` | league POTY | 0.20–1.00 % | 0.05–2.00 % | fuera |
| `PT-AWARD-004` | `CT-AWD-WIN-001` | league scorer, eligible ST | 0.50–2.50 % | 0.10–4.00 % | fuera |
| `PT-AWARD-005` | `CT-AWD-WIN-001` | GK positional, eligible GK | 0.50–3.00 % | 0.10–5.00 % | fuera |

Global comparative debe ser menor que cada league/position family tras
normalizar el mismo tipo de denominador. G3D-3B2 todavía debe cerrar mechanics;
estos targets no congelan AwardDefinitions incompletas.

### 10.3 International career bands

`InternationalCareerSummary` usa categorías de acceptance, no estados causales:
`NEVER_CALLED`, `OCCASIONAL`, `REGULAR`, `INCUMBENT`, `ELITE`. El adapter se
publicará con evidence/minutes bands y no modifica call-up.

| Target | CT | Distribución entre Competitive Careers | PASS | WARNING | FAIL |
|---|---|---|---|---|---|
| `PT-NT-001` | `CT-NT-CALL-001`, `CT-NT-MIN-001` | never 45–65 %; occasional 15–25 %; regular 10–20 %; incumbent 4–10 %; elite 1–4 % | esos rangos | 35–75; 10–32; 6–27; 2–15; 0.3–7 % | cualquier banda fuera |

MarketValue y CareerScore permanecen excluidos de Selection.

## 11. Health y Market: guardrails, no observed rates

### 11.1 Injury diagnostics

La incidencia observada, severity, recovery, relapse y sequela siguen P1. Estas
filas solo detectan mundos degenerados y no sustituyen datasets con exposición.

| Target | CT | Review boundary | Candidate failure boundary | Clase |
|---|---|---:|---:|---|
| `PT-HLT-001` | `CT-INJ-FREQ-001` | >95 % Careers sin injury deportiva | >99.5 % con precision suficiente | DIAGNOSTIC_BOUNDARY |
| `PT-HLT-002` | `CT-INJ-TAIL-001` | >25 % Careers con burden>0.5 en >50 % de Q activas | >50 % | DIAGNOSTIC_BOUNDARY |
| `PT-HLT-003` | `CT-REL-FREQ-001` | relapses >50 % de episodes deportivas | >75 % | DIAGNOSTIC_BOUNDARY |
| `PT-HLT-004` | `CT-SEQ-FREQ-001` | persistent sequela >20 % Careers o cero season-loss tail en DEEP | >40 % persistent; invariants siguen exactos | DIAGNOSTIC_BOUNDARY |

### 11.2 Market diagnostics

| Target | CT | PASS/desired | WARNING | FAIL/review material |
|---|---|---:|---:|---:|
| `PT-MKT-001` | `CT-MKT-TRANS-001` | zero permanent-transfer Careers 5–60 % | 2–75 % | fuera |
| `PT-MKT-002` | `CT-MKT-TRANS-001` | multiple-sporting-club Careers 20–80 % | 10–90 % | fuera |
| `PT-MKT-003` | `CT-MKT-TAIL-001` | >=8 permanent transfers <=5 %; >=12 <=1 % | <=10 / <=3 % | supera warning |
| `PT-MKT-004` | `CT-MKT-OFFER-001` | interest→offer y offer→completed transfer nunca 100 %; completed/offer 10–70 % | 5–85 % | >85 % o logical-stage violation |

Fee, salary y transfer frequency observadas permanecen pendientes de P1 y de
series monetarias. Comeback no garantiza club.

## 12. Tail classification

### `EXPECTED_RARE`

Outcome representable, causal y reproducible dentro del soporte, cuya
frecuencia cae dentro de su target/warning declarada. Incluye 70k+ PC,
retirement 43+, varios world awards, 2+ comebacks, follower growth extremo y
una carrera corta históricamente grande. No se corrige automáticamente.

### `REVIEW_REQUIRED`

Se activa cuando ocurre cualquiera:

- estimate o intervalo sale de la target band;
- frequency supera warning, o duplica el upper target de una tail sin warning
  propia;
- position ratio, category concentration, cap saturation, non-termination o
  farming cruza los límites de este documento;
- la frecuencia parece válida pero falta precisión/provenance.

Activa revisión de trace, causal attribution, segmentation y dataset. No
invalida por sí sola una Career.

### `INVALID`

Reservado a violación de invariant/schema/eligibility/identity/registration,
NaN/overflow/-0 prohibido, count imposible, duplicate canonical fact, ledger
inconsistente, non-determinism o replay mismatch. Una rareza deportiva legítima
nunca es `INVALID`.

## 13. Monte Carlo acceptance

| Target | Suite | Requisito numérico | Uso |
|---|---|---|---|
| `PT-MC-001` | SMOKE | >=1,000 Careers totales y >=100 por position/mode cell, además de todos los fixtures deterministas | invariants, gross errors; nunca rare-event approval |
| `PT-MC-002` | CALIBRATION | N efectivo que deje MCSE mean <=0.05 SD, bootstrap quantile half-width <=0.10 IQR y binomial half-width <=1 pp para common events | centros, common events, fairness y Quick/Custom |
| `PT-MC-003` | DEEP | N tal que el lower target rare event tenga >=25 expected occurrences, >=10 observed para estimate publicable y relative 95 % half-width <=50 % | Mythical, repeated comebacks, award/viral/injury tails |
| `PT-MC-004` | todos | 95 % intervals, predeclared cells y mismo `CalibrationSeedSet` para candidate comparisons | no point-estimate-only decision |

Para Mythical al lower target 0.005 %, la primera condición implica al menos
500,000 Completed Careers efectivas por compatibility key; position fairness
puede exigir más por segmentación. El manifest conserva N exacto, seeds,
right-censoring y resampling method.

## 14. Best-run diagnostic

ADR-084 no cambia. El leaderboard principal muestra una Career por user y
exact compatibility key, pero calibration usa todas las Completed Careers.

| Target | Métrica | Boundary | Acción |
|---|---|---|---|
| `PT-BESTRUN-001` | completed-career count por user vs best-run PC, por compatibility key | residual Spearman >0.35 o uplift best-run P95 >20 % entre deciles adyacentes de run count | `REVIEW_REQUIRED`; no limitar intentos |

## 15. Observational references todavía pendientes

No reciben números de producto fingidos:

- capability/development, Role/Minutes y production distributions;
- injury incidence, exposure, severity, recovery, relapse y sequela rates;
- club baselines, manager turnover y competition outcome distributions;
- transfer fees, salaries, money normalization y transaction rates;
- detailed call-up/usage distributions y Award field mechanics;
- public follower/engagement levels por plataforma/era;
- empirical retirement/career histories, lower-tier continuation y censoring;
- PRI/CC cohorts, IJL y remaining scoring catalogs.

G3D-3B2 permanece separado: comparative Award rules, LaLiga POTY/scorer
mechanics, ordinary international calendar y monetary series/terms/transforms.

## 16. Target-to-parameter dependency map

| Product targets | Multi-owner parameter families | Tuning constraint |
|---|---|---|
| `PT-QC-*` | creation, development, roleMinutes, performance, health, clubWorld, transfersMarket, nationalTeam, awards, reputationSocial, retirementComeback, scoring resources | no ajustar Creation contra tier output antes de upstream acceptance |
| `PT-TIER-*`, `PT-POS-FAIR-*` | todos los gameplay branches + ScoringConfiguration/Data | Gate 6, nunca hard blocking por tier |
| `PT-CAREER-*`, `PT-RET-*` | development, health, roleMinutes, transfersMarket, retirementComeback | no atribuir exclusivamente a retirement |
| `PT-CB-*`, `PT-FIN-*` | health, market, world/calendar, retirementComeback y automation policy separada | user decision no se samplea |
| `PT-PBR-*`, `PT-VIRAL-*` | reputationSocial + ScoringCalibrationData/Configuration | no compensar sporting con social |
| `PT-SCORE-*`, `PT-TROPHY-*`, `PT-AWARD-*`, `PT-NT-*` | performance, clubWorld/competitions, nationalTeam, awards y scoring resources | scoring no reescribe facts |
| `PT-HLT-*`, `PT-MKT-*` | health / transfersMarket con contextos upstream | diagnostic hasta P1 observado |

## 17. Readiness y freeze

- `PD-G3D-008..011` quedan `FROZEN_FOR_V1` en su dirección y
  `NUMERIC_TARGET_DEFINED` en sus filas aplicables.
- `PD-G3D-012/013/015` permanecen `FROZEN_FOR_V1` sin cambio de policy.
- Product numeric gates necesarios para iniciar P1 y preparar candidates están
  cerrados; no existe autorización para asignar parámetros.
- `Data V1`, `EngineParameterSet V1`, `ScoringConfiguration V1`, expected
  goldens y acceptance reports siguen sin publicar.

Resultado documental:

```text
GO_FOR_P1_AND_INITIAL_CALIBRATION_PREPARATION
```

Preparación significa schemas/manifests/harness y sensitivity planning; la
calibración causal espera los datasets upstream y una autorización posterior.

## 18. Referencias

- [G3D Product Decisions](G3D_PRODUCT_DECISIONS.md)
- [Calibration Target Registry](CALIBRATION_TARGET_REGISTRY.md)
- [Calibration Parameter Registry](CALIBRATION_PARAMETER_REGISTRY.md)
- [Golden Vector Registry](GOLDEN_VECTOR_REGISTRY.md)
- [Mathematical Calibration Contract](MATHEMATICAL_CALIBRATION_CONTRACT.md)
- [Scoring Math](SCORING_MATH_SPEC.md)
- [Retirement, Comeback & Finalization Math](RETIREMENT_COMEBACK_FINALIZATION_MATH_SPEC.md)
- [Reputation & Social Math](REPUTATION_SOCIAL_MATH_SPEC.md)
- [ADR-079](adr/079-retirement-comeback-finalization-mathematics.md)
- [ADR-080](adr/080-exact-scoring-mathematics.md)
- [ADR-084](adr/084-main-leaderboard-best-career-projection.md)
