import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Billboard, Grid } from "@react-three/drei";
import * as THREE from "three";
import { PACKAGES, SHUTDOWN_AREAS, buildAreaSummaries, type AreaSummary } from "./shutdownData";
import { useOrchestratorContext } from "./ShutdownOrchestratorContext";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  CONSTANTS                                                          */
/* ------------------------------------------------------------------ */

const STATUS_COLOR: Record<string, string> = {
  Ready:     "#3b82f6",
  Active:    "#10b981",
  "At Risk": "#f59e0b",
  Delayed:   "#ef4444",
  Complete:  "#6b7280",
};

/* ------------------------------------------------------------------ */
/*  PRIMITIVE EQUIPMENT SHAPES                                         */
/* ------------------------------------------------------------------ */

/** Horizontal cylinder — Ball Mill / SAG Mill */
function HorizontalCylinder({ position, radius = 0.6, length = 2.2, color }: {
  position: [number, number, number]; radius?: number; length?: number; color: string;
}) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, length, 24]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

/** Vertical cylinder — Tank / Leach tank / CIP tank */
function VerticalTank({ position, radius = 0.45, height = 1.2, color, rimColor }: {
  position: [number, number, number]; radius?: number; height?: number; color: string; rimColor?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, height + 0.02, 0]}>
        <cylinderGeometry args={[radius + 0.04, radius + 0.04, 0.06, 24]} />
        <meshStandardMaterial color={rimColor || "#555"} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

