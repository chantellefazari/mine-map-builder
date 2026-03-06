import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { AreaType } from "./assetData";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";
import { Loader2 } from "lucide-react";

/** Short 2–3 letter codes for Level 4 sub-areas */
const SUB_AREA_CODES: Record<string, string> = {
  "Buildings": "BLD",
  "Power Generation": "PWR",
  "Electrical / Controls": "ELC",
  "Compressed Air": "AIR",
  "Water": "WTR",
  "Reagents": "RGT",
  "Feed / Reclaim": "FDR",
  "Grinding": "GRD",
  "Classification": "CLS",
  "Gravity Circuit": "GRV",
  "CIP": "CIP",
  "Elution": "ELU",
  "Carbon Regeneration": "CRG",
  "Gold Room": "GLD",
  "Thickening": "THK",
  "Filtering": "FLT",
  "Mobile Equipment": "MOB",
  "Light Vehicles": "LTV",
};
import { FLPathSegment } from "./FLBreadcrumbContext";

interface RevBTreeBranchProps {
  searchQuery?: string;
  pathAfterSite: FLPathSegment[];
}

export const RevBTreeBranch: React.FC<RevBTreeBranchProps> = ({ searchQuery = "", pathAfterSite }) => {
  const { data: revBAreasData, isLoading } = useRevBPlantAssets();
  const areas = revBAreasData || [];
  const hasSearch = searchQuery.trim().length > 0;

  const matchesSearch = (text: string) => {
    if (!hasSearch) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const ppSegment: FLPathSegment = { level: "plant", label: "Processing Plant (Rev B)" };
  const pathAfterPP = [...pathAfterSite, ppSegment];

  if (isLoading) {
    return (
      <TreeBranch horizontal>
        <CollapsibleTreeNode label="Processing Plant (Rev B)" level="plant" hasChildren={false} depth={1} ancestorPath={pathAfterSite}>
          <div className="flex items-center gap-2 py-4 pl-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Loading Rev B…</span>
          </div>
        </CollapsibleTreeNode>
      </TreeBranch>
    );
  }

  return (
    <TreeBranch horizontal>
      <CollapsibleTreeNode label="Processing Plant (Rev B)" level="plant" hasChildren defaultExpanded={false} depth={1} ancestorPath={pathAfterSite}>
        {areas.map((area, areaIndex) => {
          const areaSegment: FLPathSegment = { level: "area", label: area.label, code: area.code, areaType: area.code };
          const pathAfterArea = [...pathAfterPP, areaSegment];

          return (
            <TreeBranch key={area.code} isLast={areaIndex === areas.length - 1}>
              <CollapsibleTreeNode
                id={`revb-area-${area.code}`}
                code={area.code}
                label={area.label}
                level="area"
                areaType={area.code as AreaType}
                hasChildren={area.subAreas.length > 0}
                isHighlighted={matchesSearch(area.label) || matchesSearch(area.code)}
                depth={2}
                ancestorPath={pathAfterPP}
              >
                {area.subAreas.map((subArea, subIndex) => {
                  const subAreaSegment: FLPathSegment = { level: "subarea", label: subArea.label };
                  const pathAfterSubArea = [...pathAfterArea, subAreaSegment];

                  return (
                    <TreeBranch key={subIndex} isLast={subIndex === area.subAreas.length - 1}>
                      <CollapsibleTreeNode
                        id={`revb-subarea-${area.code}-${subIndex}`}
                        code={SUB_AREA_CODES[subArea.label]}
                        label={subArea.label}
                        level="subarea"
                        hasChildren={subArea.parentAssets.length > 0}
                        isHighlighted={matchesSearch(subArea.label)}
                        depth={3}
                        ancestorPath={pathAfterArea}
                      >
                        {subArea.parentAssets.map((parentAsset, paIndex) => {
                          const paSegment: FLPathSegment = { level: "parentAsset", label: parentAsset.label };
                          const pathAfterPA = [...pathAfterSubArea, paSegment];

                          return (
                            <TreeBranch key={paIndex} isLast={paIndex === subArea.parentAssets.length - 1}>
                              <CollapsibleTreeNode
                                id={`revb-parent-${area.code}-${subIndex}-${paIndex}`}
                                label={parentAsset.label}
                                level="parentAsset"
                                hasChildren={parentAsset.equipment.length > 0}
                                isHighlighted={matchesSearch(parentAsset.label)}
                                depth={4}
                                ancestorPath={pathAfterSubArea}
                                storedFL={parentAsset.functionalLocation}
                              >
                                {parentAsset.equipment.map((equip, equipIndex) => {
                                  const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                  const hasComponents = equip.components && equip.components.length > 0;
                                  const equipSegment: FLPathSegment = { level: "equipment", label: equipLabel };
                                  const pathAfterEquip = [...pathAfterPA, equipSegment];

                                  return (
                                    <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
                                      <CollapsibleTreeNode
                                        id={`revb-equip-${area.code}-${subIndex}-${paIndex}-${equipIndex}`}
                                        label={equipLabel}
                                        level="equipment"
                                        hasChildren={hasComponents}
                                        isHighlighted={matchesSearch(equip.assetNumber) || matchesSearch(equip.name)}
                                        pidTags={equip.pidTags}
                                        depth={5}
                                        ancestorPath={pathAfterPA}
                                        storedFL={equip.functionalLocation || parentAsset.functionalLocation}
                                      >
                                        {hasComponents && equip.components!.map((comp, compIndex) => {
                                          const compLabel = `${comp.componentCode} — ${comp.componentName}`;

                                          return (
                                            <TreeBranch key={compIndex} isLast={compIndex === equip.components!.length - 1}>
                                              <CollapsibleTreeNode
                                                id={`revb-comp-${area.code}-${subIndex}-${paIndex}-${equipIndex}-${compIndex}`}
                                                code={comp.componentType}
                                                label={compLabel}
                                                level="component"
                                                hasChildren={false}
                                                isHighlighted={matchesSearch(comp.componentCode) || matchesSearch(comp.componentName)}
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
};
