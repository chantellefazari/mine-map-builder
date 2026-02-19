import React, { useState, useMemo } from "react";
import { cruFunctionalLocations, cruFlSummary, cruAreaColors, cruAreaLabels, CRUFunctionalLocation } from "./crushingFunctionalLocations";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CRUFunctionalLocationTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const filteredLocations = useMemo(() => {
    return cruFunctionalLocations.filter((fl) => {
      const matchesSearch =
        searchQuery === "" ||
        fl.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fl.systemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fl.subArea.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = areaFilter === "all" || fl.areaCode === areaFilter;
      return matchesSearch && matchesArea;
    });
  }, [searchQuery, areaFilter]);

  const exportToCSV = () => {
    const headers = ["Functional Location Code", "Area", "Sub Area", "System Name"];
    const rows = cruFunctionalLocations.map((fl) => [
      fl.code, fl.area, fl.subArea, fl.systemName,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TCMG_CRU_Functional_Locations.csv";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            CRU Functional Location Register
          </h2>
          <p className="text-sm text-muted-foreground">
            TCMG Crushing Plant — D365 / CMMS Ready • Format: TCMG-CRU-[AREA]-[EQUIPMENT]
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {cruFlSummary.totalFunctionalLocations}
          </div>
          <div className="text-xs text-muted-foreground">Total FLs</div>
        </div>
        {Object.entries(cruFlSummary.byArea).map(([area, count]) => (
          <div key={area} className="rounded-lg border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Badge className={`${cruAreaColors[area]} text-white text-xs px-1.5`}>
                {area}
              </Badge>
            </div>
            <div className="mt-1 text-lg font-semibold">{count}</div>
            <div className="text-xs text-muted-foreground truncate">
              {cruAreaLabels[area]}
            </div>
          </div>
        ))}
      </div>

      {/* Governance Banner */}
      <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
        <CheckCircle2 className="h-5 w-5 text-amber-600" />
        <div className="text-sm">
          <span className="font-medium text-amber-700 dark:text-amber-400">
            CRU Governed Structure:
          </span>{" "}
          <span className="text-amber-600 dark:text-amber-300">
            {cruFlSummary.totalFunctionalLocations} unique FLs • Separate from Processing Plant • All FLs at SYSTEM level
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search FL code, system, or sub-area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {Object.entries(cruAreaLabels).map(([code, label]) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLocations.length} of {cruFlSummary.totalFunctionalLocations} functional locations
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Functional Location Code</TableHead>
              <TableHead className="font-semibold">Area</TableHead>
              <TableHead className="font-semibold">Sub Area</TableHead>
              <TableHead className="font-semibold">System Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((fl, index) => (
              <TableRow key={fl.code} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                <TableCell className="font-mono text-sm font-medium">
                  {fl.code}
                </TableCell>
                <TableCell>
                  <Badge className={`${cruAreaColors[fl.areaCode]} text-white`}>
                    {fl.areaCode}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {fl.subArea}
                </TableCell>
                <TableCell>{fl.systemName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Format: TCMG-CRU-[AREA]-[EQUIPMENT] • Functional Locations stop at SYSTEM level • Assets are NOT assigned FL codes
      </div>
    </div>
  );
};
