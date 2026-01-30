import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { poCategories, POLineItem } from "@/hooks/usePOImport";
import * as XLSX from "xlsx";

interface POUploadAreaProps {
  onUpload: (
    metadata: {
      supplierName: string;
      category: string;
      dateRangeCovered: string;
      notes: string;
      fileName: string;
      fileType: string;
    },
    lineItems: Omit<POLineItem, "id" | "uploadId">[]
  ) => Promise<void>;
  isProcessing: boolean;
}

export const POUploadArea = ({ onUpload, isProcessing }: POUploadAreaProps) => {
  const [supplierName, setSupplierName] = useState("");
  const [category, setCategory] = useState("Other");
  const [dateRangeCovered, setDateRangeCovered] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const parseExcelFile = async (file: File): Promise<Omit<POLineItem, "id" | "uploadId">[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

          if (jsonData.length < 2) {
            resolve([]);
            return;
          }

          const headers = (jsonData[0] || []).map((h: any) =>
            String(h || "").toLowerCase().replace(/[^a-z0-9]/g, "")
          );

          const findColumn = (patterns: string[]): number => {
            return headers.findIndex((h) =>
              patterns.some((p) => h.includes(p))
            );
          };

          const colMap = {
            poNumber: findColumn(["ponumber", "purchaseorder", "orderno", "pono"]),
            poDate: findColumn(["podate", "orderdate", "date"]),
            description: findColumn(["description", "itemdescription", "desc", "item"]),
            manufacturer: findColumn(["manufacturer", "mfr", "brand", "make"]),
            model: findColumn(["model", "modelnumber", "modelno"]),
            partNumber: findColumn(["partnumber", "partno", "part", "sku", "itemno"]),
            qty: findColumn(["qty", "quantity", "qtyordered"]),
            unitPrice: findColumn(["unitprice", "price", "unitcost", "cost"]),
            totalPrice: findColumn(["totalprice", "total", "amount", "linetotal", "extended"]),
            supplier: findColumn(["supplier", "vendor"]),
          };

          const lineItems: Omit<POLineItem, "id" | "uploadId">[] = [];

          for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;

            const description = colMap.description >= 0 ? String(row[colMap.description] || "") : "";
            if (!description.trim()) continue;

            const parseDate = (val: any): string | null => {
              if (!val) return null;
              if (typeof val === "number") {
                const date = XLSX.SSF.parse_date_code(val);
                if (date) {
                  return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
                }
              }
              const parsed = new Date(val);
              if (!isNaN(parsed.getTime())) {
                return parsed.toISOString().split("T")[0];
              }
              return null;
            };

            const parseNumber = (val: any): number => {
              if (typeof val === "number") return val;
              const str = String(val || "0").replace(/[^0-9.-]/g, "");
              return parseFloat(str) || 0;
            };

            lineItems.push({
              poNumber: colMap.poNumber >= 0 ? String(row[colMap.poNumber] || "") : "",
              poDate: colMap.poDate >= 0 ? parseDate(row[colMap.poDate]) : null,
              supplier: colMap.supplier >= 0 ? String(row[colMap.supplier] || "") : "",
              itemDescription: description,
              manufacturer: colMap.manufacturer >= 0 ? String(row[colMap.manufacturer] || "") : "",
              model: colMap.model >= 0 ? String(row[colMap.model] || "") : "",
              partNumber: colMap.partNumber >= 0 ? String(row[colMap.partNumber] || "") : "",
              qty: colMap.qty >= 0 ? parseNumber(row[colMap.qty]) : 1,
              unitPrice: colMap.unitPrice >= 0 ? parseNumber(row[colMap.unitPrice]) : 0,
              totalPrice: colMap.totalPrice >= 0 ? parseNumber(row[colMap.totalPrice]) : 0,
              extraReferences: "",
              rowIndex: i - 1,
            });
          }

          resolve(lineItems);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !supplierName.trim()) return;

    setIsParsing(true);
    try {
      const lineItems = await parseExcelFile(selectedFile);
      
      if (lineItems.length === 0) {
        console.warn("No line items extracted from file. Check column headers.");
        alert("No data was extracted from the file. Please ensure your spreadsheet has columns for: Description, PO Number, Qty, Price, etc.");
        setIsParsing(false);
        return;
      }

      console.log(`Extracted ${lineItems.length} line items from ${selectedFile.name}`);

      await onUpload(
        {
          supplierName: supplierName.trim(),
          category,
          dateRangeCovered: dateRangeCovered.trim(),
          notes: notes.trim(),
          fileName: selectedFile.name,
          fileType: selectedFile.type || selectedFile.name.split(".").pop() || "",
        },
        lineItems
      );

      // Reset form
      setSupplierName("");
      setCategory("Other");
      setDateRangeCovered("");
      setNotes("");
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse file. Please check the format.");
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload PO Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplierName">Supplier Name *</Label>
            <Input
              id="supplierName"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              placeholder="e.g. PPS Pumps"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {poCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range Covered</Label>
            <Input
              id="dateRange"
              value={dateRangeCovered}
              onChange={(e) => setDateRangeCovered(e.target.value)}
              placeholder="e.g. Jan–Jun 2024"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes about this upload"
              rows={1}
            />
          </div>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <div className="flex flex-col items-center gap-3">
            <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {selectedFile ? selectedFile.name : "Select CSV or Excel file"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supported: .csv, .xlsx, .xls
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
              id="po-file-input"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose File
            </Button>
          </div>
        </div>

        <Button
          onClick={handleUpload}
          disabled={!selectedFile || !supplierName.trim() || isParsing || isProcessing}
          className="w-full"
        >
          {isParsing || isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Extract PO Lines
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
