import { Suspense, useState, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Html, Billboard } from "@react-three/drei";
import { STORE_CONTAINERS, YARD_DIMENSIONS, DOME_DIMENSIONS, LAYDOWN_ZONES, FORKLIFT_LANE, DELIVERY_ZONE, dome3DPosition, base3DPosition, leftLeg3DPosition, rightLeg3DPosition, ldZone3DPosition, forkliftLane3DPosition, deliveryZone3DPosition, type StoreContainer } from "./storeLayoutData";
import { CONTAINER_FITOUTS, FURNITURE_COLORS, type FurnitureType, type FitoutItem, type ContainerFitout, getLocationPrefix, getBinCode } from "./containerFitoutData";
import * as THREE from "three";

interface StoreLayout3DProps {
  liveMode: boolean;
  sparesData?: Array<{
    id: string;
    description: string;
    bin_location: string | null;
    warehouse_area: string | null;
    category: string | null;
    part_number: string | null;
  }>;
}

/* ============ Yard View ============ */

/* ============ Roller Door ============ */

interface RollerDoorProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  doorWidth: number;
  doorHeight: number;
  isOpen: boolean;
  onToggle: (e: any) => void;
  containerColor: string;
}

const SLAT_COUNT = 14;

const RollerDoor = ({ position, rotation = [0, 0, 0], doorWidth, doorHeight, isOpen, onToggle, containerColor }: RollerDoorProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const openProgress = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const target = isOpen ? 1 : 0;
    openProgress.current += (target - openProgress.current) * Math.min(delta * 3.5, 1);
    if (groupRef.current) {
      // Door rolls up: translate Y upward by doorHeight * progress
      groupRef.current.position.y = openProgress.current * doorHeight * 0.85;
    }
  });

  const slatHeight = doorHeight / SLAT_COUNT;

  return (
    <group position={position} rotation={rotation}>
      {/* Door frame */}
      {[-1, 1].map((side) => (
        <mesh key={`frame${side}`} position={[side * (doorWidth / 2 + 0.015), doorHeight / 2, 0]}>
          <boxGeometry args={[0.03, doorHeight + 0.04, 0.04]} />
          <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Top rail / roller housing */}
      <mesh position={[0, doorHeight + 0.03, 0]}>
        <boxGeometry args={[doorWidth + 0.08, 0.06, 0.08]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Roller cylinder at top */}
      <mesh position={[0, doorHeight + 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, doorWidth + 0.04, 12]} />
        <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Animated slats group */}
      <group ref={groupRef}>
        {Array.from({ length: SLAT_COUNT }, (_, i) => {
          const slatY = i * slatHeight + slatHeight / 2;
          return (
            <mesh
              key={i}
              position={[0, slatY, 0]}
              onClick={onToggle}
              onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
            >
              <boxGeometry args={[doorWidth, slatHeight * 0.88, 0.015]} />
              <meshStandardMaterial
                color={hovered ? "#a1a1aa" : "#8a8a8a"}
                metalness={0.55}
                roughness={0.35}
              />
            </mesh>
          );
        })}
        {/* Slat divider lines */}
        {Array.from({ length: SLAT_COUNT - 1 }, (_, i) => {
          const lineY = (i + 1) * slatHeight;
          return (
            <mesh key={`line${i}`} position={[0, lineY, 0.008]}>
              <boxGeometry args={[doorWidth, 0.004, 0.002]} />
              <meshStandardMaterial color="#555" />
            </mesh>
          );
        })}
        {/* Bottom handle bar */}
        <mesh position={[0, slatHeight * 0.3, 0.015]}>
          <boxGeometry args={[doorWidth * 0.3, 0.02, 0.025]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Label */}
      <Billboard position={[0, doorHeight + 0.18, 0]}>
        <Text fontSize={0.06} color={hovered ? "#fbbf24" : "#a1a1aa"} anchorX="center">
          {isOpen ? "▼ CLOSE" : "▲ OPEN"} ROLLER DOOR
        </Text>
      </Billboard>
    </group>
  );
};

interface ContainerMeshProps {
  container: StoreContainer;
  partsCount: number;
  liveMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  doorOpen: boolean;
  onDoorToggle: () => void;
}

