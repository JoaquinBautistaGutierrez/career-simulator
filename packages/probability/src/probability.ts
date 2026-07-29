declare const probabilityBrand: unique symbol;
declare const logProbabilityBrand: unique symbol;
declare const oddsBrand: unique symbol;
declare const logOddsBrand: unique symbol;
declare const probabilityModifierBrand: unique symbol;

export type Probability = number & { readonly [probabilityBrand]: "Probability" };
export type LogProbability = number & {
  readonly [logProbabilityBrand]: "LogProbability";
};
export type Odds = number & { readonly [oddsBrand]: "Odds" };
export type LogOdds = number & { readonly [logOddsBrand]: "LogOdds" };
export type ProbabilityModifier = number & {
  readonly [probabilityModifierBrand]: "ProbabilityModifier";
};

export type ProbabilityClassification = "IMPOSSIBLE" | "PROBABILISTIC" | "CERTAIN";

export class InvalidProbabilityValueError extends RangeError {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidProbabilityValueError";
  }
}

export class ProbabilityPrecisionError extends RangeError {
  public constructor(message: string) {
    super(message);
    this.name = "ProbabilityPrecisionError";
  }
}

const assertNotNaN = (value: number, name: string): void => {
  if (Number.isNaN(value)) {
    throw new InvalidProbabilityValueError(`${name} must not be NaN`);
  }
};

export const createProbability = (value: number): Probability => {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new InvalidProbabilityValueError(
      "Probability must be a finite IEEE-754 double in [0, 1]",
    );
  }
  return (value === 0 ? 0 : value) as Probability;
};

export const createLogProbability = (value: number): LogProbability => {
  assertNotNaN(value, "LogProbability");
  if (value > 0 || value === Number.POSITIVE_INFINITY) {
    throw new InvalidProbabilityValueError(
      "LogProbability must be -Infinity or an IEEE-754 double less than or equal to zero",
    );
  }
  return (value === 0 ? 0 : value) as LogProbability;
};

export const createOdds = (value: number): Odds => {
  assertNotNaN(value, "Odds");
  if (value < 0 || value === Number.NEGATIVE_INFINITY) {
    throw new InvalidProbabilityValueError(
      "Odds must be a non-negative IEEE-754 double or positive Infinity",
    );
  }
  return (value === 0 ? 0 : value) as Odds;
};

export const createLogOdds = (value: number): LogOdds => {
  assertNotNaN(value, "LogOdds");
  return (value === 0 ? 0 : value) as LogOdds;
};

export const createProbabilityModifier = (value: number): ProbabilityModifier => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new InvalidProbabilityValueError(
      "ProbabilityModifier must be a positive finite IEEE-754 double",
    );
  }
  return value as ProbabilityModifier;
};

export const classifyProbability = (probability: Probability): ProbabilityClassification => {
  if (probability === 0) {
    return "IMPOSSIBLE";
  }
  if (probability === 1) {
    return "CERTAIN";
  }
  return "PROBABILISTIC";
};

const assertInteriorProbability = (value: number, sourceName: string): Probability => {
  if (value === 0 || value === 1) {
    throw new ProbabilityPrecisionError(
      `${sourceName} is probabilistic but rounded to the exact boundary ${String(value)}; retain the log-space representation`,
    );
  }
  return createProbability(value);
};

export const probabilityToLogProbability = (probability: Probability): LogProbability => {
  if (probability === 0) {
    return createLogProbability(Number.NEGATIVE_INFINITY);
  }
  return createLogProbability(Math.log(probability));
};

export const logProbabilityToProbability = (logProbability: LogProbability): Probability => {
  if (logProbability === Number.NEGATIVE_INFINITY) {
    return createProbability(0);
  }
  if (logProbability === 0) {
    return createProbability(1);
  }
  return assertInteriorProbability(Math.exp(logProbability), "LogProbability");
};

export const probabilityToOdds = (probability: Probability): Odds => {
  if (probability === 1) {
    return createOdds(Number.POSITIVE_INFINITY);
  }
  return createOdds(probability / (1 - probability));
};

export const oddsToProbability = (odds: Odds): Probability => {
  if (odds === 0) {
    return createProbability(0);
  }
  if (odds === Number.POSITIVE_INFINITY) {
    return createProbability(1);
  }

  const result = odds <= 1 ? odds / (1 + odds) : 1 - 1 / (1 + odds);
  return assertInteriorProbability(result, "Odds");
};

export const probabilityToLogOdds = (probability: Probability): LogOdds => {
  if (probability === 0) {
    return createLogOdds(Number.NEGATIVE_INFINITY);
  }
  if (probability === 1) {
    return createLogOdds(Number.POSITIVE_INFINITY);
  }
  const numericProbability = probability as number;
  return createLogOdds(Math.log(numericProbability) - Math.log1p(-numericProbability));
};

export const logOddsToProbability = (logOdds: LogOdds): Probability => {
  if (logOdds === Number.NEGATIVE_INFINITY) {
    return createProbability(0);
  }
  if (logOdds === Number.POSITIVE_INFINITY) {
    return createProbability(1);
  }

  const numericLogOdds = logOdds as number;
  const result =
    numericLogOdds >= 0
      ? 1 / (1 + Math.exp(-numericLogOdds))
      : Math.exp(numericLogOdds) / (1 + Math.exp(numericLogOdds));
  return assertInteriorProbability(result, "LogOdds");
};

export const oddsToLogOdds = (odds: Odds): LogOdds => {
  if (odds === 0) {
    return createLogOdds(Number.NEGATIVE_INFINITY);
  }
  if (odds === Number.POSITIVE_INFINITY) {
    return createLogOdds(Number.POSITIVE_INFINITY);
  }
  return createLogOdds(Math.log(odds));
};

export const logOddsToOdds = (logOdds: LogOdds): Odds => {
  if (logOdds === Number.NEGATIVE_INFINITY) {
    return createOdds(0);
  }
  if (logOdds === Number.POSITIVE_INFINITY) {
    return createOdds(Number.POSITIVE_INFINITY);
  }

  const result = Math.exp(logOdds);
  if (result === 0 || result === Number.POSITIVE_INFINITY) {
    throw new ProbabilityPrecisionError(
      "Finite LogOdds overflowed an Odds boundary; retain the log-space representation",
    );
  }
  return createOdds(result);
};

export const composeLogOdds = (
  baseProbability: Probability,
  modifiers: readonly ProbabilityModifier[],
): LogOdds => {
  const baseLogOdds = probabilityToLogOdds(baseProbability);
  if (!Number.isFinite(baseLogOdds)) {
    return baseLogOdds;
  }

  let finalLogOdds = baseLogOdds as number;
  for (const modifier of modifiers) {
    finalLogOdds += Math.log(modifier);
    if (!Number.isFinite(finalLogOdds)) {
      throw new ProbabilityPrecisionError(
        "Finite log-odds composition overflowed; preserve or partition the log-space calculation",
      );
    }
  }
  return createLogOdds(finalLogOdds);
};

export const composeProbability = (
  baseProbability: Probability,
  modifiers: readonly ProbabilityModifier[],
): Probability => logOddsToProbability(composeLogOdds(baseProbability, modifiers));
