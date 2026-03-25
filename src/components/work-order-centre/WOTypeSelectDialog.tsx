import { useState, useMemo } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wrench, CalendarCheck, AlertTriangle, ClipboardCheck, Search, ArrowLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePMasterList } from "@/hooks/usePMData";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (woType: string, pmData?: PMAutoFill) => void;
  title: string;
  description: string;
}

export interface PMAutoFill {
  pmId: string;
  pmName: string;
  equipmentType: string;
  discipline: string;
  estimatedDuration: string;
  requiredTools: string[];
  assetNumber: string;
  purpose: string;
  tasks: any[];
  frequency: string;
}

const WO_TYPES = [
  {
    value: "Breakdown",
    label: "Breakdown (Reactive)",
    desc: "Unplanned failure or urgent repair",
    icon: AlertTriangle,
    accent: "border-destructive/40 hover:border-destructive",
  },
  {
    value: "Planned",
    label: "Planned",
    desc: "Scheduled maintenance or improvement work",
    icon: CalendarCheck,
    accent: "border-primary/40 hover:border-primary",
  },
  {
    value: "Shutdown",
    label: "Shutdown",
    desc: "Work requiring plant or area shutdown",
    icon: Wrench,
    accent: "border-orange-400/40 hover:border-orange-400",
  },
  {
    value: "PM",
    label: "Preventive Maintenance",
    desc: "Create a WO from an existing PM template",
    icon: ClipboardCheck,
    accent: "border-emerald-400/40 hover:border-emerald-400",
  },
];

const disciplineColor = (d: string) => {
  switch (d?.toLowerCase()) {
    case "mechanical": return "bg-blue-100 text-blue-700 border-blue-300";
    case "electrical": return "bg-amber-100 text-amber-700 border-amber-300";
    case "lube": return "bg-teal-100 text-teal-700 border-teal-300";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

export function WOTypeSelectDialog({ open, onClose, onConfirm, title, description }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState<"type" | "pm-select">("type");
  const [selectedPmId, setSelectedPmId] = useState<string | null>(null);
  const [pmSearch, setPmSearch] = useState("");
  const { pms, isLoading } = usePMasterList();

  const filteredPMs = useMemo(() => {
    if (!pmSearch.trim()) return pms;
    const q = pmSearch.toLowerCase();
    return pms.filter(
      (pm) =>
        pm.pmName.toLowerCase().includes(q) ||
        pm.equipmentType.toLowerCase().includes(q) ||
        pm.discipline.toLowerCase().includes(q) ||
        pm.assetNumber?.toLowerCase().includes(q)
    );
  }, [pms, pmSearch]);

  const handleTypeSelect = (value: string) => {
    setSelected(value);
    if (value === "PM") {
      setStep("pm-select");
    }
  };

  const handleConfirm = () => {
    if (step === "pm-select") {
      const pm = pms.find((p) => p.id === selectedPmId);
      if (pm) {
        const taskDescriptions = (pm.tasks || [])
          .map((t: any) => t.description || t.task || "")
          .filter(Boolean);

        const autoFill: PMAutoFill = {
          pmId: pm.id,
          pmName: pm.pmName,
          equipmentType: pm.equipmentType,
          discipline: pm.discipline,
          estimatedDuration: pm.estimatedDuration || "",
          requiredTools: pm.requiredTools || [],
          assetNumber: pm.assetNumber || "",
          purpose: pm.purpose || "",
          tasks: pm.tasks || [],
          frequency: pm.frequency || "",
        };
        onConfirm("Planned", autoFill);
      }
      resetState();
      return;
    }

    if (selected && selected !== "PM") {
      onConfirm(selected);
      resetState();
    }
  };

  const resetState = () => {
    setSelected(null);
    setStep("type");
    setSelectedPmId(null);
    setPmSearch("");
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleBack = () => {
    setStep("type");
    setSelected(null);
    setSelectedPmId(null);
    setPmSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className={cn("sm:max-w-md", step === "pm-select" && "sm:max-w-2xl")}>
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            {step === "pm-select" && (
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            {step === "pm-select" ? "Select PM Template" : title}
          </DialogTitle>
          {step === "type" && description && (
            <DialogDescription className="text-xs">{description}</DialogDescription>
          )}
          {step === "pm-select" && (
            <DialogDescription className="text-xs">
              Choose a PM template to create a pre-filled work order
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "type" && (
          <div className="space-y-2 py-2">
            {WO_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => handleTypeSelect(t.value)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors",
                  selected === t.value
                    ? `${t.accent} bg-muted/50`
                    : "border-border hover:bg-muted/30"
                )}
              >
                <t.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                </div>
                {t.value === "PM" && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        )}

        {step === "pm-select" && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Search PM name, equipment, discipline..."
                value={pmSearch}
                onChange={(e) => setPmSearch(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>

            <ScrollArea className="h-[350px] border rounded-lg">
              {isLoading ? (
                <div className="p-8 text-center text-muted-foreground text-xs">Loading PM templates...</div>
              ) : filteredPMs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-xs">No PM templates found</div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredPMs.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setSelectedPmId(pm.id)}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 text-left transition-colors",
                        selectedPmId === pm.id
                          ? "bg-primary/5 border-l-2 border-l-primary"
                          : "hover:bg-muted/30 border-l-2 border-l-transparent"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate">{pm.pmName}</p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {pm.equipmentType}
                          {pm.assetNumber ? ` · ${pm.assetNumber}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge variant="outline" className={cn("text-[10px]", disciplineColor(pm.discipline))}>
                          {pm.discipline}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {pm.frequency}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} className="text-xs">
            Cancel
          </Button>
          {step === "type" && selected !== "PM" && (
            <Button size="sm" onClick={handleConfirm} disabled={!selected} className="text-xs">
              Confirm & Create
            </Button>
          )}
          {step === "pm-select" && (
            <Button size="sm" onClick={handleConfirm} disabled={!selectedPmId} className="text-xs gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Create PM Work Order
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
