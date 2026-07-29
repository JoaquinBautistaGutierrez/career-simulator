/**
 * Versioned deterministic contract fixtures.
 *
 * Changing any value requires an explicit compatibility justification and an
 * engineVersion change when it affects replay outputs.
 */
export const PROBABILITY_GOLDEN_VECTORS_V1 = {
  contractVersion: 1,
  rootSeed: "0000000000000001000000000000000200000000000000030000000000000004",
  xoshiro256StarStarUint64: [
    "0000000000002d00",
    "0000000000000000",
    "000000005a007080",
    "10e0000000009d80",
    "10e0b61ce1009d80",
    "0870021ce143ad00",
    "e071c3c2e143f089",
    "75a1690ef7a20380",
    "9309685b465c23f9",
    "284f3cc2e13e3c88",
  ],
  uniformDouble01: [
    5.551115123125783e-16, 0, 8.185607747179802e-11, 0.06591796875000211, 0.06592882351924556,
    0.032959110308424244, 0.8767359114438162, 0.45949417701161366, 0.5743622992361996,
    0.15745906598862625,
  ],
  derivedStreams: [
    {
      namespace: "development",
      context: { careerId: "career-1", season: 1 },
      stateSeed: "f5c097301f37d534b0d7df96b87538c3873df399b8f52d295a1171a9aa851d99",
      uint64: ["f926bf364d7d258a", "c1750c49a673868d", "33392cbea3a335fa", "138473e3079938a2"],
    },
    {
      namespace: "health",
      context: { careerId: "career-1", season: 1 },
      stateSeed: "e63ce154fccffabdcac7ba3a48b5213bc79b82b9692f2510f9761ed65ff211d1",
      uint64: ["8dde1f63eb6bb3ca", "032578f40ee031ac", "fcbf77cd2c30fe6c", "99cb638208e4cbc0"],
    },
  ],
  probabilityConversions: [
    {
      probability: 0,
      logProbability: "-Infinity",
      odds: 0,
      logOdds: "-Infinity",
    },
    {
      probability: 5e-324,
      logProbability: -744.4400719213812,
      odds: 5e-324,
      logOdds: -744.4400719213812,
    },
    {
      probability: 1e-300,
      logProbability: -690.7755278982137,
      odds: 1e-300,
      logOdds: -690.7755278982137,
    },
    {
      probability: 0.5,
      logProbability: -0.6931471805599453,
      odds: 1,
      logOdds: 0,
    },
    {
      probability: 0.9999999999999999,
      logProbability: -1.1102230246251565e-16,
      odds: 9007199254740991,
      logOdds: 36.7368005696771,
    },
    {
      probability: 1,
      logProbability: 0,
      odds: "Infinity",
      logOdds: "Infinity",
    },
  ],
  canonicalJson: [
    {
      input: { b: 2, a: 1 },
      canonical: '{"a":1,"b":2}',
      sha256: "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777",
    },
    {
      input: { negativeZero: -0, nested: [{ z: false, a: null }] },
      canonical: '{"negativeZero":0,"nested":[{"a":null,"z":false}]}',
      sha256: "d78e270f7ffdbd54751486f4ee67791f45315acbab847bc921440edb81721abd",
    },
  ],
  sha256Utf8: [
    {
      input: "",
      digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    {
      input: "abc",
      digest: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    },
  ],
} as const;
