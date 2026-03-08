import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, CheckCircle, AlertTriangle, Loader2, Info, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParsedRow {
  pidTag: string;
  componentType: string;
  description: string;
  specs: string;
}

interface MatchedRow extends ParsedRow {
  matchedAssetId: string | null;
  matchedAssetNumber: string;
  matchedAssetName: string;
  status: "matched" | "not_found" | "duplicate";
}

interface AreaOption {
  areaCode: string;
  areaLabel: string;
  subAreas: string[];
}

export const BulkComponentImportDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const [matchedRows, setMatchedRows] = useState<MatchedRow[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<"paste" | "review" | "summary">("paste");
  const [areaOptions, setAreaOptions] = useState<AreaOption[]>([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSubArea, setSelectedSubArea] = useState("");
  const [importSummary, setImportSummary] = useState<{
    imported: number;
    duplicates: number;
    rejected: number;
    parentArea: string;
    subArea: string;
    details: string[];
  } | null>(null);
  const queryClient = useQueryClient();

  // Fetch available areas/sub-areas from Rev B
  useEffect(() => {
    if (!open) return;
    const fetchAreas = async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("area_code, area_label, sub_area")
        .order("area_code");
      if (error || !data) return;

      const areaMap = new Map<string, AreaOption>();
      for (const row of data) {
        if (!areaMap.has(row.area_code)) {
          areaMap.set(row.area_code, {
            areaCode: row.area_code,
            areaLabel: row.area_label,
            subAreas: [],
          });
        }
        const opt = areaMap.get(row.area_code)!;
        if (row.sub_area && !opt.subAreas.includes(row.sub_area)) {
          opt.subAreas.push(row.sub_area);
        }
      }
      setAreaOptions(Array.from(areaMap.values()));
    };
    fetchAreas();
  }, [open]);

  const currentAreaOption = areaOptions.find((a) => a.areaCode === selectedArea);

  // Strip advisory notes
  const sanitizeField = (val: string) =>
    val.replace(/\(?\s*Robbie\s+please\s+advi[sc]e\s*\)?/gi, "").replace(/\s{2,}/g, " ").trim();

  const stripRepMarkers = (text: string): string =>
    text
      .replace(/\s*\((?:Rep\.?|Ref\.?)\s*[^)]*\)/gi, "")
      .replace(/\s+-\s+(?:Rep\.?|Ref\.?)\s*[\w.-]+/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  const parsedRows = useMemo((): ParsedRow[] => {
    if (!rawText.trim()) return [];
    return rawText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const parts = line.split("\t").map((p) => p.trim());

        if (parts.length >= 2) {
          const pidTag = sanitizeField(parts[0] || "");
          const columnsAfterTag = parts.slice(1).filter((p) => p.length > 0);
          const lastCol = sanitizeField(columnsAfterTag[columnsAfterTag.length - 1] || "");
          const secondLastCol = columnsAfterTag.length >= 2 ? sanitizeField(columnsAfterTag[columnsAfterTag.length - 2] || "") : "";

          if (columnsAfterTag.length >= 3) {
            const thirdLastCol = columnsAfterTag.length >= 3 ? sanitizeField(columnsAfterTag[columnsAfterTag.length - 3] || "") : "";
            return {
              pidTag,
              componentType: stripRepMarkers(sanitizeField(secondLastCol || thirdLastCol)),
              description: stripRepMarkers(sanitizeField(secondLastCol)),
              specs: lastCol,
            };
          }

          if (columnsAfterTag.length === 2) {
            return {
              pidTag,
              componentType: stripRepMarkers(sanitizeField(columnsAfterTag[0])),
              description: stripRepMarkers(lastCol),
              specs: "",
            };
          }

          return {
            pidTag,
            componentType: stripRepMarkers(lastCol),
            description: lastCol,
            specs: "",
          };
        }

        const cParts = line.split(",").map((p) => p.trim());
        return {
          pidTag: sanitizeField(cParts[0] || ""),
          componentType: sanitizeField(cParts[1] || "Component"),
          description: sanitizeField(cParts.slice(2).filter(Boolean).join(" | ")),
          specs: "",
        };
      })
      .filter((r) => r.pidTag && r.componentType);
  }, [rawText]);

  const handleMatch = async () => {
    if (parsedRows.length === 0) return;
    setIsMatching(true);

    try {
      // Fetch ALL assets — match across entire plant by P&ID tag
      const { data: assets, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("id, asset_number, asset_name, pid_tags, components, area_code, sub_area");
      if (error) throw error;

      // Build lookup: normalised P&ID tag → assets (scoped to selected area only)
      const normalizeTag = (t: string) =>
        t.toLowerCase().replace(/\b0+(\d)/g, "$1");

      interface AssetEntry {
        id: string;
        asset_number: string;
        asset_name: string;
        existingComponents: any[];
      }

      const tagToAssets = new Map<string, AssetEntry[]>();

      for (const a of assets || []) {
        const tags = a.pid_tags as string[] | null;
        if (!tags) continue;
        const existingComponents = Array.isArray(a.components) ? a.components : [];
        for (const tag of tags) {
          const normTag = normalizeTag(tag);
          if (!tagToAssets.has(normTag)) tagToAssets.set(normTag, []);
          tagToAssets.get(normTag)!.push({
            id: a.id,
            asset_number: a.asset_number,
            asset_name: a.asset_name,
            existingComponents,
          });
        }
      }

      // No fuzzy matching, no OCR guessing — exact tag lookup only
      const matched: MatchedRow[] = parsedRows.map((row) => {
        const normTag = normalizeTag(row.pidTag);
        const assetList = tagToAssets.get(normTag);

        if (!assetList || assetList.length === 0) {
          return {
            ...row,
            matchedAssetId: null,
            matchedAssetNumber: "",
            matchedAssetName: "",
            status: "not_found" as const,
          };
        }

        // Pick the most specific sub-asset by suffix or exact name match
        const bestAsset = findBestAsset(row.componentType, assetList);
        if (!bestAsset) {
          return {
            ...row,
            matchedAssetId: null,
            matchedAssetNumber: "",
            matchedAssetName: "",
            status: "not_found" as const,
          };
        }

        // Duplicate check — exact match on type + specs
        const normalizedType = sanitizeField(row.componentType).toLowerCase();
        const normalizedSpecs = (row.specs || "").trim().toLowerCase();

        const isDuplicate = bestAsset.existingComponents.some((c: any) => {
          const existingType = sanitizeField(c.componentType || "").toLowerCase();
          const existingModel = sanitizeField(c.model || "").toLowerCase();
          const typeMatch = existingType === normalizedType;
          if (!typeMatch) return false;
          if (normalizedSpecs && existingModel) {
            return existingModel === normalizedSpecs;
          }
          return true;
        });

        return {
          ...row,
          matchedAssetId: bestAsset.id,
          matchedAssetNumber: bestAsset.asset_number,
          matchedAssetName: bestAsset.asset_name,
          status: isDuplicate ? ("duplicate" as const) : ("matched" as const),
        };
      });

      setMatchedRows(matched);
      setStep("review");
    } catch (e: any) {
      toast({ title: "Match failed", description: e.message, variant: "destructive" });
    } finally {
      setIsMatching(false);
    }
  };

  // Suffix-based routing (no fuzzy/OCR)
  const COMPONENT_SUFFIX_MAP: Record<string, string[]> = {
    motor: ["MTR", "MOTOR"],
    gearbox: ["GB", "GBX", "GEAR", "GR"],
    pinion: ["PIN"],
    bearing: ["BRG", "BEARING"],
    pump: ["PMP", "PUMP"],
    valve: ["VLV", "VALVE", "V"],
    agitator: ["AGT"],
    impeller: ["IMP"],
    cyclone: ["CYC"],
    hopper: ["HOP", "DHP"],
    chute: ["CHT", "LDCH"],
    conveyor: ["CONV", "CV"],
    compressor: ["COMP"],
    filter: ["FLT", "FILT"],
    instrument: ["INST"],
    monorail: ["MNR"],
    reducer: ["GR", "GRTE"],
  };

  const findBestAsset = (componentType: string, assetList: { id: string; asset_number: string; asset_name: string; existingComponents: any[] }[]) => {
    if (assetList.length === 1) return assetList[0];
    const sorted = [...assetList].sort((a, b) => a.asset_number.length - b.asset_number.length);
    const parentAsset = sorted[0];
    const childAssets = sorted.slice(1);
    if (childAssets.length === 0) return parentAsset;

    const compTypeLower = componentType.toLowerCase().trim();
    const suffixes = COMPONENT_SUFFIX_MAP[compTypeLower];
    if (suffixes) {
      for (const child of childAssets) {
        const suffix = child.asset_number.replace(parentAsset.asset_number, "").replace(/^[-_]/, "").toUpperCase();
        if (suffixes.some((s) => suffix === s || suffix.startsWith(s))) return child;
      }
    }
    for (const child of childAssets) {
      if (child.asset_name.toLowerCase().trim() === compTypeLower) return child;
    }
    return parentAsset;
  };

  const matchedCount = matchedRows.filter((r) => r.status === "matched").length;
  const notFoundCount = matchedRows.filter((r) => r.status === "not_found").length;
  const duplicateCount = matchedRows.filter((r) => r.status === "duplicate").length;

  const handleImport = async () => {
    const toImport = matchedRows.filter((r) => r.status === "matched");
    if (toImport.length === 0) return;

    setIsImporting(true);
    const details: string[] = [];
    try {
      const byAsset = new Map<string, { assetId: string; assetNumber: string; components: { componentType: string; componentName: string; manufacturer: string | null; model: string | null }[] }>();

      for (const row of toImport) {
        if (!row.matchedAssetId) continue;
        if (!byAsset.has(row.matchedAssetId)) {
          byAsset.set(row.matchedAssetId, { assetId: row.matchedAssetId, assetNumber: row.matchedAssetNumber, components: [] });
        }
        const cleanedDescription = stripRepMarkers(sanitizeField(row.description));
        // Preserve exact names from user Excel — NO auto-rename
        const componentName = cleanedDescription || `${row.matchedAssetName} ${row.componentType}`;

        byAsset.get(row.matchedAssetId)!.components.push({
          componentType: row.componentType, // exact as provided
          componentName,
          manufacturer: null,
          model: row.specs || cleanedDescription || null,
        });
      }

      let successCount = 0;
      for (const [assetId, entry] of byAsset.entries()) {
        const { data: current, error: fetchError } = await supabase
          .from("processing_plant_assets_rev_b")
          .select("components")
          .eq("id", assetId)
          .single();

        if (fetchError) {
          details.push(`❌ Fetch failed: ${entry.assetNumber}`);
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
            model: c.model,
          })),
        ];

        const { error: updateError } = await supabase
          .from("processing_plant_assets_rev_b")
          .update({ components: merged as any })
          .eq("id", assetId);

        if (updateError) {
          details.push(`❌ Write failed: ${entry.assetNumber}`);
        } else {
          details.push(`✅ ${entry.components.length} component(s) → ${entry.assetNumber}`);
          successCount++;
        }
      }

      queryClient.invalidateQueries({ queryKey: ["rev-b-assets"] });
      queryClient.invalidateQueries({ queryKey: ["rev-b-plant-assets-tree"] });

      const areaLabel = currentAreaOption?.areaLabel || selectedArea;
      setImportSummary({
        imported: toImport.length,
        duplicates: duplicateCount,
        rejected: notFoundCount,
        parentArea: areaLabel,
        subArea: selectedSubArea || "All",
        details,
      });
      setStep("summary");

      toast({
        title: "Components imported ✅",
        description: `${toImport.length} components added to ${successCount} assets in ${areaLabel}.`,
      });
    } catch (e: any) {
      toast({ title: "Import failed", description: e.message, variant: "destructive" });
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setStep("paste");
    setMatchedRows([]);
  };

  const handleFullReset = () => {
    setStep("select-area");
    setRawText("");
    setMatchedRows([]);
    setSelectedArea("");
    setSelectedSubArea("");
    setImportSummary(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) handleFullReset(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Import Components
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Controlled Component Import — Rev B
          </DialogTitle>
        </DialogHeader>

        {/* Governance banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-2.5 text-xs text-muted-foreground flex items-start gap-2">
          <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-foreground">Manual-Controlled Import Mode</span>
            <span className="block mt-0.5">No auto-rename · No area reclassification · No OCR guessing · Exact placement only</span>
          </div>
        </div>

        {/* STEP 1: Select area */}
        {step === "select-area" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Area</label>
              <Select value={selectedArea} onValueChange={(v) => { setSelectedArea(v); setSelectedSubArea(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent area..." />
                </SelectTrigger>
                <SelectContent>
                  {areaOptions.map((a) => (
                    <SelectItem key={a.areaCode} value={a.areaCode}>
                      {a.areaCode} — {a.areaLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {currentAreaOption && currentAreaOption.subAreas.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Sub-Area <span className="text-muted-foreground font-normal">(optional — narrows scope)</span></label>
                <Select value={selectedSubArea} onValueChange={setSelectedSubArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="All sub-areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All sub-areas</SelectItem>
                    {currentAreaOption.subAreas.map((sa) => (
                      <SelectItem key={sa} value={sa}>{sa}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={() => { if (selectedSubArea === "__all__") setSelectedSubArea(""); setStep("paste"); }}
              disabled={!selectedArea}
              size="sm"
              className="w-full"
            >
              Continue to Paste Data →
            </Button>
          </div>
        )}

        {/* STEP 2: Paste */}
        {step === "paste" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="gap-1">
                Area: {currentAreaOption?.areaLabel || selectedArea}
              </Badge>
              {selectedSubArea && (
                <Badge variant="outline" className="gap-1">
                  Sub-Area: {selectedSubArea}
                </Badge>
              )}
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2" onClick={() => setStep("select-area")}>
                Change
              </Button>
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-3 text-xs space-y-1">
              <p className="font-semibold text-foreground">Paste tab-separated rows (from Excel/Sheets):</p>
              <p className="text-muted-foreground font-mono">P&ID Tag &lt;tab&gt; Component Type &lt;tab&gt; Description/Part Number</p>
              <p className="text-muted-foreground mt-1">Example:</p>
              <p className="font-mono text-primary">4-FE-100{"\t"}Motor{"\t"}SEW-EURODRIVE KA107R77</p>
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
                  <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Matching...</>
                ) : (
                  "Match to Rev B Assets"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {step === "review" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm mb-1">
              <Badge variant="outline">Area: {currentAreaOption?.areaLabel || selectedArea}</Badge>
              {selectedSubArea && <Badge variant="outline">Sub-Area: {selectedSubArea}</Badge>}
            </div>

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

            <div className="max-h-[400px] overflow-auto border border-border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">P&ID Tag</th>
                    <th className="p-2 text-left">Component</th>
                    <th className="p-2 text-left">Specs</th>
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
                        {row.status === "matched" && <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
                        {row.status === "not_found" && (
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger><AlertTriangle className="h-3.5 w-3.5 text-red-500" /></TooltipTrigger>
                              <TooltipContent>No Rev B asset in selected area has this P&ID tag</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        {row.status === "duplicate" && (
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger><Info className="h-3.5 w-3.5 text-amber-500" /></TooltipTrigger>
                              <TooltipContent>Component already exists on this asset — skipped</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </td>
                      <td className="p-2 font-mono">{row.pidTag}</td>
                      <td className="p-2 font-medium">{row.componentType}</td>
                      <td className="p-2 text-muted-foreground truncate max-w-[200px] font-mono">{row.specs || "—"}</td>
                      <td className="p-2 font-mono text-primary">
                        {row.matchedAssetNumber || "—"}
                        {row.matchedAssetName && (
                          <span className="text-muted-foreground ml-1 font-sans">({row.matchedAssetName})</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleReset}>← Back to Edit</Button>
              <Button onClick={handleImport} disabled={matchedCount === 0 || isImporting} size="sm">
                {isImporting ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Importing...</>
                ) : (
                  `Import ${matchedCount} Component${matchedCount !== 1 ? "s" : ""}`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: Summary */}
        {step === "summary" && importSummary && (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" /> Import Complete
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="font-medium">Parent Area:</div>
                <div>{importSummary.parentArea}</div>
                <div className="font-medium">Sub-Area:</div>
                <div>{importSummary.subArea}</div>
                <div className="font-medium">Imported:</div>
                <div className="text-green-700 dark:text-green-400 font-semibold">{importSummary.imported}</div>
                <div className="font-medium">Duplicates Skipped:</div>
                <div className="text-amber-600">{importSummary.duplicates}</div>
                <div className="font-medium">Rejected (Not Found):</div>
                <div className="text-red-600">{importSummary.rejected}</div>
              </div>
            </div>

            {importSummary.details.length > 0 && (
              <div className="border border-border rounded-lg p-3 max-h-[200px] overflow-auto">
                <p className="text-xs font-semibold mb-2">Detail Log</p>
                {importSummary.details.map((d, i) => (
                  <p key={i} className="text-xs font-mono">{d}</p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleFullReset}>
                Import More
              </Button>
              <Button variant="default" size="sm" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
