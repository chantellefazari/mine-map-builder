import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { AreaType, Component } from "./assetData";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";
import { Loader2 } from "lucide-react";

import { FLPathSegment } from "./FLBreadcrumbContext";

// Sub-Area code mapping for FL path segments (Level 4)
const subAreaCodeMap: Record<string, string> = {
  // SITE
  "Site Infrastructure": "INFRA",
  // UTL
  "Compressed Air": "COMP",
  "Electrical / Controls": "ELEC",
  "Power Generation": "PWR",
  "Reagents (Lime)": "REAG",
  "Water": "WTR",
  "Hydraulic Systems": "HYD",
  "Fuel Systems": "FUEL",
  // COM
  "Feed / Reclaim": "FEED",
  "Conveying": "CONV",
  "Grinding": "GRIND",
  "Classification": "CLASS",
  // REC
  "Gravity Circuit": "GRAV",
  "CIP": "CIP",
  "Elution": "ELUT",
  "Carbon Regeneration": "REGEN",
  "Gold Room": "GOLD",
  // TAIL
  "Thickening": "THK",
  "Filtering": "FILT",
  // SUP
  "Workshop": "WKSHP",
  "Lab": "LAB",
  "Mobile Equipment": "MOBILE",
  "Light Vehicles": "LV",
  "Heavy Vehicles (HV)": "HV",
};

function getSubAreaCode(label: string): string | undefined {
  return subAreaCodeMap[label];
}

/**
 * Deduplicate Level 7 components: when two entries share the same componentName
 * and one has model === componentName (redundant) while another has a real model,
 * merge them — keeping the real model/part number and absorbing any unique specs.
 */
function deduplicateComponents(comps: Component[]): Component[] {
  if (comps.length <= 1) return comps;

  const norm = (s?: string) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();

  const groups = new Map<string, Component[]>();
  for (const comp of comps) {
    const key = norm(comp.componentName);
    if (!key) { groups.set(`__anon_${groups.size}`, [comp]); continue; }
    const arr = groups.get(key) || [];
    arr.push(comp);
    groups.set(key, arr);
  }

  const result: Component[] = [];
  for (const [key, group] of groups) {
    if (group.length === 1) { result.push(group[0]); continue; }

    const isRedundantModel = (c: Component) =>
      !c.model || norm(c.model) === key;

    const withRealModel = group.filter((c) => !isRedundantModel(c));
    const withRedundant = group.filter((c) => isRedundantModel(c));

    if (withRealModel.length > 0 && withRedundant.length > 0) {
      // Merge unique specs from redundant entries into real entries
      for (const real of withRealModel) {
        for (const red of withRedundant) {
          if (!real.manufacturer && red.manufacturer) real.manufacturer = red.manufacturer;
          if (!real.serialNumber && red.serialNumber) real.serialNumber = red.serialNumber;
          if (!real.oilType && red.oilType) real.oilType = red.oilType;
          if (!real.oilVolume && red.oilVolume) real.oilVolume = red.oilVolume;
          if (!real.motorSpeed && red.motorSpeed) real.motorSpeed = red.motorSpeed;
          if (!real.voltage && red.voltage) real.voltage = red.voltage;
          if (!real.weight && red.weight) real.weight = red.weight;
          if (!real.pumpFlow && red.pumpFlow) real.pumpFlow = red.pumpFlow;
          if (!real.motorRef && red.motorRef) real.motorRef = red.motorRef;
          if (!real.pumpRef && red.pumpRef) real.pumpRef = red.pumpRef;
        }
        result.push(real);
      }
    } else {
      // All entries are same kind — keep unique ones by normalized specs
      const seen = new Set<string>();
      for (const comp of group) {
        const uk = `${norm(comp.manufacturer)}_${norm(comp.serialNumber)}_${norm(comp.model)}`;
        if (!seen.has(uk)) { seen.add(uk); result.push(comp); }
      }
    }
  }
  return result;
}

interface RevBTreeBranchProps {
  searchQuery?: string;
  pathAfterSite: FLPathSegment[];
}

