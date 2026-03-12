import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  areaCodes,
  equipmentPrefixes,
  componentSuffixes,
  instrumentationSuffixes,
  specialPatterns,
} from "@/components/hierarchy/namingConventionData";

const suggestedCrusherPrefixes = [
  { prefix: "CRS", meaning: "Crusher (Jaw / Cone)", example: "CRS01, CRS02, CRS03", notes: "CRS01 Primary Jaw, CRS02 Secondary Cone, CRS03 Tertiary Cone" },
  { prefix: "ROM-BIN", meaning: "ROM Bin", example: "ROM-BIN01", notes: "Steel structure with Hardox liners" },
  { prefix: "ROM-FDR", meaning: "Primary Vibrating Feeder", example: "ROM-FDR01", notes: "Hydraulic drive feeder under ROM bin" },
  { prefix: "PRI-MAG", meaning: "Overband Magnet", example: "PRI-MAG01", notes: "Self-cleaning overband on CRS01 discharge" },
  { prefix: "PRI-GFB", meaning: "Ground Feed Bin", example: "PRI-GFB01", notes: "CV01 discharge into screen feed system" },
  { prefix: "SEC-CFB", meaning: "Cone Feed Bin", example: "SEC-CFB01", notes: "Dual chamber bin feeding CRS02 & CRS03" },
  { prefix: "SCN", meaning: "Vibrating Screen", example: "SCN01", notes: "Horizontal vibrating screen (3-deck)" },
  { prefix: "CV", meaning: "Conveyor", example: "CV01–CV15", notes: "Shared prefix with Processing Plant — different numbering range" },
  { prefix: "SEC-CFB-FDR", meaning: "Cone Feed Vibrating Feeder", example: "SEC-CFB01-FDR01, FDR02", notes: "Feeders A & B under cone feed bin" },
  { prefix: "CV12/CV15", meaning: "Radial Stacker", example: "CV12, CV15", notes: "Fines product radial stackers" },
  { prefix: "MDE", meaning: "Metal Detector", example: "CV07-MDE01", notes: "Component suffix on cone feed conveyors" },
  { prefix: "DST", meaning: "Dust Suppression", example: "DST01", notes: "Spray bars and enclosures" },
  { prefix: "LVL", meaning: "Level Sensor", example: "ROM-BIN01-LVL01", notes: "Vega level sensors on bins" },
];

const reservedPrefixes = equipmentPrefixes.map((e) => e.prefix);

