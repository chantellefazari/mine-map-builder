import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Shield, 
  HardHat, 
  Eye, 
  Info,
  FileText,
  User,
  Calendar,
  Zap,
  CheckCircle2,
  ClipboardCheck
} from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

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
          {/* Banner with Title Overlay */}
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
          </div>

          {/* Header Information Grid */}
          <div className="grid grid-cols-2 border-b border-border text-xs">
            <div className="border-r border-border">
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-primary" />
                  Project / Site:
                </div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[To be defined]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
                <div className="px-2 py-1.5"></div>
              </div>
              <div className="grid grid-cols-[120px_1fr] border-b border-border">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area Desc.:</div>
                <div className="px-2 py-1.5 text-muted-foreground italic">[Area Description]</div>
              </div>
              <div className="grid grid-cols-[120px_1fr]">
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                  <User className="w-3 h-3 text-primary" />
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
                <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-primary" />
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

          {/* PREPARATION AND INFORMATION Section */}
          <div className="border-b border-border">
            <div className="bg-primary/10 px-4 py-3 font-bold text-base border-b border-border flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              PREPARATION AND INFORMATION
            </div>
            
            <div className="border-b border-border">
              <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                SCOPE
              </div>
              <div className="px-4 py-3 text-sm leading-relaxed">
                <p className="font-medium mb-2 text-muted-foreground italic">[Frequency] [PM Mode] Area Inspection – [Equipment Area]</p>
                <p className="text-muted-foreground italic">
                  To safely carry out [discipline] [pm type] for signs of damage or potential failures that may require maintenance attention.
                </p>
              </div>
            </div>

            <div className="border-b border-border">
              <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
                <Shield className="w-5 h-5 text-destructive" />
                <span className="text-destructive font-bold">SAFETY</span>
              </div>
              <div className="px-4 py-4 bg-destructive/5">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">
                    Before commencing this work complete a <span className="font-bold text-destructive">TAKE 5</span> every time to check that no abnormal conditions exist.
                  </p>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    Minimum PPE: Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as per task or as required.
                  </p>
                </div>
                <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
                  <Zap className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-bold text-destructive">
                    NOTE: Always assume the equipment is LIVE until positively isolated, locked and tagged.
                  </p>
                </div>
              </div>
            </div>
          </div>

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
                <p>If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.</p>
              </div>
              <div className="bg-amber-500/10 border border-amber-300 rounded p-3 mt-3 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 font-medium text-xs">
                  NOTE: This is a visual inspection only, the equipment may be live. Exercise caution.
                </p>
              </div>
            </div>
          </div>

          {/* Inspections Header */}
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            INSPECTIONS
          </div>

          {/* Inspection Table Placeholder */}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[50%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✓</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[8%]">✗</th>
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
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" placeholder="" />
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
                <td className="border border-border px-2 py-2">
                  <span className="text-xs text-muted-foreground italic">[Value: _______]</span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Post-Task Activities */}
          <div className="border-t border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-primary" />
              POST-TASK ACTIVITIES
            </div>
            <div className="px-4 py-3 text-sm space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox className="h-4 w-4 mt-0.5" />
                <span>Area left clean and tidy</span>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox className="h-4 w-4 mt-0.5" />
                <span>All tools accounted for</span>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox className="h-4 w-4 mt-0.5" />
                <span>Defects reported to supervisor</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="border-t border-border">
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">COMMENTS:</div>
            <div className="p-3">
              <Textarea className="min-h-[80px] resize-none" placeholder="Enter comments here..." />
            </div>
          </div>

          {/* Sign Off */}
          <div className="border-t border-border">
            <div className="bg-green-500/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Sign-Off</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="px-4 py-2 text-left font-semibold">Checked By</th>
                    <th className="px-4 py-2 text-left font-semibold">Signature</th>
                    <th className="px-4 py-2 text-left font-semibold w-32">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2"><Input className="h-7 text-xs" /></td>
                    <td className="px-4 py-2"><div className="h-8 border border-border rounded bg-muted/30"></div></td>
                    <td className="px-4 py-2"><Input className="h-7 text-xs" type="date" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center">
            Tennant Creek Mining Operations – Inspection Form
          </div>
        </div>
      </div>
    </div>
  );
};
