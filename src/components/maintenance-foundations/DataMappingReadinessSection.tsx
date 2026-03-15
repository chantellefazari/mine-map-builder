import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

type ReadinessStatus = "Ready" | "Partial" | "Not Started";

interface MappingRow {
  sourceDocument: string;
  sourceField: string;
  targetEntity: string;
  targetField: string;
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
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Asset Number", targetEntity: "Asset", targetField: "Asset ID / Number", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Asset Name", targetEntity: "Asset", targetField: "Asset Name / Description", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "Functional Location", targetEntity: "Asset", targetField: "Functional Location", transformation: "Direct: TCMG-PP-XXX format", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Area", targetEntity: "Asset", targetField: "Asset Group / Area", transformation: "Map to target system Asset Group", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Sub-Area", targetEntity: "Asset", targetField: "Sub-Area / Location", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Parent Asset", targetEntity: "Asset", targetField: "Parent Asset Reference", transformation: "Lookup parent asset number from hierarchy", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "P&ID Tags", targetEntity: "Asset", targetField: "P&ID Tag Reference", transformation: "Semicolon-delimited string of linked tags", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Level 7 Components", targetEntity: "Asset", targetField: "Sub-Component BOM", transformation: "Flatten to child asset rows (15% populated)", status: "Partial" },
  { sourceDocument: "Asset Criticality Register", sourceField: "Criticality Rating", targetEntity: "Asset", targetField: "Criticality Rating", transformation: "Direct: A/B/C rating (117 assets assessed)", status: "Ready" },
  { sourceDocument: "Asset Register (Asset Tree)", sourceField: "Sort Order", targetEntity: "Asset", targetField: "Display Sequence", transformation: "Direct integer mapping", status: "Ready" },
];

const FL_MAPPINGS: MappingRow[] = [
  { sourceDocument: "Functional Location Codes", sourceField: "FL Code", targetEntity: "Functional Location", targetField: "Location ID", transformation: "Direct: TCMG-PP-XXX-XXX-XXX", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "Area Name", targetEntity: "Functional Location", targetField: "Area Name", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "Area Code", targetEntity: "Functional Location", targetField: "Area Code", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "Sub-Area Name", targetEntity: "Functional Location", targetField: "Sub-Area Name", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "Sub-Area Code", targetEntity: "Functional Location", targetField: "Sub-Area Code", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "System Description", targetEntity: "Functional Location", targetField: "System Description", transformation: "Direct: no change", status: "Ready" },
];

