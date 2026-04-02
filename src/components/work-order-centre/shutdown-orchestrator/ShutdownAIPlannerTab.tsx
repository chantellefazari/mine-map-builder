import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import {
  Brain, Send, Loader2, CheckCircle2, XCircle, Pencil, BookOpen,
  AlertTriangle, ArrowRight, Shield, Lock, Wrench, Zap, Mic,
  ChevronDown, ChevronUp, Plus, Trash2, ToggleLeft, ToggleRight,
  Lightbulb, GitBranch, Clock, Target,
} from "lucide-react";
import {
  ALL_AREA_OPTIONS, INITIAL_RULES,
  type LearnedRule,
} from "./shutdownData";

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface ExtractedRule {
  title: string;
  rule_type: string;
  if_condition: string;
  then_action: string;
  area?: string;
  affected_packages?: string[];
  impact_level: string;
  predecessors?: string[];
  successors?: string[];
  warnings?: string[];
}

interface AIResult {
  rules: ExtractedRule[];
  summary: string;
  sequencing_suggestions?: string[];
}

type RuleDecision = "pending" | "accepted" | "rejected" | "edited";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const EXAMPLE_PROMPTS = [
  "Do not start pump replacement until line isolation is confirmed.",
  "Scaffolding must be installed before mechanical access to the motor area.",
  "Crane access for this lift clashes with scaffold crew in Comminution.",
  "The mill cannot be restarted until all guards and electrical checks are complete.",
  "This task can run in parallel with inspection but not with commissioning.",
  "Last shutdown we lost 4 hours because the VSD wasn't on site — always confirm parts delivery 48hrs before.",
];

const RULE_TYPE_ICON: Record<string, typeof Shield> = {
  Dependency: GitBranch,
  "Hold Point": Target,
  "Access Constraint": Lock,
  "Isolation Rule": Shield,
  "Shutdown Requirement": AlertTriangle,
  "Parallel Permission": ArrowRight,
  "Clash Warning": AlertTriangle,
  "Lesson Learned": Lightbulb,
};

