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
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";
import { Supplier, SupplierType } from "@/hooks/useSuppliers";

interface ImportSupplierDialogProps {
  existingSuppliers: Supplier[];
  onImportSuppliers: (suppliers: Omit<Supplier, "id">[]) => Promise<boolean>;
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
  location: string;
  isPreferred: boolean;
  isDuplicate: boolean;
  matchReason?: string;
  existingMatch?: Supplier;
  batchOriginalItem?: Omit<Supplier, "id">;
  selection: "import" | "existing" | "skip";
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
  return "Trade / General Supplier";
};

export const ImportSupplierDialog = ({ existingSuppliers, onImportSuppliers }: ImportSupplierDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedSupplier[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [showDuplicateReview, setShowDuplicateReview] = useState(false);
  const [currentDuplicateIndex, setCurrentDuplicateIndex] = useState(0);

  const detectDuplicates = useCallback(
    (suppliers: Omit<ParsedSupplier, "isDuplicate" | "matchReason" | "existingMatch" | "batchOriginalItem" | "selection">[]): ParsedSupplier[] => {
      const existingByName = new Map(
        existingSuppliers.map((s) => [s.name.toLowerCase().trim(), s])
      );
      const existingByCode = new Map(
        existingSuppliers.filter((s) => s.code).map((s) => [s.code.toLowerCase().trim(), s])
      );
      const seenNames = new Map<string, Omit<Supplier, "id">>();
      const seenCodes = new Map<string, Omit<Supplier, "id">>();

      return suppliers.map((supplier) => {
        const name = supplier.name.toLowerCase().trim();
        const code = supplier.code.toLowerCase().trim();
        let isDuplicate = false;
        let matchReason: string | undefined;
        let existingMatch: Supplier | undefined;
        let batchOriginalItem: Omit<Supplier, "id"> | undefined;

        // Check by code first (if exists)
        if (code && existingByCode.has(code)) {
          isDuplicate = true;
          existingMatch = existingByCode.get(code);
          matchReason = "code exists in database";
        } else if (code && seenCodes.has(code)) {
          isDuplicate = true;
          batchOriginalItem = seenCodes.get(code);
          matchReason = "duplicate code in file";
        } else if (name && existingByName.has(name)) {
          isDuplicate = true;
          existingMatch = existingByName.get(name);
          matchReason = "name exists in database";
        } else if (name && seenNames.has(name)) {
          isDuplicate = true;
          batchOriginalItem = seenNames.get(name);
          matchReason = "duplicate name in file";
        }

        if (name) seenNames.set(name, supplier);
        if (code) seenCodes.set(code, supplier);

        return { 
          ...supplier, 
          isDuplicate, 
          matchReason, 
          existingMatch, 
          batchOriginalItem,
          selection: isDuplicate ? "existing" : "import"
        };
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

      const suppliers = jsonData
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
            type: mapped.type ? mapSupplierType(mapped.type) : "Trade / General Supplier" as SupplierType,
            workPhone: mapped.workPhone || "",
            mobile: mapped.mobile || "",
            email: mapped.email || "",
            whatUsedFor: mapped.whatUsedFor || "",
            notes: mapped.notes || "",
            location: "",
            isPreferred: false,
          };
        })
        .filter((s) => s.name);

      const withDuplicates = detectDuplicates(suppliers);
      setParsedData(withDuplicates);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const duplicates = parsedData.filter((s) => s.isDuplicate);
  const currentDuplicate = duplicates[currentDuplicateIndex];

  const handleDuplicateSelection = (selection: "import" | "existing") => {
    setParsedData((prev) =>
      prev.map((item) =>
        item === currentDuplicate ? { ...item, selection } : item
      )
    );
    
    if (currentDuplicateIndex < duplicates.length - 1) {
      setCurrentDuplicateIndex((prev) => prev + 1);
    } else {
      setShowDuplicateReview(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const uniqueSuppliers = parsedData
        .filter((s) => !s.isDuplicate || s.selection === "import")
        .map(({ isDuplicate, matchReason, existingMatch, batchOriginalItem, selection, ...supplier }) => supplier);

      const success = await onImportSuppliers(uniqueSuppliers);
      if (success) {
        setParsedData([]);
        setFileName("");
        setShowDuplicateReview(false);
        setCurrentDuplicateIndex(0);
        setOpen(false);
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleClear = () => {
    setParsedData([]);
    setFileName("");
    setShowDuplicateReview(false);
    setCurrentDuplicateIndex(0);
  };

  const handleStartDuplicateReview = () => {
    setCurrentDuplicateIndex(0);
    setShowDuplicateReview(true);
  };

  const uniqueCount = parsedData.filter((s) => !s.isDuplicate).length;
  const duplicateCount = duplicates.length;
  const importingDuplicates = duplicates.filter((d) => d.selection === "import").length;
  const totalToImport = uniqueCount + importingDuplicates;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4 mr-2" />
          Import from Excel
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh]">
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

          {/* Duplicate Review Mode */}
          {showDuplicateReview && currentDuplicate && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Reviewing duplicate {currentDuplicateIndex + 1} of {duplicateCount}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowDuplicateReview(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Exit Review
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 mb-2">
                <p className="text-sm font-medium text-destructive">
                  Duplicate Reason: {currentDuplicate.matchReason}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* New Item */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    currentDuplicate.selection === "import" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => handleDuplicateSelection("import")}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-primary border-primary/30">
                      New (from Excel)
                    </Badge>
                    {currentDuplicate.selection === "import" && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-muted-foreground">Code:</span> {currentDuplicate.code || "-"}</div>
                    <div><span className="text-muted-foreground">Name:</span> <strong>{currentDuplicate.name}</strong></div>
                    <div><span className="text-muted-foreground">Contact:</span> {currentDuplicate.contact || "-"}</div>
                    <div><span className="text-muted-foreground">Type:</span> {currentDuplicate.type}</div>
                    <div><span className="text-muted-foreground">Work Phone:</span> {currentDuplicate.workPhone || "-"}</div>
                    <div><span className="text-muted-foreground">Mobile:</span> {currentDuplicate.mobile || "-"}</div>
                    <div><span className="text-muted-foreground">Email:</span> {currentDuplicate.email || "-"}</div>
                    <div><span className="text-muted-foreground">What Used For:</span> {currentDuplicate.whatUsedFor || "-"}</div>
                  </div>
                </div>

                {/* Existing/Batch Original Item */}
                <div 
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    currentDuplicate.selection === "existing" 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => handleDuplicateSelection("existing")}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">
                      {currentDuplicate.existingMatch ? "Existing (Database)" : "First in Batch"}
                    </Badge>
                    {currentDuplicate.selection === "existing" && (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  {currentDuplicate.existingMatch ? (
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Code:</span> {currentDuplicate.existingMatch.code || "-"}</div>
                      <div><span className="text-muted-foreground">Name:</span> <strong>{currentDuplicate.existingMatch.name}</strong></div>
                      <div><span className="text-muted-foreground">Contact:</span> {currentDuplicate.existingMatch.contact || "-"}</div>
                      <div><span className="text-muted-foreground">Type:</span> {currentDuplicate.existingMatch.type}</div>
                      <div><span className="text-muted-foreground">Work Phone:</span> {currentDuplicate.existingMatch.workPhone || "-"}</div>
                      <div><span className="text-muted-foreground">Mobile:</span> {currentDuplicate.existingMatch.mobile || "-"}</div>
                      <div><span className="text-muted-foreground">Email:</span> {currentDuplicate.existingMatch.email || "-"}</div>
                      <div><span className="text-muted-foreground">What Used For:</span> {currentDuplicate.existingMatch.whatUsedFor || "-"}</div>
                    </div>
                  ) : currentDuplicate.batchOriginalItem ? (
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Code:</span> {currentDuplicate.batchOriginalItem.code || "-"}</div>
                      <div><span className="text-muted-foreground">Name:</span> <strong>{currentDuplicate.batchOriginalItem.name}</strong></div>
                      <div><span className="text-muted-foreground">Contact:</span> {currentDuplicate.batchOriginalItem.contact || "-"}</div>
                      <div><span className="text-muted-foreground">Type:</span> {currentDuplicate.batchOriginalItem.type}</div>
                      <div><span className="text-muted-foreground">Work Phone:</span> {currentDuplicate.batchOriginalItem.workPhone || "-"}</div>
                      <div><span className="text-muted-foreground">Mobile:</span> {currentDuplicate.batchOriginalItem.mobile || "-"}</div>
                      <div><span className="text-muted-foreground">Email:</span> {currentDuplicate.batchOriginalItem.email || "-"}</div>
                      <div><span className="text-muted-foreground">What Used For:</span> {currentDuplicate.batchOriginalItem.whatUsedFor || "-"}</div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No matching record found</div>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button 
                  variant="outline" 
                  disabled={currentDuplicateIndex === 0}
                  onClick={() => setCurrentDuplicateIndex((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => {
                    if (currentDuplicateIndex < duplicates.length - 1) {
                      setCurrentDuplicateIndex((prev) => prev + 1);
                    } else {
                      setShowDuplicateReview(false);
                    }
                  }}
                >
                  {currentDuplicateIndex < duplicates.length - 1 ? "Next" : "Finish Review"}
                </Button>
              </div>
            </div>
          )}

          {/* Results - Not in duplicate review mode */}
          {parsedData.length > 0 && !showDuplicateReview && (
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
                <div 
                  className={`border rounded-lg p-3 ${duplicateCount > 0 ? "bg-destructive/10 border-destructive/30 cursor-pointer hover:bg-destructive/20" : "bg-muted/50 border-border"}`}
                  onClick={duplicateCount > 0 ? handleStartDuplicateReview : undefined}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${duplicateCount > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                    <span className="text-sm font-medium">{duplicateCount} Duplicates</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {duplicateCount > 0 ? `Click to review (${importingDuplicates} selected to import)` : "None found"}
                  </p>
                </div>
              </div>

              {/* Preview Table */}
              <ScrollArea className="h-[250px] border rounded-lg">
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
                        className={supplier.isDuplicate && supplier.selection !== "import" ? "bg-muted/50 opacity-50" : ""}
                      >
                        <td className="p-2">
                          {supplier.isDuplicate ? (
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${supplier.selection === "import" ? "text-primary border-primary/30" : "text-destructive border-destructive/30"}`}
                            >
                              {supplier.selection === "import" ? "import" : "skip"}
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
                    <p className="text-sm font-semibold">Ready to Import {totalToImport} Suppliers</p>
                    <p className="text-xs text-muted-foreground">
                      {duplicateCount > 0 
                        ? `${duplicateCount - importingDuplicates} duplicates will be skipped`
                        : "No duplicates found"}
                    </p>
                  </div>
                  <Button onClick={handleImport} disabled={totalToImport === 0 || isImporting}>
                    {isImporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Import {totalToImport} Suppliers
                      </>
                    )}
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
