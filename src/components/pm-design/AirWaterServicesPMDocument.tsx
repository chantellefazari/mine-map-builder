import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

interface Task {
  task: string;
  hasTemp?: boolean;
}

interface EquipmentSection {
  equipmentName: string;
  tasks: Task[];
}

const inspectionData: EquipmentSection[] = [
  {
    equipmentName: "Water Pump 1",
    tasks: [
      { task: "Inspect pump and motor for unusual noise or vibration" },
      { task: "Check pump and motor for leaks" },
      { task: "Inspect pipework and fittings for leaks or damage" },
      { task: "Check the condition of the pump mounting base" },
      { task: "Inspect electrical connections for corrosion or damage" },
      { task: "Check the operation of the pump control panel" },
      { task: "Verify the pump is operating at the correct pressure and flow rate" },
      { task: "Inspect the condition of the pump suction strainer" },
      { task: "Check the pump gland packing for proper adjustment" },
      { task: "Inspect the pump coupling for wear or damage" },
      { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
    ],
  },
  {
    equipmentName: "Water Pump 2",
    tasks: [
      { task: "Inspect pump and motor for unusual noise or vibration" },
      { task: "Check pump and motor for leaks" },
      { task: "Inspect pipework and fittings for leaks or damage" },
      { task: "Check the condition of the pump mounting base" },
      { task: "Inspect electrical connections for corrosion or damage" },
      { task: "Check the operation of the pump control panel" },
      { task: "Verify the pump is operating at the correct pressure and flow rate" },
      { task: "Inspect the condition of the pump suction strainer" },
      { task: "Check the pump gland packing for proper adjustment" },
      { task: "Inspect the pump coupling for wear or damage" },
      { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
    ],
  },
  {
    equipmentName: "Air Compressor 1",
    tasks: [
      { task: "Inspect compressor and motor for unusual noise or vibration" },
      { task: "Check compressor and motor for leaks" },
      { task: "Inspect pipework and fittings for leaks or damage" },
      { task: "Check the condition of the compressor mounting base" },
      { task: "Inspect electrical connections for corrosion or damage" },
      { task: "Check the operation of the compressor control panel" },
      { task: "Verify the compressor is operating at the correct pressure" },
      { task: "Inspect the condition of the compressor air filter" },
      { task: "Check the compressor oil level" },
      { task: "Inspect the compressor belt for wear or damage" },
      { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
    ],
  },
  {
    equipmentName: "Air Compressor 2",
    tasks: [
      { task: "Inspect compressor and motor for unusual noise or vibration" },
      { task: "Check compressor and motor for leaks" },
      { task: "Inspect pipework and fittings for leaks or damage" },
      { task: "Check the condition of the compressor mounting base" },
      { task: "Inspect electrical connections for corrosion or damage" },
      { task: "Check the operation of the compressor control panel" },
      { task: "Verify the compressor is operating at the correct pressure" },
      { task: "Inspect the condition of the compressor air filter" },
      { task: "Check the compressor oil level" },
      { task: "Inspect the compressor belt for wear or damage" },
      { task: "Check motor DE and NDE bearing temperature", hasTemp: true },
    ],
  },
];

export const AirWaterServicesPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Air & Water Services Weekly Inspection");
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Air & Water Services Area" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="Air & Water Services"
          pmGroup="Mechanical"
          pmType="Inspection (Fitter)"
          frequency="Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-left font-semibold w-[46%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
                <th className="border border-border px-2 py-2 text-left font-semibold w-[34%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {inspectionData.map((section, sectionIdx) => (
                <>
                  <tr key={`section-${sectionIdx}`} className="bg-primary/10">
                    <td colSpan={4} className="border border-border px-2 py-2 font-semibold text-primary">{section.equipmentName}</td>
                  </tr>
                  {section.tasks.map((task, taskIdx) => (
                    <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/50">
                      <td className="border border-border px-2 py-2">{task.task}</td>
                      <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></td>
                      <td className="border border-border px-2 py-2 text-center"><Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></td>
                      <td className="border border-border px-2 py-2">
                        {task.hasTemp && <div className="text-muted-foreground space-y-1"><div>DE: _______ °C</div><div>NDE: _______ °C</div></div>}
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <PMSignOffBlock />
      </div>
    </div>
  );
};