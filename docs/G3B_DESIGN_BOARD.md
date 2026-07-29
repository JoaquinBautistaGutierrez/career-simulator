# G3B — Mathematical Design Board

Estado: **resolución por bloques en curso**. Los Bloques 1 — Fundamental Player
Model, 2 — Development & Aging y 3 — Role + Minutes fueron resueltos en su
alcance estructural el 2026-07-27; los Bloques 4 — Performance, 5 — Health y
6 — Club, Competitions & World, 7 — Transfers, Market & Contracts y
8 — National Team & Awards y 9 — Reputation, Social & Retirement, el
2026-07-28. Las fichas conservan sus
preguntas y opciones originales como trazabilidad; cada resolución indica qué
quedó cerrado y qué permanece para calibración o para otro bloque. Este tablero
no sustituye sus DR ni autoriza implementación de gameplay.

## Cómo usar este tablero

- Resolver primero las fichas `MUST_BEFORE_G3B` en el orden recomendado al final.
- Tratar las opciones como alternativas de discusión, no como recomendaciones.
- Mantener coeficientes, tablas y targets fuera del código mediante configuración versionada.
- Si una respuesta cambia replay, facts, scoring o una frontera normativa, formalizarla después en el DR/ADR que corresponda.

Fuentes abreviadas: [MES](./MATHEMATICAL_ENGINE_SPEC.md) = especificación
matemática; [PM](./PLAYER_MODEL_SPEC.md) = modelo fundamental del jugador;
[DA](./DEVELOPMENT_AGING_SPEC.md) = desarrollo y envejecimiento;
[RM](./ROLE_MINUTES_SPEC.md) = rol y minutos;
[PF](./PERFORMANCE_MODEL_SPEC.md) = rendimiento y producción;
[HI](./HEALTH_INJURY_SPEC.md) = salud, lesiones y recuperación;
[CCW](./CLUB_COMPETITION_WORLD_SPEC.md) = clubes, competiciones y mundo;
[TMC](./TRANSFER_MARKET_CONTRACT_SPEC.md) = transferencias, mercado y contratos;
[NTA](./NATIONAL_TEAM_AWARDS_SPEC.md) = selección nacional y premios;
[RSR](./REPUTATION_SOCIAL_RETIREMENT_SPEC.md) = reputación, social, retiro y
regreso;
[DR](./DECISIONS_REQUIRED.md) = registro de decisiones;
[MS](./MASTER_SPEC.docx) = especificación maestra. La resolución del Bloque 1
se formaliza en [ADR-052](./adr/052-fundamental-player-model.md) y la estructura
del Bloque 2 en
[ADR-053](./adr/053-development-and-aging-model.md) y la estructura del Bloque
3 en [ADR-054](./adr/054-role-and-minutes-model.md), la del Bloque 4 en
[ADR-055](./adr/055-performance-and-production-model.md), la del Bloque 5 en
[ADR-057](./adr/057-health-injury-recovery-model.md) y la del Bloque 6 en
[ADR-022](./adr/022-club-competition-world-model.md). La estructura del Bloque
7 se formaliza en
[ADR-058](./adr/058-transfer-market-contract-model.md) y
[`TRANSFER_MARKET_CONTRACT_SPEC.md`](./TRANSFER_MARKET_CONTRACT_SPEC.md). La
estructura del Bloque 8 se formaliza en
[ADR-059](./adr/059-national-team-model.md),
[ADR-060](./adr/060-awards-model.md) y
[`NATIONAL_TEAM_AWARDS_SPEC.md`](./NATIONAL_TEAM_AWARDS_SPEC.md). La estructura
del Bloque 9 se formaliza en
[ADR-061](./adr/061-reputation-and-social-model.md),
[ADR-062](./adr/062-playing-retirement-and-comeback.md) y
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](./REPUTATION_SOCIAL_RETIREMENT_SPEC.md).

---

## A. Player Model

### G3B-A01 — Catálogo canónico de capacidades

**ID:** G3B-A01  
**Pregunta:** ¿Qué capacidades técnicas, físicas, mentales y tácticas individuales forman el vector canónico del jugador, y cuáles son comunes o específicas por posición?  
**Por qué importa:** Define la dimensionalidad de `PlayerState` y todos los inputs posteriores; usar solo macroatributos contradiría el modelo sin overall único.  
**Opciones razonables:**

- A. Vector granular común con proyecciones posicionales.
- B. Núcleo común más módulos específicos para GK, CM y ST.
- C. Jerarquía de macrocapacidades derivadas de subcapacidades canónicas.

**Dependencias:** Ninguna.  
**Bloquea:** schema de capacidades; calidad efectiva; desarrollo; producción por posición.  
**Fuente:** MES §5.1, §5.2, §9; DR-008, DR-052; MS §8, §10.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** Vector común de veinte capabilities para todos los
jugadores, agrupado en `TECHNICAL`, `PHYSICAL`, `MENTAL` y `TACTICAL`, según
ADR-052 y `PLAYER_MODEL_SPEC.md` §3.  
**Alternativas rechazadas:** Macroatributos como estado causal; módulos que
eliminen capacidades según posición; catálogos abiertos en esta fase.  
**Motivo:** Un catálogo común conserva causalidad, comparabilidad y
reconversiones sin introducir un overall.  
**Dependencias desbloqueadas:** G3B-A02, G3B-A03, G3B-A04 y schemas futuros de
`TruePlayerState`.  
**Parámetros aún calibrables:** Distribuciones, correlaciones y relevancias
posicionales; ninguno cambia el catálogo.

### G3B-A02 — Escala, precisión y representación

**ID:** G3B-A02  
**Pregunta:** ¿Qué escala numérica, precisión y reglas de frontera usan internamente, en persistencia y en presentación las capacidades y estados continuos?  
**Por qué importa:** Sin una representación canónica no pueden fijarse invariantes, evolución, hashes ni conversiones de UI.  
**Opciones razonables:**

- A. Enteros 0–100 internos y visibles.
- B. Continuo 0–1 interno y persistido, con presentación derivada.
- C. Entero de alta resolución interno, con escala 0–100 solo editorial.
- D. Escala estandarizada interna sin límites editoriales, con read model acotado.

**Dependencias:** G3B-A01.  
**Bloquea:** schemas numéricos; precisión de fórmulas; serialización; calibración.  
**Fuente:** MES §5.7, §25; DR-052; MS §8.3, §36; ADR-002, ADR-007.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** `CapabilityValue` y `TraitValue` son enteros canónicos
`0..10000`, inclusive. La presentación es una proyección derivada y no concede
conocimiento exacto. Valores inválidos se rechazan sin clamping ni redondeo
implícito.  
**Alternativas rechazadas:** 0–100 como persistencia canónica; floating-point
0–1 como estado principal; usar la escala visible como verdad mecánica.  
**Motivo:** La escala entera de alta resolución conserva precisión determinista
y separa estado de presentación.  
**Dependencias desbloqueadas:** Invariantes y validación de capabilities/traits,
serialización y frontera `TruePlayerState`/UI.  
**Parámetros aún calibrables:** Proyecciones editoriales y bandas de
conocimiento; no la escala canónica.

### G3B-A03 — Capas temporales y propiedad del estado

**ID:** G3B-A03  
**Pregunta:** ¿Cómo se separan y almacenan identidad persistente, capacidades lentas, estado de temporada, estado Q1–Q4 y valores derivados?  
**Por qué importa:** Evita mezclar hechos históricos con proyecciones recalculables o reescribir resultados ya cerrados.  
**Opciones razonables:**

- A. Objetos explícitos por cadencia con agregados derivados.
- B. Registro tipado de variables con metadatos de cadencia.
- C. Estado materializado más historial de facts suficiente para reconstrucción.

**Dependencias:** G3B-A01, G3B-A02.  
**Bloquea:** `PlayerState`; snapshots por Q; facts de cambio; replay matemático.  
**Fuente:** MES §4.4, §5.7, §10, §24; DR-063; ADR-042, ADR-043.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** Separación normativa entre `CAPABILITIES`, `TRAITS` y
`DYNAMIC_STATES`; valores derivados y `PlayerKnowledge` quedan fuera del estado
causal persistente correspondiente. Una fluctuación temporal no escribe
directamente una capability.  
**Alternativas rechazadas:** Objeto plano sin cadencia; mezclar forma o fitness
con capacidades; reconstruir mutaciones permanentes desde ratings derivados.  
**Motivo:** La propiedad explícita del estado impide doble fuente de verdad y
mutaciones retroactivas.  
**Dependencias desbloqueadas:** Estructura de `TruePlayerState`, snapshots y
fronteras de mutación para desarrollo y estados Q.  
**Parámetros aún calibrables:** Dominios, persistencia y ecuaciones de cada
`DYNAMIC_STATE`.

### G3B-A04 — Variables latentes y correlación inicial

**ID:** G3B-A04  
**Pregunta:** ¿Qué variables latentes existen como causas propias y qué estructura conjunta evita sortearlas como factores independientes?  
**Por qué importa:** Profesionalismo, fragilidad, adaptación, motivación y volatilidad alimentan varios subsistemas y pueden duplicarse si no comparten causa.  
**Opciones razonables:**

- A. Latentes nombradas con distribución conjunta explícita.
- B. Factores latentes de baja dimensión proyectados a rasgos.
- C. Modelo híbrido: factores compartidos más latentes específicas.

**Dependencias:** G3B-A01, G3B-A02.  
**Bloquea:** creación correlacionada; desarrollo; salud; rendimiento; retiro.  
**Fuente:** MES §5.5, §5.6, §23; DR-008, DR-052; MS §8.4, §10.2.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA EN SU ESTRUCTURA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** Diez traits latentes iniciales y una generación mediante
perfil latente y distribución conjunta correlacionada. Los arquetipos son
componentes estadísticos blandos, nunca clases rígidas.  
**Alternativas rechazadas:** Sorteos uniformes independientes; arquetipos que
bloqueen combinaciones; duplicar una predisposición en cada subsistema.  
**Motivo:** La estructura compartida conserva coherencia causal y soporte
positivo para perfiles compatibles sin convertir parámetros de balance en
schema.  
**Dependencias desbloqueadas:** G3B-A05, generación inicial, inputs
estructurales de desarrollo, salud y retiro.  
**Parámetros aún calibrables:** Familia conjunta, medias, dispersiones,
correlaciones, perfiles, pesos de mezcla y colas.

### G3B-A05 — Observabilidad y calidad percibida

**ID:** G3B-A05  
**Pregunta:** ¿Qué variables ve el usuario como valor exacto, intervalo, categoría o señal, y cómo se representa la estimación percibida separada del valor verdadero?  
**Por qué importa:** Transferencias, selección y mercado deben usar percepción; los presets solo pueden cambiar presentación, no mecánica.  
**Opciones razonables:**

- A. Hechos exactos visibles y capacidades ocultas con bandas.
- B. Intervalos probabilísticos cuya amplitud depende de información.
- C. Señales categóricas más estimación numérica interna no expuesta.

**Dependencias:** G3B-A02, G3B-A04.  
**Bloquea:** `PerceivedPlayerState`; dificultad informativa; transferencias; selección.  
**Fuente:** MES §4.2, §5.7, §6.5; DR-020, DR-052; ADR-020.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** Separar `TruePlayerState` de `PlayerKnowledge`.
Cada conocimiento pertenece a un observador y puede contener estimación,
incertidumbre o confianza, punto reproducible de observación y contexto.  
**Alternativas rechazadas:** Exponer siempre valores verdaderos; un único
`PerceivedPlayerState` global; tratar la presentación como estado mecánico.  
**Motivo:** La misma realidad debe admitir conocimiento imperfecto y diferente
por observador sin alterar probabilidades por preset de dificultad.  
**Dependencias desbloqueadas:** Contrato futuro de knowledge, scouting,
percepción de clubes y ratings de presentación.  
**Parámetros aún calibrables:** Precisión, incertidumbre, actualización,
deterioro y proyecciones visibles.

### G3B-A06 — Calidad actual y potencial probabilístico

**ID:** G3B-A06  
**Pregunta:** ¿Cómo se proyecta calidad efectiva desde capacidades sin crear un overall canónico, y qué objeto probabilístico representa el potencial?  
**Por qué importa:** La calidad contextual y la distribución de trayectorias son inputs distintos; colapsarlos produciría techos o futuros garantizados.  
**Opciones razonables:**

- A. Proyecciones posicionales/contextuales más parámetros de distribución de trayectorias.
- B. Mezcla de arquetipos con calidad por tarea y ensemble de curvas futuras.
- C. Función no lineal por contexto más belief state actualizable sobre desarrollo.

**Dependencias:** G3B-A01, G3B-A02, G3B-A04, G3B-A05.  
**Bloquea:** calidad efectiva; potencial; rol; desarrollo; valor percibido.  
**Fuente:** MES §5–§6, §9; Player Model Spec §8; Performance Spec §4; DR-008, DR-052, DR-053, DR-055; MS §10.3.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** No existe overall causal, `potentialOverall`, ceiling por
capability ni pico garantizado. El potencial verdadero es la distribución
condicional de trayectorias futuras por capability; sus estimaciones pertenecen
a `PlayerKnowledge`. `EffectiveCapabilities` es una proyección contextual única
desde capabilities verdaderas, estados dinámicos, posición, rol, presión y
contexto táctico. No se persiste ni muta `TrueCapabilities`; todos los modelos
posicionales consumen el mismo contrato de resolución.  
**Alternativas rechazadas:** Overall almacenado; techo futuro único; edad de
pico garantizada; ceilings individuales; `effectiveCapability` persistida como
atributo; transformaciones efectivas duplicadas por posición.  
**Motivo:** Development & Aging cierra la semántica del potencial y Performance
cierra la frontera entre estado verdadero y proyección contextual sin convertir
una calibración futura en destino causal o segunda verdad.  
**Dependencias desbloqueadas:** Potencial y picos observados pueden modelarse
sin migrar `TruePlayerState`; Role & Minutes y los modelos `GK`/`CM`/`ST`
pueden consumir una proyección común; el desarrollo ya no depende de un overall
futuro.  
**Parámetros aún calibrables:** Familia y parámetros de trayectorias,
resistencia a extremos, incertidumbre, dominio/precisión intermedia,
transformaciones efectivas, sensibilidades dinámicas e interacciones. Las
funciones ejecutables permanecen en G3B-B02/B03 y G3B-D02/DR-055, pero ya no
reabren la decisión estructural de A06.

**Refinamiento de Bloque 3:** Role & Minutes consume una proyección de calidad
contextual para la `effectivePosition`, pero no la calcula ni la persiste.
`tacticalFit`, `managerTrust` y calidad son inputs distintos. La función de
proyección y su interacción con Performance quedan delimitadas por
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md); su matemática continúa
en G3B-D02/DR-055.

---

## B. Development & Aging

### G3B-B01 — Cadencia y orden del desarrollo

**ID:** G3B-B01  
**Pregunta:** ¿Qué componentes de desarrollo se aplican por Q y cuáles al cierre de temporada, y en qué orden consumen minutos, forma, salud y entorno confirmados?  
**Por qué importa:** El orden cambia causalidad y replay; el desarrollo no puede usar resultados futuros ni reescribir ventanas cerradas.  
**Opciones razonables:**

- A. Microdelta por Q y consolidación anual.
- B. Acumuladores de exposición por Q con una sola aplicación anual.
- C. Desarrollo lento por Q y declive estructural al cierre.

**Dependencias:** G3B-A03.  
**Bloquea:** pipeline de `developmentDelta`; cursor matemático; facts de desarrollo.  
**Fuente:** MES §7, §10, §21.2; DR-008, DR-063; ADR-042, ADR-043.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** Desarrollo y declive se evalúan en cada Q como un vector
por capability dentro de `CONSEQUENCES(Qn)`. El vector se valida y aplica una
sola vez, atómicamente, y su resultado alimenta las ventanas posteriores.
`SEASON_CLOSE` solo consolida historia.  
**Alternativas rechazadas:** Aplicación anual única; desarrollo por Q y declive
anual separado; reaplicar acumuladores al cierre; lectura de hechos futuros.  
**Motivo:** Preserva la causalidad de ADR-042 y evita duplicar deltas o
reescribir una ventana cerrada.  
**Dependencias desbloqueadas:** Pipeline de evolución, snapshots Q, diseño de
facts de DR-063 y reanudación exacta.  
**Parámetros aún calibrables:** Magnitudes y contribuciones por Q; no la
cadencia ni la atomicidad.

### G3B-B02 — Ecuación causal de desarrollo

**ID:** G3B-B02  
**Pregunta:** ¿Qué forma funcional combina talento, capacidad de desarrollo, profesionalismo, minutos, club, entrenador, salud, forma, contexto y azar?  
**Por qué importa:** Define qué variables son causas y cómo evitar sumar dos veces proxies del mismo entorno o rendimiento.  
**Opciones razonables:**

- A. Modelo aditivo en espacio latente con interacciones declaradas.
- B. Modelo multiplicativo de oportunidad × conversión de desarrollo.
- C. Modelo jerárquico por dimensión con shocks compartidos e idiosincráticos.

**Dependencias:** G3B-A01, G3B-A04, G3B-A06, G3B-B01, G3B-C05, G3B-E01, G3B-F01.  
**Bloquea:** fórmula `developmentDelta`; trazabilidad causal; tests de invariantes.  
**Fuente:** MES §7.1, §7.3, §12; DR-008, DR-053; MS §10.4.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** El cambio neto es por capability y debe mantener
distinguibles causas equivalentes a `maturationComponent`,
`acquiredDevelopmentComponent`, `wearComponent` y `stochasticComponent`.
`naturalTalent`, `developmentCapacity`, `professionalism`, exposición, entorno,
salud y edad conservan rutas causales explícitas.  
**Alternativas rechazadas:** `overallDelta`; mezclar todas las causas en un
único bonus opaco; garantizar mejora por minutos, club o professionalism;
contar dos veces proxies de entorno o rendimiento.  
**Motivo:** Cierra la descomposición auditable y la unidad de cambio sin elegir
una función que todavía requiere los bloques dependientes.  
**Dependencias desbloqueadas:** Interfaz de componentes, traza causal, registro
de parámetros y tests estructurales por capability.  
**Parámetros aún calibrables:** Forma de combinación, interacciones,
coeficientes, dispersiones, covarianza, precisión y cuantización. La ecuación
ejecutable depende todavía de G3B-C05, G3B-E01/E07 y G3B-F01.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** se adopta espacio logit
seguro y
`deltaZ = maturation + acquired - wear + familyShock + specificShock`.
Maturation usa ventana logística derivada; acquired/wear usan predictors
aditivos y softplus; los shocks son Normal jerárquicos. Ya no falta familia
matemática. Faltan valores del ParameterSet y señales calibradas de módulos
upstream. Véase
[`CREATION_DEVELOPMENT_MATH_SPEC.md`](CREATION_DEVELOPMENT_MATH_SPEC.md).

### G3B-B03 — Familia de curvas y timing del pico

**ID:** G3B-B03  
**Pregunta:** ¿Qué familia de distribuciones permite curvas tempranas, tardías, escalonadas, interrumpidas y con renacimiento sin fijar una edad universal de pico?  
**Por qué importa:** La familia elegida determina la topología de trayectorias posibles antes de calibrar edades o dispersiones.  
**Opciones razonables:**

- A. Curvas paramétricas flexibles con timing y amplitud latentes.
- B. Proceso por estados de carrera con transiciones probabilísticas.
- C. Proceso estocástico por dimensión con deriva dependiente de edad.

**Dependencias:** G3B-A04, G3B-A06, G3B-B01.  
**Bloquea:** peak timing; curvas de desarrollo; seeds doradas de trayectoria.  
**Fuente:** MES §6.2–§6.4, §7.2; DR-008, DR-053; MS §10.3, §10.5.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — ampliada el 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** No se persiste una edad exacta de pico. Un perfil latente
blando parametriza inicio, velocidad, estabilización y sensibilidad al declive.
Las capabilities se asignan a `EXPLOSIVE_PHYSICAL`, `STRUCTURAL_PHYSICAL`,
`TECHNICAL`, `MENTAL` o `TACTICAL`; las familias seleccionan parámetros y no
imponen una curva común. El proceso debe admitir plateaus y resurgimientos.  
**Alternativas rechazadas:** Edad universal o individual garantizada; etapas
rígidas; curva monotónica única; `potentialOverall` usado como destino.  
**Motivo:** Quedan cerradas la topología mínima, las familias y el estado
latente sin contradecir la orden explícita de no seleccionar todavía una familia
matemática.  
**Dependencias desbloqueadas:** Parametrización por familia, picos
retrospectivos y trayectorias no monotónicas.  
**Parámetros aún calibrables:** Familia de proceso, dominios y distribución del
perfil, timing, amplitud, dispersiones, shocks y correlaciones. La distribución
ejecutable sigue pendiente en DR-053.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** la familia queda
cerrada: perfil jerárquico por familia y ventana suave
`4*sigmoid(u)*(1-sigmoid(u))`, sin peakAge. Shift, tempo y decline sensitivity
se generan mediante factores Normal y transforms `tanh/exp`. Faltan medias,
loadings, centers, widths y targets.

### G3B-B04 — Declive y longevidad individual

**ID:** G3B-B04  
**Pregunta:** ¿Cómo se modelan inicio, velocidad, asimetría por capacidad y variación individual del declive y la longevidad?  
**Por qué importa:** Un único declive por edad impondría destinos rígidos y haría equivalentes perfiles físicamente distintos.  
**Opciones razonables:**

- A. Parámetros latentes por familia de capacidades.
- B. Estados de declive con hazards de transición.
- C. Deriva continua por dimensión con shocks persistentes.

**Dependencias:** G3B-A01, G3B-A04, G3B-B03.  
**Bloquea:** decline; longevidad; calidad tardía; retiro.  
**Fuente:** MES §6.3, §7.2, §12; DR-008, DR-053; MS §10.5, §17.3.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — ampliada el 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** `wearComponent` actúa por capability y puede depender de
edad, carga acumulada, salud, historial, contexto y `longevity`. Este trait
modifica probabilísticamente mantenimiento, desgaste, velocidad de declive y
respuesta a edades avanzadas. El declive no es absorbente ni uniforme.  
**Alternativas rechazadas:** Longevidad idéntica para todos; edad máxima
obligatoria; threshold `age >= X`; un único ritmo de declive; impedir mejora
después de declinar.  
**Motivo:** Cierra las causas, la asimetría y el soporte de trayectorias sin
convertir longevidad en una fecha.  
**Dependencias desbloqueadas:** Interfaz de wear, respuesta diferenciada por
familia y consumo posterior por retiro.  
**Parámetros aún calibrables:** Curva de wear, sensibilidad a edad, efecto de
longevity, interacciones de carga/salud, shocks y distribución. La forma
ejecutable continúa pendiente en DR-053 y Health.

**Refinamiento de Bloque 3:** Wear y experiencia solo pueden consumir
`actualMinutes`/carga confirmados. `expectedMinutes` y `SportingRole` no son
exposición realizada. La función de carga y su interacción con Health siguen
pendientes de G3B-E01/DR-057.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** wear queda definido
como softplus de edad continua, load, health/sequela burden,
declineSensitivity, Longevity y mantenimiento por Professionalism. No hay
threshold ni estado absorbente. Faltan coeficientes y las señales cuantitativas
que cerrará G3C-5.

### G3B-B05 — Interacciones, reversibilidad y fronteras

**ID:** G3B-B05  
**Pregunta:** ¿Qué daños o mejoras son temporales, recuperables o permanentes, y cómo interactúan edad, lesiones, entorno y decisiones con desarrollo y declive?  
**Por qué importa:** Define fronteras físicas sin convertir resultados raros en imposibles ni permitir recuperación incoherente.  
**Opciones razonables:**

- A. Componentes base, temporales y secuelas persistentes separados.
- B. Un estado por capacidad con shocks y tasas de reversión distintas.
- C. Capacidad estructural más modificadores trazables con expiración o permanencia.

**Dependencias:** G3B-A03, G3B-B02, G3B-B04, G3B-E07.  
**Bloquea:** aplicación de secuelas; recuperación de forma física; invariantes de capacidad.  
**Fuente:** MES §7.3, §14.4, §25; DR-004, DR-008, DR-057; ADR-004, ADR-057.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** Capabilities, estados dinámicos, estados de lesión y
secuelas permanecen separados. Una lesión sigue `health event -> injury state
-> recovery -> possible sequela -> capability/development consequences`; no
escribe directamente una pérdida permanente rígida. Una secuela confirmada
puede alimentar evolución posterior.  
**Alternativas rechazadas:** Fatiga que modifica capacidades permanentes;
lesión que resta atributos al ocurrir; recuperación idéntica por familia;
declive irreversible por definición.  
**Motivo:** Se fija la frontera de propiedad entre Health y Development y se
evitan mutaciones retroactivas.  
**Dependencias desbloqueadas:** Contrato de entrada de secuelas y tests de no
escritura directa.  
**Parámetros aún calibrables:** Catálogo, duración, reversibilidad y magnitud de
secuelas, además de su efecto sobre los componentes. G3B-E07/DR-057 siguen
abiertos.

**Refinamiento de Bloque 3:** Disponibilidad y minutos confirmados son estados
de entrada auditables; no escriben capabilities por sí mismos. Health puede
consumir exposición después de Performance y solo consecuencias posteriores
confirmadas pueden alcanzar Development.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** el vector logit completo
se calcula con un snapshot, conserva componentes y se cuantiza/aplica
atómicamente. Health solo entra mediante load, burden y secuela confirmados.
Falta calibrar el mapping de esas señales en G3C-5, no una familia de fórmula.

### G3B-B06 — Reconversión y alcance posicional

**ID:** G3B-B06  
**Pregunta:** ¿Qué matriz de compatibilidad, evidencia, duración y alcance rige reconversiones, y puede el slice salir de GK/CM/ST?  
**Por qué importa:** El engine necesita saber qué posiciones puede producir y cuándo actualizar compatibilidad antes de registrar uso efectivo.  
**Opciones razonables:**

- A. Reconversiones solo entre GK, CM y ST en el slice.
- B. Reconversiones a cualquier posición canónica con producción genérica fuera del slice.
- C. Bloquear salida del slice, pero modelar compatibilidades futuras en datos.

**Dependencias:** G3B-A01, G3B-A06, G3B-B02, G3B-F02.  
**Bloquea:** DR-048; transición posicional; `effectivePosition`; cohortes y premios.  
**Fuente:** MES §7.4, §21.2; DR-008, DR-048; ADR-011, ADR-018, ADR-044.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** Development no cambia capacidades para justificar una
posición. La evolución del perfil puede modificar probabilidades de
reconversión, pero la transición debe surgir además de contexto, decisiones y
uso efectivo; no se garantiza compatibilidad.  
**Alternativas rechazadas:** Bonus o penalización de atributos para forzar una
posición; reconversión automática al cruzar un threshold; compatibilidad
garantizada por una familia de maduración.  
**Motivo:** Conserva la dirección causal de ADR-044.  
**Dependencias desbloqueadas:** Reconversión puede consumir el perfil real
evolucionado sin escribirlo retrospectivamente.  
**Parámetros aún calibrables:** Matriz, evidencia, duración, hazards y coste.
El alcance fuera de `GK`/`CM`/`ST` y DR-048 permanecen abiertos con G3B-F02.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** opportunity/completion
usan logistic/log-odds y candidata usa stable softmax sobre suitability, uso,
táctica, edad suave, Adaptability e historia. El slice habilita solo
`GK/CM/ST`; el resto queda `CONTENT_DISABLED`. DR-048 queda resuelta. Faltan
coeficientes, priors y targets de reconversión.

### G3B-B07 — Parámetros de desarrollo y reconversión

**ID:** G3B-B07  
**Pregunta:** ¿Qué coeficientes, priors, dispersiones y targets de validación se externalizan para desarrollo, pico, declive y reconversión?  
**Por qué importa:** Son valores de balance versionables; no deben fijar la arquitectura ni quedar hardcoded.  
**Opciones razonables:**

- A. Un set por posición y rango etario.
- B. Set jerárquico global con overrides por dimensión/contexto.
- C. Parámetros por arquetipo con defaults compartidos.

**Dependencias:** G3B-B02, G3B-B03, G3B-B04, G3B-B05, G3B-B06.  
**Bloquea:** calibración Monte Carlo de progresión; no bloquea schemas si el registro es externo.  
**Fuente:** MES §7, §26; DR-008, DR-053; MS §10.4–§10.5.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN — 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** Curvas por familia, sensibilidad etaria, resistencia a
extremos, dispersiones, efectos causales, wear, longevidad, secuelas y perfil
de maduración vivirán en un Parameter Registry versionado.  
**Alternativas rechazadas:** Constantes hardcoded; valores provisionales
dispersos; parámetros implícitos en arquetipos rígidos.  
**Motivo:** Son balance y calibración, no estructura del modelo.  
**Dependencias desbloqueadas:** Diseño de contratos de configuración y harness
Monte Carlo sin elegir valores.  
**Parámetros aún calibrables:** Todos los enumerados en
`DEVELOPMENT_AGING_SPEC.md` §14; esta ficha no queda numéricamente cerrada.

