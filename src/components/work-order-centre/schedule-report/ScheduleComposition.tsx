import { S } from "./types";

interface Props {
  pmPct: number;
  plannedPct: number;
  reactivePct: number;
  pmCount: number;
  plannedCount: number;
  reactiveCount: number;
  totalJobs: number;
}

export function ScheduleComposition({ pmPct, plannedPct, reactivePct, pmCount, plannedCount, reactiveCount, totalJobs }: Props) {
  const bars = [
    { label: "Preventive Maintenance", pct: pmPct, count: pmCount, color: "#16a34a" },
    { label: "Planned Corrective", pct: plannedPct, count: plannedCount, color: "#2563eb" },
    { label: "Reactive / Breakdown", pct: reactivePct, count: reactiveCount, color: "#dc2626" },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Weekly Schedule Composition</div>
      <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
        {/* Stacked bar */}
        <div style={{ flex: "0 0 200px" }}>
          <div style={{ height: 160, display: "flex", flexDirection: "column", borderRadius: 4, overflow: "hidden", border: "1px solid #e5e7eb" }}>
            {bars.map(b => (
              <div key={b.label} style={{
                flex: `${b.pct} 0 0`, background: b.color, minHeight: b.pct > 0 ? 20 : 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontSize: 10, fontWeight: 700,
              }}>
                {b.pct > 8 ? `${b.pct}%` : ""}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 8, color: "#888", textAlign: "center", marginTop: 4 }}>{totalJobs} total jobs</div>
        </div>
        {/* Legend cards */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
          {bars.map(b => (
            <div key={b.label} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
              borderRadius: 4, background: "#f9fafb", border: "1px solid #e5e7eb",
            }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: b.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#1a1a1a" }}>{b.label}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: b.color }}>{b.pct}%</div>
              <div style={{ fontSize: 9, color: "#888", minWidth: 50 }}>{b.count} jobs</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
