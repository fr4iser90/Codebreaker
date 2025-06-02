'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  image?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1918,
    title: "First Enigma Machine",
    description: "Arthur Scherbius patents the first Enigma machine, originally designed for commercial use.",
  },
  {
    year: 1923,
    title: "Commercial Enigma",
    description: "The first commercial Enigma machine is produced by Scherbius & Ritter.",
  },
  {
    year: 1932,
    title: "Polish Breakthrough",
    description: "Polish mathematicians Marian Rejewski, Jerzy Różycki, and Henryk Zygalski begin breaking Enigma codes.",
  },
  {
    year: 1939,
    title: "Bletchley Park Setup",
    description: "The British Government Code and Cypher School moves to Bletchley Park.",
  },
  {
    year: 1940,
    title: "Turing's Bombe",
    description: "Alan Turing and Gordon Welchman develop the Bombe machine to break Enigma codes.",
  },
  {
    year: 1941,
    title: "Naval Enigma Broken",
    description: "The British successfully break the Naval Enigma code, a major breakthrough in the war.",
  },
  {
    year: 1945,
    title: "War End and Legacy",
    description: "The war ends, and the work at Bletchley Park remains classified for decades.",
  },
];

export const Timeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Enigma Timeline
        </motion.h1>

        {/* Timeline Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Zoom Out
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Zoom In
          </button>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400 transform -translate-x-1/2" />

          {/* Events */}
          <div className="space-y-16">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Year Marker */}
                <div className="w-1/2 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative"
                  >
                    <div className="text-2xl font-bold text-yellow-400">{event.year}</div>
                  </motion.div>
                </div>

                {/* Event Card */}
                <div className="w-1/2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gray-800 p-6 rounded-lg cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <p className="text-gray-400">{event.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full"
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-3xl font-bold mb-4">{selectedEvent.title}</h2>
                <p className="text-gray-400 mb-4">{selectedEvent.description}</p>
                {selectedEvent.image && (
                  <img
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 