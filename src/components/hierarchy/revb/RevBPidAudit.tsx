import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertTriangle, XCircle, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RevBTag {
  asset_number: string;
  asset_name: string;
  pid_tags: string[] | null;
  area_code: string;
  parent_asset_label: string;
}

interface ExtractionTag {
  tag_id: string;
  tag_type: string;
  description: string;
  page_number: number;
  drawing_number: string;
}

function useAuditData() {
  return useQuery({
    queryKey: ["rev-b-pid-audit-v2"],
    queryFn: async () => {
      const [revBRes, extractionRes] = await Promise.all([
        supabase
          .from("processing_plant_assets_rev_b")
          .select("asset_number, asset_name, pid_tags, area_code, parent_asset_label")
          .not("pid_tags", "eq", "{}")
          .order("sort_order"),
        supabase
          .from("rev_b_pid_extraction_register")
          .select("tag_id, tag_type, description, page_number, drawing_number")
          .order("page_number")
          .order("sort_order"),
      ]);

      if (revBRes.error) throw revBRes.error;
      if (extractionRes.error) throw extractionRes.error;

      return {
        revB: (revBRes.data || []) as RevBTag[],
        extraction: (extractionRes.data || []) as ExtractionTag[],
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

type IssueType = "matched" | "rev_b_only" | "extraction_only";

interface AuditRow {
  pidTag: string;
  issue: IssueType;
  revBAsset?: string;
  revBName?: string;
  revBArea?: string;
  extractionDesc?: string;
  extractionType?: string;
  extractionPage?: number;
  extractionDrawing?: string;
}

/** Normalize a P&ID tag for comparison — strip leading zeros in any segment & lowercase */
function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/\b0+(\d)/g, "$1").replace(/\s+/g, "");
}

export const RevBPidAudit: React.FC = () => {
  const { data, isLoading } = useAuditData();
  const [filter, setFilter] = useState("");
  const [showOnly, setShowOnly] = useState<IssueType | "all">("all");

  const audit = useMemo(() => {
    if (!data) return [];

    // Build Rev B lookup: normalizedTag → info
    const revBByTag = new Map<string, { asset: string; name: string; area: string; rawTag: string }>();
    for (const asset of data.revB) {
      if (asset.pid_tags) {
        for (const tag of asset.pid_tags) {
          if (tag) {
            revBByTag.set(normalizeTag(tag), {
              asset: asset.asset_number,
              name: asset.asset_name,
              area: asset.area_code,
              rawTag: tag,
            });
          }
        }
      }
    }

    // Build extraction lookup
    const extractionByTag = new Map<string, ExtractionTag>();
    for (const t of data.extraction) {
      extractionByTag.set(normalizeTag(t.tag_id), t);
    }

    // Collect all unique normalized tags
    const allNormalized = new Set<string>();
    revBByTag.forEach((_, k) => allNormalized.add(k));
    extractionByTag.forEach((_, k) => allNormalized.add(k));

    const rows: AuditRow[] = [];

    for (const normTag of allNormalized) {
      const inRevB = revBByTag.get(normTag);
      const inExtraction = extractionByTag.get(normTag);

      const displayTag = inRevB?.rawTag || inExtraction?.tag_id || normTag;

      let issue: IssueType;
      if (inRevB && inExtraction) {
        issue = "matched";
      } else if (inRevB && !inExtraction) {
        issue = "rev_b_only";
      } else {
        issue = "extraction_only";
      }

      rows.push({
        pidTag: displayTag,
        issue,
        revBAsset: inRevB?.asset,
        revBName: inRevB?.name,
        revBArea: inRevB?.area,
        extractionDesc: inExtraction?.description,
        extractionType: inExtraction?.tag_type,
        extractionPage: inExtraction?.page_number,
        extractionDrawing: inExtraction?.drawing_number,
      });
    }

    // Sort: issues first, then matched
    const issueOrder: Record<IssueType, number> = {
      extraction_only: 0,
      rev_b_only: 1,
      matched: 2,
    };
    rows.sort((a, b) => issueOrder[a.issue] - issueOrder[b.issue] || a.pidTag.localeCompare(b.pidTag));

    return rows;
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Running P&ID audit…</span>
      </div>
    );
  }

  const issues = audit.filter(r => r.issue !== "matched");
  const matched = audit.filter(r => r.issue === "matched");

  const filtered = audit.filter(r => {
    if (showOnly !== "all" && r.issue !== showOnly) return false;
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      r.pidTag.toLowerCase().includes(q) ||
      r.revBAsset?.toLowerCase().includes(q) ||
      r.revBName?.toLowerCase().includes(q) ||
      r.extractionDesc?.toLowerCase().includes(q) ||
      r.extractionDrawing?.toLowerCase().includes(q)
    );
  });

  const issueCountByType = {
    rev_b_only: audit.filter(r => r.issue === "rev_b_only").length,
    extraction_only: audit.filter(r => r.issue === "extraction_only").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className={`rounded-lg p-4 border ${issues.length === 0
        ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
        : "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
      }`}>
        <div className="flex items-center gap-3">
          {issues.length === 0
            ? <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
            : <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          }
          <div>
            <p className="text-sm font-bold text-foreground">
              P&ID Source Audit: {matched.length} matched, {issues.length} issue{issues.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cross-references Rev B asset tags against the 14-page P&ID Extraction Register (source of truth) to flag missing or unmapped tags.
            </p>
          </div>
        </div>
      </div>

      {/* Issue type chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={showOnly === "all" ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => setShowOnly("all")}
        >
          All ({audit.length})
        </Button>
        <Button
          variant={showOnly === "matched" ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => setShowOnly("matched")}
        >
          <CheckCircle2 className="h-3 w-3 mr-1" /> Matched ({matched.length})
        </Button>
        {issueCountByType.rev_b_only > 0 && (
          <Button
            variant={showOnly === "rev_b_only" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowOnly("rev_b_only")}
          >
            <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" /> Rev B Only ({issueCountByType.rev_b_only})
          </Button>
        )}
        {issueCountByType.extraction_only > 0 && (
          <Button
            variant={showOnly === "extraction_only" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowOnly("extraction_only")}
          >
            <XCircle className="h-3 w-3 mr-1 text-red-500" /> Extraction Only ({issueCountByType.extraction_only})
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter by tag, asset, description, or drawing..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="pl-10 pr-10 h-9 text-sm"
        />
        {filter && (
          <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0" onClick={() => setFilter("")}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Results table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-xs">
            <thead className="bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="text-left px-3 py-2 font-semibold">Status</th>
                <th className="text-left px-3 py-2 font-semibold">P&ID Tag</th>
                <th className="text-left px-3 py-2 font-semibold">Rev B Asset</th>
                <th className="text-left px-3 py-2 font-semibold">Extraction (Source PDF)</th>
                <th className="text-left px-3 py-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 500).map((row, i) => (
                <tr key={`${row.pidTag}-${i}`} className={`border-t border-border ${
                  row.issue === "matched" ? "" :
                  row.issue === "rev_b_only" ? "bg-amber-50/50 dark:bg-amber-950/20" :
                  "bg-red-50/50 dark:bg-red-950/20"
                }`}>
                  <td className="px-3 py-1.5">
                    {row.issue === "matched" && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                    {row.issue === "rev_b_only" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                    {row.issue === "extraction_only" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                  </td>
                  <td className="px-3 py-1.5 font-mono font-medium text-primary whitespace-nowrap">
                    {row.pidTag}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.revBAsset ? (
                      <div>
                        <span className="font-mono font-medium">{row.revBAsset}</span>
                        <span className="text-muted-foreground ml-1">— {row.revBName}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.extractionDesc ? (
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] px-1 py-0">{row.extractionType}</Badge>
                        <span className="truncate max-w-[180px]" title={row.extractionDesc}>{row.extractionDesc}</span>
                        <span className="text-muted-foreground whitespace-nowrap">p{row.extractionPage}</span>
                        {row.extractionDrawing && (
                          <span className="text-muted-foreground text-[10px]">({row.extractionDrawing})</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-muted-foreground">
                    {row.issue === "rev_b_only" && "In Rev B tree but not found in source PDF extraction"}
                    {row.issue === "extraction_only" && "Extracted from source PDF but not yet mapped in Rev B tree"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-6 text-center text-muted-foreground">
                    No results match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 500 && (
          <div className="px-3 py-2 text-xs text-muted-foreground bg-muted/30 border-t border-border">
            Showing first 500 of {filtered.length} results. Use the filter to narrow down.
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="border border-border rounded-lg p-3">
        <h4 className="text-xs font-bold text-foreground mb-2">Legend</h4>
        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            <span><strong>Matched</strong> — Tag in both Rev B tree and source PDF</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span><strong>Rev B Only</strong> — In tree but not in source PDF (typo or manual add?)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            <span><strong>Extraction Only</strong> — In source PDF but not mapped to Rev B tree</span>
          </div>
        </div>
      </div>
    </div>
  );
};
