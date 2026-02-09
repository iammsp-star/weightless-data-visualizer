import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
// Removed PostProcessing for performance on i3 laptop
import DataSphere from './DataSphere';

const Scene = ({ dataPoints = [], onHover, highlightedId }) => {

    return (
        <div style={{ width: '100vw', height: '100vh', background: '#111' }}>
            {/* Reduce DPI for performance */}
            <Canvas dpr={[1, 1.5]} camera={{ position: [0, 5, 20], fov: 60 }}>
                {/* Environment */}
                <color attach="background" args={['#0a0a0a']} />
                <fog attach="fog" args={['#0a0a0a', 10, 40]} />

                {/* Lights */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#44ecff" />
                <pointLight position={[-10, 10, -10]} intensity={1} color="#d144ff" />

                {/* Floor Grid */}
                <Grid
                    position={[0, 0, 0]}
                    args={[40, 40]}
                    cellColor="#333"
                    sectionColor="#555"
                    fadeDistance={20}
                />

                {/* Data Spheres */}
                {dataPoints.map((data) => (
                    <DataSphere
                        key={data.id}
                        data={data}
                        onHover={onHover}
                        isHighlighted={highlightedId === data.id}
                    />
                ))}

                {/* Controls */}
                <OrbitControls
                    enablePan={false}
                    maxPolarAngle={Math.PI / 2 - 0.1} // Prevent going below floor
                    minDistance={5}
                    maxDistance={30}
                />
            </Canvas>
        </div>
    );
};

export default Scene;
