import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Download, Loader2, CheckCircle2, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";
import { useRevBPlantAssets } from "@/hooks/useProcessingPlantAssets";

interface LiveAssetRow {
  area: string;
  id: string;
  desc: string;
  level: "System" | "Comp";
}

const chunkRows = <T,>(rows: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    chunks.push(rows.slice(i, i + chunkSize));
  }
  return chunks;
};

export const NamingConventionDocument = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const { data: liveAreas = [] } = useRevBPlantAssets();

  const liveRows = useMemo<LiveAssetRow[]>(() => {
    const rows: LiveAssetRow[] = [];

    for (const area of liveAreas) {
      for (const subArea of area.subAreas) {
        for (const parentAsset of subArea.parentAssets) {
          for (const equipment of parentAsset.equipment) {
            if (equipment.assetNumber) {
              rows.push({
                area: area.code,
                id: equipment.assetNumber,
                desc: equipment.name || parentAsset.label,
                level: "System",
              });
            }

            for (const component of equipment.components || []) {
              if (!component.componentCode) continue;
              rows.push({
                area: "",
                id: component.componentCode,
                desc: component.componentName || component.componentType || "Component",
                level: "Comp",
              });
            }
          }
        }
      }
    }

    const seen = new Set<string>();
    return rows.filter((row) => {
      const key = `${row.level}:${row.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [liveAreas]);

  const liveSystemChunks = useMemo(
    () => chunkRows(liveRows.filter((row) => row.level === "System"), 22),
    [liveRows]
  );

  const liveComponentChunks = useMemo(
    () => chunkRows(liveRows.filter((row) => row.level === "Comp"), 26),
    [liveRows]
  );

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const { exportSectionsToPdf } = await import("@/utils/sectionPdfExport");
      await exportSectionsToPdf(
        contentRef.current,
        "TCMG-STD-NAM-001_Site_Naming_Convention.pdf",
        {
          margin: 8,
          renderWidth: 820,
          fontSize: "12px",
          lineHeight: "1.35",
          sliceOverlapPx: 16,
        }
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Site Asset Naming Convention</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                TCMG-STD-NAM-001 Rev 1.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="gap-2" disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <span className="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
              <CheckCircle2 className="w-3 h-3" />
              Defined and Stable
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6" ref={contentRef}>

        {/* Purpose & Format */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">Purpose</h4>
          <p className="text-sm text-muted-foreground">
            This document outlines the complete asset numbering logic used across the Tennant Creek Mining Group (TCMG) Processing Plant.
            It is designed to be shared with contractors and OEM suppliers to ensure consistent naming, avoid prefix collisions,
            and maintain a unified site standard across all facilities.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><span className="font-mono font-bold text-foreground">Format:</span> [PREFIX][NUMBER]-[SUFFIX][NUMBER]</p>
            <p><span className="font-mono font-bold text-foreground">Example:</span> BM001-MTR001 = Ball Mill 001, Motor 001</p>
          </div>
        </div>

        <Separator />

        {/* 1. Area Codes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">1. Area Codes (Level 3 of Hierarchy)</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Every asset sits under one of these six main areas. The crusher facility will need its own area code or share an existing one.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold">Code</TableHead>
                <TableHead className="w-44 font-semibold">Meaning</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaCodes.map((a) => (
                <TableRow key={a.code}>
                  <TableCell className="font-mono font-bold text-primary">{a.code}</TableCell>
                  <TableCell className="font-medium text-sm">{a.meaning}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{a.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 2. Equipment Prefixes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">2. Equipment Type Prefixes (Reserved)</h4>
          <p className="text-xs text-muted-foreground mb-2">
            These prefixes are <strong>reserved</strong> across the Processing Plant. Crusher assets must not duplicate these unless the same equipment type is genuinely being used.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold">Prefix</TableHead>
                <TableHead className="w-48 font-semibold">Equipment Type</TableHead>
                <TableHead className="font-semibold">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentPrefixes.map((e) => (
                <TableRow key={e.prefix}>
                  <TableCell className="font-mono font-bold text-primary">{e.prefix}</TableCell>
                  <TableCell className="font-medium text-sm">{e.meaning}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 3. Component Suffixes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">3. Component Suffixes (After Hyphen)</h4>
          <p className="text-xs text-muted-foreground mb-2">
            When a child component sits under a parent asset, it uses these standardised suffixes. These should be adopted identically in the crusher.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold">Suffix</TableHead>
                <TableHead className="w-48 font-semibold">Component Type</TableHead>
                <TableHead className="font-semibold">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentSuffixes.map((c) => (
                <TableRow key={c.suffix}>
                  <TableCell className="font-mono font-bold text-primary">{c.suffix}</TableCell>
                  <TableCell className="font-medium text-sm">{c.meaning}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{c.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 4. Instrumentation Suffixes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">4. Instrumentation Suffixes</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold">Suffix</TableHead>
                <TableHead className="w-48 font-semibold">Instrument Type</TableHead>
                <TableHead className="font-semibold">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instrumentationSuffixes.map((i) => (
                <TableRow key={i.suffix}>
                  <TableCell className="font-mono font-bold text-primary">{i.suffix}</TableCell>
                  <TableCell className="font-medium text-sm">{i.meaning}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{i.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 5. Special Patterns */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">5. Special Naming Patterns</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-28 font-semibold">Pattern</TableHead>
                <TableHead className="w-56 font-semibold">Meaning</TableHead>
                <TableHead className="font-semibold">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialPatterns.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-bold text-primary">{p.pattern}</TableCell>
                  <TableCell className="font-medium text-sm">{p.meaning}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* 6. Suggested Crusher Prefixes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">6. Suggested Crusher Asset Prefixes</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Suggested prefixes for the new Crushing Plant to maintain site-wide consistency and avoid collisions with existing Processing Plant prefixes. Starting points for discussion, final codes to be agreed.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 font-semibold">Prefix</TableHead>
                <TableHead className="w-40 font-semibold">Equipment Type</TableHead>
                <TableHead className="w-28 font-semibold">Example</TableHead>
                <TableHead className="font-semibold">Notes</TableHead>
                <TableHead className="w-16 font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestedCrusherPrefixes.map((c) => {
                const hasConflict = reservedPrefixes.includes(c.prefix);
                return (
                  <TableRow key={c.prefix}>
                    <TableCell className="font-mono font-bold text-primary">{c.prefix}</TableCell>
                    <TableCell className="font-medium text-sm">{c.meaning}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{c.example}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.notes}</TableCell>
                    <TableCell className="text-xs font-medium">
                      {hasConflict ? (
                        <span className="text-amber-600">Shared</span>
                      ) : (
                        <span className="text-emerald-600">New</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* 7. Example Crusher Asset Tree */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">7. Crusher Asset Numbering Examples</h4>
          <p className="text-xs text-muted-foreground mb-2">
            How the naming convention applies to the Crushing Plant layout. Component suffixes follow the same site standard as the Processing Plant.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold">Area</TableHead>
                <TableHead className="w-32 font-semibold">Asset ID</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="w-20 font-semibold">Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { area: "ROM Feed", id: "RBIN01", desc: "ROM Bin", level: "System" },
                { area: "", id: "RBIN01-LVL01", desc: "Vega Level Sensor", level: "Comp" },
                { area: "", id: "RBIN01-STR01", desc: "Bin Structure", level: "Comp" },
                { area: "", id: "RFDR01", desc: "Primary Vibrating Feeder", level: "System" },
                { area: "", id: "RFDR01-MTR01", desc: "Feeder Motor", level: "Comp" },
                { area: "", id: "RFDR01-HYD01", desc: "Hydraulic Motor Drive", level: "Comp" },
                { area: "", id: "RFDR01-VSD01", desc: "Variable Speed Drive", level: "Comp" },
                { area: "", id: "RFDR01-EXC01", desc: "Exciter Unit A", level: "Comp" },
                { area: "Primary", id: "CRS01", desc: "Primary Jaw Crusher", level: "System" },
                { area: "", id: "CRS01-MTR01", desc: "Crusher Motor 160kW", level: "Comp" },
                { area: "", id: "CRS01-GBX01", desc: "Gearbox / Drive Assembly", level: "Comp" },
                { area: "", id: "CRS01-JKS01", desc: "Jackshaft Assembly", level: "Comp" },
                { area: "", id: "CRS01-LUB01", desc: "Lubrication System", level: "Comp" },
                { area: "", id: "CRS01-HOP01", desc: "Feed Hopper", level: "Comp" },
                { area: "", id: "MAG01", desc: "Overband Magnet", level: "System" },
                { area: "", id: "MAG01-MTR01", desc: "Magnet Drive Motor", level: "Comp" },
                { area: "", id: "MAG01-BLT01", desc: "Self-Cleaning Belt", level: "Comp" },
                { area: "Conveying", id: "CV01", desc: "Forward Conveyor", level: "System" },
                { area: "", id: "CV01-MTR01", desc: "Head Drive Motor A", level: "Comp" },
                { area: "", id: "CV01-GBX01", desc: "Gearbox", level: "Comp" },
                { area: "", id: "CV01-LNY01", desc: "Lanyard Safety Switches", level: "Comp" },
                { area: "", id: "CV01-SPD01", desc: "Underspeed Sensor", level: "Comp" },
                { area: "", id: "CV04", desc: "Screen Feed Conveyor", level: "System" },
                { area: "", id: "CV07", desc: "Secondary Cone Feed Conveyor", level: "System" },
                { area: "", id: "CV07-MDE01", desc: "Metal Detector", level: "Comp" },
                { area: "Screening", id: "SCN01", desc: "Vibrating Screen (3-Deck)", level: "System" },
                { area: "", id: "SCN01-MTR01", desc: "Screen Drive Motor 45kW", level: "Comp" },
                { area: "", id: "SCN01-GBX01", desc: "Exciter / Gearbox", level: "Comp" },
                { area: "", id: "SCN01-DK01", desc: "Top Deck", level: "Comp" },
                { area: "", id: "SCN01-DK02", desc: "Second Deck", level: "Comp" },
                { area: "", id: "SCN01-DK03", desc: "Bottom Deck (Fines)", level: "Comp" },
                { area: "", id: "SCN01-SPR01", desc: "Isolation Springs", level: "Comp" },
                { area: "Secondary", id: "CFB01", desc: "Cone Feed Bin (Dual Chamber)", level: "System" },
                { area: "", id: "CFB01-FDR01", desc: "Vibrating Feeder A to CRS02", level: "Comp" },
                { area: "", id: "CFB01-FDR02", desc: "Vibrating Feeder B to CRS03", level: "Comp" },
                { area: "", id: "CRS02", desc: "Secondary Cone Crusher", level: "System" },
                { area: "", id: "CRS02-MTR01", desc: "Crusher Motor 220kW", level: "Comp" },
                { area: "", id: "CRS02-LUB01", desc: "Lubrication System", level: "Comp" },
                { area: "", id: "CRS03", desc: "Tertiary Cone Crusher", level: "System" },
                { area: "", id: "CRS03-MTR01", desc: "Crusher Motor 220kW", level: "Comp" },
                { area: "", id: "CRS03-HYD01", desc: "Hydraulic Tramp Release", level: "Comp" },
              ].map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-xs font-medium text-foreground">{row.area}</TableCell>
                  <TableCell className={`font-mono text-xs ${row.level === "System" ? "font-bold text-primary" : "text-primary pl-4"}`}>{row.id}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.desc}</TableCell>
                  <TableCell className={`text-[10px] ${row.level === "System" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{row.level}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div data-pdf-section className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          TCMG-STD-NAM-001 Rev 1.0 | Asset naming standards aligned to the live Processing Plant Asset Tree
        </div>
      </CardContent>
    </Card>
  );
};
