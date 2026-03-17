import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMissionControl } from "@/hooks/useMissionControl";
import { MapOverview } from "@/components/mission-control/MapOverview";
import { WorkStreams } from "@/components/mission-control/WorkStreams";
import { CriticalPath } from "@/components/mission-control/CriticalPath";
import { ShiftView } from "@/components/mission-control/ShiftView";
import { Reports } from "@/components/mission-control/Reports";
import { Radar, Map, Layers, Zap, Clock, BarChart3 } from "lucide-react";

const MissionControl = () => {
  const { jobs, areas, overallProgress, criticalJobs, constraints, isLoading } = useMissionControl();

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Radar className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Loading Mission Control…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <Radar className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Mission Control</h1>
          <p className="text-sm text-muted-foreground">Central shutdown scheduling & real-time operational command</p>
        </div>
      </div>

      <Tabs defaultValue="map">
        <TabsList className="mb-6">
          <TabsTrigger value="map" className="gap-1.5"><Map className="w-3.5 h-3.5" /> Map</TabsTrigger>
          <TabsTrigger value="streams" className="gap-1.5"><Layers className="w-3.5 h-3.5" /> Work Streams</TabsTrigger>
          <TabsTrigger value="critical" className="gap-1.5"><Zap className="w-3.5 h-3.5" /> Critical Path</TabsTrigger>
          <TabsTrigger value="shift" className="gap-1.5"><Clock className="w-3.5 h-3.5" /> Shift View</TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="map">
          <MapOverview areas={areas} overallProgress={overallProgress} />
        </TabsContent>
        <TabsContent value="streams">
          <WorkStreams areas={areas} jobs={jobs} />
        </TabsContent>
        <TabsContent value="critical">
          <CriticalPath criticalJobs={criticalJobs} constraints={constraints} />
        </TabsContent>
        <TabsContent value="shift">
          <ShiftView areas={areas} jobs={jobs} criticalJobs={criticalJobs} />
        </TabsContent>
        <TabsContent value="reports">
          <Reports areas={areas} jobs={jobs} overallProgress={overallProgress} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MissionControl;
