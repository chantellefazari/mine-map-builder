import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { Printer, FileDown } from "lucide-react";
import {
  format, startOfWeek, addWeeks, addDays, getISOWeek,
  isSameDay, parseISO,
} from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

import {
  DISCIPLINES, HRS_PER_PERSON, getWoHours, matchesDiscipline,
  getCapacityStatus, priorityLabel,
  DiscData, DayData, QualityCheck,
} from "./schedule-report/types";
import { ReadinessSnapshot } from "./schedule-report/ReadinessSnapshot";
import { TradeCapacitySummary } from "./schedule-report/TradeCapacitySummary";
import { DailyTradeSchedule } from "./schedule-report/DailyTradeSchedule";

interface Props { weekOffset: number; personnelByDay: Record<string, number>; }

export function WOCScheduleReport({ weekOffset, personnelByDay }: Props) {
  const { workOrders } = useWorkOrders();
  const reportRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);
  const weekLabel = `W${String(getISOWeek(weekStart)).padStart(2, "0")}`;

  // ── Build structured data ──
  const data: DiscData[] = useMemo(() => {
    return DISCIPLINES.map((disc) => {
      const byDay: DayData[] = days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const wos = workOrders.filter((wo) => {
          if (!wo.scheduled_date || !isSameDay(parseISO(wo.scheduled_date), day)) return false;
          if (!["Scheduled", "Active", "In Progress"].includes(wo.status)) return false;
          return matchesDiscipline(wo, disc.key);
        });
        const hrs = wos.reduce((s, w) => s + getWoHours(w), 0);
        const personnel = personnelByDay[dayKey] ?? 4;
        const avail = personnel * HRS_PER_PERSON;
        const loadPct = avail > 0 ? Math.round((hrs / avail) * 100) : 0;
        return { dayKey, day, wos, hrs, avail, personnel, loadPct };
      });
      const allWos = byDay.flatMap(d => d.wos);
      const totalHrs = byDay.reduce((s, d) => s + d.hrs, 0);
      const totalAvail = byDay.reduce((s, d) => s + d.avail, 0);
      const loadPct = totalAvail > 0 ? Math.round((totalHrs / totalAvail) * 100) : 0;
      const totalJobs = allWos.length;
      const pmCount = allWos.filter(w => w.work_type === "PM").length;
      const reactiveCount = allWos.filter(w => ["BM", "Breakdown", "Reactive"].includes(w.work_type || "")).length;
      const cmCount = totalJobs - pmCount - reactiveCount;
      const capacityStatus = getCapacityStatus(loadPct, disc.target);
      return { ...disc, byDay, totalHrs, totalAvail, loadPct, totalJobs, pmCount, cmCount, reactiveCount, capacityStatus };
    });
  }, [workOrders, days, personnelByDay]);

  // ── Aggregate totals ──
  const totalJobs = data.reduce((s, d) => s + d.totalJobs, 0);
  const totalPMs = data.reduce((s, d) => s + d.pmCount, 0);
  const totalReactive = data.reduce((s, d) => s + d.reactiveCount, 0);
  const totalPlanned = totalJobs - totalPMs - totalReactive;
  const totalHrs = data.reduce((s, d) => s + d.totalHrs, 0);
  const totalAvail = data.reduce((s, d) => s + d.totalAvail, 0);
  const overallLoadPct = totalAvail > 0 ? Math.round((totalHrs / totalAvail) * 100) : 0;

  // ── High priority analysis ──
  const highPriScheduled = data.flatMap(d => d.byDay.flatMap(dd => dd.wos)).filter(w => {
    const p = priorityLabel(w.priority);
    return p === "P1" || p === "P2";
  }).length;



  // ── PDF Export ──
  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    toast.info("Generating PDF...");
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", windowWidth: 1100 });
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const A4_W = 297, A4_H = 210, M = 8;
      const cW = A4_W - M * 2;
      const imgW = canvas.width, imgH = canvas.height;
      const sf = cW / (imgW / 2);
      const tH = (imgH / 2) * sf;
      if (tH <= A4_H - M * 2) {
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", M, M, cW, tH);
      } else {
        let srcY = 0, curY = M;
        const ppm = imgH / tH;
        while (srcY < imgH) {
          const rem = A4_H - M - curY;
          const slPx = Math.min(Math.floor(rem * ppm), imgH - srcY);
          const slMm = slPx / ppm;
          const sc = document.createElement("canvas"); sc.width = imgW; sc.height = slPx;
          sc.getContext("2d")!.drawImage(canvas, 0, srcY, imgW, slPx, 0, 0, imgW, slPx);
          pdf.addImage(sc.toDataURL("image/png"), "PNG", M, curY, cW, slMm);
          srcY += slPx;
          if (srcY < imgH) { pdf.addPage(); curY = M; }
        }
      }
      pdf.save(`Weekly_Schedule_Readiness_${format(weekStart, "yyyy-MM-dd")}.pdf`);
      toast.success("PDF exported");
    } catch { toast.error("PDF export failed"); }
  };

  const handlePrint = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", windowWidth: 1100 }).then((canvas) => {
      const win = window.open("", "_blank");
      if (!win) { toast.error("Popup blocked"); return; }
      win.document.write(`<html><head><title>Weekly Schedule Readiness Report</title><style>@page{size:landscape;margin:8mm}body{margin:0;display:flex;justify-content:center}img{width:100%;height:auto}</style></head><body><img src="${canvas.toDataURL("image/png")}"/></body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 500);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
          <Printer className="w-3.5 h-3.5" /> Print
        </Button>
        <Button size="sm" className="gap-1.5 text-xs" onClick={handleExportPdf}>
          <FileDown className="w-3.5 h-3.5" /> Save PDF
        </Button>
      </div>

      <div ref={reportRef} style={{ background: "#fff", padding: "24px 28px", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1a1a1a", maxWidth: 1100 }}>
        {/* ── HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "3px solid #C8960C", paddingBottom: 10, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#C8960C", letterSpacing: 2, textTransform: "uppercase" }}>Tennant Creek Gold Mine</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginTop: 1 }}>Weekly Maintenance Schedule</div>
            <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>Final Issue — Schedule Readiness & Workload Assessment</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#C8960C", lineHeight: 1 }}>{weekLabel}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{format(weekStart, "d MMM")} — {format(weekEnd, "d MMM yyyy")}</div>
            <div style={{ fontSize: 9, color: "#aaa", marginTop: 1 }}>Wednesday to Tuesday Cycle</div>
          </div>
        </div>

        {/* SECTION 1 */}
        <ReadinessSnapshot
          totalJobs={totalJobs}
          totalPMs={totalPMs}
          totalReactive={totalReactive}
          totalHrs={totalHrs}
          totalAvail={totalAvail}
          overallLoadPct={overallLoadPct}
          highPriScheduled={highPriScheduled}
        />

        {/* SECTION 2 */}
        <TradeCapacitySummary data={data} />



        {/* SECTION 5 */}
        <DailyTradeSchedule data={data} />


        {/* ── FOOTER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e5e7eb", fontSize: 9, color: "#bbb" }}>
          <span>Tennant Creek Gold Mine</span>
          <span>Generated {format(new Date(), "d MMM yyyy, HH:mm")} — Final Issue Document</span>
          <span>minesite.ai</span>
        </div>
      </div>
    </div>
  );
}
