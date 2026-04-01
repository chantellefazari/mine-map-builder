/**
 * Shared shutdown orchestrator data — aligned to TCMG Processing Plant asset tree areas.
 *
 * Area codes & labels match the live asset hierarchy:
 *   SITE — Site Infrastructure
 *   UTL  — Utilities & Power
 *   COM  — Comminution / Process
 *   REC  — Gold Recovery
 *   TAIL — Tailings
 *   SUP  — Support Services
 */

/* ------------------------------------------------------------------ */
/*  AREA DEFINITIONS                                                   */
/* ------------------------------------------------------------------ */

export interface ShutdownArea {
  code: string;
  label: string;
}

export const SHUTDOWN_AREAS: ShutdownArea[] = [
  { code: "SITE", label: "Site Infrastructure" },
  { code: "UTL",  label: "Utilities & Power" },
  { code: "COM",  label: "Comminution / Process" },
  { code: "REC",  label: "Gold Recovery" },
  { code: "TAIL", label: "Tailings" },
  { code: "SUP",  label: "Support Services" },
];

export const AREA_LABELS = SHUTDOWN_AREAS.map(a => a.label);

export const ALL_AREA_OPTIONS = ["All", ...AREA_LABELS];
export const ALL_TRADES = ["All", "Mechanical", "Electrical", "Instrumentation"];
export const ALL_SHIFTS = ["All", "Day", "Night"];

/* ------------------------------------------------------------------ */
/*  STATUS                                                             */
/* ------------------------------------------------------------------ */

export type WPStatus = "Not Started" | "Ready" | "Active" | "Blocked" | "Delayed" | "Complete";
export const STATUS_ORDER: WPStatus[] = ["Blocked", "Delayed", "Active", "Ready", "Not Started", "Complete"];

/* ------------------------------------------------------------------ */
/*  WORK PACKAGES — realistic gold processing plant shutdown tasks     */
/* ------------------------------------------------------------------ */

export interface ShutdownWorkPackage {
  id: string;
  title: string;
  area: string;        // Must match one of AREA_LABELS
  trade: string;
  plannedStart: string;
  plannedFinish: string;
  durationHrs: number;
  status: WPStatus;
  pctComplete: number;
  criticalPath: boolean;
  supervisor: string;
  shift: string;
  nextAction: string;
  blockerType: string;
  blockerDescription: string;
  blockerOwner: string;
  blockerETA: string;
  delayReason: string;
  predecessors: string[];
  successors: string[];
  handoverNotes: string;
  priority: boolean;
  /** Sequence flow layout */
  col: number;
  row: number;
  /** Critical-path specific */
  delayHrs: number;
  nearCritical: boolean;
  floatHrs: number;
}

