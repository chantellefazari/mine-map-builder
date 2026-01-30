import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, AlertTriangle, FileSpreadsheet } from "lucide-react";

interface ProcessingSummaryProps {
  totalLines: number;
  newCount: number;
  duplicateCount: number;
  isVisible: boolean;
}

export const ProcessingSummary = ({
  totalLines,
  newCount,
  duplicateCount,
  isVisible,
}: ProcessingSummaryProps) => {
  if (!isVisible) return null;

  return (
    <Card className="border-green-500/50 bg-green-500/5">
      <CardContent className="py-4">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-700">Upload Processed Successfully</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Total Lines</p>
              <p className="text-lg font-bold">{totalLines}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">New Components</p>
              <p className="text-lg font-bold text-blue-600">{newCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {duplicateCount > 0 ? (
              <Copy className="h-4 w-4 text-amber-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            <div>
              <p className="text-xs text-muted-foreground">Duplicates Merged</p>
              <p className="text-lg font-bold">
                {duplicateCount > 0 ? (
                  <span className="text-amber-600">{duplicateCount}</span>
                ) : (
                  <span className="text-green-600">0</span>
                )}
              </p>
            </div>
          </div>
        </div>
        {duplicateCount > 0 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 bg-amber-500/10 px-3 py-2 rounded-md">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {duplicateCount} duplicate{duplicateCount > 1 ? "s" : ""} found and merged with existing components. 
              Check the <strong>Components</strong> tab and filter by "Duplicates Found" to review.
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
