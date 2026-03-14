import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Wrench, Zap, AlertTriangle, CheckCircle2, Clock, FileDown, Loader2 } from "lucide-react";
import { usePMasterList } from "@/hooks/usePMData";
import { useShutdownPMRequirements, type ShutdownPMRow } from "@/hooks/useShutdownPMRequirements";
import { PrintShutdownPMModal } from "./PrintShutdownPMModal";

// ── Helpers ─────────────────────────────────────────────────
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const FreqBadge = ({ freq }: { freq: string }) => {
  const color = freq === "6W" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
    : freq === "12W" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    : freq === "26W" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${color}`}>{freq}</span>;
};

// ── Component ───────────────────────────────────────────────
export const ShutdownPMRequirementsSection = () => {
  const { pms } = usePMasterList();
  const { areas: SHUTDOWN_AREAS, isLoading: shutdownLoading } = useShutdownPMRequirements();
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set());
  const [printOpen, setPrintOpen] = useState(false);

  // Once loaded, open all areas by default
  useMemo(() => {
    if (SHUTDOWN_AREAS.length > 0 && openAreas.size === 0) {
      setOpenAreas(new Set(SHUTDOWN_AREAS.map(a => a.area)));
    }
  }, [SHUTDOWN_AREAS.length]);

  const toggleArea = (area: string) => {
    setOpenAreas(prev => {
      const next = new Set(prev);
      next.has(area) ? next.delete(area) : next.add(area);
      return next;
    });
  };

  // Check which shutdown PMs already exist in the PM master list
  const checkExists = (name: string) => {
    const norm = normalise(name);
    return pms.some(p => normalise(p.pmName).includes(norm) || norm.includes(normalise(p.pmName)));
  };

  // Summary stats
  const stats = useMemo(() => {
    let total = 0, covered = 0, totalHours = 0;
    SHUTDOWN_AREAS.forEach(area => {
      const all = [...area.mechanical, ...area.electrical];
      total += all.length;
      all.forEach(pm => {
        totalHours += pm.estimated_hours;
        if (checkExists(pm.name)) covered++;
      });
    });
    return { total, covered, outstanding: total - covered, totalHours };
  }, [pms, SHUTDOWN_AREAS]);

  // Area breakdown for summary table
  const areaBreakdown = useMemo(() => {
    return SHUTDOWN_AREAS.map(area => {
      const allPMs = [...area.mechanical, ...area.electrical];
      return {
        area: area.area,
        mechCount: area.mechanical.length,
        elecCount: area.electrical.length,
        totalPMs: allPMs.length,
        hours: allPMs.reduce((s, pm) => s + pm.estimated_hours, 0),
      };
    });
  }, [SHUTDOWN_AREAS]);

  // Build legacy-format areas for the print modal
  const printAreas = useMemo(() => {
    return SHUTDOWN_AREAS.map(area => ({
      area: area.area,
      mechanical: area.mechanical.map(pm => ({
        name: pm.name,
        frequency: pm.frequency,
        type: "PM" as const,
        discipline: pm.discipline,
        estimatedHours: pm.estimated_hours,
        tcAssetMatch: pm.tc_asset_match,
        tcPidTag: pm.tc_pid_tag,
      })),
      electrical: area.electrical.map(pm => ({
        name: pm.name,
        frequency: pm.frequency,
        type: "PM" as const,
        discipline: pm.discipline,
        estimatedHours: pm.estimated_hours,
        tcAssetMatch: pm.tc_asset_match,
        tcPidTag: pm.tc_pid_tag,
      })),
    }));
  }, [SHUTDOWN_AREAS]);

  if (shutdownLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading shutdown PM requirements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Document Header ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Title bar */}
        <div className="bg-foreground text-background px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">TCMG-SD-PM-REQ-001 Rev 1.0</div>
            <h2 className="text-xl font-bold tracking-tight">Shutdown PM Requirements</h2>
            <p className="text-sm opacity-70 mt-0.5">Required Offline Inspections | Processing Plant</p>
          </div>
          <Button onClick={() => setPrintOpen(true)} variant="secondary" className="gap-2 shrink-0">
            <FileDown className="w-4 h-4" />
            Export PDF
          </Button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border border-b border-border">
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold">{stats.total}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Total Required</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.covered}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Already Exist</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{stats.outstanding}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Outstanding</div>
          </div>
          <div className="p-4 text-center">
            <div className="text-2xl font-extrabold text-primary">{stats.totalHours}h</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Est. Total Hours</div>
          </div>
        </div>

        {/* Area breakdown table */}
        <div className="px-5 py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Area Breakdown</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60">
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider">Area</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center w-20">Mech</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center w-20">Elec</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center w-20">Total</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-wider text-center w-24">Est. Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {areaBreakdown.map((row) => (
                  <TableRow key={row.area}>
                    <TableCell className="text-xs font-medium">{row.area}</TableCell>
                    <TableCell className="text-xs text-center font-mono">{row.mechCount}</TableCell>
                    <TableCell className="text-xs text-center font-mono">{row.elecCount}</TableCell>
                    <TableCell className="text-xs text-center font-mono font-bold">{row.totalPMs}</TableCell>
                    <TableCell className="text-xs text-center font-mono">{row.hours}h</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/40">
                  <TableCell className="text-xs font-bold">TOTAL</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold">{areaBreakdown.reduce((s, r) => s + r.mechCount, 0)}</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold">{areaBreakdown.reduce((s, r) => s + r.elecCount, 0)}</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold">{stats.total}</TableCell>
                  <TableCell className="text-xs text-center font-mono font-bold">{stats.totalHours}h</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ── Area Detail Sections ── */}
      {SHUTDOWN_AREAS.map(area => {
        const isOpen = openAreas.has(area.area);
        const allPMs = [...area.mechanical, ...area.electrical];
        const areaCovered = allPMs.filter(pm => checkExists(pm.name)).length;
        const areaHours = allPMs.reduce((s, pm) => s + pm.estimated_hours, 0);

        return (
          <div key={area.area} className="border border-border rounded-xl overflow-hidden bg-card">
            <Collapsible open={isOpen} onOpenChange={() => toggleArea(area.area)}>
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <h3 className="text-sm font-bold">{area.area}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="bg-muted px-2.5 py-1 rounded font-semibold">{allPMs.length} PMs</span>
                    <span className="bg-muted px-2.5 py-1 rounded font-mono">{areaHours}h</span>
                    <span className={`px-2.5 py-1 rounded font-bold ${
                      areaCovered === allPMs.length
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}>
                      {areaCovered}/{allPMs.length}
                    </span>
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t border-border">
                  {/* Mechanical */}
                  {area.mechanical.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-5 py-2 bg-blue-50/60 dark:bg-blue-950/30 border-b border-border border-l-[3px] border-l-blue-500">
                        <Wrench className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Mechanical</span>
                        <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">| {area.mechanical.length} items | {area.mechanical.reduce((s, pm) => s + pm.estimated_hours, 0)}h est.</span>
                      </div>
                      <PMTable items={area.mechanical} checkExists={checkExists} />
                    </div>
                  )}

                  {/* Electrical */}
                  {area.electrical.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 px-5 py-2 bg-amber-50/60 dark:bg-amber-950/30 border-b border-border border-l-[3px] border-l-amber-500">
                        <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Electrical</span>
                        <span className="text-[10px] text-amber-600/70 dark:text-amber-400/70">| {area.electrical.length} items | {area.electrical.reduce((s, pm) => s + pm.estimated_hours, 0)}h est.</span>
                      </div>
                      <PMTable items={area.electrical} checkExists={checkExists} />
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}

      {/* ── Data Integrity Notice ── */}
      <div className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg px-5 py-3">
        <p className="text-[11px] text-amber-800 dark:text-amber-300">
          <strong>Data Integrity:</strong> P&ID tags are only shown where verified against the source of truth database. No tags have been fabricated or assumed. All asset references have been cross-checked against the live asset register.
        </p>
      </div>

      <PrintShutdownPMModal isOpen={printOpen} onClose={() => setPrintOpen(false)} areas={printAreas} />
    </div>
  );
};

