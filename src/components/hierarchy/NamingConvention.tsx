import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Area Codes (Level 3)
const areaCodes = [
  { code: "SITE", meaning: "Site Infrastructure", description: "Buildings, admin, amenities, and site-wide services" },
  { code: "UTL", meaning: "Utilities & Power", description: "Compressed air, electrical, power generation, water systems, reagents" },
  { code: "COM", meaning: "Comminution / Process", description: "Feed/reclaim, milling, grinding, classification, conveying" },
  { code: "REC", meaning: "Gold Recovery", description: "Gravity circuit, CIP, elution, gold room, carbon regeneration" },
  { code: "TAIL", meaning: "Tailings", description: "Thickening, filtration, tailings storage facility" },
  { code: "SUP", meaning: "Support Services", description: "Workshop, laboratory, maintenance infrastructure" },
];

// Equipment Type Prefixes
const equipmentPrefixes = [
  // Mechanical
  { prefix: "APRN", meaning: "Apron Feeder", example: "APRN001", category: "Feed Systems" },
  { prefix: "BM", meaning: "Ball Mill", example: "BM001", category: "Milling" },
  { prefix: "COMP", meaning: "Air Compressor", example: "COMP01", category: "Utilities" },
  { prefix: "CV", meaning: "Conveyor", example: "CV01, CV02", category: "Material Handling" },
  { prefix: "CYC", meaning: "Cyclone / Cyclone Cluster", example: "CYC001", category: "Classification" },
  { prefix: "DRYR", meaning: "Air Dryer", example: "DRYR01", category: "Utilities" },
  { prefix: "FP", meaning: "Filter Press", example: "FP01, FP02", category: "Filtration" },
  { prefix: "GEN", meaning: "Generator", example: "GEN001-GEN008", category: "Power Generation" },
  { prefix: "HPCP", meaning: "High Pressure Compressor", example: "HPCP001", category: "Utilities" },
  { prefix: "KLN", meaning: "Kiln", example: "KLN001", category: "Carbon Regeneration" },
  { prefix: "KNC", meaning: "Knelson Concentrator", example: "KNC001", category: "Gravity" },
  { prefix: "MFC", meaning: "Mill Feed Conveyor", example: "MFC001", category: "Feed Systems" },
  { prefix: "RCVR", meaning: "Air Receiver", example: "RCVR01", category: "Utilities" },
  { prefix: "SCN", meaning: "Screen", example: "SCN001-SCN004", category: "Screening" },
  { prefix: "SHK", meaning: "Shaking Table", example: "SHK001", category: "Gravity" },
  { prefix: "THK", meaning: "Thickener", example: "THK001", category: "Tailings" },
  { prefix: "TRSCR", meaning: "Trash Screen", example: "TRSCR001", category: "Screening" },
  
  // Pumps & Fluid Handling
  { prefix: "PMP", meaning: "Pump (Generic)", example: "PMP001-PMP016", category: "Pumps" },
  { prefix: "PCFPA/PCFPB", meaning: "Primary Cyclone Feed Pump A/B", example: "PCFPA001", category: "Pumps" },
  { prefix: "THKUFP", meaning: "Thickener Underflow Pump", example: "THKUFP-A", category: "Pumps" },
  { prefix: "CIPPMP", meaning: "CIP Tailings Pump", example: "CIPPMP-A", category: "Pumps" },
  
  // Tanks & Vessels
  { prefix: "CIP-TK", meaning: "CIP Tank", example: "CIP-TK01 to CIP-TK08", category: "Tanks" },
  { prefix: "FHOP", meaning: "Feed Hopper", example: "FHOP001", category: "Feed Systems" },
  { prefix: "FSTK", meaning: "Fuel Storage Tank", example: "FSTK001", category: "Fuel" },
  { prefix: "GWTR", meaning: "Gland Water System", example: "GWTR001", category: "Water" },
  { prefix: "LSILO", meaning: "Lime Storage Silo", example: "LSILO001", category: "Reagents" },
  { prefix: "PWT", meaning: "Potable Water Tank", example: "PWT001", category: "Water" },
  { prefix: "PWP", meaning: "Process Water Pond", example: "PWP001", category: "Water" },
  { prefix: "RHOP", meaning: "Reclaim Hopper", example: "RHOP001", category: "Feed Systems" },
  { prefix: "RWT", meaning: "Raw Water Tank", example: "RWT001", category: "Water" },
  
  // Electrical
  { prefix: "MDB", meaning: "Main Distribution Board", example: "MDB001", category: "Electrical" },
  { prefix: "SDB", meaning: "Sub Distribution Board", example: "SDB001", category: "Electrical" },
  { prefix: "CR", meaning: "Control Room", example: "CR001", category: "Electrical" },
  { prefix: "LTW", meaning: "Lighting Tower", example: "LTW001-LTW005", category: "Electrical" },
  { prefix: "MSUB", meaning: "Main Sub Station", example: "MSUB001", category: "Electrical" },
  
  // Gold Room & Recovery
  { prefix: "AGT", meaning: "Agitator", example: "AGT001-AGT008", category: "Agitation" },
  { prefix: "EWCL", meaning: "Electrowinning Cell", example: "EWCL001", category: "Gold Room" },
  { prefix: "GEW", meaning: "Gravity Electrowinning", example: "GEW001", category: "Gold Room" },
  { prefix: "GR", meaning: "Gold Room", example: "GR-SCL-01, GR-FRN-01", category: "Gold Room" },
  { prefix: "REC", meaning: "Rectifier", example: "REC001", category: "Gold Room" },
  { prefix: "CALC", meaning: "Calcine Oven", example: "CALC001", category: "Gold Room" },
  
  // Carbon Handling
  { prefix: "BCDS", meaning: "Barren Carbon Dewatering Screen", example: "BCDS001", category: "Carbon Regen" },
  { prefix: "CREG", meaning: "Carbon Regeneration", example: "CREG001", category: "Carbon Regen" },
  { prefix: "RCTR", meaning: "Regenerated Carbon Transfer", example: "RCTR001", category: "Carbon Regen" },
  { prefix: "RKHP", meaning: "Regen Kiln Hopper", example: "RKHP001", category: "Carbon Regen" },
  
  // Reagents & Dosing
  { prefix: "CBB", meaning: "Cyanide Bag Breaker", example: "CBB001", category: "Reagents" },
  { prefix: "CABB", meaning: "Caustic Bag Breaker", example: "CABB001", category: "Reagents" },
  { prefix: "CMIX", meaning: "Cyanide Mixing", example: "CMIX001", category: "Reagents" },
  { prefix: "FLOC", meaning: "Flocculant System", example: "FLOC001", category: "Reagents" },
  { prefix: "LDOS", meaning: "Lime Dosing System", example: "LDOS001", category: "Reagents" },
  
  // Infrastructure
  { prefix: "SINF", meaning: "Site Infrastructure", example: "SINF001-SINF008", category: "Buildings" },
  { prefix: "SVC", meaning: "Services", example: "SVC001", category: "Infrastructure" },
  { prefix: "WKSHP", meaning: "Workshop", example: "WKSHP001", category: "Support" },
  { prefix: "LAB", meaning: "Laboratory", example: "LAB001", category: "Support" },
];

