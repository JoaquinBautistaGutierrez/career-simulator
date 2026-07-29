import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const SOURCE_ROOT = dirname(fileURLToPath(import.meta.url));

const FORBIDDEN_IMPORTS = [
  /^react(?:\/|$)/u,
  /^next(?:\/|$)/u,
  /^node:https?$/u,
  /^https?$/u,
  /^@career-simulator\/db(?:\/|$)/u,
  /^@career-simulator\/scoring(?:\/|$)/u,
  /^(?:@fastify\/|fastify$)/u,
  /^(?:@prisma\/|prisma$)/u,
  /^drizzle-orm(?:\/|$)/u,
  /^pg(?:\/|$)/u,
] as const;

const listTypeScriptFiles = async (directory: string): Promise<readonly string[]> => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listTypeScriptFiles(path);
      }

      if (extname(entry.name) === ".ts" && !entry.name.endsWith(".test.ts")) {
        return [path];
      }

      return [];
    }),
  );

  return nestedFiles.flat();
};

const extractImportSpecifiers = (source: string): readonly string[] => {
  const staticImports = source.matchAll(
    /\b(?:import|export)\s+(?:type\s+)?(?:[^"'()]*?\s+from\s+)?["']([^"']+)["']/gu,
  );
  const dynamicImports = source.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/gu);

  return [...staticImports, ...dynamicImports]
    .map((match) => match[1])
    .filter((specifier): specifier is string => specifier !== undefined);
};

describe("engine dependency boundary", () => {
  it("does not import UI, HTTP, DB, frameworks, or scoring", async () => {
    const files = await listTypeScriptFiles(SOURCE_ROOT);
    const violations: string[] = [];

    for (const file of files) {
      const source = await readFile(file, "utf8");

      for (const specifier of extractImportSpecifiers(source)) {
        if (FORBIDDEN_IMPORTS.some((pattern) => pattern.test(specifier))) {
          violations.push(`${relative(SOURCE_ROOT, file)} -> ${specifier}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
