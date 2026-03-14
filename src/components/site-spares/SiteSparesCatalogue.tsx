import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Package, AlertTriangle, Upload, Loader2, Database, RefreshCw, X, ImageIcon, ChevronLeft, ChevronRight, Hash, Copy, Download } from "lucide-react";
import { useSiteSparesPaginated, type PaginationFilters } from "@/hooks/useSiteSparesPaginated";
import { useSiteSpares, type SiteSpareItem } from "@/hooks/useSiteSpares";
import { AddSpareDialog } from "./AddSpareDialog";
import { ImportSpareDialog } from "./ImportSpareDialog";
import { SiteSpareCard } from "./SiteSpareCard";
import { SiteSpareDetailDialog } from "./SiteSpareDetailDialog";
import { OrphanedImageRecovery } from "./OrphanedImageRecovery";
import { DuplicateFinderDialog } from "./DuplicateFinderDialog";
import { classifyCriticality } from "@/utils/criticalityClassification";
import { classifyCategory } from "@/utils/categoryClassification";

import { generateNextSparePartNumber } from "@/utils/autoPartNumbering";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { generateSparesPDF } from "@/utils/generateSparesPDF";
import { allocateWarehouseArea } from "@/utils/categoryContainerMapping";

// Warehouse location codes — strict list (no custom entries)
const WAREHOUSE_LOCATIONS = [
  { value: "C01-EL", label: "C01-EL — Electrical" },
  { value: "C02-IN", label: "C02-IN — Instrumentation, Pneumatics & Process Fittings" },
  { value: "C03-ME", label: "C03-ME — Mechanical" },
  { value: "C04-MP", label: "C04-MP — Mechanical Precision" },
  { value: "C05-CS", label: "C05-CS — Consumables & Supplies" },
  { value: "LD", label: "LD — Laydown Yard" },
] as const;

