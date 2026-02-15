import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { type SiteSpareItem } from "@/hooks/useSiteSpares";
import { Badge } from "@/components/ui/badge";
import { isCriticalItem } from "@/utils/criticalityClassification";

// Approved Part Category Codes (TCMG) for import mapping
const categories: Record<string, string[]> = {
  "Pumps": ["Submersible", "Centrifugal", "Diaphragm", "AODD"],
  "Motors": ["Electric Motor", "Hydraulic Motor", "Vibrator"],
  "Gearboxes / Reducers": ["Helical", "Planetary", "Worm Gear"],
  "Bearings": ["Pillow Block", "Spherical Roller", "Ball Bearing"],
  "Valves": ["Butterfly", "Knife Gate", "Ball", "Check"],
  "Instrumentation": ["Transmitter", "Gauge", "Sensor"],
  "Electrical Components": ["Switch", "Cable", "Connector"],
  "Conveying Components": ["Idler", "Roller", "Belt Scraper"],
  "Wear Parts": ["Liner", "Screen Panel", "Crusher Liner"],
  "Structural & Mechanical": ["Coupling", "Bracket", "Frame"],
  "Hoses & Pipework": ["Ball Valve", "Coupling", "Elbow", "Tee", "Reducer", "Nipple", "Hose"],
  "Seals & Gaskets": ["O-Ring", "Gasket", "Mechanical Seal"],
  "Filters": ["Air Filter", "Oil Filter", "Fuel Filter"],
  "Air & Pneumatic Components": ["Compressor", "Regulator"],
  "Tanks & Vessels": ["Process Tank", "Heat Exchanger"],
  "Safety Equipment": ["Safety Shower", "Fire Extinguisher"],
  "Power Generation & Distribution": ["Generator", "Transformer"],
  "Tools & Workshop Equipment": ["Sling", "Power Tool", "Wrench"],
  "Fasteners": ["Bolt", "Nut", "Washer", "Screw"],
  "Consumables": ["Gloves", "PPE", "Tape", "Lubricant"],
};

const WAREHOUSE_LOCATIONS = [
  { value: "C01-EL", label: "C01-EL — Electrical" },
  { value: "C02-IN", label: "C02-IN — Instrumentation, Pneumatics & Process Fittings" },
  { value: "C03-ME", label: "C03-ME — Mechanical" },
  { value: "C04-MP", label: "C04-MP — Mechanical Precision" },
  { value: "C05-CS", label: "C05-CS — Consumables & Supplies" },
  { value: "LD", label: "LD — Laydown Yard" },
] as const;

interface DuplicateInfo {
  item: Omit<SiteSpareItem, "id">;
  existingItem?: SiteSpareItem;
  batchOriginalItem?: Omit<SiteSpareItem, "id">; // The first occurrence in the batch
  batchOriginalSource?: string; // Source file of the first occurrence
  batchOriginalIndex?: number; // Index of the first occurrence in preview array
  source: string;
  isDuplicate: boolean;
  duplicateType: "exact" | "partial" | "none";
  matchReason?: string;
  // Selection: "import" = use this item, "existing" = skip (use existing/original), "skip" = don't import either
  selection: "import" | "existing" | "skip";
}

interface ImportSpareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: Omit<SiteSpareItem, "id">[]) => Promise<boolean>;
  onMerge?: (items: Omit<SiteSpareItem, "id">[]) => Promise<boolean>;
  existingSpares?: SiteSpareItem[];
}

