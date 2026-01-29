import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";
import { Supplier, SupplierType, supplierTypes } from "./supplierData";

interface ImportSupplierDialogProps {
  existingSuppliers: Supplier[];
  onImportSuppliers: (suppliers: Omit<Supplier, "id">[]) => void;
}

interface ParsedSupplier {
  supplierName: string;
  supplierType: SupplierType;
  whatTheySupply: string;
  primaryContactName: string;
  phoneNumber: string;
  email: string;
  notes: string;
  isDuplicate: boolean;
  matchReason?: string;
}

const normalizeHeader = (header: string): string => {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
};

const mapSupplierType = (value: string): SupplierType => {
  const normalized = value.toLowerCase().trim();
  if (normalized.includes("oem")) return "OEM";
  if (normalized.includes("critical")) return "Critical Spares Supplier";
  if (normalized.includes("service")) return "Service Provider";
  if (normalized.includes("trade") || normalized.includes("general")) return "Trade / General Supplier";
  return "Trade / General Supplier"; // default
};

export const ImportSupplierDialog = ({ existingSuppliers, onImportSuppliers }: ImportSupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedSupplier[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const detectDuplicates = useCallback(
    (suppliers: Omit<ParsedSupplier, "isDuplicate" | "matchReason">[]): ParsedSupplier[] => {
      const existingNames = new Set(
        existingSuppliers.map((s) => s.supplierName.toLowerCase().trim())
      );
      const seenNames = new Set<string>();

      return suppliers.map((supplier) => {
        const name = supplier.supplierName.toLowerCase().trim();
        let isDuplicate = false;
        let matchReason: string | undefined;

        if (name && existingNames.has(name)) {
          isDuplicate = true;
          matchReason = "exists in register";
        } else if (name && seenNames.has(name)) {
          isDuplicate = true;
          matchReason = "duplicate in file";
        }

        if (name) seenNames.add(name);

        return { ...supplier, isDuplicate, matchReason };
      });
    },
    [existingSuppliers]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const headerMap: Record<string, string> = {};
      if (jsonData.length > 0) {
        Object.keys(jsonData[0]).forEach((key) => {
          const normalized = normalizeHeader(key);
          // Map common header variations
          if (normalized.includes("suppliername") || normalized === "supplier" || normalized === "name") {
            headerMap[key] = "supplierName";
          } else if (normalized.includes("type") || normalized.includes("category")) {
            headerMap[key] = "supplierType";
          } else if (normalized.includes("supply") || normalized.includes("products") || normalized.includes("services")) {
            headerMap[key] = "whatTheySupply";
          } else if (normalized.includes("contact") || normalized.includes("person")) {
            headerMap[key] = "primaryContactName";
          } else if (normalized.includes("phone") || normalized.includes("tel") || normalized.includes("mobile")) {
            headerMap[key] = "phoneNumber";
          } else if (normalized.includes("email") || normalized.includes("mail")) {
            headerMap[key] = "email";
          } else if (normalized.includes("note") || normalized.includes("comment") || normalized.includes("remark")) {
            headerMap[key] = "notes";
          }
        });
      }

      const suppliers: Omit<ParsedSupplier, "isDuplicate" | "matchReason">[] = jsonData
        .map((row) => {
          const mapped: Record<string, string> = {};
          Object.entries(row).forEach(([key, value]) => {
            const mappedKey = headerMap[key];
            if (mappedKey) {
              mapped[mappedKey] = String(value || "").trim();
            }
          });

          return {
            supplierName: mapped.supplierName || "",
            supplierType: mapped.supplierType ? mapSupplierType(mapped.supplierType) : "Trade / General Supplier",
            whatTheySupply: mapped.whatTheySupply || "",
            primaryContactName: mapped.primaryContactName || "",
            phoneNumber: mapped.phoneNumber || "",
            email: mapped.email || "",
            notes: mapped.notes || "",
          };
        })
        .filter((s) => s.supplierName); // Filter out rows without supplier name

      const withDuplicates = detectDuplicates(suppliers);
      setParsedData(withDuplicates);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const uniqueSuppliers = parsedData
      .filter((s) => !s.isDuplicate)
      .map(({ isDuplicate, matchReason, ...supplier }) => supplier);

    onImportSuppliers(uniqueSuppliers);
    setParsedData([]);
    setFileName("");
    setOpen(false);
  };

  const handleClear = () => {
    setParsedData([]);
    setFileName("");
  };

  const uniqueCount = parsedData.filter((s) => !s.isDuplicate).length;
  const duplicateCount = parsedData.filter((s) => s.isDuplicate).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import from Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Import Suppliers from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file with supplier information. Duplicates are detected by Supplier Name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          {parsedData.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload an Excel file (.xlsx, .xls) with columns like:<br />
                Supplier Name, Type, What They Supply, Contact, Phone, Email, Notes
              </p>
              <label htmlFor="supplier-file-upload">
                <Button asChild disabled={isProcessing}>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {isProcessing ? "Processing..." : "Select File"}
                  </span>
                </Button>
              </label>
              <input
                id="supplier-file-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Results */}
          {parsedData.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{fileName}</span>
                  <Badge variant="secondary">{parsedData.length} rows</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{uniqueCount} Unique</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Ready to import</p>
                </div>
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-sm font-medium">{duplicateCount} Duplicates</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Will be skipped</p>
                </div>
              </div>

              {/* Preview Table */}
              <ScrollArea className="h-[300px] border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-medium">Status</th>
                      <th className="text-left p-2 font-medium">Supplier Name</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">What They Supply</th>
                      <th className="text-left p-2 font-medium">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.map((supplier, idx) => (
                      <tr
                        key={idx}
                        className={supplier.isDuplicate ? "bg-muted/50" : ""}
                      >
                        <td className="p-2">
                          {supplier.isDuplicate ? (
                            <Badge variant="outline" className="text-destructive border-destructive/30 text-xs">
                              {supplier.matchReason}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-primary border-primary/30 text-xs">
                              new
                            </Badge>
                          )}
                        </td>
                        <td className="p-2 font-medium">{supplier.supplierName}</td>
                        <td className="p-2">{supplier.supplierType}</td>
                        <td className="p-2 max-w-[150px] truncate">{supplier.whatTheySupply}</td>
                        <td className="p-2">{supplier.primaryContactName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>

              {/* Import Action */}
              <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Ready to Import {uniqueCount} Suppliers</p>
                    <p className="text-xs text-muted-foreground">
                      {duplicateCount > 0 ? `${duplicateCount} duplicates will be skipped` : "No duplicates found"}
                    </p>
                  </div>
                  <Button onClick={handleImport} disabled={uniqueCount === 0 || isProcessing}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Import {uniqueCount} Suppliers
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
