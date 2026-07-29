/**
 * Versioned structural execution fixtures.
 *
 * Any change to operation ordering or replay hashes requires an explicit
 * deterministic-compatibility justification and a participating version bump.
 */
export const ENGINE_GOLDEN_VECTORS_V1 = {
  contractVersion: 1,
  simulationCursorOperationKeys: [
    "phase/SEASON_START",
    "phase/PRESEASON",
    "opportunity/PRESEASON_EVENTS",
    "phase/ROLE_AND_MINUTES",
    "window/Q1/AVAILABILITY",
    "window/Q1/PRODUCTION",
    "window/Q1/HEALTH",
    "window/Q1/CONSEQUENCES",
    "opportunity/Q1/PERFORMANCE_EVENTS",
    "opportunity/Q1/HEALTH_EVENTS",
    "window/Q2/AVAILABILITY",
    "window/Q2/PRODUCTION",
    "window/Q2/HEALTH",
    "window/Q2/CONSEQUENCES",
    "opportunity/Q2/PERFORMANCE_EVENTS",
    "opportunity/Q2/HEALTH_EVENTS",
    "window/Q3/AVAILABILITY",
    "window/Q3/PRODUCTION",
    "window/Q3/HEALTH",
    "window/Q3/CONSEQUENCES",
    "opportunity/Q3/PERFORMANCE_EVENTS",
    "opportunity/Q3/HEALTH_EVENTS",
    "window/Q4/AVAILABILITY",
    "window/Q4/PRODUCTION",
    "window/Q4/HEALTH",
    "window/Q4/CONSEQUENCES",
    "opportunity/Q4/PERFORMANCE_EVENTS",
    "opportunity/Q4/HEALTH_EVENTS",
    "phase/COMPETITIONS",
    "opportunity/COMPETITION_EVENTS",
    "phase/MARKET",
    "opportunity/MARKET_EVENTS",
    "phase/AWARDS",
    "opportunity/AWARD_EVENTS",
    "phase/WORLD_UPDATE",
    "opportunity/WORLD_EVENTS",
    "opportunity/POSTSEASON_EVENTS",
    "phase/SEASON_CLOSE",
  ],
  replay: {
    completedSeasonIds: ["season-1", "season-2"],
    executionRecordCount: 76,
    finalHash: "a9b0398312c4d9e77a5489343af2dff5b9d58418a3144b8578195eee51bc04d6",
    checkpointHashes: [
      "ed1025857053c3bc7ddebac33a14e9ada3a8cf37604c94f2d5a7e5552297b391",
      "e26071af6ed07ddd7110df134f2878eb093f3d30ee9b470674d22d722aa92be6",
    ],
  },
} as const;