const PM_MAPPINGS: MappingRow[] = [
  { sourceDocument: "PM Templates Pack", sourceField: "PM Title", targetEntity: "PM Work Order", targetField: "PM Title / Description", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Frequency", targetEntity: "PM Work Order", targetField: "Frequency / Recurrence", transformation: "Map to target system recurrence pattern", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Discipline", targetEntity: "PM Work Order", targetField: "Trade / Discipline", transformation: "Direct: Mechanical, Electrical, Instrument", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Linked Asset Number", targetEntity: "PM Work Order", targetField: "Linked Asset ID", transformation: "Cross-reference to Asset Register", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Estimated Duration", targetEntity: "PM Work Order", targetField: "Planned Duration", transformation: "Parse text to numeric hours", status: "Partial" },
  { sourceDocument: "PM Templates Pack", sourceField: "Task Checklist", targetEntity: "PM Work Order", targetField: "Task Checklist Lines", transformation: "Structured checklist items (85% populated)", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Required PPE", targetEntity: "PM Work Order", targetField: "Safety Requirements", transformation: "Checklist items per template", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Required Tools", targetEntity: "PM Work Order", targetField: "Required Tools", transformation: "Resource list per template", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Skill Level", targetEntity: "PM Work Order", targetField: "Skill / Competency Required", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "PM Templates Pack", sourceField: "Template Status", targetEntity: "PM Work Order", targetField: "Template Status", transformation: "Map Draft/Active/Locked to target status", status: "Ready" },
];

const SPARES_MAPPINGS: MappingRow[] = [
  { sourceDocument: "Site Parts Catalogue", sourceField: "Site Part Number", targetEntity: "Inventory Item", targetField: "Item Number", transformation: "Direct: TCMG-XXXX format", status: "Ready" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Part Name", targetEntity: "Inventory Item", targetField: "Item Description", transformation: "Direct: cleaned description", status: "Ready" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Category", targetEntity: "Inventory Item", targetField: "Item Group / Category", transformation: "Map to target system Item Group", status: "Ready" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Criticality", targetEntity: "Inventory Item", targetField: "Criticality Class", transformation: "Direct: Critical, Insurance, Non-Critical", status: "Ready" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Bin Location", targetEntity: "Inventory Item", targetField: "Default Warehouse Location", transformation: "Direct: C01-EL-A1 format (pending population)", status: "Partial" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Min Qty / Max Qty", targetEntity: "Inventory Item", targetField: "Reorder Point / Max Stock", transformation: "Direct numeric values (13/2184 populated)", status: "Partial" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Associated Asset", targetEntity: "Inventory Item", targetField: "Linked Asset Reference", transformation: "Cross-reference Asset Register (31/2184 linked)", status: "Partial" },
  { sourceDocument: "Supplier Register", sourceField: "Supplier Name", targetEntity: "Inventory Item", targetField: "Default Vendor", transformation: "Lookup from Supplier Register (505/2184 populated)", status: "Partial" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Unit Price", targetEntity: "Inventory Item", targetField: "Standard Cost", transformation: "Direct: AUD value (36/2184 populated)", status: "Partial" },
  { sourceDocument: "Site Parts Catalogue", sourceField: "Lead Time (Days)", targetEntity: "Inventory Item", targetField: "Lead Time (Days)", transformation: "Direct integer (not yet captured)", status: "Not Started" },
];

const SUPPLIER_MAPPINGS: MappingRow[] = [
  { sourceDocument: "Supplier Register", sourceField: "Vendor Code", targetEntity: "Vendor", targetField: "Vendor Code", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "Vendor Name", targetEntity: "Vendor", targetField: "Vendor Name", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "ABN", targetEntity: "Vendor", targetField: "ABN / Tax ID", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "Email", targetEntity: "Vendor", targetField: "Primary Email", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "Contact Name", targetEntity: "Vendor", targetField: "Primary Contact Name", transformation: "Direct: no change", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "Payment Terms", targetEntity: "Vendor", targetField: "Payment Terms", transformation: "Map to target system payment terms code (100% populated)", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "Supplier Type", targetEntity: "Vendor", targetField: "Vendor Group", transformation: "Map to target system vendor group (100% populated)", status: "Ready" },
  { sourceDocument: "Supplier Register", sourceField: "Preferred Supplier", targetEntity: "Vendor", targetField: "Preferred Vendor Flag", transformation: "Boolean to Yes/No", status: "Ready" },
];

const WO_MAPPINGS: MappingRow[] = [
  { sourceDocument: "Work Order Register", sourceField: "WO Number", targetEntity: "Work Order", targetField: "Work Order Number", transformation: "Direct: WO-XXXXXX format", status: "Ready" },
  { sourceDocument: "Work Order Register", sourceField: "Status", targetEntity: "Work Order", targetField: "WO Status", transformation: "Map Open/In Progress/Complete to target system", status: "Ready" },
  { sourceDocument: "Work Order Register", sourceField: "Priority", targetEntity: "Work Order", targetField: "Priority Level", transformation: "Direct: Normal, High, Critical", status: "Ready" },
  { sourceDocument: "Work Order Register", sourceField: "Work Type", targetEntity: "Work Order", targetField: "Work Order Type", transformation: "Map Breakdown/PM/Project to target type", status: "Ready" },
  { sourceDocument: "Work Order Register", sourceField: "Asset Reference", targetEntity: "Work Order", targetField: "Asset Reference", transformation: "Cross-reference to Asset Register", status: "Ready" },
  { sourceDocument: "Functional Location Codes", sourceField: "Functional Location", targetEntity: "Work Order", targetField: "Functional Location", transformation: "Direct: TCMG-PP-XXX format", status: "Ready" },
  { sourceDocument: "Work Order Register", sourceField: "Problem Description", targetEntity: "Work Order", targetField: "Problem Description", transformation: "Direct: free text", status: "Ready" },
  { sourceDocument: "Work Order Register", sourceField: "Labour Hours", targetEntity: "Work Order", targetField: "Labour Journal Lines", transformation: "Structured entries per work order (0/7 populated)", status: "Partial" },
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
        <TableHead className="text-[10px] font-semibold w-[18%]">Source Document</TableHead>
        <TableHead className="text-[10px] font-semibold w-[15%]">Source Field</TableHead>
        <TableHead className="text-[10px] font-semibold w-[18%]">Target Field</TableHead>
        <TableHead className="text-[10px] font-semibold w-[28%]">Transformation Rule</TableHead>
        <TableHead className="text-[10px] font-semibold w-[10%] text-center">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((row, i) => (
        <TableRow key={i}>
          <TableCell className="text-[10px] text-muted-foreground">{row.sourceDocument}</TableCell>
          <TableCell className="text-[10px] font-medium">{row.sourceField}</TableCell>
          <TableCell className="text-[10px] font-medium">{row.targetField}</TableCell>
          <TableCell className="text-[10px]">{row.transformation}</TableCell>
          <TableCell className="text-center"><StatusBadge status={row.status} /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export const DataMappingReadinessSection = () => {
  const allRows = ALL_SECTIONS.flatMap(s => s.data);
  const ready = allRows.filter(r => r.status === "Ready").length;
  const partial = allRows.filter(r => r.status === "Partial").length;
  const notStarted = allRows.filter(r => r.status === "Not Started").length;
  const pct = Math.round((ready / allRows.length) * 100);

  return (
    <div className="space-y-6" data-pdf-section>
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
          {/* Readiness Summary */}
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

      {/* Scope & Assumptions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Scope & Assumptions</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-1.5">
          <p>• <strong>Source Documents:</strong> All data originates from the TCMG Maintenance Foundation Pack, delivered as PDF documents. Each mapping row references the specific document containing the source data.</p>
          <p>• <strong>Target System:</strong> Microsoft Dynamics 365 Field Service / Asset Management, or any equivalent CMMS. Field names reference standard entity schemas.</p>
          <p>• <strong>Transformation Rules:</strong> "Direct" means the field value transfers without modification. All other rules describe required data entry or conversion logic.</p>
          <p>• <strong>Readiness Status:</strong> "Ready" = field populated, validated, and available in the source document. "Partial" = data exists but requires enrichment or completion. "Not Started" = field not yet captured in any deliverable.</p>
          <p>• <strong>Source Document Index:</strong> Asset Register (Asset Tree), Functional Location Codes, PM Templates Pack, Site Parts Catalogue, Supplier Register, Work Order Register, Asset Criticality Register, Naming Convention Standard.</p>
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
    </div>
  );
};
