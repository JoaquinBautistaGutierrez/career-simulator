import type { RootSeed, VersionSet } from "@career-simulator/schemas";

export const TEST_ROOT_SEED =
  "0000000000000001000000000000000200000000000000030000000000000004" as RootSeed;

export const TEST_VERSION_SET = {
  schemaVersion: "1.0.0",
  engineVersion: "0.2.0",
  contentVersion: "2026.07.27.1",
  dataVersion: "2026.07",
  scoringVersion: "1.0.0",
} as const satisfies VersionSet;

export interface SyntheticDecisionTriggerFixture {
  readonly decisionId: string;
  readonly seasonId: string;
  readonly afterOperationKey: string;
}

export const createSyntheticDecisionTriggerFixture = (
  overrides: Partial<SyntheticDecisionTriggerFixture> = {},
): SyntheticDecisionTriggerFixture => ({
  decisionId: "synthetic-decision-1",
  seasonId: "season-2",
  afterOperationKey: "window/Q2/HEALTH",
  ...overrides,
});