/** Cone-bottom tank */
function ConeTank({ position, radius = 0.4, height = 1.0, color }: {
  position: [number, number, number]; radius?: number; height?: number; color: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2 + 0.3, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.15, 0]} castShadow>
        <coneGeometry args={[radius, 0.35, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}

/** Thickener — large flat disc with bridge */
function Thickener({ position, radius = 2, color }: {
  position: [number, number, number]; radius?: number; color: string;
}) {
  return (
    <group position={position}>
      {/* Tank wall */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, 1, 32, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Liquid surface */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[radius - 0.05, radius - 0.05, 0.05, 32]} />
        <meshStandardMaterial color="#8B7355" roughness={0.8} metalness={0} opacity={0.7} transparent />
      </mesh>
      {/* Bridge arm */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[radius * 2 - 0.2, 0.08, 0.15]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Center column */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 12]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Rake motor housing */}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.3, 0.25, 0.3]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

/** Rectangular building / shed */
function Building({ position, size, color }: {
  position: [number, number, number]; size: [number, number, number]; color: string;
}) {
  return (
    <mesh position={[position[0], position[1] + size[1] / 2, position[2]]} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

/** Small pump */
function Pump({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.25, 0.3, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0.18, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
        <meshStandardMaterial color="#555" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

/** Conveyor belt */
function Conveyor({ start, end, color }: {
  start: [number, number, number]; end: [number, number, number]; color: string;
}) {
  const dx = end[0] - start[0], dy = end[1] - start[1], dz = end[2] - start[2];
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const cx = (start[0] + end[0]) / 2, cy = (start[1] + end[1]) / 2, cz = (start[2] + end[2]) / 2;
  const angle = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz));
  const yRot = Math.atan2(dx, dz);

  return (
    <group position={[cx, cy, cz]} rotation={[angle, yRot, 0]}>
      {/* Belt */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.06, len]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Rails */}
      {[-0.18, 0.18].map((x, i) => (
        <mesh key={i} position={[x, -0.05, 0]}>
          <boxGeometry args={[0.03, 0.04, len]} />
          <meshStandardMaterial color="#555" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

/** Pipe run */
function Pipe({ points, color = "#888" }: { points: [number, number, number][]; color?: string }) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  }, [points]);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.04, 8, false), [curve]);
  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  AREA GROUPS — Each area is a group of 3D equipment                */
/* ------------------------------------------------------------------ */

/** Site Infrastructure — buildings, substation, offices */
function SiteInfrastructure({ color }: { color: string }) {
  return (
    <group position={[-9, 0, -6]}>
      <Building position={[0, 0, 0]} size={[2.5, 1.2, 1.8]} color={color} />
      <Building position={[3, 0, 0]} size={[1.5, 0.8, 1.2]} color={color} />
      <Building position={[1.5, 0, -2]} size={[1.8, 0.6, 1]} color="#666" />
    </group>
  );
}

/** Utilities & Power — generators, switchgear, transformers */
function UtilitiesPower({ color }: { color: string }) {
  return (
    <group position={[8, 0, -6]}>
      {/* Generators */}
      <HorizontalCylinder position={[0, 0.8, 0]} radius={0.5} length={1.8} color={color} />
      <HorizontalCylinder position={[0, 0.8, 1.5]} radius={0.5} length={1.8} color={color} />
      {/* Transformer */}
      <Building position={[2, 0, 0.5]} size={[0.8, 1, 0.8]} color="#556B2F" />
      {/* Switchroom */}
      <Building position={[-1.5, 0, 0.5]} size={[1.2, 0.7, 1]} color="#555" />
    </group>
  );
}

/** Comminution / Process — mills, classification, screens */
function ComminutionProcess({ color }: { color: string }) {
  return (
    <group position={[-6, 0, 0]}>
      {/* Ball Mills */}
      <HorizontalCylinder position={[0, 1, 0]} radius={0.9} length={3} color="#2b2d7c" />
      <HorizontalCylinder position={[0, 1, 2.5]} radius={0.7} length={2.5} color="#5b3a8c" />
      {/* Mill motor */}
      <Building position={[-1.8, 0, 0]} size={[0.6, 0.7, 0.6]} color="#1a6b6b" />
      <Building position={[-1.8, 0, 2.5]} size={[0.5, 0.6, 0.5]} color="#1a6b6b" />
      {/* Cyclone cluster */}
      <ConeTank position={[2.5, 0, 0.5]} radius={0.25} height={0.7} color="#c49a2a" />
      <ConeTank position={[3, 0, 0.5]} radius={0.25} height={0.7} color="#c49a2a" />
      <ConeTank position={[2.75, 0, 1.2]} radius={0.25} height={0.7} color="#c49a2a" />
      {/* Pumps */}
      <Pump position={[2, 0, 2]} color={color} />
      <Pump position={[2.5, 0, 2]} color={color} />
    </group>
  );
}

/** Gold Recovery — CIP tanks, elution, electro-winning */
function GoldRecovery({ color }: { color: string }) {
  return (
    <group position={[2, 0, 1]}>
      {/* CIP Tanks row */}
      {[0, 1.2, 2.4, 3.6, 4.8].map((x, i) => (
        <VerticalTank key={i} position={[x, 0, 0]} radius={0.5} height={1.3} color="#1a7a4a" rimColor="#0d5c34" />
      ))}
      {/* Leach tanks */}
      <VerticalTank position={[0, 0, -2]} radius={0.55} height={1.4} color="#c49a2a" rimColor="#a07818" />
      <VerticalTank position={[1.3, 0, -2]} radius={0.55} height={1.4} color="#c49a2a" rimColor="#a07818" />
      <VerticalTank position={[2.6, 0, -2]} radius={0.55} height={1.4} color="#c49a2a" rimColor="#a07818" />
      {/* Elution column */}
      <VerticalTank position={[5.5, 0, -1]} radius={0.3} height={1.8} color="#8b2252" rimColor="#6b1a3e" />
      {/* Electrowinning cell */}
      <Building position={[5.5, 0, 0.5]} size={[0.8, 0.5, 0.6]} color="#b8860b" />
      {/* Pumps */}
      <Pump position={[1.3, 0, 1.5]} color={color} />
      <Pump position={[3.6, 0, 1.5]} color={color} />
      {/* Pipe run connecting tanks */}
      <Pipe points={[
        [0, 1.35, 0], [1.2, 1.35, 0], [2.4, 1.35, 0], [3.6, 1.35, 0], [4.8, 1.35, 0],
      ]} color="#0d5c34" />
    </group>
  );
}

/** Tailings — thickener, pumps */
function TailingsArea({ color }: { color: string }) {
  return (
    <group position={[3, 0, 6]}>
      <Thickener position={[0, 0, 0]} radius={2.2} color={color} />
      {/* Underflow pumps */}
      <Pump position={[-2.5, 0, 0]} color="#c49a2a" />
      <Pump position={[-2.5, 0, 0.6]} color="#c49a2a" />
      {/* Pipe from thickener */}
      <Pipe points={[[-2.2, 0.5, 0], [-2.5, 0.3, 0]]} color="#888" />
    </group>
  );
}

/** Support Services — workshop, stores */
function SupportServices({ color }: { color: string }) {
  return (
    <group position={[-8, 0, 5]}>
      <Building position={[0, 0, 0]} size={[3, 1, 2]} color={color} />
      <Building position={[3.5, 0, 0]} size={[1.5, 0.7, 1.5]} color="#555" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CLICKABLE ZONE OVERLAY                                             */
/* ------------------------------------------------------------------ */

const ZONE_BOUNDS: Record<string, { pos: [number, number, number]; size: [number, number, number] }> = {
  "Site Infrastructure":    { pos: [-8,  0.01, -6],   size: [6, 0.02, 4] },
  "Utilities & Power":      { pos: [8.5, 0.01, -5.5], size: [5, 0.02, 4] },
  "Comminution / Process":  { pos: [-5,  0.01, 1],    size: [6, 0.02, 5] },
  "Gold Recovery":          { pos: [4.5, 0.01, 0.5],  size: [8, 0.02, 5] },
  "Tailings":               { pos: [3,   0.01, 6],    size: [6, 0.02, 5] },
  "Support Services":       { pos: [-7,  0.01, 5],    size: [6, 0.02, 4] },
};

function ZoneOverlay({ area, layout, isSelected, onSelect }: {
  area: AreaSummary;
  layout: { pos: [number, number, number]; size: [number, number, number] };
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const baseColor = STATUS_COLOR[area.status] || "#6b7280";

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    if (isSelected) {
      mat.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 3) * 0.08;
    } else {
      mat.opacity = hovered ? 0.1 : 0.04;
    }
  });

  return (
    <group>
      {/* Clickable ground overlay */}
      <mesh
        ref={meshRef}
        position={layout.pos}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        <boxGeometry args={layout.size} />
        <meshBasicMaterial color={baseColor} transparent opacity={0.04} />
      </mesh>

      {/* Border outline */}
      {isSelected && (
        <mesh position={layout.pos}>
          <boxGeometry args={[layout.size[0] + 0.1, 0.04, layout.size[2] + 0.1]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>
      )}

      {/* Area label */}
      <Billboard
        position={[layout.pos[0], 2.5, layout.pos[2]]}
        follow lockX={false} lockY={false} lockZ={false}
      >
        <Text fontSize={0.35} color="white" anchorX="center" anchorY="bottom"
          outlineWidth={0.03} outlineColor="#000000" font={undefined}>
          {SHUTDOWN_AREAS.find(a => a.label === area.area)?.code || area.area}
        </Text>
        <Text fontSize={0.2} color="#e5e7eb" anchorX="center" anchorY="top"
          position={[0, -0.06, 0]} outlineWidth={0.02} outlineColor="#000000" font={undefined}>
          {`${area.pctComplete}% · ${area.status}`}
        </Text>
      </Billboard>

      {/* Status ring for at-risk / delayed */}
      {(area.status === "At Risk" || area.status === "Delayed") && (
        <StatusRing position={layout.pos} color={baseColor} size={Math.max(layout.size[0], layout.size[2]) * 0.4} />
      )}
    </group>
  );
}

function StatusRing({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const s = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.12;
    ref.current.scale.set(s, s, 1);
    (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.25 + Math.sin(clock.getElapsedTime() * 2) * 0.15;
  });
  return (
    <mesh ref={ref} position={[position[0], 0.05, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[size * 0.9, size, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  SCENE                                                              */
/* ------------------------------------------------------------------ */

function Scene({ areaSummaries, selectedArea, onSelectArea }: {
  areaSummaries: AreaSummary[];
  selectedArea: string;
  onSelectArea: (area: string) => void;
}) {
  const areaColors = useMemo(() => {
    const map: Record<string, string> = {};
    areaSummaries.forEach(a => { map[a.area] = STATUS_COLOR[a.status] || "#6b7280"; });
    return map;
  }, [areaSummaries]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[15, 20, 10]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-10, 12, -8]} intensity={0.3} />
      <hemisphereLight args={["#b1e1ff", "#444", 0.4]} />

      {/* Ground grid */}
      <Grid
        args={[40, 40]}
        position={[0, 0, 0]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#333"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#555"
        fadeDistance={50}
        infiniteGrid
      />

      {/* Equipment groups */}
      <SiteInfrastructure color={areaColors["Site Infrastructure"] || "#3b82f6"} />
      <UtilitiesPower color={areaColors["Utilities & Power"] || "#3b82f6"} />
      <ComminutionProcess color={areaColors["Comminution / Process"] || "#10b981"} />
      <GoldRecovery color={areaColors["Gold Recovery"] || "#10b981"} />
      <TailingsArea color={areaColors["Tailings"] || "#c49a2a"} />
      <SupportServices color={areaColors["Support Services"] || "#6b7280"} />

      {/* Clickable zone overlays */}
      {areaSummaries.map((area) => {
        const layout = ZONE_BOUNDS[area.area];
        if (!layout) return null;
        return (
          <ZoneOverlay
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
        maxDistance={35}
        target={[0, 0, 1]}
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
      <div className="w-full h-[480px]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            Loading 3D model…
          </div>
        }>
          <Canvas
            shadows
            camera={{ position: [5, 18, 22], fov: 45, near: 0.1, far: 100 }}
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

      {/* Legend */}
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

      {/* Selected area detail */}
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
