import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { useAssetSearch } from "@/hooks/useAssetSearch";
import { AreaType, Component } from "./assetData";
import { crushingPlantAreas } from "./crushingPlantData";
import { useProcessingPlantAssets, useProcessingPidTags } from "@/hooks/useProcessingPlantAssets";
import { Loader2 } from "lucide-react";
import { FLPathSegment } from "./FLBreadcrumbContext";
import { RevBTreeBranch } from "./RevBTreeBranch";

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
        {(() => {
          const sitePath: FLPathSegment[] = [];
          const siteSegment: FLPathSegment = { level: "site", label: "TCMG" };
          const pathAfterSite = [...sitePath, siteSegment];

          return (
            <CollapsibleTreeNode label="TCMG" level="site" hasChildren defaultExpanded centered depth={0} ancestorPath={sitePath}>
              {/* Mining (placeholder) */}
              <TreeBranch horizontal>
                <CollapsibleTreeNode label="Mining" level="plant" hasChildren={false} depth={1} ancestorPath={pathAfterSite} />
              </TreeBranch>
              
              {/* Crushing Plant */}
              {(() => {
                const cruPlantSegment: FLPathSegment = { level: "plant", label: "Crushing Plant", areaType: "CRU" };
                const pathAfterCruPlant = [...pathAfterSite, cruPlantSegment];

                return (
                  <TreeBranch horizontal>
                    <CollapsibleTreeNode label="Crushing Plant" level="plant" hasChildren defaultExpanded areaType="CRU" depth={1} ancestorPath={pathAfterSite}>
                      {crushingPlantAreas.map((cruArea, cruAreaIndex) => {
                        const cruAreaCode = cruArea.areaCode.replace("CRU-", "");
                        const cruAreaSegment: FLPathSegment = { level: "area", label: cruArea.label, code: cruAreaCode, areaType: "CRU" };
                        const pathAfterCruArea = [...pathAfterCruPlant, cruAreaSegment];

                        return (
                          <TreeBranch key={cruArea.areaCode} isLast={cruAreaIndex === crushingPlantAreas.length - 1}>
                            <CollapsibleTreeNode
                              id={`cru-area-${cruArea.areaCode}`}
                              code={cruAreaCode}
                              label={cruArea.label}
                              level="area"
                              areaType="CRU"
                              hasChildren={cruArea.parentAssets.length > 0}
                              isHighlighted={cruMatchesSearch(cruArea.label) || cruMatchesSearch(cruArea.areaCode)}
                              depth={2}
                              ancestorPath={pathAfterCruPlant}
                            >
                              {cruArea.parentAssets.map((parent, paIndex) => {
                                const paSegment: FLPathSegment = { level: "parentAsset", label: parent.label };
                                const pathAfterPA = [...pathAfterCruArea, paSegment];

                                return (
                                  <TreeBranch key={paIndex} isLast={paIndex === cruArea.parentAssets.length - 1}>
                                    <CollapsibleTreeNode
                                      id={`cru-pa-${cruArea.areaCode}-${paIndex}`}
                                      label={parent.label}
                                      level="parentAsset"
                                      hasChildren={parent.equipment.length > 0}
                                      isHighlighted={cruMatchesSearch(parent.label)}
                                      depth={3}
                                      ancestorPath={pathAfterCruArea}
                                    >
                                      {parent.equipment.map((equip, equipIndex) => {
                                        const hasComponents = equip.components && equip.components.length > 0;
                                        const equipSegment: FLPathSegment = { level: "equipment", label: `${equip.assetNumber} — ${equip.name}` };
                                        const pathAfterEquip = [...pathAfterPA, equipSegment];

                                        return (
                                          <TreeBranch key={equipIndex} isLast={equipIndex === parent.equipment.length - 1}>
                                            <CollapsibleTreeNode
                                              id={`cru-eq-${cruArea.areaCode}-${paIndex}-${equipIndex}`}
                                              label={`${equip.assetNumber} — ${equip.name}`}
                                              level="equipment"
                                              hasChildren={hasComponents}
                                              isHighlighted={cruMatchesSearch(equip.assetNumber) || cruMatchesSearch(equip.name)}
                                              depth={4}
                                              ancestorPath={pathAfterPA}
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
                                                    ancestorPath={pathAfterEquip}
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
                                );
                              })}
                            </CollapsibleTreeNode>
                          </TreeBranch>
                        );
                      })}
                    </CollapsibleTreeNode>
                  </TreeBranch>
                );
              })()}
              
              {/* Processing Plant – DB-driven */}
              {(() => {
                const ppSegment: FLPathSegment = { level: "plant", label: "Processing Plant" };
                const pathAfterPP = [...pathAfterSite, ppSegment];

                return (
                  <TreeBranch horizontal>
                    <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren defaultExpanded depth={1} ancestorPath={pathAfterSite}>
                      {areas.map((area, areaIndex) => {
                        const areaSearchPath = [area.code];
                        const areaExpanded = shouldExpandForSearch(areaSearchPath);
                        const areaSegment: FLPathSegment = { level: "area", label: area.label, code: area.code, areaType: area.code };
                        const pathAfterArea = [...pathAfterPP, areaSegment];
                        
                        return (
                          <TreeBranch key={area.code} isLast={areaIndex === areas.length - 1}>
                            <CollapsibleTreeNode
                              id={`area-${area.code}`}
                              code={area.code}
                              label={area.label}
                              level="area"
                              areaType={area.code as AreaType}
                              hasChildren={area.subAreas.length > 0}
                              defaultExpanded={areaExpanded}
                              forceExpanded={areaExpanded}
                              isHighlighted={matchesSearch(area.label) || matchesSearch(area.code)}
                              depth={2}
                              ancestorPath={pathAfterPP}
                            >
                              {area.subAreas.map((subArea, subIndex) => {
                                const subAreaSearchPath = [...areaSearchPath, subArea.label];
                                const subAreaExpanded = shouldExpandForSearch(subAreaSearchPath);
                                const subAreaSegment: FLPathSegment = { level: "subarea", label: subArea.label };
                                const pathAfterSubArea = [...pathAfterArea, subAreaSegment];
                                
                                return (
                                  <TreeBranch key={subIndex} isLast={subIndex === area.subAreas.length - 1}>
                                    <CollapsibleTreeNode
                                      id={`subarea-${area.code}-${subIndex}`}
                                      label={subArea.label}
                                      level="subarea"
                                      hasChildren={subArea.parentAssets.length > 0}
                                      defaultExpanded={subAreaExpanded}
                                      forceExpanded={subAreaExpanded}
                                      isHighlighted={matchesSearch(subArea.label)}
                                      depth={3}
                                      ancestorPath={pathAfterArea}
                                    >
                                      {subArea.parentAssets.map((parentAsset, paIndex) => {
                                        const parentAssetSearchPath = [...subAreaSearchPath, parentAsset.label];
                                        const parentAssetExpanded = shouldExpandForSearch(parentAssetSearchPath);
                                        const paSegment: FLPathSegment = { level: "parentAsset", label: parentAsset.label };
                                        const pathAfterPA = [...pathAfterSubArea, paSegment];
                                        
                                        return (
                                          <TreeBranch key={paIndex} isLast={paIndex === subArea.parentAssets.length - 1}>
                                            <CollapsibleTreeNode
                                              id={`parent-${area.code}-${subIndex}-${paIndex}`}
                                              label={parentAsset.label}
                                              level="parentAsset"
                                              hasChildren={parentAsset.equipment.length > 0}
                                              defaultExpanded={parentAssetExpanded}
                                              forceExpanded={parentAssetExpanded}
                                              isHighlighted={matchesSearch(parentAsset.label)}
                                              depth={4}
                                              ancestorPath={pathAfterSubArea}
                                              storedFL={parentAsset.functionalLocation}
                                            >
                                              {parentAsset.equipment.map((equip, equipIndex) => {
                                                const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                                const allPidTags = getAllPidTags(equip.assetNumber, equip.pidTags);
                                                const isPidMatch = pidTagMatchesSearch(equip.assetNumber, equip.pidTags);
                                                const hasComponents = equip.components && equip.components.length > 0;
                                                const equipSegment: FLPathSegment = { level: "equipment", label: equipLabel };
                                                const pathAfterEquip = [...pathAfterPA, equipSegment];
                                                
                                                return (
                                                  <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
                                                    <CollapsibleTreeNode
                                                      id={`equip-${area.code}-${subIndex}-${paIndex}-${equipIndex}`}
                                                      label={equipLabel}
                                                      level="equipment"
                                                      hasChildren={hasComponents}
                                                      isHighlighted={matchesSearch(equip.assetNumber) || matchesSearch(equip.name) || isPidMatch}
                                                      pidTags={allPidTags}
                                                      depth={5}
                                                      ancestorPath={pathAfterPA}
                                                      storedFL={equip.functionalLocation || parentAsset.functionalLocation}
                                                    >
                                                      {hasComponents && equip.components!.map((comp, compIndex) => {
                                                        const compLabel = `${comp.componentCode} — ${comp.componentName}`;
                                                        
                                                        return (
                                                          <TreeBranch key={compIndex} isLast={compIndex === equip.components!.length - 1}>
                                                            <CollapsibleTreeNode
                                                              id={`comp-${area.code}-${subIndex}-${paIndex}-${equipIndex}-${compIndex}`}
                                                              code={comp.componentType}
                                                              label={compLabel}
                                                              level="component"
                                                              hasChildren={false}
                                                              isHighlighted={matchesSearch(comp.componentCode) || matchesSearch(comp.componentName) || matchesSearch(comp.manufacturer)}
                                                              depth={6}
                                                              ancestorPath={pathAfterEquip}
                                                              storedFL={equip.functionalLocation || parentAsset.functionalLocation}
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
                );
              })()}

              {/* Processing Plant (Rev B) – DB-driven from rev_b table */}
              <RevBTreeBranch searchQuery={searchQuery} pathAfterSite={pathAfterSite} />
            </CollapsibleTreeNode>
          );
        })()}
      </div>
    </div>
  );
};
