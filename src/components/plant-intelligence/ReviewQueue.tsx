import { PlantRule } from "@/hooks/usePlantIntelligence";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Pencil, Archive, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Props {
  rules: PlantRule[];
  onUpdate: (id: string, status: string) => void;
  isUpdating: boolean;
}

const impactIcon: Record<string, string> = {
  Critical: "text-red-500",
  High: "text-orange-500",
  Medium: "text-amber-500",
  Low: "text-emerald-500",
};

export function ReviewQueue({ rules, onUpdate, isUpdating }: Props) {
  const reviewable = rules.filter((r) => r.status === "Draft" || r.status === "Pending Review");

  if (reviewable.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <CheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400" />
        <p className="font-medium">All caught up</p>
        <p className="text-sm mt-1">No rules pending review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <p className="text-sm text-muted-foreground">{reviewable.length} rule{reviewable.length !== 1 ? "s" : ""} awaiting review</p>
      {reviewable.map((r) => (
        <Card key={r.id} className="border">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{r.status}</Badge>
                  <Badge variant="outline" className="text-xs">{r.rule_type}</Badge>
                  <AlertTriangle className={`w-3.5 h-3.5 ${impactIcon[r.impact_level] ?? ""}`} />
                  <span className="text-xs text-muted-foreground">{r.impact_level}</span>
                </div>
                <p className="font-semibold text-foreground">{r.title}</p>
                {r.area && <p className="text-xs text-muted-foreground mt-0.5">{r.area} {r.asset ? `• ${r.asset}` : ""}</p>}
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(r.created_at), "dd MMM yyyy")}
              </p>
            </div>

            {(r.if_condition || r.then_action || r.because_reason) && (
              <div className="bg-muted/30 rounded p-3 text-sm space-y-1">
                {r.if_condition && <p><span className="font-semibold text-primary">IF</span> {r.if_condition}</p>}
                {r.then_action && <p><span className="font-semibold text-primary">THEN</span> {r.then_action}</p>}
                {r.because_reason && <p><span className="font-semibold text-primary">BECAUSE</span> {r.because_reason}</p>}
              </div>
            )}

            {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}

            <div className="flex gap-2 pt-1">
              <Button size="sm" onClick={() => onUpdate(r.id, "Approved")} disabled={isUpdating} className="gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => onUpdate(r.id, "Pending Review")} disabled={isUpdating || r.status === "Pending Review"} className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" /> Mark for Review
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onUpdate(r.id, "Archived")} disabled={isUpdating} className="gap-1.5 text-muted-foreground">
                <Archive className="w-3.5 h-3.5" /> Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
