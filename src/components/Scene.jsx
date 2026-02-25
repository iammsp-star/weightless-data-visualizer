import React, { useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import NeuralNode from './DataSphere'; // We'll refactor DataSphere to NeuralNode next

// Connectivity Component
const Connectivity = ({ dataPoints }) => {
    const lines = useMemo(() => {
        const connections = [];
        const threshold = 15; // Distance threshold for connection

        for (let i = 0; i < dataPoints.length; i++) {
            for (let j = i + 1; j < dataPoints.length; j++) {
                const p1 = new THREE.Vector3(...dataPoints[i].position);
                const p1Y = dataPoints[i].value * 5 + 2; // Approximate current Y (static for line calc)
                p1.setY(p1Y);

                const p2 = new THREE.Vector3(...dataPoints[j].position);
                const p2Y = dataPoints[j].value * 5 + 2;
                p2.setY(p2Y);

                if (p1.distanceTo(p2) < threshold) {
                    connections.push([p1, p2]);
                }
            }
        }
        return connections;
    }, [dataPoints]);

    return (
        <group>
            {lines.map((line, index) => (
                <Line
                    key={index}
                    points={line}
                    color="#00ffff"
                    transparent
                    opacity={0.05}
                    lineWidth={1}
                />
            ))}
        </group>
    );
};

const Scene = ({ dataPoints = [], onHover, highlightedId }) => {

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 5, 25], fov: 50 }} gl={{ toneMapping: THREE.ReinhardToneMapping }}>
                {/* Environment: Void & Stars */}
                <color attach="background" args={['#020202']} />
                <fog attach="fog" args={['#020202', 10, 60]} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                {/* Lights */}
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
                <pointLight position={[-10, -10, -10]} intensity={2} color="#ff00ff" />

                {/* Connectivity Web */}
                <Connectivity dataPoints={dataPoints} />

                {/* Neural Nodes (formerly DataSpheres) */}
                {dataPoints.map((data) => (
                    <NeuralNode
                        key={data.id}
                        data={data}
                        onHover={onHover}
                        isHighlighted={highlightedId === data.id}
                    />
                ))}

                {/* Orbit Controls */}
                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minDistance={5}
                    maxDistance={40}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />

                {/* Post-Processing: Retro-Futuristic Vibe */}
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default Scene;
