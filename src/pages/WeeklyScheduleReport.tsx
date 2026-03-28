import { useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import {
  Calendar, ChevronLeft, ChevronRight, Printer, FileDown,
  Wrench, Zap, Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format, startOfWeek, addWeeks, addDays, getISOWeek, getYear,
  isSameDay, parseISO,
} from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

/* ── Discipline config ── */
const DISCIPLINES = [
  {
    key: "Mechanical",
    label: "MECHANICAL FITTERS / BOILERMAKERS",
    icon: Wrench,
    color: "bg-blue-600",
    headerBg: "bg-[#1a1a2e]",
    headerText: "text-white",
    rowBg: "bg-blue-50/40",
    positions: [
      "Mechanical Fitter 1", "Mechanical Fitter 2", "Mechanical Fitter 3", "Mechanical Fitter 4",
      "Boilermaker 1", "Boilermaker 2", "Boilermaker 3", "Boilermaker 4",
    ],
  },
  {
    key: "Mobile",
    label: "MOBILE / LV",
    icon: Truck,
    color: "bg-amber-600",
    headerBg: "bg-[#2d2d1a]",
    headerText: "text-white",
    rowBg: "bg-amber-50/40",
    positions: [
      "HV Mechanic 1", "HV Mechanic 2", "HV Mechanic 3", "HV Mechanic 4",
      "LV Mechanic 1", "LV Mechanic 2", "LV Mechanic 3",
      "Service Person 1", "Service Person 2",
    ],
  },
  {
    key: "Electrical",
    label: "ELECTRICAL",
    icon: Zap,
    color: "bg-emerald-600",
    headerBg: "bg-[#1a2e1a]",
    headerText: "text-white",
    rowBg: "bg-emerald-50/40",
    positions: [
      "E&I Technician 1", "E&I Technician 2", "E&I Technician 3",
      "E&I Technician 4", "E&I Technician 5",
      "Electrician 1", "Electrician 2",
    ],
  },
];

const HRS_PER_PERSON = 10.5;
const DAY_LABELS = ["WED", "THU", "FRI", "SAT", "SUN", "MON", "TUE"];

function getWeekDays(weekStart: Date) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

function getWoHours(wo: WorkOrder): number {
  if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
    return wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
  }
  return 2; // default estimate
}

