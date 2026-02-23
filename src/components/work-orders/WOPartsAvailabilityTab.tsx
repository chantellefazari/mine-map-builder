import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Search } from "lucide-react";
import { WorkOrderPart, PART_STATUSES, useWorkOrderParts } from "@/hooks/useWorkOrderParts";
import { SparePartLookupDialog } from "@/components/po-tracker/SparePartLookupDialog";
import { format } from "date-fns";

interface WOPartsAvailabilityTabProps {
  workOrderId: string;
  parts: WorkOrderPart[];
  addPart: ReturnType<typeof useWorkOrderParts>["addPart"];
  updatePart: ReturnType<typeof useWorkOrderParts>["updatePart"];
  deletePart: ReturnType<typeof useWorkOrderParts>["deletePart"];
}

export const WOPartsAvailabilityTab = ({ workOrderId, parts, addPart, updatePart, deletePart }: WOPartsAvailabilityTabProps) => {
  const [lookupIdx, setLookupIdx] = useState<number | null>(null);

  const handleAdd = () => {
    addPart.mutate({
      work_order_id: workOrderId,
      part_description: "",
      part_number: "",
      quantity_required: 1,
      status: "Not Ordered",
      location: "",
      comment: "",
      last_updated_by: "System",
    });
  };

  const handleUpdate = (part: WorkOrderPart, field: keyof WorkOrderPart, value: any) => {
    updatePart.mutate({
      id: part.id,
      updates: { [field]: value, last_updated_by: "System" },
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{parts.length} part(s) tracked</p>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={handleAdd}>
          <Plus className="h-3 w-3" /> Add Part
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs w-[200px]">Part Description</TableHead>
              <TableHead className="text-xs w-[130px]">Part Number</TableHead>
              <TableHead className="text-xs w-[60px]">Qty</TableHead>
              <TableHead className="text-xs w-[140px]">Status</TableHead>
              <TableHead className="text-xs w-[120px]">Location</TableHead>
              <TableHead className="text-xs w-[100px]">Updated By</TableHead>
              <TableHead className="text-xs w-[100px]">Updated</TableHead>
              <TableHead className="text-xs w-[150px]">Comment</TableHead>
              <TableHead className="text-xs w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-xs text-muted-foreground py-6">
                  No parts added. Click "Add Part" to begin.
                </TableCell>
              </TableRow>
            ) : (
              parts.map((part, idx) => (
                <TableRow key={part.id}>
                  <TableCell className="p-1">
                    <Input
                      className="h-8 text-xs"
                      defaultValue={part.part_description}
                      onBlur={(e) => {
                        if (e.target.value !== part.part_description) handleUpdate(part, "part_description", e.target.value);
                      }}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className="flex gap-1">
                      <Input
                        className="h-8 text-xs flex-1"
                        defaultValue={part.part_number}
                        onBlur={(e) => {
                          if (e.target.value !== part.part_number) handleUpdate(part, "part_number", e.target.value);
                        }}
                      />
                      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => setLookupIdx(idx)}>
                        <Search className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      type="number"
                      className="h-8 text-xs w-14"
                      defaultValue={part.quantity_required}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        if (val !== part.quantity_required) handleUpdate(part, "quantity_required", val);
                      }}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Select
                      value={part.status}
                      onValueChange={(v) => handleUpdate(part, "status", v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PART_STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      className="h-8 text-xs"
                      defaultValue={part.location}
                      onBlur={(e) => {
                        if (e.target.value !== part.location) handleUpdate(part, "location", e.target.value);
                      }}
                    />
                  </TableCell>
                  <TableCell className="p-1 text-xs text-muted-foreground">{part.last_updated_by || "—"}</TableCell>
                  <TableCell className="p-1 text-xs text-muted-foreground">
                    {part.last_updated_date ? format(new Date(part.last_updated_date), "dd/MM HH:mm") : "—"}
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      className="h-8 text-xs"
                      defaultValue={part.comment}
                      onBlur={(e) => {
                        if (e.target.value !== part.comment) handleUpdate(part, "comment", e.target.value);
                      }}
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deletePart.mutate(part.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {lookupIdx !== null && (
        <SparePartLookupDialog
          open={true}
          onOpenChange={() => setLookupIdx(null)}
          onSelect={(spare) => {
            const part = parts[lookupIdx];
            if (part) {
              updatePart.mutate({
                id: part.id,
                updates: {
                  part_number: spare.part_number || "",
                  part_description: spare.description || "",
                  last_updated_by: "System",
                },
              });
            }
            setLookupIdx(null);
          }}
        />
      )}
    </div>
  );
};
