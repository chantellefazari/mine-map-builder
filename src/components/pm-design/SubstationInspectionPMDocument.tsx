import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  ClipboardCheck,
  Calendar,
  Building
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

const insideSubstationChecks = [
  { id: 1, item: "Check Fire extinguishers are in position", action: "Check" },
  { id: 2, item: "Check Fire extinguishers in date", action: "Check" },
  { id: 3, item: "Check Vesda System is not in alarm", action: "Check" },
  { id: 4, item: "Check Fire alarm Panel for Faults", action: "Check" },
  { id: 5, item: "Check lights are all functioning correctly", action: "Check" },
  { id: 6, item: "Check air conditioner is on", action: "Check" },
  { id: 7, item: "Check floor is clear from items or materials", action: "Check" },
  { id: 8, item: "Vacuum floor inside Substation", action: "Perform" },
  { id: 9, item: "Mop Floor", action: "Perform" },
  { id: 10, item: "Ensure door locks function correctly and are locked", action: "Check" },
  { id: 11, item: "Check LV rescue kit is on hooks and in date", action: "Check" },
  { id: 12, item: "Check ARC Flash signs are in position and legible", action: "Check" },
  { id: 13, item: "Check isolation tag holder is full of Tags", action: "Check" },
];

const outsideSubstationChecks = [
  { id: 14, item: "Check Fire extinguishers are in position", action: "Check" },
  { id: 15, item: "Check Fire extinguishers in date", action: "Check" },
  { id: 16, item: "Check no rubbish or tools around the Substation", action: "Check" },
];

export const SubstationInspectionPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Substation Inspection</h1>
              <p className="text-base mt-1 text-primary/80">2 Weekly Inspection</p>
            </div>
          </div>
        </div>

        {/* Header Information Grid */}
        <div className="grid grid-cols-2 border-b border-border text-xs">
          <div className="border-r border-border">
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Building className="w-3 h-3 text-primary" />
                Area:
              </div>
              <div className="px-2 py-1.5">Sub</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Sub Number:</div>
              <div className="px-2 py-1.5">SB-100</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Date:
              </div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Visual Inspection</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div>
              <div className="px-2 py-1.5 font-medium">2 Weekly</div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Inside Substation Inspections */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          INSIDE SUBSTATION
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-center font-semibold w-[8%]">#</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[52%]">System, assembly or components</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Action</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[20%]">Record/Finding</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Initial</th>
            </tr>
          </thead>
          <tbody>
            {insideSubstationChecks.map((check) => (
              <tr key={check.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-center font-medium">{check.id}</td>
                <td className="border border-border px-3 py-2">{check.item}</td>
                <td className="border border-border px-2 py-2 text-center">{check.action}</td>
                <td className="border border-border px-2 py-2"><Input className="h-7 text-xs border-0 bg-transparent" /></td>
                <td className="border border-border px-2 py-2 text-center"><Input className="h-7 w-12 text-xs mx-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Outside Substation Inspections */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-y border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          OUTSIDE SUBSTATION
        </div>

        <table className="w-full text-sm border-collapse">
          <tbody>
            {outsideSubstationChecks.map((check) => (
              <tr key={check.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-center font-medium w-[8%]">{check.id}</td>
                <td className="border border-border px-3 py-2 w-[52%]">{check.item}</td>
                <td className="border border-border px-2 py-2 text-center w-[10%]">{check.action}</td>
                <td className="border border-border px-2 py-2 w-[20%]"><Input className="h-7 text-xs border-0 bg-transparent" /></td>
                <td className="border border-border px-2 py-2 text-center w-[10%]"><Input className="h-7 w-12 text-xs mx-auto" /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Comments */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
          <div className="p-3">
            <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
          </div>
        </div>

        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Inspected By:</div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] w-1/2 border-r border-border">
            <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
            <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
          </div>
        </div>

        {/* Certification */}
        <div className="border-t border-border">
          <div className="p-4 text-sm text-muted-foreground italic bg-muted/30">
            This certifies that the electrical equipment / installation as identified in this report, to the extent it is affected by the electrical work, has been tested to ensure it is electrically safe and is in accordance with the requirements of the wiring rules and other applicable standards.
          </div>
        </div>

        {/* Reviewed By */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Reviewed By Aspect Representative:</div>
          <div className="grid grid-cols-2 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
          </div>
          <div className="grid grid-cols-[80px_1fr] w-1/2 border-r border-border">
            <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
            <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};
