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
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import * as XLSX from "xlsx";
import { type SiteSpareItem } from "@/hooks/useSiteSpares";

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

interface ImportSpareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: Omit<SiteSpareItem, "id">[]) => Promise<boolean>;
}

export const ImportSpareDialog = ({
  open,
  onOpenChange,
  onImport,
}: ImportSpareDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Omit<SiteSpareItem, "id">[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const parseExcelFile = async (file: File): Promise<Omit<SiteSpareItem, "id">[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    const items: Omit<SiteSpareItem, "id">[] = jsonData.map((row: any) => {
      const qty = parseInt(row["QTY"] || row["Qty on Hand"] || row["Quantity"] || row["qty"] || "0") || 0;
      const condition = row["Condition"] || row["condition"] || "";
      const category = row["Category"] || row["category"] || "General";
      const location = row["Location"] || row["location"] || "";
      const binLoc = row["BIN Location"] || row["Bin Location"] || row["Bin"] || "";
      const sizeSpec = row["Size / Specification"] || row["Size"] || "";
      const material = row["Material / Rating"] || row["Material"] || "";
      const description = row["Item Description"] || row["Description"] || row["description"] || "";
      const manufacturer = row["Supplier / Manufacturer"] || row["Manufacturer"] || row["Supplier"] || row["Make"] || "";
      const productCode = row["Product Code"] || row["OEM Part Number"] || row["Part Number"] || "";
      const assetTag = row["Asset Tag / Designation"] || row["Asset Tag"] || row["Designation"] || "";
      const criticalId = row["Critical Spare ID"] || row["CriticalSpareID"] || "";
      const remarks = row["Remarks"] || row["Notes"] || "";
      
      return {
        part_number: "",
        description: description,
        category: mapCategory(category),
        subcategory: "",
        warehouse_area: mapWarehouseArea(location),
        bin_location: binLoc,
        aisle: "",
        rack: "",
        storage_type: row["Storage Type"] || "Shelved",
        qty_on_hand: qty,
        min_qty: 0,
        max_qty: 0,
        reorder_point: 0,
        uom: row["UOM"] || "EA",
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);

    try {
      const items = await parseExcelFile(selectedFile);
      setPreview(items);
      if (items.length === 0) {
        setError("No valid items found in the file. Please check the format.");
      }
    } catch (err) {
      setError("Failed to parse file. Please ensure it's a valid Excel or CSV file.");
      setPreview([]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) return;
    setIsImporting(true);
    const success = await onImport(preview);
    setIsImporting(false);
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview([]);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Import Stock List
          </DialogTitle>
          <DialogDescription>
            Upload an Excel (.xlsx) or CSV file to import your inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              {file ? file.name : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Excel (.xlsx, .xls) or CSV files supported
            </p>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              Processing file...
            </div>
          )}

          {/* Importing State */}
          {isImporting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              Importing {preview.length} items to database...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && !isImporting && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <CheckCircle2 className="h-4 w-4" />
                Ready to import
              </div>
              <p className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{preview.length}</span> items to import.
              </p>
              <div className="mt-3 max-h-32 overflow-y-auto text-xs space-y-1">
                {preview.slice(0, 5).map((item, i) => (
                  <div key={i} className="truncate text-muted-foreground">
                    • {item.description}
                  </div>
                ))}
                {preview.length > 5 && (
                  <div className="text-muted-foreground">
                    ... and {preview.length - 5} more items
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isImporting}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={preview.length === 0 || isProcessing || isImporting}
          >
            {isImporting ? "Importing..." : `Import ${preview.length > 0 ? `${preview.length} Items` : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
