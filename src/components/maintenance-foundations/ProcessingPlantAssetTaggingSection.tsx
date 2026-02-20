import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tag,
  Shield,
  MapPin,
  Layers,
  Settings,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Download,
  Factory,
  Type,
  Wrench,
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

/** Rendered stainless steel tag mockup — no QR */
const StainlessTagMockup = ({
  assetNumber,
  description,
  plant = "Processing Plant",
}: {
  assetNumber: string;
  description: string;
  plant?: string;
}) => (
  <div
    className="relative inline-flex flex-col justify-center px-6 py-4 rounded-lg select-none"
    style={{
      minWidth: 280,
      minHeight: 90,
      background: "linear-gradient(135deg, #c8cfd6 0%, #e8edf2 40%, #d0d8df 70%, #bec8d0 100%)",
      boxShadow:
        "0 2px 8px 0 rgba(0,0,0,0.22), inset 0 1px 2px rgba(255,255,255,0.55), inset 0 -1px 2px rgba(0,0,0,0.1)",
      border: "1.5px solid #a8b4be",
    }}
  >
    {/* Brushed texture overlay */}
    <div
      className="absolute inset-0 rounded-lg pointer-events-none"
      style={{
        background:
          "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.07) 2px, rgba(255,255,255,0.07) 4px)",
        opacity: 0.6,
      }}
    />
    {/* Mounting hole indicator */}
    <div
      className="absolute top-2 right-2 w-3 h-3 rounded-full border border-[#8a9aa6]"
      style={{ background: "radial-gradient(circle, #6b7f8a 30%, #a0b0ba 100%)" }}
      title="Mounting hole"
    />
    {/* Tag content */}
    <div className="relative z-10 flex flex-col gap-0.5">
      <span
        className="font-mono font-black tracking-widest leading-tight"
        style={{ fontSize: 18, color: "#1a2228", letterSpacing: "0.12em" }}
      >
        {assetNumber}
      </span>
      <span
        className="font-mono font-semibold tracking-wide"
        style={{ fontSize: 14, color: "#2c3a42" }}
      >
        {description}
      </span>
    </div>
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
                Format + Physical Design Specification · No QR Technology
              </p>
              <p className="text-xs text-muted-foreground/70 mt-3 italic border-l-2 border-primary/30 pl-3">
                Crushing Plant is excluded from this standard. Processing Plant only.
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
            This standard defines a simple, durable, and cost-effective physical tagging system for the Processing Plant.
            It is designed to be fabricable internally if required and robust for active mining conditions — with no reliance on QR technology.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Physical asset identity aligned to existing Processing asset tree",
              "Asset number matches Minesite AI system record exactly",
              "Simple enough to fabricate internally on demand",
              "Robust performance in dusty, wet, and corrosive conditions",
              "Eliminates informal handwritten or adhesive label practices",
              "Professional mining-specification identification standard",
            ].map((item, i) => (
              <RuleRow key={i}>{item}</RuleRow>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Tag Format */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Tag} number="2" title="Asset Tag Format — Processing Plant" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The tag number must mirror the asset record already configured in Minesite AI. No separate numbering scheme is introduced.
          </p>

          {/* Layout spec — Parent asset */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Parent Asset Tag Format</p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-1">
              <p className="font-extrabold text-foreground text-base tracking-wider">LINE 1 — FUNCTIONAL LOCATION</p>
              <p className="font-semibold text-foreground/80 text-sm">Line 2 — Equipment Description</p>
              <p className="text-muted-foreground text-xs">Line 3 (optional) — Processing Plant</p>
            </div>
            <div className="bg-muted/40 rounded-lg px-4 py-3 font-mono text-sm space-y-0.5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">Example</p>
              <p className="font-black text-foreground tracking-widest text-base">TCMG-COM-CV-02</p>
              <p className="font-semibold text-foreground/80">Gold Recovery Conveyor</p>
              <p className="text-muted-foreground text-xs">Processing Plant</p>
            </div>
          </div>

          <Separator />

          {/* Layout spec — Sub-asset */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Sub-Asset Tag Format</p>
            <p className="text-sm text-muted-foreground">
              Sub-assets append their component type suffix directly to the parent's functional location. The tag carries the full path so the relationship is self-evident from the tag alone.
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-1">
              <p className="font-extrabold text-foreground text-base tracking-wider">LINE 1 — PARENT FL + COMPONENT SUFFIX</p>
              <p className="font-semibold text-foreground/80 text-sm">Line 2 — Component Description</p>
              <p className="text-muted-foreground text-xs">Line 3 (optional) — Processing Plant</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { tag: "TCMG-COM-CV-02-MTR-01", desc: "Drive Motor" },
                { tag: "TCMG-COM-CV-02-GBX-01", desc: "Gearbox" },
                { tag: "TCMG-REC-TK-01-PNL-01", desc: "Control Panel" },
                { tag: "TCMG-UTL-PU-101-MTR-01", desc: "Pump Motor" },
              ].map((ex) => (
                <div key={ex.tag} className="flex flex-col gap-0.5 bg-muted/50 rounded-md px-3 py-2">
                  <code className="text-primary font-mono text-xs font-bold">{ex.tag}</code>
                  <span className="text-xs text-muted-foreground">{ex.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Parent asset examples */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Parent Asset Examples — Processing Plant</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { tag: "TCMG-COM-PU-101", desc: "Process Water Pump" },
                { tag: "TCMG-REC-CV-203", desc: "Gold Recovery Conveyor" },
                { tag: "TCMG-TAIL-PU-305", desc: "Tailings Pump 305" },
                { tag: "TCMG-UTL-TK-01", desc: "Utilities Tank 01" },
              ].map((ex) => (
                <div key={ex.tag} className="flex items-center gap-3 bg-muted/50 rounded-md px-3 py-2">
                  <code className="text-primary font-mono text-sm font-bold">{ex.tag}</code>
                  <span className="text-xs text-muted-foreground">{ex.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Format Rules</p>
            <RuleRow label="Exact match">Asset number on tag must match the Minesite AI system record exactly — no abbreviations</RuleRow>
            <RuleRow label="Sub-asset suffix">Sub-asset tags extend the parent FL — e.g. parent <code className="font-mono text-xs bg-muted px-1 rounded">TCMG-COM-CV-02</code> → motor <code className="font-mono text-xs bg-muted px-1 rounded">TCMG-COM-CV-02-MTR-01</code></RuleRow>
            <RuleRow label="No manual numbering">All asset numbers are system-generated — never assigned manually outside the system</RuleRow>
            <RuleRow label="No duplicates">System enforces uniqueness — no two tags may carry the same number</RuleRow>
          </div>

          {/* Segment table */}
          <div className="overflow-x-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Tag Segment Definitions</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Segment</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Example Value</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Site Code", "TCMG", "Tennant Creek Mining Gold — fixed for all tags"],
                  ["Area Code", "COM / REC / TAIL / UTL", "Area from configured hierarchy (Level 3)"],
                  ["Equipment Prefix", "PU / CV / TK / BM / GEN…", "Equipment type — must match hierarchy record"],
                  ["Sequential No.", "01 / 101 / 203…", "Assigned by system — not manually assigned"],
                  ["Component Suffix", "MTR-01 / GBX-01 / PNL-01…", "Sub-assets only — appended after parent FL with hyphen"],
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
              <RuleRow label="Material">316 Stainless Steel — corrosion and chemical resistant</RuleRow>
              <RuleRow label="Finish">Brushed finish — reduces glare and shows engraving clearly</RuleRow>
              <RuleRow label="Marking">Laser engraved — not printed, painted, or adhesive labelled</RuleRow>
              <RuleRow label="Grade">Industrial grade — rated for outdoor mining environments</RuleRow>
            </div>
          </div>

          <Separator />

          {/* Dimensions */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Dimensions</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Standard Size</p>
                <RuleRow label="Width">80 mm minimum</RuleRow>
                <RuleRow label="Height">30 mm minimum</RuleRow>
                <RuleRow label="Corners">Rounded — no sharp edges</RuleRow>
              </div>
              <div className="bg-muted/40 rounded-lg p-3 space-y-2">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide">Heavy Equipment Option</p>
                <RuleRow label="Width">100 mm</RuleRow>
                <RuleRow label="Height">40 mm</RuleRow>
                <RuleRow label="Use">Large rotating equipment, tanks, structural frames</RuleRow>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mounting options */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Mounting Options</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border border-border rounded-lg p-3 space-y-2">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">Option A</Badge> Adhesive Backed
                </p>
                <RuleRow>Industrial VHB adhesive backing</RuleRow>
                <RuleRow>Used on flat surfaces — panels, tanks, frames</RuleRow>
                <RuleRow>Suitable where drilling is not practical</RuleRow>
              </div>
              <div className="border border-border rounded-lg p-3 space-y-2">
                <p className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-1">
                  <Badge variant="outline" className="text-xs">Option B</Badge> Hole Punch
                </p>
                <RuleRow>5mm hole punched in one corner</RuleRow>
                <RuleRow>Cable tie or stainless ring mounting</RuleRow>
                <RuleRow>Used on pumps, motors, and moving equipment</RuleRow>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 italic pl-1">
              Mounting type is determined during installation — not pre-specified on order.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Visual Example */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Tag} number="4" title="Visual Tag Example — Rendered Mockup" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The following renders represent the approved tag appearance. Brushed 316 stainless, laser-engraved black lettering, no QR code.
            Asset number is visually dominant — larger and bolder than the description line.
          </p>

          <div className="flex flex-wrap gap-6 items-end py-2">
            {/* Parent asset */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Parent Asset — Standard 80mm × 30mm</p>
              <StainlessTagMockup
                assetNumber="TCMG-REC-CV-203"
                description="Gold Recovery Conveyor"
                plant="Processing Plant"
              />
            </div>
            {/* Sub-asset motor */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Sub-Asset (Motor) — Standard 80mm × 30mm</p>
              <StainlessTagMockup
                assetNumber="TCMG-REC-CV-203"
                description="MTR-01  Drive Motor"
                plant="Processing Plant"
              />
            </div>
            {/* Heavy equipment size */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Heavy Equipment — 100mm × 40mm</p>
              <div style={{ transform: "scale(1.18)", transformOrigin: "left bottom" }}>
                <StainlessTagMockup
                  assetNumber="TCMG-COM-PU-101"
                  description="Process Water Pump"
                  plant="Processing Plant"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-4 text-xs text-muted-foreground space-y-1 mt-2">
            <p className="font-semibold text-foreground text-xs uppercase tracking-widest mb-2">Mockup Notes</p>
            <p>• Brushed stainless gradient simulates actual brushed 316 SS surface texture</p>
            <p>• Mounting hole shown top-right corner (Option B configuration)</p>
            <p>• Asset number rendered bold and larger — approximately 20–30% bigger than description</p>
            <p>• No QR code — text-only format as per this standard</p>
            <p>• Actual engraved tags will have black-filled laser engraving on metal substrate</p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Font & Engraving Standard */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Type} number="5" title="Font & Engraving Standard" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-2">
            <RuleRow label="Font style">Sans-serif industrial font (e.g. Arial, DIN, or equivalent)</RuleRow>
            <RuleRow label="Asset number size">20–30% larger than description line — visually dominant</RuleRow>
            <RuleRow label="Minimum text height">3mm minimum for readability in dusty conditions</RuleRow>
            <RuleRow label="Engraving depth">Suitable for dusty environments — deep fill preferred for longevity</RuleRow>
            <RuleRow label="Case">Asset number: ALL CAPS · Description: Title Case</RuleRow>
            <RuleRow label="Spacing">Line spacing minimum 2mm between text lines</RuleRow>
          </div>
        </CardContent>
      </Card>

      {/* 6. Sub-Asset Tagging */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Layers} number="6" title="Sub-Asset Tagging Rules — Processing Plant" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A separate physical tag is required for any sub-asset individually registered in the Minesite AI hierarchy.
            Both the parent asset and sub-asset must be physically tagged if configured in the system.
          </p>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Sub-Assets Requiring Individual Tags</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                "Electric motors rated > 5 kW",
                "Gearboxes and gearmotors",
                "Lube units and hydraulic units",
                "Electrical panels and MCC sections",
                "PLC and control cabinets",
                "Critical standalone instrumentation (if in asset tree)",
              ].map((item, i) => <RuleRow key={i}>{item}</RuleRow>)}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Parent–Child Tag Structure</p>
            <p className="text-sm text-muted-foreground mb-3">
              The sub-asset tag is formed by appending the component type suffix to the parent's functional location. This makes the relationship self-evident from the tag itself.
            </p>
            <div className="space-y-3 font-mono text-sm bg-muted/40 rounded-lg p-4">
              {/* Conveyor example */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary flex-shrink-0">Parent</Badge>
                  <code className="text-foreground font-bold">TCMG-COM-CV-02</code>
                  <span className="text-xs text-muted-foreground">Gold Recovery Conveyor</span>
                </div>
                <div className="ml-6 space-y-1.5 border-l-2 border-primary/20 pl-4">
                  {[
                    { tag: "TCMG-COM-CV-02", desc: "MTR-01  Drive Motor" },
                    { tag: "TCMG-COM-CV-02", desc: "GBX-01  Gearbox" },
                    { tag: "TCMG-COM-CV-02", desc: "PNL-01  Control Panel" },
                  ].map(({ tag, desc }) => (
                    <div key={desc} className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Sub</Badge>
                      <code className="text-foreground text-xs">{tag}</code>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Pump example */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline" className="text-xs border-primary/30 text-primary flex-shrink-0">Parent</Badge>
                  <code className="text-foreground font-bold">TCMG-UTL-PU-101</code>
                  <span className="text-xs text-muted-foreground">Process Water Pump</span>
                </div>
                <div className="ml-6 space-y-1.5 border-l-2 border-primary/20 pl-4">
                  {[
                    { tag: "TCMG-UTL-PU-101", desc: "MTR-01  Drive Motor" },
                  ].map(({ tag, desc }) => (
                    <div key={desc} className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs flex-shrink-0">Sub</Badge>
                      <code className="text-foreground text-xs">{tag}</code>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Suffix reference table */}
            <div className="mt-4 overflow-x-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Approved Component Suffix Codes</p>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Suffix</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Component Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["MTR-01", "Electric motor"],
                    ["GBX-01", "Gearbox / gearmotor"],
                    ["PNL-01", "Electrical panel / MCC section"],
                    ["PLC-01", "PLC / control cabinet"],
                    ["LUB-01", "Lube unit"],
                    ["HYD-01", "Hydraulic unit"],
                    ["INS-01", "Critical standalone instrument"],
                  ].map(([suffix, type]) => (
                    <tr key={suffix} className="hover:bg-muted/30">
                      <td className="px-3 py-2 font-mono text-xs font-bold text-primary">{suffix}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7. Placement Rules */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={MapPin} number="7" title="Tag Placement Standard — Processing Plant" />
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
                  ["Electrical panels", "Front exterior door — secondary internal sticker on interior panel"],
                  ["Motors", "Non-drive end frame — avoid cooling fin obstruction"],
                  ["Gearboxes", "Oil filler or inspection side — avoid hot surfaces"],
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
            <RuleRow>Tag must not obstruct maintenance access or create a pinch or crush hazard</RuleRow>
            <div className="mt-1">
              <WarningRow>Must not be mounted on removable guards or covers — tag remains with the asset permanently</WarningRow>
              <WarningRow>Must not be positioned where abrasion, heat, or chemical spray will degrade the engraving over time</WarningRow>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 8. Manufacturing Options */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Factory} number="8" title="Manufacturing Options" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two feasible manufacturing approaches are outlined below. No recommendation is made at this stage — options are presented for decision by site management.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Option 1 */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">Option 1</Badge>
                <p className="text-sm font-bold text-foreground">Outsource</p>
              </div>
              <p className="text-xs text-muted-foreground">Pre-engraved stainless tags ordered in batches from a specialist tag supplier.</p>
              <Separator />
              <div className="space-y-1">
                <RuleRow>No capital equipment purchase required</RuleRow>
                <RuleRow>Professional finish guaranteed</RuleRow>
                <RuleRow>Higher per-unit cost at low volumes</RuleRow>
                <RuleRow>Lead time delays for new or urgent tags</RuleRow>
              </div>
            </div>

            {/* Option 2 */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">Option 2</Badge>
                <p className="text-sm font-bold text-foreground">In-House Engraving</p>
              </div>
              <p className="text-xs text-muted-foreground">Purchase a portable laser engraver or metal tag machine for on-demand production.</p>
              <Separator />
              <div className="space-y-1">
                <RuleRow>Lower long-term cost per tag</RuleRow>
                <RuleRow>On-demand tag creation — no lead time</RuleRow>
                <RuleRow>Faster asset commissioning process</RuleRow>
                <RuleRow>Capital purchase and operator training required</RuleRow>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-3">
            A recommendation will be made following review of tag volume requirements and budget approval. This section is for awareness only.
          </p>
        </CardContent>
      </Card>

      {/* 9. Governance */}
      <Card className="border-destructive/20">
        <CardHeader className="pb-2">
          <SectionHeading icon={Shield} number="9" title="Governance Controls" />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The following governance controls are mandatory for all Processing Plant assets. No exceptions without formal change control.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <RuleRow>No asset installed or commissioned without a physical tag</RuleRow>
            <RuleRow>No physical tag created without an existing asset record in the system</RuleRow>
            <RuleRow>No duplicate asset numbers permitted — enforced by system</RuleRow>
            <RuleRow>Damaged or missing tags must be replaced immediately upon identification</RuleRow>
            <RuleRow>Tag replacement must be recorded in the asset's work order history</RuleRow>
            <RuleRow>Any change to asset number requires formal change control and hierarchy update</RuleRow>
          </div>
          <Separator />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Prohibited Practices</p>
            <WarningRow>Temporary handwritten tags are not permitted beyond the commissioning period (max 48 hours)</WarningRow>
            <WarningRow>Adhesive paper or plastic labels are not acceptable as a permanent tagging solution</WarningRow>
            <WarningRow>Tags must not be created outside the system — all tags originate from a validated system record</WarningRow>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>TCMG-STD-TAG-001 · Processing Plant Asset Tagging Standard · Rev 2.0 — No QR</span>
        <span>Crushing Plant excluded · Internal use only</span>
      </div>
    </div>
  );
};
