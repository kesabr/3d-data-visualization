import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function RotatingBox() {
  const meshRef = React.useRef();
  React.useEffect(() => {
    // Optionally, any effect-related setup can go here.
  }, []);
  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function SceneWithDrei() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <RotatingBox />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
