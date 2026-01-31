import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench,
  FileText,
  Hash,
  History,
  ClipboardCheck,
  GitBranch,
  Package,
  ClipboardList,
  Shield
} from "lucide-react";
import { WorkDefinitionsSection } from "./WorkDefinitionsSection";
import { AssetNumberingSection } from "./AssetNumberingSection";
import { HierarchyRulesSection } from "./HierarchyRulesSection";
import { SparesStrategySection } from "./SparesStrategySection";
import { PMStandardsSection } from "./PMStandardsSection";
import { DataGovernanceSection } from "./DataGovernanceSection";
import { MinimumJobDataSection } from "./MinimumJobDataSection";
import { JobNumberingSection } from "./JobNumberingSection";
import { MaintenanceHistorySection } from "./MaintenanceHistorySection";
import { BaselinePMSection } from "./BaselinePMSection";

export const FoundationsContent = () => {
  return (
    <Tabs defaultValue="work-definitions" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-2 rounded-lg">
        <TabsTrigger value="work-definitions" className="flex items-center gap-2 text-xs">
          <Wrench className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Work Definitions</span>
          <span className="sm:hidden">Work</span>
        </TabsTrigger>
        <TabsTrigger value="job-data" className="flex items-center gap-2 text-xs">
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Job Data Standards</span>
          <span className="sm:hidden">Job Data</span>
        </TabsTrigger>
        <TabsTrigger value="job-numbering" className="flex items-center gap-2 text-xs">
          <Hash className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Job Numbering</span>
          <span className="sm:hidden">Numbering</span>
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2 text-xs">
          <History className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">History Structure</span>
          <span className="sm:hidden">History</span>
        </TabsTrigger>
        <TabsTrigger value="baseline-pm" className="flex items-center gap-2 text-xs">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Baseline PM</span>
          <span className="sm:hidden">Baseline</span>
        </TabsTrigger>
        <TabsTrigger value="asset-numbering" className="flex items-center gap-2 text-xs">
          <Hash className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Asset Numbering</span>
          <span className="sm:hidden">Assets</span>
        </TabsTrigger>
        <TabsTrigger value="hierarchy" className="flex items-center gap-2 text-xs">
          <GitBranch className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Hierarchy Rules</span>
          <span className="sm:hidden">Hierarchy</span>
        </TabsTrigger>
        <TabsTrigger value="spares" className="flex items-center gap-2 text-xs">
          <Package className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Spares Strategy</span>
          <span className="sm:hidden">Spares</span>
        </TabsTrigger>
        <TabsTrigger value="pm-standards" className="flex items-center gap-2 text-xs">
          <ClipboardList className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">PM Standards</span>
          <span className="sm:hidden">PM</span>
        </TabsTrigger>
        <TabsTrigger value="governance" className="flex items-center gap-2 text-xs">
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Data Governance</span>
          <span className="sm:hidden">Governance</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="work-definitions">
        <WorkDefinitionsSection />
      </TabsContent>

      <TabsContent value="job-data">
        <MinimumJobDataSection />
      </TabsContent>

      <TabsContent value="job-numbering">
        <JobNumberingSection />
      </TabsContent>

      <TabsContent value="history">
        <MaintenanceHistorySection />
      </TabsContent>

      <TabsContent value="baseline-pm">
        <BaselinePMSection />
      </TabsContent>

      <TabsContent value="asset-numbering">
        <AssetNumberingSection />
      </TabsContent>

      <TabsContent value="hierarchy">
        <HierarchyRulesSection />
      </TabsContent>

      <TabsContent value="spares">
        <SparesStrategySection />
      </TabsContent>

      <TabsContent value="pm-standards">
        <PMStandardsSection />
      </TabsContent>

      <TabsContent value="governance">
        <DataGovernanceSection />
      </TabsContent>
    </Tabs>
  );
};
