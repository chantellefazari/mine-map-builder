import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown, ChevronUp, Search, RotateCcw, ArrowRightLeft,
  AlertTriangle, Filter, CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";

export interface SupersededEntry {
  pmId: string;
  pmName: string;
  assetNumber: string;
  frequency: string;
  discipline: string;
  weekNum: number;
  weekStart: Date;
  supersededBy: string;
}

interface Props {
  entries: SupersededEntry[];
  onReinstate?: (pmId: string, weekNum: number) => void;
}

export function SupersededLogPanel({ entries, onReinstate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("All");

  const disciplines = useMemo(() => {
    const set = new Set(entries.map(e => e.discipline).filter(Boolean));
    return ["All", ...Array.from(set).sort()];
  }, [entries]);

  const filtered = useMemo(() => {
    let result = entries;
    if (filterDiscipline !== "All") result = result.filter(e => e.discipline === filterDiscipline);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.pmName.toLowerCase().includes(q) ||
        e.assetNumber.toLowerCase().includes(q) ||
        e.supersededBy.toLowerCase().includes(q)
      );
    }
    return result;
  }, [entries, filterDiscipline, search]);

  // Group by asset
  const grouped = useMemo(() => {
    const map = new Map<string, SupersededEntry[]>();
    for (const e of filtered) {
      const key = e.assetNumber || "Unassigned";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const isEmpty = entries.length === 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-t border-border bg-muted/10">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-bold text-foreground">Superseded Log</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-muted-foreground/30 text-muted-foreground">
                {entries.length} occurrence{entries.length !== 1 ? "s" : ""}
              </Badge>
              <span className="text-[10px] text-muted-foreground ml-2">
                Audit trail of plans superseded by longer-frequency tasks on the same asset
              </span>
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-3">
            {/* Filters */}
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-48">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <Input
                  placeholder="Search plans..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-7 pl-7 text-[10px]"
                />
              </div>
              <div className="flex items-center gap-1">
                <Filter className="w-3 h-3 text-muted-foreground" />
                {disciplines.map(d => (
                  <button
                    key={d}
                    onClick={() => setFilterDiscipline(d)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors",
                      filterDiscipline === d
                        ? "bg-foreground text-background border-foreground"
                        : "bg-background text-muted-foreground border-border hover:border-foreground/40"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <span className="text-[10px] text-muted-foreground">
                {filtered.length} of {entries.length} shown
              </span>
            </div>

            {/* Table */}
            <ScrollArea className="max-h-[260px]">
              <div className="border border-border rounded-md overflow-hidden">
                {/* Header */}
                <div className="flex bg-muted/40 border-b border-border text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <div className="flex-[2] px-3 py-1.5">Plan Name</div>
                  <div className="flex-1 px-3 py-1.5">Asset</div>
                  <div className="w-20 px-3 py-1.5 text-center">Frequency</div>
                  <div className="w-16 px-3 py-1.5 text-center">Week</div>
                  <div className="flex-[2] px-3 py-1.5">Superseded By</div>
                  <div className="w-20 px-3 py-1.5 text-center">Action</div>
                </div>

                {filtered.length === 0 && (
                  <div className="p-6 text-center text-[10px] text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 mx-auto mb-1 text-muted-foreground/50" />
                    No superseded occurrences match filters
                  </div>
                )}

                {grouped.map(([asset, items]) => (
                  <div key={asset}>
                    {grouped.length > 1 && (
                      <div className="px-3 py-1 bg-muted/20 border-b border-border/50 text-[9px] font-semibold text-muted-foreground">
                        {asset} — {items.length} superseded
                      </div>
                    )}
                    {items.map((entry, idx) => (
                      <div
                        key={`${entry.pmId}-${entry.weekNum}-${idx}`}
                        className="flex items-center border-b border-border/30 last:border-b-0 hover:bg-muted/20 transition-colors"
                      >
                        <div className="flex-[2] px-3 py-1.5 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                          <span className="text-[10px] text-foreground line-through opacity-70 truncate">{entry.pmName}</span>
                        </div>
                        <div className="flex-1 px-3 py-1.5">
                          <span className="text-[10px] font-mono text-muted-foreground">{entry.assetNumber}</span>
                        </div>
                        <div className="w-20 px-3 py-1.5 text-center">
                          <Badge variant="outline" className="text-[9px] px-1 py-0">{entry.frequency}</Badge>
                        </div>
                        <div className="w-16 px-3 py-1.5 text-center">
                          <span className="text-[10px] font-bold text-foreground">W{entry.weekNum}</span>
                          <p className="text-[8px] text-muted-foreground">{format(entry.weekStart, "dd/MM")}</p>
                        </div>
                        <div className="flex-[2] px-3 py-1.5">
                          <span className="text-[10px] text-primary font-medium">{entry.supersededBy}</span>
                        </div>
                        <div className="w-20 px-3 py-1.5 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[9px] px-2 gap-1 text-muted-foreground hover:text-foreground"
                            onClick={() => onReinstate?.(entry.pmId, entry.weekNum)}
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Reinstate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
