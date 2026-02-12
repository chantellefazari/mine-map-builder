import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hash, CheckCircle2, Target, Layers, Info, AlertTriangle, ClipboardList } from "lucide-react";

export const SitePartNumberingSection = () => {
  const categoryData = [
    { code: "01", name: "Pumps", examples: "Slurry pumps, centrifugal pumps, dosing pumps, CIP pumps, lube pumps" },
    { code: "02", name: "Motors", examples: "All electric motors (any size, voltage, duty)" },
    { code: "03", name: "Gearboxes / Reducers", examples: "Gear reducers, speed reducers, SEW / Flender / Falk gearboxes" },
    { code: "04", name: "Bearings", examples: "Ball, roller, spherical bearings, plummer blocks" },
    { code: "05", name: "Valves", examples: "Ball, knife gate, pinch, butterfly, solenoid, safety valves" },
    { code: "06", name: "Instrumentation", examples: "Flow, level, pressure, temperature, density, pH, cyanide analysers" },
    { code: "07", name: "Electrical Components", examples: "VSDs, contactors, relays, PLC cards, breakers, terminals" },
    { code: "08", name: "Conveying Components", examples: "Rollers, pulleys, belts, idlers, scrapers, skirts" },
    { code: "09", name: "Wear Parts", examples: "Liners, lifters, chute liners, ceramic/rubber wear panels" },
    { code: "10", name: "Structural & Mechanical", examples: "Frames, guards, brackets, supports, handrails" },
    { code: "11", name: "Hoses & Pipework", examples: "HDPE pipe, rubber hose, bends, flanges, couplings" },
    { code: "12", name: "Seals & Gaskets", examples: "Mechanical seals, O-rings, gaskets, packings" },
    { code: "13", name: "Filters", examples: "Filter presses, cartridges, strainers, breathers" },
    { code: "14", name: "Lubrication System Components", examples: "Lube pumps, coolers, injectors, filters, manifolds" },
    { code: "15", name: "Air & Pneumatic Components", examples: "Compressors, receivers, regulators, actuators" },
    { code: "16", name: "Tanks & Vessels", examples: "Process tanks, CIP tanks, reagent tanks, sumps" },
    { code: "17", name: "Safety Equipment", examples: "Safety showers, eyewash, pressure relief, guarding" },
    { code: "18", name: "Power Generation & Distribution", examples: "Generators, transformers, substations, distribution boards" },
    { code: "19", name: "Tools & Workshop Equipment", examples: "Lifting gear, torque tools, workshop equipment" },
    { code: "20", name: "OEM Assemblies / Packages", examples: "Pump skids, lube skids, filter press packages" },
    { code: "21", name: "Fasteners", examples: "Bolts, nuts, studs, washers" },
    { code: "22", name: "Consumables", examples: "Oils, grease, chemicals, belts, rags" },
    { code: "23", name: "Unknown / To Be Confirmed", examples: "Temporary category pending walkdowns & updated P&IDs" },
  ];

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Site Parts Numbering Standard (TCMG)</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Approved 7-digit numeric format for Tennant Creek Mine
            </p>
          </div>
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
            This standard defines the site-based internal part number used at Tennant Creek Mine for <strong className="text-foreground">searching, cataloguing, and inventory control</strong>.
          </p>
          <p className="text-xs text-muted-foreground italic">
            This is not a supplier or OEM part number.
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
                  <TableCell>Site Code (2 digits)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">CC</TableCell>
                  <TableCell>Part Category Code (2 digits)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">NNN</TableCell>
                  <TableCell>Sequential Identifier (3 digits)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Site Code */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground">Site Code (SS)</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site</TableHead>
                  <TableHead className="w-20">Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Tennant Creek</TableCell>
                  <TableCell className="font-mono font-bold text-primary">10</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground">
            All Tennant Creek parts start with <span className="font-mono font-bold text-primary">10</span>.
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Examples</h4>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { number: "1003001", desc: "Site 10, Category 03, Part 001" },
              { number: "1003099", desc: "Site 10, Category 03, Part 099" },
              { number: "1003100", desc: "Site 10, Category 03, Part 100" },
            ].map((ex) => (
              <div key={ex.number} className="space-y-2">
                <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-5 py-2">
                  <code className="text-xl font-mono font-bold text-primary">{ex.number}</code>
                </div>
                <p className="text-sm text-muted-foreground">{ex.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">
            Sequential supports more than 99 parts per category.
          </p>
        </div>

        {/* Part Category Codes */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Part Category Code (CC)</h4>
          <p className="text-sm text-muted-foreground">
            Each part is assigned a 2-digit category code based on what it physically is.
          </p>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Code</TableHead>
                  <TableHead className="w-48">Category Name</TableHead>
                  <TableHead>What It Covers / Examples</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((cat) => (
                  <TableRow key={cat.code}>
                    <TableCell className="font-mono font-bold text-primary">{cat.code}</TableCell>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{cat.examples}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Rules */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Rules (Non-Negotiable)</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "Numbers Only", desc: "No letters, no alphanumeric characters" },
              { rule: "One Part = One Number", desc: "One unique part number per item — never reused" },
              { rule: "Sequential Numbering", desc: "Sequential within each category (001, 002, 003…)" },
              { rule: "Leading Zeros Required", desc: "Always use 3-digit format: 001, 002, 003" },
              { rule: "Immutable Once Assigned", desc: "Do not change part numbers after assignment" },
              { rule: "Per-Category Sequence", desc: "Each category maintains its own NNN sequence" },
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
              "Confirm the correct Part Category Code (CC)",
              "Identify the highest existing NNN in that category",
              "Assign the next available number",
              "Record the number in the Site Parts Catalogue",
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
            <li>OEM / Supplier numbers must be stored in a <strong className="text-foreground">separate field</strong></li>
            <li>This site part number is the <strong className="text-foreground">primary identifier</strong> used for stores, cataloguing, and searching</li>
            <li>This standard governs <strong className="text-foreground">future numbering only</strong></li>
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
  );
};
