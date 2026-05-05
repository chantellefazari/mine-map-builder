import { useEffect, useMemo, useState } from "react";
import { Layers, AlertTriangle, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type FieldDef = { key: string; label: string; type?: "number" | "yesno" };
type SectionDef = {
  id: string;
  title: string;
  inputs: FieldDef[];
  /** returns array of {label, percent} for auto-calculated coverage metrics */
  calc: (v: Record<string, number>) => { label: string; percent: number }[];
  /** returns array of gap output strings */
  gaps: (v: Record<string, number>, c: { label: string; percent: number }[]) => string[];
};

const pct = (num: number, den: number) =>
  den > 0 ? Math.max(0, Math.min(100, Math.round((num / den) * 100))) : 0;

const SECTIONS: SectionDef[] = [
  {
    id: "asset",
    title: "1. Asset Foundation",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "hier", label: "Assets with Full Hierarchy" },
      { key: "crit", label: "Assets with Criticality Assigned" },
      { key: "cls", label: "Assets with Equipment Class" },
    ],
    calc: (v) => [
      { label: "% Hierarchy Complete", percent: pct(v.hier, v.total) },
      { label: "% Criticality Coverage", percent: pct(v.crit, v.total) },
      { label: "% Classification Coverage", percent: pct(v.cls, v.total) },
    ],
    gaps: (v) => [
      `Missing hierarchy: ${Math.max(0, (v.total || 0) - (v.hier || 0))} assets`,
      `Missing criticality: ${Math.max(0, (v.total || 0) - (v.crit || 0))} assets`,
      `Missing classification: ${Math.max(0, (v.total || 0) - (v.cls || 0))} assets`,
    ],
  },
  {
    id: "pm",
    title: "2. PM System",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "online", label: "Assets with Online PMs" },
      { key: "offline", label: "Assets with Offline PMs" },
      { key: "sd", label: "Assets with Shutdown PMs" },
      { key: "pms", label: "Total PMs Created" },
    ],
    calc: (v) => {
      const noPm = Math.max(0, (v.total || 0) - Math.max(v.online || 0, v.offline || 0, v.sd || 0));
      return [
        { label: "Online PM Coverage %", percent: pct(v.online, v.total) },
        { label: "Offline PM Coverage %", percent: pct(v.offline, v.total) },
        { label: "Shutdown Coverage %", percent: pct(v.sd, v.total) },
        { label: "Assets with NO PM %", percent: pct(noPm, v.total) },
      ];
    },
    gaps: (v) => [
      `Assets missing any PM: ${Math.max(0, (v.total || 0) - Math.max(v.online || 0, v.offline || 0, v.sd || 0))}`,
      `Assets missing offline strategy: ${Math.max(0, (v.total || 0) - (v.offline || 0))}`,
      `Assets missing shutdown tasks: ${Math.max(0, (v.total || 0) - (v.sd || 0))}`,
    ],
  },
  {
    id: "strategy",
    title: "3. Maintenance Strategy",
    inputs: [
      { key: "crit", label: "Total Critical Assets" },
      { key: "plan", label: "Assets with Maintenance Plans" },
      { key: "repl", label: "Assets with Replacement Strategies" },
    ],
    calc: (v) => [
      { label: "Plan Coverage %", percent: pct(v.plan, v.crit) },
      { label: "Replacement Strategy Coverage %", percent: pct(v.repl, v.crit) },
    ],
    gaps: (v) => [
      `Critical assets missing lifecycle plan: ${Math.max(0, (v.crit || 0) - (v.plan || 0))}`,
      `Critical assets missing replacement strategy: ${Math.max(0, (v.crit || 0) - (v.repl || 0))}`,
    ],
  },
  {
    id: "spares",
    title: "4. Stores & Spares",
    inputs: [
      { key: "total", label: "Total Assets" },
      { key: "bom", label: "Assets with BOM" },
      { key: "crit", label: "Critical Spares Defined" },
      { key: "mm", label: "Items with Min/Max" },
    ],
    calc: (v) => [
      { label: "BOM Coverage %", percent: pct(v.bom, v.total) },
      { label: "Min/Max Coverage %", percent: pct(v.mm, v.crit) },
    ],
    gaps: (v) => [
      `Assets missing BOM: ${Math.max(0, (v.total || 0) - (v.bom || 0))}`,
      `Critical spares without Min/Max: ${Math.max(0, (v.crit || 0) - (v.mm || 0))}`,
    ],
  },
  {
    id: "job",
    title: "5. Job Plans",
    inputs: [
      { key: "pms", label: "Total PMs" },
      { key: "jp", label: "PMs with Job Plans" },
      { key: "std", label: "Job Plans Standardised" },
    ],
    calc: (v) => [
      { label: "Job Plan Coverage %", percent: pct(v.jp, v.pms) },
      { label: "Standardisation %", percent: pct(v.std, v.jp) },
    ],
    gaps: (v) => [
      `PMs missing job plans: ${Math.max(0, (v.pms || 0) - (v.jp || 0))}`,
      `Non-standardised job plans: ${Math.max(0, (v.jp || 0) - (v.std || 0))}`,
    ],
  },
  {
    id: "docs",
    title: "6. Documentation (SOPs)",
    inputs: [
      { key: "pms", label: "Total PMs" },
      { key: "sop", label: "PMs with SOPs" },
      { key: "oem", label: "Assets with OEM Docs" },
      { key: "totalAssets", label: "Total Assets (for OEM ratio)" },
    ],
    calc: (v) => [
      { label: "SOP Coverage %", percent: pct(v.sop, v.pms) },
      { label: "OEM Doc Coverage %", percent: pct(v.oem, v.totalAssets) },
    ],
    gaps: (v) => [
      `PMs missing SOPs: ${Math.max(0, (v.pms || 0) - (v.sop || 0))}`,
      `Assets missing OEM docs: ${Math.max(0, (v.totalAssets || 0) - (v.oem || 0))}`,
    ],
  },
  {
    id: "shutdown",
    title: "7. Shutdown Strategy",
    inputs: [
      { key: "cycles", label: "Shutdown Cycles Defined (1 = Yes, 0 = No)", type: "yesno" },
      { key: "assets", label: "Assets with Shutdown Tasks" },
      { key: "totalAssets", label: "Total Assets" },
      { key: "sdpms", label: "Shutdown PM Count" },
    ],
    calc: (v) => [
      { label: "Shutdown Asset Coverage %", percent: pct(v.assets, v.totalAssets) },
      { label: "Shutdown Cycles Defined", percent: v.cycles ? 100 : 0 },
    ],
    gaps: (v) => [
      `Assets missing shutdown tasks: ${Math.max(0, (v.totalAssets || 0) - (v.assets || 0))}`,
      v.cycles ? "Shutdown cycles defined ✓" : "Shutdown cycles NOT defined",
      `Total shutdown PMs recorded: ${v.sdpms || 0}`,
    ],
  },
];

