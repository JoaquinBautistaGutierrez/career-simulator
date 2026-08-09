# ADR-082: Nacionalidad deportiva del vertical slice V1

- Estado: Aceptado
- Fecha: 2026-08-07
- Decisión relacionada: DR-068
- Refina: ADR-059 y ADR-077

## Contexto

El slice fija Argentina como país inicial y una selección argentina detallada,
pero no había decidido eligibility del protagonista. Inferir una segunda
nacionalidad por club, residencia o narrativa está prohibido.

## Decisión

Quick y Custom V1 crean biografía argentina y una única sporting eligibility:
Argentina. V1 no genera segunda nacionalidad, ascendencia, naturalización ni
transition de asociación. Jugar o residir en España no cambia eligibility.

El resolver sigue consumiendo `NationalTeamEligibility`; la policy produce un
resultado trazable contra una rule/data reference. Una futura ampliación
multi-eligibility debe añadir biografía explícita, rules, user choice, facts,
replay y una nueva versión; no puede reinterpretar Careers V1.

Youth/olympic contexts no crean otra eligibility ni lock-in implícito. La
selección senior argentina solo puede convocar después del mismo boundary
lógico de ADR-077.

## Consecuencias

- DR-068 queda resuelta para scope V1; Definition/rule provenance sigue
  `DATA_REQUIRED`.
- El slice no prueba change-of-association ni naturalization.
- No se amplía el catálogo de selecciones detalladas.
- Cambiar esta policy requiere revisar schema/data/engine según el cambio y
  publicar nuevos goldens.

## Alternativas rechazadas

- segunda eligibility por jugar en España;
- dual nationality aleatoria sin antecedente;
- implementar normativa internacional completa en el slice;
- dejar eligibility ausente y tratarla como inelegible.

## Referencias

- [Vertical Slice Data Catalog](../VERTICAL_SLICE_DATA_CATALOG_SPEC.md)
- [National Team/Awards Spec](../NATIONAL_TEAM_AWARDS_SPEC.md)
- [DR-068](../DECISIONS_REQUIRED.md#dr-068--nacionalidad-deportiva-y-elegibilidad-internacional-del-vertical-slice)

