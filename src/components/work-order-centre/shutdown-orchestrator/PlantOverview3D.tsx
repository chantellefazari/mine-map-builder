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

function HorizontalCylinder({ position, radius = 0.6, length = 2.2, color, rotation }: {
  position: [number, number, number]; radius?: number; length?: number; color: string; rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, length, 24]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

function VerticalTank({ position, radius = 0.45, height = 1.2, color, rimColor }: {
  position: [number, number, number]; radius?: number; height?: number; color: string; rimColor?: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 24]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
      </mesh>
      <mesh position={[0, height + 0.02, 0]}>
        <cylinderGeometry args={[radius + 0.04, radius + 0.04, 0.06, 24]} />
        <meshStandardMaterial color={rimColor || "#555"} roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

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

function Thickener({ position, radius = 2, color }: {
  position: [number, number, number]; radius?: number; color: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, 1, 32, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[radius - 0.05, radius - 0.05, 0.05, 32]} />
        <meshStandardMaterial color="#4a9eb5" roughness={0.8} metalness={0} opacity={0.7} transparent />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[radius * 2 - 0.2, 0.08, 0.15]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 12]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.3, 0.25, 0.3]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Walkway/platform around thickener */}
      <mesh position={[0, 1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.2, 32]} />
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Building({ position, size, color, rotation }: {
  position: [number, number, number]; size: [number, number, number]; color: string; rotation?: [number, number, number];
}) {
  return (
    <mesh position={[position[0], position[1] + size[1] / 2, position[2]]} rotation={rotation} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

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
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.06, len]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Support trusses */}
      {Array.from({ length: Math.floor(len / 1.2) }, (_, i) => {
        const z = -len / 2 + 0.6 + i * 1.2;
        return (
          <group key={i} position={[0, 0, z]}>
            <mesh position={[-0.15, -0.3, 0]}>
              <boxGeometry args={[0.03, 0.5, 0.03]} />
              <meshStandardMaterial color="#4a9eb5" roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0.15, -0.3, 0]}>
              <boxGeometry args={[0.03, 0.5, 0.03]} />
              <meshStandardMaterial color="#4a9eb5" roughness={0.3} metalness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Pipe({ points, color = "#888", radius = 0.04 }: { points: [number, number, number][]; color?: string; radius?: number }) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
  }, [points]);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 20, radius, 8, false), [curve, radius]);
  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

