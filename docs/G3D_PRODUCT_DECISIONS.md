# G3D Product Decisions

## 1. Propósito

Este registro contiene únicamente elecciones de producto: preferencias que no
deben presentarse como hechos observados. Las tolerancias numéricas se
publicarán posteriormente; no se crea una DR por cada valor.

Niveles de freeze G3D-3A:

| Nivel | Semántica |
|---|---|
| `PROPOSED` | Existe una propuesta; Product todavía puede elegir otra dirección. |
| `APPROVED_DIRECTION` | La dirección normativa está aprobada; puede faltar un rango o binding de data. |
| `NUMERIC_TARGET_REQUIRED` | La métrica está cerrada, pero falta una tolerancia/rango de producto. Puede coexistir con `APPROVED_DIRECTION`. |
| `FROZEN_FOR_V1` | La decisión de producto no admite cambios dentro de V1 sin nueva revisión/version impact. Data y calibration pueden seguir pendientes. |

Los estados históricos `APPROVED`, `PROPOSED_APPROVAL` y `RANGE_PENDING` se
mapean abajo; no se confunde dirección aprobada con tolerancia calibrada.

## 2. Registro

| ID | Question / policy | Opciones | Recomendación y rationale | Sistemas / targets | Approver | Estado / gate |
|---|---|---|---|---|---|---|
| `PD-G3D-001` | ¿Cuántos clubes detallados por liga? | 6, 8, 10 | **8**: cubre diversidad sin simular la liga completa. | Club/World/Market; `CT-CLUB-*` | `PRODUCT_OWNER` | `FROZEN_FOR_V1`; identities pendientes |
| `PD-G3D-002` | ¿Cómo seleccionar el portfolio? | popularidad; fuerza; portfolio multidimensional | Portfolio obligatorio de strength/finance/development/stability/reach/táctica/evidencia. | Data/Club; club targets | `PRODUCT_OWNER` + `DATA_OWNER` | `FROZEN_FOR_V1`; selección pendiente P0 |
| `PD-G3D-003` | Continuidad de clubes externos | tiers completos; pool reducido; híbrido | **Híbrido** real-ID + fields + materialización. Conserva replay sin inventar clubes. | Club/Market/Retirement/Scoring | Product + Architecture | `FROZEN_FOR_V1`; ADR-081 |
| `PD-G3D-004` | Unidad monetaria de calibración | base real; normalizada; dual | **Dual**: Money nativo exacto + contexto normalizado derivado. | Market/Data | Product + Data | `FROZEN_FOR_V1`; ADR-083, series pendientes |
| `PD-G3D-005` | Cadencia Market V1 | mid-season; post-season; ambas | **Post-season only**, usando cursor existente. Reduce policy/registration sin impedir transferencia. | Calendar/Market; `CT-MKT-TRANS-*` | Product + Architecture | `FROZEN_FOR_V1`; DR-067 V1 |
| `PD-G3D-006` | Registration V1 | reglamento completo; subset; universal | Subset next-season; ausencia de regla = pending, nunca universal. | Market/Competitions/Scoring | Product + Data | `FROZEN_FOR_V1`; bindings pendientes |
| `PD-G3D-007` | Sporting nationality V1 | Argentina-only; multi-eligibility | **Argentina-only** en V1; no transition. Es el menor scope coherente con país inicial. | Creation/National Team | Product | `FROZEN_FOR_V1`; ADR-082 |
| `PD-G3D-008` | Equivalencia Quick/Custom | igualdad individual; media; distribución | Misma distribución competitiva por GK/CM/ST: SMD de media, mediana, quantiles principales, W1, KS y probabilidad de tier. Todas las métricas obligatorias deben pasar. | Creation; `CT-CRE-EQUIV-*` | `PRODUCT_OWNER`, informado por `CALIBRATION_OWNER` | `APPROVED_DIRECTION` + `NUMERIC_TARGET_REQUIRED`; G3D-3D |
| `PD-G3D-009` | Rareza de tiers altos | `CONSERVATIVE`, `BALANCED`, `GENERATIVE` | Recomendada **BALANCED**: tiers altos raros pero observables en Monte Carlo DEEP; conserva validabilidad sin hacerlos ordinarios. | Scoring; `CT-SCR-TIER-*` | `PRODUCT_OWNER` + `SCORING_OWNER` | `PROPOSED` + `NUMERIC_TARGET_REQUIRED`; G3D-3D/Gate 6 |
| `PD-G3D-010` | Balance social en PBR | indiferente; dominante; subordinado | En zona central social no debe dominar sporting; cult/viral tails siguen válidas. No cambia caps/fórmula. | Reputation/Scoring; `CT-SCR-POP/PC` | Product + Scoring | `APPROVED_DIRECTION` + `NUMERIC_TARGET_REQUIRED`; G3D-3D |
| `PD-G3D-011` | Frecuencia de comeback | muy raro; raro visible; frecuente | **Raro pero visible**; múltiples comebacks son excepcionalísimos, nunca imposibles. | Retirement; `CT-CB-FREQ/CYCLE` | Product | `APPROVED_DIRECTION` + `NUMERIC_TARGET_REQUIRED`; G3D-3D/G3D-7 |
| `PD-G3D-012` | Finish Career posretiro | solo oportunidad; manual; automático | Mostrar opportunity cuando ocurra y permitir Finish manual en todo safe boundary retirado; doble confirmación irreversible. No auto-finish oficial. | Lifecycle/Profile/Scoring; `CT-FIN-TIME` | Product | `FROZEN_FOR_V1`; frequency target separado |
| `PD-G3D-013` | Outlier acceptance | rechazar por rareza; revisar; categorías | `EXPECTED_RARE`, `REVIEW_REQUIRED`, `INVALID`; rareza sola nunca invalida. | todos; tail targets | Product + QA | `FROZEN_FOR_V1` |
| `PD-G3D-014` | Claims públicos de percentiles/frecuencias | siempre; con sample gate; ninguno | No publicar hasta cohort/sample/privacy policy validada; test leaderboard puede ser interno. | Profile/Leaderboard; DR-035 | Product + Data/Privacy | `FROZEN_FOR_V1`; operational ranges pending |
| `PD-G3D-015` | Best run / duplicates V1 | A todas; B mejor por key; C una submission | **B**: leaderboard principal conserva la mejor Career elegible por user y exact compatibility key; perfil/audit conserva todas. | Leaderboard; DR-036/034/037 | Product + Integrity | `FROZEN_FOR_V1`; ADR-084; identity/privacy data pendientes |

