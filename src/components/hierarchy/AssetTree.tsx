import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AreaType, Component } from "./assetData";
import { crushingPlantAreas } from "./crushingPlantData";
import { useProcessingPlantAssets, useProcessingPidTags } from "@/hooks/useProcessingPlantAssets";
import { Loader2 } from "lucide-react";

interface AssetTreeProps {
  searchQuery?: string;
}

export const AssetTree: React.FC<AssetTreeProps> = ({ searchQuery = "" }) => {
  const { data: areasData, isLoading: assetsLoading } = useProcessingPlantAssets();
  const { data: pidTagMappingsDB, isLoading: pidLoading } = useProcessingPidTags();

  // Build P&ID tag lookup from DB data
  const pidTagsByAsset = React.useMemo(() => {
    const lookup = new Map<string, string[]>();
    if (!pidTagMappingsDB) return lookup;
    pidTagMappingsDB.forEach((mapping) => {
      const existing = lookup.get(mapping.assetNumber) || [];
      existing.push(mapping.pidTag);
      lookup.set(mapping.assetNumber, existing);
    });
    return lookup;
  }, [pidTagMappingsDB]);

  const areas = areasData || [];
  const { matchingPaths } = useAssetSearch(areas, searchQuery);
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

  // Helper to get all P&ID tags for an asset (from both inline and mappings)
  const getAllPidTags = (assetNumber: string, inlineTags?: string[]) => {
    const mappedTags = pidTagsByAsset.get(assetNumber) || [];
    const inline = inlineTags || [];
    const allTags = [...new Set([...inline, ...mappedTags])];
    return allTags;
  };

  // Helper to check if P&ID tag matches search
  const pidTagMatchesSearch = (assetNumber: string, inlineTags?: string[]) => {
    if (!hasSearch) return false;
    const allTags = getAllPidTags(assetNumber, inlineTags);
    return allTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  // CRU search helper
  const cruMatchesSearch = (text: string) => {
    if (!hasSearch) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  if (assetsLoading || pidLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading asset hierarchy...</span>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto py-6">
      <div className="min-w-max flex justify-center">
        {/* Root: Site - Centered */}
        <CollapsibleTreeNode label="TCMG" level="site" hasChildren defaultExpanded centered depth={0}>
          {/* Level 2: Facilities - Mining, Crushing Plant, Processing Plant */}
          
          {/* Mining (placeholder - no areas yet) */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Mining" level="plant" hasChildren={false} depth={1} />
          </TreeBranch>
          
          {/* Crushing Plant – CRU hierarchy (still hardcoded) */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Crushing Plant" level="plant" hasChildren defaultExpanded areaType="CRU" depth={1}>
              {crushingPlantAreas.map((cruArea, cruAreaIndex) => (
                <TreeBranch key={cruArea.areaCode} isLast={cruAreaIndex === crushingPlantAreas.length - 1}>
                  <CollapsibleTreeNode
                    id={`cru-area-${cruArea.areaCode}`}
                    code={cruArea.areaCode.replace("CRU-", "")}
                    label={cruArea.label}
                    level="area"
                    areaType="CRU"
                    hasChildren={cruArea.parentAssets.length > 0}
                    isHighlighted={cruMatchesSearch(cruArea.label) || cruMatchesSearch(cruArea.areaCode)}
                    depth={2}
                  >
                    {cruArea.parentAssets.map((parent, paIndex) => (
                      <TreeBranch key={paIndex} isLast={paIndex === cruArea.parentAssets.length - 1}>
                        <CollapsibleTreeNode
                          id={`cru-pa-${cruArea.areaCode}-${paIndex}`}
                          label={parent.label}
                          level="parentAsset"
                          hasChildren={parent.equipment.length > 0}
                          isHighlighted={cruMatchesSearch(parent.label)}
                          depth={3}
                        >
                          {parent.equipment.map((equip, equipIndex) => {
                            const hasComponents = equip.components && equip.components.length > 0;
                            return (
                              <TreeBranch key={equipIndex} isLast={equipIndex === parent.equipment.length - 1}>
                                <CollapsibleTreeNode
                                  id={`cru-eq-${cruArea.areaCode}-${paIndex}-${equipIndex}`}
                                  label={`${equip.assetNumber} — ${equip.name}`}
                                  level="equipment"
                                  hasChildren={hasComponents}
                                  isHighlighted={cruMatchesSearch(equip.assetNumber) || cruMatchesSearch(equip.name)}
                                  depth={4}
                                >
                                  {hasComponents && equip.components!.map((comp, compIndex) => (
                                    <TreeBranch key={compIndex} isLast={compIndex === equip.components!.length - 1}>
                                      <CollapsibleTreeNode
                                        id={`cru-comp-${cruArea.areaCode}-${paIndex}-${equipIndex}-${compIndex}`}
                                        code={comp.componentType}
                                        label={`${comp.componentCode} — ${comp.componentName}`}
                                        level="component"
                                        hasChildren={false}
                                        isHighlighted={cruMatchesSearch(comp.componentCode) || cruMatchesSearch(comp.componentName) || cruMatchesSearch(comp.manufacturer)}
                                        depth={5}
                                        componentSpecs={{
                                          model: comp.model || comp.manufacturer,
                                          serialNumber: comp.serialNumber,
                                          motorSpeed: comp.motorSpeed,
                                          protection: comp.protection,
                                          voltage: comp.voltage,
                                          pumpFlow: comp.pumpFlow,
                                          operatingPressure: comp.operatingPressure,
                                          displacement: comp.displacement,
                                          oilType: comp.oilType,
                                          oilVolume: comp.oilVolume,
                                          inputSpeed: comp.inputSpeed,
                                          outputSpeed: comp.outputSpeed,
                                          weight: comp.weight,
                                        }}
                                      />
                                    </TreeBranch>
                                  ))}
                                </CollapsibleTreeNode>
                              </TreeBranch>
                            );
                          })}
                        </CollapsibleTreeNode>
                      </TreeBranch>
                    ))}
                  </CollapsibleTreeNode>
                </TreeBranch>
              ))}
            </CollapsibleTreeNode>
          </TreeBranch>
          
          {/* Processing Plant – now DB-driven */}
          <TreeBranch horizontal>
            <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren defaultExpanded depth={1}>
              {areas.map((area, areaIndex) => {
                const areaPath = [area.code];
                const areaExpanded = shouldExpandForSearch(areaPath);
                const areaId = `area-${area.code}`;
                
                return (
                  <TreeBranch key={area.code} isLast={areaIndex === areas.length - 1}>
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
                      depth={2}
                    >
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
                              depth={3}
                            >
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
                                      depth={4}
                                    >
                                      {parentAsset.equipment.map((equip, equipIndex) => {
                                        const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                        const equipId = `equip-${area.code}-${subIndex}-${paIndex}-${equipIndex}`;
                                        const allPidTags = getAllPidTags(equip.assetNumber, equip.pidTags);
                                        const isPidMatch = pidTagMatchesSearch(equip.assetNumber, equip.pidTags);
                                        const hasComponents = equip.components && equip.components.length > 0;
                                        
                                        return (
                                          <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
                                            <CollapsibleTreeNode
                                              id={equipId}
                                              label={equipLabel}
                                              level="equipment"
                                              hasChildren={hasComponents}
                                              isHighlighted={matchesSearch(equip.assetNumber) || matchesSearch(equip.name) || isPidMatch}
                                              pidTags={allPidTags}
                                              depth={5}
                                            >
                                              {hasComponents && equip.components!.map((comp, compIndex) => {
                                                const compLabel = `${comp.componentCode} — ${comp.componentName}`;
                                                const compId = `comp-${area.code}-${subIndex}-${paIndex}-${equipIndex}-${compIndex}`;
                                                
                                                return (
                                                  <TreeBranch key={compIndex} isLast={compIndex === equip.components!.length - 1}>
                                                    <CollapsibleTreeNode
                                                      id={compId}
                                                      code={comp.componentType}
                                                      label={compLabel}
                                                      level="component"
                                                      hasChildren={false}
                                                      isHighlighted={matchesSearch(comp.componentCode) || matchesSearch(comp.componentName) || matchesSearch(comp.manufacturer)}
                                                      depth={6}
                                                      componentSpecs={{
                                                        model: comp.model || comp.manufacturer,
                                                        serialNumber: comp.serialNumber,
                                                        motorRef: comp.motorRef,
                                                        pumpRef: comp.pumpRef,
                                                        motorSpeed: comp.motorSpeed,
                                                        protection: comp.protection,
                                                        voltage: comp.voltage,
                                                        pumpFlow: comp.pumpFlow,
                                                        operatingPressure: comp.operatingPressure,
                                                        displacement: comp.displacement,
                                                        oilType: comp.oilType,
                                                        oilVolume: comp.oilVolume,
                                                        inputSpeed: comp.inputSpeed,
                                                        outputSpeed: comp.outputSpeed,
                                                        weight: comp.weight,
                                                      }}
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
                );
              })}
            </CollapsibleTreeNode>
          </TreeBranch>
        </CollapsibleTreeNode>
      </div>
    </div>
  );
};
