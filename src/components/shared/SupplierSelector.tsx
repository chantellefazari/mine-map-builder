import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Users, Send, Plus, Loader2, FlaskConical } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { usePracticeSuppliers } from "@/hooks/usePracticeSuppliers";
import { useSupplierMatching, type MatchedSupplier } from "@/hooks/useSupplierMatching";
import { useQuoteRequests } from "@/hooks/useQuoteRequests";
import { toast } from "sonner";

const NONE_VALUE = "__none__";

interface SupplierSelectorProps {
  category: string | null | undefined;
  currentPreferredSupplier: string | null | undefined;
  onSelectSupplier: (supplierName: string) => void;
  /** Part details for RFQ */
  spareId?: string;
  partDescription?: string;
  partNumber?: string;
  imageUrl?: string;
  quantity?: number;
  specifications?: string;
  /** When true, uses practice suppliers instead of real ones */
  practiceMode?: boolean;
}

export const SupplierSelector = ({
  category,
  currentPreferredSupplier,
  onSelectSupplier,
  spareId,
  partDescription,
  partNumber,
  imageUrl,
  quantity,
  specifications,
  practiceMode = false,
}: SupplierSelectorProps) => {
  const { suppliers: realSuppliers, isLoading: realLoading } = useSuppliers();
  const { suppliers: practiceSuppliersList, isLoading: practiceLoading } = usePracticeSuppliers();

  const activeSuppliers = practiceMode ? practiceSuppliersList : realSuppliers;
  const isLoading = practiceMode ? practiceLoading : realLoading;

  const matchedSuppliers = useSupplierMatching(activeSuppliers, category, currentPreferredSupplier);
  const { sendQuoteRequest } = useQuoteRequests(spareId);

  const [showManualDialog, setShowManualDialog] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleRequestQuote = async (supplierName?: string, supplierEmail?: string, supplierId?: string) => {
    if (!partDescription) {
      toast.error("Part description is required to send a quote request");
      return;
    }

    const emailToUse = supplierEmail || activeSuppliers.find(s => s.name === supplierName)?.email || "";
    if (!emailToUse) {
      toast.error("No email found for this supplier. Use manual entry.");
      return;
    }

    setSending(true);
    try {
      await sendQuoteRequest.mutateAsync({
        spare_id: spareId,
        part_description: partDescription,
        part_number: partNumber || "",
        image_url: imageUrl || "",
        quantity: quantity || 1,
        specifications: specifications || "",
        supplier_name: supplierName || "",
        supplier_email: emailToUse,
        supplier_id: supplierId,
      });
      toast.success(`Quote request sent to ${supplierName || emailToUse}`);
    } catch {
      // error handled by hook
    } finally {
      setSending(false);
    }
  };

  const handleManualSend = async () => {
    if (!manualEmail) {
      toast.error("Email address is required");
      return;
    }
    await handleRequestQuote(manualName, manualEmail);
    setShowManualDialog(false);
    setManualName("");
    setManualEmail("");
  };

  const hasMatchedSuppliers = matchedSuppliers.length > 0;

  return (
    <div className="space-y-2">
      {practiceMode && (
        <div className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 flex items-center gap-1">
          <FlaskConical className="h-3 w-3 shrink-0" />
          Using practice suppliers — emails go to demo addresses only.
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1">
          <Users className="h-3 w-3" />
          Available Suppliers
        </Label>
        {hasMatchedSuppliers && (
          <Badge variant="secondary" className="text-[10px]">
            {matchedSuppliers.length} match{matchedSuppliers.length !== 1 ? "es" : ""}
          </Badge>
        )}
      </div>

      {hasMatchedSuppliers ? (
        <Select
          value={currentPreferredSupplier || NONE_VALUE}
          onValueChange={(val) => onSelectSupplier(val === NONE_VALUE ? "" : val)}
        >
          <SelectTrigger className="h-auto min-h-[2.25rem] text-sm whitespace-normal text-left py-1.5">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              <span className="text-muted-foreground">— No preferred supplier —</span>
            </SelectItem>
            {matchedSuppliers.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="break-words">{s.name}</span>
                  {s.isPreferredForPart && (
                    <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 text-[9px] px-1 py-0">
                      Preferred
                    </Badge>
                  )}
                  {s.isPreferred && !s.isPreferredForPart && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0">
                      Approved
                    </Badge>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-[11px] text-muted-foreground italic">
          {isLoading
            ? "Loading suppliers..."
            : category
              ? `No suppliers registered for "${category}" category`
              : "Set a category to see matching suppliers"}
        </p>
      )}

      {/* Request Quote to ALL matching suppliers */}
      {hasMatchedSuppliers ? (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={async () => {
            if (!partDescription) return;
            setSending(true);
            let sentCount = 0;
            try {
              for (const s of matchedSuppliers) {
                if (!s.email) continue;
                await sendQuoteRequest.mutateAsync({
                  spare_id: spareId,
                  part_description: partDescription,
                  part_number: partNumber || "",
                  image_url: imageUrl || "",
                  quantity: quantity || 1,
                  specifications: specifications || "",
                  supplier_name: s.name,
                  supplier_email: s.email,
                  supplier_id: s.id,
                });
                sentCount++;
              }
              toast.success(`Quote requests sent to ${sentCount} supplier${sentCount !== 1 ? "s" : ""}`);
            } catch {
              if (sentCount > 0) {
                toast.warning(`Sent to ${sentCount} suppliers before an error occurred`);
              }
            } finally {
              setSending(false);
            }
          }}
          disabled={sending || !partDescription}
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5 mr-1.5" />
          )}
          Request Quote from All ({matchedSuppliers.length})
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs"
          onClick={() => setShowManualDialog(true)}
          disabled={!partDescription}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Enter Supplier & Request Quote
        </Button>
      )}

      {/* Manual supplier entry - always available as fallback */}
      {hasMatchedSuppliers && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-[10px] text-muted-foreground"
          onClick={() => setShowManualDialog(true)}
          disabled={!partDescription}
        >
          <Plus className="h-3 w-3 mr-1" />
          Send to unlisted supplier
        </Button>
      )}

      {/* Manual Supplier Dialog */}
      <Dialog open={showManualDialog} onOpenChange={setShowManualDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Send Quote Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Supplier Name</Label>
              <Input
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="e.g. ABC Supplies"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Supplier Email *</Label>
              <Input
                type="email"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                placeholder="supplier@example.com"
                className="h-8 text-sm"
              />
            </div>
            <div className="rounded-md bg-muted p-2 text-[11px] space-y-0.5">
              <p className="font-medium">Part Details:</p>
              <p>{partDescription || "—"}</p>
              {partNumber && <p>P/N: {partNumber}</p>}
              {quantity && <p>Qty: {quantity}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowManualDialog(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleManualSend} disabled={sending || !manualEmail}>
              {sending ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
              Send Quote Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};