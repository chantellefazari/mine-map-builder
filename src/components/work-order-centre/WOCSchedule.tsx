import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import {
  Calendar, ChevronLeft, ChevronRight, Search, GripVertical,
  Wrench, Zap, Users, Printer, FileText, Building2, ClipboardList,
  Truck, ArrowUpDown, Clock, MapPin, X,
  Download, Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format, startOfWeek, endOfWeek, addWeeks, addDays, getISOWeek, getYear,
  isSameDay, parseISO,
} from "date-fns";
import { toast } from "sonner";
import { WOCScheduleReport } from "./WOCScheduleReport";
import { ShutdownScheduleView } from "./shutdown/ShutdownScheduleView";
import { VendorSchedulingView } from "./vendor-scheduling/VendorSchedulingView";
import { ShutdownOrchestratorView } from "./shutdown-orchestrator/ShutdownOrchestratorView";
import { AdvancedPlannerView } from "./advanced-planner/AdvancedPlannerView";
import { useCapacityGrid } from "@/hooks/useCapacityGrid";

const DISCIPLINES = [
  { key: "Mechanical", label: "Mechanical", icon: Wrench, color: "text-blue-600", target: 80 },
  { key: "Electrical", label: "Electrical", icon: Zap, color: "text-amber-600", target: 80 },
  { key: "Mobile & LVs", label: "Mobile & LVs", icon: Truck, color: "text-emerald-600", target: 85 },
];

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; sort: number }> = {
  "1": { label: "P1", color: "text-red-700", bg: "bg-red-50", border: "border-red-300", sort: 1 },
  "2": { label: "P2", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300", sort: 2 },
  "3": { label: "P3", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", sort: 3 },
  "4": { label: "P4", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200", sort: 4 },
};

function getPriorityConfig(p: string) {
  return PRIORITY_CONFIG[p] || { label: `P${p}`, color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border", sort: 5 };
}

function getWoHours(wo: WorkOrder): number {
  if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
    return wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
  }
  return 0;
}

type SortOption = "priority" | "hours-desc" | "hours-asc" | "wo-number";
type TypeFilter = "all" | "PM" | "CM";

function getWeekDays(weekStart: Date) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

function getWeekLabel(weekStart: Date) {
  const y = getYear(weekStart);
  const w = getISOWeek(weekStart);
  return `Y${String(y).slice(2)}-W${String(w).padStart(2, "0")}`;
}

export function WOCSchedule() {
  const { workOrders, update } = useWorkOrders();
  const { getCapacityForDate } = useCapacityGrid();
  const [discipline, setDiscipline] = useState("Mechanical");
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [dragWoId, setDragWoId] = useState<string | null>(null);
  const [scheduleView, setScheduleView] = useState<"calendar" | "report">("calendar");
  const [scheduleMode, setScheduleMode] = useState<"weekly" | "shutdown" | "vendors" | "orchestrator">("weekly");
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sidebarTab, setSidebarTab] = useState<"unscheduled" | "pms">("unscheduled");
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const weekEnd = endOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const days = getWeekDays(weekStart);

  const disciplineWOs = useMemo(() => {
    return workOrders.filter((wo) => {
      const trade = wo.trade?.toLowerCase() || "";
      if (discipline === "Mechanical") return trade === "mechanical" || trade === "";
      if (discipline === "Electrical") return trade === "electrical";
      if (discipline === "Mobile & LVs") return trade === "mobile" || trade === "mobile & lvs" || trade === "lvs";
      return true;
    });
  }, [workOrders, discipline]);

  const unscheduled = useMemo(() => {
    let list = disciplineWOs.filter((wo) => wo.status === "Scheduled" && !wo.scheduled_date);
    if (typeFilter === "PM") list = list.filter(wo => wo.work_type === "PM");
    else if (typeFilter === "CM") list = list.filter(wo => wo.work_type !== "PM");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((wo) =>
        wo.wo_number?.toLowerCase().includes(q) ||
        wo.problem_description?.toLowerCase().includes(q) ||
        wo.asset_id?.toLowerCase().includes(q) ||
        wo.functional_location?.toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortBy === "priority") return getPriorityConfig(a.priority).sort - getPriorityConfig(b.priority).sort;
      if (sortBy === "hours-desc") return getWoHours(b) - getWoHours(a);
      if (sortBy === "hours-asc") return getWoHours(a) - getWoHours(b);
      return (a.wo_number || "").localeCompare(b.wo_number || "");
    });
    return list;
  }, [disciplineWOs, search, typeFilter, sortBy]);

  const scheduledByDay = useMemo(() => {
    const map: Record<string, WorkOrder[]> = {};
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      map[key] = disciplineWOs.filter(
        (wo) => wo.scheduled_date && isSameDay(parseISO(wo.scheduled_date), day) && ["Scheduled", "Active", "In Progress"].includes(wo.status)
      );
    }
    return map;
  }, [disciplineWOs, days]);

  const getPersonnel = (dayKey: string, day: Date) => {
    const cap = getCapacityForDate(discipline, day);
    return cap.personnel;
  };
  const getHrsPerDay = (day: Date) => {
    const cap = getCapacityForDate(discipline, day);
    return cap.hoursPerDay;
  };
  const getTarget = (day: Date) => {
    const cap = getCapacityForDate(discipline, day);
    return cap.loadingTarget;
  };

  const handleDragStart = (woId: string) => setDragWoId(woId);
  const handleDrop = async (dayKey: string) => {
    if (!dragWoId) return;
    try {
      await update.mutateAsync({ id: dragWoId, updates: { scheduled_date: dayKey } as any });
      toast.success("Work order scheduled");
    } catch { /* handled */ }
    setDragWoId(null);
  };
  const handleUnschedule = async (woId: string) => {
    try {
      await update.mutateAsync({ id: woId, updates: { scheduled_date: null } as any });
      toast.success("Work order unscheduled");
    } catch { /* handled */ }
  };

  const totalPersonnel = days.reduce((s, d) => s + getPersonnel(format(d, "yyyy-MM-dd"), d), 0);
  const totalHoursAvail = days.reduce((s, d) => s + getPersonnel(format(d, "yyyy-MM-dd"), d) * getHrsPerDay(d), 0);
  const totalSchedHrs = Object.values(scheduledByDay).flat().reduce((s, wo) => s + getWoHours(wo), 0);
  const totalUnschedHrs = totalHoursAvail - totalSchedHrs;
  const loadingPct = totalHoursAvail > 0 ? Math.round((totalSchedHrs / totalHoursAvail) * 100) : 0;
  const discTarget = getTarget(days[0]) || (DISCIPLINES.find((d) => d.key === discipline)?.target ?? 85);
  const isPM = (wo: WorkOrder) => wo.work_type === "PM";

  const toggleDayExpand = (dayKey: string) => setExpandedDays(prev => ({ ...prev, [dayKey]: !prev[dayKey] }));

  const generatePMs = useCallback(() => {
    toast.info("PM generation triggered — this would auto-schedule PMs based on frequency");
  }, []);

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {scheduleMode === "shutdown" ? "Shutdown Schedule" : scheduleMode === "orchestrator" ? "Shutdown Orchestrator" : `${discipline} Schedule`}
            </h1>
            <p className="text-xs text-muted-foreground">
              {scheduleMode === "shutdown" ? "SAP-style Gantt scheduling grouped by vendor" : scheduleMode === "orchestrator" ? "Area-based shutdown planning and control system" : "Drag and drop work orders to schedule"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={scheduleMode} onValueChange={(v: any) => setScheduleMode(v)}>
            <SelectTrigger className="w-56 h-9">
              <div className="flex items-center gap-1.5">
                {scheduleMode === "shutdown" ? <Building2 className="w-3.5 h-3.5" /> : scheduleMode === "vendors" ? <Wrench className="w-3.5 h-3.5" /> : scheduleMode === "orchestrator" ? <Building2 className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly Schedule</SelectItem>
              <SelectItem value="shutdown">Shutdown Schedule</SelectItem>
              <SelectItem value="vendors">Vendors</SelectItem>
              <SelectItem value="orchestrator">Shutdown Orchestrator</SelectItem>
            </SelectContent>
          </Select>

          {scheduleMode === "weekly" && (
            <>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => setScheduleView("calendar")} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors", scheduleView === "calendar" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground")}>
                  <Calendar className="w-3.5 h-3.5" /> Calendar
                </button>
                <button onClick={() => setScheduleView("report")} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors", scheduleView === "report" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground")}>
                  <FileText className="w-3.5 h-3.5" /> Weekly Report
                </button>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Printer className="w-3.5 h-3.5" /> Print PMs</Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Printer className="w-3.5 h-3.5" /> Print WOs</Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs"><Download className="w-3.5 h-3.5" /> Export CSV</Button>
              <Badge variant="secondary" className="text-xs px-3 py-1">{getWeekLabel(weekStart)}</Badge>
              <Button size="sm" className="gap-1.5 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                <Lock className="w-3.5 h-3.5" /> Lock Schedule
              </Button>
            </>
          )}
        </div>
      </div>

      {scheduleMode === "vendors" ? (
      ) : scheduleMode === "vendors" ? (
        <VendorSchedulingView />
      ) : scheduleMode === "shutdown" ? (
        <ShutdownScheduleView />
      ) : scheduleMode === "orchestrator" ? (
        <ShutdownOrchestratorView />
      ) : scheduleView === "report" ? (
        <WOCScheduleReport weekOffset={weekOffset} personnelByDay={{}} />
      ) : (
      <>
      {/* Discipline Tabs */}
      <div className="flex gap-1 border-b border-border pb-px">
        {DISCIPLINES.map((d) => (
          <button
            key={d.key}
            onClick={() => setDiscipline(d.key)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-t-md border-b-2 transition-colors",
              discipline === d.key
                ? "border-primary text-foreground bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            <d.icon className={cn("w-3.5 h-3.5", d.color)} />
            {d.label}
            <span className="text-muted-foreground ml-1">Target: {d.target}%</span>
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">Combined Schedule</button>
          <button className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors">PM Forward Plan</button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setWeekOffset(0)}>Today</Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">Supervisor</span>
          <div className="w-10 h-5 bg-muted rounded-full relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-primary rounded-full" />
          </div>
          <span className="font-medium text-foreground">Planner</span>
        </div>
      </div>

      <div className="flex gap-4">
        {/* ── SIDEBAR — Rich WO Cards ── */}
        <div className="w-80 flex-shrink-0 space-y-3 border-r border-border pr-4">
          {/* Sidebar Tabs */}
          <div className="flex items-center gap-1 border-b border-border pb-1">
            <button onClick={() => setSidebarTab("unscheduled")} className={cn("px-3 py-1.5 text-xs font-medium rounded-t transition-colors", sidebarTab === "unscheduled" ? "bg-background border border-border border-b-transparent text-foreground -mb-px" : "text-muted-foreground hover:text-foreground")}>
              ⚙ Work Orders
            </button>
            <button onClick={() => setSidebarTab("pms")} className={cn("px-3 py-1.5 text-xs font-medium rounded-t transition-colors", sidebarTab === "pms" ? "bg-background border border-border border-b-transparent text-foreground -mb-px" : "text-muted-foreground hover:text-foreground")}>
              ⚡ PMs
            </button>
          </div>

          {/* Drag-to-unschedule drop zone */}
          <div
            className={cn(
              "flex items-center justify-center gap-2 py-2 px-3 rounded-md border-2 border-dashed text-xs transition-colors",
              dragWoId ? "border-destructive/40 bg-destructive/5 text-destructive" : "border-border text-muted-foreground"
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (dragWoId) { handleUnschedule(dragWoId); setDragWoId(null); } }}
          >
            ↓ Drag here to unschedule
          </div>

          {/* Search + Sort + Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search work orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs" />
            </div>
            <div className="flex items-center gap-1.5">
              <Select value={sortBy} onValueChange={(v: SortOption) => setSortBy(v)}>
                <SelectTrigger className="h-7 text-[10px] flex-1">
                  <div className="flex items-center gap-1"><ArrowUpDown className="w-3 h-3" /><SelectValue /></div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Critical First</SelectItem>
                  <SelectItem value="hours-desc">Most Hours</SelectItem>
                  <SelectItem value="hours-asc">Least Hours</SelectItem>
                  <SelectItem value="wo-number">WO Number</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center border border-border rounded overflow-hidden">
                {(["all", "PM", "CM"] as TypeFilter[]).map(t => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={cn("px-2 py-1 text-[10px] font-medium transition-colors", typeFilter === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                    {t === "all" ? "All" : t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Count + Total Hours */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Unscheduled ({unscheduled.length})</span>
            <span className="text-muted-foreground font-medium">
              {unscheduled.reduce((s, wo) => s + getWoHours(wo), 0).toFixed(1)}h total
            </span>
          </div>

          {/* WO Cards — rich detail */}
          <div className="space-y-2 max-h-[calc(100vh-420px)] overflow-y-auto pr-1">
            {unscheduled.length === 0 ? (
              <div className="text-center py-10">
                <Calendar className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">All work orders are scheduled</p>
              </div>
            ) : (
              unscheduled.map((wo) => {
                const pc = getPriorityConfig(wo.priority);
                const hrs = getWoHours(wo);
                return (
                  <div
                    key={wo.id}
                    draggable
                    onDragStart={() => handleDragStart(wo.id)}
                    className={cn(
                      "rounded-lg border bg-card cursor-grab hover:shadow-md transition-all group",
                      pc.border,
                      isPM(wo) && "border-l-[3px] border-l-emerald-500"
                    )}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between px-3 pt-2.5 pb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <GripVertical className="w-3 h-3 text-muted-foreground/40 flex-shrink-0 group-hover:text-muted-foreground" />
                        <span className="text-[11px] font-mono font-bold text-foreground">{wo.wo_number}</span>
                        {isPM(wo) ? (
                          <Badge className="text-[9px] h-4 px-1.5 bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100">PM</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] h-4 px-1.5">{wo.work_type || "CM"}</Badge>
                        )}
                      </div>
                      <Badge className={cn("text-[9px] h-4 px-1.5 font-bold border", pc.bg, pc.color, pc.border)} style={{ pointerEvents: "none" }}>
                        P{wo.priority || "3"}
                      </Badge>
                    </div>
                    {/* Description */}
                    <div className="px-3 pb-1.5">
                      <p className="text-[11px] text-foreground/80 line-clamp-1 leading-tight">
                        {(wo.problem_description || "No title").split(/\s[-–—]\s/)[0].replace(/^(PM|CM|BM):\s*/i, "").slice(0, 60)}
                      </p>
                    </div>
                    {/* Footer: Asset + Hours */}
                    <div className="flex items-center justify-between px-3 pb-2.5 text-[10px]">
                      <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                        {wo.asset_id && (
                          <span className="flex items-center gap-1 flex-shrink-0">
                            <MapPin className="w-2.5 h-2.5" />
                            <span className="font-semibold text-foreground">{wo.asset_id}</span>
                          </span>
                        )}
                        {wo.functional_location && (
                          <span className="truncate max-w-[120px]">{wo.functional_location}</span>
                        )}
                      </div>
                      <span className="flex items-center gap-1 font-semibold text-foreground flex-shrink-0">
                        <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                        {hrs > 0 ? `${hrs.toFixed(1)}h` : "—"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── MAIN SCHEDULE TABLE ── */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Manning Hours Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Manning Hours</span>
              <span className="text-xs text-muted-foreground">{format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">Legend:</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Mechanical WOs</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Electrical WOs</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Mobile & LVs WOs</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-yellow-400" /> PMs</span>
              </div>
              <div className="h-4 border-l border-border" />
              <span className="text-muted-foreground">Loading: <span className={cn("font-bold", loadingPct > discTarget ? "text-destructive" : loadingPct > 50 ? "text-amber-600" : "text-emerald-600")}>{loadingPct}%</span></span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", loadingPct > discTarget ? "bg-destructive" : loadingPct > 50 ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${Math.min(loadingPct, 100)}%` }} />
              </div>
              <Badge variant={loadingPct > discTarget ? "destructive" : "secondary"} className="text-[10px] h-5">
                {discTarget}% {loadingPct > discTarget ? "⚠" : "✓"}
              </Badge>
            </div>
          </div>

          {/* Capacity Source Indicator */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Capacity sourced from <b className="text-foreground">Advanced Planner</b>
            </span>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              Hrs/Day: {getHrsPerDay(days[0])} · Personnel: {getPersonnel(format(days[0], "yyyy-MM-dd"), days[0])} · Target: {getTarget(days[0])}%
            </span>
            <div className="ml-4">
              <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={generatePMs}>✨ Generate PMs (Quick)</Button>
            </div>
          </div>

          {/* Schedule — Day-by-Day with Inline Detail */}
          <div className="space-y-1">
            {days.map((day) => {
              const dayKey = format(day, "yyyy-MM-dd");
              const p = getPersonnel(dayKey, day);
              const hoursAvail = p * getHrsPerDay(day);
              const dayWOs = scheduledByDay[dayKey] || [];
              const schedHrs = dayWOs.reduce((s, wo) => s + getWoHours(wo), 0);
              const unschedHrs = hoursAvail - schedHrs;
              const isToday = isSameDay(day, today);
              const loadPct = hoursAvail > 0 ? Math.round((schedHrs / hoursAvail) * 100) : 0;
              const isOverTarget = loadPct > discTarget;

              return (
                <div
                  key={dayKey}
                  className={cn("rounded-lg border border-border overflow-hidden transition-colors", isToday && "ring-1 ring-primary/30", dragWoId && "hover:border-primary/40")}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-primary", "bg-primary/5"); }}
                  onDragLeave={(e) => { e.currentTarget.classList.remove("border-primary", "bg-primary/5"); }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("border-primary", "bg-primary/5"); handleDrop(dayKey); }}
                >
                  {/* Day Summary Bar */}
                  <div className={cn("flex items-center justify-between px-4 py-2", isToday ? "bg-primary/5" : "bg-muted/30")}>
                    <div className="flex items-center gap-3">
                      <span className={cn("text-xs font-bold w-8", isToday ? "text-primary" : "text-foreground")}>{format(day, "EEE").toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">{format(day, "d MMMM")}</span>
                      {isToday && <Badge variant="default" className="text-[9px] h-4 px-1.5">Today</Badge>}
                      {dayWOs.length === 0 && <span className="text-[10px] text-muted-foreground/50 italic ml-2">Drop work orders here</span>}
                    </div>
                    <div className="flex items-center gap-5 text-[10px]">
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Personnel:</span>
                        <span className="font-bold text-foreground">{p}</span>
                      </div>
                      <span className="text-muted-foreground">Available: <b className="text-foreground">{hoursAvail.toFixed(1)}h</b></span>
                      <span className="text-muted-foreground">Scheduled: <b className={cn(isOverTarget ? "text-destructive" : "text-foreground")}>{schedHrs.toFixed(1)}h</b></span>
                      <span className="text-muted-foreground">Remaining: <b className={cn(unschedHrs < 0 ? "text-destructive" : "text-foreground")}>{unschedHrs.toFixed(1)}h</b></span>
                      <span className="text-muted-foreground">Load: <b className={cn(isOverTarget ? "text-destructive" : loadPct > 50 ? "text-amber-600" : "text-emerald-600")}>{loadPct}%</b></span>
                      <span className="text-muted-foreground">Jobs: <b className="text-foreground">{dayWOs.length}</b></span>
                    </div>
                  </div>

                  {/* WO Detail Table */}
                  {dayWOs.length > 0 && (
                    <table className="w-full text-[10px]" style={{ tableLayout: "fixed" }}>
                      <thead>
                        <tr className="bg-muted/20 border-t border-border">
                          <th className="text-left px-3 py-1.5 font-semibold text-muted-foreground" style={{ width: "8%" }}>WO #</th>
                          <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "6%" }}>Type</th>
                          <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "5%" }}>Activity</th>
                          <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "9%" }}>Asset</th>
                          <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "12%" }}>Equipment</th>
                          <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "23%" }}>Description</th>
                          <th className="text-left px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "9%" }}>Work Centre</th>
                          <th className="text-center px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "5%" }}>Priority</th>
                          <th className="text-right px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "5%" }}>Hrs</th>
                          <th className="text-center px-2 py-1.5 font-semibold text-muted-foreground" style={{ width: "4%" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayWOs.map((wo, idx) => {
                          const woIsPM = wo.work_type === "PM";
                          const pc = getPriorityConfig(wo.priority);
                          const hrs = getWoHours(wo);
                          return (
                            <tr
                              key={wo.id}
                              draggable
                              onDragStart={() => handleDragStart(wo.id)}
                              className={cn(
                                "border-t border-border/50 cursor-grab hover:bg-muted/30 transition-colors group",
                                idx % 2 === 1 && "bg-muted/10"
                              )}
                            >
                              <td className="px-3 py-1.5">
                                <span className="font-mono font-bold text-foreground">{wo.wo_number}</span>
                              </td>
                              <td className="px-2 py-1.5">
                                <Badge className={cn(
                                  "text-[8px] h-4 w-[56px] justify-center px-1 font-bold truncate",
                                  woIsPM
                                    ? "bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                    : wo.work_type === "Breakdown"
                                      ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-100"
                                      : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                                )}>
                                  {woIsPM ? "PM" : wo.work_type || "CM"}
                                </Badge>
                              </td>
                              <td className="px-2 py-1.5">
                                <span className="font-mono font-semibold text-muted-foreground">{(wo as any).activity_type || "—"}</span>
                              </td>
                              <td className="px-2 py-1.5 font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">{wo.asset_id || "—"}</td>
                              <td className="px-2 py-1.5 text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">{wo.functional_location || "—"}</td>
                              <td className="px-2 py-1.5 text-foreground/80 overflow-hidden text-ellipsis whitespace-nowrap">
                                {(wo.problem_description || "No title").split(/\s[-–—]\s/)[0].replace(/^(PM|CM|BM):\s*/i, "").slice(0, 50)}
                              </td>
                              <td className="px-2 py-1.5 text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
                                {wo.trade === "Mechanical" ? "MECH" : wo.trade === "Electrical" ? "ELEC" : wo.trade === "Mobile & LVS" ? "MOBILE" : wo.trade === "Projects" ? "PROJ" : wo.trade || "—"}
                              </td>
                              <td className="px-2 py-1.5 text-center">
                                <Badge className={cn("text-[8px] h-4 px-1.5 font-bold border", pc.bg, pc.color, pc.border)} style={{ pointerEvents: "none" }}>
                                  P{wo.priority || "3"}
                                </Badge>
                              </td>
                              <td className="px-2 py-1.5 text-right font-mono font-bold text-foreground">{hrs > 0 ? hrs.toFixed(1) : "—"}</td>
                              <td className="px-2 py-1.5 text-center">
                                <button
                                  onClick={() => handleUnschedule(wo.id)}
                                  className="w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                  title="Unschedule"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}

            {/* Totals Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 rounded-lg border border-border text-xs font-semibold">
              <span>Total</span>
              <div className="flex items-center gap-6 text-[10px]">
                <span>Personnel: {totalPersonnel}</span>
                <span>Available: {totalHoursAvail.toFixed(1)}h</span>
                <span>Scheduled: {totalSchedHrs.toFixed(1)}h</span>
                <span>Remaining: {totalUnschedHrs.toFixed(1)}h</span>
                <span>{Object.values(scheduledByDay).flat().length} items total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
// Removed: ScheduledWOChip — replaced by inline detail table

