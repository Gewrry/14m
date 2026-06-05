import { Float, Line, Sparkles, Stars, useTexture } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, DepthOfField, EffectComposer, Vignette } from "@react-three/postprocessing";
import { Suspense, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;
type PointerRef = MutableRefObject<{ x: number; y: number }>;

interface RomanticUniverseProps {
  progress: ProgressRef;
  pointer: PointerRef;
  photos: Array<{ src: string }>;
}

function useHeartGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.45);
    shape.bezierCurveTo(0, 0.76, -0.56, 0.78, -0.56, 0.28);
    shape.bezierCurveTo(-0.56, -0.1, -0.22, -0.3, 0, -0.62);
    shape.bezierCurveTo(0.22, -0.3, 0.56, -0.1, 0.56, 0.28);
    shape.bezierCurveTo(0.56, 0.78, 0, 0.76, 0, 0.45);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2,
      bevelEnabled: true,
      bevelSegments: 5,
      bevelSize: 0.04,
      bevelThickness: 0.055,
      curveSegments: 32,
    });

    geometry.center();
    geometry.rotateX(Math.PI);
    return geometry;
  }, []);
}

function sceneFade(progress: number, start: number, end: number) {
  return THREE.MathUtils.smoothstep(progress, start, start + 0.08) * (1 - THREE.MathUtils.smoothstep(progress, end - 0.08, end));
}

function heartPoint3D(t: number, scale = 0.1, zJitter = 0): [number, number, number] {
  return [
    16 * Math.sin(t) ** 3 * scale,
    (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale,
    zJitter,
  ];
}

function CrystalHeart({ progress }: { progress: ProgressRef }) {
  const geometry = useHeartGeometry();
  const mesh = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const haloMaterial = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const heart = mesh.current;
    const glow = halo.current;
    const mat = material.current;
    const glowMat = haloMaterial.current;
    if (!heart || !glow || !mat || !glowMat) return;

    const t = state.clock.elapsedTime;
    const p = progress.current;
    const fade = 1 - THREE.MathUtils.smoothstep(p, 0.24, 0.36);

    heart.rotation.y = t * 0.24 + p * 1.4;
    heart.rotation.z = Math.sin(t * 0.7) * 0.07;
    heart.position.y = Math.sin(t * 0.8) * 0.16;
    heart.scale.setScalar((1.55 + Math.sin(t * 1.1) * 0.035) * Math.max(0.2, fade));
    glow.rotation.copy(heart.rotation);
    glow.position.copy(heart.position);
    glow.scale.setScalar(heart.scale.x * 1.18);
    mat.opacity = 0.86 * fade;
    mat.emissiveIntensity = (0.95 + Math.sin(t * 1.4) * 0.14) * fade;
    glowMat.opacity = 0.24 * fade;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.26}>
      <mesh ref={halo} geometry={geometry} position={[1.05, 0.12, -4]}>
        <meshBasicMaterial
          ref={haloMaterial}
          blending={THREE.AdditiveBlending}
          color="#ff8fba"
          depthWrite={false}
          opacity={0.24}
          transparent
        />
      </mesh>
      <mesh ref={mesh} geometry={geometry} position={[1.05, 0.12, -4]}>
        <meshStandardMaterial
          ref={material}
          color="#ffb3cd"
          emissive="#ff5f9e"
          emissiveIntensity={0.95}
          metalness={0.5}
          opacity={0.86}
          roughness={0.12}
          transparent
        />
      </mesh>
    </Float>
  );
}

