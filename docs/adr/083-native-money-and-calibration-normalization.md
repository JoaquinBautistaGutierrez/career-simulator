# ADR-083: Money nativo y normalización monetaria de calibración

- Estado: Aceptado
- Fecha: 2026-08-07
- Decisión relacionada: DR-027
- Refina: ADR-058 y ADR-076

## Contexto

MarketValue, fees y salary deben persistir como `Money` exacto. El slice
compara Argentina y España, con monedas, fechas, inflación y poder adquisitivo
no directamente intercambiables. Elegir una moneda global perdería el observable
nativo; comparar nominales sin transformación produciría una calibración falsa.

## Decisión

Se adopta una política dual:

1. todo observable y outcome monetario persiste en unidades menores enteras,
   `currencyCode` nativo y fecha/período monetario;
2. las comparaciones de calibración cross-market usan un
   `MonetaryNormalizationArtifact` derivado, versionado y hasheado;
3. ese artifact declara series, base date/context, fórmula, rounding,
   missing/revision policy, provenance, confidence e input/output hashes;
4. el valor normalizado es calibration evidence, no `Money`, no se persiste
   como outcome de gameplay y nunca muta el importe nativo;
5. ninguna suma, orden o conversión cross-currency es implícita;
6. una vista que convierta moneda requiere un conversion context versionado
   separado de la lógica causal.

Para el scope inicial los `currencyCode` esperados son ARS y EUR. Esta mención
no publica minor-unit metadata, rates, inflation series ni valores.

## Consecuencias

- DR-027 queda resuelta como policy y `DATA_REQUIRED` para series, fechas,
  transforms, rango técnico, presentation/disclaimer y goldens.
- Un cambio de series/transform publicado crea otro artifact/dataVersion/hash;
  no reescribe Careers o reports históricos.
- `financialPower` continúa siendo estado normalizado de club y no importe.
- No existe `maxTransferFee` ni protección editorial; overflow de la
  representación es error tipado.
- El ParameterSet y Scoring no incorporan rates mutables en caliente.

## Alternativas rechazadas

- moneda global única para storage;
- comparar nominales ARS/EUR sin fecha/transform;
- reemplazar Money por un índice abstracto;
- persistir floats monetarios;
- usar un rate actual mutable para reescribir historia.

## Gates

- currency/minor-unit catalog y rango interoperable;
- series/rates/inflation con licencia, revisión y hashes;
- transforms reproducibles e independently reviewed;
- fixtures de fecha, rounding, missing data y overflow;
- presentation/disclaimer policy.

## Referencias

- [Vertical Slice Data Catalog](../VERTICAL_SLICE_DATA_CATALOG_SPEC.md)
- [Transfer Market Contract Spec](../TRANSFER_MARKET_CONTRACT_SPEC.md)
- [DR-027](../DECISIONS_REQUIRED.md#dr-027--valor-de-mercado-y-monedas)

