import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { usePurchaseRequests, PRLineItem } from "@/hooks/usePurchaseRequests";
import { useWorkOrders } from "@/hooks/useWorkOrders";
import { useSuppliers } from "@/hooks/useSuppliers";
import { PRLineItemsTable } from "./PRLineItemsTable";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkedWoId?: string;
}

const PRIORITIES = ["Routine", "Urgent", "Breakdown"];

export const CreatePRDialog: React.FC<Props> = ({ open, onOpenChange, linkedWoId }) => {
  const { user } = useAuth();
  const { generatePRNumber, createPR } = usePurchaseRequests();
  const { workOrders } = useWorkOrders();
  const { suppliers } = useSuppliers();

  const [prNumber, setPrNumber] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [workOrderId, setWorkOrderId] = useState(linkedWoId || "");
  const [supplierId, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierFreeText, setSupplierFreeText] = useState("");
  const [priority, setPriority] = useState("Routine");
  const [descriptionScope, setDescriptionScope] = useState("");
  const [requiredDate, setRequiredDate] = useState<Date | undefined>();
  const [comments, setComments] = useState("");
  const [lines, setLines] = useState<PRLineItem[]>([
    { part_description: "", quantity: 1, estimated_cost: 0, gl_code: "", sort_order: 0 },
  ]);
  const [quoteFile, setQuoteFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      generatePRNumber().then(setPrNumber).catch(() => setPrNumber("PR-00001"));
      if (linkedWoId) setWorkOrderId(linkedWoId);
    }
  }, [open]);

  const handleSupplierChange = (id: string) => {
    if (id === "__freetext__") {
      setSupplierId("");
      setSupplierName("");
      return;
    }
    setSupplierId(id);
    const s = suppliers?.find((s) => s.id === id);
    if (s) {
      setSupplierName(s.name);
      setSupplierFreeText("");
    }
  };

  const resolvedSupplierName = supplierId ? supplierName : supplierFreeText;

  const uploadQuote = async (): Promise<string> => {
    if (!quoteFile) return "";
    const path = `${prNumber}/${quoteFile.name}`;
    const { error } = await supabase.storage.from("pr-quotes").upload(path, quoteFile, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("pr-quotes").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async (submitToAdmin: boolean) => {
    if (!prNumber) return;
    if (!requestTitle.trim()) {
      toast.error("Request Title is required");
      return;
    }
    if (submitToAdmin && !quoteFile) {
      toast.error("Quote attachment is required for submission");
      return;
    }
    setSaving(true);
    try {
      let quoteUrl = "";
      if (quoteFile) quoteUrl = await uploadQuote();

      await createPR.mutateAsync({
        pr_number: prNumber,
        request_title: requestTitle,
        description_scope: descriptionScope,
        priority,
        work_order_id: workOrderId || null,
        status: submitToAdmin ? "Submitted to Admin" : "Draft",
        supervisor_name: user?.email ?? "",
        supervisor_user_id: user?.id ?? null,
        created_by: user?.email ?? "",
        last_updated_by: user?.email ?? "",
        department: "",
        supplier_id: supplierId || null,
        supplier_name: resolvedSupplierName,
        supplier_organises_freight: false,
        freight_company: "",
        delivery_address: "",
        required_date: requiredDate ? format(requiredDate, "yyyy-MM-dd") : null,
        quote_url: quoteUrl,
        comments,
        submitted_at: submitToAdmin ? new Date().toISOString() : null,
        lines,
      } as any);

      toast.success(submitToAdmin ? "PR submitted to Admin" : "PR saved as Draft");
      onOpenChange(false);
    } catch (e: any) {
      toast.error("Failed to save PR: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Create Purchase Request
            <span className="text-sm font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{prNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Request Title */}
          <div className="space-y-1.5">
            <Label className="text-xs">Request Title *</Label>
            <Input value={requestTitle} onChange={(e) => setRequestTitle(e.target.value)} placeholder="Brief title for this purchase request" className="text-sm" />
          </div>

          {/* Supplier + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Supplier</Label>
              <Select value={supplierId || "__freetext__"} onValueChange={handleSupplierChange}>
                <SelectTrigger><SelectValue placeholder="Select or type below" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__freetext__">Manual Entry</SelectItem>
                  {suppliers?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!supplierId && (
                <Input
                  value={supplierFreeText}
                  onChange={(e) => setSupplierFreeText(e.target.value)}
                  placeholder="Type supplier name"
                  className="text-sm mt-1.5"
                />
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Linked WO + Required Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Linked Work Order (optional)</Label>
              <Select value={workOrderId || "__none__"} onValueChange={(v) => setWorkOrderId(v === "__none__" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="None — Standalone PR" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None — Standalone PR</SelectItem>
                  {workOrders?.map((wo) => (
                    <SelectItem key={wo.id} value={wo.id}>{wo.wo_number} — {wo.problem_description?.slice(0, 40)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Required-by Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {requiredDate ? format(requiredDate, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={requiredDate} onSelect={setRequiredDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Description / Scope */}
          <div className="space-y-1.5">
            <Label className="text-xs">Description / Scope</Label>
            <Textarea value={descriptionScope} onChange={(e) => setDescriptionScope(e.target.value)} placeholder="Describe what is needed and why..." rows={3} className="text-sm" />
          </div>

          {/* Quote Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs">Quote Attachment (PDF) — required for submission</Label>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer border border-dashed rounded-lg px-4 py-2 hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                <Upload className="h-4 w-4" />
                {quoteFile ? quoteFile.name : "Choose file..."}
                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setQuoteFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>

          {/* Line Items */}
          <PRLineItemsTable lines={lines} onChange={setLines} />

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs">Notes</Label>
            <Textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Any additional notes..." rows={2} className="text-sm" />
          </div>

          {/* Submitted By (auto) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Submitted By (auto)</Label>
              <Input value={user?.email ?? ""} readOnly className="bg-muted/50 text-sm" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button variant="secondary" onClick={() => handleSave(false)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Save Draft
            </Button>
            <Button onClick={() => handleSave(true)} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Submit to Admin
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