function MemoryPanel({ src, index, total, progress }: { src: string; index: number; total: number; progress: ProgressRef }) {
  const texture = useTexture(src);
  const group = useRef<THREE.Group>(null);
  const imageMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const glassMaterial = useRef<THREE.MeshStandardMaterial>(null);

  const panel = useMemo(() => {
    const spread = Math.max(total - 1, 1);
    return {
      x: index % 2 === 0 ? -1.55 : 1.55,
      y: Math.sin(index * 1.6) * 0.46,
      z: -8.4 - (index / spread) * 5.1,
      focus: 0.22 + (index / Math.max(total, 1)) * 0.2,
    };
  }, [index, total]);

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  useFrame((state) => {
    const el = group.current;
    const img = imageMaterial.current;
    const glass = glassMaterial.current;
    if (!el || !img || !glass) return;

    const t = state.clock.elapsedTime;
    const p = progress.current;
    const base = sceneFade(p, 0.16, 0.5);
    const focus = 1 - Math.min(Math.abs(p - panel.focus) / 0.12, 1);

    el.position.y = panel.y + Math.sin(t * 0.65 + index) * 0.1;
    el.rotation.y = (panel.x < 0 ? 0.24 : -0.24) + Math.sin(t * 0.35 + index) * 0.035;
    el.rotation.z = Math.sin(t * 0.24 + index) * 0.018;
    el.scale.setScalar(base * (0.86 + focus * 0.16));
    img.opacity = base * (0.56 + focus * 0.38);
    glass.opacity = base * (0.18 + focus * 0.18);
  });

  return (
    <group ref={group} position={[panel.x, panel.y, panel.z]} scale={0}>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[1.9, 1.35, 0.04]} />
        <meshStandardMaterial ref={glassMaterial} color="#fff7ed" metalness={0.35} opacity={0.2} roughness={0.18} transparent />
      </mesh>
      <mesh>
        <planeGeometry args={[1.72, 1.14]} />
        <meshBasicMaterial ref={imageMaterial} map={texture} opacity={0.85} toneMapped={false} transparent />
      </mesh>
    </group>
  );
}

