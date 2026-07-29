import { CAREER_STATUSES, type CareerStatus } from "@career-simulator/schemas";
import { describe, expect, it } from "vitest";

import {
  InvalidCareerTransitionError,
  canTransitionCareer,
  getAllowedCareerTransitions,
  transitionCareerStatus,
} from "./career-lifecycle.js";
import { DOMAIN_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";

const EXPECTED_TRANSITIONS = DOMAIN_GOLDEN_VECTORS_V1.allowedCareerTransitions satisfies Readonly<
  Record<CareerStatus, readonly CareerStatus[]>
>;

describe("career lifecycle", () => {
  it.each(CAREER_STATUSES.flatMap((from) => CAREER_STATUSES.map((to) => [from, to] as const)))(
    "implements the complete ADR-016 matrix for %s -> %s",
    (from, to) => {
      const expected = (EXPECTED_TRANSITIONS[from] as readonly CareerStatus[]).includes(to);

      expect(canTransitionCareer(from, to)).toBe(expected);
      if (expected) {
        expect(transitionCareerStatus(from, to)).toBe(to);
      } else {
        expect(() => transitionCareerStatus(from, to)).toThrow(InvalidCareerTransitionError);
      }
    },
  );

  it.each(CAREER_STATUSES)("exposes an immutable view of allowed targets from %s", (from) => {
    expect(getAllowedCareerTransitions(from)).toEqual(EXPECTED_TRANSITIONS[from]);
  });
});
