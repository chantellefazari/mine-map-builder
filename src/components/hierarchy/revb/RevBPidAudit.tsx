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

interface RevATag {
  pid_tag: string;
  asset_number: string;
  description: string;
}

interface ExtractionTag {
  tag_id: string;
  tag_type: string;
  description: string;
  page_number: number;
}

function useAuditData() {
  return useQuery({
    queryKey: ["rev-b-pid-audit"],
    queryFn: async () => {
      const [revBRes, revARes, extractionRes] = await Promise.all([
        supabase
          .from("processing_plant_assets_rev_b")
          .select("asset_number, asset_name, pid_tags, area_code, parent_asset_label")
          .not("pid_tags", "eq", "{}")
          .order("sort_order"),
        supabase
          .from("processing_pid_tags")
          .select("pid_tag, asset_number, description"),
        supabase
          .from("rev_b_pid_extraction_register")
          .select("tag_id, tag_type, description, page_number")
          .order("page_number")
          .order("sort_order"),
      ]);

      if (revBRes.error) throw revBRes.error;
      if (revARes.error) throw revARes.error;
      if (extractionRes.error) throw extractionRes.error;

      return {
        revB: (revBRes.data || []) as RevBTag[],
        revA: (revARes.data || []) as RevATag[],
        extraction: (extractionRes.data || []) as ExtractionTag[],
      };
    },
    staleTime: 2 * 60 * 1000,
  });
}

type IssueType = "mismatch" | "rev_b_only" | "rev_a_only" | "extraction_only" | "matched";

interface AuditRow {
  pidTag: string;
  issue: IssueType;
  revBAsset?: string;
  revBName?: string;
  revBArea?: string;
  revAAsset?: string;
  revADesc?: string;
  extractionDesc?: string;
  extractionType?: string;
  extractionPage?: number;
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

    // Build Rev B lookup: normalizedTag → RevBTag info
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

    // Build Rev A lookup: normalizedTag → RevATag
    const revAByTag = new Map<string, RevATag>();
    for (const t of data.revA) {
      revAByTag.set(normalizeTag(t.pid_tag), t);
    }

    // Build extraction lookup
    const extractionByTag = new Map<string, ExtractionTag>();
    for (const t of data.extraction) {
      extractionByTag.set(normalizeTag(t.tag_id), t);
    }

    // Collect all unique normalized tags
    const allNormalized = new Set<string>();
    revBByTag.forEach((_, k) => allNormalized.add(k));
    revAByTag.forEach((_, k) => allNormalized.add(k));
    extractionByTag.forEach((_, k) => allNormalized.add(k));

    const rows: AuditRow[] = [];

    for (const normTag of allNormalized) {
      const inRevB = revBByTag.get(normTag);
      const inRevA = revAByTag.get(normTag);
      const inExtraction = extractionByTag.get(normTag);

      const displayTag = inRevB?.rawTag || inRevA?.pid_tag || inExtraction?.tag_id || normTag;

      let issue: IssueType;

      if (inRevB && inRevA) {
        issue = "matched";
      } else if (inRevB && !inRevA) {
        // In Rev B but not Rev A — could be new from extraction or an error
        if (inExtraction) {
          issue = "matched"; // It's from extraction, which is fine
        } else {
          issue = "rev_b_only";
        }
      } else if (!inRevB && inRevA) {
        issue = "rev_a_only";
      } else if (inExtraction && !inRevB) {
        issue = "extraction_only";
      } else {
        issue = "matched";
      }

      rows.push({
        pidTag: displayTag,
        issue,
        revBAsset: inRevB?.asset,
        revBName: inRevB?.name,
        revBArea: inRevB?.area,
        revAAsset: inRevA?.asset_number,
        revADesc: inRevA?.description,
        extractionDesc: inExtraction?.description,
        extractionType: inExtraction?.tag_type,
        extractionPage: inExtraction?.page_number,
      });
    }

