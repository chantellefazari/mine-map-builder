import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Check, ArrowRight, AlertTriangle, Info } from "lucide-react";

interface RevAAsset {
  id: string;
  asset_number: string;
  asset_name: string;
  components: any;
  pid_tags: string[];
  area_code: string;
  parent_asset_label: string;
  sub_area: string;
}

interface RevBAsset {
  id: string;
  asset_number: string;
  asset_name: string;
  components: any;
  pid_tags: string[];
  area_code: string;
  parent_asset_label: string;
  sub_area: string;
}

interface PidTagMapping {
  pid_tag: string;
  asset_number: string;
}

export interface TransferMatch {
  revAAssetNumber: string;
  revAAssetName: string;
  revAComponents: any[];
  revAAreaCode: string;
  revAParentAsset: string;
  revBId: string;
  revBAssetNumber: string;
  revBAssetName: string;
  revBAreaCode: string;
  revBParentAsset: string;
  matchedVia: "pid_tag" | "asset_number";
  matchedTag?: string;
  skipped: boolean;
  skipReason?: string;
}

interface ComponentTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComponentTransferDialog: React.FC<ComponentTransferDialogProps> = ({ open, onOpenChange }) => {
  const [loading, setLoading] = useState(false);
  const [committing, setCommitting] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [matches, setMatches] = useState<TransferMatch[]>([]);

  useEffect(() => {
    if (open) {
      setCommitted(false);
      runMatching();
    }
  }, [open]);

