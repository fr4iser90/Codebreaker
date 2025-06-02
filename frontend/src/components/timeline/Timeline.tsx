'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { SectionModal } from '../enigma/SectionModal';

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
  const [solvedEvents, setSolvedEvents] = useState<Record<number, boolean>>({});
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

  // Example secrets for each event (in echt: dynamisch/generiert)
  const eventSecrets: Record<number, string> = {
    1918: 'ENIGMA',
    1923: 'SCHERBIUS',
    1932: 'POLEN',
    1939: 'BLETCHLEY',
    1940: 'TURING',
    1941: 'NAVY',
    1945: 'ENDE',
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
                    className={`bg-gray-800 p-6 rounded-lg cursor-pointer overflow-hidden ${solvedEvents[event.year] ? 'border-2 border-green-400' : ''}`}
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
                      {solvedEvents[event.year] && (
                        <div className="mt-2 text-green-400 font-bold">✔ Gelöst</div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SectionModal für Event-Details & Secret */}
        <SectionModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          secret={selectedEvent ? (selectedEvent.year === 1918 ? 'HELLO' : eventSecrets[selectedEvent.year] || '') : ''}
          infoText={selectedEvent ? (
            selectedEvent.year === 1918 ? (
              <>
                <div>{selectedEvent.details || selectedEvent.description}</div>
                <div className="mt-4 p-4 bg-gray-700 rounded">
                  <b>Enigma-Challenge:</b><br/>
                  <b>Verschlüsselte Nachricht:</b> QVPZJ<br/>
                  <b>Enigma-Einstellungen:</b><br/>
                  Rotoren: I-II-III<br/>
                  Position: A-A-A<br/>
                  Ringstellung: 01-01-01<br/>
                  Plugboard: A-B, C-D<br/>
                  <br/>
                  Entschlüssle die Nachricht mit dem Simulator und gib das Ergebnis unten ein!
                </div>
              </>
            ) : (selectedEvent.details || selectedEvent.description)
          ) : ''}
          onSolved={() => {
            if (selectedEvent) {
              setSolvedEvents(prev => ({ ...prev, [selectedEvent.year]: true }));
            }
          }}
          title={selectedEvent ? selectedEvent.title : ''}
        />
      </div>
    </div>
  );
}; 