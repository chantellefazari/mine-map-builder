import { UnscheduledWO, S, getWoHours, priorityLabel } from "./types";

interface Props { items: UnscheduledWO[]; }

export function UnscheduledWorkSection({ items }: Props) {
  if (items.length === 0) {
    return (
      <div style={{ marginBottom: 24 }}>
        <div style={S.sectionTitle}>Not Included in This Week's Schedule</div>
        <div style={{ padding: "10px 14px", fontSize: 10, color: "#16a34a", background: "#f0fdf4", borderRadius: 4, border: "1px solid #bbf7d0" }}>
          All active work orders have been scheduled for this week.
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Not Included in This Week's Schedule</div>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            <th style={{ ...S.th, width: "8%" }}>WO #</th>
            <th style={{ ...S.th, width: "5%" }}>Type</th>
            <th style={{ ...S.th, width: "9%" }}>Asset</th>
            <th style={{ ...S.th, width: "26%" }}>Description</th>
            <th style={{ ...S.th, width: "6%", textAlign: "center" }}>Priority</th>
            <th style={{ ...S.th, width: "18%" }}>Reason Not Scheduled</th>
            <th style={{ ...S.th, width: "22%" }}>Recommended Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.wo.id} style={{ background: idx % 2 === 1 ? "#fafafa" : "#fff" }}>
              <td style={S.td}><span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 9 }}>{item.wo.wo_number}</span></td>
              <td style={S.td}><span style={{ ...S.badge, background: "#f3f4f6", color: "#666", border: "1px solid #d1d5db" }}>{item.wo.work_type || "CM"}</span></td>
              <td style={{ ...S.td, fontWeight: 600, fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.wo.asset_id || "—"}</td>
              <td style={{ ...S.td, fontSize: 9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.wo.problem_description || item.wo.scope_of_works || "No description"}
              </td>
              <td style={{ ...S.td, textAlign: "center", fontWeight: 600, fontSize: 9 }}>{priorityLabel(item.wo.priority)}</td>
              <td style={{ ...S.td, fontSize: 9, color: "#b45309" }}>{item.reason}</td>
              <td style={{ ...S.td, fontSize: 9, color: "#1e40af" }}>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
