import React from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion-3d';
import { OrbitControls } from '@react-three/drei';

export default function SceneWithMotion() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <motion.mesh
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="lightblue" />
        </motion.mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