    // Sort: issues first, then matched
    const issueOrder: Record<IssueType, number> = {
      mismatch: 0,
      rev_a_only: 1,
      rev_b_only: 2,
      extraction_only: 3,
      matched: 4,
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
      r.revAAsset?.toLowerCase().includes(q) ||
      r.revADesc?.toLowerCase().includes(q) ||
      r.extractionDesc?.toLowerCase().includes(q)
    );
  });

  const issueCountByType = {
    rev_a_only: audit.filter(r => r.issue === "rev_a_only").length,
    rev_b_only: audit.filter(r => r.issue === "rev_b_only").length,
    extraction_only: audit.filter(r => r.issue === "extraction_only").length,
    mismatch: audit.filter(r => r.issue === "mismatch").length,
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
              P&ID Cross-Reference Audit: {matched.length} matched, {issues.length} issue{issues.length !== 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Compares Rev B asset tags against Rev A (processing_pid_tags) and the Extraction Register to flag discrepancies.
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
        {issueCountByType.rev_a_only > 0 && (
          <Button
            variant={showOnly === "rev_a_only" ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowOnly("rev_a_only")}
          >
            <XCircle className="h-3 w-3 mr-1 text-red-500" /> Rev A Only ({issueCountByType.rev_a_only})
          </Button>
        )}
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
            <AlertTriangle className="h-3 w-3 mr-1 text-purple-500" /> Extraction Only ({issueCountByType.extraction_only})
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Filter by tag, asset, or description..."
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
                <th className="text-left px-3 py-2 font-semibold">Rev A Asset</th>
                <th className="text-left px-3 py-2 font-semibold">Extraction</th>
                <th className="text-left px-3 py-2 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 500).map((row, i) => (
                <tr key={`${row.pidTag}-${i}`} className={`border-t border-border ${
                  row.issue === "matched" ? "" :
                  row.issue === "rev_a_only" ? "bg-red-50/50 dark:bg-red-950/20" :
                  row.issue === "rev_b_only" ? "bg-amber-50/50 dark:bg-amber-950/20" :
                  row.issue === "extraction_only" ? "bg-purple-50/50 dark:bg-purple-950/20" :
                  "bg-orange-50/50 dark:bg-orange-950/20"
                }`}>
                  <td className="px-3 py-1.5">
                    {row.issue === "matched" && <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />}
                    {row.issue === "rev_a_only" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                    {row.issue === "rev_b_only" && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                    {row.issue === "extraction_only" && <AlertTriangle className="h-3.5 w-3.5 text-purple-500" />}
                    {row.issue === "mismatch" && <XCircle className="h-3.5 w-3.5 text-orange-500" />}
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
                    {row.revAAsset ? (
                      <div>
                        <span className="font-mono font-medium">{row.revAAsset}</span>
                        <span className="text-muted-foreground ml-1">— {row.revADesc}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5">
                    {row.extractionDesc ? (
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[9px] px-1 py-0">{row.extractionType}</Badge>
                        <span className="text-muted-foreground">p{row.extractionPage}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">—</span>
                    )}
                  </td>
                  <td className="px-3 py-1.5 text-muted-foreground">
                    {row.issue === "rev_a_only" && "In Rev A but missing from Rev B — check if tag was renamed or removed"}
                    {row.issue === "rev_b_only" && "In Rev B but not in Rev A — verify against source PDF"}
                    {row.issue === "extraction_only" && "Extracted from PDF but not in Rev B tree — needs mapping"}
                    {row.issue === "mismatch" && "Tag exists in both but maps to different assets"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">
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
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            <span><strong>Matched</strong> — Tag confirmed in both Rev A/Extraction and Rev B</span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="h-3.5 w-3.5 text-red-500" />
            <span><strong>Rev A Only</strong> — Tag in Rev A but missing from Rev B (removed or renamed?)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span><strong>Rev B Only</strong> — Tag in Rev B but not in Rev A (new tag or typo?)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-purple-500" />
            <span><strong>Extraction Only</strong> — Extracted from PDF but not yet in Rev B tree</span>
          </div>
        </div>
      </div>
    </div>
  );
};
