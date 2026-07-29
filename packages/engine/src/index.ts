export {
  InvalidSimulationCursorError,
  STRUCTURAL_SEASON_OPERATION_KEYS,
  createSeasonStartCursor,
  getNextSimulationCursor,
  getOperationKey,
  getStructuralSeasonOperationCount,
  validateSimulationCursor,
} from "./cursor.js";

export {
  InvalidStructuralStateError,
  canonicalizeStructuralState,
  createStructuralSimulationState,
  hashStructuralState,
  validateStructuralSimulationState,
} from "./structural-state.js";
export type {
  PendingDecision,
  ResolvedStructuralDecision,
  StructuralExecutionRecord,
  StructuralSimulationState,
} from "./structural-state.js";

export {
  StructuralRunnerError,
  advanceStructuralSimulation,
  resolvePendingDecision,
} from "./structural-runner.js";
export type {
  AdvanceRequest,
  AdvanceResult,
  AdvanceStopReason,
  ResolveDecisionRequest,
  StructuralCheckpoint,
  SyntheticDecisionTrigger,
} from "./structural-runner.js";

export { replayStructuralSimulation } from "./replay.js";
export type {
  ReplayCheckpoint,
  StructuralReplayAction,
  StructuralReplayInput,
  StructuralReplayResult,
} from "./replay.js";

export type { SimulationCursor } from "@career-simulator/schemas";
