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
  { key: "Mechanical", target: 80, accent: "#2563eb", light: "#eff6ff", dark: "#1e3a5f", band: "#dbeafe" },
  { key: "Electrical", target: 90, accent: "#f97316", light: "#fff8f1", dark: "#9a3412", band: "#fed7aa" },
];

function getWoHours(wo: WorkOrder): number {
  if (wo.labour_hours && Array.isArray(wo.labour_hours)) {
    return wo.labour_hours.reduce((h: number, l: any) => h + (Number(l.hours) || 0), 0);
  }
  return 2;
}

function matchesDiscipline(wo: WorkOrder, key: string): boolean {
  const trade = wo.trade?.toLowerCase() || "";
  if (key === "Mechanical") return trade === "mechanical" || trade === "";
  if (key === "Electrical") return trade === "electrical";
  return false;
}

const priorityLabel = (p: string) => {
  if (p?.startsWith("P1")) return "P1";
  if (p?.startsWith("P2")) return "P2";
  if (p?.startsWith("P3")) return "P3";
  if (p?.startsWith("P4")) return "P4";
  if (p?.startsWith("P5")) return "P5";
  return p || "P3";
};

interface Props { weekOffset: number; personnelByDay: Record<string, number>; }

export function WOCScheduleReport({ weekOffset, personnelByDay }: Props) {
  const { workOrders } = useWorkOrders();
  const reportRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  const weekStart = startOfWeek(addWeeks(today, weekOffset), { weekStartsOn: 3 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = addDays(weekStart, 6);
  const weekLabel = `W${String(getISOWeek(weekStart)).padStart(2, "0")}`;

  // Build structured data
  const data = useMemo(() => {
    return DISCIPLINES.map((disc) => {
      const byDay = days.map((day) => {
        const dayKey = format(day, "yyyy-MM-dd");
        const wos = workOrders.filter((wo) => {
          if (!wo.scheduled_date || !isSameDay(parseISO(wo.scheduled_date), day)) return false;
          if (!["Scheduled", "Active", "In Progress"].includes(wo.status)) return false;
          return matchesDiscipline(wo, disc.key);
        });
        const hrs = wos.reduce((s, w) => s + getWoHours(w), 0);
        const personnel = personnelByDay[dayKey] ?? 4;
        const avail = personnel * HRS_PER_PERSON;
        return { dayKey, day, wos, hrs, avail, personnel };
      });
      const totalHrs = byDay.reduce((s, d) => s + d.hrs, 0);
      const totalAvail = byDay.reduce((s, d) => s + d.avail, 0);
      const loadPct = totalAvail > 0 ? Math.round((totalHrs / totalAvail) * 100) : 0;
      return { ...disc, byDay, totalHrs, totalAvail, loadPct };
    });
  }, [workOrders, days, personnelByDay]);

  // PDF
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

  const S: Record<string, React.CSSProperties> = {
    th: { padding: "5px 6px", fontSize: 9, fontWeight: 700, borderBottom: "1px solid #d1d5db", textAlign: "left" as const, whiteSpace: "nowrap" as const },
    td: { padding: "4px 6px", fontSize: 9, borderBottom: "1px solid #e5e7eb", verticalAlign: "top" as const },
    badge: { display: "inline-block", padding: "1px 5px", borderRadius: 3, fontSize: 8, fontWeight: 600 },
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "3px solid #C8960C", paddingBottom: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#C8960C", letterSpacing: 2, textTransform: "uppercase" }}>Tennant Creek Gold Mine</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginTop: 1 }}>Weekly Maintenance Schedule</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#C8960C", lineHeight: 1 }}>{weekLabel}</div>
            <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{format(weekStart, "d MMM")} — {format(weekEnd, "d MMM yyyy")}</div>
          </div>
        </div>

        {/* ── SCHEDULE LOAD ── */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          {data.map((disc) => {
            const overTarget = disc.loadPct > disc.target;
            const pctColor = overTarget ? "#dc2626" : disc.accent;
            return (
              <div key={disc.key} style={{ flex: 1, borderRadius: 6, padding: "12px 16px", background: disc.light, border: `1px solid ${disc.accent}22`, position: "relative", overflow: "hidden" }}>
                {/* Accent top strip */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: disc.accent }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 2 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: disc.dark }}>{disc.key}</div>
                    <div style={{ fontSize: 9, color: "#888", marginTop: 1 }}>Target: {disc.target}%</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: pctColor, lineHeight: 1 }}>{disc.loadPct}%</div>
                    <div style={{ fontSize: 8, fontWeight: 600, color: pctColor, marginTop: 1 }}>
                      {overTarget ? "OVER TARGET" : "ON TRACK"}
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 6, borderRadius: 3, background: `${disc.accent}15`, marginTop: 8, overflow: "hidden", position: "relative" }}>
                  <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(disc.loadPct, 100)}%`, background: pctColor, transition: "width 0.3s" }} />
                  {/* Target marker */}
                  <div style={{ position: "absolute", top: -1, bottom: -1, left: `${disc.target}%`, width: 2, background: disc.dark, opacity: 0.4, borderRadius: 1 }} />
                </div>
                {/* Stats row */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: "#666" }}>
                  <span><b style={{ color: "#1a1a1a" }}>{disc.totalHrs.toFixed(1)}h</b> scheduled</span>
                  <span><b style={{ color: "#1a1a1a" }}>{disc.totalAvail.toFixed(1)}h</b> available</span>
                  <span><b style={{ color: "#1a1a1a" }}>{disc.byDay.reduce((a, b) => a + b.wos.length, 0)}</b> jobs</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── DAILY BREAKDOWN PER DISCIPLINE ── */}
        {data.map((disc) => (
          <div key={disc.key} style={{ marginBottom: 20 }}>
            {/* Discipline header */}
            <div style={{ background: disc.dark, color: "#fff", padding: "6px 10px", borderRadius: "4px 4px 0 0", fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
              {disc.key.toUpperCase()}
            </div>

            {/* Day sections */}
            {disc.byDay.map((dayData) => {
              const hasWork = dayData.wos.length > 0;
              return (
                <div key={dayData.dayKey} style={{ borderLeft: `1px solid ${disc.accent}30`, borderRight: `1px solid ${disc.accent}30`, borderBottom: `1px solid ${disc.accent}20` }}>
                  {/* Day bar */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "5px 10px",
                    background: disc.band,
                    borderLeft: `3px solid ${disc.accent}60`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: disc.dark }}>
                        {format(dayData.day, "EEE").toUpperCase()}
                      </span>
                      <span style={{ fontSize: 11, color: "#666" }}>{format(dayData.day, "d MMMM")}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 10 }}>
                      <span style={{ color: "#888" }}>Personnel: <b style={{ color: "#1a1a1a" }}>{dayData.personnel}</b></span>
                      <span style={{ color: "#888" }}>Available: <b style={{ color: "#1a1a1a" }}>{dayData.avail.toFixed(1)}h</b></span>
                      <span style={{ color: "#888" }}>Loaded: <b style={{ color: dayData.hrs > dayData.avail ? "#dc2626" : disc.accent }}>{dayData.hrs.toFixed(1)}h</b></span>
                      <span style={{ color: "#888" }}>Jobs: <b style={{ color: "#1a1a1a" }}>{dayData.wos.length}</b></span>
                    </div>
                  </div>

                  {/* Work order table */}
                  {hasWork ? (
                    <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                      <thead>
                        <tr style={{ background: "#f9fafb" }}>
                          <th style={{ ...S.th, width: 85 }}>WO #</th>
                          <th style={{ ...S.th, width: 42 }}>Type</th>
                          <th style={{ ...S.th, width: 80 }}>Asset</th>
                          <th style={{ ...S.th }}>Description</th>
                          <th style={{ ...S.th, width: 100 }}>Resource</th>
                          <th style={{ ...S.th, width: 55, textAlign: "center" }}>Priority</th>
                          <th style={{ ...S.th, width: 48, textAlign: "right" }}>Hrs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dayData.wos.map((wo, idx) => {
                          const isPM = wo.work_type === "PM";
                          return (
                            <tr key={wo.id} style={{ background: idx % 2 === 1 ? "#fafafa" : "#fff" }}>
                              <td style={S.td}>
                                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 9 }}>{wo.wo_number}</span>
                              </td>
                              <td style={S.td}>
                                <span style={{
                                  ...S.badge,
                                  background: isPM ? "#ecfdf5" : `${disc.accent}12`,
                                  color: isPM ? "#059669" : disc.accent,
                                  border: `1px solid ${isPM ? "#a7f3d0" : disc.accent + "30"}`,
                                }}>
                                  {isPM ? "PM" : wo.work_type || "CM"}
                                </span>
                              </td>
                              <td style={{ ...S.td, fontWeight: 600, fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{wo.asset_id || "—"}</td>
                              <td style={{ ...S.td, fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {wo.problem_description || wo.scope_of_works || "No description"}
                              </td>
                              <td style={{ ...S.td, fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {wo.assigned_to || wo.technician_name || "—"}
                              </td>
                              <td style={{ ...S.td, textAlign: "center", fontWeight: 600, fontSize: 9 }}>
                                {priorityLabel(wo.priority)}
                              </td>
                              <td style={{ ...S.td, textAlign: "right", fontWeight: 700, fontSize: 9, fontFamily: "monospace" }}>
                                {getWoHours(wo).toFixed(1)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ padding: "8px 10px", fontSize: 9, color: "#ccc", fontStyle: "italic" }}>No jobs scheduled</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* ── FOOTER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #e5e7eb", fontSize: 9, color: "#bbb" }}>
          <span>Tennant Creek Gold Mine</span>
          <span>Generated {format(new Date(), "d MMM yyyy, HH:mm")}</span>
          <span>minesite.ai</span>
        </div>
      </div>
    </div>
  );
}
