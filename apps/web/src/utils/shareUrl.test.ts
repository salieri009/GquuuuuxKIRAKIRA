import { describe, expect, it } from "vitest";
import { parseShareUrl } from "./shareUrl";

describe("parseShareUrl", () => {
  it("parses valid share query", () => {
    const params = encodeURIComponent(JSON.stringify({ particleCount: 500 }));
    const result = parseShareUrl(`?effect=gn-particles&params=${params}`);

    expect(result).toEqual({
      effectId: "gn-particles",
      params: { particleCount: 500 },
    });
  });

  it("rejects invalid effect id", () => {
    expect(parseShareUrl("?effect=../../etc&params=%7B%7D")).toBeNull();
  });

  it("rejects malformed JSON params", () => {
    expect(parseShareUrl("?effect=gn-particles&params=not-json")).toBeNull();
  });

  it("strips dangerous param keys", () => {
    const params = encodeURIComponent(
      JSON.stringify({ __proto__: { x: 1 }, speed: 2 }),
    );
    const result = parseShareUrl(`?effect=gn-particles&params=${params}`);
    expect(result?.params).toEqual({ speed: 2 });
  });

  it("rejects nested param values", () => {
    const params = encodeURIComponent(
      JSON.stringify({ speed: 2, nested: { a: 1 } }),
    );
    const result = parseShareUrl(`?effect=gn-particles&params=${params}`);
    expect(result?.params).toEqual({ speed: 2 });
  });

  it("rejects oversized params payload", () => {
    const huge = encodeURIComponent(
      JSON.stringify({ speed: "x".repeat(9000) }),
    );
    expect(parseShareUrl(`?effect=gn-particles&params=${huge}`)).toBeNull();
  });
});
