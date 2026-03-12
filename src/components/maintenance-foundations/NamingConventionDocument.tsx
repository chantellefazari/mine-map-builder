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
  { prefix: "JAW", meaning: "Jaw Crusher", example: "JAW001", notes: "Primary crusher" },
  { prefix: "CON", meaning: "Cone Crusher", example: "CON001", notes: "Secondary / tertiary crusher" },
  { prefix: "IMP", meaning: "Impact Crusher", example: "IMP001", notes: "If applicable" },
  { prefix: "GRZ", meaning: "Grizzly Feeder", example: "GRZ001", notes: "Scalping / feed grizzly" },
  { prefix: "RHOP", meaning: "Reclaim Hopper", example: "RHOP001", notes: "Already in use — shared prefix OK if different area" },
  { prefix: "FHOP", meaning: "Feed Hopper", example: "FHOP001", notes: "Already in use — shared prefix OK if different area" },
  { prefix: "CFDR", meaning: "Crusher Feeder", example: "CFDR001", notes: "Vibrating / pan feeder" },
  { prefix: "CSCN", meaning: "Crusher Screen", example: "CSCN001", notes: "Product / scalping screen" },
  { prefix: "CBIN", meaning: "Crusher Bin", example: "CBIN001", notes: "ROM bin / surge bin" },
  { prefix: "WSCL", meaning: "Weighing Scale / Weightometer", example: "WSCL001", notes: "Belt scale on conveyors" },
  { prefix: "DST", meaning: "Dust Suppression System", example: "DST001", notes: "Spray bars / enclosures" },
  { prefix: "MAG", meaning: "Magnetic Separator", example: "MAG001", notes: "Overband / drum magnet" },
  { prefix: "MTD", meaning: "Metal Detector", example: "MTD001", notes: "Conveyor metal detector" },
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
            Below shows how the naming convention would look when applied to a typical crushing circuit. Component suffixes are the same as the Processing Plant — only the parent equipment prefixes change.
          </p>

          <div className="bg-muted/50 rounded-lg p-4 font-mono text-xs space-y-3">
            <div>
              <p className="font-bold text-foreground mb-1">Primary Jaw Crusher</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">JAW001</span> — Primary Jaw Crusher</p>
                <p className="pl-4"><span className="text-primary">JAW001-MTR001</span> — Crusher Drive Motor</p>
                <p className="pl-4"><span className="text-primary">JAW001-HYD001</span> — Hydraulic Adjustment System</p>
                <p className="pl-4"><span className="text-primary">JAW001-CYL001</span> — CSS Adjustment Cylinder</p>
                <p className="pl-4"><span className="text-primary">JAW001-VLV001</span> — Hydraulic Relief Valve</p>
                <p className="pl-4"><span className="text-primary">JAW001-LCS001</span> — Local Control Station</p>
                <p className="pl-4"><span className="text-primary">JAW001-SEN001</span> — Bearing Temperature Sensor</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Feed System</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">GRZ001</span> — Grizzly Feeder</p>
                <p className="pl-4"><span className="text-primary">GRZ001-MTR001</span> — Feeder Drive Motor</p>
                <p className="pl-4"><span className="text-primary">GRZ001-VSD001</span> — Variable Speed Drive</p>
                <p><span className="text-primary font-semibold">CBIN001</span> — ROM Bin</p>
                <p className="pl-4"><span className="text-primary">CBIN001-HLS001</span> — High Level Switch</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Product Conveying</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CV01</span> — Crusher Discharge Conveyor</p>
                <p className="pl-4"><span className="text-primary">CV01-MTR001</span> — Head Pulley Motor</p>
                <p className="pl-4"><span className="text-primary">CV01-GBX001</span> — Head Pulley Gearbox</p>
                <p className="pl-4"><span className="text-primary">CV01-PWS001</span> — Pull Wire Switch (LHS)</p>
                <p className="pl-4"><span className="text-primary">CV01-PWS002</span> — Pull Wire Switch (RHS)</p>
                <p className="pl-4"><span className="text-primary">CV01-WTM001</span> — Belt Weightometer</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Screening</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">CSCN001</span> — Product Screen</p>
                <p className="pl-4"><span className="text-primary">CSCN001-MTR001</span> — Screen Drive Motor</p>
                <p className="pl-4"><span className="text-primary">CSCN001-EXC001</span> — Screen Exciter</p>
              </div>
            </div>

            <div>
              <p className="font-bold text-foreground mb-1">Ancillary</p>
              <div className="pl-4 space-y-0.5 text-muted-foreground">
                <p><span className="text-primary font-semibold">DST001</span> — Dust Suppression System</p>
                <p><span className="text-primary font-semibold">MAG001</span> — Overband Magnetic Separator</p>
                <p><span className="text-primary font-semibold">MTD001</span> — Conveyor Metal Detector</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
