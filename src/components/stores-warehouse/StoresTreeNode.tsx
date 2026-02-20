import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Warehouse, Container, FolderOpen, Package, MapPin, Zap, Gauge, Wrench, Cog, Hammer } from "lucide-react";
import { StoresTreeNode as NodeType, countItems } from "./storesTreeData";

interface StoresTreeNodeProps {
  node: NodeType;
  selectedId: string | null;
  onSelect: (node: NodeType) => void;
  searchTerm: string;
  depth?: number;
}

const containerIcons: Record<string, React.ElementType> = {
  "C01-EL": Zap,
  "C02-IN": Gauge,
  "C03-ME": Wrench,
  "C04-MP": Cog,
  "C05-CS": Hammer,
  "LD": MapPin,
};

const containerColors: Record<string, string> = {
  "C01-EL": "text-yellow-600 dark:text-yellow-400",
  "C02-IN": "text-purple-600 dark:text-purple-400",
  "C03-ME": "text-blue-600 dark:text-blue-400",
  "C04-MP": "text-cyan-600 dark:text-cyan-400",
  "C05-CS": "text-slate-600 dark:text-slate-400",
  "LD": "text-orange-600 dark:text-orange-400",
};

const containerBg: Record<string, string> = {
  "C01-EL": "bg-yellow-500/10",
  "C02-IN": "bg-purple-500/10",
  "C03-ME": "bg-blue-500/10",
  "C04-MP": "bg-cyan-500/10",
  "C05-CS": "bg-slate-500/10",
  "LD": "bg-orange-500/10",
};

function matchesSearch(node: NodeType, term: string): boolean {
  if (!term) return true;
  const lower = term.toLowerCase();
  if (node.name.toLowerCase().includes(lower)) return true;
  if (node.code?.toLowerCase().includes(lower)) return true;
  if (node.children?.some(c => matchesSearch(c, term))) return true;
  return false;
}

export const StoresTreeNodeComponent: React.FC<StoresTreeNodeProps> = ({
  node,
  selectedId,
  onSelect,
  searchTerm,
  depth = 0,
}) => {
  const [expanded, setExpanded] = useState(node.type === "site");
  const hasChildren = !!node.children?.length;
  const isSelected = selectedId === node.id;

  // Auto-expand when searching
  const shouldShow = matchesSearch(node, searchTerm);
  const isAutoExpanded = searchTerm.length > 0 && shouldShow && hasChildren;
  const isOpen = expanded || isAutoExpanded;

  if (!shouldShow) return null;

  const getIcon = () => {
    if (node.type === "site") return Warehouse;
    if (node.type === "container" && node.code) return containerIcons[node.code] || Container;
    if (node.type === "subCategory") return FolderOpen;
    if (node.type === "zone") return MapPin;
    return Package;
  };

  const Icon = getIcon();
  const colorClass = node.code ? containerColors[node.code] || "text-muted-foreground" : "text-muted-foreground";
  const bgClass = node.code ? containerBg[node.code] || "" : "";
  const itemCount = hasChildren ? countItems(node) : 0;

  const handleClick = () => {
    if (hasChildren) setExpanded(!expanded);
    onSelect(node);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
          "hover:bg-muted/60",
          isSelected && "bg-primary/10 ring-1 ring-primary/30",
          depth === 0 && "font-semibold text-base py-2",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Expand/collapse chevron */}
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          )
        ) : (
          <span className="w-3.5 flex-shrink-0" />
        )}

        {/* Icon */}
        <div className={cn("w-6 h-6 rounded flex items-center justify-center flex-shrink-0", bgClass)}>
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
        </div>

        {/* Code badge */}
        {node.code && (
          <span className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground flex-shrink-0">
            {node.code}
          </span>
        )}

        {/* Name */}
        <span className="truncate text-foreground">{node.name}</span>

        {/* Item count badge */}
        {hasChildren && (node.type === "container" || node.type === "subCategory") && (
          <span className="ml-auto text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full flex-shrink-0">
            {itemCount}
          </span>
        )}
      </div>

      {/* Children */}
      {isOpen && hasChildren && (
        <div>
          {node.children!.map(child => (
            <StoresTreeNodeComponent
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              searchTerm={searchTerm}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
