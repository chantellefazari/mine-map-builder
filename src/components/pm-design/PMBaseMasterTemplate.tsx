import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2,
  ClipboardCheck
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";

export const PMBaseMasterTemplate = () => {
  return (
    <div className="p-6 bg-background min-h-full overflow-auto">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">MASTER</Badge>
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">Template</Badge>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Base PM Template</h1>
          <p className="text-muted-foreground">
            This is the master template structure. All PMs will inherit from this template.
          </p>
        </div>

        {/* Document Container */}
        <div className="border-2 border-border bg-card">
          {/* Banner with Title Overlay and Work Order */}
          <div className="relative">
            <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
            <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
              <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold tracking-wide text-primary">[Project/Site Name] - [Equipment Area]</h1>
                <p className="text-base mt-1 text-primary/80">[Discipline] [PM Mode] PMs - [Frequency] [PM Type]</p>
              </div>
            </div>
            <div className="absolute bottom-1 right-2 h-[40%] flex items-center">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-primary tracking-tight">WO#:</span>
                <Input className="h-6 w-24 text-xs bg-background/90 border-primary/40 focus-visible:ring-primary shadow-sm" placeholder="______" maxLength={6} />
              </div>
            </div>
          </div>

          {/* Header Information Grid */}
          <div className="grid grid-cols-2 border-b border-border text-xs">
            <div className="border-r border-border">
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">
                  Project / Site:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[To be defined]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
                <div className="px-2 py-1.5"></div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Area Description]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">
                  Resource/s:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Xx Trade (X hrs)]</div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Mech/Elec/Ops]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Inspection/Service]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">
                  Frequency:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Daily/1W/2W/6W/12W]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
                <div className="px-2 py-1.5"></div>
              </div>
            </div>
          </div>

          {/* Safety Precautions */}
          <SafetyPrecautionsSection />




          {/* Inspections Header */}
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>

          {/* Inspection Table Placeholder */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
                <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-muted/50">
                <td colSpan={4} className="border border-border px-3 py-2 font-bold text-primary">
                  [Equipment ID] - [Equipment Name]
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-muted-foreground italic">[Inspection task description]</td>
                <td className="border border-border px-2 py-2 text-center">
                  <div className="flex justify-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                  </div>
                </td>
                <td className="border border-border px-2 py-2 text-center">
                  <div className="flex justify-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                  </div>
                </td>
                <td className="border border-border px-2 py-4">
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-muted-foreground italic">[Task with input field]</td>
                <td className="border border-border px-2 py-2 text-center">
                  <div className="flex justify-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                  </div>
                </td>
                <td className="border border-border px-2 py-2 text-center">
                  <div className="flex justify-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                  </div>
                </td>
                <td className="border border-border px-2 py-4">
                </td>
              </tr>
            </tbody>
          </table>

          {/* Comments */}
          <div className="border-t border-border" data-pdf-component="pm-comments-section" data-pdf-keep-together data-pdf-break>
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
            <div className="p-3">
              <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
            </div>
          </div>

          {/* Sign Off */}
          <div className="border-t border-border" data-pdf-component="pm-signoff-section" data-pdf-keep-together data-pdf-break>
            <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">SIGN OFF</div>
            <div className="px-4 py-3 space-y-3">
              {/* Checkbox rows side by side */}
              <div className="grid grid-cols-2 gap-x-8" data-pdf-break data-pdf-keep-together>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-52">Follow up work required:</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Checkbox className="h-4 w-4" />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Checkbox className="h-4 w-4" />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-52">Document update required:</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Checkbox className="h-4 w-4" />
                      <span className="text-sm">Yes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Checkbox className="h-4 w-4" />
                      <span className="text-sm">No</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Input fields underneath */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-sm font-medium">Name:</span>
                  <Input className="h-7" />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-sm font-medium">Signature:</span>
                  <div className="h-7 border border-border rounded bg-muted/30"></div>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-sm font-medium">Date:</span>
                  <Input className="h-7" type="date" />
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="text-sm font-medium">PM Duration:</span>
                  <Input className="h-7" />
                </div>
              </div>
            </div>
          </div>
          {/* Approval */}
          <div className="border-t border-border">
            <div className="bg-green-500/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-green-700">APPROVAL</span>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold w-[20%]">Role</th>
                  <th className="px-4 py-2 text-left font-semibold w-[25%]">Name</th>
                  <th className="px-4 py-2 text-left font-semibold w-[25%]">Sign</th>
                  <th className="px-4 py-2 text-left font-semibold w-[30%]">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2 font-medium">Supervisor</td>
                  <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                  <td className="px-4 py-2"><div className="h-7 border border-border rounded bg-muted/30"></div></td>
                  <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
            Tennant Creek Mining Operations – Inspection Form
          </div>
        </div>
      </div>
    </div>
  );
};
