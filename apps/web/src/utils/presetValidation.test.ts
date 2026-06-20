import { describe, expect, it } from "vitest";
import { parsePresetList, validatePreset } from "./presetValidation";

describe("validatePreset", () => {
  const valid = {
    id: "preset-1",
    name: "Test",
    effectId: "gn-particles",
    params: { particleCount: 100 },
    createdAt: "2026-06-19T00:00:00.000Z",
  };

  it("accepts a valid preset", () => {
    expect(validatePreset(valid)).toEqual(valid);
  });

  it("rejects invalid effect id", () => {
    expect(validatePreset({ ...valid, effectId: "../evil" })).toBeNull();
  });

  it("strips dangerous param keys", () => {
    const result = validatePreset({
      ...valid,
      params: { particleCount: 1, constructor: {} },
    });
    expect(result?.params).toEqual({ particleCount: 1 });
  });

  it("strips non-primitive param values", () => {
    const result = validatePreset({
      ...valid,
      params: { particleCount: 1, nested: { evil: true } },
    });
    expect(result?.params).toEqual({ particleCount: 1 });
  });

  it("rejects non-object params", () => {
    expect(validatePreset({ ...valid, params: "bad" })).toBeNull();
  });
});

describe("parsePresetList", () => {
  it("filters invalid entries", () => {
    const list = parsePresetList([
      {
        id: "preset-1",
        name: "OK",
        effectId: "gn-particles",
        params: {},
        createdAt: "2026-06-19T00:00:00.000Z",
      },
      { id: "", name: "bad" },
    ]);

    expect(list).toHaveLength(1);
    expect(list[0].name).toBe("OK");
  });

  it("returns empty array for non-array input", () => {
    expect(parsePresetList({})).toEqual([]);
  });
});
