import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Factory, Search, Download, ChevronLeft, ChevronRight, Square, Circle, Database, FileText, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { writeXlsxFile, downloadCsv } from "@/utils/safariDownload";

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
const TYPE_A_PATTERNS = [
  /TK/i, /^BM/i, /CV|BC/i, /FE/i, /CH/i, /HP/i, /CY/i, /TH/i, /FP/i,
  /PIPE/i, /PND|SMP/i, /CELL/i, /ARCV/i, /RO/i, /COMP01$/i, /^EW/i,
  /SSTK/i, /^RCFD/i, /^MFCV/i, /^TRCV/i,
];

// ── Type B: Removable equipment at a P&ID position ──
const TYPE_B_PATTERNS = [
  /PMP|PU|PA\d|PB\d|SSPA|SSPB|ASDP|HPP|RP|LPPA|LPPB/i,
  /VLV/i, /MTR/i, /GBX|GB/i, /AGT|AG/i, /HPAC/i, /AFLT/i, /CLR|FA-/i,
  /FL[AB]/i, /DSP|DP/i, /SCR|SS/i, /GEN/i, /TTV/i, /MK/i, /LUB|LS/i,
  /SCV/i, /FBB|LDCH/i,
];

export interface ProductionTag {
  assetName: string;
  assetNumber: string;
  pidTag: string;
  parentSystem: string;
  tagType: "A" | "B";
  tagSize: string;
  mountingLocation: string;
  mountingMethod: string;
  areaLabel: string;
  subArea: string;
  functionalLocation: string;
  tagInstalled: boolean;
}

function classifyTagType(assetNumber: string, assetName: string): "A" | "B" {
  for (const pattern of TYPE_A_PATTERNS) {
    if (pattern.test(assetNumber)) return "A";
  }
  for (const pattern of TYPE_B_PATTERNS) {
    if (pattern.test(assetNumber)) return "B";
  }
  const nameLower = assetName.toLowerCase();
  if (/tank|conveyor|hopper|chute|thickener|cyclone|sump|pond|pipe|cell|receiver/.test(nameLower)) return "A";
  if (/pump|valve|motor|gearbox|agitator|instrument|filter|compressor|screen|generator|hoist/.test(nameLower)) return "B";
  return "B";
}

function inferTagSize(tagType: "A" | "B"): string {
  return tagType === "A" ? "100mm x 50mm x 1.5mm" : "70mm x 25mm x 1.5mm";
}

function inferMountingLocation(tagType: "A" | "B", assetName: string): string {
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
    : "Bolt or stainless steel ring to nearby structure";
}

function buildProductionList(assets: TaggedAsset[]): ProductionTag[] {
  return assets.map((a) => {
    const tagType = classifyTagType(a.asset_number, a.asset_name);
    return {
      assetName: a.asset_name,
      assetNumber: a.asset_number,
      pidTag: a.pid_tags.join("; "),
      parentSystem: a.parent_asset_label,
      tagType,
      tagSize: inferTagSize(tagType),
      mountingLocation: inferMountingLocation(tagType, a.asset_name),
      mountingMethod: inferMountingMethod(tagType),
      areaLabel: a.area_label,
      subArea: a.sub_area,
      functionalLocation: a.functional_location || "",
      tagInstalled: false,
    };
  });
}

function toExportRow(t: ProductionTag, idx: number) {
  return {
    "#": idx + 1,
    "Asset Number": t.assetNumber,
    "Asset Name": t.assetName,
    "P&ID Tag": t.pidTag,
    "Tag Type": `Type ${t.tagType}`,
    "Tag Size": t.tagSize,
    "Mounting Location": t.mountingLocation,
    "Mounting Method": t.mountingMethod,
    "Parent System": t.parentSystem,
    "Location": t.functionalLocation || `${t.areaLabel} > ${t.subArea}`,
    "Tag Installed": t.tagInstalled ? "Yes" : "No",
  };
}

const PAGE_SIZE = 50;

