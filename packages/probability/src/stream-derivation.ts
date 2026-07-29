import { concatBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import type { RootSeed } from "@career-simulator/schemas";

import { canonicalizeJson, canonicalJsonToBytes } from "./canonical-json.js";
import { sha256DigestBytes } from "./hash.js";
import { rootSeedToBytes } from "./root-seed.js";
import { Xoshiro256StarStar, xoshiroStateFromBytes } from "./xoshiro256-star-star.js";

const STREAM_DERIVATION_DOMAIN = utf8ToBytes(
  "career-simulator/xoshiro256-star-star/stream/v1\u0000",
);

export interface RandomStreamContext {
  readonly namespace: string;
  readonly context: unknown;
}

export class InvalidRandomStreamContextError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidRandomStreamContextError";
  }
}

const validateNamespace = (namespace: string): void => {
  if (namespace.length === 0 || namespace !== namespace.trim()) {
    throw new InvalidRandomStreamContextError(
      "Random stream namespace must be non-empty and have no surrounding whitespace",
    );
  }

  if (namespace.includes("\u0000")) {
    throw new InvalidRandomStreamContextError(
      "Random stream namespace must not contain a NUL code point",
    );
  }
};

export const deriveRandomStreamSeedBytes = (
  rootSeed: RootSeed,
  streamContext: RandomStreamContext,
): Uint8Array => {
  validateNamespace(streamContext.namespace);
  const canonicalContext = canonicalizeJson({
    context: streamContext.context,
    namespace: streamContext.namespace,
  });
  const derivedBytes = sha256DigestBytes(
    concatBytes(
      STREAM_DERIVATION_DOMAIN,
      rootSeedToBytes(rootSeed),
      canonicalJsonToBytes(canonicalContext),
    ),
  );

  if (derivedBytes.every((byte) => byte === 0)) {
    throw new InvalidRandomStreamContextError(
      "Stream derivation produced the forbidden all-zero xoshiro256** state",
    );
  }

  return derivedBytes;
};

export const deriveRandomStream = (
  rootSeed: RootSeed,
  streamContext: RandomStreamContext,
): Xoshiro256StarStar =>
  new Xoshiro256StarStar(
    xoshiroStateFromBytes(deriveRandomStreamSeedBytes(rootSeed, streamContext)),
  );
