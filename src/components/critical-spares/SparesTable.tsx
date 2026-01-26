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

interface SpareItem {
  id: string;
  spareName: string;
  componentType: string;
  oem: string;
  oemPartNumber: string;
  equipmentType: string;
  criticality: "A" | "B" | "C";
  failureImpact: string;
  leadTime: string;
  stockStrategy: string;
  notes: string;
}

const initialSpares: SpareItem[] = [
  {
    id: "1",
    spareName: "Mechanical Seal - 65mm",
    componentType: "Seal",
    oem: "John Crane",
    oemPartNumber: "JC-65-2100",
    equipmentType: "Centrifugal Pump",
    criticality: "A",
    failureImpact: "Pump failure, process stoppage",
    leadTime: "8 weeks",
    stockStrategy: "Hold",
    notes: "Critical for all process pumps",
  },
  {
    id: "2",
    spareName: "Drive Belt Set - Conveyor",
    componentType: "Belt",
    oem: "Gates",
    oemPartNumber: "8VX1400",
    equipmentType: "Belt Conveyor",
    criticality: "B",
    failureImpact: "Reduced throughput",
    leadTime: "2 weeks",
    stockStrategy: "Hold",
    notes: "Common across multiple conveyors",
  },
  {
    id: "3",
    spareName: "Bearing 6310-2RS",
    componentType: "Bearing",
    oem: "SKF",
    oemPartNumber: "6310-2RS1",
    equipmentType: "Motor",
    criticality: "B",
    failureImpact: "Motor failure",
    leadTime: "1 week",
    stockStrategy: "Hold",
    notes: "High usage item",
  },
];

const criticalityColors = {
  A: "bg-destructive/20 text-destructive",
  B: "bg-amber-500/20 text-amber-700",
  C: "bg-muted text-muted-foreground",
};

export const SparesTable = () => {
  const [spares, setSpares] = useState<SpareItem[]>(initialSpares);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.spareName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCriticality =
      filterCriticality === "all" || spare.criticality === filterCriticality;
    return matchesSearch && matchesCriticality;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Critical Spares Register
        </h2>
        <div className="flex items-center gap-3">
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
              <SelectItem value="A">A - Critical</SelectItem>
              <SelectItem value="B">B - Important</SelectItem>
              <SelectItem value="C">C - Convenience</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Spare
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Spare Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>OEM</TableHead>
            <TableHead>Part Number</TableHead>
            <TableHead>Equipment Type</TableHead>
            <TableHead>Criticality</TableHead>
            <TableHead>Lead Time</TableHead>
            <TableHead>Strategy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSpares.map((spare) => (
            <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{spare.spareName}</TableCell>
              <TableCell>{spare.componentType}</TableCell>
              <TableCell>{spare.oem}</TableCell>
              <TableCell className="font-mono text-sm">{spare.oemPartNumber}</TableCell>
              <TableCell>{spare.equipmentType}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={criticalityColors[spare.criticality]}>
                  {spare.criticality}
                </Badge>
              </TableCell>
              <TableCell>{spare.leadTime}</TableCell>
              <TableCell>{spare.stockStrategy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredSpares.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No spares match your search criteria.
        </div>
      )}
    </div>
  );
};
