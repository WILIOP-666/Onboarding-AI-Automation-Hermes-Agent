# 04 · Agent Workflow

**Objective:** Prevent accidental duplicate records when a request is repeated. Estimated time: 15 minutes.

## Setup and verification

From the root, run `pnpm install`, then `pnpm exec vitest run labs/04-agent-workflow`.

## Task

The create endpoint can receive a retry after a slow response. Follow the request and identify where a stable operation identity can be enforced. A UI-only disabled button does not protect the server from repeated requests. Make duplicate retries safe while keeping distinct operations valid.

## Seeded behavior

One logical create sent twice produces two records. A passing starter test documents this intended failure. Update the test as you implement idempotency. Keep the storage boundary and behavior proportionate to this local exercise.
