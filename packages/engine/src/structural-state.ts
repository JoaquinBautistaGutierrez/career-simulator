import type { CareerStatus, SimulationCursor } from "@career-simulator/schemas";
import { CareerStatusSchema } from "@career-simulator/schemas";
import {
  canonicalizeJson,
  hashCanonicalJson,
  type CanonicalJson,
  type Sha256Digest,
} from "@career-simulator/probability";

import { STRUCTURAL_SEASON_OPERATION_KEYS, validateSimulationCursor } from "./cursor.js";

export interface StructuralExecutionRecord {
  readonly sequence: number;
  readonly seasonId: string;
  readonly operationKey: string;
}

export interface ResolvedStructuralDecision {
  readonly decisionId: string;
  readonly optionId: string;
}

export interface PendingDecision {
  readonly decisionId: string;
  readonly afterOperationKey: string;
  readonly resumeCursor: SimulationCursor | null;
}

export interface StructuralSimulationState {
  readonly careerStatus: CareerStatus;
  readonly cursor: SimulationCursor | null;
  readonly pendingDecision: PendingDecision | null;
  readonly completedSeasonIds: readonly string[];
  readonly executionLog: readonly StructuralExecutionRecord[];
  readonly resolvedDecisions: readonly ResolvedStructuralDecision[];
}

export class InvalidStructuralStateError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidStructuralStateError";
  }
}

const assertCanonicalIdentifier = (value: string, name: string): void => {
  if (value.length === 0 || value !== value.trim()) {
    throw new InvalidStructuralStateError(
      `${name} must be non-empty and have no surrounding whitespace`,
    );
  }
};

export const createStructuralSimulationState = (
  careerStatus: CareerStatus = "ACTIVE",
): StructuralSimulationState => {
  const state: StructuralSimulationState = {
    careerStatus,
    cursor: null,
    pendingDecision: null,
    completedSeasonIds: [],
    executionLog: [],
    resolvedDecisions: [],
  };
  return validateStructuralSimulationState(state);
};

export const validateStructuralSimulationState = (
  state: StructuralSimulationState,
): StructuralSimulationState => {
  CareerStatusSchema.parse(state.careerStatus);

  if (state.cursor !== null) {
    validateSimulationCursor(state.cursor);
  }

  if ((state.careerStatus === "WAITING_DECISION") !== (state.pendingDecision !== null)) {
    throw new InvalidStructuralStateError(
      "WAITING_DECISION status and PendingDecision must exist together",
    );
  }

  if (state.pendingDecision !== null) {
    assertCanonicalIdentifier(state.pendingDecision.decisionId, "decisionId");
    assertCanonicalIdentifier(state.pendingDecision.afterOperationKey, "afterOperationKey");

    const pendingCursor = state.pendingDecision.resumeCursor;
    if (pendingCursor !== null) {
      validateSimulationCursor(pendingCursor);
    }

    if (canonicalizeJson(pendingCursor) !== canonicalizeJson(state.cursor)) {
      throw new InvalidStructuralStateError(
        "PendingDecision resumeCursor must equal the state's exact cursor",
      );
    }
  }

  const completedSeasonIds = new Set<string>();
  for (const seasonId of state.completedSeasonIds) {
    assertCanonicalIdentifier(seasonId, "completed seasonId");
    if (completedSeasonIds.has(seasonId)) {
      throw new InvalidStructuralStateError(`completedSeasonIds contains duplicate ${seasonId}`);
    }
    completedSeasonIds.add(seasonId);
  }

  if (state.cursor !== null && completedSeasonIds.has(state.cursor.seasonId)) {
    throw new InvalidStructuralStateError("Current cursor season must not already be completed");
  }

  state.executionLog.forEach((record, index) => {
    if (record.sequence !== index) {
      throw new InvalidStructuralStateError(
        "Structural execution record sequence must be contiguous from zero",
      );
    }
    assertCanonicalIdentifier(record.seasonId, "execution seasonId");
    assertCanonicalIdentifier(record.operationKey, "execution operationKey");
  });

  let executionIndex = 0;
  const assertSeasonOperation = (seasonId: string, operationIndex: number): void => {
    const record = state.executionLog[executionIndex];
    const expectedOperationKey = STRUCTURAL_SEASON_OPERATION_KEYS[operationIndex];
    if (
      record === undefined ||
      expectedOperationKey === undefined ||
      record.seasonId !== seasonId ||
      record.operationKey !== expectedOperationKey
    ) {
      throw new InvalidStructuralStateError(
        `Execution log diverges at sequence ${String(executionIndex)}`,
      );
    }
    executionIndex += 1;
  };

  for (const seasonId of state.completedSeasonIds) {
    STRUCTURAL_SEASON_OPERATION_KEYS.forEach((_operationKey, operationIndex) => {
      assertSeasonOperation(seasonId, operationIndex);
    });
  }

  if (state.cursor !== null) {
    for (
      let operationIndex = 0;
      operationIndex < state.cursor.operationIndex;
      operationIndex += 1
    ) {
      assertSeasonOperation(state.cursor.seasonId, operationIndex);
    }
  }

  if (executionIndex !== state.executionLog.length) {
    throw new InvalidStructuralStateError(
      "Execution log contains operations beyond the exact cursor",
    );
  }

  const decisionIds = new Set<string>();
  for (const decision of state.resolvedDecisions) {
    assertCanonicalIdentifier(decision.decisionId, "resolved decisionId");
    assertCanonicalIdentifier(decision.optionId, "resolved optionId");
    if (decisionIds.has(decision.decisionId)) {
      throw new InvalidStructuralStateError(
        `resolvedDecisions contains duplicate ${decision.decisionId}`,
      );
    }
    decisionIds.add(decision.decisionId);
  }

  if (state.pendingDecision !== null && decisionIds.has(state.pendingDecision.decisionId)) {
    throw new InvalidStructuralStateError(
      "A PendingDecision cannot already be present in resolvedDecisions",
    );
  }

  if (state.pendingDecision !== null) {
    const latestRecord = state.executionLog.at(-1);
    if (
      latestRecord === undefined ||
      latestRecord.operationKey !== state.pendingDecision.afterOperationKey
    ) {
      throw new InvalidStructuralStateError(
        "PendingDecision must point to the last consumed structural operation",
      );
    }
  }

  return state;
};

export const canonicalizeStructuralState = (state: StructuralSimulationState): CanonicalJson =>
  canonicalizeJson(validateStructuralSimulationState(state));

export const hashStructuralState = (
  state: StructuralSimulationState,
): Sha256Digest<"structural-state"> =>
  hashCanonicalJson<"structural-state">(validateStructuralSimulationState(state));
