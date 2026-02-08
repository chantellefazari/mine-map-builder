import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Html } from "@react-three/drei";
import { STORE_CONTAINERS, YARD_DIMENSIONS, type StoreContainer } from "./storeLayoutData";
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
  const width = dim.externalLengthM * s;
  const depth = dim.externalWidthM * s;
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

      {/* Entry door indicator */}
      {entry && (
        <group>
          {entry.side === "front" && (
            <mesh position={[0, height * 0.35, depth / 2 + 0.02]}>
              <planeGeometry args={[Math.min(width * 0.8, (entry.widthCm / 100) * s), height * 0.65]} />
              <meshStandardMaterial color="#22c55e" opacity={0.2} transparent side={THREE.DoubleSide} />
            </mesh>
          )}
          {entry.side === "right" && (
            <mesh position={[width / 2 + 0.02, height * 0.35, 0]}>
              <planeGeometry args={[(entry.widthCm / 100) * s, height * 0.65]} />
              <meshStandardMaterial color="#22c55e" opacity={0.2} transparent side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      )}

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

  const shelfCount = container.shelves.length;
  const binCount = container.binsPerShelf;

  // Scale interior: use physical dimensions, 1m = 1 unit
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

      {/* Aisle marking on floor */}
      <mesh position={[0, -intHeight / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[intWidth - 0.1, aisleWidthM]} />
        <meshStandardMaterial color="#22c55e" opacity={0.08} transparent />
      </mesh>

      {/* Entry door indicator */}
      {container.entryPoints[0] && (
        <group>
          {container.entryPoints[0].side === "front" && (
            <mesh position={[0, -intHeight / 4, intDepth / 2 + 0.02]}>
              <planeGeometry args={[(container.entryPoints[0].widthCm / 100), intHeight * 0.7]} />
              <meshStandardMaterial color="#22c55e" opacity={0.12} transparent side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      )}

      {/* Shelves and bins */}
      {container.shelves.map((shelf, shelfIdx) => {
        const shelfY = -intHeight / 2 + bottomShelfM + shelfIdx * shelfHeightM;

        return (
          <group key={shelf} position={[0, shelfY, rackingZ]}>
            {/* Shelf plank */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[intWidth - 0.1, 0.02, binDepthM + 0.05]} />
              <meshStandardMaterial color="#8B7355" opacity={0.55} transparent />
            </mesh>

            {/* Upright supports */}
            <mesh position={[-intWidth / 2 + 0.03, shelfHeightM / 2, 0]}>
              <boxGeometry args={[0.04, shelfHeightM, 0.04]} />
              <meshStandardMaterial color="#666" opacity={0.4} transparent />
            </mesh>
            <mesh position={[intWidth / 2 - 0.03, shelfHeightM / 2, 0]}>
              <boxGeometry args={[0.04, shelfHeightM, 0.04]} />
              <meshStandardMaterial color="#666" opacity={0.4} transparent />
            </mesh>

            {/* Shelf label */}
            <Text position={[-intWidth / 2 - 0.15, shelfHeightM / 2, 0]} fontSize={0.1} color={container.color} fontWeight="bold" anchorX="center">
              {shelf}
            </Text>

            {/* Height from floor label */}
            <Text position={[intWidth / 2 + 0.15, 0.02, 0]} fontSize={0.06} color="#888" anchorX="center">
              {container.bottomShelfHeightCm + shelfIdx * container.shelfHeightCm}cm
            </Text>

            {/* Bins */}
            {Array.from({ length: binCount }, (_, binIdx) => {
              const binId = `${shelf}${binIdx + 1}`;
              const x = (binIdx - binCount / 2 + 0.5) * binWidthM;
              const part = getPartAtBin(binId);
              const isHovered = hoveredBin === binId;

              return (
                <group key={binId} position={[x, shelfHeightM / 2, 0]}>
                  {/* Bin box */}
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

                  {/* Part object inside */}
                  {part && (
                    <mesh>
                      <boxGeometry args={[binWidthM * 0.6, shelfHeightM * 0.4, binDepthM * 0.5]} />
                      <meshStandardMaterial color={container.color} opacity={0.7} transparent />
                    </mesh>
                  )}

                  {/* Bin label */}
                  <Text position={[0, -shelfHeightM / 2 + 0.03, binDepthM / 2 + 0.01]} fontSize={0.04} color="#666" anchorX="center">
                    {binId}
                  </Text>

                  {/* Tooltip */}
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

      {/* Container title */}
      <Text position={[0, intHeight / 2 + 0.15, 0]} fontSize={0.14} color={container.color} fontWeight="bold" anchorX="center">
        {container.id} — {container.label}
      </Text>
      <Text position={[0, intHeight / 2 + 0.02, 0]} fontSize={0.07} color="#888" anchorX="center">
        {dim.internalLengthM}m × {dim.internalWidthM}m × {dim.internalHeightM}m · {container.shelves.length} shelves × {container.binsPerShelf} bins
      </Text>

      {/* Dimension labels in 3D space */}
      <Text position={[0, -intHeight / 2 - 0.1, intDepth / 2 + 0.15]} fontSize={0.06} color="#22c55e" anchorX="center">
        Aisle: {dim.aisleWidthCm}cm
      </Text>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 1.8}
        minDistance={1}
        maxDistance={6}
        target={[0, 0, 0]}
      />
    </>
  );
};

/* ============ Ground ============ */

const Ground = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 15]} />
      <meshStandardMaterial color="#e2e8f0" opacity={0.5} transparent />
    </mesh>
    {/* Access road */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]}>
      <planeGeometry args={[16, YARD_DIMENSIONS.accessRoadWidthM * 0.5]} />
      <meshStandardMaterial color="#94a3b8" opacity={0.3} transparent />
    </mesh>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.5]} fontSize={0.15} color="#64748b" anchorX="center">
      ACCESS ROAD ({YARD_DIMENSIONS.accessRoadWidthM}m wide)
    </Text>
    {/* Walkway */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.2]}>
      <planeGeometry args={[14, YARD_DIMENSIONS.walkwayWidthM * 0.5]} />
      <meshStandardMaterial color="#94a3b8" opacity={0.15} transparent />
    </mesh>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.2]} fontSize={0.1} color="#94a3b8" anchorX="center">
      WALKWAY ({YARD_DIMENSIONS.walkwayWidthM}m)
    </Text>

    {/* Zone labels */}
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3.5]} fontSize={0.18} color="#6366f1" anchorX="center">CLEAN ZONE</Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, -0.5]} fontSize={0.18} color="#3b82f6" anchorX="center">MECHANICAL ZONE</Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.01, -0.5]} fontSize={0.15} color="#f59e0b" anchorX="center">HAZMAT</Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4]} fontSize={0.18} color="#64748b" anchorX="center">HIGH-ACCESS ZONE</Text>

    {/* Entry arrow on ground */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.02, 5]}>
      <planeGeometry args={[1.5, 0.3]} />
      <meshStandardMaterial color="#22c55e" opacity={0.3} transparent />
    </mesh>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[7, 0.03, 5]} fontSize={0.12} color="#22c55e" anchorX="center" fontWeight="bold">
      ENTRY →
    </Text>
  </>
);

/* ============ Main Component ============ */

export const StoreLayout3D = ({ liveMode, sparesData = [] }: StoreLayout3DProps) => {
  const [selectedContainer, setSelectedContainer] = useState<StoreContainer | null>(null);

  const getPartsCount = (container: StoreContainer) => {
    if (!liveMode) return 0;
    return sparesData.filter((s) => {
      const area = (s.warehouse_area || "").toUpperCase();
      return area.includes(container.zoneCode) || area.includes(container.zone);
    }).length;
  };

  const getPartsForContainer = (container: StoreContainer) => {
    return sparesData.filter((s) => {
      const area = (s.warehouse_area || "").toUpperCase();
      return area.includes(container.zoneCode) || area.includes(container.zone);
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
            position: selectedContainer ? [2.5, 1.5, 3] : [8, 6, 8],
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

                <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={18} target={[0, 0.5, 0]} />
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
