import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text, Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { PACKAGES, SHUTDOWN_AREAS, buildAreaSummaries, type AreaSummary } from "./shutdownData";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const STATUS_COLOR: Record<string, string> = {
  Ready:    "#3b82f6",
  Active:   "#10b981",
  "At Risk": "#f59e0b",
  Delayed:  "#ef4444",
  Complete: "#6b7280",
};

/**
 * 3D zone positions — approximate layout matching the aerial photo.
 * Origin is center of the ground plane. X = east, Z = south.
 * Each zone: { code, position: [x, y, z], size: [w, h, d] }
 */
const ZONE_LAYOUT: Record<string, { pos: [number, number, number]; size: [number, number, number] }> = {
  "Site Infrastructure":    { pos: [-6,  0.15, -5],  size: [5, 0.3, 4] },
  "Utilities & Power":      { pos: [ 5,  0.15, -5],  size: [4, 0.3, 4] },
  "Comminution / Process":  { pos: [-2,  0.15,  0],  size: [7, 0.3, 5] },
  "Gold Recovery":          { pos: [ 5,  0.15,  1],  size: [4, 0.3, 5] },
  "Tailings":               { pos: [-5,  0.15,  5],  size: [5, 0.3, 3] },
  "Support Services":       { pos: [ 4,  0.15,  5],  size: [4, 0.3, 3] },
};

/* ------------------------------------------------------------------ */
/*  SUB-COMPONENTS                                                     */
/* ------------------------------------------------------------------ */

function Ground() {
  const texture = useLoader(THREE.TextureLoader, "/images/plant-aerial.png");
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[24, 18]} />
      <meshStandardMaterial map={texture} roughness={1} />
    </mesh>
  );
}

interface ZoneBlockProps {
  area: AreaSummary;
  layout: { pos: [number, number, number]; size: [number, number, number] };
  isSelected: boolean;
  onSelect: () => void;
}

function ZoneBlock({ area, layout, isSelected, onSelect }: ZoneBlockProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = STATUS_COLOR[area.status] || "#6b7280";

  // Pulse selected zone
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (isSelected) {
      const pulse = 0.5 + Math.sin(clock.getElapsedTime() * 3) * 0.3;
      mat.opacity = pulse;
    } else {
      mat.opacity = hovered ? 0.65 : 0.45;
    }
  });

  // Building height proportional to package count (min 0.4, max 2.5)
  const buildingHeight = Math.max(0.4, Math.min(2.5, area.total * 0.25));

  return (
    <group>
      {/* Zone base slab */}
      <mesh
        ref={meshRef}
        position={layout.pos}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        castShadow
      >
        <boxGeometry args={layout.size} />
        <meshStandardMaterial
          color={baseColor}
          transparent
          opacity={0.45}
          roughness={0.6}
        />
      </mesh>

      {/* Buildings / structures rising from zone */}
      {area.total > 0 && (
        <mesh
          position={[layout.pos[0], layout.pos[1] + buildingHeight / 2 + 0.15, layout.pos[2]]}
          castShadow
        >
          <boxGeometry args={[layout.size[0] * 0.6, buildingHeight, layout.size[2] * 0.6]} />
          <meshStandardMaterial
            color={baseColor}
            transparent
            opacity={0.3}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Wireframe outline */}
      <mesh position={layout.pos}>
        <boxGeometry args={[layout.size[0] + 0.05, layout.size[1] + 0.05, layout.size[2] + 0.05]} />
        <meshBasicMaterial color={isSelected ? "#ffffff" : baseColor} wireframe />
      </mesh>

      {/* Label */}
      <Billboard
        position={[layout.pos[0], layout.pos[1] + buildingHeight + 0.8, layout.pos[2]]}
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <Text
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.04}
          outlineColor="#000000"
          font={undefined}
        >
          {SHUTDOWN_AREAS.find(a => a.label === area.area)?.code || area.area}
        </Text>
        <Text
          fontSize={0.22}
          color="#e5e7eb"
          anchorX="center"
          anchorY="top"
          position={[0, -0.08, 0]}
          outlineWidth={0.02}
          outlineColor="#000000"
          font={undefined}
        >
          {`${area.pctComplete}% · ${area.status}`}
        </Text>
      </Billboard>

      {/* Critical path indicator */}
      {area.status === "At Risk" || area.status === "Delayed" ? (
        <PulsingRing position={[layout.pos[0], 0.05, layout.pos[2]]} color={baseColor} size={Math.max(layout.size[0], layout.size[2]) * 0.7} />
      ) : null}
    </group>
  );
}

