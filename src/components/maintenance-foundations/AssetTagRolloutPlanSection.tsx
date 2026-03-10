import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Factory,
  Shield,
  Calendar,
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
} from "lucide-react";
import { PidTaggedAssetRegister } from "./PidTaggedAssetRegister";
import { AssetTagProductionList } from "./AssetTagProductionList";

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
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-5 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Processing Plant – Asset Tag Rollout Plan
                </h2>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl">
                Structured implementation plan for physical asset tagging across the processing plant.
                Aligned with the rebuilt asset tree and P&ID extraction register.
              </p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <Badge variant="outline" className="text-xs font-mono">TCMG-ROLLOUT-001</Badge>
              <Badge variant="outline" className="text-xs font-mono">Rev 2.0</Badge>
              <Badge className="text-xs bg-amber-500 text-white">Processing Plant Only</Badge>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
            <p className="text-xs text-amber-800 font-medium">
              ⚠ Scope Notice: This rollout plan applies to the Processing Plant ONLY. The Crushing Plant is excluded until P&IDs are finalised and approved.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 01. Tagging Criteria */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={FileText} number="01" title="Tagging Criteria" />
          <p className="text-sm text-muted-foreground mb-3">
            Physical asset tags are issued exclusively to equipment that has a linked P&ID equipment tag.
            This ensures every tag has a verified engineering reference and eliminates uncontrolled tagging.
          </p>
          <div className="space-y-0.5">
            <CheckItem>Only assets with a linked P&ID tag number will receive a physical asset tag</CheckItem>
            <CheckItem>Assets without P&ID references are excluded from the tagging program</CheckItem>
            <CheckItem>Tag numbers must match the asset number used in the asset register and P&ID — no independent numbering systems permitted</CheckItem>
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

      {/* 02. Tag Mounting Philosophy */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="02" title="Tag Mounting Philosophy" />
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
          <div className="mt-4 bg-primary/5 border border-primary/20 rounded-md px-3 py-2">
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground">
                <strong>Rationale:</strong> When a pump is replaced, the P&ID position remains the same. The tag identifies
                <em> where</em> the equipment connects to the process — not <em>which</em> specific unit is installed.
                This eliminates re-tagging after every equipment changeout.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 03. Tag Categories */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Layers} number="03" title="Tag Categories" />
          <p className="text-sm text-muted-foreground mb-4">
            Two tag types are used to distinguish between fixed infrastructure and equipment positions.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Type A */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Type A – Major Asset Plates</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Flat plate with <strong>no hole</strong>. Permanently mounted to large fixed infrastructure using adhesive or rivets.
                </p>
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Examples</p>
                  <div className="flex flex-wrap gap-1">
                    {["Tanks", "Conveyors", "Crushers", "Mills", "Thickeners", "Hoppers", "Chutes", "Cyclone Clusters", "Filter Presses", "Air Receivers", "Buildings", "Major Structures"].map((item) => (
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
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Type B – Equipment Position Tags</span>
                </div>
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
                    <strong>Mounting:</strong> Bolt or cable tie to adjacent steelwork, pipe support, baseplate or skid frame — never on the equipment itself.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* 04. Tag Material Options */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Package} number="04" title="Tag Material Options" />
          <p className="text-sm text-muted-foreground mb-4">
            Two material options have been quoted. Final selection must be locked before tag manufacturing begins.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">Specification</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-primary uppercase tracking-wide border border-border">Option 1 — 316 Stainless Steel</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">Option 2 — DuraBlack</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Type A Size (Major Assets)", "100mm × 50mm × 1.5mm", "100mm × 40mm × 0.5mm"],
                  ["Type B Size (Position Tags)", "70mm × 25mm × 1.5mm", "80mm × 30mm × 0.5mm"],
                  ["Material", "316 Stainless Steel – engraved", "DuraBlack – laser etched"],
                  ["Price Estimate", "$7.20 per tag (500+ order)", "$4.65 per tag (500+ order)"],
                  ["Durability", "Excellent — 10+ year lifespan, chemical resistant", "Very Good — UV/oil resistant, 5–8 years outdoor"],
                  ["Legibility", "Engraved text — permanent, high contrast", "Laser etched — high contrast black/white"],
                  ["Weight", "Heavier — solid plate", "Lighter — thin profile"],
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
              <strong>Supplier:</strong> Trophy Central Alice Springs — quote provided for both options at 500+ quantity pricing.
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

      {/* 05. Asset Tag Production Options */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Factory} number="05" title="Asset Tag Production Options" />
          <p className="text-sm text-muted-foreground mb-4">
            Management may choose between outsourcing tag production to a specialist supplier or purchasing equipment for internal on-demand production.
            Both approaches are viable — the decision should be based on budget, volume, and long-term operational flexibility.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Option 1 — Outsource */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Option 1 – Outsource Tag Production</span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Supplier</p>
                  <p className="text-sm text-foreground font-medium">Trophy Central – Alice Springs</p>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Material Options</p>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-[10px]">Stainless Steel</Badge>
                    <Badge variant="outline" className="text-[10px]">DuraBlack</Badge>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Pricing Estimate (500+ qty)</p>
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

            {/* Option 2 — In-House */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="py-4 px-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wide">Option 2 – In-House Tag Production</span>
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
                    gravotech.com.au — LS100 Laser Engraver
                  </a>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Machine Capability</p>
                  <div className="space-y-0.5">
                    <CheckItem>CO₂ laser engraver and cutter</CheckItem>
                    <CheckItem>Suitable for asset tags and industrial signage</CheckItem>
                    <CheckItem>Able to engrave stainless plates and laminates</CheckItem>
                    <CheckItem>Allows on-demand tag production</CheckItem>
                  </div>
                </div>

                <Separator />

                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider">Pros</p>
                  <CheckItem>Immediate production of tags — no supplier lead time</CheckItem>
                  <CheckItem>Ability to create tags when new assets are installed</CheckItem>
                  <CheckItem>Can produce additional labels and signage for site</CheckItem>
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
                <strong>Management Decision:</strong> Either option delivers the required outcome. Outsourcing is the lowest-risk path for the initial
                batch. In-house production becomes cost-effective if the site anticipates ongoing tag requirements for new assets, replacements,
                and general industrial signage. A hybrid approach — outsource the first batch, then transition to in-house — is also viable.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 06. Tag Numbering */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Hash} number="06" title="Tag Numbering" />
          <p className="text-sm text-muted-foreground mb-3">
            Tag numbers are derived directly from the asset register. No independent numbering systems are permitted.
          </p>
          <div className="space-y-0.5">
            <CheckItem>Tag number = Asset Number from the approved asset register (e.g. BM01, CFP01-PA01, THYD01-PMP01)</CheckItem>
            <CheckItem>The P&ID tag is shown as a secondary reference where space permits</CheckItem>
            <CheckItem>No site-local numbering, ad-hoc labels, or sequential tag numbers</CheckItem>
            <CheckItem>If an asset is renumbered in the register, the physical tag must be replaced</CheckItem>
          </div>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
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

      {/* 06. Tag Installation Workflow */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Wrench} number="07" title="Tag Installation Workflow" />
          <p className="text-sm text-muted-foreground mb-3">
            Follow this five-step workflow. Each step must be completed before proceeding to the next.
          </p>
          <div className="space-y-0.5">
            <StepItem step={1}>
              <strong>Generate P&ID Asset Register</strong> — Extract all assets with linked P&ID tags from the database.
              This produces the "P&ID Tagged Asset Register – Tennant Creek" (see Section 12 below).
            </StepItem>
            <StepItem step={2}>
              <strong>Produce Tag Production List</strong> — Classify each asset as Type A or Type B.
              Determine mounting location and method for each tag. Generate quantities for the manufacturing order (see Section 13 below).
            </StepItem>
            <StepItem step={3}>
              <strong>Manufacture Tags</strong> — Submit production list to tag supplier.
              Confirm material, size, and engraving/etching specifications per Section 04.
            </StepItem>
            <StepItem step={4}>
              <strong>Install Tags During Field Verification</strong> — Walk down each area with the production list.
              Verify equipment exists at the P&ID position. Clean mounting surface. Install tag on fixed structure.
              Photograph installed tag showing Asset ID and surrounding context.
            </StepItem>
            <StepItem step={5}>
              <strong>Update Asset Record</strong> — Mark asset status as "Tagged – Verified" in the asset register.
              Upload confirmation photo linked to the asset record.
            </StepItem>
          </div>
          <div className="mt-3 bg-muted/40 rounded-md px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Critical Rule</p>
            <p className="text-xs text-foreground">
              No tag shall be applied without a matching system record and confirmed P&ID reference.
              If the asset is not in the register or has no P&ID tag, <strong>stop — do not tag</strong>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 07. Pre-Rollout Gate */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="08" title="Pre-Rollout Requirements — Gate 1" />
          <p className="text-sm text-muted-foreground mb-3">
            All items below must be confirmed and signed off before any physical tagging commences.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            {[
              "Final approved Processing Plant asset tree exported and locked",
              "P&IDs reviewed and validated against asset tree (14-page set verified)",
              "Asset IDs frozen — no renumbering permitted during rollout",
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

      {/* 08. Quality Control */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={CheckCircle2} number="09" title="Quality Control" />
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            {[
              "Maintenance supervisor sign-off required per area before proceeding to next zone",
              "Random audit of minimum 10% of tagged assets per area",
              "Cross-check all tags installed against the P&ID Tagged Asset Register",
              "Confirm zero duplicated Asset IDs across all tagged positions",
              "Confirm no assets on the production list are missing a physical tag",
              "Photo evidence reviewed and linked to system record for audited assets",
              "Verify tags are mounted on fixed structure — not on replaceable equipment",
              "Confirm tag text matches asset register exactly (no abbreviations or variations)",
            ].map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 09. Safety */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="10" title="Safety Considerations" />
          <div className="space-y-0.5">
            <WarnItem>Apply LOTO (Lockout/Tagout) before tagging any asset near rotating or energised equipment</WarnItem>
            <WarnItem>No tagging during active plant operation unless the asset and access point are confirmed safe</WarnItem>
            <WarnItem>PPE requirements: Safety glasses, gloves, steel cap boots, high-vis vest at all times in processing area</WarnItem>
            <WarnItem>Ladder use must comply with site ladder management procedure — two-person rule applies</WarnItem>
            <WarnItem>Do not tag hot surfaces — allow equipment to cool before working in proximity</WarnItem>
            <WarnItem>Chemical areas (reagents, cyanide) — wear chemical-resistant gloves and face shield</WarnItem>
          </div>
        </CardContent>
      </Card>

      {/* 10. Deliverables */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Camera} number="10" title="Completion Deliverables" />
          <p className="text-sm text-muted-foreground mb-3">
            The following must be produced and filed upon rollout completion.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            <CheckItem>Tagged Asset Register — full list of every tagged asset with ID, description, location, and photo reference</CheckItem>
            <CheckItem>Completion Report — summary of tag counts, discrepancies resolved, QC audit results</CheckItem>
            <CheckItem>Before/After photo archive — organised by area</CheckItem>
            <CheckItem>Updated asset tree status — all tagged assets marked as "Tagged – Verified" in system</CheckItem>
            <CheckItem>Signed close-out sheets for each area</CheckItem>
            <CheckItem>Outstanding items list — any deferred assets with justification and target completion date</CheckItem>
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
                The physical tag is for rapid visual identification only. Tag numbers match the asset register — no independent
                numbering systems exist. The tag rollout does not define or alter any system hierarchy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 11. P&ID Tagged Asset Register */}
      <PidTaggedAssetRegister />

      {/* 12. Asset Tag Production List */}
      <AssetTagProductionList />

      {/* Scope reminder */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200">
        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-800">
          <strong>Scope:</strong> Processing Plant ONLY. Crushing Plant excluded until P&IDs are finalised.
          Do not apply this rollout plan to crushing or mining equipment.
        </p>
      </div>
    </div>
  );
};
