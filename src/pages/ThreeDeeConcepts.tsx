import ContainerGazeboConcept from "@/components/three-dee-concepts/ContainerGazeboConcept";
import { Box } from "lucide-react";

const ThreeDeeConcepts = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="container py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Box className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">3D Concepts</h1>
          <p className="text-sm text-muted-foreground">Quick visual concept designs for site layout ideas</p>
        </div>
      </div>
    </header>
    <main className="container py-8 space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Container Gazebo Concept</h2>
        <p className="text-sm text-muted-foreground mb-4">Shipping container with attached canvas canopy shade structure. Rotate, zoom, and pan to explore.</p>
        <ContainerGazeboConcept />
      </div>
    </main>
  </div>
);

export default ThreeDeeConcepts;
