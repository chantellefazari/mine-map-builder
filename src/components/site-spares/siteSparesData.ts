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

// Import critical spares data and transform to site spares format
import { sparesData } from "../critical-spares/sparesData";

// Transform critical spares to site spares format
const transformedCriticalSpares: SiteSpareItem[] = sparesData.map((item, index) => ({
  id: `SS-${String(index + 1).padStart(3, "0")}`,
  area: item.area,
  areaLabel: item.areaLabel,
  subArea: item.subArea,
  system: item.system,
  parentAsset: item.parentAsset,
  assetNumber: item.assetNumber,
  pidTag: item.pidTag,
  componentName: item.componentName,
  componentType: item.componentType,
  sparePartDescription: item.sparePartDescription,
  oemPartNumber: item.oemPartNumber,
  manufacturer: item.manufacturer,
  vendor: item.vendor,
  assetManufacturer: item.assetManufacturer,
  assetModel: item.assetModel,
  priority: item.spareCriticality === "High" ? "HIGH" as const : item.spareCriticality === "Medium" ? "MEDIUM" as const : "LOW" as const,
  priorityReason: item.reasonCritical,
  reviewFlag: false,
  spareCriticality: item.spareCriticality,
  criticalitySource: item.criticalitySource,
  reasonCritical: item.reasonCritical,
  minQty: item.minQty,
  maxQty: item.maxQty,
  qtyPerSystem: item.qtyPerSystem,
  unitPrice: item.unitPrice,
  uom: item.uom,
  leadTime: "",
  storageRequirement: "",
  notes: item.notes,
  confidence: item.confidence || "Medium",
  status: item.status,
}));

// Site Spares data - MASTER INVENTORY
// This is the source of truth for ALL site spares
// Currently populated from Critical Spares - ready for full catalogue expansion
export const siteSparesData: SiteSpareItem[] = [
  ...transformedCriticalSpares,
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