## 3. Quick vs Custom acceptance dimensions

La equivalencia no exige pares iguales. Se compara la distribución conjunta en
el mismo `CalibrationSeedSet`, por posición y modo:

- standardized mean difference de `CreationPowerScore`;
- diferencia de mediana;
- quantiles bajos, centrales y altos predeclarados;
- Wasserstein-1 normalizada;
- KS;
- prevalencia RIGHT/LEFT/BOTH y capabilities extremas;
- probabilidad end-to-end de tiers, como gate tardío y no ajuste directo de
  Creation.

Las tolerancias son product settings separados; no se rellenan en G3D-2.

## 4. Tier y social balance

Las bandas absolutas de PC no cambian. Producto solo decide targets de
frecuencia y composición. Un candidate falla si alcanza tiers altos
principalmente por compensar un problema upstream con social/scoring. Un cult
player o viral tail coherente sigue permitido. Se diagnostican por posición,
career duration y oportunidad de logros.

## 5. Comeback y finalization

`RARE_VISIBLE` significa que una campaña DEEP debe observar comebacks sin que
sean una expectativa ordinaria de Career. El segundo comeback debe ser mucho
menos frecuente que el primero como outcome calibrado, no por cooldown o cap.

Finish Career:

- solo con Career abierta y playing `RETIRED`;
- manual en safe boundary conforme ADR-079;
- opportunity puede sugerir, nunca forzar;
- warning explica irreversibilidad, final score y pérdida de comeback;
- automation de calibración es tooling y no una policy competitiva.

## 6. Tail acceptance

| Clase | Semántica | Acción |
|---|---|---|
| `EXPECTED_RARE` | outcome causalmente válido, representable, reproducible y dentro del soporte | aceptar y monitorizar frecuencia |
| `REVIEW_REQUIRED` | válido a primera vista, pero supera diagnostic range, tiene baja evidencia o combinación no cubierta | revisar trace/provenance; no invalidar por rareza |
| `INVALID` | viola invariante, schema, causal ordering, arithmetic, identity, eligibility o representability | rechazar candidate/run y abrir defecto |

No se introducen caps para mover un outcome de una clase a otra.

## 7. Scope freeze proposal

| Dimensión | Estado |
|---|---|
| Argentina/España, GK/CM/ST, 8 clubes por liga | `FROZEN_FOR_V1` |
| dos ligas, dos copas, Libertadores, Champions | `FROZEN_FOR_V1`, definitions requieren data |
| Argentina senior, Argentina-only eligibility | `FROZEN_FOR_V1`, catalog requiere data |
| cinco AwardDefinition slots | `FROZEN_FOR_V1`, identities requieren data |
| seis InjuryDefinition candidates | `DATA_VALIDATION_REQUIRED` |
| ARS/EUR y dual monetary layer | `FROZEN_FOR_V1`, series requieren data |
| latest completed baseline policy | `FROZEN_FOR_V1`, date/edition se congelan en P0 |

