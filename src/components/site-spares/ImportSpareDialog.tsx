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
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X, AlertTriangle, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { type SiteSpareItem } from "@/hooks/useSiteSpares";
import { Badge } from "@/components/ui/badge";

// Categories and warehouse areas for mapping
const categories: Record<string, string[]> = {
  "Pipe Fitting": ["Ball Valve", "Coupling", "Elbow", "Tee", "Reducer", "Nipple"],
  "Motor": ["Electric Motor", "Hydraulic Motor", "Vibrator"],
  "Pump": ["Submersible", "Centrifugal", "Diaphragm", "AODD"],
  "Valve": ["Butterfly", "Knife Gate", "Ball", "Check"],
  "Filter": ["Air Filter", "Oil Filter", "Fuel Filter"],
  "Bearing": ["Pillow Block", "Spherical Roller", "Ball Bearing"],
  "Electrical": ["Switch", "Cable", "Connector"],
  "Consumable": ["Gloves", "PPE", "Tape", "Lubricant"],
};

const warehouseAreas = [
  "Storage Shelter", "Site Office Laydown Area", "Shutdown Staging Area",
  "Workshop", "Workshop Laydown Area", "WC01", "WC02", "WC03", "WC04", "WC05",
  "WC07 (Crushing Area)", "WC08 (Crushing Area)", "WC09 (Crushing Area)",
  "Crushing Laydown Area", "MCC"
];

interface DuplicateInfo {
  item: Omit<SiteSpareItem, "id">;
  existingItem?: SiteSpareItem;
  source: string;
  isDuplicate: boolean;
  duplicateType: "exact" | "partial" | "none";
  matchReason?: string;
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
    return "General";
  };

  const mapWarehouseArea = (location: string): string => {
    const loc = (location || "");
    for (const area of warehouseAreas) {
      if (loc.toLowerCase().includes(area.toLowerCase())) return area;
    }
    return location || "";
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
      const category = getField(row, "Category", "category") || "General";
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
        is_critical: !!criticalId,
        critical_spare_id: criticalId,
        asset_tag: assetTag,
        specifications: `${sizeSpec}${sizeSpec && material ? " | " : ""}${material}`,
        notes: remarks,
      };
    });

    return items.filter(item => item.description.trim() !== "");
  };

  // Normalize text for comparison
  const normalizeText = (text: string): string => 
    (text || "").toLowerCase().trim();

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

    // Track items we've seen in this import batch - separate sets
    const seenDescriptions = new Set<string>();
    const seenOEMs = new Set<string>();

    return newItems.map(({ item, source }) => {
      const desc = normalizeText(item.description);
      const oem = normalizeText(item.oem_part_number || "");
      
      let isDuplicate = false;
      let existingItem: SiteSpareItem | undefined;
      let matchReason = "";

      // Check if duplicate within the import batch (either field matches)
      if (desc && seenDescriptions.has(desc)) {
        isDuplicate = true;
        matchReason = "description";
      } else if (oem && seenOEMs.has(oem)) {
        isDuplicate = true;
        matchReason = "OEM part number";
      }
      
      // Check against existing database items (either field matches)
      if (!isDuplicate) {
        if (desc && existingDescriptions.has(desc)) {
          isDuplicate = true;
          existingItem = existingByDesc.get(desc);
          matchReason = "description";
        } else if (oem && existingOEMs.has(oem)) {
          isDuplicate = true;
          existingItem = existingByOEM.get(oem);
          matchReason = "OEM part number";
        }
      }
      
      // Mark as seen for future items in batch
      if (desc) seenDescriptions.add(desc);
      if (oem) seenOEMs.add(oem);
      
      return {
        item,
        existingItem,
        source,
        isDuplicate,
        duplicateType: isDuplicate ? ("exact" as const) : ("none" as const),
        matchReason,
      };
    });
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

    // Filter out duplicates - only import unique items
    const uniqueItems = preview
      .filter((d) => !d.isDuplicate)
      .map((d) => d.item);

    const success = onMerge 
      ? await onMerge(uniqueItems)
      : await onImport(uniqueItems);

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
  };

  const uniqueCount = preview.filter((d) => !d.isDuplicate).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import & Merge Stock Lists
          </DialogTitle>
          <DialogDescription>
            Upload multiple Excel files. Items are flagged as duplicates if the Description OR OEM Part Number already exists.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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
              Importing {uniqueCount} unique items to database...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Preview with Duplicate Summary */}
          {preview.length > 0 && !isImporting && (
            <div className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Unique Items</span>
                  </div>
                  <p className="text-2xl font-bold text-primary mt-1">{uniqueCount}</p>
                  <p className="text-xs text-muted-foreground">Ready to import</p>
                </div>
                <div className={`rounded-lg p-3 ${duplicateCount > 0 ? "bg-amber-500/10" : "bg-muted/50"}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${duplicateCount > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
                    <span className={`text-sm font-medium ${duplicateCount > 0 ? "text-amber-700" : "text-muted-foreground"}`}>
                      Duplicates Found
                    </span>
                  </div>
                  <p className={`text-2xl font-bold mt-1 ${duplicateCount > 0 ? "text-amber-700" : "text-muted-foreground"}`}>
                    {duplicateCount}
                  </p>
                  <p className="text-xs text-muted-foreground">Will be skipped</p>
                </div>
              </div>

              {/* Duplicate Details (if any) */}
              {duplicateCount > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-amber-700 mb-2">
                    Duplicate items (matched by Description OR OEM Part #):
                  </p>
                  <div className="max-h-24 overflow-y-auto text-xs space-y-1">
                    {preview
                      .filter((d) => d.isDuplicate)
                      .slice(0, 10)
                      .map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {d.source}
                          </Badge>
                          <span className="truncate flex-1">{d.item.description}</span>
                          {d.matchReason && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-amber-100 text-amber-700">
                              matched: {d.matchReason}
                            </Badge>
                          )}
                        </div>
                      ))}
                    {duplicateCount > 10 && (
                      <p className="text-muted-foreground">
                        ... and {duplicateCount - 10} more duplicates
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Clear Action Section */}
              <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Ready to Import {uniqueCount} Unique Items
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {duplicateCount > 0 
                        ? `${duplicateCount} duplicates will be skipped automatically`
                        : "No duplicates found - all items are unique"}
                    </p>
                  </div>
                  <Button
                    onClick={handleImport}
                    disabled={uniqueCount === 0 || isProcessing}
                    size="lg"
                    className="gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Import {uniqueCount} Items
                  </Button>
                </div>
              </div>

              {/* Preview of items to import (collapsed by default) */}
              {uniqueCount > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    View items to be imported ({uniqueCount})
                  </summary>
                  <div className="mt-2 max-h-24 overflow-y-auto space-y-1 pl-2">
                    {preview
                      .filter((d) => !d.isDuplicate)
                      .slice(0, 10)
                      .map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-muted-foreground">
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            {d.source}
                          </Badge>
                          <span className="truncate">{d.item.description}</span>
                        </div>
                      ))}
                    {uniqueCount > 10 && (
                      <p className="text-muted-foreground">
                        ... and {uniqueCount - 10} more items
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
