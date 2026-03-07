import React from "react";
import { CollapsibleTreeNode } from "./CollapsibleTreeNode";
import { TreeBranch } from "./TreeBranch";
import { AreaType } from "./assetData";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";
import { Loader2 } from "lucide-react";

/** Level 5 System codes — derived from the common equipment prefix under each parent asset header */
const SYSTEM_CODES: Record<string, string> = {
  // SITE
  "BLDG01 Site Buildings": "BLDG01",
  // UTL – Power Generation
  "GEN01 Generators": "GEN01",
  // PSTA01 removed — all generators sit under GEN01
  // UTL – Electrical / Controls
  "CR01 Control Room": "CR01",
  "FMCC01 Field MCCs": "FMCC01",
  "LTW01 Lighting Towers": "LTW01",
  "MDB01 Main Distribution Board": "MDB01",
  "MSUB01 Main Sub Station": "MSUB01",
  "SDB01 Sub Distribution Board": "SDB01",
  // UTL – Compressed Air
  "COMP01 Compressed Air System": "COMP01",
  // UTL – Water
  "RW01 Raw Water": "RW01",
  "PW01 Potable Water": "PW01",
  "GW01 Gland Water": "GW01",
  "PCW01 Process Water": "PCW01",
  // UTL – Reagents
  "CN01 Cyanide System": "CN01",
  "CS01 Caustic & Acid Dosing": "CS01",
  "DSL01 Diesel System": "DSL01",
  "LIME01 Lime System": "LIME01",
  "FLOC01 Flocculant & Clarometer": "FLOC01",
  "RA01 Reagents Ancillary": "RA01",
  // COM – Feed / Reclaim
  "RCFD01 Reclaim Hopper & Feeder": "RCFD01",
  "TRCV01 Transfer Conveyor": "TRCV01",
  "MFCV01 Mill Feed Conveyor": "MFCV01",
  // COM – Grinding
  "BM01 Primary Ball Mill": "BM01",
  "MLUB01 Mill Lubrication System": "MLUB01",
  "CFP01 Cyclone Feed Pumps": "CFP01",
  "MLANC01 Milling Ancillary": "MLANC01",
  // COM – Classification
  "CYC01 Primary Cyclones": "CYC01",
  "CLANC01 Classification Ancillary": "CLANC01",
  // REC – Gravity Circuit
  "GSCN01 Gravity Screen": "GSCN01",
  "KNL01 Knelson Concentrator": "KNL01",
  "STBL01 Shaking Table & Tails": "STBL01",
  "GRV01 Gravity Ancillary": "GRV01",
  // REC – CIP
  "TSCN01 Trash Screen": "TSCN01",
  "LCH01 Leach Tanks": "LCH01",
  "CIP01 CIP Tanks & Agitators": "CIP01",
  "CT01 Carbon Transfer": "CT01",
  "LCANC01 Leaching Ancillary": "LCANC01",
  "ADS01 Adsorption Ancillary": "ADS01",
  // REC – Elution
  "AW01 Acid Wash": "AW01",
  "ELU01 Elution Column & Heating": "ELU01",
  "ELANC01 Elution Ancillary": "ELANC01",
  // REC – Carbon Regen
  "CREG01 Carbon Regen System": "CREG01",
  "KLN01 Regeneration Kiln": "KLN01",
  // REC – Gold Room
  "EW01 Electrowinning": "EW01",
  "GR01 Gold Room": "GR01",
  // TAIL – Thickening
  "THK01 Tails Thickener": "THK01",
  "THYD01 Thickener Hydraulic System": "THYD01",
  "TUFP01 Thickener Underflow Pumps": "TUFP01",
  "THANC01 Thickener Ancillary": "THANC01",
  "TFLO01 Flocculant System": "TFLO01",
  // TAIL – Filtering
  "FP01 Filter Press 1": "FP01",
  "FP02 Filter Press 2": "FP02",
  "FPCV01 Filter Press Conveyors": "FPCV01",
  "FPAR01 Filter Press Compressed Air": "FPAR01",
  "FPAN01 Filter Press Ancillary": "FPAN01",
  "HMGN01 Slurry Homogenisers": "HMGN01",
  // SUP
  "MOB01 Mobile Equipment Fleet": "MOB01",
  "LTV01 Light Vehicle Fleet": "LTV01",
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
  const normalizeTag = (t: string) => t.toLowerCase().replace(/^0+(?=\d)/, "");

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
    const componentNorm = normalizeMeaning(`${componentName || ""} ${componentType || ""}`);
    if (!equipmentNorm || !componentNorm) return false;

    const equipmentGearLike = /\bgearbox\b/.test(equipmentNorm) || (equipmentNorm.includes("gear") && equipmentNorm.includes("reduc"));
    const componentGearLike = /\bgearbox\b/.test(componentNorm) || (componentNorm.includes("gear") && componentNorm.includes("reduc"));
    if (equipmentGearLike && componentGearLike) return true;

    return equipmentNorm === componentNorm || equipmentNorm.includes(componentNorm) || componentNorm.includes(equipmentNorm);
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
            const nameMatch = equip.assetNumber.toLowerCase().includes(q) || equip.name.toLowerCase().includes(q);
            const pidMatch = equip.pidTags?.some(tag => tag.toLowerCase().includes(q) || normalizeTag(tag).includes(nq));
            if (nameMatch || pidMatch) {
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

  const hasRevBMatches = expandedPaths.size > 0;

  return (
    <TreeBranch horizontal>
      <CollapsibleTreeNode label="Processing Plant (Rev B)" level="plant" hasChildren defaultExpanded={hasRevBMatches} forceExpanded={hasRevBMatches} depth={1} ancestorPath={pathAfterSite}>
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
                                code={SYSTEM_CODES[parentAsset.label]}
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
                                  const equipLabel = `${equip.assetNumber} — ${equip.name}`;
                                  const comps = equip.components || [];
                                  const equivalentComponents = comps.filter((comp) =>
                                    isEquivalentComponent(equip.name, comp.componentName, comp.componentType) ||
                                    isGearboxAliasComponent(equip.assetNumber, comp.componentName, comp.componentType)
                                  );
                                  const childComponents = comps.filter((comp) =>
                                    !(isEquivalentComponent(equip.name, comp.componentName, comp.componentType) ||
                                      isGearboxAliasComponent(equip.assetNumber, comp.componentName, comp.componentType))
                                  );
                                  const hasChildComponents = childComponents.length > 0;
                                  const equipSegment: FLPathSegment = { level: "equipment", label: equipLabel };
                                  const pathAfterEquip = [...pathAfterPA, equipSegment];
                                  const isPidMatch = pidMatchesSearch(equip.pidTags);

                                  const inlineSpec = equivalentComponents[0];
                                  const equipSpecs = inlineSpec
                                    ? {
                                        model: inlineSpec.model || inlineSpec.manufacturer,
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

                                  return (
                                    <TreeBranch key={equipIndex} isLast={equipIndex === parentAsset.equipment.length - 1}>
                                      <CollapsibleTreeNode
                                        id={`revb-equip-${area.code}-${subIndex}-${paIndex}-${equipIndex}`}
                                        label={equipLabel}
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
                                          const compLabel = `${comp.componentCode} — ${comp.componentName}`;

                                          return (
                                            <TreeBranch key={compIndex} isLast={compIndex === comps.length - 1}>
                                              <CollapsibleTreeNode
                                                id={`revb-comp-${area.code}-${subIndex}-${paIndex}-${equipIndex}-${compIndex}`}
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
