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
import { Plus, Search, Package, AlertTriangle, Upload, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSiteSpares, type SiteSpareItem } from "@/hooks/useSiteSpares";
import { AddSpareDialog } from "./AddSpareDialog";
import { ImportSpareDialog } from "./ImportSpareDialog";
import { classifyCriticality, type CriticalityLevel } from "@/utils/criticalityClassification";

// Criticality badge colors
const criticalityColors: Record<CriticalityLevel, string> = {
  "HIGH": "bg-destructive/20 text-destructive border-destructive/30",
  "MEDIUM": "bg-warning/20 text-warning border-warning/30",
  "LOW": "bg-success/20 text-success border-success/30",
};

// Status colors for UI
const stockStatusColors: Record<string, string> = {
  "Active": "bg-green-500/20 text-green-700",
  "Low Stock": "bg-amber-500/20 text-amber-700",
  "Out of Stock": "bg-destructive/20 text-destructive",
  "Pending Review": "bg-blue-500/20 text-blue-700",
  "Obsolete": "bg-muted text-muted-foreground",
  "Require Repair": "bg-orange-500/20 text-orange-700",
};

// Category colors
const categoryColors: Record<string, string> = {
  "Pipe Fitting": "bg-blue-500/20 text-blue-700",
  "Motor": "bg-purple-500/20 text-purple-700",
  "Pump": "bg-cyan-500/20 text-cyan-700",
  "Valve": "bg-green-500/20 text-green-700",
  "Filter": "bg-teal-500/20 text-teal-700",
  "Bearing": "bg-orange-500/20 text-orange-700",
  "Electrical": "bg-blue-600/20 text-blue-800",
  "Consumable": "bg-green-600/20 text-green-800",
};

const warehouseAreas = [
  "Storage Shelter", "Site Office Laydown Area", "Shutdown Staging Area",
  "Workshop", "Workshop Laydown Area", "WC01", "WC02", "WC03", "WC04", "WC05",
  "WC07 (Crushing Area)", "WC08 (Crushing Area)", "WC09 (Crushing Area)",
  "Crushing Laydown Area", "MCC"
];

const categories = [
  "Pipe Fitting", "Motor", "Pump", "Valve", "Filter", "Bearing", "Electrical", "Consumable", "General"
];

