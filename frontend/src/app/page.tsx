'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Hack the Past
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Host the Truth
          </p>
          <div className="space-x-4">
            <Link 
              href="/timeline" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Explore Timeline
            </Link>
            <Link 
              href="/enigma" 
              className="px-6 py-3 border border-blue-600 hover:bg-blue-600/10 rounded-lg transition-colors"
            >
              Try Enigma Simulator
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Discover the Story</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">The Enigma Machine</h3>
              <p className="text-gray-400">Explore the fascinating history of the world's most famous encryption device.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Alan Turing</h3>
              <p className="text-gray-400">Learn about the brilliant mind behind breaking the Enigma code.</p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Code Breaking</h3>
              <p className="text-gray-400">Try your hand at solving cryptographic challenges.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 