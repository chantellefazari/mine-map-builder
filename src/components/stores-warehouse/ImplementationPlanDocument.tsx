import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  FileText,
  AlertTriangle,
  Shovel,
  Building2,
  Container,
  ArrowRightLeft,
  Hash,
  
  ListOrdered,
  DollarSign,
  ShieldAlert,
  Eye,
  Zap,
  Gauge,
  Wrench,
  Cog,
  Hammer,
  Info,
  XCircle,
  
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ------------------------------------------------------------------ */
/*  Reusable section wrapper                                          */
/* ------------------------------------------------------------------ */
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
  <div className="space-y-4 print-page-break">
    <div className="flex items-center gap-3" style={{ breakAfter: "avoid", pageBreakAfter: "avoid" }}>
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">
        {number}. {title}
      </h2>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const SubSection = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div id={id} className="space-y-2">
    <h3 className="text-base font-semibold text-foreground">
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Prose = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
);

const ImagePlaceholder = ({ label }: { label: string }) => (
  <div className="border-2 border-dashed border-border rounded-lg p-6 flex items-center justify-center bg-muted/30 my-4">
    <span className="text-xs text-muted-foreground italic">
      [ Image / Screenshot: {label} ]
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */
export const ImplementationPlanDocument = () => {

  return (
    <div className="space-y-8">
      {/* Document Header */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Full Stores &amp; Warehouse Implementation Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                TCMG-PLAN-STORES-001 &nbsp;|&nbsp; Rev 1.0
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Prepared By</span>
              <p className="font-medium text-foreground">Minesite.ai Project Manager</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium text-foreground">21st Feb 2026</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status</span>
              <p className="font-medium text-foreground">Draft, For Review</p>
            </div>
            <div>
              <span className="text-muted-foreground">Classification</span>
              <p className="font-medium text-foreground">Internal, Operational</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ============================================================ */}
      {/*  1. Executive Overview                                       */}
      {/* ============================================================ */}
      <Section number="1" title="Executive Overview" icon={Eye}>
        <Prose>
          This document outlines the end-to-end implementation plan for the Tennant Creek Central Stores Warehouse, including physical layout, storage zoning, location coding, stock control rules, and enabling civil works.
        </Prose>
        <Prose>
          The objective is to establish a controlled stores function that enables:
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>Accurate stock visibility and traceability</li>
          <li>Faster breakdown response and reduced downtime</li>
          <li>Reduced emergency freight reliance</li>
          <li>Controlled stock in / stock out discipline</li>
          <li>A stable foundation for Minesite AI integration (work orders + scheduling now, inventory governance aligned for rollout)</li>
        </ul>
        <Prose>
          Current state: the site operates without a structured, enclosed, governed stores environment, resulting in avoidable time loss, duplicate purchases, contamination risk, and reactive parts response.
        </Prose>
        <Prose>
          This plan defines:
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>The agreed storage model (containers C01 to C05 + LD laydown)</li>
          <li>The location coding structure (container / bay / bin logic)</li>
          <li>Stock control procedure (receiving, issuing, audits)</li>
          <li>The implementation sequence and dependencies (relocations → earthworks → slab → placement → fit-out → controls)</li>
        </ul>
        <Prose>
          Design visuals, survey inputs, and supporting evidence are included in the relevant sections of this document.
        </Prose>
      </Section>




      {/* ============================================================ */}
      {/*  2. Current State Assessment                                 */}
      {/* ============================================================ */}
      <Section number="2" title="Current State Assessment" icon={AlertTriangle}>
        <Prose>
          The proposed warehouse footprint is located within a low-lying section of the yard that currently experiences seasonal water pooling and unstable ground conditions. Without civil correction, this area cannot support a controlled warehouse environment.
        </Prose>
        <Prose>
          Spare parts are presently distributed across informal locations including yard containers and the MCC, with no structured zoning, bin allocation, or controlled issue process. Inventory visibility relies on personnel knowledge rather than defined system logic.
        </Prose>
        <Prose>
          There is no defined separation between electrical, instrumentation, mechanical and consumable stock. Sensitive components are stored in non-controlled environments, increasing contamination and reliability risk.
        </Prose>
        <Prose>
          Breakdown response is largely reactive due to limited confidence in on-hand stock accuracy. This contributes to emergency freight exposure and avoidable downtime.
        </Prose>
        <Prose>
          The absence of physical infrastructure currently prevents structured system implementation.
        </Prose>
      </Section>




      {/* ============================================================ */}
      {/*  3. Civil & Earthworks Scope                                 */}
      {/* ============================================================ */}
      <Section number="3" title="Civil &amp; Earthworks Scope" icon={Shovel}>
        <Prose>
          All civil works are aligned to the latest topographic survey and existing infrastructure constraints. This scope establishes a stable, drained, and operationally efficient foundation for the Central Stores compound and Laydown Yard.
        </Prose>
        <Prose>
          The selected footprint (refer attached aerial images and survey RL overlays) has been assessed for level control, drainage correction, access efficiency, and long-term expansion capability.
        </Prose>

        <SubSection id="3.1" title="Location Selection Rationale">
          <Prose>
            The proposed Central Stores compound footprint has been selected based on operational efficiency, access control, and long-term site functionality. This location was chosen because:
          </Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>It consolidates all warehouse containers and laydown areas into one controlled zone</li>
            <li>It keeps parts storage adjacent to the workshop and maintenance areas</li>
            <li>It reduces travel time and double handling of parts</li>
            <li>It improves forklift and vehicle access flow</li>
            <li>It allows clean separation between storage, waste handling, and pedestrian movement</li>
            <li>It supports integration with dust suppression infrastructure</li>
            <li>It enables drainage correction in an area currently experiencing surface erosion</li>
          </ul>
          <Prose>
            The intent is to move from dispersed, unstructured storage to a single defined warehouse compound with controlled access and structured zoning.
          </Prose>
          <Prose><span className="font-medium text-foreground">Operational Logic</span></Prose>
          <Prose>Positioning the stores compound in this footprint:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Centralises stock control into one controlled entry point</li>
            <li>Supports container zoning structure (C01 to C05 + LD)</li>
            <li>Improves response time for breakdown and maintenance activities</li>
            <li>Reduces lost time searching for parts</li>
            <li>Creates clear traffic flow around the workshop</li>
          </ul>
          <Prose>This location supports long-term warehouse discipline and future scalability.</Prose>
        </SubSection>

        <SubSection id="3.2" title="Survey & Level Control">
          <Prose>
            All works are referenced to the latest site survey (RL markers shown on attached aerial).
          </Prose>
          <Prose>Key reference levels:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li><span className="font-medium text-foreground">Existing Boily Slab (TOC):</span> 355.99 RL</li>
            <li><span className="font-medium text-foreground">Proposed New Stores Slab (TOC):</span> 355.99 RL (maintains alignment with existing infrastructure)</li>
            <li><span className="font-medium text-foreground">Slab underside:</span> 355.865 RL (125mm slab thickness)</li>
          </ul>
          <Prose>
            The compound footprint (outlined on attached image) has been assessed against natural surface (NS) levels to determine cut and fill requirements.
          </Prose>
        </SubSection>

        <SubSection id="3.3" title="Cut & Fill Requirements">
          <Prose>Based on preliminary calculations:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li><span className="font-medium text-foreground">Estimated bulk earthworks volume:</span> ~899.51 m³</li>
            <li><span className="font-medium text-foreground">Fill required from NS to underside of slab:</span> ~65.1 m³</li>
            <li><span className="font-medium text-foreground">New slab concrete volume:</span> 14.3 m³</li>
          </ul>
          <Prose>Approximate corner fill depths:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li><span className="font-medium text-foreground">North corner:</span> ~470mm</li>
            <li><span className="font-medium text-foreground">East corner:</span> ~900mm</li>
            <li><span className="font-medium text-foreground">South corner:</span> ~450mm</li>
            <li><span className="font-medium text-foreground">West corner:</span> ~220mm</li>
          </ul>
          <Prose>
            These figures are preliminary and subject to final confirmation prior to construction. Excess material will be reused where practical for laydown yard preparation to reduce imported material costs.
          </Prose>
        </SubSection>

        <SubSection id="3.4" title="Water Management">
          <Prose>
            The selected area currently shows uncontrolled surface water movement and erosion toward the dam during wet season events. There is no dedicated drainage design. Instead, the earthworks scope includes regrading the area so that surface water naturally sheds to the right of the compound and flows into the existing dam. This gives the water somewhere to go without requiring additional drainage infrastructure.
          </Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Earthworks regraded to establish consistent fall away from container pads toward the dam</li>
            <li>Surface water directed right of the compound into the existing dam</li>
            <li>Elimination of ponding around container positions</li>
            <li>Slab graded to fall away from container openings (refer Section 4.5)</li>
          </ul>
          <Prose>
            <span className="font-medium text-foreground">Objective:</span> No standing water within the compound footprint. Water sheds naturally into the dam via regraded earthworks.
          </Prose>
        </SubSection>

        <SubSection id="3.5" title="Tank & Obstruction Relocation">
          <Prose>To clear the compound footprint and improve layout efficiency:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Existing tanks to be relocated toward the crib room side</li>
            <li>Skip bins and waste containers relocated to a designated waste management zone outside the warehouse perimeter</li>
          </ul>
          <Prose>This ensures:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>A defined warehouse boundary</li>
            <li>Reduced cross-traffic</li>
            <li>Clear separation between storage and waste handling</li>
            <li>Improved pedestrian safety</li>
          </ul>
        </SubSection>

        {/* Attachments */}
        <div className="space-y-4 mt-4">
          <h3 className="text-base font-semibold text-foreground">Attachments for This Section</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Aerial compound footprint image</p>
              <img src="/images/compound-footprint-overlay.png" alt="Aerial compound footprint with overlay" className="rounded-lg border border-border w-full" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">RL survey overlay image</p>
              <img src="/images/site-survey-rl-markers.jpeg" alt="Site aerial with RL survey markers" className="rounded-lg border border-border w-full" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Preliminary fill depth breakdown</p>
              <img src="/images/earthworks-footprint-boundary.png" alt="Compound footprint outlined with earthworks volume calculation" className="rounded-lg border border-border w-full" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Earthworks calculation summary</p>
              <img src="/images/earthworks-calc-summary.png" alt="Earthworks calculation assumptions and corner fill depths" className="rounded-lg border border-border w-full" />
            </div>
          </div>
        </div>
      </Section>




      {/* ============================================================ */}
      {/*  4. Warehouse Structural Design                              */}
      {/* ============================================================ */}
      <Section number="4" title="Warehouse Structural Design" icon={Building2}>
        <Prose>
          The Central Stores Warehouse has been designed as a controlled, enclosed compound to support disciplined stock control, efficient material flow, and long-term operational durability.
        </Prose>
        <Prose>
          The layout follows a U-shaped container configuration enclosed by a dome structure with partial end walls and a front roller door access.
        </Prose>
        <Prose>The design prioritises:</Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li>Controlled goods-in / goods-out movement</li>
          <li>No forklift traffic inside containers</li>
          <li>Clear separation between delivery zone, sorting, and storage</li>
          <li>Clean pedestrian workflow</li>
          <li>Long-term dust and moisture protection</li>
        </ul>

        <SubSection id="4.1" title="Structural Configuration">
          <Prose>The warehouse consists of:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
             <li>1 × 40ft container (rear wall, Mechanical bulk storage)</li>
             <li>4 × 20ft containers (side walls: Electrical, Instrumentation, Mechanical Precision, Consumables)</li>
            <li>Dome roof structure spanning the U-shaped configuration</li>
            <li>Partial end walls to reduce dust and weather exposure</li>
            <li>Front roller door for controlled access</li>
          </ul>
          <Prose>
            This structure creates a fully enclosed central working bay while keeping containers as the primary storage zones.
          </Prose>
          <Prose>
            The containers remain structurally independent and are positioned on engineered concrete blocks (refer Civil Section).
          </Prose>
        </SubSection>

        <SubSection id="4.2" title="Access & Material Flow Logic">
          <Prose><span className="font-medium text-foreground">Roller Door Operation</span></Prose>
          <Prose>
            The front roller door will typically operate at half-height during standard receiving operations.
          </Prose>
          <Prose>Immediately inside the roller door:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>A mobile bench on wheels will function as the front desk booking station.</li>
            <li>This bench can be rolled aside when pallet deliveries are received.</li>
          </ul>
          <Prose>This creates flexibility between:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Administrative control mode</li>
            <li>Bulk receiving mode</li>
          </ul>
        </SubSection>

        <SubSection id="4.3" title="Goods In Workflow">
          <Prose>
            All deliveries arrive at the designated receiving zone (red-marked area on attached layout).
          </Prose>
          <Prose><span className="font-medium text-foreground">Rules:</span></Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>No stock is to remain in the receiving zone.</li>
            <li>All parts must move immediately through processing.</li>
          </ul>
          <Prose><span className="font-medium text-foreground">Process flow:</span></Prose>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
            <li>Pallet delivered to receiving zone</li>
            <li>Pallet jack used to move pallet inside central bay</li>
            <li>Items placed at:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Sorting Parts Bench (for small parts), or</li>
                <li>Directed to Laydown Yard (for large items)</li>
              </ul>
            </li>
          </ol>
          <Prose>
            No forklifts enter the warehouse structure. Forklifts remain external and deliver to the front of the roller door only.
          </Prose>
        </SubSection>

        <SubSection id="4.4" title="Internal Workflow Design">
          <Prose>Inside the central working bay:</Prose>
          <Prose><span className="font-medium text-foreground">Sorting Parts Bench</span></Prose>
          <Prose>Used for:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Scanning stock in</li>
            <li>Labelling</li>
            <li>Quality checks</li>
            <li>Allocating bin locations</li>
          </ul>
          <Prose>Once processed:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Small parts move directly into designated containers (C01–C05)</li>
            <li>No staging inside the main floor area</li>
          </ul>
          <Prose>The central floor remains clear for:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Pallet jack movement</li>
            <li>Temporary handling only</li>
          </ul>
          <Prose>No long-term storage permitted in the central bay.</Prose>
        </SubSection>

        <SubSection id="4.5" title="Container Installation & Weatherproofing Detail">
          <Prose>
            To ensure durability and water management, containers will be installed using the following controlled method.
          </Prose>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Container Seating on Concrete Blocks</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                <li>Containers will be positioned on engineered concrete blocks cast within the slab footprint</li>
                <li>Block height will match finished slab level to provide stable, even load distribution</li>
                <li>No direct soil contact will occur</li>
                <li>Blocks will be spaced to suit container corner castings and structural load points</li>
              </ul>
              <Prose>This method reduces slab volume while maintaining structural stability.</Prose>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-1">Fall &amp; Water Management</p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                <li>Finished slab will be graded to fall away from container openings</li>
                <li>Internal shims will be installed as required to ensure water cannot track back into container doorways</li>
                <li>Surface runoff will be directed away from the warehouse footprint toward the dam</li>
              </ul>
              <div className="mt-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg p-2.5 text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Objective:</span> No ponding at container doors and no internal water migration during wet season events.
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-foreground mb-1">Dome-to-Container Sealing</p>
              <Prose>Where the dome structure interfaces with container roof lines:</Prose>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                <li>Angle bar or flashing will be installed across junctions</li>
                <li>Weather-rated sealant will be applied along all contact points</li>
                <li>Seals to be inspected prior to handover</li>
              </ul>
              <Prose>This prevents:</Prose>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-disc pl-5">
                <li>Wind-driven rain entry</li>
                <li>Dust ingress</li>
                <li>Corrosion at roof junctions</li>
              </ul>
            </div>
          </div>
        </SubSection>

        <SubSection id="4.6" title="Design Intent">
          <Prose>
            This is not simply a container arrangement. It is a controlled logistics compound designed to:
          </Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Reduce part loss</li>
            <li>Eliminate search time</li>
            <li>Improve stock accuracy</li>
            <li>Protect sensitive components</li>
            <li>Prevent contamination</li>
            <li>Improve safety</li>
            <li>Enable full system integration with Minesite AI</li>
          </ul>
          <Prose>The warehouse enforces discipline through layout, not policy alone.</Prose>
        </SubSection>

        {/* Attachments */}
        <div className="space-y-4 mt-4">
          <h3 className="text-base font-semibold text-foreground">Attachments for This Section</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Internal warehouse layout</p>
              <img src="/images/warehouse-internal-layout.png" alt="Warehouse internal layout showing goods in zone, sorting bench, and container positions" className="rounded-lg border border-border w-full" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Site layout with container and laydown positions</p>
              <img src="/images/warehouse-site-layout.png" alt="Aerial site layout showing warehouse compound and laydown yard" className="rounded-lg border border-border w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Dome with roller doors</p>
              <img src="/images/dome-roller-doors.png" alt="Dome structure with roller door access" className="rounded-lg border border-border w-full" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Dome with partial end walls</p>
              <img src="/images/dome-partial-endwalls.png" alt="Dome structure showing partial end wall configuration" className="rounded-lg border border-border w-full" />
            </div>
          </div>

          {/* Compound Layout Diagram */}
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Warehouse compound layout: container positions, dome area &amp; laydown yard</p>
            <img src="/images/warehouse-compound-layout.png" alt="Warehouse compound layout showing U-shaped container configuration C01-C05, dome area, and laydown yard LD-A through LD-F" className="rounded-lg border border-border w-full" />
          </div>


          {/* 3D Render */}
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">3D warehouse compound model</p>
            <img src="/images/warehouse-3d-render.png" alt="3D rendered model of warehouse compound showing containers, dome, laydown yard and delivery zone" className="rounded-lg border border-border w-full" />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Interactive 3D Model Available: </span>
              A fully interactive 3D version of this warehouse design is available within the application. 
              Contact the project team to request access to the live 3D visualisation, which includes container interiors, 
              roller door operation, and laydown yard navigation.
            </p>
          </div>
        </div>
      </Section>





      {/* ============================================================ */}
      {/*  5. Container Allocation Logic                               */}
      {/* ============================================================ */}
      <Section number="5" title="Container Allocation Logic" icon={Container}>
        <Prose>
          Each container is assigned a discipline code and stocked according to category code (CC) rules. All items within containers must meet the ≤15 kg manual handling limit. Heavy or oversized items are allocated to the Laydown Yard.
        </Prose>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-700 dark:text-green-300">
          <span className="font-medium">Eligibility Rule:</span> Only carryable items (≤15 kg) that can be safely handled by one person and stored on shelves or in bins.
        </div>

        <div className="space-y-2">
          {/* C01-EL */}
          <Card className="border-border bg-yellow-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-yellow-500/20 flex items-center justify-center"><span className="font-bold text-xs text-yellow-600">1</span></div>
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="font-semibold text-sm text-foreground">C01-EL: Electrical</span>
                <span className="text-[10px] text-muted-foreground ml-auto">20ft Modified · Dust-controlled airflow</span>
              </div>
              <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                {["Fuses (all types)", "Circuit breakers (MCB, MCCB)", "RCBOs", "Contactors", "Overload relays", "Control relays", "Power supplies", "Terminal blocks", "Isolator handles & internals", "Push buttons", "Selector switches", "Indicator lights", "VSD/VFD spare boards", "PLC I/O cards", "PLC CPUs", "Sensors (photo, proximity)", "Cable glands", "Cable lugs", "Ferrules", "Control cables (cut lengths)", "Panel cooling fans", "Panel filters"].map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5"><span className="text-muted-foreground/50 mt-0.5">•</span><span>{item}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* C02-IN */}
          <Card className="border-border bg-purple-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-500/20 flex items-center justify-center"><span className="font-bold text-xs text-purple-600">2</span></div>
                <Gauge className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-sm text-foreground">C02-IN: Instrumentation &amp; Pneumatics</span>
                <span className="text-[10px] text-muted-foreground ml-auto">20ft Modified · Clean/fragile storage</span>
              </div>
              <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                {["Pressure transmitters", "Pressure gauges", "Flow switches", "Flow meters (small)", "Level switches", "Temperature probes (RTD / thermocouple)", "Solenoid valves (small)", "Positioners", "Instrument air regulators / FRLs", "Small actuators", "Instrument fittings (SS, brass)", "Swagelok fittings", "Tubing (coiled lengths)", "Manifolds (small)", "Instrument filters", "Pneumatic push-in fittings", "Quick connects", "Air hoses (small)", "Mufflers", "Needle valves (small)"].map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5"><span className="text-muted-foreground/50 mt-0.5">•</span><span>{item}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* C03-ME */}
          <Card className="border-border bg-blue-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center"><span className="font-bold text-xs text-blue-600">3</span></div>
                <Wrench className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-sm text-foreground">C03-ME: Mechanical</span>
                <span className="text-[10px] text-muted-foreground ml-auto">40ft Standard · High-density bins</span>
              </div>
              {[
                { name: "Wear Parts & Liners", items: ["Small wear plates (<15 kg)", "Chute liners (rubber, ceramic, <15 kg)"] },
                { name: "Conveyor & Drive", items: ["Rollers", "Idlers", "Pulleys", "Scraper blades", "Belt cleaners", "Belts (V-belt, drive belt)", "Belt fasteners", "Sprockets", "Chains"] },
                { name: "Valves, Pipe & Fittings", items: ["Valves (ball, butterfly, knife gate, check, under DN150)", "Pipe fittings", "Flanges", "Elbows", "Tees", "Reducers", "Nipples", "Hoses", "Couplings (heavy)"] },
                { name: "Pump Spares", items: ["Pump seal kits (application-specific)", "Impellers (small)", "Wear rings", "Shaft sleeves", "Gland packing"] }
              ].map((subCat, si) => (
                <div key={si}>
                  <h4 className="font-medium text-xs text-foreground mb-1">{subCat.name}</h4>
                  <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                    {subCat.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5"><span className="text-muted-foreground/50 mt-0.5">•</span><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* C04-MP */}
          <Card className="border-border bg-cyan-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center"><span className="font-bold text-xs text-cyan-600">4</span></div>
                <Cog className="w-4 h-4 text-cyan-600" />
                <span className="font-semibold text-sm text-foreground">C04-MP: Mechanical Precision</span>
                <span className="text-[10px] text-muted-foreground ml-auto">20ft Standard · Anti-contamination</span>
              </div>
              <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                {["Bearings (all types)", "Pillow blocks", "Spherical roller bearings", "Ball bearings", "Seals (oil, lip, mechanical)", "O-rings", "Gaskets", "Shims", "Keys & key stock", "Retaining rings (circlips)", "Bushes", "Small couplings", "Small shafts", "Precision parts", "Locknuts"].map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5"><span className="text-muted-foreground/50 mt-0.5">•</span><span>{item}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* C05-CS */}
          <Card className="border-border bg-slate-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-500/20 flex items-center justify-center"><span className="font-bold text-xs text-slate-600">5</span></div>
                <Hammer className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-sm text-foreground">C05-CS: Consumables &amp; Supplies</span>
                <span className="text-[10px] text-muted-foreground ml-auto">20ft Standard · Kanban bins</span>
              </div>
              {[
                { name: "Fasteners & Hardware", items: ["Bolts", "Nuts", "Washers", "Studs", "Anchors", "Threaded rod", "U-bolts", "Hose clamps", "Retaining clips", "Pins", "Screws"] },
                { name: "Sealants & Adhesives", items: ["Loctite", "Silicone", "Threadlocker", "PTFE tape", "Thread sealant", "Adhesives"] },
                { name: "Consumables & PPE", items: ["Gloves", "Respirators", "Hard hats", "Rags", "Absorbents", "Zip ties", "Tape", "Batteries"] },
                { name: "Lubrication", items: ["Grease cartridges", "Grease nipples", "Grease fittings", "Oil filters (small)", "Breathers", "Sight glasses", "Auto-lube injectors", "Oil sample bottles", "Desiccant breathers"] }
              ].map((subCat, si) => (
                <div key={si}>
                  <h4 className="font-medium text-xs text-foreground mb-1">{subCat.name}</h4>
                  <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3 text-xs text-muted-foreground">
                    {subCat.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5"><span className="text-muted-foreground/50 mt-0.5">•</span><span>{item}</span></div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <SubSection id="5.6" title="LD: Laydown Yard">
          <Prose>
            Reserved for heavy assemblies (&gt;15 kg), oversized items, and critical overflow. LD-A and LD-B are dome-sheltered for critical overflow (green coding). Remaining zones are category-specific: LD-C (Pumps), LD-D (Matec), LD-E (Electrical), and LD-F (Mechanical). All laydown items require weatherproofing (shrink-wrap or tarpaulin) and visible tagging.
          </Prose>
          
        </SubSection>

        {/* Exclusions */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <CardTitle className="text-lg">Excluded from Container Storage → Laydown Yard (LD)</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              These items are stored in laydown yards, dome rows, or heavy spares areas
            </p>
          </CardHeader>
          <CardContent>
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                {["Complete motors (>15 kg)", "Gearboxes", "Complete pumps / pump assemblies", "Large valves (DN150+)", "Large PE/Plasson fittings", "Drums and bulk chemicals", "Palletised items", "Structural steel", "Heavy equipment assemblies", "Switchboards", "Crusher liners, cone liners, mantles", "Screen panels (heavy)", "Anything requiring forklift"].map((item, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-md text-sm bg-destructive/10 text-destructive border border-destructive/20">{item}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Validation */}
        <SubSection id="5.8" title="Capacity Validation Summary">
          <Prose>
            A capacity scan has been performed against the physical fitout of each container. The table below compares live SKU counts against the number of physical bin positions (shelves, drawers, panel slots) installed in each container.
          </Prose>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Zone</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs text-right">SKUs</TableHead>
                <TableHead className="text-xs text-right">Bin Positions</TableHead>
                <TableHead className="text-xs text-right">Items/Bin</TableHead>
                <TableHead className="text-xs">Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                 { zone: "C01-EL", type: "20ft", skus: 441, bins: 274, note: "ESD panels hold 20 to 40 small SKUs per slot (fuses, lugs, ferrules)" },
                 { zone: "C02-IN", type: "20ft", skus: 345, bins: 273, note: "Drawer cabinets hold approx. 15 fitting types per drawer" },
                 { zone: "C03-ME", type: "40ft", skus: 533, bins: 540, note: "Near 1:1, largest container at 12m length" },
                 { zone: "C04-MP", type: "20ft", skus: 226, bins: 302, note: "Best headroom, 25% growth buffer" },
                 { zone: "C05-CS", type: "20ft", skus: 431, bins: 338, note: "Bin walls consolidate 3 to 5 fastener sizes per slot" },
                 { zone: "LD", type: "Yard", skus: 112, bins: null, note: "6 open bays, forklift-accessible, no bin limit" },
                 { zone: "Wurth", type: "Cabinet", skus: 20, bins: null, note: "Dedicated Wurth mobile cabinet" },
                 { zone: "Flammable", type: "Cabinet", skus: 1, bins: null, note: "AS1940-compliant cabinet" },
              ].map((row) => {
                const ratio = row.bins ? (row.skus / row.bins).toFixed(2) : "—";
                return (
                  <TableRow key={row.zone}>
                    <TableCell className="text-xs font-medium">{row.zone}</TableCell>
                    <TableCell className="text-xs">{row.type}</TableCell>
                    <TableCell className="text-xs text-right">{row.skus}</TableCell>
                    <TableCell className="text-xs text-right">{row.bins ?? "—"}</TableCell>
                    <TableCell className="text-xs text-right">{ratio}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{row.note}</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-medium">
                <TableCell className="text-xs">Total</TableCell>
                <TableCell className="text-xs">—</TableCell>
                <TableCell className="text-xs text-right">2,109</TableCell>
                <TableCell className="text-xs text-right">1,727</TableCell>
                <TableCell className="text-xs text-right">—</TableCell>
                <TableCell className="text-xs">—</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm space-y-1.5">
            <p className="font-medium text-foreground">How to read this table</p>
            <p className="text-muted-foreground text-xs">
              <span className="font-medium text-foreground">Bin Positions</span> = the total number of physical compartments (shelf bins, drawer slots, panel slots) installed inside each container based on the furniture fitout.
            </p>
            <p className="text-muted-foreground text-xs">
              <span className="font-medium text-foreground">Items/Bin</span> = SKU count ÷ bin positions. A ratio above 1.0 does not mean overcrowded. Many storage types are specifically designed to hold multiple SKUs per slot. For example, ESD panels hold 20 to 40 small electrical SKUs per slot, drawer cabinets hold approx. 15 fitting types per drawer, and Kanban bin walls consolidate 3 to 5 fastener sizes per slot.
            </p>
            <p className="text-muted-foreground text-xs">
              A ratio above <span className="font-medium text-foreground">3.0</span> would indicate genuine overcrowding requiring review. No zones currently exceed this threshold.
            </p>
          </div>
        </SubSection>

        {/* Container Fitout & Shopping List */}
        <SubSection id="5.9" title="Container Fitout Layout & Shopping List">
          <Prose>
            Each container has a long-side door modification with internal layout designed around the door position. All shelving and heavy racks are floor-mounted (not wall-hung) to maintain structural integrity after door cut.
          </Prose>

          {/* C01-EL */}
          <Card className="border-border bg-yellow-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                 <span className="font-semibold text-sm text-foreground">C01-EL: Electrical (20ft)</span>
               </div>
               <div className="text-xs text-muted-foreground space-y-1">
                 <p><span className="font-medium text-foreground">Rear Long Wall (5.9m):</span> 4 to 5 steel shelving bays (900mm), mid-size electrical items</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Left of door:</span> ESD bin wall</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Right of door:</span> Reinforced VSD shelving</p>
                <p><span className="font-medium text-foreground">End Wall 1:</span> Sealed cabinet for PLCs, anti-static mats inside</p>
                <p><span className="font-medium text-foreground">End Wall 2 (airflow end):</span> Conduit brackets near ceiling, panel fan/filter vertical rack</p>
              </div>
              <div className="border-t border-border/50 pt-2 mt-1">
                <p className="text-[10px] font-medium text-foreground uppercase tracking-wide mb-1">Required</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["5–6 steel bays", "2 ESD bin panels", "1 sealed cabinet", "1 reinforced shelf section", "6 conduit brackets"].map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20">{item}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C02-IN */}
          <Card className="border-border bg-purple-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                 <span className="font-semibold text-sm text-foreground">C02-IN: Instrumentation (20ft)</span>
               </div>
               <div className="text-xs text-muted-foreground space-y-1">
                 <p><span className="font-medium text-foreground">Rear Long Wall:</span> 4 shelving bays foam-lined</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Left of door:</span> Drawer cabinets (fittings, Swagelok)</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Right of door:</span> Shelving for boxed instruments</p>
                <p><span className="font-medium text-foreground">End Wall:</span> Tubing reel rack vertical, fragile zone signage</p>
              </div>
              <div className="border-t border-border/50 pt-2 mt-1">
                <p className="text-[10px] font-medium text-foreground uppercase tracking-wide mb-1">Required</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["6 steel bays", "2 drawer cabinets", "40 foam totes", "1 tubing rack"].map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">{item}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C03-ME */}
          <Card className="border-border bg-blue-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-600" />
                 <span className="font-semibold text-sm text-foreground">C03-ME: 40ft Mechanical (Door on long side)</span>
               </div>
               <div className="text-xs text-muted-foreground space-y-1">
                 <p><span className="font-medium text-foreground">Rear Long Wall:</span> 8 to 10 heavy-duty bays</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Left of door:</span> 4 heavy-duty bays</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Right of door:</span> 4 heavy-duty bays</p>
                 <p><span className="font-medium text-foreground">End Wall 1:</span> V-belt rack (fabricated)</p>
                 <p><span className="font-medium text-foreground">End Wall 2:</span> Long material rack (conduit, flat bar)</p>
                 <p className="mt-1"><span className="font-medium text-foreground">Total heavy-duty bays:</span> 14 to 18 depending on spacing. No pallet racks. No forklifts. All manual ≤15 kg.</p>
              </div>
              <div className="border-t border-border/50 pt-2 mt-1">
                <p className="text-[10px] font-medium text-foreground uppercase tracking-wide mb-1">Required</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["16 heavy-duty bays", "80 heavy totes", "Custom V-belt rack", "Long material rack"].map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">{item}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C04-MP */}
          <Card className="border-border bg-cyan-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <Cog className="w-4 h-4 text-cyan-600" />
                 <span className="font-semibold text-sm text-foreground">C04-MP: Mechanical Precision (20ft)</span>
               </div>
               <div className="text-xs text-muted-foreground space-y-1">
                 <p><span className="font-medium text-foreground">Rear Long Wall:</span> 4 shelving bays</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Left of door:</span> Seal drawer cabinets</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Right of door:</span> Flat gasket shelves</p>
                 <p><span className="font-medium text-foreground">End Wall:</span> Small bin trays for circlips &amp; shims</p>
              </div>
              <div className="border-t border-border/50 pt-2 mt-1">
                <p className="text-[10px] font-medium text-foreground uppercase tracking-wide mb-1">Required</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["6 steel bays", "2 drawer units", "Flat file shelf section", "30 small trays"].map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">{item}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* C05-CS */}
          <Card className="border-border bg-slate-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-slate-600" />
                 <span className="font-semibold text-sm text-foreground">C05-CS: Consumables (20ft)</span>
                 <span className="text-[10px] text-muted-foreground ml-auto">High-turn near door</span>
               </div>
               <div className="text-xs text-muted-foreground space-y-1">
                 <p><span className="font-medium text-foreground">Rear Long Wall:</span> 4 shelving bays (boxed bolts etc.)</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Left of door:</span> Full bin wall (high frequency)</p>
                 <p><span className="font-medium text-foreground">Opposite Long Wall, Right of door:</span> PPE rack + bunded grease shelf</p>
                <p><span className="font-medium text-foreground">End Wall:</span> Lockable tool cabinet</p>
              </div>
              <div className="border-t border-border/50 pt-2 mt-1">
                <p className="text-[10px] font-medium text-foreground uppercase tracking-wide mb-1">Required</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["6 steel bays", "2 bin walls", "1 bunded shelf", "1 tool cabinet", "1 PPE rack"].map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-500/10 border border-slate-500/20">{item}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Laydown */}
          <Card className="border-border bg-emerald-500/10">
            <CardContent className="py-3 px-4 space-y-2">
              <div className="flex items-center gap-2">
                <Container className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-sm text-foreground">LD: Laydown Yard</span>
              </div>
              <div className="border-t border-border/50 pt-2 mt-1">
                <p className="text-[10px] font-medium text-foreground uppercase tracking-wide mb-1">Required</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  {["Ground markings", "Shrink wrap", "Dunnage", "Bay signage"].map((item, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">{item}</span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Structural Note */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-sm space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <p className="font-medium text-amber-700 dark:text-amber-300">Structural Note: Long-Side Door Modifications</p>
            </div>
            <ul className="text-xs text-amber-600 dark:text-amber-400 list-disc pl-5 space-y-0.5">
              <li>Reinforce top beam</li>
              <li>Reinforce vertical posts</li>
              <li>Do NOT mount shelving directly to cut frame</li>
              <li>Keep heavy racks on floor, not wall hung</li>
            </ul>
          </div>
        </SubSection>

      </Section>




      {/* ============================================================ */}
      {/*  6. Stores Operational Flow                                  */}
      {/* ============================================================ */}
      <Section number="6" title="Stores Operational Flow" icon={ArrowRightLeft}>
        <Prose>
          Operational procedures govern all stock movements to ensure 100% traceability across C01–C05 and LD areas. The objective is to eliminate the "just grab it" culture and establish a disciplined stores process. All stock movements must be recorded in the system before, during, or immediately after the physical movement.
        </Prose>

        <SubSection id="6.1" title="Stock In: Receiving">
          <Prose>All inbound stock must pass through the roller door check-in zone on the concrete slab. No part is permitted to enter containers without system entry.</Prose>
          <div className="space-y-1.5">
            {["Verify PO against delivery docket", "Inspect for damage", "Confirm quantity and correct part number", "Photograph part (if new to catalogue)", "Apply internal part label (if required)", "Enter into system: date, PO number, supplier, received-by (all mandatory)", "Assign bin location (C01 to C05 or LD allocation)", "Physically place in allocated location"].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-destructive/10 border border-destructive/20 rounded-lg p-2.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
            <span className="text-xs font-medium text-destructive">If not system-recorded → cannot be stored. No exceptions.</span>
          </div>
        </SubSection>

        <SubSection id="6.2" title="Stock Out: Issue">
          <Prose>Every withdrawal from stores must be recorded before the part leaves the shelf.</Prose>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-1">Steps</p>
              {["Locate part in system", 'Select "Stock Out"', "Enter quantity being withdrawn", "Record all mandatory fields"].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-1 text-sm">
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-1">Required Fields</p>
              {[
                { label: "Work Order Number", value: "Mandatory" },
                { label: "Area / Asset", value: "If available" },
                { label: "Issued To", value: "Mandatory, named person" },
                { label: "Reason", value: "Breakdown / PM / Planned / Shutdown" },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-medium text-foreground">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SubSection>

        <SubSection id="6.3" title="Emergency Withdrawal (Nightshift Rule)">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 space-y-2">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              <span className="font-medium">Applies only when system is unavailable</span> (e.g. network outage, nightshift breakdown).
            </p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {["Remove part from location", "Complete manual withdrawal sheet immediately", "Enter into system next day before 10:00 AM"].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400 border-t border-amber-500/20 pt-2">
              Unrecorded movement is not permitted under any circumstance.
            </p>
          </div>
        </SubSection>

        <SubSection id="6.4" title="Laydown Yard Rules">
          <Prose>Heavy assemblies (&gt;15 kg), large motors, pumps, gearboxes. Forklift access required.</Prose>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            {[
              "Must be assigned LD location code (LD-A1, LD-B2, etc.)",
              "Must be physically tagged with part number, description, and date received",
              "Must be shrink-wrapped if exposed to weather",
              "All forklift movements must be logged in system",
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-muted/40 rounded border border-border">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection id="6.5" title="Accountability & Controls">
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "No part moves without system entry",
              "No container access without recording issue",
              "No bulk withdrawals without WO reference",
              'No "just grab it" culture permitted',
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-sm text-foreground">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection id="6.6" title="Review Cycles">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">Weekly: Wednesday Revision Day (Y26-WXX)</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                {["Spot check high-critical spares", "Review below-minimum items", "Reconcile discrepancies", "Review emergency freight occurrences"].map((c, i) => (
                  <div key={i} className="flex items-start gap-2"><span className="text-muted-foreground/50">•</span><span>{c}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">Monthly: Rotating Container Audit</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                {["Cycle count rotating container sections", "Reconcile discrepancies", "Review duplicates", "Adjust Min/Max where required"].map((c, i) => (
                  <div key={i} className="flex items-start gap-2"><span className="text-muted-foreground/50">•</span><span>{c}</span></div>
                ))}
              </div>
            </div>
          </div>
          <Prose>Discrepancies investigated and root-cause documented within 48 hours.</Prose>
        </SubSection>

        <SubSection id="6.7" title="Min/Max & Reorder Logic">
          <div className="grid sm:grid-cols-2 gap-2 text-sm">
            {[
              { label: "Min Qty", desc: "Triggers reorder alert when stock falls to this level" },
               { label: "Max Qty", desc: "Upper limit, prevents overstocking in limited container space" },
               { label: "Reorder Point", desc: "Lead-time-adjusted trigger for procurement action" },
               { label: "Review Cycle", desc: "Monthly against consumption data, adjustments documented with justification" },
            ].map((item, i) => (
              <div key={i} className="p-2.5 bg-muted/40 rounded border border-border">
                <span className="font-medium text-foreground">{item.label}: </span>
                <span className="text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>




      {/* ============================================================ */}
      {/*  7. Inventory Logic & Numbering Framework                    */}
      {/* ============================================================ */}
      <Section number="7" title="Inventory Logic &amp; Numbering Framework" icon={Hash}>
        <Prose>
          A unified numbering and coding framework ensures every item in the warehouse is uniquely identified, traceable, and logically allocated. This framework synchronises part identification, location coding, and category taxonomy across all modules.
        </Prose>

        <SubSection id="7.1" title="Site Part Numbering Standard (SSCCNNN)">
          <Prose>All site parts follow a 7-digit numeric format to ensure CMMS compatibility and collision-free identification.</Prose>
          <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 font-mono text-lg text-foreground font-bold tracking-widest justify-center">
              <span className="px-2 py-1 bg-primary/10 border border-primary/30 rounded">SS</span>
              <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/30 rounded">CC</span>
              <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded">NNN</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="text-center p-2 bg-primary/5 rounded border border-primary/20">
                 <p className="font-bold text-primary text-xs uppercase">SS: Site Code</p>
                 <p className="text-muted-foreground mt-1">Always <span className="font-mono font-bold">10</span> (TCMG)</p>
               </div>
               <div className="text-center p-2 bg-blue-500/5 rounded border border-blue-500/20">
                 <p className="font-bold text-blue-600 text-xs uppercase">CC: Category</p>
                 <p className="text-muted-foreground mt-1">01 to 22 (see taxonomy)</p>
               </div>
               <div className="text-center p-2 bg-emerald-500/5 rounded border border-emerald-500/20">
                 <p className="font-bold text-emerald-600 text-xs uppercase">NNN: Sequence</p>
                 <p className="text-muted-foreground mt-1">001 to 999 per category</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">Example: <span className="font-mono font-medium text-foreground">1004012</span> = Site 10, Bearing (CC 04), Item 012</p>
          </div>
          <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span className="text-xs text-amber-700 dark:text-amber-300">Legacy alphanumeric codes are flagged with warnings during validation. All new parts must use 7-digit numeric format only.</span>
          </div>
        </SubSection>

        <SubSection id="7.2" title="Category Codes (CC 01–22)">
          <Prose>The TCMG taxonomy defines 22 numeric category codes. Sub-categories share their parent CC code for numbering sequences.</Prose>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-xs">
            {[
              { cc: "01", name: "Pump Component" }, { cc: "02", name: "Motor Component" }, { cc: "03", name: "Gearbox" },
              { cc: "04", name: "Bearing" }, { cc: "05", name: "Valve" }, { cc: "06", name: "Instrumentation" },
              { cc: "07", name: "Electrical" }, { cc: "08", name: "Conveyor Component" }, { cc: "09", name: "Wear Parts" },
              { cc: "10", name: "Mechanical" }, { cc: "11", name: "Pipe Fitting" }, { cc: "12", name: "Seal" },
              { cc: "13", name: "Filter" }, { cc: "14", name: "Lubrication System" }, { cc: "15", name: "Air & Pneumatic" },
              { cc: "16", name: "Tanks & Vessels" }, { cc: "17", name: "Safety Equipment" }, { cc: "18", name: "Power Generation" },
              { cc: "19", name: "Tooling" }, { cc: "20", name: "OEM Assembly" }, { cc: "21", name: "Fastener" },
              { cc: "22", name: "Consumables" },
            ].map((c) => (
              <div key={c.cc} className="flex items-center gap-2 p-1.5 bg-muted/40 rounded border border-border">
                <span className="font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded text-[10px]">{c.cc}</span>
                <span className="text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Sub-categories: Structural Steel → CC 10, Rigging → CC 19, PPE → CC 19</p>
        </SubSection>

        <SubSection id="7.3" title="Location Coding Standard">
          <Prose>All store locations use the format below. Codes are validated programmatically. Discipline must match container.</Prose>
          <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2">
            <p className="text-sm font-mono text-center text-foreground font-medium tracking-wide">
              [Container]-[Discipline]-[Bay][Bin]
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Example: <span className="font-mono font-medium text-foreground">C01-EL-A3</span> = Container 01, Electrical, Bay A, Bin 3
            </p>
          </div>

          {/* Code structure breakdown */}
          <div className="grid sm:grid-cols-4 gap-1.5 text-xs mt-2">
            {[
              { segment: "Container", format: "C0X", meaning: "C01–C05" },
              { segment: "Discipline", format: "XX", meaning: "EL, IN, ME, MP, CS" },
              { segment: "Bay", format: "A–H, J–K", meaning: "Wall position (skip I)" },
              { segment: "Bin", format: "1–99", meaning: "Bin number within bay" },
            ].map((s) => (
              <div key={s.segment} className="p-2 bg-muted/40 rounded border border-border text-center">
                <p className="font-medium text-foreground">{s.segment}</p>
                <p className="font-mono text-primary">{s.format}</p>
                <p className="text-muted-foreground">{s.meaning}</p>
              </div>
            ))}
          </div>

          {/* Bay layout */}
          <div className="grid sm:grid-cols-3 gap-2 mt-2">
            <div className="bg-muted/50 rounded p-2.5 border border-border">
              <p className="text-xs font-medium text-foreground mb-1">Left Wall</p>
              <div className="flex flex-wrap gap-1">
                {["A", "B", "C", "D"].map((b) => (
                  <span key={b} className="px-2 py-0.5 rounded text-xs bg-background border border-border font-mono">{b}</span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded p-2.5 border border-border">
              <p className="text-xs font-medium text-foreground mb-1">Right Wall</p>
              <div className="flex flex-wrap gap-1">
                {["E", "F", "G", "H"].map((b) => (
                  <span key={b} className="px-2 py-0.5 rounded text-xs bg-background border border-border font-mono">{b}</span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded p-2.5 border border-border">
              <p className="text-xs font-medium text-foreground mb-1">Rear / Doors</p>
              <div className="flex flex-wrap gap-1">
                {["J", "K"].map((b) => (
                  <span key={b} className="px-2 py-0.5 rounded text-xs bg-background border border-border font-mono">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Container examples */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 mt-2 text-xs">
            {[
              { code: "C01-EL-A3", desc: "Electrical, Left wall bay A, bin 3" },
              { code: "C02-IN-E1", desc: "Instrumentation, Right wall bay E, bin 1" },
              { code: "C03-ME-J2", desc: "Mechanical, Rear wall bay J, bin 2" },
              { code: "C04-MP-B5", desc: "Mech Precision, Left wall bay B, bin 5" },
              { code: "C05-CS-H12", desc: "Consumables, Right wall bay H, bin 12" },
            ].map((e) => (
              <div key={e.code} className="flex items-center gap-2 p-1.5 bg-muted/40 rounded border border-border">
                <span className="font-mono font-bold text-primary">{e.code}</span>
                <span className="text-muted-foreground">{e.desc}</span>
              </div>
            ))}
          </div>

          {/* External LD codes */}
          <div className="mt-3">
            <h4 className="text-xs font-medium text-foreground mb-1.5">External Storage: LD Prefix</h4>
            <div className="bg-muted/50 border border-border rounded-lg p-2.5 mb-2">
              <p className="text-sm font-mono text-center text-foreground font-medium">LD-[Bay][Position]</p>
              <p className="text-xs text-muted-foreground text-center">Example: LD-A1, LD-C3</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="bg-muted/50 rounded p-2.5 border border-border">
                <p className="text-xs font-medium text-foreground mb-1">Dome Internal Rows</p>
                <div className="flex gap-1">
                  {["A", "B"].map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded text-xs bg-background border border-border font-mono">LD-{b}</span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">5m forklift clearance between dome and container rows</p>
              </div>
              <div className="bg-muted/50 rounded p-2.5 border border-border">
                <p className="text-xs font-medium text-foreground mb-1">Yard Bays</p>
                <div className="flex gap-1">
                  {["C", "D", "E", "F"].map((b) => (
                    <span key={b} className="px-2 py-0.5 rounded text-xs bg-background border border-border font-mono">LD-{b}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Validation rules */}
          <div className="mt-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-1.5">Validation Rules</p>
            <div className="grid sm:grid-cols-2 gap-1 text-xs text-emerald-700 dark:text-emerald-300">
              {[
                "Discipline must match container (C01 = EL only)",
                "No duplicate location codes across entire store",
                "Bay letters skip I (A–H, then J–K)",
                "Bin numbers range 1–99",
                "All external codes must start with LD prefix",
                "External bays limited to A–F only",
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-1.5"><span className="mt-0.5">✓</span><span>{r}</span></div>
              ))}
            </div>
          </div>
        </SubSection>

        <SubSection id="7.4" title="Discipline Code Map">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-1.5 text-xs">
            {[
              { code: "C01-EL", label: "Electrical – Positive Airflow", color: "bg-yellow-500/10 border-yellow-500/30" },
              { code: "C02-IN", label: "Instrumentation, Pneumatics & Fittings", color: "bg-purple-500/10 border-purple-500/30" },
              { code: "C03-ME", label: "Mechanical (40ft)", color: "bg-blue-500/10 border-blue-500/30" },
              { code: "C04-MP", label: "Mechanical Precision", color: "bg-cyan-500/10 border-cyan-500/30" },
              { code: "C05-CS", label: "Consumables & Supplies", color: "bg-slate-500/10 border-slate-500/30" },
              { code: "LD", label: "Laydown Yard (External)", color: "bg-muted/50 border-border" },
            ].map((d) => (
              <div key={d.code} className={`flex items-center gap-2 p-2 rounded border ${d.color}`}>
                <span className="font-mono font-bold text-foreground">{d.code}</span>
                <span className="text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection id="7.5" title="Category-to-Container Mapping">
          <Prose>Supplier catalogue entries are mapped to the 25-category TCMG taxonomy, ensuring supplier part references align with site category codes and container allocation.</Prose>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {[
              { container: "C01-EL", categories: "CC 07 (Electrical), CC 18 (Power Gen)" },
              { container: "C02-IN", categories: "CC 06 (Instrumentation), CC 15 (Air & Pneumatic)" },
              { container: "C03-ME", categories: "CC 08 (Conveyor), CC 09 (Wear), CC 10 (Mechanical), CC 11 (Pipe Fitting)" },
              { container: "C04-MP", categories: "CC 01 (Pump), CC 04 (Bearing), CC 12 (Seal)" },
              { container: "C05-CS", categories: "CC 19 (Tooling/PPE), CC 21 (Fastener), CC 22 (Consumables)" },
            ].map((m) => (
              <div key={m.container} className="p-2 bg-muted/40 rounded border border-border">
                <span className="font-mono font-bold text-foreground">{m.container}: </span>
                <span className="text-muted-foreground">{m.categories}</span>
              </div>
            ))}
          </div>
        </SubSection>

        <SubSection id="7.6" title="Asset Linkage">
          <Prose>Each inventory item includes a field for associated asset tag, enabling future integration with the CMMS asset register for direct equipment-to-spare traceability. Auto-numbering utility ensures collision-free generation across both visual parts and site spares catalogues.</Prose>
        </SubSection>
      </Section>




      {/* ============================================================ */}
      {/*  8. Implementation Sequence                                  */}
      {/* ============================================================ */}
      <Section number="8" title="Implementation Sequence" icon={ListOrdered}>
        <Prose>
          Delivery is structured across defined stages to manage risk, resource loading, and operational continuity. Each stage has defined gate criteria before proceeding to the next. The sequence reflects the actual construction and commissioning order.
        </Prose>
        <div className="space-y-3">
          {[
            {
              stage: "1",
              title: "Survey & Civil Design",
              deliverables: [
                "Topographic site survey completed (RL markers confirmed)",
                "Slab specification and concrete block placement plan confirmed",
                "Compound footprint pegged and approved",
              ],
            },
            {
              stage: "2",
              title: "Relocation of Obstructions",
              deliverables: [
                "Water tank relocated toward crib room side",
                "Skip bins and waste containers moved to designated waste management zone",
                "Compound footprint cleared and verified for earthworks access",
              ],
            },
            {
              stage: "3",
              title: "Earthworks",
              deliverables: [
                "Earthworks contractor mobilised",
                "Cut and fill to achieve RL 355.99 formation level",
                "Regrading to direct surface water right of compound into existing dam",
                "Compaction testing completed and certified",
              ],
            },
            {
              stage: "4",
              title: "Concrete Slab & Block Placement",
              deliverables: [
                "Slab formwork and reinforcement placed",
                "Main slab poured (125mm thickness, graded to fall away from container openings)",
                "Concrete blocks purchased and delivered to site",
                "Blocks positioned at container corner casting and structural load points",
                "Curing period completed, slab ready for loading",
              ],
            },
            {
              stage: "5",
              title: "Container Placement",
              deliverables: [
                "Containers delivered to site (purchased, 4× 20ft, 1× 40ft)",
                "Concrete blocks verified for level and alignment",
                "Containers craned onto blocks in U-shaped configuration",
                "Internal shims installed to ensure water cannot track into doorways",
                "Containers levelled and secured",
              ],
            },
            {
              stage: "6",
              title: "Dome Installation & Enclosure",
              deliverables: [
                "12m × 9.5m dome roof structure installed over the container compound",
                "Fabric/sheeting installed over dome frame",
                "Partial end walls installed (rear and sides)",
                "Full front end wall constructed with electric roller door",
                "Angle bar / flashing installed at dome-to-container roof junctions",
                "Weather-rated sealant applied at all contact points",
                "Structure certified and sealed, inspected prior to handover",
              ],
            },
            {
              stage: "7",
              title: "Internal Fitout",
              deliverables: [
                 "Shelving, bin panels, drawer units installed per container spec (C01 to C05)",
                 "Bin walls, PPE racks, bunded shelves, and special cabinets fitted",
                 "Labelling applied: bay codes, bin numbers, discipline markings",
                "Electrical fit-out (lighting, power, dust-controlled airflow for C01-EL)",
                "Wurth cabinet and flammable cabinet positioned",
              ],
            },
            {
              stage: "8",
              title: "Inventory Load & System Setup",
              deliverables: [
                "Stock transferred from existing locations into allocated containers",
                "System data entry: part numbers, bin locations, quantities",
                "Location coding verified against physical placement",
                "Min/Max and reorder points configured",
              ],
            },
            {
              stage: "9",
              title: "Operational Go-Live",
              deliverables: [
                "Staff training on stock-in / stock-out procedures",
                "Procedure activation: receiving, issuing, returns",
                "First Wednesday revision cycle commenced",
                "Handover to operational team",
              ],
            },
          ].map((s) => (
            <div key={s.stage} className="border border-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2.5 bg-muted/50">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{s.stage}</span>
                <span className="font-semibold text-sm text-foreground">{s.title}</span>
              </div>
              <div className="px-4 py-3 space-y-1.5">
                {s.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-muted-foreground/50 mt-0.5">•</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>




      {/* ============================================================ */}
      {/*  9. Budget Snapshot                                         */}
      {/* ============================================================ */}
      <Section number="9" title="Budget Snapshot" icon={DollarSign}>
        <Prose>
          The following table provides a structured cost summary for the warehouse implementation. All figures are indicative and subject to final procurement and contractor quotations.
        </Prose>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Item</TableHead>
                <TableHead className="text-xs font-semibold text-right">Estimated Cost (AUD)</TableHead>
                <TableHead className="text-xs font-semibold">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                 ["Civil & Earthworks (MMS day rate)", "~$12,416", "MMS plant & operators, 15hr avg across 900m³ haulage. Supplying our own dirt"],
                 ["Roller Hire (Barber Hire)", "$450 / day", "Compaction roller, 2 days estimate"],
                 ["Blue Rock (Barber Hire)", "TBC", "Compaction material, quote pending"],
                 ["Concrete Blocks ×14 (DPP)", "$2,575", "1000×1000×100mm, 240kg each, $183.92 inc GST per block. 2 weeks lead + 5 days to complete, excl. delivery"],
                 ["Concrete Slab Pour", "$25,069", "125mm slab"],
                 ["Dome Roof Structure", "Purchased", "Dome already ordered"],
                 ["Full Endwall with Doorway (CASA1200AIMFD)", "$13,570", "Allshelter 12m, container inside mounted, Wind Region A, excl. shipping"],
                 ["Partial Endwall (CASA1200AIMPE)", "$8,730", "Allshelter 12m, container inside mounted, Wind Region A, excl. shipping"],
                 ["Electric Roller Shutter (RS6060A)", "$22,130", "Allshelter electric roller shutter, excl. shipping"],
                 ["Containers (×5)", "Purchased", "On their way, already procured prior to this plan"],
                ["Internal Fitout (all containers)", "—", "Shelving, racks, bin panels, labels"],
                ["Laydown Yard Preparation", "—", "Gravel, bollards, signage, sheltering"],
                
              ].map(([item, cost, notes], i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-medium">{item}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{cost}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{notes}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell className="text-xs font-bold">Quoted / Estimated to Date</TableCell>
                <TableCell className="text-xs text-right font-mono font-bold">~$85,390</TableCell>
                <TableCell className="text-xs text-muted-foreground">Not final. Excludes blue rock, delivery, shipping, internal fitout, laydown yard &amp; other pending quotes</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <Prose>Note: Supporting quotes and supplier correspondence can be provided on request.</Prose>
      </Section>

      

      {/* ============================================================ */}
      {/*  10. Implementation Pathway & Approval Requirements          */}
      {/* ============================================================ */}
      <Section number="10" title="Implementation Pathway &amp; Approval Requirements" icon={ShieldAlert}>
        <Prose>
          The Central Stores Warehouse plan is now fully defined from a design, operational, and financial perspective.
        </Prose>
        <Prose>
          All structural layout, stock control logic, asset numbering integration, and civil requirements have been documented and costed to the extent practical prior to construction.
        </Prose>

        <SubSection id="10-pending" title="Pending Approvals">
          <Prose>This plan is implementation-ready pending approval of the following:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Civil &amp; earthworks scope</li>
            <li>Concrete slab and plinth installation</li>
            <li>Dome enclosure and structural fit-out</li>
            <li>Container placement and modification</li>
            <li>Shelving and internal fit-out procurement</li>
          </ul>
        </SubSection>

        <SubSection id="10-sequence" title="Execution Sequence">
          <Prose>Once approved, execution will proceed in the following controlled sequence:</Prose>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
            <li>Site preparation &amp; relocations</li>
            <li>Earthworks &amp; compaction</li>
            <li>Slab and plinth installation</li>
            <li>Container positioning</li>
            <li>Dome installation &amp; weather sealing</li>
            <li>Internal fit-out &amp; zone allocation</li>
            <li>System go-live (stock control enforcement)</li>
          </ol>
        </SubSection>

        <SubSection id="10-why" title="Why This Cannot Wait">
          <Prose>
            No stock system can be fully implemented without the physical warehouse infrastructure in place. The warehouse is the enabling foundation that supports:
          </Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Accurate inventory control</li>
            <li>Critical spare governance</li>
            <li>Reduced emergency freight exposure</li>
            <li>Improved wrench time</li>
            <li>Long-term asset reliability</li>
            <li>Enable full system integration with Minesite AI or any system</li>
          </ul>
          <Prose>
            Delaying physical infrastructure will directly delay system stabilisation and cost control improvements.
          </Prose>
        </SubSection>

        {/* Closing statement */}
        <Card className="border-primary/30 bg-primary/5 mt-6">
          <CardContent className="p-4">
            <p className="text-sm text-foreground font-medium">
              This document represents the full operational blueprint for Central Stores implementation.
            </p>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
};
