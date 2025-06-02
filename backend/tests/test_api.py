from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to the Enigma Machine API" in response.json()["message"]

def test_ping():
    """Test the ping endpoint."""
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_enigma_settings():
    """Test the Enigma settings endpoint."""
    # Test getting settings before configuration
    response = client.get("/api/enigma/settings")
    assert response.status_code == 200
    
    # Test setting valid configuration
    valid_settings = {
        "rotors": [
            {"name": "I", "position": 0, "ring_setting": 0},
            {"name": "II", "position": 0, "ring_setting": 0},
            {"name": "III", "position": 0, "ring_setting": 0}
        ],
        "reflector": "B",
        "plugboard": {"A": "B", "C": "D"}
    }
    response = client.post("/api/enigma/settings", json=valid_settings)
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    
    # Test setting invalid configuration
    invalid_settings = {
        "rotors": [
            {"name": "I", "position": 0, "ring_setting": 0},
            {"name": "II", "position": 0, "ring_setting": 0}
        ],
        "reflector": "B",
        "plugboard": {}
    }
    response = client.post("/api/enigma/settings", json=invalid_settings)
    assert response.status_code == 400

def test_enigma_encryption():
    """Test the Enigma encryption endpoint."""
    # First set up the machine
    settings = {
        "rotors": [
            {"name": "I", "position": 0, "ring_setting": 0},
            {"name": "II", "position": 0, "ring_setting": 0},
            {"name": "III", "position": 0, "ring_setting": 0}
        ],
        "reflector": "B",
        "plugboard": {"A": "B", "C": "D"}
    }
    client.post("/api/enigma/settings", json=settings)
    
    # Test encryption
    message = {"text": "HELLO"}
    response = client.post("/api/enigma/encrypt", json=message)
    assert response.status_code == 200
    assert "encrypted" in response.json()
    assert len(response.json()["encrypted"]) == 5
    
    # Test encryption without configuration
    client.post("/api/enigma/settings", json={"rotors": [], "reflector": "", "plugboard": {}})
    response = client.post("/api/enigma/encrypt", json=message)
    assert response.status_code == 400

def test_enigma_roundtrip():
    """Test that encryption and decryption work correctly."""
    # Set up the machine
    settings = {
        "rotors": [
            {"name": "I", "position": 0, "ring_setting": 0},
            {"name": "II", "position": 0, "ring_setting": 0},
            {"name": "III", "position": 0, "ring_setting": 0}
        ],
        "reflector": "B",
        "plugboard": {"A": "B", "C": "D"}
    }
    client.post("/api/enigma/settings", json=settings)
    
    # Encrypt a message
    original = "HELLO WORLD"
    response = client.post("/api/enigma/encrypt", json={"text": original})
    assert response.status_code == 200
    encrypted = response.json()["encrypted"]
    
    # Reset the machine to the same settings
    client.post("/api/enigma/settings", json=settings)
    
    # Decrypt the message
    response = client.post("/api/enigma/encrypt", json={"text": encrypted})
    assert response.status_code == 200
    decrypted = response.json()["encrypted"]
    
    # The decrypted message should match the original
    assert decrypted == original 