/**
 * Versioned ADR-016 lifecycle contract fixture.
 *
 * Changing this matrix requires a superseding lifecycle decision.
 */
export const DOMAIN_GOLDEN_VECTORS_V1 = {
  contractVersion: 1,
  allowedCareerTransitions: {
    DRAFT: ["ACTIVE", "ABANDONED", "INVALIDATED"],
    ACTIVE: ["WAITING_DECISION", "RETIRED", "ABANDONED", "INVALIDATED"],
    WAITING_DECISION: ["ACTIVE", "RETIRED", "ABANDONED", "INVALIDATED"],
    RETIRED: ["COMPLETED", "ABANDONED", "INVALIDATED"],
    COMPLETED: ["INVALIDATED"],
    ABANDONED: [],
    INVALIDATED: [],
  },
} as const;
