import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText,
  ClipboardCheck,
  User,
  Calendar,
  Eye,
  CheckCircle2,
  Cog,
  Thermometer,
  Gauge
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

interface InspectionTask {
  task: string;
  hasTemp?: boolean;
  tempLabel?: string;
}

interface EquipmentSection {
  equipmentId: string;
  equipmentName: string;
  tasks: InspectionTask[];
}

const inspectionData: EquipmentSection[] = [
  {
    equipmentId: "MILL",
    equipmentName: "Ball Mill - System, Assembly and Components",
    tasks: [
      { task: "Inspect Feed Chute & Seals for Leaks/Wear. Note any Faults" },
      { task: "Inspect Trunnion & Pinion Bearing Labyrinths. Note Excessive Grease" },
      { task: "Grease Pinion Bearings (4 PUMPS PER DAY)" },
      { task: "Inspect Mill Drivelines. Note any excessive noise or wear" },
      { task: "Inspect/Check operation of Girth Gear Grease Sprayer" },
      { task: "Check Cycle Frequency on Girth Gear Lube and Note times (Approx 120 Seconds)" },
      { task: "Inspect mill for loose or leaking liner bolts. Note any faults" },
      { task: "Inspect gearbox lube pump, radiator & hoses for operation, leaks or noise" },
      { task: "Inspect mill grease pump airline systems, Top up airline oiler & check water traps" },
      { task: "Check level of bulky bins & note any that are getting low" },
    ]
  },
  {
    equipmentId: "GENERAL",
    equipmentName: "General Area Inspection",
    tasks: [
      { task: "Inspect cyclone tower pipe work and hoppers for leaks or wear. Note any faults" },
      { task: "Inspect air compressors for operation" },
      { task: "Check main air receiver & drain water from bottom valve" },
      { task: "Check general pipe work for leaks" },
      { task: "Check condition of walkway mesh & handrails" },
      { task: "Check operation of sump pumps" },
    ]
  },
  {
    equipmentId: "FE-100",
    equipmentName: "FE-100 Hopper",
    tasks: [
      { task: "Inspect Feed & Discharge chutes for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks" },
      { task: "Inspect scraper operation & condition. Note any faults" },
      { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "DE: ___°C | NDE: ___°C" },
    ]
  },
  {
    equipmentId: "FE-101",
    equipmentName: "FE-101 Transfer Conveyor",
    tasks: [
      { task: "Inspect Feed & Discharge chutes for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
      { task: "Inspect scraper operation & condition. Note any faults" },
      { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "NDE: ___°C | DE: ___°C" },
    ]
  },
  {
    equipmentId: "BC-100",
    equipmentName: "BC-100 Mill Feed Conveyor",
    tasks: [
      { task: "Inspect Feed & Discharge chutes for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks. Record Temp", hasTemp: true, tempLabel: "Gearbox: ___°C" },
      { task: "Inspect scraper operation & condition. Note any faults" },
      { task: "Check head & tail drum bearings for noise or lumpiness", hasTemp: true, tempLabel: "TD: ___°C | HD: ___°C" },
      { task: "Check belt tracking & tracking frames for correct operation" },
      { task: "Check conveyor belt for noisy or hot bearings. Report any issues to supervisor" },
    ]
  },
  {
    equipmentId: "CV-011",
    equipmentName: "CV-011 Scats Conveyor",
    tasks: [
      { task: "Inspect Feed chute for holes or leakage" },
      { task: "Inspect belt condition, tracking, tag any faulty rollers" },
      { task: "Inspect Feeder gearbox for noise or leaks" },
      { task: "Check head & tail drum bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Tail Plant Side: ___°C | Tail Thickener Side: ___°C" },
    ]
  },
  {
    equipmentId: "MILL-SUMP",
    equipmentName: "Mill Sump Pump",
    tasks: [
      { task: "Inspect Discharge pipework for holes or leakage" },
      { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
      { task: "Inspect pump operation & condition. Inspect guarding" },
      { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
      { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Top: ___°C | Lower: ___°C" },
    ]
  },
  {
    equipmentId: "PU102A/B",
    equipmentName: "Cyclone Feed Pumps PU102A/PU102B",
    tasks: [
      { task: "Inspect Discharge pipework for holes or leakage" },
      { task: "Visually inspect drive belts, Adjust if any slipping (squealing)" },
      { task: "Inspect pump operation & condition. Inspect guarding" },
      { task: "Check pump bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
      { task: "Check motor bearings for noise or lumpiness & Temps", hasTemp: true, tempLabel: "Drive: ___°C | Non-Drive: ___°C" },
      { task: "Note any leakage, and note which pump is running" },
    ]
  },
];

export const MillDailyPMDocument = () => {

  return (
    <div className="bg-background min-h-full">
      {/* Document Header */}
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Tenant Creek - Daily Mill Inspection</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Running PMs - Daily Inspection (Fitter)</p>
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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div>
              <div className="px-2 py-1.5">Grinding</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Resource/s:
              </div>
              <div className="px-2 py-1.5">1x Fitter (1 hr)</div>
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
              <div className="px-2 py-1.5 font-medium">Daily</div>
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
            <p className="font-medium mb-2">Daily Running Inspection – Mill Area</p>
            <p className="text-muted-foreground">
              To safely carry out mechanical inspection for signs of damage or potential failures that may require maintenance attention. 
              When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section. 
              If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.
            </p>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Procedure Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            PROCEDURE
          </div>
          <div className="px-4 py-3 text-sm leading-relaxed space-y-3">
            <div className="flex gap-3">
              <span className="font-bold text-primary">1.</span>
              <p>Conduct area inspection as per tables below. Record each check with a tick in the appropriate box.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">2.</span>
              <p>When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section.</p>
            </div>
            <div className="flex gap-3">
              <span className="font-bold text-primary">3.</span>
              <p>If not practical to repair, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
            </div>
          </div>
        </div>

        {/* INSPECTION TABLES */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>

          {inspectionData.map((section, sectionIndex) => (
            <div key={section.equipmentId} className={sectionIndex < inspectionData.length - 1 ? "border-b border-border" : ""}>
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cog className="w-4 h-4 text-primary" />
                  <span className="text-primary font-bold">{section.equipmentId}</span>
                  <span className="text-muted-foreground">|</span>
                  <span>{section.equipmentName}</span>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium w-[50%]">Task</th>
                    <th className="text-center px-2 py-2 font-medium w-[8%]">✓</th>
                    <th className="text-center px-2 py-2 font-medium w-[8%]">✗</th>
                    <th className="text-left px-4 py-2 font-medium w-[34%]">Comments / Temp</th>
                  </tr>
                </thead>
                <tbody>
                  {section.tasks.map((task, taskIndex) => (
                    <tr key={taskIndex} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-2.5 text-foreground">{task.task}</td>
                      <td className="text-center px-2 py-2.5">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                      </td>
                      <td className="text-center px-2 py-2.5">
                        <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                      </td>
                      <td className="px-4 py-2.5">
                        {task.hasTemp ? (
                          <span className="text-xs text-muted-foreground">{task.tempLabel}</span>
                        ) : (
                          <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* BC-100 Additional Temperature Records */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            BC-100 ADDITIONAL BEARING TEMPERATURES
          </div>
          <div className="p-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Upper Bend Pulley:</span>
              <span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Lower Bend Pulley:</span>
              <span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Take-up Pulley:</span>
              <span className="text-muted-foreground">D/S: ___°C | N/D: ___°C</span>
            </div>
          </div>
        </div>

        {/* Mill Specific Data */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-primary" />
            MILL DATA & TEMPERATURES
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">Ambient Temp:</span>
                <span className="text-muted-foreground">___°C</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Throughput Tonnes:</span>
                <span className="text-muted-foreground">_________</span>
              </div>
            </div>
            
            <div>
              <span className="font-medium">PINION FACE TEMPS:</span>
              <div className="mt-2 flex gap-8">
                <span className="text-muted-foreground">LEFT: ___°C</span>
                <span className="text-muted-foreground">CENTRE: ___°C</span>
                <span className="text-muted-foreground">RIGHT: ___°C</span>
              </div>
            </div>

            <div>
              <span className="font-medium">BEARINGS (1-10):</span>
              <div className="mt-2 grid grid-cols-10 gap-2 text-xs text-center">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <div key={num} className="border border-border rounded p-2">
                    <span className="font-medium">{num}=</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">GEARBOX LUBE TEMP (from Control Room):</span>
              <span className="text-muted-foreground">___°C</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            COMMENTS
          </div>
          <div className="p-4">
            <Textarea 
              placeholder="Enter any additional comments, defects noted, or repairs made..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        {/* Sign Off Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-semibold text-sm border-b border-border">
            SIGN OFF
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium w-40">Follow up work required:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>No</span>
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-40">Document update required:</span>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Checkbox className="h-4 w-4" />
                      <span>No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Name:</span>
                  <Input className="flex-1" placeholder="" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Signature:</span>
                  <div className="flex-1 h-10 border border-border rounded-md bg-muted/30"></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">Date:</span>
                  <Input className="flex-1" placeholder="" type="date" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium w-24">PM Duration:</span>
                  <Input className="flex-1" placeholder="" />
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md text-sm text-amber-700">
              REMOVE TAG AND RETURN TO OPERATION IF NO FAULT FOUND
            </div>
          </div>
        </div>

        {/* Approval Section */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">APPROVAL</span>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2 font-medium w-1/4">Role</th>
                  <th className="text-left px-4 py-2 font-medium w-1/4">Name</th>
                  <th className="text-left px-4 py-2 font-medium w-1/4">Sign</th>
                  <th className="text-left px-4 py-2 font-medium w-1/4">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 font-medium">Supervisor</td>
                  <td className="px-4 py-3"><Input className="h-8" /></td>
                  <td className="px-4 py-3"><div className="h-8 border border-border rounded bg-muted/30"></div></td>
                  <td className="px-4 py-3"><Input className="h-8" type="date" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Revision History */}
        <div>
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">
            REVISION HISTORY
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2 font-medium w-20">Rev No.</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Created</th>
                  <th className="text-left px-4 py-2 font-medium w-32">Reviewed</th>
                  <th className="text-left px-4 py-2 font-medium w-28">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2">0</td>
                  <td className="px-4 py-2">Initial Release</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                  <td className="px-4 py-2">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
