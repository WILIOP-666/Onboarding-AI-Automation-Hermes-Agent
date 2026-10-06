# Participant guide

## Your workspace

Hermes runs on your computer. Keep the practice repository in a local working directory, open the terminal there, and check `git status` before changing code. The training site does not execute commands or store your source code.

## A reliable task prompt

Give Hermes the relevant context, a concrete objective, constraints, success criteria, and how to verify the result. Start with inspection and ask it to explain its plan before edits when the task is unfamiliar or risky.

## The engineering loop

1. Inspect the repository and its working tree.
2. Understand the relevant data and control flow.
3. Plan a small, reviewable change.
4. Implement within the task constraints.
5. Run focused tests, then any broader required checks.
6. Audit the diff and relevant edge cases.
7. Verify the outcome and report what remains uncertain.

## If Hermes goes off track

Stop the current direction, inspect the diff, restate the objective, and narrow the scope. Preserve work you did not ask it to change. Restore only edits you have identified as incorrect; do not use broad destructive reset or clean commands as a default recovery.

## Your progress

The optional display name, XP, completed missions, slide position, and revealed hints stay in local browser storage. No registration is required. Progress does not sync across devices.
