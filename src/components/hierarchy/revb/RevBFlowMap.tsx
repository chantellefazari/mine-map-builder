import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Loader2 } from "lucide-react";

interface FlowLink {
  tag_id: string;
  description: string;
  downstream_tag: string;
  area_clue: string;
}

function useFlowData() {
  return useQuery({
    queryKey: ["rev-b-flow-map"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rev_b_pid_extraction_register")
        .select("tag_id, description, upstream_tag, downstream_tag, area_clue")
        .eq("tag_type", "Equipment")
        .order("page_number", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as (FlowLink & { upstream_tag: string })[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Build main process chains from upstream/downstream links
function buildChains(tags: (FlowLink & { upstream_tag: string })[]) {
  // Find equipment that has downstream connections
  const withFlow = tags.filter(t => t.downstream_tag && t.downstream_tag !== "");
  
  // Group by area for area-level chains
  const areaOrder = [
    "Milling", "Classification", "Gravity", "Leaching", "Adsorption",
    "Elution", "Carbon Regen", "Electrowinning", "Goldroom", "Thickener", "Filter Press",
    "Process Water/Air", "Raw Water", "Reagents"
  ];

  const areaChains = new Map<string, FlowLink[]>();
  for (const area of areaOrder) {
    const areaLinks = withFlow.filter(t => t.area_clue === area);
    if (areaLinks.length > 0) {
      areaChains.set(area, areaLinks);
    }
  }

  return areaChains;
}

export const RevBFlowMap: React.FC = () => {
  const { data: tags, isLoading } = useFlowData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading flow data…</span>
      </div>
    );
  }

  if (!tags) return null;

  const chains = buildChains(tags);

  // Main process chain summary
  const mainChain = [
    { from: "04-FB-099", fromName: "Reclaim Hopper", to: "04-FE-100", toName: "Reclaim Feeder", area: "Milling" },
    { from: "04-FE-100", fromName: "Reclaim Feeder", to: "04-JE-101", toName: "Transfer Conveyor", area: "Milling" },
    { from: "04-JE-101", fromName: "Transfer Conveyor", to: "04-BE-100", toName: "Mill Feed Conveyor", area: "Milling" },
    { from: "04-BE-100", fromName: "Mill Feed Conveyor", to: "04-GR-100", toName: "Primary Ball Mill", area: "Milling" },
    { from: "04-ML-100", fromName: "Mill Body", to: "04-PS-109", toName: "Mill Discharge Sump", area: "Milling" },
    { from: "04-PS-109", fromName: "Discharge Sump", to: "04-PU-102A/B", toName: "Cyclone Feed Pumps", area: "Milling" },
    { from: "04-CY-106", fromName: "Cyclone Cluster", to: "04-CY-100A/B/C", toName: "Individual Cyclones", area: "Classification" },
    { from: "05-CH-001", fromName: "Trash Screen Feed", to: "05-SC-001", toName: "Trash Screen", area: "Leaching" },
    { from: "05-TK-001", fromName: "Leach Tank 1", to: "05-TK-002", toName: "Leach Tank 2", area: "Leaching" },
    { from: "05-TK-003", fromName: "CIP Tank 1", to: "05-TK-008", toName: "CIP Tank 6", area: "Adsorption" },
    { from: "07-EC-001", fromName: "Elution Column", to: "07-HX-001", toName: "Heat Exchanger", area: "Elution" },
    { from: "08-KN-001", fromName: "Regen Kiln", to: "08-HP-002", toName: "Regen Carbon Hopper", area: "Carbon Regen" },
    { from: "09-EW-001", fromName: "EW Cell 1", to: "10-FN-001", toName: "Smelting Furnace", area: "EW → Goldroom" },
    { from: "12-TM-001", fromName: "Tails Thickener", to: "12-PU-206A", toName: "U/F Pumps", area: "Thickener" },
    { from: "13-TK-101", fromName: "Homogeniser 1", to: "13-FP-101", toName: "Filter Press 1", area: "Filter Press" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Process Chain */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Main Process Chain (Feed → Product)</h3>
        <div className="bg-muted/30 rounded-lg p-4 space-y-1">
          {mainChain.map((link, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-primary font-medium w-28">{link.from}</span>
              <span className="text-muted-foreground w-40 truncate">{link.fromName}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="font-mono text-primary font-medium w-28">{link.to}</span>
              <span className="text-muted-foreground w-40 truncate">{link.toName}</span>
              <span className="text-[10px] text-muted-foreground/60 ml-auto">{link.area}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Area Flow Details */}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Area-Level Flow Details</h3>
        <div className="space-y-3 max-h-[400px] overflow-auto">
          {Array.from(chains.entries()).map(([area, links]) => (
            <div key={area} className="border border-border rounded p-3">
              <h4 className="text-xs font-semibold text-foreground mb-2">
                {area} <span className="text-muted-foreground font-normal">({links.length} connections)</span>
              </h4>
              <div className="space-y-0.5">
                {links.map((link, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-mono text-primary">{link.tag_id}</span>
                    <span className="text-muted-foreground truncate max-w-[200px]">{link.description}</span>
                    <ArrowRight className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
                    <span className="font-mono text-primary">{link.downstream_tag}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
