import { transitionCareerStatus } from "@career-simulator/domain";
import type { SimulationCursor } from "@career-simulator/schemas";
import type { Sha256Digest } from "@career-simulator/probability";

import {
  STRUCTURAL_SEASON_OPERATION_KEYS,
  createSeasonStartCursor,
  getNextSimulationCursor,
  validateSimulationCursor,
} from "./cursor.js";
import {
  hashStructuralState,
  validateStructuralSimulationState,
  type PendingDecision,
  type StructuralSimulationState,
} from "./structural-state.js";

export interface SyntheticDecisionTrigger {
  readonly decisionId: string;
  readonly seasonId: string;
  readonly afterOperationKey: string;
}

export interface AdvanceRequest {
  readonly seasonsToComplete: number;
  readonly seasonIds: readonly string[];
  readonly decisionTriggers?: readonly SyntheticDecisionTrigger[];
}

export type AdvanceStopReason = "TARGET_REACHED" | "WAITING_DECISION";

export interface StructuralCheckpoint {
  readonly kind: "SEASON_COMPLETED" | "WAITING_DECISION";
  readonly seasonId: string;
  readonly cursor: SimulationCursor | null;
  readonly stateHash: Sha256Digest<"structural-state">;
}

export interface AdvanceResult {
  readonly requestedSeasons: number;
  readonly completedSeasons: number;
  readonly completedSeasonIds: readonly string[];
  readonly stopReason: AdvanceStopReason;
  readonly state: StructuralSimulationState;
  readonly checkpoints: readonly StructuralCheckpoint[];
}

export interface ResolveDecisionRequest {
  readonly decisionId: string;
  readonly optionId: string;
}

export class StructuralRunnerError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "StructuralRunnerError";
  }
}

const assertIdentifier = (value: string, name: string): void => {
  if (value.length === 0 || value !== value.trim()) {
    throw new StructuralRunnerError(`${name} must be non-empty and have no surrounding whitespace`);
  }
};

const validateAdvanceRequest = (
  state: StructuralSimulationState,
  request: AdvanceRequest,
): void => {
  if (!Number.isSafeInteger(request.seasonsToComplete) || request.seasonsToComplete <= 0) {
    throw new StructuralRunnerError("advance(n) requires a positive safe integer season count");
  }

  const expectedSeasonIds = request.seasonsToComplete - (state.cursor === null ? 0 : 1);
  if (request.seasonIds.length !== expectedSeasonIds) {
    throw new StructuralRunnerError(
      `advance request requires exactly ${String(expectedSeasonIds)} new season IDs`,
    );
  }

  const unavailableSeasonIds = new Set(state.completedSeasonIds);
  if (state.cursor !== null) {
    unavailableSeasonIds.add(state.cursor.seasonId);
  }

  for (const seasonId of request.seasonIds) {
    assertIdentifier(seasonId, "seasonId");
    if (unavailableSeasonIds.has(seasonId)) {
      throw new StructuralRunnerError(`seasonId ${seasonId} is already in use`);
    }
    unavailableSeasonIds.add(seasonId);
  }

  const requestSeasonIds = new Set(request.seasonIds);
  if (state.cursor !== null) {
    requestSeasonIds.add(state.cursor.seasonId);
  }
  const triggerDecisionIds = new Set<string>();
  for (const trigger of request.decisionTriggers ?? []) {
    assertIdentifier(trigger.decisionId, "decisionId");
    assertIdentifier(trigger.seasonId, "decision trigger seasonId");
    assertIdentifier(trigger.afterOperationKey, "afterOperationKey");
    if (!requestSeasonIds.has(trigger.seasonId)) {
      throw new StructuralRunnerError(
        `Decision trigger references season ${trigger.seasonId} outside this advance request`,
      );
    }
    if (!STRUCTURAL_SEASON_OPERATION_KEYS.includes(trigger.afterOperationKey)) {
      throw new StructuralRunnerError(
        `Decision trigger references unknown operation ${trigger.afterOperationKey}`,
      );
    }
    if (triggerDecisionIds.has(trigger.decisionId)) {
      throw new StructuralRunnerError(`Decision trigger ID ${trigger.decisionId} is duplicated`);
    }
    triggerDecisionIds.add(trigger.decisionId);
  }
};

const findDecisionTrigger = (
  triggers: readonly SyntheticDecisionTrigger[],
  seasonId: string,
  operationKey: string,
  state: StructuralSimulationState,
): SyntheticDecisionTrigger | undefined =>
  triggers.find(
    (trigger) =>
      trigger.seasonId === seasonId &&
      trigger.afterOperationKey === operationKey &&
      !state.resolvedDecisions.some((decision) => decision.decisionId === trigger.decisionId),
  );

