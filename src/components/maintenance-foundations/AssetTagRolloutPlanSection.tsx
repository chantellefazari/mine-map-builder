import { useState, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Shield,
  Camera,
  Database,
  Wrench,
  FileText,
  ChevronRight,
  Package,
  Tag,
  Layers,
  Hash,
  Square,
  Circle,
  Download,
  Loader2,
  MapPin,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { generateAssetRegisterPDF, generateProductionListPDF } from "@/utils/generateRolloutPlanPDF";
import type { ProductionTag } from "./AssetTagProductionList";

const SectionHeading = ({
  icon: Icon,
  number,
  title,
}: {
  icon: React.ElementType;
  number: string;
  title: string;
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-primary-foreground" />
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">{number}</span>
      <h3 className="text-base font-bold text-foreground uppercase tracking-wide">{title}</h3>
    </div>
  </div>
);

const CheckItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 py-1.5">
    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
    <p className="text-sm text-foreground">{children}</p>
  </div>
);

const StepItem = ({ step, children }: { step: number; children: React.ReactNode }) => (
  <div className="flex items-start gap-3 py-2">
    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
      <span className="text-xs font-bold text-primary">{step}</span>
    </div>
    <p className="text-sm text-foreground">{children}</p>
  </div>
);

const WarnItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 py-1.5">
    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
    <p className="text-sm text-foreground">{children}</p>
  </div>
);

