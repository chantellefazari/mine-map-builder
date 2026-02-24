import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

const DEPARTMENTS = ["Maintenance", "Processing", "Mining", "Admin", "Safety", "Environment"];

export const CreatePRDialog: React.FC<Props> = ({ open, onOpenChange, linkedWoId }) => {
  const { user } = useAuth();
  const { generatePRNumber, createPR } = usePurchaseRequests();
  const { workOrders } = useWorkOrders();
  const { suppliers } = useSuppliers();

  const [prNumber, setPrNumber] = useState("");
  const [workOrderId, setWorkOrderId] = useState(linkedWoId || "");
  const [department, setDepartment] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierOrganisesFreight, setSupplierOrganisesFreight] = useState(false);
  const [freightCompany, setFreightCompany] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("TCMG – Tennant Creek Gold Mine, NT 0861");
  const [supplierAbn, setSupplierAbn] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
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
    setSupplierId(id);
    const s = suppliers?.find((s) => s.id === id);
    if (s) {
      setSupplierName(s.name);
      setSupplierOrganisesFreight(s.organisesFreight);
      setSupplierAbn(s.abn);
      setPaymentTerms(s.paymentTerms);
      if (s.defaultDeliveryAddress) setDeliveryAddress(s.defaultDeliveryAddress);
      if (!s.organisesFreight && s.preferredFreightCompany) setFreightCompany(s.preferredFreightCompany);
      else setFreightCompany("");
    }
  };

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
    setSaving(true);
    try {
      let quoteUrl = "";
      if (quoteFile) quoteUrl = await uploadQuote();

      await createPR.mutateAsync({
        pr_number: prNumber,
        work_order_id: workOrderId || null,
        status: submitToAdmin ? "Submitted to Admin" : "Draft",
        supervisor_name: user?.email ?? "",
        supervisor_user_id: user?.id ?? null,
        department,
        supplier_id: supplierId || null,
        supplier_name: supplierName,
        supplier_organises_freight: supplierOrganisesFreight,
        freight_company: freightCompany,
        delivery_address: deliveryAddress,
        required_date: requiredDate ? format(requiredDate, "yyyy-MM-dd") : null,
        quote_url: quoteUrl,
        comments,
        supplier_abn: supplierAbn,
        payment_terms: paymentTerms,
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
          {/* Row 1: WO Link + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Linked Work Order (optional)</Label>
              <Select value={workOrderId} onValueChange={setWorkOrderId}>
                <SelectTrigger><SelectValue placeholder="None — Standalone PR" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None — Standalone PR</SelectItem>
                  {workOrders?.map((wo) => (
                    <SelectItem key={wo.id} value={wo.id}>{wo.wo_number} — {wo.problem_description?.slice(0, 40)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Supervisor (auto) */}
          <div className="space-y-1.5">
            <Label className="text-xs">Supervisor</Label>
            <Input value={user?.email ?? ""} readOnly className="bg-muted/50 text-sm" />
          </div>

          {/* Row 3: Supplier + Freight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Supplier</Label>
              <Select value={supplierId} onValueChange={handleSupplierChange}>
                <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                <SelectContent>
                  {suppliers?.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Supplier Organises Freight?</Label>
              <div className="flex items-center gap-2 pt-1">
                <Switch checked={supplierOrganisesFreight} onCheckedChange={setSupplierOrganisesFreight} />
                <span className="text-sm text-muted-foreground">{supplierOrganisesFreight ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>

          {/* Row 4: Delivery + Required Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Delivery Address</Label>
              <Input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Required Date</Label>
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

          {/* Quote Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs">Quote Attachment (PDF)</Label>
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

          {/* Comments */}
          <div className="space-y-1.5">
            <Label className="text-xs">Comments</Label>
            <Textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Any additional notes..." rows={3} className="text-sm" />
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
