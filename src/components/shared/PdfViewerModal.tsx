import React from "react";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title = "PDF Preview",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0"
        aria-describedby={undefined}
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in new tab
            </a>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <object
            data={pdfUrl}
            type="application/pdf"
            className="w-full h-full border-0"
            style={{ minHeight: "calc(95vh - 52px)" }}
          >
            <embed
              src={pdfUrl}
              type="application/pdf"
              className="w-full h-full border-0"
              style={{ minHeight: "calc(95vh - 52px)" }}
            />
          </object>
        </div>
      </DialogContent>
    </Dialog>
  );
};
