import { useState, useMemo } from "react";
import {
  ShieldAlert, Plus, Search, ChevronDown, ChevronRight, X, Check,
  AlertTriangle, Clock, FileText, Flame, Mountain, Lock, ArrowUpDown,
  Trash2, Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { usePermitsToWork, type PermitToWork } from "@/hooks/usePermitsToWork";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { format } from "date-fns";
import { toast } from "sonner";

const PERMIT_TYPES = ["General", "Hot Work", "Confined Space", "Isolation", "Working at Heights", "Excavation"];
const PERMIT_STATUSES = ["Draft", "Pending Approval", "Approved", "Active", "Closed", "Expired"];

const STATUS_COLORS: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  "Pending Approval": "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Active: "bg-emerald-100 text-emerald-800",
  Closed: "bg-gray-200 text-gray-600",
  Expired: "bg-red-100 text-red-700",
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  "Hot Work": Flame,
  "Confined Space": Mountain,
  Isolation: Lock,
  "Working at Heights": ArrowUpDown,
  General: FileText,
  Excavation: AlertTriangle,
};

const emptyPermit: Partial<PermitToWork> = {
  permit_type: "General",
  asset_number: "",
  area: "",
  location_detail: "",
  description: "",
  hazards: [],
  controls: [],
  ppe_required: [],
  isolation_required: false,
  hot_work: false,
  confined_space: false,
  working_at_heights: false,
  status: "Draft",
  issued_by: "",
  approved_by: "",
};

