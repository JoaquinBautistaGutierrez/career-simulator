# ADR-022: Estructura agregada de clubes, competiciones y mundo

- **Estado:** Aceptado — alcance estructural; DR-022 permanece parcialmente abierta
- **Fecha:** 2026-07-28
- **Decisión relacionada:** DR-022
- **Especificación normativa:** [`../CLUB_COMPETITION_WORLD_SPEC.md`](../CLUB_COMPETITION_WORLD_SPEC.md)
- **Aclara:** ADR-015, ADR-018, ADR-042, ADR-054, ADR-055 y ADR-057

## Contexto

El motor necesita clubes reales, oportunidades de minutos, resultados,
títulos, movilidad de divisiones y evolución durante décadas sin simular
partidos ni plantillas completas. Los contratos previos ya requerían táctica,
competencia por puesto, contexto de Performance, calendario y calidad médica/de
desarrollo, pero no existía un owner ni una separación completa entre datos
reales y futuro ficticio.

Sin una frontera explícita, una implementación podía:

- mutar la snapshot real durante una Career;
- usar un `ClubOverall` como causa universal;
- confundir fuerza deportiva, prestigio, finanzas e IJL;
- duplicar la contribución del protagonista dentro del baseline del equipo;
- sortear liga, copa y continente como resultados independientes;
- proteger clubes grandes mediante pisos o inmunidades;
- forzar una transferencia cuando el club descendiera;
- inventar clubes para completar un formato.

Las escalas, fórmulas, distribuciones, catálogos y reglas de calendario todavía
no están aprobadas. Este ADR fija únicamente la arquitectura matemática.

## Decisión

### Definiciones y estado

`dataVersion` selecciona definiciones inmutables:

- `ClubDefinition`;
- `LeagueDefinition`;
- `CompetitionDefinition`.

La evolución ficticia se conserva en:

- `ClubState`;
- `LeagueState`;
- `CompetitionState`;
- `WorldState`.

Una Career nunca consulta datos reales posteriores para continuar o reproducir
su historia. Los IDs reales se preservan y ningún field abstracto se presenta
como una identidad inventada.

### Club multidimensional

`ClubState` separa:

- `attackStrength`;
- `defensiveStrength`;
- `controlStrength`;
- `prestige`;
- `financialPower`;
- `developmentQuality`;
- `medicalQuality`;
- `stability`;
- `ManagerContext`;
- `PositionCompetition`;
- membresía competitiva.

Un overall puede existir solo como vista derivada y explicable. Fuerza
deportiva, prestigio y finanzas tienen dinámicas diferentes. Ninguna identidad
recibe un piso de fuerza, inmunidad al descenso o clasificación garantizada.

### Entrenador, táctica y competencia

`ManagerContext` tiene identidad/versionado y punto causal de vigencia.
`TacticalIdentity` es un vector compacto de demandas, no un arquetipo rígido.
`TacticalFit` se deriva del jugador y el contexto.

Club es owner de `PositionCompetition`, un field de fuerza, profundidad y
entrenchment por posición/contexto. No se simulan competidores individuales.

### Calendario y competición

Competitions/Calendar produce por Q:

- `TeamMinutesOpportunity`;
- dificultad de agenda;
- congestión;
- exposición high-pressure;
- splits por competición.

`teamMinutes` es el máximo físico ocupable por un jugador, no la suma de once
puestos ni un cap editorial.

`CompetitionDefinition` se separa de `CompetitionState`. La arquitectura admite
liga, copa doméstica, continental, supercopa e internacional de clubes y
resuelve clasificación, fase, eliminación, título y qualification sin fixtures
o marcadores por defecto.

### Resultado colectivo

Performance puede proyectarse internamente a
`PlayerCompetitiveContribution` por competición. No es score ni
`ContributionCoefficient`.

`TeamSupportField` representa al resto del equipo y excluye al protagonista.
Los outcomes consumen contexto, soporte, contribución, factores compartidos y
variación específica. Se resuelven por competición y permanecen
correlacionados sin ser idénticos.

### Liga, mundo e IJL

`leagueCompetitiveStrength` es estado deportivo ficticio y dinámico. `IJL` es
jerarquía fija de scoring ligada a `scoringVersion` y `dataVersion`; una no
reescribe la otra.

`WorldState` combina estados identificados y fields agregados. Shocks se
organizan en scopes global, regional, liga, club e idiosincrático y cada causa
se resuelve una sola vez. Ciclos modifican distribuciones futuras sin guionizar
historias.

