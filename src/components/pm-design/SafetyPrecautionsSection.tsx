import { Shield, AlertTriangle, Lock, FileText, HardHat } from "lucide-react";

export const SafetyPrecautionsSection = () => {
  return (
    <div className="border-b border-border" data-pdf-section>
      <div className="bg-destructive/10 px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
        <Shield className="w-5 h-5 text-destructive" />
        <span className="text-destructive font-bold">SAFETY PRECAUTIONS</span>
      </div>
      <div className="px-4 py-4 bg-destructive/5">
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Conduct <span className="font-bold text-destructive">Take 5</span> and/or <span className="font-bold text-destructive">JSEA</span> as required.</span>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>Ensure isolations and/or safeguards are in place where required before commencing.</span>
          </li>
          <li className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Follow OEM instructions and site procedures as required.</span>
          </li>
        </ul>
      </div>
      <div className="border-t border-border px-4 py-3">
        <div className="flex items-start gap-3 mb-3">
          <HardHat className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm">
            <span className="font-semibold">Minimum PPE:</span> Steel cap boots, hard hat, safety glasses. Gloves and hearing protection as required.
          </p>
        </div>
        <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-3 flex items-start gap-3">
          <Shield className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-destructive">
            Under no circumstances will personnel place themselves in an unsafe position while carrying out these inspection tasks.
          </p>
        </div>
      </div>
    </div>
  );
};
