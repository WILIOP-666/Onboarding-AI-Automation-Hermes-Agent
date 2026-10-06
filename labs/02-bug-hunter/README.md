# 02 · Bug Hunter

**Objective:** Investigate inconsistent email normalization. Estimated time: 15 minutes.

## Setup

Run `pnpm install` at the repository root. Verify the starter with `pnpm exec vitest run labs/02-bug-hunter`.

## Task

Registration uses a normalized key to check uniqueness but stores the original input. Inspect, reproduce, explain the root cause, and make the smallest safe fix. Preserve display behavior if you need it, but store and compare one canonical identity. Add regression coverage for whitespace and casing variants.

## Seeded behavior

The test named `documents the seeded casing bug` intentionally passes while asserting the faulty starter behavior: when a mixed-case address is registered first, a lowercase variant is accepted too. Change the implementation and replace that expectation with a regression assertion proving variants collide.

## Verify

Run `pnpm exec vitest run labs/02-bug-hunter` after you update the test to the corrected contract.
