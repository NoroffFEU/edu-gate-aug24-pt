import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
    },
    extends: ["js/recommended", pluginReact.configs.flat.recommended, prettier],
  },
]);
