import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const suggestedCrusherPrefixes = [
  { prefix: "CRS", meaning: "Crusher (Jaw / Cone)", example: "CRS01, CRS02, CRS03", notes: "CRS01 Primary Jaw, CRS02 Secondary Cone, CRS03 Tertiary Cone" },
  { prefix: "RBIN", meaning: "ROM Bin", example: "RBIN01", notes: "Steel structure with Hardox liners" },
  { prefix: "RFDR", meaning: "Primary Vibrating Feeder", example: "RFDR01", notes: "Hydraulic drive feeder under ROM bin" },
  { prefix: "MAG", meaning: "Overband Magnet", example: "MAG01", notes: "Self-cleaning overband on CRS01 discharge" },
  { prefix: "GFB", meaning: "Ground Feed Bin", example: "GFB01", notes: "CV01 discharge into screen feed system" },
  { prefix: "CFB", meaning: "Cone Feed Bin", example: "CFB01", notes: "Dual chamber bin feeding CRS02 & CRS03" },
  { prefix: "SCN", meaning: "Vibrating Screen", example: "SCN01", notes: "Horizontal vibrating screen (3-deck)" },
  { prefix: "CV", meaning: "Conveyor", example: "CV01–CV15", notes: "Shared prefix with Processing Plant — different numbering range" },
  { prefix: "MDE", meaning: "Metal Detector", example: "CV07-MDE01", notes: "Component suffix on cone feed conveyors" },
  { prefix: "DST", meaning: "Dust Suppression", example: "DST01", notes: "Spray bars and enclosures" },
  { prefix: "LVL", meaning: "Level Sensor", example: "RBIN01-LVL01", notes: "Vega level sensors on bins" },
];

const reservedPrefixes = equipmentPrefixes.map((e) => e.prefix);

