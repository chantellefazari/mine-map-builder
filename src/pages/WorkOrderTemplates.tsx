import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ClipboardList, Wrench, Zap, Droplets, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MechanicalWorkOrderTemplate } from "@/components/work-orders/MechanicalWorkOrderTemplate";

type TemplateType = "mechanical" | "electrical" | "hydraulic" | "general" | null;

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

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "mechanical":
        return <MechanicalWorkOrderTemplate />;
      case "electrical":
      case "hydraulic":
      case "general":
        return (
          <div className="flex items-center justify-center h-96 text-muted-foreground">
            <p>Template coming soon...</p>
          </div>
        );
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
              <h1 className="text-lg font-semibold text-foreground">Work Order Templates</h1>
              <p className="text-xs text-muted-foreground">Standardized Procedures</p>
            </div>
          </div>
        </div>

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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {selectedTemplate ? (
          <div className="p-6">
            {renderTemplate()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Select a Template Category</h2>
            <p className="text-muted-foreground max-w-md">
              Choose a work order category from the sidebar to view and use standardized maintenance templates.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkOrderTemplates;
