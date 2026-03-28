import { DiscData, S } from "./types";

interface Props {
  totalJobs: number;
  totalPMs: number;
  totalReactive: number;
  totalHrs: number;
  totalAvail: number;
  overallLoadPct: number;
  highPriScheduled: number;
}

export function ReadinessSnapshot(props: Props) {
  const planned = props.totalJobs - props.totalPMs - props.totalReactive;

  const metrics = [
    { label: "Total Jobs", value: props.totalJobs },
    { label: "PMs Scheduled", value: props.totalPMs },
    { label: "Planned Corrective", value: planned },
    { label: "Reactive / Breakdown", value: props.totalReactive },
    { label: "Scheduled Hours", value: `${props.totalHrs.toFixed(1)}h` },
    { label: "Available Hours", value: `${props.totalAvail.toFixed(1)}h` },
    { label: "Weekly Load", value: `${props.overallLoadPct}%` },
    { label: "High Priority Jobs", value: props.highPriScheduled },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Weekly Schedule Summary</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {metrics.map((m) => (
          <div key={m.label} style={{
            padding: "10px 14px", borderRadius: 4,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: 8, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginTop: 2 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
