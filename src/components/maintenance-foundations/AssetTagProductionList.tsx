import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Factory, Search, Download, ChevronLeft, ChevronRight, Square, Circle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface TaggedAsset {
  asset_name: string;
  asset_number: string;
  parent_asset_label: string;
  pid_tags: string[];
  area_label: string;
  sub_area: string;
  functional_location: string | null;
}

// ── Type A: Major fixed infrastructure that IS the structure ──
// Tags are flat plates permanently mounted directly to the asset.
const TYPE_A_PATTERNS = [
  /TK/i,        // Tanks
  /^BM/i,       // Ball Mills
  /CV|BC/i,     // Conveyors / Belt Conveyors
  /FE/i,        // Feeders (vibrating/apron - bolted to structure)
  /CH/i,        // Chutes
  /HP/i,        // Hoppers
  /CY/i,        // Cyclones (welded cluster)
  /TH/i,        // Thickener
  /FP/i,        // Filter Press (frame)
  /PIPE/i,      // Pipes / Lines (pipe stand or support)
  /PND|SMP/i,   // Ponds / Sumps
  /CELL/i,      // EW Cells (fixed tanks)
  /ARCV/i,      // Air Receivers (pressure vessels)
  /RO/i,        // RO Plant (skid)
  /COMP01$/i,   // Compressed Air System (skid)
  /^EW/i,       // Electrowinning (structure)
  /SSTK/i,      // Safety Shower Tank
  /^RCFD/i,     // Reclaim system structure
  /^MFCV/i,     // Mill Feed Conveyor
  /^TRCV/i,     // Transfer Conveyor
];

// ── Type B: Removable equipment at a P&ID position ──
// Tags mounted to nearby structure with bolt or cable tie.
const TYPE_B_PATTERNS = [
  /PMP|PU|PA\d|PB\d|SSPA|SSPB|ASDP|HPP|RP|LPPA|LPPB/i,  // Pumps
  /VLV/i,       // Valves
  /MTR/i,       // Motors
  /GBX|GB/i,    // Gearboxes
  /AGT|AG/i,    // Agitators (removable drive)
  /HPAC/i,      // HP Air Compressors (packaged unit)
  /AFLT/i,      // Air Filters
  /CLR|FA-/i,   // Coolers / Fans
  /FL[AB]/i,    // Lube Filters
  /DSP|DP/i,    // Dosing Pumps
  /SCR|SS/i,    // Screens (removable assemblies)
  /GEN/i,       // Generators
  /TTV/i,       // TechTaylor Valves
  /MK/i,        // Hoists
  /LUB|LS/i,    // Lube systems (packaged skid — position tag)
  /SCV/i,       // Scats Conveyor (small removable)
  /FBB|LDCH/i,  // Feed Boiler Box / Loading Chute
];

interface ProductionTag {
  assetName: string;
  assetNumber: string;
  pidTag: string;
  parentSystem: string;
  tagType: "A" | "B";
  mountingLocation: string;
  mountingMethod: string;
  areaLabel: string;
  subArea: string;
}

function classifyTagType(assetNumber: string, assetName: string): "A" | "B" {
  // Check Type A first (fixed infrastructure)
  for (const pattern of TYPE_A_PATTERNS) {
    if (pattern.test(assetNumber)) return "A";
  }
  // Check Type B (removable equipment positions)
  for (const pattern of TYPE_B_PATTERNS) {
    if (pattern.test(assetNumber)) return "B";
  }
  // Fallback: check asset name for clues
  const nameLower = assetName.toLowerCase();
  if (/tank|conveyor|hopper|chute|thickener|cyclone|sump|pond|pipe|cell|receiver/.test(nameLower)) return "A";
  if (/pump|valve|motor|gearbox|agitator|instrument|filter|compressor|screen|generator|hoist/.test(nameLower)) return "B";
  // Default to B (position tag) for safety
  return "B";
}