Club, liga y mundo se actualizan para el futuro después de outcomes confirmados.
No modifican ventanas o temporadas cerradas.

### Ascenso y descenso

La arquitectura representa movilidad de tier. Un pool externo de identidades
reales es una opción compatible, no una política todavía aceptada.

Si el club del protagonista desciende, conserva jugador y contrato. No existe
transferencia automática. DR-065 debe cerrar el scope de datos, el pool y la
continuidad fuera del tier detallado antes del vertical slice.

## Alternativas rechazadas

1. **Snapshot real mutable:** rompe replay y convierte ficción en actualización
   de datos.
2. **ClubOverall causal:** oculta dimensiones y genera doble conteo.
3. **Prestigio o finanzas como fuerza deportiva:** impide decadencia y
   emergentes.
4. **Plantilla completa:** excede el nivel agregado aprobado.
5. **Partidos/fixtures por defecto:** agrega precisión y coste no necesarios.
6. **Resultados independientes por competición:** rompe causas compartidas.
7. **El protagonista como único determinante:** elimina el resto del equipo.
8. **Baseline que ya incluye al protagonista:** duplica contribución.
9. **IJL dinámico con el mundo:** reescribe scoring oficial de una Career.
10. **Protección por identidad:** contradice el universo probabilístico.
11. **Clubes sintéticos nombrados:** contradice el catálogo real versionado.
12. **Transferencia automática por descenso:** inventa una decisión mecánica.
13. **Coeficientes provisionales hardcoded:** convierte balance pendiente en
    regla normativa.

## Consecuencias

### Positivas

- Club, Competitions y World tienen ownership explícito;
- snapshot real y futuro ficticio quedan separados;
- Role & Minutes, Performance, Health y Development reciben contratos
  consistentes;
- resultados colectivos pueden correlacionarse sin plantillas o partidos;
- la movilidad de tiers no queda excluida por la arquitectura;
- IJL permanece estable y separado de dificultad dinámica;
- el vertical slice puede acotarse sin diseñar el mundo completo.

### Costes y restricciones

- DR-021 debe cerrar tiempo, calendario y formatos;
- DR-022 sigue bloqueando matemática, escalas, streams, parámetros y fixtures;
- DR-025 debe elegir identidades, fuentes y licencias;
- DR-063/ADR-010 ya fijan facts, clasificación y allowlist;
- DR-065 debe resolver pool, movilidad y continuidad;
- Market, Selection, Awards y Scoring deben mantener sus fronteras;
- no puede implementarse gameplay de este bloque todavía.

## Impacto en el Design Board

- G3B-F01, F02, F04 y J01 quedan resueltas estructuralmente.
- G3B-F03, F05, F06 y J02–J04 quedan estructuralmente restringidas y
  parcialmente abiertas por matemática, calendario o scope.
- G3B-F08 y J05 permanecen como calibración externalizada.
- G3B-F07 continúa diferible.
- DR-018 conserva su alcance; este ADR no elige IDs concretos.

## Gates y tests requeridos

Antes de implementar:

1. Definitions inmutables y states separados;
2. replay conserva `dataVersion` y no consulta datos posteriores;
3. no existe overall causal ni doble conteo de componentes;
4. manager/táctica solo afectan cursores futuros;
5. competencia posicional agregada, sin plantilla;
6. conservación de oportunidad/minutos/splits;
7. contribución excluida del support field;
8. outcomes correlacionados por factores compartidos;
9. IJL fijo frente a fuerza dinámica;
10. ausencia de protección por identidad;
11. movilidad sin auto-transferencia;
12. identidad real para todo campeón/participante nombrado;
13. facts, streams, parámetros y precisión versionados;
14. golden/property tests y Monte Carlo aprobados;
15. DR-021/022/025/063/065 cerradas para el slice aplicable.

## Referencias

- [ADR-015: Taxonomía de versiones](./015-version-taxonomy.md)
- [ADR-018: Vertical slice](./018-initial-vertical-slice.md)
- [ADR-042: Causalidad de temporada](./042-season-health-performance.md)
- [ADR-054: Rol y minutos](./054-role-and-minutes-model.md)
- [ADR-055: Performance y producción](./055-performance-and-production-model.md)
- [ADR-057: Salud, lesiones y recuperación](./057-health-injury-recovery-model.md)
- [Registro DR-022](../DECISIONS_REQUIRED.md#dr-022--modelo-agregado-de-competiciones-y-mundo)
- [DR-065](../DECISIONS_REQUIRED.md#dr-065--scope-competitivo-pools-externos-y-continuidad-fuera-del-tier)
