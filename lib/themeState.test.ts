import { describe, expect, it } from "vitest";
import { themeStatuses } from "./themeState";

const fake = (themes: string[]) => ({ meta: { themes } });
const DECK = [fake(["a"]), fake(["b", "c"]), fake([]), fake(["a", "d"])];

describe("themeStatuses", () => {
  it("marks the current slide's themes as current", () => {
    expect(themeStatuses(DECK, 1)).toEqual({ a: "touched", b: "current", c: "current" });
  });
  it("marks earlier slides' themes as touched", () => {
    expect(themeStatuses(DECK, 2)).toEqual({ a: "touched", b: "touched", c: "touched" });
  });
  it("re-touched themes become current again", () => {
    expect(themeStatuses(DECK, 3)).toEqual({
      a: "current",
      b: "touched",
      c: "touched",
      d: "current",
    });
  });
  it("ignores slides after the current index (jumping back via overview)", () => {
    expect(themeStatuses(DECK, 0)).toEqual({ a: "current" });
  });
});