function inferMountingLocation(tagType: "A" | "B", assetName: string, assetNumber: string): string {
  if (tagType === "A") {
    const n = assetName.toLowerCase();
    if (/tank/.test(n)) return "Tank shell or support leg";
    if (/conveyor|belt/.test(n)) return "Conveyor frame or stringer";
    if (/hopper/.test(n)) return "Hopper frame or skirt";
    if (/chute/.test(n)) return "Chute support structure";
    if (/cyclone/.test(n)) return "Cyclone cluster frame";
    if (/thickener/.test(n)) return "Thickener handrail or column";
    if (/filter press/.test(n)) return "Filter press main frame";
    if (/pipe/.test(n)) return "Pipe stand or support bracket";
    if (/sump|pond/.test(n)) return "Sump edge wall or bollard";
    if (/cell/.test(n)) return "Cell tank shell";
    if (/receiver/.test(n)) return "Vessel shell or support leg";
    if (/ro plant/.test(n)) return "RO skid frame";
    if (/mill/.test(n)) return "Mill foundation pedestal or guard";
    if (/feeder/.test(n)) return "Feeder support frame";
    return "Fixed structure or frame";
  }
  // Type B
  const n = assetName.toLowerCase();
  if (/pump/.test(n)) return "Pump baseplate or adjacent steelwork";
  if (/valve/.test(n)) return "Pipe support near valve body";
  if (/motor/.test(n)) return "Motor mounting bracket or guard";
  if (/gearbox/.test(n)) return "Gearbox mounting frame";
  if (/agitator/.test(n)) return "Agitator mounting platform railing";
  if (/compressor/.test(n)) return "Compressor skid frame";
  if (/screen/.test(n)) return "Screen support frame";
  if (/filter/.test(n)) return "Filter housing bracket";
  if (/fan|cooler/.test(n)) return "Fan guard or support frame";
  if (/generator/.test(n)) return "Generator skid frame";
  if (/hoist|crane/.test(n)) return "Hoist gantry beam or column";
  if (/lube/.test(n)) return "Lube unit skid or adjacent steelwork";
  if (/dosing/.test(n)) return "Dosing skid or pipe support";
  return "Adjacent fixed steelwork or support";
}

function inferMountingMethod(tagType: "A" | "B"): string {
  return tagType === "A"
    ? "Adhesive plate or rivet to fixed surface"
    : "Bolt or cable tie to nearby structure";
}

function buildProductionList(assets: TaggedAsset[]): ProductionTag[] {
  const list: ProductionTag[] = [];
  for (const a of assets) {
    const tagType = classifyTagType(a.asset_number, a.asset_name);
    list.push({
      assetName: a.asset_name,
      assetNumber: a.asset_number,
      pidTag: a.pid_tags.join("; "),
      parentSystem: a.parent_asset_label,
      tagType,
      mountingLocation: inferMountingLocation(tagType, a.asset_name, a.asset_number),
      mountingMethod: inferMountingMethod(tagType),
      areaLabel: a.area_label,
      subArea: a.sub_area,
    });
  }
  return list;
}

const PAGE_SIZE = 50;

