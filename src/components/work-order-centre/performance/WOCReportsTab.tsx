import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkOrder } from "@/hooks/useWorkOrders";
import { FileDown, Printer } from "lucide-react";
import { toast } from "sonner";

interface Props {
  workOrders: WorkOrder[];
}

const statBucket = (status: string) => {
  const s = status?.toLowerCase() ?? "";
  if (["completed", "complete", "closed"].includes(s)) return "completed";
  if (["active", "in progress"].includes(s)) return "inProgress";
  if (["draft", "planning", "open"].includes(s)) return "open";
  if (s === "on hold") return "onHold";
  if (s === "ready") return "ready";
  return "other";
};

export function WOCReportsTab({ workOrders }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const stats = useMemo(() => {
    let list = workOrders;
    if (from) list = list.filter((wo) => wo.date_raised >= from);
    if (to) list = list.filter((wo) => wo.date_raised <= to);

    const buckets = { total: list.length, completed: 0, inProgress: 0, open: 0, onHold: 0, ready: 0, other: 0 };
    list.forEach((wo) => {
      const b = statBucket(wo.status);
      buckets[b as keyof typeof buckets]++;
    });
    return buckets;
  }, [workOrders, from, to]);

  const tiles: { label: string; value: number; color: string }[] = [
    { label: "Total Work Orders", value: stats.total, color: "bg-muted" },
    { label: "Completed", value: stats.completed, color: "bg-emerald-500/10" },
    { label: "In Progress", value: stats.inProgress, color: "bg-blue-500/10" },
    { label: "Open / Assigned", value: stats.open, color: "bg-amber-500/10" },
    { label: "Ready", value: stats.ready, color: "bg-cyan-500/10" },
    { label: "On Hold", value: stats.onHold, color: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-4 mt-2">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          From
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="h-7 w-36 text-xs" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          To
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="h-7 w-36 text-xs" />
        </div>
        <div className="ml-auto flex gap-1.5">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.info("PDF export coming soon")}>
            <FileDown className="w-3 h-3" /> PDF
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toast.info("Excel export coming soon")}>
            <FileDown className="w-3 h-3" /> Excel
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => window.print()}>
            <Printer className="w-3 h-3" /> Print
          </Button>
        </div>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {tiles.map((t) => (
          <Card key={t.label} className={`${t.color} border-border`}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{t.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{t.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">Detailed reporting with department and area breakdowns coming soon.</p>
    </div>
  );
}
