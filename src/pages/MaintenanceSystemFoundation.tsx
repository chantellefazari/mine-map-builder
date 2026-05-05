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
  tier: "MUST" | "SHOULD"; // MUST = non-negotiable foundation data before CMMS go-live
  totalKey: string; // key used as denominator baseline for "impact"
  inputs: FieldDef[];
  calc: (v: Record<string, number>) => CalcOut[];
};

const pct = (num: number, den: number) =>
  den > 0 ? Math.max(0, Math.min(100, Math.round((num / den) * 100))) : 0;

const SECTIONS: SectionDef[] = [
  {
    id: "asset",
    tier: "MUST",
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
    tier: "MUST",
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
    tier: "MUST",
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
    tier: "SHOULD",
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
    tier: "MUST",
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
    tier: "MUST",
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
    tier: "MUST",
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
    tier: "MUST",
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
    tier: "MUST",
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
    tier: "SHOULD",
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
    tier: "MUST",
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
  // ── Extended domains benchmarked against SAP PM, Pronto Xi, IBM Maximo, MS D365, MEX, Mainpac, ISO 14224 / ISO 55000 ──
  {
    id: "failure",
    tier: "MUST",
    title: "12. Failure Codes (ISO 14224)",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "lib", label: "Assets with Failure Code Library" },
      { key: "hist", label: "Assets with Failure History Captured" },
    ],
    calc: (v) => [
      { label: "% Failure Code Coverage", percent: pct(v.lib, v.total), gap: Math.max(0,(v.total||0)-(v.lib||0)), gapLabel: "assets missing failure codes" },
      { label: "% Failure History Captured", percent: pct(v.hist, v.total), gap: Math.max(0,(v.total||0)-(v.hist||0)), gapLabel: "assets missing failure history" },
    ],
  },
  {
    id: "rcm",
    tier: "SHOULD",
    title: "13. RCM / FMEA Coverage",
    totalKey: "crit",
    inputs: [
      { key: "crit", label: "Critical Assets" },
      { key: "fmea", label: "Critical Assets with FMEA/RCM Done" },
    ],
    calc: (v) => [
      { label: "% RCM/FMEA Coverage", percent: pct(v.fmea, v.crit), gap: Math.max(0,(v.crit||0)-(v.fmea||0)), gapLabel: "critical assets missing FMEA/RCM" },
    ],
  },
  {
    id: "cbm",
    tier: "SHOULD",
    title: "14. Condition Monitoring (CBM)",
    totalKey: "crit",
    inputs: [
      { key: "crit", label: "Critical Assets" },
      { key: "cbm", label: "Assets with CBM/Condition Triggers" },
      { key: "meters", label: "Assets with Meter Readings Captured" },
    ],
    calc: (v) => [
      { label: "% CBM Coverage", percent: pct(v.cbm, v.crit), gap: Math.max(0,(v.crit||0)-(v.cbm||0)), gapLabel: "critical assets missing CBM" },
      { label: "% Meter Coverage", percent: pct(v.meters, v.crit), gap: Math.max(0,(v.crit||0)-(v.meters||0)), gapLabel: "critical assets missing meters" },
    ],
  },
  {
    id: "labour",
    tier: "MUST",
    title: "15. Labour & Resources",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Personnel" },
      { key: "trade", label: "Personnel with Trade/Skill Assigned" },
      { key: "wc", label: "Personnel Linked to Work Centre" },
      { key: "rates", label: "Personnel with Labour Rates Set" },
    ],
    calc: (v) => [
      { label: "% Trade Assigned", percent: pct(v.trade, v.total), gap: Math.max(0,(v.total||0)-(v.trade||0)), gapLabel: "personnel missing trade/skill" },
      { label: "% Work Centre Linked", percent: pct(v.wc, v.total), gap: Math.max(0,(v.total||0)-(v.wc||0)), gapLabel: "personnel missing work centre" },
      { label: "% Labour Rates Set", percent: pct(v.rates, v.total), gap: Math.max(0,(v.total||0)-(v.rates||0)), gapLabel: "personnel missing labour rates" },
    ],
  },
  {
    id: "permits",
    tier: "MUST",
    title: "16. Permits & Safety (HSE)",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "permit", label: "Assets with Permit Requirements Defined" },
      { key: "ra", label: "Assets with Risk Assessment / JSA" },
      { key: "iso", label: "Assets with Isolation Procedures" },
    ],
    calc: (v) => [
      { label: "% Permit Coverage", percent: pct(v.permit, v.total), gap: Math.max(0,(v.total||0)-(v.permit||0)), gapLabel: "assets missing permit requirements" },
      { label: "% Risk Assessment Coverage", percent: pct(v.ra, v.total), gap: Math.max(0,(v.total||0)-(v.ra||0)), gapLabel: "assets missing risk assessment" },
      { label: "% Isolation Procedures", percent: pct(v.iso, v.total), gap: Math.max(0,(v.total||0)-(v.iso||0)), gapLabel: "assets missing isolation procedures" },
    ],
  },
  {
    id: "compliance",
    tier: "MUST",
    title: "17. Statutory & Compliance",
    totalKey: "stat",
    inputs: [
      { key: "stat", label: "Statutory Assets (pressure, lift, gas, etc.)" },
      { key: "reg", label: "Assets with Registered Inspections" },
      { key: "cert", label: "Assets with Current Certificates" },
    ],
    calc: (v) => [
      { label: "% Statutory Inspection Coverage", percent: pct(v.reg, v.stat), gap: Math.max(0,(v.stat||0)-(v.reg||0)), gapLabel: "statutory assets missing inspections" },
      { label: "% Certification Current", percent: pct(v.cert, v.stat), gap: Math.max(0,(v.stat||0)-(v.cert||0)), gapLabel: "statutory assets with expired/missing certs" },
    ],
  },
  {
    id: "warranty",
    tier: "SHOULD",
    title: "18. Warranty & Vendor Data",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "vendor", label: "Assets with Vendor/OEM Linked" },
      { key: "warr", label: "Assets with Warranty Tracked" },
      { key: "serial", label: "Assets with Serial Number Recorded" },
    ],
    calc: (v) => [
      { label: "% Vendor Linked", percent: pct(v.vendor, v.total), gap: Math.max(0,(v.total||0)-(v.vendor||0)), gapLabel: "assets missing vendor link" },
      { label: "% Warranty Tracked", percent: pct(v.warr, v.total), gap: Math.max(0,(v.total||0)-(v.warr||0)), gapLabel: "assets missing warranty data" },
      { label: "% Serial Numbers Captured", percent: pct(v.serial, v.total), gap: Math.max(0,(v.total||0)-(v.serial||0)), gapLabel: "assets missing serial number" },
    ],
  },
  {
    id: "finance",
    tier: "MUST",
    title: "19. Finance & Costing",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "cc", label: "Assets with Cost Centre" },
      { key: "gl", label: "Assets with GL/Account Code" },
      { key: "value", label: "Assets with Replacement Value" },
    ],
    calc: (v) => [
      { label: "% Cost Centre Coverage", percent: pct(v.cc, v.total), gap: Math.max(0,(v.total||0)-(v.cc||0)), gapLabel: "assets missing cost centre" },
      { label: "% GL Code Coverage", percent: pct(v.gl, v.total), gap: Math.max(0,(v.total||0)-(v.gl||0)), gapLabel: "assets missing GL code" },
      { label: "% Replacement Value", percent: pct(v.value, v.total), gap: Math.max(0,(v.total||0)-(v.value||0)), gapLabel: "assets missing replacement value" },
    ],
  },
  {
    id: "history",
    tier: "SHOULD",
    title: "20. Maintenance History / Records",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "wo", label: "Assets with WO History Captured" },
      { key: "dt", label: "Assets with Downtime History" },
      { key: "cost", label: "Assets with Cost History" },
    ],
    calc: (v) => [
      { label: "% WO History Coverage", percent: pct(v.wo, v.total), gap: Math.max(0,(v.total||0)-(v.wo||0)), gapLabel: "assets missing WO history" },
      { label: "% Downtime Captured", percent: pct(v.dt, v.total), gap: Math.max(0,(v.total||0)-(v.dt||0)), gapLabel: "assets missing downtime data" },
      { label: "% Cost History Captured", percent: pct(v.cost, v.total), gap: Math.max(0,(v.total||0)-(v.cost||0)), gapLabel: "assets missing cost history" },
    ],
  },
  {
    id: "kpi",
    tier: "SHOULD",
    title: "21. KPIs & Reporting",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Required KPIs (MTBF, MTTR, PM Compliance, Backlog, Schedule Adherence, Wrench Time)" },
      { key: "defined", label: "KPIs Defined" },
      { key: "auto", label: "KPIs Auto-Calculated from System" },
    ],
    calc: (v) => [
      { label: "% KPIs Defined", percent: pct(v.defined, v.total), gap: Math.max(0,(v.total||0)-(v.defined||0)), gapLabel: "KPIs not defined" },
      { label: "% KPIs Automated", percent: pct(v.auto, v.total), gap: Math.max(0,(v.total||0)-(v.auto||0)), gapLabel: "KPIs not automated" },
    ],
  },
  {
    id: "governance",
    tier: "MUST",
    title: "22. Governance & Change Control",
    totalKey: "total",
    inputs: [
      { key: "total", label: "Total Master Data Domains (Asset, PM, BOM, Spares, Vendor, Codes)" },
      { key: "owner", label: "Domains with Data Owner Assigned" },
      { key: "mdm", label: "Domains under Master Data Governance" },
      { key: "audit", label: "Domains with Audit Trail Enabled" },
    ],
    calc: (v) => [
      { label: "% Data Ownership", percent: pct(v.owner, v.total), gap: Math.max(0,(v.total||0)-(v.owner||0)), gapLabel: "domains missing data owner" },
      { label: "% MDM Governance", percent: pct(v.mdm, v.total), gap: Math.max(0,(v.total||0)-(v.mdm||0)), gapLabel: "domains missing MDM" },
      { label: "% Audit Trail", percent: pct(v.audit, v.total), gap: Math.max(0,(v.total||0)-(v.audit||0)), gapLabel: "domains missing audit trail" },
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
    <Card id={section.id} className={`scroll-mt-20 ${section.tier === "MUST" ? "border-l-4 border-l-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-lg">{section.title}</CardTitle>
            <Badge variant={section.tier === "MUST" ? "default" : "outline"} className="text-[10px]">
              {section.tier === "MUST" ? "MUST – Pre Go-Live" : "SHOULD – Maturity"}
            </Badge>
          </div>
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
      return { id: s.id, title: s.title, tier: s.tier, score: avg, calcs, totalImpact, totalGap };
    }),
    [data]
  );

  const overall = useMemo(
    () => sectionScores.length ? Math.round(sectionScores.reduce((a, s) => a + s.score, 0) / sectionScores.length) : 0,
    [sectionScores]
  );

  const mustScores = useMemo(() => sectionScores.filter((s) => s.tier === "MUST"), [sectionScores]);
  const shouldScores = useMemo(() => sectionScores.filter((s) => s.tier === "SHOULD"), [sectionScores]);
  const mandatoryScore = useMemo(
    () => mustScores.length ? Math.round(mustScores.reduce((a, s) => a + s.score, 0) / mustScores.length) : 0,
    [mustScores]
  );
  const maturityScore = useMemo(
    () => shouldScores.length ? Math.round(shouldScores.reduce((a, s) => a + s.score, 0) / shouldScores.length) : 0,
    [shouldScores]
  );
  const goLiveReady = mustScores.every((s) => s.score >= 80);
  const blockers = mustScores.filter((s) => s.score < 80);

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
            {/* Go-Live verdict */}
            <div className={`rounded-lg border p-4 ${goLiveReady ? "border-emerald-600/40 bg-emerald-500/5" : "border-red-600/40 bg-red-500/5"}`}>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">CMMS Go-Live Verdict</div>
                  <div className={`text-lg font-bold ${goLiveReady ? "text-emerald-700" : "text-red-700"}`}>
                    {goLiveReady ? "✓ READY — All MUST domains ≥ 80%" : `✗ NOT READY — ${blockers.length} MUST domain(s) below 80%`}
                  </div>
                </div>
                <Badge variant={goLiveReady ? "default" : "destructive"}>
                  Mandatory: {mandatoryScore}%
                </Badge>
              </div>
            </div>

            {/* Three-tier scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 rounded border border-primary/30 bg-primary/5">
                <div className={`text-4xl font-bold ${scoreColor(mandatoryScore)}`}>{mandatoryScore}%</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">MUST – Pre Go-Live</div>
                <Progress value={mandatoryScore} className="h-1.5 mt-2" />
              </div>
              <div className="text-center p-3 rounded border border-border">
                <div className={`text-4xl font-bold ${scoreColor(maturityScore)}`}>{maturityScore}%</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">SHOULD – Maturity</div>
                <Progress value={maturityScore} className="h-1.5 mt-2" />
              </div>
              <div className="text-center p-3 rounded border border-border">
                <div className={`text-4xl font-bold ${scoreColor(overall)}`}>{overall}%</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">Overall {riskIcon(overall)}</div>
                <Progress value={overall} className="h-1.5 mt-2" />
              </div>
            </div>

            {/* Blockers */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h4 className="text-sm font-semibold">Go-Live Blockers (MUST domains &lt; 80%)</h4>
              </div>
              {blockers.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No blockers — all mandatory foundation data ready.</p>
              ) : (
                <ul className="space-y-1.5">
                  {blockers.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{s.title}</span>
                      <Badge variant={scoreBadge(s.score) as any}>{riskIcon(s.score)} {s.score}%</Badge>
                    </li>
                  ))}
                </ul>
              )}
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
