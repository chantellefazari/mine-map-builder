import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Play, Pause, Square, Wand2, ChevronDown, AlertCircle, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import type { BatchProgress } from "@/hooks/useBatchImageGeneration";

interface BatchImageGenerationPanelProps {
  progress: BatchProgress;
  availableCategories: string[];
  getPartsWithoutImages: (category: string | null) => number;
  onStart: (category: string | null, selectedIds?: string[]) => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onRefresh?: () => void;
  // Selection mode props
  selectionMode?: boolean;
  selectedCount?: number;
  onToggleSelectionMode?: () => void;
  onSelectAllWithoutImages?: () => void;
  onSelectHighCriticality?: () => void;
  onClearSelection?: () => void;
  selectedIds?: string[];
}

export const BatchImageGenerationPanel = ({
  progress,
  availableCategories,
  getPartsWithoutImages,
  onStart,
  onPause,
  onResume,
  onStop,
  onRefresh,
  selectionMode = false,
  selectedCount = 0,
  onToggleSelectionMode,
  onSelectAllWithoutImages,
  onSelectHighCriticality,
  onClearSelection,
  selectedIds,
}: BatchImageGenerationPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFailedItems, setShowFailedItems] = useState(false);

  const partsWithoutImages = getPartsWithoutImages(selectedCategory === "all" ? null : selectedCategory);
  const progressPercent = progress.total > 0 ? (progress.processed / progress.total) * 100 : 0;

  const remainingItems = progress.total - progress.processed;
  const estimatedSecondsPerItem = 15;
  const estimatedRemainingSeconds = remainingItems * estimatedSecondsPerItem;
  const estimatedMinutes = Math.ceil(estimatedRemainingSeconds / 60);

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `~${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `~${hours}h ${mins}min`;
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Batch AI Image Generation</h3>
        </div>
        {onToggleSelectionMode && !progress.isRunning && (
          <Button
            size="sm"
            variant={selectionMode ? "default" : "outline"}
            onClick={onToggleSelectionMode}
          >
            {selectionMode ? "Exit Selection" : "Select Parts"}
          </Button>
        )}
      </div>

      {!progress.isRunning && progress.processed === 0 && (
        <div className="space-y-3">
          {selectionMode ? (
            // Selection mode UI
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={onSelectHighCriticality}>
                  Select All HIGH
                </Button>
                <Button size="sm" variant="outline" onClick={onSelectAllWithoutImages}>
                  Select All Without Images
                </Button>
                <Button size="sm" variant="ghost" onClick={onClearSelection}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {selectedCount} parts selected
                </span>
                <Button
                  onClick={() => onStart(null, selectedIds)}
                  disabled={selectedCount === 0}
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Generate {selectedCount} Images
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click on cards without images to select/deselect. HIGH criticality parts are processed first.
              </p>
            </div>
          ) : (
            // Category filter mode (legacy)
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  {partsWithoutImages} parts without images
                </span>
              </div>
              <Button
                onClick={() => onStart(selectedCategory === "all" ? null : selectedCategory)}
                disabled={partsWithoutImages === 0}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Start Batch Generation
              </Button>
              {partsWithoutImages === 0 && (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    All parts in this category already have images
                  </p>
                  {onRefresh && (
                    <Button size="sm" variant="ghost" onClick={onRefresh} className="gap-1">
                      <RefreshCw className="h-3 w-3" />
                      Refresh count
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {(progress.isRunning || progress.processed > 0) && (
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                Progress: {progress.processed} / {progress.total}
              </span>
              <span>{progressPercent.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {progress.currentItem && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-muted-foreground">Processing:</span>
              <span className="font-medium truncate max-w-[300px]">{progress.currentItem}</span>
            </div>
          )}

          <div className="flex gap-4 text-sm">
            <span className="text-green-600">✓ Generated: {progress.generated}</span>
            <span className="text-red-600">✗ Failed: {progress.failed}</span>
            {progress.skipped > 0 && (
              <span className="text-muted-foreground">⊘ Skipped: {progress.skipped}</span>
            )}
            {progress.isRunning && (
              <span className="text-muted-foreground">
                Est. remaining: {formatTime(estimatedMinutes)}
              </span>
            )}
          </div>

          {progress.isRunning && (
            <div className="flex gap-2">
              {progress.isPaused ? (
                <Button size="sm" variant="outline" onClick={onResume} className="gap-2">
                  <Play className="h-4 w-4" />
                  Resume
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={onPause} className="gap-2">
                  <Pause className="h-4 w-4" />
                  Pause
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={onStop} className="gap-2">
                <Square className="h-4 w-4" />
                Stop
              </Button>
            </div>
          )}

          {!progress.isRunning && progress.processed > 0 && (
            <div className="flex items-center gap-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Batch complete! Generated {progress.generated} images.
                {progress.failed > 0 && ` (${progress.failed} failed, ${progress.skipped} skipped)`}
              </span>
              {onRefresh && (
                <Button size="sm" variant="outline" onClick={onRefresh} className="gap-1 ml-2">
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </Button>
              )}
            </div>
          )}

          {progress.failedItems.length > 0 && (
            <Collapsible open={showFailedItems} onOpenChange={setShowFailedItems}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  View {progress.failedItems.length} failed items
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showFailedItems ? "rotate-180" : ""}`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 max-h-40 overflow-y-auto rounded border border-border bg-muted/50 p-2 text-xs space-y-1">
                  {progress.failedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate max-w-[200px]">{item.description}</span>
                      <span className="text-red-500">{item.error}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}
    </div>
  );
};
