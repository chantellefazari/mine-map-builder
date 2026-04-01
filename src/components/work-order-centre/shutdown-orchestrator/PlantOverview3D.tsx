import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
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
/*  PRIMITIVES                                                         */
/* ------------------------------------------------------------------ */

function HorizCyl({ position, radius = 0.6, length = 2.2, color, rotation }: {
  position: [number, number, number]; radius?: number; length?: number; color: string; rotation?: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, Math.PI / 2]} castShadow>
      <cylinderGeometry args={[radius, radius, length, 24]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

function Tank({ position, radius = 0.45, height = 1.2, color, rimColor }: {
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
      <mesh position={[0, 0.15, 0]}>
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
      {/* Main wall */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, 1, 32, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Water surface */}
      <mesh position={[0, 0.95, 0]}>
        <cylinderGeometry args={[radius - 0.05, radius - 0.05, 0.05, 32]} />
        <meshStandardMaterial color="#4a9eb5" roughness={0.8} metalness={0} opacity={0.7} transparent />
      </mesh>
      {/* Bridge/rake */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[radius * 2 - 0.2, 0.08, 0.15]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Center shaft */}
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.4, 12]} />
        <meshStandardMaterial color="#444" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Drive head */}
      <mesh position={[0, 1.45, 0]}>
        <boxGeometry args={[0.3, 0.25, 0.3]} />
        <meshStandardMaterial color="#333" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Rim ring */}
      <mesh position={[0, 1.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.2, 32]} />
        <meshStandardMaterial color="#666" roughness={0.4} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Box({ position, size, color, rotation }: {
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
      {Array.from({ length: Math.max(2, Math.floor(len / 1)) }, (_, i) => {
        const z = -len / 2 + 0.5 + i * 1;
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
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), [points]);
  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 30, radius, 8, false), [curve, radius]);
  return (
    <mesh geometry={tubeGeo}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.5} />
    </mesh>
  );
}

