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
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  sparesData,
  criticalityColors,
  statusColors,
  confidenceColors,
  type SpareItem,
} from "./sparesData";

export const SparesTable = () => {
  const [spares] = useState<SpareItem[]>(sparesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");

  const areas = [...new Set(sparesData.map((s) => s.area))].sort();

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.parentAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.sparePartDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.system.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCriticality =
      filterCriticality === "all" || spare.spareCriticality === filterCriticality;
    const matchesStatus =
      filterStatus === "all" || spare.status === filterStatus;
    const matchesArea = filterArea === "all" || spare.area === filterArea;
    return matchesSearch && matchesCriticality && matchesStatus && matchesArea;
  });

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-foreground">
            Critical Spares Only
          </p>
          <p className="text-muted-foreground mt-1">
            This register contains only items explicitly marked as critical from the Site Spares Catalogue.
            Criticality ratings marked "Assumed" require user confirmation.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Critical Spares Register ({filteredSpares.length} items)
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
              <SelectItem value="Provisional">Provisional</SelectItem>
              <SelectItem value="TBC">TBC</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Spare
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[80px] font-semibold">ID</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Area</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Sub-Area</TableHead>
              <TableHead className="min-w-[100px] font-semibold">System</TableHead>
              <TableHead className="min-w-[160px] font-semibold">Parent Asset</TableHead>
              <TableHead className="min-w-[140px] font-semibold">Component Name</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Type</TableHead>
              <TableHead className="min-w-[180px] font-semibold">Description</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Criticality</TableHead>
              <TableHead className="min-w-[150px] font-semibold">Reason Critical</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center">Min Qty (Prov.)</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center">Max Qty (Prov.)</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Confidence</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {spare.id}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {spare.area}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{spare.subArea}</TableCell>
                <TableCell className="text-sm">{spare.system}</TableCell>
                <TableCell className="font-medium text-sm">{spare.parentAsset}</TableCell>
                <TableCell className="font-medium">{spare.componentName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {spare.componentType}
                </TableCell>
                <TableCell className="text-sm">{spare.sparePartDescription}</TableCell>
                <TableCell>
                  {spare.spareCriticality && (
                    <Badge variant="secondary" className={criticalityColors[spare.spareCriticality]}>
                      {spare.spareCriticality}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {spare.reasonCritical}
                </TableCell>
                <TableCell className="text-center font-mono">
                  <span className={spare.minQtyProvisional === "TBC" ? "text-muted-foreground" : "font-medium"}>
                    {spare.minQtyProvisional}
                  </span>
                </TableCell>
                <TableCell className="text-center font-mono">
                  <span className={spare.maxQtyProvisional === "TBC" ? "text-muted-foreground" : "font-medium"}>
                    {spare.maxQtyProvisional}
                  </span>
                </TableCell>
                <TableCell>
                  {spare.quantityConfidence ? (
                    <Badge variant="secondary" className={confidenceColors[spare.quantityConfidence]}>
                      {spare.quantityConfidence}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[spare.status]}>
                    {spare.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty States */}
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

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-xs text-muted-foreground border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <Badge variant="secondary" className={statusColors["Provisional"]}>Provisional</Badge>
          <Badge variant="secondary" className={statusColors["TBC"]}>TBC</Badge>
          <Badge variant="secondary" className={statusColors["Confirmed"]}>Confirmed</Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Confidence:</span>
          <Badge variant="secondary" className={confidenceColors["High"]}>High</Badge>
          <Badge variant="secondary" className={confidenceColors["Medium"]}>Medium</Badge>
          <Badge variant="secondary" className={confidenceColors["Low"]}>Low</Badge>
        </div>
      </div>
    </div>
  );
};