export const ImportSpareDialog = ({
  open,
  onOpenChange,
  onImport,
  onMerge,
  existingSpares = [],
}: ImportSpareDialogProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<DuplicateInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStockStatus = (condition: string, qty: number): string => {
    const condLower = (condition || "").toLowerCase();
    if (condLower.includes("repair")) return "Require Repair";
    if (qty === 0) return "Out of Stock";
    return "Active";
  };

  const mapCategory = (cat: string): string => {
    const normalized = (cat || "").trim();
    if (Object.keys(categories).includes(normalized)) return normalized;
    for (const key of Object.keys(categories)) {
      if (normalized.toLowerCase().includes(key.toLowerCase())) return key;
    }
    return "Consumables";
  };

  const mapWarehouseArea = (location: string): string => {
    const loc = (location || "").toLowerCase();
    const validCodes = WAREHOUSE_LOCATIONS.map(l => l.value);
    for (const code of validCodes) {
      if (loc.includes(code.toLowerCase())) return code;
    }
    // Use description-based allocation as fallback
    return "C03-ME";
  };

  const normalizeHeader = (s: string) =>
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, "");

  const getField = (row: Record<string, any>, ...possibleHeaders: string[]): string => {
    for (const header of possibleHeaders) {
      if (row[header] !== undefined && row[header] !== "") return String(row[header]);
    }

    const rowKeys = Object.keys(row);
    const normalizedRowKeys = rowKeys.map((k) => ({ key: k, n: normalizeHeader(k) }));

    for (const header of possibleHeaders) {
      const nh = normalizeHeader(header);
      if (!nh) continue;

      const exact = normalizedRowKeys.find((k) => k.n === nh);
      if (exact && row[exact.key] !== undefined && row[exact.key] !== "") return String(row[exact.key]);

      const contains = normalizedRowKeys.find((k) => k.n.includes(nh) || nh.includes(k.n));
      if (contains && row[contains.key] !== undefined && row[contains.key] !== "") return String(row[contains.key]);
    }

    return "";
  };

  const parseExcelFile = async (file: File): Promise<Omit<SiteSpareItem, "id">[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    const items: Omit<SiteSpareItem, "id">[] = jsonData.map((row: any) => {
      const qty = parseInt(getField(row, "QTY", "Qty on Hand", "Quantity", "qty") || "0") || 0;
      const condition = getField(row, "Condition", "condition");
      const category = getField(row, "Category", "category") || "Consumables";
      const location = getField(row, "Location", "location");
      const binLoc = getField(row, "BIN Location", "Bin Location", "Bin");
      const sizeSpec = getField(row, "Size / Specification", "Size");
      const material = getField(row, "Material / Rating", "Material");
      const description = getField(row, "Item Description", "Description", "description");
      const manufacturer = getField(row, "Supplier/ Manufacturer", "Supplier / Manufacturer", "Supplier/Manufacturer", "Supplier/ manufacturer", "supplier/ manufacturer", "Manufacturer", "Supplier", "Make", "Brand");
      const productCode = getField(row, "Product Code", "OEM Part Number", "Part Number");
      const assetTag = getField(row, "Asset Tag / Designation", "Asset Tag", "Designation");
      const criticalId = getField(row, "Critical Spare ID", "CriticalSpareID");
      const remarks = getField(row, "Remarks", "Notes");
      
      // Auto-classify criticality based on description keywords
      // If Critical Spare ID is already set, use that; otherwise use keyword classification
      const autoIsCritical = criticalId ? true : isCriticalItem(description);
      
      return {
        part_number: "",
        description: description,
        category: mapCategory(category),
        subcategory: "",
        warehouse_area: mapWarehouseArea(location),
        bin_location: binLoc,
        aisle: "",
        rack: "",
        storage_type: getField(row, "Storage Type") || "Shelved",
        qty_on_hand: qty,
        min_qty: 0,
        max_qty: 0,
        reorder_point: 0,
        uom: getField(row, "UOM") || "EA",
        unit_cost: 0,
        preferred_supplier: "",
        lead_time_days: 0,
        last_purchase_date: null,
        manufacturer: manufacturer,
        oem_part_number: productCode,
        alternate_part_number: "",
        condition: condition,
        status: getStockStatus(condition, qty),
        is_critical: autoIsCritical,
        critical_spare_id: criticalId,
        asset_tag: assetTag,
        specifications: `${sizeSpec}${sizeSpec && material ? " | " : ""}${material}`,
        notes: remarks,
        image_urls: [],
      };
    });

    return items.filter(item => item.description.trim() !== "");
  };

  // Normalize text for comparison
  const normalizeText = (text: string): string => 
    (text || "").toLowerCase().trim();

  // Calculate a "completeness score" for an item - higher = more complete data
  const calculateCompleteness = (item: Omit<SiteSpareItem, "id"> | SiteSpareItem): number => {
    let score = 0;
    if (item.description?.trim()) score += 1;
    if (item.oem_part_number?.trim()) score += 3; // OEM part number is very valuable
    if (item.manufacturer?.trim()) score += 2;
    if (item.specifications?.trim()) score += 1;
    if (item.bin_location?.trim()) score += 1;
    if (item.warehouse_area?.trim()) score += 1;
    if (item.asset_tag?.trim()) score += 1;
    if (item.critical_spare_id?.trim()) score += 2;
    if (item.condition?.trim()) score += 1;
    if ((item.qty_on_hand ?? 0) > 0) score += 1;
    if (item.notes?.trim()) score += 1;
    return score;
  };

  const detectDuplicates = (
    newItems: { item: Omit<SiteSpareItem, "id">; source: string }[],
    existing: SiteSpareItem[]
  ): DuplicateInfo[] => {
    // Build lookup sets for existing items - separate sets for description and OEM
    const existingDescriptions = new Set<string>();
    const existingOEMs = new Set<string>();
    const existingByDesc = new Map<string, SiteSpareItem>();
    const existingByOEM = new Map<string, SiteSpareItem>();
    
    existing.forEach((item) => {
      const desc = normalizeText(item.description);
      const oem = normalizeText(item.oem_part_number || "");
      
      if (desc) {
        existingDescriptions.add(desc);
        existingByDesc.set(desc, item);
      }
      if (oem) {
        existingOEMs.add(oem);
        existingByOEM.set(oem, item);
      }
    });

    // Track items we've seen in this import batch - store the full item info with index
    const seenByDesc = new Map<string, { item: Omit<SiteSpareItem, "id">; source: string; index: number }>();
    const seenByOEM = new Map<string, { item: Omit<SiteSpareItem, "id">; source: string; index: number }>();

    const results: DuplicateInfo[] = [];

    newItems.forEach(({ item, source }, currentIndex) => {
      const desc = normalizeText(item.description);
      const oem = normalizeText(item.oem_part_number || "");
      
      let isDuplicate = false;
      let existingItem: SiteSpareItem | undefined;
      let batchOriginalItem: Omit<SiteSpareItem, "id"> | undefined;
      let batchOriginalSource: string | undefined;
      let batchOriginalIndex: number | undefined;
      let matchReason = "";

      // Check if duplicate within the import batch (either field matches)
      if (desc && seenByDesc.has(desc)) {
        isDuplicate = true;
        const original = seenByDesc.get(desc)!;
        batchOriginalItem = original.item;
        batchOriginalSource = original.source;
        batchOriginalIndex = original.index;
        matchReason = "description (in batch)";
      } else if (oem && seenByOEM.has(oem)) {
        isDuplicate = true;
        const original = seenByOEM.get(oem)!;
        batchOriginalItem = original.item;
        batchOriginalSource = original.source;
        batchOriginalIndex = original.index;
        matchReason = "OEM part number (in batch)";
      }
      
      // Check against existing database items (either field matches)
      if (!isDuplicate) {
        if (desc && existingDescriptions.has(desc)) {
          isDuplicate = true;
          existingItem = existingByDesc.get(desc);
          matchReason = "description (in database)";
        } else if (oem && existingOEMs.has(oem)) {
          isDuplicate = true;
          existingItem = existingByOEM.get(oem);
          matchReason = "OEM part number (in database)";
        }
      }

      // Determine selection based on completeness
      let selection: "import" | "existing" | "skip" = "import";
      
      if (isDuplicate) {
        const currentScore = calculateCompleteness(item);
        
        if (batchOriginalItem) {
          // Duplicate within batch - compare completeness
          const originalScore = calculateCompleteness(batchOriginalItem);
          if (currentScore > originalScore) {
            // This item is more complete - import this one, mark original to skip
            selection = "import";
            // Update the original item's selection to skip (it has less data)
            if (batchOriginalIndex !== undefined && results[batchOriginalIndex]) {
              results[batchOriginalIndex].selection = "skip";
            }
          } else {
            // Original is more complete or equal - skip this one
            selection = "skip";
          }
        } else if (existingItem) {
          // Duplicate with database - compare completeness
          const existingScore = calculateCompleteness(existingItem);
          if (currentScore > existingScore) {
            // New item is more complete - import it
            selection = "import";
          } else {
            // Existing is more complete or equal - keep existing
            selection = "existing";
          }
        }
      }
      
      // Mark as seen for future items in batch (update if this is more complete)
      if (desc) {
        const existing = seenByDesc.get(desc);
        if (!existing || calculateCompleteness(item) > calculateCompleteness(existing.item)) {
          seenByDesc.set(desc, { item, source, index: currentIndex });
        }
      }
      if (oem) {
        const existing = seenByOEM.get(oem);
        if (!existing || calculateCompleteness(item) > calculateCompleteness(existing.item)) {
          seenByOEM.set(oem, { item, source, index: currentIndex });
        }
      }
      
      results.push({
        item,
        existingItem,
        batchOriginalItem,
        batchOriginalSource,
        batchOriginalIndex,
        source,
        isDuplicate,
        duplicateType: isDuplicate ? ("exact" as const) : ("none" as const),
        matchReason,
        selection,
      });
    });

    return results;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    // Add to existing files (allow multiple uploads)
    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);
    setError(null);
    setIsProcessing(true);

    try {
      // Parse all files and combine
      const allItems: { item: Omit<SiteSpareItem, "id">; source: string }[] = [];
      
      for (const file of newFiles) {
        const items = await parseExcelFile(file);
        items.forEach((item) => {
          allItems.push({ item, source: file.name });
        });
      }

      // Detect duplicates
      const withDuplicates = detectDuplicates(allItems, existingSpares);
      setPreview(withDuplicates);
      
      const dupeCount = withDuplicates.filter((d) => d.isDuplicate).length;
      setDuplicateCount(dupeCount);

      if (allItems.length === 0) {
        setError("No valid items found in the files. Please check the format.");
      }
    } catch (err) {
      setError("Failed to parse file(s). Please ensure they are valid Excel or CSV files.");
      setPreview([]);
    } finally {
      setIsProcessing(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    const newFiles = files.filter((_, i) => i !== indexToRemove);
    setFiles(newFiles);
    
    if (newFiles.length === 0) {
      setPreview([]);
      setDuplicateCount(0);
    } else {
      // Re-process remaining files
      reprocessFiles(newFiles);
    }
  };

  const reprocessFiles = async (fileList: File[]) => {
    setIsProcessing(true);
    try {
      const allItems: { item: Omit<SiteSpareItem, "id">; source: string }[] = [];
      
      for (const file of fileList) {
        const items = await parseExcelFile(file);
        items.forEach((item) => {
          allItems.push({ item, source: file.name });
        });
      }

      const withDuplicates = detectDuplicates(allItems, existingSpares);
      setPreview(withDuplicates);
      setDuplicateCount(withDuplicates.filter((d) => d.isDuplicate).length);
    } catch (err) {
      setError("Failed to reprocess files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setIsImporting(true);

    // Get items to import: 
    // - All unique items (non-duplicates)
    // - Duplicates where user selected "import" (use the new item)
    const itemsToImport = preview
      .filter((d) => !d.isDuplicate || d.selection === "import")
      .map((d) => d.item);

    const success = onMerge 
      ? await onMerge(itemsToImport)
      : await onImport(itemsToImport);

    setIsImporting(false);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFiles([]);
    setPreview([]);
    setError(null);
    setDuplicateCount(0);
    onOpenChange(false);
    onOpenChange(false);
  };

  const uniqueCount = preview.filter((d) => !d.isDuplicate).length;
  const selectedToImportCount = preview.filter((d) => d.isDuplicate && d.selection === "import").length;
  const totalToImport = uniqueCount + selectedToImportCount;
  const duplicates = preview.filter((d) => d.isDuplicate);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import & Merge Stock Lists
          </DialogTitle>
          <DialogDescription>
            Upload multiple Excel files. Duplicates are automatically resolved — the version with the most complete data is kept.
          </DialogDescription>
        </DialogHeader>

        {/* Main content with scroll */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add multiple Excel files - they'll be merged together
                </p>
              </div>

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files ({files.length})</p>
                  <div className="space-y-1">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-muted/50 rounded-md px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4 text-primary" />
                          <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(i);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing State */}
              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing files and checking for duplicates...
                </div>
              )}

              {/* Importing State */}
              {isImporting && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing {totalToImport} items to database...
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Preview with Duplicate Summary - Auto-resolved */}
              {preview.length > 0 && !isImporting && (
                <div className="space-y-4">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Items to Import</span>
                      </div>
                      <p className="text-2xl font-bold text-primary mt-1">{totalToImport}</p>
                      <p className="text-xs text-muted-foreground">Best version of each item</p>
                    </div>
                    <div className="rounded-lg p-3 bg-muted/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${duplicateCount > 0 ? "text-green-600" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${duplicateCount > 0 ? "text-green-700" : "text-muted-foreground"}`}>
                          Duplicates Auto-Resolved
                        </span>
                      </div>
                      <p className={`text-2xl font-bold mt-1 ${duplicateCount > 0 ? "text-green-700" : "text-muted-foreground"}`}>
                        {duplicateCount}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {duplicateCount > 0 
                          ? "Kept records with most data"
                          : "None detected"
                        }
                      </p>
                    </div>
                  </div>

                  {/* Auto-resolution Info */}
                  {duplicateCount > 0 && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-green-700">
                            {duplicateCount} duplicates automatically resolved
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            For each duplicate, the version with the most complete data (OEM part number, manufacturer, etc.) was kept.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Clear Action Section */}
                  <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Ready to Import {totalToImport} Items
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {duplicateCount > 0 
                            ? `Best version of each item selected automatically`
                            : "No duplicates found - all items are unique"
                          }
                        </p>
                      </div>
                      <Button
                        onClick={handleImport}
                        disabled={totalToImport === 0 || isProcessing}
                        size="lg"
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Import {totalToImport} Items
                      </Button>
                    </div>
                  </div>

                  {/* Preview of items to import (collapsed by default) */}
                  {totalToImport > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        View items to be imported ({totalToImport})
                      </summary>
                      <div className="mt-2 max-h-24 overflow-y-auto space-y-1 pl-2">
                        {preview
                          .filter((d) => !d.isDuplicate || d.selection === "import")
                          .slice(0, 10)
                          .map((d, i) => (
                            <div key={i} className="flex items-center gap-2 text-muted-foreground">
                              <Badge variant="outline" className="text-xs px-1.5 py-0">
                                {d.source}
                              </Badge>
                              <span className="truncate">{d.item.description}</span>
                              {d.item.oem_part_number && (
                                <Badge className="text-xs px-1.5 py-0 bg-primary/20 text-primary">
                                  OEM
                                </Badge>
                              )}
                            </div>
                          ))}
                        {totalToImport > 10 && (
                          <p className="text-muted-foreground">
                            ... and {totalToImport - 10} more items
                          </p>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isImporting}>
            {preview.length > 0 ? "Cancel" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};