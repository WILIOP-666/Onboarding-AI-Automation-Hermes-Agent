# Capability map

| Capability       | Scope                                                              | Depends on       | Status       |
| ---------------- | ------------------------------------------------------------------ | ---------------- | ------------ |
| core-shell       | Responsive navigation, accessible shared layout, route metadata    | —                | Implementing |
| presentation     | Eight keyboard-operable teaching slides and session timing         | core-shell       | Implementing |
| learning-content | Practical AI automation and agent learning pages                   | core-shell       | Implementing |
| hermes-guide     | Local setup, workflow, and recovery guidance                       | learning-content | Implementing |
| challenge-engine | Five guided missions, progressive hints, prompt copy, lab files    | learning-content | Implementing |
| progress-system  | Versioned validated local state, editable learner name, reset flow | core-shell       | Implementing |
| gamification     | Deterministic XP, five levels, completion tracking                 | progress-system  | Implementing |
| instructor-mode  | Two-hour agenda, facilitation cues, reset, shortcuts               | presentation     | Implementing |
| lab-repository   | Five standalone runnable TypeScript challenge packages             | challenge-engine | Implementing |
| testing          | Domain unit tests, app build/type/lint checks, lab tests           | all capabilities | Implementing |
| deployment       | Vercel-ready static/client architecture and deployment guide       | core-shell       | Implementing |

## Dependency order

1. Shell and product specification.
2. Content and interactive presentation.
3. Progress model and mission challenge engine.
4. Runnable labs and documentation.
5. Automated verification, responsive/accessibility audit, release readiness.