const WeeklyScheduleReport = () => {
  const { workOrders } = useWorkOrders();
  const [weekOffset, setWeekOffset] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const days = getWeekDays(weekStart);
  const weekLabel = `Y${String(getYear(weekStart)).slice(2)}-W${String(getISOWeek(weekStart)).padStart(2, "0")}`;

  // Group scheduled WOs by discipline and day
  const scheduledByDisciplineDay = useMemo(() => {
    const map: Record<string, Record<string, WorkOrder[]>> = {};
    for (const disc of DISCIPLINES) {
      map[disc.key] = {};
      for (const day of days) {
        const dayKey = format(day, "yyyy-MM-dd");
        map[disc.key][dayKey] = workOrders.filter((wo) => {
          if (!wo.scheduled_date) return false;
          if (!isSameDay(parseISO(wo.scheduled_date), day)) return false;
          if (!["Scheduled", "Active", "In Progress"].includes(wo.status)) return false;
          const trade = wo.trade?.toLowerCase() || "";
          if (disc.key === "Mechanical") return trade === "mechanical" || trade === "";
          if (disc.key === "Electrical") return trade === "electrical";
          if (disc.key === "Mobile") return trade === "mobile" || trade === "mobile/lv";
          return false;
        });
      }
    }
    return map;
  }, [workOrders, days]);

  // Summaries per discipline
  const disciplineSummaries = useMemo(() => {
    return DISCIPLINES.map((disc) => {
      const posCount = disc.positions.length;
      let totalAvail = 0;
      let totalSched = 0;
      const dailyAvail: number[] = [];
      const dailySched: number[] = [];

      for (const day of days) {
        const dayKey = format(day, "yyyy-MM-dd");
        const avail = posCount * HRS_PER_PERSON;
        const sched = (scheduledByDisciplineDay[disc.key]?.[dayKey] || [])
          .reduce((s, wo) => s + getWoHours(wo), 0);
        totalAvail += avail;
        totalSched += sched;
        dailyAvail.push(avail);
        dailySched.push(sched);
      }

      return {
        key: disc.key,
        totalAvail,
        totalSched,
        loadPct: totalAvail > 0 ? Math.round((totalSched / totalAvail) * 100) : 0,
        dailyAvail,
        dailySched,
      };
    });
  }, [scheduledByDisciplineDay, days]);

  // Grand totals
  const grandTotals = useMemo(() => {
    const totals = { avail: 0, sched: 0 };
    for (const s of disciplineSummaries) {
      totals.avail += s.totalAvail;
      totals.sched += s.totalSched;
    }
    return { ...totals, loadPct: totals.avail > 0 ? Math.round((totals.sched / totals.avail) * 100) : 0 };
  }, [disciplineSummaries]);

  // PDF export
  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    toast.info("Generating PDF...");
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 1200,
      });

      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const A4_W = 297;
      const A4_H = 210;
      const MARGIN = 8;
      const contentW = A4_W - MARGIN * 2;
      const contentH = A4_H - MARGIN * 2;

      const imgW = canvas.width;
      const imgH = canvas.height;
      const scaleFactor = contentW / (imgW / 2); // /2 because scale:2
      const totalImgHMm = (imgH / 2) * scaleFactor;

      if (totalImgHMm <= contentH) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", MARGIN, MARGIN, contentW, totalImgHMm);
      } else {
        // Multi page slicing
        let sourceY = 0;
        let currentY = MARGIN;
        const pxPerMm = imgH / totalImgHMm;

        while (sourceY < imgH) {
          const remainMm = A4_H - MARGIN - currentY;
          const slicePx = Math.min(Math.floor(remainMm * pxPerMm), imgH - sourceY);
          const sliceMm = slicePx / pxPerMm;

          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = imgW;
          sliceCanvas.height = slicePx;
          const ctx = sliceCanvas.getContext("2d")!;
          ctx.drawImage(canvas, 0, sourceY, imgW, slicePx, 0, 0, imgW, slicePx);

          pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", MARGIN, currentY, contentW, sliceMm);

          sourceY += slicePx;
          if (sourceY < imgH) {
            pdf.addPage();
            currentY = MARGIN;
          }
        }
      }

      const weekStr = format(weekStart, "yyyy-MM-dd");
      pdf.save(`Weekly_Schedule_Report_${weekStr}.pdf`);
      toast.success("PDF exported");
    } catch (err) {
      toast.error("PDF export failed");
      console.error(err);
    }
  };

  // Print
  const handlePrint = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", windowWidth: 1200 }).then((canvas) => {
      const win = window.open("", "_blank");
      if (!win) { toast.error("Popup blocked"); return; }
      win.document.write(`
        <html><head><title>Weekly Schedule Report</title>
        <style>@page{size:landscape;margin:8mm}body{margin:0;display:flex;justify-content:center}img{width:100%;height:auto}</style>
        </head><body><img src="${canvas.toDataURL("image/png")}"/></body></html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 500);
    });
  };

  return (
    <div className="p-6 space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Weekly Schedule Report</h1>
            <p className="text-xs text-muted-foreground">Maintenance workforce allocation and schedule loading</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" /> Print
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={handleExportPdf}>
            <FileDown className="w-3.5 h-3.5" /> Save PDF
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => setWeekOffset(0)}>Today</Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setWeekOffset((o) => o + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Badge variant="secondary" className="text-xs px-3 py-1">{weekLabel}</Badge>
      </div>

      {/* ── Report Body (captured for PDF) ── */}
      <div ref={reportRef} className="bg-white rounded-lg border border-border p-6 space-y-5" style={{ color: "#1a1a1a" }}>
        {/* Report Title */}
        <div className="text-center space-y-1 pb-4 border-b-2 border-[#C8960C]">
          <h2 className="text-xl font-bold tracking-wide" style={{ color: "#1a1a1a" }}>
            MAINTENANCE WEEKLY SCHEDULE
          </h2>
          <p className="text-sm font-medium" style={{ color: "#555" }}>
            Tennant Creek Gold Mine
          </p>
          <p className="text-sm" style={{ color: "#666" }}>
            Week Beginning: <span className="font-bold" style={{ color: "#1a1a1a" }}>{format(weekStart, "EEEE, d MMMM yyyy")}</span>
            <span className="ml-4 font-medium" style={{ color: "#888" }}>{weekLabel}</span>
          </p>
        </div>

        {/* Summary Stats */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse" style={{ color: "#1a1a1a" }}>
            <thead>
              <tr>
                <th className="text-left px-3 py-2 font-bold border border-gray-300 bg-gray-100" style={{ width: "200px" }}></th>
                {DISCIPLINES.map((d) => (
                  <th key={d.key} className="text-center px-3 py-2 font-bold border border-gray-300 bg-gray-100">
                    {d.key}
                  </th>
                ))}
                <th className="text-center px-3 py-2 font-bold border border-gray-300 bg-gray-100">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 font-bold border border-gray-300">TOTAL AVAILABLE HRS</td>
                {disciplineSummaries.map((s) => (
                  <td key={s.key} className="text-center px-3 py-1.5 font-medium border border-gray-300">{s.totalAvail.toFixed(1)}</td>
                ))}
                <td className="text-center px-3 py-1.5 font-bold border border-gray-300">{grandTotals.avail.toFixed(1)}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-bold border border-gray-300">SCHEDULE LOAD (HRS)</td>
                {disciplineSummaries.map((s) => (
                  <td key={s.key} className="text-center px-3 py-1.5 font-medium border border-gray-300">{s.totalSched.toFixed(1)}</td>
                ))}
                <td className="text-center px-3 py-1.5 font-bold border border-gray-300">{grandTotals.sched.toFixed(1)}</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-bold border border-gray-300">SCHEDULE LOAD (%)</td>
                {disciplineSummaries.map((s) => (
                  <td key={s.key} className={cn(
                    "text-center px-3 py-1.5 font-bold border border-gray-300",
                    s.loadPct > 90 ? "text-red-600" : s.loadPct > 70 ? "text-amber-600" : "text-emerald-600"
                  )}>
                    {s.loadPct}%
                  </td>
                ))}
                <td className={cn(
                  "text-center px-3 py-1.5 font-bold border border-gray-300",
                  grandTotals.loadPct > 90 ? "text-red-600" : grandTotals.loadPct > 70 ? "text-amber-600" : "text-emerald-600"
                )}>
                  {grandTotals.loadPct}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Discipline Sections */}
        {DISCIPLINES.map((disc, dIdx) => {
          const summary = disciplineSummaries[dIdx];
          return (
            <div key={disc.key} className="space-y-0">
              <table className="w-full text-xs border-collapse">
                <thead>
                  {/* Discipline Header */}
                  <tr className={cn(disc.headerBg, disc.headerText)}>
                    <th colSpan={8} className="text-left px-3 py-2 font-bold text-[11px] tracking-wider border border-gray-400">
                      {disc.label}
                    </th>
                  </tr>
                  {/* Day Headers */}
                  <tr className="bg-gray-100">
                    <th className="text-left px-3 py-1.5 font-bold border border-gray-300 w-[200px]">Position</th>
                    {days.map((day, i) => (
                      <th key={i} className="text-center px-2 py-1.5 font-bold border border-gray-300 w-[100px]">
                        <div>{DAY_LABELS[i]}</div>
                        <div className="text-[9px] font-normal" style={{ color: "#777" }}>{format(day, "d MMM")}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Personnel Rows */}
                  {disc.positions.map((pos, pIdx) => (
                    <tr key={pos} className={pIdx % 2 === 0 ? disc.rowBg : "bg-white"}>
                      <td className="px-3 py-1 font-medium border border-gray-300 text-[10px]" style={{ color: "#333" }}>
                        {pos.toUpperCase()}
                      </td>
                      {days.map((day, i) => {
                        const dayKey = format(day, "yyyy-MM-dd");
                        const dayWOs = scheduledByDisciplineDay[disc.key]?.[dayKey] || [];
                        // Show WO numbers distributed across personnel rows
                        const woForThisRow = dayWOs[pIdx] || null;
                        return (
                          <td key={i} className="text-center px-1 py-1 border border-gray-300 text-[9px]">
                            {woForThisRow ? (
                              <span className={cn(
                                "inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold",
                                woForThisRow.work_type === "PM"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
                              )}>
                                {woForThisRow.wo_number}
                              </span>
                            ) : (
                              <span style={{ color: "#ccc" }}>0</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Available Hours Row */}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-3 py-1.5 border border-gray-300 text-[10px]">AVAILABLE HRS</td>
                    {summary.dailyAvail.map((h, i) => (
                      <td key={i} className="text-center px-2 py-1.5 border border-gray-300 text-[10px]">{h.toFixed(1)}</td>
                    ))}
                  </tr>
                  {/* Scheduled Hours Row */}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-3 py-1.5 border border-gray-300 text-[10px]">SCHEDULED HRS</td>
                    {summary.dailySched.map((h, i) => (
                      <td key={i} className={cn(
                        "text-center px-2 py-1.5 border border-gray-300 text-[10px]",
                        h > 0 ? "text-blue-700" : ""
                      )}>
                        {h.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}

        {/* Scheduled Work Orders Detail */}
        <div className="space-y-0 pt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#1a1a2e] text-white">
                <th colSpan={7} className="text-left px-3 py-2 font-bold text-[11px] tracking-wider border border-gray-400">
                  SCHEDULED WORK ORDERS DETAIL
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">WO Number</th>
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">Type</th>
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">Discipline</th>
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">Priority</th>
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">Date</th>
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">Asset</th>
                <th className="text-left px-3 py-1.5 font-bold border border-gray-300">Description</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const allScheduled = workOrders.filter((wo) => {
                  if (!wo.scheduled_date) return false;
                  return days.some((d) => isSameDay(parseISO(wo.scheduled_date!), d)) &&
                    ["Scheduled", "Active", "In Progress"].includes(wo.status);
                }).sort((a, b) => (a.scheduled_date || "").localeCompare(b.scheduled_date || ""));

                if (allScheduled.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="text-center px-3 py-4 border border-gray-300" style={{ color: "#999" }}>
                        No work orders scheduled for this week
                      </td>
                    </tr>
                  );
                }

                return allScheduled.map((wo, idx) => (
                  <tr key={wo.id} className={idx % 2 === 0 ? "bg-[#fdf8ea]" : "bg-white"}>
                    <td className="px-3 py-1 border border-gray-300 font-mono font-semibold text-[10px]">{wo.wo_number}</td>
                    <td className="px-3 py-1 border border-gray-300 text-[10px]">
                      <span className={cn(
                        "inline-block px-1.5 py-0.5 rounded text-[8px] font-semibold",
                        wo.work_type === "PM" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      )}>
                        {wo.work_type || "CM"}
                      </span>
                    </td>
                    <td className="px-3 py-1 border border-gray-300 text-[10px]">{wo.trade || "Mechanical"}</td>
                    <td className="px-3 py-1 border border-gray-300 text-[10px]">
                      <span className={cn(
                        "font-semibold",
                        wo.priority === "Critical" ? "text-red-600" :
                        wo.priority === "High" ? "text-amber-600" :
                        wo.priority === "Medium" ? "text-blue-600" : ""
                      )}>
                        {wo.priority}
                      </span>
                    </td>
                    <td className="px-3 py-1 border border-gray-300 text-[10px]">
                      {wo.scheduled_date ? format(parseISO(wo.scheduled_date), "EEE d MMM") : ""}
                    </td>
                    <td className="px-3 py-1 border border-gray-300 text-[10px]">{wo.asset_id || ""}</td>
                    <td className="px-3 py-1 border border-gray-300 text-[10px] max-w-[250px] truncate">
                      {wo.problem_description || ""}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-300 text-[9px]" style={{ color: "#999" }}>
          <span>Tennant Creek Gold Mine | Maintenance Weekly Schedule</span>
          <span>Generated: {format(new Date(), "d MMM yyyy, HH:mm")}</span>
          <span>minesite.ai</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleReport;
