import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardCheck, Cog } from "lucide-react";

/**
 * Generic renderer for PM inspection tasks stored in pm_master_list.tasks JSONB.
 * 
 * Supports these JSONB shapes:
 * 1. { sections: [{ equipmentName, equipmentId?, mccId?, mccName?, tasks: [{ task, hasTemp?, tempLabel?, hasInput?, inputLabel? }] }] }
 * 2. Flat string array: ["task1", "task2", ...]
 * 3. Flat object array: [{ task: "..." }, ...]
 */

interface TaskItem {
  task?: string;
  description?: string;
  hasTemp?: boolean;
  tempLabel?: string;
  hasInput?: boolean;
  inputLabel?: string;
  hasPressure?: boolean;
  pressureLabel?: string;
  recommendedAmount?: string;
  comments?: string;
}

interface Section {
  equipmentName?: string;
  equipmentId?: string;
  mccId?: string;
  mccName?: string;
  tasks: TaskItem[];
  tempGuidelines?: string;
}

interface DynamicInspectionTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tasksData: any;
  /** Title shown in the section header. Defaults to "INSPECTIONS" */
  title?: string;
  /** Whether to show equipmentId alongside equipmentName in section headers */
  showEquipmentId?: boolean;
}

function normalizeTaskItem(item: any): TaskItem {
  if (typeof item === "string") return { task: item };
  return {
    task: item.task || item.description || "",
    hasTemp: item.hasTemp,
    tempLabel: item.tempLabel,
    hasInput: item.hasInput,
    inputLabel: item.inputLabel,
    hasPressure: item.hasPressure,
    pressureLabel: item.pressureLabel,
    recommendedAmount: item.recommendedAmount,
    comments: item.comments,
  };
}

function normalizeSections(data: any): Section[] {
  if (!data) return [];

  // Shape 1: { sections: [...] }
  if (data.sections && Array.isArray(data.sections)) {
    return data.sections.map((s: any) => ({
      ...s,
      equipmentName: s.equipmentName || s.sectionName,
      tasks: (s.tasks || s.items || []).map(normalizeTaskItem),
    }));
  }

  // Shape 5: { mccSections: [...], standardTasks: [...] } (Field MCC style)
  if (data.mccSections && Array.isArray(data.mccSections)) {
    const standardTasks: TaskItem[] = Array.isArray(data.standardTasks)
      ? data.standardTasks.map((t: string) => ({ task: t }))
      : [];
    return data.mccSections.map((mcc: any) => ({
      mccId: mcc.mccId,
      mccName: mcc.mccName,
      tasks: standardTasks,
    }));
  }

  // Shape 2: flat string array
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
    return [{ tasks: data.map((t: string) => ({ task: t })) }];
  }

  // Shape 3: flat object array with { task: string } or { description: string }
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && (data[0].task || data[0].description)) {
    return [{ tasks: data.map(normalizeTaskItem) }];
  }

  // Shape 4: array of sections directly (with tasks or items array)
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object" && (data[0].tasks || data[0].items)) {
    return data.map((s: any) => ({
      equipmentName: s.equipmentName || s.sectionName,
      equipmentId: s.equipmentId,
      mccId: s.mccId,
      mccName: s.mccName,
      tempGuidelines: s.tempGuidelines,
      tasks: (s.tasks || s.items || []).map(normalizeTaskItem),
    }));
  }

  return [];
}

function getSectionLabel(section: Section): string | null {
  if (section.mccId && section.mccName) {
    return `${section.mccId} – ${section.mccName}`;
  }
  if (section.equipmentName) {
    return section.equipmentName;
  }
  return null;
}

