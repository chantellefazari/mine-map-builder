import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Grid3X3, List, Trash2, Package, Image as ImageIcon } from "lucide-react";
import { useSupplierCatalogue, CatalogueItem, priorityTags, componentTypes } from "@/hooks/useSupplierCatalogue";
import { useSuppliers } from "@/hooks/useSuppliers";
import { AddCatalogueItemDialog } from "./AddCatalogueItemDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SupplierCatalogueSection = () => {
  const { items, isLoading, addItem, deleteItem } = useSupplierCatalogue();
  const { suppliers } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "destructive";
      case "Medium":
        return "default";
      case "Non-critical":
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.componentDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.oemBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.oemPartNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || item.componentType === filterType;
    const matchesPriority = filterPriority === "all" || item.priorityTag === filterPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading catalogue...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Supplier Catalogue & OEM Data</span>
          <Badge variant="outline" className="ml-2">{items.length} items</Badge>
        </CardTitle>
        <CardDescription>
          What suppliers actually supply. Visual cards for quick part identification during purchasing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parts, suppliers, OEM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Component Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {componentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorityTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-r-none"
                onClick={() => setViewMode("cards")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-l-none"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <AddCatalogueItemDialog suppliers={suppliers} onAddItem={addItem} />
          </div>
        </div>

        {/* Content */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-muted/30">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            {items.length === 0 ? (
              <>
                <p className="font-medium">No catalogue items yet</p>
                <p className="text-sm">Click "Add Catalogue Item" to start building your parts database.</p>
              </>
            ) : (
              <>
                <p className="font-medium">No items match your search</p>
                <p className="text-sm">Try adjusting your filters or search term.</p>
              </>
            )}
          </div>
        ) : viewMode === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <CatalogueCard key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </div>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Photo</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>OEM / Brand</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.componentDescription}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.supplierName}</TableCell>
                    <TableCell>{item.oemBrand}</TableCell>
                    <TableCell>{item.componentType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.componentDescription}</TableCell>
                    <TableCell className="font-mono text-sm">{item.oemPartNumber}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(item.priorityTag)}>
                        {item.priorityTag}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          {items.length > 0 && (
            <span>
              Showing {filteredItems.length} of {items.length} catalogue items
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface CatalogueCardProps {
  item: CatalogueItem;
  onDelete: (id: string) => void;
}

const CatalogueCard = ({ item, onDelete }: CatalogueCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "border-l-red-500 bg-red-50/50 dark:bg-red-950/20";
      case "Medium":
        return "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20";
      case "Non-critical":
        return "border-l-slate-400 bg-slate-50/50 dark:bg-slate-950/20";
      default:
        return "border-l-border";
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden border-l-4 ${getPriorityColor(item.priorityTag)} hover:shadow-md transition-shadow`}>
      {/* Image Section */}
      {item.imageUrl ? (
        <div className="aspect-[4/3] bg-muted">
          <img 
            src={item.imageUrl} 
            alt={item.componentDescription}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">
            {item.componentType}
          </Badge>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      
      <h4 className="font-semibold text-sm mb-1 line-clamp-2">
        {item.componentDescription}
      </h4>
      
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>Supplier:</span>
          <span className="font-medium text-foreground">{item.supplierName || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>OEM/Brand:</span>
          <span className="font-medium text-foreground">{item.oemBrand || "-"}</span>
        </div>
        <div className="flex justify-between">
          <span>Part #:</span>
          <span className="font-mono font-medium text-foreground">{item.oemPartNumber || "-"}</span>
        </div>
      </div>

      {item.notes && (
        <p className="mt-2 text-xs text-muted-foreground italic line-clamp-2">
          {item.notes}
        </p>
      )}

        <div className="mt-3 pt-2 border-t">
          <Badge 
            variant={item.priorityTag === "Critical" ? "destructive" : item.priorityTag === "Medium" ? "default" : "secondary"}
            className="text-xs"
          >
            {item.priorityTag}
          </Badge>
        </div>
      </div>
    </div>
  );
};
