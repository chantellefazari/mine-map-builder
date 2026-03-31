import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus, Search, Truck, Calendar, Clock, CheckCircle2,
  Trash2, Edit2, FileText, Phone, Mail, Loader2,
} from "lucide-react";
import { useVendorVisits, VendorVisit } from "@/hooks/useVendorVisits";
import { AddVendorVisitDialog } from "./AddVendorVisitDialog";
import { format, parseISO, isAfter, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

export function VendorSchedulingView() {
  const { visits, isLoading, addVisit, updateVisit, deleteVisit } = useVendorVisits();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const today = startOfDay(new Date());

  const stats = useMemo(() => ({
    total: visits.length,
    scheduled: visits.filter((v) => v.status === "Scheduled").length,
    inProgress: visits.filter((v) => v.status === "In Progress").length,
    completed: visits.filter((v) => v.status === "Completed").length,
  }), [visits]);

  const filtered = useMemo(() => {
    return visits.filter((v) => {
      const matchSearch = !search ||
        v.vendor_name.toLowerCase().includes(search.toLowerCase()) ||
        v.purpose.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || v.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [visits, search, filterStatus]);

  const upcoming = filtered.filter((v) => v.status === "Scheduled" && !isBefore(parseISO(v.visit_date), today));
  const rest = filtered.filter((v) => !upcoming.includes(v));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-1">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Vendor Scheduling
          </h1>
          <p className="text-xs text-muted-foreground">Track vendor visits, required forms, and scheduling</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setShowAdd(true)}>
          <Plus className="w-3.5 h-3.5" /> Schedule Visit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Visits", value: stats.total, icon: Calendar, color: "text-foreground" },
          { label: "Scheduled", value: stats.scheduled, icon: Clock, color: "text-blue-600" },
          { label: "In Progress", value: stats.inProgress, icon: Truck, color: "text-amber-600" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600" },
        ].map((c) => (
          <div key={c.label} className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{c.label}</div>
              <div className={cn("text-xl font-bold", c.color)}>{c.value}</div>
            </div>
            <c.icon className="w-5 h-5 text-muted-foreground/40" />
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors..." className="h-8 pl-8 text-sm" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Upcoming Visits</h3>
          <div className="space-y-2">
            {upcoming.map((v) => <VisitCard key={v.id} visit={v} onUpdate={updateVisit.mutate} onDelete={deleteVisit.mutate} />)}
          </div>
        </div>
      )}

      {/* Other */}
      {rest.length > 0 && (
        <div>
          {upcoming.length > 0 && <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-4">All Visits</h3>}
          <div className="space-y-2">
            {rest.map((v) => <VisitCard key={v.id} visit={v} onUpdate={updateVisit.mutate} onDelete={deleteVisit.mutate} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-border rounded-lg bg-card">
          <Truck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-foreground">No vendor visits</h3>
          <p className="text-xs text-muted-foreground mt-1">Schedule a vendor visit to get started</p>
        </div>
      )}

      <AddVendorVisitDialog open={showAdd} onOpenChange={setShowAdd} onSubmit={(v) => addVisit.mutate(v)} />
    </div>
  );
}

function VisitCard({
  visit,
  onUpdate,
  onDelete,
}: {
  visit: VendorVisit;
  onUpdate: (args: { id: string; updates: Partial<VendorVisit> }) => void;
  onDelete: (id: string) => void;
}) {
  const dateStr = format(parseISO(visit.visit_date), "EEE d MMM yyyy");
  const endStr = visit.visit_end_date ? ` – ${format(parseISO(visit.visit_end_date), "EEE d MMM")}` : "";

  return (
    <div className="border border-border rounded-lg bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground truncate">{visit.vendor_name}</h4>
            <Badge variant="outline" className={cn("text-[10px] h-5", STATUS_STYLES[visit.status])}>
              {visit.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
            <Calendar className="w-3 h-3" /> {dateStr}{endStr}
          </p>
          {visit.purpose && <p className="text-xs text-foreground/80 mt-1">{visit.purpose}</p>}

          {/* Contact row */}
          <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
            {visit.contact_name && <span className="flex items-center gap-1"><Truck className="w-3 h-3" />{visit.contact_name}</span>}
            {visit.contact_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{visit.contact_phone}</span>}
            {visit.contact_email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{visit.contact_email}</span>}
          </div>

          {/* Forms */}
          {visit.forms_required.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {visit.forms_required.map((f) => (
                <Badge key={f} variant="secondary" className="text-[9px] h-4 gap-1">
                  <FileText className="w-2.5 h-2.5" />{f}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <Select
            value={visit.status}
            onValueChange={(s) => onUpdate({ id: visit.id, updates: { status: s } })}
          >
            <SelectTrigger className="h-7 w-28 text-[10px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(visit.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
