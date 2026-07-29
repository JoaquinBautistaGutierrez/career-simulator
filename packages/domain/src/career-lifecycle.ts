import { CAREER_STATUSES, type CareerStatus } from "@career-simulator/schemas";

const ALLOWED_TRANSITIONS = {
  DRAFT: ["ACTIVE", "ABANDONED", "INVALIDATED"],
  ACTIVE: ["WAITING_DECISION", "RETIRED", "ABANDONED", "INVALIDATED"],
  WAITING_DECISION: ["ACTIVE", "RETIRED", "ABANDONED", "INVALIDATED"],
  RETIRED: ["COMPLETED", "ABANDONED", "INVALIDATED"],
  COMPLETED: ["INVALIDATED"],
  ABANDONED: [],
  INVALIDATED: [],
} as const satisfies Readonly<Record<CareerStatus, readonly CareerStatus[]>>;

export class InvalidCareerTransitionError extends Error {
  public constructor(
    public readonly from: CareerStatus,
    public readonly to: CareerStatus,
  ) {
    super(`Career cannot transition from ${from} to ${to}`);
    this.name = "InvalidCareerTransitionError";
  }
}

export const canTransitionCareer = (from: CareerStatus, to: CareerStatus): boolean =>
  (ALLOWED_TRANSITIONS[from] as readonly CareerStatus[]).includes(to);

export const transitionCareerStatus = (from: CareerStatus, to: CareerStatus): CareerStatus => {
  if (!canTransitionCareer(from, to)) {
    throw new InvalidCareerTransitionError(from, to);
  }
  return to;
};

export const getAllowedCareerTransitions = (from: CareerStatus): readonly CareerStatus[] => [
  ...ALLOWED_TRANSITIONS[from],
];

export const getCareerTransitionMatrix = (): Readonly<
  Record<CareerStatus, Readonly<Record<CareerStatus, boolean>>>
> =>
  Object.fromEntries(
    CAREER_STATUSES.map((from) => [
      from,
      Object.fromEntries(CAREER_STATUSES.map((to) => [to, canTransitionCareer(from, to)])),
    ]),
  ) as Readonly<Record<CareerStatus, Readonly<Record<CareerStatus, boolean>>>>;
