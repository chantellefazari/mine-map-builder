import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Loader2, CheckCircle2, Hash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";

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
        "TCMG-STD-NAM-001_Site_Naming_Convention.pdf",
        {
          margin: 10,
          gap: 2,
          renderWidth: 700,
          fontSize: "14px",
          lineHeight: "1.5",
          sliceOverlapPx: 14,
          addBorder: true,
        }
      );
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const crusherPrefixes = [
    { prefix: "ROM", meaning: "ROM Bin", example: "ROM01" },
    { prefix: "FDR", meaning: "Vibrating Feeder", example: "FDR01" },
    { prefix: "CRS", meaning: "Crusher (Jaw / Cone)", example: "CRS01 (Jaw), CRS02 (Sec Cone), CRS03 (Tert Cone)" },
    { prefix: "MAG", meaning: "Overband Magnet", example: "MAG01" },
    { prefix: "GFB", meaning: "Ground Feed Bin", example: "GFB01" },
    { prefix: "SCN", meaning: "Vibrating Screen", example: "SCN01" },
    { prefix: "CV", meaning: "Conveyor (shared prefix)", example: "CV01, CV02, CV04-CV15" },
    { prefix: "CFB", meaning: "Cone Feed Bin", example: "CFB01" },
    { prefix: "DUST", meaning: "Dust Suppression System", example: "DUST01" },
    { prefix: "WS", meaning: "Water Supply System", example: "WS01" },
  ];

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
      <CardContent className="space-y-5" ref={contentRef}>

        {/* Document Title */}
        <div data-pdf-section className="space-y-3 border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Site Asset Naming Convention</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-mono font-semibold">TCMG-STD-NAM-001</span>
            <span>Rev 1.0</span>
            <span>Tennant Creek Mining Group</span>
          </div>
          <h4 className="font-semibold text-foreground text-base pt-1">Purpose</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This document outlines the complete asset numbering logic used across the Tennant Creek Mining Group (TCMG) Processing Plant.
            It is designed to be shared with contractors and OEM suppliers to ensure consistent naming, avoid prefix collisions,
            and maintain a unified site standard across all facilities.
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><span className="font-mono font-bold text-foreground">Format:</span> [PREFIX][NUMBER]-[SUFFIX][NUMBER]</p>
            <p><span className="font-mono font-bold text-foreground">Example:</span> BM01-MTR01 = Ball Mill 01, Motor 01</p>
          </div>

          <h4 className="font-semibold text-foreground text-base pt-2">1. Area Codes (Level 3 of Hierarchy)</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold text-sm py-2">Code</TableHead>
                <TableHead className="w-40 font-semibold text-sm py-2">Meaning</TableHead>
                <TableHead className="font-semibold text-sm py-2">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaCodes.map((a) => (
                <TableRow key={a.code}>
                  <TableCell className="font-mono font-bold text-primary text-sm py-2">{a.code}</TableCell>
                  <TableCell className="font-medium text-sm py-2">{a.meaning}</TableCell>
                  <TableCell className="text-muted-foreground text-sm py-2">{a.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h4 className="font-semibold text-foreground text-base pt-3">2. Equipment Type Prefixes (Reserved)</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These prefixes are <strong>reserved</strong> across the Processing Plant. Crusher assets must not duplicate these unless the same equipment type is genuinely being used.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold text-sm py-2">Prefix</TableHead>
                <TableHead className="w-48 font-semibold text-sm py-2">Equipment Type</TableHead>
                <TableHead className="font-semibold text-sm py-2">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentPrefixes.map((e) => (
                <TableRow key={e.prefix}>
                  <TableCell className="font-mono font-bold text-primary text-sm py-2">{e.prefix}</TableCell>
                  <TableCell className="font-medium text-sm py-2">{e.meaning}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground py-2">{e.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Section 3: Component Suffixes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">3. Component Suffixes (After Hyphen)</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When a child component sits under a parent asset, it uses these standardised suffixes. These should be adopted identically in the crusher.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold text-sm py-2">Suffix</TableHead>
                <TableHead className="w-48 font-semibold text-sm py-2">Component Type</TableHead>
                <TableHead className="font-semibold text-sm py-2">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentSuffixes.map((c) => (
                <TableRow key={c.suffix}>
                  <TableCell className="font-mono font-bold text-primary text-sm py-2">{c.suffix}</TableCell>
                  <TableCell className="font-medium text-sm py-2">{c.meaning}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground py-2">{c.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Section 4+5: Instrumentation + Special Patterns combined */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">4. Instrumentation Suffixes</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold text-sm py-2">Suffix</TableHead>
                <TableHead className="w-48 font-semibold text-sm py-2">Instrument Type</TableHead>
                <TableHead className="font-semibold text-sm py-2">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instrumentationSuffixes.map((i) => (
                <TableRow key={i.suffix}>
                  <TableCell className="font-mono font-bold text-primary text-sm py-2">{i.suffix}</TableCell>
                  <TableCell className="font-medium text-sm py-2">{i.meaning}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground py-2">{i.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <h4 className="font-semibold text-foreground text-base pt-2">5. Special Naming Patterns</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-28 font-semibold text-sm py-2">Pattern</TableHead>
                <TableHead className="w-52 font-semibold text-sm py-2">Meaning</TableHead>
                <TableHead className="font-semibold text-sm py-2">Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specialPatterns.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-bold text-primary text-sm py-2">{p.pattern}</TableCell>
                  <TableCell className="font-medium text-sm py-2">{p.meaning}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground py-2">{p.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Section 6: Crusher Prefixes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">6. Suggested Crusher (CRU) Equipment Prefixes</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The following prefixes are <strong>suggested</strong> for Crushing Plant equipment. They have been checked against the existing Processing Plant prefixes above to avoid collisions.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold text-sm py-2">Prefix</TableHead>
                <TableHead className="w-48 font-semibold text-sm py-2">Equipment Type</TableHead>
                <TableHead className="font-semibold text-sm py-2">Suggested Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {crusherPrefixes.map((c) => (
                <TableRow key={c.prefix}>
                  <TableCell className="font-mono font-bold text-primary text-sm py-2">{c.prefix}</TableCell>
                  <TableCell className="font-medium text-sm py-2">{c.meaning}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground py-2">{c.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div data-pdf-section className="text-sm text-muted-foreground text-center pt-2 border-t border-border">
          TCMG-STD-NAM-001 Rev 1.0 | Tennant Creek Mining Group - Asset Naming Standards
        </div>
      </CardContent>
    </Card>
  );
};
