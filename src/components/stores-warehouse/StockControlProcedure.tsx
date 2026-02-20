import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  Container,
  Database,
  FileText,
  Link2,
  MapPin,
  Package,
  PackageCheck,
  QrCode,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Truck,
  UserCheck,
  Warehouse,
  Wrench,
} from "lucide-react";

const SectionHeader = ({
  icon: Icon,
  number,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  number: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">{number}</span>
      </div>
      <h2 className="text-lg font-bold text-foreground leading-tight">{title}</h2>
      {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const RuleCard = ({
  icon: Icon,
  text,
  variant = "default",
}: {
  icon: React.ElementType;
  text: string;
  variant?: "default" | "warning" | "success";
}) => {
  const styles = {
    default: "bg-muted/50 border-border",
    warning: "bg-amber-500/10 border-amber-500/30",
    success: "bg-emerald-500/10 border-emerald-500/30",
  };
  const iconStyles = {
    default: "text-primary",
    warning: "text-amber-600",
    success: "text-emerald-600",
  };
  return (
    <div className={`flex items-start gap-3 border rounded-lg p-3 ${styles[variant]}`}>
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconStyles[variant]}`} />
      <span className="text-sm text-foreground">{text}</span>
    </div>
  );
};

const StepBadge = ({ n }: { n: number }) => (
  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
    {n}
  </span>
);

const SubHeader = ({ title }: { title: string }) => (
  <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 mt-6 border-b border-primary/20 pb-1">
    {title}
  </h3>
);

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export const StockControlProcedure = () => {
  const containers = [
    { code: "C01-EL", label: "Electrical" },
    { code: "C02-IN", label: "Instrumentation & Pneumatics" },
    { code: "C03-ME", label: "Mechanical (40ft)" },
    { code: "C04-MP", label: "Mechanical Precision" },
    { code: "C05-CS", label: "Consumables & Fasteners" },
    { code: "LD", label: "Laydown Yard (External)" },
  ];

  const receivingSteps = [
    "Verify PO against delivery docket",
    "Inspect for damage",
    "Confirm quantity",
    "Confirm correct part number",
    "Photograph part (if new to catalogue)",
    "Apply internal part label (if required)",
  ];

  const stockOutFields = [
    { label: "Work Order Number", value: "Mandatory" },
    { label: "Area / Asset", value: "If available" },
    { label: "Issued To", value: "Mandatory — named person" },
    { label: "Reason", value: "Breakdown / PM / Planned / Shutdown" },
  ];

  const weeklyChecks = [
    "Spot check high-critical spares",
    "Review below-minimum items",
    "Reconcile discrepancies",
    "Review emergency freight occurrences",
  ];

  const monthlyChecks = [
    "Cycle count rotating container sections",
    "Reconcile discrepancies",
    "Review duplicates",
    "Adjust Min/Max where required",
  ];

  const accountabilityRules = [
    { text: "No part moves without system entry", variant: "warning" as const },
    { text: "No container access without recording issue", variant: "warning" as const },
    { text: "No bulk withdrawals without WO reference", variant: "warning" as const },
    { text: 'No "just grab it" culture permitted', variant: "warning" as const },
  ];

  const integrationLinks = [
    { icon: Warehouse, label: "Site Spares Inventory", desc: "Live stock levels and bin locations" },
    { icon: ClipboardList, label: "Work Order Module", desc: "Stock Out linked to WO number" },
    { icon: CalendarClock, label: "Weekly Revision Calendar", desc: "Wednesday Y26-WXX cycle" },
    { icon: QrCode, label: "QR / Barcode Scanning", desc: "Future integration — scan to issue" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">

      {/* ── TOP NOTICE ── */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-700 dark:text-amber-300">Governance Procedure — Mandatory Compliance</p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
            This procedure is binding for all personnel with access to the stores. Stores discipline is not optional.
            All stock movements must be recorded in the system before, during, or immediately after the physical movement.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 1. PURPOSE                                  */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader icon={FileText} number="§ 1" title="Purpose" />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <SubHeader title="Purpose of this Procedure" />
            <div className="space-y-2">
              {[
                "Establish controlled, traceable, accountable stock management",
                "Maintain accurate inventory levels at all times",
                "Reduce emergency freight through proactive replenishment",
                "Ensure full part traceability from receipt to use",
                "Integrate cleanly with Minesite AI system",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SubHeader title="Applies To" />
            <div className="space-y-2">
              {containers.map((c) => (
                <div key={c.code} className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg border border-border">
                  <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {c.code}
                  </span>
                  <span className="text-sm text-foreground">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 2. STOCK IN — RECEIVING                    */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={ArrowDownToLine}
          number="§ 2"
          title="Stock In Process — Receiving"
          subtitle="All inbound stock must pass through this procedure without exception."
        />

        {/* 2.1 Delivery Arrival */}
        <SubHeader title="2.1 — Delivery Arrival" />
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Truck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Mandatory Receiving Zone</p>
            <p className="text-sm text-amber-600 dark:text-amber-400">
              All deliveries must be processed at the roller door check-in zone on the concrete slab.{" "}
              <strong>No part is permitted to enter containers without system entry.</strong>
            </p>
          </div>
        </div>

        {/* 2.2 Receiving Steps */}
        <SubHeader title="2.2 — Receiving Steps (Sequential)" />
        <div className="space-y-3 mb-6">
          {receivingSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
              <StepBadge n={i + 1} />
              <span className="text-sm text-foreground">{step}</span>
            </div>
          ))}
        </div>

        {/* 2.3 System Entry */}
        <SubHeader title="2.3 — System Entry (iPad Based)" />
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Workflow Steps</p>
            {[
              "Open Site Spares Inventory",
              'Locate part by number or description',
              'Select "Stock In"',
              "Enter quantity received",
              "Record date, PO number, supplier, received-by",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg border border-border">
                <StepBadge n={i + 1} />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">System Rules</p>
            <RuleCard icon={Database} text="System automatically updates stock level on confirmation." variant="success" />
            <RuleCard icon={ShieldAlert} text="No manual stock adjustment permitted outside this process." variant="warning" />
            <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fields Recorded</p>
              <InfoBox label="Date" value="Auto-stamped" />
              <InfoBox label="PO Number" value="Mandatory" />
              <InfoBox label="Supplier" value="Mandatory" />
              <InfoBox label="Received By" value="Mandatory — named person" />
            </div>
          </div>
        </div>

        {/* 2.4 Storage Allocation */}
        <SubHeader title="2.4 — Storage Allocation Rule" />
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
            <Database className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-primary uppercase tracking-wide">Step 1</p>
            <p className="text-sm font-semibold text-foreground mt-1">Record in System</p>
            <p className="text-xs text-muted-foreground mt-1">Before physical storage</p>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
            <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-primary uppercase tracking-wide">Step 2</p>
            <p className="text-sm font-semibold text-foreground mt-1">Assign Bin Location</p>
            <p className="text-xs text-muted-foreground mt-1">C01–C05 or LD allocation</p>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
            <Package className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-primary uppercase tracking-wide">Step 3</p>
            <p className="text-sm font-semibold text-foreground mt-1">Physical Storage</p>
            <p className="text-xs text-muted-foreground mt-1">Place in allocated location</p>
          </div>
        </div>
        <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span className="text-sm font-semibold text-red-700 dark:text-red-400">
            If not system-recorded → cannot be stored. No exceptions.
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 3. STOCK OUT — ISSUE                       */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={ArrowUpFromLine}
          number="§ 3"
          title="Stock Out Process — Issue"
          subtitle="Every withdrawal from stores must be recorded before the part leaves the shelf."
        />

        {/* 3.1 Standard Withdrawal */}
        <SubHeader title="3.1 — Standard Withdrawal" />
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Mandatory Steps</p>
            {[
              'Locate part in system',
              'Select "Stock Out"',
              "Enter quantity being withdrawn",
              "Record all mandatory fields",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg border border-border">
                <StepBadge n={i + 1} />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Required Fields</p>
            <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-1">
              {stockOutFields.map((f) => (
                <InfoBox key={f.label} label={f.label} value={f.value} />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Reason Codes</p>
              {["Breakdown", "Preventive Maintenance (PM)", "Planned Work", "Shutdown"].map((r) => (
                <div key={r} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {r}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3.2 Emergency Rule */}
        <SubHeader title="3.2 — Emergency Withdrawal (Nightshift Rule)" />
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Applies only when system is unavailable (e.g. network outage, nightshift breakdown)
            </p>
          </div>
          <div className="space-y-2 pl-8">
            {[
              "Remove part from location",
              "Complete manual withdrawal sheet immediately",
              "Enter into system next day before 10:00 AM",
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 bg-amber-500/10 rounded-lg border border-amber-500/20">
                <StepBadge n={i + 1} />
                <span className="text-sm text-foreground">{s}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pl-8">
            <RuleCard icon={ShieldAlert} text="Unrecorded movement is not permitted under any circumstance." variant="warning" />
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 4. LAYDOWN YARD RULES                      */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={Warehouse}
          number="§ 4"
          title="Laydown Yard Rules — LD"
          subtitle="Heavy assemblies, large motors, pumps, gearboxes. Forklift access required."
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <SubHeader title="LD Allocation Requirements" />
            <div className="space-y-2">
              {[
                "Must be assigned LD location code (LD-A1, LD-B2, etc.)",
                "Must be physically tagged with part number, description, and date received",
                "Must be shrink-wrapped if exposed to weather",
                "All forklift movements must be logged in system",
              ].map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-3 bg-muted/40 rounded-lg border border-border">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{r}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SubHeader title="LD Zone Codes" />
            <div className="space-y-2">
              {[
                { code: "LD-C", label: "Crusher Liners" },
                { code: "LD-D", label: "Screen Panels" },
                { code: "LD-E", label: "Large Motors" },
                { code: "LD-F", label: "Overflow / Staging" },
                { code: "LD-A/B", label: "General Heavy (Forklift Access)" },
              ].map((z) => (
                <div key={z.code} className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg border border-border">
                  <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {z.code}
                  </span>
                  <span className="text-sm text-foreground">{z.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
              <Database className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                System allows LD allocation as a valid warehouse location — same entry process as containers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 5. MIN / MAX CONTROL                       */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={BarChart3}
          number="§ 5"
          title="Min / Max Stock Control"
          subtitle="Automated thresholds prevent stockouts and overstock."
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <SubHeader title="System Flags (Automatic)" />
            <div className="space-y-2">
              {[
                { label: "Below Minimum", color: "text-red-600", bg: "bg-red-500/10 border-red-500/30", desc: "Immediate reorder trigger" },
                { label: "Above Maximum", color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/30", desc: "Review holding cost" },
                { label: "Zero Stock", color: "text-red-700", bg: "bg-red-500/15 border-red-600/40", desc: "Critical alert — escalate" },
                { label: "Slow-Moving (Future)", color: "text-blue-600", bg: "bg-blue-500/10 border-blue-500/30", desc: "Planned enhancement" },
              ].map((f) => (
                <div key={f.label} className={`border rounded-lg p-3 ${f.bg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold ${f.color}`}>{f.label}</span>
                    <span className="text-xs text-muted-foreground">{f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SubHeader title="Reorder Trigger Logic" />
            <div className="space-y-3">
              {[
                { icon: CalendarClock, title: "Weekly Review", desc: "Every Wednesday — review all below-min items" },
                { icon: ShieldAlert, title: "System Alert", desc: "Triggered automatically when stock falls below min" },
              ].map((r) => (
                <div key={r.title} className="flex items-start gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                  <r.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                No manual bypass of minimum thresholds permitted.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 6. WEEKLY CONTROLS                         */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={CalendarClock}
          number="§ 6"
          title="Weekly Controls — Wednesday Revision Day"
          subtitle="Tied to planning cycle Y26-WXX (Wednesday 00:00 – Tuesday 23:59)."
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <SubHeader title="Wednesday Control Checklist" />
            <div className="space-y-2">
              {weeklyChecks.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
                  <ClipboardCheck className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SubHeader title="Revision Week Format" />
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="text-center mb-4">
                <span className="text-3xl font-bold font-mono text-primary">Y26-W01</span>
                <p className="text-xs text-muted-foreground mt-1">Week format — used on all WOs</p>
              </div>
              <InfoBox label="Week Start" value="Wednesday 00:00" />
              <InfoBox label="Week End" value="Tuesday 23:59" />
              <InfoBox label="Y26 W01 Start" value="Wed 31 Dec 2025" />
              <InfoBox label="Review Day" value="Every Wednesday" />
            </div>
            <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
              <Link2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Tied to Planning & Revision Control module — Y26-WXX calendar governs all weekly review cycles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 7. MONTHLY AUDIT                           */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={PackageCheck}
          number="§ 7"
          title="Monthly Audit"
          subtitle="Rotating cycle count across all container sections."
        />

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {monthlyChecks.map((item, i) => (
            <div key={i} className="bg-muted/40 border border-border rounded-lg p-4 text-center">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
              <p className="text-sm text-foreground font-medium">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-muted/40 border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cycle Count Rotation</p>
          <div className="grid grid-cols-5 gap-2">
            {["C01-EL", "C02-IN", "C03-ME", "C04-MP", "C05-CS"].map((c, i) => (
              <div key={c} className="text-center">
                <div className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                  {c}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Month {i + 1}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">LD Yard: audited quarterly by area (LD-A through LD-F)</p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 8. ACCOUNTABILITY RULES                    */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={UserCheck}
          number="§ 8"
          title="Accountability Rules"
          subtitle="Non-negotiable. Stores discipline is mandatory across all shifts."
        />

        <div className="grid md:grid-cols-2 gap-3 mb-4">
          {accountabilityRules.map((r, i) => (
            <RuleCard key={i} icon={ShieldAlert} text={r.text} variant={r.variant} />
          ))}
        </div>

        <div className="bg-red-500/10 border border-red-600/40 rounded-lg p-4 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Stores Discipline is Mandatory</p>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
              Failure to record stock movements undermines inventory accuracy, compromises maintenance delivery,
              and creates audit failures. This is not subject to individual interpretation.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* 9. SYSTEM INTEGRATION                      */}
      {/* ═══════════════════════════════════════════ */}
      <div className="bg-card border border-border rounded-lg p-6">
        <SectionHeader
          icon={Link2}
          number="§ 9"
          title="System Integration Requirements"
          subtitle="This procedure connects directly to the following modules."
        />

        <div className="grid sm:grid-cols-2 gap-4">
          {integrationLinks.map((link) => (
            <div key={link.label} className="flex items-start gap-4 p-4 bg-muted/40 rounded-lg border border-border hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <link.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{link.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { value: "Real-time", label: "Stock Level Updates" },
            { value: "WO-linked", label: "Every Issue Transaction" },
            { value: "Y26-WXX", label: "Weekly Audit Cycle" },
          ].map((stat) => (
            <div key={stat.label} className="bg-primary/5 border border-primary/20 rounded-lg p-3">
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
