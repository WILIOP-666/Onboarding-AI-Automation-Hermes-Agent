# AI Agent Playground specification

## Product

A no-account, two-hour interactive engineering onboarding for interns learning practical AI automation and Hermes Agent workflows. The web app is the presentation and reference surface; Hermes runs on each learner's own computer. The app never executes participant code or offers remote shell access.

## Experience and routes

Routes: `/`, `/presentation`, `/learn`, `/hermes`, `/playground`, `/missions`, `/missions/01-code-detective`, `/missions/02-bug-hunter`, `/missions/03-safe-refactor`, `/missions/04-agent-workflow`, `/final-mission`, `/cheatsheet`, `/instructor`, `/completion`.

Learners move from automation fundamentals through an eight-slide presentation, Hermes setup and prompting, four guided missions, a less-guided final mission, and a completion summary. All primary actions provide a real outcome.

## State and quality

V1 is anonymous and local-first. One versioned localStorage abstraction validates data, tolerates malformed or old data, deduplicates XP, and requires confirmation before reset. Missions contain real runnable TypeScript labs and tests. UI supports keyboard use, visible focus, reduced motion, and responsive layouts.

## Security and release

No secrets, remote execution, server-side Hermes, participant PII beyond a local display name, or unsafe HTML rendering. App is deployable to Vercel with no database or environment variables. Verification includes typecheck, lint, unit tests, each lab's tests, and a production build; report any browser or deployment checks that cannot be performed.
