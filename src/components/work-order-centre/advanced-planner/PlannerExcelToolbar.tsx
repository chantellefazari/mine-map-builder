import { useState, useRef } from "react";
import { Download, Upload, Loader2, FileSpreadsheet, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { primeDownloadGesture, cancelPrimedDownloadGesture } from "@/utils/safariDownload";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

export function PlannerExcelToolbar({ items }: Props) {
  const [exporting, setExporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    primeDownloadGesture();
    setExporting(true);
    try {
      const { exportPlannerWorkbook } = await import("@/utils/plannerExcelExport");
      const stats = await exportPlannerWorkbook(items);
      toast.success(`Planner workbook exported — ${stats.sheetCount} sheets, ${stats.totalItems} items`);
    } catch (err: any) {
      cancelPrimedDownloadGesture();
      console.error("Planner export error:", err);
      toast.error("Failed to export planner workbook");
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportDialogOpen(true);
    try {
      const { parsePlannerExcel } = await import("@/utils/plannerExcelImport");
      const result = await parsePlannerExcel(file);
      setImportResult(result);
    } catch (err: any) {
      console.error("Import parse error:", err);
      toast.error("Failed to parse Excel file");
      setImportDialogOpen(false);
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
          {exporting ? "Exporting..." : "Export XLSX"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="w-3.5 h-3.5" />
          Import XLSX
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* Import Review Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Import Review
            </DialogTitle>
            <DialogDescription>
              Review the imported data before applying changes.
            </DialogDescription>
          </DialogHeader>

          {importing ? (
            <div className="flex items-center justify-center py-12 gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Parsing workbook...</span>
            </div>
          ) : importResult ? (
            <div className="space-y-4">
              {/* Summary */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="text-sm">
                  <span className="font-medium">{importResult.sheets.length}</span> sheets detected ·{" "}
                  <span className="font-medium">{importResult.totalChanges}</span> total rows
                </div>
                {importResult.hasErrors ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="w-3 h-3" /> Has Errors
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1 bg-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </Badge>
                )}
              </div>

              {/* Per-sheet breakdown */}
              <ScrollArea className="max-h-80">
                <div className="space-y-2">
                  {importResult.sheets.map((cs: any) => (
                    <div key={cs.sheet} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{cs.sheet}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{cs.totalRows} rows</span>
                      </div>
                      {cs.errors.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {cs.errors.map((err: string, idx: number) => (
                            <p key={idx} className="text-xs text-destructive flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                              {err}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => { setImportDialogOpen(false); setImportResult(null); }}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={importResult.hasErrors}
                  onClick={() => {
                    toast.success(`Import staged — ${importResult.totalChanges} rows ready. Review in each tab.`);
                    setImportDialogOpen(false);
                    setImportResult(null);
                  }}
                >
                  Apply Import
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