export const NamingConventionDocument = () => {
  return (
    <div className="space-y-6">
      {/* Document Header */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">TCMG Site Asset Naming Convention — Reference Document</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            This document outlines the complete asset numbering logic used across the Tennant Creek Mining Group (TCMG) Processing Plant.
            It is designed to be shared with contractors and OEM suppliers to ensure consistent naming, avoid prefix collisions,
            and maintain a unified site standard across all facilities.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-medium text-foreground">
            <span>Format: <code className="bg-muted px-2 py-0.5 rounded font-mono">[PREFIX][NUMBER]-[SUFFIX][NUMBER]</code></span>
            <span>Example: <code className="bg-muted px-2 py-0.5 rounded font-mono">BM001-MTR001</code> = Ball Mill 001 – Motor 001</span>
          </div>
        </CardContent>
      </Card>

      {/* Section 1: Area Codes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 1</Badge>
            <CardTitle className="text-base">Area Codes (Level 3 of Hierarchy)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Every asset sits under one of these six main areas. The crusher facility will need its own area code — or share an existing one.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Code</TableHead>
                <TableHead className="w-48">Meaning</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areaCodes.map((a) => (
                <TableRow key={a.code}>
                  <TableCell className="font-mono font-bold text-primary">{a.code}</TableCell>
                  <TableCell className="font-medium">{a.meaning}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{a.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2: Equipment Prefixes — RESERVED */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 2</Badge>
            <CardTitle className="text-base">Equipment Type Prefixes — Currently In Use</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            These prefixes are <strong>reserved</strong> across the Processing Plant. Crusher assets must not duplicate these unless the same equipment type is genuinely being used (e.g. CV for conveyors is fine to share).
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Prefix</TableHead>
                <TableHead className="w-52">Equipment Type</TableHead>
                <TableHead>Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentPrefixes.map((e) => (
                <TableRow key={e.prefix}>
                  <TableCell className="font-mono font-bold text-primary">{e.prefix}</TableCell>
                  <TableCell className="font-medium text-sm">{e.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{e.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 3: Component Suffixes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 3</Badge>
            <CardTitle className="text-base">Component Suffixes (After Hyphen)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            When a child component sits under a parent asset, it uses these standardised suffixes. These should be adopted identically in the crusher to keep the site consistent.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Suffix</TableHead>
                <TableHead className="w-52">Component Type</TableHead>
                <TableHead>Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {componentSuffixes.map((c) => (
                <TableRow key={c.suffix}>
                  <TableCell className="font-mono font-bold text-primary">{c.suffix}</TableCell>
                  <TableCell className="font-medium text-sm">{c.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{c.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 4: Instrumentation Suffixes */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 4</Badge>
            <CardTitle className="text-base">Instrumentation Suffixes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Suffix</TableHead>
                <TableHead className="w-52">Instrument Type</TableHead>
                <TableHead>Example</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instrumentationSuffixes.map((i) => (
                <TableRow key={i.suffix}>
                  <TableCell className="font-mono font-bold text-primary">{i.suffix}</TableCell>
                  <TableCell className="font-medium text-sm">{i.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{i.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 5: Special Patterns */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-bold">SECTION 5</Badge>
            <CardTitle className="text-base">Special Naming Patterns</CardTitle>
          </div>
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
              {specialPatterns.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-mono font-bold text-primary">{p.pattern}</TableCell>
                  <TableCell className="font-medium text-sm">{p.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{p.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* Section 6: Suggested Crusher Prefixes */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-[10px] font-bold">SECTION 6</Badge>
            <CardTitle className="text-base">Suggested Crusher Asset Prefixes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Below are <strong>suggested</strong> prefixes for the new Crushing Plant to maintain site-wide consistency and avoid collisions with existing Processing Plant prefixes. These are starting points for discussion — final codes to be agreed.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Prefix</TableHead>
                <TableHead className="w-48">Equipment Type</TableHead>
                <TableHead className="w-36">Example</TableHead>
                <TableHead className="w-56">Notes</TableHead>
                <TableHead className="w-20">Conflict?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestedCrusherPrefixes.map((c) => {
                const hasConflict = reservedPrefixes.includes(c.prefix);
                return (
                  <TableRow key={c.prefix}>
                    <TableCell className="font-mono font-bold text-primary">{c.prefix}</TableCell>
                    <TableCell className="font-medium text-sm">{c.meaning}</TableCell>
                    <TableCell className="font-mono text-muted-foreground text-xs">{c.example}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.notes}</TableCell>
                    <TableCell>
                      {hasConflict ? (
                        <Badge variant="outline" className="text-[10px] border-amber-500 text-amber-600">Shared</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] border-emerald-500 text-emerald-600">New</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 7: Example Crusher Asset Tree */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30 text-[10px] font-bold">SECTION 7</Badge>
            <CardTitle className="text-base">Example — Crusher Asset Numbering in Practice</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Below shows how the naming convention applies to the current Crushing Plant layout. Component suffixes follow the same site standard as the Processing Plant.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-3">
            <div>
              <p className="font-bold text-foreground mb-1">ROM & Primary Feed</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">ROM-BIN01</span> — ROM Bin</p>
                <p className="pl-4"><span className="text-primary">ROM-BIN01-LVL01</span> — Vega Level Sensor</p>
                <p className="pl-4"><span className="text-primary">ROM-BIN01-STR01</span> — Bin Structure</p>
                <p><span className="text-primary font-semibold">ROM-FDR01</span> — Primary Vibrating Feeder</p>
                <p className="pl-4"><span className="text-primary">ROM-FDR01-MTR01</span> — Feeder Motor</p>
                <p className="pl-4"><span className="text-primary">ROM-FDR01-HYD01</span> — Hydraulic Motor Drive</p>
                <p className="pl-4"><span className="text-primary">ROM-FDR01-VSD01</span> — Variable Speed Drive</p>
                <p className="pl-4"><span className="text-primary">ROM-FDR01-EXC01</span> — Exciter Unit A</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Primary Crushing</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CR01</span> — Primary Jaw Crusher</p>
                <p className="pl-4"><span className="text-primary">CR01-MTR01</span> — Crusher Motor 160kW</p>
                <p className="pl-4"><span className="text-primary">CR01-GBX01</span> — Gearbox / Drive Assembly</p>
                <p className="pl-4"><span className="text-primary">CR01-JKS01</span> — Jackshaft Assembly</p>
                <p className="pl-4"><span className="text-primary">CR01-LUB01</span> — Lubrication System</p>
                <p className="pl-4"><span className="text-primary">CR01-HOP01</span> — Feed Hopper</p>
                <p><span className="text-primary font-semibold">PRI-MAG01</span> — Overband Magnet</p>
                <p className="pl-4"><span className="text-primary">PRI-MAG01-MTR01</span> — Magnet Drive Motor</p>
                <p className="pl-4"><span className="text-primary">PRI-MAG01-BLT01</span> — Self-Cleaning Belt</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Conveying</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CV01</span> — Forward Conveyor</p>
                <p className="pl-4"><span className="text-primary">CV01-MTR01</span> — Head Drive Motor A</p>
                <p className="pl-4"><span className="text-primary">CV01-GBX01</span> — Gearbox</p>
                <p className="pl-4"><span className="text-primary">CV01-LNY01</span> — Lanyard Safety Switches</p>
                <p className="pl-4"><span className="text-primary">CV01-SPD01</span> — Underspeed Sensor</p>
                <p><span className="text-primary font-semibold">CV04</span> — Screen Feed Conveyor</p>
                <p><span className="text-primary font-semibold">CV07</span> — Secondary Cone Feed Conveyor</p>
                <p className="pl-4"><span className="text-primary">CV07-MDE01</span> — Metal Detector</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Screening</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">SC01</span> — Vibrating Screen (3-Deck)</p>
                <p className="pl-4"><span className="text-primary">SC01-MTR01</span> — Screen Drive Motor 45kW</p>
                <p className="pl-4"><span className="text-primary">SC01-GBX01</span> — Exciter / Gearbox</p>
                <p className="pl-4"><span className="text-primary">SC01-DK01</span> — Top Deck</p>
                <p className="pl-4"><span className="text-primary">SC01-DK02</span> — Second Deck</p>
                <p className="pl-4"><span className="text-primary">SC01-DK03</span> — Bottom Deck (Fines)</p>
                <p className="pl-4"><span className="text-primary">SC01-SPR01</span> — Isolation Springs</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Secondary & Tertiary Crushing</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">SEC-CFB01</span> — Cone Feed Bin (Dual Chamber)</p>
                <p className="pl-4"><span className="text-primary">SEC-CFB01-FDR01</span> — Vibrating Feeder A → CR02</p>
                <p className="pl-4"><span className="text-primary">SEC-CFB01-FDR02</span> — Vibrating Feeder B → CR03</p>
                <p><span className="text-primary font-semibold">CR02</span> — Secondary Cone Crusher</p>
                <p className="pl-4"><span className="text-primary">CR02-MTR01</span> — Crusher Motor 220kW</p>
                <p className="pl-4"><span className="text-primary">CR02-LUB01</span> — Lubrication System</p>
                <p><span className="text-primary font-semibold">CR03</span> — Tertiary Cone Crusher</p>
                <p className="pl-4"><span className="text-primary">CR03-MTR01</span> — Crusher Motor 220kW</p>
                <p className="pl-4"><span className="text-primary">CR03-HYD01</span> — Hydraulic Tramp Release</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
