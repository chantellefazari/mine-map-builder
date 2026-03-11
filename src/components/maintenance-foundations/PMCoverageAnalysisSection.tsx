import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2, XCircle, AlertTriangle, Plus, Search, Download, Trash2, Upload, FileDown,
} from "lucide-react";
import { usePMasterList } from "@/hooks/usePMData";
import { useRequiredPMs } from "@/hooks/useRequiredPMs";
import { toast } from "sonner";
import { PrintPMRegisterModal } from "./PrintPMRegisterModal";
import { CurrentPMsDocumentView } from "./CurrentPMsDocumentView";

/* ── Required PM type ─────────────────────────────────────── */
export interface RequiredPM {
  id: string;
  pmName: string;
  discipline: "Mechanical" | "Electrical" | "Ops" | "Inspection";
  frequency: string;
  equipmentType: string;
  source: string; // e.g. "OEM Manual", "Standards List", "Site Requirement"
  notes: string;
}

/* localStorage migration: on first load, push any localStorage items to DB */
const LS_KEY = "tcmg-required-pms";


/* ── fuzzy name normaliser ────────────────────────────────── */
function normalise(s: string) {
  return s
    .toLowerCase()
    .replace(/[\-–—]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function namesMatch(a: string, b: string): boolean {
  const na = normalise(a);
  const nb = normalise(b);
  if (na === nb) return true;
  // check if one contains the other
  if (na.includes(nb) || nb.includes(na)) return true;
  return false;
}

/* ── Component ────────────────────────────────────────────── */
export const PMCoverageAnalysisSection = () => {
  const { pms: currentPMs, isLoading } = usePMasterList();
  const { requiredPMs: dbRequiredPMs, isLoading: reqLoading, addPM, addMany, deletePM } = useRequiredPMs();
  const [search, setSearch] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [subTab, setSubTab] = useState("coverage");
  const [pdfOpen, setPdfOpen] = useState(false);

  // Map DB rows to component interface
  const requiredPMs: RequiredPM[] = useMemo(() => dbRequiredPMs.map(r => ({
    id: r.id,
    pmName: r.pm_name,
    discipline: r.discipline as RequiredPM["discipline"],
    frequency: r.frequency,
    equipmentType: r.equipment_type,
    source: r.source,
    notes: r.notes,
  })), [dbRequiredPMs]);

  // ── New PM form state
  const [newPM, setNewPM] = useState<Omit<RequiredPM, "id">>({
    pmName: "", discipline: "Mechanical", frequency: "", equipmentType: "", source: "", notes: "",
  });

  // ── Bulk import state
  const [bulkText, setBulkText] = useState("");

  // ── Coverage analysis
  const coverageData = useMemo(() => {
    return requiredPMs.map((req) => {
      const match = currentPMs.find((c) => namesMatch(c.pmName, req.pmName));
      return {
        ...req,
        status: match ? "covered" as const : "outstanding" as const,
        matchedPM: match ?? null,
      };
    });
  }, [requiredPMs, currentPMs]);

  // ── Stats
  const totalRequired = coverageData.length;
  const covered = coverageData.filter((c) => c.status === "covered").length;
  const outstanding = totalRequired - covered;
  const coveragePct = totalRequired > 0 ? Math.round((covered / totalRequired) * 100) : 0;

  // ── Unmatched existing PMs (in DB but not in required list)
  const unmatchedExisting = useMemo(() => {
    return currentPMs.filter(
      (pm) => !requiredPMs.some((req) => namesMatch(pm.pmName, req.pmName))
    );
  }, [currentPMs, requiredPMs]);

  // ── Filters
  const filteredCoverage = coverageData.filter((item) => {
    const matchesSearch = normalise(item.pmName).includes(normalise(search)) ||
      normalise(item.equipmentType).includes(normalise(search));
    const matchesDiscipline = filterDiscipline === "all" || item.discipline === filterDiscipline;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesDiscipline && matchesStatus;
  });

  // ── Add single PM
  const handleAdd = () => {
    if (!newPM.pmName.trim()) { toast.error("PM Name is required"); return; }
    const pm: RequiredPM = { ...newPM, id: crypto.randomUUID() };
    updateRequired([...requiredPMs, pm]);
    setNewPM({ pmName: "", discipline: "Mechanical", frequency: "", equipmentType: "", source: "", notes: "" });
    setAddOpen(false);
    toast.success("Required PM added");
  };

  // ── Bulk import
  const handleBulkImport = () => {
    const lines = bulkText.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) { toast.error("No lines to import"); return; }
    const newItems: RequiredPM[] = lines.map((line) => {
      // Try tab-delimited: Name\tDiscipline\tFrequency\tEquipment\tSource
      const parts = line.split("\t");
      return {
        id: crypto.randomUUID(),
        pmName: parts[0]?.trim() || line,
        discipline: (parts[1]?.trim() as RequiredPM["discipline"]) || "Mechanical",
        frequency: parts[2]?.trim() || "",
        equipmentType: parts[3]?.trim() || "",
        source: parts[4]?.trim() || "Bulk Import",
        notes: "",
      };
    });
    updateRequired([...requiredPMs, ...newItems]);
    setBulkText("");
    setBulkOpen(false);
    toast.success(`${newItems.length} required PMs imported`);
  };

  // ── Delete
  const handleDelete = (id: string) => {
    updateRequired(requiredPMs.filter((r) => r.id !== id));
    toast.success("Removed from required list");
  };

  // ── Export CSV
  const handleExportCSV = () => {
    const header = "PM Name,Discipline,Frequency,Equipment Type,Source,Status,Matched DB PM\n";
    const rows = coverageData.map((c) =>
      `"${c.pmName}","${c.discipline}","${c.frequency}","${c.equipmentType}","${c.source}","${c.status}","${c.matchedPM?.pmName || ""}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "PM_Coverage_Analysis.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  return (
    <div className="space-y-6">
      {/* ── Document View (matches PDF export) ── */}
      <CurrentPMsDocumentView
        currentPMs={currentPMs}
        isLoading={isLoading}
        onExportPdf={() => setPdfOpen(true)}
      />

      {/* ── Coverage Analysis Sub-tabs ── */}
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="coverage">Coverage Analysis</TabsTrigger>
          <TabsTrigger value="required">Required PMs ({requiredPMs.length})</TabsTrigger>
          <TabsTrigger value="unmatched">Additional in System ({unmatchedExisting.length})</TabsTrigger>
        </TabsList>

        {/* Coverage bar */}
        {totalRequired > 0 && (
          <Card className="p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">PM Coverage</span>
              <span className="text-sm font-bold text-foreground">{coveragePct}%</span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${coveragePct}%`,
                  backgroundColor: coveragePct === 100 ? "hsl(var(--primary))" : coveragePct >= 70 ? "hsl(45, 80%, 50%)" : "hsl(var(--destructive))",
                }}
              />
            </div>
          </Card>
        )}

        {/* ── COVERAGE ANALYSIS TAB ─────────────────────────── */}
        <TabsContent value="coverage">
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-semibold text-foreground">Coverage Matrix</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 w-48 text-xs" />
                </div>
                <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Disciplines</SelectItem>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Ops">Ops</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="covered">Covered</SelectItem>
                    <SelectItem value="outstanding">Outstanding</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={handleExportCSV} className="h-8 gap-1 text-xs">
                  <Download className="h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            </div>
            <div className="max-h-[500px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs">Required PM Name</TableHead>
                    <TableHead className="text-xs">Discipline</TableHead>
                    <TableHead className="text-xs">Frequency</TableHead>
                    <TableHead className="text-xs">Equipment</TableHead>
                    <TableHead className="text-xs">Source</TableHead>
                    <TableHead className="text-xs">Matched In System</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCoverage.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8 text-xs">
                        {requiredPMs.length === 0
                          ? "No required PMs added yet. Go to the 'Required PMs' tab to add your list."
                          : "No results match your filters."}
                      </TableCell>
                    </TableRow>
                  ) : filteredCoverage.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {item.status === "covered" ? (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-medium">{item.pmName}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{item.discipline}</Badge></TableCell>
                      <TableCell className="text-xs">{item.frequency}</TableCell>
                      <TableCell className="text-xs">{item.equipmentType}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.source}</TableCell>
                      <TableCell className="text-xs">
                        {item.matchedPM ? (
                          <span className="text-primary">{item.matchedPM.pmName}</span>
                        ) : (
                          <span className="text-destructive italic">Not found</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>


        {/* ── REQUIRED PMs TAB ──────────────────────────────── */}
        <TabsContent value="required">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">
                Required PM List ({requiredPMs.length})
              </h3>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setBulkOpen(true)} className="gap-1 text-xs h-8">
                  <Upload className="h-3.5 w-3.5" /> Bulk Import
                </Button>
                <Button size="sm" onClick={() => setAddOpen(true)} className="gap-1 text-xs h-8">
                  <Plus className="h-3.5 w-3.5" /> Add PM
                </Button>
              </div>
            </div>
            {requiredPMs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No required PMs added yet.</p>
                <p className="text-xs mt-1">Add PMs individually or use Bulk Import to paste a list.</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">#</TableHead>
                      <TableHead className="text-xs">PM Name</TableHead>
                      <TableHead className="text-xs">Discipline</TableHead>
                      <TableHead className="text-xs">Frequency</TableHead>
                      <TableHead className="text-xs">Equipment</TableHead>
                      <TableHead className="text-xs">Source</TableHead>
                      <TableHead className="text-xs w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requiredPMs.map((pm, i) => (
                      <TableRow key={pm.id}>
                        <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="text-xs font-medium">{pm.pmName}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{pm.discipline}</Badge></TableCell>
                        <TableCell className="text-xs">{pm.frequency}</TableCell>
                        <TableCell className="text-xs">{pm.equipmentType}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{pm.source}</TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(pm.id)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ── UNMATCHED / ADDITIONAL TAB ─────────────────────── */}
        <TabsContent value="unmatched">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Additional PMs in System (Not on Required List)
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              These PMs exist in PM Design but are not on your required list — they may be extras or need to be added to the required list.
            </p>
            {unmatchedExisting.length === 0 ? (
              <p className="text-center py-8 text-sm text-muted-foreground">All system PMs are accounted for in the required list.</p>
            ) : (
              <div className="max-h-[500px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">#</TableHead>
                      <TableHead className="text-xs">PM Name</TableHead>
                      <TableHead className="text-xs">Discipline</TableHead>
                      <TableHead className="text-xs">Frequency</TableHead>
                      <TableHead className="text-xs">Equipment Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unmatchedExisting.map((pm, i) => (
                      <TableRow key={pm.id}>
                        <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                        <TableCell className="text-xs font-medium">{pm.pmName}</TableCell>
                        <TableCell><Badge variant="secondary" className="text-[10px]">{pm.discipline}</Badge></TableCell>
                        <TableCell className="text-xs">{pm.frequency}</TableCell>
                        <TableCell className="text-xs">{pm.equipmentType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add PM Dialog ─────────────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Required PM</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-foreground">PM Name *</label>
              <Input value={newPM.pmName} onChange={(e) => setNewPM({ ...newPM, pmName: e.target.value })} placeholder="e.g. Crusher Weekly Inspection" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Discipline</label>
                <Select value={newPM.discipline} onValueChange={(v) => setNewPM({ ...newPM, discipline: v as RequiredPM["discipline"] })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mechanical">Mechanical</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Ops">Ops</SelectItem>
                    <SelectItem value="Inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Frequency</label>
                <Input value={newPM.frequency} onChange={(e) => setNewPM({ ...newPM, frequency: e.target.value })} placeholder="e.g. Weekly" className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground">Equipment Type</label>
                <Input value={newPM.equipmentType} onChange={(e) => setNewPM({ ...newPM, equipmentType: e.target.value })} placeholder="e.g. Crusher" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Source</label>
                <Input value={newPM.source} onChange={(e) => setNewPM({ ...newPM, source: e.target.value })} placeholder="e.g. OEM Manual" className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Notes</label>
              <Textarea value={newPM.notes} onChange={(e) => setNewPM({ ...newPM, notes: e.target.value })} placeholder="Optional notes..." className="mt-1" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add PM</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Import Dialog ────────────────────────────── */}
      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bulk Import Required PMs</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Paste one PM per line. You can use tab-separated columns:<br />
            <code className="text-[10px] bg-muted px-1 rounded">PM Name → Discipline → Frequency → Equipment Type → Source</code>
          </p>
          <Textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder={"Crusher Weekly Inspection\tMechanical\tWeekly\tCrusher\tOEM Manual\nConveyor Monthly Inspection\tMechanical\tMonthly\tConveyor\tStandards"}
            rows={10}
            className="font-mono text-xs"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkOpen(false)}>Cancel</Button>
            <Button onClick={handleBulkImport}>
              Import {bulkText.split("\n").filter((l) => l.trim()).length} PMs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PM Register PDF Modal */}
      <PrintPMRegisterModal
        isOpen={pdfOpen}
        onClose={() => setPdfOpen(false)}
        pms={currentPMs.map(pm => ({
          id: pm.id,
          pmName: pm.pmName,
          discipline: pm.discipline,
          frequency: pm.frequency,
          equipmentType: pm.equipmentType,
          status: pm.status,
          estimatedDuration: pm.resources || pm.estimatedDuration || "",
          dutyType: pm.dutyType,
        }))}
      />
    </div>
  );
};
