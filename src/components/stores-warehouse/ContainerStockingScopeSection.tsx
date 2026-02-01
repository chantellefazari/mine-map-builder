import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, CheckCircle, XCircle } from "lucide-react";

export const ContainerStockingScopeSection = () => {
  const eligibleCategories = [
    { name: "Bearings", description: "Ball, roller, and sleeve bearings ≤15 kg" },
    { name: "Sensors", description: "Proximity, photo, temperature, pressure" },
    { name: "Small Motors", description: "Fractional HP motors, fans under 15 kg" },
    { name: "Valves", description: "Ball, needle, check, solenoid valves" },
    { name: "Rollers", description: "Individual idler and guide rollers" },
    { name: "Seals", description: "Mechanical seals, O-rings, gaskets" },
    { name: "Filters", description: "Oil, air, hydraulic filter elements" },
    { name: "Instrument Spares", description: "Transmitters, gauges, probes" },
    { name: "Electrical Components", description: "Breakers, contactors, relays" },
    { name: "Fasteners", description: "Bolts, nuts, washers, studs" },
    { name: "Couplings", description: "Flexible couplings, inserts, keys" },
    { name: "Consumables", description: "Sealants, adhesives, lubricants (small)" }
  ];

  const exclusions = [
    "Complete motors (>15 kg)",
    "Gearboxes",
    "Complete pumps",
    "Large valves",
    "Drums and bulk chemicals",
    "Palletised items",
    "Structural steel",
    "Heavy equipment assemblies"
  ];

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-700 dark:text-amber-300">Categories Only — No Quantities</p>
          <p className="text-sm text-amber-600 dark:text-amber-400">
            This section defines what TYPES of parts are eligible for container storage. It does not specify stock levels or exact items.
          </p>
        </div>
      </div>

      {/* Header Card */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Container Stocking Scope (≤15 kg Items)</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Part categories eligible for container-based storage
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300 mb-2">
              <strong>Eligibility Rule:</strong> Only carryable items (≤15 kg) that can be safely handled by one person and stored on shelves or in bins.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Eligible Categories */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">Eligible Part Categories</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eligibleCategories.map((category, index) => (
              <div
                key={index}
                className="bg-green-500/5 border border-green-500/20 rounded-lg p-3"
              >
                <h4 className="font-medium text-sm text-foreground">{category.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exclusions */}
      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-lg">Excluded from Container Storage</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            These items are stored in laydown yards, racking, or heavy spares areas
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {exclusions.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-md text-sm bg-destructive/10 text-destructive border border-destructive/20"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