function SuspendedTimeline({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const points = useMemo<[number, number, number][]>(
    () => [
      [-1.7, -0.35, -17.8],
      [-0.85, 0.34, -18.75],
      [0.1, -0.08, -19.7],
      [1.0, 0.42, -20.62],
      [1.7, -0.22, -21.55],
    ],
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const el = group.current;
    const mesh = nodes.current;
    const material = glow.current;
    if (!el || !mesh || !material) return;

    const p = progress.current;
    const fade = sceneFade(p, 0.5, 0.74);
    el.scale.setScalar(fade);
    el.rotation.y = Math.sin(state.clock.elapsedTime * 0.22) * 0.08;
    material.opacity = fade * 0.7;

    points.forEach((point, index) => {
      const activation = THREE.MathUtils.smoothstep(p, 0.52 + index * 0.035, 0.62 + index * 0.035);
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.4 + index) * 0.08 * activation;
      dummy.position.set(point[0], point[1], point[2]);
      dummy.scale.setScalar((0.09 + activation * 0.08) * pulse);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} scale={0}>
      <Line points={points} color="#d8aa68" lineWidth={1.4} transparent opacity={0.78} />
      <instancedMesh ref={nodes} args={[undefined, undefined, points.length]}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial ref={glow} color="#ffeaf1" transparent opacity={0.7} />
      </instancedMesh>
      {points.map((point, index) => (
        <Sparkles
          key={index}
          color={index % 2 ? "#d9c4ff" : "#ffb3cd"}
          count={16}
          opacity={0.46}
          position={point}
          scale={[0.5, 0.5, 0.5]}
          size={1.3}
          speed={0.24}
        />
      ))}
    </group>
  );
}

function MemoryGallery({ photos, progress }: { photos: Array<{ src: string }>; progress: ProgressRef }) {
  const visiblePhotos = photos.slice(0, 6);
  if (visiblePhotos.length === 0) return null;

  return (
    <Suspense fallback={null}>
      {visiblePhotos.map((photo, index) => (
        <MemoryPanel key={`${photo.src}-${index}`} src={photo.src} index={index} total={visiblePhotos.length} progress={progress} />
      ))}
    </Suspense>
  );
}

function LoveLetterScene({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const card = useRef<THREE.MeshStandardMaterial>(null);
  const lines = useRef<THREE.Group>(null);

  useFrame((state) => {
    const el = group.current;
    const mat = card.current;
    const lineGroup = lines.current;
    if (!el || !mat || !lineGroup) return;

    const p = progress.current;
    const t = state.clock.elapsedTime;
    const fade = sceneFade(p, 0.38, 0.68);

    el.scale.setScalar(fade);
    el.rotation.y = Math.sin(t * 0.38) * 0.045;
    el.rotation.x = -0.06 + Math.cos(t * 0.28) * 0.018;
    mat.opacity = 0.36 * fade;
    lineGroup.children.forEach((child, index) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = fade * THREE.MathUtils.smoothstep(p, 0.42 + index * 0.018, 0.52 + index * 0.018);
    });
  });

  return (
    <group ref={group} position={[0, 0.15, -16]} scale={0}>
      <mesh>
        <boxGeometry args={[3.3, 2.05, 0.05]} />
        <meshStandardMaterial ref={card} color="#fff7ed" metalness={0.2} opacity={0.34} roughness={0.24} transparent />
      </mesh>
      <group ref={lines} position={[-1.12, 0.52, 0.05]}>
        {Array.from({ length: 7 }, (_, index) => (
          <mesh key={index} position={[0, -index * 0.2, 0]}>
            <planeGeometry args={[index === 0 ? 1.8 : 2.32 - (index % 3) * 0.22, 0.025]} />
            <meshBasicMaterial color={index === 0 ? "#d8aa68" : "#fff7ed"} opacity={0} transparent />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function ConstellationScene({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const points = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let i = 0; i < 26; i += 1) {
      const t = (i / 26) * Math.PI * 2;
      result.push(heartPoint3D(t, 0.11, (Math.random() - 0.5) * 0.28));
    }
    return [...result, result[0]];
  }, []);

  useFrame((state) => {
    const el = group.current;
    if (!el) return;
    const fade = sceneFade(progress.current, 0.58, 0.84);
    el.scale.setScalar(fade * 1.35);
    el.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.22 + progress.current * 0.65;
  });

  return (
    <group ref={group} position={[0, -0.22, -21]} scale={0}>
      <Line points={points} color="#ffeaf1" lineWidth={1.25} transparent opacity={0.85} />
      {points.slice(0, -1).map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color={index % 3 === 0 ? "#d8aa68" : "#ffb3cd"} />
        </mesh>
      ))}
      <Sparkles count={42} color="#d9c4ff" opacity={0.58} scale={[3.8, 3.2, 2.4]} size={1.8} speed={0.22} />
    </group>
  );
}

function DeepGallery({ photos, progress }: { photos: Array<{ src: string }>; progress: ProgressRef }) {
  const texture = useTexture(photos[0]?.src ?? "");
  const group = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const frames = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        x: (index - 3) * 0.86,
        y: Math.sin(index * 0.82) * 0.42,
        z: -24.2 - Math.abs(index - 3) * 0.55,
        r: (index - 3) * -0.12,
      })),
    [],
  );

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  useFrame((state) => {
    const el = group.current;
    const mat = material.current;
    if (!el || !mat) return;
    const p = progress.current;
    const fade = sceneFade(p, 0.72, 0.9);
    el.scale.setScalar(fade);
    el.position.x = Math.sin(state.clock.elapsedTime * 0.22) * 0.12;
    el.rotation.y = (p - 0.78) * 1.2;
    mat.opacity = fade * 0.82;
  });

  return (
    <group ref={group} scale={0}>
      {frames.map((frame, index) => (
        <group key={index} position={[frame.x, frame.y, frame.z]} rotation={[0, frame.r, 0]}>
          <mesh position={[0, 0, -0.035]}>
            <boxGeometry args={[0.78, 1.05, 0.035]} />
            <meshStandardMaterial color="#fff7ed" metalness={0.28} opacity={0.16} roughness={0.2} transparent />
          </mesh>
          <mesh>
            <planeGeometry args={[0.68, 0.92]} />
            <meshBasicMaterial ref={index === 0 ? material : undefined} map={texture} opacity={0.78} toneMapped={false} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FinaleParticles({ progress, pointer }: { progress: ProgressRef; pointer: PointerRef }) {
  const points = useRef<THREE.Points>(null);
  const count = 2600;

  const { start, target, color } = useMemo(() => {
    const startPositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      startPositions[i3] = (Math.random() - 0.5) * 12;
      startPositions[i3 + 1] = (Math.random() - 0.5) * 7;
      startPositions[i3 + 2] = -25 + (Math.random() - 0.5) * 5;

      const t = (i / count) * Math.PI * 2;
      const [hx, hy] = heartPoint3D(t, 0.1, 0);
      targetPositions[i3] = hx + (Math.random() - 0.5) * 0.12;
      targetPositions[i3 + 1] = hy + (Math.random() - 0.5) * 0.12;
      targetPositions[i3 + 2] = -28 + (Math.random() - 0.5) * 0.55;

      c.set(i % 4 === 0 ? "#fff7ed" : i % 4 === 1 ? "#ffb3cd" : i % 4 === 2 ? "#d8aa68" : "#d9c4ff");
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    return { start: startPositions, target: targetPositions, color: colors };
  }, []);

  const current = useMemo(() => new Float32Array(start), [start]);

  useFrame((state) => {
    const particleSet = points.current;
    if (!particleSet) return;

    const p = progress.current;
    const gather = THREE.MathUtils.smoothstep(p, 0.74, 0.98);
    const position = particleSet.geometry.attributes.position.array as Float32Array;
    const pulse = Math.sin(state.clock.elapsedTime * 1.2) * 0.035;

    for (let i = 0; i < count * 3; i += 3) {
      position[i] = THREE.MathUtils.lerp(start[i], target[i] + pointer.current.x * 0.08, gather);
      position[i + 1] = THREE.MathUtils.lerp(start[i + 1], target[i + 1] + pointer.current.y * 0.06 + pulse, gather);
      position[i + 2] = THREE.MathUtils.lerp(start[i + 2], target[i + 2], gather);
    }

    particleSet.geometry.attributes.position.needsUpdate = true;
    particleSet.rotation.z = Math.sin(state.clock.elapsedTime * 0.14) * 0.04;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[current, 3]} />
        <bufferAttribute attach="attributes-color" args={[color, 3]} />
      </bufferGeometry>
      <pointsMaterial blending={THREE.AdditiveBlending} depthWrite={false} opacity={0.9} size={0.032} transparent vertexColors />
    </points>
  );
}

function CursorDust({ pointer }: { pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        id: index,
        x: (Math.random() - 0.5) * 7,
        y: (Math.random() - 0.5) * 4,
        z: -5 - Math.random() * 20,
        s: 0.015 + Math.random() * 0.035,
      })),
    [],
  );

  useFrame(() => {
    const el = group.current;
    if (!el) return;
    el.position.x = THREE.MathUtils.lerp(el.position.x, pointer.current.x * 0.35, 0.04);
    el.position.y = THREE.MathUtils.lerp(el.position.y, pointer.current.y * 0.28, 0.04);
  });

  return (
    <group ref={group}>
      {dots.map((dot) => (
        <mesh key={dot.id} position={[dot.x, dot.y, dot.z]}>
          <sphereGeometry args={[dot.s, 8, 8]} />
          <meshBasicMaterial color={dot.id % 2 ? "#ffb3cd" : "#d8aa68"} transparent opacity={0.55} />
        </mesh>
      ))}
    </group>
  );
}

function StarFieldInstanced({ progress }: { progress: ProgressRef }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const count = 1400;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const stars = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 34,
        y: (Math.random() - 0.5) * 18,
        z: -4 - Math.random() * 29,
        s: 0.008 + Math.random() * 0.018,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((state) => {
    const starMesh = mesh.current;
    const mat = material.current;
    if (!starMesh || !mat) return;
    const drift = progress.current * 1.25;
    stars.forEach((star, index) => {
      dummy.position.set(star.x + Math.sin(state.clock.elapsedTime * 0.08 + star.phase) * 0.08, star.y, star.z + drift);
      dummy.scale.setScalar(star.s * (0.8 + Math.sin(state.clock.elapsedTime * 1.7 + star.phase) * 0.2));
      dummy.updateMatrix();
      starMesh.setMatrixAt(index, dummy.matrix);
    });
    starMesh.instanceMatrix.needsUpdate = true;
    mat.opacity = 0.42 + THREE.MathUtils.smoothstep(progress.current, 0.55, 0.82) * 0.22;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial ref={material} color="#fff7ed" transparent opacity={0.42} />
    </instancedMesh>
  );
}

function CameraRig({ progress, pointer }: { progress: ProgressRef; pointer: PointerRef }) {
  const { camera } = useThree();
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.45, 1.8),
        new THREE.Vector3(0.45, 0.1, -5.8),
        new THREE.Vector3(-1.0, 0.35, -10.4),
        new THREE.Vector3(0.62, 0.22, -15.4),
        new THREE.Vector3(1.35, 0.38, -20.2),
        new THREE.Vector3(-0.18, 0.45, -23.0),
        new THREE.Vector3(0.45, 0.2, -25.4),
        new THREE.Vector3(0, 0.2, -31),
      ]),
    [],
  );
  const lookCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.08, -4),
        new THREE.Vector3(0, 0, -8.6),
        new THREE.Vector3(0, 0.1, -13.2),
        new THREE.Vector3(0, 0.1, -16),
        new THREE.Vector3(0, 0, -20),
        new THREE.Vector3(0, 0, -23.2),
        new THREE.Vector3(0, 0, -28),
      ]),
    [],
  );

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const desired = curve.getPoint(p);
    const look = lookCurve.getPoint(Math.min(p, 0.98));

    desired.x += pointer.current.x * 0.22;
    desired.y += pointer.current.y * 0.14;
    camera.position.lerp(desired, 0.06);
    camera.lookAt(look.x + pointer.current.x * 0.08, look.y + pointer.current.y * 0.06, look.z);
  });

  return null;
}

