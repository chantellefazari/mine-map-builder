// Site Spares Catalogue Data
// MASTER INVENTORY for the entire site - ALL spare parts (HIGH, MEDIUM, LOW priority)
// Critical Spares Catalogue filters from this master list (HIGH + MEDIUM only)
// This is a PRELIMINARY REGISTER pending updated P&IDs and plant walkdowns

export interface SiteSpareItem {
  id: string;
  // Hierarchy linkage - aligned with Critical Spares structure
  area: string;           // Area code e.g., "COM", "REC", "TAIL"
  areaLabel: string;      // Full area name e.g., "Comminution / Process"
  subArea: string;        // e.g., "Feed / Reclaim", "Grinding"
  system: string;         // e.g., "APN01 Apron Feeder"
  parentAsset: string;    // Legacy P&ID reference e.g., "4-FE-100"
  assetNumber: string;    // Modern asset number e.g., "APN01-GMR01"
  pidTag: string;         // P&ID tag e.g., "04-FE-100"
  // Component details
  componentName: string;
  componentType: string;
  sparePartDescription: string;
  oemPartNumber: string;
  manufacturer: string;
  vendor: string;
  assetManufacturer: string;
  assetModel: string;
  // Priority & Criticality
  priority: "HIGH" | "MEDIUM" | "LOW";
  priorityReason: string;
  reviewFlag: boolean;
  spareCriticality: "High" | "Medium" | "Low" | "";
  criticalitySource: "Confirmed" | "Assumed" | "";
  reasonCritical: string;
  // Quantities
  minQty: string;
  maxQty: string;
  qtyPerSystem: string;
  unitPrice: string;
  uom: string;
  // Other fields
  leadTime: string;
  storageRequirement: string;
  notes: string;
  confidence: "Low" | "Medium" | "High";
  status: "Provisional" | "Confirmed" | "TBC" | "Active" | "Pending" | "Obsolete";
}

// Priority colors for UI
export const priorityColors: Record<string, string> = {
  HIGH: "bg-destructive/20 text-destructive",
  MEDIUM: "bg-amber-500/20 text-amber-700",
  LOW: "bg-muted text-muted-foreground",
};

// Status colors
export const siteSpareStatusColors: Record<string, string> = {
  Active: "bg-green-500/20 text-green-700",
  Provisional: "bg-blue-500/20 text-blue-700",
  Confirmed: "bg-green-500/20 text-green-700",
  Pending: "bg-amber-500/20 text-amber-700",
  TBC: "bg-amber-500/20 text-amber-700",
  Obsolete: "bg-muted text-muted-foreground",
};

// Criticality source colors
export const criticalitySourceColors: Record<string, string> = {
  Confirmed: "bg-green-500/20 text-green-700",
  Assumed: "bg-amber-500/20 text-amber-700",
};

// Site Spares data - MASTER INVENTORY
// This is the source of truth for ALL site spares
// Critical Spares Catalogue filters from this list (HIGH + MEDIUM only)
// Ready for full catalogue input
export const siteSparesData: SiteSpareItem[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // PLACEHOLDER - Full catalogue to be populated
  // ═══════════════════════════════════════════════════════════════════════════
  // Example structure (remove when populating):
  // {
  //   id: "SS-001",
  //   area: "COM",
  //   areaLabel: "Comminution / Process",
  //   subArea: "Feed / Reclaim",
  //   system: "APN01 Apron Feeder",
  //   parentAsset: "4-FE-100",
  //   assetNumber: "APN01-GMR01",
  //   pidTag: "04-FE-100",
  //   componentName: "Gearmotor",
  //   componentType: "Motor",
  //   sparePartDescription: "Apron Feeder Gearmotor",
  //   oemPartNumber: "SEW-EURODRIVE KA107R77 DRN112M4/V",
  //   manufacturer: "SEW",
  //   vendor: "SEW",
  //   assetManufacturer: "",
  //   assetModel: "",
  //   priority: "HIGH",
  //   priorityReason: "Motor - plant stoppage risk",
  //   reviewFlag: false,
  //   spareCriticality: "High",
  //   criticalitySource: "Confirmed",
  //   reasonCritical: "Motor - plant stoppage risk",
  //   minQty: "0",
  //   maxQty: "1",
  //   qtyPerSystem: "1",
  //   unitPrice: "$16,450.00",
  //   uom: "EA",
  //   leadTime: "",
  //   storageRequirement: "",
  //   notes: "",
  //   confidence: "Medium",
  //   status: "Provisional",
  // },
];

// Helper functions
export const getPriorityCounts = (): { high: number; medium: number; low: number } => {
  const high = siteSparesData.filter((item) => item.priority === "HIGH").length;
  const medium = siteSparesData.filter((item) => item.priority === "MEDIUM").length;
  const low = siteSparesData.filter((item) => item.priority === "LOW").length;
  return { high, medium, low };
};

// Get items flagged for review
export const getReviewItems = (): SiteSpareItem[] => {
  return siteSparesData.filter((item) => item.reviewFlag);
};

// Get critical items only (HIGH + MEDIUM) for Critical Spares Catalogue
export const getCriticalItems = (): SiteSpareItem[] => {
  return siteSparesData.filter((item) => item.priority === "HIGH" || item.priority === "MEDIUM");
};
