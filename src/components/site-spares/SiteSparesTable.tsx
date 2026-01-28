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
import { Plus, Search, Package, AlertTriangle, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  siteSparesData,
  stockStatusColors,
  categoryColors,
  warehouseAreas,
  categories,
  type SiteSpareItem,
} from "./siteSparesData";
import { AddSpareDialog } from "./AddSpareDialog";
import { ImportSpareDialog } from "./ImportSpareDialog";
import { useToast } from "@/hooks/use-toast";

export const SiteSparesTable = () => {
  const [spares, setSpares] = useState<SiteSpareItem[]>(siteSparesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { toast } = useToast();

  const categoryList = Object.keys(categories).sort();

  const handleAddSpare = (newSpare: SiteSpareItem) => {
    setSpares((prev) => [...prev, newSpare]);
    toast({
      title: "Item Added",
      description: `${newSpare.description} has been added to inventory.`,
    });
  };

  const handleImportSpares = (newItems: SiteSpareItem[]) => {
    // Replace all existing data with imported items
    setSpares(newItems);
  };

  const filteredSpares = spares.filter((spare) => {
    const matchesSearch =
      spare.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.oemPartNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.binLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spare.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || spare.category === filterCategory;
    const matchesWarehouse = filterWarehouse === "all" || spare.warehouseArea === filterWarehouse;
    const matchesStatus = filterStatus === "all" || spare.status === filterStatus;
    return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus;
  });

  // Summary stats
  const totalItems = spares.length;
  const lowStockCount = spares.filter(s => s.status === "Low Stock" || s.status === "Out of Stock").length;
  const criticalCount = spares.filter(s => s.isCritical).length;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Items</span>
          </div>
          <p className="text-2xl font-bold mt-1">{totalItems}</p>
        </div>
        <div className="bg-amber-500/10 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-700">Low/Out of Stock</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-amber-700">{lowStockCount}</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-4">
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
              {categoryList.map((cat) => (
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
                  Area {area}
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
        existingCount={spares.length}
      />

      {/* Import Dialog */}
      <ImportSpareDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImportSpares}
        existingCount={0}
      />

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[100px] font-semibold">Part Number</TableHead>
              <TableHead className="min-w-[250px] font-semibold">Description</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Category</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Subcategory</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Bin Location</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">On Hand</TableHead>
              <TableHead className="min-w-[70px] font-semibold text-center">Min</TableHead>
              <TableHead className="min-w-[70px] font-semibold text-center">Max</TableHead>
              <TableHead className="min-w-[60px] font-semibold">UOM</TableHead>
              <TableHead className="min-w-[120px] font-semibold">Manufacturer</TableHead>
              <TableHead className="min-w-[120px] font-semibold">OEM Part #</TableHead>
              <TableHead className="min-w-[100px] font-semibold">Status</TableHead>
              <TableHead className="min-w-[80px] font-semibold text-center">Critical</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSpares.map((spare) => (
              <TableRow key={spare.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm font-medium text-muted-foreground">
                  {spare.partNumber || "—"}
                </TableCell>
                <TableCell className="font-medium">{spare.description}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={categoryColors[spare.category] || ""}>
                    {spare.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{spare.subcategory}</TableCell>
                <TableCell className="font-mono text-sm">{spare.binLocation}</TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    value={spare.qtyOnHand}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 0;
                      const updated = spares.map((s) =>
                        s.id === spare.id 
                          ? { ...s, qtyOnHand: newQty, status: newQty === 0 ? "Out of Stock" as const : newQty <= s.minQty ? "Low Stock" as const : "Active" as const } 
                          : s
                      );
                      setSpares(updated);
                    }}
                    className="h-8 w-16 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    value={spare.minQty}
                    onChange={(e) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, minQty: parseInt(e.target.value) || 0 } : s
                      );
                      setSpares(updated);
                    }}
                    className="h-8 w-14 text-center"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={0}
                    value={spare.maxQty}
                    onChange={(e) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, maxQty: parseInt(e.target.value) || 0 } : s
                      );
                      setSpares(updated);
                    }}
                    className="h-8 w-14 text-center"
                  />
                </TableCell>
                <TableCell className="text-sm">{spare.uom}</TableCell>
                <TableCell>
                  <Input
                    value={spare.manufacturer}
                    onChange={(e) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, manufacturer: e.target.value } : s
                      );
                      setSpares(updated);
                    }}
                    className="h-8 w-28"
                    placeholder="—"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={spare.oemPartNumber}
                    onChange={(e) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, oemPartNumber: e.target.value } : s
                      );
                      setSpares(updated);
                    }}
                    className="h-8 w-28 font-mono text-sm"
                    placeholder="—"
                  />
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={stockStatusColors[spare.status]}>
                    {spare.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <input
                    type="checkbox"
                    checked={spare.isCritical}
                    onChange={(e) => {
                      const updated = spares.map((s) =>
                        s.id === spare.id ? { ...s, isCritical: e.target.checked } : s
                      );
                      setSpares(updated);
                    }}
                    className="h-4 w-4 rounded border-border"
                  />
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
              Add your first item or import from a spreadsheet.
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
