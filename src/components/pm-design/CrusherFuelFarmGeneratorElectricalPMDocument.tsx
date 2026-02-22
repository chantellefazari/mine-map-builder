import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

const inspectionTasks = [
  { id: 1, task: "Visual Inspection: Check for any faults, warning lights or abnormal indicators" },
  { id: 2, task: "Inspect all Wiring and Connections" },
  { id: 3, task: "Inspect all Circuit Breakers and Fuses" },
  { id: 4, task: "Inspect Batteries and Connections/Isolator" },
  { id: 5, task: "Check cleanliness of Control Panel and Internal compartments" },
  { id: 6, task: "Start Motor and Check Operation" },
  { id: 7, task: "Check Voltage and Frequency, Test/Measure Voltage of Battery to see if Alternator is charging correctly or Regulator is failing" },
];

export const CrusherFuelFarmGeneratorElectricalPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Weekly Generator Electrical Inspection</h1>
              <p className="text-base mt-1 text-primary/80">Crusher Fuel Farm Generator</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Start Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Finish Date:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" type="date" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" placeholder="GEN-014" /></div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Work Order #:</div>
              <div className="px-2 py-1.5"><Input className="h-6 text-xs" /></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Area:</div>
              <div className="px-2 py-1.5 font-medium">CRUSHER FUEL FARM</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Inspection Table */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          INSPECTION TASKS
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-center font-semibold w-[5%]">#</th>
                <th className="border border-border px-3 py-2 text-left font-semibold">System, Assembly or Components</th>
                <th className="border border-border px-3 py-2 text-center font-semibold w-[10%]">Action</th>
                <th className="border border-border px-3 py-2 text-left font-semibold w-[30%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {inspectionTasks.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2 text-center font-medium">{item.id}</td>
                  <td className="border border-border px-3 py-2">{item.task}</td>
                  <td className="border border-border px-3 py-2 text-center text-xs">Record</td>
                  <td className="border border-border px-2 py-2">
                    <Input className="h-7 text-xs border-0 bg-transparent" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">TESTED BY</div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[100px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[100px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