---

## C. Playing Time & Role

### G3B-C01 — Semántica mecánica de roles

**ID:** G3B-C01  
**Pregunta:** ¿Qué significado mecánico y orden, si alguno, tienen OUT_OF_SQUAD, PROSPECT, BENCH, ROTATION, STARTER, KEY_PLAYER y STAR?  
**Por qué importa:** Los nombres están aprobados, pero faltan sus contratos sobre expectativa, elegibilidad y distribución de minutos.  
**Opciones razonables:**

- A. Estados ordinales con parámetros de minutos por contexto.
- B. Categorías nominales derivadas de una variable continua de rol.
- C. Estados con transiciones explícitas y subestado continuo de expectativa.

**Dependencias:** G3B-A01, G3B-F02.  
**Bloquea:** `RoleState`; transición de rol; minutos; narrativa de plantilla.  
**Fuente:** MES §8.1, §8.3; DR-008; MS §10.6.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** El vocabulario se divide en `SquadStatus`
(`OUT_OF_SQUAD`, `PROSPECT`, `SQUAD_PLAYER`, `FIRST_TEAM`), `SportingRole`
(`BENCH`, `ROTATION`, `STARTER`, `KEY_PLAYER`, `STAR`) y `EffectiveUsage`.
Representan respectivamente relación institucional, expectativa de la ventana
y participación confirmada. No existe un enum combinado ni porcentajes fijos
por rol; `PROSPECT` puede coexistir con cualquier `SportingRole`.  
**Alternativas rechazadas:** Un único orden de siete roles; equiparar prospecto
con pocos minutos; convertir cada rol en una banda o garantía de exposición.  
**Motivo:** Separa estado, expectativa y resultado, y preserva varianza sin
introducir thresholds editoriales.  
**Dependencias desbloqueadas:** Schema conceptual de rol; frontera entre rol y
uso; narrativa institucional; contrato de entrada para minutos y Performance.  
**Parámetros aún calibrables:** Priors, transición/persistencia y distribuciones
condicionadas. No reabren la separación estructural.

### G3B-C02 — Confianza del entrenador

**ID:** G3B-C02  
**Pregunta:** ¿La confianza del entrenador es un estado persistente separado de rol y forma, qué evidencia admite y qué subsistemas pueden leerlo?  
**Por qué importa:** Si confianza, rol y rendimiento son el mismo valor, el efecto de éxito o fracaso se contará varias veces.  
**Opciones razonables:**

- A. Estado continuo con persistencia y shocks acotados.
- B. Belief del entrenador sobre calidad, separado de confianza relacional.
- C. Sin estado propio: efecto derivado solo de evidencia reciente y manager.

**Dependencias:** G3B-A03.  
**Bloquea:** transiciones de rol; minutos futuros; causalidad rendimiento↔rol.  
**Fuente:** MES §5.4, §8.2, §11; DR-008, DR-054, DR-056.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — ampliada el 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** `managerTrust` es un `DYNAMIC_STATE` separado de rol,
forma, capability verdadera, rendimiento, `tacticalFit` y conocimiento general.
Role & Minutes lee el valor confirmado al inicio de Q como modificador
probabilístico; nunca lo usa como threshold. La evidencia de Qn solo puede
actualizarlo después para Qn+1.  
**Alternativas rechazadas:** Usar rol como confianza; reescribir capabilities
por confianza; regla binaria por confianza alta/baja; contar la misma evidencia
como calidad, forma y confianza; feedback instantáneo en la misma Q.  
**Motivo:** La frontera operacional evita doble conteo y circularidad, pero la
ecuación de actualización pertenece a DR-056.  
**Dependencias desbloqueadas:** Input causal para rol/minutos y orden Qn→Qn+1.  
**Parámetros aún calibrables:** Dominio, persistencia, reversión, evidencia,
shocks y magnitud de influencia. G3B-C02 sigue parcial hasta Performance/DR-056.

**Cierre G3C-3 — `PARTIAL_CALIBRATION` (2026-07-29):** Role & Minutes
consume un `trustSignal ∈ [-1,1]` mediante coeficientes no negativos en las
utilities de role y el predictor de minutos. El owner conserva su estado y
dinámica; Role & Minutes no lo actualiza ni lo usa como threshold. Se rechazan
overall relacional, binarización y feedback de Q actual. Quedan calibrables
transforms upstream, coeficientes y targets; Performance/G3C-4 cerrará señales
y DR-056 la dinámica, sin reabrir esta interfaz.

### G3B-C03 — Campo abstracto de competencia

**ID:** G3B-C03  
**Pregunta:** ¿Cómo representa `SquadCompetitionField` la calidad, profundidad, posición y volatilidad de compañeros sin simular una plantilla completa?  
**Por qué importa:** La competencia es necesaria para rol y minutos, pero una media única no captura titulares, profundidad ni lesiones del plantel.  
**Opciones razonables:**

- A. Distribución de rivales por posición y estrato de rol.
- B. Top competitor más masa agregada de profundidad.
- C. Field jerárquico por posición, táctica y temporada.

**Dependencias:** G3B-F01, G3B-J01.  
**Bloquea:** competencia interna; rol esperado; sustituciones abstractas; minutos.  
**Fuente:** MES §8.2, §8.3; DR-008, DR-022, DR-054.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** `PositionCompetition` es un field agregado por
posición/contexto con conceptos equivalentes a `competitionStrength`,
`competitionDepth` y `positionStability`/`entrenchment`. No representa
competidores individuales. Puede correlacionarse con la fuerza del club, pero
esta no determina universalmente la competencia.  
**Alternativas rechazadas:** Plantilla completa ficticia; media única sin
profundidad; dificultad determinada solo por prestigio o strength global.  
**Motivo:** Proporciona la estructura mínima para rol/minutos sin ampliar el
scope a simulación de planteles.  
**Dependencias desbloqueadas:** Contrato abstracto de competencia para DR-054.  
**Parámetros aún calibrables:** Escalas, distribución, volatilidad,
correlaciones y evolución. G3B-F01/J01 y DR-022 siguen abiertos.

**Cierre G3C-3 — `PARTIAL_CALIBRATION` (2026-07-29):** se adopta una
combinación convexa parametrizada de `competitionStrength`,
`competitionDepth` y `entrenchment`, proyectada a `[-1,1]`. En role/minutes
entra con signo negativo y monotonicidad de expectativa. Se rechazan
competidores individuales, media única y efectos de signo libre. Quedan
calibrables los pesos y el field upstream de G3C-6.

### G3B-C04 — Disponibilidad y tiempo potencial

**ID:** G3B-C04  
**Pregunta:** ¿Cómo se deriva el tiempo potencial de cada Q desde calendario agregado, salud, suspensión y elegibilidad sin representar partidos?  
**Por qué importa:** Minutos efectivos necesitan un denominador causal y cero disponibilidad debe producir cero participación.  
**Opciones razonables:**

- A. Bolsa de minutos por Q y competición.
- B. Fracción de exposición sobre un calendario agregado versionado.
- C. Oportunidades de participación agregadas convertidas después a minutos.

**Dependencias:** G3B-A03, G3B-E01, G3B-F03, G3B-F04.  
**Bloquea:** `AvailabilityState`; minutos potenciales; suspensiones; producción Q.  
**Fuente:** MES §8.3, §11.2; DR-008, DR-021, DR-054, DR-057, DR-064;
ADR-042, ADR-054, ADR-057.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — refinada el 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** Cada contexto/Q recibe una `TeamMinutesOpportunity`
finita. Health entrega exclusivamente un `MedicalAvailabilityEnvelope` con
share, restricciones y razones médicas. Una agregación autoritativa separada
combina ese componente con `DisciplinaryAvailability` y otras fuentes para
producir el `AvailabilityEnvelope` que consume Role & Minutes. Se conserva
`0 <= availableTeamMinutes <= teamMinutes`; Health no es owner de suspensiones
y Role & Minutes no genera hazards, tarjetas ni calendarios.  
**Alternativas rechazadas:** Máximo editorial por rol; minutos potenciales sin
denominador; recalcular ventanas cerradas; calendario de partidos implícito.  
**Motivo:** Cierra la frontera médica y el máximo físico sin inventar calendario,
disciplina ni la función de composición. Corrige el ownership ambiguo del
refinamiento anterior.  
**Dependencias desbloqueadas:** Denominador de `minuteShare`, tratamiento
estructural de cero disponibilidad y contrato de entrada para minutos.  
**Parámetros aún calibrables:** Cálculo de oportunidad, mapping médico,
composición/solapamientos, splits y precisión. DR-021/022/054/057/064 siguen
abiertas.

**Cierre G3C-3 — `RESOLVED_MATH` (2026-07-29):** cada source entrega una
asignación de intervalos semiabiertos sobre ordinales abstractos de oportunidad
por competición. `AvailabilityAggregator` une intervalos y cuenta cada overlap
una vez; shares sin asignación suficiente producen
`AVAILABILITY_OVERLAP_UNSPECIFIED`. Se rechazan suma, mínimo, producto o
precedencia inferida. Quedan upstream la asignación médica G3C-5 y generación
de oportunidad G3C-6, no una fórmula local. DR-064 queda resuelta.

### G3B-C05 — Distribución conjunta de rol y minutos

**ID:** G3B-C05  
**Pregunta:** ¿Qué modelo conjunto transforma calidad, confianza, competencia, salud y contexto en rol y minutos, preservando ceros y colas plausibles?  
**Por qué importa:** Resolver rol y minutos con sorteos independientes produciría contradicciones y doble conteo.  
**Opciones razonables:**

- A. Rol latente primero y minutos condicionales.
- B. Distribución conjunta con rol como categorización posterior.
- C. Máquina de estados de rol con proceso de exposición por Q.

**Dependencias:** G3B-A06, G3B-C01, G3B-C02, G3B-C03, G3B-C04.  
**Bloquea:** rol esperado; rol efectivo; minutos Q; ContributionCoefficient.  
**Fuente:** MES §8.2–§8.3, §23; DR-008, DR-054, DR-056.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — ampliada el 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** La resolución es jerárquica: distribución de
`SportingRole` condicionada por calidad contextual, posición, `tacticalFit`,
`managerTrust`, competencia, rendimiento previo, forma, contexto, estado
anterior y azar; luego expectativa y `minuteShare ∈ [0,1]` condicionados por rol
y disponibilidad; finalmente `actualMinutes`, con
`0 <= actualMinutes <= availableTeamMinutes`. Rol no fija minutos y el
rendimiento de Qn solo afecta principalmente Qn+1. Development consume
exposición confirmada mediante su curva no lineal.  
**Alternativas rechazadas:** Rol/minutos independientes; porcentajes fijos;
thresholds; feedback de Performance que reescribe Qn; relación lineal ilimitada
de minutos con desarrollo.  
**Motivo:** Cierra la dirección causal y las invariantes sin elegir una familia
de distribución pendiente.  
**Dependencias desbloqueadas:** Interfaces hacia Performance, Health y
Development; runner por suboperaciones; tests de no circularidad.  
**Parámetros aún calibrables:** Familia y parámetros de rol/share, masa en
cero, correlaciones, precisión, redondeo y streams. DR-054 permanece abierta.

**Cierre G3C-3 — `PARTIAL_CALIBRATION` (2026-07-29):** `SportingRole` usa
stable softmax con matriz completa de persistencia. Condicionado al role,
`minuteShare` usa Logit-Normal con shocks team-shared y player-specific;
`expectedMinutes` usa GH10 y `actualMinutes`, `ROUND_HALF_EVEN`. Se rechazan
thresholds, porcentajes fijos, samplers independientes y feedback de
Performance(Q). Quedan calibrables utilities, intercepts, coeficientes,
dispersiones y targets; la familia matemática está cerrada.

### G3B-C06 — Asignación por competición y posición efectiva

**ID:** G3B-C06  
**Pregunta:** ¿Cómo se distribuyen minutos entre competiciones y una posición efectiva única por ventana cuando existe uso mixto o reconversión?  
**Por qué importa:** Estadísticas, títulos, scoring y cohortes necesitan atribución consistente sin contar dos veces los mismos minutos.  
**Opciones razonables:**

- A. Una posición efectiva por Q y desglose de minutos por competición.
- B. Subventanas internas por competición manteniendo una posición dominante del Q.
- C. Asignación conjunta con un único ledger de exposición y vistas derivadas.

**Dependencias:** G3B-B06, G3B-C04, G3B-C05, G3B-F04.  
**Bloquea:** `effectiveMinutes`; splits de competición; producción; posición dominante.  
**Fuente:** MES §8.3, §9.3, §10.3; DR-048, DR-049, DR-054; ADR-044.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** Role & Minutes recibe una `effectivePosition` válida
antes de resolver la Q. Cada Q conserva una posición dominante y puede añadir
`usageByPosition`, siempre que la suma sea exactamente `actualMinutes`. Club y
selección tienen oportunidades y facts independientes; no comparten ni duplican
minutos. `EffectivePositionUsed` aporta historia solo cuando hubo uso efectivo.  
**Alternativas rechazadas:** Reconversión arbitraria dentro del módulo; duplicar
minutos por posición; compartir oportunidad club/selección; inferir dominancia
desde la posición inicial.  
**Motivo:** Preserva ADR-044 y conservación de exposición sin obligar a simular
subpartidos.  
**Dependencias desbloqueadas:** Interface posicional hacia Performance,
Development y hechos históricos.  
**Parámetros aún calibrables:** Asignación por competición/posición,
granularidad del breakdown y regla de dominancia. DR-048/049 y F04 siguen
abiertas.

**Cierre G3C-3 — `PARTIAL_CALIBRATION` (2026-07-29):** los minutos por
competición se asignan mediante softmax conjunto y
`CappedSoftmaxApportionmentV1`, con suma exacta y caps físicos. El slice usa
`DOMINANT_ONLY` por Q; club/selección conservan scopes y adapters distintos.
Se rechazan sorteos independientes y duplicación multiposicional. Quedan
calibrables allocation utilities/dispersiones; DR-048/049 ya están resueltas y
el calendario upstream permanece en DR-021/G3C-6.

### G3B-C07 — Parámetros de rol y minutos

**ID:** G3B-C07  
**Pregunta:** ¿Qué priors, coeficientes de transición, dispersiones y targets de minutos por rol/contexto se calibran externamente?  
**Por qué importa:** Son parámetros de balance; el runner puede construirse con un contrato de configuración antes de conocer sus valores.  
**Opciones razonables:**

- A. Parámetros globales con overrides por posición/club.
- B. Parámetros por arquetipo de club y rol.
- C. Modelo jerárquico con targets de datos por liga.

**Dependencias:** G3B-C01, G3B-C02, G3B-C03, G3B-C04, G3B-C05, G3B-C06.  
**Bloquea:** calibración de minutos y estabilidad de roles; no bloquea contratos parametrizados.  
**Fuente:** MES §8, §26; DR-008, DR-054, DR-056.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** Priors, persistencia, influencias, dispersiones, mappings
de disponibilidad, distribuciones de share, parámetros por rol/contexto,
derivación de appearances/starts y uso multiposicional se cargan desde
configuración versionada.  
**Alternativas rechazadas:** Valores temporales hardcoded; enums que contienen
porcentajes; constantes no versionadas.  
**Motivo:** El contrato puede implementarse después con parámetros externos,
pero no con valores inventados.  
**Dependencias desbloqueadas:** Diseño del Parameter Registry para DR-054.  
**Parámetros aún calibrables:** Todos los enumerados; esta tarjeta no requiere
valores antes del diseño estructural.

---

## D. Performance

### G3B-D01 — Estado y escala de rendimiento

**ID:** G3B-D01  
**Pregunta:** ¿Qué objeto y escala representan rendimiento esperado, rendimiento realizado y evidencia observable sin confundirlos con calidad?  
**Por qué importa:** Calidad ≠ rendimiento; separar expectativa, realización y percepción es necesario para colas, premios y transferencias.  
**Opciones razonables:**

- A. Índice latente continuo más facts estadísticos observables.
- B. Distribución predictiva por Q y residual realizado.
- C. Vector de componentes de rendimiento sin índice único persistido.

**Dependencias:** G3B-A01, G3B-A02, G3B-A06.  
**Bloquea:** `PerformanceState`; producción estadística; forma; award fields.  
**Fuente:** MES §9, §10, §11, §24; Performance Spec §2–§6; DR-008, DR-052, DR-055.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** El objeto normativo sigue el pipeline
`TrueCapabilities → EffectiveCapabilities → UnderlyingPerformance →
ObservedProduction → PerformanceSummary`. UnderlyingPerformance es
multidimensional; producción observada, fuerza de evidencia e incertidumbre se
conservan separadas. Un rating solo puede ser una proyección derivada,
versionada y con finalidad declarada.  
**Alternativas rechazadas:** Overall como expectativa de rendimiento; rating
realizado como estado de calidad; producción como proxy de capability; un valor
único compartido por verdad, rendimiento y percepción.  
**Motivo:** El pipeline separa estado causal, realización, observación y
evaluación sin exigir una escala o familia provisional.  
**Dependencias desbloqueadas:** Modelos posicionales, evidencia previa para
Role & Minutes e interfaces observacionales hacia Market, Selection, Awards y
Scoring.  
**Parámetros aún calibrables:** Dominios y escalas intermedias, distribución
predictiva, componentes/weights posicionales, rating derivado, precisión,
evidencia e incertidumbre.

**Refinamiento de Bloque 3:** Performance recibe `effectivePosition`,
`SportingRole`, `actualMinutes`, disponibilidad y contexto ya confirmados. No
puede recalcular los minutos de Qn. Debe devolver un resumen de evidencia
cerrada que Role & Minutes puede consumir en Qn+1 sin duplicar el cálculo de
rendimiento. El contenido estructural del resumen queda definido por
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md); escala, precisión y
fórmula siguen en DR-055.

### G3B-D02 — Expectativa causal de rendimiento

**ID:** G3B-D02  
**Pregunta:** ¿Qué forma funcional combina habilidad, minutos, rol, forma, club, liga, competición, estado físico y contexto sin doble contar causas compartidas?  
**Por qué importa:** Es la media condicional de producción y el centro del grafo causal del motor.  
**Opciones razonables:**

- A. Predictor jerárquico aditivo con interacciones explícitas.
- B. Exposición × tasa de habilidad/contexto.
- C. Modelo por componentes de tarea con agregación posterior.

**Dependencias:** G3B-C05, G3B-C06, G3B-D01, G3B-E01, G3B-F01.  
**Bloquea:** expectativa por Q; producción GK/CM/ST; performance facts.  
**Fuente:** MES §9, §11, §23; Performance Spec §2–§5; DR-008, DR-054, DR-055, DR-056; MS §10.3, §34.1.3.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** Performance consume minutos, posición, rol, capabilities,
Dynamic States y `PerformanceContext` confirmados; resuelve una única
proyección de EffectiveCapabilities y después UnderlyingPerformance,
oportunidades, producción y summary. Las causas compartidas se representan una
vez y la producción cruda no se reescribe por evaluación contextual.  
**Alternativas rechazadas:** Fórmula monolítica de overall; recalcular minutos;
duplicar club/forma/salud en cada stat; usar producción como habilidad.  
**Motivo:** Fija el orden causal y las interfaces sin inventar la función
matemática.  
**Dependencias desbloqueadas:** Grafos `GK`/`CM`/`ST`, contratos de contexto y
agregación Q.  
**Parámetros aún calibrables:** Forma funcional, interacciones, dominio,
precisión, pesos, transformaciones y parámetros iniciales. La matemática depende
también de DR-021/022, DR-056 y DR-057.

### G3B-D03 — Varianza, colas y shocks correlacionados

**ID:** G3B-D03  
**Pregunta:** ¿Qué distribución residual y jerarquía de shocks permiten temporadas extremas y correlacionan estadísticas sin eventos especiales?  
**Por qué importa:** Una normal independiente por estadística produciría colas pobres y combinaciones incoherentes.  
**Opciones razonables:**

- A. Residuales heavy-tail con shock compartido por Q.
- B. Mezcla de regímenes de rendimiento más ruido idiosincrático.
- C. Modelo jerárquico club→jugador→estadística con cópula explícita.

**Dependencias:** G3B-A04, G3B-D02, G3B-J02.  
**Bloquea:** varianza normativa; correlaciones; golden seeds de temporadas extremas.  
**Fuente:** MES §9, §10.5, §23, §25; Performance Spec §7; DR-008, DR-055; MS §36.6.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** Cada Q admite innovaciones compartidas e idiosincráticas
que correlacionan UnderlyingPerformance, oportunidades, conversión y outputs.
`consistency` modifica principalmente dispersión/volatilidad. Los conteos son
discretos, sobredispersables y sin truncamiento editorial.  
**Alternativas rechazadas:** Normal independiente por stat; expectativa
redondeada; `consistency` como bonus simple de media; evento especial para
forzar outliers.  
**Motivo:** Conserva correlación, varianza y colas como parte del proceso normal.  
**Dependencias desbloqueadas:** Diseño conjunto por posición y tratamiento de
muestras escasas.  
**Parámetros aún calibrables:** Familia exacta —Poisson, Negative Binomial,
mixtures u otra—, jerarquía/matriz de correlación, sobredispersión, copula si
corresponde, streams y targets Monte Carlo.

### G3B-D04 — Forma y confianza dinámica

**ID:** G3B-D04  
**Pregunta:** ¿Cómo persiste, revierte y recibe shocks la forma/confianza entre Q, y qué variable influye luego en rendimiento y rol?  
**Por qué importa:** Debe existir memoria parcial con varianza, pero sin espiral automática éxito→rol→éxito.  
**Opciones razonables:**

- A. Proceso autorregresivo acotado con shocks separados.
- B. Estado latente mean-reverting con actualización por sorpresa de rendimiento.
- C. Dos estados: forma deportiva rápida y confianza más lenta.

**Dependencias:** G3B-A03, G3B-C02, G3B-D01, G3B-D03.  
**Bloquea:** `FormState`; actualización Q; confianza del entrenador; rendimiento futuro.  
**Fuente:** MES §5.7, §11, §13; Performance Spec §11–§12; DR-008, DR-056.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** `form`, `confidence`, `morale` y `managerTrust` son
estados distintos. Performance lee el snapshot inicial y emite señales; sus
owners actualizan después de cerrar Q. Form admite persistencia, regresión o
saturación, respuesta a sorpresa de rendimiento y ruido, sin reset estacional
ni feedback sobre minutos ya cerrados.  
**Alternativas rechazadas:** Estado único; correlación perfecta form/confidence;
producción bruta como señal sin corregir exposición; escritura directa desde
Performance; feedback instantáneo dentro de Q.  
**Motivo:** La actualización diferida corta el ciclo éxito→rol→minutos→éxito sin
eliminar rachas.  
**Dependencias desbloqueadas:** Interfaz de evidencia hacia C02/C05 y ownership
de estados.  
**Parámetros aún calibrables:** Dominios, reference levels, persistencia,
regresión/saturación, sorpresa, ruido, correlaciones, shocks y visibilidad.
DR-056 permanece abierta.

### G3B-D05 — Producción agregada de GK

**ID:** G3B-D05  
**Pregunta:** ¿Qué grafo generativo y familias de distribución producen exposición, atajadas, goles recibidos, vallas invictas y penales para GK?  
**Por qué importa:** Los conteos están condicionados entre sí; una valla invicta no puede sortearse ignorando goles recibidos o minutos.  
**Opciones razonables:**

- A. Exposición→tiros al arco→atajadas/goles→clean sheet derivada.
- B. Modelo de tasas multivariante condicionado por fuerza defensiva.
- C. Resultado colectivo primero y contribución de GK condicionada después.

**Dependencias:** G3B-C06, G3B-D02, G3B-D03, G3B-F01, G3B-F04.  
**Bloquea:** stats GK; narrativa; premios de arquero; scoring de temporada.  
**Fuente:** MES §10.2, §24; Performance Spec §8.4; DR-008, DR-054, DR-055; MS §10, §34.1.3, §36.6.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** UnderlyingPerformance de GK distingue shot stopping,
command y distribution. Se persisten como mínimo `saves`, `goalsConceded` y
`cleanSheets`, junto con exposición auditable. Atajadas se condicionan a
oportunidades; goles recibidos y vallas invictas también dependen del entorno
defensivo/rival. Clean sheets no se sortean ignorando participación y goles.  
**Alternativas rechazadas:** Goles recibidos como proxy de calidad; conteos
independientes; clean sheet Bernoulli aislada; evaluación GK por goles/asistencias.  
**Motivo:** Separa contribución del arquero del contexto colectivo y preserva
identidades.  
**Dependencias desbloqueadas:** Output mínimo GK y evidencia posicional.  
**Parámetros aún calibrables:** Definición de exposición, participación
elegible, familia conjunta, overdispersion, penal/error/distribución adicional,
precisión y parámetros. DR-021/022/054 siguen condicionando oportunidades.

### G3B-D06 — Producción agregada de CM

**ID:** G3B-D06  
**Pregunta:** ¿Qué grafo generativo y familias de distribución producen creación, progresión, control, recuperaciones, goles y asistencias para CM?  
**Por qué importa:** El modelo debe representar impacto de mediocampo sin inventar estadísticas inútiles ni independizar outputs correlacionados.  
**Opciones razonables:**

- A. Oportunidades de posesión→acciones→resultados observables.
- B. Componentes latentes de control/creación/defensa con conteos condicionales.
- C. Tasa multivariante por minutos y contexto táctico.

**Dependencias:** G3B-C06, G3B-D02, G3B-D03, G3B-F01, G3B-F02, G3B-F04.  
**Bloquea:** stats CM; narrativa; premios posicionales; scoring de temporada.  
**Fuente:** MES §10.3, §24; Performance Spec §8.3; DR-008, DR-054, DR-055; MS §10, §34.1.3, §36.6.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** `goals` y `assists` son conteos observables, pero el
summary persiste evidencia de `progressionImpact`, `creativeImpact`,
`defensiveContribution` y `controlImpact`. Esas dimensiones no son
macrocapabilities ni obligan a simular cada acción.  
**Alternativas rechazadas:** Evaluar CM solo por goles/asistencias; simular un
box score completo sin consumidor; sortear componentes y conteos sin causas
compartidas.  
**Motivo:** Representa perfiles creadores, mixtos y defensivos con un contrato
mínimo útil.  
**Dependencias desbloqueadas:** Evidencia CM para narrativa, selección, premios,
mercado y scoring posicional.  
**Parámetros aún calibrables:** Generación de oportunidades/acciones, escala de
componentes, familia conjunta, pesos tácticos, stats adicionales justificadas,
precisión y parámetros.

### G3B-D07 — Producción agregada de ST

**ID:** G3B-D07  
**Pregunta:** ¿Qué grafo generativo y familias de distribución producen ocasiones, tiros, goles, asistencias y momentos decisivos para ST?  
**Por qué importa:** Goles deben depender de exposición y ocasiones; sortearlos aislados rompería contexto, colas y coherencia colectiva.  
**Opciones razonables:**

- A. Minutos→ocasiones→tiros→goles, con asistencias en rama correlacionada.
- B. Tasa de contribución ofensiva descompuesta en creación y finalización.
- C. Resultado ofensivo colectivo primero y participación del ST condicionada.

**Dependencias:** G3B-C06, G3B-D02, G3B-D03, G3B-F01, G3B-F04.  
**Bloquea:** stats ST; narrativa; premios; transferencias; scoring de temporada.  
**Fuente:** MES §10.4, §24; Performance Spec §8.2; DR-008, DR-054, DR-055; MS §10, §34.1.3, §36.6.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** `goals` y `assists` son outputs observables. El grafo
distingue scoring/creative opportunities, chance quality y
conversion/creation outcomes, condicionados por minutos, capabilities, rol,
fit, club, rival, presión y estados dinámicos.  
**Alternativas rechazadas:** Goles aislados; tasa fija por rol; chance quality
y conversion colapsadas; caps editoriales; evento especial para una temporada
histórica.  
**Motivo:** Conserva exposición, creación, conversión, varianza y colas como
causas auditables.  
**Dependencias desbloqueadas:** Output mínimo ST e interfaces de producción.  
**Parámetros aún calibrables:** Definición de oportunidades, chance quality,
familias de conteo/conversión, correlations, overdispersion, pesos, precisión y
parámetros.

### G3B-D08 — Momentos importantes

