import { QualityCheck, S } from "./types";

const statusColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  green: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", dot: "#16a34a" },
  amber: { bg: "#fffbeb", border: "#fde68a", text: "#92400e", dot: "#d97706" },
  red: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", dot: "#dc2626" },
};

interface Props { checks: QualityCheck[]; }

export function QualityChecksSection({ checks }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Schedule Quality Checks</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {checks.map((c, i) => {
          const col = statusColors[c.status];
          return (
            <div key={i} style={{
              padding: "8px 12px", borderRadius: 4,
              background: col.bg, border: `1px solid ${col.border}`,
              display: "flex", alignItems: "flex-start", gap: 8,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.dot, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 9, fontWeight: 700, color: col.text }}>{c.label}</div>
                <div style={{ fontSize: 8, color: col.text, opacity: 0.8, marginTop: 1 }}>{c.detail}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
