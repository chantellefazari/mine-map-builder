import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { uploadAndShowPdf } from "@/utils/pdfDownloadHelper";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { 
  Hash,
  GitBranch,
  Package,
  ClipboardList,
  Shield,
  FileText,
  ListOrdered,
  MapPin,
  Printer,
  BarChart3,
  AlertTriangle,
  Database,
  Gauge,
} from "lucide-react";
import { HierarchyRulesSection } from "./HierarchyRulesSection";
import { AssetNumberingSection } from "./AssetNumberingSection";
import { JobNumberingSection } from "./JobNumberingSection";
import { PMStandardsSection } from "./PMStandardsSection";
import { SparesStrategySection } from "./SparesStrategySection";
import { DataGovernanceSection } from "./DataGovernanceSection";
import { SitePartNumberingSection } from "./SitePartNumberingSection";
import { AssetTagRolloutPlanSection } from "./AssetTagRolloutPlanSection";

import { PMCoverageAnalysisSection } from "./PMCoverageAnalysisSection";
import { ShutdownPMRequirementsSection } from "./ShutdownPMRequirementsSection";
import { NamingConventionDocument } from "./NamingConventionDocument";
import { DataMappingReadinessSection } from "./DataMappingReadinessSection";
import { AssetCriticalitySection } from "./AssetCriticalitySection";

const TAB_LABELS: Record<string, string> = {
  "hierarchy": "Asset Hierarchy & Parent-Child Rules",
  "functional-locations": "Functional Location Codes",
  "part-numbering": "Site Part Numbering Standards",
  "wo-numbering": "Maintenance WO Numbering Standards",
  "pm-standards": "PM Standards",
  "spares": "Spare Parts Strategy & Criticality",
  "governance": "Data Governance & Change Control",
  "tag-rollout": "Asset Tag Rollout Plan",
  
  "pm-coverage": "Current Site PM Register",
  "shutdown-pms": "Shutdown PM Requirements",
  "naming-convention": "Site Naming Convention Reference",
  "data-mapping": "Data Mapping & Readiness",
  "criticality": "Asset Criticality Assessment",
};

