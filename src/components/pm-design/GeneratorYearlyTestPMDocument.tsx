import { ClipboardCheck, Zap } from "lucide-react";
import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";

const deadTestItems = [
  { id: 1, item: "Multifunction Unit type", subItems: ["Separate windings", "Isolation Transformer fitted", "Multi-position/multi-contact switch installed"], action: "Test" },
  { id: 2, item: "Over current and Short circuit protection provided on generator windings", action: "Check" },
  { id: 3, item: "Neutral of 240V output bonded to earth (MEN)", action: "Check" },
  { id: 4, item: "30mA Residual Current Device (type II) fitted to all outlets", action: "Check" },
];

const insulationTests = [
  { id: "a", label: "U-V", voltage: "1000V" },
  { id: "b", label: "V-W", voltage: "1000V" },
  { id: "c", label: "W-U", voltage: "1000V" },
  { id: "d", label: "U-E", voltage: "500V" },
  { id: "e", label: "V-E", voltage: "500V" },
  { id: "f", label: "W-E", voltage: "500V" },
];

const continuityTests = [
  { id: "a", label: "U1-U2" },
  { id: "b", label: "V1-V2" },
  { id: "c", label: "W1-W2" },
];

const visualChecks = [
  { id: 7, item: "Frame of Generator bonded to main earth bar (<1Ω)", action: "Test" },
  { id: 8, item: "Earth Terminal on all outlets bonded to main earth bar (<1Ω)", action: "Test" },
  { id: 9, item: "All General-Purpose Outlets individually switched", action: "Check" },
  { id: 10, item: "Flexible equipotential bonding conductor provided", action: "Check" },
  { id: 11, item: "Equipotential conductor fitted with approved G-Clamp or spring-loaded tong", action: "Check" },
  { id: 12, item: "Equipotential bonding conductor connected to unit main earth bar or unit frame", action: "Check" },
  { id: 13, item: "Visual inspection as to condition of all electrical components including wiring", action: "Check" },
  { id: 14, item: "Internal connection and cable glands are tight", action: "Check" },
  { id: 15, item: "Confirm lock out facilities on isolators and breakers are available", action: "Check" },
  { id: 16, item: "Confirm all terminations and busbar in generator DB tight", action: "Check" },
  { id: 17, item: "Confirm all cable and glands in generator DB are secure", action: "Check" },
  { id: 18, item: "Confirm all unused cable entries have been sealed", action: "Check" },
  { id: 19, item: "Confirm that all labelling and identification is complete and correct", action: "Check" },
  { id: 20, item: "Confirm that the generator is clean and free from damage", action: "Check" },
  { id: 21, item: "Bottom of any electrical cubicles are clean of dust", action: "Check" },
];

const generatorElectricalChecks = [
  { id: 1, item: "Confirm that the fire extinguisher fitted and compliant", action: "Check" },
  { id: 2, item: "Confirm that the Battery isolator is present, and it breaks contact", action: "Check" },
  { id: 3, item: "Confirm that the Start isolator is present, and it breaks contact", action: "Check" },
  { id: 4, item: "Confirm that there is an E-Stop present", action: "Check" },
];

const runningTests = [
  { id: 1, item: "Correct polarity", action: "Test" },
  { id: 2, item: "Injection test of RCD at idling position", action: "Test", hasReadings: true },
  { id: 3, item: "Push Button test of RCD", action: "Test" },
  { id: 4, item: "Emergency Stop", action: "Check", subItems: ["Test E-Stop shunts engine", "Does E-Stop need to be manually reset", "Once E-Stop is reset does the Engine restart"] },
  { id: 5, item: "Test Tag been placed with 6 Monthly Due Date", action: "Check" },
];

