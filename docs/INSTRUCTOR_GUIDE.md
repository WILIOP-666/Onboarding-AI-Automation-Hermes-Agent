# Instructor guide

## Before the session

1. Ask participants to install Hermes and Git locally.
2. Confirm everyone has the practice repository cloned and starts from a known working tree.
3. Open `/presentation` on the projector and `/instructor` on the facilitator device.
4. Use the instructor reset only when you want a clean demo state; it clears this browser's name, progress, slide, XP, and hints after confirmation.
5. Mark the segment you are facilitating with its `MARK CURRENT` button; the choice is saved on this browser.

## Two-hour facilitation map

| Time        | Segment             | Facilitation cue                                                                |
| ----------- | ------------------- | ------------------------------------------------------------------------------- |
| 00:00–00:10 | Opening             | Ask which repetitive engineering work they would delegate.                      |
| 00:10–00:25 | AI Automation 101   | Walk from trigger to validation; identify a human checkpoint.                   |
| 00:25–00:40 | Hermes Agent        | Show the local working directory, Git status, and a reviewable diff.            |
| 00:40–00:55 | Live demo           | Narrate inspection, reproduction, root cause, minimal fix, and focused test.    |
| 00:55–01:05 | Setup / short break | Help participants check paths and preserve existing work.                       |
| 01:05–01:30 | Hands-on playground | Facilitate four missions; ask learners to cite evidence and test results.       |
| 01:30–01:50 | Final mission       | Let learners investigate independently; coach the workflow rather than the fix. |
| 01:50–02:00 | Review + Q&A        | Ask what they will inspect before their next agent task.                        |

## Learning outcomes

Participants should be able to explore an unfamiliar repository, explain an agent task clearly, reproduce a reported issue, review a generated diff, and use tests as evidence. The target is level 4 autonomy: independent investigation followed by human review.

## Common mistakes to coach

- “Fix everything” gives an agent no useful boundary.
- Accepting the first answer skips investigation.
- Skipping reproduction makes root-cause claims weak.
- Skipping tests removes a key source of evidence.
- Unrelated refactors make review harder.
- A bug report may describe a symptom rather than the cause.
- A clean summary does not substitute for reading the diff.

## Discussion questions

- Which facts did Hermes observe, and which did it assume?
- What evidence would change your mind about this diagnosis?
- Which behavior should remain invariant during the change?
- What risk remains even after tests pass?

## Presentation controls

Use `←` and `→` to navigate the eight slides. A facilitator cue can be revealed below each slide. The complete timeline and keyboard reminder are also visible in the facilitator dashboard.
