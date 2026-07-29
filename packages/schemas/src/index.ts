import { z } from "zod";

export {
  CursorPositionSchema,
  GLOBAL_OPPORTUNITY_WINDOWS,
  GlobalOpportunityWindowSchema,
  SEASON_WINDOW_OPPORTUNITY_WINDOWS,
  SEASON_WINDOWS,
  STRUCTURAL_PHASES,
  SeasonWindowOpportunityWindowSchema,
  SeasonWindowSchema,
  SimulationCursorSchema,
  StructuralPhaseSchema,
  WINDOW_STEPS,
  WindowStepSchema,
} from "./simulation.js";
export type {
  CursorPosition,
  GlobalOpportunityWindow,
  SeasonWindow,
  SeasonWindowOpportunityWindow,
  SimulationCursor,
  StructuralPhase,
  WindowStep,
} from "./simulation.js";

export { RootSeedSchema } from "./determinism.js";
export type { RootSeed } from "./determinism.js";

export const POSITIONS = [
  "GK",
  "RB",
  "CB",
  "LB",
  "RWB",
  "LWB",
  "CDM",
  "CM",
  "CAM",
  "RM",
  "LM",
  "RW",
  "LW",
  "ST",
  "CF",
] as const;

export const POSITION_GROUPS = ["GK", "DEF", "MID", "FWD"] as const;

export const DOMINANT_FEET = ["RIGHT", "LEFT", "BOTH"] as const;

export const CAREER_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "WAITING_DECISION",
  "RETIRED",
  "COMPLETED",
  "ABANDONED",
  "INVALIDATED",
] as const;

export const PositionSchema = z.enum(POSITIONS, {
  error: "Position must be a canonical position code",
});

export const PositionGroupSchema = z.enum(POSITION_GROUPS, {
  error: "PositionGroup must be GK, DEF, MID, or FWD",
});

export const DominantFootSchema = z.enum(DOMINANT_FEET, {
  error: "DominantFoot must be RIGHT, LEFT, or BOTH",
});

export const CareerStatusSchema = z.enum(CAREER_STATUSES, {
  error: "CareerStatus must be a canonical lifecycle state",
});

const SEMANTIC_VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/u;

const SemanticVersionSchema = z
  .string()
  .regex(SEMANTIC_VERSION_PATTERN, "Version must be a valid semantic version");

const versionIdentifierSchema = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} must not be empty`)
    .refine((value) => value === value.trim(), {
      error: `${fieldName} must not have surrounding whitespace`,
    });

export const VersionSetSchema = z.strictObject({
  schemaVersion: SemanticVersionSchema,
  engineVersion: SemanticVersionSchema,
  contentVersion: versionIdentifierSchema("contentVersion"),
  dataVersion: versionIdentifierSchema("dataVersion"),
  scoringVersion: SemanticVersionSchema,
});

export type Position = z.infer<typeof PositionSchema>;
export type PositionGroup = z.infer<typeof PositionGroupSchema>;
export type DominantFoot = z.infer<typeof DominantFootSchema>;
export type CareerStatus = z.infer<typeof CareerStatusSchema>;
export type VersionSet = z.infer<typeof VersionSetSchema>;
