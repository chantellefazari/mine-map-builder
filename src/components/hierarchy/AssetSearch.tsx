import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AssetSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const AssetSearch: React.FC<AssetSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search by asset number, name, or P&ID tag..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-10 bg-background"
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={() => onChange("")}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
