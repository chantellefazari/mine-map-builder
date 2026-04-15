import { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PMTemplateDocument, PMTemplateData } from "@/components/pm-design/PMTemplateDocument";
import { PMData } from "@/components/pm-design/PMFrequencySection";

/** Convert a pm_master_list record (PMData) into the PMTemplateData shape used by the print template */
export function pmDataToTemplateData(pm: PMData): PMTemplateData {
  const permits = pm.permitRequirements ?? {
    loto_required: false, confined_space: false, hot_work: false,
    working_at_heights: false, isolation_required: false, permit_type: "None",
    environmental_hazards: "", stored_energy_hazards: "",
  };

  // Separate tasks into inspection / mechanical / electrical by section name
  const inspectionTasks: string[] = [];
  const mechanicalTasks: string[] = [];
  const electricalTasks: string[] = [];
  const preStartChecks: string[] = [];

  for (const t of pm.tasks || []) {
    const desc = typeof t === "string" ? t : (t as any).description || (t as any).task || "";
    const section = ((t as any).section || "").toLowerCase();
    if (section.includes("pre-start") || section.includes("prestart")) {
      preStartChecks.push(desc);
    } else if (section.includes("electrical")) {
      electricalTasks.push(desc);
    } else if (section.includes("mechanical")) {
      mechanicalTasks.push(desc);
    } else {
      inspectionTasks.push(desc);
    }
  }

  // Build PPE from requiredPPE array
  const ppeSet = new Set((pm.requiredPPE || []).map(p => p.toLowerCase()));
  const ppe = {
    hardHat: ppeSet.has("hard hat") || ppeSet.has("hardhat") || ppeSet.has("helmet"),
    safetyGlasses: ppeSet.has("safety glasses") || ppeSet.has("glasses") || ppeSet.has("eye protection"),
    gloves: ppeSet.has("gloves"),
    steelCapBoots: ppeSet.has("steel cap boots") || ppeSet.has("boots") || ppeSet.has("safety boots"),
    hearingProtection: ppeSet.has("hearing protection") || ppeSet.has("earplugs") || ppeSet.has("ear muffs"),
    respiratoryProtection: ppeSet.has("respiratory protection") || ppeSet.has("respirator") || ppeSet.has("dust mask"),
    otherPPE: (pm.requiredPPE || []).filter(p => {
      const l = p.toLowerCase();
      return !["hard hat","hardhat","helmet","safety glasses","glasses","eye protection","gloves","steel cap boots","boots","safety boots","hearing protection","earplugs","ear muffs","respiratory protection","respirator","dust mask"].includes(l);
    }).join(", "),
  };

  // Build tools from requiredTools array
  const toolSet = new Set((pm.requiredTools || []).map(t => t.toLowerCase()));
  const tools = {
    standardToolKit: toolSet.has("standard tool kit") || toolSet.has("toolkit") || toolSet.has("hand tools"),
    torqueWrench: toolSet.has("torque wrench"),
    greaseGun: toolSet.has("grease gun"),
    multimeter: toolSet.has("multimeter"),
    liftingEquipment: toolSet.has("lifting equipment") || toolSet.has("crane") || toolSet.has("chain block"),
    otherTools: (pm.requiredTools || []).filter(t => {
      const l = t.toLowerCase();
      return !["standard tool kit","toolkit","hand tools","torque wrench","grease gun","multimeter","lifting equipment","crane","chain block"].includes(l);
    }).join(", "),
  };

  return {
    id: pm.id,
    pmTitle: pm.pmName,
    equipmentType: pm.equipmentType,
    pmFrequency: pm.frequency,
    discipline: pm.discipline as PMTemplateData["discipline"],
    estimatedDuration: pm.estimatedDuration,
    skillLevel: pm.skillLevel,
    locationArea: pm.assetNumber || "",
    revision: "A",
    preparedBy: "",
    approvedBy: "",
    lastReviewDate: "",
    status: pm.status as PMTemplateData["status"],
    isolations: {
      electrical: permits.isolation_required || false,
      mechanical: false,
      hydraulic: false,
      pneumatic: false,
    },
    lotoRequired: permits.loto_required,
    storedEnergyHazards: permits.stored_energy_hazards,
    confinedSpaceRisk: permits.confined_space,
    workingAtHeightsRisk: permits.working_at_heights,
    hotWorkRequired: permits.hot_work,
    environmentalHazards: permits.environmental_hazards,
    emergencyStopsLocation: "",
    ppe,
    tools,
    preStartChecks,
    inspectionTasks,
    mechanicalTasks,
    electricalTasks,
    acceptableCriteria: pm.acceptableCriteria || [],
    signsOfFailure: pm.signsOfFailure || [],
    lubrication: {
      lubricantType: pm.lubricationNotes ? "See notes" : "",
      lubricationPoint: "",
      quantity: "",
      interval: pm.lubricationNotes || "",
    },
    postWorkChecks: [],
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pmData: PMData | null;
}

export function PMTemplateViewDialog({ open, onOpenChange, pmData }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!pmData) return null;

  const templateData = pmDataToTemplateData(pmData);

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>${templateData.pmTitle}</title>
      <style>
        body { margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
      </style>
      </head><body>${content.innerHTML}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base">{templateData.pmTitle} — PM Template</DialogTitle>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={handlePrint}>
              <Printer className="w-3.5 h-3.5" /> Print Template
            </Button>
          </div>
        </DialogHeader>
        <div ref={printRef}>
          <PMTemplateDocument pm={templateData} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
