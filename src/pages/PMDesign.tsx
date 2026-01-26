import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, ChevronRight, Plus, PanelLeftClose, PanelLeft, Wrench, Zap, Printer, Truck } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { PMBaseMasterTemplate } from "@/components/pm-design/PMBaseMasterTemplate";
import { FilterPressPMDocument } from "@/components/pm-design/FilterPressPMDocument";
import { MillDailyPMDocument } from "@/components/pm-design/MillDailyPMDocument";
import { ROPlantPMDocument } from "@/components/pm-design/ROPlantPMDocument";
import { AcidElutionPMDocument } from "@/components/pm-design/AcidElutionPMDocument";
import { AirWaterServicesPMDocument } from "@/components/pm-design/AirWaterServicesPMDocument";
import { BottomOfTanksPMDocument } from "@/components/pm-design/BottomOfTanksPMDocument";
import { DieselFarmPMDocument } from "@/components/pm-design/DieselFarmPMDocument";
import { FilterPressWeeklyPMDocument } from "@/components/pm-design/FilterPressWeeklyPMDocument";
import { GoldRoomPMDocument } from "@/components/pm-design/GoldRoomPMDocument";
import { GreaseOilsPMDocument } from "@/components/pm-design/GreaseOilsPMDocument";
import { MillWeeklyPMDocument } from "@/components/pm-design/MillWeeklyPMDocument";
import { PotableWaterPMDocument } from "@/components/pm-design/PotableWaterPMDocument";
import { ReagentsPMDocument } from "@/components/pm-design/ReagentsPMDocument";
import { ThickenerPMDocument } from "@/components/pm-design/ThickenerPMDocument";
import { TopOfTanksPMDocument } from "@/components/pm-design/TopOfTanksPMDocument";
import { AdminGeneratorPMDocument } from "@/components/pm-design/AdminGeneratorPMDocument";
import { AndyDamGeneratorPMDocument } from "@/components/pm-design/AndyDamGeneratorPMDocument";
import { JunoGeneratorPMDocument } from "@/components/pm-design/JunoGeneratorPMDocument";
import { LabGeneratorPMDocument } from "@/components/pm-design/LabGeneratorPMDocument";
import { PortableGeneratorsPMDocument } from "@/components/pm-design/PortableGeneratorsPMDocument";
import { ForkliftWeeklyPMDocument } from "@/components/pm-design/ForkliftWeeklyPMDocument";
import { EWPWeeklyPMDocument } from "@/components/pm-design/EWPWeeklyPMDocument";
import { PrintPreviewModal } from "@/components/pm-design/PrintPreviewModal";
import { Button } from "@/components/ui/button";

type Discipline = "mechanical" | "electrical" | "mobile-equipment";
type FrequencyGroup = "daily" | "1-week" | "2-week" | "6-week" | "12-week";
type ViewType = "master" | "filter-press-daily" | "mill-daily" | "ro-plant-daily" | "acid-elution-weekly" | "air-water-services-weekly" | "bottom-of-tanks-weekly" | "diesel-farm-weekly" | "filter-press-weekly" | "gold-room-weekly" | "grease-oils-weekly" | "mill-weekly" | "potable-water-weekly" | "reagents-weekly" | "thickener-weekly" | "top-of-tanks-weekly" | "admin-generator-weekly" | "andy-dam-generator-weekly" | "juno-generator-weekly" | "lab-generator-weekly" | "portable-generators-weekly" | "forklift-weekly" | "ewp-weekly" | `${Discipline}-${FrequencyGroup}`;

const frequencyGroups = [
  { id: "daily" as FrequencyGroup, label: "DAILY", shortLabel: "D" },
  { id: "1-week" as FrequencyGroup, label: "1 WEEK", shortLabel: "1W" },
  { id: "2-week" as FrequencyGroup, label: "2 WEEK", shortLabel: "2W" },
  { id: "6-week" as FrequencyGroup, label: "6 WEEK", shortLabel: "6W" },
  { id: "12-week" as FrequencyGroup, label: "12 WEEK", shortLabel: "12W" },
];

