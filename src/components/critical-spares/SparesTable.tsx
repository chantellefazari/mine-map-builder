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
import { Search, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  sparesData,
  criticalityColors,
  statusColors,
  criticalitySourceColors,
  type SpareItem,
} from "./sparesData";
import { AddSpareDialog } from "./AddSpareDialog";

export const SparesTable = () => {
  const [spares, setSpares] = useState<SpareItem[]>(sparesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterSubArea, setFilterSubArea] = useState<string>("all");

  const areas = [...new Set(sparesData.map((s) => s.area))].sort();
  
  // Get sub-areas based on selected area filter
  const subAreas = [...new Set(
    sparesData
      .filter((s) => filterArea === "all" || s.area === filterArea)
      .map((s) => s.subArea)
  )].sort();

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
    const matchesSubArea = filterSubArea === "all" || spare.subArea === filterSubArea;
    return matchesSearch && matchesCriticality && matchesStatus && matchesArea && matchesSubArea;
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
          <Select value={filterSubArea} onValueChange={setFilterSubArea}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sub-Area" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="all">All Sub-Areas</SelectItem>
              {subAreas.map((subArea) => (
                <SelectItem key={subArea} value={subArea}>
                  {subArea}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCriticality} onValueChange={setFilterCriticality}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Criticality" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              <SelectItem value="all">All Critical</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
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
          <AddSpareDialog 
            onAddSpare={(newSpare) => setSpares([...spares, newSpare])} 
            existingCount={spares.length} 
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[100px] font-semibold">Criticality</TableHead>
              <TableHead className="min-w-[140px] font-semibold">Asset Number</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Area</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Sub-Area</TableHead>
              <TableHead className="min-w-[100px] font-semibold">System</TableHead>
              <TableHead className="min-w-[140px] font-semibold">Component Name</TableHead>
              <TableHead className="min-w-[180px] font-semibold">Description</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Manufacturer</TableHead>
              <TableHead className="min-w-[180px] font-semibold">OEM Part Number</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Vendor/Supplier</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center">Lead Time (Days)</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Unit Price</TableHead>
              <TableHead className="min-w-[80px] font-semibold">Source</TableHead>
              <TableHead className="min-w-[150px] font-semibold">Reason Critical</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">Qty On Hand</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center">Min Qty (Prov.)</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center">Max Qty (Prov.)</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Confidence</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  {spare.spareCriticality && (
                    <Badge variant="secondary" className={criticalityColors[spare.spareCriticality]}>
                      {spare.spareCriticality}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">
                  {spare.assetNumber || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {spare.area}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{spare.subArea}</TableCell>
                <TableCell className="text-sm">{spare.system}</TableCell>
                <TableCell className="font-medium">{spare.componentName}</TableCell>
                <TableCell className="text-sm">{spare.sparePartDescription}</TableCell>
                <TableCell className="text-sm font-medium">{spare.manufacturer || "—"}</TableCell>
                <TableCell className="text-sm font-mono">{spare.oemPartNumber || "—"}</TableCell>
                <TableCell className="text-sm">{spare.vendor || "—"}</TableCell>
                <TableCell className="p-1">
                  <Select
                    value={spare.leadTimeDays || "TBC"}
                    onValueChange={(value) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, leadTimeDays: value } : s
                      );
                      setSpares(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="TBC">TBC</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="14">14</SelectItem>
                      <SelectItem value="21">21</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="45">45</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="90">90</SelectItem>
                      <SelectItem value="120">120</SelectItem>
                      <SelectItem value="180">180</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm font-medium">{spare.unitPrice || "TBC"}</TableCell>
                <TableCell>
                  {spare.criticalitySource && (
                    <Badge variant="secondary" className={criticalitySourceColors[spare.criticalitySource]}>
                      {spare.criticalitySource}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {spare.reasonCritical}
                </TableCell>
                <TableCell className="p-1">
                  <Select
                    value={spare.qtyOnHand || "TBC"}
                    onValueChange={(value) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, qtyOnHand: value } : s
                      );
                      setSpares(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="TBC">TBC</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1">
                  <Select
                    value={spare.minQty || "TBC"}
                    onValueChange={(value) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, minQty: value } : s
                      );
                      setSpares(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="TBC">TBC</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1">
                  <Select
                    value={spare.maxQty || "TBC"}
                    onValueChange={(value) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, maxQty: value } : s
                      );
                      setSpares(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="TBC">TBC</SelectItem>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1">
                  <Select
                    value={spare.confidence || "Low"}
                    onValueChange={(value: "Low" | "Medium" | "High") => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, confidence: value } : s
                      );
                      setSpares(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-1">
                  <Select
                    value={spare.status}
                    onValueChange={(value: "Provisional" | "TBC" | "Confirmed") => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, status: value } : s
                      );
                      setSpares(updated);
                    }}
                  >
                    <SelectTrigger className="h-8 w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border shadow-lg z-50">
                      <SelectItem value="Provisional">Provisional</SelectItem>
                      <SelectItem value="TBC">TBC</SelectItem>
                      <SelectItem value="Confirmed">Confirmed</SelectItem>
                    </SelectContent>
                  </Select>
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
          <span className="font-medium">Source:</span>
          <Badge variant="secondary" className={criticalitySourceColors["Confirmed"]}>Confirmed</Badge>
          <Badge variant="secondary" className={criticalitySourceColors["Assumed"]}>Assumed</Badge>
        </div>
      </div>
    </div>
  );
};
