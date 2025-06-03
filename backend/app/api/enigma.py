from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.enigma.machine import EnigmaMachine
from ..enigma.components import Plugboard
import logging
from .challenges import CHALLENGES

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
machine = EnigmaMachine()

class RotorSettings(BaseModel):
    name: str
    position: int
    ring_setting: int

class MachineSettings(BaseModel):
    rotors: List[RotorSettings]
    reflector: str
    plugboard: Dict[str, str]

class Message(BaseModel):
    text: str

class ChallengeResponse(BaseModel):
    ciphertext: str
    settings: dict
    info: str

@router.post("/settings")
async def set_settings(settings: MachineSettings):
    """Set up the Enigma machine with the provided settings."""
    try:
        logger.info(f"Received settings request: {settings}")
        
        # Clear existing configuration if rotors are empty
        if not settings.rotors:
            machine.rotors = []
            machine.reflector = None
            machine.plugboard = Plugboard()
            return {"status": "success", "settings": machine.get_current_settings()}

        # Validate rotor count
        if len(settings.rotors) != 3:
            raise HTTPException(status_code=400, detail="Exactly 3 rotors are required")

        # Set up rotors
        if not machine.set_rotors(
            rotor_names=[r.name for r in settings.rotors],
            positions=[r.position for r in settings.rotors],
            ring_settings=[r.ring_setting for r in settings.rotors]
        ):
            raise HTTPException(status_code=400, detail="Invalid rotor configuration")

        # Set up reflector
        if not machine.set_reflector(settings.reflector):
            raise HTTPException(status_code=400, detail="Invalid reflector")

        # Clear existing plugboard connections and set up new ones
        machine.plugboard = Plugboard() # Create a new, empty plugboard
        for char1, char2 in settings.plugboard.items():
            if not machine.add_plugboard_connection(char1, char2):
                # This exception should now be raised if add_connection returns False
                raise HTTPException(status_code=400, detail=f"Invalid plugboard connection: {char1}-{char2}")

        return {"status": "success", "settings": machine.get_current_settings()}
    except Exception as e:
        logger.error(f"Error in set_settings: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/encrypt")
async def encrypt_message(message: Message):
    """Encrypt a message using the current Enigma machine settings."""
    try:
        logger.info(f"Received encrypt request: {message}")
        
        # Check if machine is configured
        if not machine.rotors or not machine.reflector:
            raise HTTPException(status_code=400, detail="Enigma machine not configured")

        # Validate rotor count
        if len(machine.rotors) != 3:
            raise HTTPException(status_code=400, detail="Invalid rotor configuration")

        # Reset machine to initial state
        machine.set_rotors(
            rotor_names=[r.name for r in machine.rotors],
            positions=[r.current_position for r in machine.rotors],
            ring_settings=[r.ring_setting for r in machine.rotors]
        )

        encrypted = machine.encrypt_message(message.text)
        return {
            "encrypted": encrypted,
            "settings": machine.get_current_settings()
        }
    except Exception as e:
        logger.error(f"Error in encrypt_message: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/settings")
async def get_settings():
    """Get the current settings of the Enigma machine."""
    # Return empty settings if machine is not configured
    if not machine.rotors or not machine.reflector:
        return {
            "rotors": [],
            "reflector": None,
            "plugboard": {}
        }
    return machine.get_current_settings()

@router.get("/challenge", response_model=ChallengeResponse)
async def get_enigma_challenge():
    # Statische Challenge für Demo (Challenge 1)
    challenge = CHALLENGES[0]
    return {
        "ciphertext": challenge["ciphertext"],
        "settings": challenge["settings"],
        "info": challenge["info"]
    }
