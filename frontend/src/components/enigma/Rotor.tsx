import React, { useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface RotorProps {
  letters: string[];
  position: number;
  ringSetting: number;
  label: string;
  onRotate: (newPosition: number) => void;
  onRingSettingChange: (newRingSetting: number) => void;
}

const ROTOR_RADIUS = 60;
const LETTER_RADIUS = 48;
const CENTER = 70;
const NUM_LETTERS = 26;
const PIXELS_PER_STEP = 30;

export const Rotor: React.FC<RotorProps> = ({ letters, position, ringSetting, label, onRotate, onRingSettingChange }) => {
  const [dragStartPosition, setDragStartPosition] = useState<number | null>(null);
  const [dragRotation, setDragRotation] = useState(0);
  const dragY = useMotionValue(0);

  // Calculate the total rotation: base + drag
  const baseRotation = -position * (360 / NUM_LETTERS);
  const totalRotation = baseRotation + dragRotation;

  // Ring Setting logic
  const [dragStartRing, setDragStartRing] = useState<number | null>(null);
  const [dragRingRotation, setDragRingRotation] = useState(0);
  const baseRingRotation = -ringSetting * (360 / NUM_LETTERS);
  const totalRingRotation = baseRingRotation + dragRingRotation;

  const handleDragStart = () => {
    setDragStartPosition(position);
  };

  const handleDrag = (event: any, info: any) => {
    // Calculate how many steps (letters) the user has dragged
    const steps = Math.round(info.offset.y / PIXELS_PER_STEP);
    setDragRotation(-steps * (360 / NUM_LETTERS)); // Vorzeichen geändert
  };

  const handleDragEnd = (event: any, info: any) => {
    // Calculate new position
    const steps = Math.round(info.offset.y / PIXELS_PER_STEP);
    let newPosition = ((dragStartPosition ?? position) + steps) % NUM_LETTERS;
    if (newPosition < 0) newPosition += NUM_LETTERS;
    setDragRotation(0);
    setDragStartPosition(null);
    onRotate(newPosition);
    dragY.set(0);
  };

  const handleRingDragStart = () => {
    setDragStartRing(ringSetting);
  };
  const handleRingDrag = (event: any, info: any) => {
    const steps = Math.round(info.offset.y / PIXELS_PER_STEP);
    setDragRingRotation(-steps * (360 / NUM_LETTERS));
  };
  const handleRingDragEnd = (event: any, info: any) => {
    const steps = Math.round(info.offset.y / PIXELS_PER_STEP);
    let newRing = ((dragStartRing ?? ringSetting) + steps) % NUM_LETTERS;
    if (newRing < 0) newRing += NUM_LETTERS;
    setDragRingRotation(0);
    setDragStartRing(null);
    onRingSettingChange(newRing);
  };

  // const topIndex = (NUM_LETTERS - position) % NUM_LETTERS; // Diese Logik ist nicht mehr nötig, da isActive direkt auf position basiert

  return (
    <div className="flex flex-col items-center select-none">
      {/* Pfeil bei 12 Uhr */}
      <div style={{ height: 18, marginBottom: -6 }}>
        <svg width="28" height="18" style={{ display: 'block', margin: '0 auto' }}>
          {/* Pfeilspitze unten, Basis oben */}
          <polygon points="14,16 24,2 4,2" fill="#ffe066" stroke="#bfa600" strokeWidth="1.5" />
        </svg>
      </div>
      <motion.svg
        width={140}
        height={140}
        style={{ filter: "drop-shadow(0 0 8px #222)", rotate: totalRotation }}
        className="cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        transition={{ type: "spring", stiffness: 999, damping: 60 }}
      >
        {/* Rotor body */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ROTOR_RADIUS}
          fill="url(#metal)"
          stroke="#888"
          strokeWidth={4}
        />
        {/* Glow for current position (top) */}
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="metal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#444" />
            <stop offset="100%" stopColor="#222" />
          </radialGradient>
        </defs>
        {/* Rotating group of letters */}
        <g>
          {letters.map((letter, i) => {
            const angleDeg = (360 / NUM_LETTERS) * i;
            const x = CENTER;
            const y = CENTER - LETTER_RADIUS;
            const isActive = i === position; // Der Buchstabe am Index 'position' ist oben
            return (
              <g key={i} style={{ userSelect: 'none' }} transform={`rotate(${angleDeg}, ${CENTER}, ${CENTER})`}>
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={16}
                    fill="url(#glow)"
                    style={{ filter: "blur(2px)" }}
                    pointerEvents="none"
                  />
                )}
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontFamily="'Share Tech Mono', 'IBM Plex Mono', monospace"
                  fontSize={isActive ? 22 : 18}
                  fill={isActive ? "#ffe066" : "#eee"}
                  style={{
                    fontWeight: isActive ? 700 : 400,
                    textShadow: isActive
                      ? "0 0 8px #ffe066, 0 0 2px #fff"
                      : "0 0 2px #222",
                    transition: "font-size 0.2s, fill 0.2s",
                    userSelect: 'none',
                  }}
                  pointerEvents="none"
                >
                  {letter}
                </text>
              </g>
            );
          })}
        </g>
        {/* Rotor label */}
        <text
          x={CENTER}
          y={CENTER + ROTOR_RADIUS + 18}
          textAnchor="middle"
          fontFamily="'Share Tech Mono', 'IBM Plex Mono', monospace"
          fontSize={18}
          fill="#ffe066"
          style={{ letterSpacing: 2, textShadow: "0 0 8px #ffe066", userSelect: 'none' }}
        >
        </text>
      </motion.svg>
      {/* Ring Setting SVG below the main rotor */}
      <motion.svg
        width={100}
        height={100}
        style={{ marginTop: -30, rotate: totalRingRotation }}
        className="cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0}
        onDragStart={handleRingDragStart}
        onDrag={handleRingDrag}
        onDragEnd={handleRingDragEnd}
        transition={{ type: "spring", stiffness: 999, damping: 60 }}
      >
        <circle
          cx={50}
          cy={50}
          r={38}
          fill="#222"
          stroke="#ffe066"
          strokeWidth={2}
        />
        {letters.map((letter, i) => {
          const angleDeg = (360 / NUM_LETTERS) * i;
          const x = 50;
          const y = 50 - 32;
          const isActive = i === ringSetting;
          return (
            <g key={i} style={{ userSelect: 'none' }} transform={`rotate(${angleDeg}, 50, 50)`}>
              {isActive && (
                <circle
                  cx={x}
                  cy={y}
                  r={10}
                  fill="#ffe066"
                  opacity={0.3}
                  pointerEvents="none"
                />
              )}
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontFamily="'Share Tech Mono', 'IBM Plex Mono', monospace"
                fontSize={isActive ? 16 : 13}
                fill={isActive ? "#ffe066" : "#bbb"}
                style={{ fontWeight: isActive ? 700 : 400, userSelect: 'none' }}
                pointerEvents="none"
              >
                {letter}
              </text>
            </g>
          );
        })}
      </motion.svg>
      <div className="text-xs text-gray-400 select-none mb-1">Ringstellung: {letters[ringSetting]}</div>
      {label}
      <div className="mt-2 text-sm text-gray-400 select-none">Ziehen zum Drehen</div>
    </div>
  );
};