export const PACKAGES: ShutdownWorkPackage[] = [
  // ── Col 0 — Preparation ──
  {
    id: "WP-001", title: "Plant Isolation & Lockout",
    area: "Site Infrastructure", trade: "Electrical",
    plannedStart: "Day 1 06:00", plannedFinish: "Day 1 10:00", durationHrs: 4,
    status: "Complete", pctComplete: 100, criticalPath: true,
    supervisor: "L. Chen", shift: "Day",
    nextAction: "—",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: [], successors: ["WP-002", "WP-003", "WP-004", "WP-005", "WP-006", "WP-007"],
    handoverNotes: "All isolations verified and tagged",
    priority: false, col: 0, row: 0, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-002", title: "Scaffold Erection — Mill Area",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 1 06:00", plannedFinish: "Day 1 12:00", durationHrs: 6,
    status: "Complete", pctComplete: 100, criticalPath: true,
    supervisor: "J. Mitchell", shift: "Day",
    nextAction: "—",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-001"], successors: ["WP-004", "WP-009"],
    handoverNotes: "Full scaffold complete, tag checked",
    priority: false, col: 0, row: 1, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-003", title: "Crane Mobilisation",
    area: "Site Infrastructure", trade: "Mechanical",
    plannedStart: "Day 1 06:00", plannedFinish: "Day 1 09:00", durationHrs: 3,
    status: "Complete", pctComplete: 100, criticalPath: false,
    supervisor: "B. Williams", shift: "Day",
    nextAction: "—",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-001"], successors: ["WP-012"],
    handoverNotes: "50t crane positioned at Comminution bay",
    priority: false, col: 0, row: 2, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },

  // ── Col 1 — Phase 1: Strip ──
  {
    id: "WP-004", title: "SAG Mill Liner Bolt-Out",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 1 12:00", plannedFinish: "Day 2 00:00", durationHrs: 12,
    status: "Active", pctComplete: 45, criticalPath: true,
    supervisor: "J. Mitchell", shift: "Day",
    nextAction: "Continue bolt removal — 55% remaining",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-001", "WP-002"], successors: ["WP-008"],
    handoverNotes: "Night shift to continue from Row 6",
    priority: true, col: 1, row: 0, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-005", title: "Jaw Crusher Liner Replacement",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 1 10:00", plannedFinish: "Day 1 18:00", durationHrs: 8,
    status: "Active", pctComplete: 60, criticalPath: false,
    supervisor: "M. Thompson", shift: "Day",
    nextAction: "Swing jaw install underway",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-001"], successors: [],
    handoverNotes: "Swing jaw fitted, fixed jaw next",
    priority: false, col: 1, row: 1, delayHrs: 0, nearCritical: false, floatHrs: 4,
  },
  {
    id: "WP-006", title: "CIP Tank Agitator Gearbox Inspection",
    area: "Gold Recovery", trade: "Mechanical",
    plannedStart: "Day 1 10:00", plannedFinish: "Day 1 16:00", durationHrs: 6,
    status: "Active", pctComplete: 70, criticalPath: false,
    supervisor: "K. Singh", shift: "Day",
    nextAction: "Tanks 5-6 inspection remaining",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-001"], successors: ["WP-013"],
    handoverNotes: "Tanks 1-4 complete, oil samples sent",
    priority: false, col: 1, row: 2, delayHrs: 0, nearCritical: true, floatHrs: 3,
  },
  {
    id: "WP-007", title: "MCC Switchboard Service",
    area: "Utilities & Power", trade: "Electrical",
    plannedStart: "Day 1 10:00", plannedFinish: "Day 1 16:00", durationHrs: 6,
    status: "Blocked", pctComplete: 20, criticalPath: false,
    supervisor: "L. Chen", shift: "Day",
    nextAction: "Awaiting isolation clearance",
    blockerType: "Isolation", blockerDescription: "MCC isolation not verified — awaiting Control Room sign-off", blockerOwner: "Control Room — D. Kumar", blockerETA: "Est. 2 hrs",
    delayReason: "",
    predecessors: ["WP-001"], successors: [],
    handoverNotes: "",
    priority: true, col: 1, row: 3, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },

  // ── Col 2 — Phase 2: Replace ──
  {
    id: "WP-008", title: "SAG Mill Liner Install",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 2 00:00", plannedFinish: "Day 2 14:00", durationHrs: 14,
    status: "Ready", pctComplete: 0, criticalPath: true,
    supervisor: "J. Mitchell", shift: "Night",
    nextAction: "Pending WP-004 completion",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-004"], successors: ["WP-016"],
    handoverNotes: "",
    priority: true, col: 2, row: 0, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-009", title: "Ball Mill Trunnion Bearing Reline",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 1 12:00", plannedFinish: "Day 1 22:00", durationHrs: 10,
    status: "Active", pctComplete: 15, criticalPath: true,
    supervisor: "J. Mitchell", shift: "Day",
    nextAction: "Feed-end bearing removal in progress",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-002"], successors: ["WP-016"],
    handoverNotes: "Night crew to continue discharge end",
    priority: true, col: 2, row: 1, delayHrs: 0, nearCritical: false, floatHrs: 2,
  },
  {
    id: "WP-010", title: "Thickener Rake Arm Inspection",
    area: "Tailings", trade: "Mechanical",
    plannedStart: "Day 1 10:00", plannedFinish: "Day 1 18:00", durationHrs: 8,
    status: "Active", pctComplete: 40, criticalPath: true,
    supervisor: "A. Reyes", shift: "Day",
    nextAction: "Torque tube measurement underway",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-001"], successors: ["WP-016"],
    handoverNotes: "",
    priority: true, col: 2, row: 2, delayHrs: 0, nearCritical: false, floatHrs: 4,
  },
  {
    id: "WP-011", title: "VSD Replacement — Mill Drive",
    area: "Comminution / Process", trade: "Electrical",
    plannedStart: "Day 1 14:00", plannedFinish: "Day 1 22:00", durationHrs: 8,
    status: "Delayed", pctComplete: 10, criticalPath: true,
    supervisor: "L. Chen", shift: "Day",
    nextAction: "Expedite parts delivery",
    blockerType: "Parts", blockerDescription: "Replacement VSD not received on site — freight delayed in transit", blockerOwner: "Procurement — S. Patel", blockerETA: "Est. arrival Day 2 PM",
    delayReason: "Replacement VSD not received on site",
    predecessors: ["WP-004"], successors: ["WP-016", "WP-018"],
    handoverNotes: "",
    priority: true, col: 2, row: 3, delayHrs: 12, nearCritical: false, floatHrs: 0,
  },

  // ── Col 3 — Phase 3: Build Back ──
  {
    id: "WP-012", title: "Cyclone Cluster Replacement",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 2 14:00", plannedFinish: "Day 2 20:00", durationHrs: 6,
    status: "Blocked", pctComplete: 0, criticalPath: true,
    supervisor: "J. Mitchell", shift: "Night",
    nextAction: "Cannot proceed until crane available",
    blockerType: "Crane", blockerDescription: "50t mobile crane delayed — ETA from contractor pending", blockerOwner: "B. Williams — Crane Contractor", blockerETA: "Est. 4 hrs",
    delayReason: "",
    predecessors: ["WP-003", "WP-008"], successors: ["WP-016"],
    handoverNotes: "",
    priority: true, col: 3, row: 0, delayHrs: 4, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-013", title: "Carbon Screen Panel Replacement",
    area: "Gold Recovery", trade: "Mechanical",
    plannedStart: "Day 2 06:00", plannedFinish: "Day 2 11:00", durationHrs: 5,
    status: "Active", pctComplete: 70, criticalPath: false,
    supervisor: "K. Singh", shift: "Day",
    nextAction: "Final panels being fitted",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-006"], successors: ["WP-018"],
    handoverNotes: "",
    priority: false, col: 3, row: 1, delayHrs: 0, nearCritical: true, floatHrs: 3,
  },
  {
    id: "WP-014", title: "Underflow Pump Impeller Swap",
    area: "Tailings", trade: "Mechanical",
    plannedStart: "Day 2 06:00", plannedFinish: "Day 2 12:00", durationHrs: 6,
    status: "Blocked", pctComplete: 0, criticalPath: true,
    supervisor: "R. Torres", shift: "Day",
    nextAction: "Scaffold erection required first",
    blockerType: "Scaffold", blockerDescription: "Scaffold not erected — crew diverted to Comminution priority", blockerOwner: "Scaffold Crew — T. Brown", blockerETA: "Est. 6 hrs",
    delayReason: "",
    predecessors: ["WP-010"], successors: ["WP-015"],
    handoverNotes: "",
    priority: true, col: 3, row: 2, delayHrs: 6, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-015", title: "Tailings Pipeline Tie-In",
    area: "Tailings", trade: "Mechanical",
    plannedStart: "Day 2 12:00", plannedFinish: "Day 2 20:00", durationHrs: 8,
    status: "Delayed", pctComplete: 5, criticalPath: true,
    supervisor: "R. Torres", shift: "Night",
    nextAction: "Chase environmental clearance",
    blockerType: "Permit", blockerDescription: "Environmental clearance pending — Enviro team not yet signed off on discharge zone", blockerOwner: "Environmental — C. Davis", blockerETA: "Unknown",
    delayReason: "Environmental clearance pending",
    predecessors: ["WP-014"], successors: ["WP-018"],
    handoverNotes: "",
    priority: true, col: 3, row: 3, delayHrs: 8, nearCritical: false, floatHrs: 0,
  },

  // ── Col 4 — Completion ──
  {
    id: "WP-016", title: "Mill Alignment & Checks",
    area: "Comminution / Process", trade: "Mechanical",
    plannedStart: "Day 2 20:00", plannedFinish: "Day 3 00:00", durationHrs: 4,
    status: "Ready", pctComplete: 0, criticalPath: true,
    supervisor: "J. Mitchell", shift: "Night",
    nextAction: "Awaiting Phase 2 & 3 completion",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-008", "WP-009", "WP-010", "WP-011", "WP-012"], successors: ["WP-018"],
    handoverNotes: "",
    priority: false, col: 4, row: 0, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },
  {
    id: "WP-017", title: "Elution Column Heater Service",
    area: "Gold Recovery", trade: "Electrical",
    plannedStart: "Day 2 06:00", plannedFinish: "Day 2 12:00", durationHrs: 6,
    status: "Active", pctComplete: 80, criticalPath: false,
    supervisor: "P. Adams", shift: "Day",
    nextAction: "Thermocouple replacement in progress",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: [], successors: ["WP-018"],
    handoverNotes: "",
    priority: false, col: 4, row: 1, delayHrs: 0, nearCritical: true, floatHrs: 2,
  },
  {
    id: "WP-018", title: "Pre-Start Commissioning",
    area: "Site Infrastructure", trade: "Electrical",
    plannedStart: "Day 3 00:00", plannedFinish: "Day 3 06:00", durationHrs: 6,
    status: "Ready", pctComplete: 0, criticalPath: true,
    supervisor: "L. Chen", shift: "Night",
    nextAction: "Final gate — all CP packages must complete",
    blockerType: "", blockerDescription: "", blockerOwner: "", blockerETA: "",
    delayReason: "",
    predecessors: ["WP-011", "WP-013", "WP-015", "WP-016", "WP-017"], successors: [],
    handoverNotes: "",
    priority: false, col: 4, row: 2, delayHrs: 0, nearCritical: false, floatHrs: 0,
  },
];

