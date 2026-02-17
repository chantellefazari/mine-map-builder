import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, AlertTriangle, Calendar, Wrench, Zap, Construction, Hammer, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── SECTION 1: Work Centres ──
const workCentres = [
  { code: "MECH", description: "Mechanical", scope: "All mechanical trades (fitters & boilermaker combined)" },
  { code: "ELEC", description: "Electrical", scope: "Electrical & instrumentation work" },
  { code: "SHUT", description: "Shutdown", scope: "Planned shutdown work only" },
  { code: "PROJ", description: "Projects", scope: "Capital works & upgrades" },
];

// ── SECTION 2: Work Classification ──
const workClassifications = [
  { code: "PM", type: "Preventive Maintenance", description: "Planned recurring maintenance tasks", defaultPriority: "Medium", affectsShutdown: false },
  { code: "BD", type: "Breakdown", description: "Unplanned failure requiring immediate repair", defaultPriority: "Critical", affectsShutdown: false },
  { code: "CM", type: "Corrective Maintenance", description: "Planned repair identified from inspection (non-urgent)", defaultPriority: "Low", affectsShutdown: false },
  { code: "SH", type: "Shutdown Work", description: "Work requiring plant shutdown", defaultPriority: "High", affectsShutdown: true },
  { code: "PJ", type: "Project", description: "Capital or improvement works", defaultPriority: "Medium", affectsShutdown: false },
];

