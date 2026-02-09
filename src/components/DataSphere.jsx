import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Color } from 'three';

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

    useFrame((state) => {
        if (!meshRef.current) return;

        // 1. Floating Animation (Sine Wave)
        const time = state.clock.getElapsedTime();
        const floatY = Math.sin(time * 2 + randomPhase) * 0.5;
        const basePosition = new Vector3(initialPosition.x, targetY + floatY, initialPosition.z);

        // 2. Magnet Interaction
        // Raycaster is handled implicitly by pointer events in R3F, but for "magnet" 
        // we want distance-based effect even without direct hover, OR just simple hover-attract.
        // The prompt asks for "Magnet Cursor" using Raycaster (which R3F uses for events).
        // "When mouse is near... move toward cursor".
        // We can calculate distance to mouse ray in 3D?
        // Simplified: Use the mouse position projected to the sphere's depth? 
        // Or just vector from sphere to camera-unprojected mouse?

        // Let's implement actual 3D mouse tracking.
        // Convert mouse (normalized -1 to 1) to world coordinates at the sphere's depth?
        // Or simpler: Vector from sphere to (mouse.x * viewport.width/2, mouse.y * viewport.height/2, 0).
        // Note: viewport width/height is at z=0. If camera is Perspective, this is approximation.

        // Better: Unproject mouse vector.
        const mouseVector = new Vector3(state.mouse.x, state.mouse.y, 0.5);
        mouseVector.unproject(state.camera);
        const dir = mouseVector.sub(state.camera.position).normalize();
        const distance = -state.camera.position.z / dir.z; // Distance to z=0 plane? No.
        // Let's stick to the prompt's "Vector math: Direction = Mouse - Sphere".
        // We need the mouse position in 3D. 
        // A robust way for "magnet" is to cast a ray from camera to mouse and find point on a plane.
        // But for a visual effect, we can use the R3F `pointer` logic if we want.

        // Let's simply check distance to the Ray created by mouse.
        const ray = state.raycaster.ray;
        // Calculate distance from sphere to the ray
        // projected point on ray closest to sphere center
        const closestPointOnRay = new Vector3();
        ray.closestPointToPoint(basePosition, closestPointOnRay);

        const dist = basePosition.distanceTo(closestPointOnRay);
        const magnetRadius = 3; // How close mouse needs to be
        const maxAttraction = 1.5; // How far it can move towards mouse

        let targetPos = basePosition.clone();
        let targetScale = 1;

        if (dist < magnetRadius) {
            // Attraction
            const attractionStrength = (1 - dist / magnetRadius);
            // Move towards the CLOSEST POINT on the ray (which effectively is "towards the mouse cursor line")
            const direction = closestPointOnRay.clone().sub(basePosition).normalize();
            const moveDist = attractionStrength * maxAttraction;

            targetPos.add(direction.multiplyScalar(moveDist));
            targetScale = 1 + attractionStrength * 0.5; // Scale up
        }

        // Lerp current position to target
        meshRef.current.position.lerp(targetPos, 0.1);
        meshRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
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
    );
};

export default DataSphere;
