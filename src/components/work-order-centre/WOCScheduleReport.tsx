import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useWorkOrders, WorkOrder } from "@/hooks/useWorkOrders";
import { Printer, FileDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  format, startOfWeek, addWeeks, addDays, getISOWeek, getYear,
  isSameDay, parseISO,
} from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

const HRS_PER_PERSON = 10.5;
const DISCIPLINES = [
  { key: "Mechanical", target: 80, accent: "#2563eb", light: "#eff6ff", dark: "#1e3a5f" },
  { key: "Electrical", target: 90, accent: "#d97706", light: "#fffbeb", dark: "#5c3d0e" },
];

function getWoHours(wo: WorkOrder): number {
  if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
    return wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
  }
  return 2;
}

interface Props { weekOffset: number; personnelByDay: Record<string, number>; }

export function WOCScheduleReport({ weekOffset, personnelByDay }: Props) {
  const { workOrders } = useWorkOrders();
  const reportRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);
  const weekLabel = `W${String(getISOWeek(weekStart)).padStart(2, "0")}`;

  // Build data per discipline per day
  const data = useMemo(() => {
    return DISCIPLINES.map((disc) => {
      const byDay = days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const wos = workOrders.filter((wo) => {
          if (!wo.scheduled_date || !isSameDay(parseISO(wo.scheduled_date), day)) return false;
          if (!["Scheduled", "Active", "In Progress"].includes(wo.status)) return false;
          const trade = wo.trade?.toLowerCase() || "";
          if (disc.key === "Mechanical") return trade === "mechanical" || trade === "";
          if (disc.key === "Electrical") return trade === "electrical";
          return false;
        });
        const pms = wos.filter((w) => w.work_type === "PM");
        const cms = wos.filter((w) => w.work_type !== "PM");
        const hrs = wos.reduce((s, w) => s + getWoHours(w), 0);
        const personnel = personnelByDay[dayKey] ?? 4;
        const avail = personnel * HRS_PER_PERSON;
        return { dayKey, day, wos, pms, cms, hrs, avail, personnel };
      });
      const totalHrs = byDay.reduce((s, d) => s + d.hrs, 0);
      const totalAvail = byDay.reduce((s, d) => s + d.avail, 0);
      const loadPct = totalAvail > 0 ? Math.round((totalHrs / totalAvail) * 100) : 0;
      return { ...disc, byDay, totalHrs, totalAvail, loadPct };
    });
  }, [workOrders, days, personnelByDay]);

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
      pdf.save(`Weekly_Schedule_${format(weekStart, "yyyy-MM-dd")}.pdf`);
      toast.success("PDF exported");
    } catch { toast.error("PDF export failed"); }
  };

  const handlePrint = () => {
    if (!reportRef.current) return;
    html2canvas(reportRef.current, { scale: 2, backgroundColor: "#ffffff", windowWidth: 1100 }).then((canvas) => {
      const win = window.open("", "_blank");
      if (!win) { toast.error("Popup blocked"); return; }
      win.document.write(`<html><head><title>Weekly Schedule</title><style>@page{size:landscape;margin:8mm}body{margin:0;display:flex;justify-content:center}img{width:100%;height:auto}</style></head><body><img src="${canvas.toDataURL("image/png")}"/></body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 500);
    });
  };

  const dayLabel = (d: Date) => format(d, "EEE").toUpperCase();
  const dayDate = (d: Date) => format(d, "d");

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

      <div ref={reportRef} style={{ background: "#fff", padding: 32, fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1a1a1a", maxWidth: 1100 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "3px solid #C8960C", paddingBottom: 12, marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#C8960C", letterSpacing: 2, textTransform: "uppercase" }}>Tennant Creek Gold Mine</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", marginTop: 2 }}>Weekly Maintenance Schedule</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#C8960C" }}>{weekLabel}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{format(weekStart, "d MMM")} — {format(weekEnd, "d MMM yyyy")}</div>
          </div>
        </div>

        {/* Summary Bars */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {data.map((disc) => (
            <div key={disc.key} style={{ flex: 1, background: disc.light, borderRadius: 8, padding: "12px 16px", border: `1px solid ${disc.accent}22` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: disc.dark }}>{disc.key}</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: disc.loadPct > disc.target ? "#dc2626" : disc.accent }}>{disc.loadPct}%</span>
              </div>
              {/* Loading bar */}
              <div style={{ height: 6, borderRadius: 3, background: `${disc.accent}20`, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(disc.loadPct, 100)}%`, background: disc.loadPct > disc.target ? "#dc2626" : disc.accent, transition: "width 0.3s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#888" }}>
                <span>{disc.totalHrs.toFixed(1)}h scheduled</span>
                <span>{disc.totalAvail.toFixed(1)}h available</span>
                <span>Target: {disc.target}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Day Columns Grid */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ width: 90, padding: "6px 8px", textAlign: "left", borderBottom: "2px solid #e5e7eb" }}></th>
              {days.map((day) => {
                const isToday = isSameDay(day, today);
                return (
                  <th key={day.toISOString()} style={{
                    padding: "6px 4px", textAlign: "center", borderBottom: isToday ? "2px solid #C8960C" : "2px solid #e5e7eb",
                    background: isToday ? "#fdf8ea" : "transparent",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: isToday ? "#C8960C" : "#999", letterSpacing: 1 }}>{dayLabel(day)}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isToday ? "#C8960C" : "#1a1a1a" }}>{dayDate(day)}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((disc) => (
              <>
                {/* Discipline label row */}
                <tr key={`${disc.key}-label`}>
                  <td colSpan={8} style={{ padding: "10px 8px 4px", fontSize: 11, fontWeight: 700, color: disc.dark, borderBottom: `2px solid ${disc.accent}` }}>
                    {disc.key}
                  </td>
                </tr>
                {/* Hours row */}
                <tr key={`${disc.key}-hrs`}>
                  <td style={{ padding: "6px 8px", fontSize: 10, color: "#888", fontWeight: 600 }}>Hours</td>
                  {disc.byDay.map((d) => (
                    <td key={d.dayKey} style={{ padding: "4px", textAlign: "center", background: isSameDay(d.day, today) ? "#fdf8ea" : "transparent" }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: d.hrs > d.avail ? "#dc2626" : d.hrs > 0 ? disc.accent : "#ddd" }}>
                        {d.hrs > 0 ? d.hrs.toFixed(1) : "—"}
                      </div>
                      <div style={{ fontSize: 9, color: "#bbb" }}>/ {d.avail.toFixed(0)}</div>
                    </td>
                  ))}
                </tr>
                {/* Work Orders row */}
                <tr key={`${disc.key}-wo`}>
                  <td style={{ padding: "4px 8px", fontSize: 10, color: "#888", verticalAlign: "top" }}>Work Orders</td>
                  {disc.byDay.map((d) => (
                    <td key={d.dayKey} style={{ padding: "3px 2px", verticalAlign: "top", textAlign: "center", background: isSameDay(d.day, today) ? "#fdf8ea" : "transparent" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                        {d.cms.map((wo) => (
                          <span key={wo.id} style={{
                            display: "inline-block", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600,
                            background: `${disc.accent}18`, color: disc.accent, border: `1px solid ${disc.accent}30`,
                          }}>
                            {wo.wo_number}
                          </span>
                        ))}
                        {d.cms.length === 0 && <span style={{ color: "#e5e7eb", fontSize: 9 }}>—</span>}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* PMs row */}
                <tr key={`${disc.key}-pm`}>
                  <td style={{ padding: "4px 8px 10px", fontSize: 10, color: "#888", verticalAlign: "top" }}>PMs</td>
                  {disc.byDay.map((d) => (
                    <td key={d.dayKey} style={{ padding: "3px 2px 10px", verticalAlign: "top", textAlign: "center", borderBottom: "1px solid #f3f4f6", background: isSameDay(d.day, today) ? "#fdf8ea" : "transparent" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
                        {d.pms.map((wo) => (
                          <span key={wo.id} style={{
                            display: "inline-block", padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600,
                            background: "#ecfdf5", color: "#059669", border: "1px solid #a7f3d030",
                          }}>
                            {wo.wo_number}
                          </span>
                        ))}
                        {d.pms.length === 0 && <span style={{ color: "#e5e7eb", fontSize: 9 }}>—</span>}
                      </div>
                    </td>
                  ))}
                </tr>
              </>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, paddingTop: 10, borderTop: "1px solid #e5e7eb", fontSize: 9, color: "#bbb" }}>
          <span>Tennant Creek Gold Mine</span>
          <span>Generated {format(new Date(), "d MMM yyyy, HH:mm")}</span>
          <span>minesite.ai</span>
        </div>
      </div>
    </div>
  );
}
