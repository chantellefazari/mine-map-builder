import { Suspense, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Html, Billboard } from "@react-three/drei";
import { STORE_CONTAINERS, YARD_DIMENSIONS, DOME_DIMENSIONS, LAYDOWN_ZONES, FORKLIFT_LANE, DELIVERY_ZONE, dome3DPosition, base3DPosition, leftLeg3DPosition, rightLeg3DPosition, ldZone3DPosition, forkliftLane3DPosition, deliveryZone3DPosition, type StoreContainer } from "./storeLayoutData";
import { CONTAINER_FITOUTS, FURNITURE_COLORS, type FurnitureType, type FitoutItem, type ContainerFitout } from "./containerFitoutData";
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

interface ContainerMeshProps {
  container: StoreContainer;
  partsCount: number;
  liveMode: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const ContainerMesh = ({ container, partsCount, liveMode, isSelected, onClick }: ContainerMeshProps) => {
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

      {/* Entry door facing into the dome courtyard */}
      {(() => {
        const doorH = height * 0.7;
        const doorW = Math.min(isVertical ? depth * 0.35 : width * 0.35, 0.55);
        const doorY = doorH / 2;
        // Left leg top (C01) → door on +X (right, facing courtyard)
        // Right leg top (C05) → door on -X (left, facing courtyard)
        // Left leg bottom (C02) & Right leg bottom (C04) → doors facing courtyard
        // C03 base → door on -Z (facing dome)

        if (container.id === "C01") {
          return (
            <mesh position={[width / 2 + 0.02, doorY, 0]}>
              <planeGeometry args={[doorW, doorH]} />
              <meshStandardMaterial color="#22c55e" opacity={0.15} transparent side={THREE.DoubleSide} />
            </mesh>
          );
        } else if (container.id === "C05") {
          return (
            <mesh position={[-width / 2 - 0.02, doorY, 0]}>
              <planeGeometry args={[doorW, doorH]} />
              <meshStandardMaterial color="#22c55e" opacity={0.15} transparent side={THREE.DoubleSide} />
            </mesh>
          );
        } else if (container.id === "C02") {
          // Left leg bottom — door on +X facing courtyard
          return (
            <mesh position={[width / 2 + 0.02, doorY, 0]}>
              <planeGeometry args={[doorW, doorH]} />
              <meshStandardMaterial color="#22c55e" opacity={0.15} transparent side={THREE.DoubleSide} />
            </mesh>
          );
        } else if (container.id === "C04") {
          // Right leg bottom — door on -X facing courtyard
          return (
            <mesh position={[-width / 2 - 0.02, doorY, 0]}>
              <planeGeometry args={[doorW, doorH]} />
              <meshStandardMaterial color="#22c55e" opacity={0.15} transparent side={THREE.DoubleSide} />
            </mesh>
          );
        } else {
          // C03 base — door on -Z side (facing dome)
          return (
            <mesh position={[0, doorY, -depth / 2 - 0.02]}>
              <planeGeometry args={[doorW, doorH]} />
              <meshStandardMaterial color="#22c55e" opacity={0.15} transparent side={THREE.DoubleSide} />
            </mesh>
          );
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
            <p className="text-primary/70 text-[10px] mt-1">Click to view interior →</p>
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

const FitoutItemMesh = ({ item, fitout, containerColor }: { item: FitoutItem; fitout: ContainerFitout; containerColor: string }) => {
  const [hovered, setHovered] = useState(false);
  const intL = fitout.internalLengthMm / 1000; // X axis in 3D
  const intW = fitout.internalWidthMm / 1000; // Z axis in 3D
  const intH = 2.39; // internal height m

  // Convert mm positions to meters, center origin
  const itemXm = item.x / 1000;
  const itemYm = item.y / 1000;
  const itemWm = item.width / 1000;
  const itemDm = item.height / 1000; // "height" in plan = depth (Z) in 3D
  const itemHm = FURNITURE_3D_HEIGHT[item.type];

  // 3D position: center of item, sitting on floor
  const x3d = -intL / 2 + itemXm + itemWm / 2;
  const z3d = -intW / 2 + itemYm + itemDm / 2;
  const y3d = -intH / 2 + itemHm / 2;

  const colors = FURNITURE_COLORS[item.type];
  const fillColor = colors.stroke; // use the solid stroke color for 3D

  return (
    <group position={[x3d, y3d, z3d]}>
      {/* Main body */}
      <RoundedBox
        args={[itemWm, itemHm, itemDm]}
        radius={0.01}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={fillColor}
          transparent
          opacity={hovered ? 0.7 : 0.45}
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Wireframe edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(itemWm, itemHm, itemDm)]} />
        <lineBasicMaterial color={fillColor} opacity={0.6} transparent />
      </lineSegments>

      {/* Shelf detail lines for shelving types */}
      {(item.type === "shelving-bay" || item.type === "reinforced-shelf") && (
        <>
          {[0.2, 0.4, 0.6, 0.8].map((frac) => (
            <mesh key={frac} position={[0, -itemHm / 2 + frac * itemHm, 0]}>
              <boxGeometry args={[itemWm - 0.01, 0.008, itemDm - 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.3} transparent />
            </mesh>
          ))}
          {/* Uprights */}
          {[-1, 1].map((side) => (
            <mesh key={side} position={[side * (itemWm / 2 - 0.015), 0, 0]}>
              <boxGeometry args={[0.03, itemHm, 0.03]} />
              <meshStandardMaterial color="#666" opacity={0.5} transparent />
            </mesh>
          ))}
        </>
      )}

      {/* Drawer lines for drawer units */}
      {item.type === "drawer-unit" && (
        <>
          {[0.15, 0.35, 0.55, 0.75, 0.95].map((frac) => (
            <mesh key={frac} position={[0, -itemHm / 2 + frac * itemHm, itemDm / 2 - 0.005]}>
              <boxGeometry args={[itemWm - 0.02, 0.005, 0.01]} />
              <meshStandardMaterial color="#444" opacity={0.6} transparent />
            </mesh>
          ))}
          {/* Drawer handles */}
          {[0.25, 0.45, 0.65, 0.85].map((frac) => (
            <mesh key={`h${frac}`} position={[0, -itemHm / 2 + frac * itemHm, itemDm / 2 + 0.01]}>
              <boxGeometry args={[0.06, 0.008, 0.015]} />
              <meshStandardMaterial color="#888" opacity={0.7} transparent />
            </mesh>
          ))}
        </>
      )}

      {/* Cabinet door line */}
      {item.type === "cabinet" && (
        <mesh position={[0, 0, itemDm / 2 + 0.005]}>
          <planeGeometry args={[itemWm * 0.9, itemHm * 0.9]} />
          <meshStandardMaterial color={fillColor} opacity={0.15} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Bin wall grid for bin walls & ESD panels */}
      {(item.type === "bin-wall" || item.type === "esd-panel") && (
        <>
          {/* Horizontal dividers */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <mesh key={`h${frac}`} position={[0, -itemHm / 2 + frac * itemHm, itemDm / 2 - 0.005]}>
              <boxGeometry args={[itemWm - 0.02, 0.005, 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.4} transparent />
            </mesh>
          ))}
          {/* Vertical dividers */}
          {[0.2, 0.4, 0.6, 0.8].map((frac) => (
            <mesh key={`v${frac}`} position={[-itemWm / 2 + frac * itemWm, 0, itemDm / 2 - 0.005]}>
              <boxGeometry args={[0.005, itemHm - 0.02, 0.01]} />
              <meshStandardMaterial color={fillColor} opacity={0.4} transparent />
            </mesh>
          ))}
        </>
      )}

      {/* Short label on front face */}
      <Text
        position={[0, 0, itemDm / 2 + 0.02]}
        fontSize={Math.min(0.08, itemWm * 0.12)}
        color={fillColor}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        maxWidth={itemWm * 0.9}
      >
        {item.shortLabel}
      </Text>

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, itemHm / 2 + 0.15, 0]} center>
          <div className="bg-popover border border-border rounded-lg p-2.5 shadow-lg text-xs whitespace-nowrap pointer-events-none min-w-[180px]">
            <p className="font-bold text-sm">{item.label}</p>
            <p className="text-muted-foreground capitalize">{item.type.replace(/-/g, " ")}</p>
            <p className="text-muted-foreground font-mono text-[10px]">
              {item.width}mm × {item.height}mm × {(FURNITURE_3D_HEIGHT[item.type] * 1000).toFixed(0)}mm (W×D×H)
            </p>
          </div>
        </Html>
      )}
    </group>
  );
};

const ContainerInterior3D = ({ container, parts, liveMode }: ContainerInterior3DProps) => {
  const dim = container.physicalDimensions;
  const fitout = CONTAINER_FITOUTS[container.id];

  const intWidth = dim.internalLengthM; // X
  const intHeight = dim.internalHeightM; // Y
  const intDepth = dim.internalWidthM; // Z

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <pointLight position={[0, intHeight, 2]} intensity={0.4} color="#fff" />

      {/* Container wireframe */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(intWidth + 0.1, intHeight, intDepth + 0.1)]} />
        <lineBasicMaterial color={container.color} opacity={0.3} transparent />
      </lineSegments>

