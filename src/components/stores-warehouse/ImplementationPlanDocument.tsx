import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground">
        {number}. {title}
      </h2>
    </div>
    <div className="pl-12 space-y-4">{children}</div>
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
  <div className="space-y-2">
    <h3 className="text-base font-semibold text-foreground">
      {id} {title}
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
              <p className="font-medium text-foreground">Maintenance &amp; Projects</p>
            </div>
            <div>
              <span className="text-muted-foreground">Date</span>
              <p className="font-medium text-foreground">February 2026</p>
            </div>
            <div>
              <span className="text-muted-foreground">Status</span>
              <p className="font-medium text-foreground">Draft — For Review</p>
            </div>
            <div>
              <span className="text-muted-foreground">Classification</span>
              <p className="font-medium text-foreground">Internal — Operational</p>
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
          <li>The agreed storage model (containers C01–C05 + LD laydown)</li>
          <li>The location coding structure (container / bay / bin logic)</li>
          <li>Stock control procedure (receiving, issuing, audits)</li>
          <li>The implementation sequence and dependencies (relocations → earthworks → slab → placement → fit-out → controls)</li>
        </ul>
        <Prose>
          Design visuals, survey inputs, and supporting evidence are included in the relevant sections of this document.
        </Prose>
      </Section>

      <Separator />

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

      <Separator />

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
            <li>Supports container zoning structure (C01–C05 + LD)</li>
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

        <SubSection id="3.4" title="Drainage Strategy">
          <Prose>
            The selected area currently shows uncontrolled surface water movement and erosion toward the dam during wet season events. Civil works will include:
          </Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Regrading to establish consistent fall away from container pads</li>
            <li>Perimeter swale to intercept runoff</li>
            <li>Controlled redirection of stormwater toward existing flow paths</li>
            <li>Elimination of ponding around container positions</li>
          </ul>
          <Prose>
            <span className="font-medium text-foreground">Objective:</span> No standing water within the compound footprint and stabilisation of the adjacent roadway.
          </Prose>
          <Prose>
            This approach addresses both warehouse construction and an existing drainage risk within a single coordinated scope.
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

      <Separator />

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
            <li>1 × 40ft container (rear wall — Mechanical bulk storage)</li>
            <li>4 × 20ft containers (side walls — Electrical, Instrumentation, Mechanical Precision, Consumables)</li>
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
                <li>Surface runoff will be directed away from the warehouse footprint toward established drainage paths</li>
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
          <Prose>The warehouse enforces discipline through layout — not policy alone.</Prose>
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


          {/* 3D Render */}
          <div className="mt-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">3D warehouse compound model</p>
            <img src="/images/warehouse-3d-render.png" alt="3D rendered model of warehouse compound showing containers, dome, laydown yard and delivery zone" className="rounded-lg border border-border w-full" />
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Interactive 3D Model Available — </span>
              A fully interactive 3D version of this warehouse design is available within the application. 
              Contact the project team to request access to the live 3D visualisation, which includes container interiors, 
              roller door operation, and laydown yard navigation.
            </p>
          </div>
        </div>
      </Section>

      <Separator />

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
                <span className="font-semibold text-sm text-foreground">C01-EL — Electrical</span>
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
                <span className="font-semibold text-sm text-foreground">C02-IN — Instrumentation &amp; Pneumatics</span>
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
                <span className="font-semibold text-sm text-foreground">C03-ME — Mechanical</span>
                <span className="text-[10px] text-muted-foreground ml-auto">40ft Standard · High-density bins</span>
              </div>
              {[
                { name: "Wear Parts & Liners", items: ["Small wear plates (<15 kg)", "Chute liners (rubber, ceramic, <15 kg)"] },
                { name: "Conveyor & Drive", items: ["Rollers", "Idlers", "Pulleys", "Scraper blades", "Belt cleaners", "Belts (V-belt, drive belt)", "Belt fasteners", "Sprockets", "Chains"] },
                { name: "Valves, Pipe & Fittings", items: ["Valves (ball, butterfly, knife gate, check — <DN150)", "Pipe fittings", "Flanges", "Elbows", "Tees", "Reducers", "Nipples", "Hoses", "Couplings (heavy)"] },
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
                <span className="font-semibold text-sm text-foreground">C04-MP — Mechanical Precision</span>
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
                <span className="font-semibold text-sm text-foreground">C05-CS — Consumables &amp; Supplies</span>
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

        <SubSection id="5.6" title="LD — Laydown Yard">
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
            A capacity scan has been performed against the physical fitout of each container to confirm that current SKU counts fit within available bin positions. All zones are confirmed clear.
          </Prose>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Zone</TableHead>
                <TableHead className="text-xs">Type</TableHead>
                <TableHead className="text-xs text-right">SKUs</TableHead>
                <TableHead className="text-xs text-right">Bin Positions</TableHead>
                <TableHead className="text-xs text-right">Items/Bin</TableHead>
                <TableHead className="text-xs text-right">Usage</TableHead>
                <TableHead className="text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { zone: "C01-EL", type: "20ft", skus: 444, bins: 274, note: "ESD panels absorb bulk small parts" },
                { zone: "C02-IN", type: "20ft", skus: 349, bins: 273, note: "Drawer cabinets absorb fittings" },
                { zone: "C03-ME", type: "40ft", skus: 545, bins: 540, note: "Near-perfect fit at double length" },
                { zone: "C04-MP", type: "20ft", skus: 227, bins: 302, note: "25% growth buffer available" },
                { zone: "C05-CS", type: "20ft", skus: 462, bins: 338, note: "Bin walls consolidate fasteners" },
                { zone: "LD", type: "Yard", skus: 113, bins: null, note: "6 bays, forklift-accessible" },
                { zone: "Wurth", type: "Cabinet", skus: 44, bins: null, note: "Dedicated mobile cabinet" },
                { zone: "Flammable", type: "Cabinet", skus: 6, bins: null, note: "AS1940-compliant" },
              ].map((row) => {
                const ratio = row.bins ? (row.skus / row.bins).toFixed(2) : "—";
                const usage = row.bins ? `${Math.min(100, Math.round((row.skus / row.bins) * 100))}%` : "—";
                return (
                  <TableRow key={row.zone}>
                    <TableCell className="text-xs font-medium">{row.zone}</TableCell>
                    <TableCell className="text-xs">{row.type}</TableCell>
                    <TableCell className="text-xs text-right">{row.skus}</TableCell>
                    <TableCell className="text-xs text-right">{row.bins ?? "—"}</TableCell>
                    <TableCell className="text-xs text-right">{ratio}</TableCell>
                    <TableCell className="text-xs text-right">{usage}</TableCell>
                    <TableCell className="text-xs text-green-600 dark:text-green-400">✅ Fits</TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="font-medium">
                <TableCell className="text-xs">Total</TableCell>
                <TableCell className="text-xs">—</TableCell>
                <TableCell className="text-xs text-right">2,190</TableCell>
                <TableCell className="text-xs text-right">1,727</TableCell>
                <TableCell className="text-xs text-right" colSpan={2}>—</TableCell>
                <TableCell className="text-xs text-green-600 dark:text-green-400">✅ All Clear</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Prose>
            Density thresholds: items/bin &gt; 2.0 = crowded; &gt; 3.0 = critical. No zones currently exceed these thresholds. The full interactive capacity scan with furniture breakdowns and progress bars is available in the Capacity Scan tab.
          </Prose>
        </SubSection>
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  6. Stores Operational Flow                                  */}
      {/* ============================================================ */}
      <Section number="6" title="Stores Operational Flow" icon={ArrowRightLeft}>
        <Prose>
          Operational procedures govern all stock movements to ensure 100% traceability across C01–C05 and LD areas. The objective is to eliminate the "just grab it" culture and establish a disciplined stores process. All stock movements must be recorded in the system before, during, or immediately after the physical movement.
        </Prose>

        <SubSection id="6.1" title="Stock In — Receiving">
          <Prose>All inbound stock must pass through the roller door check-in zone on the concrete slab. No part is permitted to enter containers without system entry.</Prose>
          <div className="space-y-1.5">
            {["Verify PO against delivery docket", "Inspect for damage", "Confirm quantity and correct part number", "Photograph part (if new to catalogue)", "Apply internal part label (if required)", "Enter into system — date, PO number, supplier, received-by (all mandatory)", "Assign bin location (C01–C05 or LD allocation)", "Physically place in allocated location"].map((step, i) => (
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

        <SubSection id="6.2" title="Stock Out — Issue">
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
                { label: "Issued To", value: "Mandatory — named person" },
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
          <Prose>Heavy assemblies (&gt;15 kg), large motors, pumps, gearboxes — forklift access required.</Prose>
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
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">Weekly — Wednesday Revision Day (Y26-WXX)</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                {["Spot check high-critical spares", "Review below-minimum items", "Reconcile discrepancies", "Review emergency freight occurrences"].map((c, i) => (
                  <div key={i} className="flex items-start gap-2"><span className="text-muted-foreground/50">•</span><span>{c}</span></div>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-3">
              <p className="text-xs font-medium text-foreground uppercase tracking-wide mb-2">Monthly — Rotating Container Audit</p>
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
              { label: "Max Qty", desc: "Upper limit — prevents overstocking in limited container space" },
              { label: "Reorder Point", desc: "Lead-time-adjusted trigger for procurement action" },
              { label: "Review Cycle", desc: "Monthly against consumption data — adjustments documented with justification" },
            ].map((item, i) => (
              <div key={i} className="p-2.5 bg-muted/40 rounded border border-border">
                <span className="font-medium text-foreground">{item.label}: </span>
                <span className="text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </SubSection>
      </Section>

      <Separator />

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
                <p className="font-bold text-primary text-xs uppercase">SS — Site Code</p>
                <p className="text-muted-foreground mt-1">Always <span className="font-mono font-bold">10</span> (TCMG)</p>
              </div>
              <div className="text-center p-2 bg-blue-500/5 rounded border border-blue-500/20">
                <p className="font-bold text-blue-600 text-xs uppercase">CC — Category</p>
                <p className="text-muted-foreground mt-1">01–22 (see taxonomy)</p>
              </div>
              <div className="text-center p-2 bg-emerald-500/5 rounded border border-emerald-500/20">
                <p className="font-bold text-emerald-600 text-xs uppercase">NNN — Sequence</p>
                <p className="text-muted-foreground mt-1">001–999 per category</p>
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
          <Prose>All store locations use the format below. Codes are validated programmatically — discipline must match container.</Prose>
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
            <h4 className="text-xs font-medium text-foreground mb-1.5">External Storage — LD Prefix</h4>
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

      <Separator />

      {/* ============================================================ */}
      {/*  8. Implementation Sequence                                  */}
      {/* ============================================================ */}
      <Section number="8" title="Implementation Sequence" icon={ListOrdered}>
        <Prose>
          Delivery is structured across seven stages to manage risk, resource loading, and operational continuity. Each stage has defined gate criteria before proceeding to the next.
        </Prose>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs font-semibold">Stage</TableHead>
                <TableHead className="text-xs font-semibold">Description</TableHead>
                <TableHead className="text-xs font-semibold">Key Deliverables</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                ["1", "Survey & Civil Design", "Site survey, drainage design, slab specification"],
                ["2", "Earthworks & Slab Construction", "Cut & fill, drainage install, concrete pours"],
                ["3", "Container Procurement & Positioning", "Container purchase/lease, crane placement on slabs"],
                ["4", "Dome Roof Installation", "Dome frame erection, fabric installation, certification"],
                ["5", "Internal Fitout", "Shelving, bin panels, drawer units, labelling per container spec"],
                ["6", "Inventory Load & System Setup", "Stock transfer, system data entry, location coding verification"],
                ["7", "Operational Go-Live", "Staff training, procedure activation, first Wednesday revision"],
              ].map(([stage, desc, deliverables]) => (
                <TableRow key={stage}>
                  <TableCell className="text-xs font-medium whitespace-nowrap">Stage {stage}</TableCell>
                  <TableCell className="text-xs">{desc}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{deliverables}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ImagePlaceholder label="Gantt chart or timeline graphic" />
      </Section>

      <Separator />

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
                ["Civil & Earthworks", "—", "Cut, fill, drainage, slabs"],
                ["Dome Roof Structure", "—", "Supply, install, certification"],
                ["Containers (×5)", "—", "Purchase or lease, delivery, crane"],
                ["Internal Fitout (all containers)", "—", "Shelving, racks, bin panels, labels"],
                ["Laydown Yard Preparation", "—", "Gravel, bollards, signage, sheltering"],
                ["Inventory Initial Load", "—", "Labour, stock transfer, system setup"],
                ["Asset Tagging (Processing Plant)", "—", "316SS tags, engraving, installation"],
                ["Contingency (10%)", "—", "Unforeseen scope or pricing variation"],
              ].map(([item, cost, notes], i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-medium">{item}</TableCell>
                  <TableCell className="text-xs text-right font-mono">{cost}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{notes}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell className="text-xs font-bold">Total Estimated</TableCell>
                <TableCell className="text-xs text-right font-mono font-bold">TBC</TableCell>
                <TableCell className="text-xs text-muted-foreground">Subject to final quotations</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <ImagePlaceholder label="Budget breakdown chart or supporting quotes" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  10. Critical Path & Operational Risk Statement              */}
      {/* ============================================================ */}
      <Section number="10" title="Critical Path &amp; Operational Risk Statement" icon={ShieldAlert}>
        <Prose>
          The following items represent critical-path dependencies and operational risks that must be actively managed throughout the implementation sequence. Failure to address these items will directly impact project timeline, budget, and operational readiness.
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">Wet Season Window:</span> Civil and earthworks must be completed before the onset of the wet season to avoid delays and subgrade instability. Concrete pours require minimum 7-day cure before container placement.</li>
          <li><span className="font-medium text-foreground">Container Lead Time:</span> Procurement of modified containers (particularly the 40ft C03-ME) may carry 6–10 week lead times depending on supplier availability and modification scope.</li>
          <li><span className="font-medium text-foreground">Dome Roof Certification:</span> Structural certification must be completed by a qualified engineer before any internal fitout or stock loading commences under the dome.</li>
          <li><span className="font-medium text-foreground">Staff Training:</span> Operational go-live is contingent on all maintenance and stores personnel completing the stock control procedure induction. No unsupervised access until training is verified.</li>
          <li><span className="font-medium text-foreground">System Readiness:</span> Inventory management system (Minesite AI) must be fully configured with location codes, part numbers, and min/max levels before physical stock transfer begins.</li>
          <li><span className="font-medium text-foreground">Concurrent Operations Risk:</span> Warehouse construction activities must be managed to avoid disruption to ongoing plant operations. A construction management plan with exclusion zones and communication protocols is required.</li>
        </ul>
        <ImagePlaceholder label="Critical path schedule or risk matrix" />

        {/* Closing statement */}
        <Card className="border-primary/30 bg-primary/5 mt-6">
          <CardContent className="p-4">
            <p className="text-sm text-foreground font-medium">
              This document constitutes the authorised implementation plan for the TCMG Stores &amp; Warehouse project. All parties are expected to execute in accordance with the stages, standards, and governance defined herein.
            </p>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
};
