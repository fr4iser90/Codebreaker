import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rotor } from './Rotor';
import { Plugboard } from './Plugboard';
import { Lampboard } from './Lampboard';
import { enigmaApi } from '@/lib/api/enigma';
import { soundManager } from '@/lib/sounds';
import { useSearchParams } from 'next/navigation';

// Interfaces for initial settings (mirroring SectionModal for consistency)
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

interface EnigmaSimulatorProps {
  initialSettings?: PublicSettingsData | null;
}

const ROTOR_TYPES = {
  I: { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  II: { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  III: { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' },
  IV: { wiring: 'ESOVPZJAYQUIRHXLNFTGKDCMWB', notch: 'J' },
  V: { wiring: 'VZBRGITYUPSDNHLXAWMJQOFECK', notch: 'Z' },
};

const REFLECTOR_TYPES = {
  'B': 'YRUHQSLDPXNGOKMIEBFZCWVJAT',
  'C': 'FVPJIAOYEDRZXWGCTKUQSBNMHL',
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const EnigmaSimulator: React.FC<EnigmaSimulatorProps> = ({ initialSettings }) => {
  const searchParams = useSearchParams();
  const [rotors, setRotors] = useState([
    { type: 'I', position: 0, ringSetting: 0 }, // Default initial state
    { type: 'II', position: 0, ringSetting: 0 },
    { type: 'III', position: 0, ringSetting: 0 },
  ]);
  const [reflector, setReflector] = useState('B'); // Default initial state
  const [plugboardConnections, setPlugboardConnections] = useState<[string, string][]>([]); // Default initial state
  const [inputMessage, setInputMessage] = useState('');
  const [outputMessage, setOutputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initializedFromQuery, setInitializedFromQuery] = useState(false); // For query params
  const [initializedFromProps, setInitializedFromProps] = useState(false); // For initialSettings prop

  // Effect to initialize from initialSettings prop
  useEffect(() => {
    if (initialSettings && !initializedFromProps && !initializedFromQuery) {
      const newRotors = initialSettings.rotors.map(r => ({
        type: r.name,
        // Ensure position and ringSetting are numbers, default to 0 if null
        position: r.position !== null ? r.position : 0,
        ringSetting: r.ring_setting !== null ? r.ring_setting : 0,
      }));
      // Validate if newRotors has 3 elements, otherwise keep default or handle error
      if (newRotors.length === 3) {
        setRotors(newRotors);
      }

      if (initialSettings.reflector) {
        setReflector(initialSettings.reflector);
      }

      if (initialSettings.plugboard) {
        const newPlugboardConnections = Object.entries(initialSettings.plugboard) as [string, string][];
        setPlugboardConnections(newPlugboardConnections);
      }
      setInitializedFromProps(true); // Mark as initialized from props
    }
  }, [initialSettings, initializedFromProps, initializedFromQuery]);
  
  useEffect(() => {
    // Do not run updateSettings if not initialized from props or query yet,
    // to avoid sending default settings before prop/query settings are applied.
    if (!initializedFromProps && !initializedFromQuery && !initialSettings && !searchParams.get('rotors')) {
        return;
    }

    const updateSettings = async () => {
      try {
        await enigmaApi.setSettings({
          rotors: rotors.map(r => ({
            name: r.type,
            position: r.position,
            ringSetting: r.ringSetting,
          })),
          reflector: reflector,
          plugboard: plugboardConnections.reduce((acc, [a, b]) => {
            acc[a] = b;
            return acc;
          }, {} as Record<string, string>),
        });
        setError(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

        // Re-encrypt the current message when settings change
        if (inputMessage) {
          const result = await enigmaApi.encryptMessage(inputMessage);
          setOutputMessage(result.encrypted);
        }
      } catch (err) {
        setError('Failed to update settings');
        soundManager.play('error');
      }
    };

    updateSettings();
  }, [rotors, reflector, plugboardConnections, inputMessage]);

  // On mount: If query params are present, initialize state from them
  // This runs AFTER the initialSettings prop effect due to dependency array and state guards
  useEffect(() => {
    if (initializedFromQuery || initializedFromProps) return; // Don't re-init if already done by props

    const rotorsParam = searchParams.get('rotors');
    const reflectorParam = searchParams.get('reflector');
    const plugboardParam = searchParams.get('plugboard');
    const ciphertextParam = searchParams.get('ciphertext');
    if (rotorsParam && reflectorParam && plugboardParam) {
      try {
        const rotorsArr = JSON.parse(rotorsParam).map((r: any) => ({
          type: r.name,
          position: r.position,
          ringSetting: r.ring_setting,
        }));
        setRotors(rotorsArr);
        setReflector(reflectorParam);
        const plugArr = Object.entries(JSON.parse(plugboardParam)) as [string, string][];
        setPlugboardConnections(plugArr);
        if (ciphertextParam) {
          setInputMessage(ciphertextParam);
          // Encrypt the initial ciphertext
          enigmaApi.encryptMessage(ciphertextParam)
            .then(result => {
              setOutputMessage(result.encrypted);
            })
            .catch(err => {
              setError('Failed to encrypt initial message');
              soundManager.play('error');
            });
        }
        setInitializedFromQuery(true);
      } catch (e) {
        // ignore parse errors
      }
    }
  }, [searchParams, initializedFromQuery]);

  const handleRotorSetPosition = (index: number, newPosition: number) => {
    soundManager.play('rotorTurn');
    const newRotors = [...rotors];
    newRotors[index] = {
      ...newRotors[index],
      position: newPosition
    };
    setRotors(newRotors);
  };

  const handleRotorSetRingSetting = (index: number, newRingSetting: number) => {
    soundManager.play('rotorTurn');
    const newRotors = [...rotors];
    newRotors[index] = {
      ...newRotors[index],
      ringSetting: newRingSetting
    };
    setRotors(newRotors);
  };

  const handleReflectorChange = (newReflector: string) => {
    soundManager.play('keyPress');
    setReflector(newReflector);
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value.toUpperCase();
    setInputMessage(newInput);

    if (newInput.length > 0) {
      setIsLoading(true);
      try {
        const result = await enigmaApi.encryptMessage(newInput);
        setOutputMessage(result.encrypted);
        setError(null);
        soundManager.play('keyPress');
      } catch (err) {
        setError('Failed to encrypt message');
        soundManager.play('error');
      } finally {
        setIsLoading(false);
      }
    } else {
      setOutputMessage('');
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Enigma Machine Simulator
        </motion.h1>

        {/* Lampboard above everything */}
        <div className="flex justify-center mb-8">
          <Lampboard activeLetter={outputMessage.slice(-1)} />
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50"
            >
              {error}
            </motion.div>
          )}
          {showSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
            >
              Settings updated successfully
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Machine Configuration */}
          <div className="space-y-8">
            {/* Rotors */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Rotors</h2>
<div className="grid grid-cols-3 gap-4">
  {rotors.map((rotor, index) => (
    <div key={index} className="flex flex-col items-center">
      {/* Rotor type selector */}
      <select
        value={rotor.type}
        onChange={e => {
          const newType = e.target.value;
          const newRotors = [...rotors];
          newRotors[index] = { ...newRotors[index], type: newType };
          setRotors(newRotors);
        }}
        className="mb-2 px-2 py-1 rounded bg-gray-700 text-yellow-300 font-mono text-center"
      >
        {Object.keys(ROTOR_TYPES).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <Rotor
        letters={ALPHABET}
        position={rotor.position}
        ringSetting={rotor.ringSetting}
        label={rotor.type}
        onRotate={(newPosition) => handleRotorSetPosition(index, newPosition)}
        onRingSettingChange={(newRingSetting) => handleRotorSetRingSetting(index, newRingSetting)}
      />
    </div>
  ))}
</div>
            </div>

            {/* Reflector Selection */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Reflector</h2>
              <div className="flex space-x-4">
                {Object.keys(REFLECTOR_TYPES).map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReflectorChange(type)}
                    className={`
                      px-4 py-2 rounded-lg
                      ${reflector === type 
                        ? 'bg-yellow-400 text-gray-900' 
                        : 'bg-gray-700 text-white hover:bg-gray-600'}
                    `}
                  >
                    {type}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Plugboard */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <Plugboard
                connections={plugboardConnections}
                onConnectionsChange={setPlugboardConnections}
              />
            </div>
          </div>

          {/* Right Column - Message Input/Output */}
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Message</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Input
                  </label>
                  <textarea
                    value={inputMessage}
                    onChange={handleInputChange}
                    className="w-full h-32 bg-gray-700 text-white p-4 rounded-lg resize-none focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="Type your message here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Output
                  </label>
                  <div className="w-full h-32 bg-gray-700 text-white p-4 rounded-lg">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full"
                        />
                      </div>
                    ) : (
                      outputMessage
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
