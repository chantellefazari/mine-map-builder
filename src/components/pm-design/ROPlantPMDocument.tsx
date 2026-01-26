import { useState } from "react";
import { AlertTriangle, Droplets, Gauge, Thermometer } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const hazardsList = [
  { id: "chemical", label: "Chemical", icon: "⚗️" },
  { id: "pressure", label: "Pressure", icon: "💨" },
  { id: "mechanical", label: "Mechanical", icon: "⚙️" },
  { id: "electrical", label: "Electrical", icon: "⚡" },
  { id: "slippery", label: "Slippery", icon: "💧" },
];

const requiredPPE = [
  "Steel Cap Boots",
  "Hard Hat", 
  "Safety Glasses",
  "Gloves (when required)",
];

const specialTooling = [
  "Conductivity meter (if required)",
  "Pressure gauge (backup)",
  "Cleaning materials",
];

export const ROPlantPMDocument = () => {
  const [selectedHazards, setSelectedHazards] = useState<string[]>(["chemical", "pressure"]);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazards(prev =>
      prev.includes(hazardId)
        ? prev.filter(id => id !== hazardId)
        : [...prev, hazardId]
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-black print:text-black">
      {/* Header */}
      <div className="border-2 border-black">
        <div className="bg-blue-600 text-white px-3 py-2">
          <h1 className="text-lg font-bold">Tenant Creek - RO Plant Inspection</h1>
          <p className="text-sm">Mechanical Running PMs - Daily RO Plant Inspection (Fitter)</p>
        </div>
        
        {/* Details Grid - 2 columns */}
        <div className="grid grid-cols-2 border-t border-black text-xs">
          {/* Left Column */}
          <div className="border-r border-black">
            <div className="grid grid-cols-[80px_1fr] border-b border-black">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">Project/Site:</div>
              <div className="px-2 py-1">Tenant Creek</div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-black">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">Asset Number:</div>
              <div className="px-2 py-1"></div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-black">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">Plant Area:</div>
              <div className="px-2 py-1">RO Plant</div>
            </div>
            <div className="grid grid-cols-[80px_1fr]">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">Resource/s:</div>
              <div className="px-2 py-1">1x Fitter (2 hrs)</div>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div className="grid grid-cols-[80px_1fr] border-b border-black">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">PM Group:</div>
              <div className="px-2 py-1">Mechanical</div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-black">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">PM Type:</div>
              <div className="px-2 py-1">Inspection (Fitter)</div>
            </div>
            <div className="grid grid-cols-[80px_1fr] border-b border-black">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">Frequency:</div>
              <div className="px-2 py-1">Daily</div>
            </div>
            <div className="grid grid-cols-[80px_1fr]">
              <div className="bg-gray-100 px-2 py-1 font-semibold border-r border-black">Date:</div>
              <div className="px-2 py-1"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Procedure */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-gray-200 px-3 py-1 font-bold text-sm border-b border-black">Procedure</div>
        <div className="px-3 py-2 text-xs">
          When a defect is identified and it is safe and practical to repair the defect, please do so and make a note of it in the comments section. If not, report the defect including materials required, trade discipline & estimated repair time for the supervisor to raise a work request.
        </div>
      </div>

      {/* TAKE 5 Warning */}
      <div className="border-2 border-t-0 border-black bg-yellow-50">
        <div className="flex items-center gap-3 px-3 py-2">
          <AlertTriangle className="w-8 h-8 text-yellow-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm text-yellow-800">TAKE 5 – STOP AND THINK!</p>
            <p className="text-xs text-yellow-700">Complete risk assessment before starting work. Identify all hazards and controls.</p>
          </div>
        </div>
      </div>

      {/* Safety Notes */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-red-600 text-white px-3 py-1 font-bold text-sm border-b border-black">
          Safety Notes
        </div>
        <div className="px-3 py-2 text-xs space-y-1">
          <p>1. Follow safety procedures at all times.</p>
          <p>2. Isolate equipment where required & ensure use of correct PPE.</p>
          <p>3. Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.</p>
        </div>
      </div>

      {/* Hazard Identification */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-orange-500 text-white px-3 py-1 font-bold text-sm border-b border-black">
          Hazard Identification
        </div>
        <div className="px-3 py-2">
          <div className="flex flex-wrap gap-2">
            {hazardsList.map((hazard) => (
              <button
                key={hazard.id}
                onClick={() => toggleHazard(hazard.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded border-2 text-xs font-medium transition-all",
                  selectedHazards.includes(hazard.id)
                    ? "bg-orange-100 border-orange-500 text-orange-800"
                    : "bg-gray-50 border-gray-300 text-gray-600 hover:border-gray-400"
                )}
              >
                <span>{hazard.icon}</span>
                <span>{hazard.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Required PPE & Special Tooling */}
      <div className="grid grid-cols-2 border-2 border-t-0 border-black">
        <div className="border-r border-black">
          <div className="bg-blue-500 text-white px-3 py-1 font-bold text-sm border-b border-black">
            Required PPE
          </div>
          <div className="px-3 py-2">
            <ul className="text-xs space-y-1">
              {requiredPPE.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <div className="bg-gray-600 text-white px-3 py-1 font-bold text-sm border-b border-black">
            Special Tooling
          </div>
          <div className="px-3 py-2">
            <ul className="text-xs space-y-1">
              {specialTooling.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-purple-600 text-white px-3 py-1 font-bold text-sm border-b border-black">
          Risk Assessment
        </div>
        <div className="px-3 py-2">
          <div className="flex flex-wrap gap-4 text-xs">
            {["Take 5", "JHA", "SWMS", "Other"].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <Checkbox className="h-4 w-4" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Inspection Tasks */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-green-600 text-white px-3 py-1 font-bold text-sm border-b border-black">
          System, Assembly and Components Check
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-r border-black px-2 py-1 text-left font-semibold">Inspection Task</th>
              <th className="border-b border-r border-black px-2 py-1 text-center font-semibold w-10">✓</th>
              <th className="border-b border-r border-black px-2 py-1 text-center font-semibold w-10">✗</th>
              <th className="border-b border-black px-2 py-1 text-center font-semibold w-10">N/A</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Inspect Reject Water Colour",
              "Inspect Cartridge Filter",
              "Record Date of Cartridge Filter Install",
              "Inspect/Record Level of Anti-scalant",
              "Inspect HMI for any present Faults",
              "Inspect Pipework/Valving for Damage or Leaks",
              "Inspect Dosing Pump Function (Should be set to 25 Pulses per minute)",
              "Check Aircon Operation and Cleanliness",
              "Inspect and Clean Container",
              "Inspect Flush Tank Level",
            ].map((task, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border-b border-r border-black px-2 py-1.5">{task}</td>
                <td className="border-b border-r border-black px-2 py-1.5 text-center">
                  <Checkbox className="h-4 w-4" />
                </td>
                <td className="border-b border-r border-black px-2 py-1.5 text-center">
                  <Checkbox className="h-4 w-4" />
                </td>
                <td className="border-b border-black px-2 py-1.5 text-center">
                  <Checkbox className="h-4 w-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Logging Table */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-blue-700 text-white px-3 py-1 font-bold text-sm border-b border-black flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Data Logging
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">CT4001<br/><span className="font-normal text-gray-600">Feed</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">CT4002<br/><span className="font-normal text-gray-600">Permeate</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">PI-01<br/><span className="font-normal text-gray-600">Before Media</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">PI-02<br/><span className="font-normal text-gray-600">After Media</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">PT2001<br/><span className="font-normal text-gray-600">After Cartridge</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">PT2003<br/><span className="font-normal text-gray-600">Before Membrane</span></th>
                <th className="border-b border-black px-1.5 py-1 text-center font-semibold">PT2002<br/><span className="font-normal text-gray-600">After Membrane</span></th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border-b border-r border-black px-1.5 py-0.5 text-center text-gray-500">µs/cm</th>
                <th className="border-b border-r border-black px-1.5 py-0.5 text-center text-gray-500">µs/cm</th>
                <th className="border-b border-r border-black px-1.5 py-0.5 text-center text-gray-500">bar</th>
                <th className="border-b border-r border-black px-1.5 py-0.5 text-center text-gray-500">bar</th>
                <th className="border-b border-r border-black px-1.5 py-0.5 text-center text-gray-500">bar</th>
                <th className="border-b border-r border-black px-1.5 py-0.5 text-center text-gray-500">bar</th>
                <th className="border-b border-black px-1.5 py-0.5 text-center text-gray-500">bar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-black px-1.5 py-3 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Second Data Table - Pumps and Flow */}
        <div className="overflow-x-auto border-t border-black">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">P-01 Freq<br/><span className="font-normal text-gray-600">Hz</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">P-02 Freq<br/><span className="font-normal text-gray-600">Hz</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">FT1001<br/><span className="font-normal text-gray-600">Brine (lpm)</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">FT1002<br/><span className="font-normal text-gray-600">Recirc (lpm)</span></th>
                <th className="border-b border-r border-black px-1.5 py-1 text-center font-semibold">FT1003<br/><span className="font-normal text-gray-600">Permeate (lpm)</span></th>
                <th className="border-b border-black px-1.5 py-1 text-center font-semibold">TT5001<br/><span className="font-normal text-gray-600">Brine Temp (°C)</span></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-r border-black px-1.5 py-3 text-center"></td>
                <td className="border-b border-black px-1.5 py-3 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comments */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-gray-200 px-3 py-1 font-bold text-sm border-b border-black">Comments</div>
        <div className="h-20 px-3 py-2"></div>
      </div>

      {/* Sign Off */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-gray-200 px-3 py-1 font-bold text-sm border-b border-black">Sign Off</div>
        <div className="grid grid-cols-2 text-xs">
          <div className="border-r border-b border-black px-3 py-2 flex items-center gap-2">
            <span className="font-semibold">Follow up work required:</span>
            <span>Yes / No (Circle)</span>
          </div>
          <div className="border-b border-black px-3 py-2 flex items-center gap-2">
            <span className="font-semibold">Document update required:</span>
            <span>Yes / No (Circle)</span>
          </div>
          <div className="border-r border-black px-3 py-2">
            <span className="font-semibold">Name:</span>
          </div>
          <div className="px-3 py-2">
            <span className="font-semibold">Signature:</span>
          </div>
          <div className="border-r border-t border-black px-3 py-2">
            <span className="font-semibold">Date:</span>
          </div>
          <div className="border-t border-black px-3 py-2">
            <span className="font-semibold">PM Duration:</span>
          </div>
        </div>
      </div>

      {/* Supervisor Approval */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-gray-800 text-white px-3 py-1 font-bold text-sm border-b border-black">Approval</div>
        <div className="text-xs">
          <div className="grid grid-cols-[100px_1fr_80px_1fr_60px_1fr] items-center border-b border-black">
            <div className="bg-gray-100 px-2 py-2 font-semibold border-r border-black">Supervisor:</div>
            <div className="px-2 py-2 border-r border-black">Name:</div>
            <div className="bg-gray-100 px-2 py-2 font-semibold border-r border-black">Sign:</div>
            <div className="px-2 py-2 border-r border-black"></div>
            <div className="bg-gray-100 px-2 py-2 font-semibold border-r border-black">Date:</div>
            <div className="px-2 py-2"></div>
          </div>
        </div>
      </div>

      {/* Revision History */}
      <div className="border-2 border-t-0 border-black">
        <div className="bg-gray-200 px-3 py-1 font-bold text-sm border-b border-black">Revision History</div>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-b border-r border-black px-2 py-1 text-left font-semibold w-20">Rev No.</th>
              <th className="border-b border-r border-black px-2 py-1 text-left font-semibold">Description</th>
              <th className="border-b border-r border-black px-2 py-1 text-left font-semibold w-24">Created</th>
              <th className="border-b border-r border-black px-2 py-1 text-left font-semibold w-24">Reviewed</th>
              <th className="border-b border-black px-2 py-1 text-left font-semibold w-24">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-r border-black px-2 py-1.5">0</td>
              <td className="border-r border-black px-2 py-1.5">Initial Release</td>
              <td className="border-r border-black px-2 py-1.5"></td>
              <td className="border-r border-black px-2 py-1.5"></td>
              <td className="px-2 py-1.5"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
