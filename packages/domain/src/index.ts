import type { Position, PositionGroup } from "@career-simulator/schemas";

export {
  InvalidCareerTransitionError,
  canTransitionCareer,
  getAllowedCareerTransitions,
  getCareerTransitionMatrix,
  transitionCareerStatus,
} from "./career-lifecycle.js";

const POSITION_GROUP_BY_POSITION = {
  GK: "GK",
  RB: "DEF",
  CB: "DEF",
  LB: "DEF",
  RWB: "DEF",
  LWB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  RM: "MID",
  LM: "MID",
  RW: "FWD",
  LW: "FWD",
  ST: "FWD",
  CF: "FWD",
} as const satisfies Readonly<Record<Position, PositionGroup>>;

export const getPositionGroup = (position: Position): PositionGroup =>
  POSITION_GROUP_BY_POSITION[position];

export type { CareerStatus, Position, PositionGroup } from "@career-simulator/schemas";