**ID:** G3B-D08  
**Pregunta:** ¿Cómo se representa un momento importante agregado y qué hechos mínimos lo distinguen de una bonificación editorial?  
**Por qué importa:** Premios y scoring citan momentos decisivos; necesitan evidencia autorizada sin simular partidos ni crear puntos desde contenido.  
**Opciones razonables:**

- A. Conteo tipado de contribuciones high-leverage por competición.
- B. Indicador derivado de producción y fase competitiva.
- C. Facts discretos muestreados condicionalmente a oportunidades agregadas.

**Dependencias:** G3B-D01, G3B-F04.  
**Bloquea:** `ImportantMomentRecorded`; awards; season performance; records.  
**Fuente:** MES §10.1, §17, §22, §24; Performance Spec §10; DR-010, DR-055, DR-060, DR-063; ADR-014.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** `PerformanceSummary` incluye un `pressureBreakdown` con
exposición, rendimiento, producción, evidencia y referencia competitiva. Un
momento importante nunca es una bonificación editorial. Un fact discreto solo
existe si Club/Competitions produce una oportunidad high-leverage autorizada;
no se duplica el summary con otro fact por defecto.  
**Alternativas rechazadas:** Bonus manual; Bernoulli de “momento decisivo” sin
oportunidad; inferir importancia solo por reputación; fact duplicado de presión.  
**Motivo:** Da evidencia a Awards/Scoring sin simular partidos ni contar dos
veces.  
**Dependencias desbloqueadas:** Contrato de presión para D09, Awards y Scoring.  
**Parámetros aún calibrables:** Definición de high-pressure exposure,
oportunidades/fases calificadas, efecto de `pressureResistance`, distribución y
agregación. Depende de DR-021/022/060.

### G3B-D09 — Consolidación Q, temporada y competición

**ID:** G3B-D09  
**Pregunta:** ¿Qué agregados se derivan al cerrar cada Q y temporada, y cómo preservan splits por competición y posición efectiva?  
**Por qué importa:** La consolidación debe ser sumable, no retroactiva y suficiente para scoring, mercado, selección y replay.  
**Opciones razonables:**

- A. Ledger de stats por Q con vistas de temporada derivadas.
- B. Acumuladores canónicos más facts por cierre.
- C. Ambos: facts granulares autorizados y snapshot consolidado verificable.

**Dependencias:** G3B-C06, G3B-D05, G3B-D06, G3B-D07, G3B-D08, G3B-F04.  
**Bloquea:** `SeasonResult`; facts deportivos; checkpoints; consumidores posteriores.  
**Fuente:** MES §11, §24; Performance Spec §13–§15; DR-054, DR-055, DR-063; ADR-042, ADR-044.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 4)  
**Decisión aceptada:** Cada Q cierra `ObservedProduction` y
`PerformanceSummary`. `SeasonPerformanceSummary` deriva de Q1–Q4, suma conteos,
conserva minutos, presión, incertidumbre y splits por club/selección,
competición y posición. No vuelve a sortear ni usa un promedio aritmético
simple de ratings.  
**Alternativas rechazadas:** Nuevo sorteo anual; promedio simple; reescribir
stats por competition strength; snapshot sin splits; duplicar facts y resumen.  
**Motivo:** Produce una vista suficiente y verificable para consumidores sin
modificar hechos cerrados.  
**Dependencias desbloqueadas:** Contratos hacia Market, Selection, Awards,
Reputation y Scoring.  
**Parámetros aún calibrables:** Suficientes estadísticos, pesos de exposición,
agregación de incertidumbre/contexto, multi-club/competición/posición,
precisión y schema final de DR-063.

### G3B-D10 — Parámetros y targets de producción

**ID:** G3B-D10  
**Pregunta:** ¿Qué tasas base, dispersiones, correlaciones y targets por posición, liga, rol y calidad se externalizan para calibrar producción?  
**Por qué importa:** Son balance, no estructura; deben poder ajustarse sin reescribir las familias aprobadas.  
**Opciones razonables:**

- A. Parámetros jerárquicos con defaults y overrides.
- B. Tablas por cohorte con interpolación versionada.
- C. Modelo global calibrado contra targets por segmento.

**Dependencias:** G3B-D02, G3B-D03, G3B-D05, G3B-D06, G3B-D07, G3B-D09.  
**Bloquea:** calibración y aceptación Monte Carlo; no bloquea APIs parametrizadas.  
**Fuente:** MES §9–§10, §25–§26; Performance Spec §17; DR-008, DR-054, DR-055.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28  
**Decisión aceptada:** Tasas, dispersiones, correlaciones, transforms, efectos
de estados dinámicos, parámetros posicionales, ratings, evidencia y targets
viven en configuración versionada.  
**Alternativas rechazadas:** Defaults mecánicos hardcoded; calibrar cambiando
schemas; usar caps para cumplir targets.  
**Motivo:** Los contratos pueden diseñarse sin convertir balance temporal en
norma.  
**Dependencias desbloqueadas:** Parameter Registry y harness Monte Carlo.  
**Parámetros aún calibrables:** Todos los enumerados en
[`PERFORMANCE_MODEL_SPEC.md`](PERFORMANCE_MODEL_SPEC.md#17-parameter-registry-candidates);
deben aprobarse antes del gate de gameplay correspondiente.

### Refinamientos cruzados del Bloque 4

Estas interfaces quedan estructuralmente delimitadas sin cerrar la matemática
propia de sus tarjetas:

| IDs afectados | Resolución/interfaz aceptada | Estado restante |
|---|---|---|
| G3B-B02, G3B-B05 | Development puede consumir exposición y señales de rendimiento/experiencia, pero no usar `ObservedProduction` como causa única ni modificar capabilities desde Performance. | Ecuaciones de desarrollo y correlaciones siguen en DR-053. |
| G3B-C02, G3B-C05 | Performance emite sorpresa, evidencia y exposición de Q cerrada; el owner puede actualizar `managerTrust` para Qn+1. | Dinámica en DR-056 y distribución de rol/minutos en DR-054. |
| G3B-C06 | Production conserva exactamente los splits de minutos/posición/competición recibidos y atribuye cada output una sola vez. | Split ejecutable y dominancia siguen en DR-021/048/049/054. |
| G3B-E01 | Performance consume `fitness`/`fatigue` confirmados y entrega carga/intensidad posterior; no genera una lesión. | Estados, mapping y hazard siguen en DR-057. |
| G3B-F01, G3B-F04 | Club & Competitions debe entregar `attackEnvironment`, `defensiveEnvironment`, control/posesión, rival, schedule difficulty, competition strength, táctica y high-pressure exposure. | Escalas, calendario y generación siguen en DR-021/022. |
| G3B-G02, G3B-G07 | Market consume rendimiento reciente, volumen, producción, contexto e incertidumbre observables, nunca latentes verdaderos. | Fórmulas de mercado/valor siguen en DR-058/027. |
| G3B-H02, G3B-H03 | Selection consume summary, producción, contexto, presión y evidencia, con club/selección separados. | Field, convocatoria y producción internacional siguen en DR-059. |
| G3B-I01, G3B-I03 | Awards consume `SeasonPerformanceSummary`, producción, logros externos y pressure breakdown; no accede a capabilities verdaderas. | Field, comparación y ganador siguen en DR-060. |
| G3B-K01, G3B-K02 | Reputation consume hechos deportivos observables una sola vez, no UnderlyingPerformance oculto ni aliases duplicados. | Escalas, memoria y regiones siguen en DR-061. |
| G3B-M02, G3B-M07, G3B-M14, G3B-M15 | Scoring puede consumir solo producción/resúmenes allowlisted y cerrados; no EffectiveCapabilities, latentes o ratings causales. | CC, percentiles, cohortes, allowlist y fórmulas siguen en DR-010/049/063. |

---

## E. Health

### G3B-E01 — Condición, carga y fatiga

**ID:** G3B-E01  
**Pregunta:** ¿Qué estados separados representan condición física, carga acumulada, fatiga y disponibilidad médica, con qué cadencia y fronteras?  
**Por qué importa:** Son causas diferentes de minutos, rendimiento y riesgo; colapsarlas impediría explicar recuperación y sobrecarga.  
**Opciones razonables:**

- A. Cuatro estados continuos con transiciones por Q.
- B. Condición estructural más modificadores temporales de carga/fatiga.
- C. Estado latente de readiness con componentes auditables.

**Dependencias:** G3B-A02, G3B-A03.  
**Bloquea:** `HealthState`; disponibilidad Q; hazard; recuperación.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §§2–4](HEALTH_INJURY_SPEC.md);
MES §5.4, §14.1; DR-008, DR-052, DR-057; ADR-042, ADR-057.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** `HealthState` separa `fitness`, `fatigue`, `LoadState`,
condiciones activas, `InjuryEpisode`, recuperación, secuelas e historia.
`injuryFragility`, `recoveryCapacity` y `longevity` son traits distintos;
`medicalQuality` pertenece al entorno. Health produce únicamente
`MedicalAvailabilityEnvelope`, con `availabilityShare ∈ [0,1]`, restricciones,
razones e incertidumbre. Una agregación posterior construye
`AvailabilityEnvelope` con disciplina/otras causas; Role & Minutes consume el
aggregate y conserva ownership de minutos.  
**Alternativas rechazadas:** Reducir salud a un score; fitness como stamina;
fatiga temporal que modifica capabilities; disponibilidad binaria; atribuir
suspensiones a Health; usar `expectedMinutes` como carga realizada.  
**Motivo:** Cierra estado, ownership y fronteras sin elegir escalas ni
funciones. Corrige la ambigüedad introducida en Bloque 3: Health no posee la
disponibilidad agregada.  
**Dependencias desbloqueadas:** `HealthState`, contrato médico hacia C04/C05,
inputs de Performance y señales Health→Development/Retirement.  
**Parámetros aún calibrables:** Dominios de fitness/fatigue, dinámica de carga,
mapping a disponibilidad médica, precisión y transiciones Q. La composición
agregada y el owner de disciplina quedan en DR-054/DR-064; la matemática de
Health continúa en DR-057.

### G3B-E02 — Exposición y multiplicidad de oportunidades

**ID:** G3B-E02  
**Pregunta:** ¿Qué exposiciones deportivas, de entrenamiento y fuera del fútbol crean oportunidades de lesión, y cómo pueden ocurrir múltiples sin cupos?  
**Por qué importa:** El hazard necesita una medida de exposición causal y un proceso de conteo que no introduzca máximos artificiales.  
**Opciones razonables:**

- A. Proceso por familias de exposición con sorteos secuenciales.
- B. Proceso puntual agregado por Q con intensidad por causa.
- C. Oportunidades tipadas generadas desde carga, minutos y contexto.

**Dependencias:** G3B-C04, G3B-C06, G3B-E01, G3B-F04.  
**Bloquea:** cantidad de oportunidades; claves de stream; injuries por Q.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §§5–6](HEALTH_INJURY_SPEC.md);
MES §14.2, §23; DR-004, DR-005, DR-008, DR-057; ADR-004, ADR-005, ADR-042,
ADR-057.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** Las exposiciones mínimas son `COMPETITIVE`,
`TRAINING_BACKGROUND`, `NON_FOOTBALL` y `EXTERNAL_EVENT`. `actualMinutes` es la
señal competitiva principal, pero no toda la exposición. Las oportunidades son
tipadas, ordenables, auditables y admiten cero, una o múltiples ocurrencias; no
existen cupos, cooldowns ni máximo editorial de condiciones simultáneas. Cada
consecuencia confirmada afecta oportunidades posteriores que dependan de ella.  
**Alternativas rechazadas:** Minutos como única exposición; una tirada anual;
máximo por temporada; cuota de lesiones graves; arrays incidentales como orden.  
**Motivo:** Cierra soporte, multiplicidad y causalidad; no selecciona el proceso
de conteo/distribución.  
**Dependencias desbloqueadas:** G3B-E03, claves causales de episodios y contrato
de exposición desde C06/F04/Performance.  
**Parámetros aún calibrables:** Transforms de exposición, intensidad
background, proceso puntual/secuencial, orden canónico por familia, streams y
targets.

### G3B-E03 — Hazard dinámico de lesión

**ID:** G3B-E03  
**Pregunta:** ¿Qué función de hazard combina edad, carga, condición, historial, fragilidad, medicina, posición y azar?  
**Por qué importa:** Define riesgo condicional sin mínimos editoriales, cooldowns ni probabilidad cero por mera rareza.  
**Opciones razonables:**

- A. Hazard multiplicativo compuesto en log-odds.
- B. Intensidad por familia en log-space con covariables.
- C. Modelo de riesgos competitivos entre familias de lesión.

**Dependencias:** G3B-A04, G3B-E01, G3B-E02, G3B-F01.  
**Bloquea:** InjuryOpportunity; probabilidades; trazas de modificadores.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §6](HEALTH_INJURY_SPEC.md); MES §14.2;
DR-003, DR-004, DR-008, DR-057; ADR-002–ADR-005, ADR-057.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** El hazard es contextual por oportunidad y puede consumir
exposición, carga, fatigue, fitness, edad/contexto, `injuryFragility`, historia,
condiciones/recuperación, `medicalQuality`, posición, origen y azar
determinista. Debe trazar covariables, contexto de stream, modificadores y
resultado. Probabilidad cero queda reservada a imposibilidad lógica o contenido
mecánicamente deshabilitado.  
**Alternativas rechazadas:** Porcentaje fijo persistente; thresholds; lesión
determinada por fragilidad; riesgo cero por cero minutos; probabilidad cero por
rareza.  
**Motivo:** Cierra variables y semántica probabilística sin escoger ecuación.  
**Dependencias desbloqueadas:** Contrato de `InjuryOpportunity`, E05/E06 y
auditoría hazard→outcome.  
**Parámetros aún calibrables:** Función, hazard→probabilidad, riesgos
competitivos, baseline, efectos, precisión y correlaciones.

### G3B-E04 — Taxonomía y seis lesiones del slice

**ID:** G3B-E04  
**Pregunta:** ¿Qué familias, zonas, mecanismos y niveles de severidad forman el catálogo, y cuáles son las seis definiciones concretas del vertical slice?  
**Por qué importa:** El schema puede ser genérico, pero el slice necesita contenido médico validado para probar duración, recaída y secuela.  
**Opciones razonables:**

- A. Taxonomía clínica simplificada con severidad separada.
- B. Familias funcionales por impacto deportivo.
- C. Modelo híbrido de zona × mecanismo × severidad.

**Dependencias:** G3B-E02, G3B-E03.  
**Bloquea:** catálogo de lesiones del slice; fixtures de salud; presentación narrativa.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §7](HEALTH_INJURY_SPEC.md); MES §14.3,
§26.3; DR-018, DR-057; MS §19 y §35.6; ADR-018, ADR-057.  
**Tipo:** CONTENT  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** PARCIALMENTE RESUELTA / CONTENT LATER — 2026-07-28  
**Decisión aceptada:** `InjuryFamily` es una taxonomía mecánica extensible y
separada de severidad, origen y presentación narrativa. Core no enumera cientos
de diagnósticos. El contenido versionado puede mapear familias a lesiones y
textos.  
**Alternativas rechazadas:** Diagnóstico narrativo como clave mecánica; familia
que fija severidad/duración; catálogo clínico completo dentro de core.  
**Motivo:** El schema genérico ya puede diseñarse; elegir las seis lesiones es
contenido/calibración y no bloquea ese contrato.  
**Dependencias desbloqueadas:** `InjuryEpisode` genérico y separación
domainEvent/presentación.  
**Parámetros aún calibrables:** Taxonomía completa, zonas/mecanismos, seis
definiciones del slice, pesos y fixtures médicos.

### G3B-E05 — Severidad, duración y recuperación

**ID:** G3B-E05  
**Pregunta:** ¿Qué distribuciones condicionan severidad, duración y curva de recuperación a familia, contexto médico y estado individual?  
**Por qué importa:** Duración no puede ser un lookup fijo si se quieren colas, incertidumbre y calidad médica con causalidad.  
**Opciones razonables:**

- A. Distribuciones por familia/severidad con covariables.
- B. Time-to-recovery hazard con checkpoints por Q.
- C. Mezcla de trayectorias de recuperación y duración observada.

**Dependencias:** G3B-E03, G3B-E04.  
**Bloquea:** `InjuryInstance`; ausencias; retorno; disponibilidad futura.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §§7–8](HEALTH_INJURY_SPEC.md);
MES §14.3; DR-008, DR-057; ADR-057.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** Severidad es distinta de familia y modifica
probabilísticamente disponibilidad, duración, recuperación, recaída y secuela.
Recuperación esperada y realizada son diferentes. El proceso agregado admite
semánticas `INJURED → REHABILITATION → LIMITED_RETURN → FULLY_AVAILABLE`; no se
reduce a `injuredUntil` ni a una duración rígida.  
**Alternativas rechazadas:** Lookup fijo familia→duración; fecha comunicada como
verdad; recuperación binaria; retorno necesariamente completo.  
**Motivo:** Cierra estados y dependencias sin escoger distribución o curva.  
**Dependencias desbloqueadas:** MedicalAvailability parcial, E06 y episodios
persistentes.  
**Parámetros aún calibrables:** Escala/distribución de severidad, time-to-
recovery, curvas/transiciones, incertidumbre, precisión y efectos de contexto.

### G3B-E06 — Retorno y recaída

**ID:** G3B-E06  
**Pregunta:** ¿Cómo se decide readiness, retorno parcial o total y hazard de recaída sin cooldown ni inmunidad artificial?  
**Por qué importa:** El retorno modifica carga, minutos y riesgo futuro; una recaída debe surgir del estado, no de un temporizador editorial.  
**Opciones razonables:**

- A. Readiness continuo con decisión y hazard condicional.
- B. Estados de recuperación con transiciones probabilísticas.
- C. Curva continua más oportunidad de recaída por exposición.

**Dependencias:** G3B-E01, G3B-E05.  
**Bloquea:** `RecoveryState`; retorno a minutos; `RelapseOccurred`; decisiones médicas.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §8](HEALTH_INJURY_SPEC.md); MES §14.3;
DR-004, DR-008, DR-057; ADR-004, ADR-042, ADR-057.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** `LIMITED_RETURN` puede producir disponibilidad parcial y
restricciones. Recaída/reinjury/agravamiento exige relación causal con un
episodio anterior mediante `parentEpisodeId` o referencia equivalente. Puede
depender de recencia, completitud, carga, fatigue, fragilidad, condiciones e
historia; no usa cooldown ni inmunidad.  
**Alternativas rechazadas:** Readiness binario; retorno total automático;
recaída sin vínculo; cooldown; recuperación completa garantizada.  
**Motivo:** Cierra identidad y semántica de retorno/recaída, no su hazard.  
**Dependencias desbloqueadas:** Facts de retorno/recaída, historia causal y
disponibilidad de Q futuras.  
**Parámetros aún calibrables:** Readiness, transiciones, relapse hazard,
recencia, interacción de carga y precisión.

### G3B-E07 — Secuelas y efecto sobre capacidades

**ID:** G3B-E07  
**Pregunta:** ¿Qué secuelas temporales o persistentes puede causar una lesión y cómo afectan capacidades, condición, fragilidad y longevidad?  
**Por qué importa:** Las secuelas conectan salud con desarrollo, rendimiento y retiro; deben ser facts trazables y no ediciones retroactivas.  
**Opciones razonables:**

- A. Modificadores tipados por capacidad con persistencia.
- B. Shock a parámetros latentes de salud y declive.
- C. Ambos, según familia y severidad.

**Dependencias:** G3B-A01, G3B-A04, G3B-E04, G3B-E05, G3B-E06.  
**Bloquea:** `InjuryConsequenceApplied`; desarrollo posterior; fragilidad; retiro.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §8.3](HEALTH_INJURY_SPEC.md); MES §14.3,
§21; DR-008, DR-053, DR-057, DR-063; ADR-042, ADR-053, ADR-057.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — ampliada el 2026-07-28 (G3B Bloque 5)  
**Decisión aceptada:** Health confirma un `SequelaProfile` con semántica
`NONE`, `TEMPORARY` o `PERSISTENT`, alcance y episodio causal. Una lesión no
muta capabilities al ocurrir y Health nunca aplica un delta rígido.
Development es owner de consecuencias permanentes mediante evolución por
capability; Performance/Retirement consumen solo estado o burden confirmado.  
**Alternativas rechazadas:** Pérdida permanente en `InjuryOccurred`; editar
estado previo; secuela idéntica obligatoria para una familia/severidad; Health
escribiendo capabilities.  
**Motivo:** Cierra ownership, clases de persistencia y causal reference; la
matemática de secuela permanece abierta.  
**Dependencias desbloqueadas:** Interfaz Health→Development, historial para
Retirement y prohibición de escritura retroactiva.  
**Parámetros aún calibrables:** Probabilidades, duración temporal, perfiles,
magnitudes y efecto en wear/desarrollo.

### G3B-E08 — Parámetros y targets de salud

**ID:** G3B-E08  
**Pregunta:** ¿Qué hazards base, curvas, dispersiones, pesos médicos y targets de incidencia/duración/recaída se externalizan?  
**Por qué importa:** Son parámetros de balance médico; deben ajustarse por versión sin alterar el modelo causal aprobado.  
**Opciones razonables:**

- A. Registro jerárquico por familia y posición.
- B. Tablas por lesión con defaults globales.
- C. Calibración conjunta contra targets por edad/carga.

**Dependencias:** G3B-E03, G3B-E04, G3B-E05, G3B-E06, G3B-E07.  
**Bloquea:** calibración Monte Carlo de salud; no bloquea contratos parametrizados.  
**Fuente:** [`HEALTH_INJURY_SPEC.md`, §15](HEALTH_INJURY_SPEC.md); MES §14,
§26; DR-008, DR-057.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CALIBRACIÓN EXTERNALIZADA — 2026-07-28  
**Decisión aceptada:** Hazards, transforms, curvas, dispersiones, weights,
efectos, precisión, streams, fixtures y targets viven en un Parameter Registry
versionado. No se asigna ningún valor en este bloque.  
**Alternativas rechazadas:** Defaults hardcoded; números editoriales usados
como contrato; calibración que cambie resultados sin versión participante.  
**Motivo:** Permite construir contratos tipados sin convertir balance en regla
normativa accidental.  
**Dependencias desbloqueadas:** Diseño de configuración y protocolo Monte Carlo.  
**Parámetros aún calibrables:** Todo el registro de
`HEALTH_INJURY_SPEC.md` §15, incluidas las seis lesiones del slice.

### Interfaces refinadas por el Bloque 5

| IDs | Contrato fijado | Permanece abierto |
|---|---|---|
| G3B-B02, G3B-B04, G3B-B05 | Development consume carga, inactividad, salud y secuela confirmadas; Health no muta capabilities. | Fórmulas de wear/desarrollo y magnitudes de secuela en DR-053/057. |
| G3B-C04, G3B-C05, G3B-C06 | Health entrega `MedicalAvailabilityEnvelope`; una agregación separada combina disciplina/otras causas; minutos realizados vuelven como exposición. | Composición, disciplina, minute share y calendario en DR-054/064/021. |
| G3B-D02, G3B-D05–D09 | Performance consume fitness/fatigue/restricciones de inicio y entrega señales físicas realizadas; nunca infiere lesión desde un rating. | Ecuaciones de Performance y Health en DR-055/057. |
| G3B-F01, G3B-F04 | Club/Competitions entrega `medicalQuality`, schedule/context y exposición; Health no los genera. | Escalas, calendario y evolución en DR-021/022. |
| G3B-G02, G3B-H02 | Market/Selection reciben hechos de disponibilidad autorizados, no traits latentes verdaderos. | Proyecciones de conocimiento y fórmulas en DR-058/059/063. |
| G3B-L02, G3B-L04 | Retirement consume historia, secuelas y burden persistente; ninguna lesión obliga retiro por sí sola. | Hazard y proceso de retiro en DR-062. |
| G3B-M14 | Facts de Health no crean score; DR-063 clasifica facts/snapshots/trazas. | Allowlist, schemas e idempotencia en DR-010/063. |

---

## F. Club & Competitions

### G3B-F01 — Vector de fuerza del club

**ID:** G3B-F01  
**Pregunta:** ¿Qué componentes canónicos representan fuerza general, ataque, defensa, prestigio, finanzas, manager, desarrollo, medicina, competencia y estabilidad?  
**Por qué importa:** El club es una causa agregada compartida; sus dimensiones no pueden reducirse a una fuerza única para todos los subsistemas.  
**Opciones razonables:**

- A. Vector explícito con `overallStrength` derivado.
- B. Factores latentes deportivo/institucional/económico con vistas derivadas.
- C. Núcleo común más módulos por mercado, desarrollo y competición.

**Dependencias:** G3B-A02.  
**Bloquea:** `ClubState`; rol; rendimiento; salud; mercado; mundo.  
**Fuente:** MES §9.4; DR-008, DR-022, DR-052; MS §13.2.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA PARA DEVELOPMENT — 2026-07-27 (G3B Bloque 2)  
**Decisión aceptada:** `developmentQuality` y `managerQuality` son inputs
separados del componente adquirido. Pueden modificar sus distribuciones, pero
ninguno garantiza desarrollo positivo.  
**Alternativas rechazadas:** Un único bonus de club; usar prestigio como proxy
automático; desarrollo positivo garantizado por club o entrenador.  
**Motivo:** Evita doble conteo del entorno y cierra la interfaz mínima de
G3B-B02.  
**Dependencias desbloqueadas:** El modelo de desarrollo puede declarar inputs
de club sin definir el resto de `ClubState`.  
**Parámetros aún calibrables:** Escalas, dinámica, relación entre ambas
dimensiones y coeficientes. G3B-F01/DR-022 siguen abiertos.

