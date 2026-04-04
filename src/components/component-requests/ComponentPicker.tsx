import { useState, useMemo, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ComponentPickerProps {
  assetNumber: string;
  value: string; // stores "index:name" e.g. "2:Mechanical Seal Kit"
  onSelect: (index: number, name: string) => void;
  disabled?: boolean;
}

interface AssetComponent {
  index: number;
  componentName: string;
  componentType: string;
  manufacturer?: string;
  model?: string;
}

export function ComponentPicker({ assetNumber, value, onSelect, disabled }: ComponentPickerProps) {
  const { data: components } = useQuery({
    queryKey: ["asset-components", assetNumber],
    queryFn: async () => {
      if (!assetNumber) return [];
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("components")
        .eq("asset_number", assetNumber)
        .maybeSingle();
      if (error || !data) return [];
      const comps = Array.isArray(data.components) ? data.components : [];
      return comps.map((c: any, i: number) => ({
        index: i,
        componentName: c.componentName || c.componentType || "Unknown",
        componentType: c.componentType || "",
        manufacturer: c.manufacturer || "",
        model: c.model || "",
      })) as AssetComponent[];
    },
    enabled: !!assetNumber,
  });

  if (!assetNumber) {
    return <span className="text-xs text-muted-foreground px-2">Select asset first</span>;
  }

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const [idx, ...nameParts] = v.split(":");
        onSelect(parseInt(idx), nameParts.join(":"));
      }}
      disabled={disabled || !components?.length}
    >
      <SelectTrigger className="h-8 text-xs border-0 bg-transparent">
        <SelectValue placeholder={components?.length ? "Select component" : "No components"} />
      </SelectTrigger>
      <SelectContent>
        {components?.map((c) => (
          <SelectItem key={c.index} value={`${c.index}:${c.componentName}`}>
            <div className="flex flex-col">
              <span className="text-xs font-medium">{c.componentName}</span>
              {(c.manufacturer || c.model) && (
                <span className="text-[10px] text-muted-foreground">
                  {[c.manufacturer, c.model].filter(Boolean).join(" · ")}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
