import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMBannerHeader } from "./PMBannerHeader";
import { PMSignOffBlock } from "./PMSignOffBlock";

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
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Tenant Creek Air & Water Services Area" subtitle="Mechanical Running PMs - Weekly Inspection (Fitter)" />

        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div><div className="px-2 py-1.5">Tenant Creek</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div><div className="px-2 py-1.5"></div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div><div className="px-2 py-1.5">Air & Water Services</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Work Order #:</div><div className="px-2 py-1.5"></div></div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div><div className="px-2 py-1.5">Mechanical</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div><div className="px-2 py-1.5">Inspection (Fitter)</div></div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div><div className="px-2 py-1.5 font-medium">Weekly</div></div>
            <div className="grid grid-cols-[120px_1fr]"><div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div><div className="px-2 py-1.5"></div></div>
          </div>
        </div>

        <SafetyPrecautionsSection />

        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-2 text-left font-semibold w-[50%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th>
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
                        {task.hasTemp ? (
                          <div className="text-muted-foreground space-y-1"><div>DE: _______ °C</div><div>NDE: _______ °C</div></div>
                        ) : (
                          <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                        )}
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