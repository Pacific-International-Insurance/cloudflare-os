import { describe, expect, it } from "vitest";
import { resolveSpendTier } from "../src/spend-tiers.js";

function env(tiers?: unknown): Cloudflare.Env {
  return (tiers === undefined ? {} : { TIERS: tiers }) as Cloudflare.Env;
}

const TIERS = { basic: ["basic@example.com"], advanced: ["Advanced@Example.com"] };

describe("resolveSpendTier", () => {
  it("is inactive when TIERS is not configured", () => {
    expect(resolveSpendTier(env(), "anyone@example.com")).toBeUndefined();
  });

  it("resolves listed users, ignoring case", () => {
    expect(resolveSpendTier(env(TIERS), "BASIC@example.com")).toBe("basic");
    expect(resolveSpendTier(env(TIERS), "advanced@example.com")).toBe("advanced");
  });

  it("makes unlisted users viewers", () => {
    expect(resolveSpendTier(env(TIERS), "new@example.com")).toBe("viewer");
  });

  it("puts a user listed in both tiers in advanced", () => {
    let both = { basic: ["both@example.com"], advanced: ["both@example.com"] };
    expect(resolveSpendTier(env(both), "both@example.com")).toBe("advanced");
  });

  it("accepts TIERS as a JSON string", () => {
    expect(resolveSpendTier(env(JSON.stringify(TIERS)), "basic@example.com")).toBe("basic");
  });

  it("rejects malformed TIERS", () => {
    expect(() => resolveSpendTier(env(["basic@example.com"]), "x@example.com")).toThrow(TypeError);
    expect(() => resolveSpendTier(env({ basic: "basic@example.com" }), "x@example.com"))
        .toThrow(TypeError);
  });
});