const scoreColor = (p: number) =>
  p >= 80 ? "text-emerald-600" : p >= 50 ? "text-amber-600" : "text-red-600";
const scoreBadge = (p: number) =>
  p >= 80 ? "default" : p >= 50 ? "secondary" : ("destructive" as const);

const SectionCard = ({
  section,
  values,
  onChange,
}: {
  section: SectionDef;
  values: Record<string, number>;
  onChange: (key: string, v: number) => void;
}) => {
  const calcs = section.calc(values);
  const avg =
    calcs.length > 0 ? Math.round(calcs.reduce((a, c) => a + c.percent, 0) / calcs.length) : 0;
  const gaps = section.gaps(values, calcs);

  return (
    <Card id={section.id} className="scroll-mt-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{section.title}</CardTitle>
          <Badge variant={scoreBadge(avg) as any}>{avg}% Coverage</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Input
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {section.inputs.map((f) => (
              <div key={f.key} className="space-y-1">
                <Label htmlFor={`${section.id}-${f.key}`} className="text-xs">
                  {f.label}
                </Label>
                <Input
                  id={`${section.id}-${f.key}`}
                  type="number"
                  min={0}
                  value={values[f.key] ?? ""}
                  onChange={(e) => onChange(f.key, Number(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Auto-Calculated
          </h4>
          <div className="space-y-2">
            {calcs.map((c) => (
              <div key={c.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{c.label}</span>
                  <span className={`font-semibold ${scoreColor(c.percent)}`}>{c.percent}%</span>
                </div>
                <Progress value={c.percent} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Gap Summary
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {gaps.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const MaintenanceSystemFoundation = () => {
  const [data, setData] = useState<Record<string, Record<string, number>>>({});

  const setField = (sectionId: string, key: string, value: number) =>
    setData((prev) => ({ ...prev, [sectionId]: { ...(prev[sectionId] || {}), [key]: value } }));

  const sectionScores = useMemo(
    () =>
      SECTIONS.map((s) => {
        const calcs = s.calc(data[s.id] || {});
        const avg = calcs.length
          ? Math.round(calcs.reduce((a, c) => a + c.percent, 0) / calcs.length)
          : 0;
        return { id: s.id, title: s.title, score: avg };
      }),
    [data]
  );

  const overall = useMemo(
    () =>
      sectionScores.length
        ? Math.round(sectionScores.reduce((a, s) => a + s.score, 0) / sectionScores.length)
        : 0,
    [sectionScores]
  );

  const highRisk = [...sectionScores].sort((a, b) => a.score - b.score).slice(0, 3);
  const priorities = highRisk.filter((s) => s.score < 80);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-gold">
              <Layers className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                Maintenance System Foundation
              </h1>
              <p className="text-muted-foreground text-sm">
                Manual data entry tool. Paste data from MineSite AI (or any CMMS) — system
                calculates coverage, gaps, and overall readiness instantly.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        {/* Readiness Score Summary */}
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
                  Overall Readiness
                </div>
              </div>
              <div className="flex-1">
                <Progress value={overall} className="h-3" />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Critical (&lt;50%)</span>
                  <span>Partial (50–79%)</span>
                  <span>Ready (≥80%)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h4 className="text-sm font-semibold">High Risk Areas</h4>
                </div>
                <ul className="space-y-1.5">
                  {highRisk.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{s.title}</span>
                      <Badge variant={scoreBadge(s.score) as any}>{s.score}%</Badge>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <h4 className="text-sm font-semibold">Immediate Priorities</h4>
                </div>
                {priorities.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No data entered yet — fill in section inputs below.
                  </p>
                ) : (
                  <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                    {priorities.map((s) => (
                      <li key={s.id}>
                        Improve <span className="text-foreground font-medium">{s.title}</span> ({s.score}%)
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              values={data[section.id] || {}}
              onChange={(key, v) => setField(section.id, key, v)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default MaintenanceSystemFoundation;
