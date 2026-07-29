import { describe, expect, it } from "vitest";

import { PROBABILITY_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";
import { createLogOdds, createProbability } from "./probability.js";
import { InvalidRandomStreamValueError, sampleLogOdds, sampleProbability } from "./sampling.js";
import { createXoshiro256StarStar } from "./xoshiro256-star-star.js";
import type { RandomStream } from "./xoshiro256-star-star.js";

class CountingStream implements RandomStream {
  public draws = 0;

  public nextUint64(): bigint {
    this.draws += 1;
    return 0n;
  }

  public nextFloat01(): number {
    this.draws += 1;
    return 0.25;
  }
}

describe("deterministic sampling", () => {
  it("does not consume a draw for explicit impossibility or certainty", () => {
    const stream = new CountingStream();

    expect(sampleProbability(stream, createProbability(0))).toBe(false);
    expect(sampleProbability(stream, createProbability(1))).toBe(true);
    expect(sampleLogOdds(stream, createLogOdds(Number.NEGATIVE_INFINITY))).toBe(false);
    expect(sampleLogOdds(stream, createLogOdds(Number.POSITIVE_INFINITY))).toBe(true);
    expect(stream.draws).toBe(0);
  });

  it("consumes exactly one defined uniform for a probabilistic result", () => {
    const stream = new CountingStream();

    expect(sampleProbability(stream, createProbability(0.5))).toBe(true);
    expect(sampleLogOdds(stream, createLogOdds(0))).toBe(true);
    expect(stream.draws).toBe(2);
  });

  it("rejects values outside the RandomStream uniform contract", () => {
    const invalidStream: RandomStream = {
      nextUint64: () => 0n,
      nextFloat01: () => 1,
    };

    expect(() => sampleProbability(invalidStream, createProbability(0.5))).toThrow(
      InvalidRandomStreamValueError,
    );
  });

  it("passes a deterministic statistical sanity check", () => {
    const stream = createXoshiro256StarStar(PROBABILITY_GOLDEN_VECTORS_V1.rootSeed);
    const probability = createProbability(0.5);
    const samples = 20_000;
    let successes = 0;

    for (let index = 0; index < samples; index += 1) {
      if (sampleProbability(stream, probability)) {
        successes += 1;
      }
    }

    expect(successes / samples).toBeGreaterThan(0.48);
    expect(successes / samples).toBeLessThan(0.52);
  });
});