// Component Suffixes (after hyphen)
const componentSuffixes = [
  { suffix: "MTR", meaning: "Motor", example: "BM001-MTR001", category: "Rotating" },
  { suffix: "GBX", meaning: "Gearbox", example: "BM001-GBX001", category: "Rotating" },
  { suffix: "GMR", meaning: "Gearmotor", example: "APRN001-GMR001", category: "Rotating" },
  { suffix: "VSD", meaning: "Variable Speed Drive", example: "BM001-VSD001", category: "Electrical" },
  { suffix: "MCC", meaning: "Motor Control Centre Cell", example: "BM001-MCC001", category: "Electrical" },
  { suffix: "LCS", meaning: "Local Control Station", example: "BM001-LCS001", category: "Electrical" },
  { suffix: "PNL", meaning: "Control Panel", example: "CR001-PNL001", category: "Electrical" },
  { suffix: "DB", meaning: "Distribution Board", example: "SINF003-DB001", category: "Electrical" },
  { suffix: "LP", meaning: "Lighting & Power Board", example: "MDB001-LP001", category: "Electrical" },
  { suffix: "PMP", meaning: "Pump", example: "BM001-PMP001", category: "Pumps" },
  { suffix: "VLV", meaning: "Valve", example: "COMP01-VLV001", category: "Valves" },
  { suffix: "TK", meaning: "Tank", example: "CMIX001-TK001", category: "Vessels" },
  { suffix: "PIPE", meaning: "Piping", example: "THK001-PIPE001", category: "Piping" },
  { suffix: "CHU", meaning: "Chute", example: "FHOP001-CHU001", category: "Material Handling" },
  { suffix: "HOP", meaning: "Hopper", example: "CREG001-HOP001", category: "Material Handling" },
  { suffix: "FDR", meaning: "Feeder", example: "RKHP001-FDR001", category: "Material Handling" },
  { suffix: "EXC", meaning: "Exciter (Screen/Vibrator)", example: "TRSCR001-EXC001", category: "Screening" },
  { suffix: "ENG", meaning: "Engine", example: "GEN001-ENG001", category: "Engines" },
  { suffix: "ALT", meaning: "Alternator", example: "GEN001-ALT001", category: "Engines" },
  { suffix: "BRN", meaning: "Burner", example: "KLN001-BRN001", category: "Thermal" },
  { suffix: "HTR", meaning: "Heater", example: "DRYR01-HTR001", category: "Thermal" },
  { suffix: "FAN", meaning: "Fan", example: "KLN001-FAN001", category: "Ventilation" },
  { suffix: "VIB", meaning: "Vibrator", example: "LSILO001-VIB001", category: "Material Handling" },
  { suffix: "AGT", meaning: "Agitator", example: "CIP-TK01-AGT001", category: "Agitation" },
  { suffix: "ALF", meaning: "Air Lift", example: "CIP-ALF01", category: "Transfer" },
  { suffix: "RCVR", meaning: "Receiver", example: "HPCP001-RCVR001", category: "Vessels" },
  { suffix: "HYD", meaning: "Hydraulic System/Pack", example: "BM001-HYD001", category: "Hydraulics" },
  { suffix: "CYL", meaning: "Hydraulic Cylinder", example: "BM001-CYL001", category: "Hydraulics" },
  { suffix: "MNR", meaning: "Monorail", example: "THK001-MNR001", category: "Lifting" },
  { suffix: "HOOD", meaning: "Extraction Hood", example: "CALC001-HOOD001", category: "Ventilation" },
];

