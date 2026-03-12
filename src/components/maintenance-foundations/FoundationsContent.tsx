import { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  Download,
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

  const handlePrintTab = () => {
    const el = contentRef.current;
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>${TAB_LABELS[activeTab]} — TCMG</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; line-height: 1.5; color: #111; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .doc-header { border-bottom: 3px solid #d4a017; margin-bottom: 8mm; padding-bottom: 4mm; }
          .doc-header h1 { font-size: 16px; font-weight: 700; }
          .doc-header p { font-size: 10px; color: #666; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; font-size: 10px; }
          th { background-color: #f5f0e0; font-weight: 600; }
          button, input, select { display: none !important; }
          svg { display: block; }
          h2, h3, h4 { margin-bottom: 4px; font-weight: 600; }
          ul, ol { padding-left: 16px; margin-bottom: 6px; }
          li, p { margin-bottom: 2px; font-size: 10px; }
          .separator, hr { border: none; border-top: 1px solid #ddd; margin: 6px 0; }
          [class*="rounded"], .card { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
        </style>
      </head><body>
        <div class="doc-header">
          <h1>${TAB_LABELS[activeTab]}</h1>
          <p>Tennant Mines Gold — Maintenance Process Foundations | ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        ${el.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const handleExportPDF = () => {
    const el = contentRef.current;
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>${TAB_LABELS[activeTab]} — TCMG (Save as PDF)</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; line-height: 1.5; color: #111; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .doc-header { border-bottom: 3px solid #d4a017; margin-bottom: 8mm; padding-bottom: 4mm; }
          .doc-header h1 { font-size: 16px; font-weight: 700; }
          .doc-header p { font-size: 10px; color: #666; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; font-size: 10px; }
          th { background-color: #f5f0e0; font-weight: 600; }
          button, input, select { display: none !important; }
          svg { display: block; }
          h2, h3, h4 { margin-bottom: 4px; font-weight: 600; }
          ul, ol { padding-left: 16px; margin-bottom: 6px; }
          li, p { margin-bottom: 2px; font-size: 10px; }
          .separator, hr { border: none; border-top: 1px solid #ddd; margin: 6px 0; }
          [class*="rounded"], .card { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
        </style>
      </head><body>
        <div class="doc-header">
          <h1>${TAB_LABELS[activeTab]}</h1>
          <p>Tennant Mines Gold — Maintenance Process Foundations | ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        ${el.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
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
        </TabsList>
        <div className="flex flex-col gap-1.5 shrink-0 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintTab}
            className="gap-2 w-full justify-start"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Tab
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            className="gap-2 w-full justify-start"
          >
            <Download className="w-3.5 h-3.5" />
            Save as PDF
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
      </div>
    </Tabs>
  );
};
