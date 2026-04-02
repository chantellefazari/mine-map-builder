import { useAuth } from "@/context/AuthContext";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={doc.file} download>
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  </Button>
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
    </div>
  );
};

export default Home;