const ContainerMesh = ({ container, partsCount, liveMode, isSelected, onClick, doorOpen, onDoorToggle }: ContainerMeshProps) => {
  const [hovered, setHovered] = useState(false);
  const dim = container.physicalDimensions;

  // Scale to 3D world: 1m = 0.5 units for comfortable viewing
  const s = 0.5;
  const isVertical = container.orientation === "vertical";

  // For vertical containers, length runs along Z; for horizontal, along X
  const width = isVertical ? dim.externalWidthM * s : dim.externalLengthM * s;
  const depth = isVertical ? dim.externalLengthM * s : dim.externalWidthM * s;
  const height = dim.externalHeightM * s;
  const pos = container.position3D;

  const entry = container.entryPoints[0];

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <RoundedBox
        args={[width, height, depth]}
        radius={0.03}
        position={[0, height / 2, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <meshStandardMaterial
          color={container.color}
          transparent
          opacity={hovered || isSelected ? 0.85 : 0.55}
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Corrugated wall lines */}
      {Array.from({ length: 8 }, (_, i) => {
        const xPos = -width / 2 + (i + 1) * (width / 9);
        return (
          <mesh key={i} position={[xPos, height / 2, depth / 2 + 0.01]}>
            <planeGeometry args={[0.02, height * 0.9]} />
            <meshStandardMaterial color={container.color} opacity={0.3} transparent />
          </mesh>
        );
      })}

      {/* Roller Door facing into the dome courtyard */}
      {(() => {
        const doorH = height * 0.7;
        const doorW = Math.min(isVertical ? depth * 0.35 : width * 0.35, 0.55);

        const handleToggle = (e: any) => { e.stopPropagation(); onDoorToggle(); };

        if (container.id === "C01") {
          return <RollerDoor position={[width / 2 + 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]} doorWidth={doorW} doorHeight={doorH} isOpen={doorOpen} onToggle={handleToggle} containerColor={container.color} />;
        } else if (container.id === "C05") {
          return <RollerDoor position={[-width / 2 - 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]} doorWidth={doorW} doorHeight={doorH} isOpen={doorOpen} onToggle={handleToggle} containerColor={container.color} />;
        } else if (container.id === "C02") {
          return <RollerDoor position={[width / 2 + 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]} doorWidth={doorW} doorHeight={doorH} isOpen={doorOpen} onToggle={handleToggle} containerColor={container.color} />;
        } else if (container.id === "C04") {
          return <RollerDoor position={[-width / 2 - 0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]} doorWidth={doorW} doorHeight={doorH} isOpen={doorOpen} onToggle={handleToggle} containerColor={container.color} />;
        } else {
          return <RollerDoor position={[0, 0, -depth / 2 - 0.02]} rotation={[0, 0, 0]} doorWidth={doorW} doorHeight={doorH} isOpen={doorOpen} onToggle={handleToggle} containerColor={container.color} />;
        }
      })()}


      {/* Shelves inside (visible through transparency) */}
      {container.shelves.map((_, idx) => {
        const shelfY = ((container.bottomShelfHeightCm + idx * container.shelfHeightCm) / (dim.externalHeightM * 100)) * height;
        return (
          <mesh key={idx} position={[0, shelfY, 0]}>
            <boxGeometry args={[width - 0.08, 0.02, depth - 0.08]} />
            <meshStandardMaterial color="#888" opacity={0.4} transparent />
          </mesh>
        );
      })}

      {/* Labels — always face camera */}
      <Billboard position={[0, height + 0.3, 0]}>
        <Text fontSize={0.22} color={container.color} fontWeight="bold" anchorX="center" anchorY="middle">
          {container.id}
        </Text>
      </Billboard>
      <Billboard position={[0, height + 0.08, 0]}>
        <Text fontSize={0.12} color="#888" anchorX="center" anchorY="middle">
          {container.shortLabel}
        </Text>
      </Billboard>
      <Billboard position={[0, height + 0.5, 0]}>
        <Text fontSize={0.08} color="#666" anchorX="center" anchorY="middle">
          {dim.externalLengthM}m × {dim.externalWidthM}m × {dim.externalHeightM}m
        </Text>
      </Billboard>

      {liveMode && (
        <Billboard position={[0, height + 0.65, 0]}>
          <Text fontSize={0.1} color={partsCount > 0 ? "#22c55e" : "#94a3b8"} anchorX="center" anchorY="middle">
            {partsCount} parts
          </Text>
        </Billboard>
      )}

      {(hovered || isSelected) && (
        <Html position={[0, height + 0.9, 0]} center>
          <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs whitespace-nowrap pointer-events-none min-w-[200px]">
            <p className="font-bold text-sm">{container.label}</p>
            <p className="text-muted-foreground">{container.zone} • {container.containerType}</p>
            <p className="text-muted-foreground">{dim.externalLengthM}m × {dim.externalWidthM}m × {dim.externalHeightM}m</p>
            <p className="text-muted-foreground">{container.shelves.length} shelves × {container.binsPerShelf} bins</p>
            <p className="text-muted-foreground">Entry: {container.entryPoints[0]?.type.replace(/-/g, " ")} ({container.entryPoints[0]?.widthCm}cm)</p>
            {liveMode && <p className="text-primary font-medium mt-1">{partsCount} parts stored</p>}
            <p className="text-primary/70 text-[10px] mt-1">Click door to open/close • Click container to enter →</p>
          </div>
        </Html>
      )}
    </group>
  );
};

/* ============ Interior View ============ */

interface ContainerInterior3DProps {
  container: StoreContainer;
  parts: Array<{
    id: string;
    description: string;
    bin_location: string | null;
    warehouse_area: string | null;
    category: string | null;
    part_number: string | null;
  }>;
  liveMode: boolean;
}

/** 3D height (m) for each furniture type */
const FURNITURE_3D_HEIGHT: Record<FurnitureType, number> = {
  "shelving-bay": 1.8,
  "bin-wall": 1.5,
  "cabinet": 1.8,
  "drawer-unit": 0.9,
  "rack": 1.8,
  "conduit-bracket": 0.3,
  "foam-totes": 1.2,
  "ppe-rack": 1.5,
  "bunded-shelf": 0.9,
  "flat-shelf": 1.2,
  "esd-panel": 1.5,
  "reinforced-shelf": 1.2,
};

