import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wrench, CalendarCheck, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (woType: string) => void;
  title: string;
  description: string;
}

export interface PMAutoFill {
  pmId: string;
  pmName: string;
  equipmentType: string;
  discipline: string;
  estimatedDuration: string;
  requiredTools: string[];
  assetNumber: string;
  purpose: string;
  tasks: any[];
  frequency: string;
}

const WO_TYPES = [
  {
    value: "Breakdown",
    label: "Breakdown (Reactive)",
    desc: "Unplanned failure or urgent repair",
    icon: AlertTriangle,
    accent: "border-destructive/40 hover:border-destructive",
  },
  {
    value: "Planned",
    label: "Planned",
    desc: "Scheduled maintenance or improvement work",
    icon: CalendarCheck,
    accent: "border-primary/40 hover:border-primary",
  },
  {
    value: "Shutdown",
    label: "Shutdown",
    desc: "Work requiring plant or area shutdown",
    icon: Wrench,
    accent: "border-orange-400/40 hover:border-orange-400",
  },
];

export function WOTypeSelectDialog({ open, onClose, onConfirm, title, description }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selected) {
      onConfirm(selected);
      setSelected(null);
    }
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-xs">{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-2 py-2">
          {WO_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelected(t.value)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors",
                selected === t.value
                  ? `${t.accent} bg-muted/50`
                  : "border-border hover:bg-muted/30"
              )}
            >
              <t.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <p className="text-[11px] text-muted-foreground">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={handleClose} className="text-xs">
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!selected} className="text-xs">
            Confirm & Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
