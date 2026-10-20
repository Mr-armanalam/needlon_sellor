import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Production rule: `any` is banned in this codebase — use the actual type,
      // or `unknown` with narrowing at system boundaries.
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
];

export default eslintConfig;
