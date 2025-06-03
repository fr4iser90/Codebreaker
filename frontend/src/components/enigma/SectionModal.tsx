import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnigmaSimulator } from './EnigmaSimulator';
import { enigmaApi } from '@/lib/api/enigma';

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
  const [challenge, setChallenge] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);

  useEffect(() => {
    if (isOpen && challengeId) {
      enigmaApi.getChallengeById(challengeId).then(setChallenge);
    } else if (isOpen) {
      enigmaApi.getChallenge().then(setChallenge);
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
    setShowSettings(false);
    onClose();
  };

  const handleSettingChange = (type: string, index: number | null, value: any) => {
    if (!userSettings) return;

    const newSettings = { ...userSettings };
    if (type === 'rotor') {
      if (index !== null) {
        newSettings.rotors[index] = { ...newSettings.rotors[index], ...value };
      }
    } else if (type === 'reflector') {
      newSettings.reflector = value;
    } else if (type === 'plugboard') {
      newSettings.plugboard = value;
    }
    setUserSettings(newSettings);
  };

  const renderRotorSettings = () => {
    if (!userSettings) return null;

    return (
      <div className="flex flex-col gap-2">
        {userSettings.rotors.map((rotor: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="font-mono text-yellow-300">{rotor.name}</span>
            <select
              className="bg-gray-800 text-white px-2 py-1 rounded"
              value={rotor.position === null ? '' : String.fromCharCode(65 + rotor.position)}
              onChange={(e) => handleSettingChange('rotor', idx, { position: e.target.value ? e.target.value.charCodeAt(0) - 65 : null })}
              disabled={rotor.position !== null}
            >
              <option value="">Select position</option>
              {Array.from({ length: 26 }, (_, i) => (
                <option key={i} value={String.fromCharCode(65 + i)}>
                  {String.fromCharCode(65 + i)}
                </option>
              ))}
            </select>
            <select
              className="bg-gray-800 text-white px-2 py-1 rounded"
              value={rotor.ring_setting === null ? '' : String.fromCharCode(65 + rotor.ring_setting)}
              onChange={(e) => handleSettingChange('rotor', idx, { ring_setting: e.target.value ? e.target.value.charCodeAt(0) - 65 : null })}
              disabled={rotor.ring_setting !== null}
            >
              <option value="">Select ring</option>
              {Array.from({ length: 26 }, (_, i) => (
                <option key={i} value={String.fromCharCode(65 + i)}>
                  {String.fromCharCode(65 + i)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    );
  };

  const renderReflectorSettings = () => {
    if (!userSettings) return null;

    return (
      <select
        className="bg-gray-800 text-white px-2 py-1 rounded"
        value={userSettings.reflector || ''}
        onChange={(e) => handleSettingChange('reflector', null, e.target.value || null)}
        disabled={userSettings.reflector !== null}
      >
        <option value="">Select reflector</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
      </select>
    );
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
                aria-label="Close"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-4 text-yellow-400">{title}</h2>
              <div className="mb-4 text-gray-200 whitespace-pre-line">
                {challenge ? challenge.info : 'Loading...'}
              </div>
              {challenge && (
                <div className="mb-4 p-4 bg-gray-800 rounded">
                  <b>Enigma Challenge:</b><br/>
                  <b>Encrypted Message:</b> {challenge.ciphertext}<br/>
                  {showSettings ? (
                    <>
                      <b>Enigma Settings:</b><br/>
                      <div className="mt-2">
                        <b>Rotors:</b>
                        {renderRotorSettings()}
                      </div>
                      <div className="mt-2">
                        <b>Reflector:</b>
                        {renderReflectorSettings()}
                      </div>
                      <div className="mt-2">
                        <b>Plugboard:</b>
                        <div className="text-sm text-gray-400">
                          {Object.entries(userSettings?.plugboard || {}).length > 0
                            ? Object.entries(userSettings.plugboard).map(([a, b]) => `${a}-${b}`).join(', ')
                            : 'No plugboard connections'}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      className="text-yellow-400 hover:text-yellow-300 mt-2"
                      onClick={() => setShowSettings(true)}
                    >
                      Configure Enigma Settings
                    </button>
                  )}
                  <br/>
                  Decrypt the message with the simulator and enter the result below!
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
                className="bg-gray-900 rounded-lg shadow-lg p-4 w-full max-w-2xl flex flex-col relative"
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
