import {
  TEST_ROOT_SEED,
  TEST_VERSION_SET,
  createSyntheticDecisionTriggerFixture,
} from "@career-simulator/testkit";
import { describe, expect, it } from "vitest";

import { ENGINE_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";
import { replayStructuralSimulation, type StructuralReplayInput } from "./replay.js";
import { createStructuralSimulationState } from "./structural-state.js";

const createGoldenReplayInput = (): StructuralReplayInput => ({
  rootSeed: TEST_ROOT_SEED,
  versions: TEST_VERSION_SET,
  initialState: createStructuralSimulationState(),
  actions: [
    {
      type: "ADVANCE",
      request: {
        seasonsToComplete: 2,
        seasonIds: ["season-1", "season-2"],
      },
    },
  ],
});

describe("structural replay", () => {
  it("matches the versioned replay golden vector", () => {
    const replay = replayStructuralSimulation(createGoldenReplayInput());

    expect(replay.finalState.completedSeasonIds).toEqual(
      ENGINE_GOLDEN_VECTORS_V1.replay.completedSeasonIds,
    );
    expect(replay.finalState.executionLog).toHaveLength(
      ENGINE_GOLDEN_VECTORS_V1.replay.executionRecordCount,
    );
    expect(replay.finalHash).toBe(ENGINE_GOLDEN_VECTORS_V1.replay.finalHash);
    expect(replay.checkpoints.map((current) => current.checkpoint.stateHash)).toEqual(
      ENGINE_GOLDEN_VECTORS_V1.replay.checkpointHashes,
    );
  });

  it("replays identical input to byte-equivalent state and hash", () => {
    const first = replayStructuralSimulation(createGoldenReplayInput());
    const second = replayStructuralSimulation(createGoldenReplayInput());

    expect(first.canonicalState).toBe(second.canonicalState);
    expect(first.finalHash).toBe(second.finalHash);
    expect(first.checkpoints).toEqual(second.checkpoints);
  });

  it("records and replays a synthetic decision interruption", () => {
    const trigger = createSyntheticDecisionTriggerFixture();
    const replay = replayStructuralSimulation({
      rootSeed: TEST_ROOT_SEED,
      versions: TEST_VERSION_SET,
      initialState: createStructuralSimulationState(),
      actions: [
        {
          type: "ADVANCE",
          request: {
            seasonsToComplete: 2,
            seasonIds: ["season-1", "season-2"],
            decisionTriggers: [trigger],
          },
        },
        {
          type: "RESOLVE_DECISION",
          decisionId: trigger.decisionId,
          optionId: "synthetic-option-a",
        },
        {
          type: "ADVANCE",
          request: {
            seasonsToComplete: 1,
            seasonIds: [],
            decisionTriggers: [trigger],
          },
        },
      ],
    });

    expect(replay.finalState.careerStatus).toBe("ACTIVE");
    expect(replay.finalState.completedSeasonIds).toEqual(["season-1", "season-2"]);
    expect(replay.finalState.resolvedDecisions).toEqual([
      {
        decisionId: trigger.decisionId,
        optionId: "synthetic-option-a",
      },
    ]);
    expect(
      replay.checkpoints.some((current) => current.checkpoint.kind === "WAITING_DECISION"),
    ).toBe(true);
  });

  it("includes every canonical version and root seed in replay integrity", () => {
    const baseline = replayStructuralSimulation(createGoldenReplayInput());
    const differentEngineVersion = replayStructuralSimulation({
      ...createGoldenReplayInput(),
      versions: {
        ...TEST_VERSION_SET,
        engineVersion: "0.2.1",
      },
    });
    const differentRootSeed = replayStructuralSimulation({
      ...createGoldenReplayInput(),
      rootSeed: "1000000000000001000000000000000200000000000000030000000000000004",
    });

    expect(differentEngineVersion.canonicalState).toBe(baseline.canonicalState);
    expect(differentEngineVersion.finalHash).not.toBe(baseline.finalHash);
    expect(differentRootSeed.finalHash).not.toBe(baseline.finalHash);
  });
});
