import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface TimelineItem {
    id: string;
    title: string;
    institution: string;
    period: string;
    description: string;
    color: string;
}

interface TimelineNodeProps {
    item: TimelineItem;
    position: [number, number, number];
    index: number;
    isActive: boolean;
    onClick: () => void;
}

function TimelineNode({ item, position, index, isActive, onClick }: TimelineNodeProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle floating animation
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
            // Scale on hover/active
            const targetScale = hovered || isActive ? 1.15 : 1;
            meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
            <group position={position}>
                {/* Main card */}
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    onClick={onClick}
                >
                    <RoundedBox args={[2.2, 1.4, 0.15]} radius={0.1} smoothness={4}>
                        <meshStandardMaterial
                            color="#111115"
                            metalness={0.8}
                            roughness={0.2}
                            transparent
                            opacity={0.95}
                        />
                    </RoundedBox>

                    {/* Glowing border effect */}
                    <mesh position={[0, 0, -0.08]}>
                        <RoundedBox args={[2.3, 1.5, 0.05]} radius={0.1} smoothness={4}>
                            <meshBasicMaterial color={item.color} transparent opacity={hovered || isActive ? 0.6 : 0.3} />
                        </RoundedBox>
                    </mesh>
                </mesh>

                {/* Title */}
                <Text
                    position={[0, 0.4, 0.1]}
                    fontSize={0.18}
                    color={item.color}
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={2}
                    fontWeight="bold"
                >
                    {item.title}
                </Text>

                {/* Institution */}
                <Text
                    position={[0, 0.1, 0.1]}
                    fontSize={0.12}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.8}
                >
                    {item.institution}
                </Text>

                {/* Period */}
                <Text
                    position={[0, -0.15, 0.1]}
                    fontSize={0.1}
                    color="#B4B4B4"
                    anchorX="center"
                    anchorY="middle"
                >
                    {item.period}
                </Text>

                {/* Description (visible on hover/active) */}
                {(hovered || isActive) && (
                    <Text
                        position={[0, -0.4, 0.1]}
                        fontSize={0.08}
                        color="#888888"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={1.9}
                    >
                        {item.description}
                    </Text>
                )}

                {/* Glowing orb indicator */}
                <mesh position={[0, -0.8, 0]}>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshBasicMaterial color={item.color} />
                </mesh>

                {/* Point light for glow effect */}
                <pointLight position={[0, 0, 0.5]} color={item.color} intensity={hovered || isActive ? 0.5 : 0.2} distance={3} />
            </group>
        </Float>
    );
}

function ConnectionLine({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
    const points = [
        new THREE.Vector3(...start),
        new THREE.Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2 - 0.5, (start[2] + end[2]) / 2),
        new THREE.Vector3(...end)
    ];
    const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
    const curvePoints = curve.getPoints(50);

    return (
        <line>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={curvePoints.length}
                    array={new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={color} transparent opacity={0.4} linewidth={2} />
        </line>
    );
}

function TimelineScene({ items }: { items: TimelineItem[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Calculate positions for 3 items in a horizontal arc
    const positions: [number, number, number][] = [
        [-2.5, 0, 0],
        [0, 0.5, 0.5],
        [2.5, 0, 0]
    ];

    return (
        <>
            {/* Ambient lighting */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />

            {/* Timeline nodes */}
            {items.map((item, index) => (
                <TimelineNode
                    key={item.id}
                    item={item}
                    position={positions[index]}
                    index={index}
                    isActive={activeIndex === index}
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                />
            ))}

            {/* Connection lines between nodes */}
            {items.slice(0, -1).map((item, index) => (
                <ConnectionLine
                    key={`line-${index}`}
                    start={[positions[index][0], positions[index][1] - 0.8, positions[index][2]]}
                    end={[positions[index + 1][0], positions[index + 1][1] - 0.8, positions[index + 1][2]]}
                    color={item.color}
                />
            ))}

            {/* Orbit controls for interactivity */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 2}
            />
        </>
    );
}

interface Timeline3DProps {
    items: TimelineItem[];
}

export function Timeline3D({ items }: Timeline3DProps) {
    return (
        <div className="w-full h-[400px] relative">
            <Canvas
                camera={{ position: [0, 1, 6], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <TimelineScene items={items} />
            </Canvas>

            {/* Instruction overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-[#666] pointer-events-none">
                Drag to rotate • Click cards to expand
            </div>
        </div>
    );
}

export default Timeline3D;
