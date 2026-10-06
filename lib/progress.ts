import { z } from "zod";

export const STORAGE_KEY = "hermes-playground-progress";
export const CURRENT_VERSION = 1;
export const missionIds = [
  "01-code-detective",
  "02-bug-hunter",
  "03-safe-refactor",
  "04-agent-workflow",
  "final-mission",
] as const;
export type MissionId = (typeof missionIds)[number];

const ProgressSchema = z
  .object({
    version: z.literal(CURRENT_VERSION),
    name: z.string().trim().max(32).default(""),
    completed: z.array(z.enum(missionIds)).max(missionIds.length).default([]),
    xp: z.number().int().min(0).max(10000).default(0),
    slide: z.number().int().min(0).max(7).default(0),
    currentSegment: z.number().int().min(0).max(7).default(0),
    hints: z.array(z.string()).max(100).default([]),
  })
  .strict();

export type Progress = z.infer<typeof ProgressSchema>;
export const initialProgress = (): Progress => ({
  version: CURRENT_VERSION,
  name: "",
  completed: [],
  xp: 0,
  slide: 0,
  currentSegment: 0,
  hints: [],
});

export function parseProgress(raw: string | null): Progress {
  if (!raw) return initialProgress();
  try {
    const value: unknown = JSON.parse(raw);
    const parsed = ProgressSchema.safeParse(value);
    if (parsed.success)
      return {
        ...parsed.data,
        completed: [...new Set(parsed.data.completed)],
        hints: [...new Set(parsed.data.hints)],
      };
    if (
      typeof value === "object" &&
      value !== null &&
      "version" in value &&
      value.version === 0
    ) {
      const old = value as { name?: unknown; completed?: unknown };
      const migrated = ProgressSchema.parse({
        ...initialProgress(),
        name: typeof old.name === "string" ? old.name : "",
        completed: Array.isArray(old.completed) ? old.completed : [],
      });
      return {
        ...migrated,
        completed: [...new Set(migrated.completed)],
        xp: xpForCompletion([...new Set(migrated.completed)]),
      };
    }
  } catch {
    /* malformed browser state safely returns to a clean session */
  }
  return initialProgress();
}

export function xpForCompletion(completed: readonly MissionId[]): number {
  return completed.reduce(
    (total, id) => total + (id === "final-mission" ? 200 : 100),
    0,
  );
}

export function levelForXp(xp: number): {
  level: number;
  title: string;
  next: number | null;
} {
  const levels = [
    { threshold: 0, title: "Explorer" },
    { threshold: 100, title: "Prompter" },
    { threshold: 250, title: "Debugger" },
    { threshold: 400, title: "Builder" },
    { threshold: 600, title: "Agent Operator" },
  ];
  const index = levels.reduce(
    (best, level, i) => (xp >= level.threshold ? i : best),
    0,
  );
  return {
    level: index + 1,
    title: levels[index].title,
    next: levels[index + 1]?.threshold ?? null,
  };
}

export function completeMission(state: Progress, mission: MissionId): Progress {
  if (state.completed.includes(mission)) return state;
  const completed = [...state.completed, mission];
  return { ...state, completed, xp: xpForCompletion(completed) };
}