export const SiteSparesCatalogue = () => {
  const paginated = useSiteSparesPaginated();
  const { fetchPage, fetchStats, fetchFilterOptions, setPage, page: paginatedPage } = paginated;
  // Keep legacy hook ONLY for import/merge/add/reclassify operations that need full dataset
  const legacy = useSiteSpares();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterWarehouse, setFilterWarehouse] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [filterSupplier, setFilterSupplier] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<"all" | "lowStock" | "critical">("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  
  const [selectedSpare, setSelectedSpare] = useState<SiteSpareItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [showImageRecovery, setShowImageRecovery] = useState(false);
  const [showDuplicateFinder, setShowDuplicateFinder] = useState(false);
  const [isReclassifyingCriticality, setIsReclassifyingCriticality] = useState(false);
  const [isReNumbering, setIsReNumbering] = useState(false);
  const [isReclassifyingWarehouse, setIsReclassifyingWarehouse] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState("");

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters: PaginationFilters = {
    searchQuery: searchDebounce,
    category: filterCategory,
    warehouseArea: filterWarehouse,
    status: filterStatus,
    supplier: filterSupplier,
    criticality: filterCriticality,
    quickFilter,
  };

  // Stable fetch helper — always reads latest filter state
  const doFetch = useCallback(
    (pageNum: number) => {
      fetchPage(
        {
          searchQuery: searchDebounce,
          category: filterCategory,
          warehouseArea: filterWarehouse,
          status: filterStatus,
          supplier: filterSupplier,
          criticality: filterCriticality,
          quickFilter,
        },
        pageNum
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchDebounce, filterCategory, filterWarehouse, filterStatus, filterSupplier, filterCriticality, quickFilter, fetchPage]
  );

  // Re-fetch whenever filters change (reset to page 0)
  useEffect(() => {
    setPage(0);
    doFetch(0);
  }, [doFetch]);

  // Re-fetch when user navigates pages (page > 0)
  useEffect(() => {
    if (paginatedPage === 0) return;
    doFetch(paginatedPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginatedPage]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    filterCategory !== "all" ||
    filterWarehouse !== "all" ||
    filterStatus !== "all" ||
    filterCriticality !== "all" ||
    filterSupplier !== "all" ||
    quickFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterWarehouse("all");
    setFilterStatus("all");
    setFilterCriticality("all");
    setFilterSupplier("all");
    setQuickFilter("all");
  };

  const refreshAll = () => {
    doFetch(paginatedPage);
    fetchStats();
    fetchFilterOptions();
  };

  // Handlers that use legacy hook for full-dataset operations
  const handleReclassifyAll = async () => {
    const freshSpares = await legacy.refetch();
    const sparesToUse = freshSpares || legacy.spares;
    const itemsToUpdate = sparesToUse.filter((spare) => {
      const correctCategory = classifyCategory(spare.description);
      return spare.category !== correctCategory && correctCategory !== "Consumables";
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
    refreshAll();
  };

  const handleReclassifyWarehouseAreas = async () => {
    setIsReclassifyingWarehouse(true);
    toast.loading("Checking warehouse areas...", { id: "reclassify-wh" });

    let updated = 0;
    let offset = 0;
    const batchSize = 500;

    try {
      while (true) {
        const { data, error } = await supabase
          .from("site_spares")
          .select("id, description, warehouse_area")
          .range(offset, offset + batchSize - 1);

        if (error) throw error;
        if (!data || data.length === 0) break;

        toast.loading(`Processing warehouse areas... (${offset + data.length} items)`, { id: "reclassify-wh" });

        for (const spare of data) {
          const correctArea = allocateWarehouseArea(spare.description);
          if (spare.warehouse_area !== correctArea) {
            const { error: updateError } = await supabase
              .from("site_spares")
              .update({ warehouse_area: correctArea })
              .eq("id", spare.id);
            if (!updateError) updated++;
          }
        }

        if (data.length < batchSize) break;
        offset += batchSize;
      }

      toast.dismiss("reclassify-wh");
      toast.success(`Warehouse areas updated: ${updated} items corrected`);
      refreshAll();
    } catch (error) {
      toast.dismiss("reclassify-wh");
      toast.error("Failed to reclassify warehouse areas");
    } finally {
      setIsReclassifyingWarehouse(false);
    }
  };

  const handleReclassifyCriticality = async () => {
    setIsReclassifyingCriticality(true);
    toast.loading("Fetching all items for reclassification...", { id: "reclassify-crit" });

    let updated = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;
    let offset = 0;
    const batchSize = 500;

    try {
      // Paginate through ALL items to avoid 1000-row limit
      while (true) {
        const { data, error } = await supabase
          .from("site_spares")
          .select("id, description, is_critical")
          .range(offset, offset + batchSize - 1);

        if (error) throw error;
        if (!data || data.length === 0) break;

        toast.loading(`Reclassifying criticality... (${offset + data.length} items processed)`, { id: "reclassify-crit" });

        for (const spare of data) {
          const criticality = classifyCriticality(spare.description);
          const shouldBeCritical = criticality === "HIGH";
          if (criticality === "HIGH") highCount++;
          else if (criticality === "MEDIUM") mediumCount++;
          else lowCount++;

          if (spare.is_critical !== shouldBeCritical) {
            const { error: updateError } = await supabase
              .from("site_spares")
              .update({ is_critical: shouldBeCritical })
              .eq("id", spare.id);
            if (!updateError) updated++;
          }
        }

        if (data.length < batchSize) break;
        offset += batchSize;
      }

      toast.dismiss("reclassify-crit");
      toast.success(`Criticality applied: ${highCount} HIGH, ${mediumCount} MEDIUM, ${lowCount} LOW`, {
        description: `Updated ${updated} items with new is_critical flag`,
      });
      refreshAll();
    } catch (error) {
      toast.dismiss("reclassify-crit");
      toast.error("Failed to reclassify criticality");
    } finally {
      setIsReclassifyingCriticality(false);
    }
  };

  const handleAddSpare = async (newSpare: Omit<SiteSpareItem, "id">) => {
    await legacy.addSpare(newSpare);
    refreshAll();
  };


  const handleImport = async (newSpares: Omit<SiteSpareItem, "id">[]) => {
    const result = await legacy.importSpares(newSpares);
    if (result) refreshAll();
    return result;
  };

  const handleMerge = async (newSpares: Omit<SiteSpareItem, "id">[]) => {
    const result = await legacy.mergeSpares(newSpares);
    if (result) refreshAll();
    return result;
  };

  const handleBatchReNumber = async () => {
    setIsReNumbering(true);
    // Use returned data directly to avoid stale React state
    const freshSpares = await legacy.refetch();
    const allSpares = freshSpares || legacy.spares;

    if (allSpares.length === 0) {
      toast.info("No items found to re-number");
      setIsReNumbering(false);
      return;
    }

    toast.loading(`Assigning 7-digit SSCCNNN part numbers to ${allSpares.length} items...`, { id: "renumber" });

    let updated = 0;
    let failed = 0;

    try {
      for (const spare of allSpares) {
        const category = spare.category || "Consumables";
        const newNumber = await generateNextSparePartNumber(category);
        if (!newNumber) {
          failed++;
          continue;
        }

        const { error } = await supabase
          .from("site_spares")
          .update({ part_number: newNumber })
          .eq("id", spare.id);

        if (!error) updated++;
        else failed++;
      }

      toast.dismiss("renumber");
      toast.success(`Assigned ${updated} SSCCNNN part numbers${failed > 0 ? ` (${failed} failed)` : ""}`);
      refreshAll();
    } catch (error) {
      toast.dismiss("renumber");
      toast.error("Re-numbering failed");
      console.error(error);
    } finally {
      setIsReNumbering(false);
    }
  };

  const handleSpareClick = (spare: SiteSpareItem) => {
    setSelectedSpare(spare);
    setDetailDialogOpen(true);
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    toast.loading("Preparing PDF...", { id: "pdf-download" });
    try {
      const count = await generateSparesPDF((msg) => {
        toast.loading(msg, { id: "pdf-download" });
      });
      toast.dismiss("pdf-download");
      toast.success(`PDF downloaded with ${count} spare parts`);
    } catch (error) {
      toast.dismiss("pdf-download");
      toast.error("Failed to generate PDF");
      console.error(error);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Display page already server-filtered; criticality filter is additionally validated by classifier
  const displaySpares = useMemo(() => {
    if (filterCriticality === "all") return paginated.spares;
    return paginated.spares.filter((spare) => {
      const level = classifyCriticality(spare.description);
      return level === filterCriticality;
    });
  }, [paginated.spares, filterCriticality]);

  // Sync selected spare with paginated results
  const currentSelectedSpare = selectedSpare
    ? displaySpares.find((s) => s.id === selectedSpare.id) || selectedSpare
    : null;

  // Pagination info
  const totalPages = Math.ceil(paginated.totalFiltered / paginated.pageSize);
  const currentPage = paginated.page;

  if (paginated.loading && displaySpares.length === 0) {
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
          <p className="text-2xl font-bold mt-1">{paginated.stats.totalItems}</p>
          <p className="text-xs text-muted-foreground">{paginated.stats.withPhotosCount} with photos</p>
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
          <p className="text-2xl font-bold mt-1 text-warning">{paginated.stats.lowStockCount}</p>
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
          <p className="text-2xl font-bold mt-1 text-primary">{paginated.stats.criticalCount}</p>
          <p className="text-xs text-muted-foreground">flagged HIGH</p>
        </div>
        <div className="rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Showing</span>
          </div>
          <p className="text-2xl font-bold mt-1">{displaySpares.length}</p>
          <p className="text-xs text-muted-foreground">of {paginated.totalFiltered} filtered</p>
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
            <SelectContent className="bg-popover z-50">
              <SelectItem value="all">All Categories</SelectItem>
              {[
                ...paginated.availableCategories,
                ...(filterCategory !== "all" && !paginated.availableCategories.includes(filterCategory) ? [filterCategory] : []),
              ].map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Warehouse" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {WAREHOUSE_LOCATIONS.map((loc) => (
                <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
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
          <Select value={filterSupplier} onValueChange={setFilterSupplier}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {paginated.availableSuppliers.map((sup) => (
                <SelectItem key={sup} value={sup}>{sup}</SelectItem>
              ))}
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
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleReclassifyWarehouseAreas}
            disabled={isReclassifyingWarehouse}
          >
            {isReclassifyingWarehouse ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
            Reclassify Warehouse
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleBatchReNumber}
            disabled={isReNumbering}
          >
            {isReNumbering ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hash className="h-4 w-4" />}
            Re-number Parts
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setShowDuplicateFinder(true)}>
            <Copy className="h-4 w-4" />
            Find Duplicates
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={() => setImportDialogOpen(true)}>
            <Upload className="h-4 w-4" />
            Import Excel
          </Button>
          <Button
            size="sm"
            variant={showImageRecovery ? "default" : "outline"}
            className="gap-2"
            onClick={() => setShowImageRecovery(!showImageRecovery)}
          >
            <ImageIcon className="h-4 w-4" />
            {showImageRecovery ? "Hide Image Recovery" : "Recover Images"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-2"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
          >
            {isDownloadingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download Parts List
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddSpareDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddSpare={handleAddSpare} />
      <DuplicateFinderDialog
        open={showDuplicateFinder}
        onOpenChange={setShowDuplicateFinder}
        onResolved={refreshAll}
      />
      <ImportSpareDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
        onMerge={handleMerge}
        existingSpares={legacy.spares}
      />
      <SiteSpareDetailDialog
        spare={currentSelectedSpare}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdate={paginated.updateSpare}
        onDelete={async (id) => {
          const result = await paginated.deleteSpare(id);
          if (result) {
            setDetailDialogOpen(false);
            paginated.fetchStats();
          }
          return result;
        }}
      />

      {/* Image Recovery Tool */}
      {showImageRecovery && (
        <OrphanedImageRecovery
          spares={legacy.spares}
          onImageAssigned={() => {
            legacy.refetch();
            refreshAll();
          }}
        />
      )}

      {/* Card Grid */}
      {displaySpares.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displaySpares.map((spare) => (
              <SiteSpareCard
                key={spare.id}
                spare={spare}
                onClick={() => handleSpareClick(spare)}
                onUpdate={paginated.updateSpare}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginated.setPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => paginated.setPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage >= totalPages - 1}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : paginated.stats.totalItems === 0 ? (
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
