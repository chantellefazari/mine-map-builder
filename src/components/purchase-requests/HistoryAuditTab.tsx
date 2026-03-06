import React, { useState, useEffect } from "react";
import { History, Loader2, Mail, FileText, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface AuditEntry {
  id: string;
  table_name: string;
  record_id: string;
  operation: string;
  old_data: any;
  new_data: any;
  changed_at: string;
  changed_by: string | null;
}

const tableLabels: Record<string, string> = {
  purchase_requests: "Purchase Request",
  quote_requests: "Quote Request",
  quote_responses: "Quote Response",
  po_tracker: "Purchase Order",
  po_tracker_lines: "PO Line Item",
  purchase_request_lines: "PR Line Item",
};

const operationColors: Record<string, string> = {
  INSERT: "bg-emerald-500/20 text-emerald-700 border-emerald-500/30",
  UPDATE: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  DELETE: "bg-destructive/20 text-destructive border-destructive/30",
};

const getChangeDescription = (entry: AuditEntry): string => {
  const label = tableLabels[entry.table_name] || entry.table_name;

  if (entry.operation === "INSERT") {
    const ref = entry.new_data?.pr_number || entry.new_data?.po_number || entry.new_data?.part_description || "";
    return `${label} created${ref ? `: ${ref}` : ""}`;
  }

  if (entry.operation === "UPDATE" && entry.old_data && entry.new_data) {
    // Detect status change
    if (entry.old_data.status !== entry.new_data.status) {
      const ref = entry.new_data.pr_number || entry.new_data.po_number || "";
      return `${label} ${ref} status: ${entry.old_data.status} → ${entry.new_data.status}`;
    }
    // Detect supplier confirmation
    if (!entry.old_data.supplier_confirmed && entry.new_data.supplier_confirmed) {
      return `Supplier confirmed PO ${entry.new_data.po_number || ""}`;
    }
    const ref = entry.new_data.pr_number || entry.new_data.po_number || "";
    return `${label} ${ref} updated`;
  }

  if (entry.operation === "DELETE") {
    return `${label} deleted`;
  }

  return `${label} ${entry.operation.toLowerCase()}`;
};

const PROCUREMENT_TABLES = [
  "purchase_requests",
  "purchase_request_lines",
  "quote_requests",
  "quote_responses",
  "po_tracker",
  "po_tracker_lines",
];

export const HistoryAuditTab: React.FC = () => {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .in("table_name", PROCUREMENT_TABLES)
        .order("changed_at", { ascending: false })
        .limit(200);
      if (!error) setEntries((data || []) as AuditEntry[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = entries.filter((e) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const desc = getChangeDescription(e).toLowerCase();
    return (
      desc.includes(s) ||
      e.table_name.includes(s) ||
      e.operation.toLowerCase().includes(s)
    );
  });

  const stats = {
    total: entries.length,
    prChanges: entries.filter((e) => e.table_name === "purchase_requests").length,
    quoteChanges: entries.filter((e) => e.table_name === "quote_requests" || e.table_name === "quote_responses").length,
    poChanges: entries.filter((e) => e.table_name === "po_tracker" || e.table_name === "po_tracker_lines").length,
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Events</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.prChanges}</p>
          <p className="text-xs text-muted-foreground">PR Events</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.quoteChanges}</p>
          <p className="text-xs text-muted-foreground">Quote Events</p>
        </CardContent></Card>
        <Card className="border"><CardContent className="pt-4 pb-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.poChanges}</p>
          <p className="text-xs text-muted-foreground">PO Events</p>
        </CardContent></Card>
      </div>

      <Input
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-xs"
      />

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p>No audit events found</p>
          <p className="text-xs mt-1">Procurement activity will appear here as changes are made</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
            >
              <div className="mt-0.5">
                {entry.table_name.includes("quote") ? (
                  <Mail className="h-4 w-4 text-muted-foreground" />
                ) : entry.table_name.includes("po") ? (
                  <FileText className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{getChangeDescription(entry)}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(entry.changed_at), "dd MMM yyyy HH:mm")}
                  {entry.changed_by && ` • by ${entry.changed_by}`}
                </p>
              </div>
              <Badge className={`text-[10px] shrink-0 ${operationColors[entry.operation] || ""}`}>
                {entry.operation}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
