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

## 8. Tier-rarity profiles

No se asignan porcentajes en G3D-3A. Los perfiles definen únicamente la
dirección que `PRODUCT_OWNER` y `SCORING_OWNER` convertirán en tolerancias en
G3D-3D:

| Perfil | Consecuencia de producto | Riesgo de calibración |
|---|---|---|
| `CONSERVATIVE` | Legend/Historic/Mythical son extremadamente raros y pueden no aparecer fuera de DEEP muy grande. | Difícil validar colas; riesgo de que tiers superiores sean virtualmente inaccesibles. |
| `BALANCED` | Son raros, ordenados y observables en campañas DEEP sin volverse expectativa ordinaria. | Requiere cohortes grandes y acceptance por intervalos; preserva utilidad diagnóstica. |
| `GENERATIVE` | Carreras extraordinarias aparecen con mayor frecuencia. | Riesgo de comprimir diferenciación, saturar leaderboard y compensar upstream con Scoring. |

**Recomendación:** `BALANCED`. G3D-3D debe fijar, por tier y compatibility key,
intervalos de frecuencia, tamaño mínimo DEEP, tolerancia de posición/oportunidad,
zero-observation handling y tail confidence. No se fija cap ni probability floor.

## 9. Best-run policy

| Opción | Fairness / farming | UX / audit | Privacy e identidad |
|---|---|---|---|
| A. Todas las Careers elegibles rankean | Favorece volumen de intentos y llena la tabla con una persona. | Simple de enviar, ruidosa de leer; audit completo. | Puede exponer multiplicidad de actividad. |
| B. Mejor Career por user + exact compatibility key | Reduce duplicate farming visible sin cambiar probabilidades ni limitar intentos. | Leaderboard legible; perfil e historial conservan todos los runs. | Requiere `LeaderboardUserKey` pseudónimo/estable y policy DR-037. |
| C. Única submission por ruleset | Fuerte anti-farming, pero castiga replay y exige elección/revocación. | Más fricción y casos operativos; audit complejo. | Minimiza filas pero aumenta sensitivity de account linkage. |

Se aprueba la dirección **B** para V1. El motor no descarta Careers ni altera
seed/outcomes. La proyección principal selecciona canónicamente el mayor score
elegible; en empate usa `careerFinalizedAtLogicalOrder`, luego `careerId`
canónico, sin RNG. Todas las Careers permanecen en audit/profile conforme a
retención y visibilidad. Antes de `FROZEN_FOR_V1` faltan definir user key,
guest/account merge, deletion y appeal en DR-030/034/037/041. No se autoriza
comparabilidad cross-version: la compatibility key sigue siendo exacta.

## 10. Quick/Custom y otras tolerancias

- `PRODUCT_OWNER` aprueba tolerancias de SMD, mediana, quantiles, W1, KS y tier
  probabilities.
- `CALIBRATION_OWNER` prepara sensitivity y tradeoffs sobre el mismo
  `CalibrationSeedSet`; no aprueba la intención de producto.
- `TECHNICAL_VALIDATOR` confirma aggregation y reproducibilidad.
- Las tolerancias se congelan en G3D-3D antes del acceptance competitivo de
  Creation; G3D-3A no asigna números.

El mismo patrón aplica a tier rarity, social balance, comeback y finalization
frequency. Una tolerance es `PRODUCT_DEFINED`, no external observation.

## 11. Mapeo de las trece direcciones G3D-2

| Freeze level G3D-3A | Decisions |
|---|---|
| `FROZEN_FOR_V1` | `PD-G3D-001..007`, `PD-G3D-012..015` |
| `APPROVED_DIRECTION` + `NUMERIC_TARGET_REQUIRED` | `PD-G3D-008`, `PD-G3D-010`, `PD-G3D-011` |
| `PROPOSED` + `NUMERIC_TARGET_REQUIRED` | `PD-G3D-009` (`BALANCED` recomendado) |

Las trece direcciones aprobadas en G3D-2 son 001–008 y 010–014. G3D-3A no
reabre ninguna; solo distingue direction freeze de numeric acceptance. 009 y
015 pertenecían al track nuevo; 015 queda congelada por ADR-084 y 009 conserva
aprobación numérica pendiente.

## 12. Referencias

- [Vertical Slice Data Catalog](VERTICAL_SLICE_DATA_CATALOG_SPEC.md)
- [Calibration Target Registry](CALIBRATION_TARGET_REGISTRY.md)
- [Reference Snapshot Policy](G3D_REFERENCE_SNAPSHOT_POLICY.md)
- [G3D Data Governance](G3D_DATA_GOVERNANCE.md)
- [G3D P0 Acquisition Spec](G3D_P0_ACQUISITION_SPEC.md)
- [ADR-081](adr/081-hybrid-external-club-pool.md)
- [ADR-082](adr/082-vertical-slice-sporting-nationality.md)
- [ADR-083](adr/083-native-money-and-calibration-normalization.md)
- [ADR-084](adr/084-main-leaderboard-best-career-projection.md)
