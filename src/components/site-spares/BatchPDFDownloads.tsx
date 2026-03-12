import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Loader2, CheckCircle2, Trash2, RefreshCw, Server } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { downloadBlob } from "@/utils/safariDownload";
import { toast } from "sonner";
import {
  countAllSpares,
  getBatchCount,
  getBatchLabel,
  getExistingBatches,
  generateBatchPDF,
  clearAllBatchPDFs,
} from "@/utils/generateBatchSparesPDF";

const COMPLETE_PDF_PATH = "Complete_Parts_List_All.pdf";

export const BatchPDFDownloads = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [existingBatches, setExistingBatches] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [generatingBatch, setGeneratingBatch] = useState<number | null>(null);
  const [progressMsg, setProgressMsg] = useState("");
  const [progressPct, setProgressPct] = useState(0);

  // Complete PDF state
  const [completePdfExists, setCompletePdfExists] = useState(false);
  const [generatingComplete, setGeneratingComplete] = useState(false);

  const checkCompletePdf = useCallback(async () => {
    const { data } = await supabase.storage.from("temp-pdfs").list("", { limit: 100 });
    if (data?.some((f) => f.name === COMPLETE_PDF_PATH)) {
      setCompletePdfExists(true);
    } else {
      setCompletePdfExists(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const count = await countAllSpares();
      setTotalItems(count);
      const existing = await getExistingBatches(count);
      setExistingBatches(existing);
      await checkCompletePdf();
    } catch (err) {
      console.error(err);
      toast.error("Failed to load batch info");
    }
    setLoading(false);
  }, [checkCompletePdf]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const batchCount = getBatchCount(totalItems);

  const handleGenerate = async (batchIndex: number) => {
    setGeneratingBatch(batchIndex);
    setProgressPct(0);
    setProgressMsg("Starting...");

    try {
      await generateBatchPDF(batchIndex, totalItems, (msg) => {
        setProgressMsg(msg);
        if (msg.includes("Fetching")) setProgressPct(10);
        else if (msg.includes("Downloaded")) {
          const match = msg.match(/(\d+)\/(\d+)/);
          if (match) setProgressPct(10 + (parseInt(match[1]) / parseInt(match[2])) * 60);
        } else if (msg.includes("Building")) setProgressPct(75);
        else if (msg.includes("Uploading")) setProgressPct(90);
      });

      setProgressPct(100);
      setProgressMsg("Done!");
      toast.success(`Batch ${batchIndex + 1} generated successfully`);

      const existing = await getExistingBatches(totalItems);
      setExistingBatches(existing);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate batch PDF");
    } finally {
      setTimeout(() => {
        setGeneratingBatch(null);
        setProgressMsg("");
        setProgressPct(0);
      }, 1000);
    }
  };

  const handleDownload = async (batchIndex: number) => {
    const label = getBatchLabel(batchIndex, totalItems);
    const storagePath = `spares-batches/Parts_List_${label}.pdf`;
    const { data, error } = await supabase.storage.from("temp-pdfs").download(storagePath);
    if (error || !data) {
      toast.error("Failed to download PDF");
      return;
    }
    downloadBlob(data, `Parts_List_${label}.pdf`);
  };

  const handleClearAll = async () => {
    try {
      await clearAllBatchPDFs(totalItems);
      setExistingBatches(new Set());
      toast.success("All batch PDFs cleared");
    } catch {
      toast.error("Failed to clear PDFs");
    }
  };

  const handleGenerateAll = async () => {
    for (let i = 0; i < batchCount; i++) {
      if (existingBatches.has(i)) continue;
      await handleGenerate(i);
      await new Promise((r) => setTimeout(r, 500));
    }
    toast.success("All batches generated!");
  };

  // Complete PDF handlers
  const handleGenerateComplete = async () => {
    setGeneratingComplete(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-spares-pdf");
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(
        `Complete PDF generated: ${data.totalItems} parts, ${data.imagesEmbedded} images, ${data.pages} pages`
      );
      setCompletePdfExists(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate complete PDF");
    } finally {
      setGeneratingComplete(false);
    }
  };

  const handleDownloadComplete = async () => {
    const { data, error } = await supabase.storage.from("temp-pdfs").download(COMPLETE_PDF_PATH);
    if (error || !data) {
      toast.error("Failed to download complete PDF");
      return;
    }
    downloadBlob(data, "Complete_Parts_List_All.pdf");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading batch info...</span>
      </div>
    );
  }

  const generatedCount = existingBatches.size;

  return (
    <div className="space-y-6">
      {/* Complete PDF Section */}
      <div className="border border-primary/20 bg-primary/5 rounded-lg p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              Complete Parts List (Server-Generated)
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Generate a single PDF with all {totalItems} parts including images.
              Processed on the server to avoid browser memory limits.
            </p>
          </div>
          <div className="flex gap-2">
            {completePdfExists && (
              <Button size="sm" variant="outline" className="gap-2" onClick={handleDownloadComplete}>
                <Download className="h-4 w-4" />
                Download Complete PDF
              </Button>
            )}
            <Button
              size="sm"
              className="gap-2"
              onClick={handleGenerateComplete}
              disabled={generatingComplete}
            >
              {generatingComplete ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              {generatingComplete
                ? "Generating on Server..."
                : completePdfExists
                ? "Regenerate"
                : "Generate Complete PDF"}
            </Button>
          </div>
        </div>
        {generatingComplete && (
          <div className="mt-3 bg-muted/50 rounded p-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            This may take 30–60 seconds. The server is fetching all parts, downloading images, and
            building the PDF...
          </div>
        )}
        {completePdfExists && !generatingComplete && (
          <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Complete PDF is ready for download
          </div>
        )}
      </div>

      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Batched PDF Parts Lists</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} total parts split into {batchCount} batches of {Math.min(100, totalItems)} items each.
            Generated in-browser with embedded thumbnail images.
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-2" onClick={refresh}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {generatedCount > 0 && (
            <Button size="sm" variant="outline" className="gap-2 text-destructive" onClick={handleClearAll}>
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
          {generatedCount < batchCount && (
            <Button
              size="sm"
              className="gap-2"
              onClick={handleGenerateAll}
              disabled={generatingBatch !== null}
            >
              <FileText className="h-4 w-4" />
              Generate All Remaining
            </Button>
          )}
        </div>
      </div>

      {/* Progress bar for active generation */}
      {generatingBatch !== null && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Generating Batch {generatingBatch + 1}...</span>
            <span className="text-muted-foreground">{progressMsg}</span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      )}

      {/* Status bar */}
      <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {generatedCount} of {batchCount} batches generated
        </span>
        <Progress value={(generatedCount / batchCount) * 100} className="w-48 h-2" />
      </div>

      {/* Batch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Array.from({ length: batchCount }, (_, i) => {
          const isGenerated = existingBatches.has(i);
          const isGenerating = generatingBatch === i;
          const label = getBatchLabel(i, totalItems);
          const start = i * 100 + 1;
          const end = Math.min((i + 1) * 100, totalItems);
          const itemCount = end - start + 1;

          return (
            <div
              key={i}
              className={`border rounded-lg p-4 transition-all ${
                isGenerated ? "border-green-500/30 bg-green-500/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className={`h-4 w-4 ${isGenerated ? "text-green-500" : "text-muted-foreground"}`} />
                    <span className="font-medium text-sm">Batch {i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Items {label} ({itemCount} parts)
                  </p>
                </div>
                {isGenerated && <CheckCircle2 className="h-5 w-5 text-green-500" />}
              </div>

              <div className="flex gap-2">
                {isGenerated ? (
                  <>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => handleDownload(i)}>
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                      onClick={() => handleGenerate(i)}
                      disabled={isGenerating}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleGenerate(i)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <FileText className="h-3.5 w-3.5" />
                    )}
                    {isGenerating ? "Generating..." : "Generate"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
