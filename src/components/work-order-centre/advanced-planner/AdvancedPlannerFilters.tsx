import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface Props {
  filterArea: string; setFilterArea: (v: string) => void;
  filterDiscipline: string; setFilterDiscipline: (v: string) => void;
  filterWOType: string; setFilterWOType: (v: string) => void;
  filterFrequency: string; setFilterFrequency: (v: string) => void;
  filterPriority: string; setFilterPriority: (v: string) => void;
  filterStatus: string; setFilterStatus: (v: string) => void;
  filterDuty: string; setFilterDuty: (v: string) => void;
  searchQuery: string; setSearchQuery: (v: string) => void;
  searchWO: string; setSearchWO: (v: string) => void;
  options: {
    areas: string[];
    disciplines: string[];
    frequencies: string[];
    priorities: string[];
    statuses: string[];
    duties: string[];
  };
}

function FilterSelect({ label, value, onChange, items }: { label: string; value: string; onChange: (v: string) => void; items: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs min-w-[120px]">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">{label}</SelectItem>
        {items.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export function AdvancedPlannerFilters(props: Props) {
  const { options } = props;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      
      <FilterSelect label="All Areas" value={props.filterArea} onChange={props.setFilterArea} items={options.areas} />
      <FilterSelect label="All Disciplines" value={props.filterDiscipline} onChange={props.setFilterDiscipline} items={options.disciplines} />
      <FilterSelect label="All WO Types" value={props.filterWOType} onChange={props.setFilterWOType}
        items={["General", "PM", "Breakdown", "Shutdown"]} />
      <FilterSelect label="All" value={props.filterFrequency} onChange={props.setFilterFrequency} items={options.frequencies} />
      <FilterSelect label="All Priority" value={props.filterPriority} onChange={props.setFilterPriority} items={options.priorities} />
      <FilterSelect label="All Status" value={props.filterStatus} onChange={props.setFilterStatus} items={options.statuses} />

      {/* Searches */}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          className="h-8 text-xs pl-7 w-52"
          placeholder="Search PM, asset, type…"
          value={props.searchQuery}
          onChange={e => props.setSearchQuery(e.target.value)}
        />
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          className="h-8 text-xs pl-7 w-36"
          placeholder="Search WO #…"
          value={props.searchWO}
          onChange={e => props.setSearchWO(e.target.value)}
        />
      </div>
    </div>
  );
}
