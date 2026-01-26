import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, AlertCircle, HelpCircle, FileQuestion, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OpenItem {
  id: string;
  title: string;
  category: "equipment" | "oem" | "assumption" | "decision" | "confirmation";
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdDate: string;
  notes: string;
}

const initialItems: OpenItem[] = [
  {
    id: "1",
    title: "Ball Mill Gearbox Oil Specification",
    category: "oem",
    description: "Need to confirm exact oil specification from Flender for the ball mill gearbox.",
    status: "open",
    createdDate: "2024-01-15",
    notes: "Contacted Flender rep - awaiting response",
  },
  {
    id: "2",
    title: "Standby Pump PM Frequency",
    category: "decision",
    description: "Decide whether standby pumps should have 50% or 75% of duty PM frequency.",
    status: "in-progress",
    createdDate: "2024-01-18",
    notes: "Discussing with maintenance team",
  },
  {
    id: "3",
    title: "Cyclone Feed Pump B Serial Number",
    category: "equipment",
    description: "Serial number plate is unreadable on Pump B. Need site confirmation.",
    status: "open",
    createdDate: "2024-01-20",
    notes: "",
  },
  {
    id: "4",
    title: "Assumed Conveyor Belt Width",
    category: "assumption",
    description: "Belt width assumed to be 1200mm based on similar installations. Needs verification.",
    status: "open",
    createdDate: "2024-01-22",
    notes: "",
  },
];

const categoryIcons = {
  equipment: AlertCircle,
  oem: FileQuestion,
  assumption: HelpCircle,
  decision: AlertCircle,
  confirmation: CheckCircle,
};

const categoryColors = {
  equipment: "bg-amber-500/20 text-amber-700",
  oem: "bg-primary/20 text-primary",
  assumption: "bg-purple-500/20 text-purple-700",
  decision: "bg-destructive/20 text-destructive",
  confirmation: "bg-green-500/20 text-green-700",
};

const statusColors = {
  open: "bg-destructive/20 text-destructive",
  "in-progress": "bg-amber-500/20 text-amber-700",
  resolved: "bg-green-500/20 text-green-700",
};

export const OpenItemsList = () => {
  const [items, setItems] = useState<OpenItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const openCount = items.filter((i) => i.status === "open").length;
  const inProgressCount = items.filter((i) => i.status === "in-progress").length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{openCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{items.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and List */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Open Items Register</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-56"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="oem">OEM Data</SelectItem>
                <SelectItem value="assumption">Assumption</SelectItem>
                <SelectItem value="decision">Decision</SelectItem>
                <SelectItem value="confirmation">Confirmation</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredItems.map((item) => {
            const CategoryIcon = categoryIcons[item.category];
            return (
              <div
                key={item.id}
                className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${categoryColors[item.category]}`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      {item.notes && (
                        <p className="text-sm text-primary mt-2 italic">Note: {item.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.createdDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No items match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
