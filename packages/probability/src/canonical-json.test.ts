import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { CanonicalizationError, canonicalizeJson } from "./canonical-json.js";
import { PROBABILITY_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";
import { hashCanonicalJson, sha256Utf8 } from "./hash.js";

describe("RFC 8785 compatible canonicalization", () => {
  it.each(PROBABILITY_GOLDEN_VECTORS_V1.canonicalJson)(
    "matches canonical JSON and SHA-256 fixture",
    ({ input, canonical, sha256 }) => {
      expect(canonicalizeJson(input)).toBe(canonical);
      expect(hashCanonicalJson(input)).toBe(sha256);
    },
  );

  it("uses recursive UTF-16 code-unit key ordering and preserves array order", () => {
    const value = {
      "\u20ac": "Euro Sign",
      "\r": "Carriage Return",
      "\ufb33": "Hebrew Letter Dalet With Dagesh",
      "1": "One",
      "\ud83d\ude00": "Emoji: Grinning Face",
      "\u0080": "Control",
      "\u00f6": "Latin Small Letter O With Diaeresis",
    };

    expect(canonicalizeJson(value)).toBe(
      '{"\\r":"Carriage Return","1":"One","\u0080":"Control","\u00f6":"Latin Small Letter O With Diaeresis","\u20ac":"Euro Sign","\ud83d\ude00":"Emoji: Grinning Face","\ufb33":"Hebrew Letter Dalet With Dagesh"}',
    );
  });

  it.each([undefined, Number.NaN, Number.POSITIVE_INFINITY, 1n, new Date(0), Symbol("not-json")])(
    "rejects non-canonical value %s",
    (value) => {
      expect(() => canonicalizeJson(value)).toThrow(CanonicalizationError);
    },
  );

  it("rejects sparse arrays, custom properties, cycles, and lone surrogates", () => {
    const sparse: unknown[] = [];
    sparse.length = 1;
    const custom: unknown[] = [1];
    Object.assign(custom, { extra: true });
    const cyclic: { self?: unknown } = {};
    cyclic.self = cyclic;
    const accessor = [1];
    Object.defineProperty(accessor, "0", {
      enumerable: true,
      get: () => 1,
    });

    expect(() => canonicalizeJson(sparse)).toThrow(CanonicalizationError);
    expect(() => canonicalizeJson(custom)).toThrow(CanonicalizationError);
    expect(() => canonicalizeJson(cyclic)).toThrow(CanonicalizationError);
    expect(() => canonicalizeJson(accessor)).toThrow(CanonicalizationError);
    expect(() => canonicalizeJson("\ud800")).toThrow(CanonicalizationError);
  });

  it("is stable for JSON values and their parsed copies", () => {
    fc.assert(
      fc.property(fc.jsonValue(), (value) => {
        const parsed: unknown = JSON.parse(JSON.stringify(value));

        expect(canonicalizeJson(parsed)).toBe(canonicalizeJson(value));
      }),
    );
  });
});

describe("SHA-256 fixtures", () => {
  it.each(PROBABILITY_GOLDEN_VECTORS_V1.sha256Utf8)(
    "hashes UTF-8 input exactly",
    ({ input, digest }) => {
      expect(sha256Utf8(input)).toBe(digest);
    },
  );
});