**Refinamiento de Bloque 3:** Club debe entregar `PositionCompetition`,
contexto de manager/táctica y `TeamMinutesOpportunity` o sus fuentes aprobadas.
La competencia contiene fuerza, profundidad y estabilidad por posición, sin
plantilla completa. Escalas y evolución siguen en DR-022.

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** `ClubState` separa `attackStrength`,
`defensiveStrength`, `controlStrength`, `prestige`, `financialPower`,
`developmentQuality`, `medicalQuality`, `stability`, `ManagerContext`,
`PositionCompetition` y membresía. Fuerza deportiva, prestigio y finanzas
tienen dinámicas distintas; `overallStrength` solo puede ser una vista derivada
y explicable.  
**Alternativas rechazadas:** `ClubOverall` causal; prestigio o finanzas como
proxy de fuerza; un bonus universal de club; pisos deportivos por identidad;
plantilla completa.  
**Motivo:** Entrega causas diferenciadas a Role, Performance, Health,
Development, Market y World sin doble conteo.  
**Dependencias desbloqueadas:** `ClubState`, ownership de calidad médica/de
desarrollo, soporte agregado y transición futura del club.  
**Parámetros aún calibrables:** Dominios, precisión, priors, persistencia,
reversión, shocks y toda relación cuantitativa. Véanse
[CCW §4](./CLUB_COMPETITION_WORLD_SPEC.md#4-clubdefinition-y-clubstate) y
[ADR-022](./adr/022-club-competition-world-model.md).

### G3B-F02 — Contexto táctico y ajuste posicional

**ID:** G3B-F02  
**Pregunta:** ¿Cómo se representa táctica, estilo y encaje del jugador sin simular alineaciones completas?  
**Por qué importa:** Rol, posición efectiva y producción necesitan contexto, pero un bonus editorial único ocultaría incompatibilidades distintas.  
**Opciones razonables:**

- A. Vector de demandas tácticas comparado con capacidades.
- B. Arquetipo táctico discreto con parámetros por posición.
- C. Distribución de tareas agregadas por Q.

**Dependencias:** G3B-A01, G3B-F01.  
**Bloquea:** tactical fit; rol; reconversión; producción CM/ST/GK.  
**Fuente:** MES §8.2, §9.4; DR-008, DR-054, DR-055; ADR-044.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** `tacticalFit` es una derivación contextual de
capabilities, `effectivePosition`, demandas tácticas y manager/club. No es una
capability ni reemplaza calidad, rendimiento o `managerTrust`; un jugador de
alta calidad puede tener bajo encaje.  
**Alternativas rechazadas:** Bonus táctico único persistido; usar posición o
overall como proxy suficiente; modificar capabilities para crear encaje.  
**Motivo:** Cierra la propiedad y dirección causal, no la representación táctica
del club ni la función de ajuste.  
**Dependencias desbloqueadas:** Input diferenciado para rol/minutos y
Performance.  
**Parámetros aún calibrables:** Vector/arquetipo de demandas, proyección,
coeficientes y dinámica. G3B-F01/DR-022 y DR-055 siguen abiertos.

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** `ManagerContext` mantiene identidad/revisión y punto
causal de vigencia. `TacticalIdentity` es un vector compacto de demandas
equivalentes a intención ofensiva, pressing, posesión/control, directness y
altura defensiva. `TacticalFit` se deriva de jugador, posición y contexto; no
es capability ni arquetipo rígido.  
**Alternativas rechazadas:** Perfil táctico binario; fit persistido como
atributo; táctica inferida de overall; cambio de manager con efecto
retroactivo.  
**Motivo:** Permite encaje contextual sin simular alineaciones ni duplicar
calidad.  
**Dependencias desbloqueadas:** Contrato táctico hacia Role & Minutes y
Performance; versionado de cambios de manager.  
**Parámetros aún calibrables:** Dominios, demandas, función de fit,
correlaciones, turnover e influencias. Véase
[CCW §5](./CLUB_COMPETITION_WORLD_SPEC.md#5-managercontext-y-tacticalidentity).

### G3B-F03 — Tiempo, inicio y SeasonId

**ID:** G3B-F03  
**Pregunta:** ¿Qué fecha/año inicia una Career, cómo se identifica una temporada y cómo evoluciona el calendario sin confundir Q con fechas reales?  
**Por qué importa:** Contratos, edad, torneos, datos y replay necesitan un tiempo canónico aunque el motor sea agregado.  
**Opciones razonables:**

- A. Año de inicio fijo por `dataVersion` y `SeasonId` ordinal.
- B. Fecha de inicio explícita de Career más temporadas calendarizadas.
- C. Índice de temporada canónico con calendario de presentación separado.

**Dependencias:** Ninguna.  
**Bloquea:** DR-021; `SeasonId`; edad; contratos; ciclos competitivos.  
**Fuente:** MES §10.1, §17.2; DR-021; MS §13–§14; ADR-013, ADR-042.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA PARA ROLE & MINUTES — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** Role & Minutes identifica cada oportunidad por
`seasonId`, Q y contexto y consume una `TeamMinutesOpportunity` finita. Q1–Q4
siguen siendo ventanas agregadas, no fechas ni partidos.  
**Alternativas rechazadas:** Inventar fechas o partidos dentro del módulo;
usar un máximo anual editorial; confundir Q con trimestre calendario real.  
**Motivo:** Define la interfaz temporal mínima sin decidir el inicio de Career o
la evolución del calendario.  
**Dependencias desbloqueadas:** Identidad de oportunidad y conservación de
minutos por ventana.  
**Parámetros aún calibrables:** Fecha inicial, forma final de `SeasonId`,
calendario y cálculo de oportunidad. DR-021 permanece abierta.

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** `dataVersion` fija definitions y una Career conserva un
`WorldSeasonSnapshot`; Q identifica contexto agregado y no fecha/partido.
`TeamMinutesOpportunity` y `CompetitionState` siempre referencian `seasonId`,
Q y scope.  
**Alternativas rechazadas:** Consultar calendario real posterior durante una
Career; equiparar Q a trimestre calendario; crear fechas diarias ficticias.  
**Motivo:** Cierra snapshot y granularidad, pero la pregunta contiene decisiones
temporales todavía abiertas.  
**Dependencias desbloqueadas:** Replay de contexto por Q y frontera
Definition/State.  
**Parámetros aún calibrables:** Ninguno convierte esta ficha en calibración:
fecha inicial, schema definitivo de `SeasonId`, formatos y extrapolación siguen
en DR-021.

**Cierre G3C-3 — `RESOLVED_MATH` (2026-07-29):** se adopta
`SeasonId={careerId,seasonOrdinal}`, Q como índice `0..3` y oportunidad
agregada en minutos/equivalentes enteros por competición. La edad/tiempo de
dominio puede usar el punto medio ordinal de Q. Se rechazan timestamps reales,
fechas diarias ficticias y Q como trimestre civil. DR-021 permanece parcial
solo por fecha/label visible, formatos, generación del calendario e integración
internacional.

### G3B-F04 — Contrato de competición agregada

**ID:** G3B-F04  
**Pregunta:** ¿Qué estructura mínima representa participantes, fases, clasificación, calendario agregado, nivel y cupos de cada competición?  
**Por qué importa:** Títulos, minutos, momentos importantes y fuerza de campo requieren un contrato común sin partidos individuales.  
**Opciones razonables:**

- A. Plantillas de competición versionadas con fases agregadas.
- B. Grafo de fases y reglas de clasificación declarativas.
- C. Tipos cerrados liga/copa/continental/internacional con parámetros.

**Dependencias:** G3B-F03, G3B-J01.  
**Bloquea:** CompetitionState; exposiciones; títulos; ascenso/descenso; torneos.  
**Fuente:** MES §9.4, §17.2, §21.9; DR-021, DR-022; MS §14.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA PARA ROLE & MINUTES — 2026-07-27 (G3B Bloque 3)  
**Decisión aceptada:** El contrato de competición debe entregar
`TeamMinutesOpportunity`, contexto y futuros splits sin requerir partidos
individuales. La suma de minutos por competición no puede exceder ni duplicar
`actualMinutes`.  
**Alternativas rechazadas:** Calendario implícito en Role & Minutes; sortear
minutos totales y por competición de forma independiente; reutilizar la
oportunidad de club para selección.  
**Motivo:** Fija conservación y frontera de propiedad sin elegir formatos.  
**Dependencias desbloqueadas:** Interface de exposición para rol, Performance y
stats.  
**Parámetros aún calibrables:** Tipos de competición, fases, cupos, calendario,
splits y asignación. G3B-F04/DR-021/022 siguen abiertas.

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** Separar `CompetitionDefinition` inmutable de
`CompetitionState` por edición/temporada. El contrato soporta `LEAGUE`,
`DOMESTIC_CUP`, `CONTINENTAL`, `SUPERCUP` e `INTERNATIONAL_CLUB`, formatos
conceptuales tabla/eliminación/híbrido, calendario agregado por Q, participantes
o fields autorizados, progreso, fase, outcome, champion y qualification.  
**Alternativas rechazadas:** Fixtures obligatorios; estado futuro dentro del
catálogo; tipos codificados como fórmulas dispersas; campeón con identidad
inventada.  
**Motivo:** Define el mínimo compartido sin elegir el formato o matemática de
cada competición.  
**Dependencias desbloqueadas:** `CompetitionState`, contexto por Q, outcomes y
facts conceptuales.  
**Parámetros aún calibrables:** Fases, cupos, calendarios, precisión, reglas y
catálogo del slice. DR-021/022/025/065 conservan esos gates.

### G3B-F05 — Resultados colectivos, títulos y participación

**ID:** G3B-F05  
**Pregunta:** ¿Qué distribución conecta fuerzas de club/campo con resultados colectivos y qué evidencia atribuye logros al jugador según participación?  
**Por qué importa:** No basta sortear títulos independientes; rendimiento colectivo, minutos y ContributionCoefficient deben compartir exposición.  
**Opciones razonables:**

- A. Rendimiento de temporada del club→fase/posición→logros.
- B. Simulación agregada por competencia con shocks compartidos.
- C. Campo rival abstracto y resultado ordinal por fase.

**Dependencias:** G3B-C06, G3B-D09, G3B-F01, G3B-F04, G3B-J02.  
**Bloquea:** `CompetitionAchievement`; títulos; momentos; premios; scoring.  
**Fuente:** MES §9.4, §16.3, §21.9; DR-008, DR-010, DR-022, DR-055, DR-063.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** Cada competición se resuelve desde `ClubState`,
`TeamSupportField` que excluye al protagonista,
`PlayerCompetitiveContribution` derivada de minutos/Performance y factores
compartidos/específicos. Los outcomes son separados por competición pero
correlacionados. Contribución competitiva no es CC ni score.  
**Alternativas rechazadas:** Títulos Bernoulli independientes; protagonista
como determinante absoluto; baseline que ya incluye al protagonista; CareerScore
como input; una única tabla de resultados para todas las competiciones.  
**Motivo:** Cierra el grafo causal y evita doble conteo sin seleccionar una
distribución.  
**Dependencias desbloqueadas:** Interfaz Performance→Competitions y facts
colectivos hacia Awards/Market/Selection/Scoring.  
**Parámetros aún calibrables:** Familia de outcome, pesos, overdispersion,
correlaciones, contribution transform, precisión y targets. La matemática sigue
en DR-008/022 y CC/scoring en DR-010.

### G3B-F06 — Ascenso, descenso y continuidad

**ID:** G3B-F06  
**Pregunta:** ¿Cómo se aplican ascensos/descensos y cambios de nivel al estado agregado del club y liga entre temporadas?  
**Por qué importa:** La carrera puede durar décadas; ignorar continuidad rompería contexto, calendario, prestigio y fuerza de liga.  
**Opciones razonables:**

- A. Reglas declarativas por competición y reajuste de fuerza.
- B. Transiciones de tier condicionadas a clasificación agregada.
- C. Modelo abstracto de movilidad sin identidad completa de todos los clubes.

**Dependencias:** G3B-F04, G3B-F05, G3B-J01.  
**Bloquea:** world update; league membership; contexto de temporadas futuras.  
**Fuente:** MES §17.2, §17.4; DR-022; MS §13.3, §14.1.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** La arquitectura representa promoción, descenso, cambio de
membresía y entrada/salida del tier detallado. Ningún club tiene inmunidad. Si
el club del protagonista desciende, conserva club y contrato; no existe
transferencia automática. Un `ExternalClubPool` de identidades reales es una
opción compatible, no una política aceptada.  
**Alternativas rechazadas:** Membresía perpetua; protección de grandes;
teletransporte o traspaso automático; clubes sintéticos nombrados.  
**Motivo:** Cierra invariantes de movilidad sin inventar scope de datos ni
continuidad.  
**Dependencias desbloqueadas:** Tipos de transición y frontera de identidad.  
**Parámetros aún calibrables:** Reglas, pools y reajustes. DR-065 debe elegir
scope, participantes y continuidad fuera del tier; por eso la ficha permanece
parcial.

### G3B-F07 — Evolución de formatos futuros

**ID:** G3B-F07  
**Pregunta:** ¿Qué política se usa cuando una carrera supera el horizonte real de calendarios o cambia un formato competitivo?  
**Por qué importa:** Es contenido de largo plazo; el motor necesita compatibilidad, pero el formato exacto puede diferirse tras validar el slice.  
**Opciones razonables:**

- A. Congelar el último formato conocido.
- B. Aplicar ciclos de formato versionados.
- C. Permitir releases de datos futuros sin migrar carreras existentes.

**Dependencias:** G3B-F03, G3B-F04, G3B-F06.  
**Bloquea:** extrapolación histórica posterior al slice; no bloquea el primer vertical slice.  
**Fuente:** MES §17.4; DR-021, DR-022; MS §14.  
**Tipo:** CONTENT  
**Momento:** CAN_DEFER_AFTER_VERTICAL_SLICE

### G3B-F08 — Parámetros y snapshot competitivo

**ID:** G3B-F08  
**Pregunta:** ¿Qué fuerzas iniciales, calendarios agregados, dispersión de resultados y parámetros de movilidad se cargan desde `dataVersion`?  
**Por qué importa:** Son datos y balance versionados; no deben confundirse con la estructura del simulador.  
**Opciones razonables:**

- A. Snapshot por entidad con defaults de modelo.
- B. Arquetipos de club/competición más overrides.
- C. Parámetros jerárquicos calibrados por liga.

**Dependencias:** G3B-F01, G3B-F03, G3B-F04, G3B-F05, G3B-F06.  
**Bloquea:** calibración Argentina/España y fixtures del slice; no bloquea contratos genéricos.  
**Fuente:** MES §9.4, §17, §26; DR-018, DR-021, DR-022; ADR-015, ADR-018.  
**Tipo:** CONTENT  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28  
Definitions, states iniciales, formatos, fields y parámetros pertenecen a
`dataVersion`/configuración versionada. No se hardcodean. El catálogo exacto
Argentina/España depende de DR-025/065 y los valores de balance de DR-008/022.

---

## G. Transfers & Market

### G3B-G01 — Campo de clubes candidatos

**ID:** G3B-G01  
**Pregunta:** ¿Cómo se genera el campo abstracto de clubes con necesidad, encaje, prestigio y poder económico que puede interesarse por el jugador?  
**Por qué importa:** Sin un field explícito, el interés se reduce a un threshold global y no representa necesidades distintas.  
**Opciones razonables:**

- A. Muestreo jerárquico liga→club→necesidad.
- B. Catálogo de clubes con vector de demanda probabilístico.
- C. Field sintético por tiers y luego resolución a identidad concreta.

**Dependencias:** G3B-F01, G3B-F04, G3B-J01, G3B-J03.  
**Bloquea:** candidate clubs; interés; ofertas; trazas de mercado.  
**Fuente:** MES §14.1–§14.2; DR-008, DR-022, DR-058.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** `ClubCandidateField` se construye desde identidades
autorizadas, `ClubState`, `ClubNeed`, `PlayerClubFit`, escasez y contexto
league/world. Puede producir cero o múltiples candidatos/intereses, no
materializa plantillas y no impone cupos.  
**Alternativas rechazadas:** Threshold global; lista fija de compradores;
clubes identificables sintéticos; necesidad que obligue a ofertar; máximo
editorial de candidatos.  
**Motivo:** Separa el field causal del sorteo de interés y conserva identidad,
scope y auditabilidad.  
**Dependencias desbloqueadas:** Contrato estructural para candidate clubs,
`ClubNeed` e identidad de interés.  
**Parámetros aún calibrables:** Familia de generación, intensidad, correlación,
orden/streams y resolución de candidatos externos. La ficha permanece parcial
por DR-008/058 y por el scope de DR-065.

### G3B-G02 — Generación de interés

**ID:** G3B-G02  
**Pregunta:** ¿Qué fórmula convierte rendimiento reciente, calidad/potencial percibidos, edad, posición, reputación y necesidad en cero o múltiples intereses?  
**Por qué importa:** El interés es una etapa propia y no debe garantizar oferta ni imponer cupos por mercado.  
**Opciones razonables:**

- A. Hazard por club candidato compuesto en log-odds.
- B. Intensidad de oportunidades de interés por ventana.
- C. Ranking probabilístico con sorteos independientes por candidato.

**Dependencias:** G3B-A05, G3B-D09, G3B-G01, G3B-K02.  
**Bloquea:** `TransferInterestGenerated`; multiplicidad; streams de mercado.  
**Fuente:** MES §14.2; DR-003–DR-005, DR-008, DR-058; ADR-005.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** `TransferInterest` es una entidad/hecho causal separado
de oferta, identificado por jugador, club, ventana, necesidad, percepción,
evidencia y tipos de operación contemplados. Usa conocimiento imperfecto,
admite multiplicidad y no garantiza oferta.  
**Alternativas rechazadas:** Interés=oferta; acceso a capacidades/potencial
verdaderos; threshold rígido; ranking determinista de compradores; cupo por
temporada.  
**Motivo:** Preserva la etapa probabilística y permite sobre/subvaloración sin
volver a sortear Performance.  
**Dependencias desbloqueadas:** Identidad de interés, frontera
Perception/Need→Interest y trazabilidad hacia oferta.  
**Parámetros aún calibrables:** Fórmula, familia de oportunidades,
correlaciones, efectos de edad/reputación/contrato, precisión, streams y
targets. DR-008/058 siguen abiertas.

### G3B-G03 — Oferta y payload negociable

**ID:** G3B-G03  
**Pregunta:** ¿Qué condiciones transforman interés en oferta y qué campos contractuales/mecánicos debe contener la oferta?  
**Por qué importa:** Interés no equivale a oferta; la decisión requiere opciones congeladas y consecuencias comparables.  
**Opciones razonables:**

- A. Oferta binaria condicional con contrato completo muestreado.
- B. Varias rondas agregadas de intención→oferta firme.
- C. Oferta como distribución de términos resuelta al checkpoint.

**Dependencias:** G3B-G02, G3B-G06, G3B-G07.  
**Bloquea:** `TransferOfferGenerated`; PendingDecision; negociación.  
**Fuente:** MES §14.3; DR-008, DR-013, DR-014, DR-058; ADR-013, ADR-014.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** Una oferta firme congela comprador, vendedor cuando
corresponde, movimiento, fee, propuesta contractual/préstamo, ventana,
vigencia, percepción, necesidad y viabilidad. Fee y acuerdo entre clubes se
separan del contrato/acuerdo del jugador. Reanudar no resortea términos.  
**Alternativas rechazadas:** Oferta sin payload completo; términos sorteados al
abrir la decisión; oferta que implica transferencia; fee, salary y valor como
un monto único.  
**Motivo:** El checkpoint necesita opciones comparables, persistibles e
idempotentes.  
**Dependencias desbloqueadas:** Schema conceptual de `TransferOffer`,
`RenewalOffer` y propuesta de préstamo.  
**Parámetros aún calibrables:** Propensión interés→oferta, viabilidad y
distribución de fee, salary, duración y términos. La pregunta de condiciones
continúa en DR-008/058.

### G3B-G04 — Negociación, decisión y timing

**ID:** G3B-G04  
**Pregunta:** ¿Qué state machine agregada cubre aceptar, rechazar, negociar, expirar o fracasar, y en qué puntos puede interrumpir el cursor?  
**Por qué importa:** Debe reanudar sin repetir tiradas y separar elección del usuario de azar posterior.  
**Opciones razonables:**

- A. Una decisión sobre oferta firme y resolución inmediata.
- B. Dos checkpoints: intención y términos finales.
- C. Máquina declarativa versionada por tipo de operación.

**Dependencias:** G3B-F03, G3B-G03.  
**Bloquea:** decisiones de transferencia; checkpoints; idempotencia; `TransferCompleted`.  
**Fuente:** MES §14.3–§14.4; DR-013, DR-014, DR-058, DR-063; ADR-013, ADR-014.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** `TransferNegotiation` mantiene identidad, propuesta,
acuerdo de clubes, acuerdo del jugador, status, referencias causales y eventual
`PendingDecision`. Cada operación agregada avanza o termina; las opciones quedan
congeladas y se reanuda desde el cursor posterior sin repetir tiradas.  
**Alternativas rechazadas:** Aceptación unilateral del jugador; acuerdo de
clubes como transferencia; negociación recursiva sin estado; máximo editorial
de rondas; resorteo al reanudar.  
**Motivo:** Separa autoridades y permite fracaso después de cualquiera de los
acuerdos con atomicidad/idempotencia.  
**Dependencias desbloqueadas:** Máquina estructural de negociación, checkpoint
y motivos terminales.  
**Parámetros aún calibrables:** Transiciones, contraofertas, preferencias,
expiración y varianza. La ubicación de movimientos entre Qs queda bloqueada por
DR-067 porque ADR-013/043 solo contienen `MARKET` post-competiciones.

### G3B-G05 — Resultado, tipos de movimiento y cambio de contexto

**ID:** G3B-G05  
**Pregunta:** ¿Qué tipos mínimos de movimiento implementa el slice y qué estado cambia atómicamente cuando uno se completa o fracasa?  
**Por qué importa:** Club, contrato, liga, rol esperado y reputación deben cambiar juntos; no puede quedar una transferencia parcial.  
**Opciones razonables:**

- A. Solo transferencia permanente en el slice.
- B. Permanente, libre y renovación.
- C. Contrato genérico de movimiento con tipos habilitados por contenido.

**Dependencias:** G3B-F02, G3B-G04, G3B-G06.  
**Bloquea:** mutación de contexto; hechos de movimiento; inicio de la siguiente ventana/temporada.  
**Fuente:** MES §14.4, §21.10; DR-014, DR-018, DR-058, DR-063.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** El núcleo soporta `PERMANENT_TRANSFER`, `LOAN` y
`FREE_TRANSFER`; renovación/terminación son operaciones contractuales y
`LOAN_RETURN` cierra un préstamo. El resultado actualiza atómicamente contratos,
`PlayerClubAffiliation`, préstamo y contexto futuro. Se separan
`contractHoldingClubId` y `currentSportingClubId`; la historia se segmenta por Q
y club.  
**Alternativas rechazadas:** Solo transferencias permanentes; club único en
Player; préstamo que sobrescribe contrato; reatribución de toda la temporada;
auto-transfer al descender.  
**Motivo:** Cubre los movimientos normativos y conserva causalidad multiclub,
loan y continuidad.  
**Dependencias desbloqueadas:** `TransferOutcome`, `LoanAgreement`, free
transfer, afiliación dual y agregación multiclub.  
**Parámetros aún calibrables:** Propensión/términos/duración de movimientos.
Elegibilidad sigue en DR-066, timing mid-season en DR-067 y continuidad fuera
del tier en DR-065; no reabren la estructura de tipos.

### G3B-G06 — Contrato

**ID:** G3B-G06  
**Pregunta:** ¿Qué campos canónicos necesita un contrato —duración, vencimiento, salario abstracto/monetario, estatus y cláusulas mínimas— y qué efectos produce?  
**Por qué importa:** Mercado y retiro usan situación contractual; inventar términos durante implementación alteraría decisiones y replay.  
**Opciones razonables:**

- A. Duración y estatus, con economía abstracta.
- B. Duración, salario monetario entero y cláusulas tipadas mínimas.
- C. Contrato extensible versionado con núcleo obligatorio pequeño.

**Dependencias:** G3B-F03, G3B-F04.  
**Bloquea:** oferta; expiración; renovación; retiro; valor de mercado.  
**Fuente:** MES §14.2–§14.4, §20.2; DR-027, DR-058; MS §15.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Conflicto revelado por G3B Bloque 3 — 2026-07-27:** El campo exploratorio
`Contract.role` quedó ambiguo después de separar `SquadStatus` y
`SportingRole`. G3B-G06/DR-058 debe decidir si existe una promesa contractual
distinta, qué semántica tiene y cómo puede influir probabilísticamente en
expectativa, confianza o decisiones. No se equipara por inferencia con ninguno
de los dos estados.

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** `Contract` es entidad identificada con club, período de
dominio, `SalaryTerms`, cláusulas tipadas, status y referencias
predecesor/sucesor/oferta. Su ciclo admite `PENDING_START`, `ACTIVE`,
`EXPIRING`, `EXPIRED`, `SUPERSEDED` y `TERMINATED`; una renovación crea un nuevo
contrato y conserva el anterior. `Contract.role` se reemplaza por
`ContractExpectation = DEVELOPMENT | SQUAD | IMPORTANT | MARQUEE`.  
**Alternativas rechazadas:** Contrato embebido sin ID; renovación que edita
historia; role contractual igual a `SquadStatus`/`SportingRole`; promesa como
porcentaje o garantía de minutos; cláusulas arbitrarias.  
**Motivo:** Resuelve el conflicto de ownership y preserva replay sin invadir
Role & Minutes.  
**Dependencias desbloqueadas:** Contrato de oferta/renovación, leverage,
vencimiento, préstamo y señales futuras de cumplimiento.  
**Parámetros aún calibrables:** Duraciones, horizonte `EXPIRING`, salary,
cláusulas y efectos probabilísticos. El schema temporal final depende de
DR-021/067, no de una regla de contrato.

### G3B-G07 — Representación y fórmula de valor de mercado

**ID:** G3B-G07  
**Pregunta:** ¿El valor se representa como índice abstracto o dinero, y qué fórmula usa edad, calidad/potencial percibidos, rendimiento, posición, liga, contrato, reputación y mercado?  
**Por qué importa:** DR-027 bloquea unidad, moneda, rango y presentación; el valor debe ser estimación simulada, no tasación real.  
**Opciones razonables:**

- A. Índice abstracto logarítmico con presentación categórica.
- B. Dinero entero en moneda base con conversión solo de UI.
- C. Valor latente abstracto y read model monetario versionado.

**Dependencias:** G3B-A05, G3B-D09, G3B-F01, G3B-G06, G3B-K01, G3B-K03.  
**Bloquea:** DR-027; MarketValueState; términos de oferta; narrativa económica.  
**Fuente:** MES §18; DR-008, DR-027, DR-058; MS §15.2.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 7)  
**Decisión aceptada:** `MarketValueEstimate` es una estimación monetaria
observer-specific con evidencia, incertidumbre, contexto y versión. Se separa
de `TransferFee` y `SalaryTerms`. Las tres magnitudes usan `Money` con
`amountMinor` entero exacto y `currencyCode`; no existe moneda o conversión
implícita.  
**Alternativas rechazadas:** Valor objetivo; índice sin relación monetaria;
floating point; moneda global inferida; valor=fee=salary; `financialPower` como
tasación.  
**Motivo:** Cierra representación y semántica sin inventar fuente o calibración
de DR-027.  
**Dependencias desbloqueadas:** Value objects monetarios, fee cero de agente
libre y frontera storage/presentación.  
**Parámetros aún calibrables:** Fórmula, moneda de referencia, catálogo,
conversión, fuente, calibración, precisión visible y disclaimer. G3B-G07 y
DR-027/058 permanecen parciales por esos puntos.

### G3B-G08 — Parámetros de mercado

**ID:** G3B-G08  
**Pregunta:** ¿Qué intensidades, coeficientes, elasticidades, rangos contractuales y targets de transferencias/valor se externalizan?  
**Por qué importa:** Son parámetros de balance y datos; el modelo puede implementarse contra un registry versionado.  
**Opciones razonables:**

- A. Set global con overrides por liga/club.
- B. Parámetros jerárquicos por tier económico.
- C. Calibración conjunta a tasas objetivo por edad/posición.

**Dependencias:** G3B-G01, G3B-G02, G3B-G03, G3B-G06, G3B-G07.  
**Bloquea:** calibración de mercado; no bloquea contratos parametrizados.  
**Fuente:** MES §14, §18, §26; DR-008, DR-027, DR-058.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28  
Percepción, valoración, need, fit, interés, oferta, viabilidad, fee, salary,
renovación, negociación, preferencias, loans, ciclos, moneda, precisión,
streams, fixtures y targets pertenecen a configuración/versiones participantes.
No se hardcodean ni se convierten en gates estructurales falsos.

**Interfaces directas refinadas por el Bloque 7:**

| IDs | Contrato fijado | Sigue abierto |
|---|---|---|
| G3B-C02–C06 | Un movimiento entrega club/manager/táctica/competencia futuros; `ContractExpectation` es señal separada y no role/minutos. | Matemática de Role, eligibility DR-066 y cursor DR-067. |
| G3B-D09 | Summary conserva segmentos por Q/club/competición/posición y Market consume evidencia/uncertainty. | Fórmula de agregación y schemas DR-055/063. |
| G3B-F01/F02/J02/J04 | Club/World posee need, scarcity, financial context y ciclos; fit es derivado. | Matemática/escala DR-022/058 y scope DR-065. |
| G3B-H02/H03 | Selection consume club/league/contexto efectivo y evidencia segmentada; una transferencia no garantiza convocatoria. | Field/fórmulas DR-059. |
| G3B-I01/I03 | Awards consume contexto/logros/segmentos confirmados; fee, salary y valor no son mérito deportivo. | Field/comparación DR-060. |
| G3B-K01–K03 | Market consume sporting/public reputation por separado y no las sustituye por Performance/valor. Movimientos pueden producir señales futuras. | Dominios/dinámica DR-061. |
| G3B-M10/M14/M15 | Transfers no crea score; facts multiclub requieren scope e idempotencia. | DR-010/049/063. |

---

## H. National Team

### G3B-H01 — NationalSelectionField

**ID:** G3B-H01  
**Pregunta:** ¿Cómo representa el field de competencia generacional por país y posición sin simular todos los seleccionables?  
**Por qué importa:** Convocatoria y rol dependen de rivales de la misma cohorte, no de un threshold simple de calidad.  
**Opciones razonables:**

- A. Distribución de calidad/rendimiento por posición y generación.
- B. Rivales top explícitos más masa agregada.
- C. Field jerárquico país→posición→rol internacional.

**Dependencias:** G3B-A01, G3B-J01, G3B-J03.  
**Bloquea:** competencia internacional; probabilidad de convocatoria; rol.  
**Fuente:** MES §16; DR-008, DR-022, DR-059; ADR-059.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** El nombre canónico es `SelectionCompetitionField`, por
selección/país, `PositionCode`, contexto, ventana/ciclo y generación. Representa
fuerza, profundidad, dispersión, colas, demanda táctica e incumbency sin
materializar futbolistas. World puede producir un `NationalGenerationField`
correlacionado, pero field y support field conservan rutas separadas.  
**Alternativas rechazadas:** Threshold global; plantilla completa; field solo
por `PositionGroup`; rivales abstractos presentados como personas reales;
generación que determine convocatoria.  
**Motivo:** Permite competencia generacional posicional, eras fuertes/débiles y
replay sin inventar una población.  
**Dependencias desbloqueadas:** Schema conceptual del field, ownership
World→Selection y comparación por posición/contexto.  
**Parámetros aún calibrables:** Familia de distribución, effective field size,
fuerza, profundidad, dispersión, tails, correlaciones, streams y targets. La
ficha permanece parcial por DR-008/022/059.

### G3B-H02 — Elegibilidad y convocatoria

**ID:** G3B-H02  
**Pregunta:** ¿Qué contrato de elegibilidad nacional y qué fórmula combinan rendimiento, calidad percibida, liga, reputación, edad, salud y azar para convocar?  
**Por qué importa:** Debe distinguir imposibilidad lógica de improbabilidad y dejar trazable por qué una oportunidad existió.  
**Opciones razonables:**

- A. Elegibilidad cerrada más log-odds contra el field.
- B. Ranking probabilístico con corte de cupos del torneo.
- C. Hazard de convocatoria por ventana internacional.

**Dependencias:** G3B-A05, G3B-D09, G3B-E01, G3B-H01, G3B-K02.  
**Bloquea:** `SelectionCallup`; elegibilidad; streams de selección.  
**Fuente:** MES §16; DR-004, DR-008, DR-059, DR-068; ADR-004, ADR-059.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** `NationalTeamEligibility` es un boundary lógico anterior
a la candidatura y distingue `ELIGIBLE`, `REQUIRES_PRIOR_TRANSITION` e
`INELIGIBLE_CURRENT_STATE`. La candidatura compara una señal purpose-scoped de
Performance/producción/exposición/contexto/reputación deportiva/salud/historia
contra `SelectionCompetitionField`; no usa overall, MarketValue o Public
Reputation por defecto.  
**Alternativas rechazadas:** Elegibilidad probabilística; club/liga como
nacionalidad; threshold de calidad; MarketValue como señal; convocatoria
determinada por incumbency; ausencia biográfica convertida en segunda
elegibilidad.  
**Motivo:** Separa imposibilidad reglamentaria de improbabilidad deportiva y
conserva conocimiento imperfecto.  
**Dependencias desbloqueadas:** Eligibility contract, evidence boundary y
pipeline Eligibility→CandidateEvaluation→CallUp.  
**Parámetros aún calibrables:** Candidate signal, context/evidence weights,
field comparison, age/incumbency, precisión, streams y targets. DR-068 debe
cerrar nacionalidad deportiva del slice; DR-059/021, timing.

### G3B-H03 — Rol, minutos y producción internacional

**ID:** G3B-H03  
**Pregunta:** ¿Cómo se asignan rol/minutos internacionales y cuánto del modelo de club se reutiliza con parámetros de selección?  
**Por qué importa:** Reutilizar mecánica evita un segundo motor, pero el campo, exposición y contexto competitivo son distintos.  
**Opciones razonables:**

- A. Mismo modelo de rol/producción con contextos y parámetros propios.
- B. Modelo internacional simplificado condicionado por convocatoria.
- C. Exposición agregada de selección y stats derivadas del mismo núcleo posicional.

**Dependencias:** G3B-C05, G3B-C06, G3B-D09, G3B-H02.  
**Bloquea:** apariciones internacionales; PSN; torneos; records.  
**Fuente:** MES §16; DR-008, DR-010, DR-059; MS §13, §17.2, §20.4; ADR-059.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** Selection reutiliza Role & Minutes y Performance mediante
`NationalTeamContext`, `InternationalTeamMinutesOpportunity`,
`InternationalRole = BENCH | ROTATION | STARTER | KEY_PLAYER` y facts con
contexto nacional. Club/selección conservan oportunidades, roles, minutos,
producción y acumuladores separados. Captaincy e incumbency son dimensiones
separadas.  
**Alternativas rechazadas:** Segundo motor internacional; copiar SportingRole
de club; role como porcentaje fijo; minutos compartidos; call-up que garantiza
uso; hazard Health duplicado.  
**Motivo:** Reutiliza matemática compatible sin mezclar estado ni exposición.  
**Dependencias desbloqueadas:** Contratos de role/minutes/performance
internacionales, invariantes de exposición y frontera con Health.  
**Parámetros aún calibrables:** Distribuciones de role/share, incumbency,
availability mapping, Performance context, support/contribution y outcomes.
Timing/cursor y hechos finales siguen en DR-059/021/063.

### G3B-H04 — Torneos y calendario internacional

**ID:** G3B-H04  
**Pregunta:** ¿Qué estructura agregada representa temporadas de selección, fases de torneo, fuerza rival y logros internacionales?  
**Por qué importa:** Los torneos tienen cadencia distinta del club y alimentan premios, reputación y scoring sin partidos completos.  
**Opciones razonables:**

- A. Reutilizar `CompetitionDefinition` con tipo internacional.
- B. Ciclos de torneo propios enlazados al calendario.
- C. Field internacional por fases con resultado agregado.

**Dependencias:** G3B-F03, G3B-F04, G3B-J01.  
**Bloquea:** logros de selección; PSN; award inputs; world update.  
**Fuente:** MES §16, §18; DR-010, DR-021, DR-022, DR-059; MS §13–§14; ADR-059.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** `NationalTeamDefinition`, `NationalTeamState`,
`NationalTeamContext` y `NationalTeamSupportField` quedan separados del club.
Las competiciones internacionales reutilizan Definition/State/outcome agregado
con discriminante nacional y soportan ventanas regulares, continental y World
Cup sin fixtures obligatorios.  
**Alternativas rechazadas:** Estado de club reutilizado como selección;
partidos completos; protagonista como outcome; strength única; torneos
independientes del World; inventar IDs/formats.  
**Motivo:** Cierra la abstracción y ownership sin duplicar Competitions.  
**Dependencias desbloqueadas:** Estado/contexto nacional, support field,
International Competition outcome e interfaces a Awards/World.  
**Parámetros aún calibrables:** Strength/support/outcome, calendario, fields,
presión, generación y correlaciones. ADR-013/043 no ubica ventanas
internacionales entre Qs: DR-059/021 debe cerrar cursor y formatos.

### G3B-H05 — Parámetros de selección

**ID:** G3B-H05  
**Pregunta:** ¿Qué fuerzas de field, tasas de convocatoria, tamaños de rol, calendario y targets internacionales se externalizan?  
**Por qué importa:** Son balance/datos por país y generación; no deben fijarse dentro de las fórmulas.  
**Opciones razonables:**

- A. Parámetros por país/posición.
- B. Arquetipos de selección con overrides.
- C. Modelo jerárquico calibrado por tier internacional.

**Dependencias:** G3B-H01, G3B-H02, G3B-H03, G3B-H04.  
**Bloquea:** calibración de Argentina y fixtures internacionales; no bloquea contratos.  
**Fuente:** MES §16, §26; DR-008, DR-022, DR-059.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28  
Candidate signals, fields por país/posición/generación, context effects,
evidence weighting, incumbency, roles, minutes, support/outcomes, generación,
precisión, streams, fixtures y targets Monte Carlo pertenecen a configuración y
versiones participantes. Ningún valor se hardcodea ni se convierte en un gate
estructural artificial.

---

## I. Awards

### G3B-I01 — Elegibilidad y candidatos

**ID:** G3B-I01  
**Pregunta:** ¿Qué facts, período, mínimo de participación y reglas de competición hacen elegible a un jugador para cada tipo de premio?  
**Por qué importa:** La elegibilidad debe derivarse de hechos cerrados antes de comparar contra rivales y no de una narrativa posterior.  
**Opciones razonables:**

- A. Predicados declarativos por premio.
- B. Contratos cerrados por categoría posicional/global.
- C. Núcleo común con requisitos versionados por competición.

**Dependencias:** G3B-D09, G3B-F05, G3B-H04, G3B-K02.  
**Bloquea:** candidate set; award facts; anti-duplicación de scoring.  
**Fuente:** MES §17; DR-010, DR-049, DR-060, DR-063; ADR-014, ADR-044, ADR-060.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** `AwardDefinition` data-driven declara award ID,
category, scope, cadence, evaluation family, eligibility predicate, período,
posición/grupo, competición, evidence policy, field y outcome policy. No existe
un mínimo universal de minutos, edad, producción o títulos: todo requisito
lógico pertenece a la Definition versionada.  
**Alternativas rechazadas:** Criterios dispersos en engine; mínimo global;
eligibility inferida desde narrativa; candidate set desde CareerScore;
threshold juvenil hardcoded.  
**Motivo:** Convierte elegibilidad y período en contrato validable sin congelar
catálogo o balance.  
**Dependencias desbloqueadas:** Definition/Edition boundary, predicates de
elegibilidad y candidate set genérico.  
**Parámetros aún calibrables:** Criteria concretos, períodos, mínimos
específicos, catálogo y evidence policies. DR-049/063 siguen bloqueando
dominancia y facts, no la estructura.

### G3B-I02 — AwardCompetitionField

**ID:** G3B-I02  
**Pregunta:** ¿Qué schema y distribución conjunta representan cantidad, nivel, dispersión y correlación de rivales del `AwardCompetitionField`?  
**Por qué importa:** El premio debe surgir de comparación mundial abstracta; una tirada aislada no refleja competencia ni era.  
**Opciones razonables:**

- A. Field de scores rivales condicionado por mundo y categoría.
- B. Top rivals muestreados más distribución de cola.
- C. Proceso de orden estadístico sin materializar rivales individuales.

**Dependencias:** G3B-D03, G3B-I01, G3B-J01, G3B-J03.  
**Bloquea:** candidatos rivales; dificultad por era; distribución de premios.  
**Fuente:** MES §17–§18; DR-008, DR-022, DR-060; ADR-060.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** `AwardCompetitionField` representa premios
`COMPARATIVE_JUDGED` mediante field size, fuerza, distribución conjunta,
dispersión, era, correlaciones y judging context. `StatisticalCompetitionField`
representa producción real y order statistics para premios estadísticos. Ningún
field materializa candidatos o ganadores identificables.  
**Alternativas rechazadas:** Field único para toda familia; cantidad fija que
siempre gana; Bernoulli sin competencia; población mundial completa; ganador
real inventado.  
**Motivo:** Separa comparación juzgada de orden estadístico y preserva variación
por edición/era.  
**Dependencias desbloqueadas:** Schemas conceptuales de ambos fields y frontera
World→Awards.  
**Parámetros aún calibrables:** Distribuciones, field size/strength,
dispersion/tails, correlaciones, streams y targets. DR-008/022/060 siguen
abiertas.

### G3B-I03 — Comparación, ruido y ganador

**ID:** G3B-I03  
**Pregunta:** ¿Qué fórmula compara al jugador con el field usando rendimiento, títulos, producción, reputación y momentos, y cómo resuelve incertidumbre y empates?  
**Por qué importa:** Define el resultado mecánico del premio y debe evitar contar la misma evidencia por varias rutas.  
**Opciones razonables:**

- A. Score latente común más ruido de evaluación.
- B. Comparaciones pairwise probabilísticas.
- C. Ranking multicomponente con shock compartido por premio.

**Dependencias:** G3B-D08, G3B-D09, G3B-F05, G3B-I02, G3B-K02.  
**Bloquea:** `AwardWon`; resultados extremos; facts y scoring de premios.  
**Fuente:** MES §17, §23; DR-008, DR-010, DR-060; ADR-060.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** Candidate signal usa evidence keys purpose-scoped de
Performance, producción, exposición, presión, outcomes, sporting reputation y
posición. El outcome es ordinal (`NOMINATED`, `SHORTLISTED`, `PLACED`,
`WINNER` cuando la Definition los soporte) y judging noise es residual,
agregado y explícito. Títulos no garantizan y no se duplican vía reputación.  
**Alternativas rechazadas:** CareerScore; rating universal; goles como señal
universal; votantes individuales; ruido que sustituye mérito; premio binario
independiente; title guarantee.  
**Motivo:** Conserva causalidad, incertidumbre y anti-doble-conteo antes de
elegir fórmula.  
**Dependencias desbloqueadas:** Evidence ledger conceptual, outcome ordinal,
judging boundary y fact `AwardWon`.  
**Parámetros aún calibrables:** Fórmula, pesos, judging variance, placement,
tie policy, precisión, streams y fixtures. Anti-duplicación permanece en
DR-010, no Awards.

### G3B-I04 — Premios posicionales, globales y posición dominante

**ID:** G3B-I04  
**Pregunta:** ¿Qué scope, ponderación y desempate determinan posición dominante y cómo cada premio declara categoría posicional, de grupo o global?  
**Por qué importa:** Sin DR-049 no puede asignarse una única cohorte en carreras mixtas ni evitar doble elegibilidad.  
**Opciones razonables:**

- A. Minutos efectivos totales del período y desempate por recencia.
- B. Suma de shares por temporada y desempate por producción.
- C. Ponderación minutos×nivel competitivo con regla neutral de empate.

**Dependencias:** G3B-B06, G3B-C06, G3B-D09, G3B-I01.  
**Bloquea:** DR-049; premios por posición; cohortes de ranking; SC-11.  
**Fuente:** MES §17, §22.3; DR-049, DR-060; ADR-011, ADR-044, ADR-060.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 8)  
**Decisión aceptada:** Cada Definition declara `POSITION_SPECIFIC`,
`POSITION_GROUP` o `POSITION_AGNOSTIC`; usa la dominante del mismo período,
derivada de minutos efectivos. ST, CM y GK usan evidencia posicional propia.
La evaluación separa `COMPARATIVE_JUDGED | STATISTICAL` de category
`GLOBAL | LEAGUE | TOURNAMENT | POSITIONAL | YOUTH | TEAM_SELECTION |
SPECIAL`.  
**Alternativas rechazadas:** PrimaryPosition final; secundarias sin minutos;
múltiples cohortes para un mismo scope; goles/asistencias universales; club/fee
como peso posicional.  
**Motivo:** Separa alcance, mecanismo de evaluación y uso histórico sin
inventar dominancia.  
**Dependencias desbloqueadas:** Taxonomía de Definition, evaluación por
posición/grupo y separación category/family.  
**Parámetros aún calibrables:** Position weights, tie policies y cohort
fields. La función de dominancia sigue bloqueada por DR-049 y el scope por
DR-048.

