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

interface ComponentItem {
  id: string;
  componentType: string;
  manufacturer: string;
  model: string;
  ratings: string;
  mountingNotes: string;
  failureModes: string[];
  usedOn: string[];
  notes: string;
}

const initialComponents: ComponentItem[] = [
  {
    id: "1",
    componentType: "Motor",
    manufacturer: "WEG",
    model: "W22 315S/M",
    ratings: "110kW, 1475rpm, 415V, IP55",
    mountingNotes: "Foot mount, C-face available",
    failureModes: ["Bearing failure", "Winding insulation breakdown", "Cooling fan damage"],
    usedOn: ["Cyclone Feed Pump", "Ball Mill", "Thickener Drive"],
    notes: "Standard motor across site",
  },
  {
    id: "2",
    componentType: "Gearbox",
    manufacturer: "Flender",
    model: "B3SH 10",
    ratings: "75kW, 28.5:1 ratio",
    mountingNotes: "Shaft mount with torque arm",
    failureModes: ["Oil seal leakage", "Bearing wear", "Gear tooth wear"],
    usedOn: ["Conveyor Drive", "Apron Feeder"],
    notes: "Check oil level weekly",
  },
  {
    id: "3",
    componentType: "Pump",
    manufacturer: "Warman",
    model: "6/4 AH",
    ratings: "50m³/h @ 35m TDH",
    mountingNotes: "Base plate with grout",
    failureModes: ["Impeller wear", "Liner erosion", "Seal failure"],
    usedOn: ["Cyclone Feed", "Tailings Transfer"],
    notes: "Rubber lined for slurry service",
  },
];

export const ComponentsTable = () => {
  const [components, setComponents] = useState<ComponentItem[]>(initialComponents);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const componentTypes = [...new Set(components.map((c) => c.componentType))];

  const filteredComponents = components.filter((component) => {
    const matchesSearch =
      component.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.componentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || component.componentType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Component & OEM Register
        </h2>
        <div className="flex items-center gap-3">
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
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Component
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Manufacturer</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Ratings</TableHead>
            <TableHead>Typical Failure Modes</TableHead>
            <TableHead>Used On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComponents.map((component) => (
            <TableRow key={component.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{component.componentType}</TableCell>
              <TableCell>{component.manufacturer}</TableCell>
              <TableCell className="font-mono text-sm">{component.model}</TableCell>
              <TableCell className="text-sm">{component.ratings}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {component.failureModes.slice(0, 2).map((mode, i) => (
                    <span
                      key={i}
                      className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded"
                    >
                      {mode}
                    </span>
                  ))}
                  {component.failureModes.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{component.failureModes.length - 2}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {component.usedOn.slice(0, 2).map((equip, i) => (
                    <span
                      key={i}
                      className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
                    >
                      {equip}
                    </span>
                  ))}
                  {component.usedOn.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{component.usedOn.length - 2}
                    </span>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No components match your search criteria.
        </div>
      )}
    </div>
  );
};
