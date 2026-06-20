import { describe, it, expect, vi, beforeEach } from "vitest";
import { EffectLoader } from "./loader";

describe("EffectLoader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("모듈 검증", () => {
    it("init 메서드가 없으면 에러", async () => {
      const invalidModule = {
        default: {
          update: vi.fn(),
          dispose: vi.fn(),
        },
      };

      vi.doMock("/effects/invalid/index.js", () => invalidModule);

      await expect(
        EffectLoader.loadEffect("invalid", "/effects"),
      ).rejects.toThrow("Invalid effect module");
    });

    it("update 메서드가 없으면 에러", async () => {
      const invalidModule = {
        default: {
          init: vi.fn(),
          dispose: vi.fn(),
        },
      };

      vi.doMock("/effects/invalid/index.js", () => invalidModule);

      await expect(
        EffectLoader.loadEffect("invalid", "/effects"),
      ).rejects.toThrow("Invalid effect module");
    });
  });

  describe("listEffects", () => {
    it("manifest.json 로드 성공", async () => {
      const mockManifest = {
        effects: [
          { name: "Effect 1", description: "Test 1" },
          { name: "Effect 2", description: "Test 2" },
        ],
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockManifest,
      });

      const result = await EffectLoader.listEffects("/effects");
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Effect 1");
    });

    it("manifest.json 로드 실패 시 빈 배열 반환", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Failed to fetch"));

      const result = await EffectLoader.listEffects("/effects");
      expect(result).toEqual([]);
    });

    it("404 에러 시 빈 배열 반환", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });

      const result = await EffectLoader.listEffects("/effects");
      expect(result).toEqual([]);
    });
  });

  describe("에러 처리", () => {
    it("모든 경로 실패 시 상세한 에러 메시지", async () => {
      // 모든 import 실패하도록 모킹
      vi.doMock("/effects/fail/index.js", () => {
        throw new Error("Module not found");
      });

      await expect(EffectLoader.loadEffect("fail", "/effects")).rejects.toThrow(
        "효과 모듈을 로드할 수 없습니다",
      );
    });
  });
});
