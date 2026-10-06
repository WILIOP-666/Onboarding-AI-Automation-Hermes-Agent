# 03 · Safe Refactor

**Objective:** Make a difficult service easier to reason about without changing its contract. Estimated time: 15 minutes.

## Setup and verification

From the root, run `pnpm install`, then `pnpm exec vitest run labs/03-safe-refactor`.

## Task

The service validates order lines, calculates totals, applies a member discount, and produces an audit label. Before editing, list the invariants: validation order, error messages, price arithmetic, discount cap, and audit label. Refactor one responsibility at a time. Keep the original tests unchanged.

## Expected behavior

The starter is intentionally awkward but functional. The tests establish its contract. Do not “fix” behavior by changing expected outputs.
