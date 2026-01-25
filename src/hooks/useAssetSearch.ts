import { useMemo } from "react";
import { Area, ParentAsset, SubArea, Equipment } from "@/components/hierarchy/assetData";

export interface SearchResult {
  type: "area" | "subarea" | "parentAsset" | "equipment";
  path: string[];
  label: string;
  assetNumber?: string;
}

export const useAssetSearch = (areasData: Area[], searchQuery: string) => {
  const results = useMemo(() => {
    if (!searchQuery.trim()) {
      return { results: [] as SearchResult[], matchingPaths: new Set<string>() };
    }

    const query = searchQuery.toLowerCase();
    const searchResults: SearchResult[] = [];
    const matchingPaths = new Set<string>();

    areasData.forEach((area) => {
      const areaPath = [area.code];
      
      if (area.label.toLowerCase().includes(query) || area.code.toLowerCase().includes(query)) {
        searchResults.push({
          type: "area",
          path: areaPath,
          label: `${area.code} – ${area.label}`,
        });
        matchingPaths.add(areaPath.join("/"));
      }

      area.subAreas.forEach((subArea) => {
        const subAreaPath = [...areaPath, subArea.label];
        
        if (subArea.label.toLowerCase().includes(query)) {
          searchResults.push({
            type: "subarea",
            path: subAreaPath,
            label: subArea.label,
          });
          matchingPaths.add(areaPath.join("/"));
          matchingPaths.add(subAreaPath.join("/"));
        }

        subArea.parentAssets.forEach((parentAsset) => {
          const parentAssetPath = [...subAreaPath, parentAsset.label];
          
          if (parentAsset.label.toLowerCase().includes(query)) {
            searchResults.push({
              type: "parentAsset",
              path: parentAssetPath,
              label: parentAsset.label,
            });
            matchingPaths.add(areaPath.join("/"));
            matchingPaths.add(subAreaPath.join("/"));
            matchingPaths.add(parentAssetPath.join("/"));
          }

          parentAsset.equipment.forEach((equip) => {
            const equipPath = [...parentAssetPath, equip.assetNumber];
            const equipLabel = `${equip.assetNumber} — ${equip.name}`;
            
            if (
              equip.assetNumber.toLowerCase().includes(query) ||
              equip.name.toLowerCase().includes(query)
            ) {
              searchResults.push({
                type: "equipment",
                path: equipPath,
                label: equipLabel,
                assetNumber: equip.assetNumber,
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

    return { results: searchResults, matchingPaths };
  }, [areasData, searchQuery]);

  return results;
};
