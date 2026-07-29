import { z } from "zod";

export const SEASON_WINDOWS = ["Q1", "Q2", "Q3", "Q4"] as const;

export const STRUCTURAL_PHASES = [
  "SEASON_START",
  "PRESEASON",
  "ROLE_AND_MINUTES",
  "COMPETITIONS",
  "MARKET",
  "AWARDS",
  "WORLD_UPDATE",
  "SEASON_CLOSE",
] as const;

export const WINDOW_STEPS = ["AVAILABILITY", "PRODUCTION", "HEALTH", "CONSEQUENCES"] as const;

export const GLOBAL_OPPORTUNITY_WINDOWS = [
  "PRESEASON_EVENTS",
  "COMPETITION_EVENTS",
  "MARKET_EVENTS",
  "AWARD_EVENTS",
  "WORLD_EVENTS",
  "POSTSEASON_EVENTS",
] as const;

export const SEASON_WINDOW_OPPORTUNITY_WINDOWS = ["PERFORMANCE_EVENTS", "HEALTH_EVENTS"] as const;

export const SeasonWindowSchema = z.enum(SEASON_WINDOWS, {
  error: "SeasonWindow must be Q1, Q2, Q3, or Q4",
});

export const StructuralPhaseSchema = z.enum(STRUCTURAL_PHASES, {
  error: "Structural phase is not part of the canonical season pipeline",
});

export const WindowStepSchema = z.enum(WINDOW_STEPS, {
  error: "Window step is not part of the canonical aggregate-window pipeline",
});

export const GlobalOpportunityWindowSchema = z.enum(GLOBAL_OPPORTUNITY_WINDOWS, {
  error: "Opportunity window is not a canonical global opportunity window",
});

export const SeasonWindowOpportunityWindowSchema = z.enum(SEASON_WINDOW_OPPORTUNITY_WINDOWS, {
  error: "Opportunity window is not a canonical season-window opportunity window",
});

export const CursorPositionSchema = z.union([
  z.strictObject({
    kind: z.literal("PHASE"),
    phase: StructuralPhaseSchema,
  }),
  z.strictObject({
    kind: z.literal("WINDOW_STEP"),
    seasonWindow: SeasonWindowSchema,
    step: WindowStepSchema,
  }),
  z.strictObject({
    kind: z.literal("GLOBAL_OPPORTUNITY_WINDOW"),
    opportunityWindow: GlobalOpportunityWindowSchema,
  }),
  z.strictObject({
    kind: z.literal("SEASON_WINDOW_OPPORTUNITY_WINDOW"),
    seasonWindow: SeasonWindowSchema,
    opportunityWindow: SeasonWindowOpportunityWindowSchema,
  }),
]);

const canonicalIdentifierSchema = (name: string) =>
  z
    .string()
    .min(1, `${name} must not be empty`)
    .refine((value) => value === value.trim(), {
      error: `${name} must not have surrounding whitespace`,
    });

export const SimulationCursorSchema = z.strictObject({
  seasonId: canonicalIdentifierSchema("seasonId"),
  position: CursorPositionSchema,
  operationKey: canonicalIdentifierSchema("operationKey"),
  operationIndex: z
    .number()
    .int("operationIndex must be an integer")
    .nonnegative("operationIndex must be non-negative"),
});

export type SeasonWindow = z.infer<typeof SeasonWindowSchema>;
export type StructuralPhase = z.infer<typeof StructuralPhaseSchema>;
export type WindowStep = z.infer<typeof WindowStepSchema>;
export type GlobalOpportunityWindow = z.infer<typeof GlobalOpportunityWindowSchema>;
export type SeasonWindowOpportunityWindow = z.infer<typeof SeasonWindowOpportunityWindowSchema>;
export type CursorPosition = z.infer<typeof CursorPositionSchema>;
export type SimulationCursor = z.infer<typeof SimulationCursorSchema>;
