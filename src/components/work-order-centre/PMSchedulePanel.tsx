import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import {
  X, Search, ChevronDown, ChevronRight, Wrench, Zap, Truck, Droplets,
  ClipboardCheck, CalendarPlus, ArrowLeft, Clock, Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePMasterList } from "@/hooks/usePMData";
import { PMData } from "@/components/pm-design/PMFrequencySection";
import { pmNameToViewId } from "@/components/pm-design/pmNameToViewId";
import { renderPMDocument } from "./renderPMDocument";
import { PMAutoFill } from "./WOTypeSelectDialog";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreatePMWorkOrder: (pmData: PMAutoFill) => void;
}

const DISCIPLINE_META: Record<string, { icon: React.ElementType; color: string }> = {
  Mechanical: { icon: Wrench, color: "text-blue-600" },
  Electrical: { icon: Zap, color: "text-amber-600" },
  "Mobile Equipment": { icon: Truck, color: "text-emerald-600" },
  Ops: { icon: Truck, color: "text-emerald-600" },
  Lube: { icon: Droplets, color: "text-teal-600" },
};

const FREQ_ORDER = ["Daily", "1 Week", "2 Week", "4 Week", "6 Week", "12 Week", "24 Week", "26 Week", "52 Week"];

function groupPMs(pms: PMData[]) {
  const grouped: Record<string, Record<string, PMData[]>> = {};
  for (const pm of pms) {
    const disc = pm.discipline || "Other";
    if (!grouped[disc]) grouped[disc] = {};
    const freq = pm.frequency || "Other";
    if (!grouped[disc][freq]) grouped[disc][freq] = [];
    grouped[disc][freq].push(pm);
  }
  return grouped;
}

type Step = "browse" | "overview";

