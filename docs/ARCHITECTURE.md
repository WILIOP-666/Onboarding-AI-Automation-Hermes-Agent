# Architecture

## Runtime boundary

The app is a Next.js App Router static-capable client learning experience. Hermes, Git, terminals, and challenge code remain on each participant's machine. There are no route handlers, server actions, shell APIs, participant-code execution services, database connections, or required environment variables.

## Modules

- `app/layout.tsx` owns metadata and the document shell; `app/[[...slug]]/page.tsx` validates the supported route set.
- `components/experience.tsx` composes the responsive navigation, learning pages, presentation controls, mission content, clipboard actions, and instructor reset.
- `lib/progress.ts` owns the single versioned localStorage schema, migration/validation, XP derivation, level mapping, and idempotent completion transition.
- `labs/` contains five separate TypeScript exercises and tests; they are independent of app runtime.

## State

Progress is local-first and schema versioned. XP is derived from unique completed IDs rather than accumulated from click events. Malformed or unknown-version state returns to a fresh session; schema version 0 migrates the participant name and known completed mission IDs. The instructor-selected current segment is stored in the same validated state record.

## Extension seam

A future persistence adapter can replace the local storage boundary without changing mission definitions or XP rules. Authentication, cohort state, and certificates are not part of V1.