export const DynamicInspectionTable = ({
  tasksData,
  title = "INSPECTIONS",
  showEquipmentId = false,
}: DynamicInspectionTableProps) => {
  const sections = normalizeSections(tasksData);

  if (sections.length === 0) {
    return (
      <div className="border-b border-border p-4 text-sm text-muted-foreground italic">
        No inspection tasks configured for this PM.
      </div>
    );
  }

  const hasSectionHeaders = sections.some(s => getSectionLabel(s) !== null);

  // Single table with all sections (matches existing layout pattern)
  if (hasSectionHeaders && sections.every(s => !showEquipmentId || !s.equipmentId)) {
    return (
      <div className="border-b border-border" data-pdf-section>
        <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-primary" />
          {title}
        </div>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
              <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
              <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, sIdx) => {
              const label = getSectionLabel(section);
              return (
                <SectionRows key={sIdx} section={section} sectionIndex={sIdx} label={label} />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Per-section tables with equipment headers (Mill Daily style)
  return (
    <div className="border-b border-border" data-pdf-section>
      <div className="bg-primary/10 px-4 py-2 font-bold text-sm border-b border-border flex items-center gap-2">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        {title}
      </div>
      {sections.map((section, sIdx) => (
        <div key={sIdx} className={sIdx < sections.length - 1 ? "border-b border-border" : ""}>
          {section.equipmentId && (
            <div className="bg-muted px-4 py-2 font-semibold text-sm border-b border-border flex items-center gap-2">
              <Cog className="w-4 h-4 text-primary" />
              <span className="text-primary font-bold">{section.equipmentId}</span>
              {section.equipmentName && (
                <>
                  <span className="text-muted-foreground">|</span>
                  <span>{section.equipmentName}</span>
                </>
              )}
            </div>
          )}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left font-semibold w-[46%]">Task</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Serviceable</th>
                <th className="border border-border px-2 py-2 text-center font-semibold w-[10%]">Defective</th>
                <th className="border border-border px-3 py-2 text-left font-semibold w-[34%]">Comments</th>
              </tr>
            </thead>
            <tbody>
              {section.tasks.map((task, tIdx) => (
                <TaskRow key={tIdx} task={task} />
              ))}
            </tbody>
          </table>
          {section.tempGuidelines && (
            <div className="px-4 py-2 text-xs bg-amber-500/10 border-b border-border text-amber-700">
              <span className="font-semibold">Temp Guidelines: </span>{section.tempGuidelines}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/** Renders a section header row + its task rows inside a shared <tbody> */
function SectionRows({ section, sectionIndex, label }: { section: Section; sectionIndex: number; label: string | null }) {
  return (
    <>
      {label && (
        <tr className="bg-primary/10">
          <td colSpan={4} className="border border-border px-3 py-2 font-semibold text-primary">
            {label}
          </td>
        </tr>
      )}
      {section.tasks.map((task, tIdx) => (
        <TaskRow key={`${sectionIndex}-${tIdx}`} task={task} />
      ))}
      {section.tempGuidelines && (
        <tr>
          <td colSpan={4} className="border border-border px-4 py-2 text-xs bg-amber-500/10 text-amber-700">
            <span className="font-semibold">Temp Guidelines: </span>{section.tempGuidelines}
          </td>
        </tr>
      )}
    </>
  );
}

/** Single task row with the standard 4-column layout */
function TaskRow({ task }: { task: TaskItem }) {
  const commentContent = task.comments
    ? task.comments
    : task.hasTemp
    ? (task.tempLabel || "_______ °C")
    : task.hasPressure
    ? (task.pressureLabel || "_______ BAR")
    : task.hasInput
    ? task.inputLabel
    : null;

  return (
    <tr className="hover:bg-muted/30">
      <td className="border border-border px-3 py-2">{task.task}</td>
      <td className="border border-border px-2 py-2 text-center">
        <div className="flex justify-center">
          <Checkbox className="h-4 w-4 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
        </div>
      </td>
      <td className="border border-border px-2 py-2 text-center">
        <div className="flex justify-center">
          <Checkbox className="h-4 w-4 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" />
        </div>
      </td>
      <td className="border border-border px-2 py-4">
        {commentContent && <span className="text-xs text-muted-foreground">{commentContent}</span>}
      </td>
    </tr>
  );
}
