import pytest
from app.enigma.components import Rotor, Reflector, Plugboard
from app.enigma.machine import EnigmaMachine

def test_rotor_encryption():
    """Test rotor encryption in both directions."""
    rotor = Rotor(
        name="I",
        wiring="EKMFLGDQVZNTOWYHXUSPAIBRCJ",
        notch_positions=[16]
    )
    
    # Test forward encryption
    assert rotor.encrypt_forward("A") == "E"
    assert rotor.encrypt_forward("B") == "K"
    
    # Test backward encryption
    assert rotor.encrypt_backward("E") == "A"
    assert rotor.encrypt_backward("K") == "B"
    
    # Test with position offset
    rotor.current_position = 1
    assert rotor.encrypt_forward("A") == "J"

def test_rotor_rotation():
    """Test rotor rotation and notch triggering."""
    rotor = Rotor(
        name="I",
        wiring="EKMFLGDQVZNTOWYHXUSPAIBRCJ",
        notch_positions=[16]
    )
    
    # Test normal rotation
    assert rotor.current_position == 0
    assert not rotor.rotate()  # Should not trigger next rotor
    assert rotor.current_position == 1
    
    # Test notch position
    rotor.current_position = 15
    assert not rotor.rotate()  # Should not trigger next rotor
    assert rotor.current_position == 16
    assert rotor.rotate()  # Should trigger next rotor
    assert rotor.current_position == 17

def test_reflector():
    """Test reflector functionality."""
    reflector = Reflector(
        name="B",
        wiring="YRUHQSLDPXNGOKMIEBFZCWVJAT"
    )
    
    # Test reflection
    assert reflector.reflect("A") == "Y"
    assert reflector.reflect("B") == "R"
    assert reflector.reflect("Y") == "A"
    assert reflector.reflect("R") == "B"
    
    # Test non-alphabetic characters
    assert reflector.reflect("1") == "1"
    assert reflector.reflect(" ") == " "

def test_plugboard():
    """Test plugboard functionality."""
    plugboard = Plugboard()
    
    # Test adding connections
    assert plugboard.add_connection("A", "B")
    assert plugboard.add_connection("C", "D")
    assert "A" in plugboard.connections
    assert "B" in plugboard.connections
    assert "C" in plugboard.connections
    assert "D" in plugboard.connections
    
    # Test encryption through connections
    assert plugboard.encrypt("A") == "B"
    assert plugboard.encrypt("B") == "A"
    assert plugboard.encrypt("C") == "D"
    assert plugboard.encrypt("D") == "C"
    assert plugboard.encrypt("E") == "E"  # Unconnected character
    
    # Test removing connections
    assert plugboard.remove_connection("A")
    assert "A" not in plugboard.connections
    assert "B" not in plugboard.connections
    assert plugboard.encrypt("A") == "A"
    assert plugboard.encrypt("B") == "B"

def test_enigma_machine():
    """Test complete Enigma machine functionality."""
    machine = EnigmaMachine()
    
    # Set up machine with known settings
    assert machine.set_rotors(
        rotor_names=["I", "II", "III"],
        positions=[0, 0, 0],
        ring_settings=[0, 0, 0]
    )
    assert machine.set_reflector("B")
    assert machine.add_plugboard_connection("A", "B")
    
    # Test encryption
    encrypted = machine.encrypt_message("HELLO")
    assert len(encrypted) == 5
    assert encrypted.isalpha()
    
    # Test decryption (should be the same as encryption)
    decrypted = machine.encrypt_message(encrypted)
    assert decrypted == "HELLO"

def test_enigma_settings():
    """Test Enigma machine settings management."""
    machine = EnigmaMachine()
    
    # Test invalid rotor settings
    assert not machine.set_rotors(
        rotor_names=["I", "II"],  # Only 2 rotors
        positions=[0, 0, 0],
        ring_settings=[0, 0, 0]
    )
    
    # Test invalid reflector
    assert not machine.set_reflector("X")  # Invalid reflector
    
    # Test valid settings
    assert machine.set_rotors(
        rotor_names=["I", "II", "III"],
        positions=[0, 0, 0],
        ring_settings=[0, 0, 0]
    )
    assert machine.set_reflector("B")
    
    # Test plugboard connection limits
    for i in range(10):
        assert machine.add_plugboard_connection(
            chr(65 + i * 2),
            chr(66 + i * 2)
        )
    assert not machine.add_plugboard_connection("Y", "Z")  # Should fail at 11th connection

def test_enigma_rotation():
    """Test Enigma machine rotor rotation mechanism."""
    machine = EnigmaMachine()
    machine.set_rotors(
        rotor_names=["I", "II", "III"],
        positions=[0, 0, 0],
        ring_settings=[0, 0, 0]
    )
    machine.set_reflector("B")
    
    # Test initial positions
    assert machine.rotors[0].current_position == 0
    assert machine.rotors[1].current_position == 0
    assert machine.rotors[2].current_position == 0
    
    # Test single rotation
    machine.encrypt_char("A")
    assert machine.rotors[0].current_position == 0
    assert machine.rotors[1].current_position == 0
    assert machine.rotors[2].current_position == 1
    
    # Test double-stepping
    machine.rotors[1].current_position = 4  # Notch position for rotor II
    machine.encrypt_char("A")
    assert machine.rotors[0].current_position == 1
    assert machine.rotors[1].current_position == 5
    assert machine.rotors[2].current_position == 2 