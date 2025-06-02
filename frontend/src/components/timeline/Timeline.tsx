'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  image?: string;
  details?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1918,
    title: "First Enigma Machine",
    description: "Arthur Scherbius patents the first Enigma machine, originally designed for commercial use.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Enigma-Machine.jpg/960px-Enigma-Machine.jpg?20110410205427",
    details: "The first Enigma machine was developed by Arthur Scherbius, a German engineer. Initially, it was marketed as a commercial encryption device for businesses to protect their communications."
  },
  {
    year: 1923,
    title: "Enigma in use (Bundesarchiv)",
    description: "The first commercial Enigma machine is produced by Scherbius & Ritter.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Bundesarchiv_Bild_101I-241-2173-09%2C_Russland%2C_Verschl%C3%BCsselungsger%C3%A4t_Enigma.jpg/640px-Bundesarchiv_Bild_101I-241-2173-09%2C_Russland%2C_Verschl%C3%BCsselungsger%C3%A4t_Enigma.jpg",
    details: "The commercial version of the Enigma machine was produced by Scherbius & Ritter. It featured a keyboard and lampboard, making it easier to use than previous encryption devices."
  },
  {
    year: 1932,
    title: "Plugboard of an Enigma machine",
    description: "Polish mathematicians Marian Rejewski, Jerzy Różycki, and Henryk Zygalski begin breaking Enigma codes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Enigma-plugboard.jpg?20120102194333",
    details: "The Polish Cipher Bureau, led by Marian Rejewski, made the first breakthrough in breaking Enigma codes. They developed the 'bomba' machine, a forerunner to the British Bombe."
  },
  {
    year: 1939,
    title: "Bletchley Park Setup",
    description: "The British Government Code and Cypher School moves to Bletchley Park.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bletchley_Park_Mansion.jpg/1600px-Bletchley_Park_Mansion.jpg?20170304232652",
    details: "Bletchley Park became the central site for British codebreakers during World War II. The estate was chosen for its location between Oxford and Cambridge universities."
  },
  {
    year: 1940,
    title: "Turing's Bombe",
    description: "Alan Turing and Gordon Welchman develop the Bombe machine to break Enigma codes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bombe-rebuild.jpg?20140417024253",
    details: "Alan Turing and Gordon Welchman developed the Bombe machine, which could find the daily settings of the Enigma machines. This was a crucial breakthrough in breaking German communications."
  },
  {
    year: 1941,
    title: "Naval Enigma Broken",
    description: "The British successfully break the Naval Enigma code, a major breakthrough in the war.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Enigma-Machine.jpg/960px-Enigma-Machine.jpg?20110410205427",
    details: "Breaking the Naval Enigma was particularly challenging as it used more complex settings. This breakthrough helped the Allies track German U-boat movements."
  },
  {
    year: 1945,
    title: "War End and Legacy",
    description: "The war ends, and the work at Bletchley Park remains classified for decades.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bletchley_Park_Mansion.jpg/1600px-Bletchley_Park_Mansion.jpg?20170304232652",
    details: "After the war, the work at Bletchley Park remained classified for decades. The contributions of the codebreakers, including Alan Turing, were not fully recognized until much later."
  },
];

export const Timeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  // Calculate spacing based on zoom level
  const getSpacing = () => {
    return 16 * zoomLevel;
  };

  // Calculate font size based on zoom level
  const getFontSize = (baseSize: number) => {
    return `${baseSize * zoomLevel}px`;
  };

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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Zoom Out
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700"
          >
            Zoom In
          </motion.button>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <motion.div 
            className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-400 transform -translate-x-1/2"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Events */}
          <div style={{ gap: getSpacing() }} className="flex flex-col">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -200px 0px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                style={{ marginBottom: getSpacing() }}
              >
                {/* Year Marker */}
                <div className="w-1/2 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="relative"
                  >
                    <div 
                      className="font-bold text-yellow-400"
                      style={{ fontSize: getFontSize(24) }}
                    >
                      {event.year}
                    </div>
                  </motion.div>
                </div>

                {/* Event Card */}
                <div className="w-1/2">
                  <motion.div
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(234, 179, 8, 0.3)"
                    }}
                    className="bg-gray-800 p-6 rounded-lg cursor-pointer overflow-hidden"
                    onClick={() => setSelectedEvent(event)}
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 
                        className="font-bold mb-2"
                        style={{ fontSize: getFontSize(20) }}
                      >
                        {event.title}
                      </h3>
                      <p 
                        className="text-gray-400"
                        style={{ fontSize: getFontSize(16) }}
                      >
                        {event.description}
                      </p>
                      {event.image && (
                        <div className="w-full h-32 relative mt-4">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index < 2}
                          />
                        </div>
                      )}
                    </motion.div>
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
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full"
                onClick={e => e.stopPropagation()}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 
                    className="font-bold mb-4"
                    style={{ fontSize: getFontSize(24) }}
                  >
                    {selectedEvent.title}
                  </h2>
                  <p 
                    className="text-gray-400 mb-4"
                    style={{ fontSize: getFontSize(16) }}
                  >
                    {selectedEvent.description}
                  </p>
                  {selectedEvent.details && (
                    <p 
                      className="text-gray-300 mb-4"
                      style={{ fontSize: getFontSize(16) }}
                    >
                      {selectedEvent.details}
                    </p>
                  )}
                  {selectedEvent.image && (
                    <div className="w-full h-48 relative mb-4">
                      <Image
                        src={selectedEvent.image}
                        alt={selectedEvent.title}
                        fill
                        style={{ objectFit: 'cover', borderRadius: '0.5rem' }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-300"
                  >
                    Close
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}; 