import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

const mockAreas = [
  { area: "Crushing", values: [95, 88, 92, 100, 78, 90, 85, 93] },
  { area: "Grinding", values: [100, 100, 95, 90, 88, 92, 96, 94] },
  { area: "CIL", values: [80, 85, 78, 82, 90, 88, 84, 87] },
  { area: "Utilities", values: [100, 100, 100, 95, 100, 98, 100, 100] },
  { area: "Flotation", values: [90, 92, 88, 85, 80, 82, 86, 90] },
];

const statusLabel = (v: number) => {
  if (v >= 90) return { text: "On Track", cls: "bg-emerald-500/10 text-emerald-700" };
  if (v >= 75) return { text: "At Risk", cls: "bg-amber-500/10 text-amber-700" };
  return { text: "Behind", cls: "bg-destructive/10 text-destructive" };
};

export function WOCComplianceTab() {
  const overall =
    mockAreas.reduce(
      (sum, a) => sum + a.values.reduce((s, v) => s + v, 0) / a.values.length,
      0
    ) / mockAreas.length;

  return (
    <div className="space-y-4 mt-2">
      {/* Overall */}
      <div className="flex items-center gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xl font-bold text-foreground">{Math.round(overall)}%</p>
              <p className="text-[10px] text-muted-foreground">Overall PM Compliance (8-week avg)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly table */}
      <div className="border border-border rounded-lg overflow-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-3 py-2 font-semibold">Area</th>
              {WEEKS.map((w) => (
                <th key={w} className="text-center px-2 py-2 font-semibold">{w}</th>
              ))}
              <th className="text-center px-3 py-2 font-semibold">Avg</th>
              <th className="text-center px-3 py-2 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockAreas.map((a) => {
              const avg = Math.round(a.values.reduce((s, v) => s + v, 0) / a.values.length);
              const st = statusLabel(avg);
              return (
                <tr key={a.area} className="border-b border-border last:border-b-0">
                  <td className="px-3 py-2 font-medium">{a.area}</td>
                  {a.values.map((v, i) => (
                    <td key={i} className="text-center px-2 py-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${v >= 90 ? "text-emerald-700" : v >= 75 ? "text-amber-700" : "text-destructive"}`}>
                        {v}%
                      </span>
                    </td>
                  ))}
                  <td className="text-center px-3 py-2 font-semibold">{avg}%</td>
                  <td className="text-center px-3 py-2">
                    <Badge variant="outline" className={`text-[9px] ${st.cls}`}>{st.text}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Rolling compliance trends and missed-PM detail views coming soon.
      </p>
    </div>
  );
}
