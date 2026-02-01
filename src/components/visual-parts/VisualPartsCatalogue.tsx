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
import { Plus, Search, Loader2, ImageIcon, AlertTriangle } from "lucide-react";
import { useVisualPartsCatalogue } from "@/hooks/useVisualPartsCatalogue";
import { VisualPartCard } from "./VisualPartCard";
import { AddVisualPartDialog } from "./AddVisualPartDialog";
import { PART_CATEGORIES, CRITICALITY_LEVELS } from "./visualPartsConstants";

export const VisualPartsCatalogue = () => {
  const {
    parts,
    loading,
    addPart,
    updatePart,
    deletePart,
    addImageToPart,
    removeImageFromPart,
  } = useVisualPartsCatalogue();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterCriticality, setFilterCriticality] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const filteredParts = parts.filter((part) => {
    const matchesSearch =
      part.part_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.site_part_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.associated_asset.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || part.category === filterCategory;
    const matchesCriticality = filterCriticality === "all" || part.criticality === filterCriticality;
    return matchesSearch && matchesCategory && matchesCriticality;
  });

  // Stats
  const totalParts = parts.length;
  const highCriticalCount = parts.filter((p) => p.criticality === "High").length;
  const partsWithImages = parts.filter((p) => p.image_urls.length > 0).length;

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
            Photos help identify parts visually — this is not a supplier catalogue.
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
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Add Dialog */}
      <AddVisualPartDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addPart}
      />

      {/* Parts Grid */}
      {filteredParts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParts.map((part) => (
            <VisualPartCard
              key={part.id}
              part={part}
              onUpdate={updatePart}
              onDelete={deletePart}
              onAddImage={addImageToPart}
              onRemoveImage={removeImageFromPart}
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