export const RevBTreeBranch: React.FC<RevBTreeBranchProps> = ({ searchQuery = "", pathAfterSite }) => {
  const { data: revBAreasData, isLoading } = useRevBPlantAssets();
  const areas = revBAreasData || [];
  const hasSearch = searchQuery.trim().length > 0;
  const normalizeTag = (t: string) => t.toLowerCase().replace(/\b0+(\d)/g, "$1");

  const matchesSearch = (text: string) => {
    if (!hasSearch) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const pidMatchesSearch = (pidTags?: string[]) => {
    if (!hasSearch || !pidTags) return false;
    const q = searchQuery.toLowerCase();
    const nq = normalizeTag(q);
    return pidTags.some(tag => tag.toLowerCase().includes(q) || normalizeTag(tag).includes(nq));
  };


  const normalizeMeaning = (text?: string) => (text || "")
    .toLowerCase()
    .replace(/main/g, "")
    .replace(/primary\s+ball\s+mill/g, "")
    .replace(/mill/g, "")
    .replace(/\b(gear\s*reducer|gear\s*box|gearbox)\b/g, "gearbox")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const isEquivalentComponent = (equipmentName: string, componentName?: string, componentType?: string) => {
    const equipmentNorm = normalizeMeaning(equipmentName);
    const componentNorm = normalizeMeaning(`${componentName || ""}`);
    if (!equipmentNorm || !componentNorm) return false;

    // Safety: if componentType was set to the equipment name (bad import), never suppress
    const typeNorm = normalizeMeaning(`${componentType || ""}`);
    if (typeNorm && typeNorm === equipmentNorm && componentNorm !== equipmentNorm) return false;

    // Only match if the component name is essentially identical to equipment name
    // (e.g., "Main Gear Reducer" ≈ "Gearbox"), NOT if it's a sub-component like "Motor" or "Gearbox" of a parent
    const equipmentGearLike = /\bgearbox\b/.test(equipmentNorm) || (equipmentNorm.includes("gear") && equipmentNorm.includes("reduc"));
    const componentGearLike = /\bgearbox\b/.test(componentNorm) || (componentNorm.includes("gear") && componentNorm.includes("reduc"));
    if (equipmentGearLike && componentGearLike) return true;

    // Strict equality only — don't suppress components that merely contain the parent name
    return equipmentNorm === componentNorm;
  };

  const isGearboxAliasComponent = (equipmentAssetNumber: string, componentName?: string, componentType?: string) => {
    const isGearboxEquipment = /-(gb|gbx)\d*$/i.test(equipmentAssetNumber);
    if (!isGearboxEquipment) return false;
    const text = `${componentName || ""} ${componentType || ""}`.toLowerCase();
    return /gear\s*reducer|gear\s*box|gearbox/.test(text);
  };

  const expandedPaths = React.useMemo(() => {
    const paths = new Set<string>();
    if (!hasSearch) return paths;
    const q = searchQuery.toLowerCase();
    const nq = normalizeTag(q);

    areas.forEach((area) => {
      area.subAreas.forEach((subArea) => {
        subArea.parentAssets.forEach((parentAsset) => {
          parentAsset.equipment.forEach((equip) => {
            const componentMatch = (equip.components || []).some((comp) =>
              comp.componentCode.toLowerCase().includes(q) ||
              comp.componentName.toLowerCase().includes(q) ||
              pidMatchesSearch(comp.pidTags)
            );
            const nameMatch = equip.assetNumber.toLowerCase().includes(q) || equip.name.toLowerCase().includes(q);
            const pidMatch = equip.pidTags?.some(tag => tag.toLowerCase().includes(q) || normalizeTag(tag).includes(nq));
            if (nameMatch || pidMatch || componentMatch) {
              paths.add(area.code);
              paths.add(`${area.code}/${subArea.label}`);
              paths.add(`${area.code}/${subArea.label}/${parentAsset.label}`);
            }
          });
          // parent asset name match
          if (parentAsset.label.toLowerCase().includes(q)) {
            paths.add(area.code);
            paths.add(`${area.code}/${subArea.label}`);
          }
          // sub area match
          if (subArea.label.toLowerCase().includes(q)) {
            paths.add(area.code);
          }
        });
      });
    });
    return paths;
  }, [areas, searchQuery, hasSearch]);

  const ppSegment: FLPathSegment = { level: "plant", label: "Processing Plant" };
  const pathAfterPP = [...pathAfterSite, ppSegment];

  if (isLoading) {
    return (
      <TreeBranch horizontal>
        <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren={false} depth={1} ancestorPath={pathAfterSite}>
          <div className="flex items-center gap-2 py-4 pl-6">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Loading Rev B…</span>
          </div>
        </CollapsibleTreeNode>
      </TreeBranch>
    );
  }

  const hasRevBMatches = expandedPaths.size > 0;

  return (
    <TreeBranch horizontal>
      <CollapsibleTreeNode label="Processing Plant" level="plant" hasChildren defaultExpanded forceExpanded={hasRevBMatches} depth={1} ancestorPath={pathAfterSite}>
        {areas.map((area, areaIndex) => {
          const areaSegment: FLPathSegment = { level: "area", label: area.label, code: area.code, areaType: area.code };
          const pathAfterArea = [...pathAfterPP, areaSegment];
          const areaExpanded = expandedPaths.has(area.code);

          return (
            <TreeBranch key={area.code} isLast={areaIndex === areas.length - 1}>
              <CollapsibleTreeNode
                id={`revb-area-${area.code}`}
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
                  const subAreaSegment: FLPathSegment = { level: "subarea", label: subArea.label };
                  const pathAfterSubArea = [...pathAfterArea, subAreaSegment];
                  const subAreaExpanded = expandedPaths.has(`${area.code}/${subArea.label}`);

                  return (
                    <TreeBranch key={subIndex} isLast={subIndex === area.subAreas.length - 1}>
                      <CollapsibleTreeNode
                        id={`revb-subarea-${area.code}-${subIndex}`}
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
                          const paSegment: FLPathSegment = { level: "parentAsset", label: parentAsset.label };
                          const pathAfterPA = [...pathAfterSubArea, paSegment];
                          const paExpanded = expandedPaths.has(`${area.code}/${subArea.label}/${parentAsset.label}`);

                          return (
                            <TreeBranch key={paIndex} isLast={paIndex === subArea.parentAssets.length - 1}>
                              <CollapsibleTreeNode
                                id={`revb-parent-${area.code}-${subIndex}-${paIndex}`}
                                
                                label={parentAsset.label}
                                level="parentAsset"
                                hasChildren={parentAsset.equipment.length > 0}
                                defaultExpanded={paExpanded}
                                forceExpanded={paExpanded}
                                isHighlighted={matchesSearch(parentAsset.label)}
                                depth={4}
                                ancestorPath={pathAfterSubArea}
                                storedFL={parentAsset.functionalLocation}
                              >
                                {parentAsset.equipment.map((equip, equipIndex) => {
                                  const equipNodeLabel = `${equip.assetNumber} — ${equip.name}`;
                                  const equipBreadcrumbLabel = `${equip.assetNumber} — ${equip.name}`;
                                  const rawComps = equip.components || [];
                                  const comps = deduplicateComponents(rawComps);
                                  const equivalentComponents = comps.filter((comp) =>
                                    isEquivalentComponent(equip.name, comp.componentName, comp.componentType) ||
                                    isGearboxAliasComponent(equip.assetNumber, comp.componentName, comp.componentType)
                                  );
                                  const childComponents = comps.filter((comp) =>
                                    !(isEquivalentComponent(equip.name, comp.componentName, comp.componentType) ||
                                      isGearboxAliasComponent(equip.assetNumber, comp.componentName, comp.componentType))
                                  );
                                  const hasChildComponents = childComponents.length > 0;
                                  const equipSegment: FLPathSegment = { level: "equipment", label: equipBreadcrumbLabel };
                                  const pathAfterEquip = [...pathAfterPA, equipSegment];
                                  const isPidMatch = pidMatchesSearch(equip.pidTags);

                                  const inlineSpec = equivalentComponents[0];
                                  const normEquipName = (equip.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                  const normEquipLabel = (equipNodeLabel || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                  
                                  const equipModelRaw = inlineSpec?.model || undefined;
                                  const normEqModel = (equipModelRaw || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                  const equipModelRedundant = equipModelRaw && normEqModel.length > 0 && (
                                    normEqModel === normEquipName || normEquipName.includes(normEqModel) || normEqModel.includes(normEquipName) ||
                                    normEquipLabel.includes(normEqModel)
                                  );
                                  
                                  const equipMfrRaw = inlineSpec?.manufacturer || undefined;
                                  const normEqMfr = (equipMfrRaw || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                  const equipMfrRedundant = equipMfrRaw && normEqMfr.length > 0 && (
                                    normEqMfr === normEquipName || normEquipName.includes(normEqMfr) || normEqMfr.includes(normEquipName) ||
                                    normEquipLabel.includes(normEqMfr)
                                  );
                                  
                                  const equipSpecValues = inlineSpec
                                    ? {
                                        model: equipModelRedundant ? undefined : equipModelRaw,
                                        manufacturer: equipMfrRedundant ? undefined : equipMfrRaw,
                                        serialNumber: inlineSpec.serialNumber,
                                        motorRef: inlineSpec.motorRef,
                                        pumpRef: inlineSpec.pumpRef,
                                        motorSpeed: inlineSpec.motorSpeed,
                                        protection: inlineSpec.protection,
                                        voltage: inlineSpec.voltage,
                                        pumpFlow: inlineSpec.pumpFlow,
                                        operatingPressure: inlineSpec.operatingPressure,
                                        displacement: inlineSpec.displacement,
                                        oilType: inlineSpec.oilType,
                                        oilVolume: inlineSpec.oilVolume,
                                        inputSpeed: inlineSpec.inputSpeed,
                                        outputSpeed: inlineSpec.outputSpeed,
                                        weight: inlineSpec.weight,
                                      }
                                    : undefined;
                                  const equipSpecs = equipSpecValues && Object.values(equipSpecValues).some(v => v) ? equipSpecValues : undefined;

                                  return (
                                    <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
                                      <CollapsibleTreeNode
                                        id={`revb-equip-${area.code}-${subIndex}-${paIndex}-${equipIndex}`}
                                        label={equipNodeLabel}
                                        level="equipment"
                                        hasChildren={hasChildComponents}
                                        isHighlighted={matchesSearch(equip.assetNumber) || matchesSearch(equip.name) || isPidMatch}
                                        pidTags={equip.pidTags}
                                        depth={5}
                                        ancestorPath={pathAfterPA}
                                        storedFL={equip.functionalLocation || parentAsset.functionalLocation}
                                        componentSpecs={equipSpecs}
                                      >
                                        {hasChildComponents && childComponents.map((comp, compIndex) => {
                                          const compLabel = comp.componentCode ? `${comp.componentCode} — ${comp.componentName}` : comp.componentName;
                                          const isComponentPidMatch = pidMatchesSearch(comp.pidTags);
                                          
                                          // Normalize for comparison — strip non-alphanumeric, lowercase
                                          const normName = (comp.componentName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                          const normLabel = compLabel.toLowerCase().replace(/[^a-z0-9]/g, "");
                                          
                                          // Suppress model if it's just repeating the name (exact, contains, or contained-in)
                                          const rawModel = comp.model || undefined;
                                          const normModel = (rawModel || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                          const modelIsRedundant = rawModel && normModel.length > 0 && (
                                            normModel === normName || normName.includes(normModel) || normModel.includes(normName) ||
                                            normLabel.includes(normModel) || normModel === normLabel
                                          );
                                          
                                          // Suppress manufacturer if it's just repeating the name
                                          const rawMfr = comp.manufacturer || undefined;
                                          const normMfr = (rawMfr || "").toLowerCase().replace(/[^a-z0-9]/g, "");
                                          const mfrIsRedundant = rawMfr && normMfr.length > 0 && (
                                            normMfr === normName || normName.includes(normMfr) || normMfr.includes(normName) ||
                                            normLabel.includes(normMfr) || normMfr === normLabel
                                          );
                                          
                                          const compSpecValues = {
                                            model: modelIsRedundant ? undefined : rawModel,
                                            manufacturer: mfrIsRedundant ? undefined : rawMfr,
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
                                          };
                                          const hasRealSpecs = Object.values(compSpecValues).some(v => v);

                                          return (
                                            <TreeBranch key={compIndex} isLast={compIndex === childComponents.length - 1}>
                                              <CollapsibleTreeNode
                                                id={`revb-comp-${area.code}-${subIndex}-${paIndex}-${equipIndex}-${compIndex}`}
                                                label={compLabel}
                                                level="component"
                                                hasChildren={false}
                                                isHighlighted={matchesSearch(comp.componentCode) || matchesSearch(comp.componentName) || isComponentPidMatch}
                                                pidTags={comp.pidTags}
                                                depth={6}
                                                ancestorPath={pathAfterEquip}
                                                storedFL={equip.functionalLocation || parentAsset.functionalLocation}
                                                componentSpecs={hasRealSpecs ? compSpecValues : undefined}
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