const FitoutItemMesh = ({ item, fitout, containerColor, onItemClick }: { item: FitoutItem; fitout: ContainerFitout; containerColor: string; onItemClick?: (item: FitoutItem) => void }) => {
  const [hovered, setHovered] = useState(false);
  const intL = fitout.internalLengthMm / 1000;
  const intW = fitout.internalWidthMm / 1000;
  const intH = 2.39;

  const itemXm = item.x / 1000;
  const itemYm = item.y / 1000;
  const itemWm = item.width / 1000;
  const itemDm = item.height / 1000;
  const itemHm = FURNITURE_3D_HEIGHT[item.type];

  const x3d = -intL / 2 + itemXm + itemWm / 2;
  const z3d = -intW / 2 + itemYm + itemDm / 2;
  const y3d = -intH / 2 + itemHm / 2;

  const colors = FURNITURE_COLORS[item.type];
  const fillColor = colors.stroke;

  return (
    <group position={[x3d, y3d, z3d]}>
      <RoundedBox
        args={[itemWm, itemHm, itemDm]}
        radius={0.01}
        onClick={(e) => { e.stopPropagation(); onItemClick?.(item); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <meshStandardMaterial
          color={fillColor}
          transparent
          opacity={hovered ? 0.7 : 0.45}
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(itemWm, itemHm, itemDm)]} />
        <lineBasicMaterial color={fillColor} opacity={0.6} transparent />
      </lineSegments>

      {(item.type === "shelving-bay" || item.type === "reinforced-shelf") && (
        <>
          {[0.2, 0.4, 0.6, 0.8].map((frac) => (
            <mesh key={frac} position={[0, -itemHm / 2 + frac * itemHm, 0]}>
              <boxGeometry args={[itemWm - 0.01, 0.008, itemDm - 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.3} transparent />
            </mesh>
          ))}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * (itemWm / 2 - 0.015), 0, 0]}>
              <boxGeometry args={[0.03, itemHm, 0.03]} />
              <meshStandardMaterial color="#666" opacity={0.5} transparent />
            </mesh>
          ))}
        </>
      )}

      {item.type === "drawer-unit" && (
        <>
          {[0.15, 0.35, 0.55, 0.75, 0.95].map((frac) => (
            <mesh key={frac} position={[0, -itemHm / 2 + frac * itemHm, itemDm / 2 - 0.005]}>
              <boxGeometry args={[itemWm - 0.02, 0.005, 0.01]} />
              <meshStandardMaterial color="#444" opacity={0.6} transparent />
            </mesh>
          ))}
          {[0.25, 0.45, 0.65, 0.85].map((frac) => (
            <mesh key={`h${frac}`} position={[0, -itemHm / 2 + frac * itemHm, itemDm / 2 + 0.01]}>
              <boxGeometry args={[0.06, 0.008, 0.015]} />
              <meshStandardMaterial color="#888" opacity={0.7} transparent />
            </mesh>
          ))}
        </>
      )}

      {item.type === "cabinet" && (
        <mesh position={[0, 0, itemDm / 2 + 0.005]}>
          <planeGeometry args={[itemWm * 0.9, itemHm * 0.9]} />
          <meshStandardMaterial color={fillColor} opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {(item.type === "bin-wall" || item.type === "esd-panel") && (
        <>
          {[0.25, 0.5, 0.75].map((frac) => (
            <mesh key={`h${frac}`} position={[0, -itemHm / 2 + frac * itemHm, itemDm / 2 - 0.005]}>
              <boxGeometry args={[itemWm - 0.02, 0.005, 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.4} transparent />
            </mesh>
          ))}
          {[0.2, 0.4, 0.6, 0.8].map((frac) => (
            <mesh key={`v${frac}`} position={[-itemWm / 2 + frac * itemWm, 0, itemDm / 2 - 0.005]}>
              <boxGeometry args={[0.005, itemHm - 0.02, 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.4} transparent />
            </mesh>
          ))}
        </>
      )}

      {/* Location code label on front face */}
      <Text
        position={[0, 0.06, itemDm / 2 + 0.02]}
        fontSize={Math.min(0.06, itemWm * 0.09)}
        color="#f59e0b"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        maxWidth={itemWm * 0.9}
      >
        {getLocationPrefix(fitout.containerId, item.bayLetter)}
      </Text>
      <Text
        position={[0, -0.06, itemDm / 2 + 0.02]}
        fontSize={Math.min(0.05, itemWm * 0.07)}
        color={fillColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={itemWm * 0.9}
      >
        {item.shortLabel}
      </Text>

      {hovered && (
        <Html position={[0, itemHm / 2 + 0.15, 0]} center>
          <div className="bg-popover border border-border rounded-lg p-2.5 shadow-lg text-xs whitespace-nowrap pointer-events-none min-w-[200px]">
            <p className="font-bold text-sm">{item.label}</p>
            <p className="text-primary font-mono font-bold text-xs">
              {getLocationPrefix(fitout.containerId, item.bayLetter)}
            </p>
            <p className="text-muted-foreground capitalize">{item.type.replace(/-/g, " ")}</p>
            <p className="text-muted-foreground font-mono text-[10px]">
              {item.width}mm × {item.height}mm × {(FURNITURE_3D_HEIGHT[item.type] * 1000).toFixed(0)}mm (W×D×H)
            </p>
            <p className="text-primary/70 text-[10px] mt-1">Click to inspect →</p>
          </div>
        </Html>
      )}
    </group>
  );
};

/* ============ Item Detail 3D View ============ */

interface ItemDetail3DProps {
  item: FitoutItem;
  containerColor: string;
  containerId: string;
}

const DimensionLine = ({ start, end, label, color = "#94a3b8" }: { start: [number, number, number]; end: [number, number, number]; label: string; color?: string }) => {
  const midX = (start[0] + end[0]) / 2;
  const midY = (start[1] + end[1]) / 2;
  const midZ = (start[2] + end[2]) / 2;

  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <group>
      <line>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color={color} opacity={0.7} transparent />
      </line>
      {/* End ticks */}
      {[start, end].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
      <Billboard position={[midX, midY, midZ]}>
        <Text fontSize={0.06} color={color} anchorX="center" anchorY="middle" fontWeight="bold">
          {label}
        </Text>
      </Billboard>
    </group>
  );
};

const ItemDetail3D = ({ item, containerColor, containerId }: ItemDetail3DProps) => {
  const locPrefix = getLocationPrefix(containerId, item.bayLetter);
  const itemW = item.width / 1000;
  const itemD = item.height / 1000;
  const itemH = FURNITURE_3D_HEIGHT[item.type];
  const colors = FURNITURE_COLORS[item.type];
  const fillColor = colors.stroke;

  const drawerFracs = item.type === "drawer-unit" ? [0.15, 0.35, 0.55, 0.75, 0.95] : [];

  // Real shelf positions: 5 shelves for 1800mm bay (bottom + 4 upper at 360mm spacing)
  // For other heights, distribute evenly at ~360mm intervals
  const shelfPositionsMm: number[] = useMemo(() => {
    if (item.type !== "shelving-bay" && item.type !== "reinforced-shelf") return [];
    const heightMm = itemH * 1000;
    const shelfSpacingMm = 360; // standard 360mm shelf spacing
    const positions: number[] = [];
    // Bottom shelf at ~floor level (included as base)
    for (let h = shelfSpacingMm; h < heightMm - 50; h += shelfSpacingMm) {
      positions.push(h);
    }
    return positions;
  }, [item.type, itemH]);

  const margin = 0.25;

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 4]} intensity={0.7} />
      <pointLight position={[-2, 3, -2]} intensity={0.3} />

      <group position={[0, 0, 0]}>
        {/* Main body — very transparent so shelves are always visible */}
        <RoundedBox args={[itemW, itemH, itemD]} radius={0.01} position={[0, itemH / 2, 0]}>
          <meshStandardMaterial color={fillColor} transparent opacity={0.12} metalness={0.15} roughness={0.7} depthWrite={false} />
        </RoundedBox>

        {/* Wireframe */}
        <lineSegments position={[0, itemH / 2, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(itemW, itemH, itemD)]} />
          <lineBasicMaterial color={fillColor} opacity={0.6} transparent />
        </lineSegments>

        {/* Bottom shelf (base plate) — Bin 1 */}
        {(item.type === "shelving-bay" || item.type === "reinforced-shelf") && (
          <group>
            <mesh position={[0, 0.006, 0]}>
              <boxGeometry args={[itemW - 0.01, 0.012, itemD - 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.85} />
            </mesh>
            <Billboard position={[itemW / 2 + margin * 0.55, 0.006, 0]}>
              <Text fontSize={0.045} color="#f59e0b" anchorX="left" fontWeight="bold">
                {getBinCode(containerId, item.bayLetter, 1)} — Base @ 0mm
              </Text>
            </Billboard>
          </group>
        )}

        {/* Shelves at real positions — Bins 2, 3, 4... */}
        {shelfPositionsMm.map((hmm, idx) => {
          const shelfY = hmm / 1000;
          const binNum = idx + 2; // bin 1 is base
          return (
            <group key={hmm}>
              <mesh position={[0, shelfY, 0]}>
                <boxGeometry args={[itemW - 0.01, 0.012, itemD - 0.01]} />
                <meshStandardMaterial color={fillColor} opacity={0.85} />
              </mesh>
              <Billboard position={[itemW / 2 + margin * 0.55, shelfY, 0]}>
                <Text fontSize={0.045} color="#f59e0b" anchorX="left" fontWeight="bold">
                  {getBinCode(containerId, item.bayLetter, binNum)} — Shelf @ {hmm}mm
                </Text>
              </Billboard>
            </group>
          );
        })}

        {/* Uprights — 4 corner posts */}
        {(item.type === "shelving-bay" || item.type === "reinforced-shelf") && (
          <>
            {[-1, 1].map((sideX) =>
              [-1, 1].map((sideZ) => (
                <mesh key={`${sideX}${sideZ}`} position={[sideX * (itemW / 2 - 0.02), itemH / 2, sideZ * (itemD / 2 - 0.02)]}>
                  <boxGeometry args={[0.04, itemH, 0.04]} />
                  <meshStandardMaterial color="#555" opacity={0.7} transparent />
                </mesh>
              ))
            )}
          </>
        )}

        {/* Drawer details */}
        {drawerFracs.map((frac, i) => (
          <group key={frac}>
            <mesh position={[0, frac * itemH, itemD / 2 - 0.005]}>
              <boxGeometry args={[itemW - 0.02, 0.008, 0.01]} />
              <meshStandardMaterial color="#444" opacity={0.7} transparent />
            </mesh>
            {i < drawerFracs.length - 1 && (
              <mesh position={[0, (frac + (drawerFracs[i + 1] - frac) / 2) * itemH, itemD / 2 + 0.015]}>
                <boxGeometry args={[0.08, 0.01, 0.02]} />
                <meshStandardMaterial color="#999" metalness={0.5} roughness={0.3} />
              </mesh>
            )}
          </group>
        ))}

        {/* Cabinet door */}
        {item.type === "cabinet" && (
          <>
            <mesh position={[0, itemH / 2, itemD / 2 + 0.008]}>
              <planeGeometry args={[itemW * 0.92, itemH * 0.92]} />
              <meshStandardMaterial color={fillColor} opacity={0.12} transparent side={THREE.DoubleSide} />
            </mesh>
            <lineSegments position={[0, itemH / 2, itemD / 2 + 0.009]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(itemW * 0.92, itemH * 0.92)]} />
              <lineBasicMaterial color={fillColor} opacity={0.4} transparent />
            </lineSegments>
            {/* Handle */}
            <mesh position={[itemW * 0.35, itemH / 2, itemD / 2 + 0.02]}>
              <boxGeometry args={[0.015, 0.1, 0.025]} />
              <meshStandardMaterial color="#888" metalness={0.5} roughness={0.3} />
            </mesh>
          </>
        )}

        {/* Bin wall / ESD grid */}
        {(item.type === "bin-wall" || item.type === "esd-panel") && (
          <>
            {[0.25, 0.5, 0.75].map((frac) => (
              <mesh key={`h${frac}`} position={[0, frac * itemH, itemD / 2 - 0.005]}>
                <boxGeometry args={[itemW - 0.02, 0.008, 0.012]} />
                <meshStandardMaterial color={fillColor} opacity={0.5} transparent />
              </mesh>
            ))}
            {[0.2, 0.4, 0.6, 0.8].map((frac) => (
              <mesh key={`v${frac}`} position={[-itemW / 2 + frac * itemW, itemH / 2, itemD / 2 - 0.005]}>
                <boxGeometry args={[0.008, itemH - 0.02, 0.012]} />
                <meshStandardMaterial color={fillColor} opacity={0.5} transparent />
              </mesh>
            ))}
          </>
        )}

        {/* Floor shadow */}
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[itemW + 0.2, itemD + 0.2]} />
          <meshStandardMaterial color="#94a3b8" opacity={0.08} transparent />
        </mesh>

        {/* ===== DIMENSION LINES ===== */}
        {/* Width (X) — along front, below */}
        <DimensionLine
          start={[-itemW / 2, -0.08, itemD / 2 + margin * 0.6]}
          end={[itemW / 2, -0.08, itemD / 2 + margin * 0.6]}
          label={`${item.width}mm`}
          color="#3b82f6"
        />
        {/* Depth (Z) — along side */}
        <DimensionLine
          start={[-itemW / 2 - margin * 0.6, -0.08, -itemD / 2]}
          end={[-itemW / 2 - margin * 0.6, -0.08, itemD / 2]}
          label={`${item.height}mm`}
          color="#22c55e"
        />
        {/* Height (Y) — vertical on side */}
        <DimensionLine
          start={[-itemW / 2 - margin * 0.6, 0, -itemD / 2 - margin * 0.4]}
          end={[-itemW / 2 - margin * 0.6, itemH, -itemD / 2 - margin * 0.4]}
          label={`${(itemH * 1000).toFixed(0)}mm`}
          color="#f59e0b"
        />

        {/* Title */}
        <Billboard position={[0, itemH + 0.35, 0]}>
          <Text fontSize={0.1} color={fillColor} fontWeight="bold" anchorX="center">
            {item.label}
          </Text>
        </Billboard>
        <Billboard position={[0, itemH + 0.22, 0]}>
          <Text fontSize={0.09} color="#f59e0b" fontWeight="bold" anchorX="center">
            {locPrefix}
          </Text>
        </Billboard>
        <Billboard position={[0, itemH + 0.1, 0]}>
          <Text fontSize={0.055} color="#888" anchorX="center">
            {item.type.replace(/-/g, " ").toUpperCase()} — {item.width}mm × {item.height}mm × {(itemH * 1000).toFixed(0)}mm (W×D×H)
          </Text>
        </Billboard>
      </group>

      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 1.6} minDistance={0.3} maxDistance={4} target={[0, itemH / 2, 0]} />
    </>
  );
};

