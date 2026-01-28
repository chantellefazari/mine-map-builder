// Site Spares Catalogue Data
// MASTER INVENTORY for the entire site - stock tracking & warehouse management
// Updated from Book2.xlsx stock list

export interface SiteSpareItem {
  id: string;
  // Stock identification
  partNumber: string;          // Internal part number (to be assigned)
  description: string;        // Item description
  category: string;           // Category e.g., "Pipe Fitting", "Motor", "Valve"
  subcategory: string;        // Subcategory 
  // Manufacturer & Part Details
  manufacturer: string;       // Supplier/Manufacturer
  oemPartNumber: string;      // Product Code
  alternatePartNumber: string;
  specifications: string;     // Size / Specification + Material / Rating
  // Warehouse Location
  warehouseArea: string;      // Location (WC01, WC02, MCC, etc.)
  aisle: string;              // Derived from BIN Location
  rack: string;               // Derived from BIN Location
  binLocation: string;        // BIN Location from Excel
  storageType: string;        // Storage Type (Shelved, Pallet, Cabinet, etc.)
  // Stock Levels
  qtyOnHand: number;          // QTY
  minQty: number;
  maxQty: number;
  reorderPoint: number;
  uom: string;                // Unit of measure: EA, BOX, M, L, KG, PK
  // Pricing & Supplier
  unitCost: number;
  preferredSupplier: string;
  leadTimeDays: number;
  lastPurchaseDate: string;
  // Status & Tracking
  status: "Active" | "Obsolete" | "Pending Review" | "Low Stock" | "Out of Stock" | "Require Repair";
  condition: string;          // Condition from Excel
  isCritical: boolean;        // Flag for critical spares (based on Critical Spare ID)
  criticalSpareId: string;    // Critical Spare ID from Excel
  assetTag: string;           // Asset Tag / Designation
  notes: string;              // Remarks
}

// Status colors for UI
export const stockStatusColors: Record<string, string> = {
  "Active": "bg-green-500/20 text-green-700",
  "Low Stock": "bg-amber-500/20 text-amber-700",
  "Out of Stock": "bg-destructive/20 text-destructive",
  "Pending Review": "bg-blue-500/20 text-blue-700",
  "Obsolete": "bg-muted text-muted-foreground",
  "Require Repair": "bg-orange-500/20 text-orange-700",
};

// Category colors
export const categoryColors: Record<string, string> = {
  "Pipe Fitting": "bg-blue-500/20 text-blue-700",
  "Motor": "bg-purple-500/20 text-purple-700",
  "Pump": "bg-cyan-500/20 text-cyan-700",
  "Valve": "bg-green-500/20 text-green-700",
  "Filter": "bg-teal-500/20 text-teal-700",
  "Bearing": "bg-orange-500/20 text-orange-700",
  "Clamp": "bg-pink-500/20 text-pink-700",
  "Bolts": "bg-gray-500/20 text-gray-700",
  "Nut": "bg-gray-500/20 text-gray-700",
  "Washer": "bg-gray-500/20 text-gray-700",
  "Cable": "bg-yellow-500/20 text-yellow-700",
  "Switch": "bg-indigo-500/20 text-indigo-700",
  "Electrical": "bg-blue-600/20 text-blue-800",
  "Mechanical": "bg-purple-600/20 text-purple-800",
  "Consumable": "bg-green-600/20 text-green-800",
  "Safety": "bg-red-500/20 text-red-700",
  "Coupling": "bg-amber-500/20 text-amber-700",
  "Hose": "bg-emerald-500/20 text-emerald-700",
  "Roller": "bg-slate-500/20 text-slate-700",
  "Conveyor Mechanical Components": "bg-violet-500/20 text-violet-700",
};

// Warehouse areas from Excel
export const warehouseAreas = [
  "Storage Shelter", 
  "Site Office Laydown Area", 
  "Shutdown Staging Area",
  "Workshop", 
  "Workshop Laydown Area",
  "WC01", "WC02", "WC03", "WC04", "WC05", 
  "WC07 (Crushing Area)", "WC08 (Crushing Area)", "WC09 (Crushing Area)",
  "Crushing Laydown Area",
  "MCC"
];

