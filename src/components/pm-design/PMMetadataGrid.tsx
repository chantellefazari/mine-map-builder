import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PMAssetSearchCombobox } from "./PMAssetSearchCombobox";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { flattenAssetTree } from "@/utils/flattenAssetTree";

interface PMMetadataGridProps {
  pmId?: string;
  projectSite: string;
  plantArea: string;
  pmGroup: string;
  pmType: string;
  frequency: string;
  assetNumber?: string;
  resources?: string;
}

export const PMMetadataGrid = ({
  pmId,
  projectSite,
  plantArea,
  pmGroup,
  pmType,
  frequency,
  assetNumber: initialAssetNumber = "",
  resources: initialResources = "",
}: PMMetadataGridProps) => {
  const queryClient = useQueryClient();
  const [resources, setResources] = useState(initialResources);
  const [assetNumber, setAssetNumber] = useState(initialAssetNumber);
  const [derivedPlantArea, setDerivedPlantArea] = useState("");
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestResourcesRef = useRef(initialResources);
  const latestInitialResourcesRef = useRef(initialResources);

  useEffect(() => {
    setResources(initialResources);
    latestResourcesRef.current = initialResources;
    latestInitialResourcesRef.current = initialResources;
  }, [initialResources]);

  useEffect(() => {
    setAssetNumber(initialAssetNumber);
    // Derive plant area from initial asset number
    if (initialAssetNumber) {
      const assets = flattenAssetTree();
      const match = assets.find((a) => a.assetId === initialAssetNumber);
      if (match) {
        setDerivedPlantArea(match.area);
      }
    } else {
      setDerivedPlantArea("");
    }
  }, [initialAssetNumber]);

  useEffect(() => {
    latestResourcesRef.current = resources;
  }, [resources]);

  const saveField = useCallback(async (field: string, value: string) => {
    if (!pmId) return;
    const { error } = await supabase
      .from("pm_master_list")
      .update({ [field]: value } as any)
      .eq("id", pmId);
    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["pm-master-list"] });
    }
  }, [pmId, queryClient]);

  const flushResourceSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (latestResourcesRef.current !== latestInitialResourcesRef.current) {
      void saveField("resources", latestResourcesRef.current);
    }
  }, [saveField]);

  // Auto-save resources with debounce
  useEffect(() => {
    if (resources === initialResources) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      void saveField("resources", resources);
    }, 800);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [resources, initialResources, saveField]);

  useEffect(() => {
    return () => {
      flushResourceSave();
    };
  }, [flushResourceSave]);

  return (
    <div className="grid grid-cols-2 border-b border-border text-xs">
      <div className="border-r border-border">
        <div className="grid grid-cols-[120px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Project / Site:</div>
          <div className="px-2 py-1.5">{projectSite}</div>
        </div>
        <div className="grid grid-cols-[120px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Asset Number:</div>
          <div className="px-2 py-1.5 flex items-center">
            <PMAssetSearchCombobox
              value={assetNumber}
              onChange={(id, _name, area) => {
                setAssetNumber(id);
                setDerivedPlantArea(area || "");
                saveField("asset_number", id);
              }}
              compact
            />
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Plant Area:</div>
          <div className="px-2 py-1.5">{derivedPlantArea || plantArea}</div>
        </div>
        <div className="grid grid-cols-[120px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Resource/s:</div>
          <div className="px-2 py-1.5">
            <Input
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              onBlur={flushResourceSave}
              placeholder="e.g. 1x Fitter (2 hrs)"
              className="h-auto p-0 text-xs border-none shadow-none focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-[120px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Group:</div>
          <div className="px-2 py-1.5">{pmGroup}</div>
        </div>
        <div className="grid grid-cols-[120px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">PM Type:</div>
          <div className="px-2 py-1.5">{pmType}</div>
        </div>
        <div className="grid grid-cols-[120px_1fr] border-b border-border">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Frequency:</div>
          <div className="px-2 py-1.5 font-medium">{frequency}</div>
        </div>
        <div className="grid grid-cols-[120px_1fr]">
          <div className="bg-muted px-2 py-1.5 font-semibold border-r border-border">Date:</div>
          <div className="px-2 py-1.5"></div>
        </div>
      </div>
    </div>
  );
};
