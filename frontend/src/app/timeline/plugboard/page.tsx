import Image from 'next/image';
import Link from 'next/link';

const plugboardSettings = {
  rotors: [
    { name: 'I', position: 0, ring_setting: 0 },
    { name: 'II', position: 0, ring_setting: 0 },
    { name: 'III', position: 0, ring_setting: 0 },
  ],
  reflector: 'B',
  plugboard: { A: 'B', C: 'D' },
};

const ciphertext = 'QVPZJ'; // Beispiel: "HELLO" mit obigen Einstellungen verschlüsselt

export default function PlugboardDetailPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Plugboard of the Enigma</h1>
        <div className="mb-6">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/2/27/Enigma-plugboard.jpg?20120102194333"
            alt="Enigma Plugboard"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
        <p className="mb-6 text-lg">
          The plugboard (<span className="italic">Steckerbrett</span>) was a key innovation of the Enigma machine, allowing operators to swap pairs of letters and dramatically increase the cipher's complexity. Up to 13 pairs could be connected, making brute-force attacks much harder.
        </p>
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Secret Message</h2>
          <p className="mb-2 text-yellow-300 font-mono text-xl tracking-widest">{ciphertext}</p>
          <p className="mb-4 text-gray-400">Can you decrypt this message using the Enigma simulator with the correct settings?</p>
          <Link
            href={{
              pathname: '/enigma',
              query: {
                rotors: JSON.stringify(plugboardSettings.rotors),
                reflector: plugboardSettings.reflector,
                plugboard: JSON.stringify(plugboardSettings.plugboard),
                ciphertext,
              },
            }}
            className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Open in Simulator
          </Link>
        </div>
        <Link href="/timeline" className="text-blue-400 hover:underline">← Back to Timeline</Link>
      </div>
    </div>
  );
} 