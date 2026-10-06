import { describe, expect, it } from "vitest";
import { searchCatalogue } from "./src/catalogue";

describe("read-only catalogue exploration", () => {
  it("matches title and category without mutating the source list", () => {
    expect(searchCatalogue("  EXPLORE ").map((entry) => entry.id)).toEqual([
      "inspect",
    ]);
    expect(searchCatalogue("verify").map((entry) => entry.id)).toEqual([
      "verify",
    ]);
  });
  it("returns a copy for an empty search", () => {
    const first = searchCatalogue("");
    first.pop();
    expect(searchCatalogue("")).toHaveLength(3);
  });
});
