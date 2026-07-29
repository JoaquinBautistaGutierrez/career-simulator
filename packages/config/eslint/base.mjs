import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const typeScriptFiles = ["**/*.ts", "**/*.tsx"];
const javaScriptFiles = ["**/*.js", "**/*.cjs", "**/*.mjs"];

const typedRules = tseslint.configs.strictTypeChecked.map((config) => ({
  ...config,
  files: typeScriptFiles,
}));

export default tseslint.config(
  {
    ignores: ["**/coverage/**", "**/dist/**", "**/node_modules/**", "**/.turbo/**"],
  },
  {
    ...eslint.configs.recommended,
    files: javaScriptFiles,
    languageOptions: {
      globals: globals.node,
    },
  },
  ...typedRules,
  {
    files: typeScriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
    },
  },
);
