import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlantIntelligence } from "@/hooks/usePlantIntelligence";
import { RulesLibrary } from "@/components/plant-intelligence/RulesLibrary";
import { AddLogicForm } from "@/components/plant-intelligence/AddLogicForm";
import { VoiceCapture } from "@/components/plant-intelligence/VoiceCapture";
import { ReviewQueue } from "@/components/plant-intelligence/ReviewQueue";
import { Brain, List, PlusCircle, Mic, ClipboardCheck } from "lucide-react";

const PlantIntelligence = () => {
  const { rules, isLoading, addRule, updateRule } = usePlantIntelligence();

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Plant Intelligence</h1>
          <p className="text-sm text-muted-foreground">Site logic knowledge base - rules, dependencies & lessons learned</p>
        </div>
      </div>

      <Tabs defaultValue="library">
        <TabsList className="mb-6">
          <TabsTrigger value="library" className="gap-1.5"><List className="w-3.5 h-3.5" /> Rules Library</TabsTrigger>
          <TabsTrigger value="add" className="gap-1.5"><PlusCircle className="w-3.5 h-3.5" /> Add Logic</TabsTrigger>
          <TabsTrigger value="voice" className="gap-1.5"><Mic className="w-3.5 h-3.5" /> Voice Capture</TabsTrigger>
          <TabsTrigger value="review" className="gap-1.5"><ClipboardCheck className="w-3.5 h-3.5" /> Review Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <RulesLibrary rules={rules} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="add">
          <AddLogicForm onSave={(r) => addRule.mutate(r)} isSaving={addRule.isPending} />
        </TabsContent>
        <TabsContent value="voice">
          <VoiceCapture onSave={(r) => addRule.mutate(r)} isSaving={addRule.isPending} />
        </TabsContent>
        <TabsContent value="review">
          <ReviewQueue
            rules={rules}
            onUpdate={(id, status) => updateRule.mutate({ id, status })}
            isUpdating={updateRule.isPending}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantIntelligence;
