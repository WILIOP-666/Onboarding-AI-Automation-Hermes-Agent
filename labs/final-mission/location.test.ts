import { describe, expect, it } from "vitest";
import {
  applyOptions,
  changeCountry,
  changeState,
  type LocationState,
} from "./src/location";

const seeded: LocationState = {
  country: "US",
  state: "CA",
  city: "Oakland",
  options: ["CA", "NY"],
};

describe("dependent location fields", () => {
  it("documents stale child selections after changing a parent", () => {
    expect(changeCountry(seeded, "JP")).toEqual({
      country: "JP",
      state: "CA",
      city: "Oakland",
      options: ["CA", "NY"],
    });
    expect(changeState(seeded, "NY").city).toBe("Oakland");
  });
  it("documents that async responses currently arrive out of order", () => {
    const newest = applyOptions({ ...seeded, country: "JP" }, "JP", ["Tokyo"]);
    expect(applyOptions(newest, "US", ["California"])).toMatchObject({
      country: "US",
      options: ["California"],
    });
  });
});
