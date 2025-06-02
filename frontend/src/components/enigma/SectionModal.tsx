import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  secret: string; // The expected decrypted message
  infoText: string;
  onSolved: () => void;
  title: string;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  onClose,
  secret,
  infoText,
  onSolved,
  title,
}) => {
  const [userInput, setUserInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = () => {
    if (userInput.trim().toUpperCase() === secret.toUpperCase()) {
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
          <motion.div
            className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-lg w-full relative"
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
            <div className="mb-4 text-gray-200">{infoText}</div>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 