// ── Revision Generation ──
function generateWeeklyRevisions(year: number) {
  // Y26-W01 starts on Wed 7 Jan 2026, each week Wed→Tue
  const firstWed = new Date(year, 0, 1);
  // Find first Wednesday on or after Jan 1
  while (firstWed.getDay() !== 3) firstWed.setDate(firstWed.getDate() + 1);
  // But per spec, W01 = 07 Jan 2026 which is a Wednesday
  // So start from that first Wednesday
  const revisions = [];
  for (let w = 0; w < 52; w++) {
    const start = new Date(firstWed);
    start.setDate(firstWed.getDate() + w * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const wNum = String(w + 1).padStart(2, "0");
    revisions.push({
      code: `Y${String(year).slice(2)}-W${wNum}`,
      start: new Date(start),
      end: new Date(end),
      month: start.getMonth(),
    });
  }
  return revisions;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const fmt = (d: Date) => d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

// ── Component ──
export const PlanningRevisionControlSection = () => {
  const [centreActive, setCentreActive] = useState<Record<string, boolean>>({
    MECH: true, ELEC: true, SHUT: true, PROJ: true,
  });
  const [lockedRevisions, setLockedRevisions] = useState<Set<string>>(new Set());
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [shutdownRevisions, setShutdownRevisions] = useState([
    { code: "Y26-SH01", linkedWeek: "Y26-W12", description: "Q1 Shutdown" },
    { code: "Y26-SH02", linkedWeek: "Y26-W26", description: "Mid-Year Shutdown" },
    { code: "Y26-SH03", linkedWeek: "Y26-W40", description: "Q3 Shutdown" },
    { code: "Y26-SH04", linkedWeek: "Y26-W52", description: "End-of-Year Shutdown" },
  ]);
  const [shutdownFilter, setShutdownFilter] = useState<string>("all");

  // Capacity loading mock data per week
  const [capacityData] = useState(() => {
    const data: Record<string, { available: number; planned: number; breakdownUsed: number }> = {};
    for (let w = 1; w <= 52; w++) {
      const code = `Y26-W${String(w).padStart(2, "0")}`;
      const available = 400; // total man-hours
      const planned = Math.floor(Math.random() * 80 + 280); // 280-360
      const breakdownUsed = Math.floor(Math.random() * 40);
      data[code] = { available, planned, breakdownUsed };
    }
    return data;
  });

  const weeklyRevisions = useMemo(() => generateWeeklyRevisions(2026), []);

  const filteredRevisions = useMemo(() => {
    if (monthFilter === "all") return weeklyRevisions;
    return weeklyRevisions.filter(r => r.month === parseInt(monthFilter));
  }, [weeklyRevisions, monthFilter]);

  const toggleLock = (code: string) => {
    setLockedRevisions(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
  };

  const filteredShutdowns = useMemo(() => {
    if (shutdownFilter === "all") return shutdownRevisions;
    return shutdownRevisions.filter(s => s.code === shutdownFilter);
  }, [shutdownRevisions, shutdownFilter]);

  return (
    <Tabs defaultValue="work-centres" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-2 rounded-lg">
        <TabsTrigger value="work-centres" className="flex items-center gap-2 text-xs">
          <Wrench className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Work Centres</span>
          <span className="sm:hidden">Centres</span>
        </TabsTrigger>
        <TabsTrigger value="classification" className="flex items-center gap-2 text-xs">
          <Zap className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Work Classification</span>
          <span className="sm:hidden">Classification</span>
        </TabsTrigger>
        <TabsTrigger value="weekly-revisions" className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Weekly Revisions</span>
          <span className="sm:hidden">Weekly</span>
        </TabsTrigger>
        <TabsTrigger value="shutdown-revisions" className="flex items-center gap-2 text-xs">
          <Construction className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Shutdown Revisions</span>
          <span className="sm:hidden">Shutdowns</span>
        </TabsTrigger>
        <TabsTrigger value="capacity" className="flex items-center gap-2 text-xs">
          <Hammer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Capacity Loading</span>
          <span className="sm:hidden">Capacity</span>
        </TabsTrigger>
        <TabsTrigger value="system-rules" className="flex items-center gap-2 text-xs">
          <Briefcase className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">System Rules</span>
          <span className="sm:hidden">Rules</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="work-centres">
      {/* SECTION 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="w-5 h-5 text-primary" />
            Work Centres
          </CardTitle>
          <CardDescription>Defines trade-based work centres for all maintenance scheduling. No Operations Support centre required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead className="w-[80px] text-center">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workCentres.map(wc => (
                <TableRow key={wc.code}>
                  <TableCell><Badge variant="outline" className="font-mono">{wc.code}</Badge></TableCell>
                  <TableCell className="font-medium">{wc.description}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{wc.scope}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={centreActive[wc.code]}
                      onCheckedChange={(v) => setCentreActive(prev => ({ ...prev, [wc.code]: v }))}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="classification">
      {/* SECTION 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="w-5 h-5 text-primary" />
            Work Order Classification
          </CardTitle>
          <CardDescription>CM is used for non-urgent corrective work that is not a PM and not a breakdown.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Default Priority</TableHead>
                <TableHead className="w-[120px] text-center">Affects Shutdown</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workClassifications.map(wc => (
                <TableRow key={wc.code}>
                  <TableCell><Badge variant="outline" className="font-mono">{wc.code}</Badge></TableCell>
                  <TableCell className="font-medium">{wc.type}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{wc.description}</TableCell>
                  <TableCell>
                    <Badge variant={wc.defaultPriority === "Critical" ? "destructive" : wc.defaultPriority === "High" ? "default" : "secondary"}>
                      {wc.defaultPriority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={wc.affectsShutdown ? "destructive" : "outline"}>
                      {wc.affectsShutdown ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="weekly-revisions">
      {/* SECTION 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5 text-primary" />
            Weekly Revision Calendar — 2026
          </CardTitle>
          <CardDescription>Revision cycle: Wednesday 00:00 → Tuesday 23:59. Locked revisions cannot be modified.</CardDescription>
          <div className="pt-2">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Revision</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="w-[100px]">Month</TableHead>
                  <TableHead className="w-[80px] text-center">Status</TableHead>
                  <TableHead className="w-[80px] text-center">Lock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRevisions.map(r => {
                  const locked = lockedRevisions.has(r.code);
                  return (
                    <TableRow key={r.code} className={locked ? "bg-muted/30" : ""}>
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{r.code}</Badge></TableCell>
                      <TableCell className="text-sm">{fmt(r.start)}</TableCell>
                      <TableCell className="text-sm">{fmt(r.end)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{MONTHS[r.month]}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={locked ? "default" : "secondary"} className="text-xs">
                          {locked ? "Locked" : "Open"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleLock(r.code)}>
                          {locked ? <Lock className="w-4 h-4 text-primary" /> : <Unlock className="w-4 h-4 text-muted-foreground" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="shutdown-revisions">
      {/* SECTION 4 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Construction className="w-5 h-5 text-primary" />
            Shutdown Revision Structure
          </CardTitle>
          <CardDescription>Shutdown revisions link to weekly revisions and can be filtered independently.</CardDescription>
          <div className="pt-2">
            <Select value={shutdownFilter} onValueChange={setShutdownFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter shutdowns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shutdowns</SelectItem>
                {shutdownRevisions.map(s => (
                  <SelectItem key={s.code} value={s.code}>{s.code} — {s.description}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Shutdown Rev</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Linked Weekly Rev</TableHead>
                <TableHead>Week Dates</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShutdowns.map(s => {
                const linkedWeek = weeklyRevisions.find(r => r.code === s.linkedWeek);
                return (
                  <TableRow key={s.code}>
                    <TableCell><Badge variant="outline" className="font-mono">{s.code}</Badge></TableCell>
                    <TableCell className="font-medium">{s.description}</TableCell>
                    <TableCell><Badge variant="secondary" className="font-mono text-xs">{s.linkedWeek}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {linkedWeek ? `${fmt(linkedWeek.start)} – ${fmt(linkedWeek.end)}` : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="capacity">
      {/* SECTION 5 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hammer className="w-5 h-5 text-primary" />
            Capacity Loading Logic
          </CardTitle>
          <CardDescription>85% planned capacity / 15% breakdown allowance. Warning triggered if planned exceeds 85%.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[500px] overflow-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-[100px]">Revision</TableHead>
                  <TableHead className="w-[100px] text-right">Available (hrs)</TableHead>
                  <TableHead className="w-[100px] text-right">Planned (hrs)</TableHead>
                  <TableHead className="w-[100px] text-right">85% Cap (hrs)</TableHead>
                  <TableHead className="w-[120px] text-right">BD Buffer Left (hrs)</TableHead>
                  <TableHead className="w-[200px]">Utilisation</TableHead>
                  <TableHead className="w-[70px] text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRevisions.map(r => {
                  const cap = capacityData[r.code];
                  if (!cap) return null;
                  const cap85 = Math.floor(cap.available * 0.85);
                  const bdBuffer = cap.available - cap85;
                  const bdRemaining = Math.max(bdBuffer - cap.breakdownUsed, 0);
                  const utilisationPct = Math.round((cap.planned / cap.available) * 100);
                  const overloaded = cap.planned > cap85;
                  return (
                    <TableRow key={r.code} className={overloaded ? "bg-destructive/5" : ""}>
                      <TableCell><Badge variant="outline" className="font-mono text-xs">{r.code}</Badge></TableCell>
                      <TableCell className="text-right font-mono text-sm">{cap.available}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{cap.planned}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{cap85}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{bdRemaining}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={Math.min(utilisationPct, 100)} className={`h-2 flex-1 ${overloaded ? "[&>div]:bg-destructive" : ""}`} />
                          <span className={`text-xs font-mono w-10 text-right ${overloaded ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                            {utilisationPct}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {overloaded ? (
                          <AlertTriangle className="w-4 h-4 text-destructive mx-auto" />
                        ) : (
                          <Badge variant="secondary" className="text-xs">OK</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </TabsContent>

      <TabsContent value="system-rules">
      {/* SYSTEM RULES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Briefcase className="w-5 h-5 text-primary" />
            System Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
            <li>Every work order must be assigned a <strong className="text-foreground">Work Centre</strong>, <strong className="text-foreground">Classification</strong>, and <strong className="text-foreground">Weekly Revision</strong>.</li>
            <li>Incomplete work orders auto-roll to the next weekly revision.</li>
            <li>Calendar view and Gantt view must sync in both directions.</li>
            <li>Revision must lock historical schedule once the week is closed.</li>
          </ul>
        </CardContent>
      </Card>
      </TabsContent>
    </Tabs>
  );
};
