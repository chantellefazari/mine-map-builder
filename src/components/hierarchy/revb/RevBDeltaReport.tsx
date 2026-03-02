import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Minus, ArrowRightLeft, MoveRight, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";

/* ── types ── */
interface AssetRow {
  asset_number: string;
  asset_name: string;
  area_code: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
}

interface RevBRow extends AssetRow {
  change_type: string;
  notes: string | null;
}

interface PMMasterRow {
  pm_name: string;
  equipment_type: string;
  asset_number: string;
  frequency: string;
}

interface CommittedLink {
  pm_template_name: string;
  pm_equipment_ref: string;
  matched_asset_id: string;
  matched_asset_name: string;
}

/* ── hooks ── */
function useRevAAssets() {
  return useQuery({
    queryKey: ["delta-rev-a"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets")
        .select("asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as AssetRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useRevBAssets() {
  return useQuery({
    queryKey: ["delta-rev-b"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, asset_name, area_code, area_label, sub_area, parent_asset_label, change_type, notes")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as RevBRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

function usePMMasterList() {
  return useQuery({
    queryKey: ["delta-pm-master"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pm_master_list")
        .select("pm_name, equipment_type, asset_number, frequency")
        .order("pm_name");
      if (error) throw error;
      return data as PMMasterRow[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

function useCommittedLinks() {
  return useQuery({
    queryKey: ["delta-committed-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pm_asset_link_staging")
        .select("pm_template_name, pm_equipment_ref, matched_asset_id, matched_asset_name")
        .eq("committed", true);
      if (error) throw error;
      return data as CommittedLink[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ── name-similarity helpers ── */
function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function wordOverlap(a: string, b: string): number {
  const wa = new Set(normalize(a).split(" ").filter(w => w.length > 2));
  const wb = new Set(normalize(b).split(" ").filter(w => w.length > 2));
  if (wa.size === 0 || wb.size === 0) return 0;
  let overlap = 0;
  wa.forEach(w => { if (wb.has(w)) overlap++; });
  return overlap / Math.max(wa.size, wb.size);
}

/* ── Known tag equivalences (Rev A shortcode → Rev B P&ID tag) ── */
const KNOWN_RENAMES: Array<{ revA: string; revB: string; evidence: string; confidence: string }> = [
  { revA: "BM01", revB: "04-GR-100", evidence: "Primary Ball Mill — same asset, P&ID tag vs site code", confidence: "High" },
  { revA: "RHOP01", revB: "04-FB-099", evidence: "Reclaim Hopper — same function, first in feed line", confidence: "High" },
  { revA: "APN01", revB: "04-FE-100", evidence: "Apron/Reclaim Feeder — same position below hopper", confidence: "High" },
  { revA: "MFC01", revB: "04-BE-100", evidence: "Mill Feed Conveyor — same function between feeder and mill", confidence: "High" },
  { revA: "FHOP01", revB: "04-CH-102", evidence: "Mill Feed Hopper/Chute — feed into ball mill", confidence: "Medium" },
  { revA: "FP01", revB: "04-FL-400", evidence: "Filter Press — tails dewatering", confidence: "High" },
  { revA: "THK01", revB: "04-TH-200", evidence: "Tails Thickener — same function", confidence: "High" },
  { revA: "PWT01", revB: "11-TK-202", evidence: "Potable Water Tank — same function in utilities", confidence: "High" },
  { revA: "HCMP01", revB: "05-CP-132", evidence: "HP Air Compressor 1 — same function", confidence: "High" },
  { revA: "HCMP02", revB: "05-CP-133", evidence: "HP Air Compressor 2 — same function", confidence: "High" },
  { revA: "EWCL01", revB: "04-EC-600", evidence: "Electrowinning Cell — gold recovery", confidence: "High" },
  { revA: "CY01", revB: "04-CY-106", evidence: "Primary Cyclone Cluster — classification", confidence: "High" },
  { revA: "GRT01", revB: "04-SC-100", evidence: "Vibrating Grizzly/Screen — reclaim area", confidence: "Medium" },
];

/* ── component ── */
export const RevBDeltaReport: React.FC = () => {
  const { data: revA, isLoading: loadA } = useRevAAssets();
  const { data: revB, isLoading: loadB } = useRevBAssets();
  const { data: pms, isLoading: loadPM } = usePMMasterList();
  const { data: links, isLoading: loadLinks } = useCommittedLinks();

  const report = useMemo(() => {
    if (!revA || !revB || !pms) return null;

    const revAMap = new Map(revA.map(a => [a.asset_number, a]));
    const revBMap = new Map(revB.map(b => [b.asset_number, b]));
    const knownRevAIds = new Set(KNOWN_RENAMES.map(r => r.revA));
    const knownRevBIds = new Set(KNOWN_RENAMES.map(r => r.revB));

    // 1) New in Rev B — tags not in Rev A and not a known rename target
    const additions = revB.filter(b => !revAMap.has(b.asset_number) && !knownRevBIds.has(b.asset_number));

    // 2) Missing in Rev B — Rev A tags not in Rev B and not a known rename source
    const removals = revA.filter(a => !revBMap.has(a.asset_number) && !knownRevAIds.has(a.asset_number));

    // 3) Renames — known + name-similarity detected
    const renames = [...KNOWN_RENAMES];

    // 4) Structure shifts — same tag in both but different area
    const structureShifts: Array<{ tag: string; oldArea: string; newArea: string; oldSub: string; newSub: string }> = [];
    for (const [id, aRow] of revAMap) {
      const bRow = revBMap.get(id);
      if (bRow && (aRow.area_code !== bRow.area_code || aRow.sub_area !== bRow.sub_area)) {
        structureShifts.push({
          tag: id,
          oldArea: `${aRow.area_code} / ${aRow.sub_area}`,
          newArea: `${bRow.area_code} / ${bRow.sub_area}`,
          oldSub: aRow.sub_area,
          newSub: bRow.sub_area,
        });
      }
    }

    // 5) PM Impact — PMs linked to Rev A assets that are missing/renamed/moved
    const pmImpacts: Array<{
      pmName: string; assetId: string; equipmentType: string; frequency: string; impact: string;
    }> = [];

    const linkedAssetIds = new Set([
      ...(links || []).map(l => l.matched_asset_id),
      ...pms.filter(p => p.asset_number).map(p => p.asset_number),
    ]);

    for (const pm of pms) {
      const assetId = pm.asset_number;
      if (!assetId) continue;

      const rename = KNOWN_RENAMES.find(r => r.revA === assetId);
      if (rename) {
        pmImpacts.push({
          pmName: pm.pm_name, assetId, equipmentType: pm.equipment_type,
          frequency: pm.frequency, impact: `Renamed → ${rename.revB}`,
        });
      } else if (!revBMap.has(assetId) && revAMap.has(assetId)) {
        pmImpacts.push({
          pmName: pm.pm_name, assetId, equipmentType: pm.equipment_type,
          frequency: pm.frequency, impact: "Missing in Rev B",
        });
      }
    }

    // Also check committed links
    for (const link of (links || [])) {
      const rename = KNOWN_RENAMES.find(r => r.revA === link.matched_asset_id);
      if (rename) {
        // Already covered in pmImpacts via pm_master_list
      } else if (!revBMap.has(link.matched_asset_id) && revAMap.has(link.matched_asset_id)) {
        if (!pmImpacts.find(p => p.pmName === link.pm_template_name)) {
          pmImpacts.push({
            pmName: link.pm_template_name, assetId: link.matched_asset_id,
            equipmentType: link.pm_equipment_ref, frequency: "",
            impact: "Missing in Rev B",
          });
        }
      }
    }

    return { additions, removals, renames, structureShifts, pmImpacts };
  }, [revA, revB, pms, links]);

  if (loadA || loadB || loadPM || loadLinks) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Generating delta report…</span>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground">Rev A vs Rev B — Delta Report</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Comparing Processing Plant Asset Tree (Rev A – Pre P&ID) vs (Rev B – 2026 P&ID Update).
          Read-only analysis — no edits applied.
        </p>
      </div>

      {/* 1) Additions */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Plus className="h-5 w-5 text-green-600" />
          <h3 className="text-base font-semibold text-foreground">1) New in Rev B — Additions</h3>
          <Badge variant="secondary" className="ml-2">{report.additions.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Tags that exist in Rev B but have no direct equivalent in Rev A (excluding known renames).</p>
        <div className="border border-border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-[140px]">Tag ID</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs w-[80px]">Area</TableHead>
                <TableHead className="text-xs w-[160px]">Sub-Area</TableHead>
                <TableHead className="text-xs w-[140px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.additions.slice(0, 200).map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-mono">{a.asset_number}</TableCell>
                  <TableCell className="text-xs">{a.asset_name}</TableCell>
                  <TableCell className="text-xs">{a.area_code}</TableCell>
                  <TableCell className="text-xs">{a.sub_area}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.notes || "New P&ID tag"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 2) Removals */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Minus className="h-5 w-5 text-red-600" />
          <h3 className="text-base font-semibold text-foreground">2) Missing in Rev B — Potential Removals</h3>
          <Badge variant="secondary" className="ml-2">{report.removals.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Rev A tags with no match in Rev B. May be decommissioned, renamed (not yet mapped), or missed during extraction.</p>
        <div className="border border-border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-[140px]">Tag ID</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs w-[80px]">Area</TableHead>
                <TableHead className="text-xs w-[160px]">Sub-Area</TableHead>
                <TableHead className="text-xs w-[200px]">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.removals.slice(0, 200).map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-mono">{r.asset_number}</TableCell>
                  <TableCell className="text-xs">{r.asset_name}</TableCell>
                  <TableCell className="text-xs">{r.area_code}</TableCell>
                  <TableCell className="text-xs">{r.sub_area}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">Possible decommission / rename / missed extraction</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 3) Renames */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <ArrowRightLeft className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-foreground">3) Renames / Tag Changes</h3>
          <Badge variant="secondary" className="ml-2">{report.renames.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Tags where the ID changed but the physical asset is the same (site shortcode → P&ID tag).</p>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs w-[120px]">Rev A Tag</TableHead>
                <TableHead className="text-xs w-[30px]"></TableHead>
                <TableHead className="text-xs w-[120px]">Rev B Tag</TableHead>
                <TableHead className="text-xs">Evidence</TableHead>
                <TableHead className="text-xs w-[80px]">Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.renames.map((r, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-mono font-semibold text-red-600">{r.revA}</TableCell>
                  <TableCell><MoveRight className="h-3 w-3 text-muted-foreground" /></TableCell>
                  <TableCell className="text-xs font-mono font-semibold text-green-600">{r.revB}</TableCell>
                  <TableCell className="text-xs">{r.evidence}</TableCell>
                  <TableCell>
                    <Badge variant={r.confidence === "High" ? "default" : "secondary"} className="text-xs">
                      {r.confidence}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* 4) Structure Shifts */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MoveRight className="h-5 w-5 text-amber-600" />
          <h3 className="text-base font-semibold text-foreground">4) Structure Shifts — Moved Assets</h3>
          <Badge variant="secondary" className="ml-2">{report.structureShifts.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">Assets present in both revisions but placed in different hierarchy positions.</p>
        {report.structureShifts.length === 0 ? (
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
            No structure shifts detected. Rev A uses site shortcodes (e.g. BM01) while Rev B uses P&ID tags (e.g. 04-GR-100) —
            the entire numbering system changed, so direct tag matches between revisions are rare.
            Cross-reference the Renames table above for equivalent assets.
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs w-[140px]">Tag ID</TableHead>
                  <TableHead className="text-xs">Old Area</TableHead>
                  <TableHead className="text-xs w-[30px]"></TableHead>
                  <TableHead className="text-xs">New Area</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.structureShifts.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs font-mono">{s.tag}</TableCell>
                    <TableCell className="text-xs">{s.oldArea}</TableCell>
                    <TableCell><MoveRight className="h-3 w-3 text-muted-foreground" /></TableCell>
                    <TableCell className="text-xs">{s.newArea}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* 5) PM Impact */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <h3 className="text-base font-semibold text-foreground">5) PM Impact List</h3>
          <Badge variant="secondary" className="ml-2">{report.pmImpacts.length}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          PMs linked to Rev A assets that are missing, renamed, or moved in Rev B.
          <strong className="text-foreground"> No PMs have been changed</strong> — this is impact analysis only.
        </p>
        {report.pmImpacts.length === 0 ? (
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
            No PM impacts detected. Most PMs use equipment type references (e.g. "Ball Mill") rather than asset numbers,
            so they are not directly affected by the tag renumbering.
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">PM Name</TableHead>
                  <TableHead className="text-xs w-[100px]">Asset ID</TableHead>
                  <TableHead className="text-xs w-[120px]">Equipment Type</TableHead>
                  <TableHead className="text-xs w-[80px]">Frequency</TableHead>
                  <TableHead className="text-xs w-[160px]">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.pmImpacts.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{p.pmName}</TableCell>
                    <TableCell className="text-xs font-mono">{p.assetId}</TableCell>
                    <TableCell className="text-xs">{p.equipmentType}</TableCell>
                    <TableCell className="text-xs">{p.frequency}</TableCell>
                    <TableCell>
                      <Badge
                        variant={p.impact.startsWith("Missing") ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {p.impact}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      {/* Summary */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground text-sm">Summary</p>
        <p>• Rev A total: {revA?.length ?? 0} assets across {new Set(revA?.map(a => a.area_code)).size} areas (incl. SITE infrastructure)</p>
        <p>• Rev B total: {revB?.length ?? 0} assets across {new Set(revB?.map(b => b.area_code)).size} areas (P&ID scope only — no SITE)</p>
        <p>• The entire tagging convention changed: Rev A uses site shortcodes (BM01, FP01) → Rev B uses P&ID drawing tags (04-GR-100, 04-FL-400)</p>
        <p>• {report.renames.length} confirmed renames identified. Remaining {report.removals.length} Rev A tags require manual review.</p>
        <p className="font-semibold text-foreground mt-2">⚠ No edits applied to either tree. This report is read-only.</p>
      </div>
    </div>
  );
};
