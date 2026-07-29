import type { RootSeed } from "@career-simulator/schemas";

import { rootSeedToBytes } from "./root-seed.js";

const UINT64_BITS = 64n;
const UINT64_MASK = (1n << UINT64_BITS) - 1n;
const DOUBLE_MANTISSA_BITS = 53n;
const DOUBLE_UNIT_DENOMINATOR = 2 ** 53;

export type Xoshiro256State = readonly [bigint, bigint, bigint, bigint];

export interface RandomStream {
  nextUint64(): bigint;
  nextFloat01(): number;
}

export class InvalidXoshiroStateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidXoshiroStateError";
  }
}

const rotateLeft64 = (value: bigint, shift: bigint): bigint =>
  ((value << shift) | (value >> (UINT64_BITS - shift))) & UINT64_MASK;

const assertState = (state: Xoshiro256State): void => {
  for (const word of state) {
    if (word < 0n || word > UINT64_MASK) {
      throw new InvalidXoshiroStateError(
        "Each xoshiro256** state word must be an unsigned 64-bit integer",
      );
    }
  }

  if (state.every((word) => word === 0n)) {
    throw new InvalidXoshiroStateError("xoshiro256** state must not be all zero");
  }
};

const bytesToState = (bytes: Uint8Array): Xoshiro256State => {
  if (bytes.length !== 32) {
    throw new InvalidXoshiroStateError("xoshiro256** state must contain 32 bytes");
  }

  const words: bigint[] = [];
  for (let wordIndex = 0; wordIndex < 4; wordIndex += 1) {
    let word = 0n;
    for (let byteIndex = 0; byteIndex < 8; byteIndex += 1) {
      const byte = bytes[wordIndex * 8 + byteIndex];
      if (byte === undefined) {
        throw new InvalidXoshiroStateError("Incomplete xoshiro256** state");
      }
      word = (word << 8n) | BigInt(byte);
    }
    words.push(word);
  }

  const state = [words[0], words[1], words[2], words[3]] as const;
  if (state.some((word) => word === undefined)) {
    throw new InvalidXoshiroStateError("Incomplete xoshiro256** state");
  }
  return state as Xoshiro256State;
};

export class Xoshiro256StarStar implements RandomStream {
  readonly #state: [bigint, bigint, bigint, bigint];

  public constructor(initialState: Xoshiro256State) {
    assertState(initialState);
    this.#state = [...initialState];
  }

  public nextUint64(): bigint {
    const [state0, state1, state2, state3] = this.#state;
    const result = (rotateLeft64((state1 * 5n) & UINT64_MASK, 7n) * 9n) & UINT64_MASK;
    const shifted = (state1 << 17n) & UINT64_MASK;

    let nextState2 = state2 ^ state0;
    let nextState3 = state3 ^ state1;
    const nextState1 = state1 ^ nextState2;
    const nextState0 = state0 ^ nextState3;
    nextState2 ^= shifted;
    nextState3 = rotateLeft64(nextState3, 45n);

    this.#state[0] = nextState0 & UINT64_MASK;
    this.#state[1] = nextState1 & UINT64_MASK;
    this.#state[2] = nextState2 & UINT64_MASK;
    this.#state[3] = nextState3 & UINT64_MASK;

    return result;
  }

  public nextFloat01(): number {
    const upper53Bits = this.nextUint64() >> (UINT64_BITS - DOUBLE_MANTISSA_BITS);
    return Number(upper53Bits) / DOUBLE_UNIT_DENOMINATOR;
  }

  public exportState(): Xoshiro256State {
    return [...this.#state];
  }
}

export const createXoshiro256StarStar = (rootSeed: RootSeed): Xoshiro256StarStar =>
  new Xoshiro256StarStar(bytesToState(rootSeedToBytes(rootSeed)));

export const createXoshiro256StarStarFromState = (state: Xoshiro256State): Xoshiro256StarStar =>
  new Xoshiro256StarStar(state);

export const xoshiroStateFromBytes = (bytes: Uint8Array): Xoshiro256State => bytesToState(bytes);