### G3B-I05 — Catálogo y parámetros de premios

**ID:** G3B-I05  
**Pregunta:** ¿Qué premios mínimos contiene el slice y qué pesos, fuerza de field, ruido y equivalencias se cargan por configuración?  
**Por qué importa:** El catálogo y sus valores son contenido/balance versionado; no deben definir la arquitectura del field.  
**Opciones razonables:**

- A. Catálogo mínimo global y uno por posición.
- B. Premios por competición más premio global.
- C. Catálogo data-driven con categorías habilitadas para el slice.

**Dependencias:** G3B-I01, G3B-I02, G3B-I03, G3B-I04.  
**Bloquea:** fixtures y calibración de premios del slice; no bloquea contratos genéricos.  
**Fuente:** MES §17, §26; DR-010, DR-018, DR-060; MS §18, §20.5, §34.5; ADR-018, ADR-060.  
**Tipo:** CONTENT  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CONTENIDO/CALIBRACIÓN EXTERNALIZADOS —
2026-07-28  
El slice conserva un premio global, uno juvenil y tres posicionales o de
competición, sin inventar IDs ni asignación. Definitions, criteria, fields,
pesos, ruido, placements, empate, precisión, streams, golden fixtures y targets
pertenecen a `dataVersion`, parámetros versionados y, para puntos,
`scoringVersion`.

**Interfaces directas refinadas por el Bloque 8:**

| IDs | Contrato fijado | Sigue abierto |
|---|---|---|
| G3B-C05/C06/E01 | Selection usa oportunidad, disponibilidad, posición y minutos propios; no duplica Health ni exposición de club. | Distribuciones DR-054/057/059, aggregate DR-064 y cursor DR-021/059. |
| G3B-D02–D09 | Selection/Awards reciben proyecciones purpose-scoped, summaries, production, pressure y evidence strength; no TrueCapabilities ni rating universal. | Fórmulas/escalas DR-055/056/059/060. |
| G3B-F04/F05/J01–J04 | World aporta NationalTeamState, generation/selection/award fields, support y competition context; definitions permanecen en dataVersion. | Matemática DR-022/059/060 y calendario DR-021. |
| G3B-G05/G07 | Segments multiclub conservan contexto; traslado/valor/fee/salary no crea elegibilidad, convocatoria o mérito. | Registration DR-066 y elegibilidad nacional DR-068. |
| G3B-K01/K02 | Sporting reputation es input permitido con ruta propia; Public Reputation solo si AwardDefinition lo autoriza. | Dominios/dinámica DR-061. |
| G3B-M05/M06/M10/M14/M15 | National/Award facts pueden alimentar Scoring; no calculan PSN/PPI, CC, equivalencias o anti-duplicación. | DR-010/049/063. |

---

## J. World Simulation

### G3B-J01 — Estado agregado y granularidad

**ID:** G3B-J01  
**Pregunta:** ¿Qué entidades e índices mínimos persisten para clubes, ligas, selecciones, fields competitivos y economía mundial?  
**Por qué importa:** El mundo debe evolucionar durante décadas sin plantillas completas y servir de contexto común a todos los subsistemas.  
**Opciones razonables:**

- A. Entidades identificadas con vectores de fuerza y contexto.
- B. Tiers regionales más identidades solo para clubes relevantes.
- C. Híbrido: snapshot nominal del slice y fields sintéticos externos.

**Dependencias:** G3B-A03, G3B-F03.  
**Bloquea:** `WorldState`; club fields; ligas; selecciones; awards.  
**Fuente:** MES §17.1, §17.3; DR-022; MS §13.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** `WorldState` combina `ClubState`, `LeagueState`,
`CompetitionState`, contextos globales/regionales, `WorldCycleState` y fields
agregados. Las identidades reales detalladas y los fields sintéticos declaran
su scope; no se exige granularidad uniforme ni plantillas completas.  
**Alternativas rechazadas:** Universo completo de plantillas; estado mundial
como un único índice; future state dentro de `dataVersion`; field anónimo
presentado como club real.  
**Motivo:** Permite evolución multi-década con un estado mínimo auditable.  
**Dependencias desbloqueadas:** Estado raíz de World, contextos hacia Club,
Market, Selection y Awards.  
**Parámetros aún calibrables:** Scope de datos, dominios, estados iniciales y
granularidad concreta del slice.

### G3B-J02 — Jerarquía de shocks correlacionados

**ID:** G3B-J02  
**Pregunta:** ¿Qué shocks globales, regionales, de liga, club y jugador se comparten y cómo se evita sortearlos de forma independiente?  
**Por qué importa:** Ciclos económicos y deportivos deben correlacionar mercado, fuerzas y oportunidades sin duplicar causas.  
**Opciones razonables:**

- A. Árbol jerárquico de shocks por temporada.
- B. Factores global/regional con cargas por entidad.
- C. Regímenes del mundo más shocks idiosincráticos.

**Dependencias:** G3B-J01.  
**Bloquea:** correlaciones del mundo; performance residual; mercado; awards.  
**Fuente:** MES §17.3, §23; DR-008, DR-022.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** Jerarquía causal `global → regional → league → club →
competition-specific/idiosyncratic`. Cada factor se resuelve una sola vez en su
scope y los consumidores lo referencian; no se vuelve a sortear la misma causa.  
**Alternativas rechazadas:** Shocks independientes por consumidor; un shock
global único sin componentes idiosincráticos; duplicar crisis en fuerza,
mercado y outcome.  
**Motivo:** Cierra la topología de correlación, no su distribución.  
**Dependencias desbloqueadas:** Grafo de shocks compartidos para resultados y
World update.  
**Parámetros aún calibrables:** Familias, cargas, covarianza, persistencia,
orden de streams, precisión y fixtures.

### G3B-J03 — Evolución de clubes, ligas y selecciones

**ID:** G3B-J03  
**Pregunta:** ¿Qué procesos actualizan fuerzas y jerarquías de clubes, ligas y selecciones, y cuánto dependen de resultados recientes?  
**Por qué importa:** La evolución debe responder al mundo sin convertir cada éxito en crecimiento infinito ni fijar destinos.  
**Opciones razonables:**

- A. Mean reversion con shocks y señal de resultados.
- B. Máquina de regímenes competitivos por entidad.
- C. Proceso jerárquico con deriva de largo plazo y ciclos.

**Dependencias:** G3B-F01, G3B-F05, G3B-J01, G3B-J02.  
**Bloquea:** `WorldUpdated`; strength futura; fields de mercado/selección/awards.  
**Fuente:** MES §17.3–§17.4; DR-008, DR-022; MS §13.3.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** Club/League/World transicionan desde estado anterior,
resultados confirmados, contexto institucional/económico, factores compartidos
y shock propio. Fuerza deportiva, prestigio y finanzas usan rutas distintas.
Los updates afectan solo futuro y admiten persistencia, reversión y shocks.  
**Alternativas rechazadas:** Destino fijo por identidad; éxito acumulativo sin
reversión; prestigio igual a fuerza; reescritura de resultados pasados.  
**Motivo:** Cierra inputs, ownership y temporalidad.  
**Dependencias desbloqueadas:** Contrato de `WORLD_UPDATE`.  
**Parámetros aún calibrables:** Todas las funciones, tasas, regímenes,
interacciones, precisión y targets. Selecciones siguen en DR-059.

### G3B-J04 — Ciclos y comportamiento de largo plazo

**ID:** G3B-J04  
**Pregunta:** ¿Cómo se modelan ciclos económicos/deportivos y qué fronteras o estabilizadores conceptuales evitan explosión o colapso numérico?  
**Por qué importa:** Una carrera de décadas exige estacionariedad o deriva controlada sin caps editoriales de eventos ni resultados.  
**Opciones razonables:**

- A. Regímenes markovianos con parámetros por región.
- B. Procesos mean-reverting con shocks heavy-tail.
- C. Tendencia lenta más ciclo estocástico y límites físicos de escala.

**Dependencias:** G3B-J01, G3B-J02.  
**Bloquea:** estabilidad multi-década; economía; fuerza de fields; Monte Carlo largo.  
**Fuente:** MES §17.3–§17.4, §26.2; DR-008, DR-022.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 6)  
**Decisión aceptada:** `WorldCycleState` representa ciclos deportivos,
económicos y de contexto regional que modulan distribuciones. Debe admitir
persistencia, regresión y shocks sin guionizar eras. Los estabilizadores regulan
estado numérico, no limitan eventos ni outcomes.  
**Alternativas rechazadas:** Eras guionadas; crecimiento monotónico; caps de
títulos/resultados; reset periódico universal.  
**Motivo:** Fija semántica y estabilidad requerida sin escoger proceso.  
**Dependencias desbloqueadas:** Contrato de ciclo y pruebas multi-década.  
**Parámetros aún calibrables:** Familia de proceso/regímenes, dominios, tasas,
colas, correlaciones, streams y Monte Carlo.

### G3B-J05 — Parámetros y snapshot del mundo

**ID:** G3B-J05  
**Pregunta:** ¿Qué estados iniciales, matrices de correlación, tasas de reversión, shocks y targets multi-década se externalizan?  
**Por qué importa:** Son datos y balance versionados; deben calibrarse sin cambiar el contrato de evolución.  
**Opciones razonables:**

- A. Snapshot completo por `dataVersion`.
- B. Arquetipos regionales con overrides de entidades.
- C. Parámetros jerárquicos y fixtures de estado inicial.

**Dependencias:** G3B-J01, G3B-J02, G3B-J03, G3B-J04.  
**Bloquea:** calibración del mundo Argentina/España; no bloquea el proceso genérico.  
**Fuente:** MES §17, §26; DR-018, DR-022; ADR-015, ADR-018.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28  
Estados iniciales, matrices, tasas, shocks, fixtures y targets viven en
snapshot/configuración versionada. Ningún valor queda aprobado en este bloque.

### Dependencias directas refinadas por el Bloque 6

| IDs | Contrato desbloqueado | Permanece abierto |
|---|---|---|
| G3B-B02, B04, B05 | `developmentQuality`, `managerQuality`, estabilidad, calendario y carga contextual confirmados. | Fórmulas de Development/Health. |
| G3B-C02–C06 | `ManagerContext`, `TacticalIdentity`, `PositionCompetition` y `TeamMinutesOpportunity` tienen owner y snapshot de Q. | Distribuciones de rol/share, DR-021 y DR-064. |
| G3B-D02–D09 | `PerformanceContext`, pressure exposure, rival/field y competition strength quedan definidos como inputs. | Matemática de Performance y calendario. |
| G3B-E02–E07 | `medicalQuality`, congestión y contexto de exposición quedan definidos como inputs del entorno. | Hazard, recuperación y composición de disponibilidad. |
| G3B-G01, G02, G06, G07 | Club entrega fuerza, prestigio, finanzas, necesidades y contexto sin decidir contratos. | DR-058/027. |
| G3B-H01–H04 | World puede entregar league/club context y fields, sin resolver selección. | DR-059. |
| G3B-I01–I04 | Outcomes y contextos competitivos quedan disponibles para fields de premios. | DR-060. |
| G3B-K01–K05 | Sporting/world context queda disponible sin fusionar reputación y fuerza. | DR-061. |
| G3B-M02–M08, M14, M15 | Outcomes/contexto tienen frontera con scoring; IJL permanece separado. | DR-010/049/063. |

---

## K. Reputation & Social

### G3B-K01 — Sporting reputation

**ID:** G3B-K01  
**Pregunta:** ¿Qué dimensiones, escalas y scopes regionales componen `sportingReputation` y qué parte es estado versus derivación histórica?  
**Por qué importa:** Mérito deportivo, prestigio de liga y memoria de logros tienen ritmos distintos y alimentan mercado/selección.  
**Opciones razonables:**

- A. Estado global y regional con componentes por fuente.
- B. Reputación latente derivada de un ledger de evidencia con decaimiento.
- C. Vector club/selección/premios agregado a vistas regionales.

**Dependencias:** G3B-A02, G3B-A03, G3B-D01.  
**Bloquea:** reputación deportiva; transferencias; selección; premios; scoring social.  
**Fuente:** MES §19.1, §19.4; DR-008, DR-022, DR-061.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** `SportingReputationState` representa percepción deportiva
acumulada por mercado mediante standing, fuerza de evidencia, memoria por
fuente y punto de vigencia. La vista global se deriva; no existe
`fameOverall`, ni se usan capabilities, MarketValue, Public Reputation,
followers, score o prestigio copiado del club.  
**Alternativas rechazadas:** Estado global sin procedencia; vector de logros que
duplique facts; reputación como calidad verdadera; ledger histórico completo
como única forma de consulta.  
**Motivo:** Conserva memoria y scopes sin convertir una percepción en estado
causal del jugador ni contar la misma evidencia varias veces.  
**Dependencias desbloqueadas:** Contrato regional hacia Market, Selection,
Awards y Scoring; `ReputationState`; DR-061 estructural.  
**Parámetros aún calibrables:** Dominio/escala, precisión, compresión de memoria,
ecuación, señales, difusión, streams y targets.

### G3B-K02 — Actualización y memoria deportiva

**ID:** G3B-K02  
**Pregunta:** ¿Qué fórmula actualiza y decae sporting reputation desde rendimiento, nivel, logros, selección y premios sin duplicar evidencia?  
**Por qué importa:** Es una causa mediadora reutilizada; sumar hechos y sus agregados otra vez inflaría mercado y awards.  
**Opciones razonables:**

- A. Actualización por sorpresa con decaimiento.
- B. Ledger de señales con kernels de memoria por fuente.
- C. Estado jerárquico actualizado una vez por facts autorizados.

**Dependencias:** G3B-D09, G3B-F05, G3B-H04, G3B-K01.  
**Bloquea:** sporting reputation futura; mercado; selección; award inputs.  
**Fuente:** MES §19.1, §23; DR-008, DR-061, DR-063.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** Una ruta única transforma fact autorizado en
`ReputationSignal`, deduplica por `EvidenceKey` y actualiza memoria/estado una
vez por boundary. La historia permanece como fuente, pero no crea floors. Un
fact colectivo o individual no puede volver a entrar mediante aliases.  
**Alternativas rechazadas:** Sumar producción, rating, título y reputación del
mismo hecho; escritura directa desde cada productor; crecimiento monotónico;
recalcular toda la historia sin identidad de evidencia.  
**Motivo:** Fija ownership y anti-doble-conteo sin inventar la función de
memoria.  
**Dependencias desbloqueadas:** Interfaz de evidencia de Performance,
Competitions, National Team y Awards; contrato DR-063 para signals/updates.  
**Parámetros aún calibrables:** Familia de actualización, kernels de memoria,
recencia, regresión, decay, pesos, correlaciones, precisión, streams y fixtures.

### G3B-K03 — Public reputation

**ID:** G3B-K03  
**Pregunta:** ¿Qué dimensiones separan notoriedad, alcance y sentimiento en `publicReputation`, y cómo se diferencian del mérito deportivo?  
**Por qué importa:** Debe permitir excelencia poco famosa, fama sin excelencia y reputación positiva o negativa.  
**Opciones razonables:**

- A. Awareness y sentiment separados.
- B. Reach, salience y valence como vector.
- C. Estado regional de visibilidad más percepción pública global derivada.

