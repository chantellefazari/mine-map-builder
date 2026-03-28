import { DiscData, getCapacityColor, S } from "./types";

interface Props { data: DiscData[]; }

export function TradeCapacitySummary({ data }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Trade Capacity Summary</div>
      <div style={{ display: "flex", gap: 16 }}>
        {data.map((disc) => {
          const statusColor = getCapacityColor(disc.capacityStatus);
          return (
            <div key={disc.key} style={{
              flex: 1, borderRadius: 6, padding: "14px 18px",
              background: disc.light, border: `1px solid ${disc.accent}22`,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: disc.accent }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 2 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: disc.dark }}>{disc.key}</div>
                  <div style={{ fontSize: 9, color: "#888", marginTop: 2 }}>Target: {disc.target}%</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: statusColor, lineHeight: 1 }}>{disc.loadPct}%</div>
                  <div style={{
                    display: "inline-block", marginTop: 3, padding: "2px 8px", borderRadius: 3,
                    fontSize: 8, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
                    background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}40`,
                  }}>
                    {disc.capacityStatus}
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, borderRadius: 3, background: `${disc.accent}15`, marginTop: 10, overflow: "hidden", position: "relative" }}>
                <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(disc.loadPct, 100)}%`, background: statusColor, transition: "width 0.3s" }} />
                <div style={{ position: "absolute", top: -1, bottom: -1, left: `${disc.target}%`, width: 2, background: disc.dark, opacity: 0.4, borderRadius: 1 }} />
              </div>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 10, fontSize: 9 }}>
                {[
                  { l: "Scheduled Hours", v: `${disc.totalHrs.toFixed(1)}h` },
                  { l: "Available Hours", v: `${disc.totalAvail.toFixed(1)}h` },
                  { l: "Jobs", v: disc.totalJobs },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ color: "#999", fontSize: 8 }}>{s.l}</div>
                    <div style={{ fontWeight: 700, color: "#1a1a1a" }}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
