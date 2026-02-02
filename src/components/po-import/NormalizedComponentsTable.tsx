import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Package,
  AlertTriangle,
  Copy,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Layers,
  Trash2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { NormalizedComponent, componentTypes } from "@/hooks/usePOImport";
import { extractCorePart, extractCoreIdentifiers } from "@/utils/corePartExtractor";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NormalizedComponentsTableProps {
  components: NormalizedComponent[];
  onUpdateComponent: (id: string, updates: Partial<NormalizedComponent>) => Promise<boolean>;
  onRefetch: () => void;
}

type SortField = "lastOrderedDate" | "totalSpend" | "totalOrdersInPeriod" | "descriptionCleaned";
type FilterType = "all" | "duplicates" | "missingPartNumber" | "orderedOnce" | "groupSimilar";

export const NormalizedComponentsTable = ({
  components,
  onUpdateComponent,
  onRefetch,
}: NormalizedComponentsTableProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("lastOrderedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Get unique suppliers for the filter dropdown
  const uniqueSuppliers = [...new Set(components.map((c) => c.supplier).filter(Boolean))].sort();

  // Generate similarity groups for the "Group Similar" filter
  const similarityGroups = useMemo(() => {
    const groups = new Map<string, NormalizedComponent[]>();
    
    components.forEach((c) => {
      // Extract core part from description
      const corePart = extractCorePart(c.descriptionCleaned);
      const identifiers = extractCoreIdentifiers(c.descriptionCleaned);
      
      // Create a group key from the first few identifiers or core part
      let groupKey = identifiers.slice(0, 2).join("|").toUpperCase();
      if (!groupKey && corePart) {
        // Use first 40 chars of core part as fallback
        groupKey = corePart.substring(0, 40).toUpperCase();
      }
      if (!groupKey) {
        groupKey = `UNGROUPED_${c.id}`;
      }
      
      if (!groups.has(groupKey)) {
        groups.set(groupKey, []);
      }
      groups.get(groupKey)!.push(c);
    });
    
    return groups;
  }, [components]);

  // Get groups with more than one item (potential duplicates)
  const duplicateGroups = useMemo(() => {
    const result = new Map<string, NormalizedComponent[]>();
    similarityGroups.forEach((items, key) => {
      if (items.length > 1) {
        result.set(key, items);
      }
    });
    return result;
  }, [similarityGroups]);

  // Create a lookup for component -> group key
  const componentGroupKey = useMemo(() => {
    const lookup = new Map<string, string>();
    similarityGroups.forEach((items, key) => {
      items.forEach(item => lookup.set(item.id, key));
    });
    return lookup;
  }, [similarityGroups]);

  // Color palette for groups (cycling through)
  const groupColors = [
    "bg-amber-50 border-l-4 border-l-amber-400",
    "bg-blue-50 border-l-4 border-l-blue-400",
    "bg-green-50 border-l-4 border-l-green-400",
    "bg-purple-50 border-l-4 border-l-purple-400",
    "bg-pink-50 border-l-4 border-l-pink-400",
    "bg-cyan-50 border-l-4 border-l-cyan-400",
    "bg-orange-50 border-l-4 border-l-orange-400",
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Apply supplier filter first
  let filteredComponents = components.filter((c) => {
    if (selectedSupplier !== "all" && c.supplier !== selectedSupplier) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.descriptionCleaned.toLowerCase().includes(query) ||
        c.partNumber.toLowerCase().includes(query) ||
        c.supplier.toLowerCase().includes(query)
      );
    }
    return true;
  });

  switch (filterType) {
    case "duplicates":
      const dupKeys = new Set<string>();
      const seenKeys = new Set<string>();
      components.forEach((c) => {
        if (c.duplicateKey && seenKeys.has(c.duplicateKey)) {
          dupKeys.add(c.duplicateKey);
        }
        seenKeys.add(c.duplicateKey);
      });
      filteredComponents = filteredComponents.filter((c) => dupKeys.has(c.duplicateKey));
      break;
    case "missingPartNumber":
      filteredComponents = filteredComponents.filter((c) => !c.partNumber);
      break;
    case "orderedOnce":
      filteredComponents = filteredComponents.filter((c) => c.totalOrdersInPeriod === 1);
      break;
    case "groupSimilar":
      // Only show components that belong to groups with 2+ items
      const duplicateGroupIds = new Set<string>();
      duplicateGroups.forEach((items) => {
        items.forEach(item => duplicateGroupIds.add(item.id));
      });
      filteredComponents = filteredComponents.filter((c) => duplicateGroupIds.has(c.id));
      break;
  }

  // Apply sorting
  filteredComponents = [...filteredComponents].sort((a, b) => {
    // When grouping similar, sort by group key first to keep similar items together
    if (filterType === "groupSimilar") {
      const keyA = componentGroupKey.get(a.id) || "";
      const keyB = componentGroupKey.get(b.id) || "";
      if (keyA !== keyB) {
        return keyA.localeCompare(keyB);
      }
    }
    
    let comparison = 0;
    switch (sortField) {
      case "lastOrderedDate":
        const dateA = a.lastOrderedDate ? new Date(a.lastOrderedDate).getTime() : 0;
        const dateB = b.lastOrderedDate ? new Date(b.lastOrderedDate).getTime() : 0;
        comparison = dateA - dateB;
        break;
      case "totalSpend":
        comparison = a.totalSpend - b.totalSpend;
        break;
      case "totalOrdersInPeriod":
        comparison = a.totalOrdersInPeriod - b.totalOrdersInPeriod;
        break;
      case "descriptionCleaned":
        comparison = a.descriptionCleaned.localeCompare(b.descriptionCleaned);
        break;
    }
    return sortDirection === "desc" ? -comparison : comparison;
  });

  // Assign group colors for visual distinction
  const groupColorAssignments = useMemo(() => {
    const assignments = new Map<string, string>();
    let colorIndex = 0;
    
    duplicateGroups.forEach((_, key) => {
      assignments.set(key, groupColors[colorIndex % groupColors.length]);
      colorIndex++;
    });
    
    return assignments;
  }, [duplicateGroups]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredComponents.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredComponents.map((c) => c.id)));
    }
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("normalized_components")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;

      toast({
        title: "Deleted",
        description: `${selectedIds.size} duplicate(s) removed`,
      });
      
      setSelectedIds(new Set());
      onRefetch();
    } catch (error) {
      console.error("Error deleting components:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected components",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "desc" ? (
      <ChevronDown className="h-3 w-3 inline ml-1" />
    ) : (
      <ChevronUp className="h-3 w-3 inline ml-1" />
    );
  };

  const exportToCatalogueFormat = () => {
    const data = filteredComponents.map((c) => ({
      "Component Type": c.componentType,
      "Part Number": c.partNumber,
      Description: c.descriptionCleaned,
      Supplier: c.supplier,
      Notes: c.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Components");
    XLSX.writeFile(wb, "component_catalogue_export.xlsx");
  };

  const exportForSupplierEnrichment = () => {
    const data = filteredComponents.map((c) => ({
      Description: c.descriptionCleaned,
      "OEM Part Number": "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    
    // Set column widths for readability
    ws["!cols"] = [
      { wch: 60 }, // Description
      { wch: 25 }, // OEM Part Number
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Parts for Review");
    
    // Include supplier name in filename if filtered
    const supplierSuffix = selectedSupplier !== "all" ? `_${selectedSupplier.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
    XLSX.writeFile(wb, `supplier_enrichment${supplierSuffix}.xlsx`);
  };

  const copyToClipboard = () => {
    const text = filteredComponents
      .map(
        (c) =>
          `${c.componentType}\t${c.partNumber}\t${c.descriptionCleaned}\t${c.supplier}`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Normalised Components
            <Badge variant="secondary" className="ml-2">
              {filteredComponents.length} items
            </Badge>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            {selectedIds.size > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={deleteSelected}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected ({selectedIds.size})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCatalogueFormat}>
              <Download className="h-4 w-4 mr-1" />
              Export Excel
            </Button>
            <Button variant="default" size="sm" onClick={exportForSupplierEnrichment}>
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              Supplier Enrichment
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {uniqueSuppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier || ""}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
            <SelectTrigger className="w-full md:w-[220px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="groupSimilar">
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Group Similar ({duplicateGroups.size} groups)
                </span>
              </SelectItem>
              <SelectItem value="duplicates">Duplicates Found</SelectItem>
              <SelectItem value="missingPartNumber">Missing Part Number</SelectItem>
              <SelectItem value="orderedOnce">Ordered Once Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {filteredComponents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No components to display. Process PO uploads to populate this table.
          </div>
        ) : (
          <ScrollArea className="h-[500px] w-full">
            <div className="min-w-[1200px]">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={selectedIds.size === filteredComponents.length && filteredComponents.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead
                    className="min-w-[300px] cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSort("descriptionCleaned")}
                  >
                    Description <SortIcon field="descriptionCleaned" />
                  </TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSort("lastOrderedDate")}
                  >
                    Last Ordered <SortIcon field="lastOrderedDate" />
                  </TableHead>
                  <TableHead className="text-right">Last PO</TableHead>
                  <TableHead>Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComponents.map((component) => {
                  const groupKey = componentGroupKey.get(component.id);
                  const groupColor = filterType === "groupSimilar" && groupKey 
                    ? groupColorAssignments.get(groupKey) 
                    : "";
                  
                  return (
                    <TableRow key={component.id} className={groupColor}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(component.id)}
                          onCheckedChange={() => toggleSelection(component.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          value={component.componentType}
                          onValueChange={(v) =>
                            onUpdateComponent(component.id, { componentType: v })
                          }
                        >
                          <SelectTrigger className="h-8 w-[100px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {componentTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    <TableCell className="font-mono text-xs">
                      {component.partNumber || (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Missing
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {component.descriptionCleaned}
                      {component.aliasDescriptions && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              +aliases
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-[300px]">
                            <p className="text-xs whitespace-pre-wrap">
                              {component.aliasDescriptions}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{component.supplier}</TableCell>
                    <TableCell className="text-xs">
                      {formatDate(component.lastOrderedDate)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-right">
                      {component.lastOrderedPo || "-"}
                    </TableCell>
                    <TableCell>
                      {component.reviewFlag && (
                        <Tooltip>
                          <TooltipTrigger>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Needs review - missing data</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
              </Table>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
