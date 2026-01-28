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
  siteSparesData,
  siteSpareStatusColors,
  priorityColors,
  criticalitySourceColors,
  type SiteSpareItem,
} from "./siteSparesData";
import { AddSpareDialog } from "./AddSpareDialog";
import { useToast } from "@/hooks/use-toast";

export const SiteSparesTable = () => {
  const [spares, setSpares] = useState<SiteSpareItem[]>(siteSparesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSubArea, setFilterSubArea] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const areas = [...new Set(spares.map((s) => s.area))].sort();
  const subAreas = filterArea === "all" 
    ? [...new Set(spares.map((s) => s.subArea))].sort()
    : [...new Set(spares.filter((s) => s.area === filterArea).map((s) => s.subArea))].sort();

  const handleAddSpare = (newSpare: SiteSpareItem) => {
    setSpares((prev) => [...prev, newSpare]);
    toast({
      title: "Spare Added",
      description: `${newSpare.componentName} has been added to the catalogue.`,
    });
  };

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.parentAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.assetNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.sparePartDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === "all" || spare.priority === filterPriority;
    const matchesArea = filterArea === "all" || spare.area === filterArea;
    const matchesSubArea = filterSubArea === "all" || spare.subArea === filterSubArea;
    return matchesSearch && matchesPriority && matchesArea && matchesSubArea;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Site Spares Catalogue ({filteredSpares.length} items)
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
          <Select value={filterArea} onValueChange={(val) => { setFilterArea(val); setFilterSubArea("all"); }}>
            <SelectTrigger className="w-36">
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
          <Select value={filterSubArea} onValueChange={setFilterSubArea}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sub-Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub-Areas</SelectItem>
              {subAreas.map((subArea) => (
                <SelectItem key={subArea} value={subArea}>
                  {subArea}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="gap-2" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Spare
          </Button>
        </div>
      </div>

      {/* Add Spare Dialog */}
      <AddSpareDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddSpare={handleAddSpare}
        existingCount={spares.length}
      />
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[80px] font-semibold">Priority</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Asset Number</TableHead>
              <TableHead className="min-w-[100px] font-semibold">P&ID</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Area</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Sub-Area</TableHead>
              <TableHead className="min-w-[160px] font-semibold">System</TableHead>
              <TableHead className="min-w-[140px] font-semibold">Component</TableHead>
              <TableHead className="min-w-[200px] font-semibold">Description</TableHead>
              <TableHead className="min-w-[120px] font-semibold">OEM Part #</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Manufacturer</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">Min</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">Max</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Source</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <Badge variant="secondary" className={priorityColors[spare.priority]}>
                    {spare.priority}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">
                  {spare.assetNumber || "—"}
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {spare.pidTag || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {spare.area}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{spare.subArea || "—"}</TableCell>
                <TableCell className="text-sm">{spare.system || "—"}</TableCell>
                <TableCell className="font-medium">{spare.componentName}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {spare.sparePartDescription || "—"}
                </TableCell>
                <TableCell className="font-mono text-xs">{spare.oemPartNumber || "—"}</TableCell>
                <TableCell className="text-sm">{spare.manufacturer || "—"}</TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {spare.minQty || "—"}
                </TableCell>
                <TableCell className="text-center font-mono text-sm">
                  {spare.maxQty || "—"}
                </TableCell>
                <TableCell>
                  {spare.criticalitySource ? (
                    <Badge variant="secondary" className={criticalitySourceColors[spare.criticalitySource] || ""}>
                      {spare.criticalitySource}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={siteSpareStatusColors[spare.status] || ""}>
                    {spare.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {spares.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <div className="text-muted-foreground space-y-2">
            <p className="font-medium">No spares in the site catalogue yet</p>
            <p className="text-sm">
              Attach your spares list document and I'll populate this catalogue.
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
