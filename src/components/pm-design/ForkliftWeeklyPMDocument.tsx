import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText,
  User,
  Calendar,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

interface InspectionItem {
  id: string;
  description: string;
  hasInput?: boolean;
  inputLabel?: string;
}

interface InspectionSection {
  sectionName: string;
  items: InspectionItem[];
}

const inspectionData: InspectionSection[] = [
  {
    sectionName: "Pre-Start Checks",
    items: [
      { id: "1", description: "Check fuel level" },
      { id: "2", description: "Check engine oil level" },
      { id: "3", description: "Check hydraulic oil level" },
      { id: "4", description: "Check coolant level" },
      { id: "5", description: "Check brake fluid level" },
      { id: "6", description: "Check for any fluid leaks" },
      { id: "7", description: "Inspect tyres/wheels for damage and wear" },
      { id: "8", description: "Check tyre pressures" },
    ]
  },
  {
    sectionName: "Safety Devices",
    items: [
      { id: "9", description: "Check seat belt operation" },
      { id: "10", description: "Check horn operation" },
      { id: "11", description: "Check reversing alarm/beeper" },
      { id: "12", description: "Check lights - head, tail, indicators" },
      { id: "13", description: "Check beacon/strobe light" },
      { id: "14", description: "Check mirrors - clean and secure" },
      { id: "15", description: "Check fire extinguisher - charged and in date" },
    ]
  },
  {
    sectionName: "Operational Checks",
    items: [
      { id: "16", description: "Check steering operation" },
      { id: "17", description: "Check foot brake operation" },
      { id: "18", description: "Check park brake operation" },
      { id: "19", description: "Check forward/reverse operation" },
      { id: "20", description: "Check mast operation - lift, lower, tilt" },
      { id: "21", description: "Check forks for damage/wear" },
      { id: "22", description: "Check hydraulic hoses and cylinders" },
      { id: "23", description: "Check chains and chain anchor points" },
      { id: "24", description: "Check overhead guard integrity" },
      { id: "25", description: "Check load backrest condition" },
    ]
  },
  {
    sectionName: "Engine/Electrical",
    items: [
      { id: "26", description: "Check battery condition and terminals" },
      { id: "27", description: "Check air filter condition" },
      { id: "28", description: "Check exhaust system for leaks" },
      { id: "29", description: "Record engine hours", hasInput: true, inputLabel: "Engine Hours:" },
    ]
  },
  {
    sectionName: "General Condition",
    items: [
      { id: "30", description: "Check general cleanliness" },
      { id: "31", description: "Check for any body damage" },
      { id: "32", description: "Check operator seat condition" },
      { id: "33", description: "Check all guards and covers secure" },
      { id: "34", description: "Check decals/labels legible" },
    ]
  },
];

export const ForkliftWeeklyPMDocument = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [itemStatus, setItemStatus] = useState<Record<string, "pass" | "fail" | null>>({});

  const toggleItem = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const setStatus = (id: string, status: "pass" | "fail") => {
    setItemStatus(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  return (
    <div className="bg-background min-h-full">
      {/* Document Header */}
      <div className="border-2 border-border">
        {/* Banner with Title Overlay */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          {/* Logo on left side of black section */}
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          {/* Title on the black section - centered */}
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-wide text-primary">Forklift Weekly Inspection</h1>
              <p className="text-base mt-1 text-primary/80">Mechanical Inspection</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          {/* Left Column */}
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
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Equipment Type:</div>
              <div className="px-2 py-1.5">Forklift</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <User className="w-3 h-3 text-primary" />
                Inspected By:
              </div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Mobile Equipment</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Weekly Inspection</div>
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

        {/* Inspection Checklist */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTION CHECKLIST
          </div>

          {/* Inspection Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold w-12">#</th>
                  <th className="px-3 py-2 text-left font-semibold">Inspection Item</th>
                  <th className="px-3 py-2 text-center font-semibold w-16">Pass</th>
                  <th className="px-3 py-2 text-center font-semibold w-16">Fail</th>
                  <th className="px-3 py-2 text-left font-semibold w-48">Notes</th>
                </tr>
              </thead>
              <tbody>
                {inspectionData.map((section) => (
                  <>
                    {/* Section Header */}
                    <tr key={section.sectionName} className="bg-muted/50">
                      <td colSpan={5} className="px-3 py-2 font-bold text-sm border-b border-border">
                        {section.sectionName}
                      </td>
                    </tr>
                    {/* Section Items */}
                    {section.items.map((item) => (
                      <tr key={item.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-3 py-2 text-center">{item.id}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <span>{item.description}</span>
                            {item.hasInput && (
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-muted-foreground">{item.inputLabel}</span>
                                <Input className="h-6 w-24 text-xs" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Checkbox 
                            className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            checked={itemStatus[item.id] === "pass"}
                            onCheckedChange={() => setStatus(item.id, "pass")}
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <Checkbox 
                            className="h-4 w-4 data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                            checked={itemStatus[item.id] === "fail"}
                            onCheckedChange={() => setStatus(item.id, "fail")}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input className="h-6 text-xs" placeholder="..." />
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Defects / Actions Required */}
        <div className="border-b border-border">
          <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <span className="text-destructive font-bold">DEFECTS / ACTIONS REQUIRED</span>
          </div>
          <div className="p-4">
            <Textarea 
              placeholder="Record any defects found and actions required..."
              className="min-h-[80px] text-sm"
            />
          </div>
        </div>

        {/* Sign-off Section */}
        <div className="border-b border-border">
          <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-green-700">SIGN-OFF</span>
          </div>
          <div className="grid grid-cols-2 text-xs">
            <div className="border-r border-border p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <span className="font-semibold">Inspector Name:</span>
                  <Input className="h-7 text-xs" />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <span className="font-semibold">Signature:</span>
                  <div className="h-8 border border-border rounded bg-muted/30"></div>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <span className="font-semibold">Date:</span>
                  <Input className="h-7 text-xs" type="date" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <span className="font-semibold">Supervisor:</span>
                  <Input className="h-7 text-xs" />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <span className="font-semibold">Signature:</span>
                  <div className="h-8 border border-border rounded bg-muted/30"></div>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-2">
                  <span className="font-semibold">Date:</span>
                  <Input className="h-7 text-xs" type="date" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
          Tennant Creek Mining Operations - Mobile Equipment Inspection Form
        </div>
      </div>
    </div>
  );
};