/* ============ Interior Roller Door ============ */

const INTERIOR_SLAT_COUNT = 18;

const InteriorRollerDoor = ({ doorWidth, doorHeight, isOpen, onToggle }: { doorWidth: number; doorHeight: number; isOpen: boolean; onToggle: (e: any) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const openProgress = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const target = isOpen ? 1 : 0;
    openProgress.current += (target - openProgress.current) * Math.min(delta * 3, 1);
    if (groupRef.current) {
      groupRef.current.position.y = openProgress.current * doorHeight * 0.92;
    }
  });

  const slatHeight = doorHeight / INTERIOR_SLAT_COUNT;

  return (
    <group>
      {/* Door frame — left and right uprights */}
      {[-1, 1].map((side) => (
        <mesh key={`frame${side}`} position={[side * (doorWidth / 2 + 0.015), doorHeight / 2, 0]}>
          <boxGeometry args={[0.025, doorHeight + 0.03, 0.035]} />
          <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Top roller housing */}
      <mesh position={[0, doorHeight + 0.02, 0]}>
        <boxGeometry args={[doorWidth + 0.06, 0.05, 0.07]} />
        <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Roller cylinder */}
      <mesh position={[0, doorHeight + 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, doorWidth + 0.03, 12]} />
        <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Animated slats */}
      <group ref={groupRef}>
        {Array.from({ length: INTERIOR_SLAT_COUNT }, (_, i) => {
          const slatY = i * slatHeight + slatHeight / 2;
          return (
            <mesh
              key={i}
              position={[0, slatY, 0]}
              onClick={onToggle}
              onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
              onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
            >
              <boxGeometry args={[doorWidth, slatHeight * 0.9, 0.012]} />
              <meshStandardMaterial
                color={hovered ? "#a1a1aa" : "#7a7a7a"}
                metalness={0.5}
                roughness={0.35}
              />
            </mesh>
          );
        })}
        {/* Slat dividers */}
        {Array.from({ length: INTERIOR_SLAT_COUNT - 1 }, (_, i) => {
          const lineY = (i + 1) * slatHeight;
          return (
            <mesh key={`line${i}`} position={[0, lineY, 0.007]}>
              <boxGeometry args={[doorWidth, 0.003, 0.002]} />
              <meshStandardMaterial color="#444" />
            </mesh>
          );
        })}
        {/* Bottom handle */}
        <mesh position={[0, slatHeight * 0.3, 0.012]}>
          <boxGeometry args={[doorWidth * 0.25, 0.018, 0.022]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Label */}
      <Billboard position={[0, doorHeight + 0.14, 0]}>
        <Text fontSize={0.055} color={hovered ? "#fbbf24" : "#a1a1aa"} anchorX="center">
          {isOpen ? "▼ CLOSE" : "▲ OPEN"} ROLLER DOOR
        </Text>
      </Billboard>
    </group>
  );
};

