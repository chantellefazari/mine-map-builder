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
import { Supplier, SupplierType } from "./supplierData";

interface ImportSupplierDialogProps {
  existingSuppliers: Supplier[];
  onImportSuppliers: (suppliers: Omit<Supplier, "id">[]) => void;
}

interface ParsedSupplier {
  code: string;
  name: string;
  contact: string;
  type: SupplierType;
  workPhone: string;
  mobile: string;
  email: string;
  whatUsedFor: string;
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
        existingSuppliers.map((s) => s.name.toLowerCase().trim())
      );
      const existingCodes = new Set(
        existingSuppliers.filter((s) => s.code).map((s) => s.code.toLowerCase().trim())
      );
      const seenNames = new Set<string>();
      const seenCodes = new Set<string>();

      return suppliers.map((supplier) => {
        const name = supplier.name.toLowerCase().trim();
        const code = supplier.code.toLowerCase().trim();
        let isDuplicate = false;
        let matchReason: string | undefined;

        // Check by code first (if exists)
        if (code && existingCodes.has(code)) {
          isDuplicate = true;
          matchReason = "code exists";
        } else if (code && seenCodes.has(code)) {
          isDuplicate = true;
          matchReason = "duplicate code in file";
        } else if (name && existingNames.has(name)) {
          isDuplicate = true;
          matchReason = "name exists";
        } else if (name && seenNames.has(name)) {
          isDuplicate = true;
          matchReason = "duplicate name in file";
        }

        if (name) seenNames.add(name);
        if (code) seenCodes.add(code);

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
          if (normalized === "code" || normalized === "suppliercode" || normalized === "supcode") {
            headerMap[key] = "code";
          } else if (normalized === "name" || normalized === "suppliername" || normalized === "supplier") {
            headerMap[key] = "name";
          } else if (normalized === "contact" || normalized === "contactname" || normalized === "person") {
            headerMap[key] = "contact";
          } else if (normalized === "type" || normalized === "suppliertype" || normalized === "category") {
            headerMap[key] = "type";
          } else if (normalized === "workphone" || normalized === "phone" || normalized === "tel" || normalized === "landline") {
            headerMap[key] = "workPhone";
          } else if (normalized === "mobile" || normalized === "cell" || normalized === "mobilephone") {
            headerMap[key] = "mobile";
          } else if (normalized === "email" || normalized === "emailaddress" || normalized === "mail") {
            headerMap[key] = "email";
          } else if (normalized === "whatusedfor" || normalized === "usedfor" || normalized === "supply" || normalized === "products" || normalized === "services") {
            headerMap[key] = "whatUsedFor";
          } else if (normalized === "notes" || normalized === "comments" || normalized === "remarks") {
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
            code: mapped.code || "",
            name: mapped.name || "",
            contact: mapped.contact || "",
            type: mapped.type ? mapSupplierType(mapped.type) : "Trade / General Supplier",
            workPhone: mapped.workPhone || "",
            mobile: mapped.mobile || "",
            email: mapped.email || "",
            whatUsedFor: mapped.whatUsedFor || "",
            notes: mapped.notes || "",
          };
        })
        .filter((s) => s.name); // Filter out rows without supplier name

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
      <DialogContent className="sm:max-w-[750px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Import Suppliers from Excel</DialogTitle>
          <DialogDescription>
            Upload an Excel file with supplier information. Duplicates are detected by Code or Name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          {parsedData.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload an Excel file (.xlsx, .xls) with columns like:<br />
                Code, Name, Contact, Type, Work Phone, Mobile, Email, What Used For
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
                      <th className="text-left p-2 font-medium">Code</th>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Type</th>
                      <th className="text-left p-2 font-medium">Contact</th>
                      <th className="text-left p-2 font-medium">What Used For</th>
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
                        <td className="p-2">{supplier.code}</td>
                        <td className="p-2 font-medium">{supplier.name}</td>
                        <td className="p-2">{supplier.type}</td>
                        <td className="p-2">{supplier.contact}</td>
                        <td className="p-2 max-w-[150px] truncate">{supplier.whatUsedFor}</td>
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
