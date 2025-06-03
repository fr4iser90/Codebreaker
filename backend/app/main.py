from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .api import enigma
import time
from collections import defaultdict
import asyncio
import os

app = FastAPI(title="Enigma Machine API")

# Rate limiting setup
RATE_LIMIT_SECONDS = 5  # Shorter time window
MAX_REQUESTS = 20      # Allow more requests (4 per second)
ip_request_times = defaultdict(list)

# Endpoints that should not be rate limited
EXCLUDED_PATHS = {
#    "/ping",
#    "/settings",
#    "/encrypt",
#    "/docs",
#    "/openapi.json"
}

async def rate_limit_middleware(request: Request, call_next):
    # Skip rate limiting for excluded paths
    if request.url.path in EXCLUDED_PATHS:
        return await call_next(request)
        
    client_ip = request.client.host
    current_time = time.time()
    
    # Clean up old requests
    ip_request_times[client_ip] = [t for t in ip_request_times[client_ip] 
                                 if current_time - t < RATE_LIMIT_SECONDS]
    
    # Check if too many requests
    if len(ip_request_times[client_ip]) >= MAX_REQUESTS:
        raise HTTPException(
            status_code=429,
            detail=f"Too many requests. Please wait {RATE_LIMIT_SECONDS} seconds between requests."
        )
    
    # Add current request
    ip_request_times[client_ip].append(current_time)
    
    # Process the request
    response = await call_next(request)
    return response

# Add rate limiting middleware
app.middleware("http")(rate_limit_middleware)

# Get allowed origins from environment variable
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
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
