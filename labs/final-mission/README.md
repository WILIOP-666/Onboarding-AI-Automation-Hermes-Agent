# Final mission · Location Cascade

**Objective:** Keep Country → State → City selections valid during fast changes and delayed responses. Estimated time: 20 minutes.

## Setup and verification

From the root, run `pnpm install`, then `pnpm exec vitest run labs/final-mission`.

## Task

Users say profile updates sometimes save the wrong location. Do not assume the bug report identifies the root cause. Inspect `src/location.ts` and the tests. Reproduce stale child state when the country changes, then trace how an older asynchronous response can replace a newer result. Implement the smallest production-safe correction and add tests for both transition invalidation and response ordering.

## Seeded behavior

The starter keeps state and city selections when their parent changes, and it applies async responses in arrival order. Passing starter tests document these two failure modes. Change them to assertions for the corrected contract after fixing the code.