**Dependencias:** G3B-A02, G3B-A03.  
**Bloquea:** public reputation; followers; sponsors; eventos sociales.  
**Fuente:** MES §19.2, §19.4; DR-008, DR-061; MS §19.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** `PublicReputationState` separa `awareness` y
`sentiment`. Reach es una proyección de awareness regional/audiencia, no un
tercer estado duplicado; salience/hype reciente vive en
`PublicAttentionState`. Sporting Reputation permanece ortogonal.  
**Alternativas rechazadas:** Un score de fama; Public Reputation igual a
followers; awareness, reach y attention persistidos como tres aliases;
sentiment binario.  
**Motivo:** Permite notoriedad, valoración y actualidad con evoluciones
distintas, incluida fama con sentimiento mixto.  
**Dependencias desbloqueadas:** Followers, engagement, signals de Awards/
Transfers/Events y boundary de sponsors.  
**Parámetros aún calibrables:** Dominios, escalas, precisión, persistencia,
regresión, difusión y transforms.

### G3B-K04 — Regiones y agregación global

**ID:** G3B-K04  
**Pregunta:** ¿Qué regiones canónicas existen en el slice y cómo se agregan reputaciones locales a una vista global sin perder origen?  
**Por qué importa:** Club, liga, selección y mercado generan exposición geográfica distinta; un único número no distingue fama local/global.  
**Opciones razonables:**

- A. Argentina, España y resto del mundo como regiones iniciales.
- B. Países del slice más macroregiones continentales.
- C. Grafo versionado de mercados con pesos de alcance.

**Dependencias:** G3B-J01, G3B-K01, G3B-K03.  
**Bloquea:** `RegionalReputationState`; followers regionales; sponsors; market reach.  
**Fuente:** MES §19.4; DR-018, DR-022, DR-061; MS §19.2.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** Un `ReputationMarketDefinition` data-driven forma un
grafo versionado de mercados. El slice resuelve `homeMarketId`,
`currentFootballMarketId` y una vista global derivada; Argentina/España son
datos del slice, no enums del engine. Si dos scopes coinciden, no se duplica
evidencia.  
**Alternativas rechazadas:** Exactamente Argentina/España/resto hardcoded;
estado global mutable en paralelo; perder el origen al agregar; modelar todos
los países desde el primer slice.  
**Motivo:** Soporta alcance local/global y expansión futura conservando
dataVersion y procedencia.  
**Dependencias desbloqueadas:** Estado regional, vista global, difusión social y
reach hacia Market/Sponsors.  
**Parámetros aún calibrables:** IDs/fuentes DR-025, topología concreta, pesos,
audiencias superpuestas, difusión y agregación.

### G3B-K05 — Followers y shocks de exposición

**ID:** G3B-K05  
**Pregunta:** ¿Qué proceso entero y no negativo actualiza followers desde alcance, exposición, controversia y azar, compartiendo shocks con reputación pública?  
**Por qué importa:** Seguidores son conteos con colas y saltos; no deben ser una copia lineal del rendimiento ni un sorteo independiente de fama.  
**Opciones razonables:**

- A. Crecimiento multiplicativo estocástico con churn.
- B. Conteos por adquisiciones/pérdidas condicionados por exposición.
- C. Proceso por shocks virales y crecimiento orgánico separado.

**Dependencias:** G3B-D09, G3B-K03, G3B-K04.  
**Bloquea:** `FollowersChanged`; viralidad; PBR; read models sociales.  
**Fuente:** MES §19.3–§19.4; DR-007, DR-008, DR-061; MS §19.1.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** `FollowerCount` es entero exacto no negativo y distinto
de `EngagementState`. La actualización admite adquisiciones, pérdidas/churn,
shocks y difusión; un `PublicAttentionSignal` con `causalSignalId` compartido
correlaciona reputación pública y audiencia sin imponer deltas. Followers puede
subir, bajar o permanecer igual.  
**Alternativas rechazadas:** Float persistido; crecimiento monotónico; mapping
goals→followers; redondear una expectativa como resultado; shocks independientes
para cada métrica; `followers += X` arbitrario desde contenido.  
**Motivo:** Cierra el contrato exacto y ownership preservando colas, pérdidas y
correlación.  
**Dependencias desbloqueadas:** `AudienceState`, Public Attention, facts sociales
candidatos y boundary PBR.  
**Parámetros aún calibrables:** Representación de rango ampliado, familia de
conteo/cambios, overdispersion, churn, correlaciones, precisión, streams y
targets.

### G3B-K06 — Parámetros sociales y reputacionales

**ID:** G3B-K06  
**Pregunta:** ¿Qué pesos de evidencia, decaimientos, dispersiones, tasas de crecimiento/churn y targets regionales se externalizan?  
**Por qué importa:** Son balance y contenido regional; no deben quedar hardcoded en el modelo.  
**Opciones razonables:**

- A. Set por región y fuente de exposición.
- B. Parámetros globales con overrides de mercado.
- C. Modelo jerárquico calibrado a percentiles de carrera.

**Dependencias:** G3B-K02, G3B-K03, G3B-K04, G3B-K05.  
**Bloquea:** calibración social y de reputación; no bloquea contratos parametrizados.  
**Fuente:** MES §19, §26; DR-008, DR-061.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** Todos los dominios cuantitativos, pesos, memorias,
dispersiones, tasas, difusión, shocks, precisión, streams, golden fixtures y
targets viven en configuración inmutable/versionada.  
**Alternativas rechazadas:** Defaults silenciosos o valores temporales
hardcoded.  
**Motivo:** Permite construir contratos una vez cerrada la familia matemática
sin convertir balance en código.  
**Dependencias desbloqueadas:** Registry de DR-061.  
**Parámetros aún calibrables:** Todos los enumerados; esta ficha no aprueba
ninguno.

### G3B-K07 — Alcance mecánico de sponsors

**ID:** G3B-K07  
**Pregunta:** ¿Sponsors son solo narrativa, un estado agregado derivado o un subsistema de acuerdos con efectos mecánicos?  
**Por qué importa:** La especificación cita sponsors como correlación con fama, pero no define sus reglas ni son necesarios para probar el slice.  
**Opciones razonables:**

- A. Diferir sponsors completamente.
- B. Estado derivado sin decisiones ni efectos competitivos.
- C. Subsistema futuro de acuerdos versionados.

**Dependencias:** G3B-G07, G3B-K03, G3B-K04, G3B-K05.  
**Bloquea:** solo mecánicas futuras de sponsorship; no bloquea el vertical slice.  
**Fuente:** MES §19.2, §23; DR-008, DR-061; MS §19.  
**Tipo:** FOUNDATIONAL  
**Momento:** CAN_DEFER_AFTER_VERTICAL_SLICE

**Resolución:** DIFERIDA SIN CAMBIO — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** Este bloque solo define
`CommercialOpportunityContext`; no crea acuerdos, contratos, thresholds ni
efectos de sponsors.  
**Alternativas rechazadas:** Sponsor automático por followers; incluir contratos
comerciales no especificados en el slice.  
**Motivo:** La frontera evita bloquear Reputation/Social y no inventa otro
subsistema.  
**Dependencias desbloqueadas:** Ninguna mecánica de sponsor; solo compatibilidad
futura.  
**Parámetros aún calibrables:** Todos los futuros parámetros comerciales,
pendientes de decisión propia.

---

## L. Retirement

### G3B-L01 — Cadencia y punto de evaluación

**ID:** G3B-L01  
**Pregunta:** ¿En qué fase(s) se evalúa oportunidad de retiro y cuándo una decisión o resultado pasa Career a RETIRED?  
**Por qué importa:** El retiro no puede aparecer después de cerrar una temporada de forma incoherente ni repetir evaluación al reanudar.  
**Opciones razonables:**

- A. Solo en POSTSEASON_EVENTS antes de SEASON_CLOSE.
- B. Hazard en postemporada y decisiones causales en otras ventanas.
- C. Evaluación anual canónica con schedules de retiro anticipado.

**Dependencias:** G3B-F03, G3B-F04.  
**Bloquea:** cursor de retiro; `RetirementOpportunity`; lifecycle ACTIVE→RETIRED.  
**Fuente:** MES §20.1, §21.14; DR-008, DR-013, DR-062, DR-063; ADR-013, ADR-016, ADR-043.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** Oportunidad, hazard, decisión, outcome,
`PlayerPlayingStatus` y `CareerStatus` son etapas distintas. Una evaluación
causal puede programarse solo en un boundary compatible; no se reutiliza
`POSTSEASON_EVENTS` como fase mecánica por inferencia.  
**Alternativas rechazadas:** Completar Career al primer retiro; insertar una
fase sin ADR; usar `CareerStatus.RETIRED` como retiro reversible; evaluar con
reloj/edad máxima.  
**Motivo:** ADR-013/043 no contiene una operación de Retirement y ADR-016 no
admite regreso; elegir un punto alteraría cursor/replay.  
**Dependencias desbloqueadas:** Separación lifecycle/estado deportivo y contrato
de interrupción.  
**Parámetros aún calibrables:** Punto/operationKey exactos y post-retirement
cursor quedan en DR-069; cadencia/streams/fixtures en DR-062.

### G3B-L02 — Hazard dinámico de retiro

**ID:** G3B-L02  
**Pregunta:** ¿Qué función combina edad, capacidad, declive, lesiones, minutos, motivación, contratos, contexto personal, éxito y azar sin edad máxima?  
**Por qué importa:** Define continuidad deportiva y debe mantener probabilidad positiva en casos conceptualmente posibles.  
**Opciones razonables:**

- A. Hazard anual compuesto en log-odds.
- B. Riesgos competitivos por causas de retiro.
- C. Proceso de estados intención→consideración→retiro.

**Dependencias:** G3B-A06, G3B-B04, G3B-C06, G3B-D09, G3B-E07, G3B-G06, G3B-L03.  
**Bloquea:** probabilidad de retiro; causa; carreras largas; golden seeds.  
**Fuente:** MES §20.2; DR-003, DR-004, DR-008, DR-062; MS §17.3.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** El hazard recurrente consume edad, trajectory,
Health burden, role/minutes, Performance, contrato/Market, motivation,
reputation, logros, contexto y azar. Sus causas auditables iniciales son
`VOLUNTARY`, `HEALTH`, `MARKET`, `EXTERNAL` y `OTHER`; ninguna edad o input es
threshold.  
**Alternativas rechazadas:** Edad máxima; score único lineal; lesión o ausencia
de club como retiro automático; un Bernoulli sin causa; cooldown de retiro.  
**Motivo:** Permite riesgos diferenciados, colas y probabilidad positiva sin
convertir contexto en destino.  
**Dependencias desbloqueadas:** Inputs de Health/Market/Reputation y causa
registrada.  
**Parámetros aún calibrables:** Familia de hazard/competing risks, combinación,
dominios, coeficientes, precisión, streams, fixtures y targets.

### G3B-L03 — Motivación

**ID:** G3B-L03  
**Pregunta:** ¿Qué estado representa motivación, cómo persiste y qué hechos deportivos/personales pueden modificarlo?  
**Por qué importa:** Motivación es causa de retiro y decisiones, pero no debe ser un alias de forma, éxito o reputación.  
**Opciones razonables:**

- A. Latente persistente con shocks trazables.
- B. Vector de ambición, satisfacción y resiliencia.
- C. Estado derivado de rasgos más contexto reciente.

**Dependencias:** G3B-A03, G3B-A04, G3B-K01, G3B-K03.  
**Bloquea:** input de retiro; decisiones de continuidad; contexto personal.  
**Fuente:** MES §5.5, §20.2; DR-008, DR-062.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** `CareerMotivationAssessment` es una snapshot derivada de
`ambition`, morale, rol/minutos, éxito, Health, contrato/Market, contexto y
hechos autorizados. No se añade un trait ni un DynamicState duplicado; la
persistencia proviene de inputs/historia persistentes.  
**Alternativas rechazadas:** Motivation como alias de Ambition; overall
psicológico persistente; éxito/reputación como valor de motivación; estado
binario.  
**Motivo:** Proporciona un input auditable de retiro con la mínima complejidad
necesaria.  
**Dependencias desbloqueadas:** G3B-L02 y decisiones de continuidad.  
**Parámetros aún calibrables:** Dominio, proyección, uncertainty, componentes y
pesos.

### G3B-L04 — Retiro automático, decisión y causas previas

**ID:** G3B-L04  
**Pregunta:** ¿Qué resultados fuerzan retiro, cuáles crean decisión y qué transiciones causales previas cubren falta de contrato, lesión o pérdida de motivación?  
**Por qué importa:** No toda ausencia de club vuelve retiro necesario; DR-004 exige modelar antecedentes materiales antes de declarar imposibilidad.  
**Opciones razonables:**

- A. Hazard genera intención y siempre ofrece decisión cuando es viable.
- B. Causas médicas/lógicas pueden forzar; las demás interrumpen con choice.
- C. Cadena causal tipada con estados sin contrato, consideración y decisión final.

**Dependencias:** G3B-E07, G3B-G06, G3B-L01, G3B-L02.  
**Bloquea:** `RetirementDecision`; causas; WAITING_DECISION; Career RETIRED.  
**Fuente:** MES §20.3, §21.14; DR-004, DR-008, DR-013, DR-062, DR-063; ADR-004, ADR-016.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** La ruta normal produce reflexión/decisión; una
consecuencia explícita externa o imposibilidad mecánica puede omitirla, pero
Retirement es owner. `UNATTACHED`, edad, lesión, bajo rol o falta de oferta
modifican contexto y no fuerzan retiro. Se introduce
`PlayerPlayingStatus = ACTIVE | RETIRED`; comeback puede devolverlo a `ACTIVE`
mientras Career siga abierta, sin cooldown y con episodios causales propios.  
**Alternativas rechazadas:** No club→retiro; InjuryEpisode→retired; completar al
primer retiro; `CareerStatus.RETIRED -> ACTIVE`; estado
`CONSIDERING_RETIREMENT` duplicado; un único retiro por Career.  
**Motivo:** Cumple DR-004, soporta regresos y conserva ADR-016 como lifecycle
terminal.  
**Dependencias desbloqueadas:** Retirement/comeback history, decisiones
WAITING_DECISION, outputs hacia Market/Events/Profile.  
**Parámetros aún calibrables:** Policy exacta por causa, hazard de comeback,
boundary irreversible/finalización DR-069, schemas conformes a DR-063 y
fixtures.

### G3B-L05 — Parámetros de retiro

**ID:** G3B-L05  
**Pregunta:** ¿Qué curva etaria, coeficientes, dispersiones, hazards por causa y targets de longevidad se externalizan?  
**Por qué importa:** Son balance; ninguna edad o tasa concreta debe convertirse en límite obligatorio del engine.  
**Opciones razonables:**

- A. Parámetros por posición y perfil de longevidad.
- B. Modelo global con latentes individuales.
- C. Riesgos por causa calibrados conjuntamente.

**Dependencias:** G3B-L01, G3B-L02, G3B-L03, G3B-L04.  
**Bloquea:** calibración de longevidad y retiro; no bloquea contratos parametrizados.  
**Fuente:** MES §20, §26; DR-004, DR-008, DR-062.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CALIBRACIÓN EXTERNALIZADA — 2026-07-28 (G3B Bloque 9)  
**Decisión aceptada:** Hazards base, efectos causales, motivation, comeback,
precisión, streams, post-retirement dynamics, fixtures y targets viven en
configuración versionada; no existe edad hardcoded de cierre.  
**Alternativas rechazadas:** Edad máxima o coeficientes temporales en código.  
**Motivo:** Separa estructura de balance y permite calibrar terminación práctica
sin cap de gameplay.  
**Dependencias desbloqueadas:** Registry de DR-062/069.  
**Parámetros aún calibrables:** Todos los enumerados; esta ficha no aprueba
ninguno.

---

## M. Scoring

Scoring sigue siendo consumidor separado de facts autorizados; ninguna ficha de esta sección autoriza `engine → scoring` ni creación de `ScoreLedgerEntry` desde contenido.

### G3B-M01 — SC-01: agregación final de PC

**ID:** G3B-M01  
**Pregunta:** ¿Cuál es la ecuación final que agrega categorías a `PC`, en qué orden se aplican transformaciones y cuándo se redondea?  
**Por qué importa:** Es la frontera competitiva final; alterar orden o precisión puede cambiar rankings aun con los mismos hechos.  
**Opciones razonables:**

- A. Suma de subtotales enteros ya cerrados.
- B. Suma en precisión completa y único redondeo final.
- C. Pipeline explícito por categorías con redondeo declarado por etapa.

**Dependencias:** G3B-M02, G3B-M03, G3B-M04, G3B-M05, G3B-M06, G3B-M07, G3B-M08, G3B-M09, G3B-M12, G3B-M14, G3B-M17.  
**Bloquea:** SC-01; `FinalScoreCalculated`; total de Career; ranking de prueba.  
**Fuente:** MES §22.3 SC-01; DR-010; MS §20.1, §20.8; ADR-015.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** `PC` es la suma exacta de los seis subtotales enteros
`PRI + PTC_CLUB + PPI + PSN + PRL + PBR`. Cada subtotal se deriva de entries
posteadas menos reversals; no existe multiplicador o redondeo final adicional.  
**Alternativas rechazadas:** Sumar intermedios no cerrados; redondear solo el
total; agregar categorías o un multiplicador oculto.  
**Motivo:** Hace coincidir PC con el ledger auditable y la fórmula normativa.  
**Dependencias desbloqueadas:** Agregación final, `ScoreSnapshot` y
reconciliación exacta del total.  
**Parámetros aún calibrables:** Ninguno propio; las categorías conservan sus
matemáticas pendientes.

### G3B-M02 — SC-02: ContributionCoefficient

**ID:** G3B-M02  
**Pregunta:** ¿Qué fórmula deriva `CC` de participación y rendimiento, con qué scope y cómo permite 1.00–1.10 solo por rendimiento extraordinario?  
**Por qué importa:** CC modula logros; sin fórmula exacta no puede distinguir contribución residual, rol y excepcionalidad sin bonus manual.  
**Opciones razonables:**

- A. Componente de participación × ajuste continuo de rendimiento.
- B. Media geométrica de participación y performance relativa.
- C. Modelo por minutos/rol con residual excepcional basado en percentil.

**Dependencias:** G3B-C05, G3B-C06, G3B-D09, G3B-M14, G3B-M15.  
**Bloquea:** SC-02; puntos por títulos; rango normativo 0.00–1.10.  
**Fuente:** MES §22.2–§22.3 SC-02; DR-009, DR-010; MS §20.2; ADR-009.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** CC se calcula por competición/logro desde minutos,
starts, disponibilidad, performance y presión confirmados; conserva
`[0,1.10]`, no deriva de SportingRole y solo modula logros colectivos de
`PTC_CLUB`/`PSN` por defecto.  
**Alternativas rechazadas:** Enum→coeficiente fijo; campo editable; bonus
editorial; CC global de temporada aplicado a todas las categorías.  
**Motivo:** Cierra scope y ownership sin inventar la función.  
**Dependencias desbloqueadas:** Inputs/allowlist y frontera de aplicación.  
**Parámetros aún calibrables:** Fórmula, normalización/cohortes, pesos,
dispersión, precisión y evidencia excepcional `>1.00`.

### G3B-M03 — SC-03: logros domésticos

**ID:** G3B-M03  
**Pregunta:** ¿Cómo se calculan puntos por liga/copa doméstica usando valor base, nivel, IJL, CC y posibles límites de categoría?  
**Por qué importa:** La estructura debe comparar contextos sin hacer que el mismo hecho entre por varias categorías.  
**Opciones razonables:**

- A. Valor base × IJL × CC por logro.
- B. Valor base por tier con IJL solo como ajuste acotado.
- C. Tabla versionada por competición y factor de contribución común.

**Dependencias:** G3B-F04, G3B-F05, G3B-M02, G3B-M14.  
**Bloquea:** SC-03; ledger doméstico; equivalencia por liga.  
**Fuente:** MES §22.3 SC-03; DR-010; MS §20.2–§20.3.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** La liga usa
`ROUND_HALF_UP[650 × (IJL/100)^1.35]`; copas y tiers conservan exclusivamente
los porcentajes/rangos de `MASTER_SPEC`. El fact fuente es
`CompetitionFinished` y los puntos elegibles usan CC.  
**Alternativas rechazadas:** `leagueCompetitiveStrength`; tabla hardcoded en
engine; puntuar outcome y proyecciones duplicadas; valores nuevos.  
**Motivo:** Conserva la jerarquía aprobada y una única fuente de outcome.  
**Dependencias desbloqueadas:** Registry doméstico y fixtures de liga/copa
principal.  
**Parámetros aún calibrables:** Valores dentro de rangos, catálogos IJL,
eligibility/atribución y orden de caps menores.

### G3B-M04 — SC-04: logros internacionales de club

**ID:** G3B-M04  
**Pregunta:** ¿Cómo puntúan títulos y fases internacionales de club, qué factor competitivo usan y cómo se aplica CC?  
**Por qué importa:** Debe existir una regla separada de logros domésticos y evitar duplicar el mismo avance/título.  
**Opciones razonables:**

- A. Tabla por competición/fase × CC.
- B. Valor por nivel internacional y dificultad de field.
- C. Puntos por logro terminal, sin sumar fases contenidas.

**Dependencias:** G3B-F04, G3B-F05, G3B-M02, G3B-M14.  
**Bloquea:** SC-04; ledger internacional de club; anti-duplicación de fases.  
**Fuente:** MES §22.3 SC-04; DR-010; MS §20.3.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** `CompetitionScoringDefinition` versionada conserva los
valores de campeón y porcentajes de fase de `MASTER_SPEC`; consume un único
`CompetitionFinished` y aplica CC a logros colectivos elegibles.  
**Alternativas rechazadas:** Valores inventados; factor dinámico de world;
sumar automáticamente todas las fases contenidas; rules dentro de Content.  
**Motivo:** El slice puede referenciar Champions/Libertadores sin extender el
catálogo por inferencia.  
**Dependencias desbloqueadas:** Estructura de mapping y source facts.  
**Parámetros aún calibrables:** Valores ranged/missing, stacking terminal,
registro, loans y atribución multiclub.

### G3B-M05 — SC-05: selección nacional y PSN

**ID:** G3B-M05  
**Pregunta:** ¿Cuál es la fórmula exacta de `PSN`, qué inputs internacionales admite y cómo evita puntuar dos veces torneos, participación y rendimiento?  
**Por qué importa:** La selección combina logros colectivos e individuales con cadencia propia y necesita un único camino de atribución.  
**Opciones razonables:**

- A. PSN por torneo con componentes exclusivos.
- B. Ledger separado de participación, rendimiento y logro con grupos de equivalencia.
- C. Fórmula por campaña internacional y CC específico de selección.

**Dependencias:** G3B-H03, G3B-H04, G3B-M14.  
**Bloquea:** SC-05; puntos de selección; no duplicación club/selección.  
**Fuente:** MES §22.3 SC-05; DR-010; MS §20.4.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** PSN usa outcomes `CompetitionFinished` de contexto
nacional, awards exclusivos mapeados a PSN y participación/performance
nacionales para CC. Se conservan los valores aprobados y no puntúan call-up,
squad o role por sí solos.  
**Alternativas rechazadas:** Threshold de convocatoria; duplicar PPI/PRI;
usar MarketValue/Public Reputation; extrapolar porcentajes no definidos.  
**Motivo:** Separa mérito internacional de presencia y conserva un solo
evidence path.  
**Dependencias desbloqueadas:** Mapping nacional fact→rule y valores conocidos.  
**Parámetros aún calibrables:** Composición PSN, outcomes no tabulados, CC,
stacking/exclusividad y fixtures.

### G3B-M06 — SC-06: premios y equivalencias

**ID:** G3B-M06  
**Pregunta:** ¿Cómo se puntúan premios, qué equivalencias agrupan distinciones solapadas y qué regla elige entre premios incompatibles del mismo período?  
**Por qué importa:** Ganar variantes del mismo reconocimiento no debe multiplicar artificialmente score.  
**Opciones razonables:**

- A. Máximo por grupo de equivalencia y período.
- B. Premio primario más incrementos no solapados.
- C. Catálogo de exclusión/precedencia versionado.

**Dependencias:** G3B-I03, G3B-I04, G3B-M14.  
**Bloquea:** SC-06; award ledger; anti-duplicación de distinciones.  
**Fuente:** MES §22.3 SC-06; DR-010, DR-060; MS §20.5.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** `AwardWon` es la fuente canónica. Un registry declara
valor, category y `AwardScoringEquivalenceGroup`; para dos premios globales
equivalentes de la misma temporada se aplica 100 % al mayor y 60 % al segundo.
Awards conserva ambos hechos.  
**Alternativas rechazadas:** Pairs hardcoded en engine; borrar el segundo
award; CareerScore como input; aplicar equivalencia dentro de Awards.  
**Motivo:** La anti-duplicación modifica points, no historia.  
**Dependencias desbloqueadas:** Valores normativos, equivalence contract y
facts.  
**Parámetros aún calibrables:** Grupos concretos, más de dos equivalentes,
empates, stacking y orden con caps.

### G3B-M07 — SC-07: performance de temporada

**ID:** G3B-M07  
**Pregunta:** ¿Qué componentes, cohortes, percentiles y factor de temporada convierten rendimiento deportivo en puntos sin usar overall?  
**Por qué importa:** Es el puente entre producción posicional y score; exige comparar evidencia heterogénea con cohortes correctas.  
**Opciones razonables:**

- A. Percentiles por posición dominante y nivel de competición.
- B. Score compuesto por stats normalizadas dentro de cohorte.
- C. Componentes posicionales más factor común de minutos/calidad de field.

**Dependencias:** G3B-D09, G3B-I04, G3B-M14, G3B-M15.  
**Bloquea:** SC-07; season performance points; comparabilidad GK/CM/ST.  
**Fuente:** MES §22.3 SC-07; DR-010, DR-049, DR-060; MS §20.6.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** PRI conserva los cinco componentes
`450/120/230/120/80`, máximo 1000 pre-factor, evaluación posicional y
`competitiveFactor = 0.25 + 0.75 × IJL/100`. Consume facts cerrados, no
capabilities, UnderlyingPerformance oculto o ratings de UI.  
**Alternativas rechazadas:** Overall; goles universales; IJL dinámico;
producción sin exposición; sumar Q y season summary como evidencias distintas.  
**Motivo:** Cierra la forma externa de PRI sin inventar transforms/cohortes.  
**Dependencias desbloqueadas:** Component contract y allowlist PRI.  
**Parámetros aún calibrables:** Transforms, cohortes, percentiles, GK/CM/ST,
leadership/regularity y agregación multicontexto.

### G3B-M08 — SC-08: records y longevidad

**ID:** G3B-M08  
**Pregunta:** ¿Qué cuenta como record o hito de longevidad, qué scope regional/global usa y cómo se reemplaza o conserva una entrada superada?  
**Por qué importa:** Records requieren identidad, comparación histórica y reglas de reemplazo; no son simples eventos narrativos.  
**Opciones razonables:**

- A. Puntos solo al record confirmado al cierre.
- B. Ledger de hitos incrementales con máximo por familia.
- C. Record holder por scope y bonus de longevidad separado.

**Dependencias:** G3B-D09, G3B-F05, G3B-H04, G3B-L04, G3B-M14, G3B-M15.  
**Bloquea:** SC-08; records; longevidad; reversión ante corrección.  
**Fuente:** MES §22.3 SC-08; DR-010; MS §20.7.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** `RecordAchieved` y `CareerMilestoneAchieved` son facts
distintos de Award. Solo una `ScoringRuleDefinition` allowlisted los convierte
en PRL; 20 temporadas otorga 700 total y reemplaza el milestone de 15/300.  
**Alternativas rechazadas:** Todo record puntúa; sumar 15+20; inferir records
desde narrativa; puntuar `RetirementOccurred`.  
**Motivo:** Hace verificables replacement y procedencia sin bonus de retiro.  
**Dependencias desbloqueadas:** Fact types y replacement family.  
**Parámetros aún calibrables:** Catálogo, valores dentro de rangos, mínimos
one-club, scopes y policy de record superado/corrección.

### G3B-M09 — SC-09: PBR y bonos acotados

**ID:** G3B-M09  
**Pregunta:** ¿Cómo se calcula `PBR` desde popularidad, redes y eventos autorizados, y dónde se aplican sus límites competitivos?  
**Por qué importa:** Los bonos sociales deben permanecer secundarios y acotados sin imponer límites a la ocurrencia de eventos.  
**Opciones razonables:**

- A. Componentes sociales sumados y cap final de categoría.
- B. Transformación saturante sin cap duro de eventos.
- C. Máximo entre rutas equivalentes más bonus residual acotado.