/* ============ Container Interior ============ */

const ContainerInterior3D = ({ container, parts, liveMode, onItemClick }: ContainerInterior3DProps & { onItemClick?: (item: FitoutItem) => void }) => {
  const dim = container.physicalDimensions;
  const fitout = CONTAINER_FITOUTS[container.id];
  const [interiorDoorOpen, setInteriorDoorOpen] = useState(false);

  const intWidth = dim.internalLengthM;
  const intHeight = dim.internalHeightM;
  const intDepth = dim.internalWidthM;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <pointLight position={[0, intHeight, 2]} intensity={0.4} color="#fff" />

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(intWidth + 0.1, intHeight, intDepth + 0.1)]} />
        <lineBasicMaterial color={container.color} opacity={0.3} transparent />
      </lineSegments>

      <mesh position={[0, 0, -intDepth / 2]}>
        <planeGeometry args={[intWidth + 0.1, intHeight]} />
        <meshStandardMaterial color={container.color} opacity={0.06} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, intDepth / 2]}>
        <planeGeometry args={[intWidth + 0.1, intHeight]} />
        <meshStandardMaterial color={container.color} opacity={0.04} transparent side={THREE.DoubleSide} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (intWidth / 2 + 0.05), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[intDepth + 0.1, intHeight]} />
          <meshStandardMaterial color={container.color} opacity={0.05} transparent side={THREE.DoubleSide} />
        </mesh>
      ))}

      <mesh position={[0, -intHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[intWidth, intDepth]} />
        <meshStandardMaterial color="#94a3b8" opacity={0.15} transparent />
      </mesh>
      <mesh position={[0, -intHeight / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[intWidth - 0.1, dim.aisleWidthCm / 100]} />
        <meshStandardMaterial color="#22c55e" opacity={0.08} transparent />
      </mesh>

      {/* Full-width roller door on the door-side wall */}
      {fitout && (() => {
        const doorWm = intWidth * 0.95; // nearly full width
        const doorH = intHeight * 0.92; // floor to near-roof
        return (
          <group position={[0, -intHeight / 2, intDepth / 2 + 0.02]}>
            <InteriorRollerDoor
              doorWidth={doorWm}
              doorHeight={doorH}
              isOpen={interiorDoorOpen}
              onToggle={(e) => { e.stopPropagation(); setInteriorDoorOpen(prev => !prev); }}
            />
          </group>
        );
      })()}

      <Billboard position={[0, intHeight / 2 - 0.1, -intDepth / 2 - 0.08]}>
        <Text fontSize={0.06} color="#888" anchorX="center">REAR WALL (Top in Plan)</Text>
      </Billboard>
      <Billboard position={[0, intHeight / 2 - 0.1, intDepth / 2 + 0.08]}>
        <Text fontSize={0.06} color="#22c55e" anchorX="center">DOOR SIDE (Bottom in Plan)</Text>
      </Billboard>
      <Billboard position={[-intWidth / 2 - 0.08, intHeight / 2 - 0.1, 0]}>
        <Text fontSize={0.06} color="#888" anchorX="center">END WALL 1</Text>
      </Billboard>
      <Billboard position={[intWidth / 2 + 0.08, intHeight / 2 - 0.1, 0]}>
        <Text fontSize={0.06} color="#888" anchorX="center">END WALL 2</Text>
      </Billboard>

      {fitout && fitout.items.map((fItem) => (
        <FitoutItemMesh
          key={fItem.id}
          item={fItem}
          fitout={fitout}
          containerColor={container.color}
          onItemClick={onItemClick}
        />
      ))}

      <Text position={[0, intHeight / 2 + 0.15, 0]} fontSize={0.14} color={container.color} fontWeight="bold" anchorX="center">
        {container.id} — {container.label}
      </Text>
      <Text position={[0, intHeight / 2 + 0.02, 0]} fontSize={0.07} color="#888" anchorX="center">
        {dim.internalLengthM}m × {dim.internalWidthM}m × {dim.internalHeightM}m · {fitout ? fitout.items.length : 0} fitout items
      </Text>
      <Text position={[0, -intHeight / 2 - 0.1, intDepth / 2 + 0.15]} fontSize={0.06} color="#22c55e" anchorX="center">
        Aisle: {dim.aisleWidthCm}cm
      </Text>

      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 1.8} minDistance={1} maxDistance={8} target={[0, 0, 0]} />
    </>
  );
};

/* ============ Dome Roof Skin ============ */

