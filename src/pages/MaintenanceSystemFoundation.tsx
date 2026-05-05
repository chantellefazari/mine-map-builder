import { useEffect, useMemo, useRef, useState } from "react";
import { Layers, AlertTriangle, TrendingUp, Target, FileDown, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type FieldDef = { key: string; label: string };
type CalcOut = { label: string; percent: number; gap?: number; gapLabel?: string };
type SectionDef = {
  id: string;
  title: string;
  totalKey: string; // key used as denominator baseline for "impact"
  inputs: FieldDef[];
  calc: (v: Record<string, number>) => CalcOut[];
};

const pct = (num: number, den: number) =>
  den > 0 ? Math.max(0, Math.min(100, Math.round((num / den) * 100))) : 0;

const SECTIONS: SectionDef[] = [
  {
    id: "asset",
    title: "1. Asset Foundation",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "hier", label: "Assets with Full Hierarchy" },
      { key: "crit", label: "Assets with Criticality Assigned" },
      { key: "cls", label: "Assets with Equipment Class" },
      { key: "fl", label: "Assets with Functional Location" },
    ],
    calc: (v) => [
      { label: "% Hierarchy Coverage", percent: pct(v.hier, v.total), gap: Math.max(0, (v.total||0)-(v.hier||0)), gapLabel: "assets missing hierarchy" },
      { label: "% Criticality Coverage", percent: pct(v.crit, v.total), gap: Math.max(0, (v.total||0)-(v.crit||0)), gapLabel: "assets missing criticality" },
      { label: "% Classification Coverage", percent: pct(v.cls, v.total), gap: Math.max(0, (v.total||0)-(v.cls||0)), gapLabel: "assets missing equipment class" },
      { label: "% Functional Location Coverage", percent: pct(v.fl, v.total), gap: Math.max(0, (v.total||0)-(v.fl||0)), gapLabel: "assets missing functional location" },
    ],
  },
  {
    id: "pm",
    title: "2. PM Coverage",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "any", label: "Assets with ANY PM" },
      { key: "online", label: "Assets with Online PMs" },
      { key: "offline", label: "Assets with Offline PMs" },
      { key: "sd", label: "Assets with Shutdown PMs" },
    ],
    calc: (v) => {
      const noPm = Math.max(0, (v.total||0) - (v.any||0));
      return [
        { label: "% PM Coverage", percent: pct(v.any, v.total), gap: noPm, gapLabel: "assets have no PMs" },
        { label: "% Online Coverage", percent: pct(v.online, v.total), gap: Math.max(0,(v.total||0)-(v.online||0)), gapLabel: "assets missing online PMs" },
        { label: "% Offline Coverage", percent: pct(v.offline, v.total), gap: Math.max(0,(v.total||0)-(v.offline||0)), gapLabel: "assets missing offline PMs" },
        { label: "% Shutdown Coverage", percent: pct(v.sd, v.total), gap: Math.max(0,(v.total||0)-(v.sd||0)), gapLabel: "assets missing shutdown PMs" },
      ];
    },
  },
  {
    id: "jobplans",
    title: "3. Job Plans",
    totalKey: "pms",
    inputs: [
      { key: "pms", label: "Total PMs" },
      { key: "jp", label: "PMs with Job Plans" },
    ],
    calc: (v) => [
      { label: "% Job Plan Coverage", percent: pct(v.jp, v.pms), gap: Math.max(0,(v.pms||0)-(v.jp||0)), gapLabel: "PMs missing job plans" },
    ],
  },
  {
    id: "sop",
    title: "4. SOPs",
    totalKey: "pms",
    inputs: [
      { key: "pms", label: "Total PMs" },
      { key: "sop", label: "PMs with SOPs" },
    ],
    calc: (v) => [
      { label: "% SOP Coverage", percent: pct(v.sop, v.pms), gap: Math.max(0,(v.pms||0)-(v.sop||0)), gapLabel: "PMs missing SOPs" },
    ],
  },
  {
    id: "strategy",
    title: "5. Maintenance Strategy",
    totalKey: "crit",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "crit", label: "Critical Assets" },
      { key: "plan", label: "Critical Assets with Maintenance Plans" },
      { key: "repl", label: "Critical Assets with Replacement Strategy" },
    ],
    calc: (v) => [
      { label: "% Strategy Coverage", percent: pct(v.plan, v.crit), gap: Math.max(0,(v.crit||0)-(v.plan||0)), gapLabel: "critical assets missing plans" },
      { label: "% Replacement Strategy", percent: pct(v.repl, v.crit), gap: Math.max(0,(v.crit||0)-(v.repl||0)), gapLabel: "critical assets missing replacement strategy" },
    ],
  },
  {
    id: "bom",
    title: "6. BOM (Bill of Materials)",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "bom", label: "Assets with BOM" },
    ],
    calc: (v) => [
      { label: "% BOM Coverage", percent: pct(v.bom, v.total), gap: Math.max(0,(v.total||0)-(v.bom||0)), gapLabel: "assets missing BOM" },
    ],
  },
  {
    id: "spares",
    title: "7. Spares (Inventory)",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Spare Items" },
      { key: "mm", label: "Spare Items with Min/Max" },
    ],
    calc: (v) => [
      { label: "% Min/Max Coverage", percent: pct(v.mm, v.total), gap: Math.max(0,(v.total||0)-(v.mm||0)), gapLabel: "items missing Min/Max" },
    ],
  },
  {
    id: "linkage",
    title: "8. Asset ↔ Spare Linkage",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "linked", label: "Assets with Linked Spares" },
    ],
    calc: (v) => [
      { label: "% Linkage Coverage", percent: pct(v.linked, v.total), gap: Math.max(0,(v.total||0)-(v.linked||0)), gapLabel: "assets missing spare linkage" },
    ],
  },
  {
    id: "warehouse",
    title: "9. Warehouse / Locations",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Spare Items" },
      { key: "loc", label: "Items with Location Assigned" },
    ],
    calc: (v) => [
      { label: "% Location Coverage", percent: pct(v.loc, v.total), gap: Math.max(0,(v.total||0)-(v.loc||0)), gapLabel: "items missing location" },
    ],
  },
  {
    id: "oem",
    title: "10. Documentation (OEM)",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "oem", label: "Assets with OEM Docs" },
    ],
    calc: (v) => [
      { label: "% OEM Coverage", percent: pct(v.oem, v.total), gap: Math.max(0,(v.total||0)-(v.oem||0)), gapLabel: "assets missing OEM docs" },
    ],
  },
  {
    id: "shutdown",
    title: "11. Shutdown Strategy",
    totalKey: "req",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "req", label: "Assets requiring shutdown work" },
      { key: "tasks", label: "Assets with shutdown tasks" },
    ],
    calc: (v) => [
      { label: "% Shutdown Coverage", percent: pct(v.tasks, v.req), gap: Math.max(0,(v.req||0)-(v.tasks||0)), gapLabel: "assets missing shutdown tasks" },
    ],
  },
];

