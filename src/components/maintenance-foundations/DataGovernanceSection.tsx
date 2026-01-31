import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

export const DataGovernanceSection = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Maintenance Data Governance & Change Control</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Rules for data integrity, approvals, and change management
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Data Integrity Rules */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Data Integrity Rules</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "No Invention", desc: "Do NOT invent, assume, or estimate OEM details" },
              { rule: "Document Source Only", desc: "Only use information from attached documents" },
              { rule: "Mark Unknown", desc: "If value cannot be determined, mark as 'TBC'" },
              { rule: "P&ID Verification", desc: "All mappings sourced from provided data dump only" },
              { rule: "Baseline Snapshot", desc: "Baseline data is not final, pending walkdown" },
              { rule: "No Fabrication", desc: "P&ID tags never invented or synthesised" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
                <Lock className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.rule}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Change Control Process */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Change Control Process</h4>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-background rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">
                1
              </div>
              <h5 className="font-medium text-sm">Request</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Document the proposed change with justification
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">
                2
              </div>
              <h5 className="font-medium text-sm">Review</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Engineering/Supervisor reviews impact and approves
              </p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border text-center">
              <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-600 text-lg font-bold flex items-center justify-center mx-auto mb-2">
                3
              </div>
              <h5 className="font-medium text-sm">Implement</h5>
              <p className="text-xs text-muted-foreground mt-1">
                Execute change and update all affected registers
              </p>
            </div>
          </div>
        </div>

        {/* Locked Data */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Locked (Read-Only)
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Asset Hierarchy structure</li>
              <li>• Functional Location codes</li>
              <li>• Assigned Asset Numbers</li>
              <li>• Approved PM Templates</li>
            </ul>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Editable (With Approval)
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Component OEM details</li>
              <li>• Spare parts criticality</li>
              <li>• Draft PM Templates</li>
              <li>• Stock levels and suppliers</li>
            </ul>
          </div>
        </div>

        {/* Audit Trail Note */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-2">Audit Trail</h4>
          <p className="text-sm text-muted-foreground">
            All changes to critical data (hierarchy, FLs, approved PMs) must be logged with timestamp, 
            user, before/after values, and justification. This ensures traceability for compliance and 
            future CMMS migration.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
