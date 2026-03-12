import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, CheckCircle2, Info, Download, Loader2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const areaCodeTable = [
  { code: "SITE", label: "Site Infrastructure", subAreas: "INFRA" },
  { code: "UTL", label: "Utilities & Power", subAreas: "COMP, ELEC, REAG, WTR" },
  { code: "COM", label: "Comminution / Process", subAreas: "FEED, GRIND, CLASS" },
  { code: "GR", label: "Gold Recovery", subAreas: "CIP, ELUT, GOLD, GRAV, REGEN" },
  { code: "TAIL", label: "Tailings", subAreas: "FILT, THK" },
  { code: "SUP", label: "Support Services", subAreas: "MOBILE" },
];

const subAreaCodeTable = [
  { area: "COM", code: "FEED", meaning: "Feed / Reclaim", example: "TCMG-PP-COM-FEED-RCFD01" },
  { area: "COM", code: "GRIND", meaning: "Grinding", example: "TCMG-PP-COM-GRIND-BM01" },
  { area: "COM", code: "CLASS", meaning: "Classification", example: "TCMG-PP-COM-CLASS-CYC01" },
  { area: "GR", code: "CIP", meaning: "CIP / Leaching", example: "TCMG-PP-GR-CIP-LCH01" },
  { area: "GR", code: "ELUT", meaning: "Elution", example: "TCMG-PP-GR-ELUT-ELU01" },
  { area: "GR", code: "GOLD", meaning: "Gold Room", example: "TCMG-PP-GR-GOLD-EW01" },
  { area: "GR", code: "GRAV", meaning: "Gravity Circuit", example: "TCMG-PP-GR-GRAV-KNL01" },
  { area: "GR", code: "REGEN", meaning: "Carbon Regeneration", example: "TCMG-PP-GR-REGEN-KLN01" },
  { area: "TAIL", code: "FILT", meaning: "Filtering", example: "TCMG-PP-TAIL-FILT-FP01" },
  { area: "TAIL", code: "THK", meaning: "Thickening", example: "TCMG-PP-TAIL-THK-THK01" },
  { area: "UTL", code: "COMP", meaning: "Compressed Air", example: "TCMG-PP-UTL-COMP-COMP01" },
  { area: "UTL", code: "ELEC", meaning: "Electrical / Controls", example: "TCMG-PP-UTL-ELEC-GEN01" },
  { area: "UTL", code: "REAG", meaning: "Reagents", example: "TCMG-PP-UTL-REAG-LIME01" },
  { area: "UTL", code: "WTR", meaning: "Water", example: "TCMG-PP-UTL-WTR-RO01" },
  { area: "SITE", code: "INFRA", meaning: "Site Infrastructure", example: "TCMG-PP-SITE-INFRA-BLDG01" },
  { area: "SUP", code: "MOBILE", meaning: "Mobile Equipment", example: "TCMG-PP-SUP-MOBILE-MOB01" },
];

const flExamples = [
  { fl: "TCMG-PP-COM-GRIND-BM01", system: "BM01 Primary Ball Mill", children: "BM01-MTR01, BM01-GBX01, BM01-BRG01" },
  { fl: "TCMG-PP-COM-CLASS-CYC01", system: "CYC01 Primary Cyclones", children: "CYC01-PMP01, CYC01-FDR01" },
  { fl: "TCMG-PP-GR-CIP-LCH01", system: "LCH01 Leach Tanks", children: "LCH01-AGT01, LCH01-PMP01" },
  { fl: "TCMG-PP-GR-GRAV-KNL01", system: "KNL01 Knelson Concentrator", children: "KNL01-PMP01, KNL01-PNL01" },
  { fl: "TCMG-PP-TAIL-THK-THK01", system: "THK01 Tails Thickener", children: "THK01-DRV01, THK01-PMP01" },
  { fl: "TCMG-PP-UTL-ELEC-GEN01", system: "GEN01 Generation", children: "PGEN01, PGEN02, PGEN03" },
];

