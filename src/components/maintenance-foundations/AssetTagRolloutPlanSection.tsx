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
  Users,
  Wrench,
  FileText,
  ChevronRight,
  Package,
} from "lucide-react";
import { PidTaggedAssetRegister } from "./PidTaggedAssetRegister";

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

const phaseStyles: Record<number, { border: string; badge: string }> = {
  1: { border: "border-l-destructive", badge: "bg-destructive text-destructive-foreground" },
  2: { border: "border-l-yellow-500", badge: "bg-yellow-500 text-white" },
  3: { border: "border-l-green-500", badge: "bg-green-500 text-white" },
};

interface PhaseCardProps {
  phase: number;
  title: string;
  items: string[];
  area: string;
  tagCount: string;
  labourHours: string;
  responsible: string;
}

const PhaseCard = ({ phase, title, items, area, tagCount, labourHours, responsible }: PhaseCardProps) => {
  const styles = phaseStyles[phase] ?? phaseStyles[1];
  return (
  <Card className={`border-l-4 ${styles.border}`}>
    <CardHeader className="pb-2 pt-4 px-4">
      <div className="flex items-center gap-2">
        <Badge className={`text-xs ${styles.badge}`}>
          Phase {phase}
        </Badge>
        <span className="font-bold text-sm text-foreground">{title}</span>
      </div>
    </CardHeader>
    <CardContent className="px-4 pb-4 space-y-3">
      <div className="flex flex-wrap gap-1">
        {items.map((item) => (
          <Badge key={item} variant="outline" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
      <Separator />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Area: </span>
          <span className="font-semibold">{area}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Est. Tags: </span>
          <span className="font-semibold">{tagCount}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Labour Est.: </span>
          <span className="font-semibold">{labourHours}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Responsible: </span>
          <span className="font-semibold">{responsible}</span>
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

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
                Structured implementation sequence for physical asset tagging across the processing plant.
                This plan governs the controlled, accurate, and complete rollout aligned with the approved asset tree.
              </p>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <Badge variant="outline" className="text-xs font-mono">TCMG-ROLLOUT-001</Badge>
              <Badge variant="outline" className="text-xs font-mono">Rev 1.0</Badge>
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

      {/* 1. Purpose */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={FileText} number="01" title="Purpose" />
          <p className="text-sm text-muted-foreground mb-3">
            To execute a controlled, accurate, and complete rollout of physical asset tags aligned with the approved
            Processing Plant Asset Tree.
          </p>
          <div className="space-y-0.5">
            <CheckItem>100% alignment with the approved asset tree — no tag applied without a system record</CheckItem>
            <CheckItem>No duplicate Asset IDs across any processing area</CheckItem>
            <CheckItem>No incorrect placements or misidentification of assets</CheckItem>
            <CheckItem>Full traceability between every physical asset and its system record</CheckItem>
            <CheckItem>Minimal operational disruption during the tagging campaign</CheckItem>
          </div>
        </CardContent>
      </Card>

      {/* 2. Pre-Rollout Gate */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="02" title="Pre-Rollout Requirements — Gate 1" />
          <p className="text-sm text-muted-foreground mb-3">
            All items below must be confirmed and signed off before any physical tagging commences.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            {[
              "Final approved Processing Plant asset tree exported and locked",
              "P&IDs reviewed and validated against asset tree",
              "Asset IDs frozen — no renumbering permitted during rollout",
              "Tag design approved (format, font size, dimensions)",
              "Tag material selected (engraved plate or printed label)",
              "Tag supplier confirmed or in-house printing setup ready",
              "Rollout phases agreed with maintenance supervisor",
              "Field tagging crew briefed on procedure and QC requirements",
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

      {/* 3. Tag Production Strategy */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Package} number="03" title="Tag Production Strategy" />
          <p className="text-sm text-muted-foreground mb-4">
            Select the production method before tag manufacturing begins. Decision must be locked prior to Gate 1 sign-off.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">Criteria</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-primary uppercase tracking-wide border border-border">Option A — Outsource Engraved Tags</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide border border-border">Option B — In-House Industrial Label Printer</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cost per tag", "$8–$20 per tag (316 SS engraved)", "$1–$3 per tag (industrial polyester label)"],
                  ["Lead time", "5–15 business days", "Immediate — print on demand"],
                  ["Flexibility for changes", "Low — re-order required for any change", "High — reprint instantly"],
                  ["Durability", "Excellent — 10+ year lifespan in harsh environments", "Good — 3–5 years UV/oil resistant"],
                  ["Recommended for", "Critical, permanent, heavy-duty assets", "Secondary assets, sensors, valves"],
                  ["Minimum order", "Often 50+ tags", "Single tag possible"],
                ].map(([criteria, optA, optB]) => (
                  <tr key={criteria} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 font-semibold text-xs border border-border">{criteria}</td>
                    <td className="px-3 py-2 text-xs border border-border">{optA}</td>
                    <td className="px-3 py-2 text-xs border border-border">{optB}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-start gap-2 bg-primary/5 rounded-md px-3 py-2">
            <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">Recommended hybrid approach:</span> Use outsourced engraved plates for Phase 1 critical equipment.
              Use in-house labels for Phase 2–3 secondary and minor assets to maintain flexibility.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Rollout Phases */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Factory} number="04" title="Rollout Phase Structure" />
          <p className="text-sm text-muted-foreground mb-4">
            Tagging is executed in three phases, prioritising operational criticality and safety access.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <PhaseCard
              phase={1}
              title="Critical Equipment"
              items={["Ball Mill", "SAG Mill", "Cyclone Feed Pumps", "Thickener", "Reagent Tanks", "MCC Panels", "Lube Systems"]}
              area="Processing Plant — Primary Circuit"
              tagCount="40–60 tags"
              labourHours="16–24 hrs"
              responsible="Maintenance Planner"
            />
            <PhaseCard
              phase={2}
              title="Secondary Equipment"
              items={["Transfer Pumps", "Conveyors", "Feeders", "Motors >5kW", "Gearboxes", "Agitators"]}
              area="Processing Plant — Secondary Circuit"
              tagCount="60–90 tags"
              labourHours="24–32 hrs"
              responsible="Maintenance Planner"
            />
            <PhaseCard
              phase={3}
              title="Minor Assets"
              items={["Control Valves", "Sensors", "Instruments", "Small Pumps", "Sample Points", "Small Assemblies"]}
              area="Processing Plant — All Zones"
              tagCount="80–120 tags"
              labourHours="20–30 hrs"
              responsible="Maintenance Technician"
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Field Tagging Procedure */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Wrench} number="05" title="Field Tagging Procedure" />
          <p className="text-sm text-muted-foreground mb-3">
            Follow this procedure for every asset tagged. No tag may be applied without system confirmation.
          </p>
          <div className="space-y-0.5">
            <StepItem step={1}>Confirm asset exists in system with correct Asset ID and description</StepItem>
            <StepItem step={2}>Confirm Asset ID matches approved asset tree (do not proceed if discrepancy found — log and escalate)</StepItem>
            <StepItem step={3}>Collect or print correct tag for that Asset ID</StepItem>
            <StepItem step={4}>Inspect and clean mounting surface — remove grease, dust, or paint flakes</StepItem>
            <StepItem step={5}>Install tag in the approved location per the tagging standard (eye level, non-wear surface)</StepItem>
            <StepItem step={6}>Photograph the installed tag clearly showing Asset ID and surrounding asset context</StepItem>
            <StepItem step={7}>Upload confirmation photo to system linked to the asset record</StepItem>
            <StepItem step={8}>Mark asset status as "Tagged – Verified" in the asset register</StepItem>
          </div>
          <div className="mt-3 bg-muted/40 rounded-md px-3 py-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Critical Rule</p>
            <p className="text-xs text-foreground">No tag shall be applied without a matching system record. If the asset is not in the system, stop — do not tag.</p>
          </div>
        </CardContent>
      </Card>

      {/* 6. Quality Control */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={CheckCircle2} number="06" title="Quality Control" />
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-0">
            {[
              "Maintenance supervisor sign-off required per section before proceeding to next area",
              "Random audit of minimum 10% of tagged assets per phase",
              "Cross-check all tags installed against current P&ID drawings",
              "Confirm zero duplicated Asset IDs across all tagged assets",
              "Confirm no assets on the approved list are missing a physical tag",
              "Photo evidence reviewed and linked to system record for audited assets",
            ].map((item) => (
              <CheckItem key={item}>{item}</CheckItem>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 7. Data Validation */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Database} number="07" title="Data Validation Step" />
          <p className="text-sm text-muted-foreground mb-3">
            After completion of each phase, perform a data validation cycle before commencing the next phase.
          </p>
          <div className="space-y-0.5">
            <StepItem step={1}>Export full asset list for the completed phase from the system</StepItem>
            <StepItem step={2}>Confirm 1:1 match between physical tags installed and asset tree records</StepItem>
            <StepItem step={3}>Log all discrepancies — missing tags, wrong IDs, unapproved assets</StepItem>
            <StepItem step={4}>Resolve all discrepancies before phase sign-off</StepItem>
            <StepItem step={5}>Complete close-out sheet signed by Maintenance Planner and Supervisor</StepItem>
          </div>
        </CardContent>
      </Card>

      {/* 8. Safety */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Shield} number="08" title="Safety Considerations" />
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

      {/* 9. Timeline */}
      <Card>
        <CardContent className="pt-5">
          <SectionHeading icon={Calendar} number="09" title="Estimated Rollout Timeline" />
          <p className="text-sm text-muted-foreground mb-4">
            Indicative schedule — tag production and verification run in parallel. Total campaign: <strong>~2 weeks</strong>.
          </p>
          <div className="space-y-2">
            {[
              { week: "Day 1–2",   label: "Gate 1 Sign-off — asset tree locked, tag design approved, supplier confirmed", colour: "bg-primary/10 border-primary/30 text-primary" },
              { week: "Day 2–5",   label: "Tag Production & Procurement (runs parallel with field prep)", colour: "bg-muted border-border text-muted-foreground" },
              { week: "Day 3–6",   label: "Phase 1 — Critical Equipment (Ball Mill, Cyclone Feed Pumps, EW Cell, MCC)", colour: "bg-red-50 border-red-200 text-red-700" },
              { week: "Day 7–9",   label: "Phase 2 — Secondary Equipment (Conveyors, Pumps, Motors, Gearboxes)", colour: "bg-amber-50 border-amber-200 text-amber-700" },
              { week: "Day 10–11", label: "Phase 3 — Minor Assets (Valves, Instruments, Sensors, Small Assemblies)", colour: "bg-green-50 border-green-200 text-green-700" },
              { week: "Day 12–14", label: "QC Audit, Data Validation, Photo Review & Close-out Sign-off", colour: "bg-muted border-border text-muted-foreground" },
            ].map(({ week, label, colour }) => (
              <div key={week} className={`flex items-center gap-3 rounded-md border px-4 py-2.5 ${colour}`}>
                <span className="text-xs font-bold font-mono min-w-[80px] flex-shrink-0">{week}</span>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">Adjust based on crew size and plant access windows. Shutdown or weekend access can compress this further.</p>
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
            <CheckItem>Completion Report — summary of phases, tag counts, discrepancies resolved, QC audit results</CheckItem>
            <CheckItem>Before/After photo archive — organised by phase and area</CheckItem>
            <CheckItem>Updated asset tree status — all tagged assets marked as "Tagged – Verified" in system</CheckItem>
            <CheckItem>Signed close-out sheets for all three phases</CheckItem>
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
                The physical tag is for rapid visual identification only. The tag rollout does not define or alter any
                system hierarchy — it only installs physical identification markers that reference existing system records.
              </p>
            </div>
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
    </div>
  );
};
