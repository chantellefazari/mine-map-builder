import { useState, useMemo, useCallback } from "react";
import {
  AlertTriangle, Calendar, ChevronDown, ChevronRight, ChevronsRight,
  X, CheckSquare, Square, Building2, Clock, Ban, ArrowRightLeft,
  Wrench, Zap, ShieldAlert, CloudRain, CalendarOff, Truck, Plus,
  Trash2, Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import {
  format, addDays, parseISO, isWithinInterval, differenceInDays,
} from "date-fns";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

/* ─── Block Types ─── */
const BLOCK_TYPES = [
  { value: "Shutdown", label: "Planned Shutdown", icon: Building2, color: "text-amber-600", bg: "bg-amber-500/10 border-amber-300" },
  { value: "Weather", label: "Weather Event", icon: CloudRain, color: "text-blue-600", bg: "bg-blue-500/10 border-blue-300" },
  { value: "Holiday", label: "Public Holiday / RDO", icon: CalendarOff, color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-300" },
  { value: "Supply", label: "Supply / Logistics Delay", icon: Truck, color: "text-purple-600", bg: "bg-purple-500/10 border-purple-300" },
  { value: "Other", label: "Other Block", icon: Ban, color: "text-muted-foreground", bg: "bg-muted/20 border-border" },
] as const;

type BlockType = typeof BLOCK_TYPES[number]["value"];

interface ScheduleBlock {
  id: string;
  type: BlockType;
  label: string;
  startDate: Date;
  endDate: Date;
  notes: string;
  cancelDailyPMs: boolean;
}

// Frequencies that should be cancelled when plant is offline
const CANCEL_FREQUENCIES = ["Daily", "Weekly", "Shift"];

export function PlannerShutdownImpactTab({ items }: Props) {
  const { update } = useWorkOrders();
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pushDays, setPushDays] = useState(7);
  const [processing, setProcessing] = useState(false);

  const currentBlock = blocks.find(b => b.id === activeBlock);

  // Items affected by the active block
  const { impactedWOs, dailyPMs, otherPMs } = useMemo(() => {
    if (!currentBlock) return { impactedWOs: [], dailyPMs: [], otherPMs: [] };

    const impactedWOs: PlannerItem[] = [];
    const dailyPMs: PlannerItem[] = [];
    const otherPMs: PlannerItem[] = [];

    for (const item of items) {
      if (item.scheduledDate) {
        try {
          const d = parseISO(item.scheduledDate);
          if (isWithinInterval(d, { start: currentBlock.startDate, end: currentBlock.endDate })) {
            if (item.source === "pm" || item.woType === "PM") {
              if (CANCEL_FREQUENCIES.some(f => item.frequency.toLowerCase().includes(f.toLowerCase()))) {
                dailyPMs.push(item);
              } else {
                otherPMs.push(item);
              }
            } else {
              impactedWOs.push(item);
            }
            continue;
          }
        } catch { /* ignore */ }
      }
      if (currentBlock.cancelDailyPMs && item.source === "pm" && CANCEL_FREQUENCIES.some(f => item.frequency.toLowerCase().includes(f.toLowerCase()))) {
        dailyPMs.push(item);
      }
    }
    return { impactedWOs, dailyPMs, otherPMs };
  }, [items, currentBlock]);

  const blockDays = currentBlock ? differenceInDays(currentBlock.endDate, currentBlock.startDate) + 1 : 0;

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAllImpacted = () => setSelectedIds(new Set([...impactedWOs, ...otherPMs].map(i => i.id)));
  const selectAllDaily = () => setSelectedIds(new Set(dailyPMs.map(i => i.id)));

  const pushAfterBlock = useCallback(async () => {
    if (!currentBlock) return;
    setProcessing(true);
    const targetDate = addDays(currentBlock.endDate, pushDays);
    const dateStr = format(targetDate, "yyyy-MM-dd");
    let count = 0;
    for (const id of selectedIds) {
      const item = items.find(i => i.id === id);
      if (!item || item.source !== "wo") continue;
      try {
        await update.mutateAsync({ id: item.sourceId, updates: { scheduled_date: dateStr } as any });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Rescheduled ${count} WOs to ${dateStr}`);
    setSelectedIds(new Set());
    setProcessing(false);
  }, [currentBlock, pushDays, selectedIds, items, update]);

  const cancelDailyPMsAction = useCallback(async () => {
    setProcessing(true);
    let count = 0;
    for (const item of dailyPMs) {
      if (item.source !== "wo") continue;
      try {
        await update.mutateAsync({ id: item.sourceId, updates: { status: "On Hold", scheduled_date: null } as any });
        count++;
      } catch { /* continue */ }
    }
    toast.success(`Cancelled ${count} daily PMs`);
    setProcessing(false);
  }, [dailyPMs, update]);

  const addBlock = (block: Omit<ScheduleBlock, "id">) => {
    const newBlock = { ...block, id: crypto.randomUUID() };
    setBlocks(prev => [...prev, newBlock]);
    setActiveBlock(newBlock.id);
    setShowCreate(false);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    if (activeBlock === id) setActiveBlock(blocks.length > 1 ? blocks.find(b => b.id !== id)?.id || null : null);
  };

  const getBlockConfig = (type: BlockType) => BLOCK_TYPES.find(b => b.value === type) || BLOCK_TYPES[4];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
        <div className="flex items-center gap-2">
          <CalendarOff className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">Schedule Blocks</span>
          <span className="text-[10px] text-muted-foreground">Block dates for shutdowns, weather, holidays, or any event</span>
        </div>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setShowCreate(true)}>
          <Plus className="w-3.5 h-3.5" /> Add Block
        </Button>
      </div>

      {/* Active blocks strip */}
      {blocks.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/5 overflow-x-auto">
          {blocks.map(block => {
            const cfg = getBlockConfig(block.type);
            const isActive = activeBlock === block.id;
            const Icon = cfg.icon;
            return (
              <button
                key={block.id}
                onClick={() => setActiveBlock(block.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all shrink-0",
                  isActive ? cn(cfg.bg, "shadow-sm") : "border-border bg-card hover:bg-muted/30"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
                <span className="font-medium text-foreground">{block.label}</span>
                <Badge variant="secondary" className="text-[8px] h-4 px-1">
                  {format(block.startDate, "d MMM")} – {format(block.endDate, "d MMM")}
                </Badge>
                <button
                  onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                  className="ml-1 p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </button>
            );
          })}
        </div>
      )}

      {!currentBlock ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <CalendarOff className="w-12 h-12 text-muted-foreground/20 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">No schedule block selected</p>
            <p className="text-[10px] text-muted-foreground/60 max-w-sm">
              Create a schedule block to identify affected work orders and PMs. 
              Blocks can be shutdowns, weather events, public holidays, supply delays, or any reason to freeze dates.
            </p>
            <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setShowCreate(true)}>
              <Plus className="w-3 h-3" /> Create Schedule Block
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Block info bar */}
          {(() => {
            const cfg = getBlockConfig(currentBlock.type);
            const Icon = cfg.icon;
            return (
              <div className={cn("flex items-center gap-4 px-4 py-3 border-b border-border", cfg.bg)}>
                <div className="flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", cfg.color)} />
                  <div>
                    <div className="text-xs font-bold text-foreground">{currentBlock.label}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {format(currentBlock.startDate, "d MMM yyyy")} – {format(currentBlock.endDate, "d MMM yyyy")} · {blockDays} days
                    </div>
                  </div>
                </div>
                {currentBlock.notes && (
                  <span className="text-[10px] text-muted-foreground italic ml-auto">{currentBlock.notes}</span>
                )}
              </div>
            );
          })()}

          {/* Impact summary */}
          <div className="grid grid-cols-4 gap-3 px-4 py-3 border-b border-border">
            <ImpactCard label="Impacted WOs" value={impactedWOs.length} icon={AlertTriangle} color="text-red-600" description="Need rescheduling" />
            <ImpactCard label="Daily PMs to Cancel" value={dailyPMs.length} icon={Ban} color="text-amber-600" description="Not required during block" />
            <ImpactCard label="Other PMs Affected" value={otherPMs.length} icon={Clock} color="text-blue-600" description="May need rescheduling" />
            <ImpactCard label="Hours Affected" value={`${(impactedWOs.reduce((s, i) => s + i.estimatedHours, 0) + dailyPMs.reduce((s, i) => s + i.estimatedHours, 0) + otherPMs.reduce((s, i) => s + i.estimatedHours, 0)).toFixed(0)}h`} icon={Clock} color="text-muted-foreground" description="Total planned hours" />
          </div>

          {/* Bulk actions */}
          <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/5 flex-wrap">
            <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={selectAllImpacted}>
              <CheckSquare className="w-3 h-3" /> Select WOs
            </Button>
            <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={selectAllDaily}>
              <CheckSquare className="w-3 h-3" /> Select Daily PMs
            </Button>
            <span className="text-[10px] text-muted-foreground">{selectedIds.size} selected</span>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-1">
              <ChevronsRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Push</span>
              <Input type="number" value={pushDays} onChange={e => setPushDays(Number(e.target.value))} className="w-12 h-6 text-[10px] text-center" />
              <span className="text-[10px] text-muted-foreground">days after block</span>
              <Button variant="outline" size="sm" className="h-6 text-[10px]" onClick={pushAfterBlock} disabled={processing || selectedIds.size === 0}>Push</Button>
            </div>

            <div className="h-4 w-px bg-border" />

            <Button variant="destructive" size="sm" className="h-6 text-[10px] gap-1" onClick={cancelDailyPMsAction} disabled={processing || dailyPMs.length === 0}>
              <Ban className="w-3 h-3" /> Cancel Daily PMs ({dailyPMs.length})
            </Button>

            {selectedIds.size > 0 && (
              <Button variant="ghost" size="sm" className="h-6 text-[10px] ml-auto" onClick={() => setSelectedIds(new Set())}>
                <X className="w-3 h-3" /> Clear
              </Button>
            )}
          </div>

          {/* Lists */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <ImpactSection title="Work Orders in Block Window" icon={AlertTriangle} color="text-red-600" items={impactedWOs} selectedIds={selectedIds} onToggle={toggleSelect} emptyText="No scheduled work orders fall within this block" />
              <ImpactSection title="Daily/Weekly PMs — Cancel" icon={Ban} color="text-amber-600" items={dailyPMs} selectedIds={selectedIds} onToggle={toggleSelect} emptyText="No daily/weekly PMs to cancel" highlight />
              <ImpactSection title="Other PMs Affected" icon={Clock} color="text-blue-600" items={otherPMs} selectedIds={selectedIds} onToggle={toggleSelect} emptyText="No other PMs affected" />
            </div>
          </ScrollArea>
        </>
      )}

      <CreateBlockDialog open={showCreate} onOpenChange={setShowCreate} onAdd={addBlock} />
    </div>
  );
}

/* ─── Create Block Dialog ─── */
function CreateBlockDialog({ open, onOpenChange, onAdd }: {
  open: boolean; onOpenChange: (v: boolean) => void;
  onAdd: (block: Omit<ScheduleBlock, "id">) => void;
}) {
  const [type, setType] = useState<BlockType>("Shutdown");
  const [label, setLabel] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [cancelDaily, setCancelDaily] = useState(true);

  const cfg = BLOCK_TYPES.find(b => b.value === type)!;

  const handleSubmit = () => {
    if (!label.trim()) { toast.error("Block name is required"); return; }
    if (!startDate || !endDate) { toast.error("Start and end dates are required"); return; }
    if (endDate < startDate) { toast.error("End date must be after start date"); return; }
    onAdd({ type, label, startDate, endDate, notes, cancelDailyPMs: cancelDaily });
    setLabel(""); setStartDate(undefined); setEndDate(undefined); setNotes(""); setType("Shutdown"); setCancelDaily(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <CalendarOff className="w-4 h-4 text-primary" /> Create Schedule Block
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Block Type</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {BLOCK_TYPES.map(bt => {
                const Icon = bt.icon;
                const isActive = type === bt.value;
                return (
                  <button
                    key={bt.value}
                    onClick={() => setType(bt.value)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[10px] font-medium transition-all",
                      isActive ? cn(bt.bg, "shadow-sm") : "border-border bg-card hover:bg-muted/30 text-muted-foreground"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? bt.color : "text-muted-foreground")} />
                    {bt.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label className="text-xs">Block Name *</Label>
            <Input value={label} onChange={e => setLabel(e.target.value)} placeholder={`e.g. ${cfg.label} — Week 14`} className="text-xs h-8" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-8 text-xs gap-1 justify-start">
                    <Calendar className="w-3 h-3" />
                    {startDate ? format(startDate, "d MMM yyyy") : "Select..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={startDate} onSelect={setStartDate} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-8 text-xs gap-1 justify-start">
                    <Calendar className="w-3 h-3" />
                    {endDate ? format(endDate, "d MMM yyyy") : "Select..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={endDate} onSelect={setEndDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes about this block..." className="text-xs min-h-[50px]" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="cancelDaily" checked={cancelDaily} onChange={e => setCancelDaily(e.target.checked)} className="rounded" />
            <label htmlFor="cancelDaily" className="text-xs text-muted-foreground">Auto-identify Daily/Weekly PMs for cancellation</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit}>Create Block</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Shared Components ─── */
function ImpactCard({ label, value, icon: Icon, color, description }: {
  label: string; value: number | string; icon: React.ElementType; color: string; description: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-[9px] text-muted-foreground">{label}</span>
      </div>
      <div className="text-lg font-bold text-foreground tabular-nums">{value}</div>
      <div className="text-[9px] text-muted-foreground/70">{description}</div>
    </div>
  );
}

function ImpactSection({ title, icon: Icon, color, items, selectedIds, onToggle, emptyText, highlight }: {
  title: string; icon: React.ElementType; color: string; items: PlannerItem[];
  selectedIds: Set<string>; onToggle: (id: string) => void; emptyText: string; highlight?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const totalHrs = items.reduce((s, i) => s + i.estimatedHours, 0);

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden", highlight && "border-amber-300 bg-amber-500/5")}>
      <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
        <Icon className={cn("w-3.5 h-3.5", color)} />
        <span className="text-xs font-bold text-foreground">{title}</span>
        <Badge variant="secondary" className="text-[9px] h-4 px-1.5">{items.length}</Badge>
        <span className="text-[9px] text-muted-foreground ml-auto">{totalHrs.toFixed(0)} hrs</span>
      </div>
      {open && (
        <div className="border-t border-border/50">
          {items.length === 0 ? (
            <div className="px-4 py-4 text-center text-[10px] text-muted-foreground">{emptyText}</div>
          ) : (
            items.map(item => {
              const isSelected = selectedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={cn("flex items-center gap-2 px-3 py-1.5 border-b border-border/20 last:border-b-0 cursor-pointer hover:bg-muted/20 transition-colors", isSelected && "bg-primary/5")}
                  onClick={() => onToggle(item.id)}
                >
                  {isSelected ? <CheckSquare className="w-3.5 h-3.5 text-primary flex-shrink-0" /> : <Square className="w-3.5 h-3.5 text-muted-foreground/40 flex-shrink-0" />}
                  <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", WO_TYPE_CONFIG[item.woType]?.color || "bg-muted-foreground")} />
                  <span className="text-[10px] font-mono text-muted-foreground w-20 flex-shrink-0">{item.woNumber || "PM"}</span>
                  <span className="text-[10px] text-foreground truncate flex-1">{item.taskName}</span>
                  <span className="text-[9px] font-mono text-muted-foreground flex-shrink-0">{item.assetNumber}</span>
                  <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5 flex-shrink-0">{item.frequency || item.woType}</Badge>
                  {item.scheduledDate && <span className="text-[9px] text-muted-foreground flex-shrink-0">{item.scheduledDate}</span>}
                  <span className="text-[9px] text-muted-foreground tabular-nums flex-shrink-0">{item.estimatedHours > 0 ? `${item.estimatedHours}h` : ""}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}