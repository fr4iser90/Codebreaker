from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import enigma

app = FastAPI(title="Enigma Machine API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Enigma router at root level
app.include_router(enigma.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Enigma Machine API"}

@app.get("/ping")
async def ping():
    return {"status": "ok"}
