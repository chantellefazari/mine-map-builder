import { DiscData, QualityCheck, S } from "./types";

interface Props {
  data: DiscData[];
  totalJobs: number;
  totalPMs: number;
  totalReactive: number;
  totalHrs: number;
  totalAvail: number;
  overallLoadPct: number;
  highPriScheduled: number;
  highPriNotScheduled: number;
  qualityChecks: QualityCheck[];
}

function getReadyStatus(checks: QualityCheck[]): { label: string; bg: string; color: string } {
  const reds = checks.filter(c => c.status === "red").length;
  const ambers = checks.filter(c => c.status === "amber").length;
  if (reds > 0) return { label: "Not Ready", bg: "#fef2f2", color: "#dc2626" };
  if (ambers > 2) return { label: "Ready with Risks", bg: "#fffbeb", color: "#d97706" };
  return { label: "Ready to Issue", bg: "#f0fdf4", color: "#16a34a" };
}

export function ReadinessSnapshot(props: Props) {
  const ready = getReadyStatus(props.qualityChecks);
  const risksCount = props.qualityChecks.filter(c => c.status !== "green").length;

  const metrics = [
    { label: "Total Jobs", value: props.totalJobs },
    { label: "PMs Scheduled", value: props.totalPMs },
    { label: "Reactive / Breakdown", value: props.totalReactive },
    { label: "Scheduled Hours", value: `${props.totalHrs.toFixed(1)}h` },
    { label: "Available Hours", value: `${props.totalAvail.toFixed(1)}h` },
    { label: "Weekly Load", value: `${props.overallLoadPct}%` },
    { label: "High Priority Scheduled", value: props.highPriScheduled },
    { label: "High Priority Not Scheduled", value: props.highPriNotScheduled, highlight: props.highPriNotScheduled > 0 },
    { label: "Risks Identified", value: risksCount, highlight: risksCount > 0 },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Schedule Readiness Snapshot</div>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        {/* Ready status badge */}
        <div style={{
          flex: "0 0 180px", borderRadius: 6, padding: "16px 20px",
          background: ready.bg, border: `2px solid ${ready.color}`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Week Status</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: ready.color, lineHeight: 1.1 }}>{ready.label}</div>
        </div>

        {/* Metrics grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {metrics.map((m) => (
            <div key={m.label} style={{
              padding: "8px 12px", borderRadius: 4,
              background: m.highlight ? "#fef2f2" : "#f9fafb",
              border: `1px solid ${m.highlight ? "#fecaca" : "#e5e7eb"}`,
            }}>
              <div style={{ fontSize: 8, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.5 }}>{m.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: m.highlight ? "#dc2626" : "#1a1a1a", marginTop: 1 }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
