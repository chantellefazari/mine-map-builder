import { useState, useMemo, useCallback } from "react";
import {
  Search, Plus, ChevronDown, ChevronRight, Package, Clock,
  GripVertical, X, Calendar, Wrench, CheckSquare, Square,
  FolderPlus, Trash2, CalendarDays, Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import type { PlannerItem } from "./AdvancedPlannerView";
import { WO_TYPE_CONFIG } from "./AdvancedPlannerView";

interface Props {
  items: PlannerItem[];
}

interface Round {
  id: string;
  name: string;
  area: string;
  discipline: string;
  scheduledDate: string | null;
  itemIds: string[];
}

let roundIdCounter = 1;

export function PlannerRoundsTab({ items }: Props) {
  const { update } = useWorkOrders();
  const [rounds, setRounds] = useState<Round[]>([]);
  const [expandedRounds, setExpandedRounds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [selectedUnassigned, setSelectedUnassigned] = useState<Set<string>>(new Set());
  const [groupByField, setGroupByField] = useState<"area" | "discipline" | "frequency">("area");

  // Items not in any round
  const assignedIds = useMemo(() => {
    const set = new Set<string>();
    for (const r of rounds) for (const id of r.itemIds) set.add(id);
    return set;
  }, [rounds]);

  const unassignedItems = useMemo(() => {
    let list = items.filter(i => !assignedIds.has(i.id));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        i.taskName.toLowerCase().includes(q) ||
        i.assetNumber.toLowerCase().includes(q) ||
        i.woNumber.toLowerCase().includes(q) ||
        i.area.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, assignedIds, search]);

  // Auto-group unassigned items for quick rounding
  const autoGroups = useMemo(() => {
    const map = new Map<string, PlannerItem[]>();
    for (const item of unassignedItems) {
      const key = groupByField === "area" ? item.area
        : groupByField === "discipline" ? item.discipline
        : item.frequency;
      const groupKey = key || "Unassigned";
      if (!map.has(groupKey)) map.set(groupKey, []);
      map.get(groupKey)!.push(item);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [unassignedItems, groupByField]);

  const toggleRound = (id: string) => {
    setExpandedRounds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const createRound = useCallback((name?: string, itemIds?: string[]) => {
    const id = `round-${roundIdCounter++}`;
    const newRound: Round = {
      id,
      name: name || `Round ${rounds.length + 1}`,
      area: "",
      discipline: "",
      scheduledDate: null,
      itemIds: itemIds || [],
    };
    setRounds(prev => [...prev, newRound]);
    setExpandedRounds(prev => new Set(prev).add(id));
    return id;
  }, [rounds.length]);

  // Create round from auto-group
  const createRoundFromGroup = useCallback((groupKey: string, groupItems: PlannerItem[]) => {
    createRound(`${groupKey} Round`, groupItems.map(i => i.id));
    toast.success(`Created round with ${groupItems.length} items`);
  }, [createRound]);

  // Add selected unassigned to a round
  const addSelectedToRound = useCallback((roundId: string) => {
    setRounds(prev => prev.map(r => {
      if (r.id !== roundId) return r;
      const newIds = [...new Set([...r.itemIds, ...selectedUnassigned])];
      return { ...r, itemIds: newIds };
    }));
    setSelectedUnassigned(new Set());
  }, [selectedUnassigned]);

  // Remove item from round
  const removeFromRound = useCallback((roundId: string, itemId: string) => {
    setRounds(prev => prev.map(r => {
      if (r.id !== roundId) return r;
      return { ...r, itemIds: r.itemIds.filter(id => id !== itemId) };
    }));
  }, []);

  // Delete round
  const deleteRound = useCallback((roundId: string) => {
    setRounds(prev => prev.filter(r => r.id !== roundId));
  }, []);

  // Schedule entire round — updates all WOs in the round to the same date
  const scheduleRound = useCallback(async (roundId: string, date: Date) => {
    const round = rounds.find(r => r.id === roundId);
    if (!round) return;
    const dateStr = format(date, "yyyy-MM-dd");
    let count = 0;
    for (const itemId of round.itemIds) {
      const item = items.find(i => i.id === itemId);
      if (!item || item.source !== "wo") continue;
      try {
        await update.mutateAsync({
          id: item.sourceId,
          updates: { scheduled_date: dateStr } as any,
        });
        count++;
      } catch { /* continue */ }
    }
    setRounds(prev => prev.map(r => r.id === roundId ? { ...r, scheduledDate: dateStr } : r));
    toast.success(`Scheduled ${count} WOs in "${round.name}" to ${dateStr}`);
  }, [rounds, items, update]);

  const toggleSelectUnassigned = (id: string) => {
    setSelectedUnassigned(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const itemMap = useMemo(() => {
    const map = new Map<string, PlannerItem>();
    for (const i of items) map.set(i.id, i);
    return map;
  }, [items]);

  return (
    <div className="flex h-full">
      {/* Left: Rounds */}
      <div className="flex-1 flex flex-col border-r border-border">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/10">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">{rounds.length} Rounds</span>
          </div>
          <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={() => createRound()}>
            <Plus className="w-3 h-3" /> New Round
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {rounds.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <Package className="w-8 h-8 text-muted-foreground/30 mx-auto" />
                <p className="text-xs text-muted-foreground">No rounds created yet</p>
                <p className="text-[10px] text-muted-foreground/70">
                  Create a round to group work orders together for batch scheduling
                </p>
              </div>
            )}

            {rounds.map(round => {
              const isOpen = expandedRounds.has(round.id);
              const roundItems = round.itemIds.map(id => itemMap.get(id)).filter(Boolean) as PlannerItem[];
              const totalHrs = roundItems.reduce((s, i) => s + i.estimatedHours, 0);
              const woCount = roundItems.filter(i => i.source === "wo").length;
              const pmCount = roundItems.filter(i => i.source === "pm").length;

              return (
                <div key={round.id} className="border border-border rounded-lg bg-card overflow-hidden">
                  {/* Round header */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => toggleRound(round.id)}
                  >
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                    <Package className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-bold text-foreground flex-1">{round.name}</span>
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                      <span>{roundItems.length} items</span>
                      <span>·</span>
                      <span>{totalHrs.toFixed(0)}h</span>
                      {round.scheduledDate && (
                        <>
                          <span>·</span>
                          <Badge variant="outline" className="text-[8px] px-1 py-0 h-3.5">{round.scheduledDate}</Badge>
                        </>
                      )}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CalendarDays className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <CalendarPicker
                          mode="single"
                          selected={round.scheduledDate ? parseISO(round.scheduledDate) : undefined}
                          onSelect={(d) => d && scheduleRound(round.id, d)}
                        />
                      </PopoverContent>
                    </Popover>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={(e) => { e.stopPropagation(); deleteRound(round.id); }}
                    >
                      <Trash2 className="w-3 h-3 text-destructive/60" />
                    </Button>
                  </div>

                  {/* Round items */}
                  {isOpen && (
                    <div className="border-t border-border/50">
                      {roundItems.length === 0 && (
                        <div className="px-4 py-4 text-[10px] text-muted-foreground text-center">
                          Empty round — select work orders from the right panel and add them here
                        </div>
                      )}
                      {roundItems.map(item => (
                        <div key={item.id} className="flex items-center gap-2 px-4 py-1.5 hover:bg-muted/20 border-b border-border/20 last:border-b-0">
                          <span className={cn("w-1.5 h-1.5 rounded-full", WO_TYPE_CONFIG[item.woType]?.color || "bg-muted-foreground")} />
                          <span className="text-[10px] font-mono text-muted-foreground w-20">{item.woNumber || "—"}</span>
                          <span className="text-[10px] text-foreground truncate flex-1">{item.taskName}</span>
                          <span className="text-[9px] text-muted-foreground">{item.assetNumber}</span>
                          <span className="text-[9px] text-muted-foreground tabular-nums">{item.estimatedHours > 0 ? `${item.estimatedHours}h` : ""}</span>
                          <button onClick={() => removeFromRound(round.id, item.id)} className="text-muted-foreground/40 hover:text-destructive">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add selected button */}
                      {selectedUnassigned.size > 0 && (
                        <div className="px-3 py-2 border-t border-border/30">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-[10px] gap-1 w-full"
                            onClick={() => addSelectedToRound(round.id)}
                          >
                            <Plus className="w-3 h-3" /> Add {selectedUnassigned.size} selected
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Unassigned WOs */}
      <div className="w-[380px] flex flex-col bg-muted/5">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/10">
          <span className="text-xs font-semibold text-foreground">{unassignedItems.length} Unassigned</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-muted-foreground">Group:</span>
            <Select value={groupByField} onValueChange={(v: any) => setGroupByField(v)}>
              <SelectTrigger className="h-5 w-24 text-[9px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Area</SelectItem>
                <SelectItem value="discipline">Discipline</SelectItem>
                <SelectItem value="frequency">Frequency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="px-3 py-1.5 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-7 h-6 text-[10px]"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {autoGroups.map(([groupKey, groupItems]) => (
              <AutoGroup
                key={groupKey}
                groupKey={groupKey}
                items={groupItems}
                selectedIds={selectedUnassigned}
                onToggleSelect={toggleSelectUnassigned}
                onCreateRound={() => createRoundFromGroup(groupKey, groupItems)}
              />
            ))}
            {autoGroups.length === 0 && (
              <div className="text-center py-8 text-[10px] text-muted-foreground">
                All items are assigned to rounds
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function AutoGroup({ groupKey, items, selectedIds, onToggleSelect, onCreateRound }: {
  groupKey: string;
  items: PlannerItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onCreateRound: () => void;
}) {
  const [open, setOpen] = useState(true);
  const totalHrs = items.reduce((s, i) => s + i.estimatedHours, 0);

  return (
    <div className="border border-border/50 rounded-md bg-card overflow-hidden">
      <div className="flex items-center gap-2 px-2.5 py-1.5 cursor-pointer hover:bg-muted/30" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
        <span className="text-[10px] font-bold text-foreground flex-1">{groupKey}</span>
        <span className="text-[9px] text-muted-foreground tabular-nums">{items.length} · {totalHrs.toFixed(0)}h</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[9px] gap-0.5"
          onClick={(e) => { e.stopPropagation(); onCreateRound(); }}
        >
          <FolderPlus className="w-3 h-3" /> Round
        </Button>
      </div>
      {open && items.map(item => (
        <div
          key={item.id}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 border-t border-border/20 hover:bg-muted/20 cursor-pointer",
            selectedIds.has(item.id) && "bg-primary/5"
          )}
          onClick={() => onToggleSelect(item.id)}
        >
          {selectedIds.has(item.id)
            ? <CheckSquare className="w-3 h-3 text-primary flex-shrink-0" />
            : <Square className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
          }
          <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", WO_TYPE_CONFIG[item.woType]?.color || "bg-muted-foreground")} />
          <span className="text-[9px] font-mono text-muted-foreground w-16 flex-shrink-0">{item.woNumber || "PM"}</span>
          <span className="text-[9px] text-foreground truncate flex-1">{item.taskName}</span>
          <span className="text-[8px] text-muted-foreground flex-shrink-0">{item.estimatedHours > 0 ? `${item.estimatedHours}h` : ""}</span>
        </div>
      ))}
    </div>
  );
}