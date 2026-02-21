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
  Tag,
  ListOrdered,
  DollarSign,
  ShieldAlert,
  Eye,
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
            The containers remain structurally independent and are positioned on engineered concrete plinth blocks (refer Civil Section).
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

        <SubSection id="4.5" title="Container Storage Logic">
          <Prose>Containers are category-specific:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li><span className="font-medium text-foreground">C01-EL</span> — Electrical</li>
            <li><span className="font-medium text-foreground">C02-IN</span> — Instrumentation &amp; Pneumatics</li>
            <li><span className="font-medium text-foreground">C03-ME</span> — Mechanical Bulk</li>
            <li><span className="font-medium text-foreground">C04-MP</span> — Mechanical Precision</li>
            <li><span className="font-medium text-foreground">C05-CS</span> — Consumables &amp; Fasteners</li>
          </ul>
          <Prose><span className="font-medium text-foreground">Access Rules:</span></Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Entry only via internal slab</li>
            <li>No external rear access</li>
            <li>No forklift entry</li>
            <li>No bulk dumping</li>
          </ul>
          <Prose>
            Each container will be fitted out according to approved stocking plan (refer Container Stocking Scope).
          </Prose>
        </SubSection>

        <SubSection id="4.6" title="Laydown Yard Interface">
          <Prose>Large items (motors, pumps, gearboxes, assemblies):</Prose>
          <ol className="text-sm text-muted-foreground space-y-2 list-decimal pl-5">
            <li>Delivered to front of warehouse</li>
            <li>Logged in system</li>
            <li>Shrink wrapped</li>
            <li>Labelled</li>
            <li>Allocated to LD-coded bay (LD-A, LD-B etc.)</li>
            <li>Moved via forklift to designated laydown area</li>
          </ol>
          <Prose>Heavy assemblies do not enter warehouse.</Prose>
        </SubSection>

        <SubSection id="4.7" title="Operational Controls">
          <Prose>This warehouse structure enforces:</Prose>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Controlled access through single entry point</li>
            <li>Clean separation between receiving and storage</li>
            <li>No uncontrolled forklift movement</li>
            <li>No direct dumping of parts into containers</li>
            <li>No loose floor storage</li>
          </ul>
          <Prose><span className="font-medium text-foreground">All material movement flows:</span></Prose>
          <Prose>Delivery → Goods In Zone → Sorting → Container / Laydown → Controlled Issue</Prose>
        </SubSection>

        <SubSection id="4.8" title="Design Intent">
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

        <SubSection id="5.1" title="C01-EL — Electrical">
          <Prose>
            Dedicated to electrical and power generation components (CC 07, CC 18). Positive airflow environment with dust-controlled entry. Contains 5 shelving bays, ESD bin panels, a lockable PLC cabinet, and ceiling-mounted conduit brackets. Climate-sensitive items stored in sealed anti-static bags.
          </Prose>
          <ImagePlaceholder label="C01-EL internal layout / fitout photo" />
        </SubSection>

        <SubSection id="5.2" title="C02-IN — Instrumentation &amp; Pneumatics">
          <Prose>
            Houses instrumentation, pneumatic, and process fitting components (CC 06, CC 15). Contains 6 shelving bays, drawer units for small fittings, 40 foam-lined storage totes, and a vertical tubing rail. Calibration-sensitive items stored in padded compartments.
          </Prose>
          <ImagePlaceholder label="C02-IN internal layout / fitout photo" />
        </SubSection>

        <SubSection id="5.3" title="C03-ME — Mechanical (40ft)">
          <Prose>
            The largest container, handling general mechanical components (CC 10), hoses and pipework (CC 11), and light wear parts (CC 09). Contains 14–18 heavy-duty bays, a fabricated V-belt rack, and a long material rack for conduit and light bar stock. All items must still meet the ≤15 kg limit — bulk steel and heavy assemblies go to Laydown.
          </Prose>
          <ImagePlaceholder label="C03-ME internal layout / fitout photo" />
        </SubSection>

        <SubSection id="5.4" title="C04-MP — Mechanical Precision">
          <Prose>
            Precision mechanical storage for pumps (CC 01), bearings (CC 04), seals and gaskets (CC 12). Contains 6 shelving bays, seal drawer cabinets, and flat-file style shelves for gaskets. Clean environment with controlled access to prevent contamination of precision components.
          </Prose>
          <ImagePlaceholder label="C04-MP internal layout / fitout photo" />
        </SubSection>

        <SubSection id="5.5" title="C05-CS — Consumables &amp; Supplies">
          <Prose>
            General consumables (CC 22), fasteners (CC 21), PPE (CC 19c), rigging (CC 19b), and tooling (CC 19). Contains 6 shelving bays, 2 bin wall runs for high-frequency items, a PPE rack, and a bunded grease shelf. Highest access frequency — positioned nearest the compound entrance.
          </Prose>
          <ImagePlaceholder label="C05-CS internal layout / fitout photo" />
        </SubSection>

        <SubSection id="5.6" title="LD — Laydown Yard">
          <Prose>
            Reserved for heavy assemblies (&gt;15 kg), oversized items, and critical overflow. LD-A and LD-B are dome-sheltered for critical overflow (green coding). Remaining zones are category-specific: LD-C (Pumps), LD-D (Matec), LD-E (Electrical), and LD-F (Mechanical). All laydown items require weatherproofing (shrink-wrap or tarpaulin) and visible tagging.
          </Prose>
          <ImagePlaceholder label="Laydown yard zone map" />
        </SubSection>
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  6. Stores Operational Flow                                  */}
      {/* ============================================================ */}
      <Section number="6" title="Stores Operational Flow" icon={ArrowRightLeft}>
        <Prose>
          Operational procedures govern all stock movements to ensure 100% traceability across C01–C05 and LD areas. The objective is to eliminate the "just grab it" culture and establish a disciplined stores process.
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">Stock In Process:</span> All deliveries received at the roller door check-in zone. Items are inspected, system-recorded (PO reference, qty, condition), and allocated to their designated container/bay/bin before being physically placed.</li>
          <li><span className="font-medium text-foreground">Stock Out Process:</span> All withdrawals require a Work Order number and Reason field. Items are scanned or manually recorded at the point of issue. No container entry without system recording.</li>
          <li><span className="font-medium text-foreground">Emergency Withdrawal:</span> Nightshift and emergency withdrawals are permitted but must be logged in the system before 10:00 AM the following day. A dedicated emergency log sheet is maintained at the check-in zone.</li>
          <li><span className="font-medium text-foreground">Min/Max Review:</span> Reorder points and min/max quantities are reviewed monthly against consumption data. Adjustments are documented with justification.</li>
          <li><span className="font-medium text-foreground">Weekly Revision Control:</span> Wednesday Revision Day (Y26-WXX format) — spot checks on 10% of high-value items, reorder reviews, and housekeeping inspection.</li>
          <li><span className="font-medium text-foreground">Monthly Audit:</span> Full physical count of one container per month on rotation. Discrepancies investigated and root-cause documented within 48 hours.</li>
        </ul>
        <ImagePlaceholder label="Operational flow diagram — Stock In / Stock Out" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  7. Inventory Logic & Numbering Framework                    */}
      {/* ============================================================ */}
      <Section number="7" title="Inventory Logic &amp; Numbering Framework" icon={Hash}>
        <Prose>
          A unified numbering and coding framework ensures every item in the warehouse is uniquely identified, traceable, and logically allocated.
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">Container Coding Logic:</span> Each container carries a unique identifier (C01–C05, LD) with a discipline suffix (EL, IN, ME, MP, CS). This code is the first element in all location references.</li>
          <li><span className="font-medium text-foreground">Shelf Logic:</span> Bays are labelled A–Z (left to right from entry). Shelves are numbered 1–6 (bottom to top). High-frequency items at levels 2–4 (ergonomic zone).</li>
          <li><span className="font-medium text-foreground">Bin Numbering Logic:</span> Full location code format: [Container]-[Discipline]-[Bay][Shelf] (e.g., C01-EL-A3). Bin panels use the same format with an additional bin position suffix where applicable.</li>
          <li><span className="font-medium text-foreground">Supplier Category Alignment:</span> Supplier catalogue entries are mapped to the 25-category TCMG taxonomy, ensuring supplier part references align with site category codes.</li>
          <li><span className="font-medium text-foreground">Part Numbering Logic:</span> Site part numbers follow the SSCCNNN format (7-digit numeric). SS = Site code (10), CC = Category code (01–23), NNN = Sequential identifier (001–999). Auto-numbering utility ensures collision-free generation across both visual parts and site spares catalogues.</li>
          <li><span className="font-medium text-foreground">Asset Linkage Placeholder:</span> Each inventory item includes a field for associated asset tag, enabling future integration with the CMMS asset register for direct equipment-to-spare traceability.</li>
        </ul>
        <ImagePlaceholder label="Numbering framework diagram / example labels" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  8. Asset Tagging Standard — Processing Plant                */}
      {/* ============================================================ */}
      <Section number="8" title="Asset Tagging Standard — Processing Plant" icon={Tag}>
        <Prose>
          Physical asset tags are designed for rapid visual identification in the field. All complex hierarchy, system structure, and digital references remain in Minesite AI — not on the physical tag.
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">ARN Format:</span> Tags display the Asset ID (Line 1, large bold) and Description (Line 2, 14px equivalent). Two-line, horizontally centred layout only.</li>
          <li><span className="font-medium text-foreground">Material:</span> 316 stainless steel, laser-engraved for durability in harsh mining environments.</li>
          <li><span className="font-medium text-foreground">Standard Sizes:</span> 100 × 50 mm for plates and hanging tags; 80 × 30 mm for adhesive labels on sub-components.</li>
          <li><span className="font-medium text-foreground">Placement Standards:</span> Tags mounted on the non-drive end of rotating equipment, above eye level where possible, and clear of maintenance access points.</li>
          <li><span className="font-medium text-foreground">Hole Punch Option:</span> Single 4mm hole punch for cable-tie or wire mounting on equipment without flat mounting surfaces.</li>
          <li><span className="font-medium text-foreground">No QR Code Standard:</span> QR codes are excluded from the physical tag standard. All digital lookup is performed through Minesite AI search functionality.</li>
        </ul>
        <ImagePlaceholder label="Asset tag example — photo or render" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  9. Implementation Sequence                                  */}
      {/* ============================================================ */}
      <Section number="9" title="Implementation Sequence" icon={ListOrdered}>
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
      {/*  10. Budget Snapshot                                         */}
      {/* ============================================================ */}
      <Section number="10" title="Budget Snapshot" icon={DollarSign}>
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
      {/*  11. Critical Path & Operational Risk Statement              */}
      {/* ============================================================ */}
      <Section number="11" title="Critical Path &amp; Operational Risk Statement" icon={ShieldAlert}>
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
