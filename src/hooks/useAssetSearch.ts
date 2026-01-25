import { useMemo, useEffect, useRef } from "react";
import { Area } from "@/components/hierarchy/assetData";
import { pidTagMappings } from "@/components/hierarchy/pidTagMappings";
export interface SearchResult {
  type: "area" | "subarea" | "parentAsset" | "equipment";
  path: string[];
  label: string;
  assetNumber?: string;
  uniqueId: string;
  /** P&ID tag that matched the search (if applicable) */
  matchedPidTag?: string;
}

export const useAssetSearch = (areasData: Area[], searchQuery: string) => {
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return { results: [] as SearchResult[], matchingPaths: new Set<string>(), firstMatchId: null as string | null };
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];
    const matchingPaths = new Set<string>();
    let firstMatchId: string | null = null;

    areasData.forEach((area) => {
      const areaPath = [area.code];
      const areaId = `area-${area.code}`;
      
      if (area.label.toLowerCase().includes(query) || area.code.toLowerCase().includes(query)) {
        if (!firstMatchId) firstMatchId = areaId;
        searchResults.push({
          type: "area",
          path: areaPath,
          label: `${area.code} – ${area.label}`,
          uniqueId: areaId,
        });
        matchingPaths.add(areaPath.join("/"));
      }

      area.subAreas.forEach((subArea, subIdx) => {
        const subAreaPath = [...areaPath, subArea.label];
        const subAreaId = `subarea-${area.code}-${subIdx}`;
        
        if (subArea.label.toLowerCase().includes(query)) {
          if (!firstMatchId) firstMatchId = subAreaId;
          searchResults.push({
            type: "subarea",
            path: subAreaPath,
            label: subArea.label,
            uniqueId: subAreaId,
          });
          matchingPaths.add(areaPath.join("/"));
          matchingPaths.add(subAreaPath.join("/"));
        }

        subArea.parentAssets.forEach((parentAsset, paIdx) => {
          const parentAssetPath = [...subAreaPath, parentAsset.label];
          const parentAssetId = `parent-${area.code}-${subIdx}-${paIdx}`;
          
          if (parentAsset.label.toLowerCase().includes(query)) {
            if (!firstMatchId) firstMatchId = parentAssetId;
            searchResults.push({
              type: "parentAsset",
              path: parentAssetPath,
              label: parentAsset.label,
              uniqueId: parentAssetId,
            });
            matchingPaths.add(areaPath.join("/"));
            matchingPaths.add(subAreaPath.join("/"));
            matchingPaths.add(parentAssetPath.join("/"));
          }

          parentAsset.equipment.forEach((equip, eqIdx) => {
            const equipPath = [...parentAssetPath, equip.assetNumber];
            const equipLabel = `${equip.assetNumber} — ${equip.name}`;
            const equipId = `equip-${area.code}-${subIdx}-${paIdx}-${eqIdx}`;
            
            // Check if asset number or name matches
            const nameMatch = equip.assetNumber.toLowerCase().includes(query) ||
              equip.name.toLowerCase().includes(query);
            
            // Check if any P&ID tag matches
            const matchedPidTag = equip.pidTags?.find(tag => 
              tag.toLowerCase().includes(query)
            );
            
            if (nameMatch || matchedPidTag) {
              if (!firstMatchId) firstMatchId = equipId;
              searchResults.push({
                type: "equipment",
                path: equipPath,
                label: equipLabel,
                assetNumber: equip.assetNumber,
                uniqueId: equipId,
                matchedPidTag: matchedPidTag,
              });
              // Add all parent paths to expand them
              matchingPaths.add(areaPath.join("/"));
              matchingPaths.add(subAreaPath.join("/"));
              matchingPaths.add(parentAssetPath.join("/"));
              matchingPaths.add(equipPath.join("/"));
            }
          });
        });
      });
    });

    return { results: searchResults, matchingPaths, firstMatchId };
  }, [areasData, searchQuery]);

  // Scroll to first match after a short delay to allow expansion
  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    if (results.firstMatchId) {
      scrollTimeoutRef.current = setTimeout(() => {
        const element = document.getElementById(results.firstMatchId!);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [results.firstMatchId]);

  return results;
};
