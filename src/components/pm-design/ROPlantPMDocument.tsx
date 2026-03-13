import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Gauge } from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";
import { PMBannerHeader } from "./PMBannerHeader";

export const ROPlantPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "RO Plant Daily Inspection");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader
          title="Tenant Creek - RO Plant Inspection"
          subtitle="Mechanical Running PMs - Daily RO Plant Inspection (Fitter)"
        />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tenant Creek"
          plantArea="RO Plant"
          pmGroup="Mechanical"
          pmType="Inspection (Fitter)"
          frequency="Daily"
          assetNumber={pm?.assetNumber || ""}
          resources={pm?.resources || ""}
        />

        <SafetyPrecautionsSection />

        <DynamicInspectionTable tasksData={pm?.tasks} title="SYSTEM, ASSEMBLY AND COMPONENTS CHECK" />

        {/* Data Logging Table */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Gauge className="w-5 h-5 text-primary" />
            DATA LOGGING
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-1 py-2 text-center font-semibold">CT4001<br/><span className="font-normal text-muted-foreground">Feed</span><br/><span className="font-normal text-muted-foreground">µs/cm</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">CT4002<br/><span className="font-normal text-muted-foreground">Permeate</span><br/><span className="font-normal text-muted-foreground">µs/cm</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">PI-01<br/><span className="font-normal text-muted-foreground">Before Media</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">PI-02<br/><span className="font-normal text-muted-foreground">After Media</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">PT2001<br/><span className="font-normal text-muted-foreground">After Cartridge</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">PT2003<br/><span className="font-normal text-muted-foreground">Before Membrane</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">PT2002<br/><span className="font-normal text-muted-foreground">After Membrane</span><br/><span className="font-normal text-muted-foreground">bar</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">P-01<br/><span className="font-normal text-muted-foreground">Freq</span><br/><span className="font-normal text-muted-foreground">HZ</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">P-02<br/><span className="font-normal text-muted-foreground">Freq</span><br/><span className="font-normal text-muted-foreground">HZ</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">FT1001<br/><span className="font-normal text-muted-foreground">Brine</span><br/><span className="font-normal text-muted-foreground">lpm</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">FT1002<br/><span className="font-normal text-muted-foreground">Recirc</span><br/><span className="font-normal text-muted-foreground">lpm</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">FT1003<br/><span className="font-normal text-muted-foreground">Permeate</span><br/><span className="font-normal text-muted-foreground">lpm</span></th>
                  <th className="border border-border px-1 py-2 text-center font-semibold">TT5001<br/><span className="font-normal text-muted-foreground">Brine</span><br/><span className="font-normal text-muted-foreground">°C</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Array(13).fill(null).map((_, idx) => (
                    <td key={idx} className="border border-border px-1 py-3 text-center">
                      <Input className="h-7 text-xs text-center border-0 bg-transparent w-full" placeholder="" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
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
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">SIGN OFF</div>
          <div className="px-4 py-3 space-y-3">
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
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Name:</span><Input className="h-7" /></div>
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Signature:</span><div className="h-7 border border-border rounded bg-muted/30"></div></div>
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">Date:</span><Input className="h-7" type="date" /></div>
              <div className="grid grid-cols-[100px_1fr] items-center"><span className="text-sm font-medium">PM Duration:</span><Input className="h-7" /></div>
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
          Tennant Creek Mining Operations – Processing Plant Inspection Form
        </div>
      </div>
    </div>
  );
};
