import { S } from "./types";

export function SchedulerNotes() {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={S.sectionTitle}>Scheduler Notes / Weekly Constraints</div>
      <div style={{
        border: "1px solid #d1d5db", borderRadius: 4, padding: "14px 16px",
        minHeight: 80, background: "#fafafa",
      }}>
        <div style={{ fontSize: 9, color: "#bbb", fontStyle: "italic" }}>
          Labour limitations, access restrictions, shutdown conflicts, reactive carryover, parts constraints, planning assumptions...
        </div>
        {/* Blank lines for handwriting on print */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ borderBottom: "1px solid #e5e7eb", height: 22 }} />
        ))}
      </div>
    </div>
  );
}
