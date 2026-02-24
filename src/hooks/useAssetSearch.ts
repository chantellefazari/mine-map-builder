import { useMemo, useEffect, useRef } from "react";
import { Area } from "@/components/hierarchy/assetData";
import { useProcessingPidTags } from "@/hooks/useProcessingPlantAssets";

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
  const { data: pidTagMappingsDB } = useProcessingPidTags();

  // Build lookups from DB data
  const { pidTagsByAsset } = useMemo(() => {
    const byAsset = new Map<string, string[]>();
    if (!pidTagMappingsDB) return { pidTagsByAsset: byAsset };
    pidTagMappingsDB.forEach((mapping) => {
      const existing = byAsset.get(mapping.assetNumber) || [];
      existing.push(mapping.pidTag);
      byAsset.set(mapping.assetNumber, existing);
    });
    return { pidTagsByAsset: byAsset };
  }, [pidTagMappingsDB]);

  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return { results: [] as SearchResult[], matchingPaths: new Set<string>(), firstMatchId: null as string | null };
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];
    const matchingPaths = new Set<string>();
    let firstMatchId: string | null = null;

    // Find asset numbers that match P&ID tag search
    const matchingAssetNumbers = new Set<string>();
    const matchedPidTagByAsset = new Map<string, string>();
    
    if (pidTagMappingsDB) {
      pidTagMappingsDB.forEach((mapping) => {
        if (mapping.pidTag.toLowerCase().includes(query)) {
          matchingAssetNumbers.add(mapping.assetNumber);
          matchedPidTagByAsset.set(mapping.assetNumber, mapping.pidTag);
        }
      });
    }

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
            
            const nameMatch = equip.assetNumber.toLowerCase().includes(query) ||
              equip.name.toLowerCase().includes(query);
            
            const inlinePidMatch = equip.pidTags?.find(tag => 
              tag.toLowerCase().includes(query)
            );
            
            const mappingPidMatch = matchingAssetNumbers.has(equip.assetNumber) 
              ? matchedPidTagByAsset.get(equip.assetNumber) 
              : undefined;
            
            const matchedPidTag = inlinePidMatch || mappingPidMatch;
            
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
  }, [areasData, searchQuery, pidTagMappingsDB]);

  // Scroll to first match after a delay to allow tree expansion
  useEffect(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    if (results.firstMatchId) {
      const attemptScroll = (attempt: number) => {
        const element = document.getElementById(results.firstMatchId!);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        } else if (attempt < 3) {
          scrollTimeoutRef.current = setTimeout(() => attemptScroll(attempt + 1), 200);
        }
      };
      
      scrollTimeoutRef.current = setTimeout(() => attemptScroll(0), 300);
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [results.firstMatchId]);

  return { ...results, pidTagsByAsset };
};
