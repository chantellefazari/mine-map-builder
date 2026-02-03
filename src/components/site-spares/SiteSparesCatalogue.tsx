import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Package, AlertTriangle, Upload, Loader2, Database, RefreshCw, X } from "lucide-react";
import { useSiteSpares, type SiteSpareItem } from "@/hooks/useSiteSpares";
import { AddSpareDialog } from "./AddSpareDialog";
import { ImportSpareDialog } from "./ImportSpareDialog";
import { SiteSpareCard } from "./SiteSpareCard";
import { SiteSpareDetailDialog } from "./SiteSpareDetailDialog";
import { classifyCriticality, type CriticalityLevel } from "@/utils/criticalityClassification";
import { classifyCategory } from "@/utils/categoryClassification";
import { importCriticalSparesToSiteSpares } from "@/utils/importCriticalSparesToSiteSpares";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Warehouse areas list
const warehouseAreas = [
  "Storage Shelter",
  "Site Office Laydown Area",
  "Shutdown Staging Area",
  "Workshop",
  "Workshop Laydown Area",
  "WC01",
  "WC02",
  "WC03",
  "WC04",
  "WC05",
  "WC07 (Crushing Area)",
  "WC08 (Crushing Area)",
  "WC09 (Crushing Area)",
  "Crushing Laydown Area",
  "MCC",
];

