import { classifyProbability, type LogOdds, type Probability } from "./probability.js";
import type { RandomStream } from "./xoshiro256-star-star.js";

export class InvalidRandomStreamValueError extends RangeError {
  public constructor(value: number) {
    super(
      `RandomStream.nextFloat01() must return a finite value in [0, 1), received ${String(value)}`,
    );
    this.name = "InvalidRandomStreamValueError";
  }
}

const nextValidatedUniform = (randomStream: RandomStream): number => {
  const uniform = randomStream.nextFloat01();
  if (!Number.isFinite(uniform) || uniform < 0 || uniform >= 1) {
    throw new InvalidRandomStreamValueError(uniform);
  }
  return uniform;
};

export const sampleProbability = (
  randomStream: RandomStream,
  probability: Probability,
): boolean => {
  const classification = classifyProbability(probability);
  if (classification === "IMPOSSIBLE") {
    return false;
  }
  if (classification === "CERTAIN") {
    return true;
  }
  return nextValidatedUniform(randomStream) < probability;
};

export const sampleLogOdds = (randomStream: RandomStream, logOdds: LogOdds): boolean => {
  if (logOdds === Number.NEGATIVE_INFINITY) {
    return false;
  }
  if (logOdds === Number.POSITIVE_INFINITY) {
    return true;
  }

  const uniform = nextValidatedUniform(randomStream);
  if (uniform === 0) {
    return true;
  }

  const uniformLogOdds = Math.log(uniform) - Math.log1p(-uniform);
  return uniformLogOdds < logOdds;
};
