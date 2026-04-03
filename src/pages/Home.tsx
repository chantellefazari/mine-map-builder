import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Download, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const documents = [
  {
    name: "TCMG CMMS Roles, RACI & Workflows",
    file: "/documents/TCMG_CMMS_Roles_RACI_Workflows.pptx",
    type: "PPTX",
    description: "10-slide presentation covering CMMS roles, RACI matrix, WO/PR/PM flowcharts, escalation rules, and role-based access.",
  },
];

const Home = () => {
  const { user, isAdmin } = useAuth();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = (doc: typeof documents[0]) => {
    const publishedOrigin = "https://mine-map-builder.lovable.app";
    const fullUrl = `${publishedOrigin}${doc.file}`;
    const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
    setPreviewUrl(viewerUrl);
    setPreviewTitle(doc.name);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-1">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-muted-foreground">
          TCMG Asset & Maintenance Framework
          {isAdmin && <span className="ml-2 text-primary font-semibold">• Admin</span>}
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Use the sidebar to navigate between modules.
        </p>
      </div>

      {/* Documents Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Documents & Presentations</h2>
        <div className="grid gap-4 max-w-2xl">
          {documents.map((doc) => (
            <Card key={doc.file} className="border-border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">{doc.name}</CardTitle>
                      <span className="text-xs text-muted-foreground">{doc.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => handlePreview(doc)}>
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={doc.file} download>
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{doc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          Tennant Creek Gold Mine • Design workspace for CMMS/D365 readiness
        </p>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 gap-0" aria-describedby={undefined}>
          <div className="p-3 border-b border-border flex items-center justify-between">
            <DialogTitle className="text-sm font-semibold">{previewTitle}</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setPreviewUrl(null)} className="h-7 w-7">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full border-0"
                style={{ minHeight: "calc(95vh - 52px)" }}
                allowFullScreen
                title={previewTitle}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
