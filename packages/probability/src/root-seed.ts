import { RootSeedSchema, type RootSeed } from "@career-simulator/schemas";

const ROOT_SEED_BYTE_LENGTH = 32;

export const parseRootSeed = (value: unknown): RootSeed => RootSeedSchema.parse(value);

export const rootSeedToBytes = (rootSeed: RootSeed): Uint8Array => {
  const validated = RootSeedSchema.parse(rootSeed);
  const bytes = new Uint8Array(ROOT_SEED_BYTE_LENGTH);

  for (let index = 0; index < ROOT_SEED_BYTE_LENGTH; index += 1) {
    const byteOffset = index * 2;
    bytes[index] = Number.parseInt(validated.slice(byteOffset, byteOffset + 2), 16);
  }

  return bytes;
};

export const rootSeedFromBytes = (bytes: Uint8Array): RootSeed => {
  if (bytes.length !== ROOT_SEED_BYTE_LENGTH) {
    throw new RangeError("RootSeed bytes must contain exactly 32 bytes");
  }

  const hexadecimal = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return RootSeedSchema.parse(hexadecimal);
};
