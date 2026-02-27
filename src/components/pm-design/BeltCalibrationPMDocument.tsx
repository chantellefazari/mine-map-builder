import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PMSignOffBlock } from "./PMSignOffBlock";

export const BeltCalibrationPMDocument = () => {
  return (
    <div className="bg-background min-h-full">
      <div className="border-2 border-border">
        {/* Page Header - Red diamond pattern banner */}
        <div className="flex items-center border-b border-border">
          <div className="bg-destructive/10 px-4 py-3 flex items-center gap-3 w-[120px] border-r border-border">
            <span className="font-bold text-sm text-destructive">ASPECT</span>
          </div>
          <div className="flex-1 px-4 py-3 text-center">
            <h1 className="text-xl font-bold tracking-wide text-destructive">Monthly Weightometer Calibration</h1>
          </div>
          <div className="px-4 py-3 border-l border-border">
            <span className="text-xs font-semibold">Statutory Inspection</span>
          </div>
        </div>

        {/* NAME / DATE / CONVEYOR fields */}
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b border-border">
              <td className="border border-border px-3 py-2 font-bold w-[33%]">NAME :</td>
              <td className="border border-border px-3 py-2 font-bold w-[33%]">DATE:</td>
              <td className="border border-border px-3 py-2 font-bold w-[34%]">CONVEYOR:</td>
            </tr>
            <tr className="border-b border-border">
              <td className="border border-border px-3 py-6"></td>
              <td className="border border-border px-3 py-6"></td>
              <td className="border border-border px-3 py-6"></td>
            </tr>
          </tbody>
        </table>

        {/* STATIONARY CHECKS – PM INSPECTION */}
        <div className="px-3 py-2 font-bold text-sm border-b border-border underline">
          STATIONARY CHECKS – PM INSPECTION
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-2 py-2 text-center font-semibold w-[6%]">Step</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[60%]">Action/Steps</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Pass / Fail</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[24%]">Results and Comments</th>
            </tr>
          </thead>
          <tbody>
            {/* Step 1 */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">1</td>
              <td className="border border-border px-3 py-2 align-top">
                <p className="font-bold uppercase text-xs mb-2">
                  MAKE SURE THE BELT & SCALE ARE EMPTY AND CLEAN, ALSO BE CERTAIN THE CALIBRATION WEIGHTS ARE IN THE 'UP' POSITION OR HANDLES ARE IN THE HORIZONTAL POSITION.
                </p>
                <div className="flex justify-center my-2">
                  <img
                    src="/images/belt-cal-handles-position.jpg"
                    alt="Handles in horizontal zero & run position"
                    className="max-h-[140px] object-contain"
                  />
                </div>
              </td>
              <td className="border border-border px-2 py-2 text-center align-top">
                <div className="flex justify-center gap-1 items-center">
                  <Checkbox className="h-4 w-4" /><span className="text-xs">Y</span>
                  <span className="text-xs">/</span>
                  <Checkbox className="h-4 w-4" /><span className="text-xs">N</span>
                </div>
              </td>
              <td className="border border-border px-3 py-6"></td>
            </tr>

            {/* Step 2 */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">2</td>
              <td className="border border-border px-3 py-2">
                Visual check the scale to ensure no material could be affecting the readings. Check all rollers for flat spots or material build-up. Clean/replace as required.
              </td>
              <td className="border border-border px-2 py-2 text-center">
                <div className="flex justify-center gap-1 items-center">
                  <Checkbox className="h-4 w-4" /><span className="text-xs">Y</span>
                  <span className="text-xs">/</span>
                  <Checkbox className="h-4 w-4" /><span className="text-xs">N</span>
                </div>
              </td>
              <td className="border border-border px-3 py-6"></td>
            </tr>

            {/* Step 3 */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">3</td>
              <td className="border border-border px-3 py-2">
                Start the conveyor belt and allow a couple of minutes for the belt to settle down.
              </td>
              <td className="border border-border px-2 py-2 text-center">
                <div className="flex justify-center gap-1 items-center">
                  <Checkbox className="h-4 w-4" /><span className="text-xs">Y</span>
                  <span className="text-xs">/</span>
                  <Checkbox className="h-4 w-4" /><span className="text-xs">N</span>
                </div>
              </td>
              <td className="border border-border px-3 py-6"></td>
            </tr>

            {/* Step 4 - Auto Zero */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">4</td>
              <td className="border border-border px-3 py-2 align-top">
                <p className="mb-2">With the belt running, begin the "Auto Zero" procedure as follows</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                  <li>Press and hold the "Auto Zero" button for five seconds during which time the MODE WINDOW will read "hold to zero"</li>
                  <li>After the five seconds it should read "auto zero (wait)". The Controller will now perform an Auto Zero. You can cancel an Auto Zero at any time by pressing Reset.</li>
                </ul>

                <div className="flex items-center justify-center gap-4 my-3">
                  <img
                    src="/images/belt-cal-auto-zero-before.jpg"
                    alt="Auto Zero - Before"
                    className="max-h-[100px] object-contain"
                  />
                  <span className="text-lg font-bold">→</span>
                  <img
                    src="/images/belt-cal-auto-zero-after.jpg"
                    alt="Auto Zero - After"
                    className="max-h-[100px] object-contain"
                  />
                </div>

                <ul className="list-disc list-inside space-y-1 ml-2 text-xs mb-2">
                  <li>On completion of the Auto Zero cycle, the Controller RATE WINDOW should read zero. Note the rate may bounce around zero to some extent. This is normally due to variations in belt thickness and/or the condition of the belt.</li>
                </ul>

                <p className="text-xs mt-2 italic">
                  <strong>Note:</strong> Severe Zero rate bounce is generally caused by mechanical issues in the weighing area, examine & rectify any issues with the rollers, belt, belt tracking & string line check if all else fails.
                </p>

                <div className="mt-3 space-y-1 text-xs">
                  <p className="ml-4">Conveyor Number: BC-100</p>
                  <p className="ml-4">Calibration Weight: 45.04kg</p>
                </div>
              </td>
              <td className="border border-border px-2 py-2 text-center align-top">
                <div className="flex justify-center gap-1 items-center">
                  <Checkbox className="h-4 w-4" /><span className="text-xs">Y</span>
                  <span className="text-xs">/</span>
                  <Checkbox className="h-4 w-4" /><span className="text-xs">N</span>
                </div>
              </td>
              <td className="border border-border px-3 py-6"></td>
            </tr>

            {/* As Found / As Left Result */}
            <tr className="border-b border-border">
              <td colSpan={4} className="border border-border px-3 py-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-xs">As Found Result</span>
                    <div className="border border-border h-10 mt-1 bg-muted/30"></div>
                  </div>
                  <div>
                    <span className="font-semibold text-xs">As Left Result</span>
                    <div className="border border-border h-10 mt-1 bg-muted/30"></div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Warning banner */}
            <tr className="border-b border-border">
              <td colSpan={4} className="border border-border px-3 py-2 text-center">
                <span className="font-bold text-destructive underline text-sm">AN AUTO ZERO MUST BE PERFORMED BEFORE AN AUTO SPAN!</span>
              </td>
            </tr>

            {/* Step 5 - Auto Span */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">5</td>
              <td className="border border-border px-3 py-2 align-top">
                <p className="font-bold mb-2">Completing an Auto Span</p>
                <ol className="list-[lower-alpha] list-inside space-y-1.5 ml-2 text-xs mb-3">
                  <li>With the conveyor belt running, press and hold the AUTO SPAN button for five seconds. The MODE window should display "Lower Cal Weight".</li>
                  <li>Lower both calibration weights.</li>
                  <li>Press the AUTO SPAN button again to begin the span calibration immediately or alternatively the Auto Span cycle will begin automatically after 30.</li>
                  <li>The MODE WINDOW should read "auto span (wait)".</li>
                  <li>You can cancel an Auto Span at any time by pressing the Reset button.</li>
                  <li>On completion of the Auto Span cycle, the Controller RATE WINDOW will show "XXX" TPH. Note the rate may bounce around to some extent. This is normally due to variations in belt thickness and/or the condition of the belt.</li>
                  <li>After the Auto Span cycle is complete, the MODE WINDOW will change to "raise cal weight" until the calibration weight is lifted, or the RESET button is pressed momentarily. Remember to raise the cal weight to avoid false rate readings.</li>
                </ol>

                <div className="space-y-3 my-3">
                  <img
                    src="/images/belt-cal-auto-span-screens.jpg"
                    alt="Auto Span screen sequence"
                    className="max-h-[160px] object-contain mx-auto"
                  />
                  <img
                    src="/images/belt-cal-lower-weights.jpg"
                    alt="Lower calibration weights and span procedure"
                    className="max-h-[200px] object-contain mx-auto"
                  />
                </div>
              </td>
              <td className="border border-border px-2 py-2 text-center align-top">
                <div className="flex justify-center gap-1 items-center">
                  <Checkbox className="h-4 w-4" /><span className="text-xs">Y</span>
                  <span className="text-xs">/</span>
                  <Checkbox className="h-4 w-4" /><span className="text-xs">N</span>
                </div>
              </td>
              <td className="border border-border px-3 py-6"></td>
            </tr>

            {/* Step 6 - Running the system */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">6</td>
              <td className="border border-border px-3 py-2 align-top">
                <p className="font-bold mb-2">Running the system</p>
                <p className="text-xs mb-2">Your system is ready to run, please complete the final checks.</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>With the calibration weights up (in the storage position), the rate should be zero.</li>
                  <li>Reset the total by holding the RESET button for five seconds.</li>
                  <li>Begin running material on the belt, the rate and total will increase.</li>
                  <li>Press the FUNCTION key momentarily to toggle between the flow rate (tons per hour) and the present belt speed (meters per minute).</li>
                </ul>
              </td>
              <td className="border border-border px-2 py-2 text-center align-top">
                <div className="flex justify-center gap-1 items-center">
                  <Checkbox className="h-4 w-4" /><span className="text-xs">Y</span>
                  <span className="text-xs">/</span>
                  <Checkbox className="h-4 w-4" /><span className="text-xs">N</span>
                </div>
              </td>
              <td className="border border-border px-3 py-6"></td>
            </tr>

            {/* Step 7 - Span Calibration Flow Rates */}
            <tr className="border-b border-border">
              <td className="border border-border px-2 py-2 text-center font-bold align-top">7</td>
              <td colSpan={3} className="border border-border px-3 py-2 align-top">
                <p className="font-bold mb-2">Span Calibration Flow Rates</p>
                <p className="text-xs mb-2">
                  Below is a list of the belt weighers in the Mill Feed circuit. The table below lists the conveyor and the calibration weight and the calculated flow rate for the weigher.
                </p>
                <p className="font-bold text-xs mb-1">EXAMPLE</p>
                <p className="text-xs mb-3">
                  BC-100 has 2 x calibration weights totaling 45.04kg. The calculated flow rate for BC-100 with both calibration weights lowered is 133.3 tons per hour. On completion of the span calibration, the Rate screen should display a rate averaging 133.3 tons per hour, bearing in mind that the displayed rate will oscillate as described above.
                </p>

                {/* Calibration Reference Data */}
                <table className="w-full text-xs border-collapse mb-4">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="border border-border px-3 py-2 font-medium w-[40%]">Conveyor Number:</td>
                      <td className="border border-border px-3 py-2">BC-100</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border border-border px-3 py-2 font-medium">Calibration Weight:</td>
                      <td className="border border-border px-3 py-2">45.04 kg</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border border-border px-3 py-2 font-medium">Target Flow Rate:</td>
                      <td className="border border-border px-3 py-2">133.3 tph</td>
                    </tr>
                  </tbody>
                </table>

                {/* Recorded Data */}
                <p className="font-bold text-xs mb-2">Recorded Data</p>
                <table className="w-full text-xs border-collapse mb-2">
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="border border-border px-3 py-2 font-medium w-[40%]">Target</td>
                      <td className="border border-border px-3 py-2">133.3 tph</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border border-border px-3 py-2 font-medium">Actual Flow Rate</td>
                      <td className="border border-border px-3 py-6"></td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="border border-border px-3 py-2 font-medium">Variance</td>
                      <td className="border border-border px-3 py-6"></td>
                    </tr>
                  </tbody>
                </table>

                <p className="text-xs mt-2">
                  <strong>NOTE:</strong>
                </p>
                <ul className="list-disc list-inside text-xs ml-2">
                  <li className="font-bold">A maximum/minimum variance to be confirmed by site</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <PMSignOffBlock footerText="Tennant Creek Mining Operations – Monthly Weightometer Calibration Form" />
      </div>
    </div>
  );
};
