import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

type ProgressRef = MutableRefObject<number>;
type PointerRef = MutableRefObject<{ x: number; y: number }>;

interface Props {
  progress: ProgressRef;
  pointer: PointerRef;
  photos: Array<{ src: string }>;
}

/* ── Star field ──────────────────────────────── */
function StarField() {
  const ref = useRef<THREE.Points>(null);
  const count = 700;
  const pos = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      a[i]     = (Math.random() - 0.5) * 42;
      a[i + 1] = (Math.random() - 0.5) * 22;
      a[i + 2] = -Math.random() * 36;
    }
    return a;
  }, []);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.018;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fff7ed" size={0.045} sizeAttenuation transparent opacity={0.65} />
    </points>
  );
}

/* ── Floating dust particles ─────────────────── */
function Dust({ pointer }: { pointer: PointerRef }) {
  const ref = useRef<THREE.Points>(null);
  const count = 180;
  const { pos, col } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const pink = new THREE.Color("#ffb3cd");
    const gold = new THREE.Color("#d8aa68");
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*10;
      pos[i*3+1] = (Math.random()-0.5)*6;
      pos[i*3+2] = -2 - Math.random()*18;
      const c = i%2===0 ? pink : gold;
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }
    return { pos, col };
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, pointer.current.x*0.3, 0.04);
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pointer.current.y*0.2, 0.04);
    ref.current.rotation.z = s.clock.elapsedTime * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.72}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ── Crystal heart (icosahedron gem) ─────────── */
function CrystalHeart({ progress }: { progress: ProgressRef }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const p = progress.current;
    const fade = THREE.MathUtils.smoothstep(1-p, 0, 0.3);
    const sc = 0.28 + fade * 0.48;
    if (outer.current) {
      outer.current.rotation.y = t * 0.45;
      outer.current.rotation.x = Math.sin(t*0.3)*0.18;
      outer.current.scale.setScalar(sc);
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.6;
      inner.current.scale.setScalar(sc * 0.62);
    }
  });

  return (
    <group position={[0, 0.1, -2.2]}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#ff8fba" emissive="#d8aa68" emissiveIntensity={0.5}
          roughness={0.05} metalness={0.9} transparent opacity={0.82} wireframe={false} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.55, 0]} />
        <meshStandardMaterial color="#d9c4ff" emissive="#ffb3cd" emissiveIntensity={0.7}
          roughness={0.0} metalness={1} transparent opacity={0.55} />
      </mesh>
      {/* Glow ring */}
      <mesh rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[0.72, 0.015, 8, 64]} />
        <meshBasicMaterial color="#d8aa68" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/* ── Floating photo frame ─────────────────────── */
function PhotoFrame({ src, position, progress, index }: {
  src: string; position: [number,number,number]; progress: ProgressRef; index: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat  = useRef<THREE.MeshBasicMaterial>(null);
  const tex  = useMemo(() => {
    const t = new THREE.TextureLoader().load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [src]);

  useFrame((s) => {
    if (!mesh.current || !mat.current) return;
    const p = progress.current;
    const fade = THREE.MathUtils.smoothstep(p, 0.14 + index*0.06, 0.28 + index*0.06);
    const t = s.clock.elapsedTime;
    mesh.current.position.y = position[1] + Math.sin(t*0.6+index)*0.1;
    mesh.current.rotation.y = (position[0]<0 ? 0.22 : -0.22) + Math.sin(t*0.3+index)*0.03;
    mesh.current.scale.setScalar(fade);
    mat.current.opacity = fade * 0.9;
  });

  return (
    <mesh ref={mesh} position={position} scale={0}>
      <planeGeometry args={[1.72, 1.14]} />
      <meshBasicMaterial ref={mat} map={tex} transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

/* ── Constellation heart ──────────────────────── */
function Constellation({ progress }: { progress: ProgressRef }) {
  const group = useRef<THREE.Group>(null);
  const pts = useMemo(() => {
    const arr: [number,number,number][] = [];
    for (let i=0; i<24; i++) {
      const t = (i/24)*Math.PI*2;
      const x = 16*Math.pow(Math.sin(t),3)*0.11;
      const y = (13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*0.11;
      arr.push([x, y, (Math.random()-0.5)*0.2]);
    }
    arr.push(arr[0]);
    return arr;
  }, []);

  const linePts = useMemo(() => new Float32Array(pts.flat()), [pts]);

  useFrame((s) => {
    if (!group.current) return;
    const fade = THREE.MathUtils.smoothstep(progress.current, 0.55, 0.82);
    group.current.scale.setScalar(fade*1.4);
    group.current.rotation.y = Math.sin(s.clock.elapsedTime*0.18)*0.22;
  });

  return (
    <group ref={group} position={[0,-0.2,-21]} scale={0}>
      <line>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePts,3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ffeaf1" transparent opacity={0.75} />
      </line>
      {pts.slice(0,-1).map((p,i)=>(
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.055,8,8]} />
          <meshBasicMaterial color={i%3===0?"#d8aa68":"#ffb3cd"} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Camera rig ───────────────────────────────── */
function CameraRig({ progress, pointer }: { progress: ProgressRef; pointer: PointerRef }) {
  const { camera } = useThree();
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.45, 1.8),
    new THREE.Vector3(0.5, 0.1, -5.5),
    new THREE.Vector3(-1, 0.35, -10),
    new THREE.Vector3(0.6, 0.2, -15),
    new THREE.Vector3(1.3, 0.35, -20),
    new THREE.Vector3(-0.2, 0.4, -23),
    new THREE.Vector3(0, 0.2, -31),
  ]), []);

  useFrame(() => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    const d = curve.getPoint(p);
    d.x += pointer.current.x * 0.22;
    d.y += pointer.current.y * 0.14;
    camera.position.lerp(d, 0.06);
    camera.lookAt(0, 0, d.z - 3);
  });

  return null;
}

/* ── Scene root ───────────────────────────────── */
function Scene({ progress, pointer, photos }: Props) {
  const frames: [number,number,number][] = useMemo(() => [
    [-1.5, 0.2, -8],  [1.5, -0.1, -9.5],
    [-1.5,-0.3,-11.5],[1.5,  0.3,-13],
    [-1.5, 0.1,-15],  [1.5, -0.2,-16.5],
  ], []);

  return (
    <>
      <ambientLight color="#fff7ed" intensity={0.4} />
      <pointLight color="#ff8fba" intensity={3} distance={15} position={[-3,3,-2]} />
      <pointLight color="#d8aa68" intensity={2} distance={20} position={[3,-1,-10]} />
      <spotLight  color="#fff7ed" intensity={3} angle={0.5} penumbra={0.9} position={[0,5,-1.5]} />
      <fog attach="fog" args={["#160817", 8, 36]} />

      <StarField />
      <Dust pointer={pointer} />
      <CrystalHeart progress={progress} />

      {photos.slice(0,6).map((ph, i) => (
        <PhotoFrame key={i} src={ph.src} position={frames[i]} progress={progress} index={i} />
      ))}

      <Constellation progress={progress} />
      <CameraRig progress={progress} pointer={pointer} />
    </>
  );
}

export default function RomanticUniverse({ progress, pointer, photos }: Props) {
  return (
    <Canvas
      className="romantic-canvas"
      camera={{ fov: 45, position: [0, 0.45, 1.8] }}
      dpr={[1, 1.2]}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
    >
      <Scene progress={progress} pointer={pointer} photos={photos} />
    </Canvas>
  );
}
