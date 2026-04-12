import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  filterArea: string; setFilterArea: (v: string) => void;
  filterDiscipline: string; setFilterDiscipline: (v: string) => void;
  filterFrequency: string; setFilterFrequency: (v: string) => void;
  filterPriority: string; setFilterPriority: (v: string) => void;
  filterStatus: string; setFilterStatus: (v: string) => void;
  options: {
    areas: string[];
    disciplines: string[];
    frequencies: string[];
    priorities: string[];
    statuses: string[];
  };
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-6 text-[10px] w-auto min-w-[80px] border-none bg-transparent shadow-none gap-1 px-1.5">
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function PlannerFilterBar(props: Props) {
  const activeCount = [props.filterArea, props.filterDiscipline, props.filterFrequency, props.filterPriority, props.filterStatus].filter(v => v !== "All").length;

  return (
    <div className="flex items-center gap-1 px-4 py-1.5 border-b border-border bg-muted/20 text-[10px]">
      <SlidersHorizontal className="w-3 h-3 text-muted-foreground mr-1" />
      <FilterSelect label="Area" value={props.filterArea} onChange={props.setFilterArea} options={props.options.areas} />
      <span className="text-border">|</span>
      <FilterSelect label="Discipline" value={props.filterDiscipline} onChange={props.setFilterDiscipline} options={props.options.disciplines} />
      <span className="text-border">|</span>
      <FilterSelect label="Frequency" value={props.filterFrequency} onChange={props.setFilterFrequency} options={props.options.frequencies} />
      <span className="text-border">|</span>
      <FilterSelect label="Priority" value={props.filterPriority} onChange={props.setFilterPriority} options={props.options.priorities} />
      <span className="text-border">|</span>
      <FilterSelect label="Status" value={props.filterStatus} onChange={props.setFilterStatus} options={props.options.statuses} />
      {activeCount > 0 && (
        <button
          onClick={() => {
            props.setFilterArea("All"); props.setFilterDiscipline("All");
            props.setFilterFrequency("All"); props.setFilterPriority("All"); props.setFilterStatus("All");
          }}
          className="ml-2 text-[10px] text-primary hover:underline"
        >
          Clear {activeCount} filter{activeCount > 1 ? "s" : ""}
        </button>
      )}
    </div>
  );
}
