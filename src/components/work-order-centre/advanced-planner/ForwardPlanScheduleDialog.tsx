import { useState, useEffect } from "react";
import { format, addDays, parseISO } from "date-fns";
import { Calendar, ChevronsRight, ArrowRightLeft, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";

interface Props {
  item: PlannerItem | null;
  initialDate?: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** For PM items: adjust the anchor offset by N days (cascades all future occurrences) */
  onAdjustPM?: (pmSourceId: string, daysDelta: number) => void;
}

export function ForwardPlanScheduleDialog({ item, initialDate, open, onOpenChange, onAdjustPM }: Props) {
  const { update } = useWorkOrders();
  const [pushDays, setPushDays] = useState(7);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
  const [isCascading, setIsCascading] = useState(false);

  // Reset state when item changes
  useEffect(() => {
    setSelectedDate(initialDate);
    setPushDays(7);
  }, [initialDate, item?.sourceId]);

  if (!item) return null;

  const isWO = item.source === "wo";
  const isPM = item.source === "pm";

  const handleSetDate = async (date: Date | undefined) => {
    setSelectedDate(date);
    if (isWO) {
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { scheduled_date: date ? format(date, "yyyy-MM-dd") : null } as any,
        });
        toast.success("Schedule updated");
      } catch { /* handled */ }
    }
  };

  /** Push the schedule by N days — works for both WOs and PMs */
  const handlePush = async () => {
    const base = selectedDate || (item.scheduledDate ? parseISO(item.scheduledDate) : new Date());
    const newDate = addDays(base, pushDays);
    setSelectedDate(newDate);

    if (isPM) {
      setIsCascading(true);
      try {
        // 1. Adjust the PM anchor offset (moves all projected occurrences)
        onAdjustPM?.(item.sourceId, pushDays);

        // 2. Cascade: push all existing future WOs linked to this PM
        const today = format(new Date(), "yyyy-MM-dd");
        const pmPattern = `PM: ${item.taskName} (${item.frequency})`;
        
        const { data: futureWOs, error: fetchErr } = await supabase
          .from("work_orders")
          .select("id, scheduled_date")
          .eq("work_type", "PM")
          .eq("problem_description", pmPattern)
          .gte("scheduled_date", today)
          .neq("status", "Completed");

        if (!fetchErr && futureWOs && futureWOs.length > 0) {
          let cascaded = 0;
          for (const wo of futureWOs) {
            const woDate = wo.scheduled_date ? parseISO(wo.scheduled_date) : new Date();
            const pushed = addDays(woDate, pushDays);
            const { error: upErr } = await supabase
              .from("work_orders")
              .update({ scheduled_date: format(pushed, "yyyy-MM-dd") })
              .eq("id", wo.id);
            if (!upErr) cascaded++;
          }
          toast.success(`PM pushed ${pushDays} days — ${cascaded} future work order${cascaded !== 1 ? "s" : ""} cascaded`);
        } else {
          toast.success(`PM schedule pushed ${pushDays} days — all future occurrences moved`);
        }
      } catch {
        toast.error("Failed to cascade push");
      } finally {
        setIsCascading(false);
      }
      return;
    }

    // WO push
    try {
      await update.mutateAsync({
        id: item.sourceId,
        updates: { scheduled_date: format(newDate, "yyyy-MM-dd") } as any,
      });
      toast.success(`Schedule pushed to ${format(newDate, "dd MMM yyyy")}`);
    } catch { /* handled */ }
  };

  const handleStatusChange = async (status: string) => {
    if (!isWO) return;
    try {
      await update.mutateAsync({ id: item.sourceId, updates: { status } as any });
      toast.success(`Status updated to ${status}`);
    } catch { /* handled */ }
  };

  const handlePriorityChange = async (priority: string) => {
    if (!isWO) return;
    try {
      await update.mutateAsync({ id: item.sourceId, updates: { priority } as any });
      toast.success(`Priority updated to ${priority}`);
    } catch { /* handled */ }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-sm">Edit Schedule</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {item.taskName} · {item.frequency} · {item.discipline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* PM cascade info */}
          {isPM && (
            <div className="flex items-start gap-2 p-2.5 rounded-md bg-primary/5 border border-primary/20">
              <AlertTriangle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Pushing a maintenance plan will move <strong>all future occurrences</strong> and cascade to any generated work orders.
              </p>
            </div>
          )}

          {/* Date picker */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Scheduled Date:</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded border transition-colors flex items-center gap-2",
                  selectedDate
                    ? "text-foreground border-border hover:border-primary/50 bg-card"
                    : "text-muted-foreground/50 border-dashed border-border hover:border-primary/50"
                )}>
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedDate ? format(selectedDate, "dd MMM yyyy") : "Not scheduled — click to set"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker mode="single" selected={selectedDate} onSelect={handleSetDate} className="p-3 pointer-events-auto" />
                {selectedDate && (
                  <div className="p-2 border-t border-border">
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] w-full" onClick={() => handleSetDate(undefined)}>
                      Clear Date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Push by N days */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">Push by:</span>
            <Input type="number" value={pushDays} onChange={e => setPushDays(Number(e.target.value))} className="w-16 h-8 text-xs text-center" />
            <span className="text-xs text-muted-foreground">days</span>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={handlePush} disabled={isCascading}>
              <ChevronsRight className="w-3.5 h-3.5" /> {isCascading ? "Pushing..." : "Push"}
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => setPushDays(-pushDays)}>
              <ArrowRightLeft className="w-3.5 h-3.5" /> Reverse
            </Button>
          </div>

          {/* Status — WO only */}
          {isWO && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 shrink-0">Status:</span>
              <Select value={item.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Planning", "Planned", "Scheduled", "Active", "On Hold", "Completed"].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Priority — WO only */}
          {isWO && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 shrink-0">Priority:</span>
              <Select value={item.priority} onValueChange={handlePriorityChange}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Critical", "High", "Medium", "Standard", "Low"].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
