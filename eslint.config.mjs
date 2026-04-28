import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // NovaFrame-specific ignores:
    "backup_restore_temp/**",
    "test_fixed/**",
    "test_unzip/**",
    "scripts/**",
    "*.zip",
  ]),
  {
    rules: {
      // ── React 19 Experimental Rules (downgraded to warnings) ──
      // These are new React 19 strict rules that flag valid patterns.
      // setMounted(true) hydration guard is valid and common.
      "react-hooks/set-state-in-effect": "warn",
      // Three.js R3F hooks (useTexture, useFrame) trigger false positives
      "react-hooks/rules-of-hooks": "warn",
      // React 19 purity checks — overly strict for canvas/Three.js components
      "react-hooks/purity": "warn",
      // Inner component definitions (valid for R3F scene sub-components)
      "react-hooks/static-components": "warn",
      // Mutation checks — too strict for Three.js Vector3 patterns
      "react-hooks/immutability": "warn",
      // ── Standard Rules ──
      // Allow apostrophes and quotes in JSX text
      "react/no-unescaped-entities": "off",
      // Display name not needed for arrow components
      "react/display-name": "off",
      // The Industrial Noir design uses '//' as a decorative separator in UI text
      "react/jsx-no-comment-textnodes": "off",
    },
  },
]);

export default eslintConfig;