/** Structural steelwork frame */
function SteelFrame({ position, size, color = "#4a9eb5" }: {
  position: [number, number, number]; size: [number, number, number]; color?: string;
}) {
  const [w, h, d] = size;
  const bar = 0.04;
  return (
    <group position={position}>
      {/* Vertical posts */}
      {[[-w/2, 0, -d/2], [w/2, 0, -d/2], [-w/2, 0, d/2], [w/2, 0, d/2]].map((p, i) => (
        <mesh key={i} position={[p[0], h/2, p[2]]}>
          <boxGeometry args={[bar, h, bar]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      {/* Top rails */}
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[w, bar, bar]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[0, h, 0]}>
        <boxGeometry args={[bar, bar, d]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

/** Ground pad / concrete slab */
function GroundPad({ position, size, color = "#8B7355" }: {
  position: [number, number, number]; size: [number, number]; color?: string;
}) {
  return (
    <mesh position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  TSF — Tailings Storage Facility (red pond, far right)              */
/* ------------------------------------------------------------------ */

function TSF() {
  return (
    <group position={[22, 0, -2]}>
      {/* Embankment walls */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[6, 0.8, 6]} />
        <meshStandardMaterial color="#999" roughness={0.8} metalness={0} />
      </mesh>
      {/* Inner cavity — red liquid */}
      <mesh position={[0, 0.82, 0]}>
        <boxGeometry args={[5, 0.05, 5]} />
        <meshStandardMaterial color="#c0392b" roughness={0.9} metalness={0} />
      </mesh>
      {/* Inner walls visible */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[5.2, 0.5, 5.2]} />
        <meshStandardMaterial color="#bbb" roughness={0.8} metalness={0} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  HAUL ROAD                                                          */
/* ------------------------------------------------------------------ */

function HaulRoad() {
  const roadCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 0.03, 8),
      new THREE.Vector3(-14, 0.03, 2),
      new THREE.Vector3(-13, 0.03, -2),
      new THREE.Vector3(-11, 0.03, -5),
      new THREE.Vector3(-8, 0.03, -6),
      new THREE.Vector3(-5, 0.03, -5),
      new THREE.Vector3(-4, 0.03, -2),
      new THREE.Vector3(-5, 0.03, 1),
      new THREE.Vector3(-8, 0.03, 4),
      new THREE.Vector3(-11, 0.03, 6),
      new THREE.Vector3(-14, 0.03, 8),
    ]);
  }, []);
  const roadGeo = useMemo(() => new THREE.TubeGeometry(roadCurve, 60, 0.8, 4, true), [roadCurve]);
  return (
    <mesh geometry={roadGeo} rotation={[0, 0, 0]}>
      <meshStandardMaterial color="#2a2a2a" roughness={0.95} metalness={0} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  AREA GROUPS — positioned to match Navisworks layout                */
/* ------------------------------------------------------------------ */

/*
 * Navisworks layout (top-down, matching reference images):
 *
 *   Far left:   TAILINGS (thickener + filter press + pumps) on grey pad
 *   Center:     GOLD RECOVERY (4-5 large green CIP tanks + leach tanks + steelwork)
 *   Upper-left: COMMINUTION (SAG mill yellow, crusher, conveyors, cyclones)
 *   Upper-right: SITE INFRA (elution, gold room, substation)
 *   Right:       UTILITIES (reagent tanks, water tank)
 *   Far right:   TSF (red pond with embankments)
 *   Road:        Curved haul road loop on far left
 */

/** Comminution / Process — upper-left: SAG mill, crusher, conveyors, cyclones */
function ComminutionProcess({ color }: { color: string }) {
  return (
    <group position={[-3, 0, 2]}>
      {/* SAG Mill — large yellow/olive ellipsoid */}
      <mesh position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, Math.PI / 2]} castShadow>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#d4a017" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* SAG Mill drum */}
      <HorizontalCylinder position={[0, 1.2, 0]} radius={0.95} length={1.4} color="#c49a2a" rotation={[Math.PI / 2, 0, Math.PI / 4]} />
      
      {/* Crusher — small yellow box, far left */}
      <Building position={[-3.5, 0, -1]} size={[1.2, 1.5, 1]} color="#b8960b" />
      <Building position={[-3.5, 1.5, -1]} size={[0.8, 0.4, 0.6]} color="#8B7355" />
      
      {/* Conveyor from crusher to SAG mill */}
      <Conveyor start={[-3, 1.5, -1]} end={[-0.5, 2, 0]} color="#777" />
      
      {/* Cyclone cluster — above and right */}
      <ConeTank position={[2, 0, -0.5]} radius={0.2} height={0.6} color="#4a9eb5" />
      <ConeTank position={[2.4, 0, -0.5]} radius={0.2} height={0.6} color="#4a9eb5" />
      <ConeTank position={[2.2, 0, 0.1]} radius={0.2} height={0.6} color="#4a9eb5" />
      
      {/* Cyclone support structure */}
      <SteelFrame position={[2.2, 0, -0.2]} size={[1.2, 1.5, 1]} />
      
      {/* Mill motor */}
      <Building position={[1.2, 0, 0.8]} size={[0.6, 0.5, 0.5]} color="#1a6b6b" />
      
      {/* Silo / feed hopper */}
      <VerticalTank position={[-2, 0, 0.5]} radius={0.4} height={1.5} color="#87CEEB" rimColor="#5f9ea0" />
      
      {/* Ground pad */}
      <GroundPad position={[0, 0, 0]} size={[8, 6]} color="#a0855a" />
    </group>
  );
}

/** Gold Recovery — center: large green CIP/Leach tanks */
function GoldRecovery({ color }: { color: string }) {
  return (
    <group position={[3, 0, 0]}>
      {/* CIP Tank circuit — 4 large green tanks in a row (dominant feature) */}
      {[0, 1.8, 3.6, 5.4].map((x, i) => (
        <VerticalTank key={`cip-${i}`} position={[x, 0, 0]} radius={0.75} height={2} color="#2ecc71" rimColor="#27ae60" />
      ))}
      
      {/* Leach tanks — second row, slightly smaller */}
      {[0.9, 2.7, 4.5].map((x, i) => (
        <VerticalTank key={`leach-${i}`} position={[x, 0, -2.5]} radius={0.65} height={1.8} color="#27ae60" rimColor="#1e8449" />
      ))}
      
      {/* Structural steelwork around tanks */}
      <SteelFrame position={[2.7, 0, 0]} size={[7, 2.5, 2.5]} />
      <SteelFrame position={[2.7, 0, -2.5]} size={[5, 2.2, 2]} />
      
      {/* Elution column — tall, right side */}
      <VerticalTank position={[7, 0, -1]} radius={0.3} height={2.5} color="#27ae60" rimColor="#1a5c32" />
      
      {/* Gold room building */}
      <Building position={[7.5, 0, 0.5]} size={[1, 0.8, 1]} color="#8B7355" />
      
      {/* Pumps between tank rows */}
      <Pump position={[1.5, 0, -1.2]} color={color} />
      <Pump position={[3.5, 0, -1.2]} color={color} />
      
      {/* Pipe runs connecting CIP tanks */}
      <Pipe points={[
        [0, 2.05, 0], [1.8, 2.05, 0], [3.6, 2.05, 0], [5.4, 2.05, 0],
      ]} color="#ff69b4" />
      <Pipe points={[
        [0, 2.05, 0], [0, 2.05, -1.2], [0.9, 1.85, -2.5],
      ]} color="#ff69b4" />
      
      {/* Yellow pipe runs (matching Navisworks magenta/yellow pipes) */}
      <Pipe points={[
        [-1, 0.3, 2], [2, 0.3, 2], [5, 0.3, 2], [8, 0.3, 2],
      ]} color="#e8d44d" />
      
      {/* Ground pad */}
      <GroundPad position={[3, 0, -1]} size={[10, 7]} color="#a0855a" />
    </group>
  );
}

/** Tailings — far left: large thickener + filter press + pumps */
function TailingsArea({ color }: { color: string }) {
  return (
    <group position={[-9, 0, -3]}>
      {/* Main Thickener — large cyan disc */}
      <Thickener position={[0, 0, 0]} radius={2.5} color="#3498db" />
      
      {/* Thickener concrete pad */}
      <GroundPad position={[0, 0, 0]} size={[7, 7]} color="#777" />
      
      {/* Underflow pumps */}
      <Pump position={[-2.8, 0, -1]} color="#c49a2a" />
      <Pump position={[-2.8, 0, -0.3]} color="#c49a2a" />
      <Pump position={[-2.8, 0, 0.4]} color="#c49a2a" />
      
      {/* Filter Press building — white/grey with red elements (left of thickener) */}
      <Building position={[-4, 0, 3]} size={[3, 1.5, 2]} color="#ddd" />
      <Building position={[-4, 1.5, 3]} size={[3, 0.3, 2]} color="#c0392b" />
      {/* Second filter press building */}
      <Building position={[-4, 0, 5.5]} size={[2.5, 1.5, 1.5]} color="#ddd" />
      <Building position={[-4, 1.5, 5.5]} size={[2.5, 0.3, 1.5]} color="#c0392b" />
      
      {/* Green walkway/steelwork around filter area */}
      <SteelFrame position={[-4, 0, 4]} size={[4, 2, 5]} color="#27ae60" />
      
      {/* Pipes from thickener to filter press */}
      <Pipe points={[[-2.5, 0.5, 0], [-3.5, 0.5, 1.5], [-4, 0.5, 3]]} color="#ff69b4" />
      
      {/* Pipeline out to TSF */}
      <Pipe points={[
        [2.5, 0.5, 0],
        [6, 0.5, -1],
        [12, 0.4, -1.5],
        [18, 0.4, -1.5],
        [22, 0.5, -2],
      ]} color="#ccc" radius={0.06} />
      <Pipe points={[
        [2.5, 0.7, 0],
        [6, 0.7, -1],
        [12, 0.6, -1.5],
        [18, 0.6, -1.5],
        [22, 0.7, -2],
      ]} color="#ccc" radius={0.06} />
    </group>
  );
}

/** Utilities & Power — right side: reagent tanks, water storage */
function UtilitiesPower({ color }: { color: string }) {
  return (
    <group position={[8, 0, -5]}>
      {/* Reagent tanks — small green/olive */}
      <VerticalTank position={[0, 0, 0]} radius={0.3} height={0.8} color="#556B2F" rimColor="#4a5d23" />
      <VerticalTank position={[0.8, 0, 0]} radius={0.3} height={0.8} color="#556B2F" rimColor="#4a5d23" />
      <VerticalTank position={[1.6, 0, 0]} radius={0.3} height={0.8} color="#556B2F" rimColor="#4a5d23" />
      
      {/* Water tank — large dark blue */}
      <VerticalTank position={[0, 0, -2.5]} radius={0.8} height={1.5} color="#2c3e50" rimColor="#1a252f" />
      
      {/* MCC / Switchroom building */}
      <Building position={[-2, 0, -1]} size={[2, 0.8, 1.5]} color="#f5f5dc" />
      
      {/* Carbon screen building (green/olive) */}
      <Building position={[-1, 0, 1.5]} size={[2.5, 0.5, 1]} color="#556B2F" />
      
      {/* Substation / transformer */}
      <Building position={[3, 0, -1]} size={[0.6, 0.8, 0.6]} color="#333" />
      <Building position={[3, 0, -2]} size={[0.6, 0.8, 0.6]} color="#333" />
      
      {/* Pipes */}
      <Pipe points={[[0, 0.4, 0], [-2, 0.4, 0], [-4, 0.4, 1]]} color="#e8d44d" />
      <Pipe points={[[0, 0.4, 0], [0, 0.4, -2.5]]} color="#3498db" />
    </group>
  );
}

/** Site Infrastructure — upper-right area: admin, substation */
function SiteInfrastructure({ color }: { color: string }) {
  return (
    <group position={[12, 0, -6]}>
      {/* Main admin / control building */}
      <Building position={[0, 0, 0]} size={[3, 1, 2]} color={color} />
      {/* Substation */}
      <Building position={[0, 0, -2.5]} size={[2, 0.6, 1.5]} color="#8B4513" />
      {/* Guard house */}
      <Building position={[-2, 0, 0]} size={[1, 0.6, 1]} color="#ddd" />
    </group>
  );
}

/** Support Services — workshop, stores */
function SupportServices({ color }: { color: string }) {
  return (
    <group position={[14, 0, -3]}>
      <Building position={[0, 0, 0]} size={[3, 1.2, 2.5]} color={color} />
      <Building position={[0, 0, 2]} size={[2, 0.8, 1.5]} color="#555" />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  GROUND TERRAIN                                                     */
/* ------------------------------------------------------------------ */

function Terrain() {
  return (
    <group>
      {/* Main plant pad — orange/brown like Navisworks */}
      <mesh position={[2, 0.01, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 18]} />
        <meshStandardMaterial color="#c47a2a" roughness={0.95} metalness={0} />
      </mesh>
      {/* Outer ground — darker brown */}
      <mesh position={[2, 0, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#8B6914" roughness={0.95} metalness={0} />
      </mesh>
      {/* Tailings area pad */}
      <mesh position={[-9, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 14]} />
        <meshStandardMaterial color="#b07025" roughness={0.95} metalness={0} />
      </mesh>
      {/* Perimeter fence line (as thin boxes) */}
      {[
        { pos: [2, 0.3, -10] as [number, number, number], size: [30, 0.6, 0.05] as [number, number, number] },
        { pos: [2, 0.3, 8] as [number, number, number], size: [30, 0.6, 0.05] as [number, number, number] },
        { pos: [-13, 0.3, -1] as [number, number, number], size: [0.05, 0.6, 18] as [number, number, number] },
        { pos: [17, 0.3, -1] as [number, number, number], size: [0.05, 0.6, 18] as [number, number, number] },
      ].map((fence, i) => (
        <mesh key={i} position={fence.pos}>
          <boxGeometry args={fence.size} />
          <meshStandardMaterial color="#999" roughness={0.5} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CLICKABLE ZONE OVERLAY                                             */
/* ------------------------------------------------------------------ */

const ZONE_BOUNDS: Record<string, { pos: [number, number, number]; size: [number, number, number] }> = {
  "Comminution / Process":  { pos: [-3,   0.03, 2],    size: [9, 0.02, 6] },
  "Gold Recovery":          { pos: [5.5,  0.03, -0.5], size: [10, 0.02, 7] },
  "Tailings":               { pos: [-9,   0.03, -1],   size: [10, 0.02, 12] },
  "Utilities & Power":      { pos: [8,    0.03, -5],   size: [6, 0.02, 6] },
  "Site Infrastructure":    { pos: [12,   0.03, -6.5], size: [5, 0.02, 4] },
  "Support Services":       { pos: [14,   0.03, -2],   size: [5, 0.02, 5] },
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

      {isSelected && (
        <mesh position={layout.pos}>
          <boxGeometry args={[layout.size[0] + 0.1, 0.04, layout.size[2] + 0.1]} />
          <meshBasicMaterial color="#fff" wireframe />
        </mesh>
      )}

      <Billboard
        position={[layout.pos[0], 3.5, layout.pos[2]]}
        follow lockX={false} lockY={false} lockZ={false}
      >
        <Text fontSize={0.4} color="white" anchorX="center" anchorY="bottom"
          outlineWidth={0.03} outlineColor="#000000" font={undefined}>
          {SHUTDOWN_AREAS.find(a => a.label === area.area)?.code || area.area}
        </Text>
        <Text fontSize={0.22} color="#e5e7eb" anchorX="center" anchorY="top"
          position={[0, -0.06, 0]} outlineWidth={0.02} outlineColor="#000000" font={undefined}>
          {`${area.pctComplete}% · ${area.status}`}
        </Text>
      </Billboard>

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

      {/* Terrain */}
      <Terrain />
      
      {/* Haul road */}
      <HaulRoad />
      
      {/* TSF */}
      <TSF />

      {/* Equipment groups */}
      <ComminutionProcess color={areaColors["Comminution / Process"] || "#10b981"} />
      <GoldRecovery color={areaColors["Gold Recovery"] || "#10b981"} />
      <TailingsArea color={areaColors["Tailings"] || "#3498db"} />
      <UtilitiesPower color={areaColors["Utilities & Power"] || "#3b82f6"} />
      <SiteInfrastructure color={areaColors["Site Infrastructure"] || "#3b82f6"} />
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
        maxDistance={45}
        target={[2, 0, -1]}
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
            camera={{ position: [8, 20, 28], fov: 45, near: 0.1, far: 120 }}
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