// Generator PMs grouped together
const generatorPMs = [
  { id: "admin-generator-weekly", name: "Admin Generator" },
  { id: "andy-dam-generator-weekly", name: "Andy Dam Generator" },
  { id: "juno-generator-weekly", name: "Juno Generator" },
  { id: "lab-generator-weekly", name: "Lab Generator" },
  { id: "portable-generators-weekly", name: "Portable Generators" },
];

// Other equipment PMs (non-generator)
const otherWeeklyPMs = [
  { id: "acid-elution-weekly", name: "Acid Wash & Elution" },
  { id: "air-water-services-weekly", name: "Air & Water Services" },
  { id: "bottom-of-tanks-weekly", name: "Bottom of Tanks" },
  { id: "diesel-farm-weekly", name: "Diesel Farm" },
  { id: "filter-press-weekly", name: "Filter Press" },
  { id: "gold-room-weekly", name: "Gold Room" },
  { id: "grease-oils-weekly", name: "Grease & Oils" },
  { id: "mill-weekly", name: "Mill" },
  { id: "potable-water-weekly", name: "Potable Water" },
  { id: "reagents-weekly", name: "Reagents" },
  { id: "thickener-weekly", name: "Thickener" },
  { id: "top-of-tanks-weekly", name: "Top of Tanks" },
];

// Mobile Equipment PMs
const mobileEquipmentPMs = [
  { id: "ewp-weekly", name: "EWP" },
  { id: "forklift-weekly", name: "Forklift" },
];

const disciplines = [
  { 
    id: "mechanical" as Discipline, 
    label: "Mechanical PMs", 
    icon: Wrench,
    frequencies: {
      daily: { count: 3, pms: [
        { id: "filter-press-daily", name: "Filter Press Daily Inspection" },
        { id: "mill-daily", name: "Mill Daily Inspection" },
        { id: "ro-plant-daily", name: "RO Plant Daily Inspection" }
      ], subgroups: [] },
      "1-week": { 
        count: 17, 
        pms: [], // Individual PMs moved to subgroups
        subgroups: [
          { id: "generators", label: "Generators", pms: generatorPMs },
          { id: "equipment", label: "Equipment", pms: otherWeeklyPMs },
        ]
      },
      "2-week": { count: 0, pms: [], subgroups: [] },
      "6-week": { count: 0, pms: [], subgroups: [] },
      "12-week": { count: 0, pms: [], subgroups: [] },
    }
  },
  { 
    id: "electrical" as Discipline, 
    label: "Electrical PMs", 
    icon: Zap,
    frequencies: {
      daily: { count: 0, pms: [], subgroups: [] },
      "1-week": { count: 0, pms: [], subgroups: [] },
      "2-week": { count: 0, pms: [], subgroups: [] },
      "6-week": { count: 0, pms: [], subgroups: [] },
      "12-week": { count: 0, pms: [], subgroups: [] },
    }
  },
  { 
    id: "mobile-equipment" as Discipline, 
    label: "Mobile Equipment", 
    icon: Truck,
    frequencies: {
      daily: { count: 0, pms: [], subgroups: [] },
      "1-week": { 
        count: 2, 
        pms: mobileEquipmentPMs,
        subgroups: []
      },
      "2-week": { count: 0, pms: [], subgroups: [] },
      "6-week": { count: 0, pms: [], subgroups: [] },
      "12-week": { count: 0, pms: [], subgroups: [] },
    }
  },
];

