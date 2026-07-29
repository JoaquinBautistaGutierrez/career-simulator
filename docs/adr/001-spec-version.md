# ADR-001: Versión normativa de la especificación

- Estado: Aceptado
- Fecha: 2026-07-27
- Decisión relacionada: DR-001
- Alcance: documentación, trazabilidad y versionado

## Contexto

`MASTER_SPEC.docx` contiene indicadores históricos no uniformes: la portada, la tabla de control y el encabezado señalan v0.8, mientras que algunas propiedades OOXML y anexos conservan referencias a versiones anteriores.

La implementación necesita una identidad normativa única para enlazar ADRs, contratos, fixtures, releases y cambios posteriores.

## Decisión

La especificación normativa efectiva es:

> `MASTER_SPEC v0.8 — 27/07/2026`

Toda referencia técnica nueva debe utilizar esa identidad. Las propiedades internas o rótulos históricos que mencionen v0.6 o v0.7 se consideran metadatos residuales y no cambian la precedencia normativa de v0.8.

El archivo `MASTER_SPEC.docx` no se modifica como parte de este ADR.

## Consecuencias

- Los ADRs, schemas, fixtures y documentación derivada pueden citar una versión inequívoca.
- Un cambio normativo posterior debe publicar una nueva versión identificable, no reinterpretar silenciosamente v0.8.
- Los hashes del archivo y la identidad normativa son conceptos distintos: una corrección editorial futura del DOCX debe registrar si cambia o no la versión normativa.
- Las referencias históricas permanecen útiles como historial, pero no gobiernan la implementación.

## Alternativas rechazadas

### Tratar las propiedades OOXML como autoridad

Rechazada porque contradice la portada, el control del documento, su fecha y las secciones normativas más recientes.

### Considerar v0.7 como versión efectiva

Rechazada porque omite la especificación de construcción incorporada en v0.8.

### Mantener una versión ambigua hasta editar el DOCX

Rechazada porque bloquearía trazabilidad sin aportar una ventaja técnica.

## Validación requerida

- Toda documentación nueva referencia `MASTER_SPEC v0.8 — 27/07/2026`.
- CI documental, cuando exista, detecta referencias normativas nuevas a v0.6 o v0.7 fuera de contexto histórico.
- El registro de decisiones enlaza este ADR y marca DR-001 como resuelta.
- Una revisión futura del DOCX conserva un historial explícito de versión.

## Referencias

- [Registro de decisiones](../DECISIONS_REQUIRED.md#dr-001--versión-efectiva-y-limpieza-de-la-fuente)

