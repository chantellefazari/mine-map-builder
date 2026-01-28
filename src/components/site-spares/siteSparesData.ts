// Site Spares Catalogue Data
// Complete inventory of all site spares
// Items can be flagged as critical to appear in Critical Spares Catalogue

export interface SiteSpareItem {
  id: string;
  // Hierarchy linkage
  area: string;
  subArea: string;
  system: string;
  parentAsset: string;
  // Component details
  componentName: string;
  componentType: string;
  sparePartDescription: string;
  oemPartNumber: string;
  manufacturer: string;
  // Criticality flag
  isCritical: boolean;
  spareCriticality: "High" | "Medium" | "Low" | "";
  reasonCritical: string;
  // Quantities
  minQty: string;
  maxQty: string;
  currentStock: string;
  // Other fields
  leadTime: string;
  storageRequirement: string;
  notes: string;
  status: "Active" | "Pending" | "Obsolete";
}

// Empty array - to be populated from user documents
export const siteSparesData: SiteSpareItem[] = [];

// Status colors
export const siteSpareStatusColors: Record<string, string> = {
  "Active": "bg-green-500/20 text-green-700",
  "Pending": "bg-amber-500/20 text-amber-700",
  "Obsolete": "bg-muted text-muted-foreground",
};
