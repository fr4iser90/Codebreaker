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
  challengeId: number;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 1918,
    title: "First Enigma Machine",
    description: "Arthur Scherbius patents the first Enigma machine, originally designed for commercial use.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Enigma-Machine.jpg/960px-Enigma-Machine.jpg?20110410205427",
    details: "The first Enigma machine was developed by Arthur Scherbius, a German engineer. Initially, it was marketed as a commercial encryption device for businesses to protect their communications.",
    challengeId: 1,
  },
  {
    year: 1923,
    title: "Enigma in use (Bundesarchiv)",
    description: "The first commercial Enigma machine is produced by Scherbius & Ritter.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Bundesarchiv_Bild_101I-241-2173-09%2C_Russland%2C_Verschl%C3%BCsselungsger%C3%A4t_Enigma.jpg/640px-Bundesarchiv_Bild_101I-241-2173-09%2C_Russland%2C_Verschl%C3%BCsselungsger%C3%A4t_Enigma.jpg",
    details: "The commercial version of the Enigma machine was produced by Scherbius & Ritter. It featured a keyboard and lampboard, making it easier to use than previous encryption devices.",
    challengeId: 2,
  },
  {
    year: 1932,
    title: "Plugboard of an Enigma machine",
    description: "Polish mathematicians Marian Rejewski, Jerzy Różycki, and Henryk Zygalski begin breaking Enigma codes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/2/27/Enigma-plugboard.jpg?20120102194333",
    details: "The Polish Cipher Bureau, led by Marian Rejewski, made the first breakthrough in breaking Enigma codes. They developed the 'bomba' machine, a forerunner to the British Bombe.",
    challengeId: 3,
  },
  {
    year: 1932,
    title: "Polish Mathematical Breakthrough",
    description: "Marian Rejewski, Jerzy Różycki, and Henryk Zygalski revolutionize cryptanalysis with mathematical theory.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Marian_Rejewski.jpg/800px-Marian_Rejewski.jpg",
    details: "Three young mathematicians from Poznań University, secretly recruited by Poland's Cipher Bureau, made the first major breakthrough in breaking Enigma. Using permutation theory, they reverse-engineered the machine's wiring and built the first 'bomba' machine.",
    challengeId: 10,
  },
  {
    year: 1933,
    title: "Enigma's Mechanical Design",
    description: "The complex mechanical design of the Enigma machine is fully understood and documented.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Enigma_rotors_with_alphabet_rings.jpg/800px-Enigma_rotors_with_alphabet_rings.jpg",
    details: "The Enigma's mechanical design featured a keyboard, lampboard, and stack of rotors, each wired differently. The machine's complexity came from its ability to generate approximately 1.59×10^20 possible key combinations.",
    challengeId: 9,
  },
  {
    year: 1939,
    title: "Bletchley Park Setup",
    description: "The British Government Code and Cypher School moves to Bletchley Park.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bletchley_Park_Mansion.jpg/1600px-Bletchley_Park_Mansion.jpg?20170304232652",
    details: "Bletchley Park became the central site for British codebreakers during World War II. The estate was chosen for its location between Oxford and Cambridge universities.",
    challengeId: 4,
  },
  {
    year: 1940,
    title: "Turing's Bombe",
    description: "Alan Turing and Gordon Welchman develop the Bombe machine to break Enigma codes.",
    image: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Bombe-rebuild.jpg?20140417024253",
    details: "Alan Turing and Gordon Welchman developed the Bombe machine, which could find the daily settings of the Enigma machines. This was a crucial breakthrough in breaking German communications.",
    challengeId: 5,
  },
  {
    year: 1941,
    title: "Naval Enigma Broken",
    description: "The British successfully break the Naval Enigma code, a major breakthrough in the war.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Enigma-Machine.jpg/960px-Enigma-Machine.jpg?20110410205427",
    details: "Breaking the Naval Enigma was particularly challenging as it used more complex settings. This breakthrough helped the Allies track German U-boat movements.",
    challengeId: 6,
  },
  {
    year: 1941,
    title: "Battle of Cape Matapan",
    description: "A decisive naval victory made possible by breaking Italian naval codes at Bletchley Park.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Battle_of_Cape_Matapan_map.jpg/800px-Battle_of_Cape_Matapan_map.jpg",
    details: "In March 1941, Mavis Batey's decryption of Italian naval Enigma messages led to a crucial victory at Cape Matapan. The intelligence allowed Admiral Cunningham to sink three heavy cruisers and two destroyers without major British losses.",
    challengeId: 8,
  },
  {
    year: 1945,
    title: "War End and Legacy",
    description: "The war ends, and the work at Bletchley Park remains classified for decades.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bletchley_Park_Mansion.jpg/1600px-Bletchley_Park_Mansion.jpg?20170304232652",
    details: "After the war, the work at Bletchley Park remained classified for decades. The contributions of the codebreakers, including Alan Turing, were not fully recognized until much later.",
    challengeId: 7,
  },
];

export const Timeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [solvedEvents, setSolvedEvents] = useState<Record<number, boolean>>({});
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

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
          <div className="flex flex-col gap-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={event.challengeId}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -200px 0px" }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Year Marker */}
                <div className="w-1/2 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="relative"
                  >
                    <div className="font-bold text-yellow-400 text-2xl">
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
                    className={`bg-gray-800 p-6 rounded-lg cursor-pointer overflow-hidden ${solvedEvents[event.challengeId] ? 'border-2 border-green-400' : ''}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="font-bold mb-2 text-xl">
                        {event.title}
                      </h3>
                      <p className="text-gray-400">
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
                      {solvedEvents[event.challengeId] && (
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
          challengeId={selectedEvent ? selectedEvent.challengeId : undefined}
          onSolved={() => {
            if (selectedEvent) {
              setSolvedEvents(prev => ({ ...prev, [selectedEvent.challengeId]: true }));
            }
          }}
          title={selectedEvent ? selectedEvent.title : ''}
          image={selectedEvent ? selectedEvent.image : undefined} // Pass the image URL
        />
      </div>
    </div>
  );
};