export function PlannerPermitsTab() {
  const { permits, isLoading, create, update, remove } = usePermitsToWork();
  const { workOrders } = useWorkOrders();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPermit, setEditingPermit] = useState<Partial<PermitToWork>>(emptyPermit);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newHazard, setNewHazard] = useState("");
  const [newControl, setNewControl] = useState("");

  const filtered = useMemo(() => {
    let items = permits;
    if (filterType !== "All") items = items.filter(p => p.permit_type === filterType);
    if (filterStatus !== "All") items = items.filter(p => p.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(p =>
        p.permit_number.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.asset_number.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q)
      );
    }
    return items;
  }, [permits, filterType, filterStatus, search]);

  const stats = useMemo(() => ({
    total: permits.length,
    active: permits.filter(p => p.status === "Active").length,
    pending: permits.filter(p => p.status === "Pending Approval").length,
    expired: permits.filter(p => p.status === "Expired").length,
  }), [permits]);

  const openNew = () => {
    setEditingPermit({ ...emptyPermit });
    setEditingId(null);
    setDialogOpen(true);
  };

  const openEdit = (p: PermitToWork) => {
    setEditingPermit({ ...p });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editingPermit.description) {
      toast.error("Description is required");
      return;
    }
    if (editingId) {
      update.mutate({ id: editingId, updates: editingPermit });
    } else {
      const num = `PTW-${String(permits.length + 1).padStart(4, "0")}`;
      create.mutate({ ...editingPermit, permit_number: num });
    }
    setDialogOpen(false);
  };

  const getWoLabel = (woId: string | null) => {
    if (!woId) return "—";
    const wo = workOrders.find(w => w.id === woId);
    return wo?.wo_number || "—";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Stats Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        {[
          { label: "Total Permits", value: stats.total, color: "text-foreground" },
          { label: "Active", value: stats.active, color: "text-emerald-600" },
          { label: "Pending", value: stats.pending, color: "text-amber-600" },
          { label: "Expired", value: stats.expired, color: "text-red-600" },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/40">
            <span className="text-[10px] text-muted-foreground">{s.label}</span>
            <span className={cn("text-sm font-bold", s.color)}>{s.value}</span>
          </div>
        ))}
        <div className="flex-1" />
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search permits..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 h-8 w-48 text-xs" />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {PERMIT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="h-8 w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            {PERMIT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={openNew}>
          <Plus className="w-3.5 h-3.5" /> New Permit
        </Button>
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted/60 z-10">
            <tr>
              {["Permit #", "Type", "Status", "Asset", "Area", "Description", "WO #", "Issued By", "Valid From", "Valid To", ""].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground border-b border-border whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const Icon = TYPE_ICONS[p.permit_type] || FileText;
              return (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 cursor-pointer" onClick={() => openEdit(p)}>
                  <td className="px-3 py-2 font-mono font-medium">{p.permit_number || "—"}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {p.permit_type}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge variant="outline" className={cn("text-[10px]", STATUS_COLORS[p.status])}>{p.status}</Badge>
                  </td>
                  <td className="px-3 py-2 font-mono">{p.asset_number || "—"}</td>
                  <td className="px-3 py-2">{p.area || "—"}</td>
                  <td className="px-3 py-2 max-w-[250px] truncate">{p.description}</td>
                  <td className="px-3 py-2 font-mono">{getWoLabel(p.work_order_id)}</td>
                  <td className="px-3 py-2">{p.issued_by || "—"}</td>
                  <td className="px-3 py-2">{p.valid_from ? format(new Date(p.valid_from), "dd MMM yy") : "—"}</td>
                  <td className="px-3 py-2">{p.valid_to ? format(new Date(p.valid_to), "dd MMM yy") : "—"}</td>
                  <td className="px-3 py-2">
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={e => { e.stopPropagation(); remove.mutate(p.id); }}>
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={11} className="text-center py-12 text-muted-foreground">No permits found</td></tr>
            )}
          </tbody>
        </table>
      </ScrollArea>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              {editingId ? "Edit Permit to Work" : "New Permit to Work"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Permit Type</Label>
              <Select value={editingPermit.permit_type || "General"} onValueChange={v => setEditingPermit(p => ({ ...p, permit_type: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERMIT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={editingPermit.status || "Draft"} onValueChange={v => setEditingPermit(p => ({ ...p, status: v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PERMIT_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Asset Number</Label>
              <Input className="h-8 text-xs" value={editingPermit.asset_number || ""} onChange={e => setEditingPermit(p => ({ ...p, asset_number: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Area</Label>
              <Input className="h-8 text-xs" value={editingPermit.area || ""} onChange={e => setEditingPermit(p => ({ ...p, area: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Linked Work Order</Label>
              <Select value={editingPermit.work_order_id || "none"} onValueChange={v => setEditingPermit(p => ({ ...p, work_order_id: v === "none" ? null : v }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {workOrders.slice(0, 50).map(wo => (
                    <SelectItem key={wo.id} value={wo.id}>{wo.wo_number}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Location Detail</Label>
              <Input className="h-8 text-xs" value={editingPermit.location_detail || ""} onChange={e => setEditingPermit(p => ({ ...p, location_detail: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Description</Label>
              <Textarea className="text-xs min-h-[60px]" value={editingPermit.description || ""} onChange={e => setEditingPermit(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Issued By</Label>
              <Input className="h-8 text-xs" value={editingPermit.issued_by || ""} onChange={e => setEditingPermit(p => ({ ...p, issued_by: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs">Approved By</Label>
              <Input className="h-8 text-xs" value={editingPermit.approved_by || ""} onChange={e => setEditingPermit(p => ({ ...p, approved_by: e.target.value }))} />
            </div>

            {/* Risk flags */}
            <div className="col-span-2 flex gap-6 py-2">
              {[
                { key: "isolation_required", label: "Isolation Required" },
                { key: "hot_work", label: "Hot Work" },
                { key: "confined_space", label: "Confined Space" },
                { key: "working_at_heights", label: "Working at Heights" },
              ].map(f => (
                <div key={f.key} className="flex items-center gap-2">
                  <Checkbox
                    checked={!!(editingPermit as any)[f.key]}
                    onCheckedChange={v => setEditingPermit(p => ({ ...p, [f.key]: v }))}
                  />
                  <Label className="text-xs">{f.label}</Label>
                </div>
              ))}
            </div>

            {/* Hazards */}
            <div className="col-span-2">
              <Label className="text-xs">Hazards</Label>
              <div className="flex flex-wrap gap-1 mt-1 mb-1">
                {((editingPermit.hazards as string[]) || []).map((h, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] gap-1">
                    {h}
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setEditingPermit(p => ({ ...p, hazards: ((p.hazards as string[]) || []).filter((_, j) => j !== i) }))} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1">
                <Input className="h-7 text-xs flex-1" placeholder="Add hazard..." value={newHazard} onChange={e => setNewHazard(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newHazard.trim()) { setEditingPermit(p => ({ ...p, hazards: [...((p.hazards as string[]) || []), newHazard.trim()] })); setNewHazard(""); } }} />
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { if (newHazard.trim()) { setEditingPermit(p => ({ ...p, hazards: [...((p.hazards as string[]) || []), newHazard.trim()] })); setNewHazard(""); } }}>Add</Button>
              </div>
            </div>

            {/* Controls */}
            <div className="col-span-2">
              <Label className="text-xs">Controls</Label>
              <div className="flex flex-wrap gap-1 mt-1 mb-1">
                {((editingPermit.controls as string[]) || []).map((c, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] gap-1">
                    {c}
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setEditingPermit(p => ({ ...p, controls: ((p.controls as string[]) || []).filter((_, j) => j !== i) }))} />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-1">
                <Input className="h-7 text-xs flex-1" placeholder="Add control..." value={newControl} onChange={e => setNewControl(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newControl.trim()) { setEditingPermit(p => ({ ...p, controls: [...((p.controls as string[]) || []), newControl.trim()] })); setNewControl(""); } }} />
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { if (newControl.trim()) { setEditingPermit(p => ({ ...p, controls: [...((p.controls as string[]) || []), newControl.trim()] })); setNewControl(""); } }}>Add</Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? "Save Changes" : "Create Permit"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
