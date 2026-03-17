import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AddLogicForm } from "./AddLogicForm";
import { PlantRuleInsert } from "@/hooks/usePlantIntelligence";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onSave: (rule: Partial<PlantRuleInsert>) => void;
  isSaving: boolean;
}

export function VoiceCapture({ onSave, isSaving }: Props) {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [suggested, setSuggested] = useState<Partial<PlantRuleInsert> | null>(null);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await processAudio(blob);
      };
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setRecording(true);
    } catch {
      toast({ title: "Microphone access denied", description: "Please allow microphone access to use voice capture.", variant: "destructive" });
    }
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  }, []);

  const processAudio = async (blob: Blob) => {
    setProcessing(true);
    setSuggested(null);
    try {
      // Convert to base64
      const buffer = await blob.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));

      const { data, error } = await supabase.functions.invoke("transcribe-plant-rule", {
        body: { audio_base64: base64 },
      });
      if (error) throw error;
      setTranscript(data.transcript || "");
      setSuggested(data.suggested_rule || {});
    } catch (e: any) {
      toast({ title: "Processing failed", description: e.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = (rule: Partial<PlantRuleInsert>) => {
    onSave({ ...rule, voice_transcript: transcript });
    setSuggested(null);
    setTranscript("");
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="flex flex-col items-center gap-4 py-8 bg-muted/30 rounded-lg border">
        {processing ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Transcribing and analysing your voice note…</p>
          </>
        ) : recording ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
              <Mic className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-sm text-muted-foreground">Recording… Speak your plant rule or observation.</p>
            <Button variant="destructive" onClick={stopRecording} className="gap-2">
              <Square className="w-4 h-4" /> Stop Recording
            </Button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mic className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Tap to record a voice note. AI will transcribe and suggest a structured rule.
            </p>
            <Button onClick={startRecording} className="gap-2">
              <Mic className="w-4 h-4" /> Start Recording
            </Button>
          </>
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="bg-muted/30 rounded-lg p-4 border">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Voice Transcript</p>
          <p className="text-sm italic">"{transcript}"</p>
        </div>
      )}

      {/* AI Suggested Form */}
      {suggested && (
        <div>
          <p className="text-sm font-semibold mb-3 text-foreground">AI Suggested Rule — Review & Edit</p>
          <AddLogicForm onSave={handleSave} isSaving={isSaving} initialValues={suggested} />
        </div>
      )}
    </div>
  );
}
