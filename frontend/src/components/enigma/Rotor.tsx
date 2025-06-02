import React, { useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface RotorProps {
  letters: string[];
  position: number;
  label: string;
  onRotate: (newPosition: number) => void;
}

const ROTOR_RADIUS = 60;
const LETTER_RADIUS = 48;
const CENTER = 70;
const NUM_LETTERS = 26;
const PIXELS_PER_STEP = 30;

export const Rotor: React.FC<RotorProps> = ({ letters, position, label, onRotate }) => {
  const [dragStartPosition, setDragStartPosition] = useState<number | null>(null);
  const [dragRotation, setDragRotation] = useState(0);
  const dragY = useMotionValue(0);

  // Calculate the total rotation: base + drag
  const baseRotation = -position * (360 / NUM_LETTERS);
  const totalRotation = baseRotation + dragRotation;

  const handleDragStart = () => {
    setDragStartPosition(position);
  };

  const handleDrag = (event: any, info: any) => {
    // Calculate how many steps (letters) the user has dragged
    const steps = Math.round(info.offset.y / PIXELS_PER_STEP);
    setDragRotation(steps * (360 / NUM_LETTERS));
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

  return (
    <div className="flex flex-col items-center select-none">
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
            // Berechne, welcher Buchstabe oben ist
            const letterIndex = (i - position + NUM_LETTERS) % NUM_LETTERS;
            const angleDeg = (360 / NUM_LETTERS) * i;
            const angleRad = (2 * Math.PI / NUM_LETTERS) * i - Math.PI / 2;
            const x = CENTER;
            const y = CENTER - LETTER_RADIUS;
            const isActive = letterIndex === 0; // Der Buchstabe oben
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
          {label}
        </text>
      </motion.svg>
      <div className="mt-2 text-sm text-gray-400 select-none">Ziehen zum Drehen</div>
    </div>
  );
}; 