const riskOf = (p: number) => (p < 30 ? "HIGH" : p <= 70 ? "MED" : "LOW");
const riskIcon = (p: number) => (p < 30 ? "🔴" : p <= 70 ? "🟠" : "🟢");
const scoreColor = (p: number) =>
  p >= 70 ? "text-emerald-600" : p >= 30 ? "text-amber-600" : "text-red-600";
const scoreBadge = (p: number) =>
  p >= 70 ? "default" : p >= 30 ? "secondary" : ("destructive" as const);

const SectionCard = ({
  section, values, onChange,
}: {
  section: SectionDef;
  values: Record<string, number>;
  onChange: (key: string, v: number) => void;
}) => {
  const calcs = section.calc(values);
  const avg = calcs.length ? Math.round(calcs.reduce((a, c) => a + c.percent, 0) / calcs.length) : 0;
  return (
    <Card id={section.id} className="scroll-mt-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{section.title}</CardTitle>
          <Badge variant={scoreBadge(avg) as any}>{riskIcon(avg)} {avg}%</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Input</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {section.inputs.map((f) => (
              <div key={f.key} className="space-y-1">
                <Label htmlFor={`${section.id}-${f.key}`} className="text-xs">{f.label}</Label>
                <Input
                  id={`${section.id}-${f.key}`}
                  type="number" min={0}
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Auto-Calculated</h4>
          <div className="space-y-2">
            {calcs.map((c) => (
              <div key={c.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.label}</span>
                  <span className={`font-semibold ${scoreColor(c.percent)}`}>{c.percent}%</span>
                </div>
                <Progress value={c.percent} className="h-1.5" />
                {c.gap !== undefined && c.gap > 0 && (
                  <p className="text-xs text-muted-foreground">Gap: {c.gap.toLocaleString()} {c.gapLabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SCOPE = "TCMG";

const MaintenanceSystemFoundation = () => {
  const [data, setData] = useState<Record<string, Record<string, number>>>({});
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<string>("");
  const saveTimer = useRef<number | null>(null);
  const dirty = useRef(false);

  // Load from Supabase
  useEffect(() => {
    (async () => {
      const { data: row, error } = await supabase
        .from("maintenance_foundation_audit")
        .select("data")
        .eq("scope", SCOPE)
        .maybeSingle();
      if (error) {
        toast({ title: "Could not load saved data", description: error.message, variant: "destructive" });
      } else if (row?.data) {
        setData(row.data as any);
      }
      setLoading(false);
    })();
  }, []);

  // Debounced upsert to Supabase
  useEffect(() => {
    if (loading || !dirty.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      const { error } = await supabase
        .from("maintenance_foundation_audit")
        .upsert({ scope: SCOPE, data }, { onConflict: "scope" });
      if (error) {
        toast({ title: "Save failed", description: error.message, variant: "destructive" });
      }
    }, 500);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [data, loading]);

  const setField = (sectionId: string, key: string, value: number) => {
    dirty.current = true;
    setData((prev) => ({ ...prev, [sectionId]: { ...(prev[sectionId] || {}), [key]: value } }));
  };

  const sectionScores = useMemo(
    () => SECTIONS.map((s) => {
      const calcs = s.calc(data[s.id] || {});
      const avg = calcs.length ? Math.round(calcs.reduce((a, c) => a + c.percent, 0) / calcs.length) : 0;
      const totalImpact = (data[s.id]?.[s.totalKey] || 0);
      const totalGap = calcs.reduce((a, c) => a + (c.gap || 0), 0);
      return { id: s.id, title: s.title, score: avg, calcs, totalImpact, totalGap };
    }),
    [data]
  );

  const overall = useMemo(
    () => sectionScores.length ? Math.round(sectionScores.reduce((a, s) => a + s.score, 0) / sectionScores.length) : 0,
    [sectionScores]
  );

  const totalAssets = data.asset?.total || 0;

  const generateReport = () => {
    const lines: string[] = [];
    lines.push("MAINTENANCE SYSTEM FOUNDATION AUDIT — TCMG");
    lines.push("=".repeat(60));
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("");
    lines.push("SUMMARY");
    lines.push("-".repeat(60));
    lines.push(`Total Assets: ${totalAssets.toLocaleString()}`);
    lines.push(`Overall System Coverage: ${overall}% ${riskIcon(overall)} ${riskOf(overall)} RISK`);
    lines.push("");
    lines.push("SECTION BREAKDOWN");
    lines.push("-".repeat(60));
    sectionScores.forEach((s) => {
      lines.push("");
      lines.push(`${s.title}`);
      lines.push(`  Coverage: ${s.score}% ${riskIcon(s.score)} ${riskOf(s.score)} RISK`);
      s.calcs.forEach((c) => {
        const gapTxt = c.gap !== undefined && c.gap > 0 ? ` — Gap: ${c.gap.toLocaleString()} ${c.gapLabel}` : "";
        lines.push(`    • ${c.label}: ${c.percent}%${gapTxt}`);
      });
    });
    lines.push("");
    lines.push("TOP 5 CRITICAL GAPS (ranked by impact)");
    lines.push("-".repeat(60));
    const allGaps = sectionScores.flatMap((s) =>
      s.calcs
        .filter((c) => (c.gap || 0) > 0)
        .map((c) => ({ section: s.title, percent: c.percent, gap: c.gap || 0, label: c.gapLabel || c.label }))
    );
    allGaps.sort((a, b) => (a.percent - b.percent) || (b.gap - a.gap));
    allGaps.slice(0, 5).forEach((g, i) => {
      lines.push(`${i + 1}. ${g.section} — ${g.gap.toLocaleString()} ${g.label} (${g.percent}%)`);
    });
    if (allGaps.length === 0) lines.push("No gaps recorded.");
    lines.push("");
    const txt = lines.join("\n");
    setReport(txt);

    // Trigger download
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TCMG-Foundation-Risk-Report-${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Report generated", description: "Download started." });
  };

  const highRisk = [...sectionScores].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Maintenance System Foundation</h1>
              <p className="text-muted-foreground text-sm">
                Quantified foundation audit. Inputs save to backend automatically. Generate the Foundation Risk Report when ready.
              </p>
            </div>
            <Button onClick={generateReport} disabled={loading} className="gap-2">
              <FileDown className="w-4 h-4" /> Generate Foundation Risk Report
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-xl">Maintenance Readiness Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${scoreColor(overall)}`}>{overall}%</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Overall — {riskIcon(overall)} {riskOf(overall)} RISK
                </div>
              </div>
              <div className="flex-1">
                <Progress value={overall} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>🔴 High (&lt;30%)</span><span>🟠 Med (30–70%)</span><span>🟢 Low (&gt;70%)</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h4 className="text-sm font-semibold">High Risk Areas</h4>
              </div>
              <ul className="space-y-1.5">
                {highRisk.map((s) => (
                  <li key={s.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.title}</span>
                    <Badge variant={scoreBadge(s.score) as any}>{riskIcon(s.score)} {s.score}%</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading saved data…
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {SECTIONS.map((section) => (
              <SectionCard
                key={section.id} section={section}
                values={data[section.id] || {}}
                onChange={(key, v) => setField(section.id, key, v)}
              />
            ))}
          </div>
        )}

        {report && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Foundation Risk Report</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-xs whitespace-pre-wrap font-mono bg-muted p-4 rounded border border-border max-h-[500px] overflow-auto">
{report}
              </pre>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MaintenanceSystemFoundation;
