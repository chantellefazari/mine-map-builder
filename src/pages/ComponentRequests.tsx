import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, CheckSquare } from "lucide-react";
import { ComponentSubmissionSheet } from "@/components/component-requests/ComponentSubmissionSheet";
import { ComponentReviewPanel } from "@/components/component-requests/ComponentReviewPanel";
import { useAuth } from "@/context/AuthContext";

const ComponentRequests = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Component Change Requests</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit new components for the asset tree. All submissions are reviewed before being applied.
        </p>
      </div>

      <Tabs defaultValue="submit" className="w-full">
        <TabsList>
          <TabsTrigger value="submit" className="gap-1.5">
            <ClipboardList className="h-3.5 w-3.5" />
            Submit Components
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="review" className="gap-1.5">
              <CheckSquare className="h-3.5 w-3.5" />
              Review & Approve
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="submit" className="mt-4">
          <ComponentSubmissionSheet />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="review" className="mt-4">
            <ComponentReviewPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ComponentRequests;
