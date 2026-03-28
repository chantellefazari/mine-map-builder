import { format } from "date-fns";
import { DiscData, DayData, S, getWoHours, priorityLabel, getDayLoadLabel } from "./types";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Props { data: DiscData[]; }

export function DailyTradeSchedule({ data }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Daily Trade Schedule</div>
      {data.map((disc) => (
        <div key={disc.key} style={{ marginBottom: 18 }}>
          <div style={{
            background: disc.dark, color: "#fff", padding: "6px 12px",
            borderRadius: "4px 4px 0 0", fontSize: 11, fontWeight: 700, letterSpacing: 1,
          }}>
            {disc.key.toUpperCase()}
          </div>

          {disc.byDay.map((dayData) => {
            const hasWork = dayData.wos.length > 0;
            const loadInfo = getDayLoadLabel(dayData.loadPct, disc.target);
            return (
              <div key={dayData.dayKey} style={{ borderLeft: `1px solid ${disc.accent}30`, borderRight: `1px solid ${disc.accent}30`, borderBottom: `1px solid ${disc.accent}20` }}>
                {/* Day bar */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "5px 12px", background: disc.band, borderLeft: `3px solid ${disc.accent}60`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: disc.dark }}>{format(dayData.day, "EEE").toUpperCase()}</span>
                    <span style={{ fontSize: 11, color: "#666" }}>{format(dayData.day, "d MMMM")}</span>
                    <span style={{
                      display: "inline-block", padding: "1px 6px", borderRadius: 3,
                      fontSize: 8, fontWeight: 700, letterSpacing: 0.3,
                      background: `${loadInfo.color}15`, color: loadInfo.color,
                      border: `1px solid ${loadInfo.color}40`, textTransform: "uppercase",
                    }}>
                      {loadInfo.label}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: 10 }}>
                    <span style={{ color: "#888" }}>Personnel: <b style={{ color: "#1a1a1a" }}>{dayData.personnel}</b></span>
                    <span style={{ color: "#888" }}>Available: <b style={{ color: "#1a1a1a" }}>{dayData.avail.toFixed(1)}h</b></span>
                    <span style={{ color: "#888" }}>Scheduled: <b style={{ color: loadInfo.color }}>{dayData.hrs.toFixed(1)}h</b></span>
                    <span style={{ color: "#888" }}>Load: <b style={{ color: loadInfo.color }}>{dayData.loadPct}%</b></span>
                    <span style={{ color: "#888" }}>Jobs: <b style={{ color: "#1a1a1a" }}>{dayData.wos.length}</b></span>
                  </div>
                </div>

                {hasWork ? (
                  <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <th style={{ ...S.th, width: "8%" }}>WO #</th>
                        <th style={{ ...S.th, width: "5%" }}>Type</th>
                        <th style={{ ...S.th, width: "7%" }}>Asset</th>
                        <th style={{ ...S.th, width: "26%" }}>Description</th>
                        <th style={{ ...S.th, width: "12%" }}>Resource</th>
                        <th style={{ ...S.th, width: "7%", textAlign: "center" }}>Priority</th>
                        <th style={{ ...S.th, width: "5%", textAlign: "right" }}>Hrs</th>
                        <th style={{ ...S.th, width: "15%", textAlign: "center" }}>Job Status</th>
                        <th style={{ ...S.th, width: "15%", textAlign: "center" }}>Work Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayData.wos.map((wo, idx) => (
                        <WORow key={wo.id} wo={wo} idx={idx} disc={disc} />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ padding: "6px 12px", fontSize: 9, color: "#bbb", fontStyle: "italic", background: "#fafafa" }}>
                    No work scheduled for this day
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function WORow({ wo, idx, disc }: { wo: WorkOrder; idx: number; disc: DiscData }) {
  const isPM = wo.work_type === "PM";
  return (
    <tr style={{ background: idx % 2 === 1 ? "#fafafa" : "#fff" }}>
      <td style={S.td}><span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 9 }}>{wo.wo_number}</span></td>
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
      <td style={{ ...S.td, textAlign: "center", fontWeight: 600, fontSize: 9 }}>{priorityLabel(wo.priority)}</td>
      <td style={{ ...S.td, textAlign: "right", fontWeight: 700, fontSize: 9, fontFamily: "monospace" }}>{getWoHours(wo).toFixed(1)}</td>
      <td style={{ ...S.td, borderBottom: "1px dotted #ccc", minHeight: 20 }}>&nbsp;</td>
      <td style={{ ...S.td, borderBottom: "1px dotted #ccc", minHeight: 20 }}>&nbsp;</td>
    </tr>
  );
}
