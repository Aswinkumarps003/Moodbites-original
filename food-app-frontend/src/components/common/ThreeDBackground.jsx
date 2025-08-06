import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Torus, Box, Environment } from '@react-three/drei';

const ThreeDBackground = () => {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1.2, 32, 32]} position={[-3, 2, 0]}>
            <meshStandardMaterial color="#FFB347" emissive="#FFB347" emissiveIntensity={0.2} />
          </Sphere>
        </Float>
        <Float speed={1.5} rotationIntensity={1.2} floatIntensity={1.5}>
          <Torus args={[1, 0.3, 16, 100]} position={[3, -1, 0]}>
            <meshStandardMaterial color="#FF6961" emissive="#FF6961" emissiveIntensity={0.2} />
          </Torus>
        </Float>
        <Float speed={1.8} rotationIntensity={1.1} floatIntensity={1.8}>
          <Box args={[1.2, 1.2, 1.2]} position={[0, -2.5, 0]}>
            <meshStandardMaterial color="#77DD77" emissive="#77DD77" emissiveIntensity={0.2} />
          </Box>
        </Float>
        <Environment preset="sunset" />
        {/* Optionally add OrbitControls for debugging: <OrbitControls enableZoom={false} enablePan={false} /> */}
      </Canvas>
    </div>
  );
};

export default ThreeDBackground; 