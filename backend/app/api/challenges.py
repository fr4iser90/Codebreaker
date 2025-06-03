CHALLENGES = [
    {
        "id": 1,
        "ciphertext": "MBQFS",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 1, "ring_setting": 0},
                {"name": "III", "position": 2, "ring_setting": 0}
            ],
            "reflector": "C",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 1, "ring_setting": 0},
                {"name": "III", "position": 2, "ring_setting": 0}
            ],
            "reflector": C,
            "plugboard": {"A": "B", "C": "D"}
        },
        "solution": "HELLO",
        "info": "The first Enigma machine was developed in 1918 by Arthur Scherbius, a German engineer. Initially, it was marketed as a commercial encryption device for businesses to protect their communications. The machine's complexity was staggering - with its rotors and plugboard, it could generate approximately 1.59×10^20 possible key combinations. This convinced Scherbius that even if an enemy seized the machine, they could not easily recover the daily key. Interestingly, German Naval intelligence initially ignored it in 1918, and it was only the growing tensions of the 1930s that finally brought Enigma into full military service.\n\nFun Fact: The first commercial Enigma model was introduced in 1923, five years after its initial development.\n\nSources: Wikipedia, Bletchley Park, Enigma Museum, DPMA - 100 years of Enigma."
    },
    {
        "id": 2,
        "ciphertext": "FQD CONIXMSJV",
        "settings": {
            "rotors": [
                {"name": "I", "position": 10, "ring_setting": 0},
                {"name": "II", "position": 3, "ring_setting": 20},
                {"name": "III", "position": 16, "ring_setting": 10}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": None, "ring_setting": 0},
                {"name": "III", "position": None, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {}
        },
        "solution": "SCHERBIUS",
        "info": "The commercial version of the Enigma machine was produced by Scherbius & Ritter. It featured a keyboard and lampboard, making it easier to use than previous encryption devices. The machine was initially sold to companies that wanted to protect their business secrets. The first commercial model used a special reflector type B, which was later modified for military use. The rotor positions were often set to zero for demonstration purposes, making it easier for new operators to learn the system.\n\nFun Fact: The commercial Enigma was first demonstrated at the International Postal Congress in Bern, Switzerland in 1923.\n\nSources: Federal Archives, Enigma Museum."
    },
    {
        "id": 3,
        "ciphertext": "POLISH CODE",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "POLAND",
        "info": "The Polish Cipher Bureau, led by Marian Rejewski, made the first breakthrough in breaking Enigma codes. They developed the 'Bomba' machine, a forerunner to the British Bombe. The Polish mathematicians shared their findings with the British in 1939, which was crucial for the later success at Bletchley Park. Their work in Pyry, near Warsaw, laid the foundation for modern cryptanalysis. The key to their success was understanding the mathematical patterns in the rotor wiring and reflector connections.\n\nFun Fact: The Polish codebreakers first broke the Enigma code in 1932, seven years before the war began.\n\nSources: Bletchley Park, Enigma Museum."
    },
    {
        "id": 4,
        "ciphertext": "BLETCHLEY",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "solution": "BLETCHLEY",
        "info": "Bletchley Park became the central site for British codebreakers during World War II. The estate was chosen for its location between Oxford and Cambridge universities. Here, some of the most brilliant mathematicians and linguists of their time worked, including Alan Turing.\n\nFun Fact: The estate was purchased by the government for £6,000 in 1938, equivalent to about £400,000 today.\n\nSources: Bletchley Park, National Archives."
    },
    {
        "id": 5,
        "ciphertext": "TURING BOMBE",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "TURING",
        "info": "Alan Turing and Gordon Welchman developed the Bombe machine, which could find the daily settings of the Enigma machines. This was a crucial breakthrough in breaking German communications. The Bombe could find Enigma settings in hours that would have taken a human years.\n\nFun Fact: The first Bombe was delivered to Bletchley Park on 18 March 1940, and was named 'Victory'.\n\nSources: Bletchley Park, National Archives."
    },
    {
        "id": 6,
        "ciphertext": "NAVAL ENIGMA",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "NAVY",
        "info": "Breaking the Naval Enigma was particularly challenging as it used more complex settings. This breakthrough helped the Allies track German U-boat movements. The decryption of Naval Enigma was crucial for the Battle of the Atlantic.\n\nFun Fact: The Naval Enigma used a fourth rotor (Beta/Gamma) that could be inserted in different positions, making it significantly more complex than the three-rotor version.\n\nSources: Bletchley Park, National Archives."
    },
    {
        "id": 7,
        "ciphertext": "WAR END",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "END",
        "info": "After the war, the work at Bletchley Park remained classified for decades. The contributions of the codebreakers, including Alan Turing, were not fully recognized until much later. Many of the insights and techniques developed at Bletchley Park formed the foundation for modern computer science.\n\nFun Fact: The first detailed public account of the work at Bletchley Park was published in 1974 in 'The Ultra Secret' by F.W. Winterbotham.\n\nSources: Bletchley Park, National Archives."
    },
    {
        "id": 8,
        "ciphertext": "CAPE MATAPAN",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "VICTORY",
        "info": "In March 1941, a crucial breakthrough in codebreaking led to a decisive naval victory at Cape Matapan. Mavis Batey, a young cryptanalyst at Bletchley Park, successfully decrypted Italian naval Enigma messages. One message stating 'Today's the day minus three' indicated imminent naval action. This intelligence allowed Admiral Sir Andrew Cunningham to orchestrate a strategic response that resulted in the sinking of three heavy cruisers and two destroyers, with no major damage to British ships.\n\nFun Fact: The British sent a reconnaissance aircraft to 'discover' the Italian fleet, providing a plausible cover for their knowledge of Italian movements and protecting the secrecy of their codebreaking capabilities.\n\nSources: Battle of Cape Matapan, Wikipedia; Cryptanalysis of Italian naval codes, Wikipedia; Batey, Mavis. Breaking Italian Naval Enigma. Biteback Publishing."
    },
    {
        "id": 9,
        "ciphertext": "MECHANICAL",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "DESIGN",
        "info": "The Enigma's mechanical design concealed its mathematical genius. Each machine featured a keyboard, lampboard, and a stack of rotors wired differently on each face. When a key was pressed, an electric circuit would weave through the rotors, be scrambled by a stationary reflector wheel, and then reverse through the rotors to light a substituted letter. The plugboard (Steckerbrett) added an extra layer of encryption by swapping letter pairs. Each keystroke advanced the rightmost rotor, changing the substitution pattern for the next letter.\n\nFun Fact: The Enigma machine was so well-designed that even if an enemy captured a machine, they couldn't read the messages without knowing the daily settings.\n\nSources: National Museum of Computing, Imperial War Museums, DPMA - 100 years of Enigma."
    },
    {
        "id": 10,
        "ciphertext": "POLISH MATH",
        "settings": {
            "rotors": [
                {"name": "I", "position": 0, "ring_setting": 0},
                {"name": "II", "position": 0, "ring_setting": 0},
                {"name": "III", "position": 0, "ring_setting": 0}
            ],
            "reflector": "B",
            "plugboard": {"A": "B", "C": "D"}
        },
        "settings_public": {
            "rotors": [
                {"name": "I", "position": None, "ring_setting": None},
                {"name": "II", "position": None, "ring_setting": None},
                {"name": "III", "position": None, "ring_setting": None}
            ],
            "reflector": None,
            "plugboard": {}
        },
        "solution": "BREAKTHROUGH",
        "info": "By the early 1930s, three young Polish mathematicians revolutionized cryptanalysis: Marian Rejewski, Jerzy Różycki, and Henryk Zygalski. All students at Poznań University, they were secretly recruited and trained by Poland's Cipher Bureau. Drawing on permutation theory, Rejewski reverse-engineered the Enigma wiring sight-unseen. In 1932, he reconstructed a mathematical model of the military Enigma machine, deducing the internal wiring of its rotors and reflector. The team built Enigma 'doubles' to practice on and invented electro-mechanical aids of their own, including the famous 'bomba kryptologiczna' - a primitive computer that searched through possible rotor settings.\n\nFun Fact: The Polish mathematicians shared their findings with the British and French in July 1939, just weeks before the war began.\n\nSources: The Polish Connection - National Museum of Computing, JSTOR Daily, BBC News."
    }
] 