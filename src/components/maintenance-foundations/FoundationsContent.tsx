import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Hash,
  GitBranch,
  Package,
  ClipboardList,
  Shield,
  FileText,
  ListOrdered
} from "lucide-react";
import { HierarchyRulesSection } from "./HierarchyRulesSection";
import { AssetNumberingSection } from "./AssetNumberingSection";
import { JobNumberingSection } from "./JobNumberingSection";
import { PMStandardsSection } from "./PMStandardsSection";
import { SparesStrategySection } from "./SparesStrategySection";
import { DataGovernanceSection } from "./DataGovernanceSection";
import { SitePartNumberingSection } from "./SitePartNumberingSection";

export const FoundationsContent = () => {
  return (
    <Tabs defaultValue="hierarchy" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-2 rounded-lg">
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
      </TabsList>

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
    </Tabs>
  );
};
