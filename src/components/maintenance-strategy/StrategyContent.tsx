import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, AlertTriangle, Settings, Link, FileText } from "lucide-react";

const strategyItems = [
  {
    id: "pm-vs-rtf",
    title: "PM vs Run-to-Failure",
    icon: Settings,
    content: [
      {
        heading: "Equipment that gets PM'd",
        items: [
          "Critical rotating equipment (pumps, motors, gearboxes)",
          "Conveyors and material handling systems",
          "Safety-critical equipment (guards, interlocks, E-stops)",
          "Equipment with hidden failure modes (standby systems)",
          "High-value equipment with long lead times",
        ],
      },
      {
        heading: "Equipment that runs to failure",
        items: [
          "Low-cost, easily replaceable items (light bulbs, small valves)",
          "Items with no practical PM benefit",
          "Redundant systems where failure has no production impact",
          "Items where replacement cost < PM cost",
        ],
      },
    ],
  },
  {
    id: "duty-standby",
    title: "Duty vs Standby Philosophy",
    icon: AlertTriangle,
    content: [
      {
        heading: "Duty Equipment",
        items: [
          "Full PM schedule applies",
          "Condition monitoring where applicable",
          "Scheduled inspections at defined intervals",
        ],
      },
      {
        heading: "Standby Equipment",
        items: [
          "Reduced PM frequency (typically 50% of duty)",
          "Focus on readiness checks rather than wear-based PMs",
          "Regular start/run tests to confirm operability",
          "Condition-based triggers may be more appropriate",
        ],
      },
    ],
  },
  {
    id: "inspection-vs-intrusive",
    title: "Inspection vs Intrusive Maintenance",
    icon: CheckCircle,
    content: [
      {
        heading: "Non-Intrusive Inspection",
        items: [
          "Visual inspections (daily/weekly)",
          "Thermography and vibration analysis",
          "Oil sampling and analysis",
          "Acoustic monitoring",
          "No isolation required",
        ],
      },
      {
        heading: "Intrusive Maintenance",
        items: [
          "Requires isolation and LOTO",
          "Scheduled during planned shutdowns where possible",
          "Opening equipment, replacing components",
          "Alignment, calibration, overhauls",
        ],
      },
    ],
  },
  {
    id: "asset-mapping",
    title: "PM to Asset Mapping (External)",
    icon: Link,
    content: [
      {
        heading: "Mapping Rules",
        items: [
          "PMs are designed by equipment TYPE in this workspace",
          "Asset-to-PM linking happens in external CMMS (D365)",
          "One PM template can apply to multiple assets of the same type",
          "Asset-specific variations are handled as CMMS overrides, not template changes",
        ],
      },
      {
        heading: "Integration Notes",
        items: [
          "Export PM Master List to CSV for CMMS import",
          "Functional Locations provide the asset-side anchor",
          "Equipment Type is the linking field between PM and Asset",
        ],
      },
    ],
  },
  {
    id: "naming-standards",
    title: "Naming Standards & Conventions",
    icon: FileText,
    content: [
      {
        heading: "PM Naming",
        items: [
          "Format: PM-[EQUIP]-[NNN] (e.g., PM-PUMP-001)",
          "Equipment types: PUMP, CONV, MTR, GBX, SCR, TANK, etc.",
          "Sequential numbering within each equipment type",
        ],
      },
      {
        heading: "Asset Naming (Reference)",
        items: [
          "Parent Assets: [EQUIP ABBR][###] (e.g., PMP001, SCR001)",
          "Components: [PARENT]-[TYPE]-[##] (e.g., PMP001-MTR-01)",
          "Functional Locations: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM]",
        ],
      },
    ],
  },
];

export const StrategyContent = () => {
  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-primary text-sm">i</span>
        </div>
        <div className="text-sm">
          <p className="text-foreground font-medium">
            This section defines the maintenance philosophy for TCMG.
          </p>
          <p className="text-muted-foreground mt-1">
            These rules guide PM design and will inform external CMMS configuration.
          </p>
        </div>
      </div>

      {/* Strategy Accordion */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Maintenance Strategy Framework
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {strategyItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="font-medium">{item.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid md:grid-cols-2 gap-6 pl-11">
                  {item.content.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        {section.heading}
                      </h4>
                      <ul className="space-y-1">
                        {section.items.map((point, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Future Integration Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Future CMMS Integration</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            This strategy framework will be exported alongside the PM Master List and Functional
            Location register for D365/CMMS configuration.
          </p>
          <p>
            Work order scheduling, resource allocation, and compliance tracking are handled in the
            external AI CMMS system — not in this design workspace.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