// Instrumentation Suffixes
const instrumentationSuffixes = [
  { suffix: "SWT", meaning: "Switch", example: "RCVR01-SWT001", category: "Switches" },
  { suffix: "PWS", meaning: "Pull Wire Switch", example: "CV01-PWS001", category: "Safety" },
  { suffix: "USS", meaning: "Underspeed Switch", example: "MFC001-USS001", category: "Switches" },
  { suffix: "BAS", meaning: "Belt Alignment Drift Switch", example: "MFC001-BAS001", category: "Safety" },
  { suffix: "HLS", meaning: "High Level Switch", example: "FHOP001-HLS001", category: "Switches" },
  { suffix: "TX", meaning: "Transmitter", example: "APRN001-TX001", category: "Instrumentation" },
  { suffix: "SEN", meaning: "Sensor", example: "MFC001-SEN001", category: "Instrumentation" },
  { suffix: "FM", meaning: "Flow Meter", example: "THK001-FM001", category: "Instrumentation" },
  { suffix: "DT", meaning: "Density Transmitter", example: "PCFI001-DT001", category: "Instrumentation" },
  { suffix: "LT", meaning: "Level Transmitter", example: "TAILHOP001-LT001", category: "Instrumentation" },
  { suffix: "PG", meaning: "Pressure Gauge", example: "CYC001-PG001", category: "Instrumentation" },
  { suffix: "TG", meaning: "Temperature Gauge", example: "EWCL001-TG001", category: "Instrumentation" },
  { suffix: "INS", meaning: "Instrument (General)", example: "CYC001-INS001", category: "Instrumentation" },
  { suffix: "WTM", meaning: "Weightometer", example: "MFC001-WTM001", category: "Instrumentation" },
];

// Special Naming Patterns
const specialPatterns = [
  { pattern: "-D / -S", meaning: "Duty / Standby designation", example: "UTL-PW-PMP-D, UTL-PW-PMP-S" },
  { pattern: "-A / -B", meaning: "Parallel unit designation", example: "PCFPA001, PCFPB001" },
  { pattern: "-01 to -08", meaning: "Sequential numbering for identical units", example: "CIP-TK01 to CIP-TK08" },
  { pattern: "GEN-ADM", meaning: "Generator location prefix", example: "GEN-ADM001 (Admin)" },
  { pattern: "GEN-LAB", meaning: "Generator location prefix", example: "GEN-LAB001 (Laboratory)" },
  { pattern: "GEN-JUNO", meaning: "Generator location prefix", example: "GEN-JUNO001 (Juno Bore)" },
  { pattern: "GRD-", meaning: "Grinding auxiliary system", example: "GRD-LP-LPUMP-D (Low Pressure Lube Pump)" },
  { pattern: "CIP-", meaning: "CIP circuit identifier", example: "CIP-TK01, CIP-ALF01, CIP-SHW01" },
  { pattern: "REAG-", meaning: "Reagent area identifier", example: "REAG-SHW001 (Reagent Safety Shower)" },
  { pattern: "-SHW", meaning: "Safety Shower", example: "CIP-SHW01, GR-SHW01" },
];

