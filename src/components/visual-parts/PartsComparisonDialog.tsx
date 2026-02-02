import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComparisonResult {
  visualPart: {
    id: string;
    site_part_number: string;
    part_name: string;
  };
  matchedSiteSpare: {
    id: string;
    part_number: string;
    description: string;
  } | null;
  matchType: "exact" | "partial" | "none";
}

interface PartsComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PartsComparisonDialog = ({
  open,
  onOpenChange,
}: PartsComparisonDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [filterType, setFilterType] = useState<"all" | "exact" | "partial" | "none">("all");
  const [stats, setStats] = useState({
    totalVisual: 0,
    totalSiteSpares: 0,
    exactMatches: 0,
    partialMatches: 0,
    noMatch: 0,
  });

  useEffect(() => {
    if (open) {
      runComparison();
    }
  }, [open]);

  const runComparison = async () => {
    setLoading(true);

    try {
      // Fetch both datasets
      const [visualRes, sparesRes] = await Promise.all([
        supabase
          .from("visual_parts_catalogue")
          .select("id, site_part_number, part_name")
          .order("site_part_number"),
        supabase
          .from("site_spares")
          .select("id, part_number, description")
          .order("part_number"),
      ]);

      const visualParts = visualRes.data || [];
      const siteSpares = sparesRes.data || [];

      // Normalize for comparison
      const normalizeStr = (s: string) =>
        (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

      // Create lookup maps for site spares
      const sparesByPartNumber = new Map<string, typeof siteSpares[0]>();
      const sparesByNormalizedDesc = new Map<string, typeof siteSpares[0]>();

      for (const spare of siteSpares) {
        if (spare.part_number) {
          sparesByPartNumber.set(normalizeStr(spare.part_number), spare);
        }
        if (spare.description) {
          sparesByNormalizedDesc.set(normalizeStr(spare.description), spare);
        }
      }

      // Compare each visual part
      const comparisonResults: ComparisonResult[] = [];
      let exactMatches = 0;
      let partialMatches = 0;
      let noMatch = 0;

      for (const vp of visualParts) {
        const normalizedPartNum = normalizeStr(vp.site_part_number);
        const normalizedName = normalizeStr(vp.part_name);

        // Try exact match on part number first
        let matched = sparesByPartNumber.get(normalizedPartNum);
        let matchType: "exact" | "partial" | "none" = "none";

        if (matched) {
          matchType = "exact";
          exactMatches++;
        } else {
          // Try matching by description/name
          matched = sparesByNormalizedDesc.get(normalizedName);
          if (matched) {
            matchType = "partial";
            partialMatches++;
          } else {
            // Try partial description match
            for (const spare of siteSpares) {
              const spareDesc = normalizeStr(spare.description);
              if (
                spareDesc.includes(normalizedName) ||
                normalizedName.includes(spareDesc)
              ) {
                matched = spare;
                matchType = "partial";
                partialMatches++;
                break;
              }
            }
          }
        }

        if (!matched) {
          noMatch++;
        }

        comparisonResults.push({
          visualPart: vp,
          matchedSiteSpare: matched || null,
          matchType,
        });
      }

      setResults(comparisonResults);
      setStats({
        totalVisual: visualParts.length,
        totalSiteSpares: siteSpares.length,
        exactMatches,
        partialMatches,
        noMatch,
      });
    } catch (error) {
      console.error("Comparison error:", error);
    } finally {
      setLoading(false);
    }
  };

  const matchedCount = stats.exactMatches + stats.partialMatches;
  const matchPercentage =
    stats.totalVisual > 0
      ? Math.round((matchedCount / stats.totalVisual) * 100)
      : 0;

  const filteredResults = results.filter((r) => {
    if (filterType === "all") return true;
    return r.matchType === filterType;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Parts Comparison: Visual Catalogue vs Site Spares</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">
              Comparing parts...
            </span>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-4 border-b">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{stats.totalVisual}</p>
                <p className="text-xs text-muted-foreground">Visual Catalogue</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold">{stats.totalSiteSpares}</p>
                <p className="text-xs text-muted-foreground">Site Spares</p>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <p className="text-2xl font-bold text-success">
                  {stats.exactMatches}
                </p>
                <p className="text-xs text-success">Exact Matches</p>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <p className="text-2xl font-bold text-warning">
                  {stats.partialMatches}
                </p>
                <p className="text-xs text-warning">Partial Matches</p>
              </div>
              <div className="text-center p-3 bg-destructive/10 rounded-lg">
                <p className="text-2xl font-bold text-destructive">
                  {stats.noMatch}
                </p>
                <p className="text-xs text-destructive">No Match</p>
              </div>
            </div>

            {/* Match Summary */}
            <div className="flex items-center gap-4 py-3">
              <div className="flex-1">
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success transition-all"
                    style={{ width: `${matchPercentage}%` }}
                  />
                </div>
              </div>
              <span className="font-semibold text-lg">{matchPercentage}%</span>
              <span className="text-muted-foreground text-sm">
                ({matchedCount}/{stats.totalVisual} matched)
              </span>
            </div>

            {/* Filter Tabs */}
            <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="text-xs">
                  All ({results.length})
                </TabsTrigger>
                <TabsTrigger value="exact" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1 text-success" />
                  Exact ({stats.exactMatches})
                </TabsTrigger>
                <TabsTrigger value="partial" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1 text-warning" />
                  Partial ({stats.partialMatches})
                </TabsTrigger>
                <TabsTrigger value="none" className="text-xs">
                  <XCircle className="h-3 w-3 mr-1 text-destructive" />
                  No Match ({stats.noMatch})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Detailed Results */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-2 pr-4">
                {filteredResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No parts in this category.
                  </div>
                ) : (
                  filteredResults.map((result) => (
                  <div
                    key={result.visualPart.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                  >
                    {result.matchType === "exact" && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                    {result.matchType === "partial" && (
                      <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
                    )}
                    {result.matchType === "none" && (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {result.visualPart.site_part_number}
                        </span>
                        <span className="font-medium truncate">
                          {result.visualPart.part_name}
                        </span>
                      </div>
                      {result.matchedSiteSpare && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          ↳ Matched: {result.matchedSiteSpare.part_number || "—"}{" "}
                          {result.matchedSiteSpare.description}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant={
                        result.matchType === "exact"
                          ? "default"
                          : result.matchType === "partial"
                          ? "secondary"
                          : "destructive"
                      }
                      className="flex-shrink-0"
                    >
                      {result.matchType === "exact" && "Exact"}
                      {result.matchType === "partial" && "Partial"}
                      {result.matchType === "none" && "No Match"}
                    </Badge>
                  </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="flex justify-end pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
