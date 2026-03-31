import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import {
  Calendar, ChevronLeft, ChevronRight, Search, GripVertical,
  Wrench, Zap, Users, Printer, FileText, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format, startOfWeek, endOfWeek, addWeeks, addDays, getISOWeek, getYear,
  isSameDay, parseISO, isWithinInterval,
} from "date-fns";
import { toast } from "sonner";
import { WOCScheduleReport } from "./WOCScheduleReport";
import { ShutdownScheduleView } from "./shutdown/ShutdownScheduleView";
import { VendorSchedulingView } from "./vendor-scheduling/VendorSchedulingView";

const DISCIPLINES = [
  { key: "Mechanical", label: "Mechanical", icon: Wrench, color: "text-blue-600", target: 80 },
  { key: "Electrical", label: "Electrical", icon: Zap, color: "text-amber-600", target: 90 },
];

const HRS_PER_PERSON = 10.5;

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
  const [discipline, setDiscipline] = useState("Mechanical");
  const [weekOffset, setWeekOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [personnel, setPersonnel] = useState<Record<string, number>>({});
  const [dragWoId, setDragWoId] = useState<string | null>(null);
  const [scheduleView, setScheduleView] = useState<"calendar" | "report">("calendar");
  const [scheduleMode, setScheduleMode] = useState<"weekly" | "shutdown">("weekly");
  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 }); // Wed start
  const weekEnd = endOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const days = getWeekDays(weekStart);

  // Filter WOs by discipline (trade)
  const disciplineWOs = useMemo(() => {
    return workOrders.filter((wo) => {
      const trade = wo.trade?.toLowerCase() || "";
      if (discipline === "Mechanical") return trade === "mechanical" || trade === "";
      if (discipline === "Electrical") return trade === "electrical";
      return true;
    });
  }, [workOrders, discipline]);

  // Unscheduled: status Scheduled but no scheduled_date, or scheduled_date outside this week
  const unscheduled = useMemo(() => {
    let list = disciplineWOs.filter(
      (wo) => wo.status === "Scheduled" && !wo.scheduled_date
    );
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (wo) =>
          wo.wo_number?.toLowerCase().includes(q) ||
          wo.problem_description?.toLowerCase().includes(q) ||
          wo.asset_id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [disciplineWOs, search]);

  // Scheduled per day
  const scheduledByDay = useMemo(() => {
    const map: Record<string, WorkOrder[]> = {};
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      map[key] = disciplineWOs.filter(
        (wo) =>
          wo.scheduled_date &&
          isSameDay(parseISO(wo.scheduled_date), day) &&
          ["Scheduled", "Active", "In Progress"].includes(wo.status)
      );
    }
    return map;
  }, [disciplineWOs, days]);

  const getPersonnel = (dayKey: string) => personnel[dayKey] ?? 4;
  const setDayPersonnel = (dayKey: string, val: number) => {
    setPersonnel((prev) => ({ ...prev, [dayKey]: Math.max(0, val) }));
  };

  // Quick fill
  const quickFill = (val: number, daysToFill: "all" | "weekday" | "weekend") => {
    const newP = { ...personnel };
    for (const day of days) {
      const key = format(day, "yyyy-MM-dd");
      const dow = day.getDay();
      if (daysToFill === "all") newP[key] = val;
      else if (daysToFill === "weekday" && dow >= 1 && dow <= 5) newP[key] = val;
      else if (daysToFill === "weekend" && (dow === 0 || dow === 6)) newP[key] = val;
    }
    setPersonnel(newP);
  };

  const [quickFillVal, setQuickFillVal] = useState(4);

  // Drag handlers
  const handleDragStart = (woId: string) => setDragWoId(woId);

  const handleDrop = async (dayKey: string) => {
    if (!dragWoId) return;
    try {
      await update.mutateAsync({
        id: dragWoId,
        updates: { scheduled_date: dayKey } as any,
      });
      toast.success("Work order scheduled");
    } catch { /* handled */ }
    setDragWoId(null);
  };

  const handleUnschedule = async (woId: string) => {
    try {
      await update.mutateAsync({
        id: woId,
        updates: { scheduled_date: null } as any,
      });
      toast.success("Work order unscheduled");
    } catch { /* handled */ }
  };

  // Capacity calculations
  const totalPersonnel = days.reduce((s, d) => s + getPersonnel(format(d, "yyyy-MM-dd")), 0);
  const totalHoursAvail = days.reduce((s, d) => s + getPersonnel(format(d, "yyyy-MM-dd")) * HRS_PER_PERSON, 0);
  const totalSchedHrs = Object.values(scheduledByDay).flat().reduce((s, wo) => {
    // Extract estimated hours from labour_hours or default to 0
    if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
      return s + wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
    }
    return s;
  }, 0);
  const totalUnschedHrs = totalHoursAvail - totalSchedHrs;
  const loadingPct = totalHoursAvail > 0 ? Math.round((totalSchedHrs / totalHoursAvail) * 100) : 0;
  const discTarget = DISCIPLINES.find((d) => d.key === discipline)?.target ?? 85;

  const isPM = (wo: WorkOrder) => wo.work_type === "PM";

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
              {scheduleMode === "shutdown" ? "Shutdown Schedule" : `${discipline} Schedule`}
            </h1>
            <p className="text-xs text-muted-foreground">
              {scheduleMode === "shutdown" ? "SAP-style Gantt scheduling grouped by vendor" : "Drag and drop work orders to schedule"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Schedule Mode Dropdown */}
          <Select value={scheduleMode} onValueChange={(v: "weekly" | "shutdown") => setScheduleMode(v)}>
            <SelectTrigger className="w-52 h-9">
              <div className="flex items-center gap-1.5">
                {scheduleMode === "shutdown" ? <Building2 className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly Schedule</SelectItem>
              <SelectItem value="shutdown">Shutdown Schedule</SelectItem>
            </SelectContent>
          </Select>

          {scheduleMode === "weekly" && (
            <>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setScheduleView("calendar")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                    scheduleView === "calendar" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" /> Calendar
                </button>
                <button
                  onClick={() => setScheduleView("report")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors",
                    scheduleView === "report" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="w-3.5 h-3.5" /> Weekly Report
                </button>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Printer className="w-3.5 h-3.5" /> Print PMs
              </Button>
              <Badge variant="secondary" className="text-xs px-3 py-1">
                {getWeekLabel(weekStart)}
              </Badge>
            </>
          )}
        </div>
      </div>

      {scheduleMode === "shutdown" ? (
        <ShutdownScheduleView />
      ) : scheduleView === "report" ? (
        <WOCScheduleReport weekOffset={weekOffset} personnelByDay={personnel} />
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
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setWeekOffset(0)}>
          Today
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
        </div>
      </div>

      <div className="flex gap-4">
        {/* Sidebar — Unscheduled WOs */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search work orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="text-xs font-medium text-muted-foreground">
            Unscheduled ({unscheduled.length})
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {unscheduled.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                All work orders are scheduled
              </div>
            ) : (
              unscheduled.map((wo) => (
                <div
                  key={wo.id}
                  draggable
                  onDragStart={() => handleDragStart(wo.id)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-2 rounded-md border border-border bg-card cursor-grab hover:shadow-sm transition-shadow",
                    isPM(wo) && "border-l-2 border-l-emerald-500"
                  )}
                >
                  <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-semibold">{wo.wo_number}</span>
                      {isPM(wo) && (
                        <Badge variant="secondary" className="text-[9px] h-4 px-1">PM</Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {wo.problem_description || wo.asset_id || "No description"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Schedule Table */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Manning Hours Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Manning Hours</span>
              <span className="text-xs text-muted-foreground">
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">Loading:</span>
              <span className={cn(
                "font-semibold",
                loadingPct > discTarget ? "text-destructive" : loadingPct > 50 ? "text-amber-600" : "text-emerald-600"
              )}>
                {loadingPct}%
                {loadingPct > discTarget && " ⚠"}
              </span>
              <span className="text-muted-foreground">Man Hours: <span className="font-semibold text-foreground">{totalHoursAvail.toFixed(1)}</span></span>
            </div>
          </div>

          {/* Quick Fill */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-muted-foreground">Quick Fill:</span>
            <Input
              type="number"
              value={quickFillVal}
              onChange={(e) => setQuickFillVal(Number(e.target.value))}
              className="w-14 h-7 text-xs text-center"
              min={0}
            />
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => quickFill(quickFillVal, "all")}>All Days</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => quickFill(quickFillVal, "weekday")}>Mon-Fri</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => quickFill(quickFillVal, "weekend")}>Sat-Sun</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={() => quickFill(0, "all")}>Clear</Button>
            <span className="ml-auto text-muted-foreground">Hrs/Person/Day: <span className="font-semibold text-foreground">{HRS_PER_PERSON}</span></span>
          </div>

          {/* Schedule Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 font-semibold w-28">Day / Date</th>
                  <th className="text-center px-3 py-2 font-semibold w-24">Personnel Avail</th>
                  <th className="text-center px-3 py-2 font-semibold w-20">Hours Avail</th>
                  <th className="text-center px-3 py-2 font-semibold w-20">Sched Hrs</th>
                  <th className="text-center px-3 py-2 font-semibold w-20">Unsched Hrs</th>
                  <th className="text-left px-3 py-2 font-semibold">Scheduled Work Orders / PMs</th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const dayKey = format(day, "yyyy-MM-dd");
                  const p = getPersonnel(dayKey);
                  const hoursAvail = p * HRS_PER_PERSON;
                  const dayWOs = scheduledByDay[dayKey] || [];
                  const schedHrs = dayWOs.reduce((s, wo) => {
                    if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
                      return s + wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
                    }
                    return s;
                  }, 0);
                  const unschedHrs = hoursAvail - schedHrs;
                  const isToday = isSameDay(day, today);

                  return (
                    <tr
                      key={dayKey}
                      className={cn(
                        "border-b border-border last:border-b-0",
                        isToday && "bg-primary/5",
                        dragWoId && "hover:bg-muted/30"
                      )}
                      onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("bg-muted/50"); }}
                      onDragLeave={(e) => { e.currentTarget.classList.remove("bg-muted/50"); }}
                      onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("bg-muted/50"); handleDrop(dayKey); }}
                    >
                      <td className="px-3 py-2">
                        <span className={cn("font-semibold", isToday && "text-primary")}>
                          {format(day, "EEE")}
                        </span>{" "}
                        <span className="text-muted-foreground">{format(day, "d MMM")}</span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDayPersonnel(dayKey, p - 1)}
                            className="w-5 h-5 rounded border border-border text-muted-foreground hover:bg-muted flex items-center justify-center text-xs"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-medium">{p}</span>
                          <button
                            onClick={() => setDayPersonnel(dayKey, p + 1)}
                            className="w-5 h-5 rounded border border-border text-muted-foreground hover:bg-muted flex items-center justify-center text-xs"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center text-muted-foreground">{hoursAvail.toFixed(1)}</td>
                      <td className="px-3 py-2 text-center font-medium">{schedHrs.toFixed(1)}</td>
                      <td className="px-3 py-2 text-center text-muted-foreground">{unschedHrs.toFixed(1)}</td>
                      <td className="px-3 py-2">
                        {dayWOs.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {dayWOs.map((wo) => (
                              <div
                                key={wo.id}
                                draggable
                                onDragStart={() => handleDragStart(wo.id)}
                                className={cn(
                                  "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border cursor-grab",
                                  isPM(wo)
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                                )}
                              >
                                {isPM(wo) ? "📋" : "🔧"} {wo.wo_number}
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleUnschedule(wo.id); }}
                                  className="ml-0.5 text-muted-foreground hover:text-foreground"
                                  title="Unschedule"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground/50 text-[10px]">Drop work orders here</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {/* Totals */}
                <tr className="bg-muted/30 font-semibold">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-center">{totalPersonnel}</td>
                  <td className="px-3 py-2 text-center">{totalHoursAvail.toFixed(1)}</td>
                  <td className="px-3 py-2 text-center">{totalSchedHrs.toFixed(1)}</td>
                  <td className="px-3 py-2 text-center">{totalUnschedHrs.toFixed(1)}</td>
                  <td className="px-3 py-2 text-muted-foreground text-[10px]">
                    {Object.values(scheduledByDay).flat().length} items total
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