**Dependencias:** G3B-K02, G3B-K05, G3B-M14.  
**Bloquea:** SC-09; PBR; bounded bonuses; separación evento→fact→scoring.  
**Fuente:** MES §22.3 SC-09; DR-010, DR-061, DR-063; MS §20.7; ADR-005, ADR-014.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** `PRL` significa records/longevidad y `PBR`,
popularidad/redes/achievements históricos. PBR conserva subcaps 1000/1000 y
cap agregado `min(2000, 5 % × puntaje deportivo previo)`. `MASTER_SPEC` no
define expresamente ese subtotal; `PRI + PTC_CLUB + PPI + PSN` es una opción
consistente con su primer desempate, no una resolución. Solo updates
públicos/sociales y `HistoricAchievementConfirmed` autorizados pueden entrar.  
**Alternativas rechazadas:** “PRL = popularity”; event rarity→points;
followers lineales; tragedia como bonus; cap de ocurrencias.  
**Motivo:** Reconcilia la nomenclatura y los límites exactos de `MASTER_SPEC`
sin mezclar gameplay y score.  
**Dependencias desbloqueadas:** Categoría y allowlist PBR.  
**Parámetros aún calibrables:** Popularity transform, achievements elegibles,
dedup de señales, definición del puntaje deportivo previo, cuantización del
5 % y orden de caps.

### G3B-M10 — SC-10: atribución multi-contexto

**ID:** G3B-M10  
**Pregunta:** ¿Cómo se atribuyen puntos en temporadas con varios clubes, ligas, posiciones o competiciones sin duplicar minutos ni logros?  
**Por qué importa:** Una temporada mixta necesita reglas de prorrateo y scope antes de sumar categorías competitivas.  
**Opciones razonables:**

- A. Atribución por facts al contexto donde ocurrieron.
- B. Prorrateo por minutos efectivos para componentes de temporada.
- C. Ledger granular y reglas específicas por categoría.

**Dependencias:** G3B-C06, G3B-D09, G3B-G05, G3B-H04, G3B-I04, G3B-M14.  
**Bloquea:** SC-10; temporadas multi-club; cohortes; ledger reconstruible.  
**Fuente:** MES §22.3 SC-10; DR-010, DR-049; ADR-044.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Cada fact conserva Q, club/selección, competition
edition, liga/IJL, posición y minutos originales. Las reglas agregan por scope;
no reatribuyen al club final ni usan un IJL único de temporada.  
**Alternativas rechazadas:** Club de cierre; stats duplicadas por transfer;
prorrateo universal aplicado a todas las categorías.  
**Motivo:** Cierra procedencia y evita duplicación, dejando la ponderación a la
familia correspondiente.  
**Dependencias desbloqueadas:** Payloads scoped e idempotency scopes.  
**Parámetros aún calibrables:** Ponderación de PRI, contribution tras
movimientos, eligibility y boundaries mid-season.

### G3B-M11 — SC-11: posición dominante para scoring

**ID:** G3B-M11  
**Pregunta:** ¿Qué scopes usa scoring para posición dominante, cómo resuelve empates y qué ocurre cuando el scope no tiene minutos efectivos?  
**Por qué importa:** Scoring no puede inferir posición inicial ni asignar varias cohortes al mismo scope.  
**Opciones razonables:**

- A. Consumir exactamente la dominante definida por DR-049.
- B. Dominante por temporada para performance y por carrera para ranking.
- C. Scopes declarados por fórmula con una misma función de dominancia.

**Dependencias:** G3B-I04, G3B-M10, G3B-M15.  
**Bloquea:** SC-11; cohortes; premios posicionales; rankings por posición.  
**Fuente:** MES §22.3 SC-11; DR-010, DR-049; ADR-044.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Scoring consume una posición dominante única por scope
desde minutos de `effectivePosition`; secundarias sin uso, posición inicial,
final o club no aportan peso.  
**Alternativas rechazadas:** Cohorte múltiple automática; primary inicial;
posición más reciente; fee/role como desempate.  
**Motivo:** Restringe inputs sin resolver DR-049 por inferencia.  
**Dependencias desbloqueadas:** Source data exacta para la función futura.  
**Parámetros aún calibrables:** Scopes, ponderación, empates, cero minutos,
precisión y fixtures.

### G3B-M12 — SC-12: precisión, redondeo y reversión

**ID:** G3B-M12  
**Pregunta:** ¿Qué valores permanecen exactos, cuándo se convierten a enteros, qué modo de redondeo se usa y cómo se revierten entradas invalidadas?  
**Por qué importa:** La aritmética competitiva debe ser reproducible y reversible sin depender del orden incidental de persistencia.  
**Opciones razonables:**

- A. Racionales/decimales internos y enteros por entrada.
- B. Double controlado con redondeo explícito único.
- C. Puntos en unidades enteras de alta resolución y presentación derivada.

**Dependencias:** G3B-A02, G3B-M14.  
**Bloquea:** SC-12; `ScoreLedgerEntry`; hashes; invalidación y reconstrucción.  
**Fuente:** MES §22.3 SC-12; DR-007, DR-010; MS §20.8; ADR-007, ADR-016.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Scoring usa decimal exacto/racional determinista,
`ROUND_HALF_UP` al cerrar cada entry y enteros exactos para entries,
subtotales y PC. Las correcciones agregan `REVERSAL` inmutable con importe
absoluto y referencia; nunca editan entries.  
**Alternativas rechazadas:** Float persistido; bankers rounding; redondeo
incidental por regla; score total mutable; regla deportiva negativa para
corregir.  
**Motivo:** `MASTER_SPEC` §36.7 ya fija half-up y ledger append-only.  
**Dependencias desbloqueadas:** Schema numérico, hashes, reconciliación y
re-scoring.  
**Parámetros aún calibrables:** Escala decimal declarada por rule; el orden de
stacking/caps permanece en las familias correspondientes.

### G3B-M13 — SC-13: etiquetas narrativas

**ID:** G3B-M13  
**Pregunta:** ¿Qué percentiles y población de referencia asignan etiquetas narrativas de score sin reinterpretar ni modificar puntos?  
**Por qué importa:** Las etiquetas son presentación recalibrable; no deben alterar mecánica ni elegibilidad.  
**Opciones razonables:**

- A. Bandas por percentiles de carreras comparables.
- B. Etiquetas por distribución histórica de `scoringVersion`.
- C. Read model por cohorte con fallback global.

**Dependencias:** G3B-M01, G3B-M15.  
**Bloquea:** SC-13 y presentación final; no bloquea cálculo de puntos.  
**Fuente:** MES §22.3 SC-13; DR-010; MS §20.9.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** RESUELTA PARA LA VERSIÓN INICIAL — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Se usan las siete bandas absolutas de `MASTER_SPEC`
(`0–4999` a `70000+`) como read model de presentación. No usan percentiles ni
modifican points, gameplay o eligibility.  
**Alternativas rechazadas:** Percentiles como regla inicial; recalcular score
histórico al cambiar copy; etiquetas como multiplier.  
**Motivo:** Existe una tabla normativa explícita y no requiere inventar una
población.  
**Dependencias desbloqueadas:** Presentación final y share/profile derivados.  
**Parámetros aún calibrables:** Futuras bandas/copy de presentación mediante
mapping versionado, sin reinterpretar PC.

### G3B-M14 — Facts autorizados, idempotencia y ledger

**ID:** G3B-M14  
**Pregunta:** ¿Cuál es el catálogo exacto de facts —nombres, payloads, unidades, fase, identidad y orden— y qué allowlist, clave idempotente y vínculo fact→entrada usa scoring?  
**Por qué importa:** Cierra la frontera de DR-063 y evita identidades ambiguas, facts prematuros o puntos duplicados por contenido y reintentos.  
**Opciones razonables:**

- A. Un handler idempotente por fact autorizado.
- B. Proyección batch desde un fact ledger cerrado.
- C. Reglas declarativas compiladas sobre un catálogo cerrado de facts.

**Dependencias:** G3B-D09, G3B-E07, G3B-F05, G3B-G05, G3B-H04, G3B-I03, G3B-K05, G3B-L04.  
**Bloquea:** DR-063; schemas e identidad de facts; `AuthorizedScoringFactCatalog`; `ScoreLedger`; anti-duplicación.  
**Fuente:** MES §21, §22.1–§22.2, §24; DR-010, DR-063; ADR-006, ADR-014, ADR-015, ADR-050.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA ESTRUCTURALMENTE — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Se adopta un fact ledger tipado y append-only con
identidad derivada de Career/operation/type/semantic key/ordinal; catálogo
único, clasificación fact/signal/summary/narrative y allowlist por categoría.
`ScoreLedgerEntry` usa rule, source facts, scope y clave idempotente canónica.  
**Alternativas rechazadas:** Handler libre por evento; IDs de reloj/UUID;
persistir todo intermedio; aliases internacionales/estadísticos; Content
emitiendo facts puntuables.  
**Motivo:** Cierra DR-063 y hace replay/re-scoring deterministas.  
**Dependencias desbloqueadas:** Schemas de facts/ledger, allowlist,
idempotencia, migración de aliases y golden IDs.  
**Parámetros aún calibrables:** Payload técnico final y reglas matemáticas no
alteran la semántica cerrada; cambios semánticos exigen versionado/ADR.

### G3B-M15 — Poblaciones, cohortes y percentiles

**ID:** G3B-M15  
**Pregunta:** ¿Qué población de referencia, ventana temporal, posición, liga/nivel, elegibilidad y muestra mínima definen cada percentil competitivo?  
**Por qué importa:** Un percentil carece de significado sin cohorte y puede sesgar GK/CM/ST o eras distintas.  
**Opciones razonables:**

- A. Cohortes por posición dominante, nivel y temporada.
- B. Normalización jerárquica con shrinkage hacia cohortes amplias.
- C. Referencias versionadas precalculadas por `dataVersion`/`scoringVersion`.

**Dependencias:** G3B-A01, G3B-F04, G3B-I04, G3B-M14.  
**Bloquea:** percentiles de performance; CC excepcional; labels; records comparativos.  
**Fuente:** MES §22.3 SC-02, SC-07, SC-13; DR-010, DR-049, DR-060, DR-061.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Toda cohorte debe declarar posición dominante, período,
competition/league level, eligibility, evidence floor y referencia versionada.
No se usa la población de CareerScore como proxy del field deportivo.  
**Alternativas rechazadas:** Percentil sin población; una cohorte ST/CM/GK;
fallback silencioso; posición inicial.  
**Motivo:** Fija metadata y ownership sin escoger población/estimador.  
**Dependencias desbloqueadas:** Contrato del cohort registry.  
**Parámetros aún calibrables:** Poblaciones, ventanas, shrinkage, muestras,
percentiles, fallbacks y targets.

### G3B-M16 — Catálogo numérico de scoring

**ID:** G3B-M16  
**Pregunta:** ¿Qué tablas versionadas contienen IJL, valores por logro/premio/record, pesos de componentes, rangos y factores competitivos?  
**Por qué importa:** Son parámetros de balance; deben cambiar con `scoringVersion`, no quedar dispersos en código.  
**Opciones razonables:**

- A. Un registry declarativo único por scoringVersion.
- B. Registros por categoría con manifest y hash conjunto.
- C. Base común más overrides por competición/país.

**Dependencias:** G3B-F04, G3B-I05, G3B-M02, G3B-M03, G3B-M04, G3B-M05, G3B-M06, G3B-M07, G3B-M08, G3B-M09, G3B-M15.  
**Bloquea:** calibración del score del slice; no bloquea interfaces parametrizadas.  
**Fuente:** MES §22.3; DR-010; MS §20.2–§20.9; ADR-015.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** CONFIRMADA COMO CONFIGURACIÓN VERSIONADA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Un manifest por `scoringVersion` referencia registries
tipados de IJL, competition values, award values/equivalence, records, PRI,
caps y tiers. Los valores explícitos de `MASTER_SPEC` se conservan; los rangos
no se rellenan por inferencia.  
**Alternativas rechazadas:** Constantes dispersas; values en Content; snapshot
dinámico de World; defaults silenciosos.  
**Motivo:** Separa regla/catálogo y fuerza bumps competitivos verificables.  
**Dependencias desbloqueadas:** Estructura del registry y fixtures de valores
conocidos.  
**Parámetros aún calibrables:** IJL definitivo, exactos dentro de rangos,
cohortes y valores faltantes.

### G3B-M17 — Orden de caps y límites de score

**ID:** G3B-M17  
**Pregunta:** ¿En qué orden se aplican caps de categoría, máximos por familias equivalentes y límites anuales de bonos de bajo valor?  
**Por qué importa:** Caps de score aprobados no son caps de ocurrencia; el orden puede cambiar el total y debe quedar explícito.  
**Opciones razonables:**

- A. Deduplicar→sumar→aplicar cap de categoría.
- B. Cap por familia→cap anual→agregación final.
- C. Transformaciones saturantes declaradas sin truncar facts.

**Dependencias:** G3B-M03, G3B-M04, G3B-M05, G3B-M06, G3B-M08, G3B-M09, G3B-M12, G3B-M14.  
**Bloquea:** bounded bonuses; orden normativo; invariantes de ledger.  
**Fuente:** MES §22.3 SC-03–SC-09; DR-005, DR-010; MS §20.7, §36; ADR-005.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Caps solo actúan sobre entries/agrupaciones de score y
nunca suprimen facts. Se conservan subcaps PBR 1000/1000, cap agregado
`min(2000,5%)` y demás límites explícitos; cada rule declara stacking, cap
group y canonical order.  
**Alternativas rechazadas:** Caps de gameplay; quota de eventos; orden
incidental; caps nuevos; truncar historia al alcanzar un máximo.  
**Motivo:** Cierra la frontera mecánica pero la fuente no fija todo el orden
entre equivalence, CC, stacking y caps.  
**Dependencias desbloqueadas:** Cap registry y audit fields.  
**Parámetros aún calibrables:** Orden exacto por familia, quantization del 5 %,
límites anuales de trofeos menores y fixtures.

### G3B-M18 — Reconstrucción, fixtures y compatibilidad

**ID:** G3B-M18  
**Pregunta:** ¿Qué fixtures normativos, reconciliaciones y reglas de versión prueban que un ledger se reconstruye desde facts y que un cambio altera `scoringVersion`?  
**Por qué importa:** Sin contrato de evidencia no se puede distinguir ajuste compatible de cambio competitivo ni auditar una carrera invalidada.  
**Opciones razonables:**

- A. Golden ledgers por categoría y carrera completa.
- B. Fixtures fact→entry más reconciliación end-to-end.
- C. Ambos, con matriz explícita de compatibilidad histórica.

**Dependencias:** G3B-M01, G3B-M02, G3B-M03, G3B-M04, G3B-M05, G3B-M06, G3B-M07, G3B-M08, G3B-M09, G3B-M10, G3B-M11, G3B-M12, G3B-M14, G3B-M15, G3B-M17.  
**Bloquea:** acceptance gate de DR-010; replay de scoring; auditoría; invalidación.  
**Fuente:** MES §22.1–§22.4, §24; DR-010, DR-063; ADR-007, ADR-015, ADR-016.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-28 (G3B Bloque 10)  
**Decisión aceptada:** Pipeline puro facts+registry+`scoringVersion`→ledger→PC,
hash chain, golden fact IDs, entries, categories y `ScoreSnapshot`. Igualdad de
`scoringVersion` es necesaria pero no suficiente para leaderboard. Scoring no
usa RNG.  
**Alternativas rechazadas:** Reejecutar gameplay para todo re-score; mutar el
ledger histórico; compatibility implícita; fixtures solo del total.  
**Motivo:** Cierra la arquitectura de evidencia; faltan outputs numéricos
porque diez SC siguen parciales.  
**Dependencias desbloqueadas:** Harness/golden structure y re-scoring
versionado.  
**Parámetros aún calibrables:** Golden outputs, full compatibility key,
reconciliation cases, correction policy y finalization ref de DR-069.

---

## N. Creation

### G3B-N01 — Unidad y componentes de Creation Budget

**ID:** G3B-N01  
**Pregunta:** ¿Qué unidad canónica mide poder inicial y qué capacidades, rasgos, pie, posición y variables ocultas consumen o redistribuyen presupuesto?  
**Por qué importa:** El presupuesto debe cubrir toda ventaja mecánica, no solo atributos visibles, para conservar equivalencia.  
**Opciones razonables:**

- A. Coste aditivo en unidades abstractas por componente.
- B. Coste en espacio de poder esperado.
- C. Presupuesto por familias con restricción global adicional.

**Dependencias:** G3B-A01, G3B-A04.  
**Bloquea:** DR-045; `CreationBudget`; validación de creación rápida.  
**Fuente:** MES §6, §25; DR-019, DR-023, DR-045; MS §7–§8; ADR-019, ADR-023.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** `Creation Budget` usa poder inicial esperado como unidad
conceptual y cubre el efecto conjunto de capabilities, traits, pie, posición y
variables ocultas. No es una suma nominal de atributos.  
**Alternativas rechazadas:** Presupuesto limitado a valores visibles; suma
trivial de puntos; ventajas ocultas o seleccionables fuera de la equivalencia.  
**Motivo:** La unidad estadística permite comparar distribuciones heterogéneas
sin fijar prematuramente costes.  
**Dependencias desbloqueadas:** Contrato conceptual de `CreationBudget`, diseño
parametrizado de generación y protocolo Monte Carlo.  
**Parámetros aún calibrables:** Función cuantitativa de poder, budget total,
costes, interacciones y tolerancias.

### G3B-N02 — Función de coste y conservación

**ID:** G3B-N02  
**Pregunta:** ¿La función de coste es lineal, convexa o basada en poder esperado, y cómo trata interacciones entre ventajas?  
**Por qué importa:** Igual total nominal no garantiza igual poder si atributos, rasgos o posiciones tienen sinergias.  
**Opciones razonables:**

- A. Costes convexos por capacidad más términos de interacción.
- B. Coste estimado por simulación de poder marginal.
- C. Tabla por arquetipo con validador de frontera global.

**Dependencias:** G3B-A02, G3B-N01.  
**Bloquea:** contabilidad de presupuesto; combinaciones dominantes; equivalencia entre modos.  
**Fuente:** MES §6.4, §25; DR-019, DR-045, DR-052; ADR-019.  
**Tipo:** FORMULA  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** La conservación se evalúa sobre poder esperado de la
configuración completa y debe capturar interacciones; una suma lineal de valores
no es normativa.  
**Alternativas rechazadas:** Igualar solamente suma de capabilities; costes que
ignoren posición, traits o sinergias; validar solo una media nominal.  
**Motivo:** Se cierra la semántica de equivalencia, pero no la función
cuantitativa requerida por DR-045.  
**Dependencias desbloqueadas:** Puede definirse una interfaz de costes
externalizados y un evaluador Monte Carlo sin asumir coeficientes.  
**Parámetros aún calibrables:** Estimador de poder, términos de interacción,
costes marginales, tolerancias y métricas. G3B-N02 permanece abierta en su
fórmula.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):**
`CreationPowerScore` queda como surrogate cuadrático sobre capabilities,
traits, posición, pie y edad, con target por quantile y banda de aceptación.
La forma está cerrada; faltan coeficientes, CDF y banda.

### G3B-N03 — Distribución inicial de Carrera rápida

**ID:** G3B-N03  
**Pregunta:** ¿Qué distribución conjunta genera capacidades iniciales y garantiza fuerza, debilidad y tensión de arquetipo sin exceder presupuesto?  
**Por qué importa:** Sorteos independientes producen jugadores planos o combinaciones dominantes; quick creation debe ser reproducible y correlacionada.  
**Opciones razonables:**

- A. Arquetipo primero y asignación condicionada.
- B. Distribución multivariante truncada por presupuesto.
- C. Generador secuencial con costes marginales y validación final.

**Dependencias:** G3B-A01, G3B-A04, G3B-N01, G3B-N02.  
**Bloquea:** atributos iniciales; arquetipos; creación rápida del slice.  
**Fuente:** MES §5, §6, §25; DR-018, DR-019, DR-045, DR-052; MS §7.2, §8.4.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** Carrera rápida parte de un perfil latente y genera
capabilities y traits mediante una distribución conjunta correlacionada. Los
arquetipos solo sesgan componentes de mezcla y mantienen soporte positivo.  
**Alternativas rechazadas:** Uniformes independientes; arquetipos rígidos;
combinaciones prohibidas por conveniencia editorial.  
**Motivo:** La arquitectura probabilística queda fijada sin convertir una
familia o matriz de balance en decisión estructural.  
**Dependencias desbloqueadas:** Generador parametrizable y tests de soporte,
correlación y determinismo.  
**Parámetros aún calibrables:** Familia conjunta, perfiles, pesos, medias,
dispersiones, correlaciones y restricciones estadísticas. G3B-N03 sigue abierta
para seleccionar y calibrar esos parámetros.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** se adopta mixture de
factores Normal con factor general, familia, Talent, profile y residuales por
capability/trait, seguido de sigmoid y `ROUND_HALF_EVEN`. Quick/Custom usan
rejection sampling condicionado al mismo target de poder. Faltan
weights/means/loadings/sigmas.

### G3B-N04 — Pie, posición y ventajas biográficas

**ID:** G3B-N04  
**Pregunta:** ¿Cómo participan `BOTH`, posición inicial y cualquier ventaja biográfica seleccionable en el presupuesto sin bloquear opciones aprobadas?  
**Por qué importa:** BOTH es seleccionable y aleatorio, pero debe tener coste equivalente; la posición puede cambiar el valor esperado de una asignación.  
**Opciones razonables:**

- A. Costes explícitos por opción y priors posicionales separados.
- B. Coste implícito mediante presupuesto restante y generador condicionado.
- C. Equivalencia medida por poder esperado de la configuración completa.

**Dependencias:** G3B-A01, G3B-B06, G3B-N01, G3B-N02.  
**Bloquea:** coste de ambidestreza; selección GK/CM/ST; validación de creación.  
**Fuente:** MES §25; DR-018, DR-023, DR-045, DR-048; ADR-018, ADR-019, ADR-023.  
**Tipo:** FOUNDATIONAL  
**Momento:** MUST_BEFORE_G3B

**Resolución:** PARCIALMENTE RESUELTA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** `BOTH`, posición y toda ventaja biográfica con efecto
sistemático participan en la evaluación conjunta de poder esperado. `BOTH`
conserva su disponibilidad normativa.  
**Alternativas rechazadas:** Ambidestreza gratuita; coste fijo inventado en este
bloque; excluir la posición de la validación de equivalencia.  
**Motivo:** Se fija la frontera del presupuesto, mientras los valores y el
modelo posicional pertenecen a balance y a DR-048.  
**Dependencias desbloqueadas:** Registro versionado de costes y validación
conjunta de configuraciones.  
**Parámetros aún calibrables:** Coste de `BOTH`, priors por posición, valor de
ventajas biográficas e interacciones. G3B-N04 depende además de G3B-B06 y
DR-048.

**Cierre G3C-2 — `PARTIAL_CALIBRATION` (2026-07-29):** posición y pie se
samplean/condicionan categóricamente; `BOTH` entra como término calibrado de
CreationPower y el sampler redistribuye el resto sin penalización fija de
capability. DR-048 ya no bloquea. Faltan foot effects, priors y tolerancias.

### G3B-N05 — Variables ocultas iniciales

**ID:** G3B-N05  
**Pregunta:** ¿Qué variables ocultas se generan al crear, cuáles consumen presupuesto y cómo se correlacionan con señales visibles sin revelarse?  
**Por qué importa:** Ocultas aleatorias preservan incertidumbre, pero una ventaja mecánica gratuita rompería la distribución de poder.  
**Opciones razonables:**

- A. Todas las latentes con efecto esperado consumen presupuesto.
- B. Priors comunes sin coste, salvo opciones seleccionables.
- C. Presupuesto sobre poder conjunto observado por Monte Carlo.

**Dependencias:** G3B-A04, G3B-A05, G3B-N01, G3B-N02, G3B-N03.  
**Bloquea:** generación de latentes; observabilidad inicial; equivalencia competitiva.  
**Fuente:** MES §5.5–§6.5, §25; DR-019, DR-045, DR-052; ADR-019.  
**Tipo:** DISTRIBUTION  
**Momento:** MUST_BEFORE_G3B

**Resolución:** RESUELTA EN SU ESTRUCTURA — 2026-07-27 (G3B Bloque 1)  
**Decisión aceptada:** Al crear se generan los diez traits iniciales y las
variables latentes autorizadas. Permanecen en `TruePlayerState`; sus señales o
estimaciones pertenecen a `PlayerKnowledge`. Todo efecto sistemático queda
incluido en la equivalencia de poder esperado.  
**Alternativas rechazadas:** Revelar latentes verdaderas; ventajas ocultas
gratuitas; duplicar latentes como valores visibles independientes.  
**Motivo:** Cierra propiedad, observabilidad y contabilidad sin fijar priors.  
**Dependencias desbloqueadas:** Schema futuro de estado verdadero/conocimiento y
generación de latentes parametrizada.  
**Parámetros aún calibrables:** Priors, correlaciones, precisión inicial,
incertidumbre y peso esperado de cada latente.

### G3B-N06 — Parámetros de creación rápida

**ID:** G3B-N06  
**Pregunta:** ¿Qué total, costes, priors, dispersiones, restricciones de arquetipo y tolerancias del generador rápido se externalizan?  
**Por qué importa:** Son balance; deben calibrarse con Monte Carlo sin hardcodear valores dentro del generador.  
**Opciones razonables:**

- A. Registry único por `engineVersion`/`dataVersion`.
- B. Presupuesto base más tablas por posición.
- C. Parámetros por arquetipo con validación global.

**Dependencias:** G3B-N01, G3B-N02, G3B-N03, G3B-N04, G3B-N05.  
**Bloquea:** calibración de creación del slice; no bloquea interfaces parametrizadas.  
**Fuente:** MES §25–§26; DR-019, DR-023, DR-045; ADR-019, ADR-023.  
**Tipo:** BALANCE  
**Momento:** CAN_CALIBRATE_DURING_G3B

**Resolución:** NO RESUELTA EN ESTE BLOQUE — confirmada como calibración
externalizable el 2026-07-27.  
**Decisión aceptada:** Todos los valores enumerados permanecen en un Parameter
Registry versionado y no forman parte fija del schema o algoritmo.  
**Alternativas rechazadas:** Hardcodear valores provisionales; convertirlos en
gates de estructura; cerrar medias o costes sin evidencia Monte Carlo.  
**Motivo:** El motor puede construirse contra contratos parametrizados antes de
calibrar el slice.  
**Dependencias desbloqueadas:** Interfaces de configuración y validadores pueden
diseñarse sin valores definitivos.  
**Parámetros aún calibrables:** Budget total, costes, priors, dispersiones,
correlaciones, perfiles, restricciones y tolerancias; la ficha conserva momento
`CAN_CALIBRATE_DURING_G3B`.

### G3B-N07 — Carrera personalizada y protocolo de equivalencia

**ID:** G3B-N07  
**Pregunta:** ¿Qué grados de libertad tendrá Carrera personalizada y qué métricas, tolerancias y tamaño de muestra demostrarán equivalencia con Carrera rápida?  
**Por qué importa:** El modo no pertenece al slice y no puede compartir leaderboard sin evidencia Monte Carlo previa.  
**Opciones razonables:**

- A. Asignación manual con costes y latentes aleatorias.
- B. Selección de arquetipo y prioridades, no valores directos.
- C. Optimización restringida con validación de distribución completa.

**Dependencias:** G3B-N01, G3B-N03, G3B-N05, G3B-N06.  
**Bloquea:** Carrera personalizada competitiva y leaderboard compartido; no bloquea el slice.  
**Fuente:** MES §25.3, §26.3; DR-019, DR-045; ADR-018, ADR-019.  
**Tipo:** BALANCE  
**Momento:** CAN_DEFER_AFTER_VERTICAL_SLICE

---

## Parameter Registry Candidates

Los siguientes valores deberían vivir en configuración inmutable y versionada, con schema, unidad, fuente, rango válido, owner de versión y hash. Esta lista no les asigna valores.

### Player, development y creación

- Escalas de presentación, precisión y reglas de conversión.
- Pesos de proyección por posición, tarea y contexto.
- Distribuciones iniciales, medias, dispersiones y colas de capabilities y traits.
- Priors, dispersión y correlaciones de variables latentes.
- Perfiles latentes, parámetros de arquetipos y pesos de mezcla.
- Parámetros de incertidumbre y ruido de observación.
- Precisión, confianza y contexto inicial de `PlayerKnowledge`.
- Curvas de maduración y diferencias por familia.
- Sensibilidad a edad y función de resistencia a extremos.
- Dispersión estocástica y covarianza de innovaciones.
- Curva no lineal minutos/experiencia.
- Efectos de `developmentQuality`, `managerQuality`, `professionalism`,
  `developmentCapacity` y `naturalTalent`.
