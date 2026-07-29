import {
  SEASON_WINDOWS,
  SimulationCursorSchema,
  type CursorPosition,
  type GlobalOpportunityWindow,
  type SeasonWindow,
  type SeasonWindowOpportunityWindow,
  type SimulationCursor,
  type StructuralPhase,
  type WindowStep,
} from "@career-simulator/schemas";
import { canonicalizeJson } from "@career-simulator/probability";

const phase = (value: StructuralPhase): CursorPosition => ({
  kind: "PHASE",
  phase: value,
});

const globalOpportunity = (value: GlobalOpportunityWindow): CursorPosition => ({
  kind: "GLOBAL_OPPORTUNITY_WINDOW",
  opportunityWindow: value,
});

const windowStep = (seasonWindow: SeasonWindow, step: WindowStep): CursorPosition => ({
  kind: "WINDOW_STEP",
  seasonWindow,
  step,
});

const seasonWindowOpportunity = (
  seasonWindow: SeasonWindow,
  opportunityWindow: SeasonWindowOpportunityWindow,
): CursorPosition => ({
  kind: "SEASON_WINDOW_OPPORTUNITY_WINDOW",
  seasonWindow,
  opportunityWindow,
});

const WINDOW_OPERATIONS = SEASON_WINDOWS.flatMap((seasonWindow) => [
  windowStep(seasonWindow, "AVAILABILITY"),
  windowStep(seasonWindow, "PRODUCTION"),
  windowStep(seasonWindow, "HEALTH"),
  windowStep(seasonWindow, "CONSEQUENCES"),
  seasonWindowOpportunity(seasonWindow, "PERFORMANCE_EVENTS"),
  seasonWindowOpportunity(seasonWindow, "HEALTH_EVENTS"),
]);

const STRUCTURAL_SEASON_POSITIONS: readonly CursorPosition[] = [
  phase("SEASON_START"),
  phase("PRESEASON"),
  globalOpportunity("PRESEASON_EVENTS"),
  phase("ROLE_AND_MINUTES"),
  ...WINDOW_OPERATIONS,
  phase("COMPETITIONS"),
  globalOpportunity("COMPETITION_EVENTS"),
  phase("MARKET"),
  globalOpportunity("MARKET_EVENTS"),
  phase("AWARDS"),
  globalOpportunity("AWARD_EVENTS"),
  phase("WORLD_UPDATE"),
  globalOpportunity("WORLD_EVENTS"),
  globalOpportunity("POSTSEASON_EVENTS"),
  phase("SEASON_CLOSE"),
];

export class InvalidSimulationCursorError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidSimulationCursorError";
  }
}

export const getOperationKey = (position: CursorPosition): string => {
  switch (position.kind) {
    case "PHASE":
      return `phase/${position.phase}`;
    case "WINDOW_STEP":
      return `window/${position.seasonWindow}/${position.step}`;
    case "GLOBAL_OPPORTUNITY_WINDOW":
      return `opportunity/${position.opportunityWindow}`;
    case "SEASON_WINDOW_OPPORTUNITY_WINDOW":
      return `opportunity/${position.seasonWindow}/${position.opportunityWindow}`;
  }
};

export const STRUCTURAL_SEASON_OPERATION_KEYS: readonly string[] = Object.freeze(
  STRUCTURAL_SEASON_POSITIONS.map(getOperationKey),
);

export const getStructuralSeasonOperationCount = (): number => STRUCTURAL_SEASON_POSITIONS.length;

const cursorAt = (seasonId: string, operationIndex: number): SimulationCursor => {
  const position = STRUCTURAL_SEASON_POSITIONS[operationIndex];
  if (position === undefined) {
    throw new InvalidSimulationCursorError(
      `operationIndex ${String(operationIndex)} is outside the structural season`,
    );
  }

  return SimulationCursorSchema.parse({
    seasonId,
    position,
    operationKey: getOperationKey(position),
    operationIndex,
  });
};

export const createSeasonStartCursor = (seasonId: string): SimulationCursor =>
  cursorAt(seasonId, 0);

export const validateSimulationCursor = (value: unknown): SimulationCursor => {
  const cursor = SimulationCursorSchema.parse(value);
  const expected = cursorAt(cursor.seasonId, cursor.operationIndex);

  if (
    cursor.operationKey !== expected.operationKey ||
    canonicalizeJson(cursor.position) !== canonicalizeJson(expected.position)
  ) {
    throw new InvalidSimulationCursorError(
      "SimulationCursor operationIndex, operationKey, and position do not agree",
    );
  }

  return cursor;
};

export const getNextSimulationCursor = (cursor: SimulationCursor): SimulationCursor | null => {
  const validated = validateSimulationCursor(cursor);
  const nextIndex = validated.operationIndex + 1;
  return nextIndex === STRUCTURAL_SEASON_POSITIONS.length
    ? null
    : cursorAt(validated.seasonId, nextIndex);
};