const IMPACT_STYLE: Record<string, { text: string; border: string }> = {
  Critical: { text: "text-destructive", border: "border-destructive/30" },
  High: { text: "text-amber-600", border: "border-amber-500/30" },
  Medium: { text: "text-blue-600", border: "border-blue-500/30" },
  Low: { text: "text-muted-foreground", border: "border-border" },
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export function ShutdownAIPlannerTab() {
  const { navigateToTab, setSelectedPackageId, addConfirmedRule, packages } = useOrchestratorContext();
  const [input, setInput] = useState("");
  const [inputMode, setInputMode] = useState<"free" | "structured">("free");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [ruleDecisions, setRuleDecisions] = useState<Map<number, RuleDecision>>(new Map());
  const [learnedRules, setLearnedRules] = useState<LearnedRule[]>(INITIAL_RULES);
  const [showLibrary, setShowLibrary] = useState(false);
  const [historyItems, setHistoryItems] = useState<{ input: string; result: AIResult; timestamp: string }[]>([]);

  const [structArea, setStructArea] = useState("All");
  const [structType, setStructType] = useState("Dependency");

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setIsProcessing(true);
    setResult(null);
    setRuleDecisions(new Map());
    try {
      const fullInput = inputMode === "structured" ? `[Area: ${structArea}] [Type: ${structType}] ${input}` : input;
      const { data, error } = await supabase.functions.invoke("shutdown-ai-planner", {
        body: { input: fullInput, context: WP_CONTEXT },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      const aiResult = data as AIResult;
      setResult(aiResult);
      setHistoryItems((prev) => [{ input: fullInput, result: aiResult, timestamp: new Date().toLocaleTimeString() }, ...prev]);
      toast.success("AI analysis complete");
    } catch (err: any) {
      console.error("AI Planner error:", err);
      toast.error(err.message || "Failed to process input");
    } finally {
      setIsProcessing(false);
    }
  };

  const setDecision = (idx: number, decision: RuleDecision) => {
    setRuleDecisions((prev) => new Map(prev).set(idx, decision));
  };

  const acceptRule = (rule: ExtractedRule, idx: number) => {
    setDecision(idx, "accepted");
    const newRule: LearnedRule = {
      id: `LR-${String(learnedRules.length + 1).padStart(3, "0")}`,
      title: rule.title,
      area: rule.area || "All",
      description: `IF ${rule.if_condition} THEN ${rule.then_action}`,
      rule_type: rule.rule_type,
      source: "AI Planner",
      active: true,
      created_at: new Date().toISOString().split("T")[0],
    };
    setLearnedRules((prev) => [newRule, ...prev]);
    addConfirmedRule({
      id: newRule.id, title: rule.title, rule_type: rule.rule_type,
      if_condition: rule.if_condition, then_action: rule.then_action,
      area: rule.area, affected_packages: rule.affected_packages,
      impact_level: rule.impact_level,
    });
    toast.success(`Rule "${rule.title}" added to Shutdown Library`);
  };

  const toggleRule = (id: string) => setLearnedRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  const deleteRule = (id: string) => { setLearnedRules((prev) => prev.filter((r) => r.id !== id)); toast.success("Rule removed from library"); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">AI Shutdown Planner</h2>
            <p className="text-[10px] text-muted-foreground">Teach shutdown logic using natural language</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={showLibrary ? "default" : "outline"} size="sm" className="h-8 text-xs gap-1.5" onClick={() => setShowLibrary(!showLibrary)}>
            <BookOpen className="w-3.5 h-3.5" />
            Shutdown Library
            <Badge variant="secondary" className="text-[9px] h-4 ml-1">{learnedRules.filter((r) => r.active).length}</Badge>
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="border border-border rounded-lg bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => setInputMode("free")} className={cn("px-3 py-1.5 text-[10px] font-medium transition-colors", inputMode === "free" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground")}>Free Input</button>
                <button onClick={() => setInputMode("structured")} className={cn("px-3 py-1.5 text-[10px] font-medium transition-colors", inputMode === "structured" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground")}>Structured</button>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 ml-auto opacity-50 cursor-not-allowed" disabled>
                <Mic className="w-3 h-3" /> Voice Capture
              </Button>
            </div>

            {inputMode === "structured" && (
              <div className="flex items-center gap-2">
                <Select value={structArea} onValueChange={setStructArea}>
                  <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ALL_AREA_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={structType} onValueChange={setStructType}>
                  <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Dependency", "Hold Point", "Access Constraint", "Isolation Rule", "Shutdown Requirement", "Parallel Permission", "Clash Warning", "Lesson Learned"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe shutdown logic, constraints, dependencies, or lessons learned in plain language…" className="min-h-[100px] text-sm resize-none" />

            <div className="flex flex-wrap gap-1.5">
              {EXAMPLE_PROMPTS.slice(0, 4).map((prompt, i) => (
                <button key={i} onClick={() => setInput(prompt)} className="text-[10px] px-2 py-1 rounded-md border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors truncate max-w-[280px]">
                  "{prompt.substring(0, 50)}…"
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">AI will interpret your input and suggest structured shutdown logic for review.</p>
              <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleSubmit} disabled={!input.trim() || isProcessing}>
                {isProcessing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analysing…</> : <><Send className="w-3.5 h-3.5" /> Analyse & Extract</>}
              </Button>
            </div>
          </div>

          {result && (
            <div className="space-y-4">
              <div className="border border-primary/30 rounded-lg bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-bold text-primary">AI Interpretation</h3>
                  <Badge variant="secondary" className="text-[9px] h-4">{result.rules.length} rules extracted</Badge>
                </div>
                <p className="text-xs text-foreground leading-relaxed">{result.summary}</p>
              </div>

              {result.sequencing_suggestions && result.sequencing_suggestions.length > 0 && (
                <div className="border border-blue-500/30 rounded-lg bg-blue-500/5 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                    <h4 className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Sequencing Suggestions</h4>
                  </div>
                  <ul className="space-y-1">
                    {result.sequencing_suggestions.map((s, i) => (
                      <li key={i} className="text-xs text-blue-600 flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 flex-shrink-0 mt-0.5" /><span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-primary" /> Extracted Rules — Review & Confirm
                </h3>
                <div className="space-y-2">
                  {result.rules.map((rule, idx) => {
                    const decision = ruleDecisions.get(idx) || "pending";
                    const RuleIcon = RULE_TYPE_ICON[rule.rule_type] || AlertTriangle;
                    const impact = IMPACT_STYLE[rule.impact_level] || IMPACT_STYLE.Medium;
                    return (
                      <div key={idx} className={cn("border rounded-lg p-3 transition-all", decision === "accepted" ? "border-emerald-500/30 bg-emerald-500/5" : decision === "rejected" ? "border-muted bg-muted/30 opacity-50" : "border-border bg-card")}>
                        <div className="flex items-start gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", impact.border, "border bg-card")}>
                            <RuleIcon className={cn("w-4 h-4", impact.text)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold text-foreground">{rule.title}</span>
                              <Badge variant="outline" className={cn("text-[8px] h-3.5", impact.text, impact.border)}>{rule.rule_type}</Badge>
                              <Badge variant="outline" className={cn("text-[8px] h-3.5", impact.text, impact.border)}>{rule.impact_level}</Badge>
                              {decision === "accepted" && <Badge className="text-[8px] h-3.5 bg-emerald-500">Accepted</Badge>}
                              {decision === "rejected" && <Badge variant="secondary" className="text-[8px] h-3.5">Rejected</Badge>}
                            </div>
                            <div className="text-[11px] text-foreground mb-1.5">
                              <span className="text-muted-foreground">IF</span> {rule.if_condition}{" "}
                              <ArrowRight className="w-3 h-3 inline mx-0.5" />{" "}
                              <span className="text-muted-foreground">THEN</span> {rule.then_action}
                            </div>
                            <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                              {rule.area && <span>Area: <strong className="text-foreground">{rule.area}</strong></span>}
                              {rule.affected_packages && rule.affected_packages.length > 0 && (
                                <span>Packages: {rule.affected_packages.map((pkg, pi) => (
                                  <button key={pi} className="font-mono font-bold text-foreground hover:text-primary underline mx-0.5" onClick={(e) => { e.stopPropagation(); setSelectedPackageId(pkg); navigateToTab("sequence"); }}>{pkg}</button>
                                ))}</span>
                              )}
                              {rule.predecessors && rule.predecessors.length > 0 && (
                                <span>Predecessors: <strong className="text-foreground font-mono">{rule.predecessors.join(", ")}</strong></span>
                              )}
                              {rule.successors && rule.successors.length > 0 && (
                                <span>Successors: <strong className="text-foreground font-mono">{rule.successors.join(", ")}</strong></span>
                              )}
                            </div>
                            {rule.warnings && rule.warnings.length > 0 && (
                              <div className="mt-1.5">
                                {rule.warnings.map((w, wi) => (
                                  <p key={wi} className="text-[10px] text-amber-600 flex items-center gap-1">
                                    <AlertTriangle className="w-2.5 h-2.5" /> {w}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                          {decision === "pending" && (
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => acceptRule(rule, idx)}>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => setDecision(idx, "rejected")}>
                                <XCircle className="w-3.5 h-3.5 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {historyItems.length > 0 && !result && (
            <div>
              <h3 className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Recent Analyses
              </h3>
              <div className="space-y-1.5">
                {historyItems.slice(0, 5).map((item, i) => (
                  <button key={i} onClick={() => { setInput(item.input); setResult(item.result); setRuleDecisions(new Map()); }} className="w-full text-left rounded-md border border-border p-2.5 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                      <Badge variant="secondary" className="text-[8px] h-3.5">{item.result.rules.length} rules</Badge>
                    </div>
                    <p className="text-xs text-foreground truncate">{item.input}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {showLibrary && (
          <div className="w-96 flex-shrink-0 border border-border rounded-lg bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">Shutdown Rule Library</h3>
                <Badge variant="secondary" className="text-[9px] h-4 ml-auto">{learnedRules.filter((r) => r.active).length} active</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Stored rules reused across shutdowns</p>
            </div>
            <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto">
              {learnedRules.map((rule) => {
                const RuleIcon = RULE_TYPE_ICON[rule.rule_type] || AlertTriangle;
                return (
                  <div key={rule.id} className={cn("border rounded-md p-2.5 transition-all", rule.active ? "border-border bg-card" : "border-muted bg-muted/20 opacity-60")}>
                    <div className="flex items-center gap-2 mb-1">
                      <RuleIcon className="w-3 h-3 text-primary flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-foreground flex-1 truncate">{rule.title}</span>
                      <button onClick={() => toggleRule(rule.id)} className="flex-shrink-0">
                        {rule.active ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-muted-foreground" />}
                      </button>
                      <button onClick={() => deleteRule(rule.id)} className="flex-shrink-0">
                        <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive transition-colors" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-snug mb-1.5">{rule.description}</p>
                    <div className="flex items-center gap-2 text-[9px] text-muted-foreground">
                      <Badge variant="outline" className="text-[8px] h-3.5">{rule.rule_type}</Badge>
                      <span>{rule.area}</span>
                      <span className="ml-auto">{rule.source}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