export const AssetTagProductionList = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();

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

  // ── Export helpers ──

  const buildExportRows = () => {
    const rows = filtered.map((t, idx) => toExportRow(t, idx));
    rows.push({} as any);
    rows.push({ "#": "" as any, "Asset Number": "SUMMARY", "Asset Name": "", "P&ID Tag": "", "Tag Type": "", "Tag Size": "", "Mounting Location": "", "Mounting Method": "", "Parent System": "", "Location": "", "Tag Installed": "" });
    rows.push({ "#": "" as any, "Asset Number": `Total TYPE A: ${totals.typeA}`, "Asset Name": "", "P&ID Tag": "", "Tag Type": "", "Tag Size": "", "Mounting Location": "", "Mounting Method": "", "Parent System": "", "Location": "", "Tag Installed": "" });
    rows.push({ "#": "" as any, "Asset Number": `Total TYPE B: ${totals.typeB}`, "Asset Name": "", "P&ID Tag": "", "Tag Type": "", "Tag Size": "", "Mounting Location": "", "Mounting Method": "", "Parent System": "", "Location": "", "Tag Installed": "" });
    rows.push({ "#": "" as any, "Asset Number": `TOTAL TAGS: ${totals.total}`, "Asset Name": "", "P&ID Tag": "", "Tag Type": "", "Tag Size": "", "Mounting Location": "", "Mounting Method": "", "Parent System": "", "Location": "", "Tag Installed": "" });
    return rows;
  };

  const handleExportXLSX = () => {
    const ws = XLSX.utils.json_to_sheet(buildExportRows());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tag Production List");
    writeXlsxFile(wb, "Asset_Tag_Production_List_Tennant_Creek.xlsx");
    toast.success("XLSX exported successfully");
  };

  const handleExportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(buildExportRows());
    const csv = XLSX.utils.sheet_to_csv(ws);
    downloadCsv(csv, "Asset_Tag_Production_List_Tennant_Creek.csv");
    toast.success("CSV exported successfully");
  };

  const saveToDb = useMutation({
    mutationFn: async (tags: ProductionTag[]) => {
      // Clear existing and re-insert
      const { error: delErr } = await supabase.from("asset_tag_production").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (delErr) throw delErr;

      // Insert in batches of 200
      for (let i = 0; i < tags.length; i += 200) {
        const batch = tags.slice(i, i + 200).map((t) => ({
          asset_number: t.assetNumber,
          asset_name: t.assetName,
          pid_tag: t.pidTag,
          tag_type: t.tagType,
          tag_size: t.tagSize,
          mounting_location: t.mountingLocation,
          mounting_method: t.mountingMethod,
          parent_system: t.parentSystem,
          area_label: t.areaLabel,
          sub_area: t.subArea,
          functional_location: t.functionalLocation,
          tag_installed: false,
        }));
        const { error } = await supabase.from("asset_tag_production").insert(batch);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(`${productionList.length} tags saved to database`);
      queryClient.invalidateQueries({ queryKey: ["asset-tag-production"] });
    },
    onError: (err: any) => {
      toast.error(`Save failed: ${err.message}`);
    },
  });

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
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs font-mono">
              {totals.total} tags
            </Badge>
            <Button variant="outline" size="sm" onClick={handleExportXLSX} disabled={filtered.length === 0}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              XLSX
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={filtered.length === 0}>
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              CSV
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => saveToDb.mutate(productionList)}
              disabled={productionList.length === 0 || saveToDb.isPending}
            >
              {saveToDb.isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Database className="w-3.5 h-3.5 mr-1.5" />
              )}
              Save to Database
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
                Flat plate, no hole. 100mm × 50mm × 1.5mm. Permanently mounted to fixed infrastructure.
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
                Smaller tag, single hole. 70mm × 25mm × 1.5mm. Bolt or cable tie to nearby structure.
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
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset Number</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset Name</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">P&ID Tag</th>
                    <th className="text-center px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border w-20">Type</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Tag Size</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Mounting Location</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Method</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Parent System</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Location</th>
                    <th className="text-center px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border w-20">Installed</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((t, idx) => (
                    <tr key={t.assetNumber + idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{page * PAGE_SIZE + idx + 1}</td>
                      <td className="px-3 py-1.5 text-xs font-mono">{t.assetNumber}</td>
                      <td className="px-3 py-1.5 text-xs font-medium">{t.assetName}</td>
                      <td className="px-3 py-1.5">
                        <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                          {t.pidTag}
                        </Badge>
                      </td>
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
                      <td className="px-3 py-1.5 text-xs text-muted-foreground font-mono">{t.tagSize}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{t.mountingLocation}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{t.mountingMethod}</td>
                      <td className="px-3 py-1.5 text-xs">{t.parentSystem}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground font-mono">{t.functionalLocation || `${t.areaLabel} > ${t.subArea}`}</td>
                      <td className="px-3 py-1.5 text-center">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">No</Badge>
                      </td>
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
