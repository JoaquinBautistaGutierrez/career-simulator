import { createSyntheticDecisionTriggerFixture } from "@career-simulator/testkit";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { hashCanonicalJson } from "@career-simulator/probability";

import { createStructuralSimulationState } from "./structural-state.js";
import {
  StructuralRunnerError,
  advanceStructuralSimulation,
  resolvePendingDecision,
} from "./structural-runner.js";

const seasonIds = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => `season-${String(index + 1)}`);

describe("structural advance cadence", () => {
  it("makes four advance(1) calls byte-equivalent to advance(4)", () => {
    const initial = createStructuralSimulationState();
    const batched = advanceStructuralSimulation(initial, {
      seasonsToComplete: 4,
      seasonIds: seasonIds(4),
    });

    let repeatedState = initial;
    for (const seasonId of seasonIds(4)) {
      repeatedState = advanceStructuralSimulation(repeatedState, {
        seasonsToComplete: 1,
        seasonIds: [seasonId],
      }).state;
    }

    expect(batched.state).toEqual(repeatedState);
    expect(hashCanonicalJson(batched.state)).toBe(hashCanonicalJson(repeatedState));
    expect(batched.state.executionLog).toHaveLength(4 * 38);
  });

  it("is cadence-neutral for a property-generated season count", () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 8 }), (count) => {
        const initial = createStructuralSimulationState();
        const ids = seasonIds(count);
        const batched = advanceStructuralSimulation(initial, {
          seasonsToComplete: count,
          seasonIds: ids,
        }).state;

        const repeated = ids.reduce(
          (state, seasonId) =>
            advanceStructuralSimulation(state, {
              seasonsToComplete: 1,
              seasonIds: [seasonId],
            }).state,
          initial,
        );

        expect(hashCanonicalJson(batched)).toBe(hashCanonicalJson(repeated));
      }),
    );
  });

  it("stops at the same second-season cursor under both cadences", () => {
    const initial = createStructuralSimulationState();
    const trigger = createSyntheticDecisionTriggerFixture();
    const batched = advanceStructuralSimulation(initial, {
      seasonsToComplete: 4,
      seasonIds: seasonIds(4),
      decisionTriggers: [trigger],
    });

    const afterFirst = advanceStructuralSimulation(initial, {
      seasonsToComplete: 1,
      seasonIds: ["season-1"],
    }).state;
    const repeated = advanceStructuralSimulation(afterFirst, {
      seasonsToComplete: 1,
      seasonIds: ["season-2"],
      decisionTriggers: [trigger],
    });

    expect(batched.stopReason).toBe("WAITING_DECISION");
    expect(repeated.stopReason).toBe("WAITING_DECISION");
    expect(batched.state).toEqual(repeated.state);
    expect(batched.state.cursor?.operationKey).toBe("window/Q2/CONSEQUENCES");
    expect(hashCanonicalJson(batched.state)).toBe(hashCanonicalJson(repeated.state));
  });
});

describe("WAITING_DECISION interruption", () => {
  it("resumes after the consumed operation without executing it twice", () => {
    const trigger = createSyntheticDecisionTriggerFixture();
    const interrupted = advanceStructuralSimulation(createStructuralSimulationState(), {
      seasonsToComplete: 2,
      seasonIds: ["season-1", "season-2"],
      decisionTriggers: [trigger],
    });
    const executionCountAtInterruption = interrupted.state.executionLog.length;

    const resolved = resolvePendingDecision(interrupted.state, {
      decisionId: trigger.decisionId,
      optionId: "synthetic-option-a",
    });
    const resumed = advanceStructuralSimulation(resolved, {
      seasonsToComplete: 1,
      seasonIds: [],
      decisionTriggers: [trigger],
    });

    expect(resolved.careerStatus).toBe("ACTIVE");
    expect(resolved.cursor?.operationKey).toBe("window/Q2/CONSEQUENCES");
    expect(resumed.state.completedSeasonIds).toEqual(["season-1", "season-2"]);
    expect(resumed.state.executionLog.length).toBeGreaterThan(executionCountAtInterruption);
    expect(
      resumed.state.executionLog.filter(
        (record) =>
          record.seasonId === "season-2" && record.operationKey === trigger.afterOperationKey,
      ),
    ).toHaveLength(1);
  });

  it("rejects an unrelated resolution and non-active lifecycle states", () => {
    const trigger = createSyntheticDecisionTriggerFixture();
    const interrupted = advanceStructuralSimulation(createStructuralSimulationState(), {
      seasonsToComplete: 2,
      seasonIds: ["season-1", "season-2"],
      decisionTriggers: [trigger],
    });

    expect(() =>
      resolvePendingDecision(interrupted.state, {
        decisionId: "another-decision",
        optionId: "option",
      }),
    ).toThrow(StructuralRunnerError);
    expect(() =>
      advanceStructuralSimulation(createStructuralSimulationState("DRAFT"), {
        seasonsToComplete: 1,
        seasonIds: ["season-1"],
      }),
    ).toThrow(StructuralRunnerError);
  });
});
