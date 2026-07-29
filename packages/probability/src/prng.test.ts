import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { PROBABILITY_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";
import { rootSeedFromBytes, rootSeedToBytes } from "./root-seed.js";
import { deriveRandomStream, deriveRandomStreamSeedBytes } from "./stream-derivation.js";
import {
  InvalidXoshiroStateError,
  createXoshiro256StarStar,
  createXoshiro256StarStarFromState,
} from "./xoshiro256-star-star.js";

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

describe("xoshiro256** golden vectors", () => {
  const vectors = PROBABILITY_GOLDEN_VECTORS_V1;

  it("matches the versioned uint64 reference sequence", () => {
    const stream = createXoshiro256StarStar(vectors.rootSeed);

    expect(
      vectors.xoshiro256StarStarUint64.map(() =>
        stream.nextUint64().toString(16).padStart(16, "0"),
      ),
    ).toEqual(vectors.xoshiro256StarStarUint64);
  });

  it("derives each uniform double from the upper 53 bits", () => {
    const stream = createXoshiro256StarStar(vectors.rootSeed);

    expect(vectors.uniformDouble01.map(() => stream.nextFloat01())).toEqual(
      vectors.uniformDouble01,
    );
  });

  it("rejects the forbidden all-zero state", () => {
    expect(() => createXoshiro256StarStarFromState([0n, 0n, 0n, 0n])).toThrow(
      InvalidXoshiroStateError,
    );
  });
});

describe("RootSeed byte contract", () => {
  it("round-trips the canonical big-endian byte representation", () => {
    const rootSeed = PROBABILITY_GOLDEN_VECTORS_V1.rootSeed;

    expect(rootSeedFromBytes(rootSeedToBytes(rootSeed))).toBe(rootSeed);
  });

  it("rejects byte arrays that cannot represent a valid RootSeed", () => {
    expect(() => rootSeedFromBytes(new Uint8Array(31))).toThrow(RangeError);
    expect(() => rootSeedFromBytes(new Uint8Array(32))).toThrow();
  });
});

describe("deterministic stream derivation", () => {
  const vectors = PROBABILITY_GOLDEN_VECTORS_V1;

  it.each(vectors.derivedStreams)(
    "matches the $namespace golden vector",
    ({ namespace, context, stateSeed, uint64 }) => {
      const streamContext = { namespace, context };

      expect(bytesToHex(deriveRandomStreamSeedBytes(vectors.rootSeed, streamContext))).toBe(
        stateSeed,
      );

      const stream = deriveRandomStream(vectors.rootSeed, streamContext);
      expect(uint64.map(() => stream.nextUint64().toString(16).padStart(16, "0"))).toEqual(uint64);
    },
  );

  it("canonicalizes context objects before derivation", () => {
    const first = deriveRandomStream(vectors.rootSeed, {
      namespace: "development",
      context: { careerId: "career-1", season: 1 },
    });
    const reordered = deriveRandomStream(vectors.rootSeed, {
      namespace: "development",
      context: { season: 1, careerId: "career-1" },
    });

    expect(first.nextUint64()).toBe(reordered.nextUint64());
  });

  it("separates namespaces and isolates their mutable state", () => {
    const development = deriveRandomStream(vectors.rootSeed, {
      namespace: "development",
      context: { careerId: "career-1", season: 1 },
    });
    const untouchedHealth = deriveRandomStream(vectors.rootSeed, {
      namespace: "health",
      context: { careerId: "career-1", season: 1 },
    });
    const comparisonHealth = deriveRandomStream(vectors.rootSeed, {
      namespace: "health",
      context: { careerId: "career-1", season: 1 },
    });

    const developmentFirst = development.nextUint64();
    development.nextUint64();
    development.nextUint64();
    const expectedHealthFirst = comparisonHealth.nextUint64();
    const expectedHealthSecond = comparisonHealth.nextUint64();

    expect(developmentFirst).not.toBe(expectedHealthFirst);
    expect(untouchedHealth.nextUint64()).toBe(expectedHealthFirst);
    expect(untouchedHealth.nextUint64()).toBe(expectedHealthSecond);
  });

  it("repeats arbitrary canonical contexts exactly", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-z][a-z0-9]{0,15}$/u),
        fc.jsonValue(),
        (namespace, context) => {
          const first = deriveRandomStream(vectors.rootSeed, {
            namespace,
            context,
          });
          const second = deriveRandomStream(vectors.rootSeed, {
            namespace,
            context,
          });

          expect(Array.from({ length: 4 }, () => first.nextUint64())).toEqual(
            Array.from({ length: 4 }, () => second.nextUint64()),
          );
        },
      ),
    );
  });
});
