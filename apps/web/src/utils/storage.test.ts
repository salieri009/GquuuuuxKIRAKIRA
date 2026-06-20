import { describe, expect, it } from "vitest";
import { loadFavoritesFromStorage } from "./storage";

describe("loadFavoritesFromStorage", () => {
  it("returns empty array when storage is missing", () => {
    localStorage.removeItem("kirakira-favorites");
    expect(loadFavoritesFromStorage()).toEqual([]);
  });

  it("filters invalid favorite ids", () => {
    localStorage.setItem(
      "kirakira-favorites",
      JSON.stringify(["gn-particles", "../bad", 42]),
    );
    expect(loadFavoritesFromStorage()).toEqual(["gn-particles"]);
  });

  it("returns empty array for corrupt JSON", () => {
    localStorage.setItem("kirakira-favorites", "{not json");
    expect(loadFavoritesFromStorage()).toEqual([]);
  });
});
