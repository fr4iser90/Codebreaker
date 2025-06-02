import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LampboardProps {
  activeLetter?: string;
  highlightColor?: string;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const Lampboard: React.FC<LampboardProps> = ({ activeLetter, highlightColor = '#ffe066' }) => {
  return (
    <div className="flex flex-col items-center">
      <svg width={520} height={90}>
        <defs>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={highlightColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={highlightColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* First row: 13 lamps */}
        {ALPHABET.slice(0, 13).map((letter, i) => {
          const isActive = activeLetter === letter;
          const x = 30 + i * 38;
          const y = 30;
          return (
            <g key={letter}>
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={18}
                    fill="url(#lampGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <circle
                cx={x}
                cy={y}
                r={16}
                fill="#222"
                stroke="#888"
                strokeWidth={3}
                style={{ filter: isActive ? 'drop-shadow(0 0 8px #ffe066)' : 'none' }}
              />
              <text
                x={x}
                y={y + 6}
                textAnchor="middle"
                fontFamily="'Share Tech Mono', 'IBM Plex Mono', monospace"
                fontSize={18}
                fill={isActive ? highlightColor : '#eee'}
                style={{
                  fontWeight: isActive ? 700 : 400,
                  textShadow: isActive ? '0 0 8px #ffe066, 0 0 2px #fff' : '0 0 2px #222',
                  transition: 'fill 0.2s',
                }}
              >
                {letter}
              </text>
            </g>
          );
        })}
        {/* Second row: 13 lamps */}
        {ALPHABET.slice(13).map((letter, i) => {
          const isActive = activeLetter === letter;
          const x = 30 + i * 38;
          const y = 70;
          return (
            <g key={letter}>
              <AnimatePresence>
                {isActive && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={18}
                    fill="url(#lampGlow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>
              <circle
                cx={x}
                cy={y}
                r={16}
                fill="#222"
                stroke="#888"
                strokeWidth={3}
                style={{ filter: isActive ? 'drop-shadow(0 0 8px #ffe066)' : 'none' }}
              />
              <text
                x={x}
                y={y + 6}
                textAnchor="middle"
                fontFamily="'Share Tech Mono', 'IBM Plex Mono', monospace"
                fontSize={18}
                fill={isActive ? highlightColor : '#eee'}
                style={{
                  fontWeight: isActive ? 700 : 400,
                  textShadow: isActive ? '0 0 8px #ffe066, 0 0 2px #fff' : '0 0 2px #222',
                  transition: 'fill 0.2s',
                }}
              >
                {letter}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}; 