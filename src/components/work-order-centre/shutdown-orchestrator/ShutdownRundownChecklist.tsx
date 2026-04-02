/**
 * Editable Run-Down / Run-Up checklist for shutdown orchestrator.
 * Includes work centre, start/finish times, duration hours per step.
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRundownSteps, type RundownStep } from "@/hooks/useRundownSteps";
import {
  Plus, Trash2, CheckCircle2, Lock, ArrowUp,
} from "lucide-react";

interface Props {
  shutdownId: string;
}

const STATUS_STYLE: Record<string, string> = {
  Pending: "text-muted-foreground",
  "In Progress": "text-amber-600",
  Complete: "text-emerald-600",
};

export function ShutdownRundownChecklist({ shutdownId }: Props) {
  const { rundownSteps, runupSteps, addStep, updateStep, removeStep } = useRundownSteps(shutdownId);
  const [newRundown, setNewRundown] = useState("");
  const [newRunup, setNewRunup] = useState("");

  const handleAdd = (phase: "run-down" | "run-up", description: string, setter: (v: string) => void) => {
    if (!description.trim()) return;
    const steps = phase === "run-down" ? rundownSteps : runupSteps;
    addStep.mutate({
      shutdown_id: shutdownId,
      phase,
      step_description: description.trim(),
      sort_order: steps.length,
    });
    setter("");
  };

  const toggleStatus = (step: RundownStep) => {
    const next = step.status === "Pending" ? "In Progress" : step.status === "In Progress" ? "Complete" : "Pending";
    updateStep.mutate({ id: step.id, updates: { status: next } });
  };

  const renderChecklist = (
    title: string,
    icon: typeof Lock,
    steps: RundownStep[],
    phase: "run-down" | "run-up",
    newValue: string,
    setNewValue: (v: string) => void,
    headerColor: string,
    bgColor: string,
  ) => {
    const Icon = icon;
    const completedCount = steps.filter(s => s.status === "Complete").length;
    const pct = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
    const totalHours = steps.reduce((s, st) => s + (st.duration_hours || 0), 0);

    return (
      <div className={cn("border border-border rounded-lg overflow-hidden", bgColor)}>
        {/* Header */}
        <div className={cn("px-4 py-3 border-b border-border/50 flex items-center justify-between", headerColor)}>
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            <h3 className="text-sm font-bold">{title}</h3>
            <Badge variant="outline" className="text-[9px] h-4">{steps.length} steps</Badge>
            {totalHours > 0 && (
              <Badge variant="outline" className="text-[9px] h-4">{totalHours} hrs</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">{completedCount}/{steps.length}</span>
            <div className="w-16 h-1.5 bg-background/50 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="font-semibold">{pct}%</span>
          </div>
        </div>

        {/* Column Headers */}
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border/30 bg-muted/30 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="w-5 text-right">#</span>
          <span className="w-5" />
          <span className="flex-1">Step Description</span>
          <span className="w-24 text-center">Work Centre</span>
          <span className="w-16 text-center">Start</span>
          <span className="w-16 text-center">Finish</span>
          <span className="w-12 text-right">Hrs</span>
          <span className="w-20 text-center">Owner</span>
          <span className="w-16 text-center">Status</span>
          <span className="w-4" />
        </div>

        {/* Steps */}
        <div className="divide-y divide-border/30">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 transition-colors hover:bg-background/50",
                step.status === "Complete" && "opacity-60",
              )}
            >
              <span className="text-[10px] font-mono text-muted-foreground w-5 text-right">{i + 1}.</span>

              <button
                onClick={() => toggleStatus(step)}
                className={cn(
                  "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors",
                  step.status === "Complete"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : step.status === "In Progress"
                    ? "bg-amber-500/20 border-amber-500"
                    : "border-border hover:border-foreground/50",
                )}
              >
                {step.status === "Complete" && <CheckCircle2 className="w-3 h-3" />}
                {step.status === "In Progress" && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </button>

              {/* Description */}
              <InlineEditField
                value={step.step_description}
                onSave={(v) => updateStep.mutate({ id: step.id, updates: { step_description: v } })}
                className={cn("flex-1 text-xs", step.status === "Complete" && "line-through")}
              />

              {/* Work Centre */}
              <InlineEditField
                value={step.work_centre}
                onSave={(v) => updateStep.mutate({ id: step.id, updates: { work_centre: v } })}
                className="w-24 text-[10px] text-muted-foreground text-center"
                placeholder="Centre"
              />

              {/* Start Time */}
              <InlineEditField
                value={step.start_time}
                onSave={(v) => updateStep.mutate({ id: step.id, updates: { start_time: v } })}
                className="w-16 text-[10px] text-muted-foreground text-center font-mono"
                placeholder="HH:MM"
              />

              {/* Finish Time */}
              <InlineEditField
                value={step.finish_time}
                onSave={(v) => updateStep.mutate({ id: step.id, updates: { finish_time: v } })}
                className="w-16 text-[10px] text-muted-foreground text-center font-mono"
                placeholder="HH:MM"
              />

              {/* Duration */}
              <InlineEditField
                value={step.duration_hours > 0 ? String(step.duration_hours) : ""}
                onSave={(v) => updateStep.mutate({ id: step.id, updates: { duration_hours: Number(v) || 0 } })}
                className="w-12 text-[10px] text-muted-foreground text-right font-mono"
                placeholder="hrs"
              />

              {/* Responsible */}
              <InlineEditField
                value={step.responsible}
                onSave={(v) => updateStep.mutate({ id: step.id, updates: { responsible: v } })}
                className="w-20 text-[10px] text-muted-foreground text-center"
                placeholder="Owner"
              />

              {/* Status badge */}
              <Badge variant="outline" className={cn("text-[8px] h-4 w-16 justify-center", STATUS_STYLE[step.status])}>
                {step.status}
              </Badge>

              <button
                onClick={() => removeStep.mutate(step.id)}
                className="text-muted-foreground/40 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Add new step */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-border/30 bg-background/30">
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(phase, newValue, setNewValue); }}
            placeholder={`Add ${phase === "run-down" ? "run-down" : "run-up"} step…`}
            className="h-7 text-xs border-none bg-transparent shadow-none focus-visible:ring-0 px-0"
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px]"
            disabled={!newValue.trim()}
            onClick={() => handleAdd(phase, newValue, setNewValue)}
          >
            Add
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {renderChecklist(
        "Run-Down Checklist",
        Lock,
        rundownSteps,
        "run-down",
        newRundown,
        setNewRundown,
        "bg-amber-500/10 text-amber-700",
        "bg-card",
      )}
      {renderChecklist(
        "Run-Up Checklist",
        ArrowUp,
        runupSteps,
        "run-up",
        newRunup,
        setNewRunup,
        "bg-emerald-500/10 text-emerald-700",
        "bg-card",
      )}
    </div>
  );
}

/* ── Inline edit helper ── */
function InlineEditField({
  value,
  onSave,
  className,
  placeholder,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  if (editing) {
    return (
      <Input
        autoFocus
        className={cn("h-6 text-xs border-none bg-muted/50 shadow-none px-1", className)}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => { onSave(text); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === "Enter") { onSave(text); setEditing(false); } if (e.key === "Escape") setEditing(false); }}
        placeholder={placeholder}
      />
    );
  }

  return (
    <span
      onClick={() => { setText(value); setEditing(true); }}
      className={cn("cursor-pointer hover:bg-accent/50 px-1 py-0.5 rounded transition-colors min-h-[20px] inline-block", className)}
    >
      {value || <span className="text-muted-foreground/50 italic">{placeholder || "—"}</span>}
    </span>
  );
}
