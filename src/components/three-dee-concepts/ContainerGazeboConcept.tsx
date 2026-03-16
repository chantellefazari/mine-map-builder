import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

/* ── Shipping Container (40ft ≈ 12.2m × 2.44m × 2.59m) ── */
function ShippingContainer() {
  const w = 12.2, h = 2.59, d = 2.44;
  return (
    <group position={[0, h / 2, 0]}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="hsl(210, 8%, 45%)" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Corrugation strips on long sides */}
      {Array.from({ length: 24 }).map((_, i) => {
        const x = -w / 2 + 0.25 + i * (w / 24);
        return (
          <group key={i}>
            <mesh position={[x, 0, d / 2 + 0.01]}>
              <boxGeometry args={[0.08, h - 0.2, 0.04]} />
              <meshStandardMaterial color="hsl(210, 6%, 38%)" roughness={0.8} metalness={0.2} />
            </mesh>
            <mesh position={[x, 0, -(d / 2 + 0.01)]}>
              <boxGeometry args={[0.08, h - 0.2, 0.04]} />
              <meshStandardMaterial color="hsl(210, 6%, 38%)" roughness={0.8} metalness={0.2} />
            </mesh>
          </group>
        );
      })}
      {/* Top edge trim */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w + 0.06, 0.06, d + 0.06]} />
        <meshStandardMaterial color="hsl(210, 5%, 30%)" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* Bottom edge trim */}
      <mesh position={[0, -h / 2, 0]}>
        <boxGeometry args={[w + 0.06, 0.1, d + 0.06]} />
        <meshStandardMaterial color="hsl(210, 5%, 30%)" roughness={0.6} metalness={0.4} />
      </mesh>
    </group>
  );
}

/* ── Gazebo Canopy (canvas shade extending from container side) ── */
function GazeboCanopy() {
  const canopyWidth = 10; // along container length
  const canopyDepth = 4; // outward from container
  const containerH = 2.59;
  const containerD = 2.44;
  const attachZ = containerD / 2; // attach at container front face
  const outerZ = attachZ + canopyDepth;
  const poleHeight = containerH * 0.85; // outer edge slightly lower for tension

  // Canopy shape — slight slope for tensioned look
  const canopyGeo = new THREE.BufferGeometry();
  const y1 = containerH; // attach height
  const y2 = poleHeight; // outer edge height
  const x1 = -canopyWidth / 2;
  const x2 = canopyWidth / 2;
  const vertices = new Float32Array([
    x1, y1, attachZ,   x2, y1, attachZ,   x2, y2, outerZ,
    x1, y1, attachZ,   x2, y2, outerZ,    x1, y2, outerZ,
  ]);
  canopyGeo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  canopyGeo.computeVertexNormals();

  const canopyMat = new THREE.MeshStandardMaterial({
    color: "hsl(40, 30%, 80%)",
    roughness: 0.9,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });

  const poleMat = new THREE.MeshStandardMaterial({
    color: "hsl(210, 5%, 35%)",
    roughness: 0.5,
    metalness: 0.5,
  });

  return (
    <group>
      {/* Canvas roof */}
      <mesh geometry={canopyGeo} material={canopyMat} />
      {/* Support poles */}
      {[x1 + 0.3, x2 - 0.3].map((px, i) => (
        <mesh key={i} position={[px, poleHeight / 2, outerZ]}>
          <cylinderGeometry args={[0.04, 0.04, poleHeight, 8]} />
          <primitive object={poleMat} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/* ── Ground ── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="hsl(30, 10%, 65%)" roughness={1} />
    </mesh>
  );
}

/* ── Scene ── */
export default function ContainerGazeboConcept() {
  return (
    <div className="w-full h-[70vh] rounded-lg border border-border overflow-hidden bg-muted/30">
      <Canvas
        camera={{ position: [14, 8, 14], fov: 45 }}
        shadows
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} castShadow />
        <directionalLight position={[-8, 10, -5]} intensity={0.3} />

        <ShippingContainer />
        <GazeboCanopy />
        <Ground />

        {/* Label */}
        <Billboard position={[0, 4.5, 0]} follow lockX={false} lockY={false} lockZ={false}>
          <Text fontSize={0.5} color="hsl(0, 0%, 20%)" anchorX="center" anchorY="middle" font={undefined}>
            Container Gazebo Concept
          </Text>
        </Billboard>

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={40}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>
    </div>
  );
}
