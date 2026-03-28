import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";

const TOP_RISKS = [
  "Site workforce resists structured work order processes and reverts to reactive habits.",
  "No formal change management plan exists; rollout treated as an IT project.",
  "Physical stores not established; no stock control, receiving, or cycle counting.",
  "Big-bang rollout attempted instead of phased approach.",
  "Parts catalogue incomplete; reorder logic will fail without min/max and lead time data.",
];

const TOP_PREREQUISITES = [
  "Leadership endorsement signed and communicated to all site personnel.",
  "Physical stores established with basic receiving and stock control processes.",
  "Role-based training materials prepared and super users trained.",
  "Desktop walkthrough of WR → WO → Schedule → Close completed with supervisors.",
  "Top 200 critical spares fully data-enriched in parts catalogue.",
];

export const ExecutiveSummaryTab = () => (
  <div className="space-y-6">
    {/* Overall rating */}
    <Card className="border-amber-500/40 bg-amber-500/5">
      <CardContent className="py-5 px-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Overall Readiness Rating</p>
            <p className="text-xl font-bold text-amber-700 mt-1">Not Ready for Full Go-Live</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Current Recommendation</p>
            <span className="inline-flex items-center gap-1.5 mt-1 text-sm font-bold text-amber-700 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              Ready for Pilot (with conditions)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top risks */}
      <Card className="border-destructive/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            Top 5 Implementation Risks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TOP_RISKS.map((r, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <span className="text-destructive font-bold mt-0.5 shrink-0">{i + 1}.</span>
              <span className="text-muted-foreground">{r}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Top prerequisites */}
      <Card className="border-amber-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            Top 5 Prerequisites Still Outstanding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {TOP_PREREQUISITES.map((p, i) => (
            <div key={i} className="flex gap-2 text-xs">
              <span className="text-amber-600 font-bold mt-0.5 shrink-0">{i + 1}.</span>
              <span className="text-muted-foreground">{p}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Recommended approach */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Recommended Rollout Approach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          {["Foundation Stabilisation", "Controlled Pilot", "Operational Go-Live", "Reinforcement & Optimisation"].map((p, i) => (
            <div key={p} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-muted-foreground/40">→</span>}
              <span className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-md border",
                i === 0 ? "bg-blue-500/10 border-blue-500/30 text-blue-700" :
                i === 1 ? "bg-amber-500/10 border-amber-500/30 text-amber-700" :
                i === 2 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700" :
                "bg-purple-500/10 border-purple-500/30 text-purple-700"
              )}>{p}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Narrative */}
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Implementation Position</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
        <p>
          The Minesite.ai system itself is progressing well. Core modules for asset management, PM design, work order management, procurement, and stores are built and functional. The underlying data foundations (asset hierarchy, functional locations, naming conventions) are strong.
        </p>
        <p>
          However, successful rollout depends on factors that sit outside the software: site adoption, leadership enforcement, controlled process discipline, and completion of remaining foundations. The site's historically reactive culture, informal stores practices, and absence of structured work management create significant implementation risk.
        </p>
        <p className="font-medium text-foreground">
          The recommendation is to proceed to a controlled pilot only after completing all Phase 1 prerequisites, including physical stores setup, leadership endorsement, super user training, and desktop walkthroughs. Full go-live should not be attempted until the pilot has demonstrated sustained adoption for a minimum of two weeks.
        </p>
        <p>
          A big-bang rollout approach carries unacceptable risk and is not recommended. Phased, controlled implementation with strong change management and leadership accountability is the only viable path to sustainable system adoption.
        </p>
      </CardContent>
    </Card>
  </div>
);
