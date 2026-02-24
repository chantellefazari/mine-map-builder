import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { PRLineItem } from "@/hooks/usePurchaseRequests";

interface Props {
  lines: PRLineItem[];
  onChange: (lines: PRLineItem[]) => void;
  readOnly?: boolean;
}

export const PRLineItemsTable: React.FC<Props> = ({ lines, onChange, readOnly }) => {
  const addLine = () => {
    onChange([...lines, { part_description: "", quantity: 1, estimated_cost: 0, gl_code: "", sort_order: lines.length }]);
  };

  const updateLine = (index: number, field: keyof PRLineItem, value: string | number) => {
    const updated = [...lines];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  const removeLine = (index: number) => {
    onChange(lines.filter((_, i) => i !== index));
  };

  const total = lines.reduce((sum, l) => sum + (l.quantity * l.estimated_cost), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
        {!readOnly && (
          <Button type="button" variant="outline" size="sm" onClick={addLine} className="gap-1">
            <Plus className="h-3 w-3" /> Add Line
          </Button>
        )}
      </div>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-8">#</TableHead>
              <TableHead>Part Description</TableHead>
              <TableHead className="w-24">Qty</TableHead>
              <TableHead className="w-32">Est. Cost ($)</TableHead>
              <TableHead className="w-28">GL Code</TableHead>
              <TableHead className="w-28 text-right">Line Total</TableHead>
              {!readOnly && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={readOnly ? 6 : 7} className="text-center text-muted-foreground py-6">
                  No line items added yet
                </TableCell>
              </TableRow>
            ) : (
              lines.map((line, i) => (
                <TableRow key={i}>
                  <TableCell className="text-muted-foreground text-xs">{i + 1}</TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-sm">{line.part_description}</span>
                    ) : (
                      <Input
                        value={line.part_description}
                        onChange={(e) => updateLine(i, "part_description", e.target.value)}
                        placeholder="Describe part or material..."
                        className="h-8 text-sm"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-sm">{line.quantity}</span>
                    ) : (
                      <Input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateLine(i, "quantity", Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-sm">${line.estimated_cost.toFixed(2)}</span>
                    ) : (
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={line.estimated_cost}
                        onChange={(e) => updateLine(i, "estimated_cost", Number(e.target.value))}
                        className="h-8 text-sm"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {readOnly ? (
                      <span className="text-sm font-mono">{line.gl_code || "—"}</span>
                    ) : (
                      <Input
                        value={line.gl_code}
                        onChange={(e) => updateLine(i, "gl_code", e.target.value)}
                        placeholder="GL..."
                        className="h-8 text-sm font-mono"
                      />
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm">
                    ${(line.quantity * line.estimated_cost).toFixed(2)}
                  </TableCell>
                  {!readOnly && (
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeLine(i)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
            {lines.length > 0 && (
              <TableRow className="bg-muted/30">
                <TableCell colSpan={5} className="text-right font-semibold text-sm">
                  Total Estimated Cost:
                </TableCell>
                <TableCell className="text-right font-bold text-sm">
                  ${total.toFixed(2)}
                </TableCell>
                {!readOnly && <TableCell />}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
