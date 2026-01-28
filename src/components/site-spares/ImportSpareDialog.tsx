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
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import { type SiteSpareItem, categories, warehouseAreas } from "./siteSparesData";

interface ImportSpareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (items: SiteSpareItem[]) => void;
  existingCount: number;
}

export const ImportSpareDialog = ({
  open,
  onOpenChange,
  onImport,
  existingCount,
}: ImportSpareDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<SiteSpareItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getStockStatus = (condition: string, qty: number): SiteSpareItem["status"] => {
    const condLower = (condition || "").toLowerCase();
    if (condLower.includes("repair")) return "Require Repair";
    if (qty === 0) return "Out of Stock";
    return "Active";
  };

  const mapCategory = (cat: string): string => {
    const normalized = (cat || "").trim();
    if (Object.keys(categories).includes(normalized)) return normalized;
    // Try to match partial
    for (const key of Object.keys(categories)) {
      if (normalized.toLowerCase().includes(key.toLowerCase())) return key;
    }
    return "General";
  };

  const mapWarehouseArea = (location: string): string => {
    const loc = (location || "").toUpperCase();
    for (const area of warehouseAreas) {
      if (loc.includes(area)) return area;
    }
    return "A";
  };

  const parseExcelFile = async (file: File): Promise<SiteSpareItem[]> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    const items: SiteSpareItem[] = jsonData.map((row: any, index: number) => {
      const qty = parseInt(row["Qty on Hand"] || row["QtyOnHand"] || row["Quantity"] || row["QTY"] || row["qty"] || "0") || 0;
      const condition = row["Condition"] || row["condition"] || "";
      const category = row["Category"] || row["category"] || "General";
      const location = row["Location"] || row["location"] || row["Warehouse"] || "";
      const binLoc = row["Bin Location"] || row["BIN Location"] || row["Bin"] || "";
      const sizeSpec = row["Size / Specification"] || row["Size"] || row["Specification"] || "";
      const material = row["Material / Rating"] || row["Material"] || "";
      
      return {
        id: `STK-${String(existingCount + index + 1).padStart(4, "0")}`,
        partNumber: "", // Left empty as requested
        description: row["Description"] || row["description"] || row["Item Description"] || "",
        category: mapCategory(category),
        subcategory: row["Subcategory"] || row["subcategory"] || row["Sub Category"] || "",
        warehouseArea: mapWarehouseArea(location),
        binLocation: binLoc,
        aisle: "",
        rack: "",
        storageType: row["Storage Type"] || row["StorageType"] || "Shelved",
        qtyOnHand: qty,
        minQty: parseInt(row["Min Qty"] || row["MinQty"] || row["Minimum"] || "0") || 0,
        maxQty: parseInt(row["Max Qty"] || row["MaxQty"] || row["Maximum"] || "0") || 0,
        reorderPoint: 0,
        uom: row["UOM"] || row["Unit"] || row["Unit of Measure"] || "EA",
        unitCost: 0,
        preferredSupplier: "",
        leadTimeDays: 0,
        lastPurchaseDate: "",
        manufacturer: row["Manufacturer"] || row["manufacturer"] || row["Make"] || "",
        oemPartNumber: row["OEM Part Number"] || row["OEM Part #"] || row["Part Number"] || row["Product Code"] || "",
        alternatePartNumber: "",
        condition: condition,
        status: getStockStatus(condition, qty),
        isCritical: !!(row["Critical Spare ID"] || row["CriticalSpareID"] || row["Critical"]),
        criticalSpareId: row["Critical Spare ID"] || row["CriticalSpareID"] || "",
        assetTag: row["Asset Tag"] || row["AssetTag"] || row["Designation"] || "",
        specifications: `${sizeSpec}${sizeSpec && material ? " | " : ""}${material}`,
        notes: row["Remarks"] || row["Notes"] || "",
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

  const handleImport = () => {
    if (preview.length === 0) return;
    onImport(preview);
    toast({
      title: "Import Successful",
      description: `${preview.length} items have been imported to inventory.`,
    });
    handleClose();
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

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
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
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={preview.length === 0 || isProcessing}
          >
            Import {preview.length > 0 ? `${preview.length} Items` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
