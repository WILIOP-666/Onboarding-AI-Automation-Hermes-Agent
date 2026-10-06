# AI Agent Playground

**From prompt to production with Hermes Agent.** A hands-on, two-hour onboarding experience for software engineering interns. It replaces a slide deck with an interactive presentation, practical reference guides, five runnable local labs, and browser-local progress tracking.

> Hermes runs on each participant's own computer. This web app is a learning and orchestration interface. It never runs participant commands, code, or Hermes sessions on the server.

## What participants learn

- AI automation fundamentals and the difference between chat and a tool-using agent.
- How to set up a local Hermes session and inspect the work it changes.
- How to write tasks with context, objectives, constraints, success criteria, and verification.
- How to investigate bugs, refactor safely, and handle duplicate operations.
- How to verify AI-generated work with tests, diff review, and human judgment.

## Requirements

- Node.js 20.9 or newer
- pnpm 10 or newer
- Git
- Hermes Agent installed locally by the participant (the app does not install or execute it)

## Install and run

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The session requires no account, database, or environment variables. Training progress is stored in this browser only. A participant name is optional and never leaves local storage.

## Quality commands

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm labs:test
pnpm test:e2e
pnpm build
pnpm format:check
```

Each lab README includes its focused test command. The starter tests for missions 02, 04, and the final mission document the seeded defect. During the exercise, change those tests to assert the corrected behavior after implementing a fix. The full starter lab suite passes while preserving the intentional challenge bugs.

## Training routes

| Route                         | Purpose                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `/`                           | Welcome, learning outcomes, timeline, optional participant name |
| `/presentation`               | Eight projection-friendly slides; use ← and → to navigate       |
| `/learn`                      | Automation loop, chatbot/agent comparison, task builder         |
| `/hermes`                     | Local workflow, tools, and troubleshooting                      |
| `/playground`                 | XP, level, mission progress, and completion status              |
| `/missions`                   | Mission sequence                                                |
| `/missions/01-code-detective` | Read-only repository exploration                                |
| `/missions/02-bug-hunter`     | Email identity normalization                                    |
| `/missions/03-safe-refactor`  | Behavior-preserving refactoring                                 |
| `/missions/04-agent-workflow` | Idempotent request handling                                     |
| `/final-mission`              | Country/state/city cascade challenge                            |
| `/cheatsheet`                 | Copyable explore/debug/implement/verify prompts                 |
| `/instructor`                 | Session agenda, facilitator cues, demo reset                    |
| `/completion`                 | Skills summary, level, and restart action                       |

## Session format

| Time        | Segment             | Learning activity                                |
| ----------- | ------------------- | ------------------------------------------------ |
| 00:00–00:10 | Opening             | Why AI agents matter                             |
| 00:10–00:25 | AI Automation 101   | Prompt → context → tools → action → verification |
| 00:25–00:40 | Hermes Agent        | Local files, terminal, Git, skills, memory       |
| 00:40–00:55 | Live demo           | Repository → bug → root cause → fix → test       |
| 00:55–01:05 | Setup / break       | Confirm local workspace                          |
| 01:05–01:30 | Hands-on playground | Four guided missions                             |
| 01:30–01:50 | Final mission       | Location cascade capstone                        |
| 01:50–02:00 | Review + Q&A        | Recap evidence and next steps                    |

## Labs

The five standalone exercise packages live under [`labs/`](labs/README.md). Each contains a README, real TypeScript source, and runnable tests. Challenges run locally; this app does not execute them.

## Instructor and participant guides

- [Instructor guide](docs/INSTRUCTOR_GUIDE.md)
- [Participant guide](docs/PARTICIPANT_GUIDE.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Vercel deployment](docs/VERCEL_DEPLOYMENT.md)

## Project structure

```text
app/                 Next.js App Router entry, layout, and visual system
components/          Shared shell and interactive training experience
lib/                 Versioned progress model and deterministic XP rules
labs/                Five runnable TypeScript learning challenges
docs/                Instructor, participant, architecture, and deployment guides
tasks/               Delivery plan and implementation checklist
CAPABILITY_MAP.md    Capability dependencies and status
SPEC.md              Product scope and implementation contract
```

## Progress storage

The app uses one versioned record (`hermes-playground-progress`) in localStorage. It contains an optional display name, completed mission IDs, derived XP, current slide, instructor-selected session segment, and revealed-hint counters. Runtime parsing validates the schema, deduplicates completion, migrates the first schema version, and falls back safely for malformed or unknown data. Mission completion is deterministic and duplicate XP awards are prevented. Instructor reset asks for confirmation.

## Security model

- No server-side Hermes process, terminal API, command runner, or code execution.
- No credentials, authentication, database, or sensitive participant data.
- User-provided names are plain text and are never rendered as HTML.
- External links open with `rel="noreferrer"`.
- Local state is schema-validated before use.

## Deploy to Vercel

Import `WILIOP-666/Onboarding-AI-Automation-Hermes-Agent` in Vercel and use the Next.js preset. No environment variables or database are required. Vercel builds with `pnpm install` and `pnpm build`. See [deployment notes](docs/VERCEL_DEPLOYMENT.md).

## Future extension

V2 could add opt-in cohort persistence, instructor-managed sessions, and completion certificates. Those features are intentionally outside the anonymous local-first V1.
