import { sha256 } from "@noble/hashes/sha2.js";
import { bytesToHex, utf8ToBytes } from "@noble/hashes/utils.js";

import { canonicalizeJson, canonicalJsonToBytes, type CanonicalJson } from "./canonical-json.js";

declare const sha256DigestBrand: unique symbol;

export type Sha256Digest<Domain extends string = "raw"> = string & {
  readonly [sha256DigestBrand]: Domain;
};

export const sha256DigestBytes = (value: Uint8Array): Uint8Array => sha256(value);

export const sha256Bytes = <Domain extends string = "raw">(
  value: Uint8Array,
): Sha256Digest<Domain> => bytesToHex(sha256DigestBytes(value)) as Sha256Digest<Domain>;

export const sha256Utf8 = <Domain extends string = "utf8">(value: string): Sha256Digest<Domain> =>
  sha256Bytes<Domain>(utf8ToBytes(value));

export const hashCanonicalJson = <Domain extends string = "canonical-json">(
  value: unknown,
): Sha256Digest<Domain> => {
  const canonical = canonicalizeJson(value);
  return sha256Bytes<Domain>(canonicalJsonToBytes(canonical));
};

export const hashCanonicalJsonText = <Domain extends string = "canonical-json">(
  value: CanonicalJson,
): Sha256Digest<Domain> => sha256Bytes<Domain>(canonicalJsonToBytes(value));