const PMDesign = () => {
  const [activeView, setActiveView] = useState<ViewType>("filter-press-daily");
  const [expandedDisciplines, setExpandedDisciplines] = useState<Discipline[]>(["mechanical"]);
  const [expandedFrequencies, setExpandedFrequencies] = useState<string[]>(["mechanical-daily", "mechanical-1-week"]);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const toggleDiscipline = (disciplineId: Discipline) => {
    setExpandedDisciplines(prev => 
      prev.includes(disciplineId) 
        ? prev.filter(id => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const toggleFrequency = (key: string) => {
    setExpandedFrequencies(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  const getActiveFrequencyLabel = () => {
    if (activeView === "master" || activeView === "filter-press-daily") return null;
    const parts = activeView.split("-");
    const discipline = parts[0];
    const frequency = parts.slice(1).join("-");
    const freq = frequencyGroups.find(f => f.id === frequency);
    const disc = disciplines.find(d => d.id === discipline);
    return { discipline: disc?.label, frequency: freq?.label };
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const getDocumentTitle = () => {
    switch (activeView) {
      case "master": return "Base PM Template";
      case "filter-press-daily": return "Filter Press Daily Inspection";
      case "mill-daily": return "Mill Daily Inspection";
      case "ro-plant-daily": return "RO Plant Daily Inspection";
      case "acid-elution-weekly": return "Acid Wash & Elution Weekly Inspection";
      case "air-water-services-weekly": return "Air & Water Services Weekly Inspection";
      case "bottom-of-tanks-weekly": return "Bottom of Tanks Weekly Inspection";
      case "diesel-farm-weekly": return "Diesel Farm Weekly Inspection";
      case "filter-press-weekly": return "Filter Press Weekly Inspection";
      case "gold-room-weekly": return "Gold Room Weekly Inspection";
      case "grease-oils-weekly": return "Grease & Oils Weekly Inspection";
      case "mill-weekly": return "Mill Weekly Inspection";
      case "potable-water-weekly": return "Potable Water Weekly Inspection";
      case "reagents-weekly": return "Reagents Weekly Inspection";
      case "thickener-weekly": return "Thickener Weekly Inspection";
      case "top-of-tanks-weekly": return "Top of Tanks Weekly Inspection";
      case "admin-generator-weekly": return "Admin Generator Weekly Inspection";
      case "andy-dam-generator-weekly": return "Andy Dam Generator Weekly Inspection";
      case "juno-generator-weekly": return "Juno Generator Weekly Inspection";
      case "lab-generator-weekly": return "Lab Generator Weekly Inspection";
      case "portable-generators-weekly": return "Portable Generators Weekly Inspection";
      case "forklift-weekly": return "Forklift Weekly Inspection";
      case "ewp-weekly": return "EWP Weekly Inspection";
      default: return "PM Document";
    }
  };

  const renderPMDocument = () => {
    switch (activeView) {
      case "master":
        return <PMBaseMasterTemplate />;
      case "filter-press-daily":
        return <FilterPressPMDocument />;
      case "mill-daily":
        return <MillDailyPMDocument />;
      case "ro-plant-daily":
        return <ROPlantPMDocument />;
      case "acid-elution-weekly":
        return <AcidElutionPMDocument />;
      case "air-water-services-weekly":
        return <AirWaterServicesPMDocument />;
      case "bottom-of-tanks-weekly":
        return <BottomOfTanksPMDocument />;
      case "diesel-farm-weekly":
        return <DieselFarmPMDocument />;
      case "filter-press-weekly":
        return <FilterPressWeeklyPMDocument />;
      case "gold-room-weekly":
        return <GoldRoomPMDocument />;
      case "grease-oils-weekly":
        return <GreaseOilsPMDocument />;
      case "mill-weekly":
        return <MillWeeklyPMDocument />;
      case "potable-water-weekly":
        return <PotableWaterPMDocument />;
      case "reagents-weekly":
        return <ReagentsPMDocument />;
      case "thickener-weekly":
        return <ThickenerPMDocument />;
      case "top-of-tanks-weekly":
        return <TopOfTanksPMDocument />;
      case "admin-generator-weekly":
        return <AdminGeneratorPMDocument />;
      case "andy-dam-generator-weekly":
        return <AndyDamGeneratorPMDocument />;
      case "juno-generator-weekly":
        return <JunoGeneratorPMDocument />;
      case "lab-generator-weekly":
        return <LabGeneratorPMDocument />;
      case "portable-generators-weekly":
        return <PortableGeneratorsPMDocument />;
      case "forklift-weekly":
        return <ForkliftWeeklyPMDocument />;
      case "ewp-weekly":
        return <EWPWeeklyPMDocument />;
      default:
        return null;
    }
  };

  const isPMDocument = ["master", "filter-press-daily", "mill-daily", "ro-plant-daily", "acid-elution-weekly", "air-water-services-weekly", "bottom-of-tanks-weekly", "diesel-farm-weekly", "filter-press-weekly", "gold-room-weekly", "grease-oils-weekly", "mill-weekly", "potable-water-weekly", "reagents-weekly", "thickener-weekly", "top-of-tanks-weekly", "admin-generator-weekly", "andy-dam-generator-weekly", "juno-generator-weekly", "lab-generator-weekly", "portable-generators-weekly", "forklift-weekly", "ewp-weekly"].includes(activeView);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <PMSidebarContent 
          activeView={activeView} 
          setActiveView={setActiveView}
          expandedDisciplines={expandedDisciplines}
          toggleDiscipline={toggleDiscipline}
          expandedFrequencies={expandedFrequencies}
          toggleFrequency={toggleFrequency}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {isPMDocument ? (
            <div className="p-6 overflow-auto">
              {/* Print Button */}
              <div className="flex justify-end mb-4 print:hidden">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Print Preview
                </Button>
              </div>
              {renderPMDocument()}
            </div>
          ) : (
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                {(() => {
                  const labels = getActiveFrequencyLabel();
                  return (
                    <>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {labels?.discipline} - {labels?.frequency}
                      </h2>
                      <p className="text-muted-foreground mb-8">
                        PMs in this frequency group will appear here once created.
                      </p>
                    </>
                  );
                })()}
                
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    No PMs Created Yet
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first PM using the Base PM Template
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    Create PM
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Print Preview Modal */}
        <PrintPreviewModal
          isOpen={showPrintPreview}
          onClose={() => setShowPrintPreview(false)}
          title={getDocumentTitle()}
        >
          {renderPMDocument()}
        </PrintPreviewModal>
      </div>
    </SidebarProvider>
  );
};

// Sidebar Component
const PMSidebarContent = ({ 
  activeView, 
  setActiveView, 
  expandedDisciplines,
  toggleDiscipline,
  expandedFrequencies,
  toggleFrequency,
}: { 
  activeView: ViewType; 
  setActiveView: (view: ViewType) => void;
  expandedDisciplines: Discipline[];
  toggleDiscipline: (disciplineId: Discipline) => void;
  expandedFrequencies: string[];
  toggleFrequency: (key: string) => void;
}) => {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="w-64 border-r border-border" collapsible="icon">
      <SidebarContent className="pt-4">
        {/* Collapse Toggle */}
        <div className="px-4 mb-2 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <PanelLeft className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Back to Home */}
        <div className="px-4 mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {!isCollapsed && "Back to Home"}
          </Link>
        </div>

        {/* Header */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PM</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">PM Design</h1>
                <p className="text-xs text-muted-foreground">Structure & Templates</p>
              </div>
            </div>
          </div>
        )}

        {/* Master Template */}
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
              Template
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveView("master")}
                  tooltip="Base PM Template"
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-3",
                    activeView === "master" && "bg-primary/10 text-primary border-l-2 border-primary"
                  )}
                >
                  <FileText className="w-4 h-4" />
                  {!isCollapsed && <span className="font-medium">Base PM Template</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Discipline Groups */}
        <SidebarGroup className="mt-4">
          {!isCollapsed && (
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
              By Discipline
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <div className="space-y-1 px-2">
              {disciplines.map((discipline) => {
                const DisciplineIcon = discipline.icon;
                const totalPMs = Object.values(discipline.frequencies).reduce((sum, f) => sum + f.count, 0);
                
                return (
                  <Collapsible
                    key={discipline.id}
                    open={expandedDisciplines.includes(discipline.id)}
                    onOpenChange={() => toggleDiscipline(discipline.id)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div
                        className={cn(
                          "flex items-center justify-between w-full px-2 py-2.5 rounded-md text-sm transition-colors",
                          "hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <DisciplineIcon className={cn(
                            "w-4 h-4",
                            discipline.id === "mechanical" ? "text-orange-500" : 
                            discipline.id === "electrical" ? "text-blue-500" : "text-green-500"
                          )} />
                          {!isCollapsed && <span className="font-semibold">{discipline.label}</span>}
                        </div>
                        {!isCollapsed && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {totalPMs}
                            </span>
                            <ChevronRight 
                              className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform",
                                expandedDisciplines.includes(discipline.id) && "rotate-90"
                              )} 
                            />
                          </div>
                        )}
                      </div>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent>
                        <div className="ml-4 py-1 space-y-0.5">
                          {frequencyGroups.map((freq) => {
                            const freqKey = `${discipline.id}-${freq.id}`;
                            const freqData = discipline.frequencies[freq.id];
                            
                            return (
                              <Collapsible
                                key={freqKey}
                                open={expandedFrequencies.includes(freqKey)}
                                onOpenChange={() => toggleFrequency(freqKey)}
                              >
                                <CollapsibleTrigger className="w-full">
                                  <div
                                    className={cn(
                                      "flex items-center justify-between w-full px-2 py-2 rounded-md text-sm transition-colors",
                                      "hover:bg-muted/50",
                                      activeView === freqKey && "bg-primary/10 text-primary"
                                    )}
                                    onClick={(e) => {
                                      if (freqData.count === 0) {
                                        e.stopPropagation();
                                        setActiveView(freqKey as ViewType);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span className="text-sm">{freq.label}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={cn(
                                        "text-xs px-1.5 py-0.5 rounded",
                                        freqData.count > 0 
                                          ? "bg-primary/10 text-primary" 
                                          : "bg-muted text-muted-foreground"
                                      )}>
                                        {freqData.count}
                                      </span>
                                      {freqData.count > 0 && (
                                        <ChevronRight 
                                          className={cn(
                                            "w-3.5 h-3.5 text-muted-foreground transition-transform",
                                            expandedFrequencies.includes(freqKey) && "rotate-90"
                                          )} 
                                        />
                                      )}
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                {freqData.count > 0 && (
                                  <CollapsibleContent>
                                    <div className="ml-5 py-1 pl-3 border-l border-border space-y-1">
                                      {/* Render subgroups if they exist */}
                                      {freqData.subgroups && freqData.subgroups.length > 0 ? (
                                        freqData.subgroups.map((subgroup) => (
                                          <Collapsible
                                            key={subgroup.id}
                                            open={expandedFrequencies.includes(`${freqKey}-${subgroup.id}`)}
                                            onOpenChange={() => toggleFrequency(`${freqKey}-${subgroup.id}`)}
                                          >
                                            <CollapsibleTrigger className="w-full">
                                              <div className="flex items-center justify-between w-full px-2 py-1.5 rounded-md text-xs transition-colors hover:bg-muted/50">
                                                <span className="font-medium text-muted-foreground">{subgroup.label}</span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                                                    {subgroup.pms.length}
                                                  </span>
                                                  <ChevronRight 
                                                    className={cn(
                                                      "w-3 h-3 text-muted-foreground transition-transform",
                                                      expandedFrequencies.includes(`${freqKey}-${subgroup.id}`) && "rotate-90"
                                                    )} 
                                                  />
                                                </div>
                                              </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                              <div className="ml-3 py-1 pl-2 border-l border-border/50 space-y-1">
                                                {subgroup.pms.map((pm) => (
                                                  <button
                                                    key={pm.id}
                                                    onClick={() => setActiveView(pm.id as ViewType)}
                                                    className={cn(
                                                      "text-xs text-left w-full py-1.5 px-2 rounded transition-colors",
                                                      activeView === pm.id 
                                                        ? "text-primary bg-primary/10" 
                                                        : "text-foreground hover:text-primary hover:bg-muted/50"
                                                    )}
                                                  >
                                                    {pm.name}
                                                  </button>
                                                ))}
                                              </div>
                                            </CollapsibleContent>
                                          </Collapsible>
                                        ))
                                      ) : (
                                        /* Render flat PM list if no subgroups */
                                        freqData.pms.map((pm) => (
                                          <button
                                            key={pm.id}
                                            onClick={() => setActiveView(pm.id as ViewType)}
                                            className={cn(
                                              "text-xs text-left w-full py-1.5 px-2 rounded transition-colors",
                                              activeView === pm.id 
                                                ? "text-primary bg-primary/10" 
                                                : "text-foreground hover:text-primary hover:bg-muted/50"
                                            )}
                                          >
                                            {pm.name}
                                          </button>
                                        ))
                                      )}
                                      <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 py-1 transition-colors">
                                        <Plus className="w-3 h-3" />
                                        Add PM
                                      </button>
                                    </div>
                                  </CollapsibleContent>
                                )}
                              </Collapsible>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                );
              })}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default PMDesign;
