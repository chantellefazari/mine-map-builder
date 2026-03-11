import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tag, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { writeXlsxFile } from "@/utils/safariDownload";

interface TaggedAsset {
  asset_name: string;
  asset_number: string;
  parent_asset_label: string;
  pid_tags: string[];
  area_label: string;
  sub_area: string;
  functional_location: string | null;
}

/** Infer equipment category from asset number prefix */
function inferCategory(assetNumber: string): string {
  const an = assetNumber.toUpperCase();
  if (/PMP|PU|PA\d|PB\d/.test(an)) return "Pump";
  if (/TK/.test(an)) return "Tank";
  if (/CV|BC|FE/.test(an)) return "Conveyor / Feeder";
  if (/BM|ML/.test(an)) return "Mill";
  if (/AG|AGT/.test(an)) return "Agitator";
  if (/VLV/.test(an)) return "Valve";
  if (/PIPE/.test(an)) return "Pipe / Line";
  if (/CH/.test(an)) return "Chute / Hopper";
  if (/HP/.test(an)) return "Hopper";
  if (/SCR|SS/.test(an)) return "Screen";
  if (/CY/.test(an)) return "Cyclone";
  if (/TH/.test(an)) return "Thickener";
  if (/FP/.test(an)) return "Filter Press";
  if (/COMP|HPAC|ARCV/.test(an)) return "Compressor / Air";
  if (/GBX|GB/.test(an)) return "Gearbox";
  if (/MTR/.test(an)) return "Motor";
  if (/EW|CELL/.test(an)) return "Electrowinning";
  if (/RO/.test(an)) return "RO Plant";
  if (/LUB|LS/.test(an)) return "Lube System";
  if (/DSL/.test(an)) return "Diesel System";
  if (/GEN/.test(an)) return "Generator";
  if (/SMP|PND|PD/.test(an)) return "Sump / Pond";
  if (/MK|HO/.test(an)) return "Hoist / Crane";
  if (/FAN|FA/.test(an)) return "Fan / Cooler";
  if (/FL/.test(an)) return "Filter";
  if (/AFLT/.test(an)) return "Air Filter";
  return "Equipment";
}

/** Infer asset type from the P&ID tag prefix */
function inferAssetType(pidTag: string): string {
  const t = pidTag.toUpperCase();
  if (/PU-/.test(t)) return "Pump";
  if (/TK-/.test(t)) return "Tank";
  if (/CV-|BC-|FE-/.test(t)) return "Conveyor / Feeder";
  if (/ML-/.test(t)) return "Mill";
  if (/AG-/.test(t)) return "Agitator";
  if (/PB-/.test(t)) return "Hopper / Bin";
  if (/CH-/.test(t)) return "Chute";
  if (/SS-/.test(t)) return "Screen";
  if (/CY-/.test(t)) return "Cyclone";
  if (/CP-/.test(t)) return "Compressor";
  if (/AR-/.test(t)) return "Air Receiver";
  if (/AF-/.test(t)) return "Air Filter";
  if (/LS-/.test(t)) return "Lube System";
  if (/GR-/.test(t)) return "Gear Reducer";
  if (/FA-/.test(t)) return "Fan / Cooler";
  if (/FL-/.test(t)) return "Filter";
  if (/XV-/.test(t)) return "Control Valve";
  if (/EW-/.test(t)) return "Electrowinning";
  if (/PD-/.test(t)) return "Pond / Dam";
  if (/MK-/.test(t)) return "Hoist / Crane";
  if (/V\d/.test(t)) return "Valve";
  if (/^\d{2,3}-/.test(t) && /PN/.test(t)) return "Pipe / Line";
  if (/HD[12]?-/.test(t)) return "Pipe / Line";
  return "Equipment";
}

const PAGE_SIZE = 50;

export const PidTaggedAssetRegister = () => {
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["pid-tagged-assets-register"],
    queryFn: async (): Promise<TaggedAsset[]> => {
      // Fetch all in batches to avoid 1000-row limit
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
        // Filter for rows that actually have tags
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

  const areas = useMemo(() => {
    const set = new Set(assets.map((a) => a.area_label));
    return Array.from(set).sort();
  }, [assets]);

  const filtered = useMemo(() => {
    let list = assets;
    if (areaFilter !== "all") {
      list = list.filter((a) => a.area_label === areaFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.asset_name.toLowerCase().includes(q) ||
          a.asset_number.toLowerCase().includes(q) ||
          a.pid_tags.some((t) => t.toLowerCase().includes(q)) ||
          a.parent_asset_label.toLowerCase().includes(q)
      );
    }
    return list;
  }, [assets, areaFilter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleExport = () => {
    const rows = filtered.map((a, idx) => ({
      "#": idx + 1,
      "Asset Name": a.asset_name,
      "Asset Number": a.asset_number,
      "Parent System": a.parent_asset_label,
      "P&ID Tag": a.pid_tags.join("; "),
      "Asset Type": inferAssetType(a.pid_tags[0] || ""),
      "Equipment Category": inferCategory(a.asset_number),
      "Area": a.area_label,
      "Sub-Area": a.sub_area,
      "Location (FL)": a.functional_location || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "P&ID Tagged Assets");
    XLSX.writeFile(wb, "PID_Tagged_Asset_Register_Tennant_Creek.xlsx");
  };

  return (
    <Card className="border-primary/20">
      <CardContent className="pt-5 space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                P&ID Tagged Asset Register – Tennant Creek
              </h3>
              <p className="text-xs text-muted-foreground">
                Only assets with a linked P&ID reference receive a physical asset tag.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              {assets.length} tagged assets
            </Badge>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={filtered.length === 0}>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export XLSX
            </Button>
          </div>
        </div>

        <Separator />

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
          <Select value={areaFilter} onValueChange={(v) => { setAreaFilter(v); setPage(0); }}>
            <SelectTrigger className="w-[220px] h-9 text-sm">
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading tagged assets from database...</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border w-8">#</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset Name</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset Number</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Parent System</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">P&ID Tag</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Asset Type</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Category</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((a, idx) => (
                    <tr key={a.asset_number + idx} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{page * PAGE_SIZE + idx + 1}</td>
                      <td className="px-3 py-1.5 text-xs font-medium">{a.asset_name}</td>
                      <td className="px-3 py-1.5 text-xs font-mono">{a.asset_number}</td>
                      <td className="px-3 py-1.5 text-xs">{a.parent_asset_label}</td>
                      <td className="px-3 py-1.5">
                        <div className="flex flex-wrap gap-1">
                          {a.pid_tags.map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-xs">{inferAssetType(a.pid_tags[0] || "")}</td>
                      <td className="px-3 py-1.5 text-xs">{inferCategory(a.asset_number)}</td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground font-mono">{a.functional_location || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} tagged assets
                {areaFilter !== "all" && ` in ${areaFilter}`}
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