export function PMSchedulePanel({ open, onClose, onCreatePMWorkOrder }: Props) {
  const { pms, isLoading } = usePMasterList();
  const [search, setSearch] = useState("");
  const [selectedPmId, setSelectedPmId] = useState<string | null>(null);
  const [expandedDisciplines, setExpandedDisciplines] = useState<Record<string, boolean>>({
    Mechanical: true,
  });
  const [expandedFrequencies, setExpandedFrequencies] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState<Step>("browse");
  const [editResources, setEditResources] = useState("");
  const [editDuration, setEditDuration] = useState("");

  const filteredPMs = useMemo(() => {
    if (!search.trim()) return pms;
    const q = search.toLowerCase();
    return pms.filter(
      (pm) =>
        pm.pmName.toLowerCase().includes(q) ||
        pm.equipmentType.toLowerCase().includes(q) ||
        pm.discipline.toLowerCase().includes(q)
    );
  }, [pms, search]);

  const grouped = useMemo(() => groupPMs(filteredPMs), [filteredPMs]);
  const selectedPM = pms.find((p) => p.id === selectedPmId);
  const selectedViewId = selectedPM ? pmNameToViewId[selectedPM.pmName] : null;

  const toggleDiscipline = (d: string) =>
    setExpandedDisciplines((prev) => ({ ...prev, [d]: !prev[d] }));
  const toggleFrequency = (key: string) =>
    setExpandedFrequencies((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSelectPM = (pmId: string) => {
    setSelectedPmId(pmId);
    const pm = pms.find((p) => p.id === pmId);
    if (pm) {
      setEditResources(pm.resources || "");
      setEditDuration(pm.estimatedDuration || "");
    }
  };

  const handleProceedToOverview = () => {
    if (!selectedPM) return;
    setStep("overview");
  };

  const handleBackToBrowse = () => {
    setStep("browse");
  };

  const handleCreate = () => {
    if (!selectedPM) return;

    const autoFill: PMAutoFill = {
      pmId: selectedPM.id,
      pmName: selectedPM.pmName,
      equipmentType: selectedPM.equipmentType,
      discipline: selectedPM.discipline,
      estimatedDuration: editDuration || selectedPM.estimatedDuration || "",
      requiredTools: selectedPM.requiredTools || [],
      assetNumber: selectedPM.assetNumber || "",
      purpose: selectedPM.purpose || "",
      tasks: selectedPM.tasks || [],
      frequency: selectedPM.frequency || "",
    };

    onCreatePMWorkOrder(autoFill);
    setSelectedPmId(null);
    setSearch("");
    setStep("browse");
    setEditResources("");
    setEditDuration("");
  };

  if (!open) return null;

  // Step 2: Overview / confirm before creation
  if (step === "overview" && selectedPM) {
    return (
      <div className="absolute inset-0 z-50 bg-background flex flex-col">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackToBrowse}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-sm font-bold text-foreground">Create PM Work Order</h1>
              <p className="text-[11px] text-muted-foreground">
                Review details before creating
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCreate}
              size="sm"
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Create PM Work Order
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* PM Summary */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h2 className="text-sm font-bold text-foreground">{selectedPM.pmName}</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Equipment Type</span>
                  <p className="font-medium text-foreground mt-0.5">{selectedPM.equipmentType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Discipline</span>
                  <p className="font-medium text-foreground mt-0.5">{selectedPM.discipline}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Frequency</span>
                  <p className="font-medium text-foreground mt-0.5">{selectedPM.frequency}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Asset</span>
                  <p className="font-medium text-foreground mt-0.5">{selectedPM.assetNumber || "—"}</p>
                </div>
              </div>
            </div>

            {/* Resources & Duration — editable */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <h3 className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                Resources & Duration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Resources</Label>
                  <Input
                    value={editResources}
                    onChange={(e) => setEditResources(e.target.value)}
                    placeholder="e.g. 1x Fitter (2 hrs)"
                    className="h-8 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">Who is needed for this PM</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Estimated Duration</Label>
                  <Input
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    placeholder="e.g. 2 hours"
                    className="h-8 text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">How long the PM takes</p>
                </div>
              </div>
            </div>

            {/* Preview */}
            {selectedViewId && (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-muted/30 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground">Template Preview</p>
                </div>
                <div className="transform origin-top-left scale-[0.7] w-[142.8%]">
                  {renderPMDocument(selectedViewId)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Browse & select PM template
  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground">Create PM</h1>
            <p className="text-[11px] text-muted-foreground">
              Select a PM template to create a work order
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedPM && (
            <Button
              onClick={handleProceedToOverview}
              size="sm"
              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              <CalendarPlus className="w-3.5 h-3.5" />
              Next: Review & Create
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: PM Browser */}
        <div className="w-80 border-r border-border flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search PM templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="py-2 px-2 space-y-1">
              {isLoading ? (
                <p className="text-xs text-muted-foreground text-center py-8">Loading...</p>
              ) : Object.keys(grouped).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-8">No PM templates found</p>
              ) : (
                Object.entries(grouped)
                  .sort(([a], [b]) => {
                    const order = ["Mechanical", "Electrical", "Ops", "Mobile Equipment", "Lube"];
                    return (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b));
                  })
                  .map(([discipline, freqs]) => {
                    const meta = DISCIPLINE_META[discipline] || DISCIPLINE_META.Mechanical;
                    const DIcon = meta.icon;
                    const isExpanded = expandedDisciplines[discipline] ?? false;
                    const totalCount = Object.values(freqs).reduce((s, arr) => s + arr.length, 0);

                    return (
                      <div key={discipline}>
                        <button
                          onClick={() => toggleDiscipline(discipline)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          )}
                          <DIcon className={cn("w-3.5 h-3.5 flex-shrink-0", meta.color)} />
                          <span className="text-xs font-semibold text-foreground flex-1 text-left">
                            {discipline} PMs
                          </span>
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {totalCount}
                          </Badge>
                        </button>

                        {isExpanded && (
                          <div className="ml-4 mt-0.5 space-y-0.5">
                            {FREQ_ORDER
                              .filter((f) => freqs[f])
                              .concat(Object.keys(freqs).filter((f) => !FREQ_ORDER.includes(f)))
                              .filter((f, i, arr) => arr.indexOf(f) === i && freqs[f])
                              .map((freq) => {
                                const freqKey = `${discipline}-${freq}`;
                                const freqExpanded = expandedFrequencies[freqKey] ?? false;
                                const items = freqs[freq];

                                return (
                                  <div key={freqKey}>
                                    <button
                                      onClick={() => toggleFrequency(freqKey)}
                                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted/50 transition-colors"
                                    >
                                      {freqExpanded ? (
                                        <ChevronDown className="w-2.5 h-2.5 text-muted-foreground" />
                                      ) : (
                                        <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
                                      )}
                                      <span className="text-[11px] font-medium text-muted-foreground flex-1 text-left uppercase tracking-wide">
                                        {freq}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {items.length}
                                      </span>
                                    </button>

                                    {freqExpanded && (
                                      <div className="ml-3 space-y-px">
                                        {items
                                          .sort((a, b) => a.pmName.localeCompare(b.pmName))
                                          .map((pm) => (
                                            <button
                                              key={pm.id}
                                              onClick={() => handleSelectPM(pm.id)}
                                              className={cn(
                                                "w-full text-left px-2 py-1.5 rounded-md text-[11px] transition-colors",
                                                selectedPmId === pm.id
                                                  ? "bg-primary/10 text-primary font-semibold"
                                                  : "text-foreground hover:bg-muted/50"
                                              )}
                                            >
                                              {pm.pmName}
                                            </button>
                                          ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 overflow-auto">
          {!selectedPM ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <ClipboardCheck className="w-10 h-10 text-muted-foreground/30 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Select a PM template from the list to preview
                </p>
              </div>
            </div>
          ) : !selectedViewId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <p className="text-sm font-semibold text-foreground">{selectedPM.pmName}</p>
                <p className="text-xs text-muted-foreground">
                  Preview not available for this PM template
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="transform origin-top-left scale-[0.8] w-[125%]">
                  {renderPMDocument(selectedViewId)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