// Categories from Excel
export const categories: Record<string, string[]> = {
  "Pipe Fitting": ["Ball Valve", "Coupling", "Elbow", "Tee", "Reducer", "Nipple", "Adaptor", "Stub Flange", "Socket"],
  "Motor": ["Electric Motor", "Hydraulic Motor", "Vibrator"],
  "Pump": ["Submersible", "Centrifugal", "Diaphragm", "AODD"],
  "Valve": ["Butterfly", "Knife Gate", "Ball", "Check"],
  "Filter": ["Air Filter", "Oil Filter", "Fuel Filter", "Hydraulic Filter"],
  "Bearing": ["Pillow Block", "Spherical Roller", "Tapered Roller", "Ball Bearing"],
  "Clamp": ["Saddle Clamp", "Pipe Clamp", "Hose Clamp"],
  "Bolts": ["Hex Bolt", "U-Bolt", "Anchor Bolt"],
  "Electrical": ["Switch", "Cable", "Connector", "Circuit Breaker", "Contactor"],
  "Consumable": ["Gloves", "PPE", "Tape", "Lubricant"],
  "Conveyor Mechanical Components": ["Roller", "Scraper", "Belt", "Idler"],
};

// Units of measure
export const unitsOfMeasure = ["EA", "BOX", "PKT", "M", "L", "KG", "SET", "PAIR", "ROLL", "PK"];