export const FoundationsContent = () => {
  const [activeTab, setActiveTab] = useState("hierarchy");
  const contentRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSavePdf = async () => {
    const el = contentRef.current;
    if (!el) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 8;
      const contentW = A4_W - MARGIN * 2;
      const imgRatio = canvas.height / canvas.width;
      const totalImgH = contentW * imgRatio;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      let heightLeft = totalImgH;
      let position = MARGIN;

      pdf.addImage(imgData, "JPEG", MARGIN, position, contentW, totalImgH);
      heightLeft -= (A4_H - MARGIN * 2);

      while (heightLeft > 0) {
        pdf.addPage();
        position = MARGIN - (totalImgH - heightLeft);
        pdf.addImage(imgData, "JPEG", MARGIN, position, contentW, totalImgH);
        heightLeft -= (A4_H - MARGIN * 2);
      }

      const label = TAB_LABELS[activeTab] || "Maintenance Foundations";
      const filename = `TCMG-${label.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`;
      const blob = pdf.output("blob");
      await uploadAndShowPdf(blob, filename, label);
      toast.success("PDF saved successfully");
    } catch (err) {
      console.error("PDF save error:", err);
      toast.error("Failed to save PDF");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <div className="flex items-start gap-3">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-2 rounded-lg flex-1">
          <TabsTrigger value="hierarchy" className="flex items-center gap-2 text-xs">
            <GitBranch className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Asset Hierarchy & Parent-Child Rules</span>
            <span className="sm:hidden">Hierarchy</span>
          </TabsTrigger>
          <TabsTrigger value="functional-locations" className="flex items-center gap-2 text-xs">
            <Hash className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Functional Location Codes</span>
            <span className="sm:hidden">FL Codes</span>
          </TabsTrigger>
          <TabsTrigger value="part-numbering" className="flex items-center gap-2 text-xs">
            <ListOrdered className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Site Part Numbering Standards</span>
            <span className="sm:hidden">Part #</span>
          </TabsTrigger>
          <TabsTrigger value="wo-numbering" className="flex items-center gap-2 text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Maintenance WO Numbering Standards</span>
            <span className="sm:hidden">WO #</span>
          </TabsTrigger>
          <TabsTrigger value="pm-standards" className="flex items-center gap-2 text-xs">
            <ClipboardList className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PM Standards</span>
            <span className="sm:hidden">PM</span>
          </TabsTrigger>
          <TabsTrigger value="spares" className="flex items-center gap-2 text-xs">
            <Package className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Spare Parts Strategy & Criticality</span>
            <span className="sm:hidden">Spares</span>
          </TabsTrigger>
          <TabsTrigger value="governance" className="flex items-center gap-2 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Data Governance & Change Control</span>
            <span className="sm:hidden">Governance</span>
          </TabsTrigger>
          <TabsTrigger value="tag-rollout" className="flex items-center gap-2 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Asset Tag Rollout Plan</span>
            <span className="sm:hidden">Rollout</span>
          </TabsTrigger>
          <TabsTrigger value="pm-coverage" className="flex items-center gap-2 text-xs">
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Site PM Register</span>
            <span className="sm:hidden">PM Register</span>
          </TabsTrigger>
          <TabsTrigger value="shutdown-pms" className="flex items-center gap-2 text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Shutdown PM Requirements</span>
            <span className="sm:hidden">Shutdown</span>
          </TabsTrigger>
          <TabsTrigger value="naming-convention" className="flex items-center gap-2 text-xs">
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Site Naming Convention</span>
            <span className="sm:hidden">Naming</span>
          </TabsTrigger>
          <TabsTrigger value="data-mapping" className="flex items-center gap-2 text-xs">
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Data Mapping & Readiness</span>
            <span className="sm:hidden">Mapping</span>
          </TabsTrigger>
          <TabsTrigger value="criticality" className="flex items-center gap-2 text-xs">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Asset Criticality</span>
            <span className="sm:hidden">Criticality</span>
          </TabsTrigger>
        </TabsList>
        <div className="flex flex-col gap-1.5 shrink-0 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSavePdf}
            disabled={saving}
            className="gap-2 w-full justify-start"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Printer className="w-3.5 h-3.5" />}
            {saving ? "Saving…" : "Save PDF"}
          </Button>
        </div>
      </div>

      <div ref={contentRef}>
        <TabsContent value="hierarchy">
          <HierarchyRulesSection />
        </TabsContent>

        <TabsContent value="functional-locations">
          <AssetNumberingSection />
        </TabsContent>

        <TabsContent value="part-numbering">
          <SitePartNumberingSection />
        </TabsContent>

        <TabsContent value="wo-numbering">
          <JobNumberingSection />
        </TabsContent>

        <TabsContent value="pm-standards">
          <PMStandardsSection />
        </TabsContent>

        <TabsContent value="spares">
          <SparesStrategySection />
        </TabsContent>

        <TabsContent value="governance">
          <DataGovernanceSection />
        </TabsContent>

        <TabsContent value="tag-rollout">
          <AssetTagRolloutPlanSection />
        </TabsContent>


        <TabsContent value="pm-coverage">
          <PMCoverageAnalysisSection />
        </TabsContent>

        <TabsContent value="shutdown-pms">
          <ShutdownPMRequirementsSection />
        </TabsContent>

        <TabsContent value="naming-convention">
          <NamingConventionDocument />
        </TabsContent>

        <TabsContent value="data-mapping">
          <DataMappingReadinessSection />
        </TabsContent>

        <TabsContent value="criticality">
          <AssetCriticalitySection />
        </TabsContent>
      </div>

      <PrintPreviewModal
        isOpen={printOpen}
        onClose={() => setPrintOpen(false)}
        title={TAB_LABELS[activeTab] || "Print Preview"}
      >
        {activeTab === "hierarchy" && <HierarchyRulesSection />}
        {activeTab === "functional-locations" && <AssetNumberingSection />}
        {activeTab === "part-numbering" && <SitePartNumberingSection />}
        {activeTab === "wo-numbering" && <JobNumberingSection />}
        {activeTab === "pm-standards" && <PMStandardsSection />}
        {activeTab === "spares" && <SparesStrategySection />}
        {activeTab === "governance" && <DataGovernanceSection />}
        {activeTab === "tag-rollout" && <AssetTagRolloutPlanSection />}
        {activeTab === "pm-coverage" && <PMCoverageAnalysisSection />}
        {activeTab === "shutdown-pms" && <ShutdownPMRequirementsSection />}
        {activeTab === "naming-convention" && <NamingConventionDocument />}
        {activeTab === "data-mapping" && <DataMappingReadinessSection />}
        {activeTab === "criticality" && <AssetCriticalitySection />}
      </PrintPreviewModal>
    </Tabs>
  );
};
