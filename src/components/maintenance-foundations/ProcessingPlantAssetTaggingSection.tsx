import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tag,
  Shield,
  MapPin,
  Settings,
  AlertTriangle,
  CheckCircle2,
  FileText,
  
  Factory,
  Database,
  Ruler,
} from "lucide-react";


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

// ─── Simplified Tag Mockup ────────────────────────────────────────────────────
// Shows ONLY Asset ID (large) + Description (smaller). Nothing else.
const SimplifiedTagMockup = ({
  assetId,
  description,
  size = "standard",
  holePosition = "right",
}: {
  assetId: string;
  description: string;
  size?: "standard" | "small" | "large";
  holePosition?: "right" | "left" | "none";
}) => {
  const dims = {
    standard: { w: 300, h: 90, idSize: 28, descSize: 13 },
    small:    { w: 240, h: 72, idSize: 22, descSize: 11 },
    large:    { w: 340, h: 110, idSize: 34, descSize: 14 },
  }[size];

  return (
    <div
      className="relative inline-flex flex-col justify-center items-center rounded-md select-none"
      style={{
        width: dims.w,
        height: dims.h,
        background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 45%, #ececec 70%, #e0e0e0 100%)",
        boxShadow:
          "0 3px 10px 0 rgba(0,0,0,0.18), inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -1px 2px rgba(0,0,0,0.06)",
        border: "1.5px solid #c8c8c8",
      }}
    >
      {/* Subtle horizontal line texture */}
      <div
        className="absolute inset-0 rounded-md pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 4px)",
        }}
      />

      {/* Mounting hole */}
      {holePosition !== "none" && (
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-[#aaa]"
          style={{
            [holePosition === "right" ? "right" : "left"]: 10,
            background: "radial-gradient(circle, #888 20%, #ccc 100%)",
          }}
          title="Hole punch for ring / cable-tie mounting"
        />
      )}

      {/* Tag content — centred */}
      <div className="relative z-10 flex flex-col items-center gap-0.5 px-10 text-center">
        {/* Asset ID — large and bold */}
        <span
          className="font-mono font-black tracking-widest leading-none"
          style={{ fontSize: dims.idSize, color: "#111", letterSpacing: "0.1em" }}
        >
          {assetId}
        </span>
        {/* Description — smaller */}
        <span
          className="font-sans font-semibold tracking-wide uppercase leading-tight"
          style={{ fontSize: dims.descSize, color: "#333" }}
        >
          {description}
        </span>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ProcessingPlantAssetTaggingSection = () => {
  

  return (
    <div className="space-y-6 max-w-5xl">

      {/* ── Title Block ── */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs font-mono border-primary/40 text-primary">TCMG-STD-TAG-002</Badge>
                <Badge className="text-xs bg-primary text-primary-foreground">Processing Plant Only</Badge>
                <Badge variant="secondary" className="text-xs">Simplified Format | Rev 1.0</Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">
                Processing Plant | Asset Tagging Standard
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Simplified ID Format · Asset ID Only · No QR · No Functional Location on Tag
              </p>
              <p className="text-xs text-muted-foreground/70 mt-3 italic border-l-2 border-primary/30 pl-3">
                Crushing Plant is excluded from this standard. Processing Plant assets only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 1. Purpose ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={FileText} number="1" title="Purpose" />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This standard defines a simple, durable physical tagging system for Processing Plant assets.
            The physical tag carries only the Asset ID, nothing else. All hierarchy, functional location
            codes, area structures, and system data are stored in Minesite AI, not on the tag.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Rapid visual identification from Asset ID alone",
              "Asset ID matches the existing asset tree exactly, no new numbering",
              "No functional location codes, area codes, or system strings on the tag",
              "Eliminates cluttered, hard-to-read tag formats",
              "Simple enough to produce internally or order externally on demand",
              "Robust performance in dusty, wet, and corrosive mining conditions",
            ].map((item, i) => (
              <RuleRow key={i}>{item}</RuleRow>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── 2. Tag Format ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Tag} number="2" title="Tag Format | Asset ID Only" />
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-muted-foreground">
            The physical tag displays <strong>two lines only</strong>: the Asset ID (large, bold) and the equipment
            description (smaller). No functional location, no area code, no system string, no QR code.
          </p>

          {/* Format template */}
          <div className="bg-muted rounded-lg p-5 font-mono space-y-1 text-center">
            <p className="text-2xl font-black text-foreground tracking-widest">BM01</p>
            <p className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">Primary Ball Mill</p>
            <p className="text-xs text-muted-foreground mt-3">← That is the entire tag. Nothing else.</p>
          </div>

          <Separator />

          {/* Example asset IDs — all sourced directly from Processing Plant asset tree */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Tag Format Examples | Processing Plant Asset Tree</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { id: "BM01",    desc: "Primary Ball Mill" },
                { id: "MFC01",   desc: "Mill Feed Conveyor" },
                { id: "CYFPA01", desc: "Primary Cyclone Feed Pump A" },
                { id: "CV01",    desc: "Transfer Conveyor" },
                { id: "CMIX01",  desc: "Cyanide Mixing Tank" },
                { id: "EWCL01",  desc: "Electrowinning Cell" },
                { id: "FLOC01",  desc: "Floc System" },
                { id: "LDOS01",  desc: "Lime Dosing System" },
              ].map(({ id, desc }) => (
                <div key={id} className="flex items-center gap-3 bg-muted/50 rounded-md px-3 py-2">
                  <code className="text-primary font-mono text-base font-black tracking-widest min-w-[56px]">{id}</code>
                  <span className="text-xs text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Format Rules</p>
            <RuleRow label="Asset ID source">Use the Asset ID already assigned in the asset tree. Do not create new numbers</RuleRow>
            <RuleRow label="No extra data">Functional location, area code, system strings: none of these appear on the physical tag</RuleRow>
            <RuleRow label="Two lines only">Line 1 = Asset ID (large bold) · Line 2 = Short equipment description (smaller)</RuleRow>
            <RuleRow label="Exact match">Asset ID on tag must match Minesite AI system record exactly</RuleRow>
            <RuleRow label="All hierarchy in system">All hierarchy, FL codes, and area structure remain in Minesite AI only</RuleRow>
          </div>
        </CardContent>
      </Card>

      {/* ── 3. Physical Tag Design Specification ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Settings} number="3" title="Physical Tag Design Specification" />
        </CardHeader>
        <CardContent className="space-y-5">

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Material & Marking</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <RuleRow label="Material">Laser-engraved industrial label or printed industrial label</RuleRow>
              <RuleRow label="Background">White or silver, high contrast for readability</RuleRow>
              <RuleRow label="Font">Bold black sans-serif, minimum 20 mm text height for Asset ID</RuleRow>
              <RuleRow label="Finish">Oil-resistant, dust-resistant, UV-resistant coating</RuleRow>
              <RuleRow label="Backing">Industrial adhesive backing, permanent mounting</RuleRow>
              <RuleRow label="Optional">Single hole punch on one end for ring or cable-tie attachment</RuleRow>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">What Appears on the Tag</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/60">
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Line</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Content</th>
                    <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Style</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ["Line 1", "Asset ID (e.g. CR01, CV01, PP01)", "Large · Bold · ALL CAPS · dominant size"],
                    ["Line 2", "Short equipment description", "Smaller · Semibold · UPPERCASE"],
                    ["Line 3+", "NOTHING", "No FL codes, no QR, no area, no system strings"],
                  ].map(([line, content, style]) => (
                    <tr key={line} className="hover:bg-muted/30">
                      <td className="px-3 py-2 font-mono text-xs font-bold text-primary">{line}</td>
                      <td className="px-3 py-2 text-xs text-foreground">{content}</td>
                      <td className="px-3 py-2 text-xs text-muted-foreground">{style}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 4. Visual Tag Mockups ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Tag} number="4" title="Visual Tag Examples | Rendered Mockups" />
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">
            The following renders show the approved simplified tag layout. Asset ID is large and dominant.
            Description below in smaller text. Nothing else on the tag.
          </p>

          {/* Standard size examples — flat surface large equipment */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Flat Surface | 100mm × 50mm Plate (Standard)</p>
            <p className="text-xs text-muted-foreground">e.g. Ball Mill, Cyanide Tank, Electrowinning Cell</p>
            <div className="flex flex-wrap gap-6 items-center py-2">
              <SimplifiedTagMockup assetId="BM01" description="Primary Ball Mill" size="standard" holePosition="none" />
              <SimplifiedTagMockup assetId="CMIX01" description="Cyanide Mixing Tank" size="standard" holePosition="none" />
              <SimplifiedTagMockup assetId="EWCL01" description="Electrowinning Cell" size="standard" holePosition="none" />
            </div>
          </div>

          <Separator />

          {/* Small label examples — instruments, valves, sensors */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Small Assets — 80mm × 30mm Label</p>
            <p className="text-xs text-muted-foreground">e.g. Dosing systems, ancillary equipment, instruments</p>
            <div className="flex flex-wrap gap-6 items-center py-2">
              <SimplifiedTagMockup assetId="LDOS01" description="Lime Dosing System" size="small" holePosition="none" />
              <SimplifiedTagMockup assetId="FLOC01" description="Floc System" size="small" holePosition="none" />
            </div>
          </div>

          <Separator />

          {/* Hanging tags — pumps / motors with hole punch */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Hanging Assets (Pumps / Motors) — 100mm × 50mm with Single Hole Punch</p>
            <p className="text-xs text-muted-foreground">e.g. Cyclone feed pumps, conveyors, raw water pumps</p>
            <div className="flex flex-wrap gap-6 items-center py-2">
              <SimplifiedTagMockup assetId="CYFPA01" description="Primary Cyclone Feed Pump A" size="large" holePosition="right" />
              <SimplifiedTagMockup assetId="MFC01" description="Mill Feed Conveyor" size="large" holePosition="none" />
              <SimplifiedTagMockup assetId="RWT01" description="Raw Water Tank" size="large" holePosition="left" />
            </div>
          </div>

          <div className="bg-muted/40 rounded-lg p-4 text-xs text-muted-foreground space-y-1 mt-2">
            <p className="font-semibold text-foreground text-xs uppercase tracking-widest mb-2">Mockup Notes</p>
            <p>• White/silver background with bold black text, high contrast for dusty mining conditions</p>
            <p>• Asset ID rendered at minimum 20mm text height, readable at arm's length</p>
            <p>• Hole punch shown on one end, used for ring or cable-tie hanging attachment</p>
            <p>• No QR code, no functional location, no area code. Asset ID and description only</p>
            <p>• Actual tags: laser engraved or printed industrial label with UV/oil/dust-resistant coating</p>
          </div>
        </CardContent>
      </Card>

      {/* ── 5. Tag Sizes ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Ruler} number="5" title="Tag Sizes" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">Size A</Badge>
                <p className="text-sm font-bold text-foreground">Flat Surface</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono font-bold">100mm × 50mm Plate</p>
              <Separator />
              <RuleRow>Panels, tanks, frames, conveyor structure</RuleRow>
              <RuleRow>Adhesive or bolt-mounted</RuleRow>
              <RuleRow>Standard for most equipment</RuleRow>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">Size B</Badge>
                <p className="text-sm font-bold text-foreground">Small Assets</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono font-bold">80mm × 30mm Label</p>
              <Separator />
              <RuleRow>Small instruments, valves, sensors</RuleRow>
              <RuleRow>Adhesive backed</RuleRow>
              <RuleRow>Where space is limited</RuleRow>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">Size C</Badge>
                <p className="text-sm font-bold text-foreground">Hanging Assets</p>
              </div>
              <p className="text-xs text-muted-foreground font-mono font-bold">100mm × 50mm + Hole Punch</p>
              <Separator />
              <RuleRow>Pumps, motors, hanging equipment</RuleRow>
              <RuleRow>Single hole punch, ring or cable-tie</RuleRow>
              <RuleRow>Tag hangs from frame or stud</RuleRow>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 6. Placement Rules ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={MapPin} number="6" title="Placement Rules | Processing Plant" />
        </CardHeader>
        <CardContent className="space-y-4">

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">General Placement Rules | All Equipment</p>
            <div className="grid sm:grid-cols-2 gap-1">
              <RuleRow>Mount at eye level where possible</RuleRow>
              <RuleRow>Mount on non-wear surfaces only</RuleRow>
              <RuleRow>Tag must be visible during normal operation without removing guards</RuleRow>
              <RuleRow>Do not mount on removable guards or covers</RuleRow>
              <RuleRow>Do not mount on vibration-critical points</RuleRow>
              <RuleRow>Do not mount on hot surfaces. Tag must remain legible</RuleRow>
            </div>
            <div className="mt-2">
              <WarningRow>Must NOT be mounted on removable guards or covers. Tag must remain with the asset permanently</WarningRow>
              <WarningRow>Must NOT be positioned where abrasion, heat, or chemical spray will degrade the tag over time</WarningRow>
            </div>
          </div>

          <Separator />

          <div className="overflow-x-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Placement by Equipment Type</p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/60">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Equipment Type</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Placement Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Motors",     "Mount on frame side, non-drive end. Avoid cooling fins"],
                  ["Pumps",      "Mount on base frame, discharge side. Not on removable guards"],
                  ["Conveyors",  "Drive side near motor, 1.0 to 1.5 m above ground. Not on belt guards"],
                  ["Screens",    "Structural frame near drive side, eye level where accessible"],
                  ["Tanks",      "Near manway or ladder access point, eye level where possible"],
                  ["Electrical panels", "Front exterior door, eye level"],
                  ["Gearboxes",  "Oil filler or inspection side. Avoid hot surfaces"],
                  ["Crushers",   "Main frame structural section, non-wear, non-impact area"],
                ].map(([type, placement]) => (
                  <tr key={type} className="hover:bg-muted/30">
                    <td className="px-3 py-2 text-sm font-semibold text-foreground">{type}</td>
                    <td className="px-3 py-2 text-sm text-muted-foreground">{placement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── 7. Manufacturing Options ── */}
      <Card>
        <CardHeader className="pb-2">
          <SectionHeading icon={Factory} number="7" title="Manufacturing Options" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Two feasible manufacturing approaches are outlined below. Simplified tag format reduces cost and complexity for either option.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">Option 1</Badge>
                <p className="text-sm font-bold text-foreground">Outsource</p>
              </div>
              <p className="text-xs text-muted-foreground">Pre-printed or laser-engraved tags ordered in batches from a specialist tag supplier.</p>
              <Separator />
              <div className="space-y-1">
                <RuleRow>Professional finish guaranteed</RuleRow>
                <RuleRow>No capital equipment required</RuleRow>
                <RuleRow>Higher per-unit cost at low volumes</RuleRow>
                <RuleRow>Lead time delays for urgent or new tags</RuleRow>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">Option 2</Badge>
                <p className="text-sm font-bold text-foreground">In-House Production</p>
              </div>
              <p className="text-xs text-muted-foreground">Portable label printer or laser engraver for on-demand production at site.</p>
              <Separator />
              <div className="space-y-1">
                <RuleRow>On-demand, no lead time</RuleRow>
                <RuleRow>Lower long-term cost per tag</RuleRow>
                <RuleRow>Simplified format reduces operator skill requirement</RuleRow>
                <RuleRow>Capital purchase and training required</RuleRow>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── 8. System Alignment Note ── */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <SectionHeading icon={Database} number="8" title="System Alignment Note" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-card border border-primary/20 rounded-lg p-5 text-sm text-foreground leading-relaxed italic">
            "All asset hierarchy, functional locations, and system structure will be stored within Minesite AI.
            The physical tag is for rapid visual identification only."
          </div>
          <p className="text-sm text-muted-foreground">
            The physical tag is a field identification tool, not a data carrier. Scanning, searching, or
            querying asset data is performed in Minesite AI using the Asset ID. The tag simply confirms
            which physical asset you are standing in front of.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <RuleRow label="Tag carries">Asset ID + Short Description only</RuleRow>
            <RuleRow label="System carries">Full hierarchy · FL codes · Area structure · System data · Maintenance history</RuleRow>
            <RuleRow label="Lookup method">Search by Asset ID in Minesite AI to retrieve all related data</RuleRow>
            <RuleRow label="No data on tag">No QR code, no barcode, no NFC — text-only format</RuleRow>
          </div>
        </CardContent>
      </Card>

      {/* ── 9. Governance ── */}
      <Card className="border-destructive/20">
        <CardHeader className="pb-2">
          <SectionHeading icon={Shield} number="9" title="Governance Controls" />
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The following governance controls are mandatory for all Processing Plant assets.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            <RuleRow>No asset installed or commissioned without a physical tag</RuleRow>
            <RuleRow>No physical tag created without an existing asset record in Minesite AI</RuleRow>
            <RuleRow>Asset ID on tag must match the system record exactly</RuleRow>
            <RuleRow>Damaged or missing tags must be replaced immediately</RuleRow>
            <RuleRow>Tag replacement must be recorded in the asset's work order history</RuleRow>
            <RuleRow>Any change to Asset ID requires formal change control and hierarchy update</RuleRow>
          </div>
          <Separator />
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Prohibited Practices</p>
            <WarningRow>Temporary handwritten tags are not permitted beyond commissioning period (max 48 hours)</WarningRow>
            <WarningRow>Adhesive paper or plastic labels are not acceptable as a permanent tagging solution</WarningRow>
            <WarningRow>Tags must not be created outside the system — all Asset IDs originate from a validated Minesite AI record</WarningRow>
            <WarningRow>Functional location codes, area codes, or system strings must NOT be printed on physical tags</WarningRow>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
        <span>TCMG-STD-TAG-002 · Processing Plant Asset Tagging Standard | Simplified Format · Rev 1.0</span>
        <span>Crushing Plant excluded · Internal use only</span>
      </div>
    </div>
  );
};