const DomeRoofSkin = ({ halfSpan, d, rise, archSegments }: { halfSpan: number; d: number; rise: number; archSegments: number }) => {
  const geometry = useMemo(() => {
    const depthSegs = 8;
    const verts: number[] = [];
    const indices: number[] = [];
    for (let j = 0; j <= depthSegs; j++) {
      const z = -d / 2 + (j / depthSegs) * d;
      for (let i = 0; i <= archSegments; i++) {
        const t = i / archSegments;
        const angle = t * Math.PI;
        const x = -halfSpan + t * (2 * halfSpan);
        const y = Math.sin(angle) * rise;
        verts.push(x, y, z);
      }
    }
    for (let j = 0; j < depthSegs; j++) {
      for (let i = 0; i < archSegments; i++) {
        const a = j * (archSegments + 1) + i;
        const b = a + 1;
        const c = a + (archSegments + 1);
        const dd = c + 1;
        indices.push(a, b, c, b, dd, c);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [halfSpan, d, rise, archSegments]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#e0f2fe" transparent opacity={0.1} side={THREE.DoubleSide} metalness={0.2} roughness={0.7} />
    </mesh>
  );
};

/* ============ Dome Roof ============ */

const DomeRoof = () => {
  const s = 0.5;
  const domeWidthM = DOME_DIMENSIONS.widthM; // 12m span between legs
  const domeDepthM = DOME_DIMENSIONS.depthM; // 9.5m courtyard depth
  const containerHeightM = 2.59;
  const domeRiseM = 2.5; // modest arch rise above container tops
  const dome = dome3DPosition();

  const centreX = dome.x;
  const centreZ = dome.z;

  const halfSpan = (domeWidthM * s) / 2;
  const d = domeDepthM * s;
  const baseY = containerHeightM * s;
  const rise = domeRiseM * s;

  // Build a barrel-vault shape using a custom extruded arch
  const archSegments = 32;

  return (
    <group position={[centreX, baseY, centreZ]}>
      {/* Arch ribs along the depth */}
      {Array.from({ length: 7 }, (_, i) => {
        const zPos = -d / 2 + (i + 0.5) * (d / 7);
        const points: THREE.Vector3[] = [];
        for (let a = 0; a <= archSegments; a++) {
          const t = a / archSegments; // 0..1
          const angle = t * Math.PI; // 0..PI
          const x = -halfSpan + t * (2 * halfSpan);
          const y = Math.sin(angle) * rise;
          points.push(new THREE.Vector3(x, y, zPos));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        return (
          <mesh key={i}>
            <tubeGeometry args={[curve, archSegments, 0.018, 6, false]} />
            <meshStandardMaterial color="#64748b" opacity={0.45} transparent metalness={0.5} />
          </mesh>
        );
      })}

      {/* Translucent roof skin (custom barrel-vault geometry) */}
      <DomeRoofSkin halfSpan={halfSpan} d={d} rise={rise} archSegments={archSegments} />

      {/* Ridge beam along the top */}
      <mesh position={[0, rise, 0]}>
        <boxGeometry args={[0.03, 0.03, d]} />
        <meshStandardMaterial color="#64748b" opacity={0.5} transparent metalness={0.5} />
      </mesh>

      {/* Base edge beams on container tops */}
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * halfSpan, 0, 0]}>
          <boxGeometry args={[0.04, 0.04, d]} />
          <meshStandardMaterial color="#475569" opacity={0.4} transparent />
        </mesh>
      ))}

      {/* Longitudinal stringers */}
      {[-0.5, 0.5].map(frac => {
        const x = frac * 2 * halfSpan;
        const y = Math.sin((frac + 0.5) * Math.PI) * rise;
        return (
          <mesh key={frac} position={[x, y, 0]}>
            <boxGeometry args={[0.02, 0.02, d]} />
            <meshStandardMaterial color="#64748b" opacity={0.3} transparent />
          </mesh>
        );
      })}

      {/* Label */}
      <Billboard position={[0, rise + 0.3, 0]}>
        <Text fontSize={0.18} color="#64748b" anchorX="center" fillOpacity={0.5}>
          DOME SHELTER {domeWidthM}m × {domeDepthM}m
        </Text>
      </Billboard>
    </group>
  );
};

/* ============ Ground ============ */

