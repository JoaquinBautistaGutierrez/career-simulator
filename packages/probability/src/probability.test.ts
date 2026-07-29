import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { PROBABILITY_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";
import {
  InvalidProbabilityValueError,
  ProbabilityPrecisionError,
  classifyProbability,
  composeLogOdds,
  composeProbability,
  createLogOdds,
  createLogProbability,
  createOdds,
  createProbability,
  createProbabilityModifier,
  logOddsToOdds,
  logOddsToProbability,
  logProbabilityToProbability,
  oddsToProbability,
  probabilityToLogOdds,
  probabilityToLogProbability,
  probabilityToOdds,
} from "./probability.js";

const decodeExtendedNumber = (value: number | string): number => {
  if (typeof value === "number") {
    return value;
  }
  if (value === "Infinity") {
    return Number.POSITIVE_INFINITY;
  }
  if (value === "-Infinity") {
    return Number.NEGATIVE_INFINITY;
  }
  throw new Error(`Unknown extended number fixture: ${value}`);
};

describe("probability primitives", () => {
  it.each(PROBABILITY_GOLDEN_VECTORS_V1.probabilityConversions)(
    "matches conversion vectors for p=$probability",
    ({ probability, logProbability, odds, logOdds }) => {
      const value = createProbability(probability);

      expect(probabilityToLogProbability(value)).toBe(decodeExtendedNumber(logProbability));
      expect(probabilityToOdds(value)).toBe(decodeExtendedNumber(odds));
      expect(probabilityToLogOdds(value)).toBe(decodeExtendedNumber(logOdds));
    },
  );

  it("classifies exact boundaries independently from probabilistic values", () => {
    expect(classifyProbability(createProbability(0))).toBe("IMPOSSIBLE");
    expect(classifyProbability(createProbability(Number.MIN_VALUE))).toBe("PROBABILISTIC");
    expect(classifyProbability(createProbability(1))).toBe("CERTAIN");
  });

  it.each([Number.NaN, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, -1, 1.1])(
    "rejects invalid Probability %s",
    (value) => {
      expect(() => createProbability(value)).toThrow(InvalidProbabilityValueError);
    },
  );

  it("validates every other numeric wrapper at its boundary", () => {
    expect(() => createLogProbability(0.1)).toThrow(InvalidProbabilityValueError);
    expect(() => createOdds(-1)).toThrow(InvalidProbabilityValueError);
    expect(() => createLogOdds(Number.NaN)).toThrow(InvalidProbabilityValueError);
    expect(() => createProbabilityModifier(0)).toThrow(InvalidProbabilityValueError);
    expect(() => createProbabilityModifier(Number.POSITIVE_INFINITY)).toThrow(
      InvalidProbabilityValueError,
    );
  });

  it("round-trips exact endpoints intentionally", () => {
    expect(logProbabilityToProbability(createLogProbability(Number.NEGATIVE_INFINITY))).toBe(0);
    expect(oddsToProbability(createOdds(Number.POSITIVE_INFINITY))).toBe(1);
    expect(logOddsToProbability(createLogOdds(Number.NEGATIVE_INFINITY))).toBe(0);
    expect(logOddsToProbability(createLogOdds(Number.POSITIVE_INFINITY))).toBe(1);
  });

  it("does not silently turn finite log-space values into endpoints", () => {
    expect(() => logProbabilityToProbability(createLogProbability(-1000))).toThrow(
      ProbabilityPrecisionError,
    );
    expect(() => logOddsToProbability(createLogOdds(1000))).toThrow(ProbabilityPrecisionError);
    expect(() => logOddsToOdds(createLogOdds(1000))).toThrow(ProbabilityPrecisionError);
  });

  it("composes positive modifiers by addition in log-odds", () => {
    const base = createProbability(0.5);
    const modifiers = [
      createProbabilityModifier(2),
      createProbabilityModifier(0.5),
      createProbabilityModifier(4),
    ];

    expect(composeLogOdds(base, modifiers)).toBeCloseTo(Math.log(4), 15);
    expect(composeProbability(base, modifiers)).toBeCloseTo(0.8, 15);
  });

  it("preserves explicit impossibility and certainty during composition", () => {
    const modifiers = [createProbabilityModifier(2)];

    expect(composeProbability(createProbability(0), modifiers)).toBe(0);
    expect(composeProbability(createProbability(1), modifiers)).toBe(1);
  });
});

describe("probability properties", () => {
  const interiorProbability = fc.double({
    min: Number.MIN_VALUE,
    max: 1 - Number.EPSILON,
    noNaN: true,
    noDefaultInfinity: true,
  });

  it("keeps constructed probabilities in the closed unit interval", () => {
    fc.assert(
      fc.property(
        fc.double({
          min: 0,
          max: 1,
          noNaN: true,
          noDefaultInfinity: true,
        }),
        (value) => {
          const probability = createProbability(value);
          expect(probability).toBeGreaterThanOrEqual(0);
          expect(probability).toBeLessThanOrEqual(1);
        },
      ),
    );
  });

  it("round-trips p through odds within IEEE-754 tolerance", () => {
    fc.assert(
      fc.property(interiorProbability, (value) => {
        const probability = createProbability(value);
        const roundTrip = oddsToProbability(probabilityToOdds(probability));
        const tolerance = Math.max(Number.MIN_VALUE, Number.EPSILON * Math.max(value, 1 - value));

        expect(Math.abs(roundTrip - value)).toBeLessThanOrEqual(tolerance);
      }),
    );
  });

  it("round-trips representable p through log-probability", () => {
    fc.assert(
      fc.property(interiorProbability, (value) => {
        const probability = createProbability(value);
        const roundTrip = logProbabilityToProbability(probabilityToLogProbability(probability));

        expect(roundTrip).toBeCloseTo(value, 14);
      }),
    );
  });
});
