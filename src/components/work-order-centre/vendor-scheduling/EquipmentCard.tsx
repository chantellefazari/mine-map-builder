import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, FileText, Gauge, CheckCircle2, Wrench } from "lucide-react";
import { EquipmentService } from "@/hooks/useEquipmentServices";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";

const STATUS_STYLES: Record<string, string> = {
  OK: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "Due Soon": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Overdue: "bg-red-500/10 text-red-600 border-red-500/20",
};

interface Props {
  item: EquipmentService;
  onUpdate: (args: { id: string; updates: Partial<EquipmentService> }) => void;
  onDelete: (id: string) => void;
  onUpdateHours: (args: { id: string; currentHours: number; interval: number; lastServiceHours: number }) => void;
  onRecordService: (args: { id: string; serviceHours: number; interval: number }) => void;
}

export function EquipmentCard({ item, onUpdate, onDelete, onUpdateHours, onRecordService }: Props) {
  const [editHours, setEditHours] = useState(false);
  const [hours, setHours] = useState(String(item.current_hours));

  const remaining = item.next_service_due_hours - item.current_hours;
  const progress = item.service_interval_hours > 0
    ? Math.min(100, ((item.current_hours - item.last_service_hours) / item.service_interval_hours) * 100)
    : 0;

  const handleSaveHours = () => {
    const val = Number(hours);
    if (!isNaN(val) && val >= 0) {
      onUpdateHours({ id: item.id, currentHours: val, interval: item.service_interval_hours, lastServiceHours: item.last_service_hours });
    }
    setEditHours(false);
  };

  const handleRecordService = () => {
    onRecordService({ id: item.id, serviceHours: item.current_hours, interval: item.service_interval_hours });
  };

  return (
    <div className={cn(
      "border rounded-lg bg-card p-4",
      item.status === "Overdue" ? "border-red-500/30" : item.status === "Due Soon" ? "border-amber-500/30" : "border-border"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground truncate">{item.equipment_name}</h4>
            {item.asset_number && <span className="text-[10px] text-muted-foreground font-mono">{item.asset_number}</span>}
            <Badge variant="outline" className={cn("text-[10px] h-5", STATUS_STYLES[item.status])}>
              {item.status}
            </Badge>
          </div>

          {/* Hours bar */}
          <div className="mt-2 mb-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                Current: <strong className="text-foreground">{item.current_hours.toLocaleString()} hrs</strong>
              </span>
              <span>
                Next service: <strong className="text-foreground">{item.next_service_due_hours.toLocaleString()} hrs</strong>
                {remaining > 0 ? ` (${remaining.toLocaleString()} hrs remaining)` : ` (${Math.abs(remaining).toLocaleString()} hrs overdue)`}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all",
                  item.status === "Overdue" ? "bg-red-500" : item.status === "Due Soon" ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
              <span>Last: {item.last_service_hours.toLocaleString()} hrs</span>
              <span>Interval: every {item.service_interval_hours.toLocaleString()} hrs</span>
            </div>
          </div>

          {/* Vendor + last service date */}
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><Wrench className="w-3 h-3" />{item.service_vendor}</span>
            {item.last_service_date && (
              <span>Last serviced: {format(parseISO(item.last_service_date), "d MMM yyyy")}</span>
            )}
          </div>

          {/* Forms */}
          {item.forms_required.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.forms_required.map((f) => (
                <Badge key={f} variant="secondary" className="text-[9px] h-4 gap-1">
                  <FileText className="w-2.5 h-2.5" />{f}
                </Badge>
              ))}
            </div>
          )}

          {item.notes && <p className="text-[10px] text-muted-foreground mt-1.5 italic">{item.notes}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {editHours ? (
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="h-7 w-20 text-[10px]"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleSaveHours()}
              />
              <Button size="sm" variant="outline" className="h-7 text-[10px] px-2" onClick={handleSaveHours}>Save</Button>
            </div>
          ) : (
            <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => { setHours(String(item.current_hours)); setEditHours(true); }}>
              <Gauge className="w-3 h-3" /> Update Hours
            </Button>
          )}
          <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 text-emerald-600 hover:text-emerald-700" onClick={handleRecordService}>
            <CheckCircle2 className="w-3 h-3" /> Record Service
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(item.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
