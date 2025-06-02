from typing import Dict, List, Optional
from dataclasses import dataclass
import string

@dataclass
class Rotor:
    """Represents an Enigma rotor with its wiring and notch positions."""
    name: str
    wiring: str  # 26-character string representing the wiring
    notch_positions: List[int]  # Positions where the rotor triggers the next rotor
    current_position: int = 0  # Current position (0-25)
    ring_setting: int = 0  # Ring setting (0-25)

    def encrypt_forward(self, char: str) -> str:
        """Encrypt a character in the forward direction."""
        if not char.isalpha():
            return char
        char = char.upper()
        # Convert character to position (0-25)
        pos = ord(char) - ord('A')
        # Apply ring setting and current position
        pos = (pos + self.current_position - self.ring_setting) % 26
        # Get encrypted character from wiring
        encrypted = self.wiring[pos]
        # Convert back to position and apply reverse offset
        pos = ord(encrypted) - ord('A')
        pos = (pos - self.current_position + self.ring_setting) % 26
        return chr(pos + ord('A'))

    def encrypt_backward(self, char: str) -> str:
        """Encrypt a character in the backward direction."""
        if not char.isalpha():
            return char
        char = char.upper()
        # Convert character to position (0-25)
        pos = ord(char) - ord('A')
        # Apply ring setting and current position
        pos = (pos + self.current_position - self.ring_setting) % 26
        # Find position in wiring
        encrypted_pos = self.wiring.index(chr(pos + ord('A')))
        # Apply reverse offset
        pos = (encrypted_pos - self.current_position + self.ring_setting) % 26
        return chr(pos + ord('A'))

    def rotate(self) -> bool:
        """Rotate the rotor and return True if the next rotor should rotate."""
        # Check if we're at a notch position before rotating
        at_notch = self.current_position in self.notch_positions
        # Rotate the rotor
        self.current_position = (self.current_position + 1) % 26
        return at_notch

@dataclass
class Reflector:
    """Represents an Enigma reflector."""
    name: str
    wiring: str  # 26-character string representing the wiring

    def reflect(self, char: str) -> str:
        """Reflect a character through the reflector."""
        if not char.isalpha():
            return char
        char = char.upper()
        pos = ord(char) - ord('A')
        return self.wiring[pos]

class Plugboard:
    """Represents the Enigma plugboard."""
    def __init__(self):
        self.connections: Dict[str, str] = {}
        self.max_connections = 10

    def add_connection(self, char1: str, char2: str) -> bool:
        """Add a connection between two characters."""
        char1, char2 = char1.upper(), char2.upper()
        if not (char1.isalpha() and char2.isalpha()):
            return False
        if char1 == char2:
            return False
        if char1 in self.connections or char2 in self.connections:
            return False
        if len(self.connections) >= self.max_connections * 2:  # Each connection uses 2 slots
            return False
        self.connections[char1] = char2
        self.connections[char2] = char1
        return True

    def remove_connection(self, char: str) -> bool:
        """Remove a connection for a character."""
        char = char.upper()
        if char not in self.connections:
            return False
        connected = self.connections[char]
        del self.connections[char]
        del self.connections[connected]
        return True

    def encrypt(self, char: str) -> str:
        """Encrypt a character through the plugboard."""
        if not char.isalpha():
            return char
        char = char.upper()
        return self.connections.get(char, char)

# Historical Enigma rotor wirings
ROTOR_WIRINGS = {
    "I": "EKMFLGDQVZNTOWYHXUSPAIBRCJ",
    "II": "AJDKSIRUXBLHWTMCQGZNPYFVOE",
    "III": "BDFHJLCPRTXVZNYEIWGAKMUSQO",
    "IV": "ESOVPZJAYQUIRHXLNFTGKDCMWB",
    "V": "VZBRGITYUPSDNHLXAWMJQOFECK"
}

# Historical notch positions
ROTOR_NOTCHES = {
    "I": [16],  # Q
    "II": [4],  # E
    "III": [21],  # V
    "IV": [9],  # J
    "V": [25]  # Z
}

# Historical Enigma reflectors
REFLECTOR_WIRINGS = {
    "A": "EJMZALYXVBWFCRQUONTSPIKHGD",
    "B": "YRUHQSLDPXNGOKMIEBFZCWVJAT",
    "C": "FVPJIAOYEDRZXWGCTKUQSBNMHL"
} 