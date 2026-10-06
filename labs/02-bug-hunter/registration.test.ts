import { afterEach, describe, expect, it } from "vitest";
import { allUsers, register, resetUsers } from "./src/registration";

afterEach(resetUsers);

describe("registration identity investigation", () => {
  it("documents the seeded casing bug before the fix", () => {
    expect(register("John@Example.com").accepted).toBe(true);
    expect(register("john@example.com").accepted).toBe(true);
    expect(allUsers()).toHaveLength(2);
  });
  it("does not mutate the user list when input is empty after trimming", () => {
    expect(register("   ").accepted).toBe(true);
    expect(allUsers()).toHaveLength(1);
  });
});
