import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, FileDown, Loader2, Search, Wand2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { fetchAllProcessingPlantRows } from "@/utils/fetchProcessingPlantData";
import {
  ALL_FREQS, classifyAsset, countEnabled, effectiveRegime, EQUIPMENT_CLASSES,
  EquipmentClass, Freq, recommendRegime, Regime,
} from "@/utils/pmRequirementRules";

type Crit = "A" | "B" | "C";
const CRIT_LABEL: Record<Crit, string> = { A: "HIGH", B: "MED", C: "LOW" };
const CRIT_DOT: Record<Crit, string> = { A: "bg-red-500", B: "bg-amber-500", C: "bg-muted-foreground" };

interface RecRow {
  asset_number: string;
  asset_name: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
  equipment_class: EquipmentClass;
  criticality: Crit;
  recommended_regime: Regime;
  overrides: Partial<Regime>;
  approved: boolean;
  notes: string;
}

export default function PMRequirementsMatrix() {
  const [rows, setRows] = useState<RecRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [critFilter, setCritFilter] = useState<string>("all");

  // ---- Load assets + criticality + saved recommendations ----
  const { data: assets } = useQuery({
    queryKey: ["pmreq-assets"],
    queryFn: async () => await fetchAllProcessingPlantRows(),
  });
  const { data: critMap } = useQuery({
    queryKey: ["pmreq-crit"],
    queryFn: async () => {
      const { data, error } = await supabase.from("asset_criticality_ratings").select("asset_number, criticality");
      if (error) throw error;
      const m = new Map<string, Crit>();
      (data || []).forEach((d: any) => m.set(d.asset_number, (d.criticality || "C") as Crit));
      return m;
    },
  });

  const loadRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pm_requirement_recommendations")
      .select("*")
      .order("area_label", { ascending: true });
    if (error) { toast({ title: "Load failed", description: error.message, variant: "destructive" }); }
    setRows((data || []) as any);
    setLoading(false);
  };
  useEffect(() => { loadRows(); }, []);

  // ---- Generate recommendations from asset tree ----
  const generateAll = async () => {
    if (!assets || !assets.length) { toast({ title: "No assets loaded yet" }); return; }
    setGenerating(true);
    const existing = new Map(rows.map(r => [r.asset_number, r]));
    const payload = assets.map(a => {
      const crit = (critMap?.get(a.asset_number) || "C") as Crit;
      const cls = classifyAsset(a.asset_name || "", a.parent_asset_label || "");
      const recommended = recommendRegime(cls, crit);
      const prev = existing.get(a.asset_number);
      return {
        asset_number: a.asset_number,
        asset_name: a.asset_name || "",
        area_label: a.area_label || "",
        sub_area: a.sub_area || "",
        parent_asset_label: a.parent_asset_label || "",
        equipment_class: cls,
        criticality: crit,
        recommended_regime: recommended,
        overrides: prev?.overrides || {},
        approved: prev?.approved || false,
        notes: prev?.notes || "",
      };
    });
    // Upsert in chunks of 200
    for (let i = 0; i < payload.length; i += 200) {
      const chunk = payload.slice(i, i + 200);
      const { error } = await supabase.from("pm_requirement_recommendations").upsert(chunk, { onConflict: "asset_number" });
      if (error) { toast({ title: "Generation failed", description: error.message, variant: "destructive" }); setGenerating(false); return; }
    }
    toast({ title: `Generated recommendations for ${payload.length} assets` });
    setGenerating(false);
    loadRows();
  };

  // ---- Toggle frequency / duty (override) ----
  const updateOverride = async (row: RecRow, freq: Freq, patch: Partial<{ enabled: boolean; duty: "Online" | "Offline" }>) => {
    const eff = effectiveRegime(row.recommended_regime, row.overrides);
    const next = { ...(row.overrides || {}) };
    next[freq] = { ...eff[freq], ...patch };
    setRows(prev => prev.map(r => r.asset_number === row.asset_number ? { ...r, overrides: next } : r));
    const { error } = await supabase.from("pm_requirement_recommendations")
      .update({ overrides: next }).eq("asset_number", row.asset_number);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
  };

  const toggleApproved = async (row: RecRow) => {
    const next = !row.approved;
    setRows(prev => prev.map(r => r.asset_number === row.asset_number ? { ...r, approved: next } : r));
    await supabase.from("pm_requirement_recommendations")
      .update({ approved: next, approved_at: next ? new Date().toISOString() : null })
      .eq("asset_number", row.asset_number);
  };

  // ---- Filters ----
  const areas = useMemo(() => Array.from(new Set(rows.map(r => r.area_label).filter(Boolean))).sort(), [rows]);
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return rows.filter(r => {
      if (areaFilter !== "all" && r.area_label !== areaFilter) return false;
      if (classFilter !== "all" && r.equipment_class !== classFilter) return false;
      if (critFilter !== "all" && r.criticality !== critFilter) return false;
      if (s && !`${r.asset_number} ${r.asset_name} ${r.parent_asset_label}`.toLowerCase().includes(s)) return false;
      return true;
    });
  }, [rows, search, areaFilter, classFilter, critFilter]);

  // ---- Stats ----
  const stats = useMemo(() => {
    let totalPMs = 0, online = 0, offline = 0, approved = 0;
    const byClass: Record<string, number> = {};
    rows.forEach(r => {
      const eff = effectiveRegime(r.recommended_regime, r.overrides);
      const c = countEnabled(eff);
      totalPMs += c.total; online += c.online; offline += c.offline;
      if (r.approved) approved++;
      byClass[r.equipment_class] = (byClass[r.equipment_class] || 0) + 1;
    });
    return { totalAssets: rows.length, totalPMs, online, offline, approved, byClass };
  }, [rows]);

  // ---- PPTX export ----
  const exportPptx = async () => {
    if (!rows.length) { toast({ title: "Nothing to export — generate first" }); return; }
    const PptxGenJS = (await import("pptxgenjs")).default;
    const p = new PptxGenJS();
    p.layout = "LAYOUT_WIDE";
    const GOLD = "C8960C", DARK = "1A1A1A", GREY = "6B6B6B";

    // Cover
    const s1 = p.addSlide(); s1.background = { color: DARK };
    s1.addText("PM Requirements Matrix", { x: 0.5, y: 2.0, w: 12, h: 1, fontSize: 40, bold: true, color: "FFFFFF", fontFace: "Calibri" });
    s1.addText(`Walk-through pack — ${stats.totalAssets} assets · ${stats.totalPMs} recommended PMs`, { x: 0.5, y: 3.1, w: 12, h: 0.5, fontSize: 18, color: GOLD });
    s1.addText(`Online: ${stats.online}   Offline: ${stats.offline}   Approved: ${stats.approved}/${stats.totalAssets}`, { x: 0.5, y: 4.0, w: 12, h: 0.4, fontSize: 14, color: "FFFFFF" });

    // Summary by class
    const s2 = p.addSlide();
    s2.addText("Recommended PM Volume by Equipment Class", { x: 0.5, y: 0.3, w: 12, h: 0.5, fontSize: 22, bold: true, color: DARK });
    const head = [{ text: "Equipment Class", options: { bold: true, fill: { color: GOLD }, color: "FFFFFF" } },
                  { text: "Assets", options: { bold: true, fill: { color: GOLD }, color: "FFFFFF" } },
                  { text: "PMs", options: { bold: true, fill: { color: GOLD }, color: "FFFFFF" } }];
    const byClassPMs: Record<string, number> = {};
    rows.forEach(r => {
      const c = countEnabled(effectiveRegime(r.recommended_regime, r.overrides));
      byClassPMs[r.equipment_class] = (byClassPMs[r.equipment_class] || 0) + c.total;
    });
    const tableRows = Object.entries(stats.byClass)
      .sort(([,a],[,b]) => b-a)
      .map(([cls, n]) => [cls, String(n), String(byClassPMs[cls] || 0)]);
    s2.addTable([head, ...tableRows], { x: 0.5, y: 1.0, w: 12, fontSize: 11, border: { type: "solid", pt: 0.5, color: "CCCCCC" } });

    // One slide per area — list HIGH/MED assets with their PM ladder
    const byArea = new Map<string, RecRow[]>();
    rows.forEach(r => { if (!byArea.has(r.area_label)) byArea.set(r.area_label, []); byArea.get(r.area_label)!.push(r); });

    for (const [area, arr] of byArea.entries()) {
      const sorted = [...arr].sort((a,b) => a.criticality.localeCompare(b.criticality) || a.asset_number.localeCompare(b.asset_number));
      // Paginate at 20 rows per slide
      for (let i = 0; i < sorted.length; i += 20) {
        const page = sorted.slice(i, i + 20);
        const s = p.addSlide();
        s.addText(`${area || "Unassigned"} — PM Requirements${sorted.length > 20 ? ` (${Math.floor(i/20)+1}/${Math.ceil(sorted.length/20)})` : ""}`,
          { x: 0.4, y: 0.25, w: 12.5, h: 0.5, fontSize: 18, bold: true, color: DARK });
        const hdr = ["Asset", "Class", "Crit", ...ALL_FREQS].map(t => ({ text: t, options: { bold: true, fill: { color: GOLD }, color: "FFFFFF", fontSize: 9 } }));
        const body = page.map(r => {
          const eff = effectiveRegime(r.recommended_regime, r.overrides);
          return [
            { text: `${r.asset_number}\n${r.asset_name}`, options: { fontSize: 8 } },
            { text: r.equipment_class, options: { fontSize: 8 } },
            { text: CRIT_LABEL[r.criticality], options: { fontSize: 8, color: r.criticality === "A" ? "B91C1C" : r.criticality === "B" ? "B45309" : GREY, bold: true } },
            ...ALL_FREQS.map(f => ({
              text: eff[f].enabled ? (eff[f].duty === "Online" ? "ON" : "OFF") : "—",
              options: { fontSize: 8, align: "center" as const, bold: eff[f].enabled,
                         color: eff[f].enabled ? "FFFFFF" : "999999",
                         fill: eff[f].enabled ? { color: eff[f].duty === "Online" ? "047857" : "1E40AF" } : { color: "F5F5F5" } }
            })),
          ];
        });
        s.addTable([hdr, ...body], { x: 0.3, y: 0.85, w: 12.7, fontSize: 8, border: { type: "solid", pt: 0.4, color: "DDDDDD" }, colW: [2.6, 1.3, 0.7, ...ALL_FREQS.map(()=>1.16)] });
      }
    }

    await p.writeFile({ fileName: `TCMG-PM-Requirements-Matrix-${new Date().toISOString().slice(0,10)}.pptx` });
    toast({ title: "PPTX downloaded", description: "Walk through it with the team and toggle changes here — all auto-saved." });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
            <ClipboardList className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Link to="/maintenance-system-foundation" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Foundation
              </Link>
            </div>
            <h1 className="text-2xl font-bold">PM Requirements Matrix</h1>
            <p className="text-sm text-muted-foreground">
              Recommended inspection regime for every asset, by equipment class & criticality. Toggle frequencies and Online/Offline — auto-saved.
            </p>
          </div>
          <Button onClick={generateAll} disabled={generating} variant="outline" className="gap-2">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {rows.length ? "Re-generate from Asset Tree" : "Generate from Asset Tree"}
          </Button>
          <Button onClick={exportPptx} disabled={!rows.length} className="gap-2">
            <FileDown className="w-4 h-4" /> Walk-through PPTX
          </Button>
        </div>
      </header>

      <main className="container py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ["Assets", stats.totalAssets],
            ["Recommended PMs", stats.totalPMs],
            ["Online", stats.online],
            ["Offline / Shutdown", stats.offline],
            ["Approved", `${stats.approved}/${stats.totalAssets}`],
          ].map(([l, v]) => (
            <Card key={l as string}><CardContent className="p-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{l}</div>
              <div className="text-2xl font-bold mt-1">{v}</div>
            </CardContent></Card>
          ))}
        </div>

        {/* Filters */}
        <Card><CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search asset number or name…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-9" />
          </div>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Area" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Areas</SelectItem>
              {areas.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Equipment class" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All Classes</SelectItem>
              {EQUIPMENT_CLASSES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={critFilter} onValueChange={setCritFilter}>
            <SelectTrigger className="w-[140px] h-9"><SelectValue placeholder="Criticality" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crit</SelectItem>
              <SelectItem value="A">HIGH</SelectItem>
              <SelectItem value="B">MED</SelectItem>
              <SelectItem value="C">LOW</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary">{filtered.length} shown</Badge>
        </CardContent></Card>

        {/* Matrix table */}
        <Card>
          <CardHeader className="py-3"><CardTitle className="text-base">Asset × Frequency Matrix</CardTitle></CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-10 text-center text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></div>
            ) : !rows.length ? (
              <div className="p-10 text-center">
                <p className="text-sm text-muted-foreground mb-3">No recommendations yet. Click <b>Generate from Asset Tree</b> to build the matrix.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr>
                      <th className="text-left p-2 font-semibold w-[200px]">Asset</th>
                      <th className="text-left p-2 font-semibold w-[130px]">Class</th>
                      <th className="text-left p-2 font-semibold w-[60px]">Crit</th>
                      {ALL_FREQS.map(f => <th key={f} className="text-center p-2 font-semibold w-[80px]">{f}</th>)}
                      <th className="text-center p-2 font-semibold w-[70px]">Approve</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0, 500).map(r => {
                      const eff = effectiveRegime(r.recommended_regime, r.overrides);
                      return (
                        <tr key={r.asset_number} className="border-t hover:bg-muted/30">
                          <td className="p-2">
                            <div className="font-mono text-[11px] font-semibold">{r.asset_number}</div>
                            <div className="text-muted-foreground text-[11px] truncate max-w-[180px]">{r.asset_name}</div>
                          </td>
                          <td className="p-2">{r.equipment_class}</td>
                          <td className="p-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${CRIT_DOT[r.criticality]} mr-1`} />
                            {CRIT_LABEL[r.criticality]}
                          </td>
                          {ALL_FREQS.map(f => {
                            const cell = eff[f];
                            return (
                              <td key={f} className="p-1 text-center">
                                <button
                                  onClick={() => updateOverride(r, f, { enabled: !cell.enabled })}
                                  className={`w-full text-[10px] px-1.5 py-1 rounded font-semibold transition ${
                                    cell.enabled
                                      ? cell.duty === "Online"
                                        ? "bg-emerald-700 text-white hover:bg-emerald-800"
                                        : "bg-blue-800 text-white hover:bg-blue-900"
                                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                                  }`}
                                  title="Click to toggle on/off"
                                >
                                  {cell.enabled ? cell.duty.toUpperCase() : "—"}
                                </button>
                                {cell.enabled && (
                                  <button
                                    onClick={() => updateOverride(r, f, { duty: cell.duty === "Online" ? "Offline" : "Online" })}
                                    className="text-[9px] text-muted-foreground hover:text-foreground mt-0.5 underline"
                                  >
                                    flip
                                  </button>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-2 text-center">
                            <button
                              onClick={() => toggleApproved(r)}
                              className={`text-[10px] px-2 py-1 rounded font-semibold ${
                                r.approved ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                              }`}
                            >
                              {r.approved ? "✓ Approved" : "Approve"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length > 500 && (
                  <div className="p-3 text-center text-xs text-muted-foreground border-t">
                    Showing first 500 of {filtered.length}. Use filters to narrow down.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
