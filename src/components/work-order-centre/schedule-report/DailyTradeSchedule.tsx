import { format } from "date-fns";
import { DiscData, DayData, S, getWoHours, priorityLabel, getDayLoadLabel } from "./types";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const JOB_STATUS_OPTIONS = ["", "Completed", "Not Completed", "Re-Scheduled", "Cancelled"] as const;
const WO_STATUS_OPTIONS = ["", "Work Order Returned", "Work Order Not Returned"] as const;

interface Props { data: DiscData[]; }

export function DailyTradeSchedule({ data }: Props) {
  const queryClient = useQueryClient();

  const handleStatusChange = async (woId: string, field: string, value: string) => {
    const updates: Record<string, string> = {};
    if (field === "job_status") updates.job_status = value;
    if (field === "status") updates.status = value;

    const { error } = await (supabase as any)
      .from("work_orders")
      .update(updates)
      .eq("id", woId);

    if (error) {
      toast.error(`Failed to update: ${error.message}`);
    } else {
      queryClient.invalidateQueries({ queryKey: ["work_orders"] });
    }
  };

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
                        <th style={{ ...S.th, width: "7%" }}>WO #</th>
                        <th style={{ ...S.th, width: "4%" }}>Type</th>
                        <th style={{ ...S.th, width: "6%" }}>Asset</th>
                        <th style={{ ...S.th, width: "22%" }}>Description</th>
                        <th style={{ ...S.th, width: "10%" }}>Resource</th>
                        <th style={{ ...S.th, width: "6%", textAlign: "center" }}>Priority</th>
                        <th style={{ ...S.th, width: "5%", textAlign: "right" }}>Hrs</th>
                        <th style={{ ...S.th, width: "12%", textAlign: "center" }}>Job Status</th>
                        <th style={{ ...S.th, width: "12%", textAlign: "center" }}>Work Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayData.wos.map((wo, idx) => (
                        <WORow key={wo.id} wo={wo} idx={idx} disc={disc} onStatusChange={handleStatusChange} />
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

const selectStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 8,
  fontWeight: 600,
  padding: "2px 4px",
  border: "1px solid #e5e7eb",
  borderRadius: 3,
  background: "#fff",
  cursor: "pointer",
  color: "#1a1a1a",
};

function getJobStatusColor(status: string): string {
  switch (status) {
    case "Completed": return "#16a34a";
    case "Not Completed": return "#dc2626";
    case "Re-Scheduled": return "#d97706";
    case "Cancelled": return "#6b7280";
    default: return "#1a1a1a";
  }
}

function getWoStatusColor(status: string): string {
  switch (status) {
    case "Scheduled": return "#2563eb";
    case "Active": return "#16a34a";
    case "On Hold": return "#d97706";
    case "Completed": return "#059669";
    case "Closed": return "#6b7280";
    default: return "#1a1a1a";
  }
}

function WORow({ wo, idx, disc, onStatusChange }: { wo: WorkOrder; idx: number; disc: DiscData; onStatusChange: (id: string, field: string, value: string) => void }) {
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
      <td style={{ ...S.td, textAlign: "center", padding: "2px 4px" }}>
        <select
          style={{ ...selectStyle, color: getJobStatusColor(wo.job_status || "") }}
          value={wo.job_status || ""}
          onChange={(e) => onStatusChange(wo.id, "job_status", e.target.value)}
        >
          {JOB_STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt} style={{ color: getJobStatusColor(opt) }}>
              {opt || "—"}
            </option>
          ))}
        </select>
      </td>
      <td style={{ ...S.td, textAlign: "center", padding: "2px 4px" }}>
        <select
          style={{ ...selectStyle, color: getWoStatusColor(wo.status || "") }}
          value={wo.status || ""}
          onChange={(e) => onStatusChange(wo.id, "status", e.target.value)}
        >
          {WO_STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt} style={{ color: getWoStatusColor(opt) }}>
              {opt || "—"}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}