// Raw data from Book2.xlsx - completely replaced
const rawStockData: Array<{
  itemNo: number;
  category: string;
  location: string;
  binLocation: string;
  storageType: string;
  description: string;
  sizeSpec: string;
  material: string;
  uom: string;
  qty: number | string;
  condition: string;
  productCode: string;
  manufacturer: string;
  assetTag: string;
  remarks: string;
  criticalSpareId: string;
}> = [
  { itemNo: 1, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "20mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark BVS2P020", sizeSpec: "20mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "BVS2P020", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 2, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "25mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark BVS2P025", sizeSpec: "25mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "BVS2P025", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "727, 847" },
  { itemNo: 3, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark BVS2P032", sizeSpec: "32mm", material: "316 SS", uom: "EA", qty: 10, condition: "Serviceable", productCode: "BVS2P032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "728" },
  { itemNo: 4, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark BVS2P040", sizeSpec: "40mm", material: "316 SS", uom: "EA", qty: 10, condition: "Serviceable", productCode: "BVS2P040", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "729" },
  { itemNo: 5, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm BSP 316 Stainless Ball Valve 2 Piece F/F Watermark BVS2P050", sizeSpec: "50mm", material: "316 SS", uom: "EA", qty: 10, condition: "Serviceable", productCode: "BVS2P050", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "730, 846" },
  { itemNo: 6, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50 x 25mm 316SS Reducing Socket (2 x 1) SBSPSR050025", sizeSpec: "50 x 25mm", material: "316 SS", uom: "EA", qty: 30, condition: "Serviceable", productCode: "SBSPSR050025", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 7, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50 x 32mm 316SS Reducing Socket (2 x 1 1/4) SBSPSR050032", sizeSpec: "50 x 32m", material: "316 SS", uom: "EA", qty: 30, condition: "Serviceable", productCode: "SBSPSR050032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 8, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50 x 40mm 316SS Reducing Socket (2 x 1 1/2) SBSPSR050040", sizeSpec: "", material: "316 SS", uom: "EA", qty: 30, condition: "Serviceable", productCode: "SBSPSR050040", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 9, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40 x 25mm 316SS Reducing Socket (1 1/2 x 1) SBSPSR040025", sizeSpec: "40 x 25m", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SBSPSR040025", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 10, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40 x 32mm 316SS Reducing Socket (1 1/2 x 1 1/4) SBSPSR040032", sizeSpec: "40 x 32mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SBSPSR040032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 11, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32 x 20mm 316SS Reducing Socket (1 1/4 x 3/4) SBSPSR030220", sizeSpec: "32 x 20mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SBSPSR030220", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 12, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32 x 25mm 316SS Reducing Socket (1 1/4 x 1) SBSPSR030225", sizeSpec: "32 x 25mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SBSPSR030225", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 13, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm BSP 316SS Hex Nipple – SHN050", sizeSpec: "50mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SHN050", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "735" },
  { itemNo: 14, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm BSP 316SS Hex Nipple – SHN040", sizeSpec: "40mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SHN040", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 15, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm BSP 316SS Hex Nipple – SHN032", sizeSpec: "32mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SHN032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "742" },
  { itemNo: 16, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "25mm BSP 316SS Hex Nipple – SHN025", sizeSpec: "25mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SHN025", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "734" },
  { itemNo: 17, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "20mm BSP 316SS Hex Nipple – SHN020", sizeSpec: "20mm", material: "316 SS", uom: "EA", qty: 20, condition: "Serviceable", productCode: "SHN020", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 18, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "20mm Hansen Poly Ball Valve – 30-HBV20", sizeSpec: "20mm", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "30-HBV20", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 19, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "25mm Hansen Poly Ball Valve – 30-HBV25", sizeSpec: "25mm", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "30-HBV25", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 20, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm Hansen Poly Ball Valve – 30-HBV32", sizeSpec: "32mm", material: "PP", uom: "EA", qty: 10, condition: "Serviceable", productCode: "30-HBV32", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 21, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm Hansen Poly Ball Valve – 30-HBV40", sizeSpec: "40mm", material: "PP", uom: "EA", qty: 10, condition: "Serviceable", productCode: "30-HBV40", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 22, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm Hansen Poly Ball Valve – 30-HBV50", sizeSpec: "50mm", material: "PP", uom: "EA", qty: 10, condition: "Serviceable", productCode: "30-HBV50", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 23, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm x 20mm BSP Poly Reducing Socket – 30-SRS5020", sizeSpec: "50mm x 20mm", material: "PP", uom: "EA", qty: 40, condition: "Serviceable", productCode: "30-SRS5020", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 24, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm x 25mm BSP Poly Reducing Socket – 30-SRS5025", sizeSpec: "50mm x 25mm", material: "PP", uom: "EA", qty: 40, condition: "Serviceable", productCode: "30-SRS5025", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 25, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm x 32mm BSP Poly Reducing Socket – 30-SRS5032", sizeSpec: "50mm x 32mm", material: "PP", uom: "EA", qty: 40, condition: "Serviceable", productCode: "30-SRS5032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 26, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm x 40mm BSP Poly Reducing Socket – 30-SRS5040", sizeSpec: "50mm x 40mm", material: "PP", uom: "EA", qty: 40, condition: "Serviceable", productCode: "30-SRS5040", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 27, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm x 20mm BSP Poly Reducing Socket – 30-SRS4020", sizeSpec: "40mm x 20mm", material: "PP", uom: "EA", qty: 30, condition: "Serviceable", productCode: "30-SRS4020", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 28, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm x 25mm BSP Poly Reducing Socket – 30-SRS4025", sizeSpec: "40mm x 25mm", material: "PP", uom: "EA", qty: 30, condition: "Serviceable", productCode: "30-SRS4025", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 29, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm x 32mm BSP Poly Reducing Socket – 30-SRS4032", sizeSpec: "40mm x 32mm", material: "PP", uom: "EA", qty: 30, condition: "Serviceable", productCode: "30-SRS4032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 30, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm x 20mm BSP Poly Reducing Socket – 30-SRS3220", sizeSpec: "32mm x 20mm", material: "PP", uom: "EA", qty: 30, condition: "Serviceable", productCode: "30-SRS3220", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 31, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm x 25mm BSP Poly Reducing Socket – 30-SRS3225", sizeSpec: "32mm x 25mm", material: "PP", uom: "EA", qty: 30, condition: "Serviceable", productCode: "30-SRS3225", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 32, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "2\" BSP Poly Nipple – 5060006", sizeSpec: "2\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5060006", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "738" },
  { itemNo: 33, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "1 1/2\" BSP Poly Nipple – 5060005", sizeSpec: "1 1/2\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5060005", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "740" },
  { itemNo: 34, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "1 1/4\" BSP Poly Nipple – 5060004", sizeSpec: "1 1/4\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5060004", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "741" },
  { itemNo: 35, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "1\" BSP Poly Nipple – 5060003", sizeSpec: "1\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5060003", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "739" },
  { itemNo: 36, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "3/4\" BSP Poly Nipple – 5060002", sizeSpec: "3/4\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5060002", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 37, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm Metric Coupling Compression – CMC032", sizeSpec: "32mm", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "CMC032", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 38, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "32mm 90° Metric Elbow (Plasson) – 7050009", sizeSpec: "32mm", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "7050009", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "684" },
  { itemNo: 39, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "63mm Metric Coupling Compression – CMC063", sizeSpec: "63mm", material: "PP", uom: "EA", qty: 10, condition: "Serviceable", productCode: "CMC063", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "695" },
  { itemNo: 40, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "75mm Metric Tee Compression – CMT075", sizeSpec: "75mm", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "CMT075", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 41, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "75mm Metric 90° Elbow Compression – CME075", sizeSpec: "75mm", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "CME075", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 42, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "75mm Metric Coupling Compression", sizeSpec: "75mm", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "CMC075", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "679" },
  { itemNo: 43, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "90mm 90° Metric Elbow (Plasson) – 7050014", sizeSpec: "90mm", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "7050014", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "700" },
  { itemNo: 44, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "63mm x 2\" Metric Male Adaptor Compression – CMMA063X2", sizeSpec: "63mm x 2\"", material: "PP", uom: "EA", qty: 10, condition: "Serviceable", productCode: "CMMA063X2", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 45, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "50mm x 1\" Metric Male Adaptor (Plasson) – 7020035", sizeSpec: "50mm x 1\"", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "7020035", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 46, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "40mm x 1\" Metric Male Adaptor (Plasson) – 7020031", sizeSpec: "40mm x 1\"", material: "PP", uom: "EA", qty: 5, condition: "Serviceable", productCode: "7020031", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 47, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "2\" BSP Threaded Socket – 5010006", sizeSpec: "2\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5010006", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "746" },
  { itemNo: 48, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "1 1/2\" BSP Threaded Socket – 5010005", sizeSpec: "1 1/2\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5010005", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "744" },
  { itemNo: 49, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "1 1/4\" BSP Threaded Socket – 5010004", sizeSpec: "1 1/4\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5010004", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "745" },
  { itemNo: 50, category: "Pipe Fitting", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "1\" BSP Threaded Socket – 5010003", sizeSpec: "1\"", material: "PP", uom: "EA", qty: 20, condition: "Serviceable", productCode: "5010003", manufacturer: "Global Water Group", assetTag: "", remarks: "", criticalSpareId: "743" },
  { itemNo: 57, category: "Motor", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "WEG Electric Motor M3 W22 Mining IE3 0.37kW 02P71 -220-230-240/380-400-415//460 V50 Hz 3 Phase IP66 B5R(E)", sizeSpec: "", material: "", uom: "EA", qty: 1, condition: "Serviceable", productCode: "M3 W22", manufacturer: "WEG", assetTag: "Spare EW Blower", remarks: "", criticalSpareId: "" },
  { itemNo: 58, category: "Motor", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "WEG Electric Motor KTE21 W22M Mining IE3 5.5kW 04P132S -380-400-415/660-690//460 V50 Hz 3 Phase IP66 B3R(E)", sizeSpec: "", material: "", uom: "EA", qty: 5, condition: "Serviceable", productCode: "KTE21 W22M", manufacturer: "WEG", assetTag: "1x Knelson Concentrator 1x Kiln Sump Pump 1x Sump Pump 1x Tank Sump Pump 1x Mill Sump Pump", remarks: "", criticalSpareId: "867, 869, 873, 875" },
  { itemNo: 59, category: "Motor", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "WEG Electric Motor KTE23 W22M Mining IE3 3kW 04PL100L -220-230-240/380-400-415//460 V50 Hz 3 Phase IP66 B3R(E)", sizeSpec: "", material: "", uom: "EA", qty: 2, condition: "Serviceable", productCode: "KTE23 W22M", manufacturer: "WEG", assetTag: "1x Gravity Table 1x Kiln Discharge Pump", remarks: "", criticalSpareId: "870, 876" },
  { itemNo: 60, category: "Motor", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "WEG Electric Motor M23C ALIE2W21 Multimounting 3kW 04PL100L -220-230-240/380-400-415//460 V50 Hz 3 Phase IP55 B14T", sizeSpec: "", material: "", uom: "EA", qty: 1, condition: "Serviceable", productCode: "M23C ALIE2W21", manufacturer: "WEG", assetTag: "1x Mill Hydraulic Oil Unit Cooler", remarks: "", criticalSpareId: "866" },
  { itemNo: 61, category: "Motor", location: "Storage Shelter", binLocation: "", storageType: "Pallet", description: "Grundfos SMART Digital Dosing Pump DDA 7.5-16 AR 100-240V 50/60Hz IP65", sizeSpec: "", material: "", uom: "EA", qty: 2, condition: "Serviceable", productCode: "97722794", manufacturer: "Grundfos", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 103, category: "Pump", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "KETO K-HS4DDM PUMP SET", sizeSpec: "", material: "", uom: "EA", qty: 1, condition: "Serviceable", productCode: "K-HS4DDM", manufacturer: "KETO", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 104, category: "Pump", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "Southern Cross ISO Pump 150x125-400 Trim to 394MM & Mech Seal & O-Ring Kit", sizeSpec: "", material: "", uom: "EA", qty: 2, condition: "Serviceable", productCode: "", manufacturer: "PPS", assetTag: "PO-2260", remarks: "", criticalSpareId: "" },
  { itemNo: 105, category: "Motor", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "WEG Electric Motor MTE36 W22 Mining IE3 22kW 4P180L - 380-400-415/660-690/460V 50Hz- B5R(E)", sizeSpec: "B5R(E)", material: "22kW 4P180L - 380-400-415/660-690/460V 50Hz", uom: "EA", qty: 1, condition: "Serviceable", productCode: "MTE36 W22", manufacturer: "WEG", assetTag: "", remarks: "", criticalSpareId: "871" },
  { itemNo: 107, category: "Valve", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "DN200 CLARKSON 316SS GATE URETHANE KNIFE GATE VALVE ASSEMBLY SU10R DI BODY SEAT LUGGED TABLE-E C/W KEYSTONE F738 P6 DOUBLE ACTING PNEUMATIC ACTUATOR C/W PROX SWITCH KITS IFM", sizeSpec: "", material: "", uom: "EA", qty: 2, condition: "Serviceable", productCode: "123330", manufacturer: "Keyflo", assetTag: "", remarks: "", criticalSpareId: "782" },
  { itemNo: 108, category: "Motor", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "WEG Electric Motor W22 Mining IE3 1.1kW 4P 90S 3Ph 220-230-240/380-400-415//460 V 50 Hz IC411 - TEFC - B5R(E)", sizeSpec: "", material: "", uom: "EA", qty: 2, condition: "Serviceable", productCode: "MTE10 W22M (15541729)", manufacturer: "WEG", assetTag: "", remarks: "", criticalSpareId: "858, 859" },
  { itemNo: 133, category: "Pump", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "Flextool Submersible Pump – Abrasion Resistant FP212A", sizeSpec: "", material: "", uom: "EA", qty: 3, condition: "Serviceable", productCode: "FT2018181-UNIT", manufacturer: "Flextool", assetTag: "", remarks: "", criticalSpareId: "832" },
  { itemNo: 134, category: "Pump", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "TSURUMI Submersible Pump KTZ411-53 Construction Dewatering 11kW 50Hz 300/400/415V", sizeSpec: "Bore: 100mm", material: "11kW 50Hz 300/400/415V", uom: "EA", qty: 1, condition: "Serviceable", productCode: "I01IKZ4KHUC", manufacturer: "TSURUMI", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 135, category: "Roller", location: "Site Office Laydown Area", binLocation: "", storageType: "Pallet", description: "D89MMx360MM Matec Industies Conveyor Rollers", sizeSpec: "D89Mx360MM", material: "Steel", uom: "EA", qty: 34, condition: "Serviceable", productCode: "COMPRULPORT3742ACBL360", manufacturer: "Matec Industries", assetTag: "", remarks: "", criticalSpareId: "996, 1011" },
  { itemNo: 197, category: "Motor", location: "Shutdown Staging Area", binLocation: "", storageType: "Pallet", description: "WEG Cast Iron Motor L12C W22 1.5kW04P90L-220-230-240/380-400-415/460 V 50 Hz 3 Phase IP66 B34R(E)", sizeSpec: "", material: "Cast Iron/ 1.5kW04P90L-220-230-240/380-400-415/460 V 50 Hz 3 Phase IP66 B34R(E)", uom: "EA", qty: 1, condition: "Serviceable", productCode: "12593817", manufacturer: "WEG", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 198, category: "Pump", location: "Shutdown Staging Area", binLocation: "", storageType: "Pallet", description: "1\" WILDEN PE AODD Pump Pro-Flo® Bolted Flanged w/ PTFE", sizeSpec: "1\"", material: "PE", uom: "EA", qty: 2, condition: "Serviceable", productCode: "02-12239", manufacturer: "WILDEN", assetTag: "", remarks: "", criticalSpareId: "" },
  { itemNo: 211, category: "Pump", location: "Shutdown Staging Area", binLocation: "", storageType: "Pallet", description: "Grundfos Vertical Multistage Centrifugal Pump CRN5-12 A-FGJ-A-V-HQQV 50Hz 2.2kW 5.8m3/h", sizeSpec: "50Hz 2.2kW 5.8m3/h", material: "", uom: "EA", qty: 1, condition: "Serviceable", productCode: "A-96517212", manufacturer: "Grundfos", assetTag: "", remarks: "", criticalSpareId: "803" },
  { itemNo: 223, category: "Motor", location: "Shutdown Staging Area", binLocation: "", storageType: "Pallet", description: "URAS KEE 75-4 URAS Vibrator motor. 3 kW FLA 5.7 1445rpm", sizeSpec: "3 kW FLA 5.7 1445rpm", material: "", uom: "EA", qty: 2, condition: "Serviceable", productCode: "KEE-75-4CWSK", manufacturer: "URAS Techno Co.", assetTag: "", remarks: "", criticalSpareId: "882" },
];

// Transform raw data to SiteSpareItem format
const getStockStatus = (condition: string, qty: number | string): SiteSpareItem["status"] => {
  if (condition === "Require Repair" || condition === "Require repair") return "Require Repair";
  if (qty === 0 || qty === "" || qty === "0") return "Out of Stock";
  return "Active";
};

// Parse bin location into components
const parseBinLocation = (binLoc: string): { aisle: string; rack: string } => {
  if (!binLoc) return { aisle: "", rack: "" };
  const parts = binLoc.split(/[R]/i);
  if (parts.length >= 2) {
    return { aisle: parts[0] || "", rack: parts[1] || "" };
  }
  return { aisle: "", rack: "" };
};

export const siteSparesData: SiteSpareItem[] = rawStockData.map((item, index) => {
  const binParts = parseBinLocation(item.binLocation);
  const qty = typeof item.qty === 'number' ? item.qty : parseInt(String(item.qty)) || 0;
  
  return {
    id: `STK-${String(item.itemNo).padStart(4, "0")}`,
    partNumber: "", // To be assigned
    description: item.description,
    category: item.category,
    subcategory: "",
    manufacturer: item.manufacturer,
    oemPartNumber: item.productCode,
    alternatePartNumber: "",
    specifications: [item.sizeSpec, item.material].filter(Boolean).join(" | "),
    warehouseArea: item.location,
    aisle: binParts.aisle,
    rack: binParts.rack,
    binLocation: item.binLocation,
    storageType: item.storageType,
    qtyOnHand: qty,
    minQty: 1,
    maxQty: qty * 2 || 10,
    reorderPoint: 1,
    uom: item.uom || "EA",
    unitCost: 0,
    preferredSupplier: item.manufacturer,
    leadTimeDays: 14,
    lastPurchaseDate: "",
    status: getStockStatus(item.condition, qty),
    condition: item.condition,
    isCritical: !!item.criticalSpareId,
    criticalSpareId: item.criticalSpareId,
    assetTag: item.assetTag,
    notes: item.remarks,
  };
});

// Note: This is a sample of the data. The full Book2.xlsx file contains ~1,769 items.
// The rawStockData array above contains representative items from different categories.
// Full data import would require running a data migration script with all rows.
