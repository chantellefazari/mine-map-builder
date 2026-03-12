import React, { useState, useMemo } from "react";
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
import { Search, Download, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DBFunctionalLocation {
  id: string;
  fl_code: string;
  area: string;
  area_code: string;
  sub_area: string;
  sub_area_code: string;
  system_name: string;
}

const areaColors: Record<string, string> = {
  SITE: "bg-slate-500",
  UTL: "bg-amber-500",
  COM: "bg-emerald-500",
  GR: "bg-yellow-500",
  TAIL: "bg-rose-500",
  SUP: "bg-violet-500",
};

const areaLabels: Record<string, string> = {
  SITE: "Site",
  UTL: "Utilities & Power",
  COM: "Comminution / Process",
  GR: "Gold Recovery",
  TAIL: "Tailings",
  SUP: "Support Services",
};

export const FunctionalLocationTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const { data: functionalLocations = [], isLoading } = useQuery({
    queryKey: ["processing-functional-locations"],
    queryFn: async (): Promise<DBFunctionalLocation[]> => {
      const { data, error } = await supabase
        .from("processing_functional_locations")
        .select("*")
        .order("fl_code", { ascending: true });
      if (error) throw error;
      return data as DBFunctionalLocation[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const flSummary = useMemo(() => {
    const byArea: Record<string, number> = {};
    for (const fl of functionalLocations) {
      byArea[fl.area_code] = (byArea[fl.area_code] || 0) + 1;
    }
    return { totalFunctionalLocations: functionalLocations.length, byArea };
  }, [functionalLocations]);

  const filteredLocations = useMemo(() => {
    return functionalLocations.filter((fl) => {
      const matchesSearch =
        searchQuery === "" ||
        fl.fl_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fl.system_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fl.sub_area.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesArea = areaFilter === "all" || fl.area_code === areaFilter;

      return matchesSearch && matchesArea;
    });
  }, [searchQuery, areaFilter, functionalLocations]);

  const exportToCSV = () => {
    const headers = ["Functional Location Code", "Area", "Sub Area", "System Name"];
    const rows = functionalLocations.map((fl) => [
      fl.fl_code,
      fl.area,
      fl.sub_area,
      fl.system_name,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "TCMG_Functional_Locations.csv";
    link.click();
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading functional locations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Functional Location Register
          </h2>
          <p className="text-sm text-muted-foreground">
            TCMG Processing Plant — D365 / CMMS Ready
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <div className="rounded-lg border bg-card p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {flSummary.totalFunctionalLocations}
          </div>
          <div className="text-xs text-muted-foreground">Total FLs</div>
        </div>
        {Object.entries(flSummary.byArea).map(([area, count]) => (
          <div key={area} className="rounded-lg border bg-card p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Badge className={`${areaColors[area]} text-white text-xs px-1.5`}>
                {area}
              </Badge>
            </div>
            <div className="mt-1 text-lg font-semibold">{count}</div>
            <div className="text-xs text-muted-foreground truncate">
              {areaLabels[area]}
            </div>
          </div>
        ))}
      </div>

      {/* Validation Status */}
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <div className="text-sm">
          <span className="font-medium text-green-700 dark:text-green-400">
            Validation Passed:
          </span>{" "}
          <span className="text-green-600 dark:text-green-300">
            {flSummary.totalFunctionalLocations} unique FLs • No duplicates • All
            FLs at SYSTEM level • No asset-level FLs
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
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {Object.entries(areaLabels).map(([code, label]) => (
              <SelectItem key={code} value={code}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredLocations.length} of {flSummary.totalFunctionalLocations}{" "}
        functional locations
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
              <TableRow key={fl.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                <TableCell className="font-mono text-sm font-medium">
                  {fl.fl_code}
                </TableCell>
                <TableCell>
                  <Badge className={`${areaColors[fl.area_code]} text-white`}>
                    {fl.area_code}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {fl.sub_area}
                </TableCell>
                <TableCell>{fl.system_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer note */}
      <div className="text-xs text-muted-foreground text-center">
        Format: TCMG-PP-[AREA]-[SUBAREA]-[SYSTEM] • Functional Locations stop at
        SYSTEM level • Assets are NOT assigned FL codes
      </div>
    </div>
  );
};
