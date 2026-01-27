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

export interface SpareItem {
  id: string;
  componentName: string;
  componentType: string;
  assetName: string;
  assetNumber: string;
  sparePartDescription: string;
  oemPartNumber: string;
  spareCriticality: "High" | "Medium" | "Low" | "";
  reasonCritical: string;
  leadTime: string;
  storageRequirement: string;
  notes: string;
  status: "Unknown" | "Confirmed";
}

// Empty array - data to be added after P&ID walkdowns and engineering verification
const initialSpares: SpareItem[] = [];

const criticalityColors = {
  "High": "bg-destructive/20 text-destructive",
  "Medium": "bg-amber-500/20 text-amber-700",
  "Low": "bg-muted text-muted-foreground",
  "": "",
};

const statusColors = {
  "Unknown": "bg-muted text-muted-foreground",
  "Confirmed": "bg-green-500/20 text-green-700",
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

export const SparesTable = () => {
  const [spares, setSpares] = useState<SpareItem[]>(initialSpares);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.assetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.sparePartDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCriticality =
      filterCriticality === "all" || spare.spareCriticality === filterCriticality;
    const matchesStatus =
      filterStatus === "all" || spare.status === filterStatus;
    return matchesSearch && matchesCriticality && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Critical Spares Catalogue
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search spares..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterCriticality} onValueChange={setFilterCriticality}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Criticality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Spare
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Component Name</TableHead>
              <TableHead className="min-w-[120px]">Component Type</TableHead>
              <TableHead className="min-w-[140px]">Asset Name</TableHead>
              <TableHead className="min-w-[100px]">Asset Number</TableHead>
              <TableHead className="min-w-[180px]">Spare Part Description</TableHead>
              <TableHead className="min-w-[120px]">OEM Part Number</TableHead>
              <TableHead className="min-w-[100px]">Criticality</TableHead>
              <TableHead className="min-w-[150px]">Reason Critical</TableHead>
              <TableHead className="min-w-[100px]">Lead Time</TableHead>
              <TableHead className="min-w-[140px]">Storage Requirement</TableHead>
              <TableHead className="min-w-[150px]">Notes</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{spare.componentName}</TableCell>
                <TableCell>{spare.componentType}</TableCell>
                <TableCell>{spare.assetName}</TableCell>
                <TableCell className="font-mono text-sm">{spare.assetNumber}</TableCell>
                <TableCell>{spare.sparePartDescription}</TableCell>
                <TableCell className="font-mono text-sm">{spare.oemPartNumber}</TableCell>
                <TableCell>
                  {spare.spareCriticality && (
                    <Badge variant="secondary" className={criticalityColors[spare.spareCriticality]}>
                      {spare.spareCriticality}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">{spare.reasonCritical}</TableCell>
                <TableCell>{spare.leadTime}</TableCell>
                <TableCell>{spare.storageRequirement}</TableCell>
                <TableCell className="text-sm">{spare.notes}</TableCell>
                <TableCell>
                  {spare.status && (
                    <Badge variant="secondary" className={statusColors[spare.status]}>
                      {spare.status}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {spares.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <div className="text-muted-foreground space-y-2">
            <p className="font-medium">No critical spares registered yet</p>
            <p className="text-sm">
              Spares will be added after P&ID walkdowns and engineering verification.
            </p>
          </div>
        </div>
      )}

      {spares.length > 0 && filteredSpares.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No spares match your search criteria.
        </div>
      )}
    </div>
  );
};
