import { Checkbox } from "@/components/ui/checkbox";
import tennantBanner from "@/assets/tennant-banner-new.png";
import tennantIcon from "@/assets/tennant-icon.png";

export const ReagentsPMDocument = () => {
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
              Reagents Weekly Inspection
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
              <div className="p-1.5">Reagents</div>
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
            {/* Cyanide Monorail */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                06-TK-001, 06-AG-001 - Cyanide Monorail
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check operation of crane</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Inspect Crane hook for any damage</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check lifting equipment is in test date</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Cyanide Mixing Tank and Agitator */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                06-TK-001, 06-AG-001 - Cyanide Mixing Tank and Agitator
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check Tank for any damage or rust</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check that there is no obstruction on agitator motor fan</td>
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

            {/* Cyanide Solution Transfer Pump */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                06-PU-001 - Cyanide Solution Transfer Pump
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump condition</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump for heat, noise and vibration</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check inlet and outlet connection, look for leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Cyanide Dosing Pump (Duty) */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                06-PU-002 - Cyanide Dosing Pump (Duty)
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump condition</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump for heat, noise and vibration</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check inlet and outlet connection, look for leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Cyanide Dosing Pump (Standby) */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                06-PU-003 - Cyanide Dosing Pump (Standby)
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump condition</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pump for heat, noise and vibration</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check inlet and outlet connection, look for leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Back Pressure Valve */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                V084 - Back Pressure Valve
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Visual inspection of Back Pressure Valve (stainless steel). Look for any rust, leaks on junctions or damages</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>

            {/* Cyanide Area Sump Pump */}
            <tr className="bg-gray-200">
              <td colSpan={5} className="border border-black p-1.5 font-bold">
                06-PU-004 - Cyanide Area Sump Pump
              </td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check pipework condition and look for leaks</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
            </tr>
            <tr>
              <td className="border border-black p-1.5">Check operation of sump pump</td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5 text-center"><Checkbox className="border-black" /></td>
              <td className="border border-black p-1.5"></td>
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
        <div className="p-2 min-h-[80px]">
          <p className="text-xs text-muted-foreground italic">Check overall tank condition. Look for any damage or rust.</p>
        </div>
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