export const AssetTagProductionList = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["pid-tagged-assets-register"],
    queryFn: async (): Promise<TaggedAsset[]> => {
      const allRows: TaggedAsset[] = [];
      let from = 0;
      const batchSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("processing_plant_assets_rev_b")
          .select("asset_name, asset_number, parent_asset_label, pid_tags, area_label, sub_area, functional_location")
          .not("pid_tags", "is", null)
          .order("sort_order", { ascending: true })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        const filtered = (data as any[]).filter(
          (r) => Array.isArray(r.pid_tags) && r.pid_tags.length > 0
        );
        allRows.push(...filtered);
        if (data.length < batchSize) break;
        from += batchSize;
      }
      return allRows;
    },
    staleTime: 5 * 60 * 1000,
  });

  const productionList = useMemo(() => buildProductionList(assets), [assets]);

  const totals = useMemo(() => {
    const a = productionList.filter((t) => t.tagType === "A").length;
    const b = productionList.filter((t) => t.tagType === "B").length;
    return { typeA: a, typeB: b, total: a + b };
  }, [productionList]);

  const filtered = useMemo(() => {
    let list = productionList;
    if (typeFilter !== "all") {
      list = list.filter((t) => t.tagType === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.assetName.toLowerCase().includes(q) ||
          t.assetNumber.toLowerCase().includes(q) ||
          t.pidTag.toLowerCase().includes(q) ||
          t.parentSystem.toLowerCase().includes(q)
      );
    }
    return list;
  }, [productionList, typeFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleExport = () => {
    const rows = filtered.map((t, idx) => ({
      "#": idx + 1,
      "Asset Name": t.assetName,
      "Asset Number": t.assetNumber,
      "P&ID Tag": t.pidTag,
      "Parent System": t.parentSystem,
      "Tag Type": `Type ${t.tagType}`,
      "Mounting Location": t.mountingLocation,
      "Mounting Method": t.mountingMethod,
      "Area": t.areaLabel,
      "Sub-Area": t.subArea,
    }));

    // Add summary rows
    rows.push({} as any);
    rows.push({ "#": "" as any, "Asset Name": "SUMMARY", "Asset Number": "", "P&ID Tag": "", "Parent System": "", "Tag Type": "", "Mounting Location": "", "Mounting Method": "", "Area": "", "Sub-Area": "" });
    rows.push({ "#": "" as any, "Asset Name": "Total TYPE A (Major Asset Plates)", "Asset Number": String(totals.typeA), "P&ID Tag": "", "Parent System": "", "Tag Type": "", "Mounting Location": "", "Mounting Method": "", "Area": "", "Sub-Area": "" });
    rows.push({ "#": "" as any, "Asset Name": "Total TYPE B (Equipment Position Tags)", "Asset Number": String(totals.typeB), "P&ID Tag": "", "Parent System": "", "Tag Type": "", "Mounting Location": "", "Mounting Method": "", "Area": "", "Sub-Area": "" });
    rows.push({ "#": "" as any, "Asset Name": "TOTAL TAGS REQUIRED", "Asset Number": String(totals.total), "P&ID Tag": "", "Parent System": "", "Tag Type": "", "Mounting Location": "", "Mounting Method": "", "Area": "", "Sub-Area": "" });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tag Production List");
    XLSX.writeFile(wb, "Asset_Tag_Production_List_Tennant_Creek.xlsx");
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-5 space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Factory className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                Asset Tag Production List – Tennant Creek
              </h3>
              <p className="text-xs text-muted-foreground">
                Manufacturing batch list. Tags identify P&ID equipment <strong>positions</strong>, not the removable equipment.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              {totals.total} tags
            </Badge>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export XLSX
            </Button>
          </div>
        </div>

        <Separator />

        {/* Tag Type Legend + Totals */}
        <div className="grid sm:grid-cols-3 gap-3">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Square className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">Type A – Major Asset Plates</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">
                Flat plate, no hole. Permanently mounted to fixed infrastructure (tanks, conveyors, structures).
              </p>
              <span className="text-2xl font-bold text-primary">{totals.typeA}</span>
              <span className="text-xs text-muted-foreground ml-1">tags</span>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Circle className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">Type B – Position Tags</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">
                Smaller tag, single hole. Bolt or cable tie to nearby structure (pumps, valves, motors, instruments).
              </p>
              <span className="text-2xl font-bold text-amber-600">{totals.typeB}</span>
              <span className="text-xs text-muted-foreground ml-1">tags</span>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-2 mb-1">
                <Factory className="w-4 h-4 text-green-600" />
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">Total Production</span>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">
                First manufacturing batch — all P&ID tagged assets across the Processing Plant.
              </p>
              <span className="text-2xl font-bold text-green-600">{totals.total}</span>
              <span className="text-xs text-muted-foreground ml-1">tags</span>
            </CardContent>
          </Card>
        </div>

        {/* Mounting Rule Reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          <p className="text-xs text-amber-800">
            <strong>⚠ Mounting Rule:</strong> Tags identify the P&ID equipment <em>position</em>. Mount on the STRUCTURE, FRAME, PIPE STAND, or SKID — never on the removable equipment itself (pump, motor, gearbox, valve, instrument).
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search asset name, number, or P&ID tag..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-9 h-9 text-sm"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[200px] h-9 text-sm">
              <SelectValue placeholder="All Tag Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tag Types</SelectItem>
              <SelectItem value="A">Type A – Major Asset Plates</SelectItem>
              <SelectItem value="B">Type B – Position Tags</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading production list from database...</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border w-8">#</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset Name</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset No.</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">P&ID Tag</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Parent System</th>
                    <th className="text-center px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border w-20">Type</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Mounting Location</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Method</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((t, idx) => (
                    <tr key={t.assetNumber + idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{page * PAGE_SIZE + idx + 1}</td>
                      <td className="px-3 py-1.5 text-xs font-medium">{t.assetName}</td>
                      <td className="px-3 py-1.5 text-xs font-mono">{t.assetNumber}</td>
                      <td className="px-3 py-1.5">
                        <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                          {t.pidTag}
                        </Badge>
                      </td>
                      <td className="px-3 py-1.5 text-xs">{t.parentSystem}</td>
                      <td className="px-3 py-1.5 text-center">
                        <Badge
                          className={`text-[10px] font-bold px-2 py-0.5 ${
                            t.tagType === "A"
                              ? "bg-primary text-primary-foreground"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {t.tagType}
                        </Badge>
                      </td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{t.mountingLocation}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{t.mountingMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {filtered.length > 0 ? page * PAGE_SIZE + 1 : 0}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} tags
                {typeFilter !== "all" && ` (Type ${typeFilter})`}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-2 font-mono">{page + 1} / {totalPages}</span>
                <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
