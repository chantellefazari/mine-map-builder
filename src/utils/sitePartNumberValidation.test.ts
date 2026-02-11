import { describe, it, expect } from "vitest";
import {
  validateSitePartNumber,
  isValidSitePartNumber,
  parseSitePartNumber,
  getCategoryName,
} from "@/utils/sitePartNumberValidation";

describe("validateSitePartNumber", () => {
  it("accepts valid numeric part numbers", () => {
    expect(validateSitePartNumber("100301").valid).toBe(true);
    expect(validateSitePartNumber("100199").valid).toBe(true);
    expect(validateSitePartNumber("102301").valid).toBe(true);
  });

  it("accepts valid alpha-numeric part numbers", () => {
    expect(validateSitePartNumber("1001A0").valid).toBe(true);
    expect(validateSitePartNumber("1001A9").valid).toBe(true);
    expect(validateSitePartNumber("1005Z9").valid).toBe(true);
    expect(validateSitePartNumber("1004B3").valid).toBe(true);
  });

  it("rejects empty or non-string input", () => {
    const r = validateSitePartNumber("");
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("empty");
  });

  it("rejects wrong length", () => {
    expect(validateSitePartNumber("10031").valid).toBe(false);
    expect(validateSitePartNumber("1003011").valid).toBe(false);
  });

  it("rejects invalid site code", () => {
    const r = validateSitePartNumber("200301");
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("site code");
  });

  it("rejects invalid category code", () => {
    expect(validateSitePartNumber("109901").valid).toBe(false);
    expect(validateSitePartNumber("100001").valid).toBe(false);
  });

  it("rejects sequence 00", () => {
    const r = validateSitePartNumber("100300");
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("00");
  });

  it("rejects excluded letters I, O, Q in strict mode", () => {
    expect(validateSitePartNumber("1001I3", true).valid).toBe(false);
    expect(validateSitePartNumber("1001O5", true).valid).toBe(false);
    expect(validateSitePartNumber("1001Q0", true).valid).toBe(false);
  });

  it("warns but accepts excluded letters in non-strict mode", () => {
    const r = validateSitePartNumber("1001I3", false);
    expect(r.valid).toBe(true);
    expect(r.warnings.length).toBe(1);
  });

  it("is case-insensitive (normalizes to uppercase)", () => {
    expect(validateSitePartNumber("1001a3").valid).toBe(true);
  });

  it("rejects lowercase-only sequences that aren't alpha", () => {
    expect(validateSitePartNumber("1001ab").valid).toBe(false);
  });
});

describe("isValidSitePartNumber", () => {
  it("returns boolean", () => {
    expect(isValidSitePartNumber("100301")).toBe(true);
    expect(isValidSitePartNumber("XXXXXX")).toBe(false);
  });
});

describe("parseSitePartNumber", () => {
  it("parses a numeric part number", () => {
    const p = parseSitePartNumber("100301");
    expect(p).not.toBeNull();
    expect(p!.siteName).toBe("Tennant Creek");
    expect(p!.categoryName).toBe("Gearboxes / Reducers");
    expect(p!.sequenceId).toBe("01");
    expect(p!.isAlphaNumeric).toBe(false);
  });

  it("parses an alpha-numeric part number", () => {
    const p = parseSitePartNumber("1001A3");
    expect(p).not.toBeNull();
    expect(p!.categoryName).toBe("Pumps");
    expect(p!.isAlphaNumeric).toBe(true);
  });

  it("returns null for invalid input", () => {
    expect(parseSitePartNumber("XXXXXX")).toBeNull();
  });
});

describe("getCategoryName", () => {
  it("returns name for valid codes", () => {
    expect(getCategoryName("01")).toBe("Pumps");
    expect(getCategoryName("23")).toBe("Unknown / To Be Confirmed");
  });

  it("returns null for invalid codes", () => {
    expect(getCategoryName("99")).toBeNull();
  });
});
