import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist", "node_modules", "*.db"]),
  {
    files: ["src/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },
  {
    // Config de raíz (drizzle.config.ts, eslint.config.js): fuera de rootDir/include del
    // tsconfig del proyecto (solo "src"), así que se lintan sin parsing type-aware.
    files: ["*.ts", "*.js"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["src/db/migrate.ts", "src/db/seeds/**/*.ts"],
    rules: {
      "no-console": "off"
    }
  }
]);
