import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, RoundedBox, Html } from "@react-three/drei";
import { STORE_CONTAINERS, type StoreContainer } from "./storeLayoutData";
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

  const isSmall = container.containerType.includes("10ft");
  const width = isSmall ? 1.5 : 3;
  const depth = 1.2;
  const height = 1.5;
  const pos = container.position3D;

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <RoundedBox
        args={[width, height, depth]}
        radius={0.05}
        position={[0, height / 2, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
      >
        <meshStandardMaterial
          color={container.color}
          transparent
          opacity={hovered || isSelected ? 0.9 : 0.6}
          metalness={0.1}
          roughness={0.8}
        />
      </RoundedBox>

      {/* Shelves inside */}
      {container.shelves.map((_, idx) => {
        const shelfY = (idx + 1) * (height / (container.shelves.length + 1));
        return (
          <mesh key={idx} position={[0, shelfY, 0]}>
            <boxGeometry args={[width - 0.1, 0.03, depth - 0.1]} />
            <meshStandardMaterial color="#888" opacity={0.5} transparent />
          </mesh>
        );
      })}

      {/* Container ID label */}
      <Text position={[0, height + 0.3, 0]} fontSize={0.25} color={container.color} fontWeight="bold" anchorX="center" anchorY="middle">
        {container.id}
      </Text>
      <Text position={[0, height + 0.05, 0]} fontSize={0.15} color="#888" anchorX="center" anchorY="middle">
        {container.shortLabel}
      </Text>

      {liveMode && (
        <Text position={[0, height + 0.55, 0]} fontSize={0.12} color={partsCount > 0 ? "#22c55e" : "#94a3b8"} anchorX="center" anchorY="middle">
          {partsCount} parts
        </Text>
      )}

      {(hovered || isSelected) && (
        <Html position={[0, height + 0.8, 0]} center>
          <div className="bg-popover border border-border rounded-lg p-3 shadow-lg text-xs whitespace-nowrap pointer-events-none min-w-[180px]">
            <p className="font-bold text-sm">{container.label}</p>
            <p className="text-muted-foreground">{container.zone} • {container.containerType}</p>
            <p className="text-muted-foreground">{container.shelves.length} shelves × {container.binsPerShelf} bins</p>
            <p className="text-muted-foreground">Access: {container.accessFrequency}</p>
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

  const shelfCount = container.shelves.length;
  const binCount = container.binsPerShelf;
  const shelfSpacing = 0.45;
  const binWidth = 0.35;
  const totalWidth = binCount * binWidth;
  const totalHeight = shelfCount * shelfSpacing;

  const getPartAtBin = (binId: string) => {
    if (!liveMode || !parts.length) return null;
    const locationCode = `${container.id}-${container.zoneCode}-${binId}`;
    return parts.find((p) => {
      const loc = (p.bin_location || "").toUpperCase();
      return loc === locationCode || loc.endsWith(binId);
    });
  };

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
      <pointLight position={[0, totalHeight + 1, 2]} intensity={0.4} color="#fff" />

      {/* Container frame (wireframe) */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(totalWidth + 0.6, totalHeight + 0.4, 1.2)]} />
        <lineBasicMaterial color={container.color} opacity={0.4} transparent />
      </lineSegments>

      {/* Back wall */}
      <mesh position={[0, 0, -0.6]}>
        <planeGeometry args={[totalWidth + 0.6, totalHeight + 0.4]} />
        <meshStandardMaterial color={container.color} opacity={0.08} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Side walls */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (totalWidth / 2 + 0.3), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, totalHeight + 0.4]} />
          <meshStandardMaterial color={container.color} opacity={0.06} transparent side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Shelves and bins */}
      {container.shelves.map((shelf, shelfIdx) => {
        const y = (shelfIdx - shelfCount / 2 + 0.5) * shelfSpacing;

        return (
          <group key={shelf} position={[0, y, 0]}>
            {/* Shelf plank */}
            <mesh position={[0, -shelfSpacing / 2 + 0.02, 0]}>
              <boxGeometry args={[totalWidth + 0.2, 0.03, 1]} />
              <meshStandardMaterial color="#8B7355" opacity={0.6} transparent />
            </mesh>

            {/* Shelf label */}
            <Text
              position={[-totalWidth / 2 - 0.25, 0, 0.5]}
              fontSize={0.12}
              color={container.color}
              fontWeight="bold"
              anchorX="center"
            >
              {shelf}
            </Text>

            {/* Bins */}
            {Array.from({ length: binCount }, (_, binIdx) => {
              const binId = `${shelf}${binIdx + 1}`;
              const x = (binIdx - binCount / 2 + 0.5) * binWidth;
              const part = getPartAtBin(binId);
              const isHovered = hoveredBin === binId;

              return (
                <group key={binId} position={[x, 0, 0]}>
                  {/* Bin box */}
                  <RoundedBox
                    args={[binWidth - 0.04, shelfSpacing - 0.08, 0.8]}
                    radius={0.01}
                    position={[0, 0, 0]}
                    onPointerOver={(e) => { e.stopPropagation(); setHoveredBin(binId); }}
                    onPointerOut={() => setHoveredBin(null)}
                  >
                    <meshStandardMaterial
                      color={part ? container.color : "#94a3b8"}
                      transparent
                      opacity={isHovered ? 0.6 : part ? 0.35 : 0.1}
                      metalness={0.05}
                      roughness={0.9}
                    />
                  </RoundedBox>

                  {/* Part object inside bin */}
                  {part && (
                    <mesh position={[0, 0, 0]}>
                      <boxGeometry args={[binWidth * 0.5, shelfSpacing * 0.4, 0.3]} />
                      <meshStandardMaterial color={container.color} opacity={0.8} transparent />
                    </mesh>
                  )}

                  {/* Bin label */}
                  <Text
                    position={[0, -shelfSpacing / 2 + 0.08, 0.41]}
                    fontSize={0.06}
                    color="#666"
                    anchorX="center"
                  >
                    {binId}
                  </Text>

                  {/* Tooltip */}
                  {isHovered && (
                    <Html position={[0, shelfSpacing / 2 + 0.1, 0.5]} center>
                      <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs whitespace-nowrap pointer-events-none">
                        <p className="font-mono font-bold">{container.id}-{container.zoneCode}-{binId}</p>
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
      <Text
        position={[0, totalHeight / 2 + 0.35, 0]}
        fontSize={0.18}
        color={container.color}
        fontWeight="bold"
        anchorX="center"
      >
        {container.id} — {container.label}
      </Text>
      <Text
        position={[0, totalHeight / 2 + 0.15, 0]}
        fontSize={0.1}
        color="#888"
        anchorX="center"
      >
        {container.shelves.length} shelves × {container.binsPerShelf} bins · {container.environment}
      </Text>

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        maxPolarAngle={Math.PI / 1.8}
        minDistance={2}
        maxDistance={8}
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
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]}>
      <planeGeometry args={[14, 0.8]} />
      <meshStandardMaterial color="#94a3b8" opacity={0.3} transparent />
    </mesh>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1.5]} fontSize={0.15} color="#64748b" anchorX="center">
      ACCESS ROAD
    </Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3.5]} fontSize={0.18} color="#6366f1" anchorX="center">
      CLEAN ZONE
    </Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[-1, 0.01, -0.5]} fontSize={0.18} color="#3b82f6" anchorX="center">
      MECHANICAL ZONE
    </Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.01, -0.5]} fontSize={0.15} color="#f59e0b" anchorX="center">
      HAZMAT
    </Text>
    <Text rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4]} fontSize={0.18} color="#64748b" anchorX="center">
      HIGH-ACCESS ZONE
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
      {/* Back button when inside a container */}
      {selectedContainer && (
        <div className="flex items-center gap-3 px-2">
          <button
            onClick={() => setSelectedContainer(null)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            ← Back to Yard View
          </button>
          <span className="text-xs text-muted-foreground">
            Viewing interior of <strong>{selectedContainer.id} — {selectedContainer.label}</strong>
          </span>
        </div>
      )}

      <div className="border border-border rounded-lg bg-card overflow-hidden" style={{ height: "550px" }}>
        <Canvas
          camera={{
            position: selectedContainer ? [3, 2, 4] : [8, 6, 8],
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

                <OrbitControls
                  enablePan
                  enableZoom
                  enableRotate
                  maxPolarAngle={Math.PI / 2.2}
                  minDistance={4}
                  maxDistance={18}
                  target={[0, 0.5, 0]}
                />
              </>
            )}
          </Suspense>
        </Canvas>

        <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
          {selectedContainer
            ? "🖱 Drag to rotate • Scroll to zoom • Hover bins for details"
            : "🖱 Drag to rotate • Scroll to zoom • Click container to view interior"}
        </div>
      </div>
    </div>
  );
};
