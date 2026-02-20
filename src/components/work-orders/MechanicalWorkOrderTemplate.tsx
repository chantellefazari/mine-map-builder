import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import tennantIcon from "@/assets/tennant-icon.png";

interface MechanicalWorkOrderTemplateProps {
  woNumber?: string;
}

export const MechanicalWorkOrderTemplate = ({ woNumber }: MechanicalWorkOrderTemplateProps) => {
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Header with Print Button */}
      <div className="flex items-center justify-between print:hidden">
        <h2 className="text-xl font-semibold text-foreground">
          Work Order {woNumber && <span className="text-primary font-mono">({woNumber})</span>}
        </h2>
        <Button onClick={handlePrint} className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
      </div>

      {/* Work Order Document - A4 optimized */}
      <div className="bg-white border border-border rounded-lg shadow-sm print:shadow-none print:border-none print:w-full print:max-w-none print:m-0 print:p-0">
        {/* Banner Header */}
        <div className="bg-black text-white p-4 flex items-center justify-between print:bg-black">
          <div className="flex items-center gap-3">
            <img src={tennantIcon} alt="Tennant Mines" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-[#D4AF37]">TENNANT MINES</h1>
              <p className="text-xs text-gray-300">Tennant Creek Gold Mine</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-[#D4AF37]">WORK ORDER</h2>
          </div>
        </div>

        <div className="p-6 space-y-6 text-sm">
          {/* Work Order Details Section */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Work Order No.</span>
                  <span className="font-mono font-medium">{woNumber || "WO-______"}</span>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Date Raised</span>
                  <span className="font-medium">____/____/________</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Asset Number</span>
                  <span className="font-mono font-medium"></span>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Revision</span>
                  <span className="font-mono font-medium"></span>
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Equipment Description</span>
                <span className="font-medium"></span>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Location / Area</span>
                <span className="font-medium"></span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Priority</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Critical</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">High</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Medium</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Low</span>
                    </label>
                  </div>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block">Work Type</span>
                  <div className="flex flex-col gap-1 mt-1">
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Breakdown</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Planned</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Shutdown</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="border border-gray-300 p-2">
                <span className="text-xs text-gray-500 block">Requested By</span>
                <span className="font-medium"></span>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">PROBLEM DESCRIPTION</span>
            </div>
            <div className="p-3 min-h-[80px]">
              <p className="text-gray-400 text-xs italic">Describe the fault, symptoms, and when it was first noticed...</p>
            </div>
          </div>


          {/* Work Performed */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">WORK PERFORMED</span>
            </div>
            <div className="p-3 min-h-[120px]">
              <p className="text-gray-400 text-xs italic">Detail the work completed, parts replaced, adjustments made...</p>
            </div>
          </div>

          {/* Parts Used */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">PARTS / MATERIALS USED</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left p-2 border-r border-gray-300">Part Number</th>
                  <th className="text-left p-2 border-r border-gray-300">Description</th>
                  <th className="text-center p-2 border-r border-gray-300 w-16">Qty</th>
                  <th className="text-left p-2 w-24">Store Location</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((row) => (
                  <tr key={row} className="border-b border-gray-300">
                    <td className="p-2 border-r border-gray-300 h-8"></td>
                    <td className="p-2 border-r border-gray-300"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Labour Hours */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">LABOUR HOURS</span>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="text-left p-2 border-r border-gray-300">Technician Name</th>
                  <th className="text-center p-2 border-r border-gray-300 w-24">Work Centre</th>
                  <th className="text-center p-2 border-r border-gray-300 w-24">Date</th>
                  <th className="text-center p-2 border-r border-gray-300 w-20">Start Time</th>
                  <th className="text-center p-2 border-r border-gray-300 w-20">End Time</th>
                  <th className="text-center p-2 w-20">Total Hrs</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((row) => (
                  <tr key={row} className="border-b border-gray-300">
                    <td className="p-2 border-r border-gray-300 h-8"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 border-r border-gray-300 text-center"></td>
                    <td className="p-2 text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Completion & Sign-off */}
          <div className="border border-gray-300">
            <div className="bg-green-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-green-800">✓ COMPLETION & SIGN-OFF</span>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Work Status:</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Complete</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Partial - Follow-up Required</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Awaiting Parts</span>
                    </label>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Equipment Returned to Service:</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">Yes</span>
                    </label>
                    <label className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400"></div>
                      <span className="text-xs">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-4">Technician Signature</span>
                  <div className="border-t border-gray-300 pt-1 mt-4">
                    <span className="text-xs text-gray-500">Date: ____/____/________</span>
                  </div>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-4">Supervisor Signature</span>
                  <div className="border-t border-gray-300 pt-1 mt-4">
                    <span className="text-xs text-gray-500">Date: ____/____/________</span>
                  </div>
                </div>
                <div className="border border-gray-300 p-2">
                  <span className="text-xs text-gray-500 block mb-4">Operations Handover</span>
                  <div className="border-t border-gray-300 pt-1 mt-4">
                    <span className="text-xs text-gray-500">Date: ____/____/________</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Actions */}
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-2 border-b border-gray-300">
              <span className="font-semibold text-gray-700">FOLLOW-UP ACTIONS / RECOMMENDATIONS</span>
            </div>
            <div className="p-3 min-h-[60px]">
              <p className="text-gray-400 text-xs italic">List any additional work required, observations, or recommendations...</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-200">
            <p>TCMG-WO-MECH-001 | Rev 1.0 | Tennant Creek Gold Mine</p>
          </div>
        </div>
      </div>
    </div>
  );
};
