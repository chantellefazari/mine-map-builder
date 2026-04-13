import { useState, useCallback } from "react";
import { X, Wrench, Clock, Package, ListChecks, ShieldAlert, Hash, MapPin, Calendar, User, FileText, Save, CalendarDays, ChevronsRight, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { format, addDays, parseISO } from "date-fns";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  item: PlannerItem;
  onClose: () => void;
}

const WO_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
  PM: { bg: "bg-blue-500/10", text: "text-blue-700" },
  Planned: { bg: "bg-emerald-500/10", text: "text-emerald-700" },
  Breakdown: { bg: "bg-red-500/10", text: "text-red-700" },
  Shutdown: { bg: "bg-amber-500/10", text: "text-amber-700" },
};

function DetailSection({ title, icon: Icon, children, empty }: { title: string; icon: React.ElementType; children?: React.ReactNode; empty?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {title}
      </div>
      {children || <p className="text-[11px] text-muted-foreground/60 italic">{empty || "None specified"}</p>}
    </div>
  );
}

export function PlannerItemDetail({ item, onClose }: Props) {
  const { update } = useWorkOrders();
  const typeStyle = WO_TYPE_STYLES[item.woType] || { bg: "", text: "" };
  const isWO = item.source === "wo";

  const [pushDays, setPushDays] = useState(7);

  // Update a field on the work order
  const updateField = useCallback(async (field: string, value: any) => {
    if (!isWO) {
      toast.error("PM templates are updated from the PM module");
      return;
    }
    try {
      await update.mutateAsync({
        id: item.sourceId,
        updates: { [field]: value } as any,
      });
      toast.success(`Updated ${field}`);
    } catch { /* handled */ }
  }, [isWO, item.sourceId, update]);

  // Set scheduled date
  const setDate = useCallback(async (date: Date | undefined) => {
    const dateStr = date ? format(date, "yyyy-MM-dd") : null;
    await updateField("scheduled_date", dateStr);
  }, [updateField]);

  // Push date by N days
  const pushDate = useCallback(async () => {
    const currentDate = item.scheduledDate ? parseISO(item.scheduledDate) : new Date();
    const newDate = addDays(currentDate, pushDays);
    await updateField("scheduled_date", format(newDate, "yyyy-MM-dd"));
  }, [item.scheduledDate, pushDays, updateField]);

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0 shrink-0", typeStyle.bg, typeStyle.text)}>
            {item.woType} · {item.woTypeCode}
          </Badge>
          {item.woNumber && (
            <span className="text-xs font-mono font-bold text-foreground">{item.woNumber}</span>
          )}
          <span className="text-xs text-foreground font-semibold truncate">{item.taskName}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Schedule Actions — prominent */}
          {isWO && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                <CalendarDays className="w-3.5 h-3.5" />
                Schedule & Revisions
              </div>

              {/* Current date display + picker */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-20">Scheduled:</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn(
                      "text-xs font-medium px-2.5 py-1 rounded border transition-colors",
                      item.scheduledDate
                        ? "text-foreground border-border hover:border-primary/50 bg-card"
                        : "text-muted-foreground/50 border-dashed border-border hover:border-primary/50"
                    )}>
                      {item.scheduledDate || "Not scheduled — click to set"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="single"
                      selected={item.scheduledDate ? parseISO(item.scheduledDate) : undefined}
                      onSelect={setDate}
                    />
                    {item.scheduledDate && (
                      <div className="p-2 border-t border-border">
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full" onClick={() => setDate(undefined)}>
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              {/* Push by N days */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20">Push by:</span>
                <Input
                  type="number"
                  value={pushDays}
                  onChange={(e) => setPushDays(Number(e.target.value))}
                  className="w-16 h-7 text-xs text-center"
                />
                <span className="text-[10px] text-muted-foreground">days</span>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={pushDate}>
                  <ChevronsRight className="w-3 h-3" /> Push
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1" onClick={() => { setPushDays(-pushDays); }}>
                  <ArrowRightLeft className="w-3 h-3" /> Reverse
                </Button>
              </div>

              {/* Quick status change */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20">Status:</span>
                <Select value={item.status} onValueChange={(v) => updateField("status", v)}>
                  <SelectTrigger className="h-7 w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick priority change */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20">Priority:</span>
                <Select value={item.priority} onValueChange={(v) => updateField("priority", v)}>
                  <SelectTrigger className="h-7 w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Asset re-assignment */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20">Asset:</span>
                <Input
                  defaultValue={item.assetNumber}
                  onBlur={(e) => {
                    if (e.target.value !== item.assetNumber) {
                      updateField("asset_id", e.target.value);
                    }
                  }}
                  className="h-7 w-40 text-xs font-mono"
                  placeholder="Asset number"
                />
                <span className="text-[9px] text-muted-foreground">Updates WO + linked systems</span>
              </div>

              {/* Trade re-assignment */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-20">Trade:</span>
                <Select value={item.trade || "Mechanical"} onValueChange={(v) => updateField("trade", v)}>
                  <SelectTrigger className="h-7 w-36 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <InfoField icon={Hash} label="Asset Number" value={item.assetNumber} />
            <InfoField icon={MapPin} label="Area" value={`${item.area}${item.subArea ? ` / ${item.subArea}` : ""}`} />
            <InfoField icon={Wrench} label="Discipline" value={item.discipline} />
            <InfoField icon={User} label="Assigned To" value={item.assignedTo} />
            <InfoField icon={Clock} label="Frequency" value={item.frequency} />
            <InfoField icon={Clock} label="Est. Hours" value={item.estimatedHours > 0 ? `${item.estimatedHours}h` : "—"} />
            <InfoField icon={Calendar} label="Scheduled" value={item.scheduledDate || "Not scheduled"} />
            <InfoField icon={FileText} label="Duty Type" value={item.dutyType} />
          </div>

          {/* Task List */}
          <DetailSection title="Task List" icon={ListChecks}>
            {item.tasks.length > 0 ? (
              <div className="space-y-1 border border-border rounded-md overflow-hidden">
                {item.tasks.map((task: any, i: number) => (
                  <div key={i} className={cn("flex items-start gap-2 px-3 py-1.5 text-[11px]", i % 2 === 0 ? "bg-muted/10" : "")}>
                    <span className="text-[9px] font-mono text-muted-foreground w-5 shrink-0 pt-0.5">{i + 1}.</span>
                    <span className="text-foreground">{typeof task === "string" ? task : task.description || task.task || JSON.stringify(task)}</span>
                  </div>
                ))}
              </div>
            ) : undefined}
          </DetailSection>

          {/* Materials / Parts */}
          <DetailSection title="Material List" icon={Package}>
            {item.materialList.length > 0 && item.materialList.some(m => m) ? (
              <div className="flex flex-wrap gap-1.5">
                {item.materialList.filter(Boolean).map((m, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5 font-normal">
                    {m}
                  </Badge>
                ))}
              </div>
            ) : undefined}
          </DetailSection>

          {/* Required Tools */}
          <DetailSection title="Required Tools" icon={Wrench}>
            {item.requiredTools.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {item.requiredTools.map((t, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : undefined}
          </DetailSection>

          {/* Safety Notes */}
          <DetailSection title="Safety Notes" icon={ShieldAlert}>
            {item.safetyNotes.length > 0 ? (
              <div className="space-y-1">
                {item.safetyNotes.map((note, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px]">
                    <ShieldAlert className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-foreground">{note}</span>
                  </div>
                ))}
              </div>
            ) : undefined}
          </DetailSection>
        </div>
      </ScrollArea>
    </div>
  );
}

function InfoField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-muted-foreground shrink-0" />
      <span className="text-[10px] text-muted-foreground w-20 shrink-0">{label}</span>
      <span className="text-[11px] text-foreground font-medium truncate">{value || "—"}</span>
    </div>
  );
}