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
import { Plus, Search, Loader2, ImageIcon, AlertTriangle, RefreshCw, GitCompare, X } from "lucide-react";
import { useVisualPartsCatalogueSafe, type VisualPart } from "@/hooks/useVisualPartsCatalogueSafe";
import { VisualPartCard } from "./VisualPartCard";
import { VisualPartDetailDialog } from "./VisualPartDetailDialog";
import { AddVisualPartDialog } from "./AddVisualPartDialog";
import { PartsComparisonDialog } from "./PartsComparisonDialog";
import { PART_CATEGORIES, CRITICALITY_LEVELS } from "./visualPartsConstants";
import { classifyVisualPartCategory } from "@/utils/visualPartsClassification";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const VisualPartsCatalogue = () => {
  const { toast } = useToast();
  const {
    parts,
    loading,
    addPart,
    updatePart,
    deletePart,
    addImageToPart,
    removeImageFromPart,
    refetch,
  } = useVisualPartsCatalogueSafe();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [comparisonDialogOpen, setComparisonDialogOpen] = useState(false);
  const [isReclassifying, setIsReclassifying] = useState(false);
  const [selectedPart, setSelectedPart] = useState<VisualPart | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    filterCategory !== "all" ||
    filterCriticality !== "all";

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.site_part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.associated_asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (part.supplier || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || part.category === filterCategory;
    const matchesCriticality = filterCriticality === "all" || part.criticality === filterCriticality;
    return matchesSearch && matchesCategory && matchesCriticality;
  });

  // Stats
  const totalParts = parts.length;
  const highCriticalCount = parts.filter((p) => p.criticality === "High").length;
  const partsWithImages = parts.filter((p) => p.image_urls.length > 0).length;
  const generalCount = parts.filter((p) => p.category === "General").length;

  // Reclassify all "General" parts using smart classification
  const handleReclassifyCategories = async () => {
    const generalParts = parts.filter((p) => p.category === "General");
    if (generalParts.length === 0) {
      toast({
        title: "No items to reclassify",
        description: "All parts already have specific categories",
      });
      return;
    }

    setIsReclassifying(true);
    let updated = 0;

    try {
      for (const part of generalParts) {
        const newCategory = classifyVisualPartCategory(part.part_name, null);
        if (newCategory !== "General") {
          const { error } = await supabase
            .from("visual_parts_catalogue")
            .update({ category: newCategory })
            .eq("id", part.id);
          
          if (!error) {
            updated++;
          }
        }
      }

      if (updated > 0) {
        toast({
          title: "Categories updated",
          description: `${updated} parts reclassified based on descriptions`,
        });
        refetch();
      } else {
        toast({
          title: "No changes made",
          description: "Could not determine specific categories for any General items",
        });
      }
    } catch (error) {
      console.error("Error reclassifying:", error);
      toast({
        title: "Reclassification failed",
        description: "An error occurred while updating categories",
        variant: "destructive",
      });
    } finally {
      setIsReclassifying(false);
    }
  };

  const handlePartClick = (part: VisualPart) => {
    setSelectedPart(part);
    setDetailDialogOpen(true);
  };

  // Sync selected part with parts list changes
  const currentSelectedPart = selectedPart
    ? parts.find((p) => p.id === selectedPart.id) || null
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading visual catalogue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ImageIcon className="h-4 w-4 text-primary" />
        </div>
        <div className="text-sm">
          <p className="text-foreground font-medium">
            Visual Parts Catalogue (Tennant Creek)
          </p>
          <p className="text-muted-foreground mt-1">
            Site-specific visual catalogue for trades, planners, and stores personnel. 
            Click on any part to view and edit full details.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Parts</span>
          </div>
          <p className="text-2xl font-bold mt-1">{totalParts}</p>
        </div>
        <div className="rounded-lg bg-destructive/10 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span className="text-sm text-destructive">High Criticality</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-destructive">{highCriticalCount}</p>
        </div>
        <div className="rounded-lg bg-success/10 p-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-success" />
            <span className="text-sm text-success">With Photos</span>
          </div>
          <p className="text-2xl font-bold mt-1 text-success">{partsWithImages}</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">
          Parts Catalogue ({filteredParts.length} items)
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-56"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {PART_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCriticality} onValueChange={setFilterCriticality}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Criticality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Criticality</SelectItem>
              {CRITICALITY_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
                setFilterCriticality("all");
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
          {generalCount > 0 && (
            <Button 
              variant="outline" 
              onClick={handleReclassifyCategories} 
              disabled={isReclassifying}
              className="gap-2"
            >
              {isReclassifying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Reclassify ({generalCount})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setComparisonDialogOpen(true)}
            className="gap-2"
          >
            <GitCompare className="h-4 w-4" />
            Compare to Inventory
          </Button>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddVisualPartDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addPart}
        onAddImage={addImageToPart}
      />
      <PartsComparisonDialog
        open={comparisonDialogOpen}
        onOpenChange={setComparisonDialogOpen}
      />
      <VisualPartDetailDialog
        part={currentSelectedPart}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onUpdate={updatePart}
        onDelete={deletePart}
        onAddImage={addImageToPart}
        onRemoveImage={removeImageFromPart}
      />

      {/* Parts Grid */}
      {filteredParts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {filteredParts.map((part) => (
            <VisualPartCard
              key={part.id}
              part={part}
              onClick={() => handlePartClick(part)}
              onAddImage={addImageToPart}
            />
          ))}
        </div>
      ) : parts.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium text-foreground">No parts in catalogue yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Click "Add Part" to create your first visual catalogue entry.
          </p>
          <Button className="mt-4" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Part
          </Button>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No parts match your search criteria.
        </div>
      )}
    </div>
  );
};
