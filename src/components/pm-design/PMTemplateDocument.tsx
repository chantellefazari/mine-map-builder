import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, HardHat, Wrench, ClipboardCheck, Eye, Cog, Zap, CheckCircle2, Droplets, FileCheck, MessageSquare } from "lucide-react";

export interface PMTemplateData {
  id: string;
  // Header
  pmTitle: string;
  equipmentType: string;
  pmFrequency: string;
  discipline: "Mechanical" | "Electrical" | "Ops";
  estimatedDuration: string;
  skillLevel: string;
  locationArea: string;
  revision: string;
  preparedBy: string;
  approvedBy: string;
  lastReviewDate: string;
  status: "Draft" | "Reviewed" | "Approved";

  // Safety & Isolations
  isolations: {
    electrical: boolean;
    mechanical: boolean;
    hydraulic: boolean;
    pneumatic: boolean;
  };
  lotoRequired: boolean;
  storedEnergyHazards: string;
  confinedSpaceRisk: boolean;
  workingAtHeightsRisk: boolean;
  hotWorkRequired: boolean;
  environmentalHazards: string;
  emergencyStopsLocation: string;

  // PPE
  ppe: {
    hardHat: boolean;
    safetyGlasses: boolean;
    gloves: boolean;
    steelCapBoots: boolean;
    hearingProtection: boolean;
    respiratoryProtection: boolean;
    otherPPE: string;
  };

  // Tools
  tools: {
    standardToolKit: boolean;
    torqueWrench: boolean;
    greaseGun: boolean;
    multimeter: boolean;
    liftingEquipment: boolean;
    otherTools: string;
  };

  // Pre-start checks
  preStartChecks: string[];

  // Inspection tasks
  inspectionTasks: string[];

  // Mechanical tasks
  mechanicalTasks: string[];

  // Electrical tasks
  electricalTasks: string[];

  // Acceptable criteria
  acceptableCriteria: string[];

  // Signs of failure
  signsOfFailure: string[];

  // Lubrication
  lubrication: {
    lubricantType: string;
    lubricationPoint: string;
    quantity: string;
    interval: string;
  };

  // Post-work checks
  postWorkChecks: string[];
}

interface PMTemplateDocumentProps {
  pm: PMTemplateData;
  interactive?: boolean;
}

const statusColors = {
  Draft: "bg-muted text-muted-foreground",
  Reviewed: "bg-primary/20 text-primary",
  Approved: "bg-green-500/20 text-green-700",
};

