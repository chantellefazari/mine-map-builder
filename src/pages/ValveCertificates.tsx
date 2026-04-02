import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Search, Upload, FileText, Plus, Trash2, Eye, Loader2,
  Calendar, User, MapPin, Tag, Shield,
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PdfViewerModal } from "@/components/shared/PdfViewerModal";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface ValveCertificate {
  id: string;
  certificate_number: string;
  description: string;
  valve_type: string;
  document_url: string;
  file_name: string;
  installed_date: string | null;
  installed_by: string;
  expiry_date: string | null;
  asset_number: string;
  location: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

const VALVE_TYPES = [
  "Pressure Relief Valve",
  "Safety Valve",
  "Check Valve",
  "Ball Valve",
  "Gate Valve",
  "Globe Valve",
  "Butterfly Valve",
  "Control Valve",
  "Other",
];

const STATUS_OPTIONS = ["Active", "Expired", "Retired", "Pending Recertification"];

const emptyCert: Omit<ValveCertificate, "id" | "created_at" | "updated_at"> = {
  certificate_number: "",
  description: "",
  valve_type: "",
  document_url: "",
  file_name: "",
  installed_date: null,
  installed_by: "",
  expiry_date: null,
  asset_number: "",
  location: "",
  status: "Active",
  notes: "",
};

const ValveCertificates = () => {
  const [certs, setCerts] = useState<ValveCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(emptyCert);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("valve_certificates")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Failed to load certificates");
    } else {
      setCerts((data ?? []) as ValveCertificate[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchCerts(); }, [fetchCerts]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes("pdf") && !file.type.startsWith("image/")) {
      toast.error("Please upload a PDF or image file");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop() || "pdf";
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error } = await supabase.storage
      .from("valve-certificates")
      .upload(fileName, file, { upsert: false });
    if (error) {
      console.error(error);
      toast.error("Upload failed");
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage
      .from("valve-certificates")
      .getPublicUrl(fileName);

    setForm((f) => ({
      ...f,
      document_url: urlData.publicUrl,
      file_name: file.name,
    }));
    toast.success("Document uploaded");
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleSave = async () => {
    if (!form.certificate_number.trim()) {
      toast.error("Certificate number is required");
      return;
    }
    setSaving(true);
    if (editId) {
      const { error } = await supabase
        .from("valve_certificates")
        .update(form)
        .eq("id", editId);
      if (error) {
        toast.error("Failed to update");
        console.error(error);
      } else {
        toast.success("Certificate updated");
        setShowAdd(false);
        setEditId(null);
        setForm(emptyCert);
        fetchCerts();
      }
    } else {
      const { error } = await supabase
        .from("valve_certificates")
        .insert(form);
      if (error) {
        toast.error("Failed to save");
        console.error(error);
      } else {
        toast.success("Certificate saved");
        setShowAdd(false);
        setForm(emptyCert);
        fetchCerts();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const cert = certs.find((c) => c.id === id);
    if (cert?.document_url) {
      const path = cert.document_url.split("/valve-certificates/")[1];
      if (path) await supabase.storage.from("valve-certificates").remove([path]);
    }
    const { error } = await supabase.from("valve_certificates").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Certificate deleted");
      setCerts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const openEdit = (cert: ValveCertificate) => {
    setForm({
      certificate_number: cert.certificate_number,
      description: cert.description,
      valve_type: cert.valve_type,
      document_url: cert.document_url,
      file_name: cert.file_name,
      installed_date: cert.installed_date,
      installed_by: cert.installed_by,
      expiry_date: cert.expiry_date,
      asset_number: cert.asset_number,
      location: cert.location,
      status: cert.status,
      notes: cert.notes,
    });
    setEditId(cert.id);
    setShowAdd(true);
  };

  const filtered = certs.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.certificate_number.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.valve_type.toLowerCase().includes(q) ||
      c.asset_number.toLowerCase().includes(q) ||
      c.file_name.toLowerCase().includes(q) ||
      c.installed_by.toLowerCase().includes(q)
    );
  });

  const statusColor = (s: string) => {
    if (s === "Active") return "default";
    if (s === "Expired") return "destructive";
    if (s === "Pending Recertification") return "secondary";
    return "outline";
  };

  return (
    <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Valve & Pressure Certificates</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track certificates for pressure relief valves and safety-critical equipment. Upload documents, search by certificate number, and monitor installation dates.
        </p>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by certificate number, description, asset, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={() => { setForm(emptyCert); setEditId(null); setShowAdd(true); }} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add Certificate
        </Button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="font-medium">{search ? "No matching certificates" : "No certificates yet"}</p>
          <p className="text-sm mt-1">Click "Add Certificate" to get started.</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate #</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Valve Type</TableHead>
                <TableHead>Asset #</TableHead>
                <TableHead>Last Installed</TableHead>
                <TableHead>Installed By</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Document</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cert) => (
                <TableRow key={cert.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openEdit(cert)}>
                  <TableCell className="font-mono font-medium text-primary">{cert.certificate_number || "—"}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{cert.description || "—"}</TableCell>
                  <TableCell>{cert.valve_type || "—"}</TableCell>
                  <TableCell className="font-mono text-xs">{cert.asset_number || "—"}</TableCell>
                  <TableCell>{cert.installed_date || "—"}</TableCell>
                  <TableCell>{cert.installed_by || "—"}</TableCell>
                  <TableCell>{cert.expiry_date || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor(cert.status)}>{cert.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {cert.document_url ? (
                      <Button
                        variant="ghost" size="sm"
                        onClick={(e) => { e.stopPropagation(); setPdfUrl(cert.document_url); }}
                        className="gap-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost" size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDelete(cert.id); }}
                      className="h-7 w-7 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAdd} onOpenChange={(o) => { if (!o) { setShowAdd(false); setEditId(null); setForm(emptyCert); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Certificate" : "Add Certificate"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Drop zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleFileUpload(file);
                };
                input.click();
              }}
            >
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
              ) : form.file_name ? (
                <div className="flex items-center justify-center gap-2 text-sm">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">{form.file_name}</span>
                  <span className="text-muted-foreground">(click to replace)</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop certificate PDF here, or click to browse
                  </p>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex items-center gap-1"><Tag className="h-3 w-3" /> Certificate Number *</label>
                <Input
                  value={form.certificate_number}
                  onChange={(e) => setForm((f) => ({ ...f, certificate_number: e.target.value }))}
                  placeholder="e.g. PRV-2024-001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Valve Type</label>
                <Select value={form.valve_type} onValueChange={(v) => setForm((f) => ({ ...f, valve_type: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {VALVE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Description</label>
              <Input
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief description of the valve/equipment"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex items-center gap-1"><Shield className="h-3 w-3" /> Asset Number</label>
                <Input
                  value={form.asset_number}
                  onChange={(e) => setForm((f) => ({ ...f, asset_number: e.target.value }))}
                  placeholder="e.g. PRO-PRV-001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="e.g. Boiler Room"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex items-center gap-1"><Calendar className="h-3 w-3" /> Last Installed Date</label>
                <Input
                  type="date"
                  value={form.installed_date || ""}
                  onChange={(e) => setForm((f) => ({ ...f, installed_date: e.target.value || null }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium flex items-center gap-1"><User className="h-3 w-3" /> Installed By</label>
                <Input
                  value={form.installed_by}
                  onChange={(e) => setForm((f) => ({ ...f, installed_by: e.target.value }))}
                  placeholder="Name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Expiry / Recertification Date</label>
                <Input
                  type="date"
                  value={form.expiry_date || ""}
                  onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value || null }))}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium">Notes</label>
              <Input
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Any additional notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAdd(false); setEditId(null); setForm(emptyCert); }}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-1.5" />}
              {editId ? "Save Changes" : "Add Certificate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer */}
      {pdfUrl && (
        <PdfViewerModal
          isOpen={!!pdfUrl}
          onClose={() => setPdfUrl(null)}
          pdfUrl={pdfUrl}
          title="Certificate Document"
        />
      )}
    </div>
  );
};

export default ValveCertificates;
