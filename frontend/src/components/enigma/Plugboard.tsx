import React from "react";
import { motion } from "framer-motion";

interface PlugboardProps {
  connections: [string, string][];
  onConnectionsChange: (connections: [string, string][]) => void;
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Helper to get the index of a letter
const getIndex = (letter: string) => ALPHABET.indexOf(letter);

export const Plugboard: React.FC<PlugboardProps> = ({ connections, onConnectionsChange }) => {
  // Map of letter to its connected pair
  const connectionMap: Record<string, string | null> = {};
  ALPHABET.forEach(l => (connectionMap[l] = null));
  connections.forEach(([a, b]) => {
    connectionMap[a] = b;
    connectionMap[b] = a;
  });

  // Handle click on a socket
  const [pending, setPending] = React.useState<string | null>(null);
  const handleSocketClick = (letter: string) => {
    if (pending === null) {
      if (connectionMap[letter]) {
        // Remove connection
        onConnectionsChange(connections.filter(([a, b]) => a !== letter && b !== letter));
      } else {
        setPending(letter);
      }
    } else if (pending === letter) {
      setPending(null);
    } else {
      if (!connectionMap[letter]) {
        // Add connection
        onConnectionsChange([...connections, [pending, letter]]);
        setPending(null);
      }
    }
  };

  // Layout: 13 sockets per row
  const rowY = [30, 80];
  const socketX = (i: number) => 30 + (i % 13) * 38;

  return (
    <div className="flex flex-col items-center">
      <svg width={520} height={110}>
        <defs>
          <radialGradient id="plugGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe066" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffe066" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Draw connection lines */}
        {connections.map(([a, b], idx) => {
          const ia = getIndex(a);
          const ib = getIndex(b);
          const xa = socketX(ia);
          const ya = rowY[ia < 13 ? 0 : 1];
          const xb = socketX(ib);
          const yb = rowY[ib < 13 ? 0 : 1];
          return (
            <motion.line
              key={a + b}
              x1={xa}
              y1={ya}
              x2={xb}
              y2={yb}
              stroke="#ffe066"
              strokeWidth={4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ filter: 'drop-shadow(0 0 8px #ffe066)' }}
            />
          );
        })}
        {/* Draw sockets */}
        {ALPHABET.map((letter, i) => {
          const x = socketX(i);
          const y = rowY[i < 13 ? 0 : 1];
          const isConnected = !!connectionMap[letter];
          const isPending = pending === letter;
          return (
            <g key={letter} onClick={() => handleSocketClick(letter)} style={{ cursor: 'pointer' }}>
              {isConnected && (
                <circle
                  cx={x}
                  cy={y}
                  r={18}
                  fill="url(#plugGlow)"
                  style={{ filter: 'blur(2px)' }}
                />
              )}
              {isPending && (
                <circle
                  cx={x}
                  cy={y}
                  r={18}
                  fill="#ffe066"
                  opacity={0.3}
                />
              )}
              <circle
                cx={x}
                cy={y}
                r={16}
                fill="#222"
                stroke="#888"
                strokeWidth={3}
                style={{ filter: isConnected ? 'drop-shadow(0 0 8px #ffe066)' : 'none' }}
              />
              <text
                x={x}
                y={y + 6}
                textAnchor="middle"
                fontFamily="'Share Tech Mono', 'IBM Plex Mono', monospace"
                fontSize={18}
                fill={isConnected ? '#ffe066' : '#eee'}
                style={{
                  fontWeight: isConnected ? 700 : 400,
                  textShadow: isConnected ? '0 0 8px #ffe066, 0 0 2px #fff' : '0 0 2px #222',
                  transition: 'fill 0.2s',
                }}
              >
                {letter}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 text-sm text-gray-400">Klicke auf zwei Buchstaben, um zu verbinden. Klicke auf einen verbundenen Buchstaben, um die Verbindung zu lösen.</div>
    </div>
  );
}; 