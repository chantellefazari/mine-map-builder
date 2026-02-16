import { Suspense, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Html } from "@react-three/drei";
import { STORE_CONTAINERS, YARD_DIMENSIONS, DOME_DIMENSIONS, LAYDOWN_ZONES, FORKLIFT_LANE, DELIVERY_ZONE, dome3DPosition, base3DPosition, leftLeg3DPosition, rightLeg3DPosition, ldZone3DPosition, forkliftLane3DPosition, deliveryZone3DPosition, type StoreContainer } from "./storeLayoutData";
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

      {/* Labels */}
      <Text position={[0, height + 0.3, 0]} fontSize={0.22} color={container.color} fontWeight="bold" anchorX="center" anchorY="middle">
        {container.id}
      </Text>
      <Text position={[0, height + 0.08, 0]} fontSize={0.12} color="#888" anchorX="center" anchorY="middle">
        {container.shortLabel}
      </Text>
      <Text position={[0, height + 0.5, 0]} fontSize={0.08} color="#666" anchorX="center" anchorY="middle">
        {dim.externalLengthM}m × {dim.externalWidthM}m × {dim.externalHeightM}m
      </Text>

      {liveMode && (
        <Text position={[0, height + 0.65, 0]} fontSize={0.1} color={partsCount > 0 ? "#22c55e" : "#94a3b8"} anchorX="center" anchorY="middle">
          {partsCount} parts
        </Text>
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

const ContainerInterior3D = ({ container, parts, liveMode }: ContainerInterior3DProps) => {
  const [hoveredBin, setHoveredBin] = useState<string | null>(null);
  const dim = container.physicalDimensions;

  const binCount = container.binsPerShelf;

  const intWidth = dim.internalLengthM;
  const intHeight = dim.internalHeightM;
  const intDepth = dim.internalWidthM;

  const binWidthM = container.binWidthCm / 100;
  const binDepthM = container.binDepthCm / 100;
  const shelfHeightM = container.shelfHeightCm / 100;
  const bottomShelfM = container.bottomShelfHeightCm / 100;
  const aisleWidthM = dim.aisleWidthCm / 100;

  const getPartAtBin = (binId: string) => {
    if (!liveMode || !parts.length) return null;
    const locationCode = `${container.id}-${container.zoneCode}-${binId}`;
    return parts.find((p) => {
      const loc = (p.bin_location || "").toUpperCase();
      return loc === locationCode || loc.endsWith(binId);
    });
  };

  const rackingZ = -intDepth / 2 + binDepthM / 2 + 0.05;

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

      {/* Back wall */}
      <mesh position={[0, 0, -intDepth / 2]}>
        <planeGeometry args={[intWidth + 0.1, intHeight]} />
        <meshStandardMaterial color={container.color} opacity={0.06} transparent side={THREE.DoubleSide} />
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
      <mesh position={[0, -intHeight / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[intWidth - 0.1, aisleWidthM]} />
        <meshStandardMaterial color="#22c55e" opacity={0.08} transparent />
      </mesh>

      {/* Entry door indicator */}
      {container.entryPoints[0] && container.entryPoints[0].side === "front" && (
        <mesh position={[0, -intHeight / 4, intDepth / 2 + 0.02]}>
          <planeGeometry args={[(container.entryPoints[0].widthCm / 100), intHeight * 0.7]} />
          <meshStandardMaterial color="#22c55e" opacity={0.12} transparent side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Shelves and bins */}
      {container.shelves.map((shelf, shelfIdx) => {
        const shelfY = -intHeight / 2 + bottomShelfM + shelfIdx * shelfHeightM;

        return (
          <group key={shelf} position={[0, shelfY, rackingZ]}>
            <mesh>
              <boxGeometry args={[intWidth - 0.1, 0.02, binDepthM + 0.05]} />
              <meshStandardMaterial color="#8B7355" opacity={0.55} transparent />
            </mesh>

            {/* Uprights */}
            <mesh position={[-intWidth / 2 + 0.03, shelfHeightM / 2, 0]}>
              <boxGeometry args={[0.04, shelfHeightM, 0.04]} />
              <meshStandardMaterial color="#666" opacity={0.4} transparent />
            </mesh>
            <mesh position={[intWidth / 2 - 0.03, shelfHeightM / 2, 0]}>
              <boxGeometry args={[0.04, shelfHeightM, 0.04]} />
              <meshStandardMaterial color="#666" opacity={0.4} transparent />
            </mesh>

            <Text position={[-intWidth / 2 - 0.15, shelfHeightM / 2, 0]} fontSize={0.1} color={container.color} fontWeight="bold" anchorX="center">
              {shelf}
            </Text>
            <Text position={[intWidth / 2 + 0.15, 0.02, 0]} fontSize={0.06} color="#888" anchorX="center">
              {container.bottomShelfHeightCm + shelfIdx * container.shelfHeightCm}cm
            </Text>

            {Array.from({ length: binCount }, (_, binIdx) => {
              const binId = `${shelf}${binIdx + 1}`;
              const x = (binIdx - binCount / 2 + 0.5) * binWidthM;
              const part = getPartAtBin(binId);
              const isHovered = hoveredBin === binId;

              return (
                <group key={binId} position={[x, shelfHeightM / 2, 0]}>
                  <RoundedBox
                    args={[binWidthM - 0.01, shelfHeightM - 0.04, binDepthM - 0.02]}
                    radius={0.005}
                    onPointerOver={(e) => { e.stopPropagation(); setHoveredBin(binId); }}
                    onPointerOut={() => setHoveredBin(null)}
                  >
                    <meshStandardMaterial
                      color={part ? container.color : "#94a3b8"}
                      transparent
                      opacity={isHovered ? 0.55 : part ? 0.3 : 0.08}
                      metalness={0.05}
                      roughness={0.9}
                    />
                  </RoundedBox>

                  {part && (
                    <mesh>
                      <boxGeometry args={[binWidthM * 0.6, shelfHeightM * 0.4, binDepthM * 0.5]} />
                      <meshStandardMaterial color={container.color} opacity={0.7} transparent />
                    </mesh>
                  )}

                  <Text position={[0, -shelfHeightM / 2 + 0.03, binDepthM / 2 + 0.01]} fontSize={0.04} color="#666" anchorX="center">
                    {binId}
                  </Text>

                  {isHovered && (
                    <Html position={[0, shelfHeightM / 2 + 0.08, binDepthM / 2]} center>
                      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs whitespace-nowrap pointer-events-none">
                        <p className="font-mono font-bold">{container.id}-{container.zoneCode}-{binId}</p>
                        <p className="text-[10px] text-muted-foreground">{container.binWidthCm}×{container.binDepthCm}×{container.shelfHeightCm}cm</p>
                        {part ? (
                          <>
                            <p className="text-foreground">{part.description?.slice(0, 40)}</p>
                            {part.part_number && <p className="text-muted-foreground">PN: {part.part_number}</p>}
                          </>
                        ) : (
                          <p className="text-muted-foreground italic">Empty bin</p>
                        )}
                      </div>
                    </Html>
                  )}
                </group>
              );
            })}
          </group>
        );
      })}

      <Text position={[0, intHeight / 2 + 0.15, 0]} fontSize={0.14} color={container.color} fontWeight="bold" anchorX="center">
        {container.id} — {container.label}
      </Text>
      <Text position={[0, intHeight / 2 + 0.02, 0]} fontSize={0.07} color="#888" anchorX="center">
        {dim.internalLengthM}m × {dim.internalWidthM}m × {dim.internalHeightM}m · {container.shelves.length} shelves × {container.binsPerShelf} bins
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
      <Text position={[0, rise + 0.3, 0]} fontSize={0.18} color="#64748b" anchorX="center" fillOpacity={0.5}>
        DOME SHELTER {domeWidthM}m × {domeDepthM}m
      </Text>
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
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[dome.x, 0.02, dome.z]} fontSize={0.2} color="#22c55e" anchorX="center" fillOpacity={0.2}>
        CONCRETE PAD
      </Text>
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[dome.x, 0.02, dome.z + 0.5]} fontSize={0.12} color="#22c55e" anchorX="center" fillOpacity={0.25}>
        {DOME_DIMENSIONS.widthM}m × {DOME_DIMENSIONS.depthM}m
      </Text>

      {/* Zone labels on ground */}
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[left.x, 0.02, left.z]} fontSize={0.15} color="#6366f1" anchorX="center">LEFT LEG — CLEAN</Text>
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[right.x, 0.02, right.z]} fontSize={0.15} color="#64748b" anchorX="center">RIGHT LEG — HIGH-ACCESS</Text>
      <Text rotation={[-Math.PI / 2, 0, 0]} position={[base.x, 0.02, base.z + 1]} fontSize={0.15} color="#3b82f6" anchorX="center">BASE — MECHANICAL (40ft)</Text>

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
            <Text rotation={[-Math.PI / 2, 0, 0]} position={[pos.x, 0.04, pos.z]} fontSize={0.12} color={zone.color} anchorX="center" fontWeight="bold">
              {zone.id}
            </Text>
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
            <Text rotation={[-Math.PI / 2, 0, 0]} position={[fPos.x, 0.04, fPos.z]} fontSize={0.1} color="#ca8a04" anchorX="center" fontWeight="bold">
              FORKLIFT
            </Text>
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
            <Text rotation={[-Math.PI / 2, 0, 0]} position={[dPos.x, 0.04, dPos.z]} fontSize={0.15} color="#dc2626" anchorX="center" fontWeight="bold">
              DELIVERY
            </Text>
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
