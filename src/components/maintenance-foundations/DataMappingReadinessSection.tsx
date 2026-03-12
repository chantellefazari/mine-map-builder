import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

type ReadinessStatus = "Ready" | "Partial" | "Not Started";

interface MappingRow {
  sourceTable: string;
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
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "asset_number", targetEntity: "Asset", targetField: "Asset ID / Number", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "asset_name", targetEntity: "Asset", targetField: "Asset Name / Description", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "functional_location", targetEntity: "Asset", targetField: "Functional Location", transformation: "Direct — TCMG-PP-XXX format", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "area_label", targetEntity: "Asset", targetField: "Asset Group / Area", transformation: "Map to D365 Asset Group", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "sub_area", targetEntity: "Asset", targetField: "Sub-Area / Location", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "parent_asset_label", targetEntity: "Asset", targetField: "Parent Asset Reference", transformation: "Lookup parent asset_number", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "pid_tags[]", targetEntity: "Asset", targetField: "P&ID Tag Reference", transformation: "Array → semicolon-delimited string", status: "Ready" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "components (JSONB)", targetEntity: "Asset", targetField: "Sub-Component BOM", transformation: "Flatten JSONB → child asset rows", status: "Partial" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "—", targetEntity: "Asset", targetField: "Criticality Rating", transformation: "Requires classification rule engine", status: "Not Started" },
  { sourceTable: "processing_plant_assets_rev_b", sourceField: "sort_order", targetEntity: "Asset", targetField: "Display Sequence", transformation: "Direct integer mapping", status: "Ready" },
];

const FL_MAPPINGS: MappingRow[] = [
  { sourceTable: "processing_functional_locations", sourceField: "fl_code", targetEntity: "Functional Location", targetField: "Location ID", transformation: "Direct — TCMG-PP-XXX-XXX-XXX", status: "Ready" },
  { sourceTable: "processing_functional_locations", sourceField: "area", targetEntity: "Functional Location", targetField: "Area Name", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_functional_locations", sourceField: "area_code", targetEntity: "Functional Location", targetField: "Area Code", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_functional_locations", sourceField: "sub_area", targetEntity: "Functional Location", targetField: "Sub-Area Name", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_functional_locations", sourceField: "sub_area_code", targetEntity: "Functional Location", targetField: "Sub-Area Code", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "processing_functional_locations", sourceField: "system_name", targetEntity: "Functional Location", targetField: "System Description", transformation: "Direct — no change", status: "Ready" },
];

const PM_MAPPINGS: MappingRow[] = [
  { sourceTable: "pm_master_list", sourceField: "pm_name", targetEntity: "PM Work Order", targetField: "PM Title / Description", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "frequency", targetEntity: "PM Work Order", targetField: "Frequency / Recurrence", transformation: "Map to D365 recurrence pattern", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "discipline", targetEntity: "PM Work Order", targetField: "Trade / Discipline", transformation: "Direct — Mechanical / Electrical / Instrument", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "asset_number", targetEntity: "PM Work Order", targetField: "Linked Asset ID", transformation: "FK lookup to asset register", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "estimated_duration", targetEntity: "PM Work Order", targetField: "Planned Duration", transformation: "Parse text → numeric hours", status: "Partial" },
  { sourceTable: "pm_master_list", sourceField: "tasks (JSONB)", targetEntity: "PM Work Order", targetField: "Task Checklist Lines", transformation: "Flatten JSONB → line items", status: "Partial" },
  { sourceTable: "pm_master_list", sourceField: "required_ppe[]", targetEntity: "PM Work Order", targetField: "Safety Requirements", transformation: "Array → checklist items", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "required_tools[]", targetEntity: "PM Work Order", targetField: "Required Tools", transformation: "Array → resource list", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "skill_level", targetEntity: "PM Work Order", targetField: "Skill / Competency Required", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "pm_master_list", sourceField: "status", targetEntity: "PM Work Order", targetField: "Template Status", transformation: "Map Draft/Active/Locked → D365 status", status: "Ready" },
];

const SPARES_MAPPINGS: MappingRow[] = [
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "site_part_number", targetEntity: "Inventory Item", targetField: "Item Number", transformation: "Direct — TCMG-XXXX format", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "part_name", targetEntity: "Inventory Item", targetField: "Item Description", transformation: "Direct — cleaned description", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "category", targetEntity: "Inventory Item", targetField: "Item Group / Category", transformation: "Map to D365 Item Group", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "criticality", targetEntity: "Inventory Item", targetField: "Criticality Class", transformation: "Direct — Critical / Insurance / Non-Critical", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "bin_location", targetEntity: "Inventory Item", targetField: "Default Warehouse Location", transformation: "Direct — C01-EL-A1 format", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "min_qty / max_qty", targetEntity: "Inventory Item", targetField: "Reorder Point / Max Stock", transformation: "Direct numeric values", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "associated_asset", targetEntity: "Inventory Item", targetField: "Linked Asset Reference", transformation: "Cross-reference asset register", status: "Partial" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "supplier", targetEntity: "Inventory Item", targetField: "Default Vendor", transformation: "Lookup supplier register", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "unit_price", targetEntity: "Inventory Item", targetField: "Standard Cost", transformation: "Direct — AUD value", status: "Ready" },
  { sourceTable: "site_spares / visual_parts_catalogue", sourceField: "lead_time_days", targetEntity: "Inventory Item", targetField: "Lead Time (Days)", transformation: "Direct integer", status: "Ready" },
];

