import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Hash, CheckCircle2, Target, Layers, Info } from "lucide-react";

export const SitePartNumberingSection = () => {
  const categoryData = [
    { code: "01", name: "Pumps", examples: "Slurry pumps, centrifugal pumps, dosing pumps, CIP pumps, lube pumps", capacity: 359 },
    { code: "02", name: "Motors", examples: "All electric motors (any size, voltage, duty)", capacity: 359 },
    { code: "03", name: "Gearboxes / Reducers", examples: "Gear reducers, speed reducers, SEW / Flender / Falk gearboxes", capacity: 359 },
    { code: "04", name: "Bearings", examples: "Ball, roller, spherical bearings, plummer blocks", capacity: 359 },
    { code: "05", name: "Valves", examples: "Ball, knife gate, pinch, butterfly, solenoid, safety valves", capacity: 359 },
    { code: "06", name: "Instrumentation", examples: "Flow, level, pressure, temperature, density, pH, cyanide analysers", capacity: 359 },
    { code: "07", name: "Electrical Components", examples: "VSDs, contactors, relays, PLC cards, breakers, terminals", capacity: 359 },
    { code: "08", name: "Conveying Components", examples: "Rollers, pulleys, belts, idlers, scrapers, skirts", capacity: 359 },
    { code: "09", name: "Wear Parts", examples: "Liners, lifters, chute liners, ceramic/rubber wear panels", capacity: 359 },
    { code: "10", name: "Structural & Mechanical", examples: "Frames, guards, brackets, supports, handrails", capacity: 359 },
    { code: "11", name: "Hoses & Pipework", examples: "HDPE pipe, rubber hose, bends, flanges, couplings", capacity: 359 },
    { code: "12", name: "Seals & Gaskets", examples: "Mechanical seals, O-rings, gaskets, packings", capacity: 359 },
    { code: "13", name: "Filters", examples: "Filter presses, cartridges, strainers, breathers", capacity: 359 },
    { code: "14", name: "Lubrication System Components", examples: "Lube pumps, coolers, injectors, filters, manifolds", capacity: 359 },
    { code: "15", name: "Air & Pneumatic Components", examples: "Compressors, receivers, regulators, actuators", capacity: 359 },
    { code: "16", name: "Tanks & Vessels", examples: "Process tanks, CIP tanks, reagent tanks, sumps", capacity: 359 },
    { code: "17", name: "Safety Equipment", examples: "Safety showers, eyewash, pressure relief, guarding", capacity: 359 },
    { code: "18", name: "Power Generation & Distribution", examples: "Generators, transformers, substations, distribution boards", capacity: 359 },
    { code: "19", name: "Tools & Workshop Equipment", examples: "Lifting gear, torque tools, workshop equipment", capacity: 359 },
    { code: "20", name: "OEM Assemblies / Packages", examples: "Pump skids, lube skids, filter press packages", capacity: 359 },
    { code: "21", name: "Fasteners", examples: "Bolts, nuts, studs, washers", capacity: 359 },
    { code: "22", name: "Consumables", examples: "Oils, grease, chemicals, belts, rags", capacity: 359 },
    { code: "23", name: "Unknown / To Be Confirmed", examples: "Temporary category pending walkdowns & updated P&IDs", capacity: 359 },
  ];

  const totalCapacity = categoryData.length * 359;

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
            {["Consistent identification", "Easy searching", "Clean system integration", "Scalability for future growth"].map((item, i) => (
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
            All parts are assigned a 6-character alphanumeric site part number:
          </p>
          <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-6 py-3">
            <code className="text-2xl font-mono font-bold text-primary">SSCCXX</code>
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
                  <TableCell>Site Code (numeric)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">CC</TableCell>
                  <TableCell>Part Category (numeric)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">XX</TableCell>
                  <TableCell>Sequential Identifier (alphanumeric — see below)</TableCell>
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
                  <TableHead className="w-24 text-center">Capacity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((cat) => (
                  <TableRow key={cat.code}>
                    <TableCell className="font-mono font-bold text-primary">{cat.code}</TableCell>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{cat.examples}</TableCell>
                    <TableCell className="text-center font-mono text-sm">{cat.capacity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Category codes are global across the site. Total system capacity: <strong className="text-foreground">{totalCapacity.toLocaleString()}</strong> unique parts.
          </p>
        </div>

        {/* Sequential Identifier — Alphanumeric */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-4">
          <h4 className="font-medium text-foreground">Sequential Identifier (XX) — Alphanumeric</h4>
          <p className="text-sm text-muted-foreground">
            The last two characters use an alphanumeric sequence that provides <strong className="text-foreground">359 unique slots</strong> per category without increasing digit count:
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Range</TableHead>
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead className="w-24 text-center">Slots</TableHead>
                  <TableHead>Examples</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">01 – 99</TableCell>
                  <TableCell>Numeric</TableCell>
                  <TableCell className="text-center font-mono">99</TableCell>
                  <TableCell className="text-sm text-muted-foreground">100101, 100199</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">A0 – A9</TableCell>
                  <TableCell>Alpha-Numeric</TableCell>
                  <TableCell className="text-center font-mono">10</TableCell>
                  <TableCell className="text-sm text-muted-foreground">1001A0, 1001A9</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-mono font-bold text-primary">B0 – Z9</TableCell>
                  <TableCell>Alpha-Numeric</TableCell>
                  <TableCell className="text-center font-mono">250</TableCell>
                  <TableCell className="text-sm text-muted-foreground">1001B0 ... 1001Z9</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="bg-background border border-border rounded-md p-3 space-y-2">
            <p className="text-sm font-medium">Allocation order:</p>
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">01</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded">99</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">A0</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">A9</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">B0</span>
              <span className="text-muted-foreground">→ ...</span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">Z9</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Numeric range (01–99) is exhausted first before alpha-numeric allocation begins.
              Letters <strong>I</strong>, <strong>O</strong>, and <strong>Q</strong> are excluded to avoid confusion with digits 1, 0, and 9.
            </p>
          </div>
        </div>

        {/* Excluded Letters Note */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-foreground">Excluded Letters</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            To prevent misreads on printed labels, bin tags, and handwritten orders, the following letters are <strong className="text-foreground">excluded</strong> from the alpha-numeric range:
          </p>
          <div className="flex gap-3">
            {[
              { letter: "I", reason: "Confused with 1" },
              { letter: "O", reason: "Confused with 0" },
              { letter: "Q", reason: "Confused with 9" },
            ].map((item) => (
              <div key={item.letter} className="flex items-center gap-2 bg-background rounded-md px-3 py-2 border border-border">
                <span className="font-mono font-bold text-destructive text-lg">{item.letter}</span>
                <span className="text-xs text-muted-foreground">→ {item.reason}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Effective alpha range: A–H, J–N, P, R–Z = <strong>23 letters × 10 digits = 230 alpha-numeric slots</strong> + 99 numeric = <strong>329 total</strong> (conservative).
            If all 26 letters are used: 260 + 99 = 359 total.
          </p>
        </div>

        {/* Example Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Example Breakdowns</h4>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Numeric example */}
            <div className="space-y-3">
              <div className="inline-block bg-background border-2 border-primary/30 rounded-lg px-6 py-3">
                <code className="text-2xl font-mono font-bold text-primary">100301</code>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono font-bold w-16">SS</TableCell>
                      <TableCell>10 (Tennant Creek)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono font-bold">CC</TableCell>
                      <TableCell>03 (Gearboxes)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono font-bold">XX</TableCell>
                      <TableCell>01 (1st gearbox part)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            {/* Alphanumeric example */}
            <div className="space-y-3">
              <div className="inline-block bg-background border-2 border-emerald-500/30 rounded-lg px-6 py-3">
                <code className="text-2xl font-mono font-bold text-emerald-600">1001A3</code>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono font-bold w-16">SS</TableCell>
                      <TableCell>10 (Tennant Creek)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono font-bold">CC</TableCell>
                      <TableCell>01 (Pumps)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono font-bold">XX</TableCell>
                      <TableCell>A3 (103rd pump part — after 01–99, A0–A2)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
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
              { rule: "Numeric First", desc: "01–99 is exhausted before alpha-numeric allocation" },
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

        {/* Capacity Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground">Capacity Summary</h4>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Categories</TableCell>
                  <TableCell className="text-right font-mono font-bold">{categoryData.length}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Slots per category (numeric 01–99)</TableCell>
                  <TableCell className="text-right font-mono font-bold">99</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Slots per category (alpha-numeric A0–Z9)</TableCell>
                  <TableCell className="text-right font-mono font-bold">260</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total slots per category</TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary">359</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total system capacity</TableCell>
                  <TableCell className="text-right font-mono font-bold text-primary">{totalCapacity.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="text-sm text-muted-foreground">
            This 6-character format maintains barcode compatibility, label readability, and CMMS field-width standards while providing <strong className="text-foreground">3.6×</strong> the capacity of the original numeric-only system.
          </p>
        </div>

        {/* Summary */}
        <div className="bg-muted/50 rounded-lg p-5 space-y-3">
          <h4 className="font-medium text-foreground">System Benefits</h4>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
            {["6-char format preserved", "Barcode compatible", "359 parts/category", "Backward compatible", "CMMS/D365 ready"].map((item, i) => (
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
