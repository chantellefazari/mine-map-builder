import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { PlantRule } from "@/hooks/usePlantIntelligence";
import { format } from "date-fns";

const impactColor: Record<string, string> = {
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-200",
  High: "bg-orange-500/10 text-orange-600 border-orange-200",
  Critical: "bg-red-500/10 text-red-600 border-red-200",
};

const statusColor: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  "Pending Review": "bg-amber-500/10 text-amber-700",
  Approved: "bg-emerald-500/10 text-emerald-700",
  Archived: "bg-muted text-muted-foreground/60",
};

export function RulesLibrary({ rules, isLoading }: { rules: PlantRule[]; isLoading: boolean }) {
  const [search, setSearch] = useState("");

  const filtered = rules.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.asset.toLowerCase().includes(q) ||
      r.rule_type.toLowerCase().includes(q) ||
      r.rule_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search rules by title, area, asset, type…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Rule ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Related Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Impact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead className="w-28">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                  Loading rules…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                  {search ? "No rules match your search" : "No rules added yet. Use Add Logic or Voice Capture to create your first rule."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.rule_id || "—"}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{r.title}</TableCell>
                  <TableCell className="text-sm">{r.area || "—"}</TableCell>
                  <TableCell className="text-sm">{r.asset || "—"}</TableCell>
                  <TableCell className="text-sm">{r.related_asset || "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">{r.rule_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${impactColor[r.impact_level] ?? ""}`}>{r.impact_level}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${statusColor[r.status] ?? ""}`}>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{r.added_by || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(r.updated_at), "dd MMM yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
