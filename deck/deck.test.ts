import { readdirSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { deck } from "./deck";
import { THEMES } from "./themes";

describe("deck registry", () => {
  it("has at least one slide", () => {
    expect(deck.length).toBeGreaterThan(0);
  });
  it("has unique kebab-case ids", () => {
    const ids = deck.map((s) => s.meta.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it("declares at least 1 step per slide", () => {
    for (const s of deck) expect(s.meta.steps).toBeGreaterThanOrEqual(1);
  });
  it("uses kebab-case for meta.group when present", () => {
    for (const s of deck) {
      if (s.meta.group !== undefined) {
        expect(s.meta.group, `bad group on "${s.meta.id}"`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      }
    }
  });
  it("references only known theme ids", () => {
    const known = new Set(THEMES.map((t) => t.id));
    for (const s of deck) for (const t of s.meta.themes) expect(known).toContain(t);
  });
  it("exports a component for every slide", () => {
    for (const s of deck) expect(typeof s.Component).toBe("function");
  });
  it("meta.id matches its slides/ folder name", () => {
    const folders = readdirSync(path.resolve(process.cwd(), "slides"));
    const folderFor = (id: string) => (id === "template" ? "_template" : id);
    for (const s of deck) {
      expect(folders, `no slides/ folder for id "${s.meta.id}"`).toContain(folderFor(s.meta.id));
    }
  });
  it("does not include the template slide", () => {
    expect(deck.some((s) => s.meta.id === "template")).toBe(false);
  });
});
