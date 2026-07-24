import { describe, expect, it } from "vitest";
import { advance, clampPosition, retreat } from "./navigation";

// Deck of 3 slides with 3, 1 and 2 steps respectively.
const COUNTS = [3, 1, 2];

describe("advance", () => {
  it("advances a step within a slide", () => {
    expect(advance({ slide: 0, step: 0 }, COUNTS)).toEqual({ slide: 0, step: 1 });
  });
  it("moves to the next slide at step 0 after the final step", () => {
    expect(advance({ slide: 0, step: 2 }, COUNTS)).toEqual({ slide: 1, step: 0 });
  });
  it("crosses a single-step slide in one press", () => {
    expect(advance({ slide: 1, step: 0 }, COUNTS)).toEqual({ slide: 2, step: 0 });
  });
  it("returns null at the very end of the deck", () => {
    expect(advance({ slide: 2, step: 1 }, COUNTS)).toBeNull();
  });
});

describe("retreat", () => {
  it("retreats a step within a slide", () => {
    expect(retreat({ slide: 0, step: 2 }, COUNTS)).toEqual({ slide: 0, step: 1 });
  });
  it("lands on the PREVIOUS slide's FINAL step from step 0", () => {
    expect(retreat({ slide: 2, step: 0 }, COUNTS)).toEqual({ slide: 1, step: 0 });
    expect(retreat({ slide: 1, step: 0 }, COUNTS)).toEqual({ slide: 0, step: 2 });
  });
  it("returns null at the very start of the deck", () => {
    expect(retreat({ slide: 0, step: 0 }, COUNTS)).toBeNull();
  });
});

describe("single-slide deck", () => {
  it("returns null in both directions on a one-slide deck", () => {
    expect(advance({ slide: 0, step: 0 }, [1])).toBeNull();
    expect(retreat({ slide: 0, step: 0 }, [1])).toBeNull();
  });
  it("treats a (invalid) zero-step slide as one step instead of skipping it silently", () => {
    expect(advance({ slide: 0, step: 0 }, [0, 2])).toEqual({ slide: 1, step: 0 });
    expect(retreat({ slide: 1, step: 0 }, [0, 2])).toEqual({ slide: 0, step: 0 });
  });
});

describe("clampPosition", () => {
  it("clamps slide and step into range", () => {
    expect(clampPosition({ slide: 99, step: 99 }, COUNTS)).toEqual({ slide: 2, step: 1 });
    expect(clampPosition({ slide: -1, step: -5 }, COUNTS)).toEqual({ slide: 0, step: 0 });
  });
  it("clamps step against the clamped slide's count", () => {
    expect(clampPosition({ slide: 1, step: 7 }, COUNTS)).toEqual({ slide: 1, step: 0 });
  });
});
