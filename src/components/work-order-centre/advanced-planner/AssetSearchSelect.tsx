import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface AssetOption {
  asset_number: string;
  asset_name: string;
  area_label: string;
  sub_area: string;
  parent_asset_label: string;
}

function useAssetOptions() {
  return useQuery({
    queryKey: ["asset-options-for-pm"],
    queryFn: async (): Promise<AssetOption[]> => {
      const { data, error } = await supabase
        .from("processing_plant_assets_rev_b")
        .select("asset_number, asset_name, area_label, sub_area, parent_asset_label")
        .order("area_label")
        .order("asset_number");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/* ── Single-select asset search ── */
export function AssetSearchSelect({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const { data: assets = [] } = useAssetOptions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return assets.slice(0, 50);
    const q = query.toLowerCase();
    return assets.filter(
      (a) =>
        a.asset_number.toLowerCase().includes(q) ||
        a.asset_name.toLowerCase().includes(q) ||
        a.area_label.toLowerCase().includes(q) ||
        a.parent_asset_label.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [assets, query]);

  const selected = assets.find((a) => a.asset_number === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 h-8 px-2.5 border border-input rounded-md bg-background text-xs cursor-pointer hover:border-primary/50 transition-colors"
      >
        {selected ? (
          <span className="truncate flex-1">
            <span className="font-mono font-medium">{selected.asset_number}</span>
            <span className="text-muted-foreground ml-1.5">— {selected.asset_name}</span>
          </span>
        ) : (
          <span className="text-muted-foreground flex-1">Select asset...</span>
        )}
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg">
          <div className="p-1.5 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by number, name, or area..."
                className="h-7 text-xs pl-7"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="max-h-48">
            <div className="p-1">
              {filtered.length === 0 && (
                <p className="text-[10px] text-muted-foreground p-2 text-center">No assets found</p>
              )}
              {filtered.map((a) => (
                <div
                  key={a.asset_number}
                  onClick={() => {
                    onChange(a.asset_number);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors",
                    value === a.asset_number
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="font-mono font-medium w-20 shrink-0">{a.asset_number}</span>
                  <span className="truncate flex-1">{a.asset_name}</span>
                  <span className="text-[9px] text-muted-foreground shrink-0">{a.area_label}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

/* ── Multi-select asset search ── */
export function AssetMultiSelect({
  selected,
  onChange,
  className,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  className?: string;
}) {
  const { data: assets = [] } = useAssetOptions();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return assets.slice(0, 50);
    const q = query.toLowerCase();
    return assets.filter(
      (a) =>
        a.asset_number.toLowerCase().includes(q) ||
        a.asset_name.toLowerCase().includes(q) ||
        a.area_label.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [assets, query]);

  const toggle = (num: string) => {
    onChange(
      selected.includes(num) ? selected.filter((s) => s !== num) : [...selected, num]
    );
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 min-h-[32px] px-2 py-1 border border-input rounded-md bg-background cursor-pointer hover:border-primary/50 transition-colors flex-wrap"
      >
        {selected.length === 0 ? (
          <span className="text-muted-foreground text-xs">Select assets...</span>
        ) : (
          selected.map((num) => {
            const asset = assets.find((a) => a.asset_number === num);
            return (
              <Badge key={num} variant="secondary" className="text-[9px] px-1.5 py-0 gap-1 font-mono">
                {num}
                <X
                  className="w-2.5 h-2.5 cursor-pointer hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(num);
                  }}
                />
              </Badge>
            );
          })
        )}
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-auto" />
      </div>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg">
          <div className="p-1.5 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search assets..."
                className="h-7 text-xs pl-7"
                autoFocus
              />
            </div>
          </div>
          <ScrollArea className="max-h-48">
            <div className="p-1">
              {filtered.length === 0 && (
                <p className="text-[10px] text-muted-foreground p-2 text-center">No assets found</p>
              )}
              {filtered.map((a) => (
                <div
                  key={a.asset_number}
                  onClick={() => toggle(a.asset_number)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors",
                    selected.includes(a.asset_number)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                    selected.includes(a.asset_number) ? "bg-primary border-primary" : "border-muted-foreground/30"
                  )}>
                    {selected.includes(a.asset_number) && (
                      <svg className="w-2.5 h-2.5 text-primary-foreground" viewBox="0 0 12 12">
                        <path d="M2 6l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="font-mono font-medium w-20 shrink-0">{a.asset_number}</span>
                  <span className="truncate flex-1">{a.asset_name}</span>
                  <span className="text-[9px] text-muted-foreground shrink-0">{a.area_label}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
          {selected.length > 0 && (
            <div className="p-1.5 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{selected.length} selected</span>
              <button onClick={() => onChange([])} className="text-[10px] text-destructive hover:underline">Clear all</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
