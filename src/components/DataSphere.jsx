import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Color } from 'three';
import { Line } from '@react-three/drei';

const DataSphere = ({ data, onHover, isHighlighted }) => {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const { mouse, viewport } = useThree();

    // Initial position from data
    const initialPosition = useMemo(() => new Vector3(...data.position), [data.position]);

    // Calculate target height based on value (0-1 -> 0-10 height)
    const targetY = data.value * 5 + 2; // Floor is at 0, float between 2 and 7

    // Random offset for floating animation to avoid synced bobbing
    const randomPhase = useMemo(() => Math.random() * Math.PI * 2, []);

    // Emissive color based on value (dark blue to bright neon cyan/purple)
    // Low value: Blue, High value: Cyan/White
    // Color mapping based on Category
    const color = useMemo(() => {
        const c = new Color();
        switch (data.category) {
            case 'Elite':
                // Gold / Amber
                c.setHex(0xffaa00);
                break;
            case 'Intermediate':
                // Cyan / Bright Blue
                c.setHex(0x00ffff);
                break;
            case 'Beginner':
            default:
                // Teal / Greenish
                c.setHex(0x00ff88);
                break;
        }
        return c;
    }, [data.category]);

    // Current position state for the Line to track
    const [currentPos, setCurrentPos] = useState(initialPosition.clone());

    useFrame((state) => {
        if (!meshRef.current) return;

        // 1. Floating Animation (Sine Wave) - Smoother
        const time = state.clock.getElapsedTime();
        const floatY = Math.sin(time * 0.5 + randomPhase) * 0.2; // Slower and subtler
        const basePosition = new Vector3(initialPosition.x, targetY + floatY, initialPosition.z);

        // 2. Magnet Interaction
        const ray = state.raycaster.ray;
        const closestPointOnRay = new Vector3();
        ray.closestPointToPoint(basePosition, closestPointOnRay);

        // Calculate distance to the "Magnetic Zone"
        const dist = basePosition.distanceTo(closestPointOnRay);
        const magnetRadius = 5; // Updated to 5 units per prompt
        const maxAttraction = 3; // Strengthening attraction

        let targetPos = basePosition.clone();
        let targetScale = 1;

        // Magnet Logic OR Highlight Logic
        if (isHighlighted) {
            targetScale = 2.5; // Make it BIG when searched
        } else if (dist < magnetRadius) {
            // Attraction
            const attractionStrength = (1 - dist / magnetRadius); // 0 to 1
            // Move towards the CLOSEST POINT on the ray
            const direction = closestPointOnRay.clone().sub(basePosition).normalize();
            const moveDist = attractionStrength * maxAttraction * attractionStrength; // Non-linear pull

            targetPos.add(direction.multiplyScalar(moveDist));
            targetScale = 1 + attractionStrength * 0.8; // Scale up more
        }

        // Lerp current position to target (Smoother)
        meshRef.current.position.lerp(targetPos, 0.05);
        meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.05);

        // Update state for the Line component
        setCurrentPos(meshRef.current.position.clone());
    });

    // Anchor point on the floor
    const floorPos = useMemo(() => new Vector3(initialPosition.x, 0, initialPosition.z), [initialPosition]);

    return (
        <>
            <mesh
                ref={meshRef}
                position={initialPosition}
                onPointerOver={() => { setHovered(true); if (onHover) onHover(data); }}
                onPointerOut={() => { setHovered(false); if (onHover) onHover(null); }}
            >
                {/* Optimized Geometry: 16x16 segments instead of 32x32 */}
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={isHighlighted ? 10 : (data.value * 2 + (hovered ? 2 : 0))}
                    transparent
                    opacity={0.9}
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>

            {/* Tether Line */}
            <Line
                points={[floorPos, currentPos]}
                color="white"
                transparent
                opacity={0.15}
                lineWidth={1}
            />
        </>
    );
};

export default DataSphere;