// Unique categories for badges
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Feed Systems": "bg-orange-100 text-orange-800",
    "Milling": "bg-purple-100 text-purple-800",
    "Utilities": "bg-blue-100 text-blue-800",
    "Material Handling": "bg-amber-100 text-amber-800",
    "Classification": "bg-cyan-100 text-cyan-800",
    "Filtration": "bg-teal-100 text-teal-800",
    "Power Generation": "bg-yellow-100 text-yellow-800",
    "Screening": "bg-lime-100 text-lime-800",
    "Gravity": "bg-emerald-100 text-emerald-800",
    "Tailings": "bg-stone-100 text-stone-800",
    "Pumps": "bg-sky-100 text-sky-800",
    "Tanks": "bg-indigo-100 text-indigo-800",
    "Water": "bg-blue-100 text-blue-800",
    "Reagents": "bg-rose-100 text-rose-800",
    "Electrical": "bg-violet-100 text-violet-800",
    "Agitation": "bg-fuchsia-100 text-fuchsia-800",
    "Gold Room": "bg-yellow-100 text-yellow-800",
    "Carbon Regen": "bg-gray-100 text-gray-800",
    "Buildings": "bg-slate-100 text-slate-800",
    "Infrastructure": "bg-zinc-100 text-zinc-800",
    "Support": "bg-neutral-100 text-neutral-800",
    "Rotating": "bg-red-100 text-red-800",
    "Valves": "bg-pink-100 text-pink-800",
    "Vessels": "bg-indigo-100 text-indigo-800",
    "Piping": "bg-cyan-100 text-cyan-800",
    "Engines": "bg-orange-100 text-orange-800",
    "Thermal": "bg-red-100 text-red-800",
    "Ventilation": "bg-sky-100 text-sky-800",
    "Hydraulics": "bg-amber-100 text-amber-800",
    "Lifting": "bg-stone-100 text-stone-800",
    "Safety": "bg-red-100 text-red-800",
    "Switches": "bg-violet-100 text-violet-800",
    "Instrumentation": "bg-emerald-100 text-emerald-800",
    "Fuel": "bg-orange-100 text-orange-800",
    "Transfer": "bg-teal-100 text-teal-800",
  };
  return colors[category] || "bg-muted text-muted-foreground";
};

export const NamingConvention: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Asset Numbering Logic</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            The TCMG asset numbering system follows a structured format designed for CMMS/D365 integration. 
            Each asset number encodes the equipment type, location, and relationship to parent systems.
          </p>
          <p className="font-medium text-foreground">
            Format: <code className="bg-muted px-2 py-0.5 rounded font-mono">[PREFIX][NUMBER]-[SUFFIX][NUMBER]</code>
          </p>
          <p>
            Example: <code className="bg-muted px-2 py-0.5 rounded font-mono">BM001-MTR001</code> = Ball Mill 001 – Motor 001
          </p>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="areas">Areas</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="instruments">Instruments</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        {/* Area Codes */}
        <TabsContent value="areas" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Area Codes (Level 3)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead className="w-48">Meaning</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {areaCodes.map((area) => (
                    <TableRow key={area.code}>
                      <TableCell className="font-mono font-bold text-primary">{area.code}</TableCell>
                      <TableCell className="font-medium">{area.meaning}</TableCell>
                      <TableCell className="text-muted-foreground">{area.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Equipment Prefixes */}
        <TabsContent value="equipment" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Equipment Type Prefixes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Prefix</TableHead>
                    <TableHead className="w-56">Meaning</TableHead>
                    <TableHead className="w-48">Example</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipmentPrefixes.map((item) => (
                    <TableRow key={item.prefix}>
                      <TableCell className="font-mono font-bold text-primary">{item.prefix}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Component Suffixes */}
        <TabsContent value="components" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Component Suffixes (After Hyphen)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Suffix</TableHead>
                    <TableHead className="w-56">Meaning</TableHead>
                    <TableHead className="w-48">Example</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentSuffixes.map((item) => (
                    <TableRow key={item.suffix}>
                      <TableCell className="font-mono font-bold text-primary">{item.suffix}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instrumentation Suffixes */}
        <TabsContent value="instruments" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Instrumentation Suffixes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Suffix</TableHead>
                    <TableHead className="w-56">Meaning</TableHead>
                    <TableHead className="w-48">Example</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {instrumentationSuffixes.map((item) => (
                    <TableRow key={item.suffix}>
                      <TableCell className="font-mono font-bold text-primary">{item.suffix}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Special Patterns */}
        <TabsContent value="patterns" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Special Naming Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-32">Pattern</TableHead>
                    <TableHead className="w-64">Meaning</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specialPatterns.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono font-bold text-primary">{item.pattern}</TableCell>
                      <TableCell className="font-medium">{item.meaning}</TableCell>
                      <TableCell className="font-mono text-muted-foreground text-xs">{item.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