- Curva de wear y efecto de `longevity`.
- Efectos de recuperación/secuelas sobre desarrollo.
- Parámetros y distribución conjunta del perfil latente de maduración.
- Interacciones entre componentes causales.
- Precisión intermedia, acumulación y cuantización explícita.
- Parámetros y matriz de compatibilidad de reconversión.
- Creation Budget total, costes marginales e interacciones.
- Función de poder inicial esperado y métricas de equivalencia.
- Priors y restricciones de arquetipos iniciales.
- Coste/equivalencia de `DominantFoot.BOTH`.
- Costes de ventajas de creación y sus interacciones.
- Priors posicionales y de variables ocultas.

### Rol, minutos y rendimiento

- Priors y parámetros de la distribución de `SportingRole`.
- `rolePersistence` sin cooldowns ni locks.
- Influencia de `managerTrust`, `tacticalFit`, competencia, rendimiento previo,
  reputación y contexto.
- Persistencia, reversión y shocks de confianza del entrenador.
- Escalas, distribuciones y evolución de `PositionCompetition`.
- Calendarios agregados y `TeamMinutesOpportunity` por Q/competición/contexto.
- Mapping de `AvailabilityEnvelope` a `availableTeamMinutes`.
- Familia, masa en cero y dispersiones de `minuteShare`.
- Parámetros de minutos por rol, posición y contexto.
- Precisión, redondeo y cuantización de expectativa/share/minutos.
- Derivación probabilística de apariciones y titularidades.
- Asignación por competición y parámetros de `usageByPosition`.
- Contexts de streams, golden fixtures y tolerancias Monte Carlo.
- Transforms, dominio y precisión de `EffectiveCapabilities`.
- Sensibilidades de estados dinámicos por capability/family/contexto.
- Dimensiones, escalas y pesos posicionales de UnderlyingPerformance.
- Parámetros de generación de oportunidades y chance quality.
- Parámetros de conversión/creación y familias de conteo.
- Overdispersion, mixtures, colas y matrices de correlación.
- Jerarquía de shocks compartidos e idiosincráticos.
- Efecto de `consistency` sobre dispersión/volatilidad.
- Persistencia, regresión, saturación y shocks de `form`.
- Influencia y dinámica de `confidence`.
- Influencia contextual de `morale`.
- Sensibilidad a `fitness`/`fatigue` por capability family.
- Efecto de presión y `pressureResistance`.
- Pesos de club, rival, competición y contexto, sin reescribir raw production.
- Tasas y distribuciones de producción `GK`, `CM` y `ST`.
- Exposición GK, oportunidades de atajada y valla invicta.
- Parámetros de `progressionImpact`, `creativeImpact`,
  `defensiveContribution` y `controlImpact`.
- Escala y fórmula por finalidad de ratings derivados.
- Agregación Q→temporada y suficientes estadísticos.
- Evidencia/uncertainty para muestras escasas.
- Definición de high-pressure exposure y oportunidades importantes.
- Precisión, redondeo y serialización de Performance.
- Targets por posición, edad, rol, liga y nivel competitivo.

### Salud

- Dominios, precisión y cuantización de fitness/fatigue.
- Hazards base.
- Transforms de exposición competitiva, entrenamiento/background,
  no futbolística y externa.
- Transforms y memoria de carga reciente/acumulada.
- Persistencia/recuperación de fatigue y dinámica de fitness.
- Pesos, taxonomía y parámetros de `InjuryFamily`.
- Distribuciones de severidad y duración de recuperación.
- Curvas/transiciones de recuperación e incertidumbre de estimaciones.
- Hazard de recaída/agravamiento.
- Probabilidades y perfiles de secuela.
- Sensibilidad a edad.
- Efectos de `injuryFragility`, `recoveryCapacity`, `medicalQuality` e historia.
- Distribuciones de origen.
- Interacciones entre condiciones concurrentes.
- Mapping de condiciones/restricciones a `MedicalAvailabilityEnvelope`.
- Composición médica interna de condiciones activas.
- Parámetros de `LIMITED_RETURN`.
- Orden canónico de oportunidades, namespaces/contextos de streams y
  correlaciones.
- Taxonomía y seis lesiones del slice.
- Fixtures y targets de incidencia, duración, ausencia, recaída, secuela y
  carga.
- Asignación médica compatible con la composición ya cerrada por ADR-072/DR-064.

### Clubes, competiciones y mundo

- Dominios, escalas, precisión y cuantización de Club/League/World State.
- Priors de attack, defensive y control strength.
- Persistencia, reversión y shocks de fuerza deportiva.
- Dinámica e inercia de prestigio.
- Dinámica de `financialPower` y `stability`.
- Manager quality, turnover, tenure, influencia y cambio de contexto.
- Distribuciones y evolución de `TacticalIdentity`.
- Función y parámetros de `TacticalFit`.
- Generación/evolución de `PositionCompetition`.
- Calendarios agregados y `TeamMinutesOpportunity`.
- Schedule difficulty, congestión y high-pressure exposure.
- Formatos, fases, cupos y qualification.
- `TeamSupportField`.
- Proyección `PlayerCompetitiveContribution`.
- Efecto de contribución del jugador en outcomes.
- Familias, dispersiones y colas de resultados colectivos.
- Correlaciones entre Q y entre liga/copa/continental.
- Estado y evolución de `leagueCompetitiveStrength`.
- Evolución de ClubState y LeagueState.
- Jerarquía, cargas y correlaciones de shocks globales, regionales, de liga,
  club y competición.
- Tasas de deriva, reversión y transición de regímenes.
- Parámetros y estabilizadores de ciclos económicos/deportivos.
- Promotion/relegation y materialización desde `ExternalClubPool`.
- Precision/quantization de outcomes.
- Namespaces/contextos de streams.
- Snapshot inicial, fields y catálogo de Argentina/España.
- Targets Monte Carlo y golden fixtures de contexto, outcomes, movilidad y
  estabilidad multi-década.

### Transferencias y mercado

- Actualización, precisión e incertidumbre de `MarketPerception`.
- Ponderación de evidencia, exposición y potencial percibido.
- Modelo, persistencia y shocks de `MarketValueEstimate`.
- Generación/evolución de `ClubNeed` y `PositionScarcity`.
- Función de `PlayerClubFit`.
- Intensidades, multiplicidad y correlaciones del campo de candidatos/interés.
- Coeficientes de necesidad, encaje, prestigio, reputación, contrato y economía.
- Probabilidad interés→oferta y distribución de términos.
- `FinancialFeasibilityAssessment`, transfer/salary budget context.
- Modelos/distribuciones de `TransferFee` y `SalaryTerms`.
- Duraciones, vencimientos, leverage y rangos contractuales.
- Parámetros de renovación, negociación, expiración y resultado.
- Pesos de preferencias del jugador y de `ContractExpectation`.
- Propensión y términos de préstamo.
- Ciclos de mercado, wage environment y flujos regionales.
- Catálogo/unidades menores de moneda; conversión, fuentes y presentación.
- Calendario de mercado y efectividad entre Qs cuando DR-021/067 lo cierre.
- Elegibilidad/inscripción cuando DR-066 la cierre.
- Parámetros del tier externo cuando DR-065 lo cierre.
- Precisión/cuantización, orden, namespaces/contextos de streams.
- Golden fixtures y targets Monte Carlo de interés, oferta, acuerdo,
  movimiento, renovación, loans, fees, salary y valor.
- Targets de movimientos y valores por edad, posición, liga y nivel.

### Selección y premios

- Candidate signals y `SelectionCompetitionField` por país, posición,
  generación, contexto y era.
- Strength, depth, dispersion, tails, incumbency y generation evolution.
- League/context/evidence weighting, age effects y sporting reputation.
- Call-up, squad, `InternationalRole`, minute share, support/contribution y
  outcome distributions.
- Calendario, pressure exposure, precisión, streams, golden fixtures y targets
  internacionales.
- Distribuciones de `AwardCompetitionField` y
  `StatisticalCompetitionField`.
- Award candidate weights, title/context/pressure/reputation effects y evidence
  uncertainty.
- Judging variance, regional effects, placement/order statistics y tie policy.
- Evaluación posicional `GK`/`CM`/`ST`, sparse exposure y métricas GK
  autorizadas.
- Catálogo mínimo, eligibility/evidence policies y Definitions de premios.
- Precisión, streams, golden fixtures y targets por award/cohorte/era.

### Reputación, social y retiro

- Dominios, escalas, precisión y cuantización de sporting standing, awareness,
  sentiment, evidence strength, Public Attention y Engagement.
- Categorías/proyecciones visibles de reputación y sentimiento.
- Pesos por familia de evidencia, surprise/update transforms, memory kernels,
  persistencia, recencia, regresión y decay.
- Source-memory compaction, identity/evidence keys y tolerancias de
  reconciliación.
- `ReputationMarketDefinition`, regiones, topología, audiencias superpuestas,
  pesos de agregación y difusión entre mercados.
- Shared-shock loadings y correlaciones Reputation/Social.
- Representación exacta y rango de `FollowerCount`.
- Adquisición orgánica, churn, cambios enteros, overdispersion, mixtures, shocks
  y colas de followers.
- Dinámica, persistencia, regresión y saturación de attention/engagement.
- Club/international reach, viral/event shocks y difusión regional.
- Parámetros futuros de sponsors, si se aprueba el subsistema.
- Dominio, componentes y uncertainty de `CareerMotivationAssessment`.
- Hazard/competing risks de retiro por causa, edad, posición y contexto.
- Efectos de capability/performance/decline, Health burden, role/minutes,
  contract/Market, motivation, achievements y reputation.
- Policy de outcome/decisión por causa.
- Hazard y dinámica posretiro de comeback.
- Precisión, orden, namespaces/contextos de streams y golden fixtures.
- Targets de audiencia, reputación, longevidad, retiro, comeback, retiros
  múltiples, terminación práctica y carreras extremas.

### Scoring

- Pesos y ecuación de `ContributionCoefficient`.
- Catálogo `IJL` y política de derivación.
- Valores base de logros domésticos e internacionales.
- Parámetros y componentes de `PSN`.
- Valores, equivalencias y precedencias de premios.
- Pesos posicionales de season performance.
- Definiciones y valores de records/longevidad.
- Parámetros y límites de `PBR`.
- Caps de categoría y orden de aplicación.
- Cohortes, poblaciones, ventanas y muestras mínimas de percentiles.
- Rangos regionales/globales y factores competitivos.
- Modo y puntos de redondeo.
- Bandas narrativas de resultado final.

---

## Resumen cuantitativo

| Métrica | Cantidad |
|---|---:|
| Decisiones totales | 106 |
| `MUST_BEFORE_G3B` | 88 |
| `CAN_CALIBRATE_DURING_G3B` | 15 |
| `CAN_DEFER_AFTER_VERTICAL_SLICE` | 3 |

Los 15 ítems calibrables no autorizan valores provisionales hardcoded: G3B puede construir contra registros externos tipados y completar su calibración antes del gate de aceptación correspondiente.

### Estado de resolución del Bloque 1

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resueltas estructuralmente | 7 | G3B-A01, G3B-A02, G3B-A03, G3B-A04, G3B-A05, G3B-N01, G3B-N05 |
| Parcialmente resueltas por dependencia con otro bloque | 9 | G3B-A06, G3B-B03, G3B-B04, G3B-C02, G3B-D01, G3B-E01, G3B-N02, G3B-N03, G3B-N04 |
| Confirmada como calibración, no cerrada | 1 | G3B-N06 |

De las seis decisiones `MUST_BEFORE_G3B` de Player Model, cinco quedan
resueltas. G3B-A06 conserva únicamente su parte matemática, que depende de
Development & Aging y Performance; ya no bloquea el schema fundamental.

### Estado de resolución del Bloque 2

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resuelta estructuralmente | 1 | G3B-B01 |
| Parcialmente resueltas; estructura cerrada y matemática/dependencia abierta | 10 | G3B-A06, G3B-B02, G3B-B03, G3B-B04, G3B-B05, G3B-B06, G3B-C05, G3B-E01, G3B-E07, G3B-F01 |
| Confirmada como calibración, no cerrada | 1 | G3B-B07 |

El Bloque 2 cierra unidad de cambio, cadencia, causas auditables, familias,
perfil latente, ausencia de ceilings, fronteras con Health y semántica de
longevidad. No selecciona la familia de proceso, ecuaciones, covarianza,
precisión ni valores. G3B-A06 queda cerrada respecto del potencial; su mitad de
calidad efectiva continúa en Performance.

### Estado de resolución del Bloque 3

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resuelta estructuralmente | 1 | G3B-C01 |
| Parcialmente resueltas; estructura cerrada y matemática/dependencia abierta | 14 | G3B-A06, G3B-B04, G3B-B05, G3B-C02, G3B-C03, G3B-C04, G3B-C05, G3B-C06, G3B-D01, G3B-E01, G3B-F01, G3B-F02, G3B-F03, G3B-F04 |
| Confirmada como calibración, no cerrada | 1 | G3B-C07 |

El Bloque 3 separa estado institucional, expectativa y uso, y fija interfaces
causales de posición, confianza, competencia, disponibilidad, oportunidad,
rol, minutos y Performance. No selecciona distribuciones, coeficientes,
precisión, calendarios, hazards o fórmulas de club. DR-021, DR-022 y DR-054 a
DR-057 conservan los bloqueos matemáticos indicados en cada ficha.

### Estado de resolución del Bloque 4

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resueltas estructuralmente | 2 | G3B-A06, G3B-D01 |
| Parcialmente resueltas; estructura cerrada y matemática/dependencia abierta | 8 | G3B-D02, G3B-D03, G3B-D04, G3B-D05, G3B-D06, G3B-D07, G3B-D08, G3B-D09 |
| Confirmada como calibración externalizada | 1 | G3B-D10 |
| Interfaces directas refinadas sin cerrar la decisión propietaria | 20 | G3B-B02, G3B-B05, G3B-C02, G3B-C05, G3B-C06, G3B-E01, G3B-F01, G3B-F04, G3B-G02, G3B-G07, G3B-H02, G3B-H03, G3B-I01, G3B-I03, G3B-K01, G3B-K02, G3B-M02, G3B-M07, G3B-M14, G3B-M15 |

El Bloque 4 fija el pipeline
`TrueCapabilities → EffectiveCapabilities → UnderlyingPerformance →
ObservedProduction → PerformanceSummary`, los outputs mínimos de `GK`/`CM`/`ST`,
la separación raw production/evaluación, la evidencia de presión, el ownership
de Dynamic States y la agregación Q→temporada. No selecciona familia de conteo,
ecuaciones, escalas, precisión, correlaciones, parámetros ni targets.

G3B-A06 queda cerrada estructuralmente. DR-055 y DR-056 continúan parcialmente
abiertas y DR-008/DR-010 no se cierran. Las tarjetas cross-block conservan sus
propios bloqueos en Health, Club, Market, Selection, Awards, Reputation y
Scoring.

### Estado de resolución del Bloque 5

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resuelta estructuralmente | 1 | G3B-E01 |
| Parcialmente resueltas; estructura cerrada y matemática abierta | 5 | G3B-E02, G3B-E03, G3B-E05, G3B-E06, G3B-E07 |
| Confirmadas como calibración externalizada | 2 | G3B-E04, G3B-E08 |
| Interfaces directas refinadas sin cerrar la decisión propietaria | 19 | G3B-B02, G3B-B04, G3B-B05, G3B-C04, G3B-C05, G3B-C06, G3B-D02, G3B-D05, G3B-D06, G3B-D07, G3B-D08, G3B-D09, G3B-F01, G3B-F04, G3B-G02, G3B-H02, G3B-L02, G3B-L04, G3B-M14 |

El Bloque 5 separa fitness, fatigue, carga, condiciones, episodios,
recuperación e historia; fija `MedicalAvailabilityEnvelope`, concurrencia,
orígenes, recuperación limitada, relación causal de recaída y frontera de
secuela con Development. ADR-042 no se reabre: una lesión de `HEALTH(Qn)`
empieza a afectar Qn+1.

DR-057 continúa `BLOCKER_G3` por funciones, distribuciones, precisión, orden,
streams, parámetros, catálogo y fixtures. DR-064 registra la dependencia nueva
de disciplina y composición de disponibilidad agregada sin atribuirla a Health.
No se fijó ningún valor calibrable.

### Estado de resolución del Bloque 6

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resueltas estructuralmente | 4 | G3B-F01, G3B-F02, G3B-F04, G3B-J01 |
| Parcialmente resueltas; estructura restringida y matemática/scope abierto | 6 | G3B-F03, G3B-F05, G3B-F06, G3B-J02, G3B-J03, G3B-J04 |
| Confirmadas como calibración externalizada | 2 | G3B-F08, G3B-J05 |
| Diferible sin cambio | 1 | G3B-F07 |

El Bloque 6 separa definitions reales de states ficticios, fija `ClubState`,
`LeagueState`, `CompetitionState` y `WorldState`, define ownership de táctica,
competencia y calendario agregado, separa contribución del protagonista del
support field, y mantiene `leagueCompetitiveStrength` fuera de IJL.

DR-022 queda parcialmente resuelta en su estructura mediante
[ADR-022](./adr/022-club-competition-world-model.md), pero continúa
`BLOCKER_G3` por matemática, escalas, streams, parámetros y fixtures. DR-021
mantiene calendario/tiempo; DR-065 registra scope, pool y continuidad tras
movilidad. No se fijó ningún valor calibrable ni catálogo por inferencia.

### Estado de resolución del Bloque 7

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resueltas estructuralmente | 2 | G3B-G05, G3B-G06 |
| Parcialmente resueltas; estructura restringida y matemática/timing/scope abierto | 5 | G3B-G01, G3B-G02, G3B-G03, G3B-G04, G3B-G07 |
| Confirmada como calibración externalizada | 1 | G3B-G08 |

El Bloque 7 fija el pipeline Perception→Need→Interest→Offer→Negotiation→
Decision→Outcome→Contract, separa MarketValue/fee/salary, resuelve
`ContractExpectation`, distingue acuerdos de clubes/jugador y soporta
transferencia permanente, loan, free transfer y temporadas multiclub.

[ADR-058](./adr/058-transfer-market-contract-model.md) y
[`TRANSFER_MARKET_CONTRACT_SPEC.md`](./TRANSFER_MARKET_CONTRACT_SPEC.md)
formalizan la estructura. DR-058 y DR-027 permanecen parcialmente abiertas por
matemática/calibración. DR-066 registra elegibilidad competitiva y DR-067 el
conflicto entre movimientos mid-season y el cursor vigente. DR-065 continúa
bloqueando el mercado fuera del tier. No se fijó ningún parámetro.

### Estado de resolución del Bloque 8

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resuelta estructuralmente | 1 | G3B-I01 |
| Parcialmente resueltas; estructura restringida y matemática/timing/scope abierto | 7 | G3B-H01, G3B-H02, G3B-H03, G3B-H04, G3B-I02, G3B-I03, G3B-I04 |
| Confirmadas como calibración/contenido externalizados | 2 | G3B-H05, G3B-I05 |

El Bloque 8 fija `NationalTeamState`, `NationalTeamContext`,
`SelectionCompetitionField`, Eligibility lógica, el pipeline completo de
selección y la reutilización contextual de Role & Minutes/Performance. Para
Awards separa Definition/Edition, fields comparativos/estadísticos, categorías,
evidence keys, outcomes ordinales y timing `AWARDS → AWARD_EVENTS`.

[ADR-059](./adr/059-national-team-model.md),
[ADR-060](./adr/060-awards-model.md) y
[`NATIONAL_TEAM_AWARDS_SPEC.md`](./NATIONAL_TEAM_AWARDS_SPEC.md) formalizan la
estructura. DR-059/060 siguen `BLOCKER_G3` por matemática, streams, precisión,
calendario/cursor, parámetros y fixtures. DR-068 registra nacionalidad deportiva
y elegibilidad del slice. DR-049 conserva dominancia y DR-055 las métricas GK;
los facts y su allowlist ya quedaron cerrados por DR-063/ADR-010. Awards no
aplica scoring ni anti-duplicación. No se fijó ningún valor.

### Estado de resolución del Bloque 9

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resueltas estructuralmente | 3 | G3B-K03, G3B-K04, G3B-L03 |
| Parcialmente resueltas; estructura restringida y matemática/timing abierto | 6 | G3B-K01, G3B-K02, G3B-K05, G3B-L01, G3B-L02, G3B-L04 |
| Confirmadas como calibración externalizada | 2 | G3B-K06, G3B-L05 |
| Diferida sin cambio | 1 | G3B-K07 |

El Bloque 9 separa Sporting/Public Reputation, Public Attention, followers y
engagement; fija mercados data-driven, vistas regional/global, evidencia
idempotente y shocks compartidos sin `fameOverall`. Para Retirement separa
`PlayerPlayingStatus` de `CareerStatus`, define motivation derivada, causes,
episodios y comeback sin edad máxima, cooldown o retiro por falta de club.

[ADR-061](./adr/061-reputation-and-social-model.md),
[ADR-062](./adr/062-playing-retirement-and-comeback.md) y
[`REPUTATION_SOCIAL_RETIREMENT_SPEC.md`](./REPUTATION_SOCIAL_RETIREMENT_SPEC.md)
formalizan la estructura. DR-061/062 siguen `BLOCKER_G3` por matemática,
dominios, precisión, streams, parámetros y fixtures. DR-069 registra el
conflicto entre retiro reversible, `CareerStatus.RETIRED`, cursor posretiro,
freeze de scoring y finalización. DR-010 conserva la matemática PBR; DR-063 ya
cierra facts y allowlist mediante ADR-010.
No se fijó ningún valor ni se implementó gameplay.

### Estado de resolución del Bloque 10

| Resultado | Cantidad | IDs |
|---|---:|---|
| Resueltas estructural/normativamente | 4 | G3B-M01, G3B-M12, G3B-M13, G3B-M14 |
| Parcialmente resueltas; estructura/regla conocida y matemática o scope abierto | 13 | G3B-M02–M11, G3B-M15, G3B-M17, G3B-M18 |
| Confirmada como configuración/calibración versionada | 1 | G3B-M16 |

El Bloque 10 fija la taxonomía `InternalEngineSignal`/`DomainFact`/
`NarrativeEvent`/`ScoreLedgerEntry`, el catálogo único de facts, identidad y
orden deterministas, allowlist por categoría, rule registry, idempotencia,
ledger append-only, reversals, hashes, re-scoring y `ScoreSnapshot`.

[ADR-010](./adr/010-scoring-ledger-and-domain-facts.md) y
[`SCORING_FACTS_SPEC.md`](./SCORING_FACTS_SPEC.md) cierran DR-063
estructuralmente. Para scoring, SC-01, SC-12 y SC-13 quedan resueltas; SC-02 a
SC-11 permanecen parciales por fórmulas, cohortes, scopes, catálogos u orden de
caps. G3C-2 resolvió DR-049; DR-010, DR-066/067 y DR-069 continúan bloqueando
implementación.

Se preservan exactamente los valores de `MASTER_SPEC`, `PRL` queda reservado a
records/longevidad y `PBR` a popularidad/redes/achievements históricos bounded.
Los caps limitan points, no hechos. Content no puede puntuar y Scoring no usa
RNG.

## Transición a G3C

**Estado al 2026-07-29:** G3B conserva su cierre estructural. G3C-1 no cambia
ningún `PARTIAL` a `RESOLVED`; establece el contrato común y asigna un owner de
cierre a las 63 decisiones.

La especificación normativa es
[`MATHEMATICAL_CALIBRATION_CONTRACT.md`](MATHEMATICAL_CALIBRATION_CONTRACT.md).
[ADR-070](adr/070-mathematical-runtime-and-parameter-sets.md) resuelve la
identidad inmutable del `EngineParameterSet`, su hash y su relación con las
cinco versiones canónicas.

| Fase G3C | Scope | IDs `PARTIAL` | Cantidad |
|---|---|---|---:|
| G3C-2 | Player creation, Development & Aging | B02–B06, N02–N04 | 8 |
| G3C-3 | Role, Minutes, Calendar & Availability | C02–C06, F03 | 6 |
| G3C-4 | Performance, Form & Production | D02–D09 | 8 |
| G3C-5 | Health, Injuries & Recovery | E02, E03, E05–E07 | 5 |
| G3C-6 | Club, Competitions & World | F05, F06, J02–J04 | 5 |
| G3C-7 | Transfers, Market & Contracts | G01–G04, G07 | 5 |
| G3C-8 | National Team & Awards | H01–H04, I02–I04 | 7 |
| G3C-9 | Reputation & Social | K01, K02, K05 | 3 |
| G3C-10 | Retirement, Comeback & Finalization | L01, L02, L04 | 3 |
| G3C-11 | Scoring | M02–M11, M15, M17, M18 | 13 |
| **Total** |  |  | **63** |

G3C-12 será calibración integrada y no recibirá decisiones incompletas: solo
podrá validar modelos ya cerrados. Las catorce decisiones `CAN_CALIBRATE`
continúan abiertas como registries/targets; las tres decisiones diferibles no
cambian de momento.

### Estado después de G3C-2

| Estado de cierre matemático | Cantidad | IDs |
|---|---:|---|
| `PARTIAL_CALIBRATION` | 8 | B02–B06, N02–N04 |
| `PARTIAL` aún sin familia matemática cerrada | 55 | Resto de la matriz G3C-3–G3C-11 |

Las ocho decisiones conservan parámetros iniciales pendientes, pero ninguna
requiere que implementación elija una ecuación o sampler. DR-048/049 quedan
resueltas; DR-045/053 permanecen `PARTIAL_CALIBRATION`.

### Estado después de G3C-3

| Estado de cierre matemático | Cantidad acumulada | IDs |
|---|---:|---|
| `RESOLVED_MATH` | 2 | C04, F03 |
| `PARTIAL_CALIBRATION` | 12 | B02–B06, C02, C03, C05, C06, N02–N04 |
| `PARTIAL` aún sin familia matemática cerrada | 49 | Matriz G3C-4–G3C-11 |

Las seis decisiones G3C-3 tienen familia matemática cerrada. ADR-072 resuelve
DR-064; DR-054 pasa a `PARTIAL_CALIBRATION`; DR-021 conserva únicamente sus
preguntas de formato/generación/integración temporal. El detalle normativo está
en [`ROLE_MINUTES_MATH_SPEC.md`](ROLE_MINUTES_MATH_SPEC.md).

## Orden recomendado para resolver `MUST_BEFORE_G3B`

El orden original se conserva como trazabilidad. Al continuar desde los Bloques
1 a 10, deben omitirse las fichas ya resueltas y retomarse las parcialmente
resueltas en el bloque señalado por su resolución.

1. **Fundación numérica y temporal:** G3B-A01, G3B-F03, G3B-A02, G3B-A03, G3B-A04, G3B-F01.
2. **Estados y contextos base:** G3B-A05, G3B-B01, G3B-C02, G3B-E01, G3B-F02, G3B-J01, G3B-K03, G3B-N01, G3B-A06, G3B-C01, G3B-C03, G3B-F04, G3B-J02, G3B-N02.
3. **Trayectorias y exposición inicial:** G3B-B03, G3B-C04, G3B-D01, G3B-G06, G3B-H04, G3B-J04, G3B-L01, G3B-N03, G3B-B04, G3B-C05, G3B-D08, G3B-K01, G3B-N05.
4. **Desarrollo, posición y creación completa:** G3B-B02, G3B-K04, G3B-L03, G3B-B06, G3B-C06, G3B-N04.
5. **Producción y salud por Q:** G3B-D02, G3B-E02, G3B-D03, G3B-E03, G3B-D04, G3B-D05, G3B-D06, G3B-D07, G3B-E05, G3B-D09, G3B-E06.
6. **Consecuencias y mundo siguiente:** G3B-E07, G3B-F05, G3B-G07, G3B-K05, G3B-B05, G3B-F06, G3B-J03, G3B-K02, G3B-L02.
7. **Fields y elegibilidad:** G3B-G01, G3B-H01, G3B-I01, G3B-L04, G3B-G02, G3B-H02, G3B-I02, G3B-I04.
8. **Resoluciones externas:** G3B-G03, G3B-H03, G3B-I03, G3B-G04, G3B-G05.
9. **Facts y contrato numérico de scoring:** G3B-M14 y G3B-M12 están
   resueltas; continuar G3B-M15, M02, M05–M11.
10. **Cierre matemático de scoring:** continuar G3B-M03, G3B-M04, G3B-M17 y
   G3B-M18; G3B-M01/M13 ya están resueltas y G3B-M16 permanece como registry
   versionado.

Dentro de cada bloque, respetar las dependencias declaradas en las fichas. No iniciar calibración numérica hasta que la representación y la familia de fórmula/distribución correspondiente estén cerradas.
