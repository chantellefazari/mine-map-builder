import { useState, useMemo, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  X, Route, Clock, AlertTriangle, Wrench, Zap, Filter, ChevronRight,
  Activity, CheckCircle2, Package, Lock, Target, ArrowRight, Layers,
  Calendar, Shield, GitBranch, Play, Pause, Eye,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

type WPStatus = "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
type DepType = "finish-to-start" | "start-to-start" | "parallel" | "hold-point";

interface FlowNode {
  id: string;
  title: string;
  area: string;
  trade: string;
  duration: string;
  status: WPStatus;
  pctComplete: number;
  criticalPath: boolean;
  plannedStart: string;
  plannedFinish: string;
  description: string;
  supervisor: string;
  delayReason: string;
  constraints: string;
  // Layout — column (stage) and row within that column
  col: number;
  row: number;
}

interface FlowEdge {
  from: string;
  to: string;
  type: DepType;
}

/* ------------------------------------------------------------------ */
/*  DEMO DATA                                                          */
/* ------------------------------------------------------------------ */

const NODES: FlowNode[] = [
  // Col 0 — Preparation
  { id: "WP-001", title: "Plant Isolation & Lockout", area: "Infrastructure", trade: "Electrical", duration: "4h", status: "Complete", pctComplete: 100, criticalPath: true, plannedStart: "Day 1 06:00", plannedFinish: "Day 1 10:00", description: "Complete plant-wide electrical isolation and LOTO verification across all MCCs.", supervisor: "L. Chen", delayReason: "", constraints: "", col: 0, row: 0 },
  { id: "WP-002", title: "Scaffold Erection — Grinding", area: "Grinding", trade: "Mechanical", duration: "6h", status: "Complete", pctComplete: 100, criticalPath: true, plannedStart: "Day 1 06:00", plannedFinish: "Day 1 12:00", description: "Erect scaffold access for SAG mill and ball mill work areas.", supervisor: "J. Mitchell", delayReason: "", constraints: "", col: 0, row: 1 },
  { id: "WP-003", title: "Crane Mobilisation", area: "Infrastructure", trade: "Mechanical", duration: "3h", status: "Complete", pctComplete: 100, criticalPath: false, plannedStart: "Day 1 06:00", plannedFinish: "Day 1 09:00", description: "Mobilise 50t and 25t cranes to designated lift zones.", supervisor: "B. Williams", delayReason: "", constraints: "", col: 0, row: 2 },

  // Col 1 — Phase 1
  { id: "WP-004", title: "SAG Mill Liner Bolt-Out", area: "Grinding", trade: "Mechanical", duration: "12h", status: "Active", pctComplete: 45, criticalPath: true, plannedStart: "Day 1 12:00", plannedFinish: "Day 2 00:00", description: "Remove worn SAG mill liners using hydraulic bolt removal tools.", supervisor: "J. Mitchell", delayReason: "", constraints: "Requires scaffold complete", col: 1, row: 0 },
  { id: "WP-005", title: "Jaw Crusher Liner Replacement", area: "Crushing", trade: "Mechanical", duration: "8h", status: "Active", pctComplete: 60, criticalPath: false, plannedStart: "Day 1 10:00", plannedFinish: "Day 1 18:00", description: "Replace jaw crusher fixed and swing jaw liners.", supervisor: "M. Thompson", delayReason: "", constraints: "", col: 1, row: 1 },
  { id: "WP-006", title: "CIL Agitator Gearbox Inspection", area: "CIL / Leaching", trade: "Mechanical", duration: "6h", status: "Active", pctComplete: 70, criticalPath: false, plannedStart: "Day 1 10:00", plannedFinish: "Day 1 16:00", description: "Inspect agitator gearboxes on Tanks 1-6 for wear and oil condition.", supervisor: "K. Singh", delayReason: "", constraints: "", col: 1, row: 2 },
  { id: "WP-007", title: "Crusher MCC Switchboard Service", area: "Crushing", trade: "Electrical", duration: "6h", status: "Blocked", pctComplete: 20, criticalPath: false, plannedStart: "Day 1 10:00", plannedFinish: "Day 1 16:00", description: "Thermographic scan and torque check on crusher MCC.", supervisor: "L. Chen", delayReason: "Waiting for isolation clearance", constraints: "Requires WP-001 verified", col: 1, row: 3 },

  // Col 2 — Phase 2
  { id: "WP-008", title: "SAG Mill Liner Install", area: "Grinding", trade: "Mechanical", duration: "14h", status: "Ready", pctComplete: 0, criticalPath: true, plannedStart: "Day 2 00:00", plannedFinish: "Day 2 14:00", description: "Install new SAG mill liners and torque all bolts to specification.", supervisor: "J. Mitchell", delayReason: "", constraints: "Requires WP-004 complete", col: 2, row: 0 },
  { id: "WP-009", title: "Ball Mill Trunnion Bearing Reline", area: "Grinding", trade: "Mechanical", duration: "10h", status: "Active", pctComplete: 15, criticalPath: true, plannedStart: "Day 1 12:00", plannedFinish: "Day 1 22:00", description: "Reline ball mill trunnion bearings — both feed and discharge end.", supervisor: "J. Mitchell", delayReason: "", constraints: "", col: 2, row: 1 },
  { id: "WP-010", title: "Thickener Rake Arm Inspection", area: "Thickening", trade: "Mechanical", duration: "8h", status: "Active", pctComplete: 40, criticalPath: true, plannedStart: "Day 1 10:00", plannedFinish: "Day 1 18:00", description: "Inspect thickener rake arm, torque tube, and drive head.", supervisor: "A. Reyes", delayReason: "", constraints: "", col: 2, row: 2 },
  { id: "WP-011", title: "VSD Replacement — Mill Drive", area: "Grinding", trade: "Electrical", duration: "8h", status: "Delayed", pctComplete: 10, criticalPath: true, plannedStart: "Day 1 14:00", plannedFinish: "Day 1 22:00", description: "Replace failed VSD unit on SAG mill main drive.", supervisor: "L. Chen", delayReason: "Replacement VSD not yet received on site", constraints: "Parts delivery dependent", col: 2, row: 3 },

  // Col 3 — Phase 3
  { id: "WP-012", title: "Cyclone Cluster Replacement", area: "Grinding", trade: "Mechanical", duration: "6h", status: "Blocked", pctComplete: 0, criticalPath: true, plannedStart: "Day 2 14:00", plannedFinish: "Day 2 20:00", description: "Replace worn cyclone cluster apex and vortex finders.", supervisor: "J. Mitchell", delayReason: "50t crane unavailable", constraints: "Requires crane + WP-008", col: 3, row: 0 },
  { id: "WP-013", title: "Carbon Screen Panel Replacement", area: "CIL / Leaching", trade: "Mechanical", duration: "5h", status: "Active", pctComplete: 70, criticalPath: false, plannedStart: "Day 2 06:00", plannedFinish: "Day 2 11:00", description: "Replace carbon screen panels and inspect frame welds.", supervisor: "K. Singh", delayReason: "", constraints: "", col: 3, row: 1 },
  { id: "WP-014", title: "Underflow Pump Impeller Swap", area: "Tailings", trade: "Mechanical", duration: "6h", status: "Blocked", pctComplete: 0, criticalPath: true, plannedStart: "Day 2 06:00", plannedFinish: "Day 2 12:00", description: "Swap worn impeller on thickener underflow pump TUFP01.", supervisor: "R. Torres", delayReason: "Scaffold not erected", constraints: "Requires scaffold access", col: 3, row: 2 },
  { id: "WP-015", title: "Tailings Pipeline Tie-In", area: "Tailings", trade: "Mechanical", duration: "8h", status: "Delayed", pctComplete: 5, criticalPath: true, plannedStart: "Day 2 12:00", plannedFinish: "Day 2 20:00", description: "Complete pipeline tie-in for new tailings discharge line.", supervisor: "R. Torres", delayReason: "Environmental clearance pending", constraints: "Enviro permit required", col: 3, row: 3 },

  // Col 4 — Completion
  { id: "WP-016", title: "Mill Alignment & Checks", area: "Grinding", trade: "Mechanical", duration: "4h", status: "Ready", pctComplete: 0, criticalPath: true, plannedStart: "Day 2 20:00", plannedFinish: "Day 3 00:00", description: "Final alignment checks on SAG mill after liner install and cyclone work.", supervisor: "J. Mitchell", delayReason: "", constraints: "Requires WP-008 + WP-012", col: 4, row: 0 },
  { id: "WP-017", title: "Elution Column Heater Service", area: "Gold Room", trade: "Electrical", duration: "6h", status: "Active", pctComplete: 80, criticalPath: false, plannedStart: "Day 2 06:00", plannedFinish: "Day 2 12:00", description: "Service elution column heating elements and thermocouples.", supervisor: "P. Adams", delayReason: "", constraints: "", col: 4, row: 1 },
  { id: "WP-018", title: "Pre-Start Commissioning", area: "Infrastructure", trade: "Electrical", duration: "6h", status: "Ready", pctComplete: 0, criticalPath: true, plannedStart: "Day 3 00:00", plannedFinish: "Day 3 06:00", description: "Full plant pre-start commissioning, bump tests, and safety checks.", supervisor: "L. Chen", delayReason: "", constraints: "All critical path packages complete", col: 4, row: 2 },
];

const EDGES: FlowEdge[] = [
  // Prep → Phase 1
  { from: "WP-001", to: "WP-004", type: "finish-to-start" },
  { from: "WP-001", to: "WP-005", type: "finish-to-start" },
  { from: "WP-001", to: "WP-006", type: "finish-to-start" },
  { from: "WP-001", to: "WP-007", type: "finish-to-start" },
  { from: "WP-002", to: "WP-004", type: "finish-to-start" },
  { from: "WP-003", to: "WP-005", type: "parallel" },
  // Phase 1 → Phase 2
  { from: "WP-004", to: "WP-008", type: "finish-to-start" },
  { from: "WP-002", to: "WP-009", type: "finish-to-start" },
  { from: "WP-001", to: "WP-010", type: "finish-to-start" },
  { from: "WP-004", to: "WP-011", type: "start-to-start" },
  // Phase 2 → Phase 3
  { from: "WP-008", to: "WP-012", type: "finish-to-start" },
  { from: "WP-006", to: "WP-013", type: "finish-to-start" },
  { from: "WP-010", to: "WP-014", type: "finish-to-start" },
  { from: "WP-014", to: "WP-015", type: "finish-to-start" },
  // Phase 3 → Completion
  { from: "WP-008", to: "WP-016", type: "finish-to-start" },
  { from: "WP-012", to: "WP-016", type: "finish-to-start" },
  { from: "WP-011", to: "WP-016", type: "hold-point" },
  { from: "WP-016", to: "WP-018", type: "finish-to-start" },
  { from: "WP-015", to: "WP-018", type: "finish-to-start" },
];

const COL_LABELS = ["Preparation", "Phase 1 — Strip", "Phase 2 — Replace", "Phase 3 — Build Back", "Completion"];

/* ------------------------------------------------------------------ */
/*  STYLING                                                            */
/* ------------------------------------------------------------------ */

const STATUS_NODE: Record<WPStatus, string> = {
  Ready: "border-blue-500/60 bg-blue-500/5",
  Active: "border-emerald-500/60 bg-emerald-500/5",
  Blocked: "border-destructive/60 bg-destructive/5",
  Delayed: "border-amber-500/60 bg-amber-500/5",
  Complete: "border-muted-foreground/30 bg-muted/50",
};

const STATUS_DOT: Record<WPStatus, string> = {
  Ready: "bg-blue-500",
  Active: "bg-emerald-500",
  Blocked: "bg-destructive",
  Delayed: "bg-amber-500",
  Complete: "bg-muted-foreground/50",
};

const DEP_STYLE: Record<DepType, { color: string; dash: string; label: string }> = {
  "finish-to-start": { color: "stroke-muted-foreground/40", dash: "", label: "Finish → Start" },
  "start-to-start": { color: "stroke-blue-500/50", dash: "4 2", label: "Start → Start" },
  parallel: { color: "stroke-emerald-500/40", dash: "2 2", label: "Parallel" },
  "hold-point": { color: "stroke-destructive/50", dash: "6 2", label: "Hold Point" },
};

const ALL_AREAS = ["All", ...Array.from(new Set(NODES.map((n) => n.area)))];
const ALL_TRADES = ["All", "Mechanical", "Electrical"];
const ALL_STATUSES: WPStatus[] = ["Ready", "Active", "Blocked", "Delayed", "Complete"];

/* ------------------------------------------------------------------ */
/*  NODE DIMENSIONS                                                    */
/* ------------------------------------------------------------------ */

const NODE_W = 220;
const NODE_H = 92;
const COL_GAP = 60;
const ROW_GAP = 18;
const COL_W = NODE_W + COL_GAP;
const HEADER_H = 32;
const PAD_X = 24;
const PAD_Y = 16;

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownSequenceFlowTab() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState("All");
  const [filterTrade, setFilterTrade] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [showDelayedOnly, setShowDelayedOnly] = useState(false);
  const [groupBy, setGroupBy] = useState<"stage" | "area" | "day">("stage");

  const selected = NODES.find((n) => n.id === selectedId) ?? null;

  // Find all nodes downstream of delayed nodes
  const delayedImpact = useMemo(() => {
    const delayedIds = new Set(NODES.filter((n) => n.status === "Delayed" || n.status === "Blocked").map((n) => n.id));
    const affected = new Set<string>();
    const visit = (id: string) => {
      EDGES.filter((e) => e.from === id).forEach((e) => {
        if (!affected.has(e.to) && !delayedIds.has(e.to)) {
          affected.add(e.to);
          visit(e.to);
        }
      });
    };
    delayedIds.forEach((id) => visit(id));
    return affected;
  }, []);

  // Filter nodes
  const visibleNodes = useMemo(() => {
    return NODES.filter((n) => {
      if (filterArea !== "All" && n.area !== filterArea) return false;
      if (filterTrade !== "All" && n.trade !== filterTrade) return false;
      if (filterStatus !== "All" && n.status !== filterStatus) return false;
      if (showCriticalOnly && !n.criticalPath) return false;
      if (showDelayedOnly && n.status !== "Delayed" && n.status !== "Blocked" && !delayedImpact.has(n.id)) return false;
      return true;
    });
  }, [filterArea, filterTrade, filterStatus, showCriticalOnly, showDelayedOnly, delayedImpact]);

  const visibleIds = new Set(visibleNodes.map((n) => n.id));

  // Predecessors & successors for selected node
  const predecessors = useMemo(
    () => (selectedId ? EDGES.filter((e) => e.to === selectedId).map((e) => ({ ...e, node: NODES.find((n) => n.id === e.from)! })) : []),
    [selectedId]
  );
  const successors = useMemo(
    () => (selectedId ? EDGES.filter((e) => e.from === selectedId).map((e) => ({ ...e, node: NODES.find((n) => n.id === e.to)! })) : []),
    [selectedId]
  );

  // Calculate node positions
  const getNodePos = useCallback((node: FlowNode) => {
    const x = PAD_X + node.col * COL_W;
    const y = PAD_Y + HEADER_H + node.row * (NODE_H + ROW_GAP);
    return { x, y };
  }, []);

  const maxCol = Math.max(...NODES.map((n) => n.col));
  const maxRow = Math.max(...NODES.map((n) => n.row));
  const svgW = PAD_X * 2 + (maxCol + 1) * COL_W;
  const svgH = PAD_Y * 2 + HEADER_H + (maxRow + 1) * (NODE_H + ROW_GAP);

  return (
    <div className="space-y-4">
      {/* ===== FILTERS ===== */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-muted-foreground" />
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ALL_AREAS.map((a) => <SelectItem key={a} value={a}>{a === "All" ? "All Areas" : a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTrade} onValueChange={setFilterTrade}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {ALL_TRADES.map((t) => <SelectItem key={t} value={t}>{t === "All" ? "All Trades" : t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant={showCriticalOnly ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1" onClick={() => setShowCriticalOnly(!showCriticalOnly)}>
          <Route className="w-3 h-3" /> Critical Path
        </Button>
        <Button variant={showDelayedOnly ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1" onClick={() => setShowDelayedOnly(!showDelayedOnly)}>
          <AlertTriangle className="w-3 h-3" /> Delay Impact
        </Button>

        {/* Legend */}
        <div className="ml-auto flex items-center gap-3 text-[10px] text-muted-foreground">
          {Object.entries(DEP_STYLE).map(([key, val]) => (
            <span key={key} className="flex items-center gap-1">
              <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" className={val.color} strokeWidth="2" strokeDasharray={val.dash} /></svg>
              {val.label}
            </span>
          ))}
        </div>
      </div>

      {/* ===== MAIN: FLOW + PANEL ===== */}
      <div className="flex gap-4">
        {/* Flow canvas */}
        <div className={cn("flex-1 min-w-0 border border-border rounded-lg bg-card overflow-x-auto")}>
          <svg width={svgW} height={svgH} className="block">
            {/* Column headers */}
            {COL_LABELS.map((label, i) => (
              <g key={i}>
                <rect x={PAD_X + i * COL_W - 4} y={PAD_Y} width={NODE_W + 8} height={HEADER_H - 4} rx="4" className="fill-muted/60" />
                <text x={PAD_X + i * COL_W + NODE_W / 2} y={PAD_Y + 18} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">{label}</text>
              </g>
            ))}

            {/* Column separators */}
            {Array.from({ length: maxCol }, (_, i) => (
              <line
                key={i}
                x1={PAD_X + (i + 1) * COL_W - COL_GAP / 2}
                y1={PAD_Y + HEADER_H}
                x2={PAD_X + (i + 1) * COL_W - COL_GAP / 2}
                y2={svgH - PAD_Y}
                className="stroke-border"
                strokeWidth="0.5"
                strokeDasharray="4 4"
              />
            ))}

            {/* Edges */}
            {EDGES.map((edge, i) => {
              const fromNode = NODES.find((n) => n.id === edge.from);
              const toNode = NODES.find((n) => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const fromVis = visibleIds.has(edge.from);
              const toVis = visibleIds.has(edge.to);
              if (!fromVis && !toVis) return null;

              const fp = getNodePos(fromNode);
              const tp = getNodePos(toNode);

              const x1 = fp.x + NODE_W;
              const y1 = fp.y + NODE_H / 2;
              const x2 = tp.x;
              const y2 = tp.y + NODE_H / 2;

              const style = DEP_STYLE[edge.type];
              const isOnCritical = fromNode.criticalPath && toNode.criticalPath;
              const isDelayLine = (fromNode.status === "Delayed" || fromNode.status === "Blocked") && delayedImpact.has(toNode.id);

              // Bezier control points
              const dx = (x2 - x1) * 0.4;

              return (
                <g key={i}>
                  <path
                    d={`M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`}
                    fill="none"
                    className={cn(
                      style.color,
                      isDelayLine && "stroke-destructive/70",
                      isOnCritical && showCriticalOnly && "stroke-destructive/60"
                    )}
                    strokeWidth={isOnCritical ? 2 : 1.5}
                    strokeDasharray={style.dash}
                    opacity={(!fromVis || !toVis) ? 0.15 : 1}
                  />
                  {/* Arrow head */}
                  <circle cx={x2} cy={y2} r="3" className={cn("fill-muted-foreground/30", isDelayLine && "fill-destructive/50")} />
                  {/* Hold point indicator */}
                  {edge.type === "hold-point" && (
                    <g>
                      <rect x={(x1 + x2) / 2 - 14} y={(y1 + y2) / 2 - 7} width="28" height="14" rx="3" className="fill-destructive/15 stroke-destructive/40" strokeWidth="0.5" />
                      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 + 3} textAnchor="middle" className="fill-destructive text-[7px] font-bold">HOLD</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const pos = getNodePos(node);
              const visible = visibleIds.has(node.id);
              const isSelected = selectedId === node.id;
              const isImpacted = delayedImpact.has(node.id);

              return (
                <g
                  key={node.id}
                  className={cn("cursor-pointer transition-opacity", !visible && "opacity-15")}
                  onClick={() => visible && setSelectedId(isSelected ? null : node.id)}
                >
                  {/* Delay impact glow */}
                  {isImpacted && showDelayedOnly && (
                    <rect x={pos.x - 3} y={pos.y - 3} width={NODE_W + 6} height={NODE_H + 6} rx="8" className="fill-amber-500/10 stroke-amber-500/30" strokeWidth="1" strokeDasharray="4 2" />
                  )}

                  {/* Card background */}
                  <rect
                    x={pos.x} y={pos.y} width={NODE_W} height={NODE_H} rx="6"
                    className={cn(
                      "stroke-[1.5] fill-card transition-all",
                      STATUS_NODE[node.status],
                      isSelected && "stroke-[2.5] stroke-foreground",
                      node.criticalPath && "stroke-[2]"
                    )}
                  />

                  {/* Critical path indicator */}
                  {node.criticalPath && (
                    <rect x={pos.x} y={pos.y} width="4" height={NODE_H} rx="2" className="fill-destructive/60" />
                  )}

                  {/* Status dot */}
                  <circle cx={pos.x + 14} cy={pos.y + 14} r="4" className={STATUS_DOT[node.status]} />

                  {/* WP ID */}
                  <text x={pos.x + 24} y={pos.y + 17} className="fill-foreground text-[10px] font-mono font-bold">{node.id}</text>

                  {/* Title (truncated) */}
                  <text x={pos.x + 10} y={pos.y + 34} className="fill-foreground text-[10px] font-medium">
                    {node.title.length > 28 ? node.title.substring(0, 28) + "…" : node.title}
                  </text>

                  {/* Area + Trade */}
                  <text x={pos.x + 10} y={pos.y + 48} className="fill-muted-foreground text-[8px]">
                    {node.area} • {node.trade} • {node.duration}
                  </text>

                  {/* Progress bar */}
                  <rect x={pos.x + 10} y={pos.y + 56} width={NODE_W - 20} height="4" rx="2" className="fill-muted/60" />
                  <rect x={pos.x + 10} y={pos.y + 56} width={(NODE_W - 20) * (node.pctComplete / 100)} height="4" rx="2" className={cn(
                    node.status === "Complete" ? "fill-muted-foreground/40" :
                    node.status === "Delayed" ? "fill-amber-500/60" :
                    node.status === "Blocked" ? "fill-destructive/60" :
                    "fill-emerald-500/60"
                  )} />

                  {/* Status + pct label */}
                  <text x={pos.x + 10} y={pos.y + 72} className="fill-muted-foreground text-[8px]">{node.status}</text>
                  <text x={pos.x + NODE_W - 10} y={pos.y + 72} textAnchor="end" className="fill-foreground text-[8px] font-semibold">{node.pctComplete}%</text>

                  {/* Badges */}
                  {node.criticalPath && (
                    <g>
                      <rect x={pos.x + NODE_W - 30} y={pos.y + 6} width="22" height="12" rx="3" className="fill-destructive/15 stroke-destructive/30" strokeWidth="0.5" />
                      <text x={pos.x + NODE_W - 19} y={pos.y + 14.5} textAnchor="middle" className="fill-destructive text-[7px] font-bold">CP</text>
                    </g>
                  )}

                  {/* Delay warning */}
                  {node.delayReason && (
                    <g>
                      <rect x={pos.x + 10} y={pos.y + NODE_H - 16} width={NODE_W - 20} height="12" rx="3" className="fill-amber-500/10" />
                      <text x={pos.x + 16} y={pos.y + NODE_H - 7.5} className="fill-amber-600 text-[7px]">
                        ⚠ {node.delayReason.length > 32 ? node.delayReason.substring(0, 32) + "…" : node.delayReason}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* ===== DETAIL PANEL ===== */}
        {selected && (
          <div className="w-96 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
            <div className={cn("px-4 py-3 border-b border-border flex items-center justify-between",
              selected.status === "Active" ? "bg-emerald-500/5" :
              selected.status === "Blocked" ? "bg-destructive/5" :
              selected.status === "Delayed" ? "bg-amber-500/5" :
              "bg-muted/30"
            )}>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground">{selected.id}</span>
                  {selected.criticalPath && <Badge variant="outline" className="text-[8px] h-3.5 border-destructive text-destructive">Critical Path</Badge>}
                  <Badge variant="outline" className="text-[9px] h-4">{selected.status}</Badge>
                </div>
                <h3 className="text-sm font-semibold text-foreground mt-1">{selected.title}</h3>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4 max-h-[560px] overflow-y-auto">
              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">{selected.description}</p>

              {/* Key info grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Area", value: selected.area },
                  { label: "Trade", value: selected.trade },
                  { label: "Duration", value: selected.duration },
                  { label: "% Complete", value: `${selected.pctComplete}%` },
                  { label: "Planned Start", value: selected.plannedStart },
                  { label: "Planned Finish", value: selected.plannedFinish },
                  { label: "Supervisor", value: selected.supervisor },
                  { label: "Status", value: selected.status },
                ].map((item) => (
                  <div key={item.label} className="rounded-md border border-border px-2.5 py-1.5">
                    <div className="text-[10px] text-muted-foreground">{item.label}</div>
                    <div className="font-medium text-foreground">{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {selected.constraints && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 mb-0.5">
                    <Lock className="w-3 h-3" /> Constraint
                  </div>
                  <p className="text-xs text-amber-600">{selected.constraints}</p>
                </div>
              )}

              {/* Delay reason */}
              {selected.delayReason && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-destructive mb-0.5">
                    <AlertTriangle className="w-3 h-3" /> Delay Reason
                  </div>
                  <p className="text-xs text-destructive">{selected.delayReason}</p>
                </div>
              )}

              {/* Predecessors */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                  <ArrowRight className="w-3 h-3 rotate-180" /> Predecessors ({predecessors.length})
                </div>
                {predecessors.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground">No predecessors — this package can start independently</p>
                ) : (
                  <div className="space-y-1">
                    {predecessors.map((p) => (
                      <button
                        key={p.from}
                        className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border hover:bg-muted/30 transition-colors"
                        onClick={() => setSelectedId(p.from)}
                      >
                        <span className={cn("w-2 h-2 rounded-full", STATUS_DOT[p.node.status])} />
                        <span className="text-[10px] font-mono font-semibold">{p.node.id}</span>
                        <span className="text-[10px] text-muted-foreground truncate flex-1">{p.node.title}</span>
                        <Badge variant="outline" className="text-[8px] h-3.5">{DEP_STYLE[p.type].label}</Badge>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Successors */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                  <ArrowRight className="w-3 h-3" /> Successors ({successors.length})
                </div>
                {successors.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground">No successors — this is an endpoint</p>
                ) : (
                  <div className="space-y-1">
                    {successors.map((s) => (
                      <button
                        key={s.to}
                        className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border hover:bg-muted/30 transition-colors"
                        onClick={() => setSelectedId(s.to)}
                      >
                        <span className={cn("w-2 h-2 rounded-full", STATUS_DOT[s.node.status])} />
                        <span className="text-[10px] font-mono font-semibold">{s.node.id}</span>
                        <span className="text-[10px] text-muted-foreground truncate flex-1">{s.node.title}</span>
                        <Badge variant="outline" className="text-[8px] h-3.5">{DEP_STYLE[s.type].label}</Badge>
                        {delayedImpact.has(s.to) && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
