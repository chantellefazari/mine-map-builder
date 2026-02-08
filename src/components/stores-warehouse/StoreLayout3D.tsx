import { Suspense, useState, useRef } from "react";
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

interface ContainerMeshProps {
  container: StoreContainer;
  partsCount: number;
  liveMode: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const ContainerMesh = ({ container, partsCount, liveMode, isSelected, onClick }: ContainerMeshProps) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Calculate container dimensions based on type
  const isSmall = container.containerType.includes("10ft");
  const width = isSmall ? 1.5 : 3;
  const depth = 1.2;
  const height = 1.5;

  const pos = container.position3D;

  return (
    <group position={[pos.x, pos.y, pos.z]}>
      {/* Container body */}
      <RoundedBox
        ref={meshRef}
        args={[width, height, depth]}
        radius={0.05}
        position={[0, height / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
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
      <Text
        position={[0, height + 0.3, 0]}
        fontSize={0.25}
        color={container.color}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        {container.id}
      </Text>

      {/* Zone label */}
      <Text
        position={[0, height + 0.05, 0]}
        fontSize={0.15}
        color="#888"
        anchorX="center"
        anchorY="middle"
      >
        {container.shortLabel}
      </Text>

      {/* Parts count (live mode) */}
      {liveMode && (
        <Text
          position={[0, height + 0.55, 0]}
          fontSize={0.12}
          color={partsCount > 0 ? "#22c55e" : "#94a3b8"}
          anchorX="center"
          anchorY="middle"
        >
          {partsCount} parts
        </Text>
      )}

      {/* Tooltip on hover */}
      {(hovered || isSelected) && (
        <Html position={[0, height + 0.8, 0]} center>
          <div className="bg-popover border border-border rounded-lg p-2 shadow-lg text-xs whitespace-nowrap pointer-events-none">
            <p className="font-bold">{container.label}</p>
            <p className="text-muted-foreground">{container.zone} • {container.containerType}</p>
            <p className="text-muted-foreground">{container.shelves.length} shelves × {container.binsPerShelf} bins</p>
            {liveMode && <p className="text-primary font-medium">{partsCount} parts stored</p>}
          </div>
        </Html>
      )}
    </group>
  );
};

const Ground = () => (
  <>
    {/* Ground plane */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 15]} />
      <meshStandardMaterial color="#e2e8f0" opacity={0.5} transparent />
    </mesh>

    {/* Access road */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.5]}>
      <planeGeometry args={[14, 0.8]} />
      <meshStandardMaterial color="#94a3b8" opacity={0.3} transparent />
    </mesh>

    {/* Road label */}
    <Text
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0.01, 1.5]}
      fontSize={0.15}
      color="#64748b"
      anchorX="center"
    >
      ACCESS ROAD
    </Text>

    {/* Zone group labels on ground */}
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

export const StoreLayout3D = ({ liveMode, sparesData = [] }: StoreLayout3DProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getPartsCount = (container: StoreContainer) => {
    if (!liveMode) return 0;
    return sparesData.filter((s) => {
      const area = (s.warehouse_area || "").toUpperCase();
      return area.includes(container.zoneCode) || area.includes(container.zone);
    }).length;
  };

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden" style={{ height: "500px" }}>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.3} />

          {/* Ground & labels */}
          <Ground />

          {/* Containers */}
          {STORE_CONTAINERS.map((container) => (
            <ContainerMesh
              key={container.id}
              container={container}
              partsCount={getPartsCount(container)}
              liveMode={liveMode}
              isSelected={selectedId === container.id}
              onClick={() => setSelectedId(selectedId === container.id ? null : container.id)}
            />
          ))}

          {/* Controls */}
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            maxPolarAngle={Math.PI / 2.2}
            minDistance={4}
            maxDistance={18}
            target={[0, 0.5, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Controls hint */}
      <div className="absolute bottom-2 left-2 text-[10px] text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded">
        🖱 Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
};
