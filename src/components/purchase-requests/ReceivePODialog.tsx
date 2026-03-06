import React, { useState, useEffect } from "react";
import { PackageCheck, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { POTrackerItem, POLineItem } from "@/hooks/usePOTracker";

interface Props {
  po: POTrackerItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LineReceiveState {
  id: string;
  part_description: string;
  part_number: string;
  quantity_ordered: number;
  previously_received: number;
  receiving_now: number;
  unit_price: number;
}

export const ReceivePODialog: React.FC<Props> = ({ po, open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const [lines, setLines] = useState<LineReceiveState[]>([]);
  const [receivedBy, setReceivedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (po?.lines) {
      setLines(
        po.lines.map((l) => ({
          id: l.id || "",
          part_description: l.part_description,
          part_number: l.part_number,
          quantity_ordered: l.quantity_ordered,
          previously_received: l.received_qty || 0,
          receiving_now: 0,
          unit_price: l.unit_price,
        }))
      );
    }
  }, [po]);

  const updateLineQty = (index: number, value: number) => {
    setLines((prev) =>
      prev.map((l, i) =>
        i === index
          ? { ...l, receiving_now: Math.max(0, Math.min(value, l.quantity_ordered - l.previously_received)) }
          : l
      )
    );
  };

  const totalReceivingNow = lines.reduce((s, l) => s + l.receiving_now, 0);

  const handleSubmit = async () => {
    if (totalReceivingNow === 0) {
      toast.error("Enter at least one qty to receive");
      return;
    }
    if (!receivedBy.trim()) {
      toast.error("Enter who received the parts");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update each po_tracker_line received_qty
      for (const line of lines) {
        if (line.receiving_now <= 0 || !line.id) continue;
        const newReceivedQty = line.previously_received + line.receiving_now;
        await (supabase as any)
          .from("po_tracker_lines")
          .update({ received_qty: newReceivedQty })
          .eq("id", line.id);
      }

      // 2. Determine PO status
      const allFullyReceived = lines.every(
        (l) => l.previously_received + l.receiving_now >= l.quantity_ordered
      );
      const newStatus = allFullyReceived ? "Received Complete" : "Received Partial";

      // 3. Update PO header
      const updates: any = {
        status: newStatus,
        received_by: receivedBy.trim(),
        date_received: new Date().toISOString().split("T")[0],
        confirmed_on_site: allFullyReceived,
      };
      await (supabase as any)
        .from("po_tracker")
        .update(updates)
        .eq("id", po!.id);

      // 4. Auto-update site_spares stock
      let stockUpdated = 0;
      let stockCreated = 0;

      for (const line of lines) {
        if (line.receiving_now <= 0) continue;
        if (!line.part_number && !line.part_description) continue;

        // Try to find matching spare by part_number first
        let matched = false;
        if (line.part_number) {
          const { data: existing } = await (supabase as any)
            .from("site_spares")
            .select("id, qty_on_hand")
            .eq("part_number", line.part_number)
            .limit(1);

          if (existing && existing.length > 0) {
            const newQty = (existing[0].qty_on_hand || 0) + line.receiving_now;
            await (supabase as any)
              .from("site_spares")
              .update({
                qty_on_hand: newQty,
                last_purchase_date: new Date().toISOString().split("T")[0],
                unit_cost: line.unit_price || undefined,
              })
              .eq("id", existing[0].id);
            stockUpdated++;
            matched = true;
          }
        }

        // If no match, create new spare record
        if (!matched) {
          await (supabase as any)
            .from("site_spares")
            .insert({
              part_number: line.part_number || "",
              description: line.part_description || "Received from PO",
              qty_on_hand: line.receiving_now,
              unit_cost: line.unit_price || 0,
              preferred_supplier: po!.supplier || "",
              last_purchase_date: new Date().toISOString().split("T")[0],
              notes: `Auto-created from ${po!.po_number}`,
              status: "Active",
            });
          stockCreated++;
        }
      }

      // 5. Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["po_tracker"] });
      queryClient.invalidateQueries({ queryKey: ["site_spares"] });

      const stockMsg = [
        stockUpdated > 0 ? `${stockUpdated} existing spare(s) updated` : "",
        stockCreated > 0 ? `${stockCreated} new spare(s) created` : "",
      ]
        .filter(Boolean)
        .join(", ");

      toast.success(`${po!.po_number} marked as ${newStatus}${stockMsg ? ` — ${stockMsg}` : ""}`);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to process receiving");
    } finally {
      setSubmitting(false);
    }
  };

  if (!po) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <PackageCheck className="h-4 w-4" /> Receive Parts — {po.po_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* PO Summary */}
          <div className="rounded-lg border bg-muted/30 p-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">Supplier:</span> {po.supplier}
            </div>
            <div>
              <span className="font-semibold">Description:</span> {po.description || "—"}
            </div>
          </div>

          {/* Part image */}
          {po.image_url && (
            <div className="flex justify-center">
              <img
                src={po.image_url}
                alt="Part"
                className="rounded-md border max-h-28 object-contain bg-white"
              />
            </div>
          )}

          <Separator />

          {/* Line items receiving table */}
          {lines.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-6">
              <AlertTriangle className="h-5 w-5 mx-auto mb-2 opacity-50" />
              No line items on this PO
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">Part Description</TableHead>
                  <TableHead className="text-xs">Part #</TableHead>
                  <TableHead className="text-xs text-center">Ordered</TableHead>
                  <TableHead className="text-xs text-center">Previously Received</TableHead>
                  <TableHead className="text-xs text-center">Receiving Now</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, i) => {
                  const remaining = line.quantity_ordered - line.previously_received;
                  const fullyReceived = remaining <= 0;
                  return (
                    <TableRow
                      key={line.id || i}
                      className={fullyReceived ? "opacity-50" : ""}
                    >
                      <TableCell className="text-xs">{line.part_description}</TableCell>
                      <TableCell className="text-xs font-mono">{line.part_number || "—"}</TableCell>
                      <TableCell className="text-xs text-center">{line.quantity_ordered}</TableCell>
                      <TableCell className="text-xs text-center">
                        {line.previously_received > 0 ? (
                          <Badge variant="outline" className="text-[10px]">
                            {line.previously_received}
                          </Badge>
                        ) : (
                          "0"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {fullyReceived ? (
                          <Badge className="bg-emerald-500/20 text-emerald-700 border-emerald-500/30 text-[10px] gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Complete
                          </Badge>
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            max={remaining}
                            value={line.receiving_now || ""}
                            onChange={(e) => updateLineQty(i, Number(e.target.value))}
                            className="h-7 w-16 text-xs text-center mx-auto"
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Received by */}
          <div className="flex items-center gap-3">
            <Label className="text-sm font-semibold shrink-0">Received By:</Label>
            <Input
              placeholder="Name of person receiving"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="max-w-xs"
            />
          </div>

          {/* Stock update notice */}
          {totalReceivingNow > 0 && (
            <div className="rounded-md bg-primary/5 border border-primary/20 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">📦 Stock Auto-Update:</span>{" "}
              Receiving {totalReceivingNow} item(s) will automatically update the Site Spares
              Catalogue. Matching parts will have their stock increased. New parts will be
              created automatically.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || totalReceivingNow === 0}
            className="gap-1.5"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PackageCheck className="h-4 w-4" />
            )}
            Confirm Receipt ({totalReceivingNow} items)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
