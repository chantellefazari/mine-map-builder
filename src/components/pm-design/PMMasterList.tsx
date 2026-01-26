import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PMItem {
  id: string;
  pmId: string;
  pmName: string;
  equipmentType: string;
  discipline: string;
  dutyType: string;
  triggerType: string;
  intervalDescription: string;
  estimatedDuration: string;
  skillLevel: string;
  status: "Draft" | "Reviewed" | "Final";
}

const initialPMs: PMItem[] = [
  {
    id: "1",
    pmId: "PM-PUMP-001",
    pmName: "Centrifugal Pump Weekly Inspection",
    equipmentType: "Pump",
    discipline: "Mechanical",
    dutyType: "Both",
    triggerType: "Time",
    intervalDescription: "Weekly",
    estimatedDuration: "30 min",
    skillLevel: "Operator",
    status: "Draft",
  },
  {
    id: "2",
    pmId: "PM-CONV-001",
    pmName: "Conveyor Belt Monthly Inspection",
    equipmentType: "Conveyor",
    discipline: "Mechanical",
    dutyType: "Duty",
    triggerType: "Time",
    intervalDescription: "Monthly",
    estimatedDuration: "2 hrs",
    skillLevel: "Fitter",
    status: "Draft",
  },
  {
    id: "3",
    pmId: "PM-MTR-001",
    pmName: "Electric Motor Thermography",
    equipmentType: "Motor",
    discipline: "Electrical",
    dutyType: "Both",
    triggerType: "Condition",
    intervalDescription: "Quarterly",
    estimatedDuration: "1 hr",
    skillLevel: "Electrician",
    status: "Draft",
  },
];

const statusColors = {
  Draft: "bg-muted text-muted-foreground",
  Reviewed: "bg-primary/20 text-primary",
  Final: "bg-green-500/20 text-green-700",
};

export const PMMasterList = () => {
  const [pms, setPms] = useState<PMItem[]>(initialPMs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");

  const filteredPMs = pms.filter((pm) => {
    const matchesSearch =
      pm.pmId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pm.pmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pm.equipmentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiscipline =
      filterDiscipline === "all" || pm.discipline === filterDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">
            PM Master List
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search PMs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Discipline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Disciplines</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Ops">Ops</SelectItem>
                <SelectItem value="Inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add PM
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PM ID</TableHead>
              <TableHead>PM Name</TableHead>
              <TableHead>Equipment Type</TableHead>
              <TableHead>Discipline</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPMs.map((pm) => (
              <TableRow key={pm.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-sm">{pm.pmId}</TableCell>
                <TableCell className="font-medium">{pm.pmName}</TableCell>
                <TableCell>{pm.equipmentType}</TableCell>
                <TableCell>{pm.discipline}</TableCell>
                <TableCell>{pm.triggerType}</TableCell>
                <TableCell>{pm.intervalDescription}</TableCell>
                <TableCell>{pm.estimatedDuration}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[pm.status]}>
                    {pm.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredPMs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No PMs match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};
