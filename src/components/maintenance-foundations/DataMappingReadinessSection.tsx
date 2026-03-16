import { useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertCircle, Clock, Printer, Download, X, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";

type ReadinessStatus = "Ready" | "Partial" | "Not Started";

interface MappingRow {
  field: string;
  sourceDocument: string;
  transformation: string;
  status: ReadinessStatus;
}

const StatusIcon = ({ status }: { status: ReadinessStatus }) => {
  switch (status) {
    case "Ready":
      return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
    case "Partial":
      return <Clock className="w-4 h-4 text-amber-500" />;
    case "Not Started":
      return <AlertCircle className="w-4 h-4 text-destructive" />;
  }
};

const StatusBadge = ({ status }: { status: ReadinessStatus }) => {
  const variant = status === "Ready" ? "default" : status === "Partial" ? "secondary" : "destructive";
  return (
    <Badge variant={variant} className="gap-1 text-[10px]">
      <StatusIcon status={status} />
      {status}
    </Badge>
  );
};

const ASSET_MAPPINGS: MappingRow[] = [
  { field: "Asset Number / ID", sourceDocument: "Asset Register (Asset Tree)", transformation: "Direct: no change", status: "Ready" },
  { field: "Asset Name / Description", sourceDocument: "Asset Register (Asset Tree)", transformation: "Direct: no change", status: "Ready" },
  { field: "Functional Location", sourceDocument: "Functional Location Codes", transformation: "Direct: TCMG-PP-XXX format", status: "Ready" },
  { field: "Asset Group / Area", sourceDocument: "Asset Register (Asset Tree)", transformation: "Map to target system Asset Group", status: "Ready" },
  { field: "Sub-Area / Location", sourceDocument: "Asset Register (Asset Tree)", transformation: "Direct: no change", status: "Ready" },
  { field: "Parent Asset Reference", sourceDocument: "Asset Register (Asset Tree)", transformation: "Lookup parent asset number from hierarchy", status: "Ready" },
  { field: "P&ID Tag Reference", sourceDocument: "Asset Register (Asset Tree)", transformation: "Semicolon-delimited string of linked tags", status: "Ready" },
  { field: "Sub-Component BOM", sourceDocument: "Asset Register (Asset Tree)", transformation: "Flatten Level 7 to child asset rows (15% populated)", status: "Partial" },
  { field: "Criticality Rating", sourceDocument: "Asset Criticality Register", transformation: "Direct: A/B/C rating (117 assets assessed)", status: "Ready" },
  { field: "Display Sequence", sourceDocument: "Asset Register (Asset Tree)", transformation: "Direct integer mapping", status: "Ready" },
];

const FL_MAPPINGS: MappingRow[] = [
  { field: "Location ID", sourceDocument: "Functional Location Codes", transformation: "Direct: TCMG-PP-XXX-XXX-XXX", status: "Ready" },
  { field: "Area Name", sourceDocument: "Functional Location Codes", transformation: "Direct: no change", status: "Ready" },
  { field: "Area Code", sourceDocument: "Functional Location Codes", transformation: "Direct: no change", status: "Ready" },
  { field: "Sub-Area Name", sourceDocument: "Functional Location Codes", transformation: "Direct: no change", status: "Ready" },
  { field: "Sub-Area Code", sourceDocument: "Functional Location Codes", transformation: "Direct: no change", status: "Ready" },
  { field: "System Description", sourceDocument: "Functional Location Codes", transformation: "Direct: no change", status: "Ready" },
];

const PM_MAPPINGS: MappingRow[] = [
  { field: "PM Title / Description", sourceDocument: "PM Templates Pack", transformation: "Direct: no change", status: "Ready" },
  { field: "Frequency / Recurrence", sourceDocument: "PM Templates Pack", transformation: "Map to target system recurrence pattern", status: "Ready" },
  { field: "Trade / Discipline", sourceDocument: "PM Templates Pack", transformation: "Direct: Mechanical, Electrical, Instrument", status: "Ready" },
  { field: "Linked Asset ID", sourceDocument: "PM Templates Pack", transformation: "Cross-reference to Asset Register", status: "Ready" },
  { field: "Planned Duration", sourceDocument: "PM Templates Pack", transformation: "Parse text to numeric hours", status: "Partial" },
  { field: "Task Checklist Lines", sourceDocument: "PM Templates Pack", transformation: "Structured checklist items (85% populated)", status: "Ready" },
  { field: "Safety Requirements (PPE)", sourceDocument: "PM Templates Pack", transformation: "Checklist items per template", status: "Ready" },
  { field: "Required Tools", sourceDocument: "PM Templates Pack", transformation: "Resource list per template", status: "Ready" },
  { field: "Skill / Competency Required", sourceDocument: "PM Templates Pack", transformation: "Direct: no change", status: "Ready" },
  { field: "Template Status", sourceDocument: "PM Templates Pack", transformation: "Map Draft/Active/Locked to target status", status: "Ready" },
];

const SPARES_MAPPINGS: MappingRow[] = [
  { field: "Item Number", sourceDocument: "Site Parts Catalogue", transformation: "Direct: TCMG-XXXX format", status: "Ready" },
  { field: "Item Description", sourceDocument: "Site Parts Catalogue", transformation: "Direct: cleaned description", status: "Ready" },
  { field: "Item Group / Category", sourceDocument: "Site Parts Catalogue", transformation: "Map to target system Item Group", status: "Ready" },
  { field: "Criticality Class", sourceDocument: "Site Parts Catalogue", transformation: "Direct: Critical, Insurance, Non-Critical", status: "Ready" },
  { field: "Default Warehouse Location", sourceDocument: "Site Parts Catalogue", transformation: "Direct: C01-EL-A1 format (pending population)", status: "Partial" },
  { field: "Reorder Point / Max Stock", sourceDocument: "Site Parts Catalogue", transformation: "Direct numeric values (13/2184 populated)", status: "Partial" },
  { field: "Linked Asset Reference", sourceDocument: "Site Parts Catalogue", transformation: "Cross-reference Asset Register (31/2184 linked)", status: "Partial" },
  { field: "Default Vendor", sourceDocument: "Supplier Register", transformation: "Lookup from Supplier Register (505/2184 populated)", status: "Partial" },
  { field: "Standard Cost (AUD)", sourceDocument: "Site Parts Catalogue", transformation: "Direct: AUD value (36/2184 populated)", status: "Partial" },
  { field: "Lead Time (Days)", sourceDocument: "Site Parts Catalogue", transformation: "Direct integer (not yet captured)", status: "Not Started" },
];

const SUPPLIER_MAPPINGS: MappingRow[] = [
  { field: "Vendor Code", sourceDocument: "Supplier Register", transformation: "Direct: no change", status: "Ready" },
  { field: "Vendor Name", sourceDocument: "Supplier Register", transformation: "Direct: no change", status: "Ready" },
  { field: "ABN / Tax ID", sourceDocument: "Supplier Register", transformation: "Direct: no change", status: "Ready" },
  { field: "Primary Email", sourceDocument: "Supplier Register", transformation: "Direct: no change", status: "Ready" },
  { field: "Primary Contact Name", sourceDocument: "Supplier Register", transformation: "Direct: no change", status: "Ready" },
  { field: "Payment Terms", sourceDocument: "Supplier Register", transformation: "Map to target system payment terms code (100%)", status: "Ready" },
  { field: "Vendor Group", sourceDocument: "Supplier Register", transformation: "Map to target system vendor group (100%)", status: "Ready" },
  { field: "Preferred Vendor Flag", sourceDocument: "Supplier Register", transformation: "Boolean to Yes/No", status: "Ready" },
];

const WO_MAPPINGS: MappingRow[] = [
  { field: "Work Order Number", sourceDocument: "Work Order Register", transformation: "Direct: WO-XXXXXX format", status: "Ready" },
  { field: "WO Status", sourceDocument: "Work Order Register", transformation: "Map Open/In Progress/Complete to target system", status: "Ready" },
  { field: "Priority Level", sourceDocument: "Work Order Register", transformation: "Direct: Normal, High, Critical", status: "Ready" },
  { field: "Work Order Type", sourceDocument: "Work Order Register", transformation: "Map Breakdown/PM/Project to target type", status: "Ready" },
  { field: "Asset Reference", sourceDocument: "Work Order Register", transformation: "Cross-reference to Asset Register", status: "Ready" },
  { field: "Functional Location", sourceDocument: "Functional Location Codes", transformation: "Direct: TCMG-PP-XXX format", status: "Ready" },
  { field: "Problem Description", sourceDocument: "Work Order Register", transformation: "Direct: free text", status: "Ready" },
  { field: "Labour Journal Lines", sourceDocument: "Work Order Register", transformation: "Structured entries per work order (0/7 populated)", status: "Partial" },
];

const ALL_SECTIONS = [
  { title: "1. Asset Register", entity: "Asset Tree → Target System Asset Management", data: ASSET_MAPPINGS },
  { title: "2. Functional Locations", entity: "FL Codes Document → Target System Functional Locations", data: FL_MAPPINGS },
  { title: "3. Preventive Maintenance", entity: "PM Templates Pack → Target System PM Work Orders", data: PM_MAPPINGS },
  { title: "4. Spare Parts & Inventory", entity: "Site Parts Catalogue → Target System Inventory Items", data: SPARES_MAPPINGS },
  { title: "5. Supplier Register", entity: "Supplier Register → Target System Vendor Master", data: SUPPLIER_MAPPINGS },
  { title: "6. Work Orders", entity: "Work Order Register → Target System Work Orders", data: WO_MAPPINGS },
];

const MappingTable = ({ rows }: { rows: MappingRow[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-[10px] font-semibold w-[25%]">Field</TableHead>
        <TableHead className="text-[10px] font-semibold w-[22%]">Source Document</TableHead>
        <TableHead className="text-[10px] font-semibold w-[35%]">Transformation / Notes</TableHead>
        <TableHead className="text-[10px] font-semibold w-[10%] text-center">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((row, i) => (
        <TableRow key={i}>
          <TableCell className="text-[10px] font-medium">{row.field}</TableCell>
          <TableCell className="text-[10px] text-muted-foreground">{row.sourceDocument}</TableCell>
          <TableCell className="text-[10px]">{row.transformation}</TableCell>
          <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const DataMappingBody = ({ allRows, ready, partial, notStarted, pct }: {
  allRows: MappingRow[]; ready: number; partial: number; notStarted: number; pct: number;
}) => (
  <>
    {/* Document Header */}
    <Card className="border-t-4 border-t-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">TCMG-STD-DM-001 · Rev 1.0</p>
            <CardTitle className="text-xl mt-1">Data Mapping & Readiness Documentation</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Field-level mapping from TCMG source documents to target system (D365 or equivalent) entities
            </p>
          </div>
          <Badge variant="outline" className="text-xs shrink-0">
            Phase 1 Deliverable
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-lg border bg-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">{allRows.length}</p>
            <p className="text-[10px] text-muted-foreground">Total Fields</p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/20 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-600">{ready}</p>
            <p className="text-[10px] text-muted-foreground">Ready</p>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/20 p-3 text-center">
            <p className="text-2xl font-bold text-amber-500">{partial}</p>
            <p className="text-[10px] text-muted-foreground">Partial</p>
          </div>
          <div className="rounded-lg border bg-red-50 dark:bg-red-950/20 p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{notStarted}</p>
            <p className="text-[10px] text-muted-foreground">Not Started</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Overall Readiness</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Purpose */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Purpose</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground space-y-1.5">
        <p>This document provides a complete field-level mapping of all maintenance data prepared during the TCMG Phase 1 foundation works. It is intended to support the configuration and data migration into D365 Asset Management, or any equivalent CMMS selected by the site.</p>
        <p>Each section below identifies the data fields available, the TCMG source document they originate from, any transformation or formatting required, and the current readiness status.</p>
      </CardContent>
    </Card>

    {/* Legend */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Readiness Legend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <StatusBadge status="Ready" />
            <span className="text-[10px] text-muted-foreground">Field validated and available for import</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="Partial" />
            <span className="text-[10px] text-muted-foreground">Data exists, requires enrichment or completion</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="Not Started" />
            <span className="text-[10px] text-muted-foreground">Field not yet captured, requires future work</span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Mapping Tables */}
    {ALL_SECTIONS.map((section) => {
      const sReady = section.data.filter(r => r.status === "Ready").length;
      return (
        <Card key={section.title}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">{section.title}</CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {sReady}/{section.data.length} Ready
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">{section.entity}</p>
          </CardHeader>
          <CardContent className="p-0">
            <MappingTable rows={section.data} />
          </CardContent>
        </Card>
      );
    })}

    {/* Outstanding Actions */}
    <Card className="border-amber-300 dark:border-amber-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Outstanding Actions for Full Readiness</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <p><strong>Asset Criticality Rating:</strong> Classification engine implemented, 117 assets assessed with A/B/C ratings based on production impact.</p>
        </div>
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <p><strong>PM Task Checklists:</strong> 82 of 97 PM templates now have structured task data populated and validated.</p>
        </div>
        <div className="flex gap-2 items-start">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
          <p><strong>Vendor Group Mapping:</strong> Supplier type and payment terms now 100% populated across all registered vendors.</p>
        </div>
        <div className="flex gap-2 items-start">
          <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p><strong>Component Flattening:</strong> Level 7 components documented in the Asset Tree need to be extracted into individual child asset rows for import into the target system.</p>
        </div>
        <div className="flex gap-2 items-start">
          <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p><strong>Duration Standardisation:</strong> PM estimated duration stored as text (e.g. "2-3 hrs") needs conversion to numeric hours. Only 10 of 97 templates populated.</p>
        </div>
        <div className="flex gap-2 items-start">
          <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p><strong>Inventory Data Enrichment:</strong> Bin locations (0%), lead times (0%), unit costs (2%), min/max stock levels (1%), and asset linkages (1%) require population across 2,184 spare parts.</p>
        </div>
      </CardContent>
    </Card>
  </>
);

export const DataMappingReadinessSection = () => {
  const allRows = ALL_SECTIONS.flatMap(s => s.data);
  const ready = allRows.filter(r => r.status === "Ready").length;
  const partial = allRows.filter(r => r.status === "Partial").length;
  const notStarted = allRows.filter(r => r.status === "Not Started").length;
  const pct = Math.round((ready / allRows.length) * 100);

  const contentRef = useRef<HTMLDivElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [saving, setSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleOpenPreview = useCallback(async () => {
    const el = contentRef.current;
    if (!el) return;
    setCapturing(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      canvasRef.current = canvas;
      setPreviewImage(canvas.toDataURL("image/png"));
      setPreviewOpen(true);
    } catch (err) {
      console.error("Capture error:", err);
      toast.error("Failed to capture content");
    } finally {
      setCapturing(false);
    }
  }, []);

  const handleSavePdf = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      toast.error("Open print preview first");
      return;
    }

    setSaving(true);
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 8;
      const contentW = A4_W - MARGIN * 2;
      const imgRatio = canvas.height / canvas.width;
      const totalImgH = contentW * imgRatio;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      let heightLeft = totalImgH;
      let position = MARGIN;

      pdf.addImage(imgData, "JPEG", MARGIN, position, contentW, totalImgH);
      heightLeft -= A4_H - MARGIN * 2;

      while (heightLeft > 0) {
        pdf.addPage();
        position = MARGIN - (totalImgH - heightLeft);
        pdf.addImage(imgData, "JPEG", MARGIN, position, contentW, totalImgH);
        heightLeft -= A4_H - MARGIN * 2;
      }

      const blob = pdf.output("blob");
      await uploadAndShowPdf(blob, "TCMG-Data-Mapping-Readiness.pdf", "Data Mapping & Readiness");
      toast.success("PDF opened");
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to save PDF");
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <div className="space-y-6" data-pdf-section>
      {/* Section title bar */}
      <div className="flex items-center justify-between print-hide">
        <h2 className="text-lg font-semibold">Data Mapping & Readiness</h2>
        <Button variant="outline" size="sm" onClick={handleOpenPreview} disabled={capturing} className="gap-2">
          {capturing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
          {capturing ? "Capturing…" : "Print"}
        </Button>
      </div>

      {/* Print Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0 [&>button]:hidden" aria-describedby={undefined}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Print Preview — Data Mapping & Readiness</DialogTitle>
            <div className="flex items-center gap-3">
              <Button onClick={handleSavePdf} disabled={saving} className="gap-2">
                <Download className="w-4 h-4" />
                {saving ? "Saving…" : "Save as PDF"}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-muted/50 p-8 flex justify-center">
            {previewImage && (
              <img
                src={previewImage}
                alt="Print preview"
                className="shadow-xl bg-white"
                style={{ maxWidth: "900px", width: "100%", height: "auto" }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Actual content */}
      <div ref={contentRef}>
        <div className="space-y-6">
          <DataMappingBody allRows={allRows} ready={ready} partial={partial} notStarted={notStarted} pct={pct} />
        </div>
      </div>
    </div>
  );
};