export const PMTemplateDocument = ({ pm, interactive = false }: PMTemplateDocumentProps) => {
  return (
    <div className="bg-white text-gray-900 p-8 max-w-4xl mx-auto font-sans text-sm leading-relaxed print:p-4">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HEADER SECTION */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-gray-800 text-white p-3 text-center">
          <h1 className="text-xl font-bold tracking-wide">PREVENTIVE MAINTENANCE WORK INSTRUCTION</h1>
        </div>
        
        <div className="p-4">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">{pm.pmTitle}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div className="flex">
              <span className="font-semibold w-40">Equipment Type:</span>
              <span>{pm.equipmentType}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">PM Frequency:</span>
              <span>{pm.pmFrequency}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Discipline:</span>
              <span>{pm.discipline}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Estimated Duration:</span>
              <span>{pm.estimatedDuration}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Skill Level Required:</span>
              <span>{pm.skillLevel}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Location / Area:</span>
              <span>{pm.locationArea}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Revision:</span>
              <span>{pm.revision}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Last Review Date:</span>
              <span>{pm.lastReviewDate}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Prepared By:</span>
              <span>{pm.preparedBy}</span>
            </div>
            <div className="flex">
              <span className="font-semibold w-40">Approved By:</span>
              <span>{pm.approvedBy}</span>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <Badge className={statusColors[pm.status]}>{pm.status}</Badge>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CRITICAL SAFETY & ISOLATIONS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-red-600 mb-6">
        <div className="bg-red-600 text-white p-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-bold text-base">⚠️ SAFETY CRITICAL INFORMATION</h3>
        </div>
        
        <div className="p-4 bg-red-50">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Required Isolations:</p>
              <div className="space-y-1 ml-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={pm.isolations.electrical} disabled={!interactive} />
                  <span>Electrical Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={pm.isolations.mechanical} disabled={!interactive} />
                  <span>Mechanical Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={pm.isolations.hydraulic} disabled={!interactive} />
                  <span>Hydraulic Isolation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={pm.isolations.pneumatic} disabled={!interactive} />
                  <span>Pneumatic Isolation</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Lock-Out / Tag-Out Required:</span>
                <span className={pm.lotoRequired ? "text-red-600 font-bold" : ""}>{pm.lotoRequired ? "YES" : "NO"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Confined Space Risk:</span>
                <span className={pm.confinedSpaceRisk ? "text-red-600 font-bold" : ""}>{pm.confinedSpaceRisk ? "YES" : "NO"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Working at Heights Risk:</span>
                <span className={pm.workingAtHeightsRisk ? "text-red-600 font-bold" : ""}>{pm.workingAtHeightsRisk ? "YES" : "NO"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Hot Work Required:</span>
                <span className={pm.hotWorkRequired ? "text-red-600 font-bold" : ""}>{pm.hotWorkRequired ? "YES" : "NO"}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2 text-sm">
            <div>
              <span className="font-semibold">Stored Energy Hazards: </span>
              <span>{pm.storedEnergyHazards || "None identified"}</span>
            </div>
            <div>
              <span className="font-semibold">Environmental Hazards: </span>
              <span>{pm.environmentalHazards || "Standard mining environment"}</span>
            </div>
            <div>
              <span className="font-semibold">Emergency Stops Location: </span>
              <span>{pm.emergencyStopsLocation || "As per area signage"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* REQUIRED PPE */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-blue-600 text-white p-2 flex items-center gap-2">
          <HardHat className="h-5 w-5" />
          <h3 className="font-bold text-base">REQUIRED PPE</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.ppe.hardHat} disabled={!interactive} />
              <span>Hard Hat</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.ppe.safetyGlasses} disabled={!interactive} />
              <span>Safety Glasses</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.ppe.gloves} disabled={!interactive} />
              <span>Gloves</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.ppe.steelCapBoots} disabled={!interactive} />
              <span>Steel Cap Boots</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.ppe.hearingProtection} disabled={!interactive} />
              <span>Hearing Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.ppe.respiratoryProtection} disabled={!interactive} />
              <span>Respiratory Protection</span>
            </div>
          </div>
          {pm.ppe.otherPPE && (
            <div className="mt-2 text-sm">
              <span className="font-semibold">Other PPE: </span>
              <span>{pm.ppe.otherPPE}</span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* REQUIRED TOOLS & EQUIPMENT */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-gray-600 text-white p-2 flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          <h3 className="font-bold text-base">REQUIRED TOOLS & EQUIPMENT</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.tools.standardToolKit} disabled={!interactive} />
              <span>Standard Tool Kit</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.tools.torqueWrench} disabled={!interactive} />
              <span>Torque Wrench</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.tools.greaseGun} disabled={!interactive} />
              <span>Grease Gun</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.tools.multimeter} disabled={!interactive} />
              <span>Multimeter</span>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={pm.tools.liftingEquipment} disabled={!interactive} />
              <span>Lifting Equipment</span>
            </div>
          </div>
          {pm.tools.otherTools && (
            <div className="mt-2 text-sm">
              <span className="font-semibold">Other Tools: </span>
              <span>{pm.tools.otherTools}</span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* PRE-START CHECKS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-amber-500 text-white p-2 flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5" />
          <h3 className="font-bold text-base">PRE-START CHECKS</h3>
        </div>
        
        <div className="p-4">
          <p className="text-sm font-semibold mb-2">Before starting work, confirm:</p>
          <div className="space-y-1 text-sm">
            {pm.preStartChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox disabled={!interactive} />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* INSPECTION TASKS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-teal-600 text-white p-2 flex items-center gap-2">
          <Eye className="h-5 w-5" />
          <h3 className="font-bold text-base">INSPECTION TASKS (CHECKLIST)</h3>
        </div>
        
        <div className="p-4">
          <p className="text-sm font-semibold mb-2">Visual & Operational Checks:</p>
          <div className="space-y-1 text-sm">
            {pm.inspectionTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox disabled={!interactive} />
                <span>{task}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-semibold mb-1">Record Findings:</p>
            <div className="border border-gray-300 h-16 bg-gray-50"></div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MECHANICAL TASKS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-indigo-600 text-white p-2 flex items-center gap-2">
          <Cog className="h-5 w-5" />
          <h3 className="font-bold text-base">MECHANICAL TASKS</h3>
        </div>
        
        <div className="p-4">
          <div className="space-y-1 text-sm">
            {pm.mechanicalTasks.map((task, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox disabled={!interactive} />
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ELECTRICAL / INSTRUMENT TASKS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {pm.electricalTasks.length > 0 && (
        <div className="border-2 border-gray-800 mb-6">
          <div className="bg-amber-600 text-white p-2 flex items-center gap-2">
            <Zap className="h-5 w-5" />
            <h3 className="font-bold text-base">ELECTRICAL / INSTRUMENT TASKS (IF APPLICABLE)</h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-1 text-sm">
              {pm.electricalTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Checkbox disabled={!interactive} />
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ACCEPTABLE CONDITION CRITERIA */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-green-600 text-white p-2 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          <h3 className="font-bold text-base">ACCEPTABLE CONDITION CRITERIA</h3>
        </div>
        
        <div className="p-4">
          <p className="text-sm font-semibold mb-2">Define what "good condition" looks like:</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {pm.acceptableCriteria.map((criteria, i) => (
              <li key={i}>{criteria}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIGNS OF FAILURE / ACTION REQUIRED */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-red-500 text-white p-2 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-bold text-base">SIGNS OF FAILURE / ACTION REQUIRED</h3>
        </div>
        
        <div className="p-4">
          <p className="text-sm font-semibold mb-2">If any of the following are found, raise corrective work:</p>
          <div className="space-y-1 text-sm">
            {pm.signsOfFailure.map((sign, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox disabled={!interactive} />
                <span>{sign}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <p className="text-sm font-semibold mb-1">Describe Issue:</p>
            <div className="border border-gray-300 h-16 bg-gray-50"></div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* LUBRICATION DETAILS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-purple-600 text-white p-2 flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          <h3 className="font-bold text-base">LUBRICATION DETAILS (IF APPLICABLE)</h3>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Lubricant Type: </span>
              <span>{pm.lubrication.lubricantType || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Lubrication Point: </span>
              <span>{pm.lubrication.lubricationPoint || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Quantity: </span>
              <span>{pm.lubrication.quantity || "N/A"}</span>
            </div>
            <div>
              <span className="font-semibold">Interval: </span>
              <span>{pm.lubrication.interval || "As per schedule"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* POST-WORK CHECKS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-gray-700 text-white p-2 flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          <h3 className="font-bold text-base">POST-WORK CHECKS</h3>
        </div>
        
        <div className="p-4">
          <div className="space-y-1 text-sm">
            {pm.postWorkChecks.map((check, i) => (
              <div key={i} className="flex items-center gap-2">
                <Checkbox disabled={!interactive} />
                <span>{check}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* COMMENTS & NOTES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800 mb-6">
        <div className="bg-gray-500 text-white p-2 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-bold text-base">COMMENTS & NOTES</h3>
        </div>
        
        <div className="p-4">
          <div className="border border-gray-300 h-24 bg-gray-50"></div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SIGN-OFF */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-gray-800">
        <div className="p-4">
          <div className="grid grid-cols-3 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-8">Completed By:</p>
              <div className="border-b border-gray-400 mb-1"></div>
              <p className="text-xs text-gray-500">Name / Signature</p>
            </div>
            <div>
              <p className="font-semibold mb-8">Date:</p>
              <div className="border-b border-gray-400 mb-1"></div>
              <p className="text-xs text-gray-500">DD / MM / YYYY</p>
            </div>
            <div>
              <p className="font-semibold mb-8">Supervisor Review:</p>
              <div className="border-b border-gray-400 mb-1"></div>
              <p className="text-xs text-gray-500">Name / Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