/* ------------------------------------------------------------------ */
/*  EDGES (dependency graph)                                           */
/* ------------------------------------------------------------------ */

export type DepType = "finish-to-start" | "start-to-start" | "parallel" | "hold-point";

export interface FlowEdge {
  from: string;
  to: string;
  type: DepType;
}

export const EDGES: FlowEdge[] = [
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

export const COL_LABELS = ["Preparation", "Phase 1 — Strip", "Phase 2 — Replace", "Phase 3 — Build Back", "Completion"];

/* ------------------------------------------------------------------ */
/*  AREA OVERVIEW SUMMARIES (derived from packages)                    */
/* ------------------------------------------------------------------ */

export interface AreaSummary {
  area: string;
  total: number;
  active: number;
  blocked: number;
  delayed: number;
  complete: number;
  pctComplete: number;
  status: "Ready" | "Active" | "At Risk" | "Delayed" | "Complete";
}

export function buildAreaSummaries(pkgs: ShutdownWorkPackage[] = PACKAGES): AreaSummary[] {
  const map = new Map<string, ShutdownWorkPackage[]>();
  for (const p of pkgs) {
    if (!map.has(p.area)) map.set(p.area, []);
    map.get(p.area)!.push(p);
  }

  return AREA_LABELS.map((area) => {
    const list = map.get(area) || [];
    const total = list.length;
    if (total === 0) return { area, total: 0, active: 0, blocked: 0, delayed: 0, complete: 0, pctComplete: 0, status: "Ready" as const };

    const active = list.filter(p => p.status === "Active").length;
    const blocked = list.filter(p => p.status === "Blocked").length;
    const delayed = list.filter(p => p.status === "Delayed").length;
    const complete = list.filter(p => p.status === "Complete").length;
    const pctComplete = Math.round(list.reduce((s, p) => s + p.pctComplete, 0) / total);

    let status: AreaSummary["status"] = "Ready";
    if (complete === total) status = "Complete";
    else if (delayed > 0 || (blocked > 0 && active === 0)) status = "Delayed";
    else if (blocked > 0) status = "At Risk";
    else if (active > 0) status = "Active";

    return { area, total, active, blocked, delayed, complete, pctComplete, status };
  }).filter(a => a.total > 0);
}

/* ------------------------------------------------------------------ */
/*  AREA MAP ZONES                                                     */
/* ------------------------------------------------------------------ */

export interface AreaZone {
  id: string;
  name: string;
  status: "Not Started" | "Ready" | "Active" | "At Risk" | "Delayed" | "Complete";
  pctComplete: number;
  total: number;
  active: number;
  blocked: number;
  delayed: number;
  complete: number;
  criticalPath: number;
  isolationStatus: string;
  accessConstraints: string;
  supervisor: string;
  x: number; y: number; w: number; h: number;
}

export function buildAreaZones(pkgs: ShutdownWorkPackage[] = PACKAGES): AreaZone[] {
  const summaries = buildAreaSummaries(pkgs);
  // Zone layout positions for each area
  const ZONE_LAYOUT: Record<string, { x: number; y: number; w: number; h: number; supervisor: string; isolationStatus: string; accessConstraints: string }> = {
    "Site Infrastructure":    { x: 2,  y: 4,  w: 22, h: 28, supervisor: "L. Chen",     isolationStatus: "All Clear",     accessConstraints: "None" },
    "Utilities & Power":      { x: 26, y: 4,  w: 24, h: 28, supervisor: "D. Kumar",     isolationStatus: "Pending",       accessConstraints: "HV exclusion zone" },
    "Comminution / Process":  { x: 52, y: 4,  w: 24, h: 28, supervisor: "J. Mitchell",  isolationStatus: "3 Active",      accessConstraints: "Crane exclusion zone — Level 2" },
    "Gold Recovery":          { x: 78, y: 4,  w: 20, h: 28, supervisor: "K. Singh",     isolationStatus: "Restricted Entry", accessConstraints: "Security escort required" },
    "Tailings":               { x: 2,  y: 36, w: 30, h: 28, supervisor: "R. Torres",    isolationStatus: "2 Pending",     accessConstraints: "Scaffold incomplete — Bay 3" },
    "Support Services":       { x: 34, y: 36, w: 20, h: 28, supervisor: "N. Foster",    isolationStatus: "N/A",           accessConstraints: "None" },
  };

  return summaries.map((s) => {
    const layout = ZONE_LAYOUT[s.area] || { x: 0, y: 70, w: 20, h: 26, supervisor: "—", isolationStatus: "N/A", accessConstraints: "None" };
    const cp = pkgs.filter(p => p.area === s.area && p.criticalPath).length;
    return {
      id: s.area.toLowerCase().replace(/[\s\/]/g, "-"),
      name: s.area,
      status: s.status === "At Risk" ? "At Risk" : s.status,
      pctComplete: s.pctComplete,
      total: s.total,
      active: s.active,
      blocked: s.blocked,
      delayed: s.delayed,
      complete: s.complete,
      criticalPath: cp,
      isolationStatus: layout.isolationStatus,
      accessConstraints: layout.accessConstraints,
      supervisor: layout.supervisor,
      x: layout.x, y: layout.y, w: layout.w, h: layout.h,
    };
  });
}

/* ------------------------------------------------------------------ */
/*  AI PLANNER CONTEXT STRING                                          */
/* ------------------------------------------------------------------ */

export const WP_CONTEXT = PACKAGES.map(p =>
  `${p.id}: ${p.title} (${p.area}, ${p.trade})`
).join("\n");

/* ------------------------------------------------------------------ */
/*  DEMO RISKS                                                         */
/* ------------------------------------------------------------------ */

export interface RiskItem {
  risk: string;
  area: string;
  workPackage: string;
  severity: "Critical" | "High" | "Medium";
  owner: string;
}

export const DEMO_RISKS: RiskItem[] = [
  { risk: "Crane unavailable — 50t mobile crane delayed by 4 hrs", area: "Comminution / Process", workPackage: "WP-012", severity: "Critical", owner: "J. Mitchell" },
  { risk: "Scaffold not erected — Level 3 access pending", area: "Tailings", workPackage: "WP-014", severity: "High", owner: "R. Torres" },
  { risk: "Isolation tag clearance delayed by Control Room", area: "Utilities & Power", workPackage: "WP-007", severity: "High", owner: "D. Kumar" },
  { risk: "Replacement VSD not yet received on site", area: "Comminution / Process", workPackage: "WP-011", severity: "Medium", owner: "S. Patel" },
  { risk: "Confined space permit pending gas test re-check", area: "Tailings", workPackage: "WP-015", severity: "High", owner: "M. Chen" },
];

/* ------------------------------------------------------------------ */
/*  SHIFT FOCUS                                                        */
/* ------------------------------------------------------------------ */

export interface ShiftFocusItem {
  label: string;
  type: "start" | "finish" | "decision" | "handover";
  area: string;
}

export const DEMO_SHIFT_FOCUS: ShiftFocusItem[] = [
  { label: "SAG Mill liner bolt-out — Day Shift start", type: "start", area: "Comminution / Process" },
  { label: "Thickener rake arm inspection — target completion", type: "finish", area: "Tailings" },
  { label: "Approve crane lift plan for ball mill trunnion", type: "decision", area: "Comminution / Process" },
  { label: "Elution column handover from Electrical to Mech", type: "handover", area: "Gold Recovery" },
  { label: "CIP Tank 4 agitator gearbox swap — planned start", type: "start", area: "Gold Recovery" },
  { label: "Tailings pipeline tie-in clearance from Enviro", type: "decision", area: "Tailings" },
];

/* ------------------------------------------------------------------ */
/*  SHUTDOWN METADATA                                                  */
/* ------------------------------------------------------------------ */

export const SHUTDOWN_NAME = "Annual Shutdown — Y26-SH01";
export const SHUTDOWN_DATE = "1 Apr – 3 Apr 2026";

/* ------------------------------------------------------------------ */
/*  LEARNED RULES                                                      */
/* ------------------------------------------------------------------ */

export interface LearnedRule {
  id: string;
  title: string;
  area: string;
  description: string;
  rule_type: string;
  source: string;
  active: boolean;
  created_at: string;
}

export const INITIAL_RULES: LearnedRule[] = [
  { id: "LR-001", title: "Isolation before mechanical entry", area: "All", description: "All mechanical work areas require confirmed electrical isolation and LOTO before personnel entry.", rule_type: "Isolation Rule", source: "Site Standard", active: true, created_at: "2026-01-15" },
  { id: "LR-002", title: "Scaffold before elevated access", area: "Comminution / Process", description: "Scaffold erection must be complete and tagged before any elevated mechanical access in the mill area.", rule_type: "Access Constraint", source: "Supervisor — J. Mitchell", active: true, created_at: "2026-02-01" },
  { id: "LR-003", title: "Crane exclusion zone during lifts", area: "All", description: "No concurrent scaffold or personnel work within 15m of active crane lifts.", rule_type: "Clash Warning", source: "Safety — Y25 Lesson", active: true, created_at: "2025-11-20" },
  { id: "LR-004", title: "Parts confirmation 48hrs prior", area: "All", description: "All critical-path parts must be confirmed on-site 48 hours before scheduled start. Previous shutdowns lost 4-12 hours waiting for freight.", rule_type: "Lesson Learned", source: "Historical — Y25-SH02", active: true, created_at: "2025-12-01" },
  { id: "LR-005", title: "VSD commissioning requires vendor", area: "Comminution / Process", description: "VSD installation and commissioning requires vendor representative on-site for warranty compliance.", rule_type: "Shutdown Requirement", source: "Planner — L. Chen", active: true, created_at: "2026-03-10" },
];
