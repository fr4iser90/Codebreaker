from typing import List, Optional
from .components import Rotor, Reflector, Plugboard, ROTOR_WIRINGS, ROTOR_NOTCHES, REFLECTOR_WIRINGS

class EnigmaMachine:
    """Main Enigma machine class that combines all components."""
    
    def __init__(self):
        self.rotors: List[Rotor] = []
        self.reflector: Optional[Reflector] = None
        self.plugboard = Plugboard()
        self._initial_positions: List[int] = []  # Store initial positions

    def set_rotors(self, rotor_names: List[str], positions: List[int], ring_settings: List[int]) -> bool:
        """Set up the rotors with their positions and ring settings."""
        if len(rotor_names) != 3 or len(positions) != 3 or len(ring_settings) != 3:
            return False

        self.rotors = []
        for name, pos, ring in zip(rotor_names, positions, ring_settings):
            if name not in ROTOR_WIRINGS:
                return False
            rotor = Rotor(
                name=name,
                wiring=ROTOR_WIRINGS[name],
                notch_positions=ROTOR_NOTCHES[name],
                current_position=pos,
                ring_setting=ring
            )
            self.rotors.append(rotor)
        
        # Store initial positions
        self._initial_positions = positions.copy()
        return True

    def set_reflector(self, reflector_name: str) -> bool:
        """Set the reflector."""
        if reflector_name not in REFLECTOR_WIRINGS:
            return False
        self.reflector = Reflector(name=reflector_name, wiring=REFLECTOR_WIRINGS[reflector_name])
        return True

    def add_plugboard_connection(self, char1: str, char2: str) -> bool:
        """Add a connection to the plugboard."""
        return self.plugboard.add_connection(char1, char2)

    def remove_plugboard_connection(self, char: str) -> bool:
        """Remove a connection from the plugboard."""
        return self.plugboard.remove_connection(char)

    def encrypt_char(self, char: str) -> str:
        """Encrypt a single character through the Enigma machine."""
        if not char.isalpha():
            return char

        # Rotate rotors
        self._rotate_rotors()

        # Pass through plugboard
        char = self.plugboard.encrypt(char)

        # Forward through rotors
        for rotor in self.rotors:
            char = rotor.encrypt_forward(char)

        # Through reflector
        if self.reflector:
            char = self.reflector.reflect(char)

        # Backward through rotors
        for rotor in reversed(self.rotors):
            char = rotor.encrypt_backward(char)

        # Back through plugboard
        char = self.plugboard.encrypt(char)

        return char

    def encrypt_message(self, message: str) -> str:
        """Encrypt a message through the Enigma machine."""
        # Reset rotors to initial positions
        for rotor, pos in zip(self.rotors, self._initial_positions):
            rotor.current_position = pos
        
        return ''.join(self.encrypt_char(c) for c in message)

    def _rotate_rotors(self):
        """Rotate the rotors according to Enigma rules."""
        # Check if second rotor is at notch position
        rotate_second = self.rotors[1].current_position in self.rotors[1].notch_positions
        # Check if third rotor is at notch position
        rotate_third = self.rotors[2].current_position in self.rotors[2].notch_positions

        # Double-stepping mechanism
        if rotate_second:
            # If second rotor is at notch, rotate first and second
            self.rotors[0].rotate()
            self.rotors[1].rotate()
            self.rotors[2].rotate()  # Also rotate third rotor
        elif rotate_third:
            # If third rotor is at notch, rotate second and third
            self.rotors[1].rotate()
            self.rotors[2].rotate()
        else:
            # Otherwise, just rotate the third rotor
            self.rotors[2].rotate()

    def get_current_settings(self) -> dict:
        """Get the current settings of the Enigma machine."""
        return {
            "rotors": [
                {
                    "name": rotor.name,
                    "position": rotor.current_position,
                    "ring_setting": rotor.ring_setting
                }
                for rotor in self.rotors
            ],
            "reflector": self.reflector.name if self.reflector else None,
            "plugboard": self.plugboard.connections
        } 