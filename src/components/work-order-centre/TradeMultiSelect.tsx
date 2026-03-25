import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronDown } from "lucide-react";

const TRADES = ["Mechanical", "Electrical", "Instrumentation", "Boilermaker", "General"];

interface TradeMultiSelectProps {
  value: string;
  onChange: (value: string) => void;
}

/** Comma-separated multi-select for trades */
export function TradeMultiSelect({ value, onChange }: TradeMultiSelectProps) {
  const selected = value ? value.split(", ").filter(Boolean) : [];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (trade: string) => {
    const next = selected.includes(trade)
      ? selected.filter((t) => t !== trade)
      : [...selected, trade];
    onChange(next.join(", "));
  };

  const remove = (trade: string) => {
    onChange(selected.filter((t) => t !== trade).join(", "));
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 flex-wrap w-full min-h-[36px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        )}
      >
        {selected.length === 0 && (
          <span className="text-muted-foreground text-sm">Select trades...</span>
        )}
        {selected.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-0.5 bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium"
          >
            {t}
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); remove(t); }}
              className="hover:bg-primary/20 rounded cursor-pointer"
            >
              <X className="h-2.5 w-2.5" />
            </span>
          </span>
        ))}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 w-full bg-popover border border-border rounded-md shadow-lg py-1">
          {TRADES.map((trade) => (
            <button
              key={trade}
              type="button"
              onClick={() => toggle(trade)}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm hover:bg-muted/60 transition-colors flex items-center gap-2",
                selected.includes(trade) && "text-primary font-medium"
              )}
            >
              <span className={cn(
                "h-3.5 w-3.5 rounded border flex items-center justify-center flex-shrink-0",
                selected.includes(trade) ? "bg-primary border-primary" : "border-input"
              )}>
                {selected.includes(trade) && (
                  <svg className="h-2.5 w-2.5 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {trade}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
