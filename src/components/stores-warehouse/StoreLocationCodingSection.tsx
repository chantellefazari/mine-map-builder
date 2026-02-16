import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Hash, Info, CheckCircle, ShieldAlert, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CONTAINER_DISCIPLINE_MAP,
  VALID_BAYS,
  BAY_LAYOUT,
  EXTERNAL_PREFIXES,
  EXTERNAL_BAY_LAYOUT,
  VALID_EXTERNAL_BAYS,
} from "@/utils/storeLocationValidation";

export const StoreLocationCodingSection = () => {
  const containers = Object.entries(CONTAINER_DISCIPLINE_MAP).map(([id, disc]) => {
    const labels: Record<string, string> = {
      EL: "Electrical – Positive Airflow",
      IN: "Instrumentation, Pneumatics & Process Fittings",
      ME: "Mechanical (40ft)",
      MP: "Mechanical Precision",
      CS: "Consumables & Supplies",
    };
    return { id, discipline: disc, label: labels[disc] || disc };
  });

  const codeStructure = [
    { segment: "Container", format: "C0X", meaning: "Physical storage container (C01–C05)", example: "C01, C02, C03, C04, C05" },
    { segment: "Discipline", format: "XX", meaning: "Must match container discipline", example: "EL, IN, ME, MP, CS" },
    { segment: "Bay", format: "A–H, J–K", meaning: "Wall position (skip letter I)", example: "A, B, C, D, E, F, G, H, J, K" },
    { segment: "Bin", format: "1–99", meaning: "Bin number within bay", example: "1, 2, 15, 42, 99" },
  ];

  const examples = [
    { code: "C01-EL-A3", description: "Container 1, Electrical, Left wall bay A, bin 3" },
    { code: "C02-IN-E1", description: "Container 2, Instrumentation, Right wall bay E, bin 1" },
    { code: "C03-ME-J2", description: "Container 3, Mechanical, Rear wall bay J, bin 2" },
    { code: "C04-MP-B5", description: "Container 4, Mech Precision, Left wall bay B, bin 5" },
    { code: "C05-CS-H12", description: "Container 5, Consumables & Supplies, Right wall bay H, bin 12" },
  ];

  const externalExamples = [
    { code: "LD-A1", description: "Dome row A, position 1" },
    { code: "LD-A2", description: "Dome row A, position 2" },
    { code: "LD-B3", description: "Dome row B, position 3" },
    { code: "LD-C1", description: "Yard bay C, position 1" },
    { code: "LD-D2", description: "Yard bay D, position 2" },
    { code: "LD-F4", description: "Yard bay F, position 4" },
  ];

  const validationRules = [
    "Discipline code must match its container (e.g. C01 = EL only)",
    "No duplicate location codes allowed across the entire store",
    "Location code must follow exact format: C0X-XX-A1",
    "Bay letters skip I (go A–H, then J–K)",
    "Bin numbers range from 1 to 99",
    "All external codes must start with LD prefix",
    "External bays limited to letters A–F only",
    "Format must be exactly LD-[Letter][Number] (e.g. LD-A1)",
  ];

  return (
    <div className="space-y-6">
      {/* Governance Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Location Structure Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section defines how physical spare parts are located and stored on site. It does not link to asset tree or P&ID data until new P&IDs are issued.
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
              <CardTitle className="text-xl">Store Location Coding Standards</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Physical location codes for spare parts storage — Container-based
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Location Code Structure */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Location Code Format</CardTitle>
          <p className="text-sm text-muted-foreground">
            All store locations use the following format:
          </p>
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <code className="text-lg font-mono font-bold text-primary">[Container]-[Discipline]-[Bay][Bin]</code>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Example: C01-EL-A3</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Segment</TableHead>
                <TableHead className="w-28">Format</TableHead>
                <TableHead>Meaning</TableHead>
                <TableHead>Values</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codeStructure.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{row.segment}</TableCell>
                  <TableCell className="font-mono text-primary">{row.format}</TableCell>
                  <TableCell>{row.meaning}</TableCell>
                  <TableCell className="font-mono text-muted-foreground text-xs">{row.example}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Container → Discipline Mapping */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Container Identification</CardTitle>
          <p className="text-sm text-muted-foreground">
            Each container has a fixed discipline code — discipline must always match container
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {containers.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
              >
                <span className="font-mono font-bold text-primary w-10">{c.id}</span>
                <span className="font-mono font-bold text-primary w-8">{c.discipline}</span>
                <span className="text-sm text-muted-foreground">– {c.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bay Layout Logic */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Bay Layout Logic</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Standardised bay allocation for all containers (letter I is skipped)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Left Wall</p>
              <div className="flex flex-wrap gap-2">
                {BAY_LAYOUT.leftWall.map((bay) => (
                  <span key={bay} className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium">
                    {bay}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Right Wall</p>
              <div className="flex flex-wrap gap-2">
                {BAY_LAYOUT.rightWall.map((bay) => (
                  <span key={bay} className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium">
                    {bay}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Rear Wall</p>
              <div className="flex flex-wrap gap-2">
                {BAY_LAYOUT.rearWall.map((bay) => (
                  <span key={bay} className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium">
                    {bay}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            All valid bay letters: {VALID_BAYS.join(", ")} — Bin numbers: 1–99
          </p>
        </CardContent>
      </Card>

      {/* Container Location Examples */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Container Location Examples</CardTitle>
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

      {/* External Storage (LD Prefix Only) */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">External Storage Codes — LD Prefix</CardTitle>
          <p className="text-sm text-muted-foreground">
            All external storage (dome rows and laydown yard) uses a single <code className="font-mono text-primary">LD</code> prefix
          </p>
          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <code className="text-lg font-mono font-bold text-primary">LD-[Bay][Position]</code>
            <p className="text-xs text-muted-foreground mt-1 font-mono">Example: LD-A1, LD-C3</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Bay assignments */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Dome Internal Rows</p>
              <div className="flex flex-wrap gap-2">
                {EXTERNAL_BAY_LAYOUT.domeRows.map((bay) => (
                  <span key={bay} className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium">
                    LD-{bay}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">5m forklift clearance between dome rows and container rows</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <p className="text-sm font-medium text-foreground mb-2">Yard Bays</p>
              <div className="flex flex-wrap gap-2">
                {EXTERNAL_BAY_LAYOUT.yardBays.map((bay) => (
                  <span key={bay} className="px-3 py-1.5 rounded-md text-sm bg-background border border-border font-mono font-medium">
                    LD-{bay}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Examples */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">Location Code</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {externalExamples.map((example, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono font-bold text-primary">{example.code}</TableCell>
                  <TableCell className="text-muted-foreground">{example.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Sample Location Register */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Sample Location Register</h4>
            <div className="grid gap-1 sm:grid-cols-3 lg:grid-cols-6">
              {VALID_EXTERNAL_BAYS.map((bay) => (
                <div key={bay} className="bg-muted/50 rounded-lg p-2 border border-border">
                  <p className="text-xs font-medium text-primary font-mono mb-1">LD-{bay}</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from({ length: 6 }, (_, i) => (
                      <span key={i} className="text-[10px] font-mono text-muted-foreground">
                        LD-{bay}{i + 1}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Validation Rules</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
              {validationRules.map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {rule}
                </li>
              ))}
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
          <div className="bg-background border border-border rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground italic">
              "This standard governs stores layout and inventory location only. It does not alter asset hierarchy or functional locations."
            </p>
            <p className="text-sm text-muted-foreground italic">
              "Do not link components to assets until new P&IDs are issued."
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
              Additional containers or external zones can be added as the site grows. The format supports:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• New containers beyond C05 (e.g. C06, C07)</li>
              <li>• Additional bay letters beyond K if containers grow</li>
              <li>• New external prefixes for satellite storage areas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