const checkpoint = (
  kind: StructuralCheckpoint["kind"],
  seasonId: string,
  state: StructuralSimulationState,
): StructuralCheckpoint => ({
  kind,
  seasonId,
  cursor: state.cursor,
  stateHash: hashStructuralState(state),
});

export const advanceStructuralSimulation = (
  inputState: StructuralSimulationState,
  request: AdvanceRequest,
): AdvanceResult => {
  let state = validateStructuralSimulationState(inputState);
  validateAdvanceRequest(state, request);

  if (state.careerStatus === "WAITING_DECISION") {
    const seasonId = state.cursor?.seasonId ?? state.completedSeasonIds.at(-1);
    if (seasonId === undefined) {
      throw new StructuralRunnerError(
        "WAITING_DECISION state has no season identity for its checkpoint",
      );
    }
    return {
      requestedSeasons: request.seasonsToComplete,
      completedSeasons: 0,
      completedSeasonIds: [],
      stopReason: "WAITING_DECISION",
      state,
      checkpoints: [checkpoint("WAITING_DECISION", seasonId, state)],
    };
  }

  if (state.careerStatus !== "ACTIVE") {
    throw new StructuralRunnerError(
      `Structural advance requires ACTIVE career status, received ${state.careerStatus}`,
    );
  }

  let seasonIdIndex = 0;
  let completedSeasons = 0;
  const completedSeasonIds: string[] = [];
  const checkpoints: StructuralCheckpoint[] = [];
  const triggers = request.decisionTriggers ?? [];

  while (completedSeasons < request.seasonsToComplete) {
    const cursor =
      state.cursor ??
      createSeasonStartCursor(
        request.seasonIds[seasonIdIndex] ??
          (() => {
            throw new StructuralRunnerError("Missing season ID while starting a season");
          })(),
      );

    if (state.cursor === null) {
      seasonIdIndex += 1;
    }

    const validatedCursor = validateSimulationCursor(cursor);
    const resumeCursor = getNextSimulationCursor(validatedCursor);
    const operationRecord = {
      sequence: state.executionLog.length,
      seasonId: validatedCursor.seasonId,
      operationKey: validatedCursor.operationKey,
    } as const;
    const isSeasonClose = resumeCursor === null;

    state = {
      ...state,
      cursor: resumeCursor,
      completedSeasonIds: isSeasonClose
        ? [...state.completedSeasonIds, validatedCursor.seasonId]
        : state.completedSeasonIds,
      executionLog: [...state.executionLog, operationRecord],
    };

    if (isSeasonClose) {
      completedSeasons += 1;
      completedSeasonIds.push(validatedCursor.seasonId);
      checkpoints.push(checkpoint("SEASON_COMPLETED", validatedCursor.seasonId, state));
    }

    const trigger = findDecisionTrigger(
      triggers,
      validatedCursor.seasonId,
      validatedCursor.operationKey,
      state,
    );
    if (trigger !== undefined) {
      const pendingDecision: PendingDecision = {
        decisionId: trigger.decisionId,
        afterOperationKey: validatedCursor.operationKey,
        resumeCursor,
      };
      state = {
        ...state,
        careerStatus: transitionCareerStatus(state.careerStatus, "WAITING_DECISION"),
        pendingDecision,
      };
      checkpoints.push(checkpoint("WAITING_DECISION", validatedCursor.seasonId, state));
      return {
        requestedSeasons: request.seasonsToComplete,
        completedSeasons,
        completedSeasonIds,
        stopReason: "WAITING_DECISION",
        state,
        checkpoints,
      };
    }
  }

  return {
    requestedSeasons: request.seasonsToComplete,
    completedSeasons,
    completedSeasonIds,
    stopReason: "TARGET_REACHED",
    state,
    checkpoints,
  };
};

export const resolvePendingDecision = (
  inputState: StructuralSimulationState,
  request: ResolveDecisionRequest,
): StructuralSimulationState => {
  const state = validateStructuralSimulationState(inputState);
  if (state.careerStatus !== "WAITING_DECISION" || state.pendingDecision === null) {
    throw new StructuralRunnerError("A decision can only be resolved from WAITING_DECISION");
  }

  assertIdentifier(request.decisionId, "decisionId");
  assertIdentifier(request.optionId, "optionId");
  if (request.decisionId !== state.pendingDecision.decisionId) {
    throw new StructuralRunnerError(
      `Expected decision ${state.pendingDecision.decisionId}, received ${request.decisionId}`,
    );
  }

  return validateStructuralSimulationState({
    ...state,
    careerStatus: transitionCareerStatus(state.careerStatus, "ACTIVE"),
    pendingDecision: null,
    resolvedDecisions: [
      ...state.resolvedDecisions,
      {
        decisionId: request.decisionId,
        optionId: request.optionId,
      },
    ],
  });
};
