import { useEffect, useMemo, useRef, useState } from "react";
import { Layers, AlertTriangle, TrendingUp, Target, FileDown, Loader2, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { usePMRequirementsSummary } from "@/hooks/usePMRequirementsSummary";

type FieldDef = { key: string; label: string; readOnlyFrom?: "requireAny" | "requireOnline" | "requireOffline" | "requireShutdown" | "totalRecommended" };
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
    title: "2. PM Coverage (vs Required from Matrix)",
    totalKey: "reqAny",
    inputs: [
      { key: "reqAny", label: "Assets REQUIRING any PM (from Matrix)", readOnlyFrom: "requireAny" },
      { key: "any", label: "Assets WITH any PM built" },
      { key: "reqOnline", label: "Assets REQUIRING Online PMs (from Matrix)", readOnlyFrom: "requireOnline" },
      { key: "online", label: "Assets WITH Online PMs built" },
      { key: "reqOffline", label: "Assets REQUIRING Offline PMs (from Matrix)", readOnlyFrom: "requireOffline" },
      { key: "offline", label: "Assets WITH Offline PMs built" },
      { key: "reqSd", label: "Assets REQUIRING Shutdown PMs (from Matrix)", readOnlyFrom: "requireShutdown" },
      { key: "sd", label: "Assets WITH Shutdown PMs built" },
    ],
    calc: (v) => {
      const gap = (req: number, have: number) => Math.max(0, (req||0) - (have||0));
      return [
        { label: "% PM Coverage (built ÷ required)", percent: pct(v.any, v.reqAny), gap: gap(v.reqAny, v.any), gapLabel: "required PMs not built" },
        { label: "% Online Coverage (built ÷ required online)", percent: pct(v.online, v.reqOnline), gap: gap(v.reqOnline, v.online), gapLabel: "assets needing Online PMs not built" },
        { label: "% Offline Coverage (built ÷ required offline)", percent: pct(v.offline, v.reqOffline), gap: gap(v.reqOffline, v.offline), gapLabel: "assets needing Offline PMs not built" },
        { label: "% Shutdown Coverage (built ÷ required shutdown)", percent: pct(v.sd, v.reqSd), gap: gap(v.reqSd, v.sd), gapLabel: "assets needing Shutdown PMs not built" },
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
                <Label htmlFor={`${section.id}-${f.key}`} className="text-xs">
                  {f.label}
                  {f.readOnlyFrom && <span className="ml-1 text-[10px] text-primary">(auto)</span>}
                </Label>
                <Input
                  id={`${section.id}-${f.key}`}
                  type="number" min={0}
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, Number(e.target.value) || 0)}
                  placeholder="0"
                  readOnly={!!f.readOnlyFrom}
                  className={f.readOnlyFrom ? "bg-muted/50 cursor-not-allowed" : ""}
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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimer = useRef<number | null>(null);
  const dirty = useRef(false);
  const dataRef = useRef(data);
  dataRef.current = data;

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

  const flushSave = async (payload: Record<string, Record<string, number>>) => {
    setSaveState("saving");
    const { error } = await supabase
      .from("maintenance_foundation_audit")
      .upsert({ scope: SCOPE, data: payload }, { onConflict: "scope" });
    if (error) {
      setSaveState("error");
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return false;
    }
    dirty.current = false;
    setSaveState("saved");
    return true;
  };

  // Debounced upsert to Supabase
  useEffect(() => {
    if (loading || !dirty.current) return;
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => { flushSave(dataRef.current); }, 500);
    return () => { if (saveTimer.current) window.clearTimeout(saveTimer.current); };
  }, [data, loading]);

  // Flush on tab hide / before unload so nothing is lost
  useEffect(() => {
    const flush = () => {
      if (dirty.current) {
        // Fire-and-forget; sendBeacon not needed because supabase-js uses fetch keepalive via REST
        flushSave(dataRef.current);
      }
    };
    const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const setField = (sectionId: string, key: string, value: number) => {
    dirty.current = true;
    setSaveState("saving");
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

  // Map 22 sections into 8 high-level domains (matches CMMS readiness convention)
  const DOMAIN_MAP: { key: string; title: string; sectionIds: string[] }[] = [
    { key: "A", title: "A. Asset & Engineering Data", sectionIds: ["asset", "bom", "asset-spare", "doc", "rcm", "cbm"] },
    { key: "B", title: "B. Preventive Maintenance", sectionIds: ["pm", "jobplan", "strategy", "shutdown"] },
    { key: "C", title: "C. Work Management Foundation", sectionIds: ["sop", "failure", "history"] },
    { key: "D", title: "D. Stores & Inventory", sectionIds: ["spares", "warehouse"] },
    { key: "E", title: "E. Planning & Scheduling", sectionIds: ["labour"] },
    { key: "F", title: "F. Finance & Costing", sectionIds: ["finance"] },
    { key: "G", title: "G. Documentation & Standards", sectionIds: ["permits", "statutory", "warranty"] },
    { key: "H", title: "H. People & Governance", sectionIds: ["kpi", "governance"] },
  ];

  const domainStatus = (s: number) =>
    s >= 80 ? { label: "Ready", color: "#16a34a" } :
    s >= 60 ? { label: "Partial", color: "#d97706" } :
    s >= 25 ? { label: "Critical", color: "#dc2626" } :
              { label: "Not Started", color: "#dc2626" };

  const generateReport = () => {
    const domainRows = DOMAIN_MAP.map((d) => {
      const items = sectionScores.filter((s) => d.sectionIds.includes(s.id));
      const score = items.length ? Math.round(items.reduce((a, x) => a + x.score, 0) / items.length) : 0;
      return { ...d, score, status: domainStatus(score) };
    });

    // Headline numbers (live from inputs)
    const a = data.asset || {};
    const pm = data.pm || {};
    const bom = data.bom || {};
    const headline: { label: string; value: string }[] = [
      { label: "Processing assets in register", value: (a.total || 0).toLocaleString() },
      { label: "Assets with functional location", value: `${(a.fl||0).toLocaleString()} / ${(a.total||0).toLocaleString()} (${pct(a.fl||0, a.total||0)}%)` },
      { label: "Assets with BOM / components defined", value: `${(bom.with_bom||0).toLocaleString()} / ${(bom.total||a.total||0).toLocaleString()} (${pct(bom.with_bom||0, bom.total||a.total||0)}%)` },
      { label: "Assets with criticality rating", value: `${(a.crit||0).toLocaleString()} / ${(a.total||0).toLocaleString()} (${pct(a.crit||0, a.total||0)}%)` },
      { label: "Assets with equipment class", value: `${(a.cls||0).toLocaleString()} / ${(a.total||0).toLocaleString()} (${pct(a.cls||0, a.total||0)}%)` },
      { label: "PMs defined", value: `${(pm.defined||0).toLocaleString()}` },
      { label: "PMs approved", value: `${(pm.approved||0).toLocaleString()} / ${(pm.defined||0).toLocaleString()} (${pct(pm.approved||0, pm.defined||0)}%)` },
    ];

    const verdict = goLiveReady
      ? `The TCMG framework is <strong>foundation-ready</strong>. All MUST-tier domains are at or above the 80% threshold. Overall readiness sits at <strong>${overall}%</strong>.`
      : `The TCMG framework has built strong <strong>structural scaffolding</strong> (asset hierarchy, naming, stock code logic, PM rendering engine) but the <strong>operational data underneath is not CMMS-ready</strong>. A go-live on SAP/Pronto/Maximo/D365 today would <strong>fail within the first PM cycle</strong> because ${blockers.length} mandatory domain(s) sit below the 80% threshold. The framework is approximately <strong>${overall}% ready</strong> overall.`;

    const sectionsHtml = sectionScores.map((s) => {
      const st = domainStatus(s.score);
      const bullets = s.calcs.map((c) => {
        const gap = c.gap && c.gap > 0 ? ` <span style="color:#6b7280">— gap: ${c.gap.toLocaleString()} ${c.gapLabel||""}</span>` : "";
        return `<li>${c.label}: <strong>${c.percent}%</strong>${gap}</li>`;
      }).join("");
      return `
        <div class="sec">
          <div class="sec-h">
            <h3>${s.title} <span class="tier ${s.tier}">${s.tier}</span></h3>
            <span class="badge" style="color:${st.color};border-color:${st.color}">${s.score}% · ${st.label}</span>
          </div>
          <ul>${bullets}</ul>
        </div>`;
    }).join("");

    const allGaps = sectionScores.flatMap((s) =>
      s.calcs.filter((c) => (c.gap || 0) > 0)
        .map((c) => ({ section: s.title, percent: c.percent, gap: c.gap || 0, label: c.gapLabel || c.label }))
    );
    allGaps.sort((a, b) => (a.percent - b.percent) || (b.gap - a.gap));
    const top5 = allGaps.slice(0, 5).map((g, i) =>
      `<tr><td>${i + 1}</td><td>${g.section}</td><td>${g.gap.toLocaleString()} ${g.label}</td><td><strong>${g.percent}%</strong></td></tr>`
    ).join("");

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>TCMG Maintenance Readiness Gap Assessment</title>
<style>
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; color:#111; margin:0; padding: 24px 32px; max-width: 900px; }
  h1 { font-size: 34px; font-weight: 800; line-height: 1.1; margin: 0 0 14px; letter-spacing: -0.5px; }
  h2 { font-size: 22px; font-weight: 700; color: #C8960C; margin: 28px 0 10px; }
  h3 { font-size: 14px; margin: 0; font-weight: 700; }
  .meta p { margin: 2px 0; font-size: 13px; }
  .meta strong { display:inline-block; min-width: 90px; }
  .lede { font-size: 13.5px; line-height: 1.55; margin: 0 0 14px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0 18px; font-size: 12.5px; }
  th { background:#111; color:#fff; text-align:left; padding: 8px 10px; font-weight: 600; }
  td { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
  tr:nth-child(even) td { background: #fafafa; }
  .status { font-weight: 700; }
  .tier { font-size: 10px; padding: 1px 6px; border-radius: 3px; margin-left: 6px; vertical-align: middle; }
  .tier.MUST { background:#111; color:#fff; }
  .tier.SHOULD { background:#e5e7eb; color:#374151; }
  .badge { font-size: 11px; font-weight:600; padding: 2px 8px; border:1px solid; border-radius: 999px; }
  .sec { padding: 10px 0; border-bottom: 1px solid #f0f0f0; page-break-inside: avoid; }
  .sec-h { display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; }
  .sec ul { margin: 4px 0 0 18px; padding: 0; font-size: 12px; line-height: 1.6; }
  .verdict-box { border: 2px solid ${goLiveReady ? "#16a34a" : "#dc2626"}; padding: 12px 14px; margin: 10px 0 16px; border-radius: 4px; background: ${goLiveReady ? "#f0fdf4" : "#fef2f2"}; }
  .verdict-box strong.v { font-size: 18px; color: ${goLiveReady ? "#16a34a" : "#dc2626"}; display:block; margin-bottom: 4px; }
  .actions { margin-bottom: 14px; }
  .actions button { padding: 8px 14px; margin-right: 8px; background:#111; color:#fff; border:0; border-radius: 4px; cursor:pointer; font-weight:600; }
  @media print { .actions { display:none; } body { padding: 0; } }
</style></head><body>
<div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div>
<h1>TCMG MAINTENANCE READINESS<br/>GAP ASSESSMENT</h1>
<div class="meta">
  <p>Foundation Review — Pre-CMMS Implementation</p>
  <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-AU", { day:"2-digit", month:"long", year:"numeric" })}</p>
  <p><strong>Scope:</strong> Tropicana / TCMG Framework — full asset, PM, work, stores, planning data</p>
  <p><strong>Benchmark:</strong> SAP PM, Pronto Xi, IBM Maximo, Microsoft D365 Asset Management</p>
  <p><strong>Purpose:</strong> Identify ALL foundational gaps that must be closed BEFORE any CMMS go-live</p>
</div>

<h2>Executive Summary — Brutally Honest Verdict</h2>
<div class="verdict-box">
  <strong class="v">${goLiveReady ? "READY FOR CMMS GO-LIVE" : "NOT READY FOR CMMS GO-LIVE"}</strong>
  Mandatory (MUST) Score: <strong>${mandatoryScore}%</strong> &nbsp;·&nbsp; Maturity (SHOULD) Score: <strong>${maturityScore}%</strong> &nbsp;·&nbsp; Overall: <strong>${overall}%</strong>
</div>
<p class="lede">${verdict}</p>

<table>
  <thead><tr><th>Domain</th><th style="width:120px">Readiness</th><th style="width:140px">Status</th></tr></thead>
  <tbody>
    ${domainRows.map((d) => `<tr><td>${d.title}</td><td>${d.score}%</td><td class="status" style="color:${d.status.color}">${d.status.label}</td></tr>`).join("")}
  </tbody>
</table>

<h2><em>Headline Numbers (live from TCMG database)</em></h2>
<table>
  <thead><tr><th>Metric</th><th>Value</th></tr></thead>
  <tbody>${headline.map((h) => `<tr><td>${h.label}</td><td>${h.value}</td></tr>`).join("")}</tbody>
</table>

${blockers.length ? `
<h2>Go-Live Blockers (MUST domains below 80%)</h2>
<table>
  <thead><tr><th>#</th><th>Section</th><th style="width:120px">Score</th></tr></thead>
  <tbody>${blockers.map((b, i) => `<tr><td>${i+1}</td><td>${b.title}</td><td class="status" style="color:#dc2626">${b.score}%</td></tr>`).join("")}</tbody>
</table>` : ""}

<h2>Top 5 Critical Gaps (ranked by impact)</h2>
<table>
  <thead><tr><th style="width:40px">#</th><th>Section</th><th>Gap</th><th style="width:80px">Coverage</th></tr></thead>
  <tbody>${top5 || `<tr><td colspan="4">No gaps recorded.</td></tr>`}</tbody>
</table>

<h2>Section Breakdown (22 Domains)</h2>
${sectionsHtml}

</body></html>`;

    setReport(html);

    // Open in new tab for print/PDF; also offer .html download
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `TCMG-Readiness-Gap-Assessment-${new Date().toISOString().slice(0,10)}.html`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
    toast({ title: "Report generated", description: "Opened in a new tab — use Print to save as PDF." });
  };

  const highRisk = [...sectionScores].sort((a, b) => a.score - b.score).slice(0, 3);

  // ===== Coverage Matrix — comparative pairings against a single denominator =====
  const coverageMatrix = useMemo(() => {
    const a = data.asset || {}; const pm = data.pm || {}; const jp = data.jobplans || {};
    const sop = data.sop || {}; const strat = data.strategy || {}; const bom = data.bom || {};
    const sp = data.spares || {}; const link = data.linkage || {}; const wh = data.warehouse || {};
    const sd = data.shutdown || {}; const oem = data.oem || {};
    const totalAssets = a.total || 0;
    const totalPMs = jp.pms || sop.pms || 0;
    const totalSpares = sp.total || wh.total || 0;
    const noPm = Math.max(0, totalAssets - (pm.any || 0));
    return [
      { title: "Asset Coverage", denom: totalAssets, denomLabel: "Total Assets", rows: [
          { label: "On Asset Tree (Functional Location)", value: a.fl || 0 },
          { label: "With Criticality Assigned", value: a.crit || 0 },
          { label: "With Equipment Class", value: a.cls || 0 },
          { label: "With Full Hierarchy", value: a.hier || 0 },
      ] },
      { title: "PM Coverage by Type", denom: totalAssets, denomLabel: "Total Assets", rows: [
          { label: "Assets with ANY PM", value: pm.any || 0 },
          { label: "Assets with Online PMs", value: pm.online || 0 },
          { label: "Assets with Offline PMs", value: pm.offline || 0 },
          { label: "Assets with Shutdown PMs", value: pm.sd || 0 },
          { label: "Assets with NO PMs", value: noPm, isGap: true },
      ] },
      { title: "PM Quality", denom: totalPMs, denomLabel: "Total PMs", rows: [
          { label: "PMs with Job Plans", value: jp.jp || 0 },
          { label: "PMs with SOPs", value: sop.sop || 0 },
      ] },
      { title: "Materials & Spares (per Asset)", denom: totalAssets, denomLabel: "Total Assets", rows: [
          { label: "Assets with BOM defined", value: bom.bom || 0 },
          { label: "Assets with Spares Linked", value: link.linked || 0 },
          { label: "Assets with OEM Documentation", value: oem.oem || 0 },
      ] },
      { title: "Stores Readiness", denom: totalSpares, denomLabel: "Total Spare Items", rows: [
          { label: "Spares with Min/Max", value: sp.mm || 0 },
          { label: "Spares with Bin Location", value: wh.loc || 0 },
      ] },
      { title: "Critical Asset Strategy", denom: strat.crit || 0, denomLabel: "Critical Assets", rows: [
          { label: "Critical Assets with Maintenance Plan", value: strat.plan || 0 },
          { label: "Critical Assets with Replacement Strategy", value: strat.repl || 0 },
          { label: "Shutdown-Required with Shutdown PMs", value: sd.has || 0, denomOverride: sd.req || 0, denomLabelOverride: "Shutdown-Required Assets" },
      ] },
    ];
  }, [data]);

  // ===== PPTX Steerco Pack =====
  const generatePptx = async () => {
    const PptxGenJS = (await import("pptxgenjs")).default;
    const p: any = new PptxGenJS();
    p.layout = "LAYOUT_WIDE";
    const GOLD="C8960C", BLACK="111111", GREY="6B7280", LIGHT="F5F5F5", RED="DC2626", AMBER="D97706", GREEN="16A34A";
    const colorFor = (s: number) => s >= 80 ? GREEN : s >= 60 ? AMBER : RED;
    const DOMAIN_MAP_LOCAL = [
      { title: "A. Asset & Engineering Data", ids: ["asset","bom","linkage","oem"] },
      { title: "B. Preventive Maintenance",    ids: ["pm","jobplans","strategy","shutdown"] },
      { title: "C. Work Management Foundation", ids: ["sop"] },
      { title: "D. Stores & Inventory",        ids: ["spares","warehouse"] },
    ];

    // 1. Title
    const t = p.addSlide(); t.background = { color: BLACK };
    t.addText("TCMG", { x:0.5, y:0.6, w:12, h:0.5, fontSize:14, color:GOLD, bold:true, fontFace:"Calibri" });
    t.addText("Maintenance Readiness", { x:0.5, y:1.6, w:12, h:1.2, fontSize:54, bold:true, color:"FFFFFF", fontFace:"Calibri" });
    t.addText("Gap Assessment — Pre-CMMS Implementation", { x:0.5, y:2.9, w:12, h:0.6, fontSize:24, color:GOLD, fontFace:"Calibri" });
    t.addText(`${new Date().toLocaleDateString("en-AU",{day:"2-digit",month:"long",year:"numeric"})}  ·  Benchmark: SAP PM, Pronto Xi, IBM Maximo, MS D365`, { x:0.5, y:6.5, w:12, h:0.4, fontSize:12, color:"BBBBBB", fontFace:"Calibri" });

    // 2. Verdict
    const v = p.addSlide(); v.background = { color: goLiveReady ? "F0FDF4" : "FEF2F2" };
    v.addText(goLiveReady ? "READY FOR CMMS GO-LIVE" : "NOT READY FOR CMMS GO-LIVE", { x:0.5, y:0.6, w:12, h:1, fontSize:40, bold:true, color: goLiveReady ? GREEN : RED, fontFace:"Calibri" });
    v.addText("Brutally Honest Verdict", { x:0.5, y:1.7, w:12, h:0.4, fontSize:14, color:GREY, italic:true, fontFace:"Calibri" });
    const stat = (x:number, label:string, val:string, color:string) => {
      v.addShape(p.ShapeType.rect, { x, y:2.5, w:3.7, h:2.2, fill:{color:"FFFFFF"}, line:{color:"E5E7EB", width:1} });
      v.addText(val, { x, y:2.7, w:3.7, h:1.3, fontSize:64, bold:true, color, align:"center", fontFace:"Calibri" });
      v.addText(label, { x, y:4.0, w:3.7, h:0.6, fontSize:13, color:GREY, align:"center", fontFace:"Calibri" });
    };
    stat(0.6, "MUST · Pre Go-Live", `${mandatoryScore}%`, colorFor(mandatoryScore));
    stat(4.8, "SHOULD · Maturity",   `${maturityScore}%`, colorFor(maturityScore));
    stat(9.0, "Overall Readiness",   `${overall}%`,       colorFor(overall));
    v.addText(blockers.length ? `${blockers.length} mandatory domain(s) below the 80% threshold — first PM cycle would fail.` : "All mandatory domains meet the 80% threshold.", { x:0.5, y:5.2, w:12, h:1, fontSize:18, color:BLACK, fontFace:"Calibri" });

    // 3. Domain table
    const d = p.addSlide(); d.background = { color:"FFFFFF" };
    d.addText("Readiness by Domain", { x:0.5, y:0.4, w:12, h:0.6, fontSize:28, bold:true, color:BLACK, fontFace:"Calibri" });
    const stFor = (s:number) => s>=80?{l:"Ready",c:GREEN}:s>=60?{l:"Partial",c:AMBER}:s>=25?{l:"Critical",c:RED}:{l:"Not Started",c:RED};
    const domRows = DOMAIN_MAP_LOCAL.map((dm) => {
      const items = sectionScores.filter((s) => dm.ids.includes(s.id));
      const sc = items.length ? Math.round(items.reduce((a,x)=>a+x.score,0)/items.length) : 0;
      const st = stFor(sc);
      return [{ text: dm.title }, { text: `${sc}%` }, { text: st.l, options:{ color: st.c, bold:true } }];
    });
    d.addTable([
      [{ text:"Domain", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }},{ text:"Readiness", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }},{ text:"Status", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }}],
      ...domRows,
    ], { x:0.5, y:1.2, w:12.3, colW:[7.3, 2.5, 2.5], fontSize:14, fontFace:"Calibri", border:{ type:"solid", pt:0.5, color:"E5E7EB" }, rowH:0.5 });

    // 4..N — One slide per Coverage Matrix group
    coverageMatrix.forEach((g) => {
      const s = p.addSlide(); s.background = { color:"FFFFFF" };
      s.addText(g.title, { x:0.5, y:0.4, w:12, h:0.6, fontSize:28, bold:true, color:BLACK, fontFace:"Calibri" });
      s.addText(`Denominator: ${g.denomLabel} = ${(g.denom||0).toLocaleString()}`, { x:0.5, y:1.0, w:12, h:0.4, fontSize:14, color:GREY, fontFace:"Calibri" });
      g.rows.forEach((r:any, i:number) => {
        const den = r.denomOverride !== undefined ? r.denomOverride : g.denom;
        const percent = pct(r.value || 0, den || 0);
        const y = 1.6 + i * 0.85;
        s.addShape(p.ShapeType.rect, { x:0.5, y, w:12.3, h:0.75, fill:{color:LIGHT}, line:{color:"E5E7EB", width:0.5} });
        const barW = Math.max(0.05, (percent/100) * 12.3);
        s.addShape(p.ShapeType.rect, { x:0.5, y, w: barW, h:0.75, fill:{color: r.isGap ? RED : colorFor(percent)} });
        s.addText(r.label, { x:0.7, y, w:7.5, h:0.75, fontSize:14, bold:true, color:"FFFFFF", fontFace:"Calibri", valign:"middle" });
        s.addText(`${(r.value||0).toLocaleString()} / ${(den||0).toLocaleString()}  ·  ${percent}%`, { x:8.3, y, w:4.4, h:0.75, fontSize:14, bold:true, color:"FFFFFF", align:"right", fontFace:"Calibri", valign:"middle" });
      });
    });

    // Top 5 Gaps
    const g5 = p.addSlide(); g5.background = { color:"FFFFFF" };
    g5.addText("Top 5 Critical Gaps", { x:0.5, y:0.4, w:12, h:0.6, fontSize:28, bold:true, color:BLACK, fontFace:"Calibri" });
    const allGaps = sectionScores.flatMap((s) => s.calcs.filter((c)=>(c.gap||0)>0).map((c)=>({ section:s.title, percent:c.percent, gap:c.gap||0, label:c.gapLabel||c.label })));
    allGaps.sort((a,b)=> (a.percent-b.percent) || (b.gap-a.gap));
    const top5 = allGaps.slice(0,5);
    if (top5.length === 0) {
      g5.addText("No gaps recorded.", { x:0.5, y:1.5, w:12, h:0.5, fontSize:18, color:GREY, fontFace:"Calibri" });
    } else {
      g5.addTable([
        [{ text:"#", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }},{ text:"Section", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }},{ text:"Gap", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }},{ text:"Coverage", options:{ bold:true, color:"FFFFFF", fill:{color:BLACK} }}],
        ...top5.map((x,i)=>[`${i+1}`, x.section, `${x.gap.toLocaleString()} ${x.label}`, { text:`${x.percent}%`, options:{ bold:true, color: colorFor(x.percent) }}]),
      ], { x:0.5, y:1.2, w:12.3, colW:[0.6, 6.7, 3.5, 1.5], fontSize:14, fontFace:"Calibri", border:{ type:"solid", pt:0.5, color:"E5E7EB" }, rowH:0.5 });
    }

    // Closing
    const c = p.addSlide(); c.background = { color: BLACK };
    c.addText("Recommendation", { x:0.5, y:1.2, w:12, h:0.6, fontSize:18, color:GOLD, fontFace:"Calibri" });
    c.addText(goLiveReady ? "Proceed to CMMS implementation phase." : "DO NOT proceed to CMMS go-live.", { x:0.5, y:1.9, w:12, h:1, fontSize:36, bold:true, color:"FFFFFF", fontFace:"Calibri" });
    c.addText(goLiveReady ? "All foundational data passes the 80% readiness threshold." : `Close the ${blockers.length} mandatory domain gap(s) before vendor selection or go-live planning.`, { x:0.5, y:3.0, w:12, h:1, fontSize:18, color:"DDDDDD", fontFace:"Calibri" });

    await p.writeFile({ fileName: `TCMG-Steerco-Readiness-${new Date().toISOString().slice(0,10)}.pptx` });
    toast({ title: "Steerco pack generated", description: "PowerPoint downloaded." });
  };

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
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded border ${
                saveState === "saving" ? "border-amber-500 text-amber-600" :
                saveState === "saved"  ? "border-green-600 text-green-700" :
                saveState === "error"  ? "border-red-600 text-red-700" :
                                          "border-border text-muted-foreground"
              }`}>
                {saveState === "saving" ? "Saving…" :
                 saveState === "saved"  ? "All changes saved" :
                 saveState === "error"  ? "Save failed — retry" :
                                          "Auto-save on"}
              </span>
              <Button asChild variant="outline" className="gap-2">
                <a href="/pm-requirements-matrix"><ClipboardList className="w-4 h-4" /> PM Requirements Matrix</a>
              </Button>
              <Button onClick={generateReport} disabled={loading} className="gap-2">
                <FileDown className="w-4 h-4" /> Foundation Risk Report (PDF)
              </Button>
              <Button onClick={generatePptx} disabled={loading} variant="outline" className="gap-2">
                <FileDown className="w-4 h-4" /> Steerco Pack (PPTX)
              </Button>
            </div>
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

        {/* ===== Coverage Matrix — comparative pairings for presenting ===== */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Coverage Matrix — Comparative Readiness</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Side-by-side numerators against a single denominator — the view your Steerco needs to see the gap.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {coverageMatrix.map((g) => (
              <div key={g.title}>
                <div className="flex items-baseline justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
                  <span className="text-xs text-muted-foreground">
                    {g.denomLabel}: <strong className="text-foreground">{(g.denom||0).toLocaleString()}</strong>
                  </span>
                </div>
                <div className="space-y-1.5">
                  {g.rows.map((r: any) => {
                    const den = r.denomOverride !== undefined ? r.denomOverride : g.denom;
                    const percent = den > 0 ? Math.round(((r.value||0) / den) * 100) : 0;
                    const barCls = r.isGap
                      ? "bg-red-600"
                      : percent >= 80 ? "bg-green-600"
                      : percent >= 60 ? "bg-amber-500"
                      : "bg-red-600";
                    return (
                      <div key={r.label} className="relative h-7 rounded bg-muted overflow-hidden border border-border">
                        <div className={`absolute inset-y-0 left-0 ${barCls}`} style={{ width: `${Math.min(100, percent)}%` }} />
                        <div className="relative flex items-center justify-between h-full px-2 text-xs font-medium">
                          <span className={percent > 35 ? "text-white" : "text-foreground"}>{r.label}</span>
                          <span className={percent > 65 ? "text-white" : "text-foreground"}>
                            {(r.value||0).toLocaleString()} / {(den||0).toLocaleString()} · {percent}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
                <CardTitle className="text-lg">Foundation Risk Report — Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <iframe
                title="Foundation Risk Report"
                srcDoc={report}
                className="w-full h-[700px] border border-border rounded bg-white"
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MaintenanceSystemFoundation;
