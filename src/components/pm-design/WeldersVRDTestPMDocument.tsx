import { PMBannerHeader } from "./PMBannerHeader";
import { SafetyPrecautionsSection } from "./SafetyPrecautionsSection";
import { PMSignOffBlock } from "./PMSignOffBlock";
import { PMMetadataGrid } from "./PMMetadataGrid";
import { usePMasterList } from "@/hooks/usePMData";
import { DynamicInspectionTable } from "./DynamicInspectionTable";

export const WeldersVRDTestPMDocument = () => {
  const { pms } = usePMasterList();
  const pm = pms.find((p) => p.pmName === "Welders VRD Test & Tag Inspection 3-Monthly");

  return (
    <div className="bg-background">
      <div className="border-2 border-border">
        <PMBannerHeader title="3 Monthly Welders Preventative Maintenance Task Sheet" subtitle="Electrical 12 Weekly Service" />

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

        <section className="border-t-2 border-foreground" data-pdf-section>
          <div className="bg-foreground text-background text-xs font-bold px-3 py-1 uppercase tracking-wide">
            Preparation
          </div>
          <ul className="text-xs px-4 py-2 space-y-1 list-disc list-inside">
            <li>Ensure all meters are within calibrated dates.</li>
            <li>Ensure all welding testing is performed in designated hot work area.</li>
            <li>Ensure all parts, materials and tooling are available and prepared prior to requesting machine for service.</li>
          </ul>
        </section>

        <SafetyPrecautionsSection />

        <section className="border-t-2 border-foreground" data-pdf-section>
          <div className="bg-foreground text-background text-center text-xs font-bold py-1 uppercase tracking-wide">
            Welder Details
          </div>
          <div className="grid grid-cols-3 text-xs border-b border-border" data-pdf-break>
            <div className="border-r border-border px-2 py-1.5 font-bold">
              Welder Make: <span className="font-normal">____________________</span>
            </div>
            <div className="border-r border-border px-2 py-1.5 font-bold">
              Model: <span className="font-normal">____________________</span>
            </div>
            <div className="px-2 py-1.5 font-bold">
              Serial Number: <span className="font-normal">____________________</span>
            </div>
          </div>
        </section>

        <DynamicInspectionTable tasksData={pm?.tasks} />

        <section className="border-t-2 border-foreground" data-pdf-section>
          <div className="bg-foreground text-background text-center text-xs font-bold py-1 uppercase tracking-wide">
            Test Instruments (Record Serial Numbers)
          </div>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-2 py-1 text-left font-semibold">Instrument</th>
                <th className="border border-border px-2 py-1 text-left font-semibold">Make</th>
                <th className="border border-border px-2 py-1 text-left font-semibold">Model</th>
                <th className="border border-border px-2 py-1 text-left font-semibold">Calibration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-2 py-1.5">Insulation Resistance Meter</td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
              </tr>
              <tr>
                <td className="border border-border px-2 py-1.5">VRD Tester</td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
                <td className="border border-border px-2 py-1.5"></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="border-t-2 border-foreground" data-pdf-section>
          <div className="bg-foreground text-background text-center text-sm font-bold py-1.5 uppercase tracking-wide" data-pdf-break>
            SafeTac VRDT Series 3 – Description & Operation
          </div>
          <div className="px-4 py-3 text-xs space-y-3 leading-relaxed">
            <p data-pdf-break>
              Series VRD tester is designed to test the turn on & turn off DC voltage levels of any DC MMA welding machine for compliance to Australian Standards 1674.2 2007.
            </p>
            <p data-pdf-break>
              The current law states when the resistance across the output terminal's of a welding machine drops to below 200 Ohms the VRD should turn off and reduced output will increase to full OCV. When the resistance across the output terminals increases to above 200 Ohms then the VRD should turn on reducing the output level to a level deemed safe by AS 1674.2 2007 that level being 35 VDC peak.
            </p>
            <p data-pdf-break>
              The time taken to switch from high OCV to Low OCV should be less than 300 milli seconds.
            </p>
            <p data-pdf-break>
              AS 1674.2 2007 also states some method of indicating when the output of the welding machine is at a reduced value should be provided – typically a green light for safe (Reduced OCV) & a Red light for Danger (Full OCV).
            </p>
            <p className="italic" data-pdf-break>Note: To test the switching time a recording storage oscilloscope should be used.</p>

            <div data-pdf-break>
              <p className="font-bold underline mb-1">VRD Tester 200 Ohm Resistor Checking Procedure:</p>
              <p>For the test to comply with AS 1674.2 a precision 200 Ohm resistor is internally fitted, this value can be checked periodically by placing a calibrated ohm meter across the input terminals of the tester resistance should measure 200 Ohms plus or minus 1% at 25 degrees centigrade.</p>
            </div>

            <div data-pdf-break>
              <p className="font-bold underline mb-1">VRD Tester Voltage Level Indicator Operation:</p>
              <p>The unit is fitted with a Green LED to indicate the output voltage is less than 35.2 volts DC & a Flashing Red led to indicate the output voltage is greater than 35.8 Volts DC. There is about 1 volt of hysteresis between the green & red lights.</p>
            </div>

            <div data-pdf-break>
              <p className="font-bold underline mb-1">VRD Tester Voltage Level Indicator Calibration Check Procedure:</p>
              <p>To test the correct operation of the indicators place a calibrated voltmeter across the output leads of the tester. Place a variable voltage DC power supply (0 to 40 Volts or higher) across the input leads of the tester. Increase the input voltage to the tester from 0 to about 35.8 VDC & observe the transition point from Green to Flashing red – this should be around 35.8 VDC then reduce the voltage to below 35.4 VDC this time observing when the lights change from flashing red to green, this should occur around 34.2 VDC.</p>
            </div>

            <div data-pdf-break>
              <p className="font-bold underline mb-1">VRD Tester Connection:</p>
              <p>If using a portable VRD connect the input leads of the VRD tester to the output leads of the VRD. If using a machine with an inbuilt VRD connect input leads of the VRD tester to the stick welding terminals of the welding machine. Connect welding leads (Electrode holder & Work clamp) to output of VRD tester, set current on welder to around 100 amps for a 2.5mm electrode then turn on welder.</p>
            </div>

            <div data-pdf-break>
              <p className="font-bold underline mb-1">VRD Tester Indicators:</p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>If no lights are on press the red button on the tester – Green light should turn on.</li>
                <li>If flashing green/red alternately at a fast rate battery is flat & needs changing.</li>
                <li>If LED is flashing Red at turn on then either the welder is not fitted with a compliant VRD or VRD needs calibration.</li>
                <li>If Green light is on – weld on a piece of scrap material – light will change to flashing red if voltage exceeds 35.8 Volts DC.</li>
                <li>If when welding is complete Red light is still flashing & will not return to Green then VRD needs calibration.</li>
                <li>When unit is disconnected and not used for around 3 minutes device will turn off to conserve battery life.</li>
              </ul>
            </div>

            <div className="border-t border-border pt-2 mt-2 text-[10px] text-muted-foreground" data-pdf-break>
              <p>Calibration should be checked every 3 months, note unit is fitted with industrial micro processor & a temperature stabilized precision voltage reference to ensure very little change in calibration over time.</p>
              <p className="mt-1">Replace 3.7 Volt Lithium Ion batteries – available from SafeTac or SafeTac distributors. www.vrd.com.au</p>
            </div>
          </div>
        </section>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – 3 Monthly Welders VRD Test & Tag Inspection" />
      </div>
    </div>
  );
};