      {/* Back wall (top wall in plan — y=0) */}
      <mesh position={[0, 0, -intDepth / 2]}>
        <planeGeometry args={[intWidth + 0.1, intHeight]} />
        <meshStandardMaterial color={container.color} opacity={0.06} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Front wall (bottom wall in plan — y=max, door side) */}
      <mesh position={[0, 0, intDepth / 2]}>
        <planeGeometry args={[intWidth + 0.1, intHeight]} />
        <meshStandardMaterial color={container.color} opacity={0.04} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Side walls */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (intWidth / 2 + 0.05), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[intDepth + 0.1, intHeight]} />
          <meshStandardMaterial color={container.color} opacity={0.05} transparent side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Floor */}
      <mesh position={[0, -intHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[intWidth, intDepth]} />
        <meshStandardMaterial color="#94a3b8" opacity={0.15} transparent />
      </mesh>

      {/* Aisle marking */}
      <mesh position={[0, -intHeight / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[intWidth - 0.1, dim.aisleWidthCm / 100]} />
        <meshStandardMaterial color="#22c55e" opacity={0.08} transparent />
      </mesh>

      {/* Door indicator */}
      {fitout && (() => {
        const door = fitout.door;
        const doorWm = door.widthMm / 1000;
        const doorOffsetM = door.offsetMm / 1000;
        const doorH = intHeight * 0.8;

        if (door.wall === "bottom") {
          // Door on front wall (Z = +intDepth/2), positioned along X
          const doorCenterX = -intWidth / 2 + doorOffsetM + doorWm / 2;
          return (
            <group>
              <mesh position={[doorCenterX, -intHeight / 2 + doorH / 2, intDepth / 2 + 0.02]}>
                <planeGeometry args={[doorWm, doorH]} />
                <meshStandardMaterial color="#22c55e" opacity={0.15} transparent side={THREE.DoubleSide} />
              </mesh>
              <lineSegments position={[doorCenterX, -intHeight / 2 + doorH / 2, intDepth / 2 + 0.02]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(doorWm, doorH)]} />
                <lineBasicMaterial color="#22c55e" opacity={0.5} transparent />
              </lineSegments>
              <Text position={[doorCenterX, -intHeight / 2 + doorH + 0.06, intDepth / 2 + 0.03]} fontSize={0.05} color="#22c55e" anchorX="center">
                {door.label}
              </Text>
            </group>
          );
        }
        return null;
      })()}

      {/* Wall labels */}
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

      {/* Render all fitout items */}
      {fitout && fitout.items.map((item) => (
        <FitoutItemMesh
          key={item.id}
          item={item}
          fitout={fitout}
          containerColor={container.color}
        />
      ))}

      {/* Title */}
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

/* ============ Main Component ============ */

export const StoreLayout3D = ({ liveMode, sparesData = [] }: StoreLayout3DProps) => {
  const [selectedContainer, setSelectedContainer] = useState<StoreContainer | null>(null);

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

  return (
    <div className="space-y-2">
      {selectedContainer && (
        <div className="flex items-center gap-3 px-2">
          <button onClick={() => setSelectedContainer(null)} className="text-xs text-primary hover:underline flex items-center gap-1">
            ← Back to Yard View
          </button>
          <span className="text-xs text-muted-foreground">
            Viewing interior of <strong>{selectedContainer.id} — {selectedContainer.label}</strong>
            <span className="ml-2 text-[10px]">
              ({selectedContainer.physicalDimensions.internalLengthM}m × {selectedContainer.physicalDimensions.internalWidthM}m × {selectedContainer.physicalDimensions.internalHeightM}m)
            </span>
          </span>
        </div>
      )}

      <div className="border border-border rounded-lg bg-card overflow-hidden" style={{ height: "550px" }}>
        <Canvas
          camera={{
            position: selectedContainer ? [2.5, 1.5, 3] : [10, 7, 10],
            fov: 50,
          }}
          shadows
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            {selectedContainer ? (
              <ContainerInterior3D
                container={selectedContainer}
                parts={liveMode ? getPartsForContainer(selectedContainer) : []}
                liveMode={liveMode}
              />
            ) : (
              <>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.3} />

                <Ground />
                <DomeRoof />

                {STORE_CONTAINERS.map((container) => (
                  <ContainerMesh
                    key={container.id}
                    container={container}
                    partsCount={getPartsCount(container)}
                    liveMode={liveMode}
                    isSelected={false}
                    onClick={() => setSelectedContainer(container)}
                  />
                ))}

                <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={22} target={[0, 0.5, 1.5]} />
              </>
            )}
          </Suspense>
        </Canvas>

        <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
          {selectedContainer
            ? "🖱 Drag to rotate • Scroll to zoom • Hover bins for dimensions"
            : "🖱 Drag to rotate • Scroll to zoom • Click container to view interior"}
        </div>
      </div>
    </div>
  );
};
