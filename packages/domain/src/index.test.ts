import { POSITIONS, type Position, type PositionGroup } from "@career-simulator/schemas";
import { describe, expect, it } from "vitest";

import { getPositionGroup } from "./index.js";

const EXPECTED_GROUPS = {
  GK: "GK",
  RB: "DEF",
  CB: "DEF",
  LB: "DEF",
  RWB: "DEF",
  LWB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  RM: "MID",
  LM: "MID",
  RW: "FWD",
  LW: "FWD",
  ST: "FWD",
  CF: "FWD",
} as const satisfies Readonly<Record<Position, PositionGroup>>;

describe("getPositionGroup", () => {
  it.each(POSITIONS)("maps %s to its canonical group", (position) => {
    expect(getPositionGroup(position)).toBe(EXPECTED_GROUPS[position]);
  });

  it("covers every canonical position exactly once", () => {
    expect(Object.keys(EXPECTED_GROUPS)).toEqual([...POSITIONS]);
  });
});