export const NamingConventionDocument = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const { exportSectionsToPdf } = await import("@/utils/sectionPdfExport");
      await exportSectionsToPdf(
        contentRef.current,
        "TCMG-STD-NAM-001_Site_Naming_Convention.pdf"
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
                TCMG-STD-NAM-001 Rev 1.0 — Tennant Creek Gold Mine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="gap-2" disabled={downloading}>
              {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Defined & Stable
            </Badge>
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
            <p><span className="font-mono font-bold text-foreground">Example:</span> BM001-MTR001 = Ball Mill 001 – Motor 001</p>
          </div>
        </div>

        <Separator />

        {/* 1. Area Codes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">1. Area Codes (Level 3 of Hierarchy)</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Every asset sits under one of these six main areas. The crusher facility will need its own area code — or share an existing one.
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
          <h4 className="font-semibold text-foreground text-base">2. Equipment Type Prefixes — Reserved</h4>
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
            Suggested prefixes for the new Crushing Plant to maintain site-wide consistency and avoid collisions with existing Processing Plant prefixes. Starting points for discussion — final codes to be agreed.
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
          <h4 className="font-semibold text-foreground text-base">7. Example — Crusher Asset Numbering in Practice</h4>
          <p className="text-xs text-muted-foreground mb-2">
            Below shows how the naming convention applies to the current Crushing Plant layout. Component suffixes follow the same site standard as the Processing Plant.
          </p>

          <div className="font-mono text-xs space-y-3">
            <div>
              <p className="font-bold text-foreground mb-1">ROM & Primary Feed</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">RBIN01</span> — ROM Bin</p>
                <p className="pl-4"><span className="text-primary">RBIN01-LVL01</span> — Vega Level Sensor</p>
                <p className="pl-4"><span className="text-primary">RBIN01-STR01</span> — Bin Structure</p>
                <p><span className="text-primary font-semibold">RFDR01</span> — Primary Vibrating Feeder</p>
                <p className="pl-4"><span className="text-primary">RFDR01-MTR01</span> — Feeder Motor</p>
                <p className="pl-4"><span className="text-primary">RFDR01-HYD01</span> — Hydraulic Motor Drive</p>
                <p className="pl-4"><span className="text-primary">RFDR01-VSD01</span> — Variable Speed Drive</p>
                <p className="pl-4"><span className="text-primary">RFDR01-EXC01</span> — Exciter Unit A</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Primary Crushing</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CRS01</span> — Primary Jaw Crusher</p>
                <p className="pl-4"><span className="text-primary">CRS01-MTR01</span> — Crusher Motor 160kW</p>
                <p className="pl-4"><span className="text-primary">CRS01-GBX01</span> — Gearbox / Drive Assembly</p>
                <p className="pl-4"><span className="text-primary">CRS01-JKS01</span> — Jackshaft Assembly</p>
                <p className="pl-4"><span className="text-primary">CRS01-LUB01</span> — Lubrication System</p>
                <p className="pl-4"><span className="text-primary">CRS01-HOP01</span> — Feed Hopper</p>
                <p><span className="text-primary font-semibold">MAG01</span> — Overband Magnet</p>
                <p className="pl-4"><span className="text-primary">MAG01-MTR01</span> — Magnet Drive Motor</p>
                <p className="pl-4"><span className="text-primary">MAG01-BLT01</span> — Self-Cleaning Belt</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Conveying</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CV01</span> — Forward Conveyor</p>
                <p className="pl-4"><span className="text-primary">CV01-MTR01</span> — Head Drive Motor A</p>
                <p className="pl-4"><span className="text-primary">CV01-GBX01</span> — Gearbox</p>
                <p className="pl-4"><span className="text-primary">CV01-LNY01</span> — Lanyard Safety Switches</p>
                <p className="pl-4"><span className="text-primary">CV01-SPD01</span> — Underspeed Sensor</p>
                <p><span className="text-primary font-semibold">CV04</span> — Screen Feed Conveyor</p>
                <p><span className="text-primary font-semibold">CV07</span> — Secondary Cone Feed Conveyor</p>
                <p className="pl-4"><span className="text-primary">CV07-MDE01</span> — Metal Detector</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Screening</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">SCN01</span> — Vibrating Screen (3-Deck)</p>
                <p className="pl-4"><span className="text-primary">SCN01-MTR01</span> — Screen Drive Motor 45kW</p>
                <p className="pl-4"><span className="text-primary">SCN01-GBX01</span> — Exciter / Gearbox</p>
                <p className="pl-4"><span className="text-primary">SCN01-DK01</span> — Top Deck</p>
                <p className="pl-4"><span className="text-primary">SCN01-DK02</span> — Second Deck</p>
                <p className="pl-4"><span className="text-primary">SCN01-DK03</span> — Bottom Deck (Fines)</p>
                <p className="pl-4"><span className="text-primary">SCN01-SPR01</span> — Isolation Springs</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Secondary & Tertiary Crushing</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CFB01</span> — Cone Feed Bin (Dual Chamber)</p>
                <p className="pl-4"><span className="text-primary">CFB01-FDR01</span> — Vibrating Feeder A → CRS02</p>
                <p className="pl-4"><span className="text-primary">CFB01-FDR02</span> — Vibrating Feeder B → CRS03</p>
                <p><span className="text-primary font-semibold">CRS02</span> — Secondary Cone Crusher</p>
                <p className="pl-4"><span className="text-primary">CRS02-MTR01</span> — Crusher Motor 220kW</p>
                <p className="pl-4"><span className="text-primary">CRS02-LUB01</span> — Lubrication System</p>
                <p><span className="text-primary font-semibold">CRS03</span> — Tertiary Cone Crusher</p>
                <p className="pl-4"><span className="text-primary">CRS03-MTR01</span> — Crusher Motor 220kW</p>
                <p className="pl-4"><span className="text-primary">CRS03-HYD01</span> — Hydraulic Tramp Release</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div data-pdf-section className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          TCMG-STD-NAM-001 Rev 1.0 — Asset naming standards aligned to the live Processing Plant Asset Tree
        </div>
      </CardContent>
    </Card>
  );
};