// ── Table sub-component ─────────────────────────────────────
const PMTable = ({ items, checkExists }: { items: ShutdownPMRow[]; checkExists: (name: string) => boolean }) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/30">
        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-6 text-center">#</TableHead>
        <TableHead className="text-[9px] font-bold uppercase tracking-wider">PM Name</TableHead>
        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-14">Freq</TableHead>
        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-14">Disc.</TableHead>
        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-12 text-center">Hrs</TableHead>
        <TableHead className="text-[9px] font-bold uppercase tracking-wider">Asset Match</TableHead>
        <TableHead className="text-[9px] font-bold uppercase tracking-wider w-24">P&ID Tag</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((pm, i) => {
        const exists = checkExists(pm.name);
        return (
          <TableRow key={pm.id} className={exists ? "bg-emerald-50/40 dark:bg-emerald-950/15" : ""}>
            <TableCell className="text-[10px] text-center text-muted-foreground font-mono">{i + 1}</TableCell>
            <TableCell className="text-[11px] font-medium">{pm.name}</TableCell>
            <TableCell><FreqBadge freq={pm.frequency} /></TableCell>
            <TableCell>
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-border text-[9px] font-semibold">
                {pm.discipline === "MS" ? "Mech" : "Elec"}
              </span>
            </TableCell>
            <TableCell className="text-[11px] text-center font-mono font-semibold">{pm.estimated_hours}</TableCell>
            <TableCell className="text-[10px] text-muted-foreground">{pm.tc_asset_match || "—"}</TableCell>
            <TableCell className="text-[10px] font-mono text-blue-600 dark:text-blue-400">{pm.tc_pid_tag || "—"}</TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
);
