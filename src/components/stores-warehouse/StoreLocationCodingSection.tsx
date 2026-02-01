import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Hash, Info, CheckCircle, ShieldAlert } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const StoreLocationCodingSection = () => {
  const zoneCodes = [
    { code: "ME", meaning: "Mechanical" },
    { code: "EL", meaning: "Electrical" },
    { code: "IN", meaning: "Instrumentation" },
    { code: "HY", meaning: "Hydraulics" },
    { code: "PN", meaning: "Pneumatics" },
    { code: "FI", meaning: "Filters" },
    { code: "BR", meaning: "Bearings" },
    { code: "FT", meaning: "Fasteners" },
    { code: "SE", meaning: "Seals" },
    { code: "LU", meaning: "Lubrication" },
    { code: "SA", meaning: "Safety / PPE" }
  ];

  const examples = [
    { code: "C01-ME-01", description: "Container 1, Mechanical zone, position 01" },
    { code: "C01-BR-A3", description: "Container 1, Bearings, shelf A bin 3" },
    { code: "C02-EL-02", description: "Container 2, Electrical zone, position 02" },
    { code: "C03-IN-B1", description: "Container 3, Instrumentation, shelf B bin 1" },
    { code: "C01-FT-05", description: "Container 1, Fasteners, position 05" }
  ];

  const codeStructure = [
    { segment: "Container", format: "CXX", meaning: "Physical storage container", example: "C01, C02, C03, C04..." },
    { segment: "Zone", format: "XX", meaning: "Functional grouping of parts", example: "ME, EL, IN, BR, FT..." },
    { segment: "Position", format: "NN or AX", meaning: "Exact storage location (shelf/bin)", example: "01, 02, A1, A2, B1..." }
  ];

  return (
    <div className="space-y-6">
      {/* Governance Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Governance & Reference Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section defines how physical spare parts are located and stored on site. It must NOT modify any existing asset tree, functional locations, or part records.
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
              <CardTitle className="text-xl">Stores Location Coding Standards (Container-Based)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Physical location codes for spare parts storage
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Location Code Structure */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Location Code Structure</CardTitle>
          <p className="text-sm text-muted-foreground">
            All store locations use the following format:
          </p>
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <code className="text-lg font-mono font-bold text-primary">[Container]-[Zone]-[Position]</code>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Segment</TableHead>
                <TableHead className="w-24">Format</TableHead>
                <TableHead>Meaning</TableHead>
                <TableHead>Example Values</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codeStructure.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.segment}</TableCell>
                  <TableCell className="font-mono text-primary">{row.format}</TableCell>
                  <TableCell>{row.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Container Explanation */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Container</CardTitle>
          <p className="text-sm text-muted-foreground">
            Containers represent physical storage units on site
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Containers are numbered sequentially:
            </p>
            <div className="flex flex-wrap gap-2">
              {["C01", "C02", "C03", "C04", "C05", "..."].map((code, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone Codes */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Zone</CardTitle>
          <p className="text-sm text-muted-foreground">
            Zones define functional groupings of parts inside each container
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-foreground mb-3">Approved Zone Codes:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {zoneCodes.map((zone, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border"
              >
                <span className="font-mono font-bold text-primary">{zone.code}</span>
                <span className="text-sm text-muted-foreground">– {zone.meaning}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Position Explanation */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Position</CardTitle>
          <p className="text-sm text-muted-foreground">
            Position identifies the exact storage location within the container
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Can be numeric or alphanumeric (e.g. shelf/bin):
            </p>
            <div className="flex flex-wrap gap-2">
              {["01", "02", "03", "A1", "A2", "B1", "B2", "C1"].map((code, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Location Code</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examples.map((example, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono font-bold text-primary">{example.code}</TableCell>
                  <TableCell className="text-muted-foreground">{example.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Rules</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Location codes reflect physical layout only
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Zones are consistent across all containers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Location codes are immutable once assigned
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                This standard supports future barcode or QR scanning
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Governance Note */}
      <Card className="border-border bg-muted/30">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Governance Note</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground italic">
              "This standard governs stores layout and inventory location only. It does not alter asset hierarchy or functional locations."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Future Expansion */}
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
              {["WE (Welding)", "TO (Tools)", "PP (Pipe)", "VL (Valves)", "PU (Pumps)"].map((code, index) => (
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
