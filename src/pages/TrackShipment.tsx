import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, AlertCircle, MapPin, Truck, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Checkpoint {
  id: string;
  location: string;
  notes: string;
  scanned_by: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

interface POInfo {
  po_number: string;
  supplier: string;
  description: string;
  status: string;
  image_url?: string | null;
}

const TrackShipment = () => {
  const [searchParams] = useSearchParams();
  const poId = searchParams.get("po");
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [poInfo, setPOInfo] = useState<POInfo | null>(null);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [scannedBy, setScannedBy] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const resolvedPoId = poId || null;

  useEffect(() => {
    if (!resolvedPoId && !token) {
      setError("No tracking reference provided");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        let actualPoId = resolvedPoId;

        // If token provided, resolve PO id from token
        if (!actualPoId && token) {
          const { data: po } = await (supabase as any)
            .from("po_tracker")
            .select("id")
            .eq("confirmation_token", token)
            .single();
          if (po) actualPoId = po.id;
        }

        if (!actualPoId) {
          setError("Invalid tracking reference");
          return;
        }

        // Get PO info with image from linked quote
        const { data: po } = await (supabase as any)
          .from("po_tracker")
          .select("po_number, supplier, description, status, quote_request_id")
          .eq("id", actualPoId)
          .single();

        if (!po) {
          setError("Purchase order not found");
          return;
        }

        let image_url: string | null = null;
        if (po.quote_request_id) {
          const { data: qr } = await (supabase as any)
            .from("quote_requests")
            .select("image_url")
            .eq("id", po.quote_request_id)
            .single();
          if (qr?.image_url) image_url = qr.image_url;
        }

        setPOInfo({ ...po, image_url, quote_request_id: undefined } as POInfo);

        // Get checkpoints
        const { data: cps } = await (supabase as any)
          .from("po_transit_checkpoints")
          .select("*")
          .eq("po_tracker_id", actualPoId)
          .order("created_at", { ascending: true });

        setCheckpoints(cps || []);
      } catch {
        setError("Failed to load tracking data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [resolvedPoId, token]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
        toast.success("Location captured");
      },
      () => {
        setGeoLoading(false);
        toast.error("Could not get location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!location.trim()) {
      toast.error("Location is required");
      return;
    }

    let actualPoId = resolvedPoId;
    if (!actualPoId && token) {
      const { data: po } = await (supabase as any)
        .from("po_tracker")
        .select("id")
        .eq("confirmation_token", token)
        .single();
      if (po) actualPoId = po.id;
    }

    if (!actualPoId) {
      toast.error("Cannot resolve PO");
      return;
    }

    setSubmitting(true);
    try {
      const { error: insertErr } = await (supabase as any)
        .from("po_transit_checkpoints")
        .insert({
          po_tracker_id: actualPoId,
          location: location.trim(),
          notes: notes.trim(),
          scanned_by: scannedBy.trim(),
          latitude: coords?.lat || null,
          longitude: coords?.lng || null,
        });

      if (insertErr) throw insertErr;

      // Refresh checkpoints
      const { data: cps } = await (supabase as any)
        .from("po_transit_checkpoints")
        .select("*")
        .eq("po_tracker_id", actualPoId)
        .order("created_at", { ascending: true });

      setCheckpoints(cps || []);
      setLocation("");
      setNotes("");
      setScannedBy("");
      setCoords(null);
      toast.success("Checkpoint added");
    } catch (err: any) {
      toast.error(err.message || "Failed to add checkpoint");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-lg font-semibold">Tracking Error</h2>
            <p className="text-muted-foreground text-sm">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-lg bg-primary mx-auto flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">TC</span>
          </div>
          <h1 className="text-xl font-bold">Shipment Tracking</h1>
          <p className="text-muted-foreground text-sm">TCMG – Tennant Creek Gold Mine</p>
        </div>

        {/* PO Info */}
        {poInfo && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="font-mono">{poInfo.po_number}</span>
                <Badge variant="secondary">{poInfo.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Supplier:</span> {poInfo.supplier}</p>
                <p><span className="text-muted-foreground">Description:</span> {poInfo.description}</p>
              </div>
              {poInfo.image_url && (
                <div className="flex justify-center">
                  <img src={poInfo.image_url} alt="Part" className="rounded-md border max-h-32 object-contain bg-white" />
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Transit Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Truck className="h-4 w-4" /> Transit History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {checkpoints.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No checkpoints recorded yet</p>
            ) : (
              <div className="space-y-3">
                {checkpoints.map((cp, i) => (
                  <div key={cp.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === checkpoints.length - 1 ? "bg-primary" : "bg-muted-foreground/40"}`} />
                      {i < checkpoints.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{cp.location}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(cp.created_at), "dd MMM yyyy, HH:mm")}
                        {cp.scanned_by && ` • by ${cp.scanned_by}`}
                      </p>
                      {cp.notes && <p className="text-xs mt-1">{cp.notes}</p>}
                      {cp.latitude && cp.longitude && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          GPS: {cp.latitude.toFixed(4)}, {cp.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Checkpoint */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Package className="h-4 w-4" /> Add Location Checkpoint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs">Current Location *</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Adelaide freight depot, Alice Springs warehouse..."
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Your Name</Label>
              <Input
                value={scannedBy}
                onChange={(e) => setScannedBy(e.target.value)}
                placeholder="e.g. John Smith"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any delivery notes..."
                className="min-h-[50px] text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1"
                onClick={getLocation}
                disabled={geoLoading}
              >
                {geoLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <MapPin className="h-3 w-3" />}
                {coords ? "Location Captured ✓" : "Capture GPS"}
              </Button>
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
              Add Checkpoint
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrackShipment;
