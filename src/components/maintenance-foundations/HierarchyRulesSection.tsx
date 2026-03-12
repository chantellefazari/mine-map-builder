import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

const hierarchyLevels = [
  { level: "1", name: "Site", example: "TCMG", desc: "Top-level site identifier", hasFL: "Yes" },
  { level: "2", name: "Facility", example: "Processing Plant / Crushing Plant", desc: "Major operational facility", hasFL: "Yes" },
  { level: "3", name: "Main Area", example: "SITE / UTL / COM / GR / TAIL / SUP", desc: "High-level process grouping (not an asset)", hasFL: "Yes" },
  { level: "4", name: "Sub-Area", example: "GRIND, CIP, FILT, ELEC, WTR", desc: "Logical process subdivision", hasFL: "Yes" },
  { level: "5", name: "Parent Asset (System)", example: "BM01 Ball Mill, FP01 Filter Press", desc: "Physical anchor asset. FL stops here", hasFL: "Yes" },
  { level: "6", name: "Equipment", example: "BM01-MTR01, FP01-GBX01", desc: "Maintainable equipment items", hasFL: "No" },
  { level: "7", name: "Component", example: "Bearings, seals, impellers, belts", desc: "OEM-level parts. No asset number", hasFL: "No" },
];

const parentChildRules = [
  "Every level (except Site) must have exactly one parent",
  "Equipment (L6) must always sit under a Parent Asset (L5)",
  "Components (L7) inherit the Functional Location of their parent",
  "Electrical equipment sits under the equipment it powers",
  "No orphan assets are permitted. Every asset has a traceable path to Site",
  "Duty/Standby pairs share a single Parent FL",
];

const constraints = [
  "Do NOT merge hierarchy levels",
  "Do NOT skip levels in the structure",
  "Do NOT create duplicate Parent Assets",
  "Do NOT assign asset numbers to components (L7)",
  "Do NOT change hierarchy once assigned without formal MOC",
  "Do NOT create a Functional Location below Level 5",
];

const assetNumberingExamples = [
  { number: "APRN01-CV01", desc: "Transfer Conveyor 01 (Apron Feeder system)" },
  { number: "GRND01-BM01", desc: "Ball Mill 01 (Grinding system)" },
  { number: "FILT01-FP01", desc: "Filter Press 01 (Filtering system)" },
  { number: "CIP01-AGT01", desc: "Agitator 01 (CIP/Leaching system)" },
  { number: "THK01-DRV01", desc: "Drive 01 (Thickener system)" },
];

const equipmentAbbreviations = [
  { code: "CV", meaning: "Conveyor" },
  { code: "PP", meaning: "Pump" },
  { code: "MTR", meaning: "Motor" },
  { code: "GBX", meaning: "Gearbox" },
  { code: "AGT", meaning: "Agitator" },
  { code: "FDR", meaning: "Feeder" },
  { code: "BRG", meaning: "Bearing Assembly" },
  { code: "VLV", meaning: "Valve" },
  { code: "CYC", meaning: "Cyclone" },
  { code: "CP", meaning: "Coupling" },
  { code: "SCN", meaning: "Screen" },
  { code: "DRV", meaning: "Drive" },
];

