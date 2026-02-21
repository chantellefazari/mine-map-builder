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
          This document constitutes the complete implementation plan for the Tennant Creek Mine Group (TCMG) stores and warehouse infrastructure. It replaces ad-hoc storage arrangements with a purpose-built, governed warehouse compound designed to eliminate emergency freight exposure, reduce labour waste, prevent component contamination, and establish full inventory traceability from receipt to issue.
        </Prose>
        <Prose>
          The plan covers civil preparation, structural design, container allocation, operational procedures, inventory numbering, asset tagging, and staged delivery. It is structured to read as an execution-ready document — not a proposal — and forms the single source of truth for all warehouse-related decision-making at TCMG.
        </Prose>
        <Prose>
          Infrastructure investment is justified by measurable reductions in: emergency freight costs, technician search time, component re-ordering due to damage or loss, and administrative overhead from uncontrolled stock movements.
        </Prose>
        <ImagePlaceholder label="Site overview or compound render" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  2. Current State Assessment                                 */}
      {/* ============================================================ */}
      <Section number="2" title="Current State Assessment" icon={AlertTriangle}>
        <Prose>
          The current storage arrangement at TCMG presents multiple operational, safety, and financial risks that this plan directly addresses:
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">Drainage Issues:</span> Existing pad areas lack adequate drainage, resulting in water pooling around containers during wet season events. This accelerates corrosion of stored components and creates slip hazards.</li>
          <li><span className="font-medium text-foreground">Uncontrolled Storage:</span> Components are stored across multiple ad-hoc locations with no formal zone allocation, bin coding, or access control. Items are frequently lost, duplicated, or damaged.</li>
          <li><span className="font-medium text-foreground">Emergency Freight Exposure:</span> Inability to locate on-hand stock regularly triggers emergency freight orders, with associated premium costs and production delays.</li>
          <li><span className="font-medium text-foreground">Labour Inefficiency:</span> Technicians routinely spend 30–60 minutes searching for parts across unstructured storage areas, directly reducing wrench time.</li>
          <li><span className="font-medium text-foreground">Contamination Risk:</span> Electrical and instrumentation components stored alongside mechanical parts are exposed to dust, moisture, and metallic contaminants, reducing service life and reliability.</li>
        </ul>
        <ImagePlaceholder label="Current state photos — drainage, ad-hoc storage areas" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  3. Civil & Earthworks Scope                                 */}
      {/* ============================================================ */}
      <Section number="3" title="Civil &amp; Earthworks Scope" icon={Shovel}>
        <Prose>
          All civil works are referenced against the site survey and existing infrastructure constraints. The scope establishes the foundation for the warehouse compound and laydown yard.
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">Survey Reference:</span> Works are aligned to the latest topographic survey with established benchmarks for level control.</li>
          <li><span className="font-medium text-foreground">Cut &amp; Fill:</span> Site requires levelling to achieve consistent falls for drainage. Excess material to be used for laydown yard base preparation.</li>
          <li><span className="font-medium text-foreground">Drainage Redirection:</span> Surface water to be redirected away from the container compound via graded swales and a perimeter drain connected to the existing stormwater network.</li>
          <li><span className="font-medium text-foreground">Tank Relocation:</span> Existing water/fuel tanks to be relocated to the crib room side of the compound to clear the footprint and improve pedestrian separation.</li>
          <li><span className="font-medium text-foreground">Slab Logic:</span> Reinforced concrete slabs under each container position (minimum 100mm thick, SL82 mesh) with provision for future extension. Expansion joints at container boundaries.</li>
          <li><span className="font-medium text-foreground">Container Block Strategy:</span> Containers positioned on concrete plinths with 50mm clearance for airflow and moisture prevention. Block layout follows the U-shape compound design.</li>
          <li><span className="font-medium text-foreground">Bin Relocations:</span> Existing skip bins and waste containers relocated to a designated waste management zone outside the warehouse perimeter.</li>
        </ul>
        <ImagePlaceholder label="Civil works plan / site survey overlay" />
      </Section>

      <Separator />

      {/* ============================================================ */}
      {/*  4. Warehouse Structural Design                              */}
      {/* ============================================================ */}
      <Section number="4" title="Warehouse Structural Design" icon={Building2}>
        <Prose>
          The warehouse compound is designed as a U-shape configuration covered by a barrel-vault dome roof, providing weather protection for the internal courtyard while maintaining natural ventilation.
        </Prose>
        <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
          <li><span className="font-medium text-foreground">Dome Specification:</span> 12m × 9.5m barrel-vault dome roof (DomeShelter or equivalent), galvanised steel frame, UV-stabilised PVC fabric, rated for Region B wind loading.</li>
          <li><span className="font-medium text-foreground">Roller Door Check-In Zone:</span> Primary receiving point at the compound entrance with a roller door for controlled access. All deliveries processed at this point before entering storage zones.</li>
          <li><span className="font-medium text-foreground">Container Layout:</span> Five containers arranged in a U-shape — C01-EL, C02-IN, C04-MP, and C05-CS (all 20ft) flanking the 40ft C03-ME base container. The 40ft container is flush-aligned with the side containers.</li>
          <li><span className="font-medium text-foreground">Slab Layout:</span> Individual slabs per container with a central courtyard slab (broom-finished concrete) for the receiving and staging area.</li>
          <li><span className="font-medium text-foreground">Pedestrian Flow:</span> Marked pedestrian walkway from the compound entrance through the courtyard. No forklift access within the dome — all container items are ≤15 kg manual handling.</li>
          <li><span className="font-medium text-foreground">Laydown Yard:</span> Adjacent to the dome compound, extending ~35m total depth. Includes forklift access lane, delivery zone, and structured bays LD-A through LD-F with designated category allocations.</li>
        </ul>
        <ImagePlaceholder label="Compound layout drawing / 3D render" />
        <ImagePlaceholder label="Dome roof specification sheet" />
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
