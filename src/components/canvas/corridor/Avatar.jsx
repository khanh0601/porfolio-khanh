import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture, PositionalAudio, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useAudio } from '../../../context/AudioManager';
import { isTouchDevice } from '../../../utils/deviceDetect';

/**
 * Avatar Component - Interactive Hand-drawn Sketch to Real Photo Transition
 * 
 * Signature Interaction:
 * - Idle: Pure sketch hand-drawn character waving in loop, completely transparent background (0 artifacts)
 * - Hover: Smooth energetic transition into real photo of Khanh
 * - 3D Magnetic Parallax tilt tracking cursor
 * - Hand-drawn comic speech bubble next to his welcoming hand
 * - Action sparkles & paper rustle sound
 * - Seamless reverse back to sketch on mouse leave
 */
const Avatar = ({ position = [0, -0.61, -0.3] }) => {
    const groupRef = useRef();
    const sketchMeshRef = useRef();
    const realGroupRef = useRef();
    const realMeshRef = useRef();
    const bubbleRef = useRef();
    const hintRef = useRef();
    const audioRef = useRef();

    const { camera } = useThree();
    const { globalVolume, isMuted } = useAudio();
    const isTouch = isTouchDevice();

    const [isHovered, setIsHovered] = useState(false);
    const [sketchDimensions, setSketchDimensions] = useState({ width: 3.25, height: 2.3 });

    // Dodge state
    const dodgeX = useRef(0);
    const targetDodgeX = useRef(0);
    const worldPosVec = useRef(new THREE.Vector3());

    // Transition progress: 0 = sketch, 1 = real photo
    const transitionProgress = useRef({ value: 0 });

    // 3D Parallax tilt state
    const currentTilt = useRef({ x: 0, y: 0 });
    const targetTilt = useRef({ x: 0, y: 0 });

    // Sparkles animation refs
    const spark1Ref = useRef();
    const spark2Ref = useRef();
    const spark3Ref = useRef();
    const spark4Ref = useRef();

    // --- FRAME-BY-FRAME SKETCH ANIMATION (PING-PONG) ---
    const TOTAL_FRAMES = 9;
    const framePaths = useMemo(
        () => Array.from({ length: TOTAL_FRAMES }, (_, i) => `/textures/corridor/avatar_anim/${i + 1}.webp`),
        []
    );

    // Load sketch animation frames + real photo
    const sketchTextures = useTexture(framePaths);
    const realTexture = useTexture('/textures/corridor/avatar_real.png');

    const currentFrame = useRef(0);
    const isReversing = useRef(false);
    const frameTimer = useRef(0);

    // Physical dimensions for real photo
    const realHeight = 2.12;
    const realWidth = realHeight * (512 / 1024); // 1.06

    useEffect(() => {
        sketchTextures.forEach(tex => (tex.colorSpace = THREE.SRGBColorSpace));
        if (realTexture) realTexture.colorSpace = THREE.SRGBColorSpace;

        if (sketchTextures[0] && sketchTextures[0].image) {
            const aspectRatio = sketchTextures[0].image.width / sketchTextures[0].image.height;
            const baseHeight = 2.3;
            setSketchDimensions({
                width: baseHeight * aspectRatio,
                height: baseHeight,
            });
        }

        if (sketchMeshRef.current && sketchTextures[currentFrame.current]) {
            sketchMeshRef.current.material.map = sketchTextures[currentFrame.current];
            sketchMeshRef.current.material.needsUpdate = true;
        }
    }, [sketchTextures, realTexture]);

    // Play tactile paper sound on hover
    const playHoverSound = () => {
        if (audioRef.current) {
            try {
                const vol = isMuted ? 0 : 0.65 * globalVolume;
                audioRef.current.setVolume(vol);
                if (audioRef.current.isPlaying) audioRef.current.stop();
                audioRef.current.play();
            } catch (e) {
                // Ignore audio play errors if uninitialized
            }
        }
    };

    // Hover Enter
    const handlePointerOver = (e) => {
        e.stopPropagation();
        if (isHovered) return;
        setIsHovered(true);
        playHoverSound();
        document.body.style.cursor = 'pointer';

        // Make real photo group visible before fading in
        if (realGroupRef.current) {
            realGroupRef.current.visible = true;
        }

        // Animate transition 0 -> 1
        gsap.to(transitionProgress.current, {
            value: 1.0,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: true,
            onUpdate: () => {
                const p = transitionProgress.current.value;
                if (sketchMeshRef.current && sketchMeshRef.current.material) {
                    sketchMeshRef.current.material.opacity = Math.max(0, 1 - p * 1.2);
                }
                if (realMeshRef.current && realMeshRef.current.material) {
                    realMeshRef.current.material.opacity = Math.min(1, p * 1.2);
                }
            },
        });

        // Pop in speech bubble
        if (bubbleRef.current) {
            gsap.to(bubbleRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.45,
                ease: 'back.out(2.2)',
                overwrite: true,
            });
        }

        // Hide hint
        if (hintRef.current) {
            gsap.to(hintRef.current, {
                fillOpacity: 0,
                duration: 0.2,
                overwrite: true,
            });
        }
    };

    // Hover Leave
    const handlePointerOut = (e) => {
        e.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = 'auto';
        targetTilt.current = { x: 0, y: 0 };

        // Animate transition 1 -> 0
        gsap.to(transitionProgress.current, {
            value: 0.0,
            duration: 0.4,
            ease: 'power2.inOut',
            overwrite: true,
            onUpdate: () => {
                const p = transitionProgress.current.value;
                if (sketchMeshRef.current && sketchMeshRef.current.material) {
                    sketchMeshRef.current.material.opacity = Math.max(0, 1 - p * 1.2);
                }
                if (realMeshRef.current && realMeshRef.current.material) {
                    realMeshRef.current.material.opacity = Math.min(1, p * 1.2);
                }
            },
            onComplete: () => {
                // Completely hide real photo group when not hovered to guarantee zero bleed/leak
                if (realGroupRef.current) {
                    realGroupRef.current.visible = false;
                }
            },
        });

        // Hide speech bubble
        if (bubbleRef.current) {
            gsap.to(bubbleRef.current.scale, {
                x: 0.001,
                y: 0.001,
                z: 0.001,
                duration: 0.3,
                ease: 'power2.in',
                overwrite: true,
            });
        }

        // Restore hint
        if (hintRef.current) {
            gsap.to(hintRef.current, {
                fillOpacity: 0.75,
                duration: 0.35,
                delay: 0.2,
                overwrite: true,
            });
        }
    };

    // Pointer move for magnetic parallax
    const handlePointerMove = (e) => {
        if (!isHovered || isTouch) return;
        e.stopPropagation();
        if (groupRef.current) {
            groupRef.current.getWorldPosition(worldPosVec.current);
            const relX = (e.point.x - worldPosVec.current.x) / (realWidth * 0.7);
            const relY = (e.point.y - worldPosVec.current.y) / (realHeight * 0.5);
            targetTilt.current = {
                x: THREE.MathUtils.clamp(relX, -1, 1),
                y: THREE.MathUtils.clamp(relY, -1, 1),
            };
        }
    };

    // Toggle on touch devices
    const handleClick = (e) => {
        e.stopPropagation();
        if (isTouch) {
            if (!isHovered) {
                handlePointerOver(e);
            } else {
                handlePointerOut(e);
            }
        }
    };

    // Main frame loop
    useFrame((state, delta) => {
        if (!groupRef.current || !sketchMeshRef.current) return;

        const time = state.clock.elapsedTime;
        const p = transitionProgress.current.value;

        // === DODGE LOGIC ===
        groupRef.current.getWorldPosition(worldPosVec.current);
        const distance = camera.position.z - worldPosVec.current.z;

        const DODGE_START = 3;
        const DODGE_PEAK = 0;
        const DODGE_END = -2;
        const DODGE_AMOUNT = -1.5;

        if (distance > DODGE_PEAK && distance < DODGE_START) {
            const t = (DODGE_START - distance) / (DODGE_START - DODGE_PEAK);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else if (distance <= DODGE_PEAK && distance > DODGE_END) {
            const t = (distance - DODGE_END) / (DODGE_PEAK - DODGE_END);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else {
            targetDodgeX.current = 0;
        }

        dodgeX.current = THREE.MathUtils.lerp(dodgeX.current, targetDodgeX.current, 0.08);

        // Smooth magnetic parallax tilt & scale
        currentTilt.current.x = THREE.MathUtils.lerp(currentTilt.current.x, targetTilt.current.x, 8 * delta);
        currentTilt.current.y = THREE.MathUtils.lerp(currentTilt.current.y, targetTilt.current.y, 8 * delta);

        // Idle floating breathing animation + subtle hover lift
        const idleFloatY = Math.sin(time * 2.5) * 0.015;
        const hoverLift = p * 0.03;

        groupRef.current.position.x = position[0] + dodgeX.current;
        groupRef.current.position.y = position[1] + idleFloatY + hoverLift;
        groupRef.current.rotation.y = currentTilt.current.x * 0.22 * p;
        groupRef.current.rotation.x = -currentTilt.current.y * 0.12 * p;

        const s = 1.0 + p * 0.06;
        groupRef.current.scale.set(s, s, s);

        // Speech bubble subtle float
        if (bubbleRef.current && p > 0.1) {
            bubbleRef.current.position.y = 0.55 + Math.sin(time * 3.5) * 0.02;
            bubbleRef.current.rotation.z = Math.sin(time * 2.0) * 0.015;
        }

        // Animated sparkles around Khanh's head
        if (p > 0.1) {
            if (spark1Ref.current) spark1Ref.current.rotation.z = time * 2;
            if (spark2Ref.current) spark2Ref.current.rotation.z = -time * 2.5;
            if (spark3Ref.current) spark3Ref.current.rotation.z = time * 3;
            if (spark4Ref.current) spark4Ref.current.rotation.z = -time * 1.8;
        }

        // Floating hint animation
        if (hintRef.current) {
            hintRef.current.position.y = -1.18 + Math.sin(time * 3.0) * 0.015;
        }

        // === FRAME ANIMATION LOGIC (PING-PONG) ===
        // Only advance sketch frames if sketch is visible
        if (p < 0.95) {
            const FPS = 20;
            const frameDuration = 1 / FPS;

            frameTimer.current += delta;

            if (frameTimer.current >= frameDuration) {
                frameTimer.current = 0;

                if (currentFrame.current >= TOTAL_FRAMES - 1) {
                    isReversing.current = true;
                } else if (currentFrame.current <= 0) {
                    isReversing.current = false;
                }

                if (isReversing.current) {
                    currentFrame.current -= 1;
                } else {
                    currentFrame.current += 1;
                }

                const safeIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, currentFrame.current));
                if (sketchMeshRef.current && sketchMeshRef.current.material) {
                    sketchMeshRef.current.material.map = sketchTextures[safeIndex];
                    sketchMeshRef.current.material.needsUpdate = true;
                }
            }
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* === 1. SKETCH MESH (ALWAYS CLEAN WHEN NOT HOVERED) === */}
            <mesh ref={sketchMeshRef} renderOrder={10} position={[0, 0, 0]}>
                <planeGeometry args={[sketchDimensions.width, sketchDimensions.height]} />
                <meshBasicMaterial
                    color="#ffffff"
                    map={sketchTextures[0]}
                    transparent={true}
                    opacity={1}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    alphaTest={0.05}
                />
            </mesh>

            {/* === 2. REAL PHOTO GROUP (ONLY VISIBLE ON HOVER) === */}
            <group ref={realGroupRef} visible={false}>
                {/* Real Photo of Khanh */}
                <mesh ref={realMeshRef} position={[0, 0.02, 0.001]} renderOrder={12}>
                    <planeGeometry args={[realWidth, realHeight]} />
                    <meshBasicMaterial
                        color="#ffffff"
                        map={realTexture}
                        transparent={true}
                        opacity={0}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        alphaTest={0.05}
                    />
                </mesh>

                {/* Hand-drawn Action Sparkles / Stars when hovered */}
                <group position={[0, 0, 0.015]}>
                    <Text
                        ref={spark1Ref}
                        position={[-0.55, 1.05, 0.02]}
                        fontSize={0.24}
                        color="#ffcc00"
                        font="/fonts/CabinSketch-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ✦
                    </Text>
                    <Text
                        ref={spark2Ref}
                        position={[0.55, 0.95, 0.02]}
                        fontSize={0.22}
                        color="#ff4466"
                        font="/fonts/CabinSketch-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ✧
                    </Text>
                    <Text
                        ref={spark3Ref}
                        position={[-0.75, 0.55, 0.02]}
                        fontSize={0.25}
                        color="#33ccff"
                        font="/fonts/CabinSketch-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ★
                    </Text>
                    <Text
                        ref={spark4Ref}
                        position={[0.65, 0.35, 0.02]}
                        fontSize={0.20}
                        color="#ff9900"
                        font="/fonts/CabinSketch-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        ⚡
                    </Text>
                </group>

                {/* === 3. FLOATING COMIC SPEECH BUBBLE (POPS OUT NEAR KHANH'S HAND) === */}
                <group
                    ref={bubbleRef}
                    position={[-1.25, 0.55, 0.08]}
                    scale={[0.001, 0.001, 0.001]}
                >
                    {/* Bubble paper card */}
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[2.0, 0.95]} />
                        <meshBasicMaterial
                            color="#ffffff"
                            transparent
                            opacity={0.96}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Hand-drawn paper border */}
                    <mesh position={[0, 0, -0.012]} scale={[1.04, 1.08, 1]}>
                        <planeGeometry args={[2.0, 0.95]} />
                        <meshBasicMaterial
                            color="#1a1a1a"
                            transparent
                            opacity={0.85}
                            side={THREE.DoubleSide}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Speech bubble pointer / tail pointing towards Khanh's hand */}
                    <mesh position={[0.95, -0.25, -0.009]} rotation={[0, 0, -0.4]}>
                        <planeGeometry args={[0.22, 0.22]} />
                        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} depthWrite={false} />
                    </mesh>

                    {/* Name */}
                    <Text
                        position={[0, 0.24, 0.02]}
                        fontSize={0.20}
                        color="#111111"
                        font="/fonts/CabinSketch-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        TRẦN QUANG KHÁNH
                    </Text>

                    {/* Role */}
                    <Text
                        position={[0, 0.0, 0.02]}
                        fontSize={0.14}
                        color="#2f8175"
                        font="/fonts/CabinSketch-Bold.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        &lt; Product &amp; Creative Dev /&gt;
                    </Text>

                    {/* Welcoming message */}
                    <Text
                        position={[0, -0.22, 0.02]}
                        fontSize={0.13}
                        color="#444444"
                        font="/fonts/CabinSketch-Regular.ttf"
                        anchorX="center"
                        anchorY="middle"
                    >
                        "Welcome to my creative space! 👋"
                    </Text>
                </group>
            </group>

            {/* === 4. IDLE INTERACTION HINT (CLEAN TEXT BELOW FEET, NO UGLY WHITE BOX) === */}
            <Text
                ref={hintRef}
                position={[0, -1.18, 0.05]}
                fontSize={0.16}
                color="#555555"
                font="/fonts/CabinSketch-Bold.ttf"
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.75}
            >
                ✨ hover me ✨
            </Text>

            {/* === 5. PRECISE POINTER HITBOX === */}
            <mesh
                position={[0, 0, 0.02]}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerMove={handlePointerMove}
                onClick={handleClick}
            >
                <planeGeometry args={[1.25, 2.3]} />
                <meshBasicMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>

            {/* === 6. AUDIO ELEMENT === */}
            <PositionalAudio
                ref={audioRef}
                url="/sounds/papersound.mp3"
                distanceModel="exponential"
                rolloffFactor={1.2}
                refDistance={2.5}
                loop={false}
            />
        </group>
    );
};

// Easing function
const easeOutQuad = (t) => t * (2 - t);

export default Avatar;
