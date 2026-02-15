import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Hash, Info, CheckCircle, ShieldAlert, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CONTAINER_DISCIPLINE_MAP,
  VALID_BAYS,
  BAY_LAYOUT,
  EXTERNAL_PREFIXES,
} from "@/utils/storeLocationValidation";

export const StoreLocationCodingSection = () => {
  const containers = Object.entries(CONTAINER_DISCIPLINE_MAP).map(([id, disc]) => {
    const labels: Record<string, string> = {
      EL: "Electrical – Positive Airflow",
      IN: "Instrumentation & Control",
      ME: "Mechanical Small Parts",
      LU: "Lubrication",
      FA: "Fasteners & Consumables",
    };
    return { id, discipline: disc, label: labels[disc] || disc };
  });

  const codeStructure = [
    { segment: "Container", format: "C0X", meaning: "Physical storage container (C01–C05)", example: "C01, C02, C03, C04, C05" },
    { segment: "Discipline", format: "XX", meaning: "Must match container discipline", example: "EL, IN, ME, LU, FA" },
    { segment: "Bay", format: "A–H, J–K", meaning: "Wall position (skip letter I)", example: "A, B, C, D, E, F, G, H, J, K" },
    { segment: "Bin", format: "1–99", meaning: "Bin number within bay", example: "1, 2, 15, 42, 99" },
  ];

  const examples = [
    { code: "C01-EL-A3", description: "Container 1, Electrical, Left wall bay A, bin 3" },
    { code: "C02-IN-E1", description: "Container 2, Instrumentation, Right wall bay E, bin 1" },
    { code: "C03-ME-J2", description: "Container 3, Mechanical, Rear wall bay J, bin 2" },
    { code: "C04-LU-B5", description: "Container 4, Lubrication, Left wall bay B, bin 5" },
    { code: "C05-FA-H12", description: "Container 5, Fasteners, Right wall bay H, bin 12" },
  ];

  const externalExamples = [
    { code: "DM-A1", description: "Dome Storage, bay A, position 1" },
    { code: "DM-E3", description: "Dome Storage, bay E, position 3" },
    { code: "LD-B3", description: "Laydown Yard, bay B, position 3" },
    { code: "LD-J1", description: "Laydown Yard, rear bay J, position 1" },
  ];

  const validationRules = [
    "Discipline code must match its container (e.g. C01 = EL only)",
    "No duplicate location codes allowed across the entire store",
    "Location code must follow exact format: C0X-XX-A1",
    "Bay letters skip I (go A–H, then J–K)",
    "Bin numbers range from 1 to 99",
    "External codes (DM, LD) must not be mixed with container codes",
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

      {/* External Storage (Dome & Laydown Yard) */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">External Storage Codes</CardTitle>
          <p className="text-sm text-muted-foreground">
            Dome and laydown yard locations use separate prefixes — not mixed with container codes
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {Object.entries(EXTERNAL_PREFIXES).map(([prefix, label]) => (
              <div key={prefix} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <span className="font-mono font-bold text-primary w-10">{prefix}</span>
                <span className="text-sm text-muted-foreground">– {label}</span>
              </div>
            ))}
          </div>
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
