import { areasData } from "@/components/hierarchy/assetData";
import { pidTagMappings } from "@/components/hierarchy/pidTagMappings";

const buildPidTagLookup = () => {
  const lookup = new Map<string, string[]>();
  pidTagMappings.forEach((mapping) => {
    const existing = lookup.get(mapping.assetNumber) || [];
    existing.push(mapping.pidTag);
    lookup.set(mapping.assetNumber, existing);
  });
  return lookup;
};

const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export function exportAssetTreeCSV() {
  const pidTagsByAsset = buildPidTagLookup();

  const getAllPidTags = (assetNumber: string, inlineTags?: string[]) => {
    const mapped = pidTagsByAsset.get(assetNumber) || [];
    const inline = inlineTags || [];
    return [...new Set([...inline, ...mapped])];
  };

  const headers = [
    "Site", "Facility", "Area Code", "Area", "Sub-Area",
    "Parent Asset", "Asset Number", "Equipment Name",
    "Component Code", "Component Type", "Component Name",
    "Manufacturer", "P&ID Tags",
  ];

  const rows: string[][] = [];

  areasData.forEach((area) => {
    area.subAreas.forEach((subArea) => {
      subArea.parentAssets.forEach((parent) => {
        parent.equipment.forEach((equip) => {
          const pidTags = getAllPidTags(equip.assetNumber, equip.pidTags);
          rows.push([
            "TCMG", "Processing Plant", area.code, area.label,
            subArea.label, parent.label, equip.assetNumber, equip.name,
            "", "", "", "", pidTags.join("; "),
          ]);
          equip.components?.forEach((comp) => {
            rows.push([
              "TCMG", "Processing Plant", area.code, area.label,
              subArea.label, parent.label, equip.assetNumber, equip.name,
              comp.componentCode, comp.componentType, comp.componentName,
              comp.manufacturer, "",
            ]);
          });
        });
      });
    });
  });

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "TCMG_Asset_Tree_Register.csv";
  link.click();
  URL.revokeObjectURL(url);
}
