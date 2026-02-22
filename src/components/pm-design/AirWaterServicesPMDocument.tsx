import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, User, Calendar, Eye } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface Task {
  task: string;
  hasTemp?: boolean;
}

interface EquipmentSection {
  equipmentId: string;
  equipmentName: string;
  tasks: Task[];
}

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "WP-01",
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
    equipmentId: "WP-02",
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
    equipmentId: "AC-01",
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
    equipmentId: "AC-02",
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
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek Air & Water Services Area</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Weekly Inspection (Fitter)</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-primary" />
                Project / Site:
              </div>
              <div className="px-2 py-1.5">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
              <div className="px-2 py-1.5">Air & Water Services</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Fitter (2 hrs)</div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mechanical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">Weekly</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            SCOPE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed">
            <p className="font-medium mb-2">Weekly Running Inspection – Air & Water Services Area</p>
            <p className="text-muted-foreground">
              To safely carry out mechanical inspection of water pumps and air compressor systems for signs of damage or potential failures that may require maintenance attention.
            </p>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-2">
            <p>1. Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            <p>2. When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            <p>3. If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
          </div>
        </div>

        {/* Inspections Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            INSPECTIONS
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
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
                      <td colSpan={4} className="border border-border px-2 py-2 font-semibold text-primary">
                        {section.equipmentId} - {section.equipmentName}
                      </td>
                    </tr>
                    {section.tasks.map((task, taskIdx) => (
                      <tr key={`task-${sectionIdx}-${taskIdx}`} className="hover:bg-muted/50">
                        <td className="border border-border px-2 py-2">{task.task}</td>
                        <td className="border border-border px-2 py-2 text-center">
                          <Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                        </td>
                        <td className="border border-border px-2 py-2 text-center">
                          <Checkbox className="h-4 w-4 mx-auto data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                        </td>
                        <td className="border border-border px-2 py-2">
                          {task.hasTemp ? (
                            <div className="text-muted-foreground space-y-1">
                              <div>DE: _______ °C</div>
                              <div>NDE: _______ °C</div>
                            </div>
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
        </div>

        {/* Comments Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Comment:</div>
          <div className="p-4">
            <Textarea placeholder="Enter comments here..." className="min-h-[80px] text-sm" />
          </div>
        </div>

        {/* Sign Off Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Sign Off:</div>
          <div className="p-4 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Follow up work required:</span>
                <div className="flex gap-2"><Checkbox id="followup-yes" /><label htmlFor="followup-yes">Yes</label><Checkbox id="followup-no" /><label htmlFor="followup-no">No</label></div>
              </div>
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Name:</span><div className="border-b border-border h-6"></div></div>
              <div className="grid grid-cols-[60px_1fr] gap-2 items-center"><span className="text-muted-foreground">Date:</span><div className="border-b border-border h-6"></div></div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Document update required:</span>
                <div className="flex gap-2"><Checkbox id="update-yes" /><label htmlFor="update-yes">Yes</label><Checkbox id="update-no" /><label htmlFor="update-no">No</label></div>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">Signature:</span><div className="border-b border-border h-6"></div></div>
              <div className="grid grid-cols-[80px_1fr] gap-2 items-center"><span className="text-muted-foreground">PM Duration:</span><div className="border-b border-border h-6"></div></div>
            </div>
          </div>
        </div>

        {/* Supervisor Approval */}
        <div className="border-b border-border"><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Supervisor Approval:</div><div className="p-4"><table className="w-full text-sm"><tbody><tr><td className="py-2 pr-4 text-muted-foreground w-24">Name:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Sign:</td><td className="py-2 border-b border-border"></td><td className="py-2 px-4 text-muted-foreground w-16">Date:</td><td className="py-2 border-b border-border w-24"></td></tr></tbody></table></div></div>

        {/* Revision History */}
        <div><div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Revision History:</div><table className="w-full text-xs"><thead><tr className="bg-muted/50"><th className="border border-border px-2 py-2 text-left font-semibold">Revision No.</th><th className="border border-border px-2 py-2 text-left font-semibold">Description</th><th className="border border-border px-2 py-2 text-left font-semibold">Created</th><th className="border border-border px-2 py-2 text-left font-semibold">Reviewed</th><th className="border border-border px-2 py-2 text-left font-semibold">Date</th></tr></thead><tbody><tr><td className="border border-border px-2 py-2">0</td><td className="border border-border px-2 py-2">Initial Release</td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td><td className="border border-border px-2 py-2"></td></tr></tbody></table></div>
      </div>
    </div>
  );
};
