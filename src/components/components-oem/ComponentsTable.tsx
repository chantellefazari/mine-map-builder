import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { initialComponentData } from "./componentData";

export interface ComponentItem {
  id: string;
  assetName: string;
  assetNumber: string;
  parentAsset: string;
  area: string;
  subArea: string;
  system: string;
  componentType: string;
  componentName: string;
  componentAbbreviation: string;
  componentFunction: "Drive" | "Support" | "Control" | "Safety" | "";
  oemManufacturer: string;
  oemModel: string;
  oemSerialNumber: string;
  pidTag: string;
  notes: string;
  status: "Unknown" | "Identified" | "Verified after P&ID Walkdown";
}

// Generic component structure - NO OEM data
// Data will be enriched after P&ID walkdowns and engineering verification
const initialComponents: ComponentItem[] = initialComponentData;

const statusColors = {
  "Unknown": "bg-muted text-muted-foreground",
  "Identified": "bg-amber-500/20 text-amber-700",
  "Verified after P&ID Walkdown": "bg-green-500/20 text-green-700",
};

const componentTypes = [
  "Motor",
  "Gearbox",
  "Pump",
  "Valve",
  "Roller",
  "Bearing",
  "Seal",
  "Coupling",
  "Belt",
  "Chain",
  "Sprocket",
  "Impeller",
  "Liner",
  "Screen",
  "Sensor",
  "Actuator",
];

const componentFunctions = ["Drive", "Support", "Control", "Safety"];

const areas = ["COM", "UTL", "REC", "TAIL", "SUP", "SITE"];

export const ComponentsTable = () => {
  const [components, setComponents] = useState<ComponentItem[]>(initialComponents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");

  const filteredComponents = components.filter((component) => {
    const matchesSearch =
      component.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.assetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.pidTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || component.componentType === filterType;
    const matchesStatus = filterStatus === "all" || component.status === filterStatus;
    const matchesArea = filterArea === "all" || component.area === filterArea;
    return matchesSearch && matchesType && matchesStatus && matchesArea;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Component & OEM Register
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {componentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
              <SelectItem value="Identified">Identified</SelectItem>
              <SelectItem value="Verified after P&ID Walkdown">Verified</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Component
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Asset Name</TableHead>
              <TableHead className="min-w-[100px]">Asset Number</TableHead>
              <TableHead className="min-w-[120px]">Parent Asset</TableHead>
              <TableHead className="min-w-[100px]">Area</TableHead>
              <TableHead className="min-w-[120px]">Sub-Area</TableHead>
              <TableHead className="min-w-[100px]">System</TableHead>
              <TableHead className="min-w-[120px]">Component Type</TableHead>
              <TableHead className="min-w-[140px]">Component Name</TableHead>
              <TableHead className="min-w-[80px]">Abbrev.</TableHead>
              <TableHead className="min-w-[100px]">Function</TableHead>
              <TableHead className="min-w-[120px]">OEM Manufacturer</TableHead>
              <TableHead className="min-w-[100px]">OEM Model</TableHead>
              <TableHead className="min-w-[120px]">OEM Serial No.</TableHead>
              <TableHead className="min-w-[100px]">P&ID Tag</TableHead>
              <TableHead className="min-w-[150px]">Notes</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComponents.map((component) => (
              <TableRow key={component.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{component.assetName}</TableCell>
                <TableCell className="font-mono text-sm">{component.assetNumber}</TableCell>
                <TableCell>{component.parentAsset}</TableCell>
                <TableCell>{component.area}</TableCell>
                <TableCell>{component.subArea}</TableCell>
                <TableCell>{component.system}</TableCell>
                <TableCell>{component.componentType}</TableCell>
                <TableCell>{component.componentName}</TableCell>
                <TableCell className="font-mono text-sm">{component.componentAbbreviation}</TableCell>
                <TableCell>{component.componentFunction}</TableCell>
                <TableCell>{component.oemManufacturer}</TableCell>
                <TableCell className="font-mono text-sm">{component.oemModel}</TableCell>
                <TableCell className="font-mono text-sm">{component.oemSerialNumber}</TableCell>
                <TableCell className="font-mono text-sm">{component.pidTag}</TableCell>
                <TableCell className="text-sm">{component.notes}</TableCell>
                <TableCell>
                  {component.status && (
                    <Badge variant="secondary" className={statusColors[component.status]}>
                      {component.status === "Verified after P&ID Walkdown" ? "Verified" : component.status}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {components.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <div className="text-muted-foreground space-y-2">
            <p className="font-medium">No components registered yet</p>
            <p className="text-sm">
              Components will be added after P&ID walkdowns and engineering verification.
            </p>
          </div>
        </div>
      )}

      {components.length > 0 && filteredComponents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No components match your search criteria.
        </div>
      )}
    </div>
  );
};
