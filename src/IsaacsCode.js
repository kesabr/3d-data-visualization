import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

function FloatingNode({ position, label, color = '#f0f0f0', onClick, url, image }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const offset = Math.sin(t * 0.4 + position[0]) * 0.3;
    meshRef.current.position.y = baseY + offset;
    meshRef.current.rotation.y += 0.003;
    const blink = (Math.sin(t * 5 + position[0]) + 1) / 2;
    meshRef.current.material.emissiveIntensity = 1.2 + blink * 1.5;
  });

  const handleClick = () => {
    if (url) window.open(url, '_blank');
    if (onClick) onClick();
  };

  return (
    <motion.mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      animate={{ scale: hovered ? 1.4 : 1.2 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <sphereGeometry args={[0.8, 48, 48]} />
      <meshStandardMaterial
        color={hovered ? '#ffffff' : color}
        emissive={color}
        emissiveIntensity={1.5}
        metalness={0.3}
        roughness={0.3}
      />
      {hovered && (
        <Html center distanceFactor={5} zIndexRange={[10, 0]}>
          <div style={{ background: 'rgba(0,0,0,0.85)', padding: '18rem', color: '#f0f0f0', border: '1px solid #444', borderRadius: '10px', textAlign: 'center', maxWidth: '1100px' }}>
            <p style={{ margin: '0 0 2rem 0', fontSize: '3rem' }}>{label}</p>
            <img src={image} alt={label} style={{ width: '100%', borderRadius: '8px' }} />
          </div>
        </Html>
      )}
    </motion.mesh>
  );
}

function BackgroundStars({ count = 1000 }) {
  const stars = useMemo(() => Array.from({ length: count }, () => [
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200,
    (Math.random() - 0.5) * 200
  ]), [count]);

  const starRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    starRefs.current.forEach((ref, i) => {
      if (ref) {
        const scale = 0.05 + Math.sin(t * 2 + i) * 0.02;
        ref.scale.set(scale, scale, scale);
      }
    });
  });

  return (
    <group>
      {stars.map((pos, i) => (
        <mesh key={i} position={pos} ref={el => starRefs.current[i] = el}>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}

function GraphLinks({ nodes }) {
  const links = [];
  const distanceThreshold = 15;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dist = Math.sqrt(
        Math.pow(nodes[i][0] - nodes[j][0], 2) +
        Math.pow(nodes[i][1] - nodes[j][1], 2) +
        Math.pow(nodes[i][2] - nodes[j][2], 2)
      );
      if (dist < distanceThreshold) {
        links.push([nodes[i], nodes[j]]);
      }
    }
  }

  const linkRefs = useRef([]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    linkRefs.current.forEach((line, i) => {
      if (line && line.material) {
        line.material.color.setHSL(0.6 + 0.4 * Math.sin(time * 2 + i), 1, 0.8);
      }
    });
  });

  return (
    <group>
      {links.map(([a, b], i) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...a),
          new THREE.Vector3(...b)
        ]);
        return (
          <line key={i} geometry={geometry} ref={el => linkRefs.current[i] = el}>
            <lineBasicMaterial color="#ffffff" linewidth={0.00005} />
          </line>
        );
      })}
    </group>
  );
}

function generateSphereLayout(count = 120, radius = 30) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(2 * Math.random() - 1);
    const phi = 2 * Math.PI * Math.random();
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    nodes.push({ position: [x, y, z] });
  }
  return nodes;
}

function RippleEffect() {
  const mesh = useRef();
  const [scale, setScale] = useState(1);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    setScale(1 + Math.sin(t * 2) * 0.05);
    mesh.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={mesh} position={[0, 0, -2]}>
      <ringGeometry args={[15, 15.3, 128]} />
      <meshBasicMaterial color="#444" transparent opacity={0.25} />
    </mesh>
  );
}

function ArtisticTraces() {
  const lines = [];
  const count = 20;
  for (let i = 0; i < count; i++) {
    const geometry = new THREE.BufferGeometry();
    const points = [];
    for (let j = 0; j < 100; j++) {
      const x = i * 5 - 50;
      const y = Math.sin(j * 0.2 + i) * 2 + j * 0.1;
      const z = 0;
      points.push(new THREE.Vector3(x, y, z));
    }
    geometry.setFromPoints(points);
    lines.push(
      <line key={i} geometry={geometry}>
        <lineBasicMaterial color="#222" linewidth={0.0001} />
      </line>
    );
  }
  return <group>{lines}</group>;
}

function Scene() {
  const [selected, setSelected] = useState(null);

  const nodePositions = useMemo(() => generateSphereLayout().map((n, i) => ({
    position: n.position,
    color: '#f0f0f0',
    url: `https://example.com/node/${i + 1}`,
    image: `https://picsum.photos/seed/node${i + 1}/400/260`
  })), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    nodePositions.forEach(node => {
      node.position[0] += Math.sin(t * 0.05 + node.position[1]) * 0.002;
      node.position[1] += Math.cos(t * 0.05 + node.position[2]) * 0.002;
      node.position[2] += Math.sin(t * 0.05 + node.position[0]) * 0.002;
    });
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffccaa" />
      <RippleEffect />
      <BackgroundStars />
      <ArtisticTraces />
      <GraphLinks nodes={nodePositions.map(n => n.position)} />
      {nodePositions.map((node, idx) => (
        <FloatingNode
          key={idx}
          position={node.position}
          label={`Node ${idx + 1}`}
          url={node.url}
          image={node.image}
          color={node.color}
          onClick={() => setSelected(idx)}
        />
      ))}
      <OrbitControls target={[0, 0, 0]} enableZoom={true} />
    </>
  );
}

export default function AncestralGraphScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, color: '#fff', fontSize: '2rem', fontWeight: 'bold', fontFamily: 'sans-serif', display: 'flex', gap: '2rem' }}>
        <div style={{ cursor: 'pointer' }}>MENU</div>
        <div style={{ cursor: 'pointer' }}>EXPLORE</div>
        <div style={{ cursor: 'pointer' }}>MUTE</div>
      </div>
      <Canvas
        style={{ background: '#000000' }}
        camera={{ position: [0, 0, 0.1], fov: 60 }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
