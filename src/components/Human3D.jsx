// ============================================================
// Human3D — Stylized 3D Human Character (Geometry-based)
// Gender-specific, animated: idle | walk | press | sit
// ============================================================
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Human3D({
  gender = "male",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animation = "idle",         // idle | walk | press | salute | sit
  shirtColor = "#2563EB",
  skinTone = "#D4956A",        // warm brown default — use #FDBCB4 for lighter
  pantsColor,
  scale = 1,
  facingZ = -1,               // -1 = faces camera (forward), 1 = faces away
}) {
  const rootRef = useRef();
  const torsoRef = useRef();
  const headRef = useRef();
  const lArmRef = useRef();
  const rArmRef = useRef();
  const lLegRef = useRef();
  const rLegRef = useRef();
  const lForeRef = useRef();
  const rForeRef = useRef();
  const pressArmRef = useRef();

  const isFemale = gender === "female";
  const trousersColor = pantsColor || (isFemale ? "#6B21A8" : "#1E3A5F");
  const shoeColor = "#111827";
  const hairColor = isFemale ? "#8B4513" : "#1A1A1A";

  // Proportions differ by gender
  const sw = isFemale ? 0.38 : 0.44;  // shoulder width
  const hw = isFemale ? 0.36 : 0.30;  // hip width
  const th = isFemale ? 0.60 : 0.66;  // torso height

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (animation === "idle") {
      // Gentle breathing
      if (torsoRef.current) torsoRef.current.scale.y = 1 + Math.sin(t * 1.8) * 0.012;
      if (headRef.current) headRef.current.position.y = 1.72 + Math.sin(t * 1.8) * 0.005;
    }

    if (animation === "walk") {
      const swing = Math.sin(t * 4.5) * 0.55;
      if (lLegRef.current) lLegRef.current.rotation.x = swing;
      if (rLegRef.current) rLegRef.current.rotation.x = -swing;
      if (lArmRef.current) lArmRef.current.rotation.x = -swing * 0.6;
      if (rArmRef.current) rArmRef.current.rotation.x = swing * 0.6;
      // Walk bob
      if (rootRef.current) rootRef.current.position.y = position[1] + Math.abs(Math.sin(t * 4.5)) * 0.05;
    }

    if (animation === "press") {
      // Right arm reach forward and press
      if (pressArmRef.current) {
        pressArmRef.current.rotation.x = -0.9 + Math.sin(t * 2.5) * 0.2;
        pressArmRef.current.rotation.z = -0.15;
      }
      if (rForeRef.current) {
        rForeRef.current.rotation.x = -0.4 + Math.sin(t * 2.5) * 0.15;
      }
    }

    if (animation === "sit") {
      if (lLegRef.current) lLegRef.current.rotation.x = -1.2;
      if (rLegRef.current) rLegRef.current.rotation.x = -1.2;
    }

    if (animation === "salute") {
      if (rArmRef.current) {
        rArmRef.current.rotation.x = -Math.PI / 2 + Math.sin(t) * 0.05;
        rArmRef.current.rotation.z = -0.2;
      }
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>

      {/* ── HEAD ── */}
      <group ref={headRef} position={[0, 1.72, 0]}>
        {/* Skull */}
        <mesh>
          <sphereGeometry args={[0.175, 16, 16]} />
          <meshStandardMaterial color={skinTone} roughness={0.85} />
        </mesh>

        {/* EYES — left */}
        <mesh position={[-0.07, 0.03, 0.15]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-0.07, 0.03, 0.168]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#1A1A2E" />
        </mesh>
        {/* EYES — right */}
        <mesh position={[0.07, 0.03, 0.15]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.07, 0.03, 0.168]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshStandardMaterial color="#1A1A2E" />
        </mesh>

        {/* NOSE */}
        <mesh position={[0, -0.02, 0.17]}>
          <sphereGeometry args={[0.022, 6, 6]} />
          <meshStandardMaterial color={skinTone} roughness={0.9} />
        </mesh>

        {/* MOUTH — simple thin box */}
        <mesh position={[0, -0.07, 0.165]}>
          <boxGeometry args={[0.06, 0.01, 0.01]} />
          <meshStandardMaterial color="#8B3A3A" />
        </mesh>

        {/* EARS */}
        <mesh position={[-0.175, 0.01, 0]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.9} />
        </mesh>
        <mesh position={[0.175, 0.01, 0]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color={skinTone} roughness={0.9} />
        </mesh>

        {/* HAIR */}
        {isFemale ? (
          <>
            {/* Top dome */}
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.182, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
              <meshStandardMaterial color={hairColor} roughness={0.8} />
            </mesh>
            {/* Long sides */}
            <mesh position={[-0.17, -0.08, -0.03]}>
              <boxGeometry args={[0.04, 0.28, 0.14]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            <mesh position={[0.17, -0.08, -0.03]}>
              <boxGeometry args={[0.04, 0.28, 0.14]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
            {/* Back ponytail */}
            <mesh position={[0, -0.14, -0.16]}>
              <cylinderGeometry args={[0.05, 0.03, 0.22, 6]} />
              <meshStandardMaterial color={hairColor} />
            </mesh>
          </>
        ) : (
          /* Male short hair */
          <mesh position={[0, 0.07, -0.01]}>
            <sphereGeometry args={[0.182, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.54]} />
            <meshStandardMaterial color={hairColor} roughness={0.7} />
          </mesh>
        )}
      </group>

      {/* ── NECK ── */}
      <mesh position={[0, 1.52, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.16, 8]} />
        <meshStandardMaterial color={skinTone} roughness={0.85} />
      </mesh>

      {/* ── TORSO ── */}
      <mesh ref={torsoRef} position={[0, 1.16, 0]}>
        <boxGeometry args={[sw, th, 0.22]} />
        <meshStandardMaterial color={shirtColor} roughness={0.9} />
      </mesh>

      {/* Collar line */}
      <mesh position={[0, 1.44, 0.1]}>
        <boxGeometry args={[0.18, 0.06, 0.02]} />
        <meshStandardMaterial color={skinTone} />
      </mesh>

      {/* ── HIPS ── */}
      <mesh position={[0, 0.77, 0]}>
        <boxGeometry args={[hw + 0.04, 0.28, 0.20]} />
        <meshStandardMaterial color={trousersColor} roughness={0.9} />
      </mesh>

      {/* ── LEFT ARM ── */}
      <group ref={lArmRef} position={[-(sw / 2 + 0.07), 1.27, 0]}>
        {/* Upper arm */}
        <mesh position={[0, -0.15, 0]}>
          <boxGeometry args={[0.10, 0.28, 0.10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.9} />
        </mesh>
        {/* Elbow */}
        <mesh position={[0, -0.31, 0]}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <meshStandardMaterial color={skinTone} />
        </mesh>
        {/* Forearm */}
        <group ref={lForeRef}>
          <mesh position={[0, -0.44, 0]}>
            <boxGeometry args={[0.09, 0.24, 0.09]} />
            <meshStandardMaterial color={skinTone} roughness={0.85} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.60, 0]}>
            <boxGeometry args={[0.10, 0.12, 0.055]} />
            <meshStandardMaterial color={skinTone} roughness={0.85} />
          </mesh>
          {/* Thumb */}
          <mesh position={[-0.06, -0.58, 0.02]}>
            <boxGeometry args={[0.04, 0.07, 0.04]} />
            <meshStandardMaterial color={skinTone} />
          </mesh>
        </group>
      </group>

      {/* ── RIGHT ARM ── */}
      <group ref={pressArmRef}>
        <group ref={rArmRef} position={[(sw / 2 + 0.07), 1.27, 0]}>
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[0.10, 0.28, 0.10]} />
            <meshStandardMaterial color={shirtColor} roughness={0.9} />
          </mesh>
          <mesh position={[0, -0.31, 0]}>
            <sphereGeometry args={[0.055, 8, 8]} />
            <meshStandardMaterial color={skinTone} />
          </mesh>
          <group ref={rForeRef}>
            <mesh position={[0, -0.44, 0]}>
              <boxGeometry args={[0.09, 0.24, 0.09]} />
              <meshStandardMaterial color={skinTone} roughness={0.85} />
            </mesh>
            <mesh position={[0, -0.60, 0]}>
              <boxGeometry args={[0.10, 0.12, 0.055]} />
              <meshStandardMaterial color={skinTone} roughness={0.85} />
            </mesh>
            <mesh position={[0.06, -0.58, 0.02]}>
              <boxGeometry args={[0.04, 0.07, 0.04]} />
              <meshStandardMaterial color={skinTone} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ── LEFT LEG ── */}
      <group ref={lLegRef} position={[-0.11, 0.62, 0]}>
        <mesh position={[0, -0.20, 0]}>
          <boxGeometry args={[0.13, 0.40, 0.13]} />
          <meshStandardMaterial color={trousersColor} roughness={0.9} />
        </mesh>
        {/* Knee */}
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={trousersColor} />
        </mesh>
        {/* Lower leg */}
        <mesh position={[0, -0.56, 0]}>
          <boxGeometry args={[0.11, 0.30, 0.12]} />
          <meshStandardMaterial color={trousersColor} roughness={0.9} />
        </mesh>
        {/* Shoe */}
        <mesh position={[0, -0.73, 0.035]}>
          <boxGeometry args={[0.12, 0.075, 0.19]} />
          <meshStandardMaterial color={shoeColor} roughness={0.6} metalness={0.1} />
        </mesh>
      </group>

      {/* ── RIGHT LEG ── */}
      <group ref={rLegRef} position={[0.11, 0.62, 0]}>
        <mesh position={[0, -0.20, 0]}>
          <boxGeometry args={[0.13, 0.40, 0.13]} />
          <meshStandardMaterial color={trousersColor} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color={trousersColor} />
        </mesh>
        <mesh position={[0, -0.56, 0]}>
          <boxGeometry args={[0.11, 0.30, 0.12]} />
          <meshStandardMaterial color={trousersColor} roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.73, 0.035]}>
          <boxGeometry args={[0.12, 0.075, 0.19]} />
          <meshStandardMaterial color={shoeColor} roughness={0.6} metalness={0.1} />
        </mesh>
      </group>

    </group>
  );
}
