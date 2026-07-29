import { describe, expect, it } from "vitest";
import type { SimulationCursor } from "@career-simulator/schemas";

import {
  InvalidSimulationCursorError,
  STRUCTURAL_SEASON_OPERATION_KEYS,
  createSeasonStartCursor,
  getNextSimulationCursor,
  getStructuralSeasonOperationCount,
  validateSimulationCursor,
} from "./cursor.js";
import { ENGINE_GOLDEN_VECTORS_V1 } from "./golden-vectors-v1.js";

describe("SimulationCursor structural pipeline", () => {
  it("matches the versioned ADR-013/042/043 operation sequence", () => {
    expect(STRUCTURAL_SEASON_OPERATION_KEYS).toEqual(
      ENGINE_GOLDEN_VECTORS_V1.simulationCursorOperationKeys,
    );
    expect(getStructuralSeasonOperationCount()).toBe(38);
  });

  it("walks every operation exactly once and ends after SEASON_CLOSE", () => {
    let cursor: SimulationCursor | null = createSeasonStartCursor("season-1");
    const visited: string[] = [];

    while (cursor !== null) {
      visited.push(cursor.operationKey);
      cursor = getNextSimulationCursor(cursor);
    }

    expect(visited).toEqual(STRUCTURAL_SEASON_OPERATION_KEYS);
  });

  it("rejects internally inconsistent cursor fields", () => {
    const cursor = createSeasonStartCursor("season-1");

    expect(() =>
      validateSimulationCursor({
        ...cursor,
        operationKey: "phase/PRESEASON",
      }),
    ).toThrow(InvalidSimulationCursorError);
    expect(() =>
      validateSimulationCursor({
        ...cursor,
        operationIndex: 100,
      }),
    ).toThrow(InvalidSimulationCursorError);
  });
});