export const HierarchyRulesSection = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!contentRef.current) return;
    setDownloading(true);
    try {
      const { exportSectionsToPdf } = await import("@/utils/sectionPdfExport");
      await exportSectionsToPdf(
        contentRef.current,
        "TCMG-STD-AH-001_Asset_Hierarchy_Parent_Child_Rules.pdf",
        {
          margin: 10,
          gap: 1,
          renderWidth: 720,
          fontSize: "13px",
          lineHeight: "1.45",
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

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Asset Hierarchy & Parent-Child Rules</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Approved hierarchy structure and rules for maintenance, reporting, and future asset creation
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="gap-2 shrink-0"
          >
            {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {downloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={contentRef}>
          <div data-pdf-section className="space-y-4">
            {/* Document Header */}
            <div className="border-b-2 border-amber-600 pb-3">
              <h2 className="text-2xl font-bold text-foreground">Asset Hierarchy & Parent-Child Rules</h2>
              <p className="text-sm text-muted-foreground mt-1">
                TCMG-STD-AH-001 &nbsp; Tennant Creek Mine Gold Processing Plant
              </p>
              <div className="flex flex-wrap gap-6 mt-2 text-xs text-muted-foreground">
                <span>Revision: <strong>A</strong></span>
                <span>Effective: <strong>March 2026</strong></span>
                <span>Status: <strong>Controlled</strong></span>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <h4 className="font-semibold text-sm mb-1">Purpose</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This document defines the approved 7-level hierarchy structure and parent-child rules used at Tennant Creek Mine for all maintenance activities, CMMS data entry, reporting, and future asset creation. This standard mirrors SAP / Maximo / D365 mature site practice, separating rules from data and protecting the integrity of the asset tree.
              </p>
            </div>

            {/* Scope */}
            <div>
              <h4 className="font-semibold text-sm mb-1">Scope</h4>
              <p className="text-sm text-muted-foreground">
                This document is descriptive and instructional only. It does not modify, move, rename, or update any existing assets or hierarchy data. It governs all future asset creation and hierarchy management.
              </p>
            </div>

            <Separator />

            {/* Hierarchy Levels Table */}
            <h4 className="font-semibold text-base">1. Approved Asset Hierarchy (7 Levels)</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14">Level</TableHead>
                  <TableHead className="w-36">Name</TableHead>
                  <TableHead>Example</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-12 text-center">FL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hierarchyLevels.map((item) => (
                  <TableRow key={item.level}>
                    <TableCell className="font-mono font-bold text-primary">{item.level}</TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-xs font-mono">{item.example}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.desc}</TableCell>
                    <TableCell className="text-center text-sm">{item.hasFL}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            {/* Parent-Child Rules */}
            <h4 className="font-semibold text-base">2. Parent-Child Rules</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Rule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parentChildRules.map((rule, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-bold">{i + 1}</TableCell>
                    <TableCell className="text-sm">{rule}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            {/* Constraints */}
            <h4 className="font-semibold text-base">3. Constraints (Non-Negotiable)</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Constraint</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {constraints.map((c, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-bold">{i + 1}</TableCell>
                    <TableCell className="text-sm">{c}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            {/* FL Rules */}
            <h4 className="font-semibold text-base">4. Functional Location (FL) Rules</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Rule</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  "FL format: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]",
                  "Functional Locations stop at Parent Asset (L5) level. Never assigned to equipment or components",
                  "Equipment (L6) and Components (L7) inherit the FL of their parent system",
                  "Duty/Standby and identical grouped assets share one Parent FL",
                  "Each FL is unique across the entire site. No duplicates permitted",
                  "FL codes are immutable once assigned and may not be reused",
                ].map((rule, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-bold">{i + 1}</TableCell>
                    <TableCell className="text-sm">{rule}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            {/* Asset Numbering */}
            <h4 className="font-semibold text-base">5. Asset Numbering Standard</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Format: <code className="font-mono font-bold text-primary">[AREA][NN]-[TYPE][NN]</code>.
              Parent assets use the Area prefix with a sequential number. Equipment uses the parent number followed by an equipment type abbreviation and sequence.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h5 className="font-medium text-sm mb-2">Asset Number Examples</h5>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Number</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetNumberingExamples.map((ex) => (
                      <TableRow key={ex.number}>
                        <TableCell className="font-mono text-xs">{ex.number}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{ex.desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h5 className="font-medium text-sm mb-2">Equipment Type Abbreviations</h5>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Code</TableHead>
                      <TableHead>Meaning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipmentAbbreviations.map((abbr) => (
                      <TableRow key={abbr.code}>
                        <TableCell className="font-mono text-xs font-bold">{abbr.code}</TableCell>
                        <TableCell className="text-sm">{abbr.meaning}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Separator />

            {/* Numbering Rules */}
            <h4 className="font-semibold text-base">6. Asset Numbering Rules</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Rule</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { rule: "Sequential", desc: "Numbers allocated in order within each Area" },
                  { rule: "Unique", desc: "No duplicate asset numbers across the entire site" },
                  { rule: "Immutable", desc: "Once assigned, numbers are never reused or changed" },
                  { rule: "No Gaps", desc: "Unused numbers must be documented with a reason" },
                  { rule: "All-Caps", desc: "Asset numbers and FL codes always use uppercase letters" },
                ].map((item) => (
                  <TableRow key={item.rule}>
                    <TableCell className="font-medium text-sm">{item.rule}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Separator />

            {/* Governance */}
            <h4 className="font-semibold text-base">7. Governance & Change Control</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Requirement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  "All hierarchy changes require a formal Management of Change (MOC) process",
                  "New assets must be reviewed and approved by the Maintenance Superintendent before CMMS entry",
                  "This document is the single source of truth. Any deviation must be documented and approved",
                  "Annual review required. Next review date: March 2027",
                ].map((req, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-mono font-bold">{i + 1}</TableCell>
                    <TableCell className="text-sm">{req}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};
