export { CanonicalizationError, canonicalizeJson, canonicalJsonToBytes } from "./canonical-json.js";
export type {
  CanonicalJson,
  CanonicalJsonPrimitive,
  CanonicalJsonValue,
} from "./canonical-json.js";

export {
  hashCanonicalJson,
  hashCanonicalJsonText,
  sha256Bytes,
  sha256DigestBytes,
  sha256Utf8,
} from "./hash.js";
export type { Sha256Digest } from "./hash.js";

export { parseRootSeed, rootSeedFromBytes, rootSeedToBytes } from "./root-seed.js";

export {
  InvalidXoshiroStateError,
  Xoshiro256StarStar,
  createXoshiro256StarStar,
  createXoshiro256StarStarFromState,
  xoshiroStateFromBytes,
} from "./xoshiro256-star-star.js";
export type { RandomStream, Xoshiro256State } from "./xoshiro256-star-star.js";

export {
  InvalidRandomStreamContextError,
  deriveRandomStream,
  deriveRandomStreamSeedBytes,
} from "./stream-derivation.js";
export type { RandomStreamContext } from "./stream-derivation.js";

export {
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
  oddsToLogOdds,
  oddsToProbability,
  probabilityToLogOdds,
  probabilityToLogProbability,
  probabilityToOdds,
} from "./probability.js";
export type {
  LogOdds,
  LogProbability,
  Odds,
  Probability,
  ProbabilityClassification,
  ProbabilityModifier,
} from "./probability.js";

export { InvalidRandomStreamValueError, sampleLogOdds, sampleProbability } from "./sampling.js";

export type { RootSeed } from "@career-simulator/schemas";
