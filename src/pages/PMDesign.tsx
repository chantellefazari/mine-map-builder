import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Calendar, ChevronRight, Plus } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { PMBaseMasterTemplate } from "@/components/pm-design/PMBaseMasterTemplate";

type FrequencyGroup = "1-week" | "2-week" | "6-week" | "12-week";

const frequencyGroups = [
  { id: "1-week" as FrequencyGroup, label: "1 WEEK PMs", count: 0 },
  { id: "2-week" as FrequencyGroup, label: "2 WEEK PMs", count: 0 },
  { id: "6-week" as FrequencyGroup, label: "6 WEEK PMs", count: 0 },
  { id: "12-week" as FrequencyGroup, label: "12 WEEK PMs", count: 0 },
];

const PMDesign = () => {
  const [activeView, setActiveView] = useState<"master" | FrequencyGroup>("master");
  const [expandedGroups, setExpandedGroups] = useState<FrequencyGroup[]>([]);

  const toggleGroup = (groupId: FrequencyGroup) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="w-64 border-r border-border">
          <SidebarContent className="pt-4">
            {/* Back to Home */}
            <div className="px-4 mb-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            {/* Header */}
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

            {/* Master Template */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                Template
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveView("master")}
                      className={cn(
                        "w-full justify-start gap-3 px-4 py-3",
                        activeView === "master" && "bg-primary/10 text-primary border-l-2 border-primary"
                      )}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="font-medium">Base PM Template</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Frequency Groups */}
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                By Frequency
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-1 px-2">
                  {frequencyGroups.map((group) => (
                    <Collapsible
                      key={group.id}
                      open={expandedGroups.includes(group.id)}
                      onOpenChange={() => toggleGroup(group.id)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div
                          className={cn(
                            "flex items-center justify-between w-full px-2 py-2.5 rounded-md text-sm transition-colors",
                            "hover:bg-muted/50",
                            activeView === group.id && "bg-primary/10 text-primary"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveView(group.id);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{group.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                              {group.count}
                            </span>
                            <ChevronRight 
                              className={cn(
                                "w-4 h-4 text-muted-foreground transition-transform",
                                expandedGroups.includes(group.id) && "rotate-90"
                              )} 
                            />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-7 py-2 pl-4 border-l border-border">
                          <p className="text-xs text-muted-foreground italic">
                            No PMs added yet
                          </p>
                          <button className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 mt-2 transition-colors">
                            <Plus className="w-3 h-3" />
                            Add PM
                          </button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {activeView === "master" ? (
            <PMBaseMasterTemplate />
          ) : (
            <div className="p-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {frequencyGroups.find(g => g.id === activeView)?.label}
                </h2>
                <p className="text-muted-foreground mb-8">
                  PMs in this frequency group will appear here once created.
                </p>
                
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
      </div>
    </SidebarProvider>
  );
};

export default PMDesign;
