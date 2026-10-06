import { afterEach, describe, expect, it } from "vitest";
import { allSubmissions, resetSubmissions, submit } from "./src/submissions";

afterEach(resetSubmissions);

describe("repeated create investigation", () => {
  it("documents duplicate records from one repeated operation", () => {
    submit("request-123", "new profile");
    submit("request-123", "new profile");
    expect(allSubmissions()).toHaveLength(2);
  });
  it("rejects requests without an operation identity", () => {
    expect(() => submit(" ", "new profile")).toThrow(
      "An operation key is required",
    );
  });
});
