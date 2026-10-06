# Vercel deployment

## Deploy from GitHub

1. Import `WILIOP-666/Onboarding-AI-Automation-Hermes-Agent` in the Vercel dashboard.
2. Select the Next.js framework preset and the repository root as the project root.
3. Keep the default install command (`pnpm install`) and build command (`pnpm build`).
4. No environment variables, database, or runtime secrets are needed.
5. Deploy and verify `/`, `/presentation`, `/missions/02-bug-hunter`, `/instructor`, and `/completion` on the preview URL, including a hard refresh on nested routes.

## Runtime model

The application only serves learning content and UI. It does not start Hermes, execute learner code, run a terminal, or depend on writable server storage. Progress is stored in browser localStorage and remains on the participant's device.

## Local release checks

Before deployment, run `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm labs:test`, `pnpm test:e2e`, `pnpm build`, and `pnpm format:check`. The E2E audit checks key WCAG A/AA rules, mission/presentation/reset flows, route refresh, and overflow at desktop, tablet, and mobile sizes.
