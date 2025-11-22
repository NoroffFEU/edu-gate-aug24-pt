import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  // ESLint recommended base rules (for core JavaScript)
  js.configs.recommended,

  // Combined React and Custom Project Rules Block
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],

    // Explicitly define plugins as an object, as required by Flat Config.
    plugins: {
      react: pluginReact,
    },

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    // Apply React recommended rules and project custom rules
    rules: {
      // Inherit rules from React Recommended (manually extracted)
      ...pluginReact.configs.recommended.rules,

      // No console.log in the code
      "no-console": ["error", { allow: ["warn", "error"] }],

      // Project Code Quality Rules (Carried over from original .eslintrc)
      "init-declarations": ["error", "always"],
      "no-label-var": "error",
      "no-undef": "error",
      eqeqeq: ["error", "always"],

      // Override default React rules
      "react/prop-types": "off",
      "react/jsx-uses-react": "error", // Safe guard for older React versions
      "react/jsx-uses-vars": "error",
    },

    settings: {
      react: {
        version: "18.0", // Fixed version to avoid the "detect" warning
      },
    },
  },

  // 3. Prettier Integration (always Last)
  pluginPrettierRecommended,
];
