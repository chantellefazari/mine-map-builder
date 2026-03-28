import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, OctagonAlert, Info } from "lucide-react";

const TOP_RISKS = [
  { risk: "Poor user adoption", detail: "Trades and operators bypass the system, continue verbal requests and text messages. Work remains untracked and maintenance history is lost." },
  { risk: "Incomplete stores and stock control", detail: "No physical stores infrastructure, no receiving process, no cycle counting. Parts cannot be managed through the system." },
  { risk: "Parallel systems continue", detail: "Excel trackers, whiteboard schedules, and manual PO logs persist alongside the new system, creating two sources of truth." },
  { risk: "Incomplete master data", detail: "Parts catalogue missing BOM linkage, min/max levels, and lead times. Asset hierarchy has gaps in secondary areas. PM quality varies." },
  { risk: "Weak leadership enforcement", detail: "Supervisors not held accountable for team compliance. Management accepts information delivered outside the system." },
];

const TOP_PREREQUISITES = [
  { item: "Stores control maturity", detail: "Physical stores established, receiving process operational, bin locations mapped, cycle counting started for critical spares." },
  { item: "Asset hierarchy locked", detail: "Rev B register validated, parent-child relationships confirmed, functional locations complete. Change control in place." },
  { item: "Parts catalogue and BOM maturity", detail: "Top 200 critical spares enriched with min/max, lead times, and costs. Top 50 assets have linked BOMs." },
  { item: "Role-based training completed", detail: "Separate training for operators, trades, supervisors, planners, and stores. Super users trained and rostered on every shift." },
  { item: "Site workflow enforcement agreed", detail: "WR → WO → Schedule → Close process documented, approved by supervisors, and endorsed by site leadership in writing." },
];

const PHASES = [
  { label: "Foundation Stabilisation", desc: "Complete all prerequisites, stores setup, data enrichment, and training" },
  { label: "Controlled Pilot", desc: "Single area, limited scope, parallel running for minimum 2 weeks" },
  { label: "Operational Go-Live", desc: "Full site rollout once pilot gates are met and issues resolved" },
  { label: "Reinforcement & Optimisation", desc: "Embed adoption, mature reporting, and expand advanced features" },
];

const phaseColors = [
  "bg-blue-500/10 border-blue-500/30 text-blue-700",
  "bg-amber-500/10 border-amber-500/30 text-amber-700",
  "bg-emerald-500/10 border-emerald-500/30 text-emerald-700",
  "bg-purple-500/10 border-purple-500/30 text-purple-700",
];

export const ExecutiveSummaryTab = () => (
  <div className="space-y-5">
    {/* 1. Overall Readiness Rating */}
    <Card className="border-2 border-amber-500/50 bg-amber-500/5">
      <CardContent className="py-6 px-6">
        <div className="flex items-center justify-between flex-wrap gap-5">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Overall Readiness Rating</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1.5 tracking-tight">Not Ready for Full Go-Live</p>
            <p className="text-xs text-muted-foreground mt-1">Foundations are progressing. Site readiness and behavioural change remain the deciding factors.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Current Recommendation</p>
            <span className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 bg-amber-500/15 border-2 border-amber-500/30 px-4 py-2 rounded-lg">
              <AlertTriangle className="w-4 h-4" />
              Ready for Pilot Only (with conditions)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* 2 & 3. Top Risks + Prerequisites side by side */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="border-destructive/30">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            Top 5 Implementation Risks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-5">
          {TOP_RISKS.map((r, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="text-destructive font-bold text-sm mt-0.5 shrink-0 w-5 text-right">{i + 1}.</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{r.risk}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{r.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-amber-500/30">
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            Top 5 Outstanding Prerequisites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pb-5">
          {TOP_PREREQUISITES.map((p, i) => (
            <div key={i} className="flex gap-2.5">
              <span className="text-amber-600 font-bold text-sm mt-0.5 shrink-0 w-5 text-right">{i + 1}.</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{p.item}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{p.detail}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* 4. Recommended Rollout Approach */}
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm">Recommended Rollout Approach</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Phased implementation with a controlled pilot first, followed by operational rollout only once readiness gates are met. A big-bang approach is not recommended for this site environment.
        </p>
        <div className="flex items-start gap-1 flex-wrap">
          {PHASES.map((p, i) => (
            <div key={p.label} className="flex items-center gap-1.5">
              {i > 0 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />}
              <div className={cn("px-3 py-2 rounded-lg border text-center min-w-[150px]", phaseColors[i])}>
                <p className="text-xs font-bold">{p.label}</p>
                <p className="text-[10px] mt-0.5 opacity-80">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* 5. Implementation Position Narrative */}
    <Card>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm">Implementation Position</CardTitle>
      </CardHeader>
      <CardContent className="text-[13px] text-muted-foreground leading-relaxed space-y-3 pb-5">
        <p>
          The Minesite.ai system is progressing well. Core modules for asset management, PM design, work order management, procurement, and stores have been built and are functional. The underlying data foundations, including the asset hierarchy, functional locations, and naming conventions, are in a strong position.
        </p>
        <p>
          However, the software is only one part of successful implementation. The deciding factors are site readiness: whether people will use the system, whether processes are followed, whether data is maintained, and whether leadership enforces compliance. At Tennant Creek, the work culture has historically been reactive, stores and inventory controls are still being established, and structured work management is new for most of the workforce.
        </p>
        <p>
          These are not software problems. They are people, process, and infrastructure challenges that must be addressed before any live rollout. An uncontrolled go-live in this environment would create high risk of poor adoption, low trust in the system, and a workforce that reverts to familiar manual methods within weeks.
        </p>
        <p className="font-semibold text-foreground">
          The recommendation is to complete all foundation work, prepare and execute a controlled pilot in a single area, and only proceed to full operational go-live once the pilot has demonstrated sustained adoption and process compliance for a minimum of two weeks.
        </p>
      </CardContent>
    </Card>

    {/* 6. Key Decision Box */}
    <Card className="border-2 border-primary/40 bg-primary/5">
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <OctagonAlert className="w-4 h-4 text-primary" />
          Management Decision Guidance
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-700">Proceed with Foundation Work</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Complete stores setup, data enrichment, training preparation, and leadership alignment. This work is underway and should continue.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-700">Prepare for Pilot</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Select pilot area and crew. Train super users. Conduct desktop walkthroughs. Pilot should not commence until all Phase 1 prerequisites are met.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
            <ShieldAlert className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-destructive">Do Not Move to Full Go-Live</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Full operational rollout must not proceed until pilot success is demonstrated, all readiness gates are passed, and leadership has formally signed off on go-live.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
