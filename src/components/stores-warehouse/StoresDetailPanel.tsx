import React from "react";
import { Package, Warehouse, MapPin, Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoresTreeNode } from "./storesTreeData";
import { storesTreeData } from "./storesTreeData";

interface StoresDetailPanelProps {
  selectedNode: StoresTreeNode | null;
}

function findParentContainer(nodeId: string): StoresTreeNode | null {
  for (const container of storesTreeData.children || []) {
    if (container.id === nodeId) return container;
    const found = findInChildren(container, nodeId);
    if (found) return container;
  }
  return null;
}

function findInChildren(parent: StoresTreeNode, targetId: string): boolean {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === targetId) return true;
    if (findInChildren(child, targetId)) return true;
  }
  return false;
}

export const StoresDetailPanel: React.FC<StoresDetailPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm p-8">
        <div className="text-center space-y-2">
          <Warehouse className="w-10 h-10 mx-auto opacity-30" />
          <p>Select a container or item to view details</p>
        </div>
      </div>
    );
  }

  // Container detail view
  if (selectedNode.type === "container" && selectedNode.containerInfo) {
    const info = selectedNode.containerInfo;
    const usagePct = info.binPositions > 0 ? Math.min(100, Math.round((info.skuCount / info.binPositions) * 100)) : 0;

    return (
      <div className="space-y-4 p-1">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            {selectedNode.code && (
              <Badge variant="outline" className="font-mono text-xs">{selectedNode.code}</Badge>
            )}
            <Badge variant={info.status === "ok" ? "default" : "destructive"} className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              {info.status === "ok" ? "Fits" : "Review"}
            </Badge>
          </div>
          <h3 className="font-semibold text-foreground text-lg">{selectedNode.name}</h3>
          <p className="text-sm text-muted-foreground">{info.containerType}</p>
        </div>

        {/* Special Requirements */}
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{info.specialRequirement}</p>
            </div>
          </CardContent>
        </Card>

        {/* Capacity Summary */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Capacity Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">SKU Count</span>
                <p className="font-semibold text-foreground">{info.skuCount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Bin Positions</span>
                <p className="font-semibold text-foreground">{info.binPositions > 0 ? info.binPositions.toLocaleString() : "N/A (Open Yard)"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Items/Bin Ratio</span>
                <p className="font-semibold text-foreground">{info.ratio > 0 ? info.ratio.toFixed(2) : "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Usage</span>
                <p className="font-semibold text-foreground">{info.binPositions > 0 ? `${usagePct}%` : "—"}</p>
              </div>
            </div>
            {info.binPositions > 0 && (
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${usagePct >= 100 ? "bg-red-500" : usagePct >= 80 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Furniture Breakdown */}
        {info.furniture.length > 0 && (
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Furniture Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {info.furniture.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{f.qty}× {f.type}</span>
                    <span className="font-mono text-xs text-foreground">{f.positions} pos</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Access & Growth */}
        <Card className="border-border">
          <CardContent className="pt-4 pb-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Access Frequency</span>
              <span className="text-foreground font-medium">{info.accessFrequency}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Growth Allowance</span>
              <p className="text-foreground text-xs mt-0.5">{info.growthAllowance}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Site view
  if (selectedNode.type === "site") {
    return (
      <div className="space-y-4 p-1">
        <h3 className="font-semibold text-foreground text-lg">{selectedNode.name}</h3>
        <p className="text-sm text-muted-foreground">
          The TCMG stores layout comprises 5 shipping containers (C01–C05) for items ≤15 kg and a Laydown Yard (LD) for heavy/oversized items.
        </p>
        <Card className="border-border">
          <CardContent className="pt-4 pb-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Total Containers</span>
                <p className="font-semibold text-foreground">5 + LD Yard</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total SKUs</span>
                <p className="font-semibold text-foreground">2,140</p>
              </div>
              <div>
                <span className="text-muted-foreground">All Zones</span>
                <p className="font-semibold text-foreground text-green-600">✅ Clear</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Scanned</span>
                <p className="font-semibold text-foreground">2026-02-18</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Item / zone / subCategory view
  const parent = findParentContainer(selectedNode.id);
  return (
    <div className="space-y-4 p-1">
      <h3 className="font-semibold text-foreground text-lg">{selectedNode.name}</h3>
      {selectedNode.code && (
        <Badge variant="outline" className="font-mono text-xs">{selectedNode.code}</Badge>
      )}
      <Card className="border-border">
        <CardContent className="pt-4 pb-3 space-y-2">
          {parent && (
            <div className="text-sm">
              <span className="text-muted-foreground">Parent Container: </span>
              <span className="font-medium text-foreground">{parent.code} — {parent.name}</span>
            </div>
          )}
          {selectedNode.type === "subCategory" && selectedNode.children && (
            <div className="text-sm">
              <span className="text-muted-foreground">Items in category: </span>
              <span className="font-medium text-foreground">{selectedNode.children.length}</span>
            </div>
          )}
          {selectedNode.type === "item" && (
            <div className="text-sm text-muted-foreground italic">
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              Bin location assignment — future integration
            </div>
          )}
          {selectedNode.type === "zone" && (
            <div className="text-sm text-muted-foreground italic">
              <Package className="w-3.5 h-3.5 inline mr-1" />
              Forklift-accessible open bay — stock level tracking future integration
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
