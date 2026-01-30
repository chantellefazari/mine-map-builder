import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileInput, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { POUploadArea } from "@/components/po-import/POUploadArea";
import { RawPOLinesTable } from "@/components/po-import/RawPOLinesTable";
import { NormalizedComponentsTable } from "@/components/po-import/NormalizedComponentsTable";
import { UploadHistoryTable } from "@/components/po-import/UploadHistoryTable";
import { usePOImport, POLineItem } from "@/hooks/usePOImport";

const POImport = () => {
  const {
    uploads,
    lineItems,
    normalizedComponents,
    isLoading,
    selectedUploadId,
    setSelectedUploadId,
    createUpload,
    addLineItems,
    normalizeAndDeduplicate,
    updateComponent,
    deleteUpload,
    fetchLineItems,
  } = usePOImport();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpload = async (
    metadata: {
      supplierName: string;
      category: string;
      dateRangeCovered: string;
      notes: string;
      fileName: string;
      fileType: string;
    },
    parsedLineItems: Omit<POLineItem, "id" | "uploadId">[]
  ) => {
    setIsProcessing(true);
    try {
      const uploadId = await createUpload(metadata);
      if (!uploadId) return;

      const success = await addLineItems(uploadId, parsedLineItems);
      if (!success) return;

      await normalizeAndDeduplicate(uploadId, metadata.supplierName);
      setSelectedUploadId(uploadId);
      await fetchLineItems(uploadId);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileInput className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  PO Import + Component Cleaner
                </h1>
                <p className="text-sm text-muted-foreground">
                  Extract, normalise, and deduplicate components from purchase order exports
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="upload">Upload & History</TabsTrigger>
            <TabsTrigger value="raw">Raw PO Lines</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <POUploadArea onUpload={handleUpload} isProcessing={isProcessing} />
            <UploadHistoryTable
              uploads={uploads}
              selectedUploadId={selectedUploadId}
              onSelectUpload={(id) => {
                setSelectedUploadId(id);
                if (id) fetchLineItems(id);
              }}
              onDeleteUpload={deleteUpload}
            />
          </TabsContent>

          <TabsContent value="raw">
            <RawPOLinesTable
              lineItems={lineItems}
              selectedUploadId={selectedUploadId}
            />
          </TabsContent>

          <TabsContent value="components">
            <NormalizedComponentsTable
              components={normalizedComponents}
              onUpdateComponent={updateComponent}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default POImport;
