import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Users } from "lucide-react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useSupplierMatching, type MatchedSupplier } from "@/hooks/useSupplierMatching";
import { toast } from "sonner";

const NONE_VALUE = "__none__";

interface SupplierSelectorProps {
  category: string | null | undefined;
  currentPreferredSupplier: string | null | undefined;
  onSelectSupplier: (supplierName: string) => void;
}

export const SupplierSelector = ({
  category,
  currentPreferredSupplier,
  onSelectSupplier,
}: SupplierSelectorProps) => {
  const { suppliers, isLoading } = useSuppliers();
  const matchedSuppliers = useSupplierMatching(suppliers, category, currentPreferredSupplier);

  const handleRequestQuote = () => {
    toast.info("Quote request feature coming soon!");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs flex items-center gap-1">
          <Users className="h-3 w-3" />
          Available Suppliers
        </Label>
        {matchedSuppliers.length > 0 && (
          <Badge variant="secondary" className="text-[10px]">
            {matchedSuppliers.length} match{matchedSuppliers.length !== 1 ? "es" : ""}
          </Badge>
        )}
      </div>

      {matchedSuppliers.length > 0 ? (
        <Select
          value={currentPreferredSupplier || NONE_VALUE}
          onValueChange={(val) => onSelectSupplier(val === NONE_VALUE ? "" : val)}
        >
          <SelectTrigger className="h-8 text-sm">
            <SelectValue placeholder="Select supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_VALUE}>
              <span className="text-muted-foreground">— No preferred supplier —</span>
            </SelectItem>
            {matchedSuppliers.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                <span className="flex items-center gap-2">
                  <span>{s.name}</span>
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

      {/* Request Quote button - placeholder */}
      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={handleRequestQuote}
        disabled
      >
        <FileText className="h-3.5 w-3.5 mr-1.5" />
        Request Quote
      </Button>
    </div>
  );
};