export const AssetTagRolloutPlanSection = () => {
  const [downloading] = useState(false);
  const planRef = useRef<HTMLDivElement>(null);

  const { data: taggedAssets = [] } = useQuery({
    queryKey: ["pid-tagged-assets-register"],
    queryFn: async () => {
      const allRows: any[] = [];
      let from = 0;
      const batchSize = 1000;
      while (true) {
        const { data, error } = await supabase
          .from("processing_plant_assets_rev_b")
          .select("asset_name, asset_number, parent_asset_label, pid_tags, area_label, sub_area, functional_location")
          .not("pid_tags", "is", null)
          .not("pid_tags", "eq", "{}")
          .order("sort_order", { ascending: true })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        const filtered = data.filter((r: any) => Array.isArray(r.pid_tags) && r.pid_tags.length > 0);
        allRows.push(...filtered);
        if (data.length < batchSize) break;
        from += batchSize;
      }
      return allRows;
    },
    staleTime: 5 * 60 * 1000,
  });

  const productionTags = useMemo(() => {
    const TYPE_A = [/TK/i, /^BM/i, /CV|BC/i, /FE/i, /CH/i, /HP/i, /CY/i, /TH/i, /FP/i, /PIPE/i, /PND|SMP/i, /CELL/i, /ARCV/i, /RO/i, /^EW/i];
    const TYPE_B = [/PMP|PU|PA\d|PB\d/i, /VLV/i, /MTR/i, /GBX|GB/i, /AGT|AG/i, /HPAC/i, /AFLT/i, /CLR|FA-/i, /DSP|DP/i, /SCR|SS/i, /GEN/i, /MK/i, /LUB|LS/i];

    function classify(an: string, name: string): "A" | "B" {
      for (const p of TYPE_A) if (p.test(an)) return "A";
      for (const p of TYPE_B) if (p.test(an)) return "B";
      const n = name.toLowerCase();
      if (/tank|conveyor|hopper|chute|thickener|cyclone|sump|pond|pipe|cell|receiver/.test(n)) return "A";
      return "B";
    }

    function mountLoc(type: "A" | "B", name: string): string {
      const n = name.toLowerCase();
      if (type === "A") {
        if (/tank/.test(n)) return "Tank shell or support leg";
        if (/conveyor|belt/.test(n)) return "Conveyor frame or stringer";
        if (/hopper/.test(n)) return "Hopper frame or skirt";
        if (/mill/.test(n)) return "Mill foundation pedestal";
        return "Fixed structure or frame";
      }
      if (/pump/.test(n)) return "Pump baseplate or adjacent steelwork";
      if (/valve/.test(n)) return "Pipe support near valve body";
      if (/motor/.test(n)) return "Motor mounting bracket";
      return "Adjacent fixed steelwork or support";
    }

    return taggedAssets.map((a: any): ProductionTag => {
      const tagType = classify(a.asset_number, a.asset_name);
      return {
        assetName: a.asset_name,
        assetNumber: a.asset_number,
        pidTag: a.pid_tags.join("; "),
        parentSystem: a.parent_asset_label,
        tagType,
        tagSize: tagType === "A" ? "100mm x 50mm x 1.5mm" : "70mm x 25mm x 1.5mm",
        mountingLocation: mountLoc(tagType, a.asset_name),
        mountingMethod: tagType === "A" ? "Adhesive plate or rivet to fixed surface" : "Bolt or cable tie to nearby structure",
        areaLabel: a.area_label,
        subArea: a.sub_area,
        functionalLocation: a.functional_location || "",
        tagInstalled: false,
      };
    });
  }, [taggedAssets]);

  const typeACnt = productionTags.filter(t => t.tagType === "A").length;
  const typeBCnt = productionTags.filter(t => t.tagType === "B").length;

  const handleDownloadPlan = () => {
    const el = planRef.current;
    if (!el) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
        <title>Processing Plant - Asset Tagging Standard & Rollout Plan — TCMG</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; line-height: 1.5; color: #111; background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .doc-header { border-bottom: 3px solid #d4a017; margin-bottom: 8mm; padding-bottom: 4mm; }
          .doc-header h1 { font-size: 16px; font-weight: 700; }
          .doc-header p { font-size: 10px; color: #666; margin-top: 2px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
          th, td { border: 1px solid #ccc; padding: 5px 8px; text-align: left; font-size: 10px; }
          th { background-color: #f5f0e0; font-weight: 600; }
          h2, h3, h4 { margin-bottom: 4px; font-weight: 600; }
          ul, ol { padding-left: 16px; margin-bottom: 6px; }
          li, p { margin-bottom: 2px; font-size: 10px; }
          hr { border: none; border-top: 1px solid #ddd; margin: 6px 0; }
          img { max-width: 100%; height: auto; }
          svg { display: none; }
          button { display: none !important; }
          [class*="rounded"], .card { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
          .print-hide { display: none !important; }
        </style>
      </head><body>
        <div class="doc-header">
          <h1>Processing Plant — Asset Tagging Standard & Rollout Plan</h1>
          <p>TCMG-STD-TAG-002 Rev 2.0 | Tennant Mines Gold | ${new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        ${el.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
  };

  const handleDownloadRegister = async () => {
    try { await generateAssetRegisterPDF(taggedAssets); }
    catch (err) { console.error("Asset Register PDF error:", err); }
  };

  const handleDownloadProductionList = async () => {
    try { await generateProductionListPDF(productionTags); }
    catch (err) { console.error("Production List PDF error:", err); }
  };

  return (
    <div ref={planRef} className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Processing Plant - Asset Tagging Standard & Rollout Plan
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Complete tagging standard and structured implementation plan for physical asset tagging across the processing plant.
                Aligned with the rebuilt asset tree and P&ID extraction register.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 items-end">
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs font-mono">TCMG-STD-TAG-002</Badge>
                <Badge variant="outline" className="text-xs font-mono">Rev 2.0</Badge>
              </div>
              <Badge className="text-xs bg-primary text-primary-foreground">Processing Plant Only</Badge>
              <div className="flex flex-col gap-1 mt-1">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownloadPlan}
                  disabled={downloading || taggedAssets.length === 0}
                >
                  {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  {downloading ? "Generating…" : "Download Rollout Plan PDF"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownloadRegister}
                  disabled={taggedAssets.length === 0}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Attachment A - Asset Register PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={handleDownloadProductionList}
                  disabled={productionTags.length === 0}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Attachment B - Production List PDF
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            <p className="text-xs text-amber-800 font-medium">
              ⚠ Scope Notice: This plan applies to the Processing Plant ONLY. The Crushing Plant is excluded until P&IDs are finalised and approved.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          PART A — TAGGING STANDARD
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* 01. Purpose & Scope */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={FileText} number="01" title="Purpose & Scope" />
          <p className="text-sm text-muted-foreground mb-3">
            This standard defines a simple, durable physical tagging system for Processing Plant assets.
            The physical tag carries only the Asset ID - nothing else. All hierarchy, functional location
            codes, area structures, and system data are stored in Minesite AI, not on the tag.
          </p>
          <div className="grid sm:grid-cols-2 gap-1">
            <CheckItem>Rapid visual identification from Asset ID alone</CheckItem>
            <CheckItem>Asset ID matches the existing asset tree exactly - no new numbering</CheckItem>
            <CheckItem>No functional location codes, area codes, or system strings on the tag</CheckItem>
            <CheckItem>Simple enough to produce internally or order externally on demand</CheckItem>
            <CheckItem>Robust performance in dusty, wet, and corrosive mining conditions</CheckItem>
            <CheckItem>Eliminates cluttered, hard-to-read tag formats</CheckItem>
          </div>
        </CardContent>
      </Card>

      {/* 02. Tag Format & Design Specification */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Tag} number="02" title="Tag Format & Design Specification" />
          <p className="text-sm text-muted-foreground mb-3">
            The physical tag displays <strong>two lines only</strong>: the Asset ID (large, bold) and the equipment
            description (smaller). No functional location, no area code, no system strings, no QR code.
          </p>

          {/* Format template */}
          <div className="bg-muted rounded-lg p-5 font-mono space-y-1 text-center mb-4">
            <p className="text-2xl font-black text-foreground tracking-widest">BM01</p>
            <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Primary Ball Mill</p>
            <p className="text-xs text-muted-foreground mt-3">← That is the entire tag. Nothing else.</p>
          </div>

          <div className="space-y-0.5 mb-4">
            <CheckItem>Line 1 = Asset ID (large bold, ALL CAPS) - Line 2 = Short equipment description (smaller, uppercase)</CheckItem>
            <CheckItem>No functional location, area code, QR code, or system strings on the tag</CheckItem>
            <CheckItem>Asset ID on tag must match Minesite AI system record exactly</CheckItem>
            <CheckItem>All hierarchy in system - FL codes and area structure remain in Minesite AI only</CheckItem>
          </div>

          <Separator className="my-4" />

          {/* Material & Marking */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Material & Marking</p>
          <div className="grid sm:grid-cols-2 gap-1 mb-4">
            <CheckItem>Material: Laser-engraved industrial label or printed industrial label</CheckItem>
            <CheckItem>Background: White or silver - high contrast for readability</CheckItem>
            <CheckItem>Font: Bold black sans-serif - minimum 20mm text height for Asset ID</CheckItem>
            <CheckItem>Finish: Oil-resistant, dust-resistant, UV-resistant coating</CheckItem>
            <CheckItem>Backing: Industrial adhesive backing - permanent mounting</CheckItem>
            <CheckItem>Optional: Single hole punch on one end for ring or cable-tie attachment</CheckItem>
          </div>

          <Separator className="my-4" />

          {/* Tag Layout Examples */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Tag Layout Examples</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-md px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Type A Tag Layout</p>
              <div className="bg-background border border-border rounded px-4 py-3 text-center font-mono">
                <p className="text-lg font-bold text-foreground">BM01</p>
                <p className="text-xs text-muted-foreground">Primary Ball Mill</p>
              </div>
            </div>
            <div className="bg-muted/40 rounded-md px-3 py-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Type B Tag Layout</p>
              <div className="bg-background border border-border rounded px-4 py-3 text-center font-mono">
                <p className="text-base font-bold text-foreground">CFP01-PA01</p>
                <p className="text-[11px] text-muted-foreground">Cyclone Feed Pump (Duty)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 03. Tagging Criteria */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={ClipboardList} number="03" title="Tagging Criteria" />
          <p className="text-sm text-muted-foreground mb-3">
            Physical asset tags are issued exclusively to equipment that has a linked P&ID equipment tag.
            This ensures every tag has a verified engineering reference and eliminates uncontrolled tagging.
          </p>
          <div className="space-y-0.5">
            <CheckItem>Only assets with a linked P&ID tag number will receive a physical asset tag</CheckItem>
            <CheckItem>Assets without P&ID references are excluded from the tagging program</CheckItem>
            <CheckItem>Tag numbers must match the asset number used in the asset register and P&ID - no independent numbering systems permitted</CheckItem>
            <CheckItem>The P&ID Tagged Asset Register (generated from the live database) is the sole source of truth for the tagging scope</CheckItem>
          </div>
          <div className="mt-3 bg-muted/40 rounded-md px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Exclusion Rule</p>
            <p className="text-xs text-foreground">
              System headers, functional locations, and Level 7 sub-components (motors, gearboxes, VSDs) that do not carry their own P&ID tag
              are <strong>excluded</strong> from the tagging program. Only equipment with a direct P&ID reference is tagged.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 04. Tag Categories & Sizes */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Layers} number="04" title="Tag Categories & Sizes" />
          <p className="text-sm text-muted-foreground mb-4">
            Two tag types are used to distinguish between fixed infrastructure and equipment positions.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Type A */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Type A - Major Asset Plates</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono font-bold">100mm × 50mm × 1.5mm</p>
                <p className="text-xs text-muted-foreground">
                  Flat plate with <strong>no hole</strong>. Permanently mounted to large fixed infrastructure using adhesive or rivets.
                </p>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Examples</p>
                  <div className="flex flex-wrap gap-1">
                    {["Tanks", "Conveyors", "Crushers", "Mills", "Thickeners", "Hoppers", "Chutes", "Cyclone Clusters", "Filter Presses", "Air Receivers", "Major Structures"].map((item) => (
                      <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-md px-2 py-1.5">
                  <p className="text-[11px] text-muted-foreground">
                    <strong>Mounting:</strong> Adhesive plate or rivet directly to the asset shell, frame, or support structure.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Type B */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Circle className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Type B - Equipment Position Tags</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono font-bold">70mm × 25mm × 1.5mm</p>
                <p className="text-xs text-muted-foreground">
                  Smaller tag with a <strong>single hole</strong>. Mounted to nearby fixed structure using bolt or cable tie at the equipment connection point.
                </p>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Examples</p>
                  <div className="flex flex-wrap gap-1">
                    {["Pumps", "Valves", "Motors", "Instruments", "Agitators", "Compressors", "Screens", "Lube Systems", "Dosing Pumps", "Generators", "Hoists", "Fans / Coolers"].map((item) => (
                      <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/50 rounded-md px-2 py-1.5">
                  <p className="text-[11px] text-muted-foreground">
                    <strong>Mounting:</strong> Bolt or cable tie to adjacent steelwork, pipe support, baseplate or skid frame - never on the equipment itself.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 05. Tag Mounting Philosophy & Placement */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="05" title="Tag Mounting Philosophy & Placement" />
          <p className="text-sm text-muted-foreground mb-3">
            Asset tags represent the P&ID equipment <strong>position</strong>, not the removable equipment itself.
            Tags must be mounted on the fixed structure at the equipment connection point so they remain correct
            when pumps, motors, gearboxes or instruments are replaced.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">✅ Mount tags on:</p>
              <div className="space-y-0.5">
                <CheckItem>Equipment frames and baseplates</CheckItem>
                <CheckItem>Pipe supports and pipe stands</CheckItem>
                <CheckItem>Skids and vendor package frames</CheckItem>
                <CheckItem>Handrails and platform steelwork</CheckItem>
                <CheckItem>Structural steel columns and beams</CheckItem>
                <CheckItem>Tank shells and support legs</CheckItem>
                <CheckItem>Conveyor stringers and head frames</CheckItem>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">❌ Never mount tags on:</p>
              <div className="space-y-0.5">
                <WarnItem>Pumps (replaceable rotating equipment)</WarnItem>
                <WarnItem>Motors (replaceable drive units)</WarnItem>
                <WarnItem>Gearboxes (replaceable drivetrain)</WarnItem>
                <WarnItem>Instruments and sensors (calibration swap-outs)</WarnItem>
                <WarnItem>Valves (replaceable flow control devices)</WarnItem>
                <WarnItem>Any equipment that may be removed for repair or replacement</WarnItem>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Placement by Equipment Type */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Placement by Equipment Type</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase border border-border">Equipment Type</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase border border-border">Placement Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Motors",     "Mount on frame side - non-drive end - avoid cooling fins"],
                  ["Pumps",      "Mount on base frame - discharge side - not on removable guards"],
                  ["Conveyors",  "Drive side near motor - 1.0-1.5m above ground - not on belt guards"],
                  ["Screens",    "Structural frame near drive side - eye level where accessible"],
                  ["Tanks",      "Near manway or ladder access point - eye level where possible"],
                  ["Electrical panels", "Front exterior door - eye level"],
                  ["Gearboxes",  "Oil filler or inspection side - avoid hot surfaces"],
                  ["Crushers",   "Main frame structural section - non-wear, non-impact area"],
                ].map(([type, placement]) => (
                  <tr key={type} className="hover:bg-muted/30">
                    <td className="px-3 py-2 text-sm font-semibold text-foreground border border-border">{type}</td>
                    <td className="px-3 py-2 text-sm text-muted-foreground border border-border">{placement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground">
                <strong>Rationale:</strong> When a pump is replaced, the P&ID position remains the same. The tag identifies
                <em> where</em> the equipment connects to the process - not <em>which</em> specific unit is installed.
                This eliminates re-tagging after every equipment changeout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════════════════════════
          PART B — ROLLOUT PLAN
          ═══════════════════════════════════════════════════════════════════════ */}

      {/* 06. Tag Material Options */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Package} number="06" title="Tag Material Options" />
          <p className="text-sm text-muted-foreground mb-4">
            Two material options have been quoted. Final selection must be locked before tag manufacturing begins.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">Specification</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-primary uppercase tracking-wide border border-border">Option 1 - 316 Stainless Steel</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">Option 2 - DuraBlack</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Type A Size (Major Assets)", "100mm × 50mm × 1.5mm", "100mm × 40mm × 0.5mm"],
                  ["Type B Size (Position Tags)", "70mm × 25mm × 1.5mm", "80mm × 30mm × 0.5mm"],
                  ["Material", "316 Stainless Steel - engraved", "DuraBlack - laser etched"],
                  ["Price Estimate", "$7.20 per tag (500+ order)", "$4.65 per tag (500+ order)"],
                  ["Durability", "Excellent - 10+ year lifespan, chemical resistant", "Very Good - UV/oil resistant, 5-8 years outdoor"],
                  ["Legibility", "Engraved text - permanent, high contrast", "Laser etched - high contrast black/white"],
                  ["Weight", "Heavier - solid plate", "Lighter - thin profile"],
                  ["Best For", "Harsh environments, chemical areas, heavy wear", "General plant areas, cost-effective bulk orders"],
                ].map(([spec, opt1, opt2]) => (
                  <tr key={spec} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 font-semibold text-xs border border-border">{spec}</td>
                    <td className="px-3 py-2 text-xs border border-border">{opt1}</td>
                    <td className="px-3 py-2 text-xs border border-border">{opt2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 bg-muted/40 rounded-md px-3 py-2">
            <p className="text-xs text-muted-foreground">
              <strong>Supplier:</strong> Trophy Central Alice Springs - quote provided for both options at 500+ quantity pricing.
            </p>
          </div>
          <div className="mt-2 flex items-start gap-2 bg-primary/5 rounded-md px-3 py-2">
            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">Recommendation:</span> Use 316 Stainless Steel for chemical/reagent areas (Gold Room, CIL, Reagents).
              Use DuraBlack for general plant areas (Water, Compressed Air, Comminution) to reduce cost while maintaining durability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 07. Asset Tag Production Options */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Factory} number="07" title="Asset Tag Production Options" />
          <p className="text-sm text-muted-foreground mb-4">
            Management may choose between outsourcing tag production to a specialist supplier or purchasing equipment for internal on-demand production.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Option 1 - Outsource */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Option 1 - Outsource</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Supplier</p>
                  <p className="text-sm text-foreground font-medium">Trophy Central - Alice Springs</p>
                </div>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pricing (500+ qty)</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1">
                      <span>Stainless Steel</span>
                      <span className="font-bold font-mono">$7.20 / tag</span>
                    </div>
                    <div className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1">
                      <span>DuraBlack</span>
                      <span className="font-bold font-mono">$4.65 / tag</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Pros</p>
                  <CheckItem>No capital equipment required</CheckItem>
                  <CheckItem>Professional engraving quality</CheckItem>
                  <CheckItem>Quick production turnaround</CheckItem>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Cons</p>
                  <WarnItem>Ongoing cost per tag for every order</WarnItem>
                  <WarnItem>Lead time for additional or replacement tags</WarnItem>
                </div>
              </CardContent>
            </Card>

            {/* Option 2 - In-House */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Option 2 - In-House</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Equipment</p>
                  <p className="text-sm text-foreground font-medium">Gravotech LS100 Laser Engraver</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Reference</p>
                  <a
                    href="https://www.gravotech.com.au/products/laser-engravers-laser-cutters/ls100"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary underline break-all"
                  >
                    gravotech.com.au - LS100 Laser Engraver
                  </a>
                </div>
                <Separator />
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Pros</p>
                  <CheckItem>Immediate production - no supplier lead time</CheckItem>
                  <CheckItem>Tags produced when new assets are installed</CheckItem>
                  <CheckItem>Can produce additional labels and signage</CheckItem>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Cons</p>
                  <WarnItem>Initial capital equipment purchase required</WarnItem>
                  <WarnItem>Operator training required</WarnItem>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground">
                <strong>Management Decision:</strong> Either option delivers the required outcome. A hybrid approach -
                outsource the first batch, then transition to in-house - is also viable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 08. Tag Installation Workflow */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Wrench} number="08" title="Tag Installation Workflow" />
          <p className="text-sm text-muted-foreground mb-3">
            Follow this five-step workflow. Each step must be completed before proceeding to the next.
          </p>
          <div className="space-y-0.5">
            <StepItem step={1}>
              <strong>Confirm P&ID Asset Register</strong> - Verify the P&ID Tagged Asset Register (Attachment A) is the latest
              approved revision and reflects the current asset tree.
            </StepItem>
            <StepItem step={2}>
              <strong>Review Tag Production List</strong> - Confirm the Tag Production List (Attachment B) has classified each asset
              as Type A or Type B with correct mounting locations, methods, and quantities for the manufacturing order.
            </StepItem>
            <StepItem step={3}>
              <strong>Manufacture Tags</strong> - Submit production list to tag supplier.
              Confirm material, size, and engraving/etching specifications per Section 06.
            </StepItem>
            <StepItem step={4}>
              <strong>Install Tags During Field Verification</strong> - Walk down each area with the production list.
              Verify equipment exists at the P&ID position. Clean mounting surface. Install tag on fixed structure.
              Photograph installed tag showing Asset ID and surrounding context.
            </StepItem>
            <StepItem step={5}>
              <strong>Update Asset Record</strong> - Mark asset status as "Tagged - Verified" in the master asset register.
              File confirmation photo against the asset record for audit purposes.
            </StepItem>
          </div>
          <div className="mt-3 bg-muted/40 rounded-md px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Critical Rule</p>
            <p className="text-xs text-foreground">
              No tag shall be applied without a matching system record and confirmed P&ID reference.
              If the asset is not in the register or has no P&ID tag, <strong>stop - do not tag</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 09. Pre-Rollout Requirements */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="09" title="Pre-Rollout Requirements - Gate 1" />
          <p className="text-sm text-muted-foreground mb-3">
            All items below must be confirmed and signed off before any physical tagging commences.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            {[
              "Final approved Processing Plant asset tree exported and locked",
              "P&IDs reviewed and validated against asset tree (14-page set verified)",
              "Asset IDs frozen - no renumbering permitted during rollout",
              "Tag material option selected and supplier confirmed",
              "Tag production list generated with Type A/B classification",
              "Manufacturing order placed and delivery date confirmed",
              "Rollout sequence agreed with maintenance supervisor",
              "Field tagging crew briefed on mounting philosophy and QC requirements",
            ].map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
          <div className="mt-3 bg-muted/50 rounded-md px-3 py-2">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Gate 1 Sign-off Required By:</p>
            <p className="text-xs text-foreground mt-0.5">Maintenance Superintendent + Asset Owner</p>
          </div>
        </CardContent>
      </Card>

      {/* 10. Quality Control */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={CheckCircle2} number="10" title="Quality Control" />
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            {[
              "Maintenance supervisor sign-off required per area before proceeding to next zone",
              "Random audit of minimum 10% of tagged assets per area",
              "Cross-check all tags installed against the P&ID Tagged Asset Register",
              "Confirm zero duplicated Asset IDs across all tagged positions",
              "Confirm no assets on the production list are missing a physical tag",
              "Photo evidence reviewed and linked to system record for audited assets",
              "Verify tags are mounted on fixed structure - not on replaceable equipment",
              "Confirm tag text matches asset register exactly (no abbreviations or variations)",
            ].map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 11. Safety Considerations */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="11" title="Safety Considerations" />
          <div className="space-y-0.5">
            <WarnItem>Apply LOTO (Lockout/Tagout) before tagging any asset near rotating or energised equipment</WarnItem>
            <WarnItem>No tagging during active plant operation unless the asset and access point are confirmed safe</WarnItem>
            <WarnItem>PPE requirements: Safety glasses, gloves, steel cap boots, high-vis vest at all times in processing area</WarnItem>
            <WarnItem>Ladder use must comply with site ladder management procedure - two-person rule applies</WarnItem>
            <WarnItem>Do not tag hot surfaces - allow equipment to cool before working in proximity</WarnItem>
            <WarnItem>Chemical areas (reagents, cyanide) - wear chemical-resistant gloves and face shield</WarnItem>
          </div>
        </CardContent>
      </Card>

      {/* 12. Completion Deliverables */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Camera} number="12" title="Completion Deliverables" />
          <p className="text-sm text-muted-foreground mb-3">
            The following must be produced and filed upon rollout completion.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            <CheckItem>Tagged Asset Register - full list of every tagged asset with ID, description, location, and photo reference</CheckItem>
            <CheckItem>Completion Report - summary of tag counts, discrepancies resolved, QC audit results</CheckItem>
            <CheckItem>Before/After photo archive - organised by area</CheckItem>
            <CheckItem>Updated asset tree status - all tagged assets marked as "Tagged - Verified" in the master asset register</CheckItem>
            <CheckItem>Signed close-out sheets for each area</CheckItem>
            <CheckItem>Outstanding items list - any deferred assets with justification and target completion date</CheckItem>
          </div>
        </CardContent>
      </Card>

      {/* 13. Governance Controls */}
      <Card className="border-destructive/20">
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="13" title="Governance Controls" />
          <p className="text-sm text-muted-foreground mb-3">
            The following governance controls are mandatory for all Processing Plant assets.
          </p>
          <div className="grid sm:grid-cols-2 gap-1">
            <CheckItem>No asset installed or commissioned without a physical tag</CheckItem>
            <CheckItem>No physical tag created without an existing asset record in Minesite AI</CheckItem>
            <CheckItem>Asset ID on tag must match the system record exactly</CheckItem>
            <CheckItem>Damaged or missing tags must be replaced immediately</CheckItem>
            <CheckItem>Tag replacement must be recorded in the asset's work order history</CheckItem>
            <CheckItem>Any change to Asset ID requires formal change control and hierarchy update</CheckItem>
          </div>
          <Separator className="my-3" />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Prohibited Practices</p>
            <WarnItem>Temporary handwritten tags are not permitted beyond commissioning period (max 48 hours)</WarnItem>
            <WarnItem>Adhesive paper or plastic labels are not acceptable as a permanent tagging solution</WarnItem>
            <WarnItem>Tags must not be created outside the system - all Asset IDs originate from a validated Minesite AI record</WarnItem>
            <WarnItem>Functional location codes, area codes, or system strings must NOT be printed on physical tags</WarnItem>
          </div>
        </CardContent>
      </Card>

      {/* System Alignment Note */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">System Alignment Note</p>
              <p className="text-sm text-foreground">
                All asset hierarchy, functional locations, and system structure are stored within <strong>Minesite AI</strong>.
                The physical tag is for rapid visual identification only. Tag numbers match the asset register - no independent
                numbering systems exist. The tag rollout does not define or alter any system hierarchy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* 14. Attachments */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={FileText} number="14" title="Attachments" />
          <p className="text-sm text-muted-foreground mb-4">
            The following attachments form part of this document and must be current before commencing the rollout.
            Both attachments are included as separate documents within this deliverable package.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">Attachment A</Badge>
                <p className="text-sm font-bold text-foreground">P&ID Tagged Asset Register</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Complete register of all Processing Plant assets with linked P&ID tags. This is the sole source of truth
                for the tagging scope - only assets listed here receive a physical tag.
              </p>
              <div className="bg-muted/40 rounded-md px-3 py-2 mt-2">
                <p className="text-xs text-foreground"><strong>Contains:</strong> Asset Number, Asset Name, Parent System, P&ID Tag(s), Area, Sub-Area, Functional Location</p>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">Attachment B</Badge>
                <p className="text-sm font-bold text-foreground">Tag Production List</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Manufacturing-ready list with Type A/B classification, tag sizes, mounting locations, and mounting methods
                for every asset in scope. Submit directly to tag supplier or use for in-house production.
              </p>
              <div className="bg-muted/40 rounded-md px-3 py-2 mt-2">
                <p className="text-xs text-foreground"><strong>Contains:</strong> Asset Number, Tag Type (A/B), Tag Size, Mounting Location, Mounting Method, Area</p>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-muted/40 rounded-md px-3 py-2">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> Both attachments must reflect the current approved asset tree at the time of rollout.
              Confirm with the project lead that the attached versions are the latest approved revision before commencing any rollout activity.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Scope reminder */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          <strong>Scope:</strong> Processing Plant ONLY. Crushing Plant excluded until P&IDs are finalised.
          Do not apply this rollout plan to crushing or mining equipment.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>TCMG-STD-TAG-002 · Processing Plant Asset Tagging Standard & Rollout Plan · Rev 2.0</span>
        <span>Crushing Plant excluded · Internal use only</span>
      </div>
    </div>
  );
};
