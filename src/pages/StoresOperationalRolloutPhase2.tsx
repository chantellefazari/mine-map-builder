import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Warehouse,
  Target,
  Activity,
  Layers,
  MapPin,
  Package,
  Tag,
  Link2,
  Workflow,
  ShieldCheck,
  Users,
  Cog,
  AlertTriangle,
  ListChecks,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Section = ({
  number,
  title,
  icon: Icon,
  children,
}: {
  number: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3 border-b border-border pb-3">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">
        {number}. {title}
      </h2>
    </div>
    <div className="space-y-4 pl-1">{children}</div>
  </section>
);

const SubBlock = ({ title, items }: { title: string; items: string[] }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-base">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-1.5 text-sm text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-primary mt-1">•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

const StageCard = ({
  stage,
  title,
  objectives,
  deliverables,
  dependencies,
  risks,
  support,
}: {
  stage: string;
  title: string;
  objectives: string[];
  deliverables: string[];
  dependencies: string[];
  risks: string[];
  support: string[];
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-base">
          {stage}, {title}
        </CardTitle>
        <Badge variant="outline" className="text-xs">Operational</Badge>
      </div>
    </CardHeader>
    <CardContent className="grid gap-4 md:grid-cols-2">
      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Objectives</h4>
        <ul className="space-y-1 text-sm">{objectives.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Deliverables</h4>
        <ul className="space-y-1 text-sm">{deliverables.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Dependencies</h4>
        <ul className="space-y-1 text-sm">{dependencies.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
      <div>
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Risks</h4>
        <ul className="space-y-1 text-sm">{risks.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
      <div className="md:col-span-2">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">Required Support</h4>
        <ul className="space-y-1 text-sm">{support.map((o, i) => <li key={i}>• {o}</li>)}</ul>
      </div>
    </CardContent>
  </Card>
);

const StoresOperationalRolloutPhase2 = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/stores-warehouse-design">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
              </Link>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Warehouse className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Stores & Warehouse Operational Rollout Plan, Phase 2
                </h1>
                <p className="text-sm text-muted-foreground">
                  Operational fit-out, inventory structure, and warehouse readiness, TCMG Framework
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">Phase 2 Document</Badge>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-10 max-w-5xl">
        {/* Reference banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-foreground">Reference Document</p>
            <p className="text-muted-foreground">
              This plan extends the original{" "}
              <Link to="/stores-warehouse-design" className="text-primary underline">
                Stores Implementation Plan
              </Link>
              . It does not replace any existing logic, design rules, or layouts already documented under Stores & Warehouse Design.
            </p>
          </div>
        </div>

        {/* 1. Project Overview */}
        <Section number="1" title="Project Overview" icon={Target}>
          <Card>
            <CardContent className="pt-6 space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Purpose.</span> Phase 2 covers the
                transition from physical construction of the TCMG stores compound to a fully
                operational warehouse. It defines the activities required to make the warehouse
                usable by stores personnel and aligned with the MineSite AI maintenance system.
              </p>
              <p>
                <span className="font-medium text-foreground">Scope of operational setup.</span>{" "}
                Internal warehouse fit-out, location structuring, inventory organisation,
                labelling, asset to spare linkage, operational workflows, and governance.
              </p>
              <p>
                <span className="font-medium text-foreground">Relationship to original plan.</span>{" "}
                The original Implementation Plan defined the design rules, container layouts,
                location coding standard, and capacity. This Phase 2 plan picks up after physical
                installation and focuses on operational readiness rather than design.
              </p>
              <p>
                <span className="font-medium text-foreground">Objectives.</span> Achieve a
                warehouse that is structured, labelled, populated with validated stock, linked to
                assets, governed by clear ownership, and ready for daily maintenance operations.
              </p>
            </CardContent>
          </Card>
        </Section>

        {/* 2. Current Status */}
        <Section number="2" title="Current Status" icon={Activity}>
          <div className="grid gap-3 md:grid-cols-2">
            <SubBlock
              title="Completed or in progress (physical works)"
              items={[
                "Earthworks underway and progressing on the stores compound pad",
                "Containers delivered to site",
                "Dome installation progressing on the laydown compound",
                "Container positioning being finalised onsite",
                "Physical warehouse footprint established",
                "Initial storage equipment ordered (shelving, tubs, racking)",
              ]}
            />
            <SubBlock
              title="Phase 2 focus"
              items={[
                "Internal operational fit-out of containers and dome",
                "System implementation in MineSite AI",
                "Inventory data preparation and validation",
                "Asset to spare linkage and BOM build out",
                "Operational workflow setup for stores personnel",
              ]}
            />
          </div>
        </Section>

        {/* 3. Phase 2 Scope of Work */}
        <Section number="3" title="Phase 2 Scope of Work" icon={Layers}>
          <SubBlock
            title="Warehouse Fit-Out"
            items={[
              "Shelving installation inside containers and dome",
              "Bin and tub setup per discipline",
              "Warehouse flow layout (receiving, storage, dispatch)",
              "Physical storage zoning by discipline and criticality",
              "Rack allocation per container fit-out plan",
            ]}
          />
          <SubBlock
            title="Warehouse Location Structure"
            items={[
              "Area level: Container, Dome, Laydown",
              "Aisle level: walkways and access lines",
              "Rack level: shelving units within each area",
              "Shelf level: vertical positions within a rack",
              "Bin level: discrete pick locations",
              "Field storage locations for bulk and oversized items",
              "Warehouse storage locations for active spares",
              "Overflow and laydown areas for staged or seasonal stock",
            ]}
          />
          <SubBlock
            title="Inventory Organisation"
            items={[
              "Stock grouping by discipline and equipment family",
              "Critical spares identified and tagged",
              "Min and max levels refined against consumption history",
              "Duplicate stock cleanup and merging",
              "OEM and supplier data captured against each stock code",
              "Spare categorisation aligned to the site stock code taxonomy",
            ]}
          />
          <SubBlock
            title="Labelling & Identification"
            items={[
              "Warehouse location labels printed and installed",
              "Bin labels with stock code and short description",
              "Rack labels at the front of each rack",
              "Asset linked spare labels for critical components",
              "Stock code alignment across labels, system, and physical bin",
            ]}
          />
          <SubBlock
            title="Asset ↔ Spare Linkage"
            items={[
              "BOM refinement for major equipment",
              "Asset to spare linking in MineSite AI",
              "Missing BOM identification and gap log",
              "Critical equipment spare review with engineering and maintenance",
            ]}
          />
          <SubBlock
            title="Operational Workflow Setup"
            items={[
              "Receiving process from delivery to bin",
              "Issuing process to work orders",
              "Returns process for unused or recovered parts",
              "Stock adjustments with approval rules",
              "New stock onboarding flow",
            ]}
          />
          <SubBlock
            title="Governance & Ownership"
            items={[
              "Stock code ownership held by Planners with Engineering endorsement",
              "Approval responsibilities for new and changed stock items",
              "Warehouse governance owned by Stores Lead",
              "Inventory accountability for counts, adjustments, and write-offs",
              "Data ownership for OEM, supplier, and BOM information",
            ]}
          />
        </Section>

        {/* 4. Resource Requirements */}
        <Section number="4" title="Resource Requirements" icon={Users}>
          <div className="grid gap-3 md:grid-cols-2">
            <SubBlock
              title="People"
              items={[
                "Stores personnel for fit-out and inventory loading",
                "Coordination with maintenance planners and supervisors",
                "Site labour support for physical movement and racking",
              ]}
            />
            <SubBlock
              title="Equipment & Materials"
              items={[
                "Forklift and trolley access during fit-out",
                "Label printer and durable label stock",
                "Bin and tub stock for fine items",
                "Hand tools for shelving install",
                "Additional consumables (cable ties, hooks, dividers)",
              ]}
            />
          </div>
        </Section>

        {/* 5. System Implementation Requirements */}
        <Section number="5" title="System Implementation Requirements" icon={Cog}>
          <SubBlock
            title="MineSite AI alignment"
            items={[
              "Warehouse locations uploaded into MineSite AI using the agreed coding standard",
              "Inventory structure aligned to the site stock code format",
              "Stock code validation against duplicates and naming rules",
              "Asset linkage requirements applied to critical equipment first",
              "Data cleanup activities for legacy descriptions and units of measure",
            ]}
          />
        </Section>

        {/* 6. Key Gaps / Risks */}
        <Section number="6" title="Key Gaps & Risks" icon={AlertTriangle}>
          <Card className="border-amber-500/30">
            <CardContent className="pt-6">
              <ul className="space-y-2 text-sm">
                {[
                  "Missing supplier data on a portion of the active stock list",
                  "Missing OEM data for several critical equipment families",
                  "Missing BOMs on legacy assets",
                  "Incomplete warehouse locations until physical fit-out is finalised",
                  "Inventory duplication risk during legacy data migration",
                  "Governance gaps where ownership is not yet formally assigned",
                  "Unlinked spares not yet attached to a parent asset",
                  "Incomplete or inconsistent stock descriptions",
                ].map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Section>

        {/* 7. Phased Execution Plan */}
        <Section number="7" title="Phased Execution Plan" icon={ListChecks}>
          <StageCard
            stage="Stage 1"
            title="Physical Fit-Out"
            objectives={["Complete internal fit-out of containers and dome"]}
            deliverables={["Installed shelving, bins, racking", "Functional warehouse flow"]}
            dependencies={["Containers positioned", "Shelving and bin stock onsite"]}
            risks={["Late delivery of fit-out materials", "Site access constraints"]}
            support={["Site labour, forklift, hand tools"]}
          />
          <StageCard
            stage="Stage 2"
            title="Warehouse Structuring"
            objectives={["Apply final location structure to physical and system"]}
            deliverables={["All locations labelled", "Locations loaded in MineSite AI"]}
            dependencies={["Stage 1 fit-out complete", "Coding standard locked"]}
            risks={["Mismatches between physical and system locations"]}
            support={["Stores personnel, label printer"]}
          />
          <StageCard
            stage="Stage 3"
            title="Inventory Validation"
            objectives={["Cleanse and validate the active stock list"]}
            deliverables={["Deduplicated stock list", "Min/max refined", "OEM and supplier data captured"]}
            dependencies={["Access to legacy inventory data"]}
            risks={["Incomplete supplier or OEM data carried forward"]}
            support={["Planners, procurement, supplier contacts"]}
          />
          <StageCard
            stage="Stage 4"
            title="Asset Linkage & BOM Review"
            objectives={["Link critical spares to parent assets"]}
            deliverables={["BOM coverage report", "Critical equipment spares linked"]}
            dependencies={["Asset tree stable", "Validated stock list"]}
            risks={["Missing BOMs slow down critical equipment readiness"]}
            support={["Engineering, planners, OEM documentation"]}
          />
          <StageCard
            stage="Stage 5"
            title="Operational Readiness"
            objectives={["Stand up daily warehouse operations"]}
            deliverables={["Receiving, issuing, returns procedures live", "Stores team trained"]}
            dependencies={["Locations and inventory complete"]}
            risks={["Process drift if procedures are not enforced from day one"]}
            support={["Stores Lead, Planners, Maintenance Supervisors"]}
          />
          <StageCard
            stage="Stage 6"
            title="Governance & Handover"
            objectives={["Lock in long term ownership and accountability"]}
            deliverables={["Ownership matrix signed off", "Governance cadence in place"]}
            dependencies={["Stages 1 to 5 complete"]}
            risks={["Ownership gaps if roles not endorsed by leadership"]}
            support={["Maintenance Superintendent, Stores Lead, Planners"]}
          />
        </Section>

        {/* 8. Success Criteria */}
        <Section number="8" title="Success Criteria" icon={CheckCircle2}>
          <Card>
            <CardContent className="pt-6">
              <ul className="grid gap-2 md:grid-cols-2 text-sm">
                {[
                  "Warehouse fully structured and labelled",
                  "Inventory locations assigned to every active stock code",
                  "Critical spares identified and visible",
                  "BOM linkage progressing against a published target",
                  "Governance ownership formally assigned",
                  "Warehouse operationally usable by the stores team",
                  "System aligned with the MineSite AI structure",
                ].map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Section>

        {/* 9. Final Recommendation */}
        <Section number="9" title="Final Recommendation" icon={ShieldCheck}>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6 space-y-3 text-sm">
              <p>
                The warehouse rollout should continue as a controlled operational implementation
                phase prior to full maintenance system maturity. Treating Phase 2 as a structured
                operational programme, rather than a continuation of construction, is essential to
                make the warehouse usable for daily maintenance work.
              </p>
              <p>
                This phase is foundational to long term maintenance system success and inventory
                control. Without it, the physical infrastructure delivered in Phase 1 cannot be
                converted into reliable, governed inventory operations inside MineSite AI.
              </p>
            </CardContent>
          </Card>
        </Section>
      </main>
    </div>
  );
};

export default StoresOperationalRolloutPhase2;
