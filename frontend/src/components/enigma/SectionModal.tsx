import React, { useState, useEffect, useRef } from 'react';
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
  sources?: Record<string, { name: string; url: string; description: string }[]>;
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
  const [showClue, setShowClue] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userSettings, setUserSettings] = useState<PublicSettingsData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && challengeId) {
      enigmaApi.getChallengeById(challengeId).then(data => {
        setChallenge(data as ChallengeData);
      });
    } else if (isOpen) {
      enigmaApi.getChallenge().then(data => {
        setChallenge(data as ChallengeData);
      });
    }
  }, [isOpen, challengeId]);

  useEffect(() => {
    if (challenge?.settings_public) {
      setUserSettings(challenge.settings_public);
    }
  }, [challenge]);

  // Reset states when modal closes or challenge changes
  useEffect(() => {
    setUserInput('');
    setSolved(false);
    setError(null);
    setShowSimulator(false);
    setShowClue(false);
    setShowSources(false);
    setShowDetails(false);
  }, [challengeId, isOpen]);

  // Funktion, um userInput von außen zu setzen und Fokus zu setzen
  const setUserInputFromSimulator = (text: string) => {
    setUserInput(text);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Robuster Vergleich: Satzzeichen/Whitespace ignorieren, alles Uppercase
  function normalize(str: string) {
    return str.replace(/[^A-Z]/gi, '').toUpperCase();
  }

  const handleCheck = async () => {
    if (!challenge || typeof challenge.id !== 'number') {
      setError('Challenge not loaded correctly. Please close and reopen the modal.');
      return;
    }
    setError(null);
    try {
      const res = await enigmaApi.validateSolution(challenge.id, userInput);
      if (res.correct) {
        setSolved(true);
        setError(null);
        onSolved();
      } else {
        setError('Try again! Look for clues in the text...');
      }
    } catch (e) {
      setError('Fehler bei der Validierung. Bitte versuche es erneut.');
    }
  };

  const handleClose = () => {
    setUserInput('');
    setSolved(false);
    setError(null);
    onClose();
  };

  // Extract clue from info text
  const getClue = (info: string) => {
    const clueMatch = info.match(/Clue: (.*)\n/);
    return clueMatch ? clueMatch[1] : null;
  };

  // Get info text without the clue
  const getInfoWithoutClue = (info: string) => {
    return info.replace(/Clue:.*\n/, '');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col md:flex-row items-stretch justify-stretch bg-black bg-opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Challenge Modal Content */}
          <motion.div
            className={`flex-1 h-full w-full overflow-auto p-6 md:p-12 bg-gray-900 relative flex flex-col md:basis-1/2`}
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
            <div className="mb-4 text-gray-200 whitespace-pre-line overflow-y-auto max-h-[30vh] md:max-h-[40vh]">
              {challenge ? getInfoWithoutClue(challenge.info) : 'Loading...'}
            </div>
            {challenge && getClue(challenge.info) && (
              <div className="mb-4">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded font-bold hover:bg-purple-500 transition"
                  onClick={() => setShowClue(!showClue)}
                >
                  {showClue ? 'Hide Clue' : 'Show Clue'}
                </button>
                {showClue && (
                  <div className="mt-2 p-3 bg-purple-900 bg-opacity-50 rounded border border-purple-500">
                    <span className="font-bold text-purple-300">Clue: </span>
                    <span className="text-purple-200">{getClue(challenge.info)}</span>
                  </div>
                )}
              </div>
            )}

            {challenge && (
              <div className="mb-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <span className="mr-2">
                    {showDetails ? '▼' : '▶'}
                  </span>
                  Enigma Challenge Details
                </button>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 bg-gray-800 rounded">
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Sources Display */}
            {challenge?.sources && (
              <div className="mb-4">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <span className="mr-2">
                    {showSources ? '▼' : '▶'}
                  </span>
                  Sources
                </button>
                <AnimatePresence>
                  {showSources && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 bg-gray-800 rounded">
                        {Object.entries(challenge.sources).map(([category, sources]) => {
                          if (category === 'description') return null;
                          return (
                            <div key={category} className="mb-2">
                              <h4 className="text-md font-semibold text-yellow-300 mb-1 capitalize">{category.replace('_', ' ')}:</h4>
                              <div className="ml-2">
                                {Array.isArray(sources) && sources.map((source, idx) => (
                                  <div key={`${category}-source-${idx}`} className="mb-1">
                                    <a 
                                      href={source.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300"
                                    >
                                      {source.name}
                                    </a>
                                    <p className="text-gray-400 text-xs mt-1">{source.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                ref={inputRef}
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
              className="flex-1 h-full w-full md:basis-1/2 overflow-auto p-6 md:p-12 bg-gray-900 relative flex flex-col border-l border-gray-800"
              initial={{ scale: 0.95, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 40 }}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowSimulator(false)}
                aria-label="Close"
              >
                ×
              </button>
              <EnigmaSimulator initialSettings={userSettings} ciphertext={challenge?.ciphertext || null} onCopyOutputToModal={setUserInputFromSimulator} />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
