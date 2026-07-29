import { VersionSetSchema, type RootSeed, type VersionSet } from "@career-simulator/schemas";
import {
  canonicalizeJson,
  hashCanonicalJson,
  parseRootSeed,
  type CanonicalJson,
  type Sha256Digest,
} from "@career-simulator/probability";

import {
  advanceStructuralSimulation,
  resolvePendingDecision,
  type AdvanceRequest,
  type StructuralCheckpoint,
} from "./structural-runner.js";
import {
  validateStructuralSimulationState,
  type StructuralSimulationState,
} from "./structural-state.js";

export type StructuralReplayAction =
  | {
      readonly type: "ADVANCE";
      readonly request: AdvanceRequest;
    }
  | {
      readonly type: "RESOLVE_DECISION";
      readonly decisionId: string;
      readonly optionId: string;
    };

export interface StructuralReplayInput {
  readonly rootSeed: RootSeed;
  readonly versions: VersionSet;
  readonly initialState: StructuralSimulationState;
  readonly actions: readonly StructuralReplayAction[];
}

export interface ReplayCheckpoint {
  readonly actionIndex: number;
  readonly checkpoint: StructuralCheckpoint;
}

export interface StructuralReplayResult {
  readonly finalState: StructuralSimulationState;
  readonly canonicalState: CanonicalJson;
  readonly finalHash: Sha256Digest<"structural-replay">;
  readonly checkpoints: readonly ReplayCheckpoint[];
}

export const replayStructuralSimulation = (
  input: StructuralReplayInput,
): StructuralReplayResult => {
  const rootSeed = parseRootSeed(input.rootSeed);
  const versions = VersionSetSchema.parse(input.versions);
  let state = validateStructuralSimulationState(input.initialState);
  const checkpoints: ReplayCheckpoint[] = [];

  input.actions.forEach((action, actionIndex) => {
    if (action.type === "ADVANCE") {
      const result = advanceStructuralSimulation(state, action.request);
      state = result.state;
      checkpoints.push(
        ...result.checkpoints.map((currentCheckpoint) => ({
          actionIndex,
          checkpoint: currentCheckpoint,
        })),
      );
      return;
    }

    state = resolvePendingDecision(state, {
      decisionId: action.decisionId,
      optionId: action.optionId,
    });
  });

  const finalState = validateStructuralSimulationState(state);
  const canonicalState = canonicalizeJson(finalState);
  const finalHash = hashCanonicalJson<"structural-replay">({
    rootSeed,
    state: finalState,
    versions,
  });

  return {
    finalState,
    canonicalState,
    finalHash,
    checkpoints,
  };
};
