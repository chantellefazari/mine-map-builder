import { useState } from "react";
import { usePMAssetLinking, StagingRow } from "@/hooks/usePMAssetLinking";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2, Search, RefreshCw, CheckCircle2, AlertTriangle, XCircle, Upload, FileCheck, BarChart3,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const confidenceBadge: Record<string, { className: string; icon: React.ReactNode }> = {
  Exact: { className: "bg-green-500/20 text-green-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  Keyword: { className: "bg-blue-500/20 text-blue-700", icon: <CheckCircle2 className="w-3 h-3" /> },
  Multiple: { className: "bg-amber-500/20 text-amber-700", icon: <AlertTriangle className="w-3 h-3" /> },
  None: { className: "bg-red-500/20 text-red-700", icon: <XCircle className="w-3 h-3" /> },
};

const statusBadge: Record<string, string> = {
  Pending: "bg-muted text-muted-foreground",
  Confirmed: "bg-green-500/20 text-green-700",
  "Manual Review Required": "bg-amber-500/20 text-amber-700",
};

export const PMAssetLinkingSection = () => {
  const {
    staging, summary, isLoading, populate, isPopulating,
    updateStatus, commitLinks, isCommitting, assets,
  } = usePMAssetLinking();

  const [search, setSearch] = useState("");
  const [filterConfidence, setFilterConfidence] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showReport, setShowReport] = useState(false);

  const filtered = staging.filter((r) => {
    const matchesSearch =
      r.pm_template_name.toLowerCase().includes(search.toLowerCase()) ||
      r.pm_equipment_ref.toLowerCase().includes(search.toLowerCase()) ||
      r.matched_asset_id.toLowerCase().includes(search.toLowerCase());
    const matchesConf = filterConfidence === "all" || r.match_confidence === filterConfidence;
    const matchesStat = filterStatus === "all" || r.validation_status === filterStatus;
    return matchesSearch && matchesConf && matchesStat;
  });

  const handleConfirmAllExact = async () => {
    const exactPending = staging.filter(
      (r) => r.match_confidence === "Exact" && r.validation_status !== "Confirmed" && !r.committed
    );
    if (exactPending.length === 0) return;
    try {
      for (const row of exactPending) {
        await updateStatus({ id: row.id, validation_status: "Confirmed" });
      }
      toast({ title: "Exact Matches Confirmed", description: `${exactPending.length} exact match(es) confirmed.` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handlePopulate = async () => {
    try {
      const count = await populate();
      toast({ title: "Staging Populated", description: `${count} PMs matched against ${assets.length} assets.` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const handleConfirm = async (row: StagingRow) => {
    await updateStatus({ id: row.id, validation_status: "Confirmed" });
    toast({ title: "Confirmed", description: `${row.pm_template_name} link confirmed.` });
  };

  const handleReject = async (row: StagingRow) => {
    await updateStatus({ id: row.id, validation_status: "Manual Review Required" });
  };

  const handleCommit = async () => {
    try {
      const count = await commitLinks();
      toast({ title: "Links Committed", description: `${count} PM links committed to staging log.` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading staging data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Data Protection Banner */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-destructive">Data Protection Rules</p>
          <p className="text-muted-foreground mt-1">
            Asset Tree and PM Templates are <strong>READ ONLY</strong>. All linking occurs in a separate staging table.
            No asset IDs are modified or created. No overwriting without explicit confirmation.
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handlePopulate} disabled={isPopulating} className="gap-2">
          {isPopulating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {staging.length === 0 ? "Pull Data & Run Matching" : "Re-run Matching"}
        </Button>

        {summary.exact > 0 && summary.exact > summary.confirmed && (
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleConfirmAllExact}
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm All Exact Matches ({summary.exact - staging.filter(r => r.match_confidence === "Exact" && r.validation_status === "Confirmed").length})
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="default" disabled={summary.confirmed === 0 || isCommitting} className="gap-2">
              {isCommitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Commit Confirmed PM Links ({summary.confirmed})
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Commit PM Links?</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2">
                  <p>This will log {summary.confirmed} confirmed link(s) to the staging record.</p>
                  <div className="bg-muted rounded p-3 text-xs space-y-1">
                    <p>✅ Exact matches: {summary.exact}</p>
                    <p>🔑 Keyword matches: {summary.keyword}</p>
                    <p>⚠️ Manual review required: {summary.manualReview}</p>
                    <p>❌ Unmatched: {summary.none}</p>
                  </div>
                  <p className="font-medium text-destructive">
                    No live PM Template data will be modified.
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleCommit}>Confirm Commit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button variant="outline" onClick={() => setShowReport(!showReport)} className="gap-2 ml-auto">
          <BarChart3 className="h-4 w-4" />
          {showReport ? "Hide Report" : "Show Report"}
        </Button>
      </div>

      {/* Summary Report */}
      {showReport && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SummaryCard label="Total PMs" value={summary.total} />
          <SummaryCard label="Exact Matches" value={summary.exact} color="text-green-600" />
          <SummaryCard label="Keyword Matches" value={summary.keyword} color="text-blue-600" />
          <SummaryCard label="Multiple Matches" value={summary.multiple} color="text-amber-600" />
          <SummaryCard label="Unmatched" value={summary.none} color="text-red-600" />
          <SummaryCard label="Confirmed" value={summary.confirmed} color="text-green-600" />
          <SummaryCard label="Manual Review" value={summary.manualReview} color="text-amber-600" />
          <SummaryCard label="Committed" value={summary.committed} color="text-primary" />
        </div>
      )}

      {/* Filters */}
      {staging.length > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PM name, equipment ref, or asset ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterConfidence} onValueChange={setFilterConfidence}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Confidence" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="Exact">Exact</SelectItem>
                <SelectItem value="Keyword">Keyword</SelectItem>
                <SelectItem value="Multiple">Multiple</SelectItem>
                <SelectItem value="None">None</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-popover">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Manual Review Required">Manual Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Staging Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">PM Name</TableHead>
                    <TableHead>Equipment Ref</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Matched Asset</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((row) => (
                    <TableRow key={row.id} className={row.committed ? "opacity-60" : ""}>
                      <TableCell className="font-medium text-xs">{row.pm_template_name}</TableCell>
                      <TableCell className="text-xs font-mono">{row.pm_equipment_ref}</TableCell>
                      <TableCell className="text-xs">{row.pm_frequency}</TableCell>
                      <TableCell className="text-xs">
                        {row.matched_asset_id ? (
                          <span className="font-mono">{row.matched_asset_id}</span>
                        ) : (
                          <span className="text-muted-foreground italic">—</span>
                        )}
                        {row.matched_asset_name && (
                          <span className="block text-muted-foreground">{row.matched_asset_name}</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.matched_asset_area || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`gap-1 ${confidenceBadge[row.match_confidence]?.className}`}>
                          {confidenceBadge[row.match_confidence]?.icon}
                          {row.match_confidence}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusBadge[row.validation_status]}>
                          {row.validation_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {!row.committed && (
                          <div className="flex gap-1 justify-end">
                            {row.validation_status !== "Confirmed" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleConfirm(row)}
                                className="h-7 text-xs gap-1"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Confirm
                              </Button>
                            )}
                            {row.validation_status === "Confirmed" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleReject(row)}
                                className="h-7 text-xs gap-1 text-amber-600"
                              >
                                <AlertTriangle className="h-3 w-3" /> Revoke
                              </Button>
                            )}
                          </div>
                        )}
                        {row.committed && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <FileCheck className="h-3 w-3" /> Committed
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No staging rows match your filters.
              </div>
            )}
          </div>
        </>
      )}

      {staging.length === 0 && (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <RefreshCw className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Staging Data</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Click "Pull Data & Run Matching" to populate the staging table from PM Master List and Asset Tree.
          </p>
        </div>
      )}
    </div>
  );
};

function SummaryCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${color || "text-foreground"}`}>{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
