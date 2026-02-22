import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ClipboardCheck } from "lucide-react";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

const sampleTasks = [
  { id: "1", description: "Check motor temperature and compare to baseline" },
  { id: "2", description: "Inspect drive belt tension and condition" },
  { id: "3", description: "Verify oil level within acceptable range" },
  { id: "4", description: "Listen for abnormal bearing noise or vibration" },
  { id: "5", description: "Inspect guards and covers for secure attachment" },
  { id: "6", description: "Check for fluid leaks (oil, coolant, hydraulic)" },
];

export const CheckboxLayoutPreview = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Banner */}
        <div className="relative">
          <img src={tennantBanner} alt="Tennant Mines Banner" className="w-full h-auto" />
          <div className="absolute bottom-0 left-4 h-[60%] flex items-center">
            <img src={tennantIcon} alt="Tennant Mines" className="h-14" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-center justify-center">
            <h1 className="text-2xl font-bold tracking-wide text-primary">Standardised Checkbox Layout — Review</h1>
          </div>
        </div>

        {/* Explanation Banner */}
        <div className="bg-primary/5 border-b border-border px-6 py-4 text-sm space-y-2">
          <p className="font-bold text-primary">Proposed Standard: 2-Column Status + Comments</p>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 text-xs">
            <li><strong>✓ (OK)</strong> — Item is serviceable / passes inspection</li>
            <li><strong>✗ (Defect)</strong> — Item has a defect or requires attention</li>
            <li><strong>Comments</strong> — Free text for notes, defect details, or work order references</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">This replaces all variations (single OK box, 3-box serviceable/defective/urgent, etc.) with one consistent layout across all PMs.</p>
        </div>

        {/* Sample Section */}
        <div>
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            Sample Inspection Section
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted border-b border-border">
                <th className="px-3 py-1.5 text-left font-semibold w-12">#</th>
                <th className="px-3 py-1.5 text-left font-semibold">Inspection Item</th>
                <th className="px-3 py-1.5 text-center font-semibold w-20">Serviceable</th>
                <th className="px-3 py-1.5 text-center font-semibold w-20">Defective</th>
                <th className="px-3 py-1.5 text-left font-semibold w-56">Comments</th>
              </tr>
            </thead>
            <tbody>
              {sampleTasks.map((task, index) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-3 py-1.5 text-center">{index + 1}</td>
                  <td className="px-3 py-1.5">{task.description}</td>
                  <td className="px-3 py-1.5 text-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
                  </td>
                  <td className="px-3 py-1.5">
                    <Input className="h-6 text-xs" placeholder="" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-muted/30 px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
          Tennant Creek Mining Operations — Standard PM Inspection Layout
        </div>
      </div>
    </div>
  );
};