function SteelFrame({ position, size, color = "#4a9eb5" }: {
  position: [number, number, number]; size: [number, number, number]; color?: string;
}) {
  const [w, h, d] = size;
  const bar = 0.04;
  return (
    <group position={position}>
      {[[-w/2, 0, -d/2], [w/2, 0, -d/2], [-w/2, 0, d/2], [w/2, 0, d/2]].map((p, i) => (
        <mesh key={i} position={[p[0], h/2, p[2]]}>
          <boxGeometry args={[bar, h, bar]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, h, -d/2]}><boxGeometry args={[w, bar, bar]} /><meshStandardMaterial color={color} roughness={0.3} metalness={0.6} /></mesh>
      <mesh position={[0, h, d/2]}><boxGeometry args={[w, bar, bar]} /><meshStandardMaterial color={color} roughness={0.3} metalness={0.6} /></mesh>
      <mesh position={[-w/2, h, 0]}><boxGeometry args={[bar, bar, d]} /><meshStandardMaterial color={color} roughness={0.3} metalness={0.6} /></mesh>
      <mesh position={[w/2, h, 0]}><boxGeometry args={[bar, bar, d]} /><meshStandardMaterial color={color} roughness={0.3} metalness={0.6} /></mesh>
      <mesh position={[0, h * 0.5, -d/2]} rotation={[0, 0, Math.PI/6]}>
        <boxGeometry args={[bar, h * 0.6, bar]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
    </group>
  );
}

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
/*  LAYOUT — Matching Navisworks exactly                               */
/*                                                                     */
/*  Looking from camera (south-east looking north-west):               */
/*                                                                     */
/*  UPPER-LEFT: Tailings (Filter Press + Thickener)                    */
/*  CENTER: Comminution (Cyclones, SAG Mill, Crusher, Conveyors)       */
/*  CENTER-RIGHT: Gold Recovery (2 rows of CIP/Leach tanks)            */
/*  UPPER-RIGHT: Utilities (Water tank, reagent tanks, MCC)            */
/*  FAR RIGHT: TSF (red pond with concrete walls)                      */
/*  BOTTOM-CENTER: ROM/Crusher area with conveyor going up             */
/*                                                                     */
/*  X = east (right), Z = south (toward camera), -Z = north            */
/* ------------------------------------------------------------------ */

/* ── TAILINGS (TAIL) — UPPER-LEFT: thickener + filter press buildings ── */
function TailingsArea() {
  return (
    <group position={[-7, 0, -4]}>
      {/* Filter Press Buildings — far left, white with red/brown roof strips */}
      {/* 3 rectangular buildings side by side */}
      <Box position={[-4, 0, -1]} size={[1.8, 1.8, 3]} color="#ddd" />
      <Box position={[-4, 1.8, -1]} size={[1.8, 0.15, 3]} color="#8B4513" />
      <Box position={[-2, 0, -1]} size={[1.5, 1.8, 3]} color="#ddd" />
      <Box position={[-2, 1.8, -1]} size={[1.5, 0.15, 3]} color="#c0392b" />
      <Box position={[-0.5, 0, -1]} size={[1, 1.5, 2.5]} color="#eee" />
      <Box position={[-0.5, 1.5, -1]} size={[1, 0.12, 2.5]} color="#8B4513" />

      {/* Green steelwork around filter press */}
      <SteelFrame position={[-3, 0, -1]} size={[6, 2.2, 4]} color="#27ae60" />

      {/* Grey concrete pad under filter buildings */}
      <GroundPad position={[-3, 0, -1]} size={[8, 5]} color="#888" />

      {/* Main Thickener — large bright cyan disc, right of filter buildings */}
      <Thickener position={[3, 0, -1]} radius={2.8} color="#00b4d8" />
      {/* Thickener concrete pad */}
      <GroundPad position={[3, 0, -1]} size={[7, 7]} color="#777" />

      {/* Small yellow/green structures next to thickener */}
      <Box position={[3, 0, -4.5]} size={[2.5, 0.8, 1.5]} color="#b8960b" />
      <Box position={[5.5, 0, -4.5]} size={[1, 0.6, 1]} color="#27ae60" />

      {/* Underflow pumps south side */}
      <Pump position={[0.5, 0, 1.5]} color="#c49a2a" />
      <Pump position={[1.5, 0, 1.5]} color="#c49a2a" />
      <Pump position={[2.5, 0, 1.5]} color="#c49a2a" />

      {/* Pipe from thickener south */}
      <Pipe points={[[3, 0.5, 1.5], [4, 0.5, 3], [6, 0.5, 4]]} color="#e84393" />
    </group>
  );
}

/* ── COMMINUTION / PROCESS (COM) — CENTER: cyclones, SAG mill, crusher, conveyors ── */
function ComminutionProcess() {
  return (
    <group position={[2, 0, 0]}>
      {/* Cyclone cluster — tall blue steelwork tower with cone separators */}
      <group position={[-2, 0, -2]}>
        <SteelFrame position={[0, 0, 0]} size={[2, 3.5, 2]} color="#0099cc" />
        <ConeTank position={[-0.4, 1.5, -0.3]} radius={0.25} height={0.7} color="#4a9eb5" />
        <ConeTank position={[0.2, 1.5, -0.3]} radius={0.25} height={0.7} color="#4a9eb5" />
        <ConeTank position={[-0.1, 1.5, 0.3]} radius={0.25} height={0.7} color="#4a9eb5" />
        <ConeTank position={[0.5, 1.5, 0.3]} radius={0.25} height={0.7} color="#4a9eb5" />
        {/* Extra steelwork levels */}
        <mesh position={[0, 2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial color="#0099cc" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Conveyor going down-left at angle (light blue tube in Navisworks) */}
      <Conveyor start={[-2, 2.5, -1]} end={[-1, 1, 3]} color="#87CEEB" />

      {/* SAG Mill — bright yellow ellipsoid, south of cyclones */}
      <mesh position={[-1, 1, 4]} castShadow>
        <sphereGeometry args={[0.9, 24, 16]} />
        <meshStandardMaterial color="#e8d44d" roughness={0.4} metalness={0.3} />
      </mesh>
      <HorizCyl position={[-1, 1, 4]} radius={0.7} length={1.3} color="#c49a2a" rotation={[Math.PI / 2, 0, 0]} />
      {/* Mill motor */}
      <Box position={[-1, 0, 5.2]} size={[0.5, 0.5, 0.4]} color="#1a6b6b" />

      {/* Magenta ring around SAG mill (visible in Navisworks) */}
      <mesh position={[-1, 0.03, 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.2, 32]} />
        <meshStandardMaterial color="#e84393" side={THREE.DoubleSide} />
      </mesh>

      {/* Crusher/ROM area — yellow equipment at bottom */}
      <Box position={[0, 0, 6]} size={[1.5, 1.2, 1.2]} color="#b8960b" />
      <Box position={[0, 1.2, 6]} size={[1, 0.4, 0.8]} color="#8B7355" />
      {/* Yellow crusher equipment */}
      <Box position={[1.8, 0, 6.5]} size={[0.8, 0.8, 0.6]} color="#e8d44d" />
      <Box position={[1.8, 0, 5.5]} size={[0.6, 0.6, 0.4]} color="#1a6b6b" />

      {/* Conveyor from ROM up to crusher */}
      <Conveyor start={[0, 0.5, 8]} end={[0, 1.5, 6]} color="#777" />

      {/* Conveyor from crusher to cyclones */}
      <Conveyor start={[0, 1.5, 5.5]} end={[-1.5, 2.5, -1]} color="#777" />

      {/* Grey concrete pad */}
      <GroundPad position={[-0.5, 0, 3]} size={[6, 10]} color="#888" />

      {/* Pink/magenta pipe runs heading east to recovery */}
      <Pipe points={[[1, 0.4, -2], [3, 0.4, -2], [5, 0.4, -2], [7, 0.4, -2]]} color="#e84393" radius={0.05} />
      <Pipe points={[[1, 0.6, -1.5], [3, 0.6, -1.5], [5, 0.6, -1.5], [7, 0.6, -1.5]]} color="#e8d44d" radius={0.04} />
    </group>
  );
}

/* ── GOLD RECOVERY (REC) — CENTER-RIGHT: 2 rows of CIP/Leach green tanks ── */
function GoldRecovery() {
  return (
    <group position={[8, 0, -1]}>
      {/* North row — 4 large green CIP tanks */}
      {[-2.5, -0.8, 0.9, 2.6].map((x, i) => (
        <Tank key={`cip-n-${i}`} position={[x, 0, -1.8]} radius={0.7} height={2} color="#2ec4a0" rimColor="#1a8a70" />
      ))}
      {/* South row — 4 large green tanks */}
      {[-2.5, -0.8, 0.9, 2.6].map((x, i) => (
        <Tank key={`cip-s-${i}`} position={[x, 0, 0.5]} radius={0.65} height={1.8} color="#27ae60" rimColor="#1e8449" />
      ))}

      {/* Smaller leach tanks / additional equipment behind north row */}
      <Tank position={[-2.5, 0, -4]} radius={0.4} height={1} color="#2ec4a0" rimColor="#1a8a70" />
      <Tank position={[-1.2, 0, -4]} radius={0.4} height={1} color="#2ec4a0" rimColor="#1a8a70" />

      {/* Steelwork/walkways surrounding the tank farm — cyan */}
      <SteelFrame position={[0, 0, -1.8]} size={[7, 2.4, 3]} color="#4a9eb5" />
      <SteelFrame position={[0, 0, 0.5]} size={[7, 2.2, 2.5]} color="#4a9eb5" />

      {/* Walkway grating between rows */}
      <mesh position={[0, 2, -0.65]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 1.8]} />
        <meshStandardMaterial color="#4a9eb5" roughness={0.4} metalness={0.3} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Pumps between rows */}
      <Pump position={[-1.5, 0, -0.6]} color="#27ae60" />
      <Pump position={[0, 0, -0.6]} color="#27ae60" />
      <Pump position={[1.5, 0, -0.6]} color="#27ae60" />

      {/* Inter-tank pipe runs — magenta (pink) like Navisworks */}
      <Pipe points={[[-3, 2.05, -1.8], [-1, 2.05, -1.8], [1, 2.05, -1.8], [3, 2.05, -1.8]]} color="#e84393" radius={0.05} />
      <Pipe points={[[-3, 1.85, 0.5], [-1, 1.85, 0.5], [1, 1.85, 0.5], [3, 1.85, 0.5]]} color="#e84393" radius={0.05} />

      {/* Yellow pipe runs along south edge */}
      <Pipe points={[[-3.5, 0.3, 2], [0, 0.3, 2], [3.5, 0.3, 2]]} color="#e8d44d" radius={0.05} />
      <Pipe points={[[-3.5, 0.5, 2.2], [0, 0.5, 2.2], [3.5, 0.5, 2.2]]} color="#e84393" radius={0.04} />

      {/* Concrete pad under entire recovery area */}
      <GroundPad position={[0, 0, -1]} size={[9, 7]} color="#888" />

      {/* Small white buildings — south of tanks (elution, carbon screen) */}
      <Box position={[3.5, 0, 2.5]} size={[1.5, 1, 1.2]} color="#eee" />
      <Box position={[1.5, 0, 2.5]} size={[1, 0.8, 1]} color="#ddd" />
    </group>
  );
}

/* ── UTILITIES & POWER (UTL) — UPPER-RIGHT: water tank, reagent tanks, MCC ── */
function UtilitiesPower() {
  return (
    <group position={[10, 0, -5.5]}>
      {/* Dark navy/blue water tank — large cylinder */}
      <Tank position={[0, 0, 0]} radius={1} height={1.8} color="#2c3e50" rimColor="#1a252f" />

      {/* Small green reagent tanks — row */}
      <Tank position={[-3, 0, 0.5]} radius={0.35} height={0.9} color="#556B2F" rimColor="#4a5d23" />
      <Tank position={[-2.2, 0, 0.5]} radius={0.35} height={0.9} color="#556B2F" rimColor="#4a5d23" />
      <Tank position={[-1.4, 0, 0.5]} radius={0.35} height={0.9} color="#87CEEB" rimColor="#5f9ea0" />

      {/* MCC / Switchroom — white/beige building */}
      <Box position={[2, 0, 1]} size={[1.5, 0.8, 1.2]} color="#f5f5dc" />
      <Box position={[2, 0.8, 1]} size={[1.5, 0.1, 1.2]} color="#0000cc" />

      {/* Yellow/magenta pipe runs running east */}
      <Pipe points={[[-3.5, 0.4, 2], [0, 0.4, 2], [3, 0.4, 2]]} color="#e8d44d" radius={0.04} />
      <Pipe points={[[-3.5, 0.6, 2.2], [0, 0.6, 2.2], [3, 0.6, 2.2]]} color="#e84393" radius={0.04} />

      {/* Concrete pad */}
      <GroundPad position={[0, 0, 0.5]} size={[8, 4]} color="#777" />
    </group>
  );
}

/* ── SITE INFRASTRUCTURE — small buildings upper area ── */
function SiteInfrastructure({ color }: { color: string }) {
  return (
    <group position={[13, 0, -6]}>
      <Box position={[0, 0, 0]} size={[2, 1, 1.5]} color={color} />
      <Box position={[-2, 0, 0]} size={[1.5, 0.6, 1]} color="#ddd" />
      <Box position={[2, 0, 0]} size={[0.5, 0.8, 0.5]} color="#333" />
      <Box position={[2.8, 0, 0]} size={[0.5, 0.8, 0.5]} color="#333" />
    </group>
  );
}

/* ── SUPPORT SERVICES ── */
function SupportServices({ color }: { color: string }) {
  return (
    <group position={[14, 0, -3]}>
      <Box position={[0, 0, 0]} size={[2.5, 1, 2]} color={color} />
      <Box position={[2, 0, 0]} size={[1.5, 0.7, 1.2]} color="#555" />
    </group>
  );
}

/* ── TSF — Tailings Storage Facility (FAR RIGHT, separate from plant) ── */
function TSF() {
  return (
    <group position={[22, 0, -4]}>
      {/* Grey/white concrete embankments — outer */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[7, 1, 7]} />
        <meshStandardMaterial color="#bbb" roughness={0.8} metalness={0} />
      </mesh>
      {/* Inner step */}
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[5.5, 0.6, 5.5]} />
        <meshStandardMaterial color="#aaa" roughness={0.8} metalness={0} />
      </mesh>
      {/* Red/orange tailings liquid surface */}
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[5, 0.04, 5]} />
        <meshStandardMaterial color="#c0392b" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

/* ── White pipelines from plant to TSF ── */
function PipelineToTSF() {
  return (
    <group>
      <Pipe points={[
        [11, 0.5, -5], [14, 0.5, -5.5], [17, 0.5, -5], [20, 0.5, -4.5], [22, 0.5, -4],
      ]} color="#ddd" radius={0.06} />
      <Pipe points={[
        [11, 0.7, -5], [14, 0.7, -5.5], [17, 0.7, -5], [20, 0.7, -4.5], [22, 0.7, -4],
      ]} color="#ddd" radius={0.06} />
    </group>
  );
}

/* ── TERRAIN ── */
function Terrain() {
  return (
    <group>
      {/* Outer ground — dark brown */}
      <mesh position={[5, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[65, 40]} />
        <meshStandardMaterial color="#8B6914" roughness={0.95} metalness={0} />
      </mesh>
      {/* Main plant pad — orange, raised slightly */}
      <mesh position={[3, 0.015, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 20]} />
        <meshStandardMaterial color="#c47a2a" roughness={0.95} metalness={0} />
      </mesh>
      {/* Rounded edge effect — slightly bigger orange ring */}
      <mesh position={[3, 0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 22]} />
        <meshStandardMaterial color="#b06a20" roughness={0.95} metalness={0} />
      </mesh>
      {/* South dip in terrain (visible notch in Navisworks at bottom-center) */}
      <mesh position={[2, 0.016, 6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#c47a2a" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

/* ── White horizontal pipeline crossing the plant (visible in Navisworks) ── */
function CrossPlantPipeline() {
  return (
    <group>
      <Pipe points={[
        [-12, 0.3, 3], [-6, 0.3, 3], [0, 0.3, 3], [6, 0.3, 2], [10, 0.3, 1.5],
      ]} color="#ddd" radius={0.05} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  CLICKABLE ZONE OVERLAYS                                            */
/* ------------------------------------------------------------------ */

const ZONE_BOUNDS: Record<string, { pos: [number, number, number]; size: [number, number, number] }> = {
  "Tailings":               { pos: [-7,   0.03, -4],    size: [12, 0.02, 8] },
  "Comminution / Process":  { pos: [2,    0.03, 2],     size: [8, 0.02, 12] },
  "Gold Recovery":          { pos: [8,    0.03, -1],    size: [9, 0.02, 8] },
  "Utilities & Power":      { pos: [10,   0.03, -5.5],  size: [8, 0.02, 4] },
  "Site Infrastructure":    { pos: [13,   0.03, -6],    size: [6, 0.02, 3] },
  "Support Services":       { pos: [14,   0.03, -3],    size: [5, 0.02, 3] },
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
    mat.opacity = isSelected
      ? 0.12 + Math.sin(clock.getElapsedTime() * 3) * 0.08
      : hovered ? 0.1 : 0.04;
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
      <Billboard position={[layout.pos[0], 3.5, layout.pos[2]]} follow lockX={false} lockY={false} lockZ={false}>
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
        <PulsingRing position={layout.pos} color={baseColor} size={Math.max(layout.size[0], layout.size[2]) * 0.4} />
      )}
    </group>
  );
}

function PulsingRing({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
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

      <Terrain />
      <TSF />
      <PipelineToTSF />
      <CrossPlantPipeline />

      <TailingsArea />
      <ComminutionProcess />
      <GoldRecovery />
      <UtilitiesPower />
      <SiteInfrastructure color={areaColors["Site Infrastructure"] || "#3b82f6"} />
      <SupportServices color={areaColors["Support Services"] || "#6b7280"} />

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
        enablePan enableZoom enableRotate
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={45}
        target={[5, 0, -1]}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN EXPORT                                                        */
/* ------------------------------------------------------------------ */

export function PlantOverview3D({ className }: { className?: string }) {
  const { navigateToTab, setFilterArea } = useOrchestratorContext();
  const areaSummaries = useMemo(() => buildAreaSummaries(PACKAGES), []);
  const [selectedArea, setSelectedArea] = useState("");

  const handleSelectArea = (area: string) => setSelectedArea(area === selectedArea ? "" : area);
  const handleNavigate = () => { if (selectedArea) { setFilterArea(selectedArea); navigateToTab("area-map"); } };
  const selected = areaSummaries.find(a => a.area === selectedArea);

  return (
    <div className={cn("relative rounded-lg border border-border overflow-hidden bg-black/90", className)}>
      <div className="w-full h-[480px]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Loading 3D model…</div>
        }>
          <Canvas shadows camera={{ position: [12, 18, 22], fov: 45, near: 0.1, far: 120 }} gl={{ antialias: true }}>
            <Scene areaSummaries={areaSummaries} selectedArea={selectedArea} onSelectArea={handleSelectArea} />
          </Canvas>
        </Suspense>
      </div>

      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-md border border-border px-3 py-2">
        {Object.entries(STATUS_COLOR).map(([label, color]) => (
          <div key={label} className="flex items-center gap-1.5 text-[10px] text-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>

      <div className="absolute top-3 right-3 text-[10px] text-muted-foreground bg-background/70 backdrop-blur-sm rounded px-2 py-1 border border-border">
        Click zone to select · Drag to rotate · Scroll to zoom
      </div>

      {selected && (
        <div className="absolute top-3 left-3 w-56 bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-foreground">{selected.area}</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: STATUS_COLOR[selected.status] + "20", color: STATUS_COLOR[selected.status] }}>
              {selected.status}
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-2">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${selected.pctComplete}%`, backgroundColor: STATUS_COLOR[selected.status] }} />
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] text-muted-foreground mb-3">
            <span>Packages: <span className="font-semibold text-foreground">{selected.total}</span></span>
            <span>Complete: <span className="font-semibold text-foreground">{selected.complete}</span></span>
            <span>Active: <span className="font-semibold text-foreground">{selected.active}</span></span>
            <span>Blocked: <span className="font-semibold text-foreground">{selected.blocked}</span></span>
          </div>
          <button onClick={handleNavigate} className="w-full text-center text-[10px] font-medium text-primary hover:underline">
            Open in Area Map →
          </button>
        </div>
      )}
    </div>
  );
}
