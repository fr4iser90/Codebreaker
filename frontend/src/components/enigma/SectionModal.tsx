import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnigmaSimulator } from './EnigmaSimulator';
import { enigmaApi } from '@/lib/api/enigma';

// Define interfaces for better type safety
interface RotorSettingData {
  name: string;
  position: number | null;
  ring_setting: number | null;
}

interface PublicSettingsData {
  rotors: RotorSettingData[];
  reflector: string | null;
  plugboard: Record<string, string>;
}

interface ChallengeData {
  id: number;
  ciphertext: string;
  info: string;
  solution: string;
  settings: any; // Full solution settings from backend (not strictly typed here as we focus on public)
  settings_public?: PublicSettingsData; // Public settings from API
}

interface SectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolved: () => void;
  title: string;
  challengeId?: number;
}

export const SectionModal: React.FC<SectionModalProps> = ({
  isOpen,
  onClose,
  onSolved,
  title,
  challengeId,
}) => {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [userInput, setUserInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  // const [showSettings, setShowSettings] = useState(false); // Removed
  const [userSettings, setUserSettings] = useState<PublicSettingsData | null>(null);

  useEffect(() => {
    if (isOpen && challengeId) {
      enigmaApi.getChallengeById(challengeId).then(data => setChallenge(data as ChallengeData));
    } else if (isOpen) {
      enigmaApi.getChallenge().then(data => setChallenge(data as ChallengeData));
    }
  }, [isOpen, challengeId]);

  useEffect(() => {
    if (challenge?.settings_public) {
      setUserSettings(challenge.settings_public);
    }
  }, [challenge]);

  const handleCheck = () => {
    if (!challenge) return;
    if (userInput.trim().toUpperCase() === (challenge.solution || 'HELLO')) {
      setSolved(true);
      setError(null);
      onSolved();
    } else {
      setError('Try again! Look for clues in the text...');
    }
  };

  const handleClose = () => {
    setUserInput('');
    setSolved(false);
    setError(null);
    // setShowSettings(false); // Removed
    onClose();
  };

  // Removed handleSettingChange, renderRotorSettings, and renderReflectorSettings
  // as the interactive configuration is now handled by EnigmaSimulator itself.

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`flex flex-col md:flex-row gap-6 w-full max-w-6xl items-stretch justify-center p-4 md:p-0`}>
            {/* Challenge Modal Content */}
            <motion.div
              className={`bg-gray-900 rounded-lg shadow-lg p-6 md:p-8 w-full ${showSimulator ? 'md:w-1/2' : 'md:max-w-xl'} relative flex flex-col`}
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={handleClose}
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">{title}</h2>
              <div className="mb-4 text-gray-200 whitespace-pre-line overflow-y-auto max-h-[200px] md:max-h-[300px]">
                {challenge ? challenge.info : 'Loading...'}
              </div>
              
              {challenge && (
                <div className="mb-4 p-4 bg-gray-800 rounded">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">Enigma Challenge Details</h3>
                  <b>Encrypted Message:</b> <span className="font-mono text-yellow-200">{challenge.ciphertext}</span><br/>
                  
                  {challenge.settings_public && (
                    <div className="mt-2 pt-2 text-sm">
                      <h4 className="text-md font-semibold text-yellow-300 mb-1">Public Settings:</h4>
                      <div className="ml-2">
                        <b>Rotors:</b>
                        <div className="flex flex-col gap-1 mt-1 mb-1 text-xs">
                          {challenge.settings_public.rotors.map((r, idx) => (
                            <div key={`public-rotor-display-${idx}`} className="flex items-center gap-2">
                              <span className="font-mono text-yellow-200">
                                {r.name} (Pos: {r.position !== null ? String.fromCharCode(65 + r.position) : '?'}, Ring: {r.ring_setting !== null ? String.fromCharCode(65 + r.ring_setting) : '?'})
                              </span>
                            </div>
                          ))}
                        </div>
                        <b>Reflector:</b> <span className="font-mono text-yellow-200">{challenge.settings_public.reflector || '?'}</span><br/>
                        <b>Plugboard:</b> <span className="font-mono text-yellow-200">
                          {Object.entries(challenge.settings_public.plugboard || {}).length > 0
                            ? Object.entries(challenge.settings_public.plugboard).map(([a, b]) => `${a}-${b}`).join(', ')
                            : 'None'}
                        </span>
                      </div>
                    </div>
                  )}
                  <br/>
                  Use the "Open Enigma Simulator" button to try and decrypt the message with these settings.
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Decrypt the secret:
                </label>
                <input
                  type="text"
                  value={userInput}
                  onChange={e => setUserInput(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your solution..."
                  disabled={solved}
                />
                {error && <div className="text-red-400 mt-2">{error}</div>}
              </div>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded font-bold hover:bg-blue-400 transition mr-2"
                onClick={() => setShowSimulator(true)}
                disabled={showSimulator}
              >
                Open Enigma Simulator
              </button>
              {solved ? (
                <div className="text-green-400 font-semibold mb-4">Correct! You've solved the secret 🎉</div>
              ) : (
                <button
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-bold hover:yellow-300 transition"
                  onClick={handleCheck}
                >
                  Check
                </button>
              )}
              {solved && (
                <button
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 transition"
                  onClick={handleClose}
                >
                  Continue
                </button>
              )}
            </motion.div>
            {/* Simulator Side-by-Side */}
            {showSimulator && (
              <motion.div
                className="bg-gray-900 rounded-lg shadow-lg p-4 w-full md:w-1/2 flex flex-col relative"
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
              >
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  onClick={() => setShowSimulator(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <EnigmaSimulator initialSettings={userSettings} />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
