import { z } from "zod";

const ROOT_SEED_PATTERN = /^[0-9a-f]{64}$/u;

export const RootSeedSchema = z
  .string()
  .regex(ROOT_SEED_PATTERN, "RootSeed must contain exactly 64 lowercase hexadecimal characters")
  .refine((value) => /[1-9a-f]/u.test(value), {
    error: "RootSeed must not encode the all-zero xoshiro256** state",
  });

export type RootSeed = z.infer<typeof RootSeedSchema>;
