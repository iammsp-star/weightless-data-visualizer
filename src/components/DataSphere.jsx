import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Color } from 'three';
import { Line } from '@react-three/drei';

const DataSphere = ({ data }) => {
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
    const color = useMemo(() => {
        const c = new Color();
        // HSL: Hue 200 (Blue) to 280 (Purple), Saturation 100%, Lightness variable
        c.setHSL(0.6 + data.value * 0.2, 1, 0.5);
        return c;
    }, [data.value]);

    // Current position state for the Line to track
    const [currentPos, setCurrentPos] = useState(initialPosition.clone());

    useFrame((state) => {
        if (!meshRef.current) return;

        // 1. Floating Animation (Sine Wave)
        const time = state.clock.getElapsedTime();
        const floatY = Math.sin(time * 2 + randomPhase) * 0.5;
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

        if (dist < magnetRadius) {
            // Attraction
            const attractionStrength = (1 - dist / magnetRadius); // 0 to 1
            // Move towards the CLOSEST POINT on the ray
            const direction = closestPointOnRay.clone().sub(basePosition).normalize();
            const moveDist = attractionStrength * maxAttraction * attractionStrength; // Non-linear pull

            targetPos.add(direction.multiplyScalar(moveDist));
            targetScale = 1 + attractionStrength * 0.8; // Scale up more
        }

        // Lerp current position to target
        meshRef.current.position.lerp(targetPos, 0.1);
        meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);

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
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <sphereGeometry args={[0.4, 32, 32]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={data.value * 2 + (hovered ? 2 : 0)}
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
