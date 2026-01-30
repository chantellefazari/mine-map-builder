import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
} from "lucide-react";
import { NormalizedComponent, componentTypes } from "@/hooks/usePOImport";

interface NormalizedComponentsTableProps {
  components: NormalizedComponent[];
  onUpdateComponent: (id: string, updates: Partial<NormalizedComponent>) => Promise<boolean>;
}

type SortField = "lastOrderedDate" | "totalSpend" | "totalOrdersInPeriod" | "descriptionCleaned";
type FilterType = "all" | "duplicates" | "missingPartNumber" | "missingManufacturer" | "orderedOnce";

export const NormalizedComponentsTable = ({
  components,
  onUpdateComponent,
}: NormalizedComponentsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("lastOrderedDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  // Apply filters
  let filteredComponents = components.filter((c) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.descriptionCleaned.toLowerCase().includes(query) ||
        c.partNumber.toLowerCase().includes(query) ||
        c.manufacturer.toLowerCase().includes(query) ||
        c.model.toLowerCase().includes(query) ||
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
    case "missingManufacturer":
      filteredComponents = filteredComponents.filter((c) => !c.manufacturer || !c.model);
      break;
    case "orderedOnce":
      filteredComponents = filteredComponents.filter((c) => c.totalOrdersInPeriod === 1);
      break;
  }

  // Apply sorting
  filteredComponents = [...filteredComponents].sort((a, b) => {
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
    const csvData = filteredComponents.map((c) => ({
      "Component Type": c.componentType,
      Manufacturer: c.manufacturer,
      Model: c.model,
      "Part Number": c.partNumber,
      Description: c.descriptionCleaned,
      Supplier: c.supplier,
      Notes: c.notes,
    }));

    const headers = Object.keys(csvData[0] || {}).join(",");
    const rows = csvData.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "component_catalogue_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCriticalSparesFormat = () => {
    const csvData = filteredComponents.map((c) => ({
      Description: c.descriptionCleaned,
      Category: c.componentType,
      Manufacturer: c.manufacturer,
      "OEM Part Number": c.partNumber,
      "Preferred Supplier": c.supplier,
      "Last Unit Price": c.lastUnitPrice,
      "Last Ordered Date": c.lastOrderedDate || "",
      Notes: c.notes,
    }));

    const headers = Object.keys(csvData[0] || {}).join(",");
    const rows = csvData.map((row) =>
      Object.values(row)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [headers, ...rows].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "critical_spares_draft_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const text = filteredComponents
      .map(
        (c) =>
          `${c.componentType}\t${c.manufacturer}\t${c.model}\t${c.partNumber}\t${c.descriptionCleaned}\t${c.supplier}`
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
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCatalogueFormat}>
              <Download className="h-4 w-4 mr-1" />
              Catalogue CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCriticalSparesFormat}>
              <Download className="h-4 w-4 mr-1" />
              Spares CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
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
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="duplicates">Duplicates Found</SelectItem>
              <SelectItem value="missingPartNumber">Missing Part Number</SelectItem>
              <SelectItem value="missingManufacturer">Missing Manufacturer</SelectItem>
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
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead
                    className="min-w-[250px] cursor-pointer hover:bg-muted/50"
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
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Flags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComponents.map((component) => (
                  <TableRow key={component.id}>
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
                    <TableCell className="text-sm">
                      {component.manufacturer || (
                        <span className="text-muted-foreground italic">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {component.model || (
                        <span className="text-muted-foreground italic">-</span>
                      )}
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
                    <TableCell className="text-xs text-right">
                      {formatCurrency(component.lastUnitPrice)}
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
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
