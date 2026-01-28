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
import { Plus, Search, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  siteSparesData,
  siteSpareStatusColors,
  type SiteSpareItem,
} from "./siteSparesData";

export const SiteSparesTable = () => {
  const [spares] = useState<SiteSpareItem[]>(siteSparesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCritical, setFilterCritical] = useState<string>("all");

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.parentAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.sparePartDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || spare.status === filterStatus;
    const matchesCritical =
      filterCritical === "all" ||
      (filterCritical === "critical" && spare.isCritical) ||
      (filterCritical === "non-critical" && !spare.isCritical);
    return matchesSearch && matchesStatus && matchesCritical;
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
          <Select value={filterCritical} onValueChange={setFilterCritical}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Critical" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="non-critical">Non-Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Obsolete">Obsolete</SelectItem>
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
              <TableHead className="min-w-[60px] font-semibold">Critical</TableHead>
              <TableHead className="min-w-[80px] font-semibold">ID</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Area</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Sub-Area</TableHead>
              <TableHead className="min-w-[100px] font-semibold">System</TableHead>
              <TableHead className="min-w-[160px] font-semibold">Parent Asset</TableHead>
              <TableHead className="min-w-[140px] font-semibold">Component Name</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Type</TableHead>
              <TableHead className="min-w-[180px] font-semibold">Description</TableHead>
              <TableHead className="min-w-[120px] font-semibold">OEM Part #</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Manufacturer</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">Min Qty</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">Max Qty</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  {spare.isCritical ? (
                    <Flag className="h-4 w-4 text-destructive fill-destructive/20" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
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
                <TableCell className="font-mono text-sm">{spare.oemPartNumber || "—"}</TableCell>
                <TableCell className="text-sm">{spare.manufacturer || "—"}</TableCell>
                <TableCell className="text-center font-mono">
                  {spare.minQty || "—"}
                </TableCell>
                <TableCell className="text-center font-mono">
                  {spare.maxQty || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={siteSpareStatusColors[spare.status]}>
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
