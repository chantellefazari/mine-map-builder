import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertTriangle, Loader2, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ParsedRow {
  pidTag: string;
  componentType: string;
  description: string;
}

interface MatchedRow extends ParsedRow {
  matchedAssetId: string | null;
  matchedAssetNumber: string;
  matchedAssetName: string;
  status: "matched" | "not_found" | "duplicate";
}

export const BulkComponentImportDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [matchedRows, setMatchedRows] = useState<MatchedRow[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<"paste" | "review">("paste");
  const queryClient = useQueryClient();

  // Strip advisory notes like "(Robbie please advice)" from any field
  const sanitizeField = (val: string) =>
    val.replace(/\(?\s*Robbie\s+please\s+advi[sc]e\s*\)?/gi, "").replace(/\s{2,}/g, " ").trim();

  const parsedRows = useMemo((): ParsedRow[] => {
    if (!rawText.trim()) return [];
    return rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split("\t").map((p) => p.trim());
        // Filter out empty columns
        const filled = parts.filter((p) => p.length > 0);

        if (parts.length >= 5) {
          const pidTag = parts[0];
          const lastFilled = filled[filled.length - 1] || "";
          const secondLast = filled.length >= 3 ? filled[filled.length - 2] : "";
          const thirdLast = filled.length >= 4 ? filled[filled.length - 3] : "";
          const componentType = secondLast === thirdLast && filled.length >= 4 
            ? secondLast 
            : secondLast;
          return { pidTag, componentType: sanitizeField(componentType), description: sanitizeField(lastFilled) };
        }
        if (parts.length >= 3) {
          return {
            pidTag: parts[0],
            componentType: sanitizeField(parts[1]),
            description: sanitizeField(parts[2]),
          };
        }
        // Fallback: comma-separated
        const cParts = line.split(",").map((p) => p.trim());
        return {
          pidTag: cParts[0] || "",
          componentType: sanitizeField(cParts[1] || ""),
          description: sanitizeField(cParts[2] || ""),
        };
      })
      .filter((r) => r.pidTag && r.componentType);
  }, [rawText]);

  const handleMatch = async () => {
    if (parsedRows.length === 0) return;
    setIsMatching(true);

    try {
      // Fetch all Rev B assets with their pid_tags
      const { data: assets, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("id, asset_number, asset_name, pid_tags, components");

      if (error) throw error;

      // Build a lookup: normalised P&ID tag → asset
      const normalizeTag = (t: string) =>
        t.toLowerCase().replace(/\b0+(\d)/g, "$1");

      const tagToAsset = new Map<string, { id: string; asset_number: string; asset_name: string; existingComponents: any[] }>();

      for (const a of assets || []) {
        const tags = a.pid_tags as string[] | null;
        if (!tags) continue;
        const existingComponents = Array.isArray(a.components) ? a.components : [];
        for (const tag of tags) {
          const normTag = normalizeTag(tag);
          const existing = tagToAsset.get(normTag);
          // When multiple assets share a P&ID tag, prefer the shortest asset_number
          // (the parent/system-level equipment, e.g. MFCV01 over MFCV01-BASD)
          if (!existing || a.asset_number.length < existing.asset_number.length) {
            tagToAsset.set(normTag, {
              id: a.id,
              asset_number: a.asset_number,
              asset_name: a.asset_name,
              existingComponents,
            });
          }
        }
      }

      const matched: MatchedRow[] = parsedRows.map((row) => {
        const normTag = normalizeTag(row.pidTag);
        const asset = tagToAsset.get(normTag);

        if (!asset) {
          return {
            ...row,
            matchedAssetId: null,
            matchedAssetNumber: "",
            matchedAssetName: "",
            status: "not_found" as const,
          };
        }

        // Check if this component type already exists on the asset
        const isDuplicate = asset.existingComponents.some(
          (c: any) =>
            c.componentType?.toLowerCase() === row.componentType.toLowerCase()
        );

        return {
          ...row,
          matchedAssetId: asset.id,
          matchedAssetNumber: asset.asset_number,
          matchedAssetName: asset.asset_name,
          status: isDuplicate ? ("duplicate" as const) : ("matched" as const),
        };
      });

      setMatchedRows(matched);
      setStep("review");
    } catch (e: any) {
      toast({
        title: "Match failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };

  const matchedCount = matchedRows.filter((r) => r.status === "matched").length;
  const notFoundCount = matchedRows.filter((r) => r.status === "not_found").length;
  const duplicateCount = matchedRows.filter((r) => r.status === "duplicate").length;

  const handleImport = async () => {
    const toImport = matchedRows.filter((r) => r.status === "matched");
    if (toImport.length === 0) return;

    setIsImporting(true);
    try {
      // Group by asset ID
      const byAsset = new Map<string, { assetId: string; components: { componentType: string; componentName: string; manufacturer: string | null; model: string | null }[] }>();

      for (const row of toImport) {
        if (!row.matchedAssetId) continue;
        if (!byAsset.has(row.matchedAssetId)) {
          byAsset.set(row.matchedAssetId, { assetId: row.matchedAssetId, components: [] });
        }

        const cleanedDescription = row.description.trim();
        const componentName = cleanedDescription || `${row.matchedAssetName} ${row.componentType}`;

        // Description is treated as component name; specs remain blank unless explicitly provided.
        byAsset.get(row.matchedAssetId)!.components.push({
          componentType: row.componentType,
          componentName,
          manufacturer: null,
        });
      }

      // Fetch current components for each asset and merge
      let successCount = 0;
      for (const [assetId, entry] of byAsset.entries()) {
        const { data: current, error: fetchError } = await supabase
          .from("processing_plant_assets_rev_b")
          .select("components")
          .eq("id", assetId)
          .single();

        if (fetchError) {
          console.error("Fetch error for", assetId, fetchError);
          continue;
        }

        const existing = Array.isArray(current?.components) ? current.components : [];
        const merged = [
          ...existing,
          ...entry.components.map((c) => ({
            componentCode: "",
            componentType: c.componentType,
            componentName: c.componentName,
            manufacturer: c.manufacturer,
          })),
        ];

        const { error: updateError } = await supabase
          .from("processing_plant_assets_rev_b")
          .update({ components: merged as any })
          .eq("id", assetId);

        if (updateError) {
          console.error("Update error for", assetId, updateError);
        } else {
          successCount++;
        }
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["rev-b-assets"] });
      queryClient.invalidateQueries({ queryKey: ["rev-b-plant-assets-tree"] });

      toast({
        title: "Components imported ✅",
        description: `${toImport.length} components added to ${successCount} assets.`,
      });

      setOpen(false);
      setStep("paste");
      setRawText("");
      setMatchedRows([]);
    } catch (e: any) {
      toast({
        title: "Import failed",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setStep("paste");
    setMatchedRows([]);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setStep("paste"); setRawText(""); setMatchedRows([]); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Import Components
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Component Import — Rev B
          </DialogTitle>
        </DialogHeader>

        {step === "paste" && (
          <div className="space-y-4">
            <div className="bg-muted/50 border border-border rounded-lg p-3 text-xs space-y-1">
              <p className="font-semibold text-foreground">Paste tab-separated rows (from Excel/Sheets):</p>
              <p className="text-muted-foreground font-mono">P&ID Tag &lt;tab&gt; Component Type &lt;tab&gt; Description/Part Number</p>
              <p className="text-muted-foreground mt-1">Example:</p>
              <p className="font-mono text-primary">4-FE-100{"\t"}Motor{"\t"}SEW-EURODRIVE KA107R77 DRN112M4/V</p>
              <p className="font-mono text-primary">4-FE-100{"\t"}Gearbox{"\t"}SEW-EURODRIVE KA107R77 DRN112M4/V</p>
            </div>

            <Textarea
              placeholder="Paste rows here..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={10}
              className="font-mono text-xs"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {parsedRows.length} row{parsedRows.length !== 1 ? "s" : ""} detected
              </span>
              <Button
                onClick={handleMatch}
                disabled={parsedRows.length === 0 || isMatching}
                size="sm"
              >
                {isMatching ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    Matching...
                  </>
                ) : (
                  "Match to Rev B Assets"
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="default" className="bg-green-600 gap-1">
                <CheckCircle className="h-3 w-3" /> {matchedCount} matched
              </Badge>
              {notFoundCount > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="h-3 w-3" /> {notFoundCount} not found
                </Badge>
              )}
              {duplicateCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Info className="h-3 w-3" /> {duplicateCount} duplicate (skipped)
                </Badge>
              )}
            </div>

            {/* Results table */}
            <div className="max-h-[400px] overflow-auto border border-border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">P&ID Tag</th>
                    <th className="p-2 text-left">Component</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Matched Asset</th>
                  </tr>
                </thead>
                <tbody>
                  {matchedRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-border/30 ${
                        row.status === "not_found"
                          ? "bg-red-50 dark:bg-red-950/20"
                          : row.status === "duplicate"
                          ? "bg-amber-50 dark:bg-amber-950/20 opacity-60"
                          : ""
                      }`}
                    >
                      <td className="p-2">
                        {row.status === "matched" && (
                          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                        )}
                        {row.status === "not_found" && (
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                              </TooltipTrigger>
                              <TooltipContent>No Rev B asset has this P&ID tag</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {row.status === "duplicate" && (
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger>
                                <Info className="h-3.5 w-3.5 text-amber-500" />
                              </TooltipTrigger>
                              <TooltipContent>Component type already exists on this asset</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </td>
                      <td className="p-2 font-mono">{row.pidTag}</td>
                      <td className="p-2 font-medium">{row.componentType}</td>
                      <td className="p-2 text-muted-foreground truncate max-w-[200px]">{row.description}</td>
                      <td className="p-2 font-mono text-primary">
                        {row.matchedAssetNumber || "—"}
                        {row.matchedAssetName && (
                          <span className="text-muted-foreground ml-1 font-sans">
                            ({row.matchedAssetName})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleReset}>
                ← Back to Edit
              </Button>
              <Button
                onClick={handleImport}
                disabled={matchedCount === 0 || isImporting}
                size="sm"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                    Importing...
                  </>
                ) : (
                  `Import ${matchedCount} Component${matchedCount !== 1 ? "s" : ""}`
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
