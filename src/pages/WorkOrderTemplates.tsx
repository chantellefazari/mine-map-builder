import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, ListOrdered } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MechanicalWorkOrderTemplate } from "@/components/work-orders/MechanicalWorkOrderTemplate";
import { WorkOrderRegister } from "@/components/work-orders/WorkOrderRegister";

type TemplateType = "mechanical" | null;

const templateCategories = [
  {
    id: "mechanical" as TemplateType,
    name: "Work Orders",
    icon: ClipboardList,
    description: "Standard work order template for all maintenance tasks",
  },
];

const WorkOrderTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(null);
  const [activeTab, setActiveTab] = useState("register");

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "mechanical":
        return <MechanicalWorkOrderTemplate />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Work Orders</h1>
              <p className="text-xs text-muted-foreground">Register & Templates</p>
            </div>
          </div>
        </div>

        {/* Tabs for switching between Register and Templates */}
        <div className="p-4 border-b border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="register" className="text-xs">
                <ListOrdered className="h-3 w-3 mr-1" />
                Register
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs">
                <ClipboardList className="h-3 w-3 mr-1" />
                Templates
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {activeTab === "templates" && (
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-2">
              {templateCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedTemplate(category.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedTemplate === category.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className={`h-5 w-5 ${selectedTemplate === category.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-medium ${selectedTemplate === category.id ? "text-primary" : "text-foreground"}`}>
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}

        {activeTab === "register" && (
          <div className="flex-1 p-4">
            <p className="text-sm text-muted-foreground">
              View and manage all work orders with sequential numbering system.
            </p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === "register" ? (
          <WorkOrderRegister />
        ) : selectedTemplate ? (
          <div className="p-6">
            {renderTemplate()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Select a Template</h2>
            <p className="text-muted-foreground max-w-md">
              Choose a work order template from the sidebar to view and use standardized maintenance templates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkOrderTemplates;
