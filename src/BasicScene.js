import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function RotatingBox() {
  const meshRef = React.useRef();
  useFrame(() => {
    // Rotate the box continuously
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function BasicScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <RotatingBox />
      </Canvas>
    </div>
  );
}
