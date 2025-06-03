CHALLENGES = [
    {
        "id": 1,
        "title": "Level 1: The Enigma’s Origin",
        "ciphertext": "ILBDAQNBWHF",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0}, # A, A
                {"name": "II", "position": 1, "ring_setting": 0}, # B, A
                {"name": "III", "position": 2, "ring_setting": 0} # C, A
            ],
            "reflector": "B",
            "plugboard": {"A": "B"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 1, "ring_setting": 0},
                {"name": "III", "position": 2, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B"}
        },
        "solution": "SOLUTION_L1_PLACEHOLDER",
        "info": (
            "Level 1: The Enigma’s Origin\n\n"
            "Welcome to Level 1: The Enigma’s Origin! Your mission is to decipher the very first Enigma-coded message and get hands-on with the famous cipher machine. "
            "The Enigma machine was invented by German engineer Arthur Scherbius, who patented his rotor-cipher design in 1918 (dpma.de). "
            "Originally sold to businesses, it later became a military secret. In this level we give you all the settings so you can focus on the basics of how Enigma works.\n\n"
            "Info:\n\n"
            "    Inventor and era: Arthur Scherbius patented the Enigma in 1918 (dpma.de). By the 1930s it was adopted by the German military, turning Scherbius’s puzzle into wartime code.\n\n"
            "    Name & keyspace: The word “Enigma” comes from the Greek for “riddle” (dpma.de) – fitting for a cipher with about 1.6×10^20 possible daily keys (dpma.de). "
            "This astronomical number (hundreds of quintillions) made brute-forcing all settings by hand utterly impossible.\n\n"
            "    Symmetric encryption: Enigma is symmetric – the same machine settings used to encrypt a message will decrypt it (101computing.net). "
            "The sender and receiver must agree on rotors, rings, start positions, reflector, and plugboard in advance.\n\n"
            "    Rotor stepping: Each time a key is pressed, the rightmost rotor advances one step, so even typing the same letter twice produces different cipher letters (101computing.net). "
            "This mechanical stepping makes Enigma a polyalphabetic cipher (the code changes with every keystroke).\n\n"
            "    Plugboard stage: Before letters even hit the rotors, they pass through the plugboard (Steckerbrett), which swaps paired letters. "
            "For example, connecting W↔D and V↔Z means W encrypts as D and vice versa (101computing.net). "
            "On a military Enigma up to 10 cables could be used, adding another massive layer of scrambling."
        )
    },
    {
        "id": 2,
        "title": "Level 2: Plugboard Primer",
        "ciphertext": "WYMCIBOLNOAC",
        "settings": {
            "rotors": [
                {"name": "II", "position": 10, "ring_setting": 1}, # K, B
                {"name": "I", "position": 5, "ring_setting": 3},  # F, D
                {"name": "III", "position": 11, "ring_setting": 4} # L, E
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D", "E": "F", "G": "H"}
        },
        "settings_public": {
            "rotors": [
                {"name": "II", "position": None, "ring_setting": 1},
                {"name": "I", "position": None, "ring_setting": 3},
                {"name": "III", "position": None, "ring_setting": 4}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L2_PLACEHOLDER",
        "info": (
            "Level 2: Plugboard Primer\n\n"
            "Level 2 brings in the plugboard, the set of cables on the front of Enigma. Here you’ll see how swapping letters adds to the confusion. We’ll still give you all settings this time, but notice the ring settings are no longer all A (0) – they now shift the internal wiring, making the cipher more complex.\n\n"
            "Info:\n\n"
            "    Plugboard swaps: The plugboard adds an extra substitution step (101computing.net). "
            "For instance, a cable connecting A↔B will swap those letters whenever they are typed. In practice German operators used about 8–10 cables, each swapping two letters (e.g. W↔D, V↔Z) (101computing.net).\n\n"
            "    Ring settings: The ring setting (Ringstellung) shifts the internal wiring of each rotor. Even if the rotor is in the same position, a different ring setting will change the cipher output. "
            "This is a subtle but powerful way to increase security.\n\n"
            "    Astronomical keys: With plugboard wires in use, the total keyspace explodes. A 3-rotor Enigma with 10 plug cables had on the order of 1.6×10^20 possible settings (dpma.de). "
            "As one historian put it, brute-forcing that was “effectively impossible” with 1940s technology (nordvpn.com). Codebreakers had to exploit weaknesses instead of trying every key.\n\n"
            "    Reflector flaw: The Enigma’s reflector (the fixed rotor on the left) guaranteed that no letter ever encrypted to itself (dpma.de). "
            "In other words, the cipher letter is never the same as the plaintext letter. This subtle fact gave Allied codebreakers a useful clue: any guessed plaintext letter immediately rules itself out at that position.\n\n"
            "    Cribs and attacks: In fact, Allied cryptanalysts often used “cribs” – guessed plaintext words like “WETTER” (German for weather) or repeated salutations – to limit possibilities. "
            "Finding a correct crib could dramatically speed up finding the daily key. (You’ll encounter this tactic in later levels.)"
        )
    },
    {
        "id": 3,
        "title": "Level 3: Polish Breakthrough!",
        "ciphertext": "MCFFISJOHIISAMIH",
        "settings": {
            "rotors": [
                {"name": "I", "position": 23, "ring_setting": 3}, # X, D
                {"name": "II", "position": 10, "ring_setting": 5},# K, F
                {"name": "III", "position": 12, "ring_setting": 1}# M, B
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": 3},
                {"name": "II", "position": None, "ring_setting": 5},
                {"name": "III", "position": None, "ring_setting": 1}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L3_PLACEHOLDER",
        "info": (
            "Level 3: Polish Breakthrough!\n\n"
            "Welcome to Level 3: Polish Breakthrough! Your mission is to decode a historic clue using secrets uncovered by Polish mathematicians. All machine settings are provided, but notice the ring settings are now varied – a key part of the challenge.\n\n"
            "Info:\n\n"
            "    Early codebreakers: In the early 1930s, before WWII, Polish cryptologists Marian Rejewski, Henryk Zygalski and Jerzy Różycki cracked the Enigma’s wiring using advanced math and logic (dpma.de, nordvpn.com). "
            "Working in Warsaw, they even built electro-mechanical “bomby” to automate finding keys (the original Polish bomba).\n\n"
            "    Ring settings: The Poles realized that ring settings (Ringstellung) could be used to further obscure the cipher. "
            "Changing the ring setting shifts the rotor wiring, so even with the same rotor order and positions, the output changes.\n\n"
            "    Sharing knowledge: By 1939 Poland had reconstructed Enigma’s inner workings and read many German messages. "
            "They secretly shared all their results and techniques with Britain and France, giving the Allies a huge head-start at Bletchley Park (dpma.de, nordvpn.com). "
            "These Polish breakthroughs proved early Enigmas could be cracked, laying the foundation for the later war effort.\n\n"
            "    Inspiring the Bombe: Polish methods inspired the British Bombe. (Alan Turing and Gordon Welchman later acknowledged adapting the Polish ideas.) "
            "In fact, Turing’s Bombe (built 1939–40) was a larger electromechanical successor to Rejewski’s device (britannica.com, dpma.de). "
            "It could test many wheel settings per second, using German “cribs” to home in on the solution.\n\n"
            "    Did you know? “Enigma” is literally Greek for “riddle/mystery” (dpma.de) – a name the Poles would soon disprove! Their early success showed Enigma was no unsolvable riddle."
        )
    },
    {
        "id": 4,
        "title": "Level 4: Bletchley Park Bureau",
        "ciphertext": "ZSLDSPSUZFJ",
        "settings": {
            "rotors": [
                {"name": "IV", "position": 0, "ring_setting": 2}, # A, C
                {"name": "II", "position": 10, "ring_setting": 0},# K, A
                {"name": "I", "position": 4, "ring_setting": 3}  # E, D
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "settings_public": {
            "rotors": [
                {"name": "IV", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "I", "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L4_PLACEHOLDER",
        "info": (
            "Level 4: Bletchley Park Bureau\n\n"
            "Welcome to Level 4: Bletchley Park Bureau! Your task is to decrypt a new message using British wartime settings. "
            "This time, the ring settings and rotor positions are omitted – you must deduce them.\n\n"
            "Clue: Intercepted messages from this period often began with the word 'WETTER' (German for 'weather'). Use this as a crib to help deduce the correct rotor positions and ring settings.\n\n"
            "Info:\n\n"
            "    Ring settings: The ring setting (Ringstellung) shifts the internal wiring of each rotor. Even if the rotor is in the same position, a different ring setting will change the cipher output. "
            "This is a subtle but powerful way to increase security. Try different combinations to find the correct settings.\n\n"
            "    Bletchley Park: Once war broke out, the Allies set up codebreaking at Bletchley Park in England. The Polish findings were combined with cutting-edge math. "
            "Alan Turing and others led Hut 8 (Naval) and Hut 6 (Army/Air) teams. Their secret work was called “Ultra.” "
            "The first British Bombe was designed by Turing in 1939 and installed at Bletchley in 1940 (britannica.com).\n\n"
            "    Bombes at work: By 1943 hundreds of Bombes (British and American) were running round-the-clock (britannica.com). "
            "Each Bombe tested millions of rotor positions against a crib. This automation let Bletchley quickly find that day’s keys for many messages.\n\n"
            "    1940 U-boat shift: Early on, Germans introduced more secure procedures (like naval Enigma changes), but Bletchley kept pace. "
            "For example, in 1941 the capture of codebooks (see next level) and new bombe techniques let the British break Naval Enigma too.\n\n"
            "    Top secret: All work at Bletchley Park was kept under wraps. Even the field commanders who used Ultra intelligence didn’t know how it was obtained. "
            "(Ultra was considered so secret that only in 1974 was its existence publicly acknowledged.)"
        )
    },
    {
        "id": 5,
        "title": "Level 5: U-Boat Waters",
        "ciphertext": "XZRPRX",
        "settings": {
            "rotors": [
                {"name": "II", "position": 2, "ring_setting": 4}, # C, E
                {"name": "I", "position": 2, "ring_setting": 1},  # C, B
                {"name": "III", "position": 2, "ring_setting": 5} # C, F
            ],
            "reflector": "B",
            "plugboard": {"X": "Y", "M": "N"}
        },
        "settings_public": {
            "rotors": [
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L5_PLACEHOLDER",
        "info": (
            "Level 5: U-Boat Waters\n\n"
            "Welcome to Level 5: U-Boat Waters! This challenge uses settings that simulate German naval messages. "
            "The puzzle cipher has one plugboard swap hidden: you’ll have to figure it out. Also, ring settings are now non-trivial – pay close attention to their effect.\n\n"
            "Clue: Naval Enigma operators frequently used the plugboard pair X↔Y. Also, the plaintext contains the word 'ATLANTIK' (Atlantic), which you can use as a crib.\n\n"
            "Info:\n\n"
            "    Naval Enigma: In 1941 Germany’s Kriegsmarine added security by changing procedures, and in 1942 introduced a 4th rotor (M4) for U-boat communications (101computing.net). "
            "The M4’s extra wheel dramatically increased the key space, making naval codes even harder to break. Allies had to improve the Bombe (and even build special Navy Bombes) to keep up.\n\n"
            "    Ring settings: The ring setting (Ringstellung) shifts the internal wiring of each rotor. Even if the rotor is in the same position, a different ring setting will change the cipher output. "
            "Try different combinations to find the correct settings.\n\n"
            "    Battle of the Atlantic: Breaking U-boat Enigma was critical. Ultra decrypts of German naval traffic helped reroute Allied convoys and sink many submarines. "
            "By 1943–44, Bletchley’s successes in the Atlantic turned the tide of the war at sea. (One historian notes the outcome of the Atlantic campaign was “decisively influenced” by Enigma decryption (dpma.de).)\n\n"
            "    Allied efforts: Dedicated codebreakers (including Turing and a team of linguists) tackled Naval Enigma in Hut 8. "
            "They exploited every clue – from operator mistakes to captured codebooks – to deduce keys. Even when the Germans upgraded their machines, the Allies adapted and ultimately prevailed."
        )
    },
    {
        "id": 6,
        "title": "Level 6: Cribs and Codes",
        "ciphertext": "DRBGYFSCQTNK",
        "settings": {
            "rotors": [
                {"name": "III", "position": 14, "ring_setting": 2}, # O, C
                {"name": "I", "position": 14, "ring_setting": 4},   # O, E
                {"name": "IV", "position": 14, "ring_setting": 1}   # O, B
            ],
            "reflector": "B",
            "plugboard": {"E": "K", "M": "N"}
        },
        "settings_public": {
            "rotors": [
                {"name": None, "position": None, "ring_setting": None},
                {"name": None, "position": None, "ring_setting": None},
                {"name": None, "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {"E": "K", "M": "N"}
        },
        "solution": "SOLUTION_L6_PLACEHOLDER",
        "info": (
            "Level 6: Cribs and Codes\n\n"
            "Welcome to Level 6: Cribs and Codes! Here’s another message – this time, both the rotor order and ring settings are missing. You must deduce them using patterns and cribs.\n\n"
            "Clue: The message likely starts with 'WETTERBERICHT' (weather report), a common opening in intercepted Enigma traffic. Use this as a crib to deduce the rotor order and ring settings.\n\n"
            "Info:\n\n"
            "    Crib-based attacks: Codebreakers often attacked Enigma by guessing a word or phrase in the plaintext (a “crib”). "
            "Knowing a suspected plaintext lets them test rotor orders and settings. For example, common cribs were weather report beginnings or standard salutations. "
            "Using a known crib reduces the possibilities dramatically.\n\n"
            "    Rotor order and ring settings: The order of rotors (and which rotor is in which slot) is as important as their individual rings/positions. "
            "Changing the ring setting shifts the rotor wiring, so even with the same rotor order and positions, the output changes. "
            "Try different combinations to find the correct settings.\n\n"
            "    Historical note: The Poles originally used only 3 wheels (no 4th), so they could try all orders. By contrast, the Navy’s 4th rotor made the bombing harder. "
            "The Allied Bombe machines automated this by looping through wheel orders and positions using a crib (dpma.de)."
        )
    },
    {
        "id": 7,
        "title": "Level 7: Operation Primrose",
        "ciphertext": "GUGUTVXCOWHBRAA",
        "settings": {
            "rotors": [
                {"name": "III", "position": 23, "ring_setting": 5}, # X, F
                {"name": "II", "position": 23, "ring_setting": 2}, # X, C
                {"name": "I", "position": 23, "ring_setting": 4}  # X, E
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "settings_public": {
            "rotors": [
                {"name": "III", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "I", "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L7_PLACEHOLDER",
        "info": (
            "Level 7: Operation Primrose\n\n"
            "Welcome to Level 7: Operation Primrose! This puzzle honors the famous capture of a U-boat. You have all Enigma settings again, but ring settings and rotor positions are now more complex.\n\n"
            "Clue: The ciphertext contains a repeated block, suggesting the plaintext includes a repeated word such as 'U-BOOT' (U-boat). Look for this pattern to help deduce the settings.\n\n"
            "Info:\n\n"
            "    U-110 capture: In May 1941, HMS Bulldog captured U-110 and seized an undamaged Naval Enigma machine plus secret key tables (en.wikipedia.org). "
            "This highly secret event (code-named “Primrose”) gave the Allies genuine U-boat keys and helped break many naval messages. "
            "Even President Roosevelt wasn’t told until months later (en.wikipedia.org).\n\n"
            "    Bombe acceleration: With these materials in hand, Bletchley Park could test rotor settings faster (and often with fewer assumptions about plugboard wiring). "
            "This capture is sometimes called a “gift from heaven” for the codebreakers. It contributed to the success of Hut 8 against U-boat traffic.\n\n"
            "    Ring settings: The ring setting (Ringstellung) shifts the internal wiring of each rotor. Even if the rotor is in the same position, a different ring setting will change the cipher output. "
            "Try different combinations to find the correct settings.\n\n"
            "    Intelligence windfall: The U-110 haul demonstrated how field operations aided cryptanalysis. "
            "Throughout the war, codebreakers worked with military intelligence – intercepting Enigma traffic on submarines, planes and radios to provide real-time tips to the convoy escorts."
        )
    },
    {
        "id": 8,
        "title": "Level 8: D-Day Deception",
        "ciphertext": "GSLSIPLS",
        "settings": {
            "rotors": [
                {"name": "IV", "position": 3, "ring_setting": 2}, # D, C
                {"name": "V", "position": 3, "ring_setting": 4},  # D, E
                {"name": "III", "position": 3, "ring_setting": 1} # D, B
            ],
            "reflector": "B",
            "plugboard": {
                "A": "D", "H": "F", "K": "D", "N": "L", "W": "Y",
                "Q": "Z" # Example missing pair filled in for realism
            }
        },
        "settings_public": {
            "rotors": [
                {"name": "IV", "position": None, "ring_setting": None},
                {"name": "V", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {"A": "D", "H": "F", "K": "D", "N": "L", "W": "Y"}
        },
        "solution": "SOLUTION_L8_PLACEHOLDER",
        "info": (
            "Level 8: D-Day Deception\n\n"
            "Welcome to Level 8: D-Day Deception! Your mission is to decode a message about Operation Overlord. "
            "We give partial settings: reflector and some plugboard pairs are known, but one plugboard pair and all ring settings are missing.\n\n"
            "Clue: The missing plugboard pair involves a letter that does not appear in the ciphertext. The plaintext mentions 'OVERLORD', the codename for the Normandy landings.\n\n"
            "Info:\n\n"
            "    Operation Bodyguard: In the run-up to D-Day (June 6, 1944), the Allies launched Operation Bodyguard – an elaborate deception plan to hide the real invasion target (english-heritage.org.uk). "
            "They pretended the main landing would be at Pas-de-Calais, not Normandy, using fake radio traffic, dummy tanks and double agents.\n\n"
            "    Ultra confirms the ruse: Crucially, Bletchley Park used Ultra decrypts to monitor German reactions. "
            "Intercepted Enigma traffic showed German commanders believing the decoys (english-heritage.org.uk). "
            "As one report noted: “the Germans, convinced that Enigma could not be broken, remained totally unaware of this fact” (english-heritage.org.uk) – so Allied deception went unquestioned.\n\n"
            "    Double agents: Famous double agent Juan “Garbo” Pujol fed the Germans a steady stream of false reports about Allied forces in Britain. "
            "Ultra let the Allies see that “Garbo” had fooled the Germans, ensuring they kept divisions at Calais while Normandy was invaded.\n\n"
            "    Cryptanalysis victory: In the end, the D-Day success owed much to signals intelligence: every phase of the Allied plan was cross-checked by reading Enigma. "
            "This level’s message alludes to Operation Overlord, the codename for the Normandy landings on June 6, 1944."
        )
    },
    {
        "id": 9,
        "title": "Level 9: Allied Alliance",
        "ciphertext": "XZHFFPFGPHZ",
        "settings": {
            "rotors": [
                {"name": "II", "position": 23, "ring_setting": 2}, # X, C
                {"name": "III", "position": 25, "ring_setting": 4},# Z, E
                {"name": "I", "position": 7, "ring_setting": 1}   # H, B
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "settings_public": {
            "rotors": [
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None},
                {"name": "I", "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L9_PLACEHOLDER",
        "info": (
            "Level 9: Allied Alliance\n\n"
            "Welcome to Level 9: Allied Alliance! This harder puzzle omits plugboard settings and all ring settings. You must rely on common-sense guesses and try different combinations.\n\n"
            "Clue: The message ends with 'ENDE' (end), a common closing. Use this as a crib to help deduce the missing settings.\n\n"
            "Info:\n\n"
            "    Combined effort: The Allies pooled all cryptanalytic resources. By 1943 Britain and the United States were working together on codebreaking; the U.S. Army built dozens of Bombes of its own. "
            "(The original British Bombe design was also licensed to U.S. cryptologists.) In total over 200 Bombes ran on both sides of the Atlantic (britannica.com).\n\n"
            "    Beyond Enigma: Remember that while the Enigma was the most famous cipher, Allied codebreakers also tackled many others (including Japanese and Italian codes). "
            "This global intelligence network helped coordinate all fronts of the war.\n\n"
            "    Holiday puzzles: As a fun aside, after V-E Day some cryptography clubs even adapted Enigma settings to create puzzles and competition. "
            "The work done during the war inspired a new generation of computer scientists (Alan Turing’s work on the Bombe is often cited as a step toward modern computing (dpma.de))."
        )
    },
    {
        "id": 10,
        "title": "Level 10: Ultra Unleashed!",
        "ciphertext": "HJYVZEX",
        "settings": {
            "rotors": [
                {"name": "IV", "position": 3, "ring_setting": 5}, # D, F
                {"name": "V", "position": 3, "ring_setting": 2},  # D, C
                {"name": "III", "position": 3, "ring_setting": 4} # D, E
            ],
            "reflector": "B",
            "plugboard": {
                "S": "T"
            }
        },
        "settings_public": {
            "rotors": [
                {"name": None, "position": None, "ring_setting": None},
                {"name": None, "position": None, "ring_setting": None},
                {"name": None, "position": None, "ring_setting": None}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SOLUTION_L10_PLACEHOLDER",
        "info": (
            "Level 10: Ultra Unleashed!\n\n"
            "Welcome to Level 10, the final and most challenging stage: Ultra Unleashed! Your task is to decrypt a culminating secret. "
            "We give only the reflector (B); all other settings – rotor order, positions, ring settings, and plugboard – must be deduced.\n\n"
            "Clue: The plaintext contains the phrase 'ULTRA SIEG' (Ultra victory), a codeword used in Allied communications. Use this as a crib to deduce the full settings.\n\n"
            "Info:\n\n"
            "    Ultra and legacy: By late 1944 the Enigma code was broken so reliably that Allied commanders could use it regularly. "
            "The intelligence derived from these decrypts was code-named “Ultra”, and its secrecy was so great that it wasn’t revealed to the public until the 1970s (drenigma.org). "
            "Bletchley’s 11,000 staff never spoke of their work – they kept the secret for decades (drenigma.org).\n\n"
            "    Wider impact: Breaking Enigma is considered one of WWII’s greatest intelligence triumphs. It directly influenced events from the Battle of the Atlantic to the timing of D-Day. "
            "The techniques and machines (like the Bombe) also helped kick-start modern computing research (dpma.de).\n\n"
            "    Enigma today: While Enigma machines are museum pieces now, the story lives on as a classic cryptographic tale. "
            "The fact that Allied mathematicians and engineers cracked such a complex cipher under wartime pressure remains a remarkable human achievement. "
            "Congratulations on reaching the end of the challenge – you’ve decoded history!"
        )
    }
]
