import { Calendar } from "lucide-react";

export function WOCSchedule() {
  return (
    <div className="p-8 flex items-center justify-center h-full">
      <div className="text-center space-y-3">
        <div className="mx-auto w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
          <Calendar className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground">Schedule</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          Work order scheduling functionality is coming soon. Planned and ready work orders will be schedulable here.
        </p>
      </div>
    </div>
  );
}
