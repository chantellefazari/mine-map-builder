import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Hash, CheckCircle2, Target, Layers, Info, AlertTriangle, ClipboardList, FileText } from "lucide-react";
import { SitePartNumberingDocument } from "./SitePartNumberingDocument";

export const SitePartNumberingSection = () => {
  const [docOpen, setDocOpen] = useState(false);
  const categoryData = [
    { code: "01", name: "Pump Component", examples: "Slurry pumps, centrifugal pumps, dosing pumps, impellers, volutes, pump casings, lantern rings, throat bushes, pump sleeves, wet end kits", container: "C04-MP / C03-ME / LD" },
    { code: "02", name: "Motor Component", examples: "Electric motors (all sizes), motor assemblies, motor couplings, motor fans, spare motors", container: "LD / C04-MP" },
    { code: "03", name: "Gearbox", examples: "Gear reducers, speed reducers, SEW-Eurodrive, Flender, Falk, helical & planetary gearboxes, worm drives", container: "LD" },
    { code: "04", name: "Bearing", examples: "Ball bearings, roller bearings, tapered, spherical, pillow blocks, plummer blocks, bearing housings, adapters", container: "C04-MP" },
    { code: "05", name: "Valve", examples: "Ball, knife gate, pinch, butterfly, check, solenoid, gate, globe, control, diaphragm, needle valves", container: "C02-IN / C03-ME / LD" },
    { code: "06", name: "Instrumentation", examples: "Flow meters, level sensors, pressure transmitters, temperature probes, RTDs, pH probes, encoders, analysers, conductivity sensors", container: "C02-IN" },
    { code: "07", name: "Electrical", examples: "VSDs, contactors, relays, PLC cards, circuit breakers, cables, terminals, cable glands, soft starters, enclosures, conduit, heat shrink, cable ties", container: "C01-EL" },
    { code: "08", name: "Conveyor Component", examples: "Rollers, idlers, pulleys, belts, belt scrapers, belt cleaners, skirting, v-belts, sprockets, chains, fenner pulleys, misalignment switches", container: "C03-ME / LD" },
    { code: "09", name: "Wear Parts", examples: "Crusher liners, cone liner concave/mantle, jaw plates, cyclone liners, chute liners, wear plates, screen panels, rubber liner, mill liners", container: "LD / C03-ME" },
    { code: "10", name: "Mechanical", examples: "Flexible couplings, shaft couplings, brackets, clamps, mounts, frames, guards, supports, handrails, flexseal couplings, durasleeve carriers", container: "C03-ME" },
    { code: "10b", name: "Structural Steel", examples: "SHS, RHS, square & rectangular hollow sections, C-channel, equal angle, flat bar, steel plate, star pickets, bollards", container: "LD" },
    { code: "11", name: "Pipe Fitting", examples: "Hoses (air, water, hydraulic, drag), nylon tubing, BSP fittings (nipples, elbows, reducers, tees, bushes), flanges, couplings, camlock, hosetails, PE/Plasson fittings, saddle clamps, pipe spools, repair clamps", container: "C02-IN / C03-ME" },
    { code: "12", name: "Seal", examples: "Mechanical seals, o-rings, gaskets, gland packing, oil seals, lip seals, diaphragm seals, PTFE sheet, seal kits, gasket sets", container: "C04-MP" },
    { code: "13", name: "Filter", examples: "CAT/Donaldson/Fleetguard engine & air filters, hydraulic filters, oil filters, fuel filters, fuel water separators, breathers, filter elements, strainers", container: "C05-CS / C02-IN" },
    { code: "14", name: "Lubrication System", examples: "Lube pumps, lube coolers, lube injectors, grease pumps, divider valves, auto-lube systems, oil coolers, Graco equipment", container: "C04-MP / C05-CS" },
    { code: "15", name: "Air & Pneumatic", examples: "Air receivers, compressors, side channel blowers, pneumatic actuators, pneumatic cylinders, air regulators, FRL units, pneumatic fittings, Norgren components", container: "C02-IN / LD" },
    { code: "16", name: "Tanks & Vessels", examples: "Process tanks, CIP tanks, reagent tanks, sumps, hoppers, heat exchangers (Dynacool), storage vessels", container: "LD" },
    { code: "17", name: "Safety Equipment", examples: "Safety showers, eyewash stations, machine guards, pull-wire systems, e-stops, fire extinguishers, fire blankets, spill kits, safety signage", container: "C05-CS" },
    { code: "18", name: "Power Generation", examples: "Generators, alternators, substations, distribution boards, busbar, capacitor banks, power factor correction equipment", container: "LD / C01-EL" },
    { code: "19", name: "Tooling", examples: "Hand tools (wrenches, spanners, drill bits), power tools (Milwaukee, Makita, DeWalt), torque tools, annular cutters, site boxes, fluid extractors, gravity tables, Sydney Tools items", container: "C05-CS" },
    { code: "19b", name: "Rigging", examples: "Slings (round, flat, web), chain blocks, lever hoists, shackles (dee, bow), wire rope, turnbuckles, hook and eye sets, jack chain, ear-lokt buckles, garrick equipment", container: "C03-ME" },
    { code: "19c", name: "PPE", examples: "Hard hats, safety glasses, face shields, respirators, earmuffs, earplugs, nitrile gloves, riggers gloves, hi-vis vests, safety harnesses, fall arrest lanyards", container: "C05-CS" },
    { code: "20", name: "OEM Assembly", examples: "Complete pump skids, lube skids, filter press packages, complete OEM assemblies, skid-mounted packages", container: "LD" },
    { code: "21", name: "Fastener", examples: "Bolts (hex, cap, set), nuts (hex, nyloc, lock), washers (flat, spring), studs, anchors, rivets, zinc plated hardware, grade 8 fasteners", container: "C05-CS" },
    { code: "22", name: "Consumables", examples: "Flap discs, cutting wheels, grinding discs, abrasives, lubricants, grease, degreaser, adhesives, sealants, paint, batteries, anti-corrosion products", container: "C05-CS / Flammable Cabinet" },
  ];

  return (
    <>
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">Stock Code Standard (TCMG)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Approved 7-digit numeric stock code format for Tennant Creek Mine - aligned with live inventory categories
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0" onClick={() => setDocOpen(true)}>
            <FileText className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Purpose */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Purpose</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            This standard defines the site-based internal stock code used at Tennant Creek Mine for <strong className="text-foreground">searching, cataloguing, and inventory control</strong>.
          </p>
          <p className="text-xs text-muted-foreground italic">
            This is not a supplier or OEM part number. OEM / supplier numbers must be stored in a separate field. The stock code is the site's internal identifier.
          </p>
        </div>

        {/* Approved Format */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Approved Format (7 Digits — Numbers Only)</h4>
          </div>
          <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-6 py-3">
            <code className="text-2xl font-mono font-bold text-primary">SSCCNNN</code>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Code</TableHead>
                  <TableHead>Meaning</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">SS</TableCell>
                  <TableCell>Site Code — always <strong>10</strong> for Tennant Creek</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">CC</TableCell>
                  <TableCell>Part Category Code (2 digits, e.g. 01 = Pump Component)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">NNN</TableCell>
                  <TableCell>Sequential Identifier within that category (001–999)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Examples</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { number: "1001001", desc: "Site 10 · Pump Component (CC 01) · Part 001" },
              { number: "1004015", desc: "Site 10 · Bearing (CC 04) · Part 015" },
              { number: "1021099", desc: "Site 10 · Fastener (CC 21) · Part 099" },
            ].map((ex) => (
              <div key={ex.number} className="space-y-2">
                <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-5 py-2">
                  <code className="text-xl font-mono font-bold text-primary">{ex.number}</code>
                </div>
                <p className="text-sm text-muted-foreground">{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Part Category Codes */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Part Category Codes (CC) — Live Inventory Aligned</h4>
          <p className="text-sm text-muted-foreground">
            Each part is assigned a 2-digit category code based on what it physically is. These categories are live and match the site_spares inventory system. The <strong className="text-foreground">Container</strong> column shows the default storage zone for each category.
          </p>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">CC</TableHead>
                  <TableHead className="w-44">Category</TableHead>
                  <TableHead>What It Covers / Examples</TableHead>
                  <TableHead className="w-40">Default Storage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((cat) => (
                  <TableRow key={cat.code}>
                    <TableCell className="font-mono font-bold text-primary">{cat.code}</TableCell>
                    <TableCell className="font-medium text-sm">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{cat.examples}</TableCell>
                    <TableCell>
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{cat.container}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground italic">
            * CC 10b (Structural Steel) and CC 19b (Rigging) and CC 19c (PPE) are sub-categories of CC 10 and CC 19 respectively and use their own sequential NNN series.
          </p>
        </div>

        {/* Rules */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Rules (Non-Negotiable)</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "Numbers Only", desc: "No letters, no alphanumeric characters in the stock code" },
              { rule: "One Part = One Number", desc: "One unique part number per item — never reused" },
              { rule: "Sequential Numbering", desc: "Sequential within each category (001, 002, 003…)" },
              { rule: "Leading Zeros Required", desc: "Always use 3-digit format: 001, 002, 003" },
              { rule: "Immutable Once Assigned", desc: "Do not change part numbers after assignment" },
              { rule: "Per-Category Sequence", desc: "Each category maintains its own independent NNN sequence" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-2 bg-background rounded-md p-3 border border-border">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">{item.rule}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation Process */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Allocation Process</h4>
          </div>
          <div className="space-y-3">
            {[
              "Confirm the correct Part Category Code (CC) — match the physical part to the category table above",
              "Identify the highest existing NNN in that category from the Site Spares Catalogue",
              "Assign the next available sequential stock code",
              "Record the stock code in the Site Spares Catalogue and update the CMMS",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <h4 className="font-medium text-foreground">Notes</h4>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>OEM / Supplier numbers must be stored in a <strong className="text-foreground">separate field</strong> — never as the stock code</li>
            <li>This stock code is the <strong className="text-foreground">primary identifier</strong> used for stores, cataloguing, barcode scanning, and CMMS</li>
            <li>All 25 categories are live and aligned with the site_spares inventory system</li>
            <li>Auto-numbering is available in the Site Spares Catalogue module</li>
          </ul>
        </div>

        {/* Explicit Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-foreground">Explicit Notice</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            This document <strong className="text-foreground">does not alter any existing part numbers</strong>. It defines the approved numbering standard for future part creation at Tennant Creek Mine.
          </p>
        </div>
      </CardContent>
    </Card>

    {/* Professional PDF Document Dialog */}
    <Dialog open={docOpen} onOpenChange={setDocOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <SitePartNumberingDocument onClose={() => setDocOpen(false)} />
      </DialogContent>
    </Dialog>
    </>
  );
};
