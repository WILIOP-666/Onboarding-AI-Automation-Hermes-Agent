# 01 · Code Detective

**Objective:** Explain a request path without changing code. Estimated time: 10 minutes.

## Setup

From the repository root, install dependencies with `pnpm install`, then run `pnpm exec vitest run labs/01-code-detective`.

## Task

Do not modify anything. Read `src/catalogue.ts`, then explain the module's purpose, entry point, data flow, validation boundaries, and one technical risk. Cite file paths and distinguish evidence from assumptions. Trace the search operation from its input through filtering and output.

## Expected behavior

The catalogue keeps a private in-memory list, normalizes a search query, filters entries by title or category, and returns a new array. The test verifies the observable search behavior. A useful exploration answer also notices the empty-query behavior and the case-insensitive matching.

## Verify

`pnpm exec vitest run labs/01-code-detective`
