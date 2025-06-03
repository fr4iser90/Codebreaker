"""
Sources and References for Enigma Challenges

This file contains the authoritative sources used for historical information in the Enigma challenges.
Each source is categorized and includes relevant details about its content and reliability.
"""

SOURCES = {
    "primary_sources": {
        "dpma": {
            "name": "German Patent and Trade Mark Office (DPMA)",
            "url": "https://www.dpma.de/english/our_office/publications/milestones/enigma/index.html",
            "description": "Official documentation of Arthur Scherbius's 1918 Enigma patent and historical development",
            "reliability": "Official government source"
        }
    },
    
    "museum_sources": {
        "britannica": {
            "name": "Encyclopaedia Britannica",
            "url": "https://www.britannica.com/topic/Bombe",
            "description": "Historical analysis of the Bombe machine and its development",
            "reliability": "Established academic reference"
        }
    },
    
    "academic_sources": {
        "101computing": {
            "name": "101 Computing",
            "url": "https://www.101computing.net/enigma-machine-emulator/",
            "description": "Technical details about Enigma's operation and mechanics",
            "reliability": "Educational resource"
        },
        "historyofinfo": {
            "name": "History of Information",
            "url": "https://www.historyofinformation.com/detail.php?id=628",
            "description": "Detailed timeline of Alan Turing and colleagues' work at Bletchley Park",
            "reliability": "Academic historical resource"
        },
        "the": {
            "name": "Times Higher Education",
            "url": "https://www.timeshighereducation.com/books/keys-codes-and-a-cracking-story/158490.article",
            "description": "Academic analysis of codebreaking history",
            "reliability": "Academic publication"
        },
        "jstor": {
            "name": "JSTOR Daily",
            "url": "https://daily.jstor.org/polish-codebreakers/",
            "description": "Academic analysis of Polish codebreaking achievements",
            "reliability": "Peer-reviewed academic platform"
        }
    },
    
    "technical_sources": {
        "nordvpn": {
            "name": "NordVPN Blog",
            "url": "https://nordvpn.com/blog/enigma-machine/",
            "description": "Technical analysis of Enigma's security and cryptanalysis",
            "reliability": "Technical publication"
        },
        "drenigma": {
            "name": "Dr. Enigma",
            "url": "https://drenigma.org",
            "description": "Technical documentation and analysis of Enigma machines",
            "reliability": "Technical resource"
        }
    }
}

# Historical timeline of key events
HISTORICAL_TIMELINE = [
    {
        "year": 1918,
        "event": "Arthur Scherbius files first Enigma patent",
        "source": "dpma"
    },
    {
        "year": 1926,
        "event": "German Navy adopts Enigma",
        "source": "dpma"
    },
    {
        "year": 1932,
        "event": "Polish mathematicians begin breaking Enigma",
        "source": "tnmoc"
    },
    {
        "year": 1939,
        "event": "Poland shares Enigma knowledge with Allies",
        "source": "jstor"
    },
    {
        "year": 1940,
        "event": "First British Bombe becomes operational",
        "source": "iwm"
    },
    {
        "year": 1941,
        "event": "Capture of U-110 and Naval Enigma breakthrough",
        "source": "edn"
    }
]

# Key historical figures
HISTORICAL_FIGURES = {
    "arthur_scherbius": {
        "name": "Arthur Scherbius",
        "role": "Inventor of the Enigma machine",
        "source": "dpma"
    },
    "marian_rejewski": {
        "name": "Marian Rejewski",
        "role": "Polish mathematician who first broke Enigma",
        "source": "tnmoc"
    },
    "alan_turing": {
        "name": "Alan Turing",
        "role": "Led Hut 8 at Bletchley Park, designed the Bombe",
        "source": "iwm"
    },
    "joan_clarke": {
        "name": "Joan Clarke",
        "role": "Cryptanalyst at Bletchley Park, worked with Alan Turing",
        "source": "cia"
    }
}

# Mapping of challenges to their sources
CHALLENGE_SOURCES = {
    1: {
        "description": "Sources for the first Enigma machine and its inventor",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["historyofinfo"]
    },
    2: {
        "description": "Sources for the commercial Enigma and plugboard development",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["historyofinfo", "the"]
    },
    3: {
        "description": "Sources for the Polish breakthrough in Enigma cryptanalysis",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor"]
    },
    4: {
        "description": "Sources for the Polish mathematical breakthrough",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor"]
    },
    5: {
        "description": "Sources for Enigma's mechanical design",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["historyofinfo"]
    },
    6: {
        "description": "Sources for Bletchley Park setup",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor"]
    },
    7: {
        "description": "Sources for Turing's Bombe development",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor"]
    },
    8: {
        "description": "Sources for breaking Naval Enigma",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor"]
    },
    9: {
        "description": "Sources for the Battle of Cape Matapan",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor"]
    },
    10: {
        "description": "Sources for the war end and Enigma's legacy",
        "primary": ["dpma"],
        "museum": ["britannica"],
        "academic": ["jstor", "the"]
    }
}

def get_source_info(source_key):
    """Helper function to retrieve source information"""
    for category in SOURCES.values():
        if source_key in category:
            return category[source_key]
    return None

def get_historical_event(year):
    """Helper function to retrieve historical events for a given year"""
    return [event for event in HISTORICAL_TIMELINE if event["year"] == year]

def get_figure_info(figure_key):
    """Helper function to retrieve information about historical figures"""
    return HISTORICAL_FIGURES.get(figure_key)

def get_challenge_sources(challenge_id):
    """Helper function to retrieve all sources for a specific challenge"""
    if challenge_id not in CHALLENGE_SOURCES:
        return None
    
    challenge_info = CHALLENGE_SOURCES[challenge_id]
    sources = {}
    
    for category, source_keys in challenge_info.items():
        if category != "description":
            sources[category] = [get_source_info(key) for key in source_keys]
    
    sources["description"] = challenge_info["description"]
    return sources

def get_source_for_challenge(challenge_id, source_type=None):
    """Helper function to retrieve specific type of sources for a challenge"""
    challenge_sources = get_challenge_sources(challenge_id)
    if not challenge_sources:
        return None
    
    if source_type:
        return challenge_sources.get(source_type, [])
    return challenge_sources 