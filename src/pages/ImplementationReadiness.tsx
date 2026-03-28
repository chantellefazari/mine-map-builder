import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClipboardCheck, BarChart3, ShieldAlert, ListChecks,
  Layers, Users, FileText,
} from "lucide-react";
import { CurrentStateTab } from "@/components/implementation-readiness/CurrentStateTab";
import { ReadinessAssessmentTab } from "@/components/implementation-readiness/ReadinessAssessmentTab";
import { RiskRegisterTab } from "@/components/implementation-readiness/RiskRegisterTab";
import { RolloutPrerequisitesTab } from "@/components/implementation-readiness/RolloutPrerequisitesTab";
import { ImplementationPhasesTab } from "@/components/implementation-readiness/ImplementationPhasesTab";
import { ChangeTrainingTab } from "@/components/implementation-readiness/ChangeTrainingTab";
import { ExecutiveSummaryTab } from "@/components/implementation-readiness/ExecutiveSummaryTab";

const TABS = [
  { value: "current-state", label: "Current State", shortLabel: "State", icon: ClipboardCheck },
  { value: "readiness", label: "Readiness Assessment", shortLabel: "Readiness", icon: BarChart3 },
  { value: "risks", label: "Risk Register", shortLabel: "Risks", icon: ShieldAlert },
  { value: "prerequisites", label: "Rollout Prerequisites", shortLabel: "Prerequisites", icon: ListChecks },
  { value: "phases", label: "Implementation Phases", shortLabel: "Phases", icon: Layers },
  { value: "change-training", label: "Change & Training", shortLabel: "Change", icon: Users },
  { value: "executive", label: "Executive Summary", shortLabel: "Executive", icon: FileText },
];

const ImplementationReadiness = () => {
  const [activeTab, setActiveTab] = useState("current-state");

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Implementation Readiness</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tennant Creek Gold Mine — Operational readiness and implementation risk assessment for Minesite.ai rollout
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1.5 rounded-lg">
          {TABS.map(t => (
            <TabsTrigger key={t.value} value={t.value} className="flex items-center gap-1.5 text-xs">
              <t.icon className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t.label}</span>
              <span className="lg:hidden">{t.shortLabel}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="current-state"><CurrentStateTab /></TabsContent>
        <TabsContent value="readiness"><ReadinessAssessmentTab /></TabsContent>
        <TabsContent value="risks"><RiskRegisterTab /></TabsContent>
        <TabsContent value="prerequisites"><RolloutPrerequisitesTab /></TabsContent>
        <TabsContent value="phases"><ImplementationPhasesTab /></TabsContent>
        <TabsContent value="change-training"><ChangeTrainingTab /></TabsContent>
        <TabsContent value="executive"><ExecutiveSummaryTab /></TabsContent>
      </Tabs>
    </div>
  );
};

export default ImplementationReadiness;
