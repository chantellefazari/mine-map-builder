import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { AreaType, Component } from "./assetData";
import { crushingPlantAreas } from "./crushingPlantData";
import { Loader2 } from "lucide-react";
import { FLPathSegment } from "./FLBreadcrumbContext";
import { RevBTreeBranch } from "./RevBTreeBranch";

interface AssetTreeProps {
  searchQuery?: string;
}

export const AssetTree: React.FC<AssetTreeProps> = ({ searchQuery = "" }) => {
  const hasSearch = searchQuery.trim().length > 0;

  // CRU search helper
  const cruMatchesSearch = (text: string) => {
    if (!hasSearch) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

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
                                        const equipNodeLabel = `${equip.assetNumber} — ${equip.name}`;
                                        const equipSegment: FLPathSegment = { level: "equipment", label: equipNodeLabel };
                                        const pathAfterEquip = [...pathAfterPA, equipSegment];

                                        return (
                                          <TreeBranch key={equipIndex} isLast={equipIndex === parent.equipment.length - 1}>
                                            <CollapsibleTreeNode
                                              id={`cru-eq-${cruArea.areaCode}-${paIndex}-${equipIndex}`}
                                              label={equipNodeLabel}
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
                                                    label={comp.componentCode ? `${comp.componentCode} — ${comp.componentName}` : comp.componentName}
                                                    level="component"
                                                    hasChildren={false}
                                                    isHighlighted={cruMatchesSearch(comp.componentCode) || cruMatchesSearch(comp.componentName) || cruMatchesSearch(comp.manufacturer)}
                                                    depth={5}
                                                    ancestorPath={pathAfterEquip}
                                                    componentSpecs={(() => {
                                                       const rawModel = comp.model || comp.manufacturer || undefined;
                                                       const modelIsJustName = rawModel && comp.componentName && rawModel.toLowerCase().trim() === comp.componentName.toLowerCase().trim();
                                                       const s = {
                                                         model: modelIsJustName ? undefined : rawModel,
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
                                                      };
                                                      return Object.values(s).some(v => v) ? s : undefined;
                                                    })()}
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
              
              {/* Processing Plant – Rev B (now the sole active tree) */}
              <RevBTreeBranch searchQuery={searchQuery} pathAfterSite={pathAfterSite} />
            </CollapsibleTreeNode>
          );
        })()}
      </div>
    </div>
  );
};