  const runMatching = async () => {
    setLoading(true);
    try {
      // Fetch Rev A assets with components
      const { data: revAData, error: revAError } = await supabase
        .from("processing_plant_assets")
        .select("id, asset_number, asset_name, components, pid_tags, area_code, parent_asset_label, sub_area")
        .order("area_code")
        .order("sort_order");

      if (revAError) throw revAError;

      // Fetch Rev B assets
      const { data: revBData, error: revBError } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("id, asset_number, asset_name, components, pid_tags, area_code, parent_asset_label, sub_area")
        .order("area_code")
        .order("sort_order");

      if (revBError) throw revBError;

      // Fetch P&ID tag mappings for Rev A
      const { data: pidMappings, error: pidError } = await supabase
        .from("processing_pid_tags")
        .select("pid_tag, asset_number");

      if (pidError) throw pidError;

      // Build matching
      const results = buildMatches(revAData || [], revBData || [], pidMappings || []);
      setMatches(results);
    } catch (e: any) {
      toast({ title: "Error loading data", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const buildMatches = (revA: RevAAsset[], revB: RevBAsset[], pidMappings: PidTagMapping[]): TransferMatch[] => {
    const results: TransferMatch[] = [];

    // Filter Rev A to only those with non-empty components
    const revAWithComponents = revA.filter(a => {
      const comps = parseComponents(a.components);
      return comps.length > 0;
    });

    // Build Rev B lookup by P&ID tag (normalized)
    const revBByPidTag = new Map<string, RevBAsset>();
    revB.forEach(b => {
      const tags = b.pid_tags || [];
      tags.forEach(tag => {
        revBByPidTag.set(normalizeTag(tag), b);
      });
    });

    // Build Rev B lookup by asset number (normalized)
    const revBByAssetNumber = new Map<string, RevBAsset>();
    revB.forEach(b => {
      revBByAssetNumber.set(b.asset_number.toLowerCase(), b);
    });

    // Build Rev A P&ID tag lookup from the mapping table
    const revAPidByAsset = new Map<string, string[]>();
    pidMappings.forEach(m => {
      const existing = revAPidByAsset.get(m.asset_number) || [];
      existing.push(m.pid_tag);
      revAPidByAsset.set(m.asset_number, existing);
    });

    // Track which Rev B assets we've already matched to avoid duplicates
    const matchedRevBIds = new Set<string>();

    for (const a of revAWithComponents) {
      const comps = parseComponents(a.components);
      if (comps.length === 0) continue;

      // Get all P&ID tags for this Rev A asset (from inline + mapping table)
      const inlineTags = a.pid_tags || [];
      const mappedTags = revAPidByAsset.get(a.asset_number) || [];
      const allTags = [...new Set([...inlineTags, ...mappedTags])];

      let matchedRevB: RevBAsset | null = null;
      let matchedVia: "pid_tag" | "asset_number" = "pid_tag";
      let matchedTag = "";

      // Try P&ID tag match first
      for (const tag of allTags) {
        const normalized = normalizeTag(tag);
        const found = revBByPidTag.get(normalized);
        if (found && !matchedRevBIds.has(found.id)) {
          matchedRevB = found;
          matchedVia = "pid_tag";
          matchedTag = tag;
          break;
        }
      }

      // Fallback to asset number match
      if (!matchedRevB) {
        const found = revBByAssetNumber.get(a.asset_number.toLowerCase());
        if (found && !matchedRevBIds.has(found.id)) {
          matchedRevB = found;
          matchedVia = "asset_number";
        }
      }

      if (!matchedRevB) continue; // No match found, skip entirely

      // Check if Rev B already has components (skip if so)
      const existingComps = parseComponents(matchedRevB.components);
      const skipped = existingComps.length > 0;

      matchedRevBIds.add(matchedRevB.id);

      results.push({
        revAAssetNumber: a.asset_number,
        revAAssetName: a.asset_name,
        revAComponents: comps,
        revAAreaCode: a.area_code,
        revAParentAsset: a.parent_asset_label,
        revBId: matchedRevB.id,
        revBAssetNumber: matchedRevB.asset_number,
        revBAssetName: matchedRevB.asset_name,
        revBAreaCode: matchedRevB.area_code,
        revBParentAsset: matchedRevB.parent_asset_label,
        matchedVia,
        matchedTag,
        skipped,
        skipReason: skipped ? "Rev B already has component specs" : undefined,
      });
    }

    // Sort: transferable first, then skipped
    results.sort((a, b) => {
      if (a.skipped !== b.skipped) return a.skipped ? 1 : -1;
      return a.revBAreaCode.localeCompare(b.revBAreaCode) || a.revBAssetNumber.localeCompare(b.revBAssetNumber);
    });

    return results;
  };

  const parseComponents = (comps: any): any[] => {
    if (!comps) return [];
    if (Array.isArray(comps)) return comps.filter(c => c && typeof c === "object" && Object.keys(c).length > 0);
    if (typeof comps === "string") {
      try {
        const parsed = JSON.parse(comps);
        return Array.isArray(parsed) ? parsed.filter((c: any) => c && typeof c === "object" && Object.keys(c).length > 0) : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const normalizeTag = (tag: string) => tag.toLowerCase().replace(/^0+(?=\d)/, "").trim();

  const transferable = useMemo(() => matches.filter(m => !m.skipped), [matches]);
  const skipped = useMemo(() => matches.filter(m => m.skipped), [matches]);

  const handleCommit = async () => {
    if (transferable.length === 0) return;
    setCommitting(true);
    try {
      let successCount = 0;
      let errorCount = 0;

      for (const match of transferable) {
        const { error } = await supabase
          .from("processing_plant_assets_rev_b")
          .update({ components: match.revAComponents, updated_at: new Date().toISOString() })
          .eq("id", match.revBId);

        if (error) {
          console.error(`Failed to update ${match.revBAssetNumber}:`, error);
          errorCount++;
        } else {
          successCount++;
        }
      }

      if (errorCount > 0) {
        toast({
          title: "Transfer partially complete",
          description: `${successCount} updated, ${errorCount} failed.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Component specs transferred ✅",
          description: `${successCount} Rev B assets updated with component specifications.`,
        });
        setCommitted(true);
      }
    } catch (e: any) {
      toast({ title: "Commit failed", description: e.message, variant: "destructive" });
    } finally {
      setCommitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Transfer Component Specs: Rev A → Rev B
          </DialogTitle>
          <DialogDescription>
            Matches Rev A component specifications (ℹ️ icons) to Rev B assets using P&ID tags and asset numbers. Only assets with matching identifiers are included.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Scanning both revisions for matches…</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-700">{transferable.length} to transfer</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-700">{skipped.length} skipped (already have specs)</span>
              </div>
            </div>

            {/* Matching report table */}
            <ScrollArea className="h-[50vh] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">Status</TableHead>
                    <TableHead>Rev A Source</TableHead>
                    <TableHead className="w-[50px] text-center">→</TableHead>
                    <TableHead>Rev B Target</TableHead>
                    <TableHead>Matched Via</TableHead>
                    <TableHead className="w-[60px] text-center">Specs</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No matching assets found between Rev A and Rev B.
                      </TableCell>
                    </TableRow>
                  ) : (
                    matches.map((m, i) => (
                      <TableRow key={i} className={m.skipped ? "opacity-50" : ""}>
                        <TableCell>
                          {m.skipped ? (
                            <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px]">Skip</Badge>
                          ) : (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-[10px]">Ready</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-mono font-medium">{m.revAAssetNumber}</div>
                            <div className="text-muted-foreground">{m.revAAssetName}</div>
                            <div className="text-muted-foreground text-[10px]">{m.revAAreaCode} › {m.revAParentAsset}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <ArrowRight className="h-3 w-3 text-muted-foreground mx-auto" />
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div className="font-mono font-medium">{m.revBAssetNumber}</div>
                            <div className="text-muted-foreground">{m.revBAssetName}</div>
                            <div className="text-muted-foreground text-[10px]">{m.revBAreaCode} › {m.revBParentAsset}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-[10px]">
                            {m.matchedVia === "pid_tag" ? `🏷️ ${m.matchedTag}` : `# ${m.revAAssetNumber}`}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-[10px]">{m.revAComponents.length}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Actions */}
            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5" />
                <span>Component specs will be written to the Rev B database. Existing specs are never overwritten.</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                {committed ? (
                  <Button disabled className="bg-emerald-600">
                    <Check className="h-4 w-4 mr-1" /> Committed
                  </Button>
                ) : (
                  <Button
                    onClick={handleCommit}
                    disabled={transferable.length === 0 || committing}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {committing ? (
                      <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Committing…</>
                    ) : (
                      <>Commit {transferable.length} Transfers</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
