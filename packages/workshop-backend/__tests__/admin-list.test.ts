import { describe, expect, it } from "vitest";
import { isListedAdmin } from "../src/admin-list.js";

describe("isListedAdmin", () => {
  it("matches an Access email whose case differs from the list", () => {
    expect(isListedAdmin(["jesse.skawinski@example.com"], "Jesse.Skawinski@example.com"))
        .toBe(true);
  });

  it("rejects users who are not listed", () => {
    expect(isListedAdmin(["admin@example.com"], "someone@example.com")).toBe(false);
  });

  it("accepts ADMINS as a JSON string", () => {
    expect(isListedAdmin(JSON.stringify(["Admin@Example.com"]), "admin@example.com")).toBe(true);
  });

  it("rejects an ADMINS value that is not an array", () => {
    expect(() => isListedAdmin({ admin: "admin@example.com" }, "admin@example.com"))
        .toThrow(TypeError);
  });
});