export const SiteSparesTable = () => {
  const { spares, loading, addSpare, importSpares, mergeSpares, updateSpare } = useSiteSpares();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<"all" | "lowStock" | "critical">("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Helper to get criticality level - always use description-based classification
  const getCriticality = (spare: SiteSpareItem): CriticalityLevel => {
    return classifyCriticality(spare.description);
  };

  const handleAddSpare = async (newSpare: Omit<SiteSpareItem, "id">) => {
    await addSpare(newSpare);
  };

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oem_part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.bin_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || spare.category === filterCategory;
    const matchesWarehouse = filterWarehouse === "all" || spare.warehouse_area === filterWarehouse;
    const matchesStatus = filterStatus === "all" || spare.status === filterStatus;
    
    // Criticality filter
    const spareCriticality = getCriticality(spare);
    const matchesCriticality = filterCriticality === "all" || spareCriticality === filterCriticality;
    
    // Quick filter from summary tabs
    const matchesQuickFilter =
      quickFilter === "all" ||
      (quickFilter === "lowStock" && (spare.status === "Low Stock" || spare.status === "Out of Stock")) ||
      (quickFilter === "critical" && spareCriticality === "HIGH");
    
    return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus && matchesCriticality && matchesQuickFilter;
  });

  // Summary stats
  const totalItems = spares.length;
  const lowStockCount = spares.filter(s => s.status === "Low Stock" || s.status === "Out of Stock").length;
  const criticalCount = spares.filter(s => getCriticality(s) === "HIGH").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading inventory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats - Clickable Filters */}
      <div className="grid grid-cols-3 gap-4">
        <div 
          className={`rounded-lg p-4 cursor-pointer transition-all ${
            quickFilter === "all" 
              ? "bg-primary/20 ring-2 ring-primary" 
              : "bg-muted/50 hover:bg-muted"
          }`}
          onClick={() => setQuickFilter("all")}
        >
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Items</span>
          </div>
          <p className="text-2xl font-bold mt-1">{totalItems}</p>
        </div>
        <div 
          className={`rounded-lg p-4 cursor-pointer transition-all ${
            quickFilter === "lowStock" 
              ? "bg-amber-500/30 ring-2 ring-amber-500" 
              : "bg-amber-500/10 hover:bg-amber-500/20"
          }`}
          onClick={() => setQuickFilter("lowStock")}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-700">Low/Out of Stock</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-amber-700">{lowStockCount}</p>
        </div>
        <div 
          className={`rounded-lg p-4 cursor-pointer transition-all ${
            quickFilter === "critical" 
              ? "bg-primary/30 ring-2 ring-primary" 
              : "bg-primary/10 hover:bg-primary/20"
          }`}
          onClick={() => setQuickFilter("critical")}
        >
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-sm text-primary">Critical Items</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-primary">{criticalCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Inventory ({filteredSpares.length} items)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {warehouseAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Obsolete">Obsolete</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCriticality} onValueChange={setFilterCriticality}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Criticality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Criticality</SelectItem>
              <SelectItem value="HIGH">🔴 HIGH</SelectItem>
              <SelectItem value="MEDIUM">🟠 MEDIUM</SelectItem>
              <SelectItem value="LOW">🟢 LOW</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Add Spare Dialog */}
      <AddSpareDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddSpare={handleAddSpare}
      />

      {/* Import Dialog */}
      <ImportSpareDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={importSpares}
        onMerge={mergeSpares}
        existingSpares={spares}
      />

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[100px] font-semibold">Part Number</TableHead>
              <TableHead className="min-w-[250px] font-semibold">Description</TableHead>
              <TableHead className="min-w-[150px] font-semibold">Size / Specs</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Category</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Bin Location</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">On Hand</TableHead>
              <TableHead className="min-w-[70px] font-semibold text-center">Min</TableHead>
              <TableHead className="min-w-[70px] font-semibold text-center">Max</TableHead>
              <TableHead className="min-w-[60px] font-semibold">UOM</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Supplier/ Manufacturer</TableHead>
              <TableHead className="min-w-[120px] font-semibold">OEM Part #</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
              <TableHead className="min-w-[90px] font-semibold text-center">Criticality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium text-muted-foreground">
                  {spare.part_number || "—"}
                </TableCell>
                <TableCell className="font-medium">{spare.description}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {spare.specifications || "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={categoryColors[spare.category] || ""}>
                    {spare.category}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{spare.bin_location}</TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    value={spare.qty_on_hand}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 0;
                      const newStatus = newQty === 0 ? "Out of Stock" : newQty <= spare.min_qty ? "Low Stock" : "Active";
                      updateSpare(spare.id, { qty_on_hand: newQty, status: newStatus });
                    }}
                    className="h-8 w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    value={spare.min_qty}
                    onChange={(e) => {
                      updateSpare(spare.id, { min_qty: parseInt(e.target.value) || 0 });
                    }}
                    className="h-8 w-14 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    value={spare.max_qty}
                    onChange={(e) => {
                      updateSpare(spare.id, { max_qty: parseInt(e.target.value) || 0 });
                    }}
                    className="h-8 w-14 text-center"
                  />
                </TableCell>
                <TableCell className="text-sm">{spare.uom}</TableCell>
                <TableCell>
                  <Input
                    value={spare.manufacturer}
                    onChange={(e) => {
                      updateSpare(spare.id, { manufacturer: e.target.value });
                    }}
                    className="h-8 w-28"
                    placeholder="—"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={spare.oem_part_number}
                    onChange={(e) => {
                      updateSpare(spare.id, { oem_part_number: e.target.value });
                    }}
                    className="h-8 w-28 font-mono text-sm"
                    placeholder="—"
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={stockStatusColors[spare.status] || ""}>
                    {spare.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {(() => {
                    const level = getCriticality(spare);
                    return (
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-semibold ${criticalityColors[level]}`}
                      >
                        {level}
                      </Badge>
                    );
                  })()}
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
            <p className="font-medium">No items in inventory yet</p>
            <p className="text-sm">
              Import your stock list using the Import Excel button above.
            </p>
          </div>
        </div>
      )}

      {spares.length > 0 && filteredSpares.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No items match your search criteria.
        </div>
      )}
    </div>
  );
};
