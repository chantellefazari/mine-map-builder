import { describe, it, expect } from "vitest";
import {
  validateSitePartNumber,
  isValidSitePartNumber,
  parseSitePartNumber,
  getCategoryName,
} from "@/utils/sitePartNumberValidation";

describe("validateSitePartNumber", () => {
  it("accepts valid 7-digit part numbers", () => {
    expect(validateSitePartNumber("1003001").valid).toBe(true);
    expect(validateSitePartNumber("1001999").valid).toBe(true);
    expect(validateSitePartNumber("1025001").valid).toBe(true);
  });

  it("accepts legacy 6-digit part numbers with warning", () => {
    const r = validateSitePartNumber("100301");
    expect(r.valid).toBe(true);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it("rejects empty or non-string input", () => {
    const r = validateSitePartNumber("");
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("empty");
  });

  it("rejects wrong length", () => {
    expect(validateSitePartNumber("10031").valid).toBe(false);
    expect(validateSitePartNumber("10030111").valid).toBe(false);
  });

  it("rejects invalid site code", () => {
    const r = validateSitePartNumber("2003001");
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("site code");
  });

  it("rejects invalid category code", () => {
    expect(validateSitePartNumber("1099001").valid).toBe(false);
    expect(validateSitePartNumber("1000001").valid).toBe(false);
  });

  it("rejects sequence 000", () => {
    const r = validateSitePartNumber("1003000");
    expect(r.valid).toBe(false);
    expect(r.errors[0]).toContain("000");
  });
});

describe("isValidSitePartNumber", () => {
  it("returns boolean", () => {
    expect(isValidSitePartNumber("1003001")).toBe(true);
    expect(isValidSitePartNumber("XXXXXXX")).toBe(false);
  });
});

describe("parseSitePartNumber", () => {
  it("parses a 7-digit part number", () => {
    const p = parseSitePartNumber("1003001");
    expect(p).not.toBeNull();
    expect(p!.siteName).toBe("Tennant Creek");
    expect(p!.categoryName).toBe("Gearboxes / Reducers");
    expect(p!.sequenceId).toBe("001");
  });

  it("parses a legacy 6-digit part number", () => {
    const p = parseSitePartNumber("100301");
    expect(p).not.toBeNull();
    expect(p!.categoryName).toBe("Gearboxes / Reducers");
  });

  it("returns null for invalid input", () => {
    expect(parseSitePartNumber("XXXXXXX")).toBeNull();
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
