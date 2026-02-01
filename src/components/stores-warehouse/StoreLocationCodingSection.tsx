import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Hash, Info, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const StoreLocationCodingSection = () => {
  const locationCodes = [
    { code: "STO-EL-01", description: "Electrical Container — Primary", zone: "Electrical" },
    { code: "STO-EL-02", description: "Electrical Container — Overflow", zone: "Electrical" },
    { code: "STO-ME-01", description: "Mechanical Small Parts — Primary", zone: "Mechanical" },
    { code: "STO-ME-02", description: "Mechanical Small Parts — Secondary", zone: "Mechanical" },
    { code: "STO-IN-01", description: "Instrumentation Container", zone: "Instrumentation" },
    { code: "STO-LU-01", description: "Lubrication & Oils Container", zone: "Lubrication" },
    { code: "STO-FA-01", description: "Fasteners & Consumables — Primary", zone: "Fasteners" },
    { code: "STO-FA-02", description: "Fasteners & Consumables — Secondary", zone: "Fasteners" }
  ];

  const codeStructure = [
    { segment: "STO", meaning: "Store / Warehouse prefix", example: "STO" },
    { segment: "XX", meaning: "Zone code (2 letters)", example: "EL, ME, IN, LU, FA" },
    { segment: "NN", meaning: "Sequential number", example: "01, 02, 03..." }
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Logical Codes Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            These codes are logical identifiers — not physical positions. They will later link to parts catalogues, not asset trees.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Store Location Coding Logic</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Future-ready location codes for stores and warehouse areas
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Code Structure */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Code Structure: STO-XX-NN</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Segment</TableHead>
                <TableHead>Meaning</TableHead>
                <TableHead>Example Values</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codeStructure.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono font-medium">{row.segment}</TableCell>
                  <TableCell>{row.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Code Rules */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Coding Rules</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Codes are logical only — no physical coordinates or dimensions
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Codes must be scalable (NN can extend to NNN if required)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Codes must remain stable once assigned — no renumbering
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Codes link to parts catalogues, not asset hierarchies
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                New zones require approval before code assignment
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Defined Location Codes */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Defined Location Codes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Current logical store locations for TCMG
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-32">Zone</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locationCodes.map((loc, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono font-medium text-primary">{loc.code}</TableCell>
                  <TableCell>{loc.description}</TableCell>
                  <TableCell className="text-muted-foreground">{loc.zone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Future Expansion Note */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Future Expansion</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Additional zone codes can be added as the site grows:
            </p>
            <div className="flex flex-wrap gap-2">
              {["STO-HY (Hydraulics)", "STO-PN (Pneumatics)", "STO-SA (Safety)", "STO-PP (PPE)"].map((code, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-md text-sm bg-muted border border-border font-mono"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