const renderTestTable = (items: { id: number | string; item: string; action: string; subItems?: string[] }[]) => (
  <table className="w-full text-xs border-collapse">
    <thead>
      <tr className="bg-muted">
        <th className="border border-border px-3 py-2 text-left font-semibold w-[60%]">System, assembly or components</th>
        <th className="border border-border px-2 py-2 text-center font-semibold w-[15%]">Action</th>
        <th className="border border-border px-3 py-2 text-center font-semibold w-[15%]">Record/Finding</th>
        <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Initial</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id} className="hover:bg-muted/30">
          <td className="border border-border px-3 py-2">
            {item.id}. {item.item}
            {item.subItems && (
              <ul className="ml-4 mt-1 text-xs text-muted-foreground">
                {item.subItems.map((sub, i) => (
                  <li key={i}>({i + 1}) {sub}</li>
                ))}
              </ul>
            )}
          </td>
          <td className="border border-border px-2 py-2 text-center">{item.action}</td>
          <td className="border border-border px-2 py-4"></td>
          <td className="border border-border px-2 py-4"></td>
        </tr>
      ))}
    </tbody>
  </table>
);

export const GeneratorYearlyTestPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Generator Electrical Test Yearly");

  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        <PMBannerHeader title="1Y Generator Electrical" subtitle="Inspection and Testing" />

        <PMMetadataGrid
          pmId={pm?.id}
          projectSite="Tennant Creek"
          plantArea=""
          pmGroup="Electrical"
          pmType="Inspection & Testing"
          frequency="52 Week"
          assetNumber={pm?.assetNumber}
          resources={pm?.resources}
        />

        <SafetyPrecautionsSection />

        {/* Dead Tests Section */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            1. GENERATOR – DEAD TESTS
          </div>
          {renderTestTable(deadTestItems)}
        </div>

        {/* Insulation Resistance Tests */}
        <div className="border-b border-border">
          <div className="bg-muted/50 px-4 py-2 font-semibold text-sm border-b border-border">
            5. Test Insulation Resistance of windings and circuits (&gt;1MΩ)
          </div>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {insulationTests.map((test) => (
                <tr key={test.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2 w-[20%]">{test.id}. {test.label}</td>
                  <td className="border border-border px-2 py-2 text-center w-[20%]">MΩ @ {test.voltage}</td>
                  <td className="border border-border px-2 py-4 w-[45%]"></td>
                  <td className="border border-border px-2 py-4 text-center w-[15%]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Continuity Tests */}
        <div className="border-b border-border">
          <div className="bg-muted/50 px-4 py-2 font-semibold text-sm border-b border-border">
            6. Continuity test of between windings (&lt;1Ω)
          </div>
          <table className="w-full text-xs border-collapse">
            <tbody>
              {continuityTests.map((test) => (
                <tr key={test.id} className="hover:bg-muted/30">
                  <td className="border border-border px-3 py-2 w-[20%]">{test.id}. {test.label}</td>
                  <td className="border border-border px-2 py-2 text-center w-[20%]">Ω</td>
                  <td className="border border-border px-2 py-4 w-[45%]"></td>
                  <td className="border border-border px-2 py-4 text-center w-[15%]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Checks */}
        <div className="border-b border-border">
          {renderTestTable(visualChecks)}
        </div>

        {/* Generator Electrical Checks */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            GENERATOR – ELECTRICAL
          </div>
          {renderTestTable(generatorElectricalChecks)}
        </div>

        {/* Running Tests */}
        <div className="border-b border-border">
          <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-primary" />
            2. RUNNING – OPERATIONAL TESTS
          </div>
          {renderTestTable(runningTests)}
        </div>

        {/* RCD Injection Test Readings */}
        <div className="border-b border-border p-4">
          <p className="text-sm font-medium mb-2">RCD Injection Test Readings:</p>
          <table className="w-48 text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-1">mA</th>
                <th className="border border-border px-2 py-1">mSec</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((row) => (
                <tr key={row}>
                  <td className="border border-border px-2 py-4"></td>
                  <td className="border border-border px-2 py-4"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Test Instruments */}
        <div className="border-b border-border">
          <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border">Test Instruments (record serial numbers)</div>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border border-border px-3 py-2 text-left font-medium">Make</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Model</th>
                <th className="border border-border px-3 py-2 text-left font-medium">Calibration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Insulation Resistance Meter</td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Voltage Meter</td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">RCD Tester</td>
                <td className="border border-border px-2 py-4"></td>
                <td className="border border-border px-2 py-4"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Generator Electrical Test Form" />
      </div>
    </div>
  );
};
