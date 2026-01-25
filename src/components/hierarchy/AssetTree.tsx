import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { areasData, AreaType } from "./assetData";

interface AssetTreeProps {
  searchQuery?: string;
}

export const AssetTree: React.FC<AssetTreeProps> = ({ searchQuery = "" }) => {
  const { matchingPaths } = useAssetSearch(areasData, searchQuery);
  const hasSearch = searchQuery.trim().length > 0;

  // Helper to check if a path should be expanded due to search
  const shouldExpandForSearch = (pathParts: string[]) => {
    if (!hasSearch) return false;
    return matchingPaths.has(pathParts.join("/"));
  };

  // Helper to check if an item matches search
  const matchesSearch = (text: string) => {
    if (!hasSearch) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="min-w-max flex justify-center">
        {/* Root: Site - Centered */}
        <CollapsibleTreeNode label="TCMG" level="site" hasChildren defaultExpanded centered>
          {/* Level 2: Facilities - Mining, Crushing Plant, Processing Plant */}
          
          {/* Mining (placeholder - no areas yet) */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Mining" level="plant" hasChildren={false} />
          </TreeBranch>
          
          {/* Crushing Plant */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Crushing Plant" level="plant" hasChildren defaultExpanded>
              <TreeBranch isLast={false}>
                <CollapsibleTreeNode label="ROM" level="subarea" hasChildren={false} />
              </TreeBranch>
              <TreeBranch isLast={false}>
                <CollapsibleTreeNode label="Crushing" level="subarea" hasChildren={false} />
              </TreeBranch>
              <TreeBranch isLast={true}>
                <CollapsibleTreeNode label="Screening" level="subarea" hasChildren={false} />
              </TreeBranch>
            </CollapsibleTreeNode>
          </TreeBranch>
          
          {/* Processing Plant */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren defaultExpanded>
              {/* Level 3: Areas */}
              {areasData.map((area, areaIndex) => {
                const areaPath = [area.code];
                const areaExpanded = shouldExpandForSearch(areaPath);
                const areaId = `area-${area.code}`;
                
                return (
                  <TreeBranch key={area.code} isLast={areaIndex === areasData.length - 1}>
                    <CollapsibleTreeNode
                      id={areaId}
                      code={area.code}
                      label={area.label}
                      level="area"
                      areaType={area.code as AreaType}
                      hasChildren={area.subAreas.length > 0}
                      defaultExpanded={areaExpanded}
                      forceExpanded={areaExpanded}
                      isHighlighted={matchesSearch(area.label) || matchesSearch(area.code)}
                    >
                      {/* Level 4: Sub Areas */}
                      {area.subAreas.map((subArea, subIndex) => {
                        const subAreaPath = [...areaPath, subArea.label];
                        const subAreaExpanded = shouldExpandForSearch(subAreaPath);
                        const subAreaId = `subarea-${area.code}-${subIndex}`;
                        
                        return (
                          <TreeBranch key={subIndex} isLast={subIndex === area.subAreas.length - 1}>
                            <CollapsibleTreeNode
                              id={subAreaId}
                              label={subArea.label}
                              level="subarea"
                              hasChildren={subArea.parentAssets.length > 0}
                              defaultExpanded={subAreaExpanded}
                              forceExpanded={subAreaExpanded}
                              isHighlighted={matchesSearch(subArea.label)}
                            >
                              {/* Level 5: Parent Assets */}
                              {subArea.parentAssets.map((parentAsset, paIndex) => {
                                const parentAssetPath = [...subAreaPath, parentAsset.label];
                                const parentAssetExpanded = shouldExpandForSearch(parentAssetPath);
                                const parentAssetId = `parent-${area.code}-${subIndex}-${paIndex}`;
                                
                                return (
                                  <TreeBranch key={paIndex} isLast={paIndex === subArea.parentAssets.length - 1}>
                                    <CollapsibleTreeNode
                                      id={parentAssetId}
                                      label={parentAsset.label}
                                      level="parentAsset"
                                      hasChildren={parentAsset.equipment.length > 0}
                                      defaultExpanded={parentAssetExpanded}
                                      forceExpanded={parentAssetExpanded}
                                      isHighlighted={matchesSearch(parentAsset.label)}
                                    >
                                      {/* Level 6: Equipment */}
                                      {parentAsset.equipment.map((equip, equipIndex) => {
                                        const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                        const equipId = `equip-${area.code}-${subIndex}-${paIndex}-${equipIndex}`;
                                        return (
                                          <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
                                            <CollapsibleTreeNode
                                              id={equipId}
                                              label={equipLabel}
                                              level="equipment"
                                              hasChildren={false}
                                              isHighlighted={matchesSearch(equip.assetNumber) || matchesSearch(equip.name)}
                                            />
                                          </TreeBranch>
                                        );
                                      })}
                                    </CollapsibleTreeNode>
                                  </TreeBranch>
                                );
                              })}
                            </CollapsibleTreeNode>
                          </TreeBranch>
                        );
                      })}
                    </CollapsibleTreeNode>
                  </TreeBranch>
                );
              })}
            </CollapsibleTreeNode>
          </TreeBranch>
        </CollapsibleTreeNode>
      </div>
    </div>
  );
};
