import { Checkbox } from "@/components/ui/checkbox";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

export const ThickenerPMDocument = () => {
  return (
    <div className="bg-white text-black max-w-4xl mx-auto shadow-lg print:shadow-none">
      {/* Branded Header Banner */}
      <div className="relative h-20 overflow-hidden">
        <img 
          src={tennantBanner} 
          alt="Tennant Mines Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="flex items-center gap-4 pl-4">
            <img 
              src={tennantIcon} 
              alt="Tennant Mines" 
              className="h-14 w-auto"
            />
          </div>
          <div className="flex-1 flex justify-center pr-20">
            <h1 className="text-2xl font-bold text-[#D4AF37] tracking-wide">
              Thickener Weekly Inspection
            </h1>
          </div>
        </div>
      </div>

      {/* Document Header */}
      <div className="border border-black">
        <div className="grid grid-cols-2 text-xs">
          {/* Left Column */}
          <div className="border-r border-black">
            <div className="grid grid-cols-[120px_1fr] border-b border-black">
              <div className="bg-gray-100 p-1.5 font-semibold border-r border-black">Plant Area:</div>
              <div className="p-1.5">Thickener</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-black">
              <div className="bg-gray-100 p-1.5 font-semibold border-r border-black">Frequency:</div>
              <div className="p-1.5">Weekly</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-gray-100 p-1.5 font-semibold border-r border-black">Date:</div>
              <div className="p-1.5"></div>
            </div>
          </div>
          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[120px_1fr] border-b border-black">
              <div className="bg-gray-100 p-1.5 font-semibold border-r border-black">Resource/s:</div>
              <div className="p-1.5">1x Fitter (2 hrs)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr] border-b border-black">
              <div className="bg-gray-100 p-1.5 font-semibold border-r border-black">PM Type:</div>
              <div className="p-1.5">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <div className="bg-gray-100 p-1.5 font-semibold border-r border-black">Asset Number:</div>
              <div className="p-1.5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Procedure */}
      <div className="border border-t-0 border-black p-2">
        <p className="text-xs">
          <span className="font-semibold">Procedure: </span>
          When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section. 
          If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.
        </p>
      </div>

      {/* Safety Notes */}
      <div className="border border-t-0 border-black">
        <div className="bg-gray-800 text-white p-1.5 font-semibold text-xs">
          Safety Notes
        </div>
        <div className="p-2 text-xs space-y-1">
          <p>1. Follow safety procedures at all times.</p>
          <p>2. Isolate equipment where required & ensure use of correct PPE.</p>
          <p>3. Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.</p>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="border border-t-0 border-black">
        <div className="bg-yellow-500 text-black p-1.5 font-semibold text-xs">
          Risk Assessment
        </div>
        <div className="p-2">
          <div className="flex gap-6 text-xs">
            <label className="flex items-center gap-2">
              <Checkbox className="border-black data-[state=checked]:bg-black" />
              <span>Take 5 Completed</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox className="border-black data-[state=checked]:bg-black" />
              <span>JHA Reviewed</span>
            </label>
            <label className="flex items-center gap-2">
              <Checkbox className="border-black data-[state=checked]:bg-black" />
              <span>SWMS Referenced</span>
            </label>
          </div>
        </div>
      </div>

      {/* Inspection Table */}
      <div className="border border-t-0 border-black">
        <div className="bg-gray-800 text-white p-1.5 font-semibold text-xs">
          Inspections
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1.5 text-left font-semibold">Task</th>
              <th className="border border-black p-1.5 text-center font-semibold w-14">OK</th>
              <th className="border border-black p-1.5 text-center font-semibold w-14">DEF</th>
              <th className="border border-black p-1.5 text-center font-semibold w-14">URG</th>
              <th className="border border-black p-1.5 text-left font-semibold w-44">Comments</th>
            </tr>
          </thead>
          <tbody>
            {/* Thickener Tank */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-TM-001 - Thickener Tank
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Inspect Thickener tank for leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check Thickener tank for signs of rust or damage</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check walkways, ladders and stairs for signs of rust or damage</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Hydraulic Power Pack */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-HP-201 - Hydraulic Power Pack
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check fluid level in hydraulic tank (2/3rds on sight glass)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check the indicator on filters</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check oil breather is free from dirt build-up</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Visually check reservoir covers, solenoids and hose connections for oil leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check drip tray and drain valve are free from dirt build-up</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Thickener Drive */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-TM-001 - Thickener Drive
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Visually check gearbox for any oil leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check for any undue noise or vibration</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">HS gearbox temperature (&lt; 80°C)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Temp: _______ °C</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">LS gearbox temperature (&lt; 80°C)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Temp: _______ °C</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Ensure all safety guards are fitted correctly</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Rake Lift */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-TM-001 - Rake Lift
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Ensure there are no foreign objects hindering the rake lift operation</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check the rake lift cylinders for leaks on the seals and connections</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Grease Rake Lift - 8 x Grease points</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">GP Grease</td>
            </tr>

            {/* Control Panel & Instruments */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-TM-001 - Control Panel & Instruments (PN 205)
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Press Lamp Test on panel to check indicator lights</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Floc Box */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-TM-001 - Floc Box
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check for signs of leakage at the fittings between the Floc Box, valves and piping</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Visually inspect the box for signs of build-up of solids</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Flocculant Powder Hopper */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-HP-001 - Flocculant Powder Hopper
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Confirm heater is operational and area is warm and clean to prevent any blockage</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check Anti-Static powder hose for wear</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Ensure that all services are properly connected and check for any water or air leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Flocculant Mixing Tank */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-TK-001 - Flocculant Mixing Tank
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Inspect Dispersion Cylinder for any algae/scale build-up</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Inspect Dispersion Spigot and Nozzles for any gel build-up</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Underflow Pump A */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-PU-200A - Underflow Pump A
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Running or Standby (skip if pump on standby)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Running □ Standby □</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Bearing assembly temperature (&lt; 80°C)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Temp: _______ °C</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Gland water pressure (~400 kPa)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Pressure: _______ kPa</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check gland leakage and adjust if required</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Underflow Pump B */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-PU-200B - Underflow Pump B
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Running or Standby (skip if pump on standby)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Running □ Standby □</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Bearing assembly temperature (&lt; 80°C)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Temp: _______ °C</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Gland water pressure (~400 kPa)</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5">Pressure: _______ kPa</td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check gland leakage and adjust if required</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Thickener Sump Pump */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                12-PU-210 - Thickener Sump Pump
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump for heat, noise and vibration</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comments Section */}
      <div className="border border-t-0 border-black">
        <div className="bg-gray-100 p-1.5 font-semibold text-xs border-b border-black">
          Comments
        </div>
        <div className="p-2 min-h-[80px]"></div>
      </div>

      {/* Sign Off */}
      <div className="border border-t-0 border-black">
        <div className="bg-gray-100 p-1.5 font-semibold text-xs border-b border-black">
          Sign Off
        </div>
        <div className="p-2 text-xs">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Follow up work required:</span>
              <span>Yes / No (Circle)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Document update required:</span>
              <span>Yes / No (Circle)</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Name:</span>
              <span className="border-b border-black flex-1"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Signature:</span>
              <span className="border-b border-black flex-1"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Date:</span>
              <span className="border-b border-black flex-1"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="border border-t-0 border-black">
        <div className="bg-gray-100 p-1.5 font-semibold text-xs border-b border-black">
          Approval
        </div>
        <div className="p-2 text-xs space-y-2">
          <div className="grid grid-cols-[100px_1fr_80px_1fr_60px_1fr] gap-2 items-center">
            <span className="font-semibold">Supervisor:</span>
            <span className="border-b border-black"></span>
            <span className="font-semibold">Sign:</span>
            <span className="border-b border-black"></span>
            <span className="font-semibold">Date:</span>
            <span className="border-b border-black"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
