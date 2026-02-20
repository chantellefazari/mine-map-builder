import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Eye, Box, Database, Layout, AlertTriangle, TreePine } from "lucide-react";
import { StoreLayout2D } from "./StoreLayout2D";
import { StoreLayout3D } from "./StoreLayout3D";
import { StoresAssetTree } from "./StoresAssetTree";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type ViewMode = "2d" | "3d";

export const StoreVisualisation = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("2d");
  const [liveMode, setLiveMode] = useState(false);

  // Fetch site spares for live mode
  const { data: sparesData = [] } = useQuery({
    queryKey: ["store-visualisation-spares"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_spares")
        .select("id, description, bin_location, warehouse_area, category, part_number");
      if (error) throw error;
      return data || [];
    },
    enabled: liveMode,
  });

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Visual Reference Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This visualisation is based on the stores design rules. It does not modify any data.
          </p>
        </div>
      </div>

      {/* Header & Controls */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Store Visualisation</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Interactive layout of TCMG storage containers
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* 2D / 3D Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "2d" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => setViewMode("2d")}
                >
                  <Layout className="w-3.5 h-3.5 mr-1.5" />
                  2D Plan
                </Button>
                <Button
                  variant={viewMode === "3d" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={() => setViewMode("3d")}
                >
                  <Box className="w-3.5 h-3.5 mr-1.5" />
                  3D View
                </Button>
              </div>

              {/* Live Data Toggle */}
              <div className="flex items-center gap-2">
                <Switch
                  id="live-mode"
                  checked={liveMode}
                  onCheckedChange={setLiveMode}
                />
                <Label htmlFor="live-mode" className="text-xs flex items-center gap-1.5 cursor-pointer">
                  <Database className="w-3.5 h-3.5" />
                  Live Inventory
                </Label>
              </div>
            </div>
          </div>
        </CardHeader>

        {liveMode && (
          <CardContent className="pt-0">
            <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-xs text-muted-foreground">
              Showing {sparesData.length} parts with warehouse area assignments from inventory
            </div>
          </CardContent>
        )}
      </Card>

      {/* Visualisation Area */}
      <div className="relative">
        {viewMode === "2d" ? (
          <StoreLayout2D liveMode={liveMode} sparesData={sparesData} />
        ) : (
          <StoreLayout3D liveMode={liveMode} sparesData={sparesData} />
        )}
      </div>

      {/* Stores Tree Navigator */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pt-2">
          <TreePine className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Container Navigator</h3>
        </div>
        <StoresAssetTree />
      </div>
    </div>
  );
};
