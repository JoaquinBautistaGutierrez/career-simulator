import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const WORKSPACE_ROOT = new URL("../", import.meta.url);
const INTERNAL_PREFIX = "@career-simulator/";

const EXPECTED_PRODUCTION_DEPENDENCIES = new Map([
  ["@career-simulator/admin", []],
  ["@career-simulator/api", []],
  ["@career-simulator/api-client", ["@career-simulator/schemas"]],
  ["@career-simulator/config", []],
  ["@career-simulator/content", ["@career-simulator/schemas"]],
  ["@career-simulator/data-football", ["@career-simulator/schemas"]],
  ["@career-simulator/db", ["@career-simulator/domain", "@career-simulator/schemas"]],
  ["@career-simulator/domain", ["@career-simulator/schemas"]],
  [
    "@career-simulator/engine",
    ["@career-simulator/domain", "@career-simulator/probability", "@career-simulator/schemas"],
  ],
  ["@career-simulator/probability", ["@career-simulator/schemas", "@noble/hashes"]],
  ["@career-simulator/schemas", ["zod"]],
  ["@career-simulator/scoring", ["@career-simulator/domain", "@career-simulator/schemas"]],
  ["@career-simulator/telemetry", []],
  ["@career-simulator/testkit", ["@career-simulator/domain", "@career-simulator/schemas"]],
  ["@career-simulator/ui", []],
  ["@career-simulator/web", []],
  ["@career-simulator/worker", []],
]);

const readWorkspaceManifests = async () => {
  const manifests = new Map();

  for (const workspaceDirectory of ["apps", "packages"]) {
    const directoryUrl = new URL(`${workspaceDirectory}/`, WORKSPACE_ROOT);
    const entries = await readdir(directoryUrl, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const manifestUrl = new URL(`${entry.name}/package.json`, directoryUrl);
      const manifest = JSON.parse(await readFile(manifestUrl, "utf8"));

      if (typeof manifest.name !== "string") {
        throw new Error(`Missing package name in ${fileURLToPath(manifestUrl)}`);
      }

      if (manifests.has(manifest.name)) {
        throw new Error(`Duplicate workspace package name: ${manifest.name}`);
      }

      manifests.set(manifest.name, manifest);
    }
  }

  return manifests;
};

const sorted = (values) => [...values].sort((left, right) => left.localeCompare(right));

const validateDeclaredDependencies = (manifests) => {
  const errors = [];

  for (const [packageName, manifest] of manifests) {
    const expected = EXPECTED_PRODUCTION_DEPENDENCIES.get(packageName);

    if (expected === undefined) {
      errors.push(`Package is missing from the dependency policy: ${packageName}`);
      continue;
    }

    const declared = Object.keys(manifest.dependencies ?? {});

    if (JSON.stringify(sorted(declared)) !== JSON.stringify(sorted(expected))) {
      errors.push(
        `${packageName}: expected [${sorted(expected).join(", ")}], found [${sorted(declared).join(", ")}]`,
      );
    }

    for (const dependency of declared) {
      if (dependency.startsWith(INTERNAL_PREFIX) && !manifests.has(dependency)) {
        errors.push(`${packageName}: unknown internal dependency ${dependency}`);
      }
    }
  }

  for (const packageName of EXPECTED_PRODUCTION_DEPENDENCIES.keys()) {
    if (!manifests.has(packageName)) {
      errors.push(`Dependency policy references missing package ${packageName}`);
    }
  }

  return errors;
};

const validateCycles = (manifests) => {
  const errors = [];
  const completed = new Set();
  const active = new Set();

  const visit = (packageName, path) => {
    if (active.has(packageName)) {
      errors.push(`Dependency cycle: ${[...path, packageName].join(" -> ")}`);
      return;
    }

    if (completed.has(packageName)) {
      return;
    }

    active.add(packageName);
    const manifest = manifests.get(packageName);
    const dependencies = Object.keys(manifest?.dependencies ?? {}).filter((dependency) =>
      dependency.startsWith(INTERNAL_PREFIX),
    );

    for (const dependency of dependencies) {
      visit(dependency, [...path, packageName]);
    }

    active.delete(packageName);
    completed.add(packageName);
  };

  for (const packageName of manifests.keys()) {
    visit(packageName, []);
  }

  return errors;
};

const manifests = await readWorkspaceManifests();
const errors = [...validateDeclaredDependencies(manifests), ...validateCycles(manifests)];

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exitCode = 1;
} else {
  console.log(`Dependency policy valid for ${manifests.size} workspace packages.`);
}
