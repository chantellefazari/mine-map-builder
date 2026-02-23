import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

const serviceInfoFields = [
  { id: 1, task: "Building Location" },
  { id: 2, task: "Room Name/Number" },
  { id: 3, task: "Location within room" },
  { id: 4, task: "Fed From" },
  { id: 5, task: "Circuit number" },
  { id: 6, task: "Make of Air Conditioner" },
  { id: 7, task: "KW rating" },
  { id: 8, task: "Model Number Indoor" },
  { id: 9, task: "Serial Number Indoor" },
  { id: 10, task: "Model Number Outdoor" },
  { id: 11, task: "Serial Number Outdoor" },
];

const testItems = [
  { id: 1, task: "Clean Air Filters" },
  { id: 2, task: "Brush and Clean indoor unit housing" },
  { id: 3, task: "Brush and Clean outdoor unit housing" },
  { id: 4, task: "Clean Condensate Tray and flush water down drain" },
  { id: 5, task: "Check electrical connections" },
  { id: 6, task: "Check pipework insulation" },
  { id: 7, task: "Check Mounting supports" },
  { id: 8, task: "Check for any signs of rust" },
];

const renderTable = (tasks: { id: number; task: string }[], sectionTitle: string) => (
  <div className="border-b border-border">
    <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
      <ClipboardCheck className="w-5 h-5 text-primary" />
      {sectionTitle}
    </div>
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-muted">
          <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th>
          <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
          <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
          <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((item) => (
          <tr key={item.id} className="hover:bg-muted/30">
            <td className="border border-border px-3 py-2">{item.task}</td>
            <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" /></div></td>
            <td className="border border-border px-2 py-2 text-center"><div className="flex justify-center"><Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" /></div></td>
            <td className="border border-border px-2 py-4"></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ACInspectionPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Air Conditioner Service");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="Air Conditioner Service" subtitle="Electrical 12 Weekly Service" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Service"
          frequency="12 Weekly"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {renderTable(serviceInfoFields, "1. SERVICE ITEM INFORMATION")}
        {renderTable(testItems, "2. SERVICE TASKS")}

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Air Conditioner Service Form" />
      </div>
    </div>
  );
};
