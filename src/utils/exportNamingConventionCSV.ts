import { 
  areaCodes, 
  equipmentPrefixes, 
  componentSuffixes, 
  instrumentationSuffixes, 
  specialPatterns 
} from "@/components/hierarchy/namingConventionData";

export { areaCodes, equipmentPrefixes, componentSuffixes, instrumentationSuffixes, specialPatterns };

const escapeCSV = (value: string): string => {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export function exportNamingConventionCSV() {
  const rows: string[][] = [];

  // Section: Area Codes
  rows.push(["=== Area Codes (Level 3) ==="]);
  rows.push(["Code", "Meaning", "Description"]);
  areaCodes.forEach(a => rows.push([a.code, a.meaning, a.description]));
  rows.push([]);

  // Section: Equipment Prefixes
  rows.push(["=== Equipment Type Prefixes ==="]);
  rows.push(["Prefix", "Meaning", "Example", "Category"]);
  equipmentPrefixes.forEach(e => rows.push([e.prefix, e.meaning, e.example, e.category]));
  rows.push([]);

  // Section: Component Suffixes
  rows.push(["=== Component Suffixes ==="]);
  rows.push(["Suffix", "Meaning", "Example", "Category"]);
  componentSuffixes.forEach(c => rows.push([c.suffix, c.meaning, c.example, c.category]));
  rows.push([]);

  // Section: Instrumentation Suffixes
  rows.push(["=== Instrumentation Suffixes ==="]);
  rows.push(["Suffix", "Meaning", "Example", "Category"]);
  instrumentationSuffixes.forEach(i => rows.push([i.suffix, i.meaning, i.example, i.category]));
  rows.push([]);

  // Section: Special Naming Patterns
  rows.push(["=== Special Naming Patterns ==="]);
  rows.push(["Pattern", "Meaning", "Example"]);
  specialPatterns.forEach(p => rows.push([p.pattern, p.meaning, p.example]));

  const csvContent = rows.map(row => row.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "TCMG_Naming_Convention.csv";
  link.click();
  URL.revokeObjectURL(url);
}
