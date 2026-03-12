import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash, CheckCircle2, Info, AlertTriangle, Lock, ArrowRight, Download, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

      // Expand all accordions for capture
      const accordionEl = contentRef.current;
      const triggers = accordionEl.querySelectorAll<HTMLButtonElement>('[data-state="closed"] > button, button[data-state="closed"]');
      triggers.forEach((t) => t.click());
      await new Promise((r) => setTimeout(r, 400));

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      const margin = 8;
      const contentW = pageW - margin * 2;

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 900,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgW = contentW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const sliceH = pageH - margin * 2;
      let yOffset = 0;
      let page = 0;

      while (yOffset < imgH) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, margin - yOffset, imgW, imgH);
        yOffset += sliceH;
        page++;
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
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">FL Code Format</h4>
          <div className="inline-block bg-background border border-border rounded-lg px-4 py-3">
            <code className="text-lg font-mono font-bold text-primary">TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]</code>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            {[
              { code: "TCMG", meaning: "Tennant Creek Gold Mine" },
              { code: "PP", meaning: "Processing Plant" },
              { code: "AREA", meaning: "Major plant area" },
              { code: "SUBAREA", meaning: "Functional sub-area" },
              { code: "SYSTEM", meaning: "Parent Asset / System" },
            ].map((item) => (
              <div key={item.code} className="bg-background border border-border rounded-md p-2 text-center">
                <div className="font-mono font-bold text-primary">{item.code}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.meaning}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-2">Purpose</h4>
              <p className="text-sm text-muted-foreground mb-3">
                FL codes define where assets physically and functionally exist within the plant. They answer: <strong>"Where in the plant does this equipment belong?"</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {["Asset hierarchy", "Maintenance planning", "Work history", "PM alignment", "D365 integration"].map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchy Diagram */}
        <div className="bg-muted/30 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Functional Location Hierarchy</h4>
          <div className="font-mono text-sm bg-background border border-border rounded-lg p-4 overflow-x-auto">
            <div className="text-foreground font-bold">TCMG</div>
            <div className="text-muted-foreground ml-4">└── PP (Processing Plant)</div>
            <div className="text-muted-foreground ml-8">└── COM (Comminution / Process)</div>
            <div className="text-muted-foreground ml-12">└── GRIND (Grinding)</div>
            <div className="text-primary font-bold ml-16">└── BM01 (Primary Ball Mill) ← FL stops here</div>
            <div className="text-muted-foreground/60 ml-20">└── BM01-MTR01 (inherits parent FL)</div>
            <div className="text-muted-foreground/40 ml-24">└── Bearings, seals (inherit parent FL)</div>
          </div>
        </div>

        <Separator />

        {/* Section 1: Area Codes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 1</Badge>
            <h4 className="font-medium text-foreground">Area Codes (6 Approved)</h4>
          </div>
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

        {/* Section 2: Sub-Area Codes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 2</Badge>
            <h4 className="font-medium text-foreground">Sub-Area Codes & Live Examples</h4>
          </div>
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

        {/* Section 3: Key Rules */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 3</Badge>
            <h4 className="font-medium text-foreground">Rules & Constraints</h4>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "FLs Stop at System Level", desc: "Assets and components do NOT receive their own FL codes", icon: Lock },
              { rule: "Inheritance Model", desc: "Assets & components inherit the FL of their parent system", icon: ArrowRight },
              { rule: "No Levels Skipped", desc: "Hierarchy must be followed exactly - no shortcuts", icon: CheckCircle2 },
              { rule: "Immutable Once Assigned", desc: "FL codes are never renamed, reused, or changed", icon: Lock },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
                <item.icon className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.rule}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Inheritance Example */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 4</Badge>
            <h4 className="font-medium text-foreground">Inheritance - Live Examples</h4>
          </div>
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

        {/* Detailed Sections Accordion */}
        <Accordion type="multiple" className="w-full space-y-2">
          {/* Immutability */}
          <AccordionItem value="immutability" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Immutability Rules
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-sm">FL codes are immutable once assigned</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• FL codes are <strong>never renamed</strong></li>
                  <li>• FL codes are <strong>never reused</strong></li>
                  <li>• Equipment changes do <strong>not</strong> trigger FL changes</li>
                </ul>
              </div>
              <p className="text-sm text-muted-foreground">
                If equipment is replaced: the FL stays the same, only asset/component records are updated. This preserves maintenance history, failure data, and long-term reporting integrity.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* When New FL Can Be Created */}
          <AccordionItem value="new-fl" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              When New FLs Can Be Created
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Allowed
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• A new system boundary is introduced</li>
                    <li>• A new process line or major modification is installed</li>
                    <li>• Approved changes to P&IDs define a new system</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Not Allowed
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Component replacement</li>
                    <li>• Equipment upgrades</li>
                    <li>• Temporary equipment</li>
                    <li>• Maintenance workarounds</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Governance */}
          <AccordionItem value="governance" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Governance & Control
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Functional Location creation follows this standard</li>
                <li>• All new FLs must align to the approved hierarchy</li>
                <li>• Temporary or unknown systems are flagged and reviewed</li>
              </ul>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  <strong>FL Standards take precedence over:</strong> Asset naming preferences, OEM terminology, Historical site naming habits
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Relationship to Other Systems */}
          <AccordionItem value="relationship" className="border border-border rounded-lg px-4">
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              Relationship to Asset & Parts Numbering
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                  <div className="font-medium text-sm text-primary">FL Codes</div>
                  <div className="text-xs text-muted-foreground mt-1">Define <strong>WHERE</strong></div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <div className="font-medium text-sm text-blue-600">Asset Numbers</div>
                  <div className="text-xs text-muted-foreground mt-1">Define <strong>WHAT</strong></div>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="font-medium text-sm text-green-600">Parts Numbers</div>
                  <div className="text-xs text-muted-foreground mt-1">Define <strong>STOCKED</strong></div>
                </div>
              </div>
              <div className="font-mono text-sm text-center text-muted-foreground">
                FL → Asset → Component → Part
              </div>
              <p className="text-xs text-muted-foreground text-center">
                All three systems are independent but linked
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Footer */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
          TCMG-STD-FL-001 Rev 2.0 - All FL codes are database-governed and aligned to the live Processing Plant Asset Tree
        </div>
      </CardContent>
    </Card>
  );
};