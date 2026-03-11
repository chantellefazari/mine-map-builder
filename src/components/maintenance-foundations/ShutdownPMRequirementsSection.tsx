import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Wrench, Zap, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { usePMasterList } from "@/hooks/usePMData";

// ── Types ───────────────────────────────────────────────────
interface ShutdownPM {
  name: string;
  frequency: string;
  type: "PM";
  discipline: "MS" | "ES";
  estimatedHours: number;
  tcAssetMatch?: string;
  tcPidTag?: string;
}

interface ShutdownArea {
  area: string;
  mechanical: ShutdownPM[];
  electrical: ShutdownPM[];
}

// ── Ore Handling Data ───────────────────────────────────────
const oreHandlingMech: ShutdownPM[] = [
  { name: "6W OFF-LINE MECH BC-100 INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MFCV01 - Mill Feed Conveyor", tcPidTag: "04-BC-100" },
  { name: "6W OFF-LINE MECH ORE HANDLING AREA CHUTE INSPECTIONS", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "TRCV01-CH01, MFCV01-CH02, MFCV01-CH01, BM01-LDCH", tcPidTag: "04-CH-100/101/102/010" },
  { name: "6W OFF-LINE MECH ORE HANDLING FEEDER INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "RCFD01 - Reclaim Feeder", tcPidTag: "04-FE-100" },
  { name: "6W OFF-LINE MECH LIME SILO INSPECTION", frequency: "6W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MLA01-SILO01 - Lime Storage Silo", tcPidTag: "04-TK-100" },
  { name: "12W OFF-LINE MECH BC-100 INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 1, tcAssetMatch: "MFCV01 - Mill Feed Conveyor", tcPidTag: "04-BC-100" },
  { name: "12W OFF-LINE MECH ORE HANDLING AREA CHUTE INSPECTIONS", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "TRCV01-CH01, MFCV01-CH02, MFCV01-CH01, BM01-LDCH", tcPidTag: "04-CH-100/101/102/010" },
  { name: "12W OFF-LINE MECH LIME SILO INSPECTION", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 2, tcAssetMatch: "MLA01-SILO01 - Lime Storage Silo", tcPidTag: "04-TK-100" },
  { name: "12W OFF-LINE ORE HANDLING OIL SAMPLES", frequency: "12W", type: "PM", discipline: "MS", estimatedHours: 6, tcAssetMatch: "Gearboxes on RCFD01, MFCV01, TRCV01", tcPidTag: "" },
];

const oreHandlingElec: ShutdownPM[] = [
  { name: "12W OFF-LINE ORE HANDLING LANYARD INSPECTIONS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Feed / Reclaim area safety lanyards", tcPidTag: "" },
  { name: "12W OFF-LINE ORE HANDLING AREA E-STOP CHECKS", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "E-stops on RCFD01, TRCV01, MFCV01", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT ORE HANDLING AREA RCD PUSH BUTTON TEST", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "RCD protection in Feed / Reclaim area", tcPidTag: "" },
  { name: "12W OFF-LINE ELECT BC-100 WEIGHT-O-METER CALIBRATION", frequency: "12W", type: "PM", discipline: "ES", estimatedHours: 6, tcAssetMatch: "MLA01-WTM01 - Weightometer", tcPidTag: "04-WE-506" },
  { name: "26W OFF-LINE ELECT ORE HANDLING MOTOR CHECKS", frequency: "26W", type: "PM", discipline: "ES", estimatedHours: 12, tcAssetMatch: "Motors on RCFD01, TRCV01, MFCV01", tcPidTag: "" },
  { name: "52W OFF-LINE ELECT ORE HANDLING TOUCH POTENTIAL EARTHING TEST", frequency: "52W", type: "PM", discipline: "ES", estimatedHours: 2, tcAssetMatch: "Earthing infrastructure in Feed / Reclaim area", tcPidTag: "" },
];

// ── All areas registry (add new areas here) ─────────────────
const SHUTDOWN_AREAS: ShutdownArea[] = [
  { area: "Ore Handling (Feed / Reclaim)", mechanical: oreHandlingMech, electrical: oreHandlingElec },
];

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
  const [openAreas, setOpenAreas] = useState<Set<string>>(new Set(SHUTDOWN_AREAS.map(a => a.area)));

  const toggleArea = (area: string) => {
    setOpenAreas(prev => {
      const next = new Set(prev);
      next.has(area) ? next.delete(area) : next.add(area);
      return next;
    });
  };

  // Check which shutdown PMs already exist in the PM master list
  const existingPMs = useMemo(() => {
    const set = new Set<string>();
    pms.forEach(p => set.add(normalise(p.pmName)));
    return set;
  }, [pms]);

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
        totalHours += pm.estimatedHours;
        if (checkExists(pm.name)) covered++;
      });
    });
    return { total, covered, outstanding: total - covered, totalHours };
  }, [pms]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Shutdown PM Requirements - Required Offline Inspections
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Offline/shutdown PMs that require the plant to be de-energised. These are cross-referenced against the Tennant Creek P&ID source of truth.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Required</div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{stats.covered}</div>
              <div className="text-xs text-muted-foreground">Already Exist</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{stats.outstanding}</div>
              <div className="text-xs text-muted-foreground">Outstanding</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.totalHours}h</div>
              <div className="text-xs text-muted-foreground">Est. Total Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area sections */}
      {SHUTDOWN_AREAS.map(area => {
        const isOpen = openAreas.has(area.area);
        const allPMs = [...area.mechanical, ...area.electrical];
        const areaCovered = allPMs.filter(pm => checkExists(pm.name)).length;
        const areaHours = allPMs.reduce((s, pm) => s + pm.estimatedHours, 0);

        return (
          <Card key={area.area}>
            <Collapsible open={isOpen} onOpenChange={() => toggleArea(area.area)}>
              <CollapsibleTrigger className="w-full">
                <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      <CardTitle className="text-base">{area.area}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{allPMs.length} PMs</Badge>
                      <Badge variant="outline" className="text-xs">{areaHours}h est.</Badge>
                      <Badge className={areaCovered === allPMs.length ? "bg-emerald-600 text-xs" : "bg-amber-600 text-xs"}>
                        {areaCovered}/{allPMs.length} covered
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {/* Mechanical */}
                  {area.mechanical.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-sm">Mechanical</h4>
                        <Badge variant="outline" className="text-[10px]">{area.mechanical.length} items</Badge>
                      </div>
                      <PMTable items={area.mechanical} checkExists={checkExists} />
                    </div>
                  )}

                  {/* Electrical */}
                  {area.electrical.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h4 className="font-semibold text-sm">Electrical</h4>
                        <Badge variant="outline" className="text-[10px]">{area.electrical.length} items</Badge>
                      </div>
                      <PMTable items={area.electrical} checkExists={checkExists} />
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}

      {/* Placeholder for future areas */}
      {SHUTDOWN_AREAS.length < 2 && (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">More areas coming</p>
            <p className="text-xs">Additional shutdown PM areas (Milling, CIP, Elution, Tailings, etc.) will be added as data is provided.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ── Table sub-component ─────────────────────────────────────
const PMTable = ({ items, checkExists }: { items: ShutdownPM[]; checkExists: (name: string) => boolean }) => (
  <div className="border rounded-lg overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="text-[10px] font-bold w-8">Status</TableHead>
          <TableHead className="text-[10px] font-bold">PM Name</TableHead>
          <TableHead className="text-[10px] font-bold w-14">Freq</TableHead>
          <TableHead className="text-[10px] font-bold w-16">Disc.</TableHead>
          <TableHead className="text-[10px] font-bold w-12">Hours</TableHead>
          <TableHead className="text-[10px] font-bold">TC Asset Match</TableHead>
          <TableHead className="text-[10px] font-bold w-28">P&ID Tag</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((pm, i) => {
          const exists = checkExists(pm.name);
          return (
            <TableRow key={i} className={exists ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""}>
              <TableCell className="text-center">
                {exists 
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mx-auto" />
                }
              </TableCell>
              <TableCell className="text-[11px] font-medium">{pm.name}</TableCell>
              <TableCell><FreqBadge freq={pm.frequency} /></TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px]">
                  {pm.discipline === "MS" ? "Mech" : "Elec"}
                </Badge>
              </TableCell>
              <TableCell className="text-[11px] text-center font-mono">{pm.estimatedHours}</TableCell>
              <TableCell className="text-[10px] text-muted-foreground">{pm.tcAssetMatch}</TableCell>
              <TableCell className="text-[10px] font-mono text-blue-600 dark:text-blue-400">{pm.tcPidTag || "—"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </div>
);