function Universe({ progress, pointer, photos }: RomanticUniverseProps) {
  return (
    <>
      <color attach="background" args={["#08040b"]} />
      <fog attach="fog" args={["#160817", 7, 34]} />
      <ambientLight color="#fff7ed" intensity={0.34} />
      <pointLight color="#ff8fba" distance={11} intensity={2.2} position={[-3.2, 2.4, -2]} />
      <pointLight color="#d8aa68" distance={15} intensity={1.8} position={[3.4, -1.1, -10]} />
      <spotLight angle={0.48} color="#fff7ed" intensity={2.5} penumbra={0.9} position={[0, 4.2, -1.5]} />

      <StarFieldInstanced progress={progress} />
      <Stars count={900} depth={32} fade factor={3.2} radius={52} saturation={0} speed={0.18} />
      <Sparkles color="#fff7ed" count={80} opacity={0.34} scale={[11, 7, 22]} size={1.7} speed={0.18} />
      <Sparkles color="#ff8fba" count={48} opacity={0.38} position={[0, 0, -9]} scale={[7, 4.8, 12]} size={2.1} speed={0.16} />

      <CrystalHeart progress={progress} />
      <MemoryGallery photos={photos} progress={progress} />
      <LoveLetterScene progress={progress} />
      <SuspendedTimeline progress={progress} />
      <ConstellationScene progress={progress} />
      <DeepGallery photos={photos} progress={progress} />
      <FinaleParticles pointer={pointer} progress={progress} />
      <CursorDust pointer={pointer} />
      <CameraRig pointer={pointer} progress={progress} />
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.62} luminanceSmoothing={0.65} luminanceThreshold={0.18} mipmapBlur />
        <DepthOfField bokehScale={2.1} focalLength={0.025} focusDistance={0.018} />
        <Vignette eskil={false} offset={0.18} darkness={0.58} />
      </EffectComposer>
    </>
  );
}

export default function RomanticUniverse({ progress, pointer, photos }: RomanticUniverseProps) {
  return (
    <Canvas
      className="romantic-canvas"
      camera={{ fov: 45, position: [0, 0.45, 1.8] }}
      dpr={[1, 1.35]}
      gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
      performance={{ min: 0.65 }}
    >
      <Suspense fallback={null}>
        <Universe photos={photos} pointer={pointer} progress={progress} />
      </Suspense>
    </Canvas>
  );
}
