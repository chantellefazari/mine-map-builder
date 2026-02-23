import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, BookOpen, List, Loader2 } from "lucide-react";
import { PMFrequencySection, PMData } from "./PMFrequencySection";
import { PMPrinciples } from "./PMPrinciples";
import { usePMasterList } from "@/hooks/usePMData";

export const PMDesignWorkspace = () => {
  const { pms, isLoading } = usePMasterList();

  const getpmsByFrequency = (frequency: PMData["frequency"]) => {
    return pms.filter((pm) => pm.frequency === frequency);
  };

  const handleAddPM = (frequency: PMData["frequency"]) => {
    // Placeholder for add PM functionality
    console.log("Add PM for frequency:", frequency);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading PM data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <FileText className="h-3 w-3 text-primary" />
        </div>
        <div className="text-sm">
          <p className="text-foreground font-medium">
            PMs are designed by EQUIPMENT TYPE first, not by specific asset.
          </p>
          <p className="text-muted-foreground mt-1">
            This workspace is for PM DESIGN ONLY. Asset linking and scheduling happen externally in the CMMS.
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="by-frequency" className="w-full">
        <TabsList className="grid w-full max-w-xl grid-cols-3">
          <TabsTrigger value="by-frequency" className="gap-2">
            <Clock className="h-4 w-4" />
            By Frequency
          </TabsTrigger>
          <TabsTrigger value="master-list" className="gap-2">
            <List className="h-4 w-4" />
            Master List
          </TabsTrigger>
          <TabsTrigger value="principles" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Design Principles
          </TabsTrigger>
        </TabsList>

        {/* By Frequency View */}
        <TabsContent value="by-frequency" className="mt-6 space-y-6">
          <PMFrequencySection
            frequency="Daily"
            frequencyLabel="📅 Daily PMs"
            pms={getpmsByFrequency("Daily")}
            onAddPM={() => handleAddPM("Daily")}
          />
          <PMFrequencySection
            frequency="1 Week"
            frequencyLabel="1️⃣ Weekly PMs (1 Week)"
            pms={getpmsByFrequency("1 Week")}
            onAddPM={() => handleAddPM("1 Week")}
          />
          <PMFrequencySection
            frequency="2 Week"
            frequencyLabel="2️⃣ Fortnightly PMs (2 Week)"
            pms={getpmsByFrequency("2 Week")}
            onAddPM={() => handleAddPM("2 Week")}
          />
          <PMFrequencySection
            frequency="6 Week"
            frequencyLabel="3️⃣ Six-Weekly PMs (6 Week)"
            pms={getpmsByFrequency("6 Week")}
            onAddPM={() => handleAddPM("6 Week")}
          />
          <PMFrequencySection
            frequency="12 Week"
            frequencyLabel="4️⃣ Quarterly PMs (12 Week)"
            pms={getpmsByFrequency("12 Week")}
            onAddPM={() => handleAddPM("12 Week")}
          />
        </TabsContent>

        {/* Master List View */}
        <TabsContent value="master-list" className="mt-6">
          <PMMasterListView pms={pms} />
        </TabsContent>

        {/* Design Principles */}
        <TabsContent value="principles" className="mt-6">
          <PMPrinciples />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Master List Table View
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { PMAssetSearchCombobox } from "./PMAssetSearchCombobox";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const statusColors = {
  Draft: "bg-muted text-muted-foreground",
  Reviewed: "bg-primary/20 text-primary",
  Approved: "bg-green-500/20 text-green-700",
};

const PMMasterListView = ({ pms }: { pms: PMData[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterFrequency, setFilterFrequency] = useState<string>("all");
  const [filterDiscipline, setFilterDiscipline] = useState<string>("all");
  const queryClient = useQueryClient();

  // Local editable state for resources (keyed by pm id)
  const [resourceEdits, setResourceEdits] = useState<Record<string, string>>({});

  const saveField = async (pmId: string, field: string, value: string) => {
    const { error } = await supabase
      .from("pm_master_list")
      .update({ [field]: value } as any)
      .eq("id", pmId);
    if (error) {
      toast.error("Save failed: " + error.message);
    } else {
      queryClient.invalidateQueries({ queryKey: ["pm-master-list"] });
      toast.success("Saved");
    }
  };

  const filteredPMs = pms.filter((pm) => {
    const matchesSearch =
      pm.pmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pm.equipmentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFrequency =
      filterFrequency === "all" || pm.frequency === filterFrequency;
    const matchesDiscipline =
      filterDiscipline === "all" || pm.discipline === filterDiscipline;
    return matchesSearch && matchesFrequency && matchesDiscipline;
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          PM Master List ({pms.length} total)
        </h2>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search PMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-56"
            />
          </div>
          <Select value={filterFrequency} onValueChange={setFilterFrequency}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Frequencies</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="1 Week">1 Week</SelectItem>
              <SelectItem value="2 Week">2 Week</SelectItem>
              <SelectItem value="6 Week">6 Week</SelectItem>
              <SelectItem value="12 Week">12 Week</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterDiscipline} onValueChange={setFilterDiscipline}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Discipline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Disciplines</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Ops">Ops</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[22%]">PM Name</TableHead>
            <TableHead className="w-[14%]">Equipment Type</TableHead>
            <TableHead className="w-[8%]">Freq</TableHead>
            <TableHead className="w-[8%]">Discipline</TableHead>
            <TableHead className="w-[18%]">Asset Number</TableHead>
            <TableHead className="w-[22%]">Resources</TableHead>
            <TableHead className="w-[8%]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPMs.map((pm) => (
            <TableRow key={pm.id}>
              <TableCell className="font-medium text-xs">{pm.pmName}</TableCell>
              <TableCell className="text-xs">{pm.equipmentType}</TableCell>
              <TableCell className="text-xs">{pm.frequency}</TableCell>
              <TableCell className="text-xs">{pm.discipline}</TableCell>
              <TableCell>
                <PMAssetSearchCombobox
                  value={pm.assetNumber}
                  onChange={(id) => saveField(pm.id, "asset_number", id)}
                  compact
                />
              </TableCell>
              <TableCell>
                <Input
                  value={resourceEdits[pm.id] ?? pm.resources}
                  onChange={(e) =>
                    setResourceEdits((prev) => ({ ...prev, [pm.id]: e.target.value }))
                  }
                  onBlur={() => {
                    const val = resourceEdits[pm.id];
                    if (val !== undefined && val !== pm.resources) {
                      saveField(pm.id, "resources", val);
                    }
                  }}
                  placeholder="e.g. 1x Fitter (2 hrs)"
                  className="h-7 text-xs"
                />
              </TableCell>
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
  );
};
