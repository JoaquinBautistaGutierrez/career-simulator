import { describe, expect, it } from "vitest";

import {
  CAREER_STATUSES,
  CareerStatusSchema,
  DOMINANT_FEET,
  DominantFootSchema,
  POSITIONS,
  POSITION_GROUPS,
  PositionGroupSchema,
  PositionSchema,
  RootSeedSchema,
  SimulationCursorSchema,
  VersionSetSchema,
} from "./index.js";

describe("PositionSchema", () => {
  it.each(POSITIONS)("accepts canonical position %s", (position) => {
    expect(PositionSchema.parse(position)).toBe(position);
  });

  it.each(["DEF", "GOALKEEPER", "st", "", null])("rejects unknown position %j", (value) => {
    const result = PositionSchema.safeParse(value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBeTruthy();
    }
  });
});

describe("PositionGroupSchema", () => {
  it.each(POSITION_GROUPS)("accepts canonical group %s", (group) => {
    expect(PositionGroupSchema.parse(group)).toBe(group);
  });

  it.each(["CB", "MIDFIELD", "", undefined])("rejects unknown group %j", (value) => {
    expect(PositionGroupSchema.safeParse(value).success).toBe(false);
  });
});

describe("DominantFootSchema", () => {
  it.each(DOMINANT_FEET)("accepts canonical value %s", (foot) => {
    expect(DominantFootSchema.parse(foot)).toBe(foot);
  });

  it.each(["AMBIDEXTROUS", "right", "", 2])("rejects unknown value %j", (value) => {
    expect(DominantFootSchema.safeParse(value).success).toBe(false);
  });
});

describe("CareerStatusSchema", () => {
  it.each(CAREER_STATUSES)("accepts canonical status %s", (status) => {
    expect(CareerStatusSchema.parse(status)).toBe(status);
  });

  it.each(["PAUSED", "FINISHED", "active", "", null])("rejects unknown status %j", (value) => {
    expect(CareerStatusSchema.safeParse(value).success).toBe(false);
  });
});

describe("VersionSetSchema", () => {
  const validVersionSet = {
    schemaVersion: "1.0.0",
    engineVersion: "1.2.3-alpha.1+build.5",
    contentVersion: "2026.07.27.1",
    dataVersion: "2026.07",
    scoringVersion: "2.0.0",
  } as const;

  it("accepts exactly the five canonical versions", () => {
    expect(VersionSetSchema.parse(validVersionSet)).toEqual(validVersionSet);
  });

  it.each(["schemaVersion", "engineVersion", "contentVersion", "dataVersion", "scoringVersion"])(
    "rejects a missing %s",
    (missingField) => {
      const incomplete = Object.fromEntries(
        Object.entries(validVersionSet).filter(([key]) => key !== missingField),
      );

      expect(VersionSetSchema.safeParse(incomplete).success).toBe(false);
    },
  );

  it.each(["schemaVersion", "engineVersion", "scoringVersion"])(
    "rejects non-SemVer %s",
    (field) => {
      expect(
        VersionSetSchema.safeParse({
          ...validVersionSet,
          [field]: "1.0",
        }).success,
      ).toBe(false);
    },
  );

  it("rejects aliases and unknown fields", () => {
    expect(
      VersionSetSchema.safeParse({
        ...validVersionSet,
        dataSnapshotVersion: validVersionSet.dataVersion,
      }).success,
    ).toBe(false);
  });

  it("rejects empty or padded identifiers", () => {
    expect(
      VersionSetSchema.safeParse({
        ...validVersionSet,
        contentVersion: "",
      }).success,
    ).toBe(false);
    expect(
      VersionSetSchema.safeParse({
        ...validVersionSet,
        dataVersion: " 2026.07 ",
      }).success,
    ).toBe(false);
  });
});

describe("RootSeedSchema", () => {
  const rootSeed = "0000000000000001000000000000000200000000000000030000000000000004";

  it("accepts exactly one canonical non-zero 256-bit hexadecimal value", () => {
    expect(RootSeedSchema.parse(rootSeed)).toBe(rootSeed);
  });

  it.each([
    "",
    "0".repeat(63),
    "0".repeat(65),
    "0".repeat(64),
    `a${rootSeed.slice(1)}`.toUpperCase(),
    `0x${rootSeed}`,
    ` ${rootSeed}`,
    `${rootSeed} `,
    1,
  ])("rejects ambiguous or invalid seed %j", (value) => {
    expect(RootSeedSchema.safeParse(value).success).toBe(false);
  });
});

describe("SimulationCursorSchema", () => {
  const cursor = {
    seasonId: "season-1",
    position: {
      kind: "SEASON_WINDOW_OPPORTUNITY_WINDOW",
      seasonWindow: "Q2",
      opportunityWindow: "HEALTH_EVENTS",
    },
    operationKey: "opportunity/Q2/HEALTH_EVENTS",
    operationIndex: 15,
  } as const;

  it("accepts a structurally valid exact cursor", () => {
    expect(SimulationCursorSchema.parse(cursor)).toEqual(cursor);
  });

  it.each([
    { ...cursor, seasonId: "" },
    { ...cursor, operationIndex: -1 },
    { ...cursor, operationIndex: 1.5 },
    {
      ...cursor,
      position: {
        ...cursor.position,
        seasonWindow: "Q5",
      },
    },
    {
      ...cursor,
      position: {
        kind: "GLOBAL_OPPORTUNITY_WINDOW",
        opportunityWindow: "PERFORMANCE_EVENTS",
      },
    },
  ])("rejects invalid cursor shape %#", (value) => {
    expect(SimulationCursorSchema.safeParse(value).success).toBe(false);
  });
});