export const AssetNumberingSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const { uploadAndShowPdf } = await import("@/utils/pdfDownloadHelper");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 8;
      const CONTENT_W = A4_W - MARGIN * 2;
      const CONTENT_H = A4_H - MARGIN * 2;
      const GAP = 2;

      const sections = Array.from(
        contentRef.current.querySelectorAll<HTMLElement>("[data-pdf-section]")
      );

      let currentY = MARGIN;

      const addCanvasAcrossPages = (canvas: HTMLCanvasElement) => {
        const pxPerMm = canvas.width / CONTENT_W;
        const SLICE_OVERLAP_PX = 20;
        let sourceY = 0;

        while (sourceY < canvas.height) {
          const remainingMm = A4_H - MARGIN - currentY;
          if (remainingMm <= 0.5) {
            pdf.addPage();
            currentY = MARGIN;
            continue;
          }

          const sliceHeightPx = Math.min(
            canvas.height - sourceY,
            Math.floor(remainingMm * pxPerMm)
          );

          if (sliceHeightPx <= 0) {
            pdf.addPage();
            currentY = MARGIN;
            continue;
          }

          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeightPx;

          const ctx = sliceCanvas.getContext("2d");
          if (!ctx) break;

          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sliceHeightPx,
            0,
            0,
            canvas.width,
            sliceHeightPx
          );

          const sliceHeightMm = sliceHeightPx / pxPerMm;
          pdf.addImage(
            sliceCanvas.toDataURL("image/png"),
            "PNG",
            MARGIN,
            currentY,
            CONTENT_W,
            sliceHeightMm
          );

          const reachedEnd = sourceY + sliceHeightPx >= canvas.height;
          sourceY = reachedEnd
            ? canvas.height
            : Math.max(0, sourceY + sliceHeightPx - SLICE_OVERLAP_PX);
          currentY += sliceHeightMm;

          if (!reachedEnd) {
            pdf.addPage();
            currentY = MARGIN;
          }
        }
      };

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const canvas = await html2canvas(section, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: Math.max(860, document.documentElement.clientWidth),
          windowHeight: Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          ),
          scrollX: 0,
          scrollY: -window.scrollY,
        });

        const sectionHeightMm = canvas.height / (canvas.width / CONTENT_W);
        const remainingMm = A4_H - MARGIN - currentY;

        // Keep normal sections together if they can fit on one clean page.
        if (
          sectionHeightMm <= CONTENT_H &&
          sectionHeightMm > remainingMm &&
          currentY > MARGIN + 0.5
        ) {
          pdf.addPage();
          currentY = MARGIN;
        }

        addCanvasAcrossPages(canvas);

        if (i < sections.length - 1) {
          currentY += GAP;
          if (currentY > A4_H - MARGIN) {
            pdf.addPage();
            currentY = MARGIN;
          }
        }
      }

      const blob = pdf.output("blob");
      await uploadAndShowPdf(blob, "TCMG-STD-FL-001_Functional_Location_Codes.pdf");
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
              <CardTitle className="text-xl">Functional Location Codes</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                TCMG-STD-FL-001 Rev 2.0 - Tennant Creek Gold Mine
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
        {/* FL Format */}
        <div data-pdf-section className="space-y-4">
          <h4 className="font-semibold text-foreground text-base">FL Code Format</h4>
          <code className="text-lg font-mono font-bold text-primary block">
            TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]
          </code>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><span className="font-mono font-bold text-foreground">TCMG</span> - Tennant Creek Gold Mine</p>
            <p><span className="font-mono font-bold text-foreground">PP</span> - Processing Plant</p>
            <p><span className="font-mono font-bold text-foreground">AREA</span> - Major plant area (6 approved codes)</p>
            <p><span className="font-mono font-bold text-foreground">SUBAREA</span> - Functional sub-area within the area</p>
            <p><span className="font-mono font-bold text-foreground">SYSTEM</span> - Parent Asset / System (lowest FL level)</p>
          </div>
        </div>

        {/* Purpose */}
        <div data-pdf-section className="space-y-2">
          <h4 className="font-semibold text-foreground text-base flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            Purpose
          </h4>
          <p className="text-sm text-muted-foreground">
            FL codes define where assets physically and functionally exist within the plant. They answer: <strong>"Where in the plant does this equipment belong?"</strong> Used for asset hierarchy, maintenance planning, work history, PM alignment, and D365 integration.
          </p>
        </div>

        {/* Hierarchy Diagram */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">Functional Location Hierarchy</h4>
          <div className="font-mono text-sm space-y-0.5">
            <p className="font-bold text-foreground">TCMG</p>
            <p className="text-muted-foreground ml-4">└── PP (Processing Plant)</p>
            <p className="text-muted-foreground ml-8">└── COM (Comminution / Process)</p>
            <p className="text-muted-foreground ml-12">└── GRIND (Grinding)</p>
            <p className="text-primary font-bold ml-16">└── BM01 (Primary Ball Mill) ← FL stops here</p>
            <p className="text-muted-foreground ml-20">└── BM01-MTR01 (inherits parent FL)</p>
            <p className="text-muted-foreground ml-24">└── Bearings, seals (inherit parent FL)</p>
          </div>
        </div>

        <Separator />

        {/* Area Codes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">1. Area Codes (6 Approved)</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-20 font-semibold">Code</TableHead>
                <TableHead className="w-48 font-semibold">Area</TableHead>
                <TableHead className="font-semibold">Sub-Area Codes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaCodeTable.map((a) => (
                <TableRow key={a.code}>
                  <TableCell className="font-mono font-bold text-primary">{a.code}</TableCell>
                  <TableCell className="font-medium text-sm">{a.label}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{a.subAreas}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Sub-Area Codes */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">2. Sub-Area Codes & Live Examples</h4>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16 font-semibold">Area</TableHead>
                <TableHead className="w-20 font-semibold">Code</TableHead>
                <TableHead className="w-44 font-semibold">Sub-Area</TableHead>
                <TableHead className="font-semibold">Example FL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subAreaCodeTable.map((s) => (
                <TableRow key={s.code}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.area}</TableCell>
                  <TableCell className="font-mono font-bold text-primary">{s.code}</TableCell>
                  <TableCell className="text-sm">{s.meaning}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Rules & Constraints */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">3. Rules & Constraints</h4>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">FLs Stop at System Level</strong> - Assets and components do NOT receive their own FL codes</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">Inheritance Model</strong> - Assets & components inherit the FL of their parent system</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">No Levels Skipped</strong> - Hierarchy must be followed exactly - no shortcuts</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">Immutable Once Assigned</strong> - FL codes are never renamed, reused, or changed</span>
            </li>
          </ul>
        </div>

        {/* Inheritance Examples */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">4. Inheritance - Live Examples</h4>
          <p className="text-sm text-muted-foreground">
            Assets and components do NOT receive new FL codes. They inherit the FL code of their parent System.
          </p>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Functional Location</TableHead>
                <TableHead className="font-semibold">System</TableHead>
                <TableHead className="font-semibold">Inheriting Assets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flExamples.map((ex) => (
                <TableRow key={ex.fl}>
                  <TableCell className="font-mono text-sm font-medium text-primary">{ex.fl}</TableCell>
                  <TableCell className="text-sm">{ex.system}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{ex.children}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Immutability Rules */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">5. Immutability Rules</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• FL codes are <strong>never renamed</strong></li>
            <li>• FL codes are <strong>never reused</strong></li>
            <li>• Equipment changes do <strong>not</strong> trigger FL changes</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            If equipment is replaced: the FL stays the same, only asset/component records are updated. This preserves maintenance history, failure data, and long-term reporting integrity.
          </p>
        </div>

        {/* When New FLs Can Be Created */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">6. When New FLs Can Be Created</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="font-medium text-sm text-foreground">Allowed:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• A new system boundary is introduced</li>
                <li>• A new process line or major modification is installed</li>
                <li>• Approved changes to P&IDs define a new system</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium text-sm text-foreground">Not Allowed:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Component replacement</li>
                <li>• Equipment upgrades</li>
                <li>• Temporary equipment</li>
                <li>• Maintenance workarounds</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Governance */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">7. Governance & Control</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• Functional Location creation follows this standard</li>
            <li>• All new FLs must align to the approved hierarchy</li>
            <li>• Temporary or unknown systems are flagged and reviewed</li>
            <li>• FL Standards take precedence over asset naming preferences, OEM terminology, and historical site naming habits</li>
          </ul>
        </div>

        {/* Relationship */}
        <div data-pdf-section className="space-y-3">
          <h4 className="font-semibold text-foreground text-base">8. Relationship to Asset & Parts Numbering</h4>
          <div className="text-sm text-muted-foreground space-y-1.5">
            <p><strong className="text-foreground">FL Codes</strong> define WHERE an asset sits in the plant</p>
            <p><strong className="text-foreground">Asset Numbers</strong> define WHAT the equipment is</p>
            <p><strong className="text-foreground">Parts Numbers</strong> define what is STOCKED in stores</p>
          </div>
          <p className="font-mono text-sm text-muted-foreground mt-2">
            FL → Asset → Component → Part (all three systems are independent but linked)
          </p>
        </div>

        {/* Footer */}
        <div data-pdf-section className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          TCMG-STD-FL-001 Rev 2.0 - All FL codes are database-governed and aligned to the live Processing Plant Asset Tree
        </div>
      </CardContent>
    </Card>
  );
};