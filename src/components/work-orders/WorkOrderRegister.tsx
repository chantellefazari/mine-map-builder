import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Search, Plus, Info, Hash } from "lucide-react";

interface WorkOrder {
  woNumber: string;
  title: string;
  asset: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  type: "Breakdown" | "Planned" | "Shutdown";
  status: "Open" | "In Progress" | "Completed" | "Closed";
  createdDate: string;
  assignedTo: string;
}

// Generate sample work orders starting from WO-000001
const generateSampleWorkOrders = (): WorkOrder[] => {
  const sampleData: Omit<WorkOrder, "woNumber">[] = [
    { title: "Ball Mill Gearbox Inspection", asset: "ML-BM-001", priority: "High", type: "Planned", status: "Completed", createdDate: "2024-01-15", assignedTo: "J. Smith" },
    { title: "Conveyor Belt Replacement", asset: "CV-001A", priority: "Critical", type: "Breakdown", status: "Closed", createdDate: "2024-01-16", assignedTo: "M. Johnson" },
    { title: "Pump Seal Replacement", asset: "PP-CFP-001", priority: "Medium", type: "Planned", status: "Completed", createdDate: "2024-01-18", assignedTo: "R. Williams" },
    { title: "Thickener Drive Motor Service", asset: "TH-001", priority: "High", type: "Shutdown", status: "Closed", createdDate: "2024-01-20", assignedTo: "J. Smith" },
    { title: "Crusher Liner Inspection", asset: "CR-001", priority: "Medium", type: "Planned", status: "Completed", createdDate: "2024-01-22", assignedTo: "T. Brown" },
    { title: "Cyclone Feed Pump Failure", asset: "PP-CFP-002", priority: "Critical", type: "Breakdown", status: "In Progress", createdDate: "2024-01-25", assignedTo: "M. Johnson" },
    { title: "Filter Press Cloth Change", asset: "FP-001", priority: "Low", type: "Planned", status: "Open", createdDate: "2024-01-26", assignedTo: "R. Williams" },
    { title: "Agitator Gearbox Oil Change", asset: "AG-001", priority: "Medium", type: "Planned", status: "Open", createdDate: "2024-01-27", assignedTo: "J. Smith" },
  ];

  return sampleData.map((wo, index) => ({
    ...wo,
    woNumber: `WO-${String(index + 1).padStart(6, "0")}`,
  }));
};

const priorityColors = {
  Critical: "bg-red-500/20 text-red-700 border-red-300",
  High: "bg-orange-500/20 text-orange-700 border-orange-300",
  Medium: "bg-yellow-500/20 text-yellow-700 border-yellow-300",
  Low: "bg-green-500/20 text-green-700 border-green-300",
};

const statusColors = {
  Open: "bg-blue-500/20 text-blue-700",
  "In Progress": "bg-amber-500/20 text-amber-700",
  Completed: "bg-green-500/20 text-green-700",
  Closed: "bg-gray-500/20 text-gray-700",
};

const typeColors = {
  Breakdown: "bg-red-100 text-red-800",
  Planned: "bg-blue-100 text-blue-800",
  Shutdown: "bg-purple-100 text-purple-800",
};

export const WorkOrderRegister = () => {
  const [workOrders] = useState<WorkOrder[]>(generateSampleWorkOrders());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkOrders = workOrders.filter(
    (wo) =>
      wo.woNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.asset.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextWoNumber = `WO-${String(workOrders.length + 1).padStart(6, "0")}`;

  return (
    <div className="space-y-6 p-6">
      {/* Numbering Logic Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Hash className="h-5 w-5 text-primary" />
            Work Order Numbering Logic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Format Structure</h4>
              <div className="bg-background border rounded-lg p-3">
                <code className="text-primary font-mono text-lg">WO-XXXXXX</code>
                <p className="text-xs text-muted-foreground mt-2">
                  Prefix "WO-" + 6-digit sequential number
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-foreground">Capacity</h4>
              <div className="bg-background border rounded-lg p-3">
                <p className="text-sm"><span className="font-medium">Range:</span> WO-000001 to WO-999999</p>
                <p className="text-sm"><span className="font-medium">Total Capacity:</span> 999,999 work orders</p>
                <p className="text-xs text-muted-foreground mt-1">
                  At 50 WOs/week = ~385 years of capacity
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm text-foreground mb-2">Numbering Rules</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Numbers are assigned sequentially and never reused
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Each work order receives the next available number upon creation
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                Cancelled work orders retain their number (marked as "Cancelled" status)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                Numbers provide audit trail and chronological reference
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Next Available Number:</span>
            </div>
            <Badge variant="outline" className="font-mono text-primary border-primary">
              {nextWoNumber}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Work Order Register */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Work Order Register</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search WO#, title, asset..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New Work Order
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">WO Number</TableHead>
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Asset</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Assigned</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkOrders.map((wo) => (
                  <TableRow key={wo.woNumber} className="hover:bg-muted/30 cursor-pointer">
                    <TableCell className="font-mono font-medium text-primary">
                      {wo.woNumber}
                    </TableCell>
                    <TableCell className="font-medium">{wo.title}</TableCell>
                    <TableCell className="text-muted-foreground">{wo.asset}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={typeColors[wo.type]}>
                        {wo.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={priorityColors[wo.priority]}>
                        {wo.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[wo.status]}>
                        {wo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{wo.createdDate}</TableCell>
                    <TableCell>{wo.assignedTo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <span>Showing {filteredWorkOrders.length} of {workOrders.length} work orders</span>
            <span>Total Issued: {workOrders.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
