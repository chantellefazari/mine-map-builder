import { Input } from "@/components/ui/input";
import { 
  ClipboardCheck,
  User,
  Calendar,
} from "lucide-react";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";


const serviceInfoFields = [
  { id: 1, item: "Building Location", action: "Record" },
  { id: 2, item: "Room Name/Number", action: "Record" },
  { id: 3, item: "Location within room", action: "Record" },
  { id: 4, item: "Fed From", action: "Record" },
  { id: 5, item: "Circuit number", action: "Record" },
  { id: 6, item: "Make of Air Conditioner", action: "Record" },
  { id: 7, item: "KW rating", action: "Record" },
  { id: 8, item: "Model Number Indoor", action: "Record" },
  { id: 9, item: "Serial Number Indoor", action: "Record" },
  { id: 10, item: "Model Number Outdoor", action: "Record" },
  { id: 11, item: "Serial Number Outdoor", action: "Record" },
];

const testItems = [
  { id: 1, item: "Clean Air Filters", action: "Check" },
  { id: 2, item: "Brush and Clean indoor unit housing", action: "Check" },
  { id: 3, item: "Brush and Clean outdoor unit housing", action: "Check" },
  { id: 4, item: "Clean Condensate Tray and flush water down drain", action: "Check" },
  { id: 5, item: "Check electrical connections", action: "Check" },
  { id: 6, item: "Check pipework insulation", action: "Check" },
  { id: 7, item: "Check Mounting supports", action: "Check" },
  { id: 8, item: "Check for any signs of rust", action: "Check" },
];

export const ACInspectionPMDocument = () => {
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
              <h1 className="text-2xl font-bold tracking-wide text-primary">Air Conditioner Service</h1>
              <p className="text-base mt-1 text-primary/80">3 Monthly Inspection</p>
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
              <div className="px-2 py-1.5">Tennant Creek</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
              <div className="px-2 py-1.5"></div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-primary" />
                Frequency:
              </div>
              <div className="px-2 py-1.5 font-medium">3 Monthly</div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
              <div className="px-2 py-1.5">Electrical</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-border">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
              <div className="px-2 py-1.5">Service</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
              <div className="px-2 py-1.5"></div>
            </div>
          </div>
        </div>

        {/* Safety Precautions */}
        <SafetyPrecautionsSection />

        {/* Service Item Information */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          1. SERVICE ITEM
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-center font-semibold w-[8%]">#</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[52%]">Item</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Action</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[30%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {serviceInfoFields.map((field) => (
              <tr key={field.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-center font-medium">{field.id}</td>
                <td className="border border-border px-3 py-2">{field.item}</td>
                <td className="border border-border px-2 py-2 text-center">{field.action}</td>
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Test Performed Section */}
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-y border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          2. TEST PERFORMED – DEAD TESTS
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-center font-semibold w-[8%]">#</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[52%]">Item</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Action</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[30%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {testItems.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 text-center font-medium">{item.id}</td>
                <td className="border border-border px-3 py-2">{item.item}</td>
                <td className="border border-border px-2 py-2 text-center">{item.action}</td>
                <td className="border border-border px-2 py-2">
                  <Input className="h-7 text-xs border-0 bg-transparent" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Sign Off Section */}
        <div className="border-t border-border">
          <div className="bg-muted px-4 py-2 font-bold text-sm border-b border-border">Tested By:</div>
          <div className="grid grid-cols-3 gap-0">
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Name:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-r border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Signature:</div>
              <div className="px-3 py-2"><Input className="h-7" /></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-border">
              <div className="bg-muted px-3 py-2 text-sm font-medium border-r border-border">Date:</div>
              <div className="px-3 py-2"><Input className="h-7" type="date" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
