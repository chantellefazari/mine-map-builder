import { useState, useEffect } from "react";
import { Database, Download, Loader2, FileSpreadsheet, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { downloadCsv, primeDownloadGesture, cancelPrimedDownloadGesture } from "@/utils/safariDownload";

const CSV_FIELDS = [
  "part_number", "description", "category", "subcategory", "manufacturer",
  "oem_part_number", "alternate_part_number", "preferred_supplier",
  "warehouse_area", "aisle", "rack", "bin_location", "storage_type",
  "qty_on_hand", "min_qty", "max_qty", "reorder_point", "unit_cost",
  "uom", "lead_time_days", "last_purchase_date", "condition", "status",
  "is_critical", "critical_spare_id", "asset_tag", "specifications", "notes",
] as const;

const CSV_HEADERS = [
  "Part Number", "Description", "Category", "Subcategory", "Manufacturer",
  "OEM Part Number", "Alternate Part Number", "Preferred Supplier",
  "Warehouse Area", "Aisle", "Rack", "Bin Location", "Storage Type",
  "Qty On Hand", "Min Qty", "Max Qty", "Reorder Point", "Unit Cost",
  "UOM", "Lead Time (Days)", "Last Purchase Date", "Condition", "Status",
  "Is Critical", "Critical Spare ID", "Asset Tag", "Specifications", "Notes",
];

function escapeCSV(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const DataCentreWorkbook = () => {
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadingWorkbook, setDownloadingWorkbook] = useState(false);

  useEffect(() => {
    supabase
      .from("site_spares")
      .select("id", { count: "exact", head: true })
      .then(({ count }) => setTotalCount(count ?? 0));
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const allRows: any[] = [];
      let offset = 0;
      const batchSize = 500;
      while (true) {
        const { data, error } = await supabase
          .from("site_spares")
          .select(CSV_FIELDS.join(","))
          .order("created_at", { ascending: true })
          .order("id", { ascending: true })
          .range(offset, offset + batchSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        allRows.push(...data);
        if (data.length < batchSize) break;
        offset += batchSize;
      }

      const lines = [CSV_HEADERS.join(",")];
      for (const row of allRows) {
        lines.push(CSV_FIELDS.map((f) => escapeCSV(row[f])).join(","));
      }

      const dateStamp = new Date().toISOString().slice(0, 10);
      downloadCsv(lines.join("\n"), `TCMG_Site_Spares_Complete_${dateStamp}.csv`);
      toast.success(`Exported ${allRows.length} parts to CSV`);
    } catch (err: any) {
      console.error("CSV export error:", err);
      toast.error("Failed to export CSV");
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadWorkbook = async () => {
    primeDownloadGesture();
    setDownloadingWorkbook(true);
    try {
      const { exportDeliverableWorkbook } = await import("@/utils/exportDeliverableWorkbook");
      const stats = await exportDeliverableWorkbook();
      toast.success(`Deliverable workbook exported — ${stats.sheetCount} sheets, ${stats.assetRows} assets, ${stats.totalSpares} spares`);
    } catch (err: any) {
      cancelPrimedDownloadGesture();
      console.error("Workbook export error:", err);
      toast.error("Failed to export deliverable workbook");
    } finally {
      setDownloadingWorkbook(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Database className="w-3.5 h-3.5 text-primary" />
        </div>
        <div className="text-sm">
          <p className="text-foreground font-medium">
            Complete site data exports for deliverable submission.
          </p>
          <p className="text-muted-foreground mt-1">
            Download individual CSV exports or the consolidated multi-tab XLSX deliverable workbook for TCMG handover.
          </p>
        </div>
      </div>

      {/* Deliverable Workbook Card */}
      <div className="bg-card border-2 border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">TCMG Site Deliverable Workbook</h3>
              <p className="text-sm text-muted-foreground">
                11 sheets · Asset Register · Criticality · Spares · PMs · Naming · FLs · Lifecycle · Stock Codes · Hierarchy
              </p>
            </div>
          </div>

          <Button onClick={handleDownloadWorkbook} disabled={downloadingWorkbook} className="gap-2" variant="default">
            {downloadingWorkbook ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloadingWorkbook ? "Building Workbook..." : "Download Deliverable XLSX"}
          </Button>
        </div>

        {/* Sheet list */}
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Included sheets:</p>
          <div className="flex flex-wrap gap-1.5">
            {[
              "Document Register",
              "Asset Register",
              "Asset Criticality",
              "Critical Spares",
              "Complete Spares",
              "PM Templates",
              "Naming Conventions",
              "Functional Locations",
              "Lifecycle & Condition",
            ].map((s) => (
              <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CSV Download Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Site Spares Complete CSV</h3>
              <p className="text-sm text-muted-foreground">
                {totalCount !== null ? (
                  <>{totalCount.toLocaleString()} parts · {CSV_FIELDS.length} data fields · CSV format</>
                ) : (
                  "Loading count..."
                )}
              </p>
            </div>
          </div>

          <Button onClick={handleDownload} disabled={downloading} className="gap-2" variant="outline">
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Exporting..." : "Download Complete CSV"}
          </Button>
        </div>

        {/* Field list */}
        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Included fields:</p>
          <div className="flex flex-wrap gap-1.5">
            {CSV_HEADERS.map((h) => (
              <span key={h} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