export const SiteSparesCatalogue = () => {
  const { spares, loading, addSpare, importSpares, mergeSpares, updateSpare, deleteSpare, refetch } = useSiteSpares();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<"all" | "lowStock" | "critical">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importingCritical, setImportingCritical] = useState(false);
  const [selectedSpare, setSelectedSpare] = useState<SiteSpareItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Derive categories dynamically from actual data
  const availableCategories = [...new Set(spares.map((s) => s.category))].filter(Boolean).sort();

  const getCriticality = (spare: SiteSpareItem): CriticalityLevel => {
    return classifyCriticality(spare.description);
  };

  const [isReclassifyingCriticality, setIsReclassifyingCriticality] = useState(false);

  const handleReclassifyAll = async () => {
    const itemsToUpdate = spares.filter((spare) => {
      const correctCategory = classifyCategory(spare.description);
      return spare.category !== correctCategory && correctCategory !== "General";
    });

    if (itemsToUpdate.length === 0) {
      toast.info("All items are already correctly categorized");
      return;
    }

    toast.loading(`Reclassifying ${itemsToUpdate.length} items...`, { id: "reclassify" });

    let updated = 0;
    for (const spare of itemsToUpdate) {
      const newCategory = classifyCategory(spare.description);
      const { error } = await supabase
        .from("site_spares")
        .update({ category: newCategory })
        .eq("id", spare.id);

      if (!error) updated++;
    }

    toast.dismiss("reclassify");
    toast.success(`Reclassified ${updated} items to correct categories`);
    refetch();
  };

  const handleReclassifyCriticality = async () => {
    setIsReclassifyingCriticality(true);
    toast.loading(`Reclassifying criticality for ${spares.length} items...`, { id: "reclassify-crit" });

    let updated = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    try {
      for (const spare of spares) {
        const criticality = classifyCriticality(spare.description);
        const shouldBeCritical = criticality === "HIGH";
        
        // Track counts
        if (criticality === "HIGH") highCount++;
        else if (criticality === "MEDIUM") mediumCount++;
        else lowCount++;

        // Update is_critical flag if needed
        if (spare.is_critical !== shouldBeCritical) {
          const { error } = await supabase
            .from("site_spares")
            .update({ is_critical: shouldBeCritical })
            .eq("id", spare.id);

          if (!error) updated++;
        }
      }

      toast.dismiss("reclassify-crit");
      toast.success(`Criticality applied: ${highCount} HIGH, ${mediumCount} MEDIUM, ${lowCount} LOW`, {
        description: `Updated ${updated} items with new is_critical flag`,
      });
      refetch();
    } catch (error) {
      toast.dismiss("reclassify-crit");
      toast.error("Failed to reclassify criticality");
    } finally {
      setIsReclassifyingCriticality(false);
    }
  };

  const handleAddSpare = async (newSpare: Omit<SiteSpareItem, "id">) => {
    await addSpare(newSpare);
  };

  const handleImportCriticalSpares = async () => {
    setImportingCritical(true);
    try {
      const result = await importCriticalSparesToSiteSpares();
      if (result.errors.length > 0) {
        toast.error(`Import completed with errors: ${result.errors.join(", ")}`);
      } else if (result.inserted === 0 && result.skipped > 0) {
        toast.info(`All ${result.skipped} Critical Spares already exist in catalogue`);
      } else {
        toast.success(`Imported ${result.inserted} Critical Spares (${result.skipped} already existed)`);
      }
      refetch();
    } catch (error) {
      toast.error("Failed to import Critical Spares");
      console.error(error);
    } finally {
      setImportingCritical(false);
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    filterCategory !== "all" ||
    filterWarehouse !== "all" ||
    filterStatus !== "all" ||
    filterCriticality !== "all" ||
    quickFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterWarehouse("all");
    setFilterStatus("all");
    setFilterCriticality("all");
    setQuickFilter("all");
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

    const spareCriticality = getCriticality(spare);
    const matchesCriticality = filterCriticality === "all" || spareCriticality === filterCriticality;

    const matchesQuickFilter =
      quickFilter === "all" ||
      (quickFilter === "lowStock" && (spare.status === "Low Stock" || spare.status === "Out of Stock")) ||
      (quickFilter === "critical" && spareCriticality === "HIGH");

    return matchesSearch && matchesCategory && matchesWarehouse && matchesStatus && matchesCriticality && matchesQuickFilter;
  });

  // Summary stats
  const totalItems = spares.length;
  const lowStockCount = spares.filter((s) => s.status === "Low Stock" || s.status === "Out of Stock").length;
  const criticalCount = spares.filter((s) => getCriticality(s) === "HIGH").length;
  const withPhotosCount = spares.filter((s) => (s.image_urls || []).length > 0).length;

  const handleSpareClick = (spare: SiteSpareItem) => {
    setSelectedSpare(spare);
    setDetailDialogOpen(true);
  };

  // Sync selected spare with spares list changes
  const currentSelectedSpare = selectedSpare
    ? spares.find((s) => s.id === selectedSpare.id) || null
    : null;

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
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className={`rounded-lg p-4 cursor-pointer transition-all ${
            quickFilter === "all" ? "bg-primary/20 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
          }`}
          onClick={() => setQuickFilter("all")}
        >
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Items</span>
          </div>
          <p className="text-2xl font-bold mt-1">{totalItems}</p>
          <p className="text-xs text-muted-foreground">{withPhotosCount} with photos</p>
        </div>
        <div
          className={`rounded-lg p-4 cursor-pointer transition-all ${
            quickFilter === "lowStock" ? "bg-warning/30 ring-2 ring-warning" : "bg-warning/10 hover:bg-warning/20"
          }`}
          onClick={() => setQuickFilter("lowStock")}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span className="text-sm text-warning">Low/Out of Stock</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-warning">{lowStockCount}</p>
        </div>
        <div
          className={`rounded-lg p-4 cursor-pointer transition-all ${
            quickFilter === "critical" ? "bg-primary/30 ring-2 ring-primary" : "bg-primary/10 hover:bg-primary/20"
          }`}
          onClick={() => setQuickFilter("critical")}
        >
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-sm text-primary">Critical Items</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-primary">{criticalCount}</p>
        </div>
        <div className="rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing</span>
          </div>
          <p className="text-2xl font-bold mt-1">{filteredSpares.length}</p>
          <p className="text-xs text-muted-foreground">of {totalItems} items</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map((cat) => (
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
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Criticality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Criticality</SelectItem>
              <SelectItem value="HIGH">🔴 HIGH</SelectItem>
              <SelectItem value="MEDIUM">🟠 MEDIUM</SelectItem>
              <SelectItem value="LOW">🟢 LOW</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleImportCriticalSpares}
            disabled={importingCritical}
          >
            {importingCritical ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            Import Critical Spares
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={handleReclassifyAll}>
            <RefreshCw className="h-4 w-4" />
            Reclassify Categories
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="gap-2" 
            onClick={handleReclassifyCriticality}
            disabled={isReclassifyingCriticality}
          >
            {isReclassifyingCriticality ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
            Reclassify Criticality
          </Button>
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

      {/* Dialogs */}
      <AddSpareDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddSpare={handleAddSpare} />
      <ImportSpareDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={importSpares}
        onMerge={mergeSpares}
        existingSpares={spares}
      />
      <SiteSpareDetailDialog
        spare={currentSelectedSpare}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdate={updateSpare}
        onDelete={deleteSpare}
      />

      {/* Card Grid */}
      {filteredSpares.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredSpares.map((spare) => (
            <SiteSpareCard
              key={spare.id}
              spare={spare}
              onClick={() => handleSpareClick(spare)}
              onUpdate={updateSpare}
            />
          ))}
        </div>
      ) : spares.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <div className="text-muted-foreground space-y-2">
            <p className="font-medium">No items in inventory yet</p>
            <p className="text-sm">Import your stock list using the Import Excel button above.</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground space-y-3">
          <p>No items match your current filters.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
};