const SUPPLIER_MAPPINGS: MappingRow[] = [
  { sourceTable: "suppliers / practice_suppliers", sourceField: "code", targetEntity: "Vendor", targetField: "Vendor Code", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "name", targetEntity: "Vendor", targetField: "Vendor Name", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "abn", targetEntity: "Vendor", targetField: "ABN / Tax ID", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "email", targetEntity: "Vendor", targetField: "Primary Email", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "contact", targetEntity: "Vendor", targetField: "Primary Contact Name", transformation: "Direct — no change", status: "Ready" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "payment_terms", targetEntity: "Vendor", targetField: "Payment Terms", transformation: "Map to D365 payment terms code", status: "Partial" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "type", targetEntity: "Vendor", targetField: "Vendor Group", transformation: "Map to D365 vendor group", status: "Partial" },
  { sourceTable: "suppliers / practice_suppliers", sourceField: "is_preferred", targetEntity: "Vendor", targetField: "Preferred Vendor Flag", transformation: "Boolean → Yes/No", status: "Ready" },
];

const WO_MAPPINGS: MappingRow[] = [
  { sourceTable: "work_orders", sourceField: "wo_number", targetEntity: "Work Order", targetField: "Work Order Number", transformation: "Direct — WO-XXXXXX format", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "status", targetEntity: "Work Order", targetField: "WO Status", transformation: "Map Open/In Progress/Complete → D365", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "priority", targetEntity: "Work Order", targetField: "Priority Level", transformation: "Direct — Normal / High / Critical", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "work_type", targetEntity: "Work Order", targetField: "Work Order Type", transformation: "Map Breakdown/PM/Project → D365 type", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "asset_id", targetEntity: "Work Order", targetField: "Asset Reference", transformation: "FK lookup to asset register", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "functional_location", targetEntity: "Work Order", targetField: "Functional Location", transformation: "Direct — TCMG-PP-XXX format", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "problem_description", targetEntity: "Work Order", targetField: "Problem Description", transformation: "Direct — free text", status: "Ready" },
  { sourceTable: "work_orders", sourceField: "labour_hours (JSONB)", targetEntity: "Work Order", targetField: "Labour Journal Lines", transformation: "Flatten JSONB → journal entries", status: "Partial" },
];

const ALL_SECTIONS = [
  { title: "1. Asset Register", entity: "Assets → D365 Asset Management", data: ASSET_MAPPINGS },
  { title: "2. Functional Locations", entity: "FL Codes → D365 Functional Locations", data: FL_MAPPINGS },
  { title: "3. Preventive Maintenance", entity: "PM Templates → D365 PM Work Orders", data: PM_MAPPINGS },
  { title: "4. Spare Parts & Inventory", entity: "Spares Catalogue → D365 Inventory Items", data: SPARES_MAPPINGS },
  { title: "5. Supplier Register", entity: "Suppliers → D365 Vendor Master", data: SUPPLIER_MAPPINGS },
  { title: "6. Work Orders", entity: "Work Orders → D365 Work Orders", data: WO_MAPPINGS },
];

const MappingTable = ({ rows }: { rows: MappingRow[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="text-[10px] font-semibold w-[18%]">Source Table</TableHead>
        <TableHead className="text-[10px] font-semibold w-[15%]">Source Field</TableHead>
        <TableHead className="text-[10px] font-semibold w-[18%]">Target Field (D365)</TableHead>
        <TableHead className="text-[10px] font-semibold w-[28%]">Transformation Rule</TableHead>
        <TableHead className="text-[10px] font-semibold w-[10%] text-center">Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {rows.map((row, i) => (
        <TableRow key={i}>
          <TableCell className="text-[10px] font-mono text-muted-foreground">{row.sourceTable}</TableCell>
          <TableCell className="text-[10px] font-mono">{row.sourceField}</TableCell>
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
                Field-level mapping from TCMG source datasets to D365 Asset Management target entities
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
          <p>• <strong>Source System:</strong> TCMG Maintenance Platform (PostgreSQL / Lovable Cloud) — all tables listed in this document are the live source of truth.</p>
          <p>• <strong>Target System:</strong> Microsoft Dynamics 365 Field Service / Asset Management. Field names reference standard D365 entity schemas.</p>
          <p>• <strong>Transformation Rules:</strong> "Direct" means the field value transfers without modification. All other rules describe required ETL logic.</p>
          <p>• <strong>JSONB Fields:</strong> Several source fields store structured data as JSONB. These require flattening into D365-compatible line-item or child-record formats.</p>
          <p>• <strong>Readiness Status:</strong> "Ready" = field populated and validated. "Partial" = data exists but needs transformation or enrichment. "Not Started" = field not yet captured.</p>
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
            <AlertCircle className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
            <p><strong>Asset Criticality Rating:</strong> Classification engine not yet implemented. Requires ABC criticality scoring based on production impact, cost, and lead time.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p><strong>JSONB Flattening:</strong> Components, PM tasks, and labour hours stored as JSONB need ETL scripts to produce flat import files for D365.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p><strong>Duration Parsing:</strong> PM estimated_duration stored as text (e.g. "2-3 hrs") needs standardisation to numeric hours.</p>
          </div>
          <div className="flex gap-2 items-start">
            <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p><strong>Vendor Group Mapping:</strong> Supplier type and payment terms require a formal mapping table to D365 vendor group codes.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
