import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tag,
  QrCode,
  Shield,
  MapPin,
  Layers,
  Settings,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SectionHeading = ({ icon: Icon, number, title }: { icon: React.ElementType; number: string; title: string }) => (
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

const RuleRow = ({ label, children }: { label?: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-2 py-1.5">
    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
    <div className="text-sm text-foreground">
      {label && <span className="font-semibold">{label}: </span>}
      {children}
    </div>
  </div>
);

const WarningRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 py-1.5">
    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
    <p className="text-sm text-foreground">{children}</p>
  </div>
);

export const ProcessingPlantAssetTaggingSection = () => {
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Title Block */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary">TCMG-STD-TAG-001</Badge>
                <Badge className="text-xs bg-primary text-primary-foreground">Processing Plant Only</Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">
                Processing Plant — Asset Tagging Standard
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Format + Physical Design Specification
              </p>
              <p className="text-xs text-muted-foreground/70 mt-3 italic border-l-2 border-primary/30 pl-3">
                Crushing Plant is excluded from this standard. This document applies to the Processing Plant facility only.
              </p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleExportPDF}>
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 1. Purpose */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={FileText} number="1" title="Purpose" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This standard ensures physical asset identification aligns precisely with the digital asset tree
            configured in the Minesite AI system. It is designed to:
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Physical asset matches digital asset tree at all levels",
              "One-to-one traceability between tag and system record",
              "Clean integration with Minesite AI for PM, work orders, and parts",
              "Elimination of informal or handwritten tagging practices",
              "Professional mining-specification physical identification",
            ].map((item, i) => (
              <RuleRow key={i}>{item}</RuleRow>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Asset Tag Format */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Tag} number="2" title="Asset Tag Format — Processing Plant" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The asset tag format reflects the existing Processing Plant hierarchy already configured in the system.
            No separate numbering scheme is introduced — the tag must mirror the system record exactly.
          </p>

          {/* Format display */}
          <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Standard Format</p>
            <p className="text-foreground font-bold text-base tracking-wider">
              [Site Code] – [Area Code] – [Equip. Prefix] – [Sequential No.]
            </p>
          </div>

          {/* Examples */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Examples — Processing Plant Only</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { tag: "TCMG-COM-PU-101", desc: "Comminution — Pump 101" },
                { tag: "TCMG-REC-CV-203", desc: "Gold Recovery — Conveyor 203" },
                { tag: "TCMG-TAIL-PU-305", desc: "Tailings — Pump 305" },
                { tag: "TCMG-UTL-TK-01", desc: "Utilities — Tank 01" },
              ].map((ex) => (
                <div key={ex.tag} className="flex items-center gap-3 bg-muted/50 rounded-md px-3 py-2">
                  <code className="text-primary font-mono text-sm font-bold">{ex.tag}</code>
                  <span className="text-xs text-muted-foreground">{ex.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Format rules */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Format Rules</p>
            <RuleRow label="Prefix">Must match the existing equipment type prefix configured in the hierarchy</RuleRow>
            <RuleRow label="Numbering">No manual numbering outside the system — system record is the source of truth</RuleRow>
            <RuleRow label="Exact match">Asset number on tag must match the system record exactly — no abbreviations</RuleRow>
            <RuleRow label="Sub-assets">Motors, gearboxes, and panels must carry their own tag if configured in the hierarchy</RuleRow>
          </div>

          {/* Segment definitions */}
          <div className="overflow-x-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Tag Segment Definitions</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Segment</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Value</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Site Code", "TCMG", "Tennant Creek Mining Gold — fixed for all tags"],
                  ["Area Code", "COM / REC / TAIL / UTL / SITE / SUP", "Area code from configured hierarchy (Level 3)"],
                  ["Equipment Prefix", "PU / CV / TK / BM / GEN…", "Equipment type prefix — must match hierarchy record"],
                  ["Sequential No.", "01 / 101 / 203…", "Sequential identifier — assigned by system, not manually"],
                ].map(([seg, val, desc]) => (
                  <tr key={seg} className="hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs font-bold text-primary">{seg}</td>
                    <td className="px-3 py-2 font-mono text-xs text-foreground">{val}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Physical Tag Design */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Settings} number="3" title="Physical Tag Design Specification" />
        </CardHeader>
        <CardContent className="space-y-5">

          {/* Material */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Tag Material</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <RuleRow label="Material">316 Stainless Steel</RuleRow>
              <RuleRow label="Finish">Brushed finish</RuleRow>
              <RuleRow label="Marking">Laser engraved — not printed or adhesive</RuleRow>
              <RuleRow label="Durability">Permanent marking, rated for industrial outdoor environments</RuleRow>
            </div>
          </div>

          <Separator />

          {/* Size */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Minimum Tag Dimensions</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <RuleRow label="Width">80 mm minimum</RuleRow>
              <RuleRow label="Height">30 mm minimum</RuleRow>
              <RuleRow label="Corners">Rounded — no sharp edges</RuleRow>
              <RuleRow label="Fixing">Riveted, bolted, or cable-tied — adhesive not permitted for primary fixing</RuleRow>
            </div>
          </div>

          <Separator />

          {/* Layout */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Engraving Layout — Standard</p>
            <p className="text-sm text-muted-foreground mb-3">
              The tag is divided into two zones: QR code on the left, text fields on the right.
            </p>

            {/* Visual layout mockup */}
            <div className="border-2 border-border rounded-lg p-4 bg-muted/30 font-mono text-sm max-w-xl">
              <div className="flex items-stretch gap-4">
                {/* QR mock */}
                <div className="flex-shrink-0 w-20 h-20 border-2 border-foreground/40 rounded flex items-center justify-center bg-background">
                  <div className="text-center">
                    <QrCode className="w-10 h-10 text-foreground/60 mx-auto" />
                    <p className="text-[9px] text-muted-foreground mt-1">QR CODE</p>
                    <p className="text-[8px] text-muted-foreground">LASER ENGRAVED</p>
                  </div>
                </div>
                {/* Text side */}
                <div className="flex flex-col justify-center gap-1">
                  <p className="text-base font-extrabold text-foreground tracking-widest">TCMG-COM-PU-101</p>
                  <p className="text-sm text-foreground/80">Process Water Pump</p>
                  <p className="text-xs text-muted-foreground">Processing Plant — COM Area</p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Field Definitions</p>
              <RuleRow label="Left zone">QR code — laser engraved, minimum 18 × 18 mm readable size</RuleRow>
              <RuleRow label="Top line (bold)">Asset number — large font, all caps, matches system record</RuleRow>
              <RuleRow label="Second line">Equipment name — as registered in hierarchy</RuleRow>
              <RuleRow label="Third line (optional)">Area / Plant — Processing Plant + Area code</RuleRow>
            </div>
          </div>

          <Separator />

          {/* QR linking */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">QR Code Integration</p>
            <p className="text-sm text-muted-foreground mb-3">
              Each QR code must resolve directly to the asset record within Minesite AI, providing access to:
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              <RuleRow>Asset number and full description</RuleRow>
              <RuleRow>Physical location and area</RuleRow>
              <RuleRow>Active PM schedule</RuleRow>
              <RuleRow>Work order history</RuleRow>
              <RuleRow>Parts BOM (Bill of Materials)</RuleRow>
              <RuleRow>Attached documentation and drawings</RuleRow>
            </div>
            <div className="mt-3">
              <WarningRow>QR code must not expose backend URLs, database identifiers, or internal system paths publicly.</WarningRow>
              <WarningRow>QR destination must be editable via the system if the asset record URL changes — no hardcoded links.</WarningRow>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Sub-Asset Tagging */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Layers} number="4" title="Sub-Asset Tagging Rules — Processing Plant" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A separate physical tag is required for any sub-asset that is individually registered in the hierarchy.
            The parent–child relationship must remain linked within the system.
          </p>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Sub-Assets Requiring Individual Tags</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "Electric motors rated > 5 kW",
                "Gearboxes and gearmotors",
                "Lube systems and hydraulic units",
                "Electrical panels and MCC cells",
                "PLC / control cabinets",
                "Belt weighers and weightometers",
                "Critical instruments (if in hierarchy) — level, pressure, flow",
              ].map((item, i) => <RuleRow key={i}>{item}</RuleRow>)}
            </div>
          </div>

          <Separator />

          {/* Parent-child example */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Parent–Child Tag Example</p>
            <div className="space-y-1 font-mono text-sm bg-muted/40 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">Parent</Badge>
                <code className="text-foreground font-bold">TCMG-COM-CV-02</code>
                <span className="text-xs text-muted-foreground">Conveyor 02</span>
              </div>
              <div className="ml-6 space-y-1 border-l-2 border-primary/20 pl-4 mt-2">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">Sub-Asset</Badge>
                  <code className="text-foreground">TCMG-COM-CV-02-MTR-01</code>
                  <span className="text-xs text-muted-foreground">Drive Motor</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">Sub-Asset</Badge>
                  <code className="text-foreground">TCMG-COM-CV-02-GBX-01</code>
                  <span className="text-xs text-muted-foreground">Gearbox</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Tag Placement */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={MapPin} number="5" title="Tag Placement Standard — Processing Plant" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Equipment Type</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Placement Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Pumps", "Discharge side frame — not on removable guards — visible from operating walkway"],
                  ["Conveyors", "Drive side frame — 1.0 to 1.5 m above ground — not on belt guards"],
                  ["Tanks", "Near manway or ladder access point — eye-level where possible"],
                  ["Screens", "Structural frame near drive side"],
                  ["Electrical panels", "Front exterior door (primary) — secondary internal sticker on interior door"],
                  ["Motors", "Non-drive end frame — avoid cooling fin obstruction"],
                  ["Gearboxes", "Oil filler / inspection side — avoid hot surfaces"],
                ].map(([type, placement]) => (
                  <tr key={type} className="hover:bg-muted/30">
                    <td className="px-3 py-2 text-sm font-semibold text-foreground">{type}</td>
                    <td className="px-3 py-2 text-sm text-muted-foreground">{placement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Placement Rules — All Equipment</p>
            <RuleRow>Tag must be visible during normal operation without removing guards or opening panels</RuleRow>
            <RuleRow>Tag must not obstruct maintenance access or create a pinch/crush hazard</RuleRow>
            <div className="mt-1">
              <WarningRow>Must not be mounted on removable guards or covers — tag remains with the asset permanently</WarningRow>
              <WarningRow>Must not be positioned where abrasion, heat, or chemical spray will degrade the engraving</WarningRow>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. QR Structure */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={QrCode} number="6" title="QR Code Structure" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Each QR code must resolve to the asset page within Minesite AI. The page must display the following fields:
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <RuleRow label="Asset Number">Exact tag number as registered in system</RuleRow>
            <RuleRow label="Asset Description">Equipment name and type</RuleRow>
            <RuleRow label="Physical Location">Area, sub-area, and facility</RuleRow>
            <RuleRow label="PM Schedule">Active planned maintenance tasks and frequencies</RuleRow>
            <RuleRow label="Work Order History">Completed and open work orders</RuleRow>
            <RuleRow label="Parts BOM">Linked critical and non-critical spare parts list</RuleRow>
            <RuleRow label="Attachments">OEM manuals, drawings, inspection records</RuleRow>
          </div>
          <div className="mt-2">
            <WarningRow>QR destination URL must be managed through the system — not hardcoded on the tag or in a static document.</WarningRow>
            <WarningRow>QR must be re-encodeable if the asset record URL structure changes, without requiring physical re-tagging.</WarningRow>
          </div>
        </CardContent>
      </Card>

      {/* 7. Governance Controls */}
      <Card className="border-destructive/20">
        <CardHeader className="pb-2">
          <SectionHeading icon={Shield} number="7" title="Governance Controls" />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The following governance rules are mandatory for all Processing Plant assets. No exceptions without formal change control.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <RuleRow>No asset commissioned or handed over without a system registration record</RuleRow>
            <RuleRow>No physical tag installed without a confirmed asset record in the system</RuleRow>
            <RuleRow>No duplicate asset numbers permitted — system enforces uniqueness</RuleRow>
            <RuleRow>Damaged or missing tags must be replaced immediately upon identification</RuleRow>
            <RuleRow>Tag replacement must be recorded in the asset's work order history</RuleRow>
            <RuleRow>Any change to asset number requires formal change control and hierarchy update</RuleRow>
          </div>
          <Separator />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Prohibited Practices</p>
            <WarningRow>Temporary handwritten tags are not permitted beyond the commissioning period (max 48 hours)</WarningRow>
            <WarningRow>Adhesive-only tags are not acceptable as a permanent solution — stainless plate required</WarningRow>
            <WarningRow>Tags must not be created outside the system — all tags originate from a system record</WarningRow>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>TCMG-STD-TAG-001 · Processing Plant Asset Tagging Standard · Rev 1.0</span>
        <span>Crushing Plant excluded · Internal use only</span>
      </div>
    </div>
  );
};
