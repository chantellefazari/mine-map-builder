import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { storesTreeData, StoresTreeNode } from "./storesTreeData";
import { StoresTreeNodeComponent } from "./StoresTreeNode";
import { StoresDetailPanel } from "./StoresDetailPanel";

export const StoresAssetTree: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<StoresTreeNode | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
      {/* Left: Tree panel */}
      <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden">
        {/* Search bar */}
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search containers, items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 bg-background h-9 text-sm"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchTerm("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tree */}
        <div className="p-2 overflow-auto max-h-[600px]">
          <StoresTreeNodeComponent
            node={storesTreeData}
            selectedId={selectedNode?.id ?? null}
            onSelect={setSelectedNode}
            searchTerm={searchTerm}
          />
        </div>
      </div>

      {/* Right: Detail panel */}
      <div className="lg:w-[380px] bg-card border border-border rounded-lg overflow-auto max-h-[660px]">
        <StoresDetailPanel selectedNode={selectedNode} />
      </div>
    </div>
  );
};
