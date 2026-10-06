import { describe, expect, it } from "vitest";
import { buildOrder } from "./src/order";

describe("order contract (preserve these assertions during refactoring)", () => {
  it("calculates totals and caps a member discount", () => {
    expect(
      buildOrder([{ sku: "A", unitPriceCents: 10000, quantity: 2 }], true),
    ).toEqual({ totalCents: 18500, auditLabel: "1-line:member:18500" });
  });
  it("keeps guest totals and line count in the audit label", () => {
    expect(
      buildOrder(
        [
          { sku: "A", unitPriceCents: 750, quantity: 2 },
          { sku: "B", unitPriceCents: 200, quantity: 1 },
        ],
        false,
      ),
    ).toEqual({ totalCents: 1700, auditLabel: "2-line:guest:1700" });
  });
  it("preserves validation order and messages", () => {
    expect(() =>
      buildOrder([{ sku: " ", unitPriceCents: -1, quantity: 0 }], false),
    ).toThrow("Each line needs a SKU");
    expect(() => buildOrder([], false)).toThrow(
      "An order needs at least one line",
    );
  });
});
