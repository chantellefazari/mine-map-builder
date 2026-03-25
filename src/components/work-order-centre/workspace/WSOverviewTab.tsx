import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WRAssetSearch } from "../WRAssetSearch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { WorkOrder } from "@/hooks/useWorkOrders";

interface Props {
  wo: WorkOrder;
  onUpdate: (updates: Partial<WorkOrder>) => void;
}

export function WSOverviewTab({ wo, onUpdate }: Props) {
  const [local, setLocal] = useState({
    problem_description: wo.problem_description || "",
    work_performed: wo.work_performed || "",
    asset_id: wo.asset_id || "",
    functional_location: wo.functional_location || "",
    priority: wo.priority || "Normal",
    work_type: wo.work_type || "Planned",
    trade: wo.trade || "",
    requested_by: wo.requested_by || "",
    assigned_to: wo.assigned_to || "",
  });

  useEffect(() => {
    setLocal({
      problem_description: wo.problem_description || "",
      work_performed: wo.work_performed || "",
      asset_id: wo.asset_id || "",
      functional_location: wo.functional_location || "",
      priority: wo.priority || "Normal",
      work_type: wo.work_type || "Planned",
      trade: wo.trade || "",
      requested_by: wo.requested_by || "",
      assigned_to: wo.assigned_to || "",
    });
  }, [wo.id]);

  const save = (field: string, value: any) => {
    setLocal((l) => ({ ...l, [field]: value }));
    onUpdate({ [field]: value });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Asset Number</Label>
          <Input value={local.asset_id} onBlur={(e) => save("asset_id", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, asset_id: e.target.value }))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Area / Functional Location</Label>
          <Input value={local.functional_location} onBlur={(e) => save("functional_location", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, functional_location: e.target.value }))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Priority</Label>
          <Select value={local.priority} onValueChange={(v) => save("priority", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Low", "Normal", "High", "Critical", "Emergency"].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Work Order Type</Label>
          <Select value={local.work_type} onValueChange={(v) => save("work_type", v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Breakdown", "Planned", "Shutdown"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Trade</Label>
          <Select value={local.trade || "none"} onValueChange={(v) => save("trade", v === "none" ? "" : v)}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">-</SelectItem>
              {["Mechanical", "Electrical", "Instrumentation", "Boilermaker", "General"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold">Requested By</Label>
          <Input value={local.requested_by} onBlur={(e) => save("requested_by", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, requested_by: e.target.value }))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1.5 col-span-2 lg:col-span-1">
          <Label className="text-xs font-semibold">Planner / Supervisor</Label>
          <Input value={local.assigned_to} onBlur={(e) => save("assigned_to", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, assigned_to: e.target.value }))} className="h-9 text-sm" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Description / Problem Statement</Label>
        <Textarea value={local.problem_description} onBlur={(e) => save("problem_description", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, problem_description: e.target.value }))} rows={4} className="text-sm" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold">Scope of Works / Notes</Label>
        <Textarea value={local.work_performed} onBlur={(e) => save("work_performed", e.target.value)} onChange={(e) => setLocal((l) => ({ ...l, work_performed: e.target.value }))} rows={4} className="text-sm" placeholder="Detail the scope, method, and requirements..." />
      </div>
    </div>
  );
}
