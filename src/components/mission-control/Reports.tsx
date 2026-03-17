import { MissionJob, AreaSummary } from "@/hooks/useMissionControl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, FileSpreadsheet, BarChart3 } from "lucide-react";

interface Props {
  areas: AreaSummary[];
  jobs: MissionJob[];
  overallProgress: number;
}

export function Reports({ areas, jobs, overallProgress }: Props) {
  const statusCounts = {
    "Not Started": jobs.filter(j => j.status === "Not Started").length,
    "In Progress": jobs.filter(j => j.status === "In Progress").length,
    "Blocked": jobs.filter(j => j.status === "Blocked").length,
    "At Risk": jobs.filter(j => j.status === "At Risk").length,
    "Complete": jobs.filter(j => j.status === "Complete").length,
  };

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFontSize(16);
    doc.text("Mission Control — Shutdown Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Overall Progress: ${overallProgress}%`, 14, 35);

    let y = 45;
    doc.setFontSize(12);
    doc.text("Area Performance", 14, y);
    y += 8;
    doc.setFontSize(9);
    for (const area of areas) {
      doc.text(`${area.area}: ${area.totalJobs} jobs | ${area.completed} done | ${area.delayed} delayed`, 14, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 20; }
    }

    y += 6;
    doc.setFontSize(12);
    doc.text("Job Status Summary", 14, y);
    y += 8;
    doc.setFontSize(9);
    for (const [status, count] of Object.entries(statusCounts)) {
      doc.text(`${status}: ${count}`, 14, y);
      y += 6;
    }

    doc.save("mission-control-report.pdf");
  };

  const handleExportExcel = async () => {
    const { default: loadXLSX } = await import("xlsx").then(m => ({ default: m }));
    const XLSX = loadXLSX;
    const ws = XLSX.utils.json_to_sheet(
      jobs.map(j => ({
        "WO Number": j.woNumber,
        "Job Name": j.name,
        "Area": j.area,
        "Status": j.status,
        "% Complete": j.percentComplete,
        "Crew": j.assignedCrew,
        "Remaining Hours": j.remainingHours,
        "Priority": j.priority,
        "Blockers": j.blockers,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mission Control");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buf], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mission-control-report.xlsx";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 5000);
  };

  return (
    <div className="space-y-6">
      {/* Export buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs font-semibold transition-colors"
        >
          <FileDown className="w-4 h-4" /> Export PDF
        </button>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-xs font-semibold transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" /> Export Excel
        </button>
      </div>

      {/* Overall stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Overall Shutdown Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={overallProgress} className="h-4 flex-1" />
            <span className="text-2xl font-black text-primary">{overallProgress}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Status breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Job Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="text-center rounded-lg border border-border p-3">
                <p className="text-2xl font-black text-foreground">{count}</p>
                <Badge
                  variant={status === "Blocked" ? "destructive" : status === "Complete" ? "default" : "secondary"}
                  className="text-[10px] mt-1"
                >
                  {status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Area performance table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Area Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Area</TableHead>
                <TableHead className="text-xs text-center">Total</TableHead>
                <TableHead className="text-xs text-center">In Progress</TableHead>
                <TableHead className="text-xs text-center">Completed</TableHead>
                <TableHead className="text-xs text-center">Delayed</TableHead>
                <TableHead className="text-xs text-center">Completion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area) => {
                const pct = area.totalJobs > 0 ? Math.round((area.completed / area.totalJobs) * 100) : 0;
                return (
                  <TableRow key={area.area}>
                    <TableCell className="text-xs font-medium">{area.area}</TableCell>
                    <TableCell className="text-xs text-center">{area.totalJobs}</TableCell>
                    <TableCell className="text-xs text-center text-blue-500">{area.inProgress}</TableCell>
                    <TableCell className="text-xs text-center text-emerald-500">{area.completed}</TableCell>
                    <TableCell className="text-xs text-center text-red-500">{area.delayed}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center gap-2">
                        <Progress value={pct} className="h-2 flex-1" />
                        <span className="text-xs font-bold w-8">{pct}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
