import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hash, CheckCircle2, Target, Layers, ArrowRight } from "lucide-react";

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
            <CardTitle className="text-xl">Site Part Numbering Standards</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Site-based spare parts numbering system for Tennant Creek
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
            This standard defines how all spare parts are numbered at Tennant Creek to ensure:
          </p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {["Consistent identification", "Easy searching", "Clean system integration", "Scalability for future sites"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-background rounded-md p-2 border border-border">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground italic">
            This is a site-based numbering system, not an OEM or supplier numbering system.
          </p>
        </div>

        {/* Part Number Structure */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h4 className="font-medium text-foreground">Part Number Structure</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            All parts are assigned a 6-digit numeric site part number:
          </p>
          <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-6 py-3">
            <code className="text-2xl font-mono font-bold text-primary">SSCCNN</code>
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
                  <TableCell>Site Code</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">CC</TableCell>
                  <TableCell>Part Category</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">NN</TableCell>
                  <TableCell>Sequential Number</TableCell>
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
          <p className="text-xs text-muted-foreground italic">
            Category codes are global across the site.
          </p>
        </div>

        {/* Sequential Number */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground">Sequential Number (NN)</h4>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Starts at <span className="font-mono font-bold">01</span></li>
            <li>Increments per category</li>
            <li>Maximum 99 per category (expandable later)</li>
          </ul>
        </div>

        {/* Example Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Example Breakdown</h4>
          <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-6 py-3 mb-4">
            <code className="text-2xl font-mono font-bold text-primary">100301</code>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono font-bold">SS</TableCell>
                  <TableCell>10 (Tennant Creek)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold">CC</TableCell>
                  <TableCell>03 (Gearboxes)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold">NN</TableCell>
                  <TableCell>01 (first gearbox)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Key Rules */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Key Rules</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { rule: "One Part = One Number", desc: "One physical part = one site part number" },
              { rule: "OEM Stored Separately", desc: "OEM part numbers are stored separately" },
              { rule: "No Asset Embedding", desc: "Asset numbers are not embedded in part numbers" },
              { rule: "Numbers Never Change", desc: "Numbers never change once assigned" },
              { rule: "Gaps Not Reused", desc: "Gaps in numbering are not reused" },
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

        {/* Future Expansion */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground">Future Expansion</h4>
          <p className="text-sm text-muted-foreground">
            If any category exceeds 99 items, numbering expands to:
          </p>
          <div className="flex items-center gap-3">
            <code className="font-mono font-bold text-muted-foreground">SSCCNN</code>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
            <code className="font-mono font-bold text-primary">SSCCNNN</code>
          </div>
          <p className="text-xs text-muted-foreground">
            Existing part numbers remain unchanged.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground">Summary</h4>
          <p className="text-sm text-muted-foreground">This system provides:</p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
            {["Short, clean numbers", "Easy grouping", "Fast searching", "System independence", "Future scalability"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-background rounded-md p-2 border border-border">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-xs font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
