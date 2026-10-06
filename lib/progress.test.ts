import { describe, expect, it } from "vitest";
import {
  completeMission,
  initialProgress,
  levelForXp,
  parseProgress,
  xpForCompletion,
} from "./progress";

describe("progress model", () => {
  it("starts clean and safely handles malformed or unknown versions", () => {
    expect(parseProgress("{broken")).toEqual(initialProgress());
    expect(parseProgress('{"version":42}')).toEqual(initialProgress());
  });
  it("migrates the first unversioned schema and deduplicates completion", () => {
    expect(
      parseProgress(
        '{"version":0,"name":"Ada","completed":["01-code-detective","01-code-detective"]}',
      ).completed,
    ).toEqual(["01-code-detective"]);
  });
  it("awards deterministic XP once per mission", () => {
    const once = completeMission(initialProgress(), "02-bug-hunter");
    expect(once.xp).toBe(100);
    expect(completeMission(once, "02-bug-hunter")).toEqual(once);
    expect(xpForCompletion(["01-code-detective", "final-mission"])).toBe(300);
  });
  it("maps XP to the five defined levels", () => {
    expect(levelForXp(249).title).toBe("Prompter");
    expect(levelForXp(250).title).toBe("Debugger");
    expect(levelForXp(999).level).toBe(5);
  });
});
