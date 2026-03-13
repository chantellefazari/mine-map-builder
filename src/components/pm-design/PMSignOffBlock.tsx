import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface PMSignOffBlockProps {
  footerText?: string;
  showElecCertNo?: boolean;
}

export const PMSignOffBlock = ({ footerText = "Tennant Creek Mining Operations – Inspection Form", showElecCertNo = false }: PMSignOffBlockProps) => {
  return (
    <div data-pdf-section data-pdf-adaptive-fit>
      {/* Comments */}
      <div className="border-t border-border">
        <div className="bg-muted px-3 py-1.5 font-semibold text-sm border-b border-border">COMMENTS:</div>
        <div className="px-3 py-2" data-pdf-comments-wrap>
          <Textarea
            className="min-h-[60px] resize-none"
            data-pdf-flex-comments
            placeholder="Enter comments here..."
          />
        </div>
      </div>

      <div data-pdf-keep-together>
        {/* Sign Off */}
        <div className="border-t border-border">
          <div className="bg-muted px-3 py-1.5 font-bold text-sm border-b border-border">SIGN OFF</div>
          <div className="px-4 py-2 space-y-2">
            <div className="grid grid-cols-2 gap-x-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-52">Follow up work required:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">Yes</span></div>
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">No</span></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-52">Document update required:</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">Yes</span></div>
                  <div className="flex items-center gap-1.5"><Checkbox className="h-4 w-4" /><span className="text-sm">No</span></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Name:</span><Input className="h-7" /></div>
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Signature:</span><div className="h-7 border border-border rounded bg-muted/30"></div></div>
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Date:</span><Input className="h-7" type="date" /></div>
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">PM Duration:</span><Input className="h-7" /></div>
              {showElecCertNo && (
                <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Elec. Cert No:</span><Input className="h-7" /></div>
              )}
            </div>
          </div>
        </div>

        {/* Approval */}
        <div className="border-t border-border">
          <div className="bg-primary/10 px-3 py-1.5 font-bold text-sm border-b border-border flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-primary">APPROVAL</span>
          </div>
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-muted border-b border-border"><th className="px-4 py-1.5 text-left font-semibold w-[20%]">Role</th><th className="px-4 py-1.5 text-left font-semibold w-[25%]">Name</th><th className="px-4 py-1.5 text-left font-semibold w-[25%]">Sign</th><th className="px-4 py-1.5 text-left font-semibold w-[30%]">Date</th></tr></thead>
            <tbody><tr className="border-b border-border"><td className="px-4 py-1.5 font-medium">Supervisor</td><td className="px-4 py-1.5"><Input className="h-7 text-xs" /></td><td className="px-4 py-1.5"><div className="h-7 border border-border rounded bg-muted/30"></div></td><td className="px-4 py-1.5"><Input className="h-7 text-xs" type="date" /></td></tr></tbody>
          </table>
        </div>

        <div className="bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground text-center">
          {footerText}
        </div>
      </div>
    </div>
  );
};
