import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Wrench, Zap, Eye, FileDown } from "lucide-react";
import { useState } from "react";
import type { PMData } from "@/components/pm-design/PMFrequencySection";

interface Props {
  currentPMs: PMData[];
  isLoading: boolean;
  onExportPdf: () => void;
}

const FreqBadge = ({ freq }: { freq: string }) => {
  const f = freq.toLowerCase().replace(/\s+/g, "-");
  const color =
    f.includes("daily") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    : f.includes("1-week") || f.includes("weekly") ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    : f.includes("2-week") ? "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
    : f.includes("4-week") || f.includes("monthly") ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    : f.includes("6-week") ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    : f.includes("12-week") || f.includes("quarterly") ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    : f.includes("26-week") || f.includes("6-monthly") ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    : f.includes("52-week") || f.includes("annual") ? "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
    : "bg-muted text-muted-foreground";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{freq}</span>;
};

export const CurrentPMsDocumentView = ({ currentPMs, isLoading, onExportPdf }: Props) => {
  const today = new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" });

  const mechCount = currentPMs.filter(p => p.discipline === "Mechanical").length;
  const elecCount = currentPMs.filter(p => p.discipline === "Electrical").length;
  const opsCount = currentPMs.filter(p => p.discipline === "Ops" || p.discipline === "Inspection").length;

  // Group by discipline
  const grouped = useMemo(() => {
    const map = new Map<string, PMData[]>();
    for (const pm of currentPMs) {
      const key = pm.discipline || "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(pm);
    }
    return map;
  }, [currentPMs]);

  // Frequency breakdown
  const freqBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    for (const pm of currentPMs) {
      const f = pm.frequency || "Unspecified";
      map.set(f, (map.get(f) || 0) + 1);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [currentPMs]);

  const [openDiscs, setOpenDiscs] = useState<Set<string>>(new Set(Array.from(grouped.keys())));

  const toggleDisc = (disc: string) => {
    setOpenDiscs(prev => {
      const next = new Set(prev);
      next.has(disc) ? next.delete(disc) : next.add(disc);
      return next;
    });
  };

  const discIcon = (disc: string) => {
    if (disc === "Mechanical") return <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
    if (disc === "Electrical") return <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
    return <Eye className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  const discBannerClass = (disc: string) => {
    if (disc === "Mechanical") return "bg-blue-50/60 dark:bg-blue-950/30 border-l-[3px] border-l-blue-500";
    if (disc === "Electrical") return "bg-amber-50/60 dark:bg-amber-950/30 border-l-[3px] border-l-amber-500";
    return "bg-muted/30 border-l-[3px] border-l-muted-foreground";
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-8 text-center">Loading PM data...</p>;
  }

  return (
    <div className="space-y-6">
      {/* ── Document Header ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Title bar */}
        <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">TCMG-PM-REG-001 Rev 1.0</div>
            <h2 className="text-xl font-bold tracking-tight">Site PM Register</h2>
            <p className="text-sm opacity-70 mt-0.5">Complete Preventive Maintenance Task Register — Processing Plant</p>
          </div>
          <Button onClick={onExportPdf} variant="secondary" className="gap-2 shrink-0">
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-x divide-border border-b border-border">
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold">{currentPMs.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Total PMs</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{mechCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Mechanical</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{elecCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Electrical</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-muted-foreground">{opsCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Ops / Inspection</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-primary">{freqBreakdown.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Frequencies</div>
          </div>
        </div>

        {/* Frequency breakdown table */}
        <div className="px-5 py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Frequency Breakdown</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Frequency</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center w-20">Count</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center w-24">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {freqBreakdown.map(([freq, count]) => (
                  <TableRow key={freq}>
                    <TableCell className="text-xs font-medium">{freq}</TableCell>
                    <TableCell className="text-xs text-center font-mono">{count}</TableCell>
                    <TableCell className="text-xs text-center font-mono">{Math.round((count / currentPMs.length) * 100)}%</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/40">
                  <TableCell className="text-xs font-bold">TOTAL</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold">{currentPMs.length}</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold">100%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Document date */}
        <div className="px-5 pb-3">
          <p className="text-[10px] text-muted-foreground">Generated: {today}</p>
        </div>
      </div>

      {/* ── Discipline Sections ── */}
      {Array.from(grouped.entries()).map(([disc, items]) => {
        const isOpen = openDiscs.has(disc);
        return (
          <div key={disc} className="border border-border rounded-xl overflow-hidden bg-card">
            <Collapsible open={isOpen} onOpenChange={() => toggleDisc(disc)}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    {discIcon(disc)}
                    <h3 className="text-sm font-bold">{disc}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="bg-muted px-2.5 py-1 rounded font-semibold">{items.length} PMs</span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className={`border-t border-border ${discBannerClass(disc)}`}>
                  <div className="flex items-center gap-2 px-5 py-2 border-b border-border">
                    {discIcon(disc)}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{disc}</span>
                    <span className="text-[10px] opacity-60">— {items.length} tasks</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-6 text-center">#</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider">PM Name</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-20">Frequency</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider">Equipment Type</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-16 text-center">Duty</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider">Resources</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-16">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((pm, i) => (
                        <TableRow key={pm.id}>
                          <TableCell className="text-[10px] text-center text-muted-foreground font-mono">{i + 1}</TableCell>
                          <TableCell className="text-[11px] font-medium">{pm.pmName}</TableCell>
                          <TableCell><FreqBadge freq={pm.frequency} /></TableCell>
                          <TableCell className="text-[10px] text-muted-foreground">{pm.equipmentType}</TableCell>
                          <TableCell className="text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold ${
                              pm.dutyType === "Offline"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                            }`}>
                              {pm.dutyType || "Online"}
                            </span>
                          </TableCell>
                          <TableCell className="text-[10px] font-medium">{pm.resources || pm.estimatedDuration || "—"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[9px]">{pm.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
};
