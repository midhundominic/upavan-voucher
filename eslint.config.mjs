import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // Native images retain blob URLs, transparency, and exact export dimensions.
  { rules: { "@next/next/no-img-element": "off" } },
  globalIgnores([".next/**", "out/**", "next-env.d.ts", "test-results/**", "playwright-report/**"]),
]);
