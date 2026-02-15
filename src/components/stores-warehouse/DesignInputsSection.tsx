import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Layers, Box, Wind, TrendingUp, Shield, Clock, Info } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const DesignInputsSection = () => {
  const containerRequirements = [
    {
      zone: "C01-EL",
      type: "20ft Modified Container",
      contents: "Electrical components, sensors, PLC spares",
      environment: "Dust-controlled, airflow, climate-stable",
      accessFrequency: "Daily",
      growthAllowance: "20%"
    },
    {
      zone: "C03-ME",
      type: "20ft Standard Container",
      contents: "Bearings, seals, couplings, mechanical parts",
      environment: "Dry, standard industrial",
      accessFrequency: "Daily",
      growthAllowance: "15%"
    },
    {
      zone: "C02-IN",
      type: "20ft Modified Container",
      contents: "Instrumentation, transmitters, gauges",
      environment: "Clean, dust-free, climate preferred",
      accessFrequency: "Weekly",
      growthAllowance: "10%"
    },
    {
      zone: "C04-LU",
      type: "10ft Container or Cage",
      contents: "Grease, oil, filters, lube accessories",
      environment: "Ventilated, spill containment",
      accessFrequency: "Daily",
      growthAllowance: "10%"
    },
    {
      zone: "C05-FA",
      type: "20ft Standard Container",
      contents: "Fasteners, consumables, small tools",
      environment: "Standard, high-access bins",
      accessFrequency: "Daily",
      growthAllowance: "25%"
    }
  ];

  const safetyConstraints = [
    "Electrical and lubrication zones must be physically separated",
    "Clear emergency egress from all containers",
    "Fire extinguisher placement per container type",
    "Adequate lighting in all storage areas",
    "Anti-slip flooring where oils may be handled",
    "No stacking above shoulder height without step access"
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Handoff Document Only</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section captures inputs for future 3D or spatial design tools. No modelling or physical layout is performed here.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Design Inputs for Future 3D Modelling</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Captured requirements to inform physical store design
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              This section exists to provide structured inputs when physical layout design begins. 
              It captures container types, contents, environmental needs, and growth projections.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Container Requirements Table */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Container Requirements Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Zone</TableHead>
                  <TableHead>Container Type</TableHead>
                  <TableHead>Contents</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead className="w-24">Access</TableHead>
                  <TableHead className="w-20">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {containerRequirements.map((req, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono font-medium text-primary">{req.zone}</TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{req.contents}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{req.environment}</TableCell>
                    <TableCell>{req.accessFrequency}</TableCell>
                    <TableCell className="text-center">{req.growthAllowance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Key Design Considerations */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-cyan-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-cyan-600" />
              <h4 className="font-medium text-sm">Environmental</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Dust control for electrical zones</li>
              <li>• Ventilation for lubrication stores</li>
              <li>• Climate stability for instruments</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-sm">Growth Allowance</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• 10-25% spare capacity per zone</li>
              <li>• Modular expansion capability</li>
              <li>• LD bay structure supports growth (A–F)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-orange-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-sm">Safety Separation</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Electrical vs lubrication zones</li>
              <li>• Flammables isolation</li>
              <li>• Emergency egress paths</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border bg-purple-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h4 className="font-medium text-sm">Access Frequency</h4>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Daily: Fasteners, mechanical, lube</li>
              <li>• Weekly: Instrumentation</li>
              <li>• Position high-frequency at front</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Safety Constraints */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">Safety & Layout Constraints</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
            <ul className="text-sm text-muted-foreground space-y-2">
              {safetyConstraints.map((constraint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-0.5">•</span>
                  {constraint}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Handoff Note */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Handoff Note</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-3">
              When physical layout design begins, this section provides:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Container type and quantity requirements</li>
              <li>• Environmental specifications per zone</li>
              <li>• Growth projections for capacity planning</li>
              <li>• Safety separation requirements</li>
              <li>• Access frequency for optimal positioning</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border">
              <strong>Next step:</strong> Engage 3D modelling or layout design tools with these inputs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
