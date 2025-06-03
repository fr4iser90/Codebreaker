import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnigmaSimulator } from './EnigmaSimulator';
import { enigmaApi } from '@/lib/api/enigma';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolved: () => void;
  title: string;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  onClose,
  onSolved,
  title,
}) => {
  const [challenge, setChallenge] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    if (isOpen) {
      enigmaApi.getChallenge().then(setChallenge);
    }
  }, [isOpen]);

  const handleCheck = () => {
    if (!challenge) return;
    // Hier: Demo-Check, in echt: POST an /challenge/validate
    if (userInput.trim().toUpperCase() === (challenge.solution || 'HELLO')) {
      setSolved(true);
      setError(null);
      onSolved();
    } else {
      setError('Das ist leider nicht korrekt. Versuche es nochmal!');
    }
  };

  const handleClose = () => {
    setUserInput('');
    setSolved(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`flex flex-row gap-6 w-full max-w-6xl items-stretch justify-center`}>
            {/* Challenge Modal Content */}
            <motion.div
              className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-xl relative flex flex-col"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={handleClose}
                aria-label="Schließen"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">{title}</h2>
              <div className="mb-4 text-gray-200 whitespace-pre-line">
                {challenge ? challenge.info : 'Lade Informationen...'}
              </div>
              {challenge && (
                <div className="mb-4 p-4 bg-gray-800 rounded">
                  <b>Enigma-Challenge:</b><br/>
                  <b>Verschlüsselte Nachricht:</b> {challenge.ciphertext}<br/>
                  <b>Enigma-Einstellungen:</b><br/>
                  Rotoren: {challenge.settings.rotors.map((r: any) => r.name).join('-')}<br/>
                  Position: {challenge.settings.rotors.map((r: any) => String.fromCharCode(65 + r.position)).join('-')}<br/>
                  Ringstellung: {challenge.settings.rotors.map((r: any) => String.fromCharCode(65 + r.ring_setting)).join('-')}<br/>
                  Plugboard: {Object.entries(challenge.settings.plugboard).map(([a, b]) => `${a}-${b}`).join(', ')}<br/>
                  <br/>
                  Entschlüssle die Nachricht mit dem Simulator und gib das Ergebnis unten ein!
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Entschlüssle das Secret dieser Section:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400"
                  placeholder="Dein Ergebnis hier..."
                  disabled={solved}
                />
                {error && <div className="text-red-400 mt-2">{error}</div>}
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-400 transition mr-2"
                onClick={() => setShowSimulator(true)}
                disabled={showSimulator}
              >
                Enigma-Simulator öffnen
              </button>
              {solved ? (
                <div className="text-green-400 font-semibold mb-4">Richtig! Du hast das Secret gelöst 🎉</div>
              ) : (
                <button
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-bold hover:bg-yellow-300 transition"
                  onClick={handleCheck}
                >
                  Prüfen
                </button>
              )}
              {solved && (
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition"
                  onClick={handleClose}
                >
                  Weiter
                </button>
              )}
            </motion.div>
            {/* Simulator Side-by-Side */}
            {showSimulator && (
              <motion.div
                className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-2xl flex flex-col relative"
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
              >
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={() => setShowSimulator(false)}
                  aria-label="Schließen"
                >
                  ×
                </button>
                <EnigmaSimulator />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