const Ground = () => {
  const domeW = DOME_DIMENSIONS.widthM * 0.5;
  const domeD = DOME_DIMENSIONS.depthM * 0.5;
  const dome = dome3DPosition();
  const base = base3DPosition();
  const left = leftLeg3DPosition();
  const right = rightLeg3DPosition();
  const s = 0.5;

  return (
    <>
      {/* Main ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, dome.z + 2]} receiveShadow>
        <planeGeometry args={[26, 30]} />
        <meshStandardMaterial color="#e2e8f0" opacity={0.4} transparent />
      </mesh>

      {/* Dome courtyard area (concrete pad) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dome.x, 0.01, dome.z]}>
        <planeGeometry args={[domeW, domeD]} />
        <meshStandardMaterial color="#22c55e" opacity={0.06} transparent />
      </mesh>
      <Billboard position={[dome.x, 0.15, dome.z]}>
        <Text fontSize={0.2} color="#22c55e" anchorX="center" fillOpacity={0.2}>CONCRETE PAD</Text>
      </Billboard>
      <Billboard position={[dome.x, 0.15, dome.z + 0.5]}>
        <Text fontSize={0.12} color="#22c55e" anchorX="center" fillOpacity={0.25}>{DOME_DIMENSIONS.widthM}m × {DOME_DIMENSIONS.depthM}m</Text>
      </Billboard>

      {/* Zone labels on ground */}
      <Billboard position={[left.x, 0.15, left.z]}>
        <Text fontSize={0.15} color="#6366f1" anchorX="center">LEFT LEG — CLEAN</Text>
      </Billboard>
      <Billboard position={[right.x, 0.15, right.z]}>
        <Text fontSize={0.15} color="#64748b" anchorX="center">RIGHT LEG — HIGH-ACCESS</Text>
      </Billboard>
      <Billboard position={[base.x, 0.15, base.z + 1]}>
        <Text fontSize={0.15} color="#3b82f6" anchorX="center">BASE — MECHANICAL (40ft)</Text>
      </Billboard>

      {/* ===== LAYDOWN ZONES ===== */}
      {LAYDOWN_ZONES.map((zone) => {
        const pos = ldZone3DPosition(zone);
        const w = zone.physicalWidthM * s;
        const d = zone.physicalDepthM * s;
        const isDome = zone.type === "dome-row";
        return (
          <group key={zone.id}>
            {/* Ground pad */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[pos.x, 0.02, pos.z]}>
              <planeGeometry args={[w, d]} />
              <meshStandardMaterial color={zone.color} opacity={isDome ? 0.1 : 0.06} transparent />
            </mesh>
            {/* Border outline */}
            <lineSegments position={[pos.x, 0.03, pos.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(w, d)]} />
              <lineBasicMaterial color={zone.color} opacity={0.4} transparent />
            </lineSegments>
            {/* Label */}
            <Billboard position={[pos.x, 0.15, pos.z]}>
              <Text fontSize={0.12} color={zone.color} anchorX="center" fontWeight="bold">{zone.id}</Text>
            </Billboard>
            {/* Pallet markers for dome rows */}
            {isDome && Array.from({ length: 3 }, (_, i) => (
              <mesh key={i} position={[pos.x + (i - 1) * (w / 3), 0.06, pos.z]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[w / 3.5, d * 0.7]} />
                <meshStandardMaterial color={zone.color} opacity={0.08} transparent />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Forklift access lane */}
      {(() => {
        const fPos = forkliftLane3DPosition();
        const fW = 3 * s;
        const fH = (FORKLIFT_LANE.height / 25) * s;
        return (
          <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[fPos.x, 0.02, fPos.z]}>
              <planeGeometry args={[fW, fH]} />
              <meshStandardMaterial color="#ca8a04" opacity={0.1} transparent />
            </mesh>
            <Billboard position={[fPos.x, 0.15, fPos.z]}>
              <Text fontSize={0.1} color="#ca8a04" anchorX="center" fontWeight="bold">FORKLIFT</Text>
            </Billboard>
          </group>
        );
      })()}

      {/* Delivery zone */}
      {(() => {
        const dPos = deliveryZone3DPosition();
        const dW = 5 * s;
        const dH = 3 * s;
        return (
          <group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[dPos.x, 0.02, dPos.z]}>
              <planeGeometry args={[dW, dH]} />
              <meshStandardMaterial color="#dc2626" opacity={0.12} transparent />
            </mesh>
            <lineSegments position={[dPos.x, 0.03, dPos.z]} rotation={[-Math.PI / 2, 0, 0]}>
              <edgesGeometry args={[new THREE.PlaneGeometry(dW, dH)]} />
              <lineBasicMaterial color="#dc2626" opacity={0.5} transparent />
            </lineSegments>
            <Billboard position={[dPos.x, 0.15, dPos.z]}>
              <Text fontSize={0.15} color="#dc2626" anchorX="center" fontWeight="bold">DELIVERY</Text>
            </Billboard>
          </group>
        );
      })()}
    </>
  );
};

/* ============ Security Fence & Sliding Gate ============ */

const SecurityFence = () => {
  const s = 0.5;
  const dome = dome3DPosition();
  const domeD = DOME_DIMENSIONS.depthM * s;
  const fenceSpanM = DOME_DIMENSIONS.widthM; // 12m opening
  const fenceSpan = fenceSpanM * s; // 3D units
  const fenceHeightM = 2.4; // matches container height
  const fenceHeight = fenceHeightM * s;
  const gateWidthM = 4; // 4m sliding gate opening
  const gateWidth = gateWidthM * s;

  // Front of courtyard (min Z of dome)
  const frontZ = dome.z - domeD / 2;
  const centreX = dome.x;

  const barSpacingM = 0.2; // 200mm between bars
  const barSpacing = barSpacingM * s;
  const barThickness = 0.025; // visual thickness in 3D units

  // Number of bars across each fence panel (left and right of gate)
  const panelWidth = (fenceSpan - gateWidth) / 2;
  const barsPerPanel = Math.floor(panelWidth / barSpacing);

  // Horizontal rail positions (fraction of height)
  const railHeights = [0.05, 0.5, 0.95];

  return (
    <group position={[centreX, 0, frontZ]}>
      {/* === LEFT PANEL (from -fenceSpan/2 to -gateWidth/2) === */}
      {(() => {
        const panelLeft = -fenceSpan / 2;
        const panelRight = -gateWidth / 2;
        const pw = panelRight - panelLeft;
        return (
          <group>
            {/* Vertical bars */}
            {Array.from({ length: barsPerPanel + 1 }, (_, i) => {
              const x = panelLeft + i * barSpacing;
              if (x > panelRight + 0.01) return null;
              return (
                <mesh key={`lv${i}`} position={[x, fenceHeight / 2, 0]}>
                  <boxGeometry args={[barThickness, fenceHeight, barThickness]} />
                  <meshStandardMaterial color="#71717a" metalness={0.6} roughness={0.3} />
                </mesh>
              );
            })}
            {/* Horizontal rails */}
            {railHeights.map((frac) => (
              <mesh key={`lh${frac}`} position={[(panelLeft + panelRight) / 2, frac * fenceHeight, 0]}>
                <boxGeometry args={[pw, barThickness * 1.2, barThickness * 1.5]} />
                <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* === RIGHT PANEL (from +gateWidth/2 to +fenceSpan/2) === */}
      {(() => {
        const panelLeft = gateWidth / 2;
        const panelRight = fenceSpan / 2;
        const pw = panelRight - panelLeft;
        return (
          <group>
            {/* Vertical bars */}
            {Array.from({ length: barsPerPanel + 1 }, (_, i) => {
              const x = panelLeft + i * barSpacing;
              if (x > panelRight + 0.01) return null;
              return (
                <mesh key={`rv${i}`} position={[x, fenceHeight / 2, 0]}>
                  <boxGeometry args={[barThickness, fenceHeight, barThickness]} />
                  <meshStandardMaterial color="#71717a" metalness={0.6} roughness={0.3} />
                </mesh>
              );
            })}
            {/* Horizontal rails */}
            {railHeights.map((frac) => (
              <mesh key={`rh${frac}`} position={[(panelLeft + panelRight) / 2, frac * fenceHeight, 0]}>
                <boxGeometry args={[pw, barThickness * 1.2, barThickness * 1.5]} />
                <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.3} />
              </mesh>
            ))}
          </group>
        );
      })()}

      {/* === SLIDING GATE (center, slightly offset to show slide action) === */}
      {(() => {
        const gateOffsetX = 0.15; // slightly open offset to show sliding capability
        const gateBarCount = Math.floor(gateWidth / barSpacing);
        return (
          <group position={[gateOffsetX, 0, 0]}>
            {/* Gate vertical bars */}
            {Array.from({ length: gateBarCount + 1 }, (_, i) => {
              const x = -gateWidth / 2 + i * barSpacing;
              return (
                <mesh key={`gv${i}`} position={[x, fenceHeight / 2, 0]}>
                  <boxGeometry args={[barThickness * 0.8, fenceHeight - 0.04, barThickness * 0.8]} />
                  <meshStandardMaterial color="#a1a1aa" metalness={0.7} roughness={0.25} />
                </mesh>
              );
            })}
            {/* Gate horizontal rails */}
            {railHeights.map((frac) => (
              <mesh key={`gh${frac}`} position={[0, frac * fenceHeight, 0]}>
                <boxGeometry args={[gateWidth, barThickness * 1.5, barThickness * 1.8]} />
                <meshStandardMaterial color="#78716c" metalness={0.7} roughness={0.25} />
              </mesh>
            ))}
            {/* Gate handle */}
            <mesh position={[gateWidth / 2 - 0.08, fenceHeight * 0.5, barThickness]}>
              <boxGeometry args={[0.02, 0.12, 0.04]} />
              <meshStandardMaterial color="#fbbf24" metalness={0.4} roughness={0.4} />
            </mesh>
          </group>
        );
      })()}

      {/* === GATE TRACK (ground rail) === */}
      <mesh position={[0, 0.008, 0]}>
        <boxGeometry args={[gateWidth + 1.0, 0.015, 0.06]} />
        <meshStandardMaterial color="#a8a29e" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Track end stops */}
      {[-1, 1].map((side) => (
        <mesh key={`stop${side}`} position={[side * (gateWidth / 2 + 0.48), 0.04, 0]}>
          <boxGeometry args={[0.04, 0.08, 0.06]} />
          <meshStandardMaterial color="#dc2626" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}

      {/* === FENCE POSTS (thicker uprights at panel edges) === */}
      {[-fenceSpan / 2, -gateWidth / 2, gateWidth / 2, fenceSpan / 2].map((x, i) => (
        <mesh key={`post${i}`} position={[x, fenceHeight / 2, 0]}>
          <boxGeometry args={[0.05, fenceHeight + 0.06, 0.05]} />
          <meshStandardMaterial color="#3f3f46" metalness={0.5} roughness={0.3} />
        </mesh>
      ))}

      {/* === LABELS === */}
      <Billboard position={[0, fenceHeight + 0.25, 0]}>
        <Text fontSize={0.14} color="#71717a" anchorX="center" fontWeight="bold">
          SECURITY FENCE — STEEL GRID {fenceSpanM}m
        </Text>
      </Billboard>
      <Billboard position={[0, fenceHeight + 0.1, 0]}>
        <Text fontSize={0.1} color="#fbbf24" anchorX="center">
          ◀ SLIDING GATE ({gateWidthM}m) ▶
        </Text>
      </Billboard>

      {/* Dimension annotation */}
      <Billboard position={[-fenceSpan / 2 - 0.15, fenceHeight / 2, 0]}>
        <Text fontSize={0.07} color="#a1a1aa" anchorX="center" rotation={[0, 0, Math.PI / 2]}>
          {fenceHeightM}m
        </Text>
      </Billboard>
    </group>
  );
};

/* ============ Main Component ============ */

export const StoreLayout3D = ({ liveMode, sparesData = [] }: StoreLayout3DProps) => {
  const [selectedContainer, setSelectedContainer] = useState<StoreContainer | null>(null);
  const [selectedItem, setSelectedItem] = useState<FitoutItem | null>(null);
  const [doorStates, setDoorStates] = useState<Record<string, boolean>>({});

  const toggleDoor = (containerId: string) => {
    setDoorStates(prev => ({ ...prev, [containerId]: !prev[containerId] }));
  };

  const getPartsCount = (container: StoreContainer) => {
    if (!liveMode) return 0;
    return sparesData.filter((s) => {
      const bin = (s.bin_location || "").toUpperCase();
      return bin.startsWith(container.id);
    }).length;
  };

  const getPartsForContainer = (container: StoreContainer) => {
    return sparesData.filter((s) => {
      const bin = (s.bin_location || "").toUpperCase();
      return bin.startsWith(container.id);
    });
  };

  const cameraPosition: [number, number, number] = selectedItem
    ? [1.2, 0.8, 1.5]
    : selectedContainer
      ? [2.5, 1.5, 3]
      : [10, 7, 10];

  return (
    <div className="space-y-2">
      {/* Breadcrumb Navigation */}
      {(selectedContainer || selectedItem) && (
        <div className="flex items-center gap-2 px-2 flex-wrap">
          <button
            onClick={() => { setSelectedContainer(null); setSelectedItem(null); }}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            ← Yard View
          </button>
          {selectedContainer && (
            <>
              <span className="text-xs text-muted-foreground">›</span>
              <button
                onClick={() => setSelectedItem(null)}
                className={`text-xs flex items-center gap-1 ${selectedItem ? "text-primary hover:underline" : "text-foreground font-medium"}`}
              >
                {selectedContainer.id} — {selectedContainer.shortLabel}
              </button>
            </>
          )}
          {selectedItem && (
            <>
              <span className="text-xs text-muted-foreground">›</span>
              <span className="text-xs text-foreground font-medium">
                {selectedItem.label}
              </span>
            </>
          )}
          <span className="text-[10px] text-muted-foreground ml-2">
            {selectedItem
              ? `${selectedItem.width}mm × ${selectedItem.height}mm × ${(FURNITURE_3D_HEIGHT[selectedItem.type] * 1000).toFixed(0)}mm`
              : selectedContainer
                ? `${selectedContainer.physicalDimensions.internalLengthM}m × ${selectedContainer.physicalDimensions.internalWidthM}m × ${selectedContainer.physicalDimensions.internalHeightM}m`
                : ""}
          </span>
        </div>
      )}

      <div className="border border-border rounded-lg bg-card overflow-hidden" style={{ height: "550px" }}>
        <Canvas
          camera={{
            position: cameraPosition,
            fov: 50,
          }}
          shadows
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            {selectedItem && selectedContainer ? (
              <ItemDetail3D
                item={selectedItem}
                containerColor={selectedContainer.color}
                containerId={selectedContainer.id}
              />
            ) : selectedContainer ? (
              <ContainerInterior3D
                container={selectedContainer}
                parts={liveMode ? getPartsForContainer(selectedContainer) : []}
                liveMode={liveMode}
                onItemClick={(item) => setSelectedItem(item)}
              />
            ) : (
              <>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.3} />

                <Ground />
                <DomeRoof />
                <SecurityFence />

                {STORE_CONTAINERS.map((container) => (
                  <ContainerMesh
                    key={container.id}
                    container={container}
                    partsCount={getPartsCount(container)}
                    liveMode={liveMode}
                    isSelected={false}
                    onClick={() => setSelectedContainer(container)}
                    doorOpen={!!doorStates[container.id]}
                    onDoorToggle={() => toggleDoor(container.id)}
                  />
                ))}

                <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={22} target={[0, 0.5, 1.5]} />
              </>
            )}
          </Suspense>
        </Canvas>

        <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
          {selectedItem
            ? "🖱 Drag to rotate • Scroll to zoom • Inspect dimensions"
            : selectedContainer
              ? "🖱 Drag to rotate • Scroll to zoom • Click item to inspect"
              : "🖱 Drag to rotate • Scroll to zoom • Click roller door to open/close • Click container to enter"}
        </div>
      </div>
    </div>
  );
};
