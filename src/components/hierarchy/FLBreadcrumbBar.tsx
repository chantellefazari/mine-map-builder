import React from "react";
import { useFLBreadcrumb, FLPathSegment } from "./FLBreadcrumbContext";
import { MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Sub-area code mapping matching functionalLocations.ts
const subAreaCodes: Record<string, string> = {
  "Site Infrastructure": "INFRA",
  "Compressed Air": "COMP",
  "Electrical / Controls": "ELEC",
  "Power Generation": "PWR",
  "Reagents": "REAG",
  "Reagents (Lime)": "REAG",
  "Water": "WTR",
  "Hydraulic Systems": "HYD",
  "Fuel Systems": "FUEL",
  "Feed / Reclaim": "FEED",
  "Conveying": "CONV",
  "Grinding": "GRIND",
  "Classification": "CLASS",
  "Gravity Circuit": "GRAV",
  "CIP": "CIP",
  "Elution": "ELUT",
  "Carbon Regeneration": "REGEN",
  "Gold Room": "GOLD",
  "Thickening": "THK",
  "Filtering": "FILT",
  "Workshop Infrastructure": "WKSHP",
  "Workshop": "WKSHP",
  "Lab": "LAB",
  "Mobile Equipment": "MOBILE",
  "Light Vehicles": "LV",
  "Heavy Vehicles (HV)": "HV",
};

// Area code mapping matching functionalLocations.ts
const areaCodeMapping: Record<string, string> = {
  "SITE": "SITE",
  "UTL": "UTL",
  "COM": "COMM",
  "REC": "GR",
  "TAIL": "TAIL",
  "SUP": "SUP",
};

const levelLabels: Record<string, string> = {
  site: "Site",
  plant: "Facility",
  area: "Area",
  subarea: "Sub-Area",
  parentAsset: "System",
  equipment: "Equipment",
  component: "Component",
};

const levelColors: Record<string, string> = {
  site: "bg-level-site text-white",
  plant: "bg-level-plant text-white",
  area: "bg-primary/15 text-primary",
  subarea: "bg-muted text-foreground",
  parentAsset: "bg-muted text-foreground",
  equipment: "bg-muted text-foreground",
  component: "bg-muted text-foreground",
};

export const FLBreadcrumbBar: React.FC = () => {
  const { currentPath, storedFL } = useFLBreadcrumb();

  if (currentPath.length === 0) {
    return (
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2.5 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground italic">
          Expand a node to see the functional location path
        </span>
      </div>
    );
  }

  // Use DB-stored FL code if available, otherwise compute from path segments
  let flCode: string;
  if (storedFL) {
    flCode = storedFL;
  } else {
    const flSegments: string[] = [];
    for (const seg of currentPath) {
      if (seg.level === "site") flSegments.push(seg.label);
      else if (seg.level === "plant") {
        if (seg.label === "Processing Plant") flSegments.push("PP");
        else if (seg.label === "Crushing Plant") flSegments.push("CRU");
        else if (seg.label === "Mining") flSegments.push("MIN");
        else flSegments.push(seg.label.substring(0, 3).toUpperCase());
      }
      else if (seg.level === "area" && seg.code) {
        flSegments.push(areaCodeMapping[seg.code] || seg.code);
      }
      else if (seg.level === "subarea") {
        flSegments.push(subAreaCodes[seg.label] || seg.label.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, ''));
      }
      else if (seg.code) flSegments.push(seg.code);
      else {
        const match = seg.label.match(/^([A-Z0-9\-]+)\s/);
        if (match) flSegments.push(match[1]);
        else flSegments.push(seg.label.substring(0, 6).toUpperCase());
      }
    }
    flCode = flSegments.join("-");
  }

  return (
    <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border px-4 py-2.5">
      {/* FL Code */}
      <div className="flex items-center gap-2 mb-1.5">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="font-mono text-sm font-semibold text-primary tracking-wide">
          {flCode}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider ml-2">
          Functional Location
        </span>
      </div>

      {/* Breadcrumb segments */}
      <div className="flex items-center gap-1 flex-wrap">
        {currentPath.map((seg, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 flex-shrink-0" />
            )}
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium",
                levelColors[seg.level] || "bg-muted text-foreground"
              )}
            >
              <span className="text-[9px] uppercase opacity-60">{levelLabels[seg.level] || seg.level}</span>
              <span className="font-semibold">{seg.code || seg.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