function PulsingRing({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
    ringRef.current.scale.set(s, s, 1);
    (ringRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
  });
  return (
    <mesh ref={ringRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size * 0.45, size * 0.5, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Scene({ areaSummaries, selectedArea, onSelectArea }: {
  areaSummaries: AreaSummary[];
  selectedArea: string;
  onSelectArea: (area: string) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
      <directionalLight position={[-5, 8, -5]} intensity={0.3} />

      <Ground />

      {areaSummaries.map((area) => {
        const layout = ZONE_LAYOUT[area.area];
        if (!layout) return null;
        return (
          <ZoneBlock
            key={area.area}
            area={area}
            layout={layout}
            isSelected={selectedArea === area.area}
            onSelect={() => onSelectArea(area.area)}
          />
        );
      })}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                        */
/* ------------------------------------------------------------------ */

interface PlantOverview3DProps {
  className?: string;
}

export function PlantOverview3D({ className }: PlantOverview3DProps) {
  const { navigateToTab, setFilterArea } = useOrchestratorContext();
  const areaSummaries = useMemo(() => buildAreaSummaries(PACKAGES), []);
  const [selectedArea, setSelectedArea] = useState("");

  const handleSelectArea = (area: string) => {
    setSelectedArea(area === selectedArea ? "" : area);
  };

  const handleNavigate = () => {
    if (selectedArea) {
      setFilterArea(selectedArea);
      navigateToTab("area-map");
    }
  };

  const selected = areaSummaries.find(a => a.area === selectedArea);

  return (
    <div className={cn("relative rounded-lg border border-border overflow-hidden bg-black/90", className)}>
      {/* 3D Canvas */}
      <div className="w-full h-[480px]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Loading 3D model…
          </div>
        }>
          <Canvas
            shadows
            camera={{ position: [0, 14, 14], fov: 50, near: 0.1, far: 100 }}
            gl={{ antialias: true }}
          >
            <Scene
              areaSummaries={areaSummaries}
              selectedArea={selectedArea}
              onSelectArea={handleSelectArea}
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Legend overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-md border border-border px-3 py-2">
        {Object.entries(STATUS_COLOR).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* Controls hint */}
      <div className="absolute top-3 right-3 text-[10px] text-muted-foreground bg-background/70 backdrop-blur-sm rounded px-2 py-1 border border-border">
        Click zone to select · Drag to rotate · Scroll to zoom
      </div>

      {/* Selected area detail card */}
      {selected && (
        <div className="absolute top-3 left-3 w-56 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">{selected.area}</span>
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: STATUS_COLOR[selected.status] + "20", color: STATUS_COLOR[selected.status] }}
            >
              {selected.status}
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${selected.pctComplete}%`, backgroundColor: STATUS_COLOR[selected.status] }}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground mb-3">
            <span>Packages: <span className="font-semibold text-foreground">{selected.total}</span></span>
            <span>Complete: <span className="font-semibold text-foreground">{selected.complete}</span></span>
            <span>Active: <span className="font-semibold text-foreground">{selected.active}</span></span>
            <span>Blocked: <span className="font-semibold text-foreground">{selected.blocked}</span></span>
          </div>
          <button
            onClick={handleNavigate}
            className="w-full text-center text-[10px] font-medium text-primary hover:underline"
          >
            Open in Area Map →
          </button>
        </div>
      )}
    </div>
  );
